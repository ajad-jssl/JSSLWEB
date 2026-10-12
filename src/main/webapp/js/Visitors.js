
const currentPage = window.location.pathname.split("/").pop() +'.jsp';

const UserId = sessionStorage.getItem('username');

let allowedActions = [];

async function loadActions() {

    try {

        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(currentPage)}`,
            {
                method: "GET",
                credentials: "include",
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

document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();
});


document.getElementById("modalScroll1").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}
	$('#exampleModalScrollable123').modal('show');
})





let rowCount = 0; // Counter to keep track of dynamic row IDs
let initialVisitorData = null;
document.addEventListener("DOMContentLoaded", function() {
	
 
  

    //fetchuom(1);
   // fetctype(1);
   // fetchUserList(selectedFactoryId);
});

let departmentMap = {}; // dept_id → department_name

document.addEventListener("DOMContentLoaded", function() {
	loadActions();

    fetch(new URL('/api/websmartuser/getAllDepartment', baseUrl1), {
        credentials: "include"
    })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                data.forEach(dept => {
                    departmentMap[dept.dept_id] = dept.department_name;
                });
                
            }
        })
        .catch(err => console.error("Failed to load departments", err));

});


document.addEventListener("DOMContentLoaded", function() {
    const requestedSelect = $("#meet");  // jQuery object for Select2
    const departmentInput = document.getElementById('department');
    const departmentIdInput = document.getElementById('departmentId');

    // Initialize Select2 with placeholder
    requestedSelect.select2({
        placeholder: "Select Employee",
        allowClear: true,
        width: "100%"
    });

    // 1️⃣ Fetch all users for the dropdown
    fetch(new URL('/api/websmartuser/getAll', baseUrl1), { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data.Data)) {
                // Clear dropdown and add placeholder option
                requestedSelect.html('<option value=" ">Select Employee</option>');

                // Populate dropdown
                data.Data.forEach(user => {
                    requestedSelect.append(new Option(user.username, user.id));
                });

                // Refresh Select2
                requestedSelect.val(null).trigger('change');
            } else {
                console.error("No users found or invalid response format.");
            }
        })
        .catch(error => console.error('Error fetching users:', error));

    // 2️⃣ On user selection, fetch the department name
    requestedSelect.on('change', function() {
        const selectedUserId = this.value;

        if (!selectedUserId) {
            departmentInput.value = '';
            departmentIdInput.value = '';
            return;
        }

        fetch(new URL(`/api/websmartuser/search?id=${selectedUserId}`, baseUrl1), { credentials: "include" })
            .then(response => response.json())
            .then(userResponse => {
                if (userResponse && userResponse.Data && userResponse.Data.dept1) {
                    departmentInput.value = userResponse.Data.dept1 || '';
                    departmentIdInput.value = userResponse.Data.department || '';
                   
                } else {
                    departmentInput.value = '';
                    departmentIdInput.value = '';
                }
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
                departmentInput.value = '';
                departmentIdInput.value = '';
            });
    });
});



$('#exampleModalScrollable123').on('shown.bs.modal', function() {
    initUniversalSelect2(this);
});

$('#exampleModalScrollable12').on('shown.bs.modal', function() {
    initUniversalSelect2(this);
});
$("#exampleModalScrollable123").on('shown.bs.modal', function() {
    initUniversalSelect2(this);
});




document.addEventListener("DOMContentLoaded", function() {
    const requestedSelect = $("#meet1"); // Use jQuery for Select2
    const departmentInput = $("#department1");
    const departmentIdInput = $("#departmentId1");

    // Initialize Select2
    requestedSelect.select2({
        placeholder: "Select employee",
        allowClear: true,
        width: "100%"
    });

    // 1️⃣ Fetch all users for the dropdown
    fetch(new URL('/api/websmartuser/getAll', baseUrl1), { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data.Data)) {
                requestedSelect.html('<option value=" ">Select Employee</option>');// Keep placeholder

                data.Data.forEach(user => {
                    requestedSelect.append(new Option(user.username, user.id, false, false));
                });

                requestedSelect.val(null).trigger('change'); // Reset placeholder
            } else {
                console.error("No users found or invalid response format.");
            }
        })
        .catch(error => console.error('Error fetching users:', error));

    // 2️⃣ On user selection, fetch the department name
    requestedSelect.on('change', function() {
        const selectedUserId = $(this).val();

        if (!selectedUserId) {
            departmentInput.val('');
            departmentIdInput.val('');
            return;
        }

        fetch(new URL(`/api/websmartuser/search?id=${selectedUserId}`, baseUrl1), { credentials: "include" })
            .then(response => response.json())
            .then(userResponse => {
                if (userResponse && userResponse.Data) {
                    departmentInput.val(userResponse.Data.dept1 || '');
                    departmentIdInput.val(userResponse.Data.department || '');
                } else {
                    departmentInput.val('');
                    departmentIdInput.val('');
                }
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
                departmentInput.val('');
                departmentIdInput.val('');
            });
    });


});


/*document.addEventListener("DOMContentLoaded", function() {
    // Fetch contract data from the backend (replace with your actual API endpoint)
    fetch(new URL('/jssl/user/listuser', baseUrl1), {
        credentials: "include"
    })
          fetch('http://localhost:8004/api/vtscontract/all')  // This is your Spring Boot API endpoint
        .then(response => response.json())  // Parse the JSON response
        .then(data => {
           
            // Get the select element for contract5
            const contractSelect = document.getElementById('employee');

            // Clear any existing options (except the default "Select")
            contractSelect.innerHTML = '<option value="">Select employee</option>';

            // Check if the data array is not empty
            if (data && Array.isArray(data.Data)) {
                // Loop through the contract data and create new option elements
                data.Data.forEach(contract => {
                    const option = document.createElement('option');
                    option.value = contract.id;  // contract_id as the value for the option
                    option.textContent = contract.username;  // jobCode as the display text for the option
                    contractSelect.appendChild(option);  // Append the option to the dropdown
                });
            } else {
                // If no contract data is available, display a "No contracts found" option
                const option = document.createElement('option');
                option.value = '';  // Empty value for "No contracts"
                option.textContent = 'No contracts found';
                contractSelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error('Error fetching contract data:', error);

            // Optionally, provide user feedback in case of an error
            const contractSelect = document.getElementById('employee');
            contractSelect.innerHTML = '<option value="">Error loading data</option>';
        });
});*/

let selectedvisitorId = null;

document.addEventListener("DOMContentLoaded", function() {
    // ====== MODAL HANDLING ======
    document.getElementById("createvisitorentry").addEventListener("click", function() {

        if (validatevisitorentryFields()) {
           
            $("#exampleModalCenter200").modal("show");
        } else {
            
        }
    });

    document.querySelector(".btn-secondary[data-dismiss='modal']").addEventListener("click", function() {
        
        $("#exampleModalCenter200").modal("hide");
    });

    document.getElementById("confirmvisitorentryyes").addEventListener("click", function() {
     
        $("#exampleModalCenter200").modal("hide");
        visitorentry(); // Ensure this function is defined elsewhere
    });


    $("#updatevisitors").on("click", function() {

        if (!validationbeforeUpdate()) {
            return; // stop update if validation fails
        }

      
        $("#exampleModalCenter201").modal("show");
    });

    $("#cancelvisitormodal").click(function() {
        
        $("#exampleModalCenter201").modal("hide");
    });

    // Click handler for the confirm update button
    $(document).on("click", "#confirmvisitorupd", function() {
        $("#exampleModalCenter201").modal("hide");

        if (!selectedvisitorId) {
            alert("Data not found for update.");
            return;
        }

        // ✅ CHECK IF ANY DATA CHANGED
        if (!hasVisitorDataChanged()) {
            //alert("No changes detected. Nothing to update.");
            showPopup("No Feilds Changes", "VMSEntry.jsp");
            return;
        }

        // ✅ CALL UPDATE ONLY IF DATA CHANGED
        updateVisitor(selectedvisitorId);
    });
    // Optional: Show popup and redirect
    window.showPopup = function(message, redirectUrl) {
        const popup = document.createElement("div");
        popup.className = "popup";
        popup.textContent = message;
        document.body.appendChild(popup);
        popup.style.display = "none";
        $(popup).fadeIn(400);

        setTimeout(function() {
            $(popup).fadeOut(400, function() {
                popup.remove();
                window.location = redirectUrl;
            });
        }, 2000);
    };


});
function validationbeforeUpdate() {
    let isValid = true;

    // helper
    const showError = (fieldId, errorId, condition) => {
        if (condition) {
            $("#" + errorId).show();
            isValid = false;
        } else {
            $("#" + errorId).hide();
        }
    };

    // dropdowns
    showError("selecttype1", "selecttype1Error", !$("#selecttype1").val() || $("#selecttype1").val() === " ");
    showError("company1", "company1Error", !$("#company1").val() || $("#company1").val() === " ");
    showError("vehicletype1", "vehicletype1Error", !$("#vehicletype1").val() || $("#vehicletype1").val() === " ");
    showError("meet1", "meet1Error", !$("#meet1").val() || $("#meet1").val() === " ");

    // text fields (non-readonly)
    showError("visitorname1", "visitorname1Error",
        !$("#visitorname1").val().trim());

    showError("vehicleno1", "vehicleno1Error",
        !$("#vehicleno1").val().trim());

    showError("purpose1", "purpose1Error",
        !$("#purpose1").val().trim());

    showError("remarks1", "remarks1Error",
        !$("#remarks1").val().trim());

    // contact no (10 digits)
    const contact = $("#contactno2").val().trim();
    showError("contactno2", "contactno2Error",
        contact.length !== 10);

    return isValid;
}



document.addEventListener("DOMContentLoaded", function() {
    $("#selecttype, #selecttype1").select2({
        placeholder: "Select pass ",
        allowClear: true,
        width: "100%"
    });

    // Load the pass types
    loadPassTypes();
});


function loadPassTypes() {
    const dropdown = $("#selecttype");
    const dropdown1 = $("#selecttype1");

    fetch(new URL('/api/visitor/jims/passtype', baseUrl1), {
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            // Clear dropdown and add placeholder
            dropdown.html('<option value=" ">Select Pass </option>');
            dropdown1.html('<option value=" ">Select Pass</option>');

            // Populate options
            data.forEach(item => {
                dropdown.append(new Option(item.pass_name, item.pass_id));
                dropdown1.append(new Option(item.pass_name, item.pass_id));
            });

            // Reset Select2
            dropdown.val(null).trigger('change');
            dropdown1.val(null).trigger('change');
        })
        .catch(error => {
            console.error("Error fetching pass data:", error);
            alert("Failed to load pass data: " + error.message);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
    const vehicleSelect = $("#contact"); // jQuery Select2

    // Fetch vehicle list
    fetch(new URL(`/api/visitor/jims/visitorsearch?factoryId=${selectedFactoryId}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            vehicleSelect.html('<option value=" ">Select ContactNo</option>');

            data.forEach(vehicle => {
                vehicleSelect.append(new Option(vehicle.contact_no, vehicle.visitor_id));
            });

            vehicleSelect.val(null).trigger('change'); // Reset placeholder
        })
        .catch(error => console.error("Error fetching pass data:", error));

    // On selection
    vehicleSelect.on('change', function() {
        const selectedVisitorId = this.value;

        // If no contract selected, clear all fields
        if (!selectedVisitorId || selectedVisitorId.trim() === "") {
            document.getElementById("visitorname").value = '';
            document.getElementById("contactno1").value = '';
            document.getElementById("vehicleno").value = '';
            document.getElementById('address').value = '';
            document.getElementById('location').value = '';
            document.getElementById("purpose").value = '';
            document.getElementById("remarks").value = '';

            // Clear Select2 dropdowns
            $("#selecttype").val(null).trigger('change');
            $("#vehicletype").val(null).trigger('change');
            $("#company").val(null).trigger('change');
            $("#meet").val(null).trigger('change');
            $("#department").val(null).trigger('change');

            return; // Stop further processing
        }

        // Fetch visitor details
        fetch(new URL(`/api/visitor/jims/visitoroutfetch?Visitor_id=${selectedVisitorId}`, baseUrl1), {
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const item = data[0];

                    // Plain input fields
                    document.getElementById("visitorname").value = item.visitor_name || '';
                    document.getElementById("contactno1").value = item.Contact_no || '';
                    document.getElementById("vehicleno").value = item.Vecno || '';
                    document.getElementById('address').value = item.Address || '';
                    document.getElementById('location').value = item.City_name || '';
                    document.getElementById("purpose").value = item.Purpose || '';
                    document.getElementById("remarks").value = item.Remarks || '';

                    // Select2 dropdowns
                    $("#selecttype").val(item.pass_id || null).trigger('change');
                    $("#vehicletype").val(item.Vec_type_id || null).trigger('change');
                    $("#company").val(item.Company_id || null).trigger('change');
                    $("#meet").val(userMap[item.wtm] || null).trigger('change');
                    $("#department").val(departmentMap[item.department] || null).trigger('change');

                } else {
                    alert("No details found for the selected vehicle.");
                }
            })
            .catch(error => console.error("Error fetching vehicle details:", error));
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const companyDropdown = $("#company");
    const companyDropdown1 = $("#company1");
    const locationInput = document.getElementById('location');
    const addressInput = document.getElementById('address');
    const locationInput1 = document.getElementById('location1');
    const addressInput1 = document.getElementById('address1');

    // Initialize Select2 with placeholder
    companyDropdown.select2({
        placeholder: "Select Company",
        allowClear: true,
        width: "100%"
    });
    companyDropdown1.select2({
        placeholder: "Select Company",
        allowClear: true,
        width: "100%"
    });

    // Fetch all transporter names and populate both dropdowns
    function fetchTransporterNames() {
        fetch(new URL('/api/VMScompany', baseUrl1), { credentials: "include" })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                // Clear dropdowns and add placeholder
                companyDropdown.html('<option value=" ">Select Company</option>');
                companyDropdown1.html('<option value=" ">Select Company</option>');

                if (data && Array.isArray(data)) {
                    data.forEach(item => {
                        companyDropdown.append(new Option(item.company_name, item.company_id));
                        companyDropdown1.append(new Option(item.company_name, item.company_id));
                    });
                }

                // Refresh Select2 to show placeholder
                companyDropdown.val(null).trigger('change');
                companyDropdown1.val(null).trigger('change');
            })
            .catch(error => {
                console.error('Error fetching transporter names:', error);
                alert('Failed to load transporter names: ' + error.message);
            });
    }

    // Fetch company details based on selected ID
    function fetchCompanyDetails(companyId, locInput, addrInput) {
        if (!companyId || companyId == " ") {
            locInput.value = '';
            addrInput.value = '';
            return;
        }

        fetch(new URL(`/api/VMScompany/company/jims/details?company_id=${companyId}`, baseUrl1), { credentials: "include" })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    const company = data[0];
                    locInput.value = company.City_name || '';
                    addrInput.value = company.Address || '';
                } else {
                    locInput.value = '';
                    addrInput.value = '';
                    alert('No company details found for the selected company.');
                }
            })
            .catch(error => {
                console.error('Error fetching company details:', error);
                alert('Failed to load company details: ' + error.message);
            });
    }

    // Event listeners for dropdown change
    companyDropdown.on('change', function() {
        fetchCompanyDetails(this.value, locationInput, addressInput);
    });

    companyDropdown1.on('change', function() {
        fetchCompanyDetails(this.value, locationInput1, addressInput1);
    });

    // Initialize dropdowns on page load
    fetchTransporterNames();
});


