function fetchUserRole() {
	fetchUserList();
	fetchModule();
	fetchUserListfactory();
	fetchUserListsubmo();
	getmoduletab();
	getactions();
	fetchUserListaction();
	getmoduleroleass();
	getmoduleactions();
    // Dynamically construct the URL using the base URL and the relative path
    const url = new URL('/jssl/role/getAllRoles', baseUrl);  // Construct the full URL

  fetch(url, { credentials: "include" })
        .then(response => {
            if (!response.ok) {
                throw new Error("Server API error");
            }
            return response.json();
        })
        .then(json => {
            // Clear any existing rows in the table body before adding new ones
            document.querySelector("#tableID tbody").innerHTML = '';

            // Check if the response has 'DistrictDetails' and it's an array
            if (json.status === "yes" && json.DistrictDetails && Array.isArray(json.DistrictDetails)) {
                let li = ''; // Initialize HTML string for table rows
                const arr = json.DistrictDetails;

                // Loop through each item and build the table rows
                for (let i = 0; i < arr.length; i++) {
                    const DistrictDetails = arr[i];
                    const role_name = DistrictDetails.role_name || 'N/A';
                    const role_code = DistrictDetails.role_code || 'N/A';

                    // Define the `id` for each row (use a unique value like role_code or a combination)
                    const role_id = `row-${role_code || i}`; // Fallback to the index if role_code is not available

                    // Append each row to the HTML string
                    li += `<tr id="${role_id}">
                        <td>${role_name}</td>
                        <td>${role_code}</td>
                        <td style="display:none;">${role_id}</td> <!-- Hidden column for ID -->
                    </tr>`;
                }

                // Inject rows into the table body
                document.querySelector("#tableID tbody").innerHTML = li;

                // Initialize DataTable if rows were added
                const table = $('#tableID');
                if ($.fn.DataTable.isDataTable(table)) {
                    table.DataTable().clear().destroy(); // Destroy the existing instance
                }

                table.DataTable({
                    //dom: 'Bfrtip',
                    scrollX: true,
                    info: true,
                    paging: true,
                    /*buttons: [
                        {
                            extend: 'excel',
                            text: 'Export to Excel',
                            title: 'Role List',
                        },
                    ],*/
                });
            } else {
                console.warn("No valid data found or data format is incorrect.");
                document.querySelector("#tableID tbody").innerHTML = '<tr><td colspan="4">No data available</td></tr>';
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            document.querySelector("#tableID tbody").innerHTML = '<tr><td colspan="4">Failed to load data</td></tr>';
        });
}

async function fetchModule() {
	
     try {
        
        // Construct the API URL
        const url = new URL(`/jssl/module/getAllmodules`, baseUrl);
        

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
                    <th>Module Name</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.DistrictDetails.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.module_name}</td>
                </tr>
            `;
        });

        tableContent += `</tbody>`;

        // Update table content
        $("#moduleTable").html(tableContent);

        // Initialize DataTable with custom configuration
        $("#moduleTable").DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: true,
            paging: true,
            destroy: true, // Prevent duplication
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
function onDeliveredOrderTabClick22() {
	setTimeout(() => {
		$('#moduleTable_wrapper .dataTables_scrollHeadInner th').click();
	}, 200);
}

function openModalAdd() {
    var code = rolec.value.trim();
    var name = roled.value.trim();
    var showError = false; // Initialize showError variable

    if (code === '') {
        document.getElementById('productCodeErrorcredit').innerText = "Please enter role code.";
        document.getElementById('productCodeErrorcredit').style.display = "inline-block";
        showError = true; // Set showError to true if there's an error
    } else {
        document.getElementById('productCodeErrorcredit').innerText = "";
        document.getElementById('productCodeErrorcredit').style.display = "none";
    }
    
    if (name === '') {
        document.getElementById('productCodeErrorcredittyu').innerText = "Please enter role name.";
        document.getElementById('productCodeErrorcredittyu').style.display = "inline-block";
        showError = true; // Set showError to true if there's an error
    } else {
        document.getElementById('productCodeErrorcredittyu').innerText = "";
        document.getElementById('productCodeErrorcredittyu').style.display = "none";
    }

    if (!showError) {
        $('#exampleModalCenter66').modal('show');
    }
}

function addevent() {
    // Validate role code and role description
    const roleCode = $('#rolec').val().trim();
    const roleDescription = $('#roled').val().trim();
   
   // Construct the full URL
    const endpoint = "/jssl/role/addRole";
    const url = new URL(endpoint, baseUrl); // Combines baseUrl and endpoint

    // Make the AJAX request
    $.ajax({
        url: url.toString(),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({role_name: roleDescription,
        role_code: roleCode,
        created_by: createdById }),
        success: function(data) {
			var result = data.message; // No need to stringify

			if (result === "Success") {
				// Store permissions in sessionStorage
				const popup = $('<div class="popup">Role Created Successfully!</div>')
					.appendTo('body').hide().fadeIn(400);

				setTimeout(function() {
					popup.fadeOut(400, function() {
						$(this).remove();
						window.location = 'settings.jsp'; // Redirect to role list page
					});
				}, 800);
			} else {
				 //const errorMessage = data.message || 'Failed to create country.';
                //$('#errorMessage').text(errorMessage); // Set the error message dynamically
                //$('#exampleModalCenterDup').modal('show'); // Show the modal with the error message
			}
		},
		error: function() {
			// Handle AJAX error
			console.error('Request failed.');
		}
	});
}

async function fetchUserListfactory() {
    try {
        
        // Construct the API URL
        const url = new URL(`/jssl/factory/getAllFactoryList`, baseUrl);
        

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
                    <th>Factory Name</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.FactoryDetails.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.factory_name}</td>
                </tr>
            `;
        });

        tableContent += `</tbody>`;

        // Update table content
        $("#tableIDfac").html(tableContent);

        // Initialize DataTable with custom configuration
        $("#tableIDfac").DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: true,
            paging: true,
            destroy: true, // Prevent duplication
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

