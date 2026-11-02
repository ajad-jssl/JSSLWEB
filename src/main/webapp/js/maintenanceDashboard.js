// ===== MAINTENANCE DASHBOARD JS =====
// STATUS: 1=Open, 2=Assigned, 3=InProgress, 4=Fixed, 5=Closed
// WIP = statuses 2,3,4  |  Closed = status 5

var summaryByMachine   = [];
var summaryByCategory  = [];
var grandSummary       = {};
var dCh = null, bCh   = null;
var activeCategoryId   = null;
var activeCategoryName = 'All Categories';

var STATUS_LABEL = { '1':'Open','2':'Assigned','3':'In Progress','4':'Fixed','5':'Closed' };
var STATUS_BADGE = { '1':'b-open','2':'b-wip','3':'b-wip','4':'b-wip','5':'b-cls' };

var BAR_OPEN     = '#FF8A65';
var BAR_WIP      = '#87CEEB';
var BAR_CLOSED   = '#66BB6A';
var BAR_ASSIGNED = '#FFD54F';
var DONUT_COLORS = [BAR_OPEN, BAR_WIP, BAR_CLOSED];
var CAT_COLORS   = ['#1565C0','#E65100','#6A1B9A','#2E7D32','#C62828','#00838F','#AD1457','#4E342E'];

var CARD_MAP_RAW = { 'side loader':'ADV', 'eot crane':'DC', 'cnc machines':'STEEL' };
function getCardKey(desc) {
  return CARD_MAP_RAW[(desc || '').trim().toLowerCase()] || null;
}

// =====================================================
// HELPERS
// =====================================================
function set(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; }
function w(id, pct)   { var e = document.getElementById(id); if (e) e.style.width = Math.min(pct, 100) + '%'; }

function count(id, target) {
  var el = document.getElementById(id); if (!el) return;
  var cur = 0, step = Math.max(1, Math.ceil(target / 30));
  var t = setInterval(function () {
    cur = Math.min(cur + step, target); el.textContent = cur;
    if (cur >= target) clearInterval(t);
  }, 30);
}

function getFactoryParam() {
  var val = $('.regionFilter:checked').val();
  return (!val || val === 'ALL') ? '' : val;
}
function getDateParams() {
  var from = $('#dateFrom').val(), to = $('#dateTo').val(), p = '';
  if (from) p += '&dateFrom=' + encodeURIComponent(from);
  if (to)   p += '&dateTo='   + encodeURIComponent(to);
  return p;
}
function getCatColor(name, idx) { return CAT_COLORS[idx % CAT_COLORS.length]; }
function fmtHM(hrs) {
  hrs = hrs || 0;
  var totalMin = Math.round(hrs * 60);
  return Math.floor(totalMin / 60) + 'h ' + (totalMin % 60) + 'm';
}

// =====================================================
// LOAD DATA  — always fetches all 3 summary APIs.
// Bar-chart data is fetched separately by loadBarChart().
// =====================================================
function loadData() {
  var fParam    = getFactoryParam(), dParam = getDateParams();
  var machine   = $('#machineSelect').val() || '';
  var machParam = machine ? '&machineSubcode=' + encodeURIComponent(machine) : '';
  var base      = '?1=1' + (fParam ? '&factoryId=' + fParam : '') + dParam + machParam;

  Promise.all([
    fetch(baseUrl + '/api/maintenance/tickets/summary/grand-total' + base, { method: 'GET', credentials: 'include' }).then(function (r) { return r.json(); }),
    fetch(baseUrl + '/api/maintenance/tickets/summary/by-category'  + base, { method: 'GET', credentials: 'include' }).then(function (r) { return r.json(); })
  ])
  .then(function (results) {
    grandSummary      = results[0] || {};
    summaryByCategory = results[1] || [];

    // If active category no longer exists in new data, reset to All
    if (activeCategoryId !== null) {
      var ok = summaryByCategory.some(function (c) { return c.machineDescId == activeCategoryId; });
      if (!ok) { activeCategoryId = null; activeCategoryName = 'All Categories'; }
    }

    updateModuleCards();

    if (activeCategoryId === null) {
      // ALL view
      set('typeLabel', 'All Categories');
      var g = grandSummary;
      updateStatusBanners(g.totalCount || 0, g.openCount || 0, g.wipCount || 0, g.closedCount || 0, g.totalDowntimeHours || 0);
      buildCategoryDonut(summaryByCategory);
    } else {
      // Category drill-down view
      applyCategoryStats(activeCategoryId, activeCategoryName);
    }

    // Always load bar chart (will use activeCategoryId if set)
    loadBarChart();
    loadBrokeCauses();
  })
  .catch(function (err) { console.error('Maintenance data error:', err); });
}

// =====================================================
// MACHINE DROPDOWN
// =====================================================
function populateMachineDropdown() {
  var fParam = getFactoryParam();
  var url    = new URL('/api/maintenance/machines/list', baseUrl).toString() + '?category=';
  if (fParam) url += '&factoryId=' + fParam;
  $.ajax({ url: url, type: 'GET', xhrFields: { withCredentials: true } })
    .then(function (response) {
      var $sel = $('#machineSelect'), prevVal = $sel.val();
      $sel.empty().append('<option value="">All Machines</option>');
      if (response && response.Data) {
        response.Data.forEach(function (m) {
          $('<option>', { value: m.machineSubcode, text: m.machineSubcode }).appendTo($sel);
        });
      }
      if (prevVal) $sel.val(prevVal);
    })
    .fail(function () { $('#machineSelect').empty().append('<option value="">All Machines</option>'); });
}

