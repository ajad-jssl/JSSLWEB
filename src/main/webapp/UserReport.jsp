<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
  response.setHeader("Pragma", "no-cache"); // HTTP 1.0
  response.setDateHeader("Expires", 0); // Proxies
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Assign Permissions</title>
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link href="img/logo/download.png" rel="icon">
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet"
	type="text/css">
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css">
	  <link href="css/masterpage.css" rel="stylesheet">
<link href="css/ruang-admin.min.css" rel="stylesheet">
<link rel="stylesheet" href="css/main.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    
   
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>

<script type="text/javascript">
 function noBack() {
     window.history.forward();
 }
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
	margin-bottom: 20px;
}

.container-report {
	border: 2px solid black;
	border-radius: 10px;
	padding: 20px;
	background-color: white;
	max-width: 95vw;
	margin: auto;
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


.table-wrapper {
	width: 100%;
	max-width: 100%;
	height: 600px; /* Ã¢ÂÂ FIXED HEIGHT */
	overflow-y: auto; /* Ã¢ÂÂ Vertical scroll */
	overflow-x: auto; /* Ã¢ÂÂ Horizontal scroll */
	border: 1px solid #000;
}


.dynamicdesign {
	table-layout: fixed; /* Ã¢ÂÂ Prevent column stretching */
	width: 100%;
}


.dynamicdesign th, .dynamicdesign td {
	min-width: 120px;
	max-width: 180px;
	white-space: normal;
	word-wrap: break-word; /* Ã¢ÂÂ Prevent line break */
	overflow: hidden;
	text-overflow: ellipsis; /* ... if long text */
}


.dynamicdesign thead th {
	position: sticky;
	top: 0;
	background: #f1f1f1;
	z-index: 2;
}

body {
	color: black !important;
}

</style>

<style>

.report-container {
	font-family: Arial, sans-serif;
	font-size: 13px;
	background: #fff;
	padding: 25px;
	width: 90%;
	max-width: 900px; /* better for A4 */
	margin: auto;
	border: 1px solid #000;
}

.header {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	margin-bottom: 25px;
}

.header img {
	height: 60px;
	position: absolute;
	left: 0;
}

.header h4 {
	font-weight: bold;
	text-decoration: underline;
	margin: 0;
}

.user-info {
	margin: 15px 40px;
	display: flex;
	justify-content: space-around;
	font-size: 16px;
}

.user-info div {
	width: 33%;
}

.report-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 13px;
	margin: 0; /* remove auto margin � wrapper handles it */
}

.report-table th {
	border: 1px solid #000;
	background: #f2f2f2;
	padding: 8px;
	text-align: center;
}

.report-table td {
	border: 1px solid #000;
	padding: 8px;
	vertical-align: top;
}

.mod {
	font-weight: bold;
	background: #fafafa;
	text-align: center;
}

.pg {
	padding-left: 10px;
}

.perm {
	text-align: center;
}

.footer {
	margin-top: 40px;
	display: flex;
	justify-content: space-between;
	font-size: 12px;
}

.sig-block {
	text-align: center;
	width: 200px;
}

.sig-line {
	border-top: 1px solid #000;
	margin-top: 40px;
}

@media print {
	body {
		margin: 0;
	}
}

.footer {
	width: 100%;
	margin-top: 100px;
}

.footer-table {
	width: 100%;
	border: none;
}

.footer-table td {
	text-align: center;
	vertical-align: bottom;
	padding-top: 50px;
}

.sig-line {
	border-top: 1px solid #000;
	margin-top: 40px;
}


/* =========================
   HISTORY TABLE SCROLL
========================= */

.history-table-wrapper {
    max-height: 500px;
    overflow-y: auto;
    overflow-x: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
}

/* Keep table width proper */
#Table_1 {
    width: max-content;
    min-width: 100%;
    border-collapse: collapse;
}

/* Sticky Header */
#Table_1 thead th {
    position: sticky;
    top: 0;
    background: #f2f2f2;
    z-index: 10;
    white-space: nowrap;
}

/* Prevent text breaking */
#Table_1 th,
#Table_1 td {
    white-space: nowrap;
    vertical-align: middle;
    text-align: center;
    padding: 8px;
    font-size: 13px;
}

/* Export button styling */
.export-btn-wrapper {
    margin-top: 15px;
    text-align: right;
}
</style>


</head>

