<?php

namespace helsingborg_dsc_event_import;


function get_imported_event_posts(){
    global $sitepress;
    $curr_lang = $sitepress->get_current_language();
    $sitepress->switch_lang($sitepress->get_default_language());

    $imported_events = get_posts([ post_type => 'imported_event', 'suppress_filters' => false, numberposts => -1, category => get_option('hdsc-startpage-setting-' . $type . '-category', '')]);
    $sitepress->switch_lang($curr_lang);

    return $imported_events;
}
