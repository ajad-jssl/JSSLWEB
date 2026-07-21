const MainPage = 'GPMSMaster.jsp';
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



document.getElementById("modalScroll1").addEventListener("click", function () {
    // show custom message instead of opening modal
	 /* const allowed = window.allowedActions || [];*/
	 const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}
	// Fetch and pre-fill next item number
	   fetch(new URL('/api/items/nextItemNo', baseUrl1), { credentials: "include" })
	       .then(res => res.json())
	       .then(data => {
	           $('#item').val(data.nextItemNo);
	       })
	       .catch(err => console.error('Error fetching next item no:', err));
	$('#exampleModalScrollable123').modal('show');
});


document.addEventListener("DOMContentLoaded", function() {
	
	loadActions();
	
	
    // Fetch departments from the backend
	fetch(new URL('/api/employee/all', baseUrl1), {
	    credentials: "include"
	})
  /*  fetch('http://localhost:8004/api/employee/all')*/
        .then(response => response.json())
        .then(data => {
            // Get the select element
            const departmentSelect = document.getElementById('department1');
            
            // Clear any existing options (if any)
            departmentSelect.innerHTML = '<option value="">Select</option>';
            
            // Loop through the data and create new option elements
            data.forEach(department1 => {
                const option = document.createElement('option');
                option.value = department1.deptID;  // Assuming 'deptID' is the value for option
                option.textContent = department1.deptname;  // Assuming 'deptname' is the text for option
                departmentSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching departments:', error);
        });
});


document.addEventListener("DOMContentLoaded", function () {

    // ✅ Single API call to populate both dropdowns
    fetch(new URL('/api/items/all', baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            populateUnitDropdown('unit', data);    // Add form
            populateUnitDropdown('unitup', data);  // Update modal
        })
        .catch(error => {
            console.error('Error fetching units:', error);
        });

});

// ✅ Reusable function to populate a unit dropdown
function populateUnitDropdown(selectElementId, data) {
    const unitSelect = document.getElementById(selectElementId);
    if (!unitSelect) return;

    unitSelect.innerHTML = '<option value="">Select</option>';

    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.uid;
        option.textContent = item.unit;
        unitSelect.appendChild(option);
    });
}


