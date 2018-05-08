<?php

namespace helsingborg_dsc_event_import;

include('helpers/get_short_content.php');
include('helpers/get-current-post-language.php');
include('helpers/get-editable-event-and-page-values.php');
include('helpers/get-google-place-categories.php');
include('helpers/get-imported-event-values.php');
include('helpers/get-landing-menu.php');
include('helpers/get-landing-page-categories.php');
include('helpers/get-links-for-option.php');
include('helpers/get-pages-for-visitor-local.php');
include('helpers/parse-category-to-landing-page-format.php');
include('helpers/parse-editable-events.php');
include('helpers/parse-google-places.php');
include('helpers/parse-imported-events.php');

if(!function_exists('get_post_id_original')) {
  function get_post_id_original($post_id, $post_type) {
    global $sitepress;
    return function_exists('icl_object_id') ? icl_object_id($post_id, $post_type, true, $sitepress->get_default_language()) : $post_id;
  }
}

if(!function_exists('get_post_id_translated')) {
  function get_post_id_translated($post_id) {
    return function_exists('icl_object_id') ? icl_object_id($post_id) : $post_id;
  }
}


function events_response() {
  $response = [];
  $imported_events = get_posts([ post_type => 'imported_event', 'suppress_filters' => false, numberposts => -1, category => get_option('hdsc-startpage-setting-' . $type . '-category', '')]);
  $editable_events = get_posts([ post_type => 'editable_event', 'suppress_filters' => false, numberposts => -1, category => get_option('hdsc-startpage-setting-' . $type . '-category', '')]);

  $imported_events_parsed = parse_imported_events($imported_events);
  $imported_events_parsed = array_values(array_filter($imported_events_parsed, function($event) {
    return $event['location']['city'] == 'Helsingborg';
  }));
  $editable_events_parsed = parse_editable_events($editable_events);
  $google_places_parsed = parse_google_places();

  $all_events = array_merge((array)$imported_events_parsed, (array)$editable_events_parsed, (array)$google_places_parsed);
  $categories_to_show_on_map = array_reduce($all_events, function($acc, $event) {
    $cat_ids = array_map(function($cat) { return $cat['id']; }, $event['categories']);
    foreach ($cat_ids as $cat_id) {
      $event_contains_location = $event['location']['latitude'] != null && $event['location']['longitude'] != null;
      if ($event_contains_location && !in_array($cat_id, $acc)) {
        $acc[] = $cat_id;
      }
    }
    return $acc;
  }, []);
  $response['events'] = $all_events;
  $response['landingPages']['visitor'] = [
    heading => get_option('hdsc-landing-settings-heading-visitor', 'Explore Helsingborg'),
    bottomLinks => get_links_for_option('hdsc-landing-settings-bottom-links-visitor'),
    categories => get_landing_page_categories('hdsc-landing-visitor-categories', $categories_to_show_on_map),
    pages => get_pages_for_visitor_local('visitor'),
    menu => get_landing_menu('visitor_menu')
  ];
  $response['landingPages']['local'] = [
    heading => get_option('hdsc-landing-settings-heading-local', 'Explore Helsingborg'),
    bottomLinks => get_links_for_option('hdsc-landing-settings-bottom-links-local'),
    categories => get_landing_page_categories('hdsc-landing-local-categories', $categories_to_show_on_map),
    pages => get_pages_for_visitor_local('local'),
    menu => get_landing_menu('local_menu')
  ];

  $response['landingPages']['events'] = [
    heading => get_option('hdsc-landing-settings-heading-events', 'Events'),
    bottomLinks => get_links_for_option('hdsc-landing-settings-bottom-links-events'),
    excludedCategoryIds => [
      intval(get_option('hdsc-startpage-setting-visitor-category', 0)),
      intval(get_option('hdsc-startpage-setting-local-category', 0))
    ]
  ];

  $response['landingPages']['shared'] = [];
  $free_wifi_id = get_option('hdsc-landing-settings-free-wifi-page');
  if(!isset($free_wifi_id)){
    return rest_ensure_response($response);
  }
  $free_wifi_page = get_current_post_language($free_wifi_id);
  if(!isset($free_wifi_page)) {
    return rest_ensure_response($response);
  }
  $free_wifi = get_post_meta($free_wifi_page->ID, 'event_iframe', true);
  if ($free_wifi) {
    $response['landingPages']['shared']['freeWifi'] = [
      url => $free_wifi['src'],
      width => intval($free_wifi['width'] ?? 0),
      height => intval($free_wifi['height'] ?? 0),
      offsetTop => intval($free_wifi['top_offset'] ?? 0),
      offsetLeft => intval($free_wifi['left_offset'] ?? 0)
    ];
  }

  return rest_ensure_response($response);
}

function register_routes() {
  register_rest_route( 'wp/v2', '/events', [
    methods  => \WP_REST_Server::READABLE,
    callback => __NAMESPACE__ . '\events_response'
  ]);
}

add_action('rest_api_init', __NAMESPACE__ . '\register_routes');
