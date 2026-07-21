

document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();

    if (!allowedActions.includes("view")) {
        blockUI();   // 🔒 permanent block
        return;
    }

    
});


const MainPage =  window.location.pathname.split("/").pop()+'.jsp';
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


$(document).ready(function () {

    // Load dropdowns initially
    loadContracts();
    loadEmployees();
    loadAssets();
	loadReportLookups();
	
	initUniversalSelect2();
	
	let today = new Date().toISOString().split('T')[0];
	$("#fromDate").val(today);
	$("#toDate").val(today);

    // Show filter section on tab click
	// When Items Tab is clicked
	$("#itemsTab").click(function () {

	    // Hide all containers first
	    $("#container1, #container2, #container3, #container4, #container5, #container6").hide();

	    // Reset dropdown
	    $("#searchBy").val("");
		$("#contract").val("");
		$("#employee").val("");
		$("#assetType").val("");

	    // Hide filter dropdowns and button
	    $("#searchContract, #searchEmployee, #searchAssetType, #btnSearchDiv").hide();

	    // Clear AMS Report Table (old data)
	    if ($.fn.DataTable.isDataTable("#TableID")) {
	        $('#TableID').DataTable().clear().destroy();
	    }
	    $("#TableID tbody").empty(); // remove rows

	    // Show filter section
	    $("#amsFilterSection").show();
	});

	$("#dateTab").click(function () {

	    // Hide all main containers
	    $("#container1,#container2,#container3,#container5,#container6").hide();

		$("#amsFilterSection").hide();
	    // Show only container4
	    $("#container4").show();

	    // 🔥 Show ONLY filter section
	    $("#subcontainer4").show();

	    // 🔥 Hide table initially
	    $("#allocationHistoryContainer").hide();

	    // Clear dates
		$("#fromDate").val(today);
			$("#toDate").val(today);

	    // Clear history table
	    if ($.fn.DataTable.isDataTable("#Table_1")) {
	        $("#Table_1").DataTable().clear().destroy();
	    }
	    $("#Table_1 tbody").empty();
	});



    // Handle Search By Dropdown Change
    $("#searchBy").change(function () {
        let val = $(this).val();
		$("#contract").val("");
			$("#employee").val("");
			$("#assetType").val("");
        // Hide table when select type changes
        $("#container1").hide();
		$("#container6").hide();

        // Hide all dropdowns & search button
        $("#searchContract, #searchEmployee, #searchAssetType, #btnSearchDiv").hide();

        if (val === "contract") $("#searchContract, #btnSearchDiv").show();
        if (val === "employee") $("#searchEmployee, #btnSearchDiv").show();
        if (val === "assetType") $("#searchAssetType, #btnSearchDiv").show();
    });

    // Show table after clicking search button & load data
    $("#amsFilterSubmit").click(function () {
        let type = $("#searchBy").val();

        if (type === "contract") {searchByContract();  $("#container6").hide();   $("#container1").hide();}
      
         if (type === "employee") {searchByEmployee(); $("#container1").hide();}
        if (type === "assetType") {searchByAssetType(); $("#container1").hide();}

    if(type==="summary"){
		loadSummaryData();
		$("#container6").show();
		$("#summaryReportDiv").show();
	}
		
    });

});

/* =====================  LOAD DROPDOWNS ===================== */

function loadContracts() {
    $.ajax({
        url: `${baseUrl}/api/contract/getAll`,
        method: "GET",
        xhrFields: { withCredentials: true }, // 🔥 sends cookies/session
        success: function (data) {

            let formatted = data.map(c => ({
                id: c.contractId,
                label: `${c.jobCode} - ${c.description}`
            }));

            formatted.unshift({ id: "all", label: "All Contracts" });

            fillDropdown("#contract", formatted, "id", "label", "Select Contract");
        },
        error: function () {
            console.error("Error loading contracts");
        }
    });
}


