<?php

function helsingborg_dsc_startpage_response() {
    return rest_ensure_response([
      backgroundUrl => 'http://lorempixel.com/1920/1080/city',
      heading => 'Digital Service Center',
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
      visitorHeading => 'Visitor',
      visitorTags => [
        [name => 'See & Do'],
        [name => 'Attractions'],
        [name => 'Lorem'],
        [name => 'Recommendations'],
        [name => 'Lorem'],
        [name => 'Lorem'],
      ],
      visitorPosts => [
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
      ],
      localHeading => 'Visitor',
      localTags => [
        [name => 'See & Do'],
        [name => 'Attractions'],
        [name => 'Lorem'],
        [name => 'Recommendations'],
        [name => 'Lorem'],
        [name => 'Lorem'],
      ],
      localPosts => [
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
      ],
      todayHeading => 'Visitor',
      todayTags => [
        [name => 'See & Do'],
        [name => 'Attractions'],
        [name => 'Lorem'],
        [name => 'Recommendations'],
        [name => 'Lorem'],
        [name => 'Lorem'],
      ],
      todayPosts => [
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
        [heading => 'Lorem ipsum', preamble => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.', imgUrl => 'http://lorempixel.com/166/102', href => '#asdf'],
      ]
    ]);
}

function helsing_dsc_startpage_register_routes() {
    register_rest_route( 'wp/v2', '/startpage', [
      methods  => WP_REST_Server::READABLE,
      callback => helsingborg_dsc_startpage_response
    ]);
}

add_action('rest_api_init', helsing_dsc_startpage_register_routes);
