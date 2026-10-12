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



/*$(document).ready(function () {
    loadContracts();
    loadEmployees();
    loadLocations();
    $("#amsFilterSubmit").on("click", function () {
        fetchReport();
    });
});*/



/* ── Location map: Loc_id → Location name ─────────── */
var locMap = {};

function loadLocations() {
    $.ajax({
        url: baseUrl + "/api/location/getAll",
        type: "GET",
        xhrFields: { withCredentials: true },
        success: function (response) {
            if (response.Data && response.Data.length > 0) {
                response.Data.forEach(function (loc) {
                    locMap[loc.Loc_id] = loc.Location;
                });
            }
            console.log("Location Map:", locMap);
        },
        error: function (xhr) { console.error("Location API error:", xhr.responseText); }
    });
}




/* ── Load Contracts dropdown ──────────────────────── */
function loadContracts() {
    $.ajax({
        url: baseUrl + "/api/drawingentry/contractlist",
        type: "GET",
        xhrFields: { withCredentials: true },
        success: function (response) {
            var dd = $("#contract");
            dd.empty().append('<option value="">All Contracts</option>');
            if (response.Data && response.Data.length > 0) {
                $.each(response.Data, function (i, item) {
                    dd.append('<option value="' + item.contract_id + '">' + item.jobCode + '</option>');
                });
            }
        },
        error: function (xhr) { console.error("Contracts error:", xhr.responseText); }
    });
}

/* ── Load Employees dropdown ──────────────────────── */
function loadEmployees() {
    $.ajax({
        url: baseUrl + "/api/modalassign/department18",
        type: "GET",
        xhrFields: { withCredentials: true },
        success: function (response) {
            var dd = $("#employee");
            dd.empty().append('<option value="">All Employees</option>');
            if (response && response.length > 0) {
                $.each(response, function (i, item) {
                    dd.append('<option value="' + item.id + '">' + item.username + '</option>');
                });
            }
        },
        error: function (xhr) { console.error("Employees error:", xhr.responseText); }
    });
}



function toggleReportTab(type) {
    const container1 = $("#container1"); // Detailed
    const container2 = $("#container2"); // Finance
    const itemsTab = $("#itemsTab");
    const financeTab = $("#financeTab");

    if (type === "detailed") {
        container2.hide(); // close the other tab's open result
        itemsTab.addClass("active");
        financeTab.removeClass("active");
    } else {
        container1.hide();
        financeTab.addClass("active");
        itemsTab.removeClass("active");
    }

    // remember which type the Search button should fetch
    window._activeReportType = type;
}

$(document).ready(function () {
    loadContracts();
    loadEmployees();
    loadLocations();
    window._activeReportType = "detailed"; // default tab
	setDefaultDateRange();


    $("#amsFilterSubmit").on("click", function () {
        fetchReport(window._activeReportType);
    });
});

function setDefaultDateRange() {
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    $("#fromDate").val(toDateInputValue(firstDay));
    $("#toDate").val(toDateInputValue(today));
}

/* Formats a Date as yyyy-MM-dd for <input type="date"> */
function toDateInputValue(date) {
    var yyyy = date.getFullYear();
    var mm   = String(date.getMonth() + 1).padStart(2, "0");
    var dd   = String(date.getDate()).padStart(2, "0");
    return yyyy + "-" + mm + "-" + dd;
}

