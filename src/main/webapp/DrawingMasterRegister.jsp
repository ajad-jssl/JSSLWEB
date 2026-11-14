
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

   <script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>

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
} */


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
							<li class="breadcrumb-item"><a href="DotimeSheetDashBoard.jsp">Home</a></li>
							<li class="breadcrumb-item"><a href="DrawingMaster.jsp">DO
									Master</a></li>
						</ol>
					</div>

					<div class="container mt-5">
						<h3 class="text-center mb-4">DO Master</h3>

						<!-- Radio Buttons -->
						<div class="d-flex justify-content-center mb-4">
							<div class="form-check me-3">
								<input class="form-check-input" type="radio" id="ShiftTyperadio"
									name="drawingMaster" checked> <label
									class="form-check-label" for="ShiftTyperadio">Shift</label>
							</div>
							&nbsp;&nbsp;
							<div class="form-check">
								<input class="form-check-input" type="radio"
									id="TypeSelectionRadio" name="drawingMaster"> <label
									class="form-check-label" for="TypeSelectionRadio">Type
									Selection</label>
							</div>
							&nbsp;&nbsp;
							<div class="form-check">
								<input class="form-check-input" type="radio" id="ActivityRadio"
									name="drawingMaster"> <label class="form-check-label"
									for="ActivityRadio">Activity</label>
							</div>
							&nbsp;&nbsp;
							<div class="form-check">
								<input class="form-check-input" type="radio"
									id="modalassignradio" name="drawingMaster"> <label
									class="form-check-label" for="modalassignradio">Model
									Assign </label>
							</div>
							&nbsp;&nbsp;
							<div class="form-check">
								<input class="form-check-input" type="radio"
									id="ReasonSelectionRadio" name="drawingMaster"> <label
									class="form-check-label" for="ReasonSelectionRadio">Reason
								</label>
							</div>
							&nbsp;&nbsp;
							
							<div class="form-check">
								<input class="form-check-input" type="radio"
									id="DrawingStagesRadio" name="drawingMaster"> <label
									class="form-check-label" for="DrawingStagesRadio">Stages
								</label>
							</div>
							&nbsp;&nbsp;
							
							<div class="form-check">
								<input class="form-check-input" type="radio"
									id="DrawingSelectStageRadio" name="drawingMaster"> <label
									class="form-check-label" for="DrawingSelectStageRadio">Type Selection-Stages
								</label>
							</div>
							&nbsp;&nbsp;
							
						</div>
					</div>

					<!-- Shift_Type Table -->
					<div class="row mb-3" id="shiftTable">
						<div class="table-responsive p-3">
							<!-- Create Button -->
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button class="btn btn-success btn-sm" data-toggle="modal"
									id="modalshift">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>

							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="shiftTableID" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Shift Code</th>
											<th>Shift Hours</th>
											<th>Location</th>
											<th>Shift Description</th>
											<th>Actions</th>
											
										</tr>
									</thead>
									<tbody id="shiftTableBody">

									</tbody>

								</table>
							</div>
						</div>
					</div>

					<!-- This the Create Modal of Shift   -->

					<div class="modal fade" id="exampleModalScrollableshift"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 800px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Shift Type</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">


											<div class="col-md-3">
												<label for="loactionselect" class="form-label"> <b>Select
														Location :</b>
												</label> <select class="form-control form-control-sm"
													id="loactionselect">
													<option value="">Select the Location</option>
												</select>

												<div id="loactionselectError" class="error-message"
													style="display: none;">please select location</div>
											</div>

											<div class="col-md-3">
												<label for="shifttypecode" class="form-label"><b>Shift
														Code:</b></label> <input type="text"
													class="form-control form-control-sm" id="shifttype"
													placeholder="Shift Type">
												<div id="shifttypeError" class="error-message"
													style="display: none;">Shift Type code is required</div>


											</div>

											<div class="col-md-3">
												<label for="shifttypeDescription" class="form-label"><b>Shift
														Description:</b></label> <input type="text"
													class="form-control form-control-sm"
													id="shifttypeDescription" placeholder="Shift  Description">
												<div id="shifttypeDescriptionError" class="error-message"
													style="display: none;">Shift Type Description is
													required</div>


											</div>
											<div class="col-md-3">
												<label for="shifttypehours" class="form-label"><b>Shift
														Hours:</b></label><input type="text"
													class="form-control form-control-sm" id="shifttypehours"
													placeholder="Shift hours"
													oninput="this.value = this.value
                                                                        .replace(/[^0-9.]/g, '')
                                                  .replace(/(\..*)\./g, '$1')">

												<div id="shifttypehoursError" class="error-message"
													style="display: none;">Shift Hours is required</div>


											</div>
										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createshifttype">Create</button>
								</div>

							</div>
						</div>
					</div>




					<div class="modal fade" id="confimationshiftmodal" tabindex="-1"
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
										id="confirmshifttype">YES</button>
								</div>
							</div>
						</div>
					</div>








					<div class="modal fade" id="duplicateShiftModal" tabindex="-1"
						role="dialog" aria-labelledby="duplicateShiftTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1"></div>

								<div class="modal-body text-center">
									<b id="duplicateShiftMessage">Shift Type already exists.</b>
								</div>

								<div class="modal-footer d-flex justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>

							</div>
						</div>
					</div>



					<div class="modal fade" id="exampleModalScrollableshiftUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 700px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Shift Type</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">
											<div class="col-md-3">
												<label for="loactionselectUp" class="form-label"> <b>Select
														Location :</b>
												</label> <select class="form-control form-control-sm"
													id="loactionselectUp">
													<option value="">Select the Location</option>
												</select>

												<div id="loactionselectUpError" class="error-message"
													style="display: none;">please select location</div>
											</div>
											<div class="col-md-3">
												<label for="shifttypecodeUp" class="form-label"><b>Shift
														Code:</b></label> <input type="text"
													class="form-control form-control-sm" id="shifttypecodeUp"
													placeholder="Shift Type">
												<div id="shifttypeUpError" class="error-message"
													style="display: none;">Shift Type code is required</div>


											</div>
											<div class="col-md-3">
												<label for="shifttypeDescriptionUp" class="form-label"><b>Shift
														Description:</b></label> <input type="text"
													class="form-control form-control-sm"
													id="shifttypeDescriptionUp"
													placeholder="Shift  Description">
												<div id="shifttypeDescriptionErrorUp" class="error-message"
													style="display: none;">Shift Type Description is
													required</div>


											</div>
											<div class="col-md-3">
												<label for="shifttypehourUp" class="form-label"><b>Shift
														Hours:</b></label> <input type="text"
													class="form-control form-control-sm" id="shifttypehourUp"
													placeholder="Shift hour"
													oninput="this.value = this.value
                                                                        .replace(/[^0-9.]/g, '')
                                                                          .replace(/(\..*)\./g, '$1')">
												<div id="shifttypehourUpError" class="error-message"
													style="display: none;">Shift hour is required</div>


											</div>
										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createshifttypeUp">Update</button>
								</div>

							</div>
						</div>
					</div>



					<div class="modal fade" id="confimationupdateshiftmodal"
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
										id="confirmupdateshifttype">YES</button>
								</div>
							</div>
						</div>
					</div>


					<!-- Type Selection Table -->


					<div class="row mb-3" id="TypeSelectionTableOuter"
						style="display: none;">
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
											<th>Type Selection</th>
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
										<b>Create Type Selection</b>
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
														Type :</b></label> <input type="text"
													class="form-control form-control-sm" id="type"
													placeholder=" Type">
												<div id="typeError" class="error-message"
													style="display: none;">Type is required</div>


											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createtype">Create</button>
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
										<b>Update Type Selection</b>
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
														Type :</b></label> <input type="text"
													class="form-control form-control-sm" id="typeUp"
													placeholder=" Type">
												<div id="typeUpError" class="error-message"
													style="display: none;">Type is required</div>


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










					<div class="row mb-3" id="ActivityTable" style="display: none;">
						<div class="table-responsive p-3">
							<!-- Header and Create Button -->
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button class="btn btn-success btn-sm" data-toggle="modal"
									id="modalactivity">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>


							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="ActivitytableID" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Type Selection</th>
											<th>Activity</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>


									</tbody>

								</table>
							</div>
						</div>
					</div>


					<!-- This the Create Model for the Activity -->



					<div class="modal fade" id="exampleModalScrollablesactivity"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Activity</b>
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
												<label for="typeSelection" class="form-label"> <b>Select
														Type :</b>
												</label> <select class="form-control form-control-sm"
													id="typeSelection">

												</select>

												<div id="TypeSelectionError" class="error-message"
													style="display: none;">Select Type is required</div>
											</div>

											<div class="col-md-6">
												<label for="activity" class="form-label"><b>Create
														Activity :</b></label> <input type="text"
													class="form-control form-control-sm" id="activity"
													placeholder="enter activity">
												<div id="ActivityError" class="error-message"
													style="display: none;">Activity is required</div>


											</div>


										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createactivity">Create</button>
								</div>

							</div>
						</div>
					</div>




					<div class="modal fade" id="confimationactivitymodal" tabindex="-1"
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
										id="confirmactivity">YES</button>
								</div>
							</div>
						</div>
					</div>


					<div class="modal fade" id="duplicateActivityModal" tabindex="-1"
						role="dialog" aria-labelledby="duplicateActivityTitle"
						aria-hidden="true">

						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1"></div>

								<div class="modal-body text-center">
									<b id="duplicateActivityMessage">Activity already exists.</b>
								</div>

								<div class="modal-footer d-flex justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>

							</div>
						</div>
					</div>



					<div class="modal fade" id="exampleModalScrollablesactivityUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Activity</b>
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
												<label for="typeSelectionUp" class="form-label"> <b>Select
														Type :</b>
												</label> <select class="form-control form-control-sm"
													id="typeSelectionUp">
													<option value="">-- Select Type --</option>

												</select>

												<div id="TypeSelectionUpError" class="error-message"
													style="display: none;">Select Type is required</div>
											</div>
											<div class="col-md-6">
												<label for="activityUp" class="form-label"><b>update
														Activity :</b></label> <input type="text"
													class="form-control form-control-sm" id="activityUp"
													placeholder="enter activity">
												<div id="ActivityUpError" class="error-message"
													style="display: none;">Activity is required</div>


											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createactivityUp">Update</button>
								</div>

							</div>
						</div>
					</div>



					<div class="modal fade" id="confimationupdateactivitymodal"
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
										id="confirmactivityUp">YES</button>
								</div>
							</div>
						</div>
					</div>






					<!--  Modal Assign Table -->



					<div class="row mb-3" id="modalAssignTable">
						<div class="table-responsive p-3">
							<!-- Create Button -->
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button class="btn btn-success btn-sm" data-toggle="modal"
									 id="modalassing">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>

							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="modalassignTableID" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Employee Name</th>
											<th>Modal</th>
											<th>Actions</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody id="modalAssignBody">

									</tbody>

								</table>
							</div>
						</div>
					</div>







					<div class="modal fade" id="exampleModalScrollablemodalAssign"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollablemodalAssignTitle"
						aria-hidden="true">

						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 550px;" role="document">

							<div class="modal-content">

								<!-- Modal Header -->
								<div class="modal-header">
									<h5 class="modal-title"
										id="exampleModalScrollablemodalAssignTitle">
										<b>Create Modal Assignment</b>
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
												<label for="employeeSelection" class="form-label"> <b>Select
														Employee :</b>
												</label> <select class="form-control form-control-sm"
													id="employeeSelection" name="employeeSelection">
												</select>

												<div id="employeeSelectionError" class="error-message"
													style="display: none;">Employee is required</div>
											</div>
								

											<div class="col-md-6">
												<label for="modalSelection" class="form-label"> <b>Select
														Type :</b>
												</label> <select class="form-control form-control-sm"
													id="modalSelection" name="modalSelection">
												</select>

												<div id="modalSelectionError" class="error-message"
													style="display: none;">Type is required</div>
											</div>



										</div>

									</form>
								</div>


								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createmodalassign">Create</button>
								</div>

							</div>
						</div>
					</div>



					<div class="modal fade" id="confimationassignmodal" tabindex="-1"
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
										id="confirmmodalassign">YES</button>
								</div>
							</div>
						</div>
					</div>

					<div class="modal fade" id="duplicateModalAssign" tabindex="-1"
						role="dialog" aria-labelledby="duplicateModalAssignTitle"
						aria-hidden="true">

						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1"></div>

								<div class="modal-body text-center">
									<b id="duplicateActivityMessage1"> User is Already Assign.</b>
								</div>

								<div class="modal-footer d-flex justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>

							</div>
						</div>
					</div>



					<div class="modal fade" id="exampleModalScrollablemodalAssignUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollablemodalAssignTitle"
						aria-hidden="true">

						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 550px;" role="document">

							<div class="modal-content">

								<!-- Modal Header -->
								<div class="modal-header">
									<h5 class="modal-title"
										id="exampleModalScrollablemodalAssignTitle">
										<b>Update Modal Assignment</b>
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
												<label for="employeeSelectionUp" class="form-label">
													<b>Select Employee :</b>
												</label> <select class="form-control form-control-sm"
													id="employeeSelectionUp" name="employeeSelection">
												</select>

												<div id="employeeSelectionUpError" class="error-message"
													style="display: none;">Employee is required</div>
											</div>




											<div class="col-md-6">
												<label for="modalSelectionUp" class="form-label"> <b>Select
														Modal :</b>
												</label> <select class="form-control form-control-sm"
													id="modalSelectionUp" name="modalSelection">
												</select>

												<div id="modalSelectionUpError" class="error-message"
													style="display: none;">Modal is required</div>
											</div>

										</div>

									</form>
								</div>


								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="updatemodalassign">Update</button>
								</div>

							</div>
						</div>
					</div>

					<div class="modal fade" id="confimationupdatemodalassign"
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
										id="confirmmodalUp">YES</button>
								</div>
							</div>
						</div>
					</div>
					
					
					
					
							<div class="modal fade" id="confirmStatusModal"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to update the status?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmStatus">YES</button>
								</div>
							</div>
						</div>
					</div>



					<!-- Reason Master -->


					<div class="row mb-3" id="ReasonSelectionTableOuter"
						style="display: none;">
						<div class="table-responsive p-3">
							<!-- Header and Create Button -->
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button class="btn btn-success btn-sm" data-toggle="modal"
									id="modalreason">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>

							<!-- Data Table -->
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="reasonselectiontableID" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Reason</th>
											<th>Actions</th>
										</tr>
									</thead>

									<tbody id="reasonSelectionTableBody">

									</tbody>


								</table>
							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalScrollablesreason"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Reason</b>
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
												<label for="reason" class="form-label"><b>Enter
														Reason :</b></label> <input type="text"
													class="form-control form-control-sm" id="reason"
													placeholder="enter  reason">
												<div id="reasonError" class="error-message"
													style="display: none;">reason is required</div>


											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createreason">Create</button>
								</div>

							</div>
						</div>
					</div>



					<div class="modal fade" id="confimationreasonmodal" tabindex="-1"
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
										id="confirmreason">YES</button>
								</div>
							</div>
						</div>
					</div>




					<div class="modal fade" id="duplicateReasonModal" tabindex="-1"
						role="dialog" aria-labelledby="duplicateTypeTitle"
						aria-hidden="true">

						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1"></div>

								<div class="modal-body text-center">
									<b id="duplicateReasonMessage">Reason already exists.</b>
								</div>

								<div class="modal-footer d-flex justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>

							</div>
						</div>
					</div>


					<div class="modal fade" id="exampleModalScrollablesreasonUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Reason </b>
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
												<label for="reasonUp" class="form-label"><b>Enter
														Reason :</b></label> <input type="text"
													class="form-control form-control-sm" id="reasonUp"
													placeholder=" Type">
												<div id="reasonUpError" class="error-message"
													style="display: none;">Reason is required</div>


											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createreasonUp">Update</button>
								</div>

							</div>
						</div>
					</div>





					<div class="modal fade" id="confimationupdatereasonmodal"
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
										id="confirmreasonUp">YES</button>
								</div>
							</div>
						</div>
					</div>
					
