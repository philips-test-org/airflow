//= require jquery
//= require jquery_ujs
//= require jquery.scrollTo-1.4.3.1-min.js
//= require bootstrap-sprockets
//= require moment
//= require harbinger-js/core.js
//= require harbinger-js/integration.js
//= require harbinger-js/cometd/cometd.js
//= require harbinger-js/cometd/jquery.cometd.js
//= require harbinger-js/amqp-listener.js
//= require lib/handlebars-v4.0.4.js
//= require templates


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
		   {data: {id: $(this).find(".data").data("exam-id"),
			   tasks_done: $(this).find(".data").data("tasks-done")},
		    error: function() { if (console != undefined) { console.log('error in exam modal content retrieval',arguments); } },
		    success: function(response) {
			$("#exam-modal .modal-body").html(response);
		    }});
	    $("#exam-modal").modal('show');
	}
	mousedown = false;
	dragging = false;
	drag_element = null;
    });

}

setupCardDragging();

// Setting up the grid, when it's there, needs to be rewritten
// $(document).ready(function() {
//     $("#board").scroll(function(e) {
// 	var scroll = this.scrollLeft;
// 	$("#time-headings").offset({left: -1*scroll+50});
// 	$("#vertical-time-headings").css({left: scroll});
//     });

//     var now = new Date;
//     var pixes_per_second = 200 / 60 / 60;
//     var distance = Math.round(pixes_per_second * (now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds()));
//     // if ($(".vertical-timeline").length > 0) {
// 	$("#right-now").css({top: 91 + distance}).show();
// 	$("#right-now").css({width: $("#time-grid").width()});
// 	$("#board").scrollTo({top: ($("#right-now").position().top - ($("#board").height()/2)), left: 0},500);
//     // } else if ($(".horizontal-timeline").length > 0) {
//     // 	$("#right-now").css({left: 41 + distance}).show();
//     // 	$("#right-now").css({height: $("#time-grid").height() - 32});
//     // 	$("#board").scrollTo({left: ($("#right-now").position().left - ($("#board").width()/2)), top: 0},500);
//     // }

//     $(".notecard").hover(
// 	function(e) { console.log('hover in',this); $(this).css({'z-index': 200}); },
// 	function(e) { console.log('hover out',this); $(this).css({'z-index': 101}); });

// });
