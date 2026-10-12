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
	type="text/css" />
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<link href="css/ruang-admin.min.css" rel="stylesheet" />
<link href="vendor/datatables/dataTables.bootstrap4.min.css"
	rel="stylesheet">
<!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css" /> -->
<link rel="stylesheet"
	href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
<link rel="stylesheet" href="css/main.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="js/sidebar.js"></script>
<style>
.error-message {
	color: red;
	font-size: 12px;
	margin-top: 5px;
	display: none; /* Hidden by default */
}

.error-message {
	color: red;
	display: none;
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

div.dt-buttons>.dt-button:first-child, div.dt-buttons>div.dt-button-split .dt-button:first-child
	{
	margin-left: 0;
	background-color: #336699 !important;
	color: white;
	padding: 4px 10px;
}

.mt-5, .my-5 {
	margin-top: -5rem !important;
}

/* =========================
   RESPONSIVE MASTER TABS
========================= */
.master-tabs-wrapper {
	display: flex;
	justify-content: flex-start;
	width: 100%;
	margin-bottom: 30px;
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
	scrollbar-width: thin;
}

.master-tabs-wrapper::-webkit-scrollbar {
	height: 4px;
}

.master-tabs-wrapper::-webkit-scrollbar-thumb {
	background: #d1d5db;
	border-radius: 4px;
}

.master-tabs {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 8px;
	padding: 6px;
	background: #f8f9fc;
	border: 1px solid #e3e6f0;
	border-radius: 12px;
	width: max-content;
	flex-shrink: 0;
}

/* Hide only the visual radio button */
.master-tabs input[type="radio"] {
	position: absolute;
	opacity: 0;
	pointer-events: none;
}

/* Tab design */
.master-tabs label {
	margin: 0;
	padding: 10px 20px;
	border-radius: 8px;
	color: #7c85a3;
	background: transparent;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	white-space: nowrap;
	flex-shrink: 0;
	transition: all 0.2s ease;
}

/* Hover */
.master-tabs label:hover {
	color: #37499A;
	background: #eef0fa;
}

/* Active tab */
.master-tabs input[type="radio"]:checked+label {
	background-color: #37499A;
	color: #ffffff;
	box-shadow: 0 4px 10px rgba(55, 73, 154, 0.25);
}

/* =========================
   RESPONSIVE TABS
========================= */
@media ( max-width : 991px) {
	.master-tabs-wrapper {
		justify-content: flex-start;
	}
	.master-tabs label {
		padding: 9px 16px;
		font-size: 13px;
	}
}

@media ( max-width : 480px) {
	.master-tabs {
		gap: 5px;
		padding: 5px;
	}
	.master-tabs label {
		padding: 8px 14px;
		font-size: 12px;
	}
}
</style>
</head>
<script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>

<body onload="fetchUserList();">
	<div id="wrapper">
		<!-- Sidebar -->
		<%@ include file="SaleSidebar.jsp" %>
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
				<!-- Sidebar -->

				<!-- Topbar -->
				<!-- Container Fluid-->
				<div class="container-fluid" id="container-wrapper">
					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800"></h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="VehicleDashboard.jsp">Home</a></li>
							<li class="breadcrumb-item"><a href="SaleMaster.jsp">Vehicle
									Master</a></li>
						</ol>
					</div>

					<div class="container mt-5">
						<h3 class="text-center mb-4">CRM Masters</h3>

						<!-- Radio Buttons -->
						<!-- Responsive Tabs - IDs unchanged -->
						<div class="master-tabs-wrapper">

							<div class="master-tabs">

								<input class="form-check-input" type="radio"
									name="vehicleSelection" id="registerRadio" value="register"
									checked onchange="toggleTables()"> <label
									for="registerRadio"> <i class="fas fa-bullseye mr-2"></i>
									Opportunity Source
								</label> <input class="form-check-input" type="radio"
									name="vehicleSelection" id="vehicleRadio" value="vehicle"
									onchange="toggleTables()"> <label for="vehicleRadio">
									<i class="fas fa-map-marker-alt mr-2"></i> Zone
								</label> <input class="form-check-input" type="radio"
									name="vehicleSelection" id="subZoneRadio" value="subzone"
									onchange="toggleTables()"> <label for="subZoneRadio">
									<i class="fas fa-map-signs mr-2"></i> Sub Zone
								</label> <input class="form-check-input" type="radio"
									name="vehicleSelection" id="designRadio" value="design"
									onchange="toggleTables()"> <label for="designRadio">
									<i class="fas fa-drafting-compass mr-2"></i> Design Basis
								</label><input class="form-check-input" type="radio"
									name="vehicleSelection" id="segmentRadio" value="segment"
									onchange="toggleTables()"> <label for="segmentRadio">
									<i class="fas fa-layer-group mr-2"></i> Segment
								</label> <input class="form-check-input" type="radio"
									name="vehicleSelection" id="clientRadio" value="client"
									onchange="toggleTables()"> <label for="clientRadio">
									<i class="fas fa-user-tie mr-2"></i> Client
								</label> <input class="form-check-input" type="radio"
									name="vehicleSelection" id="stageRadio" value="stage"
									onchange="toggleTables()"> <label for="stageRadio">
									<i class="fas fa-tasks mr-2"></i> Current Stage
								</label> <input class="form-check-input" type="radio"
									name="vehicleSelection" id="contactRadio" value="contact"
									onchange="toggleTables()"> <label for="contactRadio">
									<i class="fas fa-address-book mr-2"></i> Contact Person
								</label> <input class="form-check-input" type="radio"
									name="vehicleSelection" id="projectRadio" value="project"
									onchange="toggleTables()"> <label for="projectRadio">
									<i class="fas fa-project-diagram mr-2"></i> Project Name
								</label>
							</div>

						</div>
					</div>


					<div class="row mb-3" id="registerTable">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="OprtSrc">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableID" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Opportunity Source</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>

									</tbody>
								</table>
							</div>
						</div>
					</div>

					<!-- Vehicle Table -->
					<div class="row mb-3" id="vehicleTable" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="vtsveh">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableID1" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Zone Name</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>

									</tbody>
								</table>
							</div>
						</div>
					</div>






					<!-- Design Basis Table -->
					<div class="row mb-3" id="designTable" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="dsgnbss">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableID2" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Design Basis</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<!-- Segment Table -->
					<div class="row mb-3" id="segmentTable" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="sgmnt">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableID3" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Segment</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<!-- Client Table -->
					<div class="row mb-3" id="clientTable" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="clntBtn">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableID4" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Client Name</th>
											<th>Contact No.</th>
											<th>Email Address</th>
											<th>Address</th>
											<th>Country</th>
											<th>State</th>
											<th>City</th>
											<th>Pincode</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>


					<!-- Current Stage Table -->
					<div class="row mb-3" id="stageTable" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="stgBtn">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableID5" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Current Stage</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<!-- Contact Person Table -->
					<div class="row mb-3" id="contactTable" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="cntctBtn">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableID6" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Contact Name</th>
											<th>Designation</th>
											<th>Mobile No</th>
											<th>Alternate No</th>
											<th>Email</th>
											<th>Client(s)</th>
											<th>Actions</th>
											<th>Delete</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<!-- Project Name Table -->
					<div class="row mb-3" id="projectTable" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="prjctBtn">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableID7" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Project Name</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<!-- Sub Zone Table -->
					<div class="row mb-3" id="subZoneTable" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="subZoneBtn">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableID8" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Zone</th>
											<th>Sub Zone</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalScrollableIN" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalScrollableTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Opportunity Source</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">

											<div class="col-md-6">
												<label for="registertype" class="form-label"><b>Opportunity
														Source Type:</b></label> <input type="text"
													class="form-control form-control-sm" id="registertype"
													placeholder="Opportunity Source">
												<div id="registertypeError" class="error-message"
													style="display: none;">Opportunity Source Type is
													required</div>


											</div>
										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="submitregtype">Create</button>
								</div>

							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalCenter80" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
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
										id="confirmregYes">YES</button>
								</div>
							</div>
						</div>
					</div>



					<!-- Update Invoice Address -->
					<div class="modal fade" id="exampleModalScrollableINUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Opportunity Source Type</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">

											<div class="col-md-6">
												<label for="registertype1" class="form-label"><b>Opportunity
														Source Type:</b></label> <input type="text"
													class="form-control form-control-sm" id="registertype1"
													placeholder="Opportunity Source">
												<div id="registertype1Error" class="error-message"
													style="display: none;">Opportunity Source Type is
													required</div>



											</div>
										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="regtypeupd">Update</button>
								</div>





							</div>
						</div>
					</div>
					<div class="modal fade" id="exampleModalCenter75" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										id="cancelregmodal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmregtypeupd">YES</button>
								</div>
							</div>
						</div>
					</div>
					<div class="modal fade" id="exampleModalCenterDup" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b id="errorMessage"></b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>
							</div>
						</div>
					</div>



					<div class="modal fade" id="exampleModalScrollableCon"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Zone Type</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">



											<div class="col-md-6">
												<label for="vehicletype" class="form-label"><b>Zone
														Type:</b></label> <input type="text"
													class="form-control form-control-sm" id="vehicletype"
													placeholder="Zone Type">
												<div id="vehicletypeError" class="error-message"
													style="display: none;">Zone Type is required</div>
											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="submitvehtype">Create</button>
								</div>

							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalCenter85" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
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
										id="confirmvehtypeYes">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!--  Update Consignee Address -->
					<div class="modal fade" id="exampleModalScrollableConUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Zone Type</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<div class="form-row">



											<div class="col-md-6">
												<label for="vehicletype1" class="form-label"><b>Zone
														Type:</b></label> <input type="text"
													class="form-control form-control-sm" id="vehicletype1"
													placeholder="Zone Type">
												<div id="vehicletype1Error" class="error-message"
													style="display: none;">Zone Type is required</div>
											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="vehtypeupd">Update</button>
								</div>

							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalCenter86" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										id="cancelvehmodal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmvehtypeupd">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Create Design Basis -->
					<div class="modal fade" id="exampleModalScrollableDes"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Design Basis</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">
											<div class="col-md-6">
												<label for="designbasis" class="form-label"><b>Design
														Basis:</b></label> <input type="text"
													class="form-control form-control-sm" id="designbasis"
													placeholder="Design Basis">
												<div id="designbasisError" class="error-message"
													style="display: none;">Design Basis is required</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="submitdesignbasis">Create</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Create Design Basis -->
					<div class="modal fade" id="exampleModalCenter90" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
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
										id="confirmdesignYes">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Update Design Basis -->
					<div class="modal fade" id="exampleModalScrollableDesUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Design Basis</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<div class="form-row">
											<div class="col-md-6">
												<label for="designbasis1" class="form-label"><b>Design
														Basis:</b></label> <input type="text"
													class="form-control form-control-sm" id="designbasis1"
													placeholder="Design Basis">
												<div id="designbasis1Error" class="error-message"
													style="display: none;">Design Basis is required</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="designbasisupd">Update</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Update Design Basis -->
					<div class="modal fade" id="exampleModalCenter91" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										id="cancelldesignmodal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmdesignupd">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Create Segment -->
					<div class="modal fade" id="exampleModalScrollableSeg"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Segment</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">
											<div class="col-md-6">
												<label for="segment" class="form-label"><b>Segment:</b></label>
												<input type="text" class="form-control form-control-sm"
													id="segment" placeholder="Segment">
												<div id="segmentError" class="error-message"
													style="display: none;">Segment is required</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="submitsegment">Create</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Create Segment -->
					<div class="modal fade" id="exampleModalCenter92" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
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
										id="confirmsegmentYes">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Update Segment -->
					<div class="modal fade" id="exampleModalScrollableSegUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Segment</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<div class="form-row">
											<div class="col-md-6">
												<label for="segment1" class="form-label"><b>Segment:</b></label>
												<input type="text" class="form-control form-control-sm"
													id="segment1" placeholder="Segment">
												<div id="segment1Error" class="error-message"
													style="display: none;">Segment is required</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="segmentupd">Update</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Update Segment -->
					<div class="modal fade" id="exampleModalCenter93" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										id="cancellsegmentmodal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmsegmentupd">YES</button>
								</div>
							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalScrollableClient"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 650px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Client</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="clientForm">
										<div class="form-row">

											<div class="col-md-6 mb-3">
												<label for="clientName" class="form-label"><b>Client
														Name:</b></label> <input type="text"
													class="form-control form-control-sm" id="clientName"
													placeholder="Client Name">
												<div id="clientNameError" class="error-message"
													style="display: none;">Client Name is required</div>
											</div>
											
													<div class="col-md-6 mb-3">
												<label for="Clienttype" class="form-label"> <b>Client
														Type:</b>
												</label> <select class="form-control form-control-sm"
													id="Clienttype">
													<option value="">Select Client Type</option>
													<option value="1">Buyer</option>
													<option value="2">Consultant</option>
													<option value="3">Estimator Of Buyer</option>
													<option value="4">Third Party</option>
												</select>

												<div id="clienttypeError" class="error-message"
													style="display: none;">Client Type is required</div>
											</div>
											
														<div class="col-md-6 mb-3">
												<label for="clientCountry" class="form-label"><b>Client Segment:</b></label>
												<select class="form-control form-control-sm"
													id="clientSegment">
													<option value="">Select Client Segment </option>
												</select>
												<div id="clientSegmentError" class="error-message"
													style="display: none;">Client Segment is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="contactNo" class="form-label"><b>Contact
														No:</b></label> <input type="text"
													class="form-control form-control-sm" id="contactNo"
													placeholder="Contact No" maxlength="10">
												<div id="contactNoError" class="error-message"
													style="display: none;">Valid 10-digit Contact No is
													required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="emailAddress" class="form-label"><b>Email
														Address:</b></label> <input type="email"
													class="form-control form-control-sm" id="emailAddress"
													placeholder="Email Address">
												<div id="emailAddressError" class="error-message"
													style="display: none;">Valid Email Address is
													required</div>
											</div>
														<div class="col-md-6 mb-3">
												<label for="clientCountry" class="form-label"><b>Zone:</b></label>
												<select class="form-control form-control-sm"
													id="clientZone">
													<option value="">Select Zone</option>
												</select>
												<div id="clientzoneError" class="error-message"
													style="display: none;">Zone is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="clientCountry" class="form-label"><b>Country:</b></label>
												<select class="form-control form-control-sm"
													id="clientCountry">
													<option value="">Select Country</option>
												</select>
												<div id="clientCountryError" class="error-message"
													style="display: none;">Country is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="clientState" class="form-label"><b>State:</b></label>
												<select class="form-control form-control-sm"
													id="clientState" disabled>
													<option value="">Select State</option>
												</select>
												<div id="clientStateError" class="error-message"
													style="display: none;">State is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="clientCity" class="form-label"><b>City:</b></label>
												<select class="form-control form-control-sm" id="clientCity"
													disabled>
													<option value="">Select City</option>
												</select>
												<div id="clientCityError" class="error-message"
													style="display: none;">City is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="clientPincode" class="form-label"><b>Pincode:</b></label>
												<input type="text" class="form-control form-control-sm"
													id="clientPincode" placeholder="Pincode" maxlength="6"
													disabled>
												<div id="clientPincodeError" class="error-message"
													style="display: none;">Valid 6-digit Pincode is
													required</div>
											</div>
											<!-- 		<div class="col-md-6 mb-3">
												<label for="clienttype" class="form-label"><b>Client type:</b></label>
												<select class="form-control form-control-sm" id="Clienttype"
													>
													<option value="">Select Client type</option>
												</select>
												<div id="clienttypeError" class="error-message"
													style="display: none;">City is required</div>
											</div> -->
									
											<div class="col-md-12 mb-3">
												<label for="clientAddress" class="form-label"><b>Address:</b></label>
												<textarea class="form-control form-control-sm"
													id="clientAddress" rows="2" placeholder="Address"></textarea>
												<div id="clientAddressError" class="error-message"
													style="display: none;">Address is required</div>
											</div>

										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="submitclient">Create</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Create Client -->
					<div class="modal fade" id="exampleModalCenter94" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
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
										id="confirmclientYes">YES</button>
								</div>
							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalScrollableClientUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 650px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Client</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<div class="form-row">

											<div class="col-md-6 mb-3">
												<label for="clientName1" class="form-label"><b>Client
														Name:</b></label> <input type="text"
													class="form-control form-control-sm" id="clientName1"
													placeholder="Client Name">
												<div id="clientName1Error" class="error-message"
													style="display: none;">Client Name is required</div>
											</div>
											
												<div class="col-md-6 mb-3">
												<label for="ClienttypeUp" class="form-label"> <b>Client
														Type:</b>
												</label> <select class="form-control form-control-sm"
													id="ClienttypeUp">
													<option value="">Select Client Type</option>
													<option value="1">Customer</option>
													<option value="2">Competitor</option>
													<option value="3">Both</option>
												</select>

												<div id="clienttypeErrorUp" class="error-message"
													style="display: none;">Client Type is required</div>
											</div>
											
												<div class="col-md-6 mb-3">
												<label for="clientCountry" class="form-label"><b>Client Segment:</b></label>
												<select class="form-control form-control-sm"
													id="clientSegment1">
													<option value="">Select Client Segment </option>
												</select>
												<div id="clientSegmentError1" class="error-message"
													style="display: none;">Client Segment is required</div>
											</div>


											<div class="col-md-6 mb-3">
												<label for="contactNo1" class="form-label"><b>Contact
														No:</b></label> <input type="text"
													class="form-control form-control-sm" id="contactNo1"
													placeholder="Contact No" maxlength="10">
												<div id="contactNo1Error" class="error-message"
													style="display: none;">Valid 10-digit Contact No is
													required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="emailAddress1" class="form-label"><b>Email
														Address:</b></label> <input type="email"
													class="form-control form-control-sm" id="emailAddress1"
													placeholder="Email Address">
												<div id="emailAddress1Error" class="error-message"
													style="display: none;">Valid Email Address is
													required</div>
											</div>
														<div class="col-md-6 mb-3">
												<label for="clientCountry" class="form-label"><b>Zone:</b></label>
												<select class="form-control form-control-sm"
													id="clientZone1">
													<option value="">Select Zone</option>
												</select>
												<div id="clientzoneError1" class="error-message"
													style="display: none;">Zone is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="clientCountry1" class="form-label"><b>Country:</b></label>
												<select class="form-control form-control-sm"
													id="clientCountry1">
													<option value="">Select Country</option>
												</select>
												<div id="clientCountry1Error" class="error-message"
													style="display: none;">Country is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="clientState1" class="form-label"><b>State:</b></label>
												<select class="form-control form-control-sm"
													id="clientState1" disabled>
													<option value="">Select State</option>
												</select>
												<div id="clientState1Error" class="error-message"
													style="display: none;">State is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="clientCity1" class="form-label"><b>City:</b></label>
												<select class="form-control form-control-sm"
													id="clientCity1" disabled>
													<option value="">Select City</option>
												</select>
												<div id="clientCity1Error" class="error-message"
													style="display: none;">City is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="clientPincode1" class="form-label"><b>Pincode:</b></label>
												<input type="text" class="form-control form-control-sm"
													id="clientPincode1" placeholder="Pincode" maxlength="6"
													disabled>
												<div id="clientPincode1Error" class="error-message"
													style="display: none;">Valid 6-digit Pincode is
													required</div>
											</div>
										
											<div class="col-md-12 mb-3">
												<label for="clientAddress1" class="form-label"><b>Address:</b></label>
												<textarea class="form-control form-control-sm"
													id="clientAddress1" rows="2" placeholder="Address"></textarea>
												<div id="clientAddress1Error" class="error-message"
													style="display: none;">Address is required</div>
											</div>

										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="clientupd">Update</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Update Client -->
					<div class="modal fade" id="exampleModalCenter95" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										id="cancellclientmodal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmclientupd">YES</button>
								</div>
							</div>
						</div>
					</div>


					<!-- Create Current Stage -->
					<div class="modal fade" id="exampleModalScrollableStage"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Current Stage</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">
											<div class="col-md-6">
												<label for="currentStage" class="form-label"><b>Current
														Stage:</b></label> <input type="text"
													class="form-control form-control-sm" id="currentStage"
													placeholder="Current Stage">
												<div id="currentStageError" class="error-message"
													style="display: none;">Current Stage is required</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="submitstage">Create</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Create Current Stage -->
					<div class="modal fade" id="exampleModalCenter96" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
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
										id="confirmstageYes">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Update Current Stage -->
					<div class="modal fade" id="exampleModalScrollableStageUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Current Stage</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<div class="form-row">
											<div class="col-md-6">
												<label for="currentStage1" class="form-label"><b>Current
														Stage:</b></label> <input type="text"
													class="form-control form-control-sm" id="currentStage1"
													placeholder="Current Stage">
												<div id="currentStage1Error" class="error-message"
													style="display: none;">Current Stage is required</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="stageupd">Update</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Update Current Stage -->
					<div class="modal fade" id="exampleModalCenter97" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										id="cancellstagemodal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmstageupd">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- ============================== -->
					<!-- MAIN MODAL: SELECT CLIENT + VIEW CONTACTS -->
					<!-- ============================== -->
					<div class="modal fade" id="exampleModalScrollableContact"
						tabindex="-1" role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 700px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title">
										<b>Contact Persons</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">

									<div class="form-row">
										<div class="col-md-8 mb-3">
											<label for="contactClientSelect" class="form-label"><b>Select
													Client:</b></label> <select class="form-control form-control-sm"
												id="contactClientSelect">
												<option value="">Select Client</option>
											</select>
											<div id="contactClientError" class="error-message"
												style="display: none;">Client is required</div>
										</div>
									</div>

									<table class="table table-sm table-bordered"
										id="clientContactsTable">
										<thead>
											<tr>
												<th>Name</th>
												<th>Designation</th>
												<th>Mobile</th>
												<th>Alternate</th>
												<th>Email</th>
											</tr>
										</thead>
										<tbody></tbody>
									</table>
									<button type="button" class="btn btn-sm btn-success"
										id="addNewContactBtn">+ Add New Contact</button>

								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
								</div>
							</div>
						</div>
					</div>

					<!-- ============================== -->
					<!-- CREATE CONTACT MODAL (client is hidden/preselected) -->
					<!-- ============================== -->
					<div class="modal fade" id="exampleModalScrollableContactCreate"
						tabindex="-1" role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 650px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title">
										<b>Add New Contact</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="contactForm">
										<input type="hidden" id="contactClientIdHidden">
										<div class="form-row">

											<div class="col-md-6 mb-3">
												<label for="contactName" class="form-label"><b>Contact
														Name:</b></label> <input type="text"
													class="form-control form-control-sm" id="contactName"
													placeholder="Contact Name">
												<div id="contactNameError" class="error-message"
													style="display: none;">Contact Name is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="designation" class="form-label"><b>Designation:</b></label>
												<input type="text" class="form-control form-control-sm"
													id="designation" placeholder="Designation">
												<div id="designationError" class="error-message"
													style="display: none;">Designation is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="mobileNo" class="form-label"><b>Mobile
														No:</b></label> <input type="text"
													class="form-control form-control-sm" id="mobileNo"
													placeholder="Mobile No" maxlength="10">
												<div id="mobileNoError" class="error-message"
													style="display: none;">Valid 10-digit Mobile No is
													required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="alternateNo" class="form-label"><b>Alternate
														No:</b></label> <input type="text"
													class="form-control form-control-sm" id="alternateNo"
													placeholder="Alternate No" maxlength="10">
												<div id="alternateNoError" class="error-message"
													style="display: none;">Valid 10-digit Alternate No
													required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="contactEmail" class="form-label"><b>Email:</b></label>
												<input type="email" class="form-control form-control-sm"
													id="contactEmail" placeholder="Email Address">
												<div id="contactEmailError" class="error-message"
													style="display: none;">Valid Email Address is
													required</div>
											</div>

										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="submitcontact">Create</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Create Contact -->
					<div class="modal fade" id="exampleModalCenter98" tabindex="-1"
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
										id="confirmcontactYes">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- ============================== -->
					<!-- UPDATE CONTACT MODAL (personal fields only — no client field) -->
					<!-- ============================== -->
					<div class="modal fade" id="exampleModalScrollableContactUp"
						tabindex="-1" role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 650px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title">
										<b>Update Contact Person</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<input type="hidden" id="contactClientIdHidden1">
										<div class="form-row">

											<div class="col-md-6 mb-3">
												<label for="contactName1" class="form-label"><b>Contact
														Name:</b></label> <input type="text"
													class="form-control form-control-sm" id="contactName1"
													placeholder="Contact Name">
												<div id="contactName1Error" class="error-message"
													style="display: none;">Contact Name is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="designation1" class="form-label"><b>Designation:</b></label>
												<input type="text" class="form-control form-control-sm"
													id="designation1" placeholder="Designation">
												<div id="designation1Error" class="error-message"
													style="display: none;">Designation is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="mobileNo1" class="form-label"><b>Mobile
														No:</b></label> <input type="text"
													class="form-control form-control-sm" id="mobileNo1"
													placeholder="Mobile No" maxlength="10">
												<div id="mobileNo1Error" class="error-message"
													style="display: none;">Valid 10-digit Mobile No is
													required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="alternateNo1" class="form-label"><b>Alternate
														No:</b></label> <input type="text"
													class="form-control form-control-sm" id="alternateNo1"
													placeholder="Alternate No" maxlength="10">
												<div id="alternateNo1Error" class="error-message"
													style="display: none;">Valid 10-digit Alternate No
													required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="contactEmail1" class="form-label"><b>Email:</b></label>
												<input type="email" class="form-control form-control-sm"
													id="contactEmail1" placeholder="Email Address">
												<div id="contactEmail1Error" class="error-message"
													style="display: none;">Valid Email Address is
													required</div>
											</div>

										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="contactupd">Update</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Update Contact -->
					<div class="modal fade" id="exampleModalCenter99" tabindex="-1"
						role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										id="cancellcontactmodal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmcontactupd">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Delete Confirmation Modal -->
					<div class="modal fade" id="exampleModalCenterDeleteContact"
						tabindex="-1" role="dialog" aria-labelledby="deleteContactTitle"
						aria-hidden="true">

						<div class="modal-dialog modal-dialog-centered" role="document">

							<div class="modal-content"
								style="width: 70%; right: -15%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1"></div>

								<div class="modal-body">
									<b>Are you sure you want to delete this Contact Person?</b>
								</div>

								<div class="modal-footer">

									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>

									<button type="button" class="btn btn-danger btn-sm"
										id="confirmDeleteContact">YES</button>

								</div>

							</div>

						</div>
					</div>


					<!-- Create Project Name -->
					<div class="modal fade" id="exampleModalScrollableProject"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Project Name</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">
											<div class="col-md-6">
												<label for="projectNameInput" class="form-label"><b>Project
														Name:</b></label> <input type="text"
													class="form-control form-control-sm" id="projectNameInput"
													placeholder="Project Name">
												<div id="projectNameInputError" class="error-message"
													style="display: none;">Project Name is required</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="submitproject">Create</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Create Project Name -->
					<div class="modal fade" id="exampleModalCenter100" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
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
										id="confirmprojectYes">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Update Project Name -->
					<div class="modal fade" id="exampleModalScrollableProjectUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Project Name</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<div class="form-row">
											<div class="col-md-6">
												<label for="projectNameInput1" class="form-label"><b>Project
														Name:</b></label> <input type="text"
													class="form-control form-control-sm" id="projectNameInput1"
													placeholder="Project Name">
												<div id="projectNameInput1Error" class="error-message"
													style="display: none;">Project Name is required</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="projectupd">Update</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Update Project Name -->
					<div class="modal fade" id="exampleModalCenter101" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										id="cancellprojectmodal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmprojectupd">YES</button>
								</div>
							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalScrollableSubZone"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 550px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Sub Zone</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="subZoneForm">
										<div class="form-row">

											<div class="col-md-6 mb-3">
												<label for="subZoneParent" class="form-label"><b>Zone:</b></label>
												<select class="form-control form-control-sm"
													id="subZoneParent">
													<option value="">Select Zone</option>
												</select>
												<div id="subZoneParentError" class="error-message"
													style="display: none;">Zone is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="subZoneName" class="form-label"><b>Sub
														Zone:</b></label> <input type="text"
													class="form-control form-control-sm" id="subZoneName"
													placeholder="Sub Zone Name">
												<div id="subZoneNameError" class="error-message"
													style="display: none;">Sub Zone Name is required</div>
											</div>

										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="submitsubzone">Create</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Create Sub Zone -->
					<div class="modal fade" id="exampleModalCenter102" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
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
										id="confirmsubzoneYes">YES</button>
								</div>
							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalScrollableSubZoneUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 550px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Sub Zone</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<div class="form-row">

											<div class="col-md-6 mb-3">
												<label for="subZoneParent1" class="form-label"><b>Zone:</b></label>
												<select class="form-control form-control-sm"
													id="subZoneParent1">
													<option value="">Select Zone</option>
												</select>
												<div id="subZoneParent1Error" class="error-message"
													style="display: none;">Zone is required</div>
											</div>

											<div class="col-md-6 mb-3">
												<label for="subZoneName1" class="form-label"><b>Sub
														Zone:</b></label> <input type="text"
													class="form-control form-control-sm" id="subZoneName1"
													placeholder="Sub Zone Name">
												<div id="subZoneName1Error" class="error-message"
													style="display: none;">Sub Zone Name is required</div>
											</div>

										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="subzoneupd">Update</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Confirm Update Sub Zone -->
					<div class="modal fade" id="exampleModalCenter103" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										id="cancellsubzonemodal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmsubzoneupd">YES</button>
								</div>
							</div>
						</div>
					</div>


				</div>
			</div>
		</div>
	</div>
	<!-- Scroll to top -->
	<a class="scroll-to-top rounded" href="#page-top"> <i
		class="fas fa-angle-up"></i>
	</a>
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
	<!-- <script src="js/SaleMaster.js"></script> -->

	<script src="js/SaleMaster.js?v=<%=ts%>"></script>
	<script src="js/logout.js"></script>
	<script src="js/username.js"></script>
	<script src="js/factoryid.js"></script>
	<script src="js/modifiedby.js"></script>
	<script src="js/createdby.js"></script>
	<script src="js/Sessionfilter.js"></script>
	<script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
	<script src="js/permissions.js"></script>
	<script>
	function toggleTables() {
	    const tables = ['registerTable', 'vehicleTable', 'designTable', 'segmentTable',
	                     'clientTable', 'stageTable', 'contactTable', 'projectTable', 'subZoneTable'];
	    tables.forEach(tableId => {
	        document.getElementById(tableId).style.display = 'none';
	    });

	    if (document.getElementById('registerRadio').checked) {
	        document.getElementById('registerTable').style.display = 'block';
	    } else if (document.getElementById('vehicleRadio').checked) {
	        fetchzonetype();
	        document.getElementById('vehicleTable').style.display = 'block';
	    } else if (document.getElementById('designRadio').checked) {
	        fetchdesignbasis();
	        document.getElementById('designTable').style.display = 'block';
	    } else if (document.getElementById('segmentRadio').checked) {
	        fetchsegment();
	        document.getElementById('segmentTable').style.display = 'block';
	    } else if (document.getElementById('clientRadio').checked) {
	        fetchclients();
	        document.getElementById('clientTable').style.display = 'block';
	    } else if (document.getElementById('stageRadio').checked) {
	        fetchstage();
	        document.getElementById('stageTable').style.display = 'block';
	    } else if (document.getElementById('contactRadio').checked) {
	        fetchcontacts();
	        document.getElementById('contactTable').style.display = 'block';
	    } else if (document.getElementById('projectRadio').checked) {
	        fetchprojects();
	        document.getElementById('projectTable').style.display = 'block';
	    } else if (document.getElementById('subZoneRadio').checked) {
	        fetchsubzones();
	        document.getElementById('subZoneTable').style.display = 'block';
	    }
	}

    // Run toggleTables on initial page load
    window.onload = toggleTables;
    


</script>

</body>

</html>