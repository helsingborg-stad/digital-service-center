<?php
/*******************************
* admin interface
*******************************/

add_action('admin_menu', 'helsingborg_dsc_event_import_admin_menu');
 
function helsingborg_dsc_event_import_admin_menu(){
        add_menu_page( $helsingborg_api_event_import, 'Import events', 'manage_options', 'helsingborg-dsc-event-import', 'helsingborg_dsc_event_import_admin_init' );
}
 
function helsingborg_dsc_event_import_admin_init(){
    import_and_update_events_form();
    delete_outdated_events_form();
}

?>