
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


document.getElementById("#modalScroll").addEventListener("click", function () {
    // show custom message instead of opening modal
	  //const allowed = window.allowedActions || [];

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

// Ensure the ID is available before making the API call
$(document).ready(function () {
	loadAllowedActions();
    const factoryId = sessionStorage.getItem("selectedFactoryId");
    if (factoryId) {
        fetchUserList(factoryId);
    }
});

// Function to fetch the list of users/vendors based on the selected factory ID
// Function to fetch the list of users/vendors based on the selected factory ID
/*async function fetchUserList(selectedFactoryId) {
    try {
        const url = new URL(`/jssl/scrapinvoice/scrapInvoiceDetails`, baseUrl);
        url.searchParams.append('factory_id', selectedFactoryId);

        // Fetch vendor data
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        // Function to format date to "dd-mm-yyyy"
        const formatDate = (dateStr) => {
            if (!dateStr) return ''; // Handle empty/null values
            const dateObj = new Date(dateStr);
            if (isNaN(dateObj)) return dateStr; // Return original if invalid
            return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-'); // Replace / with -
        };

        // Prepare table content
        let tableContent = `
            <thead>
                <tr>
                    <th>Invoice Number</th>
                    <th>Scrap Packing Note</th>
                    <th>Sale Order Number</th>
                    <th>Invoice Generated Date</th>
                    <th>Status</th>
                    <th>Edit</th>
                    <th>Verify</th>
                    <th>View</th>
					<th>Cancel</th>
                    <th>Print</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.ScrapInvoiceInfo.forEach(item => {
	        let editinvoice = '';
            let editIcon = '';
            //let viewIcon = '';
            //let printIconView = '';
            let printIcon = ''; // Print Icon
			let cancelIcon = '';

			if (item.verified_status === 'CANCELLED') {

									    editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
									    editIcon    = `<td><i class="fa fa-pen text-muted"></i></td>`;
									    releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
									    cancelIcon  = `<td><i class="fa fa-times-circle text-muted"></i></td>`;

									     ✅ Print allowed 
									    printIcon = `
									        <td>
									            <i class="fa fa-print" style="color: green; cursor: pointer;"
									               onclick="printRecord('${item.id}')">
									            </i>
									        </td>
									    `;

									 🟢 VERIFIED 
				} else if (item.verified_status === 'VERIFIED') {
	            editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
                editIcon = `<td><i class="fa fa-pen text-muted"></i></td>`; // Disabled (greyed out)
                //viewIcon = `<td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}')"></i></td>`; // Enabled
                printIcon = `<td><i id="printvvvtest" class="fa fa-print" style="color: green;" onclick="printRecord('${item.id}')"></i></td>`; // Enabled
                //printIconView = `<td><i class="fa fa-eye" style="color: red;" onclick="printRecordView('${item.id}')"></i></td>`; // Enabled
				cancelIcon = ` <td>  <i class="fa fa-times-circle"style="color: red; cursor: pointer;" onclick="openModalcancel('${item.id}','${item.scp_load}')"> </i>  </td> `;
            } else if (item.verified_status === 'NOT VERIFIED') {
	            editinvoice = `<td><i class="fa fa-edit" style="color: blue;" onclick="editRecordInvoice('${item.id}')"></i></td>`; // Enabled
                editIcon = `<td><i  id="verfiyinc" class="fa fa-pen" style="color: blue;" onclick="editRecord('${item.id}')"></i></td>`; // Enabled
                //viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`; // Disabled (greyed out)
                printIcon = `<td><i class="fa fa-print text-muted"></i></td>`; // Disabled (greyed out)
                //printIconView = `<td><i class="fa fa-eye"></i></td>`;
				cancelIcon = `<td><i class="fa fa-times-circle text-muted"></i></td>`;
            } else {
	            editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
                editIcon = `<td><i class="fa fa-pen text-muted"></i></td>`;
                //viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`;
                printIcon = `<td><i class="fa fa-print text-muted"></i></td>`;
                //printIconView = `<td><i class="fa fa-eye"></i></td>`;
				cancelIcon = `<td><i class="fa fa-times-circle text-muted"></i></td>`;
            }

            tableContent += `
                <tr>
                    <td>${item.invoice_no}</td>
                    <td>${item.scp_load}</td>
                    <td>${item.load_id}</td>
                    <td>${formatDate(item.invoice_generated_date)}</td>  <!-- Formatted Date -->
                    <td>${item.verified_status}</td>
                    ${editinvoice}
                    ${editIcon}
                    <td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}')"></i></td>
					${cancelIcon}
                    ${printIcon}
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





let currentFactoryIdScrapInv = null;

function fetchUserList(selectedFactoryId) {

    currentFactoryIdScrapInv = selectedFactoryId ||
                               sessionStorage.getItem("selectedFactoryId");

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

                    const url = new URL(`/jssl/scrapinvoice/scrapInvoiceDetailsPaged`, baseUrl);
                    url.searchParams.append('factory_id', currentFactoryIdScrapInv);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {

                            const formatDate = (dateStr) => {
                                if (!dateStr) return '';
                                const dateObj = new Date(dateStr);
                                if (isNaN(dateObj)) return dateStr;
                                return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
                            };

                            const exportData = json.ScrapInvoiceInfo.map(item => [
                                item.invoice_no             || '',
                                item.scp_load               || '',
                                item.load_id                || '',
                                formatDate(item.invoice_generated_date),
                                item.verified_status        || ''
                            ]);

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>Invoice Number</th>',
                                        '<th>Scrap Packing Note</th>',
                                        '<th>Sale Order Number</th>',
                                        '<th>Invoice Generated Date</th>',
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
                                    title: 'Scrap Invoice List'
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
            { title: "Invoice Number"          },
            { title: "Scrap Packing Note"      },
            { title: "Sale Order Number"       },
            { title: "Invoice Generated Date"  },
            { title: "Status"                  },
            { title: "Edit Invoice", orderable: false },
            { title: "Verify",       orderable: false },
            { title: "View",         orderable: false },
			{ title: "Release",      orderable: false },
            { title: "Cancel",       orderable: false },
            { title: "Print",        orderable: false }
        ],
        ajax: function (data, callback, settings) {

            const page = data.start / data.length;
            const size = data.length;
			const searchValue = data.search.value;

            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                const dateObj = new Date(dateStr);
                if (isNaN(dateObj)) return dateStr;
                return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
            };

            const url = new URL(`/jssl/scrapinvoice/scrapInvoiceDetailsPaged`, baseUrl);
            url.searchParams.append('factory_id', currentFactoryIdScrapInv);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
			url.searchParams.append('search', searchValue);

            fetch(url, { credentials: "include" })
                .then(response => response.json())
                .then(json => {

                    if (!json.ScrapInvoiceInfo || json.status === 'error') {
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });
                        return;
                    }

                    const rows = json.ScrapInvoiceInfo.map(item => {

                        let editinvoice = '';
                        let editIcon    = '';
						let releaseIcon = '';
                        let cancelIcon  = '';
                        let printIcon   = '';
						let viewIcon   = '';

                        if (item.verified_status === 'CANCELLED') {
                            editinvoice = `<i class="fa fa-edit text-muted"></i>`;
                            editIcon    = `<i class="fa fa-pen text-muted"></i>`;
							releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                            cancelIcon  = `<i class="fa fa-times-circle text-muted"></i>`;
                            printIcon   = `<i class="fa fa-print" style="color:green; cursor:pointer;" onclick="printRecord('${item.id}')"></i>`;
							viewIcon    = `<i class="fa fa-eye" style="color:green;" onclick="editRecord11('${item.id}')"></i>`;

                        } else if (item.verified_status === 'VERIFIED') {
                            editinvoice = `<i class="fa fa-edit text-muted"></i>`;
                            editIcon    = `<i class="fa fa-pen text-muted"></i>`;
							releaseIcon = `<i class="fa fa-box-open" style="color:brown;" onclick="openModal('${item.id}','${item.scp_load}')"></i>`;
                            cancelIcon  = `<i class="fa fa-times-circle" style="color:red; cursor:pointer;" onclick="openModalcancel('${item.id}','${item.scp_load}')"></i>`;
                            printIcon   = `<i class="fa fa-print" style="color:green;" onclick="printRecord('${item.id}')"></i>`;
							viewIcon    = `<i class="fa fa-eye" style="color:green;" onclick="editRecord11('${item.id}')"></i>`;

                        } else if (item.verified_status === 'NOT VERIFIED') {
                            editinvoice = `<i class="fa fa-edit" style="color:blue;" onclick="editRecordInvoice('${item.id}')"></i>`;
                            editIcon    = `<i class="fa fa-pen" style="color:blue;" onclick="editRecord('${item.id}')"></i>`;
							releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                            cancelIcon  = `<i class="fa fa-times-circle text-muted"></i>`;
                            printIcon   = `<i class="fa fa-print text-muted"></i>`;
							viewIcon   = `<i class="fa fa-eye text-muted"></i>`;

                        } else {
                            editinvoice = `<i class="fa fa-edit text-muted"></i>`;
                            editIcon    = `<i class="fa fa-pen text-muted"></i>`;
							releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                            cancelIcon  = `<i class="fa fa-times-circle text-muted"></i>`;
                            printIcon   = `<i class="fa fa-print text-muted"></i>`;
							viewIcon   = `<i class="fa fa-eye text-muted"></i>`;
                        }

                        return [
                            item.invoice_no              || '',  // col 0
                            item.scp_load                || '',  // col 1
                            item.load_id                 || '',  // col 2
                            formatDate(item.invoice_generated_date), // col 3
                            item.verified_status         || '',  // col 4
                            editinvoice,                         // col 5
                            editIcon,                            // col 6
                            viewIcon,                            // col 7
							releaseIcon,
                            cancelIcon,                          // col 8
                            printIcon                            // col 9
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
                    console.error('Error fetching scrap invoice data:', error);
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

// ✅ Auto load on page open


document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchPackingnote(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchPackingnote(factoryId) {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/saleOrderPackingNote/allVerifiedScrapingNotes`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.VerifiedPackingNotesList.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("scrappacnote");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.VerifiedPackingNotesList.forEach((type) => {
            if (type.scp_load && type.scp_load) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.scp_load; // Backend keeps saleorder_id
                option.textContent = type.scp_load; // Display saleorder_typename
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
        fetchShipping(selectedFactoryId);
        
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchShipping() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listshipmentdeliverynew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
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
        const selectElement = document.getElementById("shipmode");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select shipment mode</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.shipment_mode && type.shipment_mode) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.shipment_mode; // Backend keeps saleorder_id
                option.textContent = type.shipment_mode; // Display saleorder_typename
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
        fetchShippingUp(selectedFactoryId);
        
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});


async function fetchShippingUp() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listshipmentdeliverynew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
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
        const selectElement = document.getElementById("shipmodeup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select shipment mode</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.shipment_mode && type.shipment_mode) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.shipment_mode; // Backend keeps saleorder_id
                option.textContent = type.shipment_mode; // Display saleorder_typename
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
        fetchdelivery(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchdelivery() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listshipmentdeliverynew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
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
        const selectElement = document.getElementById("delivery");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select delivery condition</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.delivery_condition && type.delivery_condition) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.delivery_condition; // Backend keeps saleorder_id
                option.textContent = type.delivery_condition; // Display saleorder_typename
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
        fetchdeliveryup(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchdeliveryup() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listshipmentdeliverynew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
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
        const selectElement = document.getElementById("deliveryup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select delivery condition</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.delivery_condition && type.delivery_condition) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.delivery_condition; // Backend keeps saleorder_id
                option.textContent = type.delivery_condition; // Display saleorder_typename
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
        fetchservice(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchservice() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
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
        const selectElement = document.getElementById("service");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select service code</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.servicecode_id && type.service_code) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.servicecode_id; // Backend keeps saleorder_id
                option.textContent = type.service_code; // Display saleorder_typename
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
        fetchserviceup(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchserviceup() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
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
        const selectElement = document.getElementById("serviceup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select service code</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.servicecode_id && type.service_code) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.servicecode_id; // Backend keeps saleorder_id
                option.textContent = type.service_code; // Display saleorder_typename
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
        fetchWork(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchWork() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listworkordermasternew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
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
        const selectElement = document.getElementById("workor");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select work order</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.work_id && type.workorder_no) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.work_id; // Backend keeps saleorder_id
                option.textContent = type.workorder_no; // Display saleorder_typename
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
        fetchhsn(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchhsn() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
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
        const selectElement = document.getElementById("hsncode");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select hsn code</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.servicecode_id && type.service_code) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.servicecode_id; // Backend keeps saleorder_id
                option.textContent = type.service_code; // Display saleorder_typename
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
        fetchhsnup(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchhsnup() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
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
        const selectElement = document.getElementById("hsncodeup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select hsn code</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.servicecode_id && type.service_code) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.servicecode_id; // Backend keeps saleorder_id
                option.textContent = type.service_code; // Display saleorder_typename
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
        fetchinvoice(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchinvoice() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.INVOICE_TYPE_LIST.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("invoicety");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select invoice type</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.INVOICE_TYPE_LIST.forEach((type) => {
            if (type.slno && type.remarks_type) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.slno; // Backend keeps saleorder_id
                option.textContent = type.remarks_type; // Display saleorder_typename
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
        fetchinvoiceup(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchinvoiceup(factoryId) {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
     
        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.INVOICE_TYPE_LIST.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("invoicetyup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select invoice type</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.INVOICE_TYPE_LIST.forEach((type) => {
            if (type.slno && type.remarks_type) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.slno; // Backend keeps saleorder_id
                option.textContent = type.remarks_type; // Display saleorder_typename
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
        fetchbank(selectedFactoryId);
        fetchbankup(selectedFactoryId);
        fetchtax1();
        fetchtax2();
        fetchtax3();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchbank() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/bank/listbankaccount`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
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
        const selectElement = document.getElementById("bakname");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select bank name</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.account_id && type.bank_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.account_id; // Backend keeps saleorder_id
                option.textContent = type.bank_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchbankup() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/bank/listbankaccount`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
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
        const selectElement = document.getElementById("baknameup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select bank name</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.account_id && type.bank_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.account_id; // Backend keeps saleorder_id
                option.textContent = type.bank_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchtax1() {
    try {
        const url = new URL(`/jssl/taxmasters/list`, baseUrl);
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch tax data");

        const json = await response.json();
        if (json.status !== "yes" || !json.Data?.length) {
            console.warn("No tax data found.");
            return;
        }

        const selectElement = document.getElementById("intax1name");
        selectElement.innerHTML = `<option value="">Select tax</option>`;

        // Create a map to store tax_per values for later use
        const taxMap = {};

        json.Data.forEach(({ tax_id, tax_desc, tax_per }) => {
            if (tax_id && tax_desc) {
                taxMap[tax_id] = tax_per;
                const option = document.createElement("option");
                option.value = tax_id;
                option.textContent = tax_desc;
                selectElement.appendChild(option);
            }
        });

        // Event listener to populate #intax1 with the selected tax's percentage
        selectElement.addEventListener("change", () => {
            const selectedTaxId = selectElement.value;
            const taxInput = document.getElementById("intax1");
            taxInput.value = selectedTaxId ? taxMap[selectedTaxId] || "" : "";
            calculateTaxValue();
            updateTotalTax();
        });

    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

async function fetchtax2() {
    try {
        const url = new URL(`/jssl/taxmasters/list`, baseUrl);
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch tax data");

        const json = await response.json();
        if (json.status !== "yes" || !json.Data?.length) {
            console.warn("No tax data found.");
            return;
        }

        const selectElement = document.getElementById("intax2name");
        selectElement.innerHTML = `<option value="">Select tax</option>`;

        // Create a map to store tax_per values for later use
        const taxMap = {};

        json.Data.forEach(({ tax_id, tax_desc, tax_per }) => {
            if (tax_id && tax_desc) {
                taxMap[tax_id] = tax_per;
                const option = document.createElement("option");
                option.value = tax_id;
                option.textContent = tax_desc;
                selectElement.appendChild(option);
            }
        });

        // Event listener to populate #intax1 with the selected tax's percentage
        selectElement.addEventListener("change", () => {
            const selectedTaxId = selectElement.value;
            const taxInput = document.getElementById("intax2");
            taxInput.value = selectedTaxId ? taxMap[selectedTaxId] || "" : "";
            calculateTaxValue();
            updateTotalTax();
        });

    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

async function fetchtax3() {
    try {
        const url = new URL(`/jssl/taxmasters/list`, baseUrl);
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch tax data");

        const json = await response.json();
        if (json.status !== "yes" || !json.Data?.length) {
            console.warn("No tax data found.");
            return;
        }

        const selectElement = document.getElementById("intax3name");
        selectElement.innerHTML = `<option value="">Select tax</option>`;

        // Create a map to store tax_per values for later use
        const taxMap = {};

        json.Data.forEach(({ tax_id, tax_desc, tax_per }) => {
            if (tax_id && tax_desc) {
                taxMap[tax_id] = tax_per;
                const option = document.createElement("option");
                option.value = tax_id;
                option.textContent = tax_desc;
                selectElement.appendChild(option);
            }
        });

        // Event listener to populate #intax1 with the selected tax's percentage
        selectElement.addEventListener("change", () => {
            const selectedTaxId = selectElement.value;
            const taxInput = document.getElementById("intax3");
            taxInput.value = selectedTaxId ? taxMap[selectedTaxId] || "" : "";
            calculateTaxValue();
            updateTotalTax();
        });

    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

// Function to calculate and update the tax value
function calculateTaxValue() {
    const taxPercent = parseFloat(document.getElementById("intax1").value) || 0;
    const tax2Percent = parseFloat(document.getElementById("intax2").value) || 0;
    const tax3Percent = parseFloat(document.getElementById("intax3").value) || 0;
    const total = parseFloat(document.getElementById("intotal").value) || 0;
    const calculatedValue = ((taxPercent / 100) * total).toFixed(2);
    const calculatedValue2 = ((tax2Percent / 100) * total).toFixed(2);
    const calculatedValue3 = ((tax3Percent / 100) * total).toFixed(2);
    document.getElementById("intavalue1").value = calculatedValue;
    document.getElementById("intavalue2").value = calculatedValue2;
    document.getElementById("intavalue3").value = calculatedValue3;
}

// Add event listener to recalculate the tax value whenever the total changes
document.getElementById("intotal").addEventListener("input", calculateTaxValue);

function updateTotalTax() {
    const tax1 = parseFloat(document.getElementById("intavalue1").value) || 0;
    const tax2 = parseFloat(document.getElementById("intavalue2").value) || 0;
    const tax3 = parseFloat(document.getElementById("intavalue3").value) || 0;
    const totalTax = tax1 + tax2 + tax3;

    document.getElementById("ingrand").value = totalTax.toFixed(2); // Show result with 2 decimal places
}

document.addEventListener("DOMContentLoaded", function () {
    const scrapSaleOrderSelect = document.getElementById("scrappacnote");
    const inputFieldsContainer = document.getElementById("inputFieldsContainer");

    // Event listener to show additional fields when a scrapSaleOrder is selected
    scrapSaleOrderSelect.addEventListener("change", function () {
        const saleOrderCode = scrapSaleOrderSelect.value;

        if (saleOrderCode) {
            inputFieldsContainer.style.display = "block"; // Show the container
            fetchSaleOrderDetails(saleOrderCode); // Fetch and populate details based on selected sale order
        } else {
            inputFieldsContainer.style.display = "none"; // Hide the container
        }
    });
});

async function fetchSaleOrderDetails(saleOrderCode) {
    try {
        const url = new URL(`/jssl/saleOrderPackingNote/verifiedScrapPackingNoteForInvoice`, baseUrl);
        url.searchParams.append("scp_load", saleOrderCode);

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error(`Failed to fetch sale order details: ${response.status}`);

        const json = await response.json();

        /*if (!json.PackingNoteItemDetails?.length || !json.PackingNoteDetails) {
            console.warn("No order level details found.");
            return;
        }*/

        // Populate item details
        const item = json.PackingNoteItemDetails[0];
        document.getElementById("Inuom").value = item.unit_name ?? ''; 
        document.getElementById("inqty").value = item.quantity ?? '';
        document.getElementById("inkg").value = item.kg ?? '';
        document.getElementById("inunpr").value = item.unit_price ?? '';
        document.getElementById("ininvoicetype").value = item.scrapitemname ?? '';
        document.getElementById("typeid").value = item.scrap_type_id ?? '';
        document.getElementById("intotal").value = item.total ?? '';

        // Populate order details (direct object access)
        const order = json.PackingNoteDetails;
        document.getElementById("intax1").value = order.tax1 ?? ''; 
        document.getElementById("intavalue1").value = order.tax1_value ?? ''; 
        document.getElementById("intax2").value = order.tax2 ?? '';
        document.getElementById("intavalue2").value = order.tax2_value ?? '';
        document.getElementById("intax3").value = order.tax3 ?? '';
        document.getElementById("intavalue3").value = order.tax3_value ?? '';
        document.getElementById("ingrand").value = order.grand_total ?? '';
        document.getElementById("inbusunit").value = order.business_unit_name ?? '';
        document.getElementById("ininto").value = order.vendor_name ?? '';
        document.getElementById("billing").value = order.billing_address ?? '';
        document.getElementById("intax1name").value = order.tax1_name ?? '';
        document.getElementById("intax2name").value = order.tax2_name ?? '';
        document.getElementById("intax3name").value = order.tax3_name ?? '';
        document.getElementById("scpn").value = order.scp_pn_id ?? '';
        document.getElementById("scpid").value = order.sale_order_code ?? '';
        document.getElementById("work").value = order.sale_order_code ?? '';

    } catch (error) {
        console.error("Error fetching sale order details:", error);
    }
}

