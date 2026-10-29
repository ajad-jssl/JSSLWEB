/* ===================================================================
   Sales CRM Dashboard
   Buckets: Lead, Enquiry, Hot Case, Order Received, Lost
   (bucket is decided on the server from the stage id, see SalesDashboardService.bucketOf)
   =================================================================== */

var zoneIconMap = {
  'North': { icon: 'fa-compass',   bg: '#e3f2fd', color: '#1565c0' },
  'South': { icon: 'fa-sun',       bg: '#fff3e0', color: '#e65100' },
  'East':  { icon: 'fa-cloud-sun', bg: '#e0f4f5', color: '#0f7c85' },
  'West':  { icon: 'fa-water',     bg: '#f3e5f5', color: '#6a1b9a' }
};
var DEFAULT_ZONE_STYLE = { icon: 'fa-map-marker-alt', bg: '#e8edfd', color: '#1b3f9e' };
function zoneStyle(name) { return zoneIconMap[name] || DEFAULT_ZONE_STYLE; }

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

var METRICS = {
  total:   { label: 'Total',           color: '#5b7cf0' },
  lead:    { label: 'Leads',           color: '#e8871e' },
  enquiry: { label: 'Enquiries',       color: '#0f7c85' },
  hotcase: { label: 'Hot Cases',       color: '#d9480f' },
  order:   { label: 'Orders Received', color: '#1f9d55' },
  lost:    { label: 'Lost',            color: '#c0392b' }
};

var BUCKET_KEYS = ['lead', 'enquiry', 'hotcase', 'order', 'lost', 'other'];



var ALL_ZONES = [];
var ALL_SEGMENTS = [];
var ALL_RECORDS = [];
var currentZoneFilter = 'ALL';
var dCh = null, yoyCh = null;
var currentYoyChartType = 'bar';
var CURRENT_DRILL_RECORDS = [];

