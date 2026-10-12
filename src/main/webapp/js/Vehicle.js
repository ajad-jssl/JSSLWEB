
const MainPage = 'Vehicle.jsp';
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
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}
	$('#exampleModalScrollable123').modal('show');
})

let rowCount = 0; // Counter to keep track of dynamic row IDs

document.addEventListener("DOMContentLoaded", function () {
    // First, check if there's already an initial row
    addRow(); // Initially add a row
    // Populate the dropdowns for the first row

    fetchuom(1);
    fetctype(1);
    fetchUserList(selectedFactoryId);
});

const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

document.addEventListener('DOMContentLoaded', fetchAndDisplayVehicle);
/*document.addEventListener('DOMContentLoaded', 	fetchVehicleTypes);*/
function fetchAndDisplayVehicle() {
    currentFactoryIdVehicle = parseInt(sessionStorage.getItem("selectedFactoryId"), 10);
 
    if (!currentFactoryIdVehicle || isNaN(currentFactoryIdVehicle)) {
        console.warn("No valid factory ID in sessionStorage");
        return;
    }
 
    // 🔥 Destroy existing DataTable
    if ($.fn.DataTable.isDataTable('#Table1')) {
        $('#Table1').DataTable().clear().destroy();
    }
 
    $('#Table1').DataTable({
        processing: true,
        serverSide: true,
        scrollX: true,
        searching: true,
        dom: 'Bfrtip',
        pageLength: 10,
        buttons: [
            {
                text: 'Export to Excel',
                action: function () {
                    const url = new URL(`/api/invoiceexit`, baseUrl1);
                    url.searchParams.append('factory_id', currentFactoryIdVehicle);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);
 
                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {
                            if (!json.data || json.data.length === 0) {
                                alert('No data to export');
                                return;
                            }
 
                            const exportData = json.data.map(item => [
                                item.ine_id || '',
                                item.vechile_id || '',
                                item.vecno || '',
                                item.dname || '',
                                item.dmbno || '',
                                item.dl || '',
                                item.helper || '',
                                item.inremarks || ''
                            ]);
 
                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>ID</th>',
                                        '<th>Vehicle ID</th>',
                                        '<th>Vehicle No</th>',
                                        '<th>Driver Name</th>',
                                        '<th>Driver Mobile</th>',
                                        '<th>License No</th>',
                                        '<th>Helper Name</th>',
                                        '<th>Remarks</th>'
                                    )
                                ),
                                $('<tbody>').append(
                                    exportData.map(row =>
                                        $('<tr>').append(
                                            row.map(cell => $('<td>').text(cell))
                                        )
                                    )
                                )
                            ).appendTo('body');
 
                            $(tempTable).DataTable({
                                buttons: [{
                                    extend: 'excelHtml5',
                                    title: 'Vehicle Invoice Exit Report'
                                }]
                            }).button(0).trigger();
 
                            setTimeout(() => {
                                $(tempTable).DataTable().destroy();
                                $(tempTable).remove();
                            }, 1000);
                        })
                        .catch(error => console.error('Export error:', error));
                }
            }
        ],
        columns: [
            { title: "Sl No",              orderable: false },
            { title: "Vehicle ID"                           },
            { title: "Vehicle No"                           },
            { title: "Driver Name"                          },
            { title: "Driver Mobile No"                     },
            { title: "Driver License No"                    },
            { title: "Helper Name"                          },
            { title: "Remarks"                              },
            { title: "Edit",               orderable: false }
          
        ],
        ajax: function (data, callback, settings) {
            const page        = data.start / data.length;
            const size        = data.length;
            const searchValue = data.search.value;
 
            const url = new URL(`/api/invoiceexit`, baseUrl1);
            url.searchParams.append('factory_id', currentFactoryIdVehicle);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
            if (searchValue) {
                url.searchParams.append('search', searchValue);
            }
 
            console.log('Fetching URL:', url.toString());
 
            fetch(url, { credentials: "include" })
                .then(response => response.json())
                .then(json => {
                    console.log('Response:', json);
 
                    if (!json.data) {
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });
                        return;
                    }
 
                    let slNo = data.start + 1;
 
                    const rows = json.data.map(item => {
                        const isOutDone = item.outtime !== null && item.outtime !== "";
 
                        // ── Edit icon ────────────────────────────────
                        const editIcon = isOutDone
                            ? `<i class="fa fa-pen text-muted"
                                  style="cursor: not-allowed; opacity: 0.5;"
                                  title="Edit disabled. Out time already captured"></i>`
                            : `<i class="fa fa-pen text-primary cursor-pointer"
                                  style="cursor: pointer;"
                                  title="Edit"
                                  onclick="editvehicle(${item.ine_id}, '${item.vechile_id}')"></i>`;
 
                        // ── Status checkbox ──────────────────────────
                       
                        return [
                            slNo++,                          // col 0 — Sl No
                                          // col 1
                            item.vechile_id || '',           // col 2
                            item.vecno || '',                // col 3
                            item.dname || '',                // col 4
                            item.dmbno || '',                // col 5
                            item.dl || '',                   // col 6
                            item.helper || '',               // col 7
                            item.inremarks || '',            // col 8
                            editIcon                        // col 9
                                                  // col 10
                        ];
                    });
 
                    callback({
                        draw: data.draw,
                        recordsTotal: json.totalItems,
                        recordsFiltered: json.totalItems,
                        data: rows
                    });
 
                    // Attach status change handler
                   
                })
                .catch(error => {
                    console.error('Error fetching vehicle data:', error);
                    callback({
                        draw: data.draw,
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        data: []
                    });
                });
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    const requestedSelect = document.getElementById('whom');
    const departmentInput = document.getElementById('department');

    // 1️⃣ Fetch all users for the dropdown
    fetch(new URL('/api/websmartuser/getAll', baseUrl1), { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data.Data)) {
                requestedSelect.innerHTML = '<option value="">Select employee</option>';
                data.Data.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = user.username;
                    requestedSelect.appendChild(option);
                });

                // Optional: initialize Select2 if you use it
           /*     if (window.jQuery && $.fn.select2) {
                    $('#whom').select2({
                        placeholder: 'Select an employee',
                        allowClear: true
                    });
                }*/
				
				initializeSelect2();
				
            } else {
                console.error("No users found or invalid response format.");
            }
        })
        .catch(error => console.error('Error fetching users:', error));

    // 2️⃣ On user selection, fetch the department name
	$('#whom').on('change', function () {
	    const selectedUserId = $(this).val();

	    if (!selectedUserId) {
	        $('#department').val('');
	        return;
	    }

	    $.ajax({
	        url: baseUrl1 + `/api/websmartuser/search?id=${selectedUserId}`,
	        method: 'GET',
	        xhrFields: {
	            withCredentials: true
	        },
	        success: function (userResponse) {
	            if (userResponse && userResponse.Data && userResponse.Data.dept1) {
	                $('#department').val(userResponse.Data.dept1);
	            } else {
	                $('#department').val('');
	            }
	        },
	        error: function (error) {
	            console.error('Error fetching user info:', error);
	            $('#department').val('');
	        }
	    });
	});
});


function fetchRegisterTypes() {
    fetch(new URL('/api/Regtype/filter?include=true', baseUrl1), {
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const registerSelect = document.getElementById("register");
        const registerSelect1 = document.getElementById("register1");
        const addRowBtn = document.getElementById("btnAddRow"); // ✅ ADDED

        if (!registerSelect || !registerSelect1) {
            console.error("Dropdowns not found");
            return;
        }

        registerSelect.innerHTML = "<option value=''>Select</option>";
        registerSelect1.innerHTML = "<option value=''>Select</option>";

        console.log("API Response for register types:", data);

        data.forEach(vehicle => {
            const option1 = document.createElement("option");
            option1.value = vehicle.tid;
            option1.textContent = vehicle.regtype;
            registerSelect.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = vehicle.tid;
            option2.textContent = vehicle.regtype;
            registerSelect1.appendChild(option2);
        });

        // 🔒 ADDED: Hide Add New Row button if Vehicle Loading exists (page load)
        if (addRowBtn) {
            const hasVehicleLoading = data.some(
                item => item.regtype && item.regtype.trim() === "Vehicle Loading"
            );
            addRowBtn.style.display = hasVehicleLoading ? "none" : "inline-block";
        }

        // Clears all inputs in container1
        const clearContainer1 = () => {
            const container1 = document.getElementById("container1");
            if (container1) {
				
                const inputs = container1.querySelectorAll("input, textarea, select");
                inputs.forEach(input => {
                    if (input.type === "checkbox" || input.type === "radio") {
                        input.checked = false;
                    } else {
                        input.value = "";
                    }
                    if (input.tagName === "SELECT") {
                        input.selectedIndex = 0;
                    }
                });
            }
        };

        // Clears all inputs in container2
        const clearContainer2 = () => {
            const container2 = document.getElementById("container2");
            if (container2) {
                const inputs = container2.querySelectorAll("input, textarea, select");
                inputs.forEach(input => {
                    if (input.type === "checkbox" || input.type === "radio") {
                        input.checked = false;
                    } else {
                        input.value = "";
                    }
                    if (input.tagName === "SELECT") {
                        input.selectedIndex = 0;
                    }
                });
            }
        };

        // Standalone: clears the Vehicle_No dropdown
        const clearVehicleDropdown = () => {
            const vehicleDropdown = document.getElementById("Vehicle_No");
            if (vehicleDropdown) {
                vehicleDropdown.selectedIndex = 0;
            }
        };

        // When either dropdown changes, clear everything
        const onRegisterChange = () => {
			
			document.getElementById("container1").style.display = "none";
			document.getElementById("container2").style.display = "none";
            clearContainer1();
            clearContainer2();
            clearVehicleDropdown();

            // 🔒 ADDED: Hide Add Row button when Vehicle Loading is selected
            if (addRowBtn) {
                const selectedText =
                    registerSelect.options[registerSelect.selectedIndex]?.text ||
                    registerSelect1.options[registerSelect1.selectedIndex]?.text;

                addRowBtn.style.display =
                    selectedText === "Vehicle Loading" ? "none" : "inline-block";
            }
        };

        registerSelect.addEventListener("change", onRegisterChange);
        registerSelect1.addEventListener("change", onRegisterChange);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Failed to load register types: ' + error.message);
    });
}





