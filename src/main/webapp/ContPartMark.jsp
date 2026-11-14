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

.error-message {
	color: #dc3545;
	font-size: 12px;
	margin-top: 4px;
	display: none;
}

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

button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

button.close {
	padding: 0;
	background: transparent;
	border: none;
	color: #000;
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
   ENTRY BOX
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
   ENTRY TABLE (inside modal)
==================================== */
#partTable thead th {
	background-color: #ECF2E6;
	color: black;
	font-weight: 500;
	text-align: center;
	padding: 8px;
	border: 1px solid #dee2e6;
}

#partTable tbody td {
	padding: 6px;
	text-align: center;
	vertical-align: middle;
	border: 1px solid #dee2e6;
}

#partTable tbody tr:nth-child(even) {
	background-color: #f2f8f4;
}

.readonly-field {
	background-color: #e9ecef !important;
	cursor: not-allowed;
}

.field-error {
	border: 1.5px solid #dc3545 !important;
}

/* ====================================
   SUMMARY CARD (same look as DO Time Sheet page)
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
	min-width: 180px;
}

.year-select-modern:focus {
	outline: none;
	border-color: #80bdff;
	box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, .25);
}

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
	padding: 10px;
	text-align: center;
	font-size: 14px;
	color: #495057;
	border: 1px solid #dee2e6;
	background: white;
}

.clean-summary-table tbody tr:hover td {
	background: #f8f9fa;
}

.clean-summary-table tfoot td {
	background: #f8f9fa;
	font-weight: 700;
	color: #2c3e50;
	border: 1px solid #dee2e6;
	padding: 10px;
	text-align: center;
}

.clean-summary-table td.left {
	text-align: left;
}

@media ( max-width : 768px) {
	.summary-header {
		flex-direction: column;
		gap: 10px;
		align-items: flex-start;
	}
}

/* ====================================
   IMPORT EXCEL MODAL
==================================== */
.import-header {
	height: auto !important;
	padding: 12px 20px;
	align-items: center;
}

.import-contract-badge {
	margin-left: auto;
	margin-right: 15px;
	background: #ECF2E6;
	color: #2c3e50;
	border: 1px solid #cfe0c3;
	border-radius: 20px;
	padding: 3px 12px;
	font-size: 13px;
}

.import-step-title {
	font-size: 13px;
	font-weight: 600;
	color: #2c3e50;
	margin: 0 0 8px;
}

.import-step-title span {
	display: inline-block;
	width: 20px;
	height: 20px;
	line-height: 20px;
	text-align: center;
	background: #4CAF50;
	color: #fff;
	border-radius: 50%;
	font-size: 12px;
	margin-right: 6px;
}

/* drop zone */
.import-dropzone {
	border: 2px dashed #b9c4d0;
	border-radius: 8px;
	background: #f8fafc;
	padding: 28px 15px;
	text-align: center;
	cursor: pointer;
	transition: all .15s;
}

.import-dropzone:hover, .import-dropzone.dragover {
	border-color: #4CAF50;
	background: #f2f8f4;
}

.import-dropzone i {
	font-size: 36px;
	color: #1d6f42;
}

.import-dropzone .dz-main {
	margin: 8px 0 2px;
	font-weight: 600;
	color: #2c3e50;
}

.import-dropzone .dz-sub {
	font-size: 12px;
	color: #858796;
}

/* chosen file chip */
.import-file-chip {
	display: none;
	align-items: center;
	border: 1px solid #cfe0c3;
	background: #f2f8f4;
	border-radius: 8px;
	padding: 10px 14px;
}

.import-file-chip .fi {
	font-size: 26px;
	color: #1d6f42;
	margin-right: 12px;
}

.import-file-chip .fn {
	font-weight: 600;
	color: #2c3e50;
	word-break: break-all;
}

.import-file-chip .fs {
	font-size: 12px;
	color: #858796;
}

.import-file-chip .fx {
	margin-left: auto;
	color: #dc3545;
	cursor: pointer;
	padding: 4px 8px;
}

/* option cards */
.import-option {
	position: relative;
	display: block;
	margin: 0;
	cursor: pointer;
	height: 100%;
}

.import-option input {
	position: absolute;
	opacity: 0;
}

.import-option-box {
	display: flex;
	align-items: flex-start;
	border: 1.5px solid #dee2e6;
	border-radius: 8px;
	padding: 10px 12px;
	background: #fff;
	height: 100%;
	transition: all .15s;
}

