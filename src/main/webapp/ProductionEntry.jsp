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
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link href="img/logo/download.png" rel="icon">
<title>JSSL - Production Entry</title>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet"
	type="text/css" />
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<link href="css/ruang-admin.min.css" rel="stylesheet" />
<link href="vendor/datatables/dataTables.bootstrap4.min.css"
	rel="stylesheet">
<link rel="stylesheet"
	href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
<link rel="stylesheet" href="css/main.css">
<link
	href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
	rel="stylesheet" />


<link
	href="externalLibrary/cdn.jsdelivr.net/npm/@ttskch/select2-bootstrap4-theme@1.5.2/dist/select2-bootstrap4.min.css"
	rel="stylesheet">

<script src="js/sidebar.js"></script>

<style>
/* ====================================
   THEME  -  one consistent accent color
   used for buttons, both tables, chips,
   badges and every accent in this page.
==================================== */
:root {
	--primary: #4CAF50;
	--primary-dark: #166F46;
	--primary-darker: #0F5233;
	--primary-light: #E6F5EC;
	--text: #1F2937;
	--text-muted: #64748B;
	--border: #E2E8F0;
	--surface: #FFFFFF;
	--bg: #F7F9FB;
	--danger: #DC3545;
	--radius: 10px;
}

body {
	color: var(--text);
	background: var(--bg);
}

.error-message {
	color: var(--danger);
	font-size: 12px;
	margin-top: 4px;
	display: none;
}

button {
	padding: 7px 18px;
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 0.2px;
	background-color: var(--primary);
	color: #fff;
	border: none;
	border-radius: 7px;
	cursor: pointer;
	transition: background-color .15s ease, box-shadow .15s ease, transform
		.05s ease;
	box-shadow: 0 1px 2px rgba(15, 82, 51, 0.15);
}

button:hover {
	background-color: var(--primary-dark);
	box-shadow: 0 2px 6px rgba(15, 82, 51, 0.25);
}

button:active {
	transform: translateY(1px);
}

button.close {
	padding: 0;
	background: transparent;
	border: 0;
	box-shadow: none;
}

.modal-content {
	border-radius: var(--radius);
	overflow: hidden;
	border: none;
	box-shadow: 0 16px 48px rgba(15, 23, 42, 0.16);
}

.modal-header {
	background: var(--surface);
	border-bottom: 2px solid var(--primary);
	padding: 14px 22px;
}

.modal-header .modal-title {
	color: var(--text);
	font-weight: 700;
}

.modal-header .close span {
	color: var(--text-muted);
}

.modal-body {
	padding: 22px;
	background: var(--bg);
}

.modal-footer {
	border-top: 1px solid var(--border);
	padding: 16px 22px;
	background: var(--surface);
}

.popup {
	position: fixed;
	top: 20px;
	right: 20px;
	background-color: var(--primary);
	color: #fff;
	padding: 12px 20px;
	border-radius: 8px;
	z-index: 9999;
	box-shadow: 0 6px 20px rgba(15, 82, 51, 0.25);
}

