<?php
/*******************************
* display functions
*******************************/

function google_places_settings(){
?>
<form action="options.php" method="post">
    <?php
    settings_fields( 'hdsc-google-places-settings' );
    do_settings_sections( 'hdsc-google-places-settings' );
    ?>
    <table class="form-table">
        <tbody>
            <tr>
                <th>
                    Latitude (default: 56.049665)
                </th>
                <td>
                    <input type="text" name="hdsc-google-places-settings-lat" id="hdsc-google-places-settings-lat" class="regular-text" value="<?php echo get_option('hdsc-google-places-settings-lat'); ?>" />
                </td>
            </tr>
            <tr>
                <th>
                    Longitutde (defualt: 12.727122)
                </th>
                <td>
                    <input type="text" name="hdsc-google-places-settings-long" id="hdsc-google-places-settings-long" class="regular-text" value="<?php echo get_option('hdsc-google-places-settings-long'); ?>" />
                </td>
            </tr>
            <tr>
                <th>
                    Radius (default: 2000)
                </th>
                <td>
                    <input type="text" name="hdsc-google-places-settings-radius" id="hdsc-google-places-settings-radius" class="regular-text" value="<?php echo get_option('hdsc-google-places-settings-radius'); ?>" />
                </td>
            </tr>
        </tbody>
    </table>
     <?php submit_button(); ?>
</form>
<?php
}

