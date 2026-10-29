
<%
    response.setHeader("Cache-Control","no-cache,no-store,must-revalidate");
    response.setHeader("Pragma","no-cache");
    response.setDateHeader("Expires",0);
%>




<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width,initial-scale=1,shrink-to-fit=no">
<link href="img/logo/download.png" rel="icon">
<title>JSSL</title>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet"
	type="text/css" />
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<link href="css/ruang-admin.min.css" rel="stylesheet" />
<link href="vendor/datatables/dataTables.bootstrap4.min.css"
	rel="stylesheet">


<link rel="stylesheet" href="css/main.css">

<link
	href="externalLibrary/cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css"
	rel="stylesheet" />
<link
	href="externalLibrary/cdnjs.cloudflare.com/ajax/libs/select2-bootstrap-theme/0.1.0-beta.10/select2-bootstrap.min.css"
	rel="stylesheet" />
	
	
	<link rel="stylesheet"
	href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />

<style>
button {
	padding: 5px 15px;
	font-size: 13px;
	background-color: #4CAF50;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}

button:hover {
	background-color: #45a049;
}

button.close {
	padding: 0;
	background-color: transparent;
	border: 0;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
}

.modal-content {
	border-radius: 10px;
}

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

.mt-5, .my-5 {
	margin-top: -5rem !important;
}

.page-heading {
	font-size: 15px;
	font-weight: 600;
	color: #37499A;
	margin-bottom: 2px;
}

.page-subheading {
	font-size: 12px;
	color: #888;
}

.btn-report-problem {
	background-color: #37499A;
	color: #fff;
	border: none;
	border-radius: 6px;
	padding: 8px 18px;
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 7px;
	transition: background .15s;
}

.btn-report-problem:hover {
	background-color: #2c3c85;
	color: #fff;
}

.content-card {
	background: #fff;
	border-radius: 10px;
	border: 1px solid #e3e6f0;
	box-shadow: 0 2px 10px rgba(0, 0, 0, .05);
	overflow: hidden;
}

.content-card-header {
	background: linear-gradient(90deg, #37499A 0%, #4CAF50 100%);
	padding: 11px 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.content-card-header h6 {
	color: #fff;
	font-size: 13px;
	font-weight: 600;
	margin: 0;
	display: flex;
	align-items: center;
	gap: 8px;
}

.content-card-header small {
	color: rgba(255, 255, 255, .75);
	font-size: 12px;
}

.table thead th {
	background: #f4f6fb;
	font-size: 12px;
	font-weight: 600;
	color: #37499A;
	border-bottom: 2px solid #e3e6f0;
	vertical-align: middle;
}

.table tbody td {
	font-size: 12px;
	vertical-align: middle;
	color: #444;
}

.table-hover tbody tr:hover {
	background: #f0f3fa;
}

.ticket-badge {
	font-size: 11px;
	padding: 3px 10px;
	border-radius: 20px;
	font-weight: 600;
}

.badge-open {
	background: #fff3cd;
	color: #856404;
}

.badge-assigned {
	background: #cfe2ff;
	color: #0a58ca;
}

.badge-inprogress {
	background: #fff3cd;
	color: #664d03;
}

.badge-fixed {
	background: #d1e7dd;
	color: #0f5132;
}

.badge-closed {
	background: #e2e3e5;
	color: #41464b;
}

.empty-state {
	text-align: center;
	padding: 50px 20px;
}

.empty-state i {
	font-size: 42px;
	display: block;
	margin-bottom: 12px;
	color: #d0d5e8;
}

.empty-state p {
	font-size: 13px;
	margin: 0;
	color: #aaa;
}

/* Report modal styles */
.modal-header-custom {
	background: linear-gradient(90deg, #37499A 0%, #4CAF50 100%);
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	padding: 11px 18px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 46px;
}

.modal-header-custom .modal-title-text {
	color: #fff;
	font-size: 14px;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 8px;
}

.modal-header-custom .close {
	color: rgba(255, 255, 255, .85);
	opacity: 1;
	font-size: 20px;
	line-height: 1;
}

.modal-header-custom .close:hover {
	color: #fff;
}

.reporter-strip {
	background: #f0f3fa;
	border-left: 4px solid #37499A;
	border-radius: 0 8px 8px 0;
	padding: 10px 14px;
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 18px;
}

.reporter-avatar {
	width: 38px;
	height: 38px;
	border-radius: 50%;
	background: #37499A;
	color: #fff;
	font-size: 13px;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.reporter-name {
	font-size: 13px;
	font-weight: 600;
	color: #333;
	margin: 0;
}

.reporter-label {
	font-size: 11px;
	color: #888;
	margin: 0;
	margin-top: 2px;
}

.form-section-title {
	font-size: 11px;
	font-weight: 700;
	color: #37499A;
	text-transform: uppercase;
	letter-spacing: .6px;
	margin-bottom: 10px;
	padding-bottom: 6px;
	border-bottom: 1px solid #e8ebf5;
}

.form-label-sm {
	font-size: 12px;
	color: #555;
	font-weight: 600;
	margin-bottom: 4px;
	display: block;
}

.req {
	color: #dc3545;
}

.form-control-sm {
	font-size: 13px;
	border-radius: 6px;
	border: 1px solid #d1d5e8;
	color: #333;
}

.form-control-sm:focus {
	border-color: #37499A;
	box-shadow: 0 0 0 3px rgba(55, 73, 154, .1);
}

.broke-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 8px;
	margin-bottom: 4px;
}

.broke-chip {
	border: 1px solid #dee2e6;
	border-radius: 8px;
	padding: 10px 6px;
	text-align: center;
	cursor: pointer;
	background: #fafbfd;
	font-size: 11px;
	font-weight: 600;
	color: #555;
	transition: all .15s;
	user-select: none;
}

.broke-chip i {
	display: block;
	font-size: 18px;
	margin-bottom: 5px;
	color: #888;
}

.broke-chip:hover {
	background: #f0f3fa;
	border-color: #b0bae8;
}

.modal-footer {
	background: #f8f9fd;
	border-top: 1px solid #e8ebf5;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	padding: 12px 20px;
}

.btn-cancel-modal {
	background: #fff;
	border: 1px solid #d1d5e8;
	color: #555;
	border-radius: 6px;
	padding: 7px 18px;
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
	transition: background .15s;
}

.btn-cancel-modal:hover {
	background: #f0f3fa;
	color: #333;
}

.btn-submit-modal {
	background: #37499A;
	border: none;
	color: #fff;
	border-radius: 6px;
	padding: 7px 20px;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 7px;
	transition: background .15s;
}

.btn-submit-modal:hover {
	background: #2c3c85;
}

#successAlert {
	display: none;
	font-size: 13px;
	border-radius: 8px;
}

/* Track button */
.btn-track-ticket {
	background: #f4f6fb;
	color: #37499A;
	border: 1px solid #d1d5e8;
	border-radius: 5px;
	padding: 4px 10px;
	font-size: 11px;
	font-weight: 600;
	cursor: pointer;
}

.btn-track-ticket:hover {
	background: #e8ecf9;
}

/* ── Stepper (timeline) ── */
.stepper {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 20px 0 24px;
}

.step-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 90px;
}

.step-icon {
	width: 42px;
	height: 42px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	margin-bottom: 6px;
}

.step-label {
	font-size: 11px;
	font-weight: 600;
	text-align: center;
}

.step-done .step-icon {
	background: #d1e7dd;
	color: #0f5132;
}

.step-done .step-label {
	color: #0f5132;
}

.step-active .step-icon {
	background: #cfe2ff;
	color: #0a58ca;
	border: 2px solid #0a58ca;
}

.step-active .step-label {
	color: #0a58ca;
}

.step-pending .step-icon {
	background: #f4f6fb;
	color: #aaa;
	border: 2px solid #dee2e6;
}

.step-pending .step-label {
	color: #aaa;
}

.step-connector {
	flex: 1;
	height: 2px;
	background: #dee2e6;
	min-width: 20px;
}

.connector-done {
	background: #198754;
}

.track-header {
	background: #f4f6fb;
	border-radius: 8px;
	padding: 12px 14px;
}

.track-section {
	margin-top: 16px;
}

.track-section-title {
	font-size: 11px;
	font-weight: 700;
	color: #37499A;
	text-transform: uppercase;
	letter-spacing: .6px;
	margin-bottom: 8px;
	padding-bottom: 5px;
	border-bottom: 1px solid #e8ebf5;
}

.track-row {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 6px 0;
	border-bottom: 1px solid #f8f9fd;
	font-size: 12px;
}

/* Notification */
.notif-bell-wrap {
	position: relative;
	display: inline-block;
	cursor: pointer;
}

.notif-badge {
	position: absolute;
	top: -6px;
	right: -8px;
	background: #dc3545;
	color: #fff;
	border-radius: 50%;
	font-size: 10px;
	font-weight: 700;
	width: 18px;
	height: 18px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.notif-dropdown {
	position: absolute;
	right: 0;
	top: 32px;
	width: 310px;
	background: #fff;
	border-radius: 10px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, .15);
	z-index: 9999;
	display: none;
	max-height: 380px;
	overflow-y: auto;
}

.notif-dropdown.open {
	display: block;
}

.notif-item {
	padding: 10px 14px;
	border-bottom: 1px solid #f0f3fa;
	cursor: pointer;
}

.notif-item:hover {
	background: #f8f9fd;
}

.notif-unread {
	background: #eef1fb;
}

.notif-msg {
	font-size: 12px;
	color: #333;
}

.notif-time {
	font-size: 11px;
	color: #aaa;
	margin-top: 3px;
}

.notif-empty {
	padding: 16px;
	text-align: center;
	font-size: 12px;
	color: #aaa;
}

/* ── Broke Tabs ── */
.broke-tab-bar {
	display: flex;
	border-bottom: 2px solid #e3e6f0;
	margin-bottom: 10px;
	gap: 0;
}

.broke-tab {
	padding: 8px 16px;
	font-size: 12px;
	font-weight: 500;
	cursor: pointer;
	border: none;
	background: transparent;
	border-bottom: 3px solid transparent;
	margin-bottom: -2px;
	color: #888;
	transition: all .15s;
}

.broke-tab.active-elec {
	color: #185FA5;
	border-bottom-color: #185FA5;
	font-weight: 600;
}

.broke-tab.active-mech {
	color: #3B6D11;
	border-bottom-color: #3B6D11;
	font-weight: 600;
}

.broke-tab.active-hydr {
	color: #854F0B;
	border-bottom-color: #854F0B;
	font-weight: 600;
}

.tab-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	display: inline-block;
	margin-right: 5px;
}

.dot-elec {
	background: #378ADD;
}

.dot-mech {
	background: #639922;
}

.dot-hydr {
	background: #EF9F27;
}

.broke-panel {
	display: none;
}

.broke-panel.active {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 8px;
	margin-bottom: 4px;
}

/* Multi-select chip colors per tab – chip stays selected even when switching tabs */
.broke-chip.sel-elec {
	background: #E6F1FB;
	border: 2px solid #185FA5;
	color: #0C447C;
}

.broke-chip.sel-elec i {
	color: #185FA5;
}

.broke-chip.sel-mech {
	background: #EAF3DE;
	border: 2px solid #3B6D11;
	color: #27500A;
}

.broke-chip.sel-mech i {
	color: #3B6D11;
}

.broke-chip.sel-hydr {
	background: #FAEEDA;
	border: 2px solid #854F0B;
	color: #633806;
}

.broke-chip.sel-hydr i {
	color: #EF9F27;
}

/* Selection summary bar */
.broke-summary {
	font-size: 11px;
	color: #37499A;
	background: #f0f3fa;
	border: 1px solid #d1d5e8;
	border-radius: 6px;
	padding: 6px 10px;
	margin-top: 6px;
	display: none;
}

.work-log-row {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 7px 0;
	border-bottom: 1px solid #f0f3fa;
	font-size: 12px;
}

.track-section-title {
	font-size: 11px;
	font-weight: 700;
	color: #37499A;
	text-transform: uppercase;
	letter-spacing: .6px;
	margin-bottom: 8px;
	padding-bottom: 6px;
	border-bottom: 1px solid #e8ebf5;
}

@media ( max-width : 576px) {
	.broke-panel.active {
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}
	.broke-chip {
		padding: 12px 6px;
		font-size: 11px;
	}
	.broke-chip i {
		font-size: 20px;
	}
}

@media ( max-width : 480px) {
	.broke-tab-bar {
		overflow-x: auto;
		flex-wrap: nowrap;
		-webkit-overflow-scrolling: touch;
	}
	.broke-tab {
		padding: 8px 12px;
		font-size: 11px;
		flex-shrink: 0;
		white-space: nowrap;
	}
}

@media ( max-width : 576px) {
	#reportModal .modal-dialog {
		margin: 8px;
	}
	#reportModal .modal-body {
		padding: 14px;
	}
	.row .col-md-6 {
		padding-left: 8px;
		padding-right: 8px;
	}
}

