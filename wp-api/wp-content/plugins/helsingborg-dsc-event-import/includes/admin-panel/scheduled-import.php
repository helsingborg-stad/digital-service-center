<?php
/*******************************
* scheduled import
*******************************/

function register_scheduled_event_options() {
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
  create_and_update_events();
}

function deactivate_scheduled_event_import() {
  wp_clear_scheduled_hook('scheduled_event_import');
}

?>