function map_google_place_type_form(){
?>
<h2>Koppla kategori mot platstyp från Google</h2>
<?php
$all_categories_args = [
    'taxonomy' => [
        'imported_category',
        'category'
    ],
    'hide_empty' => 0
];
$all_google_place_types = all_google_place_types();
?>
<form action="admin-post.php" method="post" onkeypress="return event.keyCode !== 13;">
    <input type="hidden" name="action" value="map_google_places_category">
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
            <tr>
                <th>
                    Välj platstyp från Google
                </th>
                <td>
                    <select name="google-place-type" class="postform">
                        <?php foreach($all_google_place_types as $google_place_type) {
                        ?>
                            <option value="<?php echo $google_place_type ?>"><?php echo $google_place_type ?></option>
                        <?php
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

function list_google_place_types_form(){
    $saved_google_place_types = get_option('saved_google_place_types');
    $querystr = 'types_page';
    $paging_values = get_paging_values(count($saved_google_place_types), $querystr);
    if($_REQUEST[$querystr] != null) {
        $paging_offset = ($_REQUEST[$querystr] - 1) * 10;
        $saved_google_place_types = array_slice($saved_google_place_types, $paging_offset, 10);
    }
?>
    <p><strong>Kopplade kategorier</strong></p>
    <form action="admin-post.php" method="post" onkeypress="return event.keyCode !== 13;">
        <input type="hidden" name="action" value="delete_google_place_types">
        <div class="tablenav top">
            <button class="button button-small" type="submit">Ta bort markerade</button>
        </div>
        <table id="allGooglePlaceTypes" class="wp-list-table widefat fixed striped" style="width: 715px;">
            <thead>
                <tr>
                    <td width="24">
                        <input type="checkbox" name="selectAll" id="selectAllGooglePlaceTypes" />
                    </td>
                    <th>
                        <strong>Kategori</strong>
                    </td>
                    <th>
                        <strong>Platstyper från Google</strong>
                    </td>
                </tr>
            </thead>
            <tbody>
            <?php
            if(count($saved_google_place_types)) {
                foreach($saved_google_place_types as $saved_google_place_type) {
                    $category_name = get_term( $saved_google_place_type['event_category_id'])->name;
                    echo '<tr>';
                    echo '<th> <input type="checkbox" name="saved_google_place_types_checkbox[]" value="' . $saved_google_place_type['event_category_id'] . $saved_google_place_type['google_place_type'] . '" /> </th>';
                    echo '<td>' . $category_name . '</td>';
                    echo '<td>' . $saved_google_place_type['google_place_type'] . '</td>';
                    echo '</tr>';
                }
            }
            ?>
            </tbody>
        </table>
    </form>
    <?php
    google_places_list_paging($paging_values, 'Kategorier');
}

function fetch_google_places() {
    ?>
    <h2>Hämta platsinformation från Google</h2>
    <form action="<?php get_site_url() ?>admin-post.php" method="post">
        <input type="hidden" name="action" value="fetch_google_places_based_on_selected_place_types">
        <br>
        <button class="button button-primary" type="submit">Importera</button>
    </form>
    <br>
    <table class="wp-list-table widefat fixed striped" style="width: 715px;">
        <thead>
            <tr>
                <td width="24">
                    <input type="checkbox" name="selectAll" id="selectAllGooglePlaceTypes" />
                </td>
                <th>
                    <strong>Namn</strong>
                </td>
                <th>
                    <strong>Place ID</strong>
                </td>
            </tr>
        </thead>
        <tbody>
        <?php
        foreach(get_option('saved_google_places_details', []) as $place_details) {
        ?>
            <tr>
                <th><input type="checkbox" name="saved_google_place_types_checkbox[]" value="<?php echo $saved_google_place_type['event_category_id']; ?>" /></th>
                <td><a href="<?php echo $place_details['sv']['data']['result']['url']; ?>" target="_blank"><?php echo $place_details['sv']['data']['result']['name']; ?></a></td>
                <td><?php echo $place_details['sv']['data']['result']['place_id']; ?></td>
            </tr>
        <?php
        }
        ?>
        </tbody>
    </table>
    <div class="tablenav">
        <div class="tablenav-pages" style="float: none;">
            <span class="displaying-num"><?php echo count(get_option('saved_google_places_details', [])) ?> platser</span>
        </div>
    </div>
    <?php
}

function exclude_google_place_form() {
?>
    <h2>Exkludera plats från Google</h2>
    <form action="admin-post.php" method="post" onkeypress="return event.keyCode !== 13;">
        <input type="hidden" name="action" value="exclude_google_places">
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
        </tbody></table>
        <button class="button button-primary" type="submit">Lägg till</button>
    </form>
<?php
}

function list_excluded_google_places_form() {
    $excluded_google_places = get_option('excluded_google_places', []);
    $querystr = 'excluded_page';
    $paging_values = get_paging_values(count($excluded_google_places), $querystr);
    if($_REQUEST[$querystr] != null) {
        $paging_offset = ($_REQUEST[$querystr] - 1) * 10;
        $excluded_google_places = array_slice($excluded_google_places, $paging_offset, 10);
    }
    ?>
    <p><strong>Exkluderade platser</strong></p>
    <form action="<?php get_site_url() ?>admin-post.php" method="post" onkeypress="return event.keyCode != 13;">
        <input type="hidden" name="action" value="delete_excluded_google_places">
        <div class="tablenav top">
            <button class="button button-small" type="submit">Ta bort markerade</button>
        </div>
        <table id="domainTable" class="wp-list-table widefat fixed striped" style="width: 715px;">
            <thead>
                <tr>
                    <td width="24">
                        <input type="checkbox" name="selectAll" id="selectAllDomainList" />
                    </td>
                    <th>
                        <strong>Plats</strong>
                    </th>
                </tr>
            </thead>
            <tbody>
                <?php
                if(count($excluded_google_places)) {
                    foreach($excluded_google_places as $excluded_google_place) {
                        echo '<tr>';
                        echo '<th> <input type="checkbox" name="excluded_google_places_checkbox[]" value="' . $excluded_google_place['google_place_id'] . '" /> </th>';
                        echo '<td>' . $excluded_google_place['google_place_name'] . '</td>';
                        echo '</tr>';
                    }
                }
                ?>
            </tbody>
        </table>
    </form>
<?php
    google_places_list_paging($paging_values, 'Platser');
}

function get_paging_values($number_of_items, $querystr){
    $get_total_pages = $number_of_items / 10;
    $total_pages = ceil($get_total_pages);
    $next_page = false;
    $prev_page = false;
    $first_page = false;
    $last_page = false;
    $additional_query_strings;
    $query_string_format = '&' . $querystr . '=';
    $query_strings = [
        'types_page',
        'excluded_page'
    ];

    foreach($query_strings as $query_string) {
        if($query_string != $querystr && $_REQUEST[$query_string] != null) {
            $additional_query_strings = $additional_query_strings . '&' . $query_string . '=' . $_REQUEST[$query_string];
        }
    }

    if($_REQUEST[$querystr] != null) {
        $current_page = $_REQUEST[$querystr];
        if($current_page != $total_pages && $current_page < $total_pages - 1) {
            $last_page = $query_string_format . $total_pages;
        }
        if($current_page > 2) {
            $first_page = $query_string_format . 1;
        }
        if($current_page > 1 && $current_page <= $total_pages){
            $prev_page = $query_string_format . ($current_page - 1);
        }
        if($current_page < $total_pages) {
            $next_page = $query_string_format . ($current_page + 1);
        }
    }
    else {
        if($total_pages >= 2) {
            $next_page = $query_string_format . 2;

        }
        if($total_pages > 2) {
            $last_page = $query_string_format . $total_pages;
        }
    }

    $paging_values = [
        'number_of_pages' => $total_pages,
        'number_of_items' => $number_of_items,
        'prev_page' => $prev_page,
        'next_page' => $next_page,
        'first_page' => $first_page,
        'last_page' => $last_page,
        'additional_query_strings' => $additional_query_strings
    ];

    return $paging_values;
}

function google_places_list_paging($paging_values, $label) {
?>
    <div class="tablenav">
        <div class="tablenav-pages" style="float: none;">
            <span class="displaying-num"><?php echo $paging_values['number_of_items'] . ' ' . $label; ?></span>
            <span class="pagination-links">
            <?php
                if($paging_values['first_page'] != false) {
                    echo '<a class="first-page" href="' . admin_url('admin.php?page=helsingborg-dsc-google-places') . $paging_values['first_page'] . $paging_values['additional_query_strings'] . '">
                            <span class="screen-reader-text">Första sidan</span>
                            <span aria-hidden="true">«</span>
                            </a>';
                } else {
                    echo '<span class="tablenav-pages-navspan" aria-hidden="true">«</span>';
                }
                if($paging_values['prev_page'] != false) {
                    echo '<a class="prev-page" href="' . admin_url('admin.php?page=helsingborg-dsc-google-places') . $paging_values['prev_page'] . $paging_values['additional_query_strings'] . '">
                            <span class="screen-reader-text">Föregående sida</span>
                            <span aria-hidden="true">‹</span>
                          </a>';
                } else {
                    echo '<span class="tablenav-pages-navspan" aria-hidden="true">‹</span>';
                }
                ?>
                <span class="screen-reader-text">Nuvarande sida</span>
                <span id="table-paging" class="paging-input">
                    <span class="tablenav-paging-text">
                        1 av <span class="total-pages"><?php echo $paging_values['number_of_pages']; ?></span>
                    </span>
                </span>
            <?php
                if($paging_values['next_page'] != false) {
                    echo '<a class="next-page" href="' . admin_url('admin.php?page=helsingborg-dsc-google-places') . $paging_values['next_page'] . $paging_values['additional_query_strings'] . '">
                            <span class="screen-reader-text">Nästa sida</span>
                            <span aria-hidden="true">›</span>
                          </a>';
                }
                else {
                    echo '<span class="tablenav-pages-navspan" aria-hidden="true">›</span>';
                }
                if($paging_values['last_page'] != false) {
                    echo '<a class="last-page" href="' . admin_url('admin.php?page=helsingborg-dsc-google-places') . $paging_values['last_page'] . $paging_values['additional_query_strings'] . '">
                            <span class="screen-reader-text">Sista sidan</span>
                            <span aria-hidden="true">»</span>
                          </a>';
                }
                else {
                    echo '<span class="tablenav-pages-navspan" aria-hidden="true">»</span>';
                }
            ?>
            </span>
        </div>
    </div>
<?php
}
?>