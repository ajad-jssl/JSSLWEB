
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
<link href="css/ruang-admin.min.css" rel="stylesheet" />
<link href="vendor/datatables/dataTables.bootstrap4.min.css"
	rel="stylesheet">


	<link rel="stylesheet"
	href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
<link rel="stylesheet" href="css/main.css">



<link
	href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
	rel="stylesheet" />
<script
	src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>





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
		<!-- Sidebar -->
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
						<h1 class="h3 mb-0 text-gray-800">Admin Contract Entry</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="ContractDashboard.jsp">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page">Admin
								Contract Entry</li>

						</ol>
					</div>


					<div class="row mb-3" id="vehicleentry">
						<div class="col-lg-12">
							<div class="card mb-4">
								<!-- <div
									style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
									<div
										class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
										style="background-color: #f8f9fc;">
										<button data-toggle="modal"
											data-target="#exampleModalScrollable123" id="modalScroll1">
											<i class="fas fa-plus"></i> Create
										</button>
									</div>
								</div> -->



								<div class="table-responsive p-3">
									<table class="table table-striped table-bordered table-sm"
										id="adminTable1" width="100%">
										<thead>
											<tr>
												<th>SL NO</th>
												<th>Pass No</th>
												  <th>Old Pass No</th>
												<th>Aadhar No</th>
												<th>Employee Code</th>
												<th>Employee Nmae</th>
												<th>Enter</th>
												<th>Edit</th>
												<th>validityExtended</th>
												<th>Status</th>
												<th>Delete</th>
											</tr>
										</thead>
										<tbody>
											<!-- Dynamic rows will be inserted here -->
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
										<b>Admin Contract Details</b>
									</h5>
									<button type="button" class="close" data-dismiss="modal"
										aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<!-- Sale Order Details -->
										<div class="form-row">
											<div class="form-group col-md-3">
												<label for="aadhar"><b>Aadhar No:</b></label> <input
													id="Adaadhar" class="form-control form-control-sm" readonly>

												</input>
											</div>


											<div class="form-group col-md-3">
												<label for="Joinee"><b>Status:</b></label> <select
													id="Joinee" class="form-control form-control-sm"
													disabled="disabled">
													<option value="1">New Joinee</option>
													<option value="2">Rejoinee</option>
												</select>
											</div>


										</div>




										<div id="container1" style="display: none;">
											<div class="container mt-3"
												style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
												<h5 class="text-center mb-4"
													style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Contract
													Details</h5>

												<div class="form-row">
													<div class="form-group col-md-3" id="reentry_text">
														<label for="entrydate"><b>Re-Entry Date:</b></label> <input
															type="date" class="form-control form-control-sm"
															id="entrydate" placeholder="Re-Entry Date" readonly>
														<div id="entrydateError" class="text-danger"
															style="display: none;">Re-Entry Date is required</div>
													</div>

													<div class="col-md-3">
														<label for="contact"><b>Contact No:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="contact" placeholder="Contact No" readonly>
														<div id="contactError" class="text-danger"
															style="display: none;">Contact No is required</div>
													</div>

													<div class="col-md-3">
														<label for="firstname"><b>First Name:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="firstname" placeholder="Name" readonly>
														<div id="firstnameError" class="text-danger"
															style="display: none;">Name is required</div>
													</div>

													<div class="col-md-3">
														<label for="lastname"><b>Last Name:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="lastname" placeholder="Last Name" readonly>
														<div id="lastnameError" class="text-danger"
															style="display: none;">Last Name is required</div>
													</div>

													<div class="col-md-3">
														<label for="gen"><b>Gender:</b></label> <select id="gen"
															class="form-control form-control-sm" disabled="disabled">
															<option value="1">MALE</option>
															<option value="2">FEMALE</option>
														</select>
														<div id="genError" class="text-danger"
															style="display: none;">Gender is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 1%;">
														<label for="date_birth"><b>Date Of Birth:</b></label> <input
															type="date" class="form-control form-control-sm"
															id="date_birth" placeholder="Date Of Birth" readonly>
														<div id="date_birthError" class="text-danger"
															style="display: none;">Date Of Birth is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 1%;">
														<label for="age2"><b>Age:</b></label> <input type="text"
															class="form-control form-control-sm" id="age2"
															placeholder="Age" readonly>
														<div id="age2Error" class="text-danger"
															style="display: none;">Age is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 1%;">
														<label for="blood_group"><b>Blood Group:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="blood_group" placeholder="Blood Group" readonly>
														<div id="blood_groupError" class="text-danger"
															style="display: none;">Blood Group is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 1%;">
														<label for="date_joining"><b>Date Of Joining:</b></label>
														<input type="text" class="form-control form-control-sm"
															id="date_joining" placeholder="Date Of Joining" readonly>
														<div id="date_joiningError" class="text-danger"
															style="display: none;">Date Of Joining is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="department2"><b>Department:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="department2" placeholder="Department" readonly>
														<div id="department2Error" class="text-danger"
															style="display: none;">Department is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="designation2"><b>Designation:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="designation2" placeholder="Designation" readonly>
														<div id="designation2Error" class="text-danger"
															style="display: none;">Designation is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="nature-job"><b>Nature of Job:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="nature-job" placeholder="Nature of Job" readonly>
														<div id="nature-jobError" class="text-danger"
															style="display: none;">Nature of Job is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="location"><b>Work Location:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="location" placeholder="Work Location" readonly>
														<div id="locationError" class="text-danger"
															style="display: none;">Work Location is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="PANNo"><b>PAN No:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="PANNo" placeholder="PAN No" readonly>
														<div id="PANNoError" class="text-danger"
															style="display: none;">PAN No is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="UANNo"><b>UAN No:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="UANNo" placeholder="UAN No" readonly>
														<div id="UANNoError" class="text-danger"
															style="display: none;">UAN No is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="PFNo"><b>PF No:</b></label> <input type="text"
															class="form-control form-control-sm" id="PFNo"
															placeholder="PF No" readonly>
														<div id="PFNoError" class="text-danger"
															style="display: none;">PF No is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="ESICNo"><b>ESIC No:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="ESICNo" placeholder="ESIC No" readonly>
														<div id="ESICNoError" class="text-danger"
															style="display: none;">ESIC No is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="nomineename"><b>Nominee Name:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="nomineename" placeholder="Nominee Name" readonly>
														<div id="nomineenameError" class="text-danger"
															style="display: none;">Nominee Name is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="n_relationship"><b>Nominee
																Relationship:</b></label> <input type="text"
															class="form-control form-control-sm" id="n_relationship"
															placeholder="Nominee Relationship" readonly>
														<div id="n_relationshipError" class="text-danger"
															style="display: none;">Nominee Relationship is
															required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="nominee_date"><b>Nominee Date of
																Birth:</b></label> <input type="date"
															class="form-control form-control-sm" id="nominee_date"
															placeholder="Nominee Date of Birth" readonly>
														<div id="nominee_dateError" class="text-danger"
															style="display: none;">Nominee Date of Birth is
															required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="nominee_age"><b>Nominee Age:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="nominee_age" placeholder="Nominee Age" readonly>
														<div id="nominee_ageError" class="text-danger"
															style="display: none;">Nominee Age is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="dependants"><b>Total Dependants:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="dependants" placeholder="Total Dependants" readonly>
														<div id="dependantsError" class="text-danger"
															style="display: none;">Total Dependants is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="bankname"><b>Bank Name:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="bankname" placeholder="Bank Name" readonly>
														<div id="banknameError" class="text-danger"
															style="display: none;">Bank Name is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="banka/c"><b>Bank A/C:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="banka/c" placeholder="Bank A/C" readonly>
														<div id="banka/cError" class="text-danger"
															style="display: none;">Bank A/C is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="branch2"><b>Branch:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="branch2" placeholder="Branch" readonly>
														<div id="branch2Error" class="text-danger"
															style="display: none;">Branch is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="IFSC2"><b>IFSC:</b></label> <input type="text"
															class="form-control form-control-sm" id="IFSC2"
															placeholder="IFSC" readonly>
														<div id="IFSC2Error" class="text-danger"
															style="display: none;">IFSC is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="fathername"><b>Father's Name:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="fathername" placeholder="Father's Name" readonly>
														<div id="fathernameError" class="text-danger"
															style="display: none;">Father's Name is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="maritalstatus"><b>Marital Status:</b></label>
														<input type="text" class="form-control form-control-sm"
															id="maritalstatus" placeholder="Marital Status" readonly>
														<div id="maritalstatusError" class="text-danger"
															style="display: none;">Marital Status is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="spousename"><b>Spouse Name:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="spousename" placeholder="Spouse Name" readonly>
														<div id="spousenameError" class="text-danger"
															style="display: none;">Spouse Name is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="econtactno"><b>Emergency Contact
																No:</b></label> <input type="text"
															class="form-control form-control-sm" id="econtactno"
															placeholder="Emergency Contact No" readonly>
														<div id="econtactnoError" class="text-danger"
															style="display: none;">Emergency Contact No is
															required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="econtact"><b>Emergency contact
																name:</b></label> <input type="text"
															class="form-control form-control-sm" id="econtact"
															placeholder="Emergency contact name" readonly>
														<div id="econtactError" class="text-danger"
															style="display: none;">Emergency contact name is
															required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="rela_tion1"><b>Relation:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="rela_tion1" placeholder="Relation" readonly>
														<div id="rela_tion1Error" class="text-danger"
															style="display: none;">Relation is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="education3"><b>Education:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="education3" placeholder="Education" readonly>
														<div id="education3Error" class="text-danger"
															style="display: none;">Education is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="validto"><b>Valid Up to:</b></label> <input
															type="date" class="form-control form-control-sm"
															id="validto" readonly>
														<div id="validtoError" class="text-danger"
															style="display: none;">Valid Up to is required</div>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label for="religion3"><b>Religion:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="religion3" placeholder="Religion" readonly>
														<div id="religion3Error" class="text-danger"
															style="display: none;">Religion is required</div>
													</div>



													<div class="col-md-3" style="padding-top: 2%;">
														<label><b>Permanent State:</b></label> <input type="text"
															class="form-control form-control-sm" id="pstate2"
															readonly>
													</div>
													<div class="col-md-3" style="padding-top: 2%;">
														<label><b>Permanent District:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="pdistrict2" readonly>
													</div>

													<div class="col-md-3" style="padding-top: 2%;">
														<label><b>Permanent Address:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="addpermanent" readonly>
													</div>


													<div class="col-md-3" style="padding-top: 2%;">
														<label><b>Permanent Pincode:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="ppincode2" readonly>
													</div>
													<div class="col-md-3" style="padding-top: 2%;">
														<label for="state3"><b>Present State:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="state3" placeholder="State" readonly>
														<div id="state3Error" class="text-danger"
															style="display: none;">State is required</div>
													</div>


													<div class="col-md-3" style="padding-top: 2%;">
														<label for="district2"><b>Present District:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="district2" placeholder="District" readonly>
														<div id="district2Error" class="text-danger"
															style="display: none;">District is required</div>
													</div>


													<div class="col-md-3" style="padding-top: 2%;">
														<label for="address2"><b>Present Address:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="address2" placeholder="Present Address" readonly>
														<div id="address2Error" class="text-danger"
															style="display: none;">Present Address is required</div>
													</div>



													<div class="col-md-3" style="padding-top: 2%;">
														<label for="pincode3"><b>Pincode:</b></label> <input
															type="text" class="form-control form-control-sm"
															id="pincode3" placeholder="Pincode" readonly>
														<div id="pincode3Error" class="text-danger"
															style="display: none;">Pincode is required</div>
													</div>


													<div class="table-responsive p-3">
														<!-- Buttons -->
														<div class="mt-4 text-right">
															<button type="button" class="btn btn-primary"
																id="btnnext">Next</button>
														</div>
													</div>

												</div>
											</div>


											<div id=container2 style="display: none;">
												<div class="container mt-3"
													style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
													<h5 class="text-center mb-4"
														style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Admin
														Contract Details</h5>

													<div class="form-row">
														<div class="form-group col-md-3">
															<label for="ID"><b>Employee ID:</b></label> <input
																type="text" class="form-control form-control-sm" id="ID"
																placeholder="Employee ID">
															<!-- Error message for vehicleNo -->
															<div id="IDError" class="text-danger"
																style="display: none;">ID is required</div>
														</div>

														<div class="col-md-3">
															<label for="company"><b>Company:</b></label> <select
																id="company" class="form-control form-control-sm">
																<option value="">Select</option>
															</select>
															<div id="companyError" class="text-danger"
																style="display: none;">Company is required</div>
														</div>

														<div class="col-md-3">
															<label for="medical"><b>Pre Employment
																	Medical Check up:</b></label> <select id="medical"
																class="form-control form-control-sm">
																<option value="">Select</option>
															</select>
															<div id="medicalError" class="text-danger"
																style="display: none;">Pre Employment Medical
																Check up is required</div>
														</div>

														<div class="col-md-3">
															<label for="bus"><b>Bus:</b></label> <select id="bus"
																class="form-control form-control-sm">
																<option value="">Select</option>
															</select>
															<div id="busError" class="text-danger"
																style="display: none;">Bus is required</div>
														</div>



														<div class="col-md-3" style="padding-top: 1%;">
															<label for="remarks"><b>Remarks:</b></label> <input
																type="text" class="form-control form-control-sm"
																id="remarks" placeholder="Remarks">
															<div id="remarksError" class="text-danger"
																style="display: none;">Remarks is required</div>
														</div>

													</div>




												</div>

												<div class="table-responsive p-3">
													<!-- Buttons -->
													<div class="mt-4 text-right">
														<button type="button" class="btn btn-primary"
															id="btnsubmit">Create</button>
														<button type="button" class="btn btn-secondary"
															data-dismiss="modal">Close</button>
													</div>
												</div>

											</div>
										</div>
								</div>

							</div>
						</div>
					</div>



					<div class="modal fade" id="exampleModalScrollableadmin12"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle123"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle123">
										<b>Update Admin Contract Details</b>
									</h5>
									<button type="button" class="close" data-dismiss="modal"
										aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="scrapSaleOrderForm">

										<div class="form-row">
											<div class="form-group col-md-3">
												<label for="aadhar"><b>Aadhar No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="aadhar1" placeholder="Aadhar No" readonly>
											</div>

											<div class="form-group col-md-3">
												<label for="Joinee"><b>Status:</b></label> <select
													id="Joinee1" class="form-control form-control-sm"
													disabled="disabled">
													<option value="1">New Joinee</option>
													<option value="2">Rejoinee</option>
												</select>
											</div>


										</div>

