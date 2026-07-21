
let allowed = null;
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


const selectedFactoryId = localStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

// Ensure the ID is available before making the API call
$(document).ready(function () {
    const factoryId = localStorage.getItem("selectedFactoryId");
    if (factoryId) {
        fetchUserList(factoryId);
    }
});

/*function fetchUserList(selectedFactoryId) {
    // Create the URL and pass `selectedFactoryId` as a query parameter
    const url = new URL(`/jssl/saleOrderPackingNote/allScrapPackingNoteDetailsNew`, baseUrl);
    url.searchParams.append('factory_id', selectedFactoryId);  // Adding `factory_id` query parameter

    // Make API call to fetch data
 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            let li = '<thead><tr><th>Sale Order Code</th><th>Scrap Packing Note</th><th>Scrap Item Name</th><th>Scrap Type</th><th>Unit Name</th><th>Total Ordered</th><th>Total Sold</th></th><th>Balance</th><th>Vehicle Number</th><th>Status</th><th>Edit</th><th>Verify</th><th>View</th></tr></thead>';
            const arr = json.AllScraPackingNoteDetailsNew;

            // Loop through each data and add a table row
            arr.forEach(item => {
                let editIcon = `
                    <td>
                        <i class="fa fa-pen" style="color: blue;" onclick="reviewRecord('${item.scp_load}')"></i>
                    </td>
                `;
                
                let editIcon11 = `
                    <td>
                        <i class="fa fa-eye" style="color: green;" onclick="reviewRecord12('${item.scp_load}')"></i>
                    </td>
                `;
                
                let editPackage = `
                    <td>
                        <i class="fa fa-edit" style=" color: blue;" onclick="editPackage11('${item.scp_load}')"></i>
                    </td>
                `;

                // If verification_status is 'Verified', disable the edit icon
                if (item.verification_status === 'Verified') {
                    editIcon = `
                        <td>
                            <i class="fa fa-pen" style="pointer-events: none; color: grey;" title="Cannot edit - Verified"></i>
                        </td>
                    `;
                    editPackage = `
                        <td>
                            <i class="fa fa-edit" style="pointer-events: none; color: grey;" title="Cannot edit - Verified"></i>
                        </td>
                    `;
                     document.getElementById('verify').style.display = 'none';
                }
                
                if (item.verification_status === 'Not Verified') {
                    editIcon11 = `
                        <td>
                             <i class="fa fa-eye" style="pointer-events: none; color: grey;" title="Cannot view -Not Verified"></i>
                        </td>
                    `;
                    editPackage = `
                        <td>
                             <i class="fa fa-edit" style="pointer-events: none; color: grey;" title="Cannot view -Not Verified"></i>
                        </td>
                    `;
                     document.getElementById('verify').style.display = 'none';
                }

                li += `
                    <tr id="${item.scp_load}">
                        <td>${item.sale_order_code}</td>
                        <td>${item.scp_load}</td>
                        <td>${item.scrapitemname}</td>
                        <td>${item.scrap_type}</td>
                        <td>${item.unit_name}</td>
                        <td>${item.total_ordered}</td>
                        <td>${item.total_sold}</td>
                        <td>${item.balance}</td>
                        <td>${item.vehicleno}</td>
                        <td>${item.verification_status}</td>
                        ${editPackage}
                        ${editIcon} <!-- Dynamically disabled edit icon -->
                        ${editIcon11}
                    </tr>
                `;
            });

            // Insert table content into the table body
            document.getElementById("tableID").innerHTML = li;

            // Destroy any existing DataTable instance before reinitializing
            if ($.fn.DataTable.isDataTable('#tableID')) {
                $('#tableID').DataTable().destroy();
            }

            // Initialize DataTable
            $('#tableID').DataTable({
                dom: 'Bfrtip',
                scrollX: true,
                info: false,
                paging: false,
                buttons: [
                    {
                        extend: 'excel',
                        text: 'Export to Excel',
                        title: 'Type List',
                    },
                ]
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}*/


let currentFactoryIdScrapPN = null;