<!-- ===================== DRAWING STAGES (JSP section) ===================== -->
<div class="row mb-3" id="modalstageTable">
	<div class="table-responsive p-3">
		<!-- Create Button -->
		<div
			class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
			style="background-color: #f8f9fc;">
			<button class="btn btn-success btn-sm" id="stageCreateBtn"
				data-toggle="modal" data-target="#exampleModalScrollableStage">
				<i class="fas fa-plus"></i> Create
			</button>
		</div>

		<div class="table-responsive p-3">
			<table class="table table-striped table-bordered table-sm"
				id="modalstageTableID" width="100%">
				<thead>
					<tr>
						<th>Sl. No.</th>
						<th>Stages</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody id="modalStagesBody">
				</tbody>
			</table>
		</div>
	</div>
</div>


<!-- CREATE MODAL -->
<div class="modal fade" id="exampleModalScrollableStage" tabindex="-1"
	role="dialog" aria-labelledby="stageCreateTitle" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable"
		style="max-width: 500px;" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="stageCreateTitle">
					<b>Create Stages</b>
				</h5>
				<button type="button" class="close white-button"
					data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<form id="stageForm">
					<div class="form-row">
						<div class="col-md-6">
							<label for="stage" class="form-label"><b>Enter Stage :</b></label>
							<input type="text" class="form-control form-control-sm"
								id="stage" placeholder="enter stage" maxlength="50">
							<div id="stageError" class="error-message" style="display: none;">Stage
								is required</div>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-sm btn-danger"
					data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-sm btn-success"
					id="createstage">Create</button>
			</div>
		</div>
	</div>
