let allowed = null;



// Select2 init. target = id string OR a DOM element. Finds the parent modal itself.
function s2(target, placeholder) {
    const $el = (typeof target === 'string') ? $('#' + target) : $(target);
    if (!$el.length) return;
    if ($el.hasClass('select2-hidden-accessible')) $el.select2('destroy');
    const $modal = $el.closest('.modal');
    $el.select2({
        dropdownParent: $modal.length ? $modal : $(document.body),
        width: '100%',
        placeholder: placeholder || $el.find('option:first').text(),
        allowClear: false,
        minimumResultsForSearch: 0
    });
}

// Select2 only fires jQuery events. This re-fires a native 'change' so your
// existing addEventListener("change") handlers (cont, load, intype444 ...) keep working.
$(document).on('select2:select select2:clear', 'select', function () {
    this.dispatchEvent(new Event('change'));
});

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

// ---------- Shared helper ----------
function normalizeText(str) {
    return (str || "").replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Dedupe a list of {id, label} records by normalized label text.
 * If a duplicate is found, prefer the one whose id matches selectedId
 * (so pre-selection still works correctly even if the backend has
 * two different ids pointing to the same display text).
 */
function dedupeByLabel(records, selectedId) {
    const map = new Map(); // key: normalized label -> record
    records.forEach((rec) => {
        const key = normalizeText(rec.label);
        if (!key) return;
        const existing = map.get(key);
        if (!existing) {
            map.set(key, rec);
        } else if (selectedId && String(rec.id) === String(selectedId)) {
            // incoming one is the actual selected record — prefer it
            map.set(key, rec);
        }
        // else: keep the first one seen, drop this duplicate
    });
    return Array.from(map.values());
}

function populateSelect(selectElement, records, selectedId, placeholder, fallbackText) {
    selectElement.innerHTML = `<option value="">${placeholder}</option>`;

    let matched = false;
    records.forEach((rec) => {
        const option = document.createElement("option");
        option.value = rec.id;
        option.textContent = rec.label;
        if (selectedId && String(rec.id) === String(selectedId)) {
            option.selected = true;
            matched = true;
        }
        selectElement.appendChild(option);
    });

    if (!matched && fallbackText) {
        const fallbackOption = document.createElement("option");
        fallbackOption.value = fallbackText;
        fallbackOption.textContent = fallbackText;
        fallbackOption.selected = true;
        selectElement.insertBefore(fallbackOption, selectElement.children[1] || null);
    }
	
	
	s2(selectElement.id);
}


let hsnMasterList = [];
let serviceMasterList = [];

async function fetchhsn() {
    try {
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch hsn codes");

        const json = await response.json();

        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No hsn codes found.");
            return;
        }

        // Cache globally for per-row dropdowns
        hsnMasterList = json.Data;

    } catch (error) {
        console.error("Error fetching hsn codes:", error);
    }
}

async function fetchservice() {
    try {
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch service codes");

        const json = await response.json();

        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No service codes found.");
            return;
        }

        // Cache globally for per-row dropdowns
        serviceMasterList = json.Data;

    } catch (error) {
        console.error("Error fetching service codes:", error);
    }
}

let taxMasterList = [];

async function fetchTaxMasterList() {
    try {
        const url = new URL("/jssl/taxmasters/list", baseUrl);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch tax master list.");
        }

        const json = await response.json();

        if (json.status !== "yes") {
            console.warn("No tax master records found.", json);
            taxMasterList = [];
            return;
        }

        taxMasterList = Array.isArray(json.Data) ? json.Data : [];

        console.log("Tax master list:", taxMasterList);

    } catch (error) {
        console.error("Error fetching tax master list:", error);
        taxMasterList = [];
    }
}

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
	fetchhsn();
	fetchservice();
	fetchBusinessUnitList();       
    fetchInvoiceAddressList();     
	fetchWorkOrderList();          
	fetchConsigneeAddressList();   
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchCont(selectedFactoryId); // Fetch contractor list on page load
    } else {
        console.error("No factory ID found in sessionStorage.");
    }

    // Add event listener for contractor dropdown change
    document.getElementById("cont").addEventListener("change", function () {
        const selectedContractorId = this.value; // Get selected contractor ID
        const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory ID again

        if (selectedContractorId) {
            fetchLoad(selectedFactoryId, selectedContractorId); // Fetch load dropdown
        } else {
            console.warn("No contractor selected.");
            document.getElementById("load").innerHTML = `<option value="">Select load</option>`; // Clear load dropdown
            document.getElementById("inputFieldsContainer").style.display = "none"; // Hide the input fields container
        }
    });
    
  // Add event listener for load dropdown change
    document.getElementById("load").addEventListener("change", function () {
        const selectedContractorId = document.getElementById("cont").value; // Get selected contractor ID
        const selectedLoadId = this.value; // Get selected load ID

        if (selectedContractorId && selectedLoadId) {
            document.getElementById("inputFieldsContainer").style.display = "block"; // Show the input fields container
            fetchQsPackingData(selectedContractorId, selectedLoadId); // Fetch the QsPacking data and populate the fields
        } else {
            document.getElementById("inputFieldsContainer").style.display = "none"; // Hide if not selected
        }
    });
	
	
	s2('cont', 'Select contractor');
	s2('load', 'Select load');
});



