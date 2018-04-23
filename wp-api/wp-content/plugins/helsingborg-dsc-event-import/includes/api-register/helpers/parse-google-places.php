<?php

namespace helsingborg_dsc_event_import;

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
        imgUrl => $place['photo']['imgUrl'] ?? "",
        categories => get_google_place_categories($place_data['types']),
        location => [
          formattedAddress => $place_data['formatted_address'],
          latitude => $place_data['geometry']['location']['lat'],
          longitude => $place_data['geometry']['location']['lng']
        ],
        openingHours => $place_data['opening_hours']['weekday_text'],
        contactPhone => $place_data['formatted_phone_number'],
        rating => $place_data['rating'],
        reviews => $reviews
      ];
    }, get_option('saved_google_places_details', []));
    return array_values($places);
  }

?>