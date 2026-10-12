/* ===================================================================
   Sales CRM Dashboard — now backed by real data from:
     GET /api/sales/salesmen                    -> string[]
     GET /api/sales/zones                       -> [{id, name}]   (native query on SUB_ZONE_MASTER)
     GET /api/sales/segments                    -> [{id, name}]   (native query on SEGMENT_MASTER, used only to seed 0-tonnage segments)
     GET /api/sales/dashboard/records?fromDate=&toDate=&salesPerson=

   All dummy-data generation has been removed. Zone filtering still happens
   client-side (same as before) — only date range + salesman are sent to the
   server, so switching zones doesn't need a new round trip.
   =================================================================== */

// icon + colour per zone name (falls back to DEFAULT_ZONE_STYLE for any
// zone that isn't North/South/East/West, e.g. if new zones get added later)
var zoneIconMap = {
  'North': { icon: 'fa-compass',   bg: '#e3f2fd', color: '#1565c0' },
  'South': { icon: 'fa-sun',       bg: '#fff3e0', color: '#e65100' },
  'East':  { icon: 'fa-cloud-sun', bg: '#e0f4f5', color: '#0f7c85' },
  'West':  { icon: 'fa-water',     bg: '#f3e5f5', color: '#6a1b9a' }
};
var DEFAULT_ZONE_STYLE = { icon: 'fa-map-marker-alt', bg: '#e8edfd', color: '#1b3f9e' };
function zoneStyle(name) { return zoneIconMap[name] || DEFAULT_ZONE_STYLE; }

// Distinct colour per segment name, assigned on first sight so any segment
// coming back from SEGMENT_MASTER gets a stable colour without a hardcoded list.
var SEGMENT_PALETTE = [
  '#2563EB', '#D97706', '#059669', '#DC2626', '#7C3AED',
  '#0891B2', '#65A30D', '#EA580C', '#4B5563', '#DB2777'
];
var SEGMENT_COLORS = {};
function colorForSegment(name) {
  if (!SEGMENT_COLORS[name]) {
    var idx = Object.keys(SEGMENT_COLORS).length % SEGMENT_PALETTE.length;
    SEGMENT_COLORS[name] = SEGMENT_PALETTE[idx];
  }
  return SEGMENT_COLORS[name];
}

// funnel stage metadata (sequence: Total -> Lead -> Enquiry -> Offer -> Order Received)
var METRICS = {
  total:   { label: 'Total',           color: '#5b7cf0' },
  lead:    { label: 'Leads',           color: '#e8871e' },
  enquiry: { label: 'Enquiries',       color: '#0f7c85' },
  offer:   { label: 'Offers',          color: '#8e44ad' },
  order:   { label: 'Orders Received', color: '#1f9d55' }
};

var ALL_ZONES = [];       // [{id, name}] from /api/sales/zones
var ALL_SEGMENTS = [];    // [{id, name}] from /api/sales/segments
var ALL_RECORDS = [];     // records for the current date+salesman filter (all zones)
var currentZoneFilter = 'ALL';
var dCh = null, yoyCh = null;
var currentYoyChartType = 'bar';

/* ================= HELPERS ================= */
function formatDate(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart(2, '0');
  var dd = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + dd;
}
function set(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; }



//Function That add the 

function fmtCount(v) { return (Number(v) || 0).toLocaleString('en-IN'); }
function fmtTonnage(v) { return (Number(v) || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 }); }
function fmtTonnageCompact(v) {
  v = Number(v) || 0;
  var abs = Math.abs(v);
  if (abs >= 1e7) return (v / 1e7).toLocaleString('en-IN', { maximumFractionDigits: 1 }) + 'Cr';
  if (abs >= 1e5) return (v / 1e5).toLocaleString('en-IN', { maximumFractionDigits: 1 }) + 'L';
  if (abs >= 1e3) return (v / 1e3).toLocaleString('en-IN', { maximumFractionDigits: 1 }) + 'K';
  return v.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}



  //Function that Dont add the K,L  


