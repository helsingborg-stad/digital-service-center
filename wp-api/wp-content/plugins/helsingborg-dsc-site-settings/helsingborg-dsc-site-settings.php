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
  /*
  Argument 1: Fallback text
  Argument 2: Key
  Argument 3: Help text in admin (optional)
  Argument 4: Ignore fallback value (optional)
  */
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
    ['Betyg', 'rating'],
    ['Stäng rutan?', 'close-popup'],
    ['Ja', 'yes'],
    ['Nej', 'no'],
    ['Chatta med oss', 'chat-with-us'],
    ['Detta hittade vi', 'we-found-this'],
    ['Se och upplev', 'see-and-discover'],
    ['Hittade inga matchande resultat för din sökning', 'no-results-found', 'Ange {link}min länktext{/link} någonstans i texten för att infoga hjälplänk'],
    ['URL för hjälplänk till söktext', 'no-results-url', '', true],
    ['Fråga kontaktcenter', 'ask-customer-center'],
    ['Visa information', 'show-information'],
    ['Adresser', 'addresses'],
    ['Tillbaka', 'go-back'],
    ['Översätt', 'translate-button'],
    ['Av Google Translate', 'translated-by-google'],
    ['Visar numActiveEvents av numEvents evenemang', 'number-of-events-showing', 'numActiveEvents och numEvents får ej ändras'],
    ['Rensa filter', 'clear-filter'],
    ['Välj kategorier', 'choose-categories']
  ];
}

include('includes/site-settings-admin.php');
include('includes/site-settings-api.php');

?>