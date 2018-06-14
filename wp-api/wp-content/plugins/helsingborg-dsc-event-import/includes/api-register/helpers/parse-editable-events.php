<?php

namespace helsingborg_dsc_event_import;

function parse_editable_events($events) {
    return array_map(function($event) {
      //TODO: Make this cleaner
      //Docs: https://wpml.org/documentation/support/wpml-coding-api/wpml-hooks-reference
      $current_lang = apply_filters( 'wpml_current_language', NULL );
      $isTranslated = apply_filters( 'wpml_element_has_translations', NULL, $event->ID, 'editable_event' );
      $args = array('element_id' => $event->ID, 'element_type' => 'editable_event' );
      $my_category_language_info = apply_filters( 'wpml_element_language_details', null, $args );
      $get_translation = apply_filters( 'wpml_get_element_translations', NULL, $my_category_language_info->trid, 'editable_event' );
      $translated_post = null;
      foreach($get_translation as $key => $val) {
        if($current_lang == 'sv' && $key == 'en'){
          $translated_post = get_post($val->element_id);
        } elseif ($current_lang == 'en' && $key == 'sv') {
          $translated_post = get_post($val->element_id);
        }
      }

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
        translatedTitle => html_entity_decode($translated_post->post_title),
        translatedContent => $translated_post->post_content
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
      if(strlen($occasion['start_date']) && strlen($occasion['end_date'])){
        $response['occasions'] = [[
          startDate => str_replace('T', ' ', $occasion['start_date']),
          endDate => str_replace('T', ' ', $occasion['end_date']),
          doorTime => str_replace('T', ' ', $occasion['door_time'])
        ]];
      }else{
        $response['occasion'] = [];
      }

  
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