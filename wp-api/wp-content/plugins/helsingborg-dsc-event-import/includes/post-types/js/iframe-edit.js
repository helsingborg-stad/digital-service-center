jQuery(function($) {

    $('#iframe_src').keyup(function(e) {
        var src = $(this).attr('value');
        $('#preview').attr('src', src);
    });

    $('#iframe_height').bind('input', function() {
        var height = parseInt($(this).attr('value')) || 600;
        $('#preview').attr('height', height);
    });

    $('#iframe_width').bind('input', function() {
        var width = parseInt($(this).attr('value')) || '100%';
        $('#preview').attr('width', width);
    });

    $('#iframe_top_offset').bind('input', function() {
        var topOffset = parseInt($(this).attr('value')) || 0;
        $('#preview').css('margin-top', '-' + topOffset + 'px');
    });

    $('#iframe_left_offset').bind('input', function() {
        var leftOffset = parseInt($(this).attr('value')) || 0;
        $('#preview').css('margin-left', '-' + leftOffset + 'px');
    });

    var load_preview_iframe = function() {
        var src = $('#iframe_src').val();
        var height = parseInt($('#iframe_height').val()) || 600;
        var width = parseInt($('#iframe_width').val()) || '100%';
        var marginTop = $('#iframe_top_offset').val();
        var marginLeft = $('#iframe_left_offset').val();

        $('#preview').attr('src', src);
        $('#preview').attr('height', height);
        $('#preview').attr('width', width);
        $('#preview').css('margin-top', '-' + marginTop + 'px');
        $('#preview').css('margin-left', '-' + marginLeft + 'px');
    }

    load_preview_iframe();
});