
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
<title>JSSL – My Work Tickets</title>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="css/ruang-admin.min.css" rel="stylesheet">
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

.row-inprogress td {
	border-left: 3px solid #ffc107;
}

.row-fixed td {
	border-left: 3px solid #198754;
}

.row-closed td {
	border-left: 3px solid #adb5bd;
	opacity: .7;
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

.btn-start-work {
	background: #37499A;
	color: #fff;
	border: none;
	border-radius: 5px;
	padding: 5px 14px;
	font-size: 11px;
	font-weight: 600;
	cursor: pointer;
}

.btn-start-work:hover {
	background: #2c3c85;
}

.btn-mark-fixed {
	background: #198754;
	color: #fff;
	border: none;
	border-radius: 5px;
	padding: 5px 14px;
	font-size: 11px;
	font-weight: 600;
	cursor: pointer;
}

.btn-mark-fixed:hover {
	background: #146c43;
}

.work-timer {
	font-size: 11px;
	color: #664d03;
	font-weight: 700;
	background: #fff3cd;
	padding: 3px 10px;
	border-radius: 20px;
}

/* Modal */
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
}

.btn-cancel-modal:hover {
	background: #f0f3fa;
}

.btn-submit-modal {
	background: #198754;
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
}

.btn-submit-modal:hover {
	background: #146c43;
}

/* Notif */
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
	width: 300px;
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

/* Toast */
.toast-notif {
	position: fixed;
	bottom: 24px;
	right: 24px;
	padding: 12px 20px;
	border-radius: 8px;
	font-size: 13px;
	font-weight: 600;
	color: #fff;
	opacity: 0;
	transition: opacity .3s;
	z-index: 99999;
}

.toast-success {
	background: #198754;
}

.toast-notif.show {
	opacity: 1;
}

button.close {
	padding: 0;
	background: transparent;
	border: 0;
}

.btn-pause-work {
	background: #ffc107;
	color: #212529;
	border: none;
	border-radius: 5px;
	padding: 5px 12px;
	font-size: 11px;
	font-weight: 600;
	cursor: pointer;
	margin-right: 4px;
}

.btn-pause-work:hover {
	background: #e0a800;
}

.btn-resume-work {
	background: #0d6efd;
	color: #fff;
	border: none;
	border-radius: 5px;
	padding: 5px 12px;
	font-size: 11px;
	font-weight: 600;
	cursor: pointer;
	margin-right: 4px;
}

.btn-resume-work:hover {
	background: #0b5ed7;
}

/* Resolved badge */
.badge-resolved {
	background: #d1e7dd;
	color: #0f5132;
	padding: 5px 12px;
	border-radius: 20px;
	font-size: 11px;
	font-weight: 600;
}

/* Toast info variant */
.toast-info {
	background: #0d6efd;
}

/* ── FLOATING TIMER BAR ────────────────────────────────────────────────── */
#floatingTimer {
	display: none; /* shown by JS */
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 56px;
	background: linear-gradient(90deg, #1a2460 0%, #37499A 60%, #4CAF50 100%);
	color: #fff;
	z-index: 99998;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24px;
	box-shadow: 0 -3px 16px rgba(0, 0, 0, .25);
	gap: 16px;
}

#ft-info {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 13px;
	font-weight: 600;
	min-width: 0;
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

#ft-broke {
	font-size: 11px;
	opacity: .75;
}

#ft-center {
	display: flex;
	align-items: center;
	gap: 10px;
	flex-shrink: 0;
}

#ft-clock {
	font-size: 22px;
	font-weight: 700;
	font-variant-numeric: tabular-nums;
	letter-spacing: 1px;
	color: #fff;
}

#ft-status-tag {
	font-size: 11px;
	font-weight: 700;
	padding: 3px 10px;
	border-radius: 20px;
	background: #d1e7dd;
	color: #0f5132;
	transition: background .3s, color .3s;
}

#ft-actions {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-shrink: 0;
}

#ft-pause-btn, #ft-resume-btn, #ft-fixed-btn {
	border: none;
	border-radius: 6px;
	padding: 6px 14px;
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 5px;
	transition: opacity .15s;
}

