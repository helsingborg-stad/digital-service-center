<?php
/*******************************
* executable events
*******************************/

add_action( 'admin_post_manually_create_and_update_events', 'manually_create_and_update_events' );

function manually_create_and_update_events() {
  $number_of_events = $_POST['manual_number_of_events'];
  create_and_update_events($number_of_events);
}

function create_and_update_events($number_of_events) {
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

  $stored_events = get_posts($args);
  $number_of_stored_events = wp_count_posts('imported_event')->publish;
  $events = get_event_json($number_of_stored_events);
  check_and_delete_outdated_events($stored_events, $events);

  wp_redirect(admin_url('admin.php?page=helsingborg-dsc-event-import'));
}

function register_scheduled_event_options() {
  register_setting( 'scheduled-event-import-settings-group', 'scheduled_number_of_events', 'intval');
  register_setting( 'scheduled-event-import-settings-group', 'scheduled_timestamp');
  register_setting( 'scheduled-event-import-settings-group', 'scheduled_recurrence');
  register_setting( 'scheduled-event-import-settings-group', 'schedule_activated');
}

function activate_scheduled_event_import() {
  $run_import = get_option('schedule_activated');
    if ($run_import) {
      $scheduled_recurrence = get_option('scheduled_recurrence');
      $scheduled_timestamp = get_option('scheduled_timestamp');
	    wp_schedule_event(strtotime($scheduled_timestamp), $scheduled_recurrence, 'scheduled_event_import');
    } 
    else {
      $next_timestamp = wp_next_scheduled( 'scheduled_event_import' );
      wp_unschedule_event( $next_timestamp, 'scheduled_event_import');
    }
}

add_action('scheduled_event_import', 'create_update_and_delete_outdated_events');

function create_update_and_delete_outdated_events() {
  $scheduled_number_of_events = get_option('scheduled_number_of_events');
  delete_outdated_events();
  create_and_update_events($scheduled_number_of_events);
}

function deactivate_scheduled_event_import() {
	wp_clear_scheduled_hook('scheduled_event_import');
}

?>