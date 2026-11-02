<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%
response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
response.setHeader("Pragma", "no-cache");
response.setDateHeader("Expires", 0);
%>

<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<link href="img/logo/download.png" rel="icon">
<title>Lead Entry</title>

<!-- Bootstrap -->
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css">

<!-- Bootstrap Icons -->
<link
	href="externalLibrary/cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.5.0/font/bootstrap-icons.min.css"
	rel="stylesheet">

<!-- Font Awesome -->
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet"
	type="text/css">

<!-- Ruang Admin -->
<link href="css/ruang-admin.min.css" rel="stylesheet">

<!-- Main CSS -->
<link rel="stylesheet" href="css/main.css">

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

.small-input {
	width: 120px; /* Adjust width as needed */
	height: 30px; /* Adjust height as needed */
	padding: 2px;
	font-size: 12px;
}

.small-label {
	font-size: 15px;
	display: block;
	margin-bottom: 2px;
}

.small-input1 {
	width: 215px; /* Adjust width as needed */
	height: 30px; /* Adjust height as needed */
	padding: 2px;
	font-size: 12px;
}

.small-label1 {
	font-size: 15px;
	display: block;
	margin-bottom: 2px;
}

.pdf-loader {
	position: fixed;
	inset: 0;
	background: rgba(255, 255, 255, 0.65);
	backdrop-filter: blur(3px);
	display: none;
	align-items: center;
	justify-content: center;
	z-index: 999999;
	animation: fadeIn 0.2s ease-out;
}

.loader-card {
	background: #ffffff;
	padding: 28px 36px;
	border-radius: 14px;
	box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
	text-align: center;
	font-family: "Segoe UI", Arial, sans-serif;
	min-width: 220px;
}

.spinner {
	width: 200px;
	height: 200px;
	border: 10px solid #e5e5e5;
	border-top: 10px solid #111;
	border-radius: 50%;
	animation: spin 0.7s linear infinite;
	margin: 0 auto 14px auto;
}

.loader-text {
	font-size: 14px;
	color: #333;
	font-weight: 500;
	letter-spacing: 0.3px;
}

/* animated dots */
.dots::after {
	content: "";
	animation: dots 1.5s steps(4, end) infinite;
}

@
keyframes dots { 0% {
	content: "";
}

25






%
{
content:".";
}
50%
{
content:"..";
}
75






%
{
content






:






"...";
}
}
@
keyframes spin {to { transform:rotate(360deg);
	
}

}
@
keyframes fadeIn {from { opacity:0;
	
}

to {
	opacity: 1;
}

}

