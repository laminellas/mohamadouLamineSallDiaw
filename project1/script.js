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
$('#countryDropdown').change(function(){
$.ajax({
  url: "currencyExchange.php",
  type: 'GET',
  dataType: 'json',
  success: function (data) {
    console.log(data);
    if (data.status.code === "200") {
        // Successfully retrieved exchange rates
        var rates = data.data;
        var output = '<h2>Exchange Rates</h2><ul>';
        
        // Loop through exchange rates and display them
        $.each(rates, function (currency, rate) {
            output += '<li><strong>' + currency + '</strong>: ' + rate + '</li>';
        });
        
        output += '</ul>';
        $('modal-body').html(output);
    } else {
        // Error handling if API request fails
        $('modal-body').html('<h2>Error fetching exchange rates: ' + data.status.description + '</h2>');
    }
},error:function(jqXHR, textStatus, errorThrown){

    console.log(jqXHR);

}

}); 
});
