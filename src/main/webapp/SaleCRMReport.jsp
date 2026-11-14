<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%
long ts = System.currentTimeMillis();
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="description" content="">
<meta name="author" content="">
<link href="img/logo/download.png" rel="icon">
<title>JSSL</title>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet"
	type="text/css" />
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<link href="css/ruang-admin.min.css" rel="stylesheet" />
<link href="vendor/datatables/dataTables.bootstrap4.min.css"
	rel="stylesheet">
<link rel="stylesheet" href="css/main.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="js/sidebar.js"></script>
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-KyZXEJjRkC9iY3NfJVzz6se99Nz05dfk03S8zNeS46E1H2nKfHlR9ltRf9TL7zG6"
	crossorigin="anonymous">
<link
	href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
	rel="stylesheet" />
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script
	src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<link rel="stylesheet"
	href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

<script>
	const user_id = sessionStorage.getItem('user_id');
	if (!user_id) {
		window.location.href = "newlogin.jsp";
	}
</script>

<style>
.error-message {
	color: red;
	font-size: 12px;
	margin-top: 5px;
	display: none;
}

.popup {
	position: fixed;
	top: 20px;
	right: -3%;
	transform: translateX(-50%);
	background-color: #4CAF50;
	color: white;
	padding: 16px;
	border-radius: 5px;
	z-index: 9999;
}

button.close {
	padding: 0;
	background-color: transparent;
	border: 0;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
}

/* ---- Report card : teal / slate palette ---- */
.report-card {
	border: none;
	border-radius: 10px;
	box-shadow: 0 2px 10px rgba(15, 76, 76, 0.15);
}

.report-header-bar {
	background: linear-gradient(90deg, #0f4c4c, #14919b);
	color: #fff;
	border-radius: 10px 10px 0 0;
	padding: 14px 20px;
	text-align: center;
}

.report-header-bar h1 {
	font-size: 19px;
	margin: 0;
	font-weight: 600;
	letter-spacing: 0.3px;
}

#reportMeta {
	background-color: #eef7f7;
	border: 1px solid #d3ece9;
	border-radius: 6px;
	padding: 10px 15px;
	margin-bottom: 12px;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
}

#reportMeta .meta-info span {
	display: inline-block;
	margin-right: 25px;
	font-size: 13px;
}

#reportMeta .meta-info b {
	color: #0f4c4c;
}

#reportMeta .meta-actions {
	display: flex;
	gap: 8px;
}

.export-btn {
	font-size: 12px;
	padding: 6px 14px;
	border-radius: 6px;
	border: none;
	white-space: nowrap;
}

.export-btn.excel {
	background-color: #1d6f42;
	color: #fff;
}

.export-btn.excel:hover {
	background-color: #155a34;
	color: #fff;
}

.export-btn.pdf {
	background-color: #b3401f;
	color: #fff;
}

.export-btn.pdf:hover {
	background-color: #92341a;
	color: #fff;
}

#TableID {
	width: 100%;
	font-size: 13px;
	border-collapse: collapse;
}

#TableID thead th {
	background-color: #0f4c4c;
	color: #fff;
	text-align: center;
	vertical-align: middle;
	white-space: nowrap;
	position: sticky;
	top: 0;
	z-index: 2;
}

#TableID tbody td {
	text-align: center;
	vertical-align: middle;
	white-space: nowrap;
	border: 1px solid #d3ece9;
}

#TableID tbody tr:nth-child(even) {
	background-color: #f2fbfa;
}

#TableID tbody tr:hover {
	background-color: #d9f0ee;
}

#TableID tfoot td {
	background-color: #e3f4f2;
	font-weight: 600;
	border: 1px solid #d3ece9;
	color: #0f4c4c;
}

.table-scroll-wrap {
	overflow-x: auto;
	border-radius: 0 0 10px 10px;
}

/* ---- Pagination ---- */
#paginationWrap {
	display: none;
	align-items: center;
	justify-content: center;
	gap: 6px;
	flex-wrap: wrap;
	padding: 14px 0 4px;
}

.page-btn {
	min-width: 32px;
	padding: 5px 10px;
	font-size: 12px;
	border: 1px solid #b7ddd9;
	background-color: #fff;
	color: #0f4c4c;
	border-radius: 5px;
	cursor: pointer;
}

.page-btn:hover:not(:disabled) {
	background-color: #d9f0ee;
}