/* ================= HELPERS ================= */
function formatDate(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart(2, '0');
  var dd = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + dd;
}
function set(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; }

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
function fmtCr(v) {
  v = Number(v) || 0;
  return '\u20B9' + v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'Cr';
}

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
      '<div class="m-sub" id="msub-ALL" hidden>&nbsp;</div>' +
    '</div>';

  ALL_ZONES.forEach(function (zone) {
    var name = zone.name;
    var style = zoneStyle(name);
    row.innerHTML +=
      '<div class="mod" style="--mod-bg:' + style.bg + '; --mod-color:' + style.color + ';" onclick="goZone(\'' + name + '\',this)">' +
        '<div class="m-ico"><i class="fas ' + style.icon + '"></i></div>' +
        '<div class="m-lbl">' + name + '</div>' +
        '<div class="m-cnt" id="mc-' + name + '">0</div>' +
        '<div class="m-sub" id="msub-' + name + '" hidden>&nbsp;</div>' +
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

/* ================= FILTERED DATA ================= */
function getFilteredRecords(opts) {
  opts = opts || {};
  var zone = opts.ignoreZone ? 'ALL' : currentZoneFilter;
  return ALL_RECORDS.filter(function (r) {
    if (zone !== 'ALL' && r.zone !== zone) return false;
    return true;
  });
}

/*function summarize(records) {
  var s = { total: { count: records.length, tonnage: 0, value: 0 } };
  BUCKET_KEYS.forEach(function (k) { s[k] = { count: 0, tonnage: 0, value: 0 }; });
  records.forEach(function (r) {
    var t = Number(r.tonnage) || 0;
    var v = Number(r.probableValue) || 0;
    var bucket = s[r.stageBucket] ? r.stageBucket : 'other';
    s[bucket].count++;
    s[bucket].tonnage += t;
    s[bucket].value += v;
    s.total.tonnage += t;
    s.total.value += v;
  });
  return s;
}*/



function summarize(records) {
  var s = { total: { count: 0, tonnage: 0, value: 0 } };
  BUCKET_KEYS.forEach(function (k) { s[k] = { count: 0, tonnage: 0, value: 0 }; });
  records.forEach(function (r) {
    var t = Number(r.tonnage) || 0;
    var v = Number(r.probableValue) || 0;
    var bucket = s[r.stageBucket] ? r.stageBucket : 'other';
    s[bucket].count++;
    s[bucket].tonnage += t;
    s[bucket].value += v;
    if (bucket !== 'lost') {          // Lost is excluded from Total
      s.total.count++;
      s.total.tonnage += t;
      s.total.value += v;
    }
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

/*function updateZoneCardCounts() {
  var noZoneFilter = getFilteredRecords({ ignoreZone: true });

  set('mc-ALL', fmtCount(noZoneFilter.length));
  setZoneBreakdown('msub-ALL', summarize(noZoneFilter));

  ALL_ZONES.forEach(function (zone) {
    var name = zone.name;
    var zoneRecords = noZoneFilter.filter(function (r) { return r.zone === name; });
    set('mc-' + name, fmtCount(zoneRecords.length));
    setZoneBreakdown('msub-' + name, summarize(zoneRecords));
  });
}*/

function updateZoneCardCounts() {
  var noZoneFilter = getFilteredRecords({ ignoreZone: true });

  // All Zones count = everything except the Lost stage
  var allZonesExLost = noZoneFilter.filter(function (r) {
    return r.stageBucket !== 'lost';
  });
  set('mc-ALL', fmtCount(allZonesExLost.length));
  setZoneBreakdown('msub-ALL', summarize(noZoneFilter));   // breakdown still shows the Lost count

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
  el.textContent = s.lead.count + ' Leads \u00B7 ' + s.enquiry.count + ' Enq \u00B7 ' +
                   s.hotcase.count + ' Hot \u00B7 ' + s.order.count + ' Ord \u00B7 ' + s.lost.count + ' Lost';
}

function updateStatusBanners(summary) {
  countUp('stTotal', summary.total.count);
  countUp('stLead',  summary.lead.count);
  countUp('stEnq',   summary.enquiry.count);
  countUp('stHot',   summary.hotcase.count);
  countUp('stOrder', summary.order.count);
  countUp('stLost',  summary.lost.count);

  setBannerMetrics('stTotal', summary.total);
  setBannerMetrics('stLead',  summary.lead);
  setBannerMetrics('stEnq',   summary.enquiry);
  setBannerMetrics('stHot',   summary.hotcase);
  setBannerMetrics('stOrder', summary.order);
  setBannerMetrics('stLost',  summary.lost);
}

function setBannerMetrics(prefix, bucket) {
  bucket = bucket || {};
  var tonnage = Number(bucket.tonnage) || 0;
  var value = Number(bucket.value) || 0;

  var tonEl = document.getElementById(prefix + 'Tonnage');
  var valEl = document.getElementById(prefix + 'Value');
  if (tonEl) tonEl.textContent = fmtTonnageCompact(tonnage) + ' MT';
  if (valEl) valEl.textContent = fmtCr(value);
}

/* ================= BANNER CLICK -> DRILL MODAL ================= */
var STAGE_LABELS = { total: 'Total', lead: 'Leads', enquiry: 'Enquiries', hotcase: 'Hot Cases', order: 'Orders Received', lost: 'Lost' };
var STAGE_ALIASES = { enquire: 'enquiry' };
var STAGE_QUAD_IDS = { lead: 'qcLead', enquiry: 'qcEnquire', hotcase: 'qcHot', order: 'qcOrder', lost: 'qcLost' };

function setMetric(metric) {
  metric = STAGE_ALIASES[metric] || metric;
  if (!STAGE_LABELS[metric]) return;

  var quadId = STAGE_QUAD_IDS[metric];
  if (quadId) {
    var el = document.getElementById(quadId);
    if (el) {
      el.style.transition = 'box-shadow .2s';
      el.style.boxShadow = '0 0 0 2px var(--p3)';
      setTimeout(function () { el.style.boxShadow = 'none'; }, 700);
    }
  }

  openDrillModal(metric);
}

var STAGE_FILTER_BUCKETS = { total: true, enquiry: true, lost: true };
var MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtClosureMonth(ym) {
  if (!ym) return '-';
  var p = String(ym).split('-');
  var m = parseInt(p[1], 10);
  if (!p[0] || isNaN(m) || m < 1 || m > 12) return '-';
  return MONTH_NAMES[m - 1] + ' ' + p[0];
}

function openDrillModal(stageBucket) {
  var base = getFilteredRecords();
  

  
  CURRENT_DRILL_RECORDS = (stageBucket === 'total')
    ? base
    : base.filter(function (r) { return r.stageBucket === stageBucket; });

  document.getElementById('drillModalTitle').textContent = STAGE_LABELS[stageBucket];

  populateDrillFilterOptions(CURRENT_DRILL_RECORDS);
  document.getElementById('drillSearch').value = '';
  document.getElementById('drillZoneFilter').value = 'ALL';
  document.getElementById('drillSegmentFilter').value = 'ALL';
  document.getElementById('drillSalesmanFilter').value = 'ALL';
  document.getElementById('drillStageFilter').value = 'ALL';
  document.getElementById('drillMonthFilter').value = '';

  // Stage filter only for Total, Enquiries (Enquiry / Active Enquiry) and Lost (Lost / Dormant / Converted to RCC)
  document.getElementById('drillStageFilter').style.display = STAGE_FILTER_BUCKETS[stageBucket] ? '' : 'none';

  renderDrillTable(CURRENT_DRILL_RECORDS);
  document.getElementById('drillModal').style.display = 'flex';
}

function closeDrillModal() {
  document.getElementById('drillModal').style.display = 'none';
}

function populateDrillFilterOptions(records) {
  fillSelect('drillZoneFilter', uniqueSorted(records, 'zone'), 'All Zones');
  fillSelect('drillSegmentFilter', uniqueSorted(records, 'segment'), 'All Sectors');
  fillSelect('drillSalesmanFilter', uniqueSorted(records, 'salesman'), 'All Salesmen');
  fillSelect('drillStageFilter', uniqueSorted(records, 'stage'), 'All Stages');
}

function uniqueSorted(records, field) {
  var seen = {};
  records.forEach(function (r) { if (r[field]) seen[r[field]] = true; });
  return Object.keys(seen).sort();
}

function fillSelect(id, values, allLabel) {
  var el = document.getElementById(id);
  el.innerHTML = '<option value="ALL">' + allLabel + '</option>' +
    values.map(function (v) { return '<option value="' + v + '">' + v + '</option>'; }).join('');
}

function applyDrillFilters() {
  var search = document.getElementById('drillSearch').value.trim().toLowerCase();
  var zone = document.getElementById('drillZoneFilter').value;
  var segment = document.getElementById('drillSegmentFilter').value;
  var salesman = document.getElementById('drillSalesmanFilter').value;
  var stage = document.getElementById('drillStageFilter').value;
  var month = document.getElementById('drillMonthFilter').value;

  var filtered = CURRENT_DRILL_RECORDS.filter(function (r) {
    if (zone !== 'ALL' && r.zone !== zone) return false;
    if (segment !== 'ALL' && r.segment !== segment) return false;
    if (salesman !== 'ALL' && r.salesman !== salesman) return false;
    if (stage !== 'ALL' && r.stage !== stage) return false;
    if (month && r.closureMonth !== month) return false;
    if (search) {
      var hay = ((r.projectName || '') + ' ' + (r.clientName || '')).toLowerCase();
      if (hay.indexOf(search) === -1) return false;
    }
    return true;
  });

  renderDrillTable(filtered);
}

function renderDrillTable(records) {
  var body = document.getElementById('drillTableBody');
  body.innerHTML = records.map(function (r, idx) {
    return (
      '<tr>' +
        '<td>' + (idx + 1) + '</td>' +
        '<td>' + (r.projectName || '-') + '</td>' +
        '<td>' + (r.clientName || '-') + '</td>' +
        '<td>' + (r.segment || '-') + '</td>' +
        '<td>' + (r.zone || '-') + '</td>' +
        '<td>' + (r.salesman || '-') + '</td>' +
        '<td>' + (r.stage || '-') + '</td>' +
        '<td>' + fmtClosureMonth(r.closureMonth) + '</td>' +
        '<td>' + fmtTonnage(r.tonnage) + '</td>' +
        '<td>' + fmtCr(Number(r.probableValue) || 0) + '</td>' +
      '</tr>'
    );
  }).join('') || '<tr><td colspan="10" style="text-align:center; color:var(--muted); padding:20px;">No records match this filter</td></tr>';

  renderDrillTotals(records);
}

function renderDrillTotals(records) {
  var totalTonnage = 0, totalValue = 0;
  records.forEach(function (r) {
    totalTonnage += Number(r.tonnage) || 0;
    totalValue += Number(r.probableValue) || 0;
  });
  document.getElementById('drillTotalTonnage').textContent = fmtTonnage(totalTonnage);
  document.getElementById('drillTotalValue').textContent = fmtCr(totalValue);
}

/* ================= DONUT (tonnage per stage) ================= */
function buildDonut(summary) {
  var ctx = document.getElementById('donutChart').getContext('2d');
  if (dCh) { dCh.destroy(); }

  var labels = ['Leads', 'Enquiries', 'Hot Cases', 'Orders Received', 'Lost'];
  var data   = [summary.lead.tonnage, summary.enquiry.tonnage, summary.hotcase.tonnage, summary.order.tonnage, summary.lost.tonnage];
  var colors = [METRICS.lead.color, METRICS.enquiry.color, METRICS.hotcase.color, METRICS.order.color, METRICS.lost.color];
  var sum = data.reduce(function (a, b) { return a + b; }, 0);

  var centerTextPlugin = {
    afterDraw: function (chart) {
      var width = chart.width, height = chart.height, c = chart.ctx;
      c.save();
      var fontSize = (height / 120).toFixed(2);
      c.font = "bold " + fontSize * 8 + "px 'Plus Jakarta Sans'";
      c.textBaseline = "middle";
      c.textAlign = "center";
      c.fillStyle = "#101a3a";
      c.fillText(fmtTonnageCompact(sum) + '', width / 2, height / 2);
      c.restore();
    }
  };

  dCh = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{ data: data, backgroundColor: colors, borderWidth: 3, borderColor: '#fff', hoverOffset: 8 }]
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
            var val = d.datasets[0].data[t.index];
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

/* ================= MIDDLE PANELS ================= */
function refreshQuadPanel(filtered, summary) {
  buildMiniBars('barsLead',    filtered, 'lead');
  buildMiniBars('barsEnquire', filtered, 'enquiry');
  buildMiniBars('barsHot',     filtered, 'hotcase');
  buildMiniBars('barsOrder',   filtered, 'order');
  buildMiniBars('barsLost',    filtered, 'lost');
  buildYoyChart(summary, filtered);
}

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

/* ================= JSW vs NON-JSW  (or Previous FY vs Current FY, see COMPARE_MODE) =================
   Still a simulated 80% placeholder: there is no fiscal-year field yet. */
function setYoyChartType(type, btnEl) {
  currentYoyChartType = type;
  var allBtns = document.querySelectorAll('.yoy-toggle-btn');
  allBtns.forEach(function (b) { b.classList.remove('active'); });
  btnEl.classList.add('active');

  var recs = getFilteredRecords();
  buildYoyChart(summarize(recs), recs);
}

/* ===== COMPARISON CHART SWITCH =====
   'JSW' -> JSW vs Non-JSW (segment id 4 = JSW, every other segment = Non-JSW)
   'FY'  -> Previous FY vs Current FY (original behaviour, placeholder 80% previous)
   To go back to Previous FY / Current FY, change ONLY the next line to 'FY'. */
var COMPARE_MODE = 'JSW';
var JSW_SEGMENT_ID = 4;

function buildYoyChart(summary, records) {
  var labels  = ['Leads', 'Enquiries', 'Hot Cases', 'Orders Received', 'Lost'];
  var keys    = ['lead', 'enquiry', 'hotcase', 'order', 'lost'];
  var firstLabel, secondLabel, firstData, secondData, firstColor, secondColor, titleText;

  if (COMPARE_MODE === 'JSW') {
    var jsw = {}, non = {};
    keys.forEach(function (k) { jsw[k] = 0; non[k] = 0; });
    (records || []).forEach(function (r) {
      if (!jsw.hasOwnProperty(r.stageBucket)) return;
      var t = Number(r.tonnage) || 0;
      if (Number(r.segmentId) === JSW_SEGMENT_ID) { jsw[r.stageBucket] += t; } else { non[r.stageBucket] += t; }
    });
    firstLabel = 'JSW';      firstData  = keys.map(function (k) { return jsw[k]; }); firstColor  = '#c9d6fb';
    secondLabel = 'Non-JSW'; secondData = keys.map(function (k) { return non[k]; }); secondColor = '#2f57c9';
    titleText = 'JSW vs Non-JSW (MT)';
  } else {
    var current = [summary.lead.tonnage, summary.enquiry.tonnage, summary.hotcase.tonnage, summary.order.tonnage, summary.lost.tonnage];
    firstLabel = 'Previous FY'; firstData  = current.map(function (v) { return Math.round(v * 0.8); }); firstColor  = '#c9d6fb';
    secondLabel = 'Current FY'; secondData = current; secondColor = '#2f57c9';
    titleText = 'Previous FY vs Current FY';
  }
  var titleEl = document.getElementById('yoyTitle');
  if (titleEl) titleEl.textContent = titleText;

  var ctx = document.getElementById('yoyChart').getContext('2d');
  if (yoyCh) { yoyCh.destroy(); }

  var isLine = currentYoyChartType === 'line';
  var datasets;
  if (isLine) {
    datasets = [
      { label: firstLabel, data: firstData, borderColor: firstColor, backgroundColor: 'rgba(201,214,251,0.15)', borderWidth: 2, pointRadius: 3, pointBackgroundColor: firstColor, pointBorderColor: '#fff', pointBorderWidth: 1, fill: false, lineTension: 0.3 },
      { label: secondLabel, data: secondData, borderColor: secondColor, backgroundColor: 'rgba(47,87,201,0.15)', borderWidth: 2, pointRadius: 3, pointBackgroundColor: secondColor, pointBorderColor: '#fff', pointBorderWidth: 1, fill: false, lineTension: 0.3 }
    ];
  } else {
    datasets = [
      { label: firstLabel, data: firstData, backgroundColor: firstColor },
      { label: secondLabel, data: secondData, backgroundColor: secondColor }
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

/* ================= PAGE INIT ================= */
window.initSalesCrmDashboard = function () {
  $('#drillSearch').on('input', applyDrillFilters);
  $('#drillZoneFilter, #drillSegmentFilter, #drillSalesmanFilter, #drillStageFilter').on('change', applyDrillFilters);
  $('#drillMonthFilter').on('input change', applyDrillFilters);
  $('#drillMonthClear').on('click', function () { $('#drillMonthFilter').val(''); applyDrillFilters(); });
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