let allowed = null;



document.getElementById("modalScroll1").addEventListener("click", function () {
    // show custom message instead of opening modal
	 // const allowed = window.allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable').modal('hide');
	  return;
	}
	$('#exampleModalScrollable').modal('show');
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
    const selectedFactoryId = localStorage.getItem("selectedFactoryId");
    fetchLoad(selectedFactoryId);
    fetchtaxadd1();
    fetchtaxadd2();
    fetchtaxadd3();
    fetchinvoice();
    fetchSalebusunit(selectedFactoryId);
    fetchinvoiceto();
    fetchconname();
    fetchShipping();
    fetchdelivery();
    fetchSalebank();
    fetchSalework();
    fetchorg1();
    fetchservice();
    fetchhsn();
    fetchexptitle();
    fetchBgType();
    fetchBgType1();
    fetchUserList111(selectedFactoryId)
    fetchtaxadd1up();
    fetchtaxadd2up();
    fetchtaxadd3up();
    fetchinvoice1();
});

function fetchtaxadd1up() {
    fetchTaxData("tax1addupp", "tax11upp", "tax1valueupp");
}

function fetchtaxadd2up() {
    fetchTaxData("tax2addupp", "tax12upp", "tax2valueupp");
}

function fetchtaxadd3up() {
    fetchTaxData("tax3addupp", "tax13upp", "tax3valueupp");
}

