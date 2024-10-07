<?php
// getWikipediaLinks.php

// GeoNames username (replace with your actual username)
$username = 'alamine';

// Get country ID from the request
$countryId = $_GET['countryId'];

// Fetch information about the country
$url = "http://api.geonames.org/getJSON?geonameId=$countryId&username=$username";

$response = file_get_contents($url);
$data = json_decode($response, true);

// Extract Wikipedia URL if available
$wikipediaLink = isset($data['geoname']['wikipediaUrl']) ? $data['geoname']['wikipediaUrl'] : null;

if ($wikipediaLink) {
    echo "<h3>Wikipedia Links</h3>";
    echo "<ul>";
    echo "<li><a href='$wikipediaLink' target='_blank'>$wikipediaLink</a></li>";
    echo "</ul>";
} else {
    echo "No Wikipedia link found for this country.";
}
?>
