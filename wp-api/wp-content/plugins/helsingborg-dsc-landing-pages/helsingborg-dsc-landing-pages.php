<?php
/*
Plugin Name: Helsingborg Landing pages
Description: Settings for landing pages
Author: Meridium
Version: 0.1
Author URI: http://meridium.se
Text Domain: Helsingborg-dsc-landing-pages
*/

function helsingborg_dsc_landing_pages() {
  load_plugin_textdomain( 'Helsingborg-dsc-landing-pages' );
}

include('includes/landing-pages-settings.php');
include('includes/save-categories.php');
include('includes/landing-pages-categories.php');

?>