$.ajax({
    url: "profile.php",
    type: 'GET',
    dataType: 'json',
    success: function(result) {
       console.log(result);
       const $dropdown = $('#countryDropdown'); 

       
       $.each(result.data, function(index, country) {
           $dropdown.append(
              $('<option></option>')

                 .val(result.data[index].iso_a2)

                 .text(result.data[index].name)

         );
       })
   },error:function(jqXHR, textStatus, errorThrown){

      console.log(jqXHR);

  }
  
}); 
var map;

// Tile layers
var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
});

var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
});

var basemaps = {
    "Streets": streets,
    "Satellite": satellite
};

// Buttons
var currencyBtn = L.easyButton("fa-dollar-sign fa-xl", function (btn, map) {
    $("#modal1").modal("show");
});
var weatherBtn = L.easyButton("fa-cloud-sun fa-xl", function (btn, map) {
    $("#modal2").modal("show");
});
var wekipediaBtn = L.easyButton("fa-globe fa-xl", function (btn, map) {
    $("#modal3").modal("show");
});
var demographicBtn = L.easyButton("fa-city fa-xl", function (btn, map) {
    $("#modal4").modal("show");
});
var statisticBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
    $("#modal5").modal("show");
});

// Initialize the map
$(document).ready(function () {
    map = L.map("map", {
        layers: [streets]
    }).setView([54.5, -4], 6); // Initial view (centered on UK, change as needed)

    // Add layer control for basemaps
    layerControl = L.control.layers(basemaps).addTo(map);

    // Add the buttons
    currencyBtn.addTo(map);
    weatherBtn.addTo(map);
    wekipediaBtn.addTo(map);
    demographicBtn.addTo(map);
    statisticBtn.addTo(map);

    // ---------------------------------------------------------
    // GET THE DEVICE LOCATION USING GEOLOCATION API
    // ---------------------------------------------------------
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                // Success callback: user location available
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                // Center the map at the user's location
                map.setView([lat, lng], 13); // Zoom level 13 to focus on the current location

                // Add a marker at the user's current location
                L.marker([lat, lng]).addTo(map)
                    .bindPopup("You are here!")
                    .openPopup();
            },
            function (error) {
                // Error callback: handle any error
                console.error("Geolocation failed: " + error.message);
                alert("Unable to retrieve your location.");
            }
        );
    } else {
        // Geolocation is not supported by the browser
        alert("Geolocation is not supported by your browser.");
    }

    var countryGeoJSON;

    // Load GeoJSON for country borders
    fetch('countryBorders.geo.json')
        .then(response => response.json())
        .then(data => {
            countryGeoJSON = data;
            L.geoJSON(countryGeoJSON).addTo(map);
        });

    $('#countryDropdown').change(function () {
        var selectedCountry = $(this).val();
        console.log("Selected Country Code:", selectedCountry); // Log the selected country code

        if (selectedCountry) {
            // Check if countryGeoJSON is loaded
            if (!countryGeoJSON) {
                console.error("GeoJSON data not loaded yet.");
                return;
            }

            // Log the features in the GeoJSON
            console.log("GeoJSON Features:", countryGeoJSON.features);

            var selectedCountryGeoJSON = countryGeoJSON.features.find(feature => feature.properties.ISO_A2 === selectedCountry);

            if (selectedCountryGeoJSON) {
                var bounds = L.geoJSON(selectedCountryGeoJSON).getBounds();
                map.fitBounds(bounds);

                // Highlight the country
                L.geoJSON(selectedCountryGeoJSON, {
                    style: {
                        color: 'blue',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.5
                    }
                }).addTo(map);

                // Clear existing markers before adding new ones
                if (window.countryMarkers) {
                    window.countryMarkers.forEach(marker => map.removeLayer(marker));
                }
                window.countryMarkers = [];

                // Fetch cities for the selected country from GeoNames API
                fetch(`http://api.geonames.org/searchJSON?formatted=true&q=${selectedCountry}&maxRows=10&username=yourGeoNamesUsername`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.geonames) {
                            data.geonames.forEach(city => {
                                var countryMarker = L.marker([city.lat, city.lng])
                                    .addTo(map)
                                    .bindPopup(city.name)
                                    .openPopup();
                                window.countryMarkers.push(countryMarker);
                            });
                        } else {
                            console.error("No city data found for the selected country.");
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching data from GeoNames:", error);
                    });
            } else {
                console.error("Selected country data not found in GeoJSON");
            }
        }
    });
});



                                       
            
        
  // Fetch available exchange rates from your PHP API
  function fetchExchangeRates() {
      return $.ajax({
          url: 'currencyExchange.php', // Replace with the actual path to your PHP script
          type: 'GET',
          dataType: 'json',
          success: function(data) {
            console.log(data);
              return data;
          },
          error: function(xhr, status, error) {
              console.log("Error fetching exchange rates:", xhr);
          }
      });
  }

  // Populate currency dropdowns dynamically
  function populateCurrencyDropdowns(rates) {
      let fromDropdown = $('#from-currency');
      let toDropdown = $('#to-currency');
      
      // Iterate through the exchange rates and add them as options
      $.each(rates, function(currency) {
          fromDropdown.append(`<option value="${currency}">${currency}</option>`);
          toDropdown.append(`<option value="${currency}">${currency}</option>`);
      });
  }
  $(document).ready(function () {
  // Fetch exchange rates and populate the dropdowns
  fetchExchangeRates().done(function(response) {
    if (response.status.code === "200") {
        let rates = response.data;
        populateCurrencyDropdowns(rates);

        // Write ajax request to country info API to get the currency code for the selected country
        $('#countryDropdown').change(function() {
            let selectedCountryCode = $(this).val(); // Get the selected country code from dropdown

            // Make the AJAX request to REST Countries API
            $.ajax({
                url: `https://restcountries.com/v3.1/alpha/${selectedCountryCode}`,
                method: 'GET',
                success: function(data) {
                    let currencies = data[0].currencies;
                    let currencyCode = Object.keys(currencies)[0];  // Get the first currency code

                    // Select the matching currency in the "from-currency" dropdown
                    $('#from-currency').val(currencyCode);
                },
                error: function(error) {
                    console.error('Error fetching country currency information:', error);
                }
            });
        });

        // Handle conversion when the "Convert" button is clicked
        $('#convert-btn').click(function() {
            let amount = parseFloat($('#amount').val());
            let fromCurrency = $('#from-currency').val();
            let toCurrency = $('#to-currency').val();

            console.log("Amount:", amount);
            console.log("From Currency:", fromCurrency);
            console.log("To Currency:", toCurrency);

            // Validate input
            if (isNaN(amount) || amount <= 0) {
                $('#result').html("Please enter a valid amount.");
                return;
            }

            // Fetch exchange rates again (you could cache this in production)
            fetchExchangeRates().catch(function(err) {
                console.log(err);
            }).done(function(response) {
                console.log("Response from PHP:", response);
                if (response.status.code == "200") {
                    let rates = response.data;

                    // Get the exchange rates for the selected currencies
                    let fromRate = rates[fromCurrency];
                    let toRate = rates[toCurrency];

                    console.log(fromRate);
                    console.log(toRate);

                    // Perform the currency conversion
                    let convertedAmount;
                    if (fromCurrency === 'USD') {
                        console.log(1);
                        convertedAmount = amount * toRate;  // Convert USD to target currency
                    } else if (toCurrency === 'USD') {
                        console.log(2);
                        convertedAmount = amount / fromRate;  // Convert selected currency to USD
                    } else {
                        console.log(3);
                        // Convert between two non-USD currencies via USD
                        convertedAmount = (amount / fromRate) * toRate;
                    }

                    // Display the result
                    $('#result').html(`${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`);
                } else {
                    $('#result').html("Error fetching exchange rates.");
                }
            });
        });
    }
});

});


