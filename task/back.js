// Function to handle AJAX form submission
        

$(window).on('load', function () {
    if ($('#preloader').length) {
    $('#preloader').delay(1000).fadeOut('slow', function () {
    $(this).remove();
    });
    }
    });

$('#postalcodebtn').click(function() {


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
                $('#postalCodeResult').html(result['data'][0]['adminCode2']);
                $('#postalCodeResult1').html(result['data'][1]['placeName']);
                $('#postalCodeResult2').html(result['data'][2]['lat']);
            }
           


        },
       
    error: function(jqXHR, textStatus, errorThrown){
        console.log(jqXHR);  
         
        }
    });

});

$('#wikipediabtn').click(function() {
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
                $('#wikiResult').html(result['data'][0]['wikipediaUrl']);
               
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
                $('#timezoneResult').html(result['data'][0]['adminCode2']);
                
            }
           


        },
       
    error: function(jqXHR, textStatus, errorThrown){
        console.log(jqXHR);
         
       
    }
    });
});
