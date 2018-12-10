<?php
if (!function_exists('write_log')) {

  function write_log($log) {
      if (true === WP_DEBUG) {
          if (is_array($log) || is_object($log)) {
              error_log(print_r($log, true));
          } else {
              error_log($log);
          }
      }
  }

}

// $test = wp_get_nav_menu_object(27);
// var_dump($test);
function register_visitor_menu() {
  register_nav_menu('visitor_menu',__( 'Visitor Menu' ));
}
add_action( 'init', 'register_visitor_menu' );

function register_local_menu() {
  register_nav_menu('local_menu',__( 'Local Menu' ));
}
add_action( 'init', 'register_local_menu' );

add_action('rest_api_init', hdsc_menu_register_routes);

function hdsc_menu_register_routes() {
  register_rest_route( 'wp/v2', '/menu', [
    methods  => WP_REST_Server::READABLE,
    callback => menu_callback
  ]);
}

function menu_callback(){
    $response = get_option('hdsc-temp-crm-json');
    $filtered_response = str_replace('\n', '', $response);
    $locations = get_nav_menu_locations();
    $menu_items = wp_get_nav_menu_items(27);
    $test = [];
    foreach($menu_items as $menu_item){
        array_push($test, get_post_meta($menu_item->ID, '_mycustom_field_2'));
    }
    return wp_get_nav_menu_items( $locations['header-menu']) ?? [];
}

// Simple funtion to start with
function send_webhook($user_logged_in, $user) {
  if($user_logged_in){
    write_log( "HOOK: $user->user_login just updated" );
  }
  remove_action('site_settings_updated', 'send_webhook', 10, 2);
  remove_action('startpage_settings_updated', 'send_webhook', 10, 2);
  remove_action('landing_page_updated', 'send_webhook', 10, 2);
  remove_action('events_imported', 'send_webhook');
}

function send_webhook_post($post_id, $post){
  if(get_post_type( $post_id ) == 'editable_event'){
    write_log( "HOOK: The post {$post_id} was edited by someone" );
  }
  remove_action('save_post', 'send_webhook_post', 10, 2);
}

add_action('site_settings_updated', 'send_webhook', 10, 2);
add_action('startpage_settings_updated', 'send_webhook', 10, 2);
add_action('landing_page_updated', 'send_webhook', 10, 2);
add_action('events_imported', 'send_webhook');
add_action('save_post', 'send_webhook_post', 10, 2);