<div class="container mt-3"
												style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">

										<!--  <div id=container3 style="display: none;"> -->
										<div class="form-row">

											<!-- Re-entry (hidden by default) -->
											<div class="form-group col-md-3" id="updatereentrydiv"
												style="display: none;">
												<label for="entrydate1"><b>Re-Entry Date:</b></label> <input
													type="date" class="form-control form-control-sm"
													id="entrydate1" readonly>
											</div>

											<div class="col-md-3">
												<label for="contact1"><b>Contact No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="contact1" readonly>
											</div>
											<div class="col-md-3">
												<label for="firstname1"><b>First Name:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="firstname1" readonly>
											</div>
											<div class="col-md-3">
												<label for="lastname1"><b>Last Name:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="lastname1" readonly>
											</div>

											<div class="col-md-3" style="padding-top: 1%;">
												<label for="gen1"><b>Gender:</b></label> <select id="gen1"
													class="form-control form-control-sm" disabled>
													<option value="1">MALE</option>
													<option value="2">FEMALE</option>
												</select>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="date_birth1"><b>Date Of Birth:</b></label> <input
													type="date" class="form-control form-control-sm"
													id="date_birth1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="age21"><b>Age:</b></label> <input type="text"
													class="form-control form-control-sm" id="age21" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="blood_group1"><b>Blood Group:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="blood_group1" readonly>
											</div>

											<div class="col-md-3" style="padding-top: 1%;">
												<label for="date_joining1"><b>Date Of Joining:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="date_joining1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="department21"><b>Department:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="department21" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="designation21"><b>Designation:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="designation21" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="nature-job1"><b>Nature of Job:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="nature-job1" readonly>
											</div>

											<div class="col-md-3" style="padding-top: 1%;">
												<label for="location1"><b>Work Location:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="location1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="PANNo1"><b>PAN No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="PANNo1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="UANNo1"><b>UAN No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="UANNo1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="PFNo1"><b>PF No:</b></label> <input type="text"
													class="form-control form-control-sm" id="PFNo1" readonly>
											</div>

											<div class="col-md-3" style="padding-top: 1%;">
												<label for="ESICNo1"><b>ESIC No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="ESICNo1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="nomineename1"><b>Nominee Name:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="nomineename1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="n_relationship1"><b>Nominee
														Relationship:</b></label> <input type="text"
													class="form-control form-control-sm" id="n_relationship1"
													readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="nominee_date1"><b>Nominee Date of
														Birth:</b></label> <input type="date"
													class="form-control form-control-sm" id="nominee_date1"
													readonly>
											</div>

											<div class="col-md-3" style="padding-top: 1%;">
												<label for="nominee_age1"><b>Nominee Age:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="nominee_age1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="dependants1"><b>Total Dependants:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="dependants1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="bankname1"><b>Bank Name:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="bankname1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="banka/c1"><b>Bank A/C:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="banka/c1" readonly>
											</div>

											<div class="col-md-3" style="padding-top: 1%;">
												<label for="branch21"><b>Branch:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="branch21" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="IFSC21"><b>IFSC:</b></label> <input type="text"
													class="form-control form-control-sm" id="IFSC21" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="fathername1"><b>Father's Name:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="fathername1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="maritalstatus1"><b>Marital Status:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="maritalstatus1" readonly>
											</div>

											<div class="col-md-3" style="padding-top: 1%;">
												<label for="spousename1"><b>Spouse Name:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="spousename1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="econtactno1"><b>Emergency Contact
														No:</b></label> <input type="text"
													class="form-control form-control-sm" id="econtactno1"
													readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="econtact1"><b>Emergency Contact
														Name:</b></label> <input type="text"
													class="form-control form-control-sm" id="econtact1"
													readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="rela_tion11"><b>Relation:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="rela_tion11" readonly>
											</div>

											<div class="col-md-3" style="padding-top: 1%;">
												<label for="education31"><b>Education:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="education31" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="religion31"><b>Religion:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="religion31" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="validto1"><b>Valid Up to:</b></label> <input
													type="date" class="form-control form-control-sm"
													id="validto1" readonly>
											</div>

											<!-- Permanent Address -->
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="pstate21"><b>Permanent State:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="pstate21" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="pdistrict21"><b>Permanent District:</b></label>
												<input type="text" class="form-control form-control-sm"
													id="pdistrict21" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="addpermanent1"><b>Permanent Address:</b></label>
												<input type="text" class="form-control form-control-sm"
													id="addpermanent1" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="ppincode21"><b>Permanent Pincode:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="ppincode21" readonly>
											</div>

											<!-- Present Address -->
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="state31"><b>Present State:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="state31" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="district21"><b>Present District:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="district21" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="address21"><b>Present Address:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="address21" readonly>
											</div>
											<div class="col-md-3" style="padding-top: 1%;">
												<label for="pincode31"><b>Present Pincode:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="pincode31" readonly>
											</div>
