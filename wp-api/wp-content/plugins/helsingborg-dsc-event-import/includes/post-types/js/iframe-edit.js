jQuery(function($) {

    $('#iframe_src').keyup(function(e) {
        var src = $(this).attr('value');
        $('#preview').attr('src', src);
    });

    $('#iframe_height').bind('input', function() {
        var height = checkEmptyValue($(this).attr('value')) !== 0 ? checkEmptyValue($(this).attr('value')) : 150;
        $('#preview').attr('height', height);
    });

    $('#iframe_width').bind('input', function() {
        var width = checkEmptyValue($(this).attr('value')) !== 0 ? checkEmptyValue($(this).attr('value')) : 300;
        $('#preview').attr('width', width);
    });

    $('#iframe_top_offset').bind('input', function() {
        var topOffset = checkEmptyValue($(this).attr('value'));
        $('#preview').css('margin-top', '-' + topOffset + 'px');
    });

    $('#iframe_left_offset').bind('input', function() {
        var leftOffset = checkEmptyValue($(this).attr('value'));
        $('#preview').css('margin-left', '-' + leftOffset + 'px');
    });

    var load_preview_iframe = function() {
        var src = $('#iframe_src').val();
        var height = $('#iframe_height').val() !== "" ? $('#iframe_width').val() : 150;
        var width = $('#iframe_width').val() !== "" ? $('#iframe_width').val() : 300;
        var marginTop = $('#iframe_top_offset').val();
        var marginLeft = $('#iframe_left_offset').val();

        $('#preview').attr('src', src);
        $('#preview').attr('height', height);
        $('#preview').attr('width', width);
        $('#preview').css('margin-top', '-' + marginTop + 'px');
        $('#preview').css('margin-left', '-' + marginLeft + 'px');
    }

    var checkEmptyValue = function(value) {
        if(value == '') {
            return 0;
        }
        return value;
    }

    load_preview_iframe();
});