// Fetch the contractor list
async function fetchCont(factoryId) {
    try {
        const url = new URL(`/jssl/getlistcontractorsfromqspackingnew`, baseUrl);
        url.searchParams.append("factory_id", selectedFactoryId);

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch contractors");

        const json = await response.json(); // ✅ This line defines `json`

        if (json.status !== "yes" || !json.DATA || !json.DATA.length) {
            console.warn("No contractors found.");
            return;
        }

        const selectElement = document.getElementById("cont");
        selectElement.innerHTML = `<option value="">Select contractor</option>`;

        json.DATA.forEach((type) => {
            if (type.contract_id && type.contract_name) {
                const option = document.createElement("option");
                option.value = type.contract_id;
                option.textContent = type.contract_name;
                selectElement.appendChild(option);
            }
        });
		
		s2('cont', 'Select contractor');  
    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

// Fetch the load list based on factoryId and selected contractorId (con_id)
/*async function fetchLoad(factoryId, contractId) {
    try {
        const url = new URL(`/jssl/getlistloadidforthatcontractorsfromqspackingnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);
        url.searchParams.append("con_id", contractId); // Pass selected contractor ID

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch loads");

        const json = await response.json();

        if (json.status !== "yes" || !json.DATA.length) {
            console.warn("No loads found.");
            return;
        }

        const selectElement = document.getElementById("load");
        selectElement.innerHTML = `<option value="">Select load</option>`;

        json.DATA.forEach((type) => {
            if (type.load_id && type.lot_no) {
                const option = document.createElement("option");
                option.value = type.load_id;
                option.textContent = type.lot_no;
                selectElement.appendChild(option);
            }
        });
		
		
    } catch (error) {
        console.error("Error fetching loads:", error);
    }
}*/

async function fetchLoad(factoryId, contractId) {
    try {
        const url = new URL(`/jssl/getlistloadidforthatcontractorsfromqspackingnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);
        url.searchParams.append("con_id", contractId);

        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch loads");
        const json = await response.json();

        const selectElement = document.getElementById("load");
        selectElement.innerHTML = `<option value="">Select load</option>`;

        if (json.status === "yes" && json.DATA && json.DATA.length) {
            json.DATA.forEach((type) => {
                if (type.load_id && type.lot_no) {
                    const option = document.createElement("option");
                    option.value = type.load_id;
                    option.textContent = type.lot_no;
                    selectElement.appendChild(option);
                }
            });
        } else {
            console.warn("No loads found.");
        }

        s2('load', 'Select load');
    } catch (error) {
        console.error("Error fetching loads:", error);
    }
}

async function fetchSalebusunit(targetId = "bus", currentValueText = null) {
    try {
        const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No sale order types found.");
            return;
        }

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        selectElement.innerHTML = `<option value="">Select Business Unit</option>`;

        //let matchFound = false;

		json.Data.forEach((type) => {
		    if (type.business_unit_id && type.business_unit_name) {
		        const bindaddress = type.business_unit_name + type.location + '(' + type.gst_number + ')';

		        const option = document.createElement("option");
		        option.value = type.business_unit_id;
		        option.textContent = bindaddress;

		        // Loosen the match — check if currentValueText starts with the business unit name
		        if (currentValueText && currentValueText.startsWith(type.business_unit_name)) {
		            option.selected = true;
		            //matchFound = true;
		        }

		        selectElement.appendChild(option);
		    }
			
		});
		s2(targetId, 'Select business unit');  

        // Only add currentValueText as a fallback option if it wasn't found in the API list
        /*if (currentValueText && !matchFound) {
            const currentOption = document.createElement("option");
            currentOption.value = currentValueText;
            currentOption.textContent = currentValueText;
            currentOption.selected = true;
            selectElement.insertBefore(currentOption, selectElement.firstChild.nextSibling);
        }*/
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchinvoiceto(targetId = "into", currentValueText = null) {
    try {
        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddress`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch invoice addresses");
        const json = await response.json();
        if (json.status !== "yes" || !json.InvoiceAddress?.length) {
            console.warn("No invoice addresses found.");
            return;
        }

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.InvoiceAddress
            .filter(t => t.is_verified == 1 && t.id && t.address)
            .map(t => ({ id: t.id, label: t.address }));

        // find id matching currentValueText by exact address text, if any
        let matchedId = null;
        const match = records.find(r => normalizeText(r.label) === normalizeText(currentValueText));
        if (match) matchedId = match.id;

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select invoice to", matchedId ? null : currentValueText);
    } catch (error) {
        console.error("Error fetching invoice addresses:", error);
    }
}

async function fetchSalework(targetId = "work", currentValueText = null) {
    try {
        const url = new URL(`/jssl/contract/listworkordernew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch work orders");
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No work orders found.");
            return;
        }

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.work_id && t.workorder_no)
            .map(t => ({ id: t.work_id, label: t.workorder_no }));

        let matchedId = null;
        const match = records.find(r => normalizeText(r.label) === normalizeText(currentValueText));
        if (match) matchedId = match.id;

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select work order", matchedId ? null : currentValueText);
    } catch (error) {
        console.error("Error fetching work orders:", error);
    }
}

async function fetchconname(targetId = "consig", currentValueText = null) {
    try {
        const url = new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch consignee addresses");
        const json = await response.json();
        if (json.status !== "yes" || !json.ConsigneeAddress?.length) {
            console.warn("No consignee addresses found.");
            return;
        }

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.ConsigneeAddress
            .filter(t => t.is_verified == 1 && t.id && t.address)
            .map(t => ({ id: t.id, label: t.address }));

        let matchedId = null;
        const match = records.find(r => normalizeText(r.label) === normalizeText(currentValueText));
        if (match) matchedId = match.id;

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select", matchedId ? null : currentValueText);
    } catch (error) {
        console.error("Error fetching consignee addresses:", error);
    }
}

let invoiceBasicAmount = 0;

function calculateInvoiceTaxes() {

    // Basic amount = sum of packing row totals (+ freight), NOT the grand total box
    const basicAmount = invoiceBasicAmount;

    const taxFields = [
        { taxId: "tax_id_1", percentageId: "tax_per_1", valueId: "tax_value_1" },
        { taxId: "tax_id_2", percentageId: "tax_per_2", valueId: "tax_value_2" },
        { taxId: "tax_id_3", percentageId: "tax_per_3", valueId: "tax_value_3" }
    ];

    let totalTax = 0;

    taxFields.forEach(field => {

        const taxSelect       = document.getElementById(field.taxId);
        const percentageInput = document.getElementById(field.percentageId);
        const valueInput      = document.getElementById(field.valueId);

        if (!taxSelect || !percentageInput || !valueInput) return;

        let taxAmount = 0;

        if (taxSelect.value !== "") {
            const percentage = parseFloat(percentageInput.value || 0) || 0;
            // Round to nearest whole rupee
            taxAmount = Math.round((basicAmount * percentage) / 100);
        }

        valueInput.value = taxAmount.toFixed(2);
        totalTax += taxAmount;
    });

    const grandTotal = basicAmount + totalTax;

    // Show grand total = basic + all three taxes
    const grandInput = document.getElementById("ingrandv");
    if (grandInput) grandInput.value = grandTotal.toFixed(2);

    return { basicAmount, totalTax, grandTotal };
}

// Fetch the QsPacking data using contractor_id and load_id
// Used to ignore stale responses if the user changes the percentage quickly
let qsPackingRequestSeq = 0;

async function fetchQsPackingData(contractId, loadId, fromPercentChange = false) {

    try {

        const selectedFactoryId =
            sessionStorage.getItem("selectedFactoryId");

        if (!selectedFactoryId) {
            console.error("No factory ID found in sessionStorage.");
            return;
        }

        const percentageElement =
            document.getElementById("percen");

        // ------------------------------------------------------------
        // PERCENTAGE CHANGE LISTENER
        // ------------------------------------------------------------
        if (
            percentageElement &&
            !percentageElement.dataset.changeListenerAdded
        ) {

            percentageElement.addEventListener("change", async function () {

                const c = document.getElementById("cont").value;
                const l = document.getElementById("load").value;

                if (!c || !l) return;

                if (this.value.trim() === "") return;

                await fetchQsPackingData(c, l, true);

            });

            percentageElement.dataset.changeListenerAdded = "true";
        }

        // ------------------------------------------------------------
        // LOAD TAX MASTER LIST
        // ------------------------------------------------------------
        if (!taxMasterList || taxMasterList.length === 0) {
            await fetchTaxMasterList();
        }

        // ------------------------------------------------------------
        // BUILD API URL
        // ------------------------------------------------------------
        const url = new URL(
            "/jssl/invoice/getcontractqspackingdetailsnew",
            baseUrl
        );

        url.searchParams.append("contract_id", contractId);
        url.searchParams.append("load_id", loadId);
        url.searchParams.append("factory_id", selectedFactoryId);

        // ------------------------------------------------------------
        // PERCENTAGE CHANGE
        // ------------------------------------------------------------
        if (fromPercentChange) {

            const pctNow = percentageElement
                ? percentageElement.value.trim()
                : "";

            if (pctNow !== "") {
                url.searchParams.append("percentage_value", pctNow);
            }
        }

        const mySeq = ++qsPackingRequestSeq;

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch QsPacking data.");
        }

        const json = await response.json();

        // Ignore stale response
        if (mySeq !== qsPackingRequestSeq) return;

        // ------------------------------------------------------------
        // COMMON SET VALUE FUNCTION
        // ------------------------------------------------------------
        const setVal = (id, value) => {

            const element = document.getElementById(id);

            if (element) {
                element.value = value ?? "";
            }
        };

        let contractor = null;

		// Basic amount = sum of all packing row totals + freight
		const packingRows = Array.isArray(json.QsPacking_Data) ? json.QsPacking_Data : [];

		const rowsTotal = packingRows.reduce(
		    (sum, r) => sum + (parseFloat(r.total) || 0), 0
		);

		const freightValue =
		    packingRows.length > 0
		        ? (parseFloat(packingRows[0].freight) || 0)
		        : 0;

		invoiceBasicAmount = rowsTotal + freightValue;

        // ------------------------------------------------------------
        // FREIGHT AND PACKING NOTE ID
        // ------------------------------------------------------------
        if (
            json.QsPacking_Data &&
            json.QsPacking_Data.length > 0
        ) {

            const QsPacking = json.QsPacking_Data[0];

            setVal("freight", QsPacking.freight);
            setVal("id11", QsPacking.pn_id);

        } else {

            console.warn("No QsPacking data found.");

        }

        // ------------------------------------------------------------
        // TAX 1, TAX 2 AND TAX 3
        // ------------------------------------------------------------
        const taxContainer =
            document.querySelector(".dynamic-row1");

        if (!taxContainer) {

            console.error("Element .dynamic-row1 not found.");

        } else {

            taxContainer.innerHTML = "";

            const existingTaxes = Array.isArray(json.tax)
                ? json.tax
                : [];

            const taxFields = [
                { id: "tax_id_1", percentageId: "tax_per_1", valueId: "tax_value_1" },
                { id: "tax_id_2", percentageId: "tax_per_2", valueId: "tax_value_2" },
                { id: "tax_id_3", percentageId: "tax_per_3", valueId: "tax_value_3" }
            ];

            taxFields.forEach((field, index) => {

                const existingTax = existingTaxes[index] || {};

                const selectedTaxId =
                    existingTax.tax_id != null
                        ? String(existingTax.tax_id)
                        : "";

                // Main row
                const div = document.createElement("div");

                div.className = "form-row align-items-center";

                // ----------------------------------------------------
                // TAX NAME
                // ----------------------------------------------------
                const nameDiv = document.createElement("div");

                nameDiv.className =
                    "form-group col-md-4 col-sm-12";

                const nameRow = document.createElement("div");

                nameRow.className =
                    "d-flex align-items-center";

                const nameLabel = document.createElement("label");

                nameLabel.htmlFor = field.id;
                nameLabel.className = "mb-0 mr-2";
                nameLabel.style.minWidth = "105px";
                nameLabel.innerHTML = "<b>Tax Name</b>";

                const taxSelect = document.createElement("select");

                taxSelect.id = field.id;
                taxSelect.name = field.id;
                taxSelect.className = "form-control";

                const defaultOption =
                    document.createElement("option");

                defaultOption.value = "";
                defaultOption.textContent = "Select Tax";

                taxSelect.appendChild(defaultOption);

                // Populate tax master options
                taxMasterList.forEach(tax => {

                    const option = document.createElement("option");

                    option.value = tax.tax_id;

                    option.textContent =
                        tax.tax_name + " - " + tax.tax_per + "%";

                    if (String(tax.tax_id) === selectedTaxId) {
                        option.selected = true;
                    }

                    taxSelect.appendChild(option);

                });

                // Retain existing tax if missing from master list
                if (
                    selectedTaxId &&
                    !taxMasterList.some(
                        tax => String(tax.tax_id) === selectedTaxId
                    )
                ) {

                    const option = document.createElement("option");

                    option.value = selectedTaxId;

                    option.textContent =
                        existingTax.tax_name || "Existing Tax";

                    option.selected = true;

                    taxSelect.appendChild(option);
                }

                nameRow.appendChild(nameLabel);
                nameRow.appendChild(taxSelect);

                // ----------------------------------------------------
                // DUPLICATE TAX VALIDATION MESSAGE
                // ----------------------------------------------------
                const taxError = document.createElement("small");

                taxError.className = "text-danger tax-error";
                taxError.style.display = "none";

                taxError.textContent =
                    "This tax is already selected.";

                nameDiv.appendChild(nameRow);
                nameDiv.appendChild(taxError);

                // ----------------------------------------------------
                // TAX PERCENTAGE
                // ----------------------------------------------------
                const percentageDiv =
                    document.createElement("div");

                percentageDiv.className =
                    "form-group col-md-4 col-sm-12";

                const percentageRow =
                    document.createElement("div");

                percentageRow.className =
                    "d-flex align-items-center";

                const percentageLabel =
                    document.createElement("label");

                percentageLabel.htmlFor = field.percentageId;
                percentageLabel.className = "mb-0 mr-2";
                percentageLabel.style.minWidth = "130px";
                percentageLabel.innerHTML =
                    "<b>Tax Percentage</b>";

                const percentageInput =
                    document.createElement("input");

                percentageInput.type = "text";
                percentageInput.id = field.percentageId;
                percentageInput.className = "form-control";

                // Get percentage from tax master first.
                const initialTax = taxMasterList.find(
                    tax => String(tax.tax_id) === selectedTaxId
                );

                percentageInput.value = initialTax
                    ? parseFloat(initialTax.tax_per || 0).toFixed(2)
                    : parseFloat(existingTax.tax_per || 0).toFixed(2);

                percentageInput.disabled = true;

                percentageRow.appendChild(percentageLabel);
                percentageRow.appendChild(percentageInput);

                percentageDiv.appendChild(percentageRow);

                // ----------------------------------------------------
                // TAX VALUE
                // ----------------------------------------------------
                const valueDiv = document.createElement("div");

                valueDiv.className =
                    "form-group col-md-4 col-sm-12";

                const valueRow = document.createElement("div");

                valueRow.className =
                    "d-flex align-items-center";

                const valueLabel =
                    document.createElement("label");

                valueLabel.htmlFor = field.valueId;
                valueLabel.className = "mb-0 mr-2";
                valueLabel.style.minWidth = "95px";
                valueLabel.innerHTML = "<b>Tax Value</b>";

                const valueInput =
                    document.createElement("input");

                valueInput.type = "text";
                valueInput.id = field.valueId;
                valueInput.className =
                    "form-control text-right";

				valueInput.value = "0.00";
                valueInput.disabled = true;

                valueRow.appendChild(valueLabel);
                valueRow.appendChild(valueInput);

                valueDiv.appendChild(valueRow);

                // ----------------------------------------------------
                // APPEND THREE COLUMNS
                // ----------------------------------------------------
                div.appendChild(nameDiv);
                div.appendChild(percentageDiv);
                div.appendChild(valueDiv);

                taxContainer.appendChild(div);

                // ----------------------------------------------------
                // DUPLICATE TAX VALIDATION + CALCULATION
                // ----------------------------------------------------
                let previousTaxId = taxSelect.value;

                taxSelect.addEventListener("change", function () {

                    const selectedTaxId = this.value;

                    const allTaxDropdowns = [
                        document.getElementById("tax_id_1"),
                        document.getElementById("tax_id_2"),
                        document.getElementById("tax_id_3")
                    ];

                    const duplicateTax = allTaxDropdowns.some(
                        dropdown => {

                            return dropdown &&
                                dropdown !== this &&
                                selectedTaxId !== "" &&
                                dropdown.value === selectedTaxId;

                        }
                    );

                    // Duplicate selection
                    if (duplicateTax) {

                        taxError.style.display = "block";

                        this.value = previousTaxId;

                        return;
                    }

                    taxError.style.display = "none";

					// Update previous valid selection.
					previousTaxId = selectedTaxId;

					// Find selected tax details.
					const selectedTax = taxMasterList.find(
					    tax => String(tax.tax_id) === String(selectedTaxId)
					);

					percentageInput.value = selectedTax
					    ? parseFloat(selectedTax.tax_per || 0).toFixed(2)
					    : "0.00";

					// Recalculate all three taxes.
					calculateInvoiceTaxes();

                });

            });

            // --------------------------------------------------------
            // CALCULATE ALL THREE TAXES AFTER RENDERING
            // --------------------------------------------------------
            calculateInvoiceTaxes();

        }

        // ------------------------------------------------------------
        // IF ONLY PERCENTAGE CHANGED, STOP HERE
        // ------------------------------------------------------------
        if (fromPercentChange) return;

        // ------------------------------------------------------------
        // CONTRACTOR / CONTRACT DETAILS
        // ------------------------------------------------------------
        if (
            json.Contractor_Data &&
            json.Contractor_Data.length > 0
        ) {

            contractor = json.Contractor_Data[0];

            setVal("bank", contractor.bank_details_id_value);

            fetchSalework(
                "work",
                contractor.work_id_value
            );

            setVal(
                "intypecal",
                contractor.invoice_type_calculation
            );

            fetchinvoiceto(
                "ininto",
                contractor.invoice_to_id_value
            );

            setVal(
                "prodesc",
                contractor.product_desc_id
            );

            setVal(
                "shipmode",
                contractor.shipment_mode_id_value
            );

            setVal("expt", contractor.export);

            setVal(
                "taxres",
                contractor.tax_payable
            );

            // Contract default percentage
            setVal(
                "percen",
                contractor.percentage_value
            );

            fetchconname(
                "billing",
                contractor.consignee_id_value
            );

            setVal(
                "delivery",
                contractor.delivery_condition_id_value
            );

            setVal(
                "office",
                contractor.reg_office_id_value
            );

            if (contractor.export === "yes") {

                $("#exportFields1").show();

            } else {

                $("#exportFields1").hide();

            }

            setVal("are", contractor.area_no);
            setVal("lut", contractor.lot_no);
            setVal("connum", contractor.containter_no);
            setVal("epog", contractor.epcgno);
            setVal("exptitle", contractor.export_title);
            setVal("service", contractor.s_code_value);
            setVal("hsncode", contractor.h_code_value);

            fetchSalebusunit(
                "inbusunit",
                contractor.businessUnitName
            );

            setVal(
                "id11con",
                contractor.con_slno
            );

        } else {

            console.warn("No Contractor Data found.");

        }

        // ------------------------------------------------------------
        // PACKING ROWS WITH SERVICE / HSN DROPDOWNS
        // ------------------------------------------------------------
        if (
            json.QsPacking_Data &&
            json.QsPacking_Data.length > 0
        ) {

            const container =
                document.querySelector(".dynamic-row");

            if (!container) {

                console.error("Element .dynamic-row not found.");
                return;

            }

            container.innerHTML = "";

            const contractorServiceCode = contractor
                ? contractor.s_code_value
                : null;

            const contractorHsnCode = contractor
                ? contractor.h_code_value
                : null;

            json.QsPacking_Data.forEach((item, index) => {

                const showLabel = index === 0;

                const rowServiceCode =
                    item.scode || contractorServiceCode || "";

                const rowHsnCode =
                    item.hsncode || contractorHsnCode || "";

                const div = document.createElement("div");

                div.classList.add(
                    "form-group-container",
                    "col-md-12"
                );

                const serviceOptions = serviceMasterList.map(s => `

                    <option value="${s.service_code}"
                        ${
                            String(s.service_code) ===
                            String(rowServiceCode)
                                ? "selected"
                                : ""
                        }>
                        ${s.service_code} - ${s.service_description}
                    </option>

                `).join("");

                const hsnOptions = hsnMasterList.map(h => `

                    <option value="${h.service_code}"
                        ${
                            String(h.service_code) ===
                            String(rowHsnCode)
                                ? "selected"
                                : ""
                        }>
                        ${h.service_code} - ${h.service_description}
                    </option>

                `).join("");

                div.innerHTML = `

                    <div class="form-row flex-nowrap">

                        <div class="form-group col-md-1 col-sm-12">
                            ${showLabel ? "<label><b>UOM</b></label>" : ""}
                            <input type="text"
                                   value="${item.uom_name ?? ""}"
                                   class="form-control form-control-sm"
                                   disabled>
                        </div>

                        <div class="form-group col-md-1 col-sm-12">
                            ${showLabel ? "<label><b>Quantity</b></label>" : ""}
                            <input type="number"
                                   value="${item.qty ?? ""}"
                                   class="form-control form-control-sm text-right"
                                   disabled>
                        </div>

                        <div class="form-group col-md-1 col-sm-12">
                            ${showLabel ? "<label><b>Kg</b></label>" : ""}
                            <input type="number"
                                   value="${item.per_kgs ?? ""}"
                                   class="form-control form-control-sm text-right"
                                   disabled>
                        </div>

                        <div class="form-group col-md-1 col-sm-12">
                            ${showLabel ? "<label><b>Unit Price</b></label>" : ""}
                            <input type="number"
                                   value="${item.unit_price ?? ""}"
                                   class="form-control form-control-sm text-right"
                                   disabled>
                        </div>

                        <div class="form-group col-md-1 col-sm-12">
                            ${showLabel ? "<label><b>Total</b></label>" : ""}
                            <input type="number"
                                   value="${item.total ?? ""}"
                                   class="form-control form-control-sm text-right"
                                   disabled>
                        </div>

                        <div class="form-group col-md-1 col-sm-12">
                            ${showLabel ? "<label><b>Milestone</b></label>" : ""}
                            <input type="text"
                                   value="${item.milestone_name ?? ""}"
                                   class="form-control form-control-sm"
                                   disabled>
                        </div>

                        <div class="form-group col-md-1 col-sm-12">
                            ${showLabel ? "<label><b>Invoice Type</b></label>" : ""}
                            <input type="text"
                                   value="${item.scrap_name_type_id ?? ""}"
                                   class="form-control form-control-sm"
                                   disabled>
                        </div>

                        <div class="form-group col-md-2 col-sm-12">
                            ${showLabel ? "<label><b>Service Code</b></label>" : ""}

                            <select class="form-control form-control-sm service-code-select"
                                    data-slno="${item.slno || ""}">

                                <option value=""
                                    ${!rowServiceCode ? "selected" : ""}>
                                    Select Service Code
                                </option>

                                ${serviceOptions}

                            </select>

                            <div class="error-message service-code-error"></div>
                        </div>

                        <div class="form-group col-md-2 col-sm-12">
                            ${showLabel ? "<label><b>HSN Code</b></label>" : ""}

                            <select class="form-control form-control-sm hsn-code-select"
                                    data-slno="${item.slno || ""}">

                                <option value=""
                                    ${!rowHsnCode ? "selected" : ""}>
                                    Select HSN Code
                                </option>

                                ${hsnOptions}

                            </select>

                        </div>

                    </div>

                    ${showLabel ? "<hr>" : ""}

                `;

                container.appendChild(div);

            });

        } else {

            console.warn("No QsPacking data found.");

        }

    } catch (error) {

        console.error(
            "Error fetching QsPacking data:",
            error
        );

    }
}


document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchinvoice(selectedFactoryId);
        fetchBgType();
        fetchUserList111(selectedFactoryId);
        fetchinvoiceEdit(selectedFactoryId);
        fetchBgTypeedit();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

/*async function fetchUserList111(selectedFactoryId) {
	try {
        
        // Construct the API URL
        const url = new URL(`/jssl/invoice/listnew`, baseUrl);
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
                    <th>Contract Name</th>
                    <th>Lot Number</th>
                    <th>Invoice Number</th>
                    <th>Invoice  Date</th>
                    <th>Status</th>
                    <th style="display:none;">pnid</th>
                    <th>Edit</th>
                    <th>Verify</th>
                    <th>View</th>
                    <th>Release</th>
					<th>Cancel</th>
                    <th>Print</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.Data.forEach(item => {
	        let editinvoice = '';
	        let editIcon = '';
            //let viewIcon = '';
            let releaseIcon ='';;
            let printIcon = ''; // Print Icon
			let cancelIcon = '';
            
			if (item.status === 'CANCELLED') {

				    editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
				    editIcon    = `<td><i class="fa fa-pen text-muted"></i></td>`;
				    releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
				    cancelIcon  = `<td><i class="fa fa-times-circle text-muted"></i></td>`;

				     ✅ Print allowed 
				    printIcon = `
				        <td>
				            <i class="fa fa-print" style="color: green; cursor: pointer;"
				               onclick="printRecord('${item.id}', '${item.status}')">
				            </i>
				        </td>
				    `;

				 🟢 VERIFIED 
				} else if (item.status === 'VERIFIED') {
	            editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
                editIcon = `<td><i class="fa fa-pen text-muted"></i></td>`; // Disabled (greyed out)
                //viewIcon = `<td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}')"></i></td>`; // Enabled
				printIcon = `<td><i id="printvvvtest" class="fa fa-print" style="color: green;" onclick="printRecord('${item.id}')"></i></td>`; // Enabled
				 printIcon = `<td><i class="fa fa-print" style="color: red;" onclick="printRecord('${item.id}')"></i></td>`; // Enabled
                releaseIcon = `<td><i id="releaseinc"  class="fa fa-box-open" style="color: brown;" onclick="openModal('${item.id}', '${item.pn_id}')"></i></td>`;
				cancelIcon = ` <td><i class="fa fa-times-circle"style="color: red; cursor: pointer;" onclick="openModalcancel('${item.id}', '${item.pn_id}')"></i></td> `;

            } else if (item.status === 'NOT VERIFIED') {
	            editinvoice = `<td><i id="updateinvoice"  class="fa fa-edit" style="color: blue;" onclick="editRecordInvoice('${item.id}', '${item.status}')"></i></td>`; // Enabled
				editIcon = `<td><i id="verfiyinc" class="fa fa-pen" style="color: blue;" onclick="editRecord('${item.id}')"></i></td>`; // Enabled
				 editIcon = `<td><i class="fa fa-pen" style="color: blue;" onclick="editRecord('${item.id}')"></i></td>`; // Enabled
                //viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`; // Disabled (greyed out)
                printIcon = `<td><i class="fa fa-print text-muted"></i></td>`; // Disabled (greyed out)
                releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
				cancelIcon = `<td><i class="fa fa-times-circle text-muted"></i></td>`;
            } else {
	            editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
                editIcon = `<td><i class="fa fa-pen text-muted"></i></td>`;
                //viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`;
                printIcon = `<td><i class="fa fa-print text-muted"></i></td>`;
                releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
				cancelIcon = `<td><i class="fa fa-times-circle text-muted"></i></td>`;
            }
            tableContent += `
                <tr>
                    <td>${item.contract_name}</td>
                    <td>${item.lot_no}</td>
                    <td>${item.invoice_number}</td>
                    <td>${formatDate(item.created_onlydate)}</td>  <!-- Formatted Date -->
                    <td>${item.status}</td>
                    <td style="display:none;">${item.pn_id}</td>
                    ${editinvoice}
                    ${editIcon}
                    <td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}', '${item.status}')"></i></td>
                    ${releaseIcon}
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
}
*/


let currentFactoryIdQSInvoice = null;

function fetchUserList111(selectedFactoryId) {

    currentFactoryIdQSInvoice = selectedFactoryId ||
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

                    const url = new URL(`/jssl/invoice/listnewpaged`, baseUrl);
                    url.searchParams.append('factory_id', currentFactoryIdQSInvoice);
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

                            const exportData = json.Data.map(item => [
                                item.contract_name  || '',
                                item.lot_no         || '',
                                item.invoice_number || '',
                                formatDate(item.created_onlydate),
                                item.status         || ''
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
                                buttons: [{
                                    extend: 'excelHtml5',
                                    title: 'QS Invoice List'
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
            { title: "Lot Number"     },
            { title: "Invoice Number" },
            { title: "Invoice Date"   },
            { title: "Status"         },
            { title: "pnid", visible: false },   // col 5 - hidden
            { title: "Edit Invoice",  orderable: false },
            { title: "Verify",        orderable: false },
            { title: "View",          orderable: false },
            { title: "Release",       orderable: false },
            { title: "Cancel",        orderable: false },
            { title: "Print",         orderable: false }
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

            const url = new URL(`/jssl/invoice/listnewpaged`, baseUrl);
            url.searchParams.append('factory_id', currentFactoryIdQSInvoice);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
			url.searchParams.append('search', searchValue);

            fetch(url, { credentials: "include" })
                .then(response => response.json())
                .then(json => {

                    if (!json.Data || json.status === 'error') {
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });
                        return;
                    }

                    const rows = json.Data.map(item => {

                        let editinvoice = '';
                        let editIcon    = '';
                        let releaseIcon = '';
                        let cancelIcon  = '';
                        let printIcon   = '';
						let viewIcon   = '';

						if (item.status === 'CANCELLED') {

						    editinvoice = `<i class="fa fa-edit text-muted"></i>`;
						    editIcon    = `<i class="fa fa-pen text-muted"></i>`;
						    releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
						    cancelIcon  = `<i class="fa fa-times-circle text-muted"></i>`;
						    printIcon   = `<i class="fa fa-print" style="color:green; cursor:pointer;" onclick="printRecord('${item.id}','${item.status}')"></i>`;

						    // ✅ Enable view icon
						    viewIcon = `<i class="fa fa-eye" style="color:green; cursor:pointer;" onclick="editRecord11('${item.id}','${item.status}')"></i>`;
						}
						else if (item.status === 'VERIFIED') {

						    editinvoice = `<i class="fa fa-edit text-muted"></i>`;
						    editIcon    = `<i class="fa fa-pen text-muted"></i>`;
						    releaseIcon = `<i class="fa fa-box-open" style="color:brown;" onclick="openModal('${item.id}','${item.pn_id}')"></i>`;
						    cancelIcon  = `<i class="fa fa-times-circle" style="color:red; cursor:pointer;" onclick="openModalcancel('${item.id}','${item.pn_id}')"></i>`;
						    printIcon   = `<i class="fa fa-print" style="color:green;" onclick="printRecord('${item.id}')"></i>`;
						    viewIcon    = `<i class="fa fa-eye" style="color:green; cursor:pointer;" onclick="editRecord11('${item.id}','${item.status}')"></i>`;

						}
						else if (item.status === 'NOT VERIFIED') {

						    editinvoice = `<i class="fa fa-edit" style="color:blue;" onclick="editRecordInvoice('${item.id}','${item.status}')"></i>`;
						    editIcon    = `<i class="fa fa-pen" style="color:blue;" onclick="editRecord('${item.id}')"></i>`;
						    releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
						    cancelIcon  = `<i class="fa fa-times-circle text-muted"></i>`;
						    printIcon   = `<i class="fa fa-print text-muted"></i>`;
						    viewIcon    = `<i class="fa fa-eye text-muted"></i>`;

						}
						else {

						    editinvoice = `<i class="fa fa-edit text-muted"></i>`;
						    editIcon    = `<i class="fa fa-pen text-muted"></i>`;
						    releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
						    cancelIcon  = `<i class="fa fa-times-circle text-muted"></i>`;
						    printIcon   = `<i class="fa fa-print text-muted"></i>`;
						    viewIcon    = `<i class="fa fa-eye text-muted"></i>`;
						}

						return [
						    item.contract_name || '',
						    item.lot_no || '',
						    item.invoice_number || '',
						    formatDate(item.created_onlydate),
						    item.status || '',
						    item.pn_id || '',
						    editinvoice,
						    editIcon,
						    viewIcon,
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
                .catch(error => {
                    console.error('Error fetching QS invoice data:', error);
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
		
		s2('intype444');
		// NEW: run once after populating, in case a value is pre-selected
		toggleSubcontractingFields();
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchinvoiceEdit() {
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
		
		s2('intypeeditup');
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchBgType() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listbgtypenew`, baseUrl);
        
        // Fetch data from API
		const response = await fetch(url,{
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
		
		
		s2('bg');
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchBgTypeedit() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listbgtypenew`, baseUrl);
        
        // Fetch data from API
		const response = await fetch(url,{
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
		
		
		s2('bgvaerifyup');
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

function openModalAdd() {

    var username = document.getElementById('intype444').value.trim();
    var prodes = document.getElementById('prodes').value.trim();
    var remark = document.getElementById('remark').value.trim();

    var showError = false;

    // Invoice Type
    if (username === '') {
        document.getElementById('Vehicleerror').innerText =
            "Please select invoice type.";
        document.getElementById('Vehicleerror').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('Vehicleerror').innerText = "";
        document.getElementById('Vehicleerror').style.display = "none";
    }


    // Product Description
    if (prodes === '') {
        document.getElementById('productCodeError3').innerText =
            "Please enter product description.";
        document.getElementById('productCodeError3').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError3').innerText = "";
        document.getElementById('productCodeError3').style.display = "none";
    }


    // Remarks
    if (remark === '') {
        document.getElementById('productCodeError4').innerText =
            "Please enter remarks.";
        document.getElementById('productCodeError4').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError4').innerText = "";
        document.getElementById('productCodeError4').style.display = "none";
    }


    // ============================================
    // HSN / SERVICE CODE
    // At least ONE is mandatory
    // ============================================

    const serviceSelects =
        document.querySelectorAll(".service-code-select");

    const hsnSelects =
        document.querySelectorAll(".hsn-code-select");

    console.log("Service selects:", serviceSelects.length);
    console.log("HSN selects:", hsnSelects.length);

    if (serviceSelects.length === 0 && hsnSelects.length === 0) {

        console.log("No HSN / Service Code fields found.");

    } else {

        const totalRows = Math.max(
            serviceSelects.length,
            hsnSelects.length
        );

        for (let i = 0; i < totalRows; i++) {

            const serviceVal =
                serviceSelects[i]
                    ? serviceSelects[i].value.trim()
                    : '';

            const hsnVal =
                hsnSelects[i]
                    ? hsnSelects[i].value.trim()
                    : '';

            console.log(
                "Row:",
                i,
                "Service:",
                serviceVal,
                "HSN:",
                hsnVal
            );

            // BOTH empty = error
            if (serviceVal === '' && hsnVal === '') {

                showError = true;

                // Find error div corresponding to service select
                if (serviceSelects[i]) {

                    const errorDiv =
                        serviceSelects[i]
                            .parentElement
                            .querySelector(".service-code-error");

                    if (errorDiv) {
                        errorDiv.innerText =
                            "Please select either HSN Code or Service Code.";

                        errorDiv.style.display = "inline-block";
                    }
                }

            } else {

                // At least one selected
                if (serviceSelects[i]) {

                    const errorDiv =
                        serviceSelects[i]
                            .parentElement
                            .querySelector(".service-code-error");

                    if (errorDiv) {
                        errorDiv.innerText = "";
                        errorDiv.style.display = "none";
                    }
                }
            }
        }
    }


    // ============================================
    // OPEN MODAL
    // ============================================

    console.log("showError =", showError);

    if (!showError) {

        console.log("Opening exampleModalCenter66...");

        $('#exampleModalCenter66').modal('show');

    } else {

        console.log("Modal NOT opened because validation failed.");

    }
}
   
// Fetch selectedFactoryId from sessionStorage
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

async function addevent() {
    $('#exampleModalCenter66').modal('hide');

    const selectedCOnt =
        document.getElementById("cont").selectedOptions[0];

    const contid = selectedCOnt ? selectedCOnt.value : '';
    const contname = selectedCOnt ? selectedCOnt.textContent : '';

    // Get three selected tax IDs.
    const tax1 = document.getElementById("tax_id_1");
    const tax2 = document.getElementById("tax_id_2");
    const tax3 = document.getElementById("tax_id_3");

    // Get three corresponding tax values.
    const taxValue1 = document.getElementById("tax_value_1");
    const taxValue2 = document.getElementById("tax_value_2");
    const taxValue3 = document.getElementById("tax_value_3");

    // Save existing Service / HSN selections.
    await saveServiceHsnSelections();

    $.ajax({
        url: new URL('/jssl/invoice/addnew', baseUrl),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        dataType: 'json',

        data: jQuery.param({
            contract_id: contid,
            created_by: createdById,
            load_id: load.value,
            invoice_type: "Steel",
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

            vendorname: vendorname.value,
            vendorinvno: vendorinvno.value,
            vendorqty: vendorqty.value,
            vendorinvdate: vendordate.value,

            s_t_exempted: exe.value,
            lr_docketno: dock.value,
            bg_no: bgno.value,
            date_of_expiry: dateexp.value,
            date_of_ref: dateref.value,
            lc_issue_date: lcdate.value,
            contract_name: contname,
            factory_id: selectedFactoryId,
            inc_type: intype444.value,
            pn_id: id11.value,

            // ---- TAX 1 ----
            tax_id_1: tax1 ? tax1.value : "",
            tax_value_1: taxValue1 ? taxValue1.value : "0.00",

            // ---- TAX 2 ----
            tax_id_2: tax2 ? tax2.value : "",
            tax_value_2: taxValue2 ? taxValue2.value : "0.00",

            // ---- TAX 3 ----
            tax_id_3: tax3 ? tax3.value : "",
            tax_value_3: taxValue3 ? taxValue3.value : "0.00",

            // ---- Contract Details modal fields ----
            business_unit_id:
                document.getElementById("inbusunit").value,

            invoice_type_calculation:
                document.getElementById("intypecal").value,

            invoice_to_id:
                document.getElementById("ininto").value,

            product_desc_id:
                document.getElementById("prodesc").value,

            shipment_mode_id:
                document.getElementById("shipmode").value,

            work_id:
                document.getElementById("work").value,

            export:
                document.getElementById("expt").value,

            tax_ex_inc:
                document.getElementById("taxres").value,

            percentage_value:
                document.getElementById("percen").value,

            consignee_id:
                document.getElementById("billing").value,

            bank_details_id:
                document.getElementById("bank").value,

            delivery_condition_id:
                document.getElementById("delivery").value,

            regd_office_id:
                document.getElementById("office").value
        }),

        success: function (data) {
            var result = data.message;

            if (result === "Success") {

                const popup = $(
                    '<div class="popup">Steel Invoice Created Successfully!</div>'
                )
                    .appendTo('body')
                    .hide()
                    .fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();

                        window.location = 'invoicesidemenu.jsp';
                    });
                }, 800);

            } else {

                const errorMessage =
                    data.message || 'Failed to create invoice.';

                $('#errorMessage').text(errorMessage);

                $('#exampleModalCenterDup').modal('show');
                $('#exampleModalCenter66').modal('hide');
                $('#exampleModalScrollable').modal('hide');
            }
        },

        error: function (xhr, status, error) {
            console.error('Request failed:', error);
            console.error('Status:', status);
            console.error('Response:', xhr.responseText);
        }
    });
}
// Function to safely set values in input fields
/*function setInputValue(selector, value) {
    $(selector).val(value ? value : ""); // Set value or empty string if undefined/null
}*/


function setInputValue(selector, value) {
    const $el = $(selector);
    $el.val(value ? value : "");
    if ($el.hasClass('select2-hidden-accessible')) $el.trigger('change.select2'); // refresh display only
}


let businessUnitList = [];
let invoiceAddressList = [];
let workOrderList = [];
let consigneeAddressList = [];

async function fetchBusinessUnitList() {
    try {
        const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        businessUnitList = (json.status === "yes" && json.Data) ? json.Data : [];
    } catch (error) {
        console.error("Error fetching business unit list:", error);
    }
}

async function fetchInvoiceAddressList() {
    try {
        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddress`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        invoiceAddressList = (json.status === "yes" && json.InvoiceAddress) ? json.InvoiceAddress : [];
    } catch (error) {
        console.error("Error fetching invoice address list:", error);
    }
}

async function fetchWorkOrderList() {
    try {
        const url = new URL(`/jssl/contract/listworkordernew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        workOrderList = (json.status === "yes" && json.Data) ? json.Data : [];
    } catch (error) {
        console.error("Error fetching work order list:", error);
    }
}

async function fetchConsigneeAddressList() {
    try {
        const url = new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        consigneeAddressList = (json.status === "yes" && json.ConsigneeAddress) ? json.ConsigneeAddress : [];
    } catch (error) {
        console.error("Error fetching consignee address list:", error);
    }
}

async function editRecord(id) {
    if (!allowed.includes("Verify")) {
      alert(" You do not have permission to Verify.");
      console.warn("Blocked verify attempt. User lacks verify permission.");
      return;
    }

    console.log(" verify record with ID:", id);
    try {
        const url = new URL(`/jssl/invoice/searchidnew`, baseUrl);
        url.searchParams.append('id', id);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        const packingData = json.QsPacking_Data || [];
        const taxData = json.tax || [];
        const invoiceData = json.Invoice_Data || {};
        const GrandValue = json.Grand_Total_value || [];
        const ContData = json.Contractor_Data || [];

        // ---- Resolve Contract Details display text from InvoiceContractMaster, fallback to ContData ----
        const ContractMasterData = json.InvoiceContractMaster || {};

        const matchedBU = businessUnitList.find(b => String(b.business_unit_id) === String(ContractMasterData.bid));
        const buDisplay = matchedBU
            ? `${matchedBU.business_unit_name} ${matchedBU.orgName},${matchedBU.location},${matchedBU.stateName}(${matchedBU.gst_number})`
            : (ContData.length > 0 ? ContData[0].business_unit_name : "");

        const matchedInvoiceTo = invoiceAddressList.find(a => String(a.id) === String(ContractMasterData.invoice_to_id));
        const invoiceToDisplay = matchedInvoiceTo
            ? matchedInvoiceTo.address
            : (ContData.length > 0 ? ContData[0].invoice_to_id_value : "");

        const matchedWork = workOrderList.find(w => String(w.work_id) === String(ContractMasterData.work_id));
        const workDisplay = matchedWork
            ? matchedWork.workorder_no
            : (ContData.length > 0 ? ContData[0].work_id_value : "");

        const matchedConsignee = consigneeAddressList.find(c => String(c.id) === String(ContractMasterData.consignee_id));
        const consigneeDisplay = matchedConsignee
            ? matchedConsignee.address
            : (ContData.length > 0 ? ContData[0].consignee_id_value : "");

        setInputValue("#bunitv",     buDisplay);
        setInputValue("#intov",      invoiceToDisplay);
        setInputValue("#workorderv", workDisplay);
        setInputValue("#nandconv",   consigneeDisplay);
		setInputValue("#percenv", ContractMasterData.percentage_value ?? "");
        // ---- END Contract Details resolution ----

        $(".dynamic-row11, .dynamic-row122").empty(); // Clear previous content

        // Set values in form fields
        setInputValue("#remarkv", invoiceData.remarks);
		setInputValue("#remarkvvei", invoiceData.gst_remarks);
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

        // Set "freight" value
        setInputValue("#vfreight11", packingData.length > 0 ? packingData[0].freight : "");
        setInputValue("#pnverifyww", packingData.length > 0 ? packingData[0].pn_id : "");
        setInputValue("#vcontract11up", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");
        setInputValue("#vintypeedityww", packingData.length > 0 ? packingData[0].invoice_remarks_type_name : "");

        // Set grand total value
        setInputValue("#grandv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        // Set contractor data fields (bunitv/intov/workorderv/nandconv handled separately above,
        // vendor fields handled separately below — NOT included here anymore)
        const contractorFields = {
            "#intypev": "invoice_type_calculation",
            "#prodesv": "product_desc_id",
            "#shipmodev": "shipment_mode_id_value",
            "#exptv": "export",
            "#taxresv": "tax_payable",
            //"#percenv": "percentage_value",
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
        };

        const TaxFields = {
            "#bvaue": "basic_value",
            "#pdptv": "optd",
            "#pdptcv": "optc_p",
            "#advA": "taxable",
            "#advan": "non_taxable"
        };

        Object.keys(contractorFields).forEach(selector => {
            setInputValue(selector, ContData.length > 0 ? ContData[0][contractorFields[selector]] : "");
        });

        // ---- FIX: vendor fields don't always live on ContData[0]; find the row that actually
		setInputValue("#vendornamev", invoiceData.vendorname);
		setInputValue("#vendorinvnov", invoiceData.vendorinvno);
		setInputValue("#vendorqtyv", invoiceData.vendorqty);
		setInputValue("#vendordatev", toDateInputValue(invoiceData.vendorinvdate));
        // ---- END vendor fields fix ----

        Object.keys(TaxFields).forEach(selector => {
            setInputValue(selector, taxData.length > 0 ? taxData[0][TaxFields[selector]] : "");
        });

        // Show/hide export field based on "export" value
        $('#exportFields1verify').toggle(ContData.length > 0 && ContData[0].export === 'yes');

        packingData.forEach((item, index) => {

            const showLabel = index === 0;

            const selectedService = serviceMasterList.find(s => s.service_code == item.scode);
            const selectedHsn = hsnMasterList.find(h => h.service_code == item.hsncode);

            const serviceDisplay = selectedService
                ? `${selectedService.service_code} - ${selectedService.service_description}`
                : (item.scode || "");

            const hsnDisplay = selectedHsn
                ? `${selectedHsn.service_code} - ${selectedHsn.service_description}`
                : (item.hsncode || "");

            $(".dynamic-row11").append(`
                <div class="row align-items-center mb-1">

                    <div class="col-auto">
                        ${showLabel ? '<label class="small-label">UOM</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right"
                               value="${item.uom_name || ''}" readonly>
                    </div>

                    <div class="col-auto">
                        ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right"
                               value="${item.qty || ''}" readonly>
                    </div>

                    <div class="col-auto">
                        ${showLabel ? '<label class="small-label">Kg</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right"
                               value="${item.per_kgs || ''}" readonly>
                    </div>

                    <div class="col-auto">
                        ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right"
                               value="${item.unit_price || ''}" readonly>
                    </div>

                    <div class="col-auto">
                        ${showLabel ? '<label class="small-label">Total</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right"
                               value="${item.total || ''}" readonly>
                    </div>

                    <div class="col-auto">
                        ${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input"
                               value="${item.scrap_name_type_id || ''}" readonly>
                    </div>

                    <div class="col-auto">
                        ${showLabel ? '<label class="small-label">Milestone</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input"
                               value="${item.milestone_name || ''}" readonly>
                    </div>

                    <div class="col-auto">
                        ${showLabel ? '<label class="small-label">Service Code</label>' : ''}
                        <input type="text"
                               class="form-control form-control-sm small-input"
                               value="${serviceDisplay}"
                               readonly>
                    </div>

                    <div class="col-auto">
                        ${showLabel ? '<label class="small-label">HSN Code</label>' : ''}
                        <input type="text"
                               class="form-control form-control-sm small-input"
                               value="${hsnDisplay}"
                               readonly>
                    </div>

                </div>

                ${showLabel ? '<hr>' : ''}
            `);
        });

        // Append tax data
        taxData.forEach((tax) => {
            $(".dynamic-row122").append(`
                <div class="row align-items-center mb-1">
                    <div class="col-auto"><label class="small-label1">Tax Name</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_name}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax %</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_per}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Advance Tax</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.adv_tax}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax Value</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_value}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">PTD</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptd}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">PBC</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptc}" readonly>
                    </div>
                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
                    </div>
                </div>
                <hr style="width:120%;border-top:1px solid #ccc;">
            `);
        });

        // Show the modal
        toggleSubcontractingFieldsVerify();
        $("#exampleModalScrollableVerify").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
}

async function editRecord11(id,status) {

	if(status!='CANCELLED')
		{
			if (!allowed.includes("view")) {
			  alert(" You do not have permission to view.");
			    $("#exampleModalScrollableVerified").modal("hide");
			  return;
			}
    try {
	    const url = new URL(`/jssl/invoice/searchidnew`, baseUrl);
        url.searchParams.append('id', id);

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"
						       });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        const packingData = json.QsPacking_Data || [];
        const taxData = json.tax || [];
        const invoiceData = json.Invoice_Data || {};
        const GrandValue = json.Grand_Total_value || [];
        const ContData = json.Contractor_Data || [];

        // ---- NEW: resolve Contract Details display text from InvoiceContractMaster, fallback to ContData ----
        const ContractMasterData = json.InvoiceContractMaster || {};

        const matchedBU = businessUnitList.find(b => String(b.business_unit_id) === String(ContractMasterData.bid));
        const buDisplay = matchedBU
            ? `${matchedBU.business_unit_name} ${matchedBU.orgName},${matchedBU.location},${matchedBU.stateName}(${matchedBU.gst_number})`
            : (ContData.length > 0 ? ContData[0].business_unit_name : "");

        const matchedInvoiceTo = invoiceAddressList.find(a => String(a.id) === String(ContractMasterData.invoice_to_id));
        const invoiceToDisplay = matchedInvoiceTo
            ? matchedInvoiceTo.address
            : (ContData.length > 0 ? ContData[0].invoice_to_id_value : "");

        const matchedWork = workOrderList.find(w => String(w.work_id) === String(ContractMasterData.work_id));
        const workDisplay = matchedWork
            ? matchedWork.workorder_no
            : (ContData.length > 0 ? ContData[0].work_id_value : "");

        const matchedConsignee = consigneeAddressList.find(c => String(c.id) === String(ContractMasterData.consignee_id));
        const consigneeDisplay = matchedConsignee
            ? matchedConsignee.address
            : (ContData.length > 0 ? ContData[0].consignee_id_value : "");

        setInputValue("#bunitvv",     buDisplay);
        setInputValue("#intovv",      invoiceToDisplay);
        setInputValue("#workordervv", workDisplay);
        setInputValue("#nandconvv",   consigneeDisplay);
		setInputValue("#percenvv", ContractMasterData.percentage_value ?? "");
        // ---- END NEW ----

        $(".dynamic-row11test, .dynamic-row122test").empty(); // Clear previous content

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

        // Set "freight" value
        setInputValue("#vfreight11v", packingData.length > 0 ? packingData[0].freight : "");
        setInputValue("#pnverifywwv", packingData.length > 0 ? packingData[0].pn_id : "");
		setInputValue("#vcontract11vv", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");
        // Set grand total value
        setInputValue("#grandvv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");
		setInputValue("#vintypeeditvv", packingData.length > 0 ? packingData[0].invoice_remarks_type_name : "");

        // Set contractor data fields (bunitvv/intovv/workordervv/nandconvv handled separately above)
        const contractorFields = {
            "#intypevv": "invoice_type_calculation",
            "#prodesvv": "product_desc_id",
            "#shipmodevv": "shipment_mode_id_value",
            "#exptvv": "export",
            "#taxresvv": "tax_payable",
            //"#percenvv": "percentage_value",
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
        };

        const TaxFields = {
	        "#bvauev": "basic_value",
	        "#pdptvv": "optd",
	        "#pdptcvv": "optc_p",
	        "#advAv": "taxable",
	        "#advanv": "non_taxable"
	      };

        Object.keys(contractorFields).forEach(selector => {
            setInputValue(selector, ContData.length > 0 ? ContData[0][contractorFields[selector]] : "");
        });
		
		// ---- FIX: vendor fields don't always live on ContData[0]; find the row that actually
		setInputValue("#vendornamevv", invoiceData.vendorname);
		setInputValue("#vendorinvnovv", invoiceData.vendorinvno);
		setInputValue("#vendorqtyvv", invoiceData.vendorqty);
		setInputValue("#vendordatevv", toDateInputValue(invoiceData.vendorinvdate));
		// ---- END vendor fields fix ----
		
        Object.keys(TaxFields).forEach(selector => {
            setInputValue(selector, taxData.length > 0 ? taxData[0][TaxFields[selector]] : "");
        });

        // Show/hide export field based on "export" value
        $('#exportFields1verified').toggle(ContData.length > 0 && ContData[0].export === 'yes');

		packingData.forEach((item, index) => {

		    const showLabel = index === 0;

			const selectedService = serviceMasterList.find(s => s.service_code == item.scode);
			const selectedHsn = hsnMasterList.find(h => h.service_code == item.hsncode);

			const serviceDisplay = selectedService
			    ? `${selectedService.service_code} - ${selectedService.service_description}`
			    : (item.scode || "");

			const hsnDisplay = selectedHsn
			    ? `${selectedHsn.service_code} - ${selectedHsn.service_description}`
			    : (item.hsncode || "");

		    $(".dynamic-row11test").append(`
		        <div class="row align-items-center mb-1">

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">UOM</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.qty}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.per_kgs}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unit_price}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Total</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.scrap_name_type_id}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Milestone</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name}" readonly>
		            </div>

					<div class="col-auto">
					    ${showLabel ? '<label class="small-label">Service Code</label>' : ''}
					    <input type="text"
					           class="form-control form-control-sm small-input"
					           value="${serviceDisplay}"
					           readonly>
					</div>

					<div class="col-auto">
					    ${showLabel ? '<label class="small-label">HSN Code</label>' : ''}
					    <input type="text"
					           class="form-control form-control-sm small-input"
					           value="${hsnDisplay}"
					           readonly>
					</div>

		        </div>

		        ${showLabel ? '<hr>' : ''}
		    `);
		});

        // Append tax data
        taxData.forEach((tax) => {
            $(".dynamic-row122test").append(`
                <div class="row align-items-center mb-1">
                    <div class="col-auto"><label class="small-label1">Tax Name</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_name}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax %</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_per}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Advance Tax</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.adv_tax}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax Value</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_value}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">PTD</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptd}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">PBC</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptc}" readonly>
                    </div>
                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
                    </div>
                </div>
                <hr>
            `);
        });

        // Show the modal
		const invTypeName = packingData.length > 0 ? (packingData[0].invoice_remarks_type_name || "") : "";
		$('#subcontractingFieldsView').toggle(invTypeName.toLowerCase() === "subcontracting");

		$("#exampleModalScrollableVerified").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
}
else{
	try {
	    const url = new URL(`/jssl/invoice/searchidcancel`, baseUrl);
	       url.searchParams.append('id', id);

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"
						       });
	       if (!response.ok) throw new Error("Failed to fetch data");
	       const json = await response.json();

	       const packingData = json.QsPacking_Data || [];
	       const taxData = json.tax || [];
	       const invoiceData = json.Invoice_Data || {};
	       const GrandValue = json.Grand_Total_value || [];
	       const ContData = json.Contractor_Data || [];

	       // ---- NEW: resolve Contract Details display text from InvoiceContractMaster, fallback to ContData ----
	       const ContractMasterData = json.InvoiceContractMaster || {};

	       const matchedBU = businessUnitList.find(b => String(b.business_unit_id) === String(ContractMasterData.bid));
	       const buDisplay = matchedBU
	           ? `${matchedBU.business_unit_name} ${matchedBU.orgName},${matchedBU.location},${matchedBU.stateName}(${matchedBU.gst_number})`
	           : (ContData.length > 0 ? ContData[0].business_unit_name : "");

	       const matchedInvoiceTo = invoiceAddressList.find(a => String(a.id) === String(ContractMasterData.invoice_to_id));
	       const invoiceToDisplay = matchedInvoiceTo
	           ? matchedInvoiceTo.address
	           : (ContData.length > 0 ? ContData[0].invoice_to_id_value : "");

	       const matchedWork = workOrderList.find(w => String(w.work_id) === String(ContractMasterData.work_id));
	       const workDisplay = matchedWork
	           ? matchedWork.workorder_no
	           : (ContData.length > 0 ? ContData[0].work_id_value : "");

	       const matchedConsignee = consigneeAddressList.find(c => String(c.id) === String(ContractMasterData.consignee_id));
	       const consigneeDisplay = matchedConsignee
	           ? matchedConsignee.address
	           : (ContData.length > 0 ? ContData[0].consignee_id_value : "");

	       setInputValue("#bunitvv",     buDisplay);
	       setInputValue("#intovv",      invoiceToDisplay);
	       setInputValue("#workordervv", workDisplay);
	       setInputValue("#nandconvv",   consigneeDisplay);
	       // ---- END NEW ----

	       $(".dynamic-row11test, .dynamic-row122test").empty(); // Clear previous content

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

	       // Set "freight" value
	       setInputValue("#vfreight11v", packingData.length > 0 ? packingData[0].freight : "");
	       setInputValue("#pnverifywwv", packingData.length > 0 ? packingData[0].pn_id : "");
		   setInputValue("#vcontract11vv", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");
	       // Set grand total value
	       setInputValue("#grandvv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");
		   setInputValue("#vintypeeditvv", packingData.length > 0 ? packingData[0].invoice_remarks_type_name : "");

	       // Set contractor data fields (bunitvv/intovv/workordervv/nandconvv handled separately above)
	       const contractorFields = {
	           "#intypevv": "invoice_type_calculation",
	           "#prodesvv": "product_desc_id",
	           "#shipmodevv": "shipment_mode_id_value",
	           "#exptvv": "export",
	           "#taxresvv": "tax_payable",
	           "#percenvv": "percentage_value",
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
	           "#newhcode1": "h_code_value",
	       };

	       const TaxFields = {
	        "#bvauev": "basic_value",
	        "#pdptvv": "optd",
	        "#pdptcvv": "optc",
	        "#advAv": "taxable",
	        "#advanv": "non_taxable"
	      };

	       Object.keys(contractorFields).forEach(selector => {
	           setInputValue(selector, ContData.length > 0 ? ContData[0][contractorFields[selector]] : "");
	       });

	       Object.keys(TaxFields).forEach(selector => {
	           setInputValue(selector, taxData.length > 0 ? taxData[0][TaxFields[selector]] : "");
	       });

	       // Show/hide export field based on "export" value
	       $('#exportFields1verified').toggle(ContData.length > 0 && ContData[0].export === 'yes');

		   packingData.forEach((item, index) => {

		       const showLabel = index === 0;

		       $(".dynamic-row11test").append(`

		           <div class="row align-items-center mb-1">

		               <div class="col-auto">
		                   ${showLabel ? '<label class="small-label">UOM</label>' : ''}
		                   <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
		               </div>

		               <div class="col-auto">
		                   ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
		                   <input type="text" class="form-control form-control-sm small-input text-right" value="${item.qty}" readonly>
		               </div>

		               <div class="col-auto">
		                   ${showLabel ? '<label class="small-label">Kg</label>' : ''}
		                   <input type="text" class="form-control form-control-sm small-input text-right" value="${item.per_kgs}" readonly>
		               </div>

		               <div class="col-auto">
		                   ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
		                   <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unit_price}" readonly>
		               </div>

		               <div class="col-auto">
		                   ${showLabel ? '<label class="small-label">Total</label>' : ''}
		                   <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
		               </div>

		               <div class="col-auto">
		                   ${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
		                   <input type="text" class="form-control form-control-sm small-input" value="${item.scrap_name_type_id}" readonly>
		               </div>

		               <div class="col-auto">
		                   ${showLabel ? '<label class="small-label">Milestone</label>' : ''}
		                   <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name}" readonly>
		               </div>

		           </div>

		           ${showLabel ? '<hr>' : ''}

		       `);

		   });

	       // Append tax data
	       taxData.forEach((tax) => {
	           $(".dynamic-row122test").append(`
	               <div class="row align-items-center mb-1">
	                   <div class="col-auto"><label class="small-label1">Tax Name</label>
	                       <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_name}" readonly>
	                   </div>
	                   <div class="col-auto"><label class="small-label1">Tax %</label>
	                       <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_per}" readonly>
	                   </div>
	                   <div class="col-auto"><label class="small-label1">Advance Tax</label>
	                       <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.adv_tax}" readonly>
	                   </div>
	                   <div class="col-auto"><label class="small-label1">Tax Value</label>
	                       <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_value}" readonly>
	                   </div>
	                   <div class="col-auto"><label class="small-label1">PTD</label>
	                       <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptd}" readonly>
	                   </div>
	                   <div class="col-auto"><label class="small-label1">PBC</label>
	                       <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptc}" readonly>
	                   </div>
	                   <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
	                       <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
	                   </div>
	               </div>
	               <hr style="width:120%;border-top:1px solid #ccc;">
	           `);
	       });

	       // Show the modal
	       $("#exampleModalScrollableVerified").modal("show");

	   } catch (error) {
	       console.error('Error fetching invoice data:', error);
	   }
}
}

let editInvoiceBasicAmount = 0;

function recalcEditTaxes() {
    let totalTax = 0;
    [1, 2, 3].forEach(n => {
        const sel = document.getElementById("edit_tax_id_" + n);
        const per = document.getElementById("edit_tax_per_" + n);
        const val = document.getElementById("edit_tax_value_" + n);
        if (!sel || !per || !val) return;
        let amt = 0;
        if (sel.value !== "") {
            amt = Math.round((editInvoiceBasicAmount * (parseFloat(per.value) || 0)) / 100);
        }
        val.value = amt.toFixed(2);
        totalTax += amt;
    });
    setInputValue("#grandvup", (editInvoiceBasicAmount + totalTax).toFixed(2));
}

function renderEditTaxes(selectedIds) {
    const container = $(".dynamic-row122up");
    container.empty();

    [1, 2, 3].forEach((n, i) => {
        const selId = (selectedIds[i] != null && selectedIds[i] !== "" && Number(selectedIds[i]) > 0)
            ? String(selectedIds[i]) : "";

        let options = `<option value="">Select Tax</option>` +
            taxMasterList.map(t =>
                `<option value="${t.tax_id}" ${String(t.tax_id) === selId ? "selected" : ""}>${t.tax_name} - ${t.tax_per}%</option>`
            ).join("");

        if (selId && !taxMasterList.some(t => String(t.tax_id) === selId)) {
            options += `<option value="${selId}" selected>Existing Tax</option>`;
        }

        const found = taxMasterList.find(t => String(t.tax_id) === selId);
        const per = found ? parseFloat(found.tax_per || 0).toFixed(2) : "0.00";

        container.append(`
            <div class="form-row align-items-center w-100 mb-2">
                <div class="form-group col-md-4 col-sm-12">
                    <div class="d-flex align-items-center">
                        <label class="mb-0 mr-2" style="min-width:105px;"><b>Tax Name</b></label>
                        <select class="form-control" id="edit_tax_id_${n}" data-prev="${selId}">${options}</select>
                    </div>
                    <small class="text-danger" id="edit_tax_err_${n}" style="display:none;">This tax is already selected.</small>
                </div>
                <div class="form-group col-md-4 col-sm-12">
                    <div class="d-flex align-items-center">
                        <label class="mb-0 mr-2" style="min-width:130px;"><b>Tax Percentage</b></label>
                        <input type="text" class="form-control" id="edit_tax_per_${n}" value="${per}" disabled>
                    </div>
                </div>
                <div class="form-group col-md-4 col-sm-12">
                    <div class="d-flex align-items-center">
                        <label class="mb-0 mr-2" style="min-width:95px;"><b>Tax Value</b></label>
                        <input type="text" class="form-control text-right" id="edit_tax_value_${n}" value="0.00" disabled>
                    </div>
                </div>
            </div>
        `);
    });

    [1, 2, 3].forEach(n => {
        document.getElementById("edit_tax_id_" + n).addEventListener("change", function () {
            const err = document.getElementById("edit_tax_err_" + n);
            const chosen = this.value;
            const duplicate = [1, 2, 3].some(m => {
                const other = document.getElementById("edit_tax_id_" + m);
                return other && other !== this && chosen !== "" && other.value === chosen;
            });
            if (duplicate) {
                err.style.display = "block";
                this.value = this.dataset.prev || "";
                return;
            }
            err.style.display = "none";
            this.dataset.prev = chosen;
            const t = taxMasterList.find(x => String(x.tax_id) === String(chosen));
            document.getElementById("edit_tax_per_" + n).value =
                t ? parseFloat(t.tax_per || 0).toFixed(2) : "0.00";
            recalcEditTaxes();
        });
    });

    recalcEditTaxes();
}

async function editRecordInvoice(id,status,load_id) {
	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}

if(status!='CANCELLED')
	{
	console.log(" edit record with ID:", id);
    try {
        const url = new URL(`/jssl/invoice/searchidnew`, baseUrl);
        url.searchParams.append('id', id);
		url.searchParams.append('load_id', load_id);

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"
						       });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        const packingData = json.QsPacking_Data || [];
        const taxData = json.tax || [];
        const invoiceData = json.Invoice_Data || {};
        const GrandValue = json.Grand_Total_value || [];
        const ContData = json.Contractor_Data || [];

        // ---- NEW: populate Contract Details from INVOICE_CONTRACT_MASTER ----
        const ContractMasterData = json.InvoiceContractMaster || {};

        setInputValue("#vconslnoupdate", ContractMasterData.con_slno || invoiceData.contract_slno || "");

		//fetchSalebusunitEdit("bunitvup", ContractMasterData.bid || (ContData.length > 0 ? ContData[0].business_unit_name : ""));
		fetchSalebusunitEdit("bunitvup",ContractMasterData.bid,ContData.length > 0 ? ContData[0].business_unit_name : "",ContData.length > 0 ? ContractMasterData.verified_status : undefined);
		document.getElementById("intypevup").value = ContractMasterData.invoice_type_calculation || "2";
		//fetchinvoicetoEdit("intovup", ContractMasterData.invoice_to_id || (ContData.length > 0 ? ContData[0].invoice_to_id_value : ""));
		fetchinvoicetoEdit("intovup",ContractMasterData.invoice_to_id,ContData.length > 0 ? ContData[0].invoice_to_id_value : "");
		document.getElementById("prodesvup").value = ContractMasterData.product_desc_id || "1";
		setInputValue("#shipmodevup", ContData.length > 0 ? ContData[0].shipment_mode_id_value : "");
		//fetchSaleworkEdit("workordervup", ContractMasterData.work_id || (ContData.length > 0 ? ContData[0].work_id_value : ""));
		fetchSaleworkEdit("workordervup",ContractMasterData.work_id,ContData.length > 0 ? ContData[0].work_id_value : "");
		setInputValue("#exptvup", ContractMasterData.export);
		document.getElementById("taxresvup").value = ContractMasterData.tax_ex_inc || "0";
		setInputValue("#percenvup", ContractMasterData.percentage_value);
		//fetchconnameEdit("nandconvup", ContractMasterData.consignee_id || (ContData.length > 0 ? ContData[0].consignee_id_value : ""));
		fetchconnameEdit("nandconvup",ContractMasterData.consignee_id,ContData.length > 0 ? ContData[0].consignee_id_value : "");
		setInputValue("#banknamevup", ContData.length > 0 ? ContData[0].bank_details_id_value : "");
		setInputValue("#deliveryconvup", ContData.length > 0 ? ContData[0].delivery_condition_id_value : "");
		setInputValue("#officevvup", ContData.length > 0 ? ContData[0].reg_office_id_value : "");
        // ---- END NEW ----

        $(".dynamic-row11uptest, .dynamic-row122up").empty();
        
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

        setInputValue("#vfreight11up", packingData.length > 0 ? packingData[0].freight : "");
        setInputValue("#pnverifywwup", packingData.length > 0 ? packingData[0].pn_id : "");
        setInputValue("#intypeeditup", packingData.length > 0 ? packingData[0].inc_type : "");
		setInputValue("#contract11up", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");

        setInputValue("#grandvup", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        const contractorFields = {
            "#bunitvup": "business_unit_name",
            "#intypevup": "invoice_type_calculation",
            "#intovup": "invoice_to_id_value",
            "#prodesvup": "product_desc_id",
            "#shipmodevup": "shipment_mode_id_value",
            "#workordervup": "work_id_value",
            "#exptvup": "export",
            "#taxresvup": "tax_payable",
            //"#percenvup": "percentage_value",
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
        };
        
        const TaxFields = {
	        "#bvaueup": "basic_value",
	        "#pdptvup": "optd",
	        "#pdptcvup": "optc_p",
	        "#advAup": "taxable",
	        "#advanup": "non_taxable"
	      };

        Object.keys(contractorFields).forEach(selector => {
            setInputValue(selector, ContData.length > 0 ? ContData[0][contractorFields[selector]] : "");
        });
		
		// ---- FIX: vendor fields don't always live on ContData[0]; find the row that actually
		setInputValue("#vendornameup", invoiceData.vendorname);
		setInputValue("#vendorinvnoup", invoiceData.vendorinvno);
		setInputValue("#vendorqtyup", invoiceData.vendorqty);
		setInputValue("#vendordateup", toDateInputValue(invoiceData.vendorinvdate));
		// ---- END vendor fields fix ----
        
        Object.keys(TaxFields).forEach(selector => {
            setInputValue(selector, taxData.length > 0 ? taxData[0][TaxFields[selector]] : "");
        });

        $('#exportFields1verifyup').toggle(ContData.length > 0 && ContData[0].export === 'yes');

		packingData.forEach((item, index) => {
		    const showLabel = index === 0;

		    const serviceOptions = serviceMasterList.map(s => `
		        <option value="${s.service_code}"
		            ${item.scode == s.service_code ? "selected" : ""}>
		            ${s.service_code} - ${s.service_description}
		        </option>
		    `).join("");

		    const hsnOptions = hsnMasterList.map(h => `
		        <option value="${h.service_code}"
		            ${item.hsncode == h.service_code ? "selected" : ""}>
		            ${h.service_code} - ${h.service_description}
		        </option>
		    `).join("");

		    $(".dynamic-row11uptest").append(`
		        <div class="row align-items-end mb-2">
		            <div class="form-group col-md-1 col-sm-12">
		                ${showLabel ? '<label class="small-label">UOM</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name || ''}" readonly>
		            </div>
		            <div class="form-group col-md-1 col-sm-12">
		                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.qty || ''}" readonly>
		            </div>
		            <div class="form-group col-md-1 col-sm-12">
		                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.per_kgs || ''}" readonly>
		            </div>
		            <div class="form-group col-md-1 col-sm-12">
		                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unit_price || ''}" readonly>
		            </div>
		            <div class="form-group col-md-1 col-sm-12">
		                ${showLabel ? '<label class="small-label">Total</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total || ''}" readonly>
		            </div>
		            <div class="form-group col-md-1 col-sm-12">
		                ${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.scrap_name_type_id || ''}" readonly>
		            </div>
		            <div class="form-group col-md-1 col-sm-12">
		                ${showLabel ? '<label class="small-label">Milestone</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name || ''}" readonly>
		            </div>
		            <div class="form-group col-md-2 col-sm-12">
		                ${showLabel ? '<label class="small-label">Service Code</label>' : ''}
		                <select class="form-control form-control-sm service-code-select" data-slno="${item.slno}">
		                    <option value="">Select Service Code</option>
		                    ${serviceOptions}
		                </select>
		            </div>
		            <div class="form-group col-md-2 col-sm-12">
		                ${showLabel ? '<label class="small-label">HSN Code</label>' : ''}
		                <select class="form-control form-control-sm hsn-code-select" data-slno="${item.slno}">
		                    <option value="">Select HSN Code</option>
		                    ${hsnOptions}
		                </select>
		            </div>
		        </div>
		        <hr style="margin:6px 0;">
		    `);
		});

		if (!taxMasterList || taxMasterList.length === 0) {
		    await fetchTaxMasterList();
		}
		const rowsTotal = packingData.reduce((s, r) => s + (parseFloat(r.total) || 0), 0);
		const frt = packingData.length > 0 ? (parseFloat(packingData[0].freight) || 0) : 0;
		editInvoiceBasicAmount = rowsTotal + frt;

		const savedIds = [ContractMasterData.tax_id_1, ContractMasterData.tax_id_2, ContractMasterData.tax_id_3];
		const hasSaved = savedIds.some(x => x != null && x !== "" && Number(x) > 0);
		const selectedIds = hasSaved ? savedIds : taxData.map(t => t.tax_id);
		renderEditTaxes(selectedIds);
		
		toggleSubcontractingFieldsUp(); 
        $("#exampleModalScrollableEditUp").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
	}
	else{
		console.log(" edit record with ID:", id);
		    try {
		        const url = new URL(`/jssl/invoice/searchidcancel`, baseUrl);
		        url.searchParams.append('id', id);
				url.searchParams.append('load_id', load_id);

				const response = await fetch(url,{
								           method: "GET",
								           credentials: "include"   // ✅ Always send JSESSIONID cookie
								       });
		        if (!response.ok) throw new Error("Failed to fetch data");
		        const json = await response.json();

		        const packingData = json.QsPacking_Data || [];
		        const taxData = json.tax || [];
		        const invoiceData = json.Invoice_Data || {};
		        const GrandValue = json.Grand_Total_value || [];
		        const ContData = json.Contractor_Data || [];
				
				const ContractMasterData = json.InvoiceContractMaster || {};

				// Store con_slno + factory_id on the modal for the update call later
				setInputValue("#vconslnoupdate", ContractMasterData.con_slno || packingData[0]?.con_slno || "");

				// Populate the Contract Details fields (dropdowns get value set + fetched)
				//fetchSalebusunitEdit("bunitvup", ContractMasterData.bid || (ContData.length > 0 ? ContData[0].business_unit_name : ""));
				fetchSalebusunitEdit("bunitvup",ContractMasterData.bid,ContData.length > 0 ? ContData[0].business_unit_name : "",ContData.length > 0 ? ContractMasterData.verified_status : undefined);
				document.getElementById("intypevup").value = ContractMasterData.invoice_type_calculation || "2";
				//fetchinvoicetoEdit("intovup", ContractMasterData.invoice_to_id || (ContData.length > 0 ? ContData[0].invoice_to_id_value : ""));
				fetchinvoicetoEdit("intovup",ContractMasterData.invoice_to_id,ContData.length > 0 ? ContData[0].invoice_to_id_value : "");
				document.getElementById("prodesvup").value = ContractMasterData.product_desc_id || "1";
				setInputValue("#shipmodevup", ContractMasterData.shipment_mode_id_value || "");
				//fetchSaleworkEdit("workordervup", ContractMasterData.work_id || (ContData.length > 0 ? ContData[0].work_id_value : ""));
				fetchSaleworkEdit("workordervup",ContractMasterData.work_id,ContData.length > 0 ? ContData[0].work_id_value : "");
				setInputValue("#exptvup", ContractMasterData.export);
				document.getElementById("taxresvup").value = ContractMasterData.tax_ex_inc || "0";
				setInputValue("#percenvup", ContractMasterData.percentage_value);
				//fetchconnameEdit("billing", ContractMasterData.consignee_id || (ContData.length > 0 ? ContData[0].consignee_id_value : ""));
				fetchconnameEdit("nandconvup",ContractMasterData.consignee_id,ContData.length > 0 ? ContData[0].consignee_id_value : "");
				setInputValue("#banknamevup", ContractMasterData.bank_details_id_value || "");
				setInputValue("#deliveryconvup", ContractMasterData.delivery_condition_id_value || "");
				setInputValue("#officevvup", ContractMasterData.regd_office_id_value || "");

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

		        // Set "freight" value
		        setInputValue("#vfreight11up", packingData.length > 0 ? packingData[0].freight : "");
		        setInputValue("#pnverifywwup", packingData.length > 0 ? packingData[0].pn_id : "");
		        setInputValue("#intypeeditup", packingData.length > 0 ? packingData[0].inc_type : "");
				setInputValue("#contract11up", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");
				
		        // Set grand total value
		        setInputValue("#grandvup", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

		        // Set contractor data fields
				const contractorFields = {
				    "#bunitvup": "business_unit_name",
				    "#intypevup": "invoice_type_calculation",
				    "#intovup": "invoice_to_id_value",
				    "#prodesvup": "product_desc_id",
				    "#shipmodevup": "shipment_mode_id_value",
				    "#workordervup": "work_id_value",
				    "#exptvup": "export",
				    "#taxresvup": "tax_payable",
				    "#percenvup": "percentage_value",
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
				};
		        
		        const TaxFields = {
			        "#bvaueup": "basic_value",
			        "#pdptvup": "optd",
			        "#pdptcvup": "optc",
			        "#advAup": "taxable",
			        "#advanup": "non_taxable"
			      };

		        Object.keys(contractorFields).forEach(selector => {
		            setInputValue(selector, ContData.length > 0 ? ContData[0][contractorFields[selector]] : "");
		        });
				
				// ---- FIX: vendor fields don't always live on ContData[0]; find the row that actually
				setInputValue("#vendornameup", invoiceData.vendorname);
				setInputValue("#vendorinvnoup", invoiceData.vendorinvno);
				setInputValue("#vendorqtyup", invoiceData.vendorqty);
				setInputValue("#vendordateup", toDateInputValue(invoiceData.vendorinvdate));
				// ---- END vendor fields fix ----
		        
		        Object.keys(TaxFields).forEach(selector => {
		            setInputValue(selector, taxData.length > 0 ? taxData[0][TaxFields[selector]] : "");
		        });

		        // Show/hide export field based on "export" value
		        $('#exportFields1verifyup').toggle(ContData.length > 0 && ContData[0].export === 'yes');

		        // Append packing data
		        packingData.forEach((item) => {
		            $(".dynamic-row11uptest").append(`
		                <div class="row align-items-center mb-1">
		                    <div class="col-auto"><label class="small-label">UOM</label>
		                        <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
		                    </div>
		                    <div class="col-auto"><label class="small-label">Quantity</label>
		                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.qty}" readonly>
		                    </div>
		                    <div class="col-auto"><label class="small-label">Kg</label>
		                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.per_kgs}" readonly>
		                    </div>
		                    <div class="col-auto"><label class="small-label">Unit Price</label>
		                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unit_price}" readonly>
		                    </div>
		                    <!--  <div class="col-auto"><label class="small-label">pices</label>
		                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.pice}" readonly>
		                    </div> -->
		                    <div class="col-auto"><label class="small-label">Total</label>
		                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
		                    </div>
		                    <div class="col-auto"><label class="small-label">Invoice Type</label>
		                        <input type="text" class="form-control form-control-sm small-input" value="${item.scrap_name_type_id}" readonly>
		                    </div>
		                    <div class="col-auto"><label class="small-label">Milestone</label>
		                        <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name}" readonly>
		                    </div>
		                  <!--   <div class="col-auto"><label class="small-label">Service Code</label>
		                        <input type="text" class="form-control form-control-sm small-input" value="${item.scode}" readonly>
		                    </div>
		                    <div class="col-auto"><label class="small-label">HSN Code</label>
		                        <input type="text" class="form-control form-control-sm small-input" value="${item.hcode}" readonly>
		                    </div> -->
		                </div>
		                <hr>
		            `);
		        });

		        // Append tax data
		        taxData.forEach((tax) => {
		            $(".dynamic-row122up").append(`
		                <div class="row align-items-center mb-1">
		                    <div class="col-auto"><label class="small-label1">Tax Name</label>
		                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_name}" readonly>
		                    </div>
		                    <div class="col-auto"><label class="small-label1">Tax %</label>
		                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_per}" readonly>
		                    </div>
		                    <div class="col-auto"><label class="small-label1">Advance Tax</label>
		                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.adv_tax}" readonly>
		                    </div>
		                    <div class="col-auto"><label class="small-label1">Tax Value</label>
		                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_value}" readonly>
		                    </div>
		                    <div class="col-auto"><label class="small-label1">PTD</label>
		                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptd}" readonly>
		                    </div>
		                    <div class="col-auto"><label class="small-label1">PBC</label>
		                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptc}" readonly>
		                    </div>
		                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
		                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
		                    </div>
		                </div>
		                <hr>
		            `);
		        });

		        // Show the modal
				toggleSubcontractingFieldsUp(); 
		        $("#exampleModalScrollableEditUp").modal("show");

		    } catch (error) {
		        console.error('Error fetching invoice data:', error);
		    }
	}
}

function toDateInputValue(v) {
    if (!v) return "";
    return String(v).split(" ")[0]; // "2026-08-01 00:00:00.0" -> "2026-08-01"
}



async function fetchSalebusunitEdit(targetId, selectedId, fallbackText, verified_status) {
    const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);
    const response = await fetch(url, { method: "GET", credentials: "include" });
    const json = await response.json();
    if (json.status !== "yes" || !json.Data.length) return;

    const selectElement = document.getElementById(targetId);
    selectElement.innerHTML = `<option value="">Select Business Unit</option>`;

    let matched = false;
    json.Data.forEach((type) => {
        const bindaddress = type.business_unit_name + type.location + '(' + type.gst_number + ')';
        const option = document.createElement("option");
        option.value = type.business_unit_id;
        option.textContent = bindaddress;
        if (selectedId && String(type.business_unit_id) === String(selectedId)) {
            option.selected = true;
            matched = true;
        }
        selectElement.appendChild(option);
    });

    // Fallback: no ID match, but we have a display string from Contractor_Data
    if (!matched && fallbackText) {
        const fallbackOption = document.createElement("option");
        fallbackOption.value = fallbackText;
        fallbackOption.textContent = fallbackText;
        fallbackOption.selected = true;
        selectElement.insertBefore(fallbackOption, selectElement.firstChild.nextSibling);
    }

    // ✅ Make it read-only once verified
    if (verified_status === "true" || verified_status === "1" || verified_status === 1) {
        selectElement.setAttribute("disabled", "disabled");
    } else {
        selectElement.removeAttribute("disabled"); // reset in case it was disabled from a previous open
    }
	s2(targetId, 'Select Business Unit'); 
}

async function fetchinvoicetoEdit(targetId, selectedId, fallbackText) {
    try {
        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddress`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        if (json.status !== "yes" || !json.InvoiceAddress?.length) return;

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.InvoiceAddress
            .filter(t => t.is_verified == 1 && t.id)
            .map(t => ({ id: t.id, label: t.address }));

        const deduped = dedupeByLabel(records, selectedId);
        populateSelect(selectElement, deduped, selectedId, "Select invoice to", fallbackText);
    } catch (err) {
        console.error("Error fetching invoice addresses:", err);
    }
}