</div>


<!-- CREATE CONFIRMATION -->
<div class="modal fade" id="confimationstagemodal" tabindex="-1"
	role="dialog" aria-hidden="true">
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
				<button type="button" class="btn btn-info btn-sm" id="confirmstage">YES</button>
			</div>
		</div>
	</div>
</div>


<!-- DUPLICATE -->
<div class="modal fade" id="duplicateStageModal" tabindex="-1"
	role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content"
			style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">
			<div class="modal-header1"></div>
			<div class="modal-body text-center">
				<b id="duplicateStageMessage">Stage already exists.</b>
			</div>
			<div class="modal-footer d-flex justify-content-center">
				<button type="button" class="btn btn-secondary btn-sm"
					data-dismiss="modal">OK</button>
			</div>
		</div>
	</div>
</div>


<!-- UPDATE MODAL -->
<div class="modal fade" id="exampleModalScrollableStageUp" tabindex="-1"
	role="dialog" aria-labelledby="stageUpdateTitle" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable"
		style="max-width: 500px;" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="stageUpdateTitle">
					<b>Update Stage</b>
				</h5>
				<button type="button" class="close white-button"
					data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<form id="stageFormUp">
					<div class="form-row">
						<div class="col-md-6">
							<label for="stageUp" class="form-label"><b>Enter Stage :</b></label>
							<input type="text" class="form-control form-control-sm"
								id="stageUp" placeholder="enter stage" maxlength="50">
							<div id="stageUpError" class="error-message"
								style="display: none;">Stage is required</div>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-sm btn-danger"
					data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-sm btn-success"
					id="createstageUp">Update</button>
			</div>
		</div>
	</div>
