<?php

function hdsc_startpage_settings_init() {
  add_menu_page('Startpage', 'Startpage', 'manage_options', 'startpage', hdsc_startpage_menu_callback, 'dashicons-store', 5);

  add_submenu_page('startpage', 'Visitor', 'Visitor', 'manage_options', 'startpage-visitor', hdsc_startpage_submenu_visitor_callback);

  add_submenu_page('startpage', 'Local', 'Local', 'manage_options', 'startpage-local', hdsc_startpage_submenu_local_callback);
}

add_action('admin_menu', hdsc_startpage_settings_init);

add_action('admin_init', function() {
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-background-url' );
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-heading');
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-visitor-heading');
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-local-heading');
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-today-heading');
});


function hdsc_startpage_menu_callback() {
?>
  <div class="wrap">
    <form action="options.php" method="post">
      <?php
        settings_fields( 'hdsc-startpage-settings' );
        do_settings_sections( 'hdsc-startpage-settings' );
      ?>

      <div class="wrap"><h2>Startpage</h2></div>
<?php
  if (function_exists( 'wp_enqueue_media' )) {
    wp_enqueue_media();
  } else {
    wp_enqueue_style('thickbox');
    wp_enqueue_script('media-upload');
    wp_enqueue_script('thickbox');
  }
?>
      <p><strong>Länk till bakgrundsbild</strong><br />
        <img class="background-img" src="<?php echo get_option('hdsc-startpage-setting-background-url'); ?>" height="135" width="240"/>
        <input class="background-img-url" type="text" name="hdsc-startpage-setting-background-url" size="60" value="<?php echo get_option('hdsc-startpage-setting-background-url'); ?>">
        <a href="#" class="background-img-upload">Select</a>
      </p>

      <script>
          jQuery(document).ready(function($) {
              $('.background-img-upload').click(function(e) {
                  e.preventDefault();

                  var custom_uploader = wp.media({
                      title: 'Background image',
                      button: {
                          text: 'Select image'
                      },
                      multiple: false
                  })
                  .on('select', function() {
                      var attachment = custom_uploader.state().get('selection').first().toJSON();
                      $('.background-img').attr('src', attachment.url);
                      $('.background-img-url').val(attachment.url);
                  })
                  .open();
              });
              $('.background-img-url').on('change', function() {
                $('.background-img').attr('src', $(this).val());
              })
          });
      </script>

      <p><label>Heading
        <input type="text" name="hdsc-startpage-setting-heading" value="<?php echo get_option('hdsc-startpage-setting-heading'); ?>" />
      </label></p>

      <p><label>Visitor Heading
        <input type="text" name="hdsc-startpage-setting-visitor-heading" value="<?php echo get_option('hdsc-startpage-setting-visitor-heading'); ?>" />
      </label></p>

      <p><label>Local Heading
        <input type="text" name="hdsc-startpage-setting-local-heading" value="<?php echo get_option('hdsc-startpage-setting-local-heading'); ?>" />
      </label></p>

      <p><label>Today Heading
        <input type="text" name="hdsc-startpage-setting-today-heading" value="<?php echo get_option('hdsc-startpage-setting-today-heading'); ?>" />
      </label></p>

      <?php submit_button(); ?>
    </form>
  </div>
<?php
}

function hdsc_startpage_submenu_visitor_callback() {

}

function hdsc_startpage_submenu_local_callback() {
  echo '<div class="wrap">
          <h2>Local</h2>
        </div>';
}
