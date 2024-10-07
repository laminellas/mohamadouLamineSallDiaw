<?php
if (isset($_GET['country'])) {
    $countryCode = $_GET['country'];

    // API endpoint to fetch country data
    $apiUrl = "https://restcountries.com/v3.1/alpha/" . $countryCode;

    // Fetch data from the API
    $response = file_get_contents($apiUrl);
    
    if ($response === FALSE) {
        echo json_encode([
            'error' => 'Could not retrieve country information'
        ]);
        exit;
    }

    // Decode JSON response into PHP array
    $countryData = json_decode($response, true);

    // Extract the population and demographics (for example, from the API response)
    $population = $countryData[0]['population'] ?? 'Not available';

    // Here, ethnicity might not be directly available in RestCountries API. You might use Geonames or other services for ethnicity.
    $ethnicity = "Data not available";  // Placeholder if the API doesn't provide ethnicity data

    // Return data in JSON format
    echo json_encode([
        'population' => $population,
        'ethnicity' => $ethnicity
    ]);
}
?>
