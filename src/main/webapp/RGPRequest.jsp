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
<link href="img/logo/download.png" rel="icon">
<title>JSSL</title>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="css/ruang-admin.min.css" rel="stylesheet">
<link rel="stylesheet" href="css/main.css">
<link href="css/masterpage.css" rel="stylesheet">
<link
	href="externalLibrary/cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
	rel="stylesheet">
<link
	href="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
	rel="stylesheet">
<script
	src="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>

<script>
	const user_id = sessionStorage.getItem('user_id');
	if (!user_id) {
		window.location.href = "newlogin.jsp";
	}
</script>
<link
	href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
	rel="stylesheet">
<!-- <link href="externalLibrary/cdn.jsdelivr.net/npm/select2-bootstrap-4-theme@1.0.0/dist/select2-bootstrap4.min.css" rel="stylesheet"> -->
<link
	href="externalLibrary/cdn.jsdelivr.net/npm/@ttskch/select2-bootstrap4-theme@1.5.2/dist/select2-bootstrap4.min.css"
	rel="stylesheet">
<style>
/* keep select2 boxes aligned with form-control-sm height */
.select2-container .select2-selection--single {
	height: calc(1.5em + .5rem + 2px) !important;
	padding: .25rem .5rem;
}

.select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered
	{
	line-height: 1.5 !important;
}

.select2-container--bootstrap4 .select2-selection--single .select2-selection__arrow
	{
	height: calc(1.5em + .5rem) !important;
}
</style>

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
	right: 20px;
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

