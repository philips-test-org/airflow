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
