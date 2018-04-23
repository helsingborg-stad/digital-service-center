<?php

namespace helsingborg_dsc_startpage;

include('helpers/get-categories-for-posts.php');
include('helpers/get-current-post-language.php');
include('helpers/get-preamble.php');
include('helpers/get-top-links.php');
include('helpers/get-upcoming-events.php');
include('helpers/get-visitor-or-local-posts.php');
include('helpers/get-visitor-or-local-tags.php');
include('helpers/get-link-language-prefix.php');


// Helper function to map the posts to the correct format for the API response
// TODO: make code more tidy and remove duplication in events-api's `get_pages_for_visitor_local`
function post_mapping_helper($post, $type) {
  $page = get_current_post_language($post->ID);
  if(!isset($page)) {
    return;
  }
  $iframeMeta = get_post_meta($page->ID, 'event_iframe', false)[0];
  if ($iframeMeta['active'] == 'on' && strlen($iframeMeta['src'])) {
    $response = [
      type => 'iframe',
      heading  => html_entity_decode($page->post_title),
      preamble => get_preamble($page->post_content),
      url => $iframeMeta['src'],
      width => intval($iframeMeta['width'] ?? 0),
      height => intval($iframeMeta['height'] ?? 0),
      offsetTop => intval($iframeMeta['top_offset'] ?? 0),
      offsetLeft => intval($iframeMeta['left_offset'] ?? 0),
      menuOrder => $page->menu_order
    ];
    $thumbnail_url = get_the_post_thumbnail_url($page->ID, [232, 148]);
    if ($thumbnail_url) {
      $response['imgUrl'] = $thumbnail_url;
    }
    return $response;
  } else if ($page->post_type == 'editable_event' || $page->post_type == 'imported_event') {
    $response = [
      type => 'event',
      heading  => html_entity_decode($page->post_title),
      preamble => get_preamble($page->post_content),
      href     => get_link_language_prefix() . $type . '/' . $page->post_name,
      menuOrder => $page->menu_order
    ];
    $thumbnail_url = get_the_post_thumbnail_url($page->ID, [232, 148]);
    if ($thumbnail_url) {
      $response['imgUrl'] = $thumbnail_url;
    }
    return $response;
  } else {
    $response = [
      type => 'page',
      heading  => html_entity_decode($page->post_title),
      preamble => get_preamble($page->post_content),
      menuOrder => $page->menu_order
    ];
    if(strpos(wp_make_link_relative(get_permalink($page)), '?') !== false) {
      $response['url'] = wp_make_link_relative(get_permalink($page)) . '&wordpress';
    }
    else {
      $response['url'] = wp_make_link_relative(get_permalink($page)) . '?wordpress';
    }
    $thumbnail_url = get_the_post_thumbnail_url($page->ID, [232, 148]);
    if ($thumbnail_url) {
      $response['imgUrl'] = $thumbnail_url;
    }
    return $response;
  }
}

if(!function_exists('get_post_id_translated')) {
  function get_post_id_translated($post_id) {
    return function_exists('icl_object_id') ? icl_object_id($post_id) : $post_id;
  }
}

if(!function_exists('get_post_id_original')) {
  function get_post_id_original($post_id, $post_type) {
    global $sitepress;
    return function_exists('icl_object_id') ? icl_object_id($post_id, $post_type, true, $sitepress->get_default_language()) : $post_id;
  }
}

function startpage_response() {
    return rest_ensure_response([
      backgroundUrl => get_option('hdsc-startpage-setting-background-url'),
      heading => get_option('hdsc-startpage-setting-heading', 'Digital Service Center'),
      topLinks => get_top_links(get_option('hdsc-startpage-setting-top-links', [])),
      visitorHeading => get_option('hdsc-startpage-setting-visitor-heading', 'Visitor'),
      visitorHeadingLink => get_link_language_prefix() . 'visitor',
      visitorTags => get_visitor_or_local_tags('visitor'),
      visitorPosts => get_visitor_or_local_posts('visitor'),

      localHeading => get_option('hdsc-startpage-setting-local-heading', 'Local'),
      localHeadingLink => get_link_language_prefix() . 'local',
      localTags => get_visitor_or_local_tags('local'),
      localPosts => get_visitor_or_local_posts('local'),

      eventsHeading => get_option('hdsc-startpage-setting-events-heading', 'Events'),
      eventsHeadingLink => get_link_language_prefix() . 'events',
      eventsTags => array_map(function($category_id) {
        $category = get_category($category_id);
        return [
          name => html_entity_decode($category->name),
          href => '/events?category=' . $category_id
        ];
      }, get_categories_for_posts(helsingborg_dsc_startpage_get_upcoming_events())),
      eventsPosts => array_map(function($post) {
        return post_mapping_helper($post, 'events');
      }, helsingborg_dsc_startpage_get_upcoming_events()),
    ]);
}

function register_routes() {
    register_rest_route( 'wp/v2', '/startpage', [
      methods  => \WP_REST_Server::READABLE,
      callback => __NAMESPACE__ . '\startpage_response'
    ]);
}

add_action('rest_api_init', __NAMESPACE__ . '\register_routes');
