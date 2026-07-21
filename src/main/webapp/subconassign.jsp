
<%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  response.setHeader("Pragma", "no-cache");
  response.setDateHeader("Expires", 0);
%>
<%
long ts = System.currentTimeMillis();
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Sub Contractor Details</title>
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">

<!-- Favicon -->
<link href="img/logo/download.png" rel="icon">

<!-- Vendor CSS -->
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="vendor/datatables/dataTables.bootstrap4.min.css"
	rel="stylesheet">
<link rel="stylesheet"
	href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
<link href="css/ruang-admin.min.css" rel="stylesheet">
<link rel="stylesheet" href="css/main.css">

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<style>
.card-custom {
	border-radius: 15px;
	box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
}

.card-header {
	background-color: #37499A;
	color: white;
	font-weight: bold;
	font-size: 1rem;
	border-top-left-radius: 15px;
	border-top-right-radius: 15px;
}

label {
	font-weight: 600;
	color: #37499A;
}

.btn-primary {
	background-color: #37499A;
	border: none;
}

.btn-primary:hover {
	background-color: #2e3e8b;
}

.form-select {
	border-radius: 10px;
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

div.dt-buttons .dt-button {
	background-color: #336699 !important;
	color: white !important;
	border: none;
	border-radius: 4px;
	padding: 5px 10px;
}

/* ── Radio / Tab pill bar (matching DrawingMaster style) ── */
.form-check-input[type="radio"] {
	display: none;
}

.form-check-label {
	cursor: pointer;
	padding: 6px 18px;
	border-radius: 20px;
	border: 1px solid #ccc;
	font-size: 14px;
	background-color: #f8f9fc;
	color: #555;
	transition: background 0.2s, color 0.2s;
	user-select: none;
}

.form-check-input[type="radio"]:checked+.form-check-label {
	background-color: #37499A;
	color: #fff;
	border-color: #37499A;
}

/* Error message */
.error-message {
	color: red;
	font-size: 12px;
	margin-top: 5px;
	display: none;
}

/* Modal header consistent with DrawingMaster */
.modal-content {
	border-radius: 10px;
}

.modal-header {
	color: black;
	border-bottom: 1px solid #dee2e6;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 45px;
}

.modal-header1 {
	background-color: #007bff;
	color: black;
	border-bottom: 1px solid #dee2e6;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 20px;
}

.modal-title {
	line-height: 20px;
}

.modal-body {
	padding: 20px;
}

.modal-footer {
	border-top: 1px solid #dee2e6;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
}

div.dt-buttons>.dt-button:first-child, div.dt-buttons>div.dt-button-split .dt-button:first-child
	{
	margin-left: 0;
	background-color: #336699 !important;
	color: white;
	padding: 4px 10px;
}
</style>

<script>
	const user_id = sessionStorage.getItem('user_id');
	if (!user_id) {
		window.location.href = "newlogin.jsp";
	}
</script>
</head>

<body>
	<div id="wrapper">
		<%@ include file="sidebar.jsp"%>

		<div id="content-wrapper" class="d-flex flex-column">
			<div id="content">

				<!-- Top Navigation -->
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
							style="color: white;">
							<i class="fa fa-home"></i>
						</button>
						<div class="topbar-divider d-none d-sm-block"></div>
						<li class="nav-item dropdown no-arrow"><a
							class="nav-link dropdown-toggle text-white" href="#"
							data-toggle="dropdown"> <i class="fas fa-user mr-2"></i> <span
								id="usernameDisplay">Username</span>
						</a>
							<div
								class="dropdown-menu dropdown-menu-right shadow animated--grow-in">
								<a class="dropdown-item" onclick="logoutUser(event)"> <i
									class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
									Logout
								</a>
							</div></li>
					</ul>
				</nav>

				<!-- Main Content -->
				<div class="container-fluid">
					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800">SubCon / G2 User Assign</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="Dashboard.jsp">Home</a></li>
							<li class="breadcrumb-item active">SubCon / G2 User Assign</li>
						</ol>
					</div>

					<!-- ── Tab pill bar (DrawingMaster style: radio inputs + labels) ── -->
					<div class="container mt-5">

						<div class="d-flex justify-content-center mb-4">
							<div class="form-check me-3">
								<input class="form-check-input" type="radio" id="SubConRadio"
									name="assignMaster" checked> <label
									class="form-check-label" for="SubConRadio">SubConAssign</label>
							</div>
							&nbsp;&nbsp;
							<div class="form-check">
								<input class="form-check-input" type="radio" id="G2UserRadio"
									name="assignMaster"> <label class="form-check-label"
									for="G2UserRadio">G2UserAssign</label>
							</div>
						</div>
					</div>

					<!--
				     SubCon Assign Table
				-->
					<div class="row mb-3" id="subConSection">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc; margin-top: -9px; margin-left: -15px;">
								<button class="btn btn-success btn-sm" id="subconassingnmodal">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<table class="table table-striped table-bordered table-sm"
								id="tableID" width="100%">
								<thead>
									<tr>
										<th>User Name</th>
										<th>Factory</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody></tbody>
							</table>
						</div>
					</div>

					<!-- ══════════════════════════════════════════
				     G2 User Assign Table
				══════════════════════════════════════════ -->
					<div class="row mb-3" id="g2AssignSection" style="display: none;">
						<div class="table-responsive p-3">
							<div
								class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
								style="background-color: #f8f9fc; margin-top: -9px; margin-left: -15px;">
								<button class="btn btn-success btn-sm" id="g2assingnmodal">
									<i class="fas fa-plus"></i> Create
								</button>
							</div>
							<table class="table table-striped table-bordered table-sm"
								id="tableID1" width="100%">
								<thead>
									<tr>
										<th>User Name</th>
										<th>Location</th>
										<th>Factory</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody></tbody>
							</table>
						</div>
					</div>


					<!-- ══════════════════════════════════════════
				     MODAL: Create SubCon Assign
				══════════════════════════════════════════ -->
					<div class="modal fade" id="subContractModal" tabindex="-1"
						role="dialog">
						<div class="modal-dialog" style="max-width: 800px;"
							role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" style="color: black;">
										<i class="fas fa-users-cog mr-2"></i> Manage Sub Contractor
									</h5>
									<button type="button" class="close" data-dismiss="modal">&times;</button>
								</div>
								<div class="modal-body">
									<form id="subContractorForm" class="needs-validation"
										novalidate>
										<div class="row mb-3">
											<div class="col-md-4">
												<label for="userName" style="color: #000000a8;">User
													Name</label> <select id="userName" class="form-control" required>
													<option value="">Select</option>
												</select>
												<div class="error-message" id="userNameError">Please
													select User Name</div>
											</div>
											
											<div class="col-md-4">
												<label for="subContract" style="color: #000000a8;">Sub
													Contract</label> <select id="subContract" class="form-control"
													required>
													<option value="">Select</option>
												</select>
												<div class="error-message" id="subContractError">
													Please select Sub Contract</div>
											</div>
											<div class="col-md-4">
												<label for="factory" style="color: #000000a8;">Factory
													Selection</label> <select id="factory" class="form-control"
													required></select>
												<div class="error-message" id="factoryError">Please
													select Factory</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-success btn-sm"
										onclick="assignSubContract()">Submit</button>
								</div>
							</div>
						</div>
					</div>

					<!-- ══════════════════════════════════════════
				     MODAL: Update SubCon Assign
				══════════════════════════════════════════ -->
					<div class="modal fade" id="subContractModalUP" tabindex="-1"
						role="dialog">
						<div class="modal-dialog" style="max-width: 800px;"
							role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" style="color: black;">
										<i class="fas fa-users-cog mr-2"></i> Update Manage Sub
										Contractor
									</h5>
									<button type="button" class="close" data-dismiss="modal">&times;</button>
								</div>
								<div class="modal-body">
									<form id="subContractorFormUp" class="needs-validation"
										novalidate>
										<div class="row mb-3">
											<div class="col-md-4">
												<label style="color: #000000a8;">User Name</label> <input
													id="userNameUp" class="form-control" readonly>
											</div>
											<div class="col-md-4">
												<label style="color: #000000a8;">Sub Contract</label> <select
													id="subContractUp" class="form-control" disabled>
													<option value="">Select</option>
												</select>
											</div>
											<div class="col-md-4">
												<label style="color: #000000a8;">Factory Selection</label> <select
													id="factoryUp" class="form-control" required></select>

												<div class="error-message" id="factoryUpError">Please
													select Factory</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-success btn-sm"
										onclick="UpdateFactory()">Update</button>
								</div>
							</div>
						</div>
					</div>

					<!-- ══════════════════════════════════════════
				     MODAL: Confirm Update SubCon (DrawingMaster style)
				══════════════════════════════════════════ -->
					<div class="modal fade" id="exampleModalCenterupdate" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to Update?</b>
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

					<!-- ══════════════════════════════════════════
				     MODAL: Create G2 User Assign
				══════════════════════════════════════════ -->
					<div class="modal fade" id="g2assignmodal" tabindex="-1"
						role="dialog">
						<div class="modal-dialog" style="max-width: 800px;"
							role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" style="color: black;">
										<i class="fas fa-users-cog mr-2"></i> Manage G2 Users
									</h5>
									<button type="button" class="close" data-dismiss="modal">&times;</button>
								</div>
								<div class="modal-body">
									<form id="subContractorFormg2" class="needs-validation"
										novalidate>
										<div class="row mb-3">
											<div class="col-md-4">
												<label style="color: #000000a8;">User Name</label> <select
													id="userNameg2" class="form-control" required>
													<option value="">Select</option>
												</select>
												<div class="error-message" id="userNameg2Error">
													Please select User Name</div>
											</div>
												<div class="col-md-4">
												<label for="EmpCode" style="color: #000000a8;">Employee Code
													</label> <select id="EmpCode" class="form-control" required>
													<option value="">Select</option>
												</select>
												<div class="error-message" id="EmpCodeError">Please
													select EmployeeCode Name</div>
											</div>
											<div class="col-md-4">
												<label style="color: #000000a8;">Department
													Selection:</label> <select id="Departmentg2" class="form-control"
													required></select>
												<div class="error-message" id="Departmentg2Error">
													Please select Department</div>
											</div>
											<div class="col-md-4  mt-3">
												<label style="color: #000000a8;">Location Selection</label>
												<select id="locationg2" class="form-control" required></select>
												<div class="error-message" id="locationg2Error">
													Please select Location</div>
											</div>
											<div class="col-md-4 mt-3">
												<label style="color: #000000a8;">Factory Selection</label> <select
													id="factoryg2" class="form-control" required></select>
												<div class="error-message" id="factoryg2Error">Please
													select Factory</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-success btn-sm"
										onclick="assigng2User()">Submit</button>
								</div>
							</div>
						</div>
					</div>

					<!-- ══════════════════════════════════════════
				     MODAL: Confirm Create G2 (DrawingMaster style)
				══════════════════════════════════════════ -->
					<div class="modal fade" id="confirmG2CreateModal" tabindex="-1"
						role="dialog" aria-labelledby="confirmG2CreateTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to Create?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmG2CreateBtn">YES</button>
								</div>
							</div>
						</div>
					</div>

					<!-- ══════════════════════════════════════════
				     MODAL: Confirm Create SubCon (DrawingMaster style)
				══════════════════════════════════════════ -->
					<div class="modal fade" id="confirmSubConCreateModal" tabindex="-1"
						role="dialog" aria-labelledby="confirmSubConCreateTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to Create?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmSubConCreateBtn">YES</button>
								</div>
							</div>
						</div>
					</div>


					<div class="modal fade" id="g2assignmodalUp" tabindex="-1"
						role="dialog">
						<div class="modal-dialog" style="max-width: 800px;"
							role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" style="color: black;">
										<i class="fas fa-users-cog mr-2"></i> Update Manage G2 Users
									</h5>
									<button type="button" class="close" data-dismiss="modal">&times;</button>
								</div>
								<div class="modal-body">
									<form id="subContractorFormg2Up" class="needs-validation"
										novalidate>
										<div class="row mb-3">
											<div class="col-md-4">
												<label style="color: #000000a8;">User Name</label> <input
													id="userNameg2Up" class="form-control" required readonly />

											</div>
													<div class="col-md-4">
												<label for="EmpCodeUp" style="color: #000000a8;">Employee Code
													</label> <select id="EmpCodeUp" class="form-control" required>
													<option value="">Select</option>
												</select>
												<div class="error-message" id="EmpCodeUpError">Please
													select EmployeeCode Name</div>
											</div>
											<div class="col-md-4">
												<label style="color: #000000a8;">Department
													Selection:</label> <select id="Departmentg2Up" class="form-control"
													required></select>
												<div class="error-message" id="Departmentg2UpError">
													Please select Department</div>
											</div>
											<div class="col-md-4 mt-3">
												<label style="color: #000000a8;">Location Selection</label>
												<select id="locationg2Up" class="form-control" required></select>
												<div class="error-message" id="locationg2UpError">
													Please select Location</div>
											</div>
											<div class="col-md-4 mt-3">
												<label style="color: #000000a8;">Factory Selection</label> <select
													id="factoryg2Up" class="form-control" required></select>
												<div class="error-message" id="factoryg2UpError">
													Please select Factory</div>
											</div>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-success btn-sm"
										onclick="triggerUpdateG2()">Update</button>
								</div>
							</div>
						</div>
					</div>


					<div class="modal fade" id="confirmG2UpdateModal" tabindex="-1"
						role="dialog" aria-labelledby="confirmG2UpdateTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1"></div>
								<div class="modal-body">
									<b>Are you sure you want to Update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmG2UpdateBtn">YES</button>
								</div>
							</div>
						</div>
					</div>

				</div>
				<!-- /container-fluid -->
			</div>
			<!-- /content -->
		</div>
		<!-- /content-wrapper -->
	</div>
	<!-- /wrapper -->

	<a class="scroll-to-top rounded" href="#page-top"><i
		class="fas fa-angle-up"></i></a>

	<!-- Scripts -->
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
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
	<script src="js/ruang-admin.min.js"></script>
	<script src="js/config.js"></script>
	<script src="js/logout.js"></script>
	<script src="js/username.js"></script>

	<!-- ── Radio-based tab switching (DrawingMaster pattern) ── -->
	<script>
		document.addEventListener("DOMContentLoaded", function() {

			const subConRadio = document.getElementById("SubConRadio");
			const g2UserRadio = document.getElementById("G2UserRadio");

			const subConSection = document.getElementById("subConSection");
			const g2AssignSection = document.getElementById("g2AssignSection");

			function hideAll() {
				subConSection.style.display = "none";
				g2AssignSection.style.display = "none";
			}

			function toggleTables() {
				hideAll();
				if (subConRadio.checked) {
					subConSection.style.display = "block";
					// Re-adjust DataTable columns once visible
					setTimeout(function() {
						if ($.fn.DataTable.isDataTable('#tableID')) {
							$('#tableID').DataTable().columns.adjust().draw();
						}
					}, 50);
				} else if (g2UserRadio.checked) {
					g2AssignSection.style.display = "block";
					// Re-adjust DataTable columns once visible
					setTimeout(function() {
						if ($.fn.DataTable.isDataTable('#tableID1')) {
							$('#tableID1').DataTable().columns.adjust().draw();
						}
					}, 50);
				}
			}

			subConRadio.addEventListener("change", toggleTables);
			g2UserRadio.addEventListener("change", toggleTables);

			// Initial state
			toggleTables();
		});
	</script>

	<!-- YOUR FILE LAST -->
	<script src="js/subconassign.js?v=<%=ts%>"></script>
	<script src="js/Sessionfilter.js"></script>
	<script src="js/createdby.js"></script>
</body>
</html>