function openModalAdd() {
    //var username = document.getElementById('service').value.trim();
    //var password = document.getElementById('hsncode').value.trim();
    var code = document.getElementById('invoicety').value.trim();
    var state = document.getElementById('prodes').value.trim();
    var state1 = document.getElementById('remark').value.trim();
    var ship = document.getElementById('shipmode').value.trim();
    var bank = document.getElementById('bakname').value.trim();
    var del = document.getElementById('delivery').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    /*if (username === '') {
        document.getElementById('productCodeError').innerText = "Please select service code.";
        document.getElementById('productCodeError').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError').innerText = "";
        document.getElementById('productCodeError').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeError1').innerText = "Please select hsn code.";
        document.getElementById('productCodeError1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError1').innerText = "";
        document.getElementById('productCodeError1').style.display = "none";
    }*/
    
    if (code === '') {
        document.getElementById('productCodeError2').innerText = "Please select invoive type .";
        document.getElementById('productCodeError2').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError2').innerText = "";
        document.getElementById('productCodeError2').style.display = "none";
    }
    
    if (state === '') {
        document.getElementById('productCodeError3').innerText = "Please enter product description.";
        document.getElementById('productCodeError3').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError3').innerText = "";
        document.getElementById('productCodeError3').style.display = "none";
    }
    
    if (state1 === '') {
        document.getElementById('productCodeError4').innerText = "Please enter remarks.";
        document.getElementById('productCodeError4').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError4').innerText = "";
        document.getElementById('productCodeError4').style.display = "none";
    }
    if (ship === '') {
        document.getElementById('productCodeError5').innerText = "Please select shipment mode.";
        document.getElementById('productCodeError5').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError5').innerText = "";
        document.getElementById('productCodeError5').style.display = "none";
    }
    if (bank === '') {
        document.getElementById('productCodeError7').innerText = "Please select bank name.";
        document.getElementById('productCodeError7').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError7').innerText = "";
        document.getElementById('productCodeError7').style.display = "none";
    }
    
    if (del === '') {
        document.getElementById('productCodeError8').innerText = "Please select delivery condition.";
        document.getElementById('productCodeError8').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError8').innerText = "";
        document.getElementById('productCodeError8').style.display = "none";
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
	  url: new URL('/jssl/scrapInvoice/addScrapInvoice', baseUrl),
	  type: 'POST',
	  dataType: 'json',
	  xhrFields: { withCredentials: true },
	  traditional: true, // <-- IMPORTANT for list parameters
	  data: {
	    load_id: scpid.value,
	    invoice_type: invoicety.value,
	    scp_pnitems_id: [scpn.value],     // wrap in array
	    scp_load: scrappacnote.value,
	    product_desc: prodes.value,
	    remarks: remark.value,
	    contract_id: "Scrap",
	    created_by: createdById,
	    service_code_id: [service.value], // wrap in array
	    hsn_code_id: [hsncode.value],     // wrap in array
	    type_id: [invoicety.value],       // wrap in array
	    factory_id: selectedFactoryId,
	    tax1_ptd: intavalue1.value,
	    tax1_pbc: intavalue1.value,
	    tax2_ptd: intavalue2.value,
	    tax2_pbc: intavalue2.value,
	    tax3_ptd: intavalue3.value,
	    tax3_pbc: intavalue3.value,
	    delivery_condition: delivery.value,
	    shipment_mode: shipmode.value,
	    bank_id: bakname.value
	  },
	  success: function (data) {
	    console.log("Response:", data);
	    if (data.message === "Success") {
			const popup = $('<div class="popup">Scrap Invoice Created Successfully!</div>')
						             .appendTo('body').hide().fadeIn(400);

						         setTimeout(function () {
						             popup.fadeOut(400, function () {
						                 $(this).remove();
						                 window.location = 'InvoiceSrap.jsp';
						             });
						         }, 800);
	   /*   alert("Scrap Invoice Created Successfully!");
	      window.location = 'InvoiceSrap.jsp';*/
	    } else {
	      alert("Failed: " + (data.message || 'Unknown error'));
	    }
	  },
	  error: function (xhr) {
	    console.error('Request failed:', xhr.responseText);
	  }
	});
}

