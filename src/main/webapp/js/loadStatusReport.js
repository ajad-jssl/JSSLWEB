/* ═══════════════════════════════════════════════════════
   G2 Load Report — Factory -> Contract -> Phase -> Load -> Fetch -> Export
   Written in the same style as QCEntry.js: plain DOM + fetch(new URL(path, baseUrl1)).
═══════════════════════════════════════════════════════ */

const G2_BASE_URL = "/jssl/g2/loadreport";

let currentPage = 1;
const rowsPerPage = 10;

let currentReportData = [];
let currentReportMeta = {}; // contract/phase/load labels for export headers

document.addEventListener("DOMContentLoaded", function () {

    const requiredIds = [
        "factorySelect", "fromDate", "toDate",
        "contractInput", "phaseInput", "loadInput",
        "fetchBtn", "exportBtn", "exportPdfBtn", "reportBody"
    ];

    const missing = requiredIds.filter(id => !document.getElementById(id));
    if (missing.length) {
        console.error(
            "G2 Load Report: the following element ids were not found on this page — " +
            "check your JSP markup matches these ids exactly: " + missing.join(", ")
        );
    }

    const contractInput = document.getElementById("contractInput");
    const phaseInput = document.getElementById("phaseInput");
    const loadInput = document.getElementById("loadInput");

    if (contractInput) resetDropdown(contractInput, "Select Contract");
    if (phaseInput) resetDropdown(phaseInput, "Select Phase");
    if (loadInput) resetDropdown(loadInput, "Select Load");
    disableExportButtons();

    const factorySelect = document.getElementById("factorySelect");
    const fromDate = document.getElementById("fromDate");
    const toDate = document.getElementById("toDate");
    const fetchBtn = document.getElementById("fetchBtn");
    const exportBtn = document.getElementById("exportBtn");
    const exportPdfBtn = document.getElementById("exportPdfBtn");

    if (factorySelect) factorySelect.addEventListener("change", onFactoryChange);
    if (fromDate) fromDate.addEventListener("change", onDateRangeChange);
    if (toDate) toDate.addEventListener("change", onDateRangeChange);
    if (contractInput) contractInput.addEventListener("change", onContractChange);
    if (phaseInput) phaseInput.addEventListener("change", onPhaseChange);
    if (loadInput) loadInput.addEventListener("change", onLoadChange);
    if (fetchBtn) fetchBtn.addEventListener("click", fetchReport);
    if (exportBtn) exportBtn.addEventListener("click", exportToExcel);
    if (exportPdfBtn) exportPdfBtn.addEventListener("click", exportToPDF);
});

/* -------------------- UTIL -------------------- */
function resetDropdown(dropdown, defaultText) {
    dropdown.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = defaultText;
    dropdown.appendChild(opt);
}

function disableExportButtons() {
    const exportBtn = document.getElementById("exportBtn");
    const exportPdfBtn = document.getElementById("exportPdfBtn");
    if (exportBtn) exportBtn.disabled = true;
    if (exportPdfBtn) exportPdfBtn.disabled = true;
}

function enableExportButtons() {
    const exportBtn = document.getElementById("exportBtn");
    const exportPdfBtn = document.getElementById("exportPdfBtn");
    if (exportBtn) exportBtn.disabled = false;
    if (exportPdfBtn) exportPdfBtn.disabled = false;
}

function selectedText(selectId) {
    const el = document.getElementById(selectId);
    return el && el.selectedOptions.length ? el.selectedOptions[0].text : "";
}

/* -------------------- STEP 1: FACTORY CHANGE -> LOAD CONTRACTS -------------------- */
function onFactoryChange() {
    resetDropdown(document.getElementById("contractInput"), "Select Contract");
    resetDropdown(document.getElementById("phaseInput"), "Select Phase");
    resetDropdown(document.getElementById("loadInput"), "Select Load");
    disableExportButtons();

    const factory = document.getElementById("factorySelect").value;
    if (!factory) return;

    loadContracts(factory);
}