document.addEventListener("DOMContentLoaded", function() {
    // Fetch data from your Spring Boot API
    fetch(new URL("/api/Regtype/filter?include=false",baseUrl1)	, {
	    credentials: "include"
	})
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Get both select elements by ID
            const selectElement = document.getElementById("Select");
            const selectElement1 = document.getElementById("Select1"); // Second dropdown

            // Check if elements exist
            if (!selectElement) {
                console.error("Element with ID 'Select' not found");
                return;
            }
            if (!selectElement1) {
                console.error("Element with ID 'Select1' not found");
                return;
            }

            // Clear existing options in both dropdowns
            selectElement.innerHTML = "<option value=''>Select</option>";
            selectElement1.innerHTML = "<option value=''>Select</option>";

            console.log("API Response for register types:", data);

            // Loop through the data and create option elements for both dropdowns
            data.forEach(item => {
                // Create option for Select
                const option1 = document.createElement("option");
                option1.value = item.tid;
                option1.textContent = item.regtype;
                selectElement.appendChild(option1);

                // Create option for Select1
                const option2 = document.createElement("option");
                option2.value = item.tid;
                option2.textContent = item.regtype;
                selectElement1.appendChild(option2);
            });

            // Enable both select elements after populating
            selectElement.disabled = false;
            selectElement1.disabled = false;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Failed to load register types: " + error.message);
        });
});
document.addEventListener("DOMContentLoaded", function() {
    // Fetch data from your Spring Boot API
	const selectElement = document.getElementById("Vehicle_No");
    fetch(new URL("/api/invoiceexit/jims/vecnofetch",baseUrl1)	, {
	    credentials: "include"
	})
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            // Get the select element by ID
            const selectElement = document.getElementById("Vehicle_No");

            // Loop through the data and create option elements
            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.vechile_id; // Set the value of the option to 'tid'
                option.textContent = item.vecno; // Set the text of the option to 'regtype'
                selectElement.appendChild(option); // Append the option to the select element
            });

            // Enable the select element after populating it
			
			
            selectElement.disabled = false;
			initializeSelect2();
			
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });


 $(selectElement).on('change', function () {
        const selectedVechileId = this.value;

        if (!selectedVechileId) return;

        fetch(new URL(`/api/invoiceexit/jims/vecnofetchdata?vechile_id=${selectedVechileId}`,baseUrl1)		, {
		    credentials: "include"
		})
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const item = data[0];

                    // Fill form fields
                    document.getElementById("dmno").value = item.dmbno || '';
                    document.getElementById("dname").value = item.dname || '';
                    document.getElementById("vehicleNo").value = item.vecno || '';
               /*     document.getElementById("tname").value = item.transname || '';*/
					$('#tname').val(item.transname).trigger('change');
                    document.getElementById("dlno").value = item.dl || '';
                    document.getElementById("hname").value = item.helper || '';
                    document.getElementById("RC").value = item.rcflag || '';
                    document.getElementById("validityRC").value = item.rcValidThrough || '';
                    document.getElementById("Insurance").value = item.insuflag || '';
                    document.getElementById("validityInsurance").value = item.insuValidThrough || '';
                    document.getElementById("Fitness").value = item.fitflag || '';
                    document.getElementById("validityFitness").value = item.fitValidThrough || '';
                    document.getElementById("PUC").value = item.pucflag || '';
                    document.getElementById("validityPUC").value = item.pucValidThrough || '';
					const tlocationInput = document.getElementById('tlocation');
				    const taddressInput = document.getElementById('taddress');
					fetchCompanyDetails(item.transname, tlocationInput, taddressInput);
					document.getElementById("container1").style.display = "block";
					             document.getElementById("container2").style.display = "block";
                } else {
                    alert("No details found for the selected vehicle.");
                }
            })
            .catch(error => {
                console.error("Error fetching vehicle details:", error);
            });
    });
	
	});


let vehicleTypesLoaded = false;

function fetchVehicleTypes() {
    const vehicleSelect = document.getElementById('vehicle');
    const vehicleSelect1 = document.getElementById('vehicle1');
 
    // Fetch vehicle types
    fetch(new URL('/api/vtype', baseUrl1), { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data)) {
                // Clear existing options
                vehicleSelect.innerHTML = '<option value="">Select vehicle</option>';
                vehicleSelect1.innerHTML = '<option value="">Select vehicle</option>';
 
                // Add options from API
                data.forEach(v => {
                    const option1 = document.createElement('option');
                    option1.value = v.vid;
                    option1.textContent = v.vtype;
                    vehicleSelect.appendChild(option1);
 
                    const option2 = document.createElement('option');
                    option2.value = v.vid;
                    option2.textContent = v.vtype;
                    vehicleSelect1.appendChild(option2);
                });
 
                // ✅ FIXED: Initialize Select2 AFTER options are added
                initializeSelect2();
 
            } else {
                console.error("Invalid vehicle type response");
            }
        })
        .catch(error => {
            console.error("Error fetching vehicle types:", error);
        });
}
function initializeSelect2() {
    if (window.jQuery && $.fn.select2) {
        // Initialize vehicle dropdown (Create Modal)
        $('#vehicle').select2({
            placeholder: 'Select Vehicle Type',
            allowClear: true,
            width: '100%',
            dropdownParent: $('#exampleModalScrollable123'), // Bind to modal
            templateResult: function(data) {
                if (!data.id) return data.text;
                return $('<span>' + data.text + '</span>');
            },
            templateSelection: function(data) {
                return data.text;
            }
        });
 
        // Initialize vehicle1 dropdown (Update Modal)
        $('#vehicle1').select2({
            placeholder: 'Select Vehicle Type',
            allowClear: true,
            width: '100%',
            dropdownParent: $('#exampleModalScrollable12'), // Bind to modal
            templateResult: function(data) {
                if (!data.id) return data.text;
                return $('<span>' + data.text + '</span>');
            },
            templateSelection: function(data) {
                return data.text;
            }
        });
 
		
		$('#whom').select2({
		          placeholder: 'Select Employee',
		          allowClear: true,
		          width: '100%',
		          dropdownParent: $('#exampleModalScrollable123'), // Bind to modal
		          templateResult: function(data) {
		              if (!data.id) return data.text;
		              return $('<span>' + data.text + '</span>');
		          },
		          templateSelection: function(data) {
		              return data.text;
		          }
		      });
			  
			  $('#whom1').select2({
			  	          placeholder: 'Select Employee',
			  	          allowClear: true,
			  	          width: '100%',
			  	          dropdownParent: $('#exampleModalScrollable12'), // Bind to modal
			  	          templateResult: function(data) {
			  	              if (!data.id) return data.text;
			  	              return $('<span>' + data.text + '</span>');
			  	          },
			  	          templateSelection: function(data) {
			  	              return data.text;
			  	          }
			  	      });
			  
			  $('#tname').select2({
			  	          placeholder: 'Select Employee',
			  	          allowClear: true,
			  	          width: '100%',
			  	          dropdownParent: $('#exampleModalScrollable123'), // Bind to modal
			  	          templateResult: function(data) {
			  	              if (!data.id) return data.text;
			  	              return $('<span>' + data.text + '</span>');
			  	          },
			  	          templateSelection: function(data) {
			  	              return data.text;
			  	          }
			  	      });
					  
					  $('#tname1').select2({
					  	          placeholder: 'Select Employee',
					  	          allowClear: true,
					  	          width: '100%',
					  	          dropdownParent: $('#exampleModalScrollable12'), // Bind to modal
					  	          templateResult: function(data) {
					  	              if (!data.id) return data.text;
					  	              return $('<span>' + data.text + '</span>');
					  	          },
					  	          templateSelection: function(data) {
					  	              return data.text;
					  	          }
					  	      });
							  
							  $('#Vehicle_No').select2({
							  			  	          placeholder: 'Select Employee',
							  			  	          allowClear: true,
							  			  	          width: '100%',
							  			  	          dropdownParent: $('#exampleModalScrollable123'), // Bind to modal
							  			  	          templateResult: function(data) {
							  			  	              if (!data.id) return data.text;
							  			  	              return $('<span>' + data.text + '</span>');
							  			  	          },
							  			  	          templateSelection: function(data) {
							  			  	              return data.text;
							  			  	          }
							  			  	      });
							  
							  
					
        console.log("✅ Select2 initialized successfully for vehicle dropdowns");
    }
}

function initSelect2ForRow(rowId) {
    const selectId = `#cname${rowId}`;

    //  Destroy if already initialized
    if ($(selectId).hasClass('select2-hidden-accessible')) {
        $(selectId).select2('destroy');
    }

    $(selectId).select2({
        placeholder: 'Select Company',
        allowClear: true,
        width: '100%',
        dropdownParent: $('#exampleModalScrollable123'), //  Bind to your create modal
        templateResult: function(data) {
            if (!data.id) return data.text;
            return $('<span>' + data.text + '</span>');
        },
        templateSelection: function(data) {
            return data.text;
        }
    });
}





 
//  Re-initialize Select2 when modals open
$(document).ready(function() {
	loadActions();
    // When the create modal opens
    $('#exampleModalScrollable123').on('shown.bs.modal', function() {
        // Reinitialize if Select2 not already initialized
        if (!$('#vehicle').hasClass('select2-hidden-accessible')) {
            initializeSelect2();
        }
    });
 
    // When the update modal opens
    $('#exampleModalScrollable12').on('shown.bs.modal', function() {
        // Reinitialize if Select2 not already initialized
        if (!$('#vehicle1').hasClass('select2-hidden-accessible')) {
            initializeSelect2();
        }
    });
});
 
// ✅ Call this on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchVehicleTypes();
});

// Event listener for when a register type is selected
/*document.getElementById('register').addEventListener('change', function() {
    const registerSelected = this.value;
    const vehicleSelect = document.getElementById('vehicle');
 
    // Reset the vehicle selection
    vehicleSelect.value = "";
    
    // Reset Select2 display if initialized
    if (window.jQuery && $.fn.select2) {
        $('#vehicle').val(null).trigger('change');
    }
 
    if (registerSelected) {
        vehicleSelect.disabled = false;
    } else {
        vehicleSelect.disabled = true;
    }
});*/


$(document).off('change', '#register').on('change', '#register', function() {
    const registerSelected = this.value;
    const vehicleSelect = document.getElementById('vehicle');
    vehicleSelect.value = "";
    if (window.jQuery && $.fn.select2) {
        $('#vehicle').val(null).trigger('change.select2');
    }
    if (registerSelected) {
        vehicleSelect.disabled = false;
    } else {
        vehicleSelect.disabled = true;
    }
});
// Event listener for when a vehicle type is selected
$('#vehicle').on('change', function () {
    $('#container1').show();
	if ($(this).val()) {
	     $('#Vehicle_No').prop('disabled', false);
	   } else {
	     $('#Vehicle_No').prop('disabled', true);
	   } // Show the vehicle status container
});

// Call the fetchRegisterTypes function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchRegisterTypes(); // Fetch initial data for register types
	fetchCompaniesForCnameDynamic();
});




// Check if all required fields are filled in container1 and show container2
function checkFieldsAndShowDetails() {
    const rc = document.getElementById('RC').value;
    const validityRC = document.getElementById('validityRC').value;
    const fitness = document.getElementById('Fitness').value;
    const validityFitness = document.getElementById('validityFitness').value;
    const insurance = document.getElementById('Insurance').value;
    const validityInsurance = document.getElementById('validityInsurance').value;
    const puc = document.getElementById('PUC').value;
    const validityPUC = document.getElementById('validityPUC').value;

    // Check if all required fields have a value
    if (rc && validityRC && fitness && validityFitness && insurance && validityInsurance && puc && validityPUC) {
        // All fields are filled, show the next container (container2)
        document.getElementById('container2').style.display = 'block';
    } else {
        // If any field is missing, hide container2
        document.getElementById('container2').style.display = 'none';
    }
}

