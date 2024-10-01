<?php

// API URL 
$url = "https://openexchangerates.org/api/latest.json?app_id=8d99e8d17d7a47d0923a8e2e83b7ac15";


// Function to make the API call and get exchange rates
function getExchangeRates($url) {
    // Initialize cURL
    $ch = curl_init();
    
    // Set the URL and other required options for cURL
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // Return the output as a string instead of outputting it directly
    
    // Execute the request
    $response = curl_exec($ch);
    
    // Close the cURL session
    curl_close($ch);
    
    // Decode the JSON response
    $exchangeData = json_decode($response, true);
}
   

$output['status']['code'] = "200";

$output['status']['name'] = "ok";

$output['status']['description'] = "success";

$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

$output['data'] = $response;



header('Content-Type: application/json; charset=UTF-8');



echo json_encode($output);


?>
