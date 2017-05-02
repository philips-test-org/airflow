if (typeof application == "undefined") { application = {} }

application.mutex = {
    create: function() {
	return {
	    _queue: [],
	    _running: null,
	    sync: function(fun) {
		if (this._queue.length == 0) {
		    this._running = fun;
		    this._start(fun);
		} else {
		    _queue.push(fun);
		}
		return this;
	    },
	    _start: function(fun) {
		fun();
		return this;
	    },
	    _next: function() {
		if (this._queue.length == 0) { return this; }
		else { this.start(this._queue.shift()); return this; }
	    }
	}
    }
};

application.data = {
    // Design Goals:
    //   -Provide only one source of the object hash that is the exam information
    //    to prevent needing to change the object in multiple locations or experiencing
    //    weird side effects when changing it in only one location
    //   -Provide identifier only data structures for capturing meta information that is
    //    needed to access exams quickly
    //   -Provide an update methodology that persists changes to the serverside and rolls back
    //    user changes on error
    startDate: moment().startOf('day').unix()*1000, // This will need to be adjusted by time selector interface
    hours: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    masterExams: [], // A copy of all the selected master exam ids only
    examGroups: {}, // A hash of group ident to list of exam ids
    examHash: {}, // A hash by exam.id of the exams
    rollbackExamHash: {}, // A hash by exam.id to store pre-commit exam info for rollback
    rollbackMutexes: {}, // A place to store the mutexes by rollbackSerial id
    eventsSerial: 1, // A serial to help identify uncommitted events
    resources: [],
    resourceHash: {},
    resourceGroups: {},
    // Master list of all the events and initialization of their objects
    event_table: {"exam-update": {},
		  "modal-update": {},
		  "exam-commit": {},
		  "exam-rollback": {},
		  "event-submit": {}},
    formatExams: function(exams) {
	// Parse and store resource and resource group information
	application.data.resourceGroups = $.parseJSON($("#resource-groupings-json").text());
	application.data.resources = application.data.resourceGroups[$("#resource-group-buttons button").data("value")];
	for (var i in application.data.resources) {
	    application.data.resourceHash[application.data.resources[i].id] = application.data.resources[i];
	}

	// store exams, grouping information, and master exam ids
	for (var i in exams) {
	    var exam = exams[i];
	    exam.group_ident = application.data.examGroupIdent(exam);
	    application.data.examHash[exam.id] = exam;
	    if (application.data.examGroups[exam.group_ident] == undefined) {
		application.data.examGroups[exam.group_ident] = [exam.id];
		application.data.masterExams.push(exam.id);
	    } else {
		application.data.examGroups[exam.group_ident].push(exam.id);
	    }
	}
    },

    /* Event Dispatching */
    hook: function(type,name,fun) {
	return application.data.event_table[type][name] = fun;
    },

    unhook: function(type,name) {
	return delete application.data.event_table[type][name];
    },

    dispatch: function(type) {
	var args = Array.prototype.slice.call(arguments).slice(1);
	$.each(application.data.event_table[type],function(name,fun) {
	    fun.apply(this,args);
	});
    },

    /* Setters */

    // There remains a race condition around making a change and having a different
    // change happen before the error and subsequent rollback of the other change.
    // I'll need to implement object locking and likely a merge mechanism to fix this
    // but it's a fairly unlikely scenario so I am pushing it out
    update: function(id,fun,events) {
	if (events != undefined && $.type(events) != "array") { throw("Event list must be an array of strings"); }
	//Find all exams associated with the master id given
	var exams = application.data.findExamWithFellows(id);
	//Set up a rollback identifier and deep copy the existing exams
	var rollback_id = id;
	var rollback_mutex = application.data.rollbackMutexes[rollback_id] = application.mutex.create();
	$.each(exams,function(i,e) {
	    // Make a deep copy of the exam so that if the update fails
	    // the original exam object won't have been changed
	    // this acts as an error handling rollback as the actual rollbacks
	    // must be called by the update function as it is the thing that knows
	    // when a change has been saved to the server
	    // Setting of the new exam into the examHash is also handled
	    // by the updating function otherwise the calls to the mutex
	    // happen out of order and things get weird
	    var rollback_copy = $.extend(true,{},e);
	    if (application.data.rollbackExamHash[rollback_id] == undefined) {
		application.data.rollbackExamHash[rollback_id] = [];
	    }
	    application.data.rollbackExamHash[rollback_id].push(rollback_copy);

	    // Call the update function with the given rollback id which will
	    // supply the location of the mutex and the rollback information
	    //console.log(application.data.rollbackExamHash);
	    //console.log("Before fun run",e.adjusted,rollback_copy.adjusted);
	    rollback_mutex.sync(function() { fun(e,rollback_id); });
	    //console.log("After fun run",e.adjusted,rollback_copy.adjusted);
	});

	//Get the master exam now that it's been cloned and changed
	var exam = application.data.findExam(id);

	//Fire Default Event
	if (events != undefined) {
	    $.each(events,function(i,etype) { application.data.dispatch(etype,exam); });
	} else {
	    application.data.dispatch("exam-update",exam);
	}
	return exams;
    },

    //Unused!
    // I've decided not to clear the mutexes
    // There is no major performance/memory problem with keeping them around
    // but to clear them might introduce strange race conditions especially
    // when real time messaging gets added to the mix
    /*clearMutex: function(rollback_id) {
	if (application.data.rollbackMutexes[rollback_id]._queue.length == 0) {
	    delete application.data.rollbackMutexes[rollback_id];
	}
    }*/

    // Clean rollback information:
    // This commit message should be in the error callback
    // for ajax calls to save data
    commit: function(exam,rollback_id) {
	//console.log('commit',exam,rollback_id);
	delete application.data.rollbackExamHash[rollback_id];
	application.data.dispatch("exam-commit",exam);
    },

    rollback: function(exam,rollback_id,message) {
	//console.log('rollback',exam,rollback_id,application.data.rollbackExamHash[rollback_id]);
	// Reset exam to rollback values
	var master = null;
	$.each(application.data.rollbackExamHash[rollback_id],function(i,e) {
	    //console.log('rollback',exam.id,e.id);
	    if (e.id == exam.id) { master = e }
	    application.data.examHash[e.id] = e;
	});
	// Clear rollback values
	delete application.data.rollbackExamHash[rollback_id];
	//console.log("exam-rollback",exam,master);
	application.data.dispatch("exam-rollback",exam,master);
    },

    addEvent: function(id,event,events) {
	application.data.update(id,function(exam,rollback_id) {
	    if (event.event_type != 'comment') {
		// Update status type with new state (consent, etc)
		$.extend(exam.adjusted,event.new_state);
	    }
	    exam.events.push(event);
	    var data = {
		id: id,
		event: event
	    }
	    $.ajax($.harbingerjs.core.url("/events/add"),
		   {data: JSON.stringify(data),
		    method: 'POST',
		    contentType: "application/json; charset=utf-8",
		    dataType: "json",
		    success: function(response) {
			application.data.rollbackMutexes[rollback_id].sync(function() { application.data.commit(exam,rollback_id); });
		    },
		    error: function() {
			application.data.rollbackMutexes[rollback_id].sync(function() { application.data.rollback(exam,rollback_id,"Failed to save changes. Reverting to previous values.") });
		    }
		   });
	    return exam;
	},events);
    },

    updateLocation: function(exam_id,resource_id,top) {
	// Contains no side effects, those are handled in the addEvent/update functions
	var exam = application.data.findExam(exam_id);
	var ostart = application.data.examStartTime(exam);
	var ostop = application.data.examStopTime(exam);
	var nstart = application.data.examHeightToStartTime(top,exam);
	var nstop =  application.data.examHeightToStopTime(top,exam);
	    /*exam.adjusted.start_time = nstart;
	    exam.adjusted.stop_time = nstop;
	    exam.adjusted.resource_id = resource_id,
	    application.data.examHash[exam_id] = exam;*/
	var event = {
	    event_type: 'location_update',
	    employee: application.employee,
	    new_state: {
		start_time: nstart,
		stop_time: nstop,
		resource_id: resource_id
	    }
	}
	return application.data.addEvent(exam_id,event,["exam-update"]);
    },

    // updateAttribute: function(id,attr,value,events) {
    // 	application.data.update(id,function(exam,rollback_id) {
    // 	    application.data.pathSet(exam,attr,value);
    // 	    $.ajax($.harbingerjs.core.url("/exam/update/location"),
    // 		   {data: JSON.stringify(exam),
    // 		    method: 'POST',
    // 		    contentType: "application/json; charset=utf-8",
    // 		    dataType: "json",
    // 		    success: function(response) {
    // 			application.data.rollbackMutexes[rollback_id].sync(function() { application.data.commit(exam,rollback_id); });
    // 		    },
    // 		    error: function() {
    // 			application.data.rollbackMutexes[rollback_id].sync(function() { application.data.rollback(exam,rollback_id,"bad news bears") });
    // 		    }
    // 		   });
    // 	    return exam;
    // 	},events);
    // },


    pathSet: function(obj,path,val) {
	path_array = path.split(".");
	if (path_array.length == 1) {
	    return obj[path] = val;
	} else {
	    return application.data.pathSet(obj[path_array[0]],path_array.splice(1,path_array.length).join("."),val);
	}
    },

    /* Read Helpers */
    pathGet: function(obj,path) {
	path_array = path.split(".");
	if (path_array.length == 1) {
	    return obj[path];
	} else {
	    return application.data.pathGet(obj[path_array[0]],path_array.splice(1,path_array.length).join("."));
	}
    },

    examStartTime: function(exam) {
	if (exam.adjusted.start_time) {
	    return exam.adjusted.start_time;
	} else if (exam.rad_exam_time.begin_exam) {
	    return exam.rad_exam_time.begin_exam;
	} else {
	    return exam.rad_exam_time.appointment;
	}
    },
    examStopTime: function(exam) {
	if (exam.adjusted.stop_time) {
	    return exam.adjusted.stop_time;
	} else if (exam.rad_exam_time.end_exam) {
	    return exam.rad_exam_time.end_exam;
	} else {
	    return appointment.data.examStartTime(exam) + (exam.procedure.scheduled_duration * 60 * 1000);
	}
    },

    examHeightToStartTime: function(height,exam) {
	var startTime = application.data.startDate + (height/application.templates.pixels_per_second*1000);
	return startTime;
    },

    examHeightToStopTime: function(height,exam) {
	var duration = application.data.examStopTime(exam) - application.data.examStartTime(exam);
	return application.data.examHeightToStartTime(height,exam) + duration;
    },

    resource: function(exam) {
	if (exam.adjusted.resource_id != undefined) {
	    return application.data.findResource(exam.adjusted.resource_id);
	} else {
	    return exam.resource;
	}
    },

    // This function shouldn't be called outside of formatExams
    // which will set a group_ident key on the exam to prevent
    // the exam group identifier from changing based on user adjustments
    examGroupIdent: function(exam) {
	return exam.patient_mrn_id + exam.resource_id + application.data.examStartTime(exam);
    },

    findExam: function(id) {
	return application.data.examHash[id];
    },

    findExamWithFellows: function(id) {
	var master = application.data.findExam(id);
	var egi = master.group_ident;
	return $.map(application.data.examGroups[egi],function(eid) { return application.data.examHash[eid]; });
    },

    findResource: function(id) {
	return application.data.resourceHash[id];
    }
}
