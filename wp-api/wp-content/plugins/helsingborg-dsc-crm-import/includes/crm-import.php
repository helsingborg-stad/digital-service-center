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
    $licenseData = array(
        'ApplicationVersion' => '2017.1',
        'FullUserName' => 'Nils Adamsson',
        'LicenseId' => 3001,
        'MajorCustomer' => false,
        'Password' => '',
        'Price' => 50,
        'ProductLine' => 'Säljstöd',
        'Test' => true,
        'UserEmailAddress' => 'nils.adamsson@vitec.se'
    );
    $addressRequestData = array(
        'City' => '',
        'Municipality' => '',
        'StreetName' => '',
        'StreetNumber' => '',
        'ZipCode' => ''
    );
    $indata = array(
        'licenseData' => $licenseData,
        'addressRequestData' => $addressRequestData,
        'excerptType' => 'WithTaxationInfo'
    );

    $url = get_option('hdsc-crm-import-service-url');

    if (!endsWith($url, '?wsdl')) {
        $url .= '?wsdl';
    }

    $client = new SoapClient($url);
    $ret = $client->GetPropertyExcerptByAddress($indata);
    if (is_null($ret)) {
        delete_option('hdsc-crm-import');
    } else {
        update_option('hdsc-crm-import', $ret);
    }
}

function endsWith($haystack, $needle) {
     return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
}

?>