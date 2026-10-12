<%@page import="com.JSSL2024.property.PropertyLink"%>
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
</style>
<script type="text/javascript">
 function noBack() {
     window.history.forward();
 }
 </script>
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
		<%@ include file="InVoiceSideBar.jsp"%>
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
								id="usernameDisplay">Username</span> <!--   <span class="ml-2 d-none d-lg-inline text-white small" id="selectedFactoryId">No Factory Selected</span> -->
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
							<li class="breadcrumb-item"><a href="InvoiceDashBoard.jsp">Home</a></li>
							<li class="breadcrumb-item"><a href="InvoiceMasters.jsp">Master</a></li>
							
							<li class="breadcrumb-item active" aria-current="page">Contractor
								OR Customer</li>
						</ol>
					</div>

					<div class="container mt-5">
						<h3 class="text-center mb-4">Select Address Type</h3>

						<!-- Radio Buttons -->
						<div class="d-flex justify-content-center mb-4">
							<div class="form-check me-3">
								<input class="form-check-input" type="radio" name="addressType"
									id="invoiceRadio" value="invoice" checked> <label
									class="form-check-label" for="invoiceRadio">Invoice to
									Address</label>
							</div>
							&nbsp;&nbsp;
							<div class="form-check">
								<input class="form-check-input" type="radio" name="addressType"
									id="consigneeRadio" value="consignee"> <label
									class="form-check-label" for="consigneeRadio">Consignee
									Address</label>
							</div>
						</div>
					</div>

					<!-- Invoice to Address Table -->
					<div class="row mb-3" id="invoiceTable">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal"
									id="#modalScroll">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableID" width="100%"></table>
							</div>
						</div>
					</div>

					<!-- Consignee Address Table -->
					<div class="row mb-3" id="consigneeTable" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc;">
								<button data-toggle="modal"
									   id="#modalScroll1">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="tableID1" width="100%"></table>
							</div>
						</div>
					</div>

					<!-- Create Invoice Address -->
					<div class="modal fade" id="exampleModalScrollableIN" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalScrollableTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1000px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Invoice Address</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">
											<!-- <div class="form-group col-md-4">
												<label for="categoryPrefix"><b>Invoice Address:</b></label>
												<input type="text" class="form-control form-control-sm"
													id="categoryPrefix" placeholder="Enter Invoice Address"
													autocomplete="off">
												<div id="productCodeErrorcreditss32" class="error-message"></div>
											</div> -->
											  <!--    <div class="form-group col-md-4">
                                                 <label for="categoryPrefix"><b>Invoice Address:</b></label>
                                                 <textarea class="form-control form-control-sm" id="categoryPrefix" rows="3"
                                                   placeholder="Enter Invoice Address" autocomplete="off"></textarea>
                                                 <div id="productCodeErrorcreditss32" class="error-message"></div>
                                                 </div> -->
                                                 <div class="form-group col-md-4">
    <label><b>Name / Company:</b></label>
    <input type="text" class="form-control form-control-sm" id="nameOfAdd"
        placeholder="Enter Name or Company" autocomplete="off">
    <div id="productCodeErrorcreditssnameOfAdd" class="error-message"></div>
</div>
<div class="form-group col-md-4">
    <label><b>Address Line 1:</b></label>
    <input type="text" class="form-control form-control-sm" id="categoryPrefix"
        placeholder="Enter Address Line 1" autocomplete="off">
    <div id="productCodeErrorcreditss32" class="error-message"></div>
</div>
<div class="form-group col-md-4">
    <label><b>Address Line 2:</b></label>
    <input type="text" class="form-control form-control-sm" id="categoryPrefixLine2"
        placeholder="Enter Address Line 2 (optional)" autocomplete="off">
