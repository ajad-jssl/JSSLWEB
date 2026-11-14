// ==============================
// EMPLOYEE SKILL REPORT - FRONTEND (Sale CRM Report style)
// Endpoints:
//   GET /api/websmartuser/getAllUniqueDesignation
//   GET /api/empperf/report/employees?desgCode=
//   GET /api/empperf/report/summary-matrix?desgCode=&empCode=
//   GET /api/empperf/report/details?desgCode=&empCode=
// Assumes baseUrl1 is already defined (js/config.js).
//
// Each tab has its own Designation + Employee filter and Fetch button.
// Results show in a report card (hidden until Fetch), 10 rows per page,
// with Excel / PDF export of the FULL result set.
// ==============================

const LEVEL_LABELS = { 4: 'Expert', 3: 'Proficient', 2: 'Demonstrating', 1: 'Basic', 0: 'None' };

const CHANGE_TYPE_COLORS = {
    Initial: '#9aa1b1',
    Manual: '#f2994a',
    Training: '#1e8e5a'
};

const PAGE_SIZE = 10;

/* Full result sets are kept here so exports are independent of paging */
let summaryData = { skills: [], employees: [] };
let summaryPage = 1;
let summaryMeta = { designation: '-', employee: '-' };

let detailsData = [];
let detailsPage = 1;
let detailsMeta = { designation: '-', employee: '-' };


