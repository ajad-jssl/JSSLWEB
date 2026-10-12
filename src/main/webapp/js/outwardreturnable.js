let userMap1 = {}; 

async function loadUserMap() {
    try {
        const response = await fetch(new URL('/api/websmartuser/getAll', baseUrl1), {
            credentials: "include"
        });
        const data = await response.json();
        if (data && Array.isArray(data.Data)) {
            data.Data.forEach(u => {
                userMap1[String(u.id)] = {
                    username: u.username,
                    department: u.department
                };
            });
        }
    } catch (err) {
        console.error("Failed to load user map", err);
    }
}

let shipmentModeMapCache = {};
let shipmentDeliveryCache = null; // ✅ declared, was previously undefined/missing

async function loadShipmentModes() {
    if (shipmentDeliveryCache) return shipmentDeliveryCache; // ✅ now valid, no ReferenceError
    try {
        const res  = await fetch(new URL('/jssl/master/listshipmentdeliverynew', baseUrl), { credentials: 'include' });
        const data = await res.json();
        shipmentDeliveryCache = (data && Array.isArray(data.Data)) ? data.Data : [];
        shipmentModeMapCache = {};
        shipmentDeliveryCache.forEach(s => {
            shipmentModeMapCache[String(s.si_id).trim()] = s.shipment_mode;
        });
    } catch (e) {
        console.error('loadShipmentDelivery error:', e);
        shipmentDeliveryCache = [];
        shipmentModeMapCache  = {};
    }
    return shipmentDeliveryCache;
}

function getShipmentModeName(siId) {
    if (siId === undefined || siId === null || String(siId).trim() === '') return '';
    return shipmentModeMapCache[String(siId).trim()] || siId; // ✅ fixed: was shipmentModeMap (undefined)
}

let departmentMap = {};
document.addEventListener("DOMContentLoaded", function () {
    fetch(new URL('/api/websmartuser/getAllDepartment', baseUrl1), { credentials: "include" })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                data.forEach(dept => {
                    departmentMap[dept.dept_id] = dept.department_name;
                });
                console.log("Departments loaded:", departmentMap);
            }
        })
        .catch(err => console.error("Failed to load departments", err));
});

const MainPage = 'Reports.jsp';
const UserId = sessionStorage.getItem('username');
let allowedActions = [];

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
            {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            }
        );
        if (!response.ok) throw new Error("Failed to fetch actions");
        allowedActions = await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();
    await loadUserMap();
    await loadShipmentModes(); // ✅ now works correctly, awaits the data before rendering
	await loadUOM(); 

    if (!allowedActions.includes("view")) {
        blockUI();
        return; // ✅ stops here, so fetchItemsDueReport/gatepass calls correctly skipped for blocked users
    }

    fetchItemsDueReport(); // ✅ moved after permission check (was firing even when blocked before)
    fetchgatepassData();
    fetchnongatepassData();
});

