<?php
/*******************************
* register rest api fields
*******************************/

add_action('rest_api_init', register_excluded_google_places_api);

function register_excluded_google_places_api() {
    register_rest_route( 'wp/v2', '/excluded_google_places', [
      methods  => WP_REST_Server::READABLE,
      callback => get_excluded_google_places
    ]);
}

function get_excluded_google_places() {
    return get_option('excluded_google_places', []);
}


add_action('rest_api_init', register_google_place_types_api);

function register_google_place_types_api() {
    register_rest_route( 'wp/v2', '/google_place_types', [
      methods  => WP_REST_Server::READABLE,
      callback => get_google_place_types
    ]);
}

function get_google_place_types() {
    return get_option('saved_google_place_types', []);
}

