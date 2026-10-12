<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
response.setHeader("Pragma", "no-cache"); // HTTP 1.0
response.setDateHeader("Expires", 0); // Proxies
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
<!--   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-xxx" crossorigin="anonymous" /> -->
<link href="css/masterpage.css" rel="stylesheet">
<link
	href="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css"
	rel="stylesheet" />
<script
	src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>

<!-- Include Bootstrap CSS -->
<link
	href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
	rel="stylesheet">

<!-- Include jQuery -->
<!-- <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> -->

<!-- Include Bootstrap JS -->
<script
	src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>

<script>
	
</script>
<style>
.error-message {
	color: red;
	font-size: 12px;
	margin-top: 5px;
	display: none; /* Hidden by default */
}

.popup {
	position: fixed;
	top: 20px;
	right: -3%;
	transform: translateX(-50%);
	background-color: #4CAF50; /* Green */
	color: white;
	padding: 16px;
	border-radius: 5px;
	z-index: 9999;
}

/* Add some basic styling to the button */
button {
	padding: 5px 15px;
	font-size: 13px;
	background-color: #4CAF50; /* Green background color */
	color: white; /* White text color */
	border: none; /* Remove border */
	border-radius: 5px; /* Optional: Rounded corners */
	cursor: pointer;
}

/* Change button color on hover */
button:hover {
	background-color: #45a049; /* Darker green */
}

button.close {
	padding: 0;
	background-color: transparent;
	border: 0;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
}

/* Add custom styles for the modal */
.modal-content {
	border-radius: 10px;
}

/* Add custom styles for the modal header */
.modal-header {
	/* background-color: #007bff;  */ /* Primary color */
	color: black; /* Text color */
	border-bottom: 1px solid #dee2e6;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 45px; /* Adjust the height as needed */
}

.modal-header1 {
	background-color: #007bff; /* Primary color */
	color: black; /* Text color */
	border-bottom: 1px solid #dee2e6;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 20px; /* Adjust the height as needed */
}

.modal-title {
	line-height: 20px; /* Center the text vertically within the header */
}

.modal-body {
	padding: 20px;
}

.modal-footer {
	border-top: 1px solid #dee2e6;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
}

/* Style the buttons */
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

.white-button {
	background-color: white;
	color: black;
}

.increased-height {
	height: 100px; /* Adjust the height value as needed */
}

.input-group-prepend .input-group-text {
	font-size: 12px;
	color: black;
}

.input-group-append .input-group-text {
	font-size: 12px;
	color: black;
}

.input-group-prepend span {
	color: black;
	background-color: #dcdce6;
	border-color: #dcdce6;
}

.input-group-append span {
	color: black;
	background-color: #dcdce6;
	border-color: #dcdce6;
}

.popup {
	position: fixed;
	top: 20px;
	right: -3%;
	transform: translateX(-50%);
	background-color: #4CAF50; /* Green */
	color: white;
	padding: 16px;
	border-radius: 5px;
	z-index: 9999;
}

.nav-tabs .nav-link {
	color: black !important;
	background: white !important;
	font-weight: 500;
	border: 1px solid #d0d0d0 !important;
	padding: 6px 12px;
	margin-right: 8px; /* GAP BETWEEN TABS */
	margin-bottom: 6px; /* GAP BETWEEN ROWS */
	border-radius: 5px !important;
}

/* Hover */
.nav-tabs .nav-link:hover {
	background-color: #e7ecff !important;
}

/* ACTIVE TAB */
.nav-tabs .nav-link.active {
	background-color: #37499A !important; /* BLUE */
	color: white !important;
	border: 1px solid #37499A !important;
}

/* Removes blue focus outline */
.nav-tabs .nav-link:focus {
	box-shadow: none !important;
	outline: none !important;
}

/* ROW GAP BETWEEN ROW 1 & ROW 2 */
#mainTabsRow2 {
	margin-top: 10px;
}

.container-report {
	border: 2px solid #37499A; /* Blue border */
	padding: 20px;
	border-radius: 8px;
	background: white;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
<style>
#videoElement, #capturedImage {
	width: 300px;
	height: 225px;
	border: 2px solid #ccc;
	margin-bottom: 10px;
}

