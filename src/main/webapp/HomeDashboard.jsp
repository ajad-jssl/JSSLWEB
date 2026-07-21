<%@ page import="com.JSSL2024.property.PropertyLink"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
long ts = System.currentTimeMillis();
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
<link href="img/logo/download.png" rel="icon">
<title>JSSL - Production Dashboard</title>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="css/ruang-admin.min.css" rel="stylesheet">
<link rel="stylesheet" href="css/main.css">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
<script>
    var user_id = sessionStorage.getItem('user_id');
    if (!user_id) { window.location.href = "newlogin.jsp"; }
</script>

<style>
:root {
    --g1: #1b5e20;
    --g2: #2e7d32;
    --g3: #388e3c;
    --g4: #4caf50;
    --gl: #e8f5e9;
    --gm: #c8e6c9;
    --navy: #37499A;
    --navy-l: #e8eaf6;
    --bg: #eef3ee;
    --card: #ffffff;
    --border: #dde8dd;
    --text: #1c2e1c;
    --muted: #5c7a5c;
    --danger: #c62828;
    --danger-l: #ffebee;
    --warn: #e65100;
    --warn-l: #fff3e0;
    --info: #01579b;
    --info-l: #e3f2fd;
    --purple: #6a1b9a;
    --purple-l: #f3e5f5;
    --maroon: #880e4f;
    --maroon-l: #fce4ec;
    --steel: #bf360c;
    --steel-l: #fbe9e7;
    --sh1: 0 1px 3px rgba(46,125,50,.08);
    --sh2: 0 4px 14px rgba(46,125,50,.13);
    --r: 12px;
    --rs: 8px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
    background: var(--bg);
    font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
    color: var(--text);
    overflow-y: auto;
    overflow-x: hidden;
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--gm); border-radius: 3px; }

#content-wrapper { overflow-x: hidden; }
#content { display: flex; flex-direction: column; min-height: 100vh; }

.topbar {
    background-color: #37499A;
    border-bottom: 2px solid var(--g2);
    flex-shrink: 0;
}
.topbar .btn-link { color: #fff !important; }

.dash-canvas {
    flex: 1;
    padding: 10px 18px 28px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
}

.hero {
    flex-shrink: 0;
    background: linear-gradient(90deg, rgba(172,227,185,1) 0%, rgba(232,245,233,1) 100%);
    border-radius: var(--r);
    padding: 12px 20px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    box-shadow: var(--sh1);
    animation: fadeUp .25s ease both;
}
.hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 50% 120% at 100% 50%, rgba(255,255,255,.15) 0%, transparent 55%),
                radial-gradient(ellipse 30% 70% at 0% 0%, rgba(0,0,0,.08) 0%, transparent 60%);
    pointer-events: none;
}
.hero::after {
    content: '';
    position: absolute;
    right: -40px;
    bottom: -40px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    border: 38px solid rgba(46,125,50,.08);
    pointer-events: none;
}

.hero-left {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
}
.hero-logo { height: 120px; width: auto; position: absolute; left: 0; }
.hero-text {
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.hero-title {
    font-size: 32px;
    font-weight: 700;
    color: #16351f;
    letter-spacing: -.8px;
    text-align: center;
   /*  font-family: 'Sora', 'Inter', sans-serif; */
    font-family: "Times New Roman", Times, serif;
    line-height: 1.1;
    
   
}

.live-pill {
    margin-bottom: 6px;
    background: rgba(255,255,255,.55);
    border: 1px solid rgba(0,0,0,.10);
    box-shadow: 0 2px 8px rgba(0,0,0,.06);
}

.dashboard-title-wrap{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:12px;
     margin-left:50px !important;
    
}

.live-indicator{
    display:flex;
    align-items:center;
    gap:6px;
    background:rgba(255,255,255,.55);
    border:1px solid rgba(0,0,0,.10);
    padding:4px 10px;
    border-radius:20px;
    font-size:10px;
    font-weight:800;
    letter-spacing:.8px;
    color:#1b5e20;
    box-shadow:0 2px 8px rgba(0,0,0,.06);
}

.live-dot{
    width:8px;
    height:8px;
    border-radius:50%;
   background:#2e7d32; 
    /*  background:red; */
    
    animation:livePulse 1.4s infinite;
}

@keyframes livePulse{
    0%,100%{
        transform:scale(1);
        opacity:1;
    }
    50%{
        transform:scale(1.5);
        opacity:.45;
    }
}


.hero-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(255,255,255,.40);
    border: 1px solid rgba(0,0,0,.12);
    color: #1b5e20;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .8px;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 20px;
    width: fit-content;
    margin-bottom: 2px;
}
.hero-pill-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--g2);
    animation: livePulse 1.5s infinite;
}

