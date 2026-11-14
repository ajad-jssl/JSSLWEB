<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1" isELIgnored="true"%>
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
<meta name="viewport"
	content="width=device-width,initial-scale=1,shrink-to-fit=no">
<link href="img/logo/download.png" rel="icon">
<title>Sales CRM Dashboard</title>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="css/ruang-admin.min.css" rel="stylesheet">
<link rel="stylesheet" href="css/main.css">





<script src="vendor/chart.js/Chart.min.js"></script>
<script>
    var user_id = sessionStorage.getItem('user_id');
    if (!user_id) { window.location.href = "newlogin.jsp"; }
  </script>

<style>
:root {
	--p1: #0c2461;
	--p2: #1b3f9e;
	--p3: #2f57c9;
	--p4: #5b7cf0;
	--pl: #e8edfd;
	--pm: #c9d6fb;
	--navy: #0c2461;
	--navy-l: #e8eaf6;
	--bg: #eef1f8;
	--card: #ffffff;
	--border: #dde3f3;
	--text: #101a3a;
	--muted: #5c6690;
	--c-total: #5b7cf0;
	--c-total-l: #e8edfd;
	--c-lead: #e8871e;
	--c-lead-l: #fdf1e2;
	--c-enq: #0f7c85;
	--c-enq-l: #e0f4f5;
	--c-offer: #8e44ad;
	--c-offer-l: #f3e8f8;
	--c-order: #1f9d55;
	--c-order-l: #e4f8ec;
	--sh1: 0 1px 3px rgba(12, 36, 97, .08);
	--sh2: 0 4px 14px rgba(12, 36, 97, .14);
	--r: 12px;
	--rs: 8px;
}

*, *::before, *::after {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

body {
	background: var(--bg);
	font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
	
	color: var(--text);
	overflow: hidden;
}

#content-wrapper {
	overflow: hidden;
}

#content {
	display: flex;
	flex-direction: column;
	height: 100vh;
	overflow: hidden;
}

.topbar {
	flex-shrink: 0;
}

.dash-canvas {
	flex: 1;
	overflow: hidden;
	padding: 10px 20px 12px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

/* HERO */
.hero {
	flex-shrink: 0;
	background: linear-gradient(90deg, rgba(172, 227, 185, 1) 0%,
		rgba(232, 245, 233, 1) 100%);
	border-radius: var(--r);
	padding: 12px 20px;
	position: relative;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	flex-wrap: wrap;
	box-shadow: var(--sh1);
}

.hero::before {
	content: '';
	position: absolute;
	inset: 0;
	background: radial-gradient(ellipse 50% 120% at 100% 50%, rgba(255, 255, 255, .20)
		0%, transparent 55%),
		radial-gradient(ellipse 30% 70% at 0% 0%, rgba(0, 0, 0, .06) 0%,
		transparent 60%);
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
	border: 38px solid rgba(27, 63, 158, .08);
	pointer-events: none;
}

.hero-left {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	gap: 14px;
}

.hero-logo {
	height: 60px;
	width: auto;
}

.dashboard-title-wrap {
	display: flex;
	align-items: center;
	gap: 10px;
}

.hero-title {
	font-size: 28px;
	font-weight: 800;
	color: #16351f;
	letter-spacing: -.5px;
	line-height: 1.1;
}

.live-indicator {
	display: flex;
	align-items: center;
	gap: 6px;
	background: rgba(255, 255, 255, .6);
	border: 1px solid rgba(0, 0, 0, .10);
	padding: 4px 10px;
	border-radius: 20px;
	font-size: 10px;
	font-weight: 800;
	letter-spacing: .8px;
	color: #0c2461;
	box-shadow: 0 2px 8px rgba(0, 0, 0, .06);
}

.live-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: green;
	animation: livePulse 1.4s infinite;
}

@
keyframes livePulse { 0%,100% {
	transform: scale(1);
	opacity: 1;
}

50




%
{
transform




:




scale


(




1


.5




)


;
opacity




:




.45


;
}
}
.hero-right {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	gap: 10px;
	flex-wrap: wrap;
}

.hero-filter-group {
	display: flex;
	align-items: center;
	gap: 6px;
	background: rgba(255, 255, 255, .4);
	border: 1px solid rgba(0, 0, 0, .10);
	border-radius: var(--rs);
	padding: 4px 10px;
}

.hero-filter-label {
	font-size: 9px;
	font-weight: 700;
	color: #101a3a;
	text-transform: uppercase;
	letter-spacing: .6px;
	white-space: nowrap;
}

.dateInput, .salesmanSelect {
	padding: 5px 10px;
	height: 30px;
	border: 1.5px solid rgba(0, 0, 0, .18);
	border-radius: var(--rs);
	background: rgba(255, 255, 255, .75);
	color: #101a3a;
	font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
	font-size: 11px;
	font-weight: 600;
	cursor: pointer;
	transition: all .2s ease;
}

