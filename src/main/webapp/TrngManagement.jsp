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
<title>JSSL - Employee Skill Entry</title>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet"
	type="text/css" />
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<link href="css/ruang-admin.min.css" rel="stylesheet" />
<link rel="stylesheet" href="css/main.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="js/sidebar.js"></script>

<style>
.error-message {
	color: red;
	font-size: 12px;
	margin-top: 5px;
	display: none;
}

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

.modal-header {
	border-bottom: 1px solid #dee2e6;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
}

.modal-header1 {
	background-color: #007bff;
	color: black;
	border-bottom: 1px solid #dee2e6;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 20px;
}

.modal-body {
	padding: 20px;
}

.modal-footer {
	border-top: 1px solid #dee2e6;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
}

.popup {
	position: fixed;
	top: 20px;
	right: -3%;
	transform: translateX(-50%);
	background-color: #4CAF50;
	color: white;
	padding: 16px;
	border-radius: 5px;
	z-index: 9999;
}

.mt-5, .my-5 {
	margin-top: -5rem !important;
}

/* ============================
   EMPLOYEE SEARCH CARD
============================ */
.emp-search-card {
	background: #fff;
	border: 1px solid #e3e6f0;
	border-radius: 14px;
	padding: 28px 30px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
	max-width: 640px;
	margin: 0 auto 30px auto;
}

.emp-search-card h5 {
	font-weight: 700;
	color: #37499A;
	margin-bottom: 18px;
}

.emp-search-input-group .form-control {
	border-radius: 8px 0 0 8px;
	height: 42px;
}

.emp-search-input-group .btn {
	border-radius: 0 8px 8px 0;
	height: 42px;
	padding: 0 22px;
	background-color: #37499A;
	border: none;
}

.emp-search-input-group .btn:hover {
	background-color: #2c3a7a;
}

/* ============================
   EMPLOYEE PROFILE CARD
============================ */
.emp-profile-card {
	background: #fff;
	border: 1px solid #e3e6f0;
	border-radius: 14px;
	padding: 22px 26px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
	max-width: 900px;
	margin: 0 auto 24px auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 16px;
}

.emp-avatar {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: linear-gradient(135deg, #37499A, #5867c9);
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 22px;
	font-weight: 700;
	flex-shrink: 0;
}

.emp-info-block {
	display: flex;
	align-items: center;
	gap: 16px;
}

.emp-name {
	font-size: 17px;
	font-weight: 700;
	color: #2d3748;
	margin: 0;
}

.emp-meta {
	font-size: 13px;
	color: #7c85a3;
	margin: 0;
}

.badge-desg {
	background: #eef0fa;
	color: #37499A;
	font-weight: 600;
	padding: 6px 14px;
	border-radius: 20px;
	font-size: 12.5px;
}

.btn-rate-skills {
	background-color: #37499A;
	border-radius: 8px;
	padding: 10px 20px;
	font-weight: 600;
}

.btn-rate-skills:hover {
	background-color: #2c3a7a;
}

/* ============================
   SUMMARY TABLE (post-load / post-save)
============================ */
.skill-summary-card {
	background: #fff;
	border: 1px solid #e3e6f0;
	border-radius: 14px;
	padding: 10px 0;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
	max-width: 900px;
	margin: 0 auto;
}

.level-badge {
	display: inline-block;
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 700;
	color: #fff;
	min-width: 92px;
	text-align: center;
}

.level-4 {
	background-color: #1e8e5a;
} /* Expert */
.level-3 {
	background-color: #2f80ed;
} /* Proficient */
.level-2 {
	background-color: #f2994a;
} /* Demonstrating */
.level-1 {
	background-color: #eb5757;
} /* Basic */
.level-0 {
	background-color: #9aa1b1;
} /* None */
.level-none {
	background-color: #d7dae2;
	color: #6b7280;
} /* not yet rated */
.empty-state {
	text-align: center;
	padding: 40px 20px;
	color: #9aa1b1;
}

.empty-state i {
	font-size: 40px;
	margin-bottom: 12px;
	display: block;
}

/* ============================
   RATING MODAL - LEVEL PILL SELECTOR
============================ */
.level-pill-group {
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
}

.level-pill-group input[type="radio"] {
	position: absolute;
	opacity: 0;
	pointer-events: none;
}

.level-pill {
	padding: 6px 12px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
	border: 1.5px solid #e3e6f0;
	color: #7c85a3;
	background: #fff;
	transition: all 0.15s ease;
	white-space: nowrap;
}

.level-pill:hover {
	border-color: #37499A;
	color: #37499A;
}

.level-pill-group input[value="4"]:checked+.level-pill {
	background: #1e8e5a;
	border-color: #1e8e5a;
	color: #fff;
}

.level-pill-group input[value="3"]:checked+.level-pill {
	background: #2f80ed;
	border-color: #2f80ed;
	color: #fff;
}

.level-pill-group input[value="2"]:checked+.level-pill {
	background: #f2994a;
	border-color: #f2994a;
	color: #fff;
}

.level-pill-group input[value="1"]:checked+.level-pill {
	background: #eb5757;
	border-color: #eb5757;
	color: #fff;
}

.level-pill-group input[value="0"]:checked+.level-pill {
	background: #9aa1b1;
	border-color: #9aa1b1;
	color: #fff;
}

#rateSkillTable td {
	vertical-align: middle;
}

