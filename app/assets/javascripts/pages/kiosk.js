$(document).ready(function() {

    application.view = application.kiosk;
    application.drawBoard();

    $("#view-controls #resource-group-buttons ul li a").click(function(e) {
	e.preventDefault();
	var group = $(this).data("value");
	if (group != $("#resource-group-buttons button").data("value")) {
	    $("#resource-group-buttons button .group-name").text(group);
	    $("#resource-group-buttons button").data("value",group);
	    application.drawBoard();
	}
    });

    $("#legend-button").popover({
	title: "Legend",
	content: application.templates.legend(application.statuses),
	html: true,
	placement: "bottom",
	container: 'body'
    });


    setInterval(function() {
	//Fix: This needs to be adjusted to the group name when that backend exists
	var resources = $.parseJSON($("#resource-groupings-json").text())[$("#resource-group-buttons button").data("value")];
	if (resources == undefined) {
	    $("#workspace").html(application.templates.noResources());
	} else {
	    var data = $.map(resources,function(r,i) {
		return {name: "resource_ids[]",
			value: r.id};
	    });
	    data.push({name: "date",
		       value: $("#time-button").data("value")});

	    if ($(".active .view-changer").data("view-type") == "kiosk") { var url = $.harbingerjs.core.url("limited_exam_info"); }
	    else {  var url = $.harbingerjs.core.url("exams"); }
	    $.ajax(url,
		   {data: data,
		    beforeSend: function() {
			//$("#workspace").html(application.templates.workspaceLoading());
		    },
		    success: function(exams) {
			application.data.formatExams(exams);
			$.each(application.data.examHash,function(id,exam) {
			    application.data.dispatch("exam-update",exam);
			});
		    }});
	}
    },1000*60);

});
