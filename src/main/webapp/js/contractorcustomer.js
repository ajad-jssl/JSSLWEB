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
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	$('#exampleModalScrollableIN').modal('show');
});

document.getElementById("#modalScroll1").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableCon').modal('hide');
	  return;
	}
	$('#exampleModalScrollableCon').modal('show');
});

// Fetch selectedFactoryId from sessionStorage
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

document.addEventListener("DOMContentLoaded", function () {
	loadActions();
});
// Ensure the ID is available before making the API call
/*if (selectedFactoryId) {
    fetchUserList();
    fetchUserList11();
} else {
    console.error('No factory ID found in sessionStorage.');
}*/

// Function to fetch the list of users/vendors based on the selected factory ID
async function fetchUserList() {

    try {

        // API URL
        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddress`, baseUrl);

        // FETCH DATA
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const json = await response.json();

        // TABLE HEADER
        let tableContent = `
            <thead>
                <tr>
                    <th>Invoice Address</th>
                    <th>Country Name</th>
                    <th>City</th>
                    <th>District</th>
                    <th>Pin No</th>
                    <th>State Name</th>
                    <th>Pan No</th>
                    <th>GST No</th>
                    <th>Edit</th>
                    <th>Verify</th>
                    <th>Release</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.InvoiceAddress.forEach(item => {

            const isVerified = Number(item.is_verified) === 1;
            const isReleased = Number(item.is_released) === 1;

            // Disable actions only when verified and not released
            const disableActions = isVerified && !isReleased;

            tableContent += `
                <tr>

                    <td>${item.address || ''}</td>

                    <td>${item.country_name || ''}</td>

                    <td>${item.city || ''}</td>

                    <td>${item.district || ''}</td>

                    <td>${item.pin_no || ''}</td>

                    <td>${item.state_name || ''}</td>

                    <td>${item.pan_no || ''}</td>

                    <td>${item.gst_no || ''}</td>


                    <!-- EDIT COLUMN -->
                    <td align="center">

                        ${
                            disableActions

                            ? `
                                <i class="fa fa-pen"
                                   title="Verified record cannot be edited"
                                   style="
                                       color: grey;
                                       cursor: not-allowed;
                                       opacity: 0.5;
                                       pointer-events: none;
                                   ">
                                </i>
                              `

                            : `
                                <i class="fa fa-pen"
                                   title="Edit"
                                   style="
                                       cursor: pointer;
                                       color: black;
                                   "
                                   onclick="editRecord('${item.id}')">
                                </i>
                              `
                        }

                    </td>


                    <!-- VERIFY COLUMN -->
                    <td align="center">

                        ${
                            disableActions

                            ? `
                                <span class="badge badge-success">
                                    Verified
                                </span>
                              `

                            : `
                                <i class="fa fa-check-circle"
                                   title="Verify"
                                   style="
                                       cursor: pointer;
                                       color: orange;
                                       font-size: 16px;
                                   "
                                   onclick="verifyRecord('${item.id}')">
                                </i>
                              `
                        }

                    </td>


                    <!-- RELEASE COLUMN -->
                    <td align="center">

                        ${
                            isVerified && !isReleased

                            ? `
                                <i class="fa fa-unlock"
                                   title="Release For Update"
                                   style="
                                       cursor: pointer;
                                       color: red;
                                       font-size: 16px;
                                   "
                                   onclick="releaseRecord('${item.id}')">
                                </i>
                              `

                            : `
                                <span class="badge badge-secondary">
                                    Open
                                </span>
                              `
                        }

                    </td>

                </tr>
            `;
        });

        tableContent += `</tbody>`;

        // LOAD TABLE
        $("#tableID").html(tableContent);

        // DATATABLE
        $("#tableID").DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: true,
            paging: true,
            destroy: true,
            buttons: [
                {
                    extend: 'excel',
                    text: 'Export to Excel',
                    title: 'List',
                }
            ]
        });

    } catch (error) {

        console.error('Error fetching vendor data:', error);
    }
}

