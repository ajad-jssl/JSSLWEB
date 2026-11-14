<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);
    long ts = System.currentTimeMillis();
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="description" content="">
<meta name="author" content="">
<link href="img/logo/download.png" rel="icon">
<title>JSSL - Employee Skill Report</title>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css" />
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="css/ruang-admin.min.css" rel="stylesheet" />
<link rel="stylesheet" href="css/main.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="js/sidebar.js"></script>

<style>
body { background-color: #f5f5f5; }

.page-title {
	font-size: 22px;
	font-weight: 700;
	color: #0f4c4c;
	margin-bottom: 16px;
}

/* ---- Filter card ---- */
.card { border: none; border-radius: 8px; }
.card-body { padding: 14px 18px; }
.form-group label {
	font-size: 12px;
	font-weight: 600;
	color: #0f4c4c;
	margin-bottom: 4px;
	display: block;
}
.form-control, .btn-action {
	height: 34px;
	font-size: 13px;
	border-radius: 4px;
}
.form-control:focus {
	border-color: #14919b;
	box-shadow: 0 0 0 3px rgba(20, 145, 155, 0.15);
}
.btn-action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 5px;
	padding: 0 12px;
	font-weight: 600;
	border: none;
	cursor: pointer;
	white-space: nowrap;
	width: 100%;
	background: #0f4c4c;
	color: #fff;
}
.btn-action:hover:not(:disabled) { background: #14919b; }
.btn-action:disabled { opacity: .55; cursor: not-allowed; }
.field-error { display: none; color: #dc3545; font-size: 11px; margin-top: 2px; }

/* ---- Tabs ---- */
#reportTabs { border-bottom: 2px solid #d3ece9; }
#reportTabs .nav-link {
	color: #5f8c8a;
	font-weight: 600;
	border: none;
	padding: 10px 20px;
}
#reportTabs .nav-link.active {
	color: #0f4c4c;
	border-bottom: 3px solid #14919b;
	background: transparent;
}
.tab-content {
	background: #fff;
	border: 1px solid #d3ece9;
	border-top: none;
	border-radius: 0 0 10px 10px;
	box-shadow: 0 2px 10px rgba(15, 76, 76, 0.08);
}

/* ---- Report card (same as Sale CRM Report) ---- */
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

