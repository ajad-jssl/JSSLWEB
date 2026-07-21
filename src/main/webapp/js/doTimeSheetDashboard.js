



// ===== DO TIME SHEET DASHBOARD - REAL API INTEGRATION =====
var typesList = [];          // from /api/timesheet/types  -> [{typeId, typeName}, ...]
var summaryByType = [];      // from /api/timesheet/summary/by-type -> grouped hours per type
var grandTotal = {};         // from /api/timesheet/summary/grand-total -> overall hours
var contractList = [];       // from /api/drawingentry/contractlist (reused from invoice module)
var dCh = null, bCh = null;
var currentTypeFilter = 'ALL';

// icon + colour per type (falls back to a generic set if a type isn't in this map,
// so newly added rows in TYPE_SELECTION still render without code changes)
var typeIconMap = {
  'Modeller':    { icon: 'fa-cube',            bg: '#e3f2fd', color: '#1565c0' },
  'Editor':      { icon: 'fa-edit',             bg: '#f3e5f5', color: '#6a1b9a' },
  'Checker':     { icon: 'fa-check-circle',     bg: '#e8f5e9', color: '#2e7d32' },
  'In Direct':   { icon: 'fa-random',           bg: '#fbe9e7', color: '#bf360c' },
  'COORDINATOR': { icon: 'fa-users-cog',        bg: '#fff3e0', color: '#e65100' }
};
var fallbackPalette = [
  { bg: '#e0f2f1', color: '#00695c' },
  { bg: '#fff8e1', color: '#f57f17' },
  { bg: '#efebe9', color: '#4e342e' },
  { bg: '#e8eaf6', color: '#37499A' }
];

function getTypeStyle(typeName, idx) {
  if (typeIconMap[typeName]) return typeIconMap[typeName];
  var p = fallbackPalette[idx % fallbackPalette.length];
  return { icon: 'fa-tasks', bg: p.bg, color: p.color };
}

function todayStr() {
  var d = new Date();
  var mm = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + mm + '-' + dd;
}

function getFilters() {
  var loc = $('#locationSelect').val();
  var contract = $('#contractSelect').val();
  return {
    factoryId: (loc === 'ALL' || !loc) ? '' : loc,
    contractId: (contract === 'ALL' || !contract) ? '' : contract,
    fromDate: $('#fromDate').val(),
    toDate: $('#toDate').val()
  };
}

function buildQuery(params) {
  var q = [];
  Object.keys(params).forEach(function (k) {
    if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
      q.push(k + '=' + encodeURIComponent(params[k]));
    }
  });
  return q.length ? ('?' + q.join('&')) : '';
}

// ===== INITIAL SETUP: default dates = today, location = All, contract = All =====
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function setDefaultFilters() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    $('#fromDate').val(formatDate(firstDay));
    $('#toDate').val(formatDate(today));

    $('#locationSelect').val('ALL');
}

// ===== LOAD TYPE TABS (dynamic, from TYPE_SELECTION) =====
function loadTypes() {
  return $.ajax({
    url: new URL('/api/timesheet/types', baseUrl).toString(),
    type: 'GET',
    xhrFields: { withCredentials: true }
  }).then(function (resp) {
    typesList = (resp && resp.data) || resp || [];
    renderTypeCards();
  }).catch(function (err) {
    console.error('Error loading types:', err);
  });
}

function renderTypeCards() {
  var row = document.getElementById('typeCardsRow');
  row.innerHTML = '';

  // "All" card first
  row.innerHTML +=
    '<div class="mod active" style="--mod-bg:#e8eaf6; --mod-color:#37499A;" onclick="goType(\'ALL\',this)">' +
      '<div class="m-ico"><i class="fas fa-th-list"></i></div>' +
      '<div class="m-lbl">All</div>' +
      '<div class="m-cnt" id="mc-ALL">0</div>' +
      '<div class="m-sub">records</div>' +
    '</div>';

  typesList.forEach(function (t, idx) {
    var typeId = t.typeId !== undefined ? t.typeId : t.TYPE_ID;
    var typeName = t.typeName !== undefined ? t.typeName : t.TYPE_NAME;
    var style = getTypeStyle(typeName, idx);
    row.innerHTML +=
      '<div class="mod" style="--mod-bg:' + style.bg + '; --mod-color:' + style.color + ';" onclick="goType(' + typeId + ',this)">' +
        '<div class="m-ico"><i class="fas ' + style.icon + '"></i></div>' +
        '<div class="m-lbl" title="' + typeName + '">' + typeName + '</div>' +
        '<div class="m-cnt" id="mc-T' + typeId + '">0</div>' +
        '<div class="m-sub">records</div>' +
      '</div>';
  });
}

