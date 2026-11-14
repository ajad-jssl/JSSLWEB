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
	background-color: green !important;
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

/* ====================================
   DO PHASE STAGE ENTRY TABLE
==================================== */
#PhaseTable {
	border-collapse: collapse;
	width: 100%;
}

/* Header */
#PhaseTable thead th {
	background-color: #5578A9 !important;
	color: #ffffff !important;
	font-weight: 600;
	text-align: center;
	vertical-align: middle;
	padding: 10px 8px;
	border: 1px solid #ffffff;
}

/* Rows */
#PhaseTable tbody tr, #PhaseTable.table-striped tbody tr:nth-of-type(odd),
	#PhaseTable.table-striped tbody tr:nth-of-type(even) {
	background-color: #EEF6EE !important;
}

#PhaseTable tbody td {
	background-color: transparent !important;
	text-align: center;
	vertical-align: middle;
	padding: 6px;
	color: #555;
	border: 1px solid #ffffff;
}

/* Inputs and selects inside the table */
#PhaseTable tbody .form-control {
	background-color: #ffffff;
	border: 1px solid #ced4da;
	border-radius: 6px;
}

/* Read-only / disabled fields (grey-blue like the image) */
#PhaseTable tbody .form-control[readonly], #PhaseTable tbody .form-control:disabled
	{
	background-color: #E8EBF5;
	border: 1px solid #dfe3ef;
	cursor: not-allowed;
}
</style>


<style>
#phaseHistoryModal .modal-header {
	background: linear-gradient(135deg, #2f3f9e, #4c5fd5);
	color: #fff;
	border: 0
}

#phaseHistoryModal .modal-header .close {
	color: #fff;
	opacity: .9
}

.ph-strip {
	display: flex;
	flex-wrap: wrap;
	background: #eef1fb;
	border-left: 4px solid #2f3f9e;
	border-radius: 8px;
	padding: 12px 16px;
	margin-bottom: 16px
}

.ph-strip div {
	flex: 1;
	min-width: 140px
}

.ph-strip small {
	display: block;
	color: #6c757d;
	font-size: 12px
}

.ph-strip b {
	font-size: 15px;
	color: #495057
}

#phaseHistoryModal .ph-title {
	font-weight: 600;
	color: #495057;
	margin: 10px 0
}

#phaseHistoryTable th {
	background: #f8f9fa;
	font-size: 13px
}

#phaseHistoryTable td {
	font-size: 13px
}

#phaseHistoryTable td:nth-child(6), #phaseHistoryTable td:nth-child(8) {
	white-space: nowrap;
}

