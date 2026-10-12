//const baseUrl1 = 'http://10.10.94.4:8004';

// Retrieve the selected factory ID from sessionStorage
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
if (selectedFactoryId) {
    fetchItemsMasterCount();
	fetchClientMasterCount();
} else {
    console.error('No factory ID found in sessionStorage.');
}

function fetchItemsMasterCount() {
    $.ajax({
        url: new URL(`/api/items`, baseUrl1),
        type: "GET",
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data)) {
                document.getElementById("itemnew").textContent = data.length;
            } else {
                console.warn("Unexpected response format: expected an array.", data);
                document.getElementById("itemnew").textContent = 0;
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}
function fetchClientMasterCount() {
    $.ajax({
        url: new URL(`/api/clients`, baseUrl1),
        type: "GET",
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data)) {
                document.getElementById("clientnew").textContent = data.length;
            } else {
                console.warn("Unexpected response format: expected an array.", data);
                document.getElementById("clientnew").textContent = 0;
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}
