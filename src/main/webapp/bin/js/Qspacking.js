

let allowed = null;


document.getElementById("modalScroll1").addEventListener("click", function () {
    // show custom message instead of opening modal
	  //const allowed = window.allowedActions || [];

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
	const factoryId = localStorage.getItem("selectedFactoryId");
	if (factoryId) {
	    fetchUserList(factoryId);
	}
});

// Function to add a new row
function addRow() {
    // Get the container where rows will be added
    const container = document.getElementById("dynamicRowsContainer");
    
    // Increment the rowCount for unique IDs
    rowCount++;

    // Create a new row
    const row = document.createElement("div");
    row.classList.add("form-row", "mt-3", "dynamic-row","align-items-center");
    row.setAttribute("data-row-id", rowCount); // Set a custom attribute for identifying the row

    // Add the input fields for serial no, uom, type, kg, quantity, unit price, total, pieces
    row.innerHTML = `
        <div class="form-group col-md-2">
         
            <select class="form-control form-control-sm" id="uom-${rowCount}"></select>
            <div class="uom-error" style="color:red; display:none;"></div>
        </div>
        <div class="form-group col-md-2">
           
            <select class="form-control form-control-sm" id="type-${rowCount}"></select>
            <div class="type-error" style="color:red; display:none;"></div>
        </div>
        <div class="form-group col-md-2">
         
            <input type="number" class="form-control form-control-sm text-right" id="qty-${rowCount}" placeholder="Quantity" autocomplete="off" oninput="calculateTotal(${rowCount});" min="0">
            <div class="qty-error" style="color:red; display:none;"></div>
        </div>
        <div class="form-group col-md-2">
         
            <input type="number" class="form-control form-control-sm text-right" id="kg-${rowCount}" placeholder="Kg" autocomplete="off" oninput="calculateTotal(${rowCount});" min="0">
            <div class="kg-error" style="color:red; display:none;"></div>
        </div>
        <div class="form-group col-md-2">
          
            <input type="number" class="form-control form-control-sm text-right" id="uniprice-${rowCount}" placeholder="Unit Price" autocomplete="off" oninput="calculateTotal(${rowCount});" min="0">
            <div class="unitprice-error" style="color:red; display:none;"></div>
        </div>
        <div class="form-group col-md-1">
         
            <input type="text" class="form-control form-control-sm text-right" id="total-${rowCount}" placeholder="Total" readonly>
        </div>
        <!--  <div class="form-group col-md-1">
          
            <input type="number" class="form-control form-control-sm text-right" id="pice-${rowCount}" placeholder="Pieces" autocomplete="off" min="0">
            <div class="pieces-error" style="color:red; display:none;"></div>
        </div> -->
		<div class="form-group col-md-1 text-center">
		 
		    <!-- Delete icon -->
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
        const selectedFactoryId = localStorage.getItem("selectedFactoryId");
        if (!selectedFactoryId) {
            console.error("No factory ID found in localStorage.");
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
    } catch (error) {
        console.error("Error fetching UOM data:", error);
    }
}

// Fetch Type data and populate the Type dropdown for a specific row
async function fetctype(rowId) {
    try {
        const selectedFactoryId = localStorage.getItem("selectedFactoryId");
        if (!selectedFactoryId) {
            console.error("No factory ID found in localStorage.");
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
    } catch (error) {
        console.error("Error fetching Type data:", error);
    }
}

    
// Get the factory_id
document.addEventListener("DOMContentLoaded", function() {
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchcont(selectedFactoryId);  // Fetch contractors initially
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

// Fetching the dropdown list for contractors
async function fetchcont(factoryId) {
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
			const inputFieldsContainer = document.getElementById("inputFieldsContainer");
			inputFieldsContainer.style.display = "none";
			const loadSelect = document.getElementById("load");
							   loadSelect.value = "";
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
			const inputFieldsContainer = document.getElementById("inputFieldsContainer");
						inputFieldsContainer.style.display = "none";
            const selectedContractId = document.getElementById("cont").value; // Get selected contractor
            const selectedMilestoneName = selectElement.value; // Get selected milestone
            if (selectedContractId && selectedMilestoneName) {
                fetchLoad(factoryId, selectedContractId, selectedMilestoneName);  // Fetch loads based on selected factory_id, contract_id, and milestone_name
            } else {
                // If no contract or milestone is selected, clear the load dropdown
                const loadSelect = document.getElementById("load");
                loadSelect.innerHTML = `<option value="">Select load</option>`;
            }
        });

    } catch (error) {
        console.error("Error fetching milestones:", error);
    }
}

// Fetching the dropdown list for loads
async function fetchLoad(factoryId, contractId, milestoneName) {
	

    try {
        // Construct the API URL properly
        const url = new URL(`/jssl/contract/g2/listloadforcontractorbasedonfactory`, baseUrl);
        url.searchParams.append("factory_id", factoryId); // Append factory_id
        url.searchParams.append("contract_id", contractId); // Append contract_id
        url.searchParams.append("milestone_id", milestoneName); // Append milestone_name

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
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
}

/*async function fetchUserList(selectedFactoryId) {
	try {
        
        // Construct the API URL
        const url = new URL(`/jssl/qspackingmaster/listnew`, baseUrl);
        url.searchParams.append('factory_id', selectedFactoryId);

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

        json.QSPACKING.forEach(item => {
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
                    <td>${item.lot_no}</td>
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





let currentFactoryIdQSPacking = null;

function fetchUserList(selectedFactoryId) {

    currentFactoryIdQSPacking = selectedFactoryId ||
                                localStorage.getItem("selectedFactoryId");

    // Destroy existing DataTable
    if ($.fn.DataTable.isDataTable('#tableID')) {
        $('#tableID').DataTable().clear().destroy();
    }

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

                    const url = new URL(`/jssl/qspackingmaster/listnewpaged`, baseUrl);
                    url.searchParams.append('factory_id', currentFactoryIdQSPacking);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {

                            const exportData = json.QSPACKING.map(item => [
                                item.contract_name  || '',
                                item.milestone_name || '',
                                item.lot_no         || '',
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
                                    title: 'QS Packing List'
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
            { title: "Edit", orderable: false },
            { title: "View", orderable: false }
        ],
        ajax: function (data, callback, settings) {

            const page = data.start / data.length;
            const size = data.length;
			const searchValue = data.search.value;

            const url = new URL(`/jssl/qspackingmaster/listnewpaged`, baseUrl);
            url.searchParams.append('factory_id', currentFactoryIdQSPacking);
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
                            item.lot_no         || '',  // col 2
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
                    console.error('Error fetching QS packing data:', error);
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
document.getElementById('load').addEventListener('change', function() {
    const loadValue = this.value;  // Get the selected value of the "Load" dropdown

	
	
    const inputFieldsContainer = document.getElementById("inputFieldsContainer");

    if (loadValue) {
        // If a load is selected, show the "inputFieldsContainer"
		fectchtransportandvehcileno(loadValue);
        inputFieldsContainer.style.display = "block";
    } else {
        // If no load is selected, hide the "inputFieldsContainer"
        inputFieldsContainer.style.display = "none";
    }
});


function fectchtransportandvehcileno(load_id) {

    const factory_id = document.getElementById("factory_id")?.value || 1;

    fetch(`${baseUrl}/jssl/invoice/g2/getrasportname?load_id=${load_id}&factory_id=${factory_id}`, {
        method: "GET",
        credentials: "include", // ✅ important for session/cookies
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {

        if (data.status === "yes" && data.Data.length > 0) {

            const transport = data.Data[0];

            document.getElementById("vehi").value = transport.trailerref?.trim() || "";
            document.getElementById("trans").value = transport.company?.trim() || "";

        } else {
            document.getElementById("vehi").value = "";
            document.getElementById("trans").value = "";
        }

    })
    .catch(error => {
        console.error("Error fetching transport details:", error);
    });
}
function openModalAdd() {
   // var freig = document.getElementById('freig').value.trim();
   // var vehi = document.getElementById('vehi').value.trim();
    //var trans = document.getElementById('trans').value.trim();
	var file = document.getElementById('file').value.trim();
    var showError = false; // Initialize showError variable

    // Freight Validation
   /* if (freig === '') {
        document.getElementById('Freighterror').innerText = "Please enter Freight.";
        document.getElementById('Freighterror').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('Freighterror').innerText = "";
        document.getElementById('Freighterror').style.display = "none";
    }*/

    // Vehicle Validation
  /*  if (vehi === '') {
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
    document.querySelectorAll(".dynamic-row").forEach(function(row) {
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
    document.querySelectorAll(".dynamic-row").forEach(function(row) {
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
    document.querySelectorAll(".dynamic-row").forEach(function(row) {
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
    document.querySelectorAll(".dynamic-row").forEach(function(row) {
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
    document.querySelectorAll(".dynamic-row").forEach(function(row) {
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
    //var piecesValid = true;
    /*document.querySelectorAll(".dynamic-row").forEach(function(row) {
        var pieces = row.querySelector('input[id^="pice-"]').value.trim();
        if (pieces === '' || isNaN(pieces) || pieces <= 0) {
            piecesValid = false;
            row.querySelector('.pieces-error').innerText = "Please enter a valid number of Pieces.";
            row.querySelector('.pieces-error').style.display = "inline-block";
        } else {
            row.querySelector('.pieces-error').innerText = "";
            row.querySelector('.pieces-error').style.display = "none";
        }
    });*/

    // If any error exists, prevent form submission
    if (showError || !uomValid || !typeValid || !qtyValid || !kgValid || !unitPriceValid) {
        return; // Do not proceed with opening the modal if validation fails
    }

    // If no errors, proceed
    $('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
}

// Fetch selectedFactoryId from localStorage
const selectedFactoryId = localStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

function addevent() {
	// Hide confirmation modal immediately to prevent duplicate clicks
	   $('#exampleModalCenter66').modal('hide');
    // Validate role code and role description
    const selectedLoad = document.getElementById("load").selectedOptions[0]; // Get the selected option
    const LoadId = selectedLoad ? selectedLoad.value : ''; // Get the contract_id
    const LoadName = selectedLoad ? selectedLoad.textContent : ''; // Get the contract_name

    // Arrays to collect the values from the dynamic rows
    const qtyArray = [];
    const perKgsArray = [];
    const unitPriceArray = [];
    const totalArray = [];
    const uomArray = [];
    const typeArray = [];
    //const picesArray = [];

    // Loop over each row to collect values (assuming the rows have a class 'dynamic-row')
    const rows = document.querySelectorAll('.dynamic-row');
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
    formData.append('con_id', cont.value);
    formData.append('load_id', LoadId);
    formData.append('lot_no', LoadName);
    formData.append('transport_name', trans.value);
    formData.append('vechile_no', vehi.value);
    formData.append('freight', freig.value);
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
    
    if (file) {
        formData.append('file', file); // Append file only if selected
    }

    // Make the AJAX request
    $.ajax({
        url: new URL('/jssl/qspackingmaster/addnew', baseUrl),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: formData,
        processData: false, // Important: prevent jQuery from processing the data
        contentType: false, // Important: prevent jQuery from setting contentType
        success: function(data) {
            var result = data.message; // No need to stringify

            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">SteelPacking Note Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'QApackage.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create Qs packing.';
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
    
    // Sum totals from "new" rows
    const newTotalFields = document.querySelectorAll('[id^="total_new_"]');
    newTotalFields.forEach(field => {
        grandTotal += parseFloat(field.value) || 0;
    });
    
    // Sum totals from "update" rows
    // This selector picks elements that start with "total_" but NOT "total_new_"
    const updateTotalFields = document.querySelectorAll('[id^="total_"]:not([id^="total_new_"])');
    updateTotalFields.forEach(field => {
        grandTotal += parseFloat(field.value) || 0;
    });
    
    // Update the Grand Total field
    document.getElementById("totalNoedit").value = grandTotal.toFixed(2);
}

let newSlno = 0; // Set default SL No. to 0 instead of auto-incrementing

function addRowEdit() {
    const container = document.getElementById("dynamicRowsContaineredit");
    const rowIndex = container.children.length;

    // Set SL No. to always be 0 for new rows
    let newSlno = 0;

    // Create a new row
    const newRow = document.createElement("div");
    newRow.classList.add("form-row", "dynamic-row", "mt-3", "align-items-center");
    newRow.id = `row_${rowIndex}`;

    newRow.innerHTML = `
        <div class="form-group col-md-1" style="display:none;">
          
            <input type="number" class="form-control form-control-sm" id="slno_new_${rowIndex}" value="${newSlno}" readonly>
        </div>
        <div class="form-group col-md-1">
           
            <select class="form-control form-control-sm" id="uom_new_${rowIndex}">
                ${uomOptionsHTML || `<option value="">Select uom</option>`}
            </select>
        </div>
        <div class="form-group col-md-2">
          
            <select class="form-control form-control-sm" id="type_new_${rowIndex}">
                ${typeOptionsHTML || `<option value="">Select type</option>`}
            </select>
        </div>
        <div class="form-group col-md-2">
        
            <input type="number" class="form-control form-control-sm text-right" id="qty_new_${rowIndex}" value="">
        </div>
        <div class="form-group col-md-2">
          
            <input type="number" class="form-control form-control-sm text-right" id="kg_new_${rowIndex}" value="" oninput="calculateRowTotaledit(${rowIndex})">
        </div>
        <div class="form-group col-md-2">
        
            <input type="number" class="form-control form-control-sm text-right" id="unit_price_new_${rowIndex}" value="" oninput="calculateRowTotaledit(${rowIndex})">
        </div>
        <div class="form-group col-md-1">
           
            <input type="number" class="form-control form-control-sm text-right" id="total_new_${rowIndex}" value="" readonly>
        </div>
        <!--  <div class="form-group col-md-1">
        
            <input type="number" class="form-control form-control-sm text-right" id="pieces_new_${rowIndex}" value="">
        </div> -->
		<div class="form-group col-md-1 text-center">
		 
		    <!-- Delete icon -->
		    <i class="bi bi-trash text-danger" 
		       style="cursor:pointer; font-size:16px;" 
		       onclick="deleteRow1(${rowIndex})" 
		       title="Delete"></i>
		</div>
    `;

    // Append the new row to the container
    container.appendChild(newRow);
}

function editRecord(pn_id) {
    //const allowed = window.allowedActions || [];

    if (!allowed.includes("Edit")) {
        alert(" You do not have permission to edit.");
        return;
    }

    const url = new URL(`/jssl/qspackingmastersearchnew`, baseUrl);
    var params = [['pn_id', pn_id]];
    url.search = new URLSearchParams(params).toString();

    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data.status === "yes" && Array.isArray(data.DATA) && data.DATA.length > 0) {
                let records = data.DATA;
                let firstRecord = records[0];

                // Populate static fields
                document.getElementById("contedit").value = firstRecord.contract_name || "";
                document.getElementById("mileedit").value = firstRecord.milestone_name || "";
                document.getElementById("loadedit").value = firstRecord.lot_no || "";
                document.getElementById("freigedit").value = firstRecord.freight || "";
                document.getElementById("vehiedit").value = firstRecord.vechile_no || "";
                document.getElementById("transedit").value = firstRecord.transport_name || "";
                document.getElementById("totalNoedit").value = parseFloat(firstRecord.grand_total || 0).toFixed(2);
                document.getElementById("pnidedit").value = firstRecord.pn_id || "";

                // File display
                let filePath = firstRecord.filepath || "";
                let fileName = filePath.split("@$@_")[1] || "";
                document.getElementById("fileNameDisplay").innerHTML = fileName ? `${fileName}` : "No file uploaded";

                // ✅ Set hidden input for existing file
                document.getElementById("existing_filepath").value = filePath || "";

                // Clear and render dynamic rows (unchanged)
                let dynamicContainer = document.getElementById("dynamicRowsContaineredit");
                dynamicContainer.innerHTML = "";
                records.forEach((record, index) => {
                    let newRow = document.createElement("div");
                    newRow.classList.add("form-row", "dynamic-row", "align-items-center");
                    newRow.id = `row_${index}`; // Set a unique ID for each row

                    newRow.innerHTML = `
                        <div class="form-group col-md-1">
                         
                            <select class="form-control form-control-sm" id="uom_${index}">
                                ${uomOptionsHTML || `<option value="">Select uom</option>`}
                            </select>
                        </div>
                        <div class="form-group col-md-2">
                         
                            <select class="form-control form-control-sm" id="type_${index}">
                                ${typeOptionsHTML || `<option value="">Select type</option>`}
                            </select>
                        </div>
                        <div class="form-group col-md-2">
                        
                            <input type="number" class="form-control form-control-sm text-right" id="qty_${index}" value="${parseFloat(record.qty || 0).toFixed(2)}">
                        </div>
                        <div class="form-group col-md-2">
                        
                            <input type="number" class="form-control form-control-sm text-right" id="kg_${index}" value="${parseFloat(record.per_kgs || 0).toFixed(2)}" oninput="calculateRowTotalupdate(${index})">
                        </div>
                        <div class="form-group col-md-2">
                         
                            <input type="number" class="form-control form-control-sm text-right" id="unit_price_${index}" value="${parseFloat(record.unit_price || 0).toFixed(2)}" oninput="calculateRowTotalupdate(${index})">
                        </div>
                        <div class="form-group col-md-1">
                         
                            <input type="number" class="form-control form-control-sm text-right" id="total_${index}" value="${parseFloat(record.total || 0).toFixed(2)}" readonly>
                        </div>
                        <!--  <div class="form-group col-md-1">
                           
                            <input type="number" class="form-control form-control-sm" id="pieces_${index}" value="${parseInt(record.pices || 0)}">
                        </div> -->
                        <div class="form-group col-md-1" style="display:none;">
                           
                            <input type="text" class="form-control form-control-sm text-right" id="slno_${index}" value="${parseInt(record.slno || 0)}">
                        </div>
                        <!-- Add the Delete Button -->
						<div class="form-group col-md-1 text-center">
						
						    <!-- Delete icon -->
						    <i class="bi bi-trash text-danger" 
						       style="cursor:pointer; font-size:16px;" 
						       onclick="deleteRow(${index})" 
						       title="Delete"></i>
						</div>
                    `;

                    dynamicContainer.appendChild(newRow);

                    // Set the default selected value for the Uom dropdown.
                    const uomSelect = newRow.querySelector(`#uom_${index}`);
                    if (uomSelect) {
                        uomSelect.value = record.uom_id || "";
                    }
                    
                    // Set the default selected value for the Type dropdown.
                    const typeSelect = newRow.querySelector(`#type_${index}`);
                    if (typeSelect) {
                        typeSelect.value = record.type_id || "";
                    }
                });
				updateGrandTotal();
                // Show the modal
                $("#exampleModalScrollable123update").modal("show");
            } else {
                alert("No records found!");
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function editRecord1(pn_id) {
  //  const allowed = window.allowedActions || [];

    if (!allowed.includes("view")) {
        alert(" You do not have permission to view.");
        return;
    }

    const url = new URL(`/jssl/qspackingmastersearchnew`, baseUrl);
    var params = [['pn_id', pn_id]];
    url.search = new URLSearchParams(params).toString();

    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data.status === "yes" && Array.isArray(data.DATA) && data.DATA.length > 0) {
                let records = data.DATA;
                let firstRecord = records[0];

                // Populate static fields
                document.getElementById("contview").value = firstRecord.contract_name || "";
                document.getElementById("mileview").value = firstRecord.milestone_name || "";
                document.getElementById("loadview").value = firstRecord.lot_no || "";
                document.getElementById("freigview").value = firstRecord.freight || "";
                document.getElementById("vehiview").value = firstRecord.vechile_no || "";
                document.getElementById("transview").value = firstRecord.transport_name || "";
                document.getElementById("totalNoview").value = parseFloat(firstRecord.grand_total || 0).toFixed(2);
                document.getElementById("pnidview").value = firstRecord.pn_id || "";

                // File display
                let filePath = firstRecord.filepath || "";
                let fileName = filePath.split("@$@_")[1] || "";
                document.getElementById("fileNameDisplayview").innerHTML = fileName ? `${fileName}` : "No file uploaded";

                // ✅ Set hidden input for existing file
                document.getElementById("existing_filepath").value = filePath || "";
				
				var fileInput = document.getElementById('fileview');
				if (fileInput && fileInput.files.length > 0) {
				    formData.append('file', fileInput.files[0]);
				}
                // Clear and render dynamic rows (unchanged)
                let dynamicContainer = document.getElementById("dynamicRowsContainerview");
                dynamicContainer.innerHTML = "";
                records.forEach((record, index) => {
                    let newRow = document.createElement("div");
                    newRow.classList.add("form-row", "dynamic-row", "align-items-center");
                    newRow.id = `row_${index}`; // Set a unique ID for each row

                    newRow.innerHTML = `
                        <div class="form-group col-md-1">
                         
                            <select class="form-control form-control-sm" id="uom_${index}"disabled>
                                ${uomOptionsHTML || `<option value="">Select uom</option>`}
                            </select>
                        </div>
                        <div class="form-group col-md-2">
                         
                            <select class="form-control form-control-sm" id="type_${index}"disabled>
                                ${typeOptionsHTML || `<option value="">Select type</option>`}
                            </select>
                        </div>
                        <div class="form-group col-md-2">
                        
                            <input type="number" class="form-control form-control-sm text-right" id="qty_${index}" value="${parseFloat(record.qty || 0).toFixed(2)}"readonly>
                        </div>
                        <div class="form-group col-md-2">
                        
                            <input type="number" class="form-control form-control-sm text-right" id="kg_${index}" value="${parseFloat(record.per_kgs || 0).toFixed(2)}" oninput="calculateRowTotalupdate(${index})"readonly>
                        </div>
                        <div class="form-group col-md-2">
                         
                            <input type="number" class="form-control form-control-sm text-right" id="unit_price_${index}" value="${parseFloat(record.unit_price || 0).toFixed(2)}" oninput="calculateRowTotalupdate(${index})"readonly>
                        </div>
                        <div class="form-group col-md-1">
                         
                            <input type="number" class="form-control form-control-sm text-right" id="total_${index}" value="${parseFloat(record.total || 0).toFixed(2)}" readonly>
                        </div>
                        <!--  <div class="form-group col-md-1">
                           
                            <input type="number" class="form-control form-control-sm text-right" id="pieces_${index}" value="${parseInt(record.pices || 0)}">
                        </div> -->
                        <div class="form-group col-md-1" style="display:none;">
                           
                            <input type="text" class="form-control form-control-sm text-right" id="slno_${index}" value="${parseInt(record.slno || 0)}">
                        </div>
                        <!-- Add the Delete Button -->
						<div class="form-group col-md-1 text-center">
						
						</div>
                    `;

                    dynamicContainer.appendChild(newRow);

                    // Set the default selected value for the Uom dropdown.
                    const uomSelect = newRow.querySelector(`#uom_${index}`);
                    if (uomSelect) {
                        uomSelect.value = record.uom_id || "";
                    }
                    
                    // Set the default selected value for the Type dropdown.
                    const typeSelect = newRow.querySelector(`#type_${index}`);
                    if (typeSelect) {
                        typeSelect.value = record.type_id || "";
                    }
                });
                // Show the modal
                $("#exampleModalScrollable123view").modal("show");
            } else {
                alert("No records found!");
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function deleteRow(rowIndex) {
	updateGrandTotal();
    // Get the container for dynamic rows
    const container = document.getElementById("dynamicRowsContaineredit");
    
    // Check the total number of rows before deleting
    const totalRows = container.children.length;

    // If there is only one row, prevent deletion
    if (totalRows === 1) {
        alert("You cannot delete the last row!");
        return; // Exit the function if it's the only row
    }

    // Get the slno value for the row to be deleted
    const slnoField = document.getElementById(`slno_${rowIndex}`);
    const slnoValue = slnoField ? slnoField.value : null;
	const pn_id =document.getElementById("pnidedit").value
    // Make the AJAX request to the server
    $.ajax({
        url: new URL('/jssl/qspackingitemmaster/deletenew', baseUrl),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({
            slno: slnoValue,
            modified_by: createdById,
			pn_id: pn_id
        }),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Item Deleted Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'QApackage.jsp';
                    });
                }, 800);
            } else {
               $('#errorMessage').text(data.message || 'Failed to update record.');
			   $('#exampleModalScrollable123update').modal('hide');
			   $('#exampleModalCenterDup').modal('show');
			  
            }
        },
        error: function () {
            console.error('Request failed.');
            alert('An error occurred while deleting the item.');
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
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchuomEdit();
        fetchtypeEdit();
    } else {
        console.error("No factory ID found in localStorage.");
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
function openModalUpdate() {
    //var freigedit = document.getElementById('freigedit').value.trim();
   // var vehiedit = document.getElementById('vehiedit').value.trim();
   // var transedit = document.getElementById('transedit').value.trim();
   var filename = document.getElementById('fileedit').value.trim();
    var showError = false; // Initialize showError variable

    // Validate static fields
	if (filename === '') {
	      document.getElementById('fileediterror').innerText = "Please select new file.";
	      document.getElementById('fileediterror').style.display = "inline-block";
	      showError = true;
	  } else {
	      document.getElementById('fileediterror').innerText = "";
	      document.getElementById('fileediterror').style.display = "none";
	  }
    /*if (freigedit === '') {
        document.getElementById('Freighterroredit').innerText = "Please Enter freight.";
        document.getElementById('Freighterroredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('Freighterroredit').innerText = "";
        document.getElementById('Freighterroredit').style.display = "none";
    }*/
    
    /*if (vehiedit === '') {
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
    }*/
   
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
        //var piecesField = row.querySelector("input[id^='pieces_']");

        // Reset border style before validation
        if(uomField) uomField.style.border = "";
        if(typeField) typeField.style.border = "";
        if(qtyField) qtyField.style.border = "";
        if(kgField) kgField.style.border = "";
        if(unitPriceField) unitPriceField.style.border = "";
        //if(piecesField) piecesField.style.border = "";

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
        /*if(piecesField && piecesField.value.trim() === ""){
            piecesField.style.border = "1px solid red";
            showError = true;
        }*/
    });
   
    // If no errors, proceed to show the next modal
    if (!showError) {
        $('#exampleModalCenter66update').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function updateevent() {
	
	$('#exampleModalCenter66update').modal('hide');
    /* ===============================
       Create FormData
       =============================== */
    var formData = new FormData();

    /* ===============================
       Helper to collect values
       =============================== */
    function collectValues(newSelector, oldSelector) {
        var arr = [];

        document.querySelectorAll(newSelector).forEach(function (el) {
            arr.push(el.value.trim());
        });

        document.querySelectorAll(oldSelector).forEach(function (el) {
            arr.push(el.value.trim());
        });

        return arr;
    }

    /* ===============================
       Collect all lists
       =============================== */
    var qtyArr        = collectValues('[id^="qty_new_"]',        '[id^="qty_"]:not([id^="qty_new_"])');
    var perKgsArr     = collectValues('[id^="kg_new_"]',         '[id^="kg_"]:not([id^="kg_new_"])');
    var unitPriceArr  = collectValues('[id^="unit_price_new_"]', '[id^="unit_price_"]:not([id^="unit_price_new_"])');
    var totalArr      = collectValues('[id^="total_new_"]',      '[id^="total_"]:not([id^="total_new_"])');
    var uomIdArr      = collectValues('[id^="uom_new_"]',        '[id^="uom_"]:not([id^="uom_new_"])');
    var typeIdArr     = collectValues('[id^="type_new_"]',       '[id^="type_"]:not([id^="type_new_"])');
    var slnoArr       = collectValues('[id^="slno_new_"]',       '[id^="slno_"]:not([id^="slno_new_"])');

    /* ===============================
       Append LIST values (Controller expects List<String>)
       =============================== */
    qtyArr.forEach(v       => formData.append('qty', v));
    perKgsArr.forEach(v    => formData.append('per_kgs', v));
    unitPriceArr.forEach(v=> formData.append('unit_price', v));
    totalArr.forEach(v    => formData.append('total', v));
    uomIdArr.forEach(v    => formData.append('UOM_id', v));
    typeIdArr.forEach(v   => formData.append('type_id', v));
    slnoArr.forEach(v     => formData.append('slno', v));

    /* ===============================
       File upload
       =============================== */
    var fileInput = document.getElementById('fileedit');
    if (fileInput && fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    }

	// ✅ Always send existing file path
	    var existingFilePath = document.getElementById('existing_filepath').value;
	    formData.append('existing_filepath', existingFilePath);
    /* ===============================
       Append normal form values
       =============================== */
    formData.append('transport_name', transedit.value);
    formData.append('modified_by', createdById);
    formData.append('vechile_no', vehiedit.value);
    formData.append('freight', freigedit.value);
    formData.append('factory_id', selectedFactoryId);
    formData.append('pn_id', pnidedit.value);
    formData.append('grand_total', totalNoedit.value);

    /* ===============================
       AJAX Call
       =============================== */
    $.ajax({
        url: new URL('/jssl/qspackingmaster/updatenew', baseUrl),
        type: 'POST',
        xhrFields: { withCredentials: true },
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',

        /* ---------- SUCCESS ---------- */
		success: function (data) {

		    if (data.message === "Success") {

		        const popup = $('<div class="popup">Steel QS Packing Updated Successfully!</div>')
		            .appendTo('body')
		            .hide()
		            .fadeIn(400);

		        setTimeout(function () {
		            popup.fadeOut(400, function () {
		                $(this).remove();
		                window.location = 'QApackage.jsp';
		            });
		        }, 800);

		    } 
		    else if (data.message === "No fields were changed.") {

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
		    }
		    else {

		        $('#errorMessage').text(data.message || 'Failed to update record.');
		        $('#exampleModalCenterDup').modal('show');
		        $('#exampleModalCenter66update').modal('hide');
		        $('#exampleModalScrollable123update').modal('hide');
		    }
		}
    });
}

document.getElementById('eyeIconBtn').addEventListener('click', function() {
    // Get the value from the hidden Pnid field
    var pnid = document.getElementById('pnidedit').value;

    if (pnid) {
        // Prepare the API URL with the id parameter
        const url = new URL(`/jssl/qspackingmaster/viewpdfnew`, baseUrl);
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
        const url = new URL(`/jssl/qspackingmaster/viewpdfnew`, baseUrl);
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