</div>
											<div class="form-group col-md-4">
												<label for="inputName"><b>Country:</b></label> <select
													class="form-control form-control-sm" id="con"></select>
												<div id="productCodeErrorcreditss31" class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="stateDropdown"><b>State:</b></label> <select
													class="form-control form-control-sm" id="stateDropdown"></select>
												<div id="productCodeErrorcreditss344" class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>District:</b></label><input
													type="text" class="form-control form-control-sm" id="disc"
													placeholder="Enter District"
													oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditss30" class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="inputNamebar"><b>City:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="inputNamebar" placeholder="Enter City"
													oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditss35" class="error-message"></div>
											</div>

											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>Pin No:</b></label> <input
													type="text" class="form-control form-control-sm" id="pin"
													placeholder="Enter Pin no" maxlength=6
													oninput="this.value = this.value.replace(/[^0-9]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditsspin" class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>Pan No:</b></label> <input
													type="text" class="form-control form-control-sm" id="pan"
													placeholder="Enter Pan no" maxlength=10 autocomplete="off">
												<div id="productCodeErrorcreditsspan" class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>GST No:</b></label> <input
													type="text" class="form-control form-control-sm" id="gst"
													placeholder="Enter GST no" maxlength=15 autocomplete="off">
												<div id="productCodeErrorcreditssgst" class="error-message"></div>
											</div>


										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										onclick="openModalAddInvoice();">Create</button>
								</div>

							</div>
						</div>
					</div>

					<!-- Update Invoice Address -->
					<div class="modal fade" id="exampleModalScrollableINUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1000px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Invoice Address</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">
											<!-- <div class="form-group col-md-4">
												<label for="categoryPrefix"><b>Invoice Address:</b></label>
												<input type="text" class="form-control form-control-sm"
													id="categoryPrefixup" placeholder="Enter Invoice Address"
													autocomplete="off">
												<div id="productCodeErrorcreditss32up" class="error-message"></div>
											</div> -->
											<!-- <div class="form-group col-md-4">
                                                 <label for="categoryPrefix"><b>Invoice Address:</b></label>
                                                 <textarea class="form-control form-control-sm" id="categoryPrefixup" rows="3"
                                                   placeholder="Enter Invoice Address" autocomplete="off"></textarea>
                                                 <div id="productCodeErrorcreditss32up" class="error-message"></div>
                                                 </div> -->
                                                 <div class="form-group col-md-4">
    <label><b>Name / Company:</b></label>
    <input type="text" class="form-control form-control-sm" id="nameOfAddup"
        placeholder="Enter Name or Company" autocomplete="off">
    <div id="productCodeErrorcreditssnameOfAddup" class="error-message"></div>
</div>
<div class="form-group col-md-4">
    <label><b>Address Line 1:</b></label>
    <input type="text" class="form-control form-control-sm" id="categoryPrefixup"
        placeholder="Enter Address Line 1" autocomplete="off">
    <div id="productCodeErrorcreditss32up" class="error-message"></div>
</div>
<div class="form-group col-md-4">
    <label><b>Address Line 2:</b></label>
    <input type="text" class="form-control form-control-sm" id="categoryPrefixupLine2"
        placeholder="Enter Address Line 2 (optional)" autocomplete="off">
