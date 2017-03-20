<?php
/*******************************
* save google places
*******************************/

add_action( 'admin_post_save_google_places', 'save_google_places' );

function save_google_places() {
    $new_google_place_name = $_POST['google-places-place']; 
    $new_google_place_id = $_POST['google-places-id'];

    if($new_google_place_name == null || $new_google_place_id == null) return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));

    $new_google_place_array = array(
        'google_place_id' => $new_google_place_id,
        'google_place_name' => $new_google_place_name
    );

    $saved_google_places = get_option('saved_google_places');

    if($saved_google_places == false) $saved_google_places = array();

    if(in_array($new_google_place_array, $saved_google_places)) return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));

    array_push($saved_google_places, $new_google_place_array);
    update_option('saved_google_places', $saved_google_places); 
    wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
}

?>
