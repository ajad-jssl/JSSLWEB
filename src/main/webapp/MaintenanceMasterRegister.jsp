
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

/* .status-checkbox {
    accent-color: #0d6efd; /* Bootstrap blue */
}
* /


.status-checkbox {
	accent-color: #adb5bd; /* gray when unchecked */
}

.status-checkbox:checked {
	accent-color: #0d6efd; /* blue when checked */
}
</style>
</head>
<!-- <script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script> -->

<body>
	<div id="wrapper">
		<!-- Sidebar -->
		<%@ include file="MaintenanceSideBar.jsp"%>
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
							<li class="breadcrumb-item"><a href="DrawingDashBoard.jsp">Home</a></li>
							<li class="breadcrumb-item"><a href="#">Maintenance
									Master</a></li>
						</ol>
					</div>

					<div class="container mt-5">
						<h3 class="text-center mb-4">Maintenance Master</h3>

						<!-- Radio Buttons -->
						<div
							class="d-flex flex-wrap justify-content-center gap-3 gap-md-4 mb-4">

							<div class="form-check">
								<input class="form-check-input" type="radio"
									id="TypeSelectionRadio" name="drawingMaster" checked> <label
									class="form-check-label" for="TypeSelectionRadio">
									MachineCategory </label>
							</div>

							<div class="form-check">
								<input class="form-check-input" type="radio"
									id="pageSelectionradio" name="drawingMaster"> <label
									class="form-check-label" for="pageSelectionradio">
									MachineLocation </label>
							</div>

							<div class="form-check">
								<input class="form-check-input" type="radio"
									id="pageActionradio" name="drawingMaster"> <label
									class="form-check-label" for="pageActionradio">
									MachineDetails </label>
							</div>

							<div class="form-check">
								<input class="form-check-input" type="radio"
									id="UserMappingradio" name="drawingMaster"> <label
									class="form-check-label" for="UserMappingradio">
									Technician </label>
							</div>

							<div class="form-check">
								<input class="form-check-input" type="radio"
									id="designationMappingradio" name="drawingMaster"> <label
									class="form-check-label" for="designationMappingradio">
									JobType </label>
							</div>

						</div>
					</div>




					<!-- Type Selection Table -->


					<div class="row mb-3" id="TypeSelectionTableOuter"
						style="display: block;">
						<div class="table-responsive p-3">
							<!-- Header and Create Button -->
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button class="btn btn-success btn-sm" data-toggle="modal"
									id="modaltype">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>

							<!-- Data Table -->
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="TypeSelectiontableID" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>MachineCategory</th>
											<th>Actions</th>
										</tr>
									</thead>

									<tbody id="typeSelectionTableBody">

									</tbody>


								</table>
							</div>
						</div>
					</div>





					<!-- This the Type Selection Creat Modal -->

					<div class="modal fade" id="exampleModalScrollablestype1"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create MachineCategory</b>
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
												<label for="type" class="form-label"><b>Enter
														MachineCategory :</b></label> <input type="text"
													class="form-control form-control-sm" id="module"
													placeholder="Module">
												<div id="moduleError" class="error-message"
													style="display: none;">MachineCategory is required</div>


											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createModule">Create</button>
								</div>

							</div>
						</div>
					</div>



					<div class="modal fade" id="confimationtypemodal" tabindex="-1"
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
										id="confirmtype">YES</button>
								</div>
							</div>
						</div>
					</div>




					<div class="modal fade" id="duplicateTypeModal" tabindex="-1"
						role="dialog" aria-labelledby="duplicateTypeTitle"
						aria-hidden="true">

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









					<div class="modal fade" id="exampleModalScrollablestypeUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update MachineCategory </b>
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
												<label for="type" class="form-label"><b>Enter
														MachineCategory:</b></label> <input type="text"
													class="form-control form-control-sm" id="typeUp"
													placeholder=" Type">
												<div id="typeUpError" class="error-message"
													style="display: none;">MachineCategory is required</div>


											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createtypeUp">Update</button>
								</div>

							</div>
						</div>
					</div>





					<div class="modal fade" id="confimationupdatetypemodal"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
										id="confirmtypeUp">YES</button>
								</div>
							</div>
						</div>
					</div>




					<div class="row mb-3" id="pageSelectioOuter" style="display: none;">
						<div class="table-responsive p-3">
							<!-- Header and Create Button -->
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button class="btn btn-success btn-sm" data-toggle="modal"
									id="modalpage">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>

							<!-- Data Table -->
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="pageSelectionOuterTable" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>MachineLocation</th>
											<th>Actions</th>
										</tr>
									</thead>

									<tbody id="pageSelctionOuterbody">

									</tbody>


								</table>
							</div>
						</div>
					</div>




					<div class="modal fade" id="exampleModalScrollablePages"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create MachineLocation</b>
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
												<label for="type" class="form-label"><b>Enter
														MachineLocation :</b></label> <input type="text"
													class="form-control form-control-sm" id="pagediplay"
													placeholder="MachineLocation">
												<div id="pageDisplayError" class="error-message"
													style="display: none;">MachineLocation Name is
													required</div>


											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createPage">Create</button>
								</div>

							</div>
						</div>
					</div>




					<div class="modal fade" id="confimationpage" tabindex="-1"
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
										id="confirmpage">YES</button>
								</div>
							</div>
						</div>
					</div>




					<div class="modal fade" id="exampleModalScrollablePagesUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update MachineLocation</b>
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
												<label for="type" class="form-label"><b>Enter
														MachineLocation :</b></label> <input type="text"
													class="form-control form-control-sm" id="pagediplayUp"
													placeholder="DisplayName">
												<div id="pageDisplayErrorUp" class="error-message"
													style="display: none;">MachineLocation name is
													required</div>


											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createPageUp">Update</button>
								</div>

							</div>
						</div>
					</div>


					<div class="modal fade" id="confimationupdatepage" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
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
										id="confirmpageUp">YES</button>
								</div>
							</div>
						</div>
					</div>




					<div class="row mb-3" id="pageActionOuter" style="display: none;">
						<div class="table-responsive p-3">
							<!-- Header and Create Button -->
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button class="btn btn-success btn-sm" data-toggle="modal"
									id="modalpageAction">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>

							<!-- Data Table -->
							<div class="table-responsive p-3">

								<table class="table table-striped table-bordered table-sm"
									id="machineTable">

									<thead>

										<tr>

											<th>Sl No</th>

											<th>Machine Code</th>

											<th>Sub Code</th>

											<th>Description</th>

											<th>Department</th>

											<th>Model No</th>

											<th>Serial No</th>

											<th>Manufacturer</th>

											<th>Action</th>

										</tr>

									</thead>

									<tbody id="machineTableBody">

									</tbody>

								</table>

							</div>
						</div>
					</div>



					<div class="modal fade" id="machineModal" tabindex="-1"
						role="dialog">

						<div class="modal-dialog modal-lg" role="document">

							<div class="modal-content">

								<div class="modal-header">
									<h5>
										<b>Create Machine</b>
									</h5>

									<button type="button" class="close" data-dismiss="modal">
										<span>&times;</span>
									</button>
								</div>

								<div class="modal-body">

									<div class="row">

										<div class="col-md-4 mb-3">
											<label> <b>Machine Code</b>
											</label> <input type="text" class="form-control form-control-sm"
												id="machineCode">
											<div id="MachineCodeError" class="error-message"
												style="display: none;">MachineCode is required</div>
										</div>

										<div class="col-md-4 mb-3">
											<label> <b>Machine Sub Code</b>
											</label> <input type="text" class="form-control form-control-sm"
												id="machineSubCode">
											<div id="MachineSubCodeError" class="error-message"
												style="display: none;">Machine SubCode is required</div>
										</div>

										<div class="col-md-4 mb-3">
											<label> <b>Serial No</b>
											</label> <input type="text" class="form-control form-control-sm"
												id="serialNo">
											<div id="MachineSerialError" class="error-message"
												style="display: none;">Machine SerialNo is required</div>
										</div>


									</div>

									<div class="row">
										<div class="col-md-4 mb-3">
											<label> <b>Model No</b>
											</label> <input type="text" class="form-control form-control-sm"
												id="modelNo">
											<div id="MachineModalError" class="error-message"
												style="display: none;">Modal No is required</div>
										</div>
										<div class="col-md-4 mb-3">
											<label> <b>Purchase No</b>
											</label> <input type="text" class="form-control form-control-sm"
												id="PoNumber">
											<div id="PurchaseNoError" class="error-message"
												style="display: none;">Purchase No is required</div>
										</div>
										<div class="col-md-4 mb-3">
											<label> <b>Purchase Date</b>
											</label> <input type="date" id="purchaseDate"
												class="form-control form-control-sm">
											<div id="PurchaseDateError" class="error-message"
												style="display: none;">PurchaseDate is required</div>
										</div>
									</div>

									<div class="row">


										<div class="col-md-4 mb-3">
											<label> <b>Warranty Start Date:</b>
											</label> <input type="date" id="warranteStartDate"
												class="form-control form-control-sm">
											<div id="warrateStartDateError" class="error-message"
												style="display: none;">Warranty StartDate is required</div>
										</div>

										<div class="col-md-4 mb-3">
											<label> <b>Warranty End Date:</b>
											</label> <input type="date" id="warranteEndDate"
												class="form-control form-control-sm">
											<div id="warrateEndDateError" class="error-message"
												style="display: none;">Warranty EndDate is required</div>
										</div>


										<div class="col-md-4 mb-3">
											<label> <b>Manufacture Date:</b>
											</label> <input type="date" id="manufactureDate"
												class="form-control form-control-sm">
											<div id="warrateEndDateError" class="error-message"
												style="display: none;">Manufacture Date is required</div>
										</div>
									</div>

									<div class="row">



										<div class="col-md-4 mb-3">
											<label> <b>Manufacture Name</b>
											</label> <input type="text" class="form-control form-control-sm"
												id="manufacturerName">
											<div id="manufacturerNameError" class="error-message"
												style="display: none;">Manufacturer Name is required</div>
										</div>

										<div class="col-md-4 mb-3">
											<label> <b>Manufacture Country</b>
											</label> <select class="form-control form-control-sm" id="countryId">
												<option value="">Select country</option>
											</select>
											<div id="countryDateError" class="error-message"
												style="display: none;">Manufacture Country is required</div>
										</div>

										<div class="col-md-4 mb-3">
											<label> <b>Machine Location:</b>
											</label> <select class="form-control form-control-sm"
												id="departmentId">
												<option value="">Select Location</option>
											</select>

											<div id="MachineLocationError" class="error-message"
												style="display: none;">MachineLocation is required</div>
										</div>
									</div>

									<div class="row">


										<div class="col-md-4 mb-3">
											<label> <b>Machine category</b>
											</label> <select class="form-control form-control-sm"
												id="machineDescriptionId">
												<option value="">Select Machine category</option>
											</select>
											<div id="MachineCategoryError" class="error-message"
												style="display: none;">Machine category is required</div>
										</div>
										<div class="col-md-4 mb-3">
											<label for="stateGstNo"><b>Items:</b></label>
											<div class="dropdown">
												<button class="btn btn-sm btn-light dropdown-toggle"
													type="button" id="itemsDropdown" data-bs-toggle="dropdown"
													aria-expanded="false"
													style="width: 100%; background-color: white;">
													Select Items</button>
												<div id="itemsDropdownMenu"
													style="display: none; border: 1px solid #ccc; max-height: 200px; overflow-y: auto; background: white; position: absolute; width: 300px; z-index: 1000;">
												</div>
											</div>
											<div id="itemserror" class="error-message"
												style="display: none; color: red; font-size: 12px;"></div>
										</div>



										<div class="col-md-4 mb-3">
											<label> <b>Machine Description</b>
											</label> <input type="text" class="form-control form-control-sm"
												id="machdes">
											<div id="machdesError" class="error-message"
												style="display: none;">MachineDescripition Name is
												required</div>
										</div>



									</div>



								</div>

								<div class="modal-footer">

									<button type="button" class="btn btn-danger btn-sm"
										data-dismiss="modal">Close</button>

									<button type="button" class="btn btn-success btn-sm"
										id="createMachine">Create</button>

								</div>

							</div>

						</div>

					</div>

					<div class="modal fade" id="confimationpageAction" tabindex="-1"
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
										id="confirmpageAction">YES</button>
								</div>
							</div>
						</div>
					</div>


					<div class="modal fade" id="exampleModalScrollablePagesActionUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable modal-lg"
							role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title">
										<b>Update Machine</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>

								<div class="modal-body">
									<input type="hidden" id="machineIdUp">

									<!-- Row 1 -->
									<div class="row">
										<div class="col-md-4 mb-3">
											<label><b>Machine Code</b></label> <input type="text"
												class="form-control form-control-sm" id="machineCodeUp">
											<div id="MachineCodeUpError" class="error-message"
												style="display: none;">Machine Code is required</div>
										</div>
										<div class="col-md-4 mb-3">
											<label><b>Machine Sub Code</b></label> <input type="text"
												class="form-control form-control-sm" id="machineSubCodeUp">
											<div id="MachineSubCodeUpError" class="error-message"
												style="display: none;">Machine Sub Code is required</div>
										</div>
										<div class="col-md-4 mb-3">
											<label><b>Serial No</b></label> <input type="text"
												class="form-control form-control-sm" id="serialNoUp">
											<div id="MachineSerialUpError" class="error-message"
												style="display: none;">Serial No is required</div>
										</div>
									</div>

									<!-- Row 2 -->
									<div class="row">
										<div class="col-md-4 mb-3">
											<label><b>Model No</b></label> <input type="text"
												class="form-control form-control-sm" id="modelNoUp">
											<div id="MachineModelUpError" class="error-message"
												style="display: none;">Model No is required</div>
										</div>
										<div class="col-md-4 mb-3">
											<label><b>Purchase No</b></label> <input type="text"
												class="form-control form-control-sm" id="PoNumberUp">
											<div id="PurchaseNoUpError" class="error-message"
												style="display: none;">Purchase No is required</div>
										</div>
										<div class="col-md-4 mb-3">
											<label><b>Purchase Date</b></label> <input type="date"
												class="form-control form-control-sm" id="purchaseDateUp">
											<div id="PurchaseDateUpError" class="error-message"
												style="display: none;">Purchase Date is required</div>
										</div>
									</div>

									<!-- Row 3 -->
									<div class="row">
										<div class="col-md-4 mb-3">
											<label><b>Warranty Start Date</b></label> <input type="date"
												class="form-control form-control-sm"
												id="warranteStartDateUp">
											<div id="WarrantyStartUpError" class="error-message"
												style="display: none;">Warranty Start Date is required</div>
										</div>
										<div class="col-md-4 mb-3">
											<label><b>Warranty End Date</b></label> <input type="date"
												class="form-control form-control-sm" id="warranteEndDateUp">
											<div id="WarrantyEndUpError" class="error-message"
												style="display: none;">Warranty End Date is required</div>
										</div>
										<div class="col-md-4 mb-3">
											<label><b>Manufacture Date</b></label> <input type="date"
												class="form-control form-control-sm" id="manufactureDateUp">
											<div id="ManufactureDateUpError" class="error-message"
												style="display: none;">Manufacture Date is required</div>
										</div>
									</div>

									<!-- Row 4 -->
									<div class="row">
										<div class="col-md-4 mb-3">
											<label><b>Manufacturer Name</b></label> <input type="text"
												class="form-control form-control-sm" id="manufacturerNameUp">
											<div id="ManufacturerNameUpError" class="error-message"
												style="display: none;">Manufacturer Name is required</div>
										</div>
										<div class="col-md-4 mb-3">
											<label><b>Manufacture Country</b></label> <select
												class="form-control form-control-sm" id="countryIdUp">
												<option value="">Select Country</option>
											</select>
											<div id="CountryUpError" class="error-message"
												style="display: none;">Manufacture Country is required</div>
										</div>
										<div class="col-md-4 mb-3">
											<label><b>Machine Location</b></label> <select
												class="form-control form-control-sm" id="departmentIdUp">
												<option value="">Select Location</option>
											</select>
											<div id="MachineLocationUpError" class="error-message"
												style="display: none;">Machine Location is required</div>
										</div>
									</div>

									<!-- Row 5 -->
									<div class="row">
										<div class="col-md-4 mb-3">
											<label><b>Machine Category</b></label> <select
												class="form-control form-control-sm"
												id="machineDescriptionIdUp">
												<option value="">Select Machine Description</option>
											</select>
											<div id="MachineDescUpError" class="error-message"
												style="display: none;">Machine Category is required</div>
										</div>
										<div class="col-md-4 mb-3">
											<label><b>Items</b></label>
											<div class="dropdown">
												<button class="btn btn-sm btn-light dropdown-toggle"
													type="button" id="itemsDropdown1" data-bs-toggle="dropdown"
													aria-expanded="false"
													style="width: 100%; background-color: white;">
													Select Items</button>
												<div id="items1DropdownMenu"
													style="display: none; border: 1px solid #ccc; max-height: 200px; overflow-y: auto; background: white; position: absolute; width: 300px; z-index: 1000;">
												</div>
											</div>
											<div id="items1error" class="error-message"></div>
										</div>

										<div class="col-md-4 mb-3">
											<label> <b>Machine Description</b>
											</label> <input type="text" class="form-control form-control-sm"
												id="machdesUp">
											<div id="machdesErrorUp" class="error-message"
												style="display: none;">MachineDescripition Name is
												required</div>
										</div>
									</div>

								</div>
								<!-- /.modal-body -->

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="updateMachine">Update</button>
								</div>
							</div>
						</div>
					</div>


					<div class="modal fade" id="confimationupdatepageAction"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
										id="confirmpageactionUp">YES</button>
								</div>
							</div>
						</div>
					</div>

					<div class="row mb-3" id="UserSelectionTableOuter"
						style="display: block;">
						<div class="table-responsive p-3">
							<!-- Header and Create Button -->
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button class="btn btn-success btn-sm" data-toggle="modal"
									id="usertype">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>

							<!-- Data Table -->
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="UserSelectiontableID" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Technician Name</th>
											<th>MachineCategory</th>
											<th>Actions</th>
										</tr>
									</thead>

									<tbody id="userSelectionTableBody">

									</tbody>


								</table>
							</div>
						</div>
					</div>

					<div class="row mb-3" id="designationTableOuter"
						style="display: block;">
						<div class="table-responsive p-3">
							<!-- Header and Create Button -->
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button class="btn btn-success btn-sm" data-toggle="modal"
									id="designatype">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>

							<!-- Data Table -->
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="designationtableID" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Designation</th>
											<th>Actions</th>
										</tr>
									</thead>

									<tbody id="designationTableBody">

									</tbody>


								</table>
							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalScrollabledesignation"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollabledesignationTitle"
						aria-hidden="true">

						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">

							<div class="modal-content">

								<div class="modal-header">
									<h5 class="modal-title"
										id="exampleModalScrollabledesignationTitle">
										<b>Create JobType</b>
									</h5>

									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>

								<div class="modal-body">
									<form id="designationForm">

										<div class="form-row">

											<div class="col-md-6">
												<label for="designationNCode" class="form-label"> <b>
														JobTypeCode:</b>
												</label> <input type="text" class="form-control form-control-sm"
													id="designationLCode" placeholder="JobType Code">

												<div id="designationCodeError" class="error-message"
													style="display: none;">JobTypeCode is required</div>
											</div>

											<div class="col-md-6">
												<label for="designationName" class="form-label"> <b>
														JobType Name :</b>
												</label> <input type="text" class="form-control form-control-sm"
													id="designationName" placeholder="Designation Name">

												<div id="designationError" class="error-message"
													style="display: none;">JobTypeName is required</div>
											</div>

										</div>

									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>

									<button type="button" class="btn btn-sm btn-success"
										id="createDesignation">Create</button>
								</div>

							</div>

						</div>
					</div>


					<div class="modal fade" id="confirmationDesignationModal"
						tabindex="-1" role="dialog"
						aria-labelledby="confirmationDesignationModalTitle"
						aria-hidden="true">

						<div class="modal-dialog modal-dialog-centered" role="document">

							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1"></div>

								<div class="modal-body">
									<b>Are you sure you want to create this Designation?</b>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>

									<button type="button" class="btn btn-info btn-sm"
										id="confirmDesignation">YES</button>
								</div>

							</div>

						</div>
					</div>

					<div class="modal fade" id="workerMappingModal" tabindex="-1"
						role="dialog">

						<div class="modal-dialog modal-lg" role="document">

							<div class="modal-content">

								<div class="modal-header">
									<h5>
										<b>Create Technician Mapping</b>
									</h5>

									<button type="button" class="close" data-dismiss="modal">
										<span>&times;</span>
									</button>
								</div>

								<div class="modal-body">

									<div class="row">

										<div class="col-md-4 mb-3">
											<label><b>Employee</b></label> <select
												class="form-control form-control-sm" id="employeeSelect">
												<option value="">Select Employee</option>
											</select>
										</div>

										<div class="col-md-4 mb-3">
											<label><b>Technician Emp ID</b></label> <input type="text"
												class="form-control form-control-sm" id="workerEmpId"
												readonly> <small id="workerEmpIdError"
												class="text-danger d-none"></small>
										</div>

										<div class="col-md-4 mb-3">
											<label><b>Technician Mobile No</b></label> <input type="text"
												class="form-control form-control-sm" id="workerMobileNo"
												maxlength="10"
												oninput="this.value = this.value.replace(/[^0-9]/g, '')">

											<small id="workerMobileNoError" class="text-danger d-none"></small>
										</div>

									</div>

									<div class="row">
										<div class="col-md-4 mb-3">
											<label><b>Technician Email</b></label> <input type="text"
												class="form-control form-control-sm" id="workerEmail">
											<small id="workerMoemailNoError" class="text-danger d-none"></small>
										</div>
										<div class="col-md-4 mb-3">
											<label><b>Machine Category</b></label> <select
												class="form-control form-control-sm" id="machineCategoryId">
												<option value="">Select Machine Category</option>
											</select><small id="machineCategoryError" class="text-danger d-none"></small>
										</div>
										<div class="col-md-4 mb-3">
											<label><b>Job Type</b></label>
											<div class="dropdown">
												<button class="btn btn-sm btn-light dropdown-toggle"
													type="button" id="designationDropdown"
													style="width: 100%; background-color: white;">
													Select Job type</button>
												<div id="designationDropdownMenu"
													style="display: none; border: 1px solid #ccc; max-height: 200px; overflow-y: auto; background: white; position: absolute; width: 300px; z-index: 1000;">
												</div>
											</div>
											<small id="designationDropdownError"
												class="text-danger d-none"></small>
										</div>

									</div>

								</div>

								<div class="modal-footer">

									<button type="button" class="btn btn-danger btn-sm"
										data-dismiss="modal">Close</button>

									<button type="button" class="btn btn-success btn-sm"
										id="createWorkerMapping">Create</button>

								</div>

							</div>

						</div>

					</div>


					<div class="modal fade" id="messageModal" tabindex="-1">

						<div class="modal-dialog modal-dialog-centered">

							<div class="modal-content">

								<div class="modal-body text-center">

									<h6 id="messageModalText"></h6>

								</div>

								<div class="modal-footer justify-content-center">

									<button type="button" class="btn btn-primary btn-sm"
										data-dismiss="modal">OK</button>

								</div>

							</div>

						</div>

					</div>


					<div class="modal fade" id="workerMappingUpdateModal" tabindex="-1"
						role="dialog">
						<div class="modal-dialog modal-lg" role="document">
							<div class="modal-content">

								<div class="modal-header">
									<h5>
										<b>Update Worker Mapping</b>
									</h5>
									<button type="button" class="close" data-dismiss="modal">
										<span>&times;</span>
									</button>
								</div>

								<div class="modal-body">
									<input type="hidden" id="workerMappingIdUp">

									<div class="row">
										<div class="col-md-4 mb-3">
											<label><b>Employee</b></label> <select
												class="form-control form-control-sm" id="employeeSelectUp">
												<option value="">Select Employee</option>
											</select> <small id="employeeSelectUpError" class="text-danger d-none"></small>
										</div>

										<div class="col-md-4 mb-3">
											<label><b>Worker Emp ID</b></label> <input type="text"
												class="form-control form-control-sm" id="workerEmpIdUp"
												readonly>
										</div>

										<div class="col-md-4 mb-3">
											<label><b>Worker Mobile No</b></label> <input type="text"
												class="form-control form-control-sm" id="workerMobileNoUp"
												maxlength="10"
												oninput="this.value=this.value.replace(/[^0-9]/g,'')">
											<small id="workerMobileNoUpError" class="text-danger d-none"></small>
										</div>
									</div>

									<div class="row">
										<div class="col-md-4 mb-3">
											<label><b>Worker Email</b></label> <input type="text"
												class="form-control form-control-sm" id="workerEmailup">
											<small id="workerEmailUpError" class="text-danger d-none"></small>
										</div>

										<div class="col-md-4 mb-3">
											<label><b>Machine Category</b></label> <select
												class="form-control form-control-sm"
												id="machineCategoryIdUp">
												<option value="">Select Machine Category</option>
											</select> <small id="machineCategoryUpError"
												class="text-danger d-none"></small>
										</div>

										<div class="col-md-4 mb-3">
											<label><b>Designation</b></label>
											<div class="dropdown">
												<button class="btn btn-sm btn-light dropdown-toggle"
													type="button" id="designationDropdownUp"
													style="width: 100%; background-color: white;">
													Select Designation</button>
												<div id="designationDropdownMenuUp"
													style="display: none; border: 1px solid #ccc; max-height: 200px; overflow-y: auto; background: white; position: absolute; width: 300px; z-index: 1000;">
												</div>
											</div>
											<small id="designationDropdownUpError"
												class="text-danger d-none"></small>
										</div>
									</div>

								</div>
								<!-- /.modal-body -->

								<div class="modal-footer">
									<button type="button" class="btn btn-danger btn-sm"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-success btn-sm"
										id="updateWorkerMapping">Update</button>
								</div>

							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalScrollabledesignationUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollabledesignationUpTitle"
						aria-hidden="true">

						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">

							<div class="modal-content">

								<div class="modal-header">
									<h5 class="modal-title"
										id="exampleModalScrollabledesignationUpTitle">
										<b>Update JobType</b>
									</h5>

									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>

								<div class="modal-body">
									<form id="designationUpdateForm">

										<div class="form-row">

											<div class="col-md-6">
												<label for="designationCodeUp" class="form-label"> <b>Enter
														JobTypeCode:</b>
												</label> <input type="text" class="form-control form-control-sm"
													id="designationCodeUp" placeholder="DesignationCode">

												<div id="designationCodeUpError" class="error-message"
													style="display: none;">JobCode is required</div>
											</div>


											<div class="col-md-6">
												<label for="designationNameUp" class="form-label"> <b>Enter
														JobTypeName:</b>
												</label> <input type="text" class="form-control form-control-sm"
													id="designationNameUp" placeholder="Designation">

												<div id="designationNameUpError" class="error-message"
													style="display: none;">JobTypeName is required</div>
											</div>

										</div>

									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>

									<button type="button" class="btn btn-sm btn-success"
										id="updateDesignation">Update</button>
								</div>

							</div>

						</div>

					</div>




					<div class="modal fade" id="duplicateModal" tabindex="-1"
						role="dialog" aria-labelledby="duplicateShiftTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1"></div>

								<div class="modal-body text-center">
									<b id="duplicateMessage"></b>
								</div>

								<div class="modal-footer d-flex justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
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



		<script src="js/MaintenanceMasterRegister.js?v=<%=jsVersion%>"></script>
		<script src="js/logout.js?v=<%=jsVersion%>"></script>
		<script src="js/username.js?v=<%=jsVersion%>"></script>

		<script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
		<script src="js/createdby.js?v=<%=jsVersion%>"></script>
		<script src="js/Sessionfilter.js?v=<%=jsVersion%>"></script>




		<script>
			document.addEventListener("DOMContentLoaded",
					function() {

						const typeRadio = document
								.getElementById("TypeSelectionRadio");
						const pageradio = document
								.getElementById("pageSelectionradio");
						const pageActionradio = document
								.getElementById("pageActionradio");
						const userMapping = document
								.getElementById("UserMappingradio");

						const designationmapping = document
						.getElementById("designationMappingradio");
						
						function hideAllTables() {
							$("#TypeSelectionTableOuter").hide();
							$("#pageSelectioOuter").hide();
							$("#pageActionOuter").hide();
							$("#UserSelectionTableOuter").hide();
							$("#designationTableOuter").hide();
	 

						}

						function toggleTables() {

							hideAllTables();
								
												 
		 

							// Default Module tab
							if (typeRadio.checked) {
								$("#TypeSelectionTableOuter").show();
						 
							}
	 

							// Pages tab
							if (pageradio.checked) {
								$("#pageSelectioOuter").show();
								fetchPages();
								loadModules();
							}

							if (pageActionradio.checked) {
								$("#pageActionOuter").show();
						
								loadPageAndActions();
							}
							if (userMapping.checked) {
								$("#UserSelectionTableOuter").show();

							}
							
							if (designationmapping.checked) {
								$("#designationTableOuter").show();
							}
							
						}

						// By default module checked
						typeRadio.checked = true;

						typeRadio.addEventListener("change", toggleTables);
						pageradio.addEventListener("change", toggleTables);
						pageActionradio
								.addEventListener("change", toggleTables);
						userMapping.addEventListener("change", toggleTables);
						designationmapping.addEventListener("change", toggleTables);

						// Initial load
						toggleTables();

					});
		</script>
</body>

</html>