</div>
											<div class="form-group col-md-4">
												<label for="inputName"><b>Country:</b></label> <select
													class="form-control form-control-sm" id="conup"></select>
												<div id="productCodeErrorcreditss31up" class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="stateDropdown"><b>State:</b></label> <select
													class="form-control form-control-sm" id="stateDropdownup"></select>
												<div id="productCodeErrorcreditss344up"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>District:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="discup" placeholder="Enter District"
													oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditss30up" class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="inputNamebar"><b>City:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="inputNamebarup"
													oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')"
													placeholder="Enter City" autocomplete="off">
												<div id="productCodeErrorcreditss35up" class="error-message"></div>
											</div>

											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>Pin No:</b></label> <input
													type="text" class="form-control form-control-sm" id="pinup"
													placeholder="Enterpan" maxlength=6
													oninput="this.value = this.value.replace(/[^0-9]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditsspinup"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>Pan No:</b></label> <input
													type="text" class="form-control form-control-sm" id="panup"
													placeholder="Enter Pan no" maxlength=10 autocomplete="off">
												<div id="productCodeErrorcreditsspanup"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>GST No:</b></label> <input
													type="text" class="form-control form-control-sm" id="gstup"
													placeholder="Enter GST no" maxlength=15 autocomplete="off">
												<div id="productCodeErrorcreditssgstup"
													class="error-message"></div>
											</div>

											<div class="form-group col-md-4" style="display: none;">
												<label for="orgDropdown"><b>id:</b></label> <input
													type="text" class="form-control form-control-sm" id="inid">
											</div>
										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="updatecontractcus" onclick="openModalUpdateInvoice();">Update</button>
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

								<div class="modal-body text-center">
									<b id="errorMessage"></b>
								</div>

								<div class="modal-footer justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>

							</div>
						</div>
					</div>


					<div class="modal fade" id="exampleModalCenterDupUP" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">

						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1">
									<!-- Optional header -->
								</div>

								<div class="modal-body text-center">
									<b id="errorMessageup"></b>
								</div>

								<div class="modal-footer justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>

							</div>
						</div>
					</div>
					
						<!-- Verify Invoice Address -->
					<div class="modal fade" id="exampleModalScrollableINverify"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1000px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Verify Invoice Address</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">
											<!-- <div class="form-group col-md-4">
												<label for="categoryPrefix"><b>Invoice Address:</b></label>
												<input type="text" class="form-control form-control-sm"
													id="categoryPrefixup" placeholder="Enter Invoice Address"
													autocomplete="off">
												<div id="productCodeErrorcreditss32up" class="error-message"></div>
											</div> -->
											<!-- <div class="form-group col-md-4">
                                                 <label for="categoryPrefix"><b>Invoice Address:</b></label>
                                                 <textarea class="form-control form-control-sm" id="categoryPrefixverify" rows="3"
                                                   placeholder="Enter Invoice Address" autocomplete="off"></textarea>
                                                 <div id="productCodeErrorcreditss32verify" class="error-message"></div>
                                                 </div> -->
                                                 <div class="form-group col-md-4">
    <label><b>Name / Company:</b></label>
    <input type="text" class="form-control form-control-sm" id="nameOfAddverify"
        placeholder="Enter Name or Company" autocomplete="off" readonly>
    <div id="productCodeErrorcreditssnameOfAddverify" class="error-message"></div>
</div>
<div class="form-group col-md-4">
    <label><b>Address Line 1:</b></label>
    <input type="text" class="form-control form-control-sm" id="categoryPrefixverify"
        placeholder="Enter Address Line 1" autocomplete="off" readonly>
    <div id="productCodeErrorcreditss32verify" class="error-message"></div>
</div>
<div class="form-group col-md-4">
    <label><b>Address Line 2:</b></label>
    <input type="text" class="form-control form-control-sm" id="categoryPrefixverifyLine2"
        placeholder="Address Line 2" autocomplete="off" readonly>
