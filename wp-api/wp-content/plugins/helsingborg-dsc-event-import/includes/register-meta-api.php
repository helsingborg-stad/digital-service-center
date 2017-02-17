<?php
/*******************************
* register rest api fields
*******************************/

add_action( 'rest_api_init', 'register_imported_event_meta_fields' );

function register_imported_event_meta_fields() {
    register_rest_field( 'imported_event',
        'event_categories',
        array(
          'get_callback'    => 'get_imported_event_categories',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'user_groups',
        array(
          'get_callback'    => 'get_imported_event_categories',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'event_tags',
        array(
          'get_callback'    => 'get_imported_event_tags',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'event_link',
        array(
          'get_callback'    => 'get_imported_event_link',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'additional_links',
        array(
          'get_callback'    => 'get_imported_event_additional_links',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'related_events',
        array(
          'get_callback'    => 'get_imported_event_related_events',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'occasions',
        array(
          'get_callback'    => 'get_imported_event_occasions',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'location',
        array(
          'get_callback'    => 'get_imported_event_location',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'additional_locations',
        array(
          'get_callback'    => 'get_imported_event_additional_locations',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'organizers',
        array(
          'get_callback'    => 'get_imported_event_organizers',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'supporters',
        array(
          'get_callback'    => 'get_imported_event_supporters',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'booking_link',
        array(
          'get_callback'    => 'get_imported_event_booking_link',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'booking_phone',
        array(
          'get_callback'    => 'get_imported_event_booking_phone',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'age_restriction',
        array(
          'get_callback'    => 'get_imported_event_age_restriction',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'membership_cards',
        array(
          'get_callback'    => 'get_imported_event_membership_cards',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'price_information',
        array(
          'get_callback'    => 'get_imported_event_price_information',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'ticket_includes',
        array(
          'get_callback'    => 'get_imported_event_ticket_includes',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'price_adult',
        array(
          'get_callback'    => 'get_imported_event_price_adult',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'price_children',
        array(
          'get_callback'    => 'get_imported_event_price_children',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'children_age',
        array(
          'get_callback'    => 'get_imported_event_children_age',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'price_student',
        array(
          'get_callback'    => 'get_imported_event_price_student',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'price_senior',
        array(
          'get_callback'    => 'get_imported_event_price_senior',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'senior_age',
        array(
          'get_callback'    => 'get_imported_event_senior_age',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'booking_group',
        array(
          'get_callback'    => 'get_imported_event_booking_group',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'gallery',
        array(
          'get_callback'    => 'get_imported_event_gallery',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'facebook',
        array(
          'get_callback'    => 'get_imported_event_facebook',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'twitter',
        array(
          'get_callback'    => 'get_imported_event_twitter',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'instagram',
        array(
          'get_callback'    => 'get_imported_event_instagram',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'google_music',
        array(
          'get_callback'    => 'get_imported_event_google_music',
          'update_callback' => null,
          'schema'          => null,
        )
    ); 
    register_rest_field( 'imported_event',
        'apple_music',
        array(
          'get_callback'    => 'get_imported_event_apple_music',
          'update_callback' => null,
          'schema'          => null,
        )
    ); 
    register_rest_field( 'imported_event',
        'spotify',
        array(
          'get_callback'    => 'get_imported_event_spotify',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'soundcloud',
        array(
          'get_callback'    => 'get_imported_event_soundcloud',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'deezer',
        array(
          'get_callback'    => 'get_imported_event_deezer',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'youtube',
        array(
          'get_callback'    => 'get_imported_event_youtube',
          'update_callback' => null,
          'schema'          => null,
        )
    );
    register_rest_field( 'imported_event',
        'vimeo',
        array(
          'get_callback'    => 'get_imported_event_vimeo',
          'update_callback' => null,
          'schema'          => null,
        )
    );           
}


function get_imported_event_categories($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'event_categories', true);
}

function get_imported_event_user_groups($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'user_groups', true);
}

function get_imported_event_tags($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'event_tags', true);
}

function get_imported_event_link($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'event_link', true);
}

function get_imported_event_additional_links($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'additional_links', true);
}

function get_imported_event_related_events($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'related_events', true);
}

function get_imported_event_occasions($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'occasions', true);
}

function get_imported_event_location($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'location', true);
}

function get_imported_event_additional_locations($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'additional_locations', true);
}

function get_imported_event_organizers($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'organizers', true);
}

function get_imported_event_supporters($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'supporters', true);
}

function get_imported_event_booking_link($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'booking_link', true);
}

function get_imported_event_booking_phone($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'booking_phone', true);
}

function get_imported_event_age_restriction($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'age_restriction', true);
}

function get_imported_event_membership_cards($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'membership_cards', true);
}

function get_imported_event_price_information($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'price_information', true);
}

function get_imported_event_ticket_includes($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'ticket_includes', true);
}

function get_imported_event_price_adult($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'price_adult', true);
}

function get_imported_event_price_children($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'price_children', true);
}

function get_imported_event_children_age($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'children_age', true);
}

function get_imported_event_price_student($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'price_student', true);
}

function get_imported_event_price_senior($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'price_senior', true);
}

function get_imported_event_senior_age($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'senior_age', true);
}

function get_imported_event_booking_group($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'booking_group', true);
}

function get_imported_event_gallery($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'gallery', true);
}

function get_imported_event_facebook($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'facebook', true);
}

function get_imported_event_twitter($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'twitter', true);
}

function get_imported_event_instagram($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'instagram', true);
}

function get_imported_event_google_music($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'google_music', true);
}

function get_imported_event_apple_music($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'apple_music', true);
}

function get_imported_event_spotify($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'spotify', true);
}

function get_imported_event_soundcloud($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'soundcloud', true);
}

function get_imported_event_deezer($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'deezer', true);
}

function get_imported_event_youtube($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'youtube', true);
}

function get_imported_event_vimeo($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'vimeo', true);
}
?>