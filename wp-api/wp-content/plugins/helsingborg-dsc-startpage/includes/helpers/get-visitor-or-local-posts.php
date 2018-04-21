<?php

namespace helsingborg_dsc_startpage;

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

  usort($filtered_posts, function ($a, $b) {
    return $b['menuOrder'] <=> $a['menuOrder'];
  });

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
    if (empty($value)) {
      unset($filtered_posts[$key]);
    }
  }
  return array_values($filtered_posts);
}