</div>
											<div class="form-group col-md-4">
												<label for="inputName"><b>Country:</b></label> <select
													class="form-control form-control-sm" id="converify"></select>
												<div id="productCodeErrorcreditss31verify" class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="stateDropdown"><b>State:</b></label> <select
													class="form-control form-control-sm" id="stateDropdownverify"></select>
												<div id="productCodeErrorcreditss344verify"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>District:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="discverify" placeholder="Enter District"
													oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditss30verify" class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="inputNamebar"><b>City:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="inputNamebarverify"
													oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')"
													placeholder="Enter City" autocomplete="off">
												<div id="productCodeErrorcreditss35verify" class="error-message"></div>
											</div>

											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>Pin No:</b></label> <input
													type="text" class="form-control form-control-sm" id="pinverify"
													placeholder="Enterpan" maxlength=6
													oninput="this.value = this.value.replace(/[^0-9]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditsspinverify"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>Pan No:</b></label> <input
													type="text" class="form-control form-control-sm" id="panverify"
													placeholder="Enter Pan no" maxlength=10 autocomplete="off">
												<div id="productCodeErrorcreditsspanverify"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>GST No:</b></label> <input
													type="text" class="form-control form-control-sm" id="gstverify"
													placeholder="Enter GST no" maxlength=15 autocomplete="off">
												<div id="productCodeErrorcreditssgstverify"
													class="error-message"></div>
											</div>

											<div class="form-group col-md-4" style="display: none;">
												<label for="orgDropdown"><b>id:</b></label> <input
													type="text" class="form-control form-control-sm" id="inid">
											</div>
										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="verifycontractcus" onclick="openModalverifyInvoice();">Verify</button>
								</div>

							</div>
						</div>
					</div>
					<div class="modal fade" id="exampleModalCenterDupverify" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">

						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1"></div>

								<div class="modal-body text-center">
									<b id="errorMessageverify"></b>
								</div>

								<div class="modal-footer justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>

							</div>
						</div>
					</div>

					<!--  Create Consignee Address -->
					<div class="modal fade" id="exampleModalScrollableCon"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1000px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Create Consignee Address</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form id="productForm">
										<div class="form-row">
											<!-- <div class="form-group col-md-4">
												<label for="categoryPrefix"><b>Consignee
														Address:</b></label> <input type="text"
													class="form-control form-control-sm" id="conadd"
													placeholder="Enter Consignee Address" autocomplete="off">
												<div id="productCodeErrorcreditsscon" class="error-message"></div>
											</div> -->
											<!-- <div class="form-group col-md-4">
                                                <label for="categoryPrefix"><b>Consignee Address:</b></label>
                                                <textarea class="form-control form-control-sm" id="conadd" rows="3"
                                                 placeholder="Enter Consignee Address" autocomplete="off"></textarea>
                                                <div id="productCodeErrorcreditsscon" class="error-message"></div>
                                             </div> -->
                                             <div class="form-group col-md-4">
    <label><b>Name / Company:</b></label>
    <input type="text" class="form-control form-control-sm" id="nameOfAddCon"
        placeholder="Enter Name or Company" autocomplete="off">
    <div id="productCodeErrorcreditssnameOfAddCon" class="error-message"></div>
</div>
<div class="form-group col-md-4">
    <label><b>Address Line 1:</b></label>
    <input type="text" class="form-control form-control-sm" id="conadd"
        placeholder="Enter Address Line 1" autocomplete="off">
    <div id="productCodeErrorcreditsscon" class="error-message"></div>
</div>
<div class="form-group col-md-4">
    <label><b>Address Line 2:</b></label>
    <input type="text" class="form-control form-control-sm" id="conaddLine2"
        placeholder="Enter Address Line 2 (optional)" autocomplete="off">
</div>
											<div class="form-group col-md-4">
												<label for="inputName"><b>Country:</b></label> <select
													class="form-control form-control-sm" id="concon"></select>
												<div id="productCodeErrorcreditssconcon"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="stateDropdown"><b>State:</b></label> <select
													class="form-control form-control-sm" id="state"></select>
												<div id="productCodeErrorcreditssstate"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>District:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="disctt" placeholder="Enter District"
													oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditssdist" class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="inputNamebar"><b>City:</b></label> <input
													type="text" class="form-control form-control-sm" id="city"
													placeholder="Enter City"
													oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditsscity" class="error-message"></div>
											</div>

											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>Pin No:</b></label> <input
													type="text" class="form-control form-control-sm" id="pinno"
													placeholder="Enter Pin no" maxlength=6
													oninput="this.value = this.value.replace(/[^0-9]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditsspinno"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>Pan No:</b></label> <input
													type="text" class="form-control form-control-sm" id="panno"
													placeholder="Enter Pan no" maxlength=10 autocomplete="off">
												<div id="productCodeErrorcreditsspanno"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>GST No:</b></label> <input
													type="text" class="form-control form-control-sm" id="gstno"
													placeholder="Enter GST no" maxlength=15 autocomplete="off">
												<div id="productCodeErrorcreditssgstno"
													class="error-message"></div>
											</div>


										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										onclick="openModalAddCon();">Create</button>
								</div>

							</div>
						</div>
					</div>

					<!--  Update Consignee Address -->
					<div class="modal fade" id="exampleModalScrollableConUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1000px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Consignee Address</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<div class="form-row">
											<!-- <div class="form-group col-md-4">
												<label for="categoryPrefix"><b>Consignee
														Address:</b></label> <input type="text"
													class="form-control form-control-sm" id="conaddup"
													placeholder="Enter Consignee Address" autocomplete="off">
												<div id="productCodeErrorcreditssconup"
													class="error-message"></div>
											</div> -->
											<!-- <div class="form-group col-md-4">
                                                 <label for="categoryPrefix"><b>Consignee Address:</b></label>
                                                 <textarea class="form-control form-control-sm" id="conaddup" rows="3"
                                                  placeholder="Enter Consignee Address" autocomplete="off"></textarea>
                                             <div id="productCodeErrorcreditssconup" class="error-message"></div>
                                             </div> -->
                                             <div class="form-group col-md-4">
    <label><b>Name / Company:</b></label>
    <input type="text" class="form-control form-control-sm" id="nameOfAddConup"
        placeholder="Enter Name or Company" autocomplete="off">
    <div id="productCodeErrorcreditssnameOfAddConup" class="error-message"></div>