// Add event listeners for when the fields in container1 are changed
document.getElementById('RC').addEventListener('change', checkFieldsAndShowDetails);
document.getElementById('validityRC').addEventListener('change', checkFieldsAndShowDetails);
document.getElementById('Fitness').addEventListener('change', checkFieldsAndShowDetails);
document.getElementById('validityFitness').addEventListener('change', checkFieldsAndShowDetails);
document.getElementById('Insurance').addEventListener('change', checkFieldsAndShowDetails);
document.getElementById('validityInsurance').addEventListener('change', checkFieldsAndShowDetails);
document.getElementById('PUC').addEventListener('change', checkFieldsAndShowDetails);
document.getElementById('validityPUC').addEventListener('change', checkFieldsAndShowDetails);

// Optional: Check on page load in case some fields are pre-filled
document.addEventListener('DOMContentLoaded', checkFieldsAndShowDetails);



// Function to enable or disable date input based on dropdown selection
function toggleDateInput(dropdownId, dateInputId) {
    const dropdown = document.getElementById(dropdownId);
    const dateInput = document.getElementById(dateInputId);
    
    // Enable date input if "Yes" is selected, otherwise disable it
    if (dropdown.value === "1") {
        dateInput.disabled = false;
    } else {
        dateInput.disabled = true;
        dateInput.value = ""; // Clear the date input when disabled
    }
}

// Event listeners for all dropdowns
document.getElementById("RC").addEventListener("change", function() {
    toggleDateInput("RC", "validityRC");
});

document.getElementById("Fitness").addEventListener("change", function() {
    toggleDateInput("Fitness", "validityFitness");
});

document.getElementById("Insurance").addEventListener("change", function() {
    toggleDateInput("Insurance", "validityInsurance");
});

document.getElementById("PUC").addEventListener("change", function() {
    toggleDateInput("PUC", "validityPUC");
});

// Initialize date inputs based on the initial state of dropdowns (in case the page is pre-filled)
document.addEventListener("DOMContentLoaded", function() {
    toggleDateInput("RC", "validityRC");
    toggleDateInput("Fitness", "validityFitness");
    toggleDateInput("Insurance", "validityInsurance");
    toggleDateInput("PUC", "validityPUC");
});


// Ensure fetchCompanyDetails is defined globally (from your transporter code)
function fetchCompanyDetails(companyId, locationInput, addressInput) {
    console.log('Fetching details for company ID:', companyId);
    fetch(new URL(`/api/VMScompany/company/jims/details?company_id=${companyId}`,baseUrl1)	, {
	    credentials: "include"
	})
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Parsed company details:', data);
            if (Array.isArray(data) && data.length > 0) {
                const company = data[0];
                locationInput.value = company.City_name || '';
                addressInput.value = company.Address || '';
            } else {
                console.error('No company details found for company_id:', companyId);
                locationInput.value = '';
                addressInput.value = '';
            }
        })
        .catch(error => {
            console.error('Error fetching company details:', error);
            locationInput.value = '';
            addressInput.value = '';
            alert('Failed to load company details: ' + error.message);
        });
}

