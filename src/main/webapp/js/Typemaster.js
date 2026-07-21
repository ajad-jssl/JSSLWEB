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
	  const allowed =allowedActions || [];

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
        const url = new URL(`/jssl/master/listtypemasternew`, baseUrl);
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
                    <th>Scrap Name</th>
                    <th>Scrap Type</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.Data.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.scrap_name}</td>
                     <td>${item.scrap_type}</td>
                    <td><i class="fa fa-pen" onclick="editRecord('${item.type_id}')"></i></td>
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
    var username11 = document.getElementById('taxvalue').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please enter scrap name.";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
    }
    if (username11 === '') {
        document.getElementById('productCodeErrorcreditAA1').innerText = "Please enter scrap type.";
        document.getElementById('productCodeErrorcreditAA1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA1').innerText = "";
        document.getElementById('productCodeErrorcreditAA1').style.display = "none";
    }
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addevent() {
	$("#exampleModalCenter66").modal("hide");
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/master/addtypemasternew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({scrap_name:taxname.value,created_by:createdById,scrap_type:taxvalue.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Type Master Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'Typemaster.jsp'; // Redirect to role list page
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


let originalTypeData = {};


function editRecord(type_id) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/master/searchtypemasternew`, baseUrl);
    var params = [['type_id', type_id]];
    url.search = new URLSearchParams(params).toString();

  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.DATA) {
                // Populate form fields with the data from the response
                $('#taxvalue1').val(response.DATA.scrap_type);
                $('#taxname1').val(response.DATA.scrap_name);
                $('#id').val(response.DATA.type_id);
				originalTypeData = {
				                 scrap_type: response.DATA.scrap_type.trim(),
				                 scrap_name: response.DATA.scrap_name.trim(),
				                 type_id: response.DATA.type_id.trim()
				             };
				
			/*	scrap_type = response.DATA.scrap_type;
				scrap_name = response.DATA.scrap_name;*/
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
    var username11 = document.getElementById('taxvalue1').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditss').innerText = "Please enter scrap name.";
        document.getElementById('productCodeErrorcreditss').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss').innerText = "";
        document.getElementById('productCodeErrorcreditss').style.display = "none";
    }
    if (username11 === '') {
        document.getElementById('productCodeErrorcreditss1').innerText = "Please scrap rype.";
        document.getElementById('productCodeErrorcreditss1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss1').innerText = "";
        document.getElementById('productCodeErrorcreditss1').style.display = "none";
    }
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenterupdate').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function normalize(val) {
    return val
        ?.replace(/\u00A0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase();
}

function editevent() {
	$('#exampleModalCenterupdate').modal('hide');
    const currentData = {
        scrap_type: $('#taxvalue1').val().trim(),
        scrap_name: $('#taxname1').val().trim(),
        type_id: $('#id').val().trim()
    };

    const isSame =
        normalize(originalTypeData.scrap_type) === normalize(currentData.scrap_type) &&
        normalize(originalTypeData.scrap_name) === normalize(currentData.scrap_name);

    if (isSame) {
		const popup = $('<div class="popup">No fields changes</div>')
		                  .appendTo('body').hide().fadeIn(400);

		              setTimeout(function() {
		                  popup.fadeOut(200, function() {
		                      $(this).remove();
		                      window.location = 'Typemaster.jsp'; // Redirect to role list page
		                  });
		              }, 800);
        return;
    }

    updatetype();
}

function updatetype() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/master/updatetypemasternew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({scrap_type:taxvalue1.value,modified_by:createdById,type_id:id.value,scrap_name:taxname1.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Type Master updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(200, function() {
                        $(this).remove();
                        window.location = 'Typemaster.jsp'; // Redirect to role list page
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