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
	    'supports'      => array( 'title', 'editor', 'revisions', 'thumbnail' ),
	    'has_archive'   => true,
	    'register_meta_box_cb' => 'add_place_and_contact_metaboxes'

	  );
	  register_post_type( 'editable_event', $args );
	  register_taxonomy_for_object_type( 'category', 'event' ); 
	}
	add_action( 'init', 'editable_event_post_type' );
	add_theme_support('post-thumbnails');

	// Add the Events Meta Box
	function add_place_and_contact_metaboxes() {
		add_meta_box('place_and_contact', 'Plats och kontaktinformation', 'place_and_contact', 'editable_event', 'normal', 'high');
	}

	// The Event Location Metabox
	function place_and_contact() {
		global $post;
		
		// Noncename needed to verify where the data originated
		echo '<input type="hidden" name="eventmeta_noncename" id="eventmeta_noncename" value="' . 
		wp_create_nonce( plugin_basename(__FILE__) ) . '" />';
		
		// Get the location data if its already been entered
		$latitude = get_post_meta($post->ID, 'poi-latitude', true);
		$longitude = get_post_meta($post->ID, 'poi-longitude', true);
		$address = get_post_meta($post->ID, 'poi-address', true);
		$postalcode = get_post_meta($post->ID, 'poi-postalcode', true);
		$phone = get_post_meta($post->ID, 'poi-phone', true);
		$url = get_post_meta($post->ID, 'poi-website', true);

		// Echo out the field
		echo '<p>Latitude från google maps</p>';
		echo '<input type="text" name="poi-latitude" value="' . $latitude  . '" class="widefat" />';
		echo '<p>Longitude från google maps</p>';
		echo '<input type="text" name="poi-longitude" value="' . $longitude  . '" class="widefat" />';
		echo '<p>Adress</p>';
		echo '<input type="text" name="poi-address" value="' . $address  . '" class="widefat" />';
		echo '<p>Postkod</p>';
		echo '<input type="text" name="poi-postalcode" value="' . $postalcode  . '" class="widefat" />';
		echo '<p>Telefonnummer</p>';
		echo '<input type="text" name="poi-phone" value="' . $phone  . '" class="widefat" />';
		echo '<p>Url till hemsida, tex examplesite.com (utan www)</p>';
		echo '<input type="text" name="poi-website" value="' . $url  . '" class="widefat" />';
	}

	// Save the Metabox Data
	function save_place_and_contact_meta($post_id, $post) {
		// verify this came from the our screen and with proper authorization,
		// because save_post can be triggered at other times
		if ( !wp_verify_nonce( $_POST['eventmeta_noncename'], plugin_basename(__FILE__) )) {
		return $post->ID;
		}

		// Is the user allowed to edit the post or page?
		if ( !current_user_can( 'edit_post', $post->ID ))
			return $post->ID;

		// OK, we're authenticated: we need to find and save the data
		// We'll put it into an array to make it easier to loop though.
		
		$events_meta['poi-latitude'] = $_POST['poi-latitude'];
		$events_meta['poi-longitude'] = $_POST['poi-longitude'];
		$events_meta['poi-address'] = $_POST['poi-address'];
		$events_meta['poi-postalcode'] = $_POST['poi-postalcode'];
		$events_meta['poi-phone'] = $_POST['poi-phone'];
		$events_meta['poi-website'] = $_POST['poi-website'];
		$events_meta['poi-image'] = wp_get_attachment_url(get_post_thumbnail_id($post->ID));
		
		// Add values of $events_meta as custom fields
		
		foreach ($events_meta as $key => $value) { // Cycle through the $events_meta array!
			if( $post->post_type == 'revision' ) return; // Don't store custom data twice
			$value = implode(',', (array)$value); // If $value is an array, make it a CSV (unlikely)
			if(get_post_meta($post->ID, $key, FALSE)) { // If the custom field already has a value
				update_post_meta($post->ID, $key, $value);
			} else { // If the custom field doesn't have a value
				add_post_meta($post->ID, $key, $value);
			}
			if(!$value) delete_post_meta($post->ID, $key); // Delete if blank
		}    
	}

	add_action('save_post', 'save_place_and_contact_meta', 1, 2); // save the custom fields