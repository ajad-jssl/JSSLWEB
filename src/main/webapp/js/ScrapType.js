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
	  $('#exampleModalScrollableAddType').modal('hide');
	  return;
	}
	$('#exampleModalScrollableAddType').modal('show');
});

const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

document.addEventListener("DOMContentLoaded", function () {
	loadActions();
});
// Ensure the ID is available before making the API call
if (selectedFactoryId) {
    fetchUserList();
} else {
    console.error('No factory ID found in sessionStorage.');
}

function fetchUserList() {
	fetchSaleOrderCode();
    // Create the URL and pass `selectedFactoryId` as a query parameter
    const url = new URL(`/jssl/salesordertype/list`, baseUrl);
    //url.searchParams.append('factory_id', selectedFactoryId);  // Adding `factory_id` query parameter

    // Make API call to fetch data
  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            let li = '<thead><tr><th>Type Code</th><th>Type Name</th><th>Edit</th></tr></thead>';
            const arr = json.SalesOrderTypeDetails;

            // Loop through each data and add a table row
            arr.forEach(item => {
                li += `
                    <tr id="${item.saleorder_id}">
                        <td>${item.saleorder_typecode}</td>
                        <td>${item.saleorder_typename}</td>
                        <td><i class="fa fa-pen" onclick="editRecord(${item.saleorder_id})"></i></td>
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
    var username = document.getElementById('scrapname').value.trim();
    var password = document.getElementById('scrapType').value.trim();
   var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcredit').innerText = "Please enter Scrap order Type Name.";
        document.getElementById('productCodeErrorcredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit').innerText = "";
        document.getElementById('productCodeErrorcredit').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErrorcredittyu').innerText = "Please enter Scrap order Type Code.";
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
        url: new URL('/jssl/salesordertype/add', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({saleorder_typecode: scrapType.value, saleorder_typename: scrapname.value, created_by: createdById}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Scrap order Type List Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ScrapType.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                 const errorMessage = data.message || 'Failed to ScarpOrder ';
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


let orginal_scrap_type = null;

function editRecord(saleorder_id) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/salesordertype/search`, baseUrl);
    var params = [['saleorder_id', saleorder_id]];
    url.search = new URLSearchParams(params).toString();

  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.SalesOrderTypeInfo) {
                // Populate form fields with the data from the response
                $('#Scraptypnameeedit').val(response.SalesOrderTypeInfo.saleorder_typename);
                $('#ScrapTypeCodeedit').val(response.SalesOrderTypeInfo.saleorder_typecode);
                $('#ScrapTypeCodeeditid').val(response.SalesOrderTypeInfo.saleorder_id);
				
				
				orginal_scrap_type = response.SalesOrderTypeInfo.saleorder_typename;
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
    var username = document.getElementById('Scraptypnameeedit').value.trim();
    var password = document.getElementById('ScrapTypeCodeedit').value.trim();
   var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErroredit2edit').innerText = "Please enter Scrap order Type Name.";
        document.getElementById('productCodeErroredit2edit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErroredit2edit').innerText = "";
        document.getElementById('productCodeErroredit2edit').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErroredit2edit1').innerText = "Please enter Scrap order Type Code.";
        document.getElementById('productCodeErroredit2edit1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErroredit2edit1').innerText = "";
        document.getElementById('productCodeErroredit2edit1').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenterupdate').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}



function editEvent(){
	$('#exampleModalCenterupdate').modal('hide');
let current = 	$('#Scraptypnameeedit').val().trim();

if(current === orginal_scrap_type){
	const popup = $('<div class="popup">No Feilds Changes</div>')
	                    .appendTo('body').hide().fadeIn(400);

	                setTimeout(function() {
	                    popup.fadeOut(400, function() {
	                        $(this).remove();
	                        window.location = 'ScrapType.jsp'; // Redirect to role list page
	                    });
	                }, 800);
					return;
}
else{
	editEventUpdated();
}
}


function editEventUpdated() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/salesordertype/update', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({saleorder_typecode: ScrapTypeCodeedit.value, saleorder_typename: Scraptypnameeedit.value, modified_by: createdById,saleorder_id:ScrapTypeCodeeditid.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Scrap order Type List Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ScrapType.jsp'; // Redirect to role list page
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
        const url = new URL(`/jssl/salesordertype/getSaleOrderTypeCode`, baseUrl);

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
        document.getElementById("scrapType").value = json.Sale_order_code;

    } catch (error) {
        console.error("Error fetching Sale Order Code:", error);
    }
}