function loadEmployees() {
    $.ajax({
        url: `${baseUrl}/api/user/getAll`,
        method: "GET",
        xhrFields: { withCredentials: true }, // 🔥 sends cookies/session
        success: function (data) {

            // 👇 Add ALL option manually
            data.unshift({ id: "all", userName: "All Employees" });

            fillDropdown("#employee", data, "id", "userName", "Select Employee");
        },
        error: function () {
            console.error("Error loading employees");
        }
    });
}


function loadAssets() {
    $.ajax({
        url: `${baseUrl}/api/ams/entry/getAll`,
        method: "GET",
        xhrFields: { withCredentials: true }, // 🔥 ensures cookies/session is included
        success: function (data) {

            // 👇 Add ALL manually
            data.unshift({ assetenId: "all", assetNo: "All Asset Types" });

            fillDropdown("#assetType", data, "assetenId", "assetNo", "Select Asset Type");
        },
        error: function () {
            console.error("Error loading assets");
        }
    });
}


/* =====================  SEARCH FUNCTIONS ===================== */

function searchByContract() {
    let contractId = $("#contract").val();

    if (!contractId) {
        alert("Please select a contract");
		$("#container1").hide();
        return;
    }

    // 🔥 If "All" selected, call ALL API
    let url = (contractId === "all")
        ? `${baseUrl}/api/ams/allocate/getAll`
        : `${baseUrl}/api/ams/allocate/bycontract/${contractId}`

    $.ajax({
        url: url,
        method: "GET",
		xhrFields: { withCredentials: true },
        success: function (response) {
            populateReportTable(response);
        },
        error: function () {
            alert("Error fetching data");
        }
    });
}



function searchByEmployee() {
    let employeeId = $("#employee").val();

    if (!employeeId) {
        alert("Please select an employee");
		$("#container1").hide();
        return;
    }

    let url = (employeeId === "all")
        ?`${baseUrl}/api/ams/allocate/getAll`
        :`${baseUrl}/api/ams/allocate/byemployee/${employeeId}`;


    $.ajax({
        url: url,
        method: "GET",
		xhrFields: { withCredentials: true },
        success: function (response) {
            populateReportTable(response);
        },
        error: function () {
            alert("Error fetching data");
        }
    });
}



function searchByAssetType() {
    let assetId = $("#assetType").val();

    if (!assetId) {
        alert("Please select an asset type");
		$("#container1").hide();
        return;
    }

    let url = (assetId === "all")
        ? `${baseUrl}/api/ams/allocate/getAll`
        : `${baseUrl}/api/ams/allocate/byassetType/${assetId}`

    $.ajax({
        url: url,
        method: "GET",
		xhrFields: { withCredentials: true },
        success: function (response) {
            populateReportTable(response);
        },
        error: function () {
            alert("Error fetching data");
        }
    });
}






let typeMap = {};
let modelMap = {};
let makeMap = {};
let contractMap = {};
let userMap = {};
let assetNoMap = {};

let assetstatusNomap= {};

// ======================= LOAD LOOKUPS (Report Page) =======================
async function loadReportLookups() {
    try {
        // 🔹 Asset Types
        const typeList = await fetch(`${baseUrl}/api/ams/getall`,{credentials:"include"}).then(res => res.json());
        typeList.forEach(t => typeMap[t.type_id] = t.assetType);

        // 🔹 Models
        const modelList = await fetch(`${baseUrl}/api/ams/model/getAll`,{credentials:"include"}).then(res => res.json());
        modelList.forEach(m => modelMap[m.model_id] = m.assetModel);

        // 🔹 Makers
        const makeList = await fetch(`${baseUrl}/api/ams/maker/getAll`,{credentials:"include"}).then(res => res.json());
        makeList.forEach(mk => makeMap[mk.makeId] = mk.makeDescription);

        // 🔹 Contracts
        const contractList = await fetch(`${baseUrl}/api/contract/getAll`,{credentials:"include"}).then(res => res.json());
        contractList.forEach(c => contractMap[c.contractId] = `${c.jobCode}`);

        // 🔹 Users / Employees
        const userList = await fetch(`${baseUrl}/api/user/getAll`,{credentials:"include"}).then(res => res.json());
        userList.forEach(u => userMap[u.id] = u.userName);

        // 🔹 Asset No mapping
		const assets = await fetch(`${baseUrl}/api/ams/entry/getAll`,{credentials:"include"}).then(res => res.json());
		assets.forEach(a => assetNoMap[a.assetenId] = a.assetNo); 
		
		
		// Asset Status mapping
		
		const status = await fetch(`${baseUrl}/api/ams/status/getAll`,{credentials:"include"}).then(res=>res.json());
		status.forEach(s=>assetstatusNomap[s.status_id] = s.assetStatus);
    } catch (err) {
        console.error("Lookup load error:", err);
    }
}