#ft-pause-btn {
	background: #ffc107;
	color: #212529;
}

#ft-pause-btn:hover {
	opacity: .85;
}

#ft-resume-btn {
	background: #0d6efd;
	color: #fff;
}

#ft-resume-btn:hover {
	opacity: .85;
}

#ft-fixed-btn {
	background: #198754;
	color: #fff;
}

#ft-fixed-btn:hover {
	opacity: .85;
}

/* Push the page content up so it isn't hidden behind the bar */
body.has-active-timer #content-wrapper {
	padding-bottom: 64px;
}

.item-row-label {
	transition: background .15s;
}

.item-row-label:hover, .item-row-label:active {
	background: #f0f3fa;
}

.item-row-label:has(.item-checkbox:checked) {
	background: #eef1fb;
	border-left: 3px solid #37499A;
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
	.table-responsive td[data-label="Actions"] {
		flex-direction: column;
		align-items: stretch;
		text-align: left;
		gap: 6px;
	}
	.table-responsive td[data-label="Actions"] button, .table-responsive td[data-label="Actions"] .btn-close-action,
		.table-responsive td[data-label="Actions"] .badge-resolved {
		width: 100%;
		text-align: center;
		margin: 0 !important;
	}
}

@media ( max-width : 576px) {
	#floatingTimer {
		height: auto;
		min-height: 56px;
		flex-wrap: wrap;
		padding: 8px 12px;
		gap: 8px;
	}
	#ft-info {
		flex: 1 1 100%;
		order: 1;
		font-size: 12px;
	}
	#ft-center {
		order: 2;
	}
	#ft-actions {
		order: 3;
		flex: 1 1 100%;
		justify-content: center;
	}
	#ft-clock {
		font-size: 18px;
	}
}

@media ( max-width : 768px) {
	#activeTimerPills {
		max-width: 55vw;
		overflow-x: auto;
		flex-wrap: nowrap !important;
		-webkit-overflow-scrolling: touch;
	}
	#activeTimerPills>div {
		flex-shrink: 0;
	}
}

@media ( max-width : 400px) {
	.notif-dropdown {
		width: 88vw;
		right: -60px;
	}
}

@media ( max-width : 480px) {
	.modal-footer {
		flex-direction: column;
	}
	.btn-cancel-modal, .btn-submit-modal {
		width: 100%;
		justify-content: center;
	}
}

.btn-close-action {
	color: #fff;
	border: none;
	border-radius: 5px;
	padding: 5px 14px;
	font-size: 11px;
	font-weight: 600;
	cursor: pointer;
}

