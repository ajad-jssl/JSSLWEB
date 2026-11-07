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




function initSelect2(selectId, placeholder) {
    const $el = $('#' + selectId);
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

// [SVC/HSN FIX] Only a purely numeric value is a real master ID. Anything else
// (e.g. the fallback option whose value is display text) is sent as blank so
// the backend stores NULL instead of a wrong/garbage code.
function toIdOrBlank(v) {
    const s = (v == null ? "" : String(v)).trim();
    return /^\d+$/.test(s) ? s : "";
}

// [SVC/HSN FIX] True when the INVOICE_CONTRACT_MASTER row exists in the response.
// If it exists, a null s_code/h_code means "cleared" and must NOT fall back
// to the old Contractor_Data value.
function hasContractMaster(contractMasterData) {
    return !!(contractMasterData && contractMasterData.con_slno);
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
	  //const allowed = window.allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable').modal('hide');
	  return;
	}
	$('#exampleModalScrollable').modal('show');
});

/*document.addEventListener("DOMContentLoaded", function () {
	loadAllowedActions();
	fetchBusinessUnitList();       
	fetchInvoiceAddressList();     
    fetchWorkOrderList();          
    fetchConsigneeAddressList();  
	fetchservice();
	fetchhsn(); 
	fetchServiceCodeList();   
	fetchHsnCodeList();  
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
});*/