/* =====================  POPULATE TABLE ===================== */

function populateReportTable(data) {
    let tableBody = $("#TableID tbody");
    tableBody.empty();
	$("#container1").show();

    if (!data || data.length === 0) {
        tableBody.append(`<tr><td colspan="10" class="text-center">No data found</td></tr>`);
        return;
    }

    $.each(data, function (index, item) {
        tableBody.append(`
            <tr>
                <td>${index + 1}</td>
				<td>${assetNoMap[item.assetId] || ''}</td>
                <td>${contractMap[item.contractId] || ''}</td>
                <td>${userMap[item.allocatedTo] || ''}</td>
                <td>${modelMap[item.modelId] || ''}</td>
                <td>${makeMap[item.makeId] || ''}</td>
				<td>${formatToDDMMYYYY(item.purchaseDate)}</td>
				<td>${userMap[item.allocatedTo] || ''}</td>
				<td>${formatToDDMMYYYY(item.allocatedDate)}</td>
				<td>${formatToDDMMYYYY(item.allocatedReturnDate)}</td>
            </tr>
        `);
    });
}


function loadSummaryData() {
    // Clear existing table body
    let tableBody = $("#SummaryTable tbody");
    tableBody.empty();

    // Fetch summary data
    $.ajax({
		url: `${baseUrl}/api/ams/entry/assets`,
        method: "GET",
		xhrFields: { withCredentials: true },
        success: function (data) {
            if (!data || data.length === 0) {
                tableBody.append(`<tr><td colspan="11" class="text-center">No data found</td></tr>`);
                return;
            }

            // Initialize totals
            let totalAsset = 0,
                allocated = 0,
                stock = 0,
                working = 0,
                notWorking = 0,
                scrap = 0,
                repair = 0,
                others = 0,
                totalStatus = 0;

            // Populate table rows and calculate totals
            $.each(data, function (index, item) {
                totalAsset += item.totalAsset || 0;
                allocated += item.allocated || 0;
                stock += item.stock || 0;
                working += item.working || 0;
                notWorking += item.notWorking || 0;
                scrap += item.scrap || 0;
                repair += item.repair || 0;
                others += item.others || 0;
                totalStatus += item.totalStatus || 0;

                tableBody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.assetType || ''}</td>
                        <td>${item.totalAsset || 0}</td>
                        <td>${item.allocated || 0}</td>
                        <td>${item.stock || 0}</td>
                        <td>${item.working || 0}</td>
                        <td>${item.notWorking || 0}</td>
                        <td>${item.scrap || 0}</td>
                        <td>${item.repair || 0}</td>
                        <td>${item.others || 0}</td>
                        <td>${item.totalStatus || 0}</td>
                    </tr>
                `);
            });

            // Append grand total row
            tableBody.append(`
                <tr style="font-weight:bold; background-color:#f0f0f0;">
                    <td colspan="1"></td>
                    <td>Grand Total</td>
                    <td>${totalAsset}</td>
                    <td>${allocated}</td>
                    <td>${stock}</td>
                    <td>${working}</td>
                    <td>${notWorking}</td>
                    <td>${scrap}</td>
                    <td>${repair}</td>
                    <td>${others}</td>
                    <td>${totalStatus}</td>
                </tr>
            `);
        },
        error: function () {
            alert("Error fetching summary data");
        }
    });
}
let isFetchingHistory = false;

function fetchHistoryReport() {

    if (isFetchingHistory) return; // 🚫 block multiple clicks

    isFetchingHistory = true;

    const btn = document.getElementById("fetchReportBtn");
    btn.disabled = true;
    btn.innerText = "Fetching...";

    let from = $("#fromDate").val();
    let to   = $("#toDate").val();

    $("#subcontainer4").show();
    $("#allocationHistoryContainer").show();

    loadAmsHistory(from, to)
        .finally(() => {
            isFetchingHistory = false;
            btn.disabled = false;
            btn.innerText = "Fetch Report";
        });
}


async function loadAmsHistory(fromDate = '', toDate = '') {
    try {
        //await loadReportLookups();

		$("#container4").show();
		$("#subcontainer4").show();
		$("#allocationHistoryContainer").show();
        let url = "";

		if (fromDate && toDate) {
		            url = `${baseUrl}/api/ams/history/${fromDate}/${toDate}`;
        } else if (fromDate && !toDate) {
            url = `${baseUrl}/api/ams/history/${fromDate}`;
        } else if (!fromDate && toDate) {
            url = `${baseUrl}/api/ams/history/end/${toDate}`;
        } else{
			alert("plss select the date");
			$("#allocationHistoryContainer").hide();
			return;
		}

        const response = await $.ajax({ url, method: "GET" ,xhrFields: { withCredentials: true },});
        const tbody = $("#Table_1 tbody");
        tbody.empty();

        if (!response || response.length === 0) {
            tbody.append(`<tr><td colspan="23" class="text-center">No data found</td></tr>`);
            return;
        }
		response.forEach((item, index) => {
		    const transactionDate      = formatDateTime(item.transactionDate);
		    const purchaseDate         = formatDate(item.purchaseDate);
		    const warrantyStart        = formatDate(item.warrantyStart);
		    const warrantyEnd          = formatDate(item.warrantyEnd);
		    const assignedDate         = formatDateTime(item.assignedDate);
		    const expectedReturnDate   = formatDate(item.expectedReturnDate);
		    const returnDate           = formatDateTime(item.returnDate);
		    const createdDate          = formatDateTime(item.createdDate);
		    const modifiedDate         = formatDateTime(item.modifiedDate);

		    tbody.append(`
		        <tr>
		            <td>${index + 1}</td>
		            <td>${item.assetNo || ''}</td>
		            <td>${transactionDate}</td>
		            <td>${typeMap[item.typeId] || ''}</td>
		            <td>${makeMap[item.makeId] || ''}</td>
		            <td>${modelMap[item.modelId] || ''}</td>
		            <td>${contractMap[item.contractId] || ''}</td>
		            <td>${item.assetSrNo || ''}</td>
		            <td>${purchaseDate}</td>
		            <td>${item.purchaseOrder || ''}</td>
		            <td>${item.cost != null ? item.cost.toLocaleString() : ''}</td>
		            <td>${warrantyStart}</td>
		            <td>${warrantyEnd}</td>
		            <td>${item.statusId != null ? assetstatusNomap[item.statusId] || '' : ''}</td>
		            <td>${userMap[item.allocatedTo] || ''}</td>
		            <td>${item.department || ''}</td>
		            <td>${assignedDate}</td>
		            <td>${expectedReturnDate}</td>
		            <td>${userMap[item.createdBy] || ''}</td>
		            <td>${createdDate}</td>
		            <td>${userMap[item.modifiedBy] || ''}</td>
		            <td>${modifiedDate}</td>
		            <td>${returnDate}</td>
		            <td>${item.remarks || ''}</td>
		        </tr>
		    `);
		});

        if ($.fn.DataTable.isDataTable("#Table_1")) {
            $("#Table_1").DataTable().destroy();
        }

   
    } catch (err) {
        console.error("Error loading AMS history:", err);
        alert("Error fetching AMS history data");
    }
}



async function loadAssetHistory() {
    try {
		let url = `${baseUrl}/api/ams/entry/history/getAll`;

        let data = await fetch(url,{credentials:"include"}).then(res => res.json());

        let tbody = $("#Table_AssetHistory tbody");
        tbody.empty();

        if (!data || data.length === 0) {
            tbody.append(`<tr><td colspan="17" class="text-center">No data found</td></tr>`);
            return;
        }

        data.forEach((x, i) => {
            tbody.append(`
                <tr>
                    <td>${i + 1}</td>
                    <td>${x.assetNo || ""}</td>
                    <td>${x.createdDate ? x.createdDate.split("T")[0] : ""}</td>
                    <td>${(typeof typeMap !== 'undefined' && typeMap[x.typeId]) || x.typeId || ""}</td>
                    <td>${(typeof contractMap !== 'undefined' && contractMap[x.contractId]) || x.contractId || ""}</td>
                    <td>${(typeof makeMap !== 'undefined' && makeMap[x.makeId]) || x.makeId || ""}</td>
                    <td>${x.assetSrNo || ""}</td>
                    <td>${x.purchaseDate ? x.purchaseDate.split("T")[0] : ""}</td>
                    <td>${x.purchaseOrder || ""}</td>
                    <td>${x.cost != null ? Number(x.cost).toLocaleString() : ""}</td>
                    <td>${x.wstartDate ? x.wstartDate.split("T")[0] : ""}</td>
                    <td>${x.wendDate ? x.wendDate.split("T")[0] : ""}</td>
                    <td>${(typeof assetstatusNomap !== 'undefined' && assetstatusNomap[x.statusId]) || x.statusId || ""}</td>
                    <td>${(typeof modelMap !== 'undefined' && modelMap[x.modelId]) || x.modelId || ""}</td>
                    <td>${x.modifiedDate ? x.modifiedDate.split("T")[0] : ""}</td>
                    <td>${x.remarks || ""}</td>
                </tr>
            `);
        });

        // Reinitialize DataTable WITHOUT pagination, search, or ordering
        if ($.fn.DataTable.isDataTable("#Table_AssetHistory")) {
            $("#Table_AssetHistory").DataTable().destroy();
        }
        $("#Table_AssetHistory").DataTable({
            paging: false,
            searching: false,
            ordering: false,
            info: false
        });

    } catch (err) {
        console.error("Error loading Asset History:", err);
        alert("Failed to load Asset History");
    }
}
function formatToDDMMYYYY(dateStr) {
    if (!dateStr) return '';  // ⬅️ return empty for null, undefined, ""

    const date = new Date(dateStr);
    if (isNaN(date)) return ''; // ⬅️ return empty if invalid date

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
}

function formatDate(dateStr) {
    if (!dateStr) return ''; // empty
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}



function formatDateTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
}

/* =====================  COMMON DROPDOWN BUILDER ===================== */

function fillDropdown(selector, data, valueKey, textKey, defaultText) {
    let select = $(selector);
    select.empty().append(`<option value="">${defaultText}</option>`);
    $.each(data, function (_, item) {
        select.append(`<option value="${item[valueKey]}">${item[textKey]}</option>`);
    });
}


function initUniversalSelect2(context = document) {
    $(context).find("select.universal-select").each(function () {

        // Avoid re-initialization
        if ($(this).hasClass("select2-hidden-accessible")) return;

        $(this).select2({
            placeholder: $(this).find("option:first").text() || "Select option",
            allowClear: true,
            width: "100%",
            minimumResultsForSearch: 0   // 🔍 ALWAYS show search box
        });
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
