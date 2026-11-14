document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();

    if (!allowedActions.includes("view")) {
        blockUI();   // permanent block
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
   COLUMN CONFIG (Detail / Summary)
============================= */
const REPORT_COLUMNS = [
    { key: "lead_no",                  label: "Lead No" },
    { key: "enq_no",                   label: "Enq No" },
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
    { key: "sales_person",             label: "Sales Person" },
    { key: "remark",                   label: "Remarks",           align: "left" }
];
const PAGE_SIZE = 10;

/* Financial years offered in the Quarterly report.
   To expand later, add more years here AND raise FY_LAST in the controller. */
const FY_OPTIONS = [2026, 2027, 2028];

/* "All" is handled by the Select All checkbox */
const QUARTER_OPTIONS = [
    { value: "1", text: "Q1 (Apr - Jun)" },
    { value: "2", text: "Q2 (Jul - Sep)" },
    { value: "3", text: "Q3 (Oct - Dec)" },
    { value: "4", text: "Q4 (Jan - Mar)" }
];

let lastReportRows = [];
let lastReportMeta = { reportType: "-", summaryBy: "-", filterValue: "-" };

let isPaged = false;
let currentPage = 1;

let qRows = [];
let qGroups = [];
let qMeta = { fy: "-", quarter: "-", stage: "-" };

/* ---------------- helpers ---------------- */
function $(id) { return document.getElementById(id); }

function esc(s) {
    return String(s === null || s === undefined ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtNum(n) {
    if (n === null || n === undefined || n === "" || isNaN(n)) return "-";
    return Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function fmtWhole(n) {
    if (n === null || n === undefined || n === "" || isNaN(n)) return "";
    return Math.round(Number(n)).toLocaleString("en-IN");
}

function hideAllReports() {
    $("container1").style.display = "none";
    $("container2").style.display = "none";
}

function hideQuarterControls() {
    ["fyWrap", "quarterWrap", "stageWrap"].forEach(id => $(id).style.display = "none");
    msDestroy("fy");
    msDestroy("quarter");
    msDestroy("stage");
}

/* =====================================================================
   MULTI-SELECT CHECKBOX DROPDOWN
   - first item "Select All", then one checkbox per option
   - report reloads when the user clicks Apply or clicks outside
   - msParam() returns "all" when everything is ticked, else "1,3,5"
===================================================================== */
const MS = {};

/*function msInit(id, placeholder, onApply) {

    const root = $(id);
    const st = MS[id] = {
        items: [],
        selected: new Set(),
        placeholder: placeholder,
        onApply: onApply,
        snapshot: ""
    };

    root.innerHTML =
        `<button type="button" class="ms-btn form-control form-control-sm">
            <span class="ms-text"></span><i class="fas fa-chevron-down" style="font-size:10px;"></i>
         </button>
         <div class="ms-panel">
            <label class="ms-item ms-all"><input type="checkbox" class="ms-allchk"> <span>Select All</span></label>
            <div class="ms-list"></div>
            <div class="ms-foot"><button type="button" class="btn btn-sm ms-apply">Apply</button></div>
         </div>`;

    const panel = root.querySelector(".ms-panel");

    root.querySelector(".ms-btn").addEventListener("click", function (e) {
        e.stopPropagation();
        if (panel.classList.contains("open")) {
            msClose(id, true);
        } else {
            msCloseAll(id);
            msOpen(id);
        }
    });

    panel.addEventListener("click", e => e.stopPropagation());

    panel.addEventListener("change", function (e) {
        const t = e.target;
        if (t.classList.contains("ms-allchk")) {
            st.selected = t.checked ? new Set(st.items.map(i => String(i.value))) : new Set();
        } else if (t.dataset.value !== undefined) {
            if (t.checked) st.selected.add(t.dataset.value);
            else st.selected.delete(t.dataset.value);
        }
        msRefresh(id);
    });

    root.querySelector(".ms-apply").addEventListener("click", () => msClose(id, true));

    msSetItems(id, []);
}*/


function msInit(id, placeholder, onApply) {

    const root = $(id);
    const st = MS[id] = {
        items: [],
        selected: new Set(),
        placeholder: placeholder,
        onApply: onApply,
        snapshot: ""
    };

    root.innerHTML =
        `<button type="button" class="ms-btn form-control form-control-sm">
            <span class="ms-text"></span><i class="fas fa-chevron-down" style="font-size:10px;"></i>
         </button>
         <div class="ms-panel">
            <div class="ms-list"></div>
            <div class="ms-foot"><button type="button" class="btn btn-sm ms-apply">Apply</button></div>
         </div>`;

    const panel = root.querySelector(".ms-panel");

    root.querySelector(".ms-btn").addEventListener("click", function (e) {
        e.stopPropagation();
        if (panel.classList.contains("open")) {
            msClose(id, true);
        } else {
            msCloseAll(id);
            msOpen(id);
        }
    });

    panel.addEventListener("click", e => e.stopPropagation());

    panel.addEventListener("change", function (e) {
        const t = e.target;
        if (t.dataset.value !== undefined) {
            if (t.checked) st.selected.add(t.dataset.value);
            else st.selected.delete(t.dataset.value);
        }
        msRefresh(id);
    });

    root.querySelector(".ms-apply").addEventListener("click", () => msClose(id, true));

    msSetItems(id, []);
}




function msSetItems(id, items) {
    const st = MS[id];
    if (!st) return;

    st.items = items || [];
    st.selected = new Set();

    const list = $(id).querySelector(".ms-list");
    list.innerHTML = st.items.map(i =>
        `<label class="ms-item"><input type="checkbox" data-value="${esc(i.value)}"> <span>${esc(i.text)}</span></label>`
    ).join("");

    msRefresh(id);
}

/*function msRefresh(id) {
    const st = MS[id];
    if (!st) return;
    const root = $(id);

    root.querySelectorAll(".ms-list input").forEach(cb => {
        cb.checked = st.selected.has(cb.dataset.value);
    });

    const allChk = root.querySelector(".ms-allchk");
    const n = st.selected.size;
    allChk.checked = n > 0 && n === st.items.length;
    allChk.indeterminate = n > 0 && n < st.items.length;

    let text;
    if (n === 0) text = st.placeholder;
    else if (n === st.items.length) text = "All";
    else if (n <= 2) text = msLabel(id);
    else text = `${n} selected`;
    root.querySelector(".ms-text").textContent = text;
}*/



function msRefresh(id) {
    const st = MS[id];
    if (!st) return;
    const root = $(id);

    root.querySelectorAll(".ms-list input").forEach(cb => {
        cb.checked = st.selected.has(cb.dataset.value);
    });

    const n = st.selected.size;

    let text;
    if (n === 0) text = st.placeholder;
    else if (n === st.items.length) text = "All";
    else if (n <= 2) text = msLabel(id);
    else text = `${n} selected`;
    root.querySelector(".ms-text").textContent = text;
}

function msKey(id) { return msValues(id).join("|"); }

function msOpen(id) {
    const st = MS[id];
    if (!st) return;
    st.snapshot = msKey(id);
    $(id).querySelector(".ms-panel").classList.add("open");
}

function msClose(id, apply) {
    const st = MS[id];
    if (!st) return;
    const panel = $(id).querySelector(".ms-panel");
    if (!panel.classList.contains("open")) return;

    panel.classList.remove("open");

    if (apply && msKey(id) !== st.snapshot) {
        st.snapshot = msKey(id);
        if (st.onApply) st.onApply();
    }
}

function msCloseAll(exceptId) {
    Object.keys(MS).forEach(id => { if (id !== exceptId) msClose(id, true); });
}

function msDestroy(id) {
    if (MS[id]) {
        $(id).innerHTML = "";
        delete MS[id];
    }
}

/* selected values, in the same order as the options */
function msValues(id) {
    const st = MS[id];
    if (!st) return [];
    return st.items.filter(i => st.selected.has(String(i.value))).map(i => String(i.value));
}

function msIsAll(id) {
    const st = MS[id];
    return !!st && st.items.length > 0 && st.selected.size === st.items.length;
}

/* "all" when everything is ticked, otherwise "1,3,5" */
function msParam(id) {
    return msIsAll(id) ? "all" : msValues(id).join(",");
}

/* "All" or "Enquiry, Lead" for the report header */
function msLabel(id) {
    const st = MS[id];
    if (!st) return "-";
    if (msIsAll(id)) return "All";
    return st.items.filter(i => st.selected.has(String(i.value))).map(i => i.text).join(", ") || "-";
}

/* click anywhere outside = close open dropdowns and apply */
document.addEventListener("click", function () { msCloseAll(null); });

/* ---------------- Main report init (dropdown wiring) ---------------- */
document.addEventListener("DOMContentLoaded", function () {

    loadReportTypes();

    $("reportType").addEventListener("change", function () {

        const val = this.value;

        $("summaryByWrap").style.display = "none";
        $("filterValueWrap").style.display = "none";
        $("summaryBy").innerHTML = "";
        msDestroy("filterValue");
        hideQuarterControls();
        hideAllReports();

        if (val === "detail") {
            loadReportData("all", "", "Detail", "-", "-");

        } else if (val === "summary") {
            loadSummaryByOptions();
            $("summaryByWrap").style.display = "block";

        } else if (val === "quarterly") {
            loadFyOptions();
            $("fyWrap").style.display = "block";
        }
    });

    /* ----- Summary flow ----- */
    $("summaryBy").addEventListener("change", function () {

        const summaryType = this.value; // stage | zone | segment | salesperson

        $("filterValueWrap").style.display = "none";
        msDestroy("filterValue");
        hideAllReports();

        if (!summaryType) return;

        $("filterValueLabel").textContent =
            summaryType === "stage"   ? "Select Current Stage" :
            summaryType === "zone"    ? "Select Zone" :
            summaryType === "segment" ? "Select Segment" :
                                        "Select Sales Person";

        loadFilterValues(summaryType);
        $("filterValueWrap").style.display = "block";
    });
});

/* =============================
   DROPDOWN 1: REPORT TYPE (static, single select)
============================= */
function loadReportTypes() {

    const ddl = $("reportType");
    ddl.innerHTML = `<option value="">Select report type</option>`;

    [
        { value: "detail",    text: "Detail" },
        { value: "summary",   text: "Summary" },
        { value: "quarterly", text: "Quarterly" }
    ].forEach(o => {
        const opt = document.createElement("option");
        opt.value = o.value;
        opt.textContent = o.text;
        ddl.appendChild(opt);
    });
}

/* =============================
   DROPDOWN 2: SUMMARY BY (static, single select)
============================= */
function loadSummaryByOptions() {

    const ddl = $("summaryBy");
    ddl.innerHTML = `<option value="">Select summary type</option>`;

    [
        { value: "stage",       text: "Current Stage Wise Summary" },
        { value: "zone",        text: "Zone Wise Summary" },
        { value: "segment",     text: "Segment Wise Summary" },
        { value: "salesperson", text: "Sales Person Wise Summary" }
    ].forEach(o => {
        const opt = document.createElement("option");
        opt.value = o.value;
        opt.textContent = o.text;
        ddl.appendChild(opt);
    });
}

/* =============================
   DROPDOWN 3: FILTER VALUE - multi-select checkboxes (from API)
============================= */
function loadFilterValues(summaryType) {

    const endpoint =
        summaryType === "stage"   ? "/api/sale/crm/report/stages" :
        summaryType === "zone"    ? "/api/sale/crm/report/zones" :
        summaryType === "segment" ? "/api/sale/crm/report/segments" :
                                    "/api/sale/crm/report/sales-persons";

    const summaryLabel =
        summaryType === "stage"   ? "Current Stage Wise Summary" :
        summaryType === "zone"    ? "Zone Wise Summary" :
        summaryType === "segment" ? "Segment Wise Summary" :
                                    "Sales Person Wise Summary";

    msInit("filterValue", "Select value", function () {

        if (!msValues("filterValue").length) {
            $("container1").style.display = "none";
            return;
        }

        loadReportData(summaryType, msParam("filterValue"), "Summary",
                       summaryLabel, msLabel("filterValue"));
    });

    fetch(new URL(endpoint, baseUrl1), { method: "GET", credentials: "include" })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        msSetItems("filterValue",
            (data || []).map(row => ({ value: row.id, text: row.name })));
    })
    .catch(err => {
        console.error("Filter value error:", err);
        alert("Unable to load list. Please try again.");
    });
}

/* =============================
   QUARTERLY DROPDOWNS (all multi-select)
   FY -> Quarter -> Stage -> report
============================= */
function loadFyOptions() {

    msInit("fy", "Select financial year", function () {

        $("quarterWrap").style.display = "none";
        $("stageWrap").style.display = "none";
        msDestroy("quarter");
        msDestroy("stage");
        $("container2").style.display = "none";

        if (!msValues("fy").length) return;

        loadQuarterOptions();
        $("quarterWrap").style.display = "block";
    });

    msSetItems("fy", FY_OPTIONS.map(y => ({ value: String(y), text: `${y}-${y + 1}` })));
}

function loadQuarterOptions() {

    msInit("quarter", "Select quarter", function () {

        $("stageWrap").style.display = "none";
        msDestroy("stage");
        $("container2").style.display = "none";

        if (!msValues("quarter").length) return;

        loadStageOptions();
        $("stageWrap").style.display = "block";
    });

    msSetItems("quarter", QUARTER_OPTIONS);
}

function loadStageOptions() {

    msInit("stage", "Select stage", function () {

        if (!msValues("stage").length) {
            $("container2").style.display = "none";
            return;
        }

        loadQuarterlyData();
    });

    fetch(new URL("/api/sale/crm/report/stages", baseUrl1), { method: "GET", credentials: "include" })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        msSetItems("stage",
            (data || []).map(row => ({ value: row.id, text: row.name })));
    })
    .catch(err => {
        console.error("Stage list error:", err);
        alert("Unable to load stages. Please try again.");
    });
}