@media ( max-width : 576px) {
	.select2-container .select2-selection--single {
		height: 34px;
		font-size: 13px;
	}
	.select2-results__option {
		font-size: 13px;
		padding: 8px 10px;
	}
}

@media ( max-width : 480px) {
	.stepper {
		flex-wrap: nowrap;
		overflow-x: auto;
		justify-content: flex-start;
		padding-bottom: 4px;
	}
	.step-item {
		min-width: 70px;
	}
	.step-icon {
		width: 34px;
		height: 34px;
		font-size: 13px;
	}
	.step-label {
		font-size: 10px;
	}
}

@media ( max-width : 480px) {
	.work-log-row {
		flex-wrap: wrap;
		gap: 4px 8px;
	}
	.work-log-row>span:first-child {
		min-width: 100%;
	}
}

@media ( max-width : 400px) {
	.notif-dropdown {
		width: 88vw;
		right: -60px;
	}
}

@media ( max-width : 768px) {
	.table-responsive table thead {
		display: none;
	}
	.table-responsive table, .table-responsive tbody, .table-responsive tr,
		.table-responsive td {
		display: block;
		width: 100%;
	}
	.table-responsive tr {
		margin-bottom: 12px;
		border: 1px solid #e3e6f0;
		border-radius: 10px;
		padding: 8px 12px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, .06);
	}
	.table-responsive td {
		border: none !important;
		padding: 6px 0 !important;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		text-align: right;
	}
	.table-responsive td::before {
		content: attr(data-label);
		font-weight: 600;
		color: #37499A;
		font-size: 11px;
		text-align: left;
	}
	.table-responsive td[data-label="Actions"], .table-responsive td[data-label="Track"]
		{
		flex-direction: column;
		align-items: stretch;
		text-align: left;
		gap: 6px;
	}
	.table-responsive td[data-label="Actions"] button, .table-responsive td[data-label="Actions"] .btn-close-action,
		.table-responsive td[data-label="Actions"] .badge-resolved,
		.table-responsive td[data-label="Track"] button {
		width: 100%;
		text-align: center;
		margin: 0 !important;
	}
}