function onDeliveredOrderTabClickfac() {
	setTimeout(() => {
		$('#tableIDfac_wrapper .dataTables_scrollHeadInner th').click();
	}, 200);
}

// for validation please give 
function openModalAddfac() {
    var username = document.getElementById('taxname').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please Enter Factory Name.";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
    }
   
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66fac').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addeventfac() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/factory/addFactory', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({factory_name:taxname.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Factory Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'settings.jsp'; // Redirect to role list page
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

function openModalAddMO() {
    var usernamemo = document.getElementById('rolecM').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (usernamemo === '') {
        document.getElementById('productCodeErrorcreditMO').innerText = "Please Enter module Name.";
        document.getElementById('productCodeErrorcreditMO').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditMO').innerText = "";
        document.getElementById('productCodeErrorcreditMO').style.display = "none";
    }
   
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter6611MO').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addevent1MO() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/addModule', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({moduleName:rolecM.value,
        created_by: createdById}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Module Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'settings.jsp'; // Redirect to role list page
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

async function fetchUserListsubmo() {
    try {
        
        // Construct the API URL
        const url = new URL(`/jssl/modules/getAllmodulesandsubmodules`, baseUrl);
        

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
                    <th>Module Name</th>
                    <th>Sub-Module Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.DistrictDetails.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.module_name}</td>
                    <td>${item.submodule_name}</td>
                    <td>${item.actions_value}</td>
                </tr>
            `;
        });

        tableContent += `</tbody>`;

        // Update table content
        $("#tableIDsub").html(tableContent);

        // Initialize DataTable with custom configuration
        $("#tableIDsub").DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: true,
            paging: true,
            destroy: true, // Prevent duplication
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

function onDeliveredOrderTabClicksubmo() {
	setTimeout(() => {
		$('#tableIDsub_wrapper .dataTables_scrollHeadInner th').click();
	}, 200);
}

function getmoduletab() {
    const url = new URL('/jssl/module/getAllmodules', baseUrl);  // Define URL outside of AJAX call

    $.ajax({
        url: url, // Use the defined url variable
        type: 'GET', // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: {},
        success: function (data) {
            var tableRef = document.getElementById("modid");
            $("#role1").empty(); // Clear the dropdown before appending new options
            var trHTML = '';
            var DistrictDetails = data.DistrictDetails; // Ensure you are using the correct property
            agencyList = DistrictDetails; // Assuming you want to store this for other use
            // Add placeholder option
            trHTML += '<option value="" selected>Select module</option>';

            // Loop through the list of roles and add them as options
            for (var i = 0; i < DistrictDetails.length; i++) {
                trHTML += '<option value="' + DistrictDetails[i].module_id + '"> ' +
                    DistrictDetails[i].module_name + ' </option>';
            }
            $('#modid').append(trHTML); // Append the options to the dropdown
        },
        error: function (jqXhr, textStatus, errorMessage) {
            // Handle error (you can display an alert or log the error)
            console.log("Error: " + errorMessage); // Uncomment if you want to see the error in the console
        }
    });
}

function getactions() {
    const url = new URL('/jssl/listactions', baseUrl); 

    $.ajax({
        url: url.toString(), // Pass the correct URL
        type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        success: function (data) {
	         if (!data.DistrictDetails) {
                console.error("Error: FactoryDetails not found in response");
                return;
            }

            var DistrictDetails = data.DistrictDetails;
            var container = $('#pro');
            container.empty();

            // Add search input at the top of the dropdown
            /*container.append(`
                <a class="dropdown-item">
                    <input type="text" id="proSearch" class="form-control form-control-sm" placeholder="Search product...">
                </a>
            `);*/

            // Add "Select All" checkbox
            container.append('<a class="dropdown-item"><input type="checkbox" id="selectAllProCheckbox"><label for="selectAllProCheckbox"> Select All</label></a>');

            // Add checkboxes for each customer
            DistrictDetails.forEach((factory, index) => {
                container.append(`
                    <a class="dropdown-item pro-item">
                        <input type="checkbox" class="pro-checkbox" value="${factory.action_desc}" id="pro_${index}">
                        <label for="pro_${index}"> ${factory.action_desc}</label>
                    </a>
                `);
            });

            // Toggle all checkboxes when "Select All" is clicked
            $('#selectAllProCheckbox').change(function () {
                var isChecked = $(this).prop('checked');
                $('.pro-checkbox').prop('checked', isChecked);
            });

            // Update "Select All" based on individual checkbox selections
            container.on('change', '.pro-checkbox', function () {
                var allChecked = $('.pro-checkbox').length === $('.pro-checkbox:checked').length;
                $('#selectAllProCheckbox').prop('checked', allChecked);
            });

            // Reset "Select All" checkbox on load
            $('#selectAllProCheckbox').prop('checked', false);

            // Add search functionality
            /*$('#proSearch').on('input', function () {
                var searchText = $(this).val().toLowerCase();
                $('.pro-item').each(function () {
                    var productName = $(this).text().toLowerCase();
                    $(this).toggle(productName.includes(searchText));
                });
            });*/
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error('Error: ' + errorMessage);
        }
    });
}

function getSelectedActionIds() {
    var selectedactionIds = [];
    $('.pro-checkbox:checked').each(function() {
        selectedactionIds.push($(this).val()); // Push the value (factory.id) to the array
    });
    return selectedactionIds;
}

function openModalAddsubmo() {
    var usernamemoss = document.getElementById('modid').value.trim();
    var sub = document.getElementById('submodid').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (usernamemoss === '') {
        document.getElementById('productCodeErrorcreditmodid').innerText = "Please select module Name.";
        document.getElementById('productCodeErrorcreditmodid').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditmodid').innerText = "";
        document.getElementById('productCodeErrorcreditmodid').style.display = "none";
    }
    
    if (sub === '') {
        document.getElementById('productCodeErrorcreditsubmodid').innerText = "Please enter sub-module Name.";
        document.getElementById('productCodeErrorcreditsubmodid').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsubmodid').innerText = "";
        document.getElementById('productCodeErrorcreditsubmodid').style.display = "none";
    }
   
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66facsubb').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addeventsubid() {
    var mod = document.getElementById('modid').value.trim();
    var submod = document.getElementById('submodid').value.trim();
    
    var selectedActions = getSelectedActionIds();

    if (selectedActions.length === 0) {
        alert("Please select an action.");
        return;
    }

    const endpoint = "/jssl/subModule";
    const url = new URL(endpoint, baseUrl);

    $.ajax({
        url: url.toString(),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({module_id: mod,
        subModule: submod,
        createdBy: createdById,   
        actions: selectedActions.length > 0 ? selectedActions.join(', ') : ""  // Ensure it's a string
        }),
        success: function(data) {
			var result = data.message; // No need to stringify

			if (result === "Success") {
				// Store permissions in sessionStorage
				const popup = $('<div class="popup">Sub-module Created Successfully!</div>')
					.appendTo('body').hide().fadeIn(400);

				setTimeout(function() {
					popup.fadeOut(400, function() {
						$(this).remove();
						window.location = 'settings.jsp'; // Redirect to role list page
					});
				}, 800);
			} else {
				//const errorMessage = data.message || 'Failed to create country.';
                //$('#errorMessage').text(errorMessage); // Set the error message dynamically
                //$('#exampleModalCenterDup').modal('show'); // Show the modal with the error message
			}
		},
		error: function() {
			// Handle AJAX error
			console.error('Request failed.');
		}
	});
}

async function fetchUserListaction() {
    try {
        
        // Construct the API URL
        const url = new URL(`/jssl/assignModuleToRole/list`, baseUrl);
        

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
                    <th>Role Name</th>
                    <th>Module Name</th>
                    <th>Sub-Module Name</th>
                    <th>Action</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.data.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.role_name}</td>
                    <td>${item.module_name}</td>
                    <td>${item.submodule_name}</td>
                    <td>${item.id}</td>
                    <td>${item.actions_value}</td>
                </tr>
            `;
        });

        tableContent += `</tbody>`;

        // Update table content
        $("#tableIDassign").html(tableContent);

        // Initialize DataTable with custom configuration
        $("#tableIDassign").DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: true,
            paging: true,
            destroy: true, // Prevent duplication
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

function onDeliveredOrderTabClickassign() {
	setTimeout(() => {
		$('#tableIDassign_wrapper .dataTables_scrollHeadInner th').click();
	}, 200);
}

function getmoduleroleass() {
    const url = new URL('/jssl/role/getAllRoles', baseUrl);  // Define URL outside of AJAX call

    $.ajax({
        url: url, // Use the defined url variable
        type: 'GET', // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: {},
        success: function (data) {
            var tableRef = document.getElementById("roleass");
            $("#roleass").empty(); // Clear the dropdown before appending new options
            var trHTML = '';
            var DistrictDetails = data.DistrictDetails; // Ensure you are using the correct property
            agencyList = DistrictDetails; // Assuming you want to store this for other use
            // Add placeholder option
            trHTML += '<option value="" selected>Select role</option>';

            // Loop through the list of roles and add them as options
            for (var i = 0; i < DistrictDetails.length; i++) {
                trHTML += '<option value="' + DistrictDetails[i].role_id + '"> ' +
                    DistrictDetails[i].role_name + ' </option>';
            }
            $('#roleass').append(trHTML); // Append the options to the dropdown
        },
        error: function (jqXhr, textStatus, errorMessage) {
            // Handle error (you can display an alert or log the error)
            console.log("Error: " + errorMessage); // Uncomment if you want to see the error in the console
        }
    });
}

// Store a flag to prevent multiple fetchActions calls during quick changes
let isFetchingActions = false;

// Function to fetch modules
function getmoduleactions() {
    const url = new URL('/jssl/module/getAllmodules', baseUrl); 

    $.ajax({
        url: url.toString(),
        type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        success: function (data) {
            if (!data.DistrictDetails) {
                console.error("Error: FactoryDetails not found in response");
                return;
            }

            var DistrictDetails = data.DistrictDetails;
            var container = $('#van');
            container.empty();

            // Add "Select All" checkbox
            container.append('<a class="dropdown-item"><input type="checkbox" id="selectAllVanCheckbox"><label for="selectAllVanCheckbox"> Select All</label></a>');

            // Add checkboxes for each customer
            DistrictDetails.forEach((factory, index) => {
                container.append(`
                    <a class="dropdown-item van-item">
                        <input type="checkbox" class="van-checkbox" value="${factory.module_id}" id="van_${index}">
                        <label for="van_${index}"> ${factory.module_name}</label>
                    </a>
                `);
            });

            // Toggle all checkboxes when "Select All" is clicked
            $('#van').on('change', '#selectAllVanCheckbox', function () {
                var isChecked = $(this).prop('checked');
                $('.van-checkbox').prop('checked', isChecked);
                fetchSubModules(); // Only fetch submodules after the selection change
            });

            // Update "Select All" checkbox status based on individual selections
            $('#van').on('change', '.van-checkbox', function () {
                var allChecked = $('.van-checkbox').length === $('.van-checkbox:checked').length;
                $('#selectAllVanCheckbox').prop('checked', allChecked);
                fetchSubModules();
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error('Error: ' + errorMessage);
        }
    });
}

// Function to fetch sub-modules
function fetchSubModules() {
    var selectedModules = [];
    
    // Get all checked "van" checkboxes (module IDs)
    $('.van-checkbox:checked').each(function () {
        selectedModules.push($(this).val());
    });

    if (selectedModules.length === 0) {
        $('#route').empty(); // Clear dropdown if nothing is selected
        return;
    }

    const url = new URL('/jssl/getsubmodulesassignedtomodule', baseUrl); 
    $.ajax({
        url: url.toString(),
        type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
        data: { id: selectedModules.join(',') }, // Pass selected module IDs
        dataType: 'json',
        success: function (data) {
            if (!data.DataModule || data.DataModule.length === 0) {
                console.error("Error: DataModule not found in response");
                $('#route').empty(); // Clear dropdown if no data is found
                return;
            }

            var DataModule = data.DataModule;
            var container = $('#route');
            container.empty();

            // Add "Select All" checkbox for sub-modules
            container.append(`
                <a class="dropdown-item">
                    <input type="checkbox" id="selectAllRouteCheckbox">
                    <label for="selectAllRouteCheckbox"> Select All</label>
                </a>
            `);

            // Add submodule checkboxes
            DataModule.forEach((submodule, index) => {
                container.append(`
                    <a class="dropdown-item route-item">
                        <input type="checkbox" class="route-checkbox" value="${submodule.submodule_id}" id="route_${index}">
                        <label for="route_${index}"> ${submodule.submodule_name}</label>
                    </a>
                `);
            });

            // Toggle all checkboxes when "Select All" is clicked
            $('#route').on('change', '#selectAllRouteCheckbox', function () {
                var isChecked = $(this).prop('checked');
                $('.route-checkbox').prop('checked', isChecked);
                fetchActions(); // Only fetch actions after submodule selection change
            });

            // Update "Select All" checkbox status based on individual selections
            $('#route').on('change', '.route-checkbox', function () {
                var allChecked = $('.route-checkbox').length === $('.route-checkbox:checked').length;
                $('#selectAllRouteCheckbox').prop('checked', allChecked);
                fetchActions();
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error('Error fetching submodules: ' + errorMessage);
            $('#route').empty(); // Clear dropdown on error
        }
    });
}

// Function to fetch actions based on selected modules and sub-modules
function fetchActions() {
    if (isFetchingActions) return; // Prevent multiple API calls in quick succession
    isFetchingActions = true;

    var selectedModules = [];
    var selectedSubModules = [];

    // Get selected module_id values (van checkboxes)
    $('.van-checkbox:checked').each(function () {
        selectedModules.push($(this).val());
    });

    // Get selected submodule_id values (route checkboxes)
    $('.route-checkbox:checked').each(function () {
        selectedSubModules.push($(this).val());
    });

    if (selectedModules.length === 0 || selectedSubModules.length === 0) {
        $('#actionsContainer').empty(); // Clear container if nothing is selected
        isFetchingActions = false;
        return;
    }

    const url = new URL('/jssl/getactionsbasedonmodule_idandsubmodule_id', baseUrl);

    $.ajax({
        url: url.toString(),
        type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
        data: {
            module_id: selectedModules.join(','), // Pass selected module IDs
            submodule_id: selectedSubModules.join(',') // Pass selected submodule IDs
        },
        dataType: 'json',
        success: function (data) {
            if (!data.DataActions || data.DataActions.length === 0) {
                console.error("Error: DataActions not found in response");
                $('#actionsContainer').empty(); // Clear if no data
                isFetchingActions = false;
                return;
            }

            var container = $('#actionsContainer');
            container.empty(); // Clear previous content

            data.DataActions.forEach((actionData, index) => {
                if (actionData.actions_value) {
                    var actionsList = actionData.actions_value.split(',').map(action => action.trim()).filter(action => action !== '');

                    if (actionsList.length > 0) {
                        // Append module & submodule name
                        container.append(`<div><strong>${actionData.module_name} - ${actionData.submodule_name}&nbsp;&nbsp;</strong></div>`);

                        // Append actions as checkboxes
                        var checkboxesHTML = actionsList.map((action, idx) => `
                            <label style="margin-right: 10px;">
                                <input type="checkbox" class="action-checkbox" value="${action}" id="action_${index}_${idx}"> ${action}
                            </label>
                        `).join('');

                        container.append(`<div class="actions" data-module="${actionData.module_id}" data-submodule="${actionData.submodule_id}" style="margin-bottom: 10px;">${checkboxesHTML}</div>`);
                    }
                }
            });
            
            // Bind change event to each action checkbox
            $('.action-checkbox').on('change', function () {
                var actionValue = $(this).val();
                //alert(`Checkbox value: ${actionValue} ${this.checked ? 'checked' : 'unchecked'}`);
            });


            isFetchingActions = false; // Allow subsequent calls after data is loaded
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error('Error fetching actions: ' + errorMessage);
            $('#actionsContainer').empty(); // Clear on error
            isFetchingActions = false; // Reset flag
        }
    });
}

$(document).ready(function () {
    getmoduleactions(); // Call to fetch modules when the page is ready
});


function openModalAddsubmoass() {
    var usernamemoss = document.getElementById('roleass').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (usernamemoss === '') {
        document.getElementById('productCodeErrorcreditmodidroleass').innerText = "Please select role.";
        document.getElementById('productCodeErrorcreditmodidroleass').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditmodidroleass').innerText = "";
        document.getElementById('productCodeErrorcreditmodidroleass').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66facsubbass').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function getSelectedModulesIds() {
    var selectedmodulesIds = [];
    $('.van-checkbox:checked').each(function() {
        selectedmodulesIds.push($(this).val()); 
    });
    return selectedmodulesIds;
}

function addeventsubidass() {
    var selectedmodules = getSelectedModulesIds();
    
    if (selectedmodules.length === 0) {
        alert("Please select a module.");
        return;
    }

    let allData = {};
    const parsedData = document.querySelectorAll('.actions');
    parsedData.forEach((div) => {
        const input = div.querySelectorAll('input');
        const module = div.getAttribute('data-module');
        const submodule = div.getAttribute('data-submodule');
        const actions = [];
        input.forEach((action) => {
            actions.push({action: action.value, checked: action.checked})
        });
    
        if (!allData[module]) {
            allData[module] = [];
        }
        allData[module].push({submodule, actions});
    });
    
    const submoduleRequest = Object.values(allData).map((module) => {
        return module.map((data) => data.submodule).join('-')
    }).join(',');
    
    const actionRequest = Object.values(allData).flat().map((data) => {
        return data.actions.filter(item => item.checked).map(item => item.action.toLowerCase()).join('-')
    }).filter(item => item !== '').join(',');
    console.warn(submoduleRequest, actionRequest);

     const endpoint = "/jssl/assignModuleToRole/add";
     const url = new URL(endpoint, baseUrl);

     $.ajax({
        url: url.toString(),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({
            submodule_id: submoduleRequest,
            actions: actionRequest,
            created_by: createdById,
            role_id: roleass.value,   
            module_id: selectedmodules.length > 0 ? selectedmodules.join(', ') : ""  // Ensure it's a string
         }),
        success: function(data) {
            var result = data.message; // No need to stringify
            if (result === "Success") {
                 // Store permissions in sessionStorage
                 const popup = $('<div class="popup">Role Assigned to Module, sub-module, and actions Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                 setTimeout(function() {
                 popup.fadeOut(400, function() {
                        $(this).remove();
                         window.location = 'settings.jsp'; // Redirect to role list page
                     });
               }, 800);
            } else {
                 // Handle error if necessary
                 // Show error message or modal
             }
         },
         error: function() {
             console.error('Request failed.');
         }
     });
}



