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

// Fetch selectedFactoryId from sessionStorage
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

document.addEventListener("DOMContentLoaded", function () {
	loadActions();
});
// Ensure the ID is available before making the API call
if (selectedFactoryId) {
	fetchUserList();
} else {
	console.error('No factory ID found in sessionStorage.');
}

// Function to fetch the list of users/vendors based on the selected factory ID
async function fetchUserList() {
	try {

		// Construct the API URL
		const url = new URL(`/jssl/bank/listbankaccount`, baseUrl);
		//url.searchParams.append('factory_id', selectedFactoryId);

		// Fetch vendor data
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
		if (!response.ok) throw new Error("Failed to fetch data");
		const json = await response.json();

		// Prepare table content
		let tableContent = `
            <thead>
                <tr>
                    <th>Bank Name</th>
                  
					<th>Branch Code</th>
					<th>Ifsc Name</th>
					<th>Account Number</th>
					<th>Swift Code</th>
					
					<th>Branch Address</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;

		json.Data.forEach(item => {
			tableContent += `
                <tr>
                    <td>${item.bank_name}</td>
                    
					 <td>${item.branch_code}</td>
					 <td>${item.ifsc_code}</td>
					 <td>${item.account_number}</td>
					 <td>${item.swift_code}</td>
					 
					 <td>${item.branch_address}</td>
                    <td><i class="fa fa-pen" onclick="editRecord('${item.account_id}')"></i></td>
                </tr>
            `;
		});

		tableContent += `</tbody>`;

		// Update table content
		$("#tableID").html(tableContent);

		// Initialize DataTable with custom configuration
		$("#tableID").DataTable({
				    dom: 'Bfrtip',
				    scrollX: true,
				    info: true,           // ✅ Shows "Showing 1 to 10 of X entries"
				    paging: true,         // ✅ Enables paging
				    pageLength: 10,       // ✅ 10 records per page
				    destroy: true,
				    buttons: [
				        {
				            extend: 'excel',
				            text: 'Export to Excel',
				            title: 'List',
				        },
				    ]
				});
	} catch (error) {
		console.error('Error fetching vendor data:', error);
	}
}

// get the factory_id
document.addEventListener("DOMContentLoaded", function() {
	const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
	if (selectedFactoryId) {
		fetchSaleOrderTypes();
	} else {
		console.error("No factory ID found in sessionStorage.");
	}
});

// fetching the drop down list from sate
async function fetchSaleOrderTypes() {
	try {

		// Construct the API URL properly
		const url = new URL(`/jssl/listbusinessunitsnew`, baseUrl);
		//url.searchParams.append("factory_id", factoryId);

		// Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
		if (!response.ok) throw new Error("Failed to fetch sale order types");

		const json = await response.json();

		// Check if the API response has valid data
		if (json.status !== "yes" || !json.Data.length) {
			console.warn("No sale order types found.");
			return;
		}

		// Get the select element
		const selectElement = document.getElementById("businessUnit");

		// Clear existing options
		selectElement.innerHTML = `<option value="">Select Business Units</option>`;

		// Populate dropdown options using SalesOrderTypeDetails array
		json.Data.forEach((type) => {
			if (type.business_unit_id && type.business_unit_name) { // Ensure both values exist
				const option = document.createElement("option");
				option.value = type.business_unit_id; // Backend keeps saleorder_id
				option.textContent = type.business_unit_name; // Display saleorder_typename
				selectElement.appendChild(option);
			}
		});
	} catch (error) {
		console.error("Error fetching sale order types:", error);
	}
}

// get the factory_id
document.addEventListener("DOMContentLoaded", function() {
	const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
	if (selectedFactoryId) {
		fetchSaleOrderUpdateTypes();
	} else {
		console.error("No factory ID found in sessionStorage.");
	}
});

// fetching the drop down list from sate
async function fetchSaleOrderUpdateTypes() {
	try {

		// Construct the API URL properly
		const url = new URL(`/jssl/listbusinessunitsnew`, baseUrl);
		//url.searchParams.append("factory_id", factoryId);

		// Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
		if (!response.ok) throw new Error("Failed to fetch sale order types");

		const json = await response.json();

		// Check if the API response has valid data
		if (json.status !== "yes" || !json.Data.length) {
			console.warn("No sale order types found.");
			return;
		}

		// Get the select element
		const selectElement = document.getElementById("businessUnitu1");

		// Clear existing options
		selectElement.innerHTML = `<option value="">Select Business Units</option>`;

		// Populate dropdown options using SalesOrderTypeDetails array
		json.Data.forEach((type) => {
			if (type.business_unit_id && type.business_unit_name) { // Ensure both values exist
				const option = document.createElement("option");
				option.value = type.business_unit_id; // Backend keeps saleorder_id
				option.textContent = type.business_unit_name; // Display saleorder_typename
				selectElement.appendChild(option);
			}
		});
	} catch (error) {
		console.error("Error fetching sale order types:", error);
	}
}

document.addEventListener("DOMContentLoaded", function() {
	const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
	if (selectedFactoryId) {
		fetchSaleOrderTypes1();
	} else {
		console.error("No factory ID found in sessionStorage.");
	}
});

// fetching the drop down list from sate
async function fetchSaleOrderTypes1() {
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
		const selectElement = document.getElementById("countrycode");

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

document.addEventListener("DOMContentLoaded", function() {
	const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
	if (selectedFactoryId) {
		fetchSaleOrderTypesupdateCountry1();
	} else {
		console.error("No factory ID found in sessionStorage.");
	}
});

// fetching the drop down list from sate
async function fetchSaleOrderTypesupdateCountry1() {
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
		const selectElement = document.getElementById("countrycodeu1");

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


document.addEventListener("DOMContentLoaded", function() {
	const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
	if (selectedFactoryId) {
		fetchSaleOrderTypesState1();
	} else {
		console.error("No factory ID found in sessionStorage.");
	}
});
// fetching the drop down list from sate
async function fetchSaleOrderTypesState1() {
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
		const selectElement = document.getElementById("Statecode");

		// Clear existing options
		selectElement.innerHTML = `<option value="">Select State</option>`;

		// Populate dropdown options using SalesOrderTypeDetails array
		json.StateDetailsNew.forEach((type) => {
			if (type.id && type.state_name) { // Ensure both values exist
				const option = document.createElement("option");
				option.value = type.id; // Backend keeps saleorder_id
				option.textContent = type.state_name; // Display saleorder_typename
				selectElement.appendChild(option);
			}
		});
	} catch (error) {
		console.error("Error fetching sale order types:", error);
	}
}

document.addEventListener("DOMContentLoaded", function() {
	const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
	if (selectedFactoryId) {
		fetchStateUpdate1();
	} else {
		console.error("No factory ID found in sessionStorage.");
	}
});
// fetching the drop down list from sate
async function fetchStateUpdate1() {
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
		const selectElement = document.getElementById("stateupdate");

		// Clear existing options
		selectElement.innerHTML = `<option value="">Select State</option>`;

		// Populate dropdown options using SalesOrderTypeDetails array
		json.StateDetailsNew.forEach((type) => {
			if (type.id && type.state_name) { // Ensure both values exist
				const option = document.createElement("option");
				option.value = type.id; // Backend keeps saleorder_id
				option.textContent = type.state_name; // Display saleorder_typename
				selectElement.appendChild(option);
			}
		});
	} catch (error) {
		console.error("Error fetching sale order types:", error);
	}
}


// for validation please give 
function openModalAdd() {
	var bussinesunit = document.getElementById('businessUnit').value.trim();
	var bankNamevalue = document.getElementById('bankName1').value.trim();
	var ifscCodevalue = document.getElementById('ifscCode1').value.trim();
	var branchAddressvalue = document.getElementById('branchAddress1').value.trim();
	var cityvalue = document.getElementById('city1').value.trim();
	var branchvalue = document.getElementById('branchCode1').value.trim();
	var accountvalue = document.getElementById('accountNumber1').value.trim();
	var Swiftvalue = document.getElementById('SwiftCode').value.trim();
	var statevalue = document.getElementById('Statecode').value.trim();
	var countryId = document.getElementById('countrycode').value.trim();
	var showError = false; // Initialize showError variable

	// Username Validation
	if (bussinesunit === '') {
		document.getElementById('businessUnitError').innerText = "Please Select Business unit.";
		document.getElementById('businessUnitError').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('businessUnitError').innerText = "";
		document.getElementById('businessUnitError').style.display = "none";
	}
	if (bankNamevalue === '') {
		document.getElementById('bankNameError').innerText = "Please Enter Bank Name.";
		document.getElementById('bankNameError').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('bankNameError').innerText = "";
		document.getElementById('bankNameError').style.display = "none";
	}
	if (ifscCodevalue === '') {
		document.getElementById('ifscCodeError').innerText = "Please Enter IFSC Code";
		document.getElementById('ifscCodeError').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('ifscCodeError').innerText = "";
		document.getElementById('ifscCodeError').style.display = "none";
	}
	if (branchAddressvalue === '') {
		document.getElementById('branchAddressError').innerText = "Please Enter Branch Address.";
		document.getElementById('branchAddressError').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('branchAddressError').innerText = "";
		document.getElementById('branchAddressError').style.display = "none";
	}
	if (cityvalue === '') {
		document.getElementById('cityError').innerText = "Please Enter City Name.";
		document.getElementById('cityError').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('cityError').innerText = "";
		document.getElementById('cityError').style.display = "none";
	}
	if (branchvalue === '') {
		document.getElementById('branchCodeError').innerText = "Please Enter Branch Code.";
		document.getElementById('branchCodeError').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('branchCodeError').innerText = "";
		document.getElementById('branchCodeError').style.display = "none";
	}
	if (accountvalue === '') {
		document.getElementById('accountNumberError').innerText = "Please Enter Account Number.";
		document.getElementById('accountNumberError').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('accountNumberError').innerText = "";
		document.getElementById('accountNumberError').style.display = "none";
	}
	if (Swiftvalue === '') {
		document.getElementById('swiftCodeError').innerText = "Please Enter SwiftCode.";
		document.getElementById('swiftCodeError').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('swiftCodeError').innerText = "";
		document.getElementById('swiftCodeError').style.display = "none";
	}
	if (statevalue === '') {
		document.getElementById('stateUnitError').innerText = "Please Select State.";
		document.getElementById('stateUnitError').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('stateUnitError').innerText = "";
		document.getElementById('stateUnitError').style.display = "none";
	}
	if (countryId === '') {
		document.getElementById('countryUnitError').innerText = "Please Select Country.";
		document.getElementById('countryUnitError').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('countryUnitError').innerText = "";
		document.getElementById('countryUnitError').style.display = "none";
	}
	// If no errors, proceed
	if (!showError) {
		$('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
	}
}

function addevent() {
	$('#exampleModalCenter66').modal('hide');
	// Validate role code and role description
	$.ajax({
		url: new URL('/jssl/bank/addbankaccount', baseUrl), // Move 'const' to the correct place
		type: 'POST',
		dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
		data: jQuery.param({ business_unit_id: businessUnit.value, bank_name: bankName1.value, account_number: accountNumber1.value.trim(), ifsc_code: ifscCode1.value, branch_address: branchAddress1.value, state_id: Statecode.value, country_id: countrycode.value, city: city1.value, swift_code: SwiftCode.value, branch_code: branchCode1.value, created_by: createdById}),
		success: function(data) {
			var result = data.message; // No need to stringify

			if (result === "Success") {
				// Store permissions in sessionStorage
				const popup = $('<div class="popup">Bank Master Created Successfully!</div>')
					.appendTo('body').hide().fadeIn(400);

				setTimeout(function() {
					popup.fadeOut(400, function() {
						$(this).remove();
						window.location = 'bankdetails.jsp'; // Redirect to role list page
					});
				}, 800);
			} else {
				 const errorMessage = data.message || 'Failed to Create  Bank';
                $('#errorMessage').text(errorMessage); // Set the error message dynamically
                $('#exampleModalCenterDup').modal('show'); // Show the modal with the error message
			}
		},
		error: function() {
			// Handle AJAX error
			console.error('Request failed.');
		}
	});
}
// for validation please give 
function openModalEdit() {
	var bussinesunitu1 = document.getElementById('businessUnitu1').value.trim();
	var bankNamevalueu1 = document.getElementById('bankName1u1').value.trim();
	var ifscCodevalueu1 = document.getElementById('ifscCode1u1').value.trim();
	var branchAddressvalueu1 = document.getElementById('branchAddress1u1').value.trim();
	var cityvalueu1 = document.getElementById('city1u1').value.trim();
	var branchvalueu1 = document.getElementById('branchCode1u1').value.trim();
	var accountvalueu1 = document.getElementById('accountNumber1u1').value.trim();
	var Swiftvalueu1 = document.getElementById('SwiftCodeu1').value.trim();
	var statevalueu1 = document.getElementById('stateupdate').value.trim();
	var countryIdu1 = document.getElementById('countrycodeu1').value.trim();
	var showError = false; // Initialize showError variable

	// Username Validation
	if (bussinesunitu1 === '') {
		document.getElementById('businessUnitError1').innerText = "Please Select Business unit.";
		document.getElementById('businessUnitError1').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('businessUnitError1').innerText = "";
		document.getElementById('businessUnitError1').style.display = "none";
	}
	if (bankNamevalueu1 === '') {
		document.getElementById('bankNameError1').innerText = "Please Enter Bank Name.";
		document.getElementById('bankNameError1').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('bankNameError1').innerText = "";
		document.getElementById('bankNameError1').style.display = "none";
	}
	if (ifscCodevalueu1 === '') {
		document.getElementById('ifscCodeError1').innerText = "Please Enter IFSC Code";
		document.getElementById('ifscCodeError1').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('ifscCodeError1').innerText = "";
		document.getElementById('ifscCodeError1').style.display = "none";
	}
	if (branchAddressvalueu1 === '') {
		document.getElementById('branchAddressError1').innerText = "Please Enter Branch Address.";
		document.getElementById('branchAddressError1').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('branchAddressError1').innerText = "";
		document.getElementById('branchAddressError1').style.display = "none";
	}
	if (cityvalueu1 === '') {
		document.getElementById('cityError1').innerText = "Please Enter City Name.";
		document.getElementById('cityError1').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('cityError1').innerText = "";
		document.getElementById('cityError1').style.display = "none";
	}
	if (branchvalueu1 === '') {
		document.getElementById('branchCodeError1').innerText = "Please Enter Branch Code.";
		document.getElementById('branchCodeError1').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('branchCodeError1').innerText = "";
		document.getElementById('branchCodeError1').style.display = "none";
	}
	if (accountvalueu1 === '') {
		document.getElementById('accountNumberError1').innerText = "Please Enter Account Number.";
		document.getElementById('accountNumberError1').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('accountNumberError1').innerText = "";
		document.getElementById('accountNumberError1').style.display = "none";
	}
	if (Swiftvalueu1 === '') {
		document.getElementById('swiftCodeError1').innerText = "Please Enter SwiftCode.";
		document.getElementById('swiftCodeError1').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('swiftCodeError1').innerText = "";
		document.getElementById('swiftCodeError1').style.display = "none";
	}
	if (statevalueu1 === '') {
		document.getElementById('stateUnitError1').innerText = "Please Select State.";
		document.getElementById('stateUnitError1').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('stateUnitError1').innerText = "";
		document.getElementById('stateUnitError1').style.display = "none";
	}
	if (countryIdu1 === '') {
		document.getElementById('countryUnitError1').innerText = "Please Select Country.";
		document.getElementById('countryUnitError1').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('countryUnitError1').innerText = "";
		document.getElementById('countryUnitError1').style.display = "none";
	}

	// If no errors, proceed
	if (!showError) {
		$('#exampleModalCenterupdate').modal('show'); // Show the next modal (Ensure this modal exists)
	}
}






let originalBankAccountData = {};
function editRecord(account_id) {
	// alert("ID: " + id);
	// Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
	const url = new URL(`/jssl/bank/searchbankaccount`, baseUrl);
	var params = [['account_id', account_id]];
	url.search = new URLSearchParams(params).toString();

	fetch(url, { credentials: "include" })
		.then(response => response.json())
		.then(response => {
			if (response.status === 'yes' && response.DATA) {
				// Populate form fields with the data from the response
				$('#businessUnitu1').val(response.DATA.business_unit_id);
				$('#bankName1u1').val(response.DATA.bank_name);
				$('#ifscCode1u1').val(response.DATA.ifsc_code);
				$('#branchAddress1u1').val(response.DATA.branch_address);
				$('#city1u1').val(response.DATA.city);
				$('#branchCode1u1').val(response.DATA.branch_code);
				$('#accountNumber1u1').val(response.DATA.account_number);
				$('#SwiftCodeu1').val(response.DATA.swift_code);
				$('#stateupdate').val(response.DATA.state_id);
				$('#countrycodeu1').val(response.DATA.country_id);
				$('#bankid').val(response.DATA.account_id);
				
				
				
				
				originalBankAccountData = {
									business_unit_id: response.DATA.business_unit_id,
									bank_name: response.DATA.bank_name,
									ifsc_code: response.DATA.ifsc_code,
									branch_address: response.DATA.branch_address,
									city: response.DATA.city,
									branch_code: response.DATA.branch_code,
									account_number: response.DATA.account_number,
									swift_code: response.DATA.swift_code,
									state_id: response.DATA.state_id,
									country_id: response.DATA.country_id,
									account_id: response.DATA.account_id
								};
				// Open the modal
				$('#exampleModalScrollableedit').modal('show');
			} else {
				console.error('Error: No valid data found.');
			}
		})
		.catch(error => {
			// Handle error
			console.error('Error:', error);
		});
}



function getCurrentEditEventData() {
	return {
		business_unit_id: $('#businessUnitu1').val(),
		bank_name: $('#bankName1u1').val(),
		ifsc_code: $('#ifscCode1u1').val(),
		branch_address: $('#branchAddress1u1').val(),
		city: $('#city1u1').val(),
		branch_code: $('#branchCode1u1').val(),
		account_number: $('#accountNumber1u1').val(),
		swift_code: $('#SwiftCodeu1').val(),
		state_id: $('#stateupdate').val(),
		country_id: $('#countrycodeu1').val(),
		account_id: $('#bankid').val()
	};
}

function hasAnyChange(original, current) {
	for (let key in original) {
		const o = (original[key] ?? '').toString().trim();
		const c = (current[key] ?? '').toString().trim();

		if (o !== c) {
			return true; // change detected
		}
	}
	return false; // no change
}

function editevent() {
	$('#exampleModalCenterupdate').modal('hide');
	const currentData = getCurrentEditEventData();

	// ❌ No change → skip update
	if (!hasAnyChange(originalBankAccountData, currentData)) {
		const popup = $('<div class="popup">No Feilds Changes</div>')
						.appendTo('body').hide().fadeIn(400);

					setTimeout(function() {
						popup.fadeOut(400, function() {
							$(this).remove();
							window.location = 'bankdetails.jsp'; // Redirect to role list page
						});
					}, 800);
		return;
	}

	// ✅ Change detected → allow update
	
	editeventUpdate();
}


function isAccountNumberChanged() {
	const original = (originalBankAccountData.account_number ?? '')
		.toString().trim().toUpperCase();

	const current = ($('#accountNumber1u1').val() ?? '')
		.toString().trim().toUpperCase();

	return original !== current;
}


function editeventUpdate() {
	
	const accountChangedFlag = isAccountNumberChanged();
	// Validate role code and role description
	$.ajax({
		url: new URL('/jssl/bank/updatebankaccount', baseUrl),
		type: 'POST',
		dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
		data: jQuery.param({ business_unit_id: businessUnitu1.value, bank_name: bankName1u1.value, account_number: accountNumber1u1.value, ifsc_code: ifscCode1u1.value, branch_address: branchAddress1u1.value, state_id: stateupdate.value, country_id: countrycodeu1.value, city: city1u1.value, swift_code: SwiftCodeu1.value, branch_code: branchCode1u1.value, modified_by: createdById,account_id: bankid.value,isAccountNumberChanged: accountChangedFlag }),
		success: function(data) {
			var result = data.message; // No need to stringify

			if (result === "Success") {
				// Store permissions in sessionStorage
				const popup = $('<div class="popup">Bank Master Updated Successfully!</div>')
					.appendTo('body').hide().fadeIn(400);

				setTimeout(function() {
					popup.fadeOut(400, function() {
						$(this).remove();
						window.location = 'bankdetails.jsp'; // Redirect to role list page
					});
				}, 800);
			} else {
				const errorMessage = data.message || 'Failed to create country.';
                $('#errorMessageup').text(errorMessage); // Set the error message dynamically
                $('#exampleModalCenterDupUP').modal('show'); // Show the modal with the error message
                $('#exampleModalCenterupdate').modal('hide'); 
			}
		},
		error: function() {
			// Handle AJAX error
			console.error('Request failed.');
		}
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

