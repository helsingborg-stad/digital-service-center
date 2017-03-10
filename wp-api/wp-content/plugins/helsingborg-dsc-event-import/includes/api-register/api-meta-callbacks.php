<?php
/****************************************
* callbacks for register rest api fields
*****************************************/

function get_imported_event_data($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'imported_event_data', true);
}

function get_all_categories($post, $field_name, $request)
{
    $imported_category = wp_get_post_terms($post['id'], 'imported_category');
    $categories = wp_get_post_terms($post['id'], 'category');
    $all_categories = array();
    
    foreach($imported_category as $imported_category) {
        array_push($all_categories, array(
            'term_id' => $imported_category->term_id,
            'name' => $imported_category->name,
            'term_taxonomy_id' => $imported_category->term_taxonomy_id,
            'taxonomy' => $imported_category->taxonomy,
            'slug' => $imported_category->slug
        ));
    }

    foreach($categories as $category) {
        array_push($all_categories, array(
            'term_id' => $category->term_id,
            'name' => $category->name,
            'term_taxonomy_id' => $category->term_taxonomy_id,
            'taxonomy' => $category->taxonomy,
            'slug' => $category->slug
        ));
    }

    return $all_categories;
}

function get_imported_event_id($post, $field_name, $request)
{
    return intval(get_post_meta($post['id'], 'event_id', true));
}

function get_imported_featured_media($post, $field_name, $request)
{
    return get_post_meta($post['id'], 'featured_media_src', true);
}

function get_imported_event_featured_media($post, $field_name, $request)
{
    $feat_image_url = wp_get_attachment_url( get_post_thumbnail_id($post->ID) );
    return $feat_image_url;
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