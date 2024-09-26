
   $.ajax({
      url: "profile.php",
      type: 'GET',
      dataType: 'json',
      success: function(result) {
         console.log(result);
         const $dropdown = $('#countryDropdown'); 

         
         $.each(result, function(index, country) {
             $dropdown.append(
                 $('<option></option>')
                     .val(country.iso) 
                     .text(country.name) 
                  );
         })
     },error:function(jqXHR){

        console.log(jqXHR);
  
    }
    
}); 
