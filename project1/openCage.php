<?php


// Remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// OpenCage API Key (replace with your actual API key)
$apiKey = "aa6c0fb8acaf48b2aac7e50d9d3cf1db";

// Base URL for OpenCage API
$baseUrl = "https://api.opencagedata.com/geocode/v1/json";

// Country borders file
$countryBordersFile = "countryBorders.geo.json";

// Get the coordinates from the query string (you can pass lat/lng via AJAX request)
if (isset($_GET['lat']) && isset($_GET['lng'])) {
    $lat = $_GET['lat'];
    $lng = $_GET['lng'];
} else {
    echo json_encode(["status" => "error", "message" => "Latitude and Longitude are required"]);
    exit();
}

// Construct the OpenCage API URL to get country data based on lat/lng
$url = $baseUrl . "?q={$lat}+{$lng}&key=" . $apiKey;

// Function to make the API call and get country data
function getCountryData($url) {
    // Initialize cURL
    $ch = curl_init();
    
    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    
    // Execute the request
    $response = curl_exec($ch);
    
    // Check for errors
    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        return ["status" => "error", "message" => $error_msg];
    }
    
    // Close cURL
    curl_close($ch);
    
    // Decode JSON response
    $data = json_decode($response, true);
    
    // Return country code and name if available
    if (isset($data['results'][0]['components']['country_code']) && isset($data['results'][0]['components']['country'])) {
        return [
            "country_code" => strtoupper($data['results'][0]['components']['country_code']),
            "country_name" => $data['results'][0]['components']['country']
        ];
    } else {
        return ["status" => "error", "message" => "Invalid response from OpenCage API"];
    }
}

// Get country data from OpenCage
$countryInfo = getCountryData($url);

// If there's an error, return it
if (isset($countryInfo['status']) && $countryInfo['status'] == "error") {
    echo json_encode($countryInfo);
    exit();
}

// Read the country borders file
$countryBorders = file_get_contents($countryBordersFile);
$decodedBorders = json_decode($countryBorders, true);

// Find the country in the geo file by the country code
$countryData = null;
foreach ($decodedBorders['features'] as $feature) {
    if ($feature['properties']['iso_a2'] == $countryInfo['country_code']) {
        $countryData = $feature['properties'];
        break;
    }
}

// If the country was found, prepare the output
if ($countryData) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = [
        "country_name" => $countryInfo['country_name'],
        "country_code" => $countryInfo['country_code'],
        "borders" => $countryData
    ];
} else {
    $output['status']['code'] = "404";
    $output['status']['name'] = "not found";
    $output['status']['description'] = "Country not found in countryBorders.geo.json";
}

// Return the result as JSON
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);



?>
