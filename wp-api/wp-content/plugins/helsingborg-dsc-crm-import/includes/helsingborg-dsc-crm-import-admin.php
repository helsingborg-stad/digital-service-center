<?php
add_action('admin_menu', helsingborg_dsc_crm_import_admin_menu);

function helsingborg_dsc_crm_import_admin_menu() {
  add_menu_page( 'CRM import', 'CRM import', 'manage_options', 'helsingborg-dsc-crm-import', helsingborg_dsc_crm_import_menu_callback );
}

add_action('admin_init', function() {
    register_setting('hdsc-crm-import', 'hdsc-crm-import-service-url');
});

function helsingborg_dsc_crm_import_menu_callback() {
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
                settings_fields('hdsc-crm-import');
                do_settings_sections('hdsc-crm-import');
            ?>

            <div class="wrap"><h2>CRM import</h2></div>

            <?php if (isset($_GET['settings-updated'])) { ?>
                <div id="message" class="updated">
                    <p><string><?php _e('Settings saved.') ?></string></p>
                </div>
            <?php } ?>

            <table class="form-table"><tbody>
                <tr>
                    <th><label for="crmimportform-service-url">CRM service url</label></th>
                    <td><input id="crmimportform-service-url" type="text" class="regular-text" name="hdsc-crm-import-service-url" value="<?php echo get_option('hdsc-crm-import-service-url'); ?>" /></td>
                </tr>
            </tbody></table>
            <?php submit_button(); ?>
        </form>
    </div>
<?php    
}
?>