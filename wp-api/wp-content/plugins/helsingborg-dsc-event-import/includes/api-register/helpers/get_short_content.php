<?php

namespace helsingborg_dsc_event_import;

function get_short_content($post_content) {
    $contains_more_html_comment = preg_match('/<!--more-->/', $post_content);
    if ($contains_more_html_comment) {
      $post_content = substr($post_content, 0, strpos($post_content, '<!--more-->'));
      $post_content = preg_replace('/<p>/', '', $post_content);
    }
    $decoded = trim(html_entity_decode($post_content));
    return strlen($decoded) > 100
      ? substr(html_entity_decode($post_content), 0, 100) . '...'
      : $decoded;
  }
?>