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
<title>Load Status Report - JSSL</title>

<!-- Bootstrap -->
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">

<!-- Bootstrap Icons -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.5.0/font/bootstrap-icons.min.css" rel="stylesheet">

<!-- Font Awesome -->
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">

<!-- Ruang Admin -->
<link href="css/ruang-admin.min.css" rel="stylesheet">

<!-- Main CSS -->
<link rel="stylesheet" href="css/main.css">

<script src="js/sidebar.js"></script>

<!-- jsPDF + autoTable -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>

<style>
/* ═══════════════════════════════════════════════════════
   BASE
═══════════════════════════════════════════════════════ */
body {
  background-color: #f5f5f5;
  font-family: "Helvetica Neue", sans-serif;
}

/* ═══════════════════════════════════════════════════════
   PAGE TITLE
═══════════════════════════════════════════════════════ */
.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #37499A;
  margin-bottom: 16px;
}

/* ═══════════════════════════════════════════════════════
   FILTER CARD
═══════════════════════════════════════════════════════ */
.card {
  border: none;
  border-radius: 8px;
}
.card-body {
  padding: 14px 18px;
}
.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  display: block;
}

/* ═══════════════════════════════════════════════════════
   COMPACT INPUTS & BUTTONS  (height 34px everywhere)
═══════════════════════════════════════════════════════ */
.form-control,
.btn-action {
  height: 34px;
  font-size: 13px;
  border-radius: 4px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  width: 100%;
}

#fetchBtn   { background: #37499A; color: #fff; }
#fetchBtn:hover:not(:disabled)   { background: #2c3b80; }
#exportBtn  { background: #198754; color: #fff; }
#exportBtn:hover:not(:disabled)  { background: #146c43; }
#exportPdfBtn { background: #dc3545; color: #fff; }
#exportPdfBtn:hover:not(:disabled) { background: #b02a37; }
.btn-action:disabled { opacity:.55; cursor:not-allowed; }

/* ═══════════════════════════════════════════════════════
   SINGLE-LINE FILTER ROW
═══════════════════════════════════════════════════════ */
.filter-row-single {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.filter-row-single .filter-item {
  flex: 0 0 auto;
}
.filter-item.w-factory  { width: 150px; }
.filter-item.w-date     { width: 140px; }
.filter-item.w-contract { width: 170px; }
.filter-item.w-phase    { width: 150px; }
.filter-item.w-load     { width: 150px; }
.filter-item.w-btn      { width: 90px; }

/* keep the labels from wrapping / shrinking the columns */
.filter-row-single .form-control {
  white-space: nowrap;
}

/* ═══════════════════════════════════════════════════════
   REPORT WRAPPER
═══════════════════════════════════════════════════════ */
.report-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
  overflow-x: auto;
}