// =====================================================
// MODULE CARDS
// =====================================================
function updateModuleCards() {
  count('mc-ALL', grandSummary.totalCount || 0);
  count('mc-ADV', 0); count('mc-DC', 0); count('mc-STEEL', 0);
  set('mc-ADV-dt',   'Downtime 0h 0m / Manhours 0h 0m');
  set('mc-DC-dt',    'Downtime 0h 0m / Manhours 0h 0m');
  set('mc-STEEL-dt', 'Downtime 0h 0m / Manhours 0h 0m');

  summaryByCategory.forEach(function (cat) {
    var key = getCardKey(cat.machineDescription);
    if (key) {
      count('mc-' + key, cat.totalCount || 0);
      set('mc-' + key + '-dt',
        'Downtime ' + fmtHM(cat.totalDowntimeHours) + ' / Manhours ' + fmtHM(cat.totalManHours));
    }
  });

  $('.mod').removeClass('active');
  if (activeCategoryId === null) {
    $('.mod.m-all').addClass('active');
  } else {
    var ac = summaryByCategory.filter(function (c) { return c.machineDescId == activeCategoryId; })[0];
    if (ac) {
      var k = getCardKey(ac.machineDescription);
      if (k === 'ADV')   $('.mod.m-adv').addClass('active');
      if (k === 'DC')    $('.mod.m-dc').addClass('active');
      if (k === 'STEEL') $('.mod.m-stl').addClass('active');
    }
  }
}

// =====================================================
// goType — triggered by module card clicks
// =====================================================
function goType(type, el) {
  if (type === 'ALL') {
    activeCategoryId   = null;
    activeCategoryName = 'All Categories';
    // Reset to All view without full reload
    set('typeLabel', 'All Categories');
    var g = grandSummary;
    updateStatusBanners(g.totalCount || 0, g.openCount || 0, g.wipCount || 0, g.closedCount || 0, g.totalDowntimeHours || 0);
    buildCategoryDonut(summaryByCategory);
    updateModuleCards();
    loadBarChart();   // re-fetch bar with no category filter
    return;
  }

  var nameLookup = { 'ADVANCED': 'Side Loader', 'DELIVERY_CHALLAN': 'EOT Crane', 'STEEL': 'CNC Machines' };
  var catName    = nameLookup[type];

  var cat = summaryByCategory.filter(function (c) {
    return (c.machineDescription || '').trim().toLowerCase() === catName.toLowerCase();
  })[0];

  if (!cat) {
    console.warn('goType: no match for', catName, '| available:', summaryByCategory.map(function (c) { return c.machineDescription; }));
    activeCategoryId   = 'NONE_' + type;
    activeCategoryName = catName;
    set('typeLabel', catName);
    updateStatusBanners(0, 0, 0, 0, 0);
    buildStatusDonut({ openCount: 0, wipCount: 0, closedCount: 0, totalDowntimeHours: 0 }, catName);
    setBarSubtitle('No data');
    buildBar([], 'No data');
    updateModuleCards();
    return;
  }

  activeCategoryId   = cat.machineDescId;
  activeCategoryName = catName;

  applyCategoryStats(activeCategoryId, activeCategoryName);
  updateModuleCards();
  loadBarChart();   // ← KEY FIX: always re-fetch bar from API with category filter
}

// =====================================================
// APPLY CATEGORY STATS (donut + banners only, no bar)
// =====================================================
function applyCategoryStats(catId, catName) {
  var cat = summaryByCategory.filter(function (c) { return c.machineDescId == catId; })[0] || {};
  set('typeLabel', catName);
  updateStatusBanners(
    cat.totalCount || 0, cat.openCount || 0,
    cat.wipCount   || 0, cat.closedCount || 0,
    cat.totalDowntimeHours || 0
  );
  buildStatusDonut(cat, catName);
}

// =====================================================
// LOAD BAR CHART — always fetches fresh from API
// Uses activeCategoryId to filter if set
// =====================================================
function loadBarChart() {
  var fParam    = getFactoryParam(), dParam = getDateParams();
  var machine   = $('#machineSelect').val() || '';
  var machParam = machine ? '&machineSubcode=' + encodeURIComponent(machine) : '';
  var catParam  = (activeCategoryId !== null && String(activeCategoryId).indexOf('NONE_') !== 0)
                  ? '&machineDescId=' + encodeURIComponent(activeCategoryId)
                  : '';

  var base = '?1=1'
    + (fParam ? '&factoryId=' + fParam : '')
    + dParam
    + machParam
    + catParam;

  var subtitle = activeCategoryId === null
    ? 'All categories'
    : activeCategoryName + ' - by machine';

  setBarSubtitle(subtitle);

  fetch(baseUrl + '/api/maintenance/tickets/summary/by-machine' + base, { method: 'GET', credentials: 'include' })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      summaryByMachine = data || [];
      buildBar(summaryByMachine, subtitle);
    })
    .catch(function (err) {
      console.error('Bar chart load error:', err);
      buildBar([], subtitle);
    });
}

// =====================================================
// STATUS BANNERS
// =====================================================
function updateStatusBanners(tot, opn, wip, cls, hrs) {
  var pO = tot ? Math.round(opn / tot * 100) : 0;
  var pW = tot ? Math.round(wip / tot * 100) : 0;
  var pC = tot ? Math.round(cls / tot * 100) : 0;
  count('stTotal', tot); count('stOpen', opn); count('stWip', wip); count('stClosed', cls);
  set('stTotalHrs', (hrs || 0).toFixed(1) + 'h downtime');
  set('stOpenP',   pO + '% of total');
  set('stWipP',    pW + '% of total');
  set('stClosedP', pC + '% of total');
  setTimeout(function () { w('sp-open', pO); w('sp-wip', pW); w('sp-closed', pC); }, 440);
}

