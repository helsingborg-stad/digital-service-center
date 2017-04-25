<?php

add_action('admin_menu', 'helsingborg_dsc_event_landingpages_categories');

function helsingborg_dsc_event_landingpages_categories() {
    add_submenu_page( 'landing-pages', 'landing-pages-categories', 'Categories', 'manage_options', 'landing-pages-categories', 'landingpages_categories' );
}

add_action('admin_init', function() {
    register_setting( 'hdsc-landing-settings', 'hdsc-landing-visitor-main-categories');
    register_setting( 'hdsc-landing-settings', 'hdsc-landing-visitor-sub-categories');
    register_setting( 'hdsc-landing-settings', 'hdsc-landing-local-main-categories');
    register_setting( 'hdsc-landing-settings', 'hdsc-landing-local-sub-categories');
});

function landingpages_categories() {
    $all_categories_args = [
        'taxonomy' => [
            'imported_category',
            'category'
        ],
        'hide_empty' => 0
    ];
?>
    <h1>Kategorisering för menyval på landningssidor</h1>
    <h2>Visitor</h2>
    <h3>Huvudkategorier</h3>
    <form action="admin-post.php" method="post" onkeypress="return event.keyCode !== 13;">
        <input type="hidden" name="action" value="save_visitor_main_category">
        <table class="form-table">
            <tbody>
                <tr>
                    <th>
                        Välj kategori
                    </th>
                    <td>
                        <?php wp_dropdown_categories( $all_categories_args ) ?>
                    </td>
                </tr>
            </tbody>
        </table>
        <button class="button button-primary" type="submit">Spara kategori</button>
    </form>

    <h3>Underkategorier</h3>
    <form action="admin-post.php" method="post" onkeypress="return event.keyCode !== 13;">
        <input type="hidden" name="action" value="save_visitor_sub_category">
        <table class="form-table">
            <tbody>
                <tr>
                    <th>
                        Välj huvudkategori
                    </th>
                    <td>
                        <select>
                            <?php
                                $saved_visitor_main_categories = get_option('hdsc-landing-visitor-main-categories');
                                $category_name = get_term( $saved_google_place_type['event_category_id'])->name; 
                                if(count($saved_visitor_main_categories)) {       
                                    foreach($saved_visitor_main_categories as $saved_visitor_category) {
                                        $saved_visitor_category_name = get_term($saved_visitor_category)->name;
                                        echo '<option>' . $saved_visitor_category_name . '</option>';
                                    }
                                }
                            ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>
                        Välj underkategorier
                    </th>
                    <td>
                        <select>
                            <?php
                                $saved_visitor_main_categories = get_option('hdsc-landing-visitor-main-categories');
                                $category_name = get_term( $saved_google_place_type['event_category_id'])->name; 
                                if(count($saved_visitor_main_categories)) {       
                                    foreach($saved_visitor_main_categories as $saved_visitor_category) {
                                        $saved_visitor_category_name = get_term($saved_visitor_category)->name;
                                        echo '<option>' . $saved_visitor_category_name . '</option>';
                                    }
                                }
                            ?>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
        <input class="button button-primary" type="submit" name="update_button" value="Update" />
        <input class="button button-secondary" type="submit" name="delete_button" value="Delete" />       
    </form>

    <h2>Local</h2>
    <h3>Huvudkategorier</h3>
    <form action="admin-post.php" method="post" onkeypress="return event.keyCode !== 13;">
        <input type="hidden" name="action" value="save_local_main_category">
        <table class="form-table">
            <tbody>
                <tr>
                    <th>
                        Välj kategori
                    </th>
                    <td>
                        <?php wp_dropdown_categories( $all_categories_args ) ?>
                    </td>
                </tr>
            </tbody>
        </table>
        <button class="button button-primary" type="submit">Koppla kategorier</button>
    </form>

    
    <h3>Underkategorier</h3>
    <form action="admin-post.php" method="post" onkeypress="return event.keyCode !== 13;">
        <input type="hidden" name="action" value="save_local_sub_categories">
        <table class="form-table">
            <tbody>
                <tr>
                    <th>
                        Välj kategori
                    </th>
                    <td>
                        <select>
                            <?php
                                $saved_local_main_categories = get_option('hdsc-landing-local-main-categories'); 
                                if(is_array($saved_local_main_categories)) {                                      
                                    foreach($saved_local_main_categories as $saved_local_category) {
                                        $saved_local_category_name = get_term($saved_local_category)->name;    
                                        echo '<option>' . $saved_local_category_name . '</option>';
                                    }
                                }
                            ?>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
        <button class="button button-primary" type="submit">Koppla kategorier</button>
    </form>
<?php
}
?>