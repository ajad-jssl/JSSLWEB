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
/*const baseUrl = 'http://localhost:8004';*/
document.getElementById("DebitenddateAdd").setAttribute("min", new Date().toISOString().split('T')[0]);

const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

document.addEventListener("DOMContentLoaded", function () {
	loadActions();
});
// Ensure the ID is available before making the API call
if (selectedFactoryId) {
    fetchdelivery();
	fetchAllDebitCreditSeries();
} else {
    console.error('No factory ID found in sessionStorage.');
}



async function fetchAllDebitCreditSeries() {
    try {
        const url = new URL('/jssl/seriesmaster/getAllDebitCreaditseries', baseUrl);

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch Debit/Credit series');

        const data = await response.json();

        if (data.status === 'yes' && Array.isArray(data.DebitCreditInfo)) {
            populateDebitCreditTable(data.DebitCreditInfo);
            document.getElementById('tableContainer').style.display = 'block';
        } else {
            clearDebitCreditTable();
            document.getElementById('tableContainer').style.display = 'none';
        }

    } catch (error) {
        console.error('Error loading Debit/Credit series:', error);
    }
}

async function fetchdelivery() {
	fetchSate();
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/seriesmaster/getAllDebitCredit`, baseUrl);
		//url.searchParams.append('factory_id', selectedFactoryId); 
		
        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.DebitCreditList.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("statedrop");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select State</option>`;
		selectElement.innerHTML =`<option value="All">All</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.DebitCreditList.forEach((type) => {
            if (type.state_id && type.state_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.state_id; // Backend keeps saleorder_id
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
        
        // Construct the API URL properly
        const url = new URL(`jssl/seriesmaster/getClosedDebitCredit`, baseUrl);
        
        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.ClosedDebitCreditList.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("state");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select State</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.ClosedDebitCreditList.forEach((type) => {
            if (type.state_id && type.state_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.state_id; // Backend keeps saleorder_id
                option.textContent = type.state_name; // Display saleorder_typename
				option.dataset.stateIds = String(type.state_ids); 
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

document.getElementById('statedrop').addEventListener('change', function () {
    const stateId = this.value;

    if (stateId === 'All') {
        fetchAllDebitCreditSeries();
    } else if (stateId) {
        fetchDebitCreditByState(stateId);
    }
});
/*// Function to fetch GST state information based on selected state ID
async function fetchGSTStateInfo(stateId) {
    try {
        // 1. Build both URLs
        const seriesUrl = new URL(`jssl/seriesmaster/getDebitCreditById`, baseUrl);
        seriesUrl.search = new URLSearchParams({ id: stateId }).toString();

        const typeUrl = new URL(`jssl/seriesmaster/getDebitCreditListNew`, baseUrl);

        // 2. Fetch both in parallel
        const [seriesRes, typeRes] = await Promise.all([
			fetch(seriesUrl, { credentials: "include" }),
			fetch(typeUrl, { credentials: "include" })
        ]);

        const seriesData = await seriesRes.json();
        const typeData = await typeRes.json();

        // 3. Extract usable lists
        const seriesList = Array.isArray(seriesData.DebitCreditInfo) ? seriesData.DebitCreditInfo : [];
        const typeList = Array.isArray(typeData.DebitCreditList) ? typeData.DebitCreditList : [];

        if (seriesList.length === 0) {
            console.warn("No data found for the selected state.");
            clearTable();
            document.getElementById('tableContainer').style.display = 'none';
            return;
        }

        // 4. Merge the lists using invoice_series as a key
        const mergedList = seriesList.map(series => {
            const matchingType = typeList.find(
                type => type.invoice_series === series.invoice_series
            );

            return {
                ...series,
                debitcredit_type: matchingType?.debitcredit_type || 'N/A' // fallback if not found
            };
        });

        // 5. Show table and populate it
        document.getElementById('tableContainer').style.display = 'block';
        populateTable(mergedList);

    } catch (error) {
        console.error("Error fetching GST state info:", error);
    }
}
*/

async function fetchDebitCreditByState(stateId) {
    try {
        const url = new URL('/jssl/seriesmaster/getDebitCreditById', baseUrl);
        url.search = new URLSearchParams({ id: stateId });

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (data.status === 'yes' && Array.isArray(data.DebitCreditInfo)) {
            populateDebitCreditTable(data.DebitCreditInfo);
            document.getElementById('tableContainer').style.display = 'block';
        } else {
            clearDebitCreditTable();
            document.getElementById('tableContainer').style.display = 'none';
        }

    } catch (error) {
        console.error("Error fetching Debit/Credit by state:", error);
    }
}




function populateDebitCreditTable(data) {

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
            <td>${item.debitcredittype || 'N/A'}</td>
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

function clearDebitCreditTable() {
    const tbody = document.querySelector('#tableID tbody');
    tbody.innerHTML = '<tr><td colspan="7">No data available.</td></tr>';
}

function openModalAdd() {

    const stateSelect = document.getElementById('state');
    const state = stateSelect.value.trim();
    const selectedOption = stateSelect.options[stateSelect.selectedIndex];

    // ✅ read stored state_id from data attribute
    const state_id = selectedOption?.dataset?.stateIds || '';

    const seriesNo = document.getElementById('DebitseriesAdd').value.trim();
    const sdate = document.getElementById('DebitstartdateAdd').value.trim();
    const edate = document.getElementById('DebitenddateAdd').value.trim();

    let showError = false;

    /* ---------- State Validation ---------- */
    if (state === '') {
        document.getElementById('productCodeErrorcredit').innerText = "Please select state.";
        document.getElementById('productCodeErrorcredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit').style.display = "none";
    }

    /* ---------- Series Number Validation ---------- */
    if (seriesNo === '') {
        document.getElementById('productCodeErrorcredit1').innerText = "Please enter series number.";
        document.getElementById('productCodeErrorcredit1').style.display = "inline-block";
        showError = true;
    } else if (!/^\d{10}$/.test(seriesNo)) {
        document.getElementById('productCodeErrorcredit1').innerText =
            "Series number must be exactly 10 digits.";
        document.getElementById('productCodeErrorcredit1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit1').style.display = "none";
    }

    /* ---------- ✅ Series must start with State ID ---------- */
    if (!showError && state_id) {
        if (!seriesNo.startsWith(state_id)) {
            document.getElementById('productCodeErrorcredit1').innerText =
                "Series number must start with selected State ID (" + state_id + ")";
            document.getElementById('productCodeErrorcredit1').style.display = "inline-block";
            showError = true;
        }
    }

    /* ---------- Start Date Validation ---------- */
    if (sdate === '') {
        document.getElementById('productCodeErrorcredit2').innerText = "Please enter start date.";
        document.getElementById('productCodeErrorcredit2').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit2').style.display = "none";
    }

    /* ---------- End Date Validation ---------- */
    if (edate === '') {
        document.getElementById('productCodeErrorcredit3').innerText = "Please enter end date.";
        document.getElementById('productCodeErrorcredit3').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit3').style.display = "none";
    }

    /* ---------- Final Submit ---------- */
    if (!showError) {
        console.log("Selected state_id for Debit/Credit:", state_id);
        $('#exampleModalCenter66').modal('show');
    }
}


// Restrict input to 10 digits and display format guidance
document.getElementById("DebitseriesAdd").addEventListener("input", function () {
    let inputField = document.getElementById("DebitseriesAdd");
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
  //const state_id        = $('#state').val();                  // or document.getElementById('state').value
  const state_id = $('#state').find(':selected').data('state-ids');
  const invoice_series  = $('#DebitseriesAdd').val().trim();
  const start_date      = $('#DebitstartdateAdd').val().trim();
  const end_date        = $('#DebitenddateAdd').val().trim();
  const debitcredit_type= $('#DebittypeAdd').val().trim();
  const created_by      = createdById;                        // provided elsewhere

  /* Optional quick validation */
  if (!state_id || !invoice_series || !start_date || !debitcredit_type) {
    $('#errorMessage').text('Please fill in all required fields.');
    $('#exampleModalCenterDup').modal('show');
    return;
  }

  /* Bundle everything exactly as the backend column names expect */
  const payload = {
    state_id,
    created_by,
    debitcredit_type,
    invoice_series,
    start_date,
    end_date
  };

  $.ajax({
    url         : new URL('/jssl/seriesmaster/addDebitCreditMaster', baseUrl),
    type        : 'POST',
    dataType    : 'json',      
	xhrFields: {
		    withCredentials: true
		},                              // —— we expect JSON back
    contentType : 'application/x-www-form-urlencoded; charset=UTF-8', // ★ keep form format
    data        : $.param(payload),                          // ★ encode obj → state_id=…&…
    success     : handleResponse,
    error       : () => console.error('Request failed.')
  });

  function handleResponse(data) {
    const result = data.message;

    if (result === 'Success') {
      $('<div class="popup">Debit-credit Series Master created successfully!</div>')
        .appendTo('body').hide().fadeIn(400)
        .delay(800)
        .fadeOut(400, function () {
          $(this).remove();
          window.location = 'debitcreditseriesmaster.jsp';
        });

    } else {
      const errorMessage = data.message || 'Series Invoice No is Already exists';
      $('#errorMessage').text(errorMessage);
      $('#exampleModalCenterDup').modal('show');
    }
  }
}


function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
}	