<?php
/*******************************
* load scripts
*******************************/

function load_google_places_search($hook) {
    if($hook != 'toplevel_page_helsingborg-dsc-google-places') {
        return;
    }
    wp_enqueue_script('google_places_search_wp_admin', plugins_url('js/google-places-search.js', __FILE__));
}
add_action('admin_enqueue_scripts', 'load_google_places_search');

function load_google_places($hook) {
    if($hook != 'toplevel_page_helsingborg-dsc-google-places') {
        return;
    }
    wp_enqueue_script('google_places_wp_admin', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBPGb8bx7dKL2KMdLzarIwgUQvz_uy_4qU&libraries=places&callback=initMap', null, null, true);
}
add_action('admin_enqueue_scripts', 'load_google_places');

?>