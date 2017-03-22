if (typeof application == "undefined") { application = {} }

application.data = {
    exams: [],
    hours: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    masterExams: [],
    resources: [],
    buildCalendar: function(exams) {
	application.data.exams = exams;
	application.data.resources = $.parseJSON($("#resource-groupings-json").text());
	var masterExamIds = [];
	for (var i in application.data.exams) {
	    var exam = exams[i];
	    var exam_group_ident = exam.patient_mrn_id + exam.resource_id + application.data.examStartTime(exam);
	    if (masterExamIds.indexOf(exam_group_ident) == -1) {
		application.data.masterExams.push(exam);
		masterExamIds.push(exam_group_ident);
	    }
	}
	application.calendar.setup();
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
    }
}