.dateInput {
	width: 118px;
	font-weight: 500;
}

.salesmanSelect {
	min-width: 150px;
	padding-right: 26px;
	appearance: none;
	background-image:
		url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='none' stroke='%23101a3a' stroke-width='1.5' stroke-linecap='round' d='M1 1l4 4 4-4'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: right 8px center;
}

.dateInput:hover, .salesmanSelect:hover {
	background: rgba(255, 255, 255, .92);
	border-color: var(--p3);
}

.dateInput:focus, .salesmanSelect:focus {
	outline: none;
	border-color: var(--p3);
	box-shadow: 0 0 0 2px rgba(47, 87, 201, .15);
}

.salesmanSelect option {
	background: #fff;
	color: #101a3a;
}

.dateInput::-webkit-calendar-picker-indicator {
	opacity: .6;
	cursor: pointer;
}

.refreshBtn {
	background: var(--p3);
	border: 1.5px solid var(--p1);
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

.refreshBtn:hover {
	background: var(--p1);
}

.refreshBtn.spinning i {
	animation: spin .7s linear infinite;
}

@
keyframes spin {
	from {transform: rotate(0deg)
}

to {
	transform: rotate(360deg)
}

}

/* ZONE CARDS ROW - dynamic, built from zone list (All / North / South / East / West) */
.mod-row {
	flex-shrink: 0;
	display: grid;
	gap: 8px;
	grid-auto-flow: column;
	grid-auto-columns: 1fr;
}

.mod {
	background: var(--card);
	border-radius: var(--r);
	border: 1.5px solid var(--border);
	padding: 10px 8px 8px;
	cursor: pointer;
	transition: all .2s;
	position: relative;
	overflow: hidden;
	text-align: center;
}

.mod::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 3px;
	transform: scaleX(0);
	transform-origin: left;
	transition: transform .22s ease;
	background: var(--mod-color, var(--p3));
}

.mod:hover::after, .mod.active::after {
	transform: scaleX(1);
}

.mod:hover, .mod.active {
	box-shadow: var(--sh2);
	transform: translateY(-2px);
	border-color: transparent;
}

