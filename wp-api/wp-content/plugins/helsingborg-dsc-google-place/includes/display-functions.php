<?php
/*******************************
* display functions
*******************************/
$query_args = array( 
    's' => 'årets',
    'nopaging' => true
);
$custom_query = new WP_Query( $query_args );

while($custom_query->have_posts()) : $custom_query->the_post(); 
?>
    <div <?php post_class(); ?> id="post-<?php the_ID(); ?>">
        <h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
        <?php the_content(); ?>
    </div>
<?php
endwhile;
wp_reset_postdata();

?>