// ===== LOAD DATA (summary by type + grand total) =====
function loadData() {
  var f = getFilters();
  var qp = { factoryId: f.factoryId, contractId: f.contractId, fromDate: f.fromDate, toDate: f.toDate };

  Promise.all([
    fetch(baseUrl + '/api/timesheet/summary/by-type' + buildQuery(qp), {
      method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json()),
    fetch(baseUrl + '/api/timesheet/summary/grand-total' + buildQuery(qp), {
      method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json()),
    fetch(baseUrl + '/api/timesheet/summary/top-contracts' + buildQuery(Object.assign({ limit: 8 }, qp)), {
      method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json())
  ])
  .then(function ([byType, grand, topContracts]) {
    summaryByType = (byType && byType.data) || byType || [];
    grandTotal = (grand && grand.data) || grand || {};
    window._topContracts = (topContracts && topContracts.data) || topContracts || [];
    initDashboard();
  })
  .catch(function (error) {
    console.error('Error loading time sheet dashboard data:', error);
    alert('Error loading dashboard data. Please check console.');
  })
  .finally(function () {
    $('#refreshBtn').removeClass('spinning');
  });
}

function initDashboard() {
  var totalHours = grandTotal.totalHours || 0;
  var dh = grandTotal.dhHours || 0;
  var rh = grandTotal.rhHours || 0;
  var ih = grandTotal.ihHours || 0;
  var records = grandTotal.recordCount || 0;

  updateStatusBanners(totalHours, dh, rh, ih, records);
  set('typeLabel', 'All Types');

  // reset all type card counts to 0 first
  typesList.forEach(function (t) {
    var typeId = t.typeId !== undefined ? t.typeId : t.TYPE_ID;
    set('mc-T' + typeId, 0);
  });

  // populate per-type record counts on the cards, and sum them for the "All" card
  // (summed here from by-type data rather than trusting grandTotal.recordCount alone,
  // so the All count always matches what you see added up across the individual cards)
  var totalRecords = 0;
  summaryByType.forEach(function (item) {
    var typeId = item.typeId !== undefined ? item.typeId : item.TYPE_ID;
    var count = item.recordCount !== undefined ? item.recordCount : item.RECORD_COUNT;
    count = count || 0;
    set('mc-T' + typeId, count);
    totalRecords += count;
  });
  set('mc-ALL', totalRecords);

  buildDonut(dh, rh, ih, totalHours);
  buildBar();
}

function updateStatusBanners(totalHours, dh, rh, ih, records) {
  var pDh = totalHours ? Math.round(dh / totalHours * 100) : 0;
  var pRh = totalHours ? Math.round(rh / totalHours * 100) : 0;
  var pIh = totalHours ? Math.round(ih / totalHours * 100) : 0;

  countHours('stTotal', totalHours);
  countHours('stDH', dh);
  countHours('stRH', rh);
  countHours('stIH', ih);
  set('stRecords', records + ' records');
  set('stDHp', pDh + '% of Total');
  set('stRHp', pRh + '% of Total');
  set('stIHp', pIh + '% of Total');

  setTimeout(function () {
    w('sp-dh', pDh);
    w('sp-rh', pRh);
    w('sp-ih', pIh);
  }, 440);
}

function buildDonut(dh, rh, ih, tot) {
  var ctx = document.getElementById('donutChart').getContext('2d');
  if (dCh) { dCh.destroy(); }

  var amountDisplayPlugin = {
    afterDraw: function (chart) {
      var width = chart.width, height = chart.height, ctx = chart.ctx;
      ctx.save();
      var fontSize = (height / 120).toFixed(2);
      ctx.font = "bold " + fontSize * 12 + "px 'Plus Jakarta Sans'";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillStyle = "#1c2e1c";
      var text = fmtHours(tot) + ' hrs';
      ctx.fillText(text, width / 2, height / 2);
      ctx.restore();
    }
  };

  dCh = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['DH Hours', 'RH Hours', 'IH Hours'],
      datasets: [{
        data: [dh, rh, ih],
        backgroundColor: ['#81C784', '#FFB74D', '#CE93D8'],
        borderWidth: 3, borderColor: '#fff', hoverOffset: 8
      }]
    },
    options: {
      cutoutPercentage: 70,
      legend: { display: false },
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        titleFontSize: 12, bodyFontSize: 13, bodyFontStyle: 'bold',
        displayColors: false, cornerRadius: 6, xPadding: 15, yPadding: 12,
        callbacks: {
          title: function (t) { return t[0].label; },
          label: function (t, d) {
            var idx = t.index;
            var val = d.datasets[0].data[idx];
            var pct = tot ? Math.round(val / tot * 100) : 0;
            return fmtHours(val) + ' hrs (' + pct + '%)';
          }
        }
      }
    },
    plugins: [amountDisplayPlugin]
  });

  var cols = ['#81C784', '#FFB74D', '#CE93D8'], lbls = ['DH Hours', 'RH Hours', 'IH Hours'], vals = [dh, rh, ih];
  var leg = document.getElementById('donutLegend');
  leg.innerHTML = '';
  for (var i = 0; i < lbls.length; i++) {
    var pct = tot ? Math.round(vals[i] / tot * 100) : 0;
    leg.innerHTML +=
      '<div class="dl-row">' +
        '<span class="dl-l"><span class="dl-dot" style="background:' + cols[i] + '"></span>' + lbls[i] + '</span>' +
        '<span class="dl-v" style="color:' + cols[i] + '">' + fmtHours(vals[i]) + ' hrs&nbsp;<small style="font-weight:400;color:#bbb;">(' + pct + '%)</small></span>' +
      '</div>';
  }
}

