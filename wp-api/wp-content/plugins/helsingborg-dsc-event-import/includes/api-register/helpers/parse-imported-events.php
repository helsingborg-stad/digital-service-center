<?php

namespace helsingborg_dsc_event_import;

//use new get_imported_event_values
function parse_imported_events($events) {
  return array_map(function($event) {
      $post_meta = get_post_meta(get_post_id_original($event->ID, 'imported_event'), 'imported_event_data', true);

      $should_translate = $_REQUEST['lang'] == 'en';
      $lang = $should_translate ? 'en' : 'sv';
      $categories = [];
        if($post_meta->event_categories != null){
          foreach ((array)$post_meta->event_categories as $event_category) {
            global $wpdb;
            $table_name = $wpdb->prefix . 'category_translations';
            $event_category = htmlspecialchars_decode($event_category);
            $included_cat = $wpdb->get_results( "SELECT * FROM `$table_name` WHERE sv='$event_category'" );
            if($included_cat[0]->sv == $event_category){
              $categories[$included_cat[0]->$lang] = $included_cat[0]->icon;
            }
          }
        }

      $translated_title = get_post_meta(get_post_id_original($event->ID, 'imported_event'), 'post_title_translated', true);
      $translated_content = get_post_meta(get_post_id_original($event->ID, 'imported_event'), 'post_content_translated', true);

      $title = $should_translate ? $translated_title : $event->post_title;
      $titleReverse = $should_translate ?  $event->post_title : $translated_title;
      $content = $should_translate ? $translated_content : $event->post_content;
      $contentReverse = $should_translate ?  $event->post_content : $translated_content;

      $response = [
        id         => $event->ID,
        slug       => $event->post_name,
        name       => html_entity_decode(ucfirst($title)),
        type       => 'event',
        content    => $content,
        shortContent => get_short_content($content),
        categories => array_map(function($category) {
          return [
            id   => $category->cat_ID,
            name => $category->name,
            slug => $category->slug
          ];
        }, get_the_category($event->ID)),
        importedCategories => $categories ?? [],
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
        translatedTitle => ucfirst($titleReverse),
        translatedContent => $contentReverse
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