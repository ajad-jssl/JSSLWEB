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

document.getElementById("enddate").setAttribute("min", new Date().toISOString().split('T')[0]);
document.getElementById("enddate1").setAttribute("min", new Date().toISOString().split('T')[0]);
// Function to fetch the list of users/vendors based on the selected factory ID
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
async function fetchUserList() {
    try {
        const url = new URL(`/jssl/taxmasters/list`, baseUrl);
		//url.searchParams.append('factory_id', selectedFactoryId);
		
        // Fetch vendor data
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        if (!json.Data || json.Data.length === 0) {
            console.warn("No data received");
            $("#tableID").empty().append("<tr><td colspan='5'>No records found</td></tr>");
            return;
        }

        // Function to format date to "dd-mm-yyyy"
        const formatDate = (dateStr) => {
            if (!dateStr) return ''; // Handle empty/null values
            const dateObj = new Date(dateStr);
            if (isNaN(dateObj)) return dateStr; // Return original if invalid
            return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-'); // Replace / with -
        };

        // Destroy previous DataTable instance before updating the table
        if ($.fn.DataTable.isDataTable("#tableID")) {
            $("#tableID").DataTable().destroy();
        }

        // Clear table and append new content
        $("#tableID").empty().append(`
            <thead>
                <tr>
                    <th>Tax Name</th>
                    <th>Tax Value</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                ${json.Data.map(item => `
                    <tr>
                        <td>${item.tax_name}</td>
                        <td>${item.tax_per}</td>
                        <td>${formatDate(item.startdate)}</td>
                        <td>${formatDate(item.enddate)}</td>
                        <td><i class="fa fa-pen" onclick="editRecord('${item.tax_id}')"></i></td>
                    </tr>
                `).join('')}
            </tbody>
        `);

        // Initialize DataTable
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


function openModalAdd() {
    var username = document.getElementById('taxname').value.trim();
    var password = document.getElementById('taxvalue').value.trim();
    var code = document.getElementById('startdate').value.trim();
    var state = document.getElementById('enddate').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please tax Name.";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErrorcreditAA1').innerText = "Please tax value.";
        document.getElementById('productCodeErrorcreditAA1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA1').innerText = "";
        document.getElementById('productCodeErrorcreditAA1').style.display = "none";
    }
    
    if (code === '') {
        document.getElementById('productCodeErrorcreditAA2').innerText = "Please start date.";
        document.getElementById('productCodeErrorcreditAA2').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA2').innerText = "";
        document.getElementById('productCodeErrorcreditAA2').style.display = "none";
    }
    
    if (state === '') {
        document.getElementById('productCodeErrorcreditAA3').innerText = "Please end date.";
        document.getElementById('productCodeErrorcreditAA3').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA3').innerText = "";
        document.getElementById('productCodeErrorcreditAA3').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addevent() {
	$('#exampleModalCenter66').modal('hide');
	
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/taxmasters/addTaxMaster', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({tax_name: taxname.value.trim(), tax_per: taxvalue.value,startdate:startdate.value,enddate:enddate.value,created_by: createdById}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Tax Details Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'taxmaster.jsp'; // Redirect to role list page
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

let originalTaxEditData = null;

function editRecord(tax_id) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/taxmasters/searchtaxmasters`, baseUrl);
    var params = [['id', tax_id]];
    url.search = new URLSearchParams(params).toString();

   fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.Data) {
                // Populate form fields with the data from the response
                $('#taxname1').val(response.Data.tax_name);
                $('#taxvalue1').val(response.Data.tax_per);
                $('#startdate1').val(response.Data.startdate);
                $('#enddate1').val(response.Data.enddate);
                $('#taxses').val(response.Data.tax_desc);
                $('#id').val(response.Data.tax_id);
				
				originalTaxEditData = {
				                  tax_name: response.Data.tax_name || '',
				                  tax_per: response.Data.tax_per || '',
				                  startdate: response.Data.startdate || '',
				                  enddate: response.Data.enddate || '',
				                  tax_desc: response.Data.tax_desc || ''
				              };
				
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

function openModaledit() {
    var username = document.getElementById('taxname1').value.trim();
    var password = document.getElementById('taxvalue1').value.trim();
    var code = document.getElementById('startdate1').value.trim();
    var state = document.getElementById('enddate1').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditss').innerText = "Please tax Name.";
        document.getElementById('productCodeErrorcreditss').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss').innerText = "";
        document.getElementById('productCodeErrorcreditss').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErrorcreditss1').innerText = "Please tax value.";
        document.getElementById('productCodeErrorcreditss1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss1').innerText = "";
        document.getElementById('productCodeErrorcreditss1').style.display = "none";
    }
    
    if (code === '') {
        document.getElementById('productCodeErrorcreditss3').innerText = "Please start date.";
        document.getElementById('productCodeErrorcreditss3').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss3').innerText = "";
        document.getElementById('productCodeErrorcreditss3').style.display = "none";
    }
    
    if (state === '') {
        document.getElementById('productCodeErrorcreditss23').innerText = "Please end date.";
        document.getElementById('productCodeErrorcreditss23').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss23').innerText = "";
        document.getElementById('productCodeErrorcreditss23').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenterupdate').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function hasOnlyEndDateChanged() {
    if (!originalTaxEditData) return false;

    return (
        enddate1.value !== originalTaxEditData.enddate &&

        taxname1.value.trim() === originalTaxEditData.tax_name &&
        taxvalue1.value.trim() === originalTaxEditData.tax_per &&
        startdate1.value === originalTaxEditData.startdate &&
        taxses.value.trim() === originalTaxEditData.tax_desc
    );
}

function hasTaxDataChanged() {
    if (!originalTaxEditData) return true;

    return (
        taxname1.value.trim() !== originalTaxEditData.tax_name ||
        taxvalue1.value.trim() !== originalTaxEditData.tax_per ||
        startdate1.value !== originalTaxEditData.startdate ||
        enddate1.value !== originalTaxEditData.enddate ||
        taxses.value.trim() !== originalTaxEditData.tax_desc
    );
}


function editevent() {
    $('#exampleModalCenterupdate').modal('hide');

    //  No changes → skip update
    if (!hasTaxDataChanged()) {
		const popup = $('<div class="popup">No Feilds Changes</div>')
		    .appendTo('body')
		    .hide()
		    .fadeIn(400);

		setTimeout(() => {
		    popup.fadeOut(400, function () {
		        $(this).remove();
		        window.location = 'taxmaster.jsp';
		    });
		}, 800);
		return;
    }

    // 2️⃣ Call normal update first
    editeventUpdate();
}


/* this the old method 
function editeventUpdate() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/taxmasters/updateTaxmaster', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({tax_name: taxname1.value.trim(), tax_per: taxvalue1.value,startdate:startdate1.value,enddate:enddate1.value,modified_by: createdById,tax_id:id.value,tax_desc:taxses.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Tax Details updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'taxmaster.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || '';
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
}*/


function editeventUpdate() {
    $.ajax({
        url: new URL('/jssl/taxmasters/updateTaxmaster', baseUrl),
        type: 'POST',
        xhrFields: { withCredentials: true },
        dataType: 'json',
        data: jQuery.param({
            tax_name: taxname1.value.trim(),
            tax_per: taxvalue1.value.trim(),
            startdate: startdate1.value.trim(),
            enddate: enddate1.value.trim(),
            modified_by: createdById.trim(),
            tax_id: id.value.trim(),
            tax_desc: taxses.value.trim()
        }),
        success: function (data) {

            //  SUCCESS
            if (data.message === "Success") {
                showSuccessPopup();
                return;
            }

            //  USED IN TRANSACTION
            if (
                data.message &&
                data.message.toLowerCase().includes("involed")
            ) {

                // ✅ Allow ONLY end date update
                if (hasOnlyEndDateChanged()) {
                    updateEndDateOnly();
                    return;
                }

                //  Other fields changed
                $('#errorMessageup').text(
                    "This tax is already used in transactions. Only the End Date can be updated."
                );
                $('#exampleModalCenterDupUP').modal('show');
                return;
            }

            // Other backend errors
            $('#errorMessageup').text(data.message || 'Update failed.');
            $('#exampleModalCenterDupUP').modal('show');
        },
        error: function () {
            console.error('Request failed.');
        }
    });
}

function updateEndDateOnly() {
    $.ajax({
        url: new URL('/jssl/taxmasters/updateTaxEndDateOnly', baseUrl),
        type: 'POST',
        xhrFields: { withCredentials: true },
        dataType: 'json',
        data: jQuery.param({
			tax_name: taxname1.value.trim(),
			           tax_per: taxvalue1.value,
			           startdate: startdate1.value,
			           enddate: enddate1.value,
			           modified_by: createdById,
			           tax_id: id.value,
			           tax_desc: taxses.value
        }),
        success: function (data) {
            if (data.message === "Success") {
                showSuccessPopup();
            } else {
                $('#errorMessageup').text(data.message || 'End date update failed.');
                $('#exampleModalCenterDupUP').modal('show');
            }
        },
        error: function () {
            console.error('End date update failed.');
        }
    });
}

function showSuccessPopup() {
    const popup = $('<div class="popup">Tax Details updated Successfully!</div>')
        .appendTo('body')
        .hide()
        .fadeIn(400);

    setTimeout(() => {
        popup.fadeOut(400, function () {
            $(this).remove();
            window.location = 'taxmaster.jsp';
        });
    }, 800);
}


