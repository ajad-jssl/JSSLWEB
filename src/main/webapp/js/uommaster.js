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
        const url = new URL(`/jssl/master/listunitmeasurementmasternew`, baseUrl);
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
                    <th>Uom Name</th>
                    <th>Description</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.Data.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.unit_name}</td>
                    <td>${item.description}</td>
                    <td><i class="fa fa-pen" onclick="editRecord('${item.unit_id}')"></i></td>
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
    var username = document.getElementById('unitName').value.trim();
    var username11 = document.getElementById('des').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditQQSS').innerText = "Please enter unit Name.";
        document.getElementById('productCodeErrorcreditQQSS').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditQQSS').innerText = "";
        document.getElementById('productCodeErrorcreditQQSS').style.display = "none";
    }
    if (username11 === '') {
        document.getElementById('productCodeErrorcredit').innerText = "Please enter description.";
        document.getElementById('productCodeErrorcredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit').innerText = "";
        document.getElementById('productCodeErrorcredit').style.display = "none";
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
        url: new URL('/jssl/master/addunitmeasurementmasternew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({unit_name:unitName.value.trim(),created_by:createdById,description:des.value.trim()}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">UOM Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'uommaster.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || '';
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

let originalUnitEditData = null;

function editRecord(unit_id) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/master/searchunitmasternew`, baseUrl);
    var params = [['unitId', unit_id]];
    url.search = new URLSearchParams(params).toString();

 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.DATA) {
                // Populate form fields with the data from the response
                $('#uid').val(response.DATA.unit_id);
                $('#unitnameedit').val(response.DATA.unit_name);
                $('#desesit').val(response.DATA.description);
				
				originalUnitEditData = {
				                   unit_name: response.DATA.unit_name || '',
				                   description: response.DATA.description || ''
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

function openModalEdit() {
    var username = document.getElementById('unitnameedit').value.trim();
    var username11 = document.getElementById('desesit').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErroredit2edit').innerText = "Please enter unit Name.";
        document.getElementById('productCodeErroredit2edit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErroredit2edit').innerText = "";
        document.getElementById('productCodeErroredit2edit').style.display = "none";
    }
    if (username11 === '') {
        document.getElementById('productCodeErrorcredit22').innerText = "Please enter description.";
        document.getElementById('productCodeErrorcredit22').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit22').innerText = "";
        document.getElementById('productCodeErrorcredit22').style.display = "none";
    }
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenterupdate').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function hasUnitDataChanged() {
    if (!originalUnitEditData) return true;

    return (
        document.getElementById('unitnameedit').value.trim() !== originalUnitEditData.unit_name ||
        document.getElementById('desesit').value.trim() !== originalUnitEditData.description
    );
}


function editevent(){
	if(!hasUnitDataChanged()){
		const popup = $('<div class="popup">No Feilds Changes</div>')
		              .appendTo('body').hide().fadeIn(400);

		          setTimeout(function() {
		              popup.fadeOut(400, function() {
		                  $(this).remove();
		                  window.location = 'uommaster.jsp'; // Redirect to role list page
		              });
		          }, 800);
		return ;
	}
	editeventUpdate();
}


function editeventUpdate() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/master/updateunitmeasurementmasternew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({unit_name:unitnameedit.value.trim(),modified_by:createdById,unit_id:uid.value,description:desesit.value.trim()}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">uom updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'uommaster.jsp'; // Redirect to role list page
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
}