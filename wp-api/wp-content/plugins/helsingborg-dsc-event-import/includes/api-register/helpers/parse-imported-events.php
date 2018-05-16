<?php

namespace helsingborg_dsc_event_import;

//use new get_imported_event_values
function parse_imported_events($events) {
    return array_map(function($event) {
      $post_meta = get_post_meta(get_post_id_original($event->ID, 'imported_event'), 'imported_event_data', true);
      $response = [
        id         => $event->ID,
        slug       => $event->post_name,
        name       => html_entity_decode($event->post_title),
        type       => 'event',
        content    => $event->post_content,
        shortContent => get_short_content($event->post_content),
        categories => array_map(function($category) {
          return [
            id   => $category->cat_ID,
            name => $category->name,
            slug => $category->slug
          ];
        }, get_the_category($event->ID)),
        occasions => array_map(function($occasion) {
          return [
            startDate => $occasion->start_date,
            endDate => $occasion->end_date,
            doorTime => $occasion->door_time
          ];
        }, $post_meta->occasions ?? []),
        location => [
          id => $post_meta->location->id,
          title => $post_meta->location->title,
          streetAddress => $post_meta->location->street_address,
          city => $post_meta->location->city,
          postalCode => $post_meta->location->postal_code,
          latitude => floatval($post_meta->location->latitude),
          longitude => floatval($post_meta->location->longitude)
        ],
        youtubeUrl => $post_meta->youtube,
        vimeoUrl => $post_meta->vimeo,
        lang => $post_meta->translations
      ];
  
      if ($post_meta->booking_link) {
        $response['bookingLink'] = $post_meta->booking_link;
      }
  
      $organizer = $post_meta->organizers && $post_meta->organizers[0] ? $post_meta->organizers[0] : null;
      if ($organizer && $organizer->contacts && $organizer->contacts[0] && strlen($organizer->contacts[0]->email)) {
        $response['contactEmail'] = $organizer->contacts[0]->email;
      }
      if ($organizer && $organizer->contacts && $organizer->contacts[0] && strlen($organizer->contacts[0]->phone_number)) {
        $response['contactPhone'] = $organizer->contacts[0]->phone_number;
      }
  
      $img_url = get_the_post_thumbnail_url($event->ID);
      if ($img_url) {
        $response['imgUrl'] = $img_url;
      }
      $thumbnail_url = get_the_post_thumbnail_url($event->ID, [232, 148]);
      if ($thumbnail_url) {
        $response['imgThumbnailUrl'] = $thumbnail_url;
      }
      return $response;
    }, $events);
  }
?>