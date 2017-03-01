<?php
/*******************************
* import functions
*******************************/

function get_event_json($number_of_events) {
  $json;
  if(intval($number_of_events) > 0){
    $json = file_get_contents('https://api.helsingborg.se/event/json/wp/v2/event/?per_page=' . $number_of_events );
  }
  else {
    $json = file_get_contents('https://api.helsingborg.se/event/json/wp/v2/event');
  }
  
  $json_decode = json_decode($json);

  return $json_decode;
}

function insert_event_post_type($event) {
  $post_id = wp_insert_post(array (
    'post_type' => 'imported_event',
    'post_title' => $event->title->rendered,
    'post_content' => $event->content->rendered,
    'post_status' => 'publish',
    'comment_status' => 'closed',   
    'ping_status' => 'closed'
  ));

  return $post_id;
}

function insert_event_featured_image($post_id, $event) {
  $image_url        = $event->featured_media->source_url;
  $image_name       = basename($image_url);
  $upload_dir       = wp_upload_dir(); 
  $image_data       = file_get_contents($image_url);
  $unique_file_name = wp_unique_filename( $upload_dir['path'], $image_name );
  $filename         = basename( $unique_file_name );

  if( wp_mkdir_p( $upload_dir['path'] ) ) {
      $file = $upload_dir['path'] . '/' . $filename;
  } else {
      $file = $upload_dir['basedir'] . '/' . $filename;
  }

  file_put_contents( $file, $image_data );

  $wp_filetype = wp_check_filetype( $filename, null );

  $attachment = array(
      'post_mime_type' => $wp_filetype['type'],
      'post_title'     => sanitize_file_name( $filename ),
      'post_content'   => '',
      'post_status'    => 'inherit'
  );

  $attach_id = wp_insert_attachment( $attachment, $file, $post_id );
  require_once(ABSPATH . 'wp-admin/includes/image.php');
  $attach_data = wp_generate_attachment_metadata( $attach_id, $file );
  wp_update_attachment_metadata( $attach_id, $attach_data );
  set_post_thumbnail( $post_id, $attach_id );
}

function insert_event_meta($post_id, $event){
  add_post_meta($post_id, 'event_id', $event->id);
  add_post_meta($post_id, 'featured_media_src', $event->featured_media);  
  add_post_meta($post_id, 'event_categories', $event->event_categories);
  add_post_meta($post_id, 'user_groups', $event->user_groups);
  add_post_meta($post_id, 'event_tags', $event->event_tags);
  add_post_meta($post_id, 'event_link', $event->event_link);
  add_post_meta($post_id, 'additional_links', $event->additional_links);
  add_post_meta($post_id, 'related_events', $event->related_events);
  add_post_meta($post_id, 'occasions', $event->occasions);
  add_post_meta($post_id, 'location', $event->location);
  add_post_meta($post_id, 'additional_locations', $event->additional_locations);
  add_post_meta($post_id, 'organizers', $event->organizers);  
  add_post_meta($post_id, 'supporters', $event->supporters);
  add_post_meta($post_id, 'booking_link', $event->booking_link);
  add_post_meta($post_id, 'booking_phone', $event->booking_phone);
  add_post_meta($post_id, 'age_restriction', $event->age_restriction);
  add_post_meta($post_id, 'membership_cards', $event->membership_cards);
  add_post_meta($post_id, 'price_information', $event->price_information);
  add_post_meta($post_id, 'ticket_includes', $event->ticket_includes);
  add_post_meta($post_id, 'price_adult', $event->price_adult);
  add_post_meta($post_id, 'price_children', $event->price_children);
  add_post_meta($post_id, 'children_age', $event->children_age);
  add_post_meta($post_id, 'price_student', $event->price_student);
  add_post_meta($post_id, 'price_senior', $event->price_senior);
  add_post_meta($post_id, 'senior_age', $event->senior_age);
  add_post_meta($post_id, 'booking_group', $event->booking_group);
  add_post_meta($post_id, 'gallery', $event->gallery);
  add_post_meta($post_id, 'facebook', $event->facebook);
  add_post_meta($post_id, 'twitter', $event->twitter);
  add_post_meta($post_id, 'instagram', $event->instagram);
  add_post_meta($post_id, 'google_music', $event->google_music);
  add_post_meta($post_id, 'apple_music', $event->apple_music);
  add_post_meta($post_id, 'spotify', $event->spotify);
  add_post_meta($post_id, 'soundcloud', $event->soundcloud);
  add_post_meta($post_id, 'deezer', $event->deezer);
  add_post_meta($post_id, 'youtube', $event->youtube);
  add_post_meta($post_id, 'vimeo', $event->vimeo);
}

