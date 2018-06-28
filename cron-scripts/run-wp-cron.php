<?php
require('Logger.php');
$log = new snowytech\stphplogger\logWriter('/var/cron-scripts/logs/eventLog.txt');
chdir('/var/www/html'); // Go to WordPress root
include('wp-cron.php'); // Include cron file
$log->info('WP-Cron triggered');
return;
