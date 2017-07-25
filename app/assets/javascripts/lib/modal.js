if (typeof application == "undefined") { application = {} }

application.modal = {
    open: function(order) {
	application.modal.redraw(order);
	$("#order-modal").modal('show');
    },

    redraw: function(order) {
	$("#order-modal .modal-content").html(application.templates.modalCard(order));
	$("#order-modal [data-toggle='toggle']").bootstrapToggle();
    },

    redrawStatus: function(order) {
	$("#order-modal .modal-content .left-stripe").replaceWith(application.templates.modalCardStatus(order));
	$("#order-modal .modal-content .status-toggles").replaceWith(application.templates.statusToggles(order));
	$("#order-modal .events").replaceWith(application.templates.eventList(order));
	$("#order-modal [data-toggle='toggle']").bootstrapToggle();
    },

    checkEvent: function(order) {
	return $("#order-modal .data").text() == String(order.id);
    }

};

$(document).ready(function(e) {
    application.data.hook("modal-update","modal-redraw",function(order) {
	if (application.modal.checkEvent(order)) {
	    application.modal.redrawStatus(order);
	}
    });

    application.data.hook("event-submit","event-list-redraw",function(order) {
	if (application.modal.checkEvent(order)) {
	    $("#order-modal .events").replaceWith(application.templates.eventList(order));
	}
    });

    application.data.hook("order-rollback","event-list-redraw-rollback",function(order,rollback_order) {
	if (application.modal.checkEvent(rollback_order)) {
	    application.modal.redraw(rollback_order);
	}
    });

    $("#workspace").on("click",".notecard",function(e) {
	var order = application.data.findOrder($(this).find(".data").data("order-id"));
	application.modal.open(order);
    });


    $("#order-modal").on("change",".status-toggle input",function(e) {
	var order_id = $(this).parents(".modal-content").find(".data").text();
	//application.data.updateAttribute(exam_id,$(this).attr('name'),this.checked,["modal-update","exam-update"]);
	var name = $(this).attr('name');
	var event = {
	    id: null, //needs to become an internal id
	    employee: application.employee,
	    event_type: name,
	    comments: null,
	    new_state: {},
	    created_at: moment().unix()*1000,
	    order_id: order_id
	}
	event.new_state[name] = this.checked;

	application.data.addEvent(order_id,event,["event-submit","modal-update","order-update"])
    });

    $("#order-modal").on("submit","#comment-form",function(e) {
	e.preventDefault();
	var self = $(this);
	var button = self.find("button.add-comment");
	var textarea = self.find("textarea");
	var order_id = self.find("input[name='order_id']").val();

	var event = {
	    id: null, //needs to become an internal id
	    employee: application.employee,
	    event_type: 'comment',
	    comments: textarea.val(),
	    new_state: {},
	    created_at: moment().unix()*1000,
	    order_id: order_id
	}

	application.data.addEvent(order_id,event,["event-submit","order-update"])
	textarea.val("");

	// $.ajax($.harbingerjs.core.url("/comments/create"),
	//        {data: $(this).serializeArray(),
	// 	method: 'POST',
	// 	beforeSend: function() {
	// 	    button.prop("disabled",true);
	// 	    textarea.prop("disabled",true);
	// 	},
	// 	error: function() {
	// 	    if (console) { console.log("Error saving comment",arguments); }
	// 	},
	// 	success: function(exam_comment) {
	// 	    self.siblings(".comments").append(application.templates.comment(exam_comment));
	// 	    application.data.addComment(exam_id,exam_comment);
	// 	    textarea.val("");
	// 	}}).always(function() {
	// 	    button.prop("disabled",false);
	// 	    textarea.prop("disabled",false);
	// 	});

    });

});