<body>
	<div id="wrapper">
		<!-- Sidebar -->
		<%@ include file="useraccess_sidebar.jsp"%>

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
							class="nav-link dropdown-toggle" href="#" role="button"
							data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<i class="fas fa-user text-white mr-2"></i> <span
								class="ml-2 d-none d-lg-inline text-white small"
								id="usernameDisplay">Username</span>
						</a>
							<div
								class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
								aria-labelledby="userDropdown">
								<a class="dropdown-item" onclick="logoutUser(event)"> <i
									class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
									Logout
								</a>
							</div></li>
					</ul>
				</nav>

				<div class="container-fluid" id="container-wrapper">
					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800">User Report</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="GPMSDashboard.jsp">Home</a></li>
							<li class="breadcrumb-item"><a href="ItemsDeuReport.jsp">SubContract
									Report</a></li>

						</ol>
					</div>


					<div class="container mt-5">
						<!-- Radio Buttons -->
						<div class="d-flex justify-content-center mb-4">
							<div class="nav nav-tabs" id="gpmsTabs" role="tablist">

								<a class="nav-item nav-link active" id="accessTab"
									href="javascript:void(0)"> <b>User Access Report</b>
								</a> <a class="nav-item nav-link" id="historyTab"
									href="javascript:void(0)"> <b>User History Report</b>
								</a>

							</div>
						</div>
					</div>










					<!-- Modal Body -->
					<div id="container1" style="display: block;">
						<div class="modal-body">
							<div class="row mb-5">

								<!-- CENTER HEADING -->


								<!-- CONTRACT DROPDOWN -->
								<div class="col-md-2">
									<label for="contractSelect" class="form-label"><b>Users:</b></label>
									<select class="form-control form-control-sm" id="UserId">
										<option value="">Select</option>
									</select>
								</div>
									<div class="col-md-2">
											<label for="Daterep"><b> Date:</b></label> <input
												type="date" class="form-control form-control-sm"
												id="Daterep">
										</div>

								<!-- LOT DROPDOWN -->


								<!-- PRINT BUTTON -->
								<div class="col-md-2">
									<div style="margin-top: 30px;">
										<button onclick="PrintDivContent('deliveryChallanContainer')"
											id="buttonprint">Print</button>
									</div>
								</div>

							</div>

							<div id="deliveryChallanContainer"
								style="display: block; font-family: Arial, sans-serif; font-size: 14px; background-color: #fff; padding: 30px; width: 95%; max-width: 1500px; margin: auto; border: 1px solid #000; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

								<!-- HEADER -->

								<div id="printSection">
									<div class="report-container">

										<!-- HEADER -->
										<div class="header">
											<img src="img/logo/download.png">
											<h4>User Access Report</h4>
										</div>

										<!-- USER INFO -->
										<div class="user-info" style="margin-top: 20px;">
											<div>
												<strong>Name:</strong><span id="username"></span>
											</div>
											<div  hidden>
												<strong>Department:</strong> <span id="department"></span>
											</div>
											<div hidden>
												<strong>Status:</strong><span id="status"></span>
											</div>
											<div >
												<strong>Date:</strong><span id="DateReport"></span>
											</div>
										</div>

										<!-- TABLE + FOOTER WRAPPER â keeps footer glued to table -->
										<div style="width: 90%; margin: 20px auto;">

											<!-- TABLE -->
											<table class="report-table"
												style="border: 2px solid #000; width: 100%; margin: 0;">
												<thead>
													<tr>
														<th style="width: 25%;">Module</th>
														<th style="width: 35%;">Pages</th>
														<th style="width: 40%;">Permissions</th>
													</tr>
												</thead>
												<tbody>
													<!-- dynamic rows go here -->
												</tbody>
											</table>

											<!-- FOOTER â directly below table, same width -->
											<table
												style="width: 100%; border-collapse: collapse; border: 2px solid #000; border-top: none; margin: 0;">
												<tr>
													<td
														style="width: 50%; padding: 40px 20px 12px; text-align: center; border-right: 1px solid #000; font-size: 12px; font-weight: 600;">
														<div
															style="border-top: 1px solid #000; padding-top: 6px; margin-top: 30px;">Dept
															HOD Signature</div>
													</td>
													<td
														style="width: 50%; padding: 40px 20px 12px; text-align: center; font-size: 12px; font-weight: 600;">
														<div
															style="border-top: 1px solid #000; padding-top: 6px; margin-top: 30px;">IT
															Head Signature</div>
													</td>
												</tr>
											</table>

										</div>

									</div>
								</div>



							</div>
						</div>
					</div>

					<div id="historyContainer" style="display: none;">

						<div id="container4" style="">
							<div class="modal-body">
								<form>


									
									<div class="form-row align-items-end mb-3" id="#subcontainer4">
										<!-- Report Type Dropdown -->

	                          <div class="form-group col-md-3">
											<label for="contractSelect" class="form-label"><b>Users:</b></label>
											<select class="form-control form-control-sm" id="UserIdhis">
												<option value="">Select</option>
											</select>
										</div>
										<!-- Start Date -->
										<div class="form-group col-md-3">
											<label for="fromDate"><b>Start Date:</b></label> <input
												type="date" class="form-control form-control-sm"
												id="fromDate">
										</div>

									
										<!-- End Date -->
										<div class="form-group col-md-3">
											<label for="toDate"><b>End Date:</b></label> <input
												type="date" class="form-control form-control-sm" id="toDate">
										</div>



										<!-- Fetch Button -->
										<div class="form-group col-md-2">
											<button id="fetchReportBtn" type="button"
												class="btn btn-primary btn-sm w-100"
												onclick="fetchHistoryReport()">Fetch Report</button>
										</div>
									</div>

									<!--  ALLOCATION HISTORY TABLE -->
									<div class="container container-report mt-4"
										id="allocationHistoryContainer" style="display: block;">
										<h5 class="text-center report-header">User History Report</h5>
										<div class="form-row dynamic-row">
											<div class="table-responsive history-table-wrapper">
												<table class="table table-bordered table-sm " id="Table_1">
													<thead>
														<tr style="color:black;">
															<th>SL.No</th>
															<th>User Id</th>
															<th>Email</th>
															<th>First Name</th>
															<th>Last Name</th>
															<th>Department</th>
															<th>Location</th>
															<th>Report To</th>
															<th>Status</th>
															<th>Locked/Unlock</th>
															<th>Is Deleted</th>
															<th>Factory</th>
															<th>Module</th>
															<th>PageName</th>
															<th>ChangedAction</th>
															<th>Action</th>
															<th>Action_Status</th>
															<th>Performed_By</th>
															<th>Transcation_Date</th>
															<th>Remarks</th>
														</tr>
													</thead>
													<tbody style="color:black;"></tbody>
												</table>
											</div>
										</div>
									<div class="export-btn-wrapper">
    <button type="button"
        class="btn btn-success btn-sm"
        onclick="exportToExcelHistroy()">
        Export to Excel
    </button>
