<?php

function hdsc_landing_settings_init() {
  add_menu_page('Landing Pages', 'Landing Pages', 'manage_options', 'landing-pages', hdsc_landing_menu_callback, 'dashicons-location-alt', 7);
}

add_action('admin_menu', hdsc_landing_settings_init);

add_action('admin_init', function() {
  register_setting( 'hdsc-landing-settings', 'hdsc-landing-settings-heading-visitor');
  register_setting( 'hdsc-landing-settings', 'hdsc-landing-settings-bottom-links-visitor');
  register_setting( 'hdsc-landing-settings', 'hdsc-landing-settings-heading-local');
  register_setting( 'hdsc-landing-settings', 'hdsc-landing-settings-bottom-links-local');
  register_setting( 'hdsc-landing-settings', 'hdsc-landing-settings-free-wifi-page');
});

function hdsc_landing_get_selectable_links_for_option($option) {
  $selectedPageIds = get_option($option, []);
  $ret = [];
  $pages = get_pages('sort_column=menu_order');
  if ($pages == null) {
    return $ret;
  }
  foreach ($pages as $page) {
    $ret[$page->ID] = [
      title => $page->post_title,
      depth => count(get_ancestors($page->ID, 'page')),
      selected => in_array($page->ID, $selectedPageIds)
    ];
  }
  return $ret;
}

function hdsc_landing_menu_callback() {
?>
  <style>
    .form-table select {
      width: 25em;
    }
  </style>
  <div class="wrap">
    <form action="options.php" method="post">
      <?php
        settings_fields( 'hdsc-landing-settings' );
        do_settings_sections( 'hdsc-landing-settings' );
      ?>

      <div class="wrap"><h2>Landing Pages</h2></div>

      <?php if (isset($_GET['settings-updated'])) { ?>
        <div id="message" class="updated">
        <p><strong><?php _e('Settings saved.') ?></strong></p>
        </div>
      <?php } ?>
      <div class="wrap"><h3>Visitor</h3></div>
      <table class="form-table"><tbody>

      <tr>
        <th><label for="landingform-heading-visitor">Heading</label></th>
        <td><input id="landingform-heading-visitor" type="text" class="regular-text" name="hdsc-landing-settings-heading-visitor" value="<?php echo get_option('hdsc-landing-settings-heading-visitor'); ?>" /></td>
      </tr>

      <tr>
        <th><label for="landingform-bottom-links-visitor">Bottom links</label></th>
        <td>
          <select id="landingform-bottom-links-visitor" multiple name="hdsc-landing-settings-bottom-links-visitor[]">
          <?php foreach(hdsc_landing_get_selectable_links_for_option('hdsc-landing-settings-bottom-links-visitor') as $id=>$page) {
            echo '<option value="' . $id . '"' . ($page['selected'] ? "selected" : "") . '>' . $page['title'] . '</option>';
          } ?>
          </select>
        </td>
      </tr>

      </tbody></table>

      <div class="wrap"><h3>Local</h3></div>
      <table class="form-table"><tbody>

      <tr>
        <th><label for="landingform-heading-local">Heading</label></th>
        <td><input id="landingform-heading-local" type="text" class="regular-text" name="hdsc-landing-settings-heading-local" value="<?php echo get_option('hdsc-landing-settings-heading-local'); ?>" /></td>
      </tr>

      <tr>
        <th><label for="landingform-bottom-links-local">Bottom links</label></th>
        <td>
          <select id="landingform-bottom-links-local" multiple name="hdsc-landing-settings-bottom-links-local[]">
          <?php foreach(hdsc_landing_get_selectable_links_for_option('hdsc-landing-settings-bottom-links-local') as $id=>$page) {
            echo '<option value="' . $id . '"' . ($page['selected'] ? "selected" : "") . '>' . $page['title'] . '</option>';
          } ?>
          </select>
        </td>
      </tr>

      </tbody></table>
      <h3>Free wifi</h3>
      <table class="form-table">
        <tr>
          <th><label for="hdsc-landing-settings-free-wifi-page">Link</label></th>
          <td>
          <?php
          $current_selected_wifi_page = get_option('hdsc-landing-settings-free-wifi-page');
          $args = [
            'name' => 'hdsc-landing-settings-free-wifi-page',
            'selected' => $current_selected_wifi_page
          ];
          wp_dropdown_pages($args);
          ?>
          </td>
        </tr>
      </table>
      <?php submit_button(); ?>
    </form>
  </div>
<?php
}
