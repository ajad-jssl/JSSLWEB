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

// Fetch selectedFactoryId from sessionStorage
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


$(document).ready(function() {

    // Get today's date in YYYY-MM-DD format
    let today = new Date().toISOString().split('T')[0];

    // Apply it as min value for all required date fields
    $("#dateselect").attr("max", today);


    $("#dateselectUp").attr("max", today)



});

// Function to fetch the list of users/vendors based on the selected factory ID
async function fetchUserList() {
    try {

        // Construct the API URL
        const url = new URL(`/jssl/listopeningbalancenew`, baseUrl);
        /* url.searchParams.append('factory_id', selectedFactoryId);*/

        // Fetch vendor data
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        // Prepare table content
        let tableContent = `
            <thead>
                <tr>
                    <th class="text-center">Contract Code</th>
					<th class="text-center">Taxable Amount</th>
					<th class="text-center">Non-Taxable Amount</th>
					<th class="text-center" >Opening Balance</th>
					<th class="text-center" >Available Balance</th>
                   
                    <th class="text-center">Edit</th> 
                </tr>
            </thead>
            <tbody>
        `;

        json.Data.forEach(item => {
            tableContent += `
                <tr>
                 <td>${item.contract_name}</td>
				 <td class="text-center">${Number(item.tax_total).toFixed(2)}</td>
				 <td class="text-center">${Number(item.nontax_avl_bal).toFixed(2)}</td>
                 <td class="text-center">${Number(item.total).toFixed(2)}</td>
                 <td class="text-center">${Number(item.avl_bal).toFixed(2)}</td>
			   	 
                 <td><i class="fa fa-pen" onclick="editRecord('${item.pn_id}')"></i></td>
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

// get the factory_id
document.addEventListener("DOMContentLoaded", function() {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypes(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

// fetching the drop down list from sate
async function fetchSaleOrderTypes(factoryId) {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/listcontractorfromopeningbalancenew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("contractorcode");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Contractor</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.contract_id && type.contract_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.contract_id; // Backend keeps saleorder_id
                option.textContent = type.contract_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

// for validation please give 
function openModalAdd() {
    var username = document.getElementById('contractorcode').value.trim();
    var username11 = document.getElementById('taxname').value.trim();
    var state = document.getElementById('taxvalue').value.trim();
    var countryId = document.getElementById('taxvaluebal').value.trim();
    var statedesc = document.getElementById('taxvaluedesc').value.trim();
    var utr_no = document.getElementById("utrreference_no").value.trim();
    var proforma_no = document.getElementById("proformaref_no").value.trim();
    var select_date = document.getElementById("dateselect").value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcredit').innerText = "Please select Contract Code.";
        document.getElementById('productCodeErrorcredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit').innerText = "";
        document.getElementById('productCodeErrorcredit').style.display = "none";
    }

    if (statedesc === '') {
        document.getElementById('productCodeErrormiledesc1').innerText = "Please Enter Description.";
        document.getElementById('productCodeErrormiledesc1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrormiledesc1').innerText = "";
        document.getElementById('productCodeErrormiledesc1').style.display = "none";
    }

    if (utr_no === '') {
        document.getElementById('productCodeErrormileutr').innerText = "Please Enter UTR No";
        document.getElementById('productCodeErrormileutr').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrormileutr').innerText = "";
        document.getElementById('productCodeErrormileutr').style.display = "none";
    }

    if (proforma_no === '') {
        document.getElementById('productCodeErrormileprofroma').innerText = "Please Enter Proforma No";
        document.getElementById('productCodeErrormileprofroma').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrormileprofroma').innerText = "";
        document.getElementById('productCodeErrormileprofroma').style.display = "none";
    }
    if (select_date === '') {
        document.getElementById('productCodeErrormiledate').innerText = "please Enter the Date";
        document.getElementById('productCodeErrormiledate').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrormiledate').innerText = "";
        document.getElementById('productCodeErrormiledate').style.display = "none";
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
        url: new URL('/jssl/openingbalance/addnew', baseUrl), // Move 'const' to the correct place taxvaluedesc
        type: 'POST',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: jQuery.param({
            con_id: contractorcode.value, created_by: createdById, tax_total: taxname.value, net_total: taxvalue.value, total: taxvaluebal.value, description: taxvaluedesc.value, factory_id: selectedFactoryId, nontax_avl_bal: taxvalue.value,
            utr_reference: utrreference_no.value, proforma_reference: proformaref_no.value, txn_date: dateselect.value
        }),
        success: function(data) {
            var result = data.message; // No need to stringify

            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Opening Balance Master Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'openingbalence.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create Opening balance.';
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
    var countryCode = document.getElementById('countrycode1').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcreditss').innerText = "Please Enter State Id.";
        document.getElementById('productCodeErrorcreditss').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss').innerText = "";
        document.getElementById('productCodeErrorcreditss').style.display = "none";
    }
    if (username11 === '') {
        document.getElementById('productCodeErrorcreditss1').innerText = "Please Enter State Code.";
        document.getElementById('productCodeErrorcreditss1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss1').innerText = "";
        document.getElementById('productCodeErrorcreditss1').style.display = "none";
    }
    if (state === '') {
        document.getElementById('productCodeErrorcreditsedit').innerText = "Please Enter State Name.";
        document.getElementById('productCodeErrorcreditsedit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditsedit').innerText = "";
        document.getElementById('productCodeErrorcreditsedit').style.display = "none";
    }
    if (countryCode === '') {
        document.getElementById('productCodeErrorcreditcoun1').innerText = "Please Select Country.";
        document.getElementById('productCodeErrorcreditcoun1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditcoun1').innerText = "";
        document.getElementById('productCodeErrorcreditcoun1').style.display = "none";
    }
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenterupdate').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function editevent() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/state/updateStateNew', baseUrl), // Move 'const' to the correct place 		state_code, state_name, state_id, modified_by, factory_id, country_id, 							id
        type: 'POST',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: jQuery.param({ state_id: taxname1.value, modified_by: createdById, id: sateid.value, factory_id: selectedFactoryId, state_code: taxvalue1.value, state_name: stateedit.value, country_id: countrycode1.value }),
        success: function(data) {
            var result = data.message; // No need to stringify

            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">State Master Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'statemaster.jsp'; // Redirect to role list page
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
function editRecord(state_id) {
    // alert("ID: " + id);
    // Make an AJAX request to the API
    const url = new URL(`/jssl/state/getStatesByIdNew`, baseUrl);
    var params = [['state_id', state_id]];
    url.search = new URLSearchParams(params).toString();

    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            $('#stateedit').val(response.state_name);
            $('#taxvalue1').val(response.state_code);
            $('#countrycode1').val(response.country_id);
            $('#taxname1').val(response.state_id);
            $('#sateid').val(response.id);
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



let originalData = {};

async function editRecord(pn_id) {
    try {
			  const allowed = allowedActions || [];

		if (!allowed.includes("Edit")) {
		  alert(" You do not have permission to edit.");
		  return;
		}
        const url = new URL("/jssl/getOpeningBalanceByPnId", baseUrl);
        url.searchParams.append("pn_id", pn_id);

        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch record");

        const json = await response.json();
        const data = json.DATA;

        if (!data) {
            alert("No data found for this record!");
            return;
        }

        // Bind values to update modal inputs
        document.getElementById("contractorcode_update").value = data.contract_name || "";
        //  document.getElementById("taxvaluebal_update").value = data.total || "";
        document.getElementById("taxvaluedesc_update").value = data.avl_bal || "";
        document.getElementById("taxname_update").value = data.tax_total || "";
        document.getElementById("taxvalue_update").value = data.nontax_avl_bal || "";
        document.getElementById("contract_id_toUpdate").value = data.contract_id || "";
        document.getElementById("utrreferenceUp_no").value = data.utr_reference || "";
        document.getElementById("proformarefUp_no").value = data.proforma_reference || "";
        document.getElementById("dateselectUp").value = data.txn_date || "";
        document.getElementById("taxvaluedescUp").value = data.description || "";


        originalData = {
            orginaltax_amount: data.tax_total,
            originalnontax_amount: data.nontax_avl_bal,
            originalutrref: data.utr_reference,
            originalproformarref: data.proforma_reference,
            originaldateSelect: data.txn_date,
            originaldescription: data.description
        }
        await checkTaxTypeUpdate();
        // Save pn_id globally for update
        window.selectedPnId = pn_id;
        window.selectedSlno = data.slno;

        // Open update modal
        $("#exampleModalScrollableupdate").modal("show");

    } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong!");
    }
}

function openConfirmModal() {
    var tax_amount = document.getElementById('taxname_update').value.trim();
    var non_tax_amount = document.getElementById('taxvalue_update').value.trim();
    var utr_ref_no = document.getElementById('utrreferenceUp_no').value.trim();
    var proforma_no = document.getElementById('proformarefUp_no').value.trim();
    var selected_date = document.getElementById('dateselectUp').value.trim();
    var description = document.getElementById('taxvaluedescUp').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (tax_amount === '') {
        document.getElementById('productCodeErrorcreditAAUpdate').innerText = "Please Enter Taxable Amount";
        document.getElementById('productCodeErrorcreditAAUpdate').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAAUpdate').innerText = "";
        document.getElementById('productCodeErrorcreditAAUpdate').style.display = "none";
    }

    if (non_tax_amount === '') {
        document.getElementById('productCodeErrorcreditAANonUpdate').innerText = "Please Enter Non Taxable Amount";
        document.getElementById('productCodeErrorcreditAANonUpdate').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditAANonUpdate').innerText = "";
        document.getElementById('productCodeErrorcreditAANonUpdate').style.display = "none";
    }



    if (utr_ref_no === '') {
        document.getElementById('productCodeErrormileutrUp').innerText = "Please Enter UTR No";
        document.getElementById('productCodeErrormileutrUp').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrormileutrUp').innerText = "";
        document.getElementById('productCodeErrormileutrUp').style.display = "none";
    }
    if (proforma_no === '') {
        document.getElementById('productCodeErrormileprofromaUp').innerText = "Please Enter State Name.";
        document.getElementById('productCodeErrormileprofromaUp').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrormileprofromaUp').innerText = "";
        document.getElementById('productCodeErrormileprofromaUp').style.display = "none";
    }
    if (selected_date === '') {
        document.getElementById('productCodeErrormiledateUP').innerText = "Please Enter Date";
        document.getElementById('productCodeErrormiledateUP').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrormiledateUP').innerText = "";
        document.getElementById('productCodeErrormiledateUP').style.display = "none";
    }

    if (description === '') {
        document.getElementById('productCodeErrormiledesc1Up').innerText = "Please Enter Description";
        document.getElementById('productCodeErrormiledesc1Up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrormiledesc1Up').innerText = "";
        document.getElementById('productCodeErrormiledesc1Up').style.display = "none";
    }
    // If no errors, proceed
    if (!showError) {
        $("#exampleModalCenterDup").modal("show"); // Show the next modal (Ensure this modal exists)
    }



}

/*document.getElementById("taxvaluebal_update").addEventListener("input", function() {


    const total = Number(document.getElementById("taxvaluebal_update").value) || 0;

    const avlBalInput = document.getElementById("taxvaluedesc_update");

    // Available balance = total − entered tax value
    avlBalInput.value = total;
});*/



function hasChanges() {

    const current = {
        tax: parseFloat(document.getElementById("taxname_update").value.trim() || 0),
        nontax: parseFloat(document.getElementById("taxvalue_update").value.trim() || 0),
        utr: document.getElementById("utrreferenceUp_no").value.trim(),
        proforma: document.getElementById("proformarefUp_no").value.trim(),
        date: document.getElementById("dateselectUp").value.trim(),
        description: document.getElementById("taxvaluedescUp").value.trim()
    };

    return !(
        current.tax == originalData.orginaltax_amount &&
        current.nontax == originalData.originalnontax_amount &&
        current.utr == (originalData.originalutrref || "") &&
        current.proforma == (originalData.originalproformarref || "") &&
        current.date == (originalData.originaldateSelect || "") &&
        current.description == (originalData.originaldescription || "")
    );
}

async function updateOpeningBalance() {
    $("#exampleModalCenterDup").modal("hide");

    const pn_id = window.selectedPnId;
    if (!pn_id) {
        alert("PN ID is missing!");
        return;
    }

    if (!hasChanges()) {
        const popup = $('<div class="popup">No Feild Changes </div>')
            .appendTo('body').hide().fadeIn(400);

        setTimeout(function() {
            popup.fadeOut(400, function() {
                $(this).remove();
                window.location = 'openingbalence.jsp';
            });
        }, 800);

        $("#exampleModalCenterDup").modal("hide");
        $("#exampleModalScrollableupdate").modal("hide");
        return;
    }

    var totalField = document.getElementById("taxvaluebal_update");
    var total = totalField ? parseFloat(totalField.value || 0) : 0;
    var tax_total = parseFloat(document.getElementById("taxname_update").value.trim());
    var nontax_avl_bal = parseFloat(document.getElementById("taxvalue_update").value.trim());
    var avl_bal = parseFloat(document.getElementById("taxvaluedesc_update").value.trim());

    const utr_ref_UP = document.getElementById("utrreferenceUp_no").value.trim();
    const proforma = document.getElementById("proformarefUp_no").value.trim();
    const selected_date_up = document.getElementById("dateselectUp").value.trim();
    const description_up = document.getElementById("taxvaluedescUp").value.trim();

    total = avl_bal;



    const factory_id = selectedFactoryId;
    const modified_by = createdById;

    const contract_id = document.getElementById("contract_id_toUpdate").value.trim(); // ⭐ REQUIRED

    const url = new URL("/jssl/openingbalance/updateItem", baseUrl);

    const formData = new FormData();
    formData.append("pn_id", pn_id);
    formData.append("total", total);
    formData.append("tax_total", tax_total);
    formData.append("nontax_avl_bal", nontax_avl_bal);
    formData.append("avl_bal", avl_bal);
    formData.append("factory_id", factory_id);
    formData.append("modified_by", modified_by);
    formData.append("contract_name", contract_id);

    formData.append("utr_reference", utr_ref_UP);
    formData.append("proforma_reference", proforma);
    formData.append("txn_date", selected_date_up);
    formData.append("description", description_up);
    // ⭐ FIX ADDED

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
            credentials: "include"
        });

        const result = await response.json();
        console.log("API Response:", result);

        if (result.status === "yes") {

            const popup = $('<div class="popup">Opening balance updated successfully!</div>')
                .appendTo('body').hide().fadeIn(400);

            setTimeout(function() {
                popup.fadeOut(400, function() {
                    $(this).remove();
                    window.location = 'openingbalence.jsp';
                });
            }, 800);

            $("#exampleModalCenterDup").modal("hide");
            $("#exampleModalScrollableupdate").modal("hide");

        }
        else if (result.status === "No") {

            //alert(result.message);
            $('#errorMessageup').text(result.message || ' update failed.');
            $('#exampleModalCenterDupUP').modal('show');


        }
        else {

            alert("Update failed: " + result.message);
        }

    } catch (error) {
        console.error("Update error:", error);
        alert("Something went wrong while updating!");
    }
}



/*async function checkTaxType() {
    const contractId = document.getElementById("contractorcode").value.trim();

    if (!contractId) {
        console.warn("Contract ID not selected");
        return;
    }

    const url = new URL("/jssl/checkTaxType", baseUrl);
    url.searchParams.append("contract_name", contractId);

    try {
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        const json = await response.json();

        if (json.status === "yes") {
            document.getElementById("taxname").value = json.taxable=== "Yes" ?"": 0;       // taxable amount
            document.getElementById("taxvalue").value = json.non_taxable==="Yes" ?"": 0; // non-taxable amount
        } else {
            console.error("Contract not found");
        }

    } catch (error) {
        console.error("Error checking tax type:", error);
    }
}
*/

/*async function loadAvailableContracts() {
    const url = new URL("/jssl/openingbalance/availableContracts", baseUrl);

    try {
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const contracts = await response.json();

        const dropdown = document.getElementById("contractorcode");
        dropdown.innerHTML = "<option value=''> Select Contract </option>";

        contracts.forEach(contract => {
            const option = document.createElement("option");
            option.value = contract.contract_id;
            option.text = contract.contract_name;
            dropdown.appendChild(option);
        });

        if (contracts.length === 0) {
            dropdown.disabled = true;
            alert("All contracts already have opening balances.");
        }

    } catch (error) {
        console.error("Error loading available contracts:", error);
    }
}

// Call on page load
window.addEventListener("DOMContentLoaded", loadAvailableContracts);*/



let taxType = null;


async function checkTaxType() {
    const contractId = document.getElementById("contractorcode").value.trim();
    if (!contractId) return;

    document.getElementById("taxvaluebal").value = "";



    const url = new URL("/jssl/checkTaxType", baseUrl);
    url.searchParams.append("contract_name", contractId);

    const response = await fetch(url, {
        method: "GET",
        credentials: "include"
    });

    const json = await response.json();

    if (json.status === "yes") {
        taxType = json; // store result
        applyTaxSplit(); // apply immediately
    }
}


/*function applyTaxSplit() {
    const opening = document.getElementById("taxvaluebal").value || 0;

    if (!taxType) return;

    if (taxType.taxable === "Yes") {
        document.getElementById("taxname").value = opening;
        document.getElementById("taxvalue").value = 0;
    	
    	
    	
    	
    }
    else if (taxType.non_taxable === "Yes") {
        document.getElementById("taxvalue").value = opening;
        document.getElementById("taxname").value = 0;
    }
}
*/



/*function applyTaxSplit() {
    const opening = document.getElementById("taxvaluebal").value || 0;

    const taxableField = document.getElementById("taxname");
    const nonTaxableField = document.getElementById("taxvalue");


    if (!taxType) return;

    if (taxType.taxable === "Yes") {

        taxableField.value = opening;
        nonTaxableField.value = 0;

        // control editing
        taxableField.readOnly = false;
        nonTaxableField.readOnly = true;

    } else if (taxType.non_taxable === "Yes") {

        nonTaxableField.value = opening;
        taxableField.value = 0;

        // control editing
        nonTaxableField.readOnly = false;
        taxableField.readOnly = true;
    }
}*/

function applyTaxSplit() {

    const taxableField = document.getElementById("taxname");
    const nonTaxableField = document.getElementById("taxvalue");

    if (!taxType) return;

    if (taxType.taxable === "Yes") {
        taxableField.readOnly = false;
        nonTaxableField.readOnly = true;
        taxableField.value = 0;
        nonTaxableField.value = 0;
    } else if (taxType.non_taxable === "Yes") {
        nonTaxableField.readOnly = false;
        taxableField.readOnly = true;
        taxableField.value = 0;
    }

    syncOpeningBalance(); // refresh total
}


function syncOpeningBalance() {

    const taxable = parseFloat(document.getElementById("taxname").value) || 0;
    const nonTaxable = parseFloat(document.getElementById("taxvalue").value) || 0;

    document.getElementById("taxvaluebal").value = taxable + nonTaxable;
}




document.getElementById("taxname").addEventListener("input", syncOpeningBalance);
document.getElementById("taxvalue").addEventListener("input", syncOpeningBalance);



let taxTypeUpdate = null;

async function checkTaxTypeUpdate() {
    const contractId = document.getElementById("contract_id_toUpdate").value.trim();
    if (!contractId) return;

    document.getElementById("taxvaluedesc_update").value = "";

    const url = new URL("/jssl/checkTaxType", baseUrl);
    url.searchParams.append("contract_name", contractId);

    const response = await fetch(url, {
        method: "GET",
        credentials: "include"
    });

    const json = await response.json();

    if (json.status === "yes") {
        taxTypeUpdate = json;
        applyTaxSplitUpdate();
    }
}

function applyTaxSplitUpdate() {

    const taxableField = document.getElementById("taxname_update");
    const nonTaxableField = document.getElementById("taxvalue_update");

    if (!taxTypeUpdate) return;

    if (taxTypeUpdate.taxable === "Yes") {
        taxableField.readOnly = false;
        nonTaxableField.readOnly = true;


    } else if (taxTypeUpdate.non_taxable === "Yes") {
        nonTaxableField.readOnly = false;
        taxableField.readOnly = true;

    }

    syncOpeningBalanceUpdate();
}
function syncOpeningBalanceUpdate() {

    const taxable = parseFloat(document.getElementById("taxname_update").value) || 0;
    const nonTaxable = parseFloat(document.getElementById("taxvalue_update").value) || 0;

    document.getElementById("taxvaluedesc_update").value = taxable + nonTaxable;
}

document.getElementById("taxname_update")
    .addEventListener("input", syncOpeningBalanceUpdate);

document.getElementById("taxvalue_update")
    .addEventListener("input", syncOpeningBalanceUpdate);

