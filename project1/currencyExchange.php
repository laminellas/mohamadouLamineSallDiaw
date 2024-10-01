<?php

// Remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);



// Construct the full API URL
$url = 'https://openexchangerates.org/api/latest.json?app_id=8d99e8d17d7a47d0923a8e2e83b7ac15';

// Function to make the API call and get exchange rates
function getExchangeRates($url) {
    // Initialize cURL
    $ch = curl_init();
    
    // Set the URL and other required options for cURL
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // Return the output as a string instead of outputting it directly
    
    // Execute the request
    $response = curl_exec($ch);
    
    // Check for errors
    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        return ["status" => "error", "message" => $error_msg];
    }
    
    // Close the cURL session
    curl_close($ch);
    
    // Decode the JSON response
    $exchangeData = json_decode($response, true);
    
    // Return core information if valid, otherwise return an error
    if (isset($exchangeData['rates'])) {
        return $exchangeData['rates'];
    } else {
        return ["status" => "error", "message" => "Invalid API response"];
    }
}

// Call the function to get exchange rates
$exchangeRates = getExchangeRates($url);

$output = [];

if (isset($exchangeRates['status']) && $exchangeRates['status'] == 'error') {
    $output['status']['code'] = "500";
    $output['status']['name'] = "error";
    $output['status']['description'] = $exchangeRates['message'];
} else {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $exchangeRates;
}

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>
