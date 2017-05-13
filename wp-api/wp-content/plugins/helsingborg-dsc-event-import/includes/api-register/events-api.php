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
  $imported_events = get_posts([ post_type => 'imported_event', 'suppress_filters' => false, numberposts => -1, category => get_option('hdsc-startpage-setting-' . $type . '-category', '')]);
  $editable_events = get_posts([ post_type => 'editable_event', 'suppress_filters' => false, numberposts => -1, category => get_option('hdsc-startpage-setting-' . $type . '-category', '')]);

  $imported_events_parsed = parse_imported_events($imported_events);
  $editable_events_parsed = parse_editable_events($editable_events);
  $google_places_parsed = parse_google_places();
  $all_events = array_merge((array)$imported_events_parsed, (array)$editable_events_parsed, (array)$google_places_parsed);
  $categories_to_show_on_map = array_reduce($all_events, function($acc, $event) {
    $cat_ids = array_map(function($cat) { return $cat['id']; }, $event['categories']);
    foreach ($cat_ids as $cat_id) {
      $event_contains_location = $event['location']['latitude'] != null && $event['location']['longitude'] != null;
      if ($event_contains_location && !in_array($cat_id, $acc)) {
        $acc[] = $cat_id;
      }
    }
    return $acc;
  }, []);
  $response['events'] = $all_events;
  $response['landingPages']['visitor'] = [
    heading => get_option('hdsc-landing-settings-heading-visitor', 'Explore Helsingborg'),
    bottomLinks => get_links_for_option('hdsc-landing-settings-bottom-links-visitor'),
    categories => get_landing_page_categories('hdsc-landing-visitor-categories', $categories_to_show_on_map),
    pages => get_pages_for_visitor_local('visitor')
  ];
  $response['landingPages']['local'] = [
    heading => get_option('hdsc-landing-settings-heading-local', 'Explore Helsingborg'),
    bottomLinks => get_links_for_option('hdsc-landing-settings-bottom-links-local'),
    categories => get_landing_page_categories('hdsc-landing-local-categories', $categories_to_show_on_map),
    pages => get_pages_for_visitor_local('local')
  ];

  $response['landingPages']['events'] = [
    heading => get_option('hdsc-landing-settings-heading-events', 'Events'),
    bottomLinks => get_links_for_option('hdsc-landing-settings-bottom-links-events'),
    excludedCategoryIds => [
      intval(get_option('hdsc-startpage-setting-visitor-category', 0)),
      intval(get_option('hdsc-startpage-setting-local-category', 0))
    ]
  ];

  $response['landingPages']['shared'] = [];
  $free_wifi_id = get_option('hdsc-landing-settings-free-wifi-page');
  if(!isset($free_wifi_id)){
    return rest_ensure_response($response);
  }
  $free_wifi_page = get_current_post_language($free_wifi_id);
  if(!isset($free_wifi_page)) {
    return rest_ensure_response($response);
  }
  $free_wifi = get_post_meta($free_wifi_page->ID, 'event_iframe', true);
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

