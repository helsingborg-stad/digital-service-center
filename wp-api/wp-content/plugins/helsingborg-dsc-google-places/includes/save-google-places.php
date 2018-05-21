<?php

add_action('admin_post_exclude_google_places', exclude_google_places);

function exclude_google_places() {
    $new_google_place_name = $_POST['google-places-place'];
    $new_google_place_id = $_POST['google-places-id'];

    if ($new_google_place_name == null || $new_google_place_id == null) {
        return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
    }

    $new_google_place = [
        google_place_id => $new_google_place_id,
        google_place_name => $new_google_place_name
    ];

    $excluded_google_places = get_option('excluded_google_places', []);

    if (in_array($new_google_place, $excluded_google_places)) {
        return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
    }

    array_push($excluded_google_places, $new_google_place);
    update_option('excluded_google_places', $excluded_google_places);
    wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
}

add_action('admin_post_map_google_places_category', map_google_places_category);

function map_google_places_category() {
    $new_google_place_category_id = $_POST['cat'];
    $new_google_place_type = $_POST['google-place-type'];


    if ($new_google_place_category_id == null || $new_google_place_type == null) {
        return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
    }

    $new_google_place_slug = get_term($new_google_place_category_id)->slug;
    $new_google_place_taxonomy = get_term($new_google_place_category_id)->taxonomy;

    $new_google_place_type = [
        event_category_id => $new_google_place_category_id,
        event_slug => $new_google_place_slug,
        event_taxonomy => $new_google_place_taxonomy,
        google_place_type => $new_google_place_type
    ];

    $saved_google_place_types = get_option('saved_google_place_types', []);

    if (in_array($new_google_place_type, $saved_google_place_types)) {
        return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
    }

    array_push($saved_google_place_types, $new_google_place_type);
    update_option('saved_google_place_types', $saved_google_place_types);
    wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
}

function all_google_place_types() {
    return [
    'accounting',
    'airport',
    'amusement_park',
    'aquarium',
    'art_gallery',
    'atm',
    'bakery',
    'bank',
    'bar',
    'beauty_salon',
    'bicycle_store',
    'book_store',
    'bowling_alley',
    'bus_station',
    'cafe',
    'campground',
    'car_dealer',
    'car_rental',
    'car_repair',
    'car_wash',
    'casino',
    'cemetery',
    'church',
    'city_hall',
    'clothing_store',
    'convenience_store',
    'courthouse',
    'dentist',
    'department_store',
    'doctor',
    'electrician',
    'electronics_store',
    'embassy',
    'fire_station',
    'florist',
    'funeral_home',
    'furniture_store',
    'gas_station',
    'grocery_or_supermarket',
    'gym',
    'hair_care',
    'hardware_store',
    'hindu_temple',
    'home_goods_store',
    'hospital',
    'insurance_agency',
    'jewelry_store',
    'laundry',
    'lawyer',
    'library',
    'liquor_store',
    'local_government_office',
    'locksmith',
    'lodging',
    'meal_delivery',
    'meal_takeaway',
    'mosque',
    'movie_rental',
    'movie_theater',
    'moving_company',
    'museum',
    'night_club',
    'painter',
    'park',
    'parking',
    'pet_store',
    'pharmacy',
    'physiotherapist',
    'plumber',
    'police',
    'post_office',
    'real_estate_agency',
    'restaurant',
    'roofing_contractor',
    'rv_park',
    'school',
    'shoe_store',
    'shopping_mall',
    'spa',
    'stadium',
    'storage',
    'store',
    'subway_station',
    'synagogue',
    'taxi_stand',
    'train_station',
    'transit_station',
    'travel_agency',
    'university',
    'veterinary_care',
    'zoo'
    ];
}

add_action('admin_post_fetch_google_places_based_on_selected_place_types', fetch_google_places_based_on_selected_place_types);

