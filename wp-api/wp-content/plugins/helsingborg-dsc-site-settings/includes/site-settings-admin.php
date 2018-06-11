<?php

add_action('admin_menu', helsingborg_dsc_site_settings_admin_menu);

function helsingborg_dsc_site_settings_admin_menu() {
  add_menu_page( $helsingborg_api_event_import, 'Site settings', 'manage_options', 'helsingborg-dsc-site-settings', helsingborg_dsc_site_settings_menu_callback );
}

add_action('admin_init', function() {
  register_setting( 'hdsc-site-settings', 'hdsc-site-setting-google-analytics' );
  register_setting( 'hdsc-site-settings', 'hdsc-site-setting-google-maps-api-key' );
  register_setting( 'hdsc-site-settings', 'hdsc-site-setting-google-translate-api-key' );
  register_setting( 'hdsc-site-settings', 'hdsc-site-setting-idle-timeout' );
  register_setting( 'hdsc-site-settings', 'hdsc-site-setting-show-chat' );
  register_setting( 'hdsc-site-settings', 'hdsc-site-setting-show-flags' );
  register_setting( 'hdsc-site-settings', 'hdsc-site-setting-inverted-search-field' );
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
        <th><label for="sitesettingsform-google-translate-api-key">Google Translate API Key</label></th>
        <td><input id="sitesettingsform-google-translate-api-key" type="text" class="regular-text" name="hdsc-site-setting-google-translate-api-key" value="<?php echo get_option('hdsc-site-setting-google-translate-api-key'); ?>" /></td>
      </tr>
      <tr>
        <th><label for="sitesettingsform-idle-timeout">Inactive timeout (in seconds)</label></th>
        <td><input id="sitesettingsform-idle-timeout" type="number" class="regular-text" name="hdsc-site-setting-idle-timeout" value="<?php echo get_option('hdsc-site-setting-idle-timeout'); ?>" /><p class="description">Gör så sidan laddas om till start efter användaren <br />varit inaktiv i X sekunder. Lämna blank för att inaktivera.</p></td>
      </tr>
      <tr>
        <th><label for="sitesettingsform-show-chat">Aktivera Vergic chatt</label></th>
        <td><input id="sitesettingsform-show-chat" type="checkbox" class="regular-text" name="hdsc-site-setting-show-chat" <?php checked( 'on', get_option( 'hdsc-site-setting-show-chat' ) ); ?>  /></td>
      </tr>
      <tr>
        <th><label for="sitesettingsform-show-flags">Visa språkväljare</label></th>
        <td><input id="sitesettingsform-show-flags" type="checkbox" class="regular-text" name="hdsc-site-setting-show-flags" <?php checked( 'on', get_option( 'hdsc-site-setting-show-flags' ) ); ?>  /></td>
      </tr>
      <tr>
        <th><label for="sitesettingsform-inverted-search-field">Använd vitt sökfält på Quickstart</label></th>
        <td><input id="sitesettingsform-inverted-search-field" type="checkbox" class="regular-text" name="hdsc-site-setting-inverted-search-field" <?php checked( 'on', get_option( 'hdsc-site-setting-inverted-search-field' ) ); ?>  /></td>
      </tr>
      </tbody></table>

      <div class="wrap"><h2>Translatables</h2></div>

      <table class="form-table"><tbody>
      <?php

        foreach(hdsc_translatables() as $translatable) {
          $translatable_name = $translatable[0];
          $option_name = 'hdsc-translatable-' . $translatable[1];
          $help_text = $translatable[2];
          ?>
          <tr>
            <th><label for="<?php echo $option_name ?>"><?php echo $translatable_name ?></label></th>
            <td>
              <input id="<?php echo $option_name ?>" type="text" class="regular-text" name="<?php echo $option_name ?>" value="<?php echo get_option($option_name); ?>" />
              <?php if ($help_text) { ?>
                <p class="description"><?php echo $help_text ?></p>
              <?php } ?>
            </td>
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