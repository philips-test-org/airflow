$(document).ready(function() {

    if ($(".active .view-changer").length > 0) {
	var view = $(".active .view-changer").data("view-type");
	application.view = application[view];
    } else {
	application.view = application.calendar;
    }


    $("#workspace").on("click",".notecard",function(e) {
	var exam = application.data.findExam($(this).find(".data").data("exam-id"));
	application.modal.open(exam);
    });

    application.drawBoard();

    $("#exam-modal").on("submit","#comment-form",function(e) {
	e.preventDefault();
	var self = $(this);
	var button = self.find("button.add-comment");
	var textarea = self.find("textarea");
	var exam_id = self.find("input[name='exam_id']").val();
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
		    application.data.addComment(exam_id,exam_comment);
		    textarea.val("");
		}}).always(function() {
		    button.prop("disabled",false);
		    textarea.prop("disabled",false);
		});

    });

    $("#exam-modal").on("change",".status-toggle input",function(e) {
	var exam_id = $(this).parents(".modal-content").find(".data").text();
	application.data.updateAttribute(exam_id,$(this).attr('name'),this.checked,["modal-update","exam-update"]);
    });

    $(".view-changer").click(function(e) {
	if ($(this).data("view-type") != "kiosk") {
	    e.preventDefault();
	    var view = $(this).data("view-type");
	    application.view.breakdown();
	    application.view = application[view];
	    $(this).parent().siblings().removeClass("active");
	    $(this).parent().addClass("active");
	    application.view.setup();
	}
    });

    $("#view-controls #resource-group-buttons ul li a").click(function(e) {
	e.preventDefault();
	var group = $(this).data("value");
	if (group != $("#resource-group-buttons button").data("value")) {
	    $("#resource-group-buttons button .group-name").text(group);
	    $("#resource-group-buttons button").data("value",group);
	    application.drawBoard();
	}
    });
});
