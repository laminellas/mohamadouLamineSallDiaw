// Function to handle AJAX form submission
        
$('#postalCodebtn').click(function() {
    $.ajax({
        url:"task1\postalcode.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#latitude').val(),
            lng: $('#longitude').val()
        },
        success: function(result) {
            console.log(result);
            if(result.status.name == "ok") {
                
            }
           


        },
       
    error: function(jqXHR, textStatus, errorThrown){
        // if(result.status.name != "ok") {
        //     console.log("there is an error");   
         
        }
    })

})
        handleFormSubmit('timezoneForm', 'timezoneResult', 'timezone');
 
