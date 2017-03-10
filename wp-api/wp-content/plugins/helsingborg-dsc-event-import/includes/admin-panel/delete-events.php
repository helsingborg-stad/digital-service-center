<?php
/*******************************
* delete functions
*******************************/

add_action( 'admin_post_delete_outdated_events', 'delete_outdated_events' );

function delete_outdated_events() {
    $stored_event_args = array(
        'post_type' => 'imported_event',
        'nopaging' => true
    );

    $stored_events = get_posts($stored_event_args);
    $last_stored_event = count($stored_events);
    $current_stored_event = 1;

    $pages = intval($stored_events) / 100;
    $pages = ceil($pages);
    $events_per_page = $last_stored_event;

    for($page = 1; $page <= $pages; $page++) {
        if($pages > 1) {     
            if($page == $pages) {
                $events_per_page = $number_of_events - (($pages - 1) * 100);
            }
            else 
            {
                $events_per_page = 100;
            }
        }
        $json = 'https://api.helsingborg.se/event/json/wp/v2/event/?page=' . $page . '&per_page=' . $events_per_page . '&include=';
        foreach($stored_events as $stored_event) {
            if($current_stored_event == $last_stored_event) 
            {
                $json = $json . $stored_event->event_id;
            }
            else 
            {
                $json = $json . $stored_event->event_id . ',';
            }
            $current_stored_event++;
        }
        $events = json_decode(file_get_contents($json));
        check_and_delete_outdated_events($stored_events, $events);
       
    }

    wp_redirect(admin_url('admin.php?page=helsingborg-dsc-event-import'));
}

function check_and_delete_outdated_events($stored_events, $events) {
    $imported_event_id_array = array();
    foreach($events as $event_im) {
    $event_id = $event_im->id;
    $imported_event_id_array[] = (string)$event_id;
    }

    foreach($stored_events as $event) {
        if (!empty($imported_event_id_array)) {
        $event_id = get_post_meta($event->ID, 'event_id', true);
            if (!in_array((string)$event_id, $imported_event_id_array)) 
            {         
                $attach_id = get_post_thumbnail_id($event->ID);
                wp_delete_attachment($attach_id, true);
                wp_delete_post($event->ID, true);
            }
        }
    }
}