document.addEventListener("DOMContentLoaded", function() {
    // Fetch city data from the backend
	fetch(new URL('/api/city', baseUrl1), {
	    credentials: "include"
	})
  /*  fetch('http://localhost:8004/api/city/all')  */
        .then(response => response.json()) 
        .then(data => {
            // Get the select element for "city"
            const citySelect = document.getElementById('city');
            
            // Clear any existing options (if any)
            citySelect.innerHTML = '<option value="">Select</option>';
            
            // Loop through the data and create new option elements
            data.forEach(city => {
                const option = document.createElement('option');
                option.value = city.city;  // Assuming 'City' is the value for option
                option.textContent = city.city;  // Assuming 'City' is the text for option
                citySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching cities:', error);
        });
});



document.addEventListener("DOMContentLoaded", function() {
    // Fetch vendor data from the backend (replace with your actual API endpoint)
	fetch(new URL('/api/vendor', baseUrl1)	, {
	    credentials: "include"
	})
   /* fetch('http://localhost:8004/api/vendor/all')  // This is your Spring Boot API endpoint*/
        .then(response => response.json())  // Parse the JSON response
        .then(data => {
            console.log(data);  // Log the data to the console for debugging
            
            // Get the select element for vendor
            const vendorSelect = document.getElementById('vendor');
            
            // Clear any existing options (except the default "Select")
            vendorSelect.innerHTML = '<option value="">Select</option>';
            
            // Check if the data array is not empty
            if (data && data.length > 0) {
                // Loop through the vendor data and create new option elements
                data.forEach(vendor => {
                    const option = document.createElement('option');
                    option.value = vendor.cid;  // Assuming `cid` is the unique vendor identifier
                    option.textContent = vendor.name;  // Assuming `name` is the vendor name
                    vendorSelect.appendChild(option);  // Append the option to the dropdown
                });
            } else {
                // If no vendor data is available, display a "No vendors found" option
                const option = document.createElement('option');
                option.value = '';  // Empty value for "No vendors"
                option.textContent = 'No vendors found';
                vendorSelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error('Error fetching vendor data:', error);
            
            // Optionally, provide user feedback in case of an error
            const vendorSelect = document.getElementById('vendor');
            vendorSelect.innerHTML = '<option value="">Error loading data</option>';
        });
});




document.addEventListener("DOMContentLoaded", function() {
    // Fetch state data from the backend (replace with your actual API endpoint)
	fetch(new URL('/api/state', baseUrl1)	, {
	    credentials: "include"
	})
  /*  fetch('http://localhost:8004/api/state/all')  // This is your Spring Boot API endpoint*/
        .then(response => response.json())  // Parse the JSON response
        .then(data => {
            console.log(data);  // Log the data to the console for debugging
            
            // Get the select element for the state dropdown
            const stateSelect = document.getElementById('state');
            
            // Clear any existing options (except the default "Select")
            stateSelect.innerHTML = '<option value="">Select</option>';
            
            // Check if the data array is not empty
            if (data && data.length > 0) {
                // Loop through the state data and create new option elements
                data.forEach(state => {
                    const option = document.createElement('option');
                    option.value = state.cityId;  // Assuming 'CityId' is the unique identifier
                    option.textContent = state.state;  // Assuming 'state' is the state name
                    stateSelect.appendChild(option);  // Append the option to the dropdown
                });
            } else {
                // If no state data is available, display a "No states found" option
                const option = document.createElement('option');
                option.value = '';  // Empty value for "No states"
                option.textContent = 'No states found';
                stateSelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error('Error fetching state data:', error);
            
            // Optionally, provide user feedback in case of an error
            const stateSelect = document.getElementById('state');
            stateSelect.innerHTML = '<option value="">Error loading data</option>';
        });
});

$(document).ready(function () {
    // Show confirmation modal when "Create" is clicked — ONLY IF validation passes
    $("#show").click(function () {
        console.log("Create clicked - Validating form");

        if (validateFields()) {
            console.log("Validation passed - Modal will show");
            $("#exampleModalCenter66").modal("show");
        } else {
            console.log("Validation failed - Modal will not show");
        }
    });

    // Handle "No" button click
    $(".btn-secondary[data-dismiss='modal']").click(function () {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter66").modal("hide");
    });

    // Handle "Yes" button click and call addevent
    $(document).on("click", "#confirmYES", function () {
        console.log("Yes clicked - Proceeding with creation");
        $("#exampleModalCenter66").modal("hide");
        addevent(); // Proceed with data submission
    });
});


function validateFields() {
    var isValid = true;

    var Itemno = $('#item').val().trim();
    var unitmesure = $('#unit').val().trim();
    var Itemdes1 = $('#description1').val().trim();
    //var Itemdes2 = $('#description2').val().trim();
    var remarks = $('#remarks').val().trim();
	

     $('.error-message').hide();  // Clear previous errors

    if (!Itemno) {
        $('#itemError').show();
        isValid = false;
    }
    if (!unitmesure) {
        $('#unitError').show();
        isValid = false;
    }
    if (!Itemdes1) {
        $('#description1Error').show();
        isValid = false;
    }
  /*  if (!Itemdes2) {
        $('#description2Error').show();
        isValid = false;
    }*/
    if (!remarks) {
        $('#remarksError').show();
        isValid = false;
    }

    return isValid;
}


function addevent() {

    var Itemno = $('#item').val().trim();
    var unitmesure = $('#unit').val().trim();
    var Itemdes1 = $('#description1').val().trim();
    var Itemdes2 = $('#description2').val().trim();
    var remarks = $('#remarks').val().trim();

    let currentDate = new Date();
    let currentDateTimeString = getIndianDateTimeFormat(currentDate);

    // Step 1: Check if ItemNo exists
    $.ajax({
        url: new URL('/api/items/check', baseUrl1),
        type: 'GET',
        data: { itemNo: Itemno },
        xhrFields: { withCredentials: true },
        success: function (checkResponse) {

            if (checkResponse.exists === true) {
                // Show modal and STOP insertion
                showModalPopup("Item No Already Exists!");
                return; // Prevent further execution
            }

            // Step 2: If not exists → proceed to insert
            insertItem(Itemno, unitmesure, Itemdes1, Itemdes2, remarks, currentDateTimeString);
        },
        error: function (xhr, status, error) {
            alert("Error checking item number: " + error);
        }
    });
}

// Separate insert function
function insertItem(Itemno, unitmesure, Itemdes1, Itemdes2, remarks, currentDateTimeString) {

    var requestData = {
        "itemNo": Itemno,
        "um": unitmesure,
        "itmDescription1": Itemdes1,
        "itmDescription2": Itemdes2,
        "itmRemark": remarks,
        "created_by": createdById,
        "created_date": currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/items', baseUrl1),
        type: 'POST',
        xhrFields: { withCredentials: true },
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',

        success: function (data) {

            if (data.status === "Success") {			
				var popup = $('<div class="popup">Inserted Successfully!</div>')
			                               .appendTo('body')
			                               .hide()
			                               .fadeIn(400);

			               setTimeout(function () {
			                   popup.fadeOut(400, function () {
			                       $(this).remove();
			                       window.location = "Items.jsp";
			                   });
			               }, 2000);

            } else {
                alert("Record not inserted. Please try again.");
            }
        },

        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    });
}

// Function to show modal
function showModalPopup(message) {
    $('#errorMessageupitem').text(message);
    $('#exampleModalCenteritem').modal('show');
}

// Close modal when OK is clicked
$(document).on('click', '#modalokk', function() {
    $('#exampleModalCenteritem').modal('hide');
    // Redirect after closing
   // window.location = "Items.jsp";
});


// Function to fetch all items and display them in the table
/*async function fetchItems() {
    // URL to the API endpoint that retrieves all items
	//const apiUrl = new URL(`/api/items`, baseUrl1);
    const apiUrl = new URL('/api/items',baseUrl1);

    try {
        // Make an HTTP GET request to fetch the items  
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch data");

        const json = await response.json();  // Parse the response JSON
        let tableRows = '';  // To hold table rows
        const items = json;  // The response is an array of items

        // Loop through each item and create a row for each item
        items.forEach((item, index) => {
            // Create table row for each item
            tableRows += `
                <tr id="${item.itemid}">
                    <td>${index + 1}</td>
                    <td>${item.itemNo}</td>
                    <td>${item.UM}</td>
                    <td>${item.itmDescription1}</td>
                    <td>${item.itmDescription2}</td>
                    <td>${item.itmRemark}</td>
                    <td>
					   <i class="fa fa-pen" onclick="editItem('${item.itemid}')"></i>
					</td>
                </tr>
            `;
        });

        // Insert table content into the table body
        document.querySelector("#tableID tbody").innerHTML = tableRows;

        // Destroy any existing DataTable instance before reinitializing
        if ($.fn.DataTable.isDataTable('#tableID')) {
            $('#tableID').DataTable().destroy();
        }

        // Initialize DataTable with options
        $('#tableID').DataTable({
            dom: 'Bfrtip',  // Keeps the buttons at the top, search box to the right
            scrollX: true,
            info: false,
            paging: false,
            buttons: [
                {
                    extend: 'excel',
                    text: 'Export to Excel',
                    title: 'Item List',
                }
            ]
        });

        // Custom CSS to align the Export button (Excel) to the left and search box to the right
        $(document).ready(function() {
            // Align the Excel export button to the left
            $('.dt-buttons').css({
                'float': 'left',  // Align the export button to the left
                'margin-right': '10px'  // Add space between the button and other elements
            });

            // Align the search box to the right
            $('.dataTables_filter').css({
                'text-align': 'right',  // Align the search input box to the right
                'float': 'right',       // Ensure it stays on the right side
                'margin-bottom': '10px' // Adjust margin as needed for spacing
            });
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}*/

async function fetchItems() {
    const apiUrl       = new URL('/api/items', baseUrl1);
    const unitsUrl     = new URL('/api/items/all', baseUrl1);
    const bulkCheckUrl = new URL('/api/items/checkItemUsed/bulk', baseUrl1);

    try {
        const [unitsResponse, itemsResponse, bulkCheckResponse] = await Promise.all([
            fetch(unitsUrl,      { method: "GET", credentials: "include" }),
            fetch(apiUrl,        { method: "GET", credentials: "include" }),
            fetch(bulkCheckUrl,  { method: "GET", credentials: "include" })
        ]);

        if (!unitsResponse.ok)     throw new Error("Failed to fetch unit list");
        if (!itemsResponse.ok)     throw new Error("Failed to fetch items");
        if (!bulkCheckResponse.ok) throw new Error("Failed to fetch used items");

        const unitList  = await unitsResponse.json();
        const items     = await itemsResponse.json();
        const usedItems = await bulkCheckResponse.json();

        // ✅ Build unitMap BOTH by uid (numeric) AND by unit name string
        // This handles whatever format um comes in as
        const unitMap = {};
        unitList.forEach(u => {
            if (u.uid)   unitMap[String(u.uid)]  = u.unit;  // id → name
            if (u.unit)  unitMap[u.unit.trim().toUpperCase()] = u.unit; // name → name
        });

        let tableRows = '';

        items.forEach((item, index) => {
            // ✅ Get um value — handle all possible casing from API
            const rawUm  = item.um ?? item.UM ?? item.uM ?? '';

            // ✅ Try: direct name lookup → id lookup → raw value → 'N/A'
            const unitName = unitMap[String(rawUm).trim().toUpperCase()]  // "NOS" → "NOS"
                          || unitMap[String(rawUm)]                        // numeric id fallback
                          || (rawUm && rawUm !== '0' ? rawUm : 'N/A');    // show raw if valid, else N/A

            const canEdit = !usedItems[String(item.itemid)];

            tableRows += `
                <tr id="${item.itemid}">
                    <td>${index + 1}</td>
                    <td>${item.itemNo ?? ''}</td>
                    <td>${unitName}</td>
                    <td>${item.itmDescription1 ?? ''}</td>
                    <td>${item.itmRemark ?? ''}</td>
                    <td>
                        <i class="fa fa-pen ${!canEdit ? 'text-secondary' : 'text-muted'}"
                           style="cursor:${!canEdit ? 'not-allowed' : 'pointer'}; opacity:${!canEdit ? '0.3' : '1'};"
                           title="${!canEdit ? 'Item already used in transactions' : 'Edit'}"
                           ${!canEdit ? '' : `onclick="editItem('${item.itemid}')"`}>
                        </i>
                    </td>
                </tr>
            `;
        });

        document.querySelector("#tableID tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID')) {
            $('#tableID').DataTable().destroy();
        }

        $('#tableID').DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: true,
            paging: true,
            pageLength: 10,
            lengthChange: true,
            lengthMenu: [10, 25, 50, 100],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Item List',
                exportOptions: { modifier: { page: 'all' } }
            }]
        });

        $('.dt-buttons').css({ 'float': 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ 'text-align': 'right', 'float': 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to handle the "Create" button click (this will reload the table)
function Editaddevent() {
    fetchItems();  // Fetch and display the items when "Create" button is clicked
}

/*function editItem(itemId, UM) {

}*/

// Event listener for the "Create" button
document.querySelector('.btn.btn-sm.btn-success').addEventListener('click', Editaddevent);

// Initially fetch and display the items when the page loads
window.onload = fetchItems;





/*function addevent() {
     //Get the form field values
    const item = document.getElementById("item").value;
    const unit = document.getElementById("unit").value;
    const description1 = document.getElementById("description1").value;
    const description2 = document.getElementById("description2").value;
    const remarks = document.getElementById("remarks").value;

    // Flag to check if the form is valid
    let formIsValid = true;

    // Reset previous error messages
    document.querySelectorAll('.text-danger').forEach(error => {
        error.style.display = 'none';
    });

    // Check if all required fields are filled
   if (!item) {
        document.getElementById("itemError").style.display = 'block';
        formIsValid = false;
    }
    if (!unit) {
        document.getElementById("unitError").style.display = 'block';
        formIsValid = false;
    }
    if (!description1) {
        document.getElementById("description1Error").style.display = 'block';
        formIsValid = false;
    }
    if (!description2) {
       document.getElementById("description2Error").style.display = 'block';
       formIsValid = false;
    }
    if (!remarks) {
        document.getElementById("remarksError").style.display = 'block';
        formIsValid = false;
    }

    
}*/


// Function to edit an item when clicked
function editItem(itemId) {
			  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    console.log('Edit item with ID:', itemId);

    fetchItemDetails(itemId);

}

// Function to fetch item details from the server or use static data
let selectedItemId = null; // Global variable to hold the item ID

function fetchItemDetails(itemId) {
    const apiUrl = new URL(`/api/items/${itemId}`, baseUrl1);

    fetch(apiUrl, { credentials: "include" })
        .then(response => response.json())
        .then(item => {

            document.getElementById('itemup').value = item.itemNo;
            document.getElementById('description1up').value = item.itmDescription1;
            document.getElementById('description2up').value = item.itmDescription2;
            document.getElementById('remarksup').value = item.itmRemark;

            const unitSelect = document.getElementById('unitup');
            const rawUm = String(item.um ?? '').trim();

            // ✅ Try matching by value (uid) first, then by text (name)
            let matchingOption = Array.from(unitSelect.options)
                .find(opt => opt.value === rawUm);

            if (!matchingOption) {
                matchingOption = Array.from(unitSelect.options)
                    .find(opt => opt.textContent.trim().toUpperCase() === rawUm.toUpperCase());
            }

            if (matchingOption) {
                unitSelect.value = matchingOption.value;
            } else {
                console.warn('No matching unit found for:', item.um);
                unitSelect.value = ''; // reset to "Select" explicitly
            }

            oldValues = {
                itemNo: item.itemNo,
                um: item.um,
                itmDescription1: item.itmDescription1,
                itmDescription2: item.itmDescription2,
                itmRemark: item.itmRemark
            };

            selectedItemId = itemId;

            $('#exampleModalScrollable13').modal('show');
        })
        .catch(error => {
            console.error('Error fetching item details:', error);
        });
}

function validateUpdateFields() {
    let isValid = true;

    // Get values
    let unit = $('#unitup').val();
    let description1 = $('#description1up').val().trim();
    let remarks = $('#remarksup').val().trim();

    // Hide all previous errors
    $('.error-message').hide();

    // Validate Unit
    if (!unit) {
        $('#unitErrorup').show();
        isValid = false;
    }

    // Validate Description 1
    if (!description1) {
        $('#description1Errorup').show();
        isValid = false;
    }

    // Validate Remarks
    if (!remarks) {
        $('#remarksErrorup').show();
        isValid = false;
    }

    return isValid;
}

$(document).ready(function () {

    // Update button click
    $("#updateitems").on("click", function () {

        // 🔍 Validate first
        if (!validateUpdateFields()) {
            return; // ❌ Stop here if validation fails
        }
        $("#exampleModalCenter67").modal("show");
    });

    // No button
    $(".btn-secondary[data-dismiss='modal']").on("click", function () {
        $("#exampleModalCenter67").modal("hide");
    });

    // Yes button → proceed with update
    $(document).on("click", "#confirmupd", function () {

        $("#exampleModalCenter67").modal("hide");

        if (selectedItemId) {
            add(selectedItemId); // your update function
        } else {
            alert("Item ID not found. Cannot update.");
        }
    });

});

function normalize(val) {
    return (val ?? '').toString().trim();
}

// Function to handle the update of item details
function add(itemId) {

    // Get old values (must be set when modal opens)
    const oldItemNo = oldValues.itemNo;
    const oldUnit = oldValues.um;
    const oldDesc1 = oldValues.itmDescription1;
    const oldDesc2 = oldValues.itmDescription2;
    const oldRemarks = oldValues.itmRemark;

    // Get new input values
    const itemNo = document.getElementById('itemup').value.trim();
    const unit = document.getElementById('unitup').value.trim();
    const description1 = document.getElementById('description1up').value.trim();
    const description2 = document.getElementById('description2up').value.trim();
    const remarks = document.getElementById('remarksup').value.trim();

    // Check if all fields unchanged
    if (
        itemNo === oldItemNo &&
        unit === oldUnit &&
        description1 === oldDesc1 &&
        description2 === oldDesc2 &&
        remarks === oldRemarks
    ) {
        const popup = $('<div class="popup">No fields changed!</div>').appendTo('body').fadeIn(400);
        setTimeout(() => {
            popup.fadeOut(400, () => {
                popup.remove();
            });
        }, 2000);
        return;
    }

    // Current Indian time
    const currentDate = new Date();
    const currentDateTimeString = getIndianDateTimeFormat(currentDate);

    // Updated item object
    const updatedItem = {
        itemNo: itemNo,
        um: unit,
        itmDescription1: description1,
        itmDescription2: description2,
        itmRemark: remarks,
        modified_by: createdById,
        modified_date: currentDateTimeString
    };

    // 🔥 FIXED UPDATE API CALL
    fetch(`${baseUrl1}/api/items/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updatedItem)
    })
    .then(async response => {
        const data = await response.json().catch(() => null); // Prevent crash if no JSON

		if (!response.ok || data.status === 'Error') {
		    const popup = $('<div class="popup"></div>').text(data.message).appendTo('body').fadeIn(400);
		    setTimeout(() => { popup.fadeOut(400, () => popup.remove()); }, 3000);
		    return;
		}

        // Success
        if (data.status === 'Success') {
            const popup = $('<div class="popup">Updated Successfully!</div>').appendTo('body').fadeIn(400);
            setTimeout(() => {
                popup.fadeOut(400, () => {
                    popup.remove();
                    window.location = 'Items.jsp';
                });
            }, 2000);

            fetchItems();
            $('#exampleModalScrollable13').modal('hide');
        } else {
            alert(data.message || "Failed to update item.");
        }
    })
    .catch(error => {
        console.error("Error updating item:", error);
        alert("Network error. Please try again.");
    });
}


// Function to close the modal
function closeModal() {
    $('#exampleModalScrollable13').modal('hide');
}

// Event listener for the close button (optional)
document.querySelector('.close').addEventListener('click', closeModal);


/*function clientaddevent()
{
	    // Get the form field values
	    var vendorname = $('#vendorname').val();
	    var cname1 = $('#cname1').val();
	    var cname2 = $('#cname2').val();
	    var cnumber = $('#cnumber').val();
	    var cemail = $('#cemail').val();
	    var address1 = $('#address1').val();  // Changed 'city' to 'address1' to match field
	    var city = $('#city').val();
	    var district = $('#district').val();
	    var state = $('#state').val();
	    var pincode = $('#pincode').val();
	    var gstin = $('#gstin').val();
	    var remarks = $('#remarks').val();
		
		 let currentDate = new Date();


		 let currentDateTimeString = currentDate.toISOString();  
	    // Create the requestData object with values from the form
	    var requestData = {
	        "client_number": "",  // Will be generated by the backend (or can be filled here)
	        "name": vendorname,
	        "contactname1": cname1,
	        "contactname2": cname2,
	        "contactnumber": cnumber,
	        "contactemail": cemail,
	        "address1": address1,
	        "city": city,
	        "district": district,
	        "state": state,
	        "pincode": pincode,
	        "remarks": remarks,
	        "gst": gstin,
			"created_by":"971939",
			"created_date":currentDateTimeString
	    };

	    // Log the requestData to verify
	    console.log('Sending data:', requestData);

	    // Make the AJAX request to submit the data
	    $.ajax({
	        url: 'http://localhost:8004/api/clients', // API URL
	        type: 'POST',
	        contentType: 'application/json', // Set content type to JSON
	        data: JSON.stringify(requestData), // Send data as a JSON string
	        dataType: 'json', // Expected response type
			success: function(response) {
			    console.log("Response:", response);  // Log the full response to verify structure
			    
			    // Check if the response contains a body with status "Success"
			    if (response.body && response.body.status === "Success") {
			        alert("Client added successfully with Client Number: " + response.body.client_number);
			    } else {
			        alert("Record not inserted. Please try again.");
			    }
			},
	        error: function(xhr, status, error) {
	            // Handle any error that occurred during the AJAX request
	            alert("An error occurred: " + error);
	        }
	    });
	}
	
	

	

	
	function clientaddevent() {
	    // Get the form field values
	   const vendor = document.getElementById("vendor").value;
	  const vendorname = document.getElementById("vendorname").value;
	    const cname1 = document.getElementById("cname1").value;
	    const cname2 = document.getElementById("cname2").value;
	    const cnumber = document.getElementById("cnumber").value;
	    const cemail = document.getElementById("cemail").value;
	    const address1 = document.getElementById("address1").value;
	    const city = document.getElementById("city").value;
	    const district = document.getElementById("district").value;
	    const state = document.getElementById("state").value;
	    const pincode = document.getElementById("pincode").value;
	    const gstin = document.getElementById("gstin").value;
	    const remarks = document.getElementById("remarks").value;

	    // Flag to check if the form is valid
	    let formIsValid = true;

	    // Reset previous error messages
	    document.querySelectorAll('.text-danger').forEach(error => {
	        error.style.display = 'none';
	    });

	    // Check if all required fields are filled
	    if (!vendor) {
	        document.getElementById("vendorError").style.display = 'block';
	        formIsValid = false;
	    }
	    if (!vendorname) {
	        document.getElementById("vendornameError").style.display = 'block';
	        formIsValid = false;
	    }
	    if (!cname1) {
	        document.getElementById("cname1Error").style.display = 'block';
	        formIsValid = false;
	    }
	    if (!cname2) {
	        document.getElementById("cname2Error").style.display = 'block';
	        formIsValid = false;
	    }
	    if (!cnumber) {
	        document.getElementById("cnumberError").style.display = 'block';
	        formIsValid = false;
	    }
	    if (!cemail) {
	        document.getElementById("cemailError").style.display = 'block';
	        formIsValid = false;
	    }
	    if (!address1) {
	        document.getElementById("address1Error").style.display = 'block';
	        formIsValid = false;
	    }
	    if (!city) {
	        document.getElementById("cityError").style.display = 'block';
	        formIsValid = false;
	    }
	    if (!district) {
	        document.getElementById("districtError").style.display = 'block';
	        formIsValid = false;
	    }
	    if (!state) {
	        document.getElementById("stateError").style.display = 'block';
	        formIsValid = false;
	    }
	    if (!pincode) {
	        document.getElementById("pincodeError").style.display = 'block';
	        formIsValid = false;
	    }
	    if (!gstin) {
	        document.getElementById("gstinError").style.display = 'block';
	        formIsValid = false;
	    }
	    if (!remarks) {
	        document.getElementById("remarksError").style.display = 'block';
	        formIsValid = false;
	    }

	   
	}
	
	
	function fetchClients() {
			  // URL to the API endpoint that retrieves all clients
			  const apiUrl = 'http://localhost:8004/api/clients';

			  // Make an HTTP GET request to fetch the client data
			  fetch(apiUrl)
			    .then(response => response.json())  // Parse the response JSON
			    .then(clients => {
			      let tableRows = '';  // To hold table rows

			      // Loop through each client and create a row for each client
			      clients.forEach((client, index) => {
			        // Create table row for each client
			        tableRows += `
			          <tr id="${client.cid}"> 
			            <td>${index + 1}</td>
			            <td>${client.name}</td>
			            <td>${client.contactname1}</td>
			            <td>${client.contactname2}</td>
			            <td>${client.contactnumber}</td>
			            <td>${client.address1}</td>
			            <td>${client.city}</td>
			            <td>${client.state}</td>
			            <td>${client.gst}</td>
			            <td>${client.remarks}</td>
			            <td>
			              <i class="fa fa-pen text-muted" onclick="editClient(${client.cid})"></i>
			              <i class="fa fa-trash text-danger" onclick="deleteClient(${client.cid})"></i>
			            </td>
			          </tr>
			        `;
			      });

			      // Insert table content into the table body
			      document.querySelector("#table_ID tbody").innerHTML = tableRows;

			      // Destroy any existing DataTable instance before reinitializing
			      if ($.fn.DataTable.isDataTable('#table_ID')) {
			        $('#table_ID').DataTable().destroy();
			      }

			      // Initialize DataTable with options
			      $('#table_ID').DataTable({
			        dom: 'Bfrtip',
			        scrollX: true,
			        info: false,
			        paging: false,
			        buttons: [
			          {
			            extend: 'excel',
			            text: 'Export to Excel',
			            title: 'Client List',
			          },
			        ]
			      });
			    })
			    .catch(error => {
			      console.error('Error fetching data:', error);
			    });
			}

			// Placeholder function for editing client
			function editClient(clientId) {
			  console.log('Edit client with ID:', clientId);
			  // You can redirect to an edit page or open a modal for editing
			}

			// Placeholder function for deleting client
			function deleteClient(clientId) {
			  console.log('Delete client with ID:', clientId);
			  // Here you can make a DELETE request to your backend to remove the client
			}

			// Call the fetchClients function when the page loads
			window.onload = fetchClients;*/
	
			function getIndianDateTimeFormat(date) {
			    const options = {
			        timeZone: 'Asia/Kolkata',
			        hour12: false,
			    };

			    const istDate = new Date(date.toLocaleString('en-US', options));

			    const day = istDate.getDate().toString().padStart(2, '0');
			    const month = (istDate.getMonth() + 1).toString().padStart(2, '0');
			    const year = istDate.getFullYear();

			    const hours = istDate.getHours().toString().padStart(2, '0');
			    const minutes = istDate.getMinutes().toString().padStart(2, '0');
			    const seconds = istDate.getSeconds().toString().padStart(2, '0');

			    // Format it as ISO-8601: yyyy-MM-dd'T'HH:mm:ss
			    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
			}

	
