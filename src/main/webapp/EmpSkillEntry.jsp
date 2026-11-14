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
						<h3 class="text-center mb-4">Employee Skill Entry</h3>

						<!-- SEARCH CARD -->
						<div class="emp-search-card">
							<h5>
								<i class="fas fa-user-check mr-2"></i>Find Employee
							</h5>
							<div class="input-group emp-search-input-group">
								<input type="text" class="form-control" id="empCodeInput"
									placeholder="Enter Employee Code">
								<div class="input-group-append">
									<button class="btn text-white" id="empSearchBtn" type="button">
										<i class="fas fa-search"></i> Search
									</button>
								</div>
							</div>
							<div id="empCodeError" class="error-message"
								style="display: none;">Employee not found</div>
						</div>

						<!-- EMPLOYEE PROFILE + SUMMARY (hidden until search succeeds) -->
						<div id="empResultSection" style="display: none;">

							<div class="emp-profile-card">
								<div class="emp-info-block">
									<div class="emp-avatar" id="empAvatarInitials">--</div>
									<div>
										<p class="emp-name" id="empNameDisplay">-</p>
										<p class="emp-meta">
											Emp Code: <span id="empCodeDisplay">-</span>
										</p>
									</div>
								</div>
								<div class="d-flex align-items-center" style="gap: 14px;">
									<span class="badge-desg" id="empDesgDisplay">-</span>
									<button class="btn btn-rate-skills text-white"
										id="openRateModalBtn" type="button">
										<i class="fas fa-sliders-h mr-1"></i> Rate Skills
									</button>
								</div>
							</div>

							<!-- SUMMARY OF CURRENT RATINGS -->
							
							
							
							<!-- OVERALL SKILL PERFORMANCE -->

							<div class="skill-overall-card" id="skillOverallCard">

								<div class="skill-overall-title">
									<i class="fas fa-chart-line mr-2"></i> Overall Skill
									Performance
								</div>

								<div class="skill-overall-content">

									<div class="skill-overall-item">

										<div class="skill-overall-label">Average Score</div>

										<div class="skill-overall-value">
											<span id="overallAverage">0.00</span> <small
												style="font-size: 13px; color: #7c85a3;"> / 4.00 </small>
										</div>

									</div>


									<div class="skill-overall-item">

										<div class="skill-overall-label">Overall Grade</div>

										<div>
											<span class="skill-overall-grade" id="overallGrade"> -
											</span>
										</div>

										<div class="skill-overall-description"
											id="overallGradeDescription">-</div>

									</div>


									<div class="skill-overall-item">

										<div class="skill-overall-label">Skills Rated</div>

										<div class="skill-overall-value">
											<span id="ratedSkillCount">0</span> <small
												style="font-size: 13px; color: #7c85a3;"> / <span
												id="totalSkillCount">0</span>
											</small>
										</div>

									</div>

								</div>


								<div class="overall-progress">

									<div id="overallProgressBar" class="overall-progress-bar">
									</div>

								</div>

							</div>
							<div class="skill-summary-card">
								<div class="table-responsive p-3">
									<table class="table table-borderless table-sm mb-0"
										id="skillSummaryTable" width="100%">
										<thead>
											<tr>
												<th>Skill's</th>
												<th style="width: 160px;">Current Level</th>
											</tr>
										</thead>
										<tbody></tbody>
									</table>
								</div>
								<div id="noSkillsMessage" class="empty-state"
									style="display: none;">
									<i class="fas fa-info-circle"></i> No skills are mapped to this
									designation yet.
								</div>
							</div>

						</div>

					</div>


					<!-- ============================
						 RATE SKILLS MODAL
					============================ -->
					<div class="modal fade" id="rateSkillsModal" tabindex="-1"
						role="dialog" aria-labelledby="rateSkillsModalTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable modal-lg"
							role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="rateSkillsModalTitle">
										<b>Rate Skills</b> — <span id="modalEmpName"
											class="text-muted"></span>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<table class="table table-sm" id="rateSkillTable" width="100%">
										<thead>
											<tr>
												<th>Skill</th>
												<th>Level</th>
											</tr>
										</thead>
										<tbody></tbody>
									</table>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="submitRatingsBtn">Save Ratings</button>
								</div>
							</div>
						</div>
					</div>

					<!-- CONFIRM SAVE -->
					<div class="modal fade" id="confirmSaveRatingsModal" tabindex="-1"
						role="dialog" aria-labelledby="confirmSaveRatingsTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to save these skill ratings?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmSaveRatingsYes">YES</button>
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

	<script src="js/EmpSkillEntry.js"></script>

</body>
</html>