</div>
									</div>



								</form>
							</div>
						</div>

					</div>








					<!-- Modal Body -->

				</div>

			</div>

		</div>
	</div>


	<!-- Scroll to Top -->
	<a class="scroll-to-top rounded" href="#page-top"> <i
		class="fas fa-angle-up"></i>
	</a>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
	<!-- Scripts -->
	<script src="js/config.js"></script>
	<script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
	<script src="js/ruang-admin.min.js"></script>
	<script src="js/username.js"></script>
	<script src="js/logout.js"></script>
	<!-- <script src="js/assignPermissions.js"></script> -->
	<script src="js/Sessionfilter.js"></script>
	<script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
	<script src="js/permissions.js"></script>
	<script src="js/UserReport.js">
  
 
  
  </script>
	<script>



	  document.addEventListener("DOMContentLoaded", function () {
		  let today = new Date().toISOString().split('T')[0];
		  
		  
		  $("#Daterep").val(today);
		  
		  
		  
	      const accessTab = document.getElementById("accessTab");
	      const historyTab = document.getElementById("historyTab");

	      const accessContainer = document.getElementById("container1");
	      const historyContainer = document.getElementById("historyContainer");

	      // ==============================
	      // USER ACCESS TAB
	      // ==============================
	      accessTab.addEventListener("click", function () {

	          accessContainer.style.display = "block";
	          historyContainer.style.display = "none";

	          accessTab.classList.add("active");
	          historyTab.classList.remove("active");

	      });

	      // ==============================
	      // USER HISTORY TAB
	      // ==============================
	      historyTab.addEventListener("click", function () {

	          accessContainer.style.display = "none";
	          historyContainer.style.display = "block";

	          historyTab.classList.add("active");
	          accessTab.classList.remove("active");

	      });

	  });


  </script>


</body>
</html>