.mod.active {
	background: linear-gradient(160deg, #f6f8ff, #eef2fe);
}

.m-ico {
	width: 32px;
	height: 32px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 13px;
	margin: 0 auto 5px;
	background: var(--mod-bg, var(--pl));
	color: var(--mod-color, var(--p3));
}

.m-lbl {
	font-size: 9px;
	font-weight: 700;
	color: var(--text);
	line-height: 1.2;
	margin-bottom: 3px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.m-cnt {
	font-size: 1.15rem;
	font-weight: 800;
	line-height: 1;
	letter-spacing: -.5px;
}

.m-sub {
	font-size: 8px;
	color: var(--muted);
	margin-top: 2px;
	line-height: 1.35;
}

/* STATUS BANNERS - Total / Lead / Enquire / Offer / Order Received */
.status-row {
	flex-shrink: 0;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 10px;
}

.st {
	border-radius: var(--r);
	padding: 11px 13px;
	display: flex;
	align-items: center;
	gap: 10px;
	position: relative;
	overflow: hidden;
	cursor: pointer;
	transition: all .18s;
}

.st:hover {
	transform: translateY(-2px);
	box-shadow: var(--sh2);
}

.st::before {
	content: '';
	position: absolute;
	right: -22px;
	top: -22px;
	width: 88px;
	height: 88px;
	border-radius: 50%;
	background: rgba(0, 0, 0, .05);
	pointer-events: none;
}

.st-total {
	background: linear-gradient(130deg, #93a9f6 0%, #c1cdfb 55%, var(--c-total-l)
		100%);
}

.st-lead {
	background: linear-gradient(130deg, #f3b978 0%, #f8d3ab 55%, var(--c-lead-l)
		100%);
}

.st-enq {
	background: linear-gradient(130deg, #5fb6bd 0%, #9ed4d8 55%, var(--c-enq-l)
		100%);
}

.st-offer {
	background: linear-gradient(130deg, #c396d8 0%, #dcb9e6 55%, var(--c-offer-l)
		100%);
}

.st-order {
	background: linear-gradient(130deg, #79c99a 0%, #a9dfc0 55%, var(--c-order-l)
		100%);
}

.st-ico-wrap {
	position: relative;
	z-index: 1;
	flex-shrink: 0;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: rgba(0, 0, 0, .08);
	border: 2px solid rgba(0, 0, 0, .12);
	display: flex;
	align-items: center;
	justify-content: center;
}

.st-ico-wrap i {
	font-size: 17px;
	color: #222;
}

.st-body {
	position: relative;
	z-index: 1;
	flex: 1;
	min-width: 0;
}

.st-val {
	font-size: 1.55rem;
	font-weight: 800;
	color: #161616;
	line-height: 1;
	letter-spacing: -1px;
}

.st-lbl {
	font-size: 8.5px;
	color: rgba(0, 0, 0, .65);
	letter-spacing: .8px;
	margin-top: 3px;
	font-weight: 700;
	text-transform: uppercase;
}

.st-pct {
	font-size: 9px;
	color: rgba(0, 0, 0, .6);
	margin-top: 3px;
}

.zone-label {
	font-size: 11px;
	font-weight: 700;
	color: rgba(0, 0, 0, 0.6);
	margin-bottom: 6px;
	text-transform: uppercase;
	letter-spacing: .5px;
}

/* CHARTS */
.charts-row {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
}

.ch {
	background: var(--card);
	border-radius: var(--r);
	border: 1px solid var(--border);
	box-shadow: var(--sh1);
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.ch-head {
	padding: 10px 14px 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-shrink: 0;
	flex-wrap: wrap;
	gap: 6px;
}

.ch-title {
	font-size: 11px;
	font-weight: 700;
	color: var(--text);
}

.ch-sub {
	font-size: 9px;
	color: var(--muted);
	margin-top: 1px;
}

.ch-tag {
	font-size: 9px;
	font-weight: 700;
	padding: 2px 8px;
	border-radius: 20px;
	letter-spacing: .3px;
	text-transform: uppercase;
}

.ct-g {
	background: var(--pl);
	color: var(--p3);
}

.ct-b {
	background: var(--c-enq-l);
	color: var(--c-enq);
}

.ch-body {
	flex: 1;
	min-height: 0;
	padding: 6px 12px 12px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.ch-body canvas {
	flex: 1;
	min-height: 0;
}

.dl {
	display: flex;
	flex-direction: column;
	margin-top: 6px;
}

.dl-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 4px 0;
	border-bottom: 1px solid var(--border);
	font-size: 10.5px;
}

.dl-row:last-child {
	border-bottom: none;
}

.dl-l {
	display: flex;
	align-items: center;
	gap: 7px;
	color: var(--text);
	font-weight: 500;
}

.dl-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	flex-shrink: 0;
}

.dl-v {
	font-weight: 800;
	font-size: 11px;
}

/* ===== PANEL GRID: Zone Split + Lead + Enquire + Offer + Order + YoY, each its own
       column. auto-fit lets it reflow naturally at any width â laptop, tablet, or phone â
       without needing a separate hand-written breakpoint for every screen size. */
.quad-body {
	flex: 1;
	min-height: 0;
	padding: 8px 10px 10px;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	grid-auto-rows: minmax(150px, 1fr);
	gap: 8px;
}

.qcell {
	border: 1px solid var(--border);
	border-radius: var(--rs);
	background: #fbfcff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	overflow: hidden;
	min-height: 0;
	padding: 6px 8px;
}

.qcell-title {
	font-size: 8.5px;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: .4px;
	color: var(--muted);
	margin-bottom: 10px;
	flex-shrink: 0;
}

/* Zone Split donut + legend, living inside the unified panel */
#qcZoneSplit {
	align-items: stretch;
}

#qcZoneSplit .ch-tag {
	align-self: flex-start;
}

.zonesplit-body {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
}

.zonesplit-body canvas {
	flex: 1;
	min-height: 0;
}

/* Mini horizontal bar rows (Lead/Enquire/Offer/Order breakdown) â styled like the
       reference bar chart: label outside on the left, thick filled bar with the count
       written INSIDE it in white, and a small marker dot at the tip of the bar. */
.mbar-row {
	display: flex;
	align-items: center;
	gap: 6px;
	margin: 4px 0;
}

.mbar-label {
	width: clamp(52px, 7vw, 70px);
	flex-shrink: 0;
	font-size: clamp(8px, 0.7vw, 9.5px);
	font-weight: 600;
	color: var(--text);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.mbar-track {
	flex: 1;
	height: clamp(16px, 2.4vh, 22px);
	background: var(--pl);
	border-radius: 4px;
	position: relative;
	overflow: visible;
}

.mbar-fill {
	height: 100%;
	border-radius: 4px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-right: 6px;
	min-width: 22px;
}

.mbar-fill-val {
	color: #fff;
	font-size: clamp(8px, 0.7vw, 10px);
	font-weight: 800;
	line-height: 1;
	white-space: nowrap;
}


/* Col 4: YoY comparison, spans both rows */
#qcYoy canvas {
	flex: 1;
	min-height: 0;
}

/* METRIC TOGGLE BUTTONS (kept for compatibility, no longer used by the panel above) */
.metric-btns {
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
}

