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

<body>
	<div id="wrapper">
		<!-- Sidebar -->
		<%@ include file="EmpSidebar.jsp"%>
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

				<!-- Container Fluid-->
				<div class="container-fluid" id="container-wrapper">
					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800"></h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="EmpDashBoard.jsp">Home</a></li>
							<li class="breadcrumb-item"><a href="#"> Master</a></li>
						</ol>
					</div>

					<div class="container mt-5">
						<h3 class="text-center mb-4">Master's</h3>

						<!-- Radio Buttons -->
						<!-- Responsive Tabs - IDs unchanged -->
						<div class="master-tabs-wrapper">

							<div class="master-tabs">

								<input class="form-check-input" type="radio"
									name="vehicleSelection" id="skillRadio" value="register"
									checked onchange="toggleTables()"> <label
									for="skillRadio"> <i class="fas fa-bullseye mr-2"></i>
									Skill
								</label> <input class="form-check-input" type="radio"
									name="vehicleSelection" id="skillmappingRadio" value="register"
									onchange="toggleTables()"> <label
									for="skillmappingRadio"> <i
									class="fas fa-bullseye mr-2"></i> Skill-Mapping
								</label> <input class="form-check-input" type="radio"
									name="vehicleSelection" id="skilllevelRadio" value="register"
									onchange="toggleTables()"> <label for="skilllevelRadio">
									<i class="fas fa-bullseye mr-2"></i> Skill-Level Mapping
								</label><input class="form-check-input" type="radio"
									name="vehicleSelection" id="extTrainerRadio" value="register"
									onchange="toggleTables()"> <label for="extTrainerRadio">
									<i class="fas fa-bullseye mr-2"></i> External Trainer
								</label>


							</div>

						</div>
					</div>


					<div class="row mb-3" id="skillTable">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="skillcrt">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableskill" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Skill</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>

									</tbody>
								</table>
							</div>
						</div>
					</div>



					<div class="row mb-3" id="skillMappingTable" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="skillmappingcrt">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableskillmapping" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<!-- <th>Department</th> -->
											<th>Designation</th>
											<th>Skills</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>

									</tbody>
								</table>
							</div>
						</div>
					</div>



					<div class="row mb-3" id="skilllevelTable" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="skilltab">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="skilltabopen" width="100%">
									<thead>
										<tr>
											<th>Sl.No.</th>
											<th>Level</th>
											<th>Symbol</th>
											<th>Description</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>

									</tbody>
								</table>
							</div>
						</div>
					</div>



					<div class="row mb-3" id="extTrainerTable" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal" id="extTrainerCrt">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableExtTrainer" width="100%">


									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Type</th>
											<th>Trainer Name</th>
											<th>Organization</th>
											<th>Contact No</th>
											<th>Email</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody></tbody>
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
										<b>Create Skill</b>
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
												<label for="skilltype" class="form-label"><b>
														Enter the Skill :</b></label> <input type="text"
													class="form-control form-control-sm" id="skilltype"
													placeholder="skill">
												<div id="skilltypeError" class="error-message"
													style="display: none;">skill is required</div>


											</div>
										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="skillregtype">Create</button>
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
										<b>Update Skill</b>
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
												<label for="skilltype1" class="form-label"><b>Skill
												</b></label> <input type="text" class="form-control form-control-sm"
													id="skilltype1" placeholder="Skill">
												<div id="skilltype1Error" class="error-message"
													style="display: none;">Skill is required</div>



											</div>
										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="skillupd">Update</button>
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

					<div class="modal fade show" id="duplicateTypeModal" tabindex="-1"
						role="dialog" aria-labelledby="duplicateTypeTitle"
						aria-modal="true" style="display: none;">

						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1"></div>

								<div class="modal-body text-center">
									<b id="duplicateTypeMessage">Type Selection already exists.</b>
								</div>

								<div class="modal-footer d-flex justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>

							</div>
						</div>
					</div>



					<div class="modal fade" id="exampleModalScrollableMAP"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableMAPTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableMAPTitle">
										<b>Create Skill Mapping</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="skillMappingForm">
										<div class="form-row">

											<!-- DEPARTMENT -->
											<!-- 	<div class="col-md-12 mb-3">
							<label for="mapDepartment" class="form-label"><b>Department:</b></label>
							<select class="form-control form-control-sm" id="mapDepartment">
								<option value="" selected disabled>Select Department</option>
								Options populated dynamically via JS
							</select>
							<div id="mapDepartmentError" class="error-message"
								style="display: none;">Department is required</div>
						</div> -->

											<!-- DESIGNATION -->
											<div class="col-md-12 mb-3">
												<label for="mapDesignation" class="form-label"><b>Designation:</b></label>
												<select class="form-control form-control-sm"
													id="mapDesignation">
													<option value="" selected disabled>Select
														Designation</option>
													<!-- Options populated dynamically via JS -->
												</select>
												<div id="mapDesignationError" class="error-message"
													style="display: none;">Designation is required</div>
											</div>

											<!-- SKILLS - multi-select checkbox dropdown -->
											<div class="col-md-12 mb-3">
												<label class="form-label"><b>Skills:</b></label>

												<div class="dropdown">
													<button
														class="btn btn-outline-secondary btn-sm dropdown-toggle w-100 text-left bg-white"
														type="button" id="mapSkillsDropdownBtn"
														data-toggle="dropdown" aria-haspopup="true"
														aria-expanded="false">
														<span id="mapSkillsDropdownLabel">Select Skills</span>
													</button>

													<div class="dropdown-menu p-2"
														aria-labelledby="mapSkillsDropdownBtn"
														style="max-height: 220px; overflow-y: auto; width: 100%;"
														id="mapSkillsDropdownMenu">


														<div id="mapSkillsCheckboxList"></div>

													</div>
												</div>

												<div id="mapSkillsError" class="error-message"
													style="display: none;">At least one Skill is required</div>
											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="skillmappingregtype">Create</button>
								</div>

							</div>
						</div>
					</div>

					<!-- CONFIRM CREATE SKILL-MAPPING -->
					<div class="modal fade" id="exampleModalCenter81" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenter81Title"
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
										id="confirmskillmapYes">YES</button>
								</div>
							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalScrollableMAPUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableMAPUpTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableMAPUpTitle">
										<b>Update Skill Mapping</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="skillMappingEditForm">

										<input type="hidden" id="editSkillMappingId">

										<div class="form-row">

											<!-- DEPARTMENT -->
											<!-- <div class="col-md-12 mb-3">
							<label for="mapDepartmentEdit" class="form-label"><b>Department:</b></label>
							<select class="form-control form-control-sm" id="mapDepartmentEdit">
								<option value="" selected disabled>Select Department</option>
							</select>
							<div id="mapDepartmentEditError" class="error-message"
								style="display: none;">Department is required</div>
						</div> -->

											<!-- DESIGNATION -->
											<div class="col-md-12 mb-3">
												<label for="mapDesignationEdit" class="form-label"><b>Designation:</b></label>
												<select class="form-control form-control-sm"
													id="mapDesignationEdit">
													<option value="" selected disabled>Select
														Designation</option>
												</select>
												<div id="mapDesignationEditError" class="error-message"
													style="display: none;">Designation is required</div>
											</div>

											<!-- SKILLS - multi-select checkbox dropdown -->
											<div class="col-md-12 mb-3">
												<label class="form-label"><b>Skills:</b></label>

												<div class="dropdown">
													<button
														class="btn btn-outline-secondary btn-sm dropdown-toggle w-100 text-left bg-white"
														type="button" id="mapSkillsDropdownBtnEdit"
														data-toggle="dropdown" aria-haspopup="true"
														aria-expanded="false">
														<span id="mapSkillsDropdownLabelEdit">Select Skills</span>
													</button>

													<div class="dropdown-menu p-2"
														aria-labelledby="mapSkillsDropdownBtnEdit"
														style="max-height: 220px; overflow-y: auto; width: 100%;"
														id="mapSkillsDropdownMenuEdit">

														<div id="mapSkillsCheckboxListEdit"></div>

													</div>
												</div>

												<div id="mapSkillsEditError" class="error-message"
													style="display: none;">At least one Skill is required</div>
											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="skillmappingedittype">Update</button>
								</div>

							</div>
						</div>
					</div>

					<!-- CONFIRM UPDATE SKILL-MAPPING -->
					<div class="modal fade" id="exampleModalCenter82" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenter82Title"
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
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmskillmapUpdateYes">YES</button>
								</div>
							</div>
						</div>
					</div>




					<!-- Skill Level Mapping  -->

					<div class="modal fade" id="exampleModalScrollable123"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollable" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollable">
										<b>Create Skill Level </b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="skilllevelForm">
										<div class="form-row">

											<!-- Level -->
											<div class="col-md-12 mb-3">
												<label for="level" class="form-label"><b>Enter
														the Level:</b></label> <input type="text"
													class="form-control form-control-sm" id="level"
													placeholder="Enter Level">
												<div id="levelError" class="error-message"
													style="display: none;">Level is required</div>
											</div>

											<!-- Symbol -->
											<div class="col-md-12 mb-3">
												<label for="symbol" class="form-label"><b>Symbol:</b></label>
												<input type="text" class="form-control form-control-sm"
													id="symbol" placeholder="Enter Symbol">
												<div id="SymbolError" class="error-message"
													style="display: none;">Symbol is required</div>
											</div>

											<!-- Description -->
											<div class="col-md-12 mb-3">
												<label class="form-label" for="Description"><b>Description:</b></label>

												<textarea class="form-control" id="Description"
													name="Description" rows="4" placeholder="Enter description"></textarea>

												<div id="DescriptionError" class="error-message"
													style="display: none;">Description is required</div>
											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="skillcreate">Create</button>
								</div>

							</div>
						</div>
					</div>

					<!-- skill level confirm create  -->
					<div class="modal fade" id="exampleModal12" tabindex="-1"
						role="dialog" aria-labelledby="exampleModal12title"
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
									<button type="button" class="btn btn-info btn-sm" id="confirm">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- skill level update -->
					<div class="modal fade" id="exampleModalScrollable123Up"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollable123Uptitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollable123Uptitle">
										<b>Update Skill Level</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="skilllevelMapping">

										<input type="hidden" id="editSkilllevelMappingId">

										<div class="form-row">

											<!-- Level Update-->
											<div class="col-md-12 mb-3">
												<label for="LevelEdit" class="form-label"><b>
														Enter the Level:</b></label> <input type="text"
													class="form-control form-control-sm" id="levelEdit"
													placeholder="Enter Level">
												<div id="levelEditError" class="error-message"
													style="display: none;">Level is required</div>
											</div>

											<!-- Symbol Update-->
											<div class="col-md-12 mb-3">
												<label for="SymbolEdit" class="form-label"><b>Enter
														the symbol:</b></label> <input type="text"
													class="form-control form-control-sm" id="symbolEdit"
													placeholder="Enter Symbol">
												<div id="SymbolEditError" class="error-message"
													style="display: none;">Symbol is required</div>
											</div>

											<!-- Description Update -->
											<div class="col-md-12 mb-3">
												<label class="form-label" for="DescriptionEdit"><b>Description:</b></label>

												<textarea class="form-control" id="DescriptionEdit"
													name="Description" rows="4" placeholder="Enter description"></textarea>

												<div id="DescriptionEditError" class="error-message"
													style="display: none;">Description is required</div>
											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="skillUpdate">Update</button>
								</div>

							</div>
						</div>
					</div>

					<!-- skill confirm update  -->

					<div class="modal fade" id="exampleModalCenter12" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenter12Title"
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
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmUP">YES</button>
								</div>
							</div>
						</div>
					</div>







					<!-- CREATE EXTERNAL TRAINER -->
				<!-- CREATE TRAINER -->
