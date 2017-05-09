<?php
/**
 * A minimal theme used to show only page contents,
 * without header, footer, nav or other elements present.
 */
?>

<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>">
  <link href="//fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css" />
  <?php wp_head(); ?>
</head>


<div class="wrap">
  <header class="page-header">
    <h1 class="page-title"><?php the_title(); ?></h1>
  </header>

  <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
  <main><?php the_content(__('(more...)')); ?></main>
  <?php endwhile; endif; ?>

  <?php wp_footer(); ?>
  </body>
</html>