@keyframes livePulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: .5; }
}

.hero-right {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    flex-wrap: wrap;
}

.hero-filter-group {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,.35);
    border: 1px solid rgba(0,0,0,.10);
    border-radius: var(--rs);
    padding: 4px 10px;
}
.hero-filter-label {
    font-size: 9px; font-weight: 700; color: #1c2e1c;
    text-transform: uppercase; letter-spacing: .6px; white-space: nowrap;
}

.contractSelect {
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
.contractSelect:hover { background: rgba(255,255,255,.90); border-color: var(--g2); }
.contractSelect:focus { outline: none; border-color: var(--g2); box-shadow: 0 0 0 2px rgba(46,125,50,.15); }
.contractSelect option { background: #fff; color: #1c2e1c; }

.hero-date-input {
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
.hero-date-input:focus { outline: none; border-color: var(--g2); }
.hero-date-input::-webkit-calendar-picker-indicator { opacity: .6; cursor: pointer; }

.hero-btn {
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
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all .18s;
    white-space: nowrap;
}
.hero-btn:hover { background: var(--g1); }

.factory-checks {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    color: #1c2e1c;
}
.factory-checks label { display: flex; align-items: center; gap: 4px; cursor: pointer; }
.factory-checks input[type="checkbox"] { accent-color: var(--g2); cursor: pointer; width: 14px; height: 14px; }

/* STATUS BANNERS */
.status-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
}

.st {
    border-radius: var(--r);
    padding: 11px 14px;
    display: flex;
    align-items: center;
    gap: 11px;
    position: relative;
    overflow: hidden;
    animation: fadeUp .28s ease both;
}
.st::before {
    content: '';
    position: absolute;
    right: -22px; top: -22px;
    width: 80px; height: 80px;
    border-radius: 50%;
    background: rgba(255,255,255,.22);
    pointer-events: none;
}
.st::after {
    content: '';
    position: absolute;
    right: 22px; bottom: -28px;
    width: 55px; height: 55px;
    border-radius: 50%;
    background: rgba(255,255,255,.12);
    pointer-events: none;
}

.st-rm   { background: linear-gradient(130deg, #ffcdd2 0%, #ffebee 100%); }
.st-prod { background: linear-gradient(130deg, #c8e6c9 0%, #e8f5e9 100%); }
.st-ship { background: linear-gradient(130deg, #bbdefb 0%, #e3f2fd 100%); }
.st-disp { background: linear-gradient(130deg, #ffe0b2 0%, #fff3e0 100%); }
.st-inv  { background: linear-gradient(130deg, #d1c4e9 0%, #ede7f6 100%); }

.st:nth-child(1) { animation-delay: .05s; }
.st:nth-child(2) { animation-delay: .09s; }
.st:nth-child(3) { animation-delay: .13s; }
.st:nth-child(4) { animation-delay: .17s; }
.st:nth-child(5) { animation-delay: .21s; }

.st-ico {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: rgba(0,0,0,.07);
    border: 1.5px solid rgba(0,0,0,.09);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    position: relative; z-index: 1;
}
.st-ico i { font-size: 16px; color: #444; }

.st-body { position: relative; z-index: 1; flex: 1; min-width: 0; }
.st-val  { font-size: 1.6rem; font-weight: 800; color: #1a1a1a; line-height: 1; letter-spacing: -.8px; }
.st-lbl  { font-size: 8.5px; color: rgba(0,0,0,.55);  }
.st-sub  { font-size: 8.5px; color: rgba(0,0,0,.40); margin-top: 1px; }

.st-spark { position: relative; z-index: 1; flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
.spark-bar { height: 3px; width: 50px; border-radius: 2px; background: rgba(0,0,0,.10); overflow: hidden; }
.spark-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--g2), var(--g4)); transition: width 1.2s cubic-bezier(.4,0,.2,1); width: 0%; }
.st-spark-lbl { font-size: 7.5px; color: rgba(0,0,0,.38); }

/* PANELS */
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.row-1 { display: grid; grid-template-columns: 1fr; }

.panel {
    background: var(--card);
    border-radius: var(--r);
    border: 1px solid var(--border);
    box-shadow: var(--sh1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: fadeUp .30s ease both;
}

.panel-head {
    padding: 9px 14px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid Black;
    flex-shrink: 0;
}
.panel-title { font-size: 11px; font-weight: 700; color: var(--text); }
.panel-sub   { font-size: 9px; color: var(--muted); margin-top: 1px; }

.panel-tag {
    font-size: 9px; font-weight: 700;
    padding: 2px 8px; border-radius: 20px;
    /* text-transform: uppercase; letter-spacing: .3px; */
}
.tag-rm   { background: var(--danger-l); color: var(--danger); }
.tag-ship { background: var(--navy-l);   color: var(--navy);   }
.tag-prod { background: var(--gl);       color: var(--g2);     }
.tag-disp { background: var(--warn-l);   color: var(--warn);   }
.tag-inv  { background: var(--purple-l); color: var(--purple); }

.panel-body { flex: 1; padding: 10px 14px 12px; }
.chart-wrap { position: relative; width: 100%; }
.h-200 { height: 200px; }
.h-240 { height: 240px; }

/* Extra top padding so "above-bar" labels don't clip */
.chart-wrap-padded { padding-top: 22px; }

.legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 8px;
    padding-top: 7px;
    border-top: 1px solid Black;
}
.leg-item { display: flex; align-items: center; gap: 5px; font-size: 9.5px; color: var(--muted); font-weight: 500; }
.leg-dot  { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }

/* Loading overlay */
.chart-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,.75);
    border-radius: 6px;
    font-size: 11px;
    color: var(--muted);
    font-weight: 600;
    letter-spacing: .4px;
    z-index: 5;
}
.chart-loading i { margin-right: 6px; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0);   }
}

@media (max-width: 1100px) {
    .hero-right { gap: 7px; }
    .contractSelect { min-width: 80px; }
}
@media (max-width: 900px) {
    .row-2 { grid-template-columns: 1fr; }
    .status-row { grid-template-columns: 1fr 1fr; }
    .hero { flex-direction: column; align-items: flex-start; }
}
</style>
</head>

<body id="page-top">
<div id="wrapper">
    <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">

            <!-- NAVBAR -->
            <nav class="navbar navbar-expand navbar-light topbar mb-0 static-top"
                 style="background-color: #37499A; border-bottom: 2px solid var(--g2);">
                <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
                    <i class="fa fa-bars" style="color:#fff"></i>
                </button>
                <ul class="navbar-nav ml-auto">
                    <button class="btn btn-link" onclick="window.location.href='Landingpage.jsp'"
                            style="color:#fff; border:none; background:transparent;">
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
						<div class="hero-left">
							<img src="img/logo/jssl_logo_transparent.png" alt="JSSL Logo"
								class="hero-logo" onerror="this.style.display='none'">

							<div class="hero-text">

								<div class="dashboard-title-wrap">
									<div class="live-indicator">
										<span class="live-dot"></span> LIVE
									</div>

									<div class="hero-title">Plant Dashboard</div>
								</div>

							</div>
						</div>

						<div class="hero-right">
                        <!-- Factory checkboxes -->
                        <div class="factory-checks">
                            <label><input type="checkbox" class="factoryFilter" value="ALL" checked onchange="onFactoryChange(this)"> All</label>
                            <label><input type="checkbox" class="factoryFilter" value="1" onchange="onFactoryChange(this)"> Bellary</label>
                            <label><input type="checkbox" class="factoryFilter" value="2" onchange="onFactoryChange(this)"> Gujarat</label>
                        </div>

                        <!-- Contract dropdown -->
                        <select class="contractSelect" id="contractFilter" onchange="applyFilter()">
                            <option value="ALL">All</option>
                        </select>

                        <!-- Date range -->
                        <div class="hero-filter-group">
                            <span class="hero-filter-label">From</span>
                            <input type="date" class="hero-date-input" id="dateFrom">
                        </div>
                        <div class="hero-filter-group">
                            <span class="hero-filter-label">To</span>
                            <input type="date" class="hero-date-input" id="dateTo">
                        </div>

                        <!-- Refresh -->
                        <button class="hero-btn" onclick="applyFilter()">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                    </div>
                </div>

                <!-- STATUS BANNERS -->
                <div class="status-row">
                    <div class="st st-rm">
                        <div class="st-ico"><i class="fas fa-boxes"></i></div>
                        <div class="st-body">
                            <div class="st-val" id="sumRM">—</div>
                            <div class="st-lbl">RM Stock (MT)</div>
                            <div class="st-sub" hidden>Total RM stock weight</div>
                        </div>
                        <div class="st-spark" hidden>
                            <div class="spark-bar"><div class="spark-fill" style="width:100%"></div></div>
                            <div class="st-spark-lbl">100% base</div>
                        </div>
                    </div>

                    <div class="st st-disp">
                        <div class="st-ico"><i class="fas fa-truck-loading"></i></div>
                        <div class="st-body">
                            <div class="st-val" id="sumDisp">—</div>
                            <div class="st-lbl">FG Stock (MT)</div>
                            <div class="st-sub" hidden>FG Stock total</div>
                        </div>
                        <div class="st-spark" hidden>
                            <div class="spark-bar"><div class="spark-fill" id="spDisp" style="width:0%"></div></div>
                            <div class="st-spark-lbl" id="spDispLbl">—</div>
                        </div>
                    </div>

                    <div class="st st-prod">
                        <div class="st-ico"><i class="fas fa-industry"></i></div>
                        <div class="st-body">
                            <div class="st-val" id="sumProd">—</div>
                            <div class="st-lbl">Production (MT)</div>
                            <div class="st-sub"> Assembled weight</div>
                        </div>
                        <div class="st-spark" hidden>
                            <div class="spark-bar"><div class="spark-fill" id="spProd" style="width:0%"></div></div>
                            <div class="st-spark-lbl" id="spProdLbl">—</div>
                        </div>
                    </div>

                    <div class="st st-ship">
                        <div class="st-ico"><i class="fas fa-shipping-fast"></i></div>
                        <div class="st-body">
                            <div class="st-val" id="sumShip">—</div>
                            <div class="st-lbl">Dispatch (MT)</div>
                            <div class="st-sub" hidden>Total dispatched weight</div>
                        </div>
                        <div class="st-spark" hidden>
                            <div class="spark-bar"><div class="spark-fill" id="spShip" style="width:0%"></div></div>
                            <div class="st-spark-lbl" id="spShipLbl">—</div>
                        </div>
                    </div>

                    <div class="st st-inv">
                        <div class="st-ico"><i class="fas fa-file-invoice"></i></div>
                        <div class="st-body">
                            <div class="st-val" id="inoviceDis">—</div>
                            <div class="st-lbl">Invoice Values(&#8377;)</div>
                        </div>
                        <div class="st-spark" hidden></div>
                    </div>
                </div>

                <!-- ROW 1: Raw Material + FG Stock -->
                <div class="row-2">
                    <div class="panel" style="animation-delay:.08s">
                        <div class="panel-head">
                            <div>
                                <span class="panel-tag tag-rm">RM Stock</span>
                                <div class="panel-sub" hidden>Weight by Job Code — colour-graded by volume</div>
                            </div>
                           
                        </div>
                        <div class="panel-body">
                            <div class="chart-wrap h-200 chart-wrap-padded" style="position:relative;">
                                <div class="chart-loading" id="loadRM"><i class="fas fa-circle-notch"></i> Loading…</div>
                                <canvas id="rmChart"></canvas>
                            </div>
 <div class="legend">
    <div class="leg-item">
        <div class="leg-dot" style="background:#e57373"></div>
        &gt; 150 MT
    </div>

    <div class="leg-item">
        <div class="leg-dot" style="background:#FFB300"></div>
        &lt;= 150 MT
    </div>
</div>
                        </div>
                    </div>

                    <div class="panel" style="animation-delay:.17s">
                        <div class="panel-head">
                            <div>
                                 <span class="panel-tag tag-disp">FG Stock</span>
                                <div class="panel-sub" hidden>Weight in despatch yard by Job Code</div>
                            </div>
                           
                        </div>
                        <div class="panel-body">
                            <div class="chart-wrap h-200 chart-wrap-padded" style="position:relative;">
                                <div class="chart-loading" id="loadDisp"><i class="fas fa-circle-notch"></i> Loading…</div>
                                <canvas id="dispChart"></canvas>
                            </div>
                            <div class="legend">
                                <div class="leg-item">
        <div class="leg-dot" style="background:#e57373"></div>
        &gt; 150 MT
    </div>

    <div class="leg-item">
        <div class="leg-dot" style="background:#FFB300"></div>
        &lt;= 150 MT
    </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ROW 2: Production full width -->
                <div class="row-1">
                    <div class="panel" style="animation-delay:.14s">
                        <div class="panel-head">
                            <div>
                                <span class="panel-tag tag-prod">Production</span>
                                <div class="panel-sub" hidden>Assembled, Welded &amp; Treated weight per JobCode (MT)</div>
                            </div>
                            
                        </div>
                        <div class="panel-body">
                            <div class="chart-wrap h-240 chart-wrap-padded" style="position:relative;">
                                <div class="chart-loading" id="loadProd"><i class="fas fa-circle-notch"></i> Loading…</div>
                                <canvas id="prodChart"></canvas>
                            </div>
                            <div class="legend">
                                <div class="leg-item"><div class="leg-dot" style="background:#4CAF50"></div>Assembled </div>
                                <div class="leg-item"><div class="leg-dot" style="background:#FFC107"></div>Welded </div>
                                <div class="leg-item"><div class="leg-dot" style="background:#37499A"></div>Treated </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ROW 3: Dispatch + Invoices -->
                <div class="row-2">
                    <div class="panel" style="animation-delay:.11s">
                        <div class="panel-head">
                            <div>
                               <span class="panel-tag tag-ship">Dispatch</span>
                                <div class="panel-sub" hidden>Total shipment weight by Job Code (MT)</div>
                            </div>
                           
                        </div>
                        <div class="panel-body">
                            <div class="chart-wrap h-200 chart-wrap-padded" style="position:relative;">
                                <div class="chart-loading" id="loadShip"><i class="fas fa-circle-notch"></i> Loading…</div>
                                <canvas id="shipChart"></canvas>
                            </div>
                            <div class="legend">
                               <div class="leg-item">
        <div class="leg-dot" style="background:#66BB6A"></div>
        &gt; 150 MT
    </div>

    <div class="leg-item">
        <div class="leg-dot" style="background:#FFC107"></div>
        &lt;= 150 MT
    </div>
                            </div>
                        </div>
                    </div>

                    <div class="panel" style="animation-delay:.20s">
                        <div class="panel-head">
                            <div>
                                <span class="panel-tag tag-inv">Invoice</span>
                                <div class="panel-sub " hidden>Invoice count by Job Code</div>
                            </div>
                            
                        </div>
                        <div class="panel-body">
                            <div class="chart-wrap h-200 chart-wrap-padded" style="position:relative;">
                                <div class="chart-loading" id="loadInv"><i class="fas fa-circle-notch"></i> Loading…</div>
                                <canvas id="invChart"></canvas>
                            </div>
                           <div class="legend">
    <div class="leg-item"><div class="leg-dot" style="background:#66BB6A"></div>&gt; 50 L</div>
    <div class="leg-item"><div class="leg-dot" style="background:#FFC107"></div>&lt;= 50 L</div>
</div>
                        </div>
                    </div>
                </div>

            </div><!-- end dash-canvas -->
        </div>
    </div>
</div>

<script src="js/config.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="js/ruang-admin.min.js"></script>
<script src="js/username.js"></script>
<script src="js/logout.js"></script>
<script src="js/Sessionfilter.js"></script>

<script>
/* ============================================================
   REGISTER DATALABELS PLUGIN GLOBALLY
   ============================================================ */
Chart.register(ChartDataLabels);

/* ============================================================
   COLOR HELPERS
   ============================================================ */
   function rmColor(w) {
	    return w > 150 ? '#e57373' : '#FFB300';
	}
   function dispColor(w) {  return w > 150 ? '#e57373' : '#FFB300';   }
   function shipColor(w) {
       return w >= 150 ? '#66BB6A' :   // Green
            '#FFB300' ;
                       
   }

   /* INVOICE COLORS */
function invColor(v) {
    return v >= 5000000 ? '#66BB6A' :   // >= 50 L → green
                          '#FFC107';    // below   → yellow
}


/* ============================================================
   CHART DEFAULTS
   ============================================================ */
Chart.defaults.color      = '#5c7a5c';
Chart.defaults.font.family = "'Plus Jakarta Sans','Segoe UI',sans-serif";
Chart.defaults.font.size   = 10;

const GRID = { color: 'rgba(28,46,28,.06)', drawBorder: false };
const TICK  = { color: '#5c7a5c', font: { size: 9 } };

/* Base options — includes datalabels config for single-dataset bar charts */
function baseOpts(labelKey) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 20 } },
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end',
                align: 'end',
                offset: 2,
                color: '#333',
                font: { size: 9, weight: '600', family: "'Plus Jakarta Sans','Segoe UI',sans-serif" },
                formatter: function(value) {
                    if (value === null || value === undefined || value === 0) return '';
                    return Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 });
                },
                clip: false
            },
            tooltip: {
                backgroundColor: '#1c2e1c',
                borderColor: '#dde8dd',
                borderWidth: 1,
                titleColor: '#e8f5e9',
                bodyColor: '#c8e6c9',
                padding: 8,
                callbacks: {
                    label: ctx => '  ' + Number(ctx.raw).toLocaleString(undefined, { maximumFractionDigits: 2 })
                }
            }
        },
        scales: {
            x: { grid: GRID, ticks: { ...TICK, maxRotation: 30 }, border: { display: false } },
            y: { grid: GRID, ticks: TICK, border: { display: false } }
        },
        animation: { duration: 800, easing: 'easeOutQuart' }
    };
}

/* Grouped bar opts (production) — datalabels inside bars */
// ============================================================
// REPLACE groupedOpts() with this dynamic version
// ============================================================
function groupedOpts(itemCount) {
    const isSingle = itemCount === 1;
    return {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 20, left: isSingle ? 80 : 0, right: isSingle ? 80 : 0 } },
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end',
                align: 'end',
                offset: 2,
                color: '#333',
                font: { size: 8, weight: '600', family: "'Plus Jakarta Sans','Segoe UI',sans-serif" },
                formatter: function(value) {
                    if (!value || value === 0) return '';
                    return Number(value).toFixed(1);
                },
                clip: false
            },
            tooltip: {
                backgroundColor: '#1c2e1c',
                borderColor: '#dde8dd',
                borderWidth: 1,
                titleColor: '#e8f5e9',
                bodyColor: '#c8e6c9',
                padding: 8,
                callbacks: {
                    label: ctx => ' ' + ctx.dataset.label + ': ' +
                        Number(ctx.raw).toLocaleString(undefined, { maximumFractionDigits: 2 })
                }
            }
        },
        scales: {
            x: {
                grid: GRID,
                ticks: { ...TICK, maxRotation: 30 },
                border: { display: false }
                // ✅ NO min/max here — was causing empty slots
            },
            y: { grid: GRID, ticks: TICK, border: { display: false } }
        },
        animation: { duration: 800, easing: 'easeOutQuart' }
    };
}
const charts = {};


