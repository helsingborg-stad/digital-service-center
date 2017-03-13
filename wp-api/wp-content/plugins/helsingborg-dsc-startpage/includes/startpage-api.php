<?php

function helsingborg_dsc_startpage_get_today_events() {
  $posts = get_posts([ post_type => 'imported_event', numberposts => -1]);
  $today_posts = array_filter($posts, function($post) {
    $post_meta = get_post_meta($post->ID, 'imported_event_data', true);
    $door_times = array_map(function($occasion) {
      return $occasion->door_time;
    }, $post_meta->occasions);
    $is_any_door_time_today = !empty(array_filter($door_times, function($door_time) {
      return date('Y-m-d') == date('Y-m-d', strtotime($door_time));
    }));
    return $is_any_door_time_today;
  });
  return array_values(array_slice($today_posts, 0, 10));
}

function helsingborg_dsc_startpage_response() {
    return rest_ensure_response([
      backgroundUrl => get_option('hdsc-startpage-setting-background-url'),
      heading => get_option('hdsc-startpage-setting-heading', 'Digital Service Center'),
      topLinks => array_map(function($pageId) {
        $page = get_post($pageId);
        return [name => $page->post_title, href => $page->post_name];
      }, get_option('hdsc-startpage-setting-top-links', [])),
      visitorHeading => get_option('hdsc-startpage-setting-visitor-heading', 'Visitor'),
      visitorTags => [
        [name => 'See & Do'],
        [name => 'Attractions'],
        [name => 'Lorem'],
        [name => 'Recommendations'],
        [name => 'Lorem'],
        [name => 'Lorem'],
      ],
      visitorPosts => array_map(function($post) {
        return [
          heading  => $post->post_title,
          preamble => substr(strip_tags($post->post_content), 0, 100),
          href     => '/visitor/' . $post->post_name,
          imgUrl   => get_the_post_thumbnail_url($post->ID)
        ];
      }, get_posts([ post_type => 'imported_event', posts_per_page => 10, category => get_option('hdsc-startpage-setting-visitor-category', '')])),
      localHeading => get_option('hdsc-startpage-setting-local-heading', 'Local'),
      localTags => [
        [name => 'See & Do'],
        [name => 'Attractions'],
        [name => 'Lorem'],
        [name => 'Recommendations'],
        [name => 'Lorem'],
        [name => 'Lorem'],
      ],
      localPosts => array_map(function($post) {
        return [
          heading  => $post->post_title,
          preamble => substr(strip_tags($post->post_content), 0, 100),
          href     => '/local/' . $post->post_name,
          imgUrl   => get_the_post_thumbnail_url($post->ID)
        ];
      }, get_posts([ post_type => 'imported_event', posts_per_page => 10, category => get_option('hdsc-startpage-setting-local-category', '')])),
      todayHeading => get_option('hdsc-startpage-setting-today-heading', 'Today'),
      todayTags => [
        [name => 'See & Do'],
        [name => 'Attractions'],
        [name => 'Lorem'],
        [name => 'Recommendations'],
        [name => 'Lorem'],
        [name => 'Lorem'],
      ],
      todayPosts => array_map(function($post) {
        return [
          heading  => $post->post_title,
          preamble => substr(strip_tags($post->post_content), 0, 100),
          href     => '/today/' . $post->post_name,
          imgUrl   => get_the_post_thumbnail_url($post->ID)
        ];
      }, helsingborg_dsc_startpage_get_today_events())
    ]);
}

function helsing_dsc_startpage_register_routes() {
    register_rest_route( 'wp/v2', '/startpage', [
      methods  => WP_REST_Server::READABLE,
      callback => helsingborg_dsc_startpage_response
    ]);
}

add_action('rest_api_init', helsing_dsc_startpage_register_routes);
