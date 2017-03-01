<?php
/************************************
* admin interface display functions
*************************************/

function import_and_update_events_form() {

?> 

<form action="<?php get_site_url() ?>admin-post.php" method="post">
    <input type="hidden" name="action" value="create_events">
    <p>Importera och uppdatera event</p>
    <input type="number" name="number_of_events">
    <input type="submit" value="Submit">
</form>

<?php
}
?>