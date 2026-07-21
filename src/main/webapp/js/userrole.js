function fetchUserRole() {
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
                    const role_desc = DistrictDetails.role_desc || 'N/A';
                    const role_code = DistrictDetails.role_code || 'N/A';

                    // Define the `id` for each row (use a unique value like role_code or a combination)
                    const role_id = `row-${role_code || i}`; // Fallback to the index if role_code is not available

                    // Append each row to the HTML string
                    li += `<tr id="${role_id}">
                        <td>${role_name}</td>
                        <td>${role_code}</td>
                        <td>${role_desc}</td>
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
                    dom: 'Bfrtip',
                    scrollX: true,
                    info: true,
                    paging: true,
                    buttons: [
                        {
                            extend: 'excel',
                            text: 'Export to Excel',
                            title: 'Role List',
                        },
                    ],
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


//addevent
// Function to handle the role creation process
function addevent() {
    // Validate role code and role description
    const roleCode = $('#rolec').val().trim();
    const roleDescription = $('#roled').val().trim();

    // Check for empty role code
    if (!roleCode) {
        $('#roleCodeError').text('Role code is required').show();
        return;
    } else {
        $('#roleCodeError').hide();
    }

    // Check for empty role description
    if (!roleDescription) {
        $('#roleDescriptionError').text('Role description is required').show();
        return;
    } else {
        $('#roleDescriptionError').hide();
    }

    // Collect checkbox values for the submodules
    const invoiceModule = $('#invoice_module').is(':checked') ? 1 : 0;
    const qsSubmodule = $('#qs_submodule').is(':checked') ? 1 : 0;
    const invoiceSubmodule = $('#invoice_submodule').is(':checked') ? 1 : 0;
    const mastersSubmodule = $('#masters_submodule').is(':checked') ? 1 : 0;
    const scrapSubmodule = $('#scrap_submodule').is(':checked') ? 1 : 0;
    const reportsSubmodule = $('#reports_submodule').is(':checked') ? 1 : 0;

    // Prepare request data
    const requestData = {
        role_name: roleDescription,
        role_code: roleCode,
        created_by: 'system', // Assuming the creator is the system
        invoice_module: invoiceModule,
        qs_submodule: qsSubmodule,
        invoice_submodule: invoiceSubmodule,
        masters_submodule: mastersSubmodule,
        scrap_submodule: scrapSubmodule,
        reports_submodule: reportsSubmodule,
        read_access: 0, // Default to 0 for now
        read_write_access: 0,
        verify_access: 0
    };

    console.log("Request Data:", JSON.stringify(requestData));

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
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function(response) {
    // Handle success response
    if (response && response.message === "Success") {
        // Store permissions in sessionStorage
        sessionStorage.setItem("invoice_module", response.invoice_module);
        sessionStorage.setItem("qs_submodule", response.qs_submodule);
        sessionStorage.setItem("scrap_submodule", response.scrap_submodule);
        sessionStorage.setItem("reports_submodule", response.reports_submodule);
        sessionStorage.setItem("masters_submodule", response.masters_submodule);

        const popup = $('<div class="popup">Role Created Successfully!</div>')
            .appendTo('body').hide().fadeIn(400);

        setTimeout(function() {
            popup.fadeOut(400, function() {
                $(this).remove();
                window.location = 'userrole.jsp'; // Redirect to role list page
            });
        }, 800);
    } else {
        alert(response.message || 'Failed to create role.');
    }
},
        error: function(xhr, status, error) {
            console.error('AJAX error:', error);
            console.log('Response Text:', xhr.responseText);
            alert('Failed to create role. Please try again.');
        }
    });
}

// Reset form fields
function resetForm() {
    $('#roleForm')[0].reset(); // Reset all form fields
    $('#roleCodeError').hide(); // Hide role code error message
    $('#roleDescriptionError').hide(); // Hide role description error message
}