/* ===== ENQUIRY MODAL — MODERN DESIGN ===== */
.enquiry-modal-content {
	border-radius: 14px;
	border: none;
	overflow: hidden;
	box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.enquiry-modal-header {
	background: linear-gradient(135deg, #37499A 0%, #4a5cc4 100%);
	padding: 20px 28px;
	border-bottom: none;
	height: auto;
}

.enquiry-modal-header .modal-title {
	color: #ffffff;
	font-size: 18px;
	font-weight: 600;
}

.enquiry-subtitle {
	color: #dbe1f7;
	font-size: 12.5px;
	margin-top: 2px;
}

.enquiry-modal-body {
	background-color: #fafbfe;
	padding: 26px 28px;
}

.enquiry-field {
	margin-bottom: 14px;
}

.enquiry-field label {
	font-size: 12.5px;
	font-weight: 600;
	color: #4b5563;
	margin-bottom: 6px;
	display: flex;
	align-items: center;
}

.enquiry-icon {
	color: #37499A;
	margin-right: 6px;
	font-size: 12px;
	width: 14px;
}

.enquiry-input {
	border: 1px solid #e2e5ec;
	border-radius: 8px;
	background-color: #ffffff;
	font-size: 13px;
	padding: 8px 12px;
	height: auto;
	transition: all 0.15s ease-in-out;
	box-shadow: none;
}

.enquiry-input:focus {
	border-color: #37499A;
	box-shadow: 0 0 0 3px rgba(55, 73, 154, 0.12);
	outline: none;
}

.enquiry-readonly {
	background-color: #f3f4f6 !important;
	color: #6b7280;
	cursor: not-allowed;
}

textarea.enquiry-input {
	resize: none;
}

.enquiry-modal-footer {
	background-color: #ffffff;
	border-top: 1px solid #eef0f5;
	padding: 16px 28px;
}

.enquiry-btn-secondary {
	background-color: #ff3f3f;
	color: #f9f9f9;
	border: 1px solid #e5e7eb;
	border-radius: 7px;
	padding: 7px 20px;
	font-weight: 500;
}

.enquiry-btn-secondary:hover {
	background-color: #ff3f3f;
	color: #f9f9f9;
}

.enquiry-btn-primary {
	background: #098709;
	color: #ffffff;
	border: none;
	border-radius: 7px;
	padding: 7px 22px;
	font-weight: 500;
	box-shadow: 0 4px 10px rgba(55, 73, 154, 0.25);
}

.enquiry-btn-primary:hover {
	background: #098709;
	color: #ffffff;
}

/* Responsive: stack to 2 columns on tablets, 1 column on phones */
@media ( max-width : 991px) {
	.enquiry-field.col-md-4, .enquiry-field.col-md-3 {
		flex: 0 0 50%;
		max-width: 50%;
	}
}

@media ( max-width : 575px) {
	.enquiry-field.col-md-4, .enquiry-field.col-md-3 {
		flex: 0 0 100%;
		max-width: 100%;
	}
	.enquiry-modal-body {
		padding: 18px;
	}
	.enquiry-modal-header {
		padding: 16px 18px;
	}
}

.required {
	color: red;
	font-weight: bold;
}

@
keyframes dots { 0% {
	content: "";
}

25


%
{
content


:


".";
}
50


%
{
content


:


"..";
}
75


%
{
content


:


"...";
}
}
@
keyframes spin {to { transform:rotate(360deg);
	
}

}
@
keyframes fadeIn {from { opacity:0;
	
}

to {
	opacity: 1;
}

}

/* ===== SHARED MODAL (Create + Update) ===== */
.enquiry-field label {
	align-items: flex-start;
	line-height: 1.3;
}

.enquiry-icon {
	margin-top: 2px;
	flex-shrink: 0;
}

.enquiry-input {
	width: 100%;
	min-height: 36px;
}

select.enquiry-input {
	padding-right: 24px;
}

.enquiry-modal-header .close {
	opacity: 1;
	text-shadow: none;
}

.enquiry-modal-footer .btn {
	min-width: 90px;
}

/* ===== MOBILE ===== */
@media ( max-width : 575px) {
	.modal-dialog {
		margin: 8px;
		max-width: calc(100% - 16px) !important;
	}
	.enquiry-modal-header .modal-title {
		font-size: 16px;
	}
	.enquiry-subtitle {
		font-size: 11.5px;
	}
	.enquiry-field {
		margin-bottom: 10px;
	}
	.enquiry-field label {
		font-size: 12px;
		margin-bottom: 4px;
	}
	/* 16px stops iOS from zooming in when a field is focused */
	.enquiry-input {
		font-size: 16px;
		padding: 8px 10px;
	}
	.enquiry-modal-footer {
		padding: 12px 16px;
	}
	.enquiry-modal-footer .btn {
		flex: 1;
		font-size: 14px;
		padding: 8px 10px;
	}
	#exampleModalActivity .table {
		font-size: 12px;
	}
}

@media ( min-width : 576px) and (max-width: 991px) {
	.enquiry-input {
		font-size: 14px;
	}
}



.enquiry-field.has-error .enquiry-input {
	border-color: #dc3545;

	box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.12);
}

.field-error-msg {
	color: #dc3545;
	font-size: 11.5px;
	margin-top: 4px;
	line-height: 1.3;
}

#exampleModalActivity .table th,
#exampleModalActivity .table td {
	vertical-align: middle;
	font-size: 12.5px;
}

#exampleModalActivity .table th {
	white-space: nowrap;
}

#exampleModalActivity .table td:last-child {
	white-space: nowrap;
}
</style>
</head>

