

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
  response.setHeader("Pragma", "no-cache"); // HTTP 1.0
  response.setDateHeader("Expires", 0); // Proxies
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
<link
	href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
	rel="stylesheet" />

<link href="css/ruang-admin.min.css" rel="stylesheet" />
<link href="vendor/datatables/dataTables.bootstrap4.min.css"
	rel="stylesheet">

<link rel="stylesheet"
	href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
<link rel="stylesheet" href="css/main.css">


<link href="css/main.css?v=1.0" rel="stylesheet">
<link href="css/masterpage.css?v=1.0" rel="stylesheet">


<script
	src="externalLibrary/cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>

<script
	src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.1/umd/popper.min.js"></script>
<script
	src="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>


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

div.dt-buttons>.dt-button:first-child, div.dt-buttons>div.dt-button-split .dt-button:first-child
	{
	margin-left: 0;
	background-color: #336699 !important;
	color: white;
	padding: 4px 10px;
}

.hide-column {
	display: none;
}
/* Style to highlight the row */
.highlight {
	background-color: #b0c4de; /* Light blue background for highlight */
}

/* Optional: Style the link to make it look like a clickable element */
.loadno-link {
	color: #007bff; /* Blue color for links */
	text-decoration: none; /* Remove underline */
}

.loadno-link:hover {
	text-decoration: underline;
	/* Optional: underline when hovering over the link */
}

#conditionalFields {
	display: contents;
	flex-wrap: wrap;
	gap: 15px;
}
</style>
<style>
#videoElement, #capturedImage {
	width: 300px;
	height: 225px;
	border: 2px solid #ccc;
	margin-bottom: 10px;
	object-fit: cover;
}
</style>

<script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
      window.location.href = "newlogin.jsp";
    }
  </script>
</head>