// =====================================================
// BAR CHART SUBTITLE — targets only the bar chart's .ch-sub
// =====================================================
function setBarSubtitle(text) {
  // The bar chart is the 3rd .ch panel — target it specifically
  var barPanel = document.getElementById('barChart');
  if (!barPanel) return;
  var chEl = barPanel.closest ? barPanel.closest('.ch') : null;
  // Fallback: walk up manually
  if (!chEl) {
    var p = barPanel.parentNode;
    while (p && !p.classList.contains('ch')) p = p.parentNode;
    chEl = p;
  }
  if (chEl) {
    var sub = chEl.querySelector('.ch-sub');
    if (sub) sub.textContent = text;
  }
}

// =====================================================
// DONUT CENTRE LABEL
// =====================================================
function drawDonutCentre(c2, cx, cy, totalAll) {
  c2.save();
  c2.font = '600 10px "Plus Jakarta Sans",Segoe UI,sans-serif';
  c2.textBaseline = 'middle'; c2.textAlign = 'center';
  c2.fillStyle = '#5c7a5c';
  c2.fillText('Total Tickets', cx, cy - 20);
  c2.font = 'bold 28px "Plus Jakarta Sans",Segoe UI,sans-serif';
  c2.fillStyle = '#1c2e1c';
  c2.fillText(totalAll, cx, cy + 4);
  c2.font = '10px "Plus Jakarta Sans",Segoe UI,sans-serif';
  c2.fillStyle = '#5c7a5c';
  c2.fillText('tickets', cx, cy + 22);
  c2.restore();
}

// =====================================================
// DONUT — ALL CATEGORIES VIEW
// =====================================================
function buildCategoryDonut(cats) {
  var ctx = document.getElementById('donutChart');
  if (!ctx) return;
  if (dCh) { dCh.destroy(); dCh = null; }
  ctx = ctx.getContext('2d');

  var lbls     = cats.map(function (c) { return c.machineDescription || 'Unknown'; });
  var totCt    = cats.map(function (c) { return c.totalCount || 0; });
  var cols     = lbls.map(function (l, i) { return getCatColor(l, i); });
  var totalAll = totCt.reduce(function (a, b) { return a + b; }, 0) || 1;

  dCh = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: lbls,
      datasets: [{ data: totCt, backgroundColor: cols, borderWidth: 3, borderColor: '#fff', hoverOffset: 4 }]
    },
    options: {
      cutoutPercentage: 60,
      legend: { display: false },
      layout: { padding: { top: 90, bottom: 80, left: 110, right: 110 } },
      responsive: true, maintainAspectRatio: false,
      animation: { animateRotate: true, duration: 700 },
      tooltips: { enabled: false },
      hover: { mode: null },
      onClick: function (evt, items) {
        if (!items || !items.length) return;
        var cat = cats[items[0]._index]; if (!cat) return;
        var key = getCardKey(cat.machineDescription);
        var tm  = { 'ADV': 'ADVANCED', 'DC': 'DELIVERY_CHALLAN', 'STEEL': 'STEEL' };
        if (key) goType(tm[key], null);
      }
    },
    plugins: [buildCategoryDonutLabelPlugin(lbls, totCt, cols, totalAll, cats)]
  });

  buildDonutLegend(lbls, totCt, cols, totalAll, cats, true);
}

// =====================================================
// DONUT — SINGLE CATEGORY STATUS VIEW
// =====================================================
function buildStatusDonut(cat, catName) {
  var ctx = document.getElementById('donutChart');
  if (!ctx) return;
  if (dCh) { dCh.destroy(); dCh = null; }
  ctx = ctx.getContext('2d');

  var lbls     = ['Open', 'In Progress', 'Closed'];
  var totCt    = [cat.openCount || 0, cat.wipCount || 0, cat.closedCount || 0];
  var cols     = DONUT_COLORS;
  var totalAll = totCt.reduce(function (a, b) { return a + b; }, 0) || 1;

  dCh = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: lbls,
      datasets: [{ data: totCt, backgroundColor: cols, borderWidth: 3, borderColor: '#fff', hoverOffset: 4 }]
    },
    options: {
      cutoutPercentage: 60,
      legend: { display: false },
      layout: { padding: { top: 100, bottom: 100, left: 120, right: 120 } },
      responsive: true, maintainAspectRatio: false,
      animation: { animateRotate: true, duration: 700 },
      tooltips: { enabled: false },
      hover: { mode: null }
    },
    plugins: [buildInsideDonutLabelPlugin(lbls, totCt, cols, totalAll)]
  });

  buildDonutLegend(lbls, totCt, cols, totalAll, null, false);
}

