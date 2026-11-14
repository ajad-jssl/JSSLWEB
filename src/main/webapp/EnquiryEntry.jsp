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

<title>Load Status Report - JSSL</title>


<!-- Bootstrap -->
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css">
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

/* ===== Attachment table - compact ===== */
#attachmentTable {
	font-size: 12px;
	table-layout: fixed;
	width: 100%;
	margin-bottom: 0;
}
#attachmentTable th, #attachmentTable td {
	padding: 4px 6px;
	vertical-align: middle;
	white-space: nowrap;
}
#attachmentTable td.att-name, #attachmentTable td.att-remarks {
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 0;           /* needed so ellipsis works with table-layout: fixed */
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
					<h1 class="h3 mb-0 text-gray-800">CRM Enquire Entry</h1>
					<ol class="breadcrumb">
						<li class="breadcrumb-item"><a href="SaleDashBoard.jsp">Home</a></li>
						<li class="breadcrumb-item active" aria-current="page">Crm
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
									id="EnquiryTableID" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Enq No</th>
											<th>Lead No</th>
											<th>Area/Qty</th>
											<th>Suggestedbidvalue</th>
											<th>client Name</th>
											<th>ProjectName</th>
											<th>Current Stage</th>
											<th>Edit</th>
											<th>Follow-up</th>
											<th>Attachments</th>
										</tr>
									</thead>
									<tbody id="enquiryTableBody">
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
										id="exampleModalScrollableTitle123">Enquiry Entry</h5>
									<p class="enquiry-subtitle mb-0">Fill in the details below
										to log a new enquiry</p>
								</div>
								<button type="button" class="close text-white"
									data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<!-- Body -->
							<div class="modal-body enquiry-modal-body">
								<div class="form-row">

									<!-- Lead No -->
									<div class="form-group col-md-4 enquiry-field">
										<label> <i class="fas fa-hashtag enquiry-icon"></i>
											Lead No <span class="text-danger">*</span>
										</label> <select id="leadNo"
											class="form-control form-control-sm enquiry-input" required>
											<option value="">Select Lead No</option>
										</select>
									</div>

									<!-- Project Name -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-project-diagram enquiry-icon"></i>
											Project Name</label> <input type="text" id="projectName"
											class="form-control form-control-sm enquiry-input"
											placeholder="Enter Project Name" readonly="readonly">
									</div>

									<!-- Client Name -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-building enquiry-icon"></i>
											Client Name</label> <input type="text" id="clientName"
											class="form-control form-control-sm enquiry-input"
											placeholder="Enter Client Name" readonly="readonly">
									</div>

									<!-- Site Location -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-map-marker-alt enquiry-icon"></i>
											Site Location</label> <input type="text" id="siteLocation"
											class="form-control form-control-sm enquiry-input"
											placeholder="Enter Site Location" readonly="readonly">
									</div>

									<!-- Zone -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-globe enquiry-icon"></i> Zone</label>
										<input type="text" id="zone"
											class="form-control form-control-sm enquiry-input"
											placeholder="Enter Zone" readonly="readonly">
									</div>

									<!-- Area / Qty -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-ruler-combined enquiry-icon"></i>
											Area / Qty(MT) <span class="text-danger">*</span> </label> <input
											type="text" id="areaQty"
											class="form-control form-control-sm enquiry-input"
											placeholder="Enter Area / Qty">
									</div>

									<!-- Suggested Bid Value -->
									<div class="form-group col-md-4 enquiry-field">
										<label> <i class="fas fa-rupee-sign enquiry-icon"></i>
											Suggested Bid Value (Cr) <span class="text-danger">*</span>
										</label> <input type="text" id="suggestedBidValue"
											class="form-control form-control-sm enquiry-input"
											placeholder="Enter Suggested Bid Value">
									</div>

									<!-- Segment -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-layer-group enquiry-icon"></i>
											Segment <span class="text-danger">*</span> </label> <select
											id="segment"
											class="form-control form-control-sm enquiry-input">
										</select>
									</div>

									<!-- Design Basis -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-drafting-compass enquiry-icon"></i>
											Design Basis <span class="text-danger">*</span></label> <select
											id="designBasis"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Design Basis</option>
											<option value="1">Design and Build Basis</option>
											<option value="2">Client Design</option>
										</select>
									</div>


									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-tasks enquiry-icon"></i>
											Current Stage </label> <select id="currentStage"
											class="form-control form-control-sm enquiry-input enquiry-readonly"
											disabled></select>
									</div>


									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-check enquiry-icon"></i>
											Tentative Closure Month</label> <input type="month"
											id="tentClosureMon"
											class="form-control form-control-sm enquiry-input">
									</div>

									<!-- Painting Requirement -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-paint-roller enquiry-icon"></i>
											Painting Requirement <span class="text-danger">*</span> </label> <select
											id="paintingRequirement"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Painting Requirement</option>
											<option value="1">Primer Only</option>
											<option value="2">Primer + Finish Coat</option>
											<option value="3">Primer + Intermediary + Finish
												Coat</option>
										</select>
									</div>

									<!-- Type of Enquiry -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-file-alt enquiry-icon"></i>
											Type of Enquiry <span class="text-danger">*</span> </label> <select
											id="enquiryType"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Type</option>
											<option value="1">Budgetary</option>
											<option value="2">Firm for Finalization</option>
										</select>
									</div>

									<!-- Fire Proofing -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i
											class="fas fa-fire-extinguisher enquiry-icon"></i> Fire
											Proofing Required <span class="text-danger">*</span> </label> <select
											id="fireProofing"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select</option>
											<option value="1">Yes</option>
											<option value="0">No</option>
										</select>
									</div>


									<div class="form-group col-md-12 enquiry-field">
										<label> <i class="fas fa-money-check-alt enquiry-icon"></i>
											Client's Payment Terms
										</label>

										<div id="paymentTerms"
											style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">

											<div class="payment-term-row">
												<label> <input type="checkbox" class="payment-term"
													value="1"> Advance
												</label> <input type="number" class="payment-percentage"
													data-value="1" min="0" max="100" step="0.01"
													placeholder="%" disabled>
											</div>

											<div class="payment-term-row">
												<label> <input type="checkbox" class="payment-term"
													value="2"> Stage 1
												</label> <input type="number" class="payment-percentage"
													data-value="2" min="0" max="100" step="0.01"
													placeholder="%" disabled>
											</div>

											<div class="payment-term-row">
												<label> <input type="checkbox" class="payment-term"
													value="3"> Stage 2
												</label> <input type="number" class="payment-percentage"
													data-value="3" min="0" max="100" step="0.01"
													placeholder="%" disabled>
											</div>

											<div class="payment-term-row">
												<label> <input type="checkbox" class="payment-term"
													value="4"> Stage 3
												</label> <input type="number" class="payment-percentage"
													data-value="4" min="0" max="100" step="0.01"
													placeholder="%" disabled>
											</div>

										</div>

										<small id="paymentTotalMessage" class="text-muted">
											Total: 0% </small>
									</div>

									<!-- Attachments -->
									<div class="form-group col-md-12 enquiry-field" hidden>
										<label><i class="fas fa-paperclip enquiry-icon"></i>
											Attachments</label> <input type="file" id="attachments"
											class="form-control form-control-sm enquiry-input" multiple>
									</div>

									<!-- Attachment Remarks -->
									<div class="form-group col-md-12 enquiry-field" hidden>
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Attachment Remarks</label>
										<textarea id="attachmentRemarks" rows="3"
											class="form-control form-control-sm enquiry-input"
											placeholder="Enter Attachment Remarks"></textarea>
									</div>

									<!-- Fire Proofing Remarks -->
									<div class="form-group col-md-12 enquiry-field">
										<label><i class="fas fa-sticky-note enquiry-icon"></i>
											Fire Proofing Remarks</label>
										<textarea id="fireProofingRemarks" rows="3"
											class="form-control form-control-sm enquiry-input"
											placeholder="Enter Fire Proofing Remarks"></textarea>
									</div>

								</div>
							</div>


							<!-- Footer -->
							<div class="modal-footer enquiry-modal-footer">
								<button type="button" class="btn btn-sm enquiry-btn-secondary"
									data-dismiss="modal">Close</button>
								<button type="button" class="btn btn-sm enquiry-btn-primary"
									id="createEnquiryBtn">Create Enquiry</button>
							</div>

						</div>
					</div>
				</div>
				<div class="modal fade" id="exampleModalScrollableUp" tabindex="-1"
					role="dialog" aria-labelledby="exampleModalScrollableTitleUp"
					aria-hidden="true">
					<div
						class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
						style="max-width: 900px;" role="document">
						<div class="modal-content enquiry-modal-content">

							<div class="modal-header enquiry-modal-header">
								<div>
									<h5 class="modal-title mb-0" id="exampleModalScrollableTitleUp">Update
										Enquiry</h5>
									<p class="enquiry-subtitle mb-0">Update the enquiry details
										below</p>
								</div>
								<button type="button" class="close text-white"
									data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>

							<div class="modal-body enquiry-modal-body">
								<div class="form-row">

									<!-- Enquiry No -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-hashtag enquiry-icon"></i>
											Enquiry No</label> <input type="text" id="enqNo1"
											class="form-control form-control-sm enquiry-input enquiry-readonly"
											readonly>
									</div>

									<!-- Lead No -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-hashtag enquiry-icon"></i>
											Lead No</label> <input type="text" id="leadNo1"
											class="form-control form-control-sm enquiry-input enquiry-readonly"
											readonly>
									</div>

									<!-- Area Qty -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-ruler-combined enquiry-icon"></i>
											Area / Qty(MT) <span class="text-danger">*</span> </label> <input
											type="text" id="areaQty1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<!-- Suggested Bid Value -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-rupee-sign enquiry-icon"></i>
											Suggested Bid Value (Cr) <span class="text-danger">*</span> </label>
										<input type="text" id="suggestedBidValue1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<!-- Segment -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-layer-group enquiry-icon"></i>
											Segment <span class="text-danger">*</span> </label> <select
											id="segment1"
											class="form-control form-control-sm enquiry-input">
										</select>
									</div>

									<!-- Design Basis -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-drafting-compass enquiry-icon"></i>
											Design Basis <span class="text-danger">*</span> </label> <select
											id="designBasis1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Design Basis</option>
											<option value="1">Design and Build Basis</option>
											<option value="2">Client Design</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-tasks enquiry-icon"></i>
											Current Stage</label> <select id="currentStage1"
											class="form-control form-control-sm enquiry-input enquiry-readonly"
											disabled></select>
									</div>
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-check enquiry-icon"></i>
											Tentative Closure Month</label> <input type="month"
											id="tentClosureMon1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<!-- Painting Requirement -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-paint-roller enquiry-icon"></i>
											Painting Requirement <span class="text-danger">*</span> </label> <select
											id="paintingRequirement1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Painting Requirement</option>
											<option value="1">Primer Only</option>
											<option value="2">Primer + Finish Coat</option>
											<option value="3">Primer + Intermediary + Finish
												Coat</option>
										</select>
									</div>

									<!-- Type of Enquiry -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-file-alt enquiry-icon"></i>
											Type of Enquiry <span class="text-danger">*</span> </label> <select
											id="enquiryType1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Type</option>
											<option value="1">Budgetary</option>
											<option value="2">Firm for Finalization</option>
										</select>
									</div>

									<!-- Fire Proofing -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i
											class="fas fa-fire-extinguisher enquiry-icon"></i> Fire
											Proofing Required <span class="text-danger">*</span> </label> <select
											id="fireProofing1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select</option>
											<option value="1">Yes</option>
											<option value="0">No</option>
										</select>
									</div>



									<div class="form-group col-md-12 enquiry-field">
										<label> <i class="fas fa-money-check-alt enquiry-icon"></i>
											Client's Payment Terms
										</label>

										<div id="paymentTerms1"
											style="display: flex; align-items: center; gap: 15px; flex-wrap: nowrap;">

											<div
												style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
												<label style="margin: 0;"> <input type="checkbox"
													class="payment-term1" value="1"> Advance
												</label> <input type="number" class="payment-percentage1"
													data-value="1" min="0" max="100" step="0.01"
													placeholder="%" disabled style="width: 60px;">
											</div>

											<div
												style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
												<label style="margin: 0;"> <input type="checkbox"
													class="payment-term1" value="2"> Stage 1
												</label> <input type="number" class="payment-percentage1"
													data-value="2" min="0" max="100" step="0.01"
													placeholder="%" disabled style="width: 60px;">
											</div>

											<div
												style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
												<label style="margin: 0;"> <input type="checkbox"
													class="payment-term1" value="3"> Stage 2
												</label> <input type="number" class="payment-percentage1"
													data-value="3" min="0" max="100" step="0.01"
													placeholder="%" disabled style="width: 60px;">
											</div>

											<div
												style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
												<label style="margin: 0;"> <input type="checkbox"
													class="payment-term1" value="4"> Stage 3
												</label> <input type="number" class="payment-percentage1"
													data-value="4" min="0" max="100" step="0.01"
													placeholder="%" disabled style="width: 60px;">
											</div>

										</div>

										<small id="paymentTotalMessage1" class="text-muted">
											Total: 0% </small>
									</div>



									<div class="form-group col-md-12 enquiry-field" hidden>

										<label> <i class="fas fa-paperclip enquiry-icon"></i>
											Attachment
										</label> <input type="file" id="attachments1"
											class="form-control form-control-sm enquiry-input">

										<div id="existingAttachment1" class="mt-2"></div>

									</div>

									<!-- Attachment Remarks -->
									<div class="form-group col-md-12 enquiry-field" hidden>
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Attachment Remarks</label>
										<textarea id="attachmentRemarks1" rows="3"
											class="form-control form-control-sm enquiry-input"></textarea>
									</div>

									<!-- Fire Proofing Remarks -->
									<div class="form-group col-md-12 enquiry-field">
										<label><i class="fas fa-sticky-note enquiry-icon"></i>
											Fire Proofing Remarks</label>
										<textarea id="fireProofingRemarks1" rows="3"
											class="form-control form-control-sm enquiry-input"></textarea>
									</div>
								</div>
							</div>

							<div class="modal-footer enquiry-modal-footer">
								<button type="button" class="btn btn-sm enquiry-btn-secondary"
									data-dismiss="modal">Close</button>
								<button type="button" class="btn btn-sm enquiry-btn-primary"
									id="updateEnquiryBtn">Update Enquiry</button>
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
									<b>Enquiry Follow-up</b>
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
											<small class="text-muted">Enq No</small><br> <b
												id="sqEnqNo">-</b>
										</div>
										<div class="col-md-4">
											<small class="text-muted">Project</small><br> <b
												id="sqProjectName">-</b>
										</div>
										<div class="col-md-3">
											<small class="text-muted">Client</small><br> <b
												id="sqClientName">-</b>
										</div>
										<div class="col-md-2">
											<small class="text-muted">Stage</small><br> <b
												id="sqCurrentStage">-</b>
										</div>
									</div>
								</div>

								<div class="form-row">



									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-bullseye enquiry-icon"></i>
											Source</label> <select id="activitySource"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Source</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-day enquiry-icon"></i>
											Date</label> <input type="date" id="activityDate"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-id-badge enquiry-icon"></i>
											Name (Attended By)</label> <input type="text" id="activityAttendedBy"
											class="form-control form-control-sm enquiry-input enquiry-readonly"
											readonly>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-flag enquiry-icon"></i> Stage</label>
										<select id="activityStage"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Stage</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-user enquiry-icon"></i>
											Contact Person</label><select id="activityContactPerson"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Contact Person</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-check enquiry-icon"></i>
											Next Follow-up Date</label> <input type="date" id="nextFollowUpDate"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-12 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Comments</label>
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
												<th>Actions</th>
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

				<div class="modal fade" id="exampleModalActivityUp" tabindex="-1"
					role="dialog" aria-labelledby="exampleModalActivityUpTitle"
					aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered"
						style="max-width: 650px;" role="document">
						<div class="modal-content">
							<div class="modal-header enquiry-modal-header">
								<h5 class="modal-title text-white"
									id="exampleModalActivityUpTitle">
									<b>Update Follow-up</b>
								</h5>
								<button type="button" class="close text-white"
									data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div class="modal-body enquiry-modal-body">
								<div class="form-row">
									<div class="form-group col-md-6 enquiry-field">
										<label><i class="fas fa-bullseye enquiry-icon"></i>
											Source</label> <select id="activitySource1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Source</option>
										</select>
									</div>
									<div class="form-group col-md-6 enquiry-field">
										<label><i class="fas fa-calendar-day enquiry-icon"></i>
											Date</label> <input type="date" id="activityDate1"
											class="form-control form-control-sm enquiry-input">
									</div>
									<div class="form-group col-md-6 enquiry-field">
										<label><i class="fas fa-id-badge enquiry-icon"></i>
											Name (Attended By)</label> <input type="text"
											id="activityAttendedBy1"
											class="form-control form-control-sm enquiry-input enquiry-readonly"
											readonly>
									</div>
									<div class="form-group col-md-6 enquiry-field">
										<label><i class="fas fa-flag enquiry-icon"></i> Stage</label>
										<select id="activityStage1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Stage</option>
										</select>
									</div>
									<div class="form-group col-md-6 enquiry-field">
										<label><i class="fas fa-user enquiry-icon"></i>
											Contact Person</label> <select id="activityContactPerson1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Contact Person</option>
										</select>
									</div>
									<div class="form-group col-md-6 enquiry-field">
										<label><i class="fas fa-calendar-check enquiry-icon"></i>
											Next Follow-up Date</label> <input type="date" id="nextFollowUpDate1"
											class="form-control form-control-sm enquiry-input">
									</div>
									<div class="form-group col-md-12 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Comments</label>
										<textarea id="activityRemarks1" rows="2"
											class="form-control form-control-sm enquiry-input"></textarea>
									</div>
								</div>
							</div>
							<div class="modal-footer enquiry-modal-footer">
								<button type="button" class="btn btn-sm enquiry-btn-secondary"
									data-dismiss="modal">Close</button>
								<button type="button" class="btn btn-sm enquiry-btn-primary"
									id="updateFollowupBtn">Update Follow-up</button>
							</div>
						</div>
					</div>
				</div>

				<div class="modal fade show" id="messageModal" tabindex="-1"
					role="dialog" aria-labelledby="messageTitle" aria-modal="true"
					style="display: none;">
					<div class="modal-dialog modal-dialog-centered" role="document">

						<div class="modal-content"
							style="width: 70%; margin: auto; border-width: thick; border-color: #eaecf4;">

							<!-- Optional empty header (for spacing like your design) -->
							<div class="modal-header1"></div>

							<!-- Body -->
							<div class="modal-body text-center">
								<b id="modalMessage"></b>
							</div>

							<!-- Footer -->
							<div class="modal-footer d-flex justify-content-center border-0">
								<button type="button" class="btn btn-secondary btn-sm"
									data-dismiss="modal" id="removeadharduplicate">OK</button>
							</div>

						</div>

					</div>
				</div>

				<div class="modal fade" id="followupMsgModal" tabindex="-1"
					role="dialog" aria-hidden="true" data-backdrop="static"
					style="z-index: 1100;">
					<div class="modal-dialog modal-dialog-centered"
						style="max-width: 420px;" role="document">
						<div class="modal-content enquiry-modal-content">
							<div class="modal-body text-center"
								style="padding: 28px 24px; background: #fff;">
								<div id="fmIcon" style="font-size: 46px; margin-bottom: 10px;"></div>
								<h5 id="fmTitle" class="mb-2"></h5>
								<p id="fmText" class="mb-0"
									style="color: #4b5563; font-size: 14px; white-space: pre-line;"></p>
							</div>
							<div
								class="modal-footer enquiry-modal-footer justify-content-center">
								<button type="button" class="btn btn-sm enquiry-btn-secondary"
									id="fmCancel" style="display: none;">Cancel</button>
								<button type="button" class="btn btn-sm enquiry-btn-primary"
									id="fmOk">OK</button>
							</div>
						</div>
					</div>
				</div>


				<div class="modal fade" id="exampleModalAttachment" tabindex="-1"
					role="dialog" aria-hidden="true">
					<div
						class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
						style="max-width: 800px;" role="document">
						<div class="modal-content enquiry-modal-content">
							<div class="modal-header enquiry-modal-header">
								<h5 class="modal-title text-white">
									<b>Enquiry Attachments</b>
								</h5>
								<button type="button" class="close text-white"
									data-dismiss="modal">
									<span>&times;</span>
								</button>
							</div>

							<div class="modal-body enquiry-modal-body">
								<div class="p-2 mb-3"
									style="background: #eef0fa; border-radius: 8px; border-left: 4px solid #37499A;">
									<div class="row">
										<div class="col-md-3">
											<small class="text-muted">Enq No</small><br>
											<b id="atEnqNo">-</b>
										</div>
										<div class="col-md-5">
											<small class="text-muted">Project</small><br>
											<b id="atProjectName">-</b>
										</div>
										<div class="col-md-4">
											<small class="text-muted">Client</small><br>
											<b id="atClientName">-</b>
										</div>
									</div>
								</div>

								<h6>
									<b>Add New Attachments</b>
								</h6>
								<div id="newAttachmentRows"></div>
								<button type="button"
									class="btn btn-sm enquiry-btn-primary mt-1"
									id="addAttachmentRowBtn">
									<i class="fas fa-plus"></i> Add More
								</button>

								<hr>
								<h6>
									<b>Uploaded Attachments</b>
								</h6>
								<!-- <div class="table-responsive">
									<table class="table table-sm table-bordered">
										<thead>
											<tr>
												<th>Sl</th>
												<th>File Name</th>
												<th>Remarks</th>
												<th>Uploaded By</th>
												<th>Date</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody id="attachmentHistoryBody"></tbody>
									</table>
								</div> -->
								
								<div class="table-responsive">
  <table class="table table-sm table-bordered" id="attachmentTable">
    <colgroup>
      <col style="width:6%">    <!-- Sl -->
      <col style="width:30%">   <!-- File Name -->
      <col style="width:22%">   <!-- Remarks -->
      <col style="width:14%">   <!-- Uploaded By -->
      <col style="width:16%">   <!-- Date -->
      <col style="width:12%">   <!-- Actions -->
    </colgroup>
    <thead>
      <tr>
        <th>Sl</th>
        <th>File Name</th>
        <th>Remarks</th>
        <th>Uploaded By</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="attachmentHistoryBody"></tbody>
  </table>
</div>
							</div>

							<div class="modal-footer enquiry-modal-footer">
								<button type="button" class="btn btn-sm enquiry-btn-secondary"
									data-dismiss="modal">Close</button>
								<button type="button" class="btn btn-sm enquiry-btn-primary"
									id="uploadAttachmentsBtn">Upload</button>
							</div>
						</div>
					</div>
				</div>


				<!-- JS FILES -->
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



				<!-- 	<script
					src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script> -->





				<script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
				<script
					src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
				<script
					src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
				<script
					src="js/CRMEnquiry.js?v=<%=ver(application, "/js/CRMEnquiry.js")%>"></script>
				<script
					src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
</body>
</html>
