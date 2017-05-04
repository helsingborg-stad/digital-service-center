<?php
/*
Plugin Name: Helsingborg CRM Import
Description: Settings page for CRM import
Author: Meridium
Version: 0.1
Author URI: http://meridium.se
Text Domain: Helsingborg-dsc-crm-import
*/

function helsingborg_dsc_crm_import() {
  load_plugin_textdomain( 'Helsingborg-dsc-crm-import', false, 'helsingborg-dsc-crm-import' );
}

include('includes/crm-import.php');
include('includes/crm-display-function.php');
include('includes/helsingborg-dsc-crm-import-admin.php');

?>