// =====================================================
// DONUT LABEL PLUGIN — Category view
// =====================================================
function buildCategoryDonutLabelPlugin(lbls, totCt, cols, totalAll, cats) {
  return {
    afterDraw: function (chart) {
      var c2 = chart.ctx;
      var cx = chart.width / 2, cy = chart.height / 2;
      drawDonutCentre(c2, cx, cy, totalAll);

      var meta = chart.getDatasetMeta(0);
      if (!meta || !meta.data || !meta.data.length) return;

      meta.data.forEach(function (arc, i) {
        var val = totCt[i]; if (val === 0) return;
        var model      = arc._model || arc;
        var sliceAngle = model.endAngle - model.startAngle;
        if (sliceAngle < 0.10) return;

        var midAngle = (model.startAngle + model.endAngle) / 2;
        var pct      = Math.round(val / totalAll * 100);
        var cat      = cats ? cats[i] : null;
        var edgeR    = model.outerRadius;
        var elbowR   = edgeR + 22;
        var elx      = cx + Math.cos(midAngle) * elbowR;
        var ely      = cy + Math.sin(midAngle) * elbowR;
        var ex       = cx + Math.cos(midAngle) * edgeR;
        var ey       = cy + Math.sin(midAngle) * edgeR;
        var isRight  = Math.cos(midAngle) >= 0;
        var horizLen = 32;
        var lineEndX = isRight ? elx + horizLen : elx - horizLen;
        var lx       = isRight ? lineEndX + 4 : lineEndX - 4;
        var textAlign = isRight ? 'left' : 'right';
        ely = Math.max(14, Math.min(chart.height - 10, ely));

        c2.save();
        c2.beginPath(); c2.moveTo(ex, ey); c2.lineTo(elx, ely); c2.lineTo(lineEndX, ely);
        c2.strokeStyle = cols[i]; c2.lineWidth = 1.3; c2.globalAlpha = 0.8; c2.setLineDash([]); c2.stroke();
        c2.beginPath(); c2.arc(elx, ely, 2.5, 0, 2 * Math.PI);
        c2.fillStyle = cols[i]; c2.globalAlpha = 1; c2.fill();

        c2.font = 'bold 10px "Plus Jakarta Sans",Segoe UI,sans-serif';
        c2.fillStyle = '#222'; c2.textAlign = textAlign; c2.textBaseline = 'bottom'; c2.globalAlpha = 1;
        c2.fillText(lbls[i], lx, ely - 1);

        c2.font = '600 9px "Plus Jakarta Sans",Segoe UI,sans-serif';
        c2.fillStyle = cols[i]; c2.textBaseline = 'top';
        c2.fillText(val + '  (' + pct + '%)', lx, ely + 2);

        if (cat) {
          c2.font = '8px "Plus Jakarta Sans",Segoe UI,sans-serif'; c2.fillStyle = '#888'; c2.textBaseline = 'top';
          c2.fillText('O:' + (cat.openCount || 0) + ' W:' + (cat.wipCount || 0) + ' C:' + (cat.closedCount || 0), lx, ely + 13);
        }
        c2.restore();
      });
    }
  };
}

// =====================================================
// DONUT LABEL PLUGIN — Status view
// =====================================================
function buildInsideDonutLabelPlugin(lbls, totCt, cols, totalAll) {
  return {
    afterDraw: function (chart) {
      var c2 = chart.ctx;
      var cx = chart.width / 2, cy = chart.height / 2;
      drawDonutCentre(c2, cx, cy, totalAll);

      var meta = chart.getDatasetMeta(0);
      if (!meta || !meta.data || !meta.data.length) return;

      meta.data.forEach(function (arc, i) {
        var val = totCt[i]; if (val === 0) return;
        var model      = arc._model || arc;
        var sliceAngle = model.endAngle - model.startAngle;
        if (sliceAngle < 0.15) return;

        var midAngle = (model.startAngle + model.endAngle) / 2;
        var pct      = Math.round(val / totalAll * 100);
        var edgeR    = model.outerRadius;
        var ex       = cx + Math.cos(midAngle) * edgeR;
        var ey       = cy + Math.sin(midAngle) * edgeR;
        var elbowR   = edgeR + 18;
        var elx      = cx + Math.cos(midAngle) * elbowR;
        var ely      = cy + Math.sin(midAngle) * elbowR;
        var textR    = elbowR + 14;
        var tx       = cx + Math.cos(midAngle) * textR;
        var isRight  = Math.cos(midAngle) >= 0;
        var lineEndX = isRight ? tx + 24 : tx - 24;

        c2.save();
        c2.beginPath(); c2.moveTo(ex, ey); c2.lineTo(elx, ely); c2.lineTo(lineEndX, ely);
        c2.strokeStyle = cols[i]; c2.lineWidth = 1.2; c2.globalAlpha = 0.75; c2.stroke();
        c2.beginPath(); c2.arc(elx, ely, 2.5, 0, 2 * Math.PI);
        c2.fillStyle = cols[i]; c2.globalAlpha = 0.9; c2.fill();
        c2.globalAlpha = 1;

        var lx        = isRight ? lineEndX + 4 : lineEndX - 4;
        var textAlign = isRight ? 'left' : 'right';

        c2.font = 'bold 10px "Plus Jakarta Sans",Segoe UI,sans-serif';
        c2.fillStyle = '#222'; c2.textAlign = textAlign; c2.textBaseline = 'bottom';
        c2.fillText(lbls[i], lx, ely - 1);

        c2.font = '600 9px "Plus Jakarta Sans",Segoe UI,sans-serif';
        c2.fillStyle = cols[i]; c2.textBaseline = 'top';
        c2.fillText(val + '  (' + pct + '%)', lx, ely + 2);
        c2.restore();
      });
    }
  };
}