function formatDate(dateStr) {
    if (!dateStr) return '';

    // If already in YYYY-MM-DD format
    if (typeof dateStr === 'string' && dateStr.includes('-') && dateStr.length === 10) {
        return dateStr;
    }

    // Convert ISO / timestamp to YYYY-MM-DD
    const d = new Date(dateStr);

    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
// Ensure editvehicle is globally accessible

		function updatevtsdropdown(wtm)
		{
			const requestedSelect = document.getElementById('whom1');
				const departmentInput = document.getElementById('department1');

				// 1️⃣ Fetch and set department for the current value of whom1 BEFORE loading dropdown
				const initialValue = wtm; // take prefilled value
				if (initialValue) {
				    fetch(new URL(`/api/websmartuser/search?id=${initialValue}`, baseUrl1), { credentials: "include" })
				        .then(response => response.json())
				        .then(userResponse => {
				            if (userResponse && userResponse.Data && userResponse.Data.dept1) {
				                departmentInput.value = userResponse.Data.dept1;
				            } else {
				                departmentInput.value = '';
				            }
				        })
				        .catch(error => {
				            console.error('Error fetching user info:', error);
				            departmentInput.value = '';
				        });
				}

				// 2️⃣ Fetch all users for the dropdown
				fetch(new URL('api/websmartuser/getAll', baseUrl1), { credentials: "include" })
				    .then(response => response.json())
				    .then(data => {
				        if (data && Array.isArray(data.Data)) {
				            requestedSelect.innerHTML = '<option value="">Select employee</option>';
				            data.Data.forEach(user => {
				                const option = document.createElement('option');
				                option.value = user.id;
				                option.textContent = user.username;
				                requestedSelect.appendChild(option);
				            });

				            // Initialize Select2 if used
				       /*     if (window.jQuery && $.fn.select2) {
				                $('#whom1').select2({
				                    placeholder: 'Select an employee',
				                    allowClear: true
				                });
				            }*/
							initializeSelect2();

				            // Optional: keep the prefilled value selected
				            if (initialValue) {
				                requestedSelect.value = initialValue;
				                if (window.jQuery && $.fn.select2) {
				                    $('#whom1').val(initialValue).trigger('change.select2');
				                }
				            }
				        } else {
				            console.error("No users found or invalid response format.");
				        }
				    })
				    .catch(error => console.error('Error fetching users:', error));

				// 3️⃣ Update department when user changes dropdown
				
					$(requestedSelect).on('change', function () {
				    const selectedValue = this.value;
				    if (!selectedValue) {
				        departmentInput.value = '';
				        return;
				    }

				    fetch(new URL(`/api/websmartuser/search?id=${selectedValue}`, baseUrl1), { credentials: "include" })
				        .then(response => response.json())
				        .then(userResponse => {
				            if (userResponse && userResponse.Data && userResponse.Data.dept1) {
				                departmentInput.value = userResponse.Data.dept1;
				            } else {
				                departmentInput.value = '';
				            }
				        })
				        .catch(error => {
				            console.error('Error fetching user info:', error);
				            departmentInput.value = '';
				        });
				});
		}
		
		
	/*	document.getElementById('register1').addEventListener('change', function () {
		    if (this.value) {
		        this.disabled = true; //  lock after selection
		    }
		});*/
		
		
		$(document).off('change', '#register1').on('change', '#register1', function() {
		    if (this.value) {
		        this.disabled = true;
		    }
		});
		let vehicleRowsToDelete = []; // Array to store item IDs marked for deletion
		let selectedIneId = null; // Store ine_id for updates
		let selectedVechileId = null;
		let originalVehicleData = null;
		let originalLineItems = []; 
		async function editvehicle(ine_id, vechile_id) {
			  const allowed = allowedActions || [];

			if (!allowed.includes("Edit")) {
			  alert(" You do not have permission to edit.");
			  return;
			}
			selectedVechileId = vechile_id;  // ✅ store it here
			   selectedIneId = ine_id;
		    // Assuming this function is defined elsewhere

		    // Define the URLs for APIs
		    const vehicleApiUrl = new URL(`/api/invoiceexit/${ine_id}`,baseUrl1);
		    const itemsApiUrl = new URL(`/api/incponumber/jims/vehiclepo?filterType=byVehicleId&vechile_id=${vechile_id}`,baseUrl1);
		    const companiesApiUrl = new URL(`/api/VMScompany`,baseUrl1);
		
		    try {
		        // Fetch vehicle data, items data, and companies data concurrently
		        const [vehicleResponse, itemsResponse, companiesResponse] = await Promise.all([
					fetch(vehicleApiUrl, { credentials: "include" }),
					fetch(itemsApiUrl, { credentials: "include" }),
					fetch(companiesApiUrl, { credentials: "include" })
		        ]);

		        // Check if all responses are OK
		        if (!vehicleResponse.ok || !itemsResponse.ok || !companiesResponse.ok) {
		            throw new Error('One or more API calls failed');
		        }

		        // Parse JSON responses
		        const [vehicle, itemsData, companies] = await Promise.all([
		            vehicleResponse.json(),
		            itemsResponse.json(),
		            companiesResponse.json()
		        ]);

		        // Log itemsData to verify pono_id values
		        console.log('Fetched itemsData:', itemsData);

		        // Store ine_id for updates
		        selectedIneId = ine_id;
				updatevtsdropdown(vehicle.wtm);
		        // Populate modal fields with vehicle data
		        if (vehicle.regtyp == 1) {
		            document.getElementById('register1').value = vehicle.regtyp || '';
		            document.getElementById('Select1').disabled = true;
					document.getElementById('register1').disabled = true;
		        } else {
		            document.getElementById('register1').value = 2;
					document.getElementById('register1').disabled = true;
		        }
		
				
				document.getElementById('whom1').value = vehicle.wtm || '';
		        document.getElementById('Select1').value = vehicle.regtyp || '';
		       $('#vehicle1').val(vehicle.vtype).trigger('change') || '';
		        document.getElementById('RC1').value = vehicle.rcflag || '';
		        document.getElementById('validityRC1').value = vehicle.rcValidThrough || '';
		        document.getElementById('Insurance1').value = vehicle.insuflag || '';
		        document.getElementById('validityInsurance1').value = vehicle.insuValidThrough || '';
		        document.getElementById('Fitness1').value = vehicle.fitflag || '';
		        document.getElementById('validityFitness1').value = vehicle.fitValidThrough || '';
		        document.getElementById('PUC1').value = vehicle.pucflag || '';
		        document.getElementById('validityPUC1').value = vehicle.pucValidThrough || '';
		        document.getElementById('vehicleNo1').value = vehicle.vecno || '';
		        document.getElementById('dname1').value = vehicle.dname || '';
		        document.getElementById('dmno1').value = vehicle.dmbno || '';
		        document.getElementById('dlno1').value = vehicle.dl || '';
		        document.getElementById('hname1').value = vehicle.helper || '';
		        document.getElementById('tname1').value = vehicle.transname || '';
		       /* document.getElementById('content1').value = vehicle.description || '';*/
			   
			   document.getElementById('content1').value = vehicle.content_desc || '';
				
		        document.getElementById('remarks1').value = vehicle.inremarks || '';
		        document.getElementById('description1').value = vehicle.description || '';
				
				// ✅ Snapshot original values after populating
				originalVehicleData = {
				    regtyp: String(vehicle.regtyp || ''),
				    wtm: String(vehicle.wtm || ''),
				    vtype: String(vehicle.vtype || ''),
				    rcflag: String(vehicle.rcflag || ''),
				    rcValidThrough: formatDate(vehicle.rcValidThrough),
				    insuflag: String(vehicle.insuflag || ''),
				    insuValidThrough: formatDate(vehicle.insuValidThrough),
				    fitflag: String(vehicle.fitflag || ''),
				    fitValidThrough: formatDate(vehicle.fitValidThrough),
				    pucflag: String(vehicle.pucflag || ''),
				    pucValidThrough: formatDate(vehicle.pucValidThrough),
				    vecno: String(vehicle.vecno || ''),
				    dname: String(vehicle.dname || ''),
				    dmbno: String(vehicle.dmbno || ''),
				    dl: String(vehicle.dl || ''),
				    helper: String(vehicle.helper || ''),
				    transname: String(vehicle.transname || ''),
				    description: String(vehicle.description || ''),
				    content_desc: String(vehicle.content_desc || ''),
				    inremarks: String(vehicle.inremarks || '')
				};

				console.log("===== ORIGINAL LINE ITEMS SNAPSHOT =====");
				console.table(originalLineItems);
		        // Populate company dropdown
		        const companySelect = document.getElementById('tname1');
		        companySelect.innerHTML = '<option value="">Select</option>';
		        companies.forEach(item => {
		            const option = document.createElement('option');
		            option.value = item.company_id;
		            option.textContent = item.company_name;
		            companySelect.appendChild(option);
		        });
		        companySelect.value = vehicle.transname || ''; // Use company_id
		        document.getElementById('vehicle1').value = vehicle.vtype;

		        // Show additional containers and hide table
		        document.getElementById("container4").style.display = "block";
		        document.getElementById("container5").style.display = "block";
		        tablehide(); // Assuming this function is defined elsewhere

		        // Populate location and address fields
		        const tlocationInput1 = document.getElementById('tlocation1');
		        const taddressInput1 = document.getElementById('taddress1');
		        if (vehicle.transname) {
		             fetchCompanyDetails(vehicle.transname, tlocationInput1, taddressInput1); // Assuming this is async
		        } else {
		            tlocationInput1.value = '';
		            taddressInput1.value = '';
		        }

		        // Populate the items table
		        const tableBody = $('#TableID1 tbody');
		        tableBody.empty(); // Clear previous rows

		        // Map companies to a lookup for fast access by company_id
		        const companyMap = companies.reduce((acc, company) => {
		            acc[company.company_id] = company;
		            return acc;
		        }, {});

		        // Populate table rows with items data
		        itemsData.forEach((item, index) => {
		            // Get the current company from companyMap by company_id
		            const currentCompany = companyMap[item.company_id];

		            // Generate the dropdown options for companies
		            const companyOptions = companies.map(option =>
		                `<option value="${option.company_id}" ${option.company_id === item.company_id ? 'selected' : ''}>
		                    ${option.company_name}
		                </option>`
		            ).join('');

		            // HTML for each row
		            const rowHtml = `
		                <tr>
		                    <td>${index + 1}</td>
		                    <td>
		                        <select class="form-control form-control-sm" id="cname2${index + 1}" disabled>
		                            ${companyOptions}
		                        </select>
		                    </td>
		                    <td><input type="text" class="form-control form-control-sm" id="clocation1${index + 1}" value="${item.City_name || ''}" readonly></td>
		                    <td><input type="text" class="form-control form-control-sm" id="caddress1${index + 1}" value="${item.Address || ''}" readonly></td>
		                    <td><input type="text" class="form-control form-control-sm" id="ponum1${index + 1}" value="${item.Po_number || ''}"></td>
		                    <td><input type="date" class="form-control form-control-sm" id="podate1${index + 1}" value="${item.Po_date || ''}"></td>
		                    <td><input type="text" class="form-control form-control-sm" id="invoicenum1${index + 1}" value="${item.Inv_no || ''}"></td>
		                    <td><input type="date" class="form-control form-control-sm" id="invoicedate1${index + 1}" value="${item.Inv_date || ''}"></td>
		                    <td><input type="text" class="form-control form-control-sm" id="dcnum1${index + 1}" value="${item.DC_no || ''}"></td>
		                    <td><input type="date" class="form-control form-control-sm" id="dcdate1${index + 1}" value="${item.DC_date || ''}"></td>
		                    <td><input type="text" class="form-control form-control-sm" id="quantity1${index + 1}" value="${item.qty || ''}"></td>
		                    <td><input type="text" class="form-control form-control-sm" id="weight1${index + 1}" value="${item.weight || ''}"></td>
		                    <td><input type="text" class="form-control form-control-sm" id="description1${index + 1}" value="${item.Descp || ''}"></td>
		                    <td>
		                        <input type="hidden" id="itemId${index + 1}" value="${item.pono_id || ''}">
								<button 
								    type="button" 
								    class="btn btn-sm btn-danger" 
								    onclick="deleteRow2('${item.pono_id}')">
								    Delete
								</button>
		                    </td>
		                </tr>
		            `;

		            // Append the row to the table body
		            tableBody.append(rowHtml);

		            // Manually select the company from the dropdown
		            $(`#cname2${index + 1}`).val(item.company_id).change();
		        });
				
				originalLineItems = itemsData.map(item => ({
				    pono_id:  String(item.pono_id  || ''),
				    po_number: String(item.Po_number || ''),
				    po_date:   String(item.Po_date   || ''),
				    inv_no:    String(item.Inv_no    || ''),
				    inv_date:  String(item.Inv_date  || ''),
				    dc_no:     String(item.DC_no     || ''),
				    dc_date:   String(item.DC_date   || ''),
				    qty:       String(item.qty       || ''),
				    weight:    String(item.weight    || ''),
				    descp:     String(item.Descp     || '')
				}));

		        // Event delegation for company dropdown change
		        $('#TableID1').on('change', 'select', async function () {
		            const rowNumber = $(this).closest('tr').index() + 1;
		            const companyId = $(this).val();
		            const locationInput = $(`#clocation1${rowNumber}`);
		            const addressInput = $(`#caddress1${rowNumber}`);
		            console.log(`Company dropdown for row ${rowNumber} changed to: ${companyId}`);
		            fetchCompanyDetails(companyId, locationInput, addressInput);
		        });



		        // Show modal
		        $('#exampleModalScrollable12').modal('show');

		    } catch (error) {
		        console.error('Error fetching vehicle or items data:', error);
		        alert('Failed to load vehicle or items data: ' + error.message);
		        $('#exampleModalScrollable12').modal('hide');
		    }
			}

		    // Update button logic
			document.getElementById("btnupdate").onclick = function () {

			    const allRows = document.querySelectorAll("#TableID1 tbody tr");
			    const newRowPromises = [];
			    let currentDate = new Date();
			    let currentDateTimeString = getIndianDateTimeFormat(currentDate);

			    allRows.forEach((row, index) => {
			        const rowNumber = index + 1;
			        const itemId = $(row).find(`#itemId${rowNumber}`).val();

			        // ✅ ONLY INSERT
			        if (!itemId || itemId === 'undefined' || itemId === '') {

			            const cnameInput = row.querySelector('[id^="cname2"]');

			            const newPoData = {
			                vechile_id: selectedVechileId,
			                company_id: cnameInput ? cnameInput.value : '',
			                po_number:  $(row).find(`#ponum1${rowNumber}`).val() || '',
			                po_date:    $(row).find(`#podate1${rowNumber}`).val() || '',
			                inv_no:     $(row).find(`#invoicenum1${rowNumber}`).val() || '',
			                inv_date:   $(row).find(`#invoicedate1${rowNumber}`).val() || '',
			                dc_no:      $(row).find(`#dcnum1${rowNumber}`).val() || '',
			                dc_date:    $(row).find(`#dcdate1${rowNumber}`).val() || '',
			                qty:        $(row).find(`#quantity1${rowNumber}`).val() || '',
			                weight:     $(row).find(`#weight1${rowNumber}`).val() || '',
			                descp:      $(row).find(`#description1${rowNumber}`).val() || '',
			                created_by: createdById,
			                created_date: currentDateTimeString,
			                factory_id: selectedFactoryId
			            };

			            newRowPromises.push(
			                fetch(new URL('/api/incponumber', baseUrl1), {
			                    method: 'POST',
			                    credentials: 'include',
			                    headers: { 'Content-Type': 'application/json' },
			                    body: JSON.stringify(newPoData)
			                })
			            );
			        }
			    });

			    // ✅ 🔥 UPDATE LOGIC MUST BE HERE (outside loop)
			    console.log("Rows to Update:", vehicleRowsToUpdate);

			    const updatePromises = vehicleRowsToUpdate.map(row => {
			        console.log("Updating row:", row);

			        return fetch(new URL(`/api/incponumber/${row.pono_id}`, baseUrl1), {
			            method: 'PUT',
			            credentials: 'include',
			            headers: {
			                'Content-Type': 'application/json'
			            },
			            body: JSON.stringify({
			                ...row,
			                modified_by: createdById,
			                modified_date: currentDateTimeString
			            })
			        });
			    });

			    // ✅ COMBINE BOTH
			    Promise.all([...newRowPromises, ...updatePromises])
			        .then(() => {
			            console.log("✅ All inserts & updates completed");
			        })
			        .catch(err => {
			            console.error("❌ Error in insert/update:", err);
			        });
			};
		function todayStr() {
		    const d = new Date();
		    d.setHours(0, 0, 0, 0);
		    return d.toISOString().split("T")[0];
		}

		// Delegate PO Date validation
	/*	$(document).on('change', 'input[id^="podate1"]', function () {
		    const row = this.id.replace('podate1', '');
		    const poDate = this.value;
		    const today = todayStr();

		    if (poDate > today) {
		        alert("PO Date cannot be a future date");
		        this.value = "";
		        return;
		    }

		    $(`#invoicedate1${row}`).attr('min', poDate);
		    $(`#dcdate1${row}`).attr('min', poDate);
		});*/

		// Delegate Invoice Date validation
		$(document).on('change', 'input[id^="invoicedate1"]', function () {
		    const row = this.id.replace('invoicedate1', '');
		    const invDate = this.value;
		    const poDate = $(`#podate1${row}`).val();
		    const today = todayStr();

		    if (invDate < today) {
		        alert("Invoice Date cannot be a past date");
		        this.value = "";
		        return;
		    }

		    if (poDate && invDate < poDate) {
		        alert("Invoice Date cannot be less than PO Date");
		        this.value = "";
		        return;
		    }

		    $(`#dcdate1${row}`).attr('min', invDate);
		});

		// Delegate DC Date validation
		$(document).on('change', 'input[id^="dcdate1"]', function () {
		    const row = this.id.replace('dcdate1', '');
		    const dcDate = this.value;
		    const poDate = $(`#podate1${row}`).val();
		    const invDate = $(`#invoicedate1${row}`).val();
		    const today = todayStr();

		    if (dcDate < today) {
		        alert("DC Date cannot be a past date");
		        this.value = "";
		        return;
		    }

		    if (poDate && dcDate < poDate) {
		        alert("DC Date cannot be less than PO Date");
		        this.value = "";
		        return;
		    }

		    if (invDate && dcDate < invDate) {
		        alert("DC Date cannot be less than Invoice Date");
		        this.value = "";
		        return;
		    }
		});

		//let selectedvehicleId = null;

		$(document).ready(function () {
		    // Step 1: "Update" button click - Show confirmation modal
		    $("#btnupdate").click(function () {
				if (validateUpdateVehicleFields()) {
		        console.log("Update clicked - Showing confirmation modal");
		        $("#exampleModalCenter323").modal("show"); // This should be your confirmation modal
				}
		    });

		    // Step 2: "No" button click - Hide confirmation modal
		    $("#cancelvehiclemodal").click(function () {
		        console.log("No clicked - Hiding confirmation modal");
		        $("#exampleModalCenter323").modal("hide");
		    });

		    // Step 3: "Yes" button click - Proceed with update
		    $(document).on("click", "#confirmvehicleupd", function () {
		        console.log("Yes clicked - Proceeding with update");
		        $("#exampleModalCenter323").modal("hide"); // Hide the confirmation modal

		        if (selectedIneId) {
		            updateVehicle(selectedIneId); // Call update only here
		        } else {
		            alert("Vehicle ID not found. Cannot update.");
		        }
		    });
		});
		
		
		document.addEventListener("DOMContentLoaded", function () {

		    const container4 = document.getElementById('container4');
		    const container5 = document.getElementById('container5');

		    const vehicle = document.getElementById('vehicle1');

		    const rc = document.getElementById('RC1');
		    const rcDate = document.getElementById('validityRC1');

		    const ins = document.getElementById('Insurance1');
		    const insDate = document.getElementById('validityInsurance1');

		    const fit = document.getElementById('Fitness1');
		    const fitDate = document.getElementById('validityFitness1');

		    const puc = document.getElementById('PUC1');
		    const pucDate = document.getElementById('validityPUC1');

		    // 🔹 COMMON CHECK FUNCTION (inside scope only)
		    function checkContainer4Complete() {

		        // ❌ If any is NO → hide container5
		        if (rc.value === "0" || ins.value === "0" || fit.value === "0" || puc.value === "0") {
		            container5.style.display = "none";
		            return;
		        }

		        // ✅ If all filled → show container5
		        if (
		            rc.value && rcDate.value &&
		            ins.value && insDate.value &&
		            fit.value && fitDate.value &&
		            puc.value && pucDate.value
		        ) {
		            container5.style.display = "block";
		        } else {
		            container5.style.display = "none";
		        }
		    }

		    // 🔹 VEHICLE CHANGE
			$(vehicle).on('change', function () {

			    console.log("Vehicle changed");

			    $('#container4').show();
			    $('#container5').hide();

			    // Clear container4 inputs
			    $('#container4').find('input, select').each(function () {

			        if ($(this).is('select')) {
			            $(this).prop('selectedIndex', 0).trigger('change'); // reset select (works with Select2 too)
			        } else {
			            $(this).val('');
			        }

			        $(this).prop('disabled', false);
			    });
			});

		    // 🔹 YES/NO HANDLER
		    function setupYesNo(select, dateInput) {

		        select.addEventListener('change', function () {

		            if (this.value === "0") {
		                dateInput.value = "";
		                dateInput.disabled = true;

		                container5.style.display = "none";
		            } else {
		                dateInput.disabled = false;
		            }

		            checkContainer4Complete();
		        });

		        dateInput.addEventListener('change', checkContainer4Complete);
		    }

		    // 🔹 APPLY TO ALL
		    setupYesNo(rc, rcDate);
		    setupYesNo(ins, insDate);
		    setupYesNo(fit, fitDate);
		    setupYesNo(puc, pucDate);

		});
		function hasLineItemsChanged() {
		    const allRows = document.querySelectorAll("#TableID1 tbody tr");
			console.log("===== CHECKING LINE ITEM CHANGES =====");

		    // ✅ If new rows were added, that itself is a change
		    const existingRows = [...allRows].filter((row, index) => {
		        const rowNumber = index + 1;
		        const itemId = $(row).find(`#itemId${rowNumber}`).val();
		        return itemId && itemId !== 'undefined' && itemId !== '';
		    });

		    const newRows = [...allRows].filter((row, index) => {
		        const rowNumber = index + 1;
		        const itemId = $(row).find(`#itemId${rowNumber}`).val();
		        return !itemId || itemId === 'undefined' || itemId === '';
		    });

		    // ✅ New rows added = change detected
		    if (newRows.length > 0) return true;

		    // ✅ Rows deleted = change detected
		    if (existingRows.length < originalLineItems.length) return true;

		    // ✅ Check each existing row against its snapshot
			for (let i = 0; i < existingRows.length; i++) {
			    const row = existingRows[i];
			    const rowNumber = $(row).index() + 1;
			    const itemId = $(row).find(`#itemId${rowNumber}`).val();

			    const original = originalLineItems.find(o => o.pono_id === String(itemId));
			    if (!original) continue;

			    const current = {
			        po_number: String($(row).find(`#ponum1${rowNumber}`).val()       || ''),
			        po_date:   String($(row).find(`#podate1${rowNumber}`).val()      || ''),
			        inv_no:    String($(row).find(`#invoicenum1${rowNumber}`).val()  || ''),
			        inv_date:  String($(row).find(`#invoicedate1${rowNumber}`).val() || ''),
			        dc_no:     String($(row).find(`#dcnum1${rowNumber}`).val()       || ''),
			        dc_date:   String($(row).find(`#dcdate1${rowNumber}`).val()      || ''),
			        qty:       String($(row).find(`#quantity1${rowNumber}`).val()    || ''),
			        weight:    String($(row).find(`#weight1${rowNumber}`).val()      || ''),
			        descp:     String($(row).find(`#description1${rowNumber}`).val() || '')
			    };

			    // 🔥 ADD THESE LOGS
			    console.log(`---- ROW ${rowNumber} ----`);
			    console.log("PONO ID:", itemId);
			    console.log("Original:", original);
			    console.log("Current :", current);

			    const changed = Object.keys(current).some(key =>
			        current[key].trim() !== original[key].trim()
			    );

			    // 🔥 ADD THIS
			    console.log("Changed:", changed);

			    if (changed) return true;
			}

		    return false; // nothing changed
		}
		
		
		function hasVehicleFieldsChanged() {
		    if (!originalVehicleData) return true;

		    const current = {
		        regtyp: ($('#register1').val() === '2')
		                ? $('#Select1').val()
		                : $('#register1').val(),
		        wtm: $('#whom1').val(),
		        vtype: $('#vehicle1').val(),
		        rcflag: $('#RC1').val(),
		        rcValidThrough: $('#validityRC1').val(),
		        insuflag: $('#Insurance1').val(),
		        insuValidThrough: $('#validityInsurance1').val(),
		        fitflag: $('#Fitness1').val(),
		        fitValidThrough: $('#validityFitness1').val(),
		        pucflag: $('#PUC1').val(),
		        pucValidThrough: $('#validityPUC1').val(),
		        vecno: $('#vehicleNo1').val(),
		        dname: $('#dname1').val(),
		        dmbno: $('#dmno1').val(),
		        dl: $('#dlno1').val(),
		        helper: $('#hname1').val(),
		        transname: $('#tname1').val(),
		        description: $('#description1').val(),
		        content_desc: $('#content1').val(),
		        inremarks: $('#remarks1').val()
		    };

		    // 🔥 ADD THIS
		    console.log("===== VEHICLE FIELD COMPARISON =====");
		    console.log("Original Vehicle:", originalVehicleData);
		    console.log("Current Vehicle :", current);

		    let changed = false;

		    Object.keys(current).forEach(key => {
		        const originalVal = String(originalVehicleData[key] || '').trim();
		       const currentVal  = String(current[key] || '').trim();

		        if (originalVal !== currentVal) {
		            console.log(`❌ MISMATCH in ${key}:`, originalVal, "vs", currentVal);
		            changed = true;
		        } else {
		            console.log(`✅ MATCH ${key}`);
		        }
		    });

		    return changed;
		}
	
		function validateUpdateVehicleFields() {
			const vehicleChanged  = hasVehicleFieldsChanged();
			const lineItemChanged = hasLineItemsChanged();

			if (!vehicleChanged && !lineItemChanged) {
			 showPopup("No Feilds Changes","Vehicle.jsp");
			    return false;
			}

		    let isValid = true;

		    // helper functions
		    function showError(id) {
		        document.getElementById(id).style.display = "block";
		        isValid = false;
		    }

		    function hideError(id) {
		        document.getElementById(id).style.display = "none";
		    }

		    // Vehicle No
		    if ($('#vehicleNo1').val().trim() === "") {
		        showError('vehicleNo1Errorup');
		    } else {
		        hideError('vehicleNo1Errorup');
		    }

		    // Driver Name
		    if ($('#dname1').val().trim() === "") {
		        showError('dname1Errorup');
		    } else {
		        hideError('dname1Errorup');
		    }

		    // Driver Mobile No (10 digits)
		    let mobile = $('#dmno1').val().trim();
		    if (mobile === "" || mobile.length !== 10) {
		        showError('dmno1Errorup');
		    } else {
		        hideError('dmno1Errorup');
		    }

		    // Driver License No
		    if ($('#dlno1').val().trim() === "") {
		        showError('dlno1Errorup');
		    } else {
		        hideError('dlno1Errorup');
		    }

		    // Helper Name
		    if ($('#hname1').val().trim() === "") {
		        showError('hname1Errorup');
		    } else {
		        hideError('hname1Errorup');
		    }

		    // Transporter Name 
		    if ($('#tname1').val().trim() === "") {
		        showError('tname1Errorup');
		    } else {
		        hideError('tname1Errorup');
		    }
			
			if ($('#whom1').val().trim() === "") {
				showError('whom1Errorup');
			} else {
				 hideError('whom1Errorup');
			}

		    // Remarks
		    if ($('#remarks1').val().trim() === "") {
		        showError('remarks1Errorup');
		    } else {
		        hideError('remarks1Errorup');
		    }

		    // Description
		    if ($('#description1').val().trim() === "") {
		        showError('description1Errorup');
		    } else {
		        hideError('description1Errorup');
		    }

		    return isValid;
		}
		
		// Step 4: Update vehicle only after confirmation
		async function updateVehicle(ine_id) {
		    const currentDate = new Date();
		    const currentDateTimeString = getIndianDateTimeFormat(currentDate); // Make sure this is defined

		    const updatedData = {
				regtyp: ($('#register1').val() === '2')
				        ? $('#Select1').val()
				        : $('#register1').val(),
				wtm: $('#whom1').val(),
		        vtype: $('#vehicle1').val(),
		        rcflag: $('#RC1').val(),
		        rcValidThrough: $('#validityRC1').val(),
		        insuflag: $('#Insurance1').val(),
		        insuValidThrough: $('#validityInsurance1').val(),
		        fitflag: $('#Fitness1').val(),
		        fitValidThrough: $('#validityFitness1').val(),
		        pucflag: $('#PUC1').val(),
		        pucValidThrough: $('#validityPUC1').val(),
		        vecno: $('#vehicleNo1').val(),
		        dname: $('#dname1').val(),
		        dmbno: $('#dmno1').val(),
		        dl: $('#dlno1').val(),
		        helper: $('#hname1').val(),
		        transname: $('#tname1').val(),
		        description: $('#description1').val(),
		        content_desc: $('#content1').val(),
		        inremarks: $('#remarks1').val(),
		        modified_by: createdById,
		        modified_date: currentDateTimeString
		    };

		    const apiUrl = new URL(`/api/invoiceexit/${ine_id}`,baseUrl1);

		    try {
		        const response = await fetch(apiUrl, {
		            method: 'PUT',
				  	 credentials: 'include', 
		            headers: {
		                'Content-Type': 'application/json',
		            },
		            body: JSON.stringify(updatedData)
		        });

		        if (!response.ok) {
		            throw new Error('Failed to update vehicle');
		        }

		        await response.json(); // Optional, if you need the returned data

		        // ✅ Show popup ONLY after success
		       const popup = $('<div class="popup">Updated successfully!</div>').appendTo('body').hide().fadeIn(400);
		        setTimeout(function () {
		            popup.fadeOut(400, function () {
		                $(this).remove();
		                window.location = "Vehicle.jsp";
		            });
		        }, 1000);
				
				/*alert("the updated Successfully")
*/
		        $('#exampleModalScrollable12').modal('hide'); // Hide the form modal if needed

		        if (typeof fetchVehicles === "function") {
		            fetchVehicles(); // Refresh list
		        }

		    } catch (error) {
		        console.error('Error updating vehicle:', error);
		        alert('Failed to update vehicle.');
		    }
		}


		let vehicleRowsToUpdate=[]

		
		
		
		$('#TableID1').on('change', 'input', function () {
		    const row = $(this).closest('tr');
		    const rowNumber = row.index() + 1;
		    const itemId = row.find(`#itemId${rowNumber}`).val();

		    // ✅ Skip if new row — no itemId means it needs INSERT not UPDATE
		    if (!itemId || itemId === 'undefined' || itemId === '') {
		        console.log(`Row ${rowNumber} is a new row — will be inserted on save`);
		        return;
		    }

		    const updatedRow = {
		        pono_id: itemId,
		        po_number: row.find(`#ponum1${rowNumber}`).val() || '',
		        po_date: row.find(`#podate1${rowNumber}`).val() || '',
		        inv_no: row.find(`#invoicenum1${rowNumber}`).val() || '',
		        inv_date: row.find(`#invoicedate1${rowNumber}`).val() || '',
		        dc_no: row.find(`#dcnum1${rowNumber}`).val() || '',
		        dc_date: row.find(`#dcdate1${rowNumber}`).val() || '',
		        qty: row.find(`#quantity1${rowNumber}`).val() || '',
		        weight: row.find(`#weight1${rowNumber}`).val() || '',
		        descp: row.find(`#description1${rowNumber}`).val() || ''
		    };

		    const existingRowIndex = vehicleRowsToUpdate.findIndex(r => r.pono_id === itemId);
		    if (existingRowIndex !== -1) {
		        vehicleRowsToUpdate[existingRowIndex] = updatedRow;
		    } else {
		        vehicleRowsToUpdate.push(updatedRow);
		    }
		});
		
		
		// Function to handle row deletion
		
		let ponid_todelted = null;
		function deleteRow2(pon_id) {
			$("#exampleModalCenterdeleted").modal("show");
			ponid_todelted = pon_id;
		
		}
		
		document.getElementById("cofirmDeleted").addEventListener("click", function () {
			$("#exampleModalCenterdeleted").modal("hide");

		    if (!ponid_todelted) {
		        alert("No record selected");
		        return;
		    }

			fetch(`${baseUrl1}/api/incponumber/soft/${ponid_todelted}/${sessionStorage.getItem('id')}`, {
			    method: "PUT",
			    credentials: "include"
			})
		    .then(response => response.json())
		    .then(data => {
		    

		     

		       showPopup("Deleted successfully",'Vehicle.jsp');
		    })
		    .catch(error => {
		        console.error("Error:", error);
		        alert("Delete failed");
		    });
		});

// DOMContentLoaded event listener for transporter and other initialization
document.addEventListener('DOMContentLoaded', function () {
    const tnameSelect = document.getElementById('tname');
    const tlocationInput = document.getElementById('tlocation');
    const taddressInput = document.getElementById('taddress');
    const tnameSelect1 = document.getElementById('tname1');
    const tlocationInput1 = document.getElementById('tlocation1');
    const taddressInput1 = document.getElementById('taddress1');

    // Check if elements exist
    if (!tnameSelect || !tlocationInput || !taddressInput) {
        console.error("One or more elements for 'tname', 'tlocation', or 'taddress' not found");
        return;
    }
    if (!tnameSelect1 || !tlocationInput1 || !taddressInput1) {
        console.error("One or more elements for 'tname1', 'tlocation1', or 'taddress1' not found");
        return;
    }

    // Fetch all transporter names and populate both dropdowns
    function fetchTransporterNames() {
        fetch(new URL('/api/VMScompany',baseUrl1)		, {
		    credentials: "include"
		})
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                tnameSelect.innerHTML = '<option value="">Select</option>';
                tnameSelect1.innerHTML = '<option value="">Select</option>';

                console.log("API Response for transporter names:", data);

                if (data && Array.isArray(data)) {
                    data.forEach(item => {
                        const option1 = document.createElement('option');
                        option1.value = item.company_id;
                        option1.textContent = item.company_name;
                        tnameSelect.appendChild(option1);

                        const option2 = document.createElement('option');
                        option2.value = item.company_id;
                        option2.textContent = item.company_name;
                        tnameSelect1.appendChild(option2);
						
						
						/*initializeSelect2();*/
                    });
					initializeSelect2();
                } else {
                    console.error('No transporter names found.');
                    alert('No transporter names found.');
                }
            })
            .catch(error => {
                console.error('Error fetching transporter names:', error);
                alert('Failed to load transporter names: ' + error.message);
            });
    }

    // Listen for dropdown change on tname
	$('#tname').on('change', function () {
	    const selectedCompanyId = $(this).val();

	    if (selectedCompanyId) {
	        fetchCompanyDetails(selectedCompanyId, tlocationInput, taddressInput);
	    } else {
	        $('#tlocation, #taddress').val('');
	    }
	});

	$('#tname1').on('change', function () {
	    const selectedCompanyId = $(this).val();

	    if (selectedCompanyId) {
	        fetchCompanyDetails(selectedCompanyId, tlocationInput1, taddressInput1);
	    } else {
	        $('#tlocation1, #taddress1').val('');
	    }
	});

    // Existing vehicle change event
    const vehicleSelect = document.getElementById('vehicle');
    if (vehicleSelect) {
		$('#vehicle').on('change', function () {
		    tablehide();
		});
    } else {
        console.error("Element with ID 'vehicle' not found");
    }

    const vehicleSelect1 = document.getElementById('vehicle1');
    if (vehicleSelect1) {
		$('#vehicle1').on('change', function () {
		     tablehide();
		 });
    } else {
        console.error("Element with ID 'vehicle1' not found");
    }

    // Initialize dropdowns on page load
    fetchTransporterNames();
    // Assuming fetchAndDisplayVehicle is defined elsewhere
    // fetchAndDisplayVehicle();
});



