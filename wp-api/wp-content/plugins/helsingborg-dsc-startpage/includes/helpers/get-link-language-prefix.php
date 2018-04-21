<?php

namespace helsingborg_dsc_startpage;

function get_link_language_prefix() {
  if(!function_exists('icl_get_languages')) {
    return '/';
  }
  global $sitepress;
  $lang = $_REQUEST['lang'] ?? $sitepress->get_default_language();

    return '/' . $lang . '/';
}