<!-- CREATE TRAINER -->
<div class="modal fade" id="extTrainerCreateModal" tabindex="-1" role="dialog"
	aria-labelledby="extTrainerCreateTitle" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="extTrainerCreateTitle"><b>Add Trainer</b></h5>
				<button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<form id="extTrainerForm">
					<div class="form-row">

						<!-- TYPE TOGGLE -->
						<div class="col-md-12 mb-3">
							<label class="form-label"><b>Trainer Type:</b></label>
							<div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="radio" name="trainerTypeRadio"
										id="typeInternal" value="Internal">
									<label class="form-check-label" for="typeInternal">Internal</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="radio" name="trainerTypeRadio"
										id="typeExternal" value="External" checked>
									<label class="form-check-label" for="typeExternal">External</label>
								</div>
							</div>
						</div>

						<!-- INTERNAL FIELDS -->
						<div class="col-md-12 mb-3" id="internalFieldsBlock" style="display: none;">
							<label for="internalEmpCode" class="form-label"><b>Employee Code:</b></label>
							<div class="input-group">
								<input type="text" class="form-control form-control-sm"
									id="internalEmpCode" placeholder="Enter Employee Code">
								<div class="input-group-append">
									<button class="btn btn-sm" id="internalEmpLookupBtn" type="button">Lookup</button>
								</div>
							</div>
							<div id="internalEmpNameDisplay" class="mt-1" style="font-weight: 600; color: #37499A;"></div>
							<div id="internalEmpCodeError" class="error-message">Valid Employee Code is required</div>
						</div>

						<!-- EXTERNAL FIELDS -->
						<div id="externalFieldsBlock" style="width: 100%;">
							<div class="col-md-12 mb-3">
								<label for="trainerName" class="form-label"><b>Trainer Name:</b></label>
								<input type="text" class="form-control form-control-sm" id="trainerName" placeholder="Enter Trainer Name">
								<div id="trainerNameError" class="error-message">Trainer Name is required</div>
							</div>
							<div class="col-md-12 mb-3">
								<label for="organization" class="form-label"><b>Organization:</b></label>
								<input type="text" class="form-control form-control-sm" id="organization" placeholder="Enter Organization">
							</div>
							<div class="col-md-12 mb-3">
								<label for="contactNo" class="form-label"><b>Contact No:</b></label>
								<input type="text" class="form-control form-control-sm" id="contactNo" placeholder="Enter Contact No">
							</div>
							<div class="col-md-12 mb-3">
								<label for="email" class="form-label"><b>Email:</b></label>
								<input type="email" class="form-control form-control-sm" id="email" placeholder="Enter Email">
							</div>
						</div>

					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-sm btn-success" id="extTrainerSaveBtn">Create</button>
			</div>
		</div>
	</div>
