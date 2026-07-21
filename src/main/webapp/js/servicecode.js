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
        const url = new URL(`jssl/master/listbothhsnservicecodemasternew`, baseUrl);
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
                    <th>Service Code</th>
                    <th>Service Type</th>
					<th>Service Description</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.Data.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.service_code}</td>
                     <td>${item.service_type}</td>
					 <td>${item.service_description}</td>
                    <td><i class="fa fa-pen" onclick="editRecord('${item.servicecode_id}')"></i></td>
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
    var username11 = document.getElementById('serty').value.trim();
	var state = document.getElementById('taxvaluedesc').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please Enter Service Code.";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
    }
    if (username11 === '') {
        document.getElementById('productCodeErrorcreditAA1').innerText = "Please Enter Service Type.";
        document.getElementById('productCodeErrorcreditAA1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA1').innerText = "";
        document.getElementById('productCodeErrorcreditAA1').style.display = "none";
    }
	if (state === '') {
	        document.getElementById('productCodeErrormiledesc').innerText = "Please Enter Service Description.";
	        document.getElementById('productCodeErrormiledesc').style.display = "inline-block";
	        showError = true;
	    } else {
	        document.getElementById('productCodeErrormiledesc').innerText = "";
	        document.getElementById('productCodeErrormiledesc').style.display = "none";
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
        url: new URL('/jssl/master/addservicecodemasternew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({service_code:taxname.value.trim(),created_by:createdById,service_type:serty.value,service_description:taxvaluedesc.value}),
		  success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Service Master Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'servicecode.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to Create Service/HSN Code.';
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
// for validation please give 
function openModalEdit() {
    var username = document.getElementById('taxname1').value.trim();
    var username11 = document.getElementById('taxvalue1').value.trim();
	var state = document.getElementById('stateedit').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please Enter Service Code.";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
    }
    if (username11 === '') {
        document.getElementById('productCodeErrorcreditAA1').innerText = "Please Enter Service Type.";
        document.getElementById('productCodeErrorcreditAA1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA1').innerText = "";
        document.getElementById('productCodeErrorcreditAA1').style.display = "none";
    }
	if (state === '') {
	        document.getElementById('productCodeErrormiledesc').innerText = "Please Enter Service Description.";
	        document.getElementById('productCodeErrormiledesc').style.display = "inline-block";
	        showError = true;
	    } else {
	        document.getElementById('productCodeErrormiledesc').innerText = "";
	        document.getElementById('productCodeErrormiledesc').style.display = "none";
	    }
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenterupdate').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}


let originalServiceCodeEditData = null;
function editRecord(servicecodeId) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/master/searchservicecodenew`, baseUrl);
    var params = [['servicecodeId', servicecodeId]];
    url.search = new URLSearchParams(params).toString();

  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.DATA) {
                // Populate form fields with the data from the response
                $('#taxname1').val(response.DATA.service_code);
                $('#taxvalue1').val(response.DATA.service_type);
				$('#stateedit').val(response.DATA.service_description);
                $('#id').val(response.DATA.servicecode_id);
				
				originalServiceCodeEditData = {
				       service_code: String(response.DATA.service_code).trim(),
				       service_type: String(response.DATA.service_type).trim(),
				       service_description: String(response.DATA.service_description).trim()
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

function hasServiceCodeChanged() {
    if (!originalServiceCodeEditData) return true;

    const currentData = {
        service_code: document.getElementById('taxname1').value.trim(),
        service_type: document.getElementById('taxvalue1').value.trim(),
        service_description: document.getElementById('stateedit').value.trim()
    };

    return (
        currentData.service_code !== originalServiceCodeEditData.service_code ||
        currentData.service_type !== originalServiceCodeEditData.service_type ||
        currentData.service_description !== originalServiceCodeEditData.service_description
    );
}


function editevent(){
	if (!hasServiceCodeChanged()) {
		const popup = $('<div class="popup">No Feilds Changes</div>')
			                 .appendTo('body').hide().fadeIn(400);

			             setTimeout(function() {
			                 popup.fadeOut(400, function() {
			                     $(this).remove();
			                     window.location = 'servicecode.jsp'; // Redirect to role list page
			                 });
			             }, 1000);
	    return;
	}
	else{
		editeventUpdate();
	}
}


function editeventUpdate() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/master/updateservicecodemasternew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
		data: jQuery.param({service_code:taxname1.value.trim(),modified_by:createdById,servicecode_id:id.value,service_type:taxvalue1.value,service_description:stateedit.value}),
		 success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">ServiceCode Master Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'servicecode.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to Update service Code';
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



function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
