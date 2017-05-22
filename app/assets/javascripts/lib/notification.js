if (typeof application == "undefined") { application = {} }

application.notification = {
    serial: 1,
    flash: function(message) {
	var m = application.notification.draw(message);
	setTimeout(function() { m.fadeOut(400,function() { m.remove() }); },3000);
    },

    alert: function(message) {
	application.notification.draw(message);
    },

    draw: function(message) {
	if ($.type(message) == "string") {
	    var message = {type: 'info', message: message};
	}

	if (message.id == undefined) { message.id = application.notification.serial++ }

	// If there is no previous message then draw
	if ($("#notification-" + message.id).length == 0) {
	    $("#notifications").prepend(application.templates.notification(message));
	}
	return $("#notification-" + message.id);
    }
};
