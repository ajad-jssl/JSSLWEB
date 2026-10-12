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
		const url = new URL(`/jssl/state/getAllStatesNew`, baseUrl);
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
                    <th>State Id</th>
                    <th>State Code</th>
					<th>State Name</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;

		json.StateDetailsNew.forEach(item => {
			tableContent += `
                <tr>
                    <td>${item.state_id}</td>
                     <td>${item.state_code}</td>
					 <td>${item.state_name}</td>
                    <td><i class="fa fa-pen" onclick="editRecord('${item.id}')"></i></td>
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
document.addEventListener("DOMContentLoaded", function () {
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

document.addEventListener("DOMContentLoaded", function () {
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
        const selectElement = document.getElementById("countrycode1");

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
// for validation please give 
function openModalAdd() {
	var username = document.getElementById('taxname').value.trim();
	var username11 = document.getElementById('taxvalue').value.trim();
	var state = document.getElementById('taxvaluedesc').value.trim();
	var countryId = document.getElementById('countrycode').value.trim();
	var showError = false; // Initialize showError variable

	// Username Validation
	if (username === '') {
		document.getElementById('productCodeErrorcreditAA').innerText = "Please State Id.";
		document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('productCodeErrorcreditAA').innerText = "";
		document.getElementById('productCodeErrorcreditAA').style.display = "none";
	}
	if (username11 === '') {
		document.getElementById('productCodeErrorcreditAA1').innerText = "Please Enter State Code.";
		document.getElementById('productCodeErrorcreditAA1').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('productCodeErrorcreditAA1').innerText = "";
		document.getElementById('productCodeErrorcreditAA1').style.display = "none";
	}
	if (state === '') {
		document.getElementById('productCodeErrormiledesc').innerText = "Please Enter State Name.";
		document.getElementById('productCodeErrormiledesc').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('productCodeErrormiledesc').innerText = "";
		document.getElementById('productCodeErrormiledesc').style.display = "none";
	}
	if (countryId === '') {
		document.getElementById('productCodeErrorcredit').innerText = "Please Select Country.";
		document.getElementById('productCodeErrorcredit').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('productCodeErrorcredit').innerText = "";
		document.getElementById('productCodeErrorcredit').style.display = "none";
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
		url: new URL('/jssl/state/createStateNew', baseUrl), // Move 'const' to the correct place
		type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
		dataType: 'json',
		data: jQuery.param({state_id: taxname.value, created_by: createdById,state_code: taxvalue.value, state_name: taxvaluedesc.value, country_id: countrycode.value }),
		success: function(data) {
			var result = data.message; // No need to stringify

			if (result === "Success") {
				// Store permissions in sessionStorage
				const popup = $('<div class="popup">State Master Created Successfully!</div>')
					.appendTo('body').hide().fadeIn(400);

				setTimeout(function() {
					popup.fadeOut(400, function() {
						$(this).remove();
						window.location = 'statemaster.jsp'; // Redirect to role list page
					});
				}, 800);
			} else {
				const errorMessage = data.message || 'Failed to create country.';
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
	var username = document.getElementById('taxname1').value.trim();
	var username11 = document.getElementById('taxvalue1').value.trim();
	var state = document.getElementById('stateedit').value.trim();
	var countryCode = document.getElementById('countrycode1').value.trim();
	var showError = false; // Initialize showError variable

	// Username Validation
	if (username === '') {
		document.getElementById('productCodeErrorcreditss').innerText = "Please Enter State Id.";
		document.getElementById('productCodeErrorcreditss').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('productCodeErrorcreditss').innerText = "";
		document.getElementById('productCodeErrorcreditss').style.display = "none";
	}
	if (username11 === '') {
		document.getElementById('productCodeErrorcreditss1').innerText = "Please Enter State Code.";
		document.getElementById('productCodeErrorcreditss1').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('productCodeErrorcreditss1').innerText = "";
		document.getElementById('productCodeErrorcreditss1').style.display = "none";
	}
	if (state === '') {
		document.getElementById('productCodeErrorcreditsedit').innerText = "Please Enter State Name.";
		document.getElementById('productCodeErrorcreditsedit').style.display = "inline-block";
		showError = true;
	} else {
		document.getElementById('productCodeErrorcreditsedit').innerText = "";
		document.getElementById('productCodeErrorcreditsedit').style.display = "none";
	}
	if (countryCode === '') {
			document.getElementById('productCodeErrorcreditcoun1').innerText = "Please Select Country.";
			document.getElementById('productCodeErrorcreditcoun1').style.display = "inline-block";
			showError = true;
		} else {
			document.getElementById('productCodeErrorcreditcoun1').innerText = "";
			document.getElementById('productCodeErrorcreditcoun1').style.display = "none";
		}
	// If no errors, proceed
	if (!showError) {
		$('#exampleModalCenterupdate').modal('show'); // Show the next modal (Ensure this modal exists)
	}
}



let originalStateData = {};
function editRecord(state_id) {
   // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/state/getStatesByIdNew`, baseUrl);
    var params = [['state_id', state_id]];
    url.search = new URLSearchParams(params).toString();

   fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            $('#stateedit').val(response.state_name);
            $('#taxvalue1').val(response.state_code);
			$('#countrycode1').val(response.country_id);
			$('#taxname1').val(response.state_id);
            $('#sateid').val(response.id);
			
			originalStateData = {
			              state_name: response.state_name ?? '',
			              state_code: response.state_code ?? '',
			              country_id: response.country_id ?? '',
			              state_id: response.state_id ?? '',
			              id: response.id ?? ''
			          };

             // Open the modal
            $('#exampleModalScrollableedit').modal('show');
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
        });
}