</div>


<!-- UPDATE CONFIRMATION -->
<div class="modal fade" id="confimationupdatestagemodal" tabindex="-1"
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
					id="confirmstageUp">YES</button>
			</div>
		</div>
	</div>
</div>


	<div class="row mb-3" id="typeStageSection" style="display: none;">
	<div class="table-responsive p-3">
		<!-- Header and Create Button -->
		<div
			class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
			style="background-color: #f8f9fc;">
			<button class="btn btn-success btn-sm" data-toggle="modal"
				id="btnCreateTypeStage">
				<i class="fas fa-plus"></i> Create
			</button>
		</div>

		<div class="table-responsive p-3">
			<table class="table table-striped table-bordered table-sm"
				id="typeStageTable" width="100%">
				<thead>
					<tr>
						<th>Sl. No.</th>
						<th>Type Selection</th>
						<th>Stage</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Create Type Selection for Stages -->
<div class="modal fade" id="typeStageCreateModal"
	tabindex="-1" role="dialog"
	aria-labelledby="typeStageCreateModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable"
		style="max-width: 500px;" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="typeStageCreateModalLabel">
					<b>Assign Type Selection For Stage</b>
				</h5>
				<button type="button" class="close white-button"
					data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<form id="typeStageCreateForm">
					<div class="form-row">

						<div class="col-md-6">
							<label for="typeStageCreateType" class="form-label">
								<b>Select Type :</b>
							</label>
							<select class="form-control form-control-sm"
								id="typeStageCreateType">
								<option value="">Select the Type</option>
							</select>
							<div id="typeStageCreateTypeError" class="error-message"
								style="display: none;">Select Type is required</div>
						</div>

						<div class="col-md-6">
	<label class="form-label"><b>Select Stage :</b></label>
	<div id="typeStageCreateStageList"
		style="max-height: 150px; overflow-y: auto; border: 1px solid #d1d3e2; border-radius: .2rem; padding: 6px 10px;">
	</div>
	<div id="typeStageCreateStageError" class="error-message"
		style="display: none;">Select at least one Stage</div>
