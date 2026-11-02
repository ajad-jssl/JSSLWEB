<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
	
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
	type="text/css" />
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<link href="css/ruang-admin.min.css" rel="stylesheet" />
<link href="vendor/datatables/dataTables.bootstrap4.min.css"
	rel="stylesheet">

<link rel="stylesheet"
	href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
<link rel="stylesheet" href="css/main.css">


<link
	href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
	rel="stylesheet" />

<script
	src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

<style>
/* ====================================
   GLOBAL
==================================== */
body {
	color: #333;
	background: #ffffff;
}

/* ====================================
   ERROR MESSAGE
==================================== */
.error-message {
	color: #dc3545;
	font-size: 12px;
	margin-top: 4px;
	display: none;
}

/* ====================================
   POPUP MESSAGE
==================================== */
.popup {
	position: fixed;
	top: 20px;
	right: 20px;
	background-color: #4CAF50;
	color: #fff;
	padding: 12px 18px;
	border-radius: 5px;
	z-index: 9999;
}

/* ====================================
   BUTTONS
==================================== */
button {
	padding: 5px 14px;
	font-size: 13px;
	background-color: #4CAF50;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

button:hover {
	background-color: #45a049;
}

button.close {
	padding: 0;
	background: transparent;
	border: none;
}

/* ====================================
   MODAL
==================================== */
.modal-content {
	border-radius: 8px;
}

.modal-header {
	background-color: #f8f9fa;
	color: black;
	border-bottom: 1px solid #dee2e6;
	height: 45px;
}

.modal-header1 {
	background-color: #007bff;
	height: 20px;
}

.modal-body {
	padding: 20px;
}

.modal-footer {
	border-top: 1px solid #dee2e6;
}

/* ====================================
   EMPLOYEE BOX
==================================== */
.employee-box {
	border: 1px solid #ccc;
	border-radius: 8px;
	padding: 20px;
	background-color: #ffffff;
	margin-top: 15px;
}

.employee-title {
	text-align: center;
	margin-bottom: 15px;
	font-weight: bold;
	text-decoration: underline;
}

/* ====================================
   TABLES
==================================== */
/* ====================================
   ATTENDANCE TABLE HEADER
==================================== */
#attendanceTable thead th {
	background-color: #ECF2E6; /* dark ERP blue */
	color: black;
	font-weight: 400;
	text-align: center;
	padding: 8px;
	border: 1px solid #dee2e6;
}

#attendanceTable tbody td {
	padding: 6px;
	text-align: center;
	border: 1px solid #dee2e6;
}

#attendanceTable tbody tr:nth-child(even) {
	background-color: #f4f6fb;
}

/* ====================================
   SHIFT TABLE HEADER
==================================== */
#shiftTable thead th {
	background: rgba(0, 128, 0, 0.3); /* ERP green */
	color: #ffffff;
	font-weight: 400;
	text-align: center;
	padding: 8px;
	border: 1px solid #dee2e6;
}

#shiftTable tbody td {
	padding: 6px;
	text-align: center;
	border: 1px solid #dee2e6;
}

#shiftTable tbody tr:nth-child(even) {
	background-color: #f2f8f4;
}

/* ====================================
   SUMMARY TABLE
==================================== */
.summary-wrapper {
	border: 1px solid #999;
	padding: 10px;
	margin-bottom: 20px;
}

.summary-table {
	width: 100%;
	border-collapse: collapse;
	background: #fffccf;
}

.summary-table th, .summary-table td {
	border: 1px solid #999;
	padding: 6px;
	text-align: center;
	font-size: 14px;
}

/* ====================================
   FORM INPUTS
==================================== */
.form-control, .form-control-sm {
	border-radius: 4px;
}

.readonly-select {
	pointer-events: none;
	background-color: #e9ecef;
}

/* ====================================
   VALIDATION
==================================== */
.field-error {
	border: 1.5px solid #dc3545 !important;
}

.validation-msg {
	color: #dc3545;
	font-size: 11px;
	margin-top: 2px;
}

/* ====================================
   SPECIAL FIELDS
==================================== */
.Total, .GTotal {
	background-color: #e9ecef;
	cursor: not-allowed;
}

/* ====================================
   TABLE ROW HIGHLIGHT
==================================== */
.highlight {
	background-color: #b0c4de;
}

