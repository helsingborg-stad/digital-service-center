<?php
/*
Plugin Name: Helsingborg places import from google
Description: Imports places från google place api
Author: Meridium
Version: 0.1
Author URI: http://meridium.se
Text Domain: Helsingborg-dsc-google-place
*/

/*******************************
* global variables
*******************************/

$helsingborg_dsc_google_places = 'Helsingborg DSC Google places plugin';

function helsingborg_dsc_google_places_init() {
  load_plugin_textdomain( 'Helsingborg-dsc-google-places', false, 'helsingborg-dsc-google-places-plugin' );
}

/*******************************
* includes
*******************************/

include('includes/load-scripts.php');
include('includes/save-google-places.php');
include('includes/delete-google-places.php');
include('includes/google-places-admin.php');
include('includes/register-google-places-api.php');

?>