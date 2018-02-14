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

  //$("#workspace").on("click",".notecard",function(e) {
    //var order = application.data.findOrder($(this).find(".data").data("order-id"));
    //application.modal.open(order);
  //});


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
  });

  $("#order-modal").on("click", ".edit-rounding", function(e) {
    e.preventDefault();
    var item = $(".rounding-box");
    item.prop("disabled", false);
    startEditingRounding();
    $(".rounding-box").val(cleanTextAreaText(item.val()));
  });

  $("#order-modal").on("click", ".edit-rounding-cancel", function(e) {
    e.preventDefault();
    var item = $(".rounding-box");
    item.prop("disabled", true);
    stopEditingRounding();

    var savedValue = "";
    var inputData = item.data();
    if (item.data().savedValue) {
      savedValue = item.data().savedValue;
    }
    $(".rounding-box").val(cleanTextAreaText(savedValue));
  });

  $("#order-modal").on("click", ".save-rounding", function(e) {
    e.preventDefault();
    $(".rounding-box").prop("disabled", true);

    var order_id = $("#rounding-form").find("input[name='order_id']").val();
    var text = $(".rounding-box").val();
    var cleanedText = cleanTextAreaText(text);

    var event = {
      id: null, //needs to become an internal id
      employee: application.employee,
      event_type: "rounding-update",
      comments: cleanedText,
      new_state: {},
      created_at: moment().unix()*1000,
      order_id: order_id
    }

    onSuccess = function(_) {
      stopEditingRounding();
      $(".rounding-text").text(cleanedText)
      $(".rounding-footer")
        .find(".edited-by")
        .text("Last edited by: " +
              application.employee.name +
              " on " +
              Handlebars.helpers.format_timestamp(event.created_at));
    };
    application.data.addEvent(order_id,event,["event-submit","order-update"], onSuccess)
  });

  function startEditingRounding() {
    $(".rounding").addClass("hidden");
    $(".edit-rounding").addClass("hidden");
    $("#rounding-form").removeClass("hidden");
    $(".edit-rounding-cancel").removeClass("hidden");
  }

  function stopEditingRounding() {
    $(".rounding").removeClass("hidden");
    $(".edit-rounding").removeClass("hidden");
    $("#rounding-form").addClass("hidden");
    $(".edit-rounding-cancel").addClass("hidden");
  }

  function cleanTextAreaText(text) {
    // Clean leading and trailing space from text; maintain newlines.
    return $.map(text.split("\n"), function(line) {
      return line.trim();
    }).join("\n");
  }
});
