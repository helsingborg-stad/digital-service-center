<?php

namespace helsingborg_dsc_startpage;
use \DateTime;

function helsingborg_dsc_startpage_get_upcoming_events() {

  if($_REQUEST['lang'] == 'en'){
    global $sitepress;
    $curr_lang = $sitepress->get_current_language();
    $sitepress->switch_lang($sitepress->get_default_language());

    $imported_posts = get_posts([ post_type => 'imported_event', 'suppress_filters' => false, numberposts => -1]);
    $imported_upcoming = array_filter($imported_posts, function($post) {
      $post_meta = get_post_meta(get_post_id_original($post->ID, 'imported_event'), 'imported_event_data', true);
      $times = array_map(function($occasion) {
        return [
            start_date => $occasion->start_date,
            end_date => $occasion->end_date
          ];
      }, $post_meta->occasions ?? []);
      $is_today_or_later = !empty(array_filter($times, function($time) {
        $today = new DateTime();
        $today->setTime( 0, 0, 0 );
        $currWeek = $today->format("W");

        $start_date = new DateTime($time['start_date']);
        $start_date->setTime( 0, 0, 0 );
        $start_week = $start_date->format("W");

        return $start_week == $currWeek;
      }));
      $is_in_valid_city = isset($post_meta->location) && $post_meta->location->city == 'Helsingborg';
      return $is_in_valid_city && $is_today_or_later;
    });

    $editable_posts = get_posts([ post_type => 'editable_event', 'suppress_filters' => false, numberposts => -1]);
    $editable_upcoming = array_filter($editable_posts, function($post) {
      $occasions = get_post_meta($post->ID, 'occasions', false);
      $start_date = $occasions[0]['start_date'];
      $end_date = $occasions[0]['end_date'];

      $today = new DateTime();
      $today->setTime( 0, 0, 0 );
      $currWeek = $today->format("W");

      $start_date = new DateTime($start_date);
      $start_date->setTime( 0, 0, 0 );
      $start_week = $start_date->format("W");

      return $start_week == $currWeek;
    });
 
    $all_events = array_merge((array)$imported_upcoming, (array)$editable_upcoming);
    return array_values(array_slice($all_events, 0, 10));
  }else{
    $imported_posts = get_posts([ post_type => 'imported_event', 'suppress_filters' => false, numberposts => -1]);
    $imported_upcoming = array_filter($imported_posts, function($post) {
      $post_meta = get_post_meta(get_post_id_original($post->ID, 'imported_event'), 'imported_event_data', true);
      $times = array_map(function($occasion) {
        return [
            start_date => $occasion->start_date,
            end_date => $occasion->end_date
          ];
      }, $post_meta->occasions ?? []);
      $is_today_or_later = !empty(array_filter($times, function($time) {
        $today = new DateTime();
        $today->setTime( 0, 0, 0 );
        $currWeek = $today->format("W");

        $start_date = new DateTime($time['start_date']);
        $start_date->setTime( 0, 0, 0 );
        $start_week = $start_date->format("W");

        return $start_week == $currWeek;
      }));
      
      $is_in_valid_city = isset($post_meta->location) && $post_meta->location->city == 'Helsingborg';
      return $is_in_valid_city && $is_today_or_later;
    });

    $editable_posts = get_posts([ post_type => 'editable_event', 'suppress_filters' => false, numberposts => -1]);
    $editable_upcoming = array_filter($editable_posts, function($post) {
      $occasions = get_post_meta($post->ID, 'occasions', false);
      $start_date = $occasions[0]['start_date'];
      $end_date = $occasions[0]['end_date'];

      $today = new DateTime();
      $today->setTime( 0, 0, 0 );
      $currWeek = $today->format("W");

      $start_date = new DateTime($start_date);
      $start_date->setTime( 0, 0, 0 );
      $start_week = $start_date->format("W");

      return $start_week == $currWeek;
    });
 
    $all_events = array_merge((array)$imported_upcoming, (array)$editable_upcoming);
    return array_values(array_slice($all_events, 0, 10));
  }

}