<body id="page-top">
	<div id="wrapper">

		<!-- Sidebar -->
		<%@ include file="SaleSidebar.jsp"%>

		<!-- Content Wrapper -->
		<div id="content-wrapper" class="d-flex flex-column">
			<div id="content">

				<!-- Topbar -->
				<nav
					class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top"
					style="background-color: #37499A;">
					<button id="sidebarToggleTop"
						class="btn btn-link rounded-circle mr-3">
						<i class="fa fa-bars text-white"></i>
					</button>
					<ul class="navbar-nav ml-auto">
						<button class="btn btn-link"
							onclick="window.location.href='Landingpage.jsp'"
							style="background: transparent; border: none; color: white;">
							<i class="fa fa-home"></i>
						</button>
						<div class="topbar-divider d-none d-sm-block"></div>
						<li class="nav-item dropdown no-arrow"><a
							class="nav-link dropdown-toggle" href="#" id="userDropdown"
							role="button" data-toggle="dropdown"> <i
								class="fas fa-user text-white mr-2"></i> <span
								class="d-none d-lg-inline text-white small" id="usernameDisplay">Username</span>
						</a>
							<div
								class="dropdown-menu dropdown-menu-right shadow animated--grow-in">
								<a class="dropdown-item" href="#" onclick="logoutUser(event)">
									<i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
									Logout
								</a>
							</div></li>
					</ul>
				</nav>
				
					<div
					class="d-sm-flex align-items-center justify-content-between mb-4">
					<h1 class="h3 mb-0 text-gray-800">CRM Lead Entry</h1>
					<ol class="breadcrumb">
						<li class="breadcrumb-item"><a href="SaleDashBoard.jsp">Home</a></li>
						<li class="breadcrumb-item active" aria-current="page">Lead
							Entry</li>

					</ol>
				</div>

				<div class="row mb-3">
					<div class="col-lg-12">
						<div class="card mb-4">
							<div
								style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
								<div
									class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
									style="background-color: #f8f9fc;">
									<button data-toggle="modal" id="modalScroll1">
										<i class="fas fa-plus"></i> Create
									</button>
								</div>
							</div>


							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="LeadTableID" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Lead No</th>
											<th>Project Name</th>
											<th>Client Name</th>
											<th>Stage</th>
											<th>Edit</th>
											<th>Follow-up</th>
										</tr>
									</thead>
									<tbody id="LeadTableBody">
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="modal fade" id="exampleModalScrollable" tabindex="-1"
					role="dialog" aria-labelledby="exampleModalScrollableTitle123"
					aria-hidden="true">
					<div
						class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
						style="max-width: 900px;" role="document">
						<div class="modal-content enquiry-modal-content">

							<!-- Header -->
							<div class="modal-header enquiry-modal-header">
								<div>
									<h5 class="modal-title mb-0"
										id="exampleModalScrollableTitle123">Lead Entry</h5>
									<p class="enquiry-subtitle mb-0 ">Fill in the details below
										to log a new Lead</p>

								</div>
								<button type="button" class="close text-white"
									data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>

							<!-- Body -->
							<div class="modal-body enquiry-modal-body">
								<div class="form-row">

									<div class="form-group col-md-4 enquiry-field" hidden="hidden">
										<label><i class="fas fa-hashtag enquiry-icon"></i> Enq
											No</label> <input type="text" id="enqNo"
											class="form-control form-control-sm enquiry-input enquiry-readonly"
											readonly placeholder="ENQ-1001">
									</div>

									<!-- Client Name -->

									<div class="form-group col-md-4 enquiry-field">
										<label> <i class="fas fa-user-check enquiry-icon"></i>
											Client Name <span class="text-danger">*</span>
										</label> <select id="clientName"
											class="form-control form-control-sm enquiry-input">
										</select>
									</div>


									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Project Name </label> <select id="projectName"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Client first</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											site Location</label> <input type="text" id="site"
											class="form-control form-control-sm enquiry-input"
											readonly="readonly">
									</div>
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Zone</label> <input type="text" id="Zone"
											class="form-control form-control-sm enquiry-input"
											readonly="readonly">
									</div>
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-user-check enquiry-icon"></i>General
											Consultant <span class="text-danger">*</span> </label> <select
											id="gnrlcon"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select</option>
											<option value="1">YES</option>
											<option value="0">NO</option>
										</select>
									</div>



									<div class="form-group col-md-4 enquiry-field">
										<label> <i class="fas fa-building enquiry-icon"></i>
											Type <span class="text-danger">*</span>
										</label> <select id="invdevType"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select</option>
											<option value="1">Investor</option>
											<option value="2">Developer</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label> <i class="fas fa-comment-dots enquiry-icon"></i>
											Sale Person Name
										</label> <input type="text" id="invdev"
											class="form-control form-control-sm enquiry-input">
									</div>

									<!-- KAM -->
									<div class="form-group col-md-4 enquiry-field" hidden="hidden">
										<label><i class="fas fa-user-check enquiry-icon"></i>
											KAM <span class="text-danger">*</span></label> <select id="kam"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select KAM</option>
											<option value="KAM 1">KAM 1</option>
											<option value="KAM 2">KAM 2</option>
											<option value="KAM 3">KAM 3</option>
										</select>
									</div>

									<!-- Current Stage -->

									<!-- RFQ Date -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-alt enquiry-icon"></i>
											RFQ Date <span class="text-danger">*</span></label> <input
											type="date" id="rfqDate"
											class="form-control form-control-sm enquiry-input">
									</div>

									<!-- NDA Date -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-file-contract enquiry-icon"></i>
											NDA Date <span class="text-danger">*</span> </label> <input
											type="date" id="ndaDate"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-random enquiry-icon"></i>Industry
											Type <span class="text-danger">*</span> </label> <select id="indtyp"
											class="form-control form-control-sm enquiry-input">
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Area/qty(MT) <span class="text-danger">*</span></label> <input
											type="number" id="qty"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Suggested Bid Value(cr) <span class="text-danger">*</span></label> <input
											type="text" id="bidval"
											class="form-control form-control-sm enquiry-input">
									</div>
									<div class="form-group col-md-4 enquiry-field">
										<label> <i class="fas fa-random enquiry-icon"></i>Segment
											<span class="text-danger">*</span></label> <select id="segtype"
											class="form-control form-control-sm enquiry-input">
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-plus enquiry-icon"></i>
											Expected Project Start Month </label>
										<input type="date" id="exppromon"
											class="form-control form-control-sm enquiry-input">
									</div>
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-plus enquiry-icon"></i>
											Expected Award Month <span class="text-danger">*</span> </label> <input
											type="date" id="expawdmon"
											class="form-control form-control-sm enquiry-input">
									</div>



									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-check enquiry-icon"></i>
											Tentative Closure Month</label> <input type="month"
											id="tentClosureMon"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-drafting-compass enquiry-icon"></i>
											Design Basis <span class="text-danger">*</span> </label> <select
											id="designBasis"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Design Basis</option>
										</select>
									</div>


									<!-- Bid Type -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-random enquiry-icon"></i> Bid
											Type Single Bid (Yes)/Multiple Bids (No) <span
											class="text-danger">*</span> </label> <select id="bidType"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Bid Type</option>
											<option value="Yes">Yes</option>
											<option value="No">No</option>
										</select>
									</div>


									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-tasks enquiry-icon"></i>
											Current Stage</label> <select id="currentStage"
											class="form-control form-control-sm enquiry-input"
											disabled="disabled">
										</select>
									</div>

									<div class="form-group col-md-12 enquiry-field">
										<label> <i class="fas fa-comment-dots enquiry-icon"></i>
											Comments <span class="text-danger">*</span>
										</label>
										<textarea id="comments" rows="3"
											class="form-control form-control-sm enquiry-input"
											placeholder="Add any additional notes here..."></textarea>
									</div>

								</div>
							</div>

							<!-- Footer -->
							<div class="modal-footer enquiry-modal-footer">
								<button type="button" class="btn btn-sm enquiry-btn-secondary"
									data-dismiss="modal">Close</button>
								<button type="button" class="btn btn-sm enquiry-btn-primary"
									onclick="openModalAdd();">Create Lead</button>
							</div>

						</div>
					</div>
				</div>

			


				<div class="modal fade" id="exampleModalScrollableUp" tabindex="-1"
					role="dialog" aria-hidden="true">
					<div
						class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
						style="max-width: 900px;" role="document">
						<div class="modal-content enquiry-modal-content">

							<div class="modal-header enquiry-modal-header">
								<div>
									<h5 class="modal-title mb-0">Update Lead</h5>
									<p class="enquiry-subtitle mb-0">Edit the details below to
										update this Lead</p>
								</div>
								<button type="button" class="close text-white"
									data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>

							<div class="modal-body enquiry-modal-body">
								<div class="form-row">

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-hashtag enquiry-icon"></i>
											Lead No</label> <input type="text" id="leadNo1"
											class="form-control form-control-sm enquiry-input enquiry-readonly"
											readonly>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-user-check enquiry-icon"></i>
											Client Name <span class="text-danger">*</span></label> <select
											id="clientName1"
											class="form-control form-control-sm enquiry-input"></select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Project Name <span class="text-danger">*</span></label> <select
											id="projectName1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Client first</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-user-check enquiry-icon"></i>
											General Consultant</label> <select id="gnrlcon1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select</option>
											<option value="1">YES</option>
											<option value="0">NO</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-building enquiry-icon"></i>
											Type <span class="text-danger">*</span> </label> <select
											id="invdevType1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select</option>
											<option value="1">Investor</option>
											<option value="2">Developer</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Sale Person Name <span class="text-danger">*</span> </label> <input
											type="text" id="invdev1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-alt enquiry-icon"></i>
											RFQ Date  <span class="text-danger">*</span> </label> <input
											type="date" id="rfqDate1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-file-contract enquiry-icon"></i>
											NDA Date <span class="text-danger">*</span> </label> <input
											type="date" id="ndaDate1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-random enquiry-icon"></i>
											Industry Type <span class="text-danger">*</span> </label> <select
											id="indtyp1"
											class="form-control form-control-sm enquiry-input"></select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Area/qty(MT) <span class="text-danger">*</span> </label> <input
											type="number" id="qty1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Suggested Bid Value(cr) <span class="text-danger">*</span> </label> <input
											type="number" step="any" id="bidval1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-random enquiry-icon"></i>
											Segment <span class="text-danger">*</span> </label> <select
											id="segtype1"
											class="form-control form-control-sm enquiry-input"></select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-plus enquiry-icon"></i>
											Expected Project Start Month </label> <input type="date"
											id="exppromon1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-plus enquiry-icon"></i>
											Expected Award Month <span class="text-danger">*</span> </label> <input
											type="date" id="expawdmon1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-check enquiry-icon"></i>
											Tentative Closure Month</label> <input type="month"
											id="tentClosureMon1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-drafting-compass enquiry-icon"></i>
											Design Basis <span class="text-danger">*</span> </label> <select
											id="designBasis1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Design Basis</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-random enquiry-icon"></i> Bid
											Type Single Bid (Yes)/Multiple Bids (No) <span
											class="text-danger">*</span> </label> <select id="bidType1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Bid Type</option>
											<option value="Yes">Yes</option>
											<option value="No">No</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-tasks enquiry-icon"></i>
											Current Stage <span class="text-danger">*</span> </label> <select
											id="currentStage1"
											class="form-control form-control-sm enquiry-input"
											disabled="disabled"></select>
									</div>

									<div class="form-group col-md-12 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Comments <span class="text-danger">*</span></label>
										<textarea id="comments1" rows="3"
											class="form-control form-control-sm enquiry-input"
											placeholder="Add any additional notes here..."></textarea>
									</div>

								</div>
							</div>

							<div class="modal-footer enquiry-modal-footer">
								<button type="button" class="btn btn-sm enquiry-btn-secondary"
									data-dismiss="modal">Close</button>
								<button type="button" class="btn btn-sm enquiry-btn-primary"
									onclick="updateLead()">Update</button>
							</div>

						</div>
					</div>
				</div>

				<div class="modal fade" id="exampleModalActivity" tabindex="-1"
					role="dialog" aria-labelledby="exampleModalActivityTitle"
					aria-hidden="true">
					<div
						class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
						style="max-width: 750px;" role="document">
						<div class="modal-content">
							<div class="modal-header enquiry-modal-header">
								<h5 class="modal-title text-white"
									id="exampleModalActivityTitle">
									<b>Lead Follow-up</b>
								</h5>
								<button type="button" class="close text-white"
									data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div class="modal-body enquiry-modal-body">

								<!-- Read-only summary of the enquiry -->
								<div class="p-2 mb-3"
									style="background-color: #eef0fa; border-radius: 8px; border-left: 4px solid #37499A;">
									<div class="row">
										<div class="col-md-3">
											<small class="text-muted">Lead No</small><br> <b
												id="sqEnqNo">-</b>
										</div>
										<div class="col-md-4">
											<small class="text-muted">Client</small><br> <b
												id="sqClientName">-</b>
										</div>
										<div class="col-md-4">
											<small class="text-muted">ProjectName</small><br> <b
												id="sqProjectName">-</b>
										</div>

									</div>
								</div>

								<div class="form-row">

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-bullseye enquiry-icon"></i>
											Source <span class="text-danger">*</span> </label> <select id="activitySource"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Source</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-day enquiry-icon"></i>
											Date <span class="text-danger">*</span> </label> <input type="date" id="activityDate"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-id-badge enquiry-icon"></i>
											Name (Attended By) <span class="text-danger">*</span> </label> <input type="text" id="activityAttendedBy"
											class="form-control form-control-sm enquiry-input enquiry-readonly"
											readonly>
									</div>


									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-flag enquiry-icon"></i> Stage <span class="text-danger">*</span> </label>
										<select id="activityStage"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Stage</option>
										</select>
									</div>


									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-user enquiry-icon"></i>
											Contact Person <span class="text-danger">*</span> </label> <select id="activityContactPerson"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Contact Person</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-check enquiry-icon"></i>
											Next Follow-up Date <span class="text-danger">*</span> </label> <input type="date" id="nextFollowUpDate"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-12 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Comments <span class="text-danger">*</span> </label>
										<textarea id="activityRemarks" rows="2"
											class="form-control form-control-sm enquiry-input"></textarea>
									</div>
								</div>

								<hr>

								<h6 class="mb-2">
									<b>Follow-up History</b>
								</h6>
								<div class="table-responsive">
									<table class="table table-sm table-bordered">
										<thead>
											<tr>
												<th>Date</th>
												<th>Source</th>
												<th>Attended By</th>
												<th>Stage</th>
												<th>Contact Person</th>
												<th>Next Follow-up</th>
												<th>Comments</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody id="activityHistoryBody">
										</tbody>
									</table>
								</div>

							</div>
							<button type="button" class="btn btn-sm enquiry-btn-secondary"
								id="cancelEditBtn" style="display: none;">Cancel Edit</button>
							<div class="modal-footer enquiry-modal-footer">
								<button type="button" class="btn btn-sm enquiry-btn-secondary"
									data-dismiss="modal">Close</button>
								<button type="button" class="btn btn-sm enquiry-btn-primary"
									id="saveActivityBtn">Save Follow-up</button>
							</div>
						</div>
					</div>
				</div>
				