// =====================================================
// DONUT LEGEND
// =====================================================
function buildDonutLegend(lbls, totCt, cols, totalAll, cats, clickable) {
  var $leg = $('#donutLegend'); $leg.empty();
  lbls.forEach(function (name, i) {
    var pct        = Math.round(totCt[i] / totalAll * 100);
    var cat        = cats ? cats[i] : null;
    var detailHtml = cat
      ? '<span class="dl-detail">O:' + (cat.openCount || 0) + ' W:' + (cat.wipCount || 0) + ' C:' + (cat.closedCount || 0) + '</span>'
      : '';
    var $row = $('<div class="dl-row">');
    $row.html(
      '<div class="dl-l">' +
        '<span class="dl-dot" style="background:' + cols[i] + '"></span>' +
        '<span class="dl-nm">' + name + '</span>' + detailHtml +
      '</div>' +
      '<span class="dl-v" style="color:' + cols[i] + '">' + totCt[i] + ' (' + pct + '%)</span>'
    );
    if (clickable && cats) {
      $row.css('cursor', 'pointer');
      $row.on('click', function () {
        var c = cats[i]; if (!c) return;
        var key = getCardKey(c.machineDescription);
        var tm  = { 'ADV': 'ADVANCED', 'DC': 'DELIVERY_CHALLAN', 'STEEL': 'STEEL' };
        if (key) goType(tm[key], null);
      });
    }
    $leg.append($row);
  });
}

// =====================================================
// BAR CHART
// =====================================================
function buildBar(machines, subtitle) {
  machines = machines.slice().sort(function (a, b) {
    return (b.totalDowntimeHours || 0) - (a.totalDowntimeHours || 0);
  });

  setBarSubtitle(subtitle);

  var ctx = document.getElementById('barChart');
  if (!ctx) return;
  ctx = ctx.getContext('2d');
  if (bCh) { bCh.destroy(); bCh = null; }

  var labs = [], openDT = [], assignedDT = [], wipDT = [], closedDT = [];
  var openCts = [], wipCts = [], clsCts = [], totArr = [];

  machines.forEach(function (m) {
    labs.push(m.machineSubcode);
    totArr.push(m.totalCount || 0);
    openCts.push(m.openCount || 0);
    wipCts.push(m.wipCount   || 0);
    clsCts.push(m.closedCount || 0);
    openDT.push(+(m.openDowntimeHours      || 0).toFixed(2));
    assignedDT.push(+(m.assignedDowntimeHours || 0).toFixed(2));
    wipDT.push(+(m.wipDowntimeHours        || 0).toFixed(2));
    closedDT.push(+(m.closedDowntimeHours  || 0).toFixed(2));
  });

  var DS_COLORS   = [BAR_OPEN, BAR_ASSIGNED, BAR_WIP, BAR_CLOSED];
  var MIN_INSIDE_H = 14;

  var insideLabelPlugin = {
    afterDatasetsDraw: function (chart) {
      var c2 = chart.ctx;
      var outsideLabels = labs.map(function () { return []; });

      chart.data.datasets.forEach(function (dataset, dsIdx) {
        var meta = chart.getDatasetMeta(dsIdx);
        if (meta.hidden) return;
        var segColor = DS_COLORS[dsIdx] || '#888';

        meta.data.forEach(function (bar, idx) {
          var model = bar._model || bar;
          var barH  = model.base - model.y;
          var val   = dataset.data[idx];
          if (!val) return;

          if (barH >= MIN_INSIDE_H) {
            var cy = model.y + barH / 2;
            var fs = Math.max(8, Math.min(11, barH / 3));
            c2.save();
            c2.textAlign = 'center'; c2.textBaseline = 'middle';
            c2.shadowColor = 'rgba(0,0,0,0.30)'; c2.shadowBlur = 2;
            c2.font = 'bold ' + fs + 'px "Plus Jakarta Sans",Segoe UI,sans-serif';
            c2.fillStyle = '#fff';
            c2.fillText(val.toFixed(1) + 'h', model.x, cy);
            c2.restore();
          } else {
            outsideLabels[idx].push({ segTopY: model.y, val: val, color: segColor });
          }
        });
      });

      var lastDs = chart.data.datasets.length - 1;
      var meta0  = chart.getDatasetMeta(lastDs);
      if (!meta0) return;

      meta0.data.forEach(function (bar, idx) {
        var model = bar._model || bar;
        var topY  = model.base;

        chart.data.datasets.forEach(function (ds, di) {
          var m2 = chart.getDatasetMeta(di);
          if (!m2.hidden && m2.data[idx]) {
            var y2 = (m2.data[idx]._model || m2.data[idx]).y;
            if (y2 < topY) topY = y2;
          }
        });

        var totalVal = (openDT[idx] || 0) + (assignedDT[idx] || 0) + (wipDT[idx] || 0) + (closedDT[idx] || 0);
        if (!totalVal) return;

        c2.save();
        c2.font = 'bold 10px "Plus Jakarta Sans",Segoe UI,sans-serif';
        c2.textAlign = 'center'; c2.textBaseline = 'bottom'; c2.fillStyle = '#333';
        c2.fillText(totalVal.toFixed(1) + 'h | ' + totArr[idx] + ' tkts', model.x, topY - 5);
        c2.restore();

        var outside = outsideLabels[idx];
        if (!outside || !outside.length) return;
        outside.sort(function (a, b) { return a.segTopY - b.segTopY; });
        outside.forEach(function (item) {
          c2.save();
          c2.textAlign = 'center'; c2.textBaseline = 'middle';
          c2.shadowColor = 'rgba(0,0,0,0.55)'; c2.shadowBlur = 3;
          c2.font = 'bold 8px "Plus Jakarta Sans",Segoe UI,sans-serif';
          c2.fillStyle = '#fff';
          c2.fillText(item.val.toFixed(1) + 'h', model.x, item.segTopY + 7);
          c2.restore();
        });
      });
    }
  };

  bCh = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labs,
      datasets: [
        { label: 'Open Downtime',        data: openDT,     backgroundColor: BAR_OPEN,     stack: 'dt' },
        { label: 'Assigned Downtime',     data: assignedDT, backgroundColor: BAR_ASSIGNED, stack: 'dt' },
        { label: 'In Progress Downtime',  data: wipDT,      backgroundColor: BAR_WIP,      stack: 'dt' },
        { label: 'Closed Downtime',       data: closedDT,   backgroundColor: BAR_CLOSED,   stack: 'dt' }
      ]
    },
    options: {
      layout: { padding: { top: 30 } },
      responsive: true, maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        xAxes: [{
          stacked: true,
          gridLines: { display: false },
          ticks: { fontSize: 10, fontFamily: '"Plus Jakarta Sans",Segoe UI,sans-serif', fontStyle: 'bold', fontColor: '#444' }
        }],
        yAxes: [{
          stacked: true,
          gridLines: { color: '#f0f0f0', zeroLineColor: '#ddd' },
          ticks: {
            min: 0, beginAtZero: true, fontSize: 10,
            fontFamily: '"Plus Jakarta Sans",Segoe UI,sans-serif',
            callback: function (v) { return v + 'h'; }
          },
          scaleLabel: {
            display: true, labelString: 'Downtime Hours', fontSize: 11,
            fontFamily: '"Plus Jakarta Sans",Segoe UI,sans-serif',
            fontColor: '#5c7a5c', fontStyle: 'bold'
          }
        }]
      },
      tooltips: {
        mode: 'index', intersect: false,
        backgroundColor: 'rgba(0,0,0,.88)',
        titleFontSize: 12, bodyFontSize: 11, cornerRadius: 6, xPadding: 12, yPadding: 10,
        callbacks: {
          title: function (t) { return labs[t[0].index]; },
          label: function (t) {
            if (!t.yLabel) return null;
            return t.dataset.label + ': ' + (+t.yLabel).toFixed(1) + 'h';
          },
          afterBody: function (t) {
            var i = t[0].index;
            return [
              '─────────────────',
              'Total Tickets : ' + totArr[i],
              'Open          : ' + openCts[i],
              'Assigned      : ' + (machines[i] ? machines[i].assignedCount || 0 : 0),
              'In Progress   : ' + wipCts[i],
              'Closed        : ' + clsCts[i]
            ];
          }
        }
      },
      onClick: function (evt, items) {
        if (items && items.length) {
          var idx  = items[0]._index;
          var code = machines[idx] ? machines[idx].machineSubcode : null;
          if (code) openDetailPanel(code);
        }
      }
    },
    plugins: [insideLabelPlugin]
  });

  renderBarLegend();
}

