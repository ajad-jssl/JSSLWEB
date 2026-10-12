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
        const url = new URL(`/jssl/master/listgstmasternew`, baseUrl);
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
                    <th>State GST NO</th>
                    <th>State Name</th>
                    <th>State Code</th>
					<th>SAP BU Code</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.Data.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.state_gstno}</td>
                     <td>${item.state_name}</td>
                     <td>${item.state_code }-${item.state_id}</td>
					 <td style="text-align:right">${item.sap_bucode}</td>
                    <td style="text-align:center"><i class="fa fa-pen" onclick="editRecord('${item.bu_id}')"></i></td>
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
        const selectElement = document.getElementById("statecode");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select state</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.StateDetailsNew.forEach((type) => {
            if (type.id && type.state_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.state_name; 
				option.dataset.stateId = type.state_id;
// Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}



document.getElementById("statecode").addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];

    if (!selectedOption || !selectedOption.dataset.stateId) {
        document.getElementById("statecodenumber").value = "";
        return;
    }

    //  set state_id (numeric code like 29)
    document.getElementById("statecodenumber").value =
        selectedOption.dataset.stateId;
});

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypesEdit();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

// fetching the drop down list from sate
async function fetchSaleOrderTypesEdit() {
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
        const selectElement = document.getElementById("stateedit");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select state</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.StateDetailsNew.forEach((type) => {
            if (type.id && type.state_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.state_name; 
				option.dataset.stateId = type.state_id;// Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}


document.getElementById("stateedit").addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];

    if (!selectedOption || !selectedOption.dataset.stateId) {
        document.getElementById("statecodenumberup").value = "";
        return;
    }

    //  set state_id (numeric code like 29)
    document.getElementById("statecodenumberup").value =
        selectedOption.dataset.stateId;
});

// for validation please give 
function openModalAdd() {
    var username = document.getElementById('taxname').value.trim().toUpperCase();
    var username11 = document.getElementById('taxvalue').value.trim();
    var state = document.getElementById('statecode').value.trim();
    var state_code = document.getElementById('statecodenumber').value.trim();

    var showError = false;

    /* GST VALIDATION */
    if (username === '' || username.length !== 15) {
        document.getElementById('productCodeErrorcreditAA').innerText =
            "Please enter a valid 15-character GSTIN (e.g., 29ABCDE1234F1Z5)";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
    }

    /* SAP CODE */
    if (username11 === '') {
        document.getElementById('productCodeErrorcreditAA1').innerText =
            "Please enter SAP BU code";
        document.getElementById('productCodeErrorcreditAA1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA1').innerText = "";
        document.getElementById('productCodeErrorcreditAA1').style.display = "none";
    }

    /* STATE */
    if (state === '') {
        document.getElementById('productCodeErrorcredit').innerText =
            "Please select state";
        document.getElementById('productCodeErrorcredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit').innerText = "";
        document.getElementById('productCodeErrorcredit').style.display = "none";
    }

    /* GST vs STATE CODE CHECK (ONLY IF ABOVE ARE OK) */
    if (
        username.length === 15 &&
        state_code !== '' &&
        !username.startsWith(state_code)
    ) {
        document.getElementById('productCodeErrorcreditAA').innerText =
            "GST Number must start with the selected state code";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    }

    /* FINAL */
    if (!showError) {
        $('#exampleModalCenter66').modal('show');
    }
}


function addevent() {
	
	$('#exampleModalCenter66').modal('hide');
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/master/addgstmasternew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({sap_bucode:taxvalue.value.trim(),created_by:createdById,state_code:statecode.value,state_gstno:taxname.value.trim()}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">GST Master Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'Gstmaster.jsp'; // Redirect to role list page
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

/*function editRecord(bu_id) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
    const url = new URL(`/jssl/master/searchgstmasternew`, baseUrl);
    var params = [['buId', bu_id]];
    url.search = new URLSearchParams(params).toString();

fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.DATA) {
                // Populate form fields with the data from the response
                $('#taxname1').val(response.DATA.state_gstno);
                $('#taxvalue1').val(response.DATA.sap_bucode);
				$('#stateedit').val(response.DATA.state_id);
				$('#statecodenumberup').val(response.DATA.state_id);
                $('#id').val(response.DATA.bu_id);
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
}*/


let originalGSTEditData = null;

function editRecord(bu_id) {
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/master/searchgstmasternew`, baseUrl);
    url.search = new URLSearchParams({ buId: bu_id }).toString();

    fetch(url, { credentials: "include" })
        .then(res => res.json())
        .then(response => {
            if (response.status === 'yes' && response.DATA) {

                $('#taxname1').val(response.DATA.state_gstno);
                $('#taxvalue1').val(response.DATA.sap_bucode);

                // 1️⃣ Set dropdown value (state_id)
                const stateSelect = document.getElementById("stateedit");
                stateSelect.value = response.DATA.state_id;

                // 2️⃣ Get selected option from dropdown
                const selectedOption =
                    stateSelect.options[stateSelect.selectedIndex];

                // 3️⃣ Read dataset and set state code input
                document.getElementById("statecodenumberup").value =
                    selectedOption?.dataset?.stateId || "";

                $('#id').val(response.DATA.bu_id);
				
				originalGSTEditData = {
				                  state_id: String(response.DATA.state_id),
				                  state_code: String(selectedOption?.dataset?.stateId || ""),
				                  gst_no: String(response.DATA.state_gstno).trim().toUpperCase(),
				                  sap_bucode: String(response.DATA.sap_bucode).trim()
				              };
                $('#exampleModalScrollableedit').modal('show');
            }
        })
        .catch(console.error);
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
    var username = document.getElementById('taxname1').value.trim().toUpperCase();
    var username11 = document.getElementById('taxvalue1').value.trim();
    var state = document.getElementById('stateedit').value.trim();
    var state_code_up = document.getElementById('statecodenumberup').value.trim();

    var showError = false;

    // GST validation
    if (username === '' || username.length !== 15) {
        document.getElementById('productCodeErrorcreditss').innerText =
            "Please enter a valid 15-character GSTIN (e.g., 29ABCDE1234F1Z5)";
        document.getElementById('productCodeErrorcreditss').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss').innerText = "";
        document.getElementById('productCodeErrorcreditss').style.display = "none";
    }

    // SAP code
    if (username11 === '') {
        document.getElementById('productCodeErrorcreditss1').innerText =
            "Please enter SAP BU code";
        document.getElementById('productCodeErrorcreditss1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss1').innerText = "";
        document.getElementById('productCodeErrorcreditss1').style.display = "none";
    }

    // State
    if (state === '') {
        document.getElementById('productCodeErrorcreditsedit').innerText =
            "Please select state";
        document.getElementById('productCodeErrorcreditsedit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsedit').innerText = "";
        document.getElementById('productCodeErrorcreditsedit').style.display = "none";
    }

    // GST vs state code
    if (
        username.length === 15 &&
        state_code_up !== '' &&
        !username.startsWith(state_code_up)
    ) {
        document.getElementById('productCodeErrorcreditss').innerText =
            "GST Number must start with the selected state code";
        document.getElementById('productCodeErrorcreditss').style.display = "inline-block";
        showError = true;
    }

    if (!showError) {
	
     $('#exampleModalCenterupdate').modal('show');
    }
}

function editevent(){
	$('#exampleModalCenterupdate').modal('hide');
	if (!hasGSTEditDataChanged()) {
		const popup = $('<div class="popup">No Fields Changes</div>')
				                  .appendTo('body').hide().fadeIn(400);

				              setTimeout(function() {
				                  popup.fadeOut(200, function() {
				                      $(this).remove();
				                      window.location = 'Gstmaster.jsp'; // Redirect to role list page
				                  });
				              }, 800);
	    return;
	}else{
		editeventUpdate();
	}
}


function hasGSTEditDataChanged() {
    if (!originalGSTEditData) return true;

    const currentData = {
        state_id: document.getElementById("stateedit").value.trim(),
        state_code: document.getElementById("statecodenumberup").value.trim(),
        gst_no: document.getElementById("taxname1").value.trim().toUpperCase(),
        sap_bucode: document.getElementById("taxvalue1").value.trim()
    };

    return (
        currentData.state_id !== originalGSTEditData.state_id ||
        currentData.state_code !== originalGSTEditData.state_code ||
        currentData.gst_no !== originalGSTEditData.gst_no ||
        currentData.sap_bucode !== originalGSTEditData.sap_bucode
    );
}

function editeventUpdate() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/master/updategstmasternew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({sap_bucode:taxvalue1.value,modified_by:createdById,state_code:stateedit.value,state_gstno:taxname1.value,bu_id:id.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">GST Master Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'Gstmaster.jsp'; // Redirect to role list page
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
