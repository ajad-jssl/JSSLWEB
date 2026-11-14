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
<title>JSSL</title>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="css/ruang-admin.min.css" rel="stylesheet">
<link rel="stylesheet" href="css/main.css">
<link href="css/masterpage.css" rel="stylesheet">
<link
	href="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
	rel="stylesheet">
<link
	href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
	rel="stylesheet">
<link
	href="externalLibrary/cdn.jsdelivr.net/npm/@ttskch/select2-bootstrap4-theme@1.5.2/dist/select2-bootstrap4.min.css"
	rel="stylesheet">

<script>
	const user_id = sessionStorage.getItem('user_id');
	if (!user_id) {
		window.location.href = "newlogin.jsp";
	}
</script>

<style>
/* keep select2 boxes aligned with form-control-sm height */
.select2-container .select2-selection--single {
	height: calc(1.5em + .5rem + 2px) !important;
	padding: .25rem .5rem;
}

.select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered
	{
	line-height: 1.5 !important;
}

.select2-container--bootstrap4 .select2-selection--single .select2-selection__arrow
	{
	height: calc(1.5em + .5rem) !important;
}

/* red border on the select2 box when the select has field-error */
.field-error+.select2-container .select2-selection {
	border: 1.5px solid #dc3545 !important;
}
</style>

<style>
.error-message {
	color: red;
	font-size: 12px;
	margin-top: 5px;
	display: none;
}

.field-error {
	border: 1.5px solid #dc3545 !important;
}

.popup {
	position: fixed;
	top: 20px;
	right: 20px;
	background-color: #4CAF50;
	color: white;
	padding: 16px;
	border-radius: 5px;
	z-index: 9999;
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

button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

button.close {
	padding: 0;
	background-color: transparent;
	border: 0;
	-webkit-appearance: none;
	appearance: none;
}

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

.btn-primary {
	background-color: #007bff;
	border-color: #007bff;
}

.btn-primary:hover {
	background-color: #0056b3;
	border-color: #0056b3;
}
</style>
</head>

<body>
	<div id="wrapper">
		<!-- Sidebar : change to the sidebar of your module if it is not the GPMS one -->
		<%@ include file="GPMSSidebar.jsp"%>

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
							class="nav-link dropdown-toggle" href="#" id="userDropdown"
							role="button" data-toggle="dropdown" aria-haspopup="true"
							aria-expanded="false"> <i class="fas fa-user text-white mr-2"></i>
								<span class="ml-2 d-none d-lg-inline text-white small"
								id="usernameDisplay">Username</span> <span
								class="ml-2 d-none d-lg-inline text-white small"
								id="selectedFactoryId">No Factory Selected</span>
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
						<h1 class="h3 mb-0 text-gray-800">Erection Site Call Off</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="Landingpage.jsp">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page">Erection
								Site Call Off</li>
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
										<button id="callOffCreate">
											<i class="fas fa-plus"></i> Create
										</button>
									</div>
								</div>
								<div class="table-responsive p-3">
									<table class="table table-striped table-bordered table-sm"
										id="tableID2" width="100%">
										<thead>
											<tr>
												<th>Sl.No</th>
												<th>Code</th>
												<th>Contract</th>
												<th>Load</th>
												<th>Date</th>
												<th>Remarks</th>
												<th>Edit</th>
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
		</div>
	</div>

	<!-- ═══════════════════════════════════════════════════════════
       CREATE / UPDATE MODAL  (same modal, the code row only shows in update)
  ════════════════════════════════════════════════════════════════ -->
	<div class="modal fade" id="callOffModal" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog modal-dialog-scrollable"
			style="max-width: 800px; padding-bottom: 10px;" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="callOffModalTitle">Erection Site
						Call Off</h5>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>

				<div class="modal-body">
					<div class="container" style="font-size: 15px;">

						<!-- shown only when editing -->
						<div class="row mb-3" id="codeRow" style="display: none;">
							<div class="col-md-6">
								<label class="form-label">Code:</label> <input type="text"
									class="form-control form-control-sm" id="callOffCode" readonly>
							</div>
						</div>

						<div class="row mb-3">
							<div class="col-md-6">
								<label class="form-label">Contract:</label> <select
									class="form-control form-control-sm" id="contractSelect">
									<option value="">-- Select Contract --</option>
								</select>
								<div id="contractSelectError" class="error-message">Contract
									is required</div>
							</div>
							<div class="col-md-6">
								<label class="form-label">Load:</label> <select disabled
									class="form-control form-control-sm" id="loadSelect">
									<option value="">-- Select Load --</option>
								</select>
								<div id="loadSelectError" class="error-message">Load is
									required</div>
							</div>
						</div>

						<div class="row mb-3">
							<div class="col-md-6">
								<label class="form-label">Date:</label> <input type="date"
									class="form-control form-control-sm" id="callOffDate">
								<div id="callOffDateError" class="error-message">Date is
									required</div>
							</div>
							<div class="col-md-6">
								<label class="form-label">Remarks:</label> <input type="text"
									class="form-control form-control-sm" id="remarks"
									maxlength="500" placeholder="Remarks">
							</div>
						</div>

					</div>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-secondary"
						data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary" id="saveButton">Create</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Confirm Create / Update -->
	<div class="modal fade" id="confirmSaveModal" tabindex="-1"
		role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
				<div class="modal-header1"></div>
				<div class="modal-body">
					<b id="confirmSaveText">Are you sure you want to Create?</b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">NO</button>
					<button type="button" class="btn btn-info btn-sm"
						id="confirmSaveYes">YES</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Message modal -->
	<div class="modal fade" id="messageModal" tabindex="-1" role="dialog"
		aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 70%; margin: auto; border-width: thick; border-color: #eaecf4;">
				<div class="modal-header1"></div>
				<div class="modal-body text-center">
					<b id="modalMessage">Message here</b>
				</div>
				<div class="modal-footer d-flex justify-content-center border-0">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">OK</button>
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
	<script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
	<script
		src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
	<script
		src="js/erectionsitecalloff.js?v=<%=ver(application, "/js/erectionsitecalloff.js")%>"></script>

	<script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
	<script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
	<script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
	<script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
	<script src="js/permissions.js?v=<%=ver(application, "/js/permissions.js")%>"></script>

	<script>
    window.actionElementMap = {};
  </script>

</body>
</html>