function fetchReport(type) {
    var targetContainer = (type === "finance") ? "#container2" : "#container1";
    var targetTableId   = (type === "finance") ? "TableFinance" : "TableID";
    var endpoint         = (type === "finance") ? "/api/Drawing_txn/getHoursFinance" : "/api/Drawing_txn/getHours";

    $(targetContainer).show();

    var contractId = $("#contract").val() || null;
    var userId     = $("#employee").val() || null;
    var fromDate   = $("#fromDate").val() || null;
    var toDate     = $("#toDate").val()   || null;

    var params = {};
    if (contractId) params.contractId = contractId;
    if (userId)     params.userId     = userId;
    if (fromDate)   params.fromDate   = fromDate;
    if (toDate)     params.toDate     = toDate;

    $("#" + targetTableId + " thead tr").html('<th class="text-center">Loading...</th>');
    $("#" + targetTableId + " tbody").html(
        '<tr><td class="text-center"><i class="fas fa-spinner fa-spin"></i> Please wait...</td></tr>'
    );

    $.ajax({
        url: baseUrl + endpoint,
        type: "GET",
        data: params,
        xhrFields: { withCredentials: true },
/*        success: function (response) {
            var data = response.data || [];

            data.sort(function(a, b) {
                var locA = locMap[a.location] || "";
                var locB = locMap[b.location] || "";
                if (locA !== locB) return locA.localeCompare(locB);
                return a.username.localeCompare(b.username);
            });

            if (type === "finance") {
                window._lastFinanceData = data;
            } else {
                window._lastReportData = data;
            }

            renderPivotTable(data, targetTableId);
        },*/
		success: function (response) {
		    var data = response.data || [];

		    data.sort(function (a, b) {
		        var locA = locMap[a.location] || "";
		        var locB = locMap[b.location] || "";
		        if (locA !== locB) return locA.localeCompare(locB);
		        return a.username.localeCompare(b.username);
		    });

		    var totals = {
		        rowTotals:    response.rowTotals    || {},
		        columnTotals: response.columnTotals || {},
		        grandTotal:   response.grandTotal   || 0
		    };

		    if (type === "finance") {
		        window._lastFinanceData   = data;
		        window._lastFinanceTotals = totals;
		    } else {
		        window._lastReportData   = data;
		        window._lastReportTotals = totals;
		    }

		    renderPivotTable(data, targetTableId, totals);
		},
        error: function (xhr) {
            console.error("Report error:", xhr.responseText);
            if (type === "finance") window._lastFinanceData = [];
            else window._lastReportData = [];

            $("#" + targetTableId + " thead tr").html(
                '<th>SL.NO</th><th>Location</th><th>Name</th><th>Total Hours</th>'
            );
            $("#" + targetTableId + " tbody").html(
                '<tr><td colspan="4" class="text-center text-danger">' +
                '<i class="fas fa-exclamation-circle"></i> Error loading data.' +
                '</td></tr>'
            );
        }
    });
}

/*function renderPivotTable(data) {

    if (!data || data.length === 0) {
        $("#TableID thead tr").html(
            '<th>SL.NO</th><th>Location</th><th>Name</th><th>Total Hours</th>'
        );
        $("#TableID tbody").html(
            '<tr><td colspan="4" class="text-center text-muted">No records found.</td></tr>'
        );
        return;
    }

     unique sorted contracts 
    var contractSet = {};
    for (var i = 0; i < data.length; i++) { contractSet[data[i].jobCode] = true; }
    var contracts = Object.keys(contractSet).sort();

     unique employees in first-appearance order 
    var empOrder = [], empSeen = {};
    for (var i = 0; i < data.length; i++) {
        var u = data[i].username;
        if (!empSeen[u]) { empSeen[u] = true; empOrder.push(u); }
    }

     pivot: username → { jobCode: hours } 
    var pivot = {};
    for (var i = 0; i < data.length; i++) {
        var r = data[i];
        if (!pivot[r.username]) pivot[r.username] = {};
        pivot[r.username][r.jobCode] = parseFloat(r.finalTotal) || 0;
    }

     ── thead: SL.NO | Location | Name | contracts... | Total ── 
    var thHtml = '<th>SL.NO</th>'
               + '<th>Location</th>'
               + '<th style="text-align:left">Name</th>';
    for (var c = 0; c < contracts.length; c++) {
        thHtml += '<th>' + contracts[c] + '</th>';
    }
    thHtml += '<th>Total</th>';
    $("#TableID thead tr").html(thHtml);

     ── tbody ── 
    var colTotals  = new Array(contracts.length).fill(0);
    var grandTotal = 0;
    var bodyHtml   = "";

    for (var e = 0; e < empOrder.length; e++) {
        var emp     = empOrder[e];
        var empData = pivot[emp] || {};
        var rowSum  = 0;
        var rowBg   = (e % 2 === 0) ? "#ffffff" : "#f4f9f4";

         resolve location name from locMap 
        var locId   = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].username === emp) { locId = data[i].location; break; }
        }
        var locName = locMap[locId] || "-";

        bodyHtml += '<tr style="background:' + rowBg + '">';
        bodyHtml += '<td>' + (e + 1) + '</td>';
         ── Location FIRST ── 
        bodyHtml += '<td style="font-weight:500;color:#37499A">' + locName + '</td>';
         ── Name SECOND ── 
        bodyHtml += '<td style="text-align:left;font-weight:500">' + emp + '</td>';

        for (var c = 0; c < contracts.length; c++) {
            var h = empData[contracts[c]] || 0;
            colTotals[c] += h;
            rowSum        += h;
            if (h > 0) {
                bodyHtml += '<td style="color:#155724;font-weight:600">' + h.toFixed(2) + '</td>';
            } else {
                bodyHtml += '<td style="color:#ccc">-</td>';
            }
        }

        grandTotal += rowSum;
        bodyHtml += '<td style="font-weight:700;background:#e8f5e9;color:#1b5e20">'
                 + rowSum.toFixed(2) + '</td>';
        bodyHtml += '</tr>';
    }

     ── TOTAL footer row ── 
    bodyHtml += '<tr style="background:#1b5e20;color:#fff;font-weight:700">';
    bodyHtml += '<td></td>';
    bodyHtml += '<td></td>';
    bodyHtml += '<td style="text-align:left;letter-spacing:.5px">TOTAL</td>';
    for (var c = 0; c < contracts.length; c++) {
        bodyHtml += '<td>' + colTotals[c].toFixed(2) + '</td>';
    }
    bodyHtml += '<td style="background:#145214">' + grandTotal.toFixed(2) + '</td>';
    bodyHtml += '</tr>';

    $("#TableID tbody").html(bodyHtml);
}*/



