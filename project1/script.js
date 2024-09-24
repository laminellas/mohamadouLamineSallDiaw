var xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function() {
  const content = JSON.parse(this.responseText);

  const dropdown = document.getElementById('myDropdown');

  content.forEach(optionText => {
    const option = document.createElement('option');
    
    option.value = optionText;  
    option.text = optionText;

   
    dropdown.appendChild(option);
});
}
xmlhttp.open("GET", "profile.php", true);
xmlhttp.send();