.mbtn {
	border: 1.5px solid var(--border);
	background: #fff;
	color: var(--muted);
	font-family: inherit;
	font-size: 9.5px;
	font-weight: 700;
	letter-spacing: .3px;
	text-transform: uppercase;
	padding: 4px 10px;
	border-radius: 20px;
	cursor: pointer;
	transition: all .16s;
}

.mbtn:hover {
	border-color: var(--mbtn-color, var(--p3));
	color: var(--mbtn-color, var(--p3));
}

.mbtn.active {
	background: var(--mbtn-color, var(--p3));
	border-color: var(--mbtn-color, var(--p3));
	color: #fff;
}

@
keyframes fadeUp {
	from {opacity: 0;
	transform: translateY(10px)
}

to {
	opacity: 1;
	transform: translateY(0)
}

}
.hero {
	animation: fadeUp .30s ease .05s both
}

.mod {
	animation: fadeUp .35s ease both
}

.st {
	animation: fadeUp .35s ease both
}

.ch {
	animation: fadeUp .35s ease both
}

.dash-canvas {
	display: block;
}

/* ============================================================
       RESPONSIVE â LAPTOP TUNING (width AND height)
       ============================================================ */
.dash-canvas {
	min-height: 0;
	overflow-y: auto;
	overflow-x: hidden;
	scrollbar-width: thin;
	scrollbar-color: var(--pm) transparent;
	padding: clamp(8px, 1.4vh, 12px) clamp(12px, 1.6vw, 20px)
		clamp(8px, 1.2vh, 12px);
	gap: clamp(6px, 1vh, 10px);
}

.dash-canvas::-webkit-scrollbar {
	width: 6px;
}

.dash-canvas::-webkit-scrollbar-thumb {
	background: var(--pm);
	border-radius: 4px;
}

.hero {
	padding: clamp(8px, 1.5vh, 12px) clamp(14px, 1.8vw, 20px);
}

.hero-title {
	font-size: clamp(18px, 1.2vw + 10px, 28px);
}

.live-indicator {
	padding: 3px 9px;
	font-size: 9px;
}

.hero-right {
	gap: clamp(6px, 0.8vw, 10px);
}

.hero-filter-group {
	padding: 3px 8px;
}

.dateInput {
	width: clamp(96px, 8vw, 118px);
	height: clamp(26px, 3.2vh, 30px);
	font-size: 10.5px;
}

.salesmanSelect {
	min-width: clamp(120px, 10vw, 150px);
	height: clamp(26px, 3.2vh, 30px);
	font-size: 10.5px;
}

.refreshBtn {
	height: clamp(26px, 3.2vh, 30px);
	padding: 4px 12px;
}

.mod-row {
	gap: clamp(6px, 0.8vw, 8px);
}

.mod {
	padding: clamp(7px, 1.1vh, 10px) 6px 6px;
}

.m-ico {
	width: clamp(24px, 2.2vw, 32px);
	height: clamp(24px, 2.2vw, 32px);
	font-size: clamp(10.5px, 1vw, 13px);
	margin-bottom: 4px;
}

.m-lbl {
	font-size: clamp(8px, 0.7vw, 9px);
}

.m-cnt {
	font-size: clamp(0.9rem, 0.9vw + 0.4rem, 1.15rem);
}

.status-row {
	gap: clamp(6px, 0.8vw, 10px);
}

.st {
	padding: clamp(8px, 1.4vh, 11px) clamp(8px, 1vw, 13px);
	gap: 8px;
}

.st-ico-wrap {
	width: clamp(28px, 2.6vw, 40px);
	height: clamp(28px, 2.6vw, 40px);
}

.st-ico-wrap i {
	font-size: clamp(12.5px, 1.1vw, 17px);
}

.st-val {
	font-size: clamp(1.05rem, 1vw + 0.5rem, 1.55rem);
}

.st-lbl {
	font-size: clamp(7.5px, 0.65vw, 8.5px);
}

.st-pct {
	font-size: clamp(7.5px, 0.6vw, 9px);
}

.charts-row {
	gap: clamp(6px, 0.8vw, 10px);
}

.ch-head {
	padding: clamp(7px, 1vh, 10px) 12px 0;
}

.ch-body {
	padding: clamp(4px, 0.9vh, 8px) 10px 10px;
}

.ch-body canvas {
	min-height: 130px;
}

.ch-title {
	font-size: clamp(10px, 0.75vw, 11px);
}

.ch-sub {
	font-size: clamp(8px, 0.6vw, 9px);
}

.quad-body {
	min-height: 220px;
}

/* 13"â14" laptop widths, and any window narrower than ~1366px */
@media ( max-width : 1366px) {
	.mod-row {
		grid-auto-flow: row;
		grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
	}
	.status-row {
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	}
}

