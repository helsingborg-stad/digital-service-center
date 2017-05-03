<?php

function helsingborg_dsc_startpage_get_upcoming_events() {
  $imported_posts = get_posts([ post_type => 'imported_event', 'suppress_filters' => false, numberposts => -1]);
  $editable_posts = get_posts([ post_type => 'editable_event', 'suppress_filters' => false, numberposts => -1]);
  $imported_upcoming = array_filter($imported_posts, function($post) {
    $post_meta = get_post_meta($post->ID, 'imported_event_data', true);
    $door_times = array_map(function($occasion) {
      return $occasion->door_time;
    }, $post_meta->occasions ?? []);
    $is_today_or_later = !empty(array_filter($door_times, function($door_time) {
      return date('Y-m-d', strtotime($door_time)) >= date('Y-m-d');
    }));
    return $is_today_or_later;
  });
  $editable_upcoming = array_filter($editable_posts, function($post) {
    $occasions = get_post_meta($post->ID, 'occasions', false);
    $door_time = $occasions[0]['door_time'];
    $is_today_or_later = date('Y-m-d', strtotime($door_time)) >= date('Y-m-d');
    return $is_today_or_later;
  });
  $all_events = array_merge((array)$imported_upcoming, (array)$editable_upcoming);

  return array_values(array_slice($all_events, 0, 10));
}

// Gets all distinct categories for a list of posts (excluding 'Visitor' and 'Local')
function get_categories_for_posts($posts) {
  $category_ids = array_map(function($post) {
    return wp_get_post_categories($post->ID);
  }, $posts);
  $category_ids_reduced = [];
  array_walk_recursive($category_ids, function($a) use (&$category_ids_reduced) { if (!in_array($a, $category_ids_reduced)) {$category_ids_reduced[] = $a; } });
  $categories_excluding_vistor_and_local = array_values(array_diff($category_ids_reduced, [
    intval(get_option('hdsc-startpage-setting-visitor-category')),
    intval(get_option('hdsc-startpage-setting-local-category'))
  ]));
  return $categories_excluding_vistor_and_local;
}

// Gets the shortform of a post's content
function get_preamble($post_content) {
  $contains_more_html_comment = preg_match('/<!--more-->/', $post_content);
  if ($contains_more_html_comment) {
    // Get all text before "<!--more-->" and strip all <p> tags manually
    $post_content = substr($post_content, 0, strpos($post_content, "<!--more-->"));
    $post_content = preg_replace('/<p[^>]*>(.*)<\/p[^>]*>/i', '$1', $post_content);
  }
  $decoded = strip_tags(html_entity_decode($post_content));
  return strlen($decoded) > 100
    ? substr($decoded, 0, 100) . '...'
    : $decoded;
}

// Helper function to map the posts to the correct format for the API response
function post_mapping_helper($post, $type) {
  $response = [
    heading  => html_entity_decode($post->post_title),
    preamble => get_preamble($post->post_content),
    href     => '/' . $type . '/' . $post->post_name,
  ];
  $thumbnail_url = get_the_post_thumbnail_url($post->ID);
  if ($thumbnail_url) {
    $response['imgUrl'] = $thumbnail_url;
  }
  return $response;
}

// Gets imported and editable events for either 'visitor' or 'local' category, and returns a merged array
function get_visitor_or_local_posts($type) {
  $imported_posts = get_posts([ post_type => 'imported_event', 'suppress_filters' => false, posts_per_page => 10, category => get_option('hdsc-startpage-setting-' . $type . '-category', '')]);
  $editable_posts = get_posts([ post_type => 'editable_event', 'suppress_filters' => false, posts_per_page => 10, category => get_option('hdsc-startpage-setting-' . $type . '-category', '')]);
  $all_posts = array_merge($imported_posts, $editable_posts);
  return array_map(function($post) use ($type) {
    return post_mapping_helper($post, $type);
  }, $all_posts);
}

function get_visitor_or_local_tags($type) {
  $mapped_cats = get_option('hdsc-landing-' . $type .'-categories', []);
  if(!is_array($mapped_cats)) {
    $mapped_cats = [];
  }
  $response = [];
  foreach ($mapped_cats as $mapped_cat) {
    $category = get_category($mapped_cat['main_category']);
    $response[] = [
      name => html_entity_decode($category->name),
      href => '/' . $type . '/category/' . $category->slug
    ];
  }
  return $response;
}

if(!function_exists('get_post_id_translated')) {
  function get_post_id_translated($post_id) {
    return function_exists('icl_object_id') ? icl_object_id($post_id) : $post_id;
  }
}


function get_top_links($pages) {
  $posts = array_map(function($pageId) {
    $page;
    $lang = $_REQUEST['lang'];
    if(get_post_id_translated($pageId) != null) {
      $page = get_post(get_post_id_translated($pageId));
    }
    else if(!isset($lang)) {
      $page = get_post($pageId);
    }
    else {
      return;
    }
    $iframeMeta = get_post_meta($page->ID, 'event_iframe', false)[0];
    return [
      name => $page->post_title,
      url => $iframeMeta['src'],
      active => $iframeMeta['active'] == 'on',
      width => intval($iframeMeta['width'] ?? 0),
      height => intval($iframeMeta['height'] ?? 0),
      offsetTop => intval($iframeMeta['top_offset'] ?? 0),
      offsetLeft => intval($iframeMeta['left_offset'] ?? 0)
    ];
  }, $pages);
  $postsWithIframe = array_values(array_filter($posts, function ($link) {
    return $link['active'] && strlen($link['url']) > 0; }
  ));
  unset($postsWithIframe[0]['active']); // Remove 'active' property, since it's irrelevant for the API response
  return $postsWithIframe;
}

function helsingborg_dsc_startpage_response() {
    return rest_ensure_response([
      backgroundUrl => get_option('hdsc-startpage-setting-background-url'),
      heading => get_option('hdsc-startpage-setting-heading', 'Digital Service Center'),
      topLinks => get_top_links(get_option('hdsc-startpage-setting-top-links', [])),
      visitorHeading => get_option('hdsc-startpage-setting-visitor-heading', 'Visitor'),
      visitorTags => get_visitor_or_local_tags('visitor'),
      visitorPosts => get_visitor_or_local_posts('visitor'),

      localHeading => get_option('hdsc-startpage-setting-local-heading', 'Local'),
      localTags => get_visitor_or_local_tags('local'),
      localPosts => get_visitor_or_local_posts('local'),

      eventsHeading => get_option('hdsc-startpage-setting-events-heading', 'Events'),
      eventsTags => array_map(function($category_id) {
        $category = get_category($category_id);
        return [
          name => html_entity_decode($category->name),
          href => '/events/category/' . $category->slug
        ];
      }, get_categories_for_posts(helsingborg_dsc_startpage_get_upcoming_events())),
      eventsPosts => array_map(function($post) {
        return post_mapping_helper($post, 'events');
      }, helsingborg_dsc_startpage_get_upcoming_events()),
    ]);
}

function helsing_dsc_startpage_register_routes() {
    register_rest_route( 'wp/v2', '/startpage', [
      methods  => WP_REST_Server::READABLE,
      callback => helsingborg_dsc_startpage_response
    ]);
}

add_action('rest_api_init', helsing_dsc_startpage_register_routes);
