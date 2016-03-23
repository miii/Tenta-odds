<?php

// Include required files
include('api/interface.scraper.php');
include('scrapers/class.liuscraper.php');
include('api/class.api.php');

// Get course name from user
$courseName = @$_GET['course'];

// Scrape data from LIU
$scraper = new LIUScraper($courseName);
// Initialize API
$api = new API($scraper);

// Return JSON output
header('Content-Type: application/json; charset=utf-8');
echo $api->getJSON();

?>