/* BAR - top 8 contracts by total hours */
function buildBar() {
  var data = window._topContracts || [];

  var labs = [], hrs = [], cols = [];
  var palette = ['#748FFC', '#9775FA', '#FFB74D', '#81C784', '#F06292', '#4DD0AE', '#FFCC80', '#ADB5BD'];

  data.forEach(function (item, idx) {
    var contractId = item.contractId !== undefined ? item.contractId : item.CONTRACT_ID;
    var totalHours = item.totalHours !== undefined ? item.totalHours : item.TOTAL_HOURS;
    var jobCode = resolveJobCode(contractId);
    labs.push(jobCode);
    hrs.push(totalHours || 0);
    cols.push(palette[idx % palette.length]);
  });

  var ctx = document.getElementById('barChart').getContext('2d');
  if (bCh) { bCh.destroy(); }

  var hourLabelsPlugin = {
    afterDatasetsDraw: function (chart) {
      var ctx = chart.ctx;
      chart.data.datasets.forEach(function (dataset, i) {
        var meta = chart.getDatasetMeta(i);
        meta.data.forEach(function (bar, index) {
          var val = hrs[index];
          if (!val) return;
          var text = fmtHours(val) + 'h';
          var x = bar._model.x, y = bar._model.y, width = bar._model.width;
          var chartAreaBottom = chart.chart.chartArea.bottom;
          var height = chartAreaBottom - y;
          var fontSize = Math.max(9, Math.min(14, height / 4));

          ctx.save();
          ctx.font = "bold " + fontSize + "px 'Plus Jakarta Sans'";
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          ctx.fillStyle = "#fff";
          ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 1;
          ctx.fillText(text, x, y + height / 2);
          ctx.restore();
        });
      });
    }
  };

  bCh = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labs,
        datasets: [{
          label: 'Hours',
          data: hrs,
          backgroundColor: cols,
          borderSkipped: false,
          minBarLength: 4,
          barThickness: 46   // fixed pixel width, works even on old Chart.js — replaces maxBarThickness/barPercentage/categoryPercentage
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          xAxes: [{
            gridLines: { display: false },
            ticks: { fontSize: 10, fontFamily: 'Plus Jakarta Sans' }
          }],
          yAxes: [{
            gridLines: { color: '#f0f0f0' },
            ticks: { min: 0, fontSize: 10, fontFamily: 'Plus Jakarta Sans', beginAtZero: true }
          }]
        },
        tooltips: {
          callbacks: {
            label: function (t) { return fmtHours(t.yLabel) + ' hrs'; }
          }
        }
      },
      plugins: [hourLabelsPlugin]
    });
}

function resolveJobCode(contractId) {
  var match = contractList.find(function (c) {
    return String(c.contract_id) === String(contractId);
  });
  return match ? match.jobCode : ('#' + contractId);
}