function loadContracts(factory) {
    const contractDDL = document.getElementById("contractInput");

    resetDropdown(contractDDL, "Loading…");
    contractDDL.disabled = true;

    fetch(
        new URL(`${G2_BASE_URL}/contracts?factory=${factory}`, baseUrl1),
        { method: "GET", credentials: "include" }
    )
    .then(res => res.json())
    .then(data => {
        resetDropdown(contractDDL, "Select Contract");
        contractDDL.disabled = false;

        if (data.error) {
            console.error("Contracts error:", data.error);
            return;
        }

        (data.Data || []).forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.contract_id;
            opt.textContent = item.contract_name;
            contractDDL.appendChild(opt);
        });
    })
    .catch(err => {
        console.error("Error loading contracts", err);
        resetDropdown(contractDDL, "Select Contract");
        contractDDL.disabled = false;
    });
}

/* -------------------- DATE RANGE CHANGE -------------------- */
// Dates only filter Phases/Loads, so Contracts are left untouched here.
function onDateRangeChange() {
    resetDropdown(document.getElementById("phaseInput"), "Select Phase");
    resetDropdown(document.getElementById("loadInput"), "Select Load");
    disableExportButtons();
}

/* -------------------- STEP 2: CONTRACT CHANGE -> LOAD PHASES -------------------- */
function onContractChange() {
    resetDropdown(document.getElementById("phaseInput"), "Select Phase");
    resetDropdown(document.getElementById("loadInput"), "Select Load");
    disableExportButtons();

    const contractId = document.getElementById("contractInput").value;
    if (!contractId) return;

    loadPhases();
}

function loadPhases() {
    const factory = document.getElementById("factorySelect").value;
    const contractId = document.getElementById("contractInput").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    fetch(
        new URL(
            `${G2_BASE_URL}/phases?factory=${factory}&contractId=${contractId}&fromDate=${fromDate}&toDate=${toDate}`,
            baseUrl1
        ),
        { method: "GET", credentials: "include" }
    )
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
            return;
        }
        const phaseDDL = document.getElementById("phaseInput");
        resetDropdown(phaseDDL, "Select Phase");
        (data.Data || []).forEach(phase => {
            const opt = document.createElement("option");
            opt.value = phase;
            opt.textContent = phase;
            phaseDDL.appendChild(opt);
        });
    })
    .catch(err => console.error("Failed to load phases", err));
}

/* -------------------- STEP 3: PHASE CHANGE -> LOAD LOADS -------------------- */
function onPhaseChange() {
    resetDropdown(document.getElementById("loadInput"), "Select Load");
    disableExportButtons();

    const phase = document.getElementById("phaseInput").value;
    if (!phase) return;

    loadLoads();
}

function loadLoads() {
    const factory = document.getElementById("factorySelect").value;
    const contractId = document.getElementById("contractInput").value;
    const phase = document.getElementById("phaseInput").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const type = document.getElementById("typeselect").value;

    fetch(
        new URL(
            `${G2_BASE_URL}/loads?factory=${factory}&contractId=${contractId}&phase=${encodeURIComponent(phase)}&fromDate=${fromDate}&toDate=${toDate}`,
            baseUrl1
        ),
        { method: "GET", credentials: "include" }
    )
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
            return;
        }

        const loadDDL = document.getElementById("loadInput");

        // Summary -> Show All
        if (type === "1") {
            resetDropdown(loadDDL, "All");
        } else {
            resetDropdown(loadDDL, "Select Load");
        }

        (data.Data || []).forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.load_id;
            opt.textContent = item.pload;
            loadDDL.appendChild(opt);
        });

        // Select "All" by default for Summary
        if (type === "1") {
            loadDDL.selectedIndex = 0;
        }
    })
    .catch(err => console.error("Failed to load loads", err));
}

