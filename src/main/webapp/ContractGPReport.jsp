
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
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


<link
	href="externalLibrary/cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-KyZXEJjRkC9iY3NfJVzz6se99Nz05dfk03S8zNeS46E1H2nKfHlR9ltRf9TL7zG6"
	crossorigin="anonymous">
<link
href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
	rel="stylesheet" />

<script
	src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<link rel="stylesheet"
	href="externalLibrary/maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
<style>
.error-message {
	color: red;
	font-size: 12px;
	margin-top: 5px;
	display: none; /* Hidden by default */
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

.hide-column {
	display: none;
}
/* Style to highlight the row */
.highlight {
	background-color: #b0c4de; /* Light blue background for highlight */
}

/* Optional: Style the link to make it look like a clickable element */
.loadno-link {
	color: #007bff; /* Blue color for links */
	text-decoration: none; /* Remove underline */
}

.loadno-link:hover {
	text-decoration: underline;
	/* Optional: underline when hovering over the link */
}

#conditionalFields {
	display: contents;
	flex-wrap: wrap;
	gap: 15px;
}
</style>
<style>
#videoElement, #capturedImage {
	width: 300px;
	height: 225px;
	border: 2px solid #ccc;
	margin-bottom: 10px;
}
</style>

<style>
th, td {
	white-space: nowrap;
	text-align: center;
	vertical-align: middle;
}

.table td input.form-control-sm {
	min-width: 120px;
}

.modal-body, .table-responsive {
	overflow-x: auto;
}

/* Sticky header for scrolling */
thead th {
	position: sticky;
	top: 0;
	background-color: #f8f9fa;
	z-index: 2;
}

/* Make table borders more visible for reports */
table.table-bordered th, table.table-bordered td {
	border: 1px solid #000 !important;
}

/* Set consistent column width */
.table th, .table td {
	min-width: 150px;
	font-size: 13px;
}

.report-header {
	font-weight: bold;
	color: black;
	text-transform: uppercase;
	text-decoration: underline;
	margin-bottom: 20px;
}

.container-report {
	border: 2px solid black;
	border-radius: 10px;
	padding: 20px;
	background-color: white;
	max-width: 95vw;
	margin: auto;
}

.nav-tabs .nav-link {
    color: #333;
    cursor: pointer;
}

.nav-tabs .nav-link.active {
    background-color: #37499A;
    color: white !important;
    border-color: #37499A #37499A #fff;
}

.nav-tabs .nav-link.active b {
    color: white;
}
</style>
<style>
@media print {
	body {
		-webkit-print-color-adjust: exact !important;
		print-color-adjust: exact !important;
	}
	.btn {
		display: none !important; /* Hide buttons on print */
	}
	.container-report {
		border: none;
		padding: 0;
		box-shadow: none;
	}
	thead th {
		background-color: #f2f2f2 !important;
		color: #000 !important;
		font-weight: bold;
	}
	.table td, .table th {
		font-size: 11px;
		padding: 4px;
	}
}
</style>
<script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>

</head>

<body onload="fetchcontractGP();">
	<div id="wrapper">
		<!-- Sidebar -->
		<%@ include file="ContractSidebar.jsp"%>
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
				<!-- Topbar -->
				<!-- Container Fluid-->
				<div class="container-fluid" id="container-wrapper">
					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800">Contract GP Report</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="ContractDashboard.jsp">Home</a></li>
							<li class="breadcrumb-item"><a href="ContractGPReport.jsp">Contract
									GP Report</a></li>

						</ol>
					</div>



					<div class="container mt-5">
			

						<div class="d-flex justify-content-center mb-4">
							<div class="nav nav-tabs" id="contractGPTabs" role="tablist">
								<a class="nav-item nav-link active" id="rangeTab"
									data-bs-toggle="tab" href="#range" role="tab"
									onclick="toggleTables('range')"><b>Date Range Report</b></a>
							</div>
							<div class="nav nav-tabs" id="contractGphistory" role="tablist">
								<a class="nav-item nav-link" id="rangeHistoryTab"
									data-bs-toggle="tab" href="#range" role="tab"
									onclick="toggleTables('history')"><b>History Report</b></a>
							</div>
						</div>


					</div>


					<div id="container3" style="display: block;">
						<div class="modal-body">
							<form>
								<div class="form-row align-items-end mb-3">
									<div class="form-group col-md-2">
										<label for="start"><b>Start Date:</b></label> <input
											type="date" class="form-control form-control-sm" id="start"
											placeholder="Start Date">
									</div>

									<div class="form-group col-md-2">
										<label for="end"><b>End Date:</b></label> <input type="date"
											class="form-control form-control-sm" id="end"
											placeholder="End Date">
									</div>

							
									<div class="form-group col-md-2">
 <label for="company "><b>Company:</b></label>               
 <select id="company" class="form-control form-control-sm">
 <option value="">Select</option>
 <option value="ALL">All</option>
 </select>
