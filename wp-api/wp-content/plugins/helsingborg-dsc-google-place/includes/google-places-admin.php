<?php
/*******************************
* admin interface
*******************************/

add_action('admin_menu', 'helsingborg_dsc_google_places_admin_menu');
 
function helsingborg_dsc_google_places_admin_menu(){
        add_menu_page( $helsingborg_dsc_google_place, 'Google places', 'manage_options', 'helsingborg-dsc-google-places', 'helsingborg_dsc_google_places_admin_init' );
}
 
function helsingborg_dsc_google_places_admin_init(){
?>
    <hr>
    <h2>Lägg till plats</h2>
    <form action="<?php get_site_url() ?>admin-post.php" method="post" onkeypress="return event.keyCode != 13;">
        <input type="hidden" name="action" value="save_google_places">
        <p>Välj plats</p>
        <input type="text" name="google-places-place" id="google-places-place" style="width: 250px" placeholder="Sök plats" />
        <input type="hidden" id="google-places-id" name="google-places-id">
        <p>Lägg till kategori</p>
        <?php wp_dropdown_categories([id => 'google-places-category', name => 'google-place-category', selected => get_option('google-place-category', 0)]); ?>
        <br>
        <input type="submit" value="Spara plats">
    </form>
    <h2>Tillagda platser</h2>
    <?php 
        $saved_google_places = get_option('saved_google_places');
        if($saved_google_places != null && is_array($saved_google_places)) {
            ?>
                <form action="<?php get_site_url() ?>admin-post.php" method="post" onkeypress="return event.keyCode != 13;">
                <input type="hidden" name="action" value="delete_google_places">
                <input type="submit" value="Ta bort markerade platser">
                <table id="domainTable">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" name="selectAll" id="selectAllDomainList" />
                            </th>
                            <td>
                                <strong>Plats</strong>
                            </td>
                        </tr> 
                    </thead>
                    <tbody>
            <?php
            foreach($saved_google_places as $saved_google_place) {
            ?> 
                <tr>
                    <td> <input type="checkbox" name="saved_google_places_checkbox[]" value="<?php echo $saved_google_place['google_place_id']; ?>" /> </td>  
                    <td> <?php echo $saved_google_place['google_place_name']; ?> </td> 
                </tr>
            <?php
            }
            ?> 
                </tbody>
                </table>
                <script>
                    jQuery(function($) {
                        $('#selectAllDomainList').click(function() {
                            var checkedStatus = this.checked;
                            $('#domainTable tbody tr').find('td:first :checkbox').each(function() {
                                $(this).prop('checked', checkedStatus);
                            });
                        });
                    });
                </script> 
            <?php
        }
    ?>
<?php
}
?>
