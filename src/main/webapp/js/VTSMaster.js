

// Retrieve the selected factory ID from sessionStorage
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
if (selectedFactoryId) {
    fetchregisterMasterCount();
	fetchvehicleMasterCount();
	fetchstateMasterCount();
	fetchcityMasterCount();
	fetchcompanyMasterCount();
	fetchseleMasterCount();
} else {
    console.error('No factory ID found in sessionStorage...');
}

function fetchregisterMasterCount() {
    fetch(new URL('/api/Regtype', baseUrl1), {
        method: 'GET',
        credentials: 'include',  // Ensures cookies are sent with the request if needed
    })
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
            document.getElementById("regcount").textContent = data.length;
        } else {
            console.warn("Unexpected response format: expected an array.", data);
            document.getElementById("regcount").textContent = 0;
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function fetchvehicleMasterCount() {
    $.ajax({
        url: new URL(`/api/vtype`, baseUrl1),
        type: "GET",
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data)) {
                document.getElementById("vehcount").textContent = data.length;
            } else {
                console.warn("Unexpected response format: expected an array.", data);
                document.getElementById("vehcount").textContent = 0;
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}
function fetchstateMasterCount() {
    $.ajax({
        url: new URL(`/api/location/states`, baseUrl1),
        type: "GET",
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data)) {
                document.getElementById("statcount").textContent = data.length;
            } else {
                console.warn("Unexpected response format: expected an array.", data);
                document.getElementById("statcount").textContent = 0;
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}
function fetchcityMasterCount() {
    $.ajax({
        url: new URL(`/api/location/cities`, baseUrl1),
        type: "GET",
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data)) {
                document.getElementById("citycount").textContent = data.length;
            } else {
                console.warn("Unexpected response format: expected an array.", data);
                document.getElementById("citycount").textContent = 0;
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}
function fetchcompanyMasterCount() {
    $.ajax({
        url: new URL(`/api/VMScompany`, baseUrl1),
        type: "GET",
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data)) {
                document.getElementById("compcount").textContent = data.length;
            } else {
                console.warn("Unexpected response format: expected an array.", data);
                document.getElementById("compcount").textContent = 0;
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}
function fetchseleMasterCount() {
    $.ajax({
        url: new URL(`/api/vms`, baseUrl1),
        type: "GET",
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data)) {
                document.getElementById("selecount").textContent = data.length;
            } else {
                console.warn("Unexpected response format: expected an array.", data);
                document.getElementById("selecount").textContent = 0;
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

/*document.addEventListener('DOMContentLoaded', function () {

  // Get reference to the "Contract" dropdown
  const contractSelect = document.getElementById('contract');

  // Function to fetch contract data and populate the dropdown
  function fetchContracts() {
    fetch('http://localhost:8004/api/vtscontract/all')  // Replace with your actual API endpoint
      .then(response => response.json())  // Parse the JSON response
      .then(data => {
        console.log(data);  // Log the data to inspect its structure
        // Clear the existing options in the "Contract" dropdown
        contractSelect.innerHTML = '<option value="">Select</option>';

        // Check if data is returned and is an array
        if (data && Array.isArray(data)) {
          // Populate the "Contract" dropdown with contract data
          data.forEach(contract => {
            const option = document.createElement('option');
            option.value = contract.contract_id;  // Assuming 'contract_id' is the identifier for the contract
            option.textContent = contract.jobCode;  // Assuming 'jobCode' is the label to be displayed
            contractSelect.appendChild(option);
          });
        } else { 
          console.error('No contracts found or invalid data format.');
        }
      })
      .catch(error => {
        console.error('Error fetching contracts:', error);
        alert('Error fetching contract data. Please try again later.');
      });
  }

  // Fetch the contract data when the page loads
  fetchContracts();
});*/