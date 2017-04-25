<?php

add_action('admin_post_save_visitor_main_category', save_visitor_main_category);

function save_visitor_main_category() {
    save_main_category('hdsc-landing-visitor-main-categories');
}

add_action('admin_post_save_local_main_category', save_local_main_category);

function save_local_main_category() {
    save_main_category('hdsc-landing-local-main-categories');
}

function save_main_category($option) {
    $new_category_id = $_POST['cat'];

    if ($new_category_id == null) {
        return wp_redirect(admin_url('admin.php?page=landing-pages-categories'));
    }

    $saved_category_ids = get_option($option, []);

    if (in_array($new_category_id, $saved_category_ids)) {
        return wp_redirect(admin_url('admin.php?page=landing-pages-categories'));
    }

    array_push($saved_category_ids, $new_category_id);
    update_option($option, $saved_category_ids);

    return wp_redirect(admin_url('admin.php?page=landing-pages-categories'));
}
?>