<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  response.setHeader("Pragma", "no-cache");
  response.setDateHeader("Expires", 0);
%>
<%long ts = System.currentTimeMillis();%>
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

<link
	href="externalLibrary/cdn.jsdelivr.net/npm/@ttskch/select2-bootstrap4-theme@1.5.2/dist/select2-bootstrap4.min.css"
	rel="stylesheet">
<style>
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
						<h1 class="h3 mb-0 text-gray-800">NGPB Request</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="GPMSDashboard.jsp">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page">NGPB
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
										<button id="ngpbcreate">
											<i class="fas fa-plus"></i> Create
										</button>
									</div>
								</div>
								<div class="table-responsive p-3">
									<table class="table table-striped table-bordered table-sm"
										id="ngpbTable" width="100%">
										<thead>
                                         <tr>
                                           <th>Sl.No</th>
                                           <th>Gate Pass No</th>
                                           <th>Sent to Vendor/Employee</th>
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
	<div class="modal fade" id="ngpbCreateModal" tabindex="-1"
		role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-scrollable"
			style="max-width: 1200px; padding-bottom: 10px;" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Non-Returnable Request</h5>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>

				<div class="modal-body">
					<div class="container" style="font-size: 15px;">

						<div class="row mb-3">
							<div class="col-md-4">
								<label class="form-label">PR NO:</label> <input type="text"
									class="form-control form-control-sm" id="ngpbcode" readonly>
							</div>
							<div class="col-md-4">
								<label class="form-label">Select Vendor/Employee:</label> <select
									class="form-control form-control-sm" id="ngpbselectvendor">
									<option value="">Select</option>
									<option value="1">Vendor</option>
									<option value="2">Employee</option>
								</select>
								<div id="ngpbselectvendorError" class="error-message">Vendor/Employee
									is required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label">Sent to Vendor:</label> <select
									disabled class="form-control form-control-sm" id="ngpbtovendor"></select>
								<div id="ngpbtovendorError" class="error-message">Sent to
									Vendor is required</div>
							</div>
						</div>

						

						<div class="row mb-4">
						<div class="col-md-4">
								<label class="form-label">Sent to Employee:</label> <select
									disabled class="form-control form-control-sm" id="ngpbemployee"></select>
								<div id="ngpbemployeeError" class="error-message">Sent to
									Employee is required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label">Location:</label> <select disabled
									class="form-control form-control-sm" id="ngpbempaddress"></select>
								<div id="ngpbempaddressError" class="error-message">Employee
									Location is required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label">Contract:</label> <select
									class="form-control form-control-sm" id="ngpbcontractno"></select>
								<div id="ngpbcontractnoError" class="error-message">Contract
									is required</div>
							</div>
							
						</div>

						<div class="row mb-3">
						<div class="col-md-4">
								<label class="form-label">Address:</label> <input type="text"
									class="form-control form-control-sm" id="ngpbemployeeaddress"
									placeholder="address" readonly>
								<div id="ngpbemployeeaddressError" class="error-message">Employee
									Address is required</div>
							</div>
							
							<div class="col-md-4">
								<label class="form-label">Reason for dispatch:</label> <input
									type="text" class="form-control form-control-sm"
									id="ngpbreasondispatch" placeholder="Reason for dispatch">
									<div id="ngpbreasondispatchError" class="error-message">Reason for dispatch is Required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label">Remarks:</label> <input type="text"
									class="form-control form-control-sm" id="ngpbremarks5"
									placeholder="Remarks">
							</div>
						</div>

						<!-- Line Items Table -->
						<div class="row mb-3">
							<div class="col-md-12">
								<label class="form-label">Enter Line Item:</label>
								<table class="table table-striped table-bordered table-sm"
									id="ngpbTableCreate">
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
										<tr id="ngpbrow1">
											<td>1</td>
											<td><select class="form-control form-control-sm"
												id="ngpbitemno1" onchange="ngpbGetItemDetails(1)"></select>
											</td>
											<td><input type="text"
												class="form-control form-control-sm" id="ngpbunit1" readonly></td>
											<td><input type="text"
												class="form-control form-control-sm" id="ngpbdesc11"
												readonly></td>
											<td><input type="text"
												class="form-control form-control-sm" id="ngpbqty1"
												onkeydown="return allowOnlyPositive(event)"></td>
											<td><input type="text"
												class="form-control form-control-sm" id="ngpbprice1"
												onkeydown="return allowOnlyPositive(event)"></td>
											<td><input type="text"
												class="form-control form-control-sm" id="ngpbremarks1"></td>
											<td class="text-center"><i
												class="bi bi-trash text-danger"
												style="cursor: pointer; font-size: 16px;"
												onclick="ngpbDeleteRow(this)" title="Delete"></i></td>
										</tr>
									</tbody>
								</table>
								<button type="button" class="btn btn-sm btn-secondary"
									onclick="ngpbAddNewRow()">Add New Row</button>
							</div>
						</div>

					</div>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-secondary"
						data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary" id="ngpbShowConfirm">Create</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Confirm Create -->
	<div class="modal fade" id="ngpbConfirmCreate" tabindex="-1"
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
						id="ngpbConfirmYes">YES</button>
				</div>
			</div>
		</div>
	</div>

	<!-- ═══════════════════════════════════════════════════════════
       UPDATE MODAL
  ════════════════════════════════════════════════════════════════ -->
	<div class="modal fade" id="ngpbUpdateModal" tabindex="-1"
		role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-scrollable"
			style="max-width: 1200px; padding-bottom: 10px;" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Update Non-Returnable Request</h5>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>

				<div class="modal-body">
					<input type="hidden" id="ngpbUpdateId" value="">

					<div class="container" style="font-size: 15px;">

						<!-- Row 1: Gate Pass No + Vendor/Employee toggle -->
						<div class="row mb-3">
							<div class="col-md-4">
								<label class="form-label">PR No:</label> <input type="text"
									class="form-control form-control-sm" id="ngpbcodeup" readonly>
							</div>
							<div class="col-md-4">
								<label class="form-label">Select Vendor/Employee:</label> <select
									class="form-control form-control-sm" id="ngpbselectvendorup">
									<option value="">Select</option>
									<option value="1">Vendor</option>
									<option value="2">Employee</option>
								</select>
								<div id="ngpbselectvendorErrorup" class="error-message">Vendor/Employee
									is required</div>
							</div>
								<div class="col-md-4">
								<label class="form-label">Sent to Vendor:</label> <select
									disabled class="form-control form-control-sm"
									id="ngpbtovendorup"></select>
								<div id="ngpbtovendorErrorup" class="error-message">Sent
									to Vendor is required</div>
							</div>
						</div>

						<!-- Row 2: Sent to Vendor + Sent to Employee -->
						<div class="row mb-3">
						
							<div class="col-md-4">
								<label class="form-label">Sent to Employee:</label> <select
									disabled class="form-control form-control-sm"
									id="ngpbemployeeup"></select>
								<div id="ngpbemployeeErrorup" class="error-message">Sent
									to Employee is required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label">Location:</label> <select disabled
									class="form-control form-control-sm" id="ngpbempaddressup"></select>
								<div id="ngpbempaddressErrorup" class="error-message">Employee
									Location is required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label">Contract:</label> <select
									class="form-control form-control-sm" id="ngpbcontractnoup"></select>
								<div id="ngpbcontractnoErrorup" class="error-message">Contract
									is required</div>
							</div>
						</div>

					

						<div class="row mb-3">
								<div class="col-md-4">
								<label class="form-label">Address:</label> <input type="text"
									class="form-control form-control-sm" id="ngpbemployeeaddressup"
									placeholder="address" readonly>
								<div id="ngpbemployeeaddressErrorup" class="error-message">Employee
									Address is required</div>
							</div>
							<div class="col-md-4" hidden>
								<label class="form-label">Expected Return Date:</label> <input
									type="date" class="form-control form-control-sm"
									id="ngpbreturndateup">
								<div id="ngpbreturndateErrorup" class="error-message">Return
									date is required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label">Reason for dispatch:</label> <input
									type="text" class="form-control form-control-sm"
									id="ngpbreasondispatchup" placeholder="Reason for dispatch">
										<div id="ngpbreasondispatchupError" class="error-message">Reason For dispatch 
									 is required</div>
							</div>
							<div class="col-md-4">
								<label class="form-label">Remarks:</label> <input type="text"
									class="form-control form-control-sm" id="ngpbremarks5up"
									placeholder="Remarks">
							</div>
						</div>

						<!-- Line Items Table -->
						<div class="row mb-3">
							<div class="col-md-12">
								<label class="form-label">Enter Line Item:</label>
								<table class="table table-striped table-bordered table-sm"
									id="ngpbTableUpdate">
									<thead>
    <tr>
        <th>Sl.No</th>
        <th>Item No</th>
        <th>Uom</th>
        <th>Description</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Remarks</th>
        <th id="ngpbUpVendorColHeader">Vendor</th>
        <th>Action</th>
    </tr>