async function fetchUserList11() {

    try {

        // API URL
        const url = new URL(
            `/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`,
            baseUrl
        );

        // FETCH DATA
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const json = await response.json();

        // TABLE HEADER
        let tableContent = `
            <thead>
                <tr>
                    <th>Consignee Address</th>
                    <th>Country Name</th>
                    <th>City</th>
                    <th>District</th>
                    <th>Pin No</th>
                    <th>State Name</th>
                    <th>Pan No</th>
                    <th>GST No</th>
                    <th>Edit</th>
                    <th>Verify</th>
                    <th>Release</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.ConsigneeAddress.forEach(item => {

            const isVerified = Number(item.is_verified) === 1;
            const isReleased = Number(item.is_release) === 1;

            // Disable edit/verify only when verified and not released
            const disableActions = isVerified && !isReleased;

            tableContent += `
                <tr>

                    <td>${item.address || ''}</td>

                    <td>${item.country_name || ''}</td>

                    <td>${item.city || ''}</td>

                    <td>${item.district || ''}</td>

                    <td>${item.pin_no || ''}</td>

                    <td>${item.state_name || ''}</td>

                    <td>${item.pan_no || ''}</td>

                    <td>${item.gst_no || ''}</td>


                    <!-- EDIT COLUMN -->
                    <td align="center">

                        ${
                            disableActions

                            ? `
                                <i class="fa fa-pen"
                                   title="Verified record cannot be edited"
                                   style="
                                       color: grey;
                                       cursor: not-allowed;
                                       opacity: 0.5;
                                       pointer-events: none;
                                   ">
                                </i>
                              `

                            : `
                                <i class="fa fa-pen"
                                   title="Edit"
                                   style="
                                       cursor: pointer;
                                       color: black;
                                   "
                                   onclick="editRecord1('${item.id}')">
                                </i>
                              `
                        }

                    </td>


                    <!-- VERIFY COLUMN -->
                    <td align="center">

                        ${
                            disableActions

                            ? `
                                <span class="badge badge-success">
                                    Verified
                                </span>
                              `

                            : `
                                <i class="fa fa-check-circle"
                                   title="Verify"
                                   style="
                                       cursor: pointer;
                                       color: orange;
                                       font-size: 16px;
                                   "
                                   onclick="verifyRecordCon('${item.id}')">
                                </i>
                              `
                        }

                    </td>


                    <!-- RELEASE COLUMN -->
                    <td align="center">

                        ${
                            isVerified && !isReleased

                            ? `
                                <i class="fa fa-unlock"
                                   title="Release For Update"
                                   style="
                                       cursor: pointer;
                                       color: red;
                                       font-size: 16px;
                                   "
                                   onclick="releaseRecordCon('${item.id}')">
                                </i>
                              `

                            : `
                                <span class="badge badge-secondary">
                                    Open
                                </span>
                              `
                        }

                    </td>

                </tr>
            `;
        });

        tableContent += `</tbody>`;

        // LOAD TABLE
        $("#tableID1").html(tableContent);

        // DATATABLE
        $("#tableID1").DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: true,
            paging: true,
            destroy: true,
            buttons: [
                {
                    extend: 'excel',
                    text: 'Export to Excel',
                    title: 'Consignee Address List',
                }
            ]
        });

    } catch (error) {

        console.error('Error fetching consignee data:', error);
    }
}

/*function onDeliveredOrderTabClick() {
	fetchUserList11();
	setTimeout(() => {
		$('#tableID1_wrapper .dataTables_scrollHeadInner th').click();
	}, 200);
}*/

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypes();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchSaleOrderTypes() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/state/getAllStatesNew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.StateDetailsNew.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("stateDropdown");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select state</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.StateDetailsNew.forEach((type) => {
            if (type.id && type.state_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.state_id;  // Backend keeps saleorder_id
                option.textContent = type.state_name +'-'+ type.state_id;
				option.dataset.stateId = String(type.state_id);
 // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypescon();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchSaleOrderTypescon() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/state/getAllStatesNew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.StateDetailsNew.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("state");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select state</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.StateDetailsNew.forEach((type) => {
            if (type.id && type.state_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.state_id;  // Backend keeps saleorder_id
                option.textContent = type.state_name +"-" +type.state_id;
				option.dataset.stateId = String(type.state_id); // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchCountry();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchCountry() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/country/getAllCountryListNew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.AllCountryDetailsNew.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("con");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Country</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.AllCountryDetailsNew.forEach((type) => {
            if (type.id && type.country_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.country_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchCountrycon();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchCountrycon() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/country/getAllCountryListNew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.AllCountryDetailsNew.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("concon");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Country</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.AllCountryDetailsNew.forEach((type) => {
            if (type.id && type.country_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.country_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchCountryinup();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchCountryinup() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/country/getAllCountryListNew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.AllCountryDetailsNew.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("conup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Country</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.AllCountryDetailsNew.forEach((type) => {
            if (type.id && type.country_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.country_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchsataeupin();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchsataeupin() {

    try {

        const url = new URL(`/jssl/state/getAllStatesNew`, baseUrl);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch states");
        }

        const json = await response.json();

        if (json.status !== "yes" || !json.StateDetailsNew.length) {
            console.warn("No states found.");
            return;
        }

        const selectElement = document.getElementById("stateDropdownup");

        selectElement.innerHTML = `<option value="">Select state</option>`;

        json.StateDetailsNew.forEach((type) => {

            if (type.state_id && type.state_name) {

                const option = document.createElement("option");

                // IMPORTANT FIX
                option.value = type.state_id;

                option.textContent =
                    type.state_name + "-" + type.state_id;

                selectElement.appendChild(option);
            }
        });

    } catch (error) {

        console.error("Error fetching states:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchCountryconup();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchCountryconup() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/country/getAllCountryListNew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.AllCountryDetailsNew.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("conconup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Country</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.AllCountryDetailsNew.forEach((type) => {
            if (type.id && type.country_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.country_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchsataeupcon();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchsataeupcon() {

    try {

        // API URL
        const url = new URL(`/jssl/state/getAllStatesNew`, baseUrl);

        // FETCH API
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch states");
        }

        const json = await response.json();

        // VALIDATION
        if (json.status !== "yes" || !json.StateDetailsNew.length) {

            console.warn("No states found.");

            return;
        }

        // SELECT ELEMENT
        const selectElement = document.getElementById("stateup");

        // CLEAR OLD OPTIONS
        selectElement.innerHTML =
            `<option value="">Select state</option>`;

        // BIND OPTIONS
        json.StateDetailsNew.forEach((type) => {

            // IMPORTANT FIX
            if (type.state_id && type.state_name) {

                const option = document.createElement("option");

                // CORRECT VALUE
                option.value = type.state_id;

                // DISPLAY TEXT
                option.textContent =
                    type.state_name + "-" + type.state_id;

                option.dataset.stateId =
                    String(type.state_id);

                selectElement.appendChild(option);
            }
        });

    } catch (error) {

        console.error("Error fetching states:", error);
    }
}

function openModalAddInvoice() {
    var username = document.getElementById('categoryPrefix').value.trim();
    var password = document.getElementById('con').value.trim();
    var code = document.getElementById('inputNamebar').value.trim();
    var state = document.getElementById('disc').value.trim();
    var pin_no = document.getElementById('pin').value.trim();
    var pan = document.getElementById('pan').value.trim();
    var gst = document.getElementById('gst').value.trim();
	const stateSelect = document.getElementById('stateDropdown');
	const stateDropdown = stateSelect.value.trim();

	const selectedOption = stateSelect.options[stateSelect.selectedIndex];

	// read state_id from data attribute
	const state_id = selectedOption && selectedOption.dataset
	    ? selectedOption.dataset.stateId || ''
	    : '';
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditss32').innerText = "Please enter invoice address.";
        document.getElementById('productCodeErrorcreditss32').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss32').innerText = "";
        document.getElementById('productCodeErrorcreditss32').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErrorcreditss31').innerText = "Please select country.";
        document.getElementById('productCodeErrorcreditss31').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss31').innerText = "";
        document.getElementById('productCodeErrorcreditss31').style.display = "none";
    }
    
    if (code === '') {
        document.getElementById('productCodeErrorcreditss35').innerText = "Please enter city .";
        document.getElementById('productCodeErrorcreditss35').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss35').innerText = "";
        document.getElementById('productCodeErrorcreditss35').style.display = "none";
    }
    
    if (state === '') {
        document.getElementById('productCodeErrorcreditss30').innerText = "Please enter District.";
        document.getElementById('productCodeErrorcreditss30').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss30').innerText = "";
        document.getElementById('productCodeErrorcreditss30').style.display = "none";
    }
    
    if (pin_no === '' || pin_no.length !== 6) {
        document.getElementById('productCodeErrorcreditsspin').innerText = "Please enter valid 6 digit pin no.";
        document.getElementById('productCodeErrorcreditsspin').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsspin').innerText = "";
        document.getElementById('productCodeErrorcreditsspin').style.display = "none";
    }
    
    if (pan === '' || pan.length !== 10) {
        document.getElementById('productCodeErrorcreditsspan').innerText = "Please enter a valid 10-character PAN number (e.g., ABCDE1234F).";
        document.getElementById('productCodeErrorcreditsspan').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsspan').innerText = "";
        document.getElementById('productCodeErrorcreditsspan').style.display = "none";
    }
    
    if (gst === '' || gst.length !== 15) {
        document.getElementById('productCodeErrorcreditssgst').innerText = "Please enter a valid 15-character GSTIN (e.g., 29ABCDE1234F1Z5)";
        document.getElementById('productCodeErrorcreditssgst').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditssgst').innerText = "";
        document.getElementById('productCodeErrorcreditssgst').style.display = "none";
    }
    
	// GST state-code validation
	if (!showError && state_id) {
	    if (!gst.toUpperCase().startsWith(state_id)) {
	        document.getElementById('productCodeErrorcreditssgst').innerText =
	            "GST must start with the selected state's code (" + state_id + ")";
	        document.getElementById('productCodeErrorcreditssgst').style.display = "inline-block";
	        showError = true;
	    }
	}

    if (stateDropdown === '') {
        document.getElementById('productCodeErrorcreditss344').innerText = "Please select state.";
        document.getElementById('productCodeErrorcreditss344').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss344').innerText = "";
        document.getElementById('productCodeErrorcreditss344').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addevent() {
	$('#exampleModalCenter66').modal('hide'); 

    // ✅ Always set BOTH flags to 1
    var isInvoice   = 1;
    var isConsignee = 1;

    // ✅ Get all field values safely via getElementById
    var nameOfAdd  = document.getElementById('nameOfAdd').value;
    var add1       = document.getElementById('categoryPrefix').value;
    var add2       = document.getElementById('categoryPrefixLine2').value;
    var city       = document.getElementById('inputNamebar').value;
    var district   = document.getElementById('disc').value;
    var stateId    = document.getElementById('stateDropdown').value;
    var countryId  = document.getElementById('con').value;
    var gstNo      = document.getElementById('gst').value;
    var pinNo      = document.getElementById('pin').value;
    var panNo      = document.getElementById('pan').value;

    $.ajax({
        url: new URL(
            '/jssl/invoiceConsigneeAddress/addInvoiceConsigneeAddress',
            baseUrl
        ),
        type: 'POST',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: jQuery.param({
            name_of_add  : nameOfAdd,
            add1         : add1,
            add2         : add2,
            city         : city,
            district     : district,
            state_id     : stateId,
            country_id   : countryId,
            created_by   : createdById,
            is_invoice   : isInvoice,
            is_consignee : isConsignee,
            gst_no       : gstNo,
            pin_no       : pinNo,
            pan_no       : panNo
        }),
        success: function(data) {
            if (data.message === "Success") {
				// ✅ Hide confirmation modal first
				       $('#exampleModalCenter66').modal('hide');
                const popup = $(
                    '<div class="popup">Invoice Address Created & Auto-Copied to Consignee!</div>'
                ).appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'contractcustomer.jsp';
                    });
                }, 800);

            } else {
                const errorMessage =
                    data.message || 'Failed to create Invoice address.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenter66').modal('hide');
                $('#exampleModalCenterDup').modal('show');
            }
        },
        error: function() {
            console.error('Request failed.');
        }
    });
}

function openModalAddCon() {
    var username = document.getElementById('conadd').value.trim();
    var password = document.getElementById('concon').value.trim();
    var code = document.getElementById('city').value.trim();
    var state = document.getElementById('disctt').value.trim();
    var state1 = document.getElementById('pinno').value.trim();
    var pan = document.getElementById('panno').value.trim();
    var gst = document.getElementById('gstno').value.trim();
	const stateSelect = document.getElementById('state');
	const stateDropdown = stateSelect.value.trim();

	const selectedOption = stateSelect.options[stateSelect.selectedIndex];

	// 🔥 same logic as other forms
	const state_id = selectedOption && selectedOption.dataset
	    ? selectedOption.dataset.stateId || ''
	    : '';
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditsscon').innerText = "Please enter invoice address.";
        document.getElementById('productCodeErrorcreditsscon').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsscon').innerText = "";
        document.getElementById('productCodeErrorcreditsscon').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErrorcreditssconcon').innerText = "Please select country.";
        document.getElementById('productCodeErrorcreditssconcon').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditssconcon').innerText = "";
        document.getElementById('productCodeErrorcreditssconcon').style.display = "none";
    }
    
    if (code === '') {
        document.getElementById('productCodeErrorcreditsscity').innerText = "Please enter city .";
        document.getElementById('productCodeErrorcreditsscity').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsscity').innerText = "";
        document.getElementById('productCodeErrorcreditsscity').style.display = "none";
    }
    
    if (state === '') {
        document.getElementById('productCodeErrorcreditssdist').innerText = "Please enter District.";
        document.getElementById('productCodeErrorcreditssdist').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditssdist').innerText = "";
        document.getElementById('productCodeErrorcreditssdist').style.display = "none";
    }
    
    if (state1 === '' || state1.length !== 6) {
        document.getElementById('productCodeErrorcreditsspinno').innerText = "Please enter valid 6 digits pin no.";
        document.getElementById('productCodeErrorcreditsspinno').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsspinno').innerText = "";
        document.getElementById('productCodeErrorcreditsspinno').style.display = "none";
    }
    
    if (pan === ''|| pan.length !== 10) {
        document.getElementById('productCodeErrorcreditsspanno').innerText = "Please enter a valid 10-character PAN number (e.g., ABCDE1234F).";
        document.getElementById('productCodeErrorcreditsspanno').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsspanno').innerText = "";
        document.getElementById('productCodeErrorcreditsspanno').style.display = "none";
    }
    
    if (gst === '' || gst.length !== 15) {
        document.getElementById('productCodeErrorcreditssgstno').innerText = "Please enter a valid 15-character GSTIN (e.g., 29ABCDE1234F1Z5)";
        document.getElementById('productCodeErrorcreditssgstno').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditssgstno').innerText = "";
        document.getElementById('productCodeErrorcreditssgstno').style.display = "none";
    }
	
	// 🔥 GST state-code validation (CONSIGNEE)
	if (!showError && state_id) {
	    if (!gst.toUpperCase().startsWith(state_id)) {
	        document.getElementById('productCodeErrorcreditssgstno').innerText =
	            "GST must start with the selected state's ID (" + state_id + ")";
	        document.getElementById('productCodeErrorcreditssgstno').style.display = "inline-block";
	        showError = true;
	    }
	}

    
    if (stateDropdown === '') {
        document.getElementById('productCodeErrorcreditssstate').innerText = "Please select state.";
        document.getElementById('productCodeErrorcreditssstate').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditssstate').innerText = "";
        document.getElementById('productCodeErrorcreditssstate').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66con').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addeventCon() {
	 $('#exampleModalCenter66con').modal('hide');
    // Validate role code and role description
     var isInvoice = document.getElementById("invoiceRadio").checked ? 1 : 0;
    var isConsignee = document.getElementById("consigneeRadio").checked ? 1 : 0;
    $.ajax({
        url: new URL('/jssl/invoiceConsigneeAddress/addInvoiceConsigneeAddress', baseUrl), // Move 'const' to the correct place
        type: 'POST',
        dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
			data: jQuery.param({
			    name_of_add: document.getElementById('nameOfAddCon').value,
			    add1: document.getElementById('conadd').value,
			    add2: document.getElementById('conaddLine2').value,
			    city: city.value,
			    district: disctt.value,
			    state_id: state.value,
			    country_id: concon.value,
			    created_by: createdById,
			    is_invoice: isInvoice,
			    is_consignee: isConsignee,
			    gst_no: gstno.value,
			    pin_no: pinno.value,
			    pan_no: panno.value
			}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Consignee Address Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'contractcustomer.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create Consignee address.';
                $('#errorMessagecon').text(errorMessage); // Set the error message dynamically
				$('#exampleModalCenter66con').modal('hide');
                $('#exampleModalCenterDupcon').modal('show'); // Show the modal with the error message
            }
        },
        error: function() {
            // Handle AJAX error
            console.error('Request failed.');
        }
    });
}


let originalEditData = {};

function editRecord(id) {

    const allowed = allowedActions || [];

    // Permission check
    if (!allowed.includes("Edit")) {
        alert("You do not have permission to edit.");
        return;
    }

    // Safe null handling function
	function safeValue(value) {
	    if (value === null || value === undefined || value === "null") return '';
	    return value.toString().trim();
	}

    // Create API URL
    const url = new URL('/jssl/invoiceConsigneeAddress/getAddressById', baseUrl);

    var params = [
        ['address_id', id]
    ];

    url.search = new URLSearchParams(params).toString();

    // API call
    fetch(url, {
        credentials: "include"
    })
    .then(function(response) {

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    })
	.then(function(response) {

	    console.log("Edit Response :", response);

	    // Split address by newline into 3 parts
	    var addressParts = (response.address || '').split('\n');
	    var namePart  = (addressParts[0] || '').trim();
	    var add1Part  = (addressParts[1] || '').trim();
	    var add2Part  = (addressParts[2] || '').trim();

	    // Store original values
	    originalEditData = {
	        name_of_add : namePart,
	        add1        : add1Part,
	        add2        : add2Part,
	        country_id  : safeValue(response.country_id),
	        city        : safeValue(response.city),
	        district    : safeValue(response.district),
	        pin_no      : safeValue(response.pin_no),
	        pan_no      : safeValue(response.pan_no),
	        gst_no      : safeValue(response.gst_no),
	        state_id    : safeValue(response.state_id)
	    };

	    // Bind to 3 separate inputs
	    $('#nameOfAddup').val(namePart);
	    $('#categoryPrefixup').val(add1Part);
	    $('#categoryPrefixupLine2').val(add2Part);

	    // Country dropdown
	    $('#conup').val(safeValue(response.country_id));

	    // State — use state_id if available, else try to match by name
	    if (response.state_id) {
	        $('#stateDropdownup').val(safeValue(response.state_id));
	    } else if (response.state_name) {
	        // Try matching option text that starts with state_name
	        $('#stateDropdownup option').each(function() {
	            if ($(this).text().toUpperCase().startsWith(response.state_name.toUpperCase())) {
	                $('#stateDropdownup').val($(this).val());
	                return false; // break
	            }
	        });
	    }

	    $('#inputNamebarup').val(safeValue(response.city));
	    $('#discup').val(safeValue(response.district));
	    $('#pinup').val(safeValue(response.pin_no));
	    $('#panup').val(safeValue(response.pan_no));
	    $('#gstup').val(safeValue(response.gst_no));
	    $('#inid').val(safeValue(response.id));

	    // Open modal
	    $('#exampleModalScrollableINUp').modal('show');
	})
    .catch(function(error) {

        console.error('Error while fetching edit data:', error);

        alert('Unable to fetch address details for editing.');
    });
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let originalConsigneeEditData = {};

function editRecord1(id) {

    const allowed = allowedActions || [];

    // Permission check
    if (!allowed.includes("Edit")) {

        alert("You do not have permission to edit.");

        return;
    }

    // Safe null handling
    function safeValue(value) {

        if (
            value === null ||
            value === undefined ||
            value === "null"
        ) {
            return '';
        }

        return value.toString().trim();
    }

    // API URL
    const url = new URL(
        '/jssl/invoiceConsigneeAddress/getAddressById',
        baseUrl
    );

    var params = [
        ['address_id', id]
    ];

    url.search = new URLSearchParams(params).toString();

    // FETCH API
    fetch(url, {

        credentials: "include"

    })
    .then(function(response) {

        if (!response.ok) {

            throw new Error('Network response was not ok');
        }

        return response.json();
    })
	.then(function(response) {

	    console.log("Consignee Edit Response :", response);

	    // Split address by newline into 3 parts
	    var addressParts = (response.address || '').split('\n');
	    var namePart  = (addressParts[0] || '').trim();
	    var add1Part  = (addressParts[1] || '').trim();
	    var add2Part  = (addressParts[2] || '').trim();

	    // Store original values
	    originalConsigneeEditData = {
	        name_of_add : namePart,
	        add1        : add1Part,
	        add2        : add2Part,
	        country_id  : safeValue(response.country_id),
	        city        : safeValue(response.city),
	        district    : safeValue(response.district),
	        pin_no      : safeValue(response.pin_no),
	        pan_no      : safeValue(response.pan_no),
	        gst_no      : safeValue(response.gst_no),
	        state_id    : safeValue(response.state_id)
	    };

	    // Bind to 3 separate inputs
	    $('#nameOfAddConup').val(namePart);
	    $('#conaddup').val(add1Part);
	    $('#conaddupLine2').val(add2Part);

	    // Country dropdown
	    $('#conconup').val(safeValue(response.country_id));

	    // State — use state_id if available, else try to match by name
	    if (response.state_id) {
	        $('#stateup').val(safeValue(response.state_id));
	    } else if (response.state_name) {
	        $('#stateup option').each(function() {
	            if ($(this).text().toUpperCase().startsWith(response.state_name.toUpperCase())) {
	                $('#stateup').val($(this).val());
	                return false;
	            }
	        });
	    }

	    $('#cityup').val(safeValue(response.city));
	    $('#discttup').val(safeValue(response.district));
	    $('#pinnoup').val(safeValue(response.pin_no));
	    $('#pannoup').val(safeValue(response.pan_no));
	    $('#gstnoup').val(safeValue(response.gst_no));
	    $('#conid').val(safeValue(response.id));

	    // Open modal
	    $('#exampleModalScrollableConUp').modal('show');
	})
    .catch(function(error) {

        console.error(
            'Error while fetching consignee edit data:',
            error
        );

        alert(
            'Unable to fetch consignee address details for editing.'
        );
    });
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function openModalUpdateInvoice() {
    var username = document.getElementById('categoryPrefixup').value.trim();
    var password = document.getElementById('conup').value.trim();
    var code = document.getElementById('inputNamebarup').value.trim();
    var state = document.getElementById('discup').value.trim();
    var pin_code_up = document.getElementById('pinup').value.trim();
    var pan = document.getElementById('panup').value.trim();
    var gst = document.getElementById('gstup').value.trim();
	const stateSelect = document.getElementById('stateDropdownup');
	const stateDropdown = stateSelect.value.trim();

	const selectedOption = stateSelect.options[stateSelect.selectedIndex];

	// 🔥 SAME LOGIC AS EDIT
	const state_id = selectedOption && selectedOption.dataset
	    ? selectedOption.dataset.stateId || ''
	    : '';
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditss32up').innerText = "Please enter invoice address.";
        document.getElementById('productCodeErrorcreditss32up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss32up').innerText = "";
        document.getElementById('productCodeErrorcreditss32up').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErrorcreditss31up').innerText = "Please select country.";
        document.getElementById('productCodeErrorcreditss31up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss31up').innerText = "";
        document.getElementById('productCodeErrorcreditss31up').style.display = "none";
    }
    
    if (code === '') {
        document.getElementById('productCodeErrorcreditss35up').innerText = "Please enter city .";
        document.getElementById('productCodeErrorcreditss35up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss35up').innerText = "";
        document.getElementById('productCodeErrorcreditss35up').style.display = "none";
    }
    
    if (state === '') {
        document.getElementById('productCodeErrorcreditss30up').innerText = "Please enter District.";
        document.getElementById('productCodeErrorcreditss30up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss30up').innerText = "";
        document.getElementById('productCodeErrorcreditss30up').style.display = "none";
    }
    
    if (pin_code_up === '' || pin_code_up.length !==6) {
        document.getElementById('productCodeErrorcreditsspinup').innerText = "Please enter  valid 6 digits pin no.";
        document.getElementById('productCodeErrorcreditsspinup').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsspinup').innerText = "";
        document.getElementById('productCodeErrorcreditsspinup').style.display = "none";
    }
    
    if (pan === '' || pan.length  !==10) {
        document.getElementById('productCodeErrorcreditsspanup').innerText = "Please enter a valid 10-character PAN number (e.g., ABCDE1234F).";
        document.getElementById('productCodeErrorcreditsspanup').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsspanup').innerText = "";
        document.getElementById('productCodeErrorcreditsspanup').style.display = "none";
    }
    
    if (gst === '' || gst.length !==15) {
        document.getElementById('productCodeErrorcreditssgstup').innerText = "Please enter a valid 15-character GSTIN (e.g., 29ABCDE1234F1Z5)";
        document.getElementById('productCodeErrorcreditssgstup').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditssgstup').innerText = "";
        document.getElementById('productCodeErrorcreditssgstup').style.display = "none";
    }
	if (!showError && state_id) {
	    if (!gst.toUpperCase().startsWith(state_id)) {
	        document.getElementById('productCodeErrorcreditssgstup').innerText =
	            "GST must start with the selected state's ID (" + state_id + ")";
	        document.getElementById('productCodeErrorcreditssgstup').style.display = "inline-block";
	        showError = true;
	    }
	}
    
    if (stateDropdown === '') {
        document.getElementById('productCodeErrorcreditss344up').innerText = "Please select state.";
        document.getElementById('productCodeErrorcreditss344up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss344up').innerText = "";
        document.getElementById('productCodeErrorcreditss344up').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66inupdate').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addeventINupdate() {
	$('#exampleModalCenter66inupdate').modal('hide');
    // Get current values from UI
	const currentData = {
	    name_of_add: $('#nameOfAddup').val().trim(),
	    add1: $('#categoryPrefixup').val().trim(),
	    add2: $('#categoryPrefixupLine2').val().trim(),
	    country_id: $('#conup').val().trim(),
	    city: $('#inputNamebarup').val().trim(),
	    district: $('#discup').val().trim(),
	    pin_no: $('#pinup').val().trim(),
	    pan_no: $('#panup').val().trim(),
	    gst_no: $('#gstup').val().trim(),
	    state_id: $('#stateDropdownup').val().trim()
	};

    // Compare with original values
    const isChanged = Object.keys(originalEditData).some(key => {
        return (originalEditData[key] || '') !== (currentData[key] || '');
    });

    // ❌ No change → skip update
    if (!isChanged) {
		
			const popup = $('<div class="popup">No fields changes.</div>')
			                 .appendTo('body').hide().fadeIn(400);

			             setTimeout(function() {
			                 popup.fadeOut(400, function() {
			                     $(this).remove();
			                     window.location = 'contractcustomer.jsp'; // Redirect to role list page
			                 });
			             }, 1000);
/*        $('#exampleModalCenterDup').modal('show');*/

$("#exampleModalCenter66inupdate").modal('hide');
        return;
    }

    // ✅ Change detected → call update method
    addeventINupdateupdate(currentData);
}



function addeventINupdateupdate() {
    // Validate role code and role description
	$.ajax({

	    url: new URL(
	        '/jssl/invoiceConsigneeAddress/updateInvoiceConsigneeAddressNew',
	        baseUrl
	    ),

	    type: 'POST',

	    dataType: 'json',

	    xhrFields: {
	        withCredentials: true
	    },

		data: {
		    name_of_add: $('#nameOfAddup').val(),
		    add1: $('#categoryPrefixup').val(),
		    add2: $('#categoryPrefixupLine2').val(),
		    city: $('#inputNamebarup').val(),
		    district: $('#discup').val(),
		    state_id: $('#stateDropdownup').val(),
		    country_id: $('#conup').val(),
		    modified_by: createdById,
		    gst_no: $('#gstup').val(),
		    pin_no: $('#pinup').val(),
		    pan_no: $('#panup').val(),
		    address_id: $('#inid').val()
		},

	    success: function(data) {

	        console.log(data);

	        if (data.message === "Success") {
				$("#exampleModalCenter66inupdate").modal('hide');
	            const popup = $('<div class="popup">Invoice Address Updated Successfully!</div>')
	                .appendTo('body')
	                .hide()
	                .fadeIn(400);

	            setTimeout(function() {

	                popup.fadeOut(400, function() {

	                    $(this).remove();

	                    window.location = 'contractcustomer.jsp';
	                });

	            }, 800);

	        } else {

	            $('#errorMessageup').text(
	                data.message || 'Invoice Address Not Updated'
	            );

	            $('#exampleModalCenterDupUP').modal('show');

	            $('#exampleModalCenter66inupdate').modal('hide');
	        }
	    },

	    error: function(xhr) {

	        console.error(xhr.responseText);

	        alert("Request failed.");
	    }
	});
}

function openModalAddConUP() {
    var username = document.getElementById('conaddup').value.trim();
    var password = document.getElementById('conconup').value.trim();
    var code = document.getElementById('cityup').value.trim();
    var district = document.getElementById('discttup').value.trim();
    var pin = document.getElementById('pinnoup').value.trim();
    var pan = document.getElementById('pannoup').value.trim();
    var gst = document.getElementById('gstnoup').value.trim();

    const stateSelect = document.getElementById('stateup');
    const stateDropdown = stateSelect.value.trim();
    const selectedOption = stateSelect.options[stateSelect.selectedIndex];
    const state_id = selectedOption?.dataset?.stateId || '';

    let showError = false;

    // Invoice Address
    if (!username) {
        showError = true;
        document.getElementById('productCodeErrorcreditssconup').innerText = "Please enter invoice address.";
        document.getElementById('productCodeErrorcreditssconup').style.display = "inline-block";
    } else {
        document.getElementById('productCodeErrorcreditssconup').style.display = "none";
    }

    // Country
    if (!password) {
        showError = true;
        document.getElementById('productCodeErrorcreditssconconup').innerText = "Please select country.";
        document.getElementById('productCodeErrorcreditssconconup').style.display = "inline-block";
    } else {
        document.getElementById('productCodeErrorcreditssconconup').style.display = "none";
    }

    // City
    if (!code) {
        showError = true;
        document.getElementById('productCodeErrorcreditsscityup').innerText = "Please enter city.";
        document.getElementById('productCodeErrorcreditsscityup').style.display = "inline-block";
    } else {
        document.getElementById('productCodeErrorcreditsscityup').style.display = "none";
    }

    // District
    if (!district) {
        showError = true;
        document.getElementById('productCodeErrorcreditssdistup').innerText = "Please enter district.";
        document.getElementById('productCodeErrorcreditssdistup').style.display = "inline-block";
    } else {
        document.getElementById('productCodeErrorcreditssdistup').style.display = "none";
    }

    // PIN
    if (!pin || pin.length !== 6) {
        showError = true;
        document.getElementById('productCodeErrorcreditsspinnoup').innerText = "Please enter 6 digit PIN.";
        document.getElementById('productCodeErrorcreditsspinnoup').style.display = "inline-block";
    } else {
        document.getElementById('productCodeErrorcreditsspinnoup').style.display = "none";
    }

    // PAN
    if (!pan || pan.length !== 10) {
        showError = true;
        document.getElementById('productCodeErrorcreditsspannoup').innerText = "Enter valid PAN (10 characters).";
        document.getElementById('productCodeErrorcreditsspannoup').style.display = "inline-block";
    } else {
        document.getElementById('productCodeErrorcreditsspannoup').style.display = "none";
    }

    // GST
    if (!gst || gst.length !== 15) {
        showError = true;
        document.getElementById('productCodeErrorcreditssgstnoup').innerText = "Enter valid GSTIN (15 characters).";
        document.getElementById('productCodeErrorcreditssgstnoup').style.display = "inline-block";
    } else {
        document.getElementById('productCodeErrorcreditssgstnoup').style.display = "none";
    }

    // 🔥 GST vs State validation (SAME AS UPDATE)
    if (!showError && state_id && !gst.toUpperCase().startsWith(state_id)) {
        showError = true;
        document.getElementById('productCodeErrorcreditssgstnoup').innerText =
            `GST must start with selected state code (${state_id})`;
        document.getElementById('productCodeErrorcreditssgstnoup').style.display = "inline-block";
    }

    // State
    if (!stateDropdown) {
        showError = true;
        document.getElementById('productCodeErrorcreditssstateup').innerText = "Please select state.";
        document.getElementById('productCodeErrorcreditssstateup').style.display = "inline-block";
    } else {
        document.getElementById('productCodeErrorcreditssstateup').style.display = "none";
    }

    // ✅ Open modal
    if (!showError) {
        $('#exampleModalCenter66inupdateCOn').modal('show');
    }
}


function addeventConupdate() {
	$('#exampleModalCenter66inupdateCOn').modal('hide');
    // Get current values from UI
	const currentData = {
	    name_of_add: $('#nameOfAddConup').val().trim(),
	    add1:        $('#conaddup').val().trim(),
	    add2:        $('#conaddupLine2').val().trim(),
	    country_id:  $('#conconup').val().trim(),
	    city:        $('#cityup').val().trim(),
	    district:    $('#discttup').val().trim(),
	    pin_no:      $('#pinnoup').val().trim(),
	    pan_no:      $('#pannoup').val().trim(),
	    gst_no:      $('#gstnoup').val().trim(),
	    state_id:    $('#stateup').val().trim()
	};
	


    // Compare with original values
    const isChanged = Object.keys(currentData).some(function(key) {

        return (
            ((originalConsigneeEditData[key] || '').toString().trim()) !==
            ((currentData[key] || '').toString().trim())
        );

    });

    // ❌ No changes
    if (!isChanged) {
		
        const popup = $('<div class="popup">No fields changes.</div>')
            .appendTo('body')
            .hide()
            .fadeIn(400);

        setTimeout(function() {

            popup.fadeOut(400, function() {

                $(this).remove();

                window.location = 'contractcustomer.jsp';

            });

        }, 1000);

        $("#exampleModalCenter66inupdateCOn").modal('hide');

        return;
    }

    // ✅ Change detected
    addeventConupdateConsignee(currentData);
}



function addeventConupdateConsignee() {

    $.ajax({

        url: new URL(
            '/jssl/invoiceConsigneeAddress/updateInvoiceConsigneeAddressNew',
            baseUrl
        ),

        type: 'POST',

        dataType: 'json',

        xhrFields: {
            withCredentials: true
        },

		data: {
		    name_of_add: $('#nameOfAddConup').val(),
		    add1: $('#conaddup').val(),
		    add2: $('#conaddupLine2').val(),
		    city: $('#cityup').val(),
		    district: $('#discttup').val(),
		    state_id: $('#stateup').val(),
		    country_id: $('#conconup').val(),
		    modified_by: createdById,
		    gst_no: $('#gstnoup').val(),
		    pin_no: $('#pinnoup').val(),
		    pan_no: $('#pannoup').val(),
		    address_id: $('#conid').val()
		},

        success: function(data) {

            console.log(data);

            if (data.message === "Success") {
				$("#exampleModalCenter66inupdateCOn").modal('hide');
                const popup = $('<div class="popup">Consignee Address Updated Successfully!</div>')
                    .appendTo('body')
                    .hide()
                    .fadeIn(400);

                setTimeout(function() {

                    popup.fadeOut(400, function() {

                        $(this).remove();

                        window.location = 'contractcustomer.jsp';

                    });

                }, 800);

            } else {

                $('#errorMessageupcon').text(
                    data.message || 'Consignee Address Not Updated'
                );

                $('#exampleModalCenterDupUPcon').modal('show');

                $('#exampleModalCenter66inupdateCOn').modal('hide');
            }
        },

        error: function(xhr) {

            console.error(xhr.responseText);

            alert("Request failed.");
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    fetchCountryverify();
    fetchStateVerify();
});

async function fetchCountryverify() {
    try {
        const url = new URL(`/jssl/country/getAllCountryListNew`, baseUrl);
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch countries");
        const json = await response.json();

        if (json.status !== "yes" || !json.AllCountryDetailsNew.length) return;

        const selectElement = document.getElementById("converify");
        selectElement.innerHTML = `<option value="">Select Country</option>`;

        json.AllCountryDetailsNew.forEach((type) => {
            if (type.id && type.country_name) {
                const option = document.createElement("option");
                option.value = type.id;
                option.textContent = type.country_name;
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching countries for verify:", error);
    }
}

async function fetchStateVerify() {

    try {

        const url = new URL(`/jssl/state/getAllStatesNew`, baseUrl);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch states");
        }

        const json = await response.json();

        if (json.status !== "yes" || !json.StateDetailsNew.length) {
            return;
        }

        const selectElement = document.getElementById("stateDropdownverify");

        selectElement.innerHTML = `<option value="">Select State</option>`;

        json.StateDetailsNew.forEach((type) => {

            if (type.state_id && type.state_name) {

                const option = document.createElement("option");

                // CORRECTED
                option.value = type.state_id;

                option.textContent =
                    type.state_name + '-' + type.state_id;

                option.dataset.stateId = String(type.state_id);

                selectElement.appendChild(option);
            }
        });

    } catch (error) {

        console.error("Error fetching states for verify:", error);
    }
}

function verifyRecord(id) {
    const allowed = allowedActions || [];
    if (!allowed.includes("Verify")) {
        alert("You do not have permission to Verify.");
        return;
    }

    const url = new URL(`/jssl/invoiceConsigneeAddress/getAddressById`, baseUrl);
    url.search = new URLSearchParams([['address_id', id]]).toString();

    fetch(url, { credentials: "include" })
        .then(response => response.json())
		.then(response => {

		    var addressParts = (response.address || '').split('\n');
		    var namePart  = (addressParts[0] || '').trim();
		    var add1Part  = (addressParts[1] || '').trim();
		    var add2Part  = (addressParts[2] || '').trim();

		    document.getElementById('nameOfAddverify').value         = namePart;
		    document.getElementById('categoryPrefixverify').value    = add1Part;
		    document.getElementById('categoryPrefixverifyLine2').value = add2Part;

		    document.getElementById('inputNamebarverify').value = response.city     || '';
		    document.getElementById('discverify').value         = response.district || '';
		    document.getElementById('pinverify').value          = response.pin_no   || '';
		    document.getElementById('panverify').value          = response.pan_no   || '';
		    document.getElementById('gstverify').value          = response.gst_no   || '';
		    document.getElementById('inid').value               = response.id       || '';

		    $('#converify').val(response.country_id);

		    if (response.state_id) {
		        $('#stateDropdownverify').val(response.state_id);
		    } else if (response.state_name) {
		        $('#stateDropdownverify option').each(function() {
		            if ($(this).text().toUpperCase().startsWith(response.state_name.toUpperCase())) {
		                $('#stateDropdownverify').val($(this).val());
		                return false;
		            }
		        });
		    }

		    $('#exampleModalScrollableINverify').modal('show');
		})
        .catch(error => {
            console.error('Error fetching record for verify:', error);
        });
}

function openModalverifyInvoice() {
    var address = document.getElementById('categoryPrefixverify').value.trim();
    var country = document.getElementById('converify').value.trim();
    var state   = document.getElementById('stateDropdownverify').value.trim();
    var dist    = document.getElementById('discverify').value.trim();
    var city    = document.getElementById('inputNamebarverify').value.trim();
    var pin     = document.getElementById('pinverify').value.trim();
    var pan     = document.getElementById('panverify').value.trim();
    var gst     = document.getElementById('gstverify').value.trim();

    var showError = false;

    // Address
    if (address === '') {
        document.getElementById('productCodeErrorcreditss32verify').innerText = "Invoice address is required.";
        document.getElementById('productCodeErrorcreditss32verify').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss32verify').style.display = "none";
    }

    // Country
    if (country === '') {
        document.getElementById('productCodeErrorcreditss31verify').innerText = "Please select country.";
        document.getElementById('productCodeErrorcreditss31verify').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss31verify').style.display = "none";
    }

    // State
    if (state === '') {
        document.getElementById('productCodeErrorcreditss344verify').innerText = "Please select state.";
        document.getElementById('productCodeErrorcreditss344verify').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss344verify').style.display = "none";
    }

    // District
    if (dist === '') {
        document.getElementById('productCodeErrorcreditss30verify').innerText = "Please enter district.";
        document.getElementById('productCodeErrorcreditss30verify').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss30verify').style.display = "none";
    }

    // City
    if (city === '') {
        document.getElementById('productCodeErrorcreditss35verify').innerText = "Please enter city.";
        document.getElementById('productCodeErrorcreditss35verify').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss35verify').style.display = "none";
    }

    // PIN
    if (pin === '' || pin.length !== 6) {
        document.getElementById('productCodeErrorcreditsspinverify').innerText = "Please enter valid 6 digit PIN.";
        document.getElementById('productCodeErrorcreditsspinverify').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsspinverify').style.display = "none";
    }

    // PAN
    if (pan === '' || pan.length !== 10) {
        document.getElementById('productCodeErrorcreditsspanverify').innerText = "Please enter valid 10 character PAN.";
        document.getElementById('productCodeErrorcreditsspanverify').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsspanverify').style.display = "none";
    }

    // GST
    if (gst === '' || gst.length !== 15) {
        document.getElementById('productCodeErrorcreditssgstverify').innerText = "Please enter valid 15 character GSTIN.";
        document.getElementById('productCodeErrorcreditssgstverify').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditssgstverify').style.display = "none";
    }

    // All validations passed — call API
	// All validations passed — show confirmation popup
	if (!showError) {
	    $('#exampleModalScrollableINverify').modal('hide');  // hide verify form modal
	    $('#exampleModalCenter66verify').modal('show');      // show confirmation popup
	}
}

function submitVerify() {
    var id = document.getElementById('inid').value.trim();

    $.ajax({
        url: new URL('/jssl/invoiceConsigneeAddress/verifyInvoiceConsigneeAddress', baseUrl),
        type: 'POST',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: jQuery.param({
            id:          id,
            verified_by: createdById    // logged-in user
        }),
        success: function(data) {
            if (data.message === "Success") {
                $('#exampleModalScrollableINverify').modal('hide');

                const popup = $('<div class="popup">Address Verified Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'contractcustomer.jsp';
                    });
                }, 800);

            } else {
                // Show error in existing error modal
                $('#errorMessageverify').text(data.message || 'Verification failed.');
                $('#exampleModalScrollableINverify').modal('hide');
                $('#exampleModalCenterDupverify').modal('show');
            }
        },
        error: function() {
            console.error('Verify request failed.');
        }
    });
}

function verifyevent() {
    $('#exampleModalCenter66verify').modal('hide');  // hide confirmation popup
    submitVerify();                                  // now call the API
}

let releaseId = "";


// OPEN RELEASE MODAL
function releaseRecord(id) {
	const allowed = allowedActions || [];

			    if (!allowed.includes("Release")) {

			        alert("You do not have permission to Release.");

			        return;
			    }
    releaseId = id;

    $("#exampleModalCenter66release").modal("show");
}



// RELEASE EVENT
async function releaseevent() {
    try {

        const released_by = createdById;

        const response = await fetch(
            `${baseUrl}/jssl/invoiceConsigneeAddress/releaseInvoiceConsigneeAddress?id=${releaseId}&released_by=${released_by}`,
            {
                method: "POST",
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to release address");
        }

        const data = await response.json();

        if (data.status === "yes") {

			const popup = $('<div class="popup">Address Released Successfully!</div>')
			                    .appendTo('body').hide().fadeIn(400);

			                setTimeout(function() {
			                    popup.fadeOut(400, function() {
			                        $(this).remove();
			                        window.location = 'contractcustomer.jsp';
			                    });
			                }, 800);

            $("#exampleModalCenter66release").modal("hide");

            fetchUserList();

        } else {

            alert(data.message || "Failed to release address");
        }

    } catch (error) {

        console.error("Release Error:", error);

        alert("Something went wrong while releasing address");
    }
}

document.addEventListener("DOMContentLoaded", function () {

    fetchCountryverifyCon();

    fetchStateVerifyCon();
});



// FETCH COUNTRY
async function fetchCountryverifyCon() {

    try {

        const url = new URL(
            `/jssl/country/getAllCountryListNew`,
            baseUrl
        );

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch countries");
        }

        const json = await response.json();

        if (
            json.status !== "yes" ||
            !json.AllCountryDetailsNew.length
        ) {
            return;
        }

        const selectElement =
            document.getElementById("conconupverify");

        selectElement.innerHTML =
            `<option value="">Select Country</option>`;

        json.AllCountryDetailsNew.forEach((type) => {

            if (type.id && type.country_name) {

                const option =
                    document.createElement("option");

                option.value = type.id;

                option.textContent = type.country_name;

                selectElement.appendChild(option);
            }
        });

    } catch (error) {

        console.error(
            "Error fetching countries:",
            error
        );
    }
}



// FETCH STATE
async function fetchStateVerifyCon() {

    try {

        const url = new URL(
            `/jssl/state/getAllStatesNew`,
            baseUrl
        );

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch states");
        }

        const json = await response.json();

        if (
            json.status !== "yes" ||
            !json.StateDetailsNew.length
        ) {
            return;
        }

        const selectElement =
            document.getElementById("stateupverify");

        selectElement.innerHTML =
            `<option value="">Select State</option>`;

        json.StateDetailsNew.forEach((type) => {

            if (type.state_id && type.state_name) {

                const option =
                    document.createElement("option");

                option.value = type.state_id;

                option.textContent =
                    type.state_name + '-' + type.state_id;

                selectElement.appendChild(option);
            }
        });

    } catch (error) {

        console.error(
            "Error fetching states:",
            error
        );
    }
}



// VERIFY RECORD OPEN
function verifyRecordCon(id) {

    const allowed = allowedActions || [];

    if (!allowed.includes("Verify")) {

        alert("You do not have permission to Verify.");

        return;
    }

    const url = new URL(
        `/jssl/invoiceConsigneeAddress/getAddressById`,
        baseUrl
    );

    url.search =
        new URLSearchParams([
            ['address_id', id]
        ]).toString();

    fetch(url, {
        credentials: "include"
    })

    .then(response => response.json())

	.then(response => {

	    var addressParts = (response.address || '').split('\n');
	    var namePart  = (addressParts[0] || '').trim();
	    var add1Part  = (addressParts[1] || '').trim();
	    var add2Part  = (addressParts[2] || '').trim();

	    $('#nameOfAddConverify').val(namePart);
	    $('#conaddupverify').val(add1Part);
	    $('#conaddupverifyLine2').val(add2Part);

	    $('#cityupverify').val(response.city     || '');
	    $('#discttupverify').val(response.district || '');
	    $('#pinnoupverify').val(response.pin_no   || '');
	    $('#pannoupverify').val(response.pan_no   || '');
	    $('#gstnoupverify').val(response.gst_no   || '');
	    $('#conidverify').val(response.id         || '');

	    $('#conconupverify').val(response.country_id);

	    if (response.state_id) {
	        $('#stateupverify').val(response.state_id);
	    } else if (response.state_name) {
	        $('#stateupverify option').each(function() {
	            if ($(this).text().toUpperCase().startsWith(response.state_name.toUpperCase())) {
	                $('#stateupverify').val($(this).val());
	                return false;
	            }
	        });
	    }

	    $('#exampleModalScrollableConUpverify').modal('show');
	})

    .catch(error => {

        console.error(
            'Error fetching consignee verify data:',
            error
        );
    });
}



// VALIDATION + OPEN CONFIRMATION
function openModalAddConUPverify() {

    var address =
        $('#conaddupverify').val().trim();

    var country =
        $('#conconupverify').val().trim();

    var state =
        $('#stateupverify').val().trim();

    var district =
        $('#discttupverify').val().trim();

    var city =
        $('#cityupverify').val().trim();

    var pin =
        $('#pinnoupverify').val().trim();

    var pan =
        $('#pannoupverify').val().trim();

    var gst =
        $('#gstnoupverify').val().trim();

    let showError = false;



    // ADDRESS
    if (address === '') {

        $('#productCodeErrorcreditssconupverify')
            .text('Please enter consignee address.')
            .show();

        showError = true;

    } else {

        $('#productCodeErrorcreditssconupverify')
            .hide();
    }



    // COUNTRY
    if (country === '') {

        $('#productCodeErrorcreditssconconupverify')
            .text('Please select country.')
            .show();

        showError = true;

    } else {

        $('#productCodeErrorcreditssconconupverify')
            .hide();
    }



    // STATE
    if (state === '') {

        $('#productCodeErrorcreditssstateupverify')
            .text('Please select state.')
            .show();

        showError = true;

    } else {

        $('#productCodeErrorcreditssstateupverify')
            .hide();
    }



    // DISTRICT
    if (district === '') {

        $('#productCodeErrorcreditssdistupverify')
            .text('Please enter district.')
            .show();

        showError = true;

    } else {

        $('#productCodeErrorcreditssdistupverify')
            .hide();
    }



    // CITY
    if (city === '') {

        $('#productCodeErrorcreditsscityupverify')
            .text('Please enter city.')
            .show();

        showError = true;

    } else {

        $('#productCodeErrorcreditsscityupverify')
            .hide();
    }



    // PIN
    if (pin === '' || pin.length !== 6) {

        $('#productCodeErrorcreditsspinnoupverify')
            .text('Please enter valid 6 digit PIN.')
            .show();

        showError = true;

    } else {

        $('#productCodeErrorcreditsspinnoupverify')
            .hide();
    }



    // PAN
    if (pan === '' || pan.length !== 10) {

        $('#productCodeErrorcreditsspannoupverify')
            .text('Please enter valid PAN.')
            .show();

        showError = true;

    } else {

        $('#productCodeErrorcreditsspannoupverify')
            .hide();
    }



    // GST
    if (gst === '' || gst.length !== 15) {

        $('#productCodeErrorcreditssgstnoupverify')
            .text('Please enter valid GST.')
            .show();

        showError = true;

    } else {

        $('#productCodeErrorcreditssgstnoupverify')
            .hide();
    }



    // SHOW CONFIRMATION
    if (!showError) {

        $('#exampleModalScrollableConUpverify')
            .modal('hide');

        $('#exampleModalCenter66verifyy')
            .modal('show');
    }
}



// FINAL VERIFY API
function submitVerifyCon() {

    const id =
        $('#conidverify').val();

    $.ajax({

        url: new URL(
            '/jssl/consigneeAddress/verifyConsigneeAddress',
            baseUrl
        ),

        type: 'POST',

        dataType: 'json',

        xhrFields: {
            withCredentials: true
        },

        data: {

            id: id,

            verified_by: createdById
        },

        success: function(data) {

            if (data.message === "Success") {

                $('#exampleModalCenter66verifyy')
                    .modal('hide');

                const popup =
                    $('<div class="popup">Consignee Address Verified Successfully!</div>')
                    .appendTo('body')
                    .hide()
                    .fadeIn(400);

                setTimeout(function () {

                    popup.fadeOut(400, function () {

                        $(this).remove();

                        window.location =
                            'contractcustomer.jsp';
                    });

                }, 800);

            } else {

                $('#errorMessageupconVerify')
                    .text(data.message);

                $('#exampleModalCenterDupUPcon')
                    .modal('show');
            }
        },

        error: function () {

            console.error(
                "Verify request failed."
            );
        }
    });
}



// VERIFY CONFIRMATION
function verifyyevent() {

    $('#exampleModalCenter66verifyy')
        .modal('hide');

    submitVerifyCon();
}



// RELEASE
let releaseConId = "";

function releaseRecordCon(id) {
	const allowed = allowedActions || [];

		    if (!allowed.includes("Release")) {

		        alert("You do not have permission to Release.");

		        return;
		    }
    releaseConId = id;

    $('#exampleModalCenter66releasee')
        .modal('show');
}



async function releaseeevent() {
	
    try {

        const released_by = createdById;

        const response = await fetch(

            `${baseUrl}/jssl/consigneeAddress/releaseConsigneeAddress?id=${releaseConId}&released_by=${released_by}`,

            {
                method: "POST",
                credentials: "include"
            }
        );

        if (!response.ok) {

            throw new Error(
                "Failed to release consignee address"
            );
        }

        const data = await response.json();

        if (data.status === "yes") {

            $('#exampleModalCenter66releasee')
                .modal('hide');

            const popup =
                $('<div class="popup">Consignee Address Released Successfully!</div>')
                .appendTo('body')
                .hide()
                .fadeIn(400);

            setTimeout(function () {

                popup.fadeOut(400, function () {

                    $(this).remove();

                    window.location =
                        'contractcustomer.jsp';
                });

            }, 800);

        } else {

            alert(data.message);
        }

    } catch (error) {

        console.error(
            "Release Error:",
            error
        );

        alert(
            "Something went wrong while releasing consignee address"
        );
    }
}