/*function fmtCount(v) { return (Number(v) || 0).toLocaleString('en-IN');}
function fmtTonnage(v) { return (Number(v) || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 }); }
function fmtTonnageCompact(v) {
    return (Number(v) || 0).toLocaleString('en-IN', {
        maximumFractionDigits: 0
    });
}*/

function countUp(id, target) {
  var el = document.getElementById(id);
  if (!el) return;
  var cur = 0, steps = 22, step = target / steps, i = 0;
  var t = setInterval(function () {
    i++;
    cur = Math.min(cur + step, target);
    el.textContent = fmtCount(Math.round(cur));
    if (i >= steps) { el.textContent = fmtCount(target); clearInterval(t); }
  }, 28);
}

function getFilters() {
  return {
    fromDate: $('#fromDate').val(),
    toDate: $('#toDate').val(),
    salesman: $('#salesmanSelect').val()
  };
}


function setDefaultFilters() {
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  $('#fromDate').val(formatDate(firstDay));
  $('#toDate').val(formatDate(today));
}

/* ================= API CALLS ================= */
function apiGet(path, params) {
  var url = new URL(baseUrl.replace(/\/$/, '') + path);
  if (params) {
    Object.keys(params).forEach(function (k) {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
        url.searchParams.append(k, params[k]);
      }
    });
  }
  return fetch(url, { credentials: 'include' }).then(function (res) {
    if (!res.ok) throw new Error('Request failed: ' + path + ' (' + res.status + ')');
    return res.json();
  });
}

function fetchSalesmen() { return apiGet('/api/sales/salesmen'); }
function fetchZones() { return apiGet('/api/sales/zones'); }
function fetchSegments() { return apiGet('/api/sales/segments'); }
function fetchRecords(filters) {
  return apiGet('/api/sales/dashboard/records', {
    fromDate: filters.fromDate,
    toDate: filters.toDate,
    salesPerson: filters.salesman || 'ALL'
  });
}

/* ================= SALESMAN DROPDOWN ================= */
function populateSalesmanDropdown(salesmen) {
  var dropdown = $('#salesmanSelect');
  dropdown.empty();
  dropdown.append($('<option>', { value: 'ALL', text: 'All' }));
  (salesmen || []).forEach(function (name) {
    dropdown.append($('<option>', { value: name, text: name }));
  });
  dropdown.val('ALL');
}

/* ================= ZONE CARDS ================= */
function renderZoneCards(zones) {
  ALL_ZONES = zones || [];
  var row = document.getElementById('zoneCardsRow');
  row.innerHTML = '';

  row.innerHTML +=
    '<div class="mod active" style="--mod-bg:#e8edfd; --mod-color:#1b3f9e;" onclick="goZone(\'ALL\',this)">' +
      '<div class="m-ico"><i class="fas fa-globe-asia"></i></div>' +
      '<div class="m-lbl">All Zones</div>' +
      '<div class="m-cnt" id="mc-ALL">0</div>' +
      '<div class="m-sub" id="msub-ALL">&nbsp;</div>' +
    '</div>';

  ALL_ZONES.forEach(function (zone) {
    var name = zone.name;
    var style = zoneStyle(name);
    row.innerHTML +=
      '<div class="mod" style="--mod-bg:' + style.bg + '; --mod-color:' + style.color + ';" onclick="goZone(\'' + name + '\',this)">' +
        '<div class="m-ico"><i class="fas ' + style.icon + '"></i></div>' +
        '<div class="m-lbl">' + name + '</div>' +
        '<div class="m-cnt" id="mc-' + name + '">0</div>' +
        '<div class="m-sub" id="msub-' + name + '">&nbsp;</div>' +
      '</div>';
  });
}

function goZone(zone, el) {
  var all = document.querySelectorAll('#zoneCardsRow .mod');
  for (var i = 0; i < all.length; i++) { all[i].classList.remove('active'); }
  el.classList.add('active');

  currentZoneFilter = zone;
  set('zoneLabel', zone === 'ALL' ? 'All Zones' : zone + ' Zone');
  refreshDashboard();
}

/* ================= FILTERED DATA (client-side zone filter only —
   date range + salesman are already applied server-side in ALL_RECORDS) ================= */