</thead>
<tbody>
    <tr id="ngpbuprow1">
        <td>1</td>
        <td><select class="form-control form-control-sm" id="ngpbupitemno1" onchange="ngpbGetUpdateItemDetails(1)"></select></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbupunit1" readonly></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbupdesc11" readonly></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbupqty1" onkeydown="return allowOnlyPositive(event)"></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbupprice1" onkeydown="return allowOnlyPositive(event)"></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbupremarks1"></td>
        <td style="display:none;"><input type="text" class="form-control form-control-sm" id="ngpbupvendor1" value="" readonly></td>
        <td class="text-center">
            <i class="bi bi-trash text-danger" style="cursor:pointer;font-size:16px;" onclick="ngpbDeleteUpdateRow(this)" title="Delete"></i>
        </td>
    </tr>
</tbody>
								</table>
								<button type="button" class="btn btn-sm btn-secondary"
									onclick="ngpbAddNewUpdateRow()">Add New Row</button>
							</div>
						</div>

					</div>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-secondary"
						data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary" id="ngpbUpdateButton">Update</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- ═══════════════════════════════════════════════════════════
     VERIFY MODAL (NGPB)
════════════════════════════════════════════════════════════════ -->
<div class="modal fade" id="ngpbVerifyModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1200px; padding-bottom: 10px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Verify Non-Returnable Request</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <input type="hidden" id="ngpbVerify_RequestId" value="">

                <div class="container" style="font-size: 15px;">

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">PR NO:</label>
                            <input type="text" class="form-control form-control-sm" id="ngpbcodeverify" readonly>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Select Vendor/Employee:</label>
                            <select class="form-control form-control-sm" id="ngpbselectvendorver">
                                <option value="">Select</option>
                                <option value="1">Vendor</option>
                                <option value="2">Employee</option>
                            </select>
                            <div id="ngpbselectvendorErrorver" class="error-message">Vendor/Employee is required</div>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Sent to Vendor:</label>
                            <select disabled class="form-control form-control-sm" id="ngpbtovendorverify"></select>
                            <div id="ngpbtovendorverifyError" class="error-message">Vendor is required</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Sent to Employee:</label>
                            <select disabled class="form-control form-control-sm" id="ngpbemployeeverify"></select>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label class="form-label">Location:</label>
                            <select disabled class="form-control form-control-sm" id="ngpbempaddressverify"></select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Contract:</label>
                            <select disabled class="form-control form-control-sm" id="ngpbcontractnoverify"></select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Address:</label>
                            <input type="text" class="form-control form-control-sm" id="ngpbemployeeaddressverify" readonly>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Reason for dispatch:</label>
                            <input type="text" class="form-control form-control-sm" id="ngpbreasondispatchverify" readonly>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Remarks:</label>
                            <input type="text" class="form-control form-control-sm" id="ngpbremarks5verify" readonly>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-12">
                            <label class="form-label">Line Items:</label>
                            <table class="table table-striped table-bordered table-sm" id="ngpbVerifyTableID">
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
                                        <th>Verify</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                            <small class="text-muted">Vendor defaults to the header vendor for
                                unverified lines — tick a row to lock in its vendor.</small>
                        </div>
                    </div>

                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="ngpbSubmitVerifyButton">Submit Verification</button>
            </div>
        </div>
    </div>