</div>

					<!-- CONFIRM CREATE -->
					<div class="modal fade" id="extTrainerConfirmCreate" tabindex="-1"
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
										id="extTrainerConfirmCreateYes">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- UPDATE EXTERNAL TRAINER -->
		<!-- UPDATE TRAINER -->
<div class="modal fade" id="extTrainerUpdateModal" tabindex="-1" role="dialog"
	aria-labelledby="extTrainerUpdateTitle" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="extTrainerUpdateTitle"><b>Update Trainer</b></h5>
				<button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<form id="extTrainerEditForm">
					<input type="hidden" id="editExtTrainerId">
					<input type="hidden" id="editTrainerType">

					<div class="form-row">

						<!-- INTERNAL - read only, name is derived from Employee master -->
						<div class="col-md-12 mb-3" id="internalEditBlock" style="display: none;">
							<label class="form-label"><b>Employee Code:</b></label>
							<div id="internalEditEmpCode" style="font-weight: 600;"></div>
							<label class="form-label mt-2"><b>Name:</b></label>
							<div id="internalEditEmpName" style="font-weight: 600;"></div>
							<small class="text-muted">Internal trainer details come from the Employee master and can't be edited here.</small>
						</div>

						<!-- EXTERNAL - editable -->
						<div id="externalEditBlock" style="width: 100%;">
							<div class="col-md-12 mb-3">
								<label for="trainerNameEdit" class="form-label"><b>Trainer Name:</b></label>
								<input type="text" class="form-control form-control-sm" id="trainerNameEdit">
								<div id="trainerNameEditError" class="error-message">Trainer Name is required</div>
							</div>
							<div class="col-md-12 mb-3">
								<label for="organizationEdit" class="form-label"><b>Organization:</b></label>
								<input type="text" class="form-control form-control-sm" id="organizationEdit">
							</div>
							<div class="col-md-12 mb-3">
								<label for="contactNoEdit" class="form-label"><b>Contact No:</b></label>
								<input type="text" class="form-control form-control-sm" id="contactNoEdit">
							</div>
							<div class="col-md-12 mb-3">
								<label for="emailEdit" class="form-label"><b>Email:</b></label>
								<input type="email" class="form-control form-control-sm" id="emailEdit">
							</div>
						</div>

					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-sm btn-success" id="extTrainerUpdateBtn" style="display: none;">Update</button>
			</div>
		</div>
	</div>
