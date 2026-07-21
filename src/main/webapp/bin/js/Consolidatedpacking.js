
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
document.addEventListener("DOMContentLoaded", function() {
	loadAllowedActions();
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchcont(selectedFactoryId); 
		fetchtype() // Fetch contractors initially
		fetchtype1()
		fetchUserList(selectedFactoryId)
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

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
		    const selectedContractId = document.getElementById("cont").value;
		    const milevalue = this.value;

		    const container1 = document.getElementById("container1");
		    const container2 = document.getElementById("container2");

		    // Hide container2
		    container2.style.display = "none";

		    // Clear all rows inside container2
		    document.getElementById("packingRowsContainer").innerHTML = "";

		    // Reset totals
		    document.getElementById("qty").value = "";
		    document.getElementById("kgs").value = "";

		    // Uncheck all invoice checkboxes
		    document.querySelectorAll("#invoiceCheckboxMenu input[type='checkbox']")
		        .forEach(cb => cb.checked = false);

		    if (milevalue) {
		        container1.style.display = "block";
		        loadInvoices(selectedContractId);
		    } else {
		        container1.style.display = "none";
		    }
		});

    } catch (error) {
        console.error("Error fetching milestones:", error);
    }
}

function loadInvoices(con_id) {
	
	let factory_id = localStorage.getItem("selectedFactoryId");
    const url = new URL("/jssl/searchconsolidatedinvoice", baseUrl);
    url.searchParams.append("con_id", con_id);
	url.searchParams.append("factory_id", factory_id);

	fetch(url, {
	    method: "GET",
	    credentials: "include"
	})
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch invoices");
            }
            return response.json();
        })
        .then(result => {

            const menu = document.getElementById("invoiceCheckboxMenu");
            menu.innerHTML = "";

            const data = result.DATA;   // THIS IS THE FIX

            if (!Array.isArray(data)) {
                console.error("DATA is not an array:", data);
                return;
            }

            data.forEach(item => {

                const label = document.createElement("label");
                label.style.display = "block";

                label.innerHTML = `
                    <input type="checkbox" value="${item.id}">
                    ${item.invoice_no}
                `;

                menu.appendChild(label);
            });
			addCheckboxListener();
        })
        .catch(error => {
            console.error("Error loading invoices:", error);
        });
}
let checkboxListenerAdded = false;  //  guard flag

function addCheckboxListener() {

    if (checkboxListenerAdded) return;  //  prevent duplicate listeners
    checkboxListenerAdded = true;

    const container2 = document.getElementById("container2");

    document.addEventListener("change", function (e) {

        if (e.target.matches("#invoiceCheckboxMenu input[type='checkbox']")) {

            const checkbox  = e.target;
            const invoiceId = checkbox.value;

            const anyChecked =
                document.querySelectorAll("#invoiceCheckboxMenu input:checked").length > 0;
            container2.style.display = anyChecked ? "block" : "none";

            if (checkbox.checked) {
                fetchInvoice(invoiceId);
            } else {
                removeRow(invoiceId);
            }
        }
    });
}



function fetchInvoice(invoiceId) {
	const url = new URL(`/jssl/invoice/searchidnew?id=${invoiceId}`, baseUrl);
	fetch(url, {
	    method: "GET",
	    credentials: "include"
	})
        .then(res => res.json())
		.then(response => {
		if (response.message === "Success") {

		               const invoiceData = response.Invoice_Data;
		               const packingList = response.QsPacking_Data;
					   packingList.forEach((item, index) => {
					   document.getElementById("UOM1").value=item.uom_name
					   });
		               createRows(invoiceId, invoiceData, packingList);
		           }
		       })
		       .catch(err => console.error(err));
}

function removeRow(invoiceId) {

    const rows = document.querySelectorAll(`.dynamic-row[data-id="${invoiceId}"]`);
    rows.forEach(row => row.remove());

    const remainingRows = document.querySelectorAll(".dynamic-row").length;
	console.log(invoiceId);
	console.log(document.querySelectorAll(".dynamic-row"));
    const container2 = document.getElementById("container2");

    if (remainingRows === 0) {
        container2.style.display = "none";
    }
	updateTotalQty();
}