.report-meta {
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
.report-meta .meta-info span.item {
	display: inline-block;
	margin-right: 25px;
	font-size: 13px;
}
.report-meta .meta-info b { color: #0f4c4c; }

/* ---- Scrollable table with sticky header ---- */
.table-scroll-wrap {
	overflow: auto;
	max-height: 460px;
	border-radius: 0 0 10px 10px;
}
.table-scroll-wrap table {
	width: max-content !important;
	min-width: 100%;
	font-size: 13px;
	border-collapse: collapse;
}
.table-scroll-wrap thead th {
	background-color: #0f4c4c;
	color: #fff;
	text-align: center;
	vertical-align: middle;
	white-space: nowrap;
	position: sticky;
	top: 0;
	z-index: 2;
	padding: 8px 14px;
	border: 1px solid #0f4c4c;
}
.table-scroll-wrap tbody td {
	text-align: center;
	vertical-align: middle;
	white-space: nowrap;
	padding: 8px 14px;
	border: 1px solid #d3ece9;
}
.table-scroll-wrap tbody tr:nth-child(even) { background-color: #f2fbfa; }
.table-scroll-wrap tbody tr:hover { background-color: #d9f0ee; }

/* ---- Export buttons ---- */
.meta-actions { display: flex; gap: 8px; }
.export-btn { font-size: 12px; padding: 6px 14px; border-radius: 6px; border: none; white-space: nowrap; color: #fff; cursor: pointer; }
.export-btn.excel { background-color: #1d6f42; }
.export-btn.excel:hover { background-color: #155a34; }
.export-btn.pdf { background-color: #b3401f; }
.export-btn.pdf:hover { background-color: #92341a; }

/* ---- Pagination ---- */
.pagination-wrap { display: none; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; padding: 14px 0 4px; }
.page-btn { min-width: 32px; padding: 5px 10px; font-size: 12px; border: 1px solid #b7ddd9; background-color: #fff; color: #0f4c4c; border-radius: 5px; cursor: pointer; }
.page-btn:hover:not(:disabled) { background-color: #d9f0ee; }
.page-btn.active { background-color: #0f4c4c; border-color: #0f4c4c; color: #fff; font-weight: 600; }
.page-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.page-info { font-size: 12px; color: #0f4c4c; margin-left: 10px; }

/* ---- Level badges (shared across app) ---- */
.level-badge {
	display: inline-block;
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 700;
	color: #fff;
	min-width: 92px;
	text-align: center;
}
.level-4 { background-color: #1e8e5a; }
.level-3 { background-color: #2f80ed; }
.level-2 { background-color: #f2994a; }
.level-1 { background-color: #eb5757; }
.level-0 { background-color: #9aa1b1; }
.level-none { background-color: #d7dae2; color: #6b7280; }
.change-badge {
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 700;
	color: #fff;
}

.mt-5, .my-5 { margin-top: -5rem !important; }
</style>
</head>

<script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
</script>

<body>
	<div id="wrapper">
		<!-- Sidebar -->
		<%@ include file="EmpSidebar.jsp"%>
		<!-- Sidebar -->

		<div id="content-wrapper" class="d-flex flex-column">
			<div id="content">

				<!-- TopBar -->
				<nav class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top"
					style="background-color: #0f4c4c;">
					<button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
						<i class="fa fa-bars"></i>
					</button>
					<ul class="navbar-nav ml-auto">
						<button class="btn btn-link" onclick="window.location.href='Landingpage.jsp'"
							style="background-color: transparent; color: white; border: none;">
							<i class="fa fa-home"></i>
						</button>
						<div class="topbar-divider d-none d-sm-block"></div>
						<li class="nav-item dropdown no-arrow">
							<a class="nav-link dropdown-toggleww" href="#" id="userDropdown123" role="button"
								data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<i class="fas fa-user text-white mr-2"></i>
								<span class="ml-2 d-none d-lg-inline text-white small" id="usernameDisplay">Username</span>
							</a>
							<div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" onclick="logoutUser(event)">
									<i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i> Logout
								</a>
							</div>
						</li>
					</ul>
				</nav>
				<!-- TopBar -->

				<div class="container-fluid" id="container-wrapper">

					<div class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800"></h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="EmpDashBoard.jsp">Home</a></li>
							<li class="breadcrumb-item active">Employee Skill Report</li>
						</ol>
					</div>

					<div class="page-title">Employee Skill Report</div>

					<!-- TABS -->
					<ul class="nav nav-tabs" id="reportTabs">
						<li class="nav-item">
							<a class="nav-link active" data-toggle="tab" href="#summaryTab">Summary</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" data-toggle="tab" href="#detailsTab">Details</a>
						</li>
					</ul>

					<div class="tab-content">

						<!-- ═══════════ SUMMARY TAB ═══════════ -->
						<div class="tab-pane fade show active p-3" id="summaryTab">

							<div class="card shadow-sm mb-3">
								<div class="card-body">
									<div class="row align-items-end">
										<div class="col-6 col-sm-4 col-md-3 mb-2">
											<div class="form-group mb-0">
												<label>Designation</label>
												<select id="summaryDesgSelect" class="form-control">
													<option value="" selected disabled>Select Designation</option>
												</select>
												<span id="summaryDesgError" class="field-error">Required</span>
											</div>
										</div>
										<div class="col-6 col-sm-4 col-md-3 mb-2">
											<div class="form-group mb-0">
												<label>Employee</label>
												<select id="summaryEmpSelect" class="form-control" disabled>
													<option value="" selected>All Employees</option>
												</select>
											</div>
										</div>
										<div class="col-6 col-sm-4 col-md-2 mb-2">
											<label style="visibility:hidden;font-size:12px;">.</label>
											<button id="summaryFetchBtn" class="btn-action" onclick="fetchSummary()">
												<i class="fas fa-search"></i> Fetch
											</button>
										</div>
									</div>
									<div id="summaryNoticeMessage" class="text-muted" style="font-size: 13px; display: none;"></div>
								</div>
							</div>

							<div class="card report-card mb-2" id="summaryReport" style="display:none;">
								<div class="report-header-bar"><h1>Employee Skill Summary</h1></div>
								<div class="card-body">
									<div class="report-meta">
										<div class="meta-info">
											<span class="item"><b>Report Type:</b> Summary</span>
											<span class="item"><b>Designation:</b> <span id="hdrSummaryDesg">-</span></span>
											<span class="item"><b>Employee:</b> <span id="hdrSummaryEmp">-</span></span>
											<span class="item"><b>Total Records:</b> <span id="hdrSummaryCount">0</span></span>
										</div>
										<div class="meta-actions">
											<button type="button" class="export-btn excel" onclick="exportSummaryExcel()"><i class="fas fa-file-excel"></i> Export to Excel</button>
											<button type="button" class="export-btn pdf" onclick="exportSummaryPDF()"><i class="fas fa-file-pdf"></i> Export to PDF</button>
										</div>
									</div>
									<div class="table-scroll-wrap">
										<table class="table table-bordered table-sm" id="tableSummary" width="100%">
											<thead id="tableSummaryHead"></thead>
											<tbody></tbody>
										</table>
									</div>
									<div id="summaryPagination" class="pagination-wrap"></div>
								</div>
							</div>
						</div>

						<!-- ═══════════ DETAILS TAB ═══════════ -->
						<div class="tab-pane fade p-3" id="detailsTab">

							<div class="card shadow-sm mb-3">
								<div class="card-body">
									<div class="row align-items-end">
										<div class="col-6 col-sm-4 col-md-3 mb-2">
											<div class="form-group mb-0">
												<label>Designation</label>
												<select id="detailsDesgSelect" class="form-control">
													<option value="" selected disabled>Select Designation</option>
												</select>
												<span id="detailsDesgError" class="field-error">Required</span>
											</div>
										</div>
										<div class="col-6 col-sm-4 col-md-3 mb-2">
											<div class="form-group mb-0">
												<label>Employee</label>
												<select id="detailsEmpSelect" class="form-control" disabled>
													<option value="" selected>All Employees</option>
												</select>
											</div>
										</div>
										<div class="col-6 col-sm-4 col-md-2 mb-2">
											<label style="visibility:hidden;font-size:12px;">.</label>
											<button id="detailsFetchBtn" class="btn-action" onclick="fetchDetails()">
												<i class="fas fa-search"></i> Fetch
											</button>
										</div>
									</div>
									<div id="detailsNoticeMessage" class="text-muted" style="font-size: 13px; display: none;"></div>
								</div>
							</div>

							<div class="card report-card mb-2" id="detailsReport" style="display:none;">
								<div class="report-header-bar"><h1>Employee Skill Details</h1></div>
								<div class="card-body">
									<div class="report-meta">
										<div class="meta-info">
											<span class="item"><b>Report Type:</b> Details</span>
											<span class="item"><b>Designation:</b> <span id="hdrDetailsDesg">-</span></span>
											<span class="item"><b>Employee:</b> <span id="hdrDetailsEmp">-</span></span>
											<span class="item"><b>Total Records:</b> <span id="hdrDetailsCount">0</span></span>
										</div>
										<div class="meta-actions">
											<button type="button" class="export-btn excel" onclick="exportDetailsExcel()"><i class="fas fa-file-excel"></i> Export to Excel</button>
											<button type="button" class="export-btn pdf" onclick="exportDetailsPDF()"><i class="fas fa-file-pdf"></i> Export to PDF</button>
										</div>
									</div>
									<div class="table-scroll-wrap">
										<table class="table table-bordered table-sm" id="tableDetails" width="100%">
											<thead>
												<tr>
													<th>Sl.No.</th>
													<th>Employee</th>
													<th>Skill</th>
													<th>Old Rating</th>
													<th>New Rating</th>
													<th>Change Type</th>
													<th>Training / Trainer</th>
													<th>Changed By</th>
													<th>Changed Date</th>
												</tr>
											</thead>
											<tbody></tbody>
										</table>
									</div>
									<div id="detailsPagination" class="pagination-wrap"></div>
								</div>
							</div>
						</div>

					</div><!-- /tab-content -->

				</div>
			</div>
		</div>
	</div>

	<a class="scroll-to-top rounded" href="#page-top"><i class="fas fa-angle-up"></i></a>

	<script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>

	<!-- Export libraries -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>

	<script src="js/config.js"></script>
	<script src="js/logout.js"></script>
	<script src="js/username.js"></script>
	<script src="js/modifiedby.js"></script>
	<script src="js/createdby.js"></script>
	<script src="js/Sessionfilter.js"></script>

	<script>
	  window.actionElementMap = {};
	</script>
	<script src="js/permissions.js"></script>

	<script src="js/SkillReport.js?v=<%=ts%>"></script>

</body>
</html>