function fetch_google_places_based_on_selected_place_types() {
    update_option('api_key_limited_status', true);

    $distinct_place_types = array_reduce(
        get_option('saved_google_place_types', []),
        function($acc, $p) {
            $place_type = $p['google_place_type'];
            if (!in_array($place_type, $acc)) {
                $acc[] = $place_type;
            }
            return $acc;
        },
        []
    );
    
    function get_api_url_for_place_type($place_type) {
        $latitude = get_option('hdsc-google-places-settings-lat');
        if($latitude == NULL) {
            $latitude = '56.049665';
        }
        $longitude = get_option('hdsc-google-places-settings-long');
        if($longitude == NULL) {
            $longitude = '12.727122';
        }
        $radius = get_option('hdsc-google-places-settings-radius');
        if($radius == NULL) {
            $radius = '2000';
        }
        return 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='. $latitude .','. $longitude .'&radius='. $radius .'&type=' .$place_type .'&keyword=&key=' . get_option('hdsc-site-setting-google-maps-api-key');
    }

    $saved_google_places = get_option('saved_google_places', []);
    $saved_google_places_details = get_option('saved_google_places_details', []);
    $new_place_ids = [];

    foreach ($distinct_place_types as $place_type) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
        curl_setopt($ch, CURLOPT_URL, get_api_url_for_place_type($place_type));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $response = json_decode(curl_exec($ch), true);
        if($response['status'] == 'OVER_QUERY_LIMIT' || !isset($response)){
            update_option('api_key_limited_status', false);
            return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
        }
        foreach ($response['results'] as $result) {
            $place_id = $result['place_id'];
            $new_place_ids[] = $place_id;
            if (!in_array($place_id, $saved_google_places)) {
                $saved_google_places[] = $place_id;
            }
        }
    }

    foreach ($saved_google_places as $key => $saved_google_place) {
        if (!in_array((string)$saved_google_place, $new_place_ids)) {
            unset($saved_google_places[$key]);
            wp_delete_attachment($saved_google_places_details[$saved_google_place]['photo']['attachId'], true);
            unset($saved_google_places_details[$saved_google_place]);
        }
    }

    function get_api_url_for_place_details($place_id, $lang) {
        return 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' . $place_id . '&language=' . $lang . '&key=' . get_option('hdsc-site-setting-google-maps-api-key');
    }

    function get_api_url_photo($photo_reference) {
        return 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=700&maxheight=395' . '&photoreference=' . $photo_reference . '&key=' . get_option('hdsc-site-setting-google-maps-api-key');
    }

    function get_response_code($url) {
        @file_get_contents($url);
        list($version, $status, $text) = explode(' ', $http_response_header[0], 3);
        return $status;
    }

    $langs = [
        'sv',
        'en'
    ];

    foreach ($langs as $lang) {
        foreach ($saved_google_places as $place_id) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
            curl_setopt($ch, CURLOPT_URL, get_api_url_for_place_details($place_id, $lang));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $response = json_decode(curl_exec($ch), true);
            if($response['status'] == 'OVER_QUERY_LIMIT' || !isset($response)){
                update_option('api_key_limited_status', false);
                return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
            }
            $saved_google_places_details[$place_id][$lang] = [
                data => $response,
                updated => date('Y-m-d H:i:s')
            ];
        }
    }

    foreach($saved_google_places as $place_id) {
        $photo = [];
        $photo_reference = $saved_google_places_details[$place_id][$langs[0]]['data']['result']['photos'][0]['photo_reference'];
        if($photo_reference != null && !isset($saved_google_places_details[$place_id]['photo']['attachId'])) {
            $api_url_photo = get_api_url_photo($photo_reference);
            $url_status = get_response_code($api_url_photo);
            if($url_status != '403') {
                $photo = get_and_save_place_photos($photo_reference, get_api_url_photo($photo_reference));
            }
        }
        $saved_google_places_details[$place_id]['photo'] = $photo;
    }

    update_option('saved_google_places', $saved_google_places);
    update_option('saved_google_places_details', $saved_google_places_details);

    return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-google-places'));
}

function get_and_save_place_photos($photo_reference, $photo_url){
    $image_url        = $photo_url;
    $image_name       = basename($photo_reference);
    $upload_dir       = wp_upload_dir();
    $image_data       = file_get_contents($image_url);
    $unique_file_name = wp_unique_filename( $upload_dir['path'], $image_name );
    $filename         = basename( $unique_file_name );

    if( wp_mkdir_p( $upload_dir['path'] ) ) {
        $file = $upload_dir['path'] . '/' . $filename;
    } else {
        $file = $upload_dir['basedir'] . '/' . $filename;
    }

    file_put_contents( $file, $image_data );

    $wp_filetype = wp_check_filetype( $filename, null );

    $attachment = array(
        'post_mime_type' => $wp_filetype['type'],
        'post_title'     => sanitize_file_name( $filename ),
        'post_content'   => '',
        'post_status'    => 'inherit'
    );

    $attach_id = wp_insert_attachment( $attachment, $file);
    $test = wp_get_attachment_metadata($attach_id);
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    $attach_data = wp_generate_attachment_metadata( $attach_id, $file );
    wp_update_attachment_metadata( $attach_id, $attach_data );

    return [
        attachId => $attach_id,
        imgUrl => wp_get_attachment_url($attach_id),
        photoReference => $photo_reference
    ];
}

?>