</div>

<div class="form-group col-md-2">
 <label for="empid "><b>Employee ID:</b></label>               
 <select id="empid" class="form-control form-control-sm">
 <option value="">Select</option>
 <option value="ALL">All</option>
 </select>
</div>

									<div class="form-group col-md-2">
										<button type="button" class="btn btn-primary btn-sm w-100"
											onclick="fetchcontractgpByDate()">Fetch Report</button>
									</div>
								</div>

								<div id="container1" style="display: none;">
									<div class="container container-report mt-4">
										<h5 class="text-center report-header">Date Range Report</h5>
										<div class="form-row dynamic-row">
											<div class="table-responsive"style="max-height: 450px; overflow-y: auto;">
												<table class="table table-bordered table-sm" id="Table1">
													<thead>
														<tr>
															<th>SL.NO</th>
															<th>Code</th>
															<th>Employee ID</th>
															
															<th>Name</th>

															<th>Gender</th>
															<th>Aadhar</th>
															<th>Issued On</th>
															<th>DOB</th>
															<th>DOJ</th>
															<th>Valid Up To</th>
															<th>Department</th>
															<th>Designation</th>
															<th>Company</th>
															<th>Blood Group</th>
															<th>Nature Of Job</th>

															<th>Bus</th>
															<th>Work Location</th>

															<th>Active/Inactive</th>
															<th>File Path</th>
															<th>Employee Photo</th>
															<th>Factory</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<!-- Insert actual values here -->
														</tr>
													</tbody>
												</table>
											</div>
										</div>
										<button type="button" class="btn btn-success btn-sm my-3"
											onclick="exportToExcel()">Export to Excel</button>
									</div>
								</div>
							</form>
						</div>
					</div>

					<div id="container5" style="display: none;">
						<div class="modal-body">
							<form>
								<div class="form-row align-items-end mb-3">

									<!-- Filter Type Selector -->
									<div class="form-group col-md-2">
										<label for="historyFilterType"><b>Filter By:</b></label> <select
											id="historyFilterType" class="form-control form-control-sm"
											onchange="toggleHistoryFilterFields()">
											<option value="">Select</option>
											<option value="aadhar">Aadhar No</option>
											<option value="empid">Employee ID</option>
										</select>
									</div>

									<div class="form-group col-md-2" id="historyAadharWrapper"
										style="display: none;">
										<label for="historyAadhar"><b>Aadhar No:</b></label> <select
											id="historyAadhar" class="form-control form-control-sm">
											<option value="">Select</option>
											<option value="ALL">All</option>
										</select>
									</div>

									<div class="form-group col-md-2" id="historyEmpIdWrapper"
										style="display: none;">
										<label for="historyEmpId"><b>Employee ID:</b></label> <select
											id="historyEmpId" class="form-control form-control-sm">
											<option value="">Select</option>
											<option value="ALL">All</option>
										</select>
									</div>

									<!-- From Date (mandatory) -->
									<div class="form-group col-md-2">
										<label for="historyFromDate"><b>From Date:</b> <span
											style="color: red;">*</span></label> <input type="date"
											class="form-control form-control-sm" id="historyFromDate"
											required>
									</div>

									<!-- To Date (mandatory) -->
									<div class="form-group col-md-2">
										<label for="historyToDate"><b>To Date:</b> <span
											style="color: red;">*</span></label> <input type="date"
											class="form-control form-control-sm" id="historyToDate"
											required>
									</div>

									<div class="form-group col-md-2">
										<button type="button" class="btn btn-primary btn-sm w-100"
											onclick="fetchHistoryReport()">Fetch Report</button>
									</div>
								</div>
							</form>

							<div id="container6" style="display: none;">
								<div class="container container-report mt-4">
									<h5 class="text-center report-header">Gatepass History
										Report</h5>
									<div class="form-row dynamic-row">
										<div class="table-responsive" id="historyTableWrapper"
											style="max-height: 450px; overflow-y: auto;">
											<table class="table table-bordered table-sm" id="Table2">
												<thead>
													<tr>
														<th>SL.NO</th>
														<th>Pass ID</th>
														<th>Aadhar No</th>
														<th>Employee ID</th>
														<th>First Name</th>
														<th>Last Name</th>
														<th>Pass Issued Date</th>
														<th>DOB</th>
														<th>DOJ</th>
														<th>Valid Till</th>
														<th>Department (ID)</th>
														<th>Designation (ID)</th>
														<th>Nature Of Job</th>
														<th>Contact No</th>
														<th>Permanent Address</th>
														<th>Present Address</th>
														<th>Factory Name</th>
														<th>Active</th>
														<th>Delete</th>
														<th>Status Description</th>
														<th>Rejoin Date</th>
														<th>Performed By</th>
														<th>Transaction Date</th>
													</tr>
												</thead>
												<tbody id="historyTableBody">
													<!-- Rows inserted dynamically -->
												</tbody>
											</table>
										</div>
									</div>
									<button type="button" class="btn btn-success btn-sm my-3"
										onclick="exportHistoryToExcel()">Export to Excel</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="imageModal">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content p-2">

				<div class="modal-body text-center">
					<img id="imagePreview" style="max-width: 100%; height: auto;" />
				</div>

			</div>
		</div>
	</div>


