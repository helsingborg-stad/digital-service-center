<?php
/*******************************
* load scripts
*******************************/

function load_landing_category_edit($hook) {
    wp_enqueue_script('landing_category_edit_wp_admin', plugins_url('js/category-edit.js', __FILE__));
    wp_localize_script('landing_category_edit_wp_admin', 'landing_category_edit_script_vars', array(
        'siteUrl' => get_site_url()
        )
    );
}
add_action('admin_enqueue_scripts', load_landing_category_edit);

?>