<div class="modal fade" id="messageModal" tabindex="-1" role="dialog"
	aria-hidden="true" data-backdrop="static" style="z-index: 1100;">
	<div class="modal-dialog modal-dialog-centered" style="max-width: 420px;" role="document">
		<div class="modal-content enquiry-modal-content">
			<div class="modal-body text-center" style="padding: 28px 24px; background: #fff;">
				<div id="messageModalIcon" style="font-size: 46px; margin-bottom: 10px;"></div>
				<h5 id="messageModalTitle" class="mb-2"></h5>
				<p id="messageModalText" class="mb-0" style="color: #4b5563; font-size: 14px; white-space: pre-line;"></p>
			</div>
			<div class="modal-footer enquiry-modal-footer justify-content-center">
				<button type="button" class="btn btn-sm enquiry-btn-secondary" id="messageModalCancel" style="display: none;">Cancel</button>
				<button type="button" class="btn btn-sm enquiry-btn-primary" id="messageModalOk">OK</button>
			</div>
		</div>
	</div>
</div>



	
				<script src="vendor/jquery/jquery.min.js"></script>
				<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
				<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
			
				<script src="vendor/datatables/jquery.dataTables.min.js"></script>
				<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
				
							<script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
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
				<script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
				<script src="js/Leads.js?v=<%=ver(application, "/js/Leads.js")%>"></script>
				<script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
</body>
</html>
