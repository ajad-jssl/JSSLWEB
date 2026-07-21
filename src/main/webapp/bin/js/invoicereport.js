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
const tbody = document.querySelector("#TableID tbody");

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
async function loadInvoiceReport() {

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
					<td>${item.inv_type ?? ''}</td>
                    <td>${item.jobCode ?? ''}</td>
                    <td>${item.loadno ?? ''}</td>
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


