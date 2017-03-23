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

?>