async function fetchTaxData(selectId, taxPercentId, taxValueId) {
    try {
        const url = new URL(`/jssl/taxmasters/list`, baseUrl);
        const response = await fetch(url, {
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
            const totalAmount = parseFloat(document.getElementById("netAmountupp").value) || 0;
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
    const netAmount = parseFloat(document.getElementById("netAmountupp").value) || 0;
    const tax1 = parseFloat(document.getElementById("tax1valueupp").value) || 0;
    const tax2 = parseFloat(document.getElementById("tax2valueupp").value) || 0;
    const tax3 = parseFloat(document.getElementById("tax3valueupp").value) || 0;

    const totalTax = tax1 + tax2 + tax3;
    document.getElementById("totalTaxupp").value = totalTax.toFixed(2);
    document.getElementById("grandTotalupp").value = (netAmount + totalTax).toFixed(2);
}

// Fetch the load list based on factoryId and selected contractorId (con_id)
async function fetchLoad(factoryId) {
    try {
        const url = new URL(`/jssl/othersinvoice/getLoadListForTheContractor`, baseUrl1);
        url.searchParams.append("factory_id", factoryId);
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch loads");

        const json = await response.json();

        if (json.status !== "yes" || !json.DATA.length) {
            selectElement.innerHTML = `<option value="">Select load</option>`;
            console.warn("No loads found.");
            return;
        }

        const selectElement = document.getElementById("load");
        selectElement.innerHTML = `<option value="">Select load</option>`;

        json.DATA.forEach((type) => {
            if (type.other_Pn_no) {
                const option = document.createElement("option");
                option.value = type.other_Pn_no;
                option.textContent = type.other_Pn_no;
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching loads:", error);
    }
}

document.getElementById("load").addEventListener("change", function() {
    document.getElementById("inputFieldsContainer").style.display = "block"; // Show the input fields container
    const selectedload = document.getElementById("load");
    load = selectedload.value;
    fetchQsPackingData(load);
});


async function fetchQsPackingData(loadId) {
    try {
        const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get the factory_id from localStorage

        // Ensure factory_id is available
        if (!selectedFactoryId) {
            console.error("No factory ID found in localStorage.");
            return;
        }

        const url = new URL(`/jssl/invoice/getotherspackingdetailsnew`, baseUrl);

        // Append the parameters to the URL
        url.searchParams.append("load_id", loadId);
        url.searchParams.append("factory_id", selectedFactoryId); // Append factory_id as well

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch QsPacking data");

        const json = await response.json();


        if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {
            const QsPacking = json.QsPacking_Data[0];

            const freightValue = QsPacking.freight; // Assuming the bank details ID is inside this property
            const frie = document.getElementById("freight");
            if (frie) {
                frie.value = freightValue; // Populate the bank name field
            }

            const pnidValue = QsPacking.OtherPnId; // Assuming the bank details ID is inside this property
            const pnid = document.getElementById("id11");
            if (pnid) {
                pnid.value = pnidValue; // Populate the bank name field
            }

        } else {
            console.warn("No qspacking Data found.");
        }
        // Check if QsPacking_Data exists and contains items
        if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {
            const container = document.querySelector(".dynamic-row"); // Find the container for dynamic rows
            container.innerHTML = ""; // Clear any existing rows
            let grandTotal = 0; // 🔹 Initialize sum
            // Loop through QsPacking_Data and create input fields dynamically
            json.QsPacking_Data.forEach((item, index) => {
                const showLabel = index === 0;
                const div = document.createElement("div");
                div.classList.add("form-group-container", "col-md-12"); // Add classes to style the row

                // Make sure total is numeric before adding
                const rowTotal = parseFloat(item.total) || 0;
                grandTotal += rowTotal; // 🔹 Add to running sum

                // Create fields dynamically based on the data
                div.innerHTML = `
                       <div class="form-row">
					   
                           <div class="col-auto">
                                ${showLabel ? '<label><b>UOM</b></label>' : ''}
                               <input type="text" id="uom_${index}" value="${item.uom_name}" class="form-control form-control-sm small-input" disabled>
                           </div>
						   <div class="col-auto">
                                ${showLabel ? '<label><b>Quantity</b></label>' : ''}
                               <input type="number" id="qty_${index}" value="${item.quantities}" class="form-control form-control-sm small-input text-right" disabled>
                           </div>
						   
						   <div class="col-auto">
                                ${showLabel ? '<label><b>Kg</b></label>' : ''}
                               <input type="number" id="kg_${index}" value="${item.kgs}" class="form-control form-control-sm small-input text-right" disabled>
                           </div>
						   
						   <div class="col-auto">
                               ${showLabel ? '<label><b>Unit Price</b></label>' : ''}
                               <input type="number" id="unit_price_${index}" value="${item.unitPrice}" class="form-control form-control-sm small-input text-right" disabled>
                           </div>
						   
						   <div class="col-auto">
                              ${showLabel ? '<label><b>Total</b></label>' : ''}
                               <input type="number" id="total_${index}" value="${item.total}" class="form-control form-control-sm small-input text-right" disabled>
                           </div>
						   
						   <div class="col-auto">
                               ${showLabel ? '<label><b>Invoice Type</b></label>' : ''}
                               <input type="text" id="intype_${index}" value="${item.scrapNameTypeId}" class="form-control form-control-sm small-input" disabled>
                           </div>
                           
                     </div>
					 
					 ${showLabel ? '<hr>' : ''}
                   `;

                container.appendChild(div); // Append the new dynamic row
                // 🔹 After loop, show the grand total in a textbox
                const grandTotalBox = document.getElementById("grandTotal");
                if (grandTotalBox) {
                    grandTotalBox.value = grandTotal.toFixed(2); // 2 decimals
                    netAmountup.value = grandTotal.toFixed(2);
                }
            });
        } else {
            console.warn("No QsPacking data found.");
        }
        // Now, handle tax data and append it to .dynamic-row1
        if (json.tax && json.tax.length > 0) {
            const taxContainer = document.querySelector(".dynamic-row1"); // Find the container for dynamic tax rows
            taxContainer.innerHTML = ""; // Clear any existing rows

            // Loop through tax data and create dynamic rows
            json.tax.forEach((tax, taxIndex) => {
                const div = document.createElement("div");
                div.classList.add("form-group", "col-md-12"); // Add classes to style the tax row

                // Create fields dynamically based on tax data
                div.innerHTML = `
                       <div class="form-row">
                           <div class="form-group col-md-3 col-sm-12">
                               <label for="tax_name_${taxIndex}"><b>Tax Name</b></label>
                               <input type="text" id="tax_name_${taxIndex}" value="${tax.tax_name}" class="form-group col-md-8 col-sm-12" disabled>
                           </div>
                           <div class="form-group col-md-3 col-sm-12">
                               <label for="tax_per_${taxIndex}"><b>Tax Percentage</b></label>
                               <input type="text" id="tax_per_${taxIndex}" value="${tax.tax_per}" class="form-group col-md-8 col-sm-12" disabled>
                           </div>
                           <div class="form-group col-md-3 col-sm-12">
                               <label for="tax_per_${taxIndex}"><b>Tax Value</b></label>
                               <input type="text" id="tax_per_${taxIndex}" value="${tax.tax_value}" class="form-group col-md-8 col-sm-12" disabled>
                           </div>
                       </div>
                   `;

                taxContainer.appendChild(div); // Append the new dynamic tax row
            });
        } else {
            console.warn("No tax data found.");
        }
    } catch (error) {
        console.error("Error fetching QsPacking data:", error);
    }
}

async function fetchtaxadd1() {
    try {
        const url = new URL(`/jssl/taxmasters/list`, baseUrl);
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch tax data");

        const json = await response.json();
        const taxData = json?.Data || [];

        const selectElement = document.getElementById("tax1addup");
        const taxInput = document.getElementById("tax11up");
        const taxValueInput = document.getElementById("tax1valueup");
        const totalNoInput = document.getElementById("grandTotal"); // Total Amount Field

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
                option.textContent = type.tax_name;
                selectElement.appendChild(option);
            }
        });

        // Function to calculate and update tax value
        function updateTaxValue() {
            const taxPer = parseFloat(taxInput.value) || 0;
            const totalNo = parseFloat(totalNoInput.value) || 0;
            const taxAmount = (totalNo * taxPer) / 100;
            taxValueInput.value = taxAmount.toFixed(2); // Show result with 2 decimal places
            updateTotalTax();
            updateGrandTotal();
        }

        // Event listener to update tax percentage and value
        selectElement.addEventListener("change", function() {
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            taxInput.value = selectedOption.dataset.taxPer || "";
            updateTaxValue(); // Update tax value immediately after selection
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
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch tax data");

        const json = await response.json();
        const taxData = json?.Data || [];

        const selectElement = document.getElementById("tax2addup");
        const taxInput = document.getElementById("tax12up");
        const taxValueInput = document.getElementById("tax2valueup");
        const totalNoInput = document.getElementById("grandTotal"); // Total Amount Field

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
                option.textContent = type.tax_name;
                selectElement.appendChild(option);
            }
        });

        // Function to calculate and update tax value
        function updateTaxValue() {
            const taxPer = parseFloat(taxInput.value) || 0;
            const totalNo = parseFloat(totalNoInput.value) || 0;
            const taxAmount = (totalNo * taxPer) / 100;
            taxValueInput.value = taxAmount.toFixed(2); // Show result with 2 decimal places
            updateTotalTax();
            updateGrandTotal();
        }

        // Event listener to update tax percentage and value
        selectElement.addEventListener("change", function() {
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            taxInput.value = selectedOption.dataset.taxPer || "";
            updateTaxValue(); // Update tax value immediately after selection
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
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch tax data");

        const json = await response.json();
        const taxData = json?.Data || [];

        const selectElement = document.getElementById("tax3addup");
        const taxInput = document.getElementById("tax13up");
        const taxValueInput = document.getElementById("tax3valueup");
        const totalNoInput = document.getElementById("grandTotal"); // Total Amount Field

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
                option.textContent = type.tax_name;
                selectElement.appendChild(option);
            }
        });

        // Function to calculate and update tax value
        function updateTaxValue() {
            const taxPer = parseFloat(taxInput.value) || 0;
            const totalNo = parseFloat(totalNoInput.value) || 0;
            const taxAmount = (totalNo * taxPer) / 100;
            taxValueInput.value = taxAmount.toFixed(2); // Show result with 2 decimal places
            updateTotalTax();
        }

        // Event listener to update tax percentage and value
        selectElement.addEventListener("change", function() {
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            taxInput.value = selectedOption.dataset.taxPer || "";
            updateTaxValue(); // Update tax value immediately after selection
            updateGrandTotal();
        });

        // Recalculate tax value when totalNo changes
        totalNoInput.addEventListener("input", updateTaxValue);

    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

function updateTotalTax() {
    const tax1 = parseFloat(document.getElementById("tax1valueup").value) || 0;
    const tax2 = parseFloat(document.getElementById("tax2valueup").value) || 0;
    const tax3 = parseFloat(document.getElementById("tax3addup").value) || 0;
    const totalTax = tax1 + tax2 + tax3;

    document.getElementById("totalTaxup").value = totalTax.toFixed(2); // Show result with 2 decimal places
}

function updateGrandTotal() {
    const totalTax = parseFloat(document.getElementById("totalTaxup").value) || 0;
    const netAmount = parseFloat(document.getElementById("netAmountup").value) || 0;
    const total = totalTax + netAmount;
    document.getElementById("grandTotalup").value = total.toFixed(2);
}

async function fetchinvoice() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
        const response = await fetch(url, {
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
        const selectElement = document.getElementById("intype444");

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

async function fetchinvoice1() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
        const response = await fetch(url, {
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
        const selectElement = document.getElementById("intypeeditup");

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
async function fetchSalebusunit() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);
        // url.searchParams.append("factory_id", factoryId);

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
        const selectElement = document.getElementById("inbusunit");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Business Unit</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.business_unit_id && type.business_unit_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.business_unit_id; // Backend keeps saleorder_id
                option.textContent = type.business_unit_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchinvoiceto() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddress`, baseUrl);
        //  url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
        const response = await fetch(url, {
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
        const selectElement = document.getElementById("ininto");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select invoice to</option>`;

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
async function fetchconname() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl);
        // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
        const response = await fetch(url, {
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
        const selectElement = document.getElementById("billing");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select</option>`;

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
async function fetchShipping() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/master/listshipmentdeliverynew`, baseUrl);
        // url.searchParams.append("factory_id", factoryId);

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
        const selectElement = document.getElementById("shipmode");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select shipment mode</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.si_id && type.shipment_mode) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.si_id; // Backend keeps saleorder_id
                option.textContent = type.shipment_mode; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchdelivery() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/master/listshipmentdeliverynew`, baseUrl);
        // url.searchParams.append("factory_id", factoryId);

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
        const selectElement = document.getElementById("delivery");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select delivery condition</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.si_id && type.delivery_condition) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.si_id; // Backend keeps saleorder_id
                option.textContent = type.delivery_condition; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchSalebank() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/contract/listbanknamenew`, baseUrl);
        // url.searchParams.append("factory_id", factoryId);

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
        const selectElement = document.getElementById("bank");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select bank</option>`;

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

async function fetchSalework() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/contract/listworkordernew`, baseUrl);
        // url.searchParams.append("factory_id", factoryId);

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
        const selectElement = document.getElementById("work");

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

async function fetchorg1() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/organization/listorganization`, baseUrl);
        // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
        const response = await fetch(url, {
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
        const selectElement = document.getElementById("office");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.org_id && type.org_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.org_id; // Backend keeps saleorder_id
                option.textContent = type.org_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchservice() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

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
        const selectElement = document.getElementById("officeservice");

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

async function fetchhsn() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

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
        const selectElement = document.getElementById("officehsn");

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

async function fetchexptitle() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/master/allExportTitleList`, baseUrl);

        // Fetch data from API
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.ExportTitleDetails.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("extitle");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.ExportTitleDetails.forEach((type) => {
            if (type.id && type.export_title) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.export_title; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}
document.getElementById("expt").addEventListener("change", function() {
    const expo = document.getElementById("expt");
    const selectedexpo = expo.value;
    if (selectedexpo === 'yes') {
        $('#exportFields').show();
    } else {
        $('#exportFields').hide();
    }
});

async function fetchBgType1() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/master/listbgtypenew`, baseUrl);

        // Fetch data from API
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.BGTYPE.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("bgvaerifyup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select BG type</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.BGTYPE.forEach((type) => {
            if (type.bgid && type.description) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.bgid; // Backend keeps saleorder_id
                option.textContent = type.description; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchBgType() {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/master/listbgtypenew`, baseUrl);

        // Fetch data from API
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.BGTYPE.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("bg");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select BG type</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.BGTYPE.forEach((type) => {
            if (type.bgid && type.description) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.bgid; // Backend keeps saleorder_id
                option.textContent = type.description; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}
function openModalAdd() {


    var username = document.getElementById('intype444').value.trim();
    var bussunit = document.getElementById('inbusunit').value.trim();
    var invoiceto = document.getElementById('ininto').value.trim();
    var shipmode = document.getElementById('shipmode').value.trim();
    var workorder = document.getElementById('work').value.trim();
    var expo = document.getElementById('expt').value.trim();
    var taxres = document.getElementById('taxres').value.trim();
    var percen = document.getElementById('percen').value.trim();
    var consignee = document.getElementById('billing').value.trim();
    var bank = document.getElementById('bank').value.trim();
    var deliv = document.getElementById('delivery').value.trim();
    var regoffice = document.getElementById('office').value.trim();
    var sercode = document.getElementById('officeservice').value.trim();
    var hsncode = document.getElementById('officehsn').value.trim();
    var prodes = document.getElementById('prodes').value.trim();
    var prodesc = document.getElementById('prodesc').value.trim();
    var remark = document.getElementById('remark').value.trim();

    var showError = false; // Initialize showError variable

    // Helper function
    function validateField(value, errorId, message) {
        if (value === '') {
            document.getElementById(errorId).innerText = message;
            document.getElementById(errorId).style.display = "inline-block";
            showError = true;
        } else {
            document.getElementById(errorId).innerText = "";
            document.getElementById(errorId).style.display = "none";
        }
    }

    // Validation rules
    validateField(username, "Vehicleerror", "Please select invoice type.");
    validateField(bussunit, "inbusunitError", "Please select business unit.");
    validateField(invoiceto, "inintoError", "Please select invoice to.");
    validateField(shipmode, "shipmodeError", "Please select shipment mode.");
    validateField(workorder, "workError", "Please select work order.");
    validateField(expo, "exptError", "Please select export option.");
    validateField(taxres, "taxresError", "Please select tax reverse charge option.");
    validateField(percen, "percenError", "Please enter percentage.");
    validateField(consignee, "billingError", "Please select consignee.");
    validateField(bank, "bankError", "Please select bank.");
    validateField(deliv, "deliveryError", "Please select delivery condition.");
    validateField(regoffice, "officeError", "Please select registered office.");
    validateField(sercode, "officeserviceError", "Please select service code.");
    validateField(hsncode, "officehsnError", "Please select HSN code.");
    validateField(prodesc, "prodescError", "Please enter product description.");
    validateField(remark, "productCodeError4", "Please enter remarks.");

    // Extra check (prodes - since you had it separately)
    validateField(prodes, "productCodeError3", "Please enter product description.");

    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66').modal('show'); // Show the next modal
    }
}

// Fetch selectedFactoryId from localStorage
const selectedFactoryId = localStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

function addevent() {
    // Validate role code and role description
    const selectedloadid = document.getElementById("load").selectedOptions[0]; // Get the selected option

    const loadname = selectedloadid ? selectedloadid.textContent : ''; // Get the contract_name

    $.ajax({
        url: new URL('/jssl/invoice/addnewothers', baseUrl),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        dataType: 'json',
        data: jQuery.param({
            con_id: "Others",
            load_id: loadname,
            grand_total: grandTotalup.value,
            export: expt.value,
            tax1: tax1addup.value,
            tax1_per: tax11up.value,
            tax1_value: tax1valueup.value,
            tax2: tax2addup.value,
            tax2_per: tax12up.value,
            tax2_value: tax2valueup.value,
            tax3: tax3addup.value,
            tax3_per: tax13up.value,
            tax3_value: tax3valueup.value,
            total_tax: totalTaxup.value,
            net_amount: netAmountup.value,
            invoice_remarks_id: intype444.value,
            business_unit_id: inbusunit.value,
            invoice_to_id: ininto.value,
            ship_mode_id: shipmode.value,
            workorder_id: work.value,
            area_number: are.value,
            lot_number: lut.value,
            container_name: connum.value,
            epcg_license: epog.value,
            export_title_text_id: extitle.value,
            tax_onpayable_rev: taxres.value,
            percentage: percen.value,
            consignee_id: billing.value,
            bank_id: bank.value,
            deliverycondition_id: delivery.value,
            registered_office_id: office.value,
            servicecode_id: officeservice.value,
            hsncode_id: officehsn.value,
            prod_desc: prodesc.value,
            con_slno: id11con.value,
            product_desc: prodes.value,
            remarks: remark.value,
            date_of_notification: date.value,
            date_val: date1.value,
            bg_type: bg.value,
            date_of_issue: dissue.value,
            reference_no: ref.value,
            lc_number: lc.value,
            supply_place: sup.value,
            s_t_exempted: exe.value,
            lr_docketno: dock.value,
            bg_no: bgno.value,
            date_of_expiry: dateexp.value,
            date_of_ref: dateref.value,
            lc_issue_date: lcdate.value,
            created_by: createdById,
            factory_id: selectedFactoryId
        }),
        success: function(data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">other Invoice Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'OtherInvoiceEntry.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create invoice.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
                $('#exampleModalCenter66').modal('hide');
                $('#exampleModalScrollable').modal('hide');
            }
        },
        error: function() {
            console.error('Request failed.');
        }
    });
}

function setInputValue(selector, value) {
    $(selector).val(value ? value : ""); // Set value or empty string if undefined/null
}

let currentFactoryIdOthersInvoice = null;

function fetchUserList111(selectedFactoryId) {

    currentFactoryIdOthersInvoice = selectedFactoryId || localStorage.getItem("selectedFactoryId");

    // 🔥 Destroy existing DataTable
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
                action: function() {
                    const url = new URL(`/jssl/invoice/otherslistnewpaged`, baseUrl);
                    url.searchParams.append('factory_id', currentFactoryIdOthersInvoice);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(res => res.json())
                        .then(json => {

                            /*const formatDate = (dateStr) => {
                                if (!dateStr) return '';
                                const d = new Date(dateStr);
                                return isNaN(d) ? dateStr : d.toLocaleDateString("en-GB").replace(/\//g, '-');
                            };*/
							const formatDate = (dateStr) => {
							    if (!dateStr) return '';

							    // Handle dd-MM-yyyy format
							    const parts = dateStr.split('-');
							    if (parts.length === 3) {
							        const d = new Date(parts[2], parts[1] - 1, parts[0]);
							        return isNaN(d) ? '' : d.toLocaleDateString("en-GB").replace(/\//g, '-');
							    }

							    return '';
							};

                            const exportData = json.Data.map(item => [
                                item.con_id || '',
                                item.load_id || '',
                                item.invoice_number || '',
                                formatDate(item.created_onlydate),
                                item.status || ''
                            ]);

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>Contract Name</th>',
                                        '<th>Lot Number</th>',
                                        '<th>Invoice Number</th>',
                                        '<th>Invoice Date</th>',
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
                                buttons: [{ extend: 'excelHtml5', title: 'Others Invoice List' }]
                            }).button(0).trigger();

                            setTimeout(() => {
                                $(tempTable).DataTable().destroy();
                                $(tempTable).remove();
                            }, 1000);

                        }).catch(err => console.error('Export error:', err));
                }
            }
        ],
        columns: [
            { title: "Contract Name" },
            { title: "Lot Number" },
            { title: "Invoice Number" },
            { title: "Invoice Date" },
            { title: "Status" },
            { title: "pnid", visible: false },
            { title: "Edit", orderable: false },
            { title: "Verify", orderable: false },
            { title: "View", orderable: false },
            { title: "Release", orderable: false },
            { title: "Cancel", orderable: false },
            { title: "Print", orderable: false }
        ],
        ajax: function(data, callback, settings) {
            const page = data.start / data.length;
            const size = data.length;
			const searchValue = data.search.value;
		

            const url = new URL(`/jssl/invoice/otherslistnewpaged`, baseUrl);
            url.searchParams.append('factory_id', currentFactoryIdOthersInvoice);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
			url.searchParams.append('search', searchValue);
            fetch(url, { credentials: "include" })
                .then(res => res.json())
                .then(json => {
                    if (!json.Data || json.status === 'error') {
                        callback({ draw: data.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
                        return;
                    }

                    //const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-GB").replace(/\//g, '-') : '';
					const formatDate = (dateStr) => {
					    if (!dateStr) return '';

					    // Handle dd-MM-yyyy format
					    const parts = dateStr.split('-');
					    if (parts.length === 3) {
					        const d = new Date(parts[2], parts[1] - 1, parts[0]);
					        return isNaN(d) ? '' : d.toLocaleDateString("en-GB").replace(/\//g, '-');
					    }

					    return '';
					};

                    const rows = json.Data.map(item => {

                        // Edit, Verify, Release, Cancel, Print icons
                        let editInvoice = `<i class="fa fa-edit text-muted"></i>`;
                        let editIcon = `<i class="fa fa-pen text-muted"></i>`;
                        let releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                        let cancelIcon = `<i class="fa fa-times-circle text-muted"></i>`;
                        let printIcon = `<i class="fa fa-print text-muted"></i>`;

                        if (item.status === 'NOT VERIFIED') {
                            editInvoice = `<i class="fa fa-edit" style="color: blue;" onclick="editRecordInvoice('${item.id}')"></i>`;
                            editIcon = `<i class="fa fa-pen" style="color: blue;" onclick="editRecord('${item.id}')"></i>`;
                        } else if (item.status === 'VERIFIED') {
                            releaseIcon = `<i class="fa fa-box-open" style="color: brown;" onclick="openModal('${item.id}','${item.other_pn_id}')"></i>`;
                            cancelIcon = `<i class="fa fa-times-circle" style="color: red; cursor:pointer;" onclick="openModalcancel('${item.id}','${item.other_pn_id}')"></i>`;
                            printIcon = `<i class="fa fa-print" style="color: green;" onclick="printRecord('${item.id}')"></i>`;
                        } else if (item.status === 'CANCELLED') {
                            printIcon = `<i class="fa fa-print" style="color: green; cursor:pointer;" onclick="printRecord('${item.id}')"></i>`;
                        }

                        return [
                            item.con_id || '',
                            item.load_id || '',
                            item.invoice_number || '',
                            formatDate(item.created_onlydate),
                            item.status || '',
                            item.other_pn_id || '',
                            editInvoice,
                            editIcon,
                            `<i class="fa fa-eye" style="color:green;" onclick="editRecord11('${item.id}')"></i>`,
                            releaseIcon,
                            cancelIcon,
                            printIcon
                        ];
                    });

                    callback({
                        draw: data.draw,
                        recordsTotal: json.totalItems,
                        recordsFiltered: json.totalItems,
                        data: rows
                    });
                })
                .catch(err => {
                    console.error('Error fetching Others Invoice data:', err);
                    callback({ draw: data.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
                });
        }
    });
}

async function editRecordInvoice(id) {
				 // const allowed = window.allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    try {
        const url = new URL(`/jssl/invoice/searchothersidnew`, baseUrl);
        url.searchParams.append('id', id);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        const packingData = json.QsPacking_Data || [];
        const taxData = json.tax || [];
        const invoiceData = json.Invoice_Data[0] || {};
        /*      const GrandValue = json.Grand_Total_value || [];*/

        $(".dynamic-row11uptest, .dynamic-row122up").empty(); // Clear previous content

        // Set values in form fields
        setInputValue("#remarkvup", invoiceData.remarks);
        setInputValue("#datevup", invoiceData.date_of_notification);
        setInputValue("#date1vup", invoiceData.date_val);
        setInputValue("#dissuevup", invoiceData.date_of_issue);
        setInputValue("#refvup", invoiceData.reference_no);
        setInputValue("#lcvup", invoiceData.lc_number);
        setInputValue("#supvup", invoiceData.supply_place);
        setInputValue("#exevup", invoiceData.s_t_exempted);
        setInputValue("#dockvup", invoiceData.lr_docketno);
        setInputValue("#bgnovup", invoiceData.bg_no);
        setInputValue("#dateexpvup", invoiceData.date_of_expiry);
        setInputValue("#daterefvup", invoiceData.date_of_ref);
        setInputValue("#lcdatevup", invoiceData.lc_issue_date);
        setInputValue("#prodesv11up", invoiceData.product_desc);
        setInputValue("#bgvaerifyup", invoiceData.bg_type);
        setInputValue("#vidverifyup", invoiceData.id);
        setInputValue("#vcontract11up", invoiceData.load_id);

        // Set "freight" value
        setInputValue("#vfreight11up", packingData.length > 0 ? packingData[0].freight : "");
        setInputValue("#bvaueup", packingData.length > 0 ? packingData[0].totalpnAmount : "");
        setInputValue("#netAmountupp", packingData.length > 0 ? packingData[0].totalpnAmount : "");
        setInputValue("#pnverifywwup", packingData.length > 0 ? packingData[0].otherPnId : "");
        /*       setInputValue("#intypeeditup", packingData.length > 0 ? packingData[0].type_id : "");*/

        // Set grand total value
        /*     setInputValue("#grandvup", GrandValue.length > 0 ? GrandValue[0].total : "");*/

        // Set contractor data fields
        const contractorFields = {
            "#bunitvup": "business_unit_name",
            '#intypeeditup': "invoice_remarks_id",
            "#intovup": "invoice_to_id_value",
            "#prodesvup": "prod_desc",
            "#shipmodevup": "shipment_mode_id_value",
            "#workordervup": "work_id_value",
            "#exptvup": "export",
            "#taxresvup": "tax_onpayable_rev",
            "#percenvup": "percentage",
            "#nandconvup": "consignee_id_value",
            "#banknamevup": "bank_details_id_value",
            "#deliveryconvup": "delivery_condition_id_value",
            "#officevvup": "reg_office_id_value",
            "#vingrandvup": "tax_ex_inc",
            "#advFup": "freight_advance_recovery",
            "#arevup": "area_no",
            "#lutvup": "lot_no",
            "#connumvup": "containter_no",
            "#epogvup": "epcgno",
            "#exptitlevup": "export_title",
            "#newhcode": "h_code_value",
            "#newscode": "s_code_value",
            "#totalTaxupp": "total_tax",
            '#tax1addupp': "tax1",
            '#tax11upp': "tax1_per",
            '#tax1valueupp': "tax1_value",
            '#tax2addupp': "tax2",
            '#tax12upp': "tax2_per",
            '#tax2valueupp': "tax2_value",
            '#tax3addupp': "tax3",
            '#tax13upp': "tax3_per",
            '#tax3valueupp': "tax3_value",
            '#grandTotalupp': "grand_total"

        };

        /*        const TaxFields = {
                    "#bvaueup": "basic_value",
                    "#pdptvup": "optd",
                    "#pdptcvup": "optc",
                    "#advAup": "taxable",
                    "#advanup": "non_taxable"
                  };
        */
        Object.keys(contractorFields).forEach(selector => {
            setInputValue(selector, invoiceData[contractorFields[selector]] || "");
        });

        /*     Object.keys(TaxFields).forEach(selector => {
                 setInputValue(selector, invoiceData.length > 0 ? invoiceData[0][TaxFields[selector]] : "");
             });*/

        // Show/hide export field based on "export" value
        $('#exportFields1verifyup').toggle(invoiceData.length > 0 && invoiceData[0].export === 'yes');

        // Append packing data
        packingData.forEach((item, index) => {
            const showLabel = index === 0;
            $(".dynamic-row11uptest").append(`
                <div class="row align-items-center mb-1">
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">UOM</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input " value="${item.uom_name}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Quantity</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.quantities}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Kg</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.kgs}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unitPrice}" readonly>
                    </div>
                    <!--  <div class="col-auto">
					${showLabel ? '<label class="small-label">pices</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input" value="${item.pice}" readonly>
                    </div> -->
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Total</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input" value="${item.scrapNameTypeId}" readonly>
                    </div>
                  <!--   <div class="col-auto">
				  <label class="small-label">Service Code</label>
                        <input type="text" class="form-control form-control-sm small-input" value="${item.scode}" readonly>
                    </div>
                    <div class="col-auto">
					<label class="small-label">HSN Code</label>
                        <input type="text" class="form-control form-control-sm small-input" value="${item.hcode}" readonly>
                    </div> -->
                </div>
            
				${showLabel ? '<hr">' : ''}

            `);
        });
        var selectedTaxId1 = document.getElementById('tax11upp').value.trim();
        var selectedTaxId2 = document.getElementById('tax12upp').value.trim();
        var selectedTaxId3 = document.getElementById('tax13upp').value.trim();

        const totalAmount = parseFloat(document.getElementById("netAmountupp").value) || 0;
        const taxValue1 = ((selectedTaxId1 / 100) * totalAmount).toFixed(2);
        const taxValue2 = ((selectedTaxId2 / 100) * totalAmount).toFixed(2);
        const taxValue3 = ((selectedTaxId3 / 100) * totalAmount).toFixed(2);


        document.getElementById('tax1valueupp').value = taxValue1;
        document.getElementById('tax2valueupp').value = taxValue2;
        document.getElementById('tax3valueupp').value = taxValue3;

        calculateGrandTotal();


        // Show the modal
        $("#exampleModalScrollableEditUp").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }



}


function openModalUpdate() {
    var username = document.getElementById('intypeeditup').value.trim();
    var username1 = document.getElementById('prodesv11up').value.trim();
    var username12 = document.getElementById('remarkvup').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('intype').innerText = "Please select Invoice type.";
        document.getElementById('intype').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('intype').innerText = "";
        document.getElementById('intype').style.display = "none";
    }

    if (username1 === '') {
        document.getElementById('intypedes').innerText = "Please enter product description.";
        document.getElementById('intypedes').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('intypedes').innerText = "";
        document.getElementById('intypedes').style.display = "none";
    }

    if (username12 === '') {
        document.getElementById('intyperem').innerText = "Please enter remarks.";
        document.getElementById('intyperem').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('intyperem').innerText = "";
        document.getElementById('intyperem').style.display = "none";
    }

    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66Editup').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addeventudate() {
    $.ajax({
        url: new URL('/jssl/invoice/otherupdateadvnew', baseUrl),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        dataType: 'json',
        data: jQuery.param({
            modified_by: createdById,
            product_desc: prodesv11up.value,
            remarks: remarkvup.value,
            date_of_notification: datevup.value,
            date_val: date1vup.value,
            pn_id: pnverifywwup.value,
            bg_type: bgvaerifyup.value,
            date_of_issue: dissuevup.value,
            reference_no: refvup.value,
            lc_number: lcvup.value,
            supply_place: supvup.value,
            s_t_exempted: exevup.value,
            lr_docketno: dockvup.value,
            bg_no: bgnovup.value,
            date_of_expiry: dateexpvup.value,
            date_of_ref: daterefvup.value,
            lc_issue_date: lcdatevup.value,
            id: vidverifyup.value,
            inc_type: intypeeditup.value,
            grand_total: grandTotalupp.value,
            tax1: tax1addupp.value,
            tax1_per: tax11upp.value,
            tax1_value: tax1valueupp.value,
            tax2: tax2addupp.value,
            tax2_per: tax12upp.value,
            tax2_value: tax2valueupp.value,
            tax3: tax3addupp.value,
            tax3_per: tax13upp.value,
            tax3_value: tax3valueupp.value,
            total_tax: totalTaxupp.value,
        }),
        success: function(data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup"> Others Invoice updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'OtherInvoiceEntry.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to update invoice.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
                $('#exampleModalCenter66Editup').modal('hide');
                $('#exampleModalScrollableEditUp').modal('hide');

            }
        },
        error: function() {
            console.error('Request failed.');
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    fetchtaxadd1v();
    fetchtaxadd2v();
    fetchtaxadd3v();
});
function fetchtaxadd1v() {
    fetchTaxData1("tax1addVerify", "tax11Verify", "tax1valueVerify");
    fetchTaxData1("tax1addVerified", "tax11Verified", "tax1valueVerified");
}

function fetchtaxadd2v() {
    fetchTaxData1("tax2addVerify", "tax12Verify", "tax2valueVerify");
    fetchTaxData1("tax2addVerified", "tax12Verified", "tax2valueVerified");
}

function fetchtaxadd3v() {
    fetchTaxData1("tax3addVerify", "tax13Verify", "tax3valueVerify");
    fetchTaxData1("tax3addVerified", "tax13Verified", "tax3valueVerified");
}

async function fetchTaxData1(selectId) {
    try {
        const url = new URL(`/jssl/taxmasters/list`, baseUrl);
        const response = await fetch(url, {
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
    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

async function editRecord(id) {
//	const allowed = window.allowedActions || [];

	if (!allowed.includes("Verify")) {
	  alert(" You do not have permission to Verify.");
	  return;
	}
    console.log(" verify record with ID:", id);
    try {
        const url = new URL(`/jssl/invoice/searchothersidnew`, baseUrl);
        url.searchParams.append('id', id);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        const packingData = json.QsPacking_Data || [];

        const invoiceData = json.Invoice_Data[0] || {};


        $(".dynamic-row11 ").empty(); // Clear previous content

        // Set values in form fields
        setInputValue("#remarkv", invoiceData.remarks);
        setInputValue("#datev", invoiceData.date_of_notification);
        setInputValue("#date1v", invoiceData.date_val);
        setInputValue("#dissuev", invoiceData.date_of_issue);
        setInputValue("#refv", invoiceData.reference_no);
        setInputValue("#lcv", invoiceData.lc_number);
        setInputValue("#supv", invoiceData.supply_place);
        setInputValue("#exev", invoiceData.s_t_exempted);
        setInputValue("#dockv", invoiceData.lr_docketno);
        setInputValue("#bgnov", invoiceData.bg_no);
        setInputValue("#dateexpv", invoiceData.date_of_expiry);
        setInputValue("#daterefv", invoiceData.date_of_ref);
        setInputValue("#lcdatev", invoiceData.lc_issue_date);
        setInputValue("#prodesv11", invoiceData.product_desc);
        setInputValue("#bgvaerify", invoiceData.bgDescription);
        setInputValue("#vidverify", invoiceData.id);
        setInputValue("#vcontract11vv", invoiceData.load_id);

        // Set "freight" value
        /*        setInputValue("#vfreight11", packingData.length > 0 ? packingData[0].freight : "");
                setInputValue("#pnverifyww", packingData.length > 0 ? packingData[0].pn_id : "");*/

        // Set grand total value
        /*   setInputValue("#grandv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");*/

        // Set "freight" value
        setInputValue("#vfreight11", packingData.length > 0 ? packingData[0].freight : "");
        setInputValue("#bvaue", packingData.length > 0 ? packingData[0].totalpnAmount : "");
        setInputValue("#netAmountVerify", packingData.length > 0 ? packingData[0].totalpnAmount : "");
        setInputValue("#pnverifyww", packingData.length > 0 ? packingData[0].otherPnId : "");

        // Set contractor data fields
        const contractorFields = {
            /*					 "#bunitvv": "business_unit_name",
                                 "#intypevv": "invoice_type_calculation",
                                 "#intovv": "invoice_to_id_value",
                                 "#prodesvv": "product_desc_id",
                                 "#shipmodevv": "shipment_mode_id_value",
                                 "#workordervv": "work_id_value",
                                 "#exptvv": "export",
                                 "#taxresvv": "tax_payable",
                                 "#percenvv": "percentage_value",
                                 "#nandconvv": "consignee_id_value",
                                 "#banknamevv": "bank_details_id_value",
                                 "#deliveryconvv": "delivery_condition_id_value",
                                 "#officevvv": "reg_office_id_value",
                                 "#vingrandvv": "tax_ex_inc",
                                 "#advFv": "freight_advance_recovery",
                                 "#arevv": "area_no",
                                 "#lutvv": "lot_no",
                                 "#connumvv": "containter_no",
                                 "#epogvv": "epcgno",
                                 "#exptitlevv": "export_title",
                                 "#newscode1": "s_code_value",
                                 "#newhcode1": "h_code_value",*/
            "#bunitv": "business_unit_name",
            "#intov": "invoice_to_id_value",
            "#prodesv": "prod_desc",
            "#shipmodev": "shipment_mode_id_value",
            "#workorderv": "work_id_value",
            "#exptv": "export",
            "#taxresv": "tax_onpayable_rev",
            "#percenv": "percentage",
            "#nandconv": "consignee_id_value",
            "#banknamev": "bank_details_id_value",
            "#deliveryconv": "delivery_condition_id_value",
            "#officevv": "reg_office_id_value",
            "#vingrandv": "tax_ex_inc",
            "#advF": "freight_advance_recovery",
            "#arev": "area_no",
            "#lutv": "lot_no",
            "#connumv": "containter_no",
            "#epogv": "epcgno",
            "#exptitlev": "export_title",
            "#newscode2": "h_code_value",
            "#newhcode2": "s_code_value",
            "#totalTaxVerify": "total_tax",
            '#tax1addVerify': "tax1",
            '#tax11Verify': "tax1_per",
            '#tax1valueVerify': "tax1_value",
            '#tax2addVerify': "tax2",
            '#tax12Verify': "tax2_per",
            '#tax2valueVerify': "tax2_value",
            '#tax3addVerify': "tax3",
            '#tax13Verify': "tax3_per",
            '#tax3valueVerify': "tax3_value",
            '#grandTotalVerify': "grand_total"

        };

        /*        const TaxFields = {
                    "#bvaue": "basic_value",
                    "#pdptv": "optd",
                    "#pdptcv": "optc",
                    "#advA": "taxable",
                    "#advan": "non_taxable"
                  };*/

        Object.keys(contractorFields).forEach(selector => {
            setInputValue(selector, invoiceData[contractorFields[selector]] || "");
        });

        /*       Object.keys(TaxFields).forEach(selector => {
                   setInputValue(selector, taxData.length > 0 ? taxData[0][TaxFields[selector]] : "");
               });
       */
        // Show/hide export field based on "export" value
        $('#exportFields1verify').toggle(invoiceData.length > 0 && invoiceData[0].export === 'yes');

        // Append packing data
        packingData.forEach((item, index) => {
            const showLabel = index === 0;   // true only for first item
            $(".dynamic-row11").append(`
			        <div class="row align-items-center mb-1">
			            <div class="col-auto">
						${showLabel ? '<label class="small-label">UOM</label>' : ''}
			                <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
			            </div>
			            <div class="col-auto">
						${showLabel ? '<label class="small-label">Quantity</label>' : ''}
			                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.quantities}" readonly>
			            </div>
			            <div class="col-auto">
						${showLabel ? '<label class="small-label">Kg</label>' : ''}
			                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.kgs}" readonly>
			            </div>
			            <div class="col-auto">
						${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
			                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unitPrice}" readonly>
			            </div>
			            <!--  <div class="col-auto">
						${showLabel ? '<label class="small-label">pices</label>' : ''}
			                <input type="text" class="form-control form-control-sm small-input" value="${item.pice}" readonly>
			            </div> -->
			            <div class="col-auto">
						${showLabel ? '<label class="small-label">Total</label>' : ''}
			                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
			            </div>
			            <div class="col-auto">
						${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
			                <input type="text" class="form-control form-control-sm small-input" value="${item.scrapNameTypeId}" readonly>
			            </div>
			          <!--   <div class="col-auto">
					  <label class="small-label">Service Code</label>
			                <input type="text" class="form-control form-control-sm small-input" value="${item.scode}" readonly>
			            </div>
			            <div class="col-auto">
						<label class="small-label">HSN Code</label>
			                <input type="text" class="form-control form-control-sm small-input" value="${item.hcode}" readonly>
			            </div> -->
			        </div>
			        <hr>
			    `);
        });

        var selectedTaxId1 = document.getElementById('tax11Verify').value.trim();
        var selectedTaxId2 = document.getElementById('tax12Verify').value.trim();
        var selectedTaxId3 = document.getElementById('tax13Verify').value.trim();

        const totalAmount = parseFloat(document.getElementById("netAmountVerify").value) || 0;
        const taxValue1 = ((selectedTaxId1 / 100) * totalAmount).toFixed(2);
        const taxValue2 = ((selectedTaxId2 / 100) * totalAmount).toFixed(2);
        const taxValue3 = ((selectedTaxId3 / 100) * totalAmount).toFixed(2);
        const totaltax = (parseFloat(taxValue1) || 0) + (parseFloat(taxValue2) || 0) + (parseFloat(taxValue3) || 0);


        document.getElementById('tax1valueVerify').value = taxValue1;
        document.getElementById('tax2valueVerify').value = taxValue2;
        document.getElementById('tax3valueVerify').value = taxValue3;
        document.getElementById('totalTaxVerify').value = totaltax;
        document.getElementById('grandTotalVerify').value = totalAmount + totaltax


        // Show the modal
        $("#exampleModalScrollableVerify").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
}

function openModalVerify() {
    var username = document.getElementById('remarkvvei').value.trim();
    var showError = false;

    // Username Validation
    if (username === '') {
        document.getElementById('gstem').innerText = "Please enter GST remarks.";
        document.getElementById('gstem').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('gstem').innerText = "";
        document.getElementById('gstem').style.display = "none";
    }

    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66Verify').modal('show');
    }
}

function addeventVerify() {
    let taxIds = [], taxPers = [], taxValues = [],
        taxAdv = [], taxPtd = [], taxPbc = [],
        qsPackingItemSlno = [], taxAdvList = [], nonTaxAdvList = [];

    $(".dynamic-row122 .row").each(function() {
        let inputs = $(this).find("input[value][type='text']");
        let slno = inputs.eq(0).val();
        let taxPer = inputs.eq(1).val();
        let taxAdven = inputs.eq(2).val();
        let taxValue = inputs.eq(3).val();
        let taxPtdValue = inputs.eq(4).val();
        let taxPbcValue = inputs.eq(5).val();
        let taxId = inputs.eq(6).val();
        let nonTaxAdv = inputs.eq(7).val();

        if (slno) qsPackingItemSlno.push(slno);
        if (taxId) taxIds.push(taxId);
        if (taxPer) taxPers.push(taxPer);
        if (taxValue) taxValues.push(taxValue);
        if (taxAdven) {
            taxAdv.push(taxAdven);
            taxAdvList.push(taxAdven);
        }
        if (nonTaxAdv) nonTaxAdvList.push(nonTaxAdv);
        if (taxPtdValue) taxPtd.push(taxPtdValue);
        if (taxPbcValue) taxPbc.push(taxPbcValue);
    });

    // Validate baseUrl
    if (typeof baseUrl === 'undefined' || !baseUrl) {
        console.error('baseUrl is not defined or empty.');
        alert('Internal configuration error: baseUrl not set.');
        return;
    }

    const requestUrl = new URL('/jssl/invoice/othersverificationnew', baseUrl);
    console.log("Posting to:", requestUrl.href);

    $.ajax({
        url: requestUrl.href,
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        dataType: 'json',
        data: jQuery.param({
            verified_by: createdById,
            factory_id: selectedFactoryId,
            gst_remarks: remarkvvei.value,
            pn_id: pnverifyww.value,
            id: vidverify.value

        }),
        success: function(data) {
            if (data.message === "Success") {
                const popup = $('<div class="popup">Others Invoice Verified Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'OtherInvoiceEntry.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to verify invoice.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
                $('#exampleModalCenter66Verify').modal('hide');
                $('#exampleModalScrollableVerify').modal('hide');
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX request failed:', error);
            console.error('Status:', status);
            console.error('Response:', xhr.responseText);
            alert("Verification request failed. Check console for details.");
        }
    });
}

async function editRecord11(id) {
//	const allowed = window.allowedActions || [];

		if (!allowed.includes("view")) {
		  alert(" You do not have permission to view.");
		    $("#exampleModalScrollableVerified").modal("hide");
		  return;
		}
    try {
        const url = new URL(`/jssl/invoice/searchothersidnew`, baseUrl);
        url.searchParams.append('id', id);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        const packingData = json.QsPacking_Data || [];
        /*  const taxData = json.tax || [];*/
        const invoiceData = json.Invoice_Data[0] || {};



        $(".dynamic-row11test ").empty(); // Clear previous content

        // Set values in form fields
        setInputValue("#remarkvvtest", invoiceData.remarks);
        setInputValue("#datevv", invoiceData.date_of_notification);
        setInputValue("#date1vv", invoiceData.date_val);
        setInputValue("#dissuevv", invoiceData.date_of_issue);
        setInputValue("#refvv", invoiceData.reference_no);
        setInputValue("#lcvv", invoiceData.lc_number);
        setInputValue("#supvv", invoiceData.supply_place);
        setInputValue("#exevv", invoiceData.s_t_exempted);
        setInputValue("#dockvv", invoiceData.lr_docketno);
        setInputValue("#bgnovv", invoiceData.bg_no);
        setInputValue("#dateexpvv", invoiceData.date_of_expiry);
        setInputValue("#daterefvv", invoiceData.date_of_ref);
        setInputValue("#lcdatevv", invoiceData.lc_issue_date);
        setInputValue("#prodesv11v", invoiceData.product_desc);
        setInputValue("#bgvaerifyv", invoiceData.bgDescription);
        setInputValue("#remarkvvvtest", invoiceData.gst_remarks);
        setInputValue("#vidverifyv", invoiceData.id);
        setInputValue("#contract11vvv", invoiceData.load_id);



        // Set "freight" value
        setInputValue("#vfreight11v", packingData.length > 0 ? packingData[0].freight : "");
        setInputValue("#bvauev", packingData.length > 0 ? packingData[0].totalpnAmount : "");
        setInputValue("#netAmountVerified", packingData.length > 0 ? packingData[0].totalpnAmount : "");
        setInputValue("#pnverifywwv", packingData.length > 0 ? packingData[0].otherPnId : "");

        // Set grand total value
        /*     setInputValue("#grandvv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");*/

        // Set contractor data fields
        const contractorFields = {

            "#bunitvv": "business_unit_name",
            "#intovv": "invoice_to_id_value",
            "#prodesvv": "prod_desc",
            "#shipmodevv": "shipment_mode_id_value",
            "#workordervv": "work_id_value",
            "#exptvv": "export",
            "#taxresvv": "tax_onpayable_rev",
            "#percenvv": "percentage",
            "#nandconvv": "consignee_id_value",
            "#banknamevv": "bank_details_id_value",
            "#deliveryconvv": "delivery_condition_id_value",
            "#officevvv": "reg_office_id_value",
            "#vingrandvv": "tax_ex_inc",
            "#advFv": "freight_advance_recovery",
            "#arevv": "area_no",
            "#lutvv": "lot_no",
            "#connumvv": "containter_no",
            "#epogvv": "epcgno",
            "#exptitlevv": "export_title",
            "#newscode1": "h_code_value",
            "#newhcode1": "s_code_value",
            "#totalTaxVerified": "total_tax",
            '#tax1addVerified': "tax1",
            '#tax11Verified': "tax1_per",
            '#tax1valueVerified': "tax1_value",
            '#tax2addVerified': "tax2",
            '#tax12Verified': "tax2_per",
            '#tax2valueVerified': "tax2_value",
            '#tax3addVerified': "tax3",
            '#tax13Verified': "tax3_per",
            '#tax3valueVerified': "tax3_value",
            '#grandTotalVerified': "grand_total",
        };

        /*      const TaxFields = {
                  "#bvauev": "basic_value",
                  "#pdptvv": "optd",
                  "#pdptcvv": "optc",
                  "#advAv": "taxable",
                  "#advanv": "non_taxable"
                };
      */
        Object.keys(contractorFields).forEach(selector => {
            setInputValue(selector, invoiceData[contractorFields[selector]] || "");
        });

        // Show/hide export field based on "export" value
        $('#exportFields1verified').toggle(invoiceData.length > 0 && invoiceData[0].export === 'yes');

        // Append packing data
        packingData.forEach((item, index) => {
            const showLabel = index === 0;   // true only for first item
            $(".dynamic-row11test").append(`
				        <div class="row align-items-center mb-1">
				            <div class="col-auto">
							${showLabel ? '<label class="small-label">UOM</label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
				            </div>
				            <div class="col-auto">
							${showLabel ? '<label class="small-label">Quantity</label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.quantities}" readonly>
				            </div>
				            <div class="col-auto">
							${showLabel ? '<label class="small-label">Kg</label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.kgs}" readonly>
				            </div>
				            <div class="col-auto">
							${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unitPrice}" readonly>
				            </div>
				            <!--  <div class="col-auto">
							${showLabel ? '<label class="small-label">pices</label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input" value="${item.pice}" readonly>
				            </div> -->
				            <div class="col-auto">
							${showLabel ? '<label class="small-label">Total</label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
				            </div>
				            <div class="col-auto">
							${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input" value="${item.scrapNameTypeId}" readonly>
				            </div>
				          <!--   <div class="col-auto">
						  <label class="small-label">Service Code</label>
				                <input type="text" class="form-control form-control-sm small-input" value="${item.scode}" readonly>
				            </div>
				            <div class="col-auto">
							<label class="small-label">HSN Code</label>
				                <input type="text" class="form-control form-control-sm small-input" value="${item.hcode}" readonly>
				            </div> -->
				        </div>
 						 ${showLabel ? '<hr>' : ''}				    `);
        });


        // Show the modal
        $("#exampleModalScrollableVerified").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
}


function openModal(id, pn_id) {
	//  const allowed = window.allowedActions || [];

	if (!allowed.includes("Release")) {
	  alert(" You do not have permission to release.");
	  return;
	}
    console.log(" release record with ID:", id);
    // Open the modal
    $('#exampleModalCenter1').modal('show');

    // Store the id and pn_id in the modal's data attributes
    $('#exampleModalCenter1').attr('data-id', id);
    $('#exampleModalCenter1').attr('data-pn-id', pn_id);
}

function addeventrelease() {
    // Retrieve the id and pn_id from the modal
    var id = $('#exampleModalCenter1').attr('data-id');
    var pn_id = $('#exampleModalCenter1').attr('data-pn-id');

    // Perform release action
    $.ajax({
        url: new URL('/jssl/invoice/othersreleasebyidnew', baseUrl),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        dataType: 'json',
        data: jQuery.param({
            id: id,
            factory_id: selectedFactoryId,
            released_by: createdById,
            pn_id: pn_id // Pass the pn_id here
        }),
        success: function(data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">others Invoice Released Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'OtherInvoiceEntry.jsp';
                    });
                }, 800);
            } else {
            }
        },
        error: function() {
            console.error('Request failed.');
        }
    });
}


async function printRecord(id) {
    //	const allowed = window.allowedActions || [];
        if (!allowed.includes("Print")) {
          alert(" You do not have permission to print.");
          return;
        }
    
    // Proceed with print logic here
    console.log(" Printing record with ID:", id);
showLoader();
    // Your actual print logic here
    try {
        const url = new URL(`/jssl/invoice/searchothersidnew?id=${id}`, baseUrl);
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch data");

        const json = await response.json();
        const Invoice_Data = json.Invoice_Data;
        const Contractor_Data = json.Contractor_Data;
        const QsPacking_Data = json.QsPacking_Data;
        const tax = json.tax;
        const Grand_Total_value = json.Grand_Total_value;

        const Grand_Total_tax = Grand_Total_value[0].Grand_Total_tax;
        const Total_adv_tax_Taxable = Grand_Total_value[0].Total_adv_tax_Taxable;
        const Tax_Final_total = Grand_Total_value[0].Tax_Final_total;
        const PBC_Final_total = Grand_Total_value[0].PBC_Final_total;

        const invoiceno = Invoice_Data[0].invoice_no;
        const lr_docketno = Invoice_Data[0].lr_docketno;
        const date_val = Invoice_Data[0].date_val;
        const factory_id = Invoice_Data[0].factory_id;
		
		const cancel = Invoice_Data[0].cancel;




        const url_factory = new URL(`/jssl/factory/getAllFactoryListSS`, baseUrl);
        const response_factory = await fetch(url_factory, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response_factory.ok) throw new Error("Failed to fetch data");
        const factory_json = await response_factory.json();

        const factory_data_map = factory_json.FactoryDetails;
        console.log("this the factory_data_map" + factory_data_map);


        const FactoryDataBasedById = factory_data_map.find(f => f.id === factory_id);
        const MumbaiAddress = factory_data_map.find(f => f.id === "4");
        console.log(FactoryDataBasedById);
        /*	console.log(factory_data_map);
                   
                   
                   console.log(factory_json);*/

        const reg_addresss = MumbaiAddress.address;

        const factory_Address = FactoryDataBasedById.address;
        const state_Code = FactoryDataBasedById.stateCode;
        const Gst_Code = FactoryDataBasedById.gstNo;

        //const product_desc = json.Invoice_Data?.product_desc || ''; // Fix reference

        const invoice_to_id_value = Invoice_Data[0].invoice_to_id_value;
        /*    const tax_payable = Contractor_Data[0].tax_payable;*/
        const tax_payable = Invoice_Data[0].tax_onpayable_rev;
        const area_no = Invoice_Data[0].area_number;
        const lot_no = Invoice_Data[0].lot_number;
        const containter_no = Invoice_Data[0].container_name;
        const epcgno = Invoice_Data[0].epcg_license;
        const shipment_mode_id_value = Invoice_Data[0].shipment_mode_id_value;
        const delivery_condition_id_value = Invoice_Data[0].delivery_condition_id_value;
        const consignee_id_value = Invoice_Data[0].consignee_id_value;
        const work_id_value = Invoice_Data[0].work_id_value;
        const invoiceStateName = Invoice_Data[0].invoiceStateName;
        const consigneeStateName = Invoice_Data[0].consigneestateName;
        const invoiceStateCode = Invoice_Data[0].invoiceStateCode;
        const consigneeStateCode = Invoice_Data[0].consigneestatecode;
        const invoiceGstNo = Invoice_Data[0].invoiceGstNo;
        const consigneeGstNo = Invoice_Data[0].consigneeGstNo;
        const invoicePanNo = Invoice_Data[0].invoicePanNo;
        const consigneePanNo = Invoice_Data[0].consigneePanNo;
        const bankName = Invoice_Data[0].org_name;
		
		
		const productdesc = Invoice_Data[0].product_desc;
		
		
        const account_number = Invoice_Data[0].account_number;
        const branch_address =  Invoice_Data[0].bank_details_id_value+' '+ Invoice_Data[0].branch_address;
        const branch_code = Invoice_Data[0].branch_code;
        const swift_code = Invoice_Data[0].swift_code;
        const ifsc_code = Invoice_Data[0].ifsc_code;


        const transport_name = QsPacking_Data[0].transporterName;
        const vechile_no = QsPacking_Data[0].vechileNo;
        const con_code_with_lot_no = Invoice_Data[0].con_id + "-" + Invoice_Data[0].load_id;


        const freight = QsPacking_Data[0].freight;
        /* const total_pices = tax[0].total_pices;*/
        const total_kgs = QsPacking_Data[0].total_kgs;
        const total_qty = QsPacking_Data[0].total_qty;
        const basic_value = QsPacking_Data[0].totalpnAmount;


        const tax1_name = Invoice_Data[0].tax_1 ?? " ";
        const tax2_name = Invoice_Data[0].tax_2 ?? " ";
        const tax3_name = Invoice_Data[0].tax_3 ?? " ";



        const row = Invoice_Data?.[0] ?? {};

        const tax1_value = row.tax1_per ? row.tax1_per + "%" : " ";
        const tax2_value = row.tax2_per ? row.tax2_per + "%" : " ";
        const tax3_value = row.tax3_per ? row.tax3_per + "%" : " ";
       const tax4_data = Grand_Total_value[0].GrandTotalInWords ;

        const formatTax = (val) =>
            val == null || val === "0.00" ? " " : val;

        const tax1_data = formatTax(row.tax1_value);
        const tax2_data = formatTax(row.tax2_value);
        const tax3_data = formatTax(row.tax3_value);
		
		
		
	

		const formatWord = (val) => {
		  if (!val) return "";

		  const cleaned = val.replace(/\s+/g, " ").trim().toLowerCase();

		  if (
		    cleaned === "zero rupees only" ||
		    cleaned === "rupees only"
		  ) {
		    return "";
		  }

		  return val;
		};


		const rows = Grand_Total_value?.[0] ?? {};

		const tax1_word = formatWord(rows.GrandtaxInWords);
		const tax2_word = formatWord(rows.Grandtax2InWords);
		const tax3_word = formatWord(rows.Grandtax3InWords);
		console.log("VALUE:", rows.Grandtax3InWords);
			console.log("LENGTH:", rows.Grandtax3InWords?.length);
			console.log("JSON:", JSON.stringify(rows.Grandtax3InWords));
		

const total_invoice_value = Invoice_Data[0].grand_total;



        const items = json.QsPacking_Data || [];
      /*  const taxData = json.tax || [];*/
        const InvoiceData = json.Invoice_Data || [];
        const grandTotalData = json.Grand_Total_value?.[0] || {};
      /*  const grandTotalInWords = grandTotalData.GrandTotalInWords || '';
        const grandTotalTax = grandTotalData.Grand_Total_tax || '';
        const gstremarks = InvoiceData.gst_remarks || '';
        const advremarks = 200 || '';
        const advremarksnon = 400 || '';
        const basicValue = 500 || '';
        const basicValuecos = 600 || '';*/

        // Generate dynamic rows based on QsPacking_Data
        const maxRows = 9;// 👈 adjust invoice height here
        let tableRows = "";

        // real product rows
        items.forEach((item, index) => {
            tableRows += `
							   						   		        <tr class="product-row ">
							   						   		            <td  colspan="1" style="text-align: right;">${index + 1}</td>
							   						   		            <td colspan="4" class="desc-col descri">${item.scrapNameTypeId || ''}</td>
							   						   		        
																		<td colspan="1" style="text-align: right;">
																		    ${Math.max(
																		        Number(Invoice_Data[0].s_code_value) || 0,
																		        Number(Invoice_Data[0].h_code_value) || 0
																		    ) || ''}
																		</td>
							   						   		            <td colspan="1" style="text-align:left !important;">${item.uom_name || ''}</td>
							   						   		            <td colspan="1" class="qtys">${item.quantities || ''}</td>
							   						   		            <td colspan="2" class="weits">${item.kgs || ''}</td>
							   						   		            <td colspan="1" class="prs">${item.unitPrice || ''}</td>
							   						   		            <td  colspan="2" class="tols">${item.total || ''}</td>
							   						   		        </tr>`;
        });

        // add empty rows to fill space
		const emptyCount = Math.max(0, maxRows - items.length);

				for (let i = 0; i < emptyCount; i++) {

				    if (i === 1) { // 👈 only once (3rd empty row)
				        tableRows += `
				            <tr class="empty-row">
				                <td colspan="1">&nbsp;</td>
				                <td colspan="4" style="font-weight:550;">${productdesc || ''}</td>
				                <td colspan="1"></td>
				                <td colspan="1"></td>
				                <td colspan="1"></td>
				                <td colspan="2"></td>
				                <td colspan="1"></td>
				                <td colspan="2"></td>
				            </tr>`;
				    } else {
				        tableRows += `
				            <tr class="empty-row">
				                <td colspan="1">&nbsp;</td>
				                <td colspan="4"></td>
				                <td colspan="1"></td>
				                <td colspan="1"></td>
				                <td colspan="1"></td>
				                <td colspan="2"></td>
				                <td colspan="1"></td>
				                <td colspan="2"></td>
				            </tr>`;
				    }
				}
        // Generate dynamic tax rows
        /*  let taxRows = taxData.map(tax => `
              <tr>
                  <td colspan="10" class="tax-name" style="border-bottom:none;">${tax.tax_name || ''}</td>
                  <td colspan="1" class="tax-per">${tax.tax_per || ''}</td>
                  <td colspan="2" class="tax-per"  style= "border-bottom: 0.25px solid #000;">${tax.tax_value || ''}</td>
              </tr>
          `).join('');*/



        /*         let taxRows = taxData.map((tax, i, arr) => {
                     const isLast = i === arr.length - 1;

                     return `
                              <tr>
                          	
                                  <td colspan="10" class="tax-name" style="${isLast ? '' : 'border-bottom:none;'}">
                                      ${tax.tax_name || ''}
                                  </td>
                                  <td colspan="1" class="tax-per" style="${isLast ? '' : 'border-bottom:none;'}">
                                      ${tax.tax_per || ''} %
                                  </td>
                                  <td colspan="2" class="tax-per" style="${isLast ? '' : 'border-bottom:none;'}">
                                      ${tax.tax_value || ''}
                                  </td>
                              </tr>
                          `;
                 }).join('');*/


        /*    // Generate dynamic tax descriptions with tax_name and tax_value_in_words
            let taxDetails = taxData.map(tax => `
                     <b>${tax.tax_name}:</b> ${tax.tax_value_in_words}<br>
                 `).join('');

            let taxDetailsNew = taxData.map(tax => `
                     <b>${tax.tax_name}</b><br>
                 `).join('');

            let taxPerValue = taxData.map(tax => `
                     <b>${tax.tax_per}</b><br>
                 `).join('');

            let taxValue = taxData.map(tax => `
                     <b>${tax.tax_value}</b><br>
                 `).join('');

            let taxValuedept = taxData.map(tax => `
                     <b>${tax.ptc}</b><br>
                 `).join('');

            let taxValuecos = taxData.map(tax => `
                     <b>${tax.ptc}</b><br>
                 `).join('');

            let taxadvanceValue = taxData.map(tax => `
                     <b>${tax.adv_tax}</b><br>
                 `).join('');*/

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

        // const htmlContent = await (await fetch('print-content.html')).text()
        const htmlContent = `
							   						   		    <style>
							   						   		        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

							   						   		        * {
							   						   		            box-sizing: border-box;
							   						   		        }
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

																									               .watermark.cancelled {
																									                   color: #ff0000;
																									               }

																									               .watermark.verified {
																									                   color: #4CAF50;
																									               }

																									               .page {
																									                   position: relative;
																									               }

							   						   		        /* --- Global Reset --- */
							   						   		        html, body {
							   						   		            margin: 0;  /* FIXED: Removed top and left margins */
							   						   		            padding: 0;
							   						   		            font-family: "Times New Roman", Times, serif;
							   						   		            color: black !important;
							   						   		            background-color: #fff !important;
							   						   		            font-size: 10px;
							   						   		            line-height: 2;
							   						   		        }

							   						   		        /* --- Page Container --- */
							   						   		        .page {
							   						   		            width: 202mm;
							   						   		             height: 297mm;   
							   						   		            overflow: visible;
							   						   		          /*  page-break-after: always;*/
							   						   				  page-break-after: avoid !important;
							   						   		            margin: 0;
							   						   		            padding: 0;
							   						   		        }

							   						   		 
							   						   				.page:last-child {
							   						   				     page-break-after: avoid !important;
							   						   				}

							   						   		        /* --- Invoice Container --- */
							   						   		        .invoice-container {
							   						   		            width: 100%;
							   						   		            height: auto;
							   						   		            overflow: visible;
							   						   		            -webkit-font-smoothing: antialiased;
							   						   		            text-rendering: geometricPrecision;
							   						   		            page-break-inside: avoid;
							   						   		            margin: 0;
							   						   		            padding: 1mm;  /* Add small padding instead of margins */
							   						   		        }

							   						   		        table {
							   						   		            border-collapse: collapse;
							   						   		            page-break-inside: avoid;
							   						   		            width: 100%;
							   						   		            margin: 0;
							   						   		            padding: 0;
							   						   		        }

							   						   		        /* remove default borders */
							   						   		        td, th {
							   						   		            border: none;
							   						   		        }

							   						   		        /* draw grid using single lines */
							   						   		        td, th {
							   						   		            border-right: 0.5px solid #000;
							   						   		            border-bottom: 0.5px solid #000;
							   						   		            padding: 2px 4px;
							   						   		            vertical-align: top;
							   						   		            font-size: 10px;
							   						   		            line-height: 1.05;
							   						   		            word-wrap: break-word;
							   						   		        }

							   						   		        tr {
							   						   		            page-break-inside: avoid;
							   						   		        }

							   						   		        /* top border only for first row */
							   						   		        tr:first-child th {
							   						   		            border-top: 0.5px solid #000;
							   						   		        }

							   						   		        /* left border only for first column */
							   						   		        td:first-child,
							   						   		        th:first-child {
							   						   		            border-left: 0.5px solid #000;
							   						   		        }

							   						   		        .company-details-table {
							   						   		            border-top: 0.5px solid #000 !important;
							   						   		        }

							   						   		        /* --- Header & Footer --- */
							   						   		        .header, .footer {
							   						   		            text-align: center;
							   						   		            margin: 0;
							   						   		            padding: 0;
							   						   		        }

							   						   		        .invoice-header {
							   						   		            display: flex;
							   						   		            justify-content: space-between;
							   						   		            align-items: center;
							   						   		            margin-bottom: 2mm;
							   						   		        }

							   						   		        .gst-text {
							   						   		            font-size: 15px;
							   						   		            font-weight:500;
							   						   		            text-align: center;
							   											margin-left:300px !important;
							   						   		        }

							   						   		        .copy-label {
							   						   		            font-size: 12px;
							   						   		            font-weight: normal;
							   						   		        }

							   						   		        /* --- Tables --- */
							   						   		        table {
							   						   		            border-collapse: collapse !important;
							   						   		            table-layout: fixed;
							   						   		        }

							   						   		        td br, th br {
							   						   		            display: block;
							   						   		            margin: 0;
							   						   		            line-height: 1;
							   						   		        }

							   						   		        .company-details-table td {
							   						   		            padding: 4px;
							   						   		            font-size: 11px !important;
							   						   		        }

							   						   		        /* --- Logo --- */
							   						   		        .company-logo img {
							   						   		            width: 60px;
							   						   		            height: auto;
							   						   		            display: block;
							   						   		            margin-bottom: 2px;
							   						   		        }

							   						   		        .product-row td:nth-child(n+4) {
							   						   		            text-align: right !important;
							   						   		        }

							   						   		        .product-row td,
							   						   		        .empty-row td {
							   						   		            height: 22px;
							   						   		        }

							   						   		        .empty-row td {
							   						   		            border-top: none !important;
							   						   		            border-bottom: none !important;
							   						   		        }

							   						   		        .last-product td {
							   						   		            border-bottom: none !important;
							   						   		        }

							   						   		        .product-table .desc-col {
							   						   		            line-height: 1.5 !important;
							   						   		            white-space: normal;
							   						   		            word-break: break-word;
							   						   		        }

							   						   		        .product-table .fright-row .fright-data {
							   						   		            line-height: 1.6 !important;
							   						   		            padding: 5px !important;
							   						   		        }

							   						   		        .total-body .total-datatd {
							   						   		            line-height: 1.6 !important;
							   						   		            padding: 5px !important;
							   						   		        }

							   						   		        .total-body .total-datatds {
							   						   		            line-height: 2.5 !important;
							   						   		            text-align: right !important;
							   						   		        }

							   						   		        .desc-col.descri {
							   						   		            font-size: 7px !important;
							   						   		            padding: 1px !important;
							   						   		        }

							   						   		        .desc-col.tols {
							   						   		            text-align: right !important;
							   						   		        }

							   						   		        .desc-col.prs {
							   						   		            text-align: right !important;
							   						   		        }

							   						   		        .desc-col.weits {
							   						   		            text-align: right !important;
							   						   		        }

							   						   		        .desc-col.qtys {
							   						   		            text-align: right !important;
							   						   		        }

							   						   		        .product-table th,
							   						   		        .product-table td {
							   						   		            padding: 3px 5px;
							   						   		            line-height: 1.2;
							   						   		        }

							   						   		        .product-row td {
							   						   		            border-bottom: none;
							   						   		        }

							   						   		        .freight-vlaue {
							   						   		            text-align: right !important;
							   						   		        }

							   						   		        .fright-row {
							   						   		            border: 0.5px solid #000 !important;
							   						   		        }

							   						   		        .tax-row .tax-name {
							   						   		            line-height: 0.8 !important;
							   						   		            text-align: right !important;
							   						   					padding:5px !important;
							   						   		        }

							   						   		        .tax-row .tax-per {
							   						   		            text-align: right !important;
							   						   		            vertical-align: middle !important;
							   						   		        }

							   						   		        .total-word .total-words-des {
							   						   		            line-height: 1.2 !important;
							   						   		            font-size: 8px !important;
							   						   		            padding: 0 0 5px 5px !important;
							   						   		        }

							   						   		        .total-words-des.ss {
							   						   		            vertical-align: middle !important;
							   						   		        }

							   						   		        .total-word .total-words-val {
							   						   		            text-align: right !important;
							   						   		            vertical-align: middle !important;
							   						   		        }

							   						   		        .particulars-row {
							   						   		            line-height: 1 !important;
							   						   		        }

							   						   		        .particulars-row td {
							   						   		            padding-top: 5px !important;
							   						   		        }

							   						   		        .particulars-row .particulars-row-prtd {
							   						   		            font-size: 8px !important;
							   						   		        }

							   						   		        .particulars-row-body {
							   						   		            padding-top: 5px !important;
							   						   		        }

							   						   		        .particulars-row-body .particulars-row-body-td {
							   						   		            text-align: right !important;
							   						   		            font-size: 8px !important;
							   						   		        }

							   						   		        .td-body-tax {
							   						   		            text-align: right !important;
							   						   		            line-height: 2 !important;
							   						   		        }

							   						   		        .Bank_details {
							   						   		            line-height: 1.8 !important;
							   						   		            font-size: 8px !important;
							   						   		        }

							   						   		        .last-data td {
							   						   		            line-height: 1.5 !important;
							   						   		            font-size: 9px !important;
							   						   		            padding-top: 6px !important;
							   						   		        }

							   						   		        .last-data td:last-child {
							   						   		            text-align: center !important;
							   						   		            vertical-align: middle !important;
							   						   		        }

							   						   		        .last-data td:last-child span {
							   						   		            display: block;
							   						   		            text-align: center;
							   						   		        }

							   						   		        .footer {
							   						   		            padding-top: 6px !important;
							   						   		        }

							   						   		        .invoice-line {
							   						   		            display: flex;
							   						   		            justify-content: space-between;
							   						   		            width: 80%;
							   						   		        }

							   						   		        .fixed-8px td {
							   						   		            font-size: 8px !important;
							   						   		            line-height: 1.1 !important;
							   						   		        }

							   						   		        /* --- Terms & Footer --- */
							   						   		        .terms {
							   						   		            margin-top: 2mm;
							   						   		        }

							   						   		        .footer p {
							   						   		            font-size: 9px;
							   						   		            line-height: 1.2;
							   						   		            margin: 0;
							   						   		            padding: 0;
							   						   		        }

							   						   		        /* --- Text & Alignment --- */
							   						   		        .header, .footer, .gst-text, .copy-label {
							   						   		            text-align: center;
							   						   		        }
																	b{
																		font-weigth:550px;
																	}
																	strong{
																		font-weigth:550px;
																	}
							   						   		    </style>

							   						   		    <div class="invoice-container">
							   						   		        <div class="invoice-header">
																	${cancel === 'true' ? `
																																	           <div class="watermark cancelled">
																																	               CANCELLED
																																	           </div>
																																	       ` : ''}
							   						   		            
							   						   		            <div class="gst-text">GST TAX INVOICE</div>
							   						   		            <div class="gst-text1 copy-label">Original For Recipient</div>
							   						   		        </div>
							   						   		        
							   						   		        <table class="company-details-table">
							   						   		            <tr>
							   						   		                <td colspan="6">
							   						   		                    <div class="company-logo">
							   						   		                        <img src="img/logo/download.png" alt="Company Logo" style="width:100px;">
							   						   		                    </div>
							   						   		                    <strong>JSW Serverfiled Structures Limited</strong><br>
							   						   		                   <p style="width :70%" class="facotry_address"> 
							   						   		                   
							   						   		                    <p>
							   						   		                   <b> State Code</b>:<span class="state_code"></span><br>
							   						   		                   <b> GSTIN :</b> <span class="gst_code"> </span>    <b style="margin-left: 20px;">PAN </b>: AACCJ1473D<br>
							   						   		                  <b>  ICE No:</b> 0309033152   <b style="margin-left: 40px;">CIN No:</b> U28112MH2009PLC191045<br>
							   						   		                    <b>Email:</b> invoice@jssl.in   <b style="margin-left: 30px;"> Website:</b> www.jssl.in
							   						   		                </td>
							   						   		                <td colspan="6">
							   						   		                    <br>
							   						   		                    <div class="invoice-line">
							   						   		                        <div style="font-size:12px;"><b>Invoice No:  </b> <span class="invoiceNumber"></span></div>
							   						   		                        <div><b>Date:</b> <span class="date"></span></div>
							   						   		                    </div>
							   						   		                    <br>
							   						   		                    <b>Contract No Reference No:</b> <span class="contrefno"></span><br>
							   						   		                 
							   						   		                    <b>Date & Time of supply:</b> <span class="datetime"></span><br>
							   						   		                    <br>
							   						   		                    <b>Work/Purchase Order No:</b> <span class="workor"></span><br>
							   						   		             
							   						   		                    <b>Date of Order:</b> <span class="dateor"></span><br>
							   						   		                </td>
							   						   		            </tr>
																		<tr>
																						<td colspan="6" style="font-size:10px; line-height:1.4;">
																						    
																						    <b>
																						        Invoice To :<br>

																						        <span class="shipto11" style="text-transform:uppercase;"></span></b><br>
																						        <span class="projectname"></span><br>
																						   

																						    <!-- Address (NOT bold) -->
																						    <span class="fulladdress" style="white-space: pre-line;"></span><br>

																						    <b>
																						        Name of the State : <span class="statename"></span><br>
																						        State Code : <span class="stcode11"></span><br>
																						        GSTIN : <span class="ingst"></span><br>
																						        PAN : <span class="panin"></span><br>
																						    </b>

																						</td>
																						<td colspan="6" style="font-size:10px; line-height:1.4;">
																						    
																						    <b>Name & Address of consignee:<br>

																						    <span class="conname" style="text-transform:uppercase;"></span></b><br>
																						    <span class="conproject"></span><br>

																						    <!-- Address -->
																						    <span class="conaddress" style="white-space: pre-line;"></span><br>

																							<b>
																						    Name of the State: <span class="state"></span><br>
																						    State Code: <span class="stateco"></span><br>
																						    GSTIN: <span class="congst"></span><br>
																						    PAN: <span class="pancon"></span><br>
																						   </b>
																						   
																						</td>
																			            </tr>
							   						   		            <tr class="fixed-8px">
							   						   		                <td  colspan="3" class="notif-cell"> <strong>Date of Notification</strong><br>
							   						   		                    <strong>Exempted note under:</strong><br>
							   						   		                    <strong>Tax is Payble on revese charge:(Yes/No):</strong><span class="taxpayre"></span><br>
							   						   		                </td>
							   						   		                <td  colspan="3" style="font-size:7px;">  <strong>Export Details:</strong><br>
							   						   		                    <strong>ARE No:</strong><span class="areano"></span><br>
							   						   		                    <strong>LUT No:</strong><span class="lutno"></span><br>
							   						   		                    <strong>Container No:</strong><span class="contlo"></span><br>
							   						   		                    <strong>EPCG License No:</strong><span class="epoglo"></span><br>
							   						   		                </td>
							   						   		                <td  colspan="3" style="font-size:7px;">  <b>Transporter:</b> <span class="trans"></span><br>
							   						   		                    <b>Vehicle No:</b><span class="vehino"></span><br>
							   						   		                    <b>LR/DOCKET No:</b><span class="lrdoc"></span><br>
							   						   		                    <b>Date:</b><span class="lrdate"></span><br>
							   						   		                </td>
							   						   		                <td  colspan="3" style="font-size:7px;">   <b>Shipment Mode:</b> <span class="shipmo"></span><br>
							   						   		                    <b>Delivery Condition:</b> <span class="delcon"></span><br>
							   						   		                </td>
							   						   		            </tr>
							   						   		        </table>
							   						   		        
							   						   		        <table class="product-table">
							   						   		            <thead>
							   						   		                <tr>
							   						   		                    <th class="desc-col" colspan="1" style="width: 5%;">Sr No.</th>
							   						   		                    <th  class="desc-col" colspan="4" >Product Description</th>
							   						   		                   
							   						   		                    <th  class="desc-col" colspan="1" style="width: 10%;" >Service/HSN Code</th>
							   						   		                    <th  class="desc-col" colspan="1"  >UOM</th>
							   						   		                    <th class="desc-col"  colspan="1" >Qty/Nos</th>
							   						   		                    <th class="desc-col" colspan="2"  style="text-align:center">Weight</th>
							   						   		                    <th class="desc-col" colspan="1" style="width: 10%;" >Unit Price</th>
							   						   		                    <th  class="desc-col" colspan="2" >Value (INR)</th>
							   						   		                </tr>
							   						   		            </thead>
							   						   		            <tbody id="product_table_data">
							   						   		                ${tableRows} 
							   						   		            </tbody>
							   						   		            <tbody>
							   						   		                <tr class="fright-row">
							   						   		                    <td class="fright-data"  colspan="11">
							   						   		                        <span>Freight</span><br>
							   						   		                    </td>
							   						   		                    <td class="fright-data freight-vlaue" colspan="2">
							   						   		                        <span class="freight"></span><br>
							   						   		                    </td>
							   						   		                </tr>
							   						   		            </tbody>
							   						   		            <tbody class="total-body">
							   						   		                <tr>
							   						   		                    <td  colspan="7" class="total-datatd">
							   						   		                        <span>TOTAL</span><br>
							   						   		                    </td>
							   						   		                   
							   						   		                   
							   						   		                    <td class="total-datatds" >
							   						   		                        <span class="qtytotal"></span><br>
							   						   		                    </td>
							   						   		                    <td  colspan="2" class="total-datatds" >
							   						   		                        <span class="wiegtotal"></span><br>
							   						   		                    </td>
							   						   		                    <td ></td>
							   						   		                    <td colspan="2"  class="total-datatds" >
							   						   		                        <span class="val11"></span><br>
							   						   		                    </td>
							   						   		                </tr>
							   						   		            </tbody>
							   						   		            <tbody class="tax-row">
							   						   		            
																		  <tr>
																		                    <td colspan="6"></td>
																		                    <td  colspan="4" style="text-align:right;">
																		                    <span class="tax1name"></span><br>
																		                    <span class="tax2name"></span><br>
																		                    <span class="tax3name"></span><br>
																		                    </td>
																		                    <td style="text-align:right;">
																		                    <span class="tax1per"></span><span> </span><br>
																		                    <span class="tax2per"></span><span> </span><br>
																		                    <span class="tax3per"></span><span> </span><br>
																		                    </td>
																		                    <td colspan="2" style="text-align:right;">
																		                    <span class="tax1value"></span><br>
																		                    <span class="tax2value"></span><br>
																		                    <span class="tax3value"></span><br>
																		                    </td>
																		                  
																		                </tr>
							   						   		            </tbody>
							   						   		            <tbody class="total-word">
																		<tr>
																		                <td  colspan="8" style="vertical-align: middle !important;">
																		                <b>Note:</b><span>:Identification Marks & serial No. of Goods:As per packing list attached</span><br>
																		                <b class="tax1namewo"></b>: <b class="word1"></b><br>
																		                <b class="tax2namewo"></b>: <b class="word2"></b><br>
																		                <b class="tax3namewo"></b>: <b class="word3"></b><br>
																						<br>
																		                <b>Gross total in words:</b> <b class="grandwork"></b>
																		                </td>
																		                <td  colspan="3" style="vertical-align: middle !important;" >
																		                <b>TOTAL INVOICE VALUE:</b><br>
																		                </td>
																		                <td  colspan="2" style="text-align:right; vertical-align: middle !important;">
																		                <span class="grand"></span><br>
																		                </td>
																		                                
																		            </tr>
							   						   		            </tbody>
																		<tbody style="display:none;>
																		               <tr>
																		                   <td colspan="4">
																		                   <span>Particulars</span><br>
																		                   </td>
																		                   <td colspan="1">
																		                   <span>Tax Application</span><br>
																		                   </td>
																		                   <td colspan="2">
																		                   <span>Tax %</span><br>
																		                   </td>
																		                   
																		                   <td  colspan="2">
																		                   <span>Invoice Value</span><br>
																		                   </td>
																		                   <td  colspan="2">
																		                   <span>Payable to dept</span><br>
																		                   </td>
																		                   <td colspan="2">
																		                   <span>Payable by Customer</span><br>
																		                   </td>
																		               </tr>
																		           </tbody>
																				  <tbody style="display:none; height:100px;">
																				   			<tr>

																				   			<td colspan="4" >
																				   			<span id="gstrem"></span><br>
																				   			</td>

																				   			<td colspan="1" style="text-align:right;">
																							<span>Basic</span> </br>
																				   			<span class="tax11name"></span><br>
																				   			<span class="tax12name"></span><br>
																				   			<span class="tax13name"></span><br>
																				   			</td>

																				   			<td colspan="2" style="text-align:right;">
																							<br>
																				   			<span class="tax11per"></span><br>
																				   			<span class="tax12per"></span><br>
																				   			<span class="tax13per"></span><br>
																				   			</td>

																				   		

																				   			<td colspan="2" style="text-align:right;">
																				   			<span id="vallast"></span><br>
																				   			<span id="tax11value"></span><br>
																				   			<span id="tax12value"></span><br>
																				   			<span id="tax13value"></span><br>
																				   			</td>

																				   			<td colspan="2" style="text-align:right;">
																				   			<br>
																				   			<span id="tax111value"></span><br>
																				   			<span id="tax121value"></span><br>
																				   			<span id="tax131value"></span><br>
																				   			</td>

																				   			<td colspan="2" style="text-align:right;">
																				   			<span id="vallast1"></span><br>
																				   			<span id="tax11value1"></span><br>
																				   			<span id="tax12value1"></span><br>
																				   			<span id="tax13value1"></span><br>
																				   			</td>

																				   			</tr>
																				   			</tbody>

																				               <tbody style="display:none; height:100px;">
																				                   <tr>
																				                       <td colspan="5">
																				                       <span>Total</span><br>
																				                       </td>
																				                       <td colspan="1" >
																				                       </td>
																				                       
																				                       <td colspan="1">
																				                       </td>
																				   				
																				   				
																				                       <td  colspan="2"  style="text-align:right;">
																				                       <span id="grandlast"></span><br>
																				                       </td>
																				                       <td  colspan="2"  style="text-align:right;">
																				                       <span id="taxtotal"></span><br>
																				                       </td>
																				                       <td  colspan="2"  style="text-align:right;">
																				                       <span id="grandlast12"></span><br>
																				                       </td>
																				                   </tr>
																				               </tbody>
							   						   		            <tbody>
							   						   		                <tr>
							   						   		                    <td colspan="13" class="Bank_details">
							   						   		                        <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b class="bankname"></b><br>
							   						   		                        <span>ACCOUNT NUMBER:</span><b class="acc"></b><span>,BANK NAME & ADDRESS:</span><b class="bname"></b><b class="add"></b>
							   						   		                        <span>BRANCH CODE:</span><b class="code"></b>, <br><span>SWIFT CODE:</span><b class="scode"></b>,<span>IFSC CODE:</span><b class="ifsc"></b><br>
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
							   						   		                  
							   						   		                    <td  colspan="4">
							   						   		                        <span>For JSW SEVERFIELD STRUCTURES LTD.</span><br>
							   						   		                        <span style="margin-top: 20px; display: inline-block;">(Authorised signature)</span><br>
							   						   		                    </td>
							   						   		                </tr>
							   						   		            </tbody>
							   						   		        </table>
							   						   		        <div class="footer">
							   						   		            <b>Regd Office:</b><span class="reg_add"></span>
							   						   		           <p> (All disputes subject to Karnataka Jurisdiction)E&OE </p>
							   						   		        </div>
							   						   		    </div>
							   						   		`;

        function fillInvoice(container) {
            container.querySelector(".tax1name").textContent = tax1_name;
            container.querySelector(".tax2name").textContent = tax2_name;
            container.querySelector(".tax3name").textContent = tax3_name;
			
			
			
			container.querySelector(".tax11name").textContent = tax1_name;
			         container.querySelector(".tax12name").textContent = tax2_name;
			         container.querySelector(".tax13name").textContent = tax3_name;

            container.querySelector(".tax1per").textContent = tax1_value;
            container.querySelector(".tax2per").textContent = tax2_value;
            container.querySelector(".tax3per").textContent = tax3_value;
			

			container.querySelector(".tax11per").textContent = tax1_value;
			container.querySelector(".tax12per").textContent = tax2_value;
			container.querySelector(".tax13per").textContent = tax3_value;

            container.querySelector(".tax1value").textContent = tax1_data;
            container.querySelector(".tax2value").textContent = tax2_data;
            container.querySelector(".tax3value").textContent = tax3_data;
			
			
			
			
			container.querySelector(".tax1namewo").textContent = tax1_name;
			container.querySelector(".tax2namewo").textContent = tax2_name;
			container.querySelector(".tax3namewo").textContent = tax3_name;

			container.querySelector(".word1").textContent = tax1_word;
			container.querySelector(".word2").textContent = tax2_word;
			container.querySelector(".word3").textContent = tax3_word;
			container.querySelector(".grandwork").textContent = tax4_data;
			
			
			container.querySelector(".grand").textContent = total_invoice_value;


            container.querySelector(".reg_add").textContent = reg_addresss;
            container.querySelector(".gst_code").textContent = Gst_Code;
            container.querySelector(".state_code").textContent = state_Code;
            container.querySelector('.facotry_address').innerHTML = formatAddress(factory_Address);
            container.querySelector('.datetime').textContent = formattedDateTime;
            container.querySelector('.dateor').textContent = currentDate;
            container.querySelector('.date').textContent = currentDate;
            container.querySelector('.invoiceNumber').textContent = invoiceno;
            //container.querySelector('.shipto11').textContent = invoice_to_id_value;
			const fullText = invoice_to_id_value || "";

					   // Normalize spaces
					   const cleanText = fullText.replace(/\s+/g, " ").trim();

					   // Split: COMPANY | PROJECT | ADDRESS
					   const match = cleanText.match(/^(.*?)\s*(PROJECT\s*[:\-]\s*[^,]+)(.*)$/i);

					   if (match) {
					       const company = match[1].trim();      // JSW STEEL LIMITED
					       const project = match[2].trim();      // PROJECT: Utility Structure...
					       const address = match[3].trim();      // FULL remaining address

					       container.querySelector('.shipto11').textContent = company;
					       container.querySelector('.projectname').textContent = project;
					       container.querySelector('.fulladdress').textContent = address;

					   } else {
					       // fallback (if PROJECT not found)
					       container.querySelector('.shipto11').textContent = fullText;
					       container.querySelector('.projectname').textContent = "";
					       container.querySelector('.fulladdress').textContent = "";
					   }
            container.querySelector('.taxpayre').textContent = tax_payable;
            container.querySelector('.areano').textContent = area_no;
            container.querySelector('.contlo').textContent = containter_no;
            container.querySelector('.lutno').textContent = lot_no;
            container.querySelector('.epoglo').textContent = epcgno;
            container.querySelector('.trans').textContent = transport_name;
            container.querySelector('.lrdoc').textContent = lr_docketno;
            container.querySelector('.lrdate').textContent = date_val;
            container.querySelector('.shipmo').textContent = shipment_mode_id_value;
            container.querySelector('.delcon').textContent = delivery_condition_id_value;
            //container.querySelector('.conadd').textContent = consignee_id_value;
			const fullConsignee = consignee_id_value || "";

						// Normalize
						const cleanConsignee = fullConsignee.replace(/\s+/g, " ").trim();

						// Split using PROJECT
						const matchCon = cleanConsignee.match(/(.*?)(PROJECT\s*[:\-]\s*.*)/i);

						if (matchCon) {
						    container.querySelector('.conname').textContent = matchCon[1].trim();
						    container.querySelector('.conproject').textContent = matchCon[2].trim();

						    // Extract address (remaining part after project)
						    const remaining = cleanConsignee.replace(matchCon[0], "").trim();
						    container.querySelector('.conaddress').textContent = remaining;

						} else {
						    container.querySelector('.conname').textContent = fullConsignee;
						    container.querySelector('.conproject').textContent = "";
						    container.querySelector('.conaddress').textContent = "";
						}
            container.querySelector('.workor').textContent = work_id_value;
            container.querySelector('.vehino').textContent = vechile_no;
            container.querySelector('.contrefno').textContent = con_code_with_lot_no;
            container.querySelector('.statename').textContent = consigneeStateName;
            container.querySelector('.state').textContent = invoiceStateName;
            container.querySelector('.stateco').textContent = invoiceStateCode;
            container.querySelector('.stcode11').textContent = consigneeStateCode;
            container.querySelector('.congst').textContent = invoiceGstNo;
            container.querySelector('.ingst').textContent = consigneeGstNo;
            container.querySelector('.pancon').textContent = invoicePanNo;
            container.querySelector('.panin').textContent =  consigneePanNo;
            container.querySelector('.freight').textContent = freight;
            /*   container.querySelector('.pitotal').textContent = total_pices;*/
            container.querySelector('.qtytotal').textContent = total_qty;
            container.querySelector('.wiegtotal').textContent = total_kgs;
            container.querySelector('.val11').textContent = basic_value;
           /* container.querySelector('.grandlast').textContent = Grand_Total_tax;*/
          /*  container.querySelector('.grandlast12new').textContent = PBC_Final_total;*/
            container.querySelector('.bankname').textContent = bankName;
            container.querySelector('.acc').textContent = account_number;
            container.querySelector('.bname').textContent = branch_address;
            container.querySelector('.code').textContent = branch_code;
            container.querySelector('.scode').textContent = swift_code;
            container.querySelector('.ifsc').textContent = ifsc_code;
          /*  container.querySelector('.taxbasic').textContent = Total_adv_tax_Taxable;*/
           /* container.querySelector('.taxtotal').textContent = Tax_Final_total;*/
        }

        function autoFitInvoice(container) {
            const invoice = container.querySelector(".invoice-container");
            const maxHeight = 1000;
            let fontSize = 9;

            function applySize(size) {
                invoice.style.fontSize = size + "px";
                invoice.querySelectorAll("td, th").forEach(el => {
                    el.style.fontSize = size + "px";
                    el.style.padding = "1px 2px";
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

        function shrinkLongDescriptions(container) {
            container.querySelectorAll(".desc-col").forEach(td => {
                const textLength = td.textContent.length;
                if (textLength > 200) {
                    td.classList.add("desc-small");
                    td.classList.add("desc-xsmall");
                }
            });
        }
		function downloadInvoicePDF(htmlContent, fillInvoice, hideLoader) {
				    const prange = [
				        "Original For Recipient",
				        "Duplicate For Transporter",
				        "Triplicate For Supplier"
				    ];

				    // Open new window
				    const printWindow = window.open('', '_blank');

				    if (!printWindow) {
				        alert("Popup blocked! Please allow popups.");
				        hideLoader();
				        return;
				    }

				    // Build full HTML
				    let fullHTML = `
				        <html>
				        <head>
				            <title>Invoice PDF</title>
				            <style>
				                @page {
				                    size: A4;
				                    margin: 10mm;
				                }

				                body {
				                    margin: 0;
				                    padding: 0;
				                    font-family: Calibri, Arial, sans-serif;
				                }

				                .page {
				                    width: 100%;
				                    max-width: 210mm;
				                    margin: 0 auto;
				                    page-break-after: always;
				                }

				                .page:last-child {
				                    page-break-after: avoid;
				                }

				                @media print {
				                    body {
				                        margin: 0;
				                    }

				                    .page {
				                        page-break-after: always;
				                    }

				                    .page:last-child {
				                        page-break-after: avoid;
				                    }
				                }
				            </style>
				        </head>
				        <body>
				    `;

				    // Create pages dynamically
				    prange.forEach(label => {
				        const temp = document.createElement("div");
				        temp.classList.add("page");
				        temp.innerHTML = htmlContent;

				        // Set copy label
				        const labelEl = temp.querySelector(".copy-label");
				        if (labelEl) labelEl.textContent = label;

				        // Fill dynamic data
				        fillInvoice(temp);

				        fullHTML += temp.outerHTML;
				    });

				    fullHTML += `
				        </body>
				        </html>
				    `;

				    // Write to new window
				    printWindow.document.open();
				    printWindow.document.write(fullHTML);
				    printWindow.document.close();

				    // Wait for rendering then print
				    printWindow.onload = () => {
				        setTimeout(() => {
				            printWindow.focus();
				            printWindow.print();
				            printWindow.close();
				            hideLoader();
				        }, 500); // small delay ensures styles/fonts load
				    };
				}

		       downloadInvoicePDF(htmlContent, fillInvoice, hideLoader);

    } catch (error) {
        /*hideLoader();  */
        console.error('Error generating PDF:', error);
    }

}

function openModalcancel(id, other_pn_id) {
		  // const allowed = window.allowedActions || [];

	if (!allowed.includes("Cancel")) {
	  alert(" You do not have permission to Cancel.");
	  $('#exampleModalCenter16').modal('hide');
	  return;
	}
    // Open the modal
    $('#exampleModalCenter16').modal('show');

    // Store the id and pn_id in the modal's data attributes
    $('#exampleModalCenter16').attr('data-id', id);
    $('#exampleModalCenter16').attr('data-pn-id', other_pn_id);
}
function cancelRecord(id, other_pn_id) {
    var id = $('#exampleModalCenter16').attr('data-id');
    var other_pn_id = $('#exampleModalCenter16').attr('data-pn-id');
    $.ajax({
        url: new URL('/jssl/othersinvoice/cancelbyidnew', baseUrl),   // cancel endpoint
        type: 'POST',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: jQuery.param({
            id: id,
            cancelled_by: createdById,
            other_pn_id: other_pn_id
        }),
        success: function(data) {

            var result = data.message;

            if (result === "Success") {

                const popup = $('<div class="popup"> Invoice Cancelled Successfully!</div>')
                    .appendTo('body')
                    .hide()
                    .fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'OtherInvoiceEntry.jsp';
                    });
                }, 800);

            } else {
                alert(data.message || "Cancel failed");
            }
        },
        error: function() {
            console.error('Cancel request failed.');
        }
    });

}

function showLoader() {
  document.getElementById("pdfLoader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("pdfLoader").style.display = "none";
}


function formatAddress(address) {
    if (!address) return '';

    return address
        .split(',')
        .map(part => part.trim())
        .join('<br>');
}