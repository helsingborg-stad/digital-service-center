<?php

add_action('rest_api_init', register_routes);

function register_routes() {
    register_rest_route( 'wp/v2', '/translate', [
      methods  => WP_REST_Server::CREATABLE,
      callback => translate_response
    ]);
}

function translate_response() {
    $response = helsingborg_dsc_google_translate();
    return $response;
}

function helsingborg_dsc_google_translate() {
    $url = 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyD6nh_5HAPig0rLfpUT5x-JGu00wn_FvWQ';

    $data = json_decode(file_get_contents('php://input'));
    $json = json_encode($data);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response  = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}
?>