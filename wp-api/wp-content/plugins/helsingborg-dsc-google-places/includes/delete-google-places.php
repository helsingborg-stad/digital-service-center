<?php
/*******************************
* delete google place_types
*******************************/

add_action( 'admin_post_delete_excluded_google_places', delete_excluded_google_places );

function delete_excluded_google_places() {
    $excluded_google_places = get_option('excluded_google_places');

    if ($excluded_google_places != null && is_array($excluded_google_places) && $_POST['excluded_google_places_checkbox'] != null) {
        foreach ($excluded_google_places as $key => $excluded_google_place) {
            if (in_array($excluded_google_place['google_place_id'], $_POST['excluded_google_places_checkbox'])){
                unset($excluded_google_places[$key]);
            }
        }
        update_option('excluded_google_places', $excluded_google_places);
    }
    wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
}

add_action( 'admin_post_delete_google_place_types', delete_google_place_types );

function delete_google_place_types() {
    $saved_google_place_types = get_option('saved_google_place_types');

    if ($saved_google_place_types != null && is_array($saved_google_place_types) && $_POST['saved_google_place_types_checkbox'] != null) {
        foreach ($saved_google_place_types as $key => $saved_google_place_type) {
            $delete_place = $saved_google_place_type['event_category_id'] . $saved_google_place_type['google_place_type'];
            if (in_array($delete_place, $_POST['saved_google_place_types_checkbox'])){
                unset($saved_google_place_types[$key]);
            }
        }
        update_option('saved_google_place_types', $saved_google_place_types);
    }
    wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
}



?>
