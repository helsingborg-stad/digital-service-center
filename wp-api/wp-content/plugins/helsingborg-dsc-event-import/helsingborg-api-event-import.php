<?php
/*
Plugin Name: Helsingborg API event import
Description: Import events from Helsingborg event API
Author: Meridium
Version: 0.1
Author URI: http://meridium.se
Text Domain: Helsingborg-dsc-event-import

/*******************************
* global variables
*******************************/
$helsingborg_api_event_import = 'Helsingborg API event import plugin';
/*******************************
* includes
*******************************/

function helsingborg_api_event_import_init() {
  load_plugin_textdomain( 'Helsingborg-API-event-import', false, 'helsingborg-api-event-import-plugin' );
}

include('includes/post-types/import-event-post-type.php');
include('includes/post-types/editable-event-post-type.php');

include('includes/api-register/api-meta-callbacks.php');
include('includes/api-register/register-meta-api.php');

include('includes/admin-panel/import-event.php');
include('includes/admin-panel/executable-events.php');
include('includes/admin-panel/display-functions.php');
include('includes/admin-panel/import-event-admin.php');

?>