/* TYPE CARD CLICK - filter by type */
function goType(typeId, el) {
  var all = document.querySelectorAll('.mod');
  for (var i = 0; i < all.length; i++) { all[i].classList.remove('active'); }
  el.classList.add('active');

  currentTypeFilter = typeId;

  if (typeId === 'ALL') {
    var totalHours = grandTotal.totalHours || 0;
    var dh = grandTotal.dhHours || 0;
    var rh = grandTotal.rhHours || 0;
    var ih = grandTotal.ihHours || 0;
    var records = grandTotal.recordCount || 0;
    updateStatusBanners(totalHours, dh, rh, ih, records);
    buildDonut(dh, rh, ih, totalHours);
    set('typeLabel', 'All Types');
  } else {
    var selected = summaryByType.find(function (item) {
      var tId = item.typeId !== undefined ? item.typeId : item.TYPE_ID;
      return String(tId) === String(typeId);
    });
    if (selected) {
      var totalHours = selected.totalHours || 0;
      var dh = selected.dhHours || 0;
      var rh = selected.rhHours || 0;
      var ih = selected.ihHours || 0;
      var records = selected.recordCount || 0;
      updateStatusBanners(totalHours, dh, rh, ih, records);
      buildDonut(dh, rh, ih, totalHours);
      set('typeLabel', selected.typeName || selected.TYPE_NAME || ('Type ' + typeId));
    } else {
      updateStatusBanners(0, 0, 0, 0, 0);
      buildDonut(0, 0, 0, 0);
      set('typeLabel', 'No Data');
    }
  }

  // top-contracts bar re-fetched scoped to the selected type
  reloadTopContractsForType(typeId);
}

function reloadTopContractsForType(typeId) {
  var f = getFilters();
  var qp = { factoryId: f.factoryId, contractId: f.contractId, fromDate: f.fromDate, toDate: f.toDate, limit: 8 };
  if (typeId !== 'ALL') qp.typeId = typeId;

  fetch(baseUrl + '/api/timesheet/summary/top-contracts' + buildQuery(qp), {
    method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' }
  }).then(r => r.json())
    .then(function (resp) {
      window._topContracts = (resp && resp.data) || resp || [];
      buildBar();
    })
    .catch(function (err) { console.error('Error loading top contracts:', err); });
}

/* HELPERS */
function set(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; }
function w(id, pct) { var e = document.getElementById(id); if (e) e.style.width = pct + '%'; }
function fmtHours(v) { return (Math.round((v || 0) * 100) / 100).toFixed(2); }

function countHours(id, target) {
  var el = document.getElementById(id);
  if (!el) return;
  var cur = 0, steps = 25, step = target / steps;
  var i = 0;
  var t = setInterval(function () {
    i++;
    cur = Math.min(cur + step, target);
    el.textContent = fmtHours(cur);
    if (i >= steps) { el.textContent = fmtHours(target); clearInterval(t); }
  }, 35);
}

/* CONTRACT DROPDOWN - reuses the existing invoice-module endpoint */
function populateContractDropdown() {
  return $.ajax({
    url: new URL('/api/drawingentry/contractlist', baseUrl).toString(),
    type: 'GET',
    xhrFields: { withCredentials: true }
  }).then(function (response) {
    var dropdown = $('#contractSelect');
    dropdown.empty();
    dropdown.append($('<option>', { value: 'ALL', text: 'All' }));
    if (response && response.Data && response.Data.length) {
      contractList = response.Data;
      response.Data.forEach(function (contract) {
        dropdown.append($('<option>', { value: contract.contract_id, text: contract.jobCode }));
      });
    }
    dropdown.val('ALL');
  }).catch(function (err) {
    console.error('Error loading contract list:', err);
  });
}

/* INACTIVITY LOGOUT */
var _it;
function _ri() {
  clearTimeout(_it);
  _it = setTimeout(function () { logoutUser(new Event('logout')); }, 900000);
}
document.onmousemove = _ri;
document.onkeydown = _ri;
document.onclick = _ri;
document.onscroll = _ri;
_ri();

/* PAGE INIT */
/*$(document).ready(function () {
  setDefaultFilters();

  Promise.all([loadTypes(), populateContractDropdown()]).then(function () {
    loadData();
  });

  $('#locationSelect, #contractSelect, #fromDate, #toDate').on('change', function () {
    currentTypeFilter = 'ALL';
    document.querySelectorAll('.mod').forEach(function (m) { m.classList.remove('active'); });
    var allCard = document.querySelector('.mod');
    if (allCard) allCard.classList.add('active');
    loadData();
  });

  $('#refreshBtn').on('click', function () {
    $(this).addClass('spinning');
    loadData();
  });
});*/

/* PAGE INIT — only called externally after permission check passes */
window.initTimesheetDashboard = function () {
  setDefaultFilters();

  Promise.all([loadTypes(), populateContractDropdown()]).then(function () {
    loadData();
  });

  $('#locationSelect, #contractSelect, #fromDate, #toDate').on('change', function () {
    currentTypeFilter = 'ALL';
    document.querySelectorAll('.mod').forEach(function (m) { m.classList.remove('active'); });
    var allCard = document.querySelector('.mod');
    if (allCard) allCard.classList.add('active');
    loadData();
  });

  $('#refreshBtn').on('click', function () {
    $(this).addClass('spinning');
    loadData();
  });
};