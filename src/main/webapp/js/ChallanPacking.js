
let allowed = null;


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


function initSelect2(selectId, placeholder) {
    const $el = $('#' + selectId);
    if (!$el.length) return;
    if ($el.hasClass('select2-hidden-accessible')) $el.select2('destroy');
    const $modal = $el.closest('.modal');
    $el.select2({
        dropdownParent: $modal.length ? $modal : $(document.body),
        width: '100%',
        placeholder: placeholder,
        allowClear: false,
        minimumResultsForSearch: 0   // always show the search box
    });
}

function setFieldError(errId, message) {
    const el = document.getElementById(errId);
    if (!el) return;
    el.innerText = message || "";
    el.style.display = message ? "inline-block" : "none";
}

let rowCount = 0; // Counter to keep track of dynamic row IDs


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
document.addEventListener("DOMContentLoaded", function () {
	
	loadAllowedActions();
    // First, check if there's already an initial row
    addRow(); // Initially add a row
    // Populate the dropdowns for the first row
    fetchuom(1);
    fetctype(1);
    fetchUserList(selectedFactoryId);
	fetchinvoicetype();
	fetchRGPno(selectedFactoryId);
});

// Function to add a new row
function addRow() {
    // Get the container where rows will be added
    const container = document.getElementById("dynamicRowsContainer");
    
    // Increment the rowCount for unique IDs
    rowCount++;

    // Create a new row
    const row = document.createElement("div");
    row.classList.add("form-row", "mt-3", "dynamic-row");
    row.setAttribute("data-row-id", rowCount); // Set a custom attribute for identifying the row

    // Add the input fields for serial no, uom, type, kg, quantity, unit price, total, pieces
	row.innerHTML = `
	    <div class="form-group col-md-2">
	        <select class="form-control form-control-sm" id="uom-${rowCount}"></select>
			<div class="uom-error" style="color:red; display:none;"></div>
	    </div>     

	    <div class="form-group col-md-1">
	        <input type="number" class="form-control form-control-sm text-right"
	            id="qty-${rowCount}" placeholder="Quantity"
	            autocomplete="off" 
	            oninput="calculateTotal(${rowCount});" min="0">
				<div class="qty-error" style="color:red; display:none;"></div>
	    </div>

	    <div class="form-group col-md-1">
		<input type="number" class="form-control form-control-sm text-right"
				       id="kg-${rowCount}" placeholder="Quantity" onkeydown="return allowOnlyPositive(event)"
				       oninput="calculateTotal(${rowCount})" min="0" step="0.01">
				<div class="kg-error" style="color:red; display:none;"></div>
	    </div>

	    <div class="form-group col-md-2">
	        <input type="number" class="form-control form-control-sm text-right"
	            id="uniprice-${rowCount}" placeholder="Unit Price"
	            autocomplete="off" onkeydown="return allowOnlyPositive(event)"
	            oninput="calculateTotal(${rowCount});" min="0">
				<div class="unitprice-error" style="color:red; display:none;"></div>
	    </div>

	    <div class="form-group col-md-2">
	        <select class="form-control form-control-sm"
	            id="type-${rowCount}"></select>
				<div class="type-error" style="color:red; display:none;"></div>
	    </div>

	    <div class="form-group col-md-1">
	        <input type="text" class="form-control form-control-sm text-right"
	            id="total-${rowCount}" readonly>
	    </div>

	    <div class="form-group col-md-1 text-center">
	        <i class="bi bi-trash text-danger"
	           style="cursor:pointer; font-size:16px;"
	           onclick="removeRow(${rowCount});"
	           title="Delete"></i>
	    </div>
	`;
    
    // Append the new row to the container
    container.appendChild(row);

    // Call the function to populate UOM and Type for this row
    fetchuom(rowCount);
    fetctype(rowCount);
    
    // Call the function to update grand total
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
   /* const kg = parseFloat(document.getElementById(`kg-${rowId}`).value) || 0;*/
    const unitPrice = parseFloat(document.getElementById(`uniprice-${rowId}`).value) || 0;

    // Calculate the total
	const total = quantity * unitPrice;
   /* const total = kg * unitPrice;*/

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
        uomSelect.innerHTML = `<option value="">Select UOM</option>`;

        // Populate UOM dropdown options
        json.Data.forEach((type) => {
            if (type.unit_id && type.unit_name) {
                const option = document.createElement("option");
                option.value = type.unit_id;
                option.textContent = type.unit_name;
                uomSelect.appendChild(option);
            }
        });
		
		initSelect2(`uom-${rowId}`, 'Select UOM');
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
		
		initSelect2(`type-${rowId}`, 'Select Type');
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

/*async function fetchinvoicetype() {
    try {
        const url = new URL(`/jssl/master/listinvoicetypenew`, baseUrl1);
        const selectedFactoryId = sessionStorage.getItem("selectedFactoryId");

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch invoicetype");

        const json = await response.json();

        if (json.status !== "yes" || !json.INVOICE_TYPE_LIST.length) {
            console.warn("No invoicetype found.");
            return;
        }

        const selectElement = document.getElementById("invoice");

        selectElement.innerHTML = `<option value="">Select invoicetype</option>`;

        json.INVOICE_TYPE_LIST.forEach((invoicetype) => {
            if (invoicetype.type_no && invoicetype.type && invoicetype.type !== "SCRAP") {
                const option = document.createElement("option");
                option.value = invoicetype.type_no;
                option.textContent = invoicetype.type;
                selectElement.appendChild(option);
            }
        });

        // Use onchange (not addEventListener) so the handler is never added twice
        selectElement.onchange = function () {
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            const selectedText = selectedOption ? selectedOption.text.trim().toUpperCase() : "";

            const contractsel = document.getElementById("cont");
            const mileSelect = document.getElementById("mile");

            // Clear dropdowns
            contractsel.innerHTML = '<option value="">Select Contract</option>';
            mileSelect.innerHTML = '<option value="">Select Milestone</option>';

            // Steel and Jobwork both load contracts
            const loadsContracts = ["STEEL", "JOBWORK", "JOB WORK"];
            if (loadsContracts.includes(selectedText)) {
                fetchcont(selectedFactoryId);
            }
        };

    } catch (error) {
        console.error("Error fetching invoice types:", error);
    }
}*/


async function fetchinvoicetype() {
    try {
        const url = new URL(`/jssl/master/listinvoicetypenew`, baseUrl1);
        const selectedFactoryId = sessionStorage.getItem("selectedFactoryId");

        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch invoicetype");
        const json = await response.json();

        if (json.status !== "yes" || !json.INVOICE_TYPE_LIST.length) {
            console.warn("No invoicetype found.");
            return;
        }

        const selectElement = document.getElementById("invoice");
        selectElement.innerHTML = `<option value="">Select invoicetype</option>`;

        json.INVOICE_TYPE_LIST.forEach((invoicetype) => {
            if (invoicetype.type_no && invoicetype.type && invoicetype.type !== "SCRAP") {
                const option = document.createElement("option");
                option.value = invoicetype.type_no;
                option.textContent = invoicetype.type;
                selectElement.appendChild(option);
            }
        });

        initSelect2('invoice', 'Select invoicetype');

        $('#invoice').off('change.inv').on('change.inv', function () {
            const selectedText = ($('#invoice option:selected').text() || "").trim().toUpperCase();

            $('#cont').html('<option value="">Select Contract</option>');
            $('#mile').html('<option value="">Select Milestone</option>');
            initSelect2('cont', 'Select contractor');
            initSelect2('mile', 'Select milestone');

            if (["STEEL", "JOBWORK", "JOB WORK"].includes(selectedText)) {
                fetchcont(selectedFactoryId);
            }
        });
    } catch (error) {
        console.error("Error fetching invoice types:", error);
    }
}

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

        initSelect2('cont', 'Select contractor');

        $('#cont').off('change.cont').on('change.cont', function () {
            const selectedContractId = this.value;
            if (selectedContractId) {
                fetchmile(factoryId, selectedContractId);
            } else {
                $('#mile').html(`<option value="">Select milestone</option>`);
                initSelect2('mile', 'Select milestone');
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

        initSelect2('mile', 'Select milestone');
        $('#mile').val('').trigger('change');   // reset selection and hide the details section
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

let currentFactoryIdChallan = null;

function fetchUserList(selectedFactoryId) {

    currentFactoryIdChallan = selectedFactoryId ||
                              sessionStorage.getItem("selectedFactoryId");

    //  Destroy existing DataTable
    if ($.fn.DataTable.isDataTable('#tableID')) {
        $('#tableID').DataTable().clear().destroy();
    }

    //  Server-side DataTable
    $('#tableID').DataTable({
        processing: false,
        serverSide: true,
        scrollX: true,
        searching: true,
        dom: 'Bfrtip',
        pageLength: 10,
        buttons: [
            {
                text: 'Export to Excel',
                action: function () {

                    const url = new URL(`/jssl/qschallanpackingmaster/listnewpaged`, baseUrl);
                    url.searchParams.append('factory_id', currentFactoryIdChallan);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {

                            const exportData = json.QSPACKING.map(item => [
                                item.contract_name  || '',
                                item.milestone_name || '',
                                item.load_id        || '',
                                item.invgen         || ''
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
                                    title: 'QS Challan Packing List'
                                }]
                            }).button(0).trigger();

                            setTimeout(() => {
                                $(tempTable).DataTable().destroy();
                                $(tempTable).remove();
                            }, 1000);
                        })
                        .catch(error => console.error('Export error:', error));
                }
            }
        ],
        columns: [
            { title: "Contract Name"  },
            { title: "Milestone Name" },
            { title: "Lot Number"     },
            { title: "Status"         },
            { title: "Edit",  orderable: false },
            { title: "View",  orderable: false }
        ],
        ajax: function (data, callback, settings) {

            const page = data.start / data.length;
            const size = data.length;
			const searchValue = data.search.value;
			

            const url = new URL(`/jssl/qschallanpackingmaster/listnewpaged`, baseUrl);
            url.searchParams.append('factory_id', currentFactoryIdChallan);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
			url.searchParams.append('search', searchValue);

            fetch(url, { credentials: "include" })
                .then(response => response.json())
                .then(json => {

                    if (!json.QSPACKING || json.status === 'error') {
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });
                        return;
                    }

                    const rows = json.QSPACKING.map(item => {

                        let editIcon = '';
                        let viewIcon = '';

                        if (item.invgen === 'INOVICE NOT GENERATED') {
                            editIcon = `<i class="fa fa-edit" style="color:blue;" onclick="editRecord('${item.pn_id}')"></i>`;
                            viewIcon = `<i class="fa fa-eye text-muted"></i>`;
                        } else {
                            editIcon = `<i class="fa fa-edit text-muted"></i>`;
                            viewIcon = `<i class="fa fa-eye" style="color:green;" onclick="editRecord1('${item.pn_id}')"></i>`;
                        }

                        return [
                            item.contract_name  || '',  // col 0
                            item.milestone_name || '',  // col 1
                            item.load_id        || '',  // col 2
                            item.invgen         || '',  // col 3
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
                .catch(error => {
                    console.error('Error fetching challan data:', error);
                    callback({
                        draw: data.draw,
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        data: []
                    });
                });
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

/*function openModalAdd() {
   // const freig = document.getElementById('freig').value.trim();
    const file = document.getElementById('file').value.trim();
	const transportname = document.getElementById('transname').value.trim();
	const vehicleno = document.getElementById('vehino').value.trim();
    let showError = false;

    // Freight Validation
    if (transportname === '') {
        document.getElementById('transportnameerror').innerText = "Please enter Transportname.";
        document.getElementById('transportnameerror').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('transportnameerror').innerText = "";
        document.getElementById('transportnameerror').style.display = "none";
    }

	if (vehicleno === '') {
	        document.getElementById('vehiclenoerror').innerText = "Please enter Vehicleno.";
	        document.getElementById('vehiclenoerror').style.display = "inline-block";
	        showError = true;
	    } else {
	        document.getElementById('vehiclenoerror').innerText = "";
	        document.getElementById('vehiclenoerror').style.display = "none";
	    }

    // File Validation
    if (file === '') {
        document.getElementById('fileerror').innerText = "Please select a file";
        document.getElementById('fileerror').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('fileerror').innerText = "";
        document.getElementById('fileerror').style.display = "none";
    }

    // UOM Validation
    let uomValid = true;
    document.querySelectorAll(".dynamic-row").forEach(function (row) {
        const uom = row.querySelector('select[id^="uom-"]').value.trim();
        if (uom === '') {
            uomValid = false;
            row.querySelector('.uom-error').innerText = "Please select UOM.";
            row.querySelector('.uom-error').style.display = "inline-block";
        } else {
            row.querySelector('.uom-error').innerText = "";
            row.querySelector('.uom-error').style.display = "none";
        }
    });

    // Type Validation
    let typeValid = true;
    document.querySelectorAll(".dynamic-row").forEach(function (row) {
        const type = row.querySelector('select[id^="type-"]').value.trim();
        if (type === '') {
            typeValid = false;
            row.querySelector('.type-error').innerText = "Please select Type.";
            row.querySelector('.type-error').style.display = "inline-block";
        } else {
            row.querySelector('.type-error').innerText = "";
            row.querySelector('.type-error').style.display = "none";
        }
    });

    // Quantity Validation
    let qtyValid = true;
    document.querySelectorAll(".dynamic-row").forEach(function (row) {
        const qty = row.querySelector('input[id^="qty-"]').value.trim();
        if (qty === '' || isNaN(qty) || qty <= 0) {
            qtyValid = false;
            row.querySelector('.qty-error').innerText = "Please enter a valid Quantity.";
            row.querySelector('.qty-error').style.display = "inline-block";
        } else {
            row.querySelector('.qty-error').innerText = "";
            row.querySelector('.qty-error').style.display = "none";
        }
    });

    // Kg Validation
    let kgValid = true;
    document.querySelectorAll(".dynamic-row").forEach(function (row) {
        const kg = row.querySelector('input[id^="kg-"]').value.trim();
        if (kg === '' || isNaN(kg) || kg <= 0) {
            kgValid = false;
            row.querySelector('.kg-error').innerText = "Please enter a valid Kg.";
            row.querySelector('.kg-error').style.display = "inline-block";
        } else {
            row.querySelector('.kg-error').innerText = "";
            row.querySelector('.kg-error').style.display = "none";
        }
    });

    // Unit Price Validation
    let unitPriceValid = true;
    document.querySelectorAll(".dynamic-row").forEach(function (row) {
        const unitPrice = row.querySelector('input[id^="uniprice-"]').value.trim();
        if (unitPrice === '' || isNaN(unitPrice) || unitPrice <= 0) {
            unitPriceValid = false;
            row.querySelector('.unitprice-error').innerText = "Please enter a valid Unit Price.";
            row.querySelector('.unitprice-error').style.display = "inline-block";
        } else {
            row.querySelector('.unitprice-error').innerText = "";
            row.querySelector('.unitprice-error').style.display = "none";
        }
    });

    // Pieces Validation
    let piecesValid = true;
    document.querySelectorAll(".dynamic-row").forEach(function (row) {
        const pieces = row.querySelector('input[id^="pice-"]').value.trim();
        if (pieces === '' || isNaN(pieces) || pieces <= 0) {
            piecesValid = false;
            row.querySelector('.pieces-error').innerText = "Please enter a valid number of Pieces.";
            row.querySelector('.pieces-error').style.display = "inline-block";
        } else {
            row.querySelector('.pieces-error').innerText = "";
            row.querySelector('.pieces-error').style.display = "none";
        }
    });

    if (showError || !uomValid || !typeValid || !qtyValid || !kgValid || !unitPriceValid) {
        return;
    }

    $('#exampleModalCenter66').modal('show');
}*/

function openModalAdd() {
    let showError = false;

    function required(id, errId, msg) {
        if (String($('#' + id).val() || '').trim() === '') {
            setFieldError(errId, msg); showError = true;
        } else setFieldError(errId, '');
    }

    required('invoice', 'invoiceError', 'Please select Invoice Type.');
    const invType = ($('#invoice option:selected').text() || '').trim().toUpperCase();
    if (invType === 'GP') {                       // contractor/milestone are disabled for GP
        setFieldError('contError', ''); setFieldError('mileError', '');
    } else {
        required('cont', 'contError', 'Please select Contractor.');
        required('mile', 'mileError', 'Please select Milestone.');
    }

    required('transname', 'transportnameerror', 'Please enter Transport Name.');
    required('vehino',    'vehiclenoerror',     'Please enter Vehicle No.');
    required('file',      'fileerror',          'Please select a file.');

    function rowError(row, sel, msg, bad) {
        const el = row.querySelector(sel);
        if (!el) return;
        el.innerText = bad ? msg : "";
        el.style.display = bad ? "inline-block" : "none";
        if (bad) showError = true;
    }
    function badNum(input) {
        const v = input.value.trim();
        return v === '' || isNaN(v) || parseFloat(v) <= 0;
    }

    document.querySelectorAll("#dynamicRowsContainer .dynamic-row").forEach(function (row) {
        rowError(row, '.uom-error',       'Please select UOM.',               row.querySelector('select[id^="uom-"]').value.trim() === '');
        rowError(row, '.type-error',      'Please select Type.',              row.querySelector('select[id^="type-"]').value.trim() === '');
        rowError(row, '.qty-error',       'Please enter a valid Quantity.',   badNum(row.querySelector('input[id^="qty-"]')));
        rowError(row, '.kg-error',        'Please enter a valid Kg.',         badNum(row.querySelector('input[id^="kg-"]')));
        rowError(row, '.unitprice-error', 'Please enter a valid Unit Price.', badNum(row.querySelector('input[id^="uniprice-"]')));
    });

    if (showError) return;
    $('#exampleModalCenter66').modal('show');
}

// Fetch factory ID
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

// Add Event Function
function addevent() {
	$('#exampleModalCenter66').modal('hide');
	const selectedinvoicetype_id =document.getElementById("invoice").selectedOptions[0];
	const invoice = selectedinvoicetype_id ? selectedinvoicetype_id.value : '';
    // Validate role code and role description
  //  const selectedLoad = document.getElementById("load").selectedOptions[0]; // Get the selected option
  //  const LoadId = selectedLoad ? selectedLoad.value : ''; // Get the contract_id
    //const LoadName = selectedLoad ? selectedLoad.textContent : ''; // Get the contract_name

    // Arrays to collect the values from the dynamic rows
    const qtyArray = [];
    const perKgsArray = [];
    const unitPriceArray = [];
    const totalArray = [];
    const uomArray = [];
    const typeArray = [];
    //const picesArray = [];

    // Loop over each row to collect values (assuming the rows have a class 'dynamic-row')
  //  const rows = document.querySelectorAll('.dynamic-row');
	const rows = document.querySelectorAll('#dynamicRowsContainer .dynamic-row');   // was '.dynamic-row'
    console.warn(rows);
    rows.forEach(row => {
        const qty = row.querySelector('[id^="qty"]').value.trim();
        const perKgs = row.querySelector('[id^="kg"]').value.trim();
        const unitPrice = row.querySelector('[id^="uniprice"]').value.trim();
        const total = row.querySelector('[id^="total"]').value.trim();
        const uom = row.querySelector('[id^="uom"]').value.trim();
        const type = row.querySelector('[id^="type"]').value.trim();
        //const pices = row.querySelector('[id^="pice"]').value.trim();
console.warn(uom)
        // Only push values that are not empty (to avoid duplicates and empty values)
        if (qty) qtyArray.push(qty);
        if (perKgs) perKgsArray.push(perKgs);
        if (unitPrice) unitPriceArray.push(unitPrice);
        if (total) totalArray.push(total);
        if (uom) uomArray.push(uom);
        if (type) typeArray.push(type);
        //if (pices) picesArray.push(pices);
    });

    // Join the values into comma-separated strings
    const qtyString = qtyArray.join(',');
    const perKgsString = perKgsArray.join(',');
    const unitPriceString = unitPriceArray.join(',');
    const totalString = totalArray.join(',');
    const uomString = uomArray.join(',');
    const typeString = typeArray.join(',');
    //const picesString = picesArray.join(',');

    // Get the file input element
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0]; // Get the selected file

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('contract_id', cont.value);
	formData.append('invoice_type_id', invoice);
   // formData.append('load_id', load);
    //formData.append('lot_no', LoadName);
    formData.append('transport_name', transname.value);
    formData.append('vechile_no', vehino.value);
    //formData.append('freight', freig.value);
    formData.append('milestone_id', mile.value);
    formData.append('qty', qtyString);
    formData.append('per_kgs', perKgsString);
    formData.append('unit_price', unitPriceString);
    formData.append('total', totalString);
    formData.append('UOM_id', uomString);
    formData.append('type_id', typeString);
    //formData.append('pices', picesString);
    formData.append('grand_total', totalNo.value);
    formData.append('created_by', createdById);
    formData.append('factory_id', selectedFactoryId);
	//formData.append('gpid', GPno.value);
    
    if (file) {
		formData.append('filepath', file); // Correct key // Append file only if selected
    }

    // Make the AJAX request
    $.ajax({
        url: new URL('/jssl/QSCHALLAN_PACKINGNOTE_MASTER/addnew', baseUrl),
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
                const popup = $('<div class="popup">Delivery challan packing Note Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ChallanPackingNote.jsp'; // Redirect to role list page
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

    const container = document.getElementById("dynamicRowsContaineredit");
    if (!container) return;

    // Sum totals from "new" rows
    container.querySelectorAll('[id^="total_new_"]').forEach(field => {
        const val = parseFloat(field.value) || 0;
        grandTotal += val;
    });

    // Sum totals from "existing/update" rows
    container.querySelectorAll('[id^="total_"]:not([id^="total_new_"])').forEach(field => {
        const val = parseFloat(field.value) || 0;
        grandTotal += val;
    });

    // Update the Grand Total field
    const grandTotalField = document.getElementById("totalNoedit");
    if (grandTotalField) {
        grandTotalField.value = grandTotal.toFixed(2);
    }
}


let newSlno = 0; // Set default SL No. to 0 instead of auto-incrementing

/*function addRowEdit() {
    const container = document.getElementById("dynamicRowsContaineredit");
    const rowIndex = container.children.length;

    let newSlno = 0;

    const newRow = document.createElement("div");
    newRow.classList.add("form-row", "dynamic-row", "mb-2");
    newRow.id = `row_${rowIndex}`;

    newRow.innerHTML = `
        <div class="form-group col-md-2">
            <select class="form-control form-control-sm" id="uom_new_${rowIndex}">
                ${uomOptionsHTML || `<option value="">Select uom</option>`}
            </select>
        </div>

        <div class="form-group col-md-1">
            <input type="number" class="form-control form-control-sm text-right"
                id="qty_new_${rowIndex}" placeholder="Qty" onkeydown="return allowOnlyPositive(event)">
        </div>

        <div class="form-group col-md-1">
            <input type="number" class="form-control form-control-sm text-right"
                id="kg_new_${rowIndex}" onkeydown="return allowOnlyPositive(event)"
                placeholder="Kg"
                oninput="calculateRowTotaledit(${rowIndex})">
        </div>

        <div class="form-group col-md-2">
            <input type="number" class="form-control form-control-sm text-right"
                id="unit_price_new_${rowIndex}" onkeydown="return allowOnlyPositive(event)"
                placeholder="Unit Price"
                oninput="calculateRowTotaledit(${rowIndex})">
        </div>

        <div class="form-group col-md-2">
            <select class="form-control form-control-sm" id="type_new_${rowIndex}">
                ${typeOptionsHTML || `<option value="">Select type</option>`}
            </select>
        </div>

        <div class="form-group col-md-1">
            <input type="number" class="form-control form-control-sm text-right"
                id="total_new_${rowIndex}" readonly>
        </div>

        <div class="form-group col-md-1 text-center">
            <i class="bi bi-trash text-danger"
                style="cursor:pointer; font-size:16px;"
                onclick="deleteRow1(${rowIndex})"
                title="Delete"></i>
        </div>
    `;

    container.appendChild(newRow);
}*/



function addRowEdit() {
    const container = document.getElementById("dynamicRowsContaineredit");
    const rowIndex = Date.now();

    const newRow = document.createElement("div");
    newRow.classList.add("form-row", "dynamic-row", "mb-2");
    newRow.id = `row_new_${rowIndex}`;

    newRow.innerHTML = `
        <div class="form-group col-md-2">
            <select class="form-control form-control-sm" id="uom_new_${rowIndex}">
                ${uomOptionsHTML || `<option value="">Select UOM</option>`}
            </select>
            <div class="uom-error" style="color:red; display:none;"></div>
        </div>

        <div class="form-group col-md-1">
            <input type="number" class="form-control form-control-sm text-right"
                   id="qty_new_${rowIndex}" placeholder="Qty" min="0"
                   onkeydown="return allowOnlyPositive(event)"
                   oninput="calculateRowTotaledit(${rowIndex})">
            <div class="qty-error" style="color:red; display:none;"></div>
        </div>

        <div class="form-group col-md-1">
            <input type="number" class="form-control form-control-sm text-right"
                   id="kg_new_${rowIndex}" placeholder="Kg" min="0" step="0.01"
                   onkeydown="return allowOnlyPositive(event)"
                   oninput="calculateRowTotaledit(${rowIndex})">
            <div class="kg-error" style="color:red; display:none;"></div>
        </div>

        <div class="form-group col-md-2">
            <input type="number" class="form-control form-control-sm text-right"
                   id="unit_price_new_${rowIndex}" placeholder="Unit Price" min="0"
                   onkeydown="return allowOnlyPositive(event)"
                   oninput="calculateRowTotaledit(${rowIndex})">
            <div class="unitprice-error" style="color:red; display:none;"></div>
        </div>

        <div class="form-group col-md-2">
            <select class="form-control form-control-sm" id="type_new_${rowIndex}">
                ${typeOptionsHTML || `<option value="">Select Type</option>`}
            </select>
            <div class="type-error" style="color:red; display:none;"></div>
        </div>

        <div class="form-group col-md-1">
            <input type="number" class="form-control form-control-sm text-right"
                   id="total_new_${rowIndex}" readonly>
        </div>

        <div class="form-group col-md-1 text-center">
            <i class="bi bi-trash text-danger"
               style="cursor:pointer; font-size:16px;"
               onclick="deleteRow1('row_new_${rowIndex}')"
               title="Delete"></i>
        </div>
    `;

    container.appendChild(newRow);

    initSelect2(`uom_new_${rowIndex}`, 'Select UOM');
    initSelect2(`type_new_${rowIndex}`, 'Select Type');
}

function deleteRow1(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.remove();
        updateGrandTotal();
    } else {
        console.error("Row not found:", rowId);
    }
}


function editRecord(pn_id) {
				//  const allowed = window.allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/qschallanpackingmastersearchnew`, baseUrl);
    url.search = new URLSearchParams({ pn_id: pn_id }).toString();

    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {

            if (data.status !== "yes" || !Array.isArray(data.DATA) || data.DATA.length === 0) {
                alert("No records found!");
                return;
            }

            const records = data.DATA;
            const firstRecord = records[0];

            /* ---------------- MASTER DATA ---------------- */
            document.getElementById("contedit").value = firstRecord.contract_name || "";
            document.getElementById("mileedit").value = firstRecord.milestone_name || "";
            document.getElementById("vehicleno").value = firstRecord.vechile_no || "";
            document.getElementById("transportname").value = firstRecord.transport_name || "";
            document.getElementById("totalNoedit").value = parseFloat(firstRecord.grand_total || 0).toFixed(2);
            document.getElementById("pnidedit").value = firstRecord.pn_id || "";

            /* ---------------- FILE DATA ---------------- */
            const filePath = firstRecord.filepath || "";
            const fileName = filePath.includes("@$@_") ? filePath.split("@$@_")[1] : "";
            document.getElementById("fileNameDisplay").innerHTML = fileName || "No file uploaded";
            document.getElementById("existing_filepath").value = filePath;

            /* ---------------- CLEAR ITEMS ---------------- */
            const dynamicContainer = document.getElementById("dynamicRowsContaineredit");
            dynamicContainer.innerHTML = "";

            /* ---------------- FILTER VALID ITEMS ---------------- */
            const itemRecords = records.filter(r => r.slno && parseInt(r.slno) > 0);

            /* ---------------- CREATE ROWS ---------------- */
            itemRecords.forEach((record, index) => {
                const newRow = document.createElement("div");
                newRow.className = "form-row dynamic-row mb-2";
                newRow.id = `row_${index}`;

              /*  newRow.innerHTML = `
                    <!-- UOM -->
                    <div class="form-group col-md-2">
                        <select class="form-control form-control-sm" id="uom_${index}">
                            ${uomOptionsHTML || `<option value="">Select UOM</option>`}
                        </select>
                    </div>

                    <!-- Quantity -->
                    <div class="form-group col-md-1">
                        <input type="number"
                               class="form-control form-control-sm text-right"
                               id="qty_${index}"
                               value="${parseFloat(record.qty || 0).toFixed(2)}"
                               oninput="calculateRowTotalupdate(${index})">
                    </div>

                    <!-- Kgs/MT/Sqm -->
                    <div class="form-group col-md-1">
                        <input type="number"
                               class="form-control form-control-sm text-right"
                               id="kg_${index}" onkeydown="return allowOnlyPositive(event)"
                               value="${parseFloat(record.per_kgs || 0).toFixed(2)}"
                               oninput="calculateRowTotalupdate(${index})">
                    </div>

                    <!-- Unit Price -->
                    <div class="form-group col-md-2">
                        <input type="number"
                               class="form-control form-control-sm text-right"
                               id="unit_price_${index}" onkeydown="return allowOnlyPositive(event)"
                               value="${parseFloat(record.unit_price || 0).toFixed(2)}"
                               oninput="calculateRowTotalupdate(${index})">
                    </div>

                    <!-- Type -->
                    <div class="form-group col-md-2">
                        <select class="form-control form-control-sm" id="type_${index}">
                            ${typeOptionsHTML || `<option value="">Select Type</option>`}
                        </select>
                    </div>

                    <!-- Total -->
                    <div class="form-group col-md-1">
                        <input type="text"
                               class="form-control form-control-sm text-right"
                               id="total_${index}"
                               value="${parseFloat(record.total || 0).toFixed(2)}"
                               readonly>
                    </div>

                    <!-- Hidden SLNO -->
                    <div class="form-group col-md-1" style="display:none;">
                        <input type="text" id="slno_${index}" value="${record.slno}">
                    </div>

                    <!-- Action -->
                    <div class="form-group col-md-1 text-center">
                        <i class="bi bi-trash text-danger"
                           style="cursor:pointer; font-size:18px;"
                           onclick="deleteRow(${index})"
                           title="Delete"></i>
                    </div>
                `;*/
				
				
				newRow.innerHTML = `
				    <div class="form-group col-md-2">
				        <select class="form-control form-control-sm" id="uom_${index}">
				            ${uomOptionsHTML || `<option value="">Select UOM</option>`}
				        </select>
				        <div class="uom-error" style="color:red; display:none;"></div>
				    </div>

				    <div class="form-group col-md-1">
				        <input type="number" class="form-control form-control-sm text-right"
				               id="qty_${index}" onkeydown="return allowOnlyPositive(event)"
				               value="${parseFloat(record.qty || 0).toFixed(2)}"
				               oninput="calculateRowTotalupdate(${index})">
				        <div class="qty-error" style="color:red; display:none;"></div>
				    </div>

				    <div class="form-group col-md-1">
				        <input type="number" class="form-control form-control-sm text-right"
				               id="kg_${index}" onkeydown="return allowOnlyPositive(event)"
				               value="${parseFloat(record.per_kgs || 0).toFixed(2)}"
				               oninput="calculateRowTotalupdate(${index})">
				        <div class="kg-error" style="color:red; display:none;"></div>
				    </div>

				    <div class="form-group col-md-2">
				        <input type="number" class="form-control form-control-sm text-right"
				               id="unit_price_${index}" onkeydown="return allowOnlyPositive(event)"
				               value="${parseFloat(record.unit_price || 0).toFixed(2)}"
				               oninput="calculateRowTotalupdate(${index})">
				        <div class="unitprice-error" style="color:red; display:none;"></div>
				    </div>

				    <div class="form-group col-md-2">
				        <select class="form-control form-control-sm" id="type_${index}">
				            ${typeOptionsHTML || `<option value="">Select Type</option>`}
				        </select>
				        <div class="type-error" style="color:red; display:none;"></div>
				    </div>

				    <div class="form-group col-md-1">
				        <input type="text" class="form-control form-control-sm text-right"
				               id="total_${index}"
				               value="${parseFloat(record.total || 0).toFixed(2)}" readonly>
				    </div>

				    <div class="form-group col-md-1" style="display:none;">
				        <input type="text" id="slno_${index}" value="${record.slno}">
				    </div>

				    <div class="form-group col-md-1 text-center">
				        <i class="bi bi-trash text-danger"
				           style="cursor:pointer; font-size:18px;"
				           onclick="deleteRow(${index})"
				           title="Delete"></i>
				    </div>
				`;

            /*    dynamicContainer.appendChild(newRow);

                // Set UOM and Type dropdowns
                document.getElementById(`uom_${index}`).value = record.uom_id || "";
                document.getElementById(`type_${index}`).value = record.type_id || "";*/
				
				
				dynamicContainer.appendChild(newRow);

				document.getElementById(`uom_${index}`).value = record.uom_id || "";
				document.getElementById(`type_${index}`).value = record.type_id || "";

				initSelect2(`uom_${index}`, 'Select UOM');
				initSelect2(`type_${index}`, 'Select Type');
            });

            /* ---------------- SHOW MODAL ---------------- */
            $("#exampleModalScrollable123update").modal("show");

            /* ---------------- FORCE GRAND TOTAL RECALC ---------------- */
            updateGrandTotal();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Failed to load challan data.");
        });
}

function editRecord1(pn_id) {
	//const allowed = window.allowedActions || [];

		if (!allowed.includes("view")) {
		  alert(" You do not have permission to view.");
		    $("#exampleachallanModalScrollable123view").modal("hide");
		  return;
		}
		
    const url = new URL(`/jssl/qschallanpackingmastersearchnew`, baseUrl);
    url.search = new URLSearchParams({ pn_id: pn_id }).toString();

    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {

            if (data.status !== "yes" || !Array.isArray(data.DATA) || data.DATA.length === 0) {
                alert("No records found!");
                return;
            }

            const records = data.DATA;
            const firstRecord = records[0];

            /* ---------------- MASTER DATA ---------------- */
            document.getElementById("contview").value = firstRecord.contract_name || "";
            document.getElementById("mileview").value = firstRecord.milestone_name || "";
            document.getElementById("vehiclenoview").value = firstRecord.vechile_no || "";
            document.getElementById("transportnameview").value = firstRecord.transport_name || "";
            document.getElementById("totalNoview").value = parseFloat(firstRecord.grand_total || 0).toFixed(2);
            document.getElementById("pnidview").value = firstRecord.pn_id || "";

            /* ---------------- FILE DATA ---------------- */
            const filePath = firstRecord.filepath || "";
            const fileName = filePath.includes("@$@_") ? filePath.split("@$@_")[1] : "";
            document.getElementById("fileNameDisplayview").innerHTML = fileName || "No file uploaded";
            document.getElementById("existing_filepath").value = filePath;

            /* ---------------- CLEAR ITEMS ---------------- */
			const dynamicContainer = document.getElementById("dynamicRowsContainerview1");
			dynamicContainer.innerHTML = "";

			const itemRecords = records.filter(r => r.slno && parseInt(r.slno) > 0);

			itemRecords.forEach((record, index) => {

			    const newRow = document.createElement("div");
			    newRow.className = "form-row mb-2 align-items-center";

			    newRow.innerHTML = `
			        <!-- UOM -->
			        <div class="col-md-1">
			            <select class="form-control form-control-sm" id="uom_${index}" disabled>
			                ${uomOptionsHTML}
			            </select>
			        </div>

			        <!-- Quantity -->
			        <div class="col-md-2">
			            <input type="number" class="form-control form-control-sm text-right"
			                   value="${parseFloat(record.qty || 0).toFixed(2)}" readonly>
			        </div>

			        <!-- Kgs/MT/Sqm -->
			        <div class="col-md-2">
			            <input type="number" class="form-control form-control-sm text-right"
			                   value="${parseFloat(record.per_kgs || 0).toFixed(2)}" readonly>
			        </div>

			        <!-- Unit Price -->
			        <div class="col-md-2">
			            <input type="number" class="form-control form-control-sm text-right"
			                   value="${parseFloat(record.unit_price || 0).toFixed(2)}" readonly>
			        </div>

			        <!-- Type -->
			        <div class="col-md-2">
			            <select class="form-control form-control-sm" id="type_${index}" disabled>
			                ${typeOptionsHTML}
			            </select>
			        </div>

			        <!-- Total -->
			        <div class="col-md-1">
			            <input type="text" class="form-control form-control-sm text-right"
			                   value="${parseFloat(record.total || 0).toFixed(2)}" readonly>
			        </div>
			    `;

			    dynamicContainer.appendChild(newRow);

			    document.getElementById(`uom_${index}`).value = record.uom_id || "";
			    document.getElementById(`type_${index}`).value = record.type_id || "";
			});

            /* ---------------- SHOW MODAL ---------------- */
            $("#exampleachallanModalScrollable123view").modal("show");

            /* ---------------- FORCE GRAND TOTAL RECALC ---------------- */
            updateGrandTotal();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Failed to load challan data.");
        });
}


function deleteRow(rowIndex) {
    const container = document.getElementById("dynamicRowsContaineredit");

    // Get the slno value for the row to be deleted
    const slnoField = document.getElementById(`slno_${rowIndex}`);
    const slnoValue = slnoField ? slnoField.value : null;

    $.ajax({
        url: new URL('/jssl/qschallanpackingitemmaster/deletenew', baseUrl),
        type: 'POST',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: {
            slno: slnoValue,
            modified_by: createdById
        },
        success: function (data) {
            if (data.message === "Success") {

                // ✅ Remove the row from DOM
                const row = document.getElementById(`row_${rowIndex}`);
                if (row) row.remove();

                // ✅ Recalculate total
                updateGrandTotal();

                // ✅ Check if no rows left
                if (container.children.length === 0) {
                    const popup = $('<div class="popup">Item Deleted Successfully</div>')
                        .appendTo('body').hide().fadeIn(300);

                    setTimeout(() => {
                        popup.fadeOut(300, () => popup.remove());

                        // 🔁 Redirect to Challan list page OR reload list
                        window.location = 'ChallanPackingNote.jsp';
                        // OR if you want to stay on same page: fetchChallanList(factoryId);
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


function deleteRow1(rowIndex) {
    // Get the row element to be deleted
    const row = document.getElementById(`row_${rowIndex}`);
    
    // Remove the row from the DOM
    if (row) {
        row.remove();
		updateGrandTotal();
    } else {
        console.error("Row not found!");
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
    //var freigedit = document.getElementById('freigedit').value.trim();   var vehiedit = document.getElementById('vehiclenoerroredit').
    var vehiedit = document.getElementById("vehicleno").value.trim();
    var transedit = document.getElementById("transportname").value.trim();
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
        document.getElementById('vehiclenoerroredit').innerText = "Please Enter vehicle no.";
        document.getElementById('vehiclenoerroredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('vehiclenoerroredit').innerText = "";
        document.getElementById('vehiclenoerroredit').style.display = "none";
    }
    
    if (transedit === '') {
        document.getElementById('transportnameerroredit').innerText = "Please Enter transporter name.";
        document.getElementById('transportnameerroredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('transportnameerroredit').innerText = "";
        document.getElementById('transportnameerroredit').style.display = "none";
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
    let showError = false;

    function required(id, errId, msg) {
        if (String($('#' + id).val() || '').trim() === '') {
            setFieldError(errId, msg); showError = true;
        } else setFieldError(errId, '');
    }

    required('transportname', 'transportnameerroredit', 'Please enter Transport Name.');
    required('vehicleno',     'vehiclenoerroredit',     'Please enter Vehicle No.');
    required('fileedit',      'fileediterror',          'Please select new file.');

    function rowError(row, sel, msg, bad) {
        const el = row.querySelector(sel);
        if (!el) return;
        el.innerText = bad ? msg : "";
        el.style.display = bad ? "inline-block" : "none";
        if (bad) showError = true;
    }
    function badNum(input) {
        const v = input.value.trim();
        return v === '' || isNaN(v) || parseFloat(v) <= 0;
    }

    document.querySelectorAll("#dynamicRowsContaineredit .dynamic-row").forEach(function (row) {
        rowError(row, '.uom-error',       'Please select UOM.',               row.querySelector("select[id^='uom_']").value.trim() === '');
        rowError(row, '.type-error',      'Please select Type.',              row.querySelector("select[id^='type_']").value.trim() === '');
        rowError(row, '.qty-error',       'Please enter a valid Quantity.',   badNum(row.querySelector("input[id^='qty_']")));
        rowError(row, '.kg-error',        'Please enter a valid Kg.',         badNum(row.querySelector("input[id^='kg_']")));
        rowError(row, '.unitprice-error', 'Please enter a valid Unit Price.', badNum(row.querySelector("input[id^='unit_price_']")));
    });

    if (showError) return;
    $('#exampleModalCenter66update').modal('show');
}

function updateevent() {
	$('#exampleModalCenter66update').modal('hide');
    // Create a new FormData object
    var formData = new FormData();

    /* -------------------- COLLECT DYNAMIC VALUES -------------------- */
 /*   function collectValues(prefix) {
        const values = [];
        // New items
        document.querySelectorAll('[id^="' + prefix + '_new_"]').forEach(el => {
            if (el.value.trim() !== "") values.push(el.value.trim());
        });
        // Existing items
        document.querySelectorAll('[id^="' + prefix + '_"]:not([id^="' + prefix + '_new_"])').forEach(el => {
            if (el.value.trim() !== "") values.push(el.value.trim());
        });
        return values;
    }*/

	
	function collectValues(prefix) {
	    const scope = document.getElementById('dynamicRowsContaineredit');
	    const values = [];
	    scope.querySelectorAll('[id^="' + prefix + '_new_"]').forEach(el => {
	        if (el.value.trim() !== "") values.push(el.value.trim());
	    });
	    scope.querySelectorAll('[id^="' + prefix + '_"]:not([id^="' + prefix + '_new_"])').forEach(el => {
	        if (el.value.trim() !== "") values.push(el.value.trim());
	    });
	    return values;
	}
	
	
    var qtyArr = collectValues('qty');
    var perKgsArr = collectValues('kg');
    var unitPriceArr = collectValues('unit_price');
    var totalArr = collectValues('total');
    var uomIdArr = collectValues('uom');
    var typeIdArr = collectValues('type');
    var slnoArr = collectValues('slno'); // only non-empty values

    /* -------------------- FILE DUPLICATE CHECK -------------------- */
    const fileInput = document.getElementById('fileedit');
    const existingFilePath = document.getElementById("existing_filepath").value || '';

    if (fileInput.files.length > 0 && existingFilePath !== '') {
        const newFileName = fileInput.files[0].name;
        let existingOriginalFileName = existingFilePath.includes('_@$@_') 
            ? existingFilePath.split('_@$@_').pop() 
            : existingFilePath;

        if (newFileName === existingOriginalFileName) {
            $('#errorMessage').text('The selected file is already uploaded. Please choose a different file.');
            $('#exampleModalCenter66update').modal('hide');
            $('#exampleModalScrollable123update').modal('hide');
            setTimeout(function () {
                $('#exampleModalCenterDup').modal({ backdrop: 'static', keyboard: false });
            }, 300);
            return; // Stop update if duplicate
        }
    }

    /* -------------------- APPEND FILE -------------------- */
    if (fileInput.files.length > 0) {
        formData.append('filepath', fileInput.files[0]);
    }
    formData.append('existing_filepath', existingFilePath);

    /* -------------------- APPEND MASTER FIELDS -------------------- */
    formData.append('transport_name', transportname.value);
    formData.append('vechile_no', vehicleno.value);
    formData.append('modified_by', createdById);
    formData.append('factory_id', selectedFactoryId);
    formData.append('pn_id', pnidedit.value);
    formData.append('grand_total', totalNoedit.value);

    /* -------------------- APPEND ITEM ARRAYS -------------------- */
    qtyArr.forEach(q => formData.append('qty', q));
    perKgsArr.forEach(k => formData.append('per_kgs', k));
    unitPriceArr.forEach(u => formData.append('unit_price', u));
    totalArr.forEach(t => formData.append('total', t));
    uomIdArr.forEach(u => formData.append('UOM_id', u));
    typeIdArr.forEach(t => formData.append('type_id', t));
    slnoArr.forEach(s => formData.append('slno', s)); // optional, only non-empty

    /* -------------------- AJAX CALL -------------------- */
    $.ajax({
        url: new URL('/jssl/qschallanpackingmaster/updatenew', baseUrl),
        type: 'POST',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            if (data.status === "yes") {
                $('<div class="popup">Delivery challan Packing note Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400)
                    .delay(800).fadeOut(400, function () { $(this).remove(); window.location = 'ChallanPackingNote.jsp'; });
            } else if (data.action === "NO_CHANGE") {
                $('<div class="popup">No fields were changed.</div>')
                    .appendTo('body').hide().fadeIn(400)
                    .delay(1000).fadeOut(400, function () { $(this).remove(); $('#exampleModalCenter66update').modal('hide'); });
            } else {
                const errorMessage = data.message || 'Failed to update record.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
                $('#exampleModalCenter66update').modal('hide');
                $('#exampleModalScrollable123update').modal('hide');
            }
        },
        error: function () { console.error('Request failed.'); }
    });
}

document.getElementById('eyeIconBtn').addEventListener('click', function() {
    // Get the value from the hidden Pnid field
    var pnid = document.getElementById('pnidedit').value;

    if (pnid) {
        // Prepare the API URL with the id parameter
        const url = new URL(`/jssl/qschallanpackingmaster/viewpdfnew`, baseUrl);
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
        const url = new URL(`/jssl/qschallanpackingmaster/viewpdfnew`, baseUrl);
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


async function fetchRGPno(factoryId) {
    try {
        const url = new URL(`/jssl/invoice/gpno_nonsecurity`, baseUrl1);
        url.searchParams.append("factory_id", factoryId);

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch RPGno");

        const json = await response.json();


        const selectElement = document.getElementById("GPno");
        selectElement.innerHTML = `<option value="">Select GP Number</option>`;

        json.forEach((type) => {
            if (type.gpid && type.gp_no) {
                const option = document.createElement("option");
                option.value = type.gpid;
                option.textContent = type.gp_no;
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching Gpno:", error);
    }
}

$(document).ready(function () {

    $("#invoice").change(function () {

        var invoiceType = $("#invoice option:selected").text().trim().toUpperCase();

        if (invoiceType === "GP") {

            $("#GPno").prop("disabled", false);

            // Set Contractor and Milestone to "Others"
			$("#cont").prop("disabled", true);
			$("#mile").prop("disabled", true);
			inputFieldsContainer.style.display = "block";
			
            // If using Select2 or Bootstrap Select, refresh if needed
            // $("#cont").trigger("change");
            // $("#mile").trigger("change");

            // loadGpNumbers();

        } else {

            $("#GPno").prop("disabled", true).val("").empty();
			$("#cont").prop("disabled", false);
			$("#mile").prop("disabled", false);
			inputFieldsContainer.style.display = "none";
            fetchRGPno(selectedFactoryId);
        }

    });

});

	$("#GPno").on("change", function () {
	
	    const gpNo = $("#GPno option:selected").text().trim();
		const gpid = this.value;
	
	    if (!gpNo || gpNo === "Select GP No") {
	        $("#dynamicRowsContainer").empty();
	        calculateGrandTotal();
	        return;
	    }
		const returnableUrl = new URL(`/api/returnable/${gpid}`, baseUrl1);

		fetch(returnableUrl, { credentials: "include" })
		    .then(response => response.json())
		    .then(data => {

		        // If API returns an array
		        if (Array.isArray(data) && data.length > 0) {
		            $("#transname").val(data[0].transportName || "");
		            $("#vehino").val(data[0].vehicleNo || "");
		        }
		        // If API returns a single object
		        else {
		            $("#transname").val(data.transportName || "");
		            $("#vehino").val(data.vehicleNo || "");
		        }

		    })
		    .catch(error => {
		        console.error("Error fetching transport details:", error);
		    });
			
	    const url = new URL(`/jssl/contracts/jims/gpnoitemdetails`, baseUrl1);
	    url.search = new URLSearchParams({
	        gp_no: gpNo
	    }).toString();
	
	    fetch(url, { credentials: "include" })
	        .then(response => response.json())
	        .then(data => {
	
	            const dynamicContainer = document.getElementById("dynamicRowsContainer");
	            dynamicContainer.innerHTML = "";
	
	            data.forEach((record, index) => {
	
	                const newRow = document.createElement("div");
	                newRow.className = "form-row dynamic-row mb-2";
	                newRow.id = `row_${index}`;
	
					newRow.innerHTML = `
					    <!-- UOM -->
					    <div class="form-group col-md-2">
					        <select class="form-control form-control-sm" id="uom-${index}"></select>
					        <div class="uom-error" style="color:red; display:none;"></div>
					    </div>
	
					    <!-- Quantity -->
					    <div class="form-group col-md-1">
					        <input type="number"
					               class="form-control form-control-sm text-right"
					               id="qty-${index}"
					               value="${parseFloat(record.qty || 0).toFixed(2)}"
					               oninput="calculateTotal(${index})"
					               min="0">
					        <div class="qty-error" style="color:red; display:none;"></div>
					    </div>
	
					    <!-- Kgs -->
					    <div class="form-group col-md-1">
					        <input type="number"
					               class="form-control form-control-sm text-right"
					               id="kg-${index}"
					               value="${parseFloat(record.per_kgs || 0).toFixed(2)}"
					               oninput="calculateTotal(${index})"
					               min="0">
					        <div class="kg-error" style="color:red; display:none;"></div>
					    </div>
	
					    <!-- Unit Price -->
					    <div class="form-group col-md-2">
					        <input type="number"
					               class="form-control form-control-sm text-right"
					               id="uniprice-${index}"
					               value="${parseFloat(record.itmPrice || 0).toFixed(2)}"
					               oninput="calculateTotal(${index})"
					               min="0">
					        <div class="unitprice-error" style="color:red; display:none;"></div>
					    </div>
	
					    <!-- Type -->
					    <div class="form-group col-md-2">
					        <select class="form-control form-control-sm" id="type-${index}"></select>
					        <div class="type-error" style="color:red; display:none;"></div>
					    </div>
	
					    <!-- Total -->
					    <div class="form-group col-md-1">
					        <input type="text"
					               class="form-control form-control-sm text-right"
					               id="total-${index}"
					               value="${parseFloat(record.total || 0).toFixed(2)}"
					               readonly>
					    </div>
	
					    <!-- Delete -->
					    <div class="form-group col-md-1 text-center">
					        <i class="bi bi-trash text-danger"
					           style="cursor:pointer; font-size:16px;"
					           onclick="removeRow(${index});"
					           title="Delete"></i>
					    </div>
					`;
	
	                dynamicContainer.appendChild(newRow);
	
	                // Set dropdown values
	              
					
					
					fetctype(index);
				/*	fetchuom(index).then(() => {
					    $(`#uom-${index}`).val(record.UM);
					});*/
					
					fetchuom(index).then(() => {
					    $(`#uom-${index}`).val(record.UM).trigger('change');
					});
					// Call the function to update grand total
					calculateGrandTotal();
	               
	            });
	
	        })
	        .catch(error => {
	            console.error("Error fetching GP items:", error);
	            alert("Failed to load GP items.");
	        });
	
	});
	
	
	
	function hideError(el) { el.innerText = ""; el.style.display = "none"; }

	// Row dropdowns (UOM / Type): native change + Select2's own event
	$(document).on('change select2:select', '.dynamic-row select', function () {
	    if (String($(this).val() || '').trim() !== '') {
	        $(this).closest('[class*="col-"]').find('.uom-error, .type-error').each(function () { hideError(this); });
	    }
	});

	// Row numbers (Qty / Kg / Unit Price)
	$(document).on('input change', '.dynamic-row input[type="number"]', function () {
	    const v = this.value.trim();
	    if (v !== '' && !isNaN(v) && parseFloat(v) > 0) {
	        $(this).closest('[class*="col-"]').find('[class$="-error"]').each(function () { hideError(this); });
	    }
	});

	// Header selects
	const headerErrorMap = { invoice: 'invoiceError', cont: 'contError', mile: 'mileError' };
	$(document).on('change select2:select', '#invoice, #cont, #mile', function () {
	    if (String($(this).val() || '').trim() !== '') setFieldError(headerErrorMap[this.id], '');
	});

	// Text fields and files
	$(document).on('input', '#transname',     () => setFieldError('transportnameerror', ''));
	$(document).on('input', '#vehino',        () => setFieldError('vehiclenoerror', ''));
	$(document).on('input', '#transportname', () => setFieldError('transportnameerroredit', ''));
	$(document).on('input', '#vehicleno',     () => setFieldError('vehiclenoerroredit', ''));
	$(document).on('change', '#file',     function () { if (this.value) setFieldError('fileerror', ''); });
	$(document).on('change', '#fileedit', function () { if (this.value) setFieldError('fileediterror', ''); });

	// Reset all messages when a modal closes
	$('#exampleModalScrollable123, #exampleModalScrollable123update').on('hidden.bs.modal', function () {
	    $(this).find('.error-message, [class$="-error"]').hide().text('');
	});