function createRows(invoiceId, invoiceData, packingList) {

    const container = document.getElementById("packingRowsContainer");

    packingList.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "form-row dynamic-row";
        row.setAttribute("data-id",         invoiceId);

        //  Store all needed values as data attributes on the row
        row.setAttribute("data-invoice-no",  invoiceId  || '');
        row.setAttribute("data-uom",         item.uom_name            || '');
        row.setAttribute("data-qty",         item.qty                 || 0);
        row.setAttribute("data-per-kgs",     item.per_kgs             || 0);
        row.setAttribute("data-unit-price",  item.unit_price          || 0);
        row.setAttribute("data-total",       (item.qty * item.unit_price) || 0);
        row.setAttribute("data-stype",       item.scrap_name_type_id  || '');
        row.setAttribute("data-pn-id",       item.pn_id               || invoiceId); 
		
		row.setAttribute("data-inctype", item.inc_type || ' ');
		row.setAttribute("data-uomid", item.uom_id  || ' ') ;// ✅ actual pn_id

        row.innerHTML = `
            <div class="form-group col-md-1">
                <input type="text" class="form-control form-control-sm"
                       value="${invoiceData.invoice_no || ''}" readonly>
            </div>
            <div class="form-group col-md-1">
                <input type="text" class="form-control form-control-sm"
                       value="${item.uom_name || ''}" readonly>
            </div>
            <div class="form-group col-md-1">
                <input type="text" class="form-control form-control-sm line-qty"
                       value="${item.qty || ''}" readonly>
            </div>
            <div class="form-group col-md-1">
                <input type="text" class="form-control form-control-sm line-kgs"
                       value="${item.per_kgs || ''}" readonly>
            </div>
            <div class="form-group col-md-2">
                <input type="text" class="form-control form-control-sm"
                       value="${item.unit_price || ''}" readonly>
            </div>
            <div class="form-group col-md-2">
                <input type="text" class="form-control form-control-sm"
                       value="${(item.qty * item.unit_price) || ''}" readonly>
            </div>
            <div class="form-group col-md-2">
                <input type="text" class="form-control form-control-sm"
                       value="${item.scrap_name_type_id || ''}" readonly>
            </div>
        `;

        container.appendChild(row);
    });

    updateTotalQty();
}

function updateTotalQty() {

    let grandQty = 0;
	let grandkgs = 0;

    document.querySelectorAll(".line-qty").forEach(input => {
        grandQty += parseFloat(input.value || 0);
    });
	
	document.querySelectorAll(".line-kgs").forEach(input => {
	     grandkgs += parseFloat(input.value || 0);
	 });
	
    document.getElementById("qty").value = grandQty.toFixed(2);
	document.getElementById("kgs").value = grandkgs.toFixed(2);
}

function calculateLineTotal() {

    const uom = document.getElementById("UOM1").value.trim().toUpperCase();
    const qty = parseFloat(document.getElementById("qty").value) || 0;
    const kgs = parseFloat(document.getElementById("kgs").value) || 0;
    const unitPrice = parseFloat(document.getElementById("price").value) || 0;

    let total = 0;

    if (uom === "NOS" || uom === "SQ MTS") {
        total = qty * unitPrice;
    } else {
        total = kgs * unitPrice;
    }

    document.getElementById("total1").value = total.toFixed(2);
}


function calculateLineTotalupdate() {

    const uom = document.getElementById("UOM3").value.trim().toUpperCase();
    const qty = parseFloat(document.getElementById("qty1").value) || 0;
    const kgs = parseFloat(document.getElementById("Weight1").value) || 0;
    const unitPrice = parseFloat(document.getElementById("price1").value) || 0;

    let total = 0;

    if (uom === "NOS" || uom === "SQ MTS") {
        total = qty * unitPrice;
    } else {
        total = kgs * unitPrice;
    }

    document.getElementById("total2").value = total.toFixed(2);
}
async function fetchtype() {
    try {

        const url = new URL(`/jssl/qspackingmasterscraptype/listnew`, baseUrl);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Type options");
        }

        const json = await response.json();

        const typeDropdown = document.getElementById("type");

        if (!typeDropdown) {
            console.error("Dropdown with id 'type' not found.");
            return;
        }

        if (json.status !== "yes" || !json.SCRAPTYPELIST?.length) {
            typeDropdown.innerHTML = `<option value="">No Types Available</option>`;
            return;
        }

        let options = `<option value="">Select Type</option>`;

        json.SCRAPTYPELIST.forEach(item => {
            if (item.type_id && item.scrap_Name) {
                options += `<option value="${item.type_id}">${item.scrap_Name}</option>`;
            }
        });

        typeDropdown.innerHTML = options;

    } catch (error) {
        console.error("Error fetching Type options:", error);
    }
}


