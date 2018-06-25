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
?>