<?php
/*
Plugin Name: Helsingborg editable event
Description: Editable event post type
Author: Meridium
Version: 0.1
Author URI: http://meridium.se
Text Domain: Helsingborg-editable-event

/*******************************
* global variables
*******************************/
$helsingborg_api_event_import = 'Helsingborg editable event';
/*******************************
* includes
*******************************/

function helsingborg_editable_event_init() {
  load_plugin_textdomain( 'Helsingborg-editable-event', false, 'helsingborg-editable-event-plugin' );
}

include('includes/event-post.php');

?>