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

<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-KyZXEJjRkC9iY3NfJVzz6se99Nz05dfk03S8zNeS46E1H2nKfHlR9ltRf9TL7zG6"
	crossorigin="anonymous">
<link
	href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
	rel="stylesheet" />
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script
	src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="js/sidebar.js"></script>

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

.btn-xs {
	padding: 2px 6px;
	font-size: 12px;
}

/* Smaller status boxes */
.status-box {
	width: 48%;
	padding: 12px;
}
</style>
<style>
#videoElement, #capturedImage {
	width: 300px;
	height: 225px;
	border: 2px solid #ccc;
	margin-bottom: 10px;
}
</style>
<!-- <script type="text/javascript">
    window.history.forward();

    // Auth Guard
    const loginStatus = sessionStorage.getItem('loginStatus');
    if (loginStatus !== 'Success') {
      logout();
    }

    function noBack() {
      window.history.forward();
    }

    function logout() {
      sessionStorage.removeItem('loginStatus');
      window.location = "newlogin.jsp";
    }
  </script> -->
<script>
	const user_id = sessionStorage.getItem('user_id');
	if (!user_id) {
		window.location.href = "newlogin.jsp";
	}
</script>
</head>

<body>
	<div id="wrapper">
	<%@ include file="ContractSidebar.jsp"%>

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
						<h1 class="h3 mb-0 text-gray-800">Contract Entry</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="ContractDashboard.jsp">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page">Contract
								Entry</li>

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
											 id="modalcontrentry">
											<i class="fas fa-plus"></i> Create
										</button>
									</div>
								</div>


