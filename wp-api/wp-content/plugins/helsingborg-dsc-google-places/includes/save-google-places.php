<?php

add_action( 'admin_post_save_google_places', save_google_places );

function save_google_places() {
    $new_google_place_name = $_POST['google-places-place'];
    $new_google_place_id = $_POST['google-places-id'];
    $new_google_place_categories = $_POST['google-places-categories'] ?? [];

    if ($new_google_place_name == null || $new_google_place_id == null) {
        return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
    }

    $new_google_place = [
        google_place_id => $new_google_place_id,
        google_place_name => $new_google_place_name,
        google_place_categories => $new_google_place_categories
    ];

    $saved_google_places = get_option('saved_google_places', []);

    if (in_array($new_google_place, $saved_google_places)) {
        return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
    }

    array_push($saved_google_places, $new_google_place);
    update_option('saved_google_places', $saved_google_places);
    wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
}

?>
