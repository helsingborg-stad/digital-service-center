<?php

add_action('rest_api_init', helsing_dsc_site_settings_register_routes);

function helsing_dsc_site_settings_register_routes() {
  register_rest_route( 'wp/v2', '/site-settings', [
    methods  => WP_REST_Server::READABLE,
    callback => helsingborg_dsc_site_settings_response
  ]);
}

function helsingborg_dsc_site_settings_response() {
  return [
    googleAnalyticsId => get_option('hdsc-site-setting-google-analytics', null),
    idleTimeout => intval(get_option('hdsc-site-setting-idle-timeout', 0))
  ];
}
