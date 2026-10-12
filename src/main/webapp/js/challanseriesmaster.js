
// challanseriesmaster

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
	  $('#addChallanModal').modal('hide');
	  return;
	}
	$('#addChallanModal').modal('show');
});

/*const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);
*/
/*const baseUrl = 'http://localhost:8004';*/
document.getElementById("ChallanenddateAdd").setAttribute("min", new Date().toISOString().split('T')[0]);

const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

document.addEventListener("DOMContentLoaded", function () {
	loadActions();
});
// Ensure the ID is available before making the API call
if (selectedFactoryId) {
    fetchdelivery();
	fetchAllChallanSeries();
} else {
    console.error('No factory ID found in sessionStorage.');
}



async function fetchAllChallanSeries() {
    try {
        const url = new URL('/jssl/seriesmaster/getAllChallanSeriesByAll', baseUrl);

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

		if (data.status === 'yes' && Array.isArray(data.ChallanSeriesInfo)) {
		    populateChallanTable(data.ChallanSeriesInfo);
		    document.getElementById('tableContainer').style.display = 'block';
		} else {
		    clearChallanTable();
		    document.getElementById('tableContainer').style.display = 'none';
		}

    } catch (error) {
        console.error('Error loading Challan series:', error);
    }
}


async function fetchdelivery() {
	fetchSate();
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/seriesmaster/getAllChallanSeries`, baseUrl);
		//url.searchParams.append('factory_id', selectedFactoryId); 
		
        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.ChallanSeriesList.length) {
            console.warn("No sale order types found.");
            return;
        }

		const selectElement = document.getElementById("statedrop");
		selectElement.innerHTML = `<option value="All">All</option>`;

		const seenStates = new Set();

		json.ChallanSeriesList.forEach((type) => {
		    if (type.state_id && type.state_name && !seenStates.has(type.state_id)) {
		        seenStates.add(type.state_id);

		        const option = document.createElement("option");
		        option.value = type.state_id;
		        option.textContent = type.state_name;
		        selectElement.appendChild(option);
		    }
		});

    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchSate() {
    try {
        const url = new URL(`/jssl/seriesmaster/getClosedChallanSeries`, baseUrl);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch states");

        const json = await response.json();

        if (json.status !== "yes" || !json.ClosedChallanSeriesList.length) {
            console.warn("No states found.");
            return;
        }

        const selectElement = document.getElementById("state");
        selectElement.innerHTML = `<option value="">Select State</option>`;

        json.ClosedChallanSeriesList.forEach((type) => {
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

// Event listener for 'statedrop' select element
document.getElementById('statedrop').addEventListener('change', function () {
    const selecctedstateId = this.value;

    if (selecctedstateId === 'All') {
        fetchAllChallanSeries();
    } else if (selecctedstateId) {
        fetchChallanSeriesByState(selecctedstateId);
    }
});
async function fetchChallanSeriesByState(stateId) {
    try {
        const url = new URL('/jssl/seriesmaster/getChallanSeriesById', baseUrl);
        url.search = new URLSearchParams({ challan_id: stateId });

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.status === 'yes' && Array.isArray(data.ChallanSeriesInfo)) {
            populateChallanTable(data.ChallanSeriesInfo);
            document.getElementById('tableContainer').style.display = 'block';
        } else {
            clearChallanTable();
            document.getElementById('tableContainer').style.display = 'none';
        }

    } catch (error) {
        console.error("Error fetching challan state info:", error);
    }
}
function populateChallanTable(data) {

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

/* =========================
   CLEAR TABLE
   ========================= */
function clearChallanTable() {
    document.querySelector('#tableID tbody').innerHTML = '';
}

function openModalAdd() {

    const stateSelect = document.getElementById('state');
    const state = stateSelect.value.trim();
    const selectedOption = stateSelect.options[stateSelect.selectedIndex];

    // ✅ Read stored state_id from option dataset
    const state_id = selectedOption?.dataset?.stateIds || '';

    const seriesNo = document.getElementById('ChallanseriesAdd').value.trim();
    const sdate = document.getElementById('ChallanstartdateAdd').value.trim();
    const edate = document.getElementById('ChallanenddateAdd').value.trim();

    let showError = false;

    /* 1️⃣ State validation */
    if (state === '') {
        document.getElementById('productCodeErrorcredit').innerText =
            "Please select state.";
        document.getElementById('productCodeErrorcredit').style.display =
            "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit').style.display = "none";
    }

    /* 2️⃣ Series number validation */
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

    /* 3️⃣ Series must start with selected state_id */
    if (!showError && state_id) {
        if (!seriesNo.startsWith(state_id)) {
            document.getElementById('productCodeErrorcredit1').innerText =
                "Series number must start with selected State ID (" + state_id + ")";
            document.getElementById('productCodeErrorcredit1').style.display =
                "inline-block";
            showError = true;
        }
    }

    /* 4️⃣ Start date validation */
    if (sdate === '') {
        document.getElementById('productCodeErrorcredit2').innerText =
            "Please enter start date.";
        document.getElementById('productCodeErrorcredit2').style.display =
            "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit2').style.display = "none";
    }

    /* 5️⃣ End date validation */
    if (edate === '') {
        document.getElementById('productCodeErrorcredit3').innerText =
            "Please enter end date.";
        document.getElementById('productCodeErrorcredit3').style.display =
            "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit3').style.display = "none";
    }

    /* 6️⃣ Final submit */
    if (!showError) {
        console.log("Selected state_id for verification:", state_id);
        $('#exampleModalCenter66').modal('show');
    }
}

// Restrict input to 10 digits and display format guidance
document.getElementById("ChallanseriesAdd").addEventListener("input", function () {
    let inputField = document.getElementById("ChallanseriesAdd");
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

    // ✅ Read from DOM properly
    const state_id = document.getElementById('state').value;

    $.ajax({
        url: new URL('/jssl/seriesmaster/addChallanMaster', baseUrl),
        type: 'POST',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: jQuery.param({
            state_id: state_id,                                                  // ✅ real DB id
            created_by: createdById,
            invoice_series: document.getElementById('ChallanseriesAdd').value,   // ✅ from DOM
            start_date: document.getElementById('ChallanstartdateAdd').value,    // ✅ from DOM
            end_date: document.getElementById('ChallanenddateAdd').value         // ✅ from DOM
        }),
        success: function(data) {
            if (data.message === "Success") {

                // ✅ Store real state_id in sessionStorage
                sessionStorage.setItem('state_id', state_id);

                const popup = $('<div class="popup">Challan Series Master Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'challanseriesmaster.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Already Exists, Challan series details not added.';
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