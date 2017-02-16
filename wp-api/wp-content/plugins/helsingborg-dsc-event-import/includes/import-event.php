<?php
/*******************************
* import functions
*******************************/

add_action( 'wp_ajax_import_event', 'import_events' );
add_action( 'wp_ajax_nopriv_import_event', 'import_events' );
add_action( 'admin_post_import_events_call', 'import_events_call' );

function import_events_call() {
    if ( isset ( $_GET['import_event_submit'] ) )
        import_events();

    die( __FUNCTION__ );
}

function import_events() {

  $event_data = json_decode( file_get_contents( 'https://api.helsingborg.se/event/json/wp/v2/event' ) );
  echo $event_data;
  if ( compare_keys() ) {
    insert_or_update( $event_data );
  }

  wp_die();

}

function insert_or_update($event_data) {

  if ( ! $event_data)
    return false;

  $args = array(
    'meta_query' => array(
      array(
        'key'   => 'event_id',
        'value' => $event_data->id
      )
    ),
    'post_type'      => 'event',
    'post_status'    => array('publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit'),
    'posts_per_page' => 1
  );

  $event = get_posts( $args );

  $event_id = '';

  if ( $event )
    $event_id = $event[0]->ID;

  $event_post = array(
    'ID'            => $event_id,
    'post_title'    => $event_data->full_name,
    'post_content'  => $event_data->bio,
    'post_type'     => 'event',
    'post_status'   => ( $event ) ? $event[0]->post_status : 'publish'
  );

  $event_id = wp_insert_post( $event_post );

  if ( $event_id ) {
    update_post_meta( $event_id, 'event_id', $event_data->id );

    update_post_meta( $event_id, 'json', addslashes( file_get_contents( 'https://api.helsingborg.se/event/json/wp/v2/event' ) ) );

    wp_set_object_terms( $event_id, $event_data->tags, 'event_tag' );
  }

  print_r( $event_id );
}

?>