/* ============================
   OVERALL SKILL PERFORMANCE
============================ */
.skill-overall-card {
	background: #fff;
	border: 1px solid #e3e6f0;
	border-radius: 14px;
	padding: 20px 26px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
	max-width: 900px;
	margin: 0 auto 24px auto;
}

.skill-overall-title {
	font-size: 15px;
	font-weight: 700;
	color: #37499A;
	margin-bottom: 18px;
}

.skill-overall-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
	flex-wrap: wrap;
}

.skill-overall-item {
	flex: 1;
	min-width: 140px;
}

.skill-overall-label {
	font-size: 12px;
	color: #7c85a3;
	margin-bottom: 5px;
}

.skill-overall-value {
	font-size: 24px;
	font-weight: 700;
	color: #2d3748;
}

.skill-overall-grade {
	display: inline-block;
	min-width: 70px;
	text-align: center;
	padding: 7px 18px;
	border-radius: 20px;
	font-size: 18px;
	font-weight: 700;
	background: #eef0fa;
	color: #37499A;
}

.skill-overall-description {
	font-size: 13px;
	color: #7c85a3;
	margin-top: 4px;
}

.overall-progress {
	width: 100%;
	height: 8px;
	background: #e9ecf3;
	border-radius: 10px;
	overflow: hidden;
	margin-top: 10px;
}

.overall-progress-bar {
	height: 100%;
	width: 0%;
	border-radius: 10px;
	transition: width 0.4s ease;
}

.trng-card {
	background: #fff;
	border: 1px solid #e3e6f0;
	border-radius: 14px;
	padding: 10px 0;
	box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}

.trainer-badge {
	background: #eef0fa;
	color: #37499A;
	font-weight: 600;
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 12px;
}

