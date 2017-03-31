<?php

add_action('rest_api_init', helsing_dsc_events_register_routes);

function helsing_dsc_events_register_routes() {
  register_rest_route( 'wp/v2', '/events', [
    methods  => WP_REST_Server::READABLE,
    callback => helsingborg_dsc_events_response
  ]);
}

function helsingborg_dsc_events_response() {
  $response = [];
  $imported_events = get_posts([ post_type => 'imported_event', numberposts => -1, category => get_option('hdsc-startpage-setting-' . $type . '-category', '')]);
  $editable_events = get_posts([ post_type => 'editable_event', numberposts => -1, category => get_option('hdsc-startpage-setting-' . $type . '-category', '')]);
  $imported_events_parsed = parse_imported_events($imported_events);
  $editable_events_parsed = parse_editable_events($editable_events);
  $response['events'] = array_merge((array)$imported_events_parsed, (array)$editable_events_parsed);
  $response['landingPages']['visitor'] = [
    heading => get_option('hdsc-landing-settings-heading-visitor', 'Explore Helsingborg'),
    topLinks => get_links_for_option('hdsc-landing-settings-top-links-visitor'),
    subTopLinks => get_links_for_option('hdsc-landing-settings-sub-top-links-visitor')
  ];
  $response['landingPages']['local'] = [
    heading => get_option('hdsc-landing-settings-heading-local', 'Explore Helsingborg'),
    topLinks => get_links_for_option('hdsc-landing-settings-top-links-local'),
    subTopLinks => get_links_for_option('hdsc-landing-settings-sub-top-links-local')
  ];
  return rest_ensure_response($response);
}

function get_links_for_option($option) {
  $posts = array_map(function($pageId) {
      $page = get_post($pageId);
      $iframeMeta = get_post_meta($pageId, 'event_iframe', true);
      $iframeUrl = $iframeMeta['src'];
      return [name => $page->post_title, href => $iframeUrl];
    }, get_option($option, [])
  );
  $postsWithIframe = array_values(array_filter($posts, function ($link) {
    return strlen($link['href']) > 0; }
  ));
  return $postsWithIframe;
}

function get_short_content($post_content) {
  $contains_more_html_comment = preg_match('/<!--more-->/', $post_content);
  if ($contains_more_html_comment) {
    $post_content = substr($post_content, 0, strpos($post_content, "<!--more-->"));
    $post_content = preg_replace('/<p>/', '', $post_content);
  }
  $decoded = html_entity_decode($post_content);
  return strlen($decoded) > 100
    ? substr(html_entity_decode($post_content), 0, 100) . '...'
    : $decoded;
}

function parse_imported_events($events) {
  return array_map(function($event) {
    $post_meta = get_post_meta($event->ID, 'imported_event_data', true);
    $response = [
      id         => $event->ID,
      slug       => $event->post_name,
      name       => html_entity_decode($event->post_title),
      content    => $event->post_content,
      shortContent => get_short_content($event->post_content),
      categories => array_map(function($category) {
        return [
          id   => $category->cat_ID,
          name => $category->name,
          slug => $category->slug
        ];
      }, get_the_category($event->ID)),
      occasions => array_map(function($occasion) {
        return [
          startDate => $occasion->start_date,
          endDate => $occasion->end_date,
          doorTime => $occasion->door_time
        ];
      }, $post_meta->occasions),
      location => [
        id => $post_meta->location->id,
        title => $post_meta->location->title,
        streetAddress => $post_meta->location->street_address,
        postalCode => $post_meta->location->postal_code,
        latitude => floatval($post_meta->location->latitude),
        longitude => floatval($post_meta->location->longitude)
      ]
      // TODO: Add social media links, et al
    ];

    $thumbnail_url = get_the_post_thumbnail_url($event->ID);
    if ($thumbnail_url) {
      $response['imgUrl'] = $thumbnail_url;
    }
    return $response;
  }, $events);
}

function parse_editable_events($events) {
  return array_map(function($event) {
    $response = [
      id         => $event->ID,
      slug       => $event->post_name,
      name       => html_entity_decode($event->post_title),
      content    => $event->post_content,
      categories => array_map(function($category) {
        return [
          id   => $category->cat_ID,
          name => $category->name,
          slug => $category->slug
        ];
      }, get_the_category($event->ID)),
    // TODO: add occasion, location, et al
    ];
    $thumbnail_url = get_the_post_thumbnail_url($event->ID);
    if ($thumbnail_url) {
      $response['imgUrl'] = $thumbnail_url;
    }
    return $response;
  }, $events);
}