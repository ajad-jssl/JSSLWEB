
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




function initSelect2(target, placeholder) {
    const $el = (typeof target === 'string') ? $('#' + target) : $(target);
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

// Service/HSN selects inside a row container (they use classes, not ids)
function initRowCodeSelect2(scopeSelector) {
    $(scopeSelector).find('.service-code-select').each(function () { initSelect2(this, 'Select Service Code'); });
    $(scopeSelector).find('.hsn-code-select').each(function () { initSelect2(this, 'Select HSN Code'); });
}

function setFieldError(errId, message) {
    const el = document.getElementById(errId);
    if (!el) return;
    el.innerText = message || "";
    el.style.display = message ? "inline-block" : "none";
}

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
	
	initSelect2(selectElement.id, placeholder);
}

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

/*document.addEventListener("DOMContentLoaded", function() {
	loadAllowedActions();
	fetchHsnMasterList();      
	fetchServiceMasterList();  
	fetchBusinessUnitList();       
	fetchInvoiceAddressList();     
    fetchWorkOrderList();          
	fetchConsigneeAddressList(); 
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
       // fetchCont(selectedFactoryId); // Fetch contractor list on page loadTax Percentage
        fetchinvoicetype();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }

    // Add event listener for contractor dropdown change
    document.getElementById("cont").addEventListener("change", function() {
        const selectedContractorId = this.value; // Get selected contractor ID
        const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory ID again

        if (selectedContractorId) {
            fetchLoad(selectedFactoryId, selectedContractorId); // Fetch load dropdown
			fetchLotnumber(selectedFactoryId,selectedContractorId);
        } else {
            console.warn("No contractor selected.");
            document.getElementById("load").innerHTML = `<option value="">Select load</option>`; // Clear load dropdown
            document.getElementById("inputFieldsContainer").style.display = "none"; // Hide the input fields container
        }
    });

    // Add event listener for load dropdown change
	document.getElementById("load").addEventListener("change", function () {
	    const selectedContractorId = document.getElementById("cont").value;
	    const selectedLoadId = this.value;
	    const invoiceType = $("#invoice option:selected").text().trim().toUpperCase();

	    if (selectedLoadId) {

	        if (invoiceType === "GP") {
	            document.getElementById("inputFieldsContainergp").style.display = "block";
	            document.getElementById("inputFieldsContainer").style.display = "none";

	            // GP method
	            fetchQsPackingDatagp(selectedLoadId);
				fetchtaxadd1();
				 fetchtaxadd2();
				 fetchtaxadd3();
				 fetchinvoice();
				 fetchSalebusunit("inbusunitgp");
				  fetchinvoiceto("inintogp");
				  fetchconname("billinggp");
				  fetchShipping();
				  fetchdelivery();
				  fetchSalebank();
				  fetchSalework("workgp");
				  fetchorg1();
				  fetchservice();
				  fetchhsn();
				  fetchexptitle();
				  fetchBgType();
				  fetchBgType1();

	        } else {
	            document.getElementById("inputFieldsContainer").style.display = "block";
	            document.getElementById("inputFieldsContainergp").style.display = "none";

	            // Normal method
	            fetchQsPackingData(selectedContractorId, selectedLoadId);
	        }

	    } else {
	        document.getElementById("inputFieldsContainer").style.display = "none";
	        document.getElementById("inputFieldsContainergp").style.display = "none";
	    }
	});
});*/


document.addEventListener("DOMContentLoaded", function() {
    loadAllowedActions();
    fetchHsnMasterList();
    fetchServiceMasterList();
    fetchBusinessUnitList();
    fetchInvoiceAddressList();
    fetchWorkOrderList();
    fetchConsigneeAddressList();

    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId");
    if (selectedFactoryId) {
        fetchinvoicetype();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }

    initSelect2('cont', 'Select contractor');
    initSelect2('load', 'Select load');
    initSelect2('lotnum', 'Select lot');

    $('#cont').on('change', function () {
        const selectedContractorId = this.value;
        const factoryId = sessionStorage.getItem("selectedFactoryId");
        if (selectedContractorId) {
            fetchLoad(factoryId, selectedContractorId);
            fetchLotnumber(factoryId, selectedContractorId);
        } else {
            $('#load').html(`<option value="">Select load</option>`);
            initSelect2('load', 'Select load');
            $('#inputFieldsContainer').hide();
        }
    });

    $('#load').on('change', function () {
        const selectedContractorId = document.getElementById("cont").value;
        const selectedLoadId = this.value;
        const invoiceType = $("#invoice option:selected").text().trim().toUpperCase();

        if (selectedLoadId) {
            if (invoiceType === "GP") {
                $('#inputFieldsContainergp').show();
                $('#inputFieldsContainer').hide();
                // GP fetch calls are commented out in your file; leave as is
				
				/*        fetchQsPackingDatagp(selectedLoadId);
							fetchtaxadd1();
							 fetchtaxadd2();
							 fetchtaxadd3();
							 fetchinvoice();
							 fetchSalebusunit("inbusunitgp");
							  fetchinvoiceto("inintogp");
							  fetchconname("billinggp");
							  fetchShipping();
							  fetchdelivery();
							  fetchSalebank();
							  fetchSalework("workgp");
							  fetchorg1();
							  fetchservice();
							  fetchhsn();
							  fetchexptitle();
							  fetchBgType();
							  fetchBgType1();*/
            } else {
                $('#inputFieldsContainer').show();
                $('#inputFieldsContainergp').hide();
                fetchQsPackingData(selectedContractorId, selectedLoadId);
            }
        } else {
            $('#inputFieldsContainer').hide();
            $('#inputFieldsContainergp').hide();
        }
    });
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

        // onchange (not addEventListener) so the handler is never stacked
		selectElement.onchange = function () {
		    const selectedOption = selectElement.options[selectElement.selectedIndex];
		    const selectedText = selectedOption ? selectedOption.text.trim().toUpperCase() : "";
		    const invoiceTypeId = selectElement.value;

		    // Reset dependent dropdowns every time the type changes
		    document.getElementById("cont").innerHTML = '<option value="">Select Contract</option>';
		    document.getElementById("load").innerHTML = '<option value="">Select load</option>';
		    document.getElementById("lotnum").innerHTML = '<option value="0">Select lot</option>';
		    document.getElementById("inputFieldsContainer").style.display = "none";

		    const loadsContracts = ["STEEL", "JOBWORK", "JOB WORK"];
		    if (loadsContracts.includes(selectedText)) {
		        fetchCont(selectedFactoryId, invoiceTypeId);
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
            const selectedText = ($('#invoice option:selected').text() || '').trim().toUpperCase();
            const invoiceTypeId = this.value;

            $('#cont').html('<option value="">Select Contract</option>');
            $('#load').html('<option value="">Select load</option>');
            $('#lotnum').html('<option value="0">Select lot</option>');
            initSelect2('cont', 'Select contractor');
            initSelect2('load', 'Select load');
            initSelect2('lotnum', 'Select lot');
            $('#inputFieldsContainer').hide();

            if (["STEEL", "JOBWORK", "JOB WORK"].includes(selectedText)) {
                fetchCont(selectedFactoryId, invoiceTypeId);
            }
        });
    } catch (error) {
        console.error("Error fetching invoice types:", error);
    }
}

// Fetch the contractor list
/*async function fetchCont(factoryId, invoiceTypeId) {
    try {
        const selectElement = document.getElementById("cont");
        selectElement.innerHTML = `<option value="">Select contractor</option>`;

        const url = new URL(`/jssl/getlistcontractorsfromqschallanpackingnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);
        if (invoiceTypeId) url.searchParams.append("invoice_type_id", invoiceTypeId);

        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch contractors");

        const json = await response.json();
        if (json.status !== "yes" || !json.DATA.length) {
            console.warn("No contractors found.");
            return;
        }

        json.DATA.forEach((type) => {
            if (type.contract_id && type.contract_name) {
                const option = document.createElement("option");
                option.value = type.contract_id;
                option.textContent = type.contract_name;
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

// Fetch the load list based on factoryId and selected contractorId (con_id)
async function fetchLoad(factoryId, contractId) {
    try {
        const invoiceType = $("#invoice option:selected").text().trim().toUpperCase();
        const invoiceTypeId = document.getElementById("invoice").value;

        // If invoice type is GP, use another API
        if (invoiceType === "GP") {
            await fetchGpLoad(factoryId);
            return;
        }

        // Clear old loads first so stale options never stay visible
        const selectElement = document.getElementById("load");
        selectElement.innerHTML = `<option value="">Select load</option>`;

        const url = new URL(`/jssl/getlistloadidforthatcontractorsfromqsdeliverypackingnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);
        url.searchParams.append("contract_id", contractId);
        if (invoiceTypeId) {
            url.searchParams.append("invoice_type_id", invoiceTypeId); // filters Steel vs Jobwork
        }

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch loads");

        const json = await response.json();

        if (json.status !== "yes" || !json.DATA.length) {
            console.warn("No loads found.");
            return;
        }

        json.DATA.forEach((type) => {
            if (type.load_id) {
                const option = document.createElement("option");
                option.value = type.load_id;
                option.textContent = type.load_id;
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching loads:", error);
    }
}

async function fetchGpLoad(factoryId) {
    const url = new URL(`/jssl/getlistloadidforthatcontractorsfromqsdeliverypackingnewGP`, baseUrl);
    url.searchParams.append("factory_id", factoryId);
 

    const response = await fetch(url, {
        method: "GET",
        credentials: "include"
    });

    const json = await response.json();

    const selectElement = document.getElementById("load");
    selectElement.innerHTML = `<option value="">Select load</option>`;

    if (json.status === "yes") {
        json.DATA.forEach(item => {
            const option = document.createElement("option");
            option.value = item.load_id;
            option.textContent = item.load_id;
            selectElement.appendChild(option);
        });
    }
}*/


