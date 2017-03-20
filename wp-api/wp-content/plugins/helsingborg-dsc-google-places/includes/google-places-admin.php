<?php
/*******************************
* admin interface
*******************************/

add_action('admin_menu', helsingborg_dsc_google_places_admin_menu);

function helsingborg_dsc_google_places_admin_menu() {
    add_menu_page( $helsingborg_dsc_google_place, 'Google places', 'manage_options', 'helsingborg-dsc-google-places', helsingborg_dsc_google_places_admin_init );
}

function helsingborg_dsc_google_places_admin_init() {
?>
    <style>
        .form-table select {
            width: 25em;
        }
    </style>
    <div class="wrap"><h2>Lägg till plats</h2></div>
    <form action="admin-post.php" method="post" onkeypress="return event.keyCode !== 13;">
        <input type="hidden" name="action" value="save_google_places">
        <table class="form-table"><tbody>
            <tr>
                <th>
                    Välj plats
                </th>
                <td>
                    <input type="text" name="google-places-place" id="google-places-place" class="regular-text" placeholder="Sök plats" />
                    <input type="hidden" id="google-places-id" name="google-places-id">
                </td>
            </tr>
            <tr>
                <th>
                    Välj kategori(er)
                </th>
                <td>
                    <select id="google-places-category" multiple name="google-places-categories[]">
                    <?php foreach(get_categories() as $category) {
                        echo '<option value="' . $category->cat_ID . '">' . $category->name . '</option>';
                    } ?>
                    </select>
                </td>
            </tr>
        </tbody></table>
        <button class="button button-primary" type="submit">Spara plats</button>
    </form>
    <div class="wrap"><h2>Tillagda platser</h2></div>
    <?php
        $saved_google_places = get_option('saved_google_places', []);
        if(count($saved_google_places)) {
            ?>
                <form action="<?php get_site_url() ?>admin-post.php" method="post" onkeypress="return event.keyCode != 13;">
                <input type="hidden" name="action" value="delete_google_places">
                <button class="button button-small" type="submit">Ta bort markerade platser</button>
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
                    <td><?php foreach ($saved_google_place['google_place_categories'] as $cat_id) { echo get_the_category_by_ID($cat_id) . ", "; }; ?></td>
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
