
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
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}
	$('#exampleModalScrollable123').modal('show');
});

let rowCount = 0; // Counter to keep track of dynamic row IDs

document.addEventListener("DOMContentLoaded", function () {
	loadActions();
    // First, check if there's already an initial row
   
    // Populate the dropdowns for the first row
   
   
  //  fetchUserList(selectedFactoryId);
	
});

$(document).ready(function () {
	fetchStates();
    // Show confirmation modal when "Create" is clicked
	$("#showclient").click(function () {
	      

	        if (validateclientFields()) {
	           
	            $("#exampleModalCenter66").modal("show");
	        } else {
	           
	        }
	    });

    // Handle "No" button click (close the modal without doing anything)
    $(".btn-secondary[data-dismiss='modal']").click(function () {
      
        $("#exampleModalCenter66").modal("hide");
    });

    // Use event delegation for "Yes" button
    // This ensures that even if the modal is dynamically rendered, it can capture the click event
    $(document).on("click", "#confirmYes", function () {
      

        // Hide the modal before proceeding
        $("#exampleModalCenter66").modal("hide");
		clientaddevent();
    });
});


document.getElementById("state").addEventListener("change", function () {
    const stateId = this.value;
	
  fetchCities(stateId);
});

let state_id = null;

let stateObj = {};
let cityObj = {};

function fetchCities(stateId) {
    return new Promise((resolve, reject) => {

        if (!stateId) {
            document.getElementById("city").innerHTML = `<option value="">Select City</option>`;
            return resolve();
        }

        const apiUrl = new URL(`/api/location/cities/states/${stateId}`, baseUrl1);

        fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {

            cityObj = {};

            let cityDropdown = document.getElementById("city");
            cityDropdown.innerHTML = `<option value="">Select City</option>`;

            data.forEach(city => {
                cityObj[city.cityId] = city.cityName;
                cityDropdown.innerHTML += `<option value="${city.cityId}">${city.cityName}</option>`;
            });

            // REFRESH TABLE NOW (cityObj is ready)
            fetchClients();

            resolve();
        })
        .catch(err => reject(err));

    });
}

function fetchAllCities() {
    return new Promise((resolve, reject) => {

        const apiUrl = new URL('/api/location/cities', baseUrl1);

        fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {

            cityObj = {}; // reset

            data.forEach(city => {
                cityObj[city.cityId] = city.cityName;
            });

           

            resolve();
        })
        .catch(err => reject(err));
    });
}

function fetchStates() {
    return new Promise((resolve, reject) => {
        
        const apiUrl = new URL('/api/location/states', baseUrl1);

        fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {

            stateObj = {}; // reset

            let stateDropdown = document.getElementById("state");
            stateDropdown.innerHTML = `<option value="">Select State</option>`;

            data.forEach(state => {
                stateObj[state.stateId] = state.stateName;

                stateDropdown.innerHTML += 
                    `<option value="${state.stateId}">${state.stateName}</option>`;
            });

           

            resolve();   // 🔥 FIX: tell the system it's finished loading
        })
        .catch(err => {
            console.error("Error fetching states:", err);
            reject(err);
        });
    });
}



function validateclientFields() {
    var isValid = true;

	    var vendorname = $('#vendorname').val();
	    var cname1 = $('#cname1').val();
	   // var cname2 = $('#cname2').val();
	    var cnumber = $('#cnumber').val();
	    var cemail = $('#cemail').val();
	    var address1 = $('#address1').val();  // Changed 'city' to 'address1' to match field
	    var city = $('#city').val();
	    var district = $('#district').val();
	    var state = $('#state').val();
	    var pincode = $('#pincode').val();
	    var gstin = $('#gstin').val();
	    var remarks = $('#remarks').val();

     $('.error-message').hide();  // Clear previous errors

    if (!vendorname) {
        $('#vendornameError').show();
        isValid = false;
    }
    if (!cname1) {
        $('#cname1Error').show();
        isValid = false;
    }
    /*if (!cname2) {
        $('#cname2Error').show();
        isValid = false;
    }*/
    if (!cnumber) {
        $('#cnumberError').show();
        isValid = false;
    }
    if (!cemail) {
        $('#cemailError').show();
        isValid = false;
    }
	if (!address1) {
	     $('#address1Error').show();
	     isValid = false;
	 }
	 if (!district) {
	      $('#districtError').show();
	      isValid = false;
	  }
	  if (!pincode) {
	       $('#pincodeError').show();
	       isValid = false;
	  }
	   if (!gstin) {
	        $('#gstinError').show();
	        isValid = false;
	  }
		if (!remarks) {
		     $('#remarksError').show();
		     isValid = false;
	  }

	  
	  if(!city){
		$("#cityError").show();
		isValid =false;
	  }
	  if(!state){
		$("#stateError").show();
		isValid = false;
	  }
	  
    return isValid;
}

