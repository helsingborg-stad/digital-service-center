<?php
/*******************************
* import functions
*******************************/

add_action( 'admin_post_manually_create_and_update_events', 'manually_create_and_update_events' );

function manually_create_and_update_events() {
  $number_of_events = $_POST['manual_number_of_events'];
  create_and_update_events();
}

function create_and_update_events() {

  import_event_categories();

  $events = json_decode(file_get_contents('/var/www/html/events.json'));

  $event_ids_to_keep = array_map(function ($event) { return (string)$event->id; }, $events);

  $already_imported_events_to_remove = get_posts([
    post_type => 'imported_event',
    numberposts => -1,
    meta_query => [[
      key => 'event_id',
      value => $event_ids_to_keep,
      compare => 'NOT IN'
    ]]
  ]);

  foreach ($already_imported_events_to_remove as $event_to_remove) {
    wp_delete_post($event_to_remove->ID, true);
    $attach_id = get_post_thumbnail_id($event_to_remove->ID);
    wp_delete_attachment($attach_id, true);
    delete_post_meta($event_to_remove->ID, 'imported_event_data');
    delete_post_meta($event_to_remove->ID, 'event_id');
    delete_post_meta($event_to_remove->ID, 'post_content_translated');
    delete_post_meta($event_to_remove->ID, 'post_title_translated');
  }


  foreach($events as $event) {
    if(does_event_already_exist($event)){
        $stored_event = get_stored_event($event);
        update_event($event, $stored_event, $stored_event->ID);
        update_translated_event_meta($event, $stored_event, $stored_event->ID);
        insert_event_category($stored_event->ID, $event);
        update_or_insert_categorys_translations($event);
    } else {
      $post_id = insert_event_post_type($event);
      insert_event_category($post_id, $event);
      update_or_insert_categorys_translations($event);
      if($event->featured_media->source_url != null) {
        insert_event_featured_image($post_id, $event);
      }
      if($post_id) {
        insert_event_meta($post_id, $event);
      }
    }
    update_or_insert_categorys_translations($event);
  }

  wp_redirect(admin_url('admin.php?page=helsingborg-dsc-event-import'));
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

function insert_event_category($post_id, $event){
  $event_categories = $event->event_categories;
  if($event_categories != null) {
      foreach($event_categories as $event_category) {
        wp_set_object_terms($post_id, $event_category, 'imported_category');
    }
  }
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

function update_event_featured_image($post_id, $event) {
  $attach_id = get_post_thumbnail_id($post_id);
  wp_delete_attachment($attach_id, true);
  if($event->featured_media->source_url != null) {
    insert_event_featured_image($post_id, $event);
  }
}

function insert_event_meta($post_id, $event){
  add_post_meta($post_id, 'imported_event_data', $event, true);
  add_post_meta($post_id, 'event_id', $event->id, true);

  $translated_content = translate_text($event->content->rendered);
  $translated_title = translate_text($event->title->rendered);

  add_post_meta($post_id, 'post_content_translated', $translated_content, true);
  add_post_meta($post_id, 'post_title_translated', $translated_title, true);  
}

function update_translated_event_meta($event, $stored_event, $post_id){
  $post_meta_title = get_post_meta($post_id, 'post_title_translated', true);
  $post_meta_content = get_post_meta($post_id, 'post_content_translated', true);

  if($event->title->rendered != $stored_event->post_title 
  || ($post_meta_title == null || $post_meta_title == '')){
    update_post_meta($post_id, 'post_title_translated', translate_text($event->title->rendered));
  }
  
  if ($event->content->rendered != $stored_event->post_content 
  || ($post_meta_content == null || $post_meta_content == '')) {
    update_post_meta($post_id, 'post_content_translated', translate_text($event->content->rendered));
  }
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

  $featured_media_url = wp_get_attachment_url( get_post_thumbnail_id($post_id) );
  if(basename($event->featured_media->source_url) != basename($featured_media_url)) {
    update_event_featured_image($post_id, $event);
  }

  $stored_event_imported_data = get_post_meta($post_id, 'imported_event_data');
  if($stored_event_imported_data != $event) {
    update_post_meta($post_id, 'imported_event_data', $event);
  }
}

function does_event_already_exist($event) {
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

  return $event_query != null;
}

function get_categorys($category = null){
  global $wpdb;
  $table_name = $wpdb->prefix . 'category_translations';
  if($category == null){
    $query = $wpdb->get_results( "SELECT * FROM $table_name",ARRAY_A);
  }else{
    $query = $wpdb->get_results( "SELECT * FROM $table_name WHERE sv='$category'" );
  }
  
  return $query;
}

function get_categorys_translation($category){
  global $wpdb;
  $table_name = $wpdb->prefix . 'category_translations';
  $query = $wpdb->get_results( "SELECT * FROM $table_name WHERE sv='$category'" );

  return $query;
}

function update_or_insert_categorys_translations($event){
  global $wpdb;
  $table_name = $wpdb->prefix . 'category_translations';
  if($event != null){
      foreach ((array)$event->event_categories as $category) {
          $does_category_exist = get_categorys_translation(htmlspecialchars_decode($category));
          $is_translated = get_categorys_translation(htmlspecialchars_decode($category));
          if(count($does_category_exist)> 0){
              $sql = $wpdb->prepare(
                  "INSERT INTO `$table_name`
                     (`sv`, `en`) 
               values (%s, %s)", array(htmlspecialchars_decode($category), translate_text(htmlspecialchars_decode($category))));
              $wpdb->query($sql);
          }
          if($does_category_exist && ($is_translated[0]->en == '' || $is_translated[0]->en == null)){
              $sql = $wpdb->prepare(
                  "UPDATE `$table_name`
                  SET `en` = '%s'
                  WHERE `sv` = '%s'", array(translate_text(htmlspecialchars_decode($category)), htmlspecialchars_decode($category)));
              $wpdb->query($sql);
          }
      }
  }
}

function get_stored_event($event) {
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

  return $event_query[0]; 
}

function get_event_category_json(){
  $json = file_get_contents('https://api.helsingborg.se/event/json/wp/v2/event_categories');
  $json_decode = json_decode($json);
  return $json_decode;
}

function import_event_categories() {
  $event_categories = get_event_category_json();
  if($event_categories != null) {
    foreach($event_categories as $event_category) {
      wp_insert_term($event_category->name, 'imported_category');
    }
  }
}

function translate_text($text) {
	$url = 'https://translation.googleapis.com/language/translate/v2?key=' . get_option('hdsc-site-setting-google-translate-api-key');
  
	$arr = array(
	  'q' => $text,
	  'source' => 'sv',
	  'target' => 'en'
	);
	$data = json_encode($arr);
  
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=UTF-8'));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_FAILONERROR, true);
	$response  = curl_exec($ch);
	$response = json_decode($response, true);
  $responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

  if ($responseCode != 200) {
    error_log('Translate error: ' . curl_error($ch) . ' ' . $response['error']['message'] .' KEY: ' . get_option('hdsc-site-setting-google-translate-api-key'));
    curl_close($ch);
    return '';
  }
  
  curl_close($ch);
	return $response['data']['translations'][0]['translatedText'];
	
  }
