

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
document.getElementById("date").setAttribute("max", new Date().toISOString().split('T')[0]);
document.getElementById("date1").setAttribute("max", new Date().toISOString().split('T')[0]);
document.addEventListener("DOMContentLoaded", function () {
	loadAllowedActions();
	const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
	console.log('selectedFactoryId:', selectedFactoryId);
    // First, check if there's already an initial row
    addRow(); // Initially add a row
    // Populate the dropdowns for the first row
    fetchuom(1);
    fetctype(1);
/*    fetchUserList(selectedFactoryId);*/
 	fetchothersPackingNoteDetails(selectedFactoryId);
	getothertypdetail();
	// Fetch selectedFactoryId from sessionStorage

});
let uomOptionsHTML = "";
let typeOptionsHTML = "";
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);
document.getElementById("type").addEventListener("change", function () {
	document.getElementById("inputFieldsContainer").style.display = "block";
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
        <div class="form-group col-md-1">
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
<!--		<div class="form-group col-md-1">
		 <input type="text" class="form-control form-control-sm" id="pices-${rowCount}" placeholder="Unit Price" autocomplete="off">
		 <div class="pices-error" style="color:red; display:none;"></div>
		</div>-->
        <div class="form-group col-md-1">
            <input type="text" class="form-control form-control-sm text-right" id="total-${rowCount}" placeholder="Total" readonly>
        </div>
        <!--  <div class="form-group col-md-1">
            <label><b>Pieces</b></label>
            <input type="number" class="form-control form-control-sm" id="pice-${rowCount}" placeholder="Pieces" autocomplete="off" min="0">
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
  /*  const kg = parseFloat(document.getElementById(`kg-${rowId}`).value) || 0;*/
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
// Fetch UOM data and populate the UOM dropdown for a specific row
	async function fetchuom(rowId) {
	    try {
	        // Construct the API URL properly
	        const url = new URL(`/jssl/master/listunitmeasurementmasternew`, baseUrl1);
	     

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
	
	async function getothertypdetail() {
	    try {
	        const url = new URL(`/jssl/master/listothertypemasternew`, baseUrl);

			const response = await fetch(url,{
									           method: "GET",
									           credentials: "include"   // ✅ Always send JSESSIONID cookie
									       });
	        if (!response.ok) throw new Error("Failed to fetch othertype");

	        const json = await response.json(); // ✅ This line defines `json`

	        if (json.status !== "yes" || !json.Data || !json.Data.length) {
	            console.warn("No othertype found.");
	            return;
	        }

	        const selectElement = document.getElementById("type");
	        selectElement.innerHTML = `<option value="">Select othertype</option>`;

	        json.Data.forEach((type) => {
	            if (type.othertype_id && type.type) {
	                const option = document.createElement("option");
	                option.value = type.othertype_id;
	                option.textContent = type.type;
	                selectElement.appendChild(option);
	            }
	        });
	    } catch (error) {
	        console.error("Error fetching othertype:", error);
	    }
	}
	// Fetch Type data and populate the Type dropdown for a specific row
	async function fetctype(rowId) {
	    try {
	  
	        // Construct the API URL properly
	        const url = new URL(`/jssl/master/listtypemasternew`, baseUrl1);
	      
	        // Fetch data from API
			const response = await fetch(url,{
							           method: "GET",
							           credentials: "include"   // ✅ Always send JSESSIONID cookie
							       });
	        if (!response.ok) throw new Error("Failed to fetch Type data");

	        const json = await response.json();

	        // Check if the API response has valid data
	        if (json.status !== "yes" || !json.Data.length) {
	            console.warn("No Type data found.");
	            return;
	        }

	        // Get the select element for Type in the specific row
	        const typeSelect = document.getElementById(`type-${rowId}`);

	        // Clear existing options and add a default "Select" option
	        typeSelect.innerHTML = `<option value="">Select Type</option>`;

	        // Populate Type dropdown options
	        json.Data.forEach((type) => {
	            if (type.type_id && type.scrap_name) {
	                const option = document.createElement("option");
	                option.value = type.type_id;
	                option.textContent = type.scrap_name;
	                typeSelect.appendChild(option);
	            }
	        });
	    } catch (error) {
	        console.error("Error fetching Type data:", error);
	    }
	}
/*async function fetchinvoicetype() {
    try {
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetypenew`, baseUrl1);
const selectedFactoryId=1
		const selectedFactoryId = sessionStorage.getItem("selectedFactoryId");

        // Fetch data from API
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch invoicetype");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.INVOICE_TYPE_LIST.length) {
            console.warn("No invoicetype found.");
            return;
        }

        // Get the select element for contractors
        const selectElement = document.getElementById("invoice");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select invoicetype</option>`;

        // Populate dropdown options using contractor data
        json.INVOICE_TYPE_LIST.forEach((invoicetype) => {
            if (invoicetype.type_no && invoicetype.type) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = invoicetype.type_no;
                option.textContent = invoicetype.type;
                selectElement.appendChild(option);
            }
        });

        // Add event listener for contractor selection change
        selectElement.addEventListener("change", function() {
            const selectedinvoicetype = selectElement.value;
			const contractsel = document.getElementById("cont");
			
            if (selectedinvoicetype) {
				if(selectedinvoicetype==1){
								
							   fetchcont(selectedFactoryId);
					       }
						   
				  // Fetch milestones based on selected factory_id and contract_id
			} else if(selectedinvoicetype.value==2)
				{
					for (let i = contractsel.options.length - 1; i >= 0; i--) {
					               if (contractsel.options[i].value !== "Scrap") {
					                   contractsel.remove(i);
					               }
					           }
            } else {
                // If no contractor is selected, clear the milestone dropdown
                const mileSelect = document.getElementById("mile");
                mileSelect.innerHTML = `<option value="">Select milestone</option>`;
            }
        });

    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}*/
async function fetchcont(factoryId) {
    try {
        // Construct the API URL properly
        const url = new URL(`/jssl/getlistassignedmilestonetocontractors`, baseUrl1);
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
		/*	const invoicetype = document.getElementById("invoice");*/
            const selectedContractId = selectElement.value;
            if (selectedContractId) {
                fetchmile(factoryId, selectedContractId); 
				 // Fetch milestones based on selected factory_id and contract_id
            } 
			else {
                // If no contractor is selected, clear the milestone dropdown
                const mileSelect = document.getElementById("mile");
                mileSelect.innerHTML = `<option value="">Select milestone</option>`;
            }
        });

    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

async function fetchmile(factoryId, contractId) {
    try {
        // Construct the API URL properly
        const url = new URL(`/jssl/listassignmilestoneforcontractornew`, baseUrl1);
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
        const selectElement = document.getElementById("milestone");

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


    } catch (error) {
        console.error("Error fetching milestones:", error);
    }
}
/*async function fetchothersPackingNoteDetails(selectedFactoryId) {
    try {
	
        const url = new URL(`/jssl/Otherspacking/getAllothersPackingNoteDetails`, baseUrl1);
        url.searchParams.append("factory_id", selectedFactoryId);

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch steel packing note data");
        const json = await response.json();

        let tableContent = `
            <thead>
                <tr>
						  <th>Contract</th>
						  <th>Load</th>
				          <th>Transpoter</th>
				          <th>Freight</th>
						  <th>Status</th>
				          <th>Edit</th>    
						  <th>View</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.SteelDebitCreditPackingNoteInfo.forEach(item => {
			let editinvoice = '';
						let viewIcon = '';
					   
						if (item.INVGEN === 'INOVICE NOT GENERATED') {
							editinvoice = `  <td><i class="fa fa-edit" style="color: blue;" onclick="editRecord('${item.oth_Pn_no}')"></i></td>`; // Enabled
							viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`;
							}
							else
								{
									editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;	
									viewIcon = `<td><i class="fa fa-eye" style="color: green;" onclick="editRecord1('${item.oth_Pn_no}')"></i></td>`
									
								}
            tableContent += `
                <tr>
                    <td>${item.con_name}</td>
					<td>${item.oth_Pn_no}</td>
                    <td>${item.Transporter_name}</td>
                    <td>${item.freight}</td>
					<td>${item.INVGEN}</td>
					${editinvoice}
					${viewIcon}
                </tr>
            `;
        });
        tableContent += `</tbody>`;
        $("#tableID").html(tableContent);

        $("#tableID").DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: false,
            paging: false,
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
        console.error('Error fetching steel data:', error);
    }
}*/


let currentFactoryIdOthers = null;

function fetchothersPackingNoteDetails(selectedFactoryId) {

    currentFactoryIdOthers = selectedFactoryId || sessionStorage.getItem("selectedFactoryId");

    // Destroy existing DataTable
    if ($.fn.DataTable.isDataTable('#tableID')) {
        $('#tableID').DataTable().clear().destroy();
    }

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
                    const url = new URL(`/jssl/Otherspacking/getAllothersPackingNoteDetailsPaged`, baseUrl1);
                    url.searchParams.append('factory_id', currentFactoryIdOthers);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(resp => resp.json())
                        .then(json => {
                            const exportData = (json.SteelDebitCreditPackingNoteInfo || []).map(item => [
                                item.con_name || '',
                                item.oth_Pn_no || '',
                                item.Transporter_name || '',
                                item.freight || '',
                                item.INVGEN || ''
                            ]);

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>Contract</th>',
                                        '<th>Load</th>',
                                        '<th>Transporter</th>',
                                        '<th>Freight</th>',
                                        '<th>Status</th>',
										'<th>Edit</th>',   
																  '<th>View</th>'
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
                                    title: 'Others Packing Note List'
                                }]
                            }).button(0).trigger();

                            setTimeout(() => {
                                $(tempTable).DataTable().destroy();
                                $(tempTable).remove();
                            }, 1000);
                        })
                        .catch(err => console.error('Export error:', err));
                }
            }
        ],
		columns: [
		    { title: "Contract" },
		    { title: "Load" },
		    { title: "Transporter" },
		    { title: "Freight" },
		    { title: "Status" },
		    {
		        title: "Edit",
		        orderable: false,
		        render: function(data, type, row) {
		            return data;  // Data is HTML string, render as-is
		        }
		    },
		    {
		        title: "View",
		        orderable: false,
		        render: function(data, type, row) {
		            return data;  // Render HTML string
		        }
		    }
		],
		ajax: function (data, callback) {
		    const page = data.start / data.length;
		    const size = data.length;
			const searchValue = data.search.value;

		    const url = new URL(`/jssl/Otherspacking/getAllothersPackingNoteDetailsPaged`, baseUrl1);
		    url.searchParams.append('factory_id', currentFactoryIdOthers);
		    url.searchParams.append('page', page);
		    url.searchParams.append('size', size);
			url.searchParams.append('search', searchValue);

		    fetch(url, { credentials: "include" })
		        .then(resp => resp.json())
		        .then(json => {

					const list = json.SteelDebitCreditPackingNoteInfo ?? [];  // ensure it’s always an array

					const rows = list.map(item => {
					    const pnNo = item.oth_Pn_no ?? '';
					    const invGen = item.INVGEN ?? '';
					    
					    const editIcon = invGen === 'INOVICE NOT GENERATED'
					        ? `<i class="fa fa-edit" style="color:blue;" onclick="editRecord('${pnNo}')"></i>`
					        : `<i class="fa fa-edit text-muted"></i>`;
					    const viewIcon = invGen !== 'INOVICE NOT GENERATED'
					        ? `<i class="fa fa-eye" style="color:green;" onclick="editRecord1('${pnNo}')"></i>`
					        : `<i class="fa fa-eye text-muted"></i>`;
					    
					    return [
					        item.con_name ?? '',
					        pnNo,
					        item.Transporter_name ?? '',
					        (item.freight ?? '').toString(),
					        invGen,
					        editIcon,
					        viewIcon
					    ];
					});

					// Debug
					console.log('All rows before callback:', rows);

					// Use rows safely
					callback({
					    draw: data.draw,
					    recordsTotal: json.totalItems ?? rows.length,
					    recordsFiltered: json.totalItems ?? rows.length,
					    data: rows
					});
                })
                .catch(err => {
                    console.error('Error fetching packing data:', err);
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

/*// Adding event listener for "Load" dropdown selection change
document.getElementById('note').addEventListener('change', function() {
    const notevalue = this.value;  // Get the selected value of the "Load" dropdown

    const inputFieldsContainer = document.getElementById("inputFieldsContainer");

    if (notevalue) {
        // If a load is selected, show the "inputFieldsContainer"
        inputFieldsContainer.style.display = "block";
    } else {
        // If no load is selected, hide the "inputFieldsContainer"
        inputFieldsContainer.style.display = "none";
    }
});*/

function openModalAdd() {
    var freig = document.getElementById('freig').value.trim();
	var file = document.getElementById('file').value.trim();
	var date = document.getElementById('date').value.trim();
    var showError = false; // Initialize showError variable

    // Freight Validation
    if (freig === '') {
        document.getElementById('Freighterror').innerText = "Please enter Freight.";
        document.getElementById('Freighterror').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('Freighterror').innerText = "";
        document.getElementById('Freighterror').style.display = "none";
    }

	
	// File upload Validation
	    if (file === '') {
	        document.getElementById('fileerror').innerText = "Please select a file";
	        document.getElementById('fileerror').style.display = "inline-block";
	        showError = true;
	    } else {
	        document.getElementById('fileerror').innerText = "";
	        document.getElementById('fileerror').style.display = "none";
	    }
		
		if (date === '') {
		    document.getElementById('dateError').innerText = "Please select a date";
		    document.getElementById('dateError').style.display = "inline-block";
		    showError = true;
		} else {
		    document.getElementById('dateError').innerText = "";
		    document.getElementById('dateError').style.display = "none";
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



function addevent() {
    // Validate role code and role description
  /*  const selectedcontract = document.getElementById("contractor").selectedOptions[0]; // Get the selected option
    const contractid = selectedcontract ? selectedcontract.value : ''; // Get the contract_id
	const milestoneid=document.getElementById("mile").selectedOptions[0]; */
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
/*    formData.append('con_id',contractid);*/
  /*  formData.append('milestone_id', milestoneid);*/
/*	formData.append('note_type', note.text);*/
	formData.append('otherstype_id', type.value);
	formData.append('freight', freig.value);
	formData.append('buyer_ref', buyer.value);
    formData.append('Transporter_name', trans.value);
	formData.append('vechile_no', vehi.value);
    formData.append('kgs', perKgsString);
    formData.append('unit_price', unitPriceString);
    formData.append('total', totalString);
    formData.append('uom_id', uomString);
    formData.append('type_id', typeString);
	formData.append('quantity', qtyString);
    formData.append('date', date.value);
	formData.append('remarkstype_id', 1);
    formData.append('totalpn_amount', totalNo.value);
    formData.append('created_by', createdById);
    formData.append('factory_id', selectedFactoryId);
	formData.append('file_path', '/dummy-path'); // Required by backend
    
    if (file) {
        formData.append('file', file); // Append file only if selected
    }

    // Make the AJAX request
    $.ajax({
        url: new URL('/jssl/Otherspacking/addothersPackingNote', baseUrl1),
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
                const popup = $('<div class="popup">Packing Note Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);
				
                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'OtherPackingNote.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create Packing Note.';
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

function addRowEdit() {
    const container = document.getElementById("dynamicRowsContaineredit");
    const rowIndex = container.children.length;

    // Set SL No. to always be 0 for new rows
    let newSlno = 0;

    // Create a new row
    const newRow = document.createElement("div");
    newRow.classList.add("form-row", "dynamic-row", "mb-2", "align-items-center");
    newRow.id = `row_${rowIndex}`;

    newRow.innerHTML = `
        <div class="form-group col-md-1" style="display:none;">
            <label><b>SL No:</b></label>
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
            <input type="number" class="form-control form-control-sm" id="pieces_new_${rowIndex}" value="">
        </div> -->
		<div class="form-group col-md-1 text-center">
				    <!-- Delete icon -->
				    <i class="bi bi-trash text-danger" 
				       style="cursor:pointer; font-size:16px;" 
				       onclick="deleteRow1(${rowIndex});" 
				       title="Delete"></i>
				</div>
    `;

    // Append the new row to the container
    container.appendChild(newRow);
}

function editRecord(pn_id) {
		//  const allowed = window.allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}

	sessionStorage.setItem("pn_id", pn_id);
  const url = new URL(`/jssl/otherspackingmastersearchnew`, baseUrl);
    var params = [['pn_id', pn_id]];
    url.search = new URLSearchParams(params).toString();
 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data.status === "yes" && Array.isArray(data.DATA) && data.DATA.length > 0) {
                let records = data.DATA;
                let firstRecord = records[0];

                // Populate static fields
             /*   document.getElementById("contedit").value = firstRecord.conId || "";*/
                document.getElementById("freigedit").value = parseFloat(firstRecord.freight || 0).toFixed(2);
                document.getElementById("vehiedit").value = firstRecord.vechileNo || "";
                document.getElementById("transedit").value = firstRecord.transporterName || "";
				document.getElementById("buyer1").value = firstRecord.buyer_ref || "";
                document.getElementById("totalNoedit").value = parseFloat(firstRecord.totalpnAmount || 0).toFixed(2);
                document.getElementById("pnidedit").value = firstRecord.otherPnId || "";
				document.getElementById("date1").value = firstRecord.date || "";
                
                // Display the file name in the new div
                let filePath = firstRecord.filepath || "";
				// Split the filepath by the delimiter "@$@_" and get the second part
				let fileName = filePath.split("@$@_")[1] || "";  // This will get the part after "@$@_"
				
				// Display the result
				document.getElementById("fileNameDisplay").innerHTML = fileName ? `${fileName}` : "No file uploaded";

                
                // Clear previous dynamic rows
                let dynamicContainer = document.getElementById("dynamicRowsContaineredit");
                dynamicContainer.innerHTML = "";

                // Loop through records and create dynamic rows
                records.forEach((record, index) => {
                    let newRow = document.createElement("div");
                    newRow.classList.add("form-row", "dynamic-row");
                    newRow.id = `row_${index}`;  // Set a unique ID for each row

                    newRow.innerHTML = `
                        <div class="form-group col-md-2">
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
                            <input type="number" class="form-control form-control-sm text-right" id="qty_${index}" value="${parseFloat(record.quantities || 0).toFixed(2)}">
                        </div>
                        <div class="form-group col-md-2">
                            <input type="number" class="form-control form-control-sm text-right" id="kg_${index}" value="${parseFloat(record.kgs || 0).toFixed(2)}" oninput="calculateRowTotalupdate(${index})">
                        </div>
                        <div class="form-group col-md-2">
                            <input type="number" class="form-control form-control-sm text-right" id="unit_price_${index}" value="${parseFloat(record.unitPrice || 0).toFixed(2)}" oninput="calculateRowTotalupdate(${index})">
                        </div>
                        <div class="form-group col-md-1">
                            <input type="number" class="form-control form-control-sm text-right" id="total_${index}" value="${parseFloat(record.total || 0).toFixed(2)}" readonly>
                        </div>
                        <!--  <div class="form-group col-md-1">
                            <label><b>Pieces:</b></label>
                            <input type="number" class="form-control form-control-sm" id="pieces_${index}" value="${parseInt(record.pices || 0)}">
                        </div> -->
                        <div class="form-group col-md-1" style="display:none;">
                            <label><b>slno:</b></label>
                            <input type="text" class="form-control form-control-sm" id="slno_${index}" value="${parseInt(record.other_pn_items_id || 0)}">
                        </div>
                        <!-- Add the Delete Button -->
						<div class="form-group col-md-1 text-center">
								    <!-- Delete icon -->
								    <i class="bi bi-trash text-danger" 
								       style="cursor:pointer; font-size:16px;" 
								       onclick="deleteRow(${index});" 
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
	//const allowed = window.allowedActions || [];

		if (!allowed.includes("view")) {
		  alert(" You do not have permission to view.");
		    $("#exampleModalScrollable123view").modal("hide");
		  return;
		}
	sessionStorage.setItem("pn_id", pn_id);
  const url = new URL(`/jssl/otherspackingmastersearchnew`, baseUrl);
    var params = [['pn_id', pn_id]];
    url.search = new URLSearchParams(params).toString();
 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data.status === "yes" && Array.isArray(data.DATA) && data.DATA.length > 0) {
                let records = data.DATA;
                let firstRecord = records[0];

                // Populate static fields
             /*   document.getElementById("contedit").value = firstRecord.conId || "";*/
                document.getElementById("freigview").value = parseFloat(firstRecord.freight || 0).toFixed(2);
                document.getElementById("vehiview").value = firstRecord.vechileNo || "";
                document.getElementById("transview").value = firstRecord.transporterName || "";
				document.getElementById("buyerview").value = firstRecord.buyer_ref || "";
                document.getElementById("totalNoview").value = parseFloat(firstRecord.totalpnAmount || 0).toFixed(2);
                document.getElementById("pnidview").value = firstRecord.otherPnId || "";
				document.getElementById("date1view").value = firstRecord.date || "";
                
                // Display the file name in the new div
                let filePath = firstRecord.filepath || "";
				// Split the filepath by the delimiter "@$@_" and get the second part
				let fileName = filePath.split("@$@_")[1] || "";  // This will get the part after "@$@_"
				
				// Display the result
				document.getElementById("fileNameDisplayview").innerHTML = fileName ? `${fileName}` : "No file uploaded";

                
                // Clear previous dynamic rows
                let dynamicContainer = document.getElementById("dynamicRowsContainerview");
                dynamicContainer.innerHTML = "";

                // Loop through records and create dynamic rows
                records.forEach((record, index) => {
                    let newRow = document.createElement("div");
                    newRow.classList.add("form-row", "dynamic-row");
                    newRow.id = `row_${index}`;  // Set a unique ID for each row

                    newRow.innerHTML = `
                        <div class="form-group col-md-2">
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
                            <input type="number" class="form-control form-control-sm text-right" id="qty_${index}" value="${parseFloat(record.quantities || 0).toFixed(2)}"readonly>
                        </div>
                        <div class="form-group col-md-2">
                            <input type="number" class="form-control form-control-sm text-right" id="kg_${index}" value="${parseFloat(record.kgs || 0).toFixed(2)}" oninput="calculateRowTotalupdate(${index})"readonly>
                        </div>
                        <div class="form-group col-md-2">
                            <input type="number" class="form-control form-control-sm text-right" id="unit_price_${index}" value="${parseFloat(record.unitPrice || 0).toFixed(2)}" oninput="calculateRowTotalupdate(${index})"readonly>
                        </div>
                        <div class="form-group col-md-1">
                            <input type="number" class="form-control form-control-sm text-right" id="total_${index}" value="${parseFloat(record.total || 0).toFixed(2)}" readonly>
                        </div>
                        <!--  <div class="form-group col-md-1">
                            <label><b>Pieces:</b></label>
                            <input type="number" class="form-control form-control-sm" id="pieces_${index}" value="${parseInt(record.pices || 0)}">
                        </div> -->
                        <div class="form-group col-md-1" style="display:none;">
                            <label><b>slno:</b></label>
                            <input type="text" class="form-control form-control-sm" id="slno_${index}" value="${parseInt(record.other_pn_items_id || 0)}">
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
                $("#exampleModalScrollable123view").modal("show");
            } else {
                alert("No records found!");
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchuomEdit();
        fetchtypeEdit();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

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

    // Make the AJAX request to the server
    $.ajax({
        url: new URL('/jssl/otherspackingitemmaster/deletenew', baseUrl),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({
            slno: slnoValue,
            modified_by: createdById
        }),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Item Deleted Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'OtherPackingNote.jsp';
                    });
                }, 800);
            } else {
                alert('Failed to delete the item.');
            }
        },
        error: function () {
            console.error('Request failed.');
            alert('An error occurred while deleting the item.');
        }
    });
}

function openModalUpdate() {
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
    // Create a new FormData object
    var formData = new FormData();
    
    // First, gather the values from the dynamic rows as comma-separated strings.
    var qtyArr = [];
    document.querySelectorAll('[id^="qty_new_"]').forEach(function(el) {
        qtyArr.push(el.value.trim());
    });
    document.querySelectorAll('[id^="qty_"]:not([id^="qty_new_"])').forEach(function(el) {
        qtyArr.push(el.value.trim());
    });
    var qtyStr = qtyArr.join(',');

    var perKgsArr = [];
    document.querySelectorAll('[id^="kg_new_"]').forEach(function(el) {
        perKgsArr.push(el.value.trim());
    });
    document.querySelectorAll('[id^="kg_"]:not([id^="kg_new_"])').forEach(function(el) {
        perKgsArr.push(el.value.trim());
    });
    var perKgsStr = perKgsArr.join(',');

    var unitPriceArr = [];
    document.querySelectorAll('[id^="unit_price_new_"]').forEach(function(el) {
        unitPriceArr.push(el.value.trim());
    });
    document.querySelectorAll('[id^="unit_price_"]:not([id^="unit_price_new_"])').forEach(function(el) {
        unitPriceArr.push(el.value.trim());
    });
    var unitPriceStr = unitPriceArr.join(',');

    var totalArr = [];
    document.querySelectorAll('[id^="total_new_"]').forEach(function(el) {
        totalArr.push(el.value.trim());
    });
    document.querySelectorAll('[id^="total_"]:not([id^="total_new_"])').forEach(function(el) {
        totalArr.push(el.value.trim());
    });
    var totalStr = totalArr.join(',');

    var uomIdArr = [];
    document.querySelectorAll('[id^="uom_new_"]').forEach(function(el) {
        uomIdArr.push(el.value.trim());
    });
    document.querySelectorAll('[id^="uom_"]:not([id^="uom_new_"])').forEach(function(el) {
        uomIdArr.push(el.value.trim());
    });
    var uomIdStr = uomIdArr.join(',');

    var typeIdArr = [];
    document.querySelectorAll('[id^="type_new_"]').forEach(function(el) {
        typeIdArr.push(el.value.trim());
    });
    document.querySelectorAll('[id^="type_"]:not([id^="type_new_"])').forEach(function(el) {
        typeIdArr.push(el.value.trim());
    });
    var typeIdStr = typeIdArr.join(',');

    /*var piecesArr = [];
    document.querySelectorAll('[id^="pieces_new_"]').forEach(function(el) {
        piecesArr.push(el.value.trim());
    });
    document.querySelectorAll('[id^="pieces_"]:not([id^="pieces_new_"])').forEach(function(el) {
        piecesArr.push(el.value.trim());
    });
    var piecesStr = piecesArr.join(',');*/
    
    var slnoArr = [];
    document.querySelectorAll('[id^="slno_new_"]').forEach(function(el) {
        slnoArr.push(el.value.trim());
    });
    document.querySelectorAll('[id^="slno_"]:not([id^="slno_new_"])').forEach(function(el) {
        slnoArr.push(el.value.trim());
    });
    var slnoStr = slnoArr.join(',');
    
    // Get the file input element and append file if one is selected
    const fileInput = document.getElementById('fileedit');
    if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    }
	const othPnNo = sessionStorage.getItem("pn_id");
    // Append all other parameters to the FormData object
    formData.append('transport_name', transedit.value);
    formData.append('modified_by', createdById);
    formData.append('vechile_no', vehiedit.value);
    formData.append('freight', freigedit.value);
    formData.append('factory_id', selectedFactoryId);
    formData.append('pn_id', pnidedit.value);
    formData.append('grand_total', totalNoedit.value);
    formData.append('qty', qtyStr);
    formData.append('per_kgs', perKgsStr);
    formData.append('unit_price', unitPriceStr);
    formData.append('total', totalStr);
    formData.append('UOM_id', uomIdStr);
    formData.append('type_id', typeIdStr);
    formData.append('buyer_ref', buyer1.value);
	formData.append('date', date1.value);
    formData.append('slno', slnoStr);
	formData.append('load_id', othPnNo);
    
     // Now perform the AJAX call with the FormData.
    $.ajax({
        url: new URL('/jssl/otherspackingmaster/updatenew', baseUrl),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: formData,
        processData: false, // Important: Prevent jQuery from automatically transforming the data into a query string
        contentType: false, // Important: Set content type to false as jQuery will tell the server its a query string request
        success: function(data) {
            var result = data.message;
            if (result === "Success") {
                const popup = $('<div class="popup">others QS Packing Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);
                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'OtherPackingNote.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to update record.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
                $('#exampleModalCenter66update').modal('hide');
                $('#exampleModalScrollable123update').modal('hide'); 
            }
        },
        error: function() {
            console.error('Request failed.');
        }
    });
}

document.getElementById('eyeIconBtn').addEventListener('click', function() {
    // Get the value from the hidden Pnid field
    var pnid = document.getElementById('pnidedit').value;

    if (pnid) {
        // Prepare the API URL with the id parameter
        const url = new URL(`/jssl/otherspackingmaster/viewpdfnew`, baseUrl);
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
        const url = new URL(`/jssl/otherspackingmaster/viewpdfnew`, baseUrl);
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
