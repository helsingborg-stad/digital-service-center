<?php
/*******************************
* load scripts
*******************************/

function wpse_cpt_enqueue( $hook_suffix ){
    $cpt = 'editable_event';

    if( in_array($hook_suffix, array('post.php', 'post-new.php') ) ){
        $screen = get_current_screen();

        if( is_object( $screen ) && $cpt == $screen->post_type ){
            wp_enqueue_script('editable_event_iframe_wp_admin', plugins_url('js/iframe-edit.js', __FILE__));
        }
    }
}

add_action( 'admin_enqueue_scripts', 'wpse_cpt_enqueue');


function wpse_page_enqueue( $hook_suffix ){
    $cpt = 'page';

    if( in_array($hook_suffix, array('post.php', 'post-new.php') ) ){
        $screen = get_current_screen();

        if( is_object( $screen ) && $cpt == $screen->post_type ){
            wp_enqueue_script('page_iframe_wp_admin', plugins_url('js/iframe-edit.js', __FILE__));
        }
    }
}

add_action( 'admin_enqueue_scripts', 'wpse_page_enqueue');