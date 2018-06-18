$(document).ready(function() {
    $(".should-hide").hide();
});

$(function(){
    //set the heights so that they aren't constantly changing
    var height = Math.max.apply($.map($("td .connected-sortable"), function(item){
      return $(item).parent("td").height();
    }));
    $("table.roles td").css("height", height);

    var fromList;
    $(".access-container").each(function(_i, accessContainer){
        var id = $(accessContainer).attr("id");
        $(accessContainer).find(".connected-sortable").sortable({
            connectWith: "#" + id + " .connected-sortable",
            start: function(event, ui){
                fromList = ui.item.parent("ul");
            },
            stop: function(event, ui){
                if ( ! (fromList.attr("id") == ui.item.parent("ul").attr("id")) ){
                    $(this).parents(".access-container").find("button").attr("disabled", false);
                }
            }
        }).disableSelection();
    });

    $(".update-access").click(function(event){
        var data = {},
            key = $(this).attr("data-key"),
            container = $(this).parents(".access-container");

        data[key] = $.map(container.find(".should-send li"), function(listItem){
            return $(listItem).attr("data-role-id");
        });

        $.ajax({
            url: $.harbingerjs.core.url('/admin/save_config'),
            data: JSON.stringify(data),
            method: 'put',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function(){
                container.find(".loading").show();
                container.find("button").attr("disabled", true);
            },
            error: function(xhr, error){
               container.find(".error").show();
               container.find("button").attr("disabled", false);
            },
            success: function(response){
                var successIcon = container.find('.success');

                //update access lists
                $.each(JSON.parse(response.configuration.configuration_json)[key], function(item){
                    var selector = "li[data-role-id='" + item + "']";
                    if ( $(container).find(".all-access").find(selector).length == 0 ){
                        var copy = $(container).find(".no-access").find(selector).clone();
                        $(container).find(".no-access").find(selector).remove();
                        $(container).find(".all-access").append(copy);
                    }
                });

                container.find(".connected-sortable").sortable("refresh");
                container.find(".error").hide();
                $(successIcon).fadeIn(2000);
                $(successIcon).fadeOut(2000);
                $("#updated_by").text(response.updated_by);
                $("#updated_at").text(response.updated_at);
            },
            complete: function(){
                container.find(".loading").hide();
            }
        });
    });
});