function renderBarLegend() {
  var el = document.getElementById('barLegend'); if (!el) return;
  var items = [
    { color: BAR_OPEN,     label: 'Open'        },
    { color: BAR_ASSIGNED, label: 'Assigned'     },
    { color: BAR_WIP,      label: 'In Progress'  },
    { color: BAR_CLOSED,   label: 'Closed'       }
  ];
  el.innerHTML = items.map(function (it) {
    return '<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;color:#5c7a5c;font-weight:600;">' +
      '<span style="width:9px;height:9px;border-radius:2px;background:' + it.color + ';display:inline-block;"></span>' +
      it.label + '</span>';
  }).join('');
}

// =====================================================
// SLIDE-IN DETAIL PANEL
// =====================================================
function openDetailPanel(machineSubcode) {
  var panelEl   = document.getElementById('detailPanel');
  var overlayEl = document.getElementById('dpOverlay');
  if (!panelEl) return;

  var fParam = getFactoryParam(), dParam = getDateParams();
  set('dpTitle', machineSubcode + ' - Tickets');
  set('dpSub', 'Loading...');
  document.getElementById('dpBody').innerHTML =
    '<div class="dp-empty"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
  panelEl.classList.add('open');
  overlayEl.classList.add('open');

  var url = baseUrl + '/api/maintenance/tickets/by-machine?machineSubcode=' + encodeURIComponent(machineSubcode);
  if (fParam) url += '&factoryId=' + fParam;
  url += dParam;

  fetch(url, { method: 'GET', credentials: 'include' })
    .then(function (r) { return r.json(); })
    .then(function (response) {
      var tickets = response.Data || [];
      set('dpSub', tickets.length + ' ticket(s) for ' + machineSubcode);
      tickets.sort(function (a, b) { return (b.downtimeHours || 0) - (a.downtimeHours || 0); });

      var html = '';
      tickets.forEach(function (t, idx) {
        var sc   = (t.status || '').toString().trim();
        var slbl = STATUS_LABEL[sc] || 'Unknown';
        var scls = STATUS_BADGE[sc] || 'b-unk';
        var dt   = t.downtimeHours != null ? parseFloat(t.downtimeHours).toFixed(1) : '0.0';
        var rep  = t.reportedDate  ? new Date(t.reportedDate).toLocaleString()  : '-';
        var mod  = t.modifiedDate  ? new Date(t.modifiedDate).toLocaleString()  : 'Ongoing';
        var rank = idx + 1;
        var pcls = rank === 1 ? 'p1' : rank === 2 ? 'p2' : rank === 3 ? 'p3' : 'px';
        var pHtml = tickets.length > 1
          ? '<span class="prio ' + pcls + '" style="margin-right:6px;" title="Priority ' + rank + ' (by downtime)">P' + rank + '</span>'
          : '';
        html +=
          '<div class="tk">' +
            '<div class="tk-head">' +
              '<div style="display:flex;align-items:center;">' + pHtml +
                '<span class="tk-no"><i class="fas fa-ticket-alt" style="margin-right:4px;font-size:10px;"></i>' + t.ticketNo + '</span>' +
              '</div>' +
              '<span class="tk-badge ' + scls + '">' + slbl + '</span>' +
            '</div>' +
            '<div class="tk-row"><i class="fas fa-user"></i><span class="tk-lbl">Reported By</span><span class="tk-val">'   + (t.empName || t.reportedBy || '-') + '</span></div>' +
            '<div class="tk-row"><i class="fas fa-phone"></i><span class="tk-lbl">Mobile</span><span class="tk-val">'        + (t.mobileNo || '-') + '</span></div>' +
            '<div class="tk-row"><i class="fas fa-wrench"></i><span class="tk-lbl">What Broke</span><span class="tk-val">'  + (t.whatBroke || '-') + '</span></div>' +
            '<div class="tk-row"><i class="fas fa-comment-alt"></i><span class="tk-lbl">Problem</span><span class="tk-val">'+ (t.problemDesc || '-') + '</span></div>' +
            '<div class="tk-row"><i class="fas fa-calendar"></i><span class="tk-lbl">Reported</span><span class="tk-val">'  + rep + '</span></div>' +
            '<div class="tk-row"><i class="fas fa-calendar-check"></i><span class="tk-lbl">Last Updated</span><span class="tk-val">' + mod + '</span></div>' +
            '<div class="tk-dt"><i class="fas fa-clock"></i>' +
              '<div><div class="tk-dt-val">' + dt + ' hrs</div>' +
              '<div class="tk-dt-lbl">Downtime (Reported - ' + (t.modifiedDate ? 'Closed' : 'Now') + ')</div></div>' +
            '</div>' +
          '</div>';
      });
      document.getElementById('dpBody').innerHTML = html ||
        '<div class="dp-empty"><i class="fas fa-check-circle"></i> No tickets found.</div>';
    })
    .catch(function () {
      document.getElementById('dpBody').innerHTML =
        '<div class="dp-empty"><i class="fas fa-exclamation-circle"></i> Failed to load tickets.</div>';
    });
}

