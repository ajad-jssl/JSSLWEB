
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
  <title>JSSL - Invoice Dashboard</title>
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

    .summary-bar {
      flex-shrink: 0;
      background: var(--g1);
      border-bottom: 1px solid rgba(255,255,255,.12);
      display: flex;
      align-items: stretch;
      height: 44px;
      padding: 0 20px;
      gap: 0;
    }
    .sb-item {
      display: flex; align-items: center; gap: 10px;
      padding: 0 20px 0 0; margin-right: 20px;
      border-right: 1px solid rgba(255,255,255,.15);
      cursor: default; transition: background .15s;
    }
    .sb-item:last-child { border-right: none; margin-right: 0; }
    .sb-item:hover { background: rgba(255,255,255,.06); }
    .sb-dot {
      width: 28px; height: 28px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; flex-shrink: 0;
    }
    .sbd-total { background: rgba(255,255,255,.18); color: #fff; }
    .sbd-v     { background: rgba(100,221,100,.22);  color: #a5f0a5; }
    .sbd-n     { background: rgba(255,160,60,.20);   color: #ffd0a0; }
    .sbd-c     { background: rgba(255,100,100,.20);  color: #ffb0b0; }
    .sb-num {
      font-size: 15px; font-weight: 800; color: #fff;
      line-height: 1; letter-spacing: -.5px;
    }
    .sb-lbl {
      font-size: 9px; color: rgba(255,255,255,.55);
      text-transform: uppercase; letter-spacing: .7px;
      font-weight: 600; margin-top: 1px;
    }
    .sb-item.sb-total {
      padding-right: 22px; margin-right: 22px;
      border-right: 2px solid rgba(255,255,255,.22);
    }
    .sb-contract {
      margin-left: auto; display: flex; align-items: center;
      font-size: 10px; color: rgba(255,255,255,.55);
      gap: 6px; max-width: 420px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .sb-contract i { font-size: 11px; color: rgba(255,255,255,.35); flex-shrink:0; }

    .dash-canvas {
      flex: 1; overflow: hidden;
      padding: 10px 20px 12px;
      display: flex; flex-direction: column; gap: 10px;
    }

    /* HERO */
    .hero {
      flex-shrink: 0;background: linear-gradient(90deg,rgba(172, 227, 185, 1) 100%, rgba(255, 255, 255, 1) 100%); border-radius: var(--r);
      padding: 13px 22px; position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      
    }
    .hero::before {
      content:''; position:absolute; inset:0;
      background:
        radial-gradient(ellipse 50% 120% at 100% 50%, rgba(255,255,255,.11) 0%, transparent 55%),
        radial-gradient(ellipse 30% 70% at 0% 0%, rgba(0,0,0,.20) 0%, transparent 60%);
      pointer-events:none;
    }
    .hero::after {
      content:''; position:absolute; right:-45px; bottom:-45px;
      width:190px; height:190px; border-radius:50%;
      border:44px solid rgba(255,255,255,.07); pointer-events:none;
    }
    .hero-left { position:relative; z-index:1; display:flex; align-items:center; gap:14px;  }
  /*   .hero-icon {
      width:40px; height:40px; 
      background:rgba(255,255,255,.18); 
      display:flex; align-items:center; justify-content:center;
      font-size:17px; color:#fff; flex-shrink:0;
    } */
    .hero-title { font-size:26px; font-weight:600; color:black; line-height:1.1; letter-spacing:-.2px; }
    .hero-sub   { font-size:10px; color:rgba(255,255,255,.70); margin-top:2px; }
    .hero-sub strong { color:rgba(255,255,255,.92); }
    .hero-pill {
      display:inline-flex; align-items:center; gap:5px;
      background:rgba(255,255,255,.30); border:1px solid Black;
      color:black; font-size:9px; font-weight:700;
      letter-spacing:.9px; text-transform:uppercase;
      padding:2px 8px; border-radius:20px; margin-right:8px;
    }
   .hero-pill-dot { 
  width:20px; 
  height:20px; 
  border-radius:50%; 
  background: green;
  animation: livePulse 1.5s infinite;
}

@keyframes livePulse {
  0%   { transform: scale(.5); opacity: 1; }
  50%  { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}
    .hero-right { position:relative; z-index:1; display:flex; align-items:center; gap:10px; flex-shrink:0; }
    .hero-btn {
      background:rgba(255,255,255,.18); border:1.5px solid rgba(255,255,255,.30);
      color:#fff; border-radius:var(--rs); padding:7px 14px;
      font-size:11px; font-weight:700; cursor:pointer; font-family:inherit;
      display:flex; align-items:center; gap:6px; transition:all .18s; white-space:nowrap;
    }
    .hero-btn:hover { background:rgba(255,255,255,.28); transform:translateY(-1px); }



    /* MODULE CARDS – 9 columns */
    .mod-row {
      flex-shrink: 0;
      display: grid;
      grid-template-columns: repeat(9, 1fr);
      gap: 8px;
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
    }
    .mod:hover::after, .mod.active::after { transform:scaleX(1); }
    .mod:hover, .mod.active { box-shadow:var(--sh2); transform:translateY(-2px); border-color:transparent; }
    .mod.active { background:linear-gradient(160deg,#f6fff6,#edfaed); }

    /* bottom bar colours per type */
    .m-all::after  { background:var(--navy); }
    .m-adv::after  { background:#1565c0; }
    .m-dc::after   { background:var(--purple); }
    .m-stl::after  { background:var(--steel); }
    .m-db::after   { background:var(--g2); }
    .m-cr::after   { background:var(--maroon); }
    .m-con::after  { background:#00695c; }
    .m-oth::after  { background:#f57f17; }
    .m-scp::after  { background:#4e342e; }

    .m-ico {
      width:32px; height:32px; border-radius:8px;
      display:flex; align-items:center; justify-content:center;
      font-size:13px; margin:0 auto 5px;
    }
    .mi-all  { background:var(--navy-l);   color:var(--navy); }
    .mi-adv  { background:var(--info-l);   color:#1565c0; }
    .mi-dc   { background:var(--purple-l); color:var(--purple); }
    .mi-stl  { background:var(--steel-l);  color:var(--steel); }
    .mi-db   { background:var(--gl);       color:var(--g2); }
    .mi-cr   { background:var(--maroon-l); color:var(--maroon); }
    .mi-con  { background:#e0f2f1; color:#00695c; }
    .mi-oth  { background:#fff8e1; color:#f57f17; }
    .mi-scp  { background:#efebe9; color:#4e342e; }

    .m-lbl { font-size:9px; font-weight:700; color:var(--text); line-height:1.2; margin-bottom:3px; }
    .m-cnt { font-size:1.15rem; font-weight:800; line-height:1; letter-spacing:-.5px; }
    .m-sub { font-size:8px; color:var(--muted); margin-top:2px; }

    /* STATUS BANNERS */
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
      background:rgba(255,255,255,.10); pointer-events:none;
    }
    .st::after {
      content:''; position:absolute; right:24px; bottom:-30px;
      width:60px; height:60px; border-radius:50%;
      background:rgba(255,255,255,.07); pointer-events:none;
    }
   /* STATUS BANNERS - Less Bright */
/* STATUS BANNERS - Much Lighter with White Tones */
/* STATUS BANNERS - Pastel/Soft Colors */
.st-t { background: linear-gradient(130deg, #90caf9 0%, #bbdefb 50%, #e3f2fd 100%); }
.st-v { background: linear-gradient(130deg, #a5d6a7 0%, #c8e6c9 55%, #e8f5e9 100%); }
.st-n { background: linear-gradient(130deg, #ffab91 0%, #ffccbc 55%, #fbe9e7 100%); }
.st-c { background: linear-gradient(130deg, #ef9a9a 0%, #ffcdd2 55%, #ffebee 100%); }
    .st-ico-wrap {
      position:relative; z-index:1; flex-shrink:0;
      width:44px; height:44px; border-radius:50%;
      background:rgba(255,255,255,.15); border:2px solid rgba(255,255,255,.28);
      display:flex; align-items:center; justify-content:center;
    }
    .st-ico-wrap i { font-size:19px; color:#fff; }
    @keyframes pulse-ring {
      0%   { box-shadow:0 0 0 0 rgba(255,255,255,.35); }
      70%  { box-shadow:0 0 0 9px rgba(255,255,255,0); }
      100% { box-shadow:0 0 0 0 rgba(255,255,255,0); }
    }
    .st-v .st-ico-wrap { animation:pulse-ring 2.4s ease infinite; }
    .st-n .st-ico-wrap { animation:pulse-ring 2.4s ease .8s infinite; }
    .st-c .st-ico-wrap { animation:pulse-ring 2.4s ease 1.6s infinite; }
    .st-body { position:relative; z-index:1; flex:1; min-width:0; }
    .st-val  { font-size:1.85rem; font-weight:800; color:#fff; line-height:1; letter-spacing:-1.2px; }
    .st-lbl  { font-size:9px; color:rgba(255,255,255,.78); text-transform:uppercase; letter-spacing:.9px; margin-top:3px; font-weight:700; }
    .st-pct  { font-size:9.5px; color:rgba(255,255,255,.55); margin-top:3px; }
    .st-spark { position:relative; z-index:1; flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:3px; }
    .spark-bar { height:4px; border-radius:2px; background:rgba(255,255,255,.22); overflow:hidden; width:56px; }
 .spark-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #000000, #2c2c2c);
  transition: width 1.2s cubic-bezier(.4,0,.2,1);
  width: 0%;
}
    .st-spark-lbl { font-size:8.5px; color:rgba(255,255,255,.50); }

    /* TYPE LABEL */
    .type-label {
      font-size: 11px;
      font-weight: 700;
     color: rgba(0, 0, 0, 0.65); 
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: .5px;
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
    /* canvas fills the ch-body */
    .ch-body canvas { flex:1; min-height:0; }

    /* donut legend */
    .dl { display:flex; flex-direction:column; margin-top:8px; }
    .dl-row { display:flex; align-items:center; justify-content:space-between; padding:4px 0; border-bottom:1px solid var(--border); font-size:10.5px; }
    .dl-row:last-child { border-bottom:none; }
    .dl-l   { display:flex; align-items:center; gap:7px; color:var(--text); font-weight:500; }
    .dl-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .dl-v   { font-weight:800; font-size:11px; }

    /* Loading indicator */
    .loading { 
      display: flex; align-items: center; justify-content: center; 
      height: 100%; color: var(--muted);
      font-size: 14px;
    }

    /* ANIMATIONS */
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    .summary-bar{animation:fadeUp .25s ease both}
    .hero{animation:fadeUp .30s ease .05s both}
    .mod{animation:fadeUp .35s ease both}
    .mod:nth-child(1){animation-delay:.06s} .mod:nth-child(2){animation-delay:.09s}
    .mod:nth-child(3){animation-delay:.12s} .mod:nth-child(4){animation-delay:.15s}
    .mod:nth-child(5){animation-delay:.18s} .mod:nth-child(6){animation-delay:.21s}
    .mod:nth-child(7){animation-delay:.24s} .mod:nth-child(8){animation-delay:.27s}
    .mod:nth-child(9){animation-delay:.30s}
    .st{animation:fadeUp .35s ease both}
    .st:nth-child(1){animation-delay:.18s} .st:nth-child(2){animation-delay:.23s}
    .st:nth-child(3){animation-delay:.28s} .st:nth-child(4){animation-delay:.33s}
    .ch{animation:fadeUp .35s ease both}
    .ch:nth-child(1){animation-delay:.25s} .ch:nth-child(2){animation-delay:.30s}
    
    
    
    /* Update text colors for light backgrounds */
.st-ico-wrap { 
    background: rgba(0, 0, 0, 0.08); 
    border: 2px solid rgba(0, 0, 0, 0.12);
}
.st-ico-wrap i { 
    color: #333; 
}
.st-val { 
    color: #1a1a1a; 
}
.st-lbl { 
    color: rgba(0, 0, 0, 0.65); 
}
.st-pct { 
     color: rgba(0, 0, 0, 0.65); 
}
.st-spark-lbl { 
     color: rgba(0, 0, 0,1); 
}
.spark-bar { 
     color: rgba(0, 0, 0, 0.65); 
}
.spark-fill { 
     color: rgba(0, 0, 0,1); 
}
.st::before, .st::after {
     color: rgba(0, 0, 0, 0.65); 
}

/* Remove the pulse animation or update its color */
@keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2); }
    70%  { box-shadow: 0 0 0 9px rgba(0, 0, 0, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
}

/* ===== FILTER GROUP STYLING ===== */
.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  user-select: none;
  white-space: nowrap;
}

.filter-label:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.filter-label input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #81C784;
  transition: all 0.2s ease;
}

.filter-label input[type="checkbox"]:checked {
  accent-color: #4caf50;
}

.filter-label input[type="checkbox"]:hover {
  transform: scale(1.1);
}

/* ===== CONTRACT SELECT DROPDOWN ===== */
.contractSelect {
  padding: 7px 12px;
  min-width: 140px;
  height: 34px;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.10);
  color:Black;
  font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23ffffff' d='M1 1l5 5 5-5' stroke='%23ffffff' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
}

.contractSelect:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.contractSelect:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.45);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
}

.contractSelect:active {
  transform: translateY(0);
}

/* Style the dropdown options */
.contractSelect option {
  background: #fff;
  color:black;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 11px;
}

.contractSelect option:hover {
  background: #2e7d32;
}

.contractSelect option:checked {
  background: linear-gradient(#4caf50, #4caf50);
  background-color: #4caf50 !important;
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 1200px) {
  .contractSelect {
    min-width: 120px;
    padding: 6px 10px;
    font-size: 10px;
  }
  
  .filter-group {
    gap: 4px;
    padding: 5px 8px;
  }
  
  .filter-label {
    padding: 3px 6px;
    font-size: 9px;
  }
}

@media (max-width: 768px) {
  .hero-right {
    flex-direction: column;
    gap: 8px;
  }
  
  .contractSelect {
    width: 100%;
    min-width: auto;
  }
  
  .filter-group {
    width: 100%;
    flex-wrap: wrap;
  }
}
  </style>
</head>

<body id="page-top">
<div id="wrapper">
  <%@ include file="InVoiceSideBar.jsp" %>

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
          <div class="hero-icon" ><!-- <i class="fas fa-file-invoice"></i> --></div>
            <div>
              <div class="hero-title">
                <span class="hero-pill"><span class="hero-pill-dot"></span>Live</span>
                Invoice Management System
              </div>
            </div>
          </div>
         <div class="hero-right">

  <!-- Location Filters -->
  <div style="display:flex; align-items:center; gap:10px; color:Black; font-size:11px;">
    
    <label style="display:flex; align-items:center; gap:4px; cursor:pointer;">
      <input type="checkbox" class="regionFilter" value="ALL" checked>
      All
    </label>

    <label style="display:flex; align-items:center; gap:4px; cursor:pointer;">
      <input type="checkbox" class="regionFilter" value=1>
      Bellary
    </label>

    <label style="display:flex; align-items:center; gap:4px; cursor:pointer;">
      <input type="checkbox" class="regionFilter" value=2>
      Gujarat
    </label>

  </div>

  <!-- Contract Dropdown -->
  <select class="contractSelect" style="width:70px;"></select>

</div>
        </div>

        <!-- MODULE TYPE CARDS – 9 cards, each with unique ID -->
        <div class="mod-row">
          <div class="mod m-all active" onclick="goType('ALL',this)">
            <div class="m-ico mi-all"><i class="fas fa-th-list"></i></div>
            <div class="m-lbl">All Invoices</div>
            <div class="m-cnt" id="mc-ALL">0</div>
            <div class="m-sub">records</div>
          </div>
          <div class="mod m-adv" onclick="goType('ADVANCED',this)">
            <div class="m-ico mi-adv"><i class="fas fa-money-bill-wave"></i></div>
            <div class="m-lbl">Advance</div>
            <div class="m-cnt" id="mc-ADV">0</div>
            <div class="m-sub">invoices</div>
          </div>
          <div class="mod m-dc" onclick="goType('DELIVERY_CHALLAN',this)">
            <div class="m-ico mi-dc"><i class="fas fa-truck"></i></div>
            <div class="m-lbl">Delivery Challan</div>
            <div class="m-cnt" id="mc-DC">0</div>
            <div class="m-sub">challans</div>
          </div>
          <div class="mod m-stl" onclick="goType('STEEL',this)">
            <div class="m-ico mi-stl"><i class="fas fa-industry"></i></div>
            <div class="m-lbl">Steel</div>
            <div class="m-cnt" id="mc-STEEL">0</div>
            <div class="m-sub">invoices</div>
          </div>
          <div class="mod m-db" onclick="goType('DEBIT_NOTE',this)">
            <div class="m-ico mi-db"><i class="fas fa-arrow-circle-up"></i></div>
            <div class="m-lbl">Debit Note</div>
            <div class="m-cnt" id="mc-DB">0</div>
            <div class="m-sub">notes</div>
          </div>
          <div class="mod m-cr" onclick="goType('CREDIT_INVOICE',this)">
            <div class="m-ico mi-cr"><i class="fas fa-arrow-circle-down"></i></div>
            <div class="m-lbl">Credit Note</div>
            <div class="m-cnt" id="mc-CR">0</div>
            <div class="m-sub">notes</div>
          </div>
          <div class="mod m-con" onclick="goType('CONSOLIDATED_INVOICE',this)">
            <div class="m-ico mi-con"><i class="fas fa-layer-group"></i></div>
            <div class="m-lbl">Consolidated</div>
            <div class="m-cnt" id="mc-CON">0</div>
            <div class="m-sub">invoices</div>
          </div>
          <div class="mod m-oth" onclick="goType('OTHERS_INVOICE',this)">
            <div class="m-ico mi-oth"><i class="fas fa-ellipsis-h"></i></div>
            <div class="m-lbl">Others</div>
            <div class="m-cnt" id="mc-OTH">0</div>
            <div class="m-sub">invoices</div>
          </div>
          <div class="mod m-scp" onclick="goType('SCRAP_INVOICE',this)">
            <div class="m-ico mi-scp"><i class="fas fa-recycle"></i></div>
            <div class="m-lbl">Scraps</div>
            <div class="m-cnt" id="mc-SCP">0</div>
            <div class="m-sub">invoices</div>
          </div>
        </div>

        <!-- STATUS BANNERS -->
        <div class="status-row">
          <div class="st st-t">
            <div class="st-ico-wrap" style="animation:none;"><i class="fas fa-layer-group"></i></div>
            <div class="st-body">
              <div class="type-label" id="typeLabel">All Types</div>
              <div class="st-val" id="stTotal">0</div>
              <div class="st-lbl">Total Invoices</div>
              <div class="st-pct">All invoice types</div>
            </div>
            <div class="st-spark">
              <div class="spark-bar"><div class="spark-fill" style="width:100%"></div></div>
              <div class="st-spark-lbl">100% base</div>
            </div>
          </div>
          <div class="st st-v">
            <div class="st-ico-wrap"><i class="fas fa-check-double"></i></div>
            <div class="st-body">
              <div class="st-val" id="stV">0</div>
              <div class="st-lbl">Verified Invoices</div>
              <div class="st-pct" id="stVp">0% of total</div>
            </div>
            <div class="st-spark">
              <div class="spark-bar"><div class="spark-fill" id="sp-v"></div></div>
              <div class="st-spark-lbl">verified rate</div>
            </div>
          </div>
          <div class="st st-n">
            <div class="st-ico-wrap"><i class="fas fa-hourglass-start"></i></div>
            <div class="st-body">
              <div class="st-val" id="stN">0</div>
              <div class="st-lbl">Awaiting Verification</div>
              <div class="st-pct" id="stNp">0% of total</div>
            </div>
            <div class="st-spark">
              <div class="spark-bar"><div class="spark-fill" id="sp-n"></div></div>
              <div class="st-spark-lbl">pending rate</div>
            </div>
          </div>
          <div class="st st-c">
            <div class="st-ico-wrap"><i class="fas fa-times-circle"></i></div>
            <div class="st-body">
              <div class="st-val" id="stC">0</div>
              <div class="st-lbl">Cancelled</div>
              <div class="st-pct" id="stCp">0% of total</div>
            </div>
            <div class="st-spark">
              <div class="spark-bar"><div class="spark-fill" id="sp-c"></div></div>
              <div class="st-spark-lbl">cancel rate</div>
            </div>
          </div>
        </div>

        <!-- CHARTS ROW -->
        <div class="charts-row">
          <div class="ch">
            <div class="ch-head">
              <div><div class="ch-title">Status Split</div><div class="ch-sub">By verification state</div></div>
              <span class="ch-tag ct-g">Live</span>
            </div>
            <div class="ch-body">
              <canvas id="donutChart"></canvas>
              <div class="dl" id="donutLegend"></div>
            </div>
          </div>
          <div class="ch">
            <div class="ch-head">
              <div><div class="ch-title">Invoices by Type</div><div class="ch-sub">All 8 categories</div></div>
              <span class="ch-tag ct-b">All types</span>
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

<script src="js/config.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="js/ruang-admin.min.js"></script>
<script src="js/username.js"></script>
<script src="js/logout.js"></script>
<script src="js/Sessionfilter.js"></script>
<script src="js/invoiceDashboard.js?v=<%=ts%>"></script>


</body>
</html>
