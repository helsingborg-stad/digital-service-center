<?php

function hdsc_temp_crm_register_routes() {
  register_rest_route( 'wp/v2', '/menu', [
    methods  => WP_REST_Server::READABLE,
    callback => temp_crm_callback
  ]);
}

function temp_crm_callback(){
    $response = get_option('hdsc-temp-crm-json');
    $filtered_response = str_replace('\n', '', $response);
    return wp_get_nav_menu_items('header-menu') ?? [];
}