/*function renderPivotTable(data, tableId) {
    tableId = tableId || "TableID"; // default keeps old calls working

    if (!data || data.length === 0) {
        $("#" + tableId + " thead tr").html(
            '<th>SL.NO</th><th>Location</th><th>Name</th><th>Total Hours</th>'
        );
        $("#" + tableId + " tbody").html(
            '<tr><td colspan="4" class="text-center text-muted">No records found.</td></tr>'
        );
        return;
    }

     unique sorted contracts 
    var contractSet = {};
    for (var i = 0; i < data.length; i++) { contractSet[data[i].jobCode] = true; }
    var contracts = Object.keys(contractSet).sort();

     unique employees in first-appearance order 
    var empOrder = [], empSeen = {};
    for (var i = 0; i < data.length; i++) {
        var u = data[i].username;
        if (!empSeen[u]) { empSeen[u] = true; empOrder.push(u); }
    }

    var pivot = {};
    for (var i = 0; i < data.length; i++) {
        var r = data[i];
        if (!pivot[r.username]) pivot[r.username] = {};
        pivot[r.username][r.jobCode] = parseFloat(r.finalTotal) || 0;
    }

    var thHtml = '<th>SL.NO</th><th>Location</th><th style="text-align:left">Name</th>';
    for (var c = 0; c < contracts.length; c++) { thHtml += '<th>' + contracts[c] + '</th>'; }
  for (var c = 0; c < contracts.length; c++) {
      var headerName = (contracts[c] === 'Stock') ? 'Indirect' : contracts[c];
      thHtml += '<th>' + headerName + '</th>';
  }
    thHtml += '<th>Total</th>';
    $("#" + tableId + " thead tr").html(thHtml);

    var colTotals  = new Array(contracts.length).fill(0);
    var grandTotal = 0;
    var bodyHtml   = "";

    for (var e = 0; e < empOrder.length; e++) {
        var emp     = empOrder[e];
        var empData = pivot[emp] || {};
        var rowSum  = 0;
        var rowBg   = (e % 2 === 0) ? "#ffffff" : "#f4f9f4";

        var locId = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].username === emp) { locId = data[i].location; break; }
        }
        var locName = locMap[locId] || "-";

        bodyHtml += '<tr style="background:' + rowBg + '">';
        bodyHtml += '<td>' + (e + 1) + '</td>';
        bodyHtml += '<td style="font-weight:500;color:#37499A">' + locName + '</td>';
        bodyHtml += '<td style="text-align:left;font-weight:500">' + emp + '</td>';

        for (var c = 0; c < contracts.length; c++) {
            var h = empData[contracts[c]] || 0;
            colTotals[c] += h;
            rowSum        += h;
            bodyHtml += (h > 0)
                ? '<td style="color:#155724;font-weight:600">' + h.toFixed(2) + '</td>'
                : '<td style="color:#ccc">-</td>';
        }

        grandTotal += rowSum;
        bodyHtml += '<td style="font-weight:700;background:#e8f5e9;color:#1b5e20">' + rowSum.toFixed(2) + '</td>';
        bodyHtml += '</tr>';
    }

    bodyHtml += '<tr style="background:#1b5e20;color:#fff;font-weight:700">';
    bodyHtml += '<td></td><td></td>';
    bodyHtml += '<td style="text-align:left;letter-spacing:.5px">TOTAL</td>';
    for (var c = 0; c < contracts.length; c++) { bodyHtml += '<td>' + colTotals[c].toFixed(2) + '</td>'; }
    bodyHtml += '<td style="background:#145214">' + grandTotal.toFixed(2) + '</td>';
    bodyHtml += '</tr>';

    $("#" + tableId + " tbody").html(bodyHtml);
}*/


