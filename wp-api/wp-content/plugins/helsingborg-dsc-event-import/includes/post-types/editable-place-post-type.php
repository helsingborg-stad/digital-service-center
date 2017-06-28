<?php
/*******************************
* editable place post type
*******************************/

function editable_place_post_type() {
      $labels = array(
        'name'               => _x( 'Redigerbar plats', 'post type general name' ),
        'singular_name'      => _x( 'Redigerbar plats', 'post type singular name' ),
        'add_new'            => _x( 'Lägg till ny plats', 'turistinformation' ),
        'add_new_item'       => __( 'Lägg till plats' ),
        'edit_item'          => __( 'Redigera plats' ),
        'new_item'           => __( 'Lägg till ny plats' ),
        'all_items'          => __( 'Alla redigerbara platser' ),
        'view_item'          => __( 'Visa plats' ),
        'search_items'       => __( 'Sök plats' ),
        'not_found'          => __( 'Inga platser att visa' ),
        'not_found_in_trash' => __( 'Inga platser i papperskorgen' ), 
        'parent_item_colon'  => '',
        'menu_name'          => 'Redigerbar plats'
      );
      $args = array(
        'labels'        => $labels, 
        'description'   => 'Place',
        'public'        => true,
        'menu_position' => 5,
        'supports'      => array( 'title', 'editor', 'revisions', 'thumbnail', 'custom-fields' ),
        'has_archive'   => true,
        'register_meta_box_cb' => 'add_place_metaboxes',
        'taxonomies'    => array( 'category' ),
        'show_in_rest'  => true,
      );
      register_post_type( 'editable_place', $args );
      register_taxonomy_for_object_type( 'category', 'editable_place' ); 
    }
    add_action( 'init', 'editable_place_post_type' );
    add_theme_support('post-thumbnails');

    function add_place_metaboxes() {
        add_meta_box('place_google_query', 'Använd sökning från google maps', 'place_google_query', 'editable_place', 'normal', 'high');
    }


    function place_google_query() {
        global $post;
        echo '<input type="hidden" name="place_google_query_meta_noncename" id="place_google_query_meta_noncename" value="' .
        wp_create_nonce( plugin_basename(__FILE__) ) . '" />';
        $google_query = get_post_meta($post->ID, 'place_google_query', false);
        $check_active;
        if( $google_query[0]['active'] == true) {
            $check_active = 'checked="checked"';
        }
        $google_api_key = get_option('hdsc-site-setting-google-maps-api-key');
        $google_query_str = str_replace(' ', '+', $google_query[0]['query']);
        echo '<div>';
        echo '<p>Sökord för google maps, separera varje sökord med ett mellanslag</p>';
        echo '<input style="width: 800px" type="text" name="google_search_query" id="google_search_query" value="' . $google_query[0]['query'] . '">';
        echo '<br><br>';
        echo '<button id="updateGoogleMap">Uppdatera kartan</button>';
        echo '<p>Använd google platser</p>';
        echo '<input type="checkbox" min="0" name="google_query_active"' . $check_active . '>';
        echo '</div>';
        echo '<div>
                <p>Platser som kommer att visas på kartan</p>
                <iframe id="googleMapsPreRender" width="100%" height="600" frameborder="0" style="border:0"
                src="https://www.google.com/maps/embed/v1/search?key=' . $google_api_key . '
                &q='. $google_query_str . '" allowfullscreen>
                </iframe>
              </div>';
    }

    add_action('save_post', 'save_place_google_query', 1, 2);

    function save_place_google_query($post_id, $post) {
        $google_api_key = get_option('hdsc-site-setting-google-maps-api-key');
        $google_query_str = str_replace(' ', '+', $_POST['google_search_query']);
        $google_query_args = array(
                'query' => $_POST['google_search_query'],
                'active' => $_POST['google_query_active'],
                'iframe_url' => 'https://www.google.com/maps/embed/v1/search?key=' . $google_api_key . '&q='. $google_query_str
            );
        $place_meta['place_google_query'] = $google_query_args;
        save_place($post_id, $post, $place_meta, 'place_google_query_meta_noncename');
    }

        function save_place($post_id, $post, $event_meta, $nonceneme) {
        if ( !wp_verify_nonce( $_POST[$nonceneme], plugin_basename(__FILE__) )) {
        return $post->ID;
        }
        if ( !current_user_can( 'edit_post', $post->ID ))
            return $post->ID;
       
        foreach ($event_meta as $key => $value) {
            if(get_post_meta($post->ID, $key, FALSE)) {
                update_post_meta($post->ID, $key, $value);
            }
            else {
                add_post_meta($post->ID, $key, $value);
            }
            if(!$value) delete_post_meta($post->ID, $key);
        }
    }

?>