<?php

function editable_event_post_type() {
      $labels = array(
        'name'               => _x( 'Redigerbart event', 'post type general name' ),
        'singular_name'      => _x( 'Redigerbart event', 'post type singular name' ),
        'add_new'            => _x( 'Lägg till nytt event', 'turistinformation' ),
        'add_new_item'       => __( 'Lägg till event' ),
        'edit_item'          => __( 'Redigera event' ),
        'new_item'           => __( 'Lägg till nytt event' ),
        'all_items'          => __( 'Alla redigerbara event' ),
        'view_item'          => __( 'Visa event' ),
        'search_items'       => __( 'Sök event' ),
        'not_found'          => __( 'Inga event att visa' ),
        'not_found_in_trash' => __( 'Inga event i papperskorgen' ),
        'parent_item_colon'  => '',
        'menu_name'          => 'Redigerbara event'
      );
      $args = array(
        'labels'        => $labels,
        'description'   => 'Event',
        'public'        => true,
        'menu_position' => 5,
        'supports'      => array( 'title', 'editor', 'revisions', 'thumbnail', 'custom_fields' ),
        'has_archive'   => true,
        'register_meta_box_cb' => 'add_place_and_contact_metaboxes',
        'show_in_rest'  => true

      );
      register_post_type( 'editable_event', $args );
      register_taxonomy_for_object_type( 'category', 'editable_event' );
    }
    add_action( 'init', 'editable_event_post_type' );
    add_theme_support('post-thumbnails');

    function add_place_and_contact_metaboxes() {
        //add_meta_box('test_iframe', 'Iframe', 'test_iframe', 'editable_event', 'advanced', 'default');
        add_meta_box('event_iframe', 'Iframe', 'event_iframe', 'editable_event', 'normal', 'high');
        add_meta_box('event_occasions', 'Tidpunkter', 'event_occasions', 'editable_event', 'normal', 'high');
        add_meta_box('event_location', 'Platsinformation', 'event_location', 'editable_event', 'normal', 'high');
        add_meta_box('event_organizers', 'Organisatör', 'event_organizers', 'editable_event', 'normal', 'high');
        add_meta_box('event_booking_information', 'Bokningsinformation', 'event_booking_information', 'editable_event', 'normal', 'high');
        add_meta_box('event_social_media', 'Sociala medier länkar', 'event_social_media', 'editable_event', 'normal', 'high');
        add_meta_box('event_media', 'Relaterad media länkar', 'event_media', 'editable_event', 'normal', 'high');

    }

    function event_iframe() {
        global $post;
        echo '<input type="hidden" name="event_iframe_meta_noncename" id="event_iframe_meta_noncename" value="' .
        wp_create_nonce( plugin_basename(__FILE__) ) . '" />';
        $iframe = get_post_meta($post->ID, 'event_iframe', false);
        $check_active;
        if( $iframe[0]['active'] == true) {
            $check_active = 'checked="checked"';
        }
        echo '<div style="width: 200px; display: inline-block;">';
        echo '<p>Iframe url</p>';
        echo '<input type="text" name="iframe_src" id="iframe_src" value="' . $iframe[0]['src'] . '">';
        echo '<p>Höjd</p>';
        echo '<input type="number" min="0" name="iframe_height" id="iframe_height" value="' . $iframe[0]['height'] . '">';
        echo '<p>Bredd</p>';
        echo '<input type="number" min="0" name="iframe_width" id="iframe_width" value="' . $iframe[0]['width'] . '">';
        echo '<p>Avgränsa höjd</p>';
        echo '<input type="number" min="0" name="iframe_top_offset" id="iframe_top_offset" value="' . $iframe[0]['top_offset'] . '">';
        echo '<p>Avgränsa från vänster</p>';
        echo '<input type="number" min="0" name="iframe_left_offset" id="iframe_left_offset" value="' . $iframe[0]['left_offset'] . '">';
        echo '<p>Använd iframe</p>';
        echo '<input type="checkbox" min="0" name="iframe_active"' . $check_active . '>';
        echo '</div>';
        echo '<div style="margin-left: 50px; margin-top: 45px; display: inline-block; vertical-align: top; border: 2px solid #D5CC5A; overflow: hidden;">
                <iframe scrolling="no" id="preview"></iframe>
              </div>';
    }

    function event_occasions() {
        global $post;

        echo '<input type="hidden" name="event_occasions_meta_noncename" id="event_occasions_meta_noncename" value="' .
        wp_create_nonce( plugin_basename(__FILE__) ) . '" />';

        $occasions = get_post_meta($post->ID, 'occasions', false);

        echo '<p>Start datum</p>';
        echo '<input type="datetime-local" name="event-start_date" value="' . $occasions[0]['start_date']  . '" class="widefat" />';
        echo '<p>Slut datum</p>';
        echo '<input type="datetime-local" name="event-end_date" value="' . $occasions[0]['end_date']  . '" class="widefat" />';
        echo '<p>Dörrarna öppnas</p>';
        echo '<input type="datetime-local" name="event-door_time" value="' . $occasions[0]['door_time']  . '" class="widefat" />';
    }

    function event_location() {
        global $post;

        echo '<input type="hidden" name="event_location_meta_noncename" id="event_place_meta_noncename" value="' .
        wp_create_nonce( plugin_basename(__FILE__) ) . '" />';

        $location = get_post_meta($post->ID, 'location', false);

        echo '<p>Land</p>';
        echo '<input type="text" name="event-country" value="' . $location[0]['country'] . '" class="widefat" />';
        echo '<p>Stad</p>';
        echo '<input type="text" name="event-city" value="' . $location[0]['city']  . '" class="widefat" />';
        echo '<p>Adress</p>';
        echo '<input type="text" name="event-street_address" value="' . $location[0]['street_address']  . '" class="widefat" />';
        echo '<p>Postkod</p>';
        echo '<input type="text" name="event-postal_code" value="' . $location[0]['postal_code']  . '" class="widefat" />';
        echo '<p>Latitude från google maps</p>';
        echo '<input type="text" name="event-latitude" value="' . $location[0]['latitude'] . '" class="widefat" />';
        echo '<p>Longitude från google maps</p>';
        echo '<input type="text" name="event-longitude" value="' . $location[0]['longitude'] . '" class="widefat" />';
    }

    function event_organizers() {
        global $post;

        echo '<input type="hidden" name="event_organizers_meta_noncename" id="event_organizers_meta_noncename" value="' .
        wp_create_nonce( plugin_basename(__FILE__) ) . '" />';

        $organizers = get_post_meta($post->ID, 'organizers', false);

        echo '<p>Organisatör</p>';
        echo '<input type="text" name="event-organizer" value="' . $organizers[0]['organizer'] . '" class="widefat" />';
        echo '<p>Organisatörens hemsida</p>';
        echo '<input type="text" name="event-organizer_link" value="' . $organizers[0]['organizer_link']  . '" class="widefat" />';
        echo '<p>Organisatörens Telefonnr</p>';
        echo '<input type="text" name="event-organizer_phone" value="' . $organizers[0]['organizer_phone']  . '" class="widefat" />';
        echo '<p>Organisatörens E-post</p>';
        echo '<input type="text" name="event-organizer_email" value="' . $organizers[0]['organizer_email']  . '" class="widefat" />';
        echo '<p><strong>Kontaktperson</strong></p>';
        echo '<p>Titel</p>';
        echo '<input type="text" name="event-title" value="' . $organizers[0]['contacts']['title'] . '" class="widefat" />';
        echo '<p>Namn</p>';
        echo '<input type="text" name="event-name" value="' . $organizers[0]['contacts']['name'] . '" class="widefat" />';
        echo '<p>Telefonnr</p>';
        echo '<input type="text" name="event-phone_number" value="' . $organizers[0]['contacts']['phone_number'] . '" class="widefat" />';
        echo '<p>E-post</p>';
        echo '<input type="text" name="event-email" value="' . $organizers[0]['contacts']['email'] . '" class="widefat" />';
    }

    function event_booking_information() {
        global $post;

        echo '<input type="hidden" name="event_booking_information_meta_noncename" id="event_booking_information_meta_noncename" value="' .
        wp_create_nonce( plugin_basename(__FILE__) ) . '" />';

        $booking_link = get_post_meta($post->ID, 'booking_link', true);
        $booking_phone = get_post_meta($post->ID, 'booking_phone', true);
        $age_restriction = get_post_meta($post->ID, 'age_restriction', true);
        $membership_cards = get_post_meta($post->ID, 'membership_cards', true);
        $price_information = get_post_meta($post->ID, 'price_information', true);
        $ticket_includes = get_post_meta($post->ID, 'ticket_includes', true);
        $price_adult = get_post_meta($post->ID, 'price_adult', true);
        $price_children = get_post_meta($post->ID, 'price_children', true);
        $price_student = get_post_meta($post->ID, 'price_student', true);
        $price_senior = get_post_meta($post->ID, 'price_senior', true);
        $price_student = get_post_meta($post->ID, 'senior_age', true);
        $booking_group = get_post_meta($post->ID, 'booking_group', true);
        $gallery = get_post_meta($post->ID, 'gallery', true);

        echo '<p>Bokningslänk</p>';
        echo '<input type="text" name="event-booking_link" value="' . $booking_link  . '" class="widefat" />';
        echo '<p>Telefonnr</p>';
        echo '<input type="text" name="event-booking_phone" value="' . $booking_phone  . '" class="widefat" />';
        echo '<p>Åldersgräns</p>';
        echo '<input type="text" name="event-age_restriction" value="' . $age_restriction  . '" class="widefat" />';
        echo '<p>Medlemskort</p>';
        echo '<input type="text" name="event-membership_cards" value="' . $membership_cards  . '" class="widefat" />';
        echo '<p>Pris information</p>';
        echo '<input type="textarea" name="event-price_information" value="' . $price_information  . '" class="widefat" />';
        echo '<p>Pris vuxen</p>';
        echo '<input type="text" name="event-price_adult" value="' . $price_adult  . '" class="widefat" />';
        echo '<p>Pris barn</p>';
        echo '<input type="text" name="event-price_children" value="' . $price_children  . '" class="widefat" />';
        echo '<p>Pris student</p>';
        echo '<input type="text" name="event-price_student" value="' . $price_student  . '" class="widefat" />';
        echo '<p>Pris senior</p>';
        echo '<input type="text" name="event-price_senior" value="' . $price_senior  . '" class="widefat" />';
        echo '<p>Senior ålder</p>';
        echo '<input type="text" name="event-senior_age" value="' . $senior_age  . '" class="widefat" />';
        echo '<p>Bokningsgrupp</p>';
        echo '<input type="text" name="event-booking_group" value="' . $booking_group  . '" class="widefat" />';
        echo '<p>Galleri</p>';
        echo '<input type="text" name="event-gallery" value="' . $gallery  . '" class="widefat" />';
    }

    function event_social_media() {
        global $post;

        echo '<input type="hidden" name="event_social_media_meta_noncename" id="event_social_media_meta_noncename" value="' .
        wp_create_nonce( plugin_basename(__FILE__) ) . '" />';

        $facebook = get_post_meta($post->ID, 'facebook', true);
        $twitter = get_post_meta($post->ID, 'twitter', true);
        $instagram = get_post_meta($post->ID, 'instagram', true);

        echo '<p>Facebook</p>';
        echo '<input type="text" name="event-facebook" value="' . $facebook  . '" class="widefat" />';
        echo '<p>Twitter</p>';
        echo '<input type="text" name="event-twitter" value="' . $twitter  . '" class="widefat" />';
        echo '<p>Instagram</p>';
        echo '<input type="text" name="event-instagram" value="' . $instagram  . '" class="widefat" />';
    }

    function event_media() {
        global $post;

        echo '<input type="hidden" name="event_media_meta_noncename" id="event_media_meta_noncename" value="' .
        wp_create_nonce( plugin_basename(__FILE__) ) . '" />';

        $google_music = get_post_meta($post->ID, 'google_music', true);
        $apple_music = get_post_meta($post->ID, 'apple_music', true);
        $spotify = get_post_meta($post->ID, 'spotify', true);
        $soundcloud = get_post_meta($post->ID, 'soundcloud', true);
        $deezer = get_post_meta($post->ID, 'deezer', true);
        $youtube = get_post_meta($post->ID, 'youtube', true);
        $vimeo = get_post_meta($post->ID, 'vimeo', true);

        echo '<p>Google music</p>';
        echo '<input type="text" name="event-google_music" value="' . $google_music  . '" class="widefat" />';
        echo '<p>Apple music</p>';
        echo '<input type="text" name="event-apple_music" value="' . $apple_music  . '" class="widefat" />';
        echo '<p>Spotify</p>';
        echo '<input type="text" name="event-spotify" value="' . $spotify  . '" class="widefat" />';
        echo '<p>Soundcloud</p>';
        echo '<input type="text" name="event-soundcloud" value="' . $soundcloud  . '" class="widefat" />';
        echo '<p>Deezer</p>';
        echo '<input type="text" name="event-deezer" value="' . $deezer  . '" class="widefat" />';
        echo '<p>Youtube</p>';
        echo '<input type="text" name="event-youtube" value="' . $youtube  . '" class="widefat" />';
        echo '<p>Vimeo</p>';
        echo '<input type="text" name="event-vimeo" value="' . $vimeo  . '" class="widefat" />';
    }

    add_action('save_post', 'save_event_iframe_meta', 1, 2);

    function save_event_iframe_meta($post_id, $post) {
        $iframe_args = array(
                'src' => $_POST['iframe_src'],
                'height' => $_POST['iframe_height'],
                'width' => $_POST['iframe_width'],
                'top_offset' => $_POST['iframe_top_offset'],
                'left_offset' => $_POST['iframe_left_offset'],
                'active' => $_POST['iframe_active']
            );

        $event_meta['event_iframe'] = $iframe_args;

        save_event($post_id, $post, $event_meta, 'event_iframe_meta_noncename');
    }

    add_action('save_post', 'save_event_occasions_meta', 1, 2);

    function save_event_occasions_meta($post_id, $post) {
        $occasions_args = array(
                'start_date' => $_POST['event-start_date'],
                'end_date' => $_POST['event-end_date'],
                'door_time' => $_POST['event-door_time']
            );

        $event_meta['occasions'] = $occasions_args;

        save_event($post_id, $post, $event_meta, 'event_occasions_meta_noncename');
    }

    add_action('save_post', 'save_event_location_meta', 1, 2);

    function save_event_location_meta($post_id, $post) {
        $location_args = array(
                'street_address' => $_POST['event-street_address'],
                'postal_code' => $_POST['event-postal_code'],
                'city' => $_POST['event-city'],
                'country' => $_POST['event-country'],
                'latitude' => $_POST['event-latitude'],
                'longitude' => $_POST['event-longitude']
            );

        $event_meta['featured_media_url'] = wp_get_attachment_url(get_post_thumbnail_id($post->ID));
        $event_meta['location'] = $location_args;

        save_event($post_id, $post, $event_meta, 'event_location_meta_noncename');
    }



    add_action('save_post', 'save_event_organizers_meta', 1, 2);

    function save_event_organizers_meta($post_id, $post) {
        $organizers_args = array(
                'main_organizer' => $_POST['event-main_organizer'],
                'organizer' => $_POST['event-organizer'],
                'organizer_link' => $_POST['event-organizer_link'],
                'organizer_phone' => $_POST['event-organizer_phone'],
                'organizer_email' => $_POST['event-organizer_email'],
                'contacts' => array(
                    'title' => $_POST['event-title'],
                    'name' => $_POST['event-name'],
                    'phone_number' => $_POST['event-phone_number'],
                    'email' => $_POST['event-email'],
                )
            );

        $event_meta['organizers'] = $organizers_args;

        save_event($post_id, $post, $event_meta, 'event_organizers_meta_noncename');
    }

    add_action('save_post', 'save_event_booking_information_meta', 2, 2);

    function save_event_booking_information_meta($post_id, $post) {
        $event_meta['booking_link'] = $_POST['event-booking_link'];
        $event_meta['booking_phone'] = $_POST['event-booking_phone'];
        $event_meta['age_restriction'] = $_POST['event-age_restriction'];
        $event_meta['membership_cards'] = $_POST['event-membership_cards'];
        $event_meta['price_information'] = $_POST['event-price_information'];
        $event_meta['ticket_includes'] = $_POST['event-ticket_includes'];

        save_event($post_id, $post, $event_meta, 'event_booking_information_meta_noncename');
    }

    add_action('save_post', 'save_event_social_media_meta', 2, 2);

    function save_event_social_media_meta($post_id, $post) {
        $event_meta['facebook'] = $_POST['event-facebook'];
        $event_meta['twitter'] = $_POST['event-twitter'];
        $event_meta['instagram'] = $_POST['event-instagram'];

        save_event($post_id, $post, $event_meta, 'event_social_media_meta_noncename');
    }

    add_action('save_post', 'save_event_media_meta', 2, 2);

    function save_event_media_meta($post_id, $post) {
        $event_meta['google_music'] = $_POST['event-google_music'];
        $event_meta['apple_music'] = $_POST['event-apple_music'];
        $event_meta['spotify'] = $_POST['event-spotify'];
        $event_meta['soundcloud'] = $_POST['event-soundcloud'];
        $event_meta['deezer'] = $_POST['event-deezer'];
        $event_meta['youtube'] = $_POST['event-youtube'];
        $event_meta['vimeo'] = $_POST['event-vimeo'];

        save_event($post_id, $post, $event_meta, 'event_media_meta_noncename');
    }

    function save_event($post_id, $post, $event_meta, $nonceneme) {
        if ( !wp_verify_nonce( $_POST[$nonceneme], plugin_basename(__FILE__) )) {
        return $post->ID;
        }

        if ( !current_user_can( 'edit_post', $post->ID ))
            return $post->ID;

        foreach ($event_meta as $key => $value) {
            if(get_post_meta($post->ID, $key, FALSE)) {
                update_post_meta($post->ID, $key, $value);
            }
            else {
                add_post_meta($post->ID, $key, $value);
            }
            if(!$value) delete_post_meta($post->ID, $key);
        }
    }

?>