<?php

add_action('admin_menu', helsingborg_dsc_site_settings_admin_menu);

function helsingborg_dsc_site_settings_admin_menu() {
  add_menu_page( $helsingborg_api_event_import, 'Site settings', 'manage_options', 'helsingborg-dsc-site-settings', helsingborg_dsc_site_settings_menu_callback );
}

add_action('admin_init', function() {
  register_setting( 'hdsc-site-settings', 'hdsc-site-setting-google-analytics' );
  register_setting( 'hdsc-site-settings', 'hdsc-site-setting-google-maps-api-key' );
  register_setting( 'hdsc-site-settings', 'hdsc-site-setting-idle-timeout' );
  register_setting( 'hdsc-site-settings', 'hdsc-site-setting-chat-button-text' );
  foreach(hdsc_translatables() as $translatable) {
    $option_name = 'hdsc-translatable-' . $translatable[1];
    register_setting( 'hdsc-site-settings', $option_name );
  }
});

function helsingborg_dsc_site_settings_menu_callback() {
?>
  <style>
    .form-table select {
      width: 25em;
    }
    .form-table .background-img-url {
      width: 21.6em;
    }
  </style>
  <div class="wrap">
    <form action="options.php" method="post">
      <?php
        settings_fields( 'hdsc-site-settings' );
        do_settings_sections( 'hdsc-site-settings' );
      ?>

      <div class="wrap"><h2>Site settings</h2></div>

      <?php if (isset($_GET['settings-updated'])) { ?>
        <div id="message" class="updated">
        <p><strong><?php _e('Settings saved.') ?></strong></p>
        </div>
      <?php } ?>

      <table class="form-table"><tbody>
      <tr>
        <th><label for="sitesettingsform-google-analytics">Google Analytics ID</label></th>
        <td><input id="sitesettingsform-google-analytics" type="text" class="regular-text" name="hdsc-site-setting-google-analytics" value="<?php echo get_option('hdsc-site-setting-google-analytics'); ?>" /><p class="description">Lämna blank för att inte aktivera Google Analytics.</p></td>
      </tr>
      <tr>
        <th><label for="sitesettingsform-google-maps-api-key">Google Maps API Key</label></th>
        <td><input id="sitesettingsform-google-maps-api-key" type="text" class="regular-text" name="hdsc-site-setting-google-maps-api-key" value="<?php echo get_option('hdsc-site-setting-google-maps-api-key'); ?>" /></td>
      </tr>
      <tr>
        <th><label for="sitesettingsform-idle-timeout">Inactive timeout (in seconds)</label></th>
        <td><input id="sitesettingsform-idle-timeout" type="number" class="regular-text" name="hdsc-site-setting-idle-timeout" value="<?php echo get_option('hdsc-site-setting-idle-timeout'); ?>" /><p class="description">Gör så sidan laddas om till start efter användaren <br />varit inaktiv i X sekunder. Lämna blank för att inaktivera.</p></td>
      </tr>
      <tr>
        <th><label for="sitesettingsform-chat-button-text">Chattknapptext</label></th>
        <td><input id="sitesettingsform-chat-button-text" type="text" class="regular-text" name="hdsc-site-setting-chat-button-text" value="<?php echo get_option('hdsc-site-setting-chat-button-text'); ?>" /><p class="description">Lämna blank för att inte visa chatta med oss-knapp</p></td>
      </tr>
      </tbody></table>

      <div class="wrap"><h2>Translatables</h2></div>

      <table class="form-table"><tbody>
      <?php

        foreach(hdsc_translatables() as $translatable) {
          $translatable_name = $translatable[0];
          $option_name = 'hdsc-translatable-' . $translatable[1];
          ?>
          <tr>
            <th><label for="<?php echo $option_name ?>"><?php echo $translatable_name ?></label></th>
            <td><input id="<?php echo $option_name ?>" type="text" class="regular-text" name="<?php echo $option_name ?>" value="<?php echo get_option($option_name); ?>" /></td>
          </tr>
          <?php
        }
      ?>
      </tbody></table>
      <?php submit_button(); ?>
    </form>
  </div>
<?php
}

?>