</div>
											<!-- ── Divider: Admin editable fields ── -->


											<div class="container mt-3"
												style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">



												<h5
													style="font-weight: bold; text-transform: uppercase; color: black; text-decoration: underline;"
													class="text-center">Admin Contract Details</h5>
<div class='row'>

												<div class="form-group col-md-3">
													<label for="ID1"><b>Employee ID:</b></label> <input
														type="text" class="form-control form-control-sm" id="ID1"
														placeholder="Employee ID">
													<div id="ID1Error" class="text-danger"
														style="display: none;">ID is required</div>
												</div>
												<div class="col-md-3">
													<label for="company1"><b>Company:</b></label> <select
														id="company1" class="form-control form-control-sm">
														<option value="">Select Company</option>
													</select>
													<div id="company1Error" class="text-danger"
														style="display: none;">Company is required</div>
												</div>
												<div class="col-md-3">
													<label for="medical1"><b>Pre Employment Medical
															Check up:</b></label> <select id="medical1"
														class="form-control form-control-sm">
														<option value="">Select</option>
													</select>
													<div id="medical1Error" class="text-danger"
														style="display: none;">Medical Check up is required</div>
												</div>
												<div class="col-md-3">
													<label for="bus1"><b>Bus:</b></label> <select id="bus1"
														class="form-control form-control-sm">
														<option value="">Select</option>
													</select>
													<div id="bus1Error" class="text-danger"
														style="display: none;">Bus is required</div>
												</div>
												<div class="col-md-3" style="padding-top: 1%;">
													<label for="remarks1"><b>Remarks:</b></label> <input
														type="text" class="form-control form-control-sm"
														id="remarks1" placeholder="Remarks">
													<div id="remarks1Error" class="text-danger"
														style="display: none;">Remarks is required</div>
												</div>
												</div>
											</div>
										</div>




										<div class="table-responsive p-3">
											<!-- Buttons -->
											<div class="mt-4 text-right">
												<button type="button" class="btn btn-primary"
													id="btnsubmitup">Update</button>
												<button type="button" class="btn btn-secondary"
													data-dismiss="modal">Close</button>
											</div>
										</div>
								</div>
							</div>

						</div>
					</div>
				</div>




			</div>

			</form>


		</div>
	</div>
	</div>
	</div>
	<div class="modal fade" id="exampleModalCenter322" tabindex="-1"
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
						data-dismiss="modal">NO</button>
					<button type="button" class="btn btn-info btn-sm"
						id="confirmassetentryyes">YES</button>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="statusConfirmModal" tabindex="-1"
		role="dialog" aria-labelledby="statusConfirmTitle" aria-hidden="true">
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
					<button type="button" class="btn btn-info btn-sm" id="btnStatusYes">Yes</button>
				</div>

			</div>
		</div>
	</div>

	<div class="modal fade" id="statusDescModal" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content"
				style="width: 60%; right: -20%; border-width: thick; border-color: #eaecf4;">

				<div class="modal-header">
					<h5 class="modal-title">Enter Description</h5>
					<button type="button" class="close" data-dismiss="modal">&times;</button>
				</div>

				<div class="modal-body">
					<div class="form-group">
						<label><b>Description</b></label>
						<textarea id="statusDesc" class="form-control" rows="3"></textarea>
						<small id="statusDescError" class="text-danger"
							style="display: none;"> Description is required </small>
					</div>
				</div>

				<div class="modal-footer">
					<button class="btn btn-secondary btn-sm" data-dismiss="modal">No</button>
					<button class="btn btn-info btn-sm" id="confirmDeactivate">Yes</button>
				</div>

			</div>
		</div>
	</div>

	<div class="modal fade" id="statusReenterModal" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content"
				style="width: 60%; right: -20%; border-width: thick; border-color: #eaecf4;">

				<div class="modal-header">
					<h5 class="modal-title">Re-Entry Details</h5>
					<button type="button" class="close" data-dismiss="modal">&times;</button>
				</div>

				<div class="modal-body">

					<div class="form-group">
						<label><b>Re-Enter Date</b></label> <input type="date"
							id="reEnterDate" class="form-control"> <small
							id="reEnterDateError" class="text-danger" style="display: none;">
							Date is required </small>
					</div>

					<div class="form-group">
						<label><b>Description</b></label>
						<textarea id="reEnterDesc" class="form-control" rows="3"></textarea>
						<small id="reEnterDescError" class="text-danger"
							style="display: none;"> Description is required </small>
					</div>

				</div>

				<div class="modal-footer">
					<button class="btn btn-secondary btn-sm" data-dismiss="modal">No</button>
					<button class="btn btn-info btn-sm" id="confirmActivate">Yes</button>
				</div>

			</div>
		</div>
	</div>



	<div class="modal fade" id="statusValiddateModal" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content"
				style="width: 60%; right: -20%; border-width: thick; border-color: #eaecf4;">

				<div class="modal-header">
					<h5 class="modal-title">Validity Extends</h5>
					<button type="button" class="close" data-dismiss="modal">&times;</button>
				</div>

				<div class="modal-body">

					<div class="form-group">
						<label><b>Valid Upto</b></label> <input type="date"
							id="validDate" class="form-control"> <small
							id="validDateError" class="text-danger" style="display: none;">
							Date is required </small>
					</div>

				

				</div>

				<div class="modal-footer">
					<button class="btn btn-secondary btn-sm" data-dismiss="modal">No</button>
					<button class="btn btn-info btn-sm" id="confirmextendvalidity">Yes</button>
				</div>

			</div>
		</div>
	</div>

	<div class="modal fade" id="exampleModalCenterUpdate" tabindex="-1"
		role="dialog" aria-labelledby="exampleModalCenterUpdateTitle"
		aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 54%; border: thick solid #eaecf4;">
				<div class="modal-header">
					<!-- optional title -->
				</div>
				<div class="modal-body">
					<b>Are you sure you want to update?</b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">NO</button>

					<button type="button" class="btn btn-info btn-sm"
						id="confirmassetentryupdateyes">YES</button>
				</div>
			</div>
		</div>
	</div>


	<div class="modal fade" id="exampleModalvalidateCenterUpdate" tabindex="-1"
		role="dialog" aria-labelledby="exampleModalCenterUpdateTitle"
		aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 54%; border: thick solid #eaecf4;">
				<div class="modal-header">
					<!-- optional title -->
				</div>
				<div class="modal-body">
					<b>Are you sure  want to Extend Validity?</b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">NO</button>

					<button type="button" class="btn btn-info btn-sm"
						id="confirmassetentryvalidateyes">YES</button>
				</div>
			</div>
		</div>
	</div>