document.addEventListener("DOMContentLoaded", function() {
	
	    let userMap = {};
	    let selectedFactoryId = sessionStorage.getItem("selectedFactoryId");

	    fetch(new URL('/api/websmartuser/getAll', baseUrl1), {
	        credentials: "include"
	    })
	    .then(res => res.json())
	    .then(response => {

	       

	        if (response && Array.isArray(response.Data)) {

	            response.Data.forEach(u => {
	                userMap[String(u.id)] = u.username;
	            });

	         
	        } else {
	            console.error("Invalid response format");
	        }
	    })
	    .catch(err => console.error("User map error:", err));

	
    const visitorSelect = document.getElementById("Visitor_id");
    const submitButton = document.getElementById("btnsubmit");

    // Fetch and populate Visitor IDs
    fetch(new URL(`/api/visitor/jims/visitorid?factoryId=${selectedFactoryId}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())

        .then(data => {
            visitorSelect.innerHTML = "<option value=' '>Select Visitors</option>";

            data.forEach(visitor => {
                const option = document.createElement("option");
                option.value = visitor.v_id;
                option.textContent = visitor.visitor_id;
                visitorSelect.appendChild(option);
            });

            // ✅ Enable Select2 here
            $('#Visitor_id').select2({
                placeholder: "Search Visitor...",
                allowClear: true,
                width: '100%'
            });
        })

        .catch(error => {
            console.error("Error fetching pass data:", error);
        });

    // Handle visitor ID change
    $('#Visitor_id').on('change', function() {

        const visitorId = $('#Visitor_id option:selected').text();

        if (!visitorId || visitorId.trim() === "") return;

        fetch(new URL(`/api/visitor/jims/visitoroutfetch?Visitor_id=${visitorId}`, baseUrl1), {
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const item = data[0];

                    document.getElementById("company2").value = item.Company_name || '';
                    document.getElementById("vehicle_type").value = item.Vtype || '';
                    document.getElementById("location").value = item.City_name || '';
                    document.getElementById("address").value = item.Address || '';
                    document.getElementById("visitor_name").value = item.visitor_name || '';
                    document.getElementById("contact_no").value = item.Contact_no || '';
                    document.getElementById("vehicle_no").value = item.Vecno || '';
                    document.getElementById("in_time").value = item.Intime || '';
                    document.getElementById("purpose").value = item.Purpose || '';
                    document.getElementById("in_remarks").value = item.Remarks || '';

                    document.getElementById("whom").value = userMap[item.wtm] || '';
                    document.getElementById("department").value = departmentMap[item.department] || '';

                    const fullDate = item.Created_date || '';
                    let formattedDateTime = '';

                    if (fullDate) {
                        const [datePart, timePart] = fullDate.split(' ');
                        const [hours, minutes] = timePart.split(':');
                        formattedDateTime = `${datePart}T${hours}:${minutes}`;
                    }

                    document.getElementById("datetime").value = formattedDateTime || '';

                } else {
                    alert("No details found for the selected visitor.");
                }
            })
            .catch(error => {
                console.error("Error fetching visitor details:", error);
            });

    });

    // Button click handler (only once!)
    submitButton.addEventListener("click", function() {
        const selectedId = visitorSelect.value;
        const outremarks = document.getElementById("out_remarks").value.trim();
        const errorDiv = document.getElementById("out_remarksError");

        // Reset error display
        errorDiv.style.display = "none";

        if (!selectedId || selectedId == " ") {
            showModalPopup("Please select a Visitor ID.");
            return;
        }

        if (!outremarks) {
            errorDiv.style.display = "block"; // Show inline error
            return;
        }

        // If everything is valid, show the confirmation modal
     
        $("#exampleModalCenter205").modal("show");
    });


    // "Confirm" button inside modal
    document.getElementById("confirmvisitoroutentryyes").addEventListener("click", function() {
        const selectedId = visitorSelect.value;
        const outremarks = document.getElementById("out_remarks").value.trim();
        const errorDiv = document.getElementById("out_remarksError");

        if (!outremarks) {
            errorDiv.style.display = "block";
            return; // Stop further execution
        }

        errorDiv.style.display = "none"; // Hide error if previously shown
        $('#exampleModalCenter205').modal('hide'); // Hide modal
        visitorout(selectedId); // Call actual function
    });

    // Popup function
    window.showPopup1 = function(message, redirectUrl) {
        const popup = document.createElement("div");
        popup.className = "popup";
        popup.textContent = message;
        document.body.appendChild(popup);
        popup.style.display = "none";
        $(popup).fadeIn(400);
        setTimeout(function() {
            $(popup).fadeOut(400, function() {
                popup.remove();
                window.location = redirectUrl;
            });
        }, 2000);
    };
});
document.addEventListener("DOMContentLoaded", function() {
    const vehicleSelect = $("#vehicletype");
    const vehicleSelect1 = $("#vehicletype1");

    // Initialize Select2 with placeholder
    vehicleSelect.select2({
        placeholder: "Select Vehicle Type",
        allowClear: true,
        width: "100%"
    });
    vehicleSelect1.select2({
        placeholder: "Select Vehicle Type",
        allowClear: true,
        width: "100%"
    });

    // Fetch vehicle types
    fetch(new URL('/api/visitor/jims/vechtype', baseUrl1), { credentials: "include" })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            // Clear both dropdowns and add placeholder option
            vehicleSelect.html('<option value=" ">Select vehicle Type</option>');
            vehicleSelect1.html('<option value=" ">Select vehicle Type</option>');

            

            // Populate both dropdowns
            data.forEach(vehicle => {
                vehicleSelect.append(new Option(vehicle.Vtype, vehicle.vid));
                vehicleSelect1.append(new Option(vehicle.Vtype, vehicle.vid));
            });

            // Refresh Select2 to show placeholder
            vehicleSelect.val(null).trigger('change');
            vehicleSelect1.val(null).trigger('change');
        })
        .catch(error => {
            console.error("Error fetching vehicle type data:", error);
            alert("Failed to load vehicle types: " + error.message);
        });
});


function generateVisitoreNo(callback) {
    // Fetch the auto-generated number from the backend
    $.ajax({
        url: new URL('/api/visitor/jims/autovisitorno', baseUrl1), // Endpoint
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(autoNumber) {
            // If the auto-generated number is 0 or an invalid number, start with 1
			if (autoNumber === 0 || isNaN(autoNumber)) {
			     // Table is empty - start from your chosen number
			     autoNumber = 53462;
			 } else {
			     // Table has data - continue sequence
			     autoNumber = parseInt(autoNumber) + 1;
			 }

			 const visitor_id = `V${String(autoNumber).padStart(5, '0')}`;

            // Call the callback with the generated vehicle number
            callback(visitor_id);
        },
        error: function(error) {
            console.error('Error generating vehicle number:', error);
            callback('VL0001'); // Default fallback
        }
    });
}

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


function getIndianTimeOnly(date) {
    const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
    };

    const istDate = new Date(date.toLocaleString('en-US', options));

    const hours = istDate.getHours().toString().padStart(2, '0');
    const minutes = istDate.getMinutes().toString().padStart(2, '0');
    const seconds = istDate.getSeconds().toString().padStart(2, '0');

    // Return the time in HH:mm:ss format, which Java can easily deserialize
    return `${hours}:${minutes}:${seconds}`;
}



function validatevisitorentryFields() {
    var isValid = true;

    const selecttype = document.getElementById("selecttype").value;
    const companyid = document.getElementById("company").value;
    const visitorname = document.getElementById("visitorname").value;
    const contractnumber = document.getElementById("contactno1").value;
    const vtype_id = document.getElementById("vehicletype").value;
    const vecno = document.getElementById("vehicleno").value;
    const purpose = document.getElementById("purpose").value;
    const remarks = document.getElementById("remarks").value;
    const wtm = document.getElementById("meet").value;

    $('.error-message').hide();  // Clear previous errors gatepass

    if (!selecttype || selecttype == " ") {
        $('#selecttypeError').show();
        isValid = false;
    }
    if (!companyid || companyid == " ") {
        $('#companyError').show();
        isValid = false;
    }
    if (!visitorname) {
        $('#visitornameError').show();
        isValid = false;
    }
    if (!contractnumber || contractnumber.length !== 10) {
        $('#contactno1Error')
            .text("Contract No must be exactly 10 digits")
            .show();
        isValid = false;
    }
    if (!vtype_id) {
        $('#vehicletypeError').show();
        isValid = false;
    }
    if (!vecno) {
        $('#vehiclenoError').show();
        isValid = false;
    }
    if (!purpose) {
        $('#purposeError').show();
        isValid = false;
    }
    if (!remarks) {
        $('#remarksError').show();
        isValid = false;
    }
    if (!wtm || wtm == " ") {
        $("#meetError").show();
        isValid = false;
    }

    if (!capturedImageData) {
        alert("Please capture an image first!");
        isValid = false;
        return;
    }
    return isValid;

}
function showModalPopup(message) {
    // Set the error message
    $('#errorMessageupcon').text(message);
    // Show the error modal
    $('#exampleModalCenterDupUPcon').modal('show');
}

// Function to close the error modal when "OK" is clicked
$(document).on('click', '#modal_okk', function() {
    // Hide the error modal when "OK" is clicked
    $('#exampleModalCenterDupUPcon').modal('hide');
});

const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');


function visitorentry() {
    const selecttype = document.getElementById("selecttype").value;
    const companyid = document.getElementById("company").value;
    const visitorname = document.getElementById("visitorname").value;
    const contractnumber = document.getElementById("contactno1").value;
    const vtype_id = document.getElementById("vehicletype").value;
    const vecno = document.getElementById("vehicleno").value;
    const purpose = document.getElementById("purpose").value;
    const remarks = document.getElementById("remarks").value;
    const meet = document.getElementById("meet").value;
    const dept = document.getElementById("departmentId").value;

    let now = new Date();
    let createdDateTime = getIndianDateTimeFormat(now);
    let intimeFull = getIndianDateTimeFormat(now);  // ← FIX

    generateVisitoreNo(function(visitor_id) {

        const visitordata = {
            contact_no: contractnumber,
            vec_type_id: vtype_id,
            visitor_id: visitor_id,
            created_date: createdDateTime,
            created_by: createdById,
            remarks: remarks,
            purpose: purpose,
            vecno: vecno,
            intime: intimeFull,        // ← FIXED (full datetime)
            company_id: companyid,
            pass_id: selecttype,
            visitor_name: visitorname,
            wtm: meet,
            department: dept,
            factoryId: selectedFactoryId,
            capture: capturedImageData
        };

        fetch(new URL('/api/visitor', baseUrl1), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(visitordata)
        })
            .then(async response => {
                const responseBody = await response.text();
                if (response.ok) {
                    showPopup("Inserted Successfully", "VMSEntry.jsp");
                } else {
                    alert("Error submitting data: " + responseBody);
                }
            })
            .catch(error => {
                alert('An error occurred. Please try again.');
            });
    });
}




let capturedImageData = null;

// 🎥 Initialize camera
document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById("videoElement");
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => { video.srcObject = stream; })
        .catch(err => alert("Camera access denied: " + err));
});

document.getElementById("capture").addEventListener("click", function() {
    const video = document.getElementById("videoElement");
    const canvas = document.getElementById("canvas");
    const img = document.getElementById("capturedImage");

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    capturedImageData = canvas.toDataURL("image/png");
    img.src = capturedImageData;
});




const factoryId = sessionStorage.getItem('selectedFactoryId'); // Use the correct variable name


function visitorout(selectedId) {
    const outremarks = document.getElementById("out_remarks").value;
    let currentDate = new Date();
    let currentDateTimeString = getIndianDateTimeFormat(currentDate);
    let currentTimeOnly = getIndianTimeOnly(currentDate);

    // Create the data object for the PUT request
    const visitoroutdata = {
        outremarks: outremarks,
        modified_by: createdById, // Assuming this is your user ID
        modified_date: currentDateTimeString,
        outtime: currentTimeOnly,
        factory_id: selectedFactoryId // Use the correct variable
    };

    // Make the PUT request to update visitor data
    fetch(new URL(`api/visitor/${selectedId}`, baseUrl1), {
        method: 'PUT',
        credentials: 'include',  // Always send cookies (like JSESSIONID)
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitoroutdata)
    })
        .then(response => {
            if (response.ok) {
                // Success response handling
                showPopup1("Data submitted successfully!", "VMSEntry.jsp");
                // Optionally clear form fields here if needed
                // clearFormFields();
            } else {
                // Handle non-200 responses (e.g., 400, 500, etc.)
                return response.text().then(errorMessage => {
                    alert('Error submitting data: ' + errorMessage);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
}




function fetchAndDisplayVisitors() {

    const factoryId = parseInt(sessionStorage.getItem("selectedFactoryId"));

    if (!factoryId || isNaN(factoryId)) {
        console.warn("No valid factory ID");
        return;
    }

    // Destroy old table
    if ($.fn.DataTable.isDataTable('#table_ID')) {
        $('#table_ID').DataTable().clear().destroy();
    }

    $('#table_ID').DataTable({
		

        processing: true,
        serverSide: true,
        scrollX: true,
        searching: true,
        pageLength: 10,
        dom: 'Bfrtip',
		

        buttons: [
            {
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Visitor Data'
            }
        ],

        ajax: function (data, callback, settings) {

            const page = data.start / data.length;
            const size = data.length;
            const searchValue = data.search.value;

            const url = new URL(`/api/visitor`, baseUrl1);

            url.searchParams.append('factory_id', factoryId);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
            url.searchParams.append('search', searchValue);

            fetch(url, {
                method: "GET",
                credentials: "include"
            })
            .then(response => response.json())
            .then(json => {

                let slNo = data.start + 1;

                const rows = json.data.map(item => {

                    const isOutTimePresent =
                        item.outtime !== null &&
                        item.outtime !== "";

                    const editIcon = `
                        <i class="fa fa-pen
                            ${isOutTimePresent
                                ? 'text-secondary'
                                : 'cursor-pointer'}
                            "
                            style="
                                cursor:${isOutTimePresent
                                    ? 'not-allowed'
                                    : 'pointer'};
                                opacity:${isOutTimePresent
                                    ? '0.3'
                                    : '1'};
                            "
                            title="${isOutTimePresent
                                ? 'Visitor already out'
                                : 'Edit'}"
                            ${isOutTimePresent
                                ? ''
                                : `onclick="editvisitor('${item.v_id}')"`
                            }>
                        </i>`;

                    return [
                        slNo++,
                        item.visitor_id || '',
                        item.visitor_name || '',
                        item.contact_no || '',
                        item.vecno || '',
                        item.purpose || '',
                        item.remarks || '',
                        editIcon
                    ];
                });

                callback({
                    draw: data.draw,
                    recordsTotal: json.totalRecords,
                    recordsFiltered: json.totalItems,
                    data: rows
                });

            })
            .catch(error => {

                console.error("Error fetching visitors:", error);

                callback({
                    draw: data.draw,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data: []
                });
            });
        },

        columns: [
            { title: "Sl No", orderable: false },
            { title: "Visitor ID" },
            { title: "Visitor Name" },
            { title: "Contact No" },
            { title: "Vehicle No" },
            { title: "Purpose" },
            { title: "Remarks" },
            { title: "Edit", orderable: false }
        ]
    });
	$('.dt-buttons').css({
	    'float': 'left',
	    'margin-right': '10px'
	});

	$('.dataTables_filter').css({
	    'float': 'right',
	    'text-align': 'right',
	    'margin-bottom': '10px'
	});
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayVisitors);


async function editvisitor(v_id) {
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const apiUrl = new URL(`/api/visitor/${v_id}`, baseUrl1);
    const submitButton = document.getElementById("updatevisitors");
    submitButton.addEventListener("click", function() {
        selectedvisitorId = v_id;
    });

    try {
        // Fetch visitor data using apiUrl, not url
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });

        if (!response.ok) throw new Error(`Failed to fetch visitor data: ${response.status}`);

        const visitor = await response.json();

        const deptResponse = await fetch(new URL('/api/visitor/jims/departments', baseUrl1), { credentials: "include" });
        if (!deptResponse.ok) throw new Error(`Failed to fetch departments: ${deptResponse.status}`);
        const departments = await deptResponse.json(); // Array of {dept_id, department_name}

        // 3️⃣ Map visitor.department (ID stored as varchar) to name
        let departmentName = '';
        if (visitor.department) {
            const dept = departments.find(d => d.dept_id.toString() === visitor.department);
            if (dept) departmentName = dept.department_name;
        }

     

        // Plain input fields
        document.getElementById('visitorname1').value = visitor.visitor_name || '';
        document.getElementById('contactno2').value = visitor.contact_no || '';
        document.getElementById('vehicleno1').value = visitor.vecno || '';
        document.getElementById('purpose1').value = visitor.purpose || '';
        document.getElementById('remarks1').value = visitor.remarks || '';
        document.getElementById('department1').value = departmentName || '';
        document.getElementById('departmentId1').value = visitor.department || '';

        // Select2 dropdowns — use jQuery .val() + trigger('change')
        $('#selecttype1').val(visitor.pass_id || null).trigger('change');
        $('#company1').val(visitor.company_id || null).trigger('change');
        $('#vehicletype1').val(visitor.vec_type_id || null).trigger('change');
        $('#meet1').val(visitor.wtm || null).trigger('change');

        // Update modal fields for location and address
        window.tlocationInput = document.getElementById('location1');
        window.taddressInput = document.getElementById('address1');

        if (!window.tlocationInput || !window.taddressInput) {
            console.error("Input elements 'location1' or 'address1' not found");
            throw new Error("Required input fields are missing");
        }

        // Fetch company details if company_id exists
        if (visitor.company_id) {
            fetchCompanyDetails(visitor.company_id);
            $('#exampleModalScrollable12').modal('show');
        } else {
            // Clear location and address if no company_id
            window.tlocationInput.value = '';
            window.taddressInput.value = '';
            $('#exampleModalScrollable12').modal('show');
        }

        // Populate company1 dropdown (optional, if needed)
        /*    const companySelect = document.getElementById('company1');
            const companyResponse = await fetch(new URL('/api/VMScompany', baseUrl1), {
                credentials: "include"
            });
            if (!companyResponse.ok) throw new Error(`Failed to fetch companies: ${companyResponse.status}`);
            const companies = await companyResponse.json();
            companySelect.innerHTML = '<option value=" ">Select Company</option>';
            companies.forEach(item => {
                const option = document.createElement('option');
                option.value = item.company_id;
                option.textContent = item.company_name;
                companySelect.appendChild(option);
            });
            companySelect.value = visitor.company_id || '';*/

        initialVisitorData = {
            visitor_name: visitor.visitor_name || '',
            contact_no: visitor.contact_no || '',
            vec_type_id: visitor.vec_type_id || '',
            vecno: visitor.vecno || '',
            whom_to_meet: visitor.wtm || '',
            department: visitor.department || '',
            purpose: visitor.purpose || '',
            remarks: visitor.remarks || '',
            pass_id: visitor.pass_id || '',
            company_id: visitor.company_id || ''
        };

    } catch (error) {
        console.error('Error fetching visitor data:', error);
        alert('Could not load visitor data: ' + error.message);
    }
}



function hasVisitorDataChanged() {
    if (!initialVisitorData) return true; // safety fallback

    const currentData = {
        visitor_name: document.getElementById('visitorname1').value || '',
        contact_no: document.getElementById('contactno2').value || '',
        vec_type_id: document.getElementById('vehicletype1').value || '',
        vecno: document.getElementById('vehicleno1').value || '',
        whom_to_meet: document.getElementById('meet1').value || '',
        department: document.getElementById('departmentId1').value || '',
        purpose: document.getElementById('purpose1').value || '',
        remarks: document.getElementById('remarks1').value || '',
        pass_id: document.getElementById('selecttype1').value || '',
        company_id: document.getElementById('company1').value || ''
    };

    // 🔍 Compare field-by-field
    return Object.keys(initialVisitorData).some(
        key => String(initialVisitorData[key]) !== String(currentData[key])
    );
}

// Ensure fetchCompanyDetails uses the correct input IDs
function fetchCompanyDetails(companyId) {
  
    fetch(new URL(`/api/VMScompany/company/jims/details?company_id=${companyId}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch company details: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
          
            if (Array.isArray(data) && data.length > 0) {
                const company = data[0];
                window.tlocationInput.value = company.City_name || '';
                window.taddressInput.value = company.Address || '';
            } else {
                console.error('No company details found for company_id:', companyId);
                window.tlocationInput.value = '';
                window.taddressInput.value = '';
            }
        })
        .catch(error => {
            console.error('Error fetching company details:', error);
            window.tlocationInput.value = '';
            window.taddressInput.value = '';
            alert('Failed to load company details: ' + error.message);
        });
}

