<%@page import="com.JSSL2024.property.PropertyLink"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  response.setHeader("Pragma", "no-cache");
  response.setDateHeader("Expires", 0);
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
	type="text/css">
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css">
<link href="css/ruang-admin.min.css" rel="stylesheet">
<link rel="stylesheet" href="css/main.css">
<link href="css/masterpage.css" rel="stylesheet">



<style>
body {
	color: black;
}

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

button {
	padding: 5px 15px;
	font-size: 13px;
	background-color: #4CAF50;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}

button:hover {
	background-color: #45a049;
}

button.close {
	padding: 0;
	background-color: transparent;
	border: 0;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
}

.modal-content {
	border-radius: 10px;
}

.modal-header {
	color: black;
	border-bottom: 1px solid #dee2e6;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 45px;
}

.modal-title {
	line-height: 20px;
}

.modal-body {
	padding: 20px;
}

.modal-footer {
	border-top: 1px solid #dee2e6;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
}

.btn-outline-primary {
	color: #007bff;
	border-color: #007bff;
}

.btn-outline-primary:hover {
	background-color: #007bff;
	color: #fff;
}

.btn-primary {
	background-color: #007bff;
	border-color: #007bff;
}

.btn-primary:hover {
	background-color: #0056b3;
	border-color: #0056b3;
}

.input-group-prepend .input-group-text, .input-group-append  .input-group-text
	{
	font-size: 12px;
	color: black;
}

.input-group-prepend span, .input-group-append  span {
	color: black;
	background-color: #dcdce6;
	border-color: #dcdce6;
}

div.dt-buttons>.dt-button:first-child, div.dt-buttons>div.dt-button-split .dt-button:first-child
	{
	margin-left: 0;
	background-color: #336699 !important;
	color: white;
	padding: 4px 10px;
}

.hide-column {
	display: none;
}

.highlight {
	background-color: #b0c4de;
}

.loadno-link {
	color: #007bff;
	text-decoration: none;
}

.loadno-link:hover {
	text-decoration: underline;
}

th, td {
	white-space: nowrap;
	text-align: center;
	vertical-align: middle;
}

.table td input.form-control-sm {
	min-width: 120px;
}

.modal-body, .table-responsive {
	overflow-x: auto;
}

thead th {
	position: sticky;
	top: 0;
	background-color: #f8f9fa;
	z-index: 2;
}

table.table-bordered th, table.table-bordered td {
	border: 1px solid #000 !important;
}

.table th, .table td {
	min-width: 150px;
	font-size: 13px;
}

.report-header {
	font-weight: bold;
	color: black;
	text-transform: uppercase;
	text-decoration: underline;
	margin-bottom: 20px;
}

.container-report {
	border: 2px solid black;
	border-radius: 10px;
	padding: 20px;
	background-color: white;
	max-width: 95vw;
	margin: auto;
}

.white-button {
	background-color: white;
	color: black;
}

.increased-height {
	height: 100px;
}

@media print {
	body {
		-webkit-print-color-adjust: exact !important;
		print-color-adjust: exact !important;
	}
	.btn {
		display: none !important;
	}
	.container-report {
		border: none;
		padding: 0;
		box-shadow: none;
	}
	thead th {
		background-color: #f2f2f2 !important;
		color: black !important;
		font-weight: bold;
	}
	.table td, .table th {
		font-size: 11px;
		padding: 4px;
	}
}

.nav-tabs .nav-link.active {
	background-color: #37499A;
	color: white !important;
	border-color: #37499A #37499A #fff;
}

.nav-tabs .nav-link.active b {
	color: white;
}
</style>

<script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) { window.location.href = "newlogin.jsp"; }
  </script>
<script type="text/javascript">
    function noBack() { window.history.forward(); }n
  </script>
</head>