function addNewRow() {
    const tableBody = document.querySelector("#TableID tbody");
    const rowCount = tableBody.rows.length + 1;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${rowCount}</td>
        <td>
            <select class="form-control form-control-sm" id="cname${rowCount}" onchange="fetchCnameCompanyDetailsDynamic(${rowCount})">
                <option value="">Select</option>
            </select>
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="clocation${rowCount}" readonly>
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="caddress${rowCount}" readonly>
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="ponum${rowCount}">
        </td>
        <td>
            <input type="date" class="form-control form-control-sm" id="podate${rowCount}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="invoicenum${rowCount}">
        </td>
        <td>
            <input type="date" class="form-control form-control-sm" id="invoicedate${rowCount}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="dcnum${rowCount}">
        </td>
        <td>
            <input type="date" class="form-control form-control-sm" id="dcdate${rowCount}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="quantity${rowCount}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="weight${rowCount}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="description${rowCount}">
        </td>
        <td>
            <button type="button" class="btn btn-sm btn-danger" onclick="deleteRow(this)">Delete</button>
        </td>
    `;
    
    tableBody.appendChild(newRow);

    // Fill dropdown for this specific row
    fetchCompaniesForCnameDynamic(rowCount);
	/*initializeSelect2();*/
    // Re-number Sl.No
    adjustSlNos();
}

// Adjust Sl.No
function adjustSlNos() {
    const rows = document.querySelectorAll("#TableID tbody tr");
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// Delete row and adjust Sl.No
function deleteRow(button) {
    button.closest("tr").remove();
    adjustSlNos();
}
function addNewRow1() {
    const tableBody = document.querySelector("#TableID1 tbody");
    const rowCount = tableBody.rows.length + 1;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${rowCount}</td>
        <td>
            <select class="form-control form-control-sm" id="cname2${rowCount}" 
                onchange="fetchCnameCompanyDetailsDynamic1(${rowCount})">
                <option value="">Select</option>
            </select>
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="clocation1${rowCount}" readonly>
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="caddress1${rowCount}" readonly>
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="ponum1${rowCount}">
        </td>
        <td>
            <input type="date" class="form-control form-control-sm" id="podate1${rowCount}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="invoicenum1${rowCount}">
        </td>
        <td>
            <input type="date" class="form-control form-control-sm" id="invoicedate1${rowCount}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="dcnum1${rowCount}">
        </td>
        <td>
            <input type="date" class="form-control form-control-sm" id="dcdate1${rowCount}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="quantity1${rowCount}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="weight1${rowCount}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="description1${rowCount}">
        </td>
        <td>
            <input type="hidden" id="itemId${rowCount}" value="">  <!-- ✅ empty = new row -->
            <button type="button" class="btn btn-sm btn-danger" onclick="deleteRow(this)">Delete</button>
        </td>
    `;

    tableBody.appendChild(newRow);

    // ✅ Fetch companies for this new row
    fetchCompaniesForCnameDynamic1(rowCount);

    adjustSlNos1();
}