.modal-header1 {
	background-color: #007bff;
	color: black;
	border-bottom: 1px solid #dee2e6;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 20px;
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

.btn-primary {
	background-color: #007bff;
	border-color: #007bff;
}

.btn-primary:hover {
	background-color: #0056b3;
	border-color: #0056b3;
}

div.dt-buttons>.dt-button:first-child {
	margin-left: 0;
	background-color: #336699 !important;
	color: white;
	padding: 4px 10px;
}
</style>
</head>

<body>
	<div id="wrapper">
		<%@ include file="GPMSSidebar.jsp"%>

		<div id="content-wrapper" class="d-flex flex-column">
			<div id="content">

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
							class="nav-link dropdown-toggle" href="#" id="userDropdown"
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

				<div class="container-fluid" id="container-wrapper">
					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800">RGP Request</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="GPMSDashboard.jsp">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page">RGP
								Request</li>
						</ol>
					</div>

					<div class="row mb-3">
						<div class="col-lg-12">
							<div class="card mb-4">
								<div
									style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
									<div
										class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
										style="background-color: #f8f9fc;">
										<button id="rgpcreate">
											<i class="fas fa-plus"></i> Create
										</button>
									</div>
								</div>
								<div class="table-responsive p-3">
									<table class="table table-striped table-bordered table-sm"
										id="tableID2" width="100%">
										<thead>
											<tr>
												<th>Sl.No</th>
												<th>PR No</th>
												<th>Sent to Vendor/Employee</th>

												<th>Exp Date</th>

												<th>Edit</th>
												<th>Verify</th>
												<th>Cancel</th>
											</tr>
										</thead>
										<tbody></tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ═══════════════════════════════════════════════════════════
       CREATE MODAL
  ════════════════════════════════════════════════════════════════ -->
	<div class="modal fade" id="exampleModalScrollable123" tabindex="-1"
		role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-scrollable"
			style="max-width: 1200px; padding-bottom: 10px;" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Returnable Request</h5>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>

				<div class="modal-body">
					<div class="container" style="font-size: 15px;">

						<div class="row mb-3">
							<div class="col-md-6">
								<label class="form-label">PR NO:</label> <input type="text"
									class="form-control form-control-sm" id="rgpcode" readonly>
							</div>
							<div class="col-md-6">
								<label class="form-label">Select Vendor/Employee:</label> <select
									class="form-control form-control-sm" id="selectvendor">
									<option value="">Select</option>
									<option value="1">Vendor</option>
									<option value="2">Employee</option>
								</select>
								<div id="selectvendorError" class="error-message">Vendor/Employee
									is required</div>
							</div>
						</div>

						<div class="row mb-3">
							<div class="col-md-6">
								<label class="form-label">Sent to Vendor:</label> <select
									disabled class="form-control form-control-sm" id="tovendor"></select>
								<div id="tovendorError" class="error-message">Sent to
									Vendor is required</div>
							</div>
							<div class="col-md-6">
								<label class="form-label">Sent to Employee:</label> <select
									disabled class="form-control form-control-sm" id="employee"></select>
								<div id="employeeError" class="error-message">Sent to
									Employee is required</div>
							</div>
						</div>

						<div class="row mb-3">
							<div class="col-md-4">
								<label class="form-label"> Location:</label> <select disabled
									class="form-control form-control-sm" id="empaddress"></select>
								<div id="empaddressError" class="error-message">Employee
									Location is required</div>
							</div>

							<div class="col-md-4">
								<label class="form-label">Contract:</label> <select
									class="form-control form-control-sm" id="contractno"></select>
								<div id="contractnoError" class="error-message">Contract
									is required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label"> Address:</label> <input type="text"
									class="form-control form-control-sm" id="employeeaddress"
									placeholder="address" readonly>
								<div id="employeeaddressError" class="error-message">Employee
									Address is required</div>
							</div>





						</div>

						<div class="row mb-3">
							<div class="col-md-4">
								<label class="form-label">Expected Return Date:</label> <input
									type="date" class="form-control form-control-sm"
									id="returndatee">
								<div id="returndateeError" class="error-message">Please
									select a valid return date</div>
							</div>
							<div class="col-md-4">
								<label class="form-label">Reason for dispatch:</label> <input
									type="text" class="form-control form-control-sm"
									id="reasondispatch" placeholder="Reason for dispatch">

								<div id="reasondispatchError" class="error-message">
									Reason For dispatch is Required</div>
							</div>

							<div class="col-md-4">
								<label class="form-label">Remarks:</label> <input type="text"
									class="form-control form-control-sm" id="remarks5"
									placeholder="Remarks">
							</div>
						</div>

						<!-- Line Items Table -->
						<div class="row mb-3">
							<div class="col-md-12">
								<label class="form-label">Enter Line Item:</label>
								<table class="table table-striped table-bordered table-sm"
									id="TableID">
									<thead>
										<tr>
											<th>Sl.No</th>
											<th>Item No</th>
											<th>Uom</th>
											<th>Description</th>

											<th>Qty</th>
											<th>Price</th>
											<th>Remarks</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										<tr id="row1">
											<td>1</td>
											<td><select class="form-control form-control-sm"
												id="itemno1" onchange="getitemdetails(1)">
											</select></td>
											<td><input type="text"
												class="form-control form-control-sm" id="unit1" readonly></td>
											<td><input type="text"
												class="form-control form-control-sm" id="description11"
												readonly></td>
											<td><input type="text"
												class="form-control form-control-sm" id="quantity1"
												onkeydown="return allowOnlyPositive(event)"></td>
											<td><input type="text"
												class="form-control form-control-sm" id="price1"
												onkeydown="return allowOnlyPositive(event)"></td>
											<td><input type="text"
												class="form-control form-control-sm" id="remarks1"></td>
											<td class="text-center"><i
												class="bi bi-trash text-danger"
												style="cursor: pointer; font-size: 16px;"
												onclick="deleteRow(this)" title="Delete"></i></td>
										</tr>
									</tbody>
								</table>
								<button type="button" class="btn btn-sm btn-secondary"
									onclick="addNewRow()">Add New Row</button>
							</div>
						</div>

					</div>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-secondary"
						data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary"
						id="showConfirmationPopup">Create</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Confirm Create -->
	<div class="modal fade" id="exampleModalCenter66" tabindex="-1"
		role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
				<div class="modal-header1"></div>
				<div class="modal-body">
					<b>Are you sure you want to create?</b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">NO</button>
					<button type="button" class="btn btn-info btn-sm"
						id="confirmSubmission">YES</button>
				</div>
			</div>
		</div>
	</div>

	<!-- ═══════════════════════════════════════════════════════════
       UPDATE MODAL
  ════════════════════════════════════════════════════════════════ -->
	<!-- ═══════════════════════════════════════════════════════════
     UPDATE MODAL
════════════════════════════════════════════════════════════════ -->
	<div class="modal fade" id="exampleModalScrollable12" tabindex="-1"
		role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-scrollable"
			style="max-width: 1200px; padding-bottom: 10px;" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Update Returnable Request</h5>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>

				<div class="modal-body">
					<input type="hidden" id="updateModal_RequestId" value="">

					<div class="container" style="font-size: 15px;">

						<!-- Row 1: PR No + Vendor/Employee toggle -->
						<div class="row mb-3">
							<div class="col-md-6">
								<label class="form-label">PR NO:</label> <input type="text"
									class="form-control form-control-sm" id="rgpcodeup" readonly>
							</div>
							<div class="col-md-6">
								<label class="form-label">Select Vendor/Employee:</label> <select
									class="form-control form-control-sm" id="selectvendorup">
									<option value="">Select</option>
									<option value="1">Vendor</option>
									<option value="2">Employee</option>
								</select>
								<div id="selectvendorErrorup" class="error-message">Vendor/Employee
									is required</div>
							</div>
						</div>

						<!-- Row 2: Sent to Vendor + Sent to Employee -->
						<div class="row mb-3">
							<div class="col-md-6">
								<label class="form-label">Sent to Vendor:</label> <select
									disabled class="form-control form-control-sm" id="tovendorup"></select>
								<div id="tovendorErrorup" class="error-message">Sent to
									Vendor is required</div>
							</div>
							<div class="col-md-6">
								<label class="form-label">Sent to Employee:</label> <select
									disabled class="form-control form-control-sm" id="employeeup"></select>
								<div id="employeeErrorup" class="error-message">Sent to
									Employee is required</div>
							</div>
						</div>

						<!-- Row 3: Employee Location + Employee Address + Return Date -->
						<div class="row mb-3">
							<div class="col-md-4">
								<label class="form-label"> Location:</label> <select disabled
									class="form-control form-control-sm" id="empaddressup"></select>
								<div id="empaddressErrorup" class="error-message">Employee
									Location is required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label">Contract:</label> <select
									class="form-control form-control-sm" id="contractnoup"></select>
								<div id="contractnoErrorup" class="error-message">Contract
									is required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label"> Address:</label> <input type="text"
									class="form-control form-control-sm" id="employeeaddressup"
									placeholder="address" readonly>
								<div id="employeeaddressErrorup" class="error-message">Employee
									Address is required</div>
							</div>

						</div>

						<!-- Row 4: Contract + Remarks -->
						<div class="row mb-3">


							<div class="col-md-4">
								<label class="form-label">Expected Return Date:</label> <input
									type="date" class="form-control form-control-sm"
									id="returndateup">

								<div id="returndateErrorup" class="error-message">Return
									date is required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label">Reason for dispatch:</label> <input
									type="text" class="form-control form-control-sm"
									id="reasondispatchup" placeholder="Reason for dispatch">

								<div id="reasondispatchupError" class="error-message">Reason
									for dispatch is required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label">Remarks:</label> <input type="text"
									class="form-control form-control-sm" id="remarks5up"
									placeholder="Remarks">
							</div>
						</div>

						<!-- Line Items Table -->
						<div class="row mb-3">
							<div class="col-md-12">
								<label class="form-label">Enter Line Item:</label>
								<table class="table table-striped table-bordered table-sm"
									id="updateTableID">
									<thead>
										<tr>
											<th>Sl.No</th>
											<th>Item No</th>
											<th>Uom</th>
											<th>Description</th>

											<th>Qty</th>
											<th>Price</th>
											<th>Remarks</th>
											<th>Vendor</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										<tr id="uprow1">
											<td>1</td>
											<td><select class="form-control form-control-sm"
												id="upitemno1" onchange="getUpdateItemDetails(1)"></select>
											</td>
											<td><input type="text"
												class="form-control form-control-sm" id="upunit1" readonly></td>
											<td><input type="text"
												class="form-control form-control-sm" id="updescription11"
												readonly></td>
											<td><input type="text"
												class="form-control form-control-sm" id="upquantity1"
												onkeydown="return allowOnlyPositive(event)"></td>
											<td><input type="text"
												class="form-control form-control-sm" id="upprice1"
												onkeydown="return allowOnlyPositive(event)"></td>
											<td><input type="text"
												class="form-control form-control-sm" id="upremarks1"></td>
											<td class="text-center"><i
												class="bi bi-trash text-danger"
												style="cursor: pointer; font-size: 16px;"
												onclick="deleteRow3(this)" title="Delete"></i></td>
										</tr>
									</tbody>
								</table>
								<button type="button" class="btn btn-sm btn-secondary" id="addnewrow3"
									onclick="addNewRow3()">Add New Row</button>
							</div>
						</div>

					</div>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-secondary"
						data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary" id="updateButton">Update</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Confirm Update -->
	<div class="modal fade" id="exampleModalCenter61" tabindex="-1"
		role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
				<div class="modal-header1"></div>
				<div class="modal-body">
					<b>Are you sure you want to Update?</b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">NO</button>
					<button type="button" class="btn btn-info btn-sm"
						id="confirmupdYes">YES</button>
				</div>
			</div>
		</div>
	</div>

	<!-- ═══════════════════════════════════════════════════════════
       VERIFY MODAL
  ════════════════════════════════════════════════════════════════ -->
	<div class="modal fade" id="exampleModalScrollableVerify" tabindex="-1"
		role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-scrollable"
			style="max-width: 1200px; padding-bottom: 10px;" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Verify Returnable Request</h5>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>

				<div class="modal-body">
					<input type="hidden" id="verifyModal_RequestId" value="">

					<div class="container" style="font-size: 15px;">

						<!-- Row 1: PR No + Verify Type -->
						<div class="row mb-3">
							<div class="col-md-6">
								<label class="form-label">PR NO:</label> <input type="text"
									class="form-control form-control-sm" id="rgpcodeverify"
									readonly>
							</div>
		
							
								<div class="col-md-6">
								<label class="form-label">Select Vendor/Employee:</label> <select
									class="form-control form-control-sm" id="selectvendorver">
									<option value="">Select</option>
									<option value="1">Vendor</option>
									<option value="2">Employee</option>
								</select>
								<div id="selectvendorErrorver" class="error-message">Vendor/Employee
									is required</div>
							</div>
						</div>

						<!-- Row 2: Sent to Vendor + Sent to Employee (readonly) -->
						<div class="row mb-3">
							<div class="col-md-6">
								<label class="form-label">Sent to Vendor:</label> <select
									disabled class="form-control form-control-sm"
									id="tovendorverify"></select>
									 <div id="tovendorverifyError" class="error-message">Vendor is required</div>
							</div>
							<div class="col-md-6">
								<label class="form-label">Sent to Employee:</label> <select
									disabled class="form-control form-control-sm"
									id="employeeverify"></select>
							</div>
						</div>

						<!-- Row 3: Location + Contract + Address (readonly) -->
						<div class="row mb-3">
							<div class="col-md-4">
								<label class="form-label"> Location:</label> <select disabled
									class="form-control form-control-sm" id="empaddressverify"></select>
							</div>
							<div class="col-md-4">
								<label class="form-label">Contract:</label> <select disabled
									class="form-control form-control-sm" id="contractnoverify"></select>
							</div>
							<div class="col-md-4">
								<label class="form-label"> Address:</label> <input type="text"
									class="form-control form-control-sm" id="employeeaddressverify"
									readonly>
							</div>
						</div>

						<!-- Row 4: Return Date + Reason + Remarks (readonly) -->
						<div class="row mb-3">
							<div class="col-md-4">
								<label class="form-label">Expected Return Date:</label> <input
									type="date" class="form-control form-control-sm"
									id="returndateverify" readonly>
							</div>
							<div class="col-md-4">
								<label class="form-label">Reason for dispatch:</label> <input
									type="text" class="form-control form-control-sm"
									id="reasondispatchverify" readonly>
							</div>
							<div class="col-md-4">
								<label class="form-label">Remarks:</label> <input type="text"
									class="form-control form-control-sm" id="remarks5verify"
									readonly>
							</div>
						</div>

						<!-- Line Items Table -->
						<div class="row mb-3">
							<div class="col-md-12">
								<label class="form-label">Line Items:</label>
								<table class="table table-striped table-bordered table-sm"
									id="verifyTableID">
									<thead>
										<tr id="verifyTableHeaderRow">
											<th>Sl.No</th>
											<th>Item No</th>
											<th>Uom</th>
											<th>Description</th>
											<th>Qty</th>
											<th>Price</th>
											<th>Remarks</th>
											<th>Vendor</th>
											<th>Verify</th>
										</tr>
									</thead>
									<tbody></tbody>
								</table>
								<small class="text-muted">Vendor defaults to the header
									vendor for unverified lines — tick a row to lock in its vendor.</small>
							</div>
						</div>

					</div>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-secondary"
						data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary"
						id="submitVerifyButton">Submit Verification</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Confirm Verify -->
	<div class="modal fade" id="exampleModalCenterVerifyConfirm" tabindex="-1"
		role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
				<div class="modal-header1"></div>
				<div class="modal-body">
					<b>Are you sure you want to submit this verification?</b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">NO</button>
					<button type="button" class="btn btn-info btn-sm"
						id="confirmVerifyYes">YES</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="messageModal" tabindex="-1" role="dialog"
		aria-labelledby="messageTitle" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">

			<div class="modal-content"
				style="width: 70%; margin: auto; border-width: thick; border-color: #eaecf4;">

				<!-- Optional empty header (for spacing like your design) -->
				<div class="modal-header1"></div>

				<!-- Body -->
				<div class="modal-body text-center">
					<b id="modalMessage">Message here</b>
				</div>

				<!-- Footer -->
				<div class="modal-footer d-flex justify-content-center border-0">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal" id="removeadharduplicate">OK</button>
				</div>

			</div>

		</div>
	</div>

	<!-- Confirm Cancel -->
	<div class="modal fade" id="exampleModalCenter69" tabindex="-1"
		role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
				<div class="modal-header1"></div>
				<div class="modal-body">
					<b>Are you sure you want to Cancel?</b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">NO</button>
					<button type="button" class="btn btn-info btn-sm"
						id="confirmcancel">YES</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="cancelRgpModal" tabindex="-1" role="dialog"
		aria-labelledby="cancelRgpModalTitle" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
				<div class="modal-header1"></div>
				<div class="modal-body">
					<b>Are you sure you want to Cancel this RGP Request?</b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">NO</button>
					<button type="button" class="btn btn-info btn-sm"
						id="confirmCancelRgp">YES</button>
				</div>
			</div>
		</div>
	</div>
	
	
	
	

	
	
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
	<script src="js/logout.js?v=<%=jsVersion%>"></script>
	<script src="js/rgprequest.js?v=<%=jsVersion%>"></script>
	<script
		src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

	<script src="js/username.js?v=<%=jsVersion%>"></script>
	<script src="js/createdby.js?v=<%=jsVersion%>"></script>
	<script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
	<script src="js/Sessionfilter.js?v=<%=jsVersion%>"></script>
	<script src="js/permissions.js?v=<%=jsVersion%>"></script>

	<script>
    window.actionElementMap = {};
  </script>

</body>
</html>