<body id="page-top">
	<div id="wrapper">

		<!-- Sidebar -->
		<%@ include file="DrawingSideBar.jsp"%>

		<div id="content-wrapper" class="d-flex flex-column">
			<div id="content">

				<!-- TopBar -->
				<nav
					class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top"
					style="background-color: #37499A;">
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
							class="nav-link dropdown-toggle" href="#" id="userDropdown123"
							role="button" data-toggle="dropdown" aria-haspopup="true"
							aria-expanded="false"> <i class="fas fa-user text-white mr-2"></i>
								<span class="ml-2 d-none d-lg-inline text-white small"
								id="usernameDisplay">Username</span> <span
								class="ml-2 d-none d-lg-inline text-white small"
								id="selectedFactoryId">No Factory Selected</span>
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
				<!-- /TopBar -->

				<div class="container-fluid" id="container-wrapper">

					<!-- Page heading -->
					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800">DO Time Sheet Report</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a
								href="DotimeSheetDashBoard.jsp">Home</a></li>
							<li class="breadcrumb-item"><a href="">DO Report</a></li>
						</ol>
					</div>

					<!-- Tab navigation -->
					<!--    <div class="container mt-5">
            <div class="d-flex justify-content-center mb-4">
              <div class="nav nav-tabs" id="gpmsTabs" role="tablist">
                <a class="nav-item nav-link active" id="itemsTab"
                   data-bs-toggle="tab" href="#items" role="tab"><b>Detailed Report</b></a>
              
              </div>
            </div>
          </div> -->

					<div class="container mt-5">
						<div class="d-flex justify-content-center mb-4">
							<div class="nav nav-tabs" id="gpmsTabs" role="tablist">
								<a class="nav-item nav-link active" id="itemsTab"
									href="javascript:void(0);" role="tab"
									onclick="toggleReportTab('detailed')"><b>Detailed
										Report</b></a> <a class="nav-item nav-link" id="financeTab"
									href="javascript:void(0);" role="tab"
									onclick="toggleReportTab('finance')"><b>Finance Report</b></a>
							</div>
						</div>
					</div>

					<!-- Filter section -->
					<div id="amsFilterSection" style="display: block;">
						<div class="container mt-3 border-box p-3"
							style="border: 1px solid #ddd; border-radius: 5px;">
							<div class="form-row mt-3">

								<!-- Contract -->
								<div class="col-md-3 mb-3" id="searchContract"
									style="display: block;">
									<label><b>Select Contract:</b></label> <select
										class="form-control form-control-sm universal-select"
										id="contract">
										<option value="">Select Contract</option>
									</select>
								</div>

								<!-- Employee -->
								<div class="col-md-3 mb-3" id="searchEmployee"
									style="display: block;">
									<label><b>Select User:</b></label> <select
										class="form-control form-control-sm universal-select"
										id="employee">
										<option value="">Select Employee</option>
									</select>
								</div>

								<!-- Start Date -->
								<div class="form-group col-md-2">
									<label for="fromDate"><b>Start Date:</b></label> <input
										type="date" class="form-control form-control-sm" id="fromDate">
								</div>

								<!-- End Date -->
								<div class="form-group col-md-2">
									<label for="toDate"><b>End Date:</b></label> <input type="date"
										class="form-control form-control-sm" id="toDate">
								</div>

								<!-- Search button -->
								<div class="col-md-2 mb-3 d-flex align-items-end">
									<button class="btn btn-primary btn-sm w-100"
										id="amsFilterSubmit">Search</button>
								</div>

							</div>
						</div>
					</div>

					<!-- Detailed Report table -->
					<div id="container1" style="display: none;">
						<div class="modal-body">
							<form>
								<div class="container container-report mt-4">
									<h5 class="text-center report-header">DO Time Sheet Detail
										Report</h5>
									<div class="form-row dynamic-row">
										<div class="table-responsive">
											<table class="table table-bordered table-sm" id="TableID">
												<thead>
													<!-- built dynamically by DrawingReport.js renderPivotTable() -->
													<tr>
														<th>SL.NO</th>
														<th>Location</th>
														<th>Empcode</th>
														<th>Name</th>
														<th>Total Hours</th>
													</tr>
												</thead>
												<tbody>
													<!-- populated by DrawingReport.js -->
												</tbody>
											</table>
										</div>
									</div>
									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportToExcelitem('detailed')">Export to
										Excel</button>
								</div>
							</form>
						</div>
					</div>

					<!-- Finance Report table -->
					<div id="container2" style="display: none;">
						<div class="modal-body">
							<form>
								<div class="container container-report mt-4">
									<h5 class="text-center report-header">DO Finance Report</h5>
									<div class="form-row dynamic-row">
										<div class="table-responsive"
											style="max-height: 450px; overflow-y: auto;">
											<table class="table table-bordered table-sm"
												id="TableFinance">
												<thead>
													<tr>
														<th>SL.NO</th>
														<th>Location</th>
														<th>Name</th>
														<th>Total Hours</th>
													</tr>
												</thead>
												<tbody>
													<!-- populated by DrawingReport.js -->
												</tbody>
											</table>
										</div>
									</div>
									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportToExcelitem('finance')">Export to
										Excel</button>
								</div>
							</form>
						</div>
					</div>

				</div>
				<!-- /container-fluid -->
			</div>
		</div>
	</div>

	<!-- Scroll to top -->
	<a class="scroll-to-top rounded" href="#page-top"> <i
		class="fas fa-angle-up"></i>
	</a>

		<script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>

	<script src="vendor/datatables/jquery.dataTables.min.js"></script>
	<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
	<script src="js/config.js?v=<%=jsVersion%>"></script>

<script
		src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
	<script
		src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
	<script
		src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
	<script
		src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
	<script
		src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
	<script
		src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
	<!-- SheetJS for Excel export -->
	<script
		src="externalLibrary/cdn.sheetjs.com/0.20.3/xlsx.full.min.js"></script>

	<script src="js/DrawingReport.js?v=<%=jsVersion%>"></script>
	<script src="js/username.js?v=<%=jsVersion%>"></script>
	<script src="js/logout.js?v=<%=jsVersion%>"></script>
	<script src="js/Sessionfilter.js?v=<%=jsVersion%>"></script>
		<script
		src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>



</body>
</html>
