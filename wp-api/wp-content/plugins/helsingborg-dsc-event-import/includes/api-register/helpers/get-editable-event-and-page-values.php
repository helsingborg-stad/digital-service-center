<?php

namespace helsingborg_dsc_event_import;

function get_editable_event_and_page_values($post) {
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
           offsetLeft => intval($iframeMeta['left_offset'] ?? 0)
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
           content    => $page->post_content,
           categories => array_map(function($category) {
             return [
               id   => $category->cat_ID,
               name => $category->name,
               slug => $category->slug
             ];
           }, get_the_category($page->ID)),
         ];
 
         $img_url = get_the_post_thumbnail_url($page->ID);
         if ($img_url) {
           $response['imgUrl'] = $img_url;
         }
         $thumbnail_url = get_the_post_thumbnail_url($page->ID, [232, 148]);
         if ($thumbnail_url) {
           $response['imgThumbnailUrl'] = $thumbnail_url;
         }
 
         $booking_link = get_post_meta($page->ID, 'booking_link', true);
         if ($booking_link) {
           $response['bookingLink'] = $booking_link;
         }
 
         $occasion = get_post_meta($page->ID, 'occasions', true);
         if (strlen($occasion['start_date']) && strlen($occasion['end_date']) && strlen($occasion['door_time'])) {
           $response['occasions'] = [[
             startDate => str_replace('T', ' ', $occasion['start_date']),
             endDate => str_replace('T', ' ', $occasion['end_date']),
             doorTime => str_replace('T', ' ', $occasion['door_time'])
           ]];
         }
 
         $location = get_post_meta($page->ID, 'location', true);
         $response['location'] = [
           streetAddress => $location['street_address'],
           city => $location['city'],
           postalCode => $location['postal_code'],
           latitude => floatval($location['latitude']),
           longitude => floatval($location['longitude'])
         ];
 
         $youtubeUrl = get_post_meta($page->ID, 'youtube', true);
         if ($youtubeUrl) {
           $response['youtubeUrl'] = $youtubeUrl;
         }
 
         $vimeoUrl = get_post_meta($page->ID, 'vimeo', true);
         if ($vimeoUrl) {
           $response['vimeoUrl'] = $vimeoUrl;
         }
 
         return $response;
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
 }
?>