.status-badge {
	padding: 5px 14px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 700;
	color: #fff;
}
.status-planned { background-color: #f2994a; }
.status-completed { background-color: #1e8e5a; }
.status-cancelled { background-color: #9aa1b1; }

.level-badge {
	display: inline-block;
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 700;
	color: #fff;
	min-width: 92px;
	text-align: center;
}
.level-4 { background-color: #1e8e5a; }
.level-3 { background-color: #2f80ed; }
.level-2 { background-color: #f2994a; }
.level-1 { background-color: #eb5757; }
.level-0 { background-color: #9aa1b1; }
.level-none { background-color: #d7dae2; color: #6b7280; }

.level-pill-group { display: flex; gap: 6px; flex-wrap: wrap; }
.level-pill-group input[type="radio"] { position: absolute; opacity: 0; pointer-events: none; }
.level-pill {
	padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
	cursor: pointer; border: 1.5px solid #e3e6f0; color: #7c85a3; background: #fff;
}
.level-pill-group input[value="4"]:checked + .level-pill { background: #1e8e5a; border-color: #1e8e5a; color: #fff; }
.level-pill-group input[value="3"]:checked + .level-pill { background: #2f80ed; border-color: #2f80ed; color: #fff; }
.level-pill-group input[value="2"]:checked + .level-pill { background: #f2994a; border-color: #f2994a; color: #fff; }
.level-pill-group input[value="1"]:checked + .level-pill { background: #eb5757; border-color: #eb5757; color: #fff; }
.level-pill-group input[value="0"]:checked + .level-pill { background: #9aa1b1; border-color: #9aa1b1; color: #fff; }

.participant-block {
	border: 1px solid #eef0fa;
	border-radius: 10px;
	padding: 14px 16px;
	margin-bottom: 14px;
}
.participant-block h6 { color: #37499A; font-weight: 700; margin-bottom: 10px; }

.add-participant-bar {
	background: #f8f9fc;
	border-radius: 10px;
	padding: 14px;
	margin-bottom: 18px;
}
</style>
</head>

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
							<li class="breadcrumb-item"><a href="#">Employee Skill
									Entry</a></li>
						</ol>
					</div>

			<div class="container mt-5">
	<h3 class="text-center mb-4">Training Management</h3>
</div>

<div class="row mb-3" id="trngTable">
	<div class="table-responsive p-3">
		<div class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
			style="background-color: #f8f9fc;">
			<button data-toggle="modal" id="trngCrt"><i class="fas fa-plus"></i> Schedule Training</button>
		</div>
		<div class="table-responsive p-3">
		<!-- 	<table class="table table-striped table-bordered table-sm" id="tableTrng" width="100%">
				<thead>
					<tr>
						<th>Sl. No.</th><th>Title</th><th>Trainer</th><th>Date</th>
						<th>Status</th><th>Actions</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table> -->
			<table class="table table-striped table-bordered table-sm trng-card" id="tableTrng" width="100%">
	<thead>
		<tr>
			<th>Sl. No.</th><th>Title</th><th>Trainer</th><th>Date</th>
			<th>Status</th><th>Progress</th>
		</tr>
	</thead>
	<tbody></tbody>
</table>
		</div>
	</div>
</div>

<!-- CREATE TRAINING MODAL -->
<div class="modal fade" id="trngCreateModal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable" style="max-width: 550px;" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title"><b>Schedule Training</b></h5>
				<button type="button" class="close white-button" data-dismiss="modal"><span>&times;</span></button>
			</div>
			<div class="modal-body">
				<form id="trngForm">
					<div class="col-md-12 mb-3">
						<label class="form-label"><b>Title:</b></label>
						<input type="text" class="form-control form-control-sm" id="trngTitle">
						<div id="trngTitleError" class="error-message">Title is required</div>
					</div>
					<div class="col-md-12 mb-3">
						<label class="form-label"><b>Trainer:</b></label>
						<select class="form-control form-control-sm" id="trngTrainerSelect">
							<option value="" selected disabled>Select Trainer</option>
						</select>
						<div id="trngTrainerError" class="error-message">Trainer is required</div>
					</div>
					<div class="col-md-12 mb-3">
						<label class="form-label"><b>Skills Covered:</b></label>
						<div class="dropdown">
							<button class="btn btn-outline-secondary btn-sm dropdown-toggle w-100 text-left bg-white"
								type="button" data-toggle="dropdown">
								<span id="trngSkillsLabel">Select Skills</span>
							</button>
							<div class="dropdown-menu p-2" style="max-height: 220px; overflow-y: auto; width: 100%;">
								<div id="trngSkillsCheckboxList"></div>
							</div>
						</div>
						<div id="trngSkillsError" class="error-message">At least one Skill is required</div>
					</div>
					<div class="col-md-12 mb-3">
						<label class="form-label"><b>Date:</b></label>
						<input type="date" class="form-control form-control-sm" id="trngDate">
						<div id="trngDateError" class="error-message">Date is required</div>
					</div>
					<div class="col-md-12 mb-3">
						<label class="form-label"><b>Duration:</b></label>
						<input type="text" class="form-control form-control-sm" id="trngDuration" placeholder="e.g. 2 days">
					</div>
					<div class="col-md-12 mb-3">
						<label class="form-label"><b>Venue:</b></label>
						<input type="text" class="form-control form-control-sm" id="trngVenue">
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-sm btn-success" id="trngSaveBtn">Next: Add Participants</button>
			</div>
		</div>
	</div>
</div>

<!-- ADD PARTICIPANTS MODAL -->
<!-- <div class="modal fade" id="trngParticipantModal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title"><b>Add Participants</b> — <span id="participantTrngTitle" class="text-muted"></span></h5>
				<button type="button" class="close white-button" data-dismiss="modal"><span>&times;</span></button>
			</div>
			<div class="modal-body">
				<div class="input-group mb-3">
					<input type="text" class="form-control form-control-sm" id="participantEmpCodeInput" placeholder="Enter Employee Code">
					<div class="input-group-append">
						<button class="btn btn-sm" id="participantAddBtn" type="button">Add</button>
					</div>
				</div>
				<div id="participantAddError" class="error-message"></div>
				<table class="table table-sm" id="participantListTable">
					<thead><tr><th>Emp Code</th><th>Name</th><th>Designation</th></tr></thead>
					<tbody></tbody>
				</table>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-sm btn-success" data-dismiss="modal">Done</button>
			</div>
		</div>
	</div>
</div> -->

<!-- COMPLETE TRAINING MODAL -->
<!-- <div class="modal fade" id="trngCompleteModal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title"><b>Complete Training</b> — <span id="completeTrngTitle" class="text-muted"></span></h5>
				<button type="button" class="close white-button" data-dismiss="modal"><span>&times;</span></button>
			</div>
			<div class="modal-body">
				<div class="col-md-6 mb-3">
					<label class="form-label"><b>Certificate No (optional):</b></label>
					<input type="text" class="form-control form-control-sm" id="completeCertNo">
				</div>
				<table class="table table-sm" id="completeGridTable">
					<thead><tr><th>Employee</th><th>Skill</th><th>Before</th><th>After</th></tr></thead>
					<tbody></tbody>
				</table>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-sm btn-success" id="completeSubmitBtn">Mark Completed</button>
			</div>
		</div>
	</div>
</div> -->



<!-- MANAGE PARTICIPANTS & RATINGS -->
<div class="modal fade" id="trngManageModal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title"><b>Manage Training</b> — <span id="manageTrngTitle" class="text-muted"></span></h5>
				<button type="button" class="close white-button" data-dismiss="modal"><span>&times;</span></button>
			</div>
			<div class="modal-body">

				<!-- ADD EMPLOYEE BAR -->
				<div class="add-participant-bar" id="addParticipantBar">
					<label class="form-label"><b>Add Employee:</b></label>
					<div class="input-group">
						<select class="form-control form-control-sm" id="eligibleEmpSelect">
							<option value="" selected disabled>Select Employee</option>
						</select>
						<div class="input-group-append">
							<button class="btn btn-sm" id="addParticipantBtn" type="button">Add</button>
						</div>
					</div>
					<div id="addParticipantError" class="error-message"></div>
				</div>

				<div id="pendingRatingNotice" class="alert alert-warning" style="display: none;">
					Complete the rating below before adding another employee.
				</div>

				<!-- PARTICIPANT + RATING BLOCKS -->
				<div id="participantBlocksContainer"></div>

				<div id="noParticipantsMessage" class="text-center text-muted p-3" style="display: none;">
					No participants added yet.
				</div>

			</div>
			<div class="modal-footer d-flex justify-content-between">
				<div>
					<label class="form-label mb-0 mr-2"><b>Certificate No:</b></label>
					<input type="text" class="form-control form-control-sm d-inline-block" id="manageCertNo" style="width: 200px;">
				</div>
				<div>
					<button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-sm btn-info" id="saveRatingsBtn">Save Ratings</button>
					<button type="button" class="btn btn-sm btn-success" id="markCompleteBtn">Mark Complete</button>
				</div>
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

	<script src="js/TrngManagement.js"></script>

</body>
</html>