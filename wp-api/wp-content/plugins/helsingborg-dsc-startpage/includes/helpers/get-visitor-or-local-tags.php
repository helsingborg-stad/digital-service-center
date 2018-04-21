<?php

namespace helsingborg_dsc_startpage;

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
