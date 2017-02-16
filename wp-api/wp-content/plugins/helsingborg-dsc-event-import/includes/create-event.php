<?php

// insert the post and set the category
$post_id = wp_insert_post(array (
    'post_type' => 'your_post_type',
    'post_title' => $your_title,
    'post_content' => $your_content,
    'post_status' => 'publish',
    'comment_status' => 'closed',   // if you prefer
    'ping_status' => 'closed',      // if you prefer
));

if ($post_id) {
    // insert post meta
    add_post_meta($post_id, '_your_custom_1', $custom1);
    add_post_meta($post_id, '_your_custom_2', $custom2);
    add_post_meta($post_id, '_your_custom_3', $custom3);
}

?>