// Adjust Sl.No
function adjustSlNos1() {
    const rows = document.querySelectorAll("#TableID1 tbody tr");
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}




function fetchCompaniesForCnameDynamic1(rowId) {
    const url = new URL('/api/VMScompany', baseUrl1);
    const select = document.querySelector(`#cname2${rowId}`);

    if (!select) return;

    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            select.innerHTML = '<option value="">Select company</option>';
            data.forEach(item => {
                select.innerHTML += `<option value="${item.company_id}">${item.company_name}</option>`;
            });
        })
        .catch(error => console.error("Error fetching companies:", error));
}

// ✅ Fetch location/address for TableID1 new rows
function fetchCnameCompanyDetailsDynamic1(rowId) {
    const cnameSelect = document.getElementById(`cname2${rowId}`);
    const selectedCompanyId = cnameSelect.value;
    const clocationInput = document.getElementById(`clocation1${rowId}`);
    const caddressInput  = document.getElementById(`caddress1${rowId}`);

    if (selectedCompanyId) {
        fetch(new URL(`/api/VMScompany/company/jims/details?company_id=${selectedCompanyId}`, baseUrl1), {
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                clocationInput.value = data[0].City_name || '';
                caddressInput.value  = data[0].Address   || '';
            }
        })
        .catch(error => console.error("Error:", error));
    } else {
        clocationInput.value = '';
        caddressInput.value  = '';
    }
}


// Delete row and adjust Sl.No
function deleteRow1(button) {
    button.closest("tr").remove();
    adjustSlNos();
}