<body">
	<div id="wrapper">
		<%@ include file="AmsSidebar.jsp"%>
		<!-- Sidebar -->



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
							class="nav-link dropdown-toggle" href="#" id="userDropdown"
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
						<h1 class="h3 mb-0 text-gray-800">Asset Entry</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="AMSDashBoard.jsp">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page">Ams_Master</li>

						</ol>
					</div>


					<div class="row mb-3" id="vehicleentry">
						<div class="col-lg-12">
							<div class="card mb-4">
								<div
									style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
									<div
										class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
										style="background-color: #f8f9fc;">
										<button data-toggle="modal"
											 id="modalScroll1">
											<i class="fas fa-plus"></i> Create
										</button>
									</div>
								</div>

								<div class="table-responsive p-3">
									<table class="table table-striped table-bordered table-sm"
										id="Table1" width="100%">
										<thead class="text-center">
											<tr>
												<th>SL No</th>
												<th>Asset No</th>
												<th>Asset Type</th>
												<th>Asset Model</th>
												<th>Purchase Date</th>
												<th>Purchase Order No</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody class="text-center">
											<!-- Dynamic rows will go here -->
										</tbody>
									</table>
								</div>


							</div>
						</div>
					</div>

					<!-- Modal 1: Create QS Package Details -->
					<!-- Form Container with Outline and Title -->

					<div class="modal fade" id="exampleModalScrollable123"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle123"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1300px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title text-center"
										id="exampleModalScrollableTitle123">
										<b>Asset Entry</b>
									</h5>
									<button type="button" class="close" data-dismiss="modal"
										aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<!-- Asset Modal Body -->

								<div class="modal-body">
									<form id="assetForm">

										<!-- Asset Entry Box -->
										<div class="container mt-3"
											style="border: 2px solid #ccc; border-radius: 10px; padding: 25px; background-color: #fff; max-width: 1200px;">



											<!-- Two Column Layout -->
											<div class="form-row">

												<!-- Left Column -->
												<div class="col-md-6">

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Asset
																No:</b></label>
														<div class="col-sm-8">
															<input type="text" id="assetNo"
																class="form-control form-control-sm"
																placeholder="Asset_no" readonly
																style="background-color: #f0f0f0; cursor: not-allowed;">
														</div>
													</div>



													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Asset
																Owned By:</b></label>
														<div class="col-sm-8">
															<select
																class="form-control form-control-sm universal-select"
																id="assetOwner">
																<option value="">Select Owner</option>
																<!--  the Option Value are Dynamically shown  -->
															</select>
															<div id="assetOwnerError" class="error-message"
																style="display: none; color: red; font-size: 12px;">
																Asset Owner is required</div>
														</div>
													</div>



													<div class="form-group row">
														<label class="col-sm-4 col-form-label "><b>Asset
																Make:</b></label>
														<div class="col-sm-8">
															<select
																class="form-control form-control-sm universal-select"
																id="assetMake">
																<option value="">Select Make</option>
																<!-- The option Value are Dynamically Shown -->
															</select>
															<div id="assetMakeError" class="error-message"
																style="display: none; color: red; font-size: 12px;">
																Asset Make is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Purchase
																Date:</b></label>
														<div class="col-sm-8">
															<input type="date" id="purchaseDate"
																class="form-control form-control-sm">

															<div id="purchaseDateError" class="error-message"
																style="display: none; color: red; font-size: 12px;">
																Purchase Date is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Cost:</b></label>
														<div class="col-sm-8">
															<input type="text" id="cost"
																class="form-control form-control-sm" placeholder="Cost"
																oninput="this.value = this.value.replace(/[^0-9]/g, '')">

															<div id="costError" class="error-message"
																style="display: none; color: red; font-size: 12px;">
																Cost is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Warranty
																Start Date:</b></label>
														<div class="col-sm-8">
															<input type="date" id="warrantyStart"
																class="form-control form-control-sm">

															<div id="warrantyStartError" class="error-message"
																style="display: none; color: red; font-size: 12px;">
																Warranty Start Date is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Status:</b></label>
														<div class="col-sm-8">
															<select
																class="form-control form-control-sm universal-select"
																id="status">
																<option value="">Select Status</option>

															</select>
															<div id="statusError" class="error-message"
																style="display: none; color: red; font-size: 12px;">
																Status is required</div>
														</div>
													</div>


													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Asset
																Sr. No:</b></label>
														<div class="col-sm-8">
															<input type="text" id="serialNo"
																class="form-control form-control-sm"
																placeholder="Enter Serial No">

															<div id="serialNoError" class="error-message"
																style="display: none; color: red; font-size: 12px;">
																Serial number is required</div>
														</div>
													</div>




												</div>

												<!-- Right Column -->
												<div class="col-md-6">


													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Asset
																Type:</b></label>
														<div class="col-sm-8">
															<select
																class="form-control form-control-sm universal-select"
																id="assetType">
																<option value="">Select Asset Type</option>
																<!-- Dynamic values here -->
															</select>
															<div id="assetTypeError" class="error-message"
																style="display: none; color: red; font-size: 12px;">
																Asset Type is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Contract
																No:</b></label>
														<div class="col-sm-8">
															<select id="contractNo"
																class="form-control form-control-sm universal-select">

															</select>
															<div id="contractNoError" class="error-message"
																style="display: none; color: red; font-size: 12px;">
																Contract Number is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Asset
																Model:</b></label>
														<div class="col-sm-8">
															<select id="assetModelUp"
																class="form-control form-control-sm universal-select">
																<option value="">Select Model</option>
																<!-- Dynamic values will load here -->
															</select>
															<div id="assetModelUpError" class="error-message"
																style="display: none; color: red; font-size: 12px;">
																Asset Model is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Purchase
																Order No:</b></label>
														<div class="col-sm-8">
															<input type="text" id="poNo"
																class="form-control form-control-sm"
																placeholder="Purchase Order No">

															<div id="poNoError" class="error-message"
																style="display: none; color: red; font-size: 12px;">
																PO Number is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Vendor:</b></label>
														<div class="col-sm-8">
															<input type="text" id="vendor"
																class="form-control form-control-sm" readonly
																style="background-color: #f0f0f0; cursor: not-allowed;">


														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Warranty
																End Date:</b></label>
														<div class="col-sm-8">
															<input type="date" id="warrantyEnd"
																class="form-control form-control-sm">
															<div id="warrantyEndError" class="error-message"
																style="display: none; color: red; font-size: 12px;">
																Warranty End Date is required</div>
														</div>

													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Quantity:</b></label>
														<div class="col-sm-8">
															<input type="number" id="quantity"
																class="form-control form-control-sm" value="1" readonly
																style="background-color: #f0f0f0; cursor: not-allowed;">
															<div id="quantityError" class="error-message text-danger"
																style="display: none;">Quantity is required</div>
														</div>

													</div>


													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Remarks:</b></label>
														<div class="col-sm-8">
															<textarea id="remarks"
																class="form-control form-control-sm" rows="2"
																placeholder="Enter Remarks"></textarea>
														</div>

													</div>

												</div>
											</div>

											<!-- Buttons -->
											<div class="text-right mt-4">

												<button type="button" class="btn btn-secondary btn-sm"
													data-dismiss="modal">Cancel</button>
												<button type="submit" class="btn btn-primary btn-sm">Create</button>
											</div>

										</div>
									</form>

								</div>



							</div>

						</div>




						<div class="modal fade" id="exampleModalCenter317" tabindex="-1"
							role="dialog" aria-labelledby="exampleModalCenterTitle"
							aria-hidden="true">
							<div class="modal-dialog modal-dialog-centered" role="document">
								<div class="modal-content"
									style="width: 54%; border: thick solid #eaecf4;">
									<div class="modal-header">
										<!-- optional title -->
									</div>
									<div class="modal-body">
										<b>Are you sure you want to create?</b>
									</div>
									<div class="modal-footer">
										<button type="button" class="btn btn-secondary btn-sm"
											id="CANCEL_CONFIRM">NO</button>
										<button type="button" class="btn btn-info btn-sm"
											id="confirmassetentryyes">YES</button>
									</div>
								</div>
							</div>
						</div>


					</div>



					<div class="modal fade" id="exampleasserNocheck" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1">
									<!-- Optional header content -->
								</div>

								<div class="modal-body text-center">
									<b id="errorMessagecon" style="color: red;"></b>
								</div>

								<div class="modal-footer justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>
							</div>
						</div>
					</div>




					









					<!-- ========================= UPDATE ASSET ENTRY MODAL   ========================= -->


					<div class="modal fade" id="updateAssetEntryModal" tabindex="-1"
						role="dialog" aria-labelledby="updateAssetEntryTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1300px;" role="document">
							<div class="modal-content">

								<!-- Header -->
								<div class="modal-header">
									<h5 class="modal-title" id="updateAssetEntryTitle">
										<b>Update Asset Entry</b>
									</h5>
									<button type="button" class="close" data-dismiss="modal"
										aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>

								<!-- Body -->
								<div class="modal-body">
									<form id="updateAssetForm">
										<div class="container mt-3"
											style="border: 2px solid #ccc; border-radius: 10px; padding: 25px; background-color: #fff; max-width: 1200px;">

											<div class="form-row">

												<!-- Left Column -->
												<div class="col-md-6">





													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Asset
																No:</b></label>
														<div class="col-sm-8">
															<input type="text" id="assetNoUp"
																class="form-control form-control-sm" readonly
																style="background-color: #f0f0f0; cursor: not-allowed;">
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Asset
																Owned By:</b></label>
														<div class="col-sm-8">
															<select
																class="form-control form-control-sm universal-select"
																id="assetOwnerUp">
																<option value="">Select Owner</option>

															</select>
															<div id="assetOwnerUpError" class="text-danger small"
																style="display: none;">Asset Owner is required</div>

														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Asset
																Make:</b></label>
														<div class="col-sm-8">
															<select
																class="form-control form-control-sm universal-select"
																id="assetMakeUp">
																<option value="">Select Make</option>

															</select>
															<div id="assetMakeUpError" class="text-danger small"
																style="display: none;">Asset Make is required</div>

														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Purchase
																Date:</b></label>
														<div class="col-sm-8">
															<input type="date" id="purchaseDateUp"
																class="form-control form-control-sm">
															<div id="purchaseDateUpError" class="text-danger small"
																style="display: none;">Purchase Date is required</div>

														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Cost:</b></label>
														<div class="col-sm-8">
															<input type="text" id="costUp"
																class="form-control form-control-sm" placeholder="Cost"
																oninput="this.value = this.value.replace(/[^0-9]/g, '')">
															<div id="costUpError" class="text-danger small"
																style="display: none;">Cost is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Warranty
																Start Date:</b></label>
														<div class="col-sm-8">
															<input type="date" id="warrantyStartUp"
																class="form-control form-control-sm">
															<div id="warrantyStartUpError" class="text-danger small"
																style="display: none;">Warranty Start Date is
																required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Asset
																Status:</b></label>
														<div class="col-sm-8">
															<select
																class="form-control form-control-sm universal-select"
																id="statusUp">
																<option value="">Select Status</option>

															</select>
															<div id="statusUpError" class="text-danger small"
																style="display: none;">Status is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Asset
																Sr. No:</b></label>
														<div class="col-sm-8">
															<input type="text" id="serialNoUp"
																class="form-control form-control-sm"
																placeholder="Enter Serial No">
															<div id="serialNoUpError" class="text-danger small"
																style="display: none;">Asset Serial Number is
																required</div>
														</div>
													</div>


												</div>




												<!-- Right Column -->
												<div class="col-md-6">

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Asset
																type:</b></label>
														<div class="col-sm-8">
															<select
																class="form-control form-control-sm universal-select"
																id="assettypeUp" readonly
																style="background-color: #f0f0f0; cursor: not-allowed;">
																<option value="">Select Asset type</option>

															</select>
															<div id="assettypeUpError" class="text-danger small"
																style="display: none;">Asset Type is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Contract
																No:</b></label>
														<div class="col-sm-8">
															<select id="contractNoUp"
																class="form-control form-control-sm universal-select">
																<option value="">Select</option>

															</select>
															<div id="contractModelupdateError"
																class="text-danger small" style="display: none;">
																Contract model is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Asset
																Model:</b></label>
														<div class="col-sm-8">
															<select id="assetModelUpdate"
																class="form-control form-control-sm universal-select">
																<option value="">Select Model</option>

															</select>
															<div id="assetModelUpdateError" class="text-danger small"
																style="display: none;">Asset Model is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Purchase
																Order No:</b></label>
														<div class="col-sm-8">
															<input type="text" id="poNoUp"
																class="form-control form-control-sm ">
															<div id="purchaseorderupdateerror"
																class="text-danger small" style="display: none;">
																purchase Order is required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Vendor:</b></label>
														<div class="col-sm-8">
															<input type="text" id="vendorUp"
																class="form-control form-control-sm" readonly
																style="background-color: #f0f0f0; cursor: not-allowed;">
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Warranty
																End Date:</b></label>
														<div class="col-sm-8">
															<input type="date" id="warrantyEndUp"
																class="form-control form-control-sm">
															<div id="warrantyEndUpError" class="text-danger small"
																style="display: none;">Warranty End Date is
																required</div>
														</div>
													</div>

													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Quantity:</b></label>
														<div class="col-sm-8">
															<input type="number" id="quantityUp"
																class="form-control form-control-sm" readonly
																style="background-color: #f0f0f0; cursor: not-allowed;"
																placeholder="1">
														</div>
													</div>




													<div class="form-group row">
														<label class="col-sm-4 col-form-label"><b>Remarks:</b></label>
														<div class="col-sm-8">
															<textarea id="remarksUp"
																class="form-control form-control-sm" rows="2"
																placeholder="Enter Remarks"></textarea>
														</div>
													</div>

												</div>
											</div>

											<!-- Buttons -->
											<div class="text-right mt-4  pd-4">

												<button type="button" class="btn btn-secondary btn-sm"
													data-dismiss="modal">Cancel</button>
												<button type="button" class="btn btn-primary btn-sm "
													id="updateAssetBtn">Update</button>
											</div>

										</div>
									</form>
								</div>
							</div>
						</div>
					</div>






					<div class="modal fade" id="confirmUpdateModal" tabindex="-1"
						role="dialog" aria-labelledby="confirmUpdateTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">

								<!-- Optional header (empty to match example) -->
								<div class="modal-header1">
									<!-- If you want to include a close button, uncomment below -->
							
								</div>

								<!-- Modal Body -->
								<div class="modal-body text-center">
									<b>Are you sure you want to update this Asset Entry?</b>
								</div>

								<!-- Footer -->
								<div class="modal-footer justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										id="cancelUpdateConfirm">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmUpdateYes">YES</button>
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
	

	<script>
  // When modal is opened, disable Vehicle_No initially
 
