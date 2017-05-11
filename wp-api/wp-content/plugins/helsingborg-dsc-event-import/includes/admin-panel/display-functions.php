<?php
/************************************
* admin interface display functions
*************************************/

function import_and_update_events_form() {
?>

<h1>Event hantering</h1>
<h2>Importera event</h2>
<p class="description">Hämtar samtliga aktiva event och synkar det med importerade event</p>
<form action="<?php get_site_url() ?>admin-post.php" method="post">
    <input type="hidden" name="action" value="manually_create_and_update_events">
    <input type="submit" value="Importera">
</form>

<?php
}

function import_update_and_delete_outdated_events_form() {
?>
    <hr>
    <h2>Schemalägg hämtning och rensning<h2>
    <form action="options.php" method="post">
        <?php settings_fields( 'scheduled-event-import-settings-group' ); ?>
        <?php do_settings_sections( 'scheduled-event-import-settings-group' ); ?>
        <p>Tidpunkt för första körning</p>
        <input type="datetime-local" name="scheduled_timestamp" value="<?php echo get_option('scheduled_timestamp'); ?>" required/>
        <?php $scheduled_recurrence = get_option( 'scheduled_recurrence' ); ?>
        <p>Hur ofta</p>
        <input type="radio" value="hourly" name="scheduled_recurrence" <?php checked( 'hourly', get_option( 'scheduled_recurrence' ) ); ?> />
        <p style="display: inline">En gång/h</p>
        <input type="radio" value="twicedaily" name="scheduled_recurrence" <?php checked( 'twicedaily', get_option( 'scheduled_recurrence' ) ); ?> />
        <p style="display: inline">Två ggr/dag</p>
        <input type="radio" value="daily" name="scheduled_recurrence" <?php checked( 'daily', get_option( 'scheduled_recurrence' ) ); ?> />
        <p style="display: inline">En gång/dygn</p>
        <p>Aktivera schemalagd hämtning</p>
        <input type="checkbox" name="schedule_activated" value="1" <?php checked( '1', get_option( 'schedule_activated' ) ); ?> />
        <?php submit_button(); ?>
    </form>
<?php
}
?>