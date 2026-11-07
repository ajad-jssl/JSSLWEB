const MainPage =  "InvoiceMasters.jsp";
const UserId = sessionStorage.getItem('username');

let allowedActions = [];

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
            {
                method: "GET",
                credentials: "include", // 🔐 send cookies/session
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch actions");
        }

        allowedActions = await response.json();
		
		

    } catch (error) {
        console.error("Error:", error);
    }
}

document.getElementById("#modalScroll").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable').modal('hide');
	  return;
	}
	$('#exampleModalScrollable').modal('show');
});

/*const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);
*/
document.getElementById("edate").setAttribute("min", new Date().toISOString().split('T')[0]);

const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

document.addEventListener("DOMContentLoaded", function () {
	loadActions();
});
// Ensure the ID is available before making the API call
if (selectedFactoryId) {
    fetchdelivery();
	fetchAllGstSeries();
} else {
    console.error('No factory ID found in sessionStorage.');
}



async function fetchAllGstSeries() {
    try {
        const url = new URL('/jssl/seriesmaster/getAllGstSeries', baseUrl);

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include' // send JSESSIONID
        });

        if (!response.ok) {
            throw new Error('Failed to fetch GST series');
        }

        const data = await response.json();

        if (data.status === 'yes' && Array.isArray(data.GSTInfoBasedOnStateId)) {
            populateTable(data.GSTInfoBasedOnStateId);
            document.getElementById('tableContainer').style.display = 'block';
        } else {
            clearTable();
            document.getElementById('tableContainer').style.display = 'none';
        }

    } catch (error) {
        console.error('Error loading GST series:', error);
    }
}


function populateTable(data) {

    // Destroy DataTable if already initialized
    if ($.fn.DataTable.isDataTable('#tableID')) {
        $('#tableID').DataTable().clear().destroy();
    }

    const tbody = document.querySelector('#tableID tbody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.state_name}</td>
            <td>${item.invoice_series}</td>
         
			
			<td>${formatDateToDDMMYYYY(item.start_date)}</td>
			<td>${formatDateToDDMMYYYY(item.end_date)}</td>
            <td>${item.series_no}</td>
            <td>${item.gst_status}</td>
        `;
        tbody.appendChild(tr);
    });

    // Initialize DataTable
    $('#tableID').DataTable({
        pageLength: 10,
        ordering: true
    });
}

function clearTable() {
    document.querySelector('#tableID tbody').innerHTML = '';
}



async function fetchdelivery() {
	fetchSate();
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/seriesmaster/getGstStates`, baseUrl);
		//url.searchParams.append('factory_id', selectedFactoryId); 
		
        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.GSTStatesList.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("statedrop");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select State</option>`;
		selectElement.innerHTML = `<option value="All">All</option>`;


        // Populate dropdown options using SalesOrderTypeDetails array
        json.GSTStatesList.forEach((type) => {
            if (type.state_id && type.state_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.state_id; // Backend keeps saleorder_id
                option.textContent = type.state_name +"-" +type.state_id_code; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchSate() {
    try {
        const url = new URL(`/jssl/seriesmaster/getClosedStatusGstStates`, baseUrl);
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        const json = await response.json();

        if (json.status !== "yes" || !json.GSTStatesClosedStatusList.length) {
            console.warn("No sale order types found.");
            return;
        }

        const selectElement = document.getElementById("state");
        selectElement.innerHTML = `<option value="">Select State</option>`;

		json.GSTStatesClosedStatusList.forEach((type) => {
		    if (type.state_id && type.state_name) {
		        const option = document.createElement("option");

		        // Unique per business unit, since one state can have several BUs
		        option.value = type.bu_code;
		        option.textContent = type.state_name;
		        option.dataset.stateIds = String(type.state_ids);
		        option.dataset.buCode = type.bu_code;
		        selectElement.appendChild(option);
		    }
		});

    } catch (error) {
        console.error("Error fetching states:", error);
    }
}

// Event listener for 'statedrop' select element
document.getElementById('statedrop').addEventListener('change', function() {
    const selectedStateId = this.value; // Get the selected state ID
   
	
	
	if(selectedStateId === 'All'){
		fetchAllGstSeries();
	}
	 else  {
        fetchGSTStateInfo(selectedStateId); // Call the API if a valid state ID is selected
    }
});

// Function to fetch GST state information based on selected state ID
async function fetchGSTStateInfo(stateId) {
    try {
	    const url = new URL(`/jssl/seriesmaster/getGstStateInfo`, baseUrl);
        const params = new URLSearchParams();
        params.append('state_id', stateId); // Append state_id as a query parameter
        url.search = params.toString();

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        const data = await response.json();

        if (data.status === 'yes' && Array.isArray(data.GSTInfoBasedOnStateId) && data.GSTInfoBasedOnStateId.length > 0) {
            // Show the table and populate it with the fetched data
            document.getElementById('tableContainer').style.display = 'block';  // Show table
            populateTable(data.GSTInfoBasedOnStateId);
        } else {
            console.warn("No data found for the selected state.");
            clearTable(); // Clear the table if no data
            document.getElementById('tableContainer').style.display = 'none';  // Hide table if no data
        }
    } catch (error) {
        console.error("Error fetching GST state info:", error);
    }
}

// Function to populate the table with the fetched data
/*function populateTable(data) {
    const tableBody = document.querySelector('#tableID tbody');
    tableBody.innerHTML = ''; // Clear any existing rows

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.state_name}</td>
            <td>${item.invoice_series}</td>
            <td>${item.start_date}</td>
            <td>${item.end_date}</td>
            <td>${item.series_no}</td>
            <td>${item.gst_status}</td>
        `;
        tableBody.appendChild(row);
    });

    // Initialize DataTables after populating the table
    $('#tableID').DataTable();
}

