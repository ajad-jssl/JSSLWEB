<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%
long ts = System.currentTimeMillis();
%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">
  <link href="img/logo/download.png" rel="icon">
  <title>JSSL</title>
   <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css" />
   <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
   <link href="css/ruang-admin.min.css" rel="stylesheet" />
   <link href="vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">
      <!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css" /> -->
   <link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
   <link rel="stylesheet" href="css/main.css">
       <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
       <script src="js/sidebar.js"></script>
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEJjRkC9iY3NfJVzz6se99Nz05dfk03S8zNeS46E1H2nKfHlR9ltRf9TL7zG6" crossorigin="anonymous">
 <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

<script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>
    
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
    /* background-color: #007bff;  *//* Primary color */
    color: black; /* Text color */
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    height: 45px; /* Adjust the height as needed */
  }
  .modal-header1 {
     background-color: #007bff;  /* Primary color */
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
    .input-group-append .input-group-text{
        font-size: 12px; 
        color: black; 
    }
    .input-group-prepend span {
    color: black;
    background-color: #dcdce6;
    border-color: #dcdce6;
}
.input-group-append span{
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
div.dt-buttons>.dt-button:first-child, div.dt-buttons>div.dt-button-split .dt-button:first-child {
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
    text-decoration: underline; /* Optional: underline when hovering over the link */
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
  min-width: 120px;  /* ensures readability */
}

.modal-body {
  overflow-x: auto;  /* horizontal scroll if needed */
}
</style>
<!-- <script type="text/javascript">
    window.history.forward();

    // Auth Guard
    const loginStatus = sessionStorage.getItem('loginStatus');
    if (loginStatus !== 'Success') {
      logout();
    }

    function noBack() {
      window.history.forward();
    }

    function logout() {
      sessionStorage.removeItem('loginStatus');
      window.location = "newlogin.jsp";
    }
  </script> -->
  
       <style>
        table {
        border-collapse: collapse;
        width: 100%;
        font-family: Arial, sans-serif;
        font-size: 14px;
        border: 2px solid #000; /* Outer border */
    }
        th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
        }

        h2, h4 {
            margin: 0;
            font-weight: bold;
        }

        .report-title {
            font-size: 22px;
            text-align: center;
            padding: 12px 0;
        }

        .note, .format {
            font-size: 12px;
            padding: 6px;
        }

        .signature-block th,
        .signature-block td.text-left {
            text-align: left;
        }

        .section-label {
            text-align: right;
            background-color: #f2f2f2;
        }
       
    </style>
    
    <style>
  .signature1-block td {
    text-align: center !important;
    vertical-align: middle;
  }
</style>
</head>

<body onload="fetchUserList();">
  <div id="wrapper">
    <!-- Sidebar -->
      <%@ include file="QCSidebar.jsp" %>
    <!-- Sidebar -->
    <div id="content-wrapper" class="d-flex flex-column">
      <div id="content">
        <!-- TopBar -->
     <nav class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top" style="background-color: #37499A;">
                <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
                    <i class="fa fa-bars"></i>
                </button>
               
                <ul class="navbar-nav ml-auto">

                    <button class="btn btn-link" onclick="window.location.href='Landingpage.jsp'" style="background-color: transparent; color: white; border: none;">
                        <i class="fa fa-home"></i>
                    </button>
                    <div class="topbar-divider d-none d-sm-block"></div>
                  <li class="nav-item dropdown no-arrow">
                        <a class="nav-link dropdown-toggleww" href="#" id="userDropdown123" role="button" data-toggle="dropdown"
				           aria-haspopup="true" aria-expanded="false">
				           <i class="fas fa-user text-white mr-2"></i> <!-- Settings icon -->
				           <span class="ml-2 d-none d-lg-inline text-white small" id="usernameDisplay">Username</span>
				        </a>
                        <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" onclick="logoutUser(event)">
                                <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Logout
                            </a>
                        </div>
                    </li>
                </ul>
            </nav>
        <!-- Topbar -->
        <!-- Container Fluid-->
        <div class="container-fluid" id="container-wrapper">
          <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">Loose Items Inspection Report</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="QCDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item"><a href="LooseItemsInspectionReport.jsp">Loose Items Inspection Report</a></li>
              
            </ol>
          </div>
          
          
<div class="card mb-4">
  <div class="card-body">
    <div class="form-row align-items-end">

       <div class="form-group col-md-3">
         <label for="factory"><b>Factory</b></label>               
         <select id="factory" class="form-control form-control-sm">
         <option value="">Select factory</option>                               
         </select>
      </div>
      <div class="form-group col-md-3">
        <label><b>Contract</b></label>
        <select id="Contract1" class="form-control form-control-sm"></select>
      </div>

      <div class="form-group col-md-3">
        <label><b>Phase</b></label>
        <select id="Phase1" class="form-control form-control-sm"></select>
      </div>

      <div class="form-group col-md-3">
        <label><b>Load</b></label>
        <select id="Load1" class="form-control form-control-sm"></select>
      </div>

      <!-- <div class="form-group col-md-3">
        <button class="btn btn-sm btn-success" id="search">
          <i class="fas fa-search"></i> Search
        </button>
      </div> -->

    </div>
  </div>
</div>

<div id="container1" style="display: none;">
<div style="overflow-x:auto;color:Black">
 <table class="table table-bordered table-sm" id="TableID" style="width: 100%; font-size: 14px;">
    <thead>
        <tr>
            <th colspan="8" class="text-center align-middle" style="font-size: 20px;">
                <strong>LOOSE ITEMS INSPECTION REPORT SUMMARY</strong>
            </th>
            <td colspan="2" class="text-center">
                <img src="img/logo/download.png" alt="Logo" style="width: 100px;" />
            </td>
        </tr>
        <tr class="bg-light">
            <td colspan="3"><strong>Contract:</strong> <span id="hdrContract1"></span></td>
            <td colspan="4"><strong>Phase:</strong> <span id="hdrPhase1"></span></td>
            <td colspan="3"><strong>Load:</strong> <span id="hdrLoad1"></span></td>
        </tr>
        <tr class="table-secondary text-center">
            <th>SL.NO</th>
            <th>Description</th>
            <th>MARK (NO)</th>
            <th>QTY</th>
            <th>Section Size</th>
            <th>Dims</th>
            <th>Visual Inspection</th>
            <th>Result</th>
            <th>INSPECTED BY</th>
            <th>DATE</th>
        </tr>
    </thead>

    <tbody id="reportBody"></tbody>

    <!-- ✅ Footer in tfoot — NOT loose inside table -->
    <tfoot id="reportFooter">
        <tr class="bg-light">
            <td colspan="10" class="text-center font-italic">
                <b>All part marks checked as per fabrication drawing and found satisfactory.</b>
            </td>
        </tr>
        <tr class="signature-block">
            <td colspan="1" class="text-left"><strong>Name &amp; Signature</strong></td>
            <td colspan="2" id="weldinspectorname"></td>
            <td colspan="4" id="thirdpartyname"></td>
            <td colspan="3" id="clientname"></td>
        </tr>
        <tr class="signature-block">
            <td colspan="1" class="text-left"><strong>Date</strong></td>
            <td colspan="2" id="weldinspectorDate"></td>
            <td colspan="4" id="thirdpartyDate"></td>
            <td colspan="3" id="clientDate"></td>
        </tr>
        <tr class="signature1-block text-center">
            <td colspan="3"><strong>JSSL</strong></td>
            <td colspan="4"><strong>THIRD PARTY</strong></td>
            <td colspan="3"><strong>CLIENT</strong></td>
        </tr>
        <tr>
            <td colspan="6" class="text-left font-italic small">
                <b>Note: This is a computer-generated report and does not require signature or stamp.</b>
            </td>
            <td colspan="4" class="text-right small">
                <b>Format No: JSSL-QA-38 Rev.02</b>
            </td>
        </tr>
    </tfoot>
</table>
    </div>
    <div class="mt-2">
        <button type="button" class="btn btn-sm btn-secondary" onclick="printreport()">Print Report</button>
    </div>
      </div> 
     </div>
    </div>
   </div> 
  </div>
 </div>
</div>
</div>
</div>
</div>

  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

  <!-- Bootstrap JS and dependencies -->


<!-- <script>
  document.getElementById("btnnext").addEventListener("click", function () {
    document.getElementById("container2").style.display = "block";
  });
</script> -->  


<!-- <script>
  document.getElementById("search").addEventListener("click", function () {
    document.getElementById("container1").style.display = "block";
  });
</script> -->

<script>
function printreport() {

    var originalTable = document.getElementById("TableID");
    var thead = originalTable.querySelector('thead');
    var tfoot = originalTable.querySelector('tfoot');
    var allRows = Array.from(originalTable.querySelectorAll('tbody tr'));

    var rowsPerPage = 15;
    var totalPages = Math.ceil(allRows.length / rowsPerPage);

    var printWindow = window.open('', '', 'height=900,width=1200');

    printWindow.document.write('<html><head><title>Print Report</title>');

    printWindow.document.write(`
<style>

* {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: Arial, sans-serif;
    font-size: 11pt;
    background: #fff;
    color: #000;
}

.page-block {
    width: 100%;
    padding: 12px 18px;
    page-break-after: always;
    display: flex;
    flex-direction: column;
}

.page-block:last-child {
    page-break-after: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
    font-family: Arial, sans-serif;
    font-size: 10pt;
    border: 1.5px solid #000;
}

thead {
    display: table-header-group;
}

tfoot {
    display: table-footer-group;
}

tr {
    page-break-inside: avoid;
    page-break-after: auto;
}

th, td {
    border: 1px solid #000;
    padding: 4px 5px;
    text-align: center;
    vertical-align: middle;
    font-family: Arial, sans-serif;
    word-wrap: break-word;
}

/* Title row */
.title-row th {
    font-size: 17pt;
    font-weight: bold;
    letter-spacing: 0.5px;
    padding: 10px 4px;
    text-align: center;
    border: 1px solid #000;
}

.logo-cell {
    text-align: center;
    padding: 5px;
    border: 1px solid #000;
}

.logo-cell img {
    width: 80px;
}

/* Contract/Phase/Load row */
.info-row td, .info-row th {
    font-size: 10pt;
    font-weight: bold;
    padding: 4px 8px;
    text-align: left;
    border: 1px solid #000;
}

.info-row td span,
.info-row th span {
    font-weight: bold;
}

.info-row td strong,
.info-row th strong {
    font-weight: bold;
}

/* Column header row */
.col-header th {
    font-size: 9pt;
    font-weight: bold;
    padding: 4px 3px;
    text-align: center;
    border: 1px solid #000;
    white-space: normal;
    word-break: break-word;
    line-height: 1.4;
}

/* Data rows */
tbody tr td {
    font-size: 10pt;
    padding: 4px 3px;
    text-align: center;
    border: 1px solid #000;
}

/* Footer rows */
tfoot td, tfoot th {
    font-size: 10pt;
    border: 1px solid #000;
    padding: 5px 8px;
}

.footer-note td {
    font-size: 8pt;
    font-style: italic;
    border: 1px solid #000;
    padding: 4px 6px;
}

.page-num {
    text-align: right;
    font-size: 9pt;
    padding-top: 4px;
    color: #333;
}

@media print {
    @page {
        size: A4 landscape;
        margin: 8mm 10mm;
    }
    body {
        font-size: 11pt;
    }
    .page-block {
        padding: 0;
        page-break-after: always;
    }
    .page-block:last-child {
        page-break-after: auto;
    }
    thead {
        display: table-header-group;
    }
    tfoot {
        display: table-footer-group;
    }
    tr {
        page-break-inside: avoid;
    }
    .page-num {
        display: none;
    }
}

/* Name & Signature value cells - expand height for each party's signing box */
tfoot .signature-block td:not(.text-left) {
    min-height: 45px;
    height: 45px;
}

/* Format No - move to right */
.text-right {
    text-align: right !important;
}

</style>
    `);

    printWindow.document.write('</head><body>');

    for (var pageIndex = 0; pageIndex < totalPages; pageIndex++) {

        var startRow = pageIndex * rowsPerPage;
        var endRow   = Math.min(startRow + rowsPerPage, allRows.length);
        var pageRows = allRows.slice(startRow, endRow);

        var isLastPage = (pageIndex === totalPages - 1);

        printWindow.document.write('<div class="page-block">');
        printWindow.document.write('<table>');

        /* ── THEAD (repeated on every page) ── */
        if (thead) {
            printWindow.document.write(thead.outerHTML);
        }

        /* ── DATA ROWS ── */
        printWindow.document.write('<tbody>');
        pageRows.forEach(function(row) {
            printWindow.document.write(row.outerHTML);
        });
        printWindow.document.write('</tbody>');

        /* ── TFOOT only on last page ── */
        if (isLastPage && tfoot) {
            printWindow.document.write(tfoot.outerHTML);
        }

        printWindow.document.write('</table>');

        /* page number shown on screen preview */
        printWindow.document.write(
            '<div class="page-num">Page ' + (pageIndex + 1) + ' of ' + totalPages + '</div>'
        );

        printWindow.document.write('</div>');
    }

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();

    setTimeout(function() {
        printWindow.print();
        printWindow.close();
    }, 700);
}
</script>

   <script src="js/config.js"></script>
  <script src="vendor/jquery/jquery.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
      <script src="js/ruang-admin.min.js"></script>
      <!-- Page level plugins -->
      <script src="vendor/datatables/jquery.dataTables.min.js"></script>
      <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
    <!-- <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script> -->
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>  
    <!-- <script src="js/LooseItemsInspectionReport.js"></script> -->
    <script src="js/LooseItemsInspectionReport.js?v=<%=ts%>"></script>
    <script src="js/logout.js"></script>
    <script src="js/username.js"></script>
    <script src="js/customertype.js"></script>
    <script src="js/createdby.js"></script>
 	<script src="js/modifiedby.js"></script>
 	<script src="js/factoryid.js"></script>

  <!-- Page level custom scripts -->
</body>
</html>
