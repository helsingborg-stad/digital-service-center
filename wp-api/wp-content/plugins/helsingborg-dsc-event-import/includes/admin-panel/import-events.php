<?php
/*******************************
* import functions
*******************************/

add_action( 'admin_post_manually_create_and_update_events', 'manually_create_and_update_events' );

function manually_create_and_update_events() {
  $number_of_events = $_POST['manual_number_of_events'];
  create_and_update_events();
}

function create_and_update_events() {

  import_event_categories();

  $start_date = date('Y-m-d');
  $end_date = date('Y-m-d', strtotime('+3 months', strtotime($start_date)));
  $events = get_event_json($start_date, $end_date);

  $event_ids_to_keep = array_map(function ($event) { return (string)$event->id; }, $events);

  $already_imported_events_to_remove = get_posts([
    post_type => 'imported_event',
    numberposts => -1,
    meta_query => [[
      key => 'event_id',
      value => $event_ids_to_keep,
      compare => 'NOT IN'
    ]]
  ]);

  foreach ($already_imported_events_to_remove as $event_to_remove) {
    wp_trash_post($event_to_remove->ID);
  }

  foreach($events as $event) {
    if(does_event_already_exist($event)){
        $stored_event = get_stored_event($event);
        update_event($event, $stored_event, $stored_event->ID);
        insert_event_category($stored_event->ID, $event);
    } else {
      $post_id = insert_event_post_type($event);
      insert_event_category($post_id, $event);
      if($event->featured_media->source_url != null) {
        insert_event_featured_image($post_id, $event);
      }
      if($post_id) {
        insert_event_meta($post_id, $event);
      }
    }
  }

  wp_redirect(admin_url('admin.php?page=helsingborg-dsc-event-import'));
}

function get_event_json($start_date, $end_date) {
  return json_decode(file_get_contents('https://api.helsingborg.se/event/json/wp/v2/event/time?start=' . $start_date . '&end=' . $end_date));
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

function insert_event_category($post_id, $event){
  $event_categories = $event->event_categories;
  if($event_categories != null) {
      foreach($event_categories as $event_category) {
        wp_set_object_terms($post_id, $event_category, 'imported_category');
    }
  }
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
  if($event->featured_media->source_url != null) {
    insert_event_featured_image($post_id, $event);
  }
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

function does_event_already_exist($event) {
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

  return $event_query != null;
}

function get_stored_event($event) {
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

  return $event_query[0]; 
}

function get_event_category_json(){
  $json = file_get_contents('https://api.helsingborg.se/event/json/wp/v2/event_categories');
  $json_decode = json_decode($json);
  return $json_decode;
}

function import_event_categories() {
  $event_categories = get_event_category_json();
  if($event_categories != null) {
    foreach($event_categories as $event_category) {
      wp_insert_term($event_category->name, 'imported_category');
    }
  }
}
