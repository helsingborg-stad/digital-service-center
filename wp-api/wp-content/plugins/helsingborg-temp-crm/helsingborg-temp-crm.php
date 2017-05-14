<?php
/*
Plugin Name: Helsingborg temp crm
Description: Temporary solution for crm
Author: Meridium
Version: 0.1
Author URI: http://meridium.se
Text Domain: Helsingborg-dsc-startpage
*/

function hdsc_temp_crm_init() {
  add_menu_page('Temp CRM', 'Temp CRM', 'manage_options', 'temp-crm', hdsc_temp_crm_admin);
}

add_action('admin_menu', hdsc_temp_crm_init);

add_action('admin_init', function() {
  register_setting( 'hdsc-temp-crm', 'hdsc-temp-crm-json' );
});

function hdsc_temp_crm_admin() { 
?>
<h1>CRM Json</h1>
<h2>Lägg in json</h2>
<form action="options.php" method="post">
      <?php
        settings_fields( 'hdsc-temp-crm' );
        do_settings_sections( 'hdsc-temp-crm' );
      ?>
    <textarea rows="10" cols="70" name="hdsc-temp-crm-json"><?php echo get_option('hdsc-temp-crm-json'); ?></textarea>
    <?php submit_button(); ?>
</form>

<?php
}

add_action('rest_api_init', hdsc_temp_crm_register_routes);

function hdsc_temp_crm_register_routes() {
  register_rest_route( 'wp/v2', '/temp-crm', [
    methods  => WP_REST_Server::READABLE,
    callback => temp_crm_callback
  ]);
}

function temp_crm_callback(){
    $response = get_option('hdsc-temp-crm-json');
    $filtered_response = str_replace('\n', '', $response);
    return json_decode($filtered_response) ?? [];
}

?>