function update_event($event, $stored_event, $post_id) {
  if($event->title->rendered !=$stored_event->post_title || 
  $event->content->rendered != $stored_event->post_content ){
    $updated_post = array(
      'ID' => $stored_event->ID,
      'post_title' => $event->title->rendered,
      'post_content' => $event->content->rendered
    );
      wp_update_post($updated_post);
  }

  $featured_media_src = get_post_meta($post_id, 'featured_media_src');
  if($featured_media_src != $event->featured_media) {
    update_post_meta($post_id, 'featured_media_src', $event->featured_media);
  }

  $event_categories = get_post_meta($post_id, 'event_categories');
  if($event_categories != $event->event_categories) {
    update_post_meta($post_id, 'event_categories', $event->event_categories);
  }

  $user_groups = get_post_meta($post_id, 'user_groups');
  if($user_groups != $event->$user_groups) {
    update_post_meta($post_id, '$user_groups', $event->$user_groups);
  }

  $event_tags = get_post_meta($post_id, 'event_tags');
  if($event_tags != $event->$event_tags) {
    update_post_meta($post_id, '$event_tags', $event->$event_tags);
  }

  $event_link = get_post_meta($post_id, 'event_link');
  if($event_link != $event->$event_link) {
    update_post_meta($post_id, '$event_link', $event->$event_link);
  }

  $additional_links = get_post_meta($post_id, 'additional_links');
  if($additional_links != $event->$additional_links) {
    update_post_meta($post_id, '$additional_links', $event->$additional_links);
  }

  $related_events = get_post_meta($post_id, 'related_events');
  if($related_events != $event->$related_events) {
    update_post_meta($post_id, '$related_events', $event->$related_events);
  }

  $occasions = get_post_meta($post_id, 'occasions');
  if($occasions != $event->$occasions) {
    update_post_meta($post_id, '$occasions', $event->$occasions);
  }

  $location = get_post_meta($post_id, 'location');
  if($location != $event->$location) {
    update_post_meta($post_id, '$location', $event->$location);
  }

  $additional_locations = get_post_meta($post_id, 'additional_locations');
  if($additional_locations != $event->$additional_locations) {
    update_post_meta($post_id, '$additional_locations', $event->$additional_locations);
  }

  $organizers = get_post_meta($post_id, 'organizers');
  if($organizers != $event->$organizers) {
    update_post_meta($post_id, '$organizers', $event->$organizers);
  }

  $supporters = get_post_meta($post_id, 'supporters');
  if($supporters != $event->$supporters) {
    update_post_meta($post_id, '$supporters', $event->$supporters);
  }

  $booking_link = get_post_meta($post_id, 'booking_link');
  if($booking_link != $event->$booking_link) {
    update_post_meta($post_id, '$booking_link', $event->$booking_link);
  }

  $booking_phone = get_post_meta($post_id, 'booking_phone');
  if($booking_phone != $event->$booking_phone) {
    update_post_meta($post_id, '$booking_phone', $event->$booking_phone);
  }

  $age_restriction = get_post_meta($post_id, 'age_restriction');
  if($age_restriction != $event->$age_restriction) {
    update_post_meta($post_id, '$age_restriction', $event->$age_restriction);
  }

  $membership_cards = get_post_meta($post_id, 'membership_cards');
  if($membership_cards != $event->$membership_cards) {
    update_post_meta($post_id, '$membership_cards', $event->$membership_cards);
  }

  $price_information = get_post_meta($post_id, 'price_information');
  if($price_information != $event->$price_information) {
    update_post_meta($post_id, '$price_information', $event->$price_information);
  }

  $ticket_includes = get_post_meta($post_id, 'ticket_includes');
  if($ticket_includes != $event->$ticket_includes) {
    update_post_meta($post_id, '$ticket_includes', $event->$ticket_includes);
  }

  $price_adult = get_post_meta($post_id, 'price_adult');
  if($price_adult != $event->$price_adult) {
    update_post_meta($post_id, '$price_adult', $event->$price_adult);
  }

  $price_children = get_post_meta($post_id, 'price_children');
  if($price_children != $event->$price_children) {
    update_post_meta($post_id, '$price_children', $event->$price_children);
  }

  $children_age = get_post_meta($post_id, 'children_age');
  if($children_age != $event->$children_age) {
    update_post_meta($post_id, '$children_age', $event->$children_age);
  }

  $price_student = get_post_meta($post_id, 'price_student');
  if($price_student != $event->$price_student) {
    update_post_meta($post_id, '$price_student', $event->$price_student);
  }

  $price_senior = get_post_meta($post_id, 'price_senior');
  if($price_senior != $event->$price_senior) {
    update_post_meta($post_id, '$price_senior', $event->$price_senior);
  }

  $senior_age = get_post_meta($post_id, 'senior_age');
  if($senior_age != $event->$senior_age) {
    update_post_meta($post_id, '$senior_age', $event->$senior_age);
  }

  $booking_group = get_post_meta($post_id, 'booking_group');
  if($booking_group != $event->$booking_group) {
    update_post_meta($post_id, '$booking_group', $event->$booking_group);
  }

  $gallery = get_post_meta($post_id, 'gallery');
  if($gallery != $event->$gallery) {
    update_post_meta($post_id, '$gallery', $event->$gallery);
  }

  $facebook = get_post_meta($post_id, 'facebook');
  if($facebook != $event->facebook) {
    update_post_meta($post_id, 'facebook', $event->facebook);
  }

    $twitter = get_post_meta($post_id, 'twitter');
  if($twitter != $event->$twitter) {
    update_post_meta($post_id, '$twitter', $event->$twitter);
  }

    $instagram = get_post_meta($post_id, 'instagram');
  if($instagram != $event->$instagram) {
    update_post_meta($post_id, '$instagram', $event->$instagram);
  }

  $google_music = get_post_meta($post_id, 'google_music');
  if($google_music != $event->$google_music) {
    update_post_meta($post_id, '$google_music', $event->$google_music);
  }

  $apple_music = get_post_meta($post_id, 'apple_music');
  if($apple_music != $event->$apple_music) {
    update_post_meta($post_id, '$apple_music', $event->$apple_music);
  }

  $spotify = get_post_meta($post_id, 'spotify');
  if($spotify != $event->$spotify) {
    update_post_meta($post_id, '$spotify', $event->$spotify);
  }

  $soundcloud = get_post_meta($post_id, 'soundcloud');
  if($soundcloud != $event->$soundcloud) {
    update_post_meta($post_id, '$soundcloud', $event->$soundcloud);
  }

  $deezer = get_post_meta($post_id, 'deezer');
  if($deezer != $event->$deezer) {
    update_post_meta($post_id, '$deezer', $event->$deezer);
  }

  $youtube = get_post_meta($post_id, 'youtube');
  if($youtube != $event->$youtube) {
    update_post_meta($post_id, '$youtube', $event->$youtube);
  }

  $vimeo = get_post_meta($post_id, 'vimeo');
  if($vimeo != $event->$vimeo) {
    update_post_meta($post_id, '$vimeo', $event->$vimeo);
  }
}

function compare_event($event) {
  $args = array(
    'post_type' => 'imported_event',
    'meta_query' => array(
      array(
          'key' => 'event_id',
          'value' => $event->id
      )
    )
  );
  $event_query = get_posts($args);

  return $event_query;
}

add_action( 'admin_post_create_events', 'create_events' );

function create_events() {
  $number_of_events = $_POST['number_of_events'];
  $events = get_event_json($number_of_events);

  foreach($events as $event) {
    $stored_events = compare_event($event);
    if($stored_events != null){
      foreach($stored_events as $stored_event) {
        update_event($event, $stored_event, $stored_event->ID);
      }
    } 
    else {
      $post_id = insert_event_post_type($event);
      insert_event_featured_image($post_id, $event);
      if($post_id) {
        insert_event_meta($post_id, $event);
      }
    }
  }
  wp_redirect(admin_url('admin.php?page=helsingborg-dsc-event-import'));
}