// Fetch dropdown options for dynamic cname
function fetchCompaniesForCnameDynamic(rowId = null) {
    const url = new URL('/api/VMScompany', baseUrl1);

    const selector = rowId ? `#cname${rowId}` : 'select[id^="cname"]';
    const companySelects = document.querySelectorAll(selector);

    if (companySelects.length === 0) {
        console.warn(`No select elements found for selector: ${selector}`);
        return;
    }

    fetch(url, { credentials: "include" })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                companySelects.forEach(select => {
                    const currentSelection = select.value;
                    select.innerHTML = '<option value="">Select company</option>';
                    data.forEach(item => {
                        const option = document.createElement('option');
                        option.value = item.company_id || '';
                        option.textContent = item.company_name || 'Unnamed company';
                        select.appendChild(option);
                    });
                    if (currentSelection) {
                        select.value = currentSelection;
                    }
                });

                // ✅ After options are loaded, initialize Select2 for that specific row
                if (rowId) {
                    initSelect2ForRow(rowId);  // ← only for the new row
                } else {
                    // Page load: init for all cname dropdowns
                    document.querySelectorAll('select[id^="cname"]').forEach(select => {
                        const id = select.id.replace('cname', '');
                        if (id) initSelect2ForRow(id);
                    });
                }

            } else {
                console.error("Error: Data is not an array.", data);
            }
        })
        .catch(error => {
            console.error("Error fetching company details:", error);
        });
}

// Fetch location/address when a company is selected (for dynamic row)
function fetchCnameCompanyDetailsDynamic(rowId) {
    const cnameSelect = document.getElementById(`cname${rowId}`);
    const selectedCompanyId = cnameSelect.value;
    const clocationInput = document.getElementById(`clocation${rowId}`);
    const caddressInput = document.getElementById(`caddress${rowId}`);

    if (selectedCompanyId) {
        fetch(new URL(`/api/VMScompany/company/jims/details?company_id=${selectedCompanyId}`,baseUrl1)		, {
		    credentials: "include"
		})
            .then(response => response.json())
            .then(data => {
				if (data) {
                if (Array.isArray(data) && data.length > 0) {
                    const company = data[0];
                    clocationInput.value = company.City_name || '';
                    caddressInput.value = company.Address || '';
                } else {
                    clocationInput.value = '';
                    caddressInput.value = '';
                }
				}
            })
            .catch(error => {
                console.error(`Error fetching details for company ${selectedCompanyId}:`, error);
            });
    } else {
        clocationInput.value = '';
        caddressInput.value = '';
    }
}

// Initial load: for first row only

function generateVehicleNo(callback) {
    // Fetch the auto-generated number from the backend
    $.ajax({
        url: new URL('/api/invoiceexit/jims/autovechileno',baseUrl1), // Endpoint
        type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
        success: function(autoNumber) {
            // If the auto-generated number is 0 or an invalid number, start with 1
            if (!autoNumber || isNaN(autoNumber)) {
                autoNumber = 1;
            } else {
                autoNumber = parseInt(autoNumber) + 1; // Auto-increment by 1
            }

            // Format the number to be zero-padded to 6 digits
/*            const formattedNumber = ('000000' + autoNumber).slice(-6); // Zero-padded to 6 digits
            const vehicleid = `VL00${formattedNumber}`; // Prefix with VL00*/
			
			const vehicleid = `VL${String(autoNumber).padStart(6, '0')}`;

            // Call the callback with the generated vehicle number
            callback(vehicleid);
        },
        error: function(error) {
            console.error('Error generating vehicle number:', error);
            callback('VL000001'); // Default fallback
        }
    });
}

function generatematerialVehicleNo(callback) {
    // Fetch the auto-generated number from the backend
    $.ajax({
        url: new URL('/api/invoiceexit/jims/autovechilenomaterial',baseUrl1), // Endpoint
        type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
        success: function(autoNumber) {
            // If the auto-generated number is 0 or an invalid number, start with 1
            if (!autoNumber || isNaN(autoNumber)) {
                autoNumber = 1;
            } else {
                autoNumber = parseInt(autoNumber) + 1; // Auto-increment by 1
            }

            // Format the number to be zero-padded to 6 digits
            const formattedNumber = ('000000' + autoNumber).slice(-6); // Zero-padded to 6 digits
            const vehicleid = `MI00${formattedNumber}`; // Prefix with VL00

            // Call the callback with the generated vehicle number
            callback(vehicleid);
        },
        error: function(error) {
            console.error('Error generating vehicle number:', error);
            callback('MI000001'); // Default fallback
        }
    });
}


