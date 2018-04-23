<?php

namespace helsingborg_dsc_event_import;

function get_links_for_option($option) {
    $saved_posts = get_option($option, []);
    if(!is_array($saved_posts)){
      $saved_posts = [];
    }
    $posts = array_map(function($pageId) {
        $page = get_current_post_language($pageId);
        if(!isset($page)) {
          return;
        }
        $iframeMeta = get_post_meta($page->ID, 'event_iframe', false)[0];
        if ($iframeMeta['active'] == 'on' && strlen($iframeMeta['src'])) {
          return [
            type => 'iframe',
            name => $page->post_title,
            url => $iframeMeta['src'],
            width => intval($iframeMeta['width'] ?? 0),
            height => intval($iframeMeta['height'] ?? 0),
            offsetTop => intval($iframeMeta['top_offset'] ?? 0),
            offsetLeft => intval($iframeMeta['left_offset'] ?? 0)
          ];
        }
        else {
          $response = [
            type => 'page',
            name => $page->post_title
          ];
          if(strpos(wp_make_link_relative(get_permalink($page)), '?') !== false) {
            $response['url'] = wp_make_link_relative(get_permalink($page)) . '&wordpress';
          } else {
            $response['url'] = wp_make_link_relative(get_permalink($page)) . '?wordpress';
          }
          return $response;
        }
      }, $saved_posts
    );
    foreach($posts as $key => $value) {
      if(empty($value)) {
        unset($posts[$key]);
      }
    }
    return array_values($posts);
  }
  
?>