function editRecord(id) {
	 // const allowed = window.allowedActions || [];

	if (!allowed.includes("Verify")) {
	  alert(" You do not have permission to Verify.");
	  return;
	}

	
	console.log(" verify record with ID:", id);
    const url = new URL(`/jssl/scrapinvoice/scrapInvoiceDetailsBsdOnId`, baseUrl);
    const params = [['scp_invoice_id', id]];
    url.search = new URLSearchParams(params).toString();

    // Show loading spinner or disable fields here, if needed

 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            console.log(JSON.stringify(response, null, 2)); // Pretty-print response for debugging

            if (response.status === 'yes') {
                // Check if PackingNoteItemDetails exists and has data
                if (response.ScrapInvoiceItemInfo) {
                    $('#pacV').val(response.ScrapInvoiceItemInfo.scp_load);
                    $('#Inuomv').val(response.ScrapInvoiceItemInfo.unit_name);
                    $('#inqtyv').val(response.ScrapInvoiceItemInfo.quantity);
                    $('#inkgv').val(response.ScrapInvoiceItemInfo.kg);
                    $('#inunprv').val(response.ScrapInvoiceItemInfo.unit_price);
                    $('#intotalv').val(response.ScrapInvoiceItemInfo.total);
                    $('#ininvoicetypev').val(response.ScrapInvoiceItemInfo.invoice_remarks_type);
                    $('#servicev').val(response.ScrapInvoiceItemInfo.servicecodename);
                    $('#hsncodev').val(response.ScrapInvoiceItemInfo.hsncodename);
                    $('#basicV').val(response.ScrapInvoiceItemInfo.total);
                    $('#pydpt').val(response.ScrapInvoiceItemInfo.total);
                    $('#pydcu').val(response.ScrapInvoiceItemInfo.total);
                    $('#workv').val(response.ScrapInvoiceItemInfo.sale_order_code);
                    
                } else {
                    console.warn('No PackingNoteItemDetails available:', response.PackingNoteItemDetails);
                }
                
                if (response.ScrapInvoiceInfo) {
                    $('#intaxV').val(response.ScrapInvoiceInfo.tax1_name);
                    $('#intaxV1').val(response.ScrapInvoiceInfo.tax2_name);
                    $('#intaxV12').val(response.ScrapInvoiceInfo.tax3_name);
                    $('#intaxVval').val(response.ScrapInvoiceInfo.tax1_value);
                    $('#intaxVval1').val(response.ScrapInvoiceInfo.tax2_value);
                    $('#intaxVval12').val(response.ScrapInvoiceInfo.tax3_value);
                    $('#ingrandv').val(response.ScrapInvoiceInfo.grand_total);
                    $('#byrefno').val(response.ScrapInvoiceInfo.buyer_ref_no);
                    $('#wbno').val(response.ScrapInvoiceInfo.weighbridge_no);
                    $('#trname').val(response.ScrapInvoiceInfo.transportername);
                    $('#inbusunitv').val(response.ScrapInvoiceInfo.business_unit_name);
                    $('#inintov').val(response.ScrapInvoiceInfo.address);
                    $('#intaxVin').val(response.ScrapInvoiceInfo.tax1_per);
                    $('#intaxVin1').val(response.ScrapInvoiceInfo.tax2_per);
                    $('#intaxVin12').val(response.ScrapInvoiceInfo.tax3_per);
                    $('#intaxpt').val(response.ScrapInvoiceInfo.tax1_ptd);
                    $('#intaxpt1').val(response.ScrapInvoiceInfo.tax2_ptd);
                    $('#intaxpt12').val(response.ScrapInvoiceInfo.tax3_ptd);
                    $('#intaxpb').val(response.ScrapInvoiceInfo.tax1_pbc);
                    $('#intaxpb1').val(response.ScrapInvoiceInfo.tax2_pbc);
                    $('#intaxpb12').val(response.ScrapInvoiceInfo.tax3_pbc);
                    $('#billingv').val(response.ScrapInvoiceInfo.billing_address);
                    $('#vehino').val(response.ScrapInvoiceInfo.vehicleno);
                    $('#prodesv').val(response.ScrapInvoiceInfo.product_desc);
                    $('#remarkv').val(response.ScrapInvoiceInfo.remarks);
                    $('#shipmodev').val(response.ScrapInvoiceInfo.shipment_mode);
                    $('#deliveryv').val(response.ScrapInvoiceInfo.delivery_condition);
                    $('#baknamev').val(response.ScrapInvoiceInfo.bank_name);
                    $('#inid123').val(response.ScrapInvoiceInfo.id);
                    
                } else {
                    console.warn('No PackingNoteItemDetails available:', response.PackingNoteItemDetails);
                }

                $('#exampleModalScrollableVV').modal('show');
            } else {
                // Hide modal if the status is not 'yes'
                $('#exampleModalScrollableVV').modal('hide');
                //alert('Failed to fetch data. Please try again.');
            }
        })
        .catch(error => {
            // Handle error and provide user feedback
            console.error('Error:', error);
            //alert('An error occurred while fetching data. Please try again.');
        });
}

function editRecord11(id) {
	//  const allowed = window.allowedActions || [];

	if (!allowed.includes("view")) {
	  alert(" You do not have permission to view.");
	    $("#exampleModalScrollableVV11").modal("hide");
	  return;
	}
    const url = new URL(`/jssl/scrapinvoice/scrapInvoiceDetailsBsdOnId`, baseUrl);
    const params = [['scp_invoice_id', id]];
    url.search = new URLSearchParams(params).toString();

    // Show loading spinner or disable fields here, if needed

 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            console.log(JSON.stringify(response, null, 2)); // Pretty-print response for debugging

            if (response.status === 'yes') {
                // Check if PackingNoteItemDetails exists and has data
                if (response.ScrapInvoiceItemInfo) {
                    $('#pacV11').val(response.ScrapInvoiceItemInfo.scp_load);
                    $('#Inuomv11').val(response.ScrapInvoiceItemInfo.unit_name);
                    $('#inqtyv11').val(response.ScrapInvoiceItemInfo.quantity);
                    $('#inkgv11').val(response.ScrapInvoiceItemInfo.kg);
                    $('#inunprv11').val(response.ScrapInvoiceItemInfo.unit_price);
                    $('#intotalv11').val(response.ScrapInvoiceItemInfo.total);
                    $('#ininvoicetypev11').val(response.ScrapInvoiceItemInfo.invoice_remarks_type);
                    $('#servicev11').val(response.ScrapInvoiceItemInfo.servicecodename);
                    $('#hsncodev11').val(response.ScrapInvoiceItemInfo.hsncodename);
                    $('#basicV11').val(response.ScrapInvoiceItemInfo.total);
                    $('#pydpt11').val(response.ScrapInvoiceItemInfo.total);
                    $('#pydcu11').val(response.ScrapInvoiceItemInfo.total);
                    $('#workv11').val(response.ScrapInvoiceItemInfo.sale_order_code);
                    
                    
                } else {
                    console.warn('No PackingNoteItemDetails available:', response.PackingNoteItemDetails);
                }
                
                if (response.ScrapInvoiceInfo) {
                    $('#intaxV11').val(response.ScrapInvoiceInfo.tax1_name);
                    $('#intaxV111').val(response.ScrapInvoiceInfo.tax2_name);
                    $('#intaxV1211').val(response.ScrapInvoiceInfo.tax3_name);
                    $('#intaxVval11').val(response.ScrapInvoiceInfo.tax1_value);
                    $('#intaxVval111').val(response.ScrapInvoiceInfo.tax2_value);
                    $('#intaxVval1211').val(response.ScrapInvoiceInfo.tax3_value);
                    $('#ingrandv11').val(response.ScrapInvoiceInfo.grand_total);
                    $('#byrefno11').val(response.ScrapInvoiceInfo.buyer_ref_no);
                    $('#wbno11').val(response.ScrapInvoiceInfo.weighbridge_no);
                    $('#trname11').val(response.ScrapInvoiceInfo.transportername);
                    $('#inbusunitv11').val(response.ScrapInvoiceInfo.business_unit_name);
                    $('#inintov11').val(response.ScrapInvoiceInfo.address);
                    $('#intaxVin11').val(response.ScrapInvoiceInfo.tax1_per);
                    $('#intaxVin111').val(response.ScrapInvoiceInfo.tax2_per);
                    $('#intaxVin1211').val(response.ScrapInvoiceInfo.tax3_per);
                    $('#intaxpt11').val(response.ScrapInvoiceInfo.tax1_ptd);
                    $('#intaxpt111').val(response.ScrapInvoiceInfo.tax2_ptd);
                    $('#intaxpt1211').val(response.ScrapInvoiceInfo.tax3_ptd);
                    $('#intaxpb11').val(response.ScrapInvoiceInfo.tax1_pbc);
                    $('#intaxpb111').val(response.ScrapInvoiceInfo.tax2_pbc);
                    $('#intaxpb1211').val(response.ScrapInvoiceInfo.tax3_pbc);
                    $('#billingv11').val(response.ScrapInvoiceInfo.billing_address);
                    $('#vehino11').val(response.ScrapInvoiceInfo.vehicleno);
                    $('#prodesv11').val(response.ScrapInvoiceInfo.product_desc);
                    $('#remarkv11').val(response.ScrapInvoiceInfo.remarks);
                    $('#shipmodev11').val(response.ScrapInvoiceInfo.shipment_mode);
                    $('#deliveryv11').val(response.ScrapInvoiceInfo.delivery_condition);
                    $('#baknamev11').val(response.ScrapInvoiceInfo.bank_name);
                    $('#inid12311').val(response.ScrapInvoiceInfo.id);
                    $('#remagst11').val(response.ScrapInvoiceInfo.gst_remarks);
                    
                } else {
                    console.warn('No PackingNoteItemDetails available:', response.PackingNoteItemDetails);
                }

                $('#exampleModalScrollableVV11').modal('show');
            } else {
                // Hide modal if the status is not 'yes'
                $('#exampleModalScrollableVV11').modal('hide');
                //alert('Failed to fetch data. Please try again.');
            }
        })
        .catch(error => {
            // Handle error and provide user feedback
            console.error('Error:', error);
            //alert('An error occurred while fetching data. Please try again.');
        });
}

