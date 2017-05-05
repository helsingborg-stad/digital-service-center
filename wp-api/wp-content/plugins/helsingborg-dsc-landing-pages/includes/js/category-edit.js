jQuery(function($) {
    $('#saved_main_visit_categories').change(function() {
        var categoryId = $(this).val();
        $('#landing_visit_sub_categories div').remove();
        load_sub_categories(categoryId, '#saved_main_visit_categories', '#landing_visit_sub_categories', 'hdsc-landing-visitor-categories', '#landing_visitor_icon');
    });

    $('#saved_main_local_categories').change(function() {
        var categoryId = $(this).val();
        $('#landing_local_sub_categories div').remove();
        load_sub_categories(categoryId, '#saved_main_local_categories', '#landing_local_sub_categories', 'hdsc-landing-local-categories', '#landing_local_icon');
    });

    var outputHtml = function(categoryArray) {
        var output = "";
        for(var i = 0, len = categoryArray.length; i < len; i++){
            var checked = "";
            if(categoryArray[i].is_saved) {
                checked = "checked";
            }
            output = output + categoryArray[i].category.cat_name +
            '<input name="sub_categories[]" style="margin: 0 10px;" type="checkbox" value="' + categoryArray[i].category.cat_ID + '"' + checked + '/>';
        }
        return output;
    }

    var load_sub_categories = function(categoryId, typeId, container, landingType, iconContainer) {
        $.ajax({
            url: landing_category_edit_script_vars.siteUrl + '/wp-admin/admin-ajax.php',
            data: {action: 'load_sub_categories',
            category_id: categoryId,
            landing_type: landingType},
            type: 'POST',
            datatype: 'json',
            success: function(response) {
                var categories = JSON.parse(response).categories;
                if($(typeId).val() == categoryId) {
                    var html;
                    if(categories && categories.length) {
                        html = outputHtml(categories);
                    } else {
                        html = 'Inga underkategorier hittades';
                    }
                    $(container).append('<div>' + html + '</div>');
                }
                var iconName = JSON.parse(response).icon;
                if (iconName) {
                    $(iconContainer).val(iconName);
                } else {
                    $(iconContainer).val('');
                }
            }
        });
    }
});