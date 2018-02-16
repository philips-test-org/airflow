if (typeof application == "undefined") { application = {} }

$(document).ready(function(e) {
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