function editRecordInvoice(id) {
			//  const allowed = window.allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/scrapinvoice/scrapInvoiceDetailsBsdOnId`, baseUrl);
    const params = [['scp_invoice_id', id]];
    url.search = new URLSearchParams(params).toString();

    // Show loading spinner or disable fields here, if needed

 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            console.log(JSON.stringify(response, null, 2)); // Pretty-print response for debugging

            if (response.status === 'yes') {
                // Check if PackingNoteItemDetails exists and has data
                if (response.ScrapInvoiceItemInfo) {
                    $('#packup').val(response.ScrapInvoiceItemInfo.scp_load);
                    $('#Inuomup').val(response.ScrapInvoiceItemInfo.unit_name);
                    $('#inqtyup').val(response.ScrapInvoiceItemInfo.quantity);
                    $('#inkgup').val(response.ScrapInvoiceItemInfo.kg);
                    $('#inunprup').val(response.ScrapInvoiceItemInfo.unit_price);
                    $('#intotalup').val(response.ScrapInvoiceItemInfo.total);
                    $('#ininvoicetypeup').val(response.ScrapInvoiceItemInfo.invoice_remarks_type);
                    $('#serviceup').val(response.ScrapInvoiceItemInfo.service_code);
                    $('#hsncodeup').val(response.ScrapInvoiceItemInfo.hsn_code);
                    $('#invoicetyup').val(response.ScrapInvoiceItemInfo.type_id);
                    $('#workup').val(response.ScrapInvoiceItemInfo.sale_order_code);
                    $('#itemidupdate').val(response.ScrapInvoiceItemInfo.scp_pnitems_id);
                    } else {
                    console.warn('No PackingNoteItemDetails available:', response.PackingNoteItemDetails);
                }
                
                if (response.ScrapInvoiceInfo) {
                    $('#intax1nameup').val(response.ScrapInvoiceInfo.tax1_name);
                    $('#intax2nameup').val(response.ScrapInvoiceInfo.tax2_name);
                    $('#intax3nameup').val(response.ScrapInvoiceInfo.tax3_name);
                    $('#intavalue1up').val(response.ScrapInvoiceInfo.tax1_value);
                    $('#intavalue2up').val(response.ScrapInvoiceInfo.tax2_value);
                    $('#intavalue3up').val(response.ScrapInvoiceInfo.tax3_value);
                    $('#ingrandup').val(response.ScrapInvoiceInfo.grand_total);
                    $('#inbusunitup').val(response.ScrapInvoiceInfo.business_unit_name);
                    $('#inintoup').val(response.ScrapInvoiceInfo.address);
                    $('#intax1up').val(response.ScrapInvoiceInfo.tax1_per);
                    $('#intax2up').val(response.ScrapInvoiceInfo.tax2_per);
                    $('#intax3up').val(response.ScrapInvoiceInfo.tax3_per);
                    $('#billingup').val(response.ScrapInvoiceInfo.billing_address);
                    $('#prodesup').val(response.ScrapInvoiceInfo.product_desc);
                    $('#remarkup').val(response.ScrapInvoiceInfo.remarks);
                    $('#shipmodeup').val(response.ScrapInvoiceInfo.shipment_mode);
                    $('#deliveryup').val(response.ScrapInvoiceInfo.delivery_condition);
                    $('#baknameup').val(response.ScrapInvoiceInfo.bank_id);
                    $('#idupdate').val(response.ScrapInvoiceInfo.id);
                    
                } else {
                    console.warn('No PackingNoteItemDetails available:', response.PackingNoteItemDetails);
                }

                $('#exampleModalScrollableUpdate').modal('show');
            } else {
                // Hide modal if the status is not 'yes'
                $('#exampleModalScrollableUpdate').modal('hide');
                //alert('Failed to fetch data. Please try again.');
            }
        })
        .catch(error => {
            // Handle error and provide user feedback
            console.error('Error:', error);
            //alert('An error occurred while fetching data. Please try again.');
        });
}