function closeDetailPanel() {
  var el = document.getElementById('detailPanel'); if (!el) return;
  el.classList.remove('open');
  document.getElementById('dpOverlay').classList.remove('open');
}

// =====================================================
// DOCUMENT READY
// =====================================================
/*$(document).ready(function () {
  populateMachineDropdown();
  loadData();

  $('.regionFilter').on('change', function () {
    $('.regionFilter').not(this).prop('checked', false);
    if (!$('.regionFilter:checked').length) $('.regionFilter[value="ALL"]').prop('checked', true);
    // Reset category selection on factory change
    activeCategoryId   = null;
    activeCategoryName = 'All Categories';
    populateMachineDropdown();
    loadData();
  });
  $('#machineSelect').on('change', function () { loadData(); });
  $('#btnApplyDate').on('click', function () { loadData(); });
  $('#dateFrom,#dateTo').on('keyup', function (e) { if (e.key === 'Enter') loadData(); });
});*/



var _dashboardStarted = false;
 
window.initInvoiceDashboard = function () {
  if (_dashboardStarted) return;      // run only once
  _dashboardStarted = true;
 
  populateMachineDropdown();
  loadData();
 
  $('.regionFilter').on('change', function () {
    $('.regionFilter').not(this).prop('checked', false);
    if (!$('.regionFilter:checked').length) $('.regionFilter[value="ALL"]').prop('checked', true);
    // Reset category selection on factory change
    activeCategoryId   = null;
    activeCategoryName = 'All Categories';
    populateMachineDropdown();
    loadData();
  });
  $('#machineSelect').on('change', function () { loadData(); });
  $('#btnApplyDate').on('click', function () { loadData(); });
  $('#dateFrom,#dateTo').on('keyup', function (e) { if (e.key === 'Enter') loadData(); });
};

// =====================================================
// INACTIVITY LOGOUT (15 min)
// =====================================================
var _it;
function _ri() {
  clearTimeout(_it);
  _it = setTimeout(function () { logoutUser(new Event('logout')); }, 900000);
}
document.onmousemove = _ri; document.onkeydown = _ri; document.onclick = _ri; document.onscroll = _ri;
_ri();

// =====================================================
// TOP BROKE CAUSES
// =====================================================
var brokeCh      = null;
var brokeData    = { elec: [], mech: [], hydr: [] };
var activeBroCat = 'elec';

var BROKE_PIE_COLORS = {
  elec: ['#1565C0','#1976D2','#1E88E5','#42A5F5','#90CAF9'],
  mech: ['#E65100','#F4511E','#FF7043','#FF8A65','#FFAB91'],
  hydr: ['#00838F','#00897B','#00ACC1','#26C6DA','#80DEEA']
};
var BROKE_TAB_META = {
  elec: { label: 'Electrical', dotClass: 'dot-elec' },
  mech: { label: 'Mechanical', dotClass: 'dot-mech' },
  hydr: { label: 'Hydraulics', dotClass: 'dot-hydr' }
};

