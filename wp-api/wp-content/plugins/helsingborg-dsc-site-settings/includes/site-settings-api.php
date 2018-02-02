<?php

add_action('rest_api_init', helsing_dsc_site_settings_register_routes);

function helsing_dsc_site_settings_register_routes() {
  register_rest_route( 'wp/v2', '/site-settings', [
    methods  => WP_REST_Server::READABLE,
    callback => helsingborg_dsc_site_settings_response
  ]);
}

function helsingborg_dsc_site_settings_response() {
  return rest_ensure_response([
    googleAnalyticsId => get_option('hdsc-site-setting-google-analytics', null),
    googleMapsApiKey => get_option('hdsc-site-setting-google-maps-api-key', null),
    idleTimeout => intval(get_option('hdsc-site-setting-idle-timeout', 0)),
    showChat => get_option('hdsc-site-setting-show-chat', null) == 'on',
    showFlags => get_option('hdsc-site-setting-show-flags', null) == 'on',
    languages => get_languages_in_use(),
    translatables => hdsc_get_translatables()
  ]);
}

function hdsc_get_translatables() {
  function camelcasify($str) {
    $arr = explode("-", $str);
    $arr = array_map("ucfirst", $arr);
    $ret = implode("", $arr);
    return lcfirst($ret);
  }

  global $sitepress;
  $curr_lang = $sitepress->get_current_language();

  $translatables = [];
  foreach(get_languages_in_use() as $language) {
    $lang_code = $language['shortName'];
    global $sitepress;
    $sitepress->switch_lang($lang_code);
    $translatables[$lang_code] = array_reduce(hdsc_translatables(), function($acc, $translatable) {
      $key = camelcasify($translatable[1]);
      $fallback = $translatable[0];
      $ignore_fallback = $translatable[3];
      if (!$ignore_fallback) {
        
      }
      $value = get_option('hdsc-translatable-' .$translatable[1], $fallback);
      if (!strlen($value) && !$ignore_fallback) {
        $value = $fallback;
      }
      $acc[$key] = $value;
      return $acc;
    }, []);
  }

  $sitepress->switch_lang($lang_code);

  return $translatables;
}

function get_languages_in_use() {
  if(!function_exists('icl_get_languages')) {
    return [[ shortName => 'sv', isDefault => true ]];
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