/* =============================
   REPORT DATA (Detail / Summary)
============================= */
function loadReportData(type, value, reportTypeLabel, summaryByLabel, filterValueLabel) {

    const url = new URL("/api/sale/crm/report/data", baseUrl1);
    url.searchParams.set("type", type);
    if (value) url.searchParams.set("value", value);

    fetch(url, { method: "GET", credentials: "include" })
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
        $("container1").style.display = "none";
    });
}

/* =============================
   BIND ROWS INTO TABLE (Detail / Summary)
============================= */
function bindTable(rows, reportTypeLabel, summaryByLabel, filterValueLabel) {

    $("container2").style.display = "none";

    $("hdrReportType").textContent = reportTypeLabel;
    $("hdrSummaryBy").textContent = summaryByLabel;
    $("hdrFilterValue").textContent = filterValueLabel;

    lastReportRows = rows || [];
    lastReportMeta = {
        reportType: reportTypeLabel,
        summaryBy: summaryByLabel,
        filterValue: filterValueLabel
    };

    isPaged = reportTypeLabel === "Detail";
    currentPage = 1;

    const totalTonnage = lastReportRows.reduce((s, r) => s + (Number(r.tonnage) || 0), 0);
    const totalValue = lastReportRows.reduce((s, r) => s + (Number(r.probable_value) || 0), 0);

    $("ftrCount").textContent = lastReportRows.length;
    $("ftrTonnage").textContent = fmtNum(totalTonnage);
    $("ftrValue").textContent = fmtNum(totalValue);

    renderPage(1);
    $("container1").style.display = "block";
}

