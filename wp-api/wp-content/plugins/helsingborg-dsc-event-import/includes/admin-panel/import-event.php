<?php
/*******************************
* import functions
*******************************/

function get_event_json($number_of_events) {
  $json;
  
  if(intval($number_of_events) > 0){
    $json = file_get_contents('https://api.helsingborg.se/event/json/wp/v2/event/?per_page=' . $number_of_events );
  }
  else {
    $json = file_get_contents('https://api.helsingborg.se/event/json/wp/v2/event');
  }
  
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

function update_event_featured_image($post_id, $event) {
  $attach_id = get_post_thumbnail_id($post_id);
  wp_delete_attachment($attach_id, true);
  insert_event_featured_image($post_id, $event);
}

function insert_event_meta($post_id, $event){
  add_post_meta($post_id, 'imported_event_data', $event);
  add_post_meta($post_id, 'event_id', $event->id);
}

function update_event($event, $stored_event, $post_id) {
  if($event->title->rendered !=$stored_event->post_title || 
  $event->content->rendered != $stored_event->post_content ){
    $updated_post = array(
      'ID' => $stored_event->ID,
      'post_title' => $event->title->rendered,
      'post_content' => $event->content->rendered
    );
      wp_update_post($updated_post);
  }

  $featured_media_url = wp_get_attachment_url( get_post_thumbnail_id($post_id) );
  if(basename($event->featured_media->source_url) != basename($featured_media_url)) {
    update_event_featured_image($post_id, $event);
  }

  $stored_event_imported_data = get_post_meta($post_id, 'imported_event_data');
  if($stored_event_imported_data != $event) {
    update_post_meta($post_id, 'imported_event_data', $event);
  }
}

function compare_event($event) {
  $args = array(
    'post_type' => 'imported_event',
    'meta_query' => array(
      array(
          'key' => 'event_id',
          'value' => $event->id
      )
    )
  );
  $event_query = get_posts($args);

  return $event_query;
}

function check_event_outdated($post_id) {
  $stored_imported_event_data = get_post_meta($post_id, 'imported_event_data', true);
  $last_end_date;
  $compare_date;
  $date_now = date('Y-m-d H:i');
  if($stored_imported_event_data->occasions != null) {
    foreach($stored_imported_event_data->occasions as $occasion) {
      if($compare_date < $occasion->end_date) {
        $last_end_date = $occasion->end_date;
      }
      $compare_date = $occasion->end_date;
    }

    if($last_end_date < $date_now) {
      return true;
    }
  }
  return false;
}