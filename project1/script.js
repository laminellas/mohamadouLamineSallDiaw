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

// tile layers

var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
  }
);

var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  }
);

var basemaps = {
  "Streets": streets,
  "Satellite": satellite
};

// buttons

var infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
  $("#exampleModal").modal("show");
});


$(document).ready(function () {
  
  map = L.map("map", {
    layers: [streets]
  }).setView([54.5, -4], 6);
  
  

  layerControl = L.control.layers(basemaps).addTo(map);

  infoBtn.addTo(map);

})

//currencyExchange API
$(document).ready(function(){
  $('#convert').on('click', function(){
      var toCurrency = $('#currency').val();
      $.ajax({
          url: 'currencyExchange.php', 
          type: 'GET',
          data: {
              to_currency: toCurrency
          },
          success: function(response){
              var data = JSON.parse(response);
              console.log(result);
              if(data.success) {
                  $('#result').html('1 USD = ' + data.rate + ' ' + data.currency);
              } else {
                  $('#result').html('Error: ' + data.message);
              }
          },error:function(jqXHR, textStatus, errorThrown){

      console.log(jqXHR);

      });
  });
});
