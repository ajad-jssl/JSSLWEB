
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
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("taxvalue1").setAttribute("max", today);
	document.getElementById("taxname12").setAttribute("max", today);
});

// Ensure the ID is available before making the API call
if (selectedFactoryId) {
    fetchUserList();
} else {
    console.error('No factory ID found in localStorage.');
}

// Function to fetch the list of users/vendors based on the selected factory ID
// Function to fetch the list of users/vendors based on the selected factory ID
async function fetchUserList() {
    try {
        // Construct the API URL
        const url = new URL(`/jssl/master/listworkordermasternew`, baseUrl);
        //url.searchParams.append('factory_id', selectedFactoryId);

        // Fetch vendor data
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        // Function to format date to "dd-mm-yyyy"
        const formatDate = (dateStr) => {
            if (!dateStr) return ''; // Handle empty/null values
            const dateObj = new Date(dateStr);
            if (isNaN(dateObj)) return dateStr; // Return original if invalid
            return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-'); // Replace / with -
        };

        // Prepare table content
        let tableContent = `
            <thead>
                <tr>
                    <th>Work Order Number</th>
                    <th>Work Order Date</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.Data.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.workorder_no}</td>
                    <td>${formatDate(item.work_date)}</td>
                    <td><i class="fa fa-pen" onclick="editRecord('${item.work_id}')"></i></td>
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
    var username11 = document.getElementById('taxname12').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please enter work order number.";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
    }
    
    if (username11 === '') {
        document.getElementById('productCodeErrorcreditAA12').innerText = "Please enter work order date.";
        document.getElementById('productCodeErrorcreditAA12').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA12').innerText = "";
        document.getElementById('productCodeErrorcreditAA12').style.display = "none";
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
        url: new URL('/jssl/master/addworkordermasternew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({work_date:taxname12.value,created_by:createdById,workorder_no:taxname.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Work Order Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'workorder.jsp'; // Redirect to role list page
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
let originalWorkOrderData = {};

function editRecord(work_id) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/master/searchworkordermasternew`, baseUrl);
    var params = [['work_id', work_id]];
    url.search = new URLSearchParams(params).toString();

    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.DATA) {
                // Populate form fields with the data from the response
                $('#taxname1').val(response.DATA.workorder_no);
                $('#taxvalue1').val(response.DATA.work_date);
                $('#id').val(response.DATA.work_id);
				
				originalWorkOrderData = {
				                  workorder_no: response.DATA.workorder_no,
				                  work_date: response.DATA.work_date,
				                  work_id: response.DATA.work_id
				              }
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
        document.getElementById('productCodeErrorcreditss').innerText = "Please enter work order number.";
        document.getElementById('productCodeErrorcreditss').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss').innerText = "";
        document.getElementById('productCodeErrorcreditss').style.display = "none";
    }
    if (username11 === '') {
        document.getElementById('productCodeErrorcreditss1').innerText = "Please enter work order date.";
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
        ?.toString()
        .replace(/\u00A0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function editevent() {
	$('#exampleModalCenterupdate').modal('hide');
    const currentWorkOrderData = {
        workorder_no: $('#taxname1').val(),
        work_date: $('#taxvalue1').val(),
        work_id: $('#id').val()
    };

    const isSame =
        normalize(originalWorkOrderData.workorder_no) === normalize(currentWorkOrderData.workorder_no) &&
        normalize(originalWorkOrderData.work_date) === normalize(currentWorkOrderData.work_date);

    if (isSame) {
		const popup = $('<div class="popup">No Feild Changed</div>')
				                  .appendTo('body').hide().fadeIn(400);

				              setTimeout(function() {
				                  popup.fadeOut(200, function() {
				                      $(this).remove();
				                      window.location = 'workorder.jsp'; // Redirect to role list page
				                  });
				              }, 800);
        return;
    }

    updateWorkOrder(); // ✅ call update only when changed
}
function updateWorkOrder() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/master/updateworkordermasternew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({workorder_no:taxname1.value,modified_by:createdById,work_id:id.value,work_date:taxvalue1.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Work Order updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'workorder.jsp'; // Redirect to role list page
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
