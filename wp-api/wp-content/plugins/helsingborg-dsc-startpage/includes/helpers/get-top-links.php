<?php

namespace helsingborg_dsc_startpage;

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
