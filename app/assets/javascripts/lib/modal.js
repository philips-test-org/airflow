if (typeof application == "undefined") { application = {} }

application.modal = {
    open: function(exam) {
	application.modal.redraw(exam);
	$("#exam-modal").modal('show');
    },

    redraw: function(exam) {
	$("#exam-modal .modal-content").html(application.templates.modalCard(exam));
	$("#exam-modal [data-toggle='toggle']").bootstrapToggle();
    },

    redrawStatus: function(exam) {
	$("#exam-modal .modal-content .left-stripe").replaceWith(application.templates.modalCardStatus(exam));
	$("#exam-modal .modal-content .status-toggles").replaceWith(application.templates.statusToggles(exam));
	$("#exam-modal .events").replaceWith(application.templates.eventList(exam));
	$("#exam-modal [data-toggle='toggle']").bootstrapToggle();
    },

    checkEvent: function(exam) {
	return $("#exam-modal .data").text() == String(exam.id);
    }

};

$(document).ready(function(e) {
    application.data.hook("modal-update","modal-redraw",function(exam) {
	if (application.modal.checkEvent(exam)) {
	    application.modal.redrawStatus(exam);
	}
    });

    application.data.hook("event-submit","event-list-redraw",function(exam) {
	if (application.modal.checkEvent(exam)) {
	    $("#exam-modal .events").replaceWith(application.templates.eventList(exam));
	}
    });

    application.data.hook("exam-rollback","event-list-redraw-rollback",function(exam,rollback_exam) {
	if (application.modal.checkEvent(rollback_exam)) {
	    application.modal.redraw(rollback_exam);
	}
    });

    $("#workspace").on("click",".notecard",function(e) {
	var exam = application.data.findExam($(this).find(".data").data("exam-id"));
	application.modal.open(exam);
    });


    $("#exam-modal").on("change",".status-toggle input",function(e) {
	var exam_id = $(this).parents(".modal-content").find(".data").text();
	//application.data.updateAttribute(exam_id,$(this).attr('name'),this.checked,["modal-update","exam-update"]);
	var name = $(this).attr('name');
	var event = {
	    id: null, //needs to become an internal id
	    employee: application.employee,
	    event_type: name,
	    comments: null,
	    new_state: {},
	    created_at: moment().unix()*1000,
	    exam_id: exam_id
	}
	event.new_state[name] = this.checked;

	application.data.addEvent(exam_id,event,["event-submit","modal-update","exam-update"])
    });

    $("#exam-modal").on("submit","#comment-form",function(e) {
	e.preventDefault();
	var self = $(this);
	var button = self.find("button.add-comment");
	var textarea = self.find("textarea");
	var exam_id = self.find("input[name='exam_id']").val();

	var event = {
	    id: null, //needs to become an internal id
	    employee: application.employee,
	    event_type: 'comment',
	    comments: textarea.val(),
	    new_state: {},
	    created_at: moment().unix()*1000,
	    exam_id: exam_id
	}

	application.data.addEvent(exam_id,event,["event-submit","exam-update"])
	textarea.val("");

	// $.ajax($.harbingerjs.core.url("/comments/create"),
	//        {data: $(this).serializeArray(),
	// 	method: 'POST',
	// 	beforeSend: function() {
	// 	    button.prop("disabled",true);
	// 	    textarea.prop("disabled",true);
	// 	},
	// 	error: function() {
	// 	    if (console) { console.log("Error saving comment",arguments); }
	// 	},
	// 	success: function(exam_comment) {
	// 	    self.siblings(".comments").append(application.templates.comment(exam_comment));
	// 	    application.data.addComment(exam_id,exam_comment);
	// 	    textarea.val("");
	// 	}}).always(function() {
	// 	    button.prop("disabled",false);
	// 	    textarea.prop("disabled",false);
	// 	});

    });

});
