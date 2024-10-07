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

// ---------------------------------------------------------
// GLOBAL DECLARATIONS
// ---------------------------------------------------------
var map;

// tile layers
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

// buttons
var infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
  $("#exampleModal").modal("show");
});
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
// ---------------------------------------------------------
// EVENT HANDLERS
// ---------------------------------------------------------

// initialise and add controls once DOM is ready
$(document).ready(function () {
  
  // Create the map object and set the default tile layer
  map = L.map("map", {
    layers: [streets]
  }).setView([54.5, -4], 6); // Initial view (centered on UK, change as needed)
  
  // Add layer control for basemaps
  layerControl = L.control.layers(basemaps).addTo(map);
  
  // Add the  buttons
  infoBtn.addTo(map);
  currencyBtn.addTo(map);
  weatherBtn.addTo(map);
  wekipediaBtn.addTo(map);
  demographicBtn.addTo(map);

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
  $('#get-weather').click(function() {
      // Get selected country code from the dropdown
      let countryCode = $('#countryDropdown').val();

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
              $('#get-weather').hide();
          },
          error: function(xhr, status, error){
              console.error('Error fetching weather data:', xhr);
          }

      });
      $('#country-select').change(function() {
        // Show the button again when a new country is selected
        $('#get-weather-btn').show();
    });
  });
});

//modal3


  
$(document).ready(function () {
    // When the "Get Wikipedia Link" button is clicked
    $('#wikipediaButton').click(function () {
        // Get the selected country
        var selectedCountry = $('#countryDropdown').val();

        // Make an AJAX request to the PHP backend
        $.ajax({
            url: 'getCountryId.php',
            method: 'GET',
            data: { country: selectedCountry },
            success: function (response) {
                // Parse the JSON response
                var result = JSON.parse(response);

                // Check if the request was successful
                if (result.status === 'success') {
                    // Display the Wikipedia link
                    $('#wikipedia-result').html(
                        '<a href="' + result.wikiUrl + '" target="_blank">' +
                        'Click here to read about ' + selectedCountry + ' on Wikipedia' +
                        '</a>'
                    );
                } else {
                    // Display an error message
                    $('#wikipedia-result').html('<div class="alert alert-danger">' + result.message + '</div>');
                }
            },
            error: function () {
                $('#wikipedia-result').html('<div class="alert alert-danger">Error fetching Wikipedia link.</div>');
            }
        });
    });
});

//modal4 
$(document).ready(function() {
    $('#getCountryInfo').click(function() {
        var countryCode = $('#countryDropdown').val();

        // Make AJAX request to PHP script to fetch country data
        $.ajax({
            url: 'demographicsInfo.php',
            method: 'GET',
            data: { country: countryCode },
            dataType: 'json',
            success: function(response) {
                $('#population').text(response.population);
                $('#ethnicity').text(response.ethnicity);
            },
            error: function(xhr, status, error) {
                console.log("Error: " + error, xhr);
            }
        });
    });
});
