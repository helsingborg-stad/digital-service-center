<?php


add_action('add_meta_boxes', 'iframe_page_meta');

function iframe_page_meta()
{
    add_meta_box('event_iframe', 'Iframe', 'event_iframe', 'page', 'normal', 'high');
}