async function updateVisitor(v_id) {
    const apiUrl = new URL(`/api/visitor/${v_id}`, baseUrl1);
    let currentDate = new Date();
    let currentDateTimeString = getIndianDateTimeFormat(currentDate);
    // Collect visitor data (excluding company details)
    const updatedVisitor = {
        visitor_name: document.getElementById('visitorname1').value || null,
        contact_no: document.getElementById('contactno2').value || null,
        vec_type_id: document.getElementById('vehicletype1').value || null,
        vecno: document.getElementById('vehicleno1').value || null,
        whom_to_meet: document.getElementById('meet1').value || null,
        department: document.getElementById('departmentId1').value || null,
        purpose: document.getElementById('purpose1').value || null,
        remarks: document.getElementById('remarks1').value || null,
        pass_id: document.getElementById('selecttype1').value || null,
        company_id: document.getElementById('company1').value,
        modified_by: createdById,
        modified_date: currentDateTimeString,
        factoryId: selectedFactoryId
    };

 
    try {
        // Update visitor
        const visitorResponse = await fetch(apiUrl, {
            method: 'PUT',
            credentials: 'include',   // ✅ replaces xhrFields
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedVisitor)
        })

        if (!visitorResponse.ok) {
            throw new Error(`Failed to update visitor: ${visitorResponse.status}`);
        }

    
        $('#exampleModalScrollable12').modal('hide');
        //  fetchAndDisplayVisitors(); // Refresh table
        showPopup("Visitor and company updated successfully!", "VMSEntry.jsp");
        // alert('Visitor and company updated successfully!');
    } catch (error) {
        console.error('Error updating visitor or company:', error);
        alert('Failed to update: ' + error.message);
    }
}
function showPopup(message, redirectUrl) {
    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
    setTimeout(function() {
        popup.fadeOut(400, function() {
            $(this).remove();
            window.location = redirectUrl;
        });
    }, 2000);
}


function initUniversalSelect2(container = document) {
    $(container).find("select").each(function() {

        const $select = $(this);

        // ❌ Skip disabled or readonly selects
        if ($select.prop("disabled") || $select.attr("readonly")) {
            return;
        }

        // ❌ Skip already initialized Select2
        if ($select.hasClass("select2-hidden-accessible")) {
            return;
        }

        let modalParent = $select.closest(".modal");

        $select.select2({
            placeholder: $select.find("option:first").text() || "Select",
            allowClear: true,
            width: "100%",
            dropdownParent: modalParent.length ? modalParent : $(document.body)
        });
    });
}

