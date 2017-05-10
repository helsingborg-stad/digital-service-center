<?php

add_action('rest_api_init', helsingborg_dsc_google_search_routes);

function helsingborg_dsc_google_search_routes() {
  register_rest_route( 'wp/v2', '/hbg-se-search', [
    methods  => WP_REST_Server::READABLE,
    callback => helsingborg_dsc_google_search_response
  ]);
}

function helsingborg_dsc_google_search_response() {
    function get_search_result($google_api_key, $cx_id, $search_term, $page) {
        return 'https://www.googleapis.com/customsearch/v1?key=' . $google_api_key . '&cx=' . $cx_id . '&q=' . $search_term . '&start=' . $page;
    }

    $google_api_key = get_option('hdsc-site-setting-google-api-key', null);
    $cx_id = get_option('hdsc-site-setting-google-cx-id', null);

    $search_term = $_REQUEST['term'] ?? '';
    $page = $_REQUEST['page'] ?? 1;

    $formated_search_term = str_replace(' ', '/', $search_term);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
    curl_setopt($ch, CURLOPT_URL, get_search_result($google_api_key, $cx_id,  $formated_search_term, $page));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $response = json_decode(curl_exec($ch), true);
    curl_close($ch);

    if(!isset($response['items'])) {
        $filtered_result['result']['status'] = false;
        return $filtered_result;
    }

    $filtered_result['items'] = array_map(function($item){       
        $result = [
            title => $item['title'],
            description => $item['snippet'],
            link => $item['link'],
            date => $item['pagemap']['metatags'][0]['moddate']
        ];
        if($item['mime'] == 'application/pdf') {
            $result['isPdf'] = true;
        }
        else {
            $result['isPdf'] = false;
        }
        return $result;
    }, $response['items']);

    $filtered_result['result']['totalResults'] = intval($response['queries']['request'][0]['totalResults']);
    $totalPages = intval($filtered_result['result']['totalResults']) / 10;
    $totalPages = ceil($totalPages);
    $filtered_result['result']['totalPages'] = $totalPages;
    $filtered_result['result']['status'] = true;

    return $filtered_result;
}