<!-- 
								<div class="table-responsive p-3">
									<table class="table table-striped table-bordered table-sm"
										id="Table1" width="100%">
										<thead>
											<tr>
												<th>Slno</th>
												<th>Aadhar No</th>
												<th>Pass No</th>
												<th>Contact No</th>
												<th>Pan Card</th>

												<th>Father Name</th>
												<th>Action</th>

											</tr>
										</thead>
										<tbody>
											 Dynamic rows will be inserted here
										</tbody>
									</table>
								</div> -->
									<div class="table-responsive p-3">
									<table class="table table-striped table-bordered table-sm"
										id="Table1" width="100%">
										<thead>
											<tr>
												<th>Slno</th>
												<th>Aadhar No</th>
												<th>Pass No</th>
												<th>Old Pass No</th>
												<th>Contact No</th>
												<th>Pan Card</th>

												<th>Father Name</th>
												<th>Action</th>

											</tr>
										</thead>
										<tbody>
											<!--  Dynamic rows will be inserted here -->
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
							style="max-width: 1500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle123">
										<b>Contract Details</b>
									</h5>
									<button type="button" class="close" data-dismiss="modal"
										aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="scrapSaleOrderForm">
										<!-- Sale Order Details -->
										<div class="form-row">
											<div class="form-group col-md-3">
												<label for="aadhar"><b>Aadhar No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="aadhar" maxlength=12 placeholder="Aadhar No"
													oninput="this.value = this.value.replace(/[^0-9]/g, '')">
												<small id="adharError" style="color: red; display: none;">
													Please enter a valid 12-digit Aadhar number. </small>
											</div>




											<div class="form-group col-md-3">
												<label for="Joinee"><b>Status:</b></label> <select
													id="Joinee" class="form-control form-control-sm">
													<option value="1">New Joinee</option>
													<option value="2" hidden>Rejoinee</option>
												</select>
											</div>


											<div class="form-group col-md-3"
												style="padding-top: 2%; padding-left: 1%;">
												<button type="button" class="btn btn-sm btn-success"
													id="search">Search</button>
											</div>
										</div>


										<!-- Dynamic Fields Container (Initially Hidden) -->

										<div id="container1" style="display: none;">
											<div class="container mt-3"
												style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
												<h5 class="text-center mb-4"
													style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">
													Contract Employee Details</h5>

												<div class="form-row">
													<!-- Row 1: First Name, Last Name, Contact, Department -->
													<div class="col-md-3">
														<label for="name"><b>First Name:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="name" placeholder="Name"
															oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
														<div id="nameError" class="text-danger"
															style="display: none;">First Name is required</div>
													</div>

													<div class="col-md-3">
														<label for="last"><b>Last Name:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="last" placeholder="Last Name"
															oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
														<div id="lastError" class="text-danger"
															style="display: none;">Last Name is required</div>
													</div>

													<div class="col-md-3">
														<label for="contact_no"><b>Contact No:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="contact_no" maxlength="10" placeholder="Contact No"
															oninput="this.value = this.value.replace(/[^0-9]/g, '')">
														<div id="contact_noError" class="text-danger"
															style="display: none;">Valid Contact No is required</div>
													</div>

													<div class="col-md-3">
														<label for="department"><b>Department:</b></label> <select
															id="department" class="form-control form-control-sm">
															<option value="">Select</option>
														</select>
														<div id="departmentError" class="text-danger"
															style="display: none;">Department is required</div>
													</div>

													<!-- Row 2: Designation, DOB, Age, Gender -->
													<div class="col-md-3" style="padding-top: 2%;">
														<label for="designation"><b>Designation:</b></label> <select
															id="designation" class="form-control form-control-sm">
															<option value="">Select</option>
														</select>
														<div id="designationError" class="text-danger"
															style="display: none;">Designation is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="birth"><b>Date Of Birth:</b></label> <input
															type="date" class="form-control form-control-sm"
															id="birth" placeholder="Date Of Birth">
														<div id="birthError" class="text-danger"
															style="display: none;">Date Of Birth is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="age"><b>Age:</b></label> <input type="text"
															class="form-control form-control-sm" id="age"
															placeholder="Age" readonly>
														<div id="ageError" class="text-danger"
															style="display: none;">Age is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="gender"><b>Gender:</b></label> <select
															id="gender" class="form-control form-control-sm">
															<option value="">Select</option>
															<option value="1">Male</option>
															<option value="2">Female</option>
														</select>
														<div id="genderError" class="text-danger"
															style="display: none;">Gender is required</div>
													</div>

													<!-- Row 3: Blood, Nature, Work, Joining -->
													<div class="col-md-3" style="padding-top: 2%;">
														<label for="blood"><b>Blood Group:</b></label> <select
															id="blood" class="form-control form-control-sm">
															<option value="">Select</option>
														</select>
														<div id="bloodError" class="text-danger"
															style="display: none;">Blood Group is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="nature"><b>Types of Job:</b></label> <select
															id="nature" class="form-control form-control-sm">
															<option value="">Select</option>
														</select>
														<div id="natureError" class="text-danger"
															style="display: none;">Nature of Job is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="work"><b>Work Location:</b></label> <select
															id="work" class="form-control form-control-sm">
															<option value="">Select</option>
														</select>
														<div id="workError" class="text-danger"
															style="display: none;">Work Location is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="joining"><b>Date Of Joining:</b></label> <input
															type="date" class="form-control form-control-sm"
															id="joining" placeholder="Date Of Joining">
														<div id="joiningError" class="text-danger"
															style="display: none;">Date Of Joining is required</div>
													</div>

													<!-- Row 4: Valid Up to, Re-Entry (conditional), Services (conditional), PAN -->
													<div class="col-md-3" style="padding-top: 2%;">
														<label for="valid"><b>Valid Up to:</b></label> <input
															type="date" class="form-control form-control-sm"
															id="valid" placeholder="Valid Up to">
														<div id="validError" class="text-danger"
															style="display: none;">Valid Up to is required</div>
													</div>

													<!-- â CONDITIONAL FIELDS -->
													<div class="col-md-3" id="reEntryField"
														style="padding-top: 2%; display: none;">
														<label for="re-entry"><b>Re-Entry Date:</b></label> <input
															type="date" class="form-control form-control-sm"
															id="re-entry">
														<div id="re-entryError" class="text-danger"
															style="display: none;">Re-Entry Date is Required</div>
													</div>

													<div class="col-md-3" id="servicesField"
														style="padding-top: 2%; display: none;">
														<label for="services"><b>Total Services In
																JSSL:</b></label> <input type="text"
															class="form-control form-control-sm" id="services"
															placeholder="Total Services In JSSL">
														<div id="servicesError" class="text-danger"
															style="display: none;">Total Services In JSSL is
															required</div>
													</div>

													<!-- Row continues: PAN, UAN, PF, ESIC -->
													<div class="col-md-3" style="padding-top: 2%;">
														<label for="card"><b>PAN Card:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="card" placeholder="PAN Card" maxlength="10">
														<div id="cardError" class="text-danger"
															style="display: none;">PAN Card is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="UAN"><b>UAN No:</b></label> <input type="text"
															class="form-control form-control-sm" id="UAN"
															maxlength="12" placeholder="UAN No"
															oninput="this.value = this.value.replace(/[^0-9]/g, '')">
														<div id="UANError" class="text-danger"
															style="display: none;">UAN No is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="PF_No"><b>PF No:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="PF_No" placeholder="PF NO" maxlength="22">
														<div id="PF_NoError" class="text-danger"
															style="display: none;">PF No is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="ESIC"><b>ESIC No/WC No:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="ESIC" placeholder="ESIC No/WC No" maxlength="10">
														<div id="ESICError" class="text-danger"
															style="display: none;">ESIC No/WC No is required</div>
													</div>
												</div>


												<h5 class="text-center mb-4"
													style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline; padding-top: 3%;">Bank
													Details</h5>
												<div class="form row">
													<div class="col-md-3">
														<label for="bank"><b>Bank Name:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="bank" placeholder="Bank Name"
															oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
														<div id="bankError" class="text-danger"
															style="display: none;">Bank Name is required</div>
													</div>

													<div class="col-md-3">
														<label for="ac"><b>Bank A/C:</b></label> <input
															type="text" class="form-control form-control-sm" id="ac"
															placeholder="Bank A/C"
															oninput="this.value = this.value.replace(/[^0-9]/g, '')">
														<div id="acError" class="text-danger"
															style="display: none;">Bank A/C is required</div>
													</div>

													<div class="col-md-3">
														<label for="branch"><b>Branch:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="branch" placeholder="Branch">
														<div id="branchError" class="text-danger"
															style="display: none;">Branch is required</div>
													</div>

													<div class="col-md-3">
														<label for="IFSC"><b>IFSC:</b></label> <input type="text"
															class="form-control form-control-sm" id="IFSC"
															placeholder="IFSC">
														<div id="IFSCError" class="text-danger"
															style="display: none;">IFSC is required</div>
													</div>
												</div>
												<!-- End of single form-row -->

												<div class="table-responsive p-3">
													<div class="mt-4 text-right">
														<button type="button" class="btn btn-primary" id="btnnext">Next</button>
													</div>
												</div>
											</div>
										</div>
										<div id="container2" style="display: none;">
											<div class="container mt-3"
												style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
												<h5 class="text-center mb-4"
													style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Nominee
													Details</h5>

												<div class="form-row">
													<div class="form-group col-md-3">
														<label for="nominee"><b>Nominee Name:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="nominee" placeholder="Nominee Name"
															oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
														<!-- Error message for vehicleNo -->
														<div id="nomineeError" class="text-danger"
															style="display: none;">Nominee Name is required</div>
													</div>

													<div class="col-md-3">
														<label for="nomineedate"><b>Nominee Date of
																Birth:</b></label> <input type="date"
															class="form-control form-control-sm" id="nomineedate"
															placeholder="Nominee Date of Birth">
														<div id="nomineedateError" class="text-danger"
															style="display: none;">Nominee Date of Birth is
															required</div>
													</div>

													<div class="col-md-3">
														<label for="nomineeage"><b>Nominee Age:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="nomineeage" placeholder="Nominee Age" readonly>
														<div id="nomineeageError" class="text-danger"
															style="display: none;">Nominee Age is required</div>
													</div>

													<div class="col-md-3">
														<label for="relationship"><b>Relationship:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="relationship" placeholder="Relationship"
															oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
														<div id="relationshipError" class="text-danger"
															style="display: none;">Relationship is required</div>
													</div>


													<div class="col-md-3" style="padding-top: 1%;">
														<label for="total"><b>Total Dependants:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="total" placeholder="Total Dependants">
														<div id="totalError" class="text-danger"
															style="display: none;">Total Dependants is required</div>
													</div>
												</div>


												<div class="table-responsive p-3">
													<!-- Buttons -->
													<div class="mt-4 text-right">
														<button type="button" class="btn btn-primary"
															id="btnnext1">Next</button>
													</div>
												</div>
											</div>
										</div>

										<div id="container3" style="display: none;">
											<div class="container mt-3"
												style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
												<h5 class="text-center mb-4"
													style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Family
													Details</h5>

												<div class="form-row">
													<!-- Row 1 -->
													<div class="col-md-4">
														<label for="father"><b>Employee Father Name:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="father" placeholder="Father Name"
															oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
														<div id="fatherError" class="text-danger"
															style="display: none;">Father Name is required</div>
													</div>

													<div class="col-md-4">
														<label for="marital"><b>Employee Marital
																Status:</b></label> <select id="marital"
															class="form-control form-control-sm">
															<option value="">Select</option>
															<option value="1">Married</option>
															<option value="2">Unmarried</option>
														</select>
														<div id="maritalError" class="text-danger"
															style="display: none;">Marital status is required</div>
													</div>

													<div class="col-md-4">
														<label for="spouse"><b>Spouse Name:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="spouse" placeholder="Spouse Name"
															oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
														<div id="spouseError" class="text-danger"
															style="display: none;">Spouse Name is required</div>
													</div>
												</div>

												<div class="form-row mt-3">
													<!-- Row 2 -->
													<div class="col-md-4">
														<label for="emergency"><b>Emergency Contact
																Name:</b></label> <input type="text"
															class="form-control form-control-sm" id="emergency"
															placeholder="Emergency Contact Name"
															oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
														<div id="emergencyError" class="text-danger"
															style="display: none;">Emergency Contact Name is
															required</div>
													</div>

													<div class="col-md-4">
														<label for="relation"><b>Relation:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="relation" placeholder="Relation"
															oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
														<div id="relationError" class="text-danger"
															style="display: none;">Relation is required</div>
													</div>

													<div class="col-md-4">
														<label for="emergencyno"><b>Emergency Contact
																No:</b></label> <input type="text"
															class="form-control form-control-sm" id="emergencyno"
															maxlength="10" placeholder="Emergency Contact No"
															oninput="this.value = this.value.replace(/[^0-9]/g, '')">
														<div id="emergencynoError" class="text-danger"
															style="display: none;">Emergency Contact No is
															required</div>
													</div>
												</div>

												<div class="form-row mt-3">
													<!-- Row 3 -->
													<div class="col-md-4">
														<label for="religion"><b>Religion:</b></label> <select
															id="religion" class="form-control form-control-sm">
															<option value="">Select</option>
														</select>
														<div id="religionError" class="text-danger"
															style="display: none;">Religion is required</div>
													</div>

													<div class="col-md-4">
														<label for="education"><b>Education:</b></label> <select
															id="education" class="form-control form-control-sm">
															<option value="">Select</option>
														</select>
														<div id="educationError" class="text-danger"
															style="display: none;">Education is required</div>
													</div>


												</div>

												<div class="form-row mt-3">
													<!-- Row 4: Present Address -->
													<div class="col-md-3">
														<label for="state1"><b>Present State:</b></label> <select
															id="state1" class="form-control form-control-sm">
															<option value="">Select</option>
														</select>
														<div id="state1Error" class="text-danger"
															style="display: none;">present State is required</div>
													</div>

													<div class="col-md-3">
														<label for="district1"><b>Present District:</b></label> <select
															id="district1" class="form-control form-control-sm">
															<option value="">Select</option>
														</select>
														<div id="district1Error" class="text-danger"
															style="display: none;">present District is required</div>
													</div>

													<div class="col-md-3">
														<label for="present"><b>Present Address:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="present" placeholder="Present Address">
														<div id="presentError" class="text-danger"
															style="display: none;">Present Address is required</div>
													</div>

													<div class="col-md-3">
														<label for="code"><b>Present Pin Code:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="code" placeholder="Pin Code" maxlength="6"
															oninput="this.value = this.value.replace(/[^0-9]/g, '')"">
														<div id="codeError" class="text-danger"
															style="display: none;">present Pin Code 6 digits is
															required</div>
													</div>
												</div>

												<div class="form-row mt-3">
													<!-- Row 5: Permanent Address -->
													<div class="col-md-3">
														<label for="state"><b>Permanent State:</b></label> <select
															id="state" class="form-control form-control-sm">
															<option value="">Select</option>
														</select>
														<div id="stateError" class="text-danger"
															style="display: none;">State is required</div>
													</div>

													<div class="col-md-3">
														<label for="district"><b>Permanent District:</b></label> <select
															id="district" class="form-control form-control-sm">
															<option value="">Select</option>
														</select>
														<div id="districtError" class="text-danger"
															style="display: none;">District is required</div>
													</div>

													<div class="col-md-3">
														<label for="permanent"><b>Permanent Address:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="permanent" placeholder="Permanent Address">
														<div id="permanentError" class="text-danger"
															style="display: none;">Permanent Address is
															required</div>
													</div>

													<div class="col-md-3">
														<label for="pin"><b>Permanent Pin Code:</b></label> <input
															type="text" class="form-control form-control-sm" id="pin"
															maxlength="6" placeholder="Pin Code"
															oninput="this.value = this.value.replace(/[^0-9]/g, '')"">
														<div id="pinError" class="text-danger"
															style="display: none;">Permanent Pin Code 6 digits
															is required</div>
													</div>
												</div>
												<div class="form-row mt-3">
													<div class="col-md-3" style="padding-top: 1%;">
														<label for="upload"><b>Upload File:</b></label> <input
															type="file" class="form-control form-control-sm"
															id="adharfile" placeholder="Upload File">
														<div id="adharfileError" class="text-danger"
															style="display: none;">File is Required</div>
													</div>
													<div class="col-md-3" style="padding-top: 1%;" hidden>
														<label for="upload"><b> Medical Insurance:</b></label> <input
															type="file" class="form-control form-control-sm"
															id="medicalfile" placeholder="Upload File">
														<div id="medicalfileError" class="text-danger"
															style="display: none;">Please Upload the Medical
															Certificate</div>
													</div>
													<div class="col-md-3" style="padding-top: 1%;" hidden>
														<label for="upload"><b>Other File</b></label> <input
															type="file" class="form-control form-control-sm"
															id="otherfile" placeholder="Upload File">
														<div id="otherfileError" class="text-danger"
															style="display: none;">Please Upload the Others
															File</div>
													</div>


													<!-- â ADD after existing file upload divs in container3 -->
													<div class="form-row mt-3">
														<div class="col-md-12">
															<label><b>Capture Photo:</b></label>
														</div>

														<!-- Camera preview and captured image -->
														<div class="col-md-12 d-flex align-items-start"
															style="gap: 20px; flex-wrap: wrap;">

															<!-- Live camera feed -->
															<div>
																<video id="videoElement" autoplay playsinline
																	style="width: 300px; height: 225px; border: 2px solid #ccc; border-radius: 5px; display: none;">
																</video>
															</div>

															<!-- Captured photo -->
															<div>
																<img id="capturedImage" src="" alt="Captured Photo"
																	style="width: 300px; height: 225px; border: 2px solid #ccc; border-radius: 5px; display: none; object-fit: cover;">
															</div>
														</div>

														<!-- Camera control buttons -->
														<div class="col-md-12 mt-2"
															style="display: flex; gap: 10px;">
															<button type="button" class="btn btn-sm btn-primary"
																id="btnOpenCamera">
																<i class="fa fa-camera"></i> Open Camera
															</button>

															<button type="button" class="btn btn-sm btn-success"
																id="btnCapture" style="display: none;">
																<i class="fa fa-circle"></i> Capture
															</button>

															<button type="button" class="btn btn-sm btn-warning"
																id="btnRetake" style="display: none;">
																<i class="fa fa-redo"></i> Retake
															</button>

															<button type="button" class="btn btn-sm btn-danger"
																id="btnCloseCamera" style="display: none;">
																<i class="fa fa-times"></i> Close
															</button>
														</div>

														<!-- Error message -->
														<div class="col-md-12 mt-1">
															<div id="cameraError" class="text-danger"
																style="display: none; font-size: 13px;"></div>
															<div id="photoStatus" class="text-success"
																style="display: none; font-size: 13px;">Photo
																captured successfully</div>
														</div>
													</div>
												</div>

												<div class="table-responsive p-3 mt-4 text-right">
													<button type="button" class="btn btn-primary"
														id="createcontractGPentry">Create</button>
													<button type="button" class="btn btn-secondary"
														data-dismiss="modal">Close</button>
												</div>
											</div>
										</div>
								</div>
							</div>
						</div>
					</div>


					<div class="modal fade" id="updateConfirmModal" tabindex="-1"
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
										id="btnUpdateNo">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="btnUpdateYes">YES</button>
								</div>
							</div>
						</div>
					</div>



					<script
						src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
					<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

					<div class="modal fade" id="exampleModalScrollable12" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalScrollableTitle123"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle123">
										<b>Update Contract Details</b>
									</h5>
									<button type="button" class="close" data-dismiss="modal"
										aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="scrapSaleOrderForm">
										<div class="col-md-4" style="margin-bottom: 20px;">
											<label for="name1"><b>Adhar No:</b></label> <input
												type="text" class="form-control form-control-sm" id="adhar1"
												placeholder="adhar no">
											<div id="adhar1Error" class="text-danger"
												style="display: none;">Adhar No is required</div>
										</div>
										<hr>

										<div class="form-row">






											<!-- Row 1: First Name, Last Name, Contact, Department -->
											<div class="col-md-3">
												<label for="name1"><b>First Name:</b></label> <input
													type="text" class="form-control form-control-sm" id="name1"
													placeholder="Name">
												<div id="name1Error" class="text-danger"
													style="display: none;">First Name is required</div>
											</div>

											<div class="col-md-3">
												<label for="last1"><b>Last Name:</b></label> <input
													type="text" class="form-control form-control-sm" id="last1"
													placeholder="Last Name">
												<div id="last1Error" class="text-danger"
													style="display: none;">Last Name is required</div>
											</div>

											<div class="col-md-3">
												<label for="contact_no1"><b>Contact No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="contact_no1" placeholder="Contact No" maxlength="10"
													oninput="this.value = this.value.replace(/[^0-9]/g, '')">
												<div id="contact_no1Error" class="text-danger"
													style="display: none;">Contact No is required</div>
											</div>

											<div class="col-md-3">
												<label for="department1"><b>Department:</b></label> <select
													id="department1" class="form-control form-control-sm">
													<option value="">Select</option>
												</select>
												<div id="department1Error" class="text-danger"
													style="display: none;">Department is required</div>
											</div>

											<!-- Row 2: Designation, Status, DOB, Age -->
											<div class="col-md-3" style="padding-top: 2%;">
												<label for="designation1"><b>Designation:</b></label> <select
													id="designation1" class="form-control form-control-sm">
													<option value="">Select</option>
												</select>
												<div id="designation1Error" class="text-danger"
													style="display: none;">Designation is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="Joinee1"><b>Status:</b></label> <select
													id="Joinee1" class="form-control form-control-sm">
													<option value="1">New Joinee</option>
													<option value="2" hidden>Rejoinee</option>
												</select>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="birth1"><b>Date Of Birth:</b></label> <input
													type="date" class="form-control form-control-sm"
													id="birth1" placeholder="Date Of Birth">
												<div id="birth1Error" class="text-danger"
													style="display: none;">Date Of Birth is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="age1"><b>Age:</b></label> <input type="text"
													class="form-control form-control-sm" id="age1"
													placeholder="Age" readonly>
												<div id="age1Error" class="text-danger"
													style="display: none;">Age is required</div>
											</div>

											<!-- Row 3: Gender, Blood, Nature, Work -->
											<div class="col-md-3" style="padding-top: 2%;">
												<label for="gender1"><b>Gender:</b></label> <select
													id="gender1" class="form-control form-control-sm">
													<option value="">Select</option>
													<option value="1">Male</option>
													<option value="2">Female</option>
												</select>
												<div id="gender1Error" class="text-danger"
													style="display: none;">Gender is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="blood1"><b>Blood Group:</b></label> <select
													id="blood1" class="form-control form-control-sm">
													<option value="">Select</option>
												</select>
												<div id="blood1Error" class="text-danger"
													style="display: none;">Blood Group is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="nature1"><b>Types of Job::</b></label> <select
													id="nature1" class="form-control form-control-sm">
													<option value="">Select</option>
												</select>
												<div id="nature1Error" class="text-danger"
													style="display: none;">Nature of Job is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="work1"><b>Work Location:</b></label> <select
													id="work1" class="form-control form-control-sm">
													<option value="">Select</option>
												</select>
												<div id="work1Error" class="text-danger"
													style="display: none;">Work Location is required</div>
											</div>

											<!-- Row 4: Joining, Valid Up to, Re-Entry (conditional), Services (conditional) -->
											<div class="col-md-3" style="padding-top: 2%;">
												<label for="joining1"><b>Date Of Joining:</b></label> <input
													type="date" class="form-control form-control-sm"
													id="joining1" placeholder="Date Of Joining">
												<div id="joining1Error" class="text-danger"
													style="display: none;">Date Of Joining is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="valid1"><b>Valid Up to:</b></label> <input
													type="date" class="form-control form-control-sm"
													id="valid1" placeholder="Valid Up to">
												<div id="valid1Error" class="text-danger"
													style="display: none;">Valid Up to is required</div>
											</div>

											<!-- â CONDITIONAL FIELDS - Separate div wrapper for show/hide -->
											<div class="col-md-3" id="reEntryField1"
												style="padding-top: 2%; display: none;">
												<label for="re-entry1"><b>Re-Entry Date:</b></label> <input
													type="date" class="form-control form-control-sm"
													id="re-entry1">
												<div id="re-entry1Error" class="text-danger"
													style="display: none;">Re-Entry Date is required</div>
											</div>

											<div class="col-md-3" id="servicesField1"
												style="padding-top: 2%; display: none;">
												<label for="services1"><b>Total Services In
														JSSL:</b></label> <input type="text"
													class="form-control form-control-sm" id="services1"
													placeholder="Total Services In JSSL">
												<div id="services1Error" class="text-danger"
													style="display: none;">Total Services In JSSL is
													required</div>
											</div>

											<!-- Row continues: PAN, UAN, PF, ESIC -->
											<div class="col-md-3" style="padding-top: 2%;">
												<label for="card1"><b>PAN Card:</b></label> <input
													type="text" class="form-control form-control-sm" id="card1"
													placeholder="PAN Card" maxlength="10">
												<div id="card1Error" class="text-danger"
													style="display: none;">PAN Card is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="UAN1"><b>UAN No:</b></label> <input type="text"
													class="form-control form-control-sm" id="UAN1"
													maxlength="12" placeholder="UAN No"
													oninput="this.value = this.value.replace(/[^0-9]/g, '')">
												<div id="UAN1Error" class="text-danger"
													style="display: none;">UAN No is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="PF_No1"><b>PF No:</b></label> <input type="text"
													class="form-control form-control-sm" id="PF_No1"
													placeholder="PF NO" maxlength="22">
												<div id="PF_No1Error" class="text-danger"
													style="display: none;">PF No is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="ESIC1"><b>ESIC No/WC No:</b></label> <input
													type="text" class="form-control form-control-sm" id="ESIC1"
													placeholder="ESIC No/WC No" maxlength="10">
												<div id="ESIC1Error" class="text-danger"
													style="display: none;">ESIC No/WC No is required</div>
											</div>

											<!-- Bank Details Section -->
											<div class="col-md-3" style="padding-top: 2%;">
												<label for="bank1"><b>Bank Name:</b></label> <input
													type="text" class="form-control form-control-sm" id="bank1"
													placeholder="Bank Name">
												<div id="bank1Error" class="text-danger"
													style="display: none;">Bank Name is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="ac1"><b>Bank A/C:</b></label> <input type="text"
													class="form-control form-control-sm" id="ac1"
													placeholder="Bank A/C"
													oninput="this.value = this.value.replace(/[^0-9]/g, '')">
												<div id="ac1Error" class="text-danger"
													style="display: none;">Bank A/C is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="branch1"><b>Branch:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="branch1" placeholder="Branch">
												<div id="branch1Error" class="text-danger"
													style="display: none;">Branch is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="IFSC1"><b>IFSC:</b></label> <input type="text"
													class="form-control form-control-sm" id="IFSC1"
													placeholder="IFSC">
												<div id="IFSC1Error" class="text-danger"
													style="display: none;">IFSC is required</div>
											</div>
											<!-- Nominee Details Section -->
											<div class="col-md-3" style="padding-top: 2%;">
												<label for="nominee1"><b>Nominee Name:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="nominee1" placeholder="Nominee Name">
												<div id="nominee1Error" class="text-danger"
													style="display: none;">Nominee Name is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="nomineedate1"><b>Nominee Date of
														Birth:</b></label> <input type="date"
													class="form-control form-control-sm" id="nomineedate1"
													placeholder="Nominee Date of Birth">
												<div id="nomineedate1Error" class="text-danger"
													style="display: none;">Nominee Date of Birth is
													required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="nomineeage1"><b>Nominee Age:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="nomineeage1" placeholder="Nominee Age" readonly>
												<div id="nomineeage1Error" class="text-danger"
													style="display: none;">Nominee Age is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="relationship1"><b>Relationship:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="relationship1" placeholder="Relationship">
												<div id="relationship1Error" class="text-danger"
													style="display: none;">Relationship is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="total1"><b>Total Dependants:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="total1" placeholder="Total Dependants">
												<div id="total1Error" class="text-danger"
													style="display: none;">Total Dependants is required</div>
											</div>

											<!-- Bank Details Section -->


											<!-- Family Details Section -->
											<div class="col-md-3" style="padding-top: 2%;">
												<label for="father1"><b>Father Name:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="father1" placeholder="Father Name">
												<div id="father1Error" class="text-danger"
													style="display: none;">Father Name is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="marital1"><b>Marital Status:</b></label> <select
													id="marital1" class="form-control form-control-sm">
													<option value="">Select</option>
													<option value="1">Married</option>
													<option value="2">Unmarried</option>
												</select>
												<div id="marital1Error" class="text-danger"
													style="display: none;">Marital status is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="spouse1"><b>Spouse Name:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="spouse1" placeholder="Spouse Name">
												<div id="spouse1Error" class="text-danger"
													style="display: none;">Spouse Name is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="emergency1"><b>Emergency Contact
														Name:</b></label> <input type="text"
													class="form-control form-control-sm" id="emergency1"
													placeholder="Emergency Contact Name">
												<div id="emergency1Error" class="text-danger"
													style="display: none;">Emergency Contact Name is
													required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="relation1"><b>Relation:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="relation1" placeholder="Relation">
												<div id="relation1Error" class="text-danger"
													style="display: none;">Relation is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="emergencyno1"><b>Emergency Contact
														No:</b></label> <input type="text"
													class="form-control form-control-sm" id="emergencyno1"
													maxlength="10" placeholder="Emergency Contact No"
													oninput="this.value = this.value.replace(/[^0-9]/g, '')">
												<div id="emergencyno1Error" class="text-danger"
													style="display: none;">Emergency Contact No is
													required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="religion1"><b>Religion:</b></label> <select
													id="religion1" class="form-control form-control-sm">
													<option value="">Select</option>
												</select>
												<div id="religion1Error" class="text-danger"
													style="display: none;">Religion is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="education1"><b>Education:</b></label> <select
													id="education1" class="form-control form-control-sm">
													<option value="">Select</option>
												</select>
												<div id="education1Error" class="text-danger"
													style="display: none;">Education is required</div>
											</div>


											<!-- Address Section: Permanent -->
											<div class="col-md-3" style="padding-top: 2%;">
												<label for="state22"><b>Permanent State:</b></label> <select
													id="state22" class="form-control form-control-sm">
													<option value="">Select</option>
												</select>
												<div id="state22Error" class="text-danger"
													style="display: none;">Permanent State is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="district22"><b>Permanent District:</b></label> <select
													id="district22" class="form-control form-control-sm">
													<option value="">Select</option>
												</select>
												<div id="district22Error" class="text-danger"
													style="display: none;">Permanent District is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="permanent1"><b>Permanent Address:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="permanent1" placeholder="Permanent Address">
												<div id="permanent1Error" class="text-danger"
													style="display: none;">Permanent Address is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="pin1"><b>Permanent Pin Code:</b></label> <input
													type="text" class="form-control form-control-sm" id="pin1"
													placeholder="Pin Code" maxlength="6"
													oninput="this.value = this.value.replace(/[^0-9]/g, '')">
												<div id="pin1Error" class="text-danger"
													style="display: none;">Permanent Pin Code is required</div>
											</div>

											<!-- Address Section: Present -->
											<div class="col-md-3" style="padding-top: 2%;">
												<label for="state11"><b>Present State:</b></label> <select
													id="state11" class="form-control form-control-sm">
													<option value="">Select</option>
												</select>
												<div id="state11Error" class="text-danger"
													style="display: none;">Present State is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="district11"><b>Present District:</b></label> <select
													id="district11" class="form-control form-control-sm">
													<option value="">Select</option>
												</select>
												<div id="district11Error" class="text-danger"
													style="display: none;">Present District is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="present1"><b>Present Address:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="present1" placeholder="Present Address">
												<div id="present1Error" class="text-danger"
													style="display: none;">Present Address is required</div>
											</div>

											<div class="col-md-3" style="padding-top: 2%;">
												<label for="code1"><b>Present Pin Code:</b></label> <input
													type="text" class="form-control form-control-sm" id="code1"
													placeholder="Pin Code" maxlength="6"
													oninput="this.value = this.value.replace(/[^0-9]/g, '')">
												<div id="code1Error" class="text-danger"
													style="display: none;">Present Pin Code is required</div>
											</div>

										</div>
										<div class="form-row mt-3">
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="upload"><b>Upload Adhar File:</b></label> <input
													type="file" class="form-control form-control-sm"
													id="adharfile1" placeholder="Upload File">
												<div id="adharfile1Error" class="text-danger"
													style="display: none;">Please Upload the Adhar file</div>

												<input id="existingAdharFileLink" style="margin-top: 5px;"
													readonly></input>
											</div>
											<div class="col-md-3" style="padding-top: 1%;" hidden>
												<label for="upload"><b> Medical Insurance:</b></label> <input
													type="file" class="form-control form-control-sm"
													id="medicalfile1" placeholder="Upload File">
												<div id="medicalfile1Error" class="text-danger"
													style="display: none;"></div>

												<input id="existingmedicalFileLink" style="margin-top: 5px;"
													readonly></input>
											</div>
											<div class="col-md-3" style="padding-top: 1%;" hidden>
												<label for="upload"><b>Other File</b></label> <input
													type="file" class="form-control form-control-sm"
													id="otherfile1" placeholder="Upload File">
												<div id="otherfile1Error" class="text-danger"
													style="display: none;"></div>
												<input id="existingOthersFileLink" style="margin-top: 5px;"
													readonly></input>
											</div>
										</div>

										<!-- End form-row -->

										<div class="table-responsive p-3">
											<div class="mt-4 text-right">
												<button type="button" class="btn btn-primary"
													id="updcontractGP">Update</button>
												<button type="button" class="btn btn-secondary"
													data-dismiss="modal">Close</button>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>







					<div class="modal fade" id="exampleModalCenter310" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1">
									<!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> -->
									<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
								</div>
								<div class="modal-body">
									<b>Are you sure you want to create?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										id="confirmcontractGPno">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmcontractGPyes">YES</button>
								</div>
							</div>
						</div>
					</div>
					<div class="modal fade" id="statusConfirmModal" tabindex="-1"
						role="dialog" aria-labelledby="statusConfirmTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 50%; right: -20%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1">
									<!-- Optional header styling, no title here -->
								</div>

								<div class="modal-body">
									<b>Are you sure you want to update the status?</b>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal" id="btnStatusNo">No</button>
									<button type="button" class="btn btn-info btn-sm"
										id="btnStatusYes">Yes</button>
								</div>

							</div>
						</div>
					</div>
				<div class="modal fade" id="messageModal" tabindex="-1" role="dialog" aria-labelledby="messageTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    
    <div class="modal-content" style="width: 70%; margin: auto; border-width: thick; border-color: #eaecf4;">

      <!-- Optional empty header (for spacing like your design) -->
      <div class="modal-header1"></div>

      <!-- Body -->
      <div class="modal-body text-center">
        <b id="modalMessage">Message here</b>
      </div>

      <!-- Footer -->
      <div class="modal-footer d-flex justify-content-center border-0">
        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal" id="removeadharduplicate">
          OK
        </button>
      </div>

    </div>

  </div>
