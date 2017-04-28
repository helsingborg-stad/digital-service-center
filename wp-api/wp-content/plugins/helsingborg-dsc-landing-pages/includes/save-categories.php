<?php

add_action('admin_post_save_visitor_main_category', save_visitor_main_category);

function save_visitor_main_category() {
    save_main_category('hdsc-landing-visitor-categories');
}

add_action('admin_post_save_local_main_category', save_local_main_category);

function save_local_main_category() {
    save_main_category('hdsc-landing-local-categories');
}

function save_main_category($option) {
    $new_category_id = $_POST['cat'];

    if ($new_category_id == null) {
        return wp_redirect(admin_url('admin.php?page=landing-pages-categories'));
    }

    $saved_categories = get_option($option);
    if(!is_array($saved_categories)) {
        $saved_categories = [];
    }

    if (in_array($new_category_id, $saved_categories['main_category'])) {
        return wp_redirect(admin_url('admin.php?page=landing-pages-categories'));
    }

    $new_category_obj = [
        main_category => (int)$new_category_id,
        sub_categories => []
    ];

    array_push($saved_categories, $new_category_obj);
    update_option($option, $saved_categories);

    return wp_redirect(admin_url('admin.php?page=landing-pages-categories'));
}

add_action('admin_post_update_or_delete_visit_categories', update_or_delete_visit_categories);

function update_or_delete_visit_categories() {
    $form_action = $_POST['visit_categories_form_option'];

    if($form_action == 'Update') {
        do_action('admin_post_update_visitor_sub_categories');
    }
    if($form_action == 'Delete') {
        do_action('admin_post_delete_visitor_category');
    }
}

add_action('admin_post_update_or_delete_local_categories', update_or_delete_local_categories);

function update_or_delete_local_categories() {
    $form_action = $_POST['local_categories_form_option'];

    if($form_action == 'Update') {
        do_action('admin_post_update_local_sub_categories');
    }
    if($form_action == 'Delete') {
        do_action('admin_post_delete_local_category');
    }
}

add_action('admin_post_update_visitor_sub_categories', update_visitor_sub_categories);

function update_visitor_sub_categories() {
    save_sub_categories('hdsc-landing-visitor-categories', 'saved_main_visit_categories');
}

add_action('admin_post_update_local_sub_categories', update_local_sub_categories);

function update_local_sub_categories() {
    save_sub_categories('hdsc-landing-local-categories', 'saved_main_local_categories');
}

function save_sub_categories($option, $post_name) {
    $main_category = $_POST[$post_name];

    if($main_category == null) {
        return wp_redirect(admin_url('admin.php?page=landing-pages-categories'));
    }

    $saved_categories = get_option($option, []);

    if(!empty($_POST['sub_categories'])) {
        foreach($saved_categories as $key => $saved_category) {
            if($saved_category['main_category'] == $main_category) {
                $sub_cats = array_map(function($cat) { return (int)$cat; }, $_POST['sub_categories']);
                $new_category = [
                    main_category => $saved_category['main_category'],
                    sub_categories => $sub_cats
                ];
                $saved_categories[$key] = $new_category;
                update_option($option, $saved_categories);
                break;
            }
        }
    }

    return wp_redirect(admin_url('admin.php?page=landing-pages-categories'));
}

add_action('admin_post_delete_visitor_category', delete_visitor_category);

function delete_visitor_category() {
    delete_category('hdsc-landing-visitor-categories', 'saved_main_visit_categories');
}

add_action('admin_post_delete_local_category', delete_local_category);

function delete_local_category() {
    delete_category('hdsc-landing-local-categories', 'saved_main_local_categories');
}

function delete_category($option, $post_name) {
    $category_to_delete = $_POST[$post_name];

    if($category_to_delete == null) {
        return wp_redirect(admin_url('admin.php?page=landing-pages-categories'));
    }

    $saved_categories = get_option($option);

    if(is_array($saved_categories)) {
        foreach($saved_categories as $key => $saved_category) {
            if($saved_category['main_category'] == $category_to_delete) {
                unset($saved_categories[$key]);
                update_option($option, $saved_categories);
                break;
            }
        }
    }
    return wp_redirect(admin_url('admin.php?page=landing-pages-categories'));
}
?>