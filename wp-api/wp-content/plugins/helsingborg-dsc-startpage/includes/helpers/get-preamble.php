<?php

namespace helsingborg_dsc_startpage;

// Gets the shortform of a post's content
function get_preamble($post_content) {
  $contains_more_html_comment = preg_match('/<!--more-->/', $post_content);
  if ($contains_more_html_comment) {
    // Get all text before "<!--more-->" and strip all <p> tags manually
    $post_content = substr($post_content, 0, strpos($post_content, "<!--more-->"));
    $post_content = preg_replace('/<p[^>]*>(.*)<\/p[^>]*>/i', '$1', $post_content);
  }
  $decoded = trim(strip_tags(html_entity_decode($post_content)));
  return strlen($decoded) > 100
    ? substr($decoded, 0, 100) . '...'
    : $decoded;
}