function clientaddevent()
{
    // ===============================
    // GET FORM VALUES
    // ===============================
    var vendorname = $('#vendorname').val().trim();
    var cname1 = $('#cname1').val().trim();
    var cname2 = $('#cname2').val().trim();
    var cnumber = $('#cnumber').val().trim();
    var cemail = $('#cemail').val().trim();
    var address1 = $('#address1').val().trim();
    var city = $('#city').val().trim();
    var district = $('#district').val().trim();
    var state = $('#state').val().trim();
    var pincode = $('#pincode').val().trim();
    var gstin = $('#gstin').val().trim();
    var remarks = $('#remarks').val().trim();

    if (!vendorname) {
        alert("Client name is required");
        return;
    }

    let currentDate = new Date();
    let currentDateTimeString = getIndianDateTimeFormat(currentDate);

    // ===============================
    // STEP 1 : CHECK DUPLICATE NAME
    // ===============================
    $.ajax({
        url: new URL('/api/clients/check-name', baseUrl1),
        type: 'GET',
        data: { name: vendorname },
        xhrFields: { withCredentials: true },

        success: function (checkResponse) {

            if (checkResponse.exists === true) {
				 showModalPopup("Client name Already Exists!");
                //alert("Client name already exists!");
                return; // ⛔ STOP INSERT
            }

            // ===============================
            // STEP 2 : PREPARE INSERT DATA
            // ===============================
            var requestData = {
                "client_number": "",
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
                "created_by": createdById,
                "created_date": currentDateTimeString
            };

        

            // ===============================
            // STEP 3 : INSERT CLIENT
            // ===============================
            $.ajax({
                url: new URL('/api/clients', baseUrl1),
                type: 'POST',
                xhrFields: { withCredentials: true },
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                dataType: 'json',

                success: function (response) {
                

                    if (response.body && response.body.status === "Success") {
                        var popup = $('<div class="popup">Inserted Successfully with Client Number: ' 
                            + response.body.client_number + '</div>')
                            .appendTo('body')
                            .hide()
                            .fadeIn(400);

                        setTimeout(function () {
                            popup.fadeOut(400, function () {
                                $(this).remove();
                                window.location = "Clients.jsp";
                            });
                        }, 2000);
                    } else {
                        alert("Record not inserted. Please try again.");
                    }
                },

                error: function (xhr, status, error) {
                    alert("Insert failed: " + error);
                }
            });
        },

        error: function () {
            alert("Error checking client name");
        }
    });
}
// Function to show modal
function showModalPopup(message) {
    $('#errorMessageupclient').text(message);
    $('#exampleModalCenterclient').modal('show');
}

// Close modal when OK is clicked
$(document).on('click', '#modalokk', function() {
    $('#exampleModalCenterclient').modal('hide');
    // Redirect after closing
   // window.location = "Items.jsp";
});