/*function renderPivotTable(data, tableId, totals) {
    tableId = tableId || "TableID";
    totals  = totals  || { rowTotals: {}, columnTotals: {}, grandTotal: 0 };

    if (!data || data.length === 0) {
        $("#" + tableId + " thead tr").html(
            '<th>SL.NO</th><th>Location</th><th>Name</th><th>Total Hours</th>'
        );
        $("#" + tableId + " tbody").html(
            '<tr><td colspan="4" class="text-center text-muted">No records found.</td></tr>'
        );
        return;
    }

    var contractSet = {};
    for (var i = 0; i < data.length; i++) { contractSet[data[i].jobCode] = true; }
    var contracts = Object.keys(contractSet).sort();

    var empOrder = [], empSeen = {}, empUserId = {};
    for (var i = 0; i < data.length; i++) {
        var u = data[i].username;
        if (!empSeen[u]) {
            empSeen[u] = true;
            empOrder.push(u);
            empUserId[u] = data[i].userId; // remember userId for totals lookup
        }
    }

    var pivot = {};
    for (var i = 0; i < data.length; i++) {
        var r = data[i];
        if (!pivot[r.username]) pivot[r.username] = {};
        pivot[r.username][r.jobCode] = parseFloat(r.finalTotal) || 0;
    }

    var thHtml = '<th>SL.NO</th><th>Location</th><th style="text-align:left">Name</th>';
    for (var c = 0; c < contracts.length; c++) {
        var headerName = (contracts[c] === 'Stock') ? 'Indirect' : contracts[c];
        thHtml += '<th>' + headerName + '</th>';
    }
    thHtml += '<th>Total</th>';
    $("#" + tableId + " thead tr").html(thHtml);

    var bodyHtml = "";

    for (var e = 0; e < empOrder.length; e++) {
        var emp     = empOrder[e];
        var empData = pivot[emp] || {};
        var rowBg   = (e % 2 === 0) ? "#ffffff" : "#f4f9f4";

        var locId = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].username === emp) { locId = data[i].location; break; }
        }
        var locName = locMap[locId] || "-";

        // ── row total comes straight from backend, keyed by userId ──
        var rowTotal = totals.rowTotals[String(empUserId[emp])] || 0;

        bodyHtml += '<tr style="background:' + rowBg + '">';
        bodyHtml += '<td>' + (e + 1) + '</td>';
        bodyHtml += '<td style="font-weight:500;color:#37499A">' + locName + '</td>';
        bodyHtml += '<td style="text-align:left;font-weight:500">' + emp + '</td>';

        for (var c = 0; c < contracts.length; c++) {
            var h = empData[contracts[c]] || 0;
            bodyHtml += (h > 0)
                ? '<td style="color:#155724;font-weight:600">' + h.toFixed(2) + '</td>'
                : '<td style="color:#ccc">-</td>';
        }

        bodyHtml += '<td style="font-weight:700;background:#e8f5e9;color:#1b5e20">'
                 + rowTotal.toFixed(2) + '</td>';
        bodyHtml += '</tr>';
    }

    // ── TOTAL footer row — also straight from backend ──
    bodyHtml += '<tr style="background:#1b5e20;color:#fff;font-weight:700">';
    bodyHtml += '<td></td><td></td>';
    bodyHtml += '<td style="text-align:left;letter-spacing:.5px">TOTAL</td>';
    for (var c = 0; c < contracts.length; c++) {
        var colTotal = totals.columnTotals[contracts[c]] || 0;
        bodyHtml += '<td>' + colTotal.toFixed(2) + '</td>';
    }
    bodyHtml += '<td style="background:#145214">' + (totals.grandTotal || 0).toFixed(2) + '</td>';
    bodyHtml += '</tr>';

    $("#" + tableId + " tbody").html(bodyHtml);
}*/