/* =============================
   RENDER ONE PAGE OF ROWS
============================= */
function renderPage(page) {

    const tbody = $("reportBody");
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
            const cls = col.numeric ? ' class="num"' : "";
            const style = col.align === "left" ? ' style="text-align:left;white-space:normal;"' : "";
            return `<td${cls}${style}>${esc(display)}</td>`;
        }).join("");

        tbody.insertAdjacentHTML("beforeend", `<tr><td>${slNo}</td>${cells}</tr>`);
    });

    renderPagination(totalPages);
}

/* =============================
   PAGINATION CONTROLS
============================= */
function renderPagination(totalPages) {

    const wrap = $("paginationWrap");
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

/* =============================
   EXPORT TO EXCEL - Detail / Summary
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
        "Total", "", "", "", "", "", "", "", "",
        lastReportRows.reduce((s, r) => s + (Number(r.tonnage) || 0), 0),
        lastReportRows.reduce((s, r) => s + (Number(r.probable_value) || 0), 0),
        "", "", "", ""
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([...infoRows, header, ...body, totalsRow]);
    worksheet["!cols"] = header.map(() => ({ wch: 16 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sale CRM Report");

    XLSX.writeFile(workbook, `SaleCRMReport_${Date.now()}.xlsx`);
}

/* =============================
   EXPORT TO PDF - Detail / Summary
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
            return String(col.numeric ? fmtNum(raw) : (raw || "-"));
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

/* =====================================================================
   QUARTERLY REPORT
   Fixed columns: Sr No | Project | Segment | Zone
   Then one group per quarter, each with two sub-columns: MT | in Cr
===================================================================== */

function fyShort(fyStart) {
    const a = String(fyStart).slice(-2);
    const b = String(fyStart + 1).slice(-2);
    return `FY ${a}-${b}`;
}

function groupLabel(fyStart, q) {
    return `${fyShort(fyStart)} : Q${q}`;
}

/* Quarter groups for the selected years x quarters, in chronological order */
function buildGroups(years, quarters) {

    const groups = [];
    years.forEach(fy => quarters.forEach(q => {
        groups.push({ fy: fy, q: q, label: groupLabel(fy, q) });
    }));
    return groups;
}

function loadQuarterlyData() {

    const fyParam = msParam("fy");          // "all" or "2026,2027"
    const quarterParam = msParam("quarter");
    const stageParam = msParam("stage");

    const years = msValues("fy").map(Number);
    const quarters = msValues("quarter").map(Number);

    const url = new URL("/api/sale/crm/report/quarterly", baseUrl1);
    url.searchParams.set("fy", fyParam);
    url.searchParams.set("quarter", quarterParam);
    url.searchParams.set("stage", stageParam);

    fetch(url, { method: "GET", credentials: "include" })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        const rows = Array.isArray(data) ? data : (data.Data || []);

        qMeta = {
            fy: msLabel("fy"),
            quarter: msLabel("quarter"),
            stage: msLabel("stage")
        };

        bindQuarterTable(rows, years, quarters);
    })
    .catch(err => {
        console.error("Quarterly report load error:", err);
        alert("Failed to load quarterly report. Please try again.");
        $("container2").style.display = "none";
    });
}

