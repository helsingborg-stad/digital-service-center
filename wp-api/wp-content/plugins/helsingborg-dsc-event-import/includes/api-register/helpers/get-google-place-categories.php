<?php

namespace helsingborg_dsc_event_import;

function get_google_place_categories($place_types) {
    if(!is_array($place_types)){
      $place_types = [];
    }
    return $distinct_place_types = array_reduce(
        get_option('saved_google_place_types', []),
        function($acc, $p) use ($place_types) {
            $place_type = $p['google_place_type'];
            if (in_array($place_type, $place_types)) {
                $cat = get_category(intval($p['event_category_id']));
                if ($cat->cat_ID != null) {
                  $acc[] = [ id => $cat->cat_ID, slug => $cat->slug, name => $cat->cat_name];
                }
            }
            return $acc;
        },
        []
    );
  }
?>