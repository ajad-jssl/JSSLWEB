<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" isELIgnored="true" %>
<%
  response.setHeader("Cache-Control","no-cache,no-store,must-revalidate");
  response.setHeader("Pragma","no-cache");
  response.setDateHeader("Expires",0);
%>
<%
long ts = System.currentTimeMillis();
%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
  <link href="img/logo/download.png" rel="icon">
  <title>JSSL - Do Time Sheet Dashboard</title>
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="vendor/chart.js/Chart.min.js"></script>
  <script>
    var user_id = sessionStorage.getItem('user_id');
    if (!user_id) { window.location.href = "newlogin.jsp"; }
  </script>

  <style>
    :root {
      --g1:#1b5e20; --g2:#2e7d32; --g3:#388e3c; --g4:#4caf50;
      --gl:#e8f5e9; --gm:#c8e6c9;
      --navy:#37499A; --navy-l:#e8eaf6;
      --bg:#eef3ee; --card:#ffffff;
      --border:#dde8dd; --text:#1c2e1c; --muted:#5c7a5c;
      --danger:#c62828; --danger-l:#ffebee;
      --warn:#e65100;   --warn-l:#fff3e0;
      --info:#01579b;   --info-l:#e3f2fd;
      --purple:#6a1b9a; --purple-l:#f3e5f5;
      --maroon:#880e4f; --maroon-l:#fce4ec;
      --steel:#bf360c;  --steel-l:#fbe9e7;
      --sh1:0 1px 3px rgba(46,125,50,.08);
      --sh2:0 4px 14px rgba(46,125,50,.13);
      --r:12px; --rs:8px;
    }
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    body {
      background: var(--bg);
      font-family: 'Plus Jakarta Sans','Segoe UI',sans-serif;
      color: var(--text);
      overflow: hidden;
    }

    #content-wrapper { overflow:hidden; }
    #content { display:flex; flex-direction:column; height:100vh; overflow:hidden; }
    .topbar  { flex-shrink:0; }

    .dash-canvas {
      flex: 1; overflow: hidden;
      padding: 10px 20px 12px;
      display: flex; flex-direction: column; gap: 10px;
    }

    /* HERO - matches the Plant Dashboard hero styling */
    .hero {
      flex-shrink: 0;
      background: linear-gradient(90deg, rgba(172,227,185,1) 0%, rgba(232,245,233,1) 100%);
      border-radius: var(--r);
      padding: 12px 20px; position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
      box-shadow: var(--sh1);
    }
    .hero::before {
      content:''; position:absolute; inset:0;
      background:
        radial-gradient(ellipse 50% 120% at 100% 50%, rgba(255,255,255,.15) 0%, transparent 55%),
        radial-gradient(ellipse 30% 70% at 0% 0%, rgba(0,0,0,.08) 0%, transparent 60%);
      pointer-events:none;
    }
    .hero::after {
      content:''; position:absolute; right:-40px; bottom:-40px;
      width:160px; height:160px; border-radius:50%;
      border:38px solid rgba(46,125,50,.08); pointer-events:none;
    }
    .hero-left { position:relative; z-index:1; display:flex; align-items:center; gap:14px; }
    .hero-logo { height: 60px; width: auto; }

    .dashboard-title-wrap { display:flex; align-items:center; gap:10px; }
    .hero-title { font-size:30px; font-weight:700; color:#16351f; letter-spacing:-.5px; line-height:1.1;margin-left:150px;font-family: "Times New Roman", Times, serif !important; }

    .live-indicator {
      display:flex; align-items:center; gap:6px;
      background:rgba(255,255,255,.55); border:1px solid rgba(0,0,0,.10);
      padding:4px 10px; border-radius:20px;
      font-size:10px; font-weight:800; letter-spacing:.8px; color:#1b5e20;
      box-shadow:0 2px 8px rgba(0,0,0,.06);
    }
    .live-dot {
      width:8px; height:8px; border-radius:50%;
      background:#2e7d32;
      animation: livePulse 1.4s infinite;
    }
    @keyframes livePulse {
      0%,100% { transform:scale(1); opacity:1; }
      50%     { transform:scale(1.5); opacity:.45; }
    }

    .hero-right { position:relative; z-index:1; display:flex; align-items:center; gap:10px; flex-wrap: wrap; }

    .hero-filter-group {
      display:flex; align-items:center; gap:6px;
      background: rgba(255,255,255,.35); border:1px solid rgba(0,0,0,.10);
      border-radius: var(--rs); padding: 4px 10px;
    }
    .hero-filter-label {
      font-size:9px; font-weight:700; color:#1c2e1c;
      text-transform:uppercase; letter-spacing:.6px; white-space:nowrap;
    }

    .locSelect, .contractSelect {
      padding: 5px 26px 5px 10px;
      min-width: 100px;
      height: 30px;
      border: 1.5px solid rgba(0,0,0,.18);
      border-radius: var(--rs);
      background: rgba(255,255,255,.70);
      color: #1c2e1c;
      font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all .2s ease;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='none' stroke='%231c2e1c' stroke-width='1.5' stroke-linecap='round' d='M1 1l4 4 4-4'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
    }
    .locSelect:hover, .contractSelect:hover { background: rgba(255,255,255,.90); border-color: var(--g2); }
    .locSelect:focus, .contractSelect:focus { outline: none; border-color: var(--g2); box-shadow: 0 0 0 2px rgba(46,125,50,.15); }
    .locSelect option, .contractSelect option { background: #fff; color: #1c2e1c; }

    .dateInput {
      padding: 5px 8px;
      height: 30px;
      width: 118px;
      border: 1.5px solid rgba(0,0,0,.18);
      border-radius: var(--rs);
      background: rgba(255,255,255,.70);
      color: #1c2e1c;
      font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all .2s;
    }
    .dateInput:focus { outline: none; border-color: var(--g2); }
    .dateInput::-webkit-calendar-picker-indicator { opacity: .6; cursor: pointer; }

    .refreshBtn {
      background: var(--g2);
      border: 1.5px solid var(--g1);
      color: #fff;
      border-radius: var(--rs);
      padding: 5px 14px;
      height: 30px;
      font-size: 11px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      display: flex; align-items: center; gap: 5px;
      transition: all .18s; white-space: nowrap;
    }
    .refreshBtn:hover { background: var(--g1); }
    .refreshBtn.spinning i { animation: spin .7s linear infinite; }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

    /* TYPE CARDS ROW - dynamic, built from TYPE_SELECTION */
    .mod-row {
      flex-shrink: 0;
      display: grid;
      gap: 8px;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
    }
    .mod {
      background: var(--card); border-radius: var(--r);
      border: 1.5px solid var(--border); padding: 10px 8px 8px;
      cursor: pointer; transition: all .2s; position: relative;
      overflow: hidden; text-align: center;
    }
    .mod::after {
      content:''; position:absolute; bottom:0; left:0; right:0; height:3px;
      transform:scaleX(0); transform-origin:left; transition:transform .22s ease;
      background: var(--mod-color, var(--g2));
    }
    .mod:hover::after, .mod.active::after { transform:scaleX(1); }
    .mod:hover, .mod.active { box-shadow:var(--sh2); transform:translateY(-2px); border-color:transparent; }
    .mod.active { background:linear-gradient(160deg,#f6fff6,#edfaed); }

    .m-ico {
      width:32px; height:32px; border-radius:8px;
      display:flex; align-items:center; justify-content:center;
      font-size:13px; margin:0 auto 5px;
      background: var(--mod-bg, var(--gl)); color: var(--mod-color, var(--g2));
    }
    .m-lbl { font-size:9px; font-weight:700; color:var(--text); line-height:1.2; margin-bottom:3px; white-space: nowrap; overflow:hidden; text-overflow:ellipsis; }
    .m-cnt { font-size:1.15rem; font-weight:800; line-height:1; letter-spacing:-.5px; }
    .m-sub { font-size:8px; color:var(--muted); margin-top:2px; }

    /* STATUS BANNERS - DH / RH / IH / TOTAL HOURS */
    .status-row {
      flex-shrink: 0;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .st {
      border-radius: var(--r); padding: 12px 15px;
      display: flex; align-items: center; gap: 12px;
      position: relative; overflow: hidden;
    }
    .st::before {
      content:''; position:absolute; right:-22px; top:-22px;
      width:88px; height:88px; border-radius:50%;
      background:rgba(0,0,0,.05); pointer-events:none;
    }
    .st-t { background: linear-gradient(130deg, #90caf9 0%, #bbdefb 50%, #e3f2fd 100%); }
    .st-dh { background: linear-gradient(130deg, #a5d6a7 0%, #c8e6c9 55%, #e8f5e9 100%); }
    .st-rh { background: linear-gradient(130deg, #ffab91 0%, #ffccbc 55%, #fbe9e7 100%); }
    .st-ih { background: linear-gradient(130deg, #ce93d8 0%, #e1bee7 55%, #f3e5f5 100%); }

    .st-ico-wrap {
      position:relative; z-index:1; flex-shrink:0;
      width:44px; height:44px; border-radius:50%;
      background:rgba(0,0,0,.08); border:2px solid rgba(0,0,0,.12);
      display:flex; align-items:center; justify-content:center;
    }
    .st-ico-wrap i { font-size:19px; color:#333; }
    .st-body { position:relative; z-index:1; flex:1; min-width:0; }
    .st-val  { font-size:1.85rem; font-weight:800; color:#1a1a1a; line-height:1; letter-spacing:-1.2px; }
    .st-lbl  { font-size:9px; color:rgba(0,0,0,.65); letter-spacing:.9px; margin-top:3px; font-weight:700; }
    .st-pct  { font-size:9.5px; color:rgba(0,0,0,.65); margin-top:3px; }
    .st-spark { position:relative; z-index:1; flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:3px; }
    .spark-bar { height:4px; border-radius:2px; background:rgba(0,0,0,.12); overflow:hidden; width:56px; }
    .spark-fill {
      height: 100%; border-radius: 2px;
      background: linear-gradient(90deg, #000000, #2c2c2c);
      transition: width 1.2s cubic-bezier(.4,0,.2,1);
      width: 0%;
    }
    .st-spark-lbl { font-size:8.5px; color:rgba(0,0,0,.55); }

    .type-label {
      font-size: 11px; font-weight: 700; color: rgba(0, 0, 0, 0.65);
      margin-bottom: 8px; text-transform: uppercase; letter-spacing: .5px;
    }

    /* CHARTS */
    .charts-row {
      flex: 1; min-height: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .ch {
      background: var(--card); border-radius: var(--r);
      border: 1px solid var(--border); box-shadow: var(--sh1);
      overflow: hidden; display:flex; flex-direction:column;
    }
    .ch-head {
      padding: 10px 14px 0;
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0;
    }
    .ch-title { font-size:11px; font-weight:700; color:var(--text); }
    .ch-sub   { font-size:9px; color:var(--muted); margin-top:1px; }
    .ch-tag   { font-size:9px; font-weight:700; padding:2px 8px; border-radius:20px; letter-spacing:.3px; text-transform:uppercase; }
    .ct-g { background:var(--gl); color:var(--g2); }
    .ct-b { background:var(--navy-l); color:var(--navy); }
    .ch-body {
      flex: 1; min-height: 0;
      padding: 8px 12px 12px;
      display: flex; flex-direction: column; justify-content: center;
    }
    .ch-body canvas { flex:1; min-height:0; }

    .dl { display:flex; flex-direction:column; margin-top:8px; }
    .dl-row { display:flex; align-items:center; justify-content:space-between; padding:4px 0; border-bottom:1px solid var(--border); font-size:10.5px; }
    .dl-row:last-child { border-bottom:none; }
    .dl-l   { display:flex; align-items:center; gap:7px; color:var(--text); font-weight:500; }
    .dl-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .dl-v   { font-weight:800; font-size:11px; }

    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    .hero{animation:fadeUp .30s ease .05s both}
    .mod{animation:fadeUp .35s ease both}
    .st{animation:fadeUp .35s ease both}
    .ch{animation:fadeUp .35s ease both}
.dash-canvas { display: none; }
  </style>
</head>
<script src="js/config.js"></script>
<script>
(function () {
  var userId = sessionStorage.getItem('user_id');
  var username = sessionStorage.getItem('username'); // used by the actions API
  var moduleName = 'DO Time Sheet';
  var pageName = 'DotimeSheetDashBoard.jsp'; // used for /api/page/actions
  var currentPage = window.location.pathname.split("/").pop()+'.jsp';

  if (!userId) {
    window.location.href = 'newlogin.jsp';
    return;
  }

  // --- Check 1: module/page permission ---
  var permUrl = new URL('/api/user-permissions-module-details', baseUrl);
  permUrl.searchParams.append('userId', userId);
  permUrl.searchParams.append('moduleName', moduleName);

  var permCheck = fetch(permUrl, { credentials: 'include' })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!Array.isArray(data) || data.length === 0) return false;
      return data.some(function (item) {
        return (item.pageUrl || '').trim().toLowerCase() === currentPage.toLowerCase();
      });
    })
    .catch(function (err) {
      console.error('Permission check failed:', err);
      return false;
    });

  // --- Check 2: action-level permission (must include "view") ---
  var actionsUrl = baseUrl + '/api/page/actions?userId=' + encodeURIComponent(username) +
                    '&pageName=' + encodeURIComponent(pageName);

  var actionCheck = fetch(actionsUrl, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch actions');
      return res.json();
    })
    .then(function (allowedActions) {
      if (!Array.isArray(allowedActions)) return false;
      return allowedActions.some(function (action) {
        return String(action).trim().toLowerCase() === 'view';
      });
    })
    .catch(function (err) {
      console.error('Action check failed:', err);
      return false;
    });

  // --- Both must pass ---
  Promise.all([permCheck, actionCheck]).then(function (results) {
    var hasPagePermission = results[0];
    var hasViewAction = results[1];

    if (hasPagePermission && hasViewAction) {
      grantAccess();
    } else {
      denyAccess();
    }
  });

  function grantAccess() {
    var canvas = document.querySelector('.dash-canvas');
    if (canvas) canvas.style.display = 'flex';

    if (typeof window.initTimesheetDashboard === 'function') {
      window.initTimesheetDashboard();
    }
  }

  function denyAccess() {
    // .dash-canvas stays display:none (its default CSS) — nothing else happens
  }
})();
</script>
<!-- <script src="js/config.js"></script> -->

<!-- <script>
(function () {
  var userId = sessionStorage.getItem('user_id');
  var moduleName = 'DO Time Sheet';
  var currentPage = window.location.pathname.split("/").pop()+'.jsp';
  
  if (!userId) {
    window.location.href = 'newlogin.jsp';
    return;
  }

  var url = new URL('/api/user-permissions-module-details', baseUrl);
  url.searchParams.append('userId', userId);
  url.searchParams.append('moduleName', moduleName);

  fetch(url, { credentials: 'include' })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!Array.isArray(data) || data.length === 0) {
        denyAccess();
        return;
      }

      var hasAccess = data.some(function (item) {
        return (item.pageUrl || '').trim().toLowerCase() === currentPage.toLowerCase();
      });

      if (hasAccess) {
        grantAccess();
      } else {
        denyAccess();
      }
    })
    .catch(function (err) {
      console.error('Permission check failed:', err);
      denyAccess();
    });

  function grantAccess() {
    var canvas = document.querySelector('.dash-canvas');
    if (canvas) canvas.style.display = 'flex'; // matches its original CSS display value

    // only now is it safe to fire the dashboard's data-loading APIs
    if (typeof window.initTimesheetDashboard === 'function') {
      window.initTimesheetDashboard();
    }
  }

  function denyAccess() {
    // .dash-canvas stays display:none (its default CSS) — nothing else happens,
    // and initTimesheetDashboard() is never called, so no dashboard APIs fire
  }
})();
</script> -->
<body id="page-top">
<div id="wrapper">
  <%@ include file="DrawingSideBar.jsp" %>

  <div id="content-wrapper" class="d-flex flex-column">
    <div id="content">

      <!-- NAVBAR -->
      <nav class="navbar navbar-expand navbar-light topbar mb-0 static-top"
           style="background-color:#1b5e20; border-bottom:2px solid #2e7d32;">
        <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
          <i class="fa fa-bars" style="color:#fff"></i>
        </button>
        <ul class="navbar-nav ml-auto">
          <button class="btn btn-link" onclick="window.location.href='Landingpage.jsp'"
                  style="color:#fff;border:none;background:transparent;">
            <i class="fa fa-home"></i>
          </button>
          <div class="topbar-divider d-none d-sm-block"></div>
          <li class="nav-item dropdown no-arrow">
            <a class="nav-link dropdown-toggle" href="#" id="uDD" role="button" data-toggle="dropdown">
              <i class="fas fa-user text-white mr-2"></i>
              <span class="ml-2 d-none d-lg-inline text-white small" id="usernameDisplay">Username</span>
              <span class="ml-2 d-none d-lg-inline text-white small" id="selectedFactoryId">No Factory Selected</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="uDD">
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" onclick="logoutUser(event)">
                <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i> Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>

      <!-- DASHBOARD CANVAS -->
      <div class="dash-canvas">

        <!-- HERO -->
        <div class="hero">
          <div class="hero-left">
           <!--  <img src="img/logo/jssl_logo_transparent.png" alt="JSSL Logo" class="hero-logo" onerror="this.style.display='none'"> -->
            <div class="dashboard-title-wrap">
              <div class="live-indicator"><span class="live-dot"></span> LIVE</div>
              <div class="hero-title">DO Time Sheet DashBoard</div>
            </div>
          </div>

          <div class="hero-right">
            <div class="hero-filter-group">
              <span class="hero-filter-label">Location</span>
              <select id="locationSelect" class="locSelect">
                <option value="ALL">All</option>
                <option value="2">Mumbai</option>
                <option value="3">Bellary</option>
              </select>
            </div>

            <div class="hero-filter-group">
              <span class="hero-filter-label">From</span>
              <input type="date" id="fromDate" class="dateInput">
            </div>

            <div class="hero-filter-group">
              <span class="hero-filter-label">To</span>
              <input type="date" id="toDate" class="dateInput">
            </div>

            <select id="contractSelect" class="contractSelect"></select>

            <button id="refreshBtn" class="refreshBtn" title="Refresh">
              <i class="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>

        <!-- TYPE CARDS ROW - built dynamically from TYPE_SELECTION -->
        <div class="mod-row" id="typeCardsRow">
          <!-- cards injected by JS: All + one per TYPE_ID -->
        </div>

        <!-- STATUS BANNERS -->
        <div class="status-row">
          <div class="st st-t">
            <div class="st-ico-wrap"><i class="fas fa-business-time"></i></div>
            <div class="st-body">
              <div class="type-label" id="typeLabel">All Types</div>
              <div class="st-val" id="stTotal">0</div>
              <div class="st-lbl">Total Hours</div>
              <div class="st-pct" id="stRecords">0 records</div>
            </div>
            <div class="st-spark">
              <div class="spark-bar"><div class="spark-fill" style="width:100%"></div></div>
              <div class="st-spark-lbl">100% base</div>
            </div>
          </div>
          <div class="st st-dh">
            <div class="st-ico-wrap"><i class="fas fa-drafting-compass"></i></div>
            <div class="st-body">
              <div class="st-val" id="stDH">0</div>
              <div class="st-lbl">DH Hours</div>
              <div class="st-pct" id="stDHp">0% of Total</div>
            </div>
            <div class="st-spark">
              <div class="spark-bar"><div class="spark-fill" id="sp-dh"></div></div>
              <div class="st-spark-lbl">DH share</div>
            </div>
          </div>
          <div class="st st-rh">
            <div class="st-ico-wrap"><i class="fas fa-redo-alt"></i></div>
            <div class="st-body">
              <div class="st-val" id="stRH">0</div>
              <div class="st-lbl">RH Hours</div>
              <div class="st-pct" id="stRHp">0% of Total</div>
            </div>
            <div class="st-spark">
              <div class="spark-bar"><div class="spark-fill" id="sp-rh"></div></div>
              <div class="st-spark-lbl">RH share</div>
            </div>
          </div>
          <div class="st st-ih">
            <div class="st-ico-wrap"><i class="fas fa-user-clock"></i></div>
            <div class="st-body">
              <div class="st-val" id="stIH">0</div>
              <div class="st-lbl">IH Hours</div>
              <div class="st-pct" id="stIHp">0% of Total</div>
            </div>
            <div class="st-spark">
              <div class="spark-bar"><div class="spark-fill" id="sp-ih"></div></div>
              <div class="st-spark-lbl">IH share</div>
            </div>
          </div>
        </div>

        <!-- CHARTS ROW -->
        <div class="charts-row">
          <div class="ch">
            <div class="ch-head">
              <div><div class="ch-title">Hours Split</div><div class="ch-sub">DH / RH / IH</div></div>
              <span class="ch-tag ct-g">Live</span>
            </div>
            <div class="ch-body">
              <canvas id="donutChart"></canvas>
              <div class="dl" id="donutLegend"></div>
            </div>
          </div>
          <div class="ch">
            <div class="ch-head">
              <div><div class="ch-title">Top Contracts by Hours</div><div class="ch-sub">Highest working hours</div></div>
              <span class="ch-tag ct-b">Top 8</span>
            </div>
            <div class="ch-body" style="position:relative;">
              <canvas id="barChart"></canvas>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<a class="scroll-to-top rounded" href="#page-top"><i class="fas fa-angle-up"></i></a>


<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="js/ruang-admin.min.js"></script>
<script src="js/username.js"></script>
<script src="js/logout.js"></script>
<script src="js/Sessionfilter.js"></script>
<script src="js/doTimeSheetDashboard.js?v=<%=ts%>"></script>

</body>
</html>