#TableID {
	width: 100% !important;
}

/* Increase column width */
#TableID th, #TableID td {
	min-width: 180px !important;
	white-space: nowrap;
	text-align: center;
}

/* Expand table container */
.table-responsive {
	width: 100% !important;
	overflow-x: auto;
}

/* Improve header visibility */
#TableID thead th {
	background: #f1f1f1 !important;
	font-weight: bold;
}
</style>

<style>
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

/* Sticky header for scrolling */
thead th {
	position: sticky;
	top: 0;
	background-color: #f8f9fa;
	z-index: 2;
}

/* Make table borders more visible for reports */
table.table-bordered th, table.table-bordered td {
	border: 1px solid #000 !important;
}

/* Set consistent column width */
.table th, .table td {
	min-width: 150px;
	font-size: 13px;
}

.report-header {
	font-weight: bold;
	color: black;
	text-transform: uppercase;
	text-decoration: underline;
	margin-bottom: 40px;
}
</style>
<style>
@media print {
	body {
		-webkit-print-color-adjust: exact !important;
		print-color-adjust: exact !important;
	}
	.btn {
		display: none !important; /* Hide buttons on print */
	}
	.container-report {
		border: none;
		padding: 0;
		box-shadow: none;
	}
	thead th {
		background-color: #f2f2f2 !important;
		color: #000 !important;
		font-weight: bold;
	}
	.table td, .table th {
		font-size: 11px;
		padding: 4px;
	}
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
		<!-- Sidebar -->
		 <%@ include file="InVoiceSideBar.jsp" %>
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
						<h1 class="h3 mb-0 text-gray-800">Audit Invoice Report</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="GPMSDashboard.jsp">Home</a></li>
							<li class="breadcrumb-item"><a href="ItemsDeuReport.jsp">Invoice
									Report</a></li>

						</ol>
					</div>


					<div class="container mt-4">

						<!-- ROW 1 (7 Tabs) -->
						<div class="nav nav-tabs" id="mainTabsRow1" role="tablist">
							<a class="nav-item nav-link active" data-bs-toggle="tab"
								id="createContract">Create Contract</a> <a
								class="nav-item nav-link" data-bs-toggle="tab"
								id="InvoiceMaster">Invoice Master</a> <a
								class="nav-item nav-link" data-bs-toggle="tab"
								id="consigneeHistory">Consignee Master</a> <a
								class="nav-item nav-link" data-bs-toggle="tab" id="bankMaster">Bank
								Master</a> <a class="nav-item nav-link" data-bs-toggle="tab"
								id="taxMaster">Tax Master</a> <a class="nav-item nav-link"
								data-bs-toggle="tab" id="shipmentMode">Shipment Mode</a> <a
								class="nav-item nav-link" data-bs-toggle="tab"
								id="deliveryCondition" hidden="hidden">Delivery Condition</a>
						</div>

						<!-- ROW 2 (7 Tabs) -->
						<div class="nav nav-tabs" id="mainTabsRow2" role="tablist">
							<a class="nav-item nav-link" data-bs-toggle="tab" id="workOrder">Work
								Order</a> <a class="nav-item nav-link" data-bs-toggle="tab"
								id="createGst">Create GST</a> <a class="nav-item nav-link"
								data-bs-toggle="tab" id="invoiceDescription">Invoice
								Description</a> <a class="nav-item nav-link" data-bs-toggle="tab"
								id="qsPackingNotes">QS Packing Notes</a> <a
								class="nav-item nav-link" data-bs-toggle="tab"
								id="advanceInvoice">Advance Invoice</a> <a
								class="nav-item nav-link" data-bs-toggle="tab"
								id="assignMilestone">Assign Milestone</a> 
								<!-- <a class="nav-item nav-link" data-bs-toggle="tab" id="invoiceEntry">Invoice
								Entry</a> -->
						</div>

					</div>







					
    <div id="createContractFilters" style="display:none;" class="mt-3">
    <div class="form-row">
        <div class="form-group col-md-2">
            <label for="factory"><b>Factory:</b></label>
            <select id="factory" class="form-control form-control-sm">
                <option value="">Select factory</option>
            </select>
        </div>
        <div class="form-group col-md-2">
            <label><b>Contract:</b></label>
            <select class="form-control form-control-sm" id="selectContract">
                <option value="">Select Contract</option>
            </select>
        </div>
    </div>
</div>
<div id="container1" style="display: none;">
						<div class="modal-body">
							<form>

								<div class="container container-report mt-4">
									<h5 class="text-center report-header">Create Contract
										History</h5>

									<div class="form-row dynamic-row">
										<div class="table-responsive">
											<table class="table table-bordered table-sm" id="TableID">
												<thead>
													<tr>
														<th>SL.No</th>
														<th>Contract</th>
														<th>Invoice To</th>
														<th>Consignee Name</th>
														<th>registered address</th>
														<th>Shipment Mode</th>
														<th>Delivery Condition</th>
														<th>Work Order No</th>
														<th>Bank Name</th>
														<th>Percent</th>
														<th>Export</th>
														<th>SCode</th>
														<th>HCode</th>
														<th>Bussiness unit</th>
														<th>taxable</th>
														<th>export</th>
														<th>non taxable</th>
														<th>Tax ex/in</th>
														<th>Fright adv recovery</th>
														<th>Created By</th>
														<th>Created Date</th>
													    <th>Modified By</th>
														<th>Modified Date</th>
														<th>deleted_by</th>
														<th>deleted_date</th>
														<th>action</th>
														<th>transaction_date</th>
														<th>Factory</th>
													</tr>
												</thead>
												<tbody>
													<!-- Data will be populated here -->
												</tbody>
											</table>
										</div>
									</div>

									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportToExcelitem()">Export to Excel</button>

								</div>

							</form>
						</div>
					</div>


					<div id="container2" style="display: none;">
						<div class="modal-body">
							<form>

								<div class="container container-report mt-4">
									<h5 class="text-center report-header">Invoice Master
										History Report</h5>

									<div class="form-row dynamic-row">
										<div class="table-responsive">
											<table class="table table-bordered table-sm" id="TableID2">
												<thead>
													<tr>
														<th>SL.No</th>
														<th>Code</th>
														<th>Name of Add</th>
														<th>City</th>
														<th>District</th>
														<th>State</th>
														<th>Country</th>
														<th>Pin No</th>
														<th>GST No</th>
														<th>PAN</th>
														<th>Created By</th>
														<th>Created Date</th>
														<th>Modified By</th>
														<th>Modified Date</th>
														<th>deleted_by</th>
														<th>deleted_date</th>
														<th>action</th>
														<th>transaction_date</th>
													</tr>
												</thead>
												<tbody>
													<!-- Data will be populated here -->
												</tbody>
											</table>
										</div>
									</div>

									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportToExcelConsignee()">Export to Excel</button>
								</div>

							</form>
						</div>
					</div>

					<div id="container3" style="display: none;">
						<div class="modal-body">
							<form>

								<div class="container container-report mt-4">
									<h5 class="text-center report-header">Consignee History
										Report</h5>

									<div class="form-row dynamic-row">
										<div class="table-responsive">
											<table class="table table-bordered table-sm" id="TableID3">
												<thead>
													<tr>
														<th>SL.No</th>
														<th>Code</th>
														<th>Name Of Add</th>
														<th>City</th>
														<th>District</th>
														<th>State</th>
														<th>Country</th>
														<th>Pin No</th>
														<th>GST No</th>
														<th>IT Pan No</th>
														<th>Created By</th>
														<th>Created Date</th>
														<th>Modified By</th>
														<th>Modified Date</th>
														<th>deleted_by</th>
														<th>deleted_date</th>
														<th>action</th>
														<th>transaction_date</th>
													</tr>
												</thead>
												<tbody>
													<!-- Data Loads Here -->
												</tbody>
											</table>
										</div>
									</div>

									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportToExcelConsigneeHistory()">Export to
										Excel</button>
								</div>

							</form>
						</div>
					</div>


					<div id="container4" style="display: none;">
						<div class="modal-body">
							<form>

								<div class="container container-report mt-4">
									<h5 class="text-center report-header">Bank Master History
										Report</h5>

									<div class="form-row dynamic-row">
										<div class="table-responsive">
											<table class="table table-bordered table-sm" id="TableID4">
												<thead>
													<tr>
														<th>SL.No</th>
														<th>Code</th>
														<th>Bank Name</th>
														<th>Account No</th>
														<th>Branch Address</th>
														<th>Branch Code</th>
														<th>Swift Code</th>
														<th>IFSC Code</th>
														<th>City</th>
														<th>State</th>
														<th>Country</th>
														<th>Created By</th>
														<th>Created Date</th>
														<th>Modified By</th>
														<th>Modified Date</th>
														<th>deleted_by</th>
														<th>deleted_date</th>
														<th>action</th>
														<th>transaction_date</th>
													</tr>
												</thead>
												<tbody>
													<!-- Data will be loaded here -->
												</tbody>
											</table>
										</div>
									</div>

									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportToExcelBank()">Export to Excel</button>
								</div>

							</form>
						</div>
					</div>


					<!-- ================= CONTAINER 5 : TAX MASTER HISTORY ================= -->
					<div id="container5" style="display: none;">

						<div class="modal-body">
							<form>

								<div class="container container-report mt-4">
									<h5 class="text-center report-header">Tax Master History</h5>

									<div class="form-row dynamic-row">
										<div class="table-responsive">
											<table class="table table-bordered table-sm" id="TableID5">
												<thead>
													<tr>
														<th>SL.No</th>
														<th>Tax Name</th>
														<th>Tax Per</th>
														<th>Created By</th>
														<th>Created Date</th>
														<th>Modified By</th>
														<th>Modified Date</th>
														<th>deleted_by</th>
														<th>deleted_date</th>
														<th>action</th>
														<th>transaction_date</th>
													</tr>
												</thead>
												<tbody>
													<!-- Data will be populated dynamically -->
												</tbody>
											</table>
										</div>
									</div>

									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportToExcelTax()">Export to Excel</button>

								</div>

							</form>
						</div>

					</div>

					<div id="container6" style="display: none;">

						<div class="modal-body">
							<form>

								<div class="container container-report mt-4">
									<h5 class="text-center report-header">Shipment Master
										History</h5>

									<div class="form-row dynamic-row">
										<div class="table-responsive">
											<table class="table table-bordered table-sm" id="TableID6">
												<thead>
													<tr>
														<th>SL.No</th>
														<th>Shipment Mode</th>
														<th>Delivery condition</th>
														<th>Created By</th>
														<th>Created Date</th>
														<th>Modified By</th>
														<th>Modified Date</th>
														<th>deleted_by</th>
														<th>deleted_date</th>
														<th>action</th>
														<th>transaction_date</th>
													</tr>
												</thead>
												<tbody>
													<!-- Data will be populated dynamically -->
												</tbody>
											</table>
										</div>
									</div>

									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportToExcelShipment()">Export to Excel</button>

								</div>

							</form>
						</div>

					</div>


					<div id="container7" style="display: none;">

						<div class="modal-body">
							<form>

								<div class="container container-report mt-4">
									<h5 class="text-center report-header">Delivery Master
										History</h5>

									<div class="form-row dynamic-row">
										<div class="table-responsive">
											<table class="table table-bordered table-sm" id="TableID7">
												<thead>
													<tr>
														<th>SL.No</th>
														<th>Code</th>
														<th>Delivery Name</th>
														<th>Created By</th>
														<th>Created Date</th>
														<th>Modified By</th>
														<th>Modified Date</th>
													</tr>
												</thead>
												<tbody>
													<!-- Data will be populated dynamically -->
												</tbody>
											</table>
										</div>
									</div>

									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportToExcelDelivery()">Export to Excel</button>

								</div>

							</form>
						</div>

					</div>


					<div id="container8" style="display: none;">

						<div class="modal-body">
							<form>

								<div class="container container-report mt-4">
									<h5 class="text-center report-header">Work Order History
										Report</h5>

									<div class="form-row dynamic-row">
										<div class="table-responsive">
											<table class="table table-bordered table-sm" id="TableID8">
												<thead>
													<tr>
														<th>SL.No</th>
														<th>Work Order No</th>
														<th>Work Order Date</th>
														<th>Created By</th>
														<th>Created Date</th>
														<th>Modified By</th>
														<th>Modified Date</th>
														<th>deleted_by</th>
														<th>deleted_date</th>
														<th>action</th>
														<th>transaction_date</th>
													</tr>
												</thead>
												<tbody>
													<!-- Data will be populated dynamically -->
												</tbody>
											</table>
										</div>
									</div>

									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportToExcelWorkOrder()">Export to Excel</button>

								</div>

							</form>
						</div>

					</div>


					<div id="container9" style="display: none;">

						<div class="modal-body">
							<form>

								<div class="container container-report mt-4">
									<h5 class="text-center report-header">GST State History
										Report</h5>

									<div class="form-row dynamic-row">
										<div class="table-responsive">
											<table class="table table-bordered table-sm" id="TableID9">
												<thead>
													<tr>
														<th>SL.No</th>
														<th>Sapbu Code</th>
														<th>State GST</th>
														<th>Created By</th>
														<th>Created Date</th>
														<th>Modified By</th>
														<th>Modified Date</th>
														<th>deleted_by</th>
														<th>deleted_date</th>
														<th>action</th>
														<th>transaction_date</th>
													</tr>
												</thead>
												<tbody>
													<!-- Data will be populated dynamically -->
												</tbody>
											</table>
										</div>
									</div>

									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportToExcelGST()">Export to Excel</button>

								</div>

							</form>
						</div>

					</div>


					<div id="container10" style="display: none;">

						<div class="modal-body">
							<form>

								<div class="container container-report mt-4">
									<h5 class="text-center report-header">Invoice Description
										History Report</h5>

									<div class="form-row dynamic-row">
										<div class="table-responsive">
											<table class="table table-bordered table-sm" id="TableID10">
												<thead>
													<tr>
														<th>SL.No</th>
														<th>Type</th>
														<th>Created By</th>
														<th>Created Date</th>
														<th>Modified By</th>
														<th>Modified Date</th>
														<th>deleted_by</th>
														<th>deleted_date</th>
														<th>action</th>
														<th>transaction_date</th>
													</tr>
												</thead>
												<tbody>
													<!-- Data will be populated dynamically -->
												</tbody>
											</table>
										</div>
									</div>

									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportToExcelType()">Export to Excel</button>

								</div>

							</form>
						</div>

					</div>

					<div id="container11" style="display: none;">
						<div class="modal-body">
							<form>
								<div class="container container-report mt-4">
									<!-- Report Header -->
									<h5 class="text-center report-header">QS Packing Note
										History Report</h5>

									<!-- Select Type Dropdowns: Outside the table -->
									<div class="row mb-3">
									<div class="form-group col-md-3">
                                       <label for="factory"><b>Factory</b></label>               
                                       <select id="factoryQS" class="form-control">
                                       <option value="">Select factory</option>                               
                                     </select>
                                      </div>
									<div class="form-group col-md-3" id="typeDiv" style="display:none;">
    <label for="selectTypeQS"><b>Select Type</b></label>
    <select class="form-control" id="selectTypeQS">
        <option value="">Select Type</option>
        <option value="Contract">Contract</option>
        <option value="Scrap">Scrap</option>
        <option value="Other">Other</option>
       <!--  <option value="MSI">MSI</option> -->
        <option value="DeliveryChallan">Delivery Challan</option>
        <option value="DBT/CRD">DBT/CRD</option>
        <option value="AdvanceInvoice">Advance Invoice</option>
    </select>
</div>

<div class="form-group col-md-3" id="contractDivQS" style="display: none;">
    <label for="selectContractQS"><b>Select Contract</b></label>
    <select class="form-control" id="selectContractQS">
        <option value="">Select Contract</option>
    </select>
</div>

<div class="form-group col-md-3" id="lotDivQS" style="display: none;">
    <label for="selectLotQS"><b>Select LOT</b></label>
    <select class="form-control" id="selectLotQS">
        <option value="">Select LOT</option>
    </select>
</div>
									</div>

									<!-- Main Table -->
									<div class="form-row dynamic-row mb-4">
										<div class="table-responsive">
											<table class="table table-bordered table-sm" id="qsPackingMasterTable">
												<thead class="table-light">
													<tr>
														<th>Sl.No</th>
														<th>Contract</th>
														<th>Load No</th>
														<th>Filepath</th>
														<th>Buyer Ref No</th>
														<th>Weighbridgeslip No</th>
														<th>Transport Name</th>
														<th>Vehicle No</th>
														<th>Milestone Name</th>
														<th>Transaction Done By</th>
														<th>Transaction Date</th>
														<th>Transaction Type</th>
														<th>Factory</th>
													</tr>
												</thead>
												<tbody>
													<!-- Data will be populated dynamically -->
												</tbody>
											</table>
										</div>
									</div>

									<button type="button" class="btn btn-success btn-sm mb-4"
										onclick="exportToExcelQCI()">Export Excel</button>

									<!-- Secondary Table: Invoice Packing Note History Report -->
									<div class="table-responsive">
										<h5 class="text-center report-header">Invoice Packing
											Note History Report</h5>
										<table class="table table-bordered table-sm"
											id="invoicePackingHistory">
											<thead class="table-light">
												<tr>
													<th>Sl.No</th>
													<th>Qty</th>
													<th>Per Kgs</th>
													<th>Unit Price</th>
													<th>Total</th>
													<th>Date</th>
													<th>Done By</th>
													<th>Transaction Type</th>
													<th>Factory</th>
												</tr>
											</thead>
											<tbody>
												<!-- Populate rows dynamically -->
											</tbody>
										</table>

									</div>

									<button type="button" class="btn btn-success btn-sm mb-4"
										onclick="exportToExcelQCI()">Export to Excel</button>
								</div>

							</form>
						</div>
					</div>
					
					
					<div id="container12" style="display: none;">
    <div class="modal-body">
        <form>
            <div class="container container-report mt-4">

                <!-- Report Header -->
                <h5 class="text-center report-header">Advance Invoice History Report</h5>

                <!-- Filters -->
                <div class="row mb-3">
                <div class="col-md-4">
                <label for="factory"><b>Factory:</b></label>               
                <select id="factory11" class="form-control">
                <option value="">Select factory</option>                               
                </select>
               </div>
                    <div class="col-md-4">
                        <label for="selectContract12">Select Contract</label>
                        <select class="form-control" id="selectContract12">
                            <option value="">Select Contract</option>
                            <!-- Populate dynamically -->
                        </select>
                    </div>

                    <div class="col-md-4">
                        <label for="selectLot12">Select LOT</label>
                        <select class="form-control" id="selectLot12">
                            <option value="">Select LOT</option>
                            <!-- Populate dynamically -->
                        </select>
                    </div>
                </div>

                <!-- Main Table -->
                <div class="table-responsive">
                    <table class="table table-bordered table-sm" id="container12Table">
                        <thead class="table-light">
                            <tr>
                                <th>Sl.No</th>
                                <th>Contract</th>
                                <th>Load</th>
                                <th>Invoice No</th>
                                <th>Description</th>
                                <th>Address</th>
                                <th>Consignee Name</th>
                                <th>Shipment Mode</th>
                                <th>Delivery Name</th>
                                <th>Work Order No</th>
                                <th>Bank Name</th>
                                <th>Export</th>
                                <th>Supplier Code</th>
                                <th>HSN Code</th>
                                <th>Reference No</th>
                                <th>Transaction Done By</th>
                                <th>Transaction Date</th>
                                <th>Transaction Type</th>
                                <th>Factory</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Dynamic rows -->
                        </tbody>
                    </table>
                </div>

                <button type="button" class="btn btn-success btn-sm mt-3" onclick="exportContainer12Excel()">
                    Export to Excel
                </button>

            </div>
        </form>
    </div>
</div>
					
					
					
					
					
					
					
					<div id="container13" style="display: none;">
    <div class="modal-body">
        <form>
            <div class="container container-report mt-4">
                <!-- Report Header -->
                <h5 class="text-center report-header">Milestone History Report</h5>

              

                <!-- Milestone Table -->
                <div class="table-responsive">
                    <table class="table table-bordered table-sm" id="milestoneHistoryTable">
                        <thead class="table-light">
                            <tr>
                                <th>Sl.No</th>
                                <th>Contract</th>
                                <th>Milestone</th>
                                <th>Milestone Name</th>
                                <th>Created By</th>
                                <th>Created Date</th>
                                <th>Modified By</th>
								<th>Modified Date</th>
                                <th>deleted_by</th>
								<th>deleted_date</th>
								<th>action</th>
								<th>transaction_date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Populate rows dynamically from your data -->
                        </tbody>
                    </table>
                </div>

                <button type="button" class="btn btn-success btn-sm mt-3" onclick="exportToExcelMilestone()">Export to Excel</button>
            </div>
        </form>
    </div>
</div>
					
	<!-- 		<div id="container14" style="display: none;">
    <div class="modal-body">
        <form>
            <div class="container container-report mt-4">

                <h5 class="text-center report-header">Invoice Entry Report</h5>

                Select Type Dropdown
                <div class="form-row mb-3">

                    <div class="col-md-4">
                        <label for="selectType14">Select Type</label>
                        <select class="form-control" id="selectType14">
                            <option value="">Select Type</option>
                            <option value="Contract">Contract</option>
                            <option value="Scrap">Scrap</option>
                            <option value="Other">Other</option>
                            <option value="MSI">MSI</option>
                            <option value="DeliveryChallan">Delivery Challan</option>
                            <option value="DBT/CRD">DBT/CRD</option>
                            <option value="AdvanceInvoice">Advance Invoice</option>
                        </select>
                    </div>

                    ONLY Contract dropdown, no LOT
                    <div class="col-md-4" id="contractDiv14" style="display: none;">
                        <label for="selectContract14">Select Contract</label>
                        <select class="form-control" id="selectContract14">
                            <option value="">Select Contract</option>
                        </select>
                    </div>

                </div>

                MAIN TABLE
                <div class="form-row dynamic-row mb-4">
                    <div class="table-responsive">
                        <table class="table table-bordered table-sm" id="TableID14">
                            <thead class="table-light">
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Invoice ID</th>
                                    <th>Invoice No</th>
                                    <th>Load Ref No</th>
                                    <th>Job Code</th>
                                    <th>PD1</th>
                                    <th>PD2</th>
                                    <th>Date</th>
                                    <th>Full Name</th>
                                    <th>PD3</th>
                                    <th>LR Dock No</th>
                                    <th>LR Dock Date</th>
                                    <th>ST Exempt</th>
                                    <th>Verification</th>
                                    <th>Verified By</th>
                                    <th>Verification Date</th>
                                    <th>Release</th>
                                    <th>R Date</th>
                                    <th>R PD1</th>
                                    <th>R PD2</th>
                                    <th>R PD3</th>
                                    <th>N Adv</th>
                                    <th>Adv</th>
                                    <th>Bal</th>
                                    <th>Recovery Amt</th>
                                    <th>Recovery</th>
                                    <th>Supply of Place</th>
                                    <th>Invoice Type</th>
                                    <th>Vendor Name</th>
                                    <th>Vendor Invoice No</th>
                                    <th>Vendor Qty</th>
                                    <th>Vendor Invoice Date</th>
                                    <th>Transaction Done By</th>
                                    <th>Timestamp</th>
                                    <th>Operation Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                Auto-populated
                            </tbody>
                        </table>
                    </div>
                </div>

                EXPORT BUTTON FOR MAIN TABLE
                <button type="button" class="btn btn-success btn-sm mb-4" onclick="exportToExcelInvoice()">Export to Excel</button>

                EXPORT BUTTON FOR SECONDARY TABLE
               

                SECONDARY TABLE
                <div class="table-responsive">
                    <h5 class="mt-4 mb-2 text-center">Invoice Contract Entry Report</h5>
                    <table class="table table-bordered table-sm" id="invoiceContractHistory14">
                        <thead class="table-light">
                            <tr>
                                <th>Sl.No</th>
                                <th>Invoice Ref</th>
                                <th>Invoice Address</th>
                                <th>Invoice Consignee Address</th>
                                <th>Shipment Mode</th>
                                <th>Delivery Condition</th>
                                <th>Product Description</th>
                                <th>Work Order</th>
                                <th>Bank Name</th>
                                <th>Register Office Address</th>
                                <th>Business Unit</th>
                                <th>HCode</th>
                                <th>SCode</th>
                                <th>Percent</th>
                                <th>Export</th>
                                <th>Transaction Done By</th>
                                <th>Timestamp</th>
                                <th>Operation Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            Auto-populated
                        </tbody>
                    </table>
                </div>
 <button type="button" class="btn btn-success btn-sm mb-4" onclick="exportToExcelInvoiceContract()">Export to Excel</button>
            </div>
        </form>
    </div>
</div> -->
					
					
					
					
					
					
					
					
					
					
					
				</div>
			</div>
		</div>
	</div>





	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.20.3/xlsx.full.min.js"></script>









	<script>
		$(document).ready(function() {

			// Initially hide all containers
			for (let i = 1; i <= 14; i++) {
				$("#container" + i).hide();
			}

			// Function to show one container and hide the rest
			// Replace your showContainer function with this:
function showContainer(containerNumber) {
    for (let i = 1; i <= 14; i++) {
        if (i === containerNumber) {
            $("#container" + i).show();
        } else {
            $("#container" + i).hide();
        }
    }
    // Hide filters when switching away from tab 1
    $("#createContractFilters").hide();
}

// UNCOMMENT and REPLACE the createContract click handler:
$("#createContract").click(function() {
    // Hide all containers (container1 stays hidden until contract selected)
    for (let i = 1; i <= 14; i++) {
        $("#container" + i).hide();
    }
    // Show only the filter dropdowns
    $("#createContractFilters").show();
});

			// Bind click events for each container
			/* $("#createContract").click(function() {
				showContainer(1);
			}); */
			$("#InvoiceMaster").click(function() {
				showContainer(2);
			});
			$("#consigneeHistory").click(function() {
				showContainer(3);
			});
			$("#bankMaster").click(function() {
				showContainer(4);
			});
			$("#taxMaster").click(function() {
				showContainer(5);
			});
			$("#shipmentMode").click(function() {
				showContainer(6);
			});
			$("#deliveryCondition").click(function() {
				showContainer(7);
			});

			// Placeholder for remaining containers 8-14
			// Replace 'yourClickID' with your actual element ID for triggering the container
			$("#workOrder").click(function() {
				showContainer(8);
			});
			$("#createGst").click(function() {
				showContainer(9);
			});
			$("#invoiceDescription").click(function() {
				showContainer(10);
			});
			$("#qsPackingNotes").click(function() {
				showContainer(11);
			});
			$("#advanceInvoice").click(function() {
				showContainer(12);
			});
			$("#assignMilestone").click(function() {
				showContainer(13);
			});
			$("#invoiceEntry").click(function() {
				showContainer(14);
			});

			
			 $(".nav-link").click(function () {
			        $(".nav-link").removeClass("active");
			        $(this).addClass("active");
			    });

			
			
			$("#selectType").change(function() {
				var selected = $(this).val();
				if (selected === "Contract") {
					$("#contractDiv, #lotDiv").show();
				} else {
					$("#contractDiv, #lotDiv").hide();
				}
			});
			
			$("#selectType14").change(function () {
			    let type = $(this).val();

			    if (type === "Contract") {
			        $("#contractDiv14").show();
			    } else {
			        $("#contractDiv14").hide();
			        $("#selectContract14").val("");
			    }
			});
			
			

		});
	</script>




	<a class="scroll-to-top rounded" href="#page-top"> <i
		class="fas fa-angle-up"></i>
	</a>
	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

	<!-- Bootstrap JS and dependencies -->


	<!-- <script>
  
</script> -->

	<script src="js/config.js"></script>
	<script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
	<script src="js/ruang-admin.min.js"></script>
	<!-- Page level plugins -->
	<script src="vendor/datatables/jquery.dataTables.min.js"></script>
	<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
	<!-- <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script> -->
	<script
		src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
	<script
		src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
	<script
		src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>



	<script src="js/username.js"></script>
	<script src="js/logout.js"></script>
	<script src="js/invoice_audit.js?v=<%=ts%>"></script>
	 <script src="js/factoryid.js"></script>
	  	  <script src="js/modifiedby.js"></script>
   	  <script src="js/createdby.js"></script>
   	   <script src="js/Sessionfilter.js"></script>
	



	<!-- Page level custom scripts -->
</body>
</html>