.import-option-box i {
	font-size: 18px;
	color: #858796;
	margin: 3px 12px 0 0;
}

.import-option-box b {
	display: block;
	color: #2c3e50;
	font-size: 14px;
}

.import-option-box small {
	color: #858796;
	font-size: 12px;
}

.import-option:hover .import-option-box {
	border-color: #9fd3a3;
}

.import-option input:checked+.import-option-box {
	border-color: #4CAF50;
	background: #f2f8f4;
	box-shadow: 0 0 0 .15rem rgba(76, 175, 80, .2);
}

.import-option input:checked+.import-option-box i {
	color: #4CAF50;
}

/* preview */
.import-stats {
	display: flex;
	gap: 10px;
	margin-bottom: 10px;
}

.import-stat {
	flex: 1;
	border: 1px solid #dee2e6;
	border-radius: 8px;
	padding: 8px 12px;
	background: #f8f9fa;
}

.import-stat .v {
	font-size: 20px;
	font-weight: 700;
	color: #2c3e50;
	line-height: 1.2;
}

.import-stat .l {
	font-size: 12px;
	color: #858796;
}

.import-preview-table {
	font-size: 13px;
	margin: 0;
}

.import-preview-table thead th {
	background: #495057;
	color: #fff;
	font-weight: 600;
	border: 1px solid #3a3f44;
	padding: 6px 10px;
}

.import-preview-table td {
	padding: 5px 10px;
	border: 1px solid #dee2e6;
}

.import-more {
	font-size: 12px;
	color: #858796;
	text-align: center;
	padding-top: 6px;
}

.import-alert {
	border: 1px solid #f5c6cb;
	background: #fdecea;
	color: #a94442;
	border-radius: 6px;
	padding: 8px 12px;
	font-size: 13px;
}

