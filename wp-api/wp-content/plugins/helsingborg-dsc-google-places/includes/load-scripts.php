<?php
/*******************************
* load scripts
*******************************/

function load_google_places_search($hook) {
    if ($hook != 'toplevel_page_helsingborg-dsc-google-places') {
        return;
    }
    wp_enqueue_script('google_places_search_wp_admin', plugins_url('js/google-places-search.js', __FILE__));
}
add_action('admin_enqueue_scripts', 'load_google_places_search');

function load_checkbox_marker($hook) {
    if ($hook != 'toplevel_page_helsingborg-dsc-google-places') {
        return;
    }
    wp_enqueue_script('google_places_checkbox_marker_wp_admin', plugins_url('js/checkbox-marker.js', __FILE__));
}
add_action('admin_enqueue_scripts', 'load_checkbox_marker');

function load_google_places($hook) {
    if ($hook != 'toplevel_page_helsingborg-dsc-google-places') {
        return;
    }
    wp_enqueue_script('google_places_wp_admin', 'https://maps.googleapis.com/maps/api/js?key=' . get_option('hdsc-site-setting-google-maps-api-key') . '&libraries=places&callback=initMap', null, null, true);
}
add_action('admin_enqueue_scripts', 'load_google_places');

?>