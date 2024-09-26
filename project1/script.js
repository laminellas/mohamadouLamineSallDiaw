
  $.ajax({
    url: "profile.php",
    type: 'GET',
    dataType: 'json',
    success: function(result) {
       console.log(result);
       const $dropdown = $('#countryDropdown'); 

       
       $.each(result, function(index, country) {
           $dropdown.append(
               $('#drop')
                   .val(result.data[index].iso_a2) 
                   .text(result.data[index].name) 
                );
       })
   },error:function(jqXHR){

      console.log(jqXHR);

  }
  
}); 
