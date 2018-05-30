<?php

namespace helsingborg_dsc_event_import;

function parse_editable_events($events) {
    return array_map(function($event) {
      $response = [
        id         => $event->ID,
        slug       => $event->post_name,
        name       => html_entity_decode($event->post_title),
        type       => 'event',
        content    => $event->post_content,
        categories => array_map(function($category) {
          return [
            id   => $category->cat_ID,
            name => $category->name,
            slug => $category->slug
          ];
        }, get_the_category($event->ID)),
        importedCategories => [],
      ];
  
      $img_url = get_the_post_thumbnail_url($event->ID);
      if ($img_url) {
        $response['imgUrl'] = $img_url;
      }
      $thumbnail_url = get_the_post_thumbnail_url($event->ID, [232, 148]);
      if ($thumbnail_url) {
        $response['imgThumbnailUrl'] = $thumbnail_url;
      }
  
      $booking_link = get_post_meta($event->ID, 'booking_link', true);
      if ($booking_link) {
        $response['bookingLink'] = $booking_link;
      }
  
      $occasion = get_post_meta($event->ID, 'occasions', true);
      $response['occasions'] = [[
        startDate => str_replace('T', ' ', $occasion['start_date']),
        endDate => str_replace('T', ' ', $occasion['end_date']),
        doorTime => str_replace('T', ' ', $occasion['door_time'])
      ]];

  
      $location = get_post_meta($event->ID, 'location', true);
      $response['location'] = [
        streetAddress => isset($location['street_address']) ? $location['street_address'] : "",
        city => isset($location['city']) ? $location['city'] : "",
        postalCode => isset($location['postal_code']) ? $location['postal_code'] : "",
        latitude => isset($location['latitude']) ? floatval($location['latitude']) : "",
        longitude => isset($location['longitude']) ? floatval($location['longitude']) : ""
      ];
  
      $youtubeUrl = get_post_meta($event->ID, 'youtube', true);
      if ($youtubeUrl) {
        $response['youtubeUrl'] = $youtubeUrl;
      }
  
      $vimeoUrl = get_post_meta($event->ID, 'vimeo', true);
      if ($vimeoUrl) {
        $response['vimeoUrl'] = $vimeoUrl;
      }
  
      return $response;
    }, $events);
  }
?>  