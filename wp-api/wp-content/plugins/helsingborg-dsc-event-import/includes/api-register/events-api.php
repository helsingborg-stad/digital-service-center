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
  $google_places_parsed = parse_google_places();
  $all_events = array_merge((array)$imported_events_parsed, (array)$editable_events_parsed, (array)$google_places_parsed);
  $response['events'] = $all_events;
  $response['categories'] = get_event_categories($google_places_parsed);
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

  $response['landingPages']['shared'] = [];
  $free_wifi = get_post_meta(get_option('hdsc-landing-settings-free-wifi-page'), 'event_iframe', true);
  if ($free_wifi) {
    $response['landingPages']['shared']['freeWifi'] = [
      url => $free_wifi['src'],
      width => intval($free_wifi['width'] ?? 0),
      height => intval($free_wifi['height'] ?? 0),
      offsetTop => intval($free_wifi['top_offset'] ?? 0),
      offsetLeft => intval($free_wifi['left_offset'] ?? 0)
    ];
  }

  return rest_ensure_response($response);
}

function get_event_categories($events) {
  $colors = [
    '#f7a600',
    '#e3000f',
    '#a84c98',
    '#4db4e7',
    '#76b828',
    '#0095db',
    '#d35098'
  ];
  $categories = array_reduce(
    $events,
    function($acc, $event) {
        $categories = $event['categories'];
        foreach($categories as $category) {
          if (!in_array($category, $acc)) {
              $acc[] = $category;
          }
        }
        return $acc;
    },
    []
  );
  $categories = array_slice($categories, 0, 7);
  foreach ($categories as $idx=>&$cat) {
    $cat['name'] = html_entity_decode($cat['name']);
    $cat['activeColor'] = $colors[$idx];
  }
  return $categories;
}

function get_links_for_option($option) {
  $posts = array_map(function($pageId) {
      $page = get_post($pageId);
      $iframeMeta = get_post_meta($pageId, 'event_iframe', false)[0];
      return [
        name => $page->post_title,
        url => $iframeMeta['src'],
        active => $iframeMeta['active'] == 'on',
        width => intval($iframeMeta['width'] ?? 0),
        height => intval($iframeMeta['height'] ?? 0),
        offsetTop => intval($iframeMeta['top_offset'] ?? 0),
        offsetLeft => intval($iframeMeta['left_offset'] ?? 0)
      ];
    }, get_option($option, [])
  );
  $postsWithIframe = array_values(array_filter($posts, function ($link) {
    return $link['active'] && strlen($link['url']) > 0; }
  ));
  unset($postsWithIframe[0]['active']); // Remove 'active' property, since it's irrelevant for the API response
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
      }, $post_meta->occasions ?? []),
      location => [
        id => $post_meta->location->id,
        title => $post_meta->location->title,
        streetAddress => $post_meta->location->street_address,
        postalCode => $post_meta->location->postal_code,
        latitude => floatval($post_meta->location->latitude),
        longitude => floatval($post_meta->location->longitude)
      ],
      youtubeUrl => $post_meta->youtube,
      vimeoUrl => $post_meta->vimeo
    ];

    if ($post_meta->booking_link) {
      $response['bookingLink'] = $post_meta->booking_link;
    }

    $organizer = $post_meta->organizers && $post_meta->organizers[0] ? $post_meta->organizers[0] : null;
    if ($organizer && $organizer->contacts && $organizer->contacts[0] && strlen($organizer->contacts[0]->email)) {
      $response['contactEmail'] = $organizer->contacts[0]->email;
    }
    if ($organizer && $organizer->contacts && $organizer->contacts[0] && strlen($organizer->contacts[0]->phone_number)) {
      $response['contactPhone'] = $organizer->contacts[0]->phone_number;
    }

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
    ];

    $thumbnail_url = get_the_post_thumbnail_url($event->ID);
    if ($thumbnail_url) {
      $response['imgUrl'] = $thumbnail_url;
    }

    $booking_link = get_post_meta($event->ID, 'booking_link', true);
    if ($booking_link) {
      $response['bookingLink'] = $booking_link;
    }

    $occasion = get_post_meta($event->ID, 'occasions', true);
    if (strlen($occasion['start_date']) && strlen($occasion['end_date']) && strlen($occasion['door_time'])) {
      $response['occasions'] = [[
        startDate => str_replace('T', ' ', $occasion['start_date']),
        endDate => str_replace('T', ' ', $occasion['end_date']),
        doorTime => str_replace('T', ' ', $occasion['door_time'])
      ]];
    }

    $location = get_post_meta($event->ID, 'location', true);
    $response['location'] = [
      streetAddress => $location['street_address'],
      postalCode => $location['postal_code'],
      latitude => floatval($location['latitude']),
      longitude => floatval($location['longitude'])
    ];

    $youtubeUrl = get_post_meta($event->ID, 'youtube', true);
    if ($youtubeUrl) {
      $response['youtubeUrl'] = $youtubeUrl;
    }

    $vimeoUrl = get_post_meta($event->ID, 'vimeo', true);
    if ($vimeoUrl) {
      $response['vimeoUrl'] = $vimeoUrl;
    }

    return $response;
  }, $events);
}

function parse_google_places() {
  $places = array_map(function($place) {
    $place_data = $place['data']['result'];
    return [
      id => $place_data['place_id'],
      slug => sanitize_title($place_data['name']),
      name => $place_data['name'],
      imgUrl => 'http://lorempixel.com/700/394/?v=' . rand(),
      categories => get_google_place_categories($place_data['types']),
      location => [
        formattedAddress => $place_data['formatted_address'],
        latitude => $place_data['geometry']['location']['lat'],
        longitude => $place_data['geometry']['location']['lng']
      ],
      openingHours => $place_data['opening_hours']['weekday_text'],
      contactPhone => $place_data['formatted_phone_number']
    ];
  }, get_option('saved_google_places_details', []));
  return array_values($places);
}

function get_google_place_categories($place_types) {
  return $distinct_place_types = array_reduce(
      get_option('saved_google_place_types', []),
      function($acc, $p) use($place_types) {
          $place_type = $p['google_place_type'];
          if (in_array($place_type, $place_types)) {
              $cat = get_category(intval($p['event_category_id']));
              $acc[] = [ id => $cat->cat_ID, slug => $cat->slug, name => $cat->cat_name];
          }
          return $acc;
      },
      []
  );
}