async function fetchtype1() {
    try {

        const url = new URL(`/jssl/qspackingmasterscraptype/listnew`, baseUrl);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Type options");
        }

        const json = await response.json();

        const typeDropdown = document.getElementById("type1");

        if (!typeDropdown) {
            console.error("Dropdown with id 'type' not found.");
            return;
        }

        if (json.status !== "yes" || !json.SCRAPTYPELIST?.length) {
            typeDropdown.innerHTML = `<option value="">No Types Available</option>`;
            return;
        }

        let options = `<option value="">Select Type</option>`;

        json.SCRAPTYPELIST.forEach(item => {
            if (item.type_id && item.scrap_Name) {
                options += `<option value="${item.type_id}">${item.scrap_Name}</option>`;
            }
        });

        typeDropdown.innerHTML = options;

    } catch (error) {
        console.error("Error fetching Type options:", error);
    }
}

function openModalAdd()
 {
	var vechicle = document.getElementById('vehi').value.trim();
	var trans = document.getElementById('trans').value.trim();
	var unit_price = document.getElementById('price').value.trim();
	var item_type = document.getElementById('type').value.trim();
	
	
	if (vechicle === '') {
	       document.getElementById('vehiError').innerText = "Please Enter Vehicle Number.";
	       document.getElementById('vehiError').style.display = "inline-block";
	       showError = true;
	   } else {
	       document.getElementById('vehiError').innerText = "";
	       document.getElementById('vehiError').style.display = "none";
	   }
	   
	   if (trans === '') {
	          document.getElementById('transError').innerText = "Please Enter Transporter Name";
	          document.getElementById('transError').style.display = "inline-block";
	          showError = true;
	      } else {
	          document.getElementById('transError').innerText = "";
	          document.getElementById('transError').style.display = "none";
	      }
		  if (item_type === '') {
		            document.getElementById('typeError').innerText = "Please Select Item Type";
		            document.getElementById('typeError').style.display = "inline-block";
		            showError = true;
		        } else {
		            document.getElementById('typeError').innerText = "";
		            document.getElementById('typeError').style.display = "none";
		        }
		  
				
				if (unit_price === '') {
				    document.getElementById('priceError').innerText = "Please enter the price";
				    document.getElementById('priceError').style.display = "inline-block";
				    showError = true;

				} else if (parseFloat(unit_price) <= 0) {
				    document.getElementById('priceError').innerText = "Price cannot be zero or negative";
				    document.getElementById('priceError').style.display = "inline-block";
				    showError = true;

				} else {
				    document.getElementById('priceError').innerText = "";
				    document.getElementById('priceError').style.display = "none";
				}
		  if ( !vechicle || !trans ) {
		         return; // Do not proceed with opening the modal if validation fails
		     }

			 $('#exampleModalCenter66').modal('show');
		   
	}

	async function addConsolidatedPacking() {

	    const selectedFactoryId = localStorage.getItem("selectedFactoryId");
	    const url = new URL("jssl/consolpackingmaster/addnew", baseUrl);
	    const formData = new FormData();

	    // ✅ Existing fields
	    formData.append("con_id",         document.getElementById("cont").value);
	    formData.append("transport_name", document.getElementById("trans").value);
	    formData.append("vechile_no",     document.getElementById("vehi").value);
	    formData.append("milestone_id",   document.getElementById("mile").value);
	    formData.append("created_by",     createdById);
	    formData.append("factory_id",     selectedFactoryId);
	    formData.append("grand_total",    document.getElementById("total1").value);
	    formData.append("qty",            document.getElementById("qty").value    || 0);
	    formData.append("per_kgs",        document.getElementById("kgs").value    || 0);
	    formData.append("unit_price",     document.getElementById("price").value  || 0);
	    formData.append("total",          document.getElementById("total1").value || 0);
	    formData.append("UOM",            document.getElementById("UOM1").value   || "");
	    formData.append("type_id",        document.getElementById("type").value   || "");

	    // ✅ Collect dynamic rows using data attributes (no more input index issues)
		const items = [];
		const dynamicRows = document.querySelectorAll(".dynamic-row");

		dynamicRows.forEach((row, index) => {

		    const pnId   = row.getAttribute("data-pn-id") || row.getAttribute("data-id");
		    const qty    = row.getAttribute("data-qty")        || '';
		    const invid  = row.getAttribute("data-invoice-no") || '';

		    // ✅ Skip rows that have no real data
		    if (!pnId || pnId === 'null' || !qty || !invid) {
		        console.warn("Skipping empty row at index:", index);
		        return;  // skip this row
		    }

		    items.push({
		        slno:       items.length + 1,   // ✅ re-number after filtering
		        pn_id:      pnId,
		        qty:        row.getAttribute("data-qty")        || 0,
		        per_kgs:    row.getAttribute("data-per-kgs")    || 0,
		        unit_price: row.getAttribute("data-unit-price") || 0,
		        total:      row.getAttribute("data-total")      || 0,
		        UOM:        row.getAttribute("data-uom")        || '',
		        stype:      row.getAttribute("data-stype")      || '',
		        invid:      invid,
		        itype:     row.getAttribute("data-inctype")  || ' '
		    });
		});

		console.log("Filtered items to save:", items);  // ✅ verify count
		formData.append("items", JSON.stringify(items));

	    try {
	        const response = await fetch(url, {
	            method: "POST",
	            credentials: "include",
	            body: formData
	        });

	        if (!response.ok) throw new Error("Failed to save data");

	        const data = await response.json();

	        if (data.message === "Success") {
	            const popup = $('<div class="popup">Consolidated Packing Inserted Successfully!</div>')
	                .appendTo('body').hide().fadeIn(400);

	            setTimeout(function () {
	                popup.fadeOut(400, function () {
	                    $(this).remove();
	                    window.location = 'ConsolidatedPackingNote.jsp';
	                });
	            }, 800);

	        } else if (data.message === "No fields were changed.") {
	            const popup = $('<div class="popup">No fields were changed.</div>')
	                .appendTo('body').hide().fadeIn(400);

	            setTimeout(function () {
	                popup.fadeOut(400, function () {
	                    $(this).remove();
	                    $('#exampleModalCenter66').modal('hide');
	                });
	            }, 1000);

	        } else {
	            $('#errorMessage').text(data.message || 'Failed to update record.');
	            $('#exampleModalCenter66').modal('hide');
	            $('#exampleModalScrollable123').modal('hide');
	        }

	    } catch (error) {
	        console.error("Error:", error);
	        $('#errorMessage').text('Server error occurred.');
	    }
	}


