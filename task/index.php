<?php



// Get the API type from the form submission
$apiType = $_POST['apiType'];

// Determine which API to call based on the 'apiType' field
switch ($apiType) {
    case 'postalCode':
        // Handle Postal Code Lookup
        $postalCode = $_POST['postalcode'];
        $country = $_POST['country'];
        $url = "http://api.geonames.org/findNearbyPostalCodesJSON?postalcode=$postalCode&country=$country&username=alamine";
        break;

    case 'wikipedia':
        // Handle Find Nearby Wikipedia Entries
        $lat = $_POST['lat'];
        $lng = $_POST['lng'];
        $url = "http://api.geonames.org/findNearbyWikipediaJSON?lat=$lat&lng=$lng&username=alamine";
        break;

    case 'timezone':
        // Handle Time Zone Lookup
        $lat = $_POST['timezoneLat'];
        $lng = $_POST['timezoneLng'];
        $url = "http://api.geonames.org/timezoneJSON?lat=$lat&lng=$lng&username=alamine";
        break;

    default:
        echo "Invalid API type.";
        exit();
}

// Initialize cURL session
$ch = curl_init();

// Set the URL and other cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL request and fetch the response
$response = curl_exec($ch);

// Close the cURL session
curl_close($ch);

// Return the API response
if ($response) {
    echo "<pre>";
    print_r(json_decode($response, true));
    echo "</pre>";
} else {
    echo "No data returned or an error occurred.";
}

?>
