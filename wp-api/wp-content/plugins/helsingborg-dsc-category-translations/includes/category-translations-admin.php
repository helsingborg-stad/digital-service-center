<?php
$plugin = basename( plugin_dir_path(  dirname( __FILE__ , 2 ) ) );
add_action('admin_menu', helsingborg_dsc_category_translations_admin_menu);

function helsingborg_dsc_category_translations_admin_menu() {
  add_menu_page( $helsingborg_api_category_translations, 'Category Translations', 'manage_options', 'helsingborg-dsc-category-translations', helsingborg_dsc_category_translations_callback );
}

function helsingborg_dsc_category_translations_callback(){
    if( current_user_can( 'edit_users' ) ) {

      $add_meta_nonce = wp_create_nonce( 'add_category_nonce' );
  ?>
  <style>
  table.form-table {
    width: 50%;
  }
  .form-table td {
    padding: 3px;
  }
  table.form-table thead {
    background: #F1F1F1;
    border-bottom: 2px solid #444444;
  }
  table.form-table thead th {
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }
  .form-table input {
      width: 100%;
      height: 33px;
  }
  </style>
    <div class="wrap">
      <form action="<?php echo esc_url( admin_url('admin-post.php') ); ?>" method="post">

        <div class="wrap"><h2>Category Translations</h2></div>
        <?php if (isset($_GET['updated'])) { ?>
          <div class="notice notice-success is-dismissible">
            <p><?php _e('Category(s) updated.', 'bbb'); ?></p>
      </div>
        <?php } ?>
        <table class="form-table">
        <thead>
        <tr>
            <th>Svenska</th>
            <th>Engelska</th>
            <th>FA Icon</th>
        </tr>
        </thead>
        <tbody>
        <?php
          foreach(get_categorys() as $category) {
            $cat_sv = $category['sv'];
            $cat_en = $category['en'];
            $cat_icon = $category['icon'];
            ?>
          <tr>
          <td><input id="<?php echo $cat_sv; ?>" type="text" class="regular-text" name="categories[<?php echo $cat_sv; ?>]" value="<?php echo $cat_sv; ?>" readonly/></td>
          <td><input id="<?php echo $cat_en; ?>" type="text" class="regular-text" name="categories[<?php echo $cat_sv; ?>][translation]" value="<?php echo $cat_en; ?>" /></td>
          <td><input id="<?php echo $cat_icon; ?>" type="text" class="regular-text" name="categories[<?php echo $cat_sv; ?>][icon]" value="<?php echo $cat_icon; ?>" /><i class="<?php echo $cat_icon; ?>"></i></td>
          </tr>
            <?php
          }
        ?>
          <input type="hidden" name="action" value="category_update">
          <input type="hidden" name="add_category_nonce" value="<?php echo $add_meta_nonce ?>" />
        </tbody></table>
        <?php submit_button(); ?>
      </form>
    </div>
  <?php
  }
}


function category_update_response() {
	if( isset( $_POST['add_category_nonce'] ) && wp_verify_nonce( $_POST['add_category_nonce'], 'add_category_nonce') ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'category_translations';
        foreach($_POST['categories'] as $key => $cat){
          $key = str_replace('_', ' ', $key);
          $translation = sanitize_text_field($_POST['categories'][$key]['translation']);
          $translation = str_replace('\\', '', $translation);
          $icon = sanitize_text_field($_POST['categories'][$key]['icon']);

          $sql = $wpdb->prepare(
              "UPDATE `$table_name`
              SET `en` = '%s', `icon` = '%s'
              WHERE `sv` = '%s'", array(htmlspecialchars_decode($translation), htmlspecialchars_decode($icon), htmlspecialchars_decode($key)));
          $wpdb->query($sql);
          }
        return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-category-translations&updated'));
		exit;
	} else {
		wp_die( __( 'Invalid nonce specified', $plugin ), __( 'Error', $plugin ), array(
					'response' 	=> 403,
					'back_link' => 'admin.php?page=' . $plugin,
			) );
	}
}
add_action( 'admin_post_nopriv_category_update', 'category_update_response' );
add_action( 'admin_post_category_update', 'category_update_response' );
?>