function renderPivotTable(data, tableId, totals) {
    tableId = tableId || "TableID";
    totals  = totals  || { rowTotals: {}, columnTotals: {}, grandTotal: 0 };

    if (!data || data.length === 0) {
        $("#" + tableId + " thead tr").html(
            '<th>SL.NO</th><th>Location</th><th>Emp Code</th><th>Name</th><th>Total Hours</th>'
        );
        $("#" + tableId + " tbody").html(
            '<tr><td colspan="5" class="text-center text-muted">No records found.</td></tr>'
        );
        return;
    }

    var contractSet = {};
    for (var i = 0; i < data.length; i++) { contractSet[data[i].jobCode] = true; }
    var contracts = Object.keys(contractSet).sort();

    var empOrder = [], empSeen = {}, empUserId = {}, empCode = {};
    for (var i = 0; i < data.length; i++) {
        var u = data[i].username;
        if (!empSeen[u]) {
            empSeen[u] = true;
            empOrder.push(u);
            empUserId[u] = data[i].userId;   // remember userId for totals lookup
            empCode[u]   = data[i].empcode;  // remember empcode for display
        }
    }

    var pivot = {};
    for (var i = 0; i < data.length; i++) {
        var r = data[i];
        if (!pivot[r.username]) pivot[r.username] = {};
        pivot[r.username][r.jobCode] = parseFloat(r.finalTotal) || 0;
    }

    var thHtml = '<th>SL.NO</th><th>Location</th><th>Emp Code</th><th style="text-align:left">Name</th>';
    for (var c = 0; c < contracts.length; c++) {
        var headerName = (contracts[c] === 'Stock') ? 'Indirect' : contracts[c];
        thHtml += '<th>' + headerName + '</th>';
    }
    thHtml += '<th>Total</th>';
    $("#" + tableId + " thead tr").html(thHtml);

    var bodyHtml = "";

    for (var e = 0; e < empOrder.length; e++) {
        var emp     = empOrder[e];
        var empData = pivot[emp] || {};
        var rowBg   = (e % 2 === 0) ? "#ffffff" : "#f4f9f4";

        var locId = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].username === emp) { locId = data[i].location; break; }
        }
        var locName = locMap[locId] || "-";

        // ── row total comes straight from backend, keyed by userId ──
        var rowTotal = totals.rowTotals[String(empUserId[emp])] || 0;

        bodyHtml += '<tr style="background:' + rowBg + '">';
        bodyHtml += '<td>' + (e + 1) + '</td>';
        bodyHtml += '<td style="font-weight:500;color:#37499A">' + locName + '</td>';
        bodyHtml += '<td>' + (empCode[emp] || "-") + '</td>';
        bodyHtml += '<td style="text-align:left;font-weight:500">' + emp + '</td>';

        for (var c = 0; c < contracts.length; c++) {
            var h = empData[contracts[c]] || 0;
            bodyHtml += (h > 0)
                ? '<td style="color:#155724;font-weight:600">' + h.toFixed(2) + '</td>'
                : '<td style="color:#ccc">-</td>';
        }

        bodyHtml += '<td style="font-weight:700;background:#e8f5e9;color:#1b5e20">'
                 + rowTotal.toFixed(2) + '</td>';
        bodyHtml += '</tr>';
    }

    // ── TOTAL footer row — also straight from backend ──
    bodyHtml += '<tr style="background:#1b5e20;color:#fff;font-weight:700">';
    bodyHtml += '<td></td><td></td><td></td>';
    bodyHtml += '<td style="text-align:left;letter-spacing:.5px">TOTAL</td>';
    for (var c = 0; c < contracts.length; c++) {
        var colTotal = totals.columnTotals[contracts[c]] || 0;
        bodyHtml += '<td>' + colTotal.toFixed(2) + '</td>';
    }
    bodyHtml += '<td style="background:#145214">' + (totals.grandTotal || 0).toFixed(2) + '</td>';
    bodyHtml += '</tr>';

    $("#" + tableId + " tbody").html(bodyHtml);
}


