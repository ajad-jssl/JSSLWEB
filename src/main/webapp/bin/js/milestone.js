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
        const url = new URL(`/jssl/master/listmilestonemasternew`, baseUrl);
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
                    <th>Milestone Code</th>
                    <th>Milestone Name</th>
					<th>Milestone Description</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.Data.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.milestone_code}</td>
                     <td>${item.milestone_name}</td>
					 <td>${item.milestone_desc}</td>
                    <td><i class="fa fa-pen" onclick="editRecord('${item.milestone_id}')"></i></td>
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
    var username11 = document.getElementById('taxvalue').value.trim();
	var state = document.getElementById('taxvaluedesc').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please Enter Milestone Code.";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
    }
    if (username11 === '') {
        document.getElementById('productCodeErrorcreditAA1').innerText = "Please Enter Milestone Name.";
        document.getElementById('productCodeErrorcreditAA1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA1').innerText = "";
        document.getElementById('productCodeErrorcreditAA1').style.display = "none";
    }
	if (state === '') {
	        document.getElementById('productCodeErrormiledesc').innerText = "Please Enter Milestone Description.";
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
    // Validate role code and role description
	
	$('#exampleModalCenter66').modal('hide'); 
    $.ajax({
        url: new URL('/jssl/master/addmilestonemasternew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({milestone_code:taxname.value,created_by:createdById,milestone_name:taxvalue.value,milestone_desc:taxvaluedesc.value}),
		  success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">MileStone Master Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'Milestone.jsp'; // Redirect to role list page
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
// for validation please give 
function openModalEdit() {
    var username = document.getElementById('taxname1').value.trim();
    var username11 = document.getElementById('taxvalue1').value.trim();
	var state = document.getElementById('stateedit').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please Enter Milestone Code.";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
    }
    if (username11 === '') {
        document.getElementById('productCodeErrorcreditAA1').innerText = "Please Enter Milestone Name.";
        document.getElementById('productCodeErrorcreditAA1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA1').innerText = "";
        document.getElementById('productCodeErrorcreditAA1').style.display = "none";
    }
	if (state === '') {
	        document.getElementById('productCodeErrormiledesc').innerText = "Please Enter Milestone Description.";
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


function normalize(val) {
    return val
        ?.toString()
        .replace(/\u00A0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}



function editevent() {
	$('#exampleModalCenterupdate').modal('hide');
    const currentMilestoneData = {
        milestone_code: $('#taxname1').val(),
        milestone_name: $('#taxvalue1').val(),
        milestone_desc: $('#stateedit').val(),
        milestone_id: $('#id').val()
    };

    const isSame =
        normalize(originalMilestoneData.milestone_code) === normalize(currentMilestoneData.milestone_code) &&
        normalize(originalMilestoneData.milestone_name) === normalize(currentMilestoneData.milestone_name) &&
        normalize(originalMilestoneData.milestone_desc) === normalize(currentMilestoneData.milestone_desc);

    if (isSame) {
		const popup = $('<div class="popup">No Feilds Changes</div>')
						                  .appendTo('body').hide().fadeIn(400);

						              setTimeout(function() {
						                  popup.fadeOut(200, function() {
						                      $(this).remove();
						                      window.location = 'Milestone.jsp'; // Redirect to role list page
						                  });
						              }, 800);
        return;
    }

    updateMilestone(); // ✅ only when changed
}



function updateMilestone() {
	
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/master/updatemilestonemasternew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
		data: jQuery.param({milestone_code:taxname1.value,modified_by:createdById,milestone_id:id.value,milestone_name:taxvalue1.value,milestone_desc:stateedit.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Milestone Master Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'Milestone.jsp'; // Redirect to role list page
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

let originalMilestoneData = {};
function editRecord(milestone_id) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/master/searchmilestonemasternew`, baseUrl);
    var params = [['milestone_id', milestone_id]];
    url.search = new URLSearchParams(params).toString();

   fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.DATA) {
                // Populate form fields with the data from the response
                $('#taxname1').val(response.DATA.milestone_code);
                $('#taxvalue1').val(response.DATA.milestone_name);
				$('#stateedit').val(response.DATA.milestone_desc);
                $('#id').val(response.DATA.milestone_id);
				
				originalMilestoneData = {
				                 milestone_code: response.DATA.milestone_code,
				                 milestone_name: response.DATA.milestone_name,
				                 milestone_desc: response.DATA.milestone_desc,
				                 milestone_id: response.DATA.milestone_id
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
