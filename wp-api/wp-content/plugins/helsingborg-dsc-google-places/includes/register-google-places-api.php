<?php
/*******************************
* register rest api fields
*******************************/

add_action('rest_api_init', register_google_places_api);

function register_google_places_api() {
    register_rest_route( 'wp/v2', '/google-places', [
      methods  => WP_REST_Server::READABLE,
      callback => get_google_places
    ]);
}

function get_google_places() {
    return get_option('saved_google_places', []);
}
