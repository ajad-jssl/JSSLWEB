

let allowed = null;
function hideError(el) { el.innerText = ""; el.style.display = "none"; }

// UOM / Type dropdowns (native change + Select2's own event)
$(document).on('change select2:select', '.dynamic-row select', function () {
    if (String($(this).val() || '').trim() !== '') {
        $(this).closest('[class*="col-"]').find('.uom-error, .type-error').each(function () { hideError(this); });
    }
});

// Qty / Kg / Unit Price / Pieces
$(document).on('input change', '.dynamic-row input[type="number"]', function () {
    const v = this.value.trim();
    if (v !== '' && !isNaN(v) && parseFloat(v) > 0) {
        $(this).closest('[class*="col-"]').find('[class$="-error"]').each(function () { hideError(this); });
    }
});

// File inputs
$(document).on('change', '#file',     function () { if (this.value) hideError(document.getElementById('fileerror')); });
$(document).on('change', '#fileedit', function () { if (this.value) hideError(document.getElementById('fileediterror')); });

// Reset messages when a modal closes
$('#exampleModalScrollable123, #exampleModalScrollable123update').on('hidden.bs.modal', function () {
    $(this).find('[class$="-error"], .error-message').hide().text('');
});

document.getElementById("modalScroll1").addEventListener("click", function () {
    // show custom message instead of opening modal
	 // const allowed = window.allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}
	$('#exampleModalScrollable123').modal('show');
});

function loadAllowedActions() {
    // Get current JSP page name dynamically
    const rawPageName = window.location.pathname.split("/").pop();

    const pageName = rawPageName.endsWith(".jsp")
        ? rawPageName
        : rawPageName + ".jsp";

    // Get userId from sessionStorage
    const userId = sessionStorage.getItem("user_id");

    if (!userId) {
        console.warn("User ID not found in sessionStorage");
        return;
    }

    // Build URL with baseUrl
    const url = new URL(`/api/user-tab-actions-by-page`, baseUrl);
    url.searchParams.append("userId", userId);
    url.searchParams.append("pageName", pageName);

    // API call
    fetch(url, {
        method: "GET",
        credentials: "include" // ✅ Important for session
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch allowed actions");
            }
            return res.json();
        })
        .then(actions => {
            console.log("Allowed Actions:", actions);

            // Store globally
           allowed = actions || [];
        })
        .catch(err => {
            console.error("Error fetching actions:", err);
           allowed = []; // fallback
        });
}

let rowCount = 0; // Counter to keep track of dynamic row IDs

document.addEventListener("DOMContentLoaded", function () {
	loadAllowedActions();
    // First, check if there's already an initial row
    addRow(); // Initially add a row
    // Populate the dropdowns for the first row
    fetchuom(1);
    fetctype(1);
    fetchUserList(selectedFactoryId);
});

// Function to add a new row
function addRow() {
    const container = document.getElementById("dynamicRowsContainer");
    rowCount++;

    const row = document.createElement("div");
    row.classList.add("form-row", "dynamic-row", "mb-2");
    row.setAttribute("data-row-id", rowCount);

    row.innerHTML = `
        <!-- UOM -->
        <div class="col-md-2">
            <select class="form-control form-control-sm" id="uom-${rowCount}"></select>
            <div class="uom-error" style="color:red; display:none;"></div>
        </div>

        <!-- Type -->
        <div class="col-md-2">
            <select class="form-control form-control-sm" id="type-${rowCount}"></select>
            <div class="type-error" style="color:red; display:none;"></div>
        </div>

        <!-- Quantity -->
        <div class="col-md-2">
            <input type="number" class="form-control form-control-sm text-right"
                   id="qty-${rowCount}" placeholder="Quantity" autocomplete="off" onkeydown="return allowOnlyPositive(event)"
                   oninput="calculateTotal(${rowCount})" min="0">
            <div class="qty-error" style="color:red; display:none;"></div>
        </div>

        <!-- Kg -->
        <div class="col-md-1">
		<input type="number" class="form-control form-control-sm text-right"
		       id="kg-${rowCount}" placeholder="Quantity" onkeydown="return allowOnlyPositive(event)"
		       oninput="calculateTotal(${rowCount})" min="0" step="0.01">
            <div class="kg-error" style="color:red; display:none;"></div>
        </div>

        <!-- Unit Price -->
        <div class="col-md-2">
            <input type="number" class="form-control form-control-sm text-right"
                   id="uniprice-${rowCount}" placeholder="Unit Price" onkeydown="return allowOnlyPositive(event)"
                   oninput="calculateTotal(${rowCount})" min="0">
            <div class="unitprice-error" style="color:red; display:none;"></div>
        </div>

        <!-- Pieces -->
        <div class="col-md-1">
            <input type="number" class="form-control form-control-sm text-right"
                   id="pice-${rowCount}" placeholder="Pieces" onkeydown="return allowOnlyPositive(event)" min="0">
            <div class="pieces-error" style="color:red; display:none;"></div>
        </div>

        <!-- Total -->
        <div class="col-md-1">
            <input type="text" class="form-control form-control-sm"
                   id="total-${rowCount}" readonly>
        </div>

        <!-- Action -->
        <div class="col-md-1 text-center">
            <i class="bi bi-trash text-danger"
               style="cursor:pointer; font-size:16px;"
               onclick="removeRow(${rowCount})"
               title="Delete"></i>
        </div>
    `;

    container.appendChild(row);

    // Populate dropdowns
    fetchuom(rowCount);
    fetctype(rowCount);

    // Update grand total
    calculateGrandTotal();
}


// Function to calculate the total for a specific row
function calculateTotal(rowId) {
	const uomSelect = document.getElementById(`uom-${rowId}`);
	   const selectedText = uomSelect.options[uomSelect.selectedIndex].text.trim();
	   let quantity = 0;
	   if (selectedText === "NOS" || selectedText=== "SQ MTS") {
	           // Use qty field when UOM is NOS
	           quantity = parseFloat(document.getElementById(`qty-${rowId}`).value) || 0;
	       } else {
	           // Use kg field for other UOMs
	           quantity = parseFloat(document.getElementById(`kg-${rowId}`).value) || 0;
	       }
    const kg = parseFloat(document.getElementById(`kg-${rowId}`).value) || 0;
    const unitPrice = parseFloat(document.getElementById(`uniprice-${rowId}`).value) || 0;

    // Calculate the total
	const total = quantity * unitPrice;
 /*   const total = kg * unitPrice;*/

    // Set the total value for the row
    document.getElementById(`total-${rowId}`).value = total.toFixed(2);

    // Call the function to update grand total after each calculation
    calculateGrandTotal();
}

// Function to calculate the grand total of all rows
function calculateGrandTotal() {
    let grandTotal = 0;

    // Loop through all the rows and sum up their total values
    const totals = document.querySelectorAll("[id^='total-']");
    totals.forEach(totalInput => {
        grandTotal += parseFloat(totalInput.value) || 0;
    });

    // Set the grand total in the static input field
    document.getElementById("totalNo").value = grandTotal.toFixed(2);
}

// Function to remove a row
function removeRow(rowId) {
    const container = document.getElementById("dynamicRowsContainer");
    const row = document.querySelector(`[data-row-id="${rowId}"]`);
    
    // Check if there is more than one row
    if (container.children.length > 1) {
        row.remove();  // Remove the row
        // Call the function to update grand total after removing a row
    calculateGrandTotal();
    } else {
        alert("At least one row should be present!");  // Show alert if only one row is present
    }
}

// Fetch UOM data and populate the UOM dropdown for a specific row
async function fetchuom(rowId) {
    try {
        const selectedFactoryId = sessionStorage.getItem("selectedFactoryId");
        if (!selectedFactoryId) {
            console.error("No factory ID found in sessionStorage.");
            return;
        }

        // Construct the API URL properly
        const url = new URL(`/jssl/master/listunitmeasurementmasternew`, baseUrl);
      //  url.searchParams.append("factory_id", selectedFactoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch UOM data");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No UOM data found.");
            return;
        }

        // Get the select element for UOM in the specific row
        const uomSelect = document.getElementById(`uom-${rowId}`);

        // Clear existing options and add a default "Select" option
        uomSelect.innerHTML = `<option value="">Select Uom</option>`;

        // Populate UOM dropdown options
        json.Data.forEach((type) => {
            if (type.unit_id && type.unit_name) {
                const option = document.createElement("option");
                option.value = type.unit_id;
                option.textContent = type.unit_name;
                uomSelect.appendChild(option);
            }
        });
		initSelect2(`uom-${rowId}`, 'exampleModalScrollable123', 'Select Uom');
    } catch (error) {
        console.error("Error fetching UOM data:", error);
    }
}