</div>
<div class="form-group col-md-4">
    <label><b>Address Line 1:</b></label>
    <input type="text" class="form-control form-control-sm" id="conaddup"
        placeholder="Enter Address Line 1" autocomplete="off">
    <div id="productCodeErrorcreditssconup" class="error-message"></div>
</div>
<div class="form-group col-md-4">
    <label><b>Address Line 2:</b></label>
    <input type="text" class="form-control form-control-sm" id="conaddupLine2"
        placeholder="Enter Address Line 2 (optional)" autocomplete="off">
</div>
											<div class="form-group col-md-4">
												<label for="inputName"><b>Country:</b></label> <select
													class="form-control form-control-sm" id="conconup"></select>
												<div id="productCodeErrorcreditssconconup"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="stateDropdown"><b>State:</b></label> <select
													class="form-control form-control-sm" id="stateup"></select>
												<div id="productCodeErrorcreditssstateup"
													class="error-message"></div>
											</div>
												<div class="form-group col-md-4">
												<label for="orgDropdown"><b>District:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="discttup" placeholder="Enter District"
													oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditssdistup"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="inputNamebar"><b>City:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="cityup" placeholder="Enter City"
													oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditsscityup"
													class="error-message"></div>
											</div>
										
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>Pin No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="pinnoup" placeholder="Enter Pin no" maxlength=6
													oninput="this.value = this.value.replace(/[^0-9]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditsspinnoup"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>Pan No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="pannoup" placeholder="Enter Pan no" maxlength=10
													autocomplete="off">
												<div id="productCodeErrorcreditsspannoup"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>GST No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="gstnoup" placeholder="Enter GST no" maxlength=15
													autocomplete="off">
												<div id="productCodeErrorcreditssgstnoup"
													class="error-message"></div>
											</div>
											
											<div class="form-group col-md-4" style="display: none;">
												<label for="orgDropdown"><b>conid:</b></label> <input
													type="text" class="form-control form-control-sm" id="conid">

											</div>
										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										onclick="openModalAddConUP();">Update</button>
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
									<b>Are you sure you want to create?</b>
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
					<div class="modal fade" id="exampleModalCenter66con" tabindex="-1"
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
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										onclick="addeventCon()">YES</button>
								</div>
							</div>
						</div>
					</div>
					<div class="modal fade" id="exampleModalCenter66inupdate"
						tabindex="-1" role="dialog"
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
									<b>Are you sure you want to Update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										onclick="addeventINupdate()">YES</button>
								</div>
							</div>
						</div>
					</div>
					<div class="modal fade" id="exampleModalCenter66inupdatenew"
						tabindex="-1" role="dialog"
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
									<b>Invoice Already Generated Not able to Update</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>

								</div>
							</div>
						</div>
					</div>
					<div class="modal fade" id="exampleModalCenter66inupdateCOn"
						tabindex="-1" role="dialog"
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
									<b>Are you sure you want to Update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										onclick="addeventConupdate()">YES</button>
								</div>
							</div>
						</div>
					</div>
					<div class="modal fade" id="exampleModalCenter66inupdatenewCon"
						tabindex="-1" role="dialog"
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
									<b>Invoice Already Generated Not able to Update</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>

								</div>
							</div>
						</div>
					</div>
					<div class="modal fade" id="exampleModalCenterDupcon" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">

						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1">
									<!-- Optional header -->
								</div>

								<div class="modal-body text-center">
									<b id="errorMessagecon"></b>
								</div>

								<div class="modal-footer justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>

							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalCenterDupUPcon"
						tabindex="-1" role="dialog" aria-hidden="true">

						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1">
									<!-- Optional header content -->
								</div>

								<div class="modal-body text-center">
									<b id="errorMessageupcon"></b>
								</div>

								<div class="modal-footer justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>

							</div>
						</div>
					</div>

                     <div class="modal fade" id="exampleModalCenter66verify" tabindex="-1"
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
									<b>Are you sure you want to verify address?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										onclick="verifyevent()">YES</button>
								</div>
							</div>
						</div>
					</div>
					
					<div class="modal fade" id="exampleModalCenter66release" tabindex="-1"
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
									<b>Are you sure you want to release address for update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										onclick="releaseevent()">YES</button>
								</div>
							</div>
						</div>
					</div>

                         	<!--  Verify Consignee Address -->
					<div class="modal fade" id="exampleModalScrollableConUpverify"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 1000px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Verify Consignee Address</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<div class="form-row">
											<!-- <div class="form-group col-md-4">
												<label for="categoryPrefix"><b>Consignee
														Address:</b></label> <input type="text"
													class="form-control form-control-sm" id="conaddup"
													placeholder="Enter Consignee Address" autocomplete="off">
												<div id="productCodeErrorcreditssconup"
													class="error-message"></div>
											</div> -->
											<!-- <div class="form-group col-md-4">
                                                 <label for="categoryPrefix"><b>Consignee Address:</b></label>
                                                 <textarea class="form-control form-control-sm" id="conaddupverify" rows="3"
                                                  placeholder="Enter Consignee Address" autocomplete="off"></textarea>
                                             <div id="productCodeErrorcreditssconupverify" class="error-message"></div>
                                             </div> -->
                                             <div class="form-group col-md-4">
    <label><b>Name / Company:</b></label>
    <input type="text" class="form-control form-control-sm" id="nameOfAddConverify"
        placeholder="Enter Name or Company" autocomplete="off" readonly>
    <div id="productCodeErrorcreditssnameOfAddConverify" class="error-message"></div>
