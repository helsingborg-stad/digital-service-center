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
  register_setting( 'hdsc-startpage-settings', 'hdsc-startpage-setting-top-links');
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
        <div class="background-img-wrapper">
          <?php
            $bgUrl = get_option('hdsc-startpage-setting-background-url');
            $isVideo = preg_match('/.webm$/', $bgUrl) || preg_match('/.mp4$/', $bgUrl);
            $markup = ($isVideo)
              ? '<video loop muted autoplay height="135" width="240"><source src="' . $bgUrl . '" /></video>'
              : '<img src="' . $bgUrl . '" height="135" width="240" />';

            echo $markup;
            ?>
        </div>
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
                      $('.background-img-url').val(attachment.url);
                      var isVideo = attachment.url.match(/.webm$/) || attachment.url.match(/.mp4$/);
                      if (isVideo) {
                        $('.background-img-wrapper').html(
                          '<video loop muted autoplay height="135" width="240">' +
                            '<source src="' + attachment.url + '" />' +
                          '</video>');
                        $('.background-img-wrapper').load();
                        $('.background-img-wrapper').play();
                      } else {
                        $('.background-img-wrapper').html('<img src="' + attachment.url + '" height="135" width="240" />');
                      }
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

      <p><label>Top links
        <select multiple name="hdsc-startpage-setting-top-links[]">
        <?php foreach(hdsc_startpage_get_selectable_top_links() as $id=>$page) {
          echo '<option value="' . $id . '"' . ($page['selected'] ? "selected" : "") . '>' . $page['title'] . '</option>';
        } ?>
        </select>
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