</div>

<!-- Confirm Verify -->
<div class="modal fade" id="ngpbVerifyConfirm" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content" style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
            <div class="modal-header1"></div>
            <div class="modal-body">
                <b>Are you sure you want to submit this verification?</b>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button>
                <button type="button" class="btn btn-info btn-sm" id="ngpbConfirmVerifyYes">YES</button>
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

	<!-- Confirm Update -->
	<div class="modal fade" id="ngpbConfirmUpdate" tabindex="-1"
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
						id="ngpbConfirmUpdateYes">YES</button>
				</div>
			</div>
		</div>
	</div>
	
<div class="modal fade" id="cancelNgpbModal" tabindex="-1" role="dialog" aria-labelledby="cancelNgpbModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content" style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
            <div class="modal-header1"></div>
            <div class="modal-body">
                <b>Are you sure you want to Cancel this NRGPB Request?</b>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button>
                <button type="button" class="btn btn-info btn-sm" id="confirmCancelNgpb">YES</button>
            </div>
        </div>
    </div>
</div>

	<!-- ═══════════════════════════════════════════════════════════
       SCRIPTS  — order matters: config → jQuery → plugins → app
  ════════════════════════════════════════════════════════════════ -->
	
	<script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>

	<script src="vendor/datatables/jquery.dataTables.min.js"></script>
	<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
	<script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
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
	<script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
	<script src="js/nrgprequest.js?v=<%=ver(application, "/js/nrgprequest.js")%>"></script>
	<script
		src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
	<script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
	<script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
	<script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
	<script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
	<script src="js/permissions.js?v=<%=ver(application, "/js/permissions.js")%>"></script>

	<script>
    window.actionElementMap = {};
  </script>

</body>
</html>