async function fetchSaleworkEdit(targetId, selectedId, fallbackText) {
    try {
        const url = new URL(`/jssl/contract/listworkordernew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) return;

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.work_id)
            .map(t => ({ id: t.work_id, label: t.workorder_no }));

        const deduped = dedupeByLabel(records, selectedId);
        populateSelect(selectElement, deduped, selectedId, "Select work order", fallbackText);
    } catch (err) {
        console.error("Error fetching work orders:", err);
    }
}

async function fetchconnameEdit(targetId, selectedId, fallbackText) {
    try {
        const url = new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        if (json.status !== "yes" || !json.ConsigneeAddress?.length) return;

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.ConsigneeAddress
            .filter(t => t.is_verified == 1 && t.id)
            .map(t => ({ id: t.id, label: t.address }));

        const deduped = dedupeByLabel(records, selectedId);
        populateSelect(selectElement, deduped, selectedId, "Select", fallbackText);
    } catch (err) {
        console.error("Error fetching consignee addresses:", err);
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
	$('#exampleModalCenter66Verify').modal('hide');
    let taxIds = [], taxPers = [], taxValues = [],
        taxAdv = [], taxPtd = [], taxPbc = [],
        qsPackingItemSlno = [], taxAdvList = [], nonTaxAdvList = [];

    $(".dynamic-row122 .row").each(function () {
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

    const requestUrl = new URL('/jssl/invoice/verificationnew', baseUrl);
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
            payable_by_customer: pdptcv.value,
            payable_to_dept: pdptv.value,
            open_tax_adv: advA.value,
            open_non_tax_adv: advan.value,
            total: bvaue.value,
            recovery_amt: "",
            t_adv: "",
            adv_tax: taxAdv.join(","),
            tax_adv: taxAdvList.join(","),
            non_tax_adv: nonTaxAdvList.join(","),
            tax_payable_by_customer: taxPbc.join(","),
            tax_payable_to_dept: taxPtd.join(","),
            id: vidverify.value,
            gst_remarks: remarkvvei.value,
            pn_id: pnverifyww.value,
            tax_id: taxIds.join(","),
            tax_per: taxPers.join(","),
            tax_value: taxValues.join(","),
            qs_packing_item_slno: qsPackingItemSlno.join(",") 
        }),
        success: function (data) {
            if (data.message === "Success") {
                const popup = $('<div class="popup">Steel Invoice Verified Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'invoicesidemenu.jsp';
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
        error: function (xhr, status, error) {
            console.error('AJAX request failed:', error);
            console.error('Status:', status);
            console.error('Response:', xhr.responseText);
            alert("Verification request failed. Check console for details.");
        }
    });
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
	$('#exampleModalCenter66Editup').modal('hide');

	const slno = [];
	const service_code_id = [];
	const hsn_code_id = [];

	$(".service-code-select").each(function () {
	    const rowSlno = $(this).data("slno");
	    slno.push(rowSlno);
	    service_code_id.push($(this).val());
	    const hsn = $(this)
	        .closest(".row")
	        .find(".hsn-code-select")
	        .val();
	    hsn_code_id.push(hsn);
	});

	// ---- Tax params (only sent when the edit tax dropdowns exist) ----
	const taxParams = {};
	if (document.getElementById("edit_tax_id_1")) {
	    taxParams.tax_edit = "1";
	    [1, 2, 3].forEach(n => {
	        taxParams["tax_id_" + n] = document.getElementById("edit_tax_id_" + n).value;
	        taxParams["tax_value_" + n] = document.getElementById("edit_tax_value_" + n).value || "0.00";
	    });
	}

	// ---- Main payload (unchanged) ----
	const payload = {
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
	    slno: slno,
	    service_code_id: service_code_id,
	    hsn_code_id: hsn_code_id,

	    // ---- Vendor / subcontracting fields ----
	    vendorname: vendornameup.value,
	    vendorinvno: vendorinvnoup.value,
	    vendorqty: vendorqtyup.value,
	    vendorinvdate: vendordateup.value
	        ? vendordateup.value.replace(/-/g, '')   // "2026-08-20" -> "20260820"
	        : '',

	    // ---- Contract Details modal fields ----
	    con_slno: document.getElementById("vconslnoupdate").value,
	    factory_id: selectedFactoryId,
	    business_unit_id: document.getElementById("bunitvup").value,
	    invoice_type_calculation: document.getElementById("intypevup").value,
	    invoice_to_id: document.getElementById("intovup").value,
	    product_desc_id: document.getElementById("prodesvup").value,
	    shipment_mode_id: document.getElementById("shipmodevup").value,
	    work_id: document.getElementById("workordervup").value,
	    export: document.getElementById("exptvup").value,
	    tax_ex_inc: document.getElementById("taxresvup").value,
	    percentage_value: document.getElementById("percenvup").value,
	    consignee_id: document.getElementById("nandconvup").value,
	    bank_details_id: document.getElementById("banknamevup").value,
	    delivery_condition_id: document.getElementById("deliveryconvup").value,
	    regd_office_id: document.getElementById("officevvup").value
	};

	// ---- THE FIX: merge tax params into the payload ----
	Object.assign(payload, taxParams);

	console.log("Update payload:", payload);   // remove after testing

	$.ajax({
	    url: new URL('/jssl/invoice/updatenew', baseUrl),
	    type: 'POST',
	    xhrFields: {
	        withCredentials: true
	    },
	    dataType: 'json',
	    data: jQuery.param(payload),
	    success: function (data) {
	        var result = data.message;
	        if (result === "Success") {
	            const popup = $('<div class="popup">Steel Invoice updated Successfully!</div>')
	                .appendTo('body').hide().fadeIn(400);
	            setTimeout(function () {
	                popup.fadeOut(400, function () {
	                    $(this).remove();
	                    window.location = 'invoicesidemenu.jsp';
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
	    error: function (xhr, status, error) {
	        console.error('Request failed.', status, error, xhr.responseText);
	    }
	});
}

function openModal(id, pn_id) {
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
    $('#exampleModalCenter1').attr('data-pn-id', pn_id);
}

function addeventrelease() {
	$('#exampleModalCenter1').modal('hide');
    // Retrieve the id and pn_id from the modal
    var id = $('#exampleModalCenter1').attr('data-id');
    var pn_id = $('#exampleModalCenter1').attr('data-pn-id');

    // Perform release action
    $.ajax({
        url: new URL('/jssl/invoice/releasebyidnew', baseUrl),
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
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Steel Invoice Released Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'invoicesidemenu.jsp';
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

/*async function printRecord(id,status) {
	if(status!='CANCELLED')
		{
	const allowed = window.allowedActions || [];
	if (!allowed.includes("Print")) {
	  alert(" You do not have permission to print.");
	  console.warn("Blocked print attempt. User lacks Print permission.");
	  return;
	}

	// ✅ Proceed with print logic here
	console.log(" Printing record with ID:", id);
	// Your actual print logic here
    try {
	    const url = new URL(`/jssl/invoice/searchidnew?id=${id}`, baseUrl);
		const response = await fetch(url,{
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
         
         const invoiceno = Invoice_Data.invoice_no;
         const lr_docketno = Invoice_Data.lr_docketno;
         const date_val = Invoice_Data.date_val;
         //const product_desc = json.Invoice_Data?.product_desc || ''; // Fix reference
         
         const invoice_to_id_value = Contractor_Data[0].invoice_to_id_value;
         const tax_payable = Contractor_Data[0].tax_payable;
         const area_no = Contractor_Data[0].area_no;
         const lot_no = Contractor_Data[0].lot_no;
         const containter_no = Contractor_Data[0].containter_no;
         const epcgno = Contractor_Data[0].epcgno;
         const shipment_mode_id_value = Contractor_Data[0].shipment_mode_id_value;
         const delivery_condition_id_value = Contractor_Data[0].delivery_condition_id_value;
         const consignee_id_value = Contractor_Data[0].consignee_id_value;
         const work_id_value = Contractor_Data[0].work_id_value;
         const invoiceStateName = Contractor_Data[0].invoiceStateName;
         const consigneeStateName = Contractor_Data[0].consigneeStateName;
         const invoiceStateCode = Contractor_Data[0].invoiceStateCode;
         const consigneeStateCode = Contractor_Data[0].consigneeStateCode;
         const invoiceGstNo = Contractor_Data[0].invoiceGstNo;
         const consigneeGstNo = Contractor_Data[0].consigneeGstNo;
         const invoicePanNo = Contractor_Data[0].invoicePanNo;
         const consigneePanNo = Contractor_Data[0].consigneePanNo;
         const bankName = Contractor_Data[0].bankName;
         const account_number = Contractor_Data[0].account_number;
         const branch_address = Contractor_Data[0].branch_address;
         const branch_code = Contractor_Data[0].branch_code;
         const swift_code = Contractor_Data[0].swift_code;
         const ifsc_code = Contractor_Data[0].ifsc_code;
         
         const transport_name = QsPacking_Data[0].transport_name;
         const vechile_no = QsPacking_Data[0].vechile_no;
         const con_code_with_lot_no = QsPacking_Data[0].con_code_with_lot_no;
         
         const freight = tax[0].freight;
         const total_pices = tax[0].total_pices;
         const total_kgs = tax[0].total_kgs;
         const total_qty = tax[0].total_qty;
         const basic_value = tax[0].basic_value;
         
		 const items = json.QsPacking_Data || []; 
		 const taxData = json.tax || [];
		 const InvoiceData = json.Invoice_Data || [];
		 const grandTotalData = json.Grand_Total_value?.[0] || {};
         const grandTotalInWords = grandTotalData.GrandTotalInWords || '';
		 const grandTotalTax = grandTotalData.Grand_Total_tax || '';
		 const gstremarks = InvoiceData.gst_remarks || '';
		 const advremarks = taxData[0].taxable || '';
		 const advremarksnon = taxData[0].non_taxable || '';
		 const basicValue = taxData[0].basic_value || '';
		 const basicValuecos = taxData[0].optc || '';

        // Generate dynamic rows based on QsPacking_Data
        let tableRows = items.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.scrap_name_type_id || ''}</td>
                <td>${item.pice || ''}</td>
                <td>${item.hcode || ''}</td>
                <td>${item.uom_name || ''}</td>
                <td>${item.qty || ''}</td>
                <td>${item.per_kgs || ''}</td>
                <td>${item.unit_price || ''}</td>
                <td>${item.total || ''}</td>
            </tr>
        `).join('');
        
        // Generate dynamic tax rows
        let taxRows = taxData.map(tax => `
            <tr>
                <td colspan="7" style="border: 1px solid #000;">${tax.tax_name || ''}</td>
                <td style="border: 1px solid #000;">${tax.tax_per || ''}</td>
                <td style="border: 1px solid #000;">${tax.tax_value || ''}</td>
            </tr>
        `).join('');
        
        // Generate dynamic tax descriptions with tax_name and tax_value_in_words
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
		`).join('');

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
			margin-top:12%;
        }
        .invoice-container1 {
            width: 100vw;
            max-width: 1200px;
            border: 1px solid #000;
            padding: 15px;
            margin-top:32%;
        }
        .invoice-container2 {
            width: 100vw;
            max-width: 1200px;
            border: 1px solid #000;
            padding: 15px;
            margin-top:32%;
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
                    ICE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
                    Email: invoice@jssl.in    Website: www.jssl.in<br>
                </td>
                <td colspan="2">
                <b>Invoice No:</b> <span id="invoiceNumber"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date"></span><br>
                <b>Contract No Reference No:</b> <span id="contrefno"></span><br>
                <b>Date & Time of supply:</b> <span id="datetime"></span><br>
                <b>Work/Purchase Order No:</b> <span id="workor"></span><br>
                <b>Date of Order:</b> <span id="dateor"></span><br>
            </tr>
            <tr>
                <td colspan="2"><strong>Invoice To:</strong><br>
                <span id="shipto11"></span><br>
                <b>Name of the state:</b> <span id="statename"></span><br>
                <b>State Code:</b> <span id="stcode11"></span><br>
                <b>GSTIN:</b><span id="ingst"></span><br>
                <b>PAN:</b><span id="panin"></span><br>
                </td>
                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
                <span id="conadd"></span><br>
                <b>State Name:</b> <span id="state"></span><br>
                <b>State Code:</b> <span id="stateco"></span><br>
                <b>GSTIN:</b><span id="congst"></span><br>
                <b>PAN:</b><span id="pancon"></span><br>
                </td>
            </tr>
            <tr>
                <td><strong>Date of Notification</strong><br>
                 <strong>Exempted note under:</strong><br>
                 <strong>Tax is Payble on revese charge:(Yes/No):<span id="taxpayre"></span></strong><br>
                 </td>
                <td><strong>Export Details:</strong><br>
                <strong>ARE No:<span id="areano"></span></strong><br>
                <strong>LUT No:<span id="lutno"></span></strong><br>
                <strong>Container No:<span id="contlo"></span></strong><br>
                <strong>EPCG License No:<span id="epoglo"></span></strong><br>
                </td>
                <td><b>Transporter:</b> <span id="trans"></span><br>
                <b>Vehicle No:</b><span id="vehino"></span><br>
                <b>LR/DOCKET No:<span id="lrdoc"></span></b><br>
                <b>Date:<span id="lrdate"></span></b><br>
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
                    <th>Pieces</th>
                    <th>Service/HSN Code</th>
                    <th>UOM</th>
                    <th>Qty</th>
                    <th>Weight</th>
                    <th>Unit Price</th>
                    <th>Value (INR)</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows} 
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
                    <span>Freight</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="4"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="freight"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="2">
                    <span>TOTAL</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="pitotal"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="qtytotal"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="wiegtotal"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="val11"></span><br>
                    </td>
                 </tr>
            </tbody>
            <tbody>
                ${taxRows}
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
                        ${taxDetails} <!-- Dynamic Tax Name & Value in Words -->
                        <b>Gross total in words:</b> <b>${grandTotalInWords}</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
                        <b>TOTAL INVOICE VALUE:</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
                        <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
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
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Payable by Customer</span><br>
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${gstremarks}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Basic</span><br>
                    ${taxDetailsNew}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxPerValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarks}</span><br>
                    ${taxadvanceValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarksnon}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${basicValue}</span><br>
                    ${taxValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxValuedept}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>${basicValuecos}</span><br>
                    ${taxValuecos}
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
                    <span id="taxbasic"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="grandlast"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxtotal"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span id="grandlast12new"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="9">
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
		                    <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="3">
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
    
    <div class="invoice-container1">
        <div class="invoice-header">
            <b><span id="topdate1"></span></b>
            <div class="gst-text">GST TAX INVOICE</div>
            <div class="gst-text1">Duplicate for Transporter</div>
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
                    ICE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
                    Email: invoice@jssl.in    Website: www.jssl.in<br>
                </td>
                <td colspan="2">
                <b>Invoice No:</b> <span id="invoiceNumber1"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date1"></span><br>
                <b>Contract No Reference No:</b> <span id="contrefno1"></span><br>
                <b>Date & Time of supply:</b> <span id="datetime1"></span><br>
                <b>Work/Purchase Order No:</b> <span id="workor1"></span><br>
                <b>Date of Order:</b> <span id="dateor1"></span><br>
            </tr>
            <tr>
                <td colspan="2"><strong>Invoice To:</strong><br>
                <span id="shipto111"></span><br>
                <b>Name of the state:</b> <span id="statename1"></span><br>
                <b>State Code:</b> <span id="stcode111"></span><br>
                <b>GSTIN:</b><span id="ingst1"></span><br>
                <b>PAN:</b><span id="panin1"></span><br>
                </td>
                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
                <span id="conadd1"></span><br>
                <b>State Name:</b> <span id="state1"></span><br>
                <b>State Code:</b> <span id="stateco1"></span><br>
                <b>GSTIN:</b><span id="congst1"></span><br>
                <b>PAN:</b><span id="pancon1"></span><br>
                </td>
            </tr>
            <tr>
                <td><strong>Date of Notification</strong><br>
                 <strong>Exempted note under:</strong><br>
                 <strong>Tax is Payble on revese charge:(Yes/No):<span id="taxpayre1"></span></strong><br>
                 </td>
                <td><strong>Export Details:</strong><br>
                <strong>ARE No:<span id="areano1"></span></strong><br>
                <strong>LUT No:<span id="lutno1"></span></strong><br>
                <strong>Container No:<span id="contlo1"></span></strong><br>
                <strong>EPCG License No:<span id="epoglo1"></span></strong><br>
                </td>
                <td><b>Transporter:</b> <span id="trans1"></span><br>
                <b>Vehicle No:</b><span id="vehino1"></span><br>
                <b>LR/DOCKET No:<span id="lrdoc1"></span></b><br>
                <b>Date:<span id="lrdate1"></span></b><br>
                </td>
                <td><b>Shipment Mode:</b> <span id="shipmo1"></span><br>
                <b>Delivery Condition:</b> <span id="delcon1"></span><br>
                </td>
            </tr>
        </table>
        
        <table class="product-table">
            <thead>
                <tr>
                    <th>Sr No.</th>
                    <th>Product Description</th>
                    <th>Pieces</th>
                    <th>Service/HSN Code</th>
                    <th>UOM</th>
                    <th>Qty</th>
                    <th>Weight</th>
                    <th>Unit Price</th>
                    <th>Value (INR)</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows} 
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
                    <span>Freight</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="4"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="freight1"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="2">
                    <span>TOTAL</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="pitotal1"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="qtytotal1"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="wiegtotal1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="val111"></span><br>
                    </td>
                 </tr>
            </tbody>
            <tbody>
                ${taxRows}
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
                        ${taxDetails} <!-- Dynamic Tax Name & Value in Words -->
                        <b>Gross total in words:</b> <b>${grandTotalInWords}</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
                        <b>TOTAL INVOICE VALUE:</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
                        <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
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
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Payable by Customer</span><br>
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${gstremarks}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Basic</span><br>
                    ${taxDetailsNew}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxPerValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarks}</span><br>
                    ${taxadvanceValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarksnon}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${basicValue}</span><br>
                    ${taxValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxValuedept}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>${basicValuecos}</span><br>
                    ${taxValuecos}
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
                    <span id="taxbasic1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="grandlast1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxtotal1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span id="grandlast121"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="9">
                    <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b id="bankname1"></b>,
                    <span>ACCOUNT NUMBER:</span><b id="acc1"></b>,<span>BANK NAME & ADDRESS:</span><b id="bname1"></b>,<b id="add1"></b>
                    <span>BRANCH CODE:</span><b id="code1"></b>,<span>SWIFT CODE:</span><b id="scode1"></b>,<span>IFSC CODE:</span><b id="ifsc1"></b><br>
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
		                    <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="3">
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
    
    <div class="invoice-container2">
        <div class="invoice-header">
            <b><span id="topdate12"></span></b>
            <div class="gst-text">GST TAX INVOICE</div>
            <div class="gst-text1">Duplicate for Supplier</div>
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
                    ICE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
                    Email: invoice@jssl.in    Website: www.jssl.in<br>
                </td>
                <td colspan="2">
                <b>Invoice No:</b> <span id="invoiceNumber12"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date12"></span><br>
                <b>Contract No Reference No:</b> <span id="contrefno12"></span><br>
                <b>Date & Time of supply:</b> <span id="datetime12"></span><br>
                <b>Work/Purchase Order No:</b> <span id="workor12"></span><br>
                <b>Date of Order:</b> <span id="dateor12"></span><br>
            </tr>
            <tr>
                <td colspan="2"><strong>Invoice To:</strong><br>
                <span id="shipto1112"></span><br>
                <b>Name of the state:</b> <span id="statename12"></span><br>
                <b>State Code:</b> <span id="stcode1112"></span><br>
                <b>GSTIN:</b><span id="ingst12"></span><br>
                <b>PAN:</b><span id="panin12"></span><br>
                </td>
                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
                <span id="conadd12"></span><br>
                <b>State Name:</b> <span id="state12"></span><br>
                <b>State Code:</b> <span id="stateco12"></span><br>
                <b>GSTIN:</b><span id="congst12"></span><br>
                <b>PAN:</b><span id="pancon12"></span><br>
                </td>
            </tr>
            <tr>
                <td><strong>Date of Notification</strong><br>
                 <strong>Exempted note under:</strong><br>
                 <strong>Tax is Payble on revese charge:(Yes/No):<span id="taxpayre12"></span></strong><br>
                 </td>
                <td><strong>Export Details:</strong><br>
                <strong>ARE No:<span id="areano12"></span></strong><br>
                <strong>LUT No:<span id="lutno12"></span></strong><br>
                <strong>Container No:<span id="contlo12"></span></strong><br>
                <strong>EPCG License No:<span id="epoglo12"></span></strong><br>
                </td>
                <td><b>Transporter:</b> <span id="trans12"></span><br>
                <b>Vehicle No:</b><span id="vehino12"></span><br>
                <b>LR/DOCKET No:<span id="lrdoc12"></span></b><br>
                <b>Date:<span id="lrdate12"></span></b><br>
                </td>
                <td><b>Shipment Mode:</b> <span id="shipmo12"></span><br>
                <b>Delivery Condition:</b> <span id="delcon12"></span><br>
                </td>
            </tr>
        </table>
        
        <table class="product-table">
            <thead>
                <tr>
                    <th>Sr No.</th>
                    <th>Product Description</th>
                    <th>Pieces</th>
                    <th>Service/HSN Code</th>
                    <th>UOM</th>
                    <th>Qty</th>
                    <th>Weight</th>
                    <th>Unit Price</th>
                    <th>Value (INR)</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows} 
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
                    <span>Freight</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="4"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="freight12"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="2">
                    <span>TOTAL</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="pitotal12"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="qtytotal12"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="wiegtotal12"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="val1112"></span><br>
                    </td>
                 </tr>
            </tbody>
            <tbody>
                ${taxRows}
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
                        ${taxDetails} <!-- Dynamic Tax Name & Value in Words -->
                        <b>Gross total in words:</b> <b>${grandTotalInWords}</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
                        <b>TOTAL INVOICE VALUE:</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
                        <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
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
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Payable by Customer</span><br>
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${gstremarks}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Basic</span><br>
                    ${taxDetailsNew}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxPerValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarks}</span><br>
                    ${taxadvanceValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarksnon}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${basicValue}</span><br>
                    ${taxValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxValuedept}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>${basicValuecos}</span><br>
                    ${taxValuecos}
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
                    <span id="taxbasic12"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="grandlast12"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxtotal12"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span id="grandlast1212"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="9">
                    <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b id="bankname12"></b>,
                    <span>ACCOUNT NUMBER:</span><b id="acc12"></b>,<span>BANK NAME & ADDRESS:</span><b id="bname12"></b>,<b id="add12"></b>
                    <span>BRANCH CODE:</span><b id="code12"></b>,<span>SWIFT CODE:</span><b id="scode12"></b>,<span>IFSC CODE:</span><b id="ifsc12"></b><br>
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
		                    <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="3">
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
     printElement.querySelector('#datetime').textContent = formattedDateTime;
     printElement.querySelector('#topdate').textContent = formattedDateTime;
     printElement.querySelector('#dateor').textContent = currentDate;
     printElement.querySelector('#date').textContent = currentDate;
     printElement.querySelector('#invoiceNumber').textContent = invoiceno;
     printElement.querySelector('#shipto11').textContent = invoice_to_id_value;
     printElement.querySelector('#taxpayre').textContent = tax_payable;
     printElement.querySelector('#areano').textContent = area_no;
     printElement.querySelector('#contlo').textContent = containter_no;
     printElement.querySelector('#lutno').textContent = lot_no;
     printElement.querySelector('#epoglo').textContent = epcgno;
     printElement.querySelector('#trans').textContent = transport_name;
     printElement.querySelector('#lrdoc').textContent = lr_docketno;
     printElement.querySelector('#lrdate').textContent = date_val;
     printElement.querySelector('#shipmo').textContent = shipment_mode_id_value;
     printElement.querySelector('#delcon').textContent = delivery_condition_id_value;
     printElement.querySelector('#conadd').textContent = consignee_id_value;
     printElement.querySelector('#workor').textContent = work_id_value;
     printElement.querySelector('#vehino').textContent = vechile_no;
     printElement.querySelector('#contrefno').textContent = con_code_with_lot_no;
     printElement.querySelector('#statename').textContent = invoiceStateName;
     printElement.querySelector('#state').textContent = consigneeStateName;
     printElement.querySelector('#stateco').textContent = consigneeStateCode;
     printElement.querySelector('#stcode11').textContent = invoiceStateCode;
     printElement.querySelector('#congst').textContent = consigneeGstNo;
     printElement.querySelector('#ingst').textContent = invoiceGstNo;
     printElement.querySelector('#pancon').textContent = consigneePanNo;
     printElement.querySelector('#panin').textContent = invoicePanNo;
     printElement.querySelector('#freight').textContent = freight;
     printElement.querySelector('#pitotal').textContent = total_pices;
     printElement.querySelector('#qtytotal').textContent = total_qty;
     printElement.querySelector('#wiegtotal').textContent = total_kgs;
     printElement.querySelector('#val11').textContent = basic_value;
     printElement.querySelector('#grandlast').textContent = Grand_Total_tax;
     printElement.querySelector('#grandlast12new').textContent = PBC_Final_total;
     printElement.querySelector('#bankname').textContent = bankName;
     printElement.querySelector('#acc').textContent = account_number;
     printElement.querySelector('#bname').textContent = branch_address;
     printElement.querySelector('#code').textContent = branch_code;
     printElement.querySelector('#scode').textContent = swift_code;
     printElement.querySelector('#ifsc').textContent = ifsc_code;
     printElement.querySelector('#taxbasic').textContent = Total_adv_tax_Taxable;
     printElement.querySelector('#taxtotal').textContent = Tax_Final_total;
     //printElement.querySelector('#prodesc').textContent = product_desc;
     
     //page 2
     printElement.querySelector('#datetime1').textContent = formattedDateTime;
     printElement.querySelector('#topdate1').textContent = formattedDateTime;
     printElement.querySelector('#dateor1').textContent = currentDate;
     printElement.querySelector('#date1').textContent = currentDate;
     printElement.querySelector('#invoiceNumber1').textContent = invoiceno;
     printElement.querySelector('#shipto111').textContent = invoice_to_id_value;
     printElement.querySelector('#taxpayre1').textContent = tax_payable;
     printElement.querySelector('#areano1').textContent = area_no;
     printElement.querySelector('#contlo1').textContent = containter_no;
     printElement.querySelector('#lutno1').textContent = lot_no;
     printElement.querySelector('#epoglo1').textContent = epcgno;
     printElement.querySelector('#trans1').textContent = transport_name;
     printElement.querySelector('#lrdoc1').textContent = lr_docketno;
     printElement.querySelector('#lrdate1').textContent = date_val;
     printElement.querySelector('#shipmo1').textContent = shipment_mode_id_value;
     printElement.querySelector('#delcon1').textContent = delivery_condition_id_value;
     printElement.querySelector('#conadd1').textContent = consignee_id_value;
     printElement.querySelector('#workor1').textContent = work_id_value;
     printElement.querySelector('#vehino1').textContent = vechile_no;
     printElement.querySelector('#contrefno1').textContent = con_code_with_lot_no;
     printElement.querySelector('#statename1').textContent = invoiceStateName;
     printElement.querySelector('#state1').textContent = consigneeStateName;
     printElement.querySelector('#stateco1').textContent = consigneeStateCode;
     printElement.querySelector('#stcode111').textContent = invoiceStateCode;
     printElement.querySelector('#congst1').textContent = consigneeGstNo;
     printElement.querySelector('#ingst1').textContent = invoiceGstNo;
     printElement.querySelector('#pancon1').textContent = consigneePanNo;
     printElement.querySelector('#panin1').textContent = invoicePanNo;
     printElement.querySelector('#freight1').textContent = freight;
     printElement.querySelector('#pitotal1').textContent = total_pices;
     printElement.querySelector('#qtytotal1').textContent = total_qty;
     printElement.querySelector('#wiegtotal1').textContent = total_kgs;
     printElement.querySelector('#val111').textContent = basic_value;
     printElement.querySelector('#grandlast1').textContent = Grand_Total_tax;
     printElement.querySelector('#grandlast121').textContent = PBC_Final_total;
     printElement.querySelector('#bankname1').textContent = bankName;
     printElement.querySelector('#acc1').textContent = account_number;
     printElement.querySelector('#bname1').textContent = branch_address;
     printElement.querySelector('#code1').textContent = branch_code;
     printElement.querySelector('#scode1').textContent = swift_code;
     printElement.querySelector('#ifsc1').textContent = ifsc_code;
     printElement.querySelector('#taxbasic1').textContent = Total_adv_tax_Taxable;
     printElement.querySelector('#taxtotal1').textContent = Tax_Final_total;
     
     //page 3
     printElement.querySelector('#datetime12').textContent = formattedDateTime;
     printElement.querySelector('#topdate12').textContent = formattedDateTime;
     printElement.querySelector('#dateor12').textContent = currentDate;
     printElement.querySelector('#date12').textContent = currentDate;
     printElement.querySelector('#invoiceNumber12').textContent = invoiceno;
     printElement.querySelector('#shipto1112').textContent = invoice_to_id_value;
     printElement.querySelector('#taxpayre12').textContent = tax_payable;
     printElement.querySelector('#areano12').textContent = area_no;
     printElement.querySelector('#contlo12').textContent = containter_no;
     printElement.querySelector('#lutno12').textContent = lot_no;
     printElement.querySelector('#epoglo12').textContent = epcgno;
     printElement.querySelector('#trans12').textContent = transport_name;
     printElement.querySelector('#lrdoc12').textContent = lr_docketno;
     printElement.querySelector('#lrdate12').textContent = date_val;
     printElement.querySelector('#shipmo12').textContent = shipment_mode_id_value;
     printElement.querySelector('#delcon12').textContent = delivery_condition_id_value;
     printElement.querySelector('#conadd12').textContent = consignee_id_value;
     printElement.querySelector('#workor12').textContent = work_id_value;
     printElement.querySelector('#vehino12').textContent = vechile_no;
     printElement.querySelector('#contrefno12').textContent = con_code_with_lot_no;
     printElement.querySelector('#statename12').textContent = invoiceStateName;
     printElement.querySelector('#state12').textContent = consigneeStateName;
     printElement.querySelector('#stateco12').textContent = consigneeStateCode;
     printElement.querySelector('#stcode1112').textContent = invoiceStateCode;
     printElement.querySelector('#congst12').textContent = consigneeGstNo;
     printElement.querySelector('#ingst12').textContent = invoiceGstNo;
     printElement.querySelector('#pancon12').textContent = consigneePanNo;
     printElement.querySelector('#panin12').textContent = invoicePanNo;
     printElement.querySelector('#freight12').textContent = freight;
     printElement.querySelector('#pitotal12').textContent = total_pices;
     printElement.querySelector('#qtytotal12').textContent = total_qty;
     printElement.querySelector('#wiegtotal12').textContent = total_kgs;
     printElement.querySelector('#val1112').textContent = basic_value;
     printElement.querySelector('#grandlast12').textContent = Grand_Total_tax;
     printElement.querySelector('#grandlast1212').textContent = PBC_Final_total;
     printElement.querySelector('#bankname12').textContent = bankName;
     printElement.querySelector('#acc12').textContent = account_number;
     printElement.querySelector('#bname12').textContent = branch_address;
     printElement.querySelector('#code12').textContent = branch_code;
     printElement.querySelector('#scode12').textContent = swift_code;
     printElement.querySelector('#ifsc12').textContent = ifsc_code;
     printElement.querySelector('#taxbasic12').textContent = Total_adv_tax_Taxable;
     printElement.querySelector('#taxtotal12').textContent = Tax_Final_total;
     
    const doc = new window.jspdf.jsPDF();

        doc.html(printElement, {
            callback: function (doc) {
               doc.save(`Steel_Invoice_${invoiceno}.pdf`);
            },
            x: 6,
            y: 6,
            width: 165,
            windowWidth: 1000
         });
         

    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

else
	{
		const allowed = window.allowedActions || [];
			if (!allowed.includes("Print")) {
			  alert(" You do not have permission to print.");
			  console.warn("Blocked print attempt. User lacks Print permission.");
			  return;
			}

			// ✅ Proceed with print logic here
			console.log(" Printing record with ID:", id);
			// Your actual print logic here
		    try {
			    const url = new URL(`/jssl/invoice/searchidcancel?id=${id}`, baseUrl);
				const response = await fetch(url,{
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
		         
		         const invoiceno = Invoice_Data.invoice_no;
		         const lr_docketno = Invoice_Data.lr_docketno;
		         const date_val = Invoice_Data.date_val;
		         //const product_desc = json.Invoice_Data?.product_desc || ''; // Fix reference
		         
		         const invoice_to_id_value = Contractor_Data[0].invoice_to_id_value;
		         const tax_payable = Contractor_Data[0].tax_payable;
		         const area_no = Contractor_Data[0].area_no;
		         const lot_no = Contractor_Data[0].lot_no;
		         const containter_no = Contractor_Data[0].containter_no;
		         const epcgno = Contractor_Data[0].epcgno;
		         const shipment_mode_id_value = Contractor_Data[0].shipment_mode_id_value;
		         const delivery_condition_id_value = Contractor_Data[0].delivery_condition_id_value;
		         const consignee_id_value = Contractor_Data[0].consignee_id_value;
		         const work_id_value = Contractor_Data[0].work_id_value;
		         const invoiceStateName = Contractor_Data[0].invoiceStateName;
		         const consigneeStateName = Contractor_Data[0].consigneeStateName;
		         const invoiceStateCode = Contractor_Data[0].invoiceStateCode;
		         const consigneeStateCode = Contractor_Data[0].consigneeStateCode;
		         const invoiceGstNo = Contractor_Data[0].invoiceGstNo;
		         const consigneeGstNo = Contractor_Data[0].consigneeGstNo;
		         const invoicePanNo = Contractor_Data[0].invoicePanNo;
		         const consigneePanNo = Contractor_Data[0].consigneePanNo;
		         const bankName = Contractor_Data[0].bankName;
		         const account_number = Contractor_Data[0].account_number;
		         const branch_address = Contractor_Data[0].branch_address;
		         const branch_code = Contractor_Data[0].branch_code;
		         const swift_code = Contractor_Data[0].swift_code;
		         const ifsc_code = Contractor_Data[0].ifsc_code;
		         
		         const transport_name = QsPacking_Data[0].transport_name;
		         const vechile_no = QsPacking_Data[0].vechile_no;
		         const con_code_with_lot_no = QsPacking_Data[0].con_code_with_lot_no;
		         
		         const freight = tax[0].freight;
		         const total_pices = tax[0].total_pices;
		         const total_kgs = tax[0].total_kgs;
		         const total_qty = tax[0].total_qty;
		         const basic_value = tax[0].basic_value;
		         
				 const items = json.QsPacking_Data || []; 
				 const taxData = json.tax || [];
				 const InvoiceData = json.Invoice_Data || [];
				 const grandTotalData = json.Grand_Total_value?.[0] || {};
		         const grandTotalInWords = grandTotalData.GrandTotalInWords || '';
				 const grandTotalTax = grandTotalData.Grand_Total_tax || '';
				 const gstremarks = InvoiceData.gst_remarks || '';
				 const advremarks = taxData[0].taxable || '';
				 const advremarksnon = taxData[0].non_taxable || '';
				 const basicValue = taxData[0].basic_value || '';
				 const basicValuecos = taxData[0].optc || '';

		        // Generate dynamic rows based on QsPacking_Data
		        let tableRows = items.map((item, index) => `
		            <tr>
		                <td>${index + 1}</td>
		                <td>${item.scrap_name_type_id || ''}</td>
		                <td>${item.pice || ''}</td>
		                <td>${item.hcode || ''}</td>
		                <td>${item.uom_name || ''}</td>
		                <td>${item.qty || ''}</td>
		                <td>${item.per_kgs || ''}</td>
		                <td>${item.unit_price || ''}</td>
		                <td>${item.total || ''}</td>
		            </tr>
		        `).join('');
		        
		        // Generate dynamic tax rows
		        let taxRows = taxData.map(tax => `
		            <tr>
		                <td colspan="7" style="border: 1px solid #000;">${tax.tax_name || ''}</td>
		                <td style="border: 1px solid #000;">${tax.tax_per || ''}</td>
		                <td style="border: 1px solid #000;">${tax.tax_value || ''}</td>
		            </tr>
		        `).join('');
		        
		        // Generate dynamic tax descriptions with tax_name and tax_value_in_words
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
				`).join('');

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
					margin-top:12%;
		        }
		        .invoice-container1 {
		            width: 100vw;
		            max-width: 1200px;
		            border: 1px solid #000;
		            padding: 15px;
		            margin-top:32%;
		        }
		        .invoice-container2 {
		            width: 100vw;
		            max-width: 1200px;
		            border: 1px solid #000;
		            padding: 15px;
		            margin-top:32%;
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
		                    ICE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
		                    Email: invoice@jssl.in    Website: www.jssl.in<br>
		                </td>
		                <td colspan="2">
		                <b>Invoice No:</b> <span id="invoiceNumber"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date"></span><br>
		                <b>Contract No Reference No:</b> <span id="contrefno"></span><br>
		                <b>Date & Time of supply:</b> <span id="datetime"></span><br>
		                <b>Work/Purchase Order No:</b> <span id="workor"></span><br>
		                <b>Date of Order:</b> <span id="dateor"></span><br>
		            </tr>
		            <tr>
		                <td colspan="2"><strong>Invoice To:</strong><br>
		                <span id="shipto11"></span><br>
		                <b>Name of the state:</b> <span id="statename"></span><br>
		                <b>State Code:</b> <span id="stcode11"></span><br>
		                <b>GSTIN:</b><span id="ingst"></span><br>
		                <b>PAN:</b><span id="panin"></span><br>
		                </td>
		                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
		                <span id="conadd"></span><br>
		                <b>State Name:</b> <span id="state"></span><br>
		                <b>State Code:</b> <span id="stateco"></span><br>
		                <b>GSTIN:</b><span id="congst"></span><br>
		                <b>PAN:</b><span id="pancon"></span><br>
		                </td>
		            </tr>
		            <tr>
		                <td><strong>Date of Notification</strong><br>
		                 <strong>Exempted note under:</strong><br>
		                 <strong>Tax is Payble on revese charge:(Yes/No):<span id="taxpayre"></span></strong><br>
		                 </td>
		                <td><strong>Export Details:</strong><br>
		                <strong>ARE No:<span id="areano"></span></strong><br>
		                <strong>LUT No:<span id="lutno"></span></strong><br>
		                <strong>Container No:<span id="contlo"></span></strong><br>
		                <strong>EPCG License No:<span id="epoglo"></span></strong><br>
		                </td>
		                <td><b>Transporter:</b> <span id="trans"></span><br>
		                <b>Vehicle No:</b><span id="vehino"></span><br>
		                <b>LR/DOCKET No:<span id="lrdoc"></span></b><br>
		                <b>Date:<span id="lrdate"></span></b><br>
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
		                    <th>Pieces</th>
		                    <th>Service/HSN Code</th>
		                    <th>UOM</th>
		                    <th>Qty</th>
		                    <th>Weight</th>
		                    <th>Unit Price</th>
		                    <th>Value (INR)</th>
		                </tr>
		            </thead>
		            <tbody>
		                ${tableRows} 
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
		                    <span>Freight</span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;" colspan="4"></td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="freight"></span><br>
		                    </td>
		                </tr>
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 10px;"" colspan="2">
		                    <span>TOTAL</span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="pitotal"></span><br></td>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;"></td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="qtytotal"></span><br></td>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="wiegtotal"></span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;"></td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="val11"></span><br>
		                    </td>
		                 </tr>
		            </tbody>
		            <tbody>
		                ${taxRows}
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
		                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
		                        ${taxDetails} <!-- Dynamic Tax Name & Value in Words -->
		                        <b>Gross total in words:</b> <b>${grandTotalInWords}</b><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
		                        <b>TOTAL INVOICE VALUE:</b><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
		                        <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
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
		                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
		                    <span>Payable by Customer</span><br>
		                    </td>
		                    </tr>
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>${gstremarks}</span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>Basic</span><br>
		                    ${taxDetailsNew}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    ${taxPerValue}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>${advremarks}</span><br>
		                    ${taxadvanceValue}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>${advremarksnon}</span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>${basicValue}</span><br>
		                    ${taxValue}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    ${taxValuedept}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
		                    <span>${basicValuecos}</span><br>
		                    ${taxValuecos}
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
		                    <span id="taxbasic"></span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span id="grandlast"></span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span id="taxtotal"></span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
		                    <span id="grandlast12new"></span><br>
		                    </td>
		                </tr>
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="9">
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
				                    <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="3">
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
		    
		    <div class="invoice-container1">
		        <div class="invoice-header">
		            <b><span id="topdate1"></span></b>
		            <div class="gst-text">GST TAX INVOICE</div>
		            <div class="gst-text1">Duplicate for Transporter</div>
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
		                    ICE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
		                    Email: invoice@jssl.in    Website: www.jssl.in<br>
		                </td>
		                <td colspan="2">
		                <b>Invoice No:</b> <span id="invoiceNumber1"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date1"></span><br>
		                <b>Contract No Reference No:</b> <span id="contrefno1"></span><br>
		                <b>Date & Time of supply:</b> <span id="datetime1"></span><br>
		                <b>Work/Purchase Order No:</b> <span id="workor1"></span><br>
		                <b>Date of Order:</b> <span id="dateor1"></span><br>
		            </tr>
		            <tr>
		                <td colspan="2"><strong>Invoice To:</strong><br>
		                <span id="shipto111"></span><br>
		                <b>Name of the state:</b> <span id="statename1"></span><br>
		                <b>State Code:</b> <span id="stcode111"></span><br>
		                <b>GSTIN:</b><span id="ingst1"></span><br>
		                <b>PAN:</b><span id="panin1"></span><br>
		                </td>
		                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
		                <span id="conadd1"></span><br>
		                <b>State Name:</b> <span id="state1"></span><br>
		                <b>State Code:</b> <span id="stateco1"></span><br>
		                <b>GSTIN:</b><span id="congst1"></span><br>
		                <b>PAN:</b><span id="pancon1"></span><br>
		                </td>
		            </tr>
		            <tr>
		                <td><strong>Date of Notification</strong><br>
		                 <strong>Exempted note under:</strong><br>
		                 <strong>Tax is Payble on revese charge:(Yes/No):<span id="taxpayre1"></span></strong><br>
		                 </td>
		                <td><strong>Export Details:</strong><br>
		                <strong>ARE No:<span id="areano1"></span></strong><br>
		                <strong>LUT No:<span id="lutno1"></span></strong><br>
		                <strong>Container No:<span id="contlo1"></span></strong><br>
		                <strong>EPCG License No:<span id="epoglo1"></span></strong><br>
		                </td>
		                <td><b>Transporter:</b> <span id="trans1"></span><br>
		                <b>Vehicle No:</b><span id="vehino1"></span><br>
		                <b>LR/DOCKET No:<span id="lrdoc1"></span></b><br>
		                <b>Date:<span id="lrdate1"></span></b><br>
		                </td>
		                <td><b>Shipment Mode:</b> <span id="shipmo1"></span><br>
		                <b>Delivery Condition:</b> <span id="delcon1"></span><br>
		                </td>
		            </tr>
		        </table>
		        
		        <table class="product-table">
		            <thead>
		                <tr>
		                    <th>Sr No.</th>
		                    <th>Product Description</th>
		                    <th>Pieces</th>
		                    <th>Service/HSN Code</th>
		                    <th>UOM</th>
		                    <th>Qty</th>
		                    <th>Weight</th>
		                    <th>Unit Price</th>
		                    <th>Value (INR)</th>
		                </tr>
		            </thead>
		            <tbody>
		                ${tableRows} 
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
		                    <span>Freight</span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;" colspan="4"></td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="freight1"></span><br>
		                    </td>
		                </tr>
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 10px;"" colspan="2">
		                    <span>TOTAL</span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="pitotal1"></span><br></td>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;"></td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="qtytotal1"></span><br></td>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="wiegtotal1"></span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;"></td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="val111"></span><br>
		                    </td>
		                 </tr>
		            </tbody>
		            <tbody>
		                ${taxRows}
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
		                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
		                        ${taxDetails} <!-- Dynamic Tax Name & Value in Words -->
		                        <b>Gross total in words:</b> <b>${grandTotalInWords}</b><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
		                        <b>TOTAL INVOICE VALUE:</b><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
		                        <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
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
		                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
		                    <span>Payable by Customer</span><br>
		                    </td>
		                    </tr>
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>${gstremarks}</span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>Basic</span><br>
		                    ${taxDetailsNew}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    ${taxPerValue}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>${advremarks}</span><br>
		                    ${taxadvanceValue}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>${advremarksnon}</span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>${basicValue}</span><br>
		                    ${taxValue}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    ${taxValuedept}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
		                    <span>${basicValuecos}</span><br>
		                    ${taxValuecos}
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
		                    <span id="taxbasic1"></span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span id="grandlast1"></span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span id="taxtotal1"></span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
		                    <span id="grandlast121"></span><br>
		                    </td>
		                </tr>
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="9">
		                    <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b id="bankname1"></b>,
		                    <span>ACCOUNT NUMBER:</span><b id="acc1"></b>,<span>BANK NAME & ADDRESS:</span><b id="bname1"></b>,<b id="add1"></b>
		                    <span>BRANCH CODE:</span><b id="code1"></b>,<span>SWIFT CODE:</span><b id="scode1"></b>,<span>IFSC CODE:</span><b id="ifsc1"></b><br>
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
				                    <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="3">
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
		    
		    <div class="invoice-container2">
		        <div class="invoice-header">
		            <b><span id="topdate12"></span></b>
		            <div class="gst-text">GST TAX INVOICE</div>
		            <div class="gst-text1">Duplicate for Supplier</div>
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
		                    ICE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
		                    Email: invoice@jssl.in    Website: www.jssl.in<br>
		                </td>
		                <td colspan="2">
		                <b>Invoice No:</b> <span id="invoiceNumber12"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date12"></span><br>
		                <b>Contract No Reference No:</b> <span id="contrefno12"></span><br>
		                <b>Date & Time of supply:</b> <span id="datetime12"></span><br>
		                <b>Work/Purchase Order No:</b> <span id="workor12"></span><br>
		                <b>Date of Order:</b> <span id="dateor12"></span><br>
		            </tr>
		            <tr>
		                <td colspan="2"><strong>Invoice To:</strong><br>
		                <span id="shipto1112"></span><br>
		                <b>Name of the state:</b> <span id="statename12"></span><br>
		                <b>State Code:</b> <span id="stcode1112"></span><br>
		                <b>GSTIN:</b><span id="ingst12"></span><br>
		                <b>PAN:</b><span id="panin12"></span><br>
		                </td>
		                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
		                <span id="conadd12"></span><br>
		                <b>State Name:</b> <span id="state12"></span><br>
		                <b>State Code:</b> <span id="stateco12"></span><br>
		                <b>GSTIN:</b><span id="congst12"></span><br>
		                <b>PAN:</b><span id="pancon12"></span><br>
		                </td>
		            </tr>
		            <tr>
		                <td><strong>Date of Notification</strong><br>
		                 <strong>Exempted note under:</strong><br>
		                 <strong>Tax is Payble on revese charge:(Yes/No):<span id="taxpayre12"></span></strong><br>
		                 </td>
		                <td><strong>Export Details:</strong><br>
		                <strong>ARE No:<span id="areano12"></span></strong><br>
		                <strong>LUT No:<span id="lutno12"></span></strong><br>
		                <strong>Container No:<span id="contlo12"></span></strong><br>
		                <strong>EPCG License No:<span id="epoglo12"></span></strong><br>
		                </td>
		                <td><b>Transporter:</b> <span id="trans12"></span><br>
		                <b>Vehicle No:</b><span id="vehino12"></span><br>
		                <b>LR/DOCKET No:<span id="lrdoc12"></span></b><br>
		                <b>Date:<span id="lrdate12"></span></b><br>
		                </td>
		                <td><b>Shipment Mode:</b> <span id="shipmo12"></span><br>
		                <b>Delivery Condition:</b> <span id="delcon12"></span><br>
		                </td>
		            </tr>
		        </table>
		        
		        <table class="product-table">
		            <thead>
		                <tr>
		                    <th>Sr No.</th>
		                    <th>Product Description</th>
		                    <th>Pieces</th>
		                    <th>Service/HSN Code</th>
		                    <th>UOM</th>
		                    <th>Qty</th>
		                    <th>Weight</th>
		                    <th>Unit Price</th>
		                    <th>Value (INR)</th>
		                </tr>
		            </thead>
		            <tbody>
		                ${tableRows} 
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
		                    <span>Freight</span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;" colspan="4"></td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="freight12"></span><br>
		                    </td>
		                </tr>
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 10px;"" colspan="2">
		                    <span>TOTAL</span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="pitotal12"></span><br></td>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;"></td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="qtytotal12"></span><br></td>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="wiegtotal12"></span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;"></td>
		                    <td style="border: 1px solid #000; height: 10px;">
		                    <span id="val1112"></span><br>
		                    </td>
		                 </tr>
		            </tbody>
		            <tbody>
		                ${taxRows}
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
		                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
		                        ${taxDetails} <!-- Dynamic Tax Name & Value in Words -->
		                        <b>Gross total in words:</b> <b>${grandTotalInWords}</b><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
		                        <b>TOTAL INVOICE VALUE:</b><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
		                        <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
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
		                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
		                    <span>Payable by Customer</span><br>
		                    </td>
		                    </tr>
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>${gstremarks}</span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>Basic</span><br>
		                    ${taxDetailsNew}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    ${taxPerValue}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>${advremarks}</span><br>
		                    ${taxadvanceValue}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>${advremarksnon}</span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span>${basicValue}</span><br>
		                    ${taxValue}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    ${taxValuedept}
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
		                    <span>${basicValuecos}</span><br>
		                    ${taxValuecos}
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
		                    <span id="taxbasic12"></span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span id="grandlast12"></span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;">
		                    <span id="taxtotal12"></span><br>
		                    </td>
		                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
		                    <span id="grandlast1212"></span><br>
		                    </td>
		                </tr>
		            </tbody>
		            <tbody>
		                <tr>
		                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="9">
		                    <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b id="bankname12"></b>,
		                    <span>ACCOUNT NUMBER:</span><b id="acc12"></b>,<span>BANK NAME & ADDRESS:</span><b id="bname12"></b>,<b id="add12"></b>
		                    <span>BRANCH CODE:</span><b id="code12"></b>,<span>SWIFT CODE:</span><b id="scode12"></b>,<span>IFSC CODE:</span><b id="ifsc12"></b><br>
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
				                    <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="3">
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
		     printElement.querySelector('#datetime').textContent = formattedDateTime;
		     printElement.querySelector('#topdate').textContent = formattedDateTime;
		     printElement.querySelector('#dateor').textContent = currentDate;
		     printElement.querySelector('#date').textContent = currentDate;
		     printElement.querySelector('#invoiceNumber').textContent = invoiceno;
		     printElement.querySelector('#shipto11').textContent = invoice_to_id_value;
		     printElement.querySelector('#taxpayre').textContent = tax_payable;
		     printElement.querySelector('#areano').textContent = area_no;
		     printElement.querySelector('#contlo').textContent = containter_no;
		     printElement.querySelector('#lutno').textContent = lot_no;
		     printElement.querySelector('#epoglo').textContent = epcgno;
		     printElement.querySelector('#trans').textContent = transport_name;
		     printElement.querySelector('#lrdoc').textContent = lr_docketno;
		     printElement.querySelector('#lrdate').textContent = date_val;
		     printElement.querySelector('#shipmo').textContent = shipment_mode_id_value;
		     printElement.querySelector('#delcon').textContent = delivery_condition_id_value;
		     printElement.querySelector('#conadd').textContent = consignee_id_value;
		     printElement.querySelector('#workor').textContent = work_id_value;
		     printElement.querySelector('#vehino').textContent = vechile_no;
		     printElement.querySelector('#contrefno').textContent = con_code_with_lot_no;
		     printElement.querySelector('#statename').textContent = invoiceStateName;
		     printElement.querySelector('#state').textContent = consigneeStateName;
		     printElement.querySelector('#stateco').textContent = consigneeStateCode;
		     printElement.querySelector('#stcode11').textContent = invoiceStateCode;
		     printElement.querySelector('#congst').textContent = consigneeGstNo;
		     printElement.querySelector('#ingst').textContent = invoiceGstNo;
		     printElement.querySelector('#pancon').textContent = consigneePanNo;
		     printElement.querySelector('#panin').textContent = invoicePanNo;
		     printElement.querySelector('#freight').textContent = freight;
		     printElement.querySelector('#pitotal').textContent = total_pices;
		     printElement.querySelector('#qtytotal').textContent = total_qty;
		     printElement.querySelector('#wiegtotal').textContent = total_kgs;
		     printElement.querySelector('#val11').textContent = basic_value;
		     printElement.querySelector('#grandlast').textContent = Grand_Total_tax;
		     printElement.querySelector('#grandlast12new').textContent = PBC_Final_total;
		     printElement.querySelector('#bankname').textContent = bankName;
		     printElement.querySelector('#acc').textContent = account_number;
		     printElement.querySelector('#bname').textContent = branch_address;
		     printElement.querySelector('#code').textContent = branch_code;
		     printElement.querySelector('#scode').textContent = swift_code;
		     printElement.querySelector('#ifsc').textContent = ifsc_code;
		     printElement.querySelector('#taxbasic').textContent = Total_adv_tax_Taxable;
		     printElement.querySelector('#taxtotal').textContent = Tax_Final_total;
		     //printElement.querySelector('#prodesc').textContent = product_desc;
		     
		     //page 2
		     printElement.querySelector('#datetime1').textContent = formattedDateTime;
		     printElement.querySelector('#topdate1').textContent = formattedDateTime;
		     printElement.querySelector('#dateor1').textContent = currentDate;
		     printElement.querySelector('#date1').textContent = currentDate;
		     printElement.querySelector('#invoiceNumber1').textContent = invoiceno;
		     printElement.querySelector('#shipto111').textContent = invoice_to_id_value;
		     printElement.querySelector('#taxpayre1').textContent = tax_payable;
		     printElement.querySelector('#areano1').textContent = area_no;
		     printElement.querySelector('#contlo1').textContent = containter_no;
		     printElement.querySelector('#lutno1').textContent = lot_no;
		     printElement.querySelector('#epoglo1').textContent = epcgno;
		     printElement.querySelector('#trans1').textContent = transport_name;
		     printElement.querySelector('#lrdoc1').textContent = lr_docketno;
		     printElement.querySelector('#lrdate1').textContent = date_val;
		     printElement.querySelector('#shipmo1').textContent = shipment_mode_id_value;
		     printElement.querySelector('#delcon1').textContent = delivery_condition_id_value;
		     printElement.querySelector('#conadd1').textContent = consignee_id_value;
		     printElement.querySelector('#workor1').textContent = work_id_value;
		     printElement.querySelector('#vehino1').textContent = vechile_no;
		     printElement.querySelector('#contrefno1').textContent = con_code_with_lot_no;
		     printElement.querySelector('#statename1').textContent = invoiceStateName;
		     printElement.querySelector('#state1').textContent = consigneeStateName;
		     printElement.querySelector('#stateco1').textContent = consigneeStateCode;
		     printElement.querySelector('#stcode111').textContent = invoiceStateCode;
		     printElement.querySelector('#congst1').textContent = consigneeGstNo;
		     printElement.querySelector('#ingst1').textContent = invoiceGstNo;
		     printElement.querySelector('#pancon1').textContent = consigneePanNo;
		     printElement.querySelector('#panin1').textContent = invoicePanNo;
		     printElement.querySelector('#freight1').textContent = freight;
		     printElement.querySelector('#pitotal1').textContent = total_pices;
		     printElement.querySelector('#qtytotal1').textContent = total_qty;
		     printElement.querySelector('#wiegtotal1').textContent = total_kgs;
		     printElement.querySelector('#val111').textContent = basic_value;
		     printElement.querySelector('#grandlast1').textContent = Grand_Total_tax;
		     printElement.querySelector('#grandlast121').textContent = PBC_Final_total;
		     printElement.querySelector('#bankname1').textContent = bankName;
		     printElement.querySelector('#acc1').textContent = account_number;
		     printElement.querySelector('#bname1').textContent = branch_address;
		     printElement.querySelector('#code1').textContent = branch_code;
		     printElement.querySelector('#scode1').textContent = swift_code;
		     printElement.querySelector('#ifsc1').textContent = ifsc_code;
		     printElement.querySelector('#taxbasic1').textContent = Total_adv_tax_Taxable;
		     printElement.querySelector('#taxtotal1').textContent = Tax_Final_total;
		     
		     //page 3
		     printElement.querySelector('#datetime12').textContent = formattedDateTime;
		     printElement.querySelector('#topdate12').textContent = formattedDateTime;
		     printElement.querySelector('#dateor12').textContent = currentDate;
		     printElement.querySelector('#date12').textContent = currentDate;
		     printElement.querySelector('#invoiceNumber12').textContent = invoiceno;
		     printElement.querySelector('#shipto1112').textContent = invoice_to_id_value;
		     printElement.querySelector('#taxpayre12').textContent = tax_payable;
		     printElement.querySelector('#areano12').textContent = area_no;
		     printElement.querySelector('#contlo12').textContent = containter_no;
		     printElement.querySelector('#lutno12').textContent = lot_no;
		     printElement.querySelector('#epoglo12').textContent = epcgno;
		     printElement.querySelector('#trans12').textContent = transport_name;
		     printElement.querySelector('#lrdoc12').textContent = lr_docketno;
		     printElement.querySelector('#lrdate12').textContent = date_val;
		     printElement.querySelector('#shipmo12').textContent = shipment_mode_id_value;
		     printElement.querySelector('#delcon12').textContent = delivery_condition_id_value;
		     printElement.querySelector('#conadd12').textContent = consignee_id_value;
		     printElement.querySelector('#workor12').textContent = work_id_value;
		     printElement.querySelector('#vehino12').textContent = vechile_no;
		     printElement.querySelector('#contrefno12').textContent = con_code_with_lot_no;
		     printElement.querySelector('#statename12').textContent = invoiceStateName;
		     printElement.querySelector('#state12').textContent = consigneeStateName;
		     printElement.querySelector('#stateco12').textContent = consigneeStateCode;
		     printElement.querySelector('#stcode1112').textContent = invoiceStateCode;
		     printElement.querySelector('#congst12').textContent = consigneeGstNo;
		     printElement.querySelector('#ingst12').textContent = invoiceGstNo;
		     printElement.querySelector('#pancon12').textContent = consigneePanNo;
		     printElement.querySelector('#panin12').textContent = invoicePanNo;
		     printElement.querySelector('#freight12').textContent = freight;
		     printElement.querySelector('#pitotal12').textContent = total_pices;
		     printElement.querySelector('#qtytotal12').textContent = total_qty;
		     printElement.querySelector('#wiegtotal12').textContent = total_kgs;
		     printElement.querySelector('#val1112').textContent = basic_value;
		     printElement.querySelector('#grandlast12').textContent = Grand_Total_tax;
		     printElement.querySelector('#grandlast1212').textContent = PBC_Final_total;
		     printElement.querySelector('#bankname12').textContent = bankName;
		     printElement.querySelector('#acc12').textContent = account_number;
		     printElement.querySelector('#bname12').textContent = branch_address;
		     printElement.querySelector('#code12').textContent = branch_code;
		     printElement.querySelector('#scode12').textContent = swift_code;
		     printElement.querySelector('#ifsc12').textContent = ifsc_code;
		     printElement.querySelector('#taxbasic12').textContent = Total_adv_tax_Taxable;
		     printElement.querySelector('#taxtotal12').textContent = Tax_Final_total;
		     
		    const doc = new window.jspdf.jsPDF();

		        doc.html(printElement, {
		            callback: function (doc) {
		               doc.save(`Steel_Invoice_${invoiceno}.pdf`);
		            },
		            x: 6,
		            y: 6,
		            width: 165,
		            windowWidth: 1000
		         });
		         

		    } catch (error) {
		        console.error('Error generating PDF:', error);
		    }
	}
}*/

