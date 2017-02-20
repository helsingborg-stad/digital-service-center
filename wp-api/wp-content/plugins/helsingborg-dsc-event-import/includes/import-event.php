<?php
/*******************************
* import functions
*******************************/

function get_event_json() {
  $json = file_get_contents('https://api.helsingborg.se/event/json/wp/v2/event');
  $json_decode = json_decode($json);

  return $json_decode;
}

function insert_event_post_type($event) {
  $post_id = wp_insert_post(array (
    'post_type' => 'imported_event',
    'post_title' => $event->title->rendered,
    'post_content' => $event->content->rendered,
    'post_status' => 'publish',
    'comment_status' => 'closed',   
    'ping_status' => 'closed'
  ));

  return $post_id;
}

function insert_event_featured_image($post_id, $event) {
  $image_url        = $event->featured_media->source_url;
  $image_name       = basename($image_url);
  $upload_dir       = wp_upload_dir(); 
  $image_data       = file_get_contents($image_url);
  $unique_file_name = wp_unique_filename( $upload_dir['path'], $image_name );
  $filename         = basename( $unique_file_name );

  if( wp_mkdir_p( $upload_dir['path'] ) ) {
      $file = $upload_dir['path'] . '/' . $filename;
  } else {
      $file = $upload_dir['basedir'] . '/' . $filename;
  }

  file_put_contents( $file, $image_data );

  $wp_filetype = wp_check_filetype( $filename, null );

  $attachment = array(
      'post_mime_type' => $wp_filetype['type'],
      'post_title'     => sanitize_file_name( $filename ),
      'post_content'   => '',
      'post_status'    => 'inherit'
  );

  $attach_id = wp_insert_attachment( $attachment, $file, $post_id );
  require_once(ABSPATH . 'wp-admin/includes/image.php');
  $attach_data = wp_generate_attachment_metadata( $attach_id, $file );
  wp_update_attachment_metadata( $attach_id, $attach_data );
  set_post_thumbnail( $post_id, $attach_id );
}

function insert_event_meta($post_id, $event){
  add_post_meta($post_id, 'event_id', $event->id);
  add_post_meta($post_id, 'featured_media_src', $event->featured_media);  
  add_post_meta($post_id, 'event_categories', $event->event_categories);
  add_post_meta($post_id, 'user_groups', $event->user_groups);
  add_post_meta($post_id, 'event_tags', $event->event_tags);
  add_post_meta($post_id, 'event_link', $event->event_link);
  add_post_meta($post_id, 'additional_links', $event->additional_links);
  add_post_meta($post_id, 'related_events', $event->related_events);
  add_post_meta($post_id, 'occasions', $event->occasions);
  add_post_meta($post_id, 'location', $event->location);
  add_post_meta($post_id, 'additional_locations', $event->additional_locations);
  add_post_meta($post_id, 'organizers', $event->organizers);  
  add_post_meta($post_id, 'supporters', $event->supporters);
  add_post_meta($post_id, 'booking_link', $event->booking_link);
  add_post_meta($post_id, 'booking_phone', $event->booking_phone);
  add_post_meta($post_id, 'age_restriction', $event->age_restriction);
  add_post_meta($post_id, 'membership_cards', $event->membership_cards);
  add_post_meta($post_id, 'price_information', $event->price_information);
  add_post_meta($post_id, 'ticket_includes', $event->ticket_includes);
  add_post_meta($post_id, 'price_adult', $event->price_adult);
  add_post_meta($post_id, 'price_children', $event->price_children);
  add_post_meta($post_id, 'children_age', $event->children_age);
  add_post_meta($post_id, 'price_student', $event->price_student);
  add_post_meta($post_id, 'price_senior', $event->price_senior);
  add_post_meta($post_id, 'senior_age', $event->senior_age);
  add_post_meta($post_id, 'booking_group', $event->booking_group);
  add_post_meta($post_id, 'gallery', $event->gallery);
  add_post_meta($post_id, 'facebook', $event->facebook);
  add_post_meta($post_id, 'twitter', $event->twitter);
  add_post_meta($post_id, 'instagram', $event->instagram);
  add_post_meta($post_id, 'google_music', $event->google_music);
  add_post_meta($post_id, 'apple_music', $event->apple_music);
  add_post_meta($post_id, 'spotify', $event->spotify);
  add_post_meta($post_id, 'soundcloud', $event->soundcloud);
  add_post_meta($post_id, 'deezer', $event->deezer);
  add_post_meta($post_id, 'youtube', $event->youtube);
  add_post_meta($post_id, 'vimeo', $event->vimeo);
}

function create_events() {
  $events = get_event_json();

  foreach($events as $event) {
    $post_id = insert_event_post_type($event);
    insert_event_featured_image($post_id, $event);
    if($post_id) {
      insert_event_meta($post_id, $event);
    }
    break; //only in test purpose, remove when plugin is finished
  }
}