.pager-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 14px;
	padding: 14px 0;
}

.pager-btn {
	background: #37499A;
	color: #fff;
	border: none;
	border-radius: 6px;
	width: 36px;
	height: 36px;
	font-size: 14px;
	cursor: pointer;
}

.pager-btn:disabled {
	background: #d1d5e8;
	cursor: not-allowed;
}

.pager-info {
	font-size: 12px;
	color: #555;
	font-weight: 600;
}

.page-btn {
	background: #fff;
	border: 1px solid #d1d5e8;
	color: #555;
	border-radius: 6px;
	width: 30px;
	height: 30px;
	font-size: 12px;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition: all .15s;
}

.page-btn:hover:not(:disabled) {
	background: #f0f3fa;
	border-color: #37499A;
	color: #37499A;
}

.page-btn:disabled {
	opacity: .4;
	cursor: not-allowed;
}

.page-btn-active {
	background: #37499A;
	border-color: #37499A;
	color: #fff;
	font-weight: 700;
}

@media ( max-width : 576px) {
	#ticketPagination {
		justify-content: center !important;
	}
	.page-btn {
		width: 32px;
		height: 32px;
	}
}
</style>
</head>

<body>
	<div id="wrapper">
		<%@ include file="MaintenanceSideBar.jsp"%>
		<div id="content-wrapper" class="d-flex flex-column">
			<div id="content">

				<nav
					class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top"
					style="background-color: #37499A;">
					<button id="sidebarToggleTop"
						class="btn btn-link rounded-circle mr-3">
						<i class="fa fa-bars"></i>
					</button>
					<ul class="navbar-nav ml-auto"
						style="align-items: center; gap: 16px;">
						<li class="nav-item">
							<div class="notif-bell-wrap" onclick="toggleNotifDropdown()">
								<i class="fas fa-bell text-white" style="font-size: 18px;"
									hidden></i> <span class="notif-badge" id="notifBadge"
									style="display: none;">0</span>
								<div class="notif-dropdown" id="notifDropdown">
									<div
										style="padding: 10px 14px; font-weight: 700; font-size: 12px; color: #37499A; border-bottom: 1px solid #f0f3fa;">
										My Notifications</div>
									<div id="notifList">
										<div class="notif-empty">Loading...</div>
									</div>
								</div>
							</div>
						</li>
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
								<span class="ml-2 d-none d-lg-inline text-white small"
								id="usernameDisplay">Username</span>
						</a>
							<div
								class="dropdown-menu dropdown-menu-right shadow animated--grow-in">
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" onclick="logoutUser(event)"> <i
									class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>Logout
								</a>
							</div></li>
					</ul>
				</nav>

				<div class="container-fluid">
					<div class="d-flex align-items-center justify-content-between mb-4">
						<div>
							<div class="page-heading">
								<i class="fas fa-tools mr-2"></i>Maintenance – Report a Problem
							</div>
							<div class="page-subheading">Raise a machine issue for the
								maintenance team</div>
						</div>
						<!--    <button class="btn-report-problem" data-toggle="modal" data-target="#reportModal">
                        <i class="fas fa-plus-circle"></i> Report a Problem
                    </button> -->
						<button class="btn-report-problem" id="reportProblemBtn">
							<i class="fas fa-plus-circle"></i> Report a Problem
						</button>
					</div>

					<div class="content-card">
						<div class="content-card-header">
							<h6>
								<i class="fas fa-clipboard-list"></i> My Reported Problems
							</h6>
							<small>Click <strong>Track</strong> to view your ticket's
								live status
							</small>
						</div>
						<div class="table-responsive">
							<table class="table table-bordered table-hover mb-0"
								style="width: 100%">
								<thead>
									<tr>
										<th style="width: 140px;">Ticket No.</th>
										<th>Machine Category</th>
										<th>Machine</th>
										<th>Issue Type</th>
										<th>Problem Description</th>
										<th>Date &amp; Time</th>
										<th>Status</th>
										<th>Track</th>
									</tr>
								</thead>
								<tbody id="ticketTbody">
									<tr id="emptyRow">
										<td colspan="8">
											<div class="empty-state">
												<i class="fas fa-inbox"></i>
												<p>
													No problems reported yet. Click <strong>Report a
														Problem</strong> to log an issue.
												</p>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div id="tickerPagination"></div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ═══════════ REPORT MODAL ═══════════ -->
	<div class="modal fade" id="reportModal" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog modal-lg modal-dialog-centered"
			role="document">
			<div class="modal-content">
				<div class="modal-header-custom">
					<div class="modal-title-text">
						<i class="fas fa-exclamation-circle"></i> Report a Problem
					</div>
					<button type="button" class="close" data-dismiss="modal"
						onclick="resetModal()">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="alert alert-success" id="successAlert" role="alert">
						<i class="fas fa-check-circle mr-2"></i> Problem reported! Ticket
						<strong id="tktRef"></strong> has been created.
					</div>

					<div class="reporter-strip">
						<div class="reporter-avatar" id="reporterAvatar">--</div>
						<div>
							<p class="reporter-name" id="reporterName">Loading...</p>
						</div>
					</div>

					<!-- ── REPORTER DETAILS ── -->
					<div class="form-section-title">Reporter Details</div>
					<div class="row">
						<div class="col-md-6 form-group mb-3">
							<label class="form-label-sm">Employee Code – Name <span
								class="req">*</span></label> <select
								class="form-control form-control-sm" id="empCodeSelect">
								<option value="">-- Select Employee --</option>
							</select>
							<!-- hidden field to carry empName to JS -->
							<input type="hidden" id="empNameHidden" />
						</div>


						<div class="col-md-6 form-group mb-3">
							<label class="form-label-sm">Mobile Number <span
								class="req">*</span></label> <input type="text"
								class="form-control form-control-sm" id="mobileInput"
								placeholder="Auto-filled or enter manually" maxlength="10" /> <small
								class="text-muted" style="font-size: 11px;"> Auto-filled
								from employee record. Edit if needed. </small>
						</div>
					</div>

					<!-- ── MACHINE INFORMATION ── -->
					<div class="form-section-title">Machine Information</div>
					<div class="row">
						<div class="col-md-6 form-group mb-3">
							<label class="form-label-sm">Machine Category <span
								class="req">*</span></label> <select
								class="form-control form-control-sm" id="catSelect"
								onchange="onCategoryChange()">
								<option value="">-- Select Machine Type --</option>
							</select>
						</div>
						<div class="col-md-6 form-group mb-3">
							<label class="form-label-sm">Machine <span class="req">*</span></label>
							<select class="form-control form-control-sm" id="machineSelect"
								disabled>
								<option value="">-- Select Machine --</option>
							</select>
						</div>
					</div>

					<div class="row">
						<div class="col-md-6 form-group mb-3">
							<label class="form-label-sm">Breakdown Location</label> <input
								type="text" class="form-control form-control-sm"
								id="bkLocationInput" maxlength="200"
								placeholder="e.g. Shop Floor 2, Line 3 (optional)" /> <small
								class="text-muted" style="font-size: 11px;">Optional —
								leave blank if not applicable.</small>
						</div>
					</div>

					<!-- ── WHAT BROKE – multi-select across tabs ── -->
					<div class="form-section-title mt-1">
						Type of Issues? <span class="req"></span> <span
							style="font-size: 10px; color: #888; font-weight: 400; text-transform: none; letter-spacing: 0;">
							&nbsp;(You can select multiple items across tabs) </span>
					</div>

					<!-- Tab bar -->
					<div class="broke-tab-bar">
						<button class="broke-tab active-elec" id="tab-elec"
							onclick="switchBrokeTab('elec')">
							<span class="tab-dot dot-elec"></span>Electrical
						</button>
						<button class="broke-tab" id="tab-mech"
							onclick="switchBrokeTab('mech')">
							<span class="tab-dot dot-mech"></span>Mechanical
						</button>
						<button class="broke-tab" id="tab-hydr"
							onclick="switchBrokeTab('hydr')">
							<span class="tab-dot dot-hydr"></span>Hydraulics
						</button>
					</div>

					<!-- Electrical -->
					<div class="broke-panel active" id="panel-elec">
						<div class="broke-chip"
							onclick="selectBroke(this,'Panel / Wiring','elec')">
							<i class="fas fa-bolt"></i>Panel / Wiring
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Sensor','elec')">
							<i class="fas fa-satellite-dish"></i>Sensor
						</div>
						<div class="broke-chip" onclick="selectBroke(this,'Motor','elec')">
							<i class="fas fa-wind"></i>Motor
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'PLC / Control','elec')">
							<i class="fas fa-microchip"></i>PLC / Control
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'VFD / Drive','elec')">
							<i class="fas fa-sliders-h"></i>VFD / Drive
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Breaker / Fuse','elec')">
							<i class="fas fa-plug"></i>Breaker / Fuse
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Wiring Fault','elec')">
							<i class="fas fa-project-diagram"></i>Wiring Fault
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Other (Elec)','elec')">
							<i class="fas fa-ellipsis-h"></i>Other
						</div>
					</div>

					<!-- Mechanical -->
					<div class="broke-panel" id="panel-mech">
						<div class="broke-chip"
							onclick="selectBroke(this,'Belt / Chain','mech')">
							<i class="fas fa-link"></i>Belt / Chain
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Gear / Bearing','mech')">
							<i class="fas fa-cog"></i>Gear / Bearing
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Cylinder','mech')">
							<i class="fas fa-compress-arrows-alt"></i>Cylinder
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Tool / Spindle','mech')">
							<i class="fas fa-tools"></i>Tool / Spindle
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Coupling / Shaft','mech')">
							<i class="fas fa-circle-notch"></i>Coupling / Shaft
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Frame / Structure','mech')">
							<i class="fas fa-drafting-compass"></i>Frame / Structure
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Lubrication','mech')">
							<i class="fas fa-oil-can"></i>Lubrication
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Other (Mech)','mech')">
							<i class="fas fa-ellipsis-h"></i>Other
						</div>
					</div>

					<!-- Hydraulics -->
					<div class="broke-panel" id="panel-hydr">
						<div class="broke-chip" onclick="selectBroke(this,'Pump','hydr')">
							<i class="fas fa-tint"></i>Pump
						</div>
						<div class="broke-chip" onclick="selectBroke(this,'Valve','hydr')">
							<i class="fas fa-sliders-h"></i>Valve
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Hose / Pipe','hydr')">
							<i class="fas fa-water"></i>Hose / Pipe
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Coolant System','hydr')">
							<i class="fas fa-thermometer-half"></i>Coolant System
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Hyd. Cylinder','hydr')">
							<i class="fas fa-expand-arrows-alt"></i>Hyd. Cylinder
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Seal / Gasket','hydr')">
							<i class="fas fa-ring"></i>Seal / Gasket
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Accumulator','hydr')">
							<i class="fas fa-battery-half"></i>Accumulator
						</div>
						<div class="broke-chip"
							onclick="selectBroke(this,'Other (Hydr)','hydr')">
							<i class="fas fa-ellipsis-h"></i>Other
						</div>
					</div>

					<!-- Live selection summary -->
					<div class="broke-summary" id="brokeSelectionSummary"></div>

					<!-- ── PROBLEM DETAILS ── -->
					<div class="form-section-title mt-3">Problem Details</div>
					<div class="form-group mb-1">
						<label class="form-label-sm">Problem Description <span
							class="req">*</span></label>
						<textarea class="form-control form-control-sm" id="problemDesc"
							rows="4"
							placeholder="Describe the problem clearly – what happened, when it started, any unusual sounds, errors..."></textarea>
					</div>
				</div>
				<!-- /modal-body -->

				<div class="modal-footer d-flex justify-content-end"
					style="gap: 10px;">
					<button type="button" class="btn-cancel-modal" data-dismiss="modal"
						onclick="resetModal()">Cancel</button>
					<button type="button" class="btn-submit-modal"
						onclick="submitReport()">
						<i class="fas fa-paper-plane"></i> Submit Report
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- ═══════════ TRACK STATUS MODAL ═══════════ -->
	<div class="modal fade" id="trackModal" tabindex="-1" role="dialog"
		aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document"
			style="max-width: 520px;">
			<div class="modal-content">
				<div class="modal-header-custom">
					<div class="modal-title-text">
						<i class="fas fa-search-location"></i> Track Ticket Status
					</div>
					<button type="button" class="close" data-dismiss="modal">
						<span>&times;</span>
					</button>
				</div>
				<div class="modal-body" id="trackTimeline">
					<div class="text-center py-4">
						<i class="fas fa-spinner fa-spin"></i> Loading...
					</div>
				</div>
				<div class="modal-footer d-flex justify-content-end">
					<button type="button" class="btn-cancel-modal" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>

	<a class="scroll-to-top rounded" href="#page-top"><i
		class="fas fa-angle-up"></i></a>


	<script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
	<script
		src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.full.min.js"></script>

	<script src="js/config.js?v=<%=jsVersion%>"></script>

	<script src="js/logout.js?v=<%=jsVersion%>"></script>
	<script src="js/username.js?v=<%=jsVersion%>"></script>
	<script src="js/factoryid.js?v=<%=jsVersion%>"></script>
	<script src="js/Sessionfilter.js?v=<%=jsVersion%>"></script>
	<script src="js/MaintenanceTicker.js?v=<%=jsVersion%>"></script>
	<script>
function toggleNotifDropdown() {
    $('#notifDropdown').toggleClass('open');
}
$(document).on('click', function (e) {
    if (!$(e.target).closest('.notif-bell-wrap').length) {
        $('#notifDropdown').removeClass('open');
    }
});
</script>
</body>
</html>
