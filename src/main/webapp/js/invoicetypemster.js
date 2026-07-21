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

// Fetch selectedFactoryId from localStorage
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
// Function to fetch the list of users/vendors based on the selected factory ID
async function fetchUserList() {
    try {
        
        // Construct the API URL
        const url = new URL(`/jssl/master/listinvoicetypenew`, baseUrl);
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
                    <th>Invoice Remarks Type</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.INVOICE_TYPE_LIST.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.type}</td>
                    <td><i class="fa fa-pen" onclick="editRecord('${item.type_no}')"></i></td>
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
// for validation please give 
function openModalAdd() {
    var username = document.getElementById('taxname').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please Enter Invoice Type.";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
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
        url: new URL('/jssl/master/addinvoicetypenew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({type:taxname.value.trim(),created_by:createdById}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Invoice Type Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'invoicetypemaster.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Already Exists,Invoice Type details not added.';
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

let orignal_type = null;

function editRecord(type_no) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/master/searchinvoicetypenew`, baseUrl);
    var params = [['type_no', type_no]];
    url.search = new URLSearchParams(params).toString();

  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.DATA) {
                // Populate form fields with the data from the response
                $('#taxname1').val(response.DATA.type);
                $('#id').val(response.DATA.type_no);
				orignal_type = response.DATA.type;
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

function openModalEdit() {
    var username = document.getElementById('taxname1').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditss').innerText = "Please Enter Invoice Type.";
        document.getElementById('productCodeErrorcreditss').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss').innerText = "";
        document.getElementById('productCodeErrorcreditss').style.display = "none";
    }
   
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenterupdate').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}


function editevent(){
	var invoice_type = document.getElementById('taxname1').value.trim();
	$('#exampleModalCenterupdate').modal('hide');
	if(orignal_type === invoice_type){
		const popup = $('<div class="popup">No Feilds Changes</div>')
		                 .appendTo('body').hide().fadeIn(400);

		             setTimeout(function() {
		                 popup.fadeOut(400, function() {
		                     $(this).remove();
		                     window.location = 'invoicetypemaster.jsp'; // Redirect to role list page
		                 });
		             }, 800);
					 return;
	}
	else{
		editeventUpdate();
	}
}



function editeventUpdate() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/master/updateinvoicetypenew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
		data: jQuery.param({type:taxname1.value.trim(),modified_by:createdById,type_no:id.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Invoice Type Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'invoicetypemaster.jsp'; // Redirect to role list page
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

