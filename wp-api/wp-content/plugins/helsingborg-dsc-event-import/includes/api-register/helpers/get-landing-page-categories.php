<?php

namespace helsingborg_dsc_event_import;

function get_landing_page_categories($option, $categories_to_include) {
    $mapped_categories = get_option($option, []);
    if(!is_array($mapped_categories)) {
      $mapped_categories = [];
    }
    $main_cats = array_map(function($map) { return $map['main_category']; }, $mapped_categories);
    // Remove mapped categories with no matched events
    foreach ($mapped_categories as $idx=>$mapped_cat) {
      $main_cat = $mapped_cat['main_category'];
      $sub_cats = $mapped_cat['sub_categories'];
      $main_category_included = in_array($main_cat, $categories_to_include);
      $included_sub_categories_count = count(array_intersect($sub_cats, $categories_to_include));
      // Remove entire category + sub-category pair if no match is found
      if (!$main_category_included && count($included_sub_categories_count) == 0) {
        unset($mapped_categories[$idx]);
      }
      // Remove any unmapped sub-categories or sub-categories already existing as main-categories
      foreach($sub_cats as $sub_cat_idx=>$sub_cat) {
        if (!in_array($sub_cat, $categories_to_include) || in_array($sub_cat, $main_cats)) {
          unset($mapped_categories[$idx]['sub_categories'][$sub_cat_idx]);
        }
      }
    }
  
    $colors = [
      '#f7a600',
      '#e3000f',
      '#a84c98',
      '#4db4e7',
      '#76b828',
      '#0095db',
      '#d35098',
      '#f7a600',
      '#e3000f',
      '#a84c98',
      '#4db4e7',
      '#76b828',
      '#0095db'
    ];
  
    $res = [];
    foreach ($mapped_categories as $idx=>$cat_map) {
      $res[] = parse_category_to_landing_page_format($cat_map['main_category'], $colors[$idx], $cat_map['icon_name'], $cat_map['sub_categories']);
    }
    usort($res, function ($a, $b) {
      return $a['name'] <=> $b['name'];
    });
    return $res;
  }
?>