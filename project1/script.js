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
var currencyBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
  $("#modal1").modal("show");
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
  
  // Add the info button
  infoBtn.addTo(map);
  currencyBtn.addTo(map);

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
// modal1


$('#countryDropdown').change(function() {
  // Fetch available exchange rates from your PHP API
  function fetchExchangeRates() {
      return $.ajax({
          url: 'currencyExchange.php', // Replace with the actual path to your PHP script
          type: 'GET',
          dataType: 'json',
          success: function(data) {
              return data;
          },
          error: function(xhr, status, error) {
              console.log("Error fetching exchange rates:", error);
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

  // Fetch exchange rates and populate the dropdowns
  fetchExchangeRates().done(function(response) {
      if (response.status.code === "200") {
          let rates = response.data;
          populateCurrencyDropdowns(rates);
      } else {
          $('#result').html("Error fetching exchange rates.");
      }
  });

  // Handle conversion when the "Convert" button is clicked
  $('#convert-btn').click(function() {
      let amount = parseFloat($('#amount').val());
      let fromCurrency = $('#from-currency').val();
      let toCurrency = $('#to-currency').val();

     
      if (isNaN(amount) || amount <= 0) {
          $('#result').html("Please enter a valid amount.");
          return;
      }

      fetchExchangeRates().done(function(response) {
          if (response.status.code === "200") {
              let rates = response.data;

              // Get the exchange rates for the selected currencies
              let fromRate = rates[fromCurrency];
              let toRate = rates[toCurrency];

              // Perform the currency conversion
              let convertedAmount;
              if (fromCurrency === 'USD') {
                  convertedAmount = amount * toRate;  
              } else if (toCurrency === 'USD') {
                  convertedAmount = amount / fromRate;  
              } else {
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
});