</script>

	<script>
 
</script>

	<script>

</script>



	<script>
    
</script>

	<script>
 
</script>







	<script
		src="externalLibrary/cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
		


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



	
	
	  <script src="js/AmsEntry.js?v=<%=jsVersion%>"></script>
	<script src="js/logout.js?v=<%=jsVersion%>"></script>
	<script src="js/username.js?v=<%=jsVersion%>"></script>

	<script src="js/createdby.js?v=<%=jsVersion%>"></script>
	<script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
	<script src="js/Sessionfilter.js?v=<%=jsVersion%>"></script>
	<script src="js/permissions.js?v=<%=jsVersion%>"></script>
	<script
		src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
		
		
	<script>

  window.actionElementMap = {
  };
</script>
	<script src="js/permissions.js?v=<%=jsVersion%>"></script>
	<script>


</script>
	<script>
$(document).ready(function () {
    $('#Table1').DataTable({
        dom: '<"d-flex justify-content-between mb-2"Bf>rtip', // 'ip' enables pagination
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Export to Excel',
                className: 'btn btn-primary btn-sm',
                title: 'AMS_ENTRY_REPORT',    
                filename: 'AMS_Entry_Report'
            }
        ],
        paging: true,        // Enable pagination
        pageLength: 10,      // Number of rows per page
        lengthChange: true,  // Allow user to change rows per page
                 
        searching: true,     // Enable search box
        ordering: true,      // Enable column sorting
        columnDefs: [
            { orderable: false, targets: -1 } // Disable sorting for last column (Actions)
        ]
    });
});



	
	

</script>
	<script>
$(document).ready(function(){


    let today = new Date().toISOString().split('T')[0];

   
    $("#purchaseDate").attr("min", today).attr("max",today);
    $("#purchaseDate").val(today);
  
    $("#purchaseDateUp").attr("min",today).attr("max",today)
    
    $("#warrantyStart").attr("min", today);
    $("#warrantyEnd").attr("min", today);

});
</script>

	<script>
function allowTodayAndFuture(id){
    const today = new Date().toISOString().split("T")[0];
    document.getElementById(id).setAttribute("min", today);
}

// Call for your fields
allowTodayAndFuture("purchaseDate");
allowTodayAndFuture("warrantyStart");
allowTodayAndFuture("warrantyEnd");

// ===== WARRANTY END MUST BE AFTER WARRANTY START =====
document.getElementById("warrantyStart").addEventListener("change", function () {
    document.getElementById("warrantyEnd").min = this.value;
});






</script>




</body>
</html>