</div>
<div class="form-group col-md-4">
    <label><b>Address Line 1:</b></label>
    <input type="text" class="form-control form-control-sm" id="conaddupverify"
        placeholder="Enter Address Line 1" autocomplete="off" readonly>
    <div id="productCodeErrorcreditssconupverify" class="error-message"></div>
</div>
<div class="form-group col-md-4">
    <label><b>Address Line 2:</b></label>
    <input type="text" class="form-control form-control-sm" id="conaddupverifyLine2"
        placeholder="Address Line 2" autocomplete="off" readonly>
</div>
											<div class="form-group col-md-4">
												<label for="inputName"><b>Country:</b></label> <select
													class="form-control form-control-sm" id="conconupverify"></select>
												<div id="productCodeErrorcreditssconconupverify"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="stateDropdown"><b>State:</b></label> <select
													class="form-control form-control-sm" id="stateupverify"></select>
												<div id="productCodeErrorcreditssstateupverify"
													class="error-message"></div>
											</div>
												<div class="form-group col-md-4">
												<label for="orgDropdown"><b>District:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="discttupverify" placeholder="Enter District"
													oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditssdistupverify"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="inputNamebar"><b>City:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="cityupverify" placeholder="Enter City"
													oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditsscityupverify"
													class="error-message"></div>
											</div>
										
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>Pin No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="pinnoupverify" placeholder="Enter Pin no" maxlength=6
													oninput="this.value = this.value.replace(/[^0-9]/g, '')"
													autocomplete="off">
												<div id="productCodeErrorcreditsspinnoupverify"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>Pan No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="pannoupverify" placeholder="Enter Pan no" maxlength=10
													autocomplete="off">
												<div id="productCodeErrorcreditsspannoupverify"
													class="error-message"></div>
											</div>
											<div class="form-group col-md-4">
												<label for="orgDropdown"><b>GST No:</b></label> <input
													type="text" class="form-control form-control-sm"
													id="gstnoupverify" placeholder="Enter GST no" maxlength=15
													autocomplete="off">
												<div id="productCodeErrorcreditssgstnoupverify"
													class="error-message"></div>
											</div>
											
											<div class="form-group col-md-4" style="display: none;">
												<label for="orgDropdown"><b>conid:</b></label> <input
													type="text" class="form-control form-control-sm" id="conidverify">

											</div>
										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										onclick="openModalAddConUPverify();">Verify</button>
								</div>

							</div>
						</div>
					</div>
					
					<div class="modal fade" id="exampleModalCenterDupUPcon"
						tabindex="-1" role="dialog" aria-hidden="true">

						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; border-width: thick; border-color: #eaecf4;">

								<div class="modal-header1">
									<!-- Optional header content -->
								</div>

								<div class="modal-body text-center">
									<b id="errorMessageupconVerify"></b>
								</div>

								<div class="modal-footer justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">OK</button>
								</div>

							</div>
						</div>
					</div>

                     <div class="modal fade" id="exampleModalCenter66verifyy" tabindex="-1"
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
									<b>Are you sure you want to verify address?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										onclick="verifyyevent()">YES</button>
								</div>
							</div>
						</div>
					</div>
					
					<div class="modal fade" id="exampleModalCenter66releasee" tabindex="-1"
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
									<b>Are you sure you want to release address for update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										onclick="releaseeevent()">YES</button>
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
				
				<script src="js/contractorcustomer.js?v=<%=jsVersion%>"></script>
				<script src="js/logout.js?v=<%=jsVersion%>"></script>
				<script src="js/username.js?v=<%=jsVersion%>"></script>
				<script src="js/factoryid.js?v=<%=jsVersion%>"></script>
				<script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
				<script src="js/createdby.js?v=<%=jsVersion%>"></script>
				<script src="js/Sessionfilter.js?v=<%=jsVersion%>"></script>
				<script>

  window.actionElementMap = {
  };