async function printRecord(id, status) {

    if (!allowed.includes("Print")) {
        alert("You do not have permission to print.");
        console.warn("Blocked print attempt. User lacks Print permission.");
        return;
    }

    showLoader();
    console.log("Printing record with ID:", id);
	
	// ─── HELPER: Parse any date string/number into a Date object ──────────────
	function toDateObj(val) {
	    if (!val) return null;
	    if (val instanceof Date) return isNaN(val) ? null : val;
	    if (typeof val === 'number') return new Date(val);

	    const s = String(val).trim();
	    if (/^\d{10,}$/.test(s)) return new Date(Number(s));          // epoch millis

	    // yyyy-MM-dd [HH:mm[:ss]]
	    let m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/);
	    if (m) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));

	    // dd-MM-yyyy or dd/MM/yyyy [HH:mm[:ss]]
	    m = s.match(/^(\d{2})[-\/](\d{2})[-\/](\d{4})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/);
	    if (m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));

	    const d = new Date(s);
	    return isNaN(d) ? null : d;
	}

	// dd-mm-yyyy
	function formatDMY(val) {
	    const d = toDateObj(val);
	    if (!d) return val || '';
	    return String(d.getDate()).padStart(2, '0') + '-' +
	           String(d.getMonth() + 1).padStart(2, '0') + '-' +
	           d.getFullYear();
	}

	// dd-mm-yyyy HH:mm:ss
	function formatDMYHMS(val) {
	    const d = toDateObj(val);
	    if (!d) return val || '';
	    return formatDMY(d) + ' ' +
	           String(d.getHours()).padStart(2, '0') + ':' +
	           String(d.getMinutes()).padStart(2, '0') + ':' +
	           String(d.getSeconds()).padStart(2, '0');
	}

    // ─── HELPER: Format numbers with Indian comma style ───────────────────────
    function formatAmount(value) {
        if (!value && value !== 0) return '';
        const num = parseFloat(String(value).replace(/,/g, ''));
        if (isNaN(num)) return value;
        return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // ─── HELPER: Clean & trim address parts ──────────────────────────────────
    function buildAddress(parts) {
        return parts
            .filter(x => x && x.toString().trim() !== "")
            .map(x => x.toString().trim())
            .join("\n");
    }

    // ─── HELPER: Clean business unit name / address text ─────────────────────
    // Removes JBU code, company name (even with spelling variations),
    // GSTIN, PAN and trailing pincode (pincode is added again from master data).
    function cleanBusinessUnitAddress(name) {
        if (!name) return '';
        return String(name)
            .replace(/^JBU-\d+\s*/i, '')                                          // JBU-16
            .replace(/JSW\s+Sever\w*\s+Structures\s+(Limited|Ltd\.?)\s*,?/i, '')  // company name (handles typos)
            .replace(/,?\s*GSTIN\s*\.?\s*:?\s*[0-9A-Z]{15}/i, '')                 // GSTIN
            .replace(/,?\s*PAN\s*\.?\s*:?\s*[A-Z]{5}\d{4}[A-Z]/i, '')             // PAN
            .replace(/\s*-?\s*\d{6}\s*$/, '')                                     // trailing pincode
            .split(',').map(s => s.trim()).filter(Boolean).join(', ');
    }

	function fullBusinessUnitAddress(name) {
	    if (!name) return '';
	    return String(name)
	        .replace(/^JBU-\d+\s*/i, '')
	        .split(',').map(s => s.trim()).filter(Boolean).join(', ');
	}
	
	// ─── HELPER: Weight with exactly 3 decimals (Indian comma style) ───────────
	function formatWeight(value) {
	    if (!value && value !== 0) return '';
	    const num = parseFloat(String(value).replace(/,/g, ''));
	    if (isNaN(num)) return value;
	    return num.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
	}
	
    try {
        const endpoint =
            status === "CANCELLED"
                ? `/jssl/invoice/searchidcancel?id=${id}`
                : `/jssl/invoice/searchidnew?id=${id}`;

        const url = new URL(endpoint, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch data");

        const json = await response.json();
        const Invoice_Data      = json.Invoice_Data;
        const Contractor_Data   = json.Contractor_Data;
        const QsPacking_Data    = json.QsPacking_Data;
        const tax               = json.tax;
        const Grand_Total_value = json.Grand_Total_value;

        // ---- Resolve Invoice To / Consignee / Work Order from InvoiceContractMaster, fallback to Contractor_Data ----
        const ContractMasterData = json.InvoiceContractMaster || {};

        const matchedInvoiceTo = invoiceAddressList.find(a => String(a.id) === String(ContractMasterData.invoice_to_id));
        const resolvedInvoiceTo = matchedInvoiceTo
            ? matchedInvoiceTo.address
            : Contractor_Data[0].invoice_to_id_value;

        // Invoice To — district / pincode / state name / state code / GSTIN / PAN
        // Prefer the matched master record; fall back to Contractor_Data only if no match.
        const resolvedInvoiceDistrict  = matchedInvoiceTo ? matchedInvoiceTo.district   : Contractor_Data[0].invoiceDistrict;
        const resolvedInvoicePinNo     = matchedInvoiceTo ? matchedInvoiceTo.pin_no     : Contractor_Data[0].invoicePinNo;
        const resolvedInvoiceStateName = matchedInvoiceTo ? matchedInvoiceTo.state_name : Contractor_Data[0].invoiceStateName;
        const resolvedInvoiceStateCode = matchedInvoiceTo ? matchedInvoiceTo.state_id   : Contractor_Data[0].invoiceStateCode;
        const resolvedInvoiceGstNo     = matchedInvoiceTo ? matchedInvoiceTo.gst_no     : Contractor_Data[0].invoiceGstNo;
        const resolvedInvoicePanNo     = matchedInvoiceTo ? matchedInvoiceTo.pan_no     : Contractor_Data[0].invoicePanNo;

        const matchedConsignee = consigneeAddressList.find(c => String(c.id) === String(ContractMasterData.consignee_id));
        const resolvedConsignee = matchedConsignee
            ? matchedConsignee.address
            : Contractor_Data[0].consignee_id_value;

        // Consignee — district / pincode / state name / state code / GSTIN / PAN
        const resolvedConsigneeDistrict  = matchedConsignee ? matchedConsignee.district   : Contractor_Data[0].consigneeDistrict;
        const resolvedConsigneePinNo     = matchedConsignee ? matchedConsignee.pin_no     : Contractor_Data[0].consigneePinNo;
        const resolvedConsigneeStateName = matchedConsignee ? matchedConsignee.state_name : Contractor_Data[0].consigneeStateName;
        const resolvedConsigneeStateCode = matchedConsignee ? matchedConsignee.state_id   : Contractor_Data[0].consigneeStateCode;
        const resolvedConsigneeGstNo     = matchedConsignee ? matchedConsignee.gst_no     : Contractor_Data[0].consigneeGstNo;
        const resolvedConsigneePanNo     = matchedConsignee ? matchedConsignee.pan_no     : Contractor_Data[0].consigneePanNo;

        const matchedWork = workOrderList.find(w => String(w.work_id) === String(ContractMasterData.work_id));
        const resolvedWork = matchedWork
            ? matchedWork.workorder_no
            : Contractor_Data[0].work_id_value;

			const matchedBU = businessUnitList.find(b => String(b.business_unit_id) === String(ContractMasterData.bid));

			let resolvedbudisplay = "";
			if (matchedBU) {
			    const buText = fullBusinessUnitAddress(matchedBU.business_unit_name);
			    const pin    = matchedBU.pinNo || '';
			    // add district-pincode only if the name doesn't already contain the pincode
			    const tail   = (pin && !buText.includes(pin)) ? `, ${matchedBU.district || ''}-${pin}` : '';
			    resolvedbudisplay = `${buText}${tail}${matchedBU.location ? '<br>' + matchedBU.location : ''}`;
			} else if (Contractor_Data.length > 0) {
			    resolvedbudisplay = fullBusinessUnitAddress(Contractor_Data[0].business_unit_name);
			}
        // ---- END resolution block ----

        const Grand_Total_tax        = Grand_Total_value[0].Grand_Total_tax;
        const Total_adv_tax_Taxable  = Grand_Total_value[0].Total_adv_tax_Taxable;
        const Tax_Final_total        = Grand_Total_value[0].Tax_Final_total;
        const PBC_Final_total        = Grand_Total_value[0].PBC_Final_total;

        const invoiceno      = Invoice_Data.invoice_no;
        const lr_docketno    = Invoice_Data.lr_docketno;
        const date_val       = Invoice_Data.date_val;
        //const factory_id     = Invoice_Data.factory_id;
        const cancel         = Invoice_Data.cancel;

        const productdesc = Invoice_Data.product_desc;

        // ── Factory Data ──────────────────────────────────────────────────────
        const url_factory = new URL(`/jssl/factory/getAllFactoryListSS`, baseUrl);
        const response_factory = await fetch(url_factory, { method: "GET", credentials: "include" });
        if (!response_factory.ok) throw new Error("Failed to fetch factory data");
        const factory_json = await response_factory.json();

        const factory_data_map       = factory_json.FactoryDetails;
        //const FactoryDataBasedById   = factory_data_map.find(f => f.id === factory_id);
        const MumbaiAddress          = factory_data_map.find(f => f.id === "4");

        const reg_addresss   = MumbaiAddress.address;

        // ── Business Unit Address (cleaned, trimmed, no stray commas) ──────────
        // (kept as-is; made null-safe so it can never throw)
        const address = (Contractor_Data[0].businessUnitName || '')
            .split(',')
            .slice(1)
            .map(x => x.trim())
            .filter(x => x !== "")
            .join(', ');

        //const factory_Address = address;
        // const factory_Address = FactoryDataBasedById.address;
        const bid = resolvedbudisplay;

        // ── Business Unit State Code / GSTIN / PAN (from InvoiceContractMaster, fallback Contractor_Data) ─
        const state_Code = ContractMasterData.state_id   || Contractor_Data[0].invoiceStateCode;
        const Gst_Code   = ContractMasterData.gst_number || Contractor_Data[0].invoiceGstNo;
        const Pan_Code   = ContractMasterData.pan_number || Contractor_Data[0].invoicePanNo;

        // ── Contractor / Invoice Fields ───────────────────────────────────────
        const invoice_to_id_value          = resolvedInvoiceTo;
        const tax_payable                  = Contractor_Data[0].tax_payable == 1 ? "No" : "Yes";
        const area_no                      = Contractor_Data[0].area_no;
        const lot_no                       = Contractor_Data[0].lot_no;
        const containter_no                = Contractor_Data[0].containter_no;
        const epcgno                       = Contractor_Data[0].epcgno;
        const shipment_mode_id_value       = Contractor_Data[0].shipment_mode_id_value;
        const delivery_condition_id_value  = Contractor_Data[0].delivery_condition_id_value;
        const consignee_id_value           = resolvedConsignee;
        const work_id_value                = resolvedWork;

        // Invoice To / Consignee state / GST / PAN — now resolved from master, with Contractor_Data fallback
        const invoiceStateName             = resolvedInvoiceStateName;
        const consigneeStateName           = resolvedConsigneeStateName;
        const invoiceStateCode             = resolvedInvoiceStateCode;
        const consigneeStateCode           = resolvedConsigneeStateCode;
        const invoiceGstNo                 = resolvedInvoiceGstNo;
        const consigneeGstNo               = resolvedConsigneeGstNo;
        const invoicePanNo                 = resolvedInvoicePanNo;
        const consigneePanNo               = resolvedConsigneePanNo;

        const bankName                     = Contractor_Data[0].bankName;
        const account_number               = Contractor_Data[0].account_number;
        const branch_address               = Contractor_Data[0].branch_address;
        const branch_code                  = Contractor_Data[0].branch_code;
        const swift_code                   = Contractor_Data[0].swift_code;
        const ifsc_code                    = Contractor_Data[0].ifsc_code;
        const work_date                    = Contractor_Data[0].work_date;

        const transport_name       = QsPacking_Data[0].transport_name;
        const vechile_no           = QsPacking_Data[0].vechile_no;
        const con_code_with_lot_no = QsPacking_Data[0].con_code_with_lot_no;

        const freight     = tax[0].freight;
        const total_pices = tax[0].total_pices;
        const total_kgs   = tax[0].total_kgs;
        const total_qty   = tax[0].total_qty;
        const basic_value = tax[0].basic_value;

        const items          = json.QsPacking_Data || [];
        const taxData        = json.tax || [];
        const InvoiceData    = json.Invoice_Data || [];
        const grandTotalData = json.Grand_Total_value?.[0] || {};

        const grandTotalInWords = grandTotalData.GrandTotalInWords || '';
        const grandTotalTax     = grandTotalData.Grand_Total_tax || '';
        // gst_remarks sometimes carries the business unit name/GSTIN/PAN — clean it
        //const gstremarks        = cleanBusinessUnitAddress(InvoiceData.gst_remarks || '');
		const gstremarks = (InvoiceData.gst_remarks || '').replace(/,\s*/g, ', ');
        const advremarks        = taxData[0].taxable || '';
        const advremarksnon     = taxData[0].non_taxable || '';
        const basicValue        = taxData[0].basic_value || '';
        const basicValuecos     = taxData[0].optc || '';

		
        // ── Product Table Rows ────────────────────────────────────────────────
        const maxRows = 6;   // total body rows (items + spacer + description + blanks)
        let tableRows = "";

        function emptyRowHtml(descText) {
            return `
                <tr class="empty-row">
                    <td colspan="1">&nbsp;</td>
                    <td colspan="4" ${descText ? 'style="font-weight:550;"' : ''}>${descText || ''}</td>
                    <td colspan="1"></td>
                    <td colspan="1"></td>
                    <td colspan="1"></td>
                    <td colspan="2"></td>
                    <td colspan="1"></td>
                    <td colspan="2"></td>
                </tr>`;
        }

        items.forEach((item, index) => {
            tableRows += `
                <tr class="product-row">
                    <td colspan="1" style="text-align: right;">${index + 1}</td>
                    <td colspan="4" class="desc-col descri">
                        ${item.scrap_name_type_id || ''}
                    </td>
                    <td colspan="1" style="text-align:right !important; white-space: nowrap; font-size: 9px;">${[item.scode, item.hsncode].filter(Boolean).join('/')}</td>
                    <td colspan="1" style="text-align:left !important;">${item.uom_name || ''}</td>
                    <td colspan="1" class="qtys">${item.qty || ''}</td>
                    <td colspan="2" class="weits">${formatWeight(item.per_kgs)}</td>
                    <td colspan="1" class="prs">${formatAmount(item.unit_price) || ''}</td>
                    <td colspan="2" class="tols">${formatAmount(item.total) || ''}</td>
                </tr>`;
        });

        // One spacer row, then the product description row (ALWAYS printed,
        // even when there are many items), then blank filler rows.
        tableRows += emptyRowHtml('');
        tableRows += emptyRowHtml(productdesc || '');

        const emptyCount = Math.max(0, maxRows - items.length - 2);
        for (let i = 0; i < emptyCount; i++) {
            tableRows += emptyRowHtml('');
        }

        // ── Tax Rows ──────────────────────────────────────────────────────────
        let taxRows = taxData.map((tax, i, arr) => {
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
                        ${formatAmount(tax.tax_value)}
                    </td>
                </tr>`;
        }).join('');

        // ── Tax Description Blocks ────────────────────────────────────────────
        let taxDetails     = taxData.map(tax => `<b>${tax.tax_name}:</b> ${tax.tax_value_in_words}<br>`).join('');
        let taxDetailsNew  = taxData.map(tax => `<b>${tax.tax_name}</b><br>`).join('');
        let taxPerValue    = taxData.map(tax => `<b>${tax.tax_per}</b><br>`).join('');
        let taxValue       = taxData.map(tax => `<b>${formatAmount(tax.tax_value)}</b><br>`).join('');
        let taxValuedept   = taxData.map(tax => `<b>${formatAmount(tax.ptc)}</b><br>`).join('');
        let taxValuecos    = taxData.map(tax => `<b>${formatAmount(tax.ptc)}</b><br>`).join('');
        let taxadvanceValue = taxData.map(tax => `<b>${formatAmount(tax.adv_tax)}</b><br>`).join('');

        // ── Date Formatting ───────────────────────────────────────────────────
		const createdRaw = ContractMasterData.invoice_created_date || '';

		const currentDate       = formatDMY(createdRaw);
		const formattedDateTime = formatDMYHMS(createdRaw);
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
                .watermark.verified  { color: #4CAF50; }

                html, body {
                    margin: 0;
                    padding: 0;
                    font-family: "Times New Roman", Times, serif;
                    background-color: #fff !important;
                    font-size: 10px;
                    line-height: 2;
                }

                /* One invoice copy = one sheet. No fixed 297mm height, no fixed width. */
                .page {
                    position: relative;
                    width: 100%;
                    height: auto;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                    page-break-after: always;
                }
                .page:last-child { page-break-after: avoid; }
				
				.bid { display: block; font-size: 9px; line-height: 1.3; word-break: break-word; }

                .invoice-container {
                    width: 100%;
                    height: auto;
                    padding: 1mm;
                    -webkit-font-smoothing: antialiased;
                    text-rendering: geometricPrecision;
                }

                table {
                    border-collapse: collapse !important;
                    table-layout: fixed;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                }

                /* Do not repeat the product table header on a new printed page */
                .product-table thead { display: table-row-group; }

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

                .product-row td:nth-child(n+4) { text-align: right !important; }

                .product-row td,
                .empty-row td { height: 16px; }

                .empty-row td { border-top: none !important; border-bottom: none !important; }

                .last-product td { border-bottom: none !important; }

                .product-table .desc-col {
                    line-height: 1.5 !important;
                    white-space: normal;
                    word-break: break-word;
                }

                .product-table .fright-row .fright-data { line-height: 1.6 !important; padding: 5px !important; }

                .total-body{
                    border-top:1px solid #000;
                }
                .total-body .total-datatd  { line-height: 1.6 !important; padding: 5px !important; }
                .total-body .total-datatds { line-height: 2.3 !important; text-align: right !important; }

                .desc-col.descri { font-size: 7px !important; padding: 1px !important; }
                .desc-col.tols   { text-align: right !important; }
                .desc-col.prs    { text-align: right !important; }
                .desc-col.weits  { text-align: right !important; }
                .desc-col.qtys   { text-align: right !important; }

                .product-table th,
                .product-table td { padding: 3px 5px; line-height: 1.2; }

                .product-row td  { border-bottom: none; }

                .freight-vlaue { text-align: right !important; }
                .fright-row    { border: 0.5px solid #000 !important; }

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

                .terms { margin-top: 2mm; }

                /* ── Address neat line-by-line display ── */
                .fulladdress,
                .conaddress,
                .facotry_address {
                    white-space: pre-line;
                    display: inline-block;
                    line-height: 1.5;
                }

                .header, .footer, .gst-text, .copy-label { text-align: center; }
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
                            <strong>JSW Severfield Structures Limited</strong><br>
                            <span class="bid"></span>
                            <p style="margin:0;">
                            <b>State Code:</b> <span class="state_code"></span><br>
                            <b>GSTIN:</b> <span class="gst_code"></span> &nbsp;
                            <b>PAN:</b> <span class="pan_code"></span><br>
                            <b>ICE No:</b> 0309033152 &nbsp; <b>CIN No:</b> U28112MH2009PLC191045<br>
                            <b>Email:</b> invoice@jssl.in &nbsp; <b>Website:</b> www.jssl.in<br>
                            </p>
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

                            <b>
                                Invoice To :<br> </b>

                            <b><span class="shipto11"></span></b><br>
                            <span class="shipto11add2" ></span><br>
                            <span class="shipto11add3" ></span>

                            <span class="projectname"></span><br>

                            <!-- Address (NOT bold) -->
                            <span class="fulladdress" style="white-space: pre-line;"></span><br><br>

                            <b>Place of Supply : <span class="placeofsupply"></span></b><br><br>

                            <b>
                                Name of the State : <span class="statename"></span><br>
                                State Code : <span class="stcode11"></span><br>
                                GSTIN : <span class="ingst"></span><br>
                                PAN : <span class="panin"></span><br>
                            </b>

                        </td>
                        <td colspan="6" style="font-size:10px; line-height:1.3;">

                            <b>Name &amp; Address of consignee:<br></b>

                            <b><span class="conname"></span></b><br>
                            <span class="conname1" ></span><br>
                            <span class="conname2" ></span><br>

                            <!-- Address -->
                            <span class="conaddress" style="white-space: pre-line;"></span><br>
                            <br>

                            <b>
                                Name of the State: <span class="state"></span><br>
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
                            <strong>Tax is Payable on reverse charge (Yes/No):</strong> <span class="taxpayre"></span><br>
                        </td>
                        <td colspan="3" style="font-size:7px;">
                            <strong>Export Details:</strong><br>
                            <strong>ARE No:</strong> <span class="areano"></span><br>
                            <strong>LUT No:</strong> <span class="lutno"></span><br>
                            <strong>Container No:</strong> <span class="contlo"></span><br>
                            <strong>EPCG License No:</strong> <span class="epoglo"></span><br>
                        </td>
                        <td colspan="3" style="font-size:7px;">
                            <b>Transporter:</b> <span class="trans"></span><br>
                            <b>Vehicle No:</b> <span class="vehino"></span><br>
                            <b>LR/DOCKET No:</b> <span class="lrdoc"></span><br>
                            <b>Date:</b> <span class="lrdate"></span><br>
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
                    <tbody id="product_table_data">
                        ${tableRows}
                    </tbody>

                    <tbody class="total-body" >
                        <tr>
                            <td colspan="7" class="total-datatd"><span>TOTAL</span><br></td>
                            <td class="total-datatds"><span class="qtytotal"></span><br></td>
                            <td colspan="2" class="total-datatds"><span class="wiegtotal"></span><br></td>
                            <td></td>
                            <td colspan="2" class="total-datatds"><span class="val11"></span><br></td>
                        </tr>
                    </tbody>
                    <tbody class="tax-row">
                        ${taxRows}
                    </tbody>
                    <tbody class="total-word">
                        <tr>
                            <td colspan="9" class="total-words-des">
                                <b>Note:</b> <span>Identification Marks &amp; Serial No. of Goods: As per packing list attached</span><br>
                                ${taxDetails}
                                <br>
                                <b>Gross total in words:</b> ${grandTotalInWords}<br>
                            </td>
                            <td colspan="2" class="total-words-des ss"><b>Total Invoice Value:</b><br></td>
                            <td colspan="2" class="total-words-val"><span>${formatAmount(grandTotalTax)}</span><br></td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr class="particulars-row">
                            <td colspan="3" class="particulars-row-prtd"><span>Particulars</span><br></td>
                            <td colspan="1" class="particulars-row-prtd"><span>Tax Application</span><br></td>
                            <td colspan="1" class="particulars-row-prtd"><span>Tax %</span><br></td>
                            <td colspan="1" class="particulars-row-prtd"><span>Adv Recovery (Taxable)</span><br></td>
                            <td colspan="1" class="particulars-row-prtd"><span>Adv Recovery (NonTax)</span><br></td>
                            <td colspan="2" class="particulars-row-prtd"><span>Invoice Value</span><br></td>
                            <td colspan="2" class="particulars-row-prtd"><span>Payable to dept</span><br></td>
                            <td colspan="2" class="particulars-row-prtd"><span>Payable by Customer</span><br></td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr class="particulars-row-body">
                            <td colspan="3"><span>${gstremarks}</span><br></td>
                            <td colspan="1">
                                <span>Basic</span><br>
                                ${taxDetailsNew}
                            </td>
                            <td colspan="1" class="particulars-row-body-td"><br>${taxPerValue}</td>
                            <td colspan="1" class="particulars-row-body-td">
                                <span>${formatAmount(advremarks)}</span><br>
                                ${taxadvanceValue}
                            </td>
                            <td colspan="1" class="particulars-row-body-td">
                                <span>${formatAmount(advremarksnon)}</span><br>
                            </td>
                            <td colspan="2" class="particulars-row-body-td">
                                <span>${formatAmount(basicValue)}</span><br>
                                ${taxValue}
                            </td>
                            <td colspan="2" class="particulars-row-body-td"><br>${taxValuedept}</td>
                            <td colspan="2" class="particulars-row-body-td">
                                <span>${formatAmount(basicValuecos)}</span><br>
                                ${taxValuecos}
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td colspan="3"><span>Total</span><br></td>
                            <td colspan="1"></td>
                            <td colspan="1"></td>
                            <td colspan="1" class="td-body-tax"><span class="taxbasic"></span><br></td>
                            <td colspan="1"></td>
                            <td colspan="2" class="td-body-tax"><span class="grandlast"></span><br></td>
                            <td colspan="2" class="td-body-tax"><span class="taxtotal"></span><br></td>
                            <td colspan="2" class="td-body-tax"><span class="grandlast12new"></span><br></td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td colspan="13" class="Bank_details">
                                <span>BANK ACCOUNT DETAILS: &nbsp; BANK ACCOUNT NAME: </span><b class="bankname"></b><br>
                                <span>ACCOUNT NUMBER: </span><b class="acc"></b>
                                <span> &nbsp; BANK NAME &amp; ADDRESS: </span><b class="bname"></b><b class="add"></b>
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
                                <span>For JSW SEVERFIELD STRUCTURES LTD.</span><br>
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

            // FACTORY DETAILS
            container.querySelector(".reg_add").textContent    = reg_addresss;
            container.querySelector(".gst_code").textContent   = Gst_Code;
            container.querySelector(".state_code").textContent = state_Code;
            container.querySelector(".pan_code").textContent   = Pan_Code;
            container.querySelector('.bid').innerHTML = bid;

            // INVOICE HEADER
            container.querySelector('.datetime').textContent     = formattedDateTime;
            container.querySelector('.dateor').textContent       = formatDMY(work_date);
            container.querySelector('.date').textContent         = currentDate;
            container.querySelector('.invoiceNumber').textContent = invoiceno;

            // INVOICE TO DETAILS
            const invoiceToValue = invoice_to_id_value || '';

            // Split using \r\n
            const invoiceLines = invoiceToValue.split(/\r?\n/);

            // First line
            const line1 = invoiceLines[0] || '';

            // Second line
            const line2 = invoiceLines[1] || '';

            // Third line
            const line3 = (invoiceLines[2] || '');

            // Set values
            container.querySelector('.shipto11').textContent = line1;
            container.querySelector('.shipto11add2').textContent = line2;
            container.querySelector('.shipto11add3').textContent = line3;

            // District + Pincode — resolved (master first, Contractor_Data fallback)
            const districtAndPin = [
                resolvedInvoiceDistrict,
                resolvedInvoicePinNo
            ]
            .filter(x => x && x.toString().trim() !== "")
            .join("-");

            const invoiceAddress = [
                Invoice_Data.addressLine1up,
                Invoice_Data.addressLine2up,
                Invoice_Data.addressLine3up,
                districtAndPin
            ]
            .filter(x => x && x.toString().trim() !== "")
            .join("\n");

            container.querySelector('.fulladdress').textContent = invoiceAddress;

            container.querySelector('.statename').textContent =
                invoiceStateName || '';

            container.querySelector('.stcode11').textContent =
                invoiceStateCode || '';

            container.querySelector('.placeofsupply').textContent =
                Invoice_Data.supply_place || '';

            container.querySelector('.ingst').textContent =
                invoiceGstNo || '';

            container.querySelector('.panin').textContent =
                invoicePanNo || '';

            // =========================
            // CONSIGNEE DETAILS
            // =========================

            const consigneeValue = consignee_id_value || '';

            // Split using \r\n
            const consigneeLines = consigneeValue.split(/\r?\n/);

            // First line
            const conLine1 = consigneeLines[0] || '';

            // Second line
            const conLine2 = consigneeLines[1] || '';

            // Third line
            const conLine3 = consigneeLines[2] || '';

            // Set values
            container.querySelector('.conname').textContent = conLine1;
            container.querySelector('.conname1').textContent = conLine2;
            container.querySelector('.conname2').textContent = conLine3;

            // District + Pincode — resolved (master first, Contractor_Data fallback)
            const consigneeDistrictAndPin = [
                resolvedConsigneeDistrict,
                resolvedConsigneePinNo
            ]
            .filter(x => x && x.toString().trim() !== "")
            .join("-");

            const consigneeAddress = [
                Invoice_Data.conaddressLine1,
                Invoice_Data.conaddressLine2,
                Invoice_Data.conaddressLine3,
                consigneeDistrictAndPin
            ]
            .filter(x => x && x.toString().trim() !== "")
            .join("\n");

            container.querySelector('.conaddress').textContent =
                consigneeAddress;

            container.querySelector('.state').textContent          = consigneeStateName || '';
            container.querySelector('.stateco').textContent        = consigneeStateCode || '';
            //container.querySelector('.conplaceofsupply').textContent = Contractor_Data[0].supply_place || '';
            container.querySelector('.congst').textContent         = consigneeGstNo || '';
            container.querySelector('.pancon').textContent         = consigneePanNo || '';

            // TRANSPORT DETAILS
            container.querySelector('.taxpayre').textContent  = tax_payable;
            container.querySelector('.areano').textContent    = area_no || '';
            container.querySelector('.contlo').textContent    = containter_no || '';
            container.querySelector('.lutno').textContent     = lot_no || '';
            container.querySelector('.epoglo').textContent    = epcgno || '';
            container.querySelector('.trans').textContent     = transport_name || '';
            container.querySelector('.lrdoc').textContent     = lr_docketno || '';
            container.querySelector('.lrdate').textContent    = date_val || '';
            container.querySelector('.shipmo').textContent    = shipment_mode_id_value || '';
            container.querySelector('.delcon').textContent    = delivery_condition_id_value || '';
            container.querySelector('.workor').textContent    = work_id_value || '';
            container.querySelector('.vehino').textContent    = vechile_no || '';
            container.querySelector('.contrefno').textContent = con_code_with_lot_no || '';

            // TOTALS  ← all formatted with commas
            //container.querySelector('.freight').textContent       = formatAmount(freight);
            container.querySelector('.qtytotal').textContent      = total_qty || '';
           container.querySelector('.wiegtotal').textContent     = formatWeight(total_kgs);
            container.querySelector('.val11').textContent         = formatAmount(basic_value);
            container.querySelector('.grandlast').textContent     = formatAmount(Grand_Total_tax);
            container.querySelector('.grandlast12new').textContent = formatAmount(PBC_Final_total);
            container.querySelector('.taxbasic').textContent      = formatAmount(Total_adv_tax_Taxable);
            container.querySelector('.taxtotal').textContent      = formatAmount(Tax_Final_total);

            // BANK DETAILS
            container.querySelector('.bankname').textContent = bankName || '';
            container.querySelector('.acc').textContent      = account_number || '';
            container.querySelector('.bname').textContent    = branch_address || '';
            container.querySelector('.code').textContent     = branch_code || '';
            container.querySelector('.scode').textContent    = swift_code || '';
            container.querySelector('.ifsc').textContent     = ifsc_code || '';
        }

        // ── Auto-fit font size (kept; not used by the print flow, which uses zoom-to-fit below) ──
        function autoFitInvoice(container) {
            const invoice = container.querySelector(".invoice-container");
            const maxHeight = 1000;
            let fontSize = 9;

            function applySize(size) {
                invoice.style.fontSize = size + "px";
                invoice.querySelectorAll("td, th").forEach(el => {
                    el.style.fontSize  = size + "px";
                    el.style.padding   = "1px 2px";
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

        // ── Shrink long descriptions ──────────────────────────────────────────
        function shrinkLongDescriptions(container) {
            container.querySelectorAll(".desc-col").forEach(td => {
                if (td.textContent.length > 200) {
                    td.classList.add("desc-small", "desc-xsmall");
                }
            });
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

            // A4 = 210 x 297mm. With 8mm margins the printable area is 194 x 281mm.
            let fullHTML = `
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Invoice PDF</title>
                    <style>
                        @page { size: A4; margin: 8mm; }
                        html, body { margin: 0; padding: 0; }
                        body {
                            width: 194mm;
                            margin: 0 auto;
                            font-family: "Times New Roman", Times, serif;
                        }
                        .page {
                            width: 100%;
                            height: auto;
                            margin: 0;
                            padding: 0;
                            overflow: hidden;
                        }
                        .page:not(:last-child) { page-break-after: always; }
                        .page:last-child { page-break-after: avoid; }
                        .product-table thead { display: table-row-group; }
                        @media print {
                            body { margin: 0 auto; }
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
                    // Fit each copy on exactly one sheet:
                    // printable height = 281mm (297mm - 2 x 8mm), converted to px at 96dpi
                    const maxH = (281 * 96 / 25.4) - 8;

                    printWindow.document.querySelectorAll('.page').forEach(page => {
                        const inv = page.querySelector('.invoice-container');
                        if (!inv) return;
                        const h = inv.getBoundingClientRect().height;
                        if (h > maxH) {
                            inv.style.zoom = (maxH / h).toFixed(3);   // shrink to one page
                        }
                    });

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
        console.error('Error generating PDF:', error);
    }
}

function openModalcancel(id,pn_id) {
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
	$('#exampleModalCenter16').attr('data-pn-id', pn_id);
}

function cancelRecord(id) {

	$('#exampleModalCenter16').modal('hide');

	// Store the id and pn_id in the modal's data attributes
	var id =$('#exampleModalCenter16').attr('data-id');
	var pn_id = $('#exampleModalCenter16').attr('data-pn-id');
	
	$.ajax({
	    url: new URL('/jssl/invoice/cancelbyidnew', baseUrl),   // cancel endpoint
	    type: 'POST',
	    dataType: 'json',
	    xhrFields: {
	        withCredentials: true
	    },
	    data: jQuery.param({
	        id: id,    
	        cancelled_by: createdById,
			factory_id:selectedFactoryId,
			pn_id:pn_id
	    }),
	    success: function (data) {

	        var result = data.message;

	        if (result === "Success") {

	            const popup = $('<div class="popup"> Invoice Cancelled Successfully!</div>')
	                .appendTo('body')
	                .hide()
	                .fadeIn(400);

	            setTimeout(function () {
	                popup.fadeOut(400, function () {
	                    $(this).remove();
	                    window.location = 'invoicesidemenu.jsp';
	                });
	            }, 800);

	        } else {
	            alert(data.message || "Cancel failed");
	        }
	    },
	    error: function () {
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
	

	/*function toTitleCase(str) {
	    return str
	        .toLowerCase()
	        .replace(/\b\w/g, function(char) {
	            return char.toUpperCase();
	        });
	}*/
	
	async function saveServiceHsnSelections() {

	    const slnoList = [];
	    const serviceCodeList = [];
	    const hsnCodeList = [];

	    const serviceSelects = document.querySelectorAll(".dynamic-row .service-code-select");

	    console.log("Found Service Code dropdowns:", serviceSelects.length);

	    serviceSelects.forEach(serviceSelect => {

	        const slno = serviceSelect.getAttribute("data-slno");

	        const row = serviceSelect.closest(".form-row");
	        const hsnSelect = row ? row.querySelector(".hsn-code-select") : null;

	        // Selected values
	        const serviceCode = serviceSelect.value ? serviceSelect.value.trim() : "";
	        const hsnCode = hsnSelect ? (hsnSelect.value || "").trim() : "";

	        console.log(
	            "Row ->",
	            "SlNo:", slno,
	            "| Service Code:", serviceCode,
	            "| HSN Code:", hsnCode
	        );

	        // Save only rows having SlNo
	        if (slno) {
	            slnoList.push(slno);
	            serviceCodeList.push(serviceCode);
	            hsnCodeList.push(hsnCode);
	        }

	    });

	    console.log("SlNo List:", slnoList);
	    console.log("Service Code List:", serviceCodeList);
	    console.log("HSN Code List:", hsnCodeList);

	    if (slnoList.length === 0) {
	        console.warn("No rows found to update.");
	        return;
	    }

	    try {

	        const url = new URL("/jssl/invoicemaster/updateServiceHsnForItems", baseUrl);

	        const params = new URLSearchParams();

	        // Spring Boot expects repeated parameters
	        slnoList.forEach(value => params.append("slno", value));
	        serviceCodeList.forEach(value => params.append("service_code_id", value));
	        hsnCodeList.forEach(value => params.append("hsn_code_id", value));

	        params.append("modified_by", createdById);

	        console.log("Request Payload:");
	        console.log(params.toString());

	        const response = await fetch(url, {
	            method: "POST",
	            credentials: "include",
	            headers: {
	                "Content-Type": "application/x-www-form-urlencoded"
	            },
	            body: params.toString()
	        });

	        const result = await response.json();

	        console.log("Response:", result);

	        if (result.status === "yes") {

	            console.log("Successfully updated " + result.updatedCount + " rows.");

	        } else {

	            console.error("Update failed:", result.message);

	        }

	    } catch (err) {

	        console.error("Error while saving Service/HSN Codes:", err);

	    }
	}