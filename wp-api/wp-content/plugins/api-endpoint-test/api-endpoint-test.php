<?php
/*
Plugin Name: Api endpoint test
Description: Testing endpoint in wp rest api
Author: Meridium
Version: 0.1
Author URI: http://meridium.se
Text Domain: Api-Endpoint-Test

/*******************************
* global variables
*******************************/
$api_endpoint_test = 'Api endpoint test';
/*******************************
* includes
*******************************/

function filtered_search_plugin_init() {
  load_plugin_textdomain( 'Api-Endpoint-Test', false, 'api-endpoint-test-plugin' );
}

/**
 * This is our callback function that embeds our phrase in a WP_REST_Response
 */
function prefix_get_endpoint_phrase() {
    // rest_ensure_response() wraps the data we want to return into a WP_REST_Response, and ensures it will be properly returned.
    return rest_ensure_response( 'Hello World, this is the WordPress REST API' );
}
 
/**
 * This function is where we register our routes for our example endpoint.
 */
function prefix_register_example_routes() {
    // register_rest_route() handles more arguments but we are going to stick to the basics for now.
    register_rest_route( 'hello-world/v1', '/phrase', array(
        // By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
        'methods'  => WP_REST_Server::READABLE,
        // Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
        'callback' => 'prefix_get_endpoint_phrase',
    ) );
}
 
add_action( 'rest_api_init', 'prefix_register_example_routes' );
?>