function tablehide() {
    // Get dropdown elements
    const registerSelect = document.getElementById("register");
    const vtypeSelect = document.getElementById("vehicle");
    const registerSelect1 = document.getElementById("register1");
    const vtypeSelect1 = document.getElementById("vehicle1");

    // Get table elements
    const vehicleTable = document.getElementById("TableID");
    const vehicleTable1 = document.getElementById("TableID1");

    // Check if tables exist
    if (!vehicleTable) {
        console.error("Table with ID 'TableID' not found");
    }
    if (!vehicleTable1) {
        console.error("Table with ID 'TableID1' not found");
    }

    // Check if dropdowns exist
    if (!registerSelect || !vtypeSelect) {
        console.error("Dropdowns 'register' or 'vehicle' not found");
    }
    if (!registerSelect1 || !vtypeSelect1) {
        console.error("Dropdowns 'register1' or 'vehicle1' not found");
    }

    // Get selected values (use empty string as fallback if elements are missing)
    const selectedId = registerSelect ? registerSelect.value : '';
    const selectedvtypeId = vtypeSelect ? vtypeSelect.value : '';
    const selectedId1 = registerSelect1 ? registerSelect1.value : '';
    const selectedvtypeId1 = vtypeSelect1 ? vtypeSelect1.value : '';

    // Control TableID for register/vehicle
    if (vehicleTable) {
        if (selectedId === "1") {
            vehicleTable.style.display = "none";
			if (btnAddRow) btnAddRow.style.display = "none";
        } else {
            vehicleTable.style.display = "block";
			if (btnAddRow) btnAddRow.style.display = "inline-block";
        }
    }

    // Control TableID1 for register1/vehicle1
    if (vehicleTable1) {
        if (selectedId1 === "1") {
            vehicleTable1.style.display = "none";
			if (btnAddRow1) btnAddRow1.style.display = "none";
        } else {
            vehicleTable1.style.display = "block";
			if (btnAddRow1) btnAddRow1.style.display = "inline-block";
        }
    }
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


	
	
	let capturedImageData = null;

	// 🎥 Initialize camera
	document.addEventListener("DOMContentLoaded", function() {
	  const video = document.getElementById("videoElement");
	  navigator.mediaDevices.getUserMedia({ video: true })
	    .then(stream => { video.srcObject = stream; })
	    .catch(err => alert("Camera access denied: " + err));
	});

	// 📸 Capture image
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
	
	function submitFunction() {
	    var isValid = true;

	    const registerSelect = document.getElementById("register");
	    const vtypeselect = document.getElementById("vehicle");
	    const selectedId = registerSelect.value;
	    const selectedvtypeId = vtypeselect.value;

		const vehicleno = document.getElementById("vehicleNo").value.trim();
	    const dname = document.getElementById("dname").value.trim();
	    const dmno = document.getElementById("dmno").value.trim();
	    const dlno = document.getElementById("dlno").value.trim();
	    const hname = document.getElementById("hname").value.trim();
	    const tname = document.getElementById("tname").value.trim();
		const whom = document.getElementById("whom").value.trim();
	   // const content = document.getElementById("content").value.trim();
	    const remarks = document.getElementById("remarks").value.trim();
	    const description = document.getElementById("description").value.trim();
		
		//const contentInput = document.getElementById("content");
		const content = document.getElementById("content");
		if (!capturedImageData) {
		   alert("Please capture an image first!");
		   return;
		 }
	    // Clear previous errors
	    $('.error-message').hide();

		if (!vehicleno) {
		    $('#vehicleNoError').show();
		    isValid = false;
		}
	    if (!dname) {
	        $('#dnameError').show();
	        isValid = false;
	    }
	    if (!dmno) {
	        $('#dmnoError').show();
	        isValid = false;
	    }
	    if (!dlno) {
	        $('#dlnoError').show();
	        isValid = false;
	    }
	    if (!hname) {
	        $('#hnameError').show();
	        isValid = false;
	    }
	    if (!tname) {
	        $('#tnameError').show();
	        isValid = false;
	    }
		if (!whom) {
		        $('#whomError').show();
		        isValid = false;
		    }
		if (!content) {
		    $('#contentError').show();
		    isValid = false;
		}
	    if (!remarks) {
	        $('#remarksError').show();
	        isValid = false;
	    }
	    if (!description) {
	        $('#descriptionError').show();
	        isValid = false;
	    }

	    if (!isValid) {
	        return false;
	    }
		if (selectedId === "2") {
		        const rows = document.querySelectorAll("#TableID tbody tr");
		        rows.forEach((row, index) => {
		            const quantityInput = row.querySelector('[id^="quantity"]');
		            const weightInput   = row.querySelector('[id^="weight"]');
		            const cnameInput    = row.querySelector('[id^="cname"]');

		            const qtyValue    = quantityInput ? Number(quantityInput.value) : 0;
		            const weightValue = weightInput   ? Number(weightInput.value)   : 0;
		            const cnameVal    = cnameInput    ? cnameInput.value.trim()     : "";

		            // ✅ Cname validation
		            if (!cnameVal) {
		                showFieldError($(cnameInput), "Company name is required");
		                isValid = false;
		            }

		            // ✅ Quantity validation
		            if (qtyValue <= 0) {
		                showFieldError($(quantityInput), "Quantity must be greater than 0");
		                isValid = false;
		            }

		            // ✅ Weight validation
		            if (weightValue <= 0) {
		                showFieldError($(weightInput), "Weight must be greater than 0");
		                isValid = false;
		            }
		        });

		        if (!isValid) return false;
		    }
		 
			// Stop submission if any row invalid
			if (!isValid) return false;
		$("#exampleModalCenter322").modal({
		  focus: false
		});
	    // Show modals or proceed
	  /*  if (selectedId === "1" && (selectedvtypeId === "2" || selectedvtypeId === "9")) {
	        $("#exampleModalCenter322").modal("show");
	        $(document).off("click", "#confirmvehentryyes").on("click", "#confirmvehentryyes", function () {
	            $("#exampleModalCenter322").modal("hide");
	            materialInward();
	        });
	    } else*/ if (selectedId === "1") {
	        $("#exampleModalCenter322").modal("show");
	        $(document).off("click", "#confirmvehentryyes").on("click", "#confirmvehentryyes", function () {
	            $("#exampleModalCenter322").modal("hide");
	            vehicleLoading();
	        });
	    } else if (selectedId === "2") {
	        $("#exampleModalCenter322").modal("show");
	        $(document).off("click", "#confirmvehentryyes").on("click", "#confirmvehentryyes", function () {
	            $("#exampleModalCenter322").modal("hide");
	            materialInward();
	        });
	    } else {
	        alert("Please select a valid Register Type.");
	    }
	}

	// ✅ Helper functions
	function showFieldError($field, message) {
	    clearFieldError($field);
	    $field.addClass("field-error");
	    const msg = $("<div>").addClass("validation-msg").text(message);
	    $field.after(msg);
	}

	function clearFieldError($field) {
	    $field.removeClass("field-error");
	    $field.siblings(".validation-msg").remove();
	}

	$(document).on("change keyup", "select, input", function () {
	    clearFieldError($(this));
	});

	// Optional: If you want the "No" button to hide modal
	$(document).ready(function () {
	    $(".btn-secondary[data-dismiss='modal']").click(function () {
	        $("#exampleModalCenter322").modal("hide");
	    });
	});


	function materialInward() {
	    // Get the form field values
	    const registerSelect = document.getElementById("register");
	    const vtypeselect = document.getElementById("vehicle");
	    const selectedId = registerSelect.value;
	    const selectedvtypeId = vtypeselect.value;
	    const vehicleNo = document.getElementById("vehicleNo").value;
	    
	    let regtype = '';
	    if (selectedId == "1") {
	        regtype = document.getElementById("register").value;
	    } else {
	        regtype = document.getElementById("Select").value;
	    }

	    const vechicletype = document.getElementById("vehicle").value;
	    const dname = document.getElementById("dname").value;
	    const dmno = document.getElementById("dmno").value;
	    const dlno = document.getElementById("dlno").value;
	    const hname = document.getElementById("hname").value;
	    const tname = document.getElementById("tname").value;
	    const tlocation = document.getElementById("tlocation").value;
	    const taddress = document.getElementById("taddress").value;
	    const whom = document.getElementById("whom").value;
	    const department = document.getElementById("department").value;
	    const remarks = document.getElementById("remarks").value;
	    const description = document.getElementById("description").value;
	    const rc = document.getElementById("RC").value;
	    const insure = document.getElementById("Insurance").value;
	    const fitness = document.getElementById("Fitness").value;
	    const puc = document.getElementById("PUC").value;
	    const rcdate = document.getElementById("validityRC").value;
	    const insuredate = document.getElementById("validityInsurance").value;
	    const fitnessdate = document.getElementById("validityFitness").value;
	    const pucdate = document.getElementById("validityPUC").value;
	    const content_desc = document.getElementById("content").value;

	    // Generate the vehicle ID (assuming it's asynchronous)
	    generatematerialVehicleNo(function(vehicleid) {
	        let currentDate = new Date();
	        let currentDateTimeString = getIndianDateTimeFormat(currentDate);
	        let currentTimeOnly = getIndianTimeOnly(currentDate); 
	        
	        // Create the first data object for the vehicle loading
	        const vehicleData = {
	            vechile_id: vehicleid,
	            regtyp:regtype,
	            vtype:vechicletype,
	            vecno: vehicleNo,
	            dname: dname,
	            vdate: currentDateTimeString,
	            dmbno: dmno,
	            dl: dlno,
	            helper: hname,
	            transname: tname,
	            translocation: tlocation,
	            taddress: taddress,
	            wtm: whom,
	            department: department,
	            inremarks: remarks,
	            description: description,
	            content_desc :content_desc,
	            rcflag: rc,
	            insuflag: insure,
	            pucflag: puc,
	            fitflag: fitness,
	            rcValidThrough: rcdate,
	            fitValidThrough: fitnessdate,
	            pucValidThrough: pucdate,
	            insuValidThrough: insuredate,
	            intime:currentTimeOnly,
	            created_by: createdById,
	            created_date: currentDateTimeString,
	            factory_id: selectedFactoryId,
	            capture: capturedImageData                            
	        };

	        // Make the API call to the first API (vehicle loading)
	        fetch(new URL('/api/invoiceexit',baseUrl1), {
	            method: 'POST',
	            credentials: 'include',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            body: JSON.stringify(vehicleData)
	        })
	        .then(response => response.ok ? Promise.resolve() : response.text().then(text => Promise.reject(text)))
	        .then(() => {
	            // Now, prepare the data for the second table (incponumber)
	            const rows = document.querySelectorAll("#TableID tbody tr");
	            const dataToInsert = [];
	            
	            rows.forEach(row => {
	                // Collect data from each row
	                const companySelect = row.querySelector('[id^="cname"]');
	                const poNumberInput = row.querySelector('[id^="ponum"]');
	                const poDateInput = row.querySelector('[id^="podate"]');
	                const invoiceNumberInput = row.querySelector('[id^="invoicenum"]');
	                const invoiceDateInput = row.querySelector('[id^="invoicedate"]');
	                const dcNumberInput = row.querySelector('[id^="dcnum"]');
	                const dcDateInput = row.querySelector('[id^="dcdate"]');
	                const quantityInput = row.querySelector('[id^="quantity"]');
	                const weightInput = row.querySelector('[id^="weight"]');
	                const descriptionInput = row.querySelector('[id^="description"]');

	                const data = {
	                    vechile_id: vehicleid,
	                    company_id: companySelect ? companySelect.value : '',
	                    po_number: poNumberInput ? poNumberInput.value : '',
	                    po_date: poDateInput ? poDateInput.value : '',
	                    inv_no: invoiceNumberInput ? invoiceNumberInput.value : '',
	                    inv_date: invoiceDateInput ? invoiceDateInput.value : '',
	                    dc_no: dcNumberInput ? dcNumberInput.value : '',
	                    dc_date: dcDateInput ? dcDateInput.value : '',
	                    qty: quantityInput ? quantityInput.value : '',
	                    weight: weightInput ? weightInput.value : '',
	                    descp: descriptionInput ? descriptionInput.value : '',
	                    created_by: createdById,
	                    created_date: currentDateTimeString,
	                    factory_id: selectedFactoryId
	                };

	                dataToInsert.push(data);
	            });

	            let successCount = 0;
	            let failCount = 0;

	            const promises = dataToInsert.map(poData =>
	                fetch(new URL('/api/incponumber',baseUrl1), {
	                    method: 'POST',
	                    credentials: 'include',
	                    headers: {
	                        'Content-Type': 'application/json'
	                    },
	                    body: JSON.stringify(poData)
	                })
	                .then(response => {
	                    if (!response.ok) {
	                        return response.text().then(err => {
	                            console.error("Failed to insert PO:", err);
	                            failCount++;
	                        });
	                    } else {
	                        successCount++;
	                    }
	                })
	                .catch(error => {
	                    console.error('Error submitting PO data:', error);
	                    failCount++;
	                })
	            );

	            Promise.all(promises).then(() => {
	                if (failCount === 0) {
	                    showPopup("Vehicle and all PO records submitted successfully!", "Vehicle.jsp");
					   
					  /* alert("the vehilce details are successsfully inserted");*/
	                } else {
	                    alert(`Vehicle data saved but ${failCount} PO(s) failed to submit.`);
	                }
	            });
	        })
	        .catch(error => {
	            alert('Error submitting vehicle data: ' + error);
	        });
	    });
	}


	function vehicleLoading() {
	    // Get the form field values
	    const vehicleNo = document.getElementById("vehicleNo").value;
	    const regtype = document.getElementById("register").value;
	    const vechicletype = document.getElementById("vehicle").value;
	    const dname = document.getElementById("dname").value;
	    const dmno = document.getElementById("dmno").value;
	    const dlno = document.getElementById("dlno").value;
	    const hname = document.getElementById("hname").value;
	    const tname = document.getElementById("tname").value;
	    const tlocation = document.getElementById("tlocation").value;
	    const taddress = document.getElementById("taddress").value;
	    const whom = document.getElementById("whom").value;
	    const department = document.getElementById("department").value;
	    const remarks = document.getElementById("remarks").value;
	    const description = document.getElementById("description").value;
	    const rc = document.getElementById("RC").value;
	    const insure = document.getElementById("Insurance").value;
	    const fitness = document.getElementById("Fitness").value;
	    const puc = document.getElementById("PUC").value;
	    const rcdate = document.getElementById("validityRC").value;
	    const insuredate = document.getElementById("validityInsurance").value;
	    const fitnessdate = document.getElementById("validityFitness").value;
	    const pucdate = document.getElementById("validityPUC").value;
	    const content_desc = document.getElementById("content").value;
	    
	    generateVehicleNo(function(vehicleid) {
	        let currentDate = new Date();
	        let currentDateTimeString = getIndianDateTimeFormat(currentDate);
	        let currentTimeOnly = getIndianTimeOnly(currentDate); 
	        
	        // Create the data object if all fields are valid
	        const vehicleData = {
	            vechile_id:vehicleid,
	            regtyp:regtype,
	            vtype:vechicletype,
	            vecno: vehicleNo,
	            dname: dname,
	            vdate:currentDateTimeString,
	            dmbno: dmno,
	            dl: dlno,
	            helper: hname,
	            transname: tname,
	            translocation: tlocation,
	            taddress: taddress,
	            wtm: whom,
	            department: department,
	            inremarks: remarks,
	            description: description,
	            content_desc : content_desc,
	            rcflag:rc,
	            insuflag: insure,
	            pucflag:puc,
	            fitflag:fitness,
	            rcValidThrough:rcdate,
	            fitValidThrough: fitnessdate,
	            pucValidThrough:pucdate,
	            insuValidThrough:insuredate,
	            intime:currentTimeOnly,
	            created_by:createdById,
	            created_date:currentDateTimeString,
	            factory_id:selectedFactoryId,
	            capture: capturedImageData                            
	        };

	        // Proceed with the API call
	        fetch(new URL('/api/invoiceexit',baseUrl1), {
	            method: 'POST',
	            credentials: 'include',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            body: JSON.stringify(vehicleData)
	        })
	        .then(response => {
	            // Check for success
	            if (response.ok) {
	                var popup = $('<div class="popup">Inserted successfully!</div>').appendTo('body').hide().fadeIn(400);
	                setTimeout(function () {
	                    popup.fadeOut(400, function () {
	                        $(this).remove();
	                        window.location = "Vehicle.jsp";
	                    });
	                }, 2000);
	            } else {
	                // Handle non-200 responses here (e.g., 400 or 500)
	                return response.text().then(errorMessage => {
	                    alert('Error submitting data: ' + errorMessage);
	                });
	            }
	        })
	        .catch(error => {
	            console.error('Error:', error);
	            alert('An error occurred. Please try again.');
	        });
	    });
	}

	/*$('#exampleModalScrollable123').on('shown.bs.modal', function() {
	    initUniversalSelect2(this);
	});*/
/*	function initUniversalSelect2(container = document) {
	    $(container).find("select").each(function() {

	        const $select = $(this);

	        //  Skip disabled or readonly selects
	        if ($select.prop("disabled") || $select.attr("readonly")) {
	            return;
	        }

	        //  Skip already initialized Select2
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
	}*/

function showPopup(message, redirectUrl) {
		    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
		    setTimeout(function () {
		        popup.fadeOut(400, function () {
		            $(this).remove();
		            window.location = redirectUrl;
		        });
		    }, 800);
		}