</div>

					<!-- CONFIRM UPDATE -->
					<div class="modal fade" id="extTrainerConfirmUpdate" tabindex="-1"
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
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="extTrainerConfirmUpdateYes">YES</button>
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

	<script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>



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



	<script src="js/config.js"></script>
	<script src="js/EmpperfMaster.js"></script>

	<script src="js/logout.js"></script>
	<script src="js/username.js"></script>

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
	    const tables = ['skillTable','skillMappingTable','skilllevelTable','extTrainerTable'];
	    tables.forEach(tableId => {
	        document.getElementById(tableId).style.display = 'none';
	    });

	    if (document.getElementById('skillRadio').checked) {
	        document.getElementById('skillTable').style.display = 'block';
	    }  else if (document.getElementById('skillmappingRadio').checked) {
	    	
	        document.getElementById('skillMappingTable').style.display = 'block';
	    }else if (document.getElementById('skilllevelRadio').checked) {
	    	
	        document.getElementById('skilllevelTable').style.display = 'block';
	    }else if (document.getElementById('extTrainerRadio').checked) {
	        document.getElementById('extTrainerTable').style.display = 'block';
	        fetchExtTrainers();
	    }
	}

    // Run toggleTables on initial page load
    window.onload = toggleTables;
    


</script>

</body>

</html>