<?php

// Include required files
include('api/interface.scraper.php');
include('scrapers/class.liuscraper.php');
include('api/class.api.php');
include('api/class.cache.php');

// Get course name from user
$courseName = strtoupper(@$_POST['course']);

if (!$courseName)
  die();

// Scrape data from LIU
$scraper = new LIUScraper($courseName);
// Initialize cache
$cache = new Cache($courseName);
// Initialize API
$api = new API($courseName, $scraper, $cache);

$cache->clean();
$api->getData();

// Return JSON output
header('Content-Type: application/json; charset=utf-8');
echo $api->getJSON();

?>
