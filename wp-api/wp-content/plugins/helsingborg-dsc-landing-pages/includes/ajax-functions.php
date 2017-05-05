<?php
add_action( 'wp_ajax_load_sub_categories', 'load_sub_categories' );
add_action( 'wp_ajax_nopriv_load_sub_categories', 'load_sub_categories' );

function load_sub_categories() {
    if(isset($_POST['category_id'])) {

    $category_id = $_POST['category_id'];
    $landing_type = $_POST['landing_type'];
    $args = [
        'child_of' => $category_id,
        'hide_empty' => 0
    ];
    $sub_categories = get_categories($args);
    $sub_categories_values = [];
    $saved_sub_categories = get_saved_sub_categories($landing_type, $category_id);

    if(is_array($sub_categories)) {
        foreach($sub_categories as $sub_category) {
            $is_saved = false;
            if(in_array($sub_category->cat_ID, $saved_sub_categories)) {
                $is_saved = true;
            }
            $sub_categories_values[] = [
                category => $sub_category,
                is_saved => $is_saved
            ];
        }
    }

    $icon_name = get_saved_icon_name($landing_type, $category_id);

    echo json_encode([
        categories => $sub_categories_values,
        icon => $icon_name
    ]);
    wp_die();
    }
}

function get_saved_sub_categories($type, $main_category_id) {
    $saved_categories = get_option($type);
    $saved_sub_categories = [];
    foreach($saved_categories as $saved_category) {
        if($saved_category['main_category'] == $main_category_id) {
            $saved_sub_categories = $saved_category['sub_categories'];
            break;
        }
    }
    return $saved_sub_categories;
}

function get_saved_icon_name($type, $main_category_id) {
    $saved_categories = get_option($type);
    $icon_name = '';
    foreach($saved_categories as $saved_category) {
        if($saved_category['main_category'] == $main_category_id) {
            $icon_name = $saved_category['icon_name'];
            break;
        }
    }
    return $icon_name;
}

?>