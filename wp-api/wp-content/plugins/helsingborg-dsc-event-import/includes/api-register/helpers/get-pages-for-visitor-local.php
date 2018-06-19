<?php

namespace helsingborg_dsc_event_import;

// TODO: make code more tidy and remove duplication in startpage-api's `post_mapping_helper`
function get_pages_for_visitor_local($section) {
    $args = [
      'post_type' => [
        'page',
        'editable_event'
      ],
      'meta_query' => [
        [
        'key' => 'focus_visitor_local',
        'value' => $section,
        'compare' => 'LIKE'
        ]
      ],
      'posts_per_page' => -1
    ];
  
    $posts = get_posts($args);
  
    $filtered_posts = array_map(function($post) {
        $page = get_current_post_language($post->ID);
        if(!isset($page)) {
          return;
        }
        $iframeMeta = get_post_meta($page->ID, 'event_iframe', false)[0];
        if ($iframeMeta['active'] == 'on' && strlen($iframeMeta['src'])) {
          $response = [
            type => 'iframe',
            name => $page->post_title,
            url => $iframeMeta['src'],
            width => intval($iframeMeta['width'] ?? 0),
            height => intval($iframeMeta['height'] ?? 0),
            offsetTop => intval($iframeMeta['top_offset'] ?? 0),
            offsetLeft => intval($iframeMeta['left_offset'] ?? 0),
            menuOrder => $page->menu_order
          ];
  
          $img_url = get_the_post_thumbnail_url($page->ID);
          if ($img_url) {
            $response['imgUrl'] = $img_url;
          }
          $thumbnail_url = get_the_post_thumbnail_url($page->ID, [232, 148]);
          if ($thumbnail_url) {
            $response['imgThumbnailUrl'] = $thumbnail_url;
          }
  
          return $response;
        }
        else if($page->post_type == 'editable_event') {
          $response = [
            id         => $page->ID,
            slug       => $page->post_name,
            name       => html_entity_decode($page->post_title),
            type       => 'event',
            menuOrder => $page->menu_order
          ];
  
          $thumbnail_url = get_the_post_thumbnail_url($page->ID, [232, 148]);
          if ($thumbnail_url) {
            $response['imgThumbnailUrl'] = $thumbnail_url;
          }

          $response['occasion'] = [];

          return $response;
        }
        else {
          $response = [
            type => 'page',
            name => $page->post_title,
            menuOrder => $page->menu_order
          ];
          if(strpos($response['url'], '__trashed') !== false) {
            return;
          }
          if(strpos(wp_make_link_relative(get_permalink($page)), '?') !== false) {
          $response['url'] = wp_make_link_relative(get_permalink($page)) . '&wordpress';
          } else {
          $response['url'] = wp_make_link_relative(get_permalink($page)) . '?wordpress';
          }
          $img_url = get_the_post_thumbnail_url($page->ID);
          if ($img_url) {
            $response['imgUrl'] = $img_url;
          }
          $thumbnail_url = get_the_post_thumbnail_url($page->ID, [232, 148]);
          if ($thumbnail_url) {
            $response['imgThumbnailUrl'] = $thumbnail_url;
          }
  
          return $response;
        }
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
      if(empty($value)) {
        unset($filtered_posts[$key]);
      }
    }
    return array_values($filtered_posts);
  }
?>