/*async function fetchUserList(selectedFactoryId) {
	try {
        
        // Construct the API URL
        const url = new URL(`/jssl/consolidatedpackingmaster/listnew`, baseUrl);
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
				editinvoice = `<td><i  id="Editpacking" class="fa fa-edit" style=" color: blue;" onclick="editRecord('${item.conpn_id}')"></i></td>`; // Enabled
				viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`;
				}
				else
					{
						editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;	
						viewIcon = `<td><i class="fa fa-eye" style="color: green;" onclick="editRecord1('${item.conpn_id}')"></i></td>`
						
					}
            tableContent += `
                <tr>
                    <td>${item.contract_name}</td>
                    <td>${item.milestone_name}</td>
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




let currentFactoryIdConsol = null;

function fetchUserList(selectedFactoryId) {

    currentFactoryIdConsol = selectedFactoryId || localStorage.getItem("selectedFactoryId");

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

                    const url = new URL(`/jssl/consolidatedpackingmaster/listnew/page`, baseUrl);
                    url.searchParams.append('factory_id', currentFactoryIdConsol);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(resp => resp.json())
                        .then(json => {

                            const exportData = (json.data || []).map(item => [
                                item.contract_name || '',
								item.load_id || '',
                                item.milestone_name || '',
                                item.invgen || ''
                            ]);

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>Contract</th>',
										'<th>Load</th>',
                                        '<th>Milestone</th>',
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
                                    title: 'Consolidated Packing List'
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
            { title: "Milestone" },
			{title:"Load"},
            { title: "Status" },
            {
                title: "Edit",
                orderable: false,
                render: function (data) { return data; }
            },
            {
                title: "View",
                orderable: false,
                render: function (data) { return data; }
            }
        ],

        ajax: function (data, callback) {

            const page = data.start / data.length;
            const size = data.length;
			const searchValue = data.search.value;

            const url = new URL(`/jssl/consolidatedpackingmaster/listnew/page`, baseUrl);
            url.searchParams.append('factory_id', currentFactoryIdConsol);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
			url.searchParams.append('search', searchValue);

            fetch(url, { credentials: "include" })
                .then(resp => resp.json())
                .then(json => {

                    const list = json.data ?? [];

                    const rows = list.map(item => {

						const invGen = item.invgen;   // from API
						const conpnId = item.conpn_id;

						const isInvoiceGenerated = invGen?.toUpperCase().trim() === 'INVOICE GENERATED';

						const editIcon = !isInvoiceGenerated
						    ? `<i class="fa fa-edit" style="color:blue; cursor:pointer;" onclick="editRecord('${conpnId}')"></i>`
						    : `<i class="fa fa-edit text-muted"></i>`;

						const viewIcon = isInvoiceGenerated
						    ? `<i class="fa fa-eye" style="color:green; cursor:pointer;" onclick="editRecord1('${conpnId}')"></i>`
						    : `<i class="fa fa-eye text-muted"></i>`;

                        return [
                            item.contract_name ?? '',
                            item.milestone_name ?? '',
							item.load_id ?? '',
                            invGen,
                            editIcon,
                            viewIcon
                        ];
                    });

                    callback({
                        draw: data.draw,
                        recordsTotal: json.totalItems ?? rows.length,
                        recordsFiltered: json.totalItems ?? rows.length,
                        data: rows
                    });

                })
                .catch(err => {
                    console.error('Error fetching consolidated packing data:', err);
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

let load_id_toUPdated=null;
let contract_id=null;
let originalData = {};
function editRecord(pn_id) {
			  // const allowed = window.allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/consolidatedpackingmastersearchnew`, baseUrl);
    var params = [['pn_id', pn_id]];
    url.search = new URLSearchParams(params).toString();

    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data.status === "yes" && Array.isArray(data.DATA) && data.DATA.length > 0) {
                let records = data.DATA;
                let firstRecord = records[0];
				load_id_toUPdated = firstRecord.load_id;
				contract_id=firstRecord.con_id;
                document.getElementById("contedit").value = firstRecord.contract_name || "";
                document.getElementById("mileedit").value = firstRecord.milestone_name || "";
                document.getElementById("vehiedit").value = firstRecord.vechile_no || "";
                document.getElementById("transedit").value = firstRecord.transport_name || "";
                document.getElementById("UOM3").value = firstRecord.uom || "";
                document.getElementById("qty1").value = firstRecord.qty || "";
                document.getElementById("Weight1").value = firstRecord.per_kgs || "";
                document.getElementById("price1").value = firstRecord.unit_price || "";
                document.getElementById("type1").value = firstRecord.type_id || "";
                document.getElementById("total2").value = parseFloat(firstRecord.grand_total || 0).toFixed(2);
                document.getElementById("pnidedit").value = firstRecord.conpn_id || "";
				console.log(load_id_toUPdated);
               /* const container = document.getElementById("packingRowsContainerUP");
                if (container) {
                    container.innerHTML = "";
                }
				const selectedInvoices = data['invocice data'] || [];
				loadInvoicesUP(firstRecord.con_id, selectedInvoices);*/
				
				originalData = {
				    vehicle_no: firstRecord.vechile_no || "",
				    transport_name: firstRecord.transport_name || "",
				    uom: firstRecord.uom || "",
				    qty: parseFloat(firstRecord.qty || 0),
				    weight: parseFloat(firstRecord.per_kgs || 0),
				    price: parseFloat(firstRecord.unit_price || 0),
				    type_id: firstRecord.type_id || "",
				    total: parseFloat(firstRecord.grand_total || 0)
				};
				
				const container = document.getElementById("packingRowsContainerUp");
				if (container) {
				    container.innerHTML = "";
				}

				document.getElementById("invoiceCheckboxMenuUP").innerHTML = "";

				document.getElementById("qty1").value = "";
				document.getElementById("Weight1").value = "";

				const selectedInvoices = data['invocice data'] || [];
				loadInvoicesUP(firstRecord.con_id, selectedInvoices);

            } else {
                alert("No records found!");
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

    $("#exampleModalScrollable123update").modal("show");

    setTimeout(() => {
        setupUpdateDropdown();
    }, 100);
}

