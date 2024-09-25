$('#drop').click(function() {
   $.ajax({
      url: "profile.php",
      type: 'GET',
      dataType: 'json',
      success: function(result) {
         console.log(result);
   },error:function(jqXHR){

      console.log(jqXHR);
  
    }
    });
});
    
