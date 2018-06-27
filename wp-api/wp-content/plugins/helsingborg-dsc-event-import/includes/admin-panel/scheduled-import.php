<?php
/*******************************
* scheduled import
*******************************/

function register_scheduled_event_options() {
  register_setting( 'scheduled-event-import-settings-group', 'scheduled_recurrence');
  register_setting( 'scheduled-event-import-settings-group', 'schedule_activated');
}

function activate_scheduled_event_import() {
  if(!wp_next_scheduled( 'scheduled_event_import' )){
    wp_schedule_event(time(), 'twicedaily', 'scheduled_event_import'); 
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