<!-- Delete Remarks Modal -->
<div class="modal fade" id="deleteRemarksModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content"
            style="width: 80%; right: -20%; border-width: thick; border-color: #eaecf4;">

            <div class="modal-header">
                <h5 class="modal-title">Delete Contract Gate Pass</h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">

                <div class="form-group">
                    <label><b>Remarks</b></label>
                    <textarea id="deleteRemarks" class="form-control" rows="3"
                        placeholder="Enter remarks for deletion"></textarea>
                    <small id="deleteRemarksError" class="text-danger" style="display: none;">
                        Remarks are required
                    </small>
                </div>

            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary btn-sm" data-dismiss="modal">No</button>
                <button class="btn btn-info btn-sm" id="confirmDeleteRemarks">Yes</button>
            </div>

        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal fade" id="exampleModalDeleteCenterUpdate" tabindex="-1"
    role="dialog" aria-labelledby="exampleModalDeleteCenterUpdateTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content"
            style="width: 54%; border: thick solid #eaecf4;">
            <div class="modal-header">
                <!-- optional title -->
            </div>
            <div class="modal-body">
                <b>Are you sure you want to Delete?</b>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm"
                    data-dismiss="modal">NO</button>

                <button type="button" class="btn btn-info btn-sm"
                    id="confirmassetentrydeleteyes">YES</button>
            </div>
        </div>
    </div>
</div>

	<a class="scroll-to-top rounded" href="#page-top"> <i
		class="fas fa-angle-up"></i>
	</a>


	<!-- Bootstrap JS and dependencies -->


	<script>
		document
				.getElementById("btnnext")
				.addEventListener(
						"click",
						function() {
							document.getElementById("container2").style.display = "block";
						});

		let today = new Date().toISOString().split('T')[0];
		$("#reEnterDate").attr("max", today);
		$("#validDate").attr("min", today);
	</script>


	

<script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
	<script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
	


	<script src="vendor/datatables/jquery.dataTables.min.js"></script>
	<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
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
	<!--  <script src="js/ContractGP.js"></script>-->
	<!-- <script src="js/AdminGP.js"></script> -->
    <script src="js/AdminGP.js?v=<%=ver(application, "/js/AdminGP.js")%>"></script>
	<script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
	<script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
	<script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
	
	<script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
	<script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
	<script src="js/factoryid.js?v=<%=ver(application, "/js/factoryid.js")%>"></script>
	<script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
   	  <script>

  window.actionElementMap = {
  };
</script>
  <script src="js/permissions.js?v=<%=ver(application, "/js/permissions.js")%>"></script>

</body>
</html>