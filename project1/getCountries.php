<?php
header('Content-Type: application/json');

// Fetch country data
$url = "https://restcountries.com/v3.1/all"; // API endpoint
$response = file_get_contents($url);
$countries = json_decode($response, true);

// Format the data for the dropdown
$countryList = [];
foreach ($countries as $country) {
    $countryList[] = [
        'name' => $country['name']['common'],
        'alpha2Code' => $country['cca2']
    ];
}

// Output JSON
echo json_encode($countryList);
?>
