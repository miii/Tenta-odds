<?php

setlocale(LC_ALL, 'swedish', 'sv_SE');

// Include required files
include('api/interface.scraper.php');
include('scrapers/class.liuscraper.php');
include('api/class.api.php');
include('api/class.cache.php');

$debug = false;

// Get course name from user
if ($debug) {
  $courseName = strtoupper(@$_GET['course']);
} else {
  $courseName = strtoupper(@$_POST['course']);
}

if (!$courseName) {
  header('HTTP/1.0 404 Not Found', true, 404);
  die();
}

// Scrape data from LIU
$scraper = new LIUScraper($courseName);
// Initialize cache
$cache = new Cache($courseName);
// Initialize API
$api = new API($courseName, $scraper, $cache);

$cache->clean();
$api->getData();

// Return JSON output
if (!$debug)
  header('Content-Type: application/json; charset=utf-8');
echo $api->getJSON();

?>