function openModalVerify() {
    var username = document.getElementById('remagst').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeError96111').innerText = "Please enter remarks.";
        document.getElementById('productCodeError96111').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError96111').innerText = "";
        document.getElementById('productCodeError96111').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66VV').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addeventVV() {
	$('#exampleModalCenter66VV').modal('hide');
	 $.ajax({
        url: new URL('/jssl/scrapinvoice/verificationnew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({verified_by:createdById,
        id:inid123.value,
        load_id:workv.value,
        gst_remarks:remagst.value
        }),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Scrap Invoice Verified Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'InvoiceSrap.jsp'; // Redirect to role list page
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

function openModalUpdate() {
    //var username = document.getElementById('serviceup').value.trim();
    //var hsncodeup = document.getElementById('hsncodeup').value.trim();
    var invoicetyup = document.getElementById('invoicetyup').value.trim();
    var shipmodeup = document.getElementById('shipmodeup').value.trim();
    var deliveryup = document.getElementById('deliveryup').value.trim();
    var baknameup = document.getElementById('baknameup').value.trim();
    var prodesup = document.getElementById('prodesup').value.trim();
    var remarkup = document.getElementById('remarkup').value.trim();
        
    var showError = false; // Initialize showError variable

    // Username Validation
    /*if (username === '') {
        document.getElementById('productCodeErrorup').innerText = "Please select service code.";
        document.getElementById('productCodeErrorup').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorup').innerText = "";
        document.getElementById('productCodeErrorup').style.display = "none";
    }
    
    if (hsncodeup === '') {
        document.getElementById('productCodeError1up').innerText = "Please select hsn code.";
        document.getElementById('productCodeError1up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError1up').innerText = "";
        document.getElementById('productCodeError1up').style.display = "none";
    }*/
    
    if (invoicetyup === '') {
        document.getElementById('productCodeError2up').innerText = "Please select invoive type.";
        document.getElementById('productCodeError2up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError2up').innerText = "";
        document.getElementById('productCodeError2up').style.display = "none";
    }
    
    if (shipmodeup === '') {
        document.getElementById('productCodeError5up').innerText = "Please select shipment mode.";
        document.getElementById('productCodeError5up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError5up').innerText = "";
        document.getElementById('productCodeError5up').style.display = "none";
    }
    
    if (deliveryup === '') {
        document.getElementById('productCodeError8up').innerText = "Please select delivery condition.";
        document.getElementById('productCodeError8up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError8up').innerText = "";
        document.getElementById('productCodeError8up').style.display = "none";
    }
    
    if (baknameup === '') {
        document.getElementById('productCodeError7up').innerText = "Please select bank name.";
        document.getElementById('productCodeError7up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError7up').innerText = "";
        document.getElementById('productCodeError7up').style.display = "none";
    }
    
    if (prodesup === '') {
        document.getElementById('productCodeError3up').innerText = "Please enter product description.";
        document.getElementById('productCodeError3up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError3up').innerText = "";
        document.getElementById('productCodeError3up').style.display = "none";
    }
    
    if (remarkup === '') {
        document.getElementById('productCodeError4up').innerText = "Please enter remarks.";
        document.getElementById('productCodeError4up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError4up').innerText = "";
        document.getElementById('productCodeError4up').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66VVupdate').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addeventupdate() {
	$('#exampleModalCenter66VVupdate').modal('hide');
	 $.ajax({
        url: new URL('/jssl/scrapInvoice/updateScrapInvoiceNew', baseUrl), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({modified_by:createdById,
        id:inid123.value,
        invoice_type:invoicetyup.value,
        shipment_mode:shipmodeup.value,
        delivery_condition:deliveryup.value,
        bank_id:baknameup.value,
        product_desc:prodesup.value,
        remarks:remarkup.value,
        scp_invoice_id:idupdate.value,
        service_code:serviceup.value,
        hsn_code:hsncodeup.value,
        scp_pnitems_id:itemidupdate.value
        }),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Success") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Scrap Invoice Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'InvoiceSrap.jsp'; // Redirect to role list page
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

async function printRecord(id) {

    if (!allowed.includes("Print")) {
        alert("You do not have permission to print.");
        console.warn("Blocked print attempt. User lacks Print permission.");
        return;
    }

    showLoader();
    console.log("Printing scrap record with ID:", id);

    // ─── HELPER: Format numbers with Indian comma style ───────────────────────
    function formatAmount(value) {
        if (!value && value !== 0) return '';
        const num = parseFloat(String(value).replace(/,/g, ''));
        if (isNaN(num)) return value;
        return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    try {
        // ── Fetch Scrap Invoice Data ──────────────────────────────────────────
        const url = new URL(`/jssl/scrapinvoice/scrapInvoiceDetailsBsdOnId?scp_invoice_id=${id}`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch scrap invoice data");

        const json = await response.json();

        const scrapInvoiceItemInfo = json.ScrapInvoiceItemInfo;
        const ScrapInvoiceInfo     = json.ScrapInvoiceInfo;

        // ── Scrap Invoice Fields ──────────────────────────────────────────────
        const invoiceno          = ScrapInvoiceInfo.invoice_no;
        const contref            = ScrapInvoiceInfo.contract_no;
        const transportername    = ScrapInvoiceInfo.transportername;
        const saleOrderCode      = scrapInvoiceItemInfo.sale_order_code;
        const scrapitemname      = scrapInvoiceItemInfo.scrapitemname;
        const hsn_code           = scrapInvoiceItemInfo.hsncodename   ?? '';
        const service_code       = scrapInvoiceItemInfo.servicecodename ?? '';
        const Service_Code       = `${service_code} \\ ${hsn_code}`;
        const unit_name          = scrapInvoiceItemInfo.unit_name;
        const quantity           = scrapInvoiceItemInfo.quantity;
        const kg                 = scrapInvoiceItemInfo.kg;
        const unit_price         = scrapInvoiceItemInfo.unit_price;
        const total              = scrapInvoiceItemInfo.total;
        const vehicleno          = ScrapInvoiceInfo.vehicleno;
        const shipment_mode      = ScrapInvoiceInfo.shipment_mode;
        const delivery_condition = ScrapInvoiceInfo.delivery_condition;

        // ── Shipping / Invoice To ─────────────────────────────────────────────
        const shipping_address    = ScrapInvoiceInfo.shipping_address;
        const shipping_state_name = ScrapInvoiceInfo.shipping_state_name;
        const shipping_state_code = ScrapInvoiceInfo.shipping_state_code;
        const shipping_gst        = ScrapInvoiceInfo.shippingtogst;
        const shipping_pan        = ScrapInvoiceInfo.shippingPanNo;

        // ── Consignee / Billing ───────────────────────────────────────────────
        const billing_address    = ScrapInvoiceInfo.billing_address;
        const billing_state_name = ScrapInvoiceInfo.billing_state_name;
        const billing_state_code = ScrapInvoiceInfo.billing_state_code;
        const invoice_gst        = ScrapInvoiceInfo.gstNo;
        const inovoice_pan       = ScrapInvoiceInfo.panNo;

        // ── Tax Data ──────────────────────────────────────────────────────────
        const tax1_per    = ScrapInvoiceInfo.tax1_per;
        const tax2_per    = ScrapInvoiceInfo.tax2_per;
        const tax3_per    = ScrapInvoiceInfo.tax3_per;
        const tax1_name   = ScrapInvoiceInfo.tax1_name;
        const tax2_name   = ScrapInvoiceInfo.tax2_name;
        const tax3_name   = ScrapInvoiceInfo.tax3_name;
        const tax1_value  = ScrapInvoiceInfo.tax1_value;
        const tax2_value  = ScrapInvoiceInfo.tax2_value;
        const tax3_value  = ScrapInvoiceInfo.tax3_value;
        const grand_total = ScrapInvoiceInfo.grand_total;
        const total_tax   = ScrapInvoiceInfo.total_tax;
        const gst_remarks = ScrapInvoiceInfo.gst_remarks;
        const tax1_words  = ScrapInvoiceInfo.tax1_words;
        const tax2_words  = ScrapInvoiceInfo.tax2_words;
        const tax3_words  = ScrapInvoiceInfo.tax3_words;
        const grand_total_words = ScrapInvoiceInfo.grand_total_words;

        // ── Bank Details ──────────────────────────────────────────────────────
        const account_name   = ScrapInvoiceInfo.account_name;
        const account_number = ScrapInvoiceInfo.account_number;
        const branch_address = ScrapInvoiceInfo.branch_address;
        const branch_code    = ScrapInvoiceInfo.branch_code;
        const swift_code     = ScrapInvoiceInfo.swift_code;
        const ifsc_code      = ScrapInvoiceInfo.ifsc_code;
        const bank_name      = ScrapInvoiceInfo.bank_name;

        // ── Misc ──────────────────────────────────────────────────────────────
        const cancel      = ScrapInvoiceInfo.cancel;
        const productdesc = ScrapInvoiceInfo.product_desc;

        console.log("Scrap invoice no:", invoiceno);

        // ── Factory Data ──────────────────────────────────────────────────────
        const url_factory = new URL(`/jssl/factory/getAllFactoryListSS`, baseUrl);
        const response_factory = await fetch(url_factory, { method: "GET", credentials: "include" });
        if (!response_factory.ok) throw new Error("Failed to fetch factory data");
        const factory_json = await response_factory.json();

        const factory_data_map = factory_json.FactoryDetails;
        const MumbaiAddress    = factory_data_map.find(f => f.id === "4");

        const reg_addresss = MumbaiAddress.address;

        /* ================= BUSINESS UNIT DETAILS =================
           Bound dynamically straight from ScrapInvoiceInfo (the
           BUSINESS_UNITS join in the query: bu.business_unit_name,
           bu.gst_number, bu.pan_number, bu.location, bu.state_id AS
           bu_state_code). Nothing here is hardcoded per business unit.
        */

        const bu_business_unit_name = ScrapInvoiceInfo.business_unit_name || "";
        const bu_gst_number         = ScrapInvoiceInfo.gst_number || "";
        const bu_pan_number         = ScrapInvoiceInfo.pan_number || "";
        const bu_location           = ScrapInvoiceInfo.location || "";
        const bu_state_code         = ScrapInvoiceInfo.bu_state_code || "";

        // Strip any leading "JBU-<number>" style prefix (e.g. "JBU-4 ") — not needed on print
        const cleanBusinessUnitName = bu_business_unit_name
            .replace(/^JBU-?\s*\d+\s*/i, "")
            .trim();

        const factory_Address = bu_location;
        const state_Code      = bu_state_code;
        const Gst_Code        = bu_gst_number;
        const Pan_Code        = bu_pan_number;

        // ── Date Formatting ───────────────────────────────────────────────────
        const currentDate = new Date().toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).replace(/\//g, '-');

        const currentDate1 = new Date();
        const formattedDateTime =
            String(currentDate1.getDate()).padStart(2, '0') + '-' +
            String(currentDate1.getMonth() + 1).padStart(2, '0') + '-' +
            currentDate1.getFullYear() + ' ' +
            String(currentDate1.getHours()).padStart(2, '0') + ':' +
            String(currentDate1.getMinutes()).padStart(2, '0') + ':' +
            String(currentDate1.getSeconds()).padStart(2, '0');

        // ── HTML Template ─────────────────────────────────────────────────────
        const htmlContent = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

                * { box-sizing: border-box; }

                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 120px;
                    font-weight: bold;
                    opacity: 0.15;
                    pointer-events: none;
                    z-index: 9999;
                    white-space: nowrap;
                    letter-spacing: 10px;
                }
                .watermark.cancelled { color: #ff0000; }

                .page { position: relative; }

                html, body {
                    margin: 0;
                    padding: 0;
                    font-family: "Times New Roman", Times, serif;
                    background-color: #fff !important;
                    font-size: 10px;
                    line-height: 2;
                }

                .page {
                    width: 202mm;
                    height: 297mm;
                    overflow: visible;
                    page-break-after: avoid !important;
                    margin: 0;
                    padding: 0;
                }
                .page:last-child { page-break-after: avoid !important; }

                .invoice-container {
                    width: 100%;
                    height: auto;
                    overflow: visible;
                    -webkit-font-smoothing: antialiased;
                    text-rendering: geometricPrecision;
                    page-break-inside: avoid;
                    margin: 0;
                    padding: 1mm;
                }

                table {
                    border-collapse: collapse !important;
                    table-layout: fixed;
                    page-break-inside: avoid;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                }

                td, th {
                    border-right: 0.5px solid #000;
                    border-bottom: 0.5px solid #000;
                    padding: 2px 4px;
                    vertical-align: top;
                    font-size: 10px;
                    line-height: 1.05;
                    word-wrap: break-word;
                }

                tr { page-break-inside: avoid; }
                tr:first-child th { border-top: 0.5px solid #000; }

                td:first-child,
                th:first-child { border-left: 0.5px solid #000; }

                .company-details-table { border-top: 0.5px solid #000 !important; }

                .header, .footer { text-align: center; margin: 0; padding: 0; }

                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2mm;
                }

                .gst-text {
                    font-size: 15px;
                    font-weight: 500;
                    text-align: center;
                    margin-left: 140px;
                }

                .copy-label { font-size: 12px; font-weight: normal; }

                td br, th br { display: block; margin: 0; line-height: 1; }

                .company-details-table td { padding: 4px; font-size: 11px !important; }

                .company-logo img { width: 60px; height: auto; display: block; margin-bottom: 2px; }

                .product-row td,
                .empty-row td { height: 22px; }

                .empty-row td { border-top: none !important; border-bottom: none !important; }

                .last-product td { border-bottom: none !important; }

                .product-table .desc-col {
                    line-height: 1.5 !important;
                    white-space: normal;
                    word-break: break-word;
                }

                .product-table th,
                .product-table td { padding: 3px 5px; line-height: 1.2; }

                .product-row td { border-bottom: none; }

                .desc-col.descri { font-size: 7px !important; padding: 1px !important; }
                .desc-col.tols   { text-align: right !important; }
                .desc-col.prs    { text-align: right !important; }
                .desc-col.weits  { text-align: right !important; }
                .desc-col.qtys   { text-align: right !important; }

                .total-body { border-top: 1px solid #000; }
                .total-body .total-datatd  { line-height: 1.6 !important; padding: 5px !important; }
                .total-body .total-datatds { line-height: 2.3 !important; text-align: right !important; }

                .tax-row .tax-name {
                    line-height: 0.8 !important;
                    text-align: right !important;
                    padding: 5px !important;
                }
                .tax-row .tax-per { text-align: right !important; vertical-align: middle !important; }

                .total-word .total-words-des {
                    line-height: 1.2 !important;
                    font-size: 8px !important;
                    padding: 0 0 5px 5px !important;
                }
                .total-words-des.ss { vertical-align: middle !important; }
                .total-word .total-words-val { text-align: right !important; vertical-align: middle !important; }

                .particulars-row { line-height: 1 !important; }
                .particulars-row td { padding-top: 5px !important; }
                .particulars-row .particulars-row-prtd { font-size: 8px !important; }

                .particulars-row-body { padding-top: 5px !important; }
                .particulars-row-body .particulars-row-body-td {
                    text-align: right !important;
                    font-size: 8px !important;
                }

                .td-body-tax { text-align: right !important; line-height: 2 !important; }

                .Bank_details { line-height: 1.8 !important; font-size: 8px !important; }

                .last-data td {
                    line-height: 1.5 !important;
                    font-size: 9px !important;
                    padding-top: 6px !important;
                }
                .last-data td:last-child { text-align: center !important; vertical-align: middle !important; }
                .last-data td:last-child span { display: block; text-align: center; }

                .footer { padding-top: 6px !important; }
                .footer p { font-size: 9px; line-height: 1.2; margin: 0; padding: 0; }

                .invoice-line { display: flex; justify-content: space-between; width: 80%; }

                .fixed-8px td { font-size: 8px !important; line-height: 1.1 !important; }

                .facotry_address {
                    white-space: pre-line;
                    display: inline-block;
                    line-height: 1.5;
                }

                b      { font-weight: 550 !important; }
                strong { font-weight: 550 !important; }
            </style>

            <div class="invoice-container">
                ${cancel === 'true' ? `<div class="watermark cancelled">CANCELLED</div>` : ''}

                <div class="invoice-header">
                    <b>   </b>
                    <div class="gst-text">GST TAX INVOICE</div>
                    <div class="gst-text1 copy-label">Original For Recipient</div>
                </div>

                <table class="company-details-table">
                    <tr>
                        <td colspan="6">
                            <div class="company-logo">
                                <img src="img/logo/download.png" alt="Company Logo" style="width:100px;">
                            </div>
                            <strong><span class="companyname"></span></strong><br>
                            <span class="facotry_address"></span>
                            <p>
                            <b>State Code:</b> <span class="state_code"></span><br>
                            <b>GSTIN:</b> <span class="gst_code"></span> &nbsp;
                            <b>PAN:</b> <span class="pan_code"></span><br>
                            <b>ICE No:</b> 0309033152 &nbsp; <b>CIN No:</b> U28112MH2009PLC191045<br>
                            <b>Email:</b> invoice@jssl.in &nbsp; <b>Website:</b> www.jssl.in<br>
                        </td>
                        <td colspan="6">
                            <br>
                            <div class="invoice-line">
                                <div style="font-size:14px;"><b>Invoice No: <span class="invoiceNumber"></span></b></div>
                                <div><b>Date:</b> <span class="date"></span></div>
                            </div>
                            <br>
                            <b>Contract No Reference No:</b> <span class="contrefno"></span><br>
                            <b>Date &amp; Time of supply:</b> <span class="datetime"></span><br>
                            <br>
                            <b>Work/Purchase Order No:</b> <span class="workor"></span><br>
                            <b>Date of Order:</b> <span class="dateor"></span><br>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="6" style="font-size:10px; line-height:1.3;">
                            <b>Invoice To:</b><br>
                            <b><span class="shipto11"></span></b><br><br>
                            <b>
                                Name of the State: <span class="statename"></span><br>
                                State Code: <span class="stcode11"></span><br>
                                GSTIN: <span class="ingst"></span><br>
                                PAN: <span class="panin"></span><br>
                            </b>
                        </td>
                        <td colspan="6" style="font-size:10px; line-height:1.3;">
                            <b>Name &amp; Address of consignee:</b><br>
                            <b><span class="conname"></span></b><br><br>
                            <b>
                                State Name: <span class="state"></span><br>
                                State Code: <span class="stateco"></span><br>
                                GSTIN: <span class="congst"></span><br>
                                PAN: <span class="pancon"></span><br>
                            </b>
                        </td>
                    </tr>
                    <tr class="fixed-8px">
                        <td colspan="3" class="notif-cell">
                            <strong>Date of Notification</strong><br>
                            <strong>Exempted note under:</strong><br>
                            <strong>Tax is Payable on reverse charge (Yes/No):</strong><br>
                        </td>
                        <td colspan="3" style="font-size:7px;">
                            <strong>Export Details:</strong><br>
                            <strong>ARE No:</strong><br>
                            <strong>LUT No:</strong><br>
                            <strong>Container No:</strong><br>
                            <strong>EPCG License No:</strong><br>
                        </td>
                        <td colspan="3" style="font-size:7px;">
                            <b>Transporter:</b> <span class="trans"></span><br>
                            <b>Vehicle No:</b> <span class="vehino"></span><br>
                            <b>LR/DOCKET No:</b><br>
                            <b>Date:</b><br>
                        </td>
                        <td colspan="3" style="font-size:7px;">
                            <b>Shipment Mode:</b> <span class="shipmo"></span><br>
                            <b>Delivery Condition:</b> <span class="delcon"></span><br>
                        </td>
                    </tr>
                </table>

                <table class="product-table">
                    <thead>
                        <tr>
                            <th class="desc-col" colspan="1" style="width:5%;">Sr No.</th>
                            <th class="desc-col" colspan="4">Product Description</th>
                            <th class="desc-col" colspan="1" style="width:10%;">Service/HSN Code</th>
                            <th class="desc-col" colspan="1">UOM</th>
                            <th class="desc-col" colspan="1">Qty/Nos</th>
                            <th class="desc-col" colspan="2" style="text-align:center;">Weight<br>(Kgs/Mt/Sq Mts)</th>
                            <th class="desc-col" colspan="1" style="width:10%;">Unit Price</th>
                            <th class="desc-col" colspan="2">Value (INR)</th>
                        </tr>
                    </thead>
                    <tbody id="product_table_data" style="height:180px;">
                        <tr class="product-row">
                            <td colspan="1" style="text-align:right;">1</td>
                            <td colspan="4" class="desc-col descri">
                                <span class="item"></span><br><br><br>
                                <span class="productdesc" style="font-weight:550;"></span>
                            </td>
                            <td colspan="1" style="text-align:right;"><span class="hsn"></span></td>
                            <td colspan="1"><span class="uom"></span></td>
                            <td colspan="1" style="text-align:right;" class="qtys"><span class="qty"></span></td>
                            <td colspan="2" style="text-align:right;" class="weits"><span class="kg"></span></td>
                            <td colspan="1" style="text-align:right;" class="prs"><span class="unipri"></span></td>
                            <td colspan="2" style="text-align:right;" class="tols"><span class="val"></span></td>
                        </tr>
                    </tbody>

                    <tbody class="total-body">
                        <tr>
                            <td colspan="7" class="total-datatd"><span>TOTAL</span></td>
                            <td class="total-datatds"><span class="qtytotal"></span></td>
                            <td colspan="2" class="total-datatds"><span class="wiegtotal"></span></td>
                            <td></td>
                            <td colspan="2" class="total-datatds"><span class="val11"></span></td>
                        </tr>
                    </tbody>

                    <tbody class="tax-row">
                        <tr>
                            <td colspan="6"></td>
                            <td colspan="4" class="tax-name">
                                <span class="hidetax1"><span class="tax1name"></span></span><br>
                                <span class="hidetax2"><span class="tax2name"></span></span><br>
                                <span class="hidetax3"><span class="tax3name"></span></span>
                            </td>
                            <td class="tax-per">
                                <span class="hidetax1"><span class="tax1per"></span> %</span><br>
                                <span class="hidetax2"><span class="tax2per"></span> %</span><br>
                                <span class="hidetax3"><span class="tax3per"></span> %</span>
                            </td>
                            <td colspan="2" class="tax-per">
                                <span class="hidetax1"><span class="tax1value"></span></span><br>
                                <span class="hidetax2"><span class="tax2value"></span></span><br>
                                <span class="hidetax3"><span class="tax3value"></span></span>
                            </td>
                        </tr>
                    </tbody>

                    <tbody class="total-word">
                        <tr>
                            <td colspan="8" class="total-words-des">
                                <b>Note:</b> <span>Identification Marks &amp; Serial No. of Goods: As per packing list attached</span><br>
                                <span class="hidetax1"><b class="tax1namewo"></b>: <b class="word1"></b></span><br>
                                <span class="hidetax2"><b class="tax2namewo"></b>: <b class="word2"></b></span><br>
                                <span class="hidetax3"><b class="tax3namewo"></b>: <b class="word3"></b></span><br>
                                <br>
                                <b>Gross total in words:</b> <b class="grandwork"></b>
                            </td>
                            <td colspan="3" class="total-words-des ss"><b>Total Invoice Value:</b></td>
                            <td colspan="2" class="total-words-val"><span class="grand"></span></td>
                        </tr>
                    </tbody>

                    <tbody>
                        <tr class="particulars-row">
                            <td colspan="3" class="particulars-row-prtd">Particulars</td>
                            <td colspan="1" class="particulars-row-prtd">Tax Application</td>
                            <td colspan="1" class="particulars-row-prtd">Tax %</td>
                            <td colspan="1" class="particulars-row-prtd">Adv Recovery (Taxable)</td>
                            <td colspan="1" class="particulars-row-prtd">Adv Recovery (NonTax)</td>
                            <td colspan="2" class="particulars-row-prtd">Invoice Value</td>
                            <td colspan="2" class="particulars-row-prtd">Payable to dept</td>
                            <td colspan="2" class="particulars-row-prtd">Payable by Customer</td>
                        </tr>
                    </tbody>

                    <tbody>
                        <tr class="particulars-row-body">
                            <td colspan="3"><span class="gstrem"></span></td>
                            <td colspan="1" style="text-align:right;">
                                <span class="tax11name"></span><br>
                                <span class="tax12name"></span><br>
                                <span class="tax13name"></span>
                            </td>
                            <td colspan="1" class="particulars-row-body-td">
                                <span class="tax11per"></span><br>
                                <span class="tax12per"></span><br>
                                <span class="tax13per"></span>
                            </td>
                            <td colspan="1" class="particulars-row-body-td"><span>0.00</span></td>
                            <td colspan="1" class="particulars-row-body-td"><span>0.00</span></td>
                            <td colspan="2" class="particulars-row-body-td">
                                <span class="vallast"></span><br>
                                <span class="tax11value"></span><br>
                                <span class="tax12value"></span><br>
                                <span class="tax13value"></span>
                            </td>
                            <td colspan="2" class="particulars-row-body-td">
                                <span class="tax111value"></span><br>
                                <span class="tax121value"></span><br>
                                <span class="tax131value"></span>
                            </td>
                            <td colspan="2" class="particulars-row-body-td">
                                <span class="vallast1"></span><br>
                                <span class="tax11value1"></span><br>
                                <span class="tax12value1"></span><br>
                                <span class="tax13value1"></span>
                            </td>
                        </tr>
                    </tbody>

                    <tbody>
                        <tr>
                            <td colspan="3"><span>Total</span></td>
                            <td colspan="1"></td>
                            <td colspan="1"></td>
                            <td colspan="1" class="td-body-tax"><span>0.00</span></td>
                            <td colspan="1"></td>
                            <td colspan="2" class="td-body-tax"><span class="grandlast"></span></td>
                            <td colspan="2" class="td-body-tax"><span class="taxtotal"></span></td>
                            <td colspan="2" class="td-body-tax"><span class="grandlast12"></span></td>
                        </tr>
                    </tbody>

                    <tbody>
                        <tr>
                            <td colspan="13" class="Bank_details">
                                <span>BANK ACCOUNT DETAILS: &nbsp; BANK ACCOUNT NAME: </span><b class="bankname"></b><br>
                                <span>ACCOUNT NUMBER: </span><b class="acc"></b>
                                <span> &nbsp; BANK NAME &amp; ADDRESS: </span><b class="bname"></b> <b class="add"></b>
                                <span> &nbsp; BRANCH CODE: </span><b class="code"></b><br>
                                <span>SWIFT CODE: </span><b class="scode"></b>
                                <span> &nbsp; IFSC CODE: </span><b class="ifsc"></b><br>
                            </td>
                        </tr>
                    </tbody>

                    <tbody>
                        <tr class="last-data">
                            <td colspan="9">
                                <span>Certified that the particulars given above are the true and correct and the amount indicated represents the price</span><br>
                                <span>actually charged from the consignee and that there is no additional consideration following directly or</span><br>
                                <span>indirectly over and above what has been declared herein.</span><br>
                            </td>
                            <td colspan="4">
                                <span>For <span class="footercompanyname"></span></span><br>
                                <span style="margin-top:20px; display:inline-block;">(Authorised signature)</span><br>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer">
                    <b>Regd Office: </b><span class="reg_add"></span>
                    <p>(All disputes subject to Karnataka Jurisdiction) E&amp;OE</p>
                </div>
            </div>
        `;

        // ── Fill Invoice Data into DOM ─────────────────────────────────────────
        function fillInvoice(container) {

            // Hide tax rows where value is 0 or null
            if (!tax1_value || Number(tax1_value) === 0)
                container.querySelectorAll('.hidetax1').forEach(el => el.style.display = 'none');
            if (!tax2_value || Number(tax2_value) === 0)
                container.querySelectorAll('.hidetax2').forEach(el => el.style.display = 'none');
            if (!tax3_value || Number(tax3_value) === 0)
                container.querySelectorAll('.hidetax3').forEach(el => el.style.display = 'none');

            // COMPANY / FACTORY HEADER — all dynamic from ScrapInvoiceInfo (BUSINESS_UNITS join)
            container.querySelector('.reg_add').textContent          = reg_addresss;
            container.querySelector('.companyname').textContent      = cleanBusinessUnitName;
            container.querySelector('.footercompanyname').textContent = cleanBusinessUnitName;
            container.querySelector('.gst_code').textContent         = Gst_Code;
            container.querySelector('.pan_code').textContent         = Pan_Code;
            container.querySelector('.state_code').textContent       = state_Code;
            container.querySelector('.facotry_address').textContent  = factory_Address;

            // INVOICE HEADER
            container.querySelector('.invoiceNumber').textContent  = invoiceno;
            container.querySelector('.contrefno').textContent      = contref;
            container.querySelector('.datetime').textContent       = formattedDateTime;
            container.querySelector('.workor').textContent         = saleOrderCode;
            container.querySelector('.dateor').textContent         = currentDate;
            container.querySelector('.date').textContent           = currentDate;

            // INVOICE TO (SHIPPING)
            container.querySelector('.shipto11').textContent  = shipping_address;
            container.querySelector('.statename').textContent = shipping_state_name;
            container.querySelector('.stcode11').textContent  = shipping_state_code;
            container.querySelector('.ingst').textContent     = shipping_gst;
            container.querySelector('.panin').textContent     = shipping_pan;

            // CONSIGNEE (BILLING)
            container.querySelector('.conname').textContent  = billing_address;
            container.querySelector('.state').textContent    = billing_state_name;
            container.querySelector('.stateco').textContent  = billing_state_code;
            container.querySelector('.congst').textContent   = invoice_gst;
            container.querySelector('.pancon').textContent   = inovoice_pan;

            // TRANSPORT
            container.querySelector('.trans').textContent  = transportername;
            container.querySelector('.vehino').textContent = vehicleno;
            container.querySelector('.shipmo').textContent = shipment_mode;
            container.querySelector('.delcon').textContent = delivery_condition;

            // PRODUCT
            container.querySelector('.item').textContent    = scrapitemname;
            container.querySelector('.productdesc').textContent = productdesc || '';
            container.querySelector('.hsn').textContent     = Service_Code;
            container.querySelector('.uom').textContent     = unit_name;
            container.querySelector('.qty').textContent     = quantity;
            container.querySelector('.kg').textContent      = kg;
            container.querySelector('.unipri').textContent  = formatAmount(unit_price);
            container.querySelector('.val').textContent     = formatAmount(total);

            // TOTALS
            container.querySelector('.qtytotal').textContent  = quantity;
            container.querySelector('.wiegtotal').textContent = kg;
            container.querySelector('.val11').textContent     = formatAmount(total);

            // TAX SUMMARY ROWS
            container.querySelector('.tax1name').textContent  = tax1_name;
            container.querySelector('.tax2name').textContent  = tax2_name;
            container.querySelector('.tax3name').textContent  = tax3_name;
            container.querySelector('.tax1per').textContent   = tax1_per;
            container.querySelector('.tax2per').textContent   = tax2_per;
            container.querySelector('.tax3per').textContent   = tax3_per;
            container.querySelector('.tax1value').textContent = formatAmount(tax1_value);
            container.querySelector('.tax2value').textContent = formatAmount(tax2_value);
            container.querySelector('.tax3value').textContent = formatAmount(tax3_value);

            // WORDS ROW
            container.querySelector('.tax1namewo').textContent = tax1_name;
            container.querySelector('.tax2namewo').textContent = tax2_name;
            container.querySelector('.tax3namewo').textContent = tax3_name;
            container.querySelector('.word1').textContent      = tax1_words;
            container.querySelector('.word2').textContent      = tax2_words;
            container.querySelector('.word3').textContent      = tax3_words;
            container.querySelector('.grandwork').textContent  = grand_total_words;
            container.querySelector('.grand').textContent      = formatAmount(grand_total);

            // PARTICULARS TABLE
            container.querySelector('.gstrem').textContent     = gst_remarks;
            container.querySelector('.tax11name').textContent  = tax1_name;
            container.querySelector('.tax12name').textContent  = tax2_name;
            container.querySelector('.tax13name').textContent  = tax3_name;
            container.querySelector('.tax11per').textContent   = tax1_per;
            container.querySelector('.tax12per').textContent   = tax2_per;
            container.querySelector('.tax13per').textContent   = tax3_per;
            container.querySelector('.vallast').textContent    = formatAmount(total);
            container.querySelector('.tax11value').textContent  = formatAmount(tax1_value);
            container.querySelector('.tax12value').textContent  = formatAmount(tax2_value);
            container.querySelector('.tax13value').textContent  = formatAmount(tax3_value);
            container.querySelector('.tax111value').textContent = formatAmount(tax1_value);
            container.querySelector('.tax121value').textContent = formatAmount(tax2_value);
            container.querySelector('.tax131value').textContent = formatAmount(tax3_value);
            container.querySelector('.vallast1').textContent    = formatAmount(total);
            container.querySelector('.tax11value1').textContent = formatAmount(tax1_value);
            container.querySelector('.tax12value1').textContent = formatAmount(tax2_value);
            container.querySelector('.tax13value1').textContent = formatAmount(tax3_value);
            container.querySelector('.grandlast').textContent   = formatAmount(grand_total);
            container.querySelector('.grandlast12').textContent = formatAmount(grand_total);
            container.querySelector('.taxtotal').textContent    = formatAmount(total_tax);

            // BANK DETAILS
            container.querySelector('.bankname').textContent = account_name;
            container.querySelector('.acc').textContent      = account_number;
            container.querySelector('.add').textContent      = branch_address;
            container.querySelector('.code').textContent     = branch_code;
            container.querySelector('.scode').textContent    = swift_code;
            container.querySelector('.ifsc').textContent     = ifsc_code;
            container.querySelector('.bname').textContent    = bank_name;
        }

        // ── Auto-fit font size ────────────────────────────────────────────────
        function autoFitInvoice(container) {
            const invoice = container.querySelector(".invoice-container");
            const maxHeight = 1000;
            let fontSize = 9;

            function applySize(size) {
                invoice.style.fontSize = size + "px";
                invoice.querySelectorAll("td, th").forEach(el => {
                    el.style.fontSize   = size + "px";
                    el.style.padding    = "1px 2px";
                    el.style.lineHeight = "1.05";
                });
            }

            applySize(fontSize);
            if (invoice.scrollHeight === 0) return;
            while (invoice.scrollHeight > maxHeight && fontSize > 6) {
                fontSize--;
                applySize(fontSize);
            }
            console.log("Final font size:", fontSize);
        }

        // ── Print / PDF ───────────────────────────────────────────────────────
        function downloadInvoicePDF(htmlContent, fillInvoice, hideLoader) {
            const prange = [
                "Original For Recipient",
                "Duplicate For Transporter",
                "Triplicate For Supplier"
            ];

            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert("Popup blocked! Please allow popups.");
                hideLoader();
                return;
            }

            let fullHTML = `
                <html>
                <head>
                    <title>Invoice PDF</title>
                    <style>
                        @page { size: A4; margin: 10mm; }
                        body { margin: 0; padding: 0; font-family: Calibri, Arial, sans-serif; }
                        .page {
                            width: 100%;
                            max-width: 210mm;
                            margin: 0 auto;
                            page-break-after: always;
                        }
                        .page:last-child { page-break-after: avoid; }
                        @media print {
                            body { margin: 0; }
                            .page { page-break-after: always; }
                            .page:last-child { page-break-after: avoid; }
                        }
                    </style>
                </head>
                <body>
            `;

            prange.forEach(label => {
                const temp = document.createElement("div");
                temp.classList.add("page");
                temp.innerHTML = htmlContent;

                const labelEl = temp.querySelector(".copy-label");
                if (labelEl) labelEl.textContent = label;

                fillInvoice(temp);
                fullHTML += temp.outerHTML;
            });

            fullHTML += `</body></html>`;

            printWindow.document.open();
            printWindow.document.write(fullHTML);
            printWindow.document.close();

            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.focus();
                    printWindow.print();
                    printWindow.close();
                    hideLoader();
                }, 500);
            };
        }

        downloadInvoicePDF(htmlContent, fillInvoice, hideLoader);

    } catch (error) {
        hideLoader();
        console.error('Error generating scrap invoice PDF:', error);
    }
}

/*async function printRecordView(id) {
    try {
        const url = new URL(`/jssl/scrapinvoice/scrapInvoiceDetailsBsdOnId?scp_invoice_id=${id}`, baseUrl);
        const response = await fetch(url,{
                                   method: "GET",
                                   credentials: "include"   // âœ… Always send JSESSIONID cookie
                               });
        if (!response.ok) throw new Error("Failed to fetch data");

        const json = await response.json();

        // Extract data
        const scrapInvoiceItemInfo = json.ScrapInvoiceItemInfo;
        const ScrapInvoiceInfo = json.ScrapInvoiceInfo;
        const invoiceno = ScrapInvoiceInfo.invoice_no;
        const contref = ScrapInvoiceInfo.contract_no;
        const transportername = ScrapInvoiceInfo.transportername;
        const saleOrderCode = scrapInvoiceItemInfo.sale_order_code;
        const scrapitemname = scrapInvoiceItemInfo.scrapitemname;
        const hsn_code = scrapInvoiceItemInfo.hsn_code;
        const unit_name = scrapInvoiceItemInfo.unit_name;
        const quantity = scrapInvoiceItemInfo.quantity;
        const kg = scrapInvoiceItemInfo.kg;
        const unit_price = scrapInvoiceItemInfo.unit_price;
        const vehicleno = ScrapInvoiceInfo.vehicleno;
        const shipment_mode = ScrapInvoiceInfo.shipment_mode;
        const delivery_condition = ScrapInvoiceInfo.delivery_condition;
        const shipping_state_name = ScrapInvoiceInfo.shipping_state_name;
        const shipping_state_code = ScrapInvoiceInfo.shipping_state_code;
        const shipping_address = ScrapInvoiceInfo.shipping_address;
        const billing_address = ScrapInvoiceInfo.billing_address;
        const billing_state_name = ScrapInvoiceInfo.billing_state_name;
        const billing_state_code = ScrapInvoiceInfo.billing_state_code;
        const tax1_per = ScrapInvoiceInfo.tax1_per;
        const tax2_per = ScrapInvoiceInfo.tax2_per;
        const tax3_per = ScrapInvoiceInfo.tax3_per;
        const tax1_name = ScrapInvoiceInfo.tax1_name;
        const tax2_name = ScrapInvoiceInfo.tax2_name;
        const tax3_name = ScrapInvoiceInfo.tax3_name;
        const tax1_value = ScrapInvoiceInfo.tax1_value;
        const tax2_value = ScrapInvoiceInfo.tax2_value;
        const tax3_value = ScrapInvoiceInfo.tax3_value;
        const grand_total = ScrapInvoiceInfo.grand_total;
        const total_tax = ScrapInvoiceInfo.total_tax;
        const gst_remarks = ScrapInvoiceInfo.gst_remarks;
        const tax3_words = ScrapInvoiceInfo.tax3_words;
        const tax2_words = ScrapInvoiceInfo.tax2_words;
        const tax1_words = ScrapInvoiceInfo.tax1_words;
        const grand_total_words = ScrapInvoiceInfo.grand_total_words;
        const account_name = ScrapInvoiceInfo.account_name;
        const account_number = ScrapInvoiceInfo.account_number;
        const branch_address = ScrapInvoiceInfo.branch_address;
        const branch_code = ScrapInvoiceInfo.branch_code;
        const swift_code = ScrapInvoiceInfo.swift_code;
        const ifsc_code = ScrapInvoiceInfo.ifsc_code;
        const bank_name = ScrapInvoiceInfo.bank_name;
        const total = scrapInvoiceItemInfo.total;
        const currentDate = new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '-'); // Replace '/' with '-'
    	
        console.log(currentDate); // Output: "21-02-2025" (DD-MM-YYYY)
        const currentDate1 = new Date();
        const formattedDateTime = String(currentDate1.getDate()).padStart(2, '0') + '-' + 
                          String(currentDate1.getMonth() + 1).padStart(2, '0') + '-' + 
                          currentDate1.getFullYear() + ' ' + 
                          String(currentDate1.getHours()).padStart(2, '0') + ':' + 
                          String(currentDate1.getMinutes()).padStart(2, '0') + ':' + 
                          String(currentDate1.getSeconds()).padStart(2, '0');

console.log(formattedDateTime);  // Example output: "21-02-2025 14:30:45"

// Declare and open new window BEFORE doing heavy logic
        const newWindow = window.open('', '_blank');
        if (!newWindow) {
            //alert("Popup blocked. Please allow popups from this site.");
            return;
        }

        // const htmlContent = await (await fetch('print-content.html')).text()
            const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tally Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .invoice-container {
            width: 100vw;
            max-width: 1200px;
            border: 1px solid #000;
            padding: 15px;
        }
        .invoice-container1 {
            width: 100vw;
            max-width: 1200px;
            border: 1px solid #000;
            padding: 15px;
            margin-top:35px;
        }
        .invoice-container2 {
            width: 100vw;
            max-width: 1200px;
            border: 1px solid #000;
            padding: 15px;
            margin-top:60px;
        }
        .header, .footer {
            text-align: center;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .gst-text {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
        }
        .company-details-table {
            width: 100%;
            border-collapse: collapse;
        }
        .company-details-table td {
            border: 1px solid #000;
            padding: 15px;
            vertical-align: top;
        }
        .company-logo {
            width: 80px;
            height: 50px;
            display: block;
            margin-bottom: 10px;
        }
        .product-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0px;
        }
        .product-table th, .product-table td {
            border: 1px solid #000;
            padding: 10px;
            text-align: center;
        }
        .terms {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <b><span id="topdate"></span></b>
            <div class="gst-text">GST TAX INVOICE</div>
            <div class="gst-text1">Original For Recipient</div>
        </div>
        
        <table class="company-details-table">
            <tr>
                <td colspan="2">
                    <div class="company-logo">
                    <img src="img/logo/download.png" alt="Company Logo" style="width: 80px;">
                      </div>
                    <strong>JSW Serverfiled Structures Limited</strong><br>
                    Near 10 MT Gate, Beside Cement Plant-2<br>
                    Vidyanagar P.O. Torangallu<br>
                    Torangallu-583275<br>
                    Ballari, Karnataka, India<br>
                    State Code:29<br>
                    GSTIN : 29AACCJ1473D1ZQ     PAN : AACCJ1473D<br>
                    JCE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
                    Email: invoice@jssl.in    Website: www.jssl.in<br>
                </td>
                <td colspan="2">
                <b>Invoice No:</b> <span id="invoiceNumber"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date"></span><br>
                <b>Contract No Reference No:</b> <span id="contrefno"></span><br>
                <b>Date & Time of supply:</b> <span id="datetime"></span><br>
                <b>Work Purchase Order No:</b> <span id="workor"></span><br>
                <b>Date of Order:</b> <span id="dateor"></span><br>
            </tr>
            <tr>
                <td colspan="2"><strong>Invoice To:</strong><br>
                <span id="shipto11"></span><br>
                <b>Name of the state:</b> <span id="statename"></span><br>
                <b>State Code:</b> <span id="stcode11"></span><br>
                <b>GSTIN:</b><br>
                <b>PAN:</b><br>
                </td>
                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
                <span id="conadd"></span><br>
                <b>State:</b> <span id="state"></span><br>
                <b>State Code:</b> <span id="stateco"></span><br>
                <b>GSTIN:</b> <br>
                <b>PAN:</b> <span>AAACT4119L</span><br>
                </td>
            </tr>
            <tr>
                <td><strong>Date of Notification</strong><br>
                 <strong>Exempted note under:</strong><br>
                 <strong>Tax is Payble on revese charge:(Yes/No):</strong><br>
                </td>
                <td><strong>Export Details:</strong><br>
                <strong>ARE No:</strong><br>
                <strong>LUT No:</strong><br>
                <strong>Container No:</strong><br>
                <strong>EPCG License No:</strong><br>
                </td>
                <td><b>Transporter:</b> <span id="trans"></span><br>
                <b>Vehicle No:</b> <span id="vehino"></span><br>
                <b>LR/DOCKET No:</b><br>
                <b>Date:</b><br>
                </td>
                <td><b>Shipment Mode:</b> <span id="shipmo"></span><br>
                <b>Delivery Condition:</b> <span id="delcon"></span><br>
                </td>
            </tr>
        </table>
        
        <table class="product-table">
            <thead>
                <tr>
                    <th>Sr No.</th>
                    <th>Product Description</th>
                    <th>Service/HSN Code</th>
                    <th>UOM</th>
                    <th>Qty</th>
                    <th>Weight</th>
                    <th>Unit Price</th>
                    <th>Value (INR)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 180px;">
                    <span>1</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 180px;">
                    <span id="item"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 180px;">
                    <span id="hsn"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 180px;">
                    <span id="uom"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 180px;">
                    <span id="qty"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 180px;">
                    <span id="kg"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 180px;">
                    <span id="unipri"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 180px;">
                    <span id="val"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="2"></td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="qty1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="wieg"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="val11"></span><br>
                    </td>
                    
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4"></td>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="2">
                    <span id="tax1name"></span><br>
                    <span id="tax2name"></span><br>
                    <span id="tax3name"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="tax1per"></span><br>
                    <span id="tax2per"></span><br>
                    <span id="tax3per"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="tax1value"></span><br>
                    <span id="tax2value"></span><br>
                    <span id="tax3value"></span><br>
                    </td>
                  
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
                    <b>Note:</b><span>Itendification Marks & serial No. of Goods:As per packing list attached</span><br>
                    <b id="tax1namewo"></b>: <b id="word1"></b><br>
                    <b id="tax2namewo"></b>: <b id="word2"></b><br>
                    <b id="tax3namewo"></b>: <b id="word3"></b><br>
                    <b>Gross total in words:</b> <b id="grandwork"></b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
                    <b>TOTAL INVOICE VALUE:</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="grand"></span><br>
                    </td>
                                    
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;width: 200px;">
                    <span>Particulars</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax Application</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax %</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (Taxable)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (NonTax)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Invoice Value</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Payable to dept</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Payable by Customer</span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="gstrem"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="tax11name"></span><br>
                    <span id="tax12name"></span><br>
                    <span id="tax13name"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="tax11per"></span><br>
                    <span id="tax12per"></span><br>
                    <span id="tax13per"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>0.00</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>0.00</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="vallast"></span><br>
                    <span id="tax11value"></span><br>
                    <span id="tax12value"></span><br>
                    <span id="tax13value"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="tax111value"></span><br>
                    <span id="tax121value"></span><br>
                    <span id="tax131value"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="vallast1"></span><br>
                    <span id="tax11value1"></span><br>
                    <span id="tax12value1"></span><br>
                    <span id="tax13value1"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Total</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>0.00</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="grandlast"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxtotal"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="grandlast12"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="8">
                    <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b id="bankname"></b>,
                    <span>ACCOUNT NUMBER:</span><b id="acc"></b>,<span>BANK NAME & ADDRESS:</span><b id="bname"></b>,<b id="add"></b>
                    <span>BRANCH CODE:</span><b id="code"></b>,<span>SWIFT CODE:</span><b id="scode"></b>,<span>IFSC CODE:</span><b id="ifsc"></b><br>
                   </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="5">
                    <span>Certified that the particulars given above are the true and correct and the amount indicated represents the price</span><br>
                    <span>actually charged from the consignee and that there is no additional consideration following directly or</span><br>
                    <span>indirectly over and above what has been declared herein.</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"></td>
                            <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="2">
            <span>For JSW SEVERFIELD STRUCTURES LTD.</span><br>
            <span style="margin-top: 20px; display: inline-block;">(Authorised signature)</span><br>
        </td>
        </tr>
            </tbody>
        </table>
       <div class="footer">
            <p>Regd Office:No.401,Grand Palladium,175 CST Road,Kalina,santacruz(East),Mumbai,IDIA-400 098 Ph:+91-22--67317000
            (All disputes subject to Karnataka Jurisdiction)E&OE</p>
        </div>
    </div>
   
    
    
</body>
</html>
`
        
        const printElement = document.createElement('div');
        printElement.innerHTML = htmlContent;
        console.log(printElement)
        // page1
        printElement.querySelector('#invoiceNumber').textContent = invoiceno;
        printElement.querySelector('#contrefno').textContent = contref;
        printElement.querySelector('#datetime').textContent = formattedDateTime;
        printElement.querySelector('#workor').textContent = saleOrderCode;
        printElement.querySelector('#dateor').textContent = currentDate;
        printElement.querySelector('#date').textContent = currentDate;
        printElement.querySelector('#topdate').textContent = formattedDateTime;
        printElement.querySelector('#conadd').textContent = billing_address;
        printElement.querySelector('#state').textContent = billing_state_name;
        printElement.querySelector('#stateco').textContent = billing_state_code;
        printElement.querySelector('#trans').textContent = transportername;
        printElement.querySelector('#vehino').textContent = vehicleno;
        printElement.querySelector('#shipmo').textContent = shipment_mode;
        printElement.querySelector('#delcon').textContent = delivery_condition;
        printElement.querySelector('#shipto11').textContent = shipping_address;
        printElement.querySelector('#statename').textContent = shipping_state_name;
        printElement.querySelector('#stcode11').textContent = shipping_state_code;
        printElement.querySelector('#item').textContent = scrapitemname;
        printElement.querySelector('#hsn').textContent = hsn_code;
        printElement.querySelector('#uom').textContent = unit_name;
        printElement.querySelector('#qty').textContent = quantity;
        printElement.querySelector('#kg').textContent = kg;
        printElement.querySelector('#unipri').textContent = unit_price;
        printElement.querySelector('#val').textContent = total;
        printElement.querySelector('#qty1').textContent = quantity;
        printElement.querySelector('#wieg').textContent = kg;
        printElement.querySelector('#val11').textContent = total;
        printElement.querySelector('#tax1per').textContent = tax1_per;
        printElement.querySelector('#tax2per').textContent = tax2_per;
        printElement.querySelector('#tax3per').textContent = tax3_per;
        printElement.querySelector('#tax1name').textContent = tax1_name;
        printElement.querySelector('#tax2name').textContent = tax2_name;
        printElement.querySelector('#tax3name').textContent = tax3_name;
        printElement.querySelector('#tax1value').textContent = tax1_value;
        printElement.querySelector('#tax2value').textContent = tax2_value;
        printElement.querySelector('#tax3value').textContent = tax3_value;
        printElement.querySelector('#grand').textContent = grand_total;
        printElement.querySelector('#tax11name').textContent = tax1_name;
        printElement.querySelector('#tax12name').textContent = tax2_name;
        printElement.querySelector('#tax13name').textContent = tax3_name;
        printElement.querySelector('#tax11per').textContent = tax1_per;
        printElement.querySelector('#tax12per').textContent = tax2_per;
        printElement.querySelector('#tax13per').textContent = tax3_per;
        printElement.querySelector('#vallast').textContent = total;
        printElement.querySelector('#tax11value').textContent = tax1_value;
        printElement.querySelector('#tax12value').textContent = tax2_value;
        printElement.querySelector('#tax13value').textContent = tax3_value;
        printElement.querySelector('#tax111value').textContent = tax1_value;
        printElement.querySelector('#tax121value').textContent = tax2_value;
        printElement.querySelector('#tax131value').textContent = tax3_value;
        printElement.querySelector('#vallast1').textContent = total;
        printElement.querySelector('#tax11value1').textContent = tax1_value;
        printElement.querySelector('#tax12value1').textContent = tax2_value;
        printElement.querySelector('#tax13value1').textContent = tax3_value;
        printElement.querySelector('#grandlast').textContent = grand_total;
        printElement.querySelector('#grandlast12').textContent = grand_total;
        printElement.querySelector('#taxtotal').textContent = total_tax;
        printElement.querySelector('#gstrem').textContent = gst_remarks;
        printElement.querySelector('#tax1namewo').textContent = tax1_name;
        printElement.querySelector('#tax2namewo').textContent = tax2_name;
        printElement.querySelector('#tax3namewo').textContent = tax3_name;
        printElement.querySelector('#word1').textContent = tax1_words;
        printElement.querySelector('#word2').textContent = tax2_words;
        printElement.querySelector('#word3').textContent = tax3_words;
        printElement.querySelector('#grandwork').textContent = grand_total_words;
        printElement.querySelector('#bankname').textContent = account_name;
        printElement.querySelector('#acc').textContent = account_number;
        printElement.querySelector('#add').textContent = branch_address;
        printElement.querySelector('#code').textContent = branch_code;
        printElement.querySelector('#scode').textContent = swift_code;
        printElement.querySelector('#ifsc').textContent = ifsc_code;
        printElement.querySelector('#bname').textContent = bank_name;
        //page 2
       
        
        newWindow.document.write(htmlContent);
        newWindow.document.close();

    } catch (error) {
        console.error("Error:", error);
        //alert("Failed to load invoice data.");
    }
}
*/
function openModalcancel(id, scp_load) {
		//  const allowed = window.allowedActions || [];

	if (!allowed.includes("Cancel")) {
	  alert(" You do not have permission to Cancel.");
	  $('#exampleModalCenter16').modal('hide');
	  return;
	}
    // Open the modal
    $('#exampleModalCenter16').modal('show');

    // Store the id and pn_id in the modal's data attributes
    $('#exampleModalCenter16').attr('data-id', id);
    $('#exampleModalCenter16').attr('data-scp_load', scp_load);
}

function cancelRecord() {
	$('#exampleModalCenter16').modal('hide');
    // Store the id and pn_id in the modal's data attributes
    var id = $('#exampleModalCenter16').attr('data-id');
    var scp_Load = $('#exampleModalCenter16').attr('data-scp_load');
    $.ajax({
        url: new URL('/jssl/scrapinvoice/cancelbyidnew', baseUrl),   // cancel endpoint
        type: 'POST',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: jQuery.param({
            id: id,
            cancelled_by: createdById,
            scp_load: scp_Load
        }),
        success: function(data) {

            var result = data.message;

            if (result === "Success") {

                const popup = $('<div class="popup"> Scrap  Invoice Cancelled Successfully!</div>')
                    .appendTo('body')
                    .hide()
                    .fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'InvoiceSrap.jsp';
                    });
                }, 800);

            } else {
                const errorMessage = data.message || 'Failed to create invoice.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenter16').modal('hide');
            }
        },
        error: function() {
            console.error('Cancel request failed.');
        }
    });

}

function openModal(id, scp_load) {
	//  const allowed = window.allowedActions || [];

	if (!allowed.includes("Release")) {
	  alert(" You do not have permission to release.");
	  console.warn("Blocked edit attempt. User lacks release permission.");
	  return;
	}


	console.log(" release record with ID:", id);
    // Open the modal
    $('#exampleModalCenter1').modal('show');

    // Store the id and pn_id in the modal's data attributes
    $('#exampleModalCenter1').attr('data-id', id);
    $('#exampleModalCenter1').attr('data-scp_load', scp_load);
}

function addeventrelease() {
	$('#exampleModalCenter1').modal('hide');
    // Retrieve the id and pn_id from the modal
	var id = $('#exampleModalCenter1').attr('data-id');
	var scp_Load = $('#exampleModalCenter1').attr('data-scp_load');

    // Perform release action
    $.ajax({
        url: new URL('/jssl/scrapinvoice/releasebyidnew', baseUrl),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({
            id: id, 
            factory_id: selectedFactoryId, 
            released_by: createdById, 
            scp_load: scp_Load
        }),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Scrap Invoice Released Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'InvoiceSrap.jsp';
                    });
                }, 800);
            } else {
            }
        },
        error: function () {
            console.error('Request failed.');
        }
    });
}

function formatAddress(address) {
    if (!address) return '';

    return address
        .split(',')
        .map(part => part.trim())
        .join('<br>');
}

function showLoader() {
  document.getElementById("pdfLoader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("pdfLoader").style.display = "none";
}