.import-working {
	color: #5a5c69;
	font-size: 13px;
}
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
		<!-- Sidebar : change to the sidebar of your module if it is not the drawing one -->
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
				<!-- Topbar -->

				<!-- Container Fluid-->
				<div class="container-fluid" id="container-wrapper">
					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800">Contract Part Entry</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="Landingpage.jsp">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page">Contract
								Part Entry</li>
						</ol>
					</div>

					<!-- Create button card -->
					<div class="row mb-3" id="PartEntry">
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

					<!-- Saved parts list -->
					<div class="summary-wrapper">
						<div class="summary-card">
							<div class="summary-header">
								<div class="header-left">
									<h5 class="summary-title">Contract Part List</h5>
								</div>
								<!-- <div class="header-right">
									<label for="contractFilter"
										style="margin-right: 10px; color: #5a5c69;">Contract:</label>
									<select id="contractFilter" class="year-select-modern">
										<option value="">Select Contract</option>
									</select>
								</div> -->


								<div class="header-right d-flex align-items-center">
									<label for="listPageSize"
										style="margin: 0 8px 0 0; color: #5a5c69;">Rows:</label> <select
										id="listPageSize" class="year-select-modern"
										style="min-width: 70px; margin-right: 20px;">
										<option value="10" selected>10</option>
										<option value="25">25</option>
										<option value="50">50</option>
										<option value="100">100</option>
									</select> <label for="contractFilter"
										style="margin: 0 10px 0 0; color: #5a5c69;">Contract:</label>
									<select id="contractFilter" class="year-select-modern">
										<option value="">Select Contract</option>
									</select>
								</div>
							</div>

							<div class="table-responsive">
								<table class="clean-summary-table" id="partListTable">
									<thead>
										<tr>
											<th>Sl.No</th>
											<th>Contract No</th>
											<th>Mark</th>
											<th>Name</th>
										</tr>
									</thead>
									<tbody id="partListBody">
										<tr>
											<td colspan="4">Select a contract to view its parts.</td>
										</tr>
									</tbody>
									<tfoot id="partListFoot"></tfoot>
								</table>
							</div>

							<div
								class="d-flex justify-content-between align-items-center flex-wrap p-3"
								style="border-top: 1px solid #dee2e6;">
								<small id="listPagerInfo" class="text-muted"></small>
								<ul class="pagination pagination-sm mb-0" id="listPagerList"></ul>
							</div>
						</div>
					</div>

					<!-- Modal: Create Contract Part Entry -->
					<div class="modal fade" id="partEntryModal" tabindex="-1"
						role="dialog" aria-labelledby="partEntryModalTitle"
						aria-hidden="true" data-backdrop="static">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1100px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="partEntryModalTitle">
										<b>Contract Part Entry</b>
									</h5>
									<button type="button" class="close" data-dismiss="modal"
										aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>

								<div class="modal-body">

									<div class="form-row">
										<div class="form-group col-md-4">
											<label for="contractSelect"><b>Select Contract:</b></label> <select
												id="contractSelect" class="form-control form-control-sm">
												<option value="">-- Select Contract --</option>
											</select> <small id="contractSelectError"
												style="color: red; display: none;"> Contract is
												required </small>
										</div>
									</div>

									<!-- appears after a contract is chosen -->
									<div id="partEntryContainer" style="display: none;">
										<!-- <div class="employee-box">
											<h5 class="employee-title">Part Details</h5>

											<div class="table-responsive">
												<table id="partTable"
													class="table table-bordered table-sm">
													<thead>
														<tr>
															<th style="width: 70px;">Sl.No</th>
															<th style="width: 180px;">Contract No</th>
															<th style="width: 200px;">Mark</th>
															<th>Name</th>
															<th style="width: 70px;">Action</th>
														</tr>
													</thead>
													<tbody id="partTableBody"></tbody>
												</table>
											</div>

											<div class="d-flex justify-content-between align-items-center">
												<button type="button" class="btn btn-sm btn-secondary"
													id="addRowBtn">Add New Row</button>
												<div>
													<strong>Total Parts:</strong> <span id="totalRowsDisplay"
														style="font-weight: bold;">0</span>
												</div>
											</div>

											<div class="p-3 mt-3 text-right">
												<button type="button" class="btn btn-secondary"
													data-dismiss="modal">Close</button>
												<button type="button" class="btn btn-primary"
													id="saveButton">Create</button>
											</div>
										</div> -->


										<div class="text-right mb-2">
											<button type="button" class="btn btn-sm btn-success"
												id="importExcelBtn">
												<i class="fas fa-file-excel"></i> Import Excel Data
											</button>
										</div>



										<div class="employee-box">
											<h5 class="employee-title">Part Details</h5>

											<div
												class="d-flex justify-content-between align-items-center flex-wrap mb-2">
												<div class="d-flex align-items-center">
													<label for="partSearch" class="mb-0 mr-2"><b>Search
															Mark:</b></label> <input type="text" id="partSearch"
														class="form-control form-control-sm" style="width: 260px;"
														placeholder="e.g. 1C*  or  ?C1" autocomplete="off">
												</div>
												<div class="d-flex align-items-center">
													<label for="pageSizeSelect" class="mb-0 mr-2">Rows
														per page:</label> <select id="pageSizeSelect"
														class="form-control form-control-sm" style="width: 80px;">
														<option value="10" selected>10</option>
														<option value="25">25</option>
														<option value="50">50</option>
														<option value="100">100</option>
													</select>
												</div>
											</div>

											<div class="table-responsive">
												<table id="partTable" class="table table-bordered table-sm">
													<thead>
														<tr>
															<th style="width: 70px;">Sl.No</th>
															<th style="width: 180px;">Contract No</th>
															<th style="width: 200px;">Mark</th>
															<th>Name</th>
															<th style="width: 70px;">Action</th>
														</tr>
													</thead>
													<tbody id="partTableBody"></tbody>
													<tbody id="partNewBody"></tbody>
												</table>
											</div>

											<div
												class="d-flex justify-content-between align-items-center flex-wrap mb-3">
												<small id="pagerInfo" class="text-muted"></small>
												<ul class="pagination pagination-sm mb-0" id="pagerList"></ul>
											</div>

											<div
												class="d-flex justify-content-between align-items-center">
												<button type="button" class="btn btn-sm btn-secondary"
													id="addRowBtn">Add New Row</button>
												<div>
													<strong>Total Parts:</strong> <span id="totalRowsDisplay"
														style="font-weight: bold;">0</span>
												</div>
											</div>

											<div class="p-3 mt-3 text-right">
												<button type="button" class="btn btn-secondary"
													data-dismiss="modal">Close</button>
												<button type="button" class="btn btn-primary"
													id="saveButton">Save</button>
											</div>
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>

					<!-- Custom Error Modal -->
					<div class="modal fade" id="customErrorModal" tabindex="-1"
						role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body text-center">
									<b id="customErrorMessage">Your message goes here.</b>
								</div>
								<div class="modal-footer d-flex justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Modal: Import Excel Data -->
					<div class="modal fade" id="importModal" tabindex="-1"
						role="dialog" aria-hidden="true" data-backdrop="static">
						<div
							class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
							role="document">
							<div class="modal-content">

								<div class="modal-header import-header">
									<h5 class="modal-title">
										<i class="fas fa-file-excel mr-2" style="color: #1d6f42"></i><b>Import
											Excel Data</b>
									</h5>
									<span class="import-contract-badge">Contract: <b
										id="importContractName"></b></span>
									<button type="button" class="close" data-dismiss="modal"
										aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>

								<div class="modal-body">

									<!-- Step 1 -->
									<p class="import-step-title">
										<span>1</span>Choose the Excel file
									</p>

									<div class="import-dropzone" id="importDropzone">
										<i class="fas fa-cloud-upload-alt"></i>
										<div class="dz-main">Drag &amp; drop your Excel file
											here, or click to browse</div>
										<div class="dz-sub">
											.xlsx / .xls &nbsp;|&nbsp; columns read from the header row:
											<b>Mark</b> and <b>NAME</b>
										</div>
									</div>

									<div class="import-file-chip" id="importFileChip">
										<i class="fas fa-file-excel fi"></i>
										<div>
											<div class="fn" id="importFileName"></div>
											<div class="fs" id="importFileSize"></div>
										</div>
										<span class="fx" id="importFileRemove" title="Remove file"><i
											class="fas fa-times"></i></span>
									</div>

									<input type="file" id="importFile" accept=".xlsx,.xlsm,.xls"
										style="display: none;">

									<div id="importPreview" class="mt-3"></div>

									<!-- Step 2 -->
									<p class="import-step-title mt-4">
										<span>2</span>If the mark already exists in this contract
									</p>
									<div class="row">
										<div class="col-md-6 mb-2">
											<label class="import-option"> <input type="radio"
												name="importMode" value="skip" checked>
												<div class="import-option-box">
													<i class="fas fa-forward"></i>
													<div>
														<b>Skip</b><small>Keep the existing part as it is.
															Only new marks are added.</small>
													</div>
												</div>
											</label>
										</div>
										<div class="col-md-6 mb-2">
											<label class="import-option"> <input type="radio"
												name="importMode" value="override">
												<div class="import-option-box">
													<i class="fas fa-sync-alt"></i>
													<div>
														<b>Override</b><small>Update the name of the
															existing part with the Excel value.</small>
													</div>
												</div>
											</label>
										</div>
										<label class="d-flex align-items-start mt-2 mb-2"
											style="cursor: pointer;"> <input type="checkbox"
											id="importUnlock" class="mt-1 mr-2"> <span><b>Also
													unlock locked parts</b><br> <small class="text-muted">If
													an existing mark is locked, unlock it and mark it as a
													revision, so the Checker can enter a new record. Parts that
													are not locked are not affected.</small></span>
										</label>
										<div id="importUnlockOptions" style="display:none;" class="ml-4 mb-2">
    <label class="mr-3"><input type="radio" name="importCorrection" value="INTERNAL"> Internal correction</label>
    <label><input type="radio" name="importCorrection" value="EXTERNAL"> External correction</label>
    <div id="importEcnWrap" style="display:none;" class="mt-2">
        <input type="text" id="importEcnNo" class="form-control form-control-sm" style="max-width:260px;"
               maxlength="50" placeholder="ECN No (required)">
    </div>
</div>
									</div>
									<small class="text-muted">Deleted parts are ignored. <b>1C24(?)</b>
										is treated the same as <b>1C24</b>.
									</small>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-primary btn-sm"
										id="importRunBtn" disabled>
										<i class="fas fa-file-import"></i> Import
									</button>
								</div>
							</div>
						</div>
					</div>
					<!-- Confirmation Modal -->
					<div class="modal fade" id="confirmPartEntry" tabindex="-1"
						role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to Create?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmPartEntryYes">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Unlock -->
					<div class="modal fade" id="confirmUnlockModal" tabindex="-1"
						role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b id="confirmUnlockText">Are you sure you want to unlock
										this part mark?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmUnlockYes">YES</button>
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
	<script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>

	<script
		src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

	<script
		src="js/ContPartMark.js?v=<%=ver(application, "/js/ContPartMark.js")%>"></script>
	<script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
	<script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
	<script
		src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
	<script
		src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
	<script
		src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
</body>
</html>
