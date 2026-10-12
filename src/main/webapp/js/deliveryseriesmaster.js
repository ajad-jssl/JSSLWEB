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
	  $('#addDeliveryModal').modal('hide');
	  return;
	}
	$('#addDeliveryModal').modal('show');
});

/*const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);
*/
/*const baseUrl = 'http://localhost:8004';*/
document.getElementById("DeliveryenddateAdd").setAttribute("min", new Date().toISOString().split('T')[0]);

const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

document.addEventListener("DOMContentLoaded", function () {
	loadActions();
});
// Ensure the ID is available before making the API call
if (selectedFactoryId) {
    fetchdelivery();
	fetchAllDeliverySeries();
} else {
    console.error('No factory ID found in sessionStorage.');
}


async function fetchAllDeliverySeries() {
    try {
        const url = new URL('/jssl/seriesmaster/getAllDeliverySeriesBy', baseUrl);

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch Delivery series');

        const data = await response.json();

        if (data.status === 'yes' && Array.isArray(data.DeliverySeriesInfo)) {
            populateDeliveryTable(data.DeliverySeriesInfo);
            document.getElementById('tableContainer').style.display = 'block';
        } else {
            clearDeliveryTable();
            document.getElementById('tableContainer').style.display = 'none';
        }

    } catch (error) {
        console.error('Error loading Delivery series:', error);
    }
}


