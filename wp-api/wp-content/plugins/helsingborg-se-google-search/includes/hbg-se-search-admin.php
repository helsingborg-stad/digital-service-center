<?php
/*******************************
* admin interface
*******************************/

add_action('admin_menu', helsingborg_se_google_search_admin);

function helsingborg_se_google_search_admin(){
    add_menu_page( 'Helsingborg.se Google search', 'Helsingborg.se Google search', 'manage_options', 'helsingborg-se-google-search', 'helsingborg_se_google_search_admin_init' );
}

add_action('admin_init', function() {
  register_setting( 'hdsc-google-search-settings', 'hdsc-site-setting-google-cx-id' );
  register_setting( 'hdsc-google-search-settings', 'hdsc-site-setting-google-api-key' );
});

function helsingborg_se_google_search_admin_init(){
?>
    <div class="wrap">
        <form action="options.php" method="post">
        <?php
        settings_fields( 'hdsc-google-search-settings' );
        do_settings_sections( 'hdsc-google-search-settings' );
        ?>

        <div class="wrap"><h2>Google search settings</h2></div>

            <?php if (isset($_GET['settings-updated'])) { ?>
            <div id="message" class="updated">
                <p><strong><?php _e('Settings saved.') ?></strong></p>
            </div>
            <?php } ?>
        <table class="form-table"><tbody>
            <tr>
                <th><label for="google-search-form-cx-id">Google cx ID</label></th>
                <td><input id="google-search-form-cx-id" type="text" class="regular-text" name="hdsc-site-setting-google-cx-id" value="<?php echo get_option('hdsc-site-setting-google-cx-id'); ?>" /></td>
            </tr>
            <tr>
                <th><label for="google-search-form-api-key">Google API Key</label></th>
                <td><input id="google-search-form-api-key" type="text" class="regular-text" name="hdsc-site-setting-google-api-key" value="<?php echo get_option('hdsc-site-setting-google-api-key'); ?>" /></td>
            </tr>
        </tbody></table>
        <?php submit_button(); ?>
    </form>
<?php
}
?>
