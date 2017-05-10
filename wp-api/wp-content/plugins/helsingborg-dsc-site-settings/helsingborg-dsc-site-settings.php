<?php
/*
Plugin Name: Helsingborg Site Settings
Description: Settings page for assorted site-specific settings
Author: Meridium
Version: 0.1
Author URI: http://meridium.se
Text Domain: Helsingborg-dsc-site-settings
*/

function helsingborg_dsc_site_settings() {
  load_plugin_textdomain( 'Helsingborg-dsc-site-settings', false, 'helsingborg-dsc-site-settings' );
}

function hdsc_translatables() {
  return [
    ['Sök', 'search'],
    ['Helsingborg Free Wifi', 'helsingborg-free-wifi'],
    ['Tillbaka till start', 'back-to-start'],
    ['Välj datum', 'select-dates'],
    ['Idag', 'today'],
    ['Imorgon', 'tomorrow'],
    ['Helg', 'weekend'],
    ['Allt', 'all'],
    ['Navigera', 'navigate'],
    ['Mer info', 'more-info'],
    ['Relaterat', 'related'],
    ['Jämför', 'compare'],
    ['Ta mig dit', 'take-me-there'],
    ['Plats', 'location'],
    ['Datum och tid', 'date-and-time'],
    ['Öppettider', 'opening-hours'],
    ['Kontakt', 'contact'],
    ['Biljetter', 'tickets'],
    ['Betyg', 'rating']
  ];
}

include('includes/site-settings-admin.php');
include('includes/site-settings-api.php');

?>