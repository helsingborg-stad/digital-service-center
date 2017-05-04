<?php

add_action('admin_post_manually_import_crm', crm_import);

function crm_import() {
    return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-crm-import'));
}

add_action('admin_post_manually_clear_import', crm_clear);

function crm_clear() {
    return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-crm-import'));
}

?>