/* -------------------- STEP 4: LOAD CHANGE -------------------- */
function onLoadChange() {
    disableExportButtons();
}

/* ═══════════════════════════════════════════════════════
   FETCH REPORT
═══════════════════════════════════════════════════════ */
function fetchReport() {

    const type = document.getElementById("typeselect").value;
	if (type === "1") {
	    // Summary
	    REPORT_COLUMNS = ALL_REPORT_COLUMNS.filter(col =>
	        !["mark", "ssize", "dims", "paintcode", "descr"].includes(col.key)
	    );
	} else {
	    // Detail
	    REPORT_COLUMNS = [...ALL_REPORT_COLUMNS];
	}
    const factory = document.getElementById("factorySelect").value;
    const contractId = document.getElementById("contractInput").value;
    const phase = document.getElementById("phaseInput").value;
    const loadId = document.getElementById("loadInput").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    // Validation
    if (!factory || !contractId || !phase || (type === "2" && !loadId)) {
        const reportBody = document.getElementById("reportBody");
        reportBody.innerHTML =
            '<div class="state-msg error">Please select Factory, Contract, Phase' +
            (type === "2" ? ", and Load" : "") +
            ' before fetching.</div>';
        return;
    }

    // Validate date range
    if (fromDate && toDate && fromDate > toDate) {
        const reportBody = document.getElementById("reportBody");
        reportBody.innerHTML =
            '<div class="state-msg error">From Date cannot be after To Date.</div>';
        return;
    }

    currentReportMeta = {
        type: selectedText("typeselect"),
        factory: selectedText("factorySelect"),
        contract: selectedText("contractInput"),
        phase: phase,
        load: loadId ? selectedText("loadInput") : "All",
        fromDate: fromDate,
        toDate: toDate
    };

    const fetchBtn = document.getElementById("fetchBtn");
    fetchBtn.disabled = true;
    disableExportButtons();

    const reportBody = document.getElementById("reportBody");
    reportBody.innerHTML = '<div class="state-msg">Loading report...</div>';

    // Build API URL
    let apiUrl;

    if (type === "1") {
        // Summary Report
        apiUrl =
            `${G2_BASE_URL}/fetch-summary-report?factory=${factory}` +
            `&contractId=${contractId}` +
            `&phase=${encodeURIComponent(phase)}` +
            `&fromDate=${encodeURIComponent(fromDate)}` +
            `&toDate=${encodeURIComponent(toDate)}`;

        // Add loadId only when a specific load is selected
        if (loadId) {
            apiUrl += `&loadId=${encodeURIComponent(loadId)}`;
        }

    } else {
        // Detail Report
        apiUrl =
            `${G2_BASE_URL}/fetch-report?factory=${factory}` +
            `&contractId=${contractId}` +
            `&phase=${encodeURIComponent(phase)}` +
            `&loadId=${encodeURIComponent(loadId)}` +
            `&fromDate=${encodeURIComponent(fromDate)}` +
            `&toDate=${encodeURIComponent(toDate)}`;
    }

    fetch(
        new URL(apiUrl, baseUrl1),
        {
            method: "GET",
            credentials: "include"
        }
    )
    .then(res => res.json())
    .then(data => {

        if (data.error) {
            reportBody.innerHTML =
                '<div class="state-msg error">' + data.error + '</div>';
            return;
        }

        currentReportData = data.Data || [];
        currentPage = 1;

        if (currentReportData.length === 0) {
            reportBody.innerHTML =
                '<div class="state-msg">No records found for the selected filters.</div>';
            return;
        }

        renderReportTable(currentReportData);
        enableExportButtons();

    })
    .catch(err => {
        console.error(err);
        reportBody.innerHTML =
            '<div class="state-msg error">Failed to fetch report. Please try again.</div>';
    })
    .finally(() => {
        fetchBtn.disabled = false;
    });
}
/* ═══════════════════════════════════════════════════════
   RENDER TABLE
═══════════════════════════════════════════════════════ */
// `numeric: true` marks the columns that get summed in the totals row
// and right-aligned. Non-numeric columns are still right-aligned per the
// "all values right aligned" requirement, they just have nothing to sum.
let REPORT_COLUMNS = [
    { key: 'pzone', label: 'Phase' },
    { key: 'pload', label: 'Load' },
    { key: 'pqty', label: 'Qty', numeric: true },
    { key: 'mark', label: 'Mark' },
    { key: 'ssize', label: 'Size' },
    { key: 'dims', label: 'Dims' },
    { key: 'paintcode', label: 'Paint Code' },
    { key: 'eweight', label: 'Unit Weight', numeric: true },
    { key: 'tweight', label: 'Total Weight', numeric: true },
    { key: 'tarea', label: 'Total Area', numeric: true },
    { key: 'descr', label: 'Description' },
	{ key: 'Assembledqty', label: 'Ass Qty', numeric: true },
    { key: 'AssembledWeight', label: 'Ass Total Wt', numeric: true },
	{ key: 'Weldedqty', label: 'Weld Qty', numeric: true },
    { key: 'WeldedWeight', label: 'Weld Total Wt', numeric: true },
	{ key: 'treatedqty', label: 'Treat Qty', numeric: true },
    { key: 'TreatedWeight', label: 'Treat Total Wt', numeric: true },
	{ key: 'DispatchedWeight', label: 'Dispatched Total Wt', numeric: true },
	{ key: 'DispatchStatus', label: 'Dispatch Status' },
    { key: 'DispatchBalanceQty', label: 'Dispatch Bal Qty', numeric: true },

];
const ALL_REPORT_COLUMNS = [...REPORT_COLUMNS];
function statusBadge(value) {
    if (value === 'Shipped') {
        return '<span style="color:#198754;font-weight:600;">Shipped</span>';
    }
    if (value === 'NotShipped') {
        return '<span style="color:#dc3545;font-weight:600;">NotShipped</span>';
    }
    return value == null ? '' : value;
}