/* 
#exampleModalScrollable123 .modal-body {
	min-height: 420px;      /* room for the contract list */
} */
</style>

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
		<%@ include file="DrawingSideBar.jsp"%>


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
						<h1 class="h3 mb-0 text-gray-800">DO Phase Stage Entry</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a
								href="DotimeSheetDashBoard.jsp">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page"><a
								href="DOPhaseStageEntry.jsp">DO Phase Stage Entry</a></li>

						</ol>
					</div>


					<div class="row mb-3" id="DrawingStage">
						<div class="col-lg-12">
							<div class="card mb-4">
								<div
									style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
									<div
										class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
										style="background-color: #f8f9fc;">
										<button id="PhaseEntry">
											<i class="fas fa-plus"></i> Create
										</button>
									</div>
								</div>



							</div>
						</div>
					</div>




					<div class="modal fade" id="exampleModalScrollable123"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle123"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle123">
										<b>DO Phase Stage Entry</b>
									</h5>
									<button type="button" class="close" data-dismiss="modal"
										aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">

									<!-- Sale Order Details -->
									<div class="form-row">
										<div class="form-group col-md-3">
											<label for="contractSelect"><b>Select Contract:</b></label> <select
												id="contractSelect" class="form-control form-control-sm">
												<option value="">-- Select Contract --</option>

											</select> <small id="contractSelectError"
												style="color: red; display: none;"> Contract is
												required </small>
										</div>
									</div>


									<div id="container2" style="display: none;">
										<div class="employee-box">


											<div class="attendance-containers">

												<div class="table-container mt-3 table-responsive">
													<h5 class="employee-title">DO Phase Entry Details</h5>


													<table class="table table-bordered table-sm"
														id="PhaseTable">
														<thead>
															<tr>
																<th style="width: 60px">Sl.No</th>
																<th style="width: 200px">Contract</th>
																<th style="width: 200px">Part Mark No</th>
																<th style="width: 200px">Stage</th>
																<th style="width: 300px">Remarks</th>
																<th>View</th>


															</tr>
														</thead>



														<tbody id="PhaseTableBody">

															<!--  TEMPLATE ROW (hidden) -->
															<tr id="PhaseRowTemplate" style="display: none">

																<td class="slno">1</td>

																<td><input type="text"
																	class="form-control form-control-sm contractSelect"></td>


																<!-- Part Mark No -->
																<td><input type="text"
																	class="form-control form-control-sm Markno"></td>


																<!-- Stage -->
																<td><select
																	class="form-control form-control-sm Stageselect">
																		<option value="">Select Stage</option>
																</select></td>

																<!-- Remarks -->
																<td><input type="text"
																	class="form-control form-control-sm RemarksInput"></td>

																<td class="text-center">
																	<button type="button"
																		class="btn btn-sm btn-primary ViewHistoryBtn"
																		title="View history">
																		<i class="fas fa-eye"></i>
																	</button>
																</td>



															</tr>

														</tbody>

													</table>

													<div class="table-responsive p-3 mt-4 text-right">
														<button type="button" class="btn btn-success"
															id="savePhaseEntry">Create</button>
														<button type="button" class="btn btn-danger"
															data-dismiss="modal">Close</button>


													</div>

												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>



					<div class="modal fade" id="phaseHistoryModal" tabindex="-1"
						role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-lg modal-dialog-scrollable"
							role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title">Phase Stage History</h5>
									<button type="button" class="close" data-dismiss="modal">&times;</button>
								</div>
								<div class="modal-body">
									<div class="ph-strip">
										<div>
											<small>Contract</small><b id="phHistContract">-</b>
										</div>
										<div>
											<small>Part Mark</small><b id="phHistMark">-</b>
										</div>
										<div>
											<small>Current Phase</small><b id="phHistPhase">-</b>
										</div>
										<div>
											<small>Current Stage</small><b id="phHistStage">-</b>
										</div>
									</div>
									<div class="ph-title">History</div>
									<div class="table-responsive">
										<table class="table table-bordered table-sm"
											id="phaseHistoryTable">





											<thead>
												<tr>
													<th style="width: 50px">Sl.No</th>
													<th>Part Mark</th>
													<th>Stage</th>
													<th>Phase</th>
													<th>Correction</th>
													<th>Remarks</th>
													<th>Entered By</th>
													<th>Entered Date</th>
													<th>Modified By</th>
													<th>Modified Date</th>
												</tr>
											</thead>
											<tbody></tbody>
										</table>
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



					<div class="modal fade" id="confirmPhaseCreateModal" tabindex="-1"
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
										id="confirmPhaseCreate">YES</button>
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

	<script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
	<script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
	<script
		src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
	<script
		src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
	<script
		src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
	<script
		src="js/DOPhaseStageEntry.js?v=<%=ver(application, "/js/DOPhaseStageEntry.js")%>"></script>

	<script>
		/* 	$(document).on('hidden.bs.modal', '.modal', function () {
		 if ($('.modal.show').length) {
		 $('body').addClass('modal-open');      // a modal is still open
		 } else {
		 $('.modal-backdrop').remove();         // clean any orphan backdrop
		 $('body').removeClass('modal-open').css('padding-right', '');
		 }
		 }); */
		document.getElementById("PhaseEntry").addEventListener("click",
				function() {
					//$('#container2').modal('show');
					$('#exampleModalScrollable123').modal('show');

				})
	</script>
</body>
</html>