function setupUpdateDropdown() {
    const dropdownUpdate = document.querySelector('#invoiceDropdownUP');
    
    if (!dropdownUpdate) {
        console.error("invoiceDropdownUP not found!");
        return;
    }

    const dropdownBtnUpdate = dropdownUpdate.querySelector('.dropdown-btn');
    const menuUpdate = dropdownUpdate.querySelector('.checkbox-menu');

    if (!dropdownBtnUpdate || !menuUpdate) {
        console.error("Dropdown button or menu not found");
        return;
    }

    dropdownBtnUpdate.onclick = null;
    dropdownBtnUpdate.onclick = function(e) {
	    e.stopPropagation();
	    menuUpdate.style.display =
	        menuUpdate.style.display === 'block' ? 'none' : 'block';
	};

    const checkboxesUpdate = menuUpdate.querySelectorAll('input[type="checkbox"]');
    checkboxesUpdate.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Keep button text as "Select Invoice No" - don't update it
        });
    });

    document.addEventListener('click', (e) => {
        if (!dropdownUpdate.contains(e.target)) {
            menuUpdate.style.display = 'none';
        }
    });
}

function loadInvoicesUP(con_id, selectedInvoices = []) {
	let factory_id = localStorage.getItem("selectedFactoryId");
    const url = new URL("/jssl/searchconsolidatedinvoice", baseUrl);
    url.searchParams.append("con_id", con_id);
	url.searchParams.append("factory_id", factory_id);

    fetch(url,{
        method:"GET",
        credentials:"include"
    })
    .then(res=>res.json())
    .then(result=>{

        const menu = document.getElementById("invoiceCheckboxMenuUP");
        menu.innerHTML = "";

        const remainingInvoices = result.DATA || [];

        // 🔵 Combine both arrays
        const allInvoices = [...selectedInvoices, ...remainingInvoices];

        allInvoices.forEach(item=>{

            const label = document.createElement("label");
            label.style.display="block";

            const isSelected = selectedInvoices.some(inv => inv.id === item.id);

            label.innerHTML = `
                <input type="checkbox" value="${item.id}" ${isSelected ? "checked" : ""}>
                ${item.invoice_no}
            `;

            menu.appendChild(label);

        });

        addCheckboxListenerUP();

        // auto load rows for already selected invoices
        selectedInvoices.forEach(inv=>{
            fetchInvoiceUP(inv.id);
        });

        if(selectedInvoices.length > 0){
            document.getElementById("container2up").style.display="block";
        }

    })
    .catch(err=>console.error(err));
}