// Sums a numeric column across all rows, rounding to 2 decimals and
// trimming trailing zeros so whole numbers show as e.g. "120" not "120.00".
function sumColumn(rows, key) {
    const total = rows.reduce((acc, row) => {
        const n = parseFloat(row[key]);
        return acc + (isNaN(n) ? 0 : n);
    }, 0);
    return Math.round(total * 100) / 100;
}

/* -------------------- PAGINATION CSS + HELPERS -------------------- */
const PAGINATION_CSS = `
<style>
  .dt-footer { display:flex; justify-content:space-between; align-items:center; margin-top:10px; margin-bottom:4px; font-size:13px; color:#555; flex-wrap:wrap; gap:8px; }
  .dt-info { color:#666; }
  .dt-pagination { display:flex; gap:4px; align-items:center; }
  .dt-pagination button { min-width:34px; height:34px; border:1px solid #dee2e6; background:#fff; color:#333; font-size:13px; border-radius:4px; cursor:pointer; padding:0 10px; transition:background 0.15s; }
  .dt-pagination button:hover:not(:disabled) { background:#e9ecef; }
  .dt-pagination button.active { background:#4361ee; color:#fff; border-color:#4361ee; font-weight:600; }
  .dt-pagination button:disabled { color:#aaa; cursor:default; background:#f8f9fa; }
  .dt-pagination .ellipsis { padding:0 4px; color:#888; line-height:34px; }
</style>`;

function buildPagination(current, total) {
    let html = `<button onclick="prevPage()" ${current === 1 ? 'disabled' : ''}>Previous</button>`;

    getPageNumbers(current, total).forEach(p => {
        if (p === '...') {
            html += `<span class="ellipsis">...</span>`;
        } else {
            html += `<button onclick="goToPage(${p})" class="${p === current ? 'active' : ''}">${p}</button>`;
        }
    });

    html += `<button onclick="nextPage()" ${current === total ? 'disabled' : ''}>Next</button>`;
    return html;
}

