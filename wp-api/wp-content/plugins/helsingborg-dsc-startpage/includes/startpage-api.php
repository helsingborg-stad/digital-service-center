<?php

function helsingborg_dsc_startpage_get_upcoming_events() {
  $imported_posts = get_posts([ post_type => 'imported_event', 'suppress_filters' => false, numberposts => -1]);
  $imported_upcoming = array_filter($imported_posts, function($post) {
    $post_meta = get_post_meta(get_post_id_original($post->ID, 'imported_event'), 'imported_event_data', true);
    $door_times = array_map(function($occasion) {
      return [
          door_time => $occasion->door_time,
          end_time => $occasion->end_time
        ];
    }, $post_meta->occasions ?? []);
    $is_today_or_later = !empty(array_filter($door_times, function($door_time) {
      return date('Y-m-d', strtotime($door_time['door_time'])) >= date('Y-m-d') || date('Y-m-d', strtotime($door_time['end_time'])) >= date('Y-m-d');
    }));
    return $is_today_or_later;
  });
  $editable_posts = get_posts([ post_type => 'editable_event', 'suppress_filters' => false, numberposts => -1]);
  $editable_upcoming = array_filter($editable_posts, function($post) {
    $occasions = get_post_meta($post->ID, 'occasions', false);
    $door_time = $occasions[0]['door_time'];
    $end_date = $occasions[0]['end_date'];
    $is_today_or_later = date('Y-m-d', strtotime($door_time)) >= date('Y-m-d') || date('Y-m-d', strtotime($end_date)) >= date('Y-m-d');
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
      offsetLeft => intval($iframeMeta['left_offset'] ?? 0)
    ];
    $thumbnail_url = get_the_post_thumbnail_url($page->ID);
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
    ];
    $thumbnail_url = get_the_post_thumbnail_url($page->ID);
    if ($thumbnail_url) {
      $response['imgUrl'] = $thumbnail_url;
    }
    return $response;
  } else {
    $response = [
      type => 'page',
      heading  => html_entity_decode($page->post_title),
      preamble => get_preamble($page->post_content)
    ];
    if(strpos(wp_make_link_relative(get_permalink($page)), '?') !== false) {
      $response['url'] = wp_make_link_relative(get_permalink($page)) . '&wordpress';
    }
    else {
      $response['url'] = wp_make_link_relative(get_permalink($page)) . '?wordpress';
    }
    $thumbnail_url = get_the_post_thumbnail_url($page->ID);
    if ($thumbnail_url) {
      $response['imgUrl'] = $thumbnail_url;
    }
    return $response;
  }
}

// Gets imported and editable events for either 'visitor' or 'local' category, and returns a merged array
function get_visitor_or_local_posts($type) {
  $args = [
    'post_type' => [
      'page',
      'editable_event'
    ],
    'meta_query' => [
      [
      'key' => 'focus_visitor_local',
      'value' => $type,
      'compare' => 'LIKE'
      ]
    ],
    'posts_per_page' => -1
  ];

  $posts = get_posts($args);

  $filtered_posts = array_map(function($post) use ($type) {
    return post_mapping_helper($post, $type);
  }, $posts);

  $post_urls = [];
  foreach($filtered_posts as $key => $value) {
    if( ($value['href'] && in_array($value['href'], $post_urls)) || ($value['url'] && in_array($value['url'], $post_urls)) ) {
      unset($filtered_posts[$key]);
    }
    if ($value['href']) {
      $post_urls[] = $value['href'];
    }
    else if ($value['url']) {
      $post_urls[] = $value['url'];
    }
    if(empty($value)) {
      unset($filtered_posts[$key]);
    }
  }
  return array_values($filtered_posts);
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
      href => get_link_language_prefix() . $type . '?category=' . $mapped_cat['main_category']
    ];
  }
  return $response;
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

function get_link_language_prefix() {
  if(!function_exists('icl_get_languages')) {
    return '/';
  }
  global $sitepress;
  $lang = $_REQUEST['lang'] ?? $sitepress->get_default_language();

    return '/' . $lang . '/';
}

function get_top_links($pages) {
  if(!is_array($pages)) {
    $pages = [];
  }
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
    if($iframeMeta['active'] == 'on' && strlen($iframeMeta['src'])) {
      return [
        type => 'iframe',
        name => $page->post_title,
        url => $iframeMeta['src'],
        width => intval($iframeMeta['width'] ?? 0),
        height => intval($iframeMeta['height'] ?? 0),
        offsetTop => intval($iframeMeta['top_offset'] ?? 0),
        offsetLeft => intval($iframeMeta['left_offset'] ?? 0)
      ];
    } else {
      $response = [
        type => 'page',
        name => $page->post_title
      ];
      if(strpos(wp_make_link_relative(get_permalink($page)), '?') !== false) {
        $response['url'] = wp_make_link_relative(get_permalink($page)) . '&wordpress';
      }
      else {
        $response['url'] = wp_make_link_relative(get_permalink($page)) . '?wordpress';
      }
      return $response;
    }
  }, $pages);

  foreach($posts as $key => $value) {
    if(!$value || $value == null) {
      unset($posts[$key]);
    }
  }
  return $posts;
}

function helsingborg_dsc_startpage_response() {
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

function helsing_dsc_startpage_register_routes() {
    register_rest_route( 'wp/v2', '/startpage', [
      methods  => WP_REST_Server::READABLE,
      callback => helsingborg_dsc_startpage_response
    ]);
}

add_action('rest_api_init', helsing_dsc_startpage_register_routes);