function getCurrentStateData() {
    return {
        state_name: $('#stateedit').val().trim(),
        state_code: $('#taxvalue1').val().trim(),
        country_id: $('#countrycode1').val(),
        state_id: $('#taxname1').val(),
        id: $('#sateid').val()
    };
}


function hasStateChanged() {
    const current = getCurrentStateData();

    for (let key in originalStateData) {
        if ((originalStateData[key] ?? '').toString().trim() !==
            (current[key] ?? '').toString().trim()) {
            return true;
        }
    }
    return false;
}


function hasStateNameChanged() {
    const current = getCurrentStateData();

    return (
        originalStateData.state_name !== current.state_name
      
    );
}

function hasStateCodeChanged(){
	const current = getCurrentStateData();
	return (
		originalStateData.state_code  !== current.state_code
	);
}

function hasStateIdChaged(){
	const current = getCurrentStateData();
	return (originalStateData.state_id !== current.state_id);
}





function editevent() {
	$('#exampleModalCenterupdate').modal('hide');
    if (!hasStateChanged()) {
		const popup = $('<div class="popup">No Feilds Changes</div>')
						.appendTo('body').hide().fadeIn(400);

					setTimeout(function() {
						popup.fadeOut(400, function() {
							$(this).remove();
							window.location = 'statemaster.jsp'; // Redirect to role list page
						});
					}, 800);        return;
    }

  else{

   

    // ✅ send ONLY ONE boolean flag
    editeventUpdated();
	}
}







function editeventUpdated() {
	// Validate role code and role description
	const checkDuplicateStateName = hasStateNameChanged();
	const checkDuplicateStateCode = hasStateCodeChanged();
	const CheckDuplicateStateId = hasStateIdChaged();
	$.ajax({
		url: new URL('/jssl/state/updateStateNew', baseUrl), // Move 'const' to the correct place 		state_code, state_name, state_id, modified_by, factory_id, country_id, 							id
		type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
		dataType: 'json',
		data: jQuery.param({state_id: taxname1.value, modified_by: createdById, id: sateid.value, factory_id: selectedFactoryId,state_code: taxvalue1.value, state_name: stateedit.value, 
			country_id: countrycode1.value,checkName :checkDuplicateStateName,checkCode:checkDuplicateStateCode,checkStateId:CheckDuplicateStateId}),
		success: function(data) {
			var result = data.message; // No need to stringify

			if (result === "Success") {
				// Store permissions in sessionStorage
				const popup = $('<div class="popup">State Master Updated Successfully!</div>')
					.appendTo('body').hide().fadeIn(400);

				setTimeout(function() {
					popup.fadeOut(400, function() {
						$(this).remove();
						window.location = 'statemaster.jsp'; // Redirect to role list page
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
function getParameterByName(name, url = window.location.href) {
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
