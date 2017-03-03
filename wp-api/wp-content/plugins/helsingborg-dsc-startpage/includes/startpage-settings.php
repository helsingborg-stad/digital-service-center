<?php

function hdsc_startpage_settings_init() {
  add_menu_page('Startpage', 'Startpage', 'manage_options', 'startpage', hdsc_startpage_menu_callback, 'dashicons-store', 5);

  add_submenu_page('startpage', 'Visitor', 'Visitor', 'manage_options', 'startpage-visitor', hdsc_startpage_submenu_visitor_callback);

  add_submenu_page('startpage', 'Local', 'Local', 'manage_options', 'startpage-local', hdsc_startpage_submenu_local_callback);
}

add_action('admin_menu', hdsc_startpage_settings_init);

add_action('admin_init', function() {
  // register_setting( 'hdsc-startpage-settings', 'setting_name...' );
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
      Form goes here.

      <?php submit_button(); ?>
    </form>
  </div>
<?php
}

function hdsc_startpage_submenu_visitor_callback() {
  echo '<div class="wrap">
          <h2>Visitor</h2>
        </div>';
}

function hdsc_startpage_submenu_local_callback() {
  echo '<div class="wrap">
          <h2>Local</h2>
        </div>';
}
