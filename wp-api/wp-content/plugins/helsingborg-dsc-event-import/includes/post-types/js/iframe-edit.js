jQuery(function($) {

    $('#iframe_src').keyup(function(e) {
        var src = $(this).attr('value');
        $('#preview').attr('src', src);
    });

    $('#iframe_height').bind('input', function() {
        var height = checkEmptyValue($(this).attr('value'));
        $('#preview').attr('height', height);
    });

    $('#iframe_width').bind('input', function() {
        var width = checkEmptyValue($(this).attr('value'));
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
        var height = $('#iframe_height').val();
        var width = $('#iframe_width').val();
        var marginTop = $('#iframe_top_offset').val();
        var marginLeft = $('#iframe_left_offset').val();

        $('#preview').attr('src', src);
        $('#preview').attr('height', height);
        $('#preview').attr('width', width);
        $('#preview').css('margin-top', '-' + marginTop + 'px');
        $('#preview').css('margin-left', '-' + marginLeft + 'px');
    }

    var checkEmptyValue = function(value) {
        console.log(value);
        if(value == '') {
            return 0;
        }
        return value;
    }

    load_preview_iframe();
});