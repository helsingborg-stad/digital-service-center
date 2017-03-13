<?php

function hdsc_startpage_settings_init() {
  add_menu_page('Startpage', 'Startpage', 'manage_options', 'startpage', hdsc_startpage_menu_callback, 'dashicons-store', 5);
}

add_action('admin_menu', hdsc_startpage_settings_init);

add_action('admin_init', function() {
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-background-url' );
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-heading');
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-visitor-heading');
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-local-heading');
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-today-heading');
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-top-links');
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-visitor-category');
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-local-category');
});

function hdsc_startpage_get_selectable_top_links() {
  $selectedPageIds = get_option('hdsc-startpage-setting-top-links', []);
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

function hdsc_startpage_menu_callback() {
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
        settings_fields( 'hdsc-startpage-settings' );
        do_settings_sections( 'hdsc-startpage-settings' );
      ?>

      <div class="wrap"><h2>Startpage</h2></div>

      <?php if (isset($_GET['settings-updated'])) { ?>
        <div id="message" class="updated">
        <p><strong><?php _e('Settings saved.') ?></strong></p>
        </div>
      <?php } ?>
<?php
  if (function_exists( 'wp_enqueue_media' )) {
    wp_enqueue_media();
  } else {
    wp_enqueue_style('thickbox');
    wp_enqueue_script('media-upload');
    wp_enqueue_script('thickbox');
  }
?>
      <table class="form-table"><tbody>
      <tr>
        <th>
          Länk till bakgrundsbild
        </th>
        <td>
        <div class="background-img-wrapper">
          <?php
            $bgUrl = get_option('hdsc-startpage-setting-background-url');
            $isVideo = preg_match('/.webm$/', $bgUrl) || preg_match('/.mp4$/', $bgUrl);
            $markup = ($isVideo)
              ? '<video loop muted autoplay width="350"><source src="' . $bgUrl . '" /></video>'
              : '<img src="' . $bgUrl . '" width="350" />';

            echo $markup;
            ?>
        </div>
        <input class="background-img-url" type="text" name="hdsc-startpage-setting-background-url" size="60" value="<?php echo get_option('hdsc-startpage-setting-background-url'); ?>">
        <a href="#" class="background-img-upload">Select</a>
      </td>

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
                      $('.background-img-url').val(attachment.url);
                      var isVideo = attachment.url.match(/.webm$/) || attachment.url.match(/.mp4$/);
                      if (isVideo) {
                        $('.background-img-wrapper').html(
                          '<video loop muted autoplay width="350">' +
                            '<source src="' + attachment.url + '" />' +
                          '</video>');
                        $('.background-img-wrapper').load();
                        $('.background-img-wrapper').play();
                      } else {
                        $('.background-img-wrapper').html('<img src="' + attachment.url + '" width="350" />');
                      }
                  })
                  .open();
              });
              $('.background-img-url').on('change', function() {
                $('.background-img').attr('src', $(this).val());
              })
          });
      </script>

      <tr>
        <th><label>Heading</label></th>
        <td><input type="text" class="regular-text" name="hdsc-startpage-setting-heading" value="<?php echo get_option('hdsc-startpage-setting-heading'); ?>" /></td>
      </tr>

      <tr>
        <th><label>Visitor Heading</label></th>
        <td><input type="text" class="regular-text" name="hdsc-startpage-setting-visitor-heading" value="<?php echo get_option('hdsc-startpage-setting-visitor-heading'); ?>" /></td>
      </tr>

      <tr>
        <th><label>Local Heading</label></th>
        <td><input type="text" class="regular-text" name="hdsc-startpage-setting-local-heading" value="<?php echo get_option('hdsc-startpage-setting-local-heading'); ?>" /></td>
      </tr>

      <tr>
        <th><label>Today Heading</label></th>
        <td><input type="text" class="regular-text" name="hdsc-startpage-setting-today-heading" value="<?php echo get_option('hdsc-startpage-setting-today-heading'); ?>" /></td>
      </tr>

      <tr>
        <th><label>Top links</label></th>
        <td>
          <select multiple name="hdsc-startpage-setting-top-links[]">
          <?php foreach(hdsc_startpage_get_selectable_top_links() as $id=>$page) {
            echo '<option value="' . $id . '"' . ($page['selected'] ? "selected" : "") . '>' . $page['title'] . '</option>';
          } ?>
          </select>
        </td>
      </tr>

      <tr>
        <th><label>Visitor category</label></th>
        <td><?php wp_dropdown_categories([name => 'hdsc-startpage-setting-visitor-category', selected => get_option('hdsc-startpage-setting-visitor-category', 0)]); ?></td>
      </tr>

      <tr>
        <th><label>Local category</label></th>
        <td><?php wp_dropdown_categories([name => 'hdsc-startpage-setting-local-category', selected => get_option('hdsc-startpage-setting-local-category', 0)]); ?></td>
      </tr>
      </tbody></table>
      <?php submit_button(); ?>
    </form>
  </div>
<?php
}