</div>
<!-- <div class="modal fade show" id="duplicateBloodModal" tabindex="-1" role="dialog" aria-labelledby="duplicateBloodTitle" aria-modal="true" style="display: block;">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content" style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

      <div class="modal-header1"></div>

      <div class="modal-body text-center">
        <b id="duplicateBloodMessage">Blood Group already exists.</b>
      </div>

      <div class="modal-footer d-flex justify-content-center">
        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
          OK
        </button>
      </div>

    </div>
  </div>
</div>
 -->

					<div class="modal fade" id="exampleModalCenterUpdate" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitleUpdate"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1">
									<!-- Optional Header -->
								</div>
								<div class="modal-body">
									<b>Are you sure you want to update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal" id="confirmUpdateNo">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmUpdateYes">YES</button>
								</div>
							</div>
						</div>
					</div>



					<!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js"></script> -->
				</div>
			</div>





		</div>
	</div>

	<a class="scroll-to-top rounded" href="#page-top"> <i
		class="fas fa-angle-up"></i>
	</a>


	<!-- Bootstrap JS and dependencies -->


	<!-- <script>
  document.getElementById("btnnext").addEventListener("click", function () {
    document.getElementById("container2").style.display = "block";
  });
</script> -->

	<!-- 	<script>
		window.onload = function() {
			fetchbloodgrp();
			fetchnatureofjob();
			fetchworkloc();
			fetchbloodgrp1();
			fetchreligon();
			fetchedu();
			fetchvacc();
		};
	</script> -->

	<script>
		document
				.getElementById("btnnext1")
				.addEventListener(
						"click",
						function() {
							document.getElementById("container3").style.display = "block";
						});
	</script>

	<script>
		document
				.getElementById("btnnext")
				.addEventListener(
						"click",
						function() {
							document.getElementById("container2").style.display = "block";
						});
	</script>
	<script>
		document.getElementById("search").addEventListener("click", function() {
			document.getElementById("container1").style.display = "block";
		});
	</script>






	<script>
		document.getElementById('birth').addEventListener('change', function() {
			const birthDate = new Date(this.value);
			const today = new Date();

			if (isNaN(birthDate)) {
				document.getElementById('birthError').style.display = 'block';
				document.getElementById('age').value = '';
				return;
			} else {
				document.getElementById('birthError').style.display = 'none';
			}

			if (birthDate > today) {
				document.getElementById('age').value = '';
				alert("Date of birth cannot be in the future.");
				return;
			}

			let years = today.getFullYear() - birthDate.getFullYear();
			let months = today.getMonth() - birthDate.getMonth();
			let days = today.getDate() - birthDate.getDate();

			if (days < 0) {
				months--;
			}

			if (months < 0) {
				years--;
				months += 12;
			}

			// Convert months into decimal (approximate: 1 month = 1/12 year)
			let decimalAge = years + (months / 12);
			// Round to one decimal place
			decimalAge = decimalAge.toFixed(1);

			document.getElementById('age').value = decimalAge;
		});
	</script>


	<script>
		document
				.getElementById('nomineedate')
				.addEventListener(
						'change',
						function() {
							const birthDate = new Date(this.value);
							const today = new Date();

							// Validate date format
							if (isNaN(birthDate)) {
								document.getElementById('nomineedateError').style.display = 'block';
								document.getElementById('nomineeage').value = '';
								return;
							} else {
								document.getElementById('nomineedateError').style.display = 'none';
							}

							// Check if birth date is in the future
							if (birthDate > today) {
								document.getElementById('nomineeage').value = '';
								alert("Nominee's date of birth cannot be in the future.");
								return;
							}

							// Calculate age
							let years = today.getFullYear()
									- birthDate.getFullYear();
							let months = today.getMonth()
									- birthDate.getMonth();
							let days = today.getDate() - birthDate.getDate();

							if (days < 0) {
								months--;
							}

							if (months < 0) {
								years--;
								months += 12;
							}

							// Convert months to decimal years
							let decimalAge = years + (months / 12);
							decimalAge = decimalAge.toFixed(1); // Round to 1 decimal

							document.getElementById('nomineeage').value = decimalAge;
						});
	</script>

	<!-- <script>
