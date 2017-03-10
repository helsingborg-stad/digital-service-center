<?php
/*******************************
* import event categories
*******************************/

add_action( 'init', 'create_imported_event_categories' );

function create_imported_event_categories() {
    $pages = array(
        'imported_event',
        'editable_event'
    );
    
    register_taxonomy(
    'imported_category',
    $pages,
        array(
            'label' => __( 'Importerade kategorier' ),
            'rewrite' => array( 'slug' => 'imported_category' ),
            'hierarchical' => true,
        )
    );
}

?>