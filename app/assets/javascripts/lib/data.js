if (typeof application == "undefined") { application = {} }

application.data = {
    startDate: moment().startOf('day').unix()*1000, // This will need to be adjusted by time selector interface
    exams: [],
    hours: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    masterExams: [],
    examHash: {},
    resources: [],
    resourceHash: {},
    event_table: {"exam-update": {},
		  "modal-update": {}},
    formatExams: function(exams) {
	application.data.exams = exams;
	application.data.resources = $.parseJSON($("#resource-groupings-json").text());
	for (var i in application.data.resources) {
	    application.data.resourceHash[application.data.resources[i].id] = application.data.resources[i];
	}
	var masterExamIds = [];
	for (var i in application.data.exams) {
	    var exam = exams[i];
	    application.data.examHash[exam.id] = exam;
	    var exam_group_ident = exam.patient_mrn_id + exam.resource_id + application.data.examStartTime(exam);
	    if (masterExamIds.indexOf(exam_group_ident) == -1) {
		application.data.masterExams.push(exam);
		masterExamIds.push(exam_group_ident);
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

    dispatch: function(type,obj) {
	$.each(application.data.event_table[type],function(name,fun) {
	    fun(obj)
	});
    },

    /* Setters */
    update_attribute: function(id,attr,value,events) {
	application.data.update(id,function(exam) {
	    application.data.pathSet(exam,attr,value);
	    return exam;
	},events);
    },

    update: function(id,fun,events) {
	if (events != undefined && $.type(events) != "array") { throw("Event list must be an array of strings"); }
	var exam = application.data.findExam(id);
	exam = fun(exam);
	//Fire Default Event
	if (events != undefined) {
	    $.each(events,function(i,etype) { application.data.dispatch(etype,exam); });
	} else {
	    application.data.dispatch("exam-update",exam);
	}
	return exam;
    },

    addComment: function(id,comment,events) {
	application.data.update(id,function(exam) {
	    if (exam.comments == null || exam.comments == undefined) {
		exam.comments = []
	    }
	    exam.comments.push(comment);
	    return exam;
	},events);
    },

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
	if (exam.adjusted_start_time) {
	    return exam.adjusted_start_time;
	} else if (exam.rad_exam_time.begin_exam) {
	    return exam.rad_exam_time.begin_exam;
	} else {
	    return exam.rad_exam_time.appointment;
	}
    },
    examStopTime: function(exam) {
	if (exam.adjusted_stop_time) {
	    return exam.adjusted_stop_time;
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

    findExam: function(id) {
	return application.data.examHash[id];
    },

    findResource: function(id) {
	return application.data.resourceHash[id];
    }
}