let checkboxListenerAddedUP = false;

function addCheckboxListenerUP() {

    if (checkboxListenerAddedUP) return;  // ✅ UNCOMMENT THIS GUARD
    checkboxListenerAddedUP = true;

    document.addEventListener("change", function(e){  // ✅ Use document, not menu

        if(e.target.matches("#invoiceCheckboxMenuUP input[type='checkbox']")){

            const checkbox = e.target;
            const invoiceId = checkbox.value;

            const anyChecked = document.querySelectorAll("#invoiceCheckboxMenuUP input:checked").length > 0;

            const container2 = document.getElementById("container2up");
            if (container2) {
                container2.style.display = anyChecked ? "block" : "none";
            }

            if(checkbox.checked){
                fetchInvoiceUP(invoiceId);
            } else {
                removeRowUP(invoiceId);
            }

        }

    });
}

function fetchInvoiceUP(invoiceId){

    const url = new URL(`/jssl/invoice/searchidnew?id=${invoiceId}`, baseUrl);

    fetch(url,{credentials:"include"})
    .then(res=>res.json())
    .then(response=>{

        if(response.message === "Success"){

            const invoiceData = response.Invoice_Data;
            const packingList = response.QsPacking_Data;

            createRowsUP(invoiceId, invoiceData, packingList);

        }

    })
    .catch(err=>console.error(err));

}

function removeRowUP(invoiceId){

    const rows = document.querySelectorAll(`.dynamic-row[data-ids="${invoiceId}"]`);

    rows.forEach(row => row.remove());
	calculateTotalsUP();

}

function createRowsUP(invoiceId, invoiceData, packingList) {

    const container = document.getElementById("packingRowsContainerUp");

    packingList.forEach((item) => {

        const row = document.createElement("div");
        row.className = "form-row dynamic-row";
        row.setAttribute("data-ids", invoiceId);
		

        row.setAttribute("data-invoice-no", invoiceData.invoice_no || invoiceId || '');
        row.setAttribute("data-uom", item.uom_name || '');
        row.setAttribute("data-qty", item.qty || 0);
        row.setAttribute("data-per-kgs", item.per_kgs || 0);
        row.setAttribute("data-unit-price", item.unit_price || 0);
        row.setAttribute("data-total", (item.qty * item.unit_price) || 0);
        row.setAttribute("data-stype", item.scrap_name_type_id || '');
        row.setAttribute("data-pn-id", item.pn_id || invoiceId);
        row.setAttribute("data-inctype", item.inc_type || ' ');
        row.setAttribute("data-uomid", item.uom_id || ' ');

        row.innerHTML = `
            <div class="form-group col-md-1">
                <input type="text" class="form-control form-control-sm"
                value="${invoiceData.invoice_no || ''}" readonly>
            </div>

            <div class="form-group col-md-1">
                <input type="text" class="form-control form-control-sm"
                value="${item.uom_name || ''}" readonly>
            </div>

            <div class="form-group col-md-1">
                <input type="text" class="form-control form-control-sm line-qty"
                value="${item.qty || ''}" readonly>
            </div>

            <div class="form-group col-md-1">
                <input type="text" class="form-control form-control-sm line-kgs"
                value="${item.per_kgs || ''}" readonly>
            </div>

            <div class="form-group col-md-2">
                <input type="text" class="form-control form-control-sm"
                value="${item.unit_price || ''}" readonly>
            </div>

            <div class="form-group col-md-2">
                <input type="text" class="form-control form-control-sm"
                value="${(item.qty * item.unit_price) || ''}" readonly>
            </div>

            <div class="form-group col-md-2">
                <input type="text" class="form-control form-control-sm"
                value="${item.scrap_name_type_id || ''}" readonly>
            </div>
        `;

        container.appendChild(row);
		calculateTotalsUP();
    });

    document.getElementById("container2up").style.display = "block";
}