function showLoader(id)  { const el = document.getElementById(id); if (el) el.style.display = 'flex'; }
function hideLoader(id)  { const el = document.getElementById(id); if (el) el.style.display = 'none'; }


   function updateBanners(rmItems,rmTotal, prodItems,ProdTotal, shipItmes,shipTotal, dispItems, invItems,invTotal, dispTotal) {  // ✅ added dispTotal param
	    const sumRM   = formatIndianNumber(rmTotal);
	    const sumProd = formatIndianNumber(ProdTotal);
	    const sumShip = formatIndianNumber(shipTotal);
	    const sumDisp = formatIndianNumber(dispTotal);                                         // ✅ use the number param
	    const sumInv  = formatToLakhs(invTotal);

	    document.getElementById('sumRM').textContent   = sumRM.toLocaleString(undefined, { maximumFractionDigits: 0 });
	    document.getElementById('sumProd').textContent = sumProd.toLocaleString(undefined, { maximumFractionDigits: 1 });
	    document.getElementById('sumShip').textContent = sumShip.toLocaleString(undefined, { maximumFractionDigits: 1 });
	    document.getElementById('sumDisp').textContent = sumDisp.toLocaleString(undefined, { maximumFractionDigits: 1 });
	    document.getElementById('inoviceDis').textContent = sumInv;

	    const pctProd = sumRM   > 0 ? Math.min(100, (sumProd / sumRM)   * 100) : 0;
	    const pctShip = sumProd > 0 ? Math.min(100, (sumShip / sumProd) * 100) : 0;
	    const pctDisp = sumProd > 0 ? Math.min(100, (sumDisp / sumProd) * 100) : 0;

	    document.getElementById('spProd').style.width = pctProd.toFixed(1) + '%';
	    document.getElementById('spShip').style.width = pctShip.toFixed(1) + '%';
	    document.getElementById('spDisp').style.width = pctDisp.toFixed(1) + '%';

	    document.getElementById('spProdLbl').textContent = pctProd.toFixed(0) + '% of RM';
	    document.getElementById('spShipLbl').textContent = pctShip.toFixed(0) + '% shipped';
	    document.getElementById('spDispLbl').textContent = pctDisp.toFixed(0) + '% of prod';
	}


