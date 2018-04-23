<?php

namespace helsingborg_dsc_event_import;

function parse_category_to_landing_page_format($cat_id, $color, $icon_name, $sub_category_ids) {
    $cat = get_category($cat_id);
    $response = [
      id => $cat->cat_ID,
      name => html_entity_decode($cat->cat_name),
      activeColor => $color,
      iconName => $icon_name,
    ];
    $response['subCategories'] = array_map(function($sub_cat_id) use ($color) {
      $sub_cat = get_category($sub_cat_id);
      return [
        id => $sub_cat->cat_ID,
        name => html_entity_decode($sub_cat->cat_name),
        activeColor => $color
      ];
    }, $sub_category_ids);
    usort($response['subCategories'], function ($a, $b) {
      return $a['name'] <=> $b['name'];
    });
    return $response;
  }
?>