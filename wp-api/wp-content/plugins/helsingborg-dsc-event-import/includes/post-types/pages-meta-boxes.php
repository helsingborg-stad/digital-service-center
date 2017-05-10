<?php
add_action('add_meta_boxes', 'pages_meta_boxes');

function pages_meta_boxes()
{
    add_meta_box('visitor_local_menu', 'Visa på start och landningssida', 'visitor_local_menu', 'page', 'normal', 'high');
    add_meta_box('event_iframe', 'Iframe', 'event_iframe', 'page', 'normal', 'high'); 
}