// Fetch Type data and populate the Type dropdown for a specific row
async function fetctype(rowId) {
    try {
        const selectedFactoryId = sessionStorage.getItem("selectedFactoryId");
        if (!selectedFactoryId) {
            console.error("No factory ID found in sessionStorage.");
            return;
        }

        // Construct the API URL properly
        const url = new URL(`/jssl/qspackingmasterscraptype/listnew`, baseUrl);
        url.searchParams.append("factory_id", selectedFactoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch Type data");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.SCRAPTYPELIST.length) {
            console.warn("No Type data found.");
            return;
        }

        // Get the select element for Type in the specific row
        const typeSelect = document.getElementById(`type-${rowId}`);

        // Clear existing options and add a default "Select" option
        typeSelect.innerHTML = `<option value="">Select Type</option>`;

        // Populate Type dropdown options
        json.SCRAPTYPELIST.forEach((type) => {
            if (type.type_id && type.scrap_Name) {
                const option = document.createElement("option");
                option.value = type.type_id;
                option.textContent = type.scrap_Name;
                typeSelect.appendChild(option);
            }
        });
		initSelect2(`type-${rowId}`, 'exampleModalScrollable123', 'Select Type'); 
    } catch (error) {
        console.error("Error fetching Type data:", error);
    }
}

    
// Get the factory_id
document.addEventListener("DOMContentLoaded", function() {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchcont(selectedFactoryId);  // Fetch contractors initially
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

// Fetching the dropdown list for contractors
/*async function fetchcont(factoryId) {
    try {
        // Construct the API URL properly
        const url = new URL(`/jssl/getlistassignedmilestonetocontractors`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch contractors");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.DATA.length) {
            console.warn("No contractors found.");
            return;
        }

        // Get the select element for contractors
        const selectElement = document.getElementById("cont");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select contractor</option>`;

        // Populate dropdown options using contractor data
        json.DATA.forEach((contractor) => {
            if (contractor.contract_id && contractor.contract_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = contractor.contract_id;
                option.textContent = contractor.contract_name;
                selectElement.appendChild(option);
            }
        });

        // Add event listener for contractor selection change
        selectElement.addEventListener("change", function() {
            const selectedContractId = selectElement.value;
            if (selectedContractId) {
                fetchmile(factoryId, selectedContractId);  // Fetch milestones based on selected factory_id and contract_id
            } else {
                // If no contractor is selected, clear the milestone dropdown
                const mileSelect = document.getElementById("mile");
                mileSelect.innerHTML = `<option value="">Select milestone</option>`;
            }
        });

    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

// Fetching the dropdown list for milestones
async function fetchmile(factoryId, contractId) {
    try {
        // Construct the API URL properly
        const url = new URL(`/jssl/listassignmilestoneforcontractornew`, baseUrl);
        url.searchParams.append("factory_id", factoryId); // Append factory_id
        url.searchParams.append("contract_id", contractId); // Append contract_id

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch milestones");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.DATA.length) {
            console.warn("No milestones found.");
            return;
        }

        // Get the select element for milestones
        const selectElement = document.getElementById("mile");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select milestone</option>`;

        // Populate dropdown options using milestone data
        json.DATA.forEach((milestone) => {
            if (milestone.milestone_id) { // Ensure the milestone name exists
                const option = document.createElement("option");
                option.value = milestone.milestone_id;
                option.textContent = milestone.milestone_name;
                selectElement.appendChild(option);
            }
        });

        // Add event listener for milestone selection change
        selectElement.addEventListener("change", function() {
            const selectedContractId = document.getElementById("cont").value; // Get selected contractor
            const selectedMilestoneName = selectElement.value; // Get selected milestone
            if (selectedContractId && selectedMilestoneName) {
                fetchLoad(factoryId, selectedContractId, selectedMilestoneName);  // Fetch loads based on selected factory_id, contract_id, and milestone_name
            } else {
                // If no contract or milestone is selected, clear the load dropdown
                const loadSelect = document.getElementById("mile");
                loadSelect.innerHTML = `<option value="">Select load</option>`;
            }
        });

    } catch (error) {
        console.error("Error fetching milestones:", error);
    }
}*/





async function fetchcont(factoryId) {
    try {
        const url = new URL(`/jssl/getlistassignedmilestonetocontractors`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch contractors");
        const json = await response.json();

        const selectElement = document.getElementById("cont");
        selectElement.innerHTML = `<option value="">Select contractor</option>`;

        if (json.status === "yes" && json.DATA.length) {
            json.DATA.forEach((contractor) => {
                if (contractor.contract_id && contractor.contract_name) {
                    const option = document.createElement("option");
                    option.value = contractor.contract_id;
                    option.textContent = contractor.contract_name;
                    selectElement.appendChild(option);
                }
            });
        }

        initSelect2('cont', 'exampleModalScrollable123', 'Select contractor');

        $('#cont').off('change.cont').on('change.cont', function () {
            const selectedContractId = this.value;
            if (selectedContractId) {
                fetchmile(factoryId, selectedContractId);
            } else {
                $('#mile').html(`<option value="">Select milestone</option>`);
                initSelect2('mile', 'exampleModalScrollable123', 'Select milestone');
                $('#mile').val('').trigger('change');
            }
        });
    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

async function fetchmile(factoryId, contractId) {
    try {
        const url = new URL(`/jssl/listassignmilestoneforcontractornew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);
        url.searchParams.append("contract_id", contractId);

        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch milestones");
        const json = await response.json();

        const selectElement = document.getElementById("mile");
        selectElement.innerHTML = `<option value="">Select milestone</option>`;

        if (json.status === "yes" && json.DATA.length) {
            json.DATA.forEach((milestone) => {
                if (milestone.milestone_id) {
                    const option = document.createElement("option");
                    option.value = milestone.milestone_id;
                    option.textContent = milestone.milestone_name;
                    selectElement.appendChild(option);
                }
            });
        }

        initSelect2('mile', 'exampleModalScrollable123', 'Select milestone');
        $('#mile').val('').trigger('change');   // reset selection and hide the line-item section
    } catch (error) {
        console.error("Error fetching milestones:", error);
    }
}


// Fetching the dropdown list for loads
/*async function fetchLoad(factoryId, contractId, milestoneName) {
    try {
        // Construct the API URL properly
        const url = new URL(`/jssl/contract/g2/listloadforcontractorbasedonfactory`, baseUrl);
        url.searchParams.append("factory_id", factoryId); // Append factory_id
        url.searchParams.append("contract_id", contractId); // Append contract_id
        url.searchParams.append("milestone_id", milestoneName); // Append milestone_name

        // Fetch data from API
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch loads");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No loads found.");
            return;
        }

        // Get the select element for loads
        const selectElement = document.getElementById("load");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Load</option>`;

        // Populate dropdown options using load data
        json.Data.forEach((load) => {
            if (load.load_id && load.lot_no) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = load.load_id; // Backend keeps load_id
                option.textContent = load.lot_no; // Display lot_no
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching loads:", error);
    }
}*/

/*async function fetchUserList(selectedFactoryId) {
    try {
        // Construct the API URL
        const url = new URL(`/jssl/qsadvancepackingnotemaster/list`, baseUrl);
        url.searchParams.append('factory_id', selectedFactoryId);

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
                    <th>Contract Name</th>
                    <th>Milestone Name</th>
					<th>Lot Number</th>
					<th>Status</th>
					<th>Edit</th>
					<th>View</th>
                </tr>
            </thead>
            <tbody>
        `;

		json.QSADVANCEPACKING.forEach(item => {
					let editinvoice = '';
					let viewIcon = '';
				   
					if (item.invgen === 'INOVICE NOT GENERATED') {
						editinvoice = `<td><i  id="Editpacking" class="fa fa-edit" style=" color: blue;" onclick="editRecord('${item.pn_id}')"></i></td>`; // Enabled
						viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`;
						}
						else
							{
								editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;	
								viewIcon = `<td><i class="fa fa-eye" style="color: green;" onclick="editRecord1('${item.pn_id}')"></i></td>`
								
							}
		            tableContent += `
		                <tr>
		                    <td>${item.contract_name}</td>
		                    <td>${item.milestone_name}</td>
		                    <td>${item.load_id}</td>
							<td>${item.invgen}</td>
							${editinvoice}
							${viewIcon}
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
}*/



let currentFactoryId = null;

function fetchUserList(selectedFactoryId) {

    currentFactoryId = selectedFactoryId || sessionStorage.getItem("selectedFactoryId");

    // 🔥 Destroy existing DataTable
    if ($.fn.DataTable.isDataTable('#tableID')) {
        $('#tableID').DataTable().clear().destroy();
    }

    // ✅ Server-side DataTable
    $('#tableID').DataTable({
        processing: true,
        serverSide: true,
        scrollX: true,
        searching: true,
        dom: 'Bfrtip',
        pageLength: 10,
        buttons: [
            {
                text: 'Export to Excel',
                action: function () {
                    // ✅ Export ALL records
                    const url = new URL(`/jssl/qsadvancepackingnotemaster/listss`, baseUrl);
                    url.searchParams.append('factory_id', currentFactoryId);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {

                            const exportData = json.data.map(item => [
                                item.contract_name || '',
                                item.milestone_name || '',
                                item.load_id || '',
                                item.invgen || ''
                            ]);

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>Contract Name</th>',
                                        '<th>Milestone Name</th>',
                                        '<th>Lot Number</th>',
                                        '<th>Status</th>'
                                    )
                                ),
                                $('<tbody>').append(
                                    exportData.map(row =>
                                        $('<tr>').append(row.map(cell => $('<td>').text(cell)))
                                    )
                                )
                            ).appendTo('body');

                            $(tempTable).DataTable({
                                buttons: [{
                                    extend: 'excelHtml5',
                                    title: 'QS Advance Packing List'
                                }]
                            }).button(0).trigger();

                            setTimeout(() => {
                                $(tempTable).DataTable().destroy();
                                $(tempTable).remove();
                            }, 1000);
                        });
                }
            }
        ],
        columns: [
            { title: "Contract Name" },
            { title: "Milestone Name" },
            { title: "Lot Number" },
            { title: "Status" },
            { title: "Edit",  orderable: false },
            { title: "View",  orderable: false }
        ],
        ajax: function (data, callback, settings) {

            const page = data.start / data.length;
            const size = data.length;
			const searchValue = data.search.value;   // ✅ ADD THIS


            const url = new URL(`/jssl/qsadvancepackingnotemaster/listss`, baseUrl);
            url.searchParams.append('factory_id', currentFactoryId);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
			url.searchParams.append('search', searchValue); 

            fetch(url, { credentials: "include" })
                .then(response => response.json())
                .then(json => {

                    const rows = json.data.map(item => {

                        let editIcon = '';
                        let viewIcon = '';

                        if (item.invgen === 'INVOICE NOT GENERATED') {
                            editIcon = `<i class="fa fa-edit" style="color:blue;" onclick="editRecord('${item.pn_id}')"></i>`;
                            viewIcon = `<i class="fa fa-eye text-muted"></i>`;
                        } else {
                            editIcon = `<i class="fa fa-edit text-muted"></i>`;
                            viewIcon = `<i class="fa fa-eye" style="color:green;" onclick="editRecord1('${item.pn_id}')"></i>`;
                        }

                        return [
                            item.contract_name || '',   // col 0
                            item.milestone_name || '',  // col 1
                            item.load_id || '',         // col 2
                            item.invgen || '',          // col 3
                            editIcon,                   // col 4
                            viewIcon                    // col 5
                        ];
                    });

                    callback({
                        draw: data.draw,
                        recordsTotal: json.totalItems,
                        recordsFiltered: json.totalItems,
                        data: rows
                    });
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    });
}
// Adding event listener for "Load" dropdown selection change
/*document.getElementById('mile').addEventListener('change', function() {
    const loadValue = this.value;  // Get the selected value of the "Load" dropdown

    const inputFieldsContainer = document.getElementById("inputFieldsContainer");

    if (loadValue) {
        // If a load is selected, show the "inputFieldsContainer"
        inputFieldsContainer.style.display = "block";
    } else {
        // If no load is selected, hide the "inputFieldsContainer"
        inputFieldsContainer.style.display = "none";
    }
});*/


$('#mile').on('change', function () {
    document.getElementById("inputFieldsContainer").style.display =
        this.value ? "block" : "none";
});

function openModalAdd() {
   // var freig = document.getElementById('freig').value.trim();
    //var vehi = document.getElementById('vehi').value.trim();
   // var trans = document.getElementById('trans').value.trim();
	var file = document.getElementById('file').value.trim();
    var showError = false; // Initialize showError variable

    // Freight Validation
  /*  if (freig === '') {
        document.getElementById('Freighterror').innerText = "Please enter Freight.";
        document.getElementById('Freighterror').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('Freighterror').innerText = "";
        document.getElementById('Freighterror').style.display = "none";
    }

    // Vehicle Validation
    if (vehi === '') {
        document.getElementById('Vehicleerror').innerText = "Please Enter Vehicle Number.";
        document.getElementById('Vehicleerror').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('Vehicleerror').innerText = "";
        document.getElementById('Vehicleerror').style.display = "none";
    }

    // Transporter Validation
    if (trans === '') {
        document.getElementById('Transportererror').innerText = "Please Enter Transporter Name";
        document.getElementById('Transportererror').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('Transportererror').innerText = "";
        document.getElementById('Transportererror').style.display = "none";
    }*/
	
	// File upload Validation
	    if (file === '') {
	        document.getElementById('fileerror').innerText = "Please select a file";
	        document.getElementById('fileerror').style.display = "inline-block";
	        showError = true;
	    } else {
	        document.getElementById('fileerror').innerText = "";
	        document.getElementById('fileerror').style.display = "none";
	    }

    // UOM Validation for all rows
    var uomValid = true;
    document.querySelectorAll("#dynamicRowsContainer .dynamic-row").forEach(function(row) {
        var uom = row.querySelector('select[id^="uom-"]').value.trim();
        if (uom === '') {
            uomValid = false;
            row.querySelector('.uom-error').innerText = "Please select UOM.";
            row.querySelector('.uom-error').style.display = "inline-block";
        } else {
            row.querySelector('.uom-error').innerText = "";
            row.querySelector('.uom-error').style.display = "none";
        }
    });

    // Type Validation for all rows
    var typeValid = true;
    document.querySelectorAll("#dynamicRowsContainer .dynamic-row").forEach(function(row) {
        var type = row.querySelector('select[id^="type-"]').value.trim();
        if (type === '') {
            typeValid = false;
            row.querySelector('.type-error').innerText = "Please select Type.";
            row.querySelector('.type-error').style.display = "inline-block";
        } else {
            row.querySelector('.type-error').innerText = "";
            row.querySelector('.type-error').style.display = "none";
        }
    });

    // Quantity Validation for all rows
    var qtyValid = true;
    document.querySelectorAll("#dynamicRowsContainer .dynamic-row").forEach(function(row) {
        var qty = row.querySelector('input[id^="qty-"]').value.trim();
        if (qty === '' || isNaN(qty) || qty <= 0) {
            qtyValid = false;
            row.querySelector('.qty-error').innerText = "Please enter a valid Quantity.";
            row.querySelector('.qty-error').style.display = "inline-block";
        } else {
            row.querySelector('.qty-error').innerText = "";
            row.querySelector('.qty-error').style.display = "none";
        }
    });

    // Kg Validation for all rows
    var kgValid = true;
    document.querySelectorAll("#dynamicRowsContainer .dynamic-row").forEach(function(row) {
        var kg = row.querySelector('input[id^="kg-"]').value.trim();
        if (kg === '' || isNaN(kg) || kg <= 0) {
            kgValid = false;
            row.querySelector('.kg-error').innerText = "Please enter a valid Kg.";
            row.querySelector('.kg-error').style.display = "inline-block";
        } else {
            row.querySelector('.kg-error').innerText = "";
            row.querySelector('.kg-error').style.display = "none";
        }
    });

    // Unit Price Validation for all rows
    var unitPriceValid = true;
    document.querySelectorAll("#dynamicRowsContainer .dynamic-row").forEach(function(row) {
        var unitPrice = row.querySelector('input[id^="uniprice-"]').value.trim();
        if (unitPrice === '' || isNaN(unitPrice) || unitPrice <= 0) {
            unitPriceValid = false;
            row.querySelector('.unitprice-error').innerText = "Please enter a valid Unit Price.";
            row.querySelector('.unitprice-error').style.display = "inline-block";
        } else {
            row.querySelector('.unitprice-error').innerText = "";
            row.querySelector('.unitprice-error').style.display = "none";
        }
    });

    // Pieces Validation for all rows
    var piecesValid = true;
    document.querySelectorAll("#dynamicRowsContainer .dynamic-row").forEach(function(row) {
        var pieces = row.querySelector('input[id^="pice-"]').value.trim();
        if (pieces === '' || isNaN(pieces) || pieces <= 0) {
            piecesValid = false;
            row.querySelector('.pieces-error').innerText = "Please enter a valid number of Pieces.";
            row.querySelector('.pieces-error').style.display = "inline-block";
        } else {
            row.querySelector('.pieces-error').innerText = "";
            row.querySelector('.pieces-error').style.display = "none";
        }
    });

    // If any error exists, prevent form submission
    if (showError || !uomValid || !typeValid || !qtyValid || !kgValid || !unitPriceValid  || !piecesValid) {
        return; // Do not proceed with opening the modal if validation fails
    }

    // If no errors, proceed
    $('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
}
// Fetch selectedFactoryId from sessionStorage
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

function addevent() {
	$('#exampleModalCenter66').modal('hide');
    // Arrays to collect the values from the dynamic rows
    const qtyArray = [];
    const perKgsArray = [];
    const unitPriceArray = [];
    const totalArray = [];
    const uomArray = [];
    const typeArray = [];
    const picesArray = [];

    // Loop over each row to collect values (assuming the rows have a class 'dynamic-row')
    const rows = document.querySelectorAll('#dynamicRowsContainer .dynamic-row');
    console.warn(rows);
    rows.forEach(row => {
        const qty = row.querySelector('[id^="qty"]').value.trim();
        const perKgs = row.querySelector('[id^="kg"]').value.trim();
        const unitPrice = row.querySelector('[id^="uniprice"]').value.trim();
        const total = row.querySelector('[id^="total"]').value.trim();
        const uom = row.querySelector('[id^="uom"]').value.trim();
        const type = row.querySelector('[id^="type"]').value.trim();
        const pices = row.querySelector('[id^="pice"]').value.trim();
console.warn(uom)
        // Only push values that are not empty (to avoid duplicates and empty values)
        if (qty) qtyArray.push(qty);
        if (perKgs) perKgsArray.push(perKgs);
        if (unitPrice) unitPriceArray.push(unitPrice);
        if (total) totalArray.push(total);
        if (uom) uomArray.push(uom);
        if (type) typeArray.push(type);
        if (pices) picesArray.push(pices);
    });

    // Join the values into comma-separated strings
    const qtyString = qtyArray.join(',');
    const perKgsString = perKgsArray.join(',');
    const unitPriceString = unitPriceArray.join(',');
    const totalString = totalArray.join(',');
    const uomString = uomArray.join(',');
    const typeString = typeArray.join(',');
    const picesString = picesArray.join(',');

    // Get the file input element
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0]; // Get the selected file

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('contract_id', cont.value);
    formData.append('milestone_id', mile.value);
    formData.append('qty', qtyString);
    formData.append('per_kgs', perKgsString);
    formData.append('unit_price', unitPriceString);
    formData.append('total', totalString);
    formData.append('UOM_id', uomString);
    formData.append('type_id', typeString);
    formData.append('pices', picesString);
    formData.append('grand_total', totalNo.value);
    formData.append('created_by', createdById);
    formData.append('factory_id', selectedFactoryId);
    
    if (file) {
        formData.append('file', file); // Append file only if selected
    }

    // Make the AJAX request
    $.ajax({
        url: new URL('/jssl/qsadvancepackingmaster/add', baseUrl),
        type: 'POST',
        dataType: 'json',
		xhrFields: {
		    withCredentials: true
		},
        data: formData,
        processData: false, // Important: prevent jQuery from processing the data
        contentType: false, // Important: prevent jQuery from setting contentType
        success: function(data) {
            var result = data.message; // No need to stringify

            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Packing Note Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'AdvancePackingNote.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create Advance packing note.';
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

/*function calculateRowTotaledit(rowIndex) {
    const kgField = document.getElementById(`kg_new_${rowIndex}`);
    const unitPriceField = document.getElementById(`unit_price_new_${rowIndex}`);
    const totalField = document.getElementById(`total_new_${rowIndex}`);

    // Parse the input values as floats, or default to 0 if not a valid number.
    const kg = parseFloat(kgField.value) || 0;
    const unitPrice = parseFloat(unitPriceField.value) || 0;
    const total = kg * unitPrice;

    // Update the total field (formatted to two decimal places)
    totalField.value = total.toFixed(2);
    // Update grand total
    updateGrandTotal();
}*/

function calculateRowTotaledit(rowIndex) {

    const uomSelect = document.getElementById(`uom_new_${rowIndex}`);
    const selectedText = uomSelect.options[uomSelect.selectedIndex].text.trim();

    const unitPriceField = document.getElementById(`unit_price_new_${rowIndex}`);
    const totalField = document.getElementById(`total_new_${rowIndex}`);

    let quantity = 0;

    if (selectedText.toUpperCase() === "NOS"|| selectedText.toUpperCase()=== "SQ MTS") {
        quantity = parseFloat(document.getElementById(`qty_new_${rowIndex}`).value) || 0;
    } else {
        quantity = parseFloat(document.getElementById(`kg_new_${rowIndex}`).value) || 0;
    }

    const unitPrice = parseFloat(unitPriceField.value) || 0;

    const total = quantity * unitPrice;

    totalField.value = total.toFixed(2);

    updateGrandTotal();
}

function calculateRowTotalupdate(rowIndex) {
    const kgField = document.getElementById(`kg_${rowIndex}`);
    const unitPriceField = document.getElementById(`unit_price_${rowIndex}`);
    const totalField = document.getElementById(`total_${rowIndex}`);

    const kg = parseFloat(kgField.value) || 0;
    const unitPrice = parseFloat(unitPriceField.value) || 0;
    const total = kg * unitPrice;

    totalField.value = total.toFixed(2);
    // Update grand total
    updateGrandTotal();
}

function updateGrandTotal() {
    let grandTotal = 0;

    // NEW rows
    document.querySelectorAll('#dynamicRowsContaineredit [id^="total_new_"]').forEach(field => {
        const val = parseFloat(field.value);
        if (!isNaN(val)) {
            grandTotal += val;
        }
    });

    // EXISTING rows
    document.querySelectorAll(
        '#dynamicRowsContaineredit [id^="total_"]:not([id^="total_new_"])'
    ).forEach(field => {
        const val = parseFloat(field.value);
        if (!isNaN(val)) {
            grandTotal += val;
        }
    });

    const grandTotalField = document.getElementById("totalNoedit");
    if (grandTotalField) {
        grandTotalField.value = grandTotal.toFixed(2);
    }
}

let newSlno = 0; // Set default SL No. to 0 instead of auto-incrementing

function addRowEdit() {
    const container = document.getElementById("dynamicRowsContaineredit");

    // ✅ Use current timestamp to avoid index collision after delete
    const rowIndex = Date.now();

    // SL No always 0 for new rows
    let newSlno = 0;

    const newRow = document.createElement("div");
    newRow.classList.add("form-row", "dynamic-row", "mb-2");
    newRow.id = `row_new_${rowIndex}`;

	newRow.innerHTML = `
	    <div class="col-md-1" style="display:none;">
	        <input type="number" class="form-control form-control-sm"
	               id="slno_new_${rowIndex}" value="${newSlno}" readonly>
	    </div>

	    <div class="col-md-1">
	        <select class="form-control form-control-sm" id="uom_new_${rowIndex}">
	            ${uomOptionsHTML || `<option value="">Select Uom</option>`}
	        </select>
	        <div class="uom-error" style="color:red; display:none;"></div>
	    </div>

	    <div class="col-md-2">
	        <select class="form-control form-control-sm" id="type_new_${rowIndex}">
	            ${typeOptionsHTML || `<option value="">Select type</option>`}
	        </select>
	        <div class="type-error" style="color:red; display:none;"></div>
	    </div>

	    <div class="col-md-2">
	        <input type="number" class="form-control form-control-sm text-right"
	               id="qty_new_${rowIndex}" placeholder="Quantity" min="0"
	               onkeydown="return allowOnlyPositive(event)"
	               oninput="calculateRowTotaledit(${rowIndex})">
	        <div class="qty-error" style="color:red; display:none;"></div>
	    </div>

	    <div class="col-md-2">
	        <input type="number" class="form-control form-control-sm text-right"
	               id="kg_new_${rowIndex}" placeholder="Kg" min="0" step="0.01"
	               onkeydown="return allowOnlyPositive(event)"
	               oninput="calculateRowTotaledit(${rowIndex})">
	        <div class="kg-error" style="color:red; display:none;"></div>
	    </div>

	    <div class="col-md-2">
	        <input type="number" class="form-control form-control-sm text-right"
	               id="unit_price_new_${rowIndex}" placeholder="Unit Price" min="0"
	               onkeydown="return allowOnlyPositive(event)"
	               oninput="calculateRowTotaledit(${rowIndex})">
	        <div class="unitprice-error" style="color:red; display:none;"></div>
	    </div>

	    <div class="col-md-1">
	        <input type="number" class="form-control form-control-sm text-right"
	               id="pieces_new_${rowIndex}" placeholder="Pieces" min="0"
	               onkeydown="return allowOnlyPositive(event)">
	        <div class="pieces-error" style="color:red; display:none;"></div>
	    </div>

	    <div class="col-md-1">
	        <input type="number" class="form-control form-control-sm text-right"
	               id="total_new_${rowIndex}" value="0.00" readonly>
	    </div>

	    <div class="col-md-1 text-center">
	        <i class="bi bi-trash text-danger"
	           style="cursor:pointer; font-size:16px;"
	           onclick="deleteRow1('row_new_${rowIndex}')"
	           title="Delete"></i>
	    </div>
	`;

	container.appendChild(newRow);

	initSelect2(`uom_new_${rowIndex}`, 'exampleModalScrollable123update', 'Select uom');   // ADD
	initSelect2(`type_new_${rowIndex}`, 'exampleModalScrollable123update', 'Select type'); // ADD

    // ✅ VERY IMPORTANT: force recalculation
    updateGrandTotal();
}


function editRecord(pn_id) {
				//  const allowed = window.allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL('/jssl/qsadvancepackingnotemastersearch', baseUrl);
    url.search = new URLSearchParams({ pn_id: pn_id }).toString();

    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {

            if (
                data.status !== "yes" ||
                !Array.isArray(data.DATA) ||
                data.DATA.length === 0
            ) {
                alert("No records found!");
                return;
            }

            const records = data.DATA;
            const firstRecord = records[0];

            /* ---------------- MASTER DATA ---------------- */
            document.getElementById("contedit").value =
                firstRecord.contract_name || "";

            document.getElementById("mileedit").value =
                firstRecord.milestone_name || "";

            document.getElementById("totalNoedit").value =
                parseFloat(firstRecord.grand_total || 0).toFixed(2);

            document.getElementById("pnidedit").value =
                firstRecord.pn_id || "";

            /* ---------------- FILE DATA ---------------- */
            const filePath = firstRecord.filepath || "";
            const fileName = filePath.includes("@$@_")
                ? filePath.split("@$@_")[1]
                : "";

            document.getElementById("fileNameDisplay").innerHTML =
                fileName || "No file uploaded";

            document.getElementById("existing_filepath").value = filePath;

            /* ---------------- CLEAR ITEMS ---------------- */
            const dynamicContainer =
                document.getElementById("dynamicRowsContaineredit");
            dynamicContainer.innerHTML = "";

            /* ---------------- FILTER VALID ITEMS ---------------- */
            const itemRecords = records.filter(r =>
                r.slno && parseInt(r.slno) > 0
            );

            /* ---------------- CREATE ROWS ONLY IF ITEMS EXIST ---------------- */
			itemRecords.forEach((record, index) => {

			    const showLabel = index === 0;

			    const newRow = document.createElement("div");
			    newRow.className = "form-row dynamic-row";
			    newRow.id = `row_${index}`;

			   /* newRow.innerHTML = `
			        <div class="form-group col-md-1">
			            ${showLabel ? `<label><b>UOM</b></label>` : ``}
			            <select class="form-control form-control-sm" id="uom_${index}">
			                ${uomOptionsHTML || `<option value="">Select uom</option>`}
			            </select>
			        </div>

			        <div class="form-group col-md-2">
			            ${showLabel ? `<label><b>Type</b></label>` : ``}
			            <select class="form-control form-control-sm" id="type_${index}">
			                ${typeOptionsHTML || `<option value="">Select type</option>`}
			            </select>
			        </div>

			        <div class="form-group col-md-2">
			            ${showLabel ? `<label><b>Quantity</b></label>` : ``}
			            <input type="number" class="form-control form-control-sm text-right"
			                   id="qty_${index}"
			                   onkeydown="return allowOnlyPositive(event)"
			                   value="${parseFloat(record.qty || 0).toFixed(2)}">
			        </div>

			        <div class="form-group col-md-2">
			            ${showLabel ? `<label><b>Kgs / MT / Sqm</b></label>` : ``}
			            <input type="number" class="form-control form-control-sm text-right"
			                   id="kg_${index}"
			                   onkeydown="return allowOnlyPositive(event)"
			                   oninput="calculateRowTotalupdate(${index})"
			                   value="${parseFloat(record.per_kgs || 0).toFixed(2)}">
			        </div>

			        <div class="form-group col-md-2">
			            ${showLabel ? `<label><b>Unit Price</b></label>` : ``}
			            <input type="number" class="form-control form-control-sm text-right"
			                   id="unit_price_${index}"
			                   onkeydown="return allowOnlyPositive(event)"
			                   oninput="calculateRowTotalupdate(${index})"
			                   value="${parseFloat(record.unit_price || 0).toFixed(2)}">
			        </div>

			        <div class="form-group col-md-1">
			            ${showLabel ? `<label><b>Pieces</b></label>` : ``}
			            <input type="number" class="form-control form-control-sm text-right"
			                   id="pieces_${index}"
			                   onkeydown="return allowOnlyPositive(event)"
			                   value="${parseInt(record.pices || 0)}">
			        </div>

			        <div class="form-group col-md-1">
			            ${showLabel ? `<label><b>Total</b></label>` : ``}
			            <input type="number" class="form-control form-control-sm text-right"
			                   id="total_${index}"
			                   value="${parseFloat(record.total || 0).toFixed(2)}"
			                   readonly>
			        </div>

			        <div class="form-group col-md-1" style="display:none;">
			            <input type="text" id="slno_${index}" value="${record.slno}">
			        </div>

			        <div class="form-group col-md-1 text-center">
			            ${showLabel ? `<label><b>Action</b></label><br>` : `<br>`}
			            <i class="bi bi-trash text-danger"
			               style="cursor:pointer;font-size:16px;"
			               onclick="deleteRow(${index})"></i>
			        </div>
			    `;*/
				
				
				newRow.innerHTML = `
				    <div class="form-group col-md-1">
				        ${showLabel ? `<label><b>UOM</b></label>` : ``}
				        <select class="form-control form-control-sm" id="uom_${index}">
				            ${uomOptionsHTML || `<option value="">Select uom</option>`}
				        </select>
				        <div class="uom-error" style="color:red; display:none;"></div>
				    </div>

				    <div class="form-group col-md-2">
				        ${showLabel ? `<label><b>Type</b></label>` : ``}
				        <select class="form-control form-control-sm" id="type_${index}">
				            ${typeOptionsHTML || `<option value="">Select type</option>`}
				        </select>
				        <div class="type-error" style="color:red; display:none;"></div>
				    </div>

				    <div class="form-group col-md-2">
				        ${showLabel ? `<label><b>Quantity</b></label>` : ``}
				        <input type="number" class="form-control form-control-sm text-right"
				               id="qty_${index}"
				               onkeydown="return allowOnlyPositive(event)"
				               value="${parseFloat(record.qty || 0).toFixed(2)}">
				        <div class="qty-error" style="color:red; display:none;"></div>
				    </div>

				    <div class="form-group col-md-2">
				        ${showLabel ? `<label><b>Kgs / MT / Sqm</b></label>` : ``}
				        <input type="number" class="form-control form-control-sm text-right"
				               id="kg_${index}"
				               onkeydown="return allowOnlyPositive(event)"
				               oninput="calculateRowTotalupdate(${index})"
				               value="${parseFloat(record.per_kgs || 0).toFixed(2)}">
				        <div class="kg-error" style="color:red; display:none;"></div>
				    </div>

				    <div class="form-group col-md-2">
				        ${showLabel ? `<label><b>Unit Price</b></label>` : ``}
				        <input type="number" class="form-control form-control-sm text-right"
				               id="unit_price_${index}"
				               onkeydown="return allowOnlyPositive(event)"
				               oninput="calculateRowTotalupdate(${index})"
				               value="${parseFloat(record.unit_price || 0).toFixed(2)}">
				        <div class="unitprice-error" style="color:red; display:none;"></div>
				    </div>

				    <div class="form-group col-md-1">
				        ${showLabel ? `<label><b>Pieces</b></label>` : ``}
				        <input type="number" class="form-control form-control-sm text-right"
				               id="pieces_${index}"
				               onkeydown="return allowOnlyPositive(event)"
				               value="${parseInt(record.pices || 0)}">
				        <div class="pieces-error" style="color:red; display:none;"></div>
				    </div>

				    <div class="form-group col-md-1">
				        ${showLabel ? `<label><b>Total</b></label>` : ``}
				        <input type="number" class="form-control form-control-sm text-right"
				               id="total_${index}"
				               value="${parseFloat(record.total || 0).toFixed(2)}"
				               readonly>
				    </div>

				    <div class="form-group col-md-1" style="display:none;">
				        <input type="text" id="slno_${index}" value="${record.slno}">
				    </div>

			
					
					<div class="form-group col-md-1 text-center">
							            ${showLabel ? `<label><b>Action</b></label><br>` : `<br>`}
							            <i class="bi bi-trash text-danger"
							               style="cursor:pointer;font-size:16px;"
							               onclick="deleteRow(${index})"></i>
							        </div>
				`;
			    dynamicContainer.appendChild(newRow);

				document.getElementById(`uom_${index}`).value = record.uom_id || "";
				document.getElementById(`type_${index}`).value = record.type_id || "";

				initSelect2(`uom_${index}`, 'exampleModalScrollable123update', 'Select uom');
				initSelect2(`type_${index}`, 'exampleModalScrollable123update', 'Select type');
			});

            /* ---------------- SHOW MODAL (ALWAYS) ---------------- */
            $("#exampleModalScrollable123update").modal("show");
			/* ✅ FORCE GRAND TOTAL RECALC */
			updateGrandTotal();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Failed to load packing note.");
        });
}

function editRecord1(pn_id) {
		 // const allowed = window.allowedActions || [];

	if (!allowed.includes("view")) {
	  alert(" You do not have permission to view.");
	  return;
	}
    const url = new URL('/jssl/qsadvancepackingnotemastersearch', baseUrl);
    url.search = new URLSearchParams({ pn_id: pn_id }).toString();

    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {

            if (
                data.status !== "yes" ||
                !Array.isArray(data.DATA) ||
                data.DATA.length === 0
            ) {
                alert("No records found!");
                return;
            }

            const records = data.DATA;
            const firstRecord = records[0];

            /* ---------------- STATIC / MASTER FIELDS ---------------- */
            document.getElementById("contview").value =
                firstRecord.contract_name || "";

            document.getElementById("mileview").value =
                firstRecord.milestone_name || "";

            document.getElementById("totalNoview").value =
                parseFloat(firstRecord.grand_total || 0).toFixed(2);

            document.getElementById("pnidview").value =
                firstRecord.pn_id || "";

            /* ---------------- FILE DISPLAY ---------------- */
            const filePath = firstRecord.filepath || "";
            const fileName = filePath.includes("@$@_")
                ? filePath.split("@$@_")[1]
                : "";

            document.getElementById("fileNameDisplayview").innerHTML =
                fileName ? fileName : "No file uploaded";

            document.getElementById("existing_filepath").value = filePath;

            /* ---------------- CLEAR OLD ROWS ---------------- */
            const dynamicContainer =
                document.getElementById("dynamicRowsContainerview");
            dynamicContainer.innerHTML = "";

            /* ---------------- FILTER VALID ITEM ROWS ---------------- */
            const itemRecords = records.filter(r =>
                r.slno && parseInt(r.slno) > 0
            );

            /* ---------------- CREATE DYNAMIC ROWS ---------------- */
            itemRecords.forEach((record, index) => {

                const newRow = document.createElement("div");
                newRow.className = "form-row dynamic-row align-items-center";
                newRow.id = `row_${index}`;

                newRow.innerHTML = `
                    <div class="form-group col-md-1">
                        <select class="form-control form-control-sm"
                                id="uom_${index}" disabled>
                            ${uomOptionsHTML || `<option value="">Select uom</option>`}
                        </select>
                    </div>

                    <div class="form-group col-md-2">
                        <select class="form-control form-control-sm"
                                id="type_${index}" disabled>
                            ${typeOptionsHTML || `<option value="">Select type</option>`}
                        </select>
                    </div>

                    <div class="form-group col-md-2">
                        <input type="number"
                               class="form-control form-control-sm text-right"
                               id="qty_${index}"
                               value="${parseFloat(record.qty || 0).toFixed(2)}"
                               readonly>
                    </div>

                    <div class="form-group col-md-2">
                        <input type="number"
                               class="form-control form-control-sm text-right"
                               id="kg_${index}"
                               value="${parseFloat(record.per_kgs || 0).toFixed(2)}"
                               readonly>
                    </div>

                    <div class="form-group col-md-2">
                        <input type="number"
                               class="form-control form-control-sm text-right"
                               id="unit_price_${index}"
                               value="${parseFloat(record.unit_price || 0).toFixed(2)}"
                               readonly>
                    </div>

                    <div class="form-group col-md-1">
                        <input type="number"
                               class="form-control form-control-sm text-right"
                               id="total_${index}"
                               value="${parseFloat(record.total || 0).toFixed(2)}"
                               readonly>
                    </div>

                    <div class="form-group col-md-1" style="display:none;">
                        <input type="text"
                               id="slno_${index}"
                               value="${record.slno}"
                               readonly>
                    </div>

                    <div class="form-group col-md-1 text-center">
                        <!-- view only -->
                    </div>
                `;

                dynamicContainer.appendChild(newRow);

                /* -------- SET DROPDOWN VALUES -------- */
                document.getElementById(`uom_${index}`).value =
                    record.uom_id || "";

                document.getElementById(`type_${index}`).value =
                    record.type_id || "";
            });

            /* ---------------- SHOW MODAL ---------------- */
            $("#exampleadvModalScrollable123view").modal("show");

            /* ---------------- ENSURE GRAND TOTAL ---------------- */
            updateGrandTotal();
        })
        .catch(error => {
            console.error("Error fetching advance packing note:", error);
            alert("Failed to load advance packing note.");
        });
}

function deleteRow(rowIndex) {
    const container = document.getElementById("dynamicRowsContaineredit");

    const slnoField = document.getElementById(`slno_${rowIndex}`);
    const slnoValue = slnoField ? slnoField.value : null;

    $.ajax({
        url: new URL('/jssl/qsadvancepackingitemmaster/delete', baseUrl),
        type: 'POST',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: {
            slno: slnoValue,
            modified_by: createdById
        },
        success: function (data) {
            if (data.message === "Success") {

                // ✅ Remove row
                const row = document.getElementById(`row_${rowIndex}`);
                if (row) row.remove();

                updateGrandTotal();

                // ✅ Check if NO items left
                if (container.children.length === 0) {

                    const popup = $('<div class="popup">Item Deleted Successfully</div>')
                        .appendTo('body').hide().fadeIn(300);

                    setTimeout(() => {
                        popup.fadeOut(300, () => popup.remove());

                        // 🔁 Redirect to list page OR reload list
                       window.location = 'AdvancePackingNote.jsp';
                        // OR if you stay on same page:
                        // fetchUserList(selectedFactoryId);

                    }, 1000);

                    return;
                }

                // ✅ Normal success popup
                const popup = $('<div class="popup">Item Deleted Successfully!</div>')
                    .appendTo('body').hide().fadeIn(300);

                setTimeout(() => popup.fadeOut(300, () => popup.remove()), 800);

            } else {
                alert("Failed to delete item.");
            }
        },
        error: function () {
            alert("Error while deleting item.");
        }
    });
}


function deleteRow1(rowId) {
    const row = document.getElementById(rowId);

    if (row) {
        row.remove();
        updateGrandTotal(); // ✅ always recalc
    } else {
        console.error("Row not found:", rowId);
    }
}

// Global variables to store dropdown options
let uomOptionsHTML = "";
let typeOptionsHTML = "";

// When the DOM is loaded, fetch dropdown options based on the factory ID.
document.addEventListener("DOMContentLoaded", function() {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchuomEdit();
        fetchtypeEdit();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

// Fetch Uom dropdown options
async function fetchuomEdit() {
    try {
        const url = new URL(`/jssl/master/listunitmeasurementmasternew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

	   const response = await fetch(url,{
	   				           method: "GET",
	   				           credentials: "include"   // ✅ Always send JSESSIONID cookie
	   				       });
        if (!response.ok) throw new Error("Failed to fetch Uom options");

        const json = await response.json();

        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No Uom options found.");
            return;
        }

        // Build options HTML
        let options = `<option value="">Select uom</option>`;
        json.Data.forEach((item) => {
            if (item.unit_id && item.unit_name) {
                options += `<option value="${item.unit_id}">${item.unit_name}</option>`;
            }
        });
        uomOptionsHTML = options;

        // If any dynamic rows already exist, update their dropdown
        document.querySelectorAll("select[id^='uom_new_']").forEach(select => {
            select.innerHTML = options;
        });
    } catch (error) {
        console.error("Error fetching Uom options:", error);
    }
}

// Fetch Type dropdown options
async function fetchtypeEdit() {
    try {
        const url = new URL(`/jssl/qspackingmasterscraptype/listnew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

	   const response = await fetch(url,{
	   				           method: "GET",
	   				           credentials: "include"   // ✅ Always send JSESSIONID cookie
	   				       });
        if (!response.ok) throw new Error("Failed to fetch Type options");

        const json = await response.json();

        if (json.status !== "yes" || !json.SCRAPTYPELIST.length) {
            console.warn("No Type options found.");
            return;
        }

        // Build options HTML
        let options = `<option value="">Select type</option>`;
        json.SCRAPTYPELIST.forEach((item) => {
            if (item.type_id && item.scrap_Name) {
                options += `<option value="${item.type_id}">${item.scrap_Name}</option>`;
            }
        });
        typeOptionsHTML = options;

        // Update any dynamic rows already present
        document.querySelectorAll("select[id^='type_new_']").forEach(select => {
            select.innerHTML = options;
        });
    } catch (error) {
        console.error("Error fetching Type options:", error);
    }
}

// for validation please give 
/*function openModalUpdate() {
    var freigedit = document.getElementById('freigedit').value.trim();
    var vehiedit = document.getElementById('vehiedit').value.trim();
    var transedit = document.getElementById('transedit').value.trim();
	var filename = document.getElementById('fileedit').value.trim();
    var showError = false; // Initialize showError variable

    // Validate static fields
    if (freigedit === '') {
        document.getElementById('Freighterroredit').innerText = "Please Enter freight.";
        document.getElementById('Freighterroredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('Freighterroredit').innerText = "";
        document.getElementById('Freighterroredit').style.display = "none";
    }
    
    if (vehiedit === '') {
        document.getElementById('Vehicleerroredit').innerText = "Please Enter vehicle no.";
        document.getElementById('Vehicleerroredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('Vehicleerroredit').innerText = "";
        document.getElementById('Vehicleerroredit').style.display = "none";
    }
    
    if (transedit === '') {
        document.getElementById('Transportererroredit').innerText = "Please Enter transporter name.";
        document.getElementById('Transportererroredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('Transportererroredit').innerText = "";
        document.getElementById('Transportererroredit').style.display = "none";
    }
	if (filename === '') {
		      document.getElementById('fileediterror').innerText = "Please select new file.";
		      document.getElementById('fileediterror').style.display = "inline-block";
		      showError = true;
		  } else {
		      document.getElementById('fileediterror').innerText = "";
		      document.getElementById('fileediterror').style.display = "none";
		  }
    // Validate dynamic rows
    // Get all dynamic rows
    var dynamicRows = document.querySelectorAll(".dynamic-row");
    dynamicRows.forEach((row, index) => {
        // For new rows, the IDs have _new_ pattern.
        // For update rows, they have a different pattern (e.g., uom_).
        // We'll use a selector that finds either pattern.
        var uomField = row.querySelector("select[id^='uom_']");
        var typeField = row.querySelector("select[id^='type_']");
        var qtyField = row.querySelector("input[id^='qty_']");
        var kgField = row.querySelector("input[id^='kg_']");
        var unitPriceField = row.querySelector("input[id^='unit_price_']");
        var piecesField = row.querySelector("input[id^='pieces_']");

        // Reset border style before validation
        if(uomField) uomField.style.border = "";
        if(typeField) typeField.style.border = "";
        if(qtyField) qtyField.style.border = "";
        if(kgField) kgField.style.border = "";
        if(unitPriceField) unitPriceField.style.border = "";
        if(piecesField) piecesField.style.border = "";

        // Check if each field has a value; if not, mark error.
        if(uomField && uomField.value.trim() === ""){
            uomField.style.border = "1px solid red";
            showError = true;
        }
        if(typeField && typeField.value.trim() === ""){
            typeField.style.border = "1px solid red";
            showError = true;
        }
        if(qtyField && qtyField.value.trim() === ""){
            qtyField.style.border = "1px solid red";
            showError = true;
        }
        if(kgField && kgField.value.trim() === ""){
            kgField.style.border = "1px solid red";
            showError = true;
        }
        if(unitPriceField && unitPriceField.value.trim() === ""){
            unitPriceField.style.border = "1px solid red";
            showError = true;
        }
        if(piecesField && piecesField.value.trim() === ""){
            piecesField.style.border = "1px solid red";
            showError = true;
        }
    });
   
    // If no errors, proceed to show the next modal
    if (!showError) {
        $('#exampleModalCenter66update').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}*/


function openModalUpdate() {
    var showError = false;

    // File
    var fileErr = document.getElementById('fileediterror');
    if (document.getElementById('fileedit').value.trim() === '') {
        fileErr.innerText = "Please select new file.";
        fileErr.style.display = "inline-block";
        showError = true;
    } else {
        fileErr.innerText = "";
        fileErr.style.display = "none";
    }

    function setError(row, selector, message) {
        var el = row.querySelector(selector);
        if (!el) return;
        el.innerText = message;
        el.style.display = message ? "inline-block" : "none";
    }
    function checkNumber(row, inputSel, errSel, message) {
        var input = row.querySelector(inputSel);
        if (!input) return;
        var v = input.value.trim();
        if (v === '' || isNaN(v) || parseFloat(v) <= 0) {
            setError(row, errSel, message);
            showError = true;
        } else {
            setError(row, errSel, "");
        }
    }

    // Only the update modal's rows
    document.querySelectorAll("#dynamicRowsContaineredit .dynamic-row").forEach(function (row) {
        var uom = row.querySelector("select[id^='uom_']");
        if (uom && uom.value.trim() === '') { setError(row, ".uom-error", "Please select UOM."); showError = true; }
        else setError(row, ".uom-error", "");

        var type = row.querySelector("select[id^='type_']");
        if (type && type.value.trim() === '') { setError(row, ".type-error", "Please select Type."); showError = true; }
        else setError(row, ".type-error", "");

        checkNumber(row, "input[id^='qty_']",        ".qty-error",       "Please enter a valid Quantity.");
        checkNumber(row, "input[id^='kg_']",         ".kg-error",        "Please enter a valid Kg.");
        checkNumber(row, "input[id^='unit_price_']", ".unitprice-error", "Please enter a valid Unit Price.");
        checkNumber(row, "input[id^='pieces_']",     ".pieces-error",    "Please enter a valid number of Pieces.");
    });

    if (showError) return;
    $('#exampleModalCenter66update').modal('show');
}

function updateevent() {
	$('#exampleModalCenter66update').modal('hide');
    // Create a new FormData object
    var formData = new FormData();

    /* -------------------- COLLECT DYNAMIC VALUES -------------------- */

    var qtyArr = [];
    document.querySelectorAll('[id^="qty_new_"]').forEach(el => qtyArr.push(el.value.trim()));
    document.querySelectorAll('[id^="qty_"]:not([id^="qty_new_"])').forEach(el => qtyArr.push(el.value.trim()));
    var qtyStr = qtyArr.join(',');

    var perKgsArr = [];
    document.querySelectorAll('[id^="kg_new_"]').forEach(el => perKgsArr.push(el.value.trim()));
    document.querySelectorAll('[id^="kg_"]:not([id^="kg_new_"])').forEach(el => perKgsArr.push(el.value.trim()));
    var perKgsStr = perKgsArr.join(',');

    var unitPriceArr = [];
    document.querySelectorAll('[id^="unit_price_new_"]').forEach(el => unitPriceArr.push(el.value.trim()));
    document.querySelectorAll('[id^="unit_price_"]:not([id^="unit_price_new_"])').forEach(el => unitPriceArr.push(el.value.trim()));
    var unitPriceStr = unitPriceArr.join(',');

    var totalArr = [];
    document.querySelectorAll('[id^="total_new_"]').forEach(el => totalArr.push(el.value.trim()));
    document.querySelectorAll('[id^="total_"]:not([id^="total_new_"])').forEach(el => totalArr.push(el.value.trim()));
    var totalStr = totalArr.join(',');

    var uomIdArr = [];
    document.querySelectorAll('[id^="uom_new_"]').forEach(el => uomIdArr.push(el.value.trim()));
    document.querySelectorAll('[id^="uom_"]:not([id^="uom_new_"])').forEach(el => uomIdArr.push(el.value.trim()));
    var uomIdStr = uomIdArr.join(',');

    var typeIdArr = [];
    document.querySelectorAll('[id^="type_new_"]').forEach(el => typeIdArr.push(el.value.trim()));
    document.querySelectorAll('[id^="type_"]:not([id^="type_new_"])').forEach(el => typeIdArr.push(el.value.trim()));
    var typeIdStr = typeIdArr.join(',');

    var piecesArr = [];
    document.querySelectorAll('[id^="pieces_new_"]').forEach(el => piecesArr.push(el.value.trim()));
    document.querySelectorAll('[id^="pieces_"]:not([id^="pieces_new_"])').forEach(el => piecesArr.push(el.value.trim()));
    var piecesStr = piecesArr.join(',');

    var slnoArr = [];
    document.querySelectorAll('[id^="slno_new_"]').forEach(el => slnoArr.push(el.value.trim()));
    document.querySelectorAll('[id^="slno_"]:not([id^="slno_new_"])').forEach(el => slnoArr.push(el.value.trim()));
    var slnoStr = slnoArr.join(',');

    /* -------------------- FILE DUPLICATE CHECK -------------------- */

	const fileInput = document.getElementById('fileedit');
	const existingFilePath = document.getElementById("existing_filepath").value || '';

	if (fileInput.files.length > 0 && existingFilePath !== '') {

	    const newFileName = fileInput.files[0].name;

	    let existingOriginalFileName = existingFilePath;
	    if (existingFilePath.includes('_@$@_')) {
	        existingOriginalFileName = existingFilePath.split('_@$@_').pop();
	    }

		if (newFileName === existingOriginalFileName) {

		    $('#errorMessage').text(
		        'The selected file is already uploaded. Please choose a different file.'
		    );

		    $('#exampleModalCenter66update').modal('hide');
			$('#exampleModalScrollable123update').modal('hide');

		    setTimeout(function () {
		        $('#exampleModalCenterDup').modal({
		            backdrop: 'static',
		            keyboard: false
		        });
		    }, 300);

		    return;
		}
	}

    /* -------------------- APPEND FILE -------------------- */

    if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    }

    /* -------------------- APPEND FORM DATA -------------------- */

    formData.append('modified_by', createdById);
    formData.append('factory_id', selectedFactoryId);
    formData.append('pn_id', pnidedit.value);
    formData.append('grand_total', totalNoedit.value);
    formData.append('qty', qtyStr);
    formData.append('per_kgs', perKgsStr);
    formData.append('unit_price', unitPriceStr);
    formData.append('total', totalStr);
    formData.append('UOM_id', uomIdStr);
    formData.append('type_id', typeIdStr);
    formData.append('pices', piecesStr);
    formData.append('slno', slnoStr);
    formData.append('existing_filepath', existingFilePath);

    /* -------------------- AJAX CALL -------------------- */

    $.ajax({
        url: new URL('/jssl/qsadvancepackingmaster/update', baseUrl),
        type: 'POST',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: formData,
        processData: false,
        contentType: false,

        success: function (data) {

            if (data.status === "yes") {

                const popup = $('<div class="popup">Advance Packing Updated Successfully!</div>')
                    .appendTo('body')
                    .hide()
                    .fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'AdvancePackingNote.jsp';
                    });
                }, 800);

            } else if (data.action === "NO_CHANGE") {

                const popup = $('<div class="popup">No fields were changed.</div>')
                    .appendTo('body')
                    .hide()
                    .fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        $('#exampleModalCenter66update').modal('hide');
                    });
                }, 1000);

            } else {

                const errorMessage = data.message || 'Failed to update record.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
                $('#exampleModalCenter66update').modal('hide');
                $('#exampleModalScrollable123update').modal('hide');
            }
        },

        error: function () {
            console.error('Request failed.');
        }
    });
}

document.getElementById('eyeIconBtn').addEventListener('click', function() {
    // Get the value from the hidden Pnid field
    var pnid = document.getElementById('pnidedit').value;

    if (pnid) {
        // Prepare the API URL with the id parameter
        const url = new URL(`/jssl/qsadvancepackingmaster/viewpdfnew`, baseUrl);
    	var params = [['id', encodeURIComponent(pnid)]];
    	url.search = new URLSearchParams(params).toString();
        
         // Send a GET request to the API to get the PDF
     fetch(url, { credentials: "include" })
            .then(response => response.blob())  // Get the response as a blob (binary data)
            .then(blob => {
                // Create a URL for the PDF blob
                var pdfUrl = URL.createObjectURL(blob);

                // Open the PDF in a new window or embed it in an iframe
                var newWindow = window.open(pdfUrl, '_blank');
                if (newWindow) {
                    newWindow.focus();  // Focus the new window
                } else {
                    //alert("Please allow popups for this site to view the PDF.");
                }
            })
            .catch(error => {
                console.error('Error fetching the PDF:', error);
                //alert('Failed to fetch the PDF.');
            });
    } else {
        //alert('PNid is missing.');
    }
});

document.getElementById('eyeIconBtnview').addEventListener('click', function() {
    // Get the value from the hidden Pnid field
    var pnid = document.getElementById('pnidview').value;

    if (pnid) {
        // Prepare the API URL with the id parameter
        const url = new URL(`/jssl/qsadvancepackingmaster/viewpdfnew`, baseUrl);
    	var params = [['id', encodeURIComponent(pnid)]];
    	url.search = new URLSearchParams(params).toString();
        
         // Send a GET request to the API to get the PDF
     fetch(url, { credentials: "include" })
            .then(response => response.blob())  // Get the response as a blob (binary data)
            .then(blob => {
                // Create a URL for the PDF blob
                var pdfUrl = URL.createObjectURL(blob);

                // Open the PDF in a new window or embed it in an iframe
                var newWindow = window.open(pdfUrl, '_blank');
                if (newWindow) {
                    newWindow.focus();  // Focus the new window
                } else {
                    //alert("Please allow popups for this site to view the PDF.");
                }
            })
            .catch(error => {
                console.error('Error fetching the PDF:', error);
                //alert('Failed to fetch the PDF.');
            });
    } else {
        //alert('PNid is missing.');
    }
});

/*function initSelect2(selectId, modalId, placeholder) {
    var $el = $('#' + selectId);
    if ($el.hasClass('select2-hidden-accessible')) {
        $el.select2('destroy'); // rebuild so newly fetched options are picked up
    }
    $el.select2({
        dropdownParent: $('#' + modalId), // required so it renders correctly inside a Bootstrap modal
        width: '100%',
        placeholder: placeholder,
        allowClear: false
    });
}*/


function initSelect2(selectId, modalId, placeholder) {
    var $el = $('#' + selectId);
    if (!$el.length) return;
    if ($el.hasClass('select2-hidden-accessible')) {
        $el.select2('destroy');
    }
    $el.select2({
        dropdownParent: $('#' + modalId),
        width: '100%',
        placeholder: placeholder,
        allowClear: false,
        minimumResultsForSearch: 0   // always show the search box
    });
}

