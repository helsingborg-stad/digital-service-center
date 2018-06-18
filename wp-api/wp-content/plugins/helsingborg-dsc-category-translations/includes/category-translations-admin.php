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
      </tr> 
      </thead>
      <tbody>
      <?php
        foreach(get_categorys() as $category) {
          $cat_sv = $category['sv'];
          $cat_en = $category['en'];
          ?>
        <tr>
        <td><input id="<? echo $cat_sv; ?>" type="text" class="regular-text" name="no_inc" value="<? echo $cat_sv; ?>" readonly/></td>
        <td><input id="<? echo $cat_en; ?>" type="text" class="regular-text" name="<? echo $cat_sv; ?>" value="<? echo $cat_en; ?>" /></td>
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
<?
}
}
function category_update_response() {
	if( isset( $_POST['add_category_nonce'] ) && wp_verify_nonce( $_POST['add_category_nonce'], 'add_category_nonce') ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'category_translations';
        foreach ($_POST as $key => $category) {
            if($key != 'no_inc' && $key != 'action' && $key != 'add_category_nonce' && $key != 'submit'){
                $category = sanitize_text_field($category);
                $category = str_replace('\\', '', $category);
                $key = str_replace('_', ' ', $key);
                $table_name = $wpdb->prefix . 'category_translations';
                $sql = $wpdb->prepare(
                    "UPDATE `$table_name`
                    SET `en` = '%s'
                    WHERE `sv` = '%s'", array(htmlspecialchars_decode($category), htmlspecialchars_decode($key)));
                $wpdb->query($sql);
            }
        }
        return wp_redirect(admin_url('admin.php?page=helsingborg-dsc-category-translations&updated'));
		exit;
	}			
	else {
		wp_die( __( 'Invalid nonce specified', $plugin ), __( 'Error', $plugin ), array(
					'response' 	=> 403,
					'back_link' => 'admin.php?page=' . $plugin,
			) );
	}
}
add_action( 'admin_post_nopriv_category_update', 'category_update_response' );
add_action( 'admin_post_category_update', 'category_update_response' );

