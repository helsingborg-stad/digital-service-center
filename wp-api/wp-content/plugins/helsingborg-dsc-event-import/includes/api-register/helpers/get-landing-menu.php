<?php

namespace helsingborg_dsc_event_import;

function get_landing_menu($menu_name){
    $locations = get_nav_menu_locations();
    $menu_items = wp_get_nav_menu_items($locations[$menu_name]);
    if($menu_items == NULL) {
      return null;
    }
    $filtered_menu = array_map(function($menu_item){
      $menu_item_id = $menu_item->ID;
      $item = get_current_post_language($menu_item_id);
      if(!isset($item)){
        return;
      }
      $type = $menu_item->object;
      $icon_name = get_post_meta($menu_item_id, '_custom_icon', true);
      $custom_classes = [];
      if($menu_item->classes[0] != null) {
          $custom_classes = $menu_item->classes;
      }
      if($type == 'category') {
          return [
            menuId => $menu_item_id,
            menuParentId => $menu_item->menu_item_parent,
            type => $type,
            name => $menu_item->title,
            iconName => $icon_name,
            id => intval($menu_item->object_id),
            customClasses => $custom_classes
        ];
      }
      if($type == 'editable_event' || $type == 'page'){
        $post = get_post($menu_item->object_id);
        $filtered_post = get_editable_event_and_page_values($post);
        $filtered_post['menuId'] = $menu_item_id;
        $filtered_post['menuParentId'] = $menu_item->menu_item_parent;
        $filtered_post['iconName'] = $icon_name;
        $filtered_post['customClasses'] = $custom_classes;
        return $filtered_post;
      }
      if($type == 'imported_event') {
        $post = get_post($menu_item->object_id);
        $filtered_post = get_imported_event_values($post);
        $filtered_post['menuId'] = $menu_item_id;
        $filtered_post['menuParentId'] = $menu_item->menu_item_parent;
        $filtered_post['iconName'] = $icon_name;
        $filtered_post['customClasses'] = $custom_classes;
        return $filtered_post;
      }
      if($type == 'editable_place') {
        $post = get_current_post_language($menu_item->object_id);
        $post_meta = get_post_meta($menu_item->object_id, 'place_google_query', false);
        if($post_meta[0]['active'] == 'on'){
          $place = [
            menuId => $menu_item_id,
            menuParentId => $menu_item->menu_item_parent,
            type => 'googleQueryPlace',
            name => $menu_item->title,
            iconName => $icon_name,
            customClasses => $custom_classes,
            iframeUrl => $post_meta[0]['iframe_url']
          ];
          if(ICL_LANGUAGE_CODE == 'en') {
            $place['iframeUrl'] = $post_meta[0]['iframe_url'] . '&language=en';
          }
          return $place;
        }
        return;
      }
    }, $menu_items);

  foreach($filtered_menu as $key => $value) {
    if($value == null) {
      unset($filtered_menu[$key]);
    }
  }

  if($filtered_menu == NULL || empty(array_values($filtered_menu))) {
      return null;
  }

  $ordered_menu = [];
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

  $i = 0;
  //first level
  foreach($filtered_menu as $menu_item) {
    if($menu_item['menuParentId'] == '0') {
      $ordered_menu[$menu_item['menuId']] = $menu_item;
      if($ordered_menu[$menu_item['menuId']]['type'] == 'category' || $ordered_menu[$menu_item['menuId']]['type'] == 'googleQueryPlace') {
        $ordered_menu[$menu_item['menuId']]['activeColor'] = $colors[$i];
        $i++;
        if($i == 12) {
          $i = 0;
        }
      }
    }
  }

  //second level
  foreach($filtered_menu as $menu_item) {
    if($menu_item['menuParentId'] != '0' && $ordered_menu[$menu_item['menuParentId']] != null) {
      if(!is_array($ordered_menu[$menu_item['menuParentId']]['subItems'])) {
        $ordered_menu[$menu_item['menuParentId']]['subItems'] = [];
      }
      array_push($ordered_menu[$menu_item['menuParentId']]['subItems'], $menu_item);
    }
  }

  return array_values($ordered_menu) ?? null;
}
?>