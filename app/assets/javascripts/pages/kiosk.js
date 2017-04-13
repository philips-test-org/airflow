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

});