.page-btn.active {
	background-color: #0f4c4c;
	border-color: #0f4c4c;
	color: #fff;
	font-weight: 600;
}

.page-btn:disabled {
	opacity: 0.45;
	cursor: not-allowed;
}

.page-info {
	font-size: 12px;
	color: #0f4c4c;
	margin-left: 10px;
}

.table-scroll-wrap {
	overflow: auto;
	max-height: 420px;
	/* change this number to make the box taller or shorter */
	border-radius: 0 0 10px 10px;
}

/* keep the totals row visible at the bottom of the scroll box */
#TableID tfoot td {
	position: sticky;
	bottom: 0;
	z-index: 2;
}
/* horizontal scroll: table is as wide as its columns need, never squeezed */
#TableID {
	width: max-content;
	min-width: 100%;
	table-layout: auto;
}

#TableID th, #TableID td {
	padding: 8px 14px;
}

/* minimum width per column (1 = SL.NO ... 15 = Remarks) */
#TableID th:nth-child(1), #TableID td:nth-child(1) {
	min-width: 60px;
}

#TableID th:nth-child(2), #TableID td:nth-child(2) {
	min-width: 110px;
}

#TableID th:nth-child(3), #TableID td:nth-child(3) {
	min-width: 110px;
}

#TableID th:nth-child(4), #TableID td:nth-child(4) {
	min-width: 220px;
}

#TableID th:nth-child(5), #TableID td:nth-child(5) {
	min-width: 220px;
}

#TableID th:nth-child(6), #TableID td:nth-child(6) {
	min-width: 110px;
}

#TableID th:nth-child(7), #TableID td:nth-child(7) {
	min-width: 140px;
}

#TableID th:nth-child(8), #TableID td:nth-child(8) {
	min-width: 150px;
}

#TableID th:nth-child(9), #TableID td:nth-child(9) {
	min-width: 140px;
}

#TableID th:nth-child(10), #TableID td:nth-child(10) {
	min-width: 120px;
}

#TableID th:nth-child(11), #TableID td:nth-child(11) {
	min-width: 140px;
}

#TableID th:nth-child(12), #TableID td:nth-child(12) {
	min-width: 180px;
}

#TableID th:nth-child(13), #TableID td:nth-child(13) {
	min-width: 140px;
}

#TableID th:nth-child(14), #TableID td:nth-child(14) {
	min-width: 150px;
}

#TableID th:nth-child(15), #TableID td:nth-child(15) {
	min-width: 260px;
}

/* numbers always right-aligned (header, rows and totals) */
#TableID th.num, #TableID td.num {
	text-align: right !important;
	font-variant-numeric: tabular-nums;
}

#QuarterTable {
	width: max-content;
	min-width: 100%;
	font-size: 13px;
	border-collapse: collapse;
}

#QuarterTable thead th {
	background-color: #0f4c4c;
	color: #fff;
	text-align: center;
	vertical-align: middle;
	white-space: nowrap;
	padding: 8px 14px;
	border: 1px solid #14919b;
	position: sticky;
	z-index: 2;
}

#QuarterTable thead tr:nth-child(1) th {
	top: 0;
}

#QuarterTable thead tr:nth-child(2) th {
	top: 37px; /* height of first header row */
}

#QuarterTable thead th.qgroup {
	background-color: #14919b;
}

#QuarterTable tbody td {
	text-align: center;
	vertical-align: middle;
	white-space: nowrap;
	padding: 8px 14px;
	border: 1px solid #d3ece9;
}

#QuarterTable th.left, #QuarterTable td.left {
	text-align: left;
	white-space: normal;
	min-width: 280px;
}

#QuarterTable th.num, #QuarterTable td.num {
	text-align: right;
	min-width: 70px;
	font-variant-numeric: tabular-nums;
}

#QuarterTable tbody tr:nth-child(even) {
	background-color: #f2fbfa;
}

#QuarterTable tbody tr:hover {
	background-color: #d9f0ee;
}

#QuarterTable tfoot td {
	background-color: #e3f4f2;
	font-weight: 600;
	border: 1px solid #d3ece9;
	color: #0f4c4c;
	padding: 8px 14px;
	position: sticky;
	bottom: 0;
	z-index: 2;
}

/* ---- Multi-select checkbox dropdown ---- */
.ms { position: relative; }

.ms-btn {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	text-align: left;
	background: #fff;
	cursor: pointer;
	min-height: 31px;
}

.ms-text {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 88%;
}