/*	
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

	   
	}*/
	
	let selectedClientId = null;
	// Function to fetch all clients and display them in the table
	async function fetchClients() {

	    const apiUrl = new URL('/api/clients', baseUrl1);

	    try {
	        // ✅ CALL 1: Fetch all clients
	        const response = await fetch(apiUrl, {
	            method: "GET",
	            credentials: "include"
	        });

	        if (!response.ok) throw new Error("Failed to fetch client data");

	        const clients = await response.json();

	        // ✅ CALL 2: Fetch ALL used cids in ONE single call (replaces 500+ individual calls)
	        let usedCids = {};
	        try {
	            const bulkCheckUrl = new URL('/api/clients/checkclientUsed/bulk', baseUrl1);
	            const bulkResponse = await fetch(bulkCheckUrl, {
	                method: "GET",
	                credentials: "include"
	            });
	            if (bulkResponse.ok) {
	                usedCids = await bulkResponse.json(); 
	                // usedCids = { "5": true, "12": true, ... }
	            }
	        } catch (err) {
	            console.error("Error fetching bulk client usage:", err);
	        }

	        // ✅ Build table rows — NO more individual API calls inside loop
	        let tableRows = '';

	        clients.forEach((client, index) => {

	            // Check locally from bulk result
	            const isUsed  = usedCids[String(client.cid)] === true;
	            const canEdit = !isUsed;

	            tableRows += `
	                <tr id="${client.cid}">
	                    <td>${index + 1}</td>
	                    <td>${client.name ?? ''}</td>
	                    <td>${client.contactname1 ?? ''}</td>
	                    <td>${client.contactnumber ?? ''}</td>
	                    <td>${client.address1 ?? ''}</td>
	                    <td>${cityObj?.[client.city] ?? client.city ?? ''}</td>
	                    <td>${stateObj?.[client.state] ?? client.state ?? ''}</td>
	                    <td>${client.gst ?? ''}</td>
	                    <td>${client.remarks ?? ''}</td>
	                    <td>
	                        <i class="fa fa-pen ${canEdit ? 'text-muted' : 'text-secondary'}"
	                           style="cursor:${canEdit ? 'pointer' : 'not-allowed'};
	                                  opacity:${canEdit ? '1' : '0.3'};"
	                           title="${canEdit ? 'Edit' : 'Client already used in transactions'}"
	                           ${canEdit ? `onclick="editClient('${client.cid}')"` : ''}>
	                        </i>
	                    </td>
	                </tr>
	            `;
	        });

	        // ✅ Inject rows into table
	        document.querySelector("#table_ID tbody").innerHTML = tableRows;

	        // ✅ Destroy existing DataTable instance if present
	        if ($.fn.DataTable.isDataTable('#table_ID')) {
	            $('#table_ID').DataTable().destroy();
	        }

	        // ✅ Initialize DataTable
	        $('#table_ID').DataTable({
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
	                title: 'Client List',
	                exportOptions: { modifier: { page: 'all' } }
	            }]
	        });

	        $('.dt-buttons').css({ float: 'left', marginRight: '10px' });
	        $('.dataTables_filter').css({ float: 'right', textAlign: 'right', marginBottom: '10px' });

	    } catch (error) {
	        console.error('Error fetching client data:', error);
	    }
	}

	// Function to handle the "Create" button click (this will reload the table)
	function addevent() {
	    fetchClients();  // Fetch and display the clients when "Create" button is clicked
	}

	// Function for editing client
	function editClient(clientId) {
		
	   
		editClient(clientId)
	    // Implement logic to open a modal or navigate to an edit page for this client
	}



	// Event listener for the "Create" button
	document.querySelector('.btn.btn-sm.btn-success').addEventListener('click', addevent);

	// Initially fetch and display the clients when the page loads
	window.onload = async function () {
	    await fetchStates(); 
		await fetchAllCities(); 
	    fetchClients();        
	};
	
	
	// Function for editing client
// 🔥 Global variable to store old client values (NEEDED for comparison during update)
let oldClientValues = {};

