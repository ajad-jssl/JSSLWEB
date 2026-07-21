
<%
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);
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
<!--    <script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script> -->

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
		<%@ include file="sidebar.jsp"%>
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
							<li class="breadcrumb-item"><a href="GlobalMaster.jsp">Global
									Master</a></li>
						</ol>
					</div>

					<div class="container mt-5">
						<h3 class="text-center mb-4">Global Master</h3>

						<!-- Radio Buttons -->
						<div class="d-flex justify-content-center mb-4">
					
							<div class="form-check">
								<input class="form-check-input " type="radio"
									id="TypeSelectionRadio" name="drawingMaster" checked> <label
									class="form-check-label" for="TypeSelectionRadio">Module
									</label>
							</div>
								&nbsp;&nbsp;
									&nbsp;&nbsp;
									<div class="form-check">
								<input class="form-check-input " type="radio"
									id="pageSelectionradio" name="drawingMaster" > <label
									class="form-check-label" for="pageSelectionradio">pages
									</label>
							</div>
								&nbsp;&nbsp;
									&nbsp;&nbsp;
									<div class="form-check">
								<input class="form-check-input " type="radio"
									id="pageActionradio" name="drawingMaster" > <label
									class="form-check-label" for="pageActionradio">pageActions
									</label>
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
											<th>Modules</th>
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
										<b>Create Module</b>
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
														Module :</b></label> <input type="text"
													class="form-control form-control-sm" id="module"
													placeholder="Module">
												<div id="moduleError" class="error-message"
													style="display: none;">Module  is required</div>


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




					<div class="row mb-3" id="pageSelectioOuter"
						style="display: none;">
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
											<th>Module</th>
											<th>PageUrl</th>
											<th>DisplayName</th>
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
							style="max-width: 650px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create page</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">

											<div class="col-md-4">
												<label for="type" class="form-label"><b>Select
														Module :</b></label>
														<select id="pagemodule" class="form-control form-control-sm">
														<option value = "">Select Module</option>
														</select>
												<div id="moduleErrorpage" class="error-message"
													style="display: none;">Module  is required</div>


											</div>
											<div class="col-md-4">
												<label for="type" class="form-label"><b>Enter
														pageUrl :</b></label> <input type="text"
													class="form-control form-control-sm" id="pageUrl"
													placeholder="PageUrl">
												<div id="pageUrlError" class="error-message"
													style="display: none;">pageUrl   is required</div>


											</div>
												<div class="col-md-4">
												<label for="type" class="form-label"><b>Enter
														DispalyName :</b></label> <input type="text"
													class="form-control form-control-sm" id="pagediplay"
													placeholder="DisplayName">
												<div id="pageDisplayError" class="error-message"
													style="display: none;">page Display name    is required</div>


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
							style="max-width: 650px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update page</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">

											<div class="col-md-4">
												<label for="type" class="form-label"><b>Select
														Module :</b></label>
														<select id="pagemoduleUp" class="form-control form-control-sm">
														<option value = "">Select Module</option>
														</select>
												<div id="moduleErrorpageUp" class="error-message"
													style="display: none;">Module  is required</div>


											</div>
											<div class="col-md-4">
												<label for="type" class="form-label"><b>Enter
														pageUrl :</b></label> <input type="text"
													class="form-control form-control-sm" id="pageUrlUp"
													placeholder="PageUrl">
												<div id="pageUrlErrorUp" class="error-message"
													style="display: none;">pageUrl   is required</div>


											</div>
												<div class="col-md-4">
												<label for="type" class="form-label"><b>Enter
														DispalyName :</b></label> <input type="text"
													class="form-control form-control-sm" id="pagediplayUp"
													placeholder="DisplayName">
												<div id="pageDisplayErrorUp" class="error-message"
													style="display: none;">page Display name is required</div>


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


		<div class="modal fade" id="confimationupdatepage"
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
									id="pageActionOuterTable" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>pageName</th>
											<th>pageAction</th>
											<th>Actions</th>
										</tr>
									</thead>

									<tbody id="pageActionOuterbody">

									</tbody>


								</table>
							</div>
						</div>
					</div>



		<div class="modal fade" id="exampleModalScrollablePagesAction"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 650px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create pageAction</b>
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
												<label for="type" class="form-label"><b>Select
														pageName :</b></label>
														<select id="pageNameac" class="form-control form-control-sm">
														<option value = "">Select pageName</option>
														</select>
												<div id="moduleErrorpageac" class="error-message"
													style="display: none;">pageName  is required</div>


											</div>
												<div class="col-md-6">
												<label for="type" class="form-label"><b>Select
														pageAction :</b></label>
														<select id="pageActionname" class="form-control form-control-sm">
														<option value = "">Select pageAction</option>
														</select>
												<div id="moduleErrorpageacname" class="error-message"
													style="display: none;">pageAction  is required</div>


											</div>
										

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createPageAction">Create</button>
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
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 650px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update pageAction</b>
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
												<label for="type" class="form-label"><b>Select
														pageName :</b></label>
														<select id="pageNameacUp" class="form-control form-control-sm">
														<option value = "">Select pageName</option>
														</select>
												<div id="moduleErrorpageacUp" class="error-message"
													style="display: none;">pageName  is required</div>


											</div>
												<div class="col-md-6">
												<label for="type" class="form-label"><b>Select
														pageAction :</b></label>
														<select id="pageActionnameUp" class="form-control form-control-sm">
														<option value = "">Select pageAction</option>
														</select>
												<div id="moduleErrorpageacnameUp" class="error-message"
													style="display: none;">pageAction  is required</div>


											</div>
										

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="createPageActionUp">Update</button>
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
		<!--  -->
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
		<!--   <script src="js/AmsMasterRegister.js"></script> -->
		<script src="js/logout.js"></script>
		<script src="js/username.js"></script>
		<script src="js/factoryid.js"></script>
		<script src="js/modifiedby.js"></script>
		<script src="js/createdby.js"></script>
		<script src="js/Sessionfilter.js"></script>
		<!--  <script src="js/GlobalMasterRegisters.js"></script>  -->
		  <script src="js/GlobalMasterRegisters.js?v=<%=ts%>"></script>
		<script src="js/Factory.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function () {

    const typeRadio = document.getElementById("TypeSelectionRadio");
    const pageradio = document.getElementById("pageSelectionradio");
    const pageActionradio = document.getElementById("pageActionradio");

    function hideAllTables() {
        $("#TypeSelectionTableOuter").hide();
        $("#pageSelectioOuter").hide();
        $("#pageActionOuter").hide();
        
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
        
        if(pageActionradio.checked){
        	  $("#pageActionOuter").show();
        	  fetchPageActions();
        	  loadPageAndActions();
        }
    }

    // By default module checked
    typeRadio.checked = true;

    typeRadio.addEventListener("change", toggleTables);
    pageradio.addEventListener("change", toggleTables);
    pageActionradio.addEventListener("change",toggleTables);

    // Initial load
    toggleTables();

});
</script>
</body>

</html>