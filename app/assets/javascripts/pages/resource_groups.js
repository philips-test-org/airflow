Handlebars.registerHelper('selected_check',function(rg) {
    if ($("#resource-form input[name='resource_group_id']").val() == rg.id)
	return "selected";
    else {
	return "";
    }
});

$(document).ready(function() {

    var serial = 1;
    var data = $.parseJSON($("#initial-resource-groups").text());

    $("#group-form").submit(function(e) {
	e.preventDefault();
	var name = $(this).find("input").val().replace(/^\s*|\s*$/,"");
	if (name == "") {
	    $(this).find(".errors").html(application.templates.formError("Resource group cannot be blank"));
	} else {
	    $(this).find(".errors").html("");
	    $.ajax($.harbingerjs.core.url("/resource_groups/create"),
		   {method: 'post',
		    data: {name: name},
		    beforeSend: function() {
			$("#group-form input").prop("disabled",true);
			$("#group-form button").prop("disabled",true);
		    },
		    error: function() {
			if (console != undefined) { console.log(arguments); }
			$("#group-form input").prop("disabled",false);
			$("#group-form button").prop("disabled",false);
			application.notification.flash({type: 'alert', message: "Failed to created new resource group"});
		    },
		    success: function(resource_group) {
			$("#group-form input").prop("disabled",false);
			$("#group-form input").val("");
			$("#group-form button").prop("disabled",false);
			data.push(resource_group);
			$("#resource-groups").html(application.templates.resourceGroups(data));
		    }});
	}
    });

    $("#resource-form ul li a").on("click",function(e) {
	$("#modality-filter-button").data("id",$(this).data("id"));
	$("#modality-filter-button .filter-name").text($(this).text());
    });

    $("#resource-groups").on("click",".resource-group",function(e) {
	e.preventDefault();
	if ($(e.target).hasClass("fa-trash")) {
	    if (confirm("Are you sure you want to delete this resource group?")) {
	    var self = $(this);
		$.ajax($.harbingerjs.core.url("/resource_groups/delete"),
		       {method: 'post',
			data: {id: $(this).data("id")},
			success: function(resposne) {
			    if (self.hasClass("selected")) { $("#right-col").hide(); }
			    data = data.filter(function(group) { return group.id != self.data("id"); });
			    self.remove();
			    application.notification.flash({type: 'info', message: 'Deleted resource group'});
			},
			error: function() {
			    application.notification.flash({type: 'alert', message: 'Failed to delete resource group'});
			}});
	    }
	} else {
	    $("#resource-form input[name='resource_group_id']").val($(this).data("id"));
	    $("#resource-form").submit();
	    $("#resource-groups .resource-group").removeClass("selected");
	    $(this).addClass("selected");
	}
    });

    $("#resource-form").submit(function(e) {
	e.preventDefault();
	var data = {
	    search: $(this).find("input[name='search']").val(),
	    modality_id: $(this).find("button").data("id"),
	    resource_group_id: $(this).find("input[name='resource_group_id']").val()
	}
	$.ajax($.harbingerjs.core.url("/resource_groups/search"),
	       {data: data,
		beforeSend: function() {
		    $("#right-col").show();
		    $("#resources").html(application.templates.loading());
		},
		success: function(associations) {
		    $("#resources").html(application.templates.resourceTable(associations));
		}
	       });
    });

    $("#resource-groups").html(application.templates.resourceGroups(data));

    $("#right-col").on("click","table tbody tr",function(e) {
	var tr = $(this);
	var data = {
	    resource_id: tr.data("id"),
	    resource_group_id: $("#resource-form input[name='resource_group_id']").val()
	}
	if (tr.hasClass("selected")) { var url = "/resource_groups/disassociate"; }
	else { var url = "/resource_groups/associate"; }
	$.ajax($.harbingerjs.core.url(url),
	       {method: 'post',
		data: data,
		success: function(response) {
		    tr.toggleClass("selected");
		}
	       });
    });
});