/* ====================================
   LINKS
==================================== */
.loadno-link {
	color: #007bff;
	text-decoration: none;
}

.loadno-link:hover {
	text-decoration: underline;
}

/* ====================================
   SMALL BUTTON
==================================== */
.btn-xs {
	padding: 2px 6px;
	font-size: 12px;
}

/* ====================================
   DATATABLE BUTTON
==================================== */
div.dt-buttons>.dt-button {
	background-color: #336699 !important;
	color: white;
	padding: 4px 10px;
}

/* ====================================
   HIDDEN COLUMN
==================================== */
.hide-column {
	display: none;
}

#yearSelectsss {
	width: 100%;
	padding: 4px 8px;
	border: 1px solid #ced4da;
	border-radius: 4px;
	background-color: #fff;
	font-size: 14px;
}

#yearSelectsss:focus {
	border-color: #80bdff;
	outline: 0;
	box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Highlight selected year row */
.summary-table tbody tr {
	transition: background-color 0.2s;
}

.summary-table tbody tr:hover {
	background-color: #fffacd;
}

.legacy-option {
	color: #dc3545 !important;
	font-style: italic;
	background-color: #fff3cd !important;
}

.legacy-field {
	background-color: #fff3cd !important;
	border: 1px solid #ffc107 !important;
	cursor: not-allowed !important;
	pointer-events: none !important;
}
/* ====================================
   CLEAN SUMMARY CARD
==================================== */
.summary-wrapper {
	border: none;
	padding: 0;
	margin-bottom: 30px;
}

.summary-card {
	background: white;
	border: 1px solid #ddd;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

/* Header */
.summary-header {
	background: #f8f9fa;
	border-bottom: 2px solid #dee2e6;
	padding: 15px 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.summary-title {
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: #2c3e50;
}

.year-select-modern {
	padding: 6px 12px;
	border: 1px solid #ced4da;
	border-radius: 4px;
	font-size: 14px;
	background-color: white;
	color: #495057;
	min-width: 120px;
}

.year-select-modern:focus {
	outline: none;
	border-color: #80bdff;
	box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, .25);
}

/* Employee Info Bar */
.employee-info-bar {
	background: #ffffff;
	border-bottom: 1px solid #e3e6f0;
	padding: 15px 20px;
	display: flex;
	gap: 30px;
	flex-wrap: wrap;
}

.info-item {
	display: flex;
	gap: 8px;
}

.info-label {
	color: #6c757d;
	font-size: 13px;
	font-weight: 500;
}

.info-value {
	color: #2c3e50;
	font-size: 13px;
	font-weight: 600;
}

/* Clean Table */
.clean-summary-table {
	width: 100%;
	margin: 0;
	border-collapse: collapse;
}

.clean-summary-table thead th {
	background: #495057;
	color: white;
	padding: 12px 10px;
	text-align: center;
	font-size: 13px;
	font-weight: 600;
	border: 1px solid #3a3f44;
}

.clean-summary-table tbody td {
	padding: 15px 10px;
	text-align: center;
	font-size: 14px;
	font-weight: 500;
	color: #495057;
	border: 1px solid #dee2e6;
	background: white;
	transition: background 0.2s;
}

.clean-summary-table tbody td:hover {
	background: #f8f9fa;
}

.clean-summary-table .total-column {
	background: #6c757d;
	color: white;
}

.clean-summary-table .total-value {
	background: #f8f9fa;
	font-weight: 700;
	color: #2c3e50;
	font-size: 16px;
}

/* Footer */
.summary-footer {
	background: #f8f9fa;
	border-top: 1px solid #dee2e6;
	padding: 15px 20px;
	display: flex;
	justify-content: space-around;
	gap: 20px;
}

.footer-item {
	text-align: center;
}

.footer-label {
	display: block;
	font-size: 12px;
	color: #6c757d;
	font-weight: 500;
	margin-bottom: 5px;
	text-transform: uppercase;
}

.footer-value {
	display: block;
	font-size: 18px;
	color: #2c3e50;
	font-weight: 700;
}

/* Responsive */
@media ( max-width : 768px) {
	.summary-header {
		flex-direction: column;
		gap: 10px;
		align-items: flex-start;
	}
	.employee-info-bar {
		flex-direction: column;
		gap: 10px;
	}
	.summary-footer {
		flex-direction: column;
		gap: 15px;
	}
}
/* ====================================
   SELECTED DATE HIGHLIGHTING (SIMPLE)
==================================== */
.selected-date-header {
	background-color: #5a5c69 !important;
	color: white !important;
	font-weight: bold !important;
	transform: scale(1.05);
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.selected-date-cell {
	background-color: #f8f9fc !important;
	/* border-left: 3px solid #5a5c69 !important;
	border-right: 3px solid #5a5c69 !important; */
	font-weight: 700 !important;
	color: #2c3e50 !important;
}

#selecteddate {
	background-color: #f8f9fc !important;
	border: 2px solid #5a5c69 !important;
	font-weight: 600;
}

#shiftSelect {
	border: 1px solid #ced4da;
	height: 32px;
}

