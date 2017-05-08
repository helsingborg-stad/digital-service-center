<?php

add_action('admin_post_manually_import_crm', crm_import);

function crm_import() {
    perform_crm_import();

    $goback = add_query_arg('updated', true, admin_url('admin.php?page=helsingborg-dsc-crm-import'));
    wp_redirect($goback);
}

add_action('admin_post_manually_clear_import', crm_clear);

function crm_clear() {

    delete_option('hdsc-crm-import');

    $goback = add_query_arg('deleted', true, admin_url('admin.php?page=helsingborg-dsc-crm-import'));
    wp_redirect($goback);
}

function perform_crm_import() {
    $url = get_option('hdsc-crm-import-service-url');

    if (!endsWith($url, '?wsdl')) {
        $url .= '?wsdl';
    }

    $client = new SoapClient($url);
    $ret = $client->GetAllArticles();
    if (is_null($ret)) {
        delete_option('hdsc-crm-import');
    } else {
        update_option('hdsc-crm-import', $ret);
    }
}

function endsWith($haystack, $needle) {
     return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
}

function activate_scheduled_crm_import() {
    deactivate_scheduled_crm_import();
    $run_import = get_option('hdsc-crm-import-schedule-activated');
    if ($run_import) {
        $scheduled_recurrence = get_option('hdsc-crm-import-scheduled-recurrence');
        $scheduled_timestamp = get_option('hdsc-crm-import-scheduled-timestamp');
        wp_schedule_event(strtotime($scheduled_timestamp), $scheduled_recurrence, 'scheduled_crm_import');
    } else {
        $next_timestamp = wp_next_scheduled('scheduled_crm_import');
        wp_unschedule_event($next_timestamp, 'scheduled_crm_import');
    }
}

add_action('scheduled_crm_import', 'crm_import');

function deactivate_scheduled_crm_import() {
	wp_clear_scheduled_hook('scheduled_crm_import');
}

?>