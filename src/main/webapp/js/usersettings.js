function fetchUserList() {
	getroleuser();
	getfactory();
     // Dynamically construct the URL using the base URL and the relative path
    const url = new URL('/jssl/user/listuser', baseUrl);  // Construct the full URL

fetch(url, { credentials: "include" })
        .then(response => {
            if (!response.ok) {
                throw new Error("Server API error");
            }
            return response.json();
        })
        .then(json => {
            // Clear any existing rows in the table body before adding new ones
            document.querySelector("#userTable tbody").innerHTML = '';

            // Check if the response has 'DistrictDetails' and it's an array
            if (json.status === "yes" && json.Data && Array.isArray(json.Data)) {
                let li = ''; // Initialize HTML string for table rows
                const arr = json.Data;

                // Loop through each item and build the table rows
                for (let i = 0; i < arr.length; i++) {
                    const DistrictDetails = arr[i];
                    const username = DistrictDetails.username || 'N/A';
                    const role = DistrictDetails.role || 'N/A';

                    // Define the `id` for each row (use a unique value like role_code or a combination)
                    const id = `row-${role || i}`; // Fallback to the index if role_code is not available

                    // Append each row to the HTML string
                    li += `<tr id="${id}">
                        <td>${username}</td>
                        <td>${role}</td>
                        <td style="display:none;">${id}</td> <!-- Hidden column for ID -->
                    </tr>`;
                }

                // Inject rows into the table body
                document.querySelector("#userTable tbody").innerHTML = li;

                // Initialize DataTable if rows were added
                const table = $('#userTable');
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
                document.querySelector("#userTable tbody").innerHTML = '<tr><td colspan="4">No data available</td></tr>';
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            document.querySelector("#userTable tbody").innerHTML = '<tr><td colspan="4">Failed to load data</td></tr>';
        });
}
function onDeliveredOrderTabClick() {
	setTimeout(() => {
		$('#userTable_wrapper .dataTables_scrollHeadInner th').click();
	}, 200);
}

function getroleuser() {
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
            var tableRef = document.getElementById("role1user");
            $("#role1user").empty(); // Clear the dropdown before appending new options
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
            $('#role1user').append(trHTML); // Append the options to the dropdown
        },
        error: function (jqXhr, textStatus, errorMessage) {
            // Handle error (you can display an alert or log the error)
            console.log("Error: " + errorMessage); // Uncomment if you want to see the error in the console
        }
    });
}

function getfactory() {
    const url = new URL('/jssl/factory/getAllFactoryList', baseUrl); 

    $.ajax({
        url: url.toString(), // Pass the correct URL
        type: 'GET',
        dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
        success: function (data) {
            if (!data.FactoryDetails) {
                console.error("Error: FactoryDetails not found in response");
                return;
            }

            var FactoryDetails = data.FactoryDetails;
            var container = $('#customer');
            container.empty();

            // Add search input at the top of the dropdown
            /*container.append(`
                <a class="dropdown-item">
                    <input type="text" id="customerSearch" class="form-control form-control-sm" placeholder="Search factory...">
                </a>
            `);*/

            // Add "Select All" checkbox
            container.append('<a class="dropdown-item"><input type="checkbox" id="selectAllCustomerCheckbox"><label for="selectAllCustomerCheckbox"> Select All</label></a>');

            // Add checkboxes for each customer
            FactoryDetails.forEach((factory, index) => {
                container.append(`
                    <a class="dropdown-item customer-item">
                        <input type="checkbox" class="customer-checkbox" value="${factory.id}" id="customer_${index}">
                        <label for="customer_${index}"> ${factory.factory_name}</label>
                    </a>
                `);
            });

            // Toggle all checkboxes when "Select All" is clicked
            $('#selectAllCustomerCheckbox').change(function () {
                var isChecked = $(this).prop('checked');
                $('.customer-checkbox').prop('checked', isChecked);
            });

            // Update "Select All" based on individual checkbox selections
            container.on('change', '.customer-checkbox', function () {
                var allChecked = $('.customer-checkbox').length === $('.customer-checkbox:checked').length;
                $('#selectAllCustomerCheckbox').prop('checked', allChecked);
            });

            // Reset "Select All" checkbox on load
            $('#selectAllCustomerCheckbox').prop('checked', false);

            // Add search functionality
            /*$('#customerSearch').on('input', function () {
                var searchText = $(this).val().toLowerCase();
                $('.customer-item').each(function () {
                    var customerName = $(this).text().toLowerCase();
                    $(this).toggle(customerName.includes(searchText));
                });
            });*/
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error('Error: ' + errorMessage);
        }
    });
}

function getSelectedFactoryIds() {
    var selectedFactoryIds = [];
    $('.customer-checkbox:checked').each(function() {
        selectedFactoryIds.push($(this).val()); // Push the value (factory.id) to the array
    });
    return selectedFactoryIds;
}


function openModalAdd1() {
    var username = document.getElementById('uname').value.trim();
    var password = document.getElementById('pass').value.trim();
    var role = document.getElementById('role1user').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditUS').innerText = "Please enter username.";
        document.getElementById('productCodeErrorcreditUS').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditUS').innerText = "";
        document.getElementById('productCodeErrorcreditUS').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErrorcredittyuUS').innerText = "Please enter password.";
        document.getElementById('productCodeErrorcredittyuUS').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredittyuUS').innerText = "";
        document.getElementById('productCodeErrorcredittyuUS').style.display = "none";
    }
    
    // Role Validation
    if (role === '') {
        document.getElementById('productCodeErrorcredittyuaaUS').innerText = "Please select a role.";
        document.getElementById('productCodeErrorcredittyuaaUS').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredittyuaaUS').innerText = "";
        document.getElementById('productCodeErrorcredittyuaaUS').style.display = "none";
    }

    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter6611').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addevent1() {
    var username = document.getElementById('uname').value.trim();
    var password = document.getElementById('pass').value.trim();
    var email = document.getElementById('email').value.trim();
    var mobile = document.getElementById('mob').value.trim();
    var role = document.getElementById('role1user').value.trim();
    var userId = document.getElementById('name1').value.trim();

    var selectedFactories = getSelectedFactoryIds();

    if (selectedFactories.length === 0) {
        alert("Please select a factory.");
        return;
    }

    const endpoint = "/jssl/user/adduser";
    const url = new URL(endpoint, baseUrl);

    $.ajax({
        url: url.toString(),
        type: 'POST',
        dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
        data: jQuery.param({user_id: userId,
        password: password,
        username: username,
        email: email,
        mobile_number: mobile,
        created_by: createdById,
        role_id: role,
        factory_id: selectedFactories.length > 0 ? selectedFactories.join(', ') : ""  // Ensure it's a string
        }),
        success: function(data) {
			var result = data.message; // No need to stringify

			if (result === "User Created Success") {
				// Store permissions in sessionStorage
				const popup = $('<div class="popup">User Created Successfully!</div>')
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







