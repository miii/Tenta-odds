<?php

include('api/interface.scraper.php');
include('scrapers/class.liuscraper.php');
include('api/class.api.php');

$courseName = @$_GET['course'];

header('Content-Type: text/html; charset=utf-8');
$scraper = new LIUScraper($courseName);
$api = new API($scraper);

header('Content-Type: application/json');
echo $api->getJSON();

?>
