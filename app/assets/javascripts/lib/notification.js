if (typeof application == "undefined") { application = {} }

application.notification = {
    serial: 1,
    flash: function(message) {
	var m = application.notification.draw(message);
	setTimeout(function() { m.remove(); },3000);
    },

    alert: function(message) {
	application.notification.draw(message);
    },

    draw: function(message) {
	if ($.type(message) == String) {
	    var message = {type: 'info', message: message};
	}
	if (message.id == undefined) { message.id = application.notification.serial++ }
	$("#notifications").append(application.templates.notification(message));
	return $("notification-" + message.id);
    }
};
