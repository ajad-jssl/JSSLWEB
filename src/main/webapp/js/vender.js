// Fetch selectedFactoryId from localStorage
const selectedFactoryId = localStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

// Ensure the ID is available before making the API call
if (selectedFactoryId) {
    fetchUserList();
} else {
    console.error('No factory ID found in localStorage.');
}


async function fetchUserList() {
    try {
        
        // Construct the API URL
         const url = new URL(`/jssl/master/listvendorforscrapmaster`, baseUrl);
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
                    <th>Vendor Name</th>
                    <th>Vendor City</th>
                    <th>Vendor Description</th>
                    <th>Edit</th>
                 </tr>
            </thead>
            <tbody>
        `;

        json.Data.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.vendor_name}</td>
                    <td>${item.vendor_city}</td>
                    <td>${item.vendor_desc}</td>
                    <td><i class="fa fa-pen" onclick="editRecord('${item.ven_id}')"></i></td>
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
            info: false,
            paging: false,
            destroy: true, // Prevent duplication
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

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypes();
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

async function fetchSaleOrderTypes() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/state/getAllStatesNew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.StateDetailsNew.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("stateDropdown");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select state</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.StateDetailsNew.forEach((type) => {
            if (type.id && type.state_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.state_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypesedit();
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

async function fetchSaleOrderTypesedit() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/state/getAllStatesNew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.StateDetailsNew.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("stateDropdown11");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select state</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.StateDetailsNew.forEach((type) => {
            if (type.id && type.state_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.state_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

function openModalAdd() {
    var username = document.getElementById('stateGstNo').value.trim();
    var password = document.getElementById('sapBuCode').value.trim();
    var code = document.getElementById('stateCode').value.trim();
    var state = document.getElementById('stateDropdown').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditAA').innerText = "Please Vendor Name.";
        document.getElementById('productCodeErrorcreditAA').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAA').innerText = "";
        document.getElementById('productCodeErrorcreditAA').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErrorcreditSS').innerText = "Please Vendor Description.";
        document.getElementById('productCodeErrorcreditSS').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditSS').innerText = "";
        document.getElementById('productCodeErrorcreditSS').style.display = "none";
    }
    
    if (code === '') {
        document.getElementById('productCodeErrorcreditQQ').innerText = "Please Vendor City.";
        document.getElementById('productCodeErrorcreditQQ').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditQQ').innerText = "";
        document.getElementById('productCodeErrorcreditQQ').style.display = "none";
    }
    
    if (state === '') {
        document.getElementById('productCodeErrorcreditQQSS').innerText = "Please select state.";
        document.getElementById('productCodeErrorcreditQQSS').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditQQSS').innerText = "";
        document.getElementById('productCodeErrorcreditQQSS').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addevent() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/master/addvendorforscrapmaster', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({vendor_name: stateGstNo.value, vendor_city: stateCode.value,vendor_desc:sapBuCode.value,vendor_state_id:stateDropdown.value,created_by: createdById}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Vendor Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'vender.jsp'; // Redirect to role list page
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

function editRecord(ven_id) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
    const url = new URL(`/jssl/master/searchvendorforscrapmaster`, baseUrl);
    var params = [['ven_id', ven_id]];
    url.search = new URLSearchParams(params).toString();

  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.data) {
                // Populate form fields with the data from the response
                $('#vexampleage').val(response.data.vendor_name);
                $('#vconper').val(response.data.vendor_city);
                $('#vagename').val(response.data.vendor_desc);
                $('#stateDropdown11').val(response.data.vendor_state_id);
                $('#vagid').val(response.data.ven_id);
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
    var username = document.getElementById('vexampleage').value.trim();
    var password = document.getElementById('vagename').value.trim();
    var code = document.getElementById('vconper').value.trim();
    var state = document.getElementById('stateDropdown11').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErroredit1xx').innerText = "Please Vendor Name.";
        document.getElementById('productCodeErroredit1xx').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErroredit1xx').innerText = "";
        document.getElementById('productCodeErroredit1xx').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErroredit2xx').innerText = "Please Vendor Description.";
        document.getElementById('productCodeErroredit2xx').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErroredit2xx').innerText = "";
        document.getElementById('productCodeErroredit2xx').style.display = "none";
    }
    
    if (code === '') {
        document.getElementById('productCodeErroredit3xx').innerText = "Please Vendor City.";
        document.getElementById('productCodeErroredit3xx').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErroredit3xx').innerText = "";
        document.getElementById('productCodeErroredit3xx').style.display = "none";
    }
    
    if (state === '') {
        document.getElementById('productCodeErrorcreditQQSSxx').innerText = "Please select state.";
        document.getElementById('productCodeErrorcreditQQSSxx').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditQQSSxx').innerText = "";
        document.getElementById('productCodeErrorcreditQQSSxx').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenterupdateaaa').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function editEvent() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/master/updatevendorforscrapmaster', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({vendor_name: vexampleage.value, vendor_state_id: stateDropdown11.value,vendor_city:vconper.value,vendor_desc:vagename.value, modified_by: createdById,ven_id:vagid.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Vendor Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'vender.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create country.';
                $('#errorMessageup').text(errorMessage); // Set the error message dynamically
                $('#exampleModalCenterDupUP').modal('show'); // Show the modal with the error message
                $('#exampleModalCenterupdateaaa').modal('hide'); 
            }
        },
        error: function() {
            // Handle AJAX error
            console.error('Request failed.');
        }
    });
}