function calculateTotalsUP() {

    let totalQty = 0;
    let totalKgs = 0;

    document.querySelectorAll("#packingRowsContainerUp .line-qty").forEach(input => {
        totalQty += parseFloat(input.value) || 0;
    });

    document.querySelectorAll("#packingRowsContainerUp .line-kgs").forEach(input => {
        totalKgs += parseFloat(input.value) || 0;
    });

    document.getElementById("qty1").value = totalQty.toFixed(2);
    document.getElementById("Weight1").value = totalKgs.toFixed(2);
}

function openModalUpdate() {
	 var vehiedit = document.getElementById('vehiedit').value.trim();
	 var transedit = document.getElementById('transedit').value.trim();
	 
	 var unit_price = document.getElementById('price1').value.trim();
	 
	 var item_type = document.getElementById('type1').value.trim();
	 var qty = document.getElementById('qty1').value.trim();
	 console.log("checking for the unit_proce",unit_price);
	 var showError = false;
	 if (vehiedit === '') {
	         document.getElementById('vehieditError').innerText = "Please Enter vehicle no.";
	         document.getElementById('vehieditError').style.display = "inline-block";
	         showError = true;
	     } else {
	         document.getElementById('vehieditError').innerText = "";
	         document.getElementById('vehieditError').style.display = "none";
	     }
	     
	     if (transedit === '') {
	         document.getElementById('transeditError').innerText = "Please Enter transporter name.";
	         document.getElementById('transeditError').style.display = "inline-block";
	         showError = true;
	     } else {
	         document.getElementById('transeditError').innerText = "";
	         document.getElementById('transeditError').style.display = "none";
	     }
		 
		 if (item_type === '') {
			
		          document.getElementById('type1Error').innerText = "Please Select Itme type";
		          document.getElementById('type1Error').style.display = "inline-block";
		          showError = true;
		      } else {
		          document.getElementById('type1Error').innerText = "";
		          document.getElementById('type1Error').style.display = "none";
		      }
			  if (unit_price === '') {
			      document.getElementById('price1Error').innerText = "Please enter the price";
			      document.getElementById('price1Error').style.display = "inline-block";
			      showError = true;

			  } else if (parseFloat(unit_price) <= 0) {
			      document.getElementById('price1Error').innerText = "Price cannot be zero or negative";
			      document.getElementById('price1Error').style.display = "inline-block";
			      showError = true;

			  } else {
			      document.getElementById('price1Error').innerText = "";
			      document.getElementById('price1Error').style.display = "none";
			  }
			  if (parseFloat(qty) <= 0) {
			  			      document.getElementById('checkupError').innerText = "Atleast One Invoice No Should be Select";
			  			      document.getElementById('checkupError').style.display = "inline-block";
			  			      showError = true;

			  			  } else {
			  			      document.getElementById('checkupError').innerText = "";
			  			      document.getElementById('checkupError').style.display = "none";
			  			  }

		 if (!showError) {
		     $('#exampleModalCenter66update').modal('show'); // Show the next modal (Ensure this modal exists)
		 }	 
}


function getCurrentFormData(){

    return {
        vehicle_no: document.getElementById("vehiedit").value.trim(),
        transport_name: document.getElementById("transedit").value.trim(),
        uom: document.getElementById("UOM3").value || "",
        qty: parseFloat(document.getElementById("qty1").value || 0),
        weight: parseFloat(document.getElementById("Weight1").value || 0),
        price: parseFloat(document.getElementById("price1").value || 0),
        type_id: document.getElementById("type1").value || "",
        total: parseFloat(document.getElementById("total2").value || 0)
    };

}

function isFormChanged(original, current){

    for(let key in original){

        if(original[key] !== current[key]){
            console.log("Changed field:", key, original[key], "→", current[key]);
            return true;
        }

    }

    return false;
}

