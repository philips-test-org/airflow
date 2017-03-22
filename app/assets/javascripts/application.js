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


function setupCardDragging() {
    var mousedown = false;
    var dragging = false;
    var drag_element = null;

    $(document).on("mousedown",".notecard",function(e) {
	mousedown = true;
	dragging = false;
	drag_element = this;
    });

    $(document).on("mousemove",".notecard",function(e) {
	if (mousedown) {
	    dragging = true;
	    $(drag_element).addClass("drag-rotate");
	}
    });

    $(document).on("mouseup",".notecard",function(e) {
	if (dragging) { // It's a drag
	    $(drag_element).removeClass("drag-rotate");
	} else { // It's a click
	    $.ajax($.harbingerjs.core.url("/exam"),
		   {data: {id: $(this).find(".data").data("exam-id")},
		    error: function() { if (console != undefined) { console.log('error in exam modal content retrieval',arguments); } },
		    beforeSend: function() {
			$("#exam-modal .modal-content").html(application.templates.modalCardLoading());
		    },
		    success: function(exam) {
			$("#exam-modal .modal-content").html(application.templates.modalCard(exam));
			$("#exam-modal [data-toggle='toggle']").bootstrapToggle();
		    }});
	    $("#exam-modal").modal('show');
	}
	mousedown = false;
	dragging = false;
	drag_element = null;
	downtime = null;
    });

}

setupCardDragging();
