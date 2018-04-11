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
      type: "calendar",
    },
    user: {currentUser: employee},
    key: "calendarState",
  })
};

application.overview = function() {
  var resources = $.parseJSON($("#resource-groupings-json").text());
  var resourceGroup = $("#selected-resource-group").text();
  var employee = $.parseJSON($("#employee-json").text());
  window.renderReact(window.airflow, "#workspace", {
    board: {
      resources: resources,
      selectedResourceGroup: resourceGroup,
      selectedResources: resources[resourceGroup] || [],
      type: "overview",
    },
    user: {currentUser: employee},
    key: "overviewState",
  })
};

application.kiosk = function() {
  var resources = $.parseJSON($("#resource-groupings-json").text());
  var resourceGroup = $("#selected-resource-group").text();
  window.renderReact(window.airflow, "#workspace", {
    board: {
      resources: resources,
      selectedResourceGroup: resourceGroup,
      selectedResources: resources[resourceGroup] || [],
      type: "kiosk",
    },
    key: "kioskState",
  })
};
