<%@page import="com.JSSL2024.property.PropertyLink"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
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
<script src="js/user.js"></script>
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

.is-invalid {
	border-color: red;
	font-size: 0.875rem;
	color: red;
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

#loadingSpinner {
	width: 50px;
	height: 50px;
	position: fixed; /* overlay in the center */
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 9999;
}

.circular {
	animation: rotate 2s linear infinite;
	height: 100%;
	width: 100%;
}

.path {
	stroke: #4285f4;
	stroke-linecap: round;
	animation: dash 1.5s ease-in-out infinite;
}

@
keyframes rotate { 100% {
	transform: rotate(360deg);
}

}
@
keyframes dash { 0% {
	stroke-dasharray: 1, 150;
	stroke-dashoffset: 0;
}

50




%
{
stroke-dasharray




:




90
,
150


;
stroke-dashoffset




:




-35


;
}
100




%
{
stroke-dasharray




:




90
,
150


;
stroke-dashoffset




:




-124


;
}
}
.modal-disabled {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.6);
	z-index: 1051; /* slightly above modal content */
}
#tableID td i {
    display: inline-block;
    vertical-align: middle;
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
<script type="text/javascript">
 function noBack() {
     window.history.forward();
 }
 </script>
</head>

<body onload="fetchUserList();">
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

				<!-- Topbar -->
				<!-- Container Fluid-->
				<div class="container-fluid" id="container-wrapper">
					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800">User List</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="Dashboard.jsp">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page">User</li>

						</ol>
					</div>
					<div class="row mb-3">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc; margin-top: -9px; margin-left: -15px;">
								<button data-toggle="modal"
								id="#modalScroll">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<table class="table table-striped table-bordered table-sm"
								id="tableID" width="100%">
								<thead>
									<tr>
										<th>User Name</th>
										<th>Department</th>

										<th style="display: none;">Id</th>
<th>First Name</th>
<th>Last Name</th>
										<th>Actions</th>
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
		</div>

		<!-- Add event -->
		<div class="modal fade" id="exampleModalScrollable" tabindex="-1"
			role="dialog" aria-labelledby="exampleModalScrollableTitle"
			aria-hidden="true">
			<div class="modal-dialog modal-dialog-scrollable"
				style="max-width: 800px;" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalScrollableTitle">
							<b>Create User Details</b>
						</h5>
						<button type="button" class="close white-button"
							data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form id="productForm">
							<div class="form-row">
								<!-- First Row: Username and Password -->
								<div class="form-group col-md-4">
									<label for="username"><b>User Name:</b></label> <input
										type="text" class="form-control form-control-sm" id="username"
										placeholder="Enter User Name" autocomplete="new-password">

									<div id="usernameError" class="error-message"
										style="display: none;">Please enter User Name</div>

								</div>
								<div class="form-group col-md-4">
									<label for="password"><b>Password:</b></label>

									<div style="position: relative;">
										<input type="password" id="password"
											class="form-control form-control-sm"
											placeholder="Enter Password" style="padding-right: 40px;"
											autocomplete="new-password" />

										<!-- Eye Button -->
										<span onclick="togglePassword()"
											style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #6c757d;">
											<i id="eyeIcon" class="fa fa-eye"></i>
										</span>
									</div>

									<div id="passwordError" class="error-message"
										style="display: none;">Please enter Password</div>
								</div>
								<div class="form-group col-md-4">
									<label for="email"><b>Email:</b></label> <input type="email"
										class="form-control form-control-sm" id="email"
										placeholder="Enter Email" required>


									<div id="emailError" class="error-message"
										style="display: none;">Please enter Email</div>
								</div>
							</div>

							<div class="form-row">

								<!--First Name  -->
								<div class="form-group col-md-4">
									<label for="first_name"><b>First Name:</b></label> <input
										type="text" class="form-control form-control-sm"
										id="first_name" placeholder="Enter First Name" required>


									<div id="first_nameError" class="error-message"
										style="display: none;">Please Enter First Name</div>
								</div>

								<div class="form-group col-md-4">
									<label for="last_name"><b>Last Name:</b></label> <input
										type="text" class="form-control form-control-sm"
										id="last_name" placeholder="Enter Last Name" required>


									<div id="last_nameError" class="error-message"
										style="display: none;">Please Enter Last Name</div>
								</div>



								<!-- Second Row: Mobile Number and Email -->
								<div class="form-group col-md-4">
									<label for="mobile_number"><b>Mobile Number:</b></label> <input
										type="text" class="form-control form-control-sm"
										id="mobile_number" placeholder="Enter Mobile Number" required
										maxlength=10
										oninput="this.value = this.value.replace(/[^0-9]/g, '')">


									<div id="mobileNumberError" class="error-message"
										style="display: none;">Please enter Mobile Number</div>
								</div>

							</div>

							<!-- Hidden Fields -->
							<div class="form-row">

								<div class="form-group col-md-4">
									<label for="department"><b>Department:</b></label> <select
										class="form-control form-control-sm" id="department" required></select>



									<div id="departmentError" class="error-message"
										style="display: none;">Please select Department</div>
								</div>

								<div class="form-group col-md-4">
									<label for="Report_to"><b>Report To:</b></label> <select
										class="form-control form-control-sm" id="Report_to" required>
										<option value="">Select Report_to</option>
									</select>



									<div id="Report_toError" class="error-message"
										style="display: none;">Please select Reporting To</div>
								</div>
								<div class="form-group col-md-4">
									<label for="location"><b>Location:</b></label> <select
										class="form-control form-control-sm" id="location" required></select>



									<div id="locationError" class="error-message"
										style="display: none;">Please select Location</div>
								</div>

								<div class="form-group col-md-4">
									<label for="factory"><b>Factory:</b></label> <select
										class="form-control form-control-sm" id="factory" required></select>
									<div id="factoryError" class="error-message"
										style="display: none;">Please select Factory</div>
								</div>

								<div class="form-group col-md-6" style="display: none;">
									<label for="userid"><b>User ID:</b></label> <input type="text"
										class="form-control form-control-sm" id="userid"
										placeholder="Enter User ID">
								</div>
								<!-- 				       <div class="form-group col-md-6">
  <label for="role1"><b>Role:</b></label>
  <select class="form-control form-control-sm" id="role1">
    <option value="" disabled selected>Select Role</option>
   
    Add more roles as needed
  </select>