// TODO: make code more tidy and remove duplication in startpage-api's `post_mapping_helper`
function get_pages_for_visitor_local($section) {
  $args = [
    'post_type' => [
      'page',
      'editable_event'
    ],
    'meta_query' => [
      [
      'key' => 'focus_visitor_local',
      'value' => $section,
      'compare' => 'LIKE'
      ]
    ],
    'posts_per_page' => -1
  ];

  $posts = get_posts($args);

  $filtered_posts = array_map(function($post) {
      $page = get_current_post_language($post->ID);
      if(!isset($page)) {
        return;
      }
      $iframeMeta = get_post_meta($page->ID, 'event_iframe', false)[0];
      if ($iframeMeta['active'] == 'on' && strlen($iframeMeta['src'])) {
        $response = [
          type => 'iframe',
          name => $page->post_title,
          url => $iframeMeta['src'],
          width => intval($iframeMeta['width'] ?? 0),
          height => intval($iframeMeta['height'] ?? 0),
          offsetTop => intval($iframeMeta['top_offset'] ?? 0),
          offsetLeft => intval($iframeMeta['left_offset'] ?? 0)
        ];

        $thumbnail_url = get_the_post_thumbnail_url($page->ID);
        if ($thumbnail_url) {
          $response['imgUrl'] = $thumbnail_url;
        }

        return $response;
      }
      else if($page->post_type == 'editable_event') {
        $response = [
          id         => $page->ID,
          slug       => $page->post_name,
          name       => html_entity_decode($page->post_title),
          type       => 'event',
          content    => $page->post_content,
          categories => array_map(function($category) {
            return [
              id   => $category->cat_ID,
              name => $category->name,
              slug => $category->slug
            ];
          }, get_the_category($page->ID)),
        ];

        $thumbnail_url = get_the_post_thumbnail_url($page->ID);
        if ($thumbnail_url) {
          $response['imgUrl'] = $thumbnail_url;
        }

        $booking_link = get_post_meta($page->ID, 'booking_link', true);
        if ($booking_link) {
          $response['bookingLink'] = $booking_link;
        }

        $occasion = get_post_meta($page->ID, 'occasions', true);
        if (strlen($occasion['start_date']) && strlen($occasion['end_date']) && strlen($occasion['door_time'])) {
          $response['occasions'] = [[
            startDate => str_replace('T', ' ', $occasion['start_date']),
            endDate => str_replace('T', ' ', $occasion['end_date']),
            doorTime => str_replace('T', ' ', $occasion['door_time'])
          ]];
        }

        $location = get_post_meta($page->ID, 'location', true);
        $response['location'] = [
          streetAddress => $location['street_address'],
          postalCode => $location['postal_code'],
          latitude => floatval($location['latitude']),
          longitude => floatval($location['longitude'])
        ];

        $youtubeUrl = get_post_meta($page->ID, 'youtube', true);
        if ($youtubeUrl) {
          $response['youtubeUrl'] = $youtubeUrl;
        }

        $vimeoUrl = get_post_meta($page->ID, 'vimeo', true);
        if ($vimeoUrl) {
          $response['vimeoUrl'] = $vimeoUrl;
        }

        return $response;
      }
      else {
        $response = [
          type => 'page',
          name => $page->post_title,
          url =>  wp_make_link_relative(get_permalink($page)) . '?wordpress'
        ];

        $thumbnail_url = get_the_post_thumbnail_url($page->ID);
        if ($thumbnail_url) {
          $response['imgUrl'] = $thumbnail_url;
        }

        return $response;
      }
    }, $posts);

  foreach($filtered_posts as $key => $value) {
    if(empty($value)) {
      unset($filtered_posts[$key]);
    }
  }
  return $filtered_posts;
}

if(!function_exists('get_post_id_translated')) {
  function get_post_id_translated($post_id) {
    return function_exists('icl_object_id') ? icl_object_id($post_id) : $post_id;
  }
}

function get_current_post_language($post_id) {
  $lang = $_REQUEST['lang'];

  if(get_post_id_translated($post_id) != null) {
    return get_post(get_post_id_translated($post_id));
  }
  else if(!isset($lang)) {
    return get_post($post_id);
  }
  else {
    return;
  }
}

function get_landing_page_categories($option, $categories_to_include) {
  $mapped_categories = get_option($option, []);
  if(!is_array($mapped_categories)) {
    $mapped_categories = [];
  }
  $main_cats = array_map(function($map) { return $map['main_category']; }, $mapped_categories);
  // Remove mapped categories with no matched events
  foreach ($mapped_categories as $idx=>$mapped_cat) {
    $main_cat = $mapped_cat['main_category'];
    $sub_cats = $mapped_cat['sub_categories'];
    $main_category_included = in_array($main_cat, $categories_to_include);
    $included_sub_categories_count = count(array_intersect($sub_cats, $categories_to_include));
    // Remove entire category + sub-category pair if no match is found
    if (!$main_category_included && count($included_sub_categories_count) == 0) {
      unset($mapped_categories[$idx]);
    }
    // Remove any unmapped sub-categories or sub-categories already existing as main-categories
    foreach($sub_cats as $sub_cat_idx=>$sub_cat) {
      if (!in_array($sub_cat, $categories_to_include) || in_array($sub_cat, $main_cats)) {
        unset($mapped_categories[$idx]['sub_categories'][$sub_cat_idx]);
      }
    }
  }

  $colors = [
    '#f7a600',
    '#e3000f',
    '#a84c98',
    '#4db4e7',
    '#76b828',
    '#0095db',
    '#d35098',
    '#f7a600',
    '#e3000f',
    '#a84c98',
    '#4db4e7',
    '#76b828',
    '#0095db'
  ];

  $res = [];
  foreach ($mapped_categories as $idx=>$cat_map) {
    $res[] = parse_category_to_landing_page_format($cat_map['main_category'], $colors[$idx], $cat_map['icon_name'], $cat_map['sub_categories']);
  }
  usort($res, function ($a, $b) {
    return $a['name'] <=> $b['name'];
  });
  return $res;
}

