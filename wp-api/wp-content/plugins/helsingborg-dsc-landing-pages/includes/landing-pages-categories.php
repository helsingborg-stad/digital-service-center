<?php

add_action('admin_menu', 'helsingborg_dsc_event_landingpages_categories');

function helsingborg_dsc_event_landingpages_categories() {
    add_submenu_page( 'landing-pages', 'landing-pages-categories', 'Categories', 'manage_options', 'landing-pages-categories', 'landingpages_categories' );
}

add_action('admin_init', function() {
    register_setting( 'hdsc-landing-settings', 'hdsc-landing-visitor-categories');
    register_setting( 'hdsc-landing-settings', 'hdsc-landing-local-categories');
});

function landingpages_categories() {
    $all_categories_args = [
        'taxonomy' => [
            'imported_category',
            'category'
        ],
        'orderby' => 'title',
        'hide_empty' => 0
    ];
?>
    <h1>Kategorisering för menyval på landningssidor</h1>
    <h2>Visitor</h2>
    <h3>Lägg till huvudkategori</h3>
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
    <h3>Lägg till underkategorier</h3>
    <form action="admin-post.php" method="post" onkeypress="return event.keyCode !== 13;">
        <input type="hidden" name="action" value="update_or_delete_visit_categories">
        <table class="form-table">
            <tbody>
                <tr>
                    <th>
                        Sparade huvudkategorier
                    </th>
                    <td>
                        <select name="saved_main_visit_categories" id="saved_main_visit_categories">
                            <?php
                                $saved_visitor_main_categories = get_option('hdsc-landing-visitor-categories');
                                $first_visitor_category; 
                                if(is_array($saved_visitor_main_categories)) {
                                    $first_visitor_category = reset($saved_visitor_main_categories);
                                    foreach($saved_visitor_main_categories as $saved_visitor_category) {
                                        $saved_visitor_category_name = get_term($saved_visitor_category['main_category'])->name;
                                        echo '<option value="' . $saved_visitor_category['main_category'] .'">' . $saved_visitor_category_name . '</option>';
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
                    <td id="landing_visit_sub_categories">
                        <div>
                            <?php
                                if($first_visitor_category['main_category'] != null) {
                                    $args = [
                                        'child_of' => $first_visitor_category['main_category'],
                                        'hide_empty' => 0
                                    ];
                                    $sub_categories = get_categories($args);
                                    if(is_array($sub_categories)) {
                                        foreach($sub_categories as $sub_category) {
                                            $checked = "";
                                            if(in_array($sub_category->cat_ID, $first_visitor_category['sub_categories'])) {
                                                $checked = 'checked';
                                            }
                                            echo $sub_category->cat_name . '<input name="sub_categories[]" style="margin: 0 10px;" type="checkbox"
                                            value="' . $sub_category->cat_ID . '"' . $checked . '/>';
                                        }
                                    }
                                }
                            ?>                        
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <button class="button button-primary" name="visit_categories_form_option" value="Update" type="submit">Updatera</button>
        <button class="button button-primary" name="visit_categories_form_option" value="Delete" type="submit">Ta bort</button>      
    </form>
    <br>
    <hr>
    <h2>Local</h2>
    <h3>Lägg till huvudkategori</h3>
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
    <h3>Lägg till underkategorier</h3>
    <form action="admin-post.php" method="post" onkeypress="return event.keyCode !== 13;">
        <input type="hidden" name="action" value="update_or_delete_local_categories">
        <table class="form-table">
            <tbody>
                <tr>
                    <th>
                        Sparade huvudkategorier
                    </th>
                    <td>
                        <select name="saved_main_local_categories" id="saved_main_local_categories">
                            <?php
                                $saved_local_main_categories = get_option('hdsc-landing-local-categories');
                                $first_local_category; 
                                if(is_array($saved_local_main_categories)) {
                                    $first_local_category = reset($saved_local_main_categories);
                                    foreach($saved_local_main_categories as $saved_local_category) {
                                        $saved_local_category_name = get_term($saved_local_category['main_category'])->name;    
                                        echo '<option value="' . $saved_local_category['main_category'] .'">' . $saved_local_category_name . '</option>';
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
                    <td id="landing_local_sub_categories">
                        <div>
                            <?php
                                if($first_local_category['main_category'] != null) {
                                    $args = [
                                        'child_of' => $first_local_category['main_category'],
                                        'hide_empty' => 0
                                    ];
                                    $sub_categories = get_categories($args);
                                    if(is_array($sub_categories)) {
                                        foreach($sub_categories as $sub_category) {
                                            $checked = "";
                                            if(in_array($sub_category->cat_ID, $first_local_category['sub_categories'])) {
                                                $checked = 'checked';
                                            }
                                            echo $sub_category->cat_name . '<input name="sub_categories[]" style="margin: 0 10px;" type="checkbox"
                                            value="' . $sub_category->cat_ID . '"' . $checked . '/>';
                                        }
                                    }
                                }
                            ?>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <button class="button button-primary" name="local_categories_form_option" value="Update" type="submit">Updatera</button>
        <button class="button button-primary" name="local_categories_form_option" value="Delete" type="submit">Ta bort</button>
    </form>
<?php
}
?>