</div> -->
							</div>
						</form>

					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-sm btn-secondary mr-2"
							data-dismiss="modal">Close</button>
						<button type="button" class="btn btn-sm btn-warning"
							id="resetButton" onclick="reserCreatForm()">Reset</button>
						<button type="button" class="btn btn-sm btn-primary"
							onclick="openModalAdd();">Create</button>
					</div>
				</div>
			</div>
		</div>



		<div class="modal fade" id="statusModal" tabindex="-1">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content"
					style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

					<div class="modal-header">
						<h5 class="modal-title">Enter Remarks</h5>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<div class="modal-body">

						<!-- Hidden Fields -->
						<input type="hidden" id="statusUserId"> <input
							type="hidden" id="statusAction">

						<!-- Remarks Field -->
						<div class="form-group">
							<label for="statusRemarks"><b>Remarks</b></label>
							<textarea id="statusRemarks" class="form-control" rows="3"
								placeholder="Enter remarks here..." required></textarea>
							<small id="remarksError" class="text-danger"
								style="display: none;"> Remarks is required </small>
						</div>

					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>

						<button type="button" class="btn btn-info btn-sm"
							onclick="SubmitRemark()">YES</button>
					</div>

				</div>
			</div>
		</div>






		<div class="modal fade" id="deleteModal" tabindex="-1">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content"
					style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

					<div class="modal-header">
						<h5 class="modal-title">Enter Delete Remarks</h5>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<div class="modal-body">

						<!-- Hidden Fields -->
						<input type="hidden" id="deleteUserId">
						<!--  <input type="hidden" id="statusAction"> -->

						<!-- Remarks Field -->
						<div class="form-group">
							<label for="deleteRemarks"><b>Delete Remarks</b></label>
							<textarea id="deleteRemarks" class="form-control" rows="3"
								placeholder="Enter remarks here..." required></textarea>
							<small id="deleteremarksError" class="text-danger"
								style="display: none;"> Remarks is required </small>
						</div>

					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>

						<button type="button" class="btn btn-info btn-sm"
							onclick="SubmitDeleteRemark()">YES</button>
					</div>

				</div>
			</div>
		</div>



		<div class="modal fade" id="confirmStatus" tabindex="-1" role="dialog"
			aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
						<b>Are you sure you want to Update the User Status</b>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>
						<button type="button" class="btn btn-info btn-sm"
							onclick="addStatus()">YES</button>
					</div>
				</div>
			</div>
		</div>




		<div class="modal fade" id="confirmDelete" tabindex="-1" role="dialog"
			aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content"
					style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
					<div class="modal-header1"></div>
					<div class="modal-body">
						<b>Are you sure you want to Delete User </b>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>
						<button type="button" class="btn btn-info btn-sm"
							onclick="deleteUser()">YES</button>
					</div>
				</div>
			</div>
		</div>


		<div class="modal fade" id="exampleModalCenter66" tabindex="-1"
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
						<b>Are you sure you want to create user?</b>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>
						<button type="button" class="btn btn-info btn-sm"
							onclick="addevent()">YES</button>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="validationModal" tabindex="-1"
			role="dialog" aria-labelledby="validationModalTitle"
			aria-hidden="true">

			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content"
					style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

					<div class="modal-header1"></div>

					<div class="modal-body text-center">
						<b id="validationMessage">Validation message here</b>
					</div>

					<div class="modal-footer d-flex justify-content-center">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">OK</button>
					</div>

				</div>
			</div>
		</div>



		<div id="loadingSpinner" style="display: none;">
			<svg class="circular" viewBox="25 25 50 50">
    <circle class="path" cx="50" cy="50" r="20" fill="none"
					stroke-width="2" stroke-miterlimit="10" />
  </svg>
		</div>



		<!-- 