/*function exportToExcelitem(type) {
    var data   = (type === "finance") ? (window._lastFinanceData   || []) : (window._lastReportData   || []);
    var totals = (type === "finance") ? (window._lastFinanceTotals || {}) : (window._lastReportTotals || {});
    var sheetName = (type === "finance") ? "DO Finance Sheet" : "DO Time Sheet ";
    var fileName  = (type === "finance") ? "DO_Finance_Report.xlsx" : "DO_TimeSheet_Report.xlsx";

    if (!data || data.length === 0) {
        alert("No data to export. Please search first.");
        return;
    }

    var contractSet = {};
    for (var i = 0; i < data.length; i++) { contractSet[data[i].jobCode] = true; }
    var contracts = Object.keys(contractSet).sort();

    var empOrder = [], empSeen = {}, empUserId = {};
    for (var i = 0; i < data.length; i++) {
        var u = data[i].username;
        if (!empSeen[u]) { empSeen[u] = true; empOrder.push(u); empUserId[u] = data[i].userId; }
    }

    var pivot = {};
    for (var i = 0; i < data.length; i++) {
        var r = data[i];
        if (!pivot[r.username]) pivot[r.username] = {};
        pivot[r.username][r.jobCode] = parseFloat(r.finalTotal) || 0;
    }

    var totalCols = 3 + contracts.length + 1;

    var titleRow  = ["DO Manhours"];
    var headerRow = ["SL.NO", "Location", "Name"];
    for (var c = 0; c < contracts.length; c++) { headerRow.push(contracts[c]); }
    headerRow.push("Total");

    var dataRows = [];

    for (var e = 0; e < empOrder.length; e++) {
        var emp     = empOrder[e];
        var empData = pivot[emp] || {};

        var locId = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].username === emp) { locId = data[i].location; break; }
        }
        var locName = locMap[locId] || "-";

        var row      = [e + 1, locName, emp];
        var rowTotal = totals.rowTotals[String(empUserId[emp])] || 0;

        for (var c = 0; c < contracts.length; c++) {
            row.push(empData[contracts[c]] || 0);
        }
        row.push(rowTotal);
        dataRows.push(row);
    }

    var totalRow = ["", "", "TOTAL"];
    for (var c = 0; c < contracts.length; c++) {
        totalRow.push(totals.columnTotals[contracts[c]] || 0);
    }
    totalRow.push(totals.grandTotal || 0);

    var aoa = [titleRow, headerRow].concat(dataRows).concat([totalRow]);

     ── Worksheet ── 
    var ws = XLSX.utils.aoa_to_sheet(aoa);

     ── Merge title row ── 
    ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }
    ];

     ── Column widths ── 
    var colWidths = [{ wch: 7 }, { wch: 16 }, { wch: 28 }];
    for (var c = 0; c < contracts.length; c++) {
        colWidths.push({ wch: Math.max(contracts[c].length + 2, 10) });
    }
    colWidths.push({ wch: 10 });
    ws["!cols"] = colWidths;

     ── Helper: encode cell address ── 
    function ec(r, c) { return XLSX.utils.encode_cell({ r: r, c: c }); }

     ── Helper: ensure cell exists ── 
    function ensureCell(addr, v) {
        if (!ws[addr]) ws[addr] = { v: v, t: typeof v === "number" ? "n" : "s" };
    }

     ── Row 0: Title ── 
    ensureCell(ec(0, 0), "DO Manhours");
    ws[ec(0, 0)].s = {
        font:      { bold: true, sz: 16, color: { rgb: "1B5E20" } },
        alignment: { horizontal: "center", vertical: "center" },
        fill:      { fgColor: { rgb: "E8F5E9" } }
    };

     ── Row 1: Header ── 
    for (var c = 0; c < headerRow.length; c++) {
        var addr = ec(1, c);
        ensureCell(addr, headerRow[c]);
        ws[addr].s = {
            font:      { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
            fill:      { fgColor: { rgb: "1B5E20" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top:    { style: "thin", color: { rgb: "FFFFFF" } },
                bottom: { style: "thin", color: { rgb: "FFFFFF" } },
                left:   { style: "thin", color: { rgb: "FFFFFF" } },
                right:  { style: "thin", color: { rgb: "FFFFFF" } }
            }
        };
    }

     ── Rows 2..N: data rows ── 
    for (var e = 0; e < dataRows.length; e++) {
        var row    = dataRows[e];
        var excelR = e + 2;  row 0=title, row 1=header, so data starts at 2 
        var isEven = (e % 2 === 0);
        var rowFill = isEven ? "FFFFFF" : "F4F9F4";

        for (var c = 0; c < row.length; c++) {
            var addr = ec(excelR, c);
            ensureCell(addr, row[c]);

             default cell style 
            var cellStyle = {
                fill:      { fgColor: { rgb: rowFill } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top:    { style: "thin", color: { rgb: "DDDDDD" } },
                    bottom: { style: "thin", color: { rgb: "DDDDDD" } },
                    left:   { style: "thin", color: { rgb: "DDDDDD" } },
                    right:  { style: "thin", color: { rgb: "DDDDDD" } }
                }
            };

            if (c === 0) {
                 SL.NO — plain 
                cellStyle.font = { sz: 10 };

            } else if (c === 1) {
                 Location — navy blue bold 
                cellStyle.font = { bold: true, sz: 10, color: { rgb: "37499A" } };

            } else if (c === 2) {
                 Name — left-aligned 
                cellStyle.font      = { bold: true, sz: 10 };
                cellStyle.alignment = { horizontal: "left", vertical: "center" };

            } else if (c === row.length - 1) {
                 Row Total — green bg 
                cellStyle.fill = { fgColor: { rgb: "E8F5E9" } };
                cellStyle.font = { bold: true, sz: 10, color: { rgb: "1B5E20" } };

            } else {
                 Contract hours columns 
                var val = row[c];
                if (val > 0) {
                     non-zero — dark green bold 
                    cellStyle.font = { bold: true, sz: 10, color: { rgb: "155724" } };
                } else {
                     zero — light grey dash 
                    ws[addr].v = "-";
                    ws[addr].t = "s";
                    cellStyle.font = { sz: 10, color: { rgb: "CCCCCC" } };
                }
            }

            ws[addr].s = cellStyle;
        }
    }

     ── Last row: TOTAL footer ── 
    var totalR = 2 + dataRows.length;
    for (var c = 0; c < totalRow.length; c++) {
        var addr = ec(totalR, c);
        ensureCell(addr, totalRow[c]);

        var bgColor = (c === totalRow.length - 1) ? "145214" : "1B5E20";
        ws[addr].s = {
            font:      { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
            fill:      { fgColor: { rgb: bgColor } },
            alignment: { horizontal: c === 2 ? "left" : "center", vertical: "center" },
            border: {
                top:    { style: "thin", color: { rgb: "FFFFFF" } },
                bottom: { style: "thin", color: { rgb: "FFFFFF" } },
                left:   { style: "thin", color: { rgb: "FFFFFF" } },
                right:  { style: "thin", color: { rgb: "FFFFFF" } }
            }
        };
    }

     ── Write — use xlsxb (bookType xlsx supports styles) ── 
	var wb = XLSX.utils.book_new();
	  XLSX.utils.book_append_sheet(wb, ws, sheetName);
	  XLSX.writeFile(wb, fileName);
}*/