@media ( max-width : 1024px) {
	/* auto-fit already reflows the panel into fewer columns here; just give it room to grow */
	.quad-body {
		grid-auto-rows: minmax(140px, auto);
	}
	#qcZoneSplit, #qcYoy {
		min-height: 180px;
	}
}

@media ( max-width : 640px) {
	/* one column, everything stacked, each card tall enough to read comfortably */
	.quad-body {
		grid-template-columns: 1fr;
	}
	#qcZoneSplit, #qcYoy {
		min-height: 190px;
	}
	.mbar-label {
		width: 64px;
		font-size: 10px;
	}
	.mbar-track {
		height: 20px;
	}
	.mbar-fill-val {
		font-size: 10px;
	}
}

/* Short viewports */
@media ( max-height : 760px) {
	.hero-title {
		font-size: clamp(16px, 1.1vw + 9px, 22px);
	}
	.m-sub, .st-pct, .ch-sub {
		display: none;
	}
	.m-ico {
		margin-bottom: 2px;
	}
}

@media ( max-height : 650px) {
	.status-row {
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
	}
	.mod-row {
		grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
	}
	.st-val {
		font-size: clamp(0.95rem, 1vw + 0.4rem, 1.25rem);
	}
	.ch-body canvas {
		min-height: 110px;
	}
	.quad-body {
		min-height: 180px;
	}
}

@media ( min-width : 1920px) {
	.dash-canvas {
		padding-left: 28px;
		padding-right: 28px;
	}
}

.quad-body {
	display: grid;
	grid-template-columns: 260px 1fr 260px;
	gap: 12px;
	height: 100%;
}

.middle-panels {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 12px;
	height: 100%;
}

.zone-panel {
	display: flex;
	flex-direction: column;
}

.yoy-panel {
	display: flex;
	flex-direction: column;
}

.yoy-toggle {
	display: flex;
	gap: 3px;
}

.yoy-toggle-btn {
	border: 1px solid var(--border);
	background: #fff;
	color: var(--muted);
	font-size: 9px;
	padding: 3px 6px;
	border-radius: 5px;
	cursor: pointer;
	transition: all .15s;
}

.yoy-toggle-btn:hover {
	border-color: var(--p3);
	color: var(--p3);
}

.yoy-toggle-btn.active {
	background: var(--p3);
	border-color: var(--p3);
	color: #fff;
}

.st {
	border-radius: var(--r);
	padding: 11px 13px;
	display: flex;
	align-items: center;
	gap: 10px;
	flex-wrap: wrap;
	/* NEW — allows wrapping instead of overflow/clipping when too narrow */
	position: relative;
	overflow: hidden;
	cursor: pointer;
	transition: all .18s;
}

.st-body {
	position: relative;
	z-index: 1;
	flex: 1 1 200px;
	/* NEW — body can shrink but won't go below 200px before wrapping */
	min-width: 0;
}

.st-metrics {
	font-size: 8.5px;
	color: rgba(0, 0, 0, .62);
	margin-top: 3px;
	font-weight: 700;
	display: flex;
	gap: 5px;
	flex-wrap: wrap;
	/* NEW — tonnage/value drop to their own line if too tight */
}

@media ( max-width : 480px) {
	.st {
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
	}
	.st-ico-wrap {
		align-self: flex-start;
	}
}

.st-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
}

.st-pills {
	display: flex;
	justify-content: space-between;
	gap: 8px;
	margin-top: 7px;
}

.st-pill {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	padding: 3px 10px;
	border-radius: 999px;
	background: rgba(255, 255, 255, .55);
	border: 1px solid rgba(0, 0, 0, .15);
	font-size: 10.5px; /* bumped up from the old 8.5px st-metrics text */
	font-weight: 800;
	color: #161616;
	white-space: nowrap;
}

.drill-modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(12, 36, 97, .45);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2000;
}

.drill-modal {
	background: #fff;
	border-radius: var(--r);
	width: min(900px, 92vw);
	max-height: 80vh;
	display: flex;
	flex-direction: column;
	box-shadow: var(--sh2);
	overflow: hidden;
}

.drill-modal-head {
	padding: 14px 18px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid var(--border);
	flex-shrink: 0;
}

.drill-modal-title {
	font-size: 15px;
	font-weight: 800;
	color: var(--text);
}

.drill-modal-close {
	border: none;
	background: transparent;
	font-size: 22px;
	line-height: 1;
	cursor: pointer;
	color: var(--muted);
}

.drill-modal-body {
	overflow-y: auto;
	padding: 10px 18px 18px;
}

.drill-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 12px;
}

.drill-table th {
	text-align: left;
	padding: 8px 10px;
	background: var(--pl);
	color: var(--p1);
	font-weight: 800;
	font-size: 10.5px;
	text-transform: uppercase;
	letter-spacing: .3px;
	position: sticky;
	top: 0;
}

