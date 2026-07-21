const selectedFactoryId = localStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

// Ensure the ID is available before making the API call
if (selectedFactoryId) {
    fetchUserList(selectedFactoryId);
} else {
    console.error('No factory ID found in localStorage.');
}

function fetchUserList(factoryId) {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/salesordertype/list`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        data: { factory_id: factoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.SalesOrderDetails;
            document.getElementById("Scraptypeid").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}