</div>
					</div>
				</form>
			</div>

			<div class="modal-footer">
				<button type="button" class="btn btn-sm btn-danger"
					data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-sm btn-success"
					id="btnSaveTypeStage">Create</button>
			</div>
		</div>
	</div>
</div>

<!-- Create confirmation -->
<div class="modal fade" id="typeStageCreateConfirmModal" tabindex="-1"
	role="dialog" aria-labelledby="typeStageCreateConfirmLabel"
	aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content"
			style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
			<div class="modal-header1"></div>
			<div class="modal-body" id="typeStageCreateConfirmLabel">
				<b>Are you sure you want to Create?</b>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary btn-sm"
					data-dismiss="modal">NO</button>
				<button type="button" class="btn btn-info btn-sm"
					id="btnConfirmTypeStageCreate">YES</button>
			</div>
		</div>
	</div>
</div>

<!-- Duplicate warning -->
<div class="modal fade" id="typeStageDuplicateModal" tabindex="-1"
	role="dialog" aria-labelledby="typeStageDuplicateMessage"
	aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content"
			style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">
			<div class="modal-header1"></div>
			<div class="modal-body text-center">
				<b id="typeStageDuplicateMessage">This Type-Selection for Stage already exists.</b>
			</div>
			<div class="modal-footer d-flex justify-content-center">
				<button type="button" class="btn btn-secondary btn-sm"
					data-dismiss="modal">OK</button>
			</div>
		</div>
	</div>
