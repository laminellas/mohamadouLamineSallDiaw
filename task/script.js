// Function to handle AJAX form submission
        function handleFormSubmit(formId, resultId, apiType) {
            const form = document.getElementById(formId);
            form.addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent form from submitting the traditional way

                const formData = new FormData(form); // Collect form data
                formData.append('apiType', apiType); // Add apiType to the formData

                fetch('index.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(data => {
                    document.getElementById(resultId).innerHTML = data; // Display result
                })
                .catch(error => console.log(error));
            });
        }

        // Attach form submit handlers for each form
        handleFormSubmit('postalCodeForm', 'postalCodeResult', 'postalCode');
        handleFormSubmit('wikiForm', 'wikiResult', 'wikipedia');
        handleFormSubmit('timezoneForm', 'timezoneResult', 'timezone');
 