document.addEventListener("DOMContentLoaded", function () {
    loadAllowedActions();
    fetchBusinessUnitList();
    fetchInvoiceAddressList();
    fetchWorkOrderList();
    fetchConsigneeAddressList();
    fetchservice();
    fetchhsn();
    fetchServiceCodeList();
    fetchHsnCodeList();

    initSelect2('cont', 'Select contractor');
    initSelect2('load', 'Select load');

    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId");
    if (selectedFactoryId) {
        fetchCont(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }

    $('#cont').on('change', function () {
        const selectedContractorId = this.value;
        const factoryId = sessionStorage.getItem("selectedFactoryId");
        if (selectedContractorId) {
            fetchLoad(factoryId, selectedContractorId);
        } else {
            $('#load').html(`<option value="">Select load</option>`);
            initSelect2('load', 'Select load');
            $('#inputFieldsContainer').hide();
        }
    });

    $('#load').on('change', function () {
        const selectedContractorId = document.getElementById("cont").value;
        const selectedLoadId = this.value;
        if (selectedContractorId && selectedLoadId) {
            $('#inputFieldsContainer').show();
            fetchQsPackingData(selectedContractorId, selectedLoadId);
        } else {
            $('#inputFieldsContainer').hide();
        }
    });
});

// Fetch the contractor list
/*async function fetchCont(factoryId) {
    try {
        const url = new URL(`/jssl/getlistcontractorsfromqsadvpackingnew`, baseUrl);
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
    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

// Fetch the load list based on factoryId and selected contractorId (con_id)
async function fetchLoad(factoryId, contractId) {
    try {
        const url = new URL(`/jssl/getlistloadidforthatcontractorsfromqsadvpackingnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);
        url.searchParams.append("contract_id", contractId); // Pass selected contractor ID

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
		    if (type.load_id) {
		        const option = document.createElement("option");
		        option.value = type.load_id;
		        option.textContent = type.load_id;  // <-- Add this line
		        selectElement.appendChild(option);
		    }
		});
    } catch (error) {
        console.error("Error fetching loads:", error);
    }
}*/



async function fetchCont(factoryId) {
    try {
        const url = new URL(`/jssl/getlistcontractorsfromqsadvpackingnew`, baseUrl);
        url.searchParams.append("factory_id", selectedFactoryId);

        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch contractors");
        const json = await response.json();

        const selectElement = document.getElementById("cont");
        selectElement.innerHTML = `<option value="">Select contractor</option>`;

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
        initSelect2('cont', 'Select contractor');
    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

async function fetchLoad(factoryId, contractId) {
    try {
        const url = new URL(`/jssl/getlistloadidforthatcontractorsfromqsadvpackingnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);
        url.searchParams.append("contract_id", contractId);

        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch loads");
        const json = await response.json();

        const selectElement = document.getElementById("load");
        selectElement.innerHTML = `<option value="">Select load</option>`;

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
        initSelect2('load', 'Select load');
        $('#load').val('').trigger('change');
    } catch (error) {
        console.error("Error fetching loads:", error);
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
}

*/

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

// BEFORE: these took no parameters, so calls like
//   fetchservice("officeservice", contractor.s_code_value)
// silently ignored both arguments and just repopulated the
// dropdown with the blank default option every time.

// ---------- Shared helpers (reuse if already defined elsewhere in your file) ----------
function normalizeText(str) {
    return (str || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function dedupeByLabel(records, selectedId) {
    const map = new Map();
    records.forEach((rec) => {
        const key = normalizeText(rec.label);
        if (!key) return;
        const existing = map.get(key);
        if (!existing) {
            map.set(key, rec);
        } else if (selectedId && String(rec.id) === String(selectedId)) {
            map.set(key, rec);
        }
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
}


async function fetchservice(targetId = "officeservice", currentValueText = null) {
    try {
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch service codes");
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No service codes found.");
            return;
        }

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.servicecode_id && t.service_code)
            .map(t => ({ id: t.servicecode_id, label: t.service_code }));

        let matchedId = null;
        const match = records.find(r => normalizeText(r.label) === normalizeText(currentValueText));
        if (match) matchedId = match.id;

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select service code", matchedId ? null : currentValueText);
    } catch (error) {
        console.error("Error fetching service codes:", error);
    }
}

async function fetchhsn(targetId = "officehsn", currentValueText = null) {
    try {
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch hsn codes");
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No hsn codes found.");
            return;
        }

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.servicecode_id && t.service_code)
            .map(t => ({ id: t.servicecode_id, label: t.service_code }));

        let matchedId = null;
        const match = records.find(r => normalizeText(r.label) === normalizeText(currentValueText));
        if (match) matchedId = match.id;

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select hsn code", matchedId ? null : currentValueText);
    } catch (error) {
        console.error("Error fetching hsn codes:", error);
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

        const url = new URL(`/jssl/invoice/getcontractqsadvancepackingdetailsnew`, baseUrl);

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

        if (json.Grand_Total_value && json.Grand_Total_value.length > 0) {
            const Grand_Total_value = json.Grand_Total_value[0];

            const grandvalue = Grand_Total_value.Grand_Total_tax;
            const grand1 = document.getElementById("ingrandv");
            if (grand1) {
                grand1.value = grandvalue;
            }
        } else {
            console.warn("No Contractor Data found.");
        }

        if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {
            const QsPacking = json.QsPacking_Data[0];

            const freightValue = QsPacking.freight;
            const frie = document.getElementById("freight");
            if (frie) {
                frie.value = freightValue;
            }

            const pnidValue = QsPacking.pn_id;
            const pnid = document.getElementById("id11");
            if (pnid) {
                pnid.value = pnidValue;
            }

        } else {
            console.warn("No Contractor Data found.");
        }

        // Check if Contractor_Data exists and contains items
        if (json.Contractor_Data && json.Contractor_Data.length > 0) {
            // Get the first item (or iterate if needed)
            const contractor = json.Contractor_Data[0];

            // Set the bank name from the contractor data
            const bankDetailsIdValue = contractor.bank_details_id_value;
            const bankInput = document.getElementById("bank");
            if (bankInput) {
                bankInput.value = bankDetailsIdValue;
            }

            fetchSalework("work", contractor.work_id_value);

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

            const ShipmentValue = contractor.shipment_mode_id_value;
            const Ship = document.getElementById("shipmode");
            if (Ship) {
                Ship.value = ShipmentValue;
            }

            const ExportValue = contractor.export;
            const exp = document.getElementById("expt");
            if (exp) {
                exp.value = ExportValue;
            }

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

            const PercenValue = contractor.percentage_value;
            const per = document.getElementById("percen");
            if (per) {
                per.value = PercenValue;
            }

            fetchconname("billing", contractor.consignee_id_value);

            const DelValue = contractor.delivery_condition_id_value;
            const del = document.getElementById("delivery");
            if (del) {
                del.value = DelValue;
            }

            const RegValue = contractor.reg_office_id_value;
            const reg = document.getElementById("office");
            if (reg) {
                reg.value = RegValue;
            }

            if (contractor.export === 'yes') {
                $('#exportFields1').show();
            } else {
                $('#exportFields1').hide();
            }

            const AreaValue = contractor.area_no;
            const area = document.getElementById("are");
            if (area) {
                area.value = AreaValue;
            }

            const LotValue = contractor.lot_no;
            const lot = document.getElementById("lut");
            if (lot) {
                lot.value = LotValue;
            }

            const contValue = contractor.containter_no;
            const cont = document.getElementById("connum");
            if (cont) {
                cont.value = contValue;
            }

            const epcgnoValue = contractor.epcgno;
            const epcgno = document.getElementById("epog");
            if (epcgno) {
                epcgno.value = epcgnoValue;
            }

            const exptitelvalue = contractor.export_title;
            const expval = document.getElementById("exptitle");
            if (expval) {
                expval.value = exptitelvalue;
            }

            // Service Code / HSN Code: fetchservice/fetchhsn are the single
            // source of truth here. They populate the dropdown from the
            // master list AND pre-select contractor.s_code_value /
            // contractor.h_code_value when present, leaving it on the
            // default/blank option otherwise. No manual .value overwrite
            // follows this, so the user can still change the selection
            // afterward without it being stomped back to the fetched value.
            fetchservice("officeservice", contractor.s_code_value);
            fetchhsn("officehsn", contractor.h_code_value);

            // Populate the dropdown alongside it
            fetchSalebusunit("inbusunit", contractor.businessUnitName);

            const con_slnoValue = contractor.con_slno;
            const con_slno = document.getElementById("id11con");
            if (con_slno) {
                con_slno.value = con_slnoValue;
            }
        } else {
            console.warn("No Contractor Data found.");
        }

        // Check if QsPacking_Data exists and contains items
        if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {

            const container = document.querySelector(".dynamic-row");
            container.innerHTML = "";   // clear only THIS panel

            json.QsPacking_Data.forEach((item, index) => {

                const showLabel = index === 0;

                container.insertAdjacentHTML("beforeend", `
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

                    </div>
                    <hr style="width:100%;border-top:1px solid #ccc;">
                `);
            });
        } else {
            console.warn("No QsPacking data found.");
        }

        // Now, handle tax data and append it to .dynamic-row1
        if (json.tax && json.tax.length > 0) {
            const taxContainer = document.querySelector(".dynamic-row1");
            taxContainer.innerHTML = "";

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
            });
        } else {
            console.warn("No tax data found.");
        }
    } catch (error) {
        console.error("Error fetching QsPacking data:", error);
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
        const url = new URL(`/jssl/invoice/advlistnew`, baseUrl);
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
                    <th>Invoice Date</th>
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

										     
							   printIcon = `
							     <td>
								    <i class="fa fa-print" style="color: green; cursor: pointer;"
							     onclick="printRecord('${item.id}')">
						      </i>
					    </td>
					    `;

				 
				} else if (item.status === 'VERIFIED') {
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
}

*/




let currentFactoryId = null;

function fetchUserList111(selectedFactoryId) {

    currentFactoryId = selectedFactoryId;

    // 🔥 Destroy existing DataTable
    if ($.fn.DataTable.isDataTable('#tableID')) {
        $('#tableID').DataTable().clear().destroy();
    }

    // ✅ Server-side DataTable
    $('#tableID').DataTable({
        processing: true,
        serverSide: true,          //  tells DataTable to call ajax on every page change
        scrollX: true,
        searching: true,
        dom: 'Bfrtip',
       pageLength: 10,
	   buttons: [
	       {
	           text: 'Export to Excel',
	           action: function (e, dt, button, config) {

	               // ✅ Fetch ALL records then export
	               const url = new URL(`/jssl/invoice/advlistnewss`, baseUrl);
	               url.searchParams.append('factory_id', currentFactoryId);
	               url.searchParams.append('page', 0);
	               url.searchParams.append('size', 99999); // all records

	               fetch(url, { credentials: "include" })
	                   .then(response => response.json())
	                   .then(json => {

	                       const formatDate = (dateStr) => {
	                           if (!dateStr) return '';
	                           const dateObj = new Date(dateStr);
	                           if (isNaN(dateObj)) return dateStr;
	                           return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
	                       };

	                       // Build export data
	                       const exportData = json.data.map(item => [
	                           item.contract_name || '',
	                           item.load_id || '',
	                           item.invoice_number || '',
	                           formatDate(item.created_onlydate),
	                           item.status || ''
	                           // ❌ don't export action columns (edit/delete icons)
	                       ]);

	                       // Create temporary table for export
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

	                       // Export using DataTable on temp table
	                       $(tempTable).DataTable({
	                           buttons: [{
	                               extend: 'excelHtml5',
	                               title: 'Invoice List'
	                           }]
	                       }).button(0).trigger();

	                       // Cleanup
	                       setTimeout(() => {
	                           $(tempTable).DataTable().destroy();
	                           $(tempTable).remove();
	                       }, 1000);
	                   });
	           }
	       }
	   ],
        columns: [
            { title: "Contract Name" },
            { title: "Lot Number" },
            { title: "Invoice Number" },
            { title: "Invoice Date" },
            { title: "Status" },
            { title: "pnid", visible: false },   // hidden column
            { title: "Edit Invoice" },
            { title: "Verify" },
            { title: "View" },
            { title: "Release" },
            { title: "Cancel" },
            { title: "Print" }
        ],
        ajax: function (data, callback, settings) {

            // ✅ DataTable sends start + length, convert to page + size
            const page = data.start / data.length;
            const size = data.length;
			const searchValue = data.search.value; 

            const url = new URL(`/jssl/invoice/advlistnewss`, baseUrl);
            url.searchParams.append('factory_id', currentFactoryId);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
			url.searchParams.append('search', searchValue); 

            fetch(url, {
                method: "GET",
                credentials: "include"
            })
            .then(response => response.json())
            .then(json => {

                const formatDate = (dateStr) => {
                    if (!dateStr) return '';
                    const dateObj = new Date(dateStr);
                    if (isNaN(dateObj)) return dateStr;
                    return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
                };

                const rows = json.data.map(item => {

                    let editinvoice = '';
                    let editIcon = '';
                    let releaseIcon = '';
                    let cancelIcon = '';
                    let printIcon = '';
					let viewIcon   = '';

                    if (item.status === 'CANCELLED') {
                        editinvoice = `<i class="fa fa-edit text-muted"></i>`;
                        editIcon    = `<i class="fa fa-pen text-muted"></i>`;
                        releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                        cancelIcon  = `<i class="fa fa-times-circle text-muted"></i>`;
                        printIcon   = `<i class="fa fa-print" style="color:green;" onclick="printRecord('${item.id}')"></i>`;
						// ✅ Enable view icon
						viewIcon = `<i class="fa fa-eye" style="color:green;" onclick="editRecord11('${item.id}')"></i>`;

                    } else if (item.status === 'VERIFIED') {
                        editinvoice = `<i class="fa fa-edit text-muted"></i>`;
                        editIcon    = `<i class="fa fa-pen text-muted"></i>`;
                        releaseIcon = `<i class="fa fa-box-open" style="color:brown;" onclick="openModal('${item.id}','${item.pn_id}')"></i>`;
                        cancelIcon  = `<i class="fa fa-times-circle" style="color:red;" onclick="openModalcancel('${item.id}','${item.pn_id}')"></i>`;
                        printIcon   = `<i class="fa fa-print" style="color:green;" onclick="printRecord('${item.id}')"></i>`;
						viewIcon = `<i class="fa fa-eye" style="color:green;" onclick="editRecord11('${item.id}')"></i>`;

                    } else if (item.status === 'NOT VERIFIED') {
                        editinvoice = `<i class="fa fa-edit" style="color:blue;" onclick="editRecordInvoice('${item.id}')"></i>`;
                        editIcon    = `<i class="fa fa-pen" style="color:blue;" onclick="editRecord('${item.id}')"></i>`;
                        releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                        cancelIcon  = `<i class="fa fa-times-circle text-muted"></i>`;
                        printIcon   = `<i class="fa fa-print text-muted"></i>`;
						viewIcon    = `<i class="fa fa-eye text-muted"></i>`;

                    } else {
                        editinvoice = `<i class="fa fa-edit text-muted"></i>`;
                        editIcon    = `<i class="fa fa-pen text-muted"></i>`;
                        releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                        cancelIcon  = `<i class="fa fa-times-circle text-muted"></i>`;
                        printIcon   = `<i class="fa fa-print text-muted"></i>`;
						viewIcon    = `<i class="fa fa-eye text-muted"></i>`;
                    }

                    return [
                        item.contract_name || '',
                        item.load_id || '',
                        item.invoice_number || '',
                        formatDate(item.created_onlydate),
                        item.status || '',
                        item.pn_id || '',              // col 5 - hidden
                        editinvoice,                   // col 6
                        editIcon,                      // col 7
                        viewIcon,                      // col 8
                        releaseIcon,                   // col 9
                        cancelIcon,                    // col 10
                        printIcon                      // col 11
                    ];
                });

                callback({
                    draw: data.draw,
                    recordsTotal: json.totalItems,      // ✅ total count from backend
                    recordsFiltered: json.totalItems,   // ✅ same as total (no search filter)
                    data: rows
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
    });
}
/*function fetchUserList111(selectedFactoryId) {

    $('#tableID').DataTable({
        processing: true,
        serverSide: true,
        destroy: true,
        scrollX: true,

        ajax: function (data, callback) {

            const page = data.start / data.length;
            const size = data.length;

            const url = new URL(`/jssl/invoice/advlistnewss`, baseUrl);
            url.searchParams.append('factory_id', selectedFactoryId);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);

            fetch(url, {
                method: "GET",
                credentials: "include"
            })
            .then(response => response.json())
            .then(json => {

                callback({
                    draw: data.draw,
                    recordsTotal: json.totalItems,
                    recordsFiltered: json.totalItems,
                    data: json.data
                });

            })
            .catch(error => console.error("Error:", error));
        },

        columns: [

            { data: 'contract_name' },
            { data: 'load_id' },
            { data: 'invoice_number' },

            {
                data: 'created_onlydate',
                render: function (data) {
                    if (!data) return '';
                    const dateObj = new Date(data);
                    if (isNaN(dateObj)) return data;
                    return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
                }
            },

            { data: 'status' },
            { data: 'pn_id', visible: false },

            // Edit Invoice
            {
                data: null,
                render: function (data, type, row) {

                    if (row.status === 'NOT VERIFIED') {
                        return `<i class="fa fa-edit" style="color: blue;" onclick="editRecordInvoice('${row.id}')"></i>`;
                    }
                    return `<i class="fa fa-edit text-muted"></i>`;
                }
            },

            // Edit
            {
                data: null,
                render: function (data, type, row) {

                    if (row.status === 'NOT VERIFIED') {
                        return `<i class="fa fa-pen" style="color: blue;" onclick="editRecord('${row.id}')"></i>`;
                    }
                    return `<i class="fa fa-pen text-muted"></i>`;
                }
            },

            // View
            {
                data: 'id',
                render: function (data) {
                    return `<i class="fa fa-eye" style="color: green;" onclick="editRecord11('${data}')"></i>`;
                }
            },

            // Release
            {
                data: null,
                render: function (data, type, row) {

                    if (row.status === 'VERIFIED') {
                        return `<i class="fa fa-box-open" style="color: brown;" onclick="openModal('${row.id}', '${row.pn_id}')"></i>`;
                    }
                    return `<i class="fa fa-box-open text-muted"></i>`;
                }
            },

            // Cancel
            {
                data: null,
                render: function (data, type, row) {

                    if (row.status === 'VERIFIED') {
                        return `<i class="fa fa-times-circle" style="color: red;" onclick="openModalcancel('${row.id}', '${row.pn_id}')"></i>`;
                    }
                    return `<i class="fa fa-times-circle text-muted"></i>`;
                }
            },

            // Print
            {
                data: null,
                render: function (data, type, row) {

                    if (row.status === 'VERIFIED' || row.status === 'CANCELLED') {
                        return `<i class="fa fa-print" style="color: green;" onclick="printRecord('${row.id}')"></i>`;
                    }
                    return `<i class="fa fa-print text-muted"></i>`;
                }
            }
        ],

        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: 'Export to Excel',
                title: 'List'
            }
        ]
    });
}
*/
async function fetchinvoice(factoryId) {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

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
       // const selectElement = document.getElementById("intype444");

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

async function fetchinvoiceEdit(factoryId) {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
        const response = await fetch(url,		{
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
       // const selectElement = document.getElementById("intypeeditup");

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
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

/*function openModalAdd() {
   // var username = document.getElementById('intype444').value.trim();
    var prodes = document.getElementById('prodes').value.trim();
    var remark = document.getElementById('remark').value.trim();
	var servicecode = document.getElementById('officeservice').value.trim();
	var hsncode = document.getElementById('officehsn').value.trim();
    var showError = false; // Initialize showError variable


    
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
	
	if (servicecode === '' && hsncode === '') {
	        document.getElementById('servicecodeError4').innerText = "Please enter service/HSN code.";
	        document.getElementById('servicecodeError4').style.display = "inline-block";
	        showError = true;
	    } else {
	        document.getElementById('servicecodeError4').innerText = "";
	        document.getElementById('servicecodeError4').style.display = "none";
	    }
   
   // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}*/


function openModalAdd() {
    let showError = false;

    function required(selectId, errId, message) {
        if (String($('#' + selectId).val() || '').trim() === '') {
            setFieldError(errId, message); showError = true;
        } else setFieldError(errId, '');
    }

    required('inbusunit', 'busunitError',  'Please select Business Unit.');
    required('ininto',    'intoError',     'Please select Invoice To.');
    required('work',      'workError',     'Please select Work Order.');
    required('billing',   'billingError',  'Please select Name & Address of Consignee.');

    const servicecode = String($('#officeservice').val() || '').trim();
    const hsncode     = String($('#officehsn').val() || '').trim();
    if (servicecode === '' && hsncode === '') {
        setFieldError('servicecodeError4', 'Please select Service Code or HSN Code.');
        showError = true;
    } else setFieldError('servicecodeError4', '');

    required('prodes', 'productCodeError3', 'Please enter product description.');
    required('remark', 'productCodeError4', 'Please enter remarks.');

    if (!showError) $('#exampleModalCenter66').modal('show');
}
   
// Fetch selectedFactoryId from sessionStorage
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

function addevent() {
	$('#exampleModalCenter66').modal('hide');
    // Validate role code and role description
    const selectedCOnt = document.getElementById("cont").selectedOptions[0]; // Get the selected option
    const contid = selectedCOnt ? selectedCOnt.value : ''; // Get the contract_id
    const contname = selectedCOnt ? selectedCOnt.textContent : ''; // Get the contract_name
    
    $.ajax({
        url: new URL('/jssl/invoice/advnew', baseUrl),
        type: 'POST',
        dataType: 'json',
		xhrFields: {
		    withCredentials: true
		},
        data: jQuery.param({
            contract_id: contid,
            created_by: createdById,
            load_id: load.value,
            invoice_type: "ADV",
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
            contract_name: contname,
            factory_id: selectedFactoryId,
           // type_id: intype444.value,
            pn_id: id11.value,
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
		    regd_office_id: document.getElementById("office").value,
			// [SVC/HSN FIX] send only real numeric IDs; blank means "not selected"
			s_code: toIdOrBlank(document.getElementById("officeservice").value),
			h_code: toIdOrBlank(document.getElementById("officehsn").value)
        }),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Advance Invoice Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'AdvanceInvoiceEntry.jsp';
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
        error: function () {
            console.error('Request failed.');
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
let servicecodelist = [];
let hsncodelist = [];

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

async function fetchServiceCodeList() {
    try {
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        servicecodelist = (json.status === "yes" && json.Data) ? json.Data : [];
    } catch (error) {
        console.error("Error fetching service code list:", error);
    }
}

async function fetchHsnCodeList() {
    try {
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        hsncodelist = (json.status === "yes" && json.Data) ? json.Data : [];
    } catch (error) {
        console.error("Error fetching HSN code list:", error);
    }
}

async function editRecord(id) {
	 // const allowed = window.allowedActions || [];

	if (!allowed.includes("Verify")) {
	  alert(" You do not have permission to Verify.");
	  return;
	}
    try {
        const url = new URL(`/jssl/invoice/searchadvidnew`, baseUrl);
        url.searchParams.append('id', id);

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
			   
		   // [SVC/HSN FIX] if the master row exists, a null code means "cleared" -> show blank (no fallback to old value)
		   const hasMaster = hasContractMaster(ContractMasterData);

		   const matchedService = servicecodelist.find(s => String(s.servicecode_id) === String(ContractMasterData.s_code));
		   const serviceDisplay = hasMaster
		       ? (matchedService ? matchedService.service_code : "")
		       : (ContData.length > 0 ? ContData[0].s_code_value : "");

		   const matchedHsn = hsncodelist.find(h => String(h.servicecode_id) === String(ContractMasterData.h_code));
		   const hsnDisplay = hasMaster
		       ? (matchedHsn ? matchedHsn.service_code : "")
		       : (ContData.length > 0 ? ContData[0].h_code_value : "");

			   
		   
		   setInputValue("#bunitv",     buDisplay);
		   setInputValue("#intov",      invoiceToDisplay);
		   setInputValue("#workorderv", workDisplay);
		   setInputValue("#nandconv",   consigneeDisplay);
		   setInputValue("#newscode2", serviceDisplay);
		   setInputValue("#newhcode2", hsnDisplay);

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
		setInputValue("#contarctsv", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");

        // Set grand total value
        setInputValue("#grandv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        // Set contractor data fields
        const contractorFields = {
            //"#bunitv": "business_unit_name",
           // "#intypev": "invoice_type_calculation",
           // "#intov": "invoice_to_id_value",
           // "#prodesv": "product_desc_id",
            "#shipmodev": "shipment_mode_id_value",
           // "#workorderv": "work_id_value",
            "#exptv": "export",
           // "#taxresv": "tax_payable",
            "#percenv": "percentage_value",
            //"#nandconv": "consignee_id_value",
            "#banknamev": "bank_details_id_value",
            "#deliveryconv": "delivery_condition_id_value",
            "#officevv": "reg_office_id_value",
           // "#vingrandv": "tax_ex_inc",
           // "#advF": "freight_advance_recovery",
            "#arev": "area_no",
            "#lutv": "lot_no",
            "#connumv": "containter_no",
            "#epogv": "epcgno",
            "#exptitlev": "export_title",
            //"#newscode2": "s_code_value",
            //"#newhcode2": "h_code_value",
            
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
								
								const Taxexinn =
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
								 }
        
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
        
        Object.keys(TaxFields).forEach(selector => {
            setInputValue(selector, taxData.length > 0 ? taxData[0][TaxFields[selector]] : "");
        });

        // Show/hide export field based on "export" value
        $('#exportFields1verify').toggle(ContData.length > 0 && ContData[0].export === 'yes');

        // Append packing data
		packingData.forEach((item, index) => {
		    const showLabel = index === 0;

		    $(".dynamic-row11").append(`
		        <div class="row align-items-center mb-1">
		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">UOM</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.qty).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.per_kgs).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.unit_price).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Total</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.total).toFixed(2)}" readonly>
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
		        <hr style="width:100%;border-top:1px solid #ccc;">
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
                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
                    </div>
                </div>
                <hr style="width:120%;border-top:1px solid #ccc;">
            `);
        });

        // Show the modal
        $("#exampleModalScrollableVerify").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
}

async function editRecord11(id) {
	// const allowed = window.allowedActions || [];

		if (!allowed.includes("view")) {
		  alert(" You do not have permission to view.");
		    $("#exampleModalScrollableVerified").modal("hide");
		  return;
		}
    try {
	    const url = new URL(`/jssl/invoice/searchadvidnew`, baseUrl);
        url.searchParams.append('id', id);

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
					
				// [SVC/HSN FIX] if the master row exists, a null code means "cleared" -> show blank (no fallback to old value)
				const hasMaster = hasContractMaster(ContractMasterData);

				const matchedService = servicecodelist.find(s => String(s.servicecode_id) === String(ContractMasterData.s_code));
				const serviceDisplay = hasMaster
				    ? (matchedService ? matchedService.service_code : "")
				    : (ContData.length > 0 ? ContData[0].s_code_value : "");

				const matchedHsn = hsncodelist.find(h => String(h.servicecode_id) === String(ContractMasterData.h_code));
				const hsnDisplay = hasMaster
				    ? (matchedHsn ? matchedHsn.service_code : "")
				    : (ContData.length > 0 ? ContData[0].h_code_value : "");

		        setInputValue("#bunitvv",     buDisplay);
		        setInputValue("#intovv",      invoiceToDisplay);
		        setInputValue("#workordervv", workDisplay);
		        setInputValue("#nandconvv",   consigneeDisplay);
				setInputValue("#newscode1", serviceDisplay);
				setInputValue("#newhcode1", hsnDisplay);
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
		setInputValue("#contarctsvv", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");

        // Set grand total value
        setInputValue("#grandvv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        // Set contractor data fields
        const contractorFields = {
            //"#bunitvv": "business_unit_name",
            //"#intypevv": "invoice_type_calculation",
            //"#intovv": "invoice_to_id_value",
            //"#prodesvv": "product_desc_id",
            "#shipmodevv": "shipment_mode_id_value",
            //"#workordervv": "work_id_value",
            "#exptvv": "export",
           //"#taxresvv": "tax_payable",
            "#percenvv": "percentage_value",
            //"#nandconvv": "consignee_id_value",
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
            //"#newscode1": "s_code_value",
            //"#newhcode1": "h_code_value",
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
						
						const Taxexin1 =
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
						 }
		
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
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.qty).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.per_kgs).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.unit_price).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Total</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"  value="${Number(item.total).toFixed(2)}" readonly>
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
		        <hr style="width:100%;border-top:1px solid #ccc;">
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
	
	
	initSelect2(targetId, 'Select Business Unit');
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

async function fetchservicecodeEdit(targetId, selectedId, fallbackText) {
    try {
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) return;

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.servicecode_id)
            .map(t => ({ id: t.servicecode_id, label: t.service_code }));

        const deduped = dedupeByLabel(records, selectedId);
        populateSelect(selectElement, deduped, selectedId, "Select Service Code", fallbackText);
    } catch (err) {
        console.error("Error fetching service codes:", err);
    }
}

async function fetchhsncodeEdit(targetId, selectedId, fallbackText) {
    try {
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) return;

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.servicecode_id)
            .map(t => ({ id: t.servicecode_id, label: t.service_code }));

        const deduped = dedupeByLabel(records, selectedId);
        populateSelect(selectElement, deduped, selectedId, "Select HSN Code", fallbackText);
    } catch (err) {
        console.error("Error fetching hsn codes:", err);
    }
}

async function editRecordInvoice(id) {
    try {
        const url = new URL(`/jssl/invoice/searchadvidnew`, baseUrl);
        url.searchParams.append('id', id);

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
		// [SVC/HSN FIX] if the master row exists, do NOT fall back to the old contract value (a cleared code must stay cleared)
		const hasMasterEdit = hasContractMaster(ContractMasterData);
		fetchservicecodeEdit("newscode",ContractMasterData.s_code, hasMasterEdit ? "" : (ContData.length > 0 ? ContData[0].s_code_value  : ""));
		fetchhsncodeEdit("newhcode",ContractMasterData.h_code, hasMasterEdit ? "" : (ContData.length > 0 ? ContData[0].h_code_value  : ""));
		        // ---- END NEW ----

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
		setInputValue("#contarcts", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");
       // setInputValue("#intypeeditup", packingData.length > 0 ? packingData[0].inc_type : "");

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
            //"#newhcode": "h_code_value",
            //"#newscode": "s_code_value",
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
				
				const Taxexin =
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
				 }
        
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
        
        Object.keys(TaxFields).forEach(selector => {
            setInputValue(selector, taxData.length > 0 ? taxData[0][TaxFields[selector]] : "");
        });

        // Show/hide export field based on "export" value
        $('#exportFields1verifyup').toggle(ContData.length > 0 && ContData[0].export === 'yes');

        // Append packing data
		packingData.forEach((item, index) => {
		    const showLabel = index === 0;

		    $(".dynamic-row11uptest").append(`
		        <div class="row align-items-center mb-1">
		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">UOM</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.qty).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.per_kgs).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.unit_price).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Total</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.total).toFixed(2)}" readonly>
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
		        <hr style="width:100%;border-top:1px solid #ccc;">
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
                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
                    </div>
                </div>
                <hr style="width:120%;border-top:1px solid #ccc;">
            `);
        });

        // Show the modal
        $("#exampleModalScrollableEditUp").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
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
	const val = (id, fallback = "0") => {
	    const el = document.getElementById(id);
	    return (el && el.value !== "") ? el.value : fallback;
	};
	$('#exampleModalCenter66Verify').modal('hide');
    // Collect tax_id, tax_per, and tax_value as comma-separated values
    let taxIds = [];
    let taxPers = [];
    let taxValues = [];
    let taxAdv = [];
    let taxPtd = [];
    let taxPbc = [];

    $(".dynamic-row122 .row").each(function () {
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
        url: new URL('/jssl/invoice/advverificationnew', baseUrl),
        type: 'POST',
        dataType: 'json',
		xhrFields: {
		    withCredentials: true
		},
		data: jQuery.param({
		    verified_by: createdById,
		    factory_id: selectedFactoryId,
		    payable_by_customer: val("pdptcv"),
		    payable_to_dept: val("pdptv"),
		    open_tax_adv: val("advA"),
		    open_non_tax_adv: val("advan"),
		    total: val("bvaue"),
		    recovery_amt: "",
		    t_adv: "",
		    adv_tax: taxAdv.join(","),
		    tax_payable_by_customer: taxPbc.join(","),
		    tax_payable_to_dept: taxPtd.join(","),
		    id: vidverify.value,
		    gst_remarks: remarkvvei.value,
		    pn_id: pnverifyww.value,
		    tax_id: taxIds.join(","),
		    tax_per: taxPers.join(","),
		    tax_value: taxValues.join(",")
		}),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Advance Invoice Verified Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'AdvanceInvoiceEntry.jsp';
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
        error: function () {
            console.error('Request failed.');
        }
    });
}

/*function openModalUpdate() {
   // var username = document.getElementById('intypeeditup').value.trim();
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

    function required(selectId, errId, message) {
        if (String($('#' + selectId).val() || '').trim() === '') {
            setFieldError(errId, message); showError = true;
        } else setFieldError(errId, '');
    }

    required('bunitvup',     'bunitvupError',     'Please select Business Unit.');
    required('intovup',      'intovupError',      'Please select Invoice To.');
    required('workordervup', 'workordervupError', 'Please select Work Order.');
    required('nandconvup',   'nandconvupError',   'Please select Name & Address of Consignee.');

    const sc = String($('#newscode').val() || '').trim();
    const hc = String($('#newhcode').val() || '').trim();
    if (sc === '' && hc === '') {
        setFieldError('servicecodeupError', 'Please select Service Code or HSN Code.');
        showError = true;
    } else setFieldError('servicecodeupError', '');

    required('prodesv11up', 'intypedes', 'Please enter product description.');
    required('remarkvup',   'intyperem', 'Please enter remarks.');

    if (!showError) $('#exampleModalCenter66Editup').modal('show');
}

function addeventupdate() {
	$('#exampleModalCenter66Editup').modal('hide');
    $.ajax({
        url: new URL('/jssl/invoice/updateadvnew', baseUrl),
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
           // invoice_type_id:intypeeditup.value
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
		   	consignee_id: document.getElementById("nandconvup").value,   // ✅ FIXED
		    bank_details_id: document.getElementById("banknamevup").value,
		   	delivery_condition_id: document.getElementById("deliveryconvup").value,
		   	regd_office_id: document.getElementById("officevvup").value,
			// [SVC/HSN FIX] send only real numeric IDs; blank means "cleared"
			s_code: toIdOrBlank(document.getElementById("newscode").value),
			h_code: toIdOrBlank(document.getElementById("newhcode").value),
        }),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Advance Invoice updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'AdvanceInvoiceEntry.jsp';
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
        error: function () {
            console.error('Request failed.');
        }
    });
}

function openModal(id, pn_id) {
	 // const allowed = window.allowedActions || [];

	if (!allowed.includes("Release")) {
	  alert(" You do not have permission to release.");
	  console.warn("Blocked edit attempt. User lacks release permission.");
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
        url: new URL('/jssl/invoice/advreleasebyidnew', baseUrl),
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
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Advance Invoice Released Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'AdvanceInvoiceEntry.jsp';
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

/* >>> OLD COMMENTED-OUT printRecord (first version, ~600 lines of dead code).
   Paste your original commented block back here unchanged if you want to keep it. <<< */


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
        const url = new URL(`/jssl/invoice/searchadvidnew?id=${id}`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch data");

        const json = await response.json();
        const Invoice_Data      = json.Invoice_Data;
        const Contractor_Data   = json.Contractor_Data;
        const QsPacking_Data    = json.QsPacking_Data;
        const tax               = json.tax;
        const Grand_Total_value = json.Grand_Total_value;

        // ---- resolve Invoice To / Consignee / Work Order from InvoiceContractMaster, fallback to Contractor_Data ----
        const ContractMasterData = json.InvoiceContractMaster || {};

        const matchedInvoiceTo = invoiceAddressList.find(a => String(a.id) === String(ContractMasterData.invoice_to_id));
        const resolvedInvoiceTo = matchedInvoiceTo
            ? matchedInvoiceTo.address
            : Contractor_Data[0].invoice_to_id_value;

        const matchedConsignee = consigneeAddressList.find(c => String(c.id) === String(ContractMasterData.consignee_id));
        const resolvedConsignee = matchedConsignee
            ? matchedConsignee.address
            : Contractor_Data[0].consignee_id_value;

        const resolvedInvoiceDistrict  = matchedInvoiceTo ? matchedInvoiceTo.district   : Contractor_Data[0].invoiceDistrict;
        const resolvedInvoicePinNo     = matchedInvoiceTo ? matchedInvoiceTo.pin_no     : Contractor_Data[0].invoicePinNo;
        const resolvedInvoiceStateName = matchedInvoiceTo ? matchedInvoiceTo.state_name : Contractor_Data[0].invoiceStateName;
        const resolvedInvoiceStateCode = matchedInvoiceTo ? matchedInvoiceTo.state_id   : Contractor_Data[0].invoiceStateCode;
        const resolvedInvoiceGstNo     = matchedInvoiceTo ? matchedInvoiceTo.gst_no     : Contractor_Data[0].invoiceGstNo;
        const resolvedInvoicePanNo     = matchedInvoiceTo ? matchedInvoiceTo.pan_no     : Contractor_Data[0].invoicePanNo;

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

        function cleanBusinessUnitAddress(name) {
            if (!name) return '';
            return name
                .replace(/^JBU-\d+\s*/i, '')
                .replace(/^JSW\s+Severfield\s+Structures\s+Limited\s*/i, '')
                .trim();
        }

        const matchedBU = businessUnitList.find(b => String(b.business_unit_id) === String(ContractMasterData.bid));
        const resolvedbudisplay = matchedBU
            ? `${cleanBusinessUnitAddress(matchedBU.business_unit_name)},${matchedBU.district || ''}-${matchedBU.pinNo || ''}<br>${matchedBU.location || ''}`
            : (Contractor_Data.length > 0 ? cleanBusinessUnitAddress(Contractor_Data[0].business_unit_name) : "");

        // ---- NEW: resolve Service Code / HSN Code from InvoiceContractMaster, fallback to Contractor_Data ----
        // [SVC/HSN FIX] if the master row exists, a null code means "cleared" -> blank (no fallback to old value)
        const hasMasterPrint = hasContractMaster(ContractMasterData);

        const matchedService = servicecodelist.find(s => String(s.servicecode_id) === String(ContractMasterData.s_code));
        const serviceDisplay = hasMasterPrint
            ? (matchedService ? matchedService.service_code : "")
            : (Contractor_Data.length > 0 ? Contractor_Data[0].s_code_value : "");

        const matchedHsn = hsncodelist.find(h => String(h.servicecode_id) === String(ContractMasterData.h_code));
        const hsnDisplay = hasMasterPrint
            ? (matchedHsn ? matchedHsn.service_code : "")
            : (Contractor_Data.length > 0 ? Contractor_Data[0].h_code_value : "");

        // combine — show whichever is present, "Service / HSN" if both exist
        const serviceHsnDisplay = [serviceDisplay, hsnDisplay]
            .filter(x => x && x.toString().trim() !== "" && x.toString().trim().toLowerCase() !== "null")
            .join(" / ");
        // ---- END NEW ----

        const Grand_Total_tax        = Grand_Total_value[0].Grand_Total_tax;
        const Total_adv_tax_Taxable  = Grand_Total_value[0].Total_adv_tax_Taxable;
        const Tax_Final_total        = Grand_Total_value[0].Tax_Final_total;
        const PBC_Final_total        = Grand_Total_value[0].PBC_Final_total;

        const invoiceno   = Invoice_Data.invoice_no;
        const lr_docketno = Invoice_Data.lr_docketno;
        const date_val    = Invoice_Data.date_val;
        const cancel      = Invoice_Data.cancel;
        const productdesc = Invoice_Data.product_desc;

        // ── Factory Data ──────────────────────────────────────────────────────
        const url_factory      = new URL(`/jssl/factory/getAllFactoryListSS`, baseUrl);
        const response_factory = await fetch(url_factory, { method: "GET", credentials: "include" });
        if (!response_factory.ok) throw new Error("Failed to fetch factory data");
        const factory_json = await response_factory.json();

        const factory_data_map = factory_json.FactoryDetails;
        const MumbaiAddress    = factory_data_map.find(f => f.id === "4");
        const reg_addresss     = MumbaiAddress.address;

        const bid = resolvedbudisplay;
        const state_Code = ContractMasterData.state_id   || Contractor_Data[0].invoiceStateCode;
        const Gst_Code   = ContractMasterData.gst_number || Contractor_Data[0].invoiceGstNo;
        const Pan_Code   = ContractMasterData.pan_number || Contractor_Data[0].invoicePanNo;

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
        const invoiceStateName            = resolvedInvoiceStateName;
        const consigneeStateName          = resolvedConsigneeStateName;
        const invoiceStateCode            = resolvedInvoiceStateCode;
        const consigneeStateCode          = resolvedConsigneeStateCode;
        const invoiceGstNo                = resolvedInvoiceGstNo;
        const consigneeGstNo              = resolvedConsigneeGstNo;
        const invoicePanNo                = resolvedInvoicePanNo;
        const consigneePanNo              = resolvedConsigneePanNo;
        const bankName                    = Contractor_Data[0].org_name;
        const account_number              = Contractor_Data[0].account_number;
        const branch_address              = Contractor_Data[0].bankName + ' ' + Contractor_Data[0].branch_address;
        const branch_code                 = Contractor_Data[0].branch_code;
        const swift_code                  = Contractor_Data[0].swift_code;
        const ifsc_code                   = Contractor_Data[0].ifsc_code;
        const work_date                   = Contractor_Data[0].work_date;

        const transport_name       = QsPacking_Data[0].transport_name;
        const vechile_no           = QsPacking_Data[0].vechile_no;
        const con_code_with_lot_no = QsPacking_Data[0].con_code_with_lot_no;

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
        const maxRows = 10;
        let tableRows = "";

        items.forEach((item, index) => {
            tableRows += `
                <tr class="product-row">
                    <td colspan="1" style="text-align:right;">${index + 1}</td>
                    <td colspan="4" class="desc-col descri">${item.scrap_name_type_id || ''}</td>
                    <td colspan="1" style="text-align:right !important;">${serviceHsnDisplay}</td>
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
        let taxRows = taxData.map((tax, i, arr) => {
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
        }).join('');

        // ── Tax Description Blocks ────────────────────────────────────────────
        let taxDetails      = taxData.map(tax => `<b>${tax.tax_name}:</b> ${tax.tax_value_in_words}<br>`).join('');
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
                    position: absolute; top: 50%; left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 120px; font-weight: bold; opacity: 0.15;
                    pointer-events: none; z-index: 9999; white-space: nowrap; letter-spacing: 10px;
                }
                .watermark.cancelled { color: #ff0000; }
                .watermark.verified  { color: #4CAF50; }
                html, body {
                    margin: 0; padding: 0;
                    font-family: "Times New Roman", Times, serif;
                    color: black !important; background-color: #fff !important;
                    font-size: 10px; line-height: 2;
                }

                /* ── PAGE FIX: one copy = one sheet, no fixed 297mm height / 202mm width ── */
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

                .invoice-container {
                    width: 100%; height: auto; overflow: visible;
                    -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision;
                    margin: 0; padding: 1mm;
                }
                table { border-collapse: collapse !important; table-layout: fixed; width: 100%; margin: 0; padding: 0; }

                /* do not repeat the product table header on another printed page */
                .product-table thead { display: table-row-group; }

                td, th { border-right: 0.5px solid #000; border-bottom: 0.5px solid #000; padding: 2px 4px; vertical-align: top; font-size: 10px; line-height: 1.05; word-wrap: break-word; }
                tr { page-break-inside: avoid; }
                tr:first-child th { border-top: 0.5px solid #000; }
                td:first-child, th:first-child { border-left: 0.5px solid #000; }
                .company-details-table { border-top: 0.5px solid #000 !important; }
                .header, .footer { text-align: center; margin: 0; padding: 0; }
                .invoice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2mm; }
                .gst-text { font-size: 15px; font-weight: 500; text-align: center; margin-left: 300px !important; }
                .copy-label { font-size: 12px; font-weight: normal; }
                td br, th br { display: block; margin: 0; line-height: 1; }
                .company-details-table td { padding: 4px; font-size: 11px !important; }
                .company-logo img { width: 60px; height: auto; display: block; margin-bottom: 2px; }
                .product-row td:nth-child(n+4) { text-align: right !important; }
                .product-row td, .empty-row td { height: 22px; }
                .empty-row td { border-top: none !important; border-bottom: none !important; }
                .last-product td { border-bottom: none !important; }
                .product-table .desc-col { line-height: 1.5 !important; white-space: normal; word-break: break-word; }
                .product-table .fright-row .fright-data { line-height: 1.6 !important; padding: 5px !important; }
                .total-body .total-datatd  { line-height: 1.6 !important; padding: 5px !important; }
                .total-body .total-datatds { line-height: 2.5 !important; text-align: right !important; }
                .desc-col.descri { font-size: 7px !important; padding: 1px !important; }
                .desc-col.tols   { text-align: right !important; }
                .desc-col.prs    { text-align: right !important; }
                .desc-col.weits  { text-align: right !important; }
                .desc-col.qtys   { text-align: right !important; }
                .product-table th, .product-table td { padding: 3px 5px; line-height: 1.2; }
                .product-row td { border-bottom: none; }
                .freight-vlaue { text-align: right !important; }
                .fright-row    { border: 0.5px solid #000 !important; }
                .tax-row .tax-name { line-height: 0.8 !important; text-align: right !important; padding: 5px !important; }
                .tax-row .tax-per { text-align: right !important; vertical-align: middle !important; }
                .total-word .total-words-des { line-height: 1.2 !important; font-size: 8px !important; padding: 0 0 5px 5px !important; }
                .total-words-des.ss { vertical-align: middle !important; }
                .total-word .total-words-val { text-align: right !important; vertical-align: middle !important; }
                .particulars-row { line-height: 1 !important; }
                .particulars-row td { padding-top: 5px !important; }
                .particulars-row .particulars-row-prtd { font-size: 8px !important; }
                .particulars-row-body { padding-top: 5px !important; }
                .particulars-row-body .particulars-row-body-td { text-align: right !important; font-size: 8px !important; }
                .td-body-tax { text-align: right !important; line-height: 2 !important; }
                .Bank_details { line-height: 1.8 !important; font-size: 8px !important; }
                .last-data td { line-height: 1.5 !important; font-size: 9px !important; padding-top: 6px !important; }
                .last-data td:last-child { text-align: center !important; vertical-align: middle !important; }
                .last-data td:last-child span { display: block; text-align: center; }
                .footer { padding-top: 6px !important; }
                .footer p { font-size: 9px; line-height: 1.2; margin: 0; padding: 0; }
                .invoice-line { display: flex; justify-content: space-between; width: 80%; }
                .fixed-8px td { font-size: 8px !important; line-height: 1.1 !important; }
                .terms { margin-top: 2mm; }
                .header, .footer, .gst-text, .copy-label { text-align: center; }
                .samefontweight { font-weight: 550; }
                .fulladdress, .conaddress, .facotry_address { white-space: pre-line; display: inline-block; line-height: 1.5; }
            </style>

            <div class="invoice-container">
                ${cancel === 'true' ? `<div class="watermark cancelled">CANCELLED</div>` : ''}

                <div class="invoice-header">
                    <b>   </b>
                    <div class="gst-text">RECEIPT VOUCHER</div>
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
                                <div style="font-size:12px;"><span class="samefontweight">Invoice No: </span><span class="invoiceNumber"></span></div>
                                <div><span class="samefontweight">Date:</span> <span class="date"></span></div>
                            </div>
                            <br>
                            <span class="samefontweight">Contract No Reference No:</span> <span class="contrefno"></span><br>
                            <span class="samefontweight">Date &amp; Time of supply:</span> <span class="datetime"></span><br>
                            <br>
                            <span class="samefontweight">Work/Purchase Order No:</span> <span class="workor"></span><br>
                            <span class="samefontweight">Date of Order:</span> <span class="dateor"></span><br>
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
                            <span class="samefontweight">Date of Notification</span><br>
                            <span class="samefontweight">Exempted note under:</span><br>
                            <span class="samefontweight">Tax is Payable on reverse charge (Yes/No):</span> <span class="taxpayre"></span><br>
                        </td>
                        <td colspan="3" style="font-size:7px;">
                            <span class="samefontweight">Export Details:</span><br>
                            <span class="samefontweight">ARE No:</span> <span class="areano"></span><br>
                            <span class="samefontweight">LUT No:</span> <span class="lutno"></span><br>
                            <span class="samefontweight">Container No:</span> <span class="contlo"></span><br>
                            <span class="samefontweight">EPCG License No:</span> <span class="epoglo"></span><br>
                        </td>
                        <td colspan="3" style="font-size:7px;">
                            <span class="samefontweight">Transporter:</span> <span class="trans"></span><br>
                            <span class="samefontweight">Vehicle No:</span> <span class="vehino"></span><br>
                            <span class="samefontweight">LR/DOCKET No:</span> <span class="lrdoc"></span><br>
                            <span class="samefontweight">Date:</span> <span class="lrdate"></span><br>
                        </td>
                        <td colspan="3" style="font-size:7px;">
                            <span class="samefontweight">Shipment Mode:</span> <span class="shipmo"></span><br>
                            <span class="samefontweight">Delivery Condition:</span> <span class="delcon"></span><br>
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

            container.querySelector(".reg_add").textContent    = reg_addresss;
            container.querySelector(".gst_code").textContent   = Gst_Code;
            container.querySelector(".state_code").textContent = state_Code;
            container.querySelector(".pan_code").textContent   = Pan_Code;
            container.querySelector('.bid').innerHTML = bid;

            container.querySelector('.datetime').textContent     = formattedDateTime;
            container.querySelector('.dateor').textContent       = formatDMY(work_date);
            container.querySelector('.date').textContent         = currentDate;
            container.querySelector('.invoiceNumber').textContent = invoiceno;

            const invoiceToValue = invoice_to_id_value || '';
            const invoiceLines = invoiceToValue.split(/\r?\n/);
            const line1 = invoiceLines[0] || '';
            const line2 = invoiceLines[1] || '';
            const line3 = (invoiceLines[2] || '');

            container.querySelector('.shipto11').textContent = line1;
            container.querySelector('.shipto11add2').textContent = line2;
            container.querySelector('.shipto11add3').textContent = line3;

            const districtAndPin = [
                resolvedInvoiceDistrict,
                resolvedInvoicePinNo
            ].filter(x => x && x.toString().trim() !== "").join("-");

            const invoiceAddress = [
                Invoice_Data.addressLine1up,
                Invoice_Data.addressLine2up,
                Invoice_Data.addressLine3up,
                districtAndPin
            ].filter(x => x && x.toString().trim() !== "").join("\n");

            container.querySelector('.fulladdress').textContent = invoiceAddress;
            container.querySelector('.statename').textContent = invoiceStateName || '';
            container.querySelector('.stcode11').textContent = invoiceStateCode || '';
            container.querySelector('.placeofsupply').textContent = Invoice_Data.supply_place || '';
            container.querySelector('.ingst').textContent = invoiceGstNo || '';
            container.querySelector('.panin').textContent = invoicePanNo || '';

            const consigneeValue = consignee_id_value || '';
            const consigneeLines = consigneeValue.split(/\r?\n/);
            const conLine1 = consigneeLines[0] || '';
            const conLine2 = consigneeLines[1] || '';
            const conLine3 = consigneeLines[2] || '';

            container.querySelector('.conname').textContent = conLine1;
            container.querySelector('.conname1').textContent = conLine2;
            container.querySelector('.conname2').textContent = conLine3;

            const consigneeDistrictAndPin = [
                resolvedConsigneeDistrict,
                resolvedConsigneePinNo
            ].filter(x => x && x.toString().trim() !== "").join("-");

            const consigneeAddress = [
                Invoice_Data.conaddressLine1,
                Invoice_Data.conaddressLine2,
                Invoice_Data.conaddressLine3,
                consigneeDistrictAndPin
            ].filter(x => x && x.toString().trim() !== "").join("\n");

            container.querySelector('.conaddress').textContent = consigneeAddress;
            container.querySelector('.state').textContent          = consigneeStateName || '';
            container.querySelector('.stateco').textContent        = consigneeStateCode || '';
            container.querySelector('.congst').textContent         = consigneeGstNo || '';
            container.querySelector('.pancon').textContent         = consigneePanNo || '';

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

            container.querySelector('.qtytotal').textContent      = total_qty || '';
            container.querySelector('.wiegtotal').textContent     = total_kgs || '';
            container.querySelector('.val11').textContent         = formatAmount(basic_value);
            container.querySelector('.grandlast').textContent     = formatAmount(Grand_Total_tax);
            container.querySelector('.grandlast12new').textContent = formatAmount(PBC_Final_total);
            container.querySelector('.taxbasic').textContent      = formatAmount(Total_adv_tax_Taxable);
            container.querySelector('.taxtotal').textContent      = formatAmount(Tax_Final_total);

            container.querySelector('.bankname').textContent = bankName || '';
            container.querySelector('.acc').textContent      = account_number || '';
            container.querySelector('.bname').textContent    = branch_address || '';
            container.querySelector('.code').textContent     = branch_code || '';
            container.querySelector('.scode').textContent    = swift_code || '';
            container.querySelector('.ifsc').textContent     = ifsc_code || '';
        }

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
                    // Fit each copy on exactly one sheet (prevents spill-over / blank page):
                    // printable height = 281mm (297mm - 2 x 8mm), converted to px at 96dpi
                    const maxH = (281 * 96 / 25.4) - 8;

                    printWindow.document.querySelectorAll('.page').forEach(page => {
                        const inv = page.querySelector('.invoice-container');
                        if (!inv) return;
                        const h = inv.getBoundingClientRect().height;
                        if (h > maxH) {
                            inv.style.zoom = (maxH / h).toFixed(3);
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
/* >>> OLD COMMENTED-OUT printRecordView (~600 lines of dead code).
   Paste your original commented block back here unchanged if you want to keep it. <<< */

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
	    url: new URL('/jssl/invoice/advancecancelbyidnew', baseUrl),   // cancel endpoint
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

	            const popup = $('<div class="popup"> Advance Invoice Cancelled Successfully!</div>')
	                .appendTo('body')
	                .hide()
	                .fadeIn(400);

	            setTimeout(function () {
	                popup.fadeOut(400, function () {
	                    $(this).remove();
	                    window.location = 'AdvanceInvoiceEntry.jsp';
	                });
	            }, 800);

	        } else {
				const errorMessage = data.message || 'Failed to create invoice.';
				              $('#errorMessage').text(errorMessage);
				              $('#exampleModalCenter16').modal('hide');
	        }
	    },
	    error: function () {
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

	function toTitleCase(str) {
	    return str
	        .toLowerCase()
	        .replace(/\b\w/g, function(char) {
	            return char.toUpperCase();
	        });
	}
	
	
	
	
	const selectErrorMap = {
	    inbusunit:     ['busunitError'],
	    ininto:        ['intoError'],
	    work:          ['workError'],
	    billing:       ['billingError'],
	    officeservice: ['servicecodeError4'],
	    officehsn:     ['servicecodeError4'],
	    bunitvup:      ['bunitvupError'],
	    intovup:       ['intovupError'],
	    workordervup:  ['workordervupError'],
	    nandconvup:    ['nandconvupError'],
	    newscode:      ['servicecodeupError'],
	    newhcode:      ['servicecodeupError']
	};

	$(document).on('change select2:select', 'select', function () {
	    const errIds = selectErrorMap[this.id];
	    if (errIds && String($(this).val() || '').trim() !== '') {
	        errIds.forEach(id => setFieldError(id, ''));
	    }
	});

	$(document).on('input', '#prodes',      () => setFieldError('productCodeError3', ''));
	$(document).on('input', '#remark',      () => setFieldError('productCodeError4', ''));
	$(document).on('input', '#prodesv11up', () => setFieldError('intypedes', ''));
	$(document).on('input', '#remarkvup',   () => setFieldError('intyperem', ''));

	$('#exampleModalScrollable, #exampleModalScrollableEditUp').on('hidden.bs.modal', function () {
	    $(this).find('.field-error, .error-message').hide().text('');
	});