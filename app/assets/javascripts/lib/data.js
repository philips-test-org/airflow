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
    //startDate: moment().startOf('day').unix()*1000, // This will need to be adjusted by time selector interface
    hours: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    //masterExams: [], // A copy of all the selected master exam ids only
    //examGroups: {}, // A hash of group ident to list of exam ids
    //examHash: {}, // A hash by exam.id of the exams
    rollbackExamHash: {}, // A hash by exam.id to store pre-commit exam info for rollback
    rollbackOrderHash: {}, // A hash by exam.id to store pre-commit exam info for rollback
    rollbackMutexes: {}, // A place to store the mutexes by rollbackSerial id
    eventsSerial: 1, // A serial to help identify uncommitted events
    //resources: [],
    //resourceHash: {},
    //resourceGroups: {},
    // Master list of all the events and initialization of their objects
    event_table: {"order-update": {},
		  "modal-update": {},
		  "order-commit": {},
		  "order-rollback": {},
		  "event-submit": {}},
    formatOrders: function(orders) {
	// Clear data
	var value = $("#time-button").data("value");
        if ( typeof value == "undefined"  ){
            value = moment().unix();
        }

        application.data.startDate = moment(value * 1000).startOf('day').unix()*1000; // This will need to be adjusted by time selector interface

	// application.data.masterExams = []; // A copy of all the selected master exam ids only
	// application.data.examGroups = {}; // A hash of group ident to list of exam ids
	// application.data.examHash = {}; // A hash by exam.id of the exams
	application.data.masterOrders = []; // A copy of all the selected master order ids only
	application.data.ignored = []; // A list for orders that have a resource that isn't in the current view
	application.data.orderGroups = {}; // A hash of group ident to list of order ids
	application.data.orderHash = {}; // A hash by order.id of the orders
	application.data.resources = [];
	application.data.resourceHash = {};
	application.data.resourceGroups = {};

	// Parse and store resource and resource group information
	application.data.resourceGroups = $.parseJSON($("#resource-groupings-json").text());
	application.data.resources = application.data.resourceGroups[$("#resource-group-buttons button").data("value")];
	for (var i in application.data.resources) {
	    application.data.resourceHash[application.data.resources[i].id] = application.data.resources[i];
	}

	// store exams, grouping information, and master exam ids
	for (var i in orders) {
	    var order = orders[i];
	    application.data.insert(order);
	}
    },

    // insert: function(exam) {
    // 	exam.group_ident = application.data.examGroupIdent(exam);
    // 	application.data.examHash[exam.id] = exam;
    // 	if (application.data.examGroups[exam.group_ident] == undefined) {
    // 	    application.data.examGroups[exam.group_ident] = [exam.id];
    // 	    application.data.masterExams.push(exam.id);
    // 	} else {
    // 	    application.data.examGroups[exam.group_ident].push(exam.id);
    // 	}
    // },

    insert: function(order) {
	if (application.data.resource(order) != undefined) {
	    order.group_ident = application.data.orderGroupIdent(order);
	    application.data.orderHash[order.id] = order;
	    if (application.data.orderGroups[order.group_ident] == undefined) {
		application.data.orderGroups[order.group_ident] = [order.id];
		application.data.masterOrders.push(order.id);
	    } else {
		application.data.orderGroups[order.group_ident].push(order.id);
	    }
	} else {
	    application.data.ignored.push(order);
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
	var order = application.data.findOrder(id);
	//Set up a rollback identifier and deep copy the existing exams
	var rollback_id = id;
	var rollback_mutex = application.data.rollbackMutexes[rollback_id] = application.mutex.create();

        // Make a deep copy of the order so that if the update fails
        // the original order object won't have been changed
        // this acts as an error handling rollback as the actual rollbacks
        // must be called by the update function as it is the thing that knows
        // when a change has been saved to the server
        // Setting of the new order into the orderHash is also handled
        // by the updating function otherwise the calls to the mutex
        // happen out of order and things get weird
        var rollback_copy = $.extend(true,{},order);
        if (application.data.rollbackOrderHash[rollback_id] == undefined) {
            application.data.rollbackOrderHash[rollback_id] = [];
        }
        application.data.rollbackOrderHash[rollback_id].push(rollback_copy);

        // Call the update function with the given rollback id which will
        // supply the location of the mutex and the rollback information
        //console.log(application.data.rollbackOrderHash);
        //console.log("Before fun run",e.adjusted,rollback_copy.adjusted);
        rollback_mutex.sync(function() { fun(order,rollback_id); });
        //console.log("After fun run",e.adjusted,rollback_copy.adjusted);

	//Get the master order now that it's been cloned and changed
	var order = application.data.findOrder(id);

	//Fire Default Event
	if (events != undefined) {
	    $.each(events,function(i,etype) { application.data.dispatch(etype,order); });
	} else {
	    application.data.dispatch("order-update",order);
	}
	return [order];
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
    commit: function(order,rollback_id) {
	//console.log('commit',exam,rollback_id);
	delete application.data.rollbackOrderHash[rollback_id];
	application.data.dispatch("order-commit",order);
    },

    rollback: function(order,rollback_id,message) {
	//console.log('rollback',order,rollback_id,application.data.rollbackOrderHash[rollback_id]);
	// Reset order to rollback values
	var master = null;
	$.each(application.data.rollbackOrderHash[rollback_id],function(i,e) {
	    //console.log('rollback',order.id,e.id);
	    if (e.id == order.id) { master = e }
	    application.data.orderHash[e.id] = e;
	});
	// Clear rollback values
	delete application.data.rollbackOrderHash[rollback_id];
	//console.log("order-rollback",order,master);
	application.data.dispatch("order-rollback",order,master);
	// Might want to find a better place for this but it's pretty universal right now
	application.notification.flash({type: 'alert', message: message});
    },

    addEvent: function(id,event,events) {
	application.data.update(id,function(order,rollback_id) {
	    if (event.event_type != 'comment') {
		// Update status type with new state (consent, etc)
		$.extend(order.adjusted,event.new_state);
	    }
	    order.events.push(event);
	    var data = {
		id: order.id,
		event: event
	    }
	    $.ajax($.harbingerjs.core.url("/events/add"),
		   {data: JSON.stringify(data),
		    method: 'POST',
		    contentType: "application/json; charset=utf-8",
		    dataType: "json",
		    success: function(response) {
			application.data.rollbackMutexes[rollback_id].sync(function() { application.data.commit(order,rollback_id); });
		    },
		    error: function() {
			application.data.rollbackMutexes[rollback_id].sync(function() { application.data.rollback(order,rollback_id,"Failed to save changes. Reverted to previous values.") });
		    }
		   });
	    return order;
	},events);
    },

    updateLocation: function(order_id,resource_id,top) {
	// Contains no side effects, those are handled in the addEvent/update functions
	var order = application.data.findOrder(order_id);
	var ostart = application.data.orderStartTime(order);
	var ostop = application.data.orderStopTime(order);
	var nstart = application.data.orderHeightToStartTime(top,order);
	var nstop =  application.data.orderHeightToStopTime(top,order);
	    /*order.adjusted.start_time = nstart;
	    order.adjusted.stop_time = nstop;
	    order.adjusted.resource_id = resource_id,
	    application.data.orderHash[order_id] = order;*/
	var event = {
	    event_type: 'location_update',
	    employee: application.employee,
	    new_state: {
		start_time: nstart,
		stop_time: nstop,
		resource_id: resource_id
	    },
	    created_at: moment().unix()*1000,
	    order_id: order_id
	}
	return application.data.addEvent(order_id,event,["order-update"]);
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
	if (exam.rad_exam_time == undefined) { return null; }
	if (exam.rad_exam_time.begin_exam) {
    	    return exam.rad_exam_time.begin_exam;
    	} else {
    	    return exam.rad_exam_time.appointment;
    	}
    },

    orderStartTime: function(order) {
	if (order.adjusted != undefined && order.adjusted.start_time) {
	    var st = order.adjusted.start_time;
	} else if (order.rad_exam) {
	    var st = application.data.examStartTime(order.rad_exam)
	} else {
	    var st = order.appointment;
	}
	if (st < application.data.startDate) { st = application.data.startDate; }
	return st;
    },

    // examStopTime: function(exam) {
    // 	if (exam.adjusted.stop_time) {
    // 	    return exam.adjusted.stop_time;
    // 	} else if (exam.rad_exam_time.end_exam) {
    // 	    return exam.rad_exam_time.end_exam;
    // 	} else {
    // 	    return application.data.examStartTime(exam) + (exam.procedure.scheduled_duration * 60 * 1000);
    // 	}
    // },

    orderStopTime: function(order) {
	if (order.adjusted != undefined && order.adjusted.stop_time) {
	    return order.adjusted.stop_time;
	} else if (order.rad_exam != undefined && order.rad_exam.rad_exam_time.end_exam) {
	    return order.rad_exam.rad_exam_time.end_exam;
	} else if ($.type(order.appointment_duration) == "number") {
	    return application.data.orderStartTime(order) + (order.appointment_duration * 1000);
	} else if (order.rad_exam != undefined) {
	    return application.data.orderStartTime(order) + (order.rad_exam.procedure.scheduled_duration * 60 * 1000);
	} else {
	    return application.data.orderStartTime(order) + (order.procedure.scheduled_duration * 60 * 1000);
	}
    },

    orderHeightToStartTime: function(height,order) {
	var startTime = application.data.startDate + (height/application.templates.pixels_per_second*1000);
	return startTime;
    },

    orderHeightToStopTime: function(height,order) {
	var duration = application.data.orderStopTime(order) - application.data.orderStartTime(order);
	return application.data.orderHeightToStartTime(height,order) + duration;
    },

    resource: function(order) {
	if (order.adjusted != undefined && order.adjusted.resource_id != undefined) {
	    return application.data.findResource(order.adjusted.resource_id);
	} else if (order.rad_exam != undefined) {
	    return application.data.findResource(order.rad_exam.resource_id);
	} else {
	    return order.resource;
	}
    },

    examThenOrder: function(order,path) {
	if (order.rad_exam != undefined) {
	    return application.data.pathGet(order.rad_exam,path);
	} else {
	    return application.data.pathGet(order,path);
	}
    },

    orderGroupStartTime: function(order) {
	if (order.rad_exam) {
	    return application.data.examStartTime(order.rad_exam)
	} else {
	    return order.appointment;
	}
    },

    // This function shouldn't be called outside of formatOrders
    // which will set a group_ident key on the exam to prevent
    // the exam group identifier from changing based on user adjustments
    orderGroupIdent: function(order) {
	return order.patient_mrn_id + application.data.resource(order).id + application.data.orderGroupStartTime(order);
    },

    findOrder: function(id) {
	return application.data.orderHash[id];
    },

    findOrderWithFellows: function(id) {
	var master = application.data.findOrder(id);
	var egi = master.group_ident;
	return $.map(application.data.orderGroups[egi],
		     function(eid) { return application.data.orderHash[eid]; }).sort(function(a,b) {
			 if (a.order_number < b.order_number) return -1;
			 else if (a.order_number >= b.order_number) return 1;
			 else return 0; });
    },

    findResource: function(id) {
	return application.data.resourceHash[id];
    },

    allEvents: function(id) {
	var orders = application.data.findOrderWithFellows(id);
	var events = [];
	$.each(orders,function(i,o) { events = events.concat(o.events); });
	return events.sort(function(a,b) {
	    if (a.created_at < b.created_at) return 1;
	    else if (b.created_at < a.created_at) return -1;
	    else return 0;
	});
    }

}
