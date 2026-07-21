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
        
        // Construct the API URL
        const url = new URL(`/jssl/master/allExportTitleList`, baseUrl);
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
                    <th>Export Title Text</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.ExportTitleDetails.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.export_title}</td>
                    <td><i class="fa fa-pen" onclick="editRecord('${item.id}')"></i></td>
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

function openModalAdd() {
    var username = document.getElementById('taxname').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please Enter Export Title Text.";
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
        url: new URL('/jssl/master/addExportTitle', baseUrl), // Move 'const' to the correct place
        type: 'POST',
        dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
        data: jQuery.param({export_title:taxname.value,created_by:createdById}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Export Title Text Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'exportTitle.jsp'; // Redirect to role list page
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

let orginal_export = {};

function editRecord(id) {
   // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/master/exportTitleListBasedOnId`, baseUrl);
    var params = [['id', id]];
    url.search = new URLSearchParams(params).toString();

 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            $('#taxname1').val(response.export_title);
            $('#id').val(response.id);
			
			orginal_export = {
				export_title:response.export_title
			};
             // Open the modal
            $('#exampleModalScrollableedit').modal('show');
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
        document.getElementById('productCodeErrorcreditss').innerText = "Please Enter Export Title Text.";
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
	$('#exampleModalCenterupdate').modal('hide');
	var exp_title = document.getElementById('taxname1').value.trim();
	
	if(orginal_export.export_title === exp_title){
		const popup = $('<div class="popup">No Feilds Changes</div>')
		                   .appendTo('body').hide().fadeIn(400);

		               setTimeout(function() {
		                   popup.fadeOut(400, function() {
		                       $(this).remove();
		                       window.location = 'exportTitle.jsp'; // Redirect to role list page
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
        url: new URL('/jssl/master/updateExportTitle', baseUrl), // Move 'const' to the correct place
        type: 'POST',
        dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
		data: jQuery.param({export_title:taxname1.value,modified_by:createdById,id:id.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Export Title Text Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'exportTitle.jsp'; // Redirect to role list page
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