.clean-summary-table tbody td:not(.total-value) {
	cursor: pointer;
	transition: all 0.2s;
}

.clean-summary-table tbody td:not(.total-value):hover {
	/*  background-color: #e3f2fd !important; */
	transform: scale(1.05);
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Monthly details section styling */
#monthlyDetailsSection .card {
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
}

#monthlyDetailsSection .card-header {
	border-radius: 8px 8px 0 0;
}

/* ====================================
   PUNCH INFO PANEL (right side)
==================================== */
.punch-info-panel {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	justify-content: flex-end;
	background: #f8f9fc;
	border: 1px solid #e3e6f0;
	border-radius: 8px;
	padding: 8px 12px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.punch-stat {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 62px;
	padding: 4px 8px;
	border-radius: 6px;
	background: #ffffff;
	border: 1px solid #e3e6f0;
}

.punch-stat .label {
	font-size: 10px;
	font-weight: 700;
	letter-spacing: 0.4px;
	color: #8a93a5;
	text-transform: uppercase;
	margin-bottom: 2px;
}

.punch-stat .value {
	font-size: 13px;
	font-weight: 700;
	color: #2c3e50;
}

.punch-stat.in .value {
	color: #17a673;
}

.punch-stat.out .value {
	color: #e02424;
}

.punch-stat.total .value {
	color: #2c3e50;
}

.punch-stat.ded .value {
	color: #f6a609;
}

.punch-stat.allowed {
	background: #e9f9f1;
	border-color: #b7ebd3;
}

.punch-stat.allowed .value {
	color: #17a673;
}

.punch-stat.allowed .label {
	color: #17a673;
}

.has-entry-header {
    background-color: #28a745 !important; /* green */
    color: white !important;
    font-weight: bold !important;
}
</style>
<!-- <script type="text/javascript">
    window.history.forward();

    // Auth Guard
    const loginStatus = sessionStorage.getItem('loginStatus');
    if (loginStatus !== 'Success') {
      logout();
    }

    function noBack() {
      window.history.forward();
    }

    function logout() {
      sessionStorage.removeItem('loginStatus');
      window.location = "newlogin.jsp";
    }
  </script> -->
<script>
	const user_id = sessionStorage.getItem('user_id');
	if (!user_id) {
		window.location.href = "newlogin.jsp";
	}
</script>
</head>

<body>
	<div id="wrapper">
		<!-- Sidebar -->
		  <%@ include file="DrawingSideBar.jsp" %>
		<!-- Sidebar -->
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
							class="nav-link dropdown-toggleww" href="#" id="userDropdown123"
							role="button" data-toggle="dropdown" aria-haspopup="true"
							aria-expanded="false"> <i class="fas fa-user text-white mr-2"></i>
								<!-- Settings icon --> <span
								class="ml-2 d-none d-lg-inline text-white small"
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
				<!-- Topbar -->
				<!-- Container Fluid-->
				<div class="container-fluid" id="container-wrapper">
					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800">DO Time Sheet Entry</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="DotimeSheetDashBoard.jsp">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page">DO
								Time Sheet Entry</li>

						</ol>
					</div>


					<div class="row mb-3" id="DrawingEntry">
						<div class="col-lg-12">
							<div class="card mb-4">
								<div
									style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
									<div
										class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
										style="background-color: #f8f9fc;">
										<button id="entry1">
											<i class="fas fa-plus"></i> Create
										</button>
									</div>
								</div>



							</div>
						</div>
					</div>

					<div class="summary-wrapper">
						<div class="summary-card">
							<!-- Header Bar -->
							<div class="summary-header">
								<div class="header-left">
									<h5 class="summary-title">DO Time Sheet Summary Report</h5>
								</div>
								<div class="header-right">
									<label for="yearSelectsss"
										style="margin-right: 10px; color: #5a5c69;">Year:</label> <select
										id="yearSelectsss" class="year-select-modern">
										<option value="">Select Year</option>
									</select>
								</div>
							</div>

							<!-- Employee Info Bar -->
							<div class="employee-info-bar">
								<!-- <div class="info-item">
									<span class="info-label">Employee Name:</span> <span
										class="info-value emp-name"></span>
								</div>-->
								<!--   <div class="info-item">
                <span class="info-label">Shift:</span>
                <span class="info-value">GN</span>
            </div>
            <div class="info-item">
                <span class="info-label">Grade:</span>
                <span class="info-value">L06</span>
            </div>
            <div class="info-item">
                <span class="info-label">Designation:</span>
                <span class="info-value">Trainee</span>
            </div> -->
							</div>

							<!-- Monthly Hours Table -->
							<div class="table-responsive">
								<table class="clean-summary-table">
									<thead>
										<tr>
											<th>SelectedYear</th>
											<th>Jan</th>
											<th>Feb</th>
											<th>Mar</th>
											<th>Apr</th>
											<th>May</th>
											<th>Jun</th>
											<th>Jul</th>
											<th>Aug</th>
											<th>Sep</th>
											<th>Oct</th>
											<th>Nov</th>
											<th>Dec</th>
											<th class="total-column">Total</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<!-- <td><span class="footer-value" id="selectedyear">-</span></td> -->
											<td id="selectedyear" class="footer-value"
												style="cursor: pointer;">-</td>
											<td id="1">0</td>
											<td id="2">0</td>
											<td id="3">0</td>
											<td id="4">0</td>
											<td id="5">0</td>
											<td id="6">0</td>
											<td id="7">0</td>
											<td id="8">0</td>
											<td id="9">0</td>
											<td id="10">0</td>
											<td id="11">0</td>
											<td id="12">0</td>
											<td id="totalyear" class="total-value">0</td>
										</tr>
									</tbody>
								</table>
							</div>
							<!-- Add this AFTER the summary table closing </div> -->

							<!-- ✅ NEW: Monthly Details Table Section -->
							<div id="monthlyDetailsSection"
								style="display: none; margin-top: 30px;">
								<div class="card">
									<div class="card-header"
										style="background: #495057; color: white;">
										<h6 class="m-0 font-weight-bold">

											Monthly Time Sheet Entry Details - <span
												id="detailsMonthYear"></span>
										</h6>
									</div>
									<div class="card-body">
										<div class="table-responsive">
											<table id="monthlyDetailsTable"
												class="table table-bordered table-striped table-hover">
												<thead style="background-color: #4e73df; color: white;">
													<tr>
														<th>Sl.No</th>
														<th>Date</th>
														<th>Shift</th>
														<th>Contract</th>
														<!--  <th>Contract Name</th> -->
														<!--  <th>Phase</th> -->
														<th>Type</th>
														<th>Activity</th>
														<th>DH</th>
														<th>IH</th>
														<th>RH</th>
														<th>Total Hrs</th>
													</tr>
												</thead>
												<tbody id="monthlyDetailsBody">
													<!-- Data will be populated here -->
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>

							<!-- Footer Summary -->
							<div class="summary-footer" style="display: none;">
								<div class="footer-item">
									<span class="footer-label">Selected Year:</span> <span
										class="footer-value" id="selectedyear">-</span>
								</div>
								<div class="footer-item">
									<span class="footer-label">Total Hours:</span> <span
										class="footer-value" id="totalyearFooter">0.00</span>
								</div>
								<div class="footer-item">
									<span class="footer-label">Monthly Average:</span> <span
										class="footer-value" id="avgPerMonth">0.00</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Modal 1: Create QS Package Details -->
					<!-- Form Container with Outline and Title -->

					<div class="modal fade" id="exampleModalScrollable123"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle123"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle123">
										<b>DO Time Sheet Entry</b>
									</h5>
									<button type="button" class="close" data-dismiss="modal"
										aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="scrapSaleOrderForm">
										<!-- Sale Order Details -->
										<div class="form-row">
											<div class="form-group col-md-3">
												<label for="yearSelect"><b>Select Year:</b></label> <select
													id="yearSelect" class="form-control form-control-sm">
													<option value="">-- Select Year --</option>

												</select> <small id="yearSelectError"
													style="color: red; display: none;"> Year is
													required </small>
											</div>

											<div class="form-group col-md-3">
												<label for="monthSelect"><b>Select Month:</b></label> <select
													id="monthSelect" class="form-control form-control-sm">
													<option value="-1">-- Select Month --</option>
													<option value="0">January</option>
													<option value="1">February</option>
													<option value="2">March</option>
													<option value="3">April</option>
													<option value="4">May</option>
													<option value="5">June</option>
													<option value="6">July</option>
													<option value="7">August</option>
													<option value="8">September</option>
													<option value="9">October</option>
													<option value="10">November</option>
													<option value="11">December</option>
												</select> <small id="monthSelectError"
													style="color: red; display: none;"> Month is
													required </small>
											</div>





											<div class="form-group col-md-3">
												<label for="weekSelect"><b>Select Week:</b></label> <select
													id="weekSelect" class="form-control form-control-sm">
													<option value="">-- Select Week --</option>

												</select> <small id="weekSelectError"
													style="color: red; display: none;"> Week is
													Required </small>
											</div>




										</div>




										<div id="container1" style="display: none;">
											<div class="employee-box">
												<h5 class="employee-title">Employee Details</h5>

												<div class="attendance-container table-responsive">
													<table id="attendanceTable"
														class="table table-bordered table-sm ">
														<thead>
															<tr id="tableHeader">
																<th>Location</th>
																<th>Name</th>

																<th>Total</th>
															</tr>
														</thead>
														<tbody id="attendanceBody" class="text-center">
														</tbody>
													</table>
												</div>


											</div>
										</div>


										<div id="container2" style="display: none;">
											<div class="employee-box">


												<div class="attendance-containers">

													<div class="table-container mt-3 table-responsive">
														<h5 class="employee-title">Shift Entry</h5>



												<!-- 		<div class="row mb-3">
															<div class="col-md-3">
																<label style="font-weight: 400;">Select Shift</label> <select
																	id="shiftSelect"
																	class="form-control form-control-sm shiftSelect">
																	<option value="">Select Shift</option>
																</select>
															</div>


														
															<div
																class="col-md-7 d-flex justify-content-end align-items-start"> Punch Hours
																<div id="punchHoursInfo"></div>
															</div>

															<input type="hidden" id="selectedDateValue" value="">
														</div> -->
														
														<div class="row mb-3">
    <div class="col-md-3">
        <label style="font-weight: 400;">Select Shift</label> <select
            id="shiftSelect"
            class="form-control form-control-sm shiftSelect">
            <option value="">Select Shift</option>
        </select>
    </div>

    <div class="col-md-9 ml-auto d-flex flex-column align-items-end">
        <label style="font-weight: 700; margin-bottom: 4px; margin-right:180px;"> Punch Hours:</label>
        <div id="punchHoursInfo"></div>
    </div>

    <input type="hidden" id="selectedDateValue" value="">
</div>
														<div class="subContainer">

															<!-- <h5 class="employee-title">Shift Entry</h5> -->
															<table
																class="table table-striped table-bordered table-sm "
																id="shiftTable">
																<thead class="bg-primary text-white">
																	<tr>
																		<th>Sl.No</th>
																		<th>Shift</th>
																		<th>Contract</th>
																		<!-- <th>Phase</th> -->
																		<th>Type</th>
																		<th>Activity</th>
																		<th>D.H</th>
																		<th>I.H</th>
																		<th>Rework</th>
																		<th>Reason</th>
																		<th>R.H</th>

																		<th>EC_NO</th>
																		<th>Total</th>

																		<th>Action</th>
																	</tr>
																</thead>



																<tbody id="shiftTableBody">

																	<!--  TEMPLATE ROW (hidden) -->
																	<tr id="shiftRowTemplate" style="display: none">

																		<td class="slno">1</td>

																		<!-- Select Shifts -->
																		<td><select
																			class="form-control form-control-sm shiftSelect">

																		</select></td>

																		<!-- Contract -->
																		<td><select
																			class="form-control form-control-sm contractSelect">
																				<option value="">Select Contract</option>
																		</select></td>

																		<!-- Phase -->


																		<!-- Modal -->
																		<td><select
																			class="form-control form-control-sm modalselect">
																				<option value="">Select Type</option>
																		</select></td>

																		<!-- Activity -->
																		<td><select
																			class="form-control form-control-sm activityselect">
																				<option value="">Select Activity</option>
																		</select></td>

																		<!-- DH -->
																		<td><input type="number"
																			class="form-control form-control-sm dhInput" min="0"
																			readonly></td>

																		<!-- IH -->
																		<td><input type="number"
																			class="form-control form-control-sm IHours" min="0"
																			readonly></td>

																		<!-- Revision -->
																		<td><select
																			class="form-control form-control-sm revisionSelect">
																				<option value="N" selected>No</option>
																				<option value="Y">Yes</option>
																		</select></td>


																		<!-- Reason -->
																		<td><select
																			class="form-control form-control-sm reasonSelect readonly-select">
																				<option value="">Select</option>
																		</select></td>
																		<!-- Rework -->
																		<td><input type="number"
																			class="form-control form-control-sm reworkInput"
																			min="0" readonly></td>



																		<!-- EC No -->
																		<td><input type="text"
																			class="form-control form-control-sm ecNoInput"
																			readonly></td>

																		<!-- Total -->
																		<td><input type="number"
																			class="form-control form-control-sm Total" min="0"
																			readonly></td>


																		<!-- Action -->
																		<td class="text-center"><i
																			class="fas fa-trash delete-icon"
																			style="color: red; cursor: pointer"
																			onclick="deleteShiftRow(this)"></i></td>

																	</tr>

																</tbody>

															</table>

															<button type="button" class="btn btn-sm btn-secondary"
																onclick="addShiftRow()">Add New Row</button>


															<!-- ✅ Better styled Grand Total -->
															<div class="row mt-3 mr-0 ml-0"
																style="padding-top: 10px;">
																<div class="col-md-8"></div>
																<div class="col-md-4">
																	<div class="card" style="background-color: #f8f9fa;">
																		<div class="card-body p-2">
																			<div class="row">
																				<div class="col-6 text-right">
																					<strong>Grand Total:</strong>
																				</div>
																				<div class="col-6 text-center">
																					<span id="grandTotalDisplay"
																						style="color: #28a745; font-size: 1.2rem; font-weight: bold;">
																						0.00 </span> <small>hrs</small>
																				</div>
																			</div>
																		</div>
																	</div>

																	<!-- ✅ NEW: Error message display -->
																	<div id="grandTotalError"
																		class="alert alert-danger mt-2"
																		style="display: none; padding: 8px; font-size: 0.9rem;">
																		<i class="fas fa-exclamation-triangle"></i> <span
																			id="grandTotalErrorMessage"></span>
																	</div>
																</div>
															</div>




															<div class="table-responsive p-3 mt-4 text-right">
																<button type="button" class="btn btn-secondary"
																	data-dismiss="modal">Close</button>
																<button type="button" class="btn btn-primary"
																	id="saveButton">Create</button>

															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
								</div>
							</div>
						</div>
					</div>





					<!-- Custom Error Modal -->
					<div class="modal fade" id="customErrorModal" tabindex="-1"
						role="dialog" aria-labelledby="customErrorModalTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

								<!-- Optional: Header (empty or you can add a title) -->
								<div class="modal-header1"></div>

								<!-- Body: dynamic message -->
								<div class="modal-body text-center">
									<b id="customErrorMessage">Your message goes here.</b>
								</div>

								<!-- Footer: single OK button -->
								<div class="modal-footer d-flex justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>
							</div>
						</div>
					</div>



					<div class="modal fade" id="confimationDrawingEntry" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to Create?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmdrawingentry">YES</button>
								</div>
							</div>
						</div>
					</div>














				</div>
			</div>





		</div>
	</div>


	<a class="scroll-to-top rounded" href="#page-top"> <i
		class="fas fa-angle-up"></i>
	</a>


















	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>

	<script src="vendor/datatables/jquery.dataTables.min.js"></script>
	<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
	<script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>


	
<script
		src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
	<script
		src="externalLibrary/cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js"></script>
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
<script src="js/DrawingEntry.js?v=<%=ver(application, "/js/DrawingEntry.js")%>"></script>
	<script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
	<script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
	<script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
	<script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
	<script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
	<script>
		
	</script>
</body>
</html>