<?php
header('Content-Type: application/json');

// Get country code from request
$countryCode = isset($_GET['countryCode']) ? $_GET['countryCode'] : '';

if ($countryCode) {
    // Fetch country data from REST Countries API
    $url = "https://restcountries.com/v3.1/alpha/{$countryCode}"; // API endpoint
    $response = file_get_contents($url);
    $countryData = json_decode($response, true);

    if (!empty($countryData)) {
        $countryInfo = $countryData[0];
        $result = [
            'name' => $countryInfo['name']['common'],
            'population' => $countryInfo['population'],
            'area' => $countryInfo['area'],
            'region' => $countryInfo['region'],
            'subregion' => $countryInfo['subregion'],
            'timezones' => $countryInfo['timezones']
        ];
        echo json_encode($result);
    } else {
        echo json_encode(null);
    }
} else {
    echo json_encode(null);
}
?>

