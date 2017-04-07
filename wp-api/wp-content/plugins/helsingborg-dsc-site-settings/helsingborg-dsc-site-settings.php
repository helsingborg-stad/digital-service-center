<?php
/*
Plugin Name: Helsingborg Site Settings
Description: Settings page for assorted site-specific settings
Author: Meridium
Version: 0.1
Author URI: http://meridium.se
Text Domain: Helsingborg-dsc-site-settings
*/

function helsingborg_dsc_site_settings() {
  load_plugin_textdomain( 'Helsingborg-dsc-site-settings', false, 'helsingborg-dsc-site-settings' );
}

include('includes/site-settings-admin.php');
include('includes/site-settings-api.php');

?>