<?php
/*
Plugin Name: Helsingborg Show Order Column
Description: Show a column for page order in all tables listing pages in wp-admin
Author: Meridium
Version: 0.1
Author URI: http://meridium.se
Text Domain: Helsingborg-dsc-show-order-column
*/

function helsingborg_dsc_show_order_column() {
  load_plugin_textdomain('Helsingborg-dsc-show-order-column',  false, 'helsingborg-dsc-show-order-column');
}

// Add order column to admin listing screen for header text
function add_new_header_text_column($header_text_columns) {
  $header_text_columns['menu_order'] = "menu_order";
  return $header_text_columns;
}
add_action("manage_edit-editable_event_sortable_columns", 'add_new_header_text_column');
add_action("manage_edit-page_sortable_columns", 'add_new_header_text_column');

// Show custom order column values
function show_order_column($name){
  global $post;

  switch ($name) {
    case 'menu_order':
      $order = $post->menu_order;
      echo $order;
      break;
   default:
      break;
   }
}
add_action('manage_editable_event_posts_custom_column','show_order_column');
add_action('manage_page_posts_custom_column','show_order_column');

// Make column sortable
function order_column_register_sortable($columns){
  $columns['menu_order'] = 'Order';
  return $columns;
}
add_filter('manage_editable_event_posts_columns','order_column_register_sortable');
add_filter('manage_page_posts_columns','order_column_register_sortable');

?>