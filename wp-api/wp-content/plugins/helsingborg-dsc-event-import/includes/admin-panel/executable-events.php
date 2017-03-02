<?php
/*******************************
* executable events
*******************************/

add_action( 'admin_post_create_update_and_delete_outdated_events', 'create_update_and_delete_outdated_events' );

function create_update_and_delete_outdated_events() {
  $number_of_events = $_POST['number_of_events'];
  $events = get_event_json($number_of_events);

  foreach($events as $event) {
    $stored_events = compare_event($event);
    if($stored_events != null){
      foreach($stored_events as $stored_event) {
        update_event($event, $stored_event, $stored_event->ID);
      }
    } 
    else {
      $post_id = insert_event_post_type($event);
      insert_event_featured_image($post_id, $event);
      if($post_id) {
        insert_event_meta($post_id, $event);
      }
    }
  }
  wp_redirect(admin_url('admin.php?page=helsingborg-dsc-event-import'));
}

add_action( 'admin_post_delete_outdated_events', 'delete_outdated_events' );

function delete_outdated_events() {
  $args = array(
      'post_type' => 'imported_event'
    );

  $event_query = get_posts($args);

  foreach($event_query as $event) {
    $delete_event = check_event_outdated($event->id);
    if($delete_event){
      $attach_id = get_post_thumbnail_id($event->id);
      wp_delete_attachment($attach_id, true);
      wp_delete_post($stored_event->ID, true);
    }
  }
  wp_redirect(admin_url('admin.php?page=helsingborg-dsc-event-import'));
}

?>