function bindQuarterTable(rows, years, quarters) {

    qRows = (rows || []).slice().sort((a, b) =>
        String(a.segment_name || "").toLowerCase().localeCompare(String(b.segment_name || "").toLowerCase()) ||
        String(a.project_name || "").toLowerCase().localeCompare(String(b.project_name || "").toLowerCase())
    );

    qGroups = buildGroups(years, quarters);

    // with several years, show only the quarters that actually have data
    if (years.length > 1) {
        qGroups = qGroups.filter(g =>
            qRows.some(r => Number(r.fy_start) === g.fy && Number(r.quarter_no) === g.q));
    }

    $("qHdrFy").textContent = qMeta.fy;
    $("qHdrQuarter").textContent = qMeta.quarter;
    $("qHdrStage").textContent = qMeta.stage;

    renderQuarterTable();
    $("container1").style.display = "none";
    $("container2").style.display = "block";
}

function renderQuarterTable() {

    const thead = $("qHead");
    const tbody = $("qBody");
    const tfoot = $("qFoot");

    let h1 = `<tr>
        <th rowspan="2">Sr No</th>
        <th rowspan="2" class="left">Project</th>
        <th rowspan="2">Segment</th>
        <th rowspan="2">Zone</th>`;
    let h2 = `<tr>`;

    qGroups.forEach(g => {
        h1 += `<th colspan="2" class="qgroup">${esc(g.label)}</th>`;
        h2 += `<th class="num">MT</th><th class="num">in Cr</th>`;
    });
    h1 += `</tr>`;
    h2 += `</tr>`;
    thead.innerHTML = h1 + h2;

    const fixedCols = 4;
    const totalCols = fixedCols + qGroups.length * 2;

    if (!qRows.length) {
        tbody.innerHTML = `<tr><td colspan="${totalCols}">No records found for the selected filters.</td></tr>`;
        tfoot.innerHTML = "";
        return;
    }

    const totals = qGroups.map(() => ({ mt: 0, cr: 0 }));
    let html = "";

    qRows.forEach((row, i) => {

        let cells = "";
        qGroups.forEach((g, gi) => {
            const belongs = Number(row.fy_start) === g.fy && Number(row.quarter_no) === g.q;
            if (belongs) {
                const mt = Number(row.tonnage) || 0;
                const cr = Number(row.probable_value) || 0;
                totals[gi].mt += mt;
                totals[gi].cr += cr;
                cells += `<td class="num">${fmtWhole(mt)}</td><td class="num">${fmtWhole(cr)}</td>`;
            } else {
                cells += `<td class="num"></td><td class="num"></td>`;
            }
        });

        html += `<tr>
            <td>${i + 1}</td>
            <td class="left">${esc(row.project_name || "-")}</td>
            <td>${esc(row.segment_name || "-")}</td>
            <td>${esc(row.zone_name || "-")}</td>
            ${cells}
        </tr>`;
    });
    tbody.innerHTML = html;

    let f = `<tr><td colspan="${fixedCols}" style="text-align:right;">Total (${qRows.length} records)</td>`;
    totals.forEach(t => {
        f += `<td class="num">${fmtWhole(t.mt)}</td><td class="num">${fmtWhole(t.cr)}</td>`;
    });
    f += `</tr>`;
    tfoot.innerHTML = f;
}