function parse_category_to_landing_page_format($cat_id, $color, $icon_name, $sub_category_ids) {
  $cat = get_category($cat_id);
  $response = [
    id => $cat->cat_ID,
    name => html_entity_decode($cat->cat_name),
    activeColor => $color,
    iconName => $icon_name,
  ];
  $response['subCategories'] = array_map(function($sub_cat_id) use ($color) {
    $sub_cat = get_category($sub_cat_id);
    return [
      id => $sub_cat->cat_ID,
      name => html_entity_decode($sub_cat->cat_name),
      activeColor => $color
    ];
  }, $sub_category_ids);
  usort($response['subCategories'], function ($a, $b) {
    return $a['name'] <=> $b['name'];
  });
  return $response;
}

function get_links_for_option($option) {
  $saved_posts = get_option($option, []);
  if(!is_array($saved_posts)){
    $saved_posts = [];
  }
  $posts = array_map(function($pageId) {
      $page = get_current_post_language($pageId);
      if(!isset($page)) {
        return;
      }
      $iframeMeta = get_post_meta($page->ID, 'event_iframe', false)[0];
      if ($iframeMeta['active'] == 'on' && strlen($iframeMeta['src'])) {
        return [
          type => 'iframe',
          name => $page->post_title,
          url => $iframeMeta['src'],
          width => intval($iframeMeta['width'] ?? 0),
          height => intval($iframeMeta['height'] ?? 0),
          offsetTop => intval($iframeMeta['top_offset'] ?? 0),
          offsetLeft => intval($iframeMeta['left_offset'] ?? 0)
        ];
      }
      else {
        return [
          type => 'page',
          name => $page->post_title,
          url =>  wp_make_link_relative(get_permalink($page)) . '?wordpress'
        ];
      }
    }, $saved_posts
  );
  foreach($posts as $key => $value) {
    if(empty($value)) {
      unset($posts[$key]);
    }
  }
  return $posts;
}

function get_short_content($post_content) {
  $contains_more_html_comment = preg_match('/<!--more-->/', $post_content);
  if ($contains_more_html_comment) {
    $post_content = substr($post_content, 0, strpos($post_content, '<!--more-->'));
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
      type       => 'event',
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
      type       => 'event',
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
  $lang = $_REQUEST['lang'];
  switch($lang) {
    case 'sv':
      $lang = 'sv';
      break;
    case 'en';
      $lang = 'en';
      break;
    default:
      $lang = 'sv';
  }
  $places = array_map(function($place) use ($lang) {
    $place_data = $place[$lang]['data']['result'];
    $reviews = $place_data['reviews'] ?? [];
    $reviews = array_filter($reviews, function($review) use($lang) {
      return $review['language'] == $lang;
    });
    return [
      id => $place_data['place_id'],
      slug => sanitize_title($place_data['name']),
      name => $place_data['name'],
      type => 'place',
      imgUrl => 'http://lorempixel.com/700/394/?v=' . rand(),
      categories => get_google_place_categories($place_data['types']),
      location => [
        formattedAddress => $place_data['formatted_address'],
        latitude => $place_data['geometry']['location']['lat'],
        longitude => $place_data['geometry']['location']['lng']
      ],
      openingHours => $place_data['opening_hours']['weekday_text'],
      contactPhone => $place_data['formatted_phone_number'],
      rating => $place_data['rating'],
      reviews => $reviews,
      image => $place['photo']
    ];
  }, get_option('saved_google_places_details', []));
  return array_values($places);
}

function get_google_place_categories($place_types) {
  if(!is_array($place_types)){
    $place_types = [];
  }
  return $distinct_place_types = array_reduce(
      get_option('saved_google_place_types', []),
      function($acc, $p) use ($place_types) {
          $place_type = $p['google_place_type'];
          if (in_array($place_type, $place_types)) {
              $cat = get_category(intval($p['event_category_id']));
              if ($cat->cat_ID != null) {
                $acc[] = [ id => $cat->cat_ID, slug => $cat->slug, name => $cat->cat_name];
              }
          }
          return $acc;
      },
      []
  );
}