<script
		src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/xlsx/0.20.3/xlsx.full.min.js"></script>

	<script>
   window.onload = function() {
	   fetchCompanyNames();
	   fetchempid();
	   toggleTables('range');
};
</script>



	<script>
 function exportToExcel() {
  var table = document.getElementById("Table1");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Date Range Report"});
  XLSX.writeFile(workbook, 'Date_Range_Report.xlsx');
 }
</script>

	<script>


function toggleTables(tabName) {

    const container3 = document.getElementById("container3"); // Date Range Report tab
    const container5 = document.getElementById("container5"); // History Report tab
    const container1 = document.getElementById("container1"); // Date Range Report RESULT
    const container6 = document.getElementById("container6"); // History Report RESULT
    const rangeTab = document.getElementById("rangeTab");
    const historyTab = document.getElementById("rangeHistoryTab");

    if (tabName === "range") {
        container3.style.display = "block";
        container5.style.display = "none";
        container6.style.display = "none";   // close history result when leaving history
        rangeTab.classList.add("active");
        historyTab.classList.remove("active");
    } 
    else if (tabName === "history") {
        container3.style.display = "none";
        container5.style.display = "block";
        container1.style.display = "none";   // close date range result when leaving date range
        historyTab.classList.add("active");
        rangeTab.classList.remove("active");
    }
    else {
        container3.style.display = "none";
        container5.style.display = "none";
        container1.style.display = "none";
        container6.style.display = "none";
        rangeTab.classList.remove("active");
        historyTab.classList.remove("active");
    }
}
</script>





	<script>
function printContainer1() {
    var printContents = document.getElementById("container6").innerHTML;
    var originalContents = document.body.innerHTML;

    var printWindow = window.open('', '', 'height=600,width=900');
    printWindow.document.write('<html><head><title>Print Report</title>');
    printWindow.document.write('<link rel="stylesheet" href="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}
</script>

	<a class="scroll-to-top rounded" href="#page-top"> <i
		class="fas fa-angle-up"></i>
	</a>


	
	<script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
	
		<script src="vendor/datatables/jquery.dataTables.min.js"></script>
	<script src="js/config.js?v=<%=jsVersion%>"></script>


	<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
	
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
	<script src="js/ContractGPreport.js?v=<%=jsVersion%>"></script>
	<script src="js/username.js?v=<%=jsVersion%>"></script>
	<script src="js/createdby.js?v=<%=jsVersion%>"></script>
	<script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
	<script src="js/factoryid.js?v=<%=jsVersion%>"></script>
	<script src="js/logout.js?v=<%=jsVersion%>"></script>
	


</body>
</html>