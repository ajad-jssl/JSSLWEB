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

document.getElementById("modalScroll").addEventListener("click", function () {
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

function fetchUserList() {
	fetchSaleOrderCode();
    // Create the URL and pass `selectedFactoryId` as a query parameter
    const url = new URL(`/jssl/scrapsalelocation/list`, baseUrl);
    //url.searchParams.append('factory_id', selectedFactoryId);  // Adding `factory_id` query parameter

    // Make API call to fetch data
  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            let li = '<thead><tr><th>Location Code</th><th>Location Name</th><th>Edit</th></tr></thead>';
            const arr = json.ListLocationTrack;

            // Loop through each data and add a table row
            arr.forEach(item => {
                li += `
                    <tr id="${item.slid}">
                        <td>${item.location_code}</td>
                        <td>${item.location_name}</td>
                       <td><i class="fa fa-pen" onclick="editRecord(${item.slid})"></i></td>
                        </tr>
                `;
            });

            // Insert table content into the table body
            document.getElementById("tableID").innerHTML = li;

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
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function openModalAdd() {
    var username = document.getElementById('locationname').value.trim();
    var password = document.getElementById('Locationcode').value.trim();
   var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcredit').innerText = "Please Loaction Name.";
        document.getElementById('productCodeErrorcredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit').innerText = "";
        document.getElementById('productCodeErrorcredit').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErrorcredittyu').innerText = "Please Location Code.";
        document.getElementById('productCodeErrorcredittyu').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredittyu').innerText = "";
        document.getElementById('productCodeErrorcredittyu').style.display = "none";
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
        url: new URL('/jssl/scrapsalelocation/add', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({location_code: Locationcode.value, location_name: locationname.value.trim(), created_by: createdById}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Location List Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'Location.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create Location.';
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
let original_location = null;

function editRecord(slid) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/scrapsalelocation/search`, baseUrl);
    var params = [['slid', slid]];
    url.search = new URLSearchParams(params).toString();

   fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.locationtrack) {
                // Populate form fields with the data from the response
                $('#locationnameeedit').val(response.locationtrack.location_name);
                $('#locationCodeedit').val(response.locationtrack.location_code);
                $('#locationeditid').val(response.locationtrack.slid);
				
				original_location = response.locationtrack.location_name;
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
    var username = document.getElementById('locationnameeedit').value.trim();
    var password = document.getElementById('locationCodeedit').value.trim();
   var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErroredit1QQQ').innerText = "Please Location Name.";
        document.getElementById('productCodeErroredit1QQQ').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErroredit1QQQ').innerText = "";
        document.getElementById('productCodeErroredit1QQQ').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErroredit2AAA').innerText = "Please Location Code.";
        document.getElementById('productCodeErroredit2AAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErroredit2AAA').innerText = "";
        document.getElementById('productCodeErroredit2AAA').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenterupdate').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}


function editEvent(){
	let current = document.getElementById('locationnameeedit').value.trim();
	
	if(current === original_location.trim()){
		const popup = $('<div class="popup">No Feilds Changes</div>')
		                   .appendTo('body').hide().fadeIn(400);

		               setTimeout(function() {
		                   popup.fadeOut(400, function() {
		                       $(this).remove();
		                       window.location = 'Location.jsp'; // Redirect to role list page
		                   });
		               }, 800);
		return;
	}
	else{
		editEventUpdate();
	}
	

}

function editEventUpdate() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/scrapsalelocation/update', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({location_code: locationCodeedit.value, location_name: locationnameeedit.value, modified_by: createdById,slid:locationeditid.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Location Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'Location.jsp'; // Redirect to role list page
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

async function fetchSaleOrderCode() {
    try {
        const url = new URL(`/jssl/scrapsalelocation/getScrapLocationCode`, baseUrl);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch Sale Order Code");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Sale_order_code) {
            console.warn("No Sale Order Code found.");
            return;
        }

        // Set the value of the input field with the Sale Order Code
        document.getElementById("Locationcode").value = json.Sale_order_code;

    } catch (error) {
        console.error("Error fetching Sale Order Code:", error);
    }
}