function getFilteredRecords(opts) {
  opts = opts || {};
  var zone = opts.ignoreZone ? 'ALL' : currentZoneFilter;
  return ALL_RECORDS.filter(function (r) {
    if (zone !== 'ALL' && r.zone !== zone) return false;
    return true;
  });
}

// counts by record id (for banners/zone cards) AND tonnage sums per bucket
// (for the Zone Split donut and the Top-5 Segment bars)
function summarize(records) {
  var s = {
    total:   { count: records.length, tonnage: 0 },
    lead:    { count: 0, tonnage: 0 },
    enquiry: { count: 0, tonnage: 0 },
    offer:   { count: 0, tonnage: 0 },
    order:   { count: 0, tonnage: 0 },
    other:   { count: 0, tonnage: 0 }
  };
  records.forEach(function (r) {
    var t = Number(r.tonnage) || 0;
    var bucket = s[r.stageBucket] ? r.stageBucket : 'other';
    s[bucket].count++;
    s[bucket].tonnage += t;
  });
  return s;
}

/* ================= MAIN REFRESH ================= */
function refreshDashboard() {
  var filtered = getFilteredRecords();
  var summary = summarize(filtered);

  updateStatusBanners(summary);
  updateZoneCardCounts();
  buildDonut(summary);
  refreshQuadPanel(filtered, summary);
}

function updateZoneCardCounts() {
  var noZoneFilter = getFilteredRecords({ ignoreZone: true });

  set('mc-ALL', fmtCount(noZoneFilter.length));
  setZoneBreakdown('msub-ALL', summarize(noZoneFilter));

  ALL_ZONES.forEach(function (zone) {
    var name = zone.name;
    var zoneRecords = noZoneFilter.filter(function (r) { return r.zone === name; });
    set('mc-' + name, fmtCount(zoneRecords.length));
    setZoneBreakdown('msub-' + name, summarize(zoneRecords));
  });
}

function setZoneBreakdown(elId, s) {
  var el = document.getElementById(elId);
  if (!el) return;
  el.textContent = s.lead.count + ' Leads \u00B7 ' + s.enquiry.count + ' Enq \u00B7 ' + s.offer.count + ' Off \u00B7 ' + s.order.count + ' Ord';
}

function updateStatusBanners(summary) {
  countUp('stTotal', summary.total.count);
  countUp('stLead', summary.lead.count);
  countUp('stEnq', summary.enquiry.count);
  countUp('stOffer', summary.offer.count);
  countUp('stOrder', summary.order.count);

  var tot = summary.total.count;
  set('stLeadP', (tot ? Math.round(summary.lead.count / tot * 100) : 0) + '% of Total');
  set('stEnqP', (tot ? Math.round(summary.enquiry.count / tot * 100) : 0) + '% of Total');
  set('stOfferP', (tot ? Math.round(summary.offer.count / tot * 100) : 0) + '% of Total');
  set('stOrderP', (tot ? Math.round(summary.order.count / tot * 100) : 0) + '% of Total');
}

/* Clicking a status banner briefly highlights the matching quadrant */
function setMetric(metric) {
  var map = { lead: ['qcLead'], offer: ['qcOffer'], enquiry: ['qcEnquire'], order: ['qcOrder'] };
  var ids = map[metric];
  if (!ids) return;
  ids.forEach(function (elId) {
    var el = document.getElementById(elId);
    if (!el) return;
    el.style.transition = 'box-shadow .2s';
    el.style.boxShadow = '0 0 0 2px var(--p3)';
    setTimeout(function () { el.style.boxShadow = 'none'; }, 700);
  });
}