/* ============================
   STEP SECTIONS
============================ */
.step-block {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	padding: 20px;
	margin-bottom: 16px;
	box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.step-label {
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.5px;
	text-transform: uppercase;
	color: var(--primary-darker);
	margin-bottom: 12px;
	display: flex;
	align-items: center;
	gap: 8px;
}

.step-label .step-num {
	background: var(--primary);
	color: #fff;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 11px;
}

/* Employee selected card */
.emp-selected-card {
	display: none;
	align-items: center;
	gap: 16px;
	background: var(--primary-light);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	padding: 12px 16px;
	margin-top: 14px;
}

.emp-avatar {
	width: 44px;
	height: 44px;
	border-radius: 50%;
	background: var(--primary);
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	font-size: 16px;
	flex-shrink: 0;
	box-shadow: 0 2px 6px rgba(15, 82, 51, 0.25);
}

.emp-selected-card .emp-name {
	font-weight: 700;
	color: var(--text);
	margin: 0;
	font-size: 14px;
}

.emp-selected-card .emp-meta {
	font-size: 12px;
	color: var(--text-muted);
	margin: 0;
}

.emp-tag {
	background: var(--surface);
	color: var(--primary-darker);
	font-weight: 600;
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 11px;
	border: 1px solid var(--border);
}

/* Mode pill toggle */
.mode-pill-group {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}

.mode-pill-group input[type="radio"] {
	position: absolute;
	opacity: 0;
	pointer-events: none;
}

.mode-pill {
	padding: 8px 18px;
	border-radius: 20px;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	border: 1.5px solid var(--border);
	color: var(--text-muted);
	background: var(--surface);
	transition: all .15s ease;
}

.mode-pill i {
	margin-right: 6px;
}

.mode-pill-group input:checked+.mode-pill {
	background: var(--primary);
	border-color: var(--primary);
	color: #fff;
	box-shadow: 0 2px 6px rgba(15, 82, 51, 0.25);
}

/* Entry table */
#prodEntryTable thead th {
	background: var(--primary);
	color: #fff;
	font-weight: 600;
	font-size: 12px;
	letter-spacing: 0.3px;
	text-align: center;
	padding: 10px 8px;
	border: 1px solid var(--primary-dark);
}

#prodEntryTable tbody td {
	padding: 8px;
	text-align: center;
	vertical-align: middle;
	border: 1px solid var(--border);
	font-size: 13px;
}

#prodEntryTable tbody tr:nth-child(even) {
	background-color: var(--bg);
}

#prodEntryTable tbody tr:hover {
	background-color: var(--primary-light);
}

#prodEntryTable .day-weekend {
	color: var(--danger);
	font-weight: 600;
}

#prodEntryTable input[type="number"] {
	text-align: center;
	border-radius: 6px;
}

.locked-input {
	background-color: #eef0f2 !important;
	pointer-events: none;
}

.hours-chip {
	display: inline-block;
	padding: 3px 10px;
	border-radius: 20px;
	background: var(--primary-light);
	color: var(--primary-darker);
	font-weight: 700;
	font-size: 12px;
}

.row-action-icon {
	cursor: pointer;
	font-size: 14px;
	margin: 0 4px;
	transition: opacity .15s ease;
}

.row-action-icon:hover {
	opacity: 0.7;
}

.row-action-icon.edit {
	color: var(--primary);
}

.row-action-icon.delete {
	color: var(--danger);
}

/* Grand total footer inside modal */
.grand-total-bar {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	padding: 14px 18px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin-top: 14px;
	box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.grand-total-bar .label {
	font-size: 11px;
	color: var(--text-muted);
	font-weight: 600;
	letter-spacing: 0.4px;
	text-transform: uppercase;
}

.grand-total-bar .value {
	font-size: 18px;
	font-weight: 700;
	color: var(--text);
}

/* Main list cards */
.prod-list-card {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	padding: 10px 0;
	box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
}

.mode-badge {
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 11px;
	font-weight: 700;
	color: #fff;
}

.mode-month {
	background: var(--primary);
}

.mode-week {
	background: var(--primary-dark);
}

.mode-day {
	background: var(--primary-darker);
}

#tableProdEntryList thead th {
	background: var(--primary);
	color: #fff;
	font-weight: 600;
	text-align: center;
	letter-spacing: 0.3px;
	padding: 11px 8px;
	border: 1px solid var(--primary-dark);
}

#tableProdEntryList tbody tr:hover {
	background-color: var(--primary-light);
}

.production-list-header {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 15px;
	min-height: 40px;
}

.production-list-title {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	margin: 0;
	font-weight: 700;
	color: var(--text);
}

.production-header-spacer {
	width: 90px;
}
</style>

<script>
	const user_id = sessionStorage.getItem('user_id');
	if (!user_id) {
		window.location.href = "newlogin.jsp";
	}
