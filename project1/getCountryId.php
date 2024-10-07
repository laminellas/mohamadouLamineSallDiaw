<?php

if (isset($_GET['country'])) {
    $country = urlencode($_GET['country']);
    
    // Create the Wikipedia URL
    $wikiUrl = "https://en.wikipedia.org/wiki/" . $country;

    // Check if the page exists by making a HEAD request
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $wikiUrl);
    curl_setopt($curl, CURLOPT_NOBODY, true); // We just need the headers
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 10);
    
    // Execute the cURL request
    curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    
    curl_close($curl);

    if ($httpCode == 200) {
        // Page exists, return the Wikipedia link
        echo json_encode([
            "status" => "success",
            "wikiUrl" => $wikiUrl
        ]);
    } else {
        // Page does not exist, return error
        echo json_encode([
            "status" => "error",
            "message" => "Wikipedia page not found for this country."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Country parameter is missing."
    ]);
}
?>