/* ================= DONUT — Zone Split panel, now by TONNAGE per funnel stage ================= */
function buildDonut(summary) {
  var ctx = document.getElementById('donutChart').getContext('2d');
  if (dCh) { dCh.destroy(); }

  var labels = ['Leads', 'Enquiries', 'Offers', 'Orders Received'];
  var data = [summary.lead.tonnage, summary.enquiry.tonnage, summary.offer.tonnage, summary.order.tonnage];
  var colors = [METRICS.lead.color, METRICS.enquiry.color, METRICS.offer.color, METRICS.order.color];
  var sum = data.reduce(function (a, b) { return a + b; }, 0);

  var centerTextPlugin = {
    afterDraw: function (chart) {
      var width = chart.width, height = chart.height, ctx = chart.ctx;
      ctx.save();
      var fontSize = (height / 120).toFixed(2);
      ctx.font = "bold " + fontSize * 8 + "px 'Plus Jakarta Sans'";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillStyle = "#101a3a";
      ctx.fillText(fmtTonnageCompact(sum) + '', width / 2, height / 2);
      ctx.restore();
    }
  };

  dCh = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
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
        titleFontSize: 12, bodyFontSize: 10, bodyFontStyle: 'bold',
        displayColors: false, cornerRadius: 6, xPadding: 15, yPadding: 12,
        callbacks: {
          title: function (t) { return t[0].label; },
          label: function (t, d) {
            var idx = t.index;
            var val = d.datasets[0].data[idx];
            var pct = sum ? Math.round(val / sum * 100) : 0;
            return fmtTonnage(val) + ' MT (' + pct + '%)';
          }
        }
      }
    },
    plugins: [centerTextPlugin]
  });

  var leg = document.getElementById('donutLegend');
  leg.innerHTML = '';
  for (var i = 0; i < labels.length; i++) {
    var pct = sum ? Math.round(data[i] / sum * 100) : 0;
    leg.innerHTML +=
      '<div class="dl-row">' +
        '<span class="dl-l"><span class="dl-dot" style="background:' + colors[i] + '"></span>' + labels[i] + '</span>' +
        '<span class="dl-v" style="color:' + colors[i] + '">' + fmtTonnageCompact(data[i]) + '&nbsp;<small style="font-weight:400;color:#bbb;">(' + pct + '%)</small></span>' +
      '</div>';
  }
}

/* ================= QUAD PANEL ================= */
function refreshQuadPanel(filtered, summary) {
  buildMiniBars('barsLead', filtered, 'lead');
  buildMiniBars('barsOffer', filtered, 'offer');
  buildMiniBars('barsEnquire', filtered, 'enquiry');
  buildMiniBars('barsOrder', filtered, 'order');
  buildYoyChart(summary);
}

/* Top-5 segments for a given funnel stage, ranked by TONNAGE (not record count) */
function buildMiniBars(containerId, filtered, bucketKey) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var perSegment = {};
  ALL_SEGMENTS.forEach(function (s) { perSegment[s.name] = 0; });
  filtered.forEach(function (r) {
    if (r.stageBucket === bucketKey) {
      perSegment[r.segment] = (perSegment[r.segment] || 0) + (Number(r.tonnage) || 0);
    }
  });

  var top5 = Object.keys(perSegment)
    .map(function (s) { return { segment: s, tonnage: perSegment[s] }; })
    .filter(function (x) { return x.tonnage > 0; })
    .sort(function (a, b) { return b.tonnage - a.tonnage; })
    .slice(0, 5);

  var maxVal = Math.max.apply(null, top5.map(function (x) { return x.tonnage; }).concat([1]));

  container.innerHTML = top5.map(function (x) {
    // Width stays proportional to tonnage (so bars visibly differ), but never
    // drops below 8% — the actual "always legible" guarantee comes from the
    // min-width in px on .mbar-fill below, not from inflating the percentage.
    var widthPct = Math.max(8, Math.round(x.tonnage / maxVal * 80));
    return (
      '<div class="mbar-row" style="padding:0px 0px;">' +
        '<span class="mbar-label" title="' + x.segment + '">' + x.segment + '</span>' +
        '<span class="mbar-track">' +
          '<span class="mbar-fill" style="width:' + widthPct + '%; min-width:40px; background:' + colorForSegment(x.segment) + '">' +
            '<span class="mbar-fill-val">' + fmtTonnageCompact(x.tonnage) + '</span>' +
          '</span>' +
        '</span>' +
      '</div>'
    );
  }).join('') || '<div class="mbar-row" style="color:var(--muted); font-size:10px;">No data for this stage yet</div>';
}

