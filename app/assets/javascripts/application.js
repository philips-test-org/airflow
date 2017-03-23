//= require jquery
//= require jquery_ujs
//= require jquery.scrollTo-1.4.3.1-min.js
//= require bootstrap-sprockets
//= require lib/bootstrap-toggle.min.js
//= require moment
//= require harbinger-js/core.js
//= require harbinger-js/integration.js
//= require harbinger-js/cometd/cometd.js
//= require harbinger-js/cometd/jquery.cometd.js
//= require harbinger-js/amqp-listener.js
//= require lib/handlebars-v4.0.4.js
//= require lib/data
//= require lib/templates
//= require lib/modal


function setupCardDragging() {
    var mousedown = false;
    var dragging = false;
    var drag_element = null;
    var downtime = null;

    $(document).on("mousedown",".notecard",function(e) {
	mousedown = true;
	dragging = false;
	drag_element = this;
	downtime = new Date().getTime();
    });

    $(document).on("mousemove",".notecard",function(e) {
	if (mousedown && downtime != null && (new Date().getTime() - downtime) > 200) {
	    dragging = true;
	    $(drag_element).addClass("drag-rotate");
	}
    });

    $(document).on("mouseup",".notecard",function(e) {
	if (dragging) { // It's a drag
	    $(drag_element).removeClass("drag-rotate");
	} else { // It's a click
	    // $.ajax($.harbingerjs.core.url("/exam"),
	    // 	   {data: {id: $(this).find(".data").data("exam-id")},
	    // 	    error: function() { if (console != undefined) { console.log('error in exam modal content retrieval',arguments); } },
	    // 	    beforeSend: function() {
	    // 		$("#exam-modal .modal-content").html(application.templates.modalCardLoading());
	    // 	    },
	    // 	    success: function(exam) {
	    // 		$("#exam-modal .modal-content").html(application.templates.modalCard(exam));
	    // 		$("#exam-modal [data-toggle='toggle']").bootstrapToggle();
	    // 	    }});
	    var exam = application.data.findExam($(this).find(".data").data("exam-id"));
	    application.modal.open(exam);
	}
	mousedown = false;
	dragging = false;
	drag_element = null;
	downtime = null;
    });

}

setupCardDragging();
