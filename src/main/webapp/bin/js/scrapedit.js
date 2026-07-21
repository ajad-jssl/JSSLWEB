document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchSaleOrderTypesUP(selectedFactoryId);
        
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

async function fetchSaleOrderTypesUP() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/salesordertype/list`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.SalesOrderTypeDetails.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("saleOrderTypeAddup");

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
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchLocationTypesUP(selectedFactoryId);
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

async function fetchLocationTypesUP() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/scrapsalelocation/list`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.ListLocationTrack.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("locationTypeAddUP");

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
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchOrderToUP(selectedFactoryId);
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

async function fetchOrderToUP() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddressNew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.InvoiceAddress.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("saleOrderToup");

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
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchbillingup(selectedFactoryId);
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

/*async function fetchbillingup() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.ConsigneeAddress.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("billingaddup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select billing address</option>`;

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
}*/

async function fetchbillingup() {
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
        const selectElement = document.getElementById("billingaddup");

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
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchshippingup(selectedFactoryId);
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

/*async function fetchshippingup() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddressNew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.InvoiceAddress.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("shippingaddup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select shipping address</option>`;

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
}*/

async function fetchshippingup() {
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
        const selectElement = document.getElementById("shippingaddup");

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
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchbusunitup(selectedFactoryId);
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

async function fetchbusunitup() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);
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
        const selectElement = document.getElementById("businessUnitAddressup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select busnisess unit</option>`;

		// Populate dropdown options using SalesOrderTypeDetails array
				        json.Data.forEach((type) => {
				            if (type.business_unit_id && type.business_unit_name) { 
							let bindaddress1 = type.bu_code+'-'+type.business_unit_name +' '+type.orgName +',' +type.location+','+type.stateName +'('+type.gst_number +')';
        // Populate dropdown options using SalesOrderTypeDetails array
        /*json.Data.forEach((type) => {
            if (type.business_unit_id && type.business_unit_name) { // Ensure both values exist*/
                const option = document.createElement("option");
                option.value = type.business_unit_id; // Backend keeps saleorder_id
                option.textContent = bindaddress1; // Display saleorder_typename
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
        fetchscraptypeedit(selectedFactoryId);
        fetchscrapItemedit(selectedFactoryId);
        fetchuomedit(selectedFactoryId);
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

async function fetchscraptypeedit() {
    try {
        const url = new URL(`/jssl/scraptypes/list`, baseUrl);
      //  url.searchParams.append("factory_id", factoryId);
	  const response = await fetch(url,{
	  				           method: "GET",
	  				           credentials: "include"   // ✅ Always send JSESSIONID cookie
	  				       });

        if (!response.ok) throw new Error("Failed to fetch scrap types");

        const json = await response.json();
        console.log('Scrap types data:', json);  // Check if you are receiving the correct data

        if (json.status !== "yes" || !json.Lists || json.Lists.length === 0) {
            console.warn("No scrap types found.");
            return;
        }

        const selectElement = document.getElementById("scrapTypeup");
        selectElement.innerHTML = `<option value="">Select scrap type</option>`;

        json.Lists.forEach((type) => {
            if (type.stid && type.scrap_TypeName) {
                const option = document.createElement("option");
                option.value = type.stid;
                option.textContent = type.scrap_TypeName;
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching scrap types:", error);
    }
}

async function fetchscrapItemedit() {
    try {
        const url = new URL(`/jssl/scrapsalescrapitems/list`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);
	   const response = await fetch(url,{
	   				           method: "GET",
	   				           credentials: "include"   // ✅ Always send JSESSIONID cookie
	   				       });

        if (!response.ok) throw new Error("Failed to fetch scrap items");

        const json = await response.json();
        console.log('Scrap items data:', json);  // Check if you are receiving the correct data

        if (json.status !== "yes" || !json.ListScrapSaleScrapItems || json.ListScrapSaleScrapItems.length === 0) {
            console.warn("No scrap items found.");
            return;
        }

        const selectElement = document.getElementById("scrapItemup");
        selectElement.innerHTML = `<option value="">Select scrap item</option>`;

        json.ListScrapSaleScrapItems.forEach((item) => {
            if (item.stid && item.scrapitemname) {
                const option = document.createElement("option");
                option.value = item.stid;
                option.textContent = item.scrapitemname;
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching scrap items:", error);
    }
}

async function fetchuomedit() {
    try {
        const url = new URL(`/jssl/master/listunitmeasurementmasternew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);
	   const response = await fetch(url,{
	   				           method: "GET",
	   				           credentials: "include"   // ✅ Always send JSESSIONID cookie
	   				       });
        if (!response.ok) throw new Error("Failed to fetch UOM");

        const json = await response.json();
        console.log('UOM data:', json);  // Check if you are receiving the correct data

        if (json.status !== "yes" || !json.Data || json.Data.length === 0) {
            console.warn("No UOM data found.");
            return;
        }

        const selectElement = document.getElementById("uomup");
        selectElement.innerHTML = `<option value="">Select UOM</option>`;

        json.Data.forEach((type) => {
            if (type.unit_id && type.unit_name) {
                const option = document.createElement("option");
                option.value = type.unit_id;
                option.textContent = type.unit_name;
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching UOM data:", error);
    }
}

async function fetchTaxData(selectId, taxPercentId, taxValueId) {
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

        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = `<option value="">Select tax</option>`;

        const taxMap = {};
        json.Data.forEach(({ tax_id, tax_name, tax_per }) => {
            if (tax_id && tax_name) {
                taxMap[tax_id] = tax_per;
                const option = document.createElement("option");
                option.value = tax_id;
                option.textContent = tax_name;
                selectElement.appendChild(option);
            }
        });

        selectElement.addEventListener("change", () => {
            const selectedTaxId = selectElement.value;
            const taxPercent = selectedTaxId ? taxMap[selectedTaxId] || 0 : 0;
            const totalAmount = parseFloat(document.getElementById("toaddup").value) || 0;
            const taxValue = ((taxPercent / 100) * totalAmount).toFixed(2);

            document.getElementById(taxPercentId).value = taxPercent;
            document.getElementById(taxValueId).value = taxValue;

            calculateGrandTotal();
        });
    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

function calculateGrandTotal() {
    const netAmount = parseFloat(document.getElementById("netAmountup").value) || 0;
    const tax1 = parseFloat(document.getElementById("tax1valueup").value) || 0;
    const tax2 = parseFloat(document.getElementById("tax2valueup").value) || 0;
    const tax3 = parseFloat(document.getElementById("tax3valueup").value) || 0;

    const totalTax = tax1 + tax2 + tax3;
    document.getElementById("totalTaxup").value = totalTax.toFixed(2);
    document.getElementById("grandTotalup").value = (netAmount + totalTax).toFixed(2);
}

/*function calculateTotalEdit() {
    const kg = parseFloat(document.getElementById("kgup").value) || 0;
    const unitPrice = parseFloat(document.getElementById("upriceup").value) || 0;
    const total = kg * unitPrice;

    document.getElementById("toaddup").value = total.toFixed(2);
    document.getElementById("netAmountup").value = total.toFixed(2);

    calculateTaxes(total);
}*/

function calculateTotalEdit() {

    const uomSelect = document.getElementById("uomup");
    const selectedText = uomSelect.options[uomSelect.selectedIndex].text.trim();

    let quantity = 0;

    if (selectedText.toUpperCase() === "NOS"|| selectedText=== "SQ MTS") {
        quantity = parseFloat(document.getElementById("qtyaddup").value) || 0;
    } else {
        quantity = parseFloat(document.getElementById("kgup").value) || 0;
    }

    const unitPrice = parseFloat(document.getElementById("upriceup").value) || 0;

    const total = quantity * unitPrice;

    document.getElementById("toaddup").value = total.toFixed(2);
    document.getElementById("netAmountup").value = total.toFixed(2);

    calculateTaxes(total);
}

function calculateTaxes(total) {
    ["tax11up", "tax12up", "tax13up"].forEach((taxPercentId, index) => {
        const taxValueId = `tax${index + 1}valueup`;
        const taxPercent = parseFloat(document.getElementById(taxPercentId).value) || 0;
        document.getElementById(taxValueId).value = ((taxPercent / 100) * total).toFixed(2);
    });

    calculateGrandTotal();
}

function fetchtaxadd1up() {
    fetchTaxData("tax1addup", "tax11up", "tax1valueup");
}

function fetchtaxadd2up() {
    fetchTaxData("tax2addup", "tax12up", "tax2valueup");
}

function fetchtaxadd3up() {
    fetchTaxData("tax3addup", "tax13up", "tax3valueup");
}

document.addEventListener("DOMContentLoaded", function () {
    fetchtaxadd1up();
    fetchtaxadd2up();
    fetchtaxadd3up();

    document.getElementById("kgup").addEventListener("input", calculateTotalEdit);
    document.getElementById("upriceup").addEventListener("input", calculateTotalEdit);

    ["tax11up", "tax12up", "tax13up"].forEach((taxPercentId) => {
        document.getElementById(taxPercentId).addEventListener("input", () => {
            calculateTaxes(parseFloat(document.getElementById("toaddup").value) || 0);
        });
    });
});

function editRecord(sale_order_code) {
			  const allowed = window.allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const url = new URL(`/jssl/saleOrderEntry/getSaleOrderBasedOnIdNew`, baseUrl);
    var params = [['sale_order_code', sale_order_code]];
    url.search = new URLSearchParams(params).toString();

 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            // Handle order level data
            if (response.orderLevel && response.orderLevel.length > 0) {
                const order = response.orderLevel[0];

                // Assign values to respective input fields
                $('#locationTypeAddUP').val(order.location_type_id);
                $('#saleOrderTypeAddup').val(order.sale_order_type_id);
                $('#saleOrderToup').val(order.sale_order_to_id);
                $('#durationDateup').val(order.sale_order_duration);
                $('#advancePaymentup').val(order.advance_payment);
                $('#auctionDateup').val(order.auction_date);
                $('#billingaddup').val(order.billing_address_id);
                $('#shippingaddup').val(order.shipping_address_id);
                $('#businessUnitAddressup').val(order.business_unit_id);
                $('#tax1addup').val(order.tax1);
                $('#tax1valueup').val(order.tax1_value);
                $('#tax2addup').val(order.tax2);
                $('#tax2valueup').val(order.tax2_value);
                $('#tax3addup').val(order.tax3);
                $('#tax3valueup').val(order.tax3_value);
                $('#netAmountup').val(order.net_amount);
                $('#totalTaxup').val(order.total_tax);
                $('#grandTotalup').val(order.grand_total);
                $('#saleOrderNoUP').val(order.sale_order_code);
                $('#tax11up').val(order.tax1_per);
                $('#tax12up').val(order.tax2_per);
                $('#tax13up').val(order.tax3_per);
            }

            // Show modal
            $('#exampleModalScrollable123Update').modal('show');

            
            if (response.orderItemLevel && response.orderItemLevel.length > 0) {
	                 const item = response.orderItemLevel[0];
	                 $('#Auctionaddup').val(item.auction_no);
	                 $('#scrapTypeup').val(item.scrap_type_id);
	                 $('#scrapItemup').val(item.scrapitem_id);
	                 $('#uomup').val(item.uom_id);
	                 $('#qtyaddup').val(item.quantity);
	                 $('#kgup').val(item.kg);
	                 $('#upriceup').val(item.unit_price);
	                 $('#toaddup').val(item.total);
	                 $('#toleaddup').val(item.tolerance);
	                 $('#soeid').val(item.soe_id);
	                 $('#soeiid').val(item.soei_id);
	                 
                $('#saleOrderDetailsTableUP').show();
                
            } else {
                $('#saleOrderDetailsTableUP').hide();
            }

            // Populate Terms Table
            const termsTable = document.querySelector('#myTablup tbody');
            termsTable.innerHTML = ''; // Clear previous data
            let termsRows = '';

            if (response.orderDescriptionLevel && response.orderDescriptionLevel.length > 0) {
                response.orderDescriptionLevel.forEach((desc) => {
                    termsRows += `
                        <tr>
                            <td><textarea class="form-control textareaup">${desc.terms_conditions}</textarea></td>
                            <td style="display:none;"><input type="hidden" class="sl_no" value="${desc.sl_no}"></td>
                        </tr>
                    `;
                });
                termsTable.innerHTML = termsRows;
                $('#myTablup').show();
            } else {
                $('#myTablup').hide();
            }
        })
        .catch(error => {
            console.error('Error fetching sale order:', error);
            //alert('Failed to load sale order data.');
            $('#exampleModalScrollable123Update').modal('hide');
        });
}

function addNewRowup() {
    let tableBody = document.querySelector("#myTablup tbody");
    let newRow = document.createElement("tr");

    // Find the last existing sl_no value and increment it
    let lastSlNo = 0;
    let slNoInputs = tableBody.querySelectorAll(".sl_no");
    if (slNoInputs.length > 0) {
        lastSlNo = Math.max(...Array.from(slNoInputs).map(input => parseInt(input.value) || 0));
    }
    let newSlNo = lastSlNo + 1; // Increment sl_no

    newRow.innerHTML = `
        <td><textarea class="form-control textareaup"></textarea></td>
        <td style="display:none;"><input type="hidden" class="sl_no" value="${newSlNo}"></td>
    `;

    tableBody.appendChild(newRow);
}


// Function to collect Terms Conditions and SL Numbers before submitting
function collectTermsData() {
    const termsConditionsValues = [];
    const slNumbers = [];

    document.querySelectorAll("#myTablup tbody tr").forEach(row => {
        const textarea = row.querySelector(".textareaup");
        const slNoInput = row.querySelector(".sl_no");

        if (textarea && textarea.value.trim() !== "") {
            termsConditionsValues.push(textarea.value.trim());
            slNumbers.push(slNoInput ? slNoInput.value : "");  // Store SL numbers
        }
    });

    return {
        terms_conditions: termsConditionsValues.join(","), 
        sl_no: slNumbers.join(",") // Send SL numbers separately
    };
}

function openModalUpdate() {
    var ordertype = document.getElementById('saleOrderTypeAddup').value.trim();
    var locationtype = document.getElementById('locationTypeAddUP').value.trim();
    var orderto = document.getElementById('saleOrderToup').value.trim();
    var Auction = document.getElementById('Auctionaddup').value.trim();
    var scraptype = document.getElementById('scrapTypeup').value.trim();
    var scrapitem = document.getElementById('scrapItemup').value.trim();
    var uomadd = document.getElementById('uomup').value.trim();
    var qty = document.getElementById('qtyaddup').value.trim();
    var kgadd = document.getElementById('kgup').value.trim();
    var upriceadd = document.getElementById('upriceup').value.trim();
    var tolerenceadd = document.getElementById('toleaddup').value.trim();
    var acadd = document.getElementById('auctionDateup').value.trim();
    var OdDuAdd = document.getElementById('durationDateup').value.trim();
    var advancePayment = document.getElementById('advancePaymentup').value.trim();
    var billingadd = document.getElementById('billingaddup').value.trim();
    var shippingadd = document.getElementById('shippingaddup').value.trim();
    var businessUnitAddress = document.getElementById('businessUnitAddressup').value.trim();
    /*var tax1add = document.getElementById('tax1addup').value.trim();
    var tax2add = document.getElementById('tax2addup').value.trim();
    var tax3add = document.getElementById('tax3addup').value.trim();*/
    var showError = false; // Initialize showError variable

    // Username Validation
    if (ordertype === '') {
        document.getElementById('productCodeError2up').innerText = "Please select order type.";
        document.getElementById('productCodeError2up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError2up').innerText = "";
        document.getElementById('productCodeError2up').style.display = "none";
    }
    
    // Password Validation
    if (locationtype === '') {
        document.getElementById('productCodeError3up').innerText = "Please select location type.";
        document.getElementById('productCodeError3up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError3up').innerText = "";
        document.getElementById('productCodeError3up').style.display = "none";
    }
    
    if (orderto === '') {
        document.getElementById('productCodeError4up').innerText = "Please select order to.";
        document.getElementById('productCodeError4up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError4up').innerText = "";
        document.getElementById('productCodeError4up').style.display = "none";
    }
    
    if (Auction === '') {
        document.getElementById('productCodeError51up').innerText = "Please enter Auction.";
        document.getElementById('productCodeError51up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError51up').innerText = "";
        document.getElementById('productCodeError51up').style.display = "none";
    }
    
    if (scraptype === '') {
        document.getElementById('productCodeError5up').innerText = "Please select scrap type.";
        document.getElementById('productCodeError5up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError5up').innerText = "";
        document.getElementById('productCodeError5up').style.display = "none";
    }
    
    if (scrapitem === '') {
        document.getElementById('productCodeError6up').innerText = "Please select scrap item.";
        document.getElementById('productCodeError6up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError6up').innerText = "";
        document.getElementById('productCodeError6up').style.display = "none";
    }
    
    if (uomadd === '') {
        document.getElementById('productCodeError7up').innerText = "Please select uom.";
        document.getElementById('productCodeError7up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError7up').innerText = "";
        document.getElementById('productCodeError7up').style.display = "none";
    }
    
    if (qty === '') {
        document.getElementById('productCodeError8up').innerText = "Please enter qty.";
        document.getElementById('productCodeError8up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError8up').innerText = "";
        document.getElementById('productCodeError8up').style.display = "none";
    }
    
    if (kgadd === '') {
        document.getElementById('productCodeError9up').innerText = "Please enter kgs.";
        document.getElementById('productCodeError9up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError9up').innerText = "";
        document.getElementById('productCodeError9up').style.display = "none";
    }
    
    if (upriceadd === '') {
        document.getElementById('productCodeError10up').innerText = "Please enter unit price.";
        document.getElementById('productCodeError10up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError10up').innerText = "";
        document.getElementById('productCodeError10up').style.display = "none";
    }
    
    if (tolerenceadd === '') {
        document.getElementById('productCodeError12up').innerText = "Please enter tolerence.";
        document.getElementById('productCodeError12up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError12up').innerText = "";
        document.getElementById('productCodeError12up').style.display = "none";
    }
    
    if (acadd === '') {
        document.getElementById('productCodeError13up').innerText = "Please enter Auction Date.";
        document.getElementById('productCodeError13up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError13up').innerText = "";
        document.getElementById('productCodeError13up').style.display = "none";
    }
    
    if (OdDuAdd === '') {
        document.getElementById('productCodeError14up').innerText = "Please enter Sale Order Duration Date.";
        document.getElementById('productCodeError14up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError14up').innerText = "";
        document.getElementById('productCodeError14up').style.display = "none";
    }
    
    if (advancePayment === '') {
        document.getElementById('productCodeError15up').innerText = "Please enter Advance Payment.";
        document.getElementById('productCodeError15up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError15up').innerText = "";
        document.getElementById('productCodeError15up').style.display = "none";
    }
    
    if (billingadd === '') {
        document.getElementById('productCodeError16up').innerText = "Please select Billing Address.";
        document.getElementById('productCodeError16up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError16up').innerText = "";
        document.getElementById('productCodeError16up').style.display = "none";
    }
    
    if (shippingadd === '') {
        document.getElementById('productCodeError17up').innerText = "Please select Shipping Address.";
        document.getElementById('productCodeError17up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError17up').innerText = "";
        document.getElementById('productCodeError17up').style.display = "none";
    }
    
    if (businessUnitAddress === '') {
        document.getElementById('productCodeError18up').innerText = "Please select Business Unit Address.";
        document.getElementById('productCodeError18up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError18up').innerText = "";
        document.getElementById('productCodeError18up').style.display = "none";
    }
    
    /*if (tax1add === '') {
        document.getElementById('productCodeError19up').innerText = "Please select tax.";
        document.getElementById('productCodeError19up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError19up').innerText = "";
        document.getElementById('productCodeError19up').style.display = "none";
    }
    
    if (tax2add === '') {
        document.getElementById('productCodeError20up').innerText = "Please select tax.";
        document.getElementById('productCodeError20up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError20up').innerText = "";
        document.getElementById('productCodeError20up').style.display = "none";
    }
    
    if (tax3add === '') {
        document.getElementById('productCodeError21up').innerText = "Please select tax.";
        document.getElementById('productCodeError21up').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError21up').innerText = "";
        document.getElementById('productCodeError21up').style.display = "none";
    }*/
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66update').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function updateevent() {
	$('#exampleModalCenter66update').modal('hide');
	
	const tax1 = tax1addup.value;
	const tax2 = tax2addup.value;
	const tax3 = tax3addup.value;

	if (
	    (tax1 && (tax1 === tax2 || tax1 === tax3)) ||
	    (tax2 && (tax2 === tax3))
	) {
		alert("Duplicate tax not allowed");
	    return; // silently stop
	}
	// Extract "terms_conditions" values from all textareas
    const termsConditionsValues = Array.from(document.querySelectorAll("#myTablup tbody tr .textareaup"))
        .map(textarea => textarea.value.trim())
        .filter(value => value !== "")
        .join(",");

    // Extract "sl_no" values from hidden input fields
    const slNoValues = Array.from(document.querySelectorAll("#myTablup tbody tr .sl_no"))
        .map(input => input.value.trim()) // Extract from hidden input
        .filter(value => value !== "")
        .join(",");
        
       $.ajax({
        url: new URL('/jssl/saleOrderEntry/updateSaleOrderNew', baseUrl),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
        data: jQuery.param({sale_order_type_id: saleOrderTypeAddup.value,
        location_type_id: locationTypeAddUP.value,
        sale_order_to_id: saleOrderToup.value,
        auction_date: auctionDateup.value,
        sale_order_duration: durationDateup.value,
        advance_payment: advancePaymentup.value,
        billing_address_id: billingaddup.value,
        shipping_address_id: shippingaddup.value,
        business_unit_id: businessUnitAddressup.value,
        tax1: tax1addup.value,
        tax1_value: tax1valueup.value,
        tax2: tax2addup.value,
        tax2_value: tax2valueup.value,
        tax3: tax3addup.value,
        tax3_value: tax3valueup.value,
        net_amount: netAmountup.value,
        total_tax: totalTaxup.value,
        grand_total: grandTotalup.value,
        sale_order_code:saleOrderNoUP.value,
        soe_id:soeid.value,
        modified_by: createdById,
        auction_no: Auctionaddup.value,
        scrap_type_id: scrapTypeup.value,
        scrapitem_id: scrapItemup.value,
        uom_id: uomup.value,
        soei_id:soeiid.value,
        quantity: qtyaddup.value,
        kg: kgup.value,
        unit_price: upriceup.value,
        total: toaddup.value,
        tolerance: toleaddup.value,
        terms_conditions:termsConditionsValues,
        sl_no:slNoValues 
        }), // Convert to URL-encoded format
        success: function (data) {
            var result = data.message;

             if (result && result.toLowerCase().includes("success")) {
                const popup = $('<div class="popup">Sale Order Updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'Scrap.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create invoice.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
            }
        },
        error: function () {
            console.error('Request failed.');
        }
    });
}

document.getElementById("tax1addup").addEventListener("change", function () {

    const selectElement = this;
    const taxInput = document.getElementById("tax11up");
    const taxValueInput = document.getElementById("tax1valueup");

    const selectedValue = selectElement.value;

    // 🔴 Duplicate check
    if (isDuplicateTaxUpdate(selectedValue, "tax1addup")) {
        alert("This tax is already selected in another field!");

        // Clear everything
        selectElement.value = "";
        taxInput.value = "";
        taxValueInput.value = "";
        return;
    }

    const selectedOption = selectElement.options[selectElement.selectedIndex];
    taxInput.value = selectedOption.dataset.taxPer || "";
    updateTaxValue(); // your existing function
});

document.getElementById("tax2addup").addEventListener("change", function () {

    const selectElement = this;
    const taxInput = document.getElementById("tax12up");
    const taxValueInput = document.getElementById("tax2valueup");

    const selectedValue = selectElement.value;

    if (isDuplicateTaxUpdate(selectedValue, "tax2addup")) {
        alert("This tax is already selected in another field!");

        selectElement.value = "";
        taxInput.value = "";
        taxValueInput.value = "";
        return;
    }

    const selectedOption = selectElement.options[selectElement.selectedIndex];
    taxInput.value = selectedOption.dataset.taxPer || "";
    updateTaxValue();
});

document.getElementById("tax3addup").addEventListener("change", function () {

    const selectElement = this;
    const taxInput = document.getElementById("tax13up");
    const taxValueInput = document.getElementById("tax3valueup");

    const selectedValue = selectElement.value;

    if (isDuplicateTaxUpdate(selectedValue, "tax3addup")) {
        alert("This tax is already selected in another field!");

        selectElement.value = "";
        taxInput.value = "";
        taxValueInput.value = "";
        return;
    }

    const selectedOption = selectElement.options[selectElement.selectedIndex];
    taxInput.value = selectedOption.dataset.taxPer || "";
    updateTaxValue();
});