</script>
<body>
	<div id="wrapper">
		<%@ include file="EmpSidebar.jsp"%>

		<div id="content-wrapper" class="d-flex flex-column">
			<div id="content">

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
								<span class="ml-2 d-none d-lg-inline text-white small"
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

				<div class="container-fluid" id="container-wrapper">

					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800"></h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="EmpDashBoard.jsp">Home</a></li>
							<li class="breadcrumb-item"><a href="#">Production Entry</a></li>
						</ol>
					</div>

					<!-- 	<div class="d-flex justify-content-between align-items-center mb-3" style="max-width: 1100px; margin: 0 auto;">
						<h4 class="mb-0 text-gray-800" style="font-weight:700;">Production Entry</h4>
						<button id="prodEntryCreateBtn"><i class="fas fa-plus"></i> Create</button>
					</div> -->


					<div class="production-list-header"
						style="max-width: 1100px; margin: 0 auto;">

						<button id="prodEntryCreateBtn">
							<i class="fas fa-plus"></i> Create
						</button>

						<h4 class="production-list-title">Production Entry</h4>

						<div class="production-header-spacer"></div>

					</div>

					<div class="prod-list-card"
						style="max-width: 1100px; margin: 0 auto;">
						<div class="table-responsive p-3">
							<table class="table table-striped table-bordered table-sm"
								id="tableProdEntryList" width="100%">
								<thead>
									<tr>
										<th>Sl.No.</th>
										<th>Employee</th>
										<th>Department</th>
										<th>Designation</th>
										<th>Year</th>

										<th>Period</th>
										<th>Total Target (T)</th>
										<th>Total Actual (T)</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody></tbody>
							</table>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>

	<!-- ============================
		 CREATE PRODUCTION ENTRY MODAL
	============================ -->
	<div class="modal fade" id="prodEntryModal" tabindex="-1" role="dialog"
		aria-hidden="true">
		<div class="modal-dialog modal-dialog-scrollable"
			style="max-width: 1100px;" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">
						<b>Production Entry</b>
					</h5>
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">

					<!-- STEP 1: EMPLOYEE -->
					<div class="step-block">
						<div class="step-label">
							<span class="step-num">1</span> Select Employee
						</div>
						<select id="empSelect" class="form-control form-control-sm"
							style="width: 100%;">
							<option value="">Search by name or employee code...</option>
						</select>
						<div id="empSelectError" class="error-message">Please select
							an employee</div>

						<div class="emp-selected-card" id="empSelectedCard">
							<div class="emp-avatar" id="empAvatarInitials">--</div>
							<div>
								<p class="emp-name" id="empNameDisplay">-</p>
								<p class="emp-meta">
									Emp Code: <span id="empCodeDisplay">-</span>
								</p>
							</div>
							<div class="ml-auto d-flex" style="gap: 8px;">
								<span class="emp-tag" id="empDeptDisplay">Department: -</span> <span
									class="emp-tag" id="empDesgDisplay">Designation: -</span>
							</div>
						</div>
					</div>

					<!-- STEP 2: YEAR + MODE -->
					<div class="step-block">
						<div class="step-label">
							<span class="step-num">2</span> Select Year &amp; Entry Type
						</div>
						<div class="row">
							<div class="col-md-3 mb-2">
								<label class="form-label"
									style="font-size: 12px; font-weight: 600;">Year</label> <select
									id="prodYearSelect" class="form-control form-control-sm">
									<option value="">Select Year</option>
								</select>
							</div>
							<div class="col-md-9 mb-2">
								<label class="form-label"
									style="font-size: 12px; font-weight: 600;">Entry Type</label>
								<div class="mode-pill-group">
									<input type="radio" name="entryMode" id="modeMonth"
										value="month"> <label class="mode-pill"
										for="modeMonth"><i class="fas fa-calendar-alt"></i>By
										Month</label> <input type="radio" name="entryMode" id="modeWeek"
										value="week"> <label class="mode-pill" for="modeWeek"><i
										class="fas fa-calendar-week"></i>By Week</label> <input type="radio"
										name="entryMode" id="modeDay" value="day"> <label
										class="mode-pill" for="modeDay"><i
										class="fas fa-calendar-day"></i>By Day</label>
								</div>
							</div>
						</div>

						<!-- Dynamic sub-selectors -->
						<div class="row" id="modeSubSelectors" style="display: none;">
							<div class="col-md-3 mb-2" id="monthSelectWrap"
								style="display: none;">
								<label class="form-label"
									style="font-size: 12px; font-weight: 600;">Month</label> <select
									id="prodMonthSelect" class="form-control form-control-sm">
									<option value="">Select Month</option>
								</select>
							</div>
							<div class="col-md-3 mb-2" id="weekSelectWrap"
								style="display: none;">
								<label class="form-label"
									style="font-size: 12px; font-weight: 600;">Week</label> <select
									id="prodWeekSelect" class="form-control form-control-sm">
									<option value="">Select Week</option>
								</select>
							</div>
							<div class="col-md-3 mb-2" id="daySelectWrap"
								style="display: none;">
								<label class="form-label"
									style="font-size: 12px; font-weight: 600;">Date</label> <input
									type="date" id="prodDaySelect"
									class="form-control form-control-sm">
							</div>
							<div class="col-md-3 mb-2 d-flex align-items-end">
								<button type="button" id="generateRowsBtn" style="width: 100%;">
									<i class="fas fa-table"></i> Generate
								</button>
							</div>
						</div>
					</div>

					<!-- STEP 3: ENTRY TABLE -->
					<div class="step-block" id="entryTableBlock" style="display: none;">
						<div class="step-label">
							<span class="step-num">3</span> Enter Tonnage Details
						</div>

						<div class="table-responsive">
							<table class="table table-bordered table-sm" id="prodEntryTable"
								width="100%">
								<thead>
									<tr>
										<th>Day</th>
										<th>Date</th>
										<th>Hours Worked</th>
										<th>Target Tonnage (T)</th>
										<th>Actual Tonnage (T)</th>
										<th>Action</th>
										<th>Delete</th>
									</tr>
								</thead>
								<tbody id="prodEntryTableBody"></tbody>
							</table>
						</div>

						<div class="grand-total-bar">
							<div>
								<span class="label">Total Target Tonnage</span><br> <span
									class="value" id="grandTargetTotal">0.00 T</span>
							</div>
							<div>
								<span class="label">Total Actual Tonnage</span><br> <span
									class="value" id="grandActualTotal">0.00 T</span>
							</div>
							<div>
								<span class="label">Variance</span><br> <span class="value"
									id="grandVariance">0.00 T</span>
							</div>
						</div>
					</div>

				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal" style="background-color: #6c757d;">Close</button>
					<button type="button" class="btn btn-sm" id="saveProdEntryBtn"
						style="background-color: green; color: white;">Create</button>
				</div>
			</div>
		</div>
	</div>

	<!-- CONFIRM CREATE -->
	<div class="modal fade" id="confirmProdEntry" tabindex="-1"
		role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
				<div class="modal-header1"
					style="background-color: #007bff; height: 20px;"></div>
				<div class="modal-body">
					<b>Are you sure you want to save this production entry?</b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">NO</button>
					<button type="button" class="btn btn-info btn-sm"
						id="confirmProdEntryYes">YES</button>
				</div>
			</div>
		</div>
	</div>

	<a class="scroll-to-top rounded" href="#page-top"><i
		class="fas fa-angle-up"></i></a>

	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>

			<script src="vendor/datatables/jquery.dataTables.min.js"></script>

	<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
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
	<script
		src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
		
		

	
	
	
	<script src="js/config.js"></script>
	<script src="js/logout.js"></script>
	<script src="js/username.js"></script>
	<script src="js/modifiedby.js"></script>
	<script src="js/createdby.js"></script>
	<script src="js/Sessionfilter.js"></script>

	<script>
	  window.actionElementMap = {};
	</script>
	<script src="js/permissions.js"></script>

	<script src="js/ProductionEntry.js"></script>

</body>
</html>