/* ---------------- helpers ---------------- */
function esc(s) {
    return String(s === null || s === undefined ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function levelText(symbol) {
    if (symbol === null || symbol === undefined) return 'Not rated';
    return `${LEVEL_LABELS[symbol]} (${symbol})`;
}

function levelBadge(symbol) {
    if (symbol === null || symbol === undefined) {
        return '<span class="level-badge level-none">Not rated</span>';
    }
    return `<span class="level-badge level-${symbol}">${LEVEL_LABELS[symbol]} (${symbol})</span>`;
}

function changeTypeBadge(changeType) {
    const color = CHANGE_TYPE_COLORS[changeType] || '#9aa1b1';
    return `<span class="change-badge" style="background-color:${color};">${esc(changeType)}</span>`;
}

function fmtDate(d) {
    return d ? new Date(d).toLocaleString() : '-';
}

function selectedText(selectId) {
    const el = document.getElementById(selectId);
    if (!el || !el.value) return null;
    return el.options[el.selectedIndex].text;
}


$(document).ready(function () {

    loadDesignationsInto('#summaryDesgSelect');
    loadDesignationsInto('#detailsDesgSelect');

    // SUMMARY TAB: Designation change -> refresh Employee list only
    $('#summaryDesgSelect').on('change', function () {
        const desgCode = $(this).val();
        $('#summaryDesgError').hide();
        $('#summaryNoticeMessage').hide();
        $('#summaryEmpSelect').html('<option value="" selected>All Employees</option>').prop('disabled', true);
        $('#summaryReport').hide();
        if (desgCode) loadReportEmployees(desgCode, '#summaryEmpSelect', '#summaryNoticeMessage');
    });

    // DETAILS TAB: Designation change -> refresh Employee list only
    $('#detailsDesgSelect').on('change', function () {
        const desgCode = $(this).val();
        $('#detailsDesgError').hide();
        $('#detailsNoticeMessage').hide();
        $('#detailsEmpSelect').html('<option value="" selected>All Employees</option>').prop('disabled', true);
        $('#detailsReport').hide();
        if (desgCode) loadReportEmployees(desgCode, '#detailsEmpSelect', '#detailsNoticeMessage');
    });
});


// ==============================
// DESIGNATION DROPDOWN (both tabs)
// ==============================
async function loadDesignationsInto(selectId) {
    try {
        const apiUrl = new URL('api/websmartuser/getAllUniqueDesignation', baseUrl1);
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch Designations");

        const designations = await response.json();
        let options = '<option value="" selected disabled>Select Designation</option>';
        designations.forEach(function (d) {
            options += `<option value="${esc(d.desgcode)}">${esc(d.designation)}</option>`;
        });
        $(selectId).html(options);

    } catch (error) {
        console.error('Error loading Designations:', error);
        $(selectId).html('<option value="" selected disabled>Unable to load Designations</option>');
    }
}


// ==============================
// EMPLOYEE FILTER (both tabs)
// ==============================
async function loadReportEmployees(desgCode, empSelectId, noticeId) {
    if (!desgCode) return;

    try {
        const apiUrl = new URL('/api/empperf/report/employees?desgCode=' + encodeURIComponent(desgCode), baseUrl1);
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch Employees");

        const employees = await response.json();
        let options = '<option value="" selected>All Employees</option>';

        if (employees.length === 0) {
            $(noticeId).text('No employees have been rated under this designation yet.').show();
        }

        employees.forEach(function (e) {
            options += `<option value="${esc(e.empCode)}">${esc(e.name)} (${esc(e.empCode)})</option>`;
        });

        $(empSelectId).html(options).prop('disabled', false);

    } catch (error) {
        console.error('Error loading report employees:', error);
    }
}


function validateDesg(desgSelectId, errorId) {
    const valid = !!$(desgSelectId).val();
    $(errorId)[valid ? 'hide' : 'show']();
    return valid;
}


// ==============================
// FETCH - SUMMARY TAB
// ==============================
async function fetchSummary() {

    if (!validateDesg('#summaryDesgSelect', '#summaryDesgError')) return;

    const desgCode = $('#summaryDesgSelect').val();
    const empCode  = $('#summaryEmpSelect').val();

    summaryMeta = {
        designation: selectedText('summaryDesgSelect') || '-',
        employee: selectedText('summaryEmpSelect') || 'All Employees'
    };

    const btn = document.getElementById('summaryFetchBtn');
    btn.disabled = true;
    btn.innerHTML = 'Fetching...';

    try {
        await loadSummary(desgCode, empCode);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-search"></i> Fetch';
    }
}


// ==============================
// FETCH - DETAILS TAB
// ==============================
async function fetchDetails() {

    if (!validateDesg('#detailsDesgSelect', '#detailsDesgError')) return;

    const desgCode = $('#detailsDesgSelect').val();
    const empCode  = $('#detailsEmpSelect').val();

    detailsMeta = {
        designation: selectedText('detailsDesgSelect') || '-',
        employee: selectedText('detailsEmpSelect') || 'All Employees'
    };

    const btn = document.getElementById('detailsFetchBtn');
    btn.disabled = true;
    btn.innerHTML = 'Fetching...';

    try {
        await loadDetails(desgCode, empCode);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-search"></i> Fetch';
    }
}


// ==============================
// SUMMARY - matrix: one row per employee, one column per skill
// ==============================
async function loadSummary(desgCode, empCode) {

    try {
        let url = '/api/empperf/report/summary-matrix?desgCode=' + encodeURIComponent(desgCode);
        if (empCode) url += '&empCode=' + encodeURIComponent(empCode);

        const response = await fetch(new URL(url, baseUrl1), { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch Summary");

        const data = await response.json();
        summaryData = {
            skills: data.skills || [],
            employees: data.employees || []
        };

        $('#hdrSummaryDesg').text(summaryMeta.designation);
        $('#hdrSummaryEmp').text(summaryMeta.employee);
        $('#hdrSummaryCount').text(summaryData.employees.length);

        // header is rebuilt because the skill columns change per designation
        let headerHtml = '<tr><th>Sl.No.</th><th>Employee</th><th>Designation</th>';
        summaryData.skills.forEach(function (s) {
            headerHtml += `<th>${esc(s.skillName)}</th>`;
        });
        headerHtml += '</tr>';
        $('#tableSummaryHead').html(headerHtml);

        renderSummaryPage(1);
        $('#summaryReport').show();

    } catch (error) {
        console.error('Error loading Summary:', error);
        alert('Failed to load summary. Please try again.');
        $('#summaryReport').hide();
    }
}

function renderSummaryPage(page) {

    const skills = summaryData.skills;
    const emps = summaryData.employees;
    const totalPages = Math.max(1, Math.ceil(emps.length / PAGE_SIZE));

    summaryPage = Math.min(Math.max(1, page), totalPages);
    const start = (summaryPage - 1) * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, emps.length);

    let bodyHtml = '';

    if (emps.length === 0) {
        bodyHtml = `<tr><td colspan="${3 + skills.length}" class="text-muted">No records found</td></tr>`;
    }

    emps.slice(start, end).forEach(function (emp, idx) {
        bodyHtml += `<tr>
            <td>${start + idx + 1}</td>
            <td>${esc(emp.name)} (${esc(emp.empCode)})</td>
            <td>${esc(emp.designation || '-')}</td>`;

        skills.forEach(function (s) {
            const symbol = emp.ratings ? emp.ratings[String(s.skillId)] : null;
            bodyHtml += `<td>${levelBadge(symbol)}</td>`;
        });

        bodyHtml += '</tr>';
    });

    $('#tableSummary tbody').html(bodyHtml);
    renderPager('summaryPagination', totalPages, summaryPage, renderSummaryPage);
}


// ==============================
// DETAILS - full history with change type
// ==============================
async function loadDetails(desgCode, empCode) {

    try {
        let url = '/api/empperf/report/details?desgCode=' + encodeURIComponent(desgCode);
        if (empCode) url += '&empCode=' + encodeURIComponent(empCode);

        const response = await fetch(new URL(url, baseUrl1), { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch Details");

        detailsData = await response.json() || [];

        // newest first (same as the old DataTables order on Changed Date)
        detailsData.sort(function (a, b) {
            return new Date(b.changedDate || 0) - new Date(a.changedDate || 0);
        });

        $('#hdrDetailsDesg').text(detailsMeta.designation);
        $('#hdrDetailsEmp').text(detailsMeta.employee);
        $('#hdrDetailsCount').text(detailsData.length);

        renderDetailsPage(1);
        $('#detailsReport').show();

    } catch (error) {
        console.error('Error loading Details:', error);
        alert('Failed to load details. Please try again.');
        $('#detailsReport').hide();
    }
}

function renderDetailsPage(page) {

    const rows = detailsData;
    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

    detailsPage = Math.min(Math.max(1, page), totalPages);
    const start = (detailsPage - 1) * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, rows.length);

    let html = '';

    if (rows.length === 0) {
        html = '<tr><td colspan="9" class="text-muted">No records found</td></tr>';
    }

    rows.slice(start, end).forEach(function (r, idx) {

        const trainingInfo = (r.changeType === 'Training')
            ? `${esc(r.trainingTitle || '-')}<br><small class="text-muted">${esc(r.trainerName || '')}</small>`
            : '-';

        html += `<tr>
            <td>${start + idx + 1}</td>
            <td>${esc(r.name)} (${esc(r.empCode)})</td>
            <td>${esc(r.skillName)}</td>
            <td>${levelBadge(r.oldSymbol)}</td>
            <td>${levelBadge(r.newSymbol)}</td>
            <td>${changeTypeBadge(r.changeType)}</td>
            <td>${trainingInfo}</td>
            <td>${esc(r.user_name || '-')}</td>
            <td>${fmtDate(r.changedDate)}</td>
        </tr>`;
    });

    $('#tableDetails tbody').html(html);
    renderPager('detailsPagination', totalPages, detailsPage, renderDetailsPage);
}


// ==============================
// PAGINATION CONTROLS (shared)
// ==============================
function renderPager(wrapId, totalPages, current, goTo) {

    const wrap = document.getElementById(wrapId);
    wrap.innerHTML = '';

    if (totalPages <= 1) {
        wrap.style.display = 'none';
        return;
    }
    wrap.style.display = 'flex';

    const makeBtn = (label, target, disabled, active) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'page-btn' + (active ? ' active' : '');
        btn.textContent = label;
        btn.disabled = disabled;
        btn.addEventListener('click', () => goTo(target));
        return btn;
    };

    wrap.appendChild(makeBtn('\u00AB Prev', current - 1, current === 1, false));

    const maxButtons = 7;
    let startPage = Math.max(1, current - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    startPage = Math.max(1, endPage - maxButtons + 1);

    for (let p = startPage; p <= endPage; p++) {
        wrap.appendChild(makeBtn(String(p), p, false, p === current));
    }

    wrap.appendChild(makeBtn('Next \u00BB', current + 1, current === totalPages, false));

    const info = document.createElement('span');
    info.className = 'page-info';
    info.textContent = `Page ${current} of ${totalPages}`;
    wrap.appendChild(info);
}


// ==============================
// EXPORT - SUMMARY (full result set)
// ==============================
function summaryExportTable() {
    const header = ['Sl.No.', 'Employee', 'Designation', ...summaryData.skills.map(s => s.skillName)];
    const body = summaryData.employees.map(function (emp, i) {
        return [
            i + 1,
            `${emp.name} (${emp.empCode})`,
            emp.designation || '-',
            ...summaryData.skills.map(s => levelText(emp.ratings ? emp.ratings[String(s.skillId)] : null))
        ];
    });
    return { header, body };
}

function exportSummaryExcel() {
    if (!summaryData.employees.length) { alert('There is no data to export.'); return; }

    const { header, body } = summaryExportTable();
    const sheetData = [
        ['Report Type: Skill Matrix Summary'],
        [`Designation: ${summaryMeta.designation}`],
        [`Employee: ${summaryMeta.employee}`],
        [],
        header, ...body
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws['!cols'] = header.map((h, i) => ({ wch: i === 1 ? 28 : 16 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Skill Summary');
    XLSX.writeFile(wb, `SkillSummaryReport_${Date.now()}.xlsx`);
}

function exportSummaryPDF() {
    if (!summaryData.employees.length) { alert('There is no data to export.'); return; }

    const { header, body } = summaryExportTable();
    buildPdf('Employee Skill Summary', summaryMeta, header, body, `SkillSummaryReport_${Date.now()}.pdf`);
}


// ==============================
// EXPORT - DETAILS (full result set)
// ==============================
function detailsExportTable() {
    const header = ['Sl.No.', 'Employee', 'Skill', 'Old Rating', 'New Rating', 'Change Type',
                    'Training', 'Trainer', 'Changed By', 'Changed Date'];
    const body = detailsData.map(function (r, i) {
        return [
            i + 1,
            `${r.name} (${r.empCode})`,
            r.skillName || '-',
            levelText(r.oldSymbol),
            levelText(r.newSymbol),
            r.changeType || '-',
            r.changeType === 'Training' ? (r.trainingTitle || '-') : '-',
            r.changeType === 'Training' ? (r.trainerName || '-') : '-',
            r.user_name || '-',
            fmtDate(r.changedDate)
        ];
    });
    return { header, body };
}

function exportDetailsExcel() {
    if (!detailsData.length) { alert('There is no data to export.'); return; }

    const { header, body } = detailsExportTable();
    const sheetData = [
        ['Report Type: Skill Change History'],
        [`Designation: ${detailsMeta.designation}`],
        [`Employee: ${detailsMeta.employee}`],
        [],
        header, ...body
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws['!cols'] = header.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Skill Details');
    XLSX.writeFile(wb, `SkillDetailsReport_${Date.now()}.xlsx`);
}

function exportDetailsPDF() {
    if (!detailsData.length) { alert('There is no data to export.'); return; }

    const { header, body } = detailsExportTable();
    buildPdf('Employee Skill Details', detailsMeta, header, body, `SkillDetailsReport_${Date.now()}.pdf`);
}


// ==============================
// SHARED PDF BUILDER (pdfmake)
// ==============================
function buildPdf(title, meta, header, body, fileName) {

    const docDefinition = {
        pageOrientation: 'landscape',
        pageSize: 'A4',
        pageMargins: [20, 40, 20, 30],
        content: [
            { text: title, style: 'title' },
            {
                columns: [
                    { text: `Designation: ${meta.designation}`, style: 'meta' },
                    { text: `Employee: ${meta.employee}`, style: 'meta' },
                    { text: `Total Records: ${body.length}`, style: 'meta' }
                ],
                margin: [0, 0, 0, 8]
            },
            {
                table: {
                    headerRows: 1,
                    widths: Array(header.length).fill('auto'),
                    body: [
                        header.map(text => ({ text: String(text), style: 'tableHeader' })),
                        ...body.map(row => row.map(c => String(c)))
                    ]
                },
                layout: {
                    fillColor: (rowIndex) => (rowIndex === 0 ? '#134e4a' : null),
                    hLineColor: () => '#a8d8d3',
                    vLineColor: () => '#a8d8d3'
                }
            }
        ],
        styles: {
            title: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 8], color: '#0f766e' },
            meta: { fontSize: 8 },
            tableHeader: { bold: true, fontSize: 7, color: '#ffffff' }
        },
        defaultStyle: { fontSize: 7 }
    };

    pdfMake.createPdf(docDefinition).download(fileName);
}