$(document).ready(function() {

    $(".config-param input").on('keydown change',function(e) {
        $(this).parents(".config-param").find("button").attr("disabled", false);
        $(".bad-input").remove();
    });

    $(".config-param button").on('click',function(e) {
        var iconContainer = $(this).parents(".icon-parent"),
            container = $(this).parents(".config-param"),
            name = container.find("input").attr("name"),
            data = {},
            input;

        if ( container.find("input").attr("type") == "checkbox" ){
            input = container.find("input").prop("checked");
        } else if ( container.find("input").attr("type") == "number" ){
            input = container.find("input").val();
            if ( ! input || parseInt(input) <= 0 ){
                container.find("label").append("<span class='bad-input error'> Please enter a value > 0 </span>");
                return;
            }
        } else {
            input = container.find("input").val();
        }

        data[name] = input;

        $.ajax({
            url: $.harbingerjs.core.url('/admin/save_config'),
            method: 'put',
            data: data,
            dataType: 'json',
            beforeSend: function(){
                iconContainer.find(".loading").show();
                container.find("button").attr("disabled", true);
            },
            success: function(response) {
                var successIcon = iconContainer.find('.success');
                //sometimes the server may overwrite our choice (like in the case of a blank manual link)
                var updatedValue = JSON.parse(response.configuration.configuration_json)[name];
                iconContainer.find(".error").hide();
                $(successIcon).fadeIn(2000);
                $(successIcon).fadeOut(2000);
                $("#updated_by").text(response.updated_by);
                $("#updated_at").text(response.updated_at);
                $("input[name='"+name+"']").val(updatedValue);
            },
            error: function() {
                iconContainer.find(".error").show();
                container.find("button").attr("disabled", false);
            },
            complete: function(){
                iconContainer.find(".loading").hide();
            }
        });

        return false; //This prevents following the link
    });
});
