/* ============================================================
   SaleCRMReport.js
   Talks to the Spring Boot REST controller: SaleCRMController
   Base mapping: /api/sale/crm/report/*
   ============================================================ */

/* ---------------- Permission check ---------------- */
document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();

    if (!allowedActions.includes("view")) {
        blockUI();   // 🔒 permanent block
        return;
    }
});

const MainPage = 'SaleCRMReport.jsp';
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

        if (!response.ok) {
            throw new Error("Failed to fetch actions");
        }

        allowedActions = await response.json();

    } catch (error) {
        console.error("Error:", error);
    }
}

/* =============================
   COLUMN CONFIG
   Single source of truth for the table, Excel export and PDF export
   so all three always stay in sync.
============================= */
const REPORT_COLUMNS = [
    { key: "project_name",             label: "Project Name",      align: "left" },
    { key: "client_name",              label: "Client Name",       align: "left" },
    { key: "zone_name",                label: "Zone" },
    { key: "segment_name",             label: "Segment" },
    { key: "design_basis_name",        label: "Design Basis" },
    { key: "stage_name",               label: "Current Stage" },
    { key: "tonnage",                  label: "Tonnage",           numeric: true },
    { key: "probable_value",           label: "Probable Value",    numeric: true },
    { key: "location",                 label: "Location" },
    { key: "tentative_closure_month",  label: "Tentative Closure" },
    { key: "quarter",                  label: "Quarter" },
    { key: "sales_person",             label: "Sales Person" },
    { key: "remark",                   label: "Remarks",           align: "left" }
];

const PAGE_SIZE = 10;

/* Holds the currently bound report so Excel/PDF export always
   reflects the full result set, independent of on-screen paging. */
let lastReportRows = [];
let lastReportMeta = { reportType: "-", summaryBy: "-", filterValue: "-" };

/* Paging state - only active for "Detail" reports */
let isPaged = false;
let currentPage = 1;

/* ---------------- Main report init (dropdown wiring) ---------------- */
document.addEventListener("DOMContentLoaded", function () {

    loadReportTypes();

    document.getElementById("reportType").addEventListener("change", function () {

        const val = this.value;

        // reset downstream controls every time report type changes
        document.getElementById("summaryByWrap").style.display = "none";
        document.getElementById("filterValueWrap").style.display = "none";
        document.getElementById("summaryBy").innerHTML = "";
        document.getElementById("filterValue").innerHTML = "";
        document.getElementById("container1").style.display = "none";

        if (val === "detail") {
            // Detail report: no further selection needed, load everything
            loadReportData("all", "", "Detail", "-", "-");

        } else if (val === "summary") {
            loadSummaryByOptions();
            document.getElementById("summaryByWrap").style.display = "block";
        }
    });

    document.getElementById("summaryBy").addEventListener("change", function () {

        const summaryType = this.value; // quarter | zone | segment

        document.getElementById("filterValueWrap").style.display = "none";
        document.getElementById("filterValue").innerHTML = "";
        document.getElementById("container1").style.display = "none";

        if (!summaryType) return;

        document.getElementById("filterValueLabel").textContent =
            summaryType === "quarter" ? "Select Quarter" :
            summaryType === "zone"    ? "Select Zone"    :
                                         "Select Segment";

        loadFilterValues(summaryType);
        document.getElementById("filterValueWrap").style.display = "block";
    });

    document.getElementById("filterValue").addEventListener("change", function () {

        const summaryType = document.getElementById("summaryBy").value; // quarter | zone | segment
        const value = this.value;
        const valueLabel = this.selectedOptions[0]?.text || "";
        const summaryLabel =
            summaryType === "quarter" ? "Quarter Wise Summary" :
            summaryType === "zone"    ? "Zone Wise Summary"    :
                                         "Segment Wise Summary";

        if (!value) {
            document.getElementById("container1").style.display = "none";
            return;
        }

        loadReportData(summaryType, value, "Summary", summaryLabel, valueLabel);
    });

});

/* =============================
   DROPDOWN 1: REPORT TYPE (static)
============================= */
function loadReportTypes() {

    const ddl = document.getElementById("reportType");

    ddl.innerHTML = `<option value="">Select report type</option>`;

    const options = [
        { value: "detail",  text: "Detail" },
        { value: "summary", text: "Summary" }
    ];

    options.forEach(o => {
        const opt = document.createElement("option");
        opt.value = o.value;
        opt.textContent = o.text;
        ddl.appendChild(opt);
    });
}

/* =============================
   DROPDOWN 2: SUMMARY BY (static)
============================= */
function loadSummaryByOptions() {

    const ddl = document.getElementById("summaryBy");

    ddl.innerHTML = `<option value="">Select summary type</option>`;

    const options = [
        { value: "quarter", text: "Quarter Wise Summary" },
        { value: "zone",    text: "Zone Wise Summary" },
        { value: "segment", text: "Segment Wise Summary" }
    ];

    options.forEach(o => {
        const opt = document.createElement("option");
        opt.value = o.value;
        opt.textContent = o.text;
        ddl.appendChild(opt);
    });
}