</div>

<!-- Update Type Selection for Stage -->
<div class="modal fade" id="typeStageUpdateModal"
	tabindex="-1" role="dialog"
	aria-labelledby="typeStageUpdateModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable"
		style="max-width: 500px;" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="typeStageUpdateModalLabel">
					<b>Update Assigned Type Selection for Stage</b>
				</h5>
				<button type="button" class="close white-button"
					data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<form id="typeStageUpdateForm">
					<div class="form-row">

						<div class="col-md-6">
							<label for="typeStageUpdateType" class="form-label">
								<b>Select Type :</b>
							</label>
							<select class="form-control form-control-sm"
								id="typeStageUpdateType">
								<option value="">Select the Type</option>
							</select>
							<div id="typeStageUpdateTypeError" class="error-message"
								style="display: none;">Select Type is required</div>
						</div>

						<div class="col-md-6">
	<label class="form-label"><b>Select Stage :</b></label>
	<div id="typeStageUpdateStageList"
		style="max-height: 150px; overflow-y: auto; border: 1px solid #d1d3e2; border-radius: .2rem; padding: 6px 10px;">
	</div>
	<div id="typeStageUpdateStageError" class="error-message"
		style="display: none;">Stage is required</div>
</div>

					</div>
				</form>
			</div>

			<div class="modal-footer">
				<button type="button" class="btn btn-sm btn-danger"
					data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-sm btn-success"
					id="btnUpdateTypeStage">Update</button>
			</div>
		</div>
	</div>