async function buildAll() {

    const selectedFactory  = document.querySelector('.factoryFilter:checked')?.value || 'ALL';
    const selectedContract = document.getElementById('contractFilter').value;

    /* Show loaders */
    ['loadRM', 'loadDisp', 'loadProd', 'loadShip', 'loadInv'].forEach(showLoader);

    /* Fetch all in parallel */
   const [rm, dispResponse, prod, ship, inv] = await Promise.all([
    loadRawMaterialData(selectedFactory, selectedContract),
    loadShipmentData(selectedFactory, selectedContract),   // now returns { items, total }
    loadProductionData(selectedFactory, selectedContract),
    loadDispatchData(selectedFactory, selectedContract),
    loadInvoiceData(selectedFactory, selectedContract)
]);

   updateBanners(rm.items,rm.total,prod.items, prod.total, ship.items,ship.total, dispResponse.items, inv.items,inv.total, dispResponse.total); 
    /* ── RAW MATERIAL chart ── */
    hideLoader('loadRM');
    if (charts.rm) charts.rm.destroy();
    charts.rm = new Chart(document.getElementById('rmChart'), {
        type: 'bar',
        data: {
            labels: rm.items.map(d => d.jobCode),
            datasets: [{
                data: rm.items.map(d => d.weight),
                backgroundColor: rm.items.map(d => rmColor(d.weight)),
                borderRadius: 4,
                borderSkipped: false,
                categoryPercentage: 0.85,
                barPercentage: 0.7,
                maxBarThickness: 50
            }]
        },
        options: baseOpts()
    });

    /* ── FG STOCK (shipment endpoint) chart ── */
hideLoader('loadDisp');

if (charts.disp) charts.disp.destroy();

charts.disp = new Chart(document.getElementById('dispChart'), {
    type: 'bar',
    data: {
        labels: dispResponse.items.map(d => d.job),       // ✅ was dispResponse.map
        datasets: [{
            data: dispResponse.items.map(d => d.weight),  // ✅ was dispResponse.map
            backgroundColor: dispResponse.items.map(d => dispColor(d.weight)),
            borderRadius: 4,
            borderSkipped: false,
            categoryPercentage: 0.85,
            barPercentage: 0.7,
            maxBarThickness: 50
        }]
    },
    options: baseOpts()
});

    /* ── PRODUCTION grouped bar chart ── */
// ============================================================
// REPLACE the production chart block inside buildAll()
// ============================================================
hideLoader('loadProd');
if (charts.prod) charts.prod.destroy();

const isSingleContract = prod.items.length === 1;
const count = prod.items.length;

// ✅ Dynamic categoryPercentage — fills space properly at every count
const catPct  = isSingleContract ? 0.15
              : count <= 3  ? 0.35
              : count <= 5  ? 0.55
              : count <= 8  ? 0.75
              : count <= 12 ? 0.88
              : 0.92;

// ✅ Dynamic maxBarThickness — wider bars when fewer items
const maxThick = isSingleContract ? 40
               : count <= 3  ? 55
               : count <= 5  ? 50
               : count <= 8  ? 45
               : count <= 12 ? 38
               : 32;

charts.prod = new Chart(document.getElementById('prodChart'), {
    type: 'bar',
    data: {
        labels: prod.items.map(d => d.label),
        datasets: [
            {
                label: 'Assembled',
                data: prod.items.map(d => d.assembled),
                backgroundColor: '#66BB6A',
                borderRadius: 4,
                borderSkipped: false,
                categoryPercentage: catPct,
                barPercentage: 1.0,        // ✅ changed
                maxBarThickness: maxThick
            },
            {
                label: 'Welded',
                data: prod.items.map(d => d.welded),
                backgroundColor: '#FFB300',
                borderRadius: 4,
                borderSkipped: false,
                categoryPercentage: catPct,
                barPercentage: 1.0,        // ✅ changed
                maxBarThickness: maxThick
            },
            {
                label: 'Treated',
                data: prod.items.map(d => d.treated),
                backgroundColor: '#5c7fc0',
                borderRadius: 4,
                borderSkipped: false,
                categoryPercentage: catPct,
                barPercentage: 1.0,        // ✅ changed
                maxBarThickness: maxThick
            }
        ]
    },
    options: groupedOpts(prod.items.length)
});
    /* ── DISPATCH chart ── */
    hideLoader('loadShip');
    if (charts.ship) charts.ship.destroy();
    charts.ship = new Chart(document.getElementById('shipChart'), {
        type: 'bar',
        data: {
            labels: ship.items.map(d => d.job),
            datasets: [{
                data: ship.items.map(d => d.weight),
                backgroundColor: ship.items.map(d => shipColor(d.weight)),
                borderRadius: 4,
                borderSkipped: false,
                categoryPercentage: 0.85,
                barPercentage: 0.7,
                maxBarThickness: 50
            }]
        },
        options: baseOpts()
    });

    /* ── INVOICE chart ── */
    /* ── INVOICE chart ── */
hideLoader('loadInv');
if (charts.inv) charts.inv.destroy();
charts.inv = new Chart(document.getElementById('invChart'), {
    type: 'bar',
    data: {
        labels: inv.items.map(d => d.job),
        datasets: [{
            data:            inv.items.map(d => d.value),      // raw number
            backgroundColor: inv.items.map(d => invColor(d.value)),
            borderRadius: 4,
            borderSkipped: false,
            categoryPercentage: 0.85,
            barPercentage: 0.7,
            maxBarThickness: 50
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 20 } },
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end',
                align: 'end',
                offset: 2,
                color: '#333',
                font: { size: 9, weight: '600', family: "'Plus Jakarta Sans','Segoe UI',sans-serif" },
                clip: false,
                formatter: value => value ? formatToLakhs(value) : ''   // ← lakhs above bar
            },
            tooltip: {
                backgroundColor: '#1c2e1c',
                borderColor: '#dde8dd',
                borderWidth: 1,
                titleColor: '#e8f5e9',
                bodyColor: '#c8e6c9',
                padding: 8,
                callbacks: {
                    label: ctx => '  ' + formatToLakhs(ctx.raw)         // ← lakhs in tooltip
                }
            }
        },
        scales: {
            x: { grid: GRID, ticks: { ...TICK, maxRotation: 30 }, border: { display: false } },
            y: {
                grid: GRID,
                border: { display: false },
                ticks: {
                    color: '#5c7a5c',
                    font: { size: 9 },
                    callback: value => formatToLakhs(value)              // ← lakhs on Y axis
                }
            }
        },
        animation: { duration: 800, easing: 'easeOutQuart' }
    }
});
}

/* ============================================================
   FACTORY CHECKBOX LOGIC
   ============================================================ */
async function onFactoryChange(el) {
    document.querySelectorAll('.factoryFilter').forEach(c => c.checked = false);
    el.checked = true;

    let factory = 'All';
    if (el.value === '1') factory = 1;
    else if (el.value === '2') factory = 2;

    await loadContracts(factory);
    applyFilter();
}

function applyFilter() { buildAll(); }

/* ============================================================
   INIT
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
    const uid = sessionStorage.getItem('username') || sessionStorage.getItem('user_id') || 'User';
    const el  = document.getElementById('usernameDisplay');
    if (el) el.textContent = uid;

    buildAll();
});

function formatIndianNumber(value, decimals = 1) {

    return Number(value || 0).toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });

}

function formatToLakhs(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return "0 L";
    }

    const lakhs = value / 100000;

    return lakhs.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " L";
}
</script>

<script src="js/config.js"></script>
<script src="js/HomeDashBoard.js"></script>
</body>
</html>
