<?php
/*
Plugin Name: Helsingborg Category Translations
Description: Admin page for managing event category translations
Author: Meridium
Version: 0.1
Author URI: http://meridium.se
Text Domain: Helsingborg-dsc-category-translations
*/

function helsingborg_dsc_category_translations() {
  load_plugin_textdomain( 'Helsingborg-dsc-category-translations', false, 'helsingborg-dsc-category-translations' );
}

include('includes/category-translations-admin.php');

?>