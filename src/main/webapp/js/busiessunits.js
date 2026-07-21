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
 
// Fetch selectedFactoryId from localStorage
const selectedFactoryId = localStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);
 
document.addEventListener("DOMContentLoaded", function () {
	loadActions();
});
// Ensure the ID is available before making the API call
if (selectedFactoryId) {
	fetchUserList();
} else {
	console.error('No factory ID found in localStorage.');
}
 
// Function to fetch the list of users/vendors based on the selected factory ID
async function fetchUserList() {
	try {
 
		// Construct the API URL
		const url = new URL(`/jssl/listbusinessunitsnew`, baseUrl);
		//url.searchParams.append('factory_id', selectedFactoryId);
 
		// Fetch vendor data
		const response = await fetch(url, {
			method: "GET",
			credentials: "include"   // ✅ Always send JSESSIONID cookie
		});
		if (!response.ok) throw new Error("Failed to fetch data");
		const json = await response.json();
 
		// Prepare table content
		let tableContent = `
            <thead>
                <tr>
                    <th>GST Number</th>
                    <th>Business Code</th>
                    <th>Business unit name</th>
                    <th>Business Address</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;
 
		json.Data.forEach(item => {
			tableContent += `
                <tr>
                    <td>${item.gst_number}</td>
                    <td>${item.bu_code}</td>
                    <td>${item.business_unit_name}</td>location
                    <td>${item.location}</td>
                    <td><i class="fa fa-pen" onclick="editRecord('${item.business_unit_id}')"></i></td>
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
 
document.addEventListener("DOMContentLoaded", function() {
	const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
	if (selectedFactoryId) {
		fetchSaleOrderTypes(selectedFactoryId);
	} else {
		console.error("No factory ID found in localStorage.");
	}
});
 
async function fetchSaleOrderTypes(factoryId) {
	try {
 
		// Construct the API URL properly
		const url = new URL(`/jssl/state/getAllStatesNew`, baseUrl);
		/*    url.searchParams.append("factory_id", factoryId);*/
 
		// Fetch data from API
		const response = await fetch(url, {
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
				option.value = type.id; // Backend keeps saleorder_id
				option.textContent = type.state_name + '-' + type.state_id;
				//option.dataset.stateId = String(type.state_id); // Display saleorder_typename
				option.dataset.stateId = String(type.state_id).padStart(2, '0');
				selectElement.appendChild(option);
			}
		});
	} catch (error) {
		console.error("Error fetching sale order types:", error);
	}
}
 
document.addEventListener("DOMContentLoaded", function() {
	const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
	if (selectedFactoryId) {
		fetchSaleOrderTypesedit(selectedFactoryId);
	} else {
		console.error("No factory ID found in localStorage.");
	}
});
 
async function fetchSaleOrderTypesedit(factoryId) {
	try {
 
		// Construct the API URL properly
		const url = new URL(`/jssl/state/getAllStatesNew`, baseUrl);
 
		// Fetch data from API
		const response = await fetch(url, {
			method: "GET",
			credentials: "include"
		});
 
		if (!response.ok)
			throw new Error("Failed to fetch states");
 
		const json = await response.json();
 
		// Check if the API response has valid data
		if (json.status !== "yes" || !json.StateDetailsNew.length) {
			console.warn("No states found.");
			return;
		}
 
		// Get the select element
		const selectElement = document.getElementById("stateDropdown11");
 
		// Clear existing options
		selectElement.innerHTML = `<option value="">Select state</option>`;
 
		// Populate dropdown options
		json.StateDetailsNew.forEach((type) => {
 
			if (type.state_id && type.state_name) {
 
				const option = document.createElement("option");
 
				// IMPORTANT CHANGE
				option.value = type.state_id;
 
				option.textContent = `${type.state_name} - ${type.state_id}`;
 
				//option.dataset.stateId = String(type.state_id);
				option.dataset.stateId = String(type.state_id).padStart(2, '0');
 
				selectElement.appendChild(option);
			}
		});
 
	} catch (error) {
		console.error("Error fetching states:", error);
	}
}
 
document.addEventListener("DOMContentLoaded", function() {
	const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
	if (selectedFactoryId) {
		fetchSaleOrganization(selectedFactoryId);
	} else {
		console.error("No factory ID found in localStorage.");
	}
});
 
async function fetchSaleOrganization(factoryId) {
	try {
 
		// Construct the API URL properly
		const url = new URL(`/jssl/organization/listorganization`, baseUrl);
		/*     url.searchParams.append("factory_id", factoryId);*/
 
		// Fetch data from API
		const response = await fetch(url, {
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
		const selectElement = document.getElementById("orgDropdown");
 
		// Clear existing options
		selectElement.innerHTML = `<option value="">Select organization</option>`;
 
		// Populate dropdown options using SalesOrderTypeDetails array
		json.Data.forEach((type) => {
			if (type.org_id && type.org_name) { // Ensure both values exist
				const option = document.createElement("option");
				option.value = type.org_id; // Backend keeps saleorder_id
				option.textContent = type.org_name; // Display saleorder_typename
				selectElement.appendChild(option);
			}
		});
	} catch (error) {
		console.error("Error fetching sale order types:", error);
	}
}
 
document.addEventListener("DOMContentLoaded", function() {
	const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
	if (selectedFactoryId) {
		fetchSaleOrganizationedit(selectedFactoryId);
	} else {
		console.error("No factory ID found in localStorage.");
	}
});
 
async function fetchSaleOrganizationedit(factoryId) {
	try {
 
		// Construct the API URL properly
		const url = new URL(`/jssl/organization/listorganization`, baseUrl);
		/*   url.searchParams.append("factory_id", factoryId);*/
 
		// Fetch data from API
		const response = await fetch(url, {
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
		const selectElement = document.getElementById("orgDropdown11");
 
		// Clear existing options
		selectElement.innerHTML = `<option value="">Select organization</option>`;
 
		// Populate dropdown options using SalesOrderTypeDetails array
		json.Data.forEach((type) => {
			if (type.org_id && type.org_name) { // Ensure both values exist
				const option = document.createElement("option");
				option.value = type.org_id; // Backend keeps saleorder_id
				option.textContent = type.org_name; // Display saleorder_typename
				selectElement.appendChild(option);
			}
		});
	} catch (error) {
		console.error("Error fetching sale order types:", error);
	}
}
 
function openModalAdd() {
 
	var username = document.getElementById('categoryPrefix').value.trim();
	var gst_name = document.getElementById('inputName').value.trim(); // GST
	var code = document.getElementById('inputNamebar').value.trim();
	var org = document.getElementById('orgDropdown').value.trim();
	var pannumber = document.getElementById('panNumber').value.trim();
 
	// STATE SELECT + data-state-id
	const stateSelect = document.getElementById('stateDropdown');
	const stateValue = stateSelect ? stateSelect.value.trim() : '';
	const selectedOption = stateSelect ? stateSelect.options[stateSelect.selectedIndex] : null;
 
	//  Extract state_id from data attribute
	const state_id = selectedOption && selectedOption.dataset
		? selectedOption.dataset.stateId || ''
		: '';
 
	var showError = false;
 
	/* ================= VALIDATIONS ================= */
 
	if (username === '') {
		showError = true;
		document.getElementById('productCodeErrorcreditss32').innerText =
			"Please enter business unit name.";
		document.getElementById('productCodeErrorcreditss32').style.display = "inline-block";
	} else {
		document.getElementById('productCodeErrorcreditss32').style.display = "none";
	}
 
	if (gst_name === '' || gst_name.length !== 15) {
		showError = true;
		document.getElementById('productCodeErrorcreditss31').innerText =
			"Please enter a valid 15-character GSTIN (e.g., 29ABCDE1234F1Z5)";
		document.getElementById('productCodeErrorcreditss31').style.display = "inline-block";
	} else {
		document.getElementById('productCodeErrorcreditss31').style.display = "none";
	}
 
	if (code === '') {
		showError = true;
		document.getElementById('productCodeErrorcreditss35').innerText =
			"Please enter Location.";
		document.getElementById('productCodeErrorcreditss35').style.display = "inline-block";
	} else {
		document.getElementById('productCodeErrorcreditss35').style.display = "none";
	}
 
	if (org === '') {
		showError = true;
		document.getElementById('productCodeErrorcreditss30').innerText =
			"Please select Organization.";
		document.getElementById('productCodeErrorcreditss30').style.display = "inline-block";
	} else {
		document.getElementById('productCodeErrorcreditss30').style.display = "none";
	}
 
	if (stateValue === '') {
		showError = true;
		document.getElementById('productCodeErrorcreditss344').innerText =
			"Please select state.";
		document.getElementById('productCodeErrorcreditss344').style.display = "inline-block";
	} else {
		document.getElementById('productCodeErrorcreditss344').style.display = "none";
	}
 
 
	if (!showError && state_id) {
		if (!gst_name.toUpperCase().startsWith(state_id)) {
			showError = true;
			document.getElementById('productCodeErrorcreditss31').innerText =
				"GST must start with selected State ID (" + state_id + ")";
			document.getElementById('productCodeErrorcreditss31').style.display = "inline-block";
		}
	}
	if (pannumber === '' || pannumber.length !== 10) {
	    showError = true;
	    document.getElementById('productCodeErrorcreditsspan').innerText =
	        "Please enter a valid 10-character PAN number (e.g., ABCDE1234F).";
	    document.getElementById('productCodeErrorcreditsspan').style.display = "inline-block";
	} else {
	    document.getElementById('productCodeErrorcreditsspan').style.display = "none";
	}
 
	/* ================= FINAL ================= */
	if (!showError) {
 
		$('#exampleModalCenter66').modal('show');
	}
}
 
function addevent() {
 
	$('#exampleModalCenter66').modal('hide');
	// Validate role code and role description
	$.ajax({
		url: new URL('/jssl/businessunits/addBusinessUnit', baseUrl), // Move 'const' to the correct place
		type: 'POST',
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		data: jQuery.param({ business_unit_name: categoryPrefix.value, gst_number: inputName.value, location: inputNamebar.value, state_id: stateDropdown.value, org_id: orgDropdown.value, created_by: createdById ,panNumber:panNumber}),
		success: function(data) {
			var result = data.message; // No need to stringify
 
			if (result === "Success") {
				// Store permissions in sessionStorage
				const popup = $('<div class="popup">Busniess unit Details Created Successfully!</div>')
					.appendTo('body').hide().fadeIn(400);
 
				setTimeout(function() {
					popup.fadeOut(400, function() {
						$(this).remove();
						window.location = 'businessunit.jsp'; // Redirect to role list page
					});
				}, 800);
			} else {
				const errorMessage = data.message || 'Failed to create business unit master.';
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
 
 
function getParameterByName(name, url = window.location.href) {
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
 
function openModaledit() {
 
	const username = document.getElementById('categoryPrefix11').value.trim();
	const gst = document.getElementById('inputName11').value.trim();
	const code = document.getElementById('inputNamebar11').value.trim();
	const org = document.getElementById('orgDropdown11').value.trim();
	const pannumber = document.getElementById('panNumberUp').value.trim();
	const stateSelect = document.getElementById('stateDropdown11');
	const state = stateSelect ? stateSelect.value.trim() : '';
	const selectedOption = stateSelect ? stateSelect.options[stateSelect.selectedIndex] : null;
 
	
	const state_id = selectedOption && selectedOption.dataset
		? selectedOption.dataset.stateId || ''
		: '';
 
	let showError = false;
 
	
 
	if (username === '') {
		showEditError('productCodeErrorcreditss3211', "Please enter business unit name.");
		showError = true;
	} else hideEditError('productCodeErrorcreditss3211');
 
	if (gst === '' || gst.length !== 15) {
		showEditError(
			'productCodeErrorcreditss3111',
			"Please enter a valid 15-character GSTIN (e.g., 29ABCDE1234F1Z5)"
		);
		showError = true;
	}
	// 🔥 GST vs STATE CHECK
	else if (state_id && !gst.toUpperCase().startsWith(state_id)) {
		showEditError(
			'productCodeErrorcreditss3111',
			"GST must start with selected State ID (" + state_id + ")"
		);
		showError = true;
	}
	else {
		hideEditError('productCodeErrorcreditss3111');
	}
 
	if (code === '') {
		showEditError('productCodeErrorcreditss3511', "Please enter Location.");
		showError = true;
	} else hideEditError('productCodeErrorcreditss3511');
 
	if (org === '') {
		showEditError('productCodeErrorcreditss3011', "Please select Organization.");
		showError = true;
	} else hideEditError('productCodeErrorcreditss3011');
 
	if (state === '') {
		showEditError('productCodeErrorcreditss34411', "Please select state.");
		showError = true;
	} else hideEditError('productCodeErrorcreditss34411');
 
	
	if (pannumber === '' || pannumber.length !== 10) {
	    showError = true;
	    document.getElementById('productCodeErrorcreditsspanUp').innerText =
	        "Please enter a valid 10-character PAN number (e.g., ABCDE1234F).";
	    document.getElementById('productCodeErrorcreditsspanUp').style.display = "inline-block";
	} else {
	    document.getElementById('productCodeErrorcreditsspanUp').style.display = "none";
	}
	
	if (!showError) {
		$('#exampleModalCenterupdate').modal('show');
	}
}
 
 
 
function showEditError(id, msg) {
	const el = document.getElementById(id);
	el.innerText = msg;
	el.style.display = "inline-block";
}
 
function hideEditError(id) {
	const el = document.getElementById(id);
	el.innerText = "";
	el.style.display = "none";
}
 
 
let originalBusinessUnitData = {};
function editRecord(business_unit_id) {
	// alert("ID: " + id);
	// Make an AJAX request to the API
		  const allowed = allowedActions || [];
 
	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
	const url = new URL(`/jssl/businessunits/searchbusinessunits`, baseUrl);
	var params = [['business_unit_id', business_unit_id]];
	url.search = new URLSearchParams(params).toString();
 
	fetch(url, { credentials: "include" })
		.then(response => response.json())
		.then(response => {
			if (response.status === 'yes' && response.Data) {
				// Populate form fields with the data from the response
				$('#categoryPrefix11').val(response.Data.business_unit_name);
				$('#inputName11').val(response.Data.gst_number);
				$('#inputNamebar11').val(response.Data.location);
				$('#stateDropdown11').val(response.Data.state_id);
				$('#orgDropdown11').val(response.Data.org_id);
				$('#id11').val(response.Data.business_unit_id);
				$("#panNumberUp").val(response.Data.pan_number ?? '');
				
				
				originalBusinessUnitData = {
				                    business_unit_name: response.Data.business_unit_name,
				                    gst_number:response.Data.gst_number,
				                    location: response.Data.location,
				                    state_id: response.Data.state_id,
				                    org_id: response.Data.org_id,
				                    business_unit_id: response.Data.business_unit_id,
									 pan_number: response.Data.pan_number ?? ''
									
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
 
 
 
function getCurrentBusinessUnitData() {
    return {
        business_unit_name: $('#categoryPrefix11').val().trim(),
        gst_number: $('#inputName11').val().trim(),
        location: $('#inputNamebar11').val().trim(),
        state_id: $('#stateDropdown11').val(),
        org_id: $('#orgDropdown11').val(),
        business_unit_id: $('#id11').val(),
		pan_number: $('#panNumberUp').val().trim()
    };
}
 
function hasBusinessUnitChanged() {
    const currentData = getCurrentBusinessUnitData();
    for (let key in originalBusinessUnitData) {
        if ((originalBusinessUnitData[key] ?? '').toString().trim() !== (currentData[key] ?? '').toString().trim()) {
            return true; // change detected
        }
    }
    return false; // no change
}
 
function isGstChanged() {
    const originalGST = (originalBusinessUnitData.gst_number ?? '').trim();
    const currentGST = ($('#inputName11').val() ?? '').trim();
    return originalGST !== currentGST;
}
 
function editevent(){
	$('#exampleModalCenterupdate').modal('show');
	if (!hasBusinessUnitChanged()) {
		const popup = $('<div class="popup">No Feilds Changes</div>')
							.appendTo('body').hide().fadeIn(400);
 
						setTimeout(function() {
							popup.fadeOut(400, function() {
								$(this).remove();
								window.location = 'businessunit.jsp'; // Redirect to role list page
							});
						}, 800);
	       return;
	   }
	   else{
		editeventUpdated();
	   }
 
}
 
function editeventUpdated() {
	
	const gstChanged = isGstChanged();
	// Validate role code and role description
	$.ajax({
		url: new URL('/jssl/businessunits/updateBusinessUnit', baseUrl), // Move 'const' to the correct place
		type: 'POST',
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		data: jQuery.param({ business_unit_name: categoryPrefix11.value, gst_number: inputName11.value.trim(), location: inputNamebar11.value, state_id: stateDropdown11.value, org_id: orgDropdown11.value, modified_by: createdById, business_unit_id: id11.value,gstChanged: gstChanged,panNumberUp:panNumberUp.value }),
		success: function(data) {
			var result = data.message; // No need to stringify
 
			if (result === "Success") {
				// Store permissions in sessionStorage
				const popup = $('<div class="popup">Busniess unit Details updated Successfully!</div>')
					.appendTo('body').hide().fadeIn(400);
 
				setTimeout(function() {
					popup.fadeOut(400, function() {
						$(this).remove();
						window.location = 'businessunit.jsp'; // Redirect to role list page
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