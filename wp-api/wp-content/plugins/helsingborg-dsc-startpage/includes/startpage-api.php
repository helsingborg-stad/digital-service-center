<?php

function helsingborg_dsc_startpage_response() {
    return rest_ensure_response([
      backgroundUrl => get_option('hdsc-startpage-setting-background-url'),
      heading => get_option('hdsc-startpage-setting-heading', 'Digital Service Center'),
      topLinks => [
        [
          href => '#asdf',
          name => 'Vägbeskrivning på Knutpunkten'
        ],
        [
          href => '#asdf',
          name => 'Ett bättre Helsingborg'
        ],
        [
          href => '#asdf',
          name => 'Chatta med oss'
        ]
      ],
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
      }, get_posts([ post_type => 'imported_event', posts_per_page => 10])),
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
      }, get_posts([ post_type => 'imported_event', posts_per_page => 10])),
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
      }, get_posts([ post_type => 'imported_event', posts_per_page => 10])),
    ]);
}

function helsing_dsc_startpage_register_routes() {
    register_rest_route( 'wp/v2', '/startpage', [
      methods  => WP_REST_Server::READABLE,
      callback => helsingborg_dsc_startpage_response
    ]);
}

add_action('rest_api_init', helsing_dsc_startpage_register_routes);