function editClient(clientId) {
	  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    fetch(new URL(`/api/clients/${clientId}`, baseUrl), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(client => {

        // ⭐ Save existing (old) values
        oldClientValues = {
            name: client.name,
            contactname1: client.contactname1,
            contactname2: client.contactname2,
            contactnumber: client.contactnumber,
            contactemail: client.contactemail,
            address1: client.address1,
            district: client.district,
            pincode: client.pincode,
            gst: client.gst,
            remarks: client.remarks,
            state: client.state,
            city: client.city
        };

        // ⭐ Fill update modal fields
        document.getElementById('vendornameup').value = client.name;
        document.getElementById('cname1up').value = client.contactname1;
        document.getElementById('cname2up').value = client.contactname2;
        document.getElementById('cnumberup').value = client.contactnumber;
        document.getElementById('cemailup').value = client.contactemail;
        document.getElementById('address1up').value = client.address1;
        document.getElementById('districtup').value = client.district;
        document.getElementById('pincodeup').value = client.pincode;
        document.getElementById('gstinup').value = client.gst;
        document.getElementById('remarksup').value = client.remarks;

        // ⭐ Load states first
        fetchStatesForUpdate(client.state);

        // ⭐ After states load, load cities
        setTimeout(() => {
            fetchCitiesForUpdate(client.state, client.city);
        }, 300);

        // Required for update API
        selectedClientId = clientId;

        // Show modal
        $('#exampleModalScrollable15').modal('show');
    })
    .catch(error => {
        console.error('Error fetching client data:', error);
        alert('Error loading client data');
    });
}

function validateClientUpdateFields() {
    let isValid = true;

    // Hide previous errors
    $('.error-message').hide();

    // Collect values
    let cname1 = $('#cname1up').val().trim();
    let cnumber = $('#cnumberup').val().trim();
    let cemail = $('#cemailup').val().trim();
    let address = $('#address1up').val().trim();
    let state = $('#stateup').val();
    let district = $('#districtup').val().trim();
    let city = $('#cityup').val();
    let pincode = $('#pincodeup').val().trim();
    let gstin = $('#gstinup').val().trim();
    let remarks = $('#remarksup').val().trim();

    // Validations
    if (!cname1) {
        $('#cname1upError').show();
        isValid = false;
    }

    if (!cnumber) {
        $('#cnumberupError').show();
        isValid = false;
    }

    if (!cemail) {
        $('#cemailupError').show();
        isValid = false;
    }

    if (!address) {
        $('#address1upError').show();
        isValid = false;
    }

    if (!state) {
        $('#stateupError').show();
        isValid = false;
    }

    if (!district) {
        $('#districtupError').show();
        isValid = false;
    }

    if (!city) {
        $('#cityupError').show();
        isValid = false;
    }

    if (!pincode) {
        $('#pincodeupError').show();
        isValid = false;
    }

    if (!gstin) {
        $('#gstinupError').show();
        isValid = false;
    }

    if (!remarks) {
        $('#remarksupError').show();
        isValid = false;
    }

    return isValid;
}
	
	$(document).ready(function () {
	    // Show confirmation modal on "Update" button click
	    $("#updateclient").click(function () {
			if (!validateClientUpdateFields()) {
			          return; // ❌ Stop if validation fails
			      }
	        $("#exampleModalCenter68").modal("show");
	    });

	    // Cancel button logic
	    $(".btn-secondary[data-dismiss='modal']").click(function () {
	        $("#exampleModalCenter68").modal("hide");
	    });

	    // Yes button logic
		$("#confirmclientupd").click(function () {
		    $("#exampleModalCenter68").modal("hide");
		    if (selectedClientId) {
		        clientadd(selectedClientId);  // <-- corrected function name
		    } else {
		        alert("Client ID not found.");
		    }
		});
	});
	
	
	function fetchStatesForUpdate(selectedStateId) {
	    const apiUrl = new URL('/api/location/states', baseUrl1);

	    fetch(apiUrl, { credentials: "include" })
	        .then(res => res.json())
	        .then(data => {
	            let stateDropdown = document.getElementById("stateup");
	            stateDropdown.innerHTML = `<option value="">Select State</option>`;

	            data.forEach(state => {
	                stateDropdown.innerHTML +=
	                    `<option value="${state.stateId}">${state.stateName}</option>`;
	            });

	            // Set selected value after dropdown is filled
	            if (selectedStateId) stateDropdown.value = selectedStateId;
	        });
	}

	function fetchCitiesForUpdate(stateId, selectedCityId) {
	    if (!stateId) return;

	    const apiUrl = new URL(`/api/location/cities/states/${stateId}`, baseUrl1);

	    fetch(apiUrl, { credentials: "include" })
	        .then(res => res.json())
	        .then(data => {
	            let cityDropdown = document.getElementById("cityup");
	            cityDropdown.innerHTML = `<option value="">Select City</option>`;

	            data.forEach(city => {
	                cityDropdown.innerHTML +=
	                    `<option value="${city.cityId}">${city.cityName}</option>`;
	            });

	            // Set selected city after fill
	            if (selectedCityId) cityDropdown.value = selectedCityId;
	        });
	}

	function loadCitiesOnStateChangeUpdate() {
	    let stateId = document.getElementById("stateup").value;

	    if (!stateId) {
	        document.getElementById("cityup").innerHTML =
	            `<option value="">Select City</option>`;
	        return;
	    }

	    const apiUrl = new URL(`/api/location/cities/states/${stateId}`, baseUrl1);

	    fetch(apiUrl, { credentials: "include" })
	        .then(response => response.json())
	        .then(data => {
	            let cityDropdown = document.getElementById("cityup");
	            cityDropdown.innerHTML = `<option value="">Select City</option>`;

	            data.forEach(city => {
	                cityDropdown.innerHTML +=
	                    `<option value="${city.cityId}">${city.cityName}</option>`;
	            });
	        })
	        .catch(error => console.error("Error fetching cities:", error));
	}


	// Function to handle the update of client details
	function clientadd(clientId) {
    // Old values (should be set when modal opens)
    const oldName = oldClientValues.name;
    const oldContact1 = oldClientValues.contactname1;
    const oldContact2 = oldClientValues.contactname2;
    const oldContactNumber = oldClientValues.contactnumber;
    const oldEmail = oldClientValues.contactemail;
    const oldAddress1 = oldClientValues.address1;
    const oldCity = oldClientValues.city;
    const oldDistrict = oldClientValues.district;
    const oldState = oldClientValues.state;
    const oldPincode = oldClientValues.pincode;
    const oldGst = oldClientValues.gst;
    const oldRemarks = oldClientValues.remarks;

    // Get new input values
    const name = document.getElementById('vendornameup').value.trim();
    const contactname1 = document.getElementById('cname1up').value.trim();
    const contactname2 = document.getElementById('cname2up').value.trim();
    const contactnumber = document.getElementById('cnumberup').value.trim();
    const contactemail = document.getElementById('cemailup').value.trim();
    const address1 = document.getElementById('address1up').value.trim();
    const city = document.getElementById('cityup').value.trim();
    const district = document.getElementById('districtup').value.trim();
    const state = document.getElementById('stateup').value.trim();
    const pincode = document.getElementById('pincodeup').value.trim();
    const gst = document.getElementById('gstinup').value.trim();
    const remarks = document.getElementById('remarksup').value.trim();

    // Check if all fields unchanged
    if (
        name === oldName &&
        contactname1 === oldContact1 &&
        contactname2 === oldContact2 &&
        contactnumber === oldContactNumber &&
        contactemail === oldEmail &&
        address1 === oldAddress1 &&
        city === oldCity &&
        district === oldDistrict &&
        state === oldState &&
        pincode === oldPincode &&
        gst === oldGst &&
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

    // Updated client object
    const updatedClient = {
        name,
        contactname1,
        contactname2,
        contactnumber,
        contactemail,
        address1,
        city,
        district,
        state,
        pincode,
        gst,
        remarks,
        modified_by: createdById,
        modified_date: currentDateTimeString
    };

    // PUT request to update client
	fetch(`${baseUrl}/api/clients/${clientId}`, {
	    method: 'PUT',
	    headers: { 'Content-Type': 'application/json' },
	    credentials: 'include',
	    body: JSON.stringify(updatedClient)
	})
	.then(async response => {
	    const data = await response.json().catch(() => ({ status: 'Error', message: 'Unknown error' }));

	    if (!response.ok || data.status === 'Error') {
	        const popup = $('<div class="popup"></div>').text(data.message).appendTo('body').fadeIn(400);
	        setTimeout(() => { popup.fadeOut(400, () => popup.remove()); }, 3000);
	        return;
	    }

	    const popup = $('<div class="popup">Updated Successfully!</div>').appendTo('body').fadeIn(400);
	    setTimeout(() => {
	        popup.fadeOut(400, () => {
	            popup.remove();
	            window.location = 'Clients.jsp';
	        });
	    }, 2000);

	    fetchClients();
	    $('#exampleModalScrollable15').modal('hide');
	})
	.catch(error => {
	    console.error("Error updating client:", error);
	    alert("Network error. Please try again.");
	});
}

	// Event listener for modal "Close" button
	document.querySelector('.btn.btn-sm.btn-danger').addEventListener('click', () => {
	    $('#exampleModalScrollable15').modal('hide');
	});
	
	
	// Event listener for modal "Close" button (auto handles modal closure if using Bootstrap)
	document.querySelector('.btn.btn-sm.btn-danger').addEventListener('click', function() {
	    $('#exampleModalScrollable15').modal('hide');
	});
	
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
		