function fetchUserList(selectedFactoryId) {

    currentFactoryIdScrapPN = selectedFactoryId ||
                              localStorage.getItem("selectedFactoryId");

    // 🔥 Destroy existing DataTable
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

                    const url = new URL(`/jssl/saleOrderPackingNote/allScrapPackingNoteDetailsNewPaged`, baseUrl);
                    url.searchParams.append('factory_id', currentFactoryIdScrapPN);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {

                            const exportData = json.AllScraPackingNoteDetailsNew.map(item => [
                                item.sale_order_code      || '',
                                item.scp_load             || '',
                                item.scrapitemname        || '',
                                item.scrap_type           || '',
                                item.unit_name            || '',
                                item.total_ordered        || '',
                                item.total_sold           || '',
                                item.balance              || '',
                                item.vehicleno            || '',
                                item.verification_status  || ''
                            ]);

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>Sale Order Code</th>',
                                        '<th>Scrap Packing Note</th>',
                                        '<th>Scrap Item Name</th>',
                                        '<th>Scrap Type</th>',
                                        '<th>Unit Name</th>',
                                        '<th>Total Ordered</th>',
                                        '<th>Total Sold</th>',
                                        '<th>Balance</th>',
                                        '<th>Vehicle Number</th>',
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
                                    title: 'Scrap Packing Note List'
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
            { title: "Sale Order Code"   },
            { title: "Scrap Packing Note"},
            { title: "Scrap Item Name"   },
            { title: "Scrap Type"        },
            { title: "Unit Name"         },
            { title: "Total Ordered"     },
            { title: "Total Sold"        },
            { title: "Balance"           },
            { title: "Vehicle Number"    },
            { title: "Status"            },
            { title: "Edit Package", orderable: false },
            { title: "Verify",       orderable: false },
            { title: "View",         orderable: false }
        ],
        ajax: function (data, callback, settings) {

            const page = data.start / data.length;
            const size = data.length;
			const searchValue = data.search.value;

            const url = new URL(`/jssl/saleOrderPackingNote/allScrapPackingNoteDetailsNewPaged`, baseUrl);
            url.searchParams.append('factory_id', currentFactoryIdScrapPN);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
			url.searchParams.append('search', searchValue);

            fetch(url, { credentials: "include" })
                .then(response => response.json())
                .then(json => {

                    if (!json.AllScraPackingNoteDetailsNew || json.status === 'error') {
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });
                        return;
                    }

                    const rows = json.AllScraPackingNoteDetailsNew.map(item => {

                        let editPackage = '';
                        let editIcon    = '';
                        let viewIcon    = '';

                        if (item.verification_status === 'Verified') {
                            editPackage = `<i class="fa fa-edit text-muted" title="Cannot edit - Verified"></i>`;
                            editIcon    = `<i class="fa fa-pen text-muted" title="Cannot edit - Verified"></i>`;
                            viewIcon    = `<i class="fa fa-eye" style="color:green;" onclick="reviewRecord12('${item.scp_load}')"></i>`;
                        } else {
                            // Not Verified
                            editPackage = `<i class="fa fa-edit" style="color:blue;" onclick="editPackage11('${item.scp_load}')"></i>`;
                            editIcon    = `<i class="fa fa-pen" style="color:blue;" onclick="reviewRecord('${item.scp_load}')"></i>`;
                            viewIcon    = `<i class="fa fa-eye text-muted" title="Cannot view - Not Verified"></i>`;
                        }

                        return [
                            item.sale_order_code     || '',  // col 0
                            item.scp_load            || '',  // col 1
                            item.scrapitemname       || '',  // col 2
                            item.scrap_type          || '',  // col 3
                            item.unit_name           || '',  // col 4
                            item.total_ordered       || '',  // col 5
                            item.total_sold          || '',  // col 6
                            item.balance             || '',  // col 7
                            item.vehicleno           || '',  // col 8
                            item.verification_status || '',  // col 9
                            editPackage,                     // col 10
                            editIcon,                        // col 11
                            viewIcon                         // col 12
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
                    console.error('Error fetching scrap packing note data:', error);
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







document.addEventListener("DOMContentLoaded", function () {
	loadAllowedActions();
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypes(selectedFactoryId);
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

async function fetchSaleOrderTypes(factoryId) {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/saleOrderEntry/getSaleOrderBasedOnFactoryId`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.SaleOrderDetails.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("scrapSaleOrder");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Sale Order number</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.SaleOrderDetails.forEach((type) => {
            if (type.sale_order_code && type.sale_order_code) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.sale_order_code; // Backend keeps saleorder_id
                option.textContent = type.sale_order_code; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const scrapSaleOrderSelect = document.getElementById("scrapSaleOrder");
    const inputFieldsContainer = document.getElementById("inputFieldsContainer");

    // Event listener to show additional fields when a scrapSaleOrder is selected
    scrapSaleOrderSelect.addEventListener("change", function () {
        const saleOrderCode = scrapSaleOrderSelect.value;

        if (saleOrderCode) {
			let errorElement = document.getElementById("productCodeError12");
			errorElement.style.display = "none";
		 document.getElementById("kgsMt").value="";
		
            inputFieldsContainer.style.display = "block"; // Show the container
            fetchSaleOrderDetails(saleOrderCode); // Fetch and populate details based on selected sale order
        } else {
            inputFieldsContainer.style.display = "none"; // Hide the container
        }
    });
});

async function fetchSaleOrderDetails(saleOrderCode) {
    try {
        const url = new URL(`/jssl/saleOrderEntry/getSaleOrderBasedOnIdNew`, baseUrl);
        url.searchParams.append("sale_order_code", saleOrderCode);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch sale order details");

        const json = await response.json();

        // Populate order level fields
        const orderDetails = json.orderLevel[0];
        document.getElementById("saleOrderDate").value = orderDetails.auction_date || '';
        document.getElementById("vendorName").value = orderDetails.address || '';
        document.getElementById("locationDetails").value = orderDetails.location_name || '';
        document.getElementById("locationType").value = orderDetails.location_code || '';
        document.getElementById("validityDate").value = orderDetails.sale_order_duration || '';
        document.getElementById("vendorName11").value = orderDetails.sale_order_to_id || '';
        document.getElementById("locationTypeid").value = orderDetails.location_type_id || '';

        // Populate order item level fields
        const orderItemDetails = json.orderItemLevel[0];
        document.getElementById("totalSteelQty").value = orderItemDetails.kg || '';
        document.getElementById("scraptype").value = orderItemDetails.scrap_type || '';
        document.getElementById("scrapitem").value = orderItemDetails.scrapitemname || '';
        document.getElementById("uom").value = orderItemDetails.unit_name || '';
        document.getElementById("scraptype11").value = orderItemDetails.scrap_type_id || '';
        document.getElementById("scrapitem11").value = orderItemDetails.scrapitem_id || '';
        document.getElementById("uom11").value = orderItemDetails.uom_id || '';
        document.getElementById("unitPrice").value = orderItemDetails.unit_price || '';

        // Populate balance info fields
        const balanceInfo = json.balanceInfo[0];
        document.getElementById("totalor").value = balanceInfo.dummy_balance || '';
        document.getElementById("tolvalue").value = balanceInfo.tolerance        || '';
        document.getElementById("balcal").value = balanceInfo.balance || '';
        document.getElementById("bal").value = balanceInfo.balance || '';

        // ✅ Store original balance for insert validation (fixed reference)
        document.getElementById("originalBalanceInsert").value = balanceInfo.balance || '';

    } catch (error) {
        console.error("Error fetching sale order details:", error);
    }
}


// ✅ Insert Modal — kgsMt validation (balance + tolerance)
document.getElementById("kgsMt").addEventListener("input", function () {

    let enteredValue = parseFloat(this.value) || 0;

    // ✅ Always use originalBalanceInsert (fixed value, never recalculated)
    let originalBalance = parseFloat(document.getElementById("originalBalanceInsert").value) || 0;
    let tolerance = parseFloat(document.getElementById("tolvalue").value) || 0;

    let maxAllowed = originalBalance + tolerance; // e.g. 180 + 3 = 183

    let errorElement = document.getElementById("productCodeError12");

    if (enteredValue < 0) {
        errorElement.innerText = "Negative values are not allowed";
        errorElement.style.display = "block";
        this.value = 0;
    } else if (enteredValue > maxAllowed) {
        errorElement.innerText = `Value cannot exceed ${maxAllowed} (Balance: ${originalBalance} + Tolerance: ${tolerance})`;
        errorElement.style.display = "block";
        this.value = maxAllowed;
    } else {
        errorElement.innerText = "";
        errorElement.style.display = "none";
    }
});


// ✅ Edit Modal — kgsMtre00 validation (balance + tolerance)
document.getElementById("kgsMtre00").addEventListener("input", function () {

    let enteredValue = parseFloat(this.value) || 0;

    // ✅ Always use originalBalanceEdit (fixed value set when modal opens)
    let originalBalance = parseFloat(document.getElementById("originalBalanceEdit").value) || 0;
    let tolerance = parseFloat(document.getElementById("tolvalueedit").value) || 0;

    let maxAllowed = originalBalance + tolerance; // e.g. 180 + 3 = 183

    let errorElement = document.getElementById("productCodeError91edit11");

    if (enteredValue < 0) {
        errorElement.innerText = "Negative values are not allowed";
        errorElement.style.display = "block";
        this.value = 0;
    } else if (enteredValue > maxAllowed) {
        errorElement.innerText = `Value cannot exceed ${maxAllowed} (Balance: ${originalBalance} + Tolerance: ${tolerance})`;
        errorElement.style.display = "block";
        this.value = maxAllowed;
    } else {
        errorElement.innerText = "";
        errorElement.style.display = "none";
    }
});


// ✅ Insert Modal — calculate total and balance (balance never goes negative)
document.addEventListener("DOMContentLoaded", function () {
    function calculateTotal() {
        let kg = parseFloat(document.getElementById("kgsMt").value) || 0;
        let uprice = parseFloat(document.getElementById("unitPrice").value) || 0;

        document.getElementById("total").value = (kg * uprice).toFixed(2);
        document.getElementById("totalso").value = (kg * 1).toFixed(2);

        let total = parseFloat(document.getElementById("totalor").value) || 0;
        let total11 = parseFloat(document.getElementById("totalso").value) || 0;

        let bal = total - total11;
        // ✅ Never show negative balance
        document.getElementById("bal").value = Math.max(0, bal).toFixed(2);
    }

    document.getElementById("kgsMt").addEventListener("input", calculateTotal);
    document.getElementById("unitPrice").addEventListener("input", calculateTotal);
    document.getElementById("totalor").addEventListener("input", calculateTotal);
    document.getElementById("totalso").addEventListener("input", calculateTotal);
});


// ✅ Edit Modal — calculate total and balance (balance never goes negative)
document.addEventListener("DOMContentLoaded", function () {
    function calculateTotalEdit() {
        let kg1 = parseFloat(document.getElementById("kgsMtre00").value) || 0;
        let uprice1 = parseFloat(document.getElementById("unitPricere00").value) || 0;

        document.getElementById("totalre00").value = (kg1 * uprice1).toFixed(2);
        document.getElementById("totalsore00").value = (kg1 * 1).toFixed(2);

        let total1 = parseFloat(document.getElementById("totalorre00").value) || 0;
        let total112 = parseFloat(document.getElementById("totalsore00").value) || 0;

        let bal1 = total1 - total112;
        // ✅ Never show negative balance
        document.getElementById("balre00").value = Math.max(0, bal1).toFixed(2);
    }

    document.getElementById("kgsMtre00").addEventListener("input", calculateTotalEdit);
    document.getElementById("unitPricere00").addEventListener("input", calculateTotalEdit);
    document.getElementById("totalorre00").addEventListener("input", calculateTotalEdit);
    document.getElementById("totalsore00").addEventListener("input", calculateTotalEdit);
});

function openModalAdd() {
    var Quantity = document.getElementById('quantity').value.trim();
    var kgsMt = document.getElementById('kgsMt').value.trim();
    var unitPrice = document.getElementById('unitPrice').value.trim();
    var Name = document.getElementById('transporterName').value.trim();
    var vehicleNo = document.getElementById('vehicleNo').value.trim();
    var weighbrid = document.getElementById('weighbrid').value.trim();
    var date = document.getElementById('date').value.trim();
    var order = document.getElementById('scrapSaleOrder').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (Quantity === '') {
        document.getElementById('productCodeError1').innerText = "Please enter quantity.";
        document.getElementById('productCodeError1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError1').innerText = "";
        document.getElementById('productCodeError1').style.display = "none";
    }
    
    // Password Validation
    if (kgsMt === '') {
        document.getElementById('productCodeError12').innerText = "Please enter kg.";
        document.getElementById('productCodeError12').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError12').innerText = "";
        document.getElementById('productCodeError12').style.display = "none";
    }
    
    if (unitPrice === '') {
        document.getElementById('productCodeError13').innerText = "Please enter unit price.";
        document.getElementById('productCodeError13').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError13').innerText = "";
        document.getElementById('productCodeError13').style.display = "none";
    }
    
    if (Name === '') {
        document.getElementById('productCodeError14').innerText = "Please enter Transporter Name.";
        document.getElementById('productCodeError14').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError14').innerText = "";
        document.getElementById('productCodeError14').style.display = "none";
    }
    
    if (vehicleNo === '') {
        document.getElementById('productCodeError15').innerText = "Please enter vehicle No.";
        document.getElementById('productCodeError15').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError15').innerText = "";
        document.getElementById('productCodeError15').style.display = "none";
    }
    
    if (weighbrid === '') {
        document.getElementById('productCodeError16').innerText = "Please enter Weighbridge Slip No.";
        document.getElementById('productCodeError16').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError16').innerText = "";
        document.getElementById('productCodeError16').style.display = "none";
    }
    
    if (date === '') {
        document.getElementById('productCodeError17').innerText = "Please enter date.";
        document.getElementById('productCodeError17').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError17').innerText = "";
        document.getElementById('productCodeError17').style.display = "none";
    }
    
    if (order === '') {
        document.getElementById('productCodeError18').innerText = "Please select sale order.";
        document.getElementById('productCodeError18').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError18').innerText = "";
        document.getElementById('productCodeError18').style.display = "none";
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
        url: new URL('/jssl/saleOrderPackingNote/addSaleOrderPackingNoteNew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({sale_order_code: scrapSaleOrder.value, 
        total_steel_qty: totalSteelQty.value, 
        created_by: createdById,
        factory_id:selectedFactoryId,
        total_non_steel_qty:"0",
        sale_order_validity:validityDate.value,
        vendor_id:vendorName11.value,
        weighbridge_no:weighbrid.value,
        transportername:transporterName.value,
        vehicle_no:vehicleNo.value,
        scp_pn_date:date.value,
        sale_order_date:saleOrderDate.value,
        scrap_type_id:scraptype11.value,
        scrapitem_id:scrapitem11.value,
        uom_id:uom11.value,
        quantity:quantity.value,
        kg:kgsMt.value,
        unit_price:unitPrice.value,
        total:total.value,
        total_ordered:totalor.value,
        total_sold:totalso.value,
        location_type_id:locationTypeid.value,
        balance:bal.value
        }),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Scrap QS Packing Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ScrapQA.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                // Optionally, you can alert or log failure message here
                console.log(data.message || 'Failed to create module.');
            }
        },
        error: function() {
            // Handle AJAX error
            console.error('Request failed.');
        }
    });
}

function reviewRecord(scp_load) {
	  //const allowed = window.allowedActions || [];

	if (!allowed.includes("Verify")) {
	  alert(" You do not have permission to Verify.");
	  return;
	}
    const url = new URL(`/jssl/saleOrderPackingNote/getPackingNoteScpLoad`, baseUrl);
    const params = [['scp_load', scp_load]];
    url.search = new URLSearchParams(params).toString();

    // Show loading spinner or disable fields here, if needed

  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            console.log(JSON.stringify(response, null, 2)); // Pretty-print response for debugging

            if (response.status === 'yes') {
                // Check if PackingNoteItemDetails exists and has data
                if (response.PackingNoteItemDetails && response.PackingNoteItemDetails.length > 0) {
                    // Loop through the PackingNoteItemDetails array and populate fields for each item
                    response.PackingNoteItemDetails.forEach(item => {
                        $('#unitPricere').val(item.unit_price);
                        $('#totalre').val(item.total);
                        $('#uomre').val(item.unit_name);
                        $('#scraptypere').val(item.scrap_type);
                        $('#quantityre').val(item.quantity);
                        $('#kgsMtre').val(item.kg);
                        $('#scrapitemre').val(item.scrapitemname);
                        $('#scid').val(item.scp_load);
                        $('#scrapitem11re').val(item.scp_pnitems_id);
                        $('#scrapSaleOrderre').val(item.sale_order_code);
                    });
                } else {
                    console.warn('No PackingNoteItemDetails available:', response.PackingNoteItemDetails);
                }

                // Check if PackingNoteDetails exists and populate fields
                if (response.PackingNoteDetails) {
                    $('#validityDatere').val(response.PackingNoteDetails.sale_order_validity);
                    $('#datere').val(response.PackingNoteDetails.scp_pn_date);
                    $('#totalSteelQtyre').val(response.PackingNoteDetails.total_steel_qty);
                    $('#nonsteelre').val(response.PackingNoteDetails.total_non_steel_qty);
                    $('#transporterNamere').val(response.PackingNoteDetails.transportername);
                    $('#weighbridre').val(response.PackingNoteDetails.weighbridge_no);
                    $('#vehicleNore').val(response.PackingNoteDetails.vehicleno);
                    $('#Buyers').val(response.PackingNoteDetails.buyer_ref_no);
                    $('#vendorName11re').val(response.PackingNoteDetails.vendor_id);
                    $('#saleOrderDatere').val(response.PackingNoteDetails.sale_order_date);
                    $('#vendorNamere').val(response.PackingNoteDetails.vendor_name);
                    $('#locationTypere').val(response.PackingNoteDetails.location_name);
                    $('#locationDetailsre').val(response.PackingNoteDetails.location_code);
                    // Check if verification_status is "Verified"
                    if (response.PackingNoteDetails.verification_status === "Verified") {
                        // Hide the "Verify" button if status is "Verified"
                        document.getElementById('verify').style.display = 'none';
                    } else {
                        // Ensure the "Verify" button is visible if status is not "Verified"
                        document.getElementById('verify').style.display = 'block';
                    }

                    $('#verify').val(response.PackingNoteDetails.verification_status);
                  }

                // Check if BalanceInfo exists and populate fields
                if (response.BalanceInfo) {
                    $('#balre').val(response.BalanceInfo.balance);
                    $('#totalorre').val(response.BalanceInfo.total_ordered);
                    $('#totalsore').val(response.BalanceInfo.total_sold);
                    
                }

                // Open the modal after populating fields
                $('#exampleModalScrollable123RE').modal('show');
            } else {
                // Hide modal if the status is not 'yes'
                $('#exampleModalScrollable123RE').modal('hide');
                alert('Failed to fetch data. Please try again.');
            }
        })
        .catch(error => {
            // Handle error and provide user feedback
            console.error('Error:', error);
            alert('An error occurred while fetching data. Please try again.');
        });
}

function reviewRecord12(scp_load) {
	//const allowed = window.allowedActions || [];

			if (!allowed.includes("view")) {
			  alert(" You do not have permission to view.");
			    $("#exampleModalScrollable123REedit").modal("hide");
			  return;
			}
    const url = new URL(`/jssl/saleOrderPackingNote/getPackingNoteScpLoad`, baseUrl);
    const params = [['scp_load', scp_load]];
    url.search = new URLSearchParams(params).toString();

    // Show loading spinner or disable fields here, if needed

  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            console.log(JSON.stringify(response, null, 2)); // Pretty-print response for debugging

            if (response.status === 'yes') {
                // Check if PackingNoteItemDetails exists and has data
                if (response.PackingNoteItemDetails && response.PackingNoteItemDetails.length > 0) {
                    // Loop through the PackingNoteItemDetails array and populate fields for each item
                    response.PackingNoteItemDetails.forEach(item => {
                        $('#unitPricereedit').val(item.unit_price);
                        $('#totalrewedit').val(item.total);
                        $('#uomreedit').val(item.unit_name);
                        $('#scraptypereedit').val(item.scrap_type);
                        $('#quantityreedit').val(item.quantity);
                        $('#kgsMtreedit').val(item.kg);
                        $('#scrapitemreedit').val(item.scrapitemname);
                        $('#scidedit').val(item.scp_load);
                        $('#scrapitem11reedit').val(item.scp_pnitems_id);
                        $('#scrapSaleOrderreedit').val(item.sale_order_code);
                    });
                } else {
                    console.warn('No PackingNoteItemDetails available:', response.PackingNoteItemDetails);
                }

                // Check if PackingNoteDetails exists and populate fields
                if (response.PackingNoteDetails) {
                    $('#validityDatereedit').val(response.PackingNoteDetails.sale_order_validity);
                    $('#datereedit').val(response.PackingNoteDetails.scp_pn_date);
                    $('#totalSteelQtyreedit').val(response.PackingNoteDetails.total_steel_qty);
                    $('#nonsteelreedit').val(response.PackingNoteDetails.total_non_steel_qty);
                    $('#transporterNamereedit').val(response.PackingNoteDetails.transportername);
                    $('#weighbridreedit').val(response.PackingNoteDetails.weighbridge_no);
                    $('#vehicleNoreedit').val(response.PackingNoteDetails.vehicleno);
                    $('#Buyersedit').val(response.PackingNoteDetails.buyer_ref_no);
                    $('#vendorName11reedit').val(response.PackingNoteDetails.vendor_id);
                    $('#saleOrderDatereedit').val(response.PackingNoteDetails.sale_order_date);
                    $('#vendorNamereedit').val(response.PackingNoteDetails.vendor_name);
                    $('#locationTypereedit').val(response.PackingNoteDetails.location_name);
                    $('#locationDetailsreedit').val(response.PackingNoteDetails.location_code);
                    $('#remarkss').val(response.PackingNoteDetails.remarks);
                    // Check if verification_status is "Verified"
                    if (response.PackingNoteDetails.verification_status === "Verified") {
                        // Hide the "Verify" button if status is "Verified"
                        document.getElementById('verify').style.display = 'none';
                    } else {
                        // Ensure the "Verify" button is visible if status is not "Verified"
                        document.getElementById('verify').style.display = 'block';
                    }

                    $('#verify').val(response.PackingNoteDetails.verification_status);
                  }

                // Check if BalanceInfo exists and populate fields
                if (response.BalanceInfo) {
                    $('#balreedit').val(response.BalanceInfo.balance);
                    $('#totalorreedit').val(response.BalanceInfo.total_ordered);
                    $('#totalsoreedit').val(response.BalanceInfo.total_sold);
                    
                }

                // Open the modal after populating fields
                $('#exampleModalScrollable123REedit').modal('show');
            } else {
                // Hide modal if the status is not 'yes'
                $('#exampleModalScrollable123REedit').modal('hide');
                alert('Failed to fetch data. Please try again.');
            }
        })
        .catch(error => {
            // Handle error and provide user feedback
            console.error('Error:', error);
            alert('An error occurred while fetching data. Please try again.');
        });
}

function editPackage11(scp_load) {
			 // const allowed = window.allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}

    const url = new URL(`/jssl/saleOrderPackingNote/getPackingNoteScpLoad`, baseUrl);
    const params = [['scp_load', scp_load]];
    url.search = new URLSearchParams(params).toString();
	let errorElement = document.getElementById("productCodeError91edit11");
			errorElement.style.display = "none";
			
			
    // Show loading spinner or disable fields here, if needed

   fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            console.log(JSON.stringify(response, null, 2)); // Pretty-print response for debugging

            if (response.status === 'yes') {
                // Check if PackingNoteItemDetails exists and has data
                if (response.PackingNoteItemDetails && response.PackingNoteItemDetails.length > 0) {
                    // Loop through the PackingNoteItemDetails array and populate fields for each item
                    response.PackingNoteItemDetails.forEach(item => {
                        $('#unitPricere00').val(item.unit_price);
                        $('#totalre00').val(item.total);
                        $('#uomre00').val(item.unit_name);
                        $('#uom11re00').val(item.uom_id);
                        $('#scraptypere00').val(item.scrap_type);
                        $('#scraptype11re00').val(item.scrap_type_id);
                        $('#quantityre00').val(item.quantity);
                        $('#kgsMtre00').val(item.kg);
                        $('#scrapitemre00').val(item.scrapitemname);
                        $('#scid00').val(item.scp_load);
                        $('#scrapitem11re00').val(item.scp_pnitems_id);
                        $('#scrapSaleOrderre00').val(item.sale_order_code);
                        $('#scrapitem11re00id').val(item.scrapitem_id);
                        $('#scppnid11').val(item.scp_pn_id);
                    });
                } else {
                    console.warn('No PackingNoteItemDetails available:', response.PackingNoteItemDetails);
                }

                // Check if PackingNoteDetails exists and populate fields
                if (response.PackingNoteDetails) {
                    $('#validityDatere00').val(response.PackingNoteDetails.sale_order_validity);
                    $('#datere00').val(response.PackingNoteDetails.scp_pn_date);
                    $('#totalSteelQtyre00').val(response.PackingNoteDetails.total_steel_qty);
                    $('#nonsteelre00').val(response.PackingNoteDetails.total_non_steel_qty);
                    $('#transporterNamere00').val(response.PackingNoteDetails.transportername);
                    $('#weighbridre00').val(response.PackingNoteDetails.weighbridge_no);
                    $('#vehicleNore00').val(response.PackingNoteDetails.vehicleno);
                    $('#Buyers00').val(response.PackingNoteDetails.buyer_ref_no);
                    $('#vendorName11re00').val(response.PackingNoteDetails.vendor_id);
                    $('#saleOrderDatere00').val(response.PackingNoteDetails.sale_order_date);
                    $('#vendorNamere00').val(response.PackingNoteDetails.vendor_name);
                    $('#locationTypere00').val(response.PackingNoteDetails.location_name);
                    $('#locationDetailsre00').val(response.PackingNoteDetails.location_code);
                    $('#locationTypere00id').val(response.PackingNoteDetails.location_type);
                    $('#verify00').val(response.PackingNoteDetails.verification_status);
                    $('#crell11').val(response.PackingNoteDetails.credit_reference);
                    $('#proref11').val(response.PackingNoteDetails.project_reference);
                    $('#cen11up').val(response.PackingNoteDetails.central_excise_tarrif_no);
                    $('#otreffup').val(response.PackingNoteDetails.other_reference);
                  }

                // Check if BalanceInfo exists and populate fields
                if (response.BalanceInfo) {
                    $('#balre00').val(response.BalanceInfo.balance);
                    $('#totalorre00').val(response.BalanceInfo.total_ordered);
                    $('#totalsore00').val(response.BalanceInfo.total_sold);
                    $('#tolvalueedit').val(response.BalanceInfo.tolerance);
					$('#originalBalanceEdit').val(response.BalanceInfo.balance); // ✅ ADD THIS LINE
                }

                // Open the modal after populating fields
                $('#exampleModalScrollable123REEditUp').modal('show');
            } else {
                // Hide modal if the status is not 'yes'
                $('#exampleModalScrollable123REEditUp').modal('hide');
                alert('Failed to fetch data. Please try again.');
            }
        })
        .catch(error => {
            // Handle error and provide user feedback
            console.error('Error:', error);
            alert('An error occurred while fetching data. Please try again.');
        });
}

function openModalAddRev() {
    var Quantity = document.getElementById('quantityre').value.trim();
    var kgsMt = document.getElementById('kgsMtre').value.trim();
    var Name = document.getElementById('transporterNamere').value.trim();
    var vehicleNo = document.getElementById('vehicleNore').value.trim();
    var weighbrid = document.getElementById('weighbridre').value.trim();
    var date = document.getElementById('datere').value.trim();
    var Buye = document.getElementById('Buyers').value.trim();
    var remark = document.getElementById('remark').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (Quantity === '') {
        document.getElementById('productCodeError90').innerText = "Please enter quantity.";
        document.getElementById('productCodeError90').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError90').innerText = "";
        document.getElementById('productCodeError90').style.display = "none";
    }
    
    // Password Validation
    if (kgsMt === '') {
        document.getElementById('productCodeError91').innerText = "Please enter kg.";
        document.getElementById('productCodeError91').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError91').innerText = "";
        document.getElementById('productCodeError91').style.display = "none";
    }
    
    if (Name === '') {
        document.getElementById('productCodeError92').innerText = "Please enter Transporter Name.";
        document.getElementById('productCodeError92').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError92').innerText = "";
        document.getElementById('productCodeError92').style.display = "none";
    }
    
    if (vehicleNo === '') {
        document.getElementById('productCodeError93').innerText = "Please enter vehicle No.";
        document.getElementById('productCodeError93').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError93').innerText = "";
        document.getElementById('productCodeError93').style.display = "none";
    }
    
    if (weighbrid === '') {
        document.getElementById('productCodeError900').innerText = "Please enter Weighbridge Slip No.";
        document.getElementById('productCodeError900').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError900').innerText = "";
        document.getElementById('productCodeError900').style.display = "none";
    }
    
    if (date === '') {
        document.getElementById('productCodeError94').innerText = "Please enter date.";
        document.getElementById('productCodeError94').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError94').innerText = "";
        document.getElementById('productCodeError94').style.display = "none";
    }
    
    if (Buye === '') {
        document.getElementById('productCodeError95').innerText = "Please enter Buyer's Reference No.";
        document.getElementById('productCodeError95').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError95').innerText = "";
        document.getElementById('productCodeError95').style.display = "none";
    }
    
    if (remark === '') {
        document.getElementById('productCodeError96').innerText = "Please enter Remarks.";
        document.getElementById('productCodeError96').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError96').innerText = "";
        document.getElementById('productCodeError96').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenterverify').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function verifyevent() {
	$('#exampleModalCenterverify').modal('hide');
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/saleOrderPackingNote/verifyScrapPackingNoteNew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({scp_load: scid.value, 
        vendor_id: vendorName11re.value, 
        weighbridge_no:weighbridre.value,
        transportername:transporterNamere.value,
        vehicle_no:vehicleNore.value,
        scp_pn_date:datere.value,
        verified_by:createdById,
        remarks:remark.value,
        quantity:quantityre.value,
        kg:kgsMtre.value,
        unit_price:unitPricere.value,
        total:totalre.value,
        total_ordered:totalorre.value,
        total_sold:totalsore.value,
        balance:balre.value,
        scp_pnitems_id:scrapitem11re.value
        }),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Scrap QS Packing Verified Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ScrapQA.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                // Optionally, you can alert or log failure message here
                console.log(data.message || 'Failed to create module.');
            }
        },
        error: function() {
            // Handle AJAX error
            console.error('Request failed.');
        }
    });
}

function openModalEditUp() {
    var Quantity = document.getElementById('quantityre00').value.trim();
    var kgsMt = document.getElementById('kgsMtre00').value.trim();
    var Name = document.getElementById('transporterNamere00').value.trim();
    var vehicleNo = document.getElementById('vehicleNore00').value.trim();
    var weighbrid = document.getElementById('weighbridre00').value.trim();
    var date = document.getElementById('datere00').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (Quantity === '') {
        document.getElementById('productCodeError90edit').innerText = "Please enter quantity.";
        document.getElementById('productCodeError90edit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError90edit').innerText = "";
        document.getElementById('productCodeError90edit').style.display = "none";
    }
    
    // Password Validation
    if (kgsMt === '') {
        document.getElementById('productCodeError91edit11').innerText = "Please enter kg.";
        document.getElementById('productCodeError91edit11').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError91edit11').innerText = "";
        document.getElementById('productCodeError91edit11').style.display = "none";
    }
    
    if (Name === '') {
        document.getElementById('productCodeError92edit').innerText = "Please enter Transporter Name.";
        document.getElementById('productCodeError92edit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError92edit').innerText = "";
        document.getElementById('productCodeError92edit').style.display = "none";
    }
    
    if (vehicleNo === '') {
        document.getElementById('productCodeError93edit').innerText = "Please enter vehicle No.";
        document.getElementById('productCodeError93edit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError93edit').innerText = "";
        document.getElementById('productCodeError93edit').style.display = "none";
    }
    
    if (weighbrid === '') {
        document.getElementById('productCodeError900edit').innerText = "Please enter Weighbridge Slip No.";
        document.getElementById('productCodeError900edit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError900edit').innerText = "";
        document.getElementById('productCodeError900edit').style.display = "none";
    }
    
    if (date === '') {
        document.getElementById('productCodeError94edit').innerText = "Please enter date.";
        document.getElementById('productCodeError94edit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError94edit').innerText = "";
        document.getElementById('productCodeError94edit').style.display = "none";
    }
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenteEditup').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function Updateevent() {
	$('#exampleModalCenteEditup').modal('hide');
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/saleOrderPackingNote/updateSaleOrderPackingNoteNew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
        dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
        data: jQuery.param({
	    sale_order_code: scrapSaleOrderre00.value, 
	    scp_load:scid00.value,
	    total_steel_qty:totalSteelQtyre00.value,
	    total_non_steel_qty:"0",
	    sale_order_validity:validityDatere00.value,
	    vendor_id:vendorName11re00.value,
	    weighbridge_no:weighbridre00.value,
	    transportername:transporterNamere00.value,
	    vehicle_no:vehicleNore00.value,
	    scp_pn_date:datere00.value,
	    project_reference:proref11.value,
	    central_excise_tarrif_no:cen11up.value,
	    other_reference:otreffup.value,
	    credit_reference:crell11.value,
	    modified_by:createdById,
	    scrap_type_id:scraptype11re00.value,
	    scrapitem_id:scrapitem11re00id.value,
	    uom_id:uom11re00.value,
	    quantity:quantityre00.value,
	    kg:kgsMtre00.value,
	    unit_price:unitPricere00.value,
	    total:totalre00.value,
	    total_ordered:totalorre00.value,
	    total_sold:totalsore00.value,
	    balance:balre00.value,
	    scp_pn_id:scppnid11.value,
	    scp_pnitems_id:scrapitem11re00.value,
	    location_type:locationTypere00id.value,
	    sale_order_date:saleOrderDatere00.value
        }),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Scrap QS Packing Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ScrapQA.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                // Optionally, you can alert or log failure message here
                console.log(data.message || 'Failed to create module.');
            }
        },
        error: function() {
            // Handle AJAX error
            console.error('Request failed.');
        }
    });
}
