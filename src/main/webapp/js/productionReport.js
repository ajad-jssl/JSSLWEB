



let currentPage = 1;
const rowsPerPage = 10;

let bellaryData = [];
let gujaratData = [];
let selectedFactory = '';

// Separate pagination for each factory when "All" is selected
let bellaryPage = 1;
let gujaratPage = 1;


function fmt(val) {
  if (val === null || val === undefined || val === '') return '';

  const n = parseFloat(val);

  if (isNaN(n)) return '0.00';

  return n.toFixed(2);
}

function fmtTotal(val) {
  const n = parseFloat(val);

  if (isNaN(n)) return '0.00';

  return n.toFixed(2);
}


const currentPage1 = window.location.pathname.split("/").pop() + '.jsp';
const UserId = sessionStorage.getItem('username');
let allowedActions = [];

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(currentPage1)}`,
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
    if (!allowedActions.includes("view")) {
        blockUI();
        return;
    }
});

// ✅ blockUI — same as VMS
function blockUI() {
  const container = document.getElementById("container-wrapper");
  if (!container) return;

  container.style.pointerEvents = "none";
  container.style.userSelect = "none";
  container.style.opacity = "0.5";
  container.style.position = "relative";

  const overlay = document.createElement("div");
  overlay.id = "contentBlockOverlay";
  overlay.style.cssText = `
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.6); z-index: 999;
    display: flex; justify-content: center;
    align-items: center; color: white;
    font-size: 22px; text-align: center;
  `;
  overlay.innerHTML = `
    <div>
      🚫 Access Denied <br>
      <small>You don't have permission to view this page</small>
    </div>
  `;
  container.appendChild(overlay);
}
/*
   VALIDATION
*/
function validateFilters() {
  const contract = document.getElementById('contractInput').value.trim();
  const factory  = document.getElementById('factorySelect').value;

  const contractErr = document.getElementById('contractError');
  const factoryErr  = document.getElementById('factoryError');

  const factoryValid  = factory !== '';
  const contractValid = contract !== '';

  contractErr.style.display = contractValid ? 'none' : 'block';
  factoryErr.style.display  = factoryValid  ? 'none' : 'block';

  return factoryValid && contractValid;
}

/* 
   FETCH CONTRACTS BASED ON FACTORY
 */
async function fetchcont(factoryId) {
  const contractDropdown = document.getElementById('contractInput');
  contractDropdown.innerHTML = '<option value="">Loading...</option>';

  try {
    let contracts = [];

    if (factoryId === '0') {
      // ALL factories: fetch Bellary (1) and Gujarat (2) in parallel, then merge
      const [res1, res2] = await Promise.all([
        fetch(buildContractUrl('1'), { method: 'GET', credentials: 'include' }),
        fetch(buildContractUrl('2'), { method: 'GET', credentials: 'include' })
      ]);

      const [json1, json2] = await Promise.all([
        res1.ok ? res1.json() : { Data: [] },
        res2.ok ? res2.json() : { Data: [] }
      ]);

      const bellaryContracts = (json1.Data || []).map(c => ({ ...c, _factory: 'Bellary' }));
      const gujaratContracts = (json2.Data || []).map(c => ({ ...c, _factory: 'Gujarat' }));

      // Merge and deduplicate by contract_id; mark contracts present in both factories
      const map = new Map();
      [...bellaryContracts, ...gujaratContracts].forEach(c => {
        if (map.has(c.contract_id)) {
          map.get(c.contract_id)._factory = 'Bellary, Gujarat';
        } else {
          map.set(c.contract_id, { ...c });
        }
      });

      // Sort alphabetically by contract_name
      contracts = [...map.values()].sort((a, b) =>
        (a.contract_name || '').localeCompare(b.contract_name || '')
      );

    } else {
      // Single factory
      const res  = await fetch(buildContractUrl(factoryId), { method: 'GET', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch contracts');
      const json = await res.json();
      contracts  = json.Data || [];
    }

    // Build dropdown
    contractDropdown.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Contract';
    contractDropdown.appendChild(defaultOption);

/*    const allOption = document.createElement('option');
    allOption.value = 'ALL';
    allOption.textContent = 'ALL';
    contractDropdown.appendChild(allOption);*/

    contracts.forEach(item => {
      const option   = document.createElement('option');
	  option.value   = item.jobCode;
      //option.value   = item.contract_id;
      // When "All" factory is selected, show which factory each contract belongs to
      option.textContent = (factoryId === '0' && item._factory)
        ? `${item.contract_name}  [${item._factory}]`
        : item.contract_name;
      contractDropdown.appendChild(option);
    });

  } catch (error) {
    console.error('Error fetching contracts:', error);
    contractDropdown.innerHTML = '<option value="">Select Contract</option>';
  }
}

// Helper: builds the /contracts/byfactory URL for a given factory id
function buildContractUrl(factoryId) {
  const url = new URL('/jssl/contracts/byfactory', baseUrl);
  url.searchParams.append('factory', factoryId);
  return url;
}

/* 
   FACTORY CHANGE LISTENER
 */
document.getElementById('factorySelect').addEventListener('change', function () {
  const factoryId = this.value;
  document.getElementById('contractInput').innerHTML =
    '<option value="">Select Contract</option>';

  // Disable export when factory changes
  setExportBtn(false);

  if (factoryId !== '') fetchcont(factoryId);
});

/* 
   FETCH REPORT
 */
async function fetchReport() {
  if (!validateFilters()) return;

  const contract = document.getElementById('contractInput').value.trim();
  selectedFactory = document.getElementById('factorySelect').value;

  const btn = document.getElementById('fetchBtn');
  btn.disabled = true;
  btn.innerHTML = 'Fetching...';

  // Disable export while fetching
  setExportBtn(false);

  document.getElementById('reportBody').innerHTML =
    '<div class="state-msg">Loading...</div>';

  try {
    const url = new URL('/jssl/consolidated-g2reports', baseUrl);
    url.searchParams.append('jobCode', contract);
    url.searchParams.append('loadtype', '0');
    url.searchParams.append('factory', selectedFactory);

    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error('Status ' + res.status);

    const data = await res.json();

    bellaryData = data.bellary || [];
    gujaratData = data.gujarat || [];

    // Reset all pages
    currentPage  = 1;
    bellaryPage  = 1;
    gujaratPage  = 1;

    renderTablePage();

    // Enable export only if there's data
    const hasData = bellaryData.length > 0 || gujaratData.length > 0;
    setExportBtn(hasData);

  } catch (e) {
    document.getElementById('reportBody').innerHTML =
      '<div class="state-msg error">Error: ' + e.message + '</div>';
    setExportBtn(false);
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Fetch Report';
  }
}

/* 
   HELPERS
 */
const KEYS = [
  'weight', 'jsslwght', 'sublet', 'totalasw',
  'weldwght', 'fsubletwght', 'totalwsw',
  'treatwght', 'tsubletwght', 'totaltwght'
];

function zero() {
  const o = {};
  KEYS.forEach(k => o[k] = 0);
  return o;
}

function add(acc, r) {
  KEYS.forEach(k => {
    acc[k] = Math.round((acc[k] + parseFloat(r[k] || 0)) * 100) / 100;
  });
}

function calcTotal(data) {
  const t = zero();
  data.forEach(r => add(t, r));
  return t;
}

/*
   SHARED TABLE CSS
 */
const TABLE_CSS = `
<style>
  #reportTable, .factory-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    font-family: Arial, sans-serif;
    margin-bottom: 0;
	table-layout: fixed;
  }
  #reportTable thead tr:first-child th,
  .factory-table thead tr:first-child th {
    background: #f8f9fa;
    color: #333;
    font-weight: 700;
    text-align: center;
    border: 1px solid #dee2e6;
    padding: 10px 8px;
  }
  #reportTable thead tr:last-child th,
  .factory-table thead tr:last-child th {
    background: #f8f9fa;
    color: #444;
    font-weight: 600;
    text-align: center;
    border: 1px solid #dee2e6;
    padding: 9px 8px;
    white-space: nowrap;
  }
  #reportTable tbody tr td,
  .factory-table tbody tr td {
    border: 1px solid #dee2e6;
    padding: 8px 10px;
    text-align: center;
    color: #333;
    font-size: 13px;
  }
  #reportTable tbody tr:nth-child(even),
  .factory-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  #reportTable tbody tr:hover,
  .factory-table tbody tr:hover {
    background-color: #eef2ff;
  }
  .row-factory-header td {
    font-weight: bold;
    background: #dce6ff !important;
    color: #1a3a8a;
    text-align: left !important;
    padding: 8px 12px;
    font-size: 13px;
  }
  .row-subtotal td {
      background: #fff8e1 !important;
      font-weight: 600;
      color: #555;
      border-top: 2px solid #f0c040;
      text-align: right !important;
  }

  .row-subtotal td:first-child {
      text-align: left !important;
  }

  .row-grandtotal td {
      background: #e8f5e9 !important;
      font-weight: 700;
      color: #2e7d32;
      border-top: 2px solid #66bb6a;
      text-align: right !important;
  }

  .row-grandtotal td:first-child {
      text-align: left !important;
  }

  .row-overalltotal td {
      background: #e3f2fd !important;
      font-weight: 700;
      color: #0d47a1;
      border-top: 3px solid #1565c0;
      text-align: right !important;
      font-size: 13px;
  }

  .row-overalltotal td:first-child {
      text-align: left !important;
  }
  .factory-section { margin-bottom: 24px; }
  .factory-section-title {
    font-weight: bold;
    font-size: 14px;
    color: #1a3a8a;
    background: #dce6ff;
    padding: 8px 12px;
    border: 1px solid #dee2e6;
    border-bottom: none;
  }
  /* PAGINATION */
  .dt-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 4px;
    font-size: 13px;
    color: #555;
    flex-wrap: wrap;
    gap: 8px;
  }
  .dt-info { color: #666; }
  .dt-pagination { display: flex; gap: 4px; align-items: center; }
  .dt-pagination button {
    min-width: 34px;
    height: 34px;
    border: 1px solid #dee2e6;
    background: #fff;
    color: #333;
    font-size: 13px;
    border-radius: 4px;
    cursor: pointer;
    padding: 0 10px;
    transition: background 0.15s;
  }
  .dt-pagination button:hover:not(:disabled) { background: #e9ecef; }
  .dt-pagination button.active {
    background: #4361ee;
    color: #fff;
    border-color: #4361ee;
    font-weight: 600;
  }
  .dt-pagination button:disabled {
    color: #aaa;
    cursor: default;
    background: #f8f9fa;
  }
  .dt-pagination .ellipsis {
    padding: 0 4px;
    color: #888;
    line-height: 34px;
  }
</style>`;

/* 
   TABLE HEADER HTML
*/
function colGroup() {
  return `
  <colgroup>
    <col style="width:110px">  <!-- Contract -->
    <col style="width:70px">   <!-- Phase -->
    <col style="width:90px">   <!-- Actual Weight -->
    <col style="width:80px">   <!-- Asm JSSL -->
    <col style="width:80px">   <!-- Asm Sublet -->
    <col style="width:80px">   <!-- Asm Total -->
    <col style="width:14px">   <!-- separator -->
    <col style="width:80px">   <!-- Wld JSSL -->
    <col style="width:80px">   <!-- Wld Sublet -->
    <col style="width:80px">   <!-- Wld Total -->
    <col style="width:14px">   <!-- separator -->
    <col style="width:80px">   <!-- Trt JSSL -->
    <col style="width:80px">   <!-- Trt Sublet -->
    <col style="width:80px">   <!-- Trt Total -->
  </colgroup>`;
}

function tableHeader() {
  return `
  <thead>
    <tr style="line-height:0; height:0; visibility:hidden; border:none;">
      <th style="padding:0;border:none;width:110px"></th>
      <th style="padding:0;border:none;width:70px"></th>
      <th style="padding:0;border:none;width:90px"></th>
      <th style="padding:0;border:none;width:80px"></th>
      <th style="padding:0;border:none;width:80px"></th>
      <th style="padding:0;border:none;width:80px"></th>
      <th style="padding:0;border:none;width:14px"></th>
      <th style="padding:0;border:none;width:80px"></th>
      <th style="padding:0;border:none;width:80px"></th>
      <th style="padding:0;border:none;width:80px"></th>
      <th style="padding:0;border:none;width:14px"></th>
      <th style="padding:0;border:none;width:80px"></th>
      <th style="padding:0;border:none;width:80px"></th>
      <th style="padding:0;border:none;width:80px"></th>
    </tr>
    <tr>
      <th colspan="3"></th>
      <th colspan="3">Assembled</th>
      <th></th>
      <th colspan="3">Welded</th>
      <th></th>
      <th colspan="3">Treated</th>
    </tr>
    <tr>
      <th>Contract</th>
      <th>Phase</th>
      <th style="text-align:right">Actual Weight</th>
      <th style="text-align:right">JSSL</th><th style="text-align:right">Sublet</th><th style="text-align:right">Total</th>
      <th></th>
      <th style="text-align:right">JSSL</th><th style="text-align:right">Sublet</th><th style="text-align:right">Total</th>
      <th></th>
      <th style="text-align:right">JSSL</th><th style="text-align:right">Sublet</th><th style="text-align:right">Total</th>
    </tr>
  </thead>`;
}

/*
   RENDER A SINGLE DATA ROW
 */
function renderDataRow(r) {
  return `<tr>
    <td style="text-align:center">${r.jobCode  || ''}</td>
    <td style="text-align:center">${r.pzone    || ''}</td>
    <td style="text-align:right">${fmt(r.weight)}</td>
    <td style="text-align:right">${fmt(r.jsslwght)}</td>
    <td style="text-align:right">${fmt(r.sublet)}</td>
    <td style="text-align:right">${fmt(r.totalasw)}</td>
    <td></td>
    <td style="text-align:right">${fmt(r.weldwght)}</td>
    <td style="text-align:right">${fmt(r.fsubletwght)}</td>
    <td style="text-align:right">${fmt(r.totalwsw)}</td>
    <td></td>
    <td style="text-align:right">${fmt(r.treatwght)}</td>
    <td style="text-align:right">${fmt(r.tsubletwght)}</td>
    <td style="text-align:right">${fmt(r.totaltwght)}</td>
  </tr>`;
}

/* 
   RENDER PAGE TOTAL ROW
   NOTE: Total columns are always derived as
   JSSL + Sublet to avoid double-counting the
   pre-aggregated totalasw/totalwsw/totaltwght
   fields that come from the view.
 */
function renderPageTotal(t) {
  const asmTotal = t.jsslwght + t.sublet;
  const wldTotal = t.weldwght + t.fsubletwght;
  const trtTotal = t.treatwght + t.tsubletwght;
  return `<tr class="row-subtotal">
    <td colspan="2">Page Total</td>
    <td style="text-align:right">${fmtTotal(t.weight)}</td>
    <td style="text-align:right">${fmtTotal(t.jsslwght)}</td>
    <td style="text-align:right">${fmtTotal(t.sublet)}</td>
    <td style="text-align:right">${fmtTotal(asmTotal)}</td>
    <td></td>
    <td style="text-align:right">${fmtTotal(t.weldwght)}</td>
    <td style="text-align:right">${fmtTotal(t.fsubletwght)}</td>
    <td style="text-align:right">${fmtTotal(wldTotal)}</td>
    <td></td>
    <td style="text-align:right">${fmtTotal(t.treatwght)}</td>
    <td style="text-align:right">${fmtTotal(t.tsubletwght)}</td>
    <td style="text-align:right">${fmtTotal(trtTotal)}</td>
  </tr>`;
}

/* 
   RENDER GRAND TOTAL ROW
   Same fix: derive totals from summed parts.
 */
function renderGrandRow(title, t, cssClass = 'row-grandtotal') {
  const asmTotal = t.jsslwght + t.sublet;
  const wldTotal = t.weldwght + t.fsubletwght;
  const trtTotal = t.treatwght + t.tsubletwght;
  return `<tr class="${cssClass}">
    <td colspan="2">${title}</td>
    <td style="text-align:right">${fmtTotal(t.weight)}</td>
    <td style="text-align:right">${fmtTotal(t.jsslwght)}</td>
    <td style="text-align:right">${fmtTotal(t.sublet)}</td>
    <td style="text-align:right">${fmtTotal(asmTotal)}</td>
    <td></td>
    <td style="text-align:right">${fmtTotal(t.weldwght)}</td>
    <td style="text-align:right">${fmtTotal(t.fsubletwght)}</td>
    <td style="text-align:right">${fmtTotal(wldTotal)}</td>
    <td></td>
    <td style="text-align:right">${fmtTotal(t.treatwght)}</td>
    <td style="text-align:right">${fmtTotal(t.tsubletwght)}</td>
    <td style="text-align:right">${fmtTotal(trtTotal)}</td>
  </tr>`;
}

/* 
   BUILD PAGINATION HTML
 */
function buildPagination(current, total, prevFn, nextFn, goFn) {
  let html = `<button onclick="${prevFn}()" ${current === 1 ? 'disabled' : ''}>Previous</button>`;

  getPageNumbers(current, total).forEach(p => {
    if (p === '...') {
      html += `<span class="ellipsis">...</span>`;
    } else {
      html += `<button onclick="${goFn}(${p})" class="${p === current ? 'active' : ''}">${p}</button>`;
    }
  });

  html += `<button onclick="${nextFn}()" ${current === total ? 'disabled' : ''}>Next</button>`;
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

/* 
   RENDER ONE FACTORY SECTION
 */
function renderFactorySection(data, page, totalLabel, prevFn, nextFn, goFn) {
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const start      = (page - 1) * rowsPerPage;
  const pageData   = data.slice(start, start + rowsPerPage);

  const dataStart = start + 1;
  const dataEnd   = start + pageData.length;

  const pageTotal = zero();
  let rows = '';

  pageData.forEach(r => {
    add(pageTotal, r);
    rows += renderDataRow(r);
  });

  rows += renderPageTotal(pageTotal);

  // Grand total only on last page of this factory
  if (page === totalPages) {
    rows += renderGrandRow(totalLabel, calcTotal(data));
  }

  return `
  <table class="factory-table">
    ${tableHeader()}
    <tbody>${rows}</tbody>
  </table>
  <div class="dt-footer">
    <div class="dt-info">Showing ${dataStart} to ${dataEnd} of ${data.length} entries</div>
    <div class="dt-pagination">${buildPagination(page, totalPages, prevFn, nextFn, goFn)}</div>
  </div>`;
}

/* 
   OVERALL GRAND TOTAL (Bellary + Gujarat)
 */
function renderOverallGrandTotal() {
  const bTotal = calcTotal(bellaryData);
  const gTotal = calcTotal(gujaratData);

  const overall = zero();
  KEYS.forEach(k => {
    overall[k] = Math.round((bTotal[k] + gTotal[k]) * 100) / 100;
  });

  return `
  <table class="factory-table" style="margin-top:16px; table-layout:fixed; width:100%;">
    <thead>
      <tr style="line-height:0; height:0; visibility:hidden; border:none;">
        <th style="padding:0; border:none; width:110px"></th>
        <th style="padding:0; border:none; width:70px"></th>
        <th style="padding:0; border:none; width:90px"></th>
        <th style="padding:0; border:none; width:80px"></th>
        <th style="padding:0; border:none; width:80px"></th>
        <th style="padding:0; border:none; width:80px"></th>
        <th style="padding:0; border:none; width:14px"></th>
        <th style="padding:0; border:none; width:80px"></th>
        <th style="padding:0; border:none; width:80px"></th>
        <th style="padding:0; border:none; width:80px"></th>
        <th style="padding:0; border:none; width:14px"></th>
        <th style="padding:0; border:none; width:80px"></th>
        <th style="padding:0; border:none; width:80px"></th>
        <th style="padding:0; border:none; width:80px"></th>
      </tr>
    </thead>
    <tbody>
      ${renderGrandRow('Bellary Total',  bTotal,  'row-grandtotal')}
      ${renderGrandRow('Gujarat Total',  gTotal,  'row-grandtotal')}
      ${renderGrandRow('Grand Total',    overall, 'row-overalltotal')}
    </tbody>
  </table>`;
}

/* 
   MAIN RENDER
 */
function renderTablePage() {

  let html = TABLE_CSS;

  /* â”€â”€ FACTORY = ALL (0) â”€â”€ */
  if (selectedFactory === '0') {

    if (bellaryData.length === 0 && gujaratData.length === 0) {
      document.getElementById('reportBody').innerHTML =
        '<div class="state-msg">No records found</div>';
      return;
    }

    if (bellaryData.length) {
      html += `<div class="factory-section">
        <div class="factory-section-title">Bellary</div>
        ${renderFactorySection(
          bellaryData, bellaryPage, 'Bellary Total',
          'prevBellary', 'nextBellary', 'goBellary'
        )}
      </div>`;
    }

    if (gujaratData.length) {
      html += `<div class="factory-section">
        <div class="factory-section-title">Gujarat</div>
        ${renderFactorySection(
          gujaratData, gujaratPage, 'Gujarat Total',
          'prevGujarat', 'nextGujarat', 'goGujarat'
        )}
      </div>`;
    }

    if (bellaryData.length && gujaratData.length) {
      html += renderOverallGrandTotal();
    }

  /*  FACTORY = BELLARY (1)  */
  } else if (selectedFactory === '1') {

    if (bellaryData.length === 0) {
      document.getElementById('reportBody').innerHTML =
        '<div class="state-msg">No records found</div>';
      return;
    }

    html += `<div class="factory-section">
      ${renderFactorySection(
        bellaryData, currentPage, 'Grand Total',
        'prevPage', 'nextPage', 'goToPage'
      )}
    </div>`;

  /*  FACTORY = GUJARAT (2)  */
  } else if (selectedFactory === '2') {

    if (gujaratData.length === 0) {
      document.getElementById('reportBody').innerHTML =
        '<div class="state-msg">No records found</div>';
      return;
    }

    html += `<div class="factory-section">
      ${renderFactorySection(
        gujaratData, currentPage, 'Grand Total',
        'prevPage', 'nextPage', 'goToPage'
      )}
    </div>`;
  }

  document.getElementById('reportBody').innerHTML = html;
}

/* 
   PAGINATION NAV Single factory
 */
function nextPage()  { currentPage++; renderTablePage(); }
function prevPage()  { currentPage--; renderTablePage(); }
function goToPage(p) { currentPage = p; renderTablePage(); }

/* 
   PAGINATION NAV Bellary (when All)
 */
function nextBellary() { bellaryPage++; renderTablePage(); }
function prevBellary() { bellaryPage--; renderTablePage(); }
function goBellary(p)  { bellaryPage = p; renderTablePage(); }

/* 
   PAGINATION NAV Gujarat (when All)
*/
function nextGujarat() { gujaratPage++; renderTablePage(); }
function prevGujarat() { gujaratPage--; renderTablePage(); }
function goGujarat(p)  { gujaratPage = p; renderTablePage(); }

/* 
   EXPORT BUTTON HELPER
 */
function setExportBtn(enabled) {
  const excelBtn = document.getElementById('exportBtn');
  const pdfBtn   = document.getElementById('exportPdfBtn');
  if (excelBtn) excelBtn.disabled = !enabled;
  if (pdfBtn)   pdfBtn.disabled   = !enabled;
}

/* 
   EXPORT TO EXCEL
   Exports ALL data (not just current page)
   from bellaryData / gujaratData directly.
 */
function exportToExcel() {
  const hasBellary = bellaryData.length > 0;
  const hasGujarat = gujaratData.length > 0;

  if (!hasBellary && !hasGujarat) {
    alert('No data to export. Please fetch a report first.');
    return;
  }

  const wb = XLSX.utils.book_new();

  // Column header rows (mirrors the on-screen table)
  const groupHeaderRow = [
      'Contract', 'Phase', 'Weight',
      'Ass - JSSL', 'Ass - Sublet', 'Ass - Total', '',
      'Weld - JSSL', 'Weld - Sublet', 'Weld - Total', '',
      'Treat - JSSL', 'Treat - Sublet', 'Treat - Total'
    ];

  // Helper: derive the 3 Total columns from their parts (avoids double-counting)
  function derivedTotals(jsslwght, sublet, weldwght, fsubletwght, treatwght, tsubletwght) {
    return {
      asmTotal: jsslwght  + sublet,
      wldTotal: weldwght  + fsubletwght,
      trtTotal: treatwght + tsubletwght
    };
  }

  // Convert one dataset array to array of arrays for SheetJS
  function dataToRows(data, factoryLabel) {
    const rows = [];

    if (factoryLabel) {
      rows.push([` ${factoryLabel} `]);
    }

    rows.push(groupHeaderRow);

    // Per-row totals: derive directly from the row's own JSSL + Sublet
    data.forEach(r => {
      const jssl  = parseFloat(r.jsslwght    || 0);
      const sub   = parseFloat(r.sublet      || 0);
      const weld  = parseFloat(r.weldwght    || 0);
      const fsub  = parseFloat(r.fsubletwght || 0);
      const treat = parseFloat(r.treatwght   || 0);
      const tsub  = parseFloat(r.tsubletwght || 0);
      rows.push([
        r.jobCode || '',
        r.pzone   || '',
        parseFloat(r.weight || 0),
        jssl,  sub,  jssl + sub,  '',
        weld,  fsub, weld + fsub, '',
        treat, tsub, treat + tsub
      ]);
    });

    // Grand total: derive totals from summed parts (never use totalasw/totalwsw/totaltwght)
    const t  = calcTotal(data);
    const dt = derivedTotals(t.jsslwght, t.sublet, t.weldwght, t.fsubletwght, t.treatwght, t.tsubletwght);
    rows.push([
      `${factoryLabel || 'Grand'} Total`, '',
      t.weight,
      t.jsslwght,   t.sublet,      dt.asmTotal, '',
      t.weldwght,   t.fsubletwght, dt.wldTotal, '',
      t.treatwght,  t.tsubletwght, dt.trtTotal
    ]);

    return rows;
  }

  /* â”€â”€ Decide sheet layout based on selectedFactory â”€â”€ */

  if (selectedFactory === '0') {
    // ALL: one sheet, Bellary section then Gujarat section then overall totals

    let allRows = [];

    if (hasBellary) {
      allRows = allRows.concat(dataToRows(bellaryData, 'Bellary'));
      allRows.push([]); // blank spacer
    }

    if (hasGujarat) {
      allRows = allRows.concat(dataToRows(gujaratData, 'Gujarat'));
      allRows.push([]);
    }

    // Overall grand total
    if (hasBellary && hasGujarat) {
      const bT = calcTotal(bellaryData);
      const gT = calcTotal(gujaratData);
      const ov = zero();
      KEYS.forEach(k => ov[k] = bT[k] + gT[k]);

      // Helper for a summary row â€” derives Total columns from parts
      function mkRow(label, t) {
        return [
          label, '',
          t.weight,
          t.jsslwght,   t.sublet,      t.jsslwght   + t.sublet,      '',
          t.weldwght,   t.fsubletwght, t.weldwght   + t.fsubletwght, '',
          t.treatwght,  t.tsubletwght, t.treatwght  + t.tsubletwght
        ];
      }
      allRows.push(mkRow('Bellary Total',       bT));
      allRows.push(mkRow('Gujarat Total',       gT));
      allRows.push(mkRow('Grand Total', ov));
    }

    const ws = XLSX.utils.aoa_to_sheet(allRows);
    applyColWidths(ws);
    XLSX.utils.book_append_sheet(wb, ws, 'All Factories');

  } else if (selectedFactory === '1') {
    // Bellary only
    const ws = XLSX.utils.aoa_to_sheet(dataToRows(bellaryData, 'Bellary'));
    applyColWidths(ws);
    XLSX.utils.book_append_sheet(wb, ws, 'Bellary');

  } else if (selectedFactory === '2') {
    // Gujarat only
    const ws = XLSX.utils.aoa_to_sheet(dataToRows(gujaratData, 'Gujarat'));
    applyColWidths(ws);
    XLSX.utils.book_append_sheet(wb, ws, 'Gujarat');
  }

  // Download
  const today = new Date().toISOString().slice(0, 10);
  const contract = document.getElementById('contractInput').value.trim();
  XLSX.writeFile(wb, `Production_Status_${contract}_${today}.xlsx`);
}

/* â”€â”€ Set reasonable column widths â”€â”€ */
function applyColWidths(ws) {
  ws['!cols'] = [
    { wch: 18 }, // Contract
    { wch: 12 }, // Phase
    { wch: 10 }, // Weight
    { wch: 14 }, // Assembled JSSL
    { wch: 14 }, // Assembled Sublet
    { wch: 14 }, // Assembled Total
    { wch: 2  }, // separator
    { wch: 12 }, // Welded JSSL
    { wch: 12 }, // Welded Sublet
    { wch: 12 }, // Welded Total
    { wch: 2  }, // separator
    { wch: 12 }, // Treated JSSL
    { wch: 12 }, // Treated Sublet
    { wch: 12 }, // Treated Total
  ];
}

/* 
   EXPORT TO PDF
   Uses jsPDF + jsPDF-AutoTable (loaded via CDN in JSP)
   Exports ALL data â€” not just the current page.
 */
function exportToPDF() {
  const hasBellary = bellaryData.length > 0;
  const hasGujarat = gujaratData.length > 0;

  if (!hasBellary && !hasGujarat) {
    alert('No data to export. Please fetch a report first.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  const contract  = document.getElementById('contractInput').value.trim();
  const today     = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const pageW     = doc.internal.pageSize.getWidth();

  // â”€â”€ Colour palette â”€â”€
  const CLR = {
    brand:      [55,  73,  154],   // #37499A  (header bg)
    headerText: [255, 255, 255],
    subHead:    [248, 249, 250],   // light grey sub-header bg
    subText:    [68,  68,  68],
    rowEven:    [249, 249, 249],
    rowOdd:     [255, 255, 255],
    subtotal:   [255, 248, 225],   // page total row (amber tint)
    grandtotal: [232, 245, 233],   // factory grand total (green tint)
    overall:    [227, 242, 253],   // overall grand total (blue tint)
    factoryBg:  [220, 230, 255],   // factory section label
    border:     [222, 226, 230],
  };

  // â”€â”€ Column definitions (autoTable) â”€â”€
  // Separator columns (empty) are included to mirror the screen layout
  const columns = [
      { header: 'Contract',    dataKey: 'jobCode'      },
      { header: 'Phase',       dataKey: 'pzone'        },
      { header: 'Weight',      dataKey: 'weight'       },
      { header: 'Ass JSSL',    dataKey: 'jsslwght'    },
      { header: 'Ass Sub',     dataKey: 'sublet'       },
      { header: 'Ass Total',   dataKey: 'asmTotal'     },
      { header: 'Weld JSSL',   dataKey: 'weldwght'    },
      { header: 'Weld Sub',    dataKey: 'fsubletwght'  },
      { header: 'Weld Total',  dataKey: 'wldTotal'     },
      { header: 'Treat JSSL',  dataKey: 'treatwght'   },
      { header: 'Treat Sub',   dataKey: 'tsubletwght'  },
      { header: 'Treat Total', dataKey: 'trtTotal'     },
    ];

  //  Build a body array from a data array â”€â”€
  // Total columns are always derived from JSSL + Sublet (never from pre-aggregated view fields)
  function buildBody(data) {
    return data.map(r => ({
      jobCode:     r.jobCode      || '',
      pzone:       r.pzone        || '',
      weight:      fmt(r.weight),
      jsslwght:    fmt(r.jsslwght),
      sublet:      fmt(r.sublet),
      asmTotal:    fmtTotal(parseFloat(r.jsslwght   || 0) + parseFloat(r.sublet      || 0)),
      weldwght:    fmt(r.weldwght),
      fsubletwght: fmt(r.fsubletwght),
      wldTotal:    fmtTotal(parseFloat(r.weldwght   || 0) + parseFloat(r.fsubletwght || 0)),
      treatwght:   fmt(r.treatwght),
      tsubletwght: fmt(r.tsubletwght),
      trtTotal:    fmtTotal(parseFloat(r.treatwght  || 0) + parseFloat(r.tsubletwght || 0)),
    }));
  }

  //  Build a total row object (for grand total / factory total rows) â”€â”€
  function totalRow(label, t, cssTag) {
    return {
      jobCode:     label,
      pzone:       '',
      _rowType:    cssTag,
      weight:      fmtTotal(t.weight),
      jsslwght:    fmtTotal(t.jsslwght),
      sublet:      fmtTotal(t.sublet),
      asmTotal:    fmtTotal(t.jsslwght   + t.sublet),
      weldwght:    fmtTotal(t.weldwght),
      fsubletwght: fmtTotal(t.fsubletwght),
      wldTotal:    fmtTotal(t.weldwght   + t.fsubletwght),
      treatwght:   fmtTotal(t.treatwght),
      tsubletwght: fmtTotal(t.tsubletwght),
      trtTotal:    fmtTotal(t.treatwght  + t.tsubletwght),
    };
  }

  //  Draw page header (title + meta) â”€â”€
  function drawPageHeader(yStart) {
    // Title bar
    doc.setFillColor(...CLR.brand);
    doc.rect(40, yStart, pageW - 80, 26, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('Production Status Report', pageW / 2, yStart + 17, { align: 'center' });

    // Meta line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const factoryLabel =
      selectedFactory === '0' ? 'All Factories' :
      selectedFactory === '1' ? 'Bellary' : 'Gujarat';
    doc.text(`Contract: ${contract}   |   Factory: ${factoryLabel}   |   Date: ${today}`, 40, yStart + 42);

    return yStart + 52; // return Y after header block
  }

  // Draw a factory section label bar â”€â”€
  function drawFactoryLabel(label, y) {
    doc.setFillColor(...CLR.factoryBg);
    doc.rect(40, y, pageW - 80, 18, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...CLR.brand);
    doc.text(label, 46, y + 13);
    return y + 22;
  }

  // autoTable styles per row type â”€â”€
  function rowStyles(row) {
    const d   = row.raw;
    const tag = d && d._rowType;

    if (tag === 'subtotal')   return { fillColor: CLR.subtotal,   fontStyle: 'bold',   textColor: [80,  80,  50]  };
    if (tag === 'grandtotal') return { fillColor: CLR.grandtotal, fontStyle: 'bold',   textColor: [46, 125, 50]   };
    if (tag === 'overall')    return { fillColor: CLR.overall,    fontStyle: 'bold',   textColor: [13,  71, 161]  };

    return row.index % 2 === 0
      ? { fillColor: CLR.rowOdd }
      : { fillColor: CLR.rowEven };
  }

  // Common autoTable options â”€â”€
  function tableOpts(body, startY) {
    return {
      columns,
      body,
      startY,
      margin: { left: 40, right: 40 },
      tableWidth: pageW - 80,
      styles: {
        fontSize: 8,
        cellPadding: 3.5,
        lineColor: CLR.border,
        lineWidth: 0.4,
        overflow: 'linebreak',
        halign: 'center',
      },
      headStyles: {
        fillColor: CLR.brand,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
      },
      columnStyles: {
        jobCode: { halign: 'left',  cellWidth: 72 },
        pzone:   { halign: 'left',  cellWidth: 45 },
        weight:  { halign: 'right', cellWidth: 40 },
        // numeric columns â€” auto width
      },
      bodyStyles: { textColor: [33, 33, 33] },
      didParseCell(data) {
        if (data.section === 'body') {
          Object.assign(data.cell.styles, rowStyles(data.row));
        }
      },
      // Page numbers in footer
      didDrawPage(data) {
        const pg     = doc.internal.getCurrentPageInfo().pageNumber;
        const pgTotal = '{total_pages_count_string}'; // replaced by jsPDF putTotalPages
        doc.setFontSize(8);
        doc.setTextColor(130, 130, 130);
        doc.text(
          `Page ${pg} of ${pgTotal}`,
          pageW - 40,
          doc.internal.pageSize.getHeight() - 14,
          { align: 'right' }
        );
      },
    };
  }

  
  let y = drawPageHeader(30);

  if (selectedFactory === '0') {
    // â”€â”€ ALL: Bellary then Gujarat then overall total â”€â”€

    if (hasBellary) {
      y = drawFactoryLabel('Bellary', y);
      const body = buildBody(bellaryData);
      body.push(totalRow('Bellary Total', calcTotal(bellaryData), 'grandtotal'));
      doc.autoTable(tableOpts(body, y));
      y = doc.lastAutoTable.finalY + 16;
    }

    if (hasGujarat) {
      // Start Gujarat on same page if room, else new page
      if (y > doc.internal.pageSize.getHeight() - 120) {
        doc.addPage();
        y = drawPageHeader(30);
      }
      y = drawFactoryLabel('Gujarat', y);
      const body = buildBody(gujaratData);
      body.push(totalRow('Gujarat Total', calcTotal(gujaratData), 'grandtotal'));
      doc.autoTable(tableOpts(body, y));
      y = doc.lastAutoTable.finalY + 16;
    }

    // Overall totals table (Bellary + Gujarat + Combined)
    if (hasBellary && hasGujarat) {
      if (y > doc.internal.pageSize.getHeight() - 80) {
        doc.addPage();
        y = drawPageHeader(30);
      }
      const bT = calcTotal(bellaryData);
      const gT = calcTotal(gujaratData);
      const ov = zero();
      KEYS.forEach(k => ov[k] = bT[k] + gT[k]);

      const summaryBody = [
        totalRow('Bellary Total',       bT, 'grandtotal'),
        totalRow('Gujarat Total',       gT, 'grandtotal'),
        totalRow('Grand Total', ov, 'overall'),
      ];
      doc.autoTable(tableOpts(summaryBody, y));
    }

  } else if (selectedFactory === '1') {
    // â”€â”€ Bellary only â”€â”€
    const body = buildBody(bellaryData);
    body.push(totalRow('Grand Total', calcTotal(bellaryData), 'grandtotal'));
    doc.autoTable(tableOpts(body, y));

  } else if (selectedFactory === '2') {
    // â”€â”€ Gujarat only â”€â”€
    const body = buildBody(gujaratData);
    body.push(totalRow('Grand Total', calcTotal(gujaratData), 'grandtotal'));
    doc.autoTable(tableOpts(body, y));
  }

  // Resolve {total_pages_count_string} placeholder
  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages('{total_pages_count_string}');
  }

  // Download
  const today2 = new Date().toISOString().slice(0, 10);
  doc.save(`Production_Status_${contract}_${today2}.pdf`);
}
