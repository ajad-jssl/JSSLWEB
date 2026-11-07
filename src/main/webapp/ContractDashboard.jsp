<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" isELIgnored="true" %>
<%
  response.setHeader("Cache-Control","no-cache,no-store,must-revalidate");
  response.setHeader("Pragma","no-cache");
  response.setDateHeader("Expires",0);
%>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
  <link href="img/logo/download.png" rel="icon">
  <title>JSSL - Manpower Dashboard</title>
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">

  <!-- Chart.js (legacy v2 API, same as Invoice Dashboard) -->
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
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    #content-wrapper { overflow:hidden; }
    #content { display:flex; flex-direction:column; height:100vh; overflow:hidden; }
    .topbar  { flex-shrink:0; }

    /* ===== SUMMARY BAR (same as Invoice) ===== */
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

    .dash-canvas {
      flex: 1; overflow: hidden;
      padding: 10px 20px 12px;
      display: flex; flex-direction: column; gap: 10px;
       font-family:  "Times New Roman", Times, serif !important;
    }

    /* ===== HERO (same as Invoice) ===== */
    .hero {
      flex-shrink: 0;
/*  background: linear-gradient(90deg,rgba(172,227,185,1) 0%, rgba(255,255,255,1) 100%); */
      background :linear-gradient(180deg, rgb(156 255 159) 0%, rgb(197 255 199) 100%);
      
      border-radius: var(--r);
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
      border:44px solid rgba(255,255,255,.25); pointer-events:none;
    }
    .hero-left { position:relative; z-index:1; display:flex; align-items:center; gap:14px; }
    .hero-title { font-size:26px; font-weight:600; color:#1c2e1c; line-height:1.1; letter-spacing:-.2px; }
    .hero-sub   { font-size:11px; color:rgba(0,0,0,.55); margin-top:3px; }
    .hero-pill {
      display:inline-flex; align-items:center; gap:5px;
      background:rgba(255,255,255,.55); border:1px solid rgba(0,0,0,.25);
      color:#1c2e1c; font-size:15px; font-weight:700;
      letter-spacing:.9px; text-transform:uppercase;
      padding:2px 8px; border-radius:20px; margin-right:8px;
    }
    .hero-pill-dot {
      width:8px; height:8px; border-radius:50%; background:#2e7d32;
      animation: livePulse 1.5s infinite; display:inline-block;
    }
    @keyframes livePulse {
      0%   { transform: scale(.6); opacity: 1; }
      50%  { transform: scale(1); opacity: .5; }
      100% { transform: scale(1); opacity: 1; }
    }
    .hero-right { position:relative; z-index:1; display:flex; align-items:center; gap:10px; flex-shrink:0; }

    .section-label {
      font-size: 11px; font-weight: 700; color: var(--muted);
      text-transform: uppercase; letter-spacing: .6px;
      margin-bottom: 6px; display:flex; align-items:center; gap:8px;
    }
    .section-label .cnt-pill {
      background:var(--gl); color:var(--g2); font-size:9px; font-weight:700;
      padding:1px 8px; border-radius:10px;
    }

    /* ===== MODULE CARDS (same visual language as Invoice's mod-row) ===== */
    .mod-row {
      flex-shrink: 0;
      display: grid;
      gap: 8px;
    }
   /*  .loc-row  { grid-template-columns: repeat(5, 1fr); } */
    .loc-row  { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
    .type-row { grid-template-columns: repeat(3, 1fr); }

/*     .mod {
      background: var(--card); border-radius: var(--r);
      border: 1.5px solid var(--border); padding: 10px 8px 8px;
      cursor: pointer; transition: all .2s; position: relative;
      overflow: hidden; text-align: center;
    } */
    
    .mod {
  background: var(--card); border-radius: var(--r);
  border: 1.5px solid var(--border); padding: 10px 6px 9px;
  cursor: pointer; transition: all .2s; position: relative;
  overflow: visible; text-align: center;
}
    .mod::after {
      content:''; position:absolute; bottom:0; left:0; right:0; height:3px;
      transform:scaleX(0); transform-origin:left; transition:transform .22s ease;
    }
    .mod:hover::after, .mod.active::after { transform:scaleX(1); }
    .mod:hover, .mod.active { box-shadow:var(--sh2); transform:translateY(-2px); border-color:transparent; }
    .mod.active { background:linear-gradient(160deg,#f6fff6,#edfaed); }

    /* bottom bar colours per card, borrowed from Invoice's palette */
    .m-all::after  { background:var(--navy); }
    .m-adv::after  { background:#1565c0; }
    .m-dc::after   { background:var(--purple); }
    .m-stl::after  { background:var(--steel); }
    .m-db::after   { background:var(--g2); }
    .m-oth::after  { background:#f57f17; }

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
    .mi-oth  { background:#fff8e1;         color:#f57f17; }

    .m-lbl { font-size:9px; font-weight:700; color:var(--text); line-height:1.2; margin-bottom:3px; }
    .m-cnt { font-size:1.15rem; font-weight:900; line-height:1; letter-spacing:-.5px; color:black; }
    .m-sub { font-size:8px; color:var(--muted); margin-top:2px; }

 /* ===== ON ROLL / CONTRACTOR SPLIT INSIDE LOCATION BOX ===== */
.m-split {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 4px;
  flex-wrap: wrap;
}
.m-split-or, .m-split-ct {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  line-height: 1.4;
}
.m-split-or { background: var(--gm); color: black; }
.m-split-ct { background: var(--warn-l); color: black; }
.m-split b { font-weight: 800; font-size: 11px; }

    /* ===== STATUS BANNERS (same as Invoice) ===== */
    .status-row {
      flex-shrink: 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .st {
      border-radius: var(--r); padding: 12px 15px;
      display: flex; align-items: center; gap: 12px;
      position: relative; overflow: hidden;
      cursor: pointer; transition: all .2s;
    }
    .st:hover { transform: translateY(-2px); box-shadow: var(--sh2); }
    .st.active-type { outline: 3px solid rgba(0,0,0,.28); outline-offset: -3px; }
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
    .st-t { background: linear-gradient(130deg, #90caf9 0%, #bbdefb 50%, #e3f2fd 100%); }
    .st-v { background: linear-gradient(130deg, #a5d6a7 0%, #c8e6c9 55%, #e8f5e9 100%); }
    .st-n { background: linear-gradient(130deg, #ffab91 0%, #ffccbc 55%, #fbe9e7 100%); }

    .st-ico-wrap {
      position:relative; z-index:1; flex-shrink:0;
      width:44px; height:44px; border-radius:50%;
      background: rgba(0,0,0,.08); border: 2px solid rgba(0,0,0,.12);
      display:flex; align-items:center; justify-content:center;
    }
    .st-ico-wrap i { font-size:19px; color:#333; }
    @keyframes pulse-ring {
      0%   { box-shadow:0 0 0 0 rgba(0,0,0,.2); }
      70%  { box-shadow:0 0 0 9px rgba(0,0,0,0); }
      100% { box-shadow:0 0 0 0 rgba(0,0,0,0); }
    }
    .st-v .st-ico-wrap { animation:pulse-ring 2.4s ease infinite; }
    .st-n .st-ico-wrap { animation:pulse-ring 2.4s ease .8s infinite; }
    .st-body { position:relative; z-index:1; flex:1; min-width:0; }
    .st-val  { font-size:1.85rem; font-weight:800; color:#1a1a1a; line-height:1; letter-spacing:-1.2px; }
    .st-lbl  { font-size:9px; color:rgba(0,0,0,.65); text-transform:uppercase; letter-spacing:.9px; margin-top:3px; font-weight:700; }
    .st-pct  { font-size:9.5px; color:rgba(0,0,0,.65); margin-top:3px; }
    .st-spark { position:relative; z-index:1; flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:3px; }
    .spark-bar { height:4px; border-radius:2px; background:rgba(0,0,0,.15); overflow:hidden; width:56px; }
    .spark-fill {
      height: 100%; border-radius: 2px;
      background: linear-gradient(90deg, #000000, #2c2c2c);
      transition: width 1.2s cubic-bezier(.4,0,.2,1);
      width: 0%;
    }
    .st-spark-lbl { font-size:8.5px; color:rgba(0,0,0,.55); }

    .type-label {
      font-size: 11px; font-weight: 700; color: rgba(0,0,0,.65);
      margin-bottom: 8px; text-transform: uppercase; letter-spacing: .5px;
    }

    /* ===== CHARTS (same as Invoice) ===== */
    .charts-row {
      flex: 1; min-height: 0;
      display: grid;
      grid-template-columns: 0.8fr 0.7fr 1.3fr;
      gap: 10px;
    }
    .ch {
      background: var(--card); border-radius: var(--r);
      border: 1px solid var(--border); box-shadow: var(--sh1);
      overflow: hidden; display:flex; flex-direction:column;
    }
    .ch-head {
      padding: 10px 14px 0;
      display: flex; align-items: flex-start; justify-content: space-between;
      flex-shrink: 0; gap: 8px;
    }
    .ch-head > div:first-child { min-width: 0; flex: 1; }
    .ch-title { font-size:11px; font-weight:700; color:var(--text); overflow-wrap:break-word; }
    .ch-sub   { font-size:9px; color:var(--muted); margin-top:1px; overflow-wrap:break-word; }
    .ch-tag   { font-size:9px; font-weight:700; padding:2px 8px; border-radius:20px; letter-spacing:.3px; text-transform:uppercase; flex-shrink:0; }
    .ct-g { background:var(--gl); color:var(--g2); }
    .ct-b { background:var(--navy-l); color:var(--navy); }
    .ch-body {
      flex: 1; min-height: 0;
      padding: 8px 12px 12px;
      display: flex; flex-direction: column; justify-content: center;
      position: relative;
    }
    .ch-body canvas { flex:1; min-height:0; }

    /* Pie charts (Companies, Skill Distribution) get a fixed 1:1 square box
       so the circle can never get squashed into an oval when the legend
       below it takes up a different amount of vertical space (e.g. long
       company names wrapping to 2 lines vs. short skill labels). */
    .pie-canvas-box {
      position: relative;
      width: 100%;
      max-width: 220px;
      aspect-ratio: 1 / 1;
      margin: 0 auto;
      flex-shrink: 0;
    }
    .pie-canvas-box canvas {
      position: absolute;
      inset: 0;
      width: 100% !important;
      height: 100% !important;
    }

    .dl { display:flex; flex-direction:column; margin-top:8px; }
    .dl-row { display:flex; align-items:center; justify-content:space-between; padding:4px 0; border-bottom:1px solid var(--border); font-size:10.5px; }
    .dl-row:last-child { border-bottom:none; }
    .dl-l   { display:flex; align-items:center; gap:7px; color:var(--text); font-weight:500; }
    .dl-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .dl-v   { font-weight:800; font-size:11px; }

    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    .summary-bar{animation:fadeUp .25s ease both}
    .hero{animation:fadeUp .30s ease .05s both}
    .mod{animation:fadeUp .35s ease both}
    .st{animation:fadeUp .35s ease both}
    .ch{animation:fadeUp .35s ease both}
    
    
    
/* ===== RESPONSIVE ===== */

/* Small laptops / large tablets */
@media (max-width: 1200px) {
  .status-row { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  .charts-row { grid-template-columns: 1fr; }
  .ch { min-height: 320px; }
}

/* Tablets */
@media (max-width: 992px) {
  .loc-row { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 6px; }
  .hero-title { font-size: 22px; }
  .m-lbl { font-size: 8.5px; }
  .m-cnt { font-size: 1rem; }
}

/* Phones - landscape and large */
@media (max-width: 768px) {
  body { overflow-y: auto; overflow-x: hidden; }
  #content { height: auto; min-height: 100vh; overflow: visible; }
  .dash-canvas { overflow: visible; padding: 8px 12px 16px; gap: 8px; }

  .summary-bar { flex-wrap: wrap; height: auto; padding: 8px 12px; }
  .sb-item { padding: 4px 12px 4px 0; margin-right: 12px; }

  .hero { flex-direction: column; align-items: flex-start; padding: 12px 16px; gap: 8px; }
  .hero-title-row { grid-template-columns: 1fr; row-gap: 6px; }
  .hero-title { grid-column: 1; text-align: left; font-size: 19px; }
  .hero-pill { justify-self: start; }

  .loc-row { grid-template-columns: repeat(2, 1fr); }
  .status-row { grid-template-columns: 1fr; gap: 8px; }
  .st { padding: 10px 12px; }
  .st-val { font-size: 1.5rem; }

  .charts-row { grid-template-columns: 1fr; gap: 8px; }
  .ch { min-height: 280px; }
  .ch-body { padding: 6px 8px 8px; }
  .ch-body canvas { max-height: 220px; }
}

/* Phones - portrait */
@media (max-width: 480px) {
  .loc-row { grid-template-columns: repeat(2, 1fr); gap: 6px; }
  .m-ico { width: 26px; height: 26px; font-size: 11px; }
  .m-lbl { font-size: 8px; }
  .m-cnt { font-size: .95rem; }
  .m-split-or, .m-split-ct { font-size: 8.5px; padding: 1px 5px; }

  .hero-title { font-size: 17px; }
  .hero-pill { font-size: 9px; padding: 2px 7px; }

  .st-ico-wrap { width: 36px; height: 36px; }
  .st-ico-wrap i { font-size: 15px; }
  .st-val { font-size: 1.3rem; }
  .st-spark { display: none; } /* sparkline too cramped to be legible this small */

  .dl-row { font-size: 9.5px; }
  .ch-title { font-size: 10px; }
}

/* ===== HEIGHT-BASED RESPONSIVENESS =====
   A shorter window shouldn't just crush the charts to nothing while hero/
   location/status keep full desktop padding. These scale the fixed-height
   sections down together with the charts, so short viewports (laptops with
   a taskbar, browser zoomed out, small external displays) stay proportioned. */

@media (max-height: 820px) {
  .dash-canvas { gap: 8px; padding: 8px 16px 10px; }
  .hero { padding: 10px 18px; }
  .hero-title { font-size: 22px; }
  .m-ico { width: 28px; height: 28px; margin-bottom: 4px; }
  .m-cnt { font-size: 1rem; }
  .st { padding: 10px 14px; }
  .st-val { font-size: 1.6rem; }
  .st-ico-wrap { width: 38px; height: 38px; }
}

@media (max-height: 700px) {
  .dash-canvas { gap: 6px; padding: 6px 16px 8px; }
  .summary-bar { height: 38px; }
  .hero { padding: 8px 16px; }
  .hero-title { font-size: 19px; }
  .section-label { margin-bottom: 3px; }
  .m-ico { width: 24px; height: 24px; font-size: 11px; margin-bottom: 3px; }
  .m-lbl { font-size: 8px; margin-bottom: 1px; }
  .m-cnt { font-size: .9rem; }
  .m-split { margin-top: 2px; }
  .m-split-or, .m-split-ct { font-size: 8.5px; padding: 1px 5px; }
  .st { padding: 8px 12px; gap: 8px; }
  .st-ico-wrap { width: 32px; height: 32px; }
  .st-ico-wrap i { font-size: 15px; }
  .st-val { font-size: 1.3rem; }
  .st-lbl { font-size: 8px; }
  .st-pct { font-size: 8.5px; }
  .st-spark { display: none; }
  .ch-head { padding: 6px 10px 0; }
  .ch-body { padding: 4px 8px 6px; }
}

@media (max-height: 580px) {
  .hero { display: none; }       /* reclaim the whole hero row on very short viewports */
  .m-ico { display: none; }
  .m-lbl { font-size: 7.5px; }
  .m-cnt { font-size: .8rem; }
  .st-ico-wrap { display: none; }
  .st-val { font-size: 1.1rem; }
}


.hero-left {
  position: relative; z-index: 1;
  display: flex; align-items: center;
  width: 100%;
  gap: 14px;
}

.hero-title-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
}

.hero-pill {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,.55); border: 1px solid rgba(0,0,0,.25);
  color: #1c2e1c; font-size: 11px; font-weight: 700;
  letter-spacing: .9px; text-transform: uppercase;
  padding: 3px 10px; border-radius: 20px;
  justify-self: start;
}

.hero-title {
  font-size: 26px; font-weight: 600; color: #1c2e1c;
  line-height: 1.1; letter-spacing: -.2px;
  text-align: center;
  justify-self: center;
  grid-column: 2;
}

.loc-row .mod {
  background: #ffffff;
  border: 1px solid var(--border);
  border-left: 3px solid transparent;
}

.loc-row .m-all { border-left-color: var(--navy); background: linear-gradient(180deg, #f7f8fc 0%, #ffffff 100%); }
.loc-row .m-adv { border-left-color: #1565c0; background: linear-gradient(180deg, #f5f9fd 0%, #ffffff 100%); }
.loc-row .m-dc  { border-left-color: var(--purple); background: linear-gradient(180deg, #f9f6fb 0%, #ffffff 100%); }
.loc-row .m-stl { border-left-color: var(--steel); background: linear-gradient(180deg, #fdf8f6 0%, #ffffff 100%); }
.loc-row .m-db  { border-left-color: var(--g2); background: linear-gradient(180deg, #f6faf6 0%, #ffffff 100%); }

.loc-row .mod:hover,
.loc-row .mod.active {
  box-shadow: var(--sh2);
  transform: translateY(-2px);
  border-left-width: 4px;
}

.loc-row .m-all.active { background: linear-gradient(180deg, #e8ecfb 0%, #f5f7fd 100%); border-left-color: var(--navy); }
.loc-row .m-adv.active { background: linear-gradient(180deg, #e3f0fc 0%, #f2f8fd 100%); border-left-color: #1565c0; }
.loc-row .m-dc.active  { background: linear-gradient(180deg, #f0e5f6 0%, #f8f2fb 100%); border-left-color: var(--purple); }
.loc-row .m-stl.active { background: linear-gradient(180deg, #fbe7de 0%, #fdf3ee 100%); border-left-color: var(--steel); }
.loc-row .m-db.active  { background: linear-gradient(180deg, #e2f2e3 0%, #f2f9f2 100%); border-left-color: var(--g2); }

.loc-row .mod.active {
  box-shadow: var(--sh2);
  transform: translateY(-2px);
  border-left-width: 4px;
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

      <!-- SUMMARY BAR -->
      <div class="summary-bar" hidden>
        <div class="sb-item sb-total">
          <div class="sb-dot sbd-total"><i class="fas fa-users"></i></div>
          <div><div class="sb-num" id="sbTotal">0</div><div class="sb-lbl">Total Employees</div></div>
        </div>
        <div class="sb-item">
          <div class="sb-dot sbd-v"><i class="fas fa-id-badge"></i></div>
          <div><div class="sb-num" id="sbOnRoll">0</div><div class="sb-lbl">On Roll</div></div>
        </div>
        <div class="sb-item">
          <div class="sb-dot sbd-n"><i class="fas fa-hard-hat"></i></div>
          <div><div class="sb-num" id="sbContractor">0</div><div class="sb-lbl">Contractor</div></div>
        </div>
      </div>

      <!-- DASHBOARD CANVAS -->
      <div class="dash-canvas">

        <!-- HERO -->
        <div class="hero">
       <!--    <div class="hero-left">
            <div>
              <div class="hero-title">
                <span class="hero-pill"><span class="hero-pill-dot"></span>Live</span>
                Man Power Dashboard
              </div>
            
            </div>
          </div> -->
          
          <div class="hero-left">
  <div class="hero-title-row">
    <span class="hero-pill"><span class="hero-pill-dot"></span>Live</span>
    <div class="hero-title">Workforce Dashboard</div>
    <span></span>
  </div>
</div>
          <div class="hero-right"></div>
        </div>

        <!-- LEVEL 1: LOCATION -->
        <div>
          <div class="section-label"> <span class="cnt-pill" id="locSummaryPill">All Location</span></div>
       <div class="mod-row loc-row" id="locRow">
  <div class="mod m-all active loc-mod" data-loc="ALL" onclick="selectLocation('ALL',this)">
    <div class="m-ico mi-all"><i class="fas fa-globe-asia"></i></div>
    <div class="m-lbl">All Location</div>
    <div class="m-cnt" id="loc-ALL">0</div>
    <div class="m-split">
      <span class="m-split-or">OR <b id="loc-ALL-onroll">0</b></span>
      <span class="m-split-ct">CT <b id="loc-ALL-contractor">0</b></span>
    </div>
  </div>
  <!-- remaining cards injected by renderLocationCards() in Manpowerdashboard.js -->
</div>
        </div>

        <!-- LEVEL 2: EMPLOYEE TYPE - clickable status banners (replaces the old duplicate card row) -->
        <div>
          <div class="section-label" hidden>Employee Type <span class="cnt-pill" id="typeSummaryPill">All Employee</span></div>
          <div class="status-row">
            <div class="st st-t active-type" data-type="ALL" onclick="selectType('ALL',this)">
              <div class="st-ico-wrap" style="animation:none;"><i class="fas fa-layer-group"></i></div>
              <div class="st-body">
                <div class="type-label" id="scopeLabel">All Locations - All Employees</div>
                <div class="st-val" id="stTotal">0</div>
                <div class="st-lbl">Total Employees</div>
                <div class="st-pct">Current selection</div>
              </div>
              <div class="st-spark">
                <div class="spark-bar"><div class="spark-fill" style="width:100%"></div></div>
                <div class="st-spark-lbl">100% base</div>
              </div>
            </div>
            <div class="st st-v" data-type="On Roll" onclick="selectType('On Roll',this)">
              <div class="st-ico-wrap"><i class="fas fa-id-badge"></i></div>
              <div class="st-body">
                <div class="st-val" id="stOnRoll">0</div>
                <div class="st-lbl">On Roll</div>
                <div class="st-pct" id="stOnRollP">0% of total</div>
              </div>
              <div class="st-spark">
                <div class="spark-bar"><div class="spark-fill" id="sp-onroll"></div></div>
                <div class="st-spark-lbl">on roll rate</div>
              </div>
            </div>
            <div class="st st-n" data-type="Contractor" onclick="selectType('Contractor',this)">
              <div class="st-ico-wrap"><i class="fas fa-hard-hat"></i></div>
              <div class="st-body">
                <div class="st-val" id="stContractor">0</div>
                <div class="st-lbl">Contractor</div>
                <div class="st-pct" id="stContractorP">0% of total</div>
              </div>
              <div class="st-spark">
                <div class="spark-bar"><div class="spark-fill" id="sp-contractor"></div></div>
                <div class="st-spark-lbl">contractor rate</div>
              </div>
            </div>
          </div>
        </div>

        <!-- CHARTS ROW -->
        <div class="charts-row">
          <div class="ch">
            <div class="ch-head">
             <div><div class="ch-title" id="donutTitle">Top Companies</div><div class="ch-sub" id="donutSub">Split for selected location</div></div>
              <span class="ch-tag ct-g">Live</span>
            </div>
            <div class="ch-body">
              <div class="pie-canvas-box"><canvas id="donutChart"></canvas></div>
              <div class="dl" id="donutLegend"></div>
            </div>
          </div>
          <div class="ch">
            <div class="ch-head">
              <div><div class="ch-title" id="skillTitle">Skill Distribution</div><div class="ch-sub" id="skillSub">By skill level for current selection</div></div>
              <span class="ch-tag ct-g">Live</span>
            </div>
            <div class="ch-body">
              <div class="pie-canvas-box"><canvas id="skillChart"></canvas></div>
              <div class="dl" id="skillLegend"></div>
            </div>
          </div>
          <div class="ch">
            <div class="ch-head">
              <div><div class="ch-title">Top 8 Departments</div><div class="ch-sub" id="barSub">By headcount for current selection</div></div>
              <span class="ch-tag ct-b" id="barTag">All types</span>
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
  <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
  <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
  <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
  <script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
  <script src="js/Manpowerdashboard.js?v=<%=ver(application, "/js/Manpowerdashboard.js")%>"></script>
<script>
  document.addEventListener('DOMContentLoaded', function () {
	  
	  
    if (typeof window.initManpowerDashboard === 'function') {
      window.initManpowerDashboard();
    }
  });
</script>

</body>
</html>