function getPageNumbers(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [];
    if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...'); pages.push(total);
    } else if (current >= total - 3) {
        pages.push(1); pages.push('...');
        for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
        pages.push(1); pages.push('...');
        pages.push(current - 1); pages.push(current); pages.push(current + 1);
        pages.push('...'); pages.push(total);
    }
    return pages;
}

function nextPage()  { currentPage++; renderReportTable(currentReportData); }
function prevPage()  { currentPage--; renderReportTable(currentReportData); }
function goToPage(p) { currentPage = p; renderReportTable(currentReportData); }

/* -------------------- MAIN RENDER (now paginated) -------------------- */
function renderReportTable(data) {
	
    const reportBody = document.getElementById("reportBody");

    const totalPages = Math.ceil(data.length / rowsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * rowsPerPage;
    const pageRows = data.slice(start, start + rowsPerPage);
    const dataStart = data.length ? start + 1 : 0;
    const dataEnd = start + pageRows.length;

    let html = PAGINATION_CSS;
    html += '<table class="table table-bordered table-sm table-striped" style="font-size:12px;">';

    html += '<thead><tr style="background:#cfe8fc;">';
    REPORT_COLUMNS.forEach(col => {
        html += '<th style="text-align:right;background:#cfe8fc;">' + col.label + '</th>';
    });
    html += '</tr></thead><tbody>';

    pageRows.forEach(row => {
        html += '<tr>';
        REPORT_COLUMNS.forEach(col => {
            const val = row[col.key];
            if (col.key.endsWith('Status')) {
                html += '<td style="text-align:right;">' + statusBadge(val) + '</td>';
            } else {
                html += '<td style="text-align:right;">' + (val == null ? '' : val) + '</td>';
            }
        });
        html += '</tr>';
    });

    html += '</tbody>';

    // -------- Page total row (current page only) --------
    html += '<tfoot><tr style="font-weight:700;background:#fff3b0;border-top:2px solid #e0c200;">';
    REPORT_COLUMNS.forEach((col, idx) => {
        if (idx === 0) {
            html += '<td style="text-align:right;background:#fff3b0;">Page Total</td>';
        } else if (col.numeric) {
            html += '<td style="text-align:right;background:#fff3b0;">' + sumColumn(pageRows, col.key) + '</td>';
        } else {
            html += '<td style="text-align:right;background:#fff3b0;"></td>';
        }
    });
    html += '</tr>';

    // -------- Grand total row (all data, shown on the last page) --------
    if (currentPage === totalPages) {
        html += '<tr style="font-weight:700;background:#e8f5e9;color:#2e7d32;border-top:2px solid #66bb6a;">';
        REPORT_COLUMNS.forEach((col, idx) => {
            if (idx === 0) {
                html += '<td style="text-align:right;background:#e8f5e9;">Grand Total</td>';
            } else if (col.numeric) {
                html += '<td style="text-align:right;background:#e8f5e9;">' + sumColumn(data, col.key) + '</td>';
            } else {
                html += '<td style="text-align:right;background:#e8f5e9;"></td>';
            }
        });
        html += '</tr>';
    }
    html += '</tfoot>';

    html += '</table>';

    html += `<div class="dt-footer">
        <div class="dt-info">Showing ${dataStart} to ${dataEnd} of ${data.length} entries</div>
        <div class="dt-pagination">${buildPagination(currentPage, totalPages)}</div>
      </div>`;

    reportBody.innerHTML = html;
}

/* ═══════════════════════════════════════════════════════
   EXPORT TO EXCEL (unchanged — exports full dataset)
═══════════════════════════════════════════════════════ */
function exportToExcel() {
    if (!currentReportData.length) return;

    const exportRows = currentReportData.map(row => {
        const obj = {};
        REPORT_COLUMNS.forEach(col => {
            obj[col.label] = row[col.key];
        });
        return obj;
    });

    // Append a totals row at the bottom of the sheet, matching the grand total.
    const totalsRow = {};
    REPORT_COLUMNS.forEach((col, idx) => {
        if (idx === 0) {
            totalsRow[col.label] = 'Grand Total';
        } else if (col.numeric) {
            totalsRow[col.label] = sumColumn(currentReportData, col.key);
        } else {
            totalsRow[col.label] = '';
        }
    });
    exportRows.push(totalsRow);

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Load Status');

    const fileName =
        'LoadStatus_' +
        (currentReportMeta.load || 'load') + '_' +
        (currentReportMeta.fromDate || '') + '_to_' +
        (currentReportMeta.toDate || '') + '.xlsx';

    XLSX.writeFile(wb, fileName.replace(/\s+/g, '_'));
}

/* ═══════════════════════════════════════════════════════
   EXPORT TO PDF (unchanged — exports full dataset)
═══════════════════════════════════════════════════════ */
function exportToPDF() {
    if (!currentReportData.length) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a3' });

    doc.setFontSize(12);
    doc.text('Production / Load Status Report', 40, 30);
    doc.setFontSize(9);
    doc.text(
        'Contract: ' + (currentReportMeta.contract || '') +
        '   Phase: ' + (currentReportMeta.phase || '') +
        '   Load: ' + (currentReportMeta.load || ''),
        40, 46
    );

    const head = [REPORT_COLUMNS.map(c => c.label)];
    const body = currentReportData.map(row => {
        return REPORT_COLUMNS.map(col => {
            const val = row[col.key];
            return val == null ? '' : String(val);
        });
    });

    // Totals row, appended as the last body row and styled distinctly below.
    const totalsRow = REPORT_COLUMNS.map((col, idx) => {
        if (idx === 0) return 'Grand Total';
        if (col.numeric) return String(sumColumn(currentReportData, col.key));
        return '';
    });
    body.push(totalsRow);
    const totalsRowIndex = body.length - 1;

    doc.autoTable({
        head: head,
        body: body,
        startY: 56,
        styles: { fontSize: 6, cellPadding: 2, halign: 'right' },
        headStyles: { fillColor: [55, 73, 154], halign: 'right' },
        didParseCell: function (data) {
            const colLabel = REPORT_COLUMNS[data.column.index] && REPORT_COLUMNS[data.column.index].label;
            if (data.section === 'body' && colLabel &&
                ['Assembled', 'Welded', 'Treated', 'Dispatch'].includes(colLabel)) {
                if (data.cell.raw === 'Completed') {
                    data.cell.styles.textColor = [25, 135, 84];
                } else if (data.cell.raw === 'Incompleted') {
                    data.cell.styles.textColor = [220, 53, 69];
                }
            }
            if (data.section === 'body' && data.row.index === totalsRowIndex) {
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fillColor = [255, 243, 176];
            }
        }
    });

    const fileName =
        'LoadStatus_' +
        (currentReportMeta.load || 'load') + '_' +
        (currentReportMeta.fromDate || '') + '_to_' +
        (currentReportMeta.toDate || '') + '.pdf';

    doc.save(fileName.replace(/\s+/g, '_'));
}

document.getElementById("typeselect").addEventListener("change", onTypeChange);

function onTypeChange() {

    // Clear Factory
    document.getElementById("factorySelect").value = "";

    // Clear Contract
    resetDropdown(document.getElementById("contractInput"), "Select Contract");

    // Clear Phase
    resetDropdown(document.getElementById("phaseInput"), "Select Phase");

    // Clear Load
    resetDropdown(document.getElementById("loadInput"), "Select Load");

    // Clear Dates
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";

    // Clear Report
    document.getElementById("reportBody").innerHTML = "";

    // Disable export buttons
    disableExportButtons();

    // Clear report data
    currentReportData = [];
    currentReportMeta = {};
    currentPage = 1;
}