async function fetchCont(factoryId, invoiceTypeId) {
    const selectElement = document.getElementById("cont");
    selectElement.innerHTML = `<option value="">Select contractor</option>`;
    try {
        const url = new URL(`/jssl/getlistcontractorsfromqschallanpackingnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);
        if (invoiceTypeId) url.searchParams.append("invoice_type_id", invoiceTypeId);

        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch contractors");
        const json = await response.json();

        if (json.status === "yes" && json.DATA && json.DATA.length) {
            json.DATA.forEach((type) => {
                if (type.contract_id && type.contract_name) {
                    const option = document.createElement("option");
                    option.value = type.contract_id;
                    option.textContent = type.contract_name;
                    selectElement.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.error("Error fetching contractors:", error);
    } finally {
        initSelect2('cont', 'Select contractor');
    }
}

async function fetchLoad(factoryId, contractId) {
    const invoiceType = $("#invoice option:selected").text().trim().toUpperCase();
    const invoiceTypeId = document.getElementById("invoice").value;

    if (invoiceType === "GP") {
        await fetchGpLoad(factoryId);
        return;
    }

    const selectElement = document.getElementById("load");
    selectElement.innerHTML = `<option value="">Select load</option>`;
    try {
        const url = new URL(`/jssl/getlistloadidforthatcontractorsfromqsdeliverypackingnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);
        url.searchParams.append("contract_id", contractId);
        if (invoiceTypeId) url.searchParams.append("invoice_type_id", invoiceTypeId);

        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch loads");
        const json = await response.json();

        if (json.status === "yes" && json.DATA.length) {
            json.DATA.forEach((type) => {
                if (type.load_id) {
                    const option = document.createElement("option");
                    option.value = type.load_id;
                    option.textContent = type.load_id;
                    selectElement.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.error("Error fetching loads:", error);
    } finally {
        initSelect2('load', 'Select load');
        $('#load').val('').trigger('change');
    }
}

async function fetchGpLoad(factoryId) {
    const selectElement = document.getElementById("load");
    selectElement.innerHTML = `<option value="">Select load</option>`;
    try {
        const url = new URL(`/jssl/getlistloadidforthatcontractorsfromqsdeliverypackingnewGP`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();

        if (json.status === "yes") {
            json.DATA.forEach(item => {
                const option = document.createElement("option");
                option.value = item.load_id;
                option.textContent = item.load_id;
                selectElement.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error fetching GP loads:", error);
    } finally {
        initSelect2('load', 'Select load');
    }
}

async function fetchLotnumber(factoryId, contractId) {
    const selectElement = document.getElementById("lotnum");
    selectElement.innerHTML = `<option value="0">Select lot</option>`;
    try {
        const url = new URL(`/jssl/load/dlyload_id`, baseUrl);
        url.searchParams.append("factory", factoryId);
        url.searchParams.append("contract_id", contractId);

        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch lots");
        const json = await response.json();

        (json.data || []).forEach((type) => {
            if (type.tload_id) {
                const option = document.createElement("option");
                option.value = type.tload_id;
                option.textContent = type.loadno;
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching lots:", error);
    } finally {
        initSelect2('lotnum', 'Select lot');
    }
}

let hsnMasterList = [];
let serviceMasterList = [];

// was: async function fetchhsn() { ... hsnMasterList = json.Data; }
async function fetchHsnMasterList() {
    try {
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch hsn codes");
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) { console.warn("No hsn codes found."); return; }
        hsnMasterList = json.Data;
    } catch (error) {
        console.error("Error fetching hsn codes:", error);
    }
}

// was: async function fetchservice() { ... serviceMasterList = json.Data; }
async function fetchServiceMasterList() {
    try {
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch service codes");
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) { console.warn("No service codes found."); return; }
        serviceMasterList = json.Data;
    } catch (error) {
        console.error("Error fetching service codes:", error);
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
// Fetch the QsPacking data using contractor_id and load_id
async function fetchQsPackingData(contractId, loadId) {
    try {
        const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get the factory_id from sessionStorage

        // Ensure factory_id is available
        if (!selectedFactoryId) {
            console.error("No factory ID found in sessionStorage.");
            return;
        }

        const url = new URL(`/jssl/invoice/getcontractdeliverychallanqspackingdetailsnew`, baseUrl);

        // Append the parameters to the URL
        url.searchParams.append("contract_id", contractId);
        url.searchParams.append("load_id", loadId);
        url.searchParams.append("factory_id", selectedFactoryId); // Append factory_id as well

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch QsPacking data");

        const json = await response.json();

        // ✅ FIX: declare `contractor` at function scope so it's still
        // accessible later in the QsPacking_Data block (previously it was
        // declared with `const` inside the Contractor_Data `if` block only,
        // which threw a ReferenceError when referenced later and silently
        // killed the rest of the function via the outer try/catch).
    /*    let contractor = null;

        if (json.Grand_Total_value && json.Grand_Total_value.length > 0) {
            const Grand_Total_value = json.Grand_Total_value[0];

            const grandvalue = Grand_Total_value.Grand_Total_tax; // Assuming the bank details ID is inside this property
            const grand1 = document.getElementById("ingrandv");
	   const grand1 = document.getElementById("netamount");
            if (grand1) {
                grand1.value = grandvalue; // Populate the bank name field
            }
        } else {
            console.warn("No Contractor Data found.");
        }*/
        /*if (json.Grand_Total_value && json.Grand_Total_value.length > 0) {
            const grandTotalObj = json.Grand_Total_value[0]; // Get the first (and only) object 

            // Grab the fields you need, ignoring Base_Value
            const totalTaxValue = grandTotalObj.Total_Tax_Value;
            const totalTaxPercentage = grandTotalObj.Total_Tax_Percentage;
            const grandTotalTax = grandTotalObj.Grand_Total_Tax;
            const basicValue = grandTotalObj.Base_Value;

            // Example: populate DOM elements by IDs
            const totalValueEl = document.getElementById("ingrandvtaxvalue");
            if (totalValueEl) totalValueEl.value = totalTaxValue;

            const percentageEl = document.getElementById("ingrandvtaxper");
            if (percentageEl) percentageEl.value = totalTaxPercentage;

            const grandEl = document.getElementById("ingrandv");
            if (grandEl) grandEl.value = grandTotalTax;
        	
            const baseE1 = document.getElementById("chaingrandv");
            if (baseE1) baseE1.value = basicValue;

        } else {
            console.warn("No Grand Total Data found.");
        }*/

        if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {
            const QsPacking = json.QsPacking_Data[0];

            /* const freightValue = QsPacking.freight; // Assuming the bank details ID is inside this property
             const frie = document.getElementById("freight");
             if (frie) {
                 frie.value = freightValue; // Populate the bank name field
             }*/
			 const netamountValue = QsPacking.grand_total;

			 const netamount = document.getElementById("netamount");

			 if (netamount) {
			     netamount.value = netamountValue;
			 }

            const pnidValue = QsPacking.pn_id; // Assuming the bank details ID is inside this property
            const pnid = document.getElementById("id11");
            if (pnid) {
                pnid.value = pnidValue; // Populate the bank name field
            }

        } else {
            console.warn("No Contractor Data found.");
        }
        // Check if Contractor_Data exists and contains items
        if (json.Contractor_Data && json.Contractor_Data.length > 0) {
            // Get the first item (or iterate if needed)
            contractor = json.Contractor_Data[0]; // ✅ assign to the outer-scoped variable (no `const` here)

            // Set the bank name from the contractor data
            const bankDetailsIdValue = contractor.bank_details_id_value; // Assuming the bank details ID is inside this property
            const bankInput = document.getElementById("bank");
            if (bankInput) {
                bankInput.value = bankDetailsIdValue; // Populate the bank name field
            }
            // Set the work order from the contractor data
        /*    const workIdValue = contractor.work_id_value; // Assuming the work order ID is inside this property
            const workInput = document.getElementById("work");
            if (workInput) {
                workInput.value = workIdValue; // Populate the work order field
            }*/
			
			fetchSalework("work", contractor.work_id_value);
            /* const InvoiceTypeCal = contractor.invoice_type_calculation; // Assuming the work order ID is inside this property
             const InvoiceTypeCalcu = document.getElementById("intypecal");
             if (InvoiceTypeCalcu) {
                 InvoiceTypeCalcu.value = InvoiceTypeCal; // Populate the work order field
             }*/
            const InvoiceTypeCal = contractor.invoice_type_calculation; // 1 or 2
            const InvoiceTypeCalcu = document.getElementById("intypecal");
            const InvoiceTypeCalDb = document.getElementById("intypecal_db");

            if (InvoiceTypeCalcu && InvoiceTypeCalDb) {

                // store DB value
                InvoiceTypeCalDb.value = InvoiceTypeCal;

                // show user-friendly text
                if (InvoiceTypeCal == 1) {
                    InvoiceTypeCalcu.value = "Amount";
                } else if (InvoiceTypeCal == 2) {
                    InvoiceTypeCalcu.value = "Percentage";
                } else {
                    InvoiceTypeCalcu.value = "";
                }
            }
            const InvoiceToValue = contractor.invoice_to_id_value; // Assuming the work order ID is inside this property
            const InvoiceTo = document.getElementById("ininto");
            if (InvoiceTo) {
                InvoiceTo.value = InvoiceToValue; // Populate the work order field
            }
            /*const ProductValue = contractor.product_desc_id; // Assuming the work order ID is inside this property
            const ProDec = document.getElementById("prodesc");
            if (ProDec) {
                ProDec.value = ProductValue; // Populate the work order field
            }*/
			fetchinvoiceto("ininto", contractor.invoice_to_id_value);
            const ProductValue = contractor.product_desc_id; // 1 or 2
            const ProDec = document.getElementById("prodesc");
            const ProDecDb = document.getElementById("prodesc_db");

            if (ProDec && ProDecDb) {

                // store DB value
                ProDecDb.value = ProductValue;

                // show user-friendly text
                if (ProductValue == 1) {
                    ProDec.value = "Product desc";
                } else if (ProductValue == 2) {
                    ProDec.value = "pd";
                } else {
                    ProDec.value = "";
                }
            }
            const ShipmentValue = contractor.shipment_mode_id_value; // Assuming the work order ID is inside this property
            const Ship = document.getElementById("shipmode");
            if (Ship) {
                Ship.value = ShipmentValue; // Populate the work order field
            }
            const ExportValue = contractor.export; // Assuming the work order ID is inside this property
            const exp = document.getElementById("expt");
            if (exp) {
                exp.value = ExportValue; // Populate the work order field
            }
            /*const TaxPayValye = contractor.tax_payable; // Assuming the work order ID is inside this property
            const taxpay = document.getElementById("taxres");
            if (taxpay) {
                taxpay.value = TaxPayValye; // Populate the work order field
            }*/
            const TaxPayValye = contractor.tax_payable; // 1 or 2
            const taxpay = document.getElementById("taxres");
            const taxpayDb = document.getElementById("taxres_db");

            if (taxpay && taxpayDb) {

                // store DB value
                taxpayDb.value = TaxPayValye;

                // show user-friendly text
                if (TaxPayValye == 1) {
                    taxpay.value = "No";
                } else if (TaxPayValye == 2) {
                    taxpay.value = "Yes";
                } else {
                    taxpay.value = "";
                }
            }
            const PercenValue = contractor.percentage_value; // Assuming the work order ID is inside this property
            const per = document.getElementById("percen");
            if (per) {
                per.value = PercenValue; // Populate the work order field
            }
			fetchconname("billing", contractor.consignee_id_value);
            const ConValue = contractor.consignee_id_value; // Assuming the work order ID is inside this property
            const conadd = document.getElementById("billing");
            if (conadd) {
                conadd.value = ConValue; // Populate the work order field
            }
            const DelValue = contractor.delivery_condition_id_value; // Assuming the work order ID is inside this property
            const del = document.getElementById("delivery");
            if (del) {
                del.value = DelValue; // Populate the work order field
            }
            const RegValue = contractor.reg_office_id_value; // Assuming the work order ID is inside this property
            const reg = document.getElementById("office");
            if (reg) {
                reg.value = RegValue; // Populate the work order field
            }
            if (contractor.export === 'yes') {
                $('#exportFields1').show();
            } else {
                $('#exportFields1').hide();
            }
            const AreaValue = contractor.area_no; // Assuming the work order ID is inside this property
            const area = document.getElementById("are");
            if (area) {
                area.value = AreaValue; // Populate the work order field
            }
            const LotValue = contractor.lot_no; // Assuming the work order ID is inside this property
            const lot = document.getElementById("lut");
            if (lot) {
                lot.value = LotValue; // Populate the work order field
            }
            const contValue = contractor.containter_no; // Assuming the work order ID is inside this property
            const cont = document.getElementById("connum");
            if (cont) {
                cont.value = contValue; // Populate the work order field
            }
            const epcgnoValue = contractor.epcgno; // Assuming the work order ID is inside this property
            const epcgno = document.getElementById("epog");
            if (epcgno) {
                epcgno.value = epcgnoValue; // Populate the work order field
            }
            const exptitelvalue = contractor.export_title; // Assuming the work order ID is inside this property
            const expval = document.getElementById("exptitle");
            if (expval) {
                expval.value = exptitelvalue; // Populate the work order field
            }
            const ServiceValue = contractor.s_code_value; // Assuming the work order ID is inside this property
            const Scode = document.getElementById("service");
            if (Scode) {
                Scode.value = ServiceValue; // Populate the work order field
            }
            const HsnValue = contractor.h_code_value; // Assuming the work order ID is inside this property
            const Hcode = document.getElementById("hsncode");
            if (Hcode) {
                Hcode.value = HsnValue; // Populate the work order field
            }
			fetchSalebusunit("inbusunit", contractor.businessUnitName);
      /*      const BNameValue = contractor.businessUnitName; // Assuming the work order ID is inside this property
            const Bname = document.getElementById("inbusunit");
            if (Bname) {
                Bname.value = BNameValue; // Populate the work order field
            }*/
          /*  const ScodeNameValue = contractor.s_code_value; // Assuming the work order ID is inside this property
            const Scodename = document.getElementById("officeservice");
            if (Scodename) {
                Scodename.value = ScodeNameValue; // Populate the work order field
            }*/
        /*    const HcodeNameValue = contractor.h_code_value; // Assuming the work order ID is inside this property
            const Hcodename = document.getElementById("officehsn");
            if (Hcodename) {
                Hcodename.value = HcodeNameValue; // Populate the work order field
            }*/
            const con_slnoValue = contractor.con_slno; // Assuming the work order ID is inside this property
            const con_slno = document.getElementById("id11con");
            if (con_slno) {
                con_slno.value = con_slnoValue; // Populate the work order field
            }
        } else {
            console.warn("No Contractor Data found.");
        }


        // Check if QsPacking_Data exists and contains items
        if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {

            const container = document.querySelector(".dynamic-row");
            container.innerHTML = "";   // clear only THIS panel

            // ✅ `contractor` is now safely accessible here since it was
            // declared with `let` at the top of the function.
            const contractorServiceCode = contractor ? contractor.s_code_value : null;
            const contractorHsnCode = contractor ? contractor.h_code_value : null;

            json.QsPacking_Data.forEach((item, index) => {

                const showLabel = index === 0;

             /*   const serviceOptions = serviceMasterList.map(s => {
                    const isMatch = contractorServiceCode && s.service_code === contractorServiceCode;
                    return `
                        <option value="${s.service_code}" ${isMatch ? 'selected' : ''}>
                            ${s.service_code} - ${s.service_description}
                        </option>`;
                }).join("");

                // Build HSN Code <option> list — pre-select the option
                // that matches contractor.h_code_value, if it exists.
                const hsnOptions = hsnMasterList.map(h => {
                    const isMatch = contractorHsnCode && h.service_code === contractorHsnCode;
                    return `
                        <option value="${h.service_code}" ${isMatch ? 'selected' : ''}>
                            ${h.service_code} - ${h.service_description}
                        </option>`;
                }).join("");
				*/
				
				const serviceOptions = `
								    <option value=" ">Select Service Code</option>
								    ${serviceMasterList.map(s => {
								        const isMatch = contractorServiceCode && s.service_code === contractorServiceCode;
								        return `
								            <option value="${s.service_code}" ${isMatch ? 'selected' : ''}>
								                ${s.service_code} - ${s.service_description}
								            </option>`;
								    }).join("")}
								`;
								
								
								
								const hsnOptions = `
											    <option value=" ">Select HSN Code</option>
											    ${hsnMasterList.map(h => {
											        const isMatch = contractorHsnCode && h.service_code === contractorHsnCode;
											        return `
											            <option value="${h.service_code}" ${isMatch ? 'selected' : ''}>
											                ${h.service_code} - ${h.service_description}
											            </option>`;
											    }).join("")}
											`;
				
				
				
				

                container.insertAdjacentHTML("beforeend", `
					<div class="form-row flex-nowrap">

					<div class="form-group col-md-1 col-sm-12">
							${showLabel ? '<label><b>UOM</b></label>' : ''}
							<input type="text" value="${item.uom_name}" class="form-control form-control-sm" disabled>
					</div>

					<div class="form-group col-md-1 col-sm-12">
							${showLabel ? '<label><b>Quantity</b></label>' : ''}
							<input type="number" value="${item.qty}" class="form-control form-control-sm text-right" disabled>
					</div>

					<div class="form-group col-md-1 col-sm-12">
							${showLabel ? '<label><b>Kg</b></label>' : ''}
					<input type="number" value="${item.per_kgs}" class="form-control form-control-sm text-right" disabled>
					</div>

					<div class="form-group col-md-1 col-sm-12">
						   ${showLabel ? '<label><b>Unit Price</b></label>' : ''}
					<input type="number" value="${item.unit_price}" class="form-control form-control-sm text-right" disabled>
					</div>

					<div class="form-group col-md-1 col-sm-12">
							${showLabel ? '<label><b>Total</b></label>' : ''}
					<input type="number" value="${item.total}" class="form-control form-control-sm text-right" disabled>
					</div>

					<div class="form-group col-md-1 col-sm-12">
							${showLabel ? '<label><b>Milestone</b></label>' : ''}
					<input type="text" value="${item.milestone_name}" class="form-control form-control-sm" disabled>
					</div>

					 <div class="form-group col-md-1 col-sm-12">
							${showLabel ? '<label><b>Invoice Type</b></label>' : ''}
					<input type="text" value="${item.scrap_name_type_id}" class="form-control form-control-sm" disabled>
					</div>

					<div class="form-group col-md-2 col-sm-12">
					     ${showLabel ? '<label><b>Service Code</b></label>' : ''}
					   <select class="form-control form-control-sm service-code-select" data-slno="${item.slno || ''}">
					  <option value="" ${!contractorServiceCode ? 'selected' : ''}>Select Service Code</option>
					      ${serviceOptions}
					</select>
					 <div class="error-message service-code-error"></div>
					    </div>

					  <div class="form-group col-md-2 col-sm-12">
					     ${showLabel ? '<label><b>HSN Code</b></label>' : ''}
					        <select class="form-control form-control-sm hsn-code-select" data-slno="${item.slno || ''}">
					          <option value="" ${!contractorHsnCode ? 'selected' : ''}>Select HSN Code</option>
					             ${hsnOptions}
					      </select>
					       </div>

					</div>
		            <hr style="width:100%;border-top:1px solid #ccc;">
		        `);
            });
			
			initRowCodeSelect2('#inputFieldsContainer');
        } else {
            console.warn("No QsPacking data found.");
        }
        // Now, handle tax data and append it to .dynamic-row1
      /*  if (json.tax && json.tax.length > 0) {
            const taxContainer = document.querySelector(".dynamic-row1"); // Find the container for dynamic tax rows
            taxContainer.innerHTML = ""; // Clear any existing rows

            // Loop through tax data and create dynamic rows
            json.tax.forEach((tax, taxIndex) => {
                $(".dynamic-row1").append(`
			        <div class="row align-items-center mb-2">
			            <div class="col-auto">
			                <label class="small-label1">Tax Name</label>
			                <input type="text"
			                       class="form-control form-control-sm small-input1"
			                       value="${tax.tax_name}"
			                       readonly>
			            </div>

			            <div class="col-auto">
			                <label class="small-label1">Tax %</label>
			                <input type="text"
			                       class="form-control form-control-sm small-input1 text-right"
			                       value="${tax.tax_per}"
			                       readonly>
			            </div>

			            <div class="col-auto">
			                <label class="small-label1">Tax Value</label>
			                <input type="text"
			                       class="form-control form-control-sm small-input1 text-right"
			                       value="${tax.tax_value}"
			                       readonly>
			            </div>
			        </div>

			        <hr class="my-1" style="width:100%;border-top:1px solid #ddd;">
			    `);
            });*/
			await loadDlyTaxMaster('.dynamic-row1', json.tax || []);
  
    } catch (error) {
        console.error("Error fetching QsPacking data:", error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
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
        const url = new URL(`/jssl/invoice/listnewdly`, baseUrl);
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
                                             onclick="printRecord('${item.id}')">
                                          </i>
                                    </td>
                                    `;

                             🟢 VERIFIED 
                }  else if (item.status === 'VERIFIED') {
                editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
                editIcon = `<td><i class="fa fa-pen text-muted"></i></td>`; // Disabled (greyed out)
                //viewIcon = `<td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}')"></i></td>`; // Enabled
                printIcon = `<td><i class="fa fa-print" style="color: green;" onclick="printRecord('${item.id}')"></i></td>`; // Enabled
                releaseIcon = `<td><i class="fa fa-box-open" style="color: brown;" onclick="openModal('${item.id}', '${item.pn_id}')"></i></td>`;
                cancelIcon = ` <td>  <i class="fa fa-times-circle"style="color: red; cursor: pointer;" onclick="openModalcancel('${item.id}', '${item.pn_id}')"> </i>  </td> `;
            	
            } else if (item.status === 'NOT VERIFIED') {
                editinvoice = `<td><i class="fa fa-edit" style="color: blue;" onclick="editRecordInvoice('${item.id}')"></i></td>`; // Enabled
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
                    <td>${item.load_id}</td>
                    <td>${item.invoice_number}</td>
                    <td>${formatDate(item.created_onlydate)}</td>  <!-- Formatted Date -->
                    <td>${item.status}</td>
                    <td style="display:none;">${item.pn_id}</td>
                    ${editinvoice}
                    ${editIcon}
                    <td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}')"></i></td>
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
}*/





let currentFactoryIdDly = null;

function fetchUserList111(selectedFactoryId) {

    currentFactoryIdDly = selectedFactoryId ||
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
                action: function() {

                    const url = new URL(`/jssl/invoice/listnewdlypaged`, baseUrl);
                    url.searchParams.append('factory_id', currentFactoryIdDly);
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
                                item.contract_name || '',
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
                                buttons: [{
                                    extend: 'excelHtml5',
                                    title: 'DLY Invoice List'
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
            { title: "Contract Name" },
            { title: "Lot Number" },
            { title: "Invoice Number" },
            { title: "Invoice Date" },
            { title: "Status" },
            { title: "pnid", visible: false },  // col 5 - hidden
            { title: "Edit Invoice", orderable: false },
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

            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                const dateObj = new Date(dateStr);
                if (isNaN(dateObj)) return dateStr;
                return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
            };

            const url = new URL(`/jssl/invoice/listnewdlypaged`, baseUrl);
            url.searchParams.append('factory_id', currentFactoryIdDly);
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
                        let editIcon = '';
                        let releaseIcon = '';
                        let cancelIcon = '';
                        let printIcon = '';
						let viewIcon = '';

                        if (item.status === 'CANCELLED') {
                            editinvoice = `<i class="fa fa-edit text-muted"></i>`;
                            editIcon = `<i class="fa fa-pen text-muted"></i>`;
                            releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                            cancelIcon = `<i class="fa fa-times-circle text-muted"></i>`;
                            printIcon = `<i class="fa fa-print" style="color:green; cursor:pointer;" onclick="printRecord('${item.id}')"></i>`;
							viewIcon = `<i class="fa fa-eye" style="color:green;" onclick="editRecord11('${item.id}')"></i>`

                        } else if (item.status === 'VERIFIED') {
                            editinvoice = `<i class="fa fa-edit text-muted"></i>`;
                            editIcon = `<i class="fa fa-pen text-muted"></i>`;
                            releaseIcon = `<i class="fa fa-box-open" style="color:brown;" onclick="openModal('${item.id}','${item.pn_id}')"></i>`;
                            cancelIcon = `<i class="fa fa-times-circle" style="color:red; cursor:pointer;" onclick="openModalcancel('${item.id}','${item.pn_id}')"></i>`;
                            printIcon = `<i class="fa fa-print" style="color:green;" onclick="printRecord('${item.id}')"></i>`;
							viewIcon = `<i class="fa fa-eye" style="color:green;" onclick="editRecord11('${item.id}')"></i>`

                        } else if (item.status === 'NOT VERIFIED') {
                            editinvoice = `<i class="fa fa-edit" style="color:blue;" onclick="editRecordInvoice('${item.id}')"></i>`;
                            editIcon = `<i class="fa fa-pen" style="color:blue;" onclick="editRecord('${item.id}')"></i>`;
                            releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                            cancelIcon = `<i class="fa fa-times-circle text-muted"></i>`;
                            printIcon = `<i class="fa fa-print text-muted"></i>`;
							viewIcon = `<i class="fa fa-eye text-muted"></i>`;

                        } else {
                            editinvoice = `<i class="fa fa-edit text-muted"></i>`;
                            editIcon = `<i class="fa fa-pen text-muted"></i>`;
                            releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                            cancelIcon = `<i class="fa fa-times-circle text-muted"></i>`;
                            printIcon = `<i class="fa fa-print text-muted"></i>`;
							viewIcon = `<i class="fa fa-eye text-muted"></i>`;
                        }

                        return [
                            item.contract_name || '',              // col 0
                            item.load_id || '',              // col 1
                            item.invoice_number || '',              // col 2
                            formatDate(item.created_onlydate),      // col 3
                            item.status || '',              // col 4
                            item.pn_id || '',              // col 5 - hidden
                            editinvoice,                            // col 6
                            editIcon,                               // col 7
                            viewIcon,                               // col 8
                            releaseIcon,                            // col 9
                            cancelIcon,                             // col 10
                            printIcon                               // col 11
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
                    console.error('Error fetching DLY invoice data:', error);
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

/*async function fetchinvoice() {
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
		const selectElement1 = document.getElementById("intype444gp");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select invoice type</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.INVOICE_TYPE_LIST.forEach((type) => {
            if (type.slno && type.remarks_type) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.slno; // Backend keeps saleorder_id
                option.textContent = type.remarks_type; // Display saleorder_typename
                selectElement.appendChild(option);
				selectElement1.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}*/


async function fetchinvoice() {
    try {
        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch invoice types");
        const json = await response.json();

        if (json.status !== "yes" || !json.INVOICE_TYPE_LIST.length) {
            console.warn("No invoice types found.");
            return;
        }

        const selectElement  = document.getElementById("intype444");
        const selectElement1 = document.getElementById("intype444gp");
        selectElement.innerHTML = `<option value="">Select invoice type</option>`;
        if (selectElement1) selectElement1.innerHTML = `<option value="">Select invoice type</option>`;

        json.INVOICE_TYPE_LIST.forEach((type) => {
            if (type.slno && type.remarks_type) {
                const option = document.createElement("option");
                option.value = type.slno;
                option.textContent = type.remarks_type;
                selectElement.appendChild(option);
                if (selectElement1) selectElement1.appendChild(option.cloneNode(true));   // clone, don't move
            }
        });

       // initSelect2('intype444', 'Select invoice type');
        if (selectElement1) initSelect2('intype444gp', 'Select invoice type');
    } catch (error) {
        console.error("Error fetching invoice types:", error);
    }
}

async function fetchinvoiceEdit(factoryId) {
    try {

        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
        /*  url.searchParams.append("factory_id", factoryId);*/

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
        const selectElement = document.getElementById("intypeeditup")

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
		
		//initSelect2('intypeeditup', 'Select invoice type');
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

async function fetchBgTypeedit() {
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

/*async function fetchSalebusunit(targetId = "bus", currentValueText = null) {
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

        //selectElement.innerHTML = `<option value="">Select Business Unit</option>`;

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
		            matchFound = true;
		        }

		        selectElement.appendChild(option);
		    }
		});

        // Only add currentValueText as a fallback option if it wasn't found in the API list
        if (currentValueText && !matchFound) {
            const currentOption = document.createElement("option");
            currentOption.value = currentValueText;
            currentOption.textContent = currentValueText;
            currentOption.selected = true;
            selectElement.insertBefore(currentOption, selectElement.firstChild.nextSibling);
        }
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}*/


async function fetchSalebusunit(targetId = "bus", currentValueText = null) {
    try {
        const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch business units");
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No business units found.");
            return;
        }

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;
        selectElement.innerHTML = `<option value="">Select Business Unit</option>`;

        json.Data.forEach((type) => {
            if (type.business_unit_id && type.business_unit_name) {
                const option = document.createElement("option");
                option.value = type.business_unit_id;
                option.textContent = type.business_unit_name + type.location + '(' + type.gst_number + ')';
                if (currentValueText && currentValueText.startsWith(type.business_unit_name)) {
                    option.selected = true;
                }
                selectElement.appendChild(option);
            }
        });

        initSelect2(targetId, 'Select Business Unit');
    } catch (error) {
        console.error("Error fetching business units:", error);
    }
}

/*function openModalAdd() {
    var username = document.getElementById('intype444').value.trim();
    var prodes = document.getElementById('prodes').value.trim();
    var remark = document.getElementById('remark').value.trim();
	var lotnum = document.getElementById('lotnum').value.trim();
	var jobwork = document.getElementById('invoice').selectedOptions[0].text;
    var showError = false; // Initialize showError variable
	
    // Username Validation
    if (username === '') {
        document.getElementById('Vehicleerror').innerText = "Please select invoice type.";
        document.getElementById('Vehicleerror').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('Vehicleerror').innerText = "";
        document.getElementById('Vehicleerror').style.display = "none";
    }

    if (prodes === '') {
        document.getElementById('productCodeError3').innerText = "Please enter product description.";
        document.getElementById('productCodeError3').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError3').innerText = "";
        document.getElementById('productCodeError3').style.display = "none";
    }

    if (remark === '') {
        document.getElementById('productCodeError4').innerText = "Please enter remarks.";
        document.getElementById('productCodeError4').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError4').innerText = "";
        document.getElementById('productCodeError4').style.display = "none";
    }
if(jobwork!='JOBWORK')
	{
	if (lotnum === '') {
	    document.getElementById('loterror').innerText = "Please select  lotnumber.";
	    document.getElementById('loterror').style.display = "inline-block";
	    showError = true;
	} else {
	    document.getElementById('loterror').innerText = "";
	    document.getElementById('loterror').style.display = "none";
	}
		document.getElementById('loterror').innerText = "";
	    document.getElementById('loterror').style.display = "none";
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
	
	}*/
	
	
	
	function openModalAdd() {
	    let showError = false;

	    function required(id, errId, msg) {
	        if (String($('#' + id).val() || '').trim() === '') {
	            setFieldError(errId, msg); showError = true;
	        } else setFieldError(errId, '');
	    }

	    required('intype444', 'Vehicleerror',      'Please select invoice type.');
	    required('inbusunit', 'busunitErr',        'Please select Business Unit.');
	    required('ininto',    'intoErr',           'Please select Invoice To.');
	    required('work',      'workErr',           'Please select Work Order.');
	    required('billing',   'billingErr',        'Please select Name & Address of Consignee.');
	    required('prodes',    'productCodeError3', 'Please enter product description.');
	    required('remark',    'productCodeError4', 'Please enter remarks.');

	    $('#inputFieldsContainer .service-code-select').each(function () {
	        const svc = String($(this).val() || '').trim();
	        const hsn = String($(this).closest('.form-row').find('.hsn-code-select').val() || '').trim();
	        const $err = $(this).closest('.form-group').find('.service-code-error');
	        if (svc === '' && hsn === '') {
	            $err.text('Please select either HSN Code or Service Code.').css('display', 'inline-block');
	            showError = true;
	        } else {
	            $err.text('').hide();
	        }
	    });

	    if (!showError) $('#exampleModalCenter66').modal('show');
	}
	
	

// Fetch selectedFactoryId from sessionStorage
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

/*async function addevent() {

	const invoiceValue = document.getElementById('invoice').value;

	if (invoiceValue != 6) {
	$('#exampleModalCenter66').modal('hide');
    // Validate role code and role description
    const selectedCOnt = document.getElementById("cont").selectedOptions[0]; // Get the selected option
    const contid = selectedCOnt ? selectedCOnt.value : ''; // Get the contract_id
    const contname = selectedCOnt ? selectedCOnt.textContent : ''; // Get the contract_name
	const selectedlot_id = document.getElementById("lotnum").selectedOptions[0]; // Get the selected option
	const lot_id = selectedlot_id ? selectedlot_id.value : ''; 
	const lot_no = selectedlot_id ? selectedlot_id.text : ''; 

	await saveServiceHsnSelections();
	
    $.ajax({
        url: new URL('/jssl/invoice/addnewdly', baseUrl),
        type: 'POST',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: jQuery.param({
            contract_id: contid,
            created_by: createdById,
            load_id: load.value,
            invoice_type: "DLY",
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
            type_id: intype444.value,
            pn_id: id11.value,
			lot_id: lot_id,
			lot_no: lot_no,
			
			
			// ---- Contract Details modal fields ----
			      business_unit_id: document.getElementById("inbusunit").value,
			      invoice_type_calculation: document.getElementById("intypecal").value,
			      invoice_to_id: document.getElementById("ininto").value,
			      product_desc_id: document.getElementById("prodesc").value,
			      shipment_mode_id: document.getElementById("shipmode").value,
			      work_id: document.getElementById("work").value,
			      export: document.getElementById("expt").value,
			      tax_ex_inc: document.getElementById("taxres").value,
			      percentage_value: document.getElementById("percen").value,
			      consignee_id: document.getElementById("billing").value,
			      bank_details_id: document.getElementById("bank").value,
			      delivery_condition_id: document.getElementById("delivery").value,
			      regd_office_id: document.getElementById("office").value
			
        }),
        success: function(data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Delivery challan Invoice Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ChallanInvoiceEntry.jsp';
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
		
	}*/
	
	
	async function addevent() {

	    $('#exampleModalCenter66').modal('hide');

	    // Get selected Contractor
	    const selectedCOnt = document.getElementById("cont").selectedOptions[0];
	    const contid = selectedCOnt ? selectedCOnt.value : '';
	    const contname = selectedCOnt ? selectedCOnt.textContent : '';

	    // Get selected Lot
	    const selectedlot_id = document.getElementById("lotnum").selectedOptions[0];
	    const lot_id = selectedlot_id ? selectedlot_id.value : '';
	    const lot_no = selectedlot_id ? selectedlot_id.text : '';

	    await saveServiceHsnSelections();

	    // ----------------------------------
	    // Get DLY Tax Details
	    // ----------------------------------

	    const dlyTaxRows = document.querySelectorAll(".dly-tax-select");

	    const tax1Select = dlyTaxRows[0];
	    const tax2Select = dlyTaxRows[1];
	    const tax3Select = dlyTaxRows[2];

	    const tax1 = tax1Select?.value || "";
	    const tax1_per = tax1Select?.closest(".row")
	        ?.querySelector(".dly-tax-per")?.value || "0";
	    const tax1_value = tax1Select?.closest(".row")
	        ?.querySelector(".dly-tax-value")?.value || "0";

	    const tax2 = tax2Select?.value || "";
	    const tax2_per = tax2Select?.closest(".row")
	        ?.querySelector(".dly-tax-per")?.value || "0";
	    const tax2_value = tax2Select?.closest(".row")
	        ?.querySelector(".dly-tax-value")?.value || "0";

	    const tax3 = tax3Select?.value || "";
	    const tax3_per = tax3Select?.closest(".row")
	        ?.querySelector(".dly-tax-per")?.value || "0";
	    const tax3_value = tax3Select?.closest(".row")
	        ?.querySelector(".dly-tax-value")?.value || "0";

	    // ----------------------------------
	    // Read Amount Details
	    // ----------------------------------

	    const totalTax = document.getElementById("totaltax")?.value || "0";
	    const netAmount = document.getElementById("netamount")?.value || "0";
	    const grandTotal = document.getElementById("ingrandv")?.value || "0";

	    // ----------------------------------
	    // Save DLY Invoice
	    // ----------------------------------

	    $.ajax({

	        url: new URL('/jssl/invoice/addnewdly', baseUrl),

	        type: 'POST',

	        dataType: 'json',

	        xhrFields: {
	            withCredentials: true
	        },

	        data: jQuery.param({

	            contract_id: contid,

	            created_by: createdById,

	            load_id: load.value,

	            invoice_type: "DLY",

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

	            type_id: intype444.value,

	            pn_id: id11.value,

	            lot_id: lot_id,

	            lot_no: lot_no,

	            // ----------------------------------
	            // Tax Details
	            // ----------------------------------

				// Tax Details
				tax_id_1: tax1,
				tax_value_1: tax1_value,

				tax_id_2: tax2,
				tax_value_2: tax2_value,

				tax_id_3: tax3,
				tax_value_3: tax3_value,

				payable_by_customer: netAmount,
				payable_to_dept: totalTax,

	            // ----------------------------------
	            // Contract Details
	            // ----------------------------------

	            business_unit_id: document.getElementById("inbusunit").value,

	            invoice_type_calculation: document.getElementById("intypecal").value,

	            invoice_to_id: document.getElementById("ininto").value,

	            product_desc_id: document.getElementById("prodesc").value,

	            shipment_mode_id: document.getElementById("shipmode").value,

	            work_id: document.getElementById("work").value,

	            export: document.getElementById("expt").value,

	            tax_ex_inc: document.getElementById("taxres").value,

	            percentage_value: document.getElementById("percen").value,

	            consignee_id: document.getElementById("billing").value,

	            bank_details_id: document.getElementById("bank").value,

	            delivery_condition_id: document.getElementById("delivery").value,

	            regd_office_id: document.getElementById("office").value

	        }),

	        success: function(data) {

	            var result = data.message;

	            if (result === "Success") {

	                const popup = $('<div class="popup">Delivery challan Invoice Created Successfully!</div>')
	                    .appendTo('body').hide().fadeIn(400);

	                setTimeout(function() {

	                    popup.fadeOut(400, function() {

	                        $(this).remove();

	                        window.location = 'ChallanInvoiceEntry.jsp';

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

	        error: function(xhr, status, error) {

	            console.error('Request failed:', error);

	            console.error(xhr.responseText);

	        }

	    });

	}

// Function to safely set values in input fields
function setInputValue(selector, value) {
    $(selector).val(value ? value : ""); // Set value or empty string if undefined/null
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
	 // const allowed = window.allowedActions || [];

	if (!allowed.includes("Verify")) {
	  alert(" You do not have permission to Verify.");
	  return;
	}
    try {
        const url = new URL(`/jssl/invoice/searchdlyidnew`, baseUrl);
        url.searchParams.append('id', id);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        const packingData = json.QsPacking_Data || [];
       /* const taxData = json.tax || [];*/
        const invoiceData = json.Invoice_Data || {};
        const GrandValue = json.Grand_Total_value || [];
        const ContData = json.Contractor_Data || [];
		/*const ContractMasterData = json.InvoiceContractMaster || {};*/
		const ContractMasterData = json.InvoiceContractMaster || {};

		const taxData = [
		    {
		        tax_id: ContractMasterData.tax_id_1,
		        tax_value: ContractMasterData.tax_value_1
		    },
		    {
		        tax_id: ContractMasterData.tax_id_2,
		        tax_value: ContractMasterData.tax_value_2
		    },
		    {
		        tax_id: ContractMasterData.tax_id_3,
		        tax_value: ContractMasterData.tax_value_3
		    }
		].filter(tax => tax.tax_id != null && tax.tax_id !== "");
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
        //setInputValue("#vfreight11", packingData.length > 0 ? packingData[0].freight : "");
        setInputValue("#pnverifyww", packingData.length > 0 ? packingData[0].pn_id : "");
        setInputValue("#incvup", packingData.length > 0 ? packingData[0].invoice_remarks_type_name : "");
        setInputValue("#vcontract11vvv", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");

        // Set grand total value
        setInputValue("#grandv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        // Set contractor data fields
        const contractorFields = {
         /*   "#bunitv": "business_unit_name",*/
            //"#intypev": "invoice_type_calculation",
         /*   "#intov": "invoice_to_id_value",*/
            //"#prodesv": "product_desc_id",
            "#shipmodev": "shipment_mode_id_value",
            /*"#workorderv": "work_id_value",*/
            "#exptv": "export",
            //"#taxresv": "tax_payable",
            "#percenv": "percentage_value",
            /*"#nandconv": "consignee_id_value",*/
            "#banknamev": "bank_details_id_value",
            "#deliveryconv": "delivery_condition_id_value",
            "#officevv": "reg_office_id_value",
            //"#vingrandv": "tax_ex_inc",
            //"#advF": "freight_advance_recovery",
            "#arev": "area_no",
            "#lutv": "lot_no",
            "#connumv": "containter_no",
            "#epogv": "epcgno",
            "#exptitlev": "export_title",
            "#newscode2": "s_code_value",
            "#newhcode2": "h_code_value",
        };

        const InvoiceTypeCall =
            ContData.length > 0 ? ContData[0].invoice_type_calculation : null;

        const InvoiceTypeVupp = document.getElementById("intypev");

        if (InvoiceTypeVupp) {
            if (InvoiceTypeCall == 1) {
                InvoiceTypeVupp.value = "Amount";
            } else if (InvoiceTypeCall == 2) {
                InvoiceTypeVupp.value = "Percentage";
            } else {
                InvoiceTypeVupp.value = "";
            }
        }

        const Producttypee =
            ContData.length > 0 ? ContData[0].product_desc_id : null;

        const Producttypeupp = document.getElementById("prodesv");

        if (Producttypeupp) {
            if (Producttypee == 1) {
                Producttypeupp.value = "Product desc";
            } else if (Producttypee == 2) {
                Producttypeupp.value = "pd";
            } else {
                Producttypeupp.value = "";
            }
        }
		const contract_id =  ContData[0].contract_id;
        const Taxpayablee =
            ContData.length > 0 ? ContData[0].tax_payable : null;

        const Taxpayableupp = document.getElementById("taxresv");

        if (Taxpayableupp) {
            if (Taxpayablee == 1) {
                Taxpayableupp.value = "No";
            } else if (Taxpayablee == 2) {
                Taxpayableupp.value = "Yes";
            } else {
                Taxpayableupp.value = "";
            }
        }

        /*const Taxexinn =
            ContData.length > 0 ? ContData[0].tax_ex_inc : null;

            const Taxexinupp = document.getElementById("vingrandv");

            if (Taxexinupp) {
            if (Taxexinn == 1) {
            Taxexinupp.value = "Exclusive";
            } else if (Taxexinn == 2) {
            Taxexinupp.value = "Inclusive";
            } else {
                Taxexinupp.value = "";
            }
               }
               
        const Freightadrecc =
            ContData.length > 0 ? ContData[0].freight_advance_recovery : null;

            const Freightadrecupp = document.getElementById("advF");

        if (Freightadrecupp) {
        if (Freightadrecc == 1) {
        Freightadrecupp.value = "Inclusive";
            } else if (Freightadrecc == 2) {
        Freightadrecupp.value = "Exclusive";
            } else {
        Freightadrecupp.value = "";
            }
         }*/
        const TaxFields = {
            "#bvaue": "basic_value",
            "#pdptv": "optd",
            "#pdptcv": "optc",
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

        // Append packing data
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
		                ${showLabel ? '<label class="small-label d-block">UOM</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input"
		                       value="${item.uom_name}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label d-block">Quantity</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"
		                       value="${Number(item.qty).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label d-block">Kg</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"
		                       value="${Number(item.per_kgs).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label d-block">Unit Price</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"
		                       value="${Number(item.unit_price).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label d-block">Total</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"
		                       value="${Number(item.total).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label d-block">Invoice Type</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input"
		                       value="${item.scrap_name_type_id}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label d-block">Milestone</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input"
		                       value="${item.milestone_name}" readonly>
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
		        <hr style="width:100%;border-top:1px solid #ccc;">
		    `);
        });

        // Append tax data
   /*     taxData.forEach((tax) => {
            $(".dynamic-row122").append(`
                <div class="row align-items-center mb-1">
                    <div class="col-auto"><label class="small-label1">Tax Name</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_name}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax %</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_per}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax Value</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_value}" readonly>
                    </div>
                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
                    </div>
                </div>
                <hr style="width:120%;border-top:1px solid #ccc;">
            `);
        });*/
		
		// Display saved tax details in disabled mode
		const taxContainer = $(".dynamic-row122");
		taxContainer.empty();

		const taxMasterUrl = new URL("/jssl/taxmasters/list", baseUrl);

		const taxResponse = await fetch(taxMasterUrl, {
		    method: "GET",
		    credentials: "include"
		});

		if (!taxResponse.ok) {
		    throw new Error("Failed to fetch tax master data");
		}

		const taxMasterJson = await taxResponse.json();
		const masterTaxes = taxMasterJson?.Data || [];

		taxData.forEach((tax, index) => {

		    const matchedTax = masterTaxes.find(
		        item => Number(item.tax_id) === Number(tax.tax_id)
		    );

		    if (!matchedTax) {
		        console.warn("Tax master record not found for ID:", tax.tax_id);
		        return;
		    }

		    taxContainer.append(`
		        <div class="row align-items-center mb-1">

		            <div class="col-auto">
		                <label class="small-label1">Tax Name</label>
		                <input type="text"
		                       class="form-control form-control-sm small-input1"
		                       value="${matchedTax.tax_name || ''}"
		                       disabled>
		            </div>

		            <div class="col-auto">
		                <label class="small-label1">Tax %</label>
		                <input type="text"
		                       class="form-control form-control-sm small-input1 text-right"
		                       value="${matchedTax.tax_per ?? ''}"
		                       disabled>
		            </div>

		            <div class="col-auto">
		                <label class="small-label1">Tax Value</label>
		                <input type="text"
		                       class="form-control form-control-sm small-input1 text-right"
		                       value="${tax.tax_value ?? 0}"
		                       disabled>
		            </div>

		        </div>

		        <hr style="width:120%;border-top:1px solid #ccc;">
		    `);
		});
		
		toggleSubcontractingFieldsVerify();
		fetchLotnumberview(selectedFactoryId, contract_id, invoiceData.lot_id);
        // Show the modal
        $("#exampleModalScrollableVerify").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
}

async function editRecord11(id) {
	//const allowed = window.allowedActions || [];

			if (!allowed.includes("view")) {
			  alert(" You do not have permission to view.");
			    $("#exampleModalScrollableVerified").modal("hide");
			  return;
			}
    try {
        const url = new URL(`/jssl/invoice/searchdlyidnew`, baseUrl);
        url.searchParams.append('id', id);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        const packingData = json.QsPacking_Data || [];
      /*  const taxData = json.tax || [];*/
        const invoiceData = json.Invoice_Data || {};
        const GrandValue = json.Grand_Total_value || [];
        const ContData = json.Contractor_Data || [];
	
		// ---- NEW: resolve Contract Details display text from InvoiceContractMaster, fallback to ContData ----
		     /*   const ContractMasterData = json.InvoiceContractMaster || {};*/
			 const ContractMasterData = json.InvoiceContractMaster || {};

			 const taxData = [
			     {
			         tax_id: ContractMasterData.tax_id_1,
			         tax_value: ContractMasterData.tax_value_1
			     },
			     {
			         tax_id: ContractMasterData.tax_id_2,
			         tax_value: ContractMasterData.tax_value_2
			     },
			     {
			         tax_id: ContractMasterData.tax_id_3,
			         tax_value: ContractMasterData.tax_value_3
			     }
			 ].filter(tax => tax.tax_id != null && tax.tax_id !== "");
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
        //setInputValue("#vfreight11v", packingData.length > 0 ? packingData[0].freight : "");
        setInputValue("#pnverifywwv", packingData.length > 0 ? packingData[0].pn_id : "");
        setInputValue("#incvuppv", packingData.length > 0 ? packingData[0].invoice_remarks_type_name : "");
        setInputValue("#contractcha", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");

        // Set grand total value
        setInputValue("#grandvv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        // Set contractor data fields
        const contractorFields = {
          /*  "#bunitvv": "business_unit_name",*/
            //"#intypevv": "invoice_type_calculation",
          /*  "#intovv": "invoice_to_id_value",*/
            //"#prodesvv": "product_desc_id",
            "#shipmodevv": "shipment_mode_id_value",
            /*"#workordervv": "work_id_value",*/
            "#exptvv": "export",
            //"#taxresvv": "tax_payable",
            "#percenvv": "percentage_value",
           /* "#nandconvv": "consignee_id_value",*/
            "#banknamevv": "bank_details_id_value",
            "#deliveryconvv": "delivery_condition_id_value",
            "#officevvv": "reg_office_id_value",
            //"#vingrandvv": "tax_ex_inc",
            //"#advFv": "freight_advance_recovery",
            "#arevv": "area_no",
            "#lutvv": "lot_no",
            "#connumvv": "containter_no",
            "#epogvv": "epcgno",
            "#exptitlevv": "export_title",
            "#newscode1": "s_code_value",
            "#newhcode1": "h_code_value",
        };

        const InvoiceTypeCal1 =
            ContData.length > 0 ? ContData[0].invoice_type_calculation : null;

        const InvoiceTypeVup1 = document.getElementById("intypevv");

        if (InvoiceTypeVup1) {
            if (InvoiceTypeCal1 == 1) {
                InvoiceTypeVup1.value = "Amount";
            } else if (InvoiceTypeCal1 == 2) {
                InvoiceTypeVup1.value = "Percentage";
            } else {
                InvoiceTypeVup1.value = "";
            }
        }

        const Producttype1 =
            ContData.length > 0 ? ContData[0].product_desc_id : null;

        const Producttypeup1 = document.getElementById("prodesvv");

        if (Producttypeup1) {
            if (Producttype1 == 1) {
                Producttypeup1.value = "Product desc";
            } else if (Producttype1 == 2) {
                Producttypeup1.value = "pd";
            } else {
                Producttypeup1.value = "";
            }
        }
		const contract_id =  ContData[0].contract_id;

        const Taxpayable1 =
            ContData.length > 0 ? ContData[0].tax_payable : null;

        const Taxpayableup1 = document.getElementById("taxresvv");

        if (Taxpayableup1) {
            if (Taxpayable1 == 1) {
                Taxpayableup1.value = "No";
            } else if (Taxpayable1 == 2) {
                Taxpayableup1.value = "Yes";
            } else {
                Taxpayableup1.value = "";
            }
        }

        /*const Taxexin1 =
            ContData.length > 0 ? ContData[0].tax_ex_inc : null;

            const Taxexinup1 = document.getElementById("vingrandvv");

            if (Taxexinup1) {
            if (Taxexin1 == 1) {
            Taxexinup1.value = "Exclusive";
            } else if (Taxexin1 == 2) {
            Taxexinup1.value = "Inclusive";
            } else {
                Taxexinup1.value = "";
            }
               }
               
        const Freightadrec1 =
            ContData.length > 0 ? ContData[0].freight_advance_recovery : null;

            const Freightadrecup1 = document.getElementById("advFv");

        if (Freightadrecup1) {
        if (Freightadrec1 == 1) {
        Freightadrecup1.value = "Inclusive";
            } else if (Freightadrec1 == 2) {
        Freightadrecup1.value = "Exclusive";
            } else {
        Freightadrecup1.value = "";
            }
         }*/
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

        // Append packing data
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
		                <input type="text" class="form-control form-control-sm small-input"
		                       value="${item.uom_name}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"
		                       value="${Number(item.qty).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"
		                       value="${Number(item.per_kgs).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"
		                       value="${Number(item.unit_price).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Total</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"
		                       value="${Number(item.total).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input"
		                       value="${item.scrap_name_type_id}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Milestone</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input"
		                       value="${item.milestone_name}" readonly>
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
		        <hr style="width:100%;border-top:1px solid #ccc;">
		    `);
        });

        // Append tax data
  /*      taxData.forEach((tax) => {
            $(".dynamic-row122test").append(`
                <div class="row align-items-center mb-1">
                    <div class="col-auto"><label class="small-label1">Tax Name</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_name}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax %</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_per}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax Value</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_value}" readonly>
                    </div>
                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
                    </div>
                </div>
                <hr style="width:120%;border-top:1px solid #ccc;">
            `);
        });
*/

// Display saved tax details in disabled mode
const taxContainer = $(".dynamic-row122test");
taxContainer.empty();

const taxMasterUrl = new URL("/jssl/taxmasters/list", baseUrl);

const taxResponse = await fetch(taxMasterUrl, {
    method: "GET",
    credentials: "include"
});

if (!taxResponse.ok) {
    throw new Error("Failed to fetch tax master data");
}

const taxMasterJson = await taxResponse.json();
const masterTaxes = taxMasterJson?.Data || [];

taxData.forEach((tax, index) => {

    const matchedTax = masterTaxes.find(
        item => Number(item.tax_id) === Number(tax.tax_id)
    );

    if (!matchedTax) {
        console.warn("Tax master record not found for ID:", tax.tax_id);
        return;
    }

    taxContainer.append(`
        <div class="row align-items-center mb-1">

            <div class="col-auto">
                <label class="small-label1">Tax Name</label>
                <input type="text"
                       class="form-control form-control-sm small-input1"
                       value="${matchedTax.tax_name || ''}"
                       disabled>
            </div>

            <div class="col-auto">
                <label class="small-label1">Tax %</label>
                <input type="text"
                       class="form-control form-control-sm small-input1 text-right"
                       value="${matchedTax.tax_per ?? ''}"
                       disabled>
            </div>

            <div class="col-auto">
                <label class="small-label1">Tax Value</label>
                <input type="text"
                       class="form-control form-control-sm small-input1 text-right"
                       value="${tax.tax_value ?? 0}"
                       disabled>
            </div>

        </div>

        <hr style="width:120%;border-top:1px solid #ccc;">
    `);
});
		
		const invTypeName = packingData.length > 0 ? (packingData[0].invoice_remarks_type_name || "") : "";
				$('#subcontractingFieldsView').toggle(invTypeName.toLowerCase() === "subcontracting");
		fetchLotnumberverfied(selectedFactoryId, contract_id, invoiceData.lot_id);
        // Show the modal
        $("#exampleModalScrollableVerified").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
}

function toDateInputValue(v) {
    if (!v) return "";
    return String(v).split(" ")[0]; // "2026-08-01 00:00:00.0" -> "2026-08-01"
}

async function editRecordInvoice(id) {

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}

    try {
        const url = new URL(`/jssl/invoice/searchdlyidnew`, baseUrl);
        url.searchParams.append('id', id);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        const packingData = json.QsPacking_Data || [];
      /*  const taxData = json.tax || [];*/
        const invoiceData = json.Invoice_Data || {};
        const GrandValue = json.Grand_Total_value || [];
        const ContData = json.Contractor_Data || [];
		const ContractMasterData = json.InvoiceContractMaster || {};
		const taxData = [1, 2, 3].map(number => ({
				    tax_id: ContractMasterData[`tax_id_${number}`] ?? "",
				    tax_value: ContractMasterData[`tax_value_${number}`] ?? 0
				}));

		      setInputValue("#vconslnoupdate", ContractMasterData.con_slno || invoiceData.contract_slno || "");
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
		$("#netamountup").val(invoiceData.payable_by_customer ?? 0);
		$("#totaltaxup").val(invoiceData.payable_to_dept ?? 0);

        // Set "freight" value
        //setInputValue("#vfreight11up", packingData.length > 0 ? packingData[0].freight : "");
        setInputValue("#pnverifywwup", packingData.length > 0 ? packingData[0].pn_id : "");
        setInputValue("#intypeeditup", packingData.length > 0 ? packingData[0].invoice_type_id : "");
		$('#intypeeditup').trigger('change.select2');
        setInputValue("#contarctsch", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");

        // Set grand total value
        setInputValue("#grandvup", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        // Set contractor data fields
        const contractorFields = {
            "#bunitvup": "business_unit_name",
            //"#intypevup": "invoice_type_calculation",
            "#intovup": "invoice_to_id_value",
            //"#prodesvup": "product_desc_id",
            "#shipmodevup": "shipment_mode_id_value",
            "#workordervup": "work_id_value",
            "#exptvup": "export",
            //"#taxresvup": "tax_payable",
            "#percenvup": "percentage_value",
            "#nandconvup": "consignee_id_value",
            "#banknamevup": "bank_details_id_value",
            "#deliveryconvup": "delivery_condition_id_value",
            "#officevvup": "reg_office_id_value",
            //"#vingrandvup": "tax_ex_inc",
            //"#advFup": "freight_advance_recovery",
            "#arevup": "area_no",
            "#lutvup": "lot_no",
            "#connumvup": "containter_no",
            "#epogvup": "epcgno",
            "#exptitlevup": "export_title",
            "#newhcode": "h_code_value",
            "#newscode": "s_code_value",
        };

        const InvoiceTypeCal =
            ContData.length > 0 ? ContData[0].invoice_type_calculation : null;

        const InvoiceTypeVup = document.getElementById("intypevup");

        if (InvoiceTypeVup) {
            if (InvoiceTypeCal == 1) {
                InvoiceTypeVup.value = "Amount";
            } else if (InvoiceTypeCal == 2) {
                InvoiceTypeVup.value = "Percentage";
            } else {
                InvoiceTypeVup.value = "";
            }
        }

        const Producttype =
            ContData.length > 0 ? ContData[0].product_desc_id : null;

        const Producttypeup = document.getElementById("prodesvup");

        if (Producttypeup) {
            if (Producttype == 1) {
                Producttypeup.value = "Product desc";
            } else if (Producttype == 2) {
                Producttypeup.value = "pd";
            } else {
                Producttypeup.value = "";
            }
        }
		
		const contract_id =  ContData[0].contract_id;

        const Taxpayable =
            ContData.length > 0 ? ContData[0].tax_payable : null;

        const Taxpayableup = document.getElementById("taxresvup");

        if (Taxpayableup) {
            if (Taxpayable == 1) {
                Taxpayableup.value = "No";
            } else if (Taxpayable == 2) {
                Taxpayableup.value = "Yes";
            } else {
                Taxpayableup.value = "";
            }
        }

        /*const Taxexin =
            ContData.length > 0 ? ContData[0].tax_ex_inc : null;

            const Taxexinup = document.getElementById("vingrandvup");

            if (Taxexinup) {
            if (Taxexin == 1) {
            Taxexinup.value = "Exclusive";
            } else if (Taxexin == 2) {
            Taxexinup.value = "Inclusive";
            } else {
                Taxexinup.value = "";
            }
               }
               
        const Freightadrec =
            ContData.length > 0 ? ContData[0].freight_advance_recovery : null;

            const Freightadrecup = document.getElementById("advFup");

        if (Freightadrecup) {
        if (Freightadrec == 1) {
        Freightadrecup.value = "Inclusive";
            } else if (Freightadrec == 2) {
        Freightadrecup.value = "Exclusive";
            } else {
        Freightadrecup.value = "";
            }
         }*/

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
        packingData.forEach((item, index) => {

            const showLabel = index === 0;
	/*		const serviceOptions = serviceMasterList.map(s => `
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
			    `).join("");*/
				
				
				
				
				
				
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
		        <div class="row align-items-center mb-1">
		            
		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">UOM</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input"
		                       value="${item.uom_name}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"
		                       value="${Number(item.qty).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"
		                       value="${Number(item.per_kgs).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"
		                       value="${Number(item.unit_price).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Total</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"
		                       value="${Number(item.total).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input"
		                       value="${item.scrap_name_type_id}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Milestone</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input"
		                       value="${item.milestone_name}" readonly>
		            </div>
					<div class="form-group col-md-2 col-sm-12">
						                ${showLabel ? '<label class="small-label">Service Code</label>' : ''}
						                <select class="form-control form-control-sm service-code-select" data-slno="${item.slno}">
						                    <option value=" ">Select Service Code</option>
						                    ${serviceOptions}
						                </select>
										<div class="error-message service-code-error"></div>
						            </div>
						            <div class="form-group col-md-2 col-sm-12">
						                ${showLabel ? '<label class="small-label">HSN Code</label>' : ''}
						                <select class="form-control form-control-sm hsn-code-select" data-slno="${item.slno}">
						                    <option value=" ">Select HSN Code</option>
						                    ${hsnOptions}
						                </select>
						            </div>
		        </div>
		        <hr style="width:100%;border-top:1px solid #ccc;">
		    `);
        });
		
		initRowCodeSelect2('#exampleModalScrollableEditUp .dynamic-row11uptest');

        // Append tax data
/*        taxData.forEach((tax) => {
            $(".dynamic-row122up").append(`
                <div class="row align-items-center mb-1">
                    <div class="col-auto"><label class="small-label1">Tax Name</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_name}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax %</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_per}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax Value</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_value}" readonly>
                    </div>
                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
                    </div>
                </div>
                <hr style="width:120%;border-top:1px solid #ccc;">
            `);
        });
		*/
		
		await renderEditableDlyTaxes(taxData);
		fetchLotnumberUpdate(selectedFactoryId, contract_id, invoiceData.lot_id);
		console.log("teh lot no is this",invoiceData.lot_id);
		toggleSubcontractingFieldsUp(); 
        // Show the modal
        $("#exampleModalScrollableEditUp").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
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
    var showError = false; // Initialize showError variable

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
        $('#exampleModalCenter66Verify').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addeventVerify() {
	$('#exampleModalCenter66Verify').modal('hide');
    // Collect tax_id, tax_per, and tax_value as comma-separated values
    let taxIds = [];
    let taxPers = [];
    let taxValues = [];
    let taxAdv = [];
    let taxPtd = [];
    let taxPbc = [];

    $(".dynamic-row122 .row").each(function() {
        let taxId = $(this).find("input[value][type='text']").eq(6).val(); // Getting tax_id (hidden input)
        let taxPer = $(this).find("input[value][type='text']").eq(1).val(); // Getting tax percentage
        let taxValue = $(this).find("input[value][type='text']").eq(3).val(); // Getting tax amount
        let taxAdven = $(this).find("input[value][type='text']").eq(2).val();
        let taxPtdValue = $(this).find("input[value][type='text']").eq(4).val();
        let taxPbcValue = $(this).find("input[value][type='text']").eq(5).val();

        if (taxId) taxIds.push(taxId);
        if (taxPer) taxPers.push(taxPer);
        if (taxValue) taxValues.push(taxValue);
        if (taxAdven) taxAdv.push(taxAdven);
        if (taxPtdValue) taxPtd.push(taxPtdValue);
        if (taxPbcValue) taxPbc.push(taxPbcValue);
    });

    $.ajax({
        url: new URL('/jssl/invoice/verificationdlynew', baseUrl),
        type: 'POST',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
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
            tax_payable_by_customer: taxPbc.join(","),
            tax_payable_to_dept: taxPtd.join(","),
            id: vidverify.value,
            gst_remarks: remarkvvei.value,
            pn_id: pnverifyww.value,
            tax_id: taxIds.join(","),   // Pass as comma-separated values
            tax_per: taxPers.join(","), // Pass as comma-separated values
            tax_value: taxValues.join(",") // Pass as comma-separated values
        }),
        success: function(data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Delivery challan Invoice Verified Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ChallanInvoiceEntry.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create invoice.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
                $('#exampleModalCenter66Verify').modal('hide');
                $('#exampleModalScrollableVerify').modal('hide');
            }
        },
        error: function() {
            console.error('Request failed.');
        }
    });
}

/*function openModalUpdate() {
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
}*/

function openModalUpdate() {
    let showError = false;

    function required(id, errId, msg) {
        if (String($('#' + id).val() || '').trim() === '') {
            setFieldError(errId, msg); showError = true;
        } else setFieldError(errId, '');
    }

    required('bunitvup',     'bunitvupErr',     'Please select Business Unit.');
    required('intovup',      'intovupErr',      'Please select Invoice To.');
    required('workordervup', 'workordervupErr', 'Please select Work Order.');
    required('nandconvup',   'nandconvupErr',   'Please select Name & Address of Consignee.');
    required('prodesv11up',  'intypedes',       'Please enter product description.');
    required('remarkvup',    'intyperem',       'Please enter remarks.');

    $('#exampleModalScrollableEditUp .dynamic-row11uptest .service-code-select').each(function () {
        const svc = String($(this).val() || '').trim();
        const hsn = String($(this).closest('.row').find('.hsn-code-select').val() || '').trim();
        const $err = $(this).closest('.form-group').find('.service-code-error');
        if (svc === '' && hsn === '') {
            $err.text('Please select either HSN Code or Service Code.').css('display', 'inline-block');
            showError = true;
        } else {
            $err.text('').hide();
        }
    });

    if (!showError) $('#exampleModalCenter66Editup').modal('show');
}




function addeventudate() {
    $('#exampleModalCenter66Editup').modal('hide');

    const slno = [];
    const service_code_id = [];
    const hsn_code_id = [];
	const selectedlot_id = document.getElementById("lotnumup").selectedOptions[0]; // Get the selected option
	const lot_id = selectedlot_id ? selectedlot_id.value : ''; 
	const lot_no = selectedlot_id ? selectedlot_id.text : ''; 
    // Scoped strictly to the Edit-Up modal's service/HSN rows,
    // so rows from the Add modal (or any other modal) never get swept in.
    $("#exampleModalScrollableEditUp .dynamic-row11uptest .service-code-select").each(function () {
        const rowSlno = $(this).data("slno");

        const hsn = $(this)
            .closest(".row")
            .find(".hsn-code-select")
            .val();

        // Skip rows with no slno - these are stray/unrelated selects that
        // shouldn't be sent to the server at all.
        if (rowSlno === undefined || rowSlno === null || rowSlno === "") {
            return;
        }

        slno.push(rowSlno);
        service_code_id.push($(this).val());
        hsn_code_id.push(hsn);
    });

    console.log("Update payload -> slno:", slno, "service_code_id:", service_code_id, "hsn_code_id:", hsn_code_id);

    $.ajax({
        url: new URL('/jssl/invoice/updatdlyenew', baseUrl),
        type: 'POST',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
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
            type_id: intypeeditup.value,
            slno: slno,
            service_code_id: service_code_id,
            hsn_code_id: hsn_code_id,
			lot_id: lot_id,
			lot_no: lot_no,

            // ---- Vendor / subcontracting fields ----
            vendorname: vendornameup.value,
            vendorinvno: vendorinvnoup.value,
            vendorqty: vendorqtyup.value,
            vendorinvdate: vendordateup.value
                ? vendordateup.value.replace(/-/g, '')
                : '',

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
            regd_office_id: document.getElementById("officevvup").value,
			// Tax details from Update modal
			tax_id_1: $("#tax1addupp").val(),
			tax_value_1: $("#tax1valueupp").val(),

			tax_id_2: $("#tax2addupp").val(),
			tax_value_2: $("#tax2valueupp").val(),

			tax_id_3: $("#tax3addupp").val(),
			tax_value_3: $("#tax3valueupp").val(),

			// Payable amounts
			payable_by_customer: $("#netamountup").val(),
			payable_to_dept: $("#totaltaxup").val()
        }, true), // traditional=true -> slno=101&slno=102 instead of slno[]=101&slno[]=102

        success: function(data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Delivery challan Invoice updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ChallanInvoiceEntry.jsp';
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

function openModal(id, pn_id) {
	// const allowed = window.allowedActions || [];

	if (!allowed.includes("Release")) {
	  alert(" You do not have permission to release.");
	  return;
	}
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
        url: new URL('/jssl/invoice/dlyreleasebyidnew', baseUrl),
        type: 'POST',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: jQuery.param({
            id: id,
            factory_id: selectedFactoryId,
            released_by: createdById,
            pn_id: pn_id // Pass the pn_id here
        }),
        success: function(data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Delivery challan Invoice Released Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ChallanInvoiceEntry.jsp';
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

/*async function printRecord(id) {
    try {
        const url = new URL(`/jssl/invoice/searchdlyidnew?id=${id}`, baseUrl);
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
         const work_date = Contractor_Data[0].work_date;
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
         padding: 5px;
         margin-top:13%;
        }
        .invoice-container1 {
         width: 100vw;
         max-width: 1200px;
         border: 1px solid #000;
         padding: 5px;
         margin-top:33%;
        }
        .invoice-container2 {
         width: 100vw;
         max-width: 1200px;
         border: 1px solid #000;
         padding: 5px;
         margin-top:35%;
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
            <div class="gst-text">Delivery Challan</div>
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
            <tbody class="hide-in-print">
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
            <tbody class="hide-in-print">
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
            <tbody class="hide-in-print">
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
            <div class="gst-text">Delivery Challan</div>
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
            <tbody class="hide-in-print">
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
            <tbody class="hide-in-print">
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
            <tbody class="hide-in-print">
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
            <div class="gst-text">Delivery Challan</div>
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
            <tbody class="hide-in-print">
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
            <tbody class="hide-in-print">
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
            <tbody class="hide-in-print">
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
     printElement.querySelector('#dateor').textContent = work_date;
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
               doc.save(`Delivary_challan_${invoiceno}.pdf`);
            },
            x: 6,
            y: 6,
            width: 165,
            windowWidth: 1000
         });
         // Clone original content (IMPORTANT – so screen view is not affected)
         const clone = printElement.cloneNode(true);

         // Remove elements you don’t want in PDF
         clone.querySelectorAll('.hide-in-print').forEach(el => el.remove());

         const doc = new window.jspdf.jsPDF();

         doc.html(clone, {
             callback: function (doc) {
                 doc.save(`Delivary_challan_${invoiceno}.pdf`);
             },
             x: 6,
             y: 6,
             width: 165,
             windowWidth: 1000
         });
         

    } catch (error) {
        console.error('Error generating PDF:', error);
    }
    
}*/





async function printRecord(id) {
    if (!allowed.includes("Print")) {
        alert("You do not have permission to print.");
        console.warn("Blocked print attempt. User lacks Print permission.");
        return;
    }

    showLoader();
	
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

	function formatWeight(value) {
	    if (!value && value !== 0) return '';
	    const num = parseFloat(String(value).replace(/,/g, ''));
	    if (isNaN(num)) return value;
	    return num.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
	}
	
    try {
        const url = new URL(`/jssl/invoice/searchdlyidnew?id=${id}`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch data");

        const json = await response.json();
        const Invoice_Data      = json.Invoice_Data;
        const Contractor_Data   = json.Contractor_Data;
        const QsPacking_Data    = json.QsPacking_Data;
        const tax               = json.tax;
        const Grand_Total_value = json.Grand_Total_value;
        // ---- NEW: resolve Invoice To / Consignee / Work Order from InvoiceContractMaster, fallback to Contractor_Data ----
		let masterTaxes = [];

		const taxMasterUrl = new URL("/jssl/taxmasters/list", baseUrl);

		const taxMasterResponse = await fetch(taxMasterUrl, {
		    method: "GET",
		    credentials: "include"
		});

		if (!taxMasterResponse.ok) {
		    throw new Error("Failed to fetch tax master data");
		}

		const taxMasterJson = await taxMasterResponse.json();

		masterTaxes = taxMasterJson?.Data || [];

		// Normalize InvoiceContractMaster
		const ContractMasterRaw = json.InvoiceContractMaster || {};

		const ContractMasterData = Array.isArray(ContractMasterRaw)
		    ? (ContractMasterRaw[0] || {})
		    : ContractMasterRaw;

		// Prepare saved tax details
		const printTaxData = [1, 2, 3]
		    .map(number => {
		        const taxId = ContractMasterData[`tax_id_${number}`];
		        const taxValue = ContractMasterData[`tax_value_${number}`];

		        if (!taxId) return null;

		        const masterTax = masterTaxes.find(
		            item => String(item.tax_id) === String(taxId)
		        );

		        return {
		            tax_name: masterTax?.tax_name || "",
		            tax_per: masterTax?.tax_per || 0,
		            tax_value: taxValue ?? 0
		        };
		    })
		    .filter(Boolean);

        const matchedInvoiceTo = invoiceAddressList.find(a => String(a.id) === String(ContractMasterData.invoice_to_id));
        const resolvedInvoiceTo = matchedInvoiceTo
            ? matchedInvoiceTo.address
            : Contractor_Data[0].invoice_to_id_value;

        const matchedConsignee = consigneeAddressList.find(c => String(c.id) === String(ContractMasterData.consignee_id));
        const resolvedConsignee = matchedConsignee
            ? matchedConsignee.address
            : Contractor_Data[0].consignee_id_value;

        const matchedWork = workOrderList.find(w => String(w.work_id) === String(ContractMasterData.work_id));
        const resolvedWork = matchedWork
            ? matchedWork.workorder_no
            : Contractor_Data[0].work_id_value;
			
			
			// ---- NEW: pick source for GST / PAN / State / District / Pin (same rule as address) ----
			const cd0 = Contractor_Data[0] || {};
			const t   = v => (v == null ? '' : String(v).trim());

			const invSrc = matchedInvoiceTo ? ContractMasterData : cd0;   // Invoice To
			const conSrc = matchedConsignee ? ContractMasterData : cd0;   // Consignee
			// ---- END NEW ----
			
			
			
			
			
			

        function cleanBusinessUnitAddress(name) {
            if (!name) return '';
            return name
                .replace(/^JBU-\d+\s*/i, '')                                    // remove "JBU-16 "
                .replace(/^JSW\s+Severfield\s+Structures\s+Limited\s*/i, '')    // remove company name
                .trim();
        }

        const matchedBU = businessUnitList.find(b => String(b.business_unit_id) === String(ContractMasterData.bid));
        const resolvedbudisplay = matchedBU
            ? `${cleanBusinessUnitAddress(matchedBU.business_unit_name)},${matchedBU.district || ''}-${matchedBU.pinNo || ''}<br>${matchedBU.location || ''}`
            : (Contractor_Data.length > 0 ? cleanBusinessUnitAddress(Contractor_Data[0].business_unit_name) : "");
        // ---- END NEW ----

        const Grand_Total_tax       = Grand_Total_value[0].Grand_Total_tax;
        const Total_adv_tax_Taxable = Grand_Total_value[0].Total_adv_tax_Taxable;
        const Tax_Final_total       = Grand_Total_value[0].Tax_Final_total;
        const PBC_Final_total       = Grand_Total_value[0].PBC_Final_total;

        const invoiceno   = Invoice_Data.invoice_no;
        const lr_docketno = Invoice_Data.lr_docketno;
        const date_val    = Invoice_Data.date_val;
        //const factory_id  = Invoice_Data.factory_id;
        const cancel      = Invoice_Data.cancel;
        const productdesc = Invoice_Data.product_desc;

        // ── Factory Data ──────────────────────────────────────────────────────
        const url_factory      = new URL(`/jssl/factory/getAllFactoryListSS`, baseUrl);
        const response_factory = await fetch(url_factory, { method: "GET", credentials: "include" });
        if (!response_factory.ok) throw new Error("Failed to fetch factory data");
        const factory_json = await response_factory.json();

        const factory_data_map     = factory_json.FactoryDetails;
        //const FactoryDataBasedById = factory_data_map.find(f => f.id === factory_id);
        const MumbaiAddress        = factory_data_map.find(f => f.id === "4");

        const reg_addresss    = MumbaiAddress.address;
        // ── Business Unit Address (cleaned, trimmed, no stray commas) ──────────
        const address = Contractor_Data[0].businessUnitName
            .split(',')
            .slice(1)
            .map(x => x.trim())
            .filter(x => x !== "")
            .join(', ');

        /*const factory_Address = address;*/
        const bid = resolvedbudisplay;
        // const factory_Address = FactoryDataBasedById.address;
        // ── Business Unit State Code / GSTIN / PAN (pulled from Contractor_Data) ─
        const state_Code     = ContractMasterData.state_id;
        const Gst_Code       = ContractMasterData.gst_number;
        const Pan_Code       = ContractMasterData.pan_number;

        // ── Contractor / Invoice Fields ───────────────────────────────────────
        const invoice_to_id_value         = resolvedInvoiceTo;
        const tax_payable                 = Contractor_Data[0].tax_payable == 1 ? "No" : "Yes";
        const area_no                     = Contractor_Data[0].area_no;
        const lot_no                      = Contractor_Data[0].lot_no;
        const containter_no               = Contractor_Data[0].containter_no;
        const epcgno                      = Contractor_Data[0].epcgno;
        const shipment_mode_id_value      = Contractor_Data[0].shipment_mode_id_value;
        const delivery_condition_id_value = Contractor_Data[0].delivery_condition_id_value;
        const consignee_id_value          = resolvedConsignee;
        const work_id_value               = resolvedWork;
     /*   const invoiceStateName            = Contractor_Data[0].invoiceStateName;
        const consigneeStateName          = Contractor_Data[0].consigneeStateName;
        const invoiceStateCode            = Contractor_Data[0].invoiceStateCode;
        const consigneeStateCode          = Contractor_Data[0].consigneeStateCode;
        const invoiceGstNo                = Contractor_Data[0].invoiceGstNo;
        const consigneeGstNo              = Contractor_Data[0].consigneeGstNo;
        const invoicePanNo                = Contractor_Data[0].invoicePanNo;
        const consigneePanNo              = Contractor_Data[0].consigneePanNo;*/
		const invoiceStateName   = t(invSrc.invoiceStateName);
		const consigneeStateName = t(conSrc.consigneeStateName);
		const invoiceStateCode   = t(invSrc.invoiceStateCode);
		const consigneeStateCode = t(conSrc.consigneeStateCode);
		const invoiceGstNo       = t(invSrc.invoiceGstNo);
		const consigneeGstNo     = t(conSrc.consigneeGstNo);
		const invoicePanNo       = t(invSrc.invoicePanNo);
		const consigneePanNo     = t(conSrc.consigneePanNo);
        const bankName                    = Contractor_Data[0].org_name;
        const account_number              = Contractor_Data[0].account_number;
        const branch_address              = Contractor_Data[0].bankName + ' ' + Contractor_Data[0].branch_address;
        const branch_code                 = Contractor_Data[0].branch_code;
        const swift_code                  = Contractor_Data[0].swift_code;
        const ifsc_code                   = Contractor_Data[0].ifsc_code;
        const work_date                   = Contractor_Data[0].work_date;

        const transport_name       = QsPacking_Data[0].transport_name;
        const vechile_no           = QsPacking_Data[0].vechile_no;
       /* const con_code_with_lot_no = Invoice_Data.con_code_with_lot_no;*/
	   const con_code_with_lot_no =
	       QsPacking_Data[0].invoice_remarks_type_name === "JOB WORK"
	           ? "JOBWORK/" + Invoice_Data.con_code_with_lot_no
	           : Invoice_Data.con_code_with_lot_no;

        const freight     = tax[0].freight;
        const total_kgs   = tax[0].total_kgs;
        const total_qty   = tax[0].total_qty;
        const basic_value = tax[0].basic_value;

        const items          = json.QsPacking_Data || [];
        const taxData        = json.tax || [];
        const InvoiceData    = json.Invoice_Data || [];
        const grandTotalData = json.Grand_Total_value?.[0] || {};

        const grandTotalInWords = grandTotalData.GrandTotalInWords || '';
        const grandTotalTax     = grandTotalData.Grand_Total_tax   || '';
        const gstremarks        = InvoiceData.gst_remarks          || '';
        const advremarks        = taxData[0]?.taxable              || '';
        const advremarksnon     = taxData[0]?.non_taxable          || '';
        const basicValue        = taxData[0]?.basic_value          || '';
        const basicValuecos     = taxData[0]?.optc                 || '';

        // ── Product Table Rows ────────────────────────────────────────────────
        const maxRows = 9;
        let tableRows = "";

        items.forEach((item, index) => {
            tableRows += `
                <tr class="product-row">
                    <td colspan="1" style="text-align:right;">${index + 1}</td>
                    <td colspan="4" class="desc-col descri">${item.scrap_name_type_id || ''}</td>
                    <td colspan="1" style="text-align:right !important; white-space: nowrap; font-size: 9px;">${[item.scode, item.hsncode].filter(Boolean).join('/')}</td>
                    <td colspan="1" style="text-align:left !important;">${item.uom_name || ''}</td>
                    <td colspan="1" class="qtys">${item.qty || ''}</td>
                    <td colspan="2" class="weits">${formatWeight(item.per_kgs)}</td>
                    <td colspan="1" class="prs">${formatAmount(item.unit_price) || ''}</td>
                    <td colspan="2" class="tols">${formatAmount(item.total) || ''}</td>
                </tr>`;
        });

        const emptyCount = Math.max(0, maxRows - items.length);
        for (let i = 0; i < emptyCount; i++) {
            if (i === 1) {
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

        // ── Tax Rows ──────────────────────────────────────────────────────────
/*        let taxRows = taxData.map((tax, i, arr) => {
            const isLast = i === arr.length - 1;
            return `
                <tr>
                    <td colspan="10" class="tax-name" style="${isLast ? '' : 'border-bottom:none;'}">
                        ${i === 0 && gstremarks ? `<span style="float:left;text-align:left;">${gstremarks}</span>` : ''}
                        ${tax.tax_name || ''}
                    </td>
                    <td colspan="1" class="tax-per" style="${isLast ? '' : 'border-bottom:none;'}">
                        ${tax.tax_per || ''} %
                    </td>
                    <td colspan="2" class="tax-per" style="${isLast ? '' : 'border-bottom:none;'}">
                        ${formatAmount(tax.tax_value)}
                    </td>
                </tr>`;
        }).join('');*/
		// Tax Rows - use saved tax details from InvoiceContractMaster
		let taxRows = printTaxData.map((tax, i, arr) => {
		    const isLast = i === arr.length - 1;

		    return `
		        <tr>
				<td colspan="10" class="tax-name"
					                style="${isLast ? '' : 'border-bottom:none;'}">
									${i === 0 && gstremarks ? `<span style="float:left;text-align:left;">${gstremarks}</span>` : ''}
					                ${tax.tax_name || ''}
					            </td>

		            <td colspan="1" class="tax-per"
		                style="${isLast ? '' : 'border-bottom:none;'}">
		                ${tax.tax_per || 0} %
		            </td>

		            <td colspan="2" class="tax-per"
		                style="${isLast ? '' : 'border-bottom:none;'}">
		                ${formatAmount(tax.tax_value)}
		            </td>
		        </tr>
		    `;
		}).join('');

        // ── Tax Description Blocks ────────────────────────────────────────────
      /*  let taxDetails      = taxData.map(tax => `<b>${tax.tax_name}:</b> ${tax.tax_value_in_words}<br>`).join('');*/
	  let taxDetails = printTaxData.map(tax =>
	      `<b>${tax.tax_name}:</b> ${numberToIndianWords(tax.tax_value)}<br>`
	  ).join('');
        let taxDetailsNew   = taxData.map(tax => `<b>${tax.tax_name}</b><br>`).join('');
        let taxPerValue     = taxData.map(tax => `<b>${tax.tax_per}</b><br>`).join('');
        let taxValue        = taxData.map(tax => `<b>${formatAmount(tax.tax_value)}</b><br>`).join('');
        let taxValuedept    = taxData.map(tax => `<b>${formatAmount(tax.ptc)}</b><br>`).join('');
        let taxValuecos     = taxData.map(tax => `<b>${formatAmount(tax.ptc)}</b><br>`).join('');
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

                .page { position: relative; }

                html, body {
                    margin: 0;
                    padding: 0;
                    font-family: "Times New Roman", Times, serif;
                    color: black !important;
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
                   
                }

                .copy-label { font-size: 12px; font-weight: normal; }

                td br, th br { display: block; margin: 0; line-height: 1; }

                .company-details-table td { padding: 4px; font-size: 11px !important; }

                .company-logo img { width: 60px; height: auto; display: block; margin-bottom: 2px; }

                .product-row td:nth-child(n+4) { text-align: right !important; }

                .product-row td,
                .empty-row td { height: 22px; }

                .empty-row td { border-top: none !important; border-bottom: none !important; }

                .last-product td { border-bottom: none !important; }

                .product-table .desc-col {
                    line-height: 1.5 !important;
                    white-space: normal;
                    word-break: break-word;
                }

                .product-table .fright-row .fright-data { line-height: 1.6 !important; padding: 5px !important; }

                .total-body .total-datatd  { line-height: 1.6 !important; padding: 5px !important; }
                .total-body .total-datatds { line-height: 2.5 !important; text-align: right !important; }

                .desc-col.descri { font-size: 7px !important; padding: 1px !important; }
                .desc-col.tols   { text-align: right !important; }
                .desc-col.prs    { text-align: right !important; }
                .desc-col.weits  { text-align: right !important; }
                .desc-col.qtys   { text-align: right !important; }

                .product-table th,
                .product-table td { padding: 3px 5px; line-height: 1.2; }

                .product-row td { border-bottom: none; }

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

                .header, .footer, .gst-text, .copy-label { text-align: center; }

                .fulladdress,
                .conaddress,
                .facotry_address {
                    white-space: pre-line;
                    display: inline-block;
                    line-height: 1.5;
                }
            </style>

            <div class="invoice-container">
                ${cancel === 'true' ? `<div class="watermark cancelled">CANCELLED</div>` : ''}

                <div class="invoice-header">
                    <b>   </b>
                    <div class="gst-text">DELIVERY CHALLAN</div>
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
                                <div style="font-size:12px;"><b>Invoice No: </b><span class="invoiceNumber"></span></div>
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
                            <b>Invoice To :<br>
                            <span class="shipto11"></span></b><br>
                            <span class="shipto11add2"></span><br>
                            <span class="shipto11add3"></span>
                            <span class="fulladdress" style="white-space:pre-line;"></span><br><br>
                            <b>Place of Supply : <span class="placeofsupply"></span></b><br><br>
                            <b>
                                Name of the State : <span class="statename"></span><br>
                                State Code : <span class="stcode11"></span><br>
                                GSTIN : <span class="ingst"></span><br>
                                PAN : <span class="panin"></span><br>
                            </b>
                        </td>
                        <td colspan="6" style="font-size:10px; line-height:1.3;">
                            <b>Name &amp; Address of consignee:<br>
                            <span class="conname"></span></b><br>
                            <span class="conname1"></span><br>
                            <span class="conname2"></span><br>
                            <span class="conaddress" style="white-space:pre-line;"></span><br><br>
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
                            <b>Date of Notification</b><br>
                            <b>Exempted note under:</b><br>
                            <b>Tax is Payable on reverse charge (Yes/No):</b> <span class="taxpayre"></span><br>
                        </td>
                        <td colspan="3" style="font-size:7px;">
                            <b>Export Details:</b><br>
                            <b>ARE No:</b> <span class="areano"></span><br>
                            <b>LUT No:</b> <span class="lutno"></span><br>
                            <b>Container No:</b> <span class="contlo"></span><br>
                            <b>EPCG License No:</b> <span class="epoglo"></span><br>
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
                    <tbody>
                        <tr class="fright-row">
                            <td class="fright-data" colspan="11"><span>Freight</span><br></td>
                            <td class="fright-data freight-vlaue" colspan="2"><span class="freight"></span><br></td>
                        </tr>
                    </tbody>
                    <tbody class="total-body">
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
                    <tbody style="display:none;">
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
                    <tbody style="display:none;">
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
                    <tbody style="display:none;">
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
                                <span> &nbsp; BANK NAME &amp; ADDRESS: </span><b class="bname"></b>
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

            const setContent = (selector, value) => {
                const el = container.querySelector(selector);
                if (el) el.textContent = value || '';
            };

            // FACTORY DETAILS
            container.querySelector(".reg_add").textContent    = reg_addresss;
            container.querySelector(".gst_code").textContent   = Gst_Code;
            container.querySelector(".state_code").textContent = state_Code;
            container.querySelector(".pan_code").textContent   = Pan_Code;
            container.querySelector('.bid').innerHTML = bid;

            // INVOICE HEADER
            setContent('.datetime',      formattedDateTime);
            setContent('.dateor',        formatDMY(work_date));
            setContent('.date',          currentDate);
            setContent('.invoiceNumber', invoiceno);

            // ── INVOICE TO — split by line breaks ────────────────────────────
            const invoiceToValue = invoice_to_id_value || '';
            const invoiceLines   = invoiceToValue.split(/\r?\n/);

            setContent('.shipto11',     invoiceLines[0] || '');
            setContent('.shipto11add2', invoiceLines[1] || '');
            setContent('.shipto11add3', invoiceLines[2] || '');

       /*     const districtAndPin = [
                Contractor_Data[0].invoiceDistrict,
                Contractor_Data[0].invoicePinNo
            ].filter(x => x && x.toString().trim() !== "").join("-");*/
			
			const districtAndPin = [
			    invSrc.invoiceDistrict,
			    invSrc.invoicePinNo
			].filter(x => x && x.toString().trim() !== "").map(x => x.toString().trim()).join("-");

            const invoiceAddress = [
                Invoice_Data.addressLine1up,
                Invoice_Data.addressLine2up,
                Invoice_Data.addressLine3up,
                districtAndPin
            ].filter(x => x && x.toString().trim() !== "").join("\n");

            container.querySelector('.fulladdress').textContent = invoiceAddress;

            setContent('.placeofsupply', Invoice_Data.supply_place || '');
            setContent('.statename',     invoiceStateName  || '');
            setContent('.stcode11',      invoiceStateCode  || '');
            setContent('.ingst',         invoiceGstNo      || '');
            setContent('.panin',         invoicePanNo      || '');

            // ── CONSIGNEE — split by line breaks ─────────────────────────────
            const consigneeValue = consignee_id_value || '';
            const consigneeLines = consigneeValue.split(/\r?\n/);

            setContent('.conname',  consigneeLines[0] || '');
            setContent('.conname1', consigneeLines[1] || '');
            setContent('.conname2', consigneeLines[2] || '');

       /*     const consigneeDistrictAndPin = [
                Contractor_Data[0].consigneeDistrict,
                Contractor_Data[0].consigneePinNo
            ].filter(x => x && x.toString().trim() !== "").join("-");*/
			
			const consigneeDistrictAndPin = [
			    conSrc.consigneeDistrict,
			    conSrc.consigneePinNo
			].filter(x => x && x.toString().trim() !== "").map(x => x.toString().trim()).join("-");

            const consigneeAddress = [
                Invoice_Data.conaddressLine1,
                Invoice_Data.conaddressLine2,
                Invoice_Data.conaddressLine3,
                consigneeDistrictAndPin
            ].filter(x => x && x.toString().trim() !== "").join("\n");

            container.querySelector('.conaddress').textContent = consigneeAddress;

            setContent('.state',   consigneeStateName || '');
            setContent('.stateco', consigneeStateCode || '');
            setContent('.congst',  consigneeGstNo     || '');
            setContent('.pancon',  consigneePanNo     || '');

            // TRANSPORT DETAILS
            setContent('.taxpayre', tax_payable);
            setContent('.areano',   area_no            || '');
            setContent('.contlo',   containter_no      || '');
            setContent('.lutno',    lot_no             || '');
            setContent('.epoglo',   epcgno             || '');
            setContent('.trans',    transport_name     || '');
            setContent('.lrdoc',    lr_docketno        || '');
            setContent('.lrdate',   date_val           || '');
            setContent('.shipmo',   shipment_mode_id_value      || '');
            setContent('.delcon',   delivery_condition_id_value || '');
            setContent('.workor',   work_id_value      || '');
            setContent('.vehino',   vechile_no         || '');
            setContent('.contrefno', con_code_with_lot_no || '');

            // TOTALS — all formatted with Indian commas
            setContent('.freight',        formatAmount(freight));
            setContent('.qtytotal',       total_qty || '');
            setContent('.wiegtotal',      total_kgs || '');
            setContent('.val11',          formatAmount(basic_value));
            setContent('.grandlast',      formatAmount(Grand_Total_tax));
            setContent('.grandlast12new', formatAmount(PBC_Final_total));
            setContent('.taxbasic',       formatAmount(Total_adv_tax_Taxable));
            setContent('.taxtotal',       formatAmount(Tax_Final_total));

            // BANK DETAILS
            setContent('.bankname', bankName       || '');
            setContent('.acc',      account_number || '');
            setContent('.bname',    branch_address || '');
            setContent('.code',     branch_code    || '');
            setContent('.scode',    swift_code     || '');
            setContent('.ifsc',     ifsc_code      || '');
        }

        // ── Auto-fit font size ────────────────────────────────────────────────
        function autoFitInvoice(container) {
            const invoice   = container.querySelector(".invoice-container");
            const maxHeight = 1000;
            let fontSize    = 9;

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

                        /* ── FIX: remove extra blank page ──────────────────────────
                           The template sets .page { height: 297mm } but the printable
                           area is only 277mm (A4 minus 10mm margins), so every page
                           overflowed and pushed an empty sheet. "body > .page" has
                           higher specificity than the template's ".page" rules, so
                           these win regardless of source order.
                        ------------------------------------------------------------ */
                        html, body { height: auto !important; }
                        body > .page {
                            height: auto !important;
                            min-height: 0 !important;
                            overflow: visible !important;
                            page-break-after: always !important;
                            break-after: page !important;
                        }
                        body > .page:last-child {
                            page-break-after: auto !important;
                            break-after: auto !important;
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
        console.error('Error generating PDF:', error);
    }
}

function openModalcancel(id, pn_id) {
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
    $('#exampleModalCenter16').attr('data-pn-id', pn_id);
}

function cancelRecord(id) {
	$('#exampleModalCenter16').modal('hide');
    // Store the id and pn_id in the modal's data attributes
    var id = $('#exampleModalCenter16').attr('data-id');
    var pn_id = $('#exampleModalCenter16').attr('data-pn-id');
    $.ajax({
        url: new URL('/jssl/invoice/challancancelbyidnew', baseUrl),   // cancel endpoint
        type: 'POST',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: jQuery.param({
            id: id,
            cancelled_by: createdById,
            factory_id: selectedFactoryId,
            pn_id: pn_id
        }),
        success: function(data) {

            var result = data.message;

            if (result === "Success") {

                const popup = $('<div class="popup"> Challan  Invoice Cancelled Successfully!</div>')
                    .appendTo('body')
                    .hide()
                    .fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'ChallanInvoiceEntry.jsp';
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


/*async function fetchLotnumber(factoryId, contractId) {
    try {
        const url = new URL(`/jssl/load/dlyload_id`, baseUrl);
        url.searchParams.append("factory", factoryId);
        url.searchParams.append("contract_id", contractId); // Pass selected contractor ID

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch loads");

        const json = await response.json();

        if (!json.data.length) {
            console.warn("No loads found.");
            return;
        }

        const selectElement = document.getElementById("lotnum");
        selectElement.innerHTML = `<option value="0">Select lot</option>`;

        json.data.forEach((type) => {
            if (type.tload_id) {
                const option = document.createElement("option");
                option.value = type.tload_id;
                option.textContent = type.loadno;  // <-- Add this line
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching loads:", error);
    }
}*/

async function fetchLotnumberUpdate(factoryId, contractId, selectedLotId) {
    try {
        const url = new URL(`/jssl/load/dlyload_idUp`, baseUrl);
        url.searchParams.append("factory", factoryId);
        url.searchParams.append("contract_id", contractId);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch loads");

        const json = await response.json();

        const selectElement = document.getElementById("lotnumup");
        selectElement.innerHTML = `<option value="0">Select lot</option>`;

        json.data.forEach((type) => {
            if (type.tload_id) {
                const option = document.createElement("option");
                option.value = type.tload_id;
                option.textContent = type.loadno;

                // ✅ Set selected here
                if (type.tload_id == selectedLotId) {
                    option.selected = true;
                }

                selectElement.appendChild(option);
            }
        });

    } catch (error) {
        console.error("Error fetching loads:", error);
    }
}


async function fetchLotnumberview(factoryId, contractId, selectedLotId) {
    try {
        const url = new URL(`/jssl/load/dlyload_idUp`, baseUrl);
        url.searchParams.append("factory", factoryId);
        url.searchParams.append("contract_id", contractId);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch loads");

        const json = await response.json();

        const selectElement = document.getElementById("lotnumver");
        selectElement.innerHTML = `<option value="0">Select lot</option>`;

        json.data.forEach((type) => {
            if (type.tload_id) {
                const option = document.createElement("option");
                option.value = type.tload_id;
                option.textContent = type.loadno;

                // ✅ Set selected here
                if (type.tload_id == selectedLotId) {
                    option.selected = true;
                }

                selectElement.appendChild(option);
            }
        });

    } catch (error) {
        console.error("Error fetching loads:", error);
    }
}

async function fetchLotnumberverfied(factoryId, contractId, selectedLotId) {
    try {
        const url = new URL(`/jssl/load/dlyload_idUp`, baseUrl);
        url.searchParams.append("factory", factoryId);
        url.searchParams.append("contract_id", contractId);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch loads");

        const json = await response.json();

        const selectElement = document.getElementById("lotnumverfied");
        selectElement.innerHTML = `<option value="0">Select lot</option>`;

        json.data.forEach((type) => {
            if (type.tload_id) {
                const option = document.createElement("option");
                option.value = type.tload_id;
                option.textContent = type.loadno;

                // ✅ Set selected here
                if (type.tload_id == selectedLotId) {
                    option.selected = true;
                }

                selectElement.appendChild(option);
            }
        });

    } catch (error) {
        console.error("Error fetching loads:", error);
    }
}

/*$(document).ready(function () {

    $("#invoice").change(function () {

        var invoiceType = $("#invoice option:selected").text().trim().toUpperCase();

        // Reference to Load dropdown
        const loadSelect = $("#load");

        if (invoiceType === "GP") {

            // Disable Contract
            $("#cont").prop("disabled", true);

            // Clear Load dropdown
            loadSelect.empty().append('<option value="">Select Load</option>');

            // Hide fields if required
            inputFieldsContainer.style.display = "none";

            // Fetch GP loads
            fetchGpLoad(selectedFactoryId);

        } else {

            $("#cont").prop("disabled", false);

            // Clear Load dropdown
            loadSelect.empty().append('<option value="">Select Load</option>');

            inputFieldsContainer.style.display = "none";

            // Existing load API
            fetchLoad(selectedFactoryId);
        }

    });

});
*/


$(document).ready(function () {
    $('#invoice').on('change.gp', function () {
        const invoiceType = $("#invoice option:selected").text().trim().toUpperCase();

        if (invoiceType === "GP") {
            $("#cont").prop("disabled", true);
            $('#load').html('<option value="">Select Load</option>');
            initSelect2('load', 'Select load');
            $('#inputFieldsContainer').hide();
            fetchGpLoad(selectedFactoryId);
        } else {
            $("#cont").prop("disabled", false);
            $('#inputFieldsContainer').hide();
        }
    });
});


async function fetchQsPackingDatagp(loadId) {
    try {
        const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get the factory_id from sessionStorage

        // Ensure factory_id is available
        if (!selectedFactoryId) {
            console.error("No factory ID found in sessionStorage.");
            return;
        }

        const url = new URL(`/jssl/invoice/getcontractdeliverychallanqspackingdetailsnewgp`, baseUrl);

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

            const pnidValue = QsPacking.pn_id; // Assuming the bank details ID is inside this property
            const pnid = document.getElementById("id11");
            if (pnid) {
                pnid.value = pnidValue; // Populate the bank name field
            }

        } else {
            console.warn("No qspacking Data found.");
        }
        // Check if QsPacking_Data exists and contains items
        if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {
            const container = document.querySelector(".dynamic-rowgp"); // Find the container for dynamic rows
            container.innerHTML = ""; // Clear any existing rows
            let grandTotal = 0; // 🔹 Initialize sum
            // Loop through QsPacking_Data and create input fields dynamically
            json.QsPacking_Data.forEach((item, index) => {
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
                               <input type="number" id="qty_${index}" value="${item.qty}" class="form-control form-control-sm small-input text-right" disabled>
                           </div>
						   
						   <div class="col-auto">
                                ${showLabel ? '<label><b>Kg</b></label>' : ''}
                               <input type="number" id="kg_${index}" value="${item.per_kgs}" class="form-control form-control-sm small-input text-right" disabled>
                           </div>
						   
						   <div class="col-auto">
                               ${showLabel ? '<label><b>Unit Price</b></label>' : ''}
                               <input type="number" id="unit_price_${index}" value="${item.unit_price}" class="form-control form-control-sm small-input text-right" disabled>
                           </div>
						   
						   <div class="col-auto">
                              ${showLabel ? '<label><b>Total</b></label>' : ''}
                               <input type="number" id="total_${index}" value="${item.total}" class="form-control form-control-sm small-input text-right" disabled>
                           </div>
						   
						   <div class="col-auto">
                               ${showLabel ? '<label><b>Invoice Type</b></label>' : ''}
                               <input type="text" id="intype_${index}" value="${item.scrap_name_type_id}" class="form-control form-control-sm small-input" disabled>
                           </div>
						   <div class="form-group col-md-2 col-sm-12">
						   					                ${showLabel ? '<label class="small-label">Service Code</label>' : ''}
						   					                <select class="form-control form-control-sm service-code-select" data-slno="${item.slno}">
						   					                    <option value="">Select Service Code</option>
						   					                    ${serviceOptions}
						   					                </select>
						   									<div class="error-message service-code-error"></div>
						   					            </div>
						   					            <div class="form-group col-md-2 col-sm-12">
						   					                ${showLabel ? '<label class="small-label">HSN Code</label>' : ''}
						   					                <select class="form-control form-control-sm hsn-code-select" data-slno="${item.slno}">
						   					                    <option value="">Select HSN Code</option>
						   					                    ${hsnOptions}
						   					                </select>
						   					            </div>
                     </div>
					 
					 ${showLabel ? '<hr>' : ''}
                   `;

                container.appendChild(div); // Append the new dynamic row
                // 🔹 After loop, show the grand total in a textbox
                const grandTotalBox = document.getElementById("grandTotalgp");
                if (grandTotalBox) {
                    grandTotalBox.value = grandTotal.toFixed(2); // 2 decimals
                    netAmountup.value = grandTotal.toFixed(2);
                }
            });
			
			initRowCodeSelect2('#inputFieldsContainergp');
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
        const totalNoInput = document.getElementById("grandTotalgp"); // Total Amount Field

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
        const totalNoInput = document.getElementById("grandTotalgp"); // Total Amount Field

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
        const totalNoInput = document.getElementById("grandTotalgp"); // Total Amount Field

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
                option.textContent = type.tax_name+ '-'+type.tax_per;;
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

/*async function fetchSalebusunit() {
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
        const selectElement = document.getElementById("inbusunitgp");

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
*/
/*async function fetchinvoiceto() {
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
        const selectElement = document.getElementById("inintogp");

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
}*/
/*async function fetchconname() {
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
        const selectElement = document.getElementById("billinggp");

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
}*/
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
        const selectElement = document.getElementById("shipmodegp");

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
        const selectElement = document.getElementById("deliverygp");

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
        const selectElement = document.getElementById("bankgp");

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

/*async function fetchSalework() {
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
        const selectElement = document.getElementById("workgp");

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
}*/

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
        const selectElement = document.getElementById("officegp");

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
        const selectElement = document.getElementById("extitlegp");

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
document.getElementById("exptgp").addEventListener("change", function() {
    const expo = document.getElementById("exptgp");
    const selectedexpo = expo.value;
    if (selectedexpo === 'yes') {
        $('#exportFieldsgp').show();
    } else {
        $('#exportFieldsgp').hide();
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
        const selectElement = document.getElementById("bggp");

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
async function saveServiceHsnSelections() {

	    const slnoList = [];
	    const serviceCodeList = [];
	    const hsnCodeList = [];

	    const serviceSelects = document.querySelectorAll(".dynamic-row .service-code-select, .dynamic-rowgp .service-code-select");

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

	        const url = new URL("/jssl/invoicemaster/updatedlyServiceHsnForItems", baseUrl);

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
	
	
	
	const selectErrorMap = {
	    intype444:    ['Vehicleerror'],
	    inbusunit:    ['busunitErr'],
	    ininto:       ['intoErr'],
	    work:         ['workErr'],
	    billing:      ['billingErr'],
	    bunitvup:     ['bunitvupErr'],
	    intovup:      ['intovupErr'],
	    workordervup: ['workordervupErr'],
	    nandconvup:   ['nandconvupErr']
	};

	$(document).on('change select2:select', 'select', function () {
	    const errIds = selectErrorMap[this.id];
	    if (errIds && String($(this).val() || '').trim() !== '') {
	        errIds.forEach(id => setFieldError(id, ''));
	    }
	});

	// Selecting either Service or HSN clears that row's message
	$(document).on('change select2:select', '.service-code-select, .hsn-code-select', function () {
	    if (String($(this).val() || '').trim() !== '') {
	        $(this).closest('.form-row, .row').find('.service-code-error').each(function () {
	            this.innerText = ''; this.style.display = 'none';
	        });
	    }
	});

	$(document).on('input', '#prodes',      () => setFieldError('productCodeError3', ''));
	$(document).on('input', '#remark',      () => setFieldError('productCodeError4', ''));
	$(document).on('input', '#prodesv11up', () => setFieldError('intypedes', ''));
	$(document).on('input', '#remarkvup',   () => setFieldError('intyperem', ''));

	$('#exampleModalScrollable, #exampleModalScrollableEditUp').on('hidden.bs.modal', function () {
	    $(this).find('.error-message').hide().text('');
	});
	

	async function loadDlyTaxMaster(containerSelector, taxData = [], isEdit = false) {

	    const response = await fetch(
	        new URL('/jssl/taxmasters/list', baseUrl),
	        { method: 'GET', credentials: 'include' }
	    );

	    if (!response.ok) throw new Error("Failed to fetch tax master");

	    const json = await response.json();
	    const master = json.Data || [];
	    const container = document.querySelector(containerSelector);

	    if (!container) return;

	    container.innerHTML = '';

	    for (let i = 1; i <= 3; i++) {

	        const existing = taxData[i - 1] || {};
	        const div = document.createElement('div');

	        div.className = 'row align-items-center mb-2';

	        const options = master.map(t => `
	            <option value="${t.tax_id}"
	                data-per="${t.tax_per}"
	                ${String(existing.tax_id) === String(t.tax_id) ? 'selected' : ''}>
	                ${t.tax_name} - ${t.tax_per}
	            </option>
	        `).join('');

	        div.innerHTML = `
	            <div class="col-md-4">
	                <label>Tax ${i}</label>
	                <select class="form-control dly-tax-select">
	                    <option value="">Select Tax</option>
	                    ${options}
	                </select>
	            </div>

	            <div class="col-md-3">
	                <label>Tax Percentage</label>
	                <input type="number" class="form-control dly-tax-per"
	                    value="${existing.tax_per || ''}" readonly>
	            </div>

	            <div class="col-md-3">
	                <label>Tax Value</label>
	                <input type="number" class="form-control dly-tax-value"
	                    value="${existing.tax_value || ''}" readonly>
	            </div>
	        `;

	        container.appendChild(div);
	    }

	    container.querySelectorAll('.dly-tax-select').forEach(select => {
	        select.addEventListener('change', function () {

	            if (hasDuplicateDlyTax(containerSelector)) {
	                alert("Same tax cannot be selected more than once.");
	                this.value = '';
	            }

	            const option = this.selectedOptions[0];
	            const row = this.closest('.row');

	            row.querySelector('.dly-tax-per').value =
	                option?.dataset.per || '';

	            calculateDlyTaxes(containerSelector);
	        });
	    });

	    calculateDlyTaxes(containerSelector);
	}

	function hasDuplicateDlyTax(containerSelector) {

	    const values = [
	        ...document.querySelectorAll(
	            `${containerSelector} .dly-tax-select`
	        )
	    ].map(el => el.value).filter(Boolean);

	    return new Set(values).size !== values.length;
	}

	function calculateDlyTaxes(containerSelector) {

	    const container = document.querySelector(containerSelector);
	    if (!container) return;

	    const netAmount = parseFloat($("#netamount").val()) || 0;

	    const rows = [...container.querySelectorAll(".row")];

	    let gstTotal = 0;

	    // First calculate normal taxes on Net Amount
	    rows.forEach(row => {

	        const select = row.querySelector(".dly-tax-select");
	        const percentInput = row.querySelector(".dly-tax-per");
	        const valueInput = row.querySelector(".dly-tax-value");

	        if (!select || !percentInput || !valueInput) return;

	        const taxName = select.selectedOptions[0]?.text.toUpperCase() || "";
	        const percent = parseFloat(percentInput.value) || 0;

	        if (taxName.includes("TCS")) return;

	        const taxValue = (netAmount * percent) / 100;

	        valueInput.value = taxValue.toFixed(2);

	        gstTotal += taxValue;
	    });

	    // Then calculate TCS on Net Amount + normal taxes
	    rows.forEach(row => {

	        const select = row.querySelector(".dly-tax-select");
	        const percentInput = row.querySelector(".dly-tax-per");
	        const valueInput = row.querySelector(".dly-tax-value");

	        if (!select || !percentInput || !valueInput) return;

	        const taxName = select.selectedOptions[0]?.text.toUpperCase() || "";
	        const percent = parseFloat(percentInput.value) || 0;

	        if (taxName.includes("TCS")) {

	            const tcsValue = ((netAmount + gstTotal) * percent) / 100;

	            valueInput.value = tcsValue.toFixed(2);
	        }
	    });

	    // Calculate Total Tax
	    let totalTax = 0;

	    rows.forEach(row => {
	        const value = parseFloat(
	            row.querySelector(".dly-tax-value")?.value
	        ) || 0;

	        totalTax += value;
	    });

	    $("#totaltax").val(totalTax.toFixed(2));

	    // Calculate Grand Total
	    $("#ingrandv").val((netAmount + totalTax).toFixed(2));
	}


	async function renderEditableDlyTaxes(taxData) {

	    const container = $(".dynamic-row122up");

	    container.empty();

	    try {

	        // Fetch available tax master records
	        const url = new URL("/jssl/taxmasters/list", baseUrl);

	        const response = await fetch(url, {
	            method: "GET",
	            credentials: "include"
	        });

	        if (!response.ok) {
	            throw new Error("Failed to fetch tax master data");
	        }

	        const json = await response.json();
	        const masterTaxes = json?.Data || [];

	        // Render exactly three tax rows
	        for (let i = 0; i < 3; i++) {

	            const tax = taxData[i] || {};
	            const number = i + 1;

	            const selectId = `tax${number}addupp`;
	            const percentId = `tax1${number}upp`;
	            const valueId = `tax${number}valueupp`;

	            // Match saved tax ID with tax master
	            const selectedMasterTax = masterTaxes.find(
	                item => String(item.tax_id) === String(tax.tax_id)
	            );

	            const taxPer = selectedMasterTax?.tax_per ?? "";
	            const taxName = selectedMasterTax?.tax_name ?? "";

	            let options = `<option value="">Select Tax</option>`;

	            masterTaxes.forEach(item => {

	                const selected =
	                    String(item.tax_id) === String(tax.tax_id)
	                        ? "selected"
	                        : "";

	                options += `
	                    <option value="${item.tax_id}"
	                            data-tax-per="${item.tax_per}"
	                            ${selected}>
	                        ${item.tax_name} - ${item.tax_per}%
	                    </option>
	                `;
	            });

	            container.append(`
	                <div class="row align-items-center mb-2">

	                    <div class="col-md-4 col-sm-12">
	                        <label class="small-label1">Tax ${number}</label>

	                        <select id="${selectId}"
	                                class="form-control form-control-sm small-input1 dly-edit-tax">

	                            ${options}

	                        </select>
	                    </div>

	                    <div class="col-md-3 col-sm-12">
	                        <label class="small-label1">Tax %</label>

	                        <input type="text"
	                               id="${percentId}"
	                               class="form-control form-control-sm small-input1 text-right"
	                               value="${taxPer}"
	                               readonly>
	                    </div>

	                    <div class="col-md-3 col-sm-12">
	                        <label class="small-label1">Tax Value</label>

	                        <input type="number"
	                               id="${valueId}"
	                               class="form-control form-control-sm small-input1 text-right"
	                               value="${tax.tax_value ?? 0}"
	                               step="0.01"
	                               readonly>
	                    </div>

	                    <input type="hidden"
	                           id="tax${number}idupp"
	                           value="${tax.tax_id ?? ''}">

	                </div>

	                <hr style="width:100%;border-top:1px solid #ccc;">
	            `);
	        }

	        // Handle tax selection changes
	        $(".dly-edit-tax").on("change", function () {

	            const selectedOption = this.options[this.selectedIndex];

	            const number = this.id.match(/\d+/)[0];

	            const percent = selectedOption.dataset.taxPer || "";
	            const taxId = this.value;

	            $(`#tax1${number}upp`).val(percent);
	            $(`#tax${number}idupp`).val(taxId);

	            // Recalculate only after user changes tax selection
	            preventDuplicateDlyEditTax();
	            calculateDlyEditTaxes();
	        });

	        // Do not recalculate saved values on initial rendering
	        preventDuplicateDlyEditTax();

	    } catch (error) {

	        console.error("Error loading editable DLY taxes:", error);

	        alert("Unable to load tax details.");
	    }
	}

	
	function calculateDlyEditTaxes() {

	    const netAmount = parseFloat($("#netamountup").val()) || 0;
	    let gstTotal = 0;
	    let totalTax = 0;

	    const taxes = [
	        { select: "tax1addupp", percent: "tax11upp", value: "tax1valueupp" },
	        { select: "tax2addupp", percent: "tax12upp", value: "tax2valueupp" },
	        { select: "tax3addupp", percent: "tax13upp", value: "tax3valueupp" }
	    ];

	    // Calculate normal taxes first
	    taxes.forEach(tax => {

	        const name = $("#" + tax.select + " option:selected")
	            .text().toUpperCase();

	        const percent = parseFloat($("#" + tax.percent).val()) || 0;

	        if (!name.includes("TCS")) {

	            const value = (netAmount * percent) / 100;

	            $("#" + tax.value).val(value.toFixed(2));

	            gstTotal += value;
	        }
	    });

	    // Calculate TCS on Net Amount + Normal Taxes
	    taxes.forEach(tax => {

	        const name = $("#" + tax.select + " option:selected")
	            .text().toUpperCase();

	        const percent = parseFloat($("#" + tax.percent).val()) || 0;

	        if (name.includes("TCS")) {

	            const value = ((netAmount + gstTotal) * percent) / 100;

	            $("#" + tax.value).val(value.toFixed(2));
	        }
	    });

	    // Calculate total tax
	    taxes.forEach(tax => {
	        totalTax += parseFloat($("#" + tax.value).val()) || 0;
	    });

	    // Update Total Tax and Grand Total
	    $("#totaltaxup").val(totalTax.toFixed(2));

	    $("#grandvup").val((netAmount + totalTax).toFixed(2));
	}
	
	function preventDuplicateDlyEditTax() {

	    const ids = [
	        "tax1addupp",
	        "tax2addupp",
	        "tax3addupp"
	    ];

	    const selectedTaxes = ids
	        .map(id => document.getElementById(id))
	        .filter(Boolean)
	        .map(select => select.value)
	        .filter(value => value !== "");

	    ids.forEach(id => {

	        const select = document.getElementById(id);

	        if (!select) return;

	        Array.from(select.options).forEach(option => {

	            if (option.value === "") return;

	            option.disabled =
	                selectedTaxes.includes(option.value) &&
	                select.value !== option.value;
	        });
	    });
	}

	function numberToIndianWords(amount) {
		    amount = Number(amount) || 0;

		    const ones = [
		        "", "One", "Two", "Three", "Four", "Five",
		        "Six", "Seven", "Eight", "Nine", "Ten",
		        "Eleven", "Twelve", "Thirteen", "Fourteen",
		        "Fifteen", "Sixteen", "Seventeen", "Eighteen",
		        "Nineteen"
		    ];

		    const tens = [
		        "", "", "Twenty", "Thirty", "Forty",
		        "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
		    ];

		    function belowThousand(n) {
		        let result = "";

		        if (n >= 100) {
		            result += ones[Math.floor(n / 100)] + " Hundred ";
		            n %= 100;
		        }

		        if (n >= 20) {
		            result += tens[Math.floor(n / 10)] + " ";
		            n %= 10;
		        }

		        if (n > 0) {
		            result += ones[n] + " ";
		        }

		        return result.trim();
		    }

		    function convert(n) {
		        if (n === 0) return "Zero";

		        const parts = [];

		        const crore = Math.floor(n / 10000000);
		        n %= 10000000;

		        const lakh = Math.floor(n / 100000);
		        n %= 100000;

		        const thousand = Math.floor(n / 1000);
		        n %= 1000;

		        if (crore) parts.push(belowThousand(crore) + " Crore");
		        if (lakh) parts.push(belowThousand(lakh) + " Lakh");
		        if (thousand) parts.push(belowThousand(thousand) + " Thousand");
		        if (n) parts.push(belowThousand(n));

		        return parts.join(" ");
		    }

		    const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
		    const rupees = Math.floor(rounded);
		    const paise = Math.round((rounded - rupees) * 100);

		    let words = convert(rupees) + " Rupees";

		    if (paise > 0) {
		        words += " and " + convert(paise) + " Paise";
		    }

		    return words + " Only";
		}