.work-hours-summary h6 {
	color: #37499A;
	font-weight: 700;
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
							class="nav-link dropdown-toggleww" href="#" role="button"
							data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<i class="fas fa-user text-white mr-2"></i> <span
								class="ml-2 d-none d-lg-inline text-white small"
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
								<i class="fas fa-wrench mr-2"></i>My Work – Assigned Tickets
							</div>
							<div class="page-subheading">Start work, track your time,
								and mark tickets as fixed</div>
						</div>
					</div>

					<div class="content-card">
						<div class="content-card-header">
							<h6>
								<i class="fas fa-hard-hat"></i> My Assigned Tickets
							</h6>
							<small>Click <strong>Start Work</strong> to begin
								tracking your time
							</small>
						</div>
						<div class="table-responsive">
							<table class="table table-bordered table-hover mb-0"
								style="width: 100%">
								<thead>
									<tr>
										<th>Ticket No.</th>
										<th>Machine Category</th>
										<th>Machine</th>
										<th>Issue Types</th>
										<th>Problem Description</th>
										<th>Status</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody id="workerTicketTbody">
									<tr>
										<td colspan="7">
											<div class="empty-state">
												<i class="fas fa-clipboard-check"></i>
												<p>Loading your tickets...</p>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ════════════════ MARK FIXED MODAL ════════════════ -->
	<div class="modal fade" id="fixedModal" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header-custom">
					<div class="modal-title-text">
						<i class="fas fa-check-circle"></i> Mark Ticket as Fixed
					</div>
					<button type="button" class="close" data-dismiss="modal">
						<span>&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="form-section-title">Work Completion Details</div>
					<div class="form-group mb-3">
						<label class="form-label-sm">What did you fix? <span
							style="color: #dc3545;">*</span></label>
						<textarea class="form-control form-control-sm" id="whatFixed"
							rows="3"
							placeholder="Describe exactly what was repaired, replaced, or resolved..."></textarea>
					</div>
					<div class="form-group mb-2">
						<label class="form-label-sm">Remarks <small
							class="text-muted">(optional)</small></label>
						<textarea class="form-control form-control-sm" id="fixRemarks"
							rows="2" placeholder="Any additional observations..."></textarea>
					</div>

					<!-- Parts Replaced -->
					<div class="form-group mt-3 mb-1">
						<div class="form-check">
							<input class="form-check-input" type="checkbox"
								id="chkPartsReplaced"> <label class="form-check-label"
								for="chkPartsReplaced"
								style="font-size: 13px; font-weight: 600; color: #37499A;">
								<i class="fas fa-box-open mr-1"></i> Any parts / items replaced?
							</label>
						</div>
					</div>

					<div id="partsSection"
						style="display: none; border: 1px solid #e3e6f0; border-radius: 8px; padding: 14px; background: #f8f9fd;">
						<div class="form-section-title mb-2">Items Used</div>

						<!-- Search bar — add this block -->
						<div style="position: relative; margin-bottom: 8px;">
							<i class="fas fa-search"
								style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #aaa; font-size: 12px; pointer-events: none;"></i>
							<input type="text" id="itemSearchInput"
								placeholder="Search items..."
								style="width: 100%; padding: 7px 10px 7px 30px; font-size: 13px; border: 1px solid #d1d5e8; border-radius: 6px; outline: none; box-sizing: border-box;">
							<span id="itemSearchCount"
								style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 11px; color: #aaa;"></span>
						</div>

						<!-- Items checklist loads here -->
						<div id="itemsCheckList"
							style="max-height: 200px; overflow-y: auto; margin-bottom: 10px; touch-action: pan-y;">
							<div
								style="text-align: center; color: #aaa; font-size: 12px; padding: 10px;">
								<i class="fas fa-spinner fa-spin"></i> Loading items...
							</div>
						</div>

						<!-- Selected items quantity table -->
						<div id="selectedItemsTable"
							style="display: none; margin-top: 10px;">
							<div class="form-section-title mb-2">Enter Quantities</div>
							<table class="table table-sm table-bordered mb-0"
								style="font-size: 12px;">
								<thead style="background: #f4f6fb;">
									<tr>
										<th>Item</th>
										<th style="width: 120px;">Unit</th>
										<th style="width: 120px;">Quantity <span
											style="color: #dc3545;">*</span></th>
									</tr>
								</thead>
								<tbody id="selectedItemsBody"></tbody>
							</table>
						</div>
					</div>

					<div class="alert alert-info"
						style="font-size: 12px; border-radius: 8px; margin-top: 12px;">
						<i class="fas fa-info-circle mr-1"></i> Your work end time will be
						recorded Now, And Work hours calculated automatically.
					</div>
				</div>
				<div class="modal-footer d-flex justify-content-end"
					style="gap: 10px;">
					<button type="button" class="btn-cancel-modal" data-dismiss="modal">Cancel</button>
					<button type="button" class="btn-submit-modal"
						onclick="submitMarkFixed()">
						<i class="fas fa-check-double"></i> Submit &amp; Notify Supervisor
					</button>
				</div>
			</div>
		</div>



	</div>



	<div class="modal fade" id="transferModal" tabindex="-1" role="dialog"
		data-backdrop="static">

		<div class="modal-dialog modal-dialog-centered">

			<div class="modal-content">

				<div class="modal-header">
					<h5 class="modal-title">Transfer Ticket Request</h5>
				</div>

				<div class="modal-body">

					<div class="form-group">

						<label> Reason For Transfer </label>

						<textarea id="transferReason" class="form-control" rows="4"
							placeholder="Enter transfer reason">
                    </textarea>

					</div>

				</div>

				<div class="modal-footer">

					<button type="button" class="btn btn-secondary"
						data-dismiss="modal">Cancel</button>

					<button type="button" class="btn btn-warning"
						onclick="submitTransferRequest()">Send Request</button>

				</div>

			</div>

		</div>

	</div>

	<div class="modal fade" id="empVerifyModal" tabindex="-1" role="dialog"
		aria-labelledby="empVerifyTitle" aria-hidden="true"
		data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-dialog-centered" role="document"
			style="max-width: 420px;">
			<div class="modal-content"
				style="border-radius: 12px; overflow: hidden; border: 1px solid #c8e6d8;">

				<!-- Header -->
				<div style="background: #3d7a5c; padding: 20px 24px;">
					<div style="display: flex; align-items: center; gap: 10px;">
						<div
							style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255, 255, 255, .15); display: flex; align-items: center; justify-content: center;">
							<i class="fas fa-id-badge" style="color: #fff; font-size: 18px;"></i>
						</div>
						<div>
							<div style="color: #fff; font-size: 15px; font-weight: 700;">
								Worker Verification</div>
							<div style="color: #b8d9cb; font-size: 12px; margin-top: 2px;">
								JSSL Maintenance System</div>
						</div>
					</div>
				</div>

				<!-- Body -->
				<div style="padding: 24px 24px 18px;">

					<p
						style="font-size: 13px; color: #4a6659; margin: 0 0 18px; line-height: 1.6;">
						Please enter your <strong>Employee Code</strong> to access your
						assigned tickets. This keeps your work records accurate.
					</p>

					<label
						style="font-size: 12px; font-weight: 700; color: #3d7a5c; display: block; margin-bottom: 6px;">
						Employee Code <span style="color: #dc3545;">*</span>
					</label> <input type="text" id="empCodeInput"
						class="form-control form-control-sm" placeholder="e.g. EMP-1023"
						style="border: 1.5px solid #c8e6d8; border-radius: 7px; font-size: 14px; letter-spacing: 0.5px; padding: 9px 12px;" />

					<!-- Error message -->
					<div id="empVerifyError"
						style="display: none; margin-top: 10px; font-size: 12px; color: #dc3545; background: #fff5f5; border: 1px solid #f5c6cb; border-radius: 6px; padding: 8px 12px;">
					</div>

					<div style="margin-top: 8px; font-size: 11px; color: #8aaa99;">
						<i class="fas fa-info-circle mr-1"></i> Your code will be
						remembered on this device.
					</div>
				</div>

				<!-- Footer -->
				<div
					style="padding: 14px 24px 20px; background: #f7faf8; border-top: 1px solid #e8f3ee;">
					<button id="empVerifyBtn" onclick="submitEmpVerify()"
						style="width: 100%; background: #3d7a5c; color: #fff; border: none; border-radius: 7px; padding: 11px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; letter-spacing: 0.3px;">
						<i class="fas fa-unlock-alt"></i> Verify &amp; Continue
					</button>
				</div>


				<div class="modal fade" id="workHoursSummaryModal" tabindex="-1"
					role="dialog" aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered" role="document">
						<div class="modal-content">
							<div class="modal-header-custom">
								<div class="modal-title-text">
									<i class="fas fa-clock"></i> Ticket Closed – Work Hours
								</div>
								<button type="button" class="close" data-dismiss="modal">
									<span>&times;</span>
								</button>
							</div>
							<div class="modal-body" id="workHoursBody"></div>
							<div class="modal-footer d-flex justify-content-end">
								<button type="button" class="btn-cancel-modal"
									data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>


	<a class="scroll-to-top rounded" href="#page-top"><i
		class="fas fa-angle-up"></i></a>


	<script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
	<script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
	<script
		src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.full.min.js"></script>
	<script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
	<script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
	<script
		src="js/factoryid.js?v=<%=ver(application, "/js/factoryid.js")%>"></script>
	<script
		src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
	<script
		src="js/Maintenanceworker.js?v=<%=ver(application, "/js/Maintenanceworker.js")%>"></script>

	<script
		src="externalLibrary/cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
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