/* =============================
   DROPDOWN 3: FILTER VALUE (from API)
============================= */
function loadFilterValues(summaryType) {

    const endpoint =
        summaryType === "quarter" ? "/api/sale/crm/report/quarters" :
        summaryType === "zone"    ? "/api/sale/crm/report/zones"    :
                                     "/api/sale/crm/report/segments";

    const ddl = document.getElementById("filterValue");
    ddl.innerHTML = `<option value="">Select value</option>`;

    fetch(new URL(endpoint, baseUrl1), {
        method: "GET",
        credentials: "include"
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(data => {

        (data || []).forEach(row => {
            const opt = document.createElement("option");
            opt.value = row.id;
            opt.textContent = row.name;
            ddl.appendChild(opt);
        });

    })
    .catch(err => {
        console.error("Filter value error:", err);
        alert("Unable to load list. Please try again.");
    });
}

/* =============================
   REPORT DATA
============================= */
function loadReportData(type, value, reportTypeLabel, summaryByLabel, filterValueLabel) {

    const url = new URL("/api/sale/crm/report/data", baseUrl1);
    url.searchParams.set("type", type);
    if (value) url.searchParams.set("value", value);

    fetch(url, {
        method: "GET",
        credentials: "include"
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(data => {

        const reportData = Array.isArray(data) ? data : (data.Data || []);
        bindTable(reportData, reportTypeLabel, summaryByLabel, filterValueLabel);

    })
    .catch(err => {
        console.error("Report load error:", err);
        alert("Failed to load report. Please try again.");
        document.getElementById("container1").style.display = "none";
    });
}

/* =============================
   BIND ROWS INTO TABLE
============================= */
function bindTable(rows, reportTypeLabel, summaryByLabel, filterValueLabel) {

    document.getElementById("hdrReportType").textContent = reportTypeLabel;
    document.getElementById("hdrSummaryBy").textContent = summaryByLabel;
    document.getElementById("hdrFilterValue").textContent = filterValueLabel;

    // keep the full result set for export - independent of on-screen paging
    lastReportRows = rows || [];
    lastReportMeta = {
        reportType: reportTypeLabel,
        summaryBy: summaryByLabel,
        filterValue: filterValueLabel
    };

    // Only "Detail" reports get paginated 10-per-page; Summary stays a single page
    isPaged = reportTypeLabel === "Detail";
    currentPage = 1;

    // totals are always computed over the FULL data set, not just the visible page
    const totalTonnage = lastReportRows.reduce((s, r) => s + (Number(r.tonnage) || 0), 0);
    const totalValue = lastReportRows.reduce((s, r) => s + (Number(r.probable_value) || 0), 0);

    document.getElementById("ftrCount").textContent = lastReportRows.length;
    document.getElementById("ftrTonnage").textContent = fmtNum(totalTonnage);
    document.getElementById("ftrValue").textContent = fmtNum(totalValue);

    renderPage(1);
    document.getElementById("container1").style.display = "block";
}

/* =============================
   RENDER ONE PAGE OF ROWS
============================= */
function renderPage(page) {

    const tbody = document.getElementById("reportBody");
    tbody.innerHTML = "";

    const totalRows = lastReportRows.length;
    const totalPages = isPaged ? Math.max(1, Math.ceil(totalRows / PAGE_SIZE)) : 1;

    currentPage = Math.min(Math.max(1, page), totalPages);

    const start = isPaged ? (currentPage - 1) * PAGE_SIZE : 0;
    const end = isPaged ? Math.min(start + PAGE_SIZE, totalRows) : totalRows;

    lastReportRows.slice(start, end).forEach((row, idx) => {

        const slNo = start + idx + 1;

        const cells = REPORT_COLUMNS.map(col => {
            const raw = row[col.key];
            const display = col.numeric ? fmtNum(raw) : (raw || "-");
            const style = col.align === "left" ? ' style="text-align:left;white-space:normal;"' : "";
            return `<td${style}>${display}</td>`;
        }).join("");

        tbody.insertAdjacentHTML("beforeend", `<tr><td>${slNo}</td>${cells}</tr>`);
    });

    renderPagination(totalPages);
}

/* =============================
   PAGINATION CONTROLS
============================= */
function renderPagination(totalPages) {

    const wrap = document.getElementById("paginationWrap");
    wrap.innerHTML = "";

    if (!isPaged || totalPages <= 1) {
        wrap.style.display = "none";
        return;
    }

    wrap.style.display = "flex";

    const makeBtn = (label, targetPage, disabled, active) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "page-btn" + (active ? " active" : "");
        btn.textContent = label;
        btn.disabled = disabled;
        btn.addEventListener("click", () => renderPage(targetPage));
        return btn;
    };

    wrap.appendChild(makeBtn("\u00AB Prev", currentPage - 1, currentPage === 1, false));

    const maxButtons = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    startPage = Math.max(1, endPage - maxButtons + 1);

    for (let p = startPage; p <= endPage; p++) {
        wrap.appendChild(makeBtn(String(p), p, false, p === currentPage));
    }

    wrap.appendChild(makeBtn("Next \u00BB", currentPage + 1, currentPage === totalPages, false));

    const info = document.createElement("span");
    info.className = "page-info";
    info.textContent = `Page ${currentPage} of ${totalPages}`;
    wrap.appendChild(info);
}

function fmtNum(n) {
    if (n === null || n === undefined || isNaN(n)) return "-";
    return Number(n).toLocaleString("en-IN");
}

/* =============================
   EXPORT TO EXCEL (SheetJS)
   Always exports the FULL result set, regardless of the page on screen.
============================= */
function exportToExcel() {

    if (!lastReportRows.length) {
        alert("There is no data to export.");
        return;
    }

    const header = ["SL.NO", ...REPORT_COLUMNS.map(c => c.label)];

    const body = lastReportRows.map((row, i) => [
        i + 1,
        ...REPORT_COLUMNS.map(col => {
            const raw = row[col.key];
            return col.numeric ? (Number(raw) || 0) : (raw || "-");
        })
    ]);

    const infoRows = [
        [`Report Type: ${lastReportMeta.reportType}`],
        [`Summary By: ${lastReportMeta.summaryBy}`],
        [`Filter Value: ${lastReportMeta.filterValue}`],
        []
    ];

    const totalsRow = [
        "Total", "", "", "", "", "", "",
        lastReportRows.reduce((s, r) => s + (Number(r.tonnage) || 0), 0),
        lastReportRows.reduce((s, r) => s + (Number(r.probable_value) || 0), 0),
        "", "", "", "", ""
    ];

    const sheetData = [...infoRows, header, ...body, totalsRow];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    worksheet["!cols"] = header.map(() => ({ wch: 16 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sale CRM Report");

    XLSX.writeFile(workbook, `SaleCRMReport_${Date.now()}.xlsx`);
}

/* =============================
   EXPORT TO PDF (pdfmake)
   Always exports the FULL result set, regardless of the page on screen.
============================= */
function exportToPDF() {

    if (!lastReportRows.length) {
        alert("There is no data to export.");
        return;
    }

    const header = ["SL.NO", ...REPORT_COLUMNS.map(c => c.label)].map(text => ({
        text, style: "tableHeader"
    }));

    const body = lastReportRows.map((row, i) => [
        String(i + 1),
        ...REPORT_COLUMNS.map(col => {
            const raw = row[col.key];
            const display = col.numeric ? fmtNum(raw) : (raw || "-");
            return String(display);
        })
    ]);

    const totalTonnage = lastReportRows.reduce((s, r) => s + (Number(r.tonnage) || 0), 0);
    const totalValue = lastReportRows.reduce((s, r) => s + (Number(r.probable_value) || 0), 0);

    const docDefinition = {
        pageOrientation: "landscape",
        pageSize: "A4",
        pageMargins: [20, 40, 20, 30],
        content: [
            { text: "Sale CRM Report", style: "title" },
            {
                columns: [
                    { text: `Report Type: ${lastReportMeta.reportType}`, style: "meta" },
                    { text: `Summary By: ${lastReportMeta.summaryBy}`, style: "meta" },
                    { text: `Filter Value: ${lastReportMeta.filterValue}`, style: "meta" }
                ],
                margin: [0, 0, 0, 8]
            },
            {
                table: {
                    headerRows: 1,
                    widths: Array(REPORT_COLUMNS.length + 1).fill("auto"),
                    body: [header, ...body]
                },
                layout: {
                    fillColor: (rowIndex) => (rowIndex === 0 ? "#134e4a" : null),
                    hLineColor: () => "#a8d8d3",
                    vLineColor: () => "#a8d8d3"
                }
            },
            {
                text: `Total Records: ${lastReportRows.length}    Total Tonnage: ${fmtNum(totalTonnage)}    Total Probable Value: ${fmtNum(totalValue)}`,
                style: "meta",
                margin: [0, 8, 0, 0]
            }
        ],
        styles: {
            title: { fontSize: 14, bold: true, alignment: "center", margin: [0, 0, 0, 8], color: "#0f766e" },
            meta: { fontSize: 8 },
            tableHeader: { bold: true, fontSize: 7, color: "#ffffff" }
        },
        defaultStyle: { fontSize: 7 }
    };

    pdfMake.createPdf(docDefinition).download(`SaleCRMReport_${Date.now()}.pdf`);
}
