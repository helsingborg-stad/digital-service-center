<?php

add_action('admin_menu', helsingborg_dsc_crm_import_admin_menu);

function helsingborg_dsc_crm_import_admin_menu() {
  add_menu_page( 'CRM import', 'CRM import', 'manage_options', 'helsingborg-dsc-crm-import', helsingborg_dsc_crm_import_menu_callback );
}

add_action('admin_init', function() {
    register_setting('hdsc-crm-import', 'hdsc-crm-import-service-url');
    register_setting('hdsc-crm-import', 'hdsc-crm-import-scheduled-timestamp');
    register_setting('hdsc-crm-import', 'hdsc-crm-import-scheduled-recurrence');
    register_setting('hdsc-crm-import', 'hdsc-crm-import-schedule-activated');
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
            // phpinfo();
                settings_fields('hdsc-crm-import');
                do_settings_sections('hdsc-crm-import');
            ?>

            <h1>CRM import</h1>

            <?php if (isset($_GET['settings-updated'])) { ?>
                <div id="message" class="updated">
                    <p><string><?php _e('Settings saved.') ?></string></p>
                </div>
            <?php } ?>
            <?php if (isset($_GET['updated'])) { ?>
                <div id="message" class="updated">
                    <p><string><?php _e('Import utförd.') ?></string></p>
                </div>
            <?php } ?>
            <?php if (isset($_GET['deleted'])) { ?>
                <div id="message" class="updated">
                    <p><string><?php _e('Tidigare import har rensats.') ?></string></p>
                </div>
            <?php } ?>

            <h2>Inställningar</h2>
            <table class="form-table"><tbody>
                <tr>
                    <th><label for="crmimportform-service-url">CRM service url</label></th>
                    <td><input id="crmimportform-service-url" type="text" class="regular-text" name="hdsc-crm-import-service-url" value="<?php echo get_option('hdsc-crm-import-service-url'); ?>" /></td>
                </tr>
            </tbody></table>

            <div><h2>Schemalägg hämtning</h2></div>
            <table class="form-table"><tbody>
                <tr>
                    <th><label for="crmimportform-scheduled-timestamp">Tidpunkt för första körning</label></th>
                    <td><input id="crmimportform-scheduled-timestamp" class="regular-text" type="datetime-local" name="hdsc-crm-import-scheduled-timestamp" value="<?php echo get_option('hdsc-crm-import-scheduled-timestamp'); ?>" required/></td>
                </tr>
                <tr>
                    <th><label for="crmimportform-scheduled-recurrence">Hur ofta</label></th>
                    <td>
                        <input id="crmimportform-scheduled-recurrence" type="radio" name="hdsc-crm-import-scheduled-recurrence" value="hourly" <?php checked('hourly', get_option('hdsc-crm-import-scheduled-recurrence')); ?> />
                        En gång/timme
                        <br>
                        <input id="crmimportform-scheduled-recurrence" type="radio" name="hdsc-crm-import-scheduled-recurrence" value="twicedaily" <?php checked('twicedaily', get_option('hdsc-crm-import-scheduled-recurrence')); ?> />
                        Två gånger/dygn
                        <br>
                        <input id="crmimportform-scheduled-recurrence" type="radio" name="hdsc-crm-import-scheduled-recurrence" value="daily" <?php checked('daily', get_option('hdsc-crm-import-scheduled-recurrence')); ?> />
                        En gång/dygn
                    </td>
                </tr>
                <tr>
                    <th><label for="crmimportform-schedule-activated">Aktivera schemalagd hämtning</label></th>
                    <td><input id="crmimportform-schedule-activated" type="checkbox" name="hdsc-crm-import-schedule-activated" value="schedule-activated" <?php checked('schedule-activated', get_option('hdsc-crm-import-schedule-activated')); ?> /></td>
                </tr>
            </tbody></table>

            <?php submit_button(); ?>
        </form>
        <div class="wrap"><h2>Importera/rensa</h2></div>
        <form action="<?php get_site_url() ?>admin-post.php" method="post">
            <p>Importera från CRM</p>
            <input type="hidden" name="action" value="manually_import_crm">
            <button class="button button-primary" type="submit">Importera</button>
        </form>
        <form action="<?php get_site_url() ?>admin-post.php" method="post">
            <input type="hidden" name="action" value="manually_clear_import">
            <p>Rensa tidigare import</p>
            <button class="button button-primary" type="submit">Rensa</button>
        </form>
    </div>
<?php
}
?>