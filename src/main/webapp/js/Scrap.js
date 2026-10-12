

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

document.getElementById("auctionDate").setAttribute("max", new Date().toISOString().split('T')[0]);
document.getElementById("durationDate").setAttribute("min", new Date().toISOString().split('T')[0]);
document.getElementById("auctionDateup").setAttribute("max", new Date().toISOString().split('T')[0]);
document.getElementById("durationDateup").setAttribute("min", new Date().toISOString().split('T')[0]);

// Function to add a new section of rows
function addNewRow() {
    let table = document.getElementById("myTable");
    let newTbody = document.createElement("tbody");

    newTbody.innerHTML = `
      <tr><td><textarea class="form-control textarea"></textarea></td></tr>
    `;
    table.appendChild(newTbody);
}

// Fetch selectedFactoryId from sessionStorage
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

// Ensure the ID is available before making the API call
if (selectedFactoryId) {
    //fetchUserList(selectedFactoryId);
} else {
    console.error('No factory ID found in sessionStorage.');
}

// Function to fetch the list of users/vendors based on the selected factory ID
/*async function fetchUserList(selectedFactoryId) {
    try {
        fetchtaxadd1();
        fetchtaxadd2();
        fetchtaxadd3();
        fetchSaleOrderCode();
        
        // Construct the API URL
        const url = new URL(`/jssl/saleOrderEntry/getSaleOrderBasedOnFactoryIdForScrap`, baseUrl);
        url.searchParams.append('factory_id', selectedFactoryId);

        // Fetch vendor data
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
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
                    <th>Sale Order Code</th>
                    <th>Auction Date</th>
                    <th>Sale Order Type</th>
                    <th>Sale Order To</th>
                    <th>Location</th>
                    <th>Edit</th>
					<th>Print</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.SaleOrderDetails.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.sale_order_code}</td>
                    <td>${formatDate(item.auction_date)}</td>
                    <td>${item.saleorder_typename}</td>
                    <td>${item.address}</td>
                    <td>${item.location_name}</td>
                    <td><i class="fa fa-edit"   style=" color: blue;" onclick="editRecord('${item.sale_order_code}')"></i></td>
					<td> <i class="fa fa-print" style="color: green; cursor: pointer;"  onclick="printRecord('${item.sale_order_code}')"> </i></td>
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
                    title: 'Sale Order',
                },
            ]
        });
    } catch (error) {
        console.error('Error fetching vendor data:', error);
    }
}*/







