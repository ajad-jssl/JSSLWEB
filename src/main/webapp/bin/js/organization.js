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
        const url = new URL(`/jssl/organization/listorganization`, baseUrl);
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
                    <th>Organization Name</th>
                    <th>GST Number</th>
                    <th>Registered Address</th>
                    <th>Business Address</th>
                    <th>Location</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.Data.forEach(item => {
            tableContent += `
                <tr>
                     <td>${item.org_name}</td>
                     <td>${item.gst_number}</td>
                     <td>${item.registered_address}</td>
                     <td>${item.business_address}</td>
                     <td>${item.location}</td>
                     <td><i class="fa fa-pen" onclick="editRecord('${item.org_id}')"></i></td>
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
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypes();
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

// fetching the drop down list from sate
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
        const selectElement = document.getElementById("state");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select state</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.StateDetailsNew.forEach((type) => {
            if (type.id && type.state_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.state_name+ '-' +type.state_id;
				 option.dataset.stateId = String(type.state_id);  // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypes1();
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

// fetching the drop down list from sate
async function fetchSaleOrderTypes1() {
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
        const selectElement = document.getElementById("state1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select state</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.StateDetailsNew.forEach((type) => {
            if (type.id && type.state_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.state_name+' - '+type.state_id;
				  option.dataset.stateId = String(type.state_id);
				 
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

function openModalAdd() {
    const username = document.getElementById('taxname').value.trim();
    const username11 = document.getElementById('taxvalue').value.trim();
    const buad = document.getElementById('buadd').value.trim();
    const loc = document.getElementById('loc').value.trim();

  
    const stateSelect = document.getElementById('state');
    const state = stateSelect ? stateSelect.value.trim() : '';
    const selectedOption = stateSelect ? stateSelect.options[stateSelect.selectedIndex] : null;

    // read stored state_id from data- attribute
    const state_id = selectedOption && selectedOption.dataset ? selectedOption.dataset.stateId || '' : '';

    const gst = document.getElementById('gst').value.trim();

    let showError = false;

    // Validation examples (same as yours, unchanged)
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please enter organization name.";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
    }

    if (username11 === '') {
        document.getElementById('productCodeErrorcreditAA1').innerText = "Please enter Registered address.";
        document.getElementById('productCodeErrorcreditAA1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA1').innerText = "";
        document.getElementById('productCodeErrorcreditAA1').style.display = "none";
    }

    if (buad === '') {
        document.getElementById('productCodeErrorcredit').innerText = "Please enter Business address.";
        document.getElementById('productCodeErrorcredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit').innerText = "";
        document.getElementById('productCodeErrorcredit').style.display = "none";
    }

    if (loc === '') {
        document.getElementById('productCodeErrorcredit2').innerText = "Please enter location.";
        document.getElementById('productCodeErrorcredit2').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit2').innerText = "";
        document.getElementById('productCodeErrorcredit2').style.display = "none";
    }

    if (state === '') {
        document.getElementById('productCodeErrorcredit6').innerText = "Please select state.";
        document.getElementById('productCodeErrorcredit6').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit6').innerText = "";
        document.getElementById('productCodeErrorcredit6').style.display = "none";
    }

    if (gst === '' || gst.length !== 15) {
        document.getElementById('productCodeErrorcredit1').innerText = "Please enter a valid 15-character GSTIN (e.g., 29ABCDE1234F1Z5)";
        document.getElementById('productCodeErrorcredit1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit1').innerText = "";
        document.getElementById('productCodeErrorcredit1').style.display = "none";
    }

    // Example: if you want to ensure GST starts with state_id (if state_id available)
    if (!showError && state_id) {
        // some backends use numeric state_id at start of GST (e.g., "29")
        if (!gst.toUpperCase().startsWith(state_id)) {
            document.getElementById('productCodeErrorcredit1').innerText = "GST must start with the selected state's ID (" + state_id + ")";
            document.getElementById('productCodeErrorcredit1').style.display = "inline-block";
            showError = true;
        }
    }

    if (!showError) {
        // you can keep the state_id for sending to backend
        // e.g. put it into a hidden input or include while submitting
        // document.getElementById('state_id_hidden').value = state_id;

        $('#exampleModalCenter66').modal('show');
    }
}


function addevent() {
	$('#exampleModalCenter66').modal('hide');
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/organization/addorganization', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({org_name:taxname.value,created_by:createdById,registered_address:taxvalue.value,
        business_address:buadd.value,gst_number:gst.value,location:loc.value,state_id:state.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Organization Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'Organization.jsp'; // Redirect to role list page
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

let originalOrgData = {};

function editRecord(org_id) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/organization/searchorganziation`, baseUrl);
    var params = [['org_id', org_id]];
    url.search = new URLSearchParams(params).toString();

  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.DATA) {
                // Populate form fields with the data from the response
                $('#taxname1').val(response.DATA.org_name);
                $('#taxvalue1').val(response.DATA.registered_address);
                $('#buadd1').val(response.DATA.business_address);
                $('#gst1').val(response.DATA.gst_number);
                $('#loc1').val(response.DATA.location);
                $('#state1').val(response.DATA.state_id);
                $('#id').val(response.DATA.org_id);
				
				originalOrgData = {
				               org_name: response.DATA.org_name.trim() || '',
				               registered_address: response.DATA.registered_address.trim() || '',
				               business_address: response.DATA.business_address.trim() || '',
				               gst_number: response.DATA.gst_number.trim() || '',
				               location: response.DATA.location.trim() || '',
				               state_id: response.DATA.state_id.trim() || ''
                }
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

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function openModalEdit() {

    const username = document.getElementById('taxname1').value.trim();
    const username11 = document.getElementById('taxvalue1').value.trim();
    const buad = document.getElementById('buadd1').value.trim();
    const loc = document.getElementById('loc1').value.trim();

    const stateSelect = document.getElementById('state1');
    const state = stateSelect ? stateSelect.value.trim() : '';
    const selectedOption = stateSelect ? stateSelect.options[stateSelect.selectedIndex] : null;

    // 🔥 SAME AS CREATE
    const state_id = selectedOption && selectedOption.dataset
        ? selectedOption.dataset.stateId || ''
        : '';

    const gst = document.getElementById('gst1').value.trim();

    let showError = false;

    // ---------- SAME VALIDATIONS AS CREATE ----------

    if (username === '') {
        showEditError('productCodeErrorcreditAA11', "Please enter organization name.");
        showError = true;
    } else hideEditError('productCodeErrorcreditAA11');

    if (username11 === '') {
        showEditError('productCodeErrorcreditAA111', "Please enter Registered address.");
        showError = true;
    } else hideEditError('productCodeErrorcreditAA111');

    if (buad === '') {
        showEditError('productCodeErrorcredit11', "Please enter Business address.");
        showError = true;
    } else hideEditError('productCodeErrorcredit11');

    if (loc === '') {
        showEditError('productCodeErrorcredit211', "Please enter location.");
        showError = true;
    } else hideEditError('productCodeErrorcredit211');

    if (state === '') {
        showEditError('productCodeErrorcredit611', "Please select state.");
        showError = true;
    } else hideEditError('productCodeErrorcredit611');

    // 🔥 GST VALIDATION — EXACT COPY FROM CREATE
    if (gst === '' || gst.length !== 15) {
        showEditError(
            'productCodeErrorcredit111',
            "Please enter a valid 15-character GSTIN (e.g., 29ABCDE1234F1Z5)"
        );
        showError = true;
    }
    else if (state_id && !gst.toUpperCase().startsWith(state_id)) {
        showEditError(
            'productCodeErrorcredit111',
            "GST must start with the selected state's ID (" + state_id + ")"
        );
        showError = true;
    }
    else {
        hideEditError('productCodeErrorcredit111');
    }

    // ---------- FINAL ----------
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


function editevent(){
	const currentData = {
	      org_name: document.getElementById('taxname1').value.trim(),
	      registered_address: document.getElementById('taxvalue1').value.trim(),
	      business_address: document.getElementById('buadd1').value.trim(),
	      gst_number: document.getElementById('gst1').value.trim(),
	      location: document.getElementById('loc1').value.trim(),
	      state_id: document.getElementById('state1').value.trim()
	  };

	  // ✅ Compare original vs current
	  const isChanged = Object.keys(originalOrgData).some(
	      key => originalOrgData[key] !== currentData[key]
	  );

	  if (!isChanged) {
		const popup = $('<div class="popup">No Feilds Changes</div>')
		                   .appendTo('body').hide().fadeIn(400);

		               setTimeout(function() {
		                   popup.fadeOut(400, function() {
		                       $(this).remove();
		                       window.location = 'Organization.jsp'; // Redirect to role list page
		                   });
		               }, 800);
	      return; // ❌ stop update
	  }
	  else{
		editeventUpdate();
	  }
}





function editeventUpdate() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/organization/updateorganization', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({org_name:taxname1.value,modified_by:createdById,factory_id:selectedFactoryId,registered_address:taxvalue1.value,
        business_address:buadd1.value,gst_number:gst1.value,location:loc1.value,state_id:state1.value,org_id:id.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Organization Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'Organization.jsp'; // Redirect to role list page
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
