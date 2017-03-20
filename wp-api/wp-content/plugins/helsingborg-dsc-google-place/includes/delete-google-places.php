<?php
/*******************************
* delete google places
*******************************/

add_action( 'admin_post_delete_google_places', 'delete_google_places' );

function delete_google_places() {
    $saved_google_places = get_option('saved_google_places');

    if($saved_google_places != null && is_array($saved_google_places) && $_POST['saved_google_places_checkbox'] != null) {
        $saved_google_places_index = 0;
        
        foreach($saved_google_places as $key => $saved_google_place) {
            if(in_array($saved_google_place['google_place_id'], $_POST['saved_google_places_checkbox'])){
                unset($saved_google_places[$key]);
            }
        }
        update_option('saved_google_places', $saved_google_places); 
    }
    wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
}