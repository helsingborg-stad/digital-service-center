<?php
/************************************
* admin interface display functions
*************************************/

function import_update_and_delete_outdated_events_form() {
?>
    <!--<h2>Importera uppdatera och redera gamla utdaterade event<h2>
    <form action="<?php get_site_url() ?>admin-post.php" method="post">
        <input type="hidden" name="action" value="create_update_and_delete_outdated_events">
        <p>Ange antal att importera (10 om inget anges)</p>
        <input type="number" name="number_of_events">
        <br><br>
        <input type="submit" value="Submit">
    </form>-->
<?php
}

function import_and_update_events_form() {
?> 

<h2>Importera och uppdatera event<h2>
<form action="<?php get_site_url() ?>admin-post.php" method="post">
    <input type="hidden" name="action" value="create_events">
    <p>Ange antal att importera (10 om inget anges)</p>
    <input type="number" name="number_of_events">
    <br><br>
    <input type="submit" value="Submit">
</form>

<?php
}

function delete_outdated_events_form() {
?>

<h2>Radera utdaterade events<h2>
<form action="<?php get_site_url() ?>admin-post.php" method="post">
    <input type="hidden" name="action" value="delete_outdated_events">
    <input type="submit" value="Submit">
</form>

<?php
}
?>