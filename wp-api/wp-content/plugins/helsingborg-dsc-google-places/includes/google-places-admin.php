<?php
/*******************************
* admin interface
*******************************/

add_action('admin_menu', helsingborg_dsc_google_places_admin_menu);

function helsingborg_dsc_google_places_admin_menu() {
    add_menu_page( $helsingborg_dsc_google_place, 'Google places', 'manage_options', 'helsingborg-dsc-google-places', helsingborg_dsc_google_places_admin_init );
}

function helsingborg_dsc_google_places_admin_init() {
    $api_key_status_ok = get_option('api_key_limited_status');
    if(!$api_key_status_ok){
        echo "<script>alert('Googles API nyckel har överskridit antal tillåtna anrop, försök igen senare.');</script>";
        update_option('api_key_limited_status', true);
    }  
?>
    <style>
        .form-table select {
            width: 25em;
        }
    </style>
    <div class="wrap">
        <h1>Hantera platser från Google</h1>
        <hr>
        <?php map_google_place_type_form(); ?>
        <br>
        <?php list_google_place_types_form(); ?>
        <br>
        <hr>
        <?php fetch_google_places(); ?>
        <br>
        <hr>
        <?php exclude_google_place_form(); ?>
        <br>
        <?php list_excluded_google_places_form(); ?>
    </div>
<?php
}
?>