.drill-table td {
	padding: 7px 10px;
	border-bottom: 1px solid var(--border);
	color: var(--text);
}

.drill-table tr:hover td {
	background: #f8faff;
}

.drill-modal-filters {
	display: flex;
	gap: 8px;
	padding: 10px 18px;
	border-bottom: 1px solid var(--border);
	flex-wrap: wrap;
	flex-shrink: 0;
}

.drill-filter-input, .drill-filter-select {
	padding: 6px 10px;
	border: 1.5px solid var(--border);
	border-radius: var(--rs);
	font-size: 11px;
	font-family: inherit;
	color: var(--text);
}

.drill-filter-input {
	flex: 1;
	min-width: 160px;
}

.drill-filter-select {
	min-width: 120px;
}

.drill-table tfoot .drill-total-row td {
	font-weight: 800;
	background: var(--pl);
	color: var(--p1);
	border-top: 2px solid var(--p3);
	border-bottom: none;
	position: sticky;
	bottom: 0;
}

.mb-count {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 18px;
	padding: 1px 7px;
	border-radius: 999px;
	background: var(--mb-color, var(--p3));
	color: #fff;
	font-weight: 800;
	font-size: 8px;
}

.status-row {
	grid-template-columns: repeat(6, 1fr);
}

:root {
	--c-hot: #d9480f;
	--c-hot-l: #ffe8dc;
	--c-lost: #c0392b;
	--c-lost-l: #fbe3e0;
}

.st-hot {
	background: linear-gradient(130deg, #f29b73 0%, #f7c3a8 55%, var(--c-hot-l)
		100%);
}

.st-lost {
	background: linear-gradient(130deg, #e68a80 0%, #f0b6af 55%, var(--c-lost-l)
		100%);
}

/* 5 cells in the middle: Lost spans the full bottom row */
.middle-panels {
	grid-template-rows: repeat(3, 1fr);
}

#qcLost {
	grid-column: 1/-1;
}

/* Zone card breakdown pills */
.m-sub {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
  padding: 0 2px;
}

.zp {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--zp-bg);
  color: var(--zp-c);
  border: 1px solid rgba(0, 0, 0, .08);
  font-size: 9px;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
}

.zp b {
  font-weight: 800;
  font-size: 10px;
}
</style>
</head>