function fetchUserList(selectedFactoryId) {

  

    // ✅ These calls stay outside DataTable - they load dropdowns
    fetchtaxadd1();
    fetchtaxadd2();
    fetchtaxadd3();
    fetchSaleOrderCode();

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

                    const url = new URL(`/jssl/saleOrderEntry/getSaleOrderBasedOnFactoryIdForScrapPaged`, baseUrl);
                    url.searchParams.append('factory_id', selectedFactoryId);
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

                            const exportData = json.SaleOrderDetails.map(item => [
                                item.sale_order_code    || '',
                                formatDate(item.auction_date),
                                item.saleorder_typename || '',
                                item.address            || '',
                                item.location_name      || ''
                            ]);

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>Sale Order Code</th>',
                                        '<th>Auction Date</th>',
                                        '<th>Sale Order Type</th>',
                                        '<th>Sale Order To</th>',
                                        '<th>Location</th>'
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
                                    title: 'Sale Order List'
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
            { title: "Sale Order Code"  },
            { title: "Auction Date"     },
            { title: "Sale Order Type"  },
            { title: "Sale Order To"    },
            { title: "Location"         },
            { title: "Edit",  orderable: false },
			{ title: "Cancel",orderable: false },
            { title: "Print", orderable: false }
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

            const url = new URL(`/jssl/saleOrderEntry/getSaleOrderBasedOnFactoryIdForScrapPaged`, baseUrl);
            url.searchParams.append('factory_id', selectedFactoryId);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
			url.searchParams.append('search', searchValue);

            fetch(url, { credentials: "include" })
                .then(response => response.json())
                .then(json => {

                    if (!json.SaleOrderDetails || json.status === 'error') {
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });
                        return;
                    }

					const rows = json.SaleOrderDetails.map(item => {

					    const isCancelled = item.cancel == "true";

					    return [
					        item.sale_order_code || '',
					        formatDate(item.auction_date),
					        item.saleorder_typename || '',
					        item.address || '',
					        item.location_name || '',

					        isCancelled
					            ? `<i class="fa fa-edit text-muted"
					                  style="cursor:not-allowed;"
					                  title="Sale Order Cancelled"></i>`
					            : `<i class="fa fa-edit text-primary"
					                  style="cursor:pointer;"
					                  onclick="editRecord('${item.sale_order_code}')"></i>`,

					        isCancelled
					            ? `<i class="fa fa-times-circle text-muted"
					                  style="cursor:not-allowed;"
					                  title="Sale Order Cancelled"></i>`
					            : `<i class="fa fa-times-circle text-danger"
					                  style="cursor:pointer;"
					                  onclick="openModalcancel('${item.sale_order_code}')"></i>`,

					        `<i class="fa fa-print text-success"
					              style="cursor:pointer;"
					              onclick="printRecord('${item.sale_order_code}')"></i>`
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
                    console.error('Error fetching sale order data:', error);
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
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypes(selectedFactoryId);
		fetchUserList(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchSaleOrderTypes() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/salesordertype/list`, baseUrl);
      //  url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.SalesOrderTypeDetails.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("saleOrderTypeAdd");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Sale Order Type</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.SalesOrderTypeDetails.forEach((type) => {
            if (type.saleorder_id && type.saleorder_typename) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.saleorder_id; // Backend keeps saleorder_id
                option.textContent = type.saleorder_typename; // Display saleorder_typename
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
        fetchLocationTypes(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchLocationTypes() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/scrapsalelocation/list`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.ListLocationTrack.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("locationTypeAdd");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select location</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.ListLocationTrack.forEach((type) => {
            if (type.slid && type.location_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.slid; // Backend keeps saleorder_id
                option.textContent = type.location_name; // Display saleorder_typename
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
        fetchOrderTo(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchOrderTo() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddressNew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.InvoiceAddress.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("saleOrderTo");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select order To</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.InvoiceAddress.forEach((type) => {
            if (type.id && type.address && type.is_verified == 1) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.address; // Display saleorder_typename
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
        fetchbilling();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchshipping() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.ConsigneeAddress.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("shippingadd");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select shipping address</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.ConsigneeAddress.forEach((type) => {
            if (type.id && type.address && type.is_verified == 1) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.address; // Display saleorder_typename
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
        fetchshipping();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchbilling() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddressNew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.InvoiceAddress.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("billingadd");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select billing address</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.InvoiceAddress.forEach((type) => {
            if (type.id && type.address && type.is_verified == 1) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.address; // Display saleorder_typename
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
        fetchbusunit();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchbusunit() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("businessUnitAddress");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select busnisess unit</option>`;

		// Populate dropdown options using SalesOrderTypeDetails array
		        json.Data.forEach((type) => {
		            if (type.business_unit_id && type.business_unit_name) { 
					let bindaddress = type.business_unit_name + type.location + '(' + type.gst_number + ')';
        // Populate dropdown options using SalesOrderTypeDetails array
       /* json.Data.forEach((type) => {
            if (type.business_unit_id && type.business_unit_name) { // Ensure both values exist*/
                const option = document.createElement("option");
                option.value = type.business_unit_id; // Backend keeps saleorder_id
                option.textContent = bindaddress; // Display saleorder_typename
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
        fetchscraptype(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchscraptype(factoryId) {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/scraptypes/list`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Lists.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("scrapType");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select scrap type</option>`;

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
        fetchscrapItem(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchscrapItem(factoryId) {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/scrapsalescrapitems/list`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.ListScrapSaleScrapItems.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("scrapItem");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select scrap item</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.ListScrapSaleScrapItems.forEach((type) => {
            if (type.stid && type.scrapitemname) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.stid; // Backend keeps saleorder_id
                option.textContent = type.scrapitemname; // Display saleorder_typename
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
        fetchuom();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchuom() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listunitmeasurementmasternew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("uom");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select uom</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.unit_id && type.unit_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.unit_id; // Backend keeps saleorder_id
                option.textContent = type.unit_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

function isDuplicateTax(selectedValue, currentId) {
    const tax1 = document.getElementById("tax1add").value;
    const tax2 = document.getElementById("tax2add").value;
    const tax3 = document.getElementById("tax3add").value;

    let values = [];

    if (currentId !== "tax1add") values.push(tax1);
    if (currentId !== "tax2add") values.push(tax2);
    if (currentId !== "tax3add") values.push(tax3);

    return values.includes(selectedValue);
}

async function fetchtaxadd1() {
    try {
        const url = new URL(`/jssl/taxmasters/list`, baseUrl);
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch tax data");

        const json = await response.json();
        const taxData = json?.Data || [];

        const selectElement = document.getElementById("tax1add");
        const taxInput = document.getElementById("tax11");
        const taxValueInput = document.getElementById("tax1value");
        const totalNoInput = document.getElementById("totalNo"); // Total Amount Field

        if (!selectElement || !taxInput || !taxValueInput || !totalNoInput) {
            console.error("Some required elements not found.");
            return;
        }

        if (taxData.length === 0) {
            console.warn("No tax records found.");
            selectElement.innerHTML = `<option value="">No Tax Records Found</option>`;
            return;
        }

        selectElement.innerHTML = `<option value="">Select Tax</option>`;

        taxData.forEach((type) => {
            if (type.tax_id && type.tax_name && type.tax_per !== undefined) {
                const option = document.createElement("option");
                option.value = type.tax_id;
                option.dataset.taxPer = type.tax_per; // Store tax_per as a data attribute
                option.textContent = type.tax_name+ '-'+type.tax_per;
                selectElement.appendChild(option);
            }
        });

        // Function to calculate and update tax value
        function updateTaxValue() {
            const taxPer = parseFloat(taxInput.value) || 0;
         /*   const totalNo = parseFloat(totalNoInput.value) || 0;
            const taxAmount = (totalNo * taxPer) / 100;*/
			const selectedOption = selectElement.options[selectElement.selectedIndex];
			const taxName = (selectedOption.text || "").trim().toUpperCase();
			const totalNo = parseFloat(totalNoInput.value) || 0;
			const grandTotal = parseFloat(document.getElementById("grandTotal").value) || 0;
			// If TCS calculate on Grand Total else on Net Amount
			const baseAmount = taxName.includes("TCS") ? grandTotal : totalNo;
			const taxAmount = (baseAmount * taxPer) / 100;
            taxValueInput.value = taxAmount.toFixed(2); // Show result with 2 decimal places
            updateTotalTax();
            updateGrandTotal();
        }

        // Event listener to update tax percentage and value
        /*selectElement.addEventListener("change", function () {
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            taxInput.value = selectedOption.dataset.taxPer || "";
            updateTaxValue(); // Update tax value immediately after selection
        });*/
		// ✅ UPDATED CODE (put here in same place)
		selectElement.addEventListener("change", function () {
		    const selectedValue = selectElement.value;

		    // 🔴 Check duplicate
		    if (isDuplicateTax(selectedValue, "tax1add")) {
		        alert("This tax is already selected in another field!");

		        // Clear everything
		        selectElement.value = "";
		        taxInput.value = "";
		        taxValueInput.value = "";
		        return;
		    }

		    const selectedOption = selectElement.options[selectElement.selectedIndex];
		    taxInput.value = selectedOption.dataset.taxPer || "";
		    updateTaxValue();
		});

        // Recalculate tax value when totalNo changes
        totalNoInput.addEventListener("input", updateTaxValue);

    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

async function fetchtaxadd2() {
    try {
        const url = new URL(`/jssl/taxmasters/list`, baseUrl);
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch tax data");

        const json = await response.json();
        const taxData = json?.Data || [];

        const selectElement = document.getElementById("tax2add");
        const taxInput = document.getElementById("tax12");
        const taxValueInput = document.getElementById("tax2value");
        const totalNoInput = document.getElementById("totalNo"); // Total Amount Field

        if (!selectElement || !taxInput || !taxValueInput || !totalNoInput) {
            console.error("Some required elements not found.");
            return;
        }

        if (taxData.length === 0) {
            console.warn("No tax records found.");
            selectElement.innerHTML = `<option value="">No Tax Records Found</option>`;
            return;
        }

        selectElement.innerHTML = `<option value="">Select Tax</option>`;

        taxData.forEach((type) => {
            if (type.tax_id && type.tax_name && type.tax_per !== undefined) {
                const option = document.createElement("option");
                option.value = type.tax_id;
                option.dataset.taxPer = type.tax_per; // Store tax_per as a data attribute
                option.textContent = type.tax_name+ '-'+type.tax_per;
                selectElement.appendChild(option);
            }
        });

        // Function to calculate and update tax value
        function updateTaxValue() {
			const taxPer = parseFloat(taxInput.value) || 0;
			   /*   const totalNo = parseFloat(totalNoInput.value) || 0;
			      const taxAmount = (totalNo * taxPer) / 100;*/
				const selectedOption = selectElement.options[selectElement.selectedIndex];
				const taxName = (selectedOption.text || "").trim().toUpperCase();
				const totalNo = parseFloat(totalNoInput.value) || 0;
				const grandTotal = parseFloat(document.getElementById("grandTotal").value) || 0;
				// If TCS calculate on Grand Total else on Net Amount
				const baseAmount = taxName.includes("TCS") ? grandTotal : totalNo;
				const taxAmount = (baseAmount * taxPer) / 100;
			      taxValueInput.value = taxAmount.toFixed(2); // Show result with 2 decimal places
			      updateTotalTax();
			      updateGrandTotal();
        }

        // Event listener to update tax percentage and value
        /*selectElement.addEventListener("change", function () {
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            taxInput.value = selectedOption.dataset.taxPer || "";
            updateTaxValue(); // Update tax value immediately after selection
        });*/
		selectElement.addEventListener("change", function () {
				    const selectedValue = selectElement.value;

				    // 🔴 Check duplicate
				   if (isDuplicateTax(selectedValue, "tax2add")) {
				        alert("This tax is already selected in another field!");

				        // Clear everything
				        selectElement.value = "";
				        taxInput.value = "";
				        taxValueInput.value = "";
				        return;
				    }

				    const selectedOption = selectElement.options[selectElement.selectedIndex];
				    taxInput.value = selectedOption.dataset.taxPer || "";
				    updateTaxValue();
				});

        // Recalculate tax value when totalNo changes
        totalNoInput.addEventListener("input", updateTaxValue);

    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

async function fetchtaxadd3() {
    try {
        const url = new URL(`/jssl/taxmasters/list`, baseUrl);
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch tax data");

        const json = await response.json();
        const taxData = json?.Data || [];

        const selectElement = document.getElementById("tax3add");
        const taxInput = document.getElementById("tax13");
        const taxValueInput = document.getElementById("tax3value");
        const totalNoInput = document.getElementById("totalNo"); // Total Amount Field

        if (!selectElement || !taxInput || !taxValueInput || !totalNoInput) {
            console.error("Some required elements not found.");
            return;
        }

        if (taxData.length === 0) {
            console.warn("No tax records found.");
            selectElement.innerHTML = `<option value="">No Tax Records Found</option>`;
            return;
        }

        selectElement.innerHTML = `<option value="">Select Tax</option>`;

        taxData.forEach((type) => {
            if (type.tax_id && type.tax_name && type.tax_per !== undefined) {
                const option = document.createElement("option");
                option.value = type.tax_id;
                option.dataset.taxPer = type.tax_per; // Store tax_per as a data attribute
                option.textContent = type.tax_name+ '-'+type.tax_per;
                selectElement.appendChild(option);
            }
        });

        // Function to calculate and update tax value
        function updateTaxValue() {
			const taxPer = parseFloat(taxInput.value) || 0;
			   /*   const totalNo = parseFloat(totalNoInput.value) || 0;
			      const taxAmount = (totalNo * taxPer) / 100;*/
				const selectedOption = selectElement.options[selectElement.selectedIndex];
				const taxName = (selectedOption.text || "").trim().toUpperCase();
				const totalNo = parseFloat(totalNoInput.value) || 0;
				const grandTotal = parseFloat(document.getElementById("grandTotal").value) || 0;
				// If TCS calculate on Grand Total else on Net Amount
				const baseAmount = taxName.includes("TCS") ? grandTotal : totalNo;
				const taxAmount = (baseAmount * taxPer) / 100;
			      taxValueInput.value = taxAmount.toFixed(2); // Show result with 2 decimal places
			      updateTotalTax();
			      updateGrandTotal();
        }

        // Event listener to update tax percentage and value
        /*selectElement.addEventListener("change", function () {
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            taxInput.value = selectedOption.dataset.taxPer || "";
            updateTaxValue(); // Update tax value immediately after selection
            updateGrandTotal();
        });*/
		selectElement.addEventListener("change", function () {
				    const selectedValue = selectElement.value;

				    // 🔴 Check duplicate
				    if (isDuplicateTax(selectedValue, "tax3add")) {
				        alert("This tax is already selected in another field!");

				        // Clear everything
				        selectElement.value = "";
				        taxInput.value = "";
				        taxValueInput.value = "";
				        return;
				    }

				    const selectedOption = selectElement.options[selectElement.selectedIndex];
				    taxInput.value = selectedOption.dataset.taxPer || "";
				    updateTaxValue();
				});

        // Recalculate tax value when totalNo changes
        totalNoInput.addEventListener("input", updateTaxValue);

    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

async function fetchSaleOrderCode() {
    try {
        const url = new URL(`/jssl/saleOrderEntry/getSaleOrderCode`, baseUrl);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // âœ… Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch Sale Order Code");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Sale_order_code) {
            console.warn("No Sale Order Code found.");
            return;
        }

        // Set the value of the input field with the Sale Order Code
        document.getElementById("saleOrderNo").value = json.Sale_order_code;

    } catch (error) {
        console.error("Error fetching Sale Order Code:", error);
    }
}

function openModalAdd() {
    var ordertype = document.getElementById('saleOrderTypeAdd').value.trim();
    var locationtype = document.getElementById('locationTypeAdd').value.trim();
    var orderto = document.getElementById('saleOrderTo').value.trim();
    var Auction = document.getElementById('Auctionadd').value.trim();
    var scraptype = document.getElementById('scrapType').value.trim();
    var scrapitem = document.getElementById('scrapItem').value.trim();
    var uomadd = document.getElementById('uom').value.trim();
    var qty = document.getElementById('qtyadd').value.trim();
    var kgadd = document.getElementById('kg').value.trim();
    var upriceadd = document.getElementById('uprice').value.trim();
    var tolerenceadd = document.getElementById('toleadd').value.trim();
    var acadd = document.getElementById('auctionDate').value.trim();
    var OdDuAdd = document.getElementById('durationDate').value.trim();
    var advancePayment = document.getElementById('advancePayment').value.trim();
    var billingadd = document.getElementById('billingadd').value.trim();
    var shippingadd = document.getElementById('shippingadd').value.trim();
    var businessUnitAddress = document.getElementById('businessUnitAddress').value.trim();
    //var tax1add = document.getElementById('tax1add').value.trim();
    //var tax2add = document.getElementById('tax2add').value.trim();
    //var tax3add = document.getElementById('tax3add').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (ordertype === '') {
        document.getElementById('productCodeError2').innerText = "Please select order type.";
        document.getElementById('productCodeError2').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError2').innerText = "";
        document.getElementById('productCodeError2').style.display = "none";
    }
    
    // Password Validation
    if (locationtype === '') {
        document.getElementById('productCodeError3').innerText = "Please select location type.";
        document.getElementById('productCodeError3').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError3').innerText = "";
        document.getElementById('productCodeError3').style.display = "none";
    }
    
    if (orderto === '') {
        document.getElementById('productCodeError4').innerText = "Please select order to.";
        document.getElementById('productCodeError4').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError4').innerText = "";
        document.getElementById('productCodeError4').style.display = "none";
    }
    
    if (Auction === '') {
        document.getElementById('productCodeError51').innerText = "Please enter Auction.";
        document.getElementById('productCodeError51').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError51').innerText = "";
        document.getElementById('productCodeError51').style.display = "none";
    }
    
    if (scraptype === '') {
        document.getElementById('productCodeError5').innerText = "Please select scrap type.";
        document.getElementById('productCodeError5').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError5').innerText = "";
        document.getElementById('productCodeError5').style.display = "none";
    }
    
    if (scrapitem === '') {
        document.getElementById('productCodeError6').innerText = "Please select scrap item.";
        document.getElementById('productCodeError6').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError6').innerText = "";
        document.getElementById('productCodeError6').style.display = "none";
    }
    
    if (uomadd === '') {
        document.getElementById('productCodeError7').innerText = "Please select uom.";
        document.getElementById('productCodeError7').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError7').innerText = "";
        document.getElementById('productCodeError7').style.display = "none";
    }
    
    if (qty === '') {
        document.getElementById('productCodeError8').innerText = "Please enter qty.";
        document.getElementById('productCodeError8').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError8').innerText = "";
        document.getElementById('productCodeError8').style.display = "none";
    }
    
    if (kgadd === '') {
        document.getElementById('productCodeError9').innerText = "Please enter kgs.";
        document.getElementById('productCodeError9').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError9').innerText = "";
        document.getElementById('productCodeError9').style.display = "none";
    }
    
    if (upriceadd === '') {
        document.getElementById('productCodeError10').innerText = "Please enter unit price.";
        document.getElementById('productCodeError10').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError10').innerText = "";
        document.getElementById('productCodeError10').style.display = "none";
    }
    
    if (tolerenceadd === '') {
        document.getElementById('productCodeError12').innerText = "Please enter tolerence.";
        document.getElementById('productCodeError12').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError12').innerText = "";
        document.getElementById('productCodeError12').style.display = "none";
    }
    
    if (acadd === '') {
        document.getElementById('productCodeError13').innerText = "Please enter Auction Date.";
        document.getElementById('productCodeError13').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError13').innerText = "";
        document.getElementById('productCodeError13').style.display = "none";
    }
    
    if (OdDuAdd === '') {
        document.getElementById('productCodeError14').innerText = "Please enter Sale Order Duration Date.";
        document.getElementById('productCodeError14').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError14').innerText = "";
        document.getElementById('productCodeError14').style.display = "none";
    }
    
    if (advancePayment === '') {
        document.getElementById('productCodeError15').innerText = "Please enter Advance Payment.";
        document.getElementById('productCodeError15').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError15').innerText = "";
        document.getElementById('productCodeError15').style.display = "none";
    }
    
    if (billingadd === '') {
        document.getElementById('productCodeError16').innerText = "Please select Billing Address.";
        document.getElementById('productCodeError16').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError16').innerText = "";
        document.getElementById('productCodeError16').style.display = "none";
    }
    
    if (shippingadd === '') {
        document.getElementById('productCodeError17').innerText = "Please select Shipping Address.";
        document.getElementById('productCodeError17').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError17').innerText = "";
        document.getElementById('productCodeError17').style.display = "none";
    }
    
    if (businessUnitAddress === '') {
        document.getElementById('productCodeError18').innerText = "Please select Business Unit Address.";
        document.getElementById('productCodeError18').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError18').innerText = "";
        document.getElementById('productCodeError18').style.display = "none";
    }
    
    /*if (tax1add === '') {
        document.getElementById('productCodeError19').innerText = "Please select tax.";
        document.getElementById('productCodeError19').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError19').innerText = "";
        document.getElementById('productCodeError19').style.display = "none";
    }*/
    
    /*if (tax2add === '') {
        document.getElementById('productCodeError20').innerText = "Please select tax.";
        document.getElementById('productCodeError20').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError20').innerText = "";
        document.getElementById('productCodeError20').style.display = "none";
    }*/
    
    /*if (tax3add === '') {
        document.getElementById('productCodeError21').innerText = "Please select tax.";
        document.getElementById('productCodeError21').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError21').innerText = "";
        document.getElementById('productCodeError21').style.display = "none";
    }*/
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

/*document.addEventListener("DOMContentLoaded", function () {
    function calculateTotal() {
        let kg = parseFloat(document.getElementById("kg").value) || 0;
        let uprice = parseFloat(document.getElementById("uprice").value) || 0;
        document.getElementById("toadd").value = (kg * uprice).toFixed(2);
        document.getElementById("totalNo").value = (kg * uprice).toFixed(2);
        document.getElementById("netAmount").value = (kg * uprice).toFixed(2);
    }

    // Attach event listeners to kg and uprice fields
    document.getElementById("kg").addEventListener("input", calculateTotal);
    document.getElementById("uprice").addEventListener("input", calculateTotal);
    
});*/

document.addEventListener("DOMContentLoaded", function () {

    function calculateTotal() {

        const uomSelect = document.getElementById("uom");
        const selectedText = uomSelect.options[uomSelect.selectedIndex].text.trim();

        let quantity = 0;

        if (selectedText.toUpperCase() === "NOS"|| selectedText=== "SQ MTS") {
            quantity = parseFloat(document.getElementById("qtyadd").value) || 0;
        } else {
            quantity = parseFloat(document.getElementById("kg").value) || 0;
        }

        const uprice = parseFloat(document.getElementById("uprice").value) || 0;

        const total = quantity * uprice;

        document.getElementById("toadd").value = total.toFixed(2);
        document.getElementById("totalNo").value = total.toFixed(2);
        document.getElementById("netAmount").value = total.toFixed(2);
    }

    // Attach event listeners
    document.getElementById("kg").addEventListener("input", calculateTotal);
    document.getElementById("qtyadd").addEventListener("input", calculateTotal);
    document.getElementById("uprice").addEventListener("input", calculateTotal);
    document.getElementById("uom").addEventListener("change", calculateTotal);

});

function updateTotalTax() {
    const tax1 = parseFloat(document.getElementById("tax1value").value) || 0;
    const tax2 = parseFloat(document.getElementById("tax2value").value) || 0;
    const tax3 = parseFloat(document.getElementById("tax3value").value) || 0;
    const totalTax = tax1 + tax2 + tax3;

    document.getElementById("totalTax").value = totalTax.toFixed(2); // Show result with 2 decimal places
}

function updateGrandTotal() {
    const totalTax = parseFloat(document.getElementById("totalTax").value) || 0;
    const netAmount = parseFloat(document.getElementById("netAmount").value) || 0;
    const total = totalTax + netAmount;
    document.getElementById("grandTotal").value = total.toFixed(2);
 }
 
 
 function addevent() {
	$('#exampleModalCenter66').modal('hide');
     // Create FormData object to hold the data
     const formData = new FormData();

     // Collect all textarea values and append them as individual fields
     const termsConditionsValues = Array.from(document.querySelectorAll("#myTable  tbody tr .textarea"))
         .map(textarea => textarea.value.trim())
         .filter(value => value !== "");

     termsConditionsValues.forEach((value) => {
         formData.append("termsConditions", value);  // Add each term condition to the formData object
     });

     // Append other form data
     formData.append("sale_order_type_id", saleOrderTypeAdd.value);
     formData.append("sale_order_code", saleOrderNo.value);
     formData.append("location_type_id", locationTypeAdd.value);
     formData.append("sale_order_to_id", saleOrderTo.value);
     formData.append("auction_date", auctionDate.value);
     formData.append("sale_order_duration", durationDate.value);
     formData.append("advance_payment", advancePayment.value);
     formData.append("billing_address_id", billingadd.value);
     formData.append("shipping_address_id", shippingadd.value);
     formData.append("business_unit_id", businessUnitAddress.value);
	 // Check if the input fields are empty, and append default value (0) if empty
	 formData.append("tax1", tax1add.value.trim() || "0"); // Default to 0 if empty
	 formData.append("tax1_value", tax1value.value.trim() || "0"); // Default to 0 if empty
	 formData.append("tax2", tax2add.value.trim() || "0"); // Default to 0 if empty
	 formData.append("tax2_value", tax2value.value.trim() || "0"); // Default to 0 if empty
	 formData.append("tax3", tax3add.value.trim() || "0"); // Default to 0 if empty
	 formData.append("tax3_value", tax3value.value.trim() || "0"); // Default to 0 if empty
     formData.append("net_amount", netAmount.value);
     formData.append("total_tax", totalTax.value);
     formData.append("grand_total", grandTotal.value);
     formData.append("created_by", createdById);
     formData.append("factory_id", selectedFactoryId);
     formData.append("auction_no", Auctionadd.value);
     formData.append("scrap_type_id", scrapType.value);
     formData.append("scrapitem_id", scrapItem.value);
     formData.append("uom_id", uom.value);
     formData.append("quantity", qtyadd.value);
     formData.append("kg", kg.value);
     formData.append("unit_price", uprice.value);
     formData.append("total", toadd.value);
     formData.append("tolerance", toleadd.value);
     // Log the form data before sending
     console.log("FormData to be Sent:", formData);

     // Send the data using AJAX with FormData
     $.ajax({
         url: new URL('/jssl/saleOrderEntry/addSaleOrderEntry', baseUrl),
         type: 'POST',
         xhrFields: { withCredentials: true },
         processData: false, // Important for FormData
         contentType: false, // Important for FormData
         data: formData,
         success: function(data) {
             if (data.message === "Success") {
                 const popup = $('<div class="popup">Sale Order Created Successfully!</div>')
                     .appendTo('body')
                     .hide()
                     .fadeIn(400);

                 setTimeout(function() {
                     popup.fadeOut(400, function() {
                         $(this).remove();
                         window.location = 'Scrap.jsp';
                     });
                 }, 800);
             } else {
                 alert(data.message || "Failed to create Sale Order.");
             }
         },
         error: function(xhr, status, error) {
             console.error("Request failed:", error);
             alert("An error occurred. Please try again.");
         }
     });
 }
 
 
async function printRecord(sale_order_code) {
	   // const allowed = window.allowedActions || [];
	if (!allowed.includes("Print")) {
	    alert(" You do not have permission to print.");
	    return;
	}
     try {
		
         const url = new URL(
             `/jssl/saleOrderEntry/getSaleOrderBasedOnIdNew?sale_order_code=${sale_order_code}`,
             baseUrl
         );

         const response = await fetch(url, {
             method: "GET",
             credentials: "include"
         });

         if (!response.ok) throw new Error("Failed to fetch data");

         const json = await response.json();
		 const orderDescriptionLevel = json.orderDescriptionLevel || {};
         const orderlevel = json.orderLevel || {};
         const orderitemlevel = json.orderItemLevel || [];
         const Grand_Total_value = json.Grand_Total_value || "";

         /* ================= BUILD SCRAP ROWS ================= */

         let scrapRows = "";
         let netAmount = 0;
         let sl = 1;

         orderitemlevel.forEach(item => {

             const qty = parseFloat(item.kg || 0);
             const unitPrice = parseFloat(item.unit_price || 0);
             const subTotal = qty * unitPrice;

             netAmount += subTotal;

             scrapRows += `
                 <tr>
                     <td>${sl++}</td>
                     <td>${item.auction_no || "-"}</td>
                     <td>${item.scrap_type || ""}</td>
                     <td>${item.scrapitemname || ""}</td>
                     <td>${item.unit_name || ""}</td>
                     <td style="text-align:right">${qty.toFixed(2)}</td>
                     <td style="text-align:right">${unitPrice.toLocaleString('en-IN', {					 minimumFractionDigits: 2,
					                     maximumFractionDigits: 2
					                 })}</td>
                     <td style="text-align:right">${subTotal.toLocaleString('en-IN', {
						minimumFractionDigits: 2,
						                    maximumFractionDigits: 2
						                })}</td>
                 </tr>
             `;
         });

         /* ================= TAX ROWS ================= */

         let taxRows = "";

         const tax1Val = parseFloat(orderlevel[0].tax1_value || 0);
         const tax2Val = parseFloat(orderlevel[0].tax2_value || 0);
         const tax3Val = parseFloat(orderlevel[0].tax3_value || 0);

         if (tax1Val > 0) {
             taxRows += `
                 <tr>
                     <td colspan="7" style="text-align:right">
                        ${orderlevel[0].taxname1} (${orderlevel[0].tax1_per}%)
                     </td>
                     <td style="text-align:right">
                         ${tax1Val.toLocaleString('en-IN', {
							minimumFractionDigits: 2,
							                    maximumFractionDigits: 2
						  })}
                     </td>
                 </tr>`;
         }

         if (tax2Val > 0) {
             taxRows += `
                 <tr>
                     <td colspan="7" style="text-align:right">
                       ${orderlevel[0].taxname2} (${orderlevel[0].tax2_per}%)
                     </td>
                     <td style="text-align:right">
                         ${tax2Val.toLocaleString('en-IN', {
							minimumFractionDigits: 2,
							                    maximumFractionDigits: 2
							                
						 })}
                     </td>
                 </tr>`;
         }

         if (tax3Val > 0) {
             taxRows += `
                 <tr>
                     <td colspan="7" style="text-align:right">
                        ${orderlevel[0].taxname3} (${orderlevel[0].tax3_per}%)
                     </td>
                     <td style="text-align:right">
                         ${tax3Val.toLocaleString('en-IN',{
							minimumFractionDigits: 2,
							                    maximumFractionDigits: 2
							                })}
                     </td>
                 </tr>`;
         }

         const grandTotal = parseFloat(orderlevel[0].grand_total|| 0);

         /* ================= TERMS ================= */

		 let termsHtml = "";

		 if (Array.isArray(orderDescriptionLevel)) {

		     orderDescriptionLevel.forEach((item, index) => {

		         if (item.terms_conditions && item.terms_conditions.trim() !== "") {
		             termsHtml += `${item.terms_conditions}<br>`;
		         }

		     });
		 }

		 /* ================= BUSINESS UNIT / FACTORY BLOCK =================
		    Bound dynamically from orderlevel[0] (BUSINESS_UNITS join in the
		    query) — NOT hardcoded per business unit id, and NOT read from
		    sessionStorage. Whatever business unit is attached to this sale
		    order is what gets printed.
		 */

		 const bu = orderlevel[0] || {};

		 // Strip any leading "JBU-<number>" style prefix (e.g. "JBU-4 ") from the business unit name
		 const cleanBusinessUnitName = (bu.business_unit_name || "JSW Severfield Structures Ltd")
		     .replace(/^JBU-?\s*\d+\s*/i, "")
		     .trim();

		 const factoryAddressLines = [
		     cleanBusinessUnitName,
		     bu.location || "",
		     bu.state_id ? `State Code: ${bu.state_id}` : "",
		     bu.country ? `Country: ${bu.country}` : "",
		     bu.gst_number ? `GSTIN : ${bu.gst_number}` : "",
		     bu.pan_number ? `PAN: ${bu.pan_number}` : ""
		 ].filter(line => line !== "");

		 const factoryHtml = factoryAddressLines.join("<br>");

         /* ================= HTML CONTENT ================= */
		 const isCancelled = orderlevel[0].cancel == "true";
		 const pdfContainer = document.createElement("div");
		 pdfContainer.style.width = "210mm";

		 pdfContainer.innerHTML = `
		 ${isCancelled ? `
		 <div style="
		     position:absolute;
		     top:50%;
		     left:50%;
		     transform:translate(-50%, -50%) rotate(-45deg);
		     font-size:100px;
		     font-weight:bold;
		     color:red;
		     opacity:0.15;
		     z-index:9999;
		     pointer-events:none;
		     white-space:nowrap;
		 ">
		     CANCELLED
		 </div>
		 ` : ''}
		 <div style="width:190mm; margin:8mm auto; font-family:Arial; font-size:11px; border:1px solid #000;">

		     <!-- HEADER -->
		     <div style="text-align:center; font-weight:bold; font-size:16px; margin-bottom:6px;">
		         SCRAP SALE ORDER
		     </div>

		     <div style="display:flex; border:1px solid #000; margin-bottom:6px;">
		         <div style="width:50%; padding:6px; border-right:1px solid #000;">
		             <img src="img/logo/download.png" style="height:45px;"><br>
		             ${factoryHtml}
		         </div>
		         <div style="width:50%; padding:6px;">
		             <b>Sale Order No:</b> ${orderlevel[0].sale_order_code || ""}<br>
		             <b>Auction Date:</b> ${formatDateDDMMYY(orderlevel[0].auction_date || "")}<br>
		             <b>Order Date:</b> ${formatDateDDMMYY(orderlevel[0].saleorderdate || "")}<br>
		             <b>Validity:</b> ${formatDateDDMMYY(orderlevel[0].sale_order_duration || "")}<br>
		             <b>Location:</b> ${orderlevel[0].location_name || ""}
		         </div>
		     </div>

		     <!-- BUYER BLOCK -->
		     <div style="border:1px solid #000; padding:6px; margin-bottom:6px;">
		         <b>Sale Order To:</b><br>
		         ${orderlevel[0].address || ""}
		     </div>

		     <!-- ITEM TABLE -->
		     <table style="width:100%; border-collapse:collapse;" border="1" cellpadding="4">
		         <thead style="background:#e6f0ff; font-weight:bold;">
		             <tr>
		                 <th>Sl</th>
		                 <th>E-Auction No</th>
		                 <th>Scrap Type</th>
		                 <th>Scrap Name</th>
		                 <th>UOM</th>
		                 <th style="text-align:right;">Kgs</th>
		                 <th style="text-align:right;">Unit Price</th>
		                 <th style="text-align:right;">Sub Total</th>
		             </tr>
		         </thead>
		         <tbody>
		             ${scrapRows}
		             <tr>
		                 <td colspan="7" style="text-align:right;"><b>Net Amount</b></td>
		                 <td style="text-align:right;"><b>${netAmount.toLocaleString('en-IN',{
		                     minimumFractionDigits: 2, maximumFractionDigits: 2
		                 })}</b></td>
		             </tr>
		             ${taxRows}
		             <tr>
		                 <td colspan="7" style="text-align:right; font-size:13px;"><b>Grand Total</b></td>
		                 <td style="text-align:right; font-size:13px;"><b>${grandTotal.toLocaleString('en-IN',{
		                     minimumFractionDigits: 2, maximumFractionDigits: 2
		                 })}</b></td>
		             </tr>
		         </tbody>
		     </table>

		     <!-- AMOUNT IN WORDS -->
		     <div style="margin-top:6px; border:1px solid #000; padding:5px;">
		         <b>Amount in Words:</b> ${Grand_Total_value}
		     </div>

		     <!-- TERMS -->
		     <div style="margin-top:6px; border:1px solid #000; padding:5px;">
		         <b>Terms & Conditions</b><br>
		         ${termsHtml}
		     </div>

		     <!-- FOOTER -->
		     <div style="margin-top:10px; padding:5px; text-align:right;">
		         For ${cleanBusinessUnitName}<br><br>
		         Authorized Signatory
		     </div>

		 </div>
		 `;

		       document.body.appendChild(pdfContainer);

			   const opt = {
			       margin: 0,
			       filename: `Sale_Order_${sale_order_code}.pdf`,
			       image: { type: 'jpeg', quality: 1 },
			       html2canvas: {
			           scale: 2,
			           useCORS: true,
			           scrollY: 0
			       },
			       jsPDF: {
			           unit: 'mm',
			           format: 'a4',
			           orientation: 'portrait'
			       },
			       pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
			   };


		       html2pdf()
		           .set(opt)
		           .from(pdfContainer)
		           .save()
		           .then(() => {
		               document.body.removeChild(pdfContainer);
		           });

		   } catch (error) {
		       console.error("PDF Error:", error);
		       alert("Error generating PDF");
		   }
 }



 function formatDateDDMMYY(dateString) {

     if (!dateString) return "";

     const date = new Date(dateString);

     if (isNaN(date)) return "";

     const day = String(date.getDate()).padStart(2, '0');
     const month = String(date.getMonth() + 1).padStart(2, '0');
     const year = String(date.getFullYear()).slice(-2);

     return `${day}-${month}-${year}`;
 }

 function openModalcancel(id) {
     // Open the modal
 	//  const allowed = window.allowedActions || [];

 	if (!allowed.includes("Cancel")) {
 	  alert(" You do not have permission to Cancel.");
 	  $('#exampleModalCenter16').modal('hide');
 	  return;
 	}
     $('#exampleModalCenter16').modal('show');

     // Store the id and pn_id in the modal's data attributes
     $('#exampleModalCenter16').attr('data-id', id);
 }

 function cancelRecord() {

     $('#exampleModalCenter16').modal('hide');

     var id = $('#exampleModalCenter16').attr('data-id');

     $.ajax({
         url: new URL('/jssl/saleorder/cancel', baseUrl),
         type: 'POST',
         dataType: 'json',
         xhrFields: {
             withCredentials: true
         },
         data: {
             id: id,
             cancelled_by: createdById
         },
		 success: function(data) {

		     if (data.message === "Success") {

		         const popup = $('<div class="popup">Sale Order Cancelled Successfully!</div>')
		             .appendTo('body')
		             .hide()
		             .fadeIn(400);
					 setTimeout(function() {
					                 popup.fadeOut(400, function() {
					                     $(this).remove();
					                     window.location = 'Scrap.jsp';
					                 });
					             }, 800);

		     } else {

		         alert(data.message);
		         // Output:
		         // "Can't cancel Sale Order. Transaction already done."
		     }
		 }
     });
 }

