jQuery(function($) {
    $('#saved_main_visit_categories').change(function() {
        var categoryId = $(this).val();
        $('#landing_visit_sub_categories div').remove();
        load_sub_categories(categoryId, '#saved_main_visit_categories', '#landing_visit_sub_categories', 'hdsc-landing-visitor-categories');
    });

    $('#saved_main_local_categories').change(function() {
        var categoryId = $(this).val();
        $('#landing_local_sub_categories div').remove();
        load_sub_categories(categoryId, '#saved_main_local_categories', '#landing_local_sub_categories', 'hdsc-landing-local-categories');
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
    
    var load_sub_categories = function(categoryId, typeId, container, landingType) {
        $.ajax({
            url: landing_category_edit_script_vars.siteUrl + '/wp-admin/admin-ajax.php',
            data: {action: 'load_sub_categories',
            category_id: categoryId,
            landing_type: landingType},
            type: 'POST',
            datatype: 'json',
            success: function(response) {
                var parsedData = JSON.parse(response);
                if($(typeId).val() == categoryId) {
                    var html;                                                          
                    if(parsedData != null && parsedData.length > 0) {
                        html = outputHtml(parsedData);                        
                    } else {
                        html = 'Inga underkategorier hittades';
                    }
                    $(container).append('<div>' + html + '</div>');
                }
            }
        });
    }
});