<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    

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
     
   <link rel="stylesheet" href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
   <link rel="stylesheet" href="css/main.css">
   
<link href="externalLibrary/cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEJjRkC9iY3NfJVzz6se99Nz05dfk03S8zNeS46E1H2nKfHlR9ltRf9TL7zG6" crossorigin="anonymous">
 <link href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

<script src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<link rel="stylesheet" href="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

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

        .signature-block th {
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

<body >
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
            <h1 class="h3 mb-0 text-gray-800">QC Inspection Report</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="QCDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item"><a href="QCInspectionReport.jsp">QC Inspection Report</a></li>
              
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
        <select id="Contract" class="form-control form-control-sm"></select>
      </div>

      <div class="form-group col-md-3">
        <label><b>Phase</b></label>
        <select id="Phase" class="form-control form-control-sm"></select>
      </div>

      <div class="form-group col-md-3">
        <label><b>Load</b></label>
        <select id="Load" class="form-control form-control-sm"></select>
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
        <th colspan="16" class="text-center align-middle" style="font-size: 20px;">
            <strong>FIT UP AND WELDING INSPECTION REPORT SUMMARY</strong>
        </th>
        <td colspan="2" class="text-center">
            <img src="img/logo/download.png" alt="Logo" style="width: 100px;" />
        </td>
    </tr>
    <tr class="bg-light">
        <td colspan="6"><strong>Contract:</strong> <span id="hdrContract"></span></td>
        <td colspan="6"><strong>Phase:</strong> <span id="hdrPhase"></span></td>
        <td colspan="6"><strong>Load:</strong> <span id="hdrLoad"></span></td>
    </tr>
    <tr class="table-secondary text-center">
        <th>SL.NO</th>
        <th>MARK</th>
        <th>REV</th>
        <th>QTY (NO)</th>
        <th>SECTION SIZE</th>
        <th>FITTING MARK</th>
        <th>FABRICATOR ID</th>
        <th>LENGTH (mm)</th>
        <th>FIT UP INSPECTED BY</th>
        <th>WELDER ID</th>
        <th>BUCKLING (mm)</th>
        <th>CAMBER (mm)</th>
        <th>SWEEP (mm)</th>
        <th>WELD VISUAL</th>
        <th>UT</th>
        <th>RESULT</th>
        <th>INSPECTED BY</th>
        <th>DATE</th>
    </tr>
</thead>

    <tbody id="reportBody"></tbody>

    <!-- ✅ Footer in tfoot — NOT loose inside table -->
<tfoot id="reportFooter">
    <tr class="table-secondary text-center">
        <td colspan="18" class="text-center font-italic">
            <b>All part marks checked as per fabrication drawing and found satisfactory.</b>
        </td>
    </tr>
    <tr class="signature-block">
        <td colspan="2"><strong>Name &amp; Signature</strong></td>
        <td colspan="5" id="inspectorName"></td>
        <td colspan="4"></td>
        <td colspan="7"></td>
    </tr>
    <tr class="signature-block">
        <td colspan="2"><strong>Date</strong></td>
        <td colspan="5" id="inspectorDate"></td>
        <td colspan="4"></td>
        <td colspan="7"></td>
    </tr>
    <tr class="text-center">
        <td colspan="6"><strong>JSSL</strong></td>
        <td colspan="6"><strong>THIRD PARTY</strong></td>
        <td colspan="6"><strong>CLIENT</strong></td>
    </tr>
    <tr>
        <td colspan="10" class="text-left font-italic small">
            <b>Note: This is a computer-generated report and does not require signature or stamp.</b>
        </td>
        <td colspan="8" class="text-right small">
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

  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
 

<script src="externalLibrary/cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>



<script>
function printreport() {

    var originalTable = document.getElementById("TableID");
    var thead = originalTable.querySelector("thead");
    var tfoot = originalTable.querySelector("tfoot");
    var allRows = Array.from(originalTable.querySelectorAll("tbody tr"));

    /* Stacked values (one per line) -> comma separated wrapped text */
    function compactCell(html) {
        return html
            .replace(/<br\s*\/?>/gi, ", ")
            .replace(/[\r\n]+/g, " ")
            .replace(/(,\s*){2,}/g, ", ")
            .replace(/^\s*,\s*/, "")
            .replace(/,\s*$/, "")
            .trim();
    }

    /* Column widths in % (18 columns, total = 100) */
    var colWidths = [
        3.5,  // 1  SL.NO
        4.5,  // 2  MARK
        3,    // 3  REV
        3,    // 4  QTY
        10.9, // 5  SECTION SIZE
        8.5,  // 6  FITTING MARK
        6.3,  // 7  FABRICATOR ID
        9.5,  // 8  LENGTH
        5.8,  // 9  FIT UP INSPECTED BY
        4.5,  // 10 WELDER ID
        5.2,  // 11 BUCKLING
        4.8,  // 12 CAMBER
        4.5,  // 13 SWEEP
        6.2,  // 14 WELD VISUAL
        3,    // 15 UT
        5.5,  // 16 RESULT
        5.8,  // 17 INSPECTED BY
        5.5   // 18 DATE
    ];

    var colgroup = "<colgroup>" + colWidths.map(function (w) {
        return '<col style="width:' + w + '%">';
    }).join("") + "</colgroup>";

    var printWindow = window.open("", "", "height=900,width=1400");

    printWindow.document.write(`
    <html>
    <head>
    <title>QC Inspection Report</title>

    <style>

    *{
        -webkit-print-color-adjust:exact;
        print-color-adjust:exact;
        box-sizing:border-box;
        margin:0;
        padding:0;
    }

    body{
        font-family:Arial,sans-serif;
        font-size:11pt;
        color:#000;
        background:#fff;
        padding:5px;
    }

    table{
        width:100%;
        table-layout:fixed;
        border-collapse:collapse;
        border:1.5px solid #000;
        font-size:8pt;
    }

    thead{
        display:table-header-group !important;
    }

    tfoot{
        display:table-row-group !important;
        page-break-inside:avoid;
        break-inside:avoid;
    }

    tr{
        page-break-inside:avoid;
        break-inside:avoid;
    }

    th,
    td{
        border:1px solid #000;
        padding:3px 2px;
        text-align:center;
        vertical-align:middle;
    }

    td{
        overflow-wrap:break-word;
        word-wrap:break-word;
    }

    /* HEADER LABELS: never break inside a word */
    th{
        overflow-wrap:normal;
        word-wrap:normal;
        word-break:normal;
        hyphens:none;
    }

    thead tr:last-child th{
        font-size:6.5pt;
        line-height:1.2;
        white-space:normal;
    }

    tbody td{
        font-size:8pt;
        line-height:1.25;
    }

    /* SECTION SIZE (5), FITTING MARK (6), LENGTH (8): compact wrapped text */
    tbody td:nth-child(5),
    tbody td:nth-child(6),
    tbody td:nth-child(8){
        text-align:center !important;
        vertical-align:middle !important;
        white-space:normal !important;
        font-size:7pt !important;
        line-height:1.3;
    }

    /* FABRICATOR ID (7), WELDER ID (10), WELD VISUAL (14), RESULT (16), DATE (18):
       always on a single line */
    tbody td:nth-child(7),
    tbody td:nth-child(10),
    tbody td:nth-child(14),
    tbody td:nth-child(16),
    tbody td:nth-child(18){
        white-space:nowrap !important;
        font-size:7pt !important;
    }

    .signature-block td,
    .signature-block th{
        height:45px;
    }

    .text-right{
        text-align:right !important;
    }

    .text-left{
        text-align:left !important;
    }

    .font-italic{
        font-style:italic;
    }

    .small{
        font-size:9pt;
    }

    .bg-light,
    .table-secondary {
        background: #fff !important;
        background-color: #fff !important;
    }

    img{
        max-width:100px;
    }

    @page{
        size:A4 landscape;
        margin:8mm;
    }

    @media print{

        thead{
            display:table-header-group !important;
        }

        tfoot{
            display:table-row-group !important;
        }

        tr{
            page-break-inside:avoid !important;
            break-inside:avoid !important;
        }
    }

    </style>
    </head>
    <body>
    `);

    printWindow.document.write("<table>");
    printWindow.document.write(colgroup);

    if (thead) {
        printWindow.document.write(thead.outerHTML);
    }

    printWindow.document.write("<tbody>");

    allRows.forEach(function (row) {
        var clone = row.cloneNode(true);
        [5, 6, 8].forEach(function (n) {
            var cell = clone.cells[n - 1];
            if (cell) {
                cell.innerHTML = compactCell(cell.innerHTML);
            }
        });
        printWindow.document.write(clone.outerHTML);
    });

    printWindow.document.write("</tbody>");

    if (tfoot) {
        printWindow.document.write(tfoot.outerHTML);
    }

    printWindow.document.write("</table>");
    printWindow.document.write("</body></html>");

    printWindow.document.close();
    printWindow.focus();

    setTimeout(function () {
        printWindow.print();
        printWindow.close();
    }, 1000);
}
</script>
  <script src="vendor/jquery/jquery.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
      <script src="vendor/datatables/jquery.dataTables.min.js"></script>
   <script src="js/config.js?v=<%=jsVersion%>"></script>

      <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
   
     <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>   

    <script src="js/QCInspectionReport.js?v=<%=jsVersion%>"></script>
    <script src="js/logout.js?v=<%=jsVersion%>"></script>
    <script src="js/username.js?v=<%=jsVersion%>"></script>

    <script src="js/createdby.js?v=<%=jsVersion%>"></script>
 	<script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
 	<script src="js/factoryid.js?v=<%=jsVersion%>"></script>


</body>
</html>