</script>
				<script src="js/permissions.js?v=<%=jsVersion%>"></script>
				<script>
<script>
document.addEventListener("DOMContentLoaded", function () {
    const invoiceRadio = document.getElementById("invoiceRadio");
    const consigneeRadio = document.getElementById("consigneeRadio");
    const invoiceTable = document.getElementById("invoiceTable");
    const consigneeTable = document.getElementById("consigneeTable");

    function toggleTables() {
        if (invoiceRadio.checked) {
            invoiceTable.style.display = "block";
            consigneeTable.style.display = "none";
        } else {
            invoiceTable.style.display = "none";
            consigneeTable.style.display = "block";
        }
    }

    // Add event listeners to both radio buttons
    invoiceRadio.addEventListener("change", toggleTables);
    consigneeRadio.addEventListener("change", toggleTables);

    // Initial call to set correct table visibility
    toggleTables();
});
</script>

				<script>
if (selectedFactoryId) {
    fetchUserList(); // load invoice addresses by default
} else {
    console.error('No factory ID found in localStorage.');
}

// Toggle tables when radio changes
document.querySelectorAll('input[name="addressType"]').forEach(radio => {
    radio.addEventListener("change", function () {
        if (this.value === "invoice") {
            document.getElementById("invoiceTable").style.display = "block";
            document.getElementById("consigneeTable").style.display = "none";
            fetchUserList(); // refresh invoice table if needed
        } else if (this.value === "consignee") {
            document.getElementById("invoiceTable").style.display = "none";
            document.getElementById("consigneeTable").style.display = "block";
            fetchUserList11(); // load consignee addresses
        }
    });
});
</script>
</body>

</html>