/* Previous FY vs Current FY, by tonnage per funnel stage.
   NOTE: your source data has no fiscal-year field to compare against, so
   "Previous FY" here is still a simulated 80% of the current filtered
   tonnage — same placeholder behaviour as before. Swap this for a real
   prior-FY query once that's available (e.g. a fiscal_year column or a
   separate prior-year snapshot table). */
function setYoyChartType(type, btnEl) {
  currentYoyChartType = type;
  var allBtns = document.querySelectorAll('.yoy-toggle-btn');
  allBtns.forEach(function (b) { b.classList.remove('active'); });
  btnEl.classList.add('active');

  var filtered = getFilteredRecords();
  var summary = summarize(filtered);
  buildYoyChart(summary);
}

function buildYoyChart(summary) {
  var labels = ['Leads', 'Enquiries', 'Offers', 'Orders Received'];
  var current = [summary.lead.tonnage, summary.enquiry.tonnage, summary.offer.tonnage, summary.order.tonnage];
  var previous = current.map(function (v) { return Math.round(v * 0.8); });

  var ctx = document.getElementById('yoyChart').getContext('2d');
  if (yoyCh) { yoyCh.destroy(); }

  var isLine = currentYoyChartType === 'line';
  var datasets;
  if (isLine) {
    datasets = [
      { label: 'Previous FY', data: previous, borderColor: '#c9d6fb', backgroundColor: 'rgba(201,214,251,0.15)', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#c9d6fb', pointBorderColor: '#fff', pointBorderWidth: 1, fill: false, lineTension: 0.3 },
      { label: 'Current FY', data: current, borderColor: '#2f57c9', backgroundColor: 'rgba(47,87,201,0.15)', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#2f57c9', pointBorderColor: '#fff', pointBorderWidth: 1, fill: false, lineTension: 0.3 }
    ];
  } else {
    datasets = [
      { label: 'Previous FY', data: previous, backgroundColor: '#c9d6fb' },
      { label: 'Current FY', data: current, backgroundColor: '#2f57c9' }
    ];
  }

  yoyCh = new Chart(ctx, {
    type: isLine ? 'line' : 'bar',
    data: { labels: labels, datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { position: 'bottom', labels: { boxWidth: 8, fontSize: 9 } },
      scales: {
        xAxes: [{ gridLines: { display: false }, ticks: { fontSize: 8.5, fontFamily: 'Plus Jakarta Sans' } }],
        yAxes: [{
          gridLines: { color: '#f0f0f0' },
          ticks: {
            min: 0, fontSize: 8.5, fontFamily: 'Plus Jakarta Sans', beginAtZero: true,
            callback: function (value) { return fmtTonnageCompact(value); }
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function (t, d) { return d.datasets[t.datasetIndex].label + ': ' + fmtTonnage(t.yLabel) + ' MT'; }
        }
      }
    }
  });
}

/* ================= LOAD + REFRESH FROM SERVER ================= */
function loadAndRefresh() {
  var filters = getFilters();
  return fetchRecords(filters).then(function (records) {
    ALL_RECORDS = records || [];
    refreshDashboard();
  }).catch(function (err) {
    console.error('Failed to load dashboard records:', err);
  });
}

/* ================= INACTIVITY LOGOUT ================= */
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

/* ================= PAGE INIT — only called externally after permission check passes ================= */
window.initSalesCrmDashboard = function () {
  setDefaultFilters();

  Promise.all([fetchSalesmen(), fetchZones(), fetchSegments()])
    .then(function (results) {
      populateSalesmanDropdown(results[0]);
      renderZoneCards(results[1]);
      ALL_SEGMENTS = results[2] || [];
      return loadAndRefresh();
    })
    .catch(function (err) {
      console.error('Failed to initialize dashboard:', err);
    });

  $('#fromDate, #toDate, #salesmanSelect').on('change', function () {
    loadAndRefresh();
  });

  $('#refreshBtn').on('click', function () {
    var btn = $(this);
    btn.addClass('spinning');
    loadAndRefresh().finally(function () {
      setTimeout(function () { btn.removeClass('spinning'); }, 300);
    });
  });
};

$(document).ready(function () {
  $('#sidebarToggleTop').click(function () {
    $('#accordionSidebar').toggleClass('toggled');
  });
});