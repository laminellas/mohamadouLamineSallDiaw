<?php
$apiKey = '17ba9391059909756be63383a054282e';
$baseCurrency = 'USD';    // Base currency to compare against others

// Get the currency from the AJAX request (e.g., USD to EUR)
$toCurrency = isset($_GET['to_currency']) ? $_GET['to_currency'] : 'EUR';

// API URL (example with Fixer.io API)
$url = "http://data.fixer.io/api/latest?access_key=$apiKey&base=$baseCurrency&symbols=$toCurrency";

// Initialize cURL session
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL request
$response = curl_exec($ch);
curl_close($ch);

// Check if the response contains valid data
if ($response) {
    // Decode the JSON response from the API
    $data = json_decode($response, true);

    // Check if the request was successful
    if (isset($data['success']) && $data['success'] === true) {
        // Send back exchange rate in JSON format
        $exchangeRate = $data['rates'][$toCurrency];
        echo json_encode([
            'success' => true,
            'rate' => $exchangeRate,
            'currency' => $toCurrency
        ]);
    } else {
        // Return error message
        echo json_encode([
            'success' => false,
            'message' => 'Unable to retrieve exchange rate data.'
        ]);
    }
} else {
    // Handle the case where the API request fails
    echo json_encode([
        'success' => false,
        'message' => 'API request failed.'
    ]);
}
?>
