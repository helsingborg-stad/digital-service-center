<?php

namespace helsingborg_dsc_startpage;

function helsingborg_dsc_startpage_get_upcoming_events() {
  $imported_posts = get_posts([ post_type => 'imported_event', 'suppress_filters' => false, numberposts => -1]);
  $imported_upcoming = array_filter($imported_posts, function($post) {
    $post_meta = get_post_meta(get_post_id_original($post->ID, 'imported_event'), 'imported_event_data', true);
    $door_times = array_map(function($occasion) {
      return [
          door_time => $occasion->door_time,
          end_time => $occasion->end_time
        ];
    }, $post_meta->occasions ?? []);
    $is_today_or_later = !empty(array_filter($door_times, function($door_time) {
      return date('Y-m-d', strtotime($door_time['door_time'])) >= date('Y-m-d') || date('Y-m-d', strtotime($door_time['end_time'])) >= date('Y-m-d');
    }));
    return $is_today_or_later;
  });
  $editable_posts = get_posts([ post_type => 'editable_event', 'suppress_filters' => false, numberposts => -1]);
  $editable_upcoming = array_filter($editable_posts, function($post) {
    $occasions = get_post_meta($post->ID, 'occasions', false);
    $door_time = $occasions[0]['door_time'];
    $end_date = $occasions[0]['end_date'];
    $is_today_or_later = date('Y-m-d', strtotime($door_time)) >= date('Y-m-d') || date('Y-m-d', strtotime($end_date)) >= date('Y-m-d');
    return $is_today_or_later;
  });
  $all_events = array_merge((array)$imported_upcoming, (array)$editable_upcoming);

  return array_values(array_slice($all_events, 0, 10));
}