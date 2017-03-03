<?php
/*
Plugin Name: Helsingborg Startpage
Description: Page type for Startpage
Author: Meridium
Version: 0.1
Author URI: http://meridium.se
Text Domain: Helsingborg-dsc-startpage
*/

function helsingborg_dsc_startpage() {
  load_plugin_textdomain( 'Helsingborg-dsc-startpage', false, 'helsingborg-dsc-startpage-plugin' );
}

include('includes/startpage-settings.php');
include('includes/startpage-api.php');

?>