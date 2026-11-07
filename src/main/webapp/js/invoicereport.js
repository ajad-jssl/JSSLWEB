document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();

    if (!allowedActions.includes("view")) {
        blockUI();   // 🔒 permanent block
        return;
    }

    
});


const MainPage = 'InvoiceReport.jsp';
const UserId = sessionStorage.getItem('username');

let allowedActions = [];

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
            {
                method: "GET",
                credentials: "include", // 🔐 send cookies/session
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch actions");
        }

        allowedActions = await response.json();
		
		

    } catch (error) {
        console.error("Error:", error);
    }
}

const selectedFactoryId = localStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); 
    if (selectedFactoryId) {
        fetchcont(selectedFactoryId);
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); 
    if (selectedFactoryId) {
        fetchcont1(selectedFactoryId);
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

// Fetch contracts for a factory and add "All" option

// ================= DOM ELEMENTS =================
const factoryDropdown = document.getElementById("factory");
const typeDropdown = document.getElementById("select_type");
const contractDropdown = document.getElementById("Contract");
const contractDropdown2 = document.getElementById("contract2");
const fromDateInput = document.getElementById("date");
const toDateInput = document.getElementById("todate");
const container = document.getElementById("container1");
const tbody = document.querySelector("#Table_ID tbody");

// ================= INITIAL STATE =================
fromDateInput.disabled = true;
toDateInput.disabled = true;
container.style.display = "none";

// ================= ENABLE / DISABLE DATE FIELDS =================
function toggleDateFields() {
    const enable =
        factoryDropdown.value &&
        typeDropdown.value &&
        contractDropdown.value;

    fromDateInput.disabled = !enable;
    toDateInput.disabled = !enable;

    if (!enable) {
        fromDateInput.value = "";
        toDateInput.value = "";
        container.style.display = "none";
        tbody.innerHTML = "";
    }
}

// ================= FETCH CONTRACTS BASED ON FACTORY =================
async function fetchcont(factoryId) {
    try {
        const url = new URL(`/jssl/contracts/byfactory`, baseUrl);
        url.searchParams.append("factory", factoryId);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch contractors");

        const json = await response.json();

        contractDropdown.innerHTML = `
            <option value="">Select contractor</option>
           <option value="ALL">ALL</option>
        `;

        if (json.Data && json.Data.length) {
            json.Data.forEach((contractor) => {
                if (contractor.contract_id && contractor.contract_name) {
                    const option = document.createElement("option");
                    option.value = contractor.contract_id;
                    option.textContent = contractor.contract_name;
                    contractDropdown.appendChild(option);
                }
            });
        }

    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

// ================= FACTORY CHANGE =================
factoryDropdown.addEventListener("change", function () {

    const factoryId = this.value;

    // Reset dependent fields
    contractDropdown.innerHTML = `<option value="">Select contractor</option>`;
    typeDropdown.value = "";
    fromDateInput.value = "";
    toDateInput.value = "";
    tbody.innerHTML = "";
    container.style.display = "none";

    toggleDateFields();

    if (factoryId) {
        fetchcont(factoryId);
    }
});

// ================= TYPE CHANGE =================
typeDropdown.addEventListener("change", function () {
    tbody.innerHTML = "";
    container.style.display = "none";
    toggleDateFields();
});

// ================= CONTRACT CHANGE =================
contractDropdown.addEventListener("change", function () {
    tbody.innerHTML = "";
    container.style.display = "none";
    toggleDateFields();
});

// ================= DATE VALIDATION =================
[fromDateInput, toDateInput].forEach(input => {
    input.addEventListener("focus", (event) => {

        if (!factoryDropdown.value) {
            alert("Please select Factory first");
            factoryDropdown.focus();
            event.target.blur();
            return;
        }

        if (!typeDropdown.value) {
            alert("Please select Type first");
            typeDropdown.focus();
            event.target.blur();
            return;
        }

        if (!contractDropdown.value) {
            alert("Please select Contract first");
            contractDropdown.focus();
            event.target.blur();
            return;
        }
    });
});

// ================= LOAD INVOICE REPORT =================
/*async function loadInvoiceReport() {

    const factoryId = factoryDropdown.value;
    const type = typeDropdown.value;
    let contractId = contractDropdown.value;
    const fromDate = fromDateInput.value;
    const toDate = toDateInput.value;

    // ===== VALIDATIONS =====
    if (!factoryId || !type || !contractId) {
        alert("Please select Factory, Type and Contract");
        container.style.display = "none";
        return;
    }

    if (!fromDate || !toDate) {
        alert("Please select From Date and To Date");
        container.style.display = "none";
        return;
    }

    try {

        const url = new URL(`/jssl/invoice/g2/newinvreport`, baseUrl);
        url.searchParams.append("contract_id", contractId);
        url.searchParams.append("factory", factoryId);  // IMPORTANT
        url.searchParams.append("from", fromDate);
        url.searchParams.append("to", toDate);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch report");

        const json = await response.json();
        const data = json.Data;

        tbody.innerHTML = "";

        if (!data || data.length === 0) {
            alert("No records found");
            container.style.display = "none";
            return;
        }

        container.style.display = "block";

        data.forEach((item, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.invoice_no ?? ''}</td>
					<td>${item.verified_date ?? ''}</td>
                    <td>${(item.jobCode ?? '').trim() || item.contract_id || ''}</td>
                    <td>${item.loadno ?? item.load_id ?? ''}</td>
                    <td>${item.workorder_no ?? ''}</td>
                    <td>${item.work_date ?? ''}</td>
                    <td>${item.address ?? ''}</td>
                    <td>${item.verified_date ?? ''}</td>
                    <td>${item.scrap_type ?? ''}</td>
                    <td>${item.unit_name ?? ''}</td>
                    <td>${item.qty ?? 0}</td>
                    <td>${item.per_kgs ?? 0}</td>
                    <td>${item.unit_price ?? 0}</td>
                    <td>${item.total ?? 0}</td>
                    <td>${item.freight ?? 0}</td>
                    <td>${item.wb_weight ?? ''}</td>
                    <td>${item.transport_name ?? ''}</td>
                    <td>${item.vehicle_no ?? ''}</td>
                    <td>${item.gst_number ?? ''}</td>
                    <td>${item.business_unit ?? ''}</td>
                    <td>${item.adv_tax_rec ?? 0}</td>
                    <td>${item.adv_nontax_rec ?? 0}</td>
                    <td>${item.IGSTP ?? 0}</td>
                    <td>${item.CGSTP ?? 0}</td>
                    <td>${item.SGSTP ?? 0}</td>
                    <td>${item.IGSTV ?? 0}</td>
                    <td>${item.CGSTV ?? 0}</td>
                    <td>${item.SGSTV ?? 0}</td>
                    <td>${item.IGSTA ?? 0}</td>
                    <td>${item.CGSTA ?? 0}</td>
                    <td>${item.SGSTA ?? 0}</td>
                    <td>${item.ptd ?? 0}</td>
                    <td>${item.ptc ?? 0}</td>
                    <td>${item.total_invoice_value ?? 0}</td>
                    <td>${item.cgst ?? ''}</td>
                    <td>${item.cpan ?? ''}</td>
                    <td>${item.remarks ?? ''}</td>
                    <td>${item.status ?? ''}</td>
                    <td>${item.factory ?? ''}</td>
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", row);
        });

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong while fetching the report");
        container.style.display = "none";
    }
}
*/

async function loadInvoiceReport() {

    const factoryId = factoryDropdown.value;
    const type = typeDropdown.value;
    const contractId = contractDropdown.value;
    const fromDate = fromDateInput.value;
    const toDate = toDateInput.value;

    // ===== VALIDATIONS =====
    if (!factoryId || !type || !contractId) {
        alert("Please select Factory, Type and Contract");
        container.style.display = "none";
        return;
    }

    if (!fromDate || !toDate) {
        alert("Please select From Date and To Date");
        container.style.display = "none";
        return;
    }

    // ===== HELPERS =====
    const esc = v => String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    const txt = v => esc(v).trim();
    const fmtDate = d => (d ? esc(String(d).substring(0, 10)) : '');
    const fmtDateTime = d => (d ? esc(String(d).substring(0, 19)) : '');
    const num = v => (v === null || v === undefined || v === '' ? 0 : v);

    try {

        const url = new URL(`/jssl/invoice/g2/newinvreport`, baseUrl);
        url.searchParams.append("contract_id", contractId);
        url.searchParams.append("factory", factoryId);
        url.searchParams.append("from", fromDate);
        url.searchParams.append("to", toDate);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch report");

        const json = await response.json();

        if (json.status === "error") {
            throw new Error(json.message || "Server error");
        }

        const data = json.Data;

        tbody.innerHTML = "";

        if (!data || data.length === 0) {
            alert("No records found");
            container.style.display = "none";
            return;
        }

        container.style.display = "block";

        const rows = data.map((item, index) => {

            const hsnSac = [item.hsncode, item.scode]
                .filter(v => v && String(v).trim() !== '')
                .join(' / ');

            return `
            <tr>
                <td>${index + 1}</td>
                <td>${txt(item.invoice_no)}</td>
                <td>${fmtDateTime(item.created_date)}</td>
                <td>${txt(item.jobCode) || txt(item.contract_id)}</td>
                <td>${txt(item.loadno ?? item.load_id)}</td>
                <td>${txt(item.reference_no)}</td>
                <td>${txt(item.customer_name)}</td>
                <td>${txt(item.address)}</td>
                <td>${txt(item.cgst)}</td>
                <td>${txt(item.cpan)}</td>
                <td>${txt(item.workorder_no)}</td>
                <td>${fmtDate(item.work_date)}</td>
                <td>${txt(item.scrap_name)}</td>
                <td>${esc(hsnSac)}</td>
                <td>${txt(item.remarks_type) || txt(item.inv_type)}</td>
                <td>${num(item.freight)}</td>
                <td>${item.wb_weight ?? ''}</td>
                <td>${txt(item.unit_name)}</td>
                <td>${num(item.qty)}</td>
                <td>${num(item.weight)}</td>
                <td>${num(item.unit_price)}</td>
                <td>${num(item.total)}</td>
                <td>${num(item.CGSTP)}</td>
                <td>${num(item.CGSTV)}</td>
                <td>${num(item.SGSTP)}</td>
                <td>${num(item.SGSTV)}</td>
                <td>${num(item.IGSTP)}</td>
                <td>${num(item.IGSTV)}</td>
                <td>${num(item.TCSP)}</td>
                <td>${num(item.TCSV)}</td>
                <td>${num(item.total_invoice_value)}</td>
                <td>${num(item.adv_nontax_rec)}</td>
                <td>${num(item.adv_tax_rec)}</td>
                <td>${num(item.IGSTA)}</td>
                <td>${num(item.CGSTA)}</td>
                <td>${num(item.SGSTA)}</td>
                <td>${num(item.ptc)}</td>
                <td>${num(item.ptd)}</td>
                <td>${txt(item.vehicle_no)}</td>
                <td>${txt(item.transport_name)}</td>
                <td>${txt(item.vendorname)}</td>
                <td>${fmtDate(item.vendorinvdate)}</td>
                <td>${txt(item.vendorinvno)}</td>
                <td>${num(item.vendorqty)}</td>
                <td>${txt(item.remarks)}</td>
                <td>${txt(item.status)}</td>
                <td>${txt(item.factory)}</td>
            </tr>`;
        });

        tbody.innerHTML = rows.join('');

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong while fetching the report");
        container.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Fetch departments from the backend
	fetch(new URL('/jssl/factory/getAllFactoryList', baseUrl1), {
	    credentials: "include"
	})
  /*  fetch('http://localhost:8004/api/employee/all')*/
        .then(response => response.json())
        .then(data => {
            // Get the select element
            const departmentSelect = document.getElementById('factory');
            
            // Clear any existing options (if any)
            departmentSelect.innerHTML = `<option value="">Select</option>
		   								  <option value="ALL">ALL</option>`;
            
            // Loop through the data and create new option elements
			if (Array.isArray(data.FactoryDetails)) {
			          data.FactoryDetails.forEach(factory => {
                const option = document.createElement('option');
                option.value = factory.id;  // Assuming 'deptID' is the value for option
                option.textContent = factory.factory_name;  // Assuming 'deptname' is the text for option
                departmentSelect.appendChild(option);
            });
			} else {
			           console.error("FactoryDetails is not an array:", data.FactoryDetails);
			       }
        })
        .catch(error => {
            console.error('Error fetching factory:', error);
        });
});

document.addEventListener("DOMContentLoaded", function () {
	fetchinvoicetype();
});
async function fetchinvoicetype() {
    try {
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetypenew`, baseUrl1);

        const selectedFactoryId = localStorage.getItem("selectedFactoryId");

        // Fetch data from API
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"   // ✅ Always send JSESSIONID cookie
        });
        if (!response.ok) throw new Error("Failed to fetch invoicetype");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.INVOICE_TYPE_LIST.length) {
            console.warn("No invoicetype found.");
            return;
        }

        // Get the select element for invoice types
        const selectElement = document.getElementById("type1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Type</option>`;

        // Populate dropdown options
        json.INVOICE_TYPE_LIST.forEach((invoicetype) => {
            if (invoicetype.type_no && invoicetype.type && invoicetype.type !== "SCRAP" ) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = invoicetype.type_no;
                option.textContent = invoicetype.type;
                selectElement.appendChild(option);
            }
        });

        // Add event listener for selection change
        selectElement.addEventListener("change", function () {
            const selectedinvoicetype = selectElement.value;
            const contractsel = document.getElementById("contract2");
            //const mileSelect = document.getElementById("mile");

            // Clear dropdowns
            contractsel.innerHTML = '<option value="">Select Contract</option>';
           // mileSelect.innerHTML = '<option value="">Select Milestone</option>';

            // If invoice type is 1 → load contracts, otherwise leave blank
            if (selectedinvoicetype == "1") {
                fetchcont1(selectedFactoryId);
            }
        });

    } catch (error) {
        console.error("Error fetching invoice types:", error);
    }
}

async function fetchcont1(factoryId) {
    try {
        const url = new URL(`/jssl/contracts/byfactory`, baseUrl);
        url.searchParams.append("factory", factoryId);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch contractors");

        const json = await response.json();

        contractDropdown2.innerHTML = `
            <option value="">Select contractor</option>
           <option value="ALL">ALL</option>
        `;

        if (json.Data && json.Data.length) {
            json.Data.forEach((contractor) => {
                if (contractor.contract_id && contractor.contract_name) {
                    const option = document.createElement("option");
                    option.value = contractor.contract_id;
                    option.textContent = contractor.contract_name;
                    contractDropdown2.appendChild(option);
                }
            });
        }

    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

document.getElementById("contract2").addEventListener("change", async function () {

    const contractId = this.value;
    const tableBody = document.querySelector("#Table2 tbody");

    tableBody.innerHTML = "";

    if (!contractId) return;

    try {

        const url = new URL(`/jssl/openingbalance/bycontract`, baseUrl);
        url.searchParams.append("contract_id", contractId);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        const json = await response.json();

        if (json.status === "yes" && json.Data.length > 0) {

            let rows = "";

            json.Data.forEach((item, index) => {

                const taxable = item.taxable ?? 0.00;
                const nonTaxable = item.nontaxable ?? 0.00;

                rows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${parseFloat(taxable).toFixed(2)}</td>
                        <td>${parseFloat(nonTaxable).toFixed(2)}</td>
                    </tr>
                `;
            });

            tableBody.innerHTML = rows;

        } else {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">No balance found</td>
                </tr>
            `;
        }

    } catch (error) {

        console.error("Error fetching opening balance:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-danger">Error loading data</td>
            </tr>
        `;
    }

});

function blockUI() {

    const container = document.getElementById("container-wrapper");

    if (!container) return;

    // Disable interaction only inside main content
    container.style.pointerEvents = "none";
    container.style.userSelect = "none";
    container.style.opacity = "0.5";
    container.style.position = "relative";

    // Create overlay dynamically
    const overlay = document.createElement("div");
    overlay.id = "contentBlockOverlay";

    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.zIndex = "999";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.color = "white";
    overlay.style.fontSize = "22px";
    overlay.style.textAlign = "center";

    overlay.innerHTML = `
        <div>
            🚫 Access Denied <br>
            <small>You don’t have permission to view this page</small>
        </div>
    `;

    container.appendChild(overlay);
}

document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("btnExportInvoice");

    if (!btn) {
        console.error("Export button #btnExportInvoice not found in DOM");
        return;
    }

    btn.addEventListener("click", function () {
        exportInvoiceReportToExcel();
    });
});

function exportInvoiceReportToExcel() {

    const table = document.getElementById("Table_ID");

    if (!table) {
        console.error("Table #Table_ID not found in DOM");
        return;
    }

    const tbody = table.querySelector("tbody");
    if (!tbody || tbody.rows.length === 0) {
        alert("No data to export. Please load the report first.");
        return;
    }

    // Wrap the table HTML in a minimal Excel-flavored HTML document.
    // Excel recognizes this MIME/header pair and opens it as a native worksheet.
    const template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
        'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
        'xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head><meta charset="UTF-8">' +
        '<!--[if gte mso 9]><xml>' +
        '<x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>' +
        '<x:Name>Invoice Report</x:Name>' +
        '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>' +
        '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>' +
        '</xml><![endif]-->' +
        '</head><body>' +
        table.outerHTML +
        '</body></html>';

    const blob = new Blob([template], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Invoice_Report.xls";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