document.getElementById('joining').addEventListener('change', function () {
    const joiningDate = new Date(this.value);
    const today = new Date();

    if (isNaN(joiningDate)) {
        document.getElementById('joiningError').style.display = 'block';
        document.getElementById('services').value = '';
        return;
    } else {
        document.getElementById('joiningError').style.display = 'none';
    }

    if (joiningDate > today) {
        document.getElementById('services').value = '';
        alert("Date of joining cannot be in the future.");
        return;
    }

    let years = today.getFullYear() - joiningDate.getFullYear();
    let months = today.getMonth() - joiningDate.getMonth();
    let days = today.getDate() - joiningDate.getDate();

    if (days < 0) {
        months--;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    // Convert months to a decimal
    let serviceDuration = years + (months / 12);
    serviceDuration = serviceDuration.toFixed(1); // One decimal place

    document.getElementById('services').value = serviceDuration;
});
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
	<!-- <script src="js/ContractGP.js"></script> -->

	<script src="js/ContractGP.js?v=<%=ts%>"></script>
	<script src="js/logout.js"></script>
	<script src="js/username.js"></script>
	<script src="js/createdby.js"></script>
	<script src="js/modifiedby.js"></script>
	<script src="js/Sessionfilter.js"></script>

	<script>
		let today = new Date().toISOString().split('T')[0];
		$("#joining").attr("max", today);
		$("#joining1").attr("min", today);
		$("#birth").attr("max", today);
		$("#birth1").attr("max", today);
		$("#valid").attr("min", today);
		$("#valid1").attr("min", today);
		$("#re-entry").attr("min", today);
		$("#re-entry1").attr("min", today);
		$("#nomineedate").attr("max", today);
		$("#nomineedate1").attr("max", today);
	</script>
	<!-- Page level custom scripts -->
</body>
</html>