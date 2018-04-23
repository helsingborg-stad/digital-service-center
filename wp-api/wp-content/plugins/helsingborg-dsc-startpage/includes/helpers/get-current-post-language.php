<?php

namespace helsingborg_dsc_startpage;

function get_current_post_language($post_id) {
    $lang = $_REQUEST['lang'];
  
    if(get_post_id_translated($post_id) != null) {
      return get_post(get_post_id_translated($post_id));
    }
    else if(!isset($lang)) {
      return get_post($post_id);
    }
    else {
      return;
    }
  }
?>