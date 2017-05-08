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
    googleMapsApiKey => get_option('hdsc-site-setting-google-maps-api-key', null),
    idleTimeout => intval(get_option('hdsc-site-setting-idle-timeout', 0)),
    chatButtonText => get_option('hdsc-site-setting-chat-button-text', null),
    languages => get_languages_in_use()
  ];
}

function get_languages_in_use() {
  if(!function_exists('icl_get_languages')) {
    return [ shortName => 'sv', isDefault => true ];
  }
  global $sitepress;
  $default_lang = $sitepress->get_default_language();
  $languages = icl_get_languages('skip_missing=0&orderby=KEY&order=DIR&link_empty_to=str');

  $response = array_map(function($lang) use ($default_lang) {
    return [
      shortName => $lang['code'],
      isDefault => trim($lang['code']) == trim($default_lang)
    ];
  }, $languages);

  return array_values($response);
}