/* =============================
   EXPORT TO EXCEL - Quarterly
============================= */
function exportQuarterToExcel() {

    if (!qRows.length) {
        alert("There is no data to export.");
        return;
    }

    const fixed = ["Sr No", "Project", "Segment", "Zone"];

    const row1 = [...fixed];
    const row2 = ["", "", "", ""];
    const merges = [];

    for (let c = 0; c < fixed.length; c++) {
        merges.push({ s: { r: 4, c: c }, e: { r: 5, c: c } });
    }

    qGroups.forEach((g, gi) => {
        const c = fixed.length + gi * 2;
        row1.push(g.label, "");
        row2.push("MT", "in Cr");
        merges.push({ s: { r: 4, c: c }, e: { r: 4, c: c + 1 } });
    });

    const totals = qGroups.map(() => ({ mt: 0, cr: 0 }));

    const body = qRows.map((row, i) => {
        const line = [i + 1, row.project_name || "-", row.segment_name || "-", row.zone_name || "-"];
        qGroups.forEach((g, gi) => {
            if (Number(row.fy_start) === g.fy && Number(row.quarter_no) === g.q) {
                const mt = Number(row.tonnage) || 0;
                const cr = Number(row.probable_value) || 0;
                totals[gi].mt += mt;
                totals[gi].cr += cr;
                line.push(Math.round(mt), Math.round(cr));
            } else {
                line.push("", "");
            }
        });
        return line;
    });

    const totalsRow = ["Total", "", "", ""];
    totals.forEach(t => totalsRow.push(Math.round(t.mt), Math.round(t.cr)));

    const infoRows = [
        [`Financial Year: ${qMeta.fy}`],
        [`Quarter: ${qMeta.quarter}`],
        [`Stage: ${qMeta.stage}`],
        []
    ];

    const sheetData = [...infoRows, row1, row2, ...body, totalsRow];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    worksheet["!merges"] = merges;
    worksheet["!cols"] = [
        { wch: 8 }, { wch: 45 }, { wch: 16 }, { wch: 12 },
        ...qGroups.flatMap(() => [{ wch: 10 }, { wch: 10 }])
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quarterly Report");

    XLSX.writeFile(workbook, `SaleCRMQuarterly_${Date.now()}.xlsx`);
}

/* =============================
   EXPORT TO PDF - Quarterly
============================= */
function exportQuarterToPDF() {

    if (!qRows.length) {
        alert("There is no data to export.");
        return;
    }

    const hdr = (text, extra) => Object.assign({ text, style: "tableHeader", alignment: "center" }, extra || {});

    const headRow1 = [
        hdr("Sr No", { rowSpan: 2 }),
        hdr("Project", { rowSpan: 2 }),
        hdr("Segment", { rowSpan: 2 }),
        hdr("Zone", { rowSpan: 2 })
    ];
    const headRow2 = [{}, {}, {}, {}];

    qGroups.forEach(g => {
        headRow1.push(hdr(g.label, { colSpan: 2 }), {});
        headRow2.push(hdr("MT"), hdr("in Cr"));
    });

    const totals = qGroups.map(() => ({ mt: 0, cr: 0 }));

    const body = qRows.map((row, i) => {
        const line = [
            { text: String(i + 1), alignment: "center" },
            { text: String(row.project_name || "-") },
            { text: String(row.segment_name || "-") },
            { text: String(row.zone_name || "-") }
        ];
        qGroups.forEach((g, gi) => {
            if (Number(row.fy_start) === g.fy && Number(row.quarter_no) === g.q) {
                const mt = Number(row.tonnage) || 0;
                const cr = Number(row.probable_value) || 0;
                totals[gi].mt += mt;
                totals[gi].cr += cr;
                line.push({ text: fmtWhole(mt), alignment: "right" }, { text: fmtWhole(cr), alignment: "right" });
            } else {
                line.push({ text: "" }, { text: "" });
            }
        });
        return line;
    });

    const totalRow = [
        { text: "Total", bold: true, colSpan: 4, alignment: "right" }, {}, {}, {}
    ];
    totals.forEach(t => {
        totalRow.push(
            { text: fmtWhole(t.mt), bold: true, alignment: "right" },
            { text: fmtWhole(t.cr), bold: true, alignment: "right" }
        );
    });

    const docDefinition = {
        pageOrientation: "landscape",
        pageSize: "A4",
        pageMargins: [20, 40, 20, 30],
        content: [
            { text: "Sale CRM Quarterly Report", style: "title" },
            {
                columns: [
                    { text: `Financial Year: ${qMeta.fy}`, style: "meta" },
                    { text: `Quarter: ${qMeta.quarter}`, style: "meta" },
                    { text: `Stage: ${qMeta.stage}`, style: "meta" }
                ],
                margin: [0, 0, 0, 8]
            },
            {
                table: {
                    headerRows: 2,
                    widths: ["auto", "*", "auto", "auto", ...Array(qGroups.length * 2).fill("auto")],
                    body: [headRow1, headRow2, ...body, totalRow]
                },
                layout: {
                    fillColor: (rowIndex) => (rowIndex <= 1 ? "#134e4a" : null),
                    hLineColor: () => "#a8d8d3",
                    vLineColor: () => "#a8d8d3"
                }
            }
        ],
        styles: {
            title: { fontSize: 14, bold: true, alignment: "center", margin: [0, 0, 0, 8], color: "#0f766e" },
            meta: { fontSize: 8 },
            tableHeader: { bold: true, fontSize: 7, color: "#ffffff" }
        },
        defaultStyle: { fontSize: 7 }
    };

    pdfMake.createPdf(docDefinition).download(`SaleCRMQuarterly_${Date.now()}.pdf`);
}