// Function to clear the table
function clearTable() {
    const tableBody = document.querySelector('#tableID tbody');
    tableBody.innerHTML = '<tr><td colspan="7">No data available.</td></tr>';
}*/

function openModalAdd() {

    const stateSelect = document.getElementById('state');
    const state = stateSelect.value.trim();
    const selectedOption = stateSelect.options[stateSelect.selectedIndex];

    // ✅ read stored state_id
    const state_id = selectedOption?.dataset?.stateIds || '';

    const seriesNo = document.getElementById('ses').value.trim();
    const sdate = document.getElementById('sdate').value.trim();
    const edate = document.getElementById('edate').value.trim();

    let showError = false;

    // State validation
    if (state === '') {
        document.getElementById('productCodeErrorcredit').innerText = "Please select state.";
        document.getElementById('productCodeErrorcredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit').style.display = "none";
    }

    // Series number validation
    if (seriesNo === '') {
        document.getElementById('productCodeErrorcredit1').innerText = "Please enter series number.";
        document.getElementById('productCodeErrorcredit1').style.display = "inline-block";
        showError = true;
    } else if (!/^\d{10}$/.test(seriesNo)) {
        document.getElementById('productCodeErrorcredit1').innerText = "Series number must be exactly 10 digits.";
        document.getElementById('productCodeErrorcredit1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit1').style.display = "none";
    }

    // ✅ Optional: verify series starts with state_id
    if (!showError && state_id) {
        if (!seriesNo.startsWith(state_id)) {
            document.getElementById('productCodeErrorcredit1').innerText =
                "Series number must start with selected State ID (" + state_id + ")";
            document.getElementById('productCodeErrorcredit1').style.display = "inline-block";
            showError = true;
        }
    }

    // Start date
    if (sdate === '') {
        document.getElementById('productCodeErrorcredit2').innerText = "Please enter start date.";
        document.getElementById('productCodeErrorcredit2').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit2').style.display = "none";
    }

    // End date
    if (edate === '') {
        document.getElementById('productCodeErrorcredit3').innerText = "Please enter end date.";
        document.getElementById('productCodeErrorcredit3').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit3').style.display = "none";
    }

    // Final submit
    if (!showError) {
        console.log("Selected state_id for verification:", state_id);
        $('#exampleModalCenter66').modal('show');
    }
}

// Restrict input to 10 digits and display format guidance
document.getElementById("ses").addEventListener("input", function () {
    let inputField = document.getElementById("ses");
    let formatMessage = document.getElementById("seriesFormatMessage");

    // Remove non-numeric characters and limit to 10 digits
    inputField.value = inputField.value.replace(/\D/g, '').slice(0, 10);

    // Show guidance message and change color based on input length
    if (inputField.value.length > 0 && inputField.value.length < 10) {
        formatMessage.style.color = "red"; // Not 10 digits yet
    } else {
        formatMessage.style.color = "blue"; // Valid format
    }
});


function addevent() {
    $('#exampleModalCenter66').modal('hide');

    const stateSelect = document.getElementById('state');
    const selectedOption = stateSelect.options[stateSelect.selectedIndex];

    const state_id = selectedOption.dataset.stateIds;   // e.g. 27
    const bu_code  = selectedOption.dataset.buCode;     // e.g. JBU-2

    console.log('state_id:', state_id, 'bu_code:', bu_code);

    $.ajax({
        url: new URL('/jssl/seriesmaster/addGstMaster', baseUrl),
        type: 'POST',
        xhrFields: { withCredentials: true },
        dataType: 'json',
        data: jQuery.param({
            state_id: state_id,
            bu_code: bu_code,                      // 👈 new
            created_by: createdById,
            invoice_series: document.getElementById('ses').value,
            start_date: document.getElementById('sdate').value,
            end_date: document.getElementById('edate').value
        }),
        success: function(data) {
            // ✅ Log full response to see exact error
            console.log('Full API response:', data);
            
            if (data.message === "Success") {
                sessionStorage.setItem('state_id', state_id);

                const popup = $('<div class="popup">GST Series Master Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'gstseriesmaster.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Already Exists, GST series details not added.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
            }
        },
        error: function(xhr) {
            // ✅ Log full error details
            console.error('Request failed:', xhr.responseText);
        }
    });
}

function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
}