function fetchgatepassData() {
    fetch(new URL('/jssl/contracts/jims/getgpno?gp_type=1', baseUrl1), { credentials: "include" })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const selectElement = document.getElementById('gate1');
            selectElement.innerHTML = '<option value="">Select</option>';
            data.forEach(gpNo => {
                const option = document.createElement('option');
                option.value = gpNo;
                option.textContent = gpNo;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching gate pass data:', error));
}

function fetchnongatepassData() {
    fetch(new URL('/jssl/contracts/jims/getngpno?gp_type=2', baseUrl1), { credentials: "include" })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const selectElement = document.getElementById('pass');
            selectElement.innerHTML = '<option value="">Select</option>';
            data.forEach(gpNo => {
                const option = document.createElement('option');
                option.value = gpNo;
                option.textContent = gpNo;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching gate pass data:', error));
}

function fetchGatePassDetails(gp_no) {
    const url = new URL(`/jssl/contracts/jims/getGatePassDetails?gp_no=${gp_no}`, baseUrl1);
    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const details = data[0];
                document.getElementById("gatePassContainer").style.display = "block";

                if (details) {
                    document.getElementById("factoryAddress").innerText = details.factoryaddress || '';
                    document.getElementById("consignee").innerText = details.address || '';
                    document.getElementById("date").innerText = details.date || '';
                    document.getElementById("gpass").innerText = details.gp_no || '';
                    document.getElementById("reason").innerText = details.note || '';
                    document.getElementById("mode").innerText = getShipmentModeName(details.sentThrough) || '';
                    document.getElementById("contract").innerText = details.project || '';
                    document.getElementById("expected").innerText = details.returnDate || '';
                    const userInfo = userMap1[String(details.username)];
                    document.getElementById("requested").innerText = userInfo ? userInfo.username : (details.username || "");
                    document.getElementById("department").innerText = departmentMap[details.dept] || details.dept || '';
                    document.getElementById("remarks").innerText = details.remarks || '';
                    document.getElementById("enclosures").innerText = details.encl || '';
                }

                const tableBody = document.querySelector("#itemsTable tbody");
                tableBody.innerHTML = '';

                data.forEach((item, index) => {
                    const val = (v) => (v && String(v).trim() !== '' && v !== 'null') ? v : '';
                    const description = [val(item.itmDescription1), val(item.itmDescription2)]
                        .filter(Boolean)
                        .join(' ');

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${val(item.ItemNo)}</td>
                        <td>${description}</td>
						<td>${getUOMName(item.UM)}</td>
                        <td style="text-align:right;">${val(item.qty)}</td>
                        <td style="text-align:right;">${val(item.itmPrice)}</td>
                        <td>${val(item.itmRemarks)}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                console.error('No data found for this GatePassNo');
                document.getElementById("gatePassContainer").style.display = "none";
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById("gatePassContainer").style.display = "none";
        });
}

document.getElementById("gate1").addEventListener("change", function() {
    const selectedGpNo = this.value;
    if (selectedGpNo && selectedGpNo !== "None") {
        fetchGatePassDetails(selectedGpNo);
    } else {
        document.getElementById("gatePassContainer").style.display = "none";
    }
});

function fetchngpGatePassDetails(gp_no) {
    const url = new URL(`/jssl/contracts/jims/getGatePassDetails?gp_no=${gp_no}`, baseUrl1);
    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const details = data[0];
                document.getElementById("Nonreturngatepass").style.display = "block";

                if (details) {
                    document.getElementById("ngpfactoryAddress").innerText = details.factoryaddress || '';
                    document.getElementById("ngpconsignee").innerText = details.address || '';
                    document.getElementById("ngpdate").innerText = details.date || '';
                    document.getElementById("ngpass").innerText = details.gp_no || '';
                    document.getElementById("ngpreason").innerText = details.note || '';
                    document.getElementById("ngpmode").innerText = getShipmentModeName(details.sentThrough) || '';
                    document.getElementById("ngpcontract").innerText = details.project || '';
                    const userInfo = userMap1[String(details.username)];
                    document.getElementById("ngprequested").innerText = userInfo ? userInfo.username : (details.username || "");
                    document.getElementById("ngpdepartment").innerText = departmentMap[details.dept] || details.dept || '';
                    document.getElementById("ngpremarks").innerText = details.remarks || '';
                    document.getElementById("ngpenclosures").innerText = details.encl || '';
                }

                const tableBody = document.querySelector("#itemsTablengp tbody");
                tableBody.innerHTML = '';

                data.forEach((item, index) => {
                    const val = (v) => (v && String(v).trim() !== '' && v !== 'null') ? v : ''; // ✅ applied same null-guard as the other table
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${val(item.ItemNo)}</td>
                        <td>${val(item.itmDescription1)} ${val(item.itmDescription2)}</td>
						<td>${getUOMName(item.UM)}</td>
                        <td style="text-align:right;">${val(item.qty)}</td>
                        <td style="text-align:right;">${val(item.itmPrice)}</td>
                        <td>${val(item.itmRemarks)}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                console.error('No data found for this GatePassNo');
                document.getElementById("Nonreturngatepass").style.display = "none";
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById("Nonreturngatepass").style.display = "none";
        });
}

document.getElementById("pass").addEventListener("change", function() {
    const selectedGpNo = this.value;
    if (selectedGpNo) {
        fetchngpGatePassDetails(selectedGpNo);
    } else {
        document.getElementById("Nonreturngatepass").style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("fromDate").value = today;
    document.getElementById("toDate").value = today;
});

function fetchGatePassByDate() {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    if (!fromDate || !toDate) {
        alert("Please select both Start Date and End Date.");
        return;
    }

    fetch(new URL(`/jssl/contracts/jims/getGatePassByDate?fromDate=${fromDate}&toDate=${toDate}`, baseUrl1), {
        credentials: "include"
    })
        .then(res => res.json())
        .then(data => {
            const container8 = document.getElementById("container8");
            const tbody = document.getElementById("reportBody");
            container8.style.display = "block";
            tbody.innerHTML = "";

            const totalColumns = 23;

            if (!data || data.length === 0) {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td colspan="${totalColumns}" style="text-align:center; color:#888; font-style:italic;">
                    No records found for the selected date range.
                </td>`;
                tbody.appendChild(tr);
                return;
            }

            data.forEach((row, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${row.gp_no || ""}</td>
                    <td>${row.gps_entry || ""}</td>
                    <td>${row.ItemNo || ""}</td>
                    <td>${row.UM || ""}</td>
                    <td>${row.qty || ""}</td>
                    <td>${row.Dc_ref || ""}</td>
                    <td>${row.itmDescription1 || ""} ${row.itmDescription2 || ""}</td>
                    <td>${row.address || ""}</td>
                    <td>${row.receive_qty || ""}</td>
                    <td>${row.returnDate || ""}</td>
                    <td>${row.security_received_qty || ""}</td>
                    <td>${row.securityoutdt || ""}</td>
                    <td>${row.returnDate || ""}</td>
                    <td>${row.itmRemarks || ""}</td>
                    <td>${row.project || ""}</td>
                    <td>${userMap1[String(row.username)]?.username || ''}</td>
                    <td>${departmentMap[row.dept] || row.dept || ""}</td>
                    <td>${row.UpdatedDate || ""}</td>
                    <td>${row.UpdateReason || ""}</td>
                    <td>${row.cancelreason || ""}</td>
                    <td>${row.transcdate || ""}</td>
                    <td>${row.factory_name || ""}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(err => {
            console.error("Error fetching data:", err);
            alert("Failed to load data. Please try again later.");
        });
}

function fetchItemsDueReport() {
    fetch(new URL('/jssl/contracts/jims/getitemsdue', baseUrl1), { credentials: "include" })
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error fetching data:', error));
}

function populateTable(data) {
    const tableBody = document.querySelector("#TableID tbody");
    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.gp_no || ''}</td>
            <td>${item.gps_entry || ''}</td>
            <td>${item.project || ''}</td>
            <td>${item.Dc_ref || ''}</td>
            <td>${item.ItemNo || ''}</td>
            <td>${item.UM || ''}</td>
            <td>${item.qty || ''}</td>
            <td>${item.receive_qty || ''}</td>
            <td>${item.itmDescription1 || ''} ${item.itmDescription2 || ''}</td>
            <td>${getShipmentModeName(item.sentThrough) || ''}</td>
            <td>${userMap1[String(item.username)]?.username || ''}</td>
            <td>${departmentMap[item.dept] || item.dept || ""}</td>
            <td>${item.returnDate || ''}</td>
            <td>${item.itmRemarks || ''}</td>
            <td>${item.transcdate || ''}</td>
            <td>${item.factory_name || ''}</td>
        `;
        tableBody.appendChild(row);
    });

    if ($.fn.DataTable.isDataTable('#TableID')) {
        $('#TableID').DataTable().destroy();
    }

    $('#TableID').DataTable({
        paging: true,
        pageLength: 10,
        searching: false,
        ordering: false,
        info: true,
        lengthChange: false,
        destroy: true
    });
}

function blockUI() {
    const container = document.getElementById("container-wrapper");
    if (!container) return;

    container.style.pointerEvents = "none";
    container.style.userSelect = "none";
    container.style.opacity = "0.5";
    container.style.position = "relative";

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
            <small>You don't have permission to view this page</small>
        </div>
    `;

    container.appendChild(overlay);
}

let uomMapCache = {};
let uomCache = null;

async function loadUOM() {
    if (uomCache) return uomCache;
    try {
        const res = await fetch(new URL('/api/items/all', baseUrl), { credentials: 'include' });
        const data = await res.json();
        uomCache = Array.isArray(data) ? data : [];
        uomMapCache = {};
        uomCache.forEach(u => {
            uomMapCache[String(u.uid).trim()] = u.unit;
        });
    } catch (e) {
        console.error('loadUOM error:', e);
        uomCache = [];
        uomMapCache = {};
    }
    return uomCache;
}

function getUOMName(uid) {
    if (uid === undefined || uid === null || String(uid).trim() === '') return '';
    return uomMapCache[String(uid).trim()] || uid;
}