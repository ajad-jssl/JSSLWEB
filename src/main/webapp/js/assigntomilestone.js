


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




const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

document.addEventListener("DOMContentLoaded", async function () {
	
	
await	loadActions();
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchUserList(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchUserList() {
	fetchUserListupdate(selectedFactoryId);
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listmilestonemasternew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

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
        const selectElement = document.getElementById("mile");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select milestone</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.milestone_id && type.milestone_concat) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.milestone_id; // Backend keeps saleorder_id
                option.textContent = type.milestone_concat; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchUserListupdate(factoryId) {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listmilestonemasternew`, baseUrl);
    /*    url.searchParams.append("factory_id", factoryId);*/

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
        const selectElement = document.getElementById("mileupdate");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select milestone</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.milestone_id && type.milestone_concat) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.milestone_id; // Backend keeps saleorder_id
                option.textContent = type.milestone_concat; // Display saleorder_typename
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
        fetchcont(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchcont() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/contract/listcontractfromcontractornew`, baseUrl);
   

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
        const selectElement = document.getElementById("cont");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select contractor</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.contract_id && type.contract_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.contract_id; // Backend keeps saleorder_id
                option.textContent = type.contract_name; // Display saleorder_typename
				option.setAttribute("data-factory", type.factory_id);
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

document.getElementById('cont').addEventListener('change', function() {
    const selectedStateId = this.value; // Get the selected state ID
/*    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage*/
	const selectedOption = this.options[this.selectedIndex];
	   const factoryId = selectedOption.getAttribute("data-factory");

   // Clear the table as soon as a new selection is made
    clearTable();
    document.getElementById('tableContainer').style.display = 'none';

    if (selectedStateId) {
        fetchGSTStateInfo(selectedStateId); // Call the API if valid IDs exist
    } else {
        console.error("Missing contract_id or factory_id.");
    }
});

async function fetchGSTStateInfo(stateId) {
    try {
	    const url = new URL(`/jssl/listassignmilestoneforcontractornew`, baseUrl);
        const params = new URLSearchParams();
        params.append('contract_id', stateId);
        url.search = params.toString();

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        const data = await response.json();

        if (data.status === 'yes' && Array.isArray(data.DATA) && data.DATA.length > 0) {
            document.getElementById('tableContainer').style.display = 'block'; // Show table
            populateTable(data.DATA);
        } else {
            console.warn("No data found for the selected state.");
            clearTable();
            document.getElementById('tableContainer').style.display = 'none'; // Hide table if no data
        }
    } catch (error) {
        console.error("Error fetching GST state info:", error);
    }
}

// Function to populate the table with the fetched data
function populateTable(data) {
    const tableBody = document.querySelector('#tableID tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.milestone_name}</td>
            <td><i class="fa fa-pen" onclick="editRecord('${item.id}')"></i></td>
        `;
        tableBody.appendChild(row);
    });

    // Destroy existing DataTable instance before re-initializing
    if ($.fn.DataTable.isDataTable('#tableID')) {
        $('#tableID').DataTable().destroy();
    }

    // Reinitialize DataTable
    $('#tableID').DataTable();
}


// Function to clear the table
function clearTable() {
    const tableBody = document.querySelector('#tableID tbody');
    tableBody.innerHTML = '<tr><td colspan="2">No data available.</td></tr>';
    
    // Destroy existing DataTable instance before clearing it
    if ($.fn.DataTable.isDataTable('#tableID')) {
        $('#tableID').DataTable().clear().destroy();
    }
}

function openModalAdd() {

	
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalCenter66').modal('hide');
	  return;
	}
	
    var username = document.getElementById('cont').value.trim();
	var name = document.getElementById('mile').value.trim();
	var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcredit').innerText = "Please select contractor.";
        document.getElementById('productCodeErrorcredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit').innerText = "";
        document.getElementById('productCodeErrorcredit').style.display = "none";
    }
	if (name === '') {
	       document.getElementById('productCodeErrorcredit1').innerText = "Please select milestone.";
	       document.getElementById('productCodeErrorcredit1').style.display = "inline-block";
	       showError = true;
	   } else {
	       document.getElementById('productCodeErrorcredit1').innerText = "";
	       document.getElementById('productCodeErrorcredit1').style.display = "none";
	   }
	// If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addevent() {
    // Validate role code and role description
	
	$("#exampleModalCenter66").modal("hide");
	const selectedOption = document.getElementById("cont").selectedOptions[0];
	const factoryId = selectedOption.getAttribute("data-factory");
    $.ajax({
        url: new URL('/jssl/milestoneassigncontractnew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({milestone_id:mile.value,created_by:createdById,contract_id:cont.value,factory_id:factoryId}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Milestone Assigned Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'contractormilestone.jsp'; // Redirect to role list page
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

function editRecord(id) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
	  const allowed = window.allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/milestoneassigncontractsearchnew`, baseUrl);
    var params = [['id', id]];
    url.search = new URLSearchParams(params).toString();

  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.Data) {
                // Populate form fields with the data from the response
                $('#mileupdate').val(response.Data.milestone_id);
                $('#mileupdateid').val(response.Data.id);
                // Open the modal
                $('#exampleModalScrollableupdate').modal('show');
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

// for validation please give 
function openModalMileUpdate() {
    var username = document.getElementById('mileupdate').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please select milestone.";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
    }
   
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66update').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function updatemile() {
	// Get selected contract_id from the dropdown
    const contractId = document.getElementById("cont").value; 

    if (!contractId) {
        console.error("No contractor selected.");
        return; // Stop execution if no contractor is selected
    }
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/milestoneassigncontractupdatenew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
        dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
        data: jQuery.param({milestone_id:mileupdate.value,modified_by:createdById,
        contract_id:contractId,
        factory_id:selectedFactoryId,
        id:mileupdateid.value
        }),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Milestone Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'contractormilestone.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create country.';
                $('#errorMessage').text(errorMessage); // Set the error message dynamically
                $('#exampleModalCenterDup').modal('show'); // Show the modal with the error message
                $('#exampleModalCenter66update').modal('hide');
                $('#exampleModalScrollableupdate').modal('hide');
            }
        },
        error: function() {
            // Handle AJAX error
            console.error('Request failed.');
        }
    });
}