function loadBrokeCauses() {
  var fParam = getFactoryParam(), dParam = getDateParams();
  var base   = '?1=1' + (fParam ? '&factoryId=' + fParam : '') + dParam;

  fetch(baseUrl + '/api/maintenance/tickets/top-broke-causes' + base, { method: 'GET', credentials: 'include' })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      brokeData = { elec: data.elec || [], mech: data.mech || [], hydr: data.hydr || [] };
      buildBrokeTabBar();
      renderBrokePieChart(activeBroCat);
    })
    .catch(function (err) { console.error('Broke causes error:', err); });
}

function buildBrokeTabBar() {
  var $bar = $('#brokeTabBar'); $bar.empty();
  ['elec', 'mech', 'hydr'].forEach(function (cat) {
    var meta  = BROKE_TAB_META[cat];
    var items = brokeData[cat] || [];
    var total = items.reduce(function (s, i) { return s + i.count; }, 0);
    var $btn  = $('<button class="broke-tab" data-cat="' + cat + '">')
      .html('<span class="tab-dot ' + meta.dotClass + '"></span>' +
            meta.label + ' <span style="opacity:.6;font-weight:600;">(' + total + ')</span>');
    if (cat === activeBroCat) $btn.addClass('bt-active');
    $btn.on('click', function () {
      activeBroCat = cat;
      $('.broke-tab').removeClass('bt-active');
      $btn.addClass('bt-active');
      renderBrokePieChart(cat);
    });
    $bar.append($btn);
  });
}

function renderBrokePieChart(cat) {
  var items = brokeData[cat] || [];
  var lbls  = items.map(function (i) { return i.item; });
  var vals  = items.map(function (i) { return i.count; });
  var cols  = (BROKE_PIE_COLORS[cat] || BROKE_PIE_COLORS.elec).slice(0, lbls.length);
  var total = vals.reduce(function (a, b) { return a + b; }, 0) || 1;

  var titleMap = { elec: 'Electrical', mech: 'Mechanical', hydr: 'Hydraulics' };
  var titleEl  = document.getElementById('brokeChartTitle');
  if (titleEl) titleEl.textContent = 'Top breakdown causes — ' + titleMap[cat] + ' (count)';

  var wrap = document.getElementById('brokeChartWrap');
  if (brokeCh) { brokeCh.destroy(); brokeCh = null; }

  if (!lbls.length) {
    wrap.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#bbb;">' +
      '<i class="fas fa-chart-pie" style="font-size:26px;margin-bottom:6px;"></i>' +
      '<span style="font-size:11px;">No data</span></div>';
    document.getElementById('brokeLegend').innerHTML = '';
    return;
  }

  // Ensure canvas exists
  if (!wrap.querySelector('canvas')) {
    wrap.innerHTML = '<canvas id="brokeChart"></canvas>';
  }
  var ctx = wrap.querySelector('canvas');

  var slicePlugin = {
    afterDraw: function (chart) {
      var c2   = chart.ctx;
      var meta = chart.getDatasetMeta(0);
      meta.data.forEach(function (arc, i) {
        var val = vals[i]; if (!val) return;
        var model    = arc._model || arc;
        var sliceAng = model.endAngle - model.startAngle;
        if (sliceAng < 0.3) return;
        var midAng = (model.startAngle + model.endAngle) / 2;
        var r      = model.outerRadius * 0.68;
        var x      = model.x + Math.cos(midAng) * r;
        var y      = model.y + Math.sin(midAng) * r;
        var pct    = Math.round(val / total * 100);
        c2.save();
        c2.textAlign = 'center'; c2.textBaseline = 'middle';
        c2.shadowColor = 'rgba(0,0,0,.3)'; c2.shadowBlur = 2;
        c2.font = 'bold 11px "Plus Jakarta Sans",sans-serif';
        c2.fillStyle = '#fff';
        c2.fillText(pct + '%', x, y);
        c2.restore();
      });
    }
  };

  brokeCh = new Chart(ctx.getContext('2d'), {
    type: 'pie',
    data: {
      labels: lbls,
      datasets: [{ data: vals, backgroundColor: cols, borderWidth: 2, borderColor: '#fff' }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      legend: { display: false },
      tooltips: {
        callbacks: {
          label: function (t, d) {
            var v   = d.datasets[0].data[t.index];
            var pct = Math.round(v / total * 100);
            return ' ' + d.labels[t.index] + ': ' + v + ' (' + pct + '%)';
          }
        }
      }
    },
    plugins: [slicePlugin]
  });

  buildBrokeLegend(lbls, vals, cols, total);
}

function buildBrokeLegend(lbls, vals, cols, total) {
  var el = document.getElementById('brokeLegend'); if (!el) return;
  var maxVal = Math.max.apply(null, vals) || 1;
  el.innerHTML = lbls.map(function (name, i) {
    var pct    = Math.round(vals[i] / total * 100);
    var barPct = Math.round(vals[i] / maxVal * 100);
    return '<div class="broke-leg-row">' +
      '<span class="broke-leg-rank" style="background:' + cols[i] + '20;color:' + cols[i] + ';">' + (i + 1) + '</span>' +
      '<span style="flex:1;min-width:0;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="' + name + '">' + name + '</span>' +
      '<div class="broke-leg-bar-wrap"><div class="broke-leg-bar" style="width:' + barPct + '%;background:' + cols[i] + ';"></div></div>' +
      '<span class="broke-leg-count" style="color:' + cols[i] + ';">' + vals[i] + '</span>' +
      '<span style="font-size:9px;color:#999;min-width:28px;text-align:right;">(' + pct + '%)</span>' +
    '</div>';
  }).join('');
}