async function fetchdelivery() {
	fetchSate();
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/seriesmaster/getAllDeliverySeries`, baseUrl);
		//url.searchParams.append('factory_id', selectedFactoryId); 
		
        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.DeliverySeriesList.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("statedrop");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select State</option>`;
		selectElement.innerHTML = `<option value="All">All</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.DeliverySeriesList.forEach((type) => {
            if (type.state_id && type.state_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.state_id; // Backend keeps saleorder_id
                option.textContent = type.state_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchSate() {
    try {
        const url = new URL(`/jssl/seriesmaster/getClosedDeliverySeries`, baseUrl); // ✅ added leading /

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch states");

        const json = await response.json();

        if (json.status !== "yes" || !json.ClosedDeliverySeriesList.length) {
            console.warn("No states found.");
            return;
        }

        const selectElement = document.getElementById("state");
        selectElement.innerHTML = `<option value="">Select State</option>`;

        json.ClosedDeliverySeriesList.forEach((type) => {
            if (type.state_id && type.state_name) {
                const option = document.createElement("option");
                option.value = type.state_ids;                    // ✅ real DB id (28,12,18...)
                option.textContent = type.state_name;
                option.dataset.stateIds = String(type.state_ids); // ✅ keep for validation
                selectElement.appendChild(option);
            }
        });

    } catch (error) {
        console.error("Error fetching states:", error);
    }
}


document.getElementById('statedrop').addEventListener('change', function () {
    const selectedStateId = this.value;

    if (selectedStateId === 'All') {
        fetchAllDeliverySeries();
    } else if (selectedStateId) {
        fetchDeliverySeriesByState(selectedStateId);
    }
});

// Function to fetch GST state information based on selected state ID
async function fetchDeliverySeriesByState(stateId) {
    try {
        const url = new URL('/jssl/seriesmaster/getDeliverySeriesById', baseUrl);
        url.search = new URLSearchParams({ delivery_id: stateId });

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (
            data.status === 'yes' &&
            Array.isArray(data.DeliverySeriesInfo) &&
            data.DeliverySeriesInfo.length > 0
        ) {
            populateDeliveryTable(data.DeliverySeriesInfo);
            document.getElementById('tableContainer').style.display = 'block';
        } else {
            clearDeliveryTable();
            document.getElementById('tableContainer').style.display = 'none';
        }

    } catch (error) {
        console.error("Error fetching Delivery series by state:", error);
    }
}

// Function to populate the table with the fetched data
function populateDeliveryTable(data) {

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

    $('#tableID').DataTable({
        pageLength: 10,
        ordering: true
    });
}

/* ================================
   CLEAR TABLE
================================ */
function clearDeliveryTable() {
    document.querySelector('#tableID tbody').innerHTML = '';
}

function openModalAdd() {

    const stateSelect = document.getElementById('state');
    const state = stateSelect.value.trim();
    const selectedOption = stateSelect.options[stateSelect.selectedIndex];

    // ✅ Read stored state_id (same pattern as Self Invoice)
    const state_id = selectedOption?.dataset?.stateIds || '';

    const seriesNo = document.getElementById('DeliveryseriesAdd').value.trim();
    const sdate = document.getElementById('DeliverystartdateAdd').value.trim();
    const edate = document.getElementById('DeliveryenddateAdd').value.trim();

    let showError = false;

    /* =========================
       1️⃣ State validation
    ========================= */
    if (state === '') {
        document.getElementById('productCodeErrorcredit').innerText =
            "Please select state.";
        document.getElementById('productCodeErrorcredit').style.display =
            "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit').style.display = "none";
    }

    /* =========================
       2️⃣ Series number validation
    ========================= */
    if (seriesNo === '') {
        document.getElementById('productCodeErrorcredit1').innerText =
            "Please enter series number.";
        document.getElementById('productCodeErrorcredit1').style.display =
            "inline-block";
        showError = true;
    } else if (!/^\d{10}$/.test(seriesNo)) {
        document.getElementById('productCodeErrorcredit1').innerText =
            "Series number must be exactly 10 digits.";
        document.getElementById('productCodeErrorcredit1').style.display =
            "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit1').style.display = "none";
    }

    /* =========================
       3️⃣ Series must start with state_id
    ========================= */
    if (!showError && state_id) {
        if (!seriesNo.startsWith(state_id)) {
            document.getElementById('productCodeErrorcredit1').innerText =
                "Series number must start with selected State ID (" + state_id + ")";
            document.getElementById('productCodeErrorcredit1').style.display =
                "inline-block";
            showError = true;
        }
    }

    /* =========================
       4️⃣ Start date validation
    ========================= */
    if (sdate === '') {
        document.getElementById('productCodeErrorcredit2').innerText =
            "Please enter start date.";
        document.getElementById('productCodeErrorcredit2').style.display =
            "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit2').style.display = "none";
    }

    /* =========================
       5️⃣ End date validation
    ========================= */
    if (edate === '') {
        document.getElementById('productCodeErrorcredit3').innerText =
            "Please enter end date.";
        document.getElementById('productCodeErrorcredit3').style.display =
            "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit3').style.display = "none";
    }

    /* =========================
       6️⃣ Final submit
    ========================= */
    if (!showError) {
        console.log("Selected state_id for verification:", state_id);
        $('#exampleModalCenter66').modal('show');
    }
}


// Restrict input to 10 digits and display format guidance
document.getElementById("DeliveryseriesAdd").addEventListener("input", function () {
    let inputField = document.getElementById("DeliveryseriesAdd");
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

    const state_id = document.getElementById('state').value; // ✅ real DB id

    $.ajax({
        url: new URL('/jssl/seriesmaster/addDeliveryChallanMaster', baseUrl),
        type: 'POST',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: jQuery.param({
            state_id: state_id,                                                      // ✅ from DOM
            created_by: createdById,
            invoice_series: document.getElementById('DeliveryseriesAdd').value,      // ✅ from DOM
            start_date: document.getElementById('DeliverystartdateAdd').value,       // ✅ from DOM
            end_date: document.getElementById('DeliveryenddateAdd').value            // ✅ from DOM
        }),
        success: function(data) {
            if (data.message === "Success") {

                sessionStorage.setItem('state_id', state_id); // ✅ store real state_id

                const popup = $('<div class="popup">Delivery Series Master Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'deliveryseriesmaster.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Already Exists, Delivery series details not added.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
            }
        },
        error: function(xhr) {
            console.error('Request failed:', xhr.responseText);
        }
    });
}


function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
}