</div>

<!-- Update confirmation -->
<div class="modal fade" id="typeStageUpdateConfirmModal"
	tabindex="-1" role="dialog"
	aria-labelledby="typeStageUpdateConfirmLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content"
			style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
			<div class="modal-header1"></div>
			<div class="modal-body" id="typeStageUpdateConfirmLabel">
				<b>Are you sure you want to Update?</b>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary btn-sm"
					data-dismiss="modal">NO</button>
				<button type="button" class="btn btn-info btn-sm"
					id="btnConfirmTypeStageUpdate">YES</button>
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
		<script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
	
		<!-- <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script> -->
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
		<script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
		<script src="js/factoryid.js?v=<%=ver(application, "/js/factoryid.js")%>"></script>
		<script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
		<script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
		<script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
		<script src="js/DrawingMasterRegister.js?v=<%=ver(application, "/js/DrawingMasterRegister.js")%>"></script>
		<script src="js/Factory.js?v=<%=ver(application, "/js/Factory.js")%>"></script>













		



		<script>
			document.addEventListener("DOMContentLoaded",
					function() {

						const radio = localStorage
								.getItem("selectedAssetRadio");

						if (radio) {
							$("#" + radio).prop("checked", true).trigger(
									"change");
							localStorage.removeItem("selectedAssetRadio");
						}

						const shiftRadio = document
								.getElementById("ShiftTyperadio");
						const typeRadio = document
								.getElementById("TypeSelectionRadio");
						const activityRadio = document
								.getElementById("ActivityRadio");
						const modalAssignRadio = document
								.getElementById("modalassignradio");
						const reasonradio = document
								.getElementById("ReasonSelectionRadio");
						const stageradio = document.getElementById("DrawingStagesRadio");
						
						const selectradio = document.getElementById("DrawingSelectStageRadio");

						const shiftTable = document
								.getElementById("shiftTable");
						const typeTable = document
								.getElementById("TypeSelectionTableOuter");
						const activityTable = document
								.getElementById("ActivityTable");
						const modalAssignTable = document
								.getElementById("modalAssignTable");
						const reasonTable = document
								.getElementById("ReasonSelectionTableOuter");
						const stageTable = document.getElementById("modalstageTable");
						
						const selectionstage = document.getElementById("typeStageSection");
						

						function hideAllTables() {
							shiftTable.style.display = "none";
							typeTable.style.display = "none";
							activityTable.style.display = "none";
							modalAssignTable.style.display = "none";
							reasonTable.style.display = "none";
							stageTable.style.display = "none";
							selectionstage.style.display = "none";
						}

						function toggleTables() {
							hideAllTables();

							if (shiftRadio.checked) {
								shiftTable.style.display = "block";
								// fetchShiftData();
							} else if (typeRadio.checked) {
								typeTable.style.display = "block";
								// fetchTypeSelection();
							} else if (activityRadio.checked) {
								activityTable.style.display = "block";
								// fetchActivityData();
							} else if (modalAssignRadio.checked) {
								modalAssignTable.style.display = "block";
								// fetchModalAssignData();
							} else if (reasonradio.checked) {
								reasonTable.style.display = "block";
							} else if (stageradio.checked) {
								stageTable.style.display = "block";
							} else if (selectradio.checked) {
								selectionstage.style.display = "block";
							}
							
						}

						shiftRadio.addEventListener("change", toggleTables);
						typeRadio.addEventListener("change", toggleTables);
						activityRadio.addEventListener("change", toggleTables);
						modalAssignRadio.addEventListener("change",
								toggleTables);
						reasonradio.addEventListener("change", toggleTables);
						stageradio.addEventListener("change",toggleTables);
						selectradio.addEventListener("change",toggleTables);

						// Initial state
						toggleTables();
					});
		</script>
		
		<script>
		
		document.getElementById("btnCreateTypeStage").addEventListener("click", function () {
		$('#typeStageCreateModal').modal('show');
		
		})
		</script>	
		
		
	
</body>

</html>