<body id="page-top">
	<div id="wrapper">
		<%@ include file="SaleSidebar.jsp"%>

		<div id="content-wrapper" class="d-flex flex-column">
			<div id="content">

				<!-- NAVBAR -->
				<nav
					class="navbar navbar-expand navbar-light topbar mb-0 static-top"
					style="background-color: #0c2461; border-bottom: 2px solid #1b3f9e;">
					<button id="sidebarToggleTop"
						class="btn btn-link rounded-circle mr-3">
						<i class="fa fa-bars" style="color: #fff"></i>
					</button>
					<ul class="navbar-nav ml-auto">
						<button class="btn btn-link"
							onclick="window.location.href='Landingpage.jsp'"
							style="color: #fff; border: none; background: transparent;">
							<i class="fa fa-home"></i>
						</button>
						<div class="topbar-divider d-none d-sm-block"></div>
						<li class="nav-item dropdown no-arrow"><a
							class="nav-link dropdown-toggle" href="#" id="uDD" role="button"
							data-toggle="dropdown"> <i
								class="fas fa-user text-white mr-2"></i> <span
								class="ml-2 d-none d-lg-inline text-white small"
								id="usernameDisplay">Username</span>
						</a>
							<div
								class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
								aria-labelledby="uDD">
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" onclick="logoutUser(event)"> <i
									class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
									Logout
								</a>
							</div></li>
					</ul>
				</nav>

				<!-- DASHBOARD CANVAS -->
				<div class="dash-canvas">

					<!-- HERO -->
					<div class="hero">
						<div class="hero-left">
							<div class="dashboard-title-wrap">
								<div class="live-indicator">
									<span class="live-dot"></span> LIVE
								</div>
								<div class="hero-title">Sales CRM Dashboard</div>
							</div>
						</div>

						<div class="hero-right">
							<div class="hero-filter-group">
								<span class="hero-filter-label">From</span> <input type="date"
									id="fromDate" class="dateInput">
							</div>

							<div class="hero-filter-group">
								<span class="hero-filter-label">To</span> <input type="date"
									id="toDate" class="dateInput">
							</div>

							<div class="hero-filter-group">
								<span class="hero-filter-label">Salesman</span> <select
									id="salesmanSelect" class="salesmanSelect"></select>
							</div>

							<button id="refreshBtn" class="refreshBtn" title="Refresh">
								<i class="fas fa-sync-alt"></i> Refresh
							</button>
						</div>
					</div>

					
					<div class="mod-row" id="zoneCardsRow">
						<!-- cards injected by JS -->
					</div>

			
					<div class="status-row">


						<div class="st st-total" onclick="setMetric('total')">
							<div class="st-body">
								<div class="zone-label" id="zoneLabel">All Zones</div>
								<div class="st-head">
									<div class="st-ico-wrap">
										<i class="fas fa-layer-group"></i>
									</div>
									<div class="st-val" id="stTotal">0</div>
								</div>
								<div class="st-lbl">Total Volume</div>
								<div class="st-pills">
									<span class="st-pill" id="stTotalTonnage">0 MT</span> <span
										class="st-pill" id="stTotalValue">₹0Cr</span>
								</div>
							</div>
						</div>




						<div class="st st-lead" onclick="setMetric('lead')">
							<div class="st-body">
								<div class="zone-label">Leads</div>
								<div class="st-head">
									<div class="st-ico-wrap">
										<i class="fas fa-user-plus"></i>
									</div>
									<div class="st-val" id="stLead">0</div>
								</div>
								<div class="st-lbl">Total Volume</div>

								<div class="st-pills">
									<span class="st-pill" id="stLeadTonnage">0 MT</span> <span
										class="st-pill" id="stLeadValue">₹0Cr</span>
								</div>
							</div>
						</div>

						<div class="st st-enq" onclick="setMetric('enquire')">
							<div class="st-body">

								<div class="zone-label">Enquiries</div>

								<div class="st-head">
									<div class="st-ico-wrap">
										<i class="fas fa-comments"></i>
									</div>
									<div class="st-val" id="stEnq">0</div>
								</div>

								<div class="st-lbl">Total Volume</div>

								<div class="st-pills">
									<span class="st-pill" id="stEnqTonnage">0 MT</span> <span
										class="st-pill" id="stEnqValue">₹0Cr</span>
								</div>

							</div>
						</div>


				

						<div class="st st-hot" onclick="setMetric('hotcase')">
							<div class="st-body">
								<div class="zone-label">Hot Cases</div>
								<div class="st-head">
									<div class="st-ico-wrap">
										<i class="fas fa-fire"></i>
									</div>
									<div class="st-val" id="stHot">0</div>
								</div>
								<div class="st-lbl">Total Volume</div>
								<div class="st-pills">
									<span class="st-pill" id="stHotTonnage">0 MT</span> <span
										class="st-pill" id="stHotValue">₹0Cr</span>
								</div>
							</div>
						</div>


						<div class="st st-order" onclick="setMetric('order')">
							<div class="st-body">

								<div class="zone-label">Orders Received</div>

								<div class="st-head">
									<div class="st-ico-wrap">
										<i class="fas fa-box-open"></i>
									</div>
									<div class="st-val" id="stOrder">0</div>
								</div>

								<div class="st-lbl">Total Volume</div>

								<div class="st-pills">
									<span class="st-pill" id="stOrderTonnage">0 MT</span> <span
										class="st-pill" id="stOrderValue">₹0Cr</span>
								</div>

							</div>


						</div>

						<div class="st st-lost" onclick="setMetric('lost')">
							<div class="st-body">
								<div class="zone-label">Lost</div>
								<div class="st-head">
									<div class="st-ico-wrap">
										<i class="fas fa-times-circle"></i>
									</div>
									<div class="st-val" id="stLost">0</div>
								</div>
								<div class="st-lbl">Total Volume</div>
								<div class="st-pills">
									<span class="st-pill" id="stLostTonnage">0 MT</span> <span
										class="st-pill" id="stLostValue">₹0Cr</span>
								</div>
							</div>
						</div>
					</div>
					<!-- CHARTS ROW â single unified panel: Zone Split + Goal + Lead/Enquire/Offer/Order + YoY -->
					<div class="charts-row">
						<div class="ch" style="flex: 1;">
							<div class="ch-head">
								<div>
									<div class="ch-title">Performance Overview</div>
									<div class="ch-sub">Zone split, goal, top segments &amp;
										year-on-year</div>
								</div>
								<span class="ch-tag ct-g">Live</span>
							</div>


							<div class="quad-body">

								<!-- Left -->
								<div class="qcell zone-panel" id="qcZoneSplit">
									<div class="qcell-title">Zone-wise Tonnage (MT)</div>
									<div class="zonesplit-body">
										<canvas id="donutChart"></canvas>
										<div class="dl" id="donutLegend"></div>
									</div>
								</div>

								<!-- Middle -->
								<div class="middle-panels">

									<div class="qcell" id="qcLead">
										<div class="qcell-title">Top 5 Segments By Leads</div>
										<div id="barsLead"></div>
									</div>

									<div class="qcell" id="qcEnquire">
										<div class="qcell-title">Top 5 Segments By Enquiries</div>
										<div id="barsEnquire"></div>
									</div>

									<!-- 			<div class="qcell" id="qcOffer">
										<div class="qcell-title">Top 5 Segments By Offers</div>
										<div id="barsOffer"></div>
									</div> -->

									<div class="qcell" id="qcHot">
										<div class="qcell-title">Top 5 Segments By Hot Cases</div>
										<div id="barsHot"></div>
									</div>

									<div class="qcell" id="qcOrder">
										<div class="qcell-title">Top 5 Segments By Orders
											Received</div>
										<div id="barsOrder"></div>
									</div>

									<div class="qcell" id="qcLost">
										<div class="qcell-title">Top 5 Segments By Lost</div>
										<div id="barsLost"></div>
									</div>

								</div>

								<!-- Right -->
								<!-- <div class="qcell yoy-panel" id="qcYoy">
									<div class="qcell-title">Previous FY vs Current FY</div>
									<canvas id="yoyChart"></canvas>
								</div> -->
								<div class="qcell yoy-panel" id="qcYoy">
									<div class="qcell-title"
										style="display: flex; align-items: center; justify-content: space-between;">
										<!-- <span>Previous FY vs Current FY</span> -->
										 <span id="yoyTitle">JSW -JSW(MT)</span>
										<div class="yoy-toggle">
											<button type="button" class="yoy-toggle-btn active"
												data-chart-type="bar" onclick="setYoyChartType('bar', this)">
												<i class="fas fa-chart-bar"></i>
											</button>
											<button type="button" class="yoy-toggle-btn"
												data-chart-type="line"
												onclick="setYoyChartType('line', this)">
												<i class="fas fa-chart-line"></i>
											</button>
										</div>
									</div>
									<canvas id="yoyChart"></canvas>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>


	<div id="drillModal" class="drill-modal-overlay" style="display: none;">
		<div class="drill-modal">
			<div class="drill-modal-head">
				<div class="drill-modal-title" id="drillModalTitle">Leads</div>
				<button class="drill-modal-close" onclick="closeDrillModal()">&times;</button>
			</div>

	


			<div class="drill-modal-filters">
				<input type="text" id="drillSearch" class="drill-filter-input"
					placeholder="Search project / client..."> <select
					id="drillZoneFilter" class="drill-filter-select"><option
						value="ALL">All Zones</option></select> <select id="drillSegmentFilter"
					class="drill-filter-select"><option value="ALL">All
						Sectors</option></select> <select id="drillSalesmanFilter"
					class="drill-filter-select"><option value="ALL">All
						Salesmen</option></select> <select id="drillStageFilter" class="drill-filter-select"><option
						value="ALL">All Stages</option></select> <input type="month"
					id="drillMonthFilter" class="drill-filter-input"
					style="flex: 0 0 auto; min-width: 150px;"
					title="Closure month (mm-yyyy)">
				<button type="button" id="drillMonthClear"
					class="drill-filter-select" style="cursor: pointer;"
					title="Clear month">Clear</button>
			</div>

			<div class="drill-modal-body">
				<table class="drill-table">
		

					<thead>
						<tr>
							<th>Sl.No</th>
							<th>Project Name</th>
							<th>Client Name</th>
							<th>Sector</th>
							<th>Zone</th>
							<th>Salesman</th>
							<th>Stage</th>
							<th>Closure Month</th>
							<th>Tonnage (MT)</th>
							<th>Probable Value (Cr)</th>
						</tr>
					</thead>
					<tbody id="drillTableBody"></tbody>
					<tfoot>
						<tr class="drill-total-row">
							<td colspan="8">Total</td>
							<td id="drillTotalTonnage">0</td>
							<td id="drillTotalValue">₹0.00Cr</td>
						</tr>
					</tfoot>
				</table>
			</div>


		</div>
	</div>
	<a class="scroll-to-top rounded" href="#page-top"><i
		class="fas fa-angle-up"></i></a>
		
		<script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
<script>
(function () {
  var userId = sessionStorage.getItem('user_id');
  var username = sessionStorage.getItem('username');
  var moduleName = 'Sales CRM';
  var pageName = 'SaleDashBoard.jsp';
  var currentPage = window.location.pathname.split("/").pop()+'.jsp';

  if (!userId) {
    window.location.href = 'newlogin.jsp';
    return;
  }

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

    if (typeof window.initSalesCrmDashboard === 'function') {
      window.initSalesCrmDashboard();
    }
  }

  function denyAccess() {
    // .dash-canvas stays display:none (its default CSS) â nothing else happens
  }
})();
</script>

	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>

	<script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
	<script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
	<script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
	<script src="js/salesCrmDashboard.js?v=<%=ver(application, "/js/salesCrmDashboard.js")%>"></script>

</body>
</html>
