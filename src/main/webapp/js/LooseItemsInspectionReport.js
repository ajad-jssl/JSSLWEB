document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();

    if (!allowedActions.includes("view")) {
        blockUI();   // 🔒 permanent block
        return;
    }
});


const MainPage = 'LooseItemsInspectionReport.jsp';
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

document.addEventListener("DOMContentLoaded", function () {

    loadFactories();

    document.getElementById("factory").addEventListener("change", function () {
        if (this.value) {
            loadContracts();
        }
    });

    document.getElementById("Contract1").addEventListener("change", function () {
        const factory = document.getElementById("factory").value;
        if (factory && this.value) {
            loadPhases(this.value);
        }
    });

    document.getElementById("Phase1").addEventListener("change", function () {
        const factory = document.getElementById("factory").value;
        const contractId = document.getElementById("Contract1").value;

        if (factory && contractId && this.value) {
            loadLoads(contractId, this.value);
        }
    });

    document.getElementById("Load1").addEventListener("change", function () {
        const factory = document.getElementById("factory").value;
        const contractId = document.getElementById("Contract1").value;
        const pzone = document.getElementById("Phase1").value;

        if (factory && contractId && pzone && this.value) {
            loadReport(contractId, pzone, this.value);
        }
    });

});


/* =============================
   LOAD FACTORIES
============================= */

function loadFactories() {

    fetch(new URL('/jssl/factory/getAllFactoryList', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        const factorySelect = document.getElementById('factory');

        factorySelect.innerHTML =
            `<option value="">Select factory</option>
             <option value="ALL">ALL</option>`;

        if (Array.isArray(data.FactoryDetails)) {

            data.FactoryDetails.forEach(factory => {

                const option = document.createElement('option');

                option.value = factory.id;
                option.textContent = factory.factory_name;

                factorySelect.appendChild(option);

            });

        } else {
            console.error("FactoryDetails is not an array:", data.FactoryDetails);
        }

    })
    .catch(error => {
        console.error('Error fetching factory:', error);
    });

}


/* =============================
   LOAD CONTRACTS
============================= */

function loadContracts() {

    const factory = document.getElementById("factory").value;

    const ddl = document.getElementById("Contract1");

    ddl.innerHTML = `<option value="">Select Contract</option>`;

    fetch(
        new URL(`/api/qc/looseinspection/report/contracts?factory=${factory}`, baseUrl1),
        { method: "GET", credentials: "include" }
    )
    .then(res => res.json())
    .then(data => {

        data.forEach(row => {

            const opt = document.createElement("option");

            opt.value = row.contract_id;
            opt.textContent = row.JobCode;

            ddl.appendChild(opt);

        });

    })
    .catch(err => console.error("Contracts error", err));

}


/* =============================
   LOAD PHASES
============================= */

function loadPhases(contractId) {

    const factory = document.getElementById("factory").value;

    const ddl = document.getElementById("Phase1");

    ddl.innerHTML = `<option value="">Select Phase</option>`;

    fetch(
        new URL(`/api/qc/looseinspection/report/pzone?contractId=${contractId}&factory=${factory}`, baseUrl1),
        { method: "GET", credentials: "include" }
    )
    .then(res => res.json())
    .then(data => {

        data.forEach(row => {

            const opt = document.createElement("option");

            opt.value = row.pzone;
            opt.textContent = row.pzone;

            ddl.appendChild(opt);

        });

    })
    .catch(err => console.error("Pzone error", err));

}


/* =============================
   LOAD LOADS
============================= */

function loadLoads(contractId, pzone) {

    const factory = document.getElementById("factory").value;

    const ddl = document.getElementById("Load1");

    ddl.innerHTML = `<option value="">Select Load</option>`;

    fetch(
        new URL(`/api/qc/looseinspection/report/loads?contractId=${contractId}&pzone=${pzone}&factory=${factory}`, baseUrl1),
        { method: "GET", credentials: "include" }
    )
    .then(res => res.json())
    .then(data => {

        data.forEach(row => {

            const opt = document.createElement("option");

            opt.value = row.load_id;
            opt.textContent = row.load_no;

            ddl.appendChild(opt);

        });

    })
    .catch(err => console.error("Load error", err));

}


/* =============================
   LOAD REPORT
============================= */

function loadReport(contractId, pzone, loadId) {

    const factory = document.getElementById("factory").value;

    if (!contractId || !pzone || !loadId || !factory) return;

    fetch(
        new URL(
            `/api/qc/looseinspection/report/details?contractId=${contractId}&pzone=${pzone}&loadId=${loadId}&factory=${factory}`,
            baseUrl1
        ),
        { method: "GET", credentials: "include" }
    )
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(data => {

        if (!data || data.length === 0) {

            alert("No inspection data found");

            document.getElementById("container1").style.display = "none";

            return;
        }

        document.getElementById("hdrContract1").textContent =
            document.getElementById("Contract1").selectedOptions[0]?.text || "";

        document.getElementById("hdrPhase1").textContent =
            document.getElementById("Phase1").selectedOptions[0]?.text || "";

        document.getElementById("hdrLoad1").textContent =
            document.getElementById("Load1").selectedOptions[0]?.text || "";

        const tbody = document.getElementById("reportBody");

        tbody.innerHTML = "";

        data.forEach((row, i) => {

            tbody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td class="text-center">${i + 1}</td>
                    <td>${row.description?.trim() || ""}</td>
                    <td>${row.mark?.trim() || ""}</td>
                    <td class="text-center">${row.pqty || ""}</td>
                    <td>${row.ssize || ""}</td>
                    <td class="text-right">${row.dims1 || ""}</td>
                    <td>${row.weld_visual || ""}</td>
                    <td>${row.result || ""}</td>
                    <td>${row.weld_inspected_by || ""}</td>
                    <td>
                        ${row.weld_date
                        ? new Date(row.weld_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                        })
                        : ""}
                    </td>
                </tr>
            `);

        });

        document.getElementById("container1").style.display = "block";

    })
    .catch(err => {

        console.error("Report load error:", err);

        alert("Failed to load report. Please try again.");

    });

}

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