/* ═══════════════════════════════════════════════════════
   MESSAGES
═══════════════════════════════════════════════════════ */
.state-msg {
  text-align: center;
  padding: 40px;
  color: #777;
  font-size: 14px;
}
.state-msg.error { color: #c0392b; }

/* ═══════════════════════════════════════════════════════
   ERROR TEXT
═══════════════════════════════════════════════════════ */
.field-error {
  display: none;
  color: #dc3545;
  font-size: 11px;
  margin-top: 2px;
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .page-title { font-size: 18px; }
}

</style>
</head>

<body id="page-top">
<div id="wrapper">

  <!-- Sidebar -->
  <%@ include file="GPMSSidebar.jsp"%>

  <!-- Content Wrapper -->
  <div id="content-wrapper" class="d-flex flex-column">
    <div id="content">

      <!-- Topbar -->
      <nav class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top"
           style="background-color:#37499A;">
        <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
          <i class="fa fa-bars text-white"></i>
        </button>
        <ul class="navbar-nav ml-auto">
            <button class="btn btn-link"
              onclick="window.location.href='Landingpage.jsp'"
              style="background:transparent;border:none;color:white;">
              <i class="fa fa-home"></i>
            </button>
          <div class="topbar-divider d-none d-sm-block"></div>
          <li class="nav-item dropdown no-arrow">
            <a class="nav-link dropdown-toggle" href="#" id="userDropdown"
               role="button" data-toggle="dropdown">
              <i class="fas fa-user text-white mr-2"></i>
              <span class="d-none d-lg-inline text-white small" id="usernameDisplay">Username</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in">
              <a class="dropdown-item" href="#" onclick="logoutUser(event)">
                <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i> Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>

      <!-- Container -->
      <div class="container-fluid">

        <!-- PAGE TITLE -->
        <div class="page-title">Load Status Report</div>

        <!-- FILTER CARD -->
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="filter-row-single">

       <div class="filter-item w-factory">
                <div class="form-group mb-0">
                  <label>Type</label>
                  <select id="typeselect" class="form-control">
                    <option value="">Select Type</option>
                    <!-- <option value="0">All</option> -->
                    <option value="1">Summary</option>
                    <option value="2">Detail</option>
                  </select>
                  <span id="typeerror" class="field-error">Required</span>
                </div>
              </div>

              <!-- Factory -->
              <div class="filter-item w-factory">
                <div class="form-group mb-0">
                  <label>Factory</label>
                  <select id="factorySelect" class="form-control">
                    <option value="">Select Factory</option>
                    <!-- <option value="0">All</option> -->
                    <option value="1">Bellary</option>
                    <option value="2">Gujarat</option>
                  </select>
                  <span id="factoryError" class="field-error">Required</span>
                </div>
              </div>

              <!-- From Date -->
              <div class="filter-item w-date" hidden>
                <div class="form-group mb-0">
                  <label>From Date</label>
                  <input type="date" id="fromDate" class="form-control">
                  <span id="fromDateError" class="field-error">Required</span>
                </div>
              </div>

              <!-- To Date -->
              <div class="filter-item w-date" hidden>
                <div class="form-group mb-0">
                  <label>To Date</label>
                  <input type="date" id="toDate" class="form-control">
                  <span id="toDateError" class="field-error">Required</span>
                  <span id="dateRangeError" class="field-error">From &le; To</span>
                </div>
              </div>

              <!-- Contract -->
              <div class="filter-item w-contract">
                <div class="form-group mb-0">
                  <label>Contract</label>
                  <select id="contractInput" class="form-control">
                    <option value="">Select Contract</option>
                  </select>
                  <span id="contractError" class="field-error">Required</span>
                </div>
              </div>

              <!-- Phase -->
              <div class="filter-item w-phase">
                <div class="form-group mb-0">
                  <label>Phase</label>
                  <select id="phaseInput" class="form-control">
                    <option value="">Select Phase</option>
                  </select>
                  <span id="phaseError" class="field-error">Required</span>
                </div>
              </div>

              <!-- Load -->
              <div class="filter-item w-load">
                <div class="form-group mb-0">
                  <label>Load</label>
                  <select id="loadInput" class="form-control">
                    <option value="">Select Load</option>
                  </select>
                  <span id="loadError" class="field-error">Required</span>
                </div>
              </div>

              <!-- Fetch -->
              <div class="filter-item w-btn">
                <label style="visibility:hidden;font-size:12px;">.</label>
                <button id="fetchBtn" class="btn-action">
                  <i class="fas fa-search"></i> Fetch
                </button>
              </div>

              <!-- Export Excel -->
              <div class="filter-item w-btn">
                <label style="visibility:hidden;font-size:12px;">.</label>
                <button id="exportBtn" class="btn-action" disabled>
                  <i class="fas fa-file-excel"></i> Excel
                </button>
              </div>

              <!-- Export PDF -->
              <div class="filter-item w-btn">
                <label style="visibility:hidden;font-size:12px;">.</label>
                <button id="exportPdfBtn" class="btn-action" disabled>
                  <i class="fas fa-file-pdf"></i> PDF
                </button>
              </div>

            </div><!-- /filter-row-single -->
          </div>
        </div><!-- /filter card -->

        <!-- REPORT -->
        <div class="report-wrapper">
          <div id="reportBody">
            <div class="state-msg">Select filters and click Fetch</div>
          </div>
        </div>

      </div><!-- /container-fluid -->
    </div>
  </div>
</div>

<!-- JS FILES -->
<script src="vendor/jquery/jquery.min.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="js/ruang-admin.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="js/config.js"></script>
<script src="js/logout.js"></script>
<script src="js/username.js"></script>
<script src="js/Sessionfilter.js"></script>
<script src="js/loadStatusReport.js"></script>

<script>
// ═══════════════════════════════════════════════════════
// Simple client-side validation wiring
// (actual fetch/export logic lives in js/productionStatusReport.js)
// ═══════════════════════════════════════════════════════
function validateFilters() {
  let valid = true;

  const factory = document.getElementById('factorySelect');
  const fromDate = document.getElementById('fromDate');
  const toDate = document.getElementById('toDate');
  const contract = document.getElementById('contractInput');
  const phase = document.getElementById('phaseInput');
  const load = document.getElementById('loadInput');

  document.getElementById('factoryError').style.display = 'none';
  document.getElementById('fromDateError').style.display = 'none';
  document.getElementById('toDateError').style.display = 'none';
  document.getElementById('dateRangeError').style.display = 'none';
  document.getElementById('contractError').style.display = 'none';
  document.getElementById('phaseError').style.display = 'none';
  document.getElementById('loadError').style.display = 'none';

  if (!factory.value) {
    document.getElementById('factoryError').style.display = 'block';
    valid = false;
  }
  if (!fromDate.value) {
    document.getElementById('fromDateError').style.display = 'block';
    valid = false;
  }
  if (!toDate.value) {
    document.getElementById('toDateError').style.display = 'block';
    valid = false;
  }
  if (fromDate.value && toDate.value && fromDate.value > toDate.value) {
    document.getElementById('dateRangeError').style.display = 'block';
    valid = false;
  }
  if (!contract.value) {
    document.getElementById('contractError').style.display = 'block';
    valid = false;
  }
  if (!phase.value) {
    document.getElementById('phaseError').style.display = 'block';
    valid = false;
  }
  if (!load.value) {
    document.getElementById('loadError').style.display = 'block';
    valid = false;
  }

  return valid;
}
</script>

</body>
</html>