async function updateevent() {
	
	const currentData = getCurrentFormData();

	console.log("Current Data:", currentData);

	const changed = isFormChanged(originalData, currentData);

	if(!changed){

		const popup = $('<div class="popup">No fields were changed.</div>')
		               .appendTo('body')
		               .hide()
		               .fadeIn(400);
					   setTimeout(function () {
					                   popup.fadeOut(400, function () {
					                       $(this).remove();
					                       window.location = 'ConsolidatedPackingNote.jsp';
					                   });
					               }, 400);

	    return; // STOP API CALL

	}

    try {

        const pn_id = document.getElementById('pnidedit').value;

        if (!pn_id) {
            alert("Error: No record ID found!");
            return;
        }

        const selectedFactoryId = localStorage.getItem("selectedFactoryId");
        const url = new URL("jssl/consolidatedupdatePacking", baseUrl);

        const formData = new FormData();
        formData.append("pn_id", pn_id);
        formData.append("total", document.getElementById("total2").value || 0);
        formData.append("unit_price", document.getElementById("price1").value || 0);
        formData.append("type_id", document.getElementById("type1").value || "");
        formData.append("transport_name", document.getElementById("transedit").value || "");
        formData.append("vechile_no", document.getElementById("vehiedit").value || "");
        formData.append("modified_by", createdById);
        formData.append("factory_id", selectedFactoryId);
        formData.append("UOM", document.getElementById("UOM3").value || "");
        formData.append("qty", document.getElementById("qty1").value || 0);
        formData.append("per_kgs", document.getElementById("Weight1").value || 0);
        formData.append("grand_total", document.getElementById("total2").value || 0);

        const items = [];
        const dynamicRows = document.querySelectorAll(".dynamic-row");

        dynamicRows.forEach((row, index) => {
            const pnId = row.getAttribute("data-pn-id") || row.getAttribute("data-id");
            const qty = row.getAttribute("data-qty") || '';
           // const invid = row.getAttribute("data-invoice-no") || '';
			const invid = row.getAttribute("data-ids") || '';
			

            if (!pnId || pnId === 'null' || !qty || !invid) {
                console.warn("Skipping empty row at index:", index);
                return;
            }

            items.push({
                slno: items.length + 1,
                pn_id: pnId,
                qty: row.getAttribute("data-qty") || 0,
                per_kgs: row.getAttribute("data-per-kgs") || 0,
                unit_price: row.getAttribute("data-unit-price") || 0,
                total: row.getAttribute("data-total") || 0,
                UOM: row.getAttribute("data-uom") || '',
                stype: row.getAttribute("data-stype") || '',
                invid: invid,
                itype: row.getAttribute("data-inctype") || ' ',
                uomid: row.getAttribute("data-uomid") || ' '
            });
        });

        console.log("Items being updated:", items);
        formData.append("items", JSON.stringify(items));
		formData.append("load_id", load_id_toUPdated);
		formData.append("con_id",contract_id);
		
		console.log("====== FORM DATA BEING SENT ======");

		for (let pair of formData.entries()) {
		    console.log(pair[0] + ":", pair[1]);
		}

		console.log("==================================");

        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to update data");
        }

        const data = await response.json();

        if (data.message === "Updated successfully") {

            const popup = $('<div class="popup">Consolidated Packing Updated Successfully!</div>')
                .appendTo('body')
                .hide()
                .fadeIn(400);

           setTimeout(function () {
                popup.fadeOut(400, function () {
                    $(this).remove();
                    window.location = 'ConsolidatedPackingNote.jsp';
                });
            }, 500);
        }

     

        else {

            $('#errorMessage').text(data.message || 'Failed to update record.');
            $('#exampleModalCenter66update').modal('hide');
        }

    } catch (error) {

        console.error("Error:", error);
        $('#errorMessage').text('Server error occurred.');
    }
}
	


function editRecord1(pn_id)
{
	//const allowed = window.allowedActions || [];

	if (!allowed.includes("view")) {
	  alert(" You do not have permission to view.");
	    $("#exampleModalScrollable123view").modal("hide");
	  return;
	}

	const url = new URL(`/jssl/consolidatedpackingmastersearchnew`, baseUrl);
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
	               document.getElementById("vehiview").value = firstRecord.vechile_no || "";
	               document.getElementById("transview").value = firstRecord.transport_name || "";
				   document.getElementById("UOM3view").value = firstRecord.uom || "";
				   document.getElementById("qty1view").value = firstRecord.qty || "";
				   document.getElementById("Weight1view").value = firstRecord.per_kgs || "";
				   document.getElementById("price1view").value = firstRecord.unit_price || "";
				   document.getElementById("type1view").value = firstRecord.scrap_name_type_id || "";
	               document.getElementById("total2view").value = parseFloat(firstRecord.grand_total || 0).toFixed(2);
	               document.getElementById("pnidview").value = firstRecord.conpn_id || "";
				  
				   
				   } else {
				                alert("No records found!");
				            }
				        })
				        .catch(error => {
				            console.error("Error fetching data:", error);
				        });
				   
				   
	$("#exampleModalScrollable123view").modal("show");
}

	
