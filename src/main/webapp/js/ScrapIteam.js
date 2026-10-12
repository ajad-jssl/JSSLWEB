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
    const url = new URL(`/jssl/scrapsalescrapitems/list`, baseUrl);
    //url.searchParams.append('factory_id', selectedFactoryId);  // Adding `factory_id` query parameter

    // Make API call to fetch data
   fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            let li = '<thead><tr><th>Item Code</th><th>Item Name</th><th>Type Name</th><th>Edit</th></tr></thead>';
            const arr = json.ListScrapSaleScrapItems;

            // Loop through each data and add a table row
            arr.forEach(item => {
                li += `
                    <tr id="${item.siid}">
                        <td>${item.scrapitemcode}</td>
                        <td>${item.scrapitemname}</td>
                        <td>${item.scrap_typename}</td>
                        <td><i class="fa fa-pen" onclick="editRecord(${item.siid})"></i></td>
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

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypes();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchSaleOrderTypes() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/scraptypes/list`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   //  Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Lists.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("saleOrderTypeAdd");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Sale Order Type</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Lists.forEach((type) => {
            if (type.stid && type.scrap_TypeName) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.stid; // Backend keeps saleorder_id
                option.textContent = type.scrap_TypeName; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypesupdate();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchSaleOrderTypesupdate() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/scraptypes/list`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Lists.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("shippingaddup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Sale Order Type</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Lists.forEach((type) => {
            if (type.stid && type.scrap_TypeName) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.stid; // Backend keeps saleorder_id
                option.textContent = type.scrap_TypeName; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

function openModalAdd() {
    var username = document.getElementById('saleOrderTypeAdd').value.trim();
    var password = document.getElementById('scrapType').value.trim();
    var code = document.getElementById('scrapItem').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditaa').innerText = "Please select Scrap Type.";
        document.getElementById('productCodeErrorcreditaa').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditaa').innerText = "";
        document.getElementById('productCodeErrorcreditaa').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErrorcreditQQ').innerText = "Please enter Scrap Item Code.";
        document.getElementById('productCodeErrorcreditQQ').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditQQ').innerText = "";
        document.getElementById('productCodeErrorcreditQQ').style.display = "none";
    }
    
    if (code === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please enter Scrap type Code.";
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
        url: new URL('/jssl/scrapsalescrapitems/add', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({scraptypecode: saleOrderTypeAdd.value, scrapitemcode: scrapType.value,scrapitemname:scrapItem.value.trim(),created_by: createdById}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Scrap Item List Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ScrapItem.jsp'; // Redirect to role list page
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


let orginal_scrap_type = {};


function editRecord(siid) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/scrapsalesrapitems/search`, baseUrl);
    var params = [['id', siid]];
    url.search = new URLSearchParams(params).toString();

  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.scrapsalescrapitems) {
                // Populate form fields with the data from the response
                $('#ScrapTypeCodeedit').val(response.scrapsalescrapitems.scrapitemname);
                $('#shippingaddup').val(response.scrapsalescrapitems.scraptypecode);
                $('#ScrapItemCodeedit').val(response.scrapsalescrapitems.scrapitemcode);
                $('#ScrapTypeCodeeditid').val(response.scrapsalescrapitems.siid);
				
				
				orginal_scrap_type = 
				{
				scrap_type_name:	response.scrapsalescrapitems.scrapitemname
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
    var username = document.getElementById('shippingaddup').value.trim();
    var password = document.getElementById('ScrapItemCodeedit').value.trim();
    var code = document.getElementById('ScrapTypeCodeedit').value.trim();
   var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErroredit1QQ').innerText = "Please select Scrap Type Name.";
        document.getElementById('productCodeErroredit1QQ').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErroredit1QQ').innerText = "";
        document.getElementById('productCodeErroredit1QQ').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErroredit2AA').innerText = "Please Scrap Item Code.";
        document.getElementById('productCodeErroredit2AA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErroredit2AA').innerText = "";
        document.getElementById('productCodeErroredit2AA').style.display = "none";
    }
    
    if (code === '') {
        document.getElementById('productCodeErroredit2SS').innerText = "Please Scrap Type Code.";
        document.getElementById('productCodeErroredit2SS').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErroredit2SS').innerText = "";
        document.getElementById('productCodeErroredit2SS').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenterupdate').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}





function editEvent(){
	let current = document.getElementById('ScrapTypeCodeedit').value.trim();
	if(current === orginal_scrap_type.scrap_type_name){
		const popup = $('<div class="popup">No Feilds Changes</div>')
		                   .appendTo('body').hide().fadeIn(400);

		               setTimeout(function() {
		                   popup.fadeOut(400, function() {
		                       $(this).remove();
		                       window.location = 'ScrapItem.jsp'; // Redirect to role list page
		                   });
		               }, 800);
		return ;
	}
	else{
		editEventUpdate();
	}
}

function editEventUpdate() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/scrapsalescrapitems/update', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({scraptypecode: shippingaddup.value, scrapitemcode: ScrapItemCodeedit.value,scrapitemname:ScrapTypeCodeedit.value.trim(), modified_by: createdById,siid:ScrapTypeCodeeditid.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Scrap Item List Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ScrapItem.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to Update  Scarp Item.';
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
        const url = new URL(`/jssl/scrapsalescrapitems/ScrapItemCode`, baseUrl);

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
