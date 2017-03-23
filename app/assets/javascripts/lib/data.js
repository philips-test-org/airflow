if (typeof application == "undefined") { application = {} }

application.data = {
    exams: [],
    hours: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    masterExams: [],
    examHash: {},
    resources: [],
    event_table: {"exam-update": []},
    buildCalendar: function(exams) {
	application.data.exams = exams;
	application.data.resources = $.parseJSON($("#resource-groupings-json").text());
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
	application.calendar.setup();
    },

    /* Event Dispatching */
    hook: function(type,fun) {
	return application.data.event_table[type].push(fun);
    },

    dispatch: function(type,obj) {
	$.each(application.data.event_table[type],function(i,fun) {
	    fun(obj)
	});
    },

    /* Setters */
    update_attribute: function(id,attr,value) {
	application.data.update(id,function(exam) {
	    application.data.pathSet(exam,attr,value);
	    return exam;
	});
    },

    update: function(id,fun) {
	var exam = application.data.findExam(id);
	exam = fun(exam);
	application.data.dispatch("exam-update",exam);
	return exam;
    },

    addComment: function(id,comment) {
	application.data.update(id,function(exam) {
	    if (exam.comments == null || exam.comments == undefined) {
		exam.comments = []
	    }
	    exam.comments.push(comment);
	    return exam;
	});
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
	if (exam.rad_exam_time.begin_exam) {
	    return exam.rad_exam_time.begin_exam;
	} else {
	    return exam.rad_exam_time.appointment;
	}
    },
    examStopTime: function(exam) {
	if (exam.rad_exam_time.end_exam) {
	    return exam.rad_exam_time.end_exam;
	} else {
	    return appointment.data.examStartTime(exam) + (exam.procedure.scheduled_duration * 60 * 1000);
	}
    },
    findExam: function(id) {
	return application.data.examHash[id];
    }
}