function exportToExcelitem(type) {
    var data   = (type === "finance") ? (window._lastFinanceData   || []) : (window._lastReportData   || []);
    var totals = (type === "finance") ? (window._lastFinanceTotals || {}) : (window._lastReportTotals || {});
    var sheetName = (type === "finance") ? "DO Finance Sheet" : "DO Time Sheet ";
    var fileName  = (type === "finance") ? "DO_Finance_Report.xlsx" : "DO_TimeSheet_Report.xlsx";

    if (!data || data.length === 0) {
        alert("No data to export. Please search first.");
        return;
    }

	var contractSet = {};
	for (var i = 0; i < data.length; i++) { contractSet[data[i].jobCode] = true; }
	var contracts = Object.keys(contractSet).sort();

	var empOrder = [], empSeen = {}, empUserId = {}, empCode = {};
	for (var i = 0; i < data.length; i++) {
	    var u = data[i].username;
	    if (!empSeen[u]) {
	        empSeen[u] = true;
	        empOrder.push(u);
	        empUserId[u] = data[i].userId;
	        empCode[u]   = data[i].empcode;
	    }
	}

	var pivot = {};
	for (var i = 0; i < data.length; i++) {
	    var r = data[i];
	    if (!pivot[r.username]) pivot[r.username] = {};
	    pivot[r.username][r.jobCode] = parseFloat(r.finalTotal) || 0;
	}

	var totalCols = 4 + contracts.length + 1;

	var titleRow  = ["DO Manhours"];
	var headerRow = ["SL.NO", "Location", "Emp Code", "Name"];
	for (var c = 0; c < contracts.length; c++) {
	    var headerName = (contracts[c] === 'Stock') ? 'Indirect' : contracts[c];
	    headerRow.push(headerName);
	}
	headerRow.push("Total");

    var dataRows = [];

    for (var e = 0; e < empOrder.length; e++) {
        var emp     = empOrder[e];
        var empData = pivot[emp] || {};

        var locId = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].username === emp) { locId = data[i].location; break; }
        }
        var locName = locMap[locId] || "-";

        var row      = [e + 1, locName, empCode[emp] || "-", emp];
        var rowTotal = totals.rowTotals[String(empUserId[emp])] || 0;

        for (var c = 0; c < contracts.length; c++) {
            row.push(empData[contracts[c]] || 0);
        }
        row.push(rowTotal);
        dataRows.push(row);
    }

    var totalRow = ["", "", "", "TOTAL"];
    for (var c = 0; c < contracts.length; c++) {
        totalRow.push(totals.columnTotals[contracts[c]] || 0);
    }
    totalRow.push(totals.grandTotal || 0);

    var aoa = [titleRow, headerRow].concat(dataRows).concat([totalRow]);

    var ws = XLSX.utils.aoa_to_sheet(aoa);

    ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }
    ];

    var colWidths = [{ wch: 7 }, { wch: 16 }, { wch: 12 }, { wch: 28 }];
    for (var c = 0; c < contracts.length; c++) {
        colWidths.push({ wch: Math.max(contracts[c].length + 2, 10) });
    }
    colWidths.push({ wch: 10 });
    ws["!cols"] = colWidths;

    function ec(r, c) { return XLSX.utils.encode_cell({ r: r, c: c }); }

    function ensureCell(addr, v) {
        if (!ws[addr]) ws[addr] = { v: v, t: typeof v === "number" ? "n" : "s" };
    }

    ensureCell(ec(0, 0), "DO Manhours");
    ws[ec(0, 0)].s = {
        font:      { bold: true, sz: 16, color: { rgb: "1B5E20" } },
        alignment: { horizontal: "center", vertical: "center" },
        fill:      { fgColor: { rgb: "E8F5E9" } }
    };

    for (var c = 0; c < headerRow.length; c++) {
        var addr = ec(1, c);
        ensureCell(addr, headerRow[c]);
        ws[addr].s = {
            font:      { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
            fill:      { fgColor: { rgb: "1B5E20" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top:    { style: "thin", color: { rgb: "FFFFFF" } },
                bottom: { style: "thin", color: { rgb: "FFFFFF" } },
                left:   { style: "thin", color: { rgb: "FFFFFF" } },
                right:  { style: "thin", color: { rgb: "FFFFFF" } }
            }
        };
    }

    for (var e = 0; e < dataRows.length; e++) {
        var row    = dataRows[e];
        var excelR = e + 2;
        var isEven = (e % 2 === 0);
        var rowFill = isEven ? "FFFFFF" : "F4F9F4";

        for (var c = 0; c < row.length; c++) {
            var addr = ec(excelR, c);
            ensureCell(addr, row[c]);

            var cellStyle = {
                fill:      { fgColor: { rgb: rowFill } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top:    { style: "thin", color: { rgb: "DDDDDD" } },
                    bottom: { style: "thin", color: { rgb: "DDDDDD" } },
                    left:   { style: "thin", color: { rgb: "DDDDDD" } },
                    right:  { style: "thin", color: { rgb: "DDDDDD" } }
                }
            };

            if (c === 0) {
                cellStyle.font = { sz: 10 };

            } else if (c === 1) {
                cellStyle.font = { bold: true, sz: 10, color: { rgb: "37499A" } };

            } else if (c === 2) {
                /* Emp Code — plain centered */
                cellStyle.font = { sz: 10 };

            } else if (c === 3) {
                /* Name — left-aligned */
                cellStyle.font      = { bold: true, sz: 10 };
                cellStyle.alignment = { horizontal: "left", vertical: "center" };

            } else if (c === row.length - 1) {
                cellStyle.fill = { fgColor: { rgb: "E8F5E9" } };
                cellStyle.font = { bold: true, sz: 10, color: { rgb: "1B5E20" } };

            } else {
                var val = row[c];
                if (val > 0) {
                    cellStyle.font = { bold: true, sz: 10, color: { rgb: "155724" } };
                } else {
                    ws[addr].v = "-";
                    ws[addr].t = "s";
                    cellStyle.font = { sz: 10, color: { rgb: "CCCCCC" } };
                }
            }

            ws[addr].s = cellStyle;
        }
    }

    var totalR = 2 + dataRows.length;
    for (var c = 0; c < totalRow.length; c++) {
        var addr = ec(totalR, c);
        ensureCell(addr, totalRow[c]);

        var bgColor = (c === totalRow.length - 1) ? "145214" : "1B5E20";
        ws[addr].s = {
            font:      { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
            fill:      { fgColor: { rgb: bgColor } },
            alignment: { horizontal: c === 3 ? "left" : "center", vertical: "center" },
            border: {
                top:    { style: "thin", color: { rgb: "FFFFFF" } },
                bottom: { style: "thin", color: { rgb: "FFFFFF" } },
                left:   { style: "thin", color: { rgb: "FFFFFF" } },
                right:  { style: "thin", color: { rgb: "FFFFFF" } }
            }
        };
    }

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
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

