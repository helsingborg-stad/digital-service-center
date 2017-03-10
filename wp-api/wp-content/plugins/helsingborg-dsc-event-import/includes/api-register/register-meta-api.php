<?php
/*******************************
* register rest api fields
*******************************/

add_action( 'rest_api_init', 'register_imported_event_meta_fields' );

function register_imported_event_meta_fields() {
    register_rest_field( 'imported_event',
    'event_id',
    array(
        'get_callback'    => 'get_imported_event_id',
        'update_callback' => null,
        'schema'          => null,
         )
    );
    register_rest_field( array('editable_event', 'imported_event'),
    'all_categories',
    array(
        'get_callback'    => 'get_all_categories',
        'update_callback' => null,
        'schema'          => null,
         )
    );
    register_rest_field( 'imported_event',
    'imported_event_data',
    array(
        'get_callback'    => 'get_imported_event_data',
        'update_callback' => null,
        'schema'          => null,
         )
    );
    register_rest_field( array('imported_event', 'editable_event'),
    'featured_media_url',
    array(
        'get_callback'    => 'get_imported_event_featured_media',
        'update_callback' => null,
        'schema'          => null,
         )
    );
    // register_rest_field( 'imported_event',
    // 'featured_media_src',
    // array(
    //     'get_callback'    => 'get_imported_featured_media',
    //     'update_callback' => null,
    //     'schema'          => null,
    //      )
    // );
    // register_rest_field( 'imported_event',
    //     'event_categories',
    //     array(
    //       'get_callback'    => 'get_imported_event_categories',
    //       'update_callback' => null,
    //       'schema'          => null,
    //     )
    // );
    // register_rest_field( 'imported_event',
    //     'user_groups',
    //     array(
    //       'get_callback'    => 'get_imported_event_categories',
    //       'update_callback' => null,
    //       'schema'          => null,
    //     )
    // );
    // register_rest_field( 'imported_event',
    //     'event_tags',
    //     array(
    //       'get_callback'    => 'get_imported_event_tags',
    //       'update_callback' => null,
    //       'schema'          => null,
    //     )
    // );
    // register_rest_field( 'imported_event',
    //     'event_link',
    //     array(
    //       'get_callback'    => 'get_imported_event_link',
    //       'update_callback' => null,
    //       'schema'          => null,
    //     )
    // );
    // register_rest_field( 'imported_event',
    //     'additional_links',
    //     array(
    //       'get_callback'    => 'get_imported_event_additional_links',
    //       'update_callback' => null,
    //       'schema'          => null,
    //     )
    // );
    // register_rest_field( 'imported_event',
    //     'related_events',
    //     array(
    //       'get_callback'    => 'get_imported_event_related_events',
    //       'update_callback' => null,
    //       'schema'          => null,
    //     )
    // );
    // register_rest_field( array('imported_event', 'editable_event'),
    //     'occasions',
    //     array(
    //       'get_callback'    => 'get_imported_event_occasions',
    //       'update_callback' => null,
    //       'schema'          => null,
    //     )
    // );
    // register_rest_field(array('imported_event', 'editable_event'),
    //     'location',
    //     array(
    //       'get_callback'    => 'get_imported_event_location',
    //       'update_callback' => null,
    //       'schema'          => null,
    //     )
    // );
    // register_rest_field( 'imported_event',
    //     'additional_locations',
    //     array(
    //       'get_callback'    => 'get_imported_event_additional_locations',
    //       'update_callback' => null,
    //       'schema'          => null,
    //     )
    // );
    register_rest_field( array('editable_event'),
        'organizers',
        array(
          'get_callback'    => 'get_imported_event_organizers',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    // register_rest_field( 'imported_event',
    //     'supporters',
    //     array(
    //       'get_callback'    => 'get_imported_event_supporters',
    //       'update_callback' => null,
    //       'schema'          => null,
    //     )
    // );
    register_rest_field( array('editable_event'),
        'booking_link',
        array(
          'get_callback'    => 'get_imported_event_booking_link',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'booking_phone',
        array(
          'get_callback'    => 'get_imported_event_booking_phone',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'age_restriction',
        array(
          'get_callback'    => 'get_imported_event_age_restriction',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'membership_cards',
        array(
          'get_callback'    => 'get_imported_event_membership_cards',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'price_information',
        array(
          'get_callback'    => 'get_imported_event_price_information',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'ticket_includes',
        array(
          'get_callback'    => 'get_imported_event_ticket_includes',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'price_adult',
        array(
          'get_callback'    => 'get_imported_event_price_adult',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'price_children',
        array(
          'get_callback'    => 'get_imported_event_price_children',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'children_age',
        array(
          'get_callback'    => 'get_imported_event_children_age',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'price_student',
        array(
          'get_callback'    => 'get_imported_event_price_student',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'price_senior',
        array(
          'get_callback'    => 'get_imported_event_price_senior',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'senior_age',
        array(
          'get_callback'    => 'get_imported_event_senior_age',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'booking_group',
        array(
          'get_callback'    => 'get_imported_event_booking_group',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'gallery',
        array(
          'get_callback'    => 'get_imported_event_gallery',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'facebook',
        array(
          'get_callback'    => 'get_imported_event_facebook',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'twitter',
        array(
          'get_callback'    => 'get_imported_event_twitter',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'instagram',
        array(
          'get_callback'    => 'get_imported_event_instagram',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'google_music',
        array(
          'get_callback'    => 'get_imported_event_google_music',
          'update_callback' => null,
          'schema'          => null,
        )
    ); 
    register_rest_field( array('editable_event'),
        'apple_music',
        array(
          'get_callback'    => 'get_imported_event_apple_music',
          'update_callback' => null,
          'schema'          => null,
        )
    ); 
    register_rest_field( array('editable_event'),
        'spotify',
        array(
          'get_callback'    => 'get_imported_event_spotify',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'soundcloud',
        array(
          'get_callback'    => 'get_imported_event_soundcloud',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'deezer',
        array(
          'get_callback'    => 'get_imported_event_deezer',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'youtube',
        array(
          'get_callback'    => 'get_imported_event_youtube',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( array('editable_event'),
        'vimeo',
        array(
          'get_callback'    => 'get_imported_event_vimeo',
          'update_callback' => null,
          'schema'          => null,
        )
    );           
}


?>