<div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 400px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Invoice Details</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
      <div class="form-group col-md-10">
        <label for="inputName11"><b>:</b></label>
        <input type="text" class="form-control form-control-sm"  id="inputName11" placeholder="Enter ">
        <div id="productCodeErrorcredit" class="error-message"></div>
      </div>
      </div>
      <div class="form-row">
      <div class="form-group col-md-10">
        <label for="inputName11"><b>:</b></label>
        <input type="text" class="form-control form-control-sm"  id="inputName11" placeholder="Enter ">
        <div id="productCodeErrorcredit" class="error-message"></div>
      </div>
      </div>
      <div class="form-row">
      <div class="form-group col-md-10">
        <label for="inputName11"><b>:</b></label>
        <input type="text" class="form-control form-control-sm"  id="inputName11" placeholder="Enter ">
        <div id="productCodeErrorcredit" class="error-message"></div>
      </div>
      </div>
      </form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-warning" id="resetButton">Reset</button>
    <button type="button" class="btn btn-sm btn-success" onclick="openModalAdd();">Create</button>
</div>

              </div>
            </div>
          </div> -->



		<!-- view gst -->
		<div class="modal fade" id="exampleModalScrollableedit" tabindex="-1"
			role="dialog" aria-labelledby="exampleModalScrollableTitle"
			aria-hidden="true">
			<div class="modal-dialog modal-dialog-scrollable"
				style="max-width: 1000px;" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalScrollableTitle">
							<b>Update User Details</b>
						</h5>
						<button type="button" class="close white-button"
							data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form id="productForm12">
							<div class="form-row">
								<div class="form-group col-md-4">
									<label for="UsernameUp"><b>User Name:</b></label> <input
										type="text" class="form-control form-control-sm"
										id="UsernameUp" placeholder="Enter User Name" readonly="readonly">
									<div id="usernameUpError" class="error-message"
										style="display: none;">Please enter User Name</div>

								</div>
								<div class="form-group col-md-4">
									<label for="password1"><b>Password:</b></label>

									<div style="position: relative;">
										<input type="password" class="form-control form-control-sm"
											id="password1" placeholder="Leave blank to keep old password"
											autocomplete="new-password" style="padding-right: 40px;">

										<!-- Eye Button -->
										<span onclick="togglePasswordUpdate()"
											style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #6c757d;">
											<i id="eyeIconUpdate" class="fa fa-eye"></i>
										</span>
									</div>

									<div id="password1Error" class="error-message"
										style="display: none;"></div>
								</div>
								<div class="form-group col-md-4">
									<label for="email1"><b>Email:</b></label> <input type="email"
										class="form-control form-control-sm" id="email1"
										placeholder="Enter Email">
									<div id="email1Error" class="error-message"
										style="display: none;">Please enter Email</div>
								</div>



							</div>


							<div class="form-row">





								<div class="form-group col-md-4">
									<label for="first_nameUp"><b>First Name:</b></label> <input
										type="text" class="form-control form-control-sm"
										id="first_nameUp" placeholder="Enter First Name" required>


									<div id="first_nameUpError" class="error-message"
										style="display: none;">Please Enter First Name</div>
								</div>

								<div class="form-group col-md-4">
									<label for="last_nameUp"><b>Last Name:</b></label> <input
										type="text" class="form-control form-control-sm"
										id="last_nameUp" placeholder="Enter Last Name" required>


									<div id="last_nameUpError" class="error-message"
										style="display: none;">Please Enter last Name</div>
								</div>

								<div class="form-group col-md-4">
									<label for="mobile_number1"><b>Mobile Number:</b></label> <input
										type="text" class="form-control form-control-sm"
										id="mobile_number1" placeholder="Enter Mobile Number" required
										maxlength=10
										oninput="this.value = this.value.replace(/[^0-9]/g, '')">
									<div id="mobile_number1Error" class="error-message"
										style="display: none;">Please enter Mobile Number</div>
								</div>



							</div>

							<div class="form-row">


								<div class="form-group col-md-4">
									<label for="department1"><b>Department:</b></label> <select
										class="form-control form-control-sm" id="department1"></select>
									<div id="department1Error" class="error-message"
										style="display: none;">Please Select Department</div>
								</div>


								<div class="form-group col-md-4">
									<label for="Report_toUp"><b>Report To:</b></label> <select
										class="form-control form-control-sm" id="Report_toUp" required>
										<option value="">Select Report_to</option>
									</select>



									<div id="Report_toUpError" class="error-message"
										style="display: none;">Please select Reporting To</div>
								</div>
								<div class="form-group col-md-4">
									<label for="locationUp"><b>Location:</b></label> <select
										class="form-control form-control-sm" id="locationUp" required></select>



									<div id="locationUpError" class="error-message"
										style="display: none;">Please select Location</div>
								</div>

								<div class="form-group col-md-4">
									<label for="factoryup"><b>Factory:</b></label> <select
										class="form-control form-control-sm" id="factoryup" required></select>
									<div id="factoryupError" class="error-message"
										style="display: none;">Please select Factory</div>
								</div>


								<div class="form-group col-md-4" style="display: none;">
									<label for="vagid1"><b>User ID:</b></label> <input type="text"
										class="form-control form-control-sm" id="vagid1"
										placeholder="Enter User ID">
								</div>
							</div>


						</form>

					</div>


					<div class="modal-footer">
						<button type="button" class="btn btn-sm btn-secondary mr-2"
							data-dismiss="modal">Close</button>
						<button type="button" class="btn btn-sm btn-warning"
							onclick="resetForm()">Reset</button>
						<button type="button" class="btn btn-sm btn-primary"
							onclick="openModalupdate();">Update</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- end update agency -->
	<div class="modal fade" id="exampleModalCenterupdate" tabindex="-1"
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
					<b>Are You Sure You Want To Update?</b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">NO</button>
					<button type="button" class="btn btn-info btn-sm"
						onclick="confirmUpdate()">YES</button>
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
	<script src="js/config.js"></script>
	<script src="js/logout.js"></script>
	<script src="js/username.js"></script>
	<script src="js/user.js?v=<%=ts%>"></script>
	<script src="js/createdby.js"></script>
	<script src="js/Sessionfilter.js"></script>
	   	  <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
  <script src="js/permissions.js"></script>
	<!-- Page level custom scripts -->
	<script>
//Reset logic for the form when the close button is clicked
  $('.close').on('click', function () {
      // Reset the form fields
      $('#productForm')[0].reset();

      // Hide all error messages
      $('#usernameError').hide();
      $('#passwordError').hide();
      $('#mobileNumberError').hide();
      $('#emailError').hide();

      // Optionally, remove any additional invalid classes or custom styling
      $('#productForm input').removeClass('is-invalid');
  });

  </script>
	<!--   <script>
// Track user activity and logout after 2 minutes (120000 ms)
let inactivityTime = function () {
    let timeout;

    // Reset timer on any user activity
    function resetTimer() {
        clearTimeout(timeout);
        timeout = setTimeout(triggerLogout, 900000); // 15 minutes
    }

    // Event listener for activity
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;
    document.onclick = resetTimer;
    document.onscroll = resetTimer;

    function triggerLogout() {
        // Create a dummy event to pass to logoutUser
        let dummyEvent = new Event('logout');
        logoutUser(dummyEvent);
    }
};

inactivityTime();

function logoutUser(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }

    var user_id = sessionStorage.getItem('user_id'); 
    if (!user_id) {
        alert("User ID not found. Please login first.");
        return;
    }

    if (typeof baseUrl === 'undefined' || !baseUrl) {
        console.error("baseUrl is not defined or is empty.");
        return;
    }

    const url = baseUrl.endsWith('/') ? baseUrl + 'jssl/user/userlogout' : baseUrl + '/jssl/user/userlogout';

    $.ajax({
        url: url,
        type: 'POST',
    	xhrFields: {
		    withCredentials: true
		},
        data: $.param({ user_id: user_id }),
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        cache: false,
        success: function(data) {
            console.log("Server response:", data);
            
            if (data.status === "yes" && data.message === "Logout Success") {
                sessionStorage.removeItem("user_id");
                sessionStorage.removeItem("username");
                sessionStorage.removeItem("isLoggedIn");
                localStorage.removeItem("selectedFactoryId");
                window.location = "newlogin.jsp";
            } else {
                console.error("Logout failed.");
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX error:", error);
            console.error("Response text:", xhr.responseText);
            alert("Error: " + (xhr.responseText || "An error occurred."));
        }
    });
}
</script> -->



	<script src="js/urlrestrictAccessScript.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
</body>
</html>