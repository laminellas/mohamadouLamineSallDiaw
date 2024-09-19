
console.log('check');

$(window).on('load', function () {
    if ($('#preloader').length) {
    $('#preloader').delay(1000).fadeOut('slow', function () {
    $(this).remove();
    });
    }
    });
$('#postalcodebtn').click(function() {
    console.log('test');


    $.ajax({
        url:"postalcode.php",
        type: 'POST',
        dataType: 'json',
        data: {
            postalcode: $('#postalcode').val(),
            country: $('#country').val()
        },
        success: function(result) {
            console.log(result);
            if(result.status.name == "ok") {
                $('#postalCodeResult').html(result['data']['postalCodes'][2]['adminCode1'])
                // $('#postalCodeResult1').html(result['data'][1]['placeName']);
                // $('#postalCodeResult2').html(result['data'][2]['lat']);
            }
           


        },
       
    error: function(jqXHR, textStatus, errorThrown){
        console.log(jqXHR);  
         
        }
    });

});

$('#Wikipediabtn').click(function() {
    $.ajax ({
        url:"wekipediaAPI.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#latitude').val(),
            lng: $('#longitude').val()
        },
        success: function(result) {
            console.log(result);
            if(result.status.name == "ok") {
                $('#wikiResult').html(result['data']['geonames'][0]['wikipediaUrl']);
               
            }
           


        },
       
    error: function(jqXHR, textStatus, errorThrown){
        console.log(jqXHR);
         
       
    }
    });

});



$('#timeZonebtn').click(function() {
    $.ajax ({
        url:"timeZone.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#timezoneLat').val(),
            lng: $('#timezoneLng').val()
        },
        success: function(result) {
            console.log(result);
            if(result.status.name == "ok") {
                $('#timezoneResult').html(result['data']['time']);
                
            }
           


        },
       
    error: function(jqXHR, textStatus, errorThrown){
        console.log(jqXHR);
         
       
    }
    });
});
