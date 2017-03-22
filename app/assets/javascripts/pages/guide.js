if (typeof application == "undefined") { application = {} }

application.calendar = {
    setup: function() {
	$("#workspace").html(application.templates.calendar(application.data));
	$("#board").scroll(function(e) {
	    var scroll = this.scrollLeft;
	    $("#time-headings").offset({left: -1*scroll+50});
	    $("#vertical-time-headings").css({left: scroll});
	});

	var now = new Date;
	var pixes_per_second = 200 / 60 / 60;
	var distance = Math.round(pixes_per_second * (now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds()));

	$("#right-now").css({top: 91 + distance}).show();
	$("#right-now").css({width: $("#time-grid").width()});
	$("#board").scrollTo({top: ($("#right-now").position().top - ($("#board").height()/2)), left: 0},500);

	$(".notecard").hover(
	    function(e) { console.log('hover in',this); $(this).css({'z-index': 200}); },
	    function(e) { console.log('hover out',this); $(this).css({'z-index': 101}); });

    }
}

$(document).ready(function() {
    $.ajax($.harbingerjs.core.url("exams"),
	   {success: function(exams) {
	       application.data.buildCalendar(exams);
	   }});

    $("#exam-modal").on("submit","#comment-form",function(e) {
	e.preventDefault();
	var self = $(this);
	var button = self.find("button.add-comment");
	var textarea = self.find("textarea");
	$.ajax($.harbingerjs.core.url("/comments/create"),
	       {data: $(this).serializeArray(),
		method: 'POST',
		beforeSend: function() {
		    button.prop("disabled",true);
		    textarea.prop("disabled",true);
		},
		error: function() {
		    if (console) { console.log("Error saving comment",arguments); }
		},
		success: function(exam_comment) {
		    self.siblings(".comments").append(application.templates.comment(exam_comment));
		    textarea.val("");
		}}).always(function() {
		    button.prop("disabled",false);
		    textarea.prop("disabled",false);
		});

    });
});
