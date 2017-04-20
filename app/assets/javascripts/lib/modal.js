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
    }
};

$(document).ready(function(e) {
    application.data.hook("modal-update","modal-redraw",function(exam) {
	application.modal.redrawStatus(exam);
    });

    application.data.hook("event-submit","event-list-redraw",function(exam) {
	if ($("#exam-modal .data").text() == String(exam.id)) {
	    $("#exam-modal .events").replaceWith(application.templates.eventList(exam));
	}
    });

    $("#workspace").on("click",".notecard",function(e) {
	var exam = application.data.findExam($(this).find(".data").data("exam-id"));
	application.modal.open(exam);
    });


    $("#exam-modal").on("change",".status-toggle input",function(e) {
	var exam_id = $(this).parents(".modal-content").find(".data").text();
	//application.data.updateAttribute(exam_id,$(this).attr('name'),this.checked,["modal-update","exam-update"]);
	var event = {
	    id: null, //needs to become an internal id
	    employee: application.employee,
	    event_type: $(this).attr('name'),
	    new_state: this.checked,
	    comments: null,
	    created_at: moment().unix()*1000,
	    exam_id: exam_id
	}

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