.ms-panel {
	display: none;
	position: absolute;
	z-index: 1050;
	top: 100%;
	left: 0;
	min-width: 100%;
	background: #fff;
	border: 1px solid #b7ddd9;
	border-radius: 6px;
	box-shadow: 0 4px 14px rgba(15, 76, 76, 0.2);
	padding: 6px 0;
}

.ms-panel.open { display: block; }

.ms-list { max-height: 220px; overflow-y: auto; }

.ms-item {
	display: flex;
	align-items: center;
	gap: 8px;
	margin: 0;
	padding: 5px 12px;
	font-size: 13px;
	cursor: pointer;
	white-space: nowrap;
}

.ms-item:hover { background-color: #d9f0ee; }

.ms-item input { margin: 0; }

.ms-all {
	border-bottom: 1px solid #d3ece9;
	font-weight: 600;
	color: #0f4c4c;
}

.ms-foot {
	padding: 6px 12px 0;
	text-align: right;
	border-top: 1px solid #d3ece9;
}

.ms-foot .ms-apply {
	background-color: #0f4c4c;
	color: #fff;
	font-size: 12px;
	padding: 3px 14px;
}
</style>
</head>

<body>
	<div id="wrapper">
		<!-- Sidebar -->
		<%@ include file="SaleSidebar.jsp"%>
		<!-- Sidebar -->
		<div id="content-wrapper" class="d-flex flex-column">
			<div id="content">
				<!-- TopBar -->
				<nav
					class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top"
					style="background-color: #0f4c4c;">
					<button id="sidebarToggleTop"
						class="btn btn-link rounded-circle mr-3">
						<i class="fa fa-bars"></i>
					</button>

					<ul class="navbar-nav ml-auto">
						<button class="btn btn-link"
							onclick="window.location.href='Landingpage.jsp'"
							style="background-color: transparent; color: white; border: none;">
							<i class="fa fa-home"></i>
						</button>
						<div class="topbar-divider d-none d-sm-block"></div>
						<li class="nav-item dropdown no-arrow"><a
							class="nav-link dropdown-toggleww" href="#" id="userDropdown123"
							role="button" data-toggle="dropdown" aria-haspopup="true"
							aria-expanded="false"> <i class="fas fa-user text-white mr-2"></i>
								<span class="ml-2 d-none d-lg-inline text-white small"
								id="usernameDisplay">Username</span>
						</a>
							<div
								class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
								aria-labelledby="userDropdown">
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" onclick="logoutUser(event)"> <i
									class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
									Logout
								</a>
							</div></li>
					</ul>
				</nav>
				<!-- Topbar -->

				<!-- Container Fluid-->
				<div class="container-fluid" id="container-wrapper">
					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800">Sale CRM Report</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="SaleDashBoard.jsp">Home</a></li>
							<li class="breadcrumb-item active">Sale CRM Report</li>
						</ol>
					</div>

					<!-- Filters -->
					<div class="card mb-4">
						<div class="card-body">
							<div class="form-row align-items-end">

								<div class="form-group col-md-3">
									<label for="reportType"><b>Report Type</b></label> <select
										id="reportType" class="form-control form-control-sm">
										<option value="">Select report type</option>
									</select>
								</div>

								<div class="form-group col-md-3" id="summaryByWrap"
									style="display: none;">
									<label for="summaryBy"><b>Summary By</b></label> <select
										id="summaryBy" class="form-control form-control-sm"></select>
								</div>

							<!-- 	<div class="form-group col-md-3" id="filterValueWrap"
									style="display: none;">
									<label for="filterValue" id="filterValueLabel"><b>Select
											Value</b></label> <select id="filterValue"
										class="form-control form-control-sm"></select>
								</div>

								<div class="form-group col-md-3" id="fyWrap"
									style="display: none;">
									<label for="fy"><b>Financial Year</b></label> <select id="fy"
										class="form-control form-control-sm"></select>
								</div>

								<div class="form-group col-md-3" id="quarterWrap"
									style="display: none;">
									<label for="quarter"><b>Quarter</b></label> <select
										id="quarter" class="form-control form-control-sm"></select>
								</div>

								<div class="form-group col-md-3" id="stageWrap"
									style="display: none;">
									<label for="stage"><b>Stage</b></label> <select id="stage"
										class="form-control form-control-sm"></select>
								</div> -->
								
								<div class="form-group col-md-3" id="filterValueWrap" style="display: none;">
	<label id="filterValueLabel"><b>Select Value</b></label>
	<div id="filterValue" class="ms"></div>
</div>

<div class="form-group col-md-3" id="fyWrap" style="display: none;">
	<label><b>Financial Year</b></label>
	<div id="fy" class="ms"></div>
</div>

<div class="form-group col-md-3" id="quarterWrap" style="display: none;">
	<label><b>Quarter</b></label>
	<div id="quarter" class="ms"></div>
</div>

<div class="form-group col-md-3" id="stageWrap" style="display: none;">
	<label><b>Stage</b></label>
	<div id="stage" class="ms"></div>
</div>

							</div>
						</div>
					</div>

					<!-- Report -->
					<div id="container1" style="display: none;">
						<div class="card report-card mb-4">

							<div class="report-header-bar">
								<h1>Sale CRM Report</h1>
							</div>

							<div class="card-body">

								<div id="reportMeta">
									<div class="meta-info">
										<span><b>Report Type:</b> <span id="hdrReportType">-</span></span>
										<span><b>Summary By:</b> <span id="hdrSummaryBy">-</span></span>
										<span><b>Filter Value:</b> <span id="hdrFilterValue">-</span></span>
									</div>
									<div class="meta-actions">
										<button type="button" class="export-btn excel"
											onclick="exportToExcel()">
											<i class="fas fa-file-excel"></i> Export to Excel
										</button>
										<button type="button" class="export-btn pdf"
											onclick="exportToPDF()">
											<i class="fas fa-file-pdf"></i> Export to PDF
										</button>
									</div>
								</div>

								<div class="table-scroll-wrap">
									<table id="TableID">
										<thead>





											<tr>
												<th>SL.NO</th>
												<th>Lead No</th>
												<th>Enq No</th>
												<th>Project Name</th>
												<th>Client Name</th>
												<th>Zone</th>
												<th>Segment</th>
												<th>Design Basis</th>
												<th>Current Stage</th>

												<th class="num">Tonnage(MT)</th>
												<th class="num">Probable Value(Cr)</th>
												<th>Location</th>
												<th>Tentative Closure</th>
												<th>Sales Person</th>
												<th>Remarks</th>
											</tr>
										</thead>
										<tbody id="reportBody"></tbody>
										<tfoot id="reportFooter">


											<tr>
												<td colspan="9" style="text-align: right;">Total
													Records: <span id="ftrCount">0</span>
												</td>
												<td id="ftrTonnage" class="num">0</td>
												<td id="ftrValue" class="num">0</td>
												<td colspan="4"></td>
											</tr>
										</tfoot>


									</table>
								</div>

								<!-- Pagination: only shown for Detail report, 10 records per page -->
								<div id="paginationWrap"></div>

							</div>
						</div>
					</div>
					
					
					<div id="container2" style="display: none;">
						<div class="card report-card mb-4">
 
							<div class="report-header-bar">
								<h1>Sale CRM Quarterly Report</h1>
							</div>
 
							<div class="card-body">
 
								<div id="reportMeta">
									<div class="meta-info">
										<span><b>Financial Year:</b> <span id="qHdrFy">-</span></span>
										<span><b>Quarter:</b> <span id="qHdrQuarter">-</span></span>
										<span><b>Stage:</b> <span id="qHdrStage">-</span></span>
									</div>
									<div class="meta-actions">
										<button type="button" class="export-btn excel"
											onclick="exportQuarterToExcel()">
											<i class="fas fa-file-excel"></i> Export to Excel
										</button>
										<button type="button" class="export-btn pdf"
											onclick="exportQuarterToPDF()">
											<i class="fas fa-file-pdf"></i> Export to PDF
										</button>
									</div>
								</div>
 
								<div class="table-scroll-wrap">
									<table id="QuarterTable">
										<thead id="qHead"></thead>
										<tbody id="qBody"></tbody>
										<tfoot id="qFoot"></tfoot>
									</table>
								</div>
 
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>

	<script src="js/config.js"></script>
	<script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>

	<script src="vendor/datatables/jquery.dataTables.min.js"></script>
	<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>

	<!-- Export libraries -->
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>

	<script src="js/SaleCRMReport.js?v=<%=ts%>"></script>
	<script src="js/logout.js"></script>
	<script src="js/username.js"></script>
	<script src="js/customertype.js"></script>
	<script src="js/createdby.js"></script>
	<script src="js/modifiedby.js"></script>
	<script src="js/factoryid.js"></script>

</body>
</html>
