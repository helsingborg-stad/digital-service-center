<?php
/*******************************
* import event post type
*******************************/

function imported_event_post_type() {
      $labels = array(
        'name'               => _x( 'Importerat event', 'post type general name' ),
        'singular_name'      => _x( 'Importerat event', 'post type singular name' ),
        //'add_new'            => _x( 'Lägg till nytt event', 'turistinformation' ),
        //'add_new_item'       => __( 'Lägg till event' ),
        'edit_item'          => __( 'Redigera event' ),
        //'new_item'           => __( 'Lägg till nytt event' ),
        //'all_items'          => __( 'Alla redigerbara event' ),
        'view_item'          => __( 'Visa event' ),
        'search_items'       => __( 'Sök event' ),
        'not_found'          => __( 'Inga event att visa' ),
        'not_found_in_trash' => __( 'Inga event i papperskorgen' ), 
        'parent_item_colon'  => '',
        'menu_name'          => 'Importerade event'
      );
      $args = array(
        'labels'        => $labels, 
        'description'   => 'Event',
        'public'        => true,
        'menu_position' => 5,
        'supports'      => array( 'title', 'editor', 'revisions', 'thumbnail', 'custom-fields' ),
        'has_archive'   => true,
        'taxonomies'    => array( 'category' ),
        'show_in_rest'  => true,
      );
      register_post_type( 'imported_event', $args );
      register_taxonomy_for_object_type( 'category', 'event' ); 
    }
    add_action( 'init', 'imported_event_post_type' );
    add_theme_support('post-thumbnails');

    //add_action('admin_init','hide_meta_boxes');

    function hide_meta_boxes() {
        remove_meta_box('postcustom','imported_event','normal');
    }
?>