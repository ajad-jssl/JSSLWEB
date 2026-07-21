<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="true" %>
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
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
  <link href="img/logo/download.png" rel="icon">
  <title>JSSL - Maintenance Dashboard</title>
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
      background:var(--bg);
      font-family:'Plus Jakarta Sans','Segoe UI',sans-serif;
      color:var(--text);
      overflow:hidden;
    }
    #content-wrapper { overflow:hidden; }
    #content { display:flex; flex-direction:column; height:100vh; overflow:hidden; }
    .topbar { flex-shrink:0; }

    /* ===== DASH CANVAS ===== */
    .dash-canvas {
      flex:1; overflow:hidden;
      padding:8px 18px 10px;
      display:flex; flex-direction:column; gap:8px;
    }

    /* ===== HERO ===== */
    .hero {
      flex-shrink:0;
      background:linear-gradient(90deg,rgba(172,227,185,1) 0%,rgba(255,255,255,1) 100%);
      border-radius:var(--r);
      padding:11px 20px;
      display:flex; align-items:center; justify-content:space-between; gap:12px;
    }
    .hero-title { font-size:22px; font-weight:700; color:#1b2e1b; line-height:1.1; }
    .hero-pill {
      display:inline-flex; align-items:center; gap:5px;
      background:rgba(255,255,255,.35); border:1px solid #333;
      color:#222; font-size:9px; font-weight:700;
      letter-spacing:.9px; text-transform:uppercase;
      padding:2px 8px; border-radius:20px; margin-right:8px;
    }
    .hero-pill-dot {
      width:9px; height:9px; border-radius:50%;
      background:#2e7d32; animation:livePulse 1.5s infinite;
    }
    @keyframes livePulse {
      0%{transform:scale(.5);opacity:1} 50%{transform:scale(1);opacity:.5} 100%{transform:scale(1);opacity:1}
    }
    .hero-right { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .date-input {
      height:30px; padding:0 8px;
      border:1.5px solid rgba(0,0,0,.18); border-radius:6px;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:600; color:#1c2e1c;
      background:#fff; cursor:pointer;
    }
    .date-input:focus { outline:none; border-color:var(--g3); }
    .btn-apply {
      height:30px; padding:0 14px; border-radius:6px; border:none;
      background:var(--g2); color:#fff;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:700;
      cursor:pointer; transition:background .2s;
    }
    .btn-apply:hover { background:var(--g1); }
    .machineSelect {
      height:30px; padding:0 28px 0 10px;
      border:1.5px solid rgba(0,0,0,.2); border-radius:6px;
      background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'%3E%3Cpath fill='none' stroke='%23333' stroke-width='1.5' stroke-linecap='round' d='M1 1l4.5 4.5L10 1'/%3E%3C/svg%3E") no-repeat right 8px center;
      appearance:none;
      font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:600; color:#1c2e1c;
      cursor:pointer; min-width:140px;
    }

    /* ===== MODULE CARDS ===== */
    .mod-row {
      flex-shrink:0;
      display:grid; grid-template-columns:repeat(4,1fr); gap:8px;
    }
    .mod {
      background:var(--card); border-radius:var(--r);
      border:1.5px solid var(--border); padding:10px 8px 8px;
      cursor:pointer; transition:all .2s; position:relative;
      overflow:hidden; text-align:center;
    }
    .mod::after {
      content:''; position:absolute; bottom:0; left:0; right:0; height:3px;
      transform:scaleX(0); transform-origin:left; transition:transform .22s ease;
    }
    .mod:hover::after, .mod.active::after { transform:scaleX(1); }
    .mod:hover, .mod.active { box-shadow:var(--sh2); transform:translateY(-2px); border-color:transparent; }
    .mod.active { background:linear-gradient(160deg,#f6fff6,#edfaed); }
    .m-all::after  { background:var(--navy); }
    .m-adv::after  { background:#1565c0; }
    .m-dc::after   { background:var(--purple); }
    .m-stl::after  { background:var(--steel); }
    .m-ico {
      width:32px; height:32px; border-radius:8px;
      display:flex; align-items:center; justify-content:center;
      font-size:13px; margin:0 auto 5px;
    }
    .mi-all  { background:var(--navy-l);   color:var(--navy); }
    .mi-adv  { background:var(--info-l);   color:#1565c0; }
    .mi-dc   { background:var(--purple-l); color:var(--purple); }
    .mi-stl  { background:var(--steel-l);  color:var(--steel); }
    .m-lbl { font-size:9px; font-weight:700; color:var(--text); line-height:1.2; margin-bottom:3px; }
    .m-cnt { font-size:1.15rem; font-weight:800; line-height:1; letter-spacing:-.5px; }
    .m-sub { font-size:8px; color:var(--muted); margin-top:2px; }

    /* ===== MODULE CARD DETAIL MINI BADGES ===== */
    .m-detail {
      display:flex; justify-content:center; gap:4px; margin-top:4px; flex-wrap:wrap;
    }
    .m-dbadge {
      font-size:8px; font-weight:700; padding:1px 5px; border-radius:10px;
      display:inline-flex; align-items:center; gap:2px;
    }
    .mdb-o { background:#fff3e0; color:#e65100; }
    .mdb-w { background:#e3f2fd; color:#1565c0; }
    .mdb-c { background:#e8f5e9; color:#2e7d32; }

    /* ===== STATUS BANNERS ===== */
    .status-row {
      flex-shrink:0;
      display:grid; grid-template-columns:repeat(4,1fr); gap:8px;
    }
    .st {
      border-radius:var(--r); padding:11px 14px;
      display:flex; align-items:center; gap:12px;
      position:relative; overflow:hidden;
    }
    .st::before {
      content:''; position:absolute; right:-20px; top:-20px;
      width:80px; height:80px; border-radius:50%;
      background:rgba(0,0,0,.04); pointer-events:none;
    }
    .st-t    { background:linear-gradient(130deg,#90caf9,#bbdefb 55%,#e3f2fd); }
    .st-open { background:linear-gradient(130deg,#ffab91,#ffccbc 55%,#fbe9e7); }
    .st-wip  { background:linear-gradient(130deg,#80deea,#b2ebf2 55%,#e0f7fa); }
    .st-cls  { background:linear-gradient(130deg,#a5d6a7,#c8e6c9 55%,#e8f5e9); }
    .st-ico-wrap {
      position:relative; z-index:1; flex-shrink:0;
      width:40px; height:40px; border-radius:50%;
      background:rgba(0,0,0,.09); border:2px solid rgba(0,0,0,.12);
      display:flex; align-items:center; justify-content:center;
    }
    .st-ico-wrap i { font-size:17px; color:#333; }
    @keyframes pulse-ring {
      0%{box-shadow:0 0 0 0 rgba(0,0,0,.2)} 70%{box-shadow:0 0 0 8px rgba(0,0,0,0)} 100%{box-shadow:0 0 0 0 rgba(0,0,0,0)}
    }
    .st-open .st-ico-wrap { animation:pulse-ring 2.4s ease infinite; }
    .st-wip  .st-ico-wrap { animation:pulse-ring 2.4s ease .8s infinite; }
    .st-body { position:relative; z-index:1; flex:1; min-width:0; }
    .st-val  { font-size:1.7rem; font-weight:800; color:#1a1a1a; line-height:1; letter-spacing:-1px; }
    .st-lbl  { font-size:9px; color:rgba(0,0,0,.6); text-transform:uppercase; letter-spacing:.9px; margin-top:3px; font-weight:700; }
    .st-pct  { font-size:9px; color:rgba(0,0,0,.6); margin-top:2px; }
    .st-spark { position:relative; z-index:1; flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:3px; }
    .spark-bar { height:4px; border-radius:2px; background:rgba(0,0,0,.12); overflow:hidden; width:50px; }
    .spark-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,#000,#2c2c2c); transition:width 1.2s cubic-bezier(.4,0,.2,1); width:0%; }
    .st-spark-lbl { font-size:8px; color:rgba(0,0,0,.55); }

    /* ===== CHARTS ROW — now 3 columns ===== */
    .charts-row {
      flex:1; min-height:0;
      display:grid;
      grid-template-columns: 1fr 1fr 1.6fr;
      gap:8px;
    }
    .ch {
      background:var(--card); border-radius:var(--r);
      border:1px solid var(--border); box-shadow:var(--sh1);
      overflow:hidden; display:flex; flex-direction:column;
    }
    .ch-head {
      padding:9px 14px 0;
      display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
    }
    .ch-title { font-size:11px; font-weight:700; color:var(--text); }
    .ch-sub   { font-size:9px; color:var(--muted); margin-top:1px; }
    .ch-tag   { font-size:9px; font-weight:700; padding:2px 8px; border-radius:20px; letter-spacing:.3px; text-transform:uppercase; }
    .ct-g  { background:var(--gl); color:var(--g2); }
    .ct-b  { background:var(--navy-l); color:var(--navy); }
    .ct-or { background:#fff3e0; color:#e65100; }
    .ch-body { flex:1; min-height:0; padding:6px 10px 10px; display:flex; flex-direction:column; }

    /* ===== DONUT layout ===== */
    /* REPLACE WITH */
.donut-wrap {
  display:flex; flex-direction:column; flex:1; min-height:0;
  gap:4px; align-items:center; justify-content:center; padding:6px 4px 4px;
}
.donut-canvas-wrap {
  flex:1; min-height:0; position:relative;
  width:100%; max-width:520px; min-height:220px;
}
    .donut-legend {
      flex-shrink:0; overflow-y:auto; max-height:72px;
      width:100%; max-width:520px;
    }
    .dl-row {
      display:flex; align-items:center; justify-content:space-between;
      padding:3px 0; border-bottom:1px solid var(--border);
      font-size:10px; transition:background .15s;
    }
    .dl-row:last-child { border-bottom:none; }
    .dl-row:hover { background:rgba(46,125,50,.04); }
    .dl-l  { display:flex; align-items:center; gap:6px; flex:1; min-width:0; }
    .dl-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .dl-nm  { font-weight:600; color:var(--text); }
    .dl-detail { font-size:9px; color:var(--muted); margin-left:4px; }
    .dl-v   { font-weight:800; font-size:11px; flex-shrink:0; }

    /* ===== BREAKDOWN PIE panel ===== */
    .broke-wrap {
      flex:1; min-height:0;
      display:flex; flex-direction:column; gap:4px;
      padding:4px 8px 8px;
    }

    /* Tab bar */
    .broke-tab-bar {
      display:flex; gap:4px; flex-shrink:0; flex-wrap:wrap;
    }
    .broke-tab {
      display:inline-flex; align-items:center; gap:5px;
      padding:3px 9px; border-radius:20px; border:1.5px solid var(--border);
      background:#fff; font-family:'Plus Jakarta Sans',sans-serif;
      font-size:9px; font-weight:600; color:var(--muted);
      cursor:pointer; transition:all .18s;
    }
    .broke-tab:hover { border-color:#aaa; color:var(--text); }
    .broke-tab.bt-active {
      background:var(--text); border-color:var(--text);
      color:#fff;
    }
    .tab-dot {
      width:7px; height:7px; border-radius:50%; flex-shrink:0;
    }
    .dot-elec { background:#1565C0; }
    .dot-mech { background:#E65100; }
    .dot-hydr { background:#00838F; }

    /* Chart title */
    .broke-chart-title {
      font-size:9px; font-weight:600; color:var(--muted);
      flex-shrink:0; padding:0 2px;
    }

    /* Pie + legend side by side */
    .broke-main {
      flex:1; min-height:0;
      display:flex; gap:8px;
    }
    .broke-chart-wrap {
      flex:0 0 42%;
      position:relative; min-height:0;
    }
    .broke-chart-wrap canvas {
      width:100% !important; height:100% !important;
    }

    /* Ranked legend */
    .broke-legend {
      flex:1; min-width:0;
      display:flex; flex-direction:column;
      gap:3px; overflow-y:auto;
      justify-content:center;
    }
    .broke-leg-row {
      display:flex; align-items:center; gap:5px;
      font-size:9px; color:var(--text);
    }
    .broke-leg-rank {
      width:16px; height:16px; border-radius:4px;
      display:flex; align-items:center; justify-content:center;
      font-size:8px; font-weight:800; flex-shrink:0;
    }
    .broke-leg-bar-wrap {
      flex:1; height:5px; background:#f0f0f0;
      border-radius:3px; overflow:hidden; min-width:0;
    }
    .broke-leg-bar { height:100%; border-radius:3px; transition:width .4s; }
    .broke-leg-count {
      font-weight:800; font-size:10px; flex-shrink:0; min-width:18px; text-align:right;
    }

    /* ===== BAR chart ===== */
    .bar-wrap { flex:1; min-height:0; position:relative; }
    .bar-wrap canvas { width:100% !important; height:100% !important; }

    /* ===== SLIDE-IN DETAIL PANEL ===== */
    .detail-panel {
      position:fixed; top:0; right:-500px;
      width:460px; height:100vh;
      background:#fff; z-index:9999;
      box-shadow:-4px 0 28px rgba(0,0,0,.14);
      transition:right .33s cubic-bezier(.4,0,.2,1);
      display:flex; flex-direction:column;
    }
    .detail-panel.open { right:0; }
    .dp-overlay {
      display:none; position:fixed; inset:0;
      background:rgba(0,0,0,.22); z-index:9998;
    }
    .dp-overlay.open { display:block; }
    .dp-header {
      background:linear-gradient(135deg,#1b5e20,#2e7d32);
      padding:16px 18px; flex-shrink:0;
      display:flex; align-items:center; justify-content:space-between;
    }
    .dp-header-title { color:#fff; font-size:13px; font-weight:700; }
    .dp-header-sub   { color:rgba(255,255,255,.65); font-size:11px; margin-top:2px; }
    .dp-close {
      width:28px; height:28px; border-radius:50%;
      background:rgba(255,255,255,.15); border:none;
      color:#fff; font-size:15px; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
    }
    .dp-close:hover { background:rgba(255,255,255,.28); }
    .dp-body { flex:1; overflow-y:auto; padding:14px; }
    .dp-empty { text-align:center; padding:36px 20px; color:#aaa; }
    .dp-empty i { font-size:28px; margin-bottom:8px; display:block; }

    /* Ticket cards */
    .tk {
      border:1.5px solid #e8f5e9; border-radius:8px; padding:10px 12px;
      transition:box-shadow .2s; margin-bottom:8px;
    }
    .tk:last-child { margin-bottom:0; }
    .tk:hover { box-shadow:0 2px 10px rgba(46,125,50,.1); }
    .tk-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:7px; }
    .tk-no   { font-size:11px; font-weight:800; color:#1b5e20; }
    .tk-badge { font-size:8.5px; font-weight:700; padding:2px 9px; border-radius:20px; text-transform:uppercase; letter-spacing:.4px; }
    .b-open { background:#fff3e0; color:#e65100; }
    .b-wip  { background:#e3f2fd; color:#1565c0; }
    .b-cls  { background:#e8f5e9; color:#2e7d32; }
    .b-unk  { background:#f3e5f5; color:#6a1b9a; }
    .tk-row { display:flex; gap:6px; font-size:10px; margin-bottom:4px; align-items:flex-start; }
    .tk-row i { color:#4caf50; width:12px; flex-shrink:0; margin-top:1px; }
    .tk-lbl  { color:#888; min-width:80px; flex-shrink:0; }
    .tk-val  { color:#1c2e1c; font-weight:600; }
    .tk-dt   {
      margin-top:7px; padding:5px 10px;
      background:linear-gradient(90deg,#e8f5e9,#f1f8e9);
      border-radius:6px; display:flex; align-items:center; gap:7px;
    }
    .tk-dt i { color:#2e7d32; font-size:11px; }
    .tk-dt-val { font-size:11px; font-weight:800; color:#1b5e20; }
    .tk-dt-lbl { font-size:9px; color:#5c7a5c; }

    /* Priority badge */
    .prio {
      display:inline-flex; align-items:center; justify-content:center;
      width:22px; height:22px; border-radius:50%;
      font-size:9px; font-weight:800; flex-shrink:0; letter-spacing:-.3px;
    }
    .p1 { background:#ffebee; color:#c62828; border:1.5px solid #ef9a9a; }
    .p2 { background:#fff3e0; color:#e65100; border:1.5px solid #ffcc80; }
    .p3 { background:#e3f2fd; color:#1565c0; border:1.5px solid #90caf9; }
    .px { background:#f3e5f5; color:#6a1b9a; border:1.5px solid #ce93d8; }

    /* ===== ANIMATIONS ===== */
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    .hero         { animation:fadeUp .25s ease both; }
    .mod          { animation:fadeUp .3s ease both; }
    .mod:nth-child(1){animation-delay:.04s} .mod:nth-child(2){animation-delay:.07s}
    .mod:nth-child(3){animation-delay:.10s} .mod:nth-child(4){animation-delay:.13s}
    .st           { animation:fadeUp .3s ease both; }
    .st:nth-child(1){animation-delay:.15s} .st:nth-child(2){animation-delay:.2s}
    .st:nth-child(3){animation-delay:.25s} .st:nth-child(4){animation-delay:.3s}
    .ch           { animation:fadeUp .32s ease both; }
    .ch:nth-child(1){animation-delay:.22s} .ch:nth-child(2){animation-delay:.25s}
    .ch:nth-child(3){animation-delay:.28s}
  </style>
</head>

<!-- Overlay -->
<div class="dp-overlay" id="dpOverlay" onclick="closeDetailPanel()"></div>

<!-- Slide-in Panel -->
<div class="detail-panel" id="detailPanel">
  <div class="dp-header">
    <div>
      <div class="dp-header-title" id="dpTitle">Ticket Details</div>
      <div class="dp-header-sub"   id="dpSub">Loading...</div>
    </div>
    <button class="dp-close" onclick="closeDetailPanel()"><i class="fas fa-times"></i></button>
  </div>
  <div class="dp-body" id="dpBody">
    <div class="dp-empty"><i class="fas fa-ticket-alt"></i>Click a bar to view tickets</div>
  </div>
</div>

<body id="page-top">
<div id="wrapper">
  <%@ include file="MaintenanceSideBar.jsp" %>

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
          <div>
            <div class="hero-title">
              <span class="hero-pill"><span class="hero-pill-dot"></span>Live</span>
              Plant Maintenance Dashboard
            </div>
          </div>
          <div class="hero-right">
            <div style="display:flex;align-items:center;gap:10px;font-size:11px;font-weight:600;color:#333;">
              <label style="display:flex;align-items:center;gap:4px;cursor:pointer;">
                <input type="checkbox" class="regionFilter" value="ALL" checked> All
              </label>
              <label style="display:flex;align-items:center;gap:4px;cursor:pointer;">
                <input type="checkbox" class="regionFilter" value="1"> Bellary
              </label>
              <label style="display:flex;align-items:center;gap:4px;cursor:pointer;">
                <input type="checkbox" class="regionFilter" value="2"> Gujarat
              </label>
            </div>
            <span style="font-size:11px;font-weight:600;color:#444;">From</span>
            <input type="date" id="dateFrom" class="date-input">
            <span style="font-size:11px;font-weight:600;color:#444;">To</span>
            <input type="date" id="dateTo" class="date-input">
            <button id="btnApplyDate" class="btn-apply">
              <i class="fas fa-search" style="margin-right:4px"></i>Apply
            </button>
            <select class="machineSelect" id="machineSelect">
              <option value="">All Machines</option>
            </select>
          </div>
        </div>

        <!-- MODULE CARDS -->
        <div class="mod-row">
          <div class="mod m-all active" onclick="goType('ALL',this)">
            <div class="m-ico mi-all"><i class="fas fa-th-list"></i></div>
            <div class="m-lbl">All Categories</div>
            <div class="m-cnt" id="mc-ALL">0</div>
            <div class="m-sub">records</div>
          </div>
          <div class="mod m-adv" onclick="goType('ADVANCED',this)">
            <div class="m-ico mi-adv"><i class="fas fa-money-bill-wave"></i></div>
            <div class="m-lbl">Side Loader</div>
            <div class="m-cnt" id="mc-ADV">0</div>
            <div class="m-detail">
              <i class="fas fa-clock" style="margin-right:4px;"></i>
              <span id="mc-ADV-dt">0h 0m / 0h 0m</span>
            </div>
          </div>
          <div class="mod m-dc" onclick="goType('DELIVERY_CHALLAN',this)">
            <div class="m-ico mi-dc"><i class="fas fa-truck"></i></div>
            <div class="m-lbl">EOT Crane</div>
            <div class="m-cnt" id="mc-DC">0</div>
            <div class="m-detail">
              <i class="fas fa-clock" style="margin-right:4px;"></i>
              <span id="mc-DC-dt">0h 0m / 0h 0m</span>
            </div>
          </div>
          <div class="mod m-stl" onclick="goType('STEEL',this)">
            <div class="m-ico mi-stl"><i class="fas fa-industry"></i></div>
            <div class="m-lbl">CNC Machines</div>
            <div class="m-cnt" id="mc-STEEL">0</div>
            <div class="m-detail">
              <i class="fas fa-clock" style="margin-right:4px;"></i>
              <span id="mc-STEEL-dt">0h 0m / 0h 0m</span>
            </div>
          </div>
        </div>

        <!-- STATUS BANNERS -->
        <div class="status-row">
          <div class="st st-t">
            <div class="st-ico-wrap" style="animation:none;"><i class="fas fa-layer-group"></i></div>
            <div class="st-body">
              <div style="font-size:9px;font-weight:700;color:rgba(0,0,0,.5);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;" id="typeLabel">All Categories</div>
              <div class="st-val" id="stTotal">0</div>
              <div class="st-lbl">Total Tickets</div>
              <div class="st-pct" id="stTotalHrs">0h downtime</div>
            </div>
            <div class="st-spark">
              <div class="spark-bar"><div class="spark-fill" style="width:100%"></div></div>
              <div class="st-spark-lbl">100% base</div>
            </div>
          </div>
          <div class="st st-open">
            <div class="st-ico-wrap"><i class="fas fa-exclamation-triangle"></i></div>
            <div class="st-body">
              <div class="st-val" id="stOpen">0</div>
              <div class="st-lbl">Open / Pending</div>
              <div class="st-pct" id="stOpenP">0% of total</div>
            </div>
            <div class="st-spark">
              <div class="spark-bar"><div class="spark-fill" id="sp-open"></div></div>
              <div class="st-spark-lbl">open rate</div>
            </div>
          </div>
          <div class="st st-wip">
            <div class="st-ico-wrap"><i class="fas fa-cog"></i></div>
            <div class="st-body">
              <div class="st-val" id="stWip">0</div>
              <div class="st-lbl">In Progress</div>
              <div class="st-pct" id="stWipP">0% of total</div>
            </div>
            <div class="st-spark">
              <div class="spark-bar"><div class="spark-fill" id="sp-wip"></div></div>
              <div class="st-spark-lbl">wip rate</div>
            </div>
          </div>
          <div class="st st-cls">
            <div class="st-ico-wrap" style="animation:none;"><i class="fas fa-check-double"></i></div>
            <div class="st-body">
              <div class="st-val" id="stClosed">0</div>
              <div class="st-lbl">Closed</div>
              <div class="st-pct" id="stClosedP">0% of total</div>
            </div>
            <div class="st-spark">
              <div class="spark-bar"><div class="spark-fill" id="sp-closed"></div></div>
              <div class="st-spark-lbl">closed rate</div>
            </div>
          </div>
        </div>

        <!-- CHARTS ROW — 3 columns: Donut | Breakdown Pie | Bar -->
        <div class="charts-row">

          <!-- COL 1: Tickets by Category Donut -->
          <div class="ch">
            <div class="ch-head">
              <div>
                <div class="ch-title">Tickets by Category</div>
                <div class="ch-sub">Click a slice to drill down</div>
              </div>
              <span class="ch-tag ct-g">Live</span>
            </div>
            <div class="ch-body donut-wrap">
              <div class="donut-canvas-wrap">
                <canvas id="donutChart"></canvas>
              </div>
              <div id="donutLegend" class="donut-legend"></div>
            </div>
          </div>

          <!-- COL 2: Top Breakdown Causes Pie -->
          <div class="ch">
            <div class="ch-head">
              <div>
                <div class="ch-title">Top Breakdown Causes</div>
                <div class="ch-sub" id="brokeChartTitle">Electrical (count)</div>
              </div>
              <span class="ch-tag ct-or"><i class="fas fa-fire" style="margin-right:3px;font-size:8px;"></i>Causes</span>
            </div>
            <div class="ch-body broke-wrap">
              <!-- Tab bar: Electrical / Mechanical / Hydraulics -->
              <div class="broke-tab-bar" id="brokeTabBar"></div>
              <!-- Pie chart + ranked legend side by side -->
              <div class="broke-main">
                <div class="broke-chart-wrap" id="brokeChartWrap">
                  <canvas id="brokeChart"></canvas>
                </div>
                <div class="broke-legend" id="brokeLegend"></div>
              </div>
            </div>
          </div>

          <!-- COL 3: Hours by Machine Bar Chart -->
          <div class="ch">
            <div class="ch-head">
              <div>
                <div class="ch-title">Hours by Machine</div>
                <div class="ch-sub">All categories</div>
              </div>
              <span class="ch-tag ct-b">Click bar &rarr; details</span>
            </div>
            <div id="barLegend" style="display:flex;align-items:center;gap:14px;padding:4px 14px 0;flex-shrink:0;flex-wrap:wrap;"></div>
            <div class="ch-body bar-wrap" style="position:relative;">
              <canvas id="barChart"></canvas>
            </div>
          </div>

        </div><!-- /.charts-row -->
      </div><!-- /.dash-canvas -->
    </div><!-- /#content -->
  </div><!-- /#content-wrapper -->
</div><!-- /#wrapper -->

<a class="scroll-to-top rounded" href="#page-top"><i class="fas fa-angle-up"></i></a>

<script src="js/config.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="js/ruang-admin.min.js"></script>
<script src="js/username.js"></script>
<script src="js/logout.js"></script>
<script src="js/Sessionfilter.js"></script>
<script src="js/maintenanceDashboard.js?v=<%=ts%>"></script>
</body>
</html>
