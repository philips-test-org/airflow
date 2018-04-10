if (typeof application == "undefined") { application = {} }

application.drawBoard = function() {
  application.view();
};

application.calendar = function() {
  var resources = $.parseJSON($("#resource-groupings-json").text());
  var employee = $.parseJSON($("#employee-json").text());
  var resourceGroup = $("#selected-resource-group").text();
  window.renderReact(window.airflow, "#workspace", {
    board: {
      resources: resources,
      selectedResourceGroup: resourceGroup,
      selectedResources: resources[resourceGroup] || [],
    },
    user: {currentUser: employee},
    key: "calendarState",
  })
};

application.overview = function() {
  var resources = $.parseJSON($("#resource-groupings-json").text());
  var resourceGroup = $("#selected-resource-group").text();
  var employee = $.parseJSON($("#employee-json").text());
  window.renderReact(window.calendar, "#workspace", {
    board: {
      resources: resources,
      selectedResourceGroup: resourceGroup,
      selectedResources: resources[resourceGroup] || [],
    },
    user: {currentUser: employee},
    key: "overviewState",
  })
};

// Kiosk "inherits" from application.calendar and overrides
// some of its functions
application.kiosk = $.extend({},application.calendar,{
  alignmentTimeout: null,
  setup: function() {
    //build calendar
    $("#workspace").html(application.templates.kiosk(application.data));

    //Make time and room headings scroll with calendar
    $("#board").scroll(function(e) {
      var scroll = this.scrollLeft;
      $("#time-headings").offset({left: -1*scroll+50});
      $("#vertical-time-headings").css({left: scroll});
      clearTimeout(application.kiosk.alignmentTimeout);
      setTimeout(function() {
        var scroll_top = $("#board").scrollTop();
        $.each($("#board .notecard"),function(i,e) {
          if ((($(e).position().top + $(e).height() / 3) <= scroll_top) && $(e).position().top < scroll_top) {
            $(e).find(".kiosk-number").addClass("bottom");
          } else {
            $(e).find(".kiosk-number").removeClass("bottom");
          }
        });
      },200);
    });

    // Set up the now line including redrawing
    application.kiosk.drawNow();
    setInterval(application.kiosk.drawNow, 1 / application.templates.pixels_per_second * 1000);

    application.data.hook("order-update","card-redraw",function(order) {
      application.kiosk.redrawCard(order);
    });

  },

  redrawCard: function(order) {
    var card = application.calendar.findCard(order);
    var current_resource_id = card.parents("td").data("resource-id");
    var order_resource_id = application.data.resource(order).id;
    if (current_resource_id != order_resource_id) {
      card.appendTo($("#time-grid td[data-resource-id='" + order_resource_id + "']"))
    }
    card.replaceWith(application.templates.scaledCard(order));
    return card;
  },

  drawNow: function() {
    application.calendar.drawNow();
    if ($("#right-now").css("display") != "none") {
      // To center the now line you need to
      // get the now line's top and add the y axis scroll distance
      // then subtract half the hight of the window
      // Then set left to the the left position plus
      // the x axis scroll distance to keep that scroll in place
      $("#board").scrollTo({top: (($("#right-now").position().top + $("#board").scrollTop()) - ($("#board").height()/2)),
        left: $("#board").position().left + $("#board").scrollLeft()},500);
    }
  }
});