// modal2
$(document).ready(function(){
  
  // Handle the weather button click event
  $('#countryDropdown').change(function() {
      // Get selected country code from the dropdown
      let countryCode = $('#countryDropdown').val();
      var countries = $(this).val();

    if (countries) {
      // Make AJAX request to the PHP script to get weather data
      $.ajax({
          url: 'weather.php',  // PHP file that fetches weather from OpenWeather API
          type: 'POST',
          data: {
              countryCode: countryCode
          },
          success: function(response) {
              // Parse and display the weather information
              
              $('#weather-result').html(response);
            //  $('#get-weather').hide();
          },
          error: function(xhr, status, error){
              console.error('Error fetching weather data:', xhr);
          }

      });
    } else {
        $('#weather-result').html('Select a country to display news.');
    }
  });
});

//modal3


$(document).ready(function () {
    // When the "Get Wikipedia Link" button is clicked
    $('#countryDropdown').change(function () {
        // Get the selected country
        var selectedCountry = $('#countryDropdown').val();

        // Make an AJAX request to the PHP backend
        $.ajax({
            url: 'getCountryId.php', // Adjust the PHP URL if necessary
            method: 'GET',
            data: { country: selectedCountry },
            success: function (response) {
                
                // Parse the JSON response
                var result = JSON.parse(response);
                console.log(result.wikiUrl);
                // Check if the request was successful
                if (result.status === 'success') {
                    // Display the Wikipedia summary and link from the GeoNames API response
                    $('#wikipedia-result').html(
                        '<div>' +
                            '<p><strong>Summary:</strong> ' + result.summary + '</p>' + // Show the summary
                            '<p><a href="' + result.wikiUrl + '" target="_blank">' +
                            'Click here to read more about ' + selectedCountry + ' on Wikipedia' +
                            '</a></p>' +
                        '</div>'
                    );
                } else {
                    // Display an error message if unsuccessful
                    $('#wikipedia-result').html('<div class="alert alert-danger">' + result.message + '</div>');
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors
                $('#wikipedia-result').html('<div class="alert alert-danger">Error fetching Wikipedia summary.</div>', xhr);
            }
        });
    });
});

//modal4 


$(document).ready(function() {
    // Populate country dropdown
    $.ajax({
        url: "getCountries.php", 
        method: "GET",
        dataType: "json",
        success: function(data) {
            $.each(data, function(index, country) {
                $('#countryDropdown').append(new Option(country.name, country.alpha2Code));
            });
        },
        error: function(xhr, status, error) {
            alert("Error fetching countries.", xhr);
        }
    });

    // Handle country selection
    $(document).ready(function () {
        $('#countryDropdown').change(function () {
            var selectedCountry = $(this).val();
            if (selectedCountry) {
                $.ajax({
                    url: 'getCountryStats.php', 
                    method: 'GET',
                    data: { countryCode: selectedCountry },
                    dataType: 'json',
                    success: function (data) {
                        if (data) {
                            // Display country details, including population, area, region, etc.
                            $('#countryStats').html(`
                                <h2>${data.name}</h2>
                                <p><strong>Population:</strong> ${data.population}</p>
                                <p><strong>Area:</strong> ${data.area} km²</p>
                                <p><strong>Region:</strong> ${data.region}</p>
                                <p><strong>Subregion:</strong> ${data.subregion}</p>
                                <p><strong>Timezones:</strong> ${data.timezones.join(", ")}</p>
                                <p><strong>Borders:</strong> ${data.borders.length > 0 ? data.borders.join(", ") : 'No bordering countries'}</p>
                                <p><strong>Flag:</strong></p>
                                <img src="${data.flag}" alt="Flag of ${data.name}" style="width: 150px;">
                            `);
                        } else {
                            $('#countryStats').html('<p>No data available.</p>');
                        }
                    },
                    error: function (xhr, status, error) {
                        $('#countryStats').html('<p>An error occurred while fetching the data.</p>');
                    }
                });
            } else {
                $('#countryStats').html('');
            }
        });
    });
});
    
    
//modal5

$(document).ready(function () {
    $('#countryDropdown').change(function () {
        var selectedCountry = $(this).val();
        
        if (selectedCountry) {
            $.ajax({
                url: 'getCountryData.php',
                method: 'GET',
                data: { countryCode: selectedCountry },
                success: function (response) {
                    var result = JSON.parse(response);
                    console.log(response);
                    
                    if (result.status === 'success') {
                        // Display historical population data
                        var populationData = result.historicalPopulation;
                        var gdpData = result.gdpData;

                        $('#countryStat').html(`
                            <h2>Country Data</h2>
                            <h3>Population (2000-2022)</h3>
                            <ul>
                                ${populationData.map(data => `<li>${data.date}: ${data.value.toLocaleString()}</li>`).join('')}
                            </ul>
                            <h3>GDP (Latest)</h3>
                            <p>GDP: ${gdpData.value ? gdpData.value.toLocaleString() : 'Data not available'}</p>
                        `);
                    } else {
                        $('#countryStat').html('<div class="alert alert-danger">' + result.message + '</div>');
                    }
                },
                error: function () {
                    $('#countryStat').html('<div class="alert alert-danger">An error occurred while fetching the data.</div>');
                }
            });
        } else {
            $('#countryStat').html('');
        }
    });
});
