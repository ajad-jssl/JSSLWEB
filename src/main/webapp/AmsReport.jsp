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
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">
  <link href="img/logo/download.png" rel="icon">
  <title>JSSL</title>
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">



  <link href="css/masterpage.css" rel="stylesheet">
   <link href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />


  

 <link href="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">

<script src="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>

<script>
    
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
    table.table-bordered th,
    table.table-bordered td {
      border: 1px solid #000 !important;
    }

    /* Set consistent column width */
    .table th,
    .table td {
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

<body>
  <div id="wrapper">
    <!-- Sidebar -->
     <%@ include file="AmsSidebar.jsp" %>
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
            <h1 class="h3 mb-0 text-gray-800">AMS Report</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="GPMSDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item"><a href="#">Ams Report</a></li>
              
            </ol>
          </div>
          
    
     <div class="container mt-5">
    <!-- Radio Buttons -->
   <div class="d-flex justify-content-center mb-4">
    <div class="nav nav-tabs" id="gpmsTabs" role="tablist">
        <!-- <a class="nav-item nav-link active" id="itemsTab" data-bs-toggle="tab" href="#items" role="tab"><b>AMS Detailed Report</b></a>
        
        <a class="nav-item nav-link" id="dateTab" data-bs-toggle="tab" href="#date" role="tab"><b>AMS History </b></a> -->
    
    <div class="nav nav-tabs" id="gpmsTabs" role="tablist">
    <a class="nav-item nav-link active" id="itemsTab" data-toggle="tab" href="#items" role="tab"><b>AMS Detailed Report</b></a>
    <a class="nav-item nav-link" id="dateTab" data-toggle="tab" href="#date" role="tab"><b>AMS History</b></a>
</div>

<!-- Empty panes just so Bootstrap 4's tab plugin has valid targets -->
<div class="tab-content d-none">
    <div class="tab-pane" id="items" role="tabpanel"></div>
    <div class="tab-pane" id="date" role="tabpanel"></div>
</div>
    </div>
</div>
 </div>
 
<div id="amsFilterSection" style="display:none;">
  <div class="container mt-3 border-box p-3" style="border:1px solid #ddd; border-radius:5px;">

    <div class="form-row mt-3">

      <!-- Search By -->
      <div class="col-md-3 mb-4 mr-4">
        <label><b>Search By:</b></label>
        <select class="form-control form-control-sm" id="searchBy">
          <option value="">Search By</option>
          <option value="contract">Select Contract</option>
          <option value="employee">Select Allocated To</option>
          <option value="assetType">Select Asset Type</option>
           <option value="summary">Summary Report</option>
        </select>
      </div>

      <!-- Contract -->
      <div class="col-md-3 mb-4" id="searchContract" style="display:none;">
        <label><b>Select Contract:</b></label>
        <select class="form-control form-control-sm universal-select" id="contract">
          <option value="">Select Contract</option>
        </select>
      </div>

      <!-- Employee -->
      <div class="col-md-3 mb-4" id="searchEmployee" style="display:none;">
        <label><b>Select Allocated To:</b></label>
        <select class="form-control form-control-sm universal-select" id="employee">
          <option value="">Select Employee</option>
        </select>
      </div>

      <!-- Asset Type -->
      <div class="col-md-3 mb-4" id="searchAssetType" style="display:none;">
        <label><b>Select Asset Type:</b></label>
        <select class="form-control form-control-sm universal-select" id="assetType">
          <option value="">Select Asset Type</option>
        </select>
      </div>

      <!-- Submit Button On Same Line -->
      <div class="col-md-2 mb-4 d-flex align-items-end">
        <button class="btn btn-primary btn-sm w-100" id="amsFilterSubmit">Search</button>
      </div>

    </div>

  </div>
</div>


 
 
 
<div id="container1" style="display: none;">
            <div class="modal-body">
             <form>                 
              <!-- <div class="form-row">
               <div class="form-group col-md-3">
                <label for="gate"><b>Gate Pass No:</b></label>               
                <select id="gate" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>                                   
              </div>  -->
              
              
              
              
              
              
    
              


<!-- Dynamic Fields Container (Initially Hidden) -->
<div class="container container-report mt-4">
    <h5 class="text-center report-header">Ams Detail Allocated Report</h5>
    <div class="form-row dynamic-row">
        <div class="table-responsive">
            <table class="table table-bordered table-sm" id="TableID">
                <thead>
                    <tr>
                        <th>SL.NO</th>
                        <th>Asset Type</th>
                        <th>Contract</th>
                        <th>Employee ID</th>
                        <th>Asset Model</th>
                        <th>Asset Maker</th>
                       
                        <th>Purchase Date</th>
                        <th>Allocated To</th>
                        <th>Allocated Date</th>
                        <th>Allocated Rtn Date</th>
                     
                    </tr>
                </thead>
                <tbody>
                    <!-- Data will be populated here -->
                </tbody>
            </table>
        </div>
    </div>
    <button type="button" class="btn btn-success btn-sm my-3" onclick="exportToExcelitem()">Export to Excel</button>
</div>


</form>
</div>
</div>


<div id="container4" style="display: none;">
    <div class="modal-body">
        <form>

            <!-- 🔽 Report Type & Date Filters in One Line -->
            <div class="form-row align-items-end mb-3" id="#subcontainer4">
                <!-- Report Type Dropdown -->
               

                <!-- Start Date -->
                <div class="form-group col-md-3">
                    <label for="fromDate"><b>Start Date:</b></label>
                    <input type="date" class="form-control form-control-sm" id="fromDate">
                </div>

                <!-- End Date -->
                <div class="form-group col-md-3">
                    <label for="toDate"><b>End Date:</b></label>
                    <input type="date" class="form-control form-control-sm" id="toDate">
                </div>
                
                

                <!-- Fetch Button -->
                <div class="form-group col-md-2">
                    <button  id="fetchReportBtn" type="button" class="btn btn-primary btn-sm w-100" onclick="fetchHistoryReport()">
                        Fetch Report
                    </button>
                </div>
            </div>

            <!-- 🔽 ALLOCATION HISTORY TABLE -->
            <div class="container container-report mt-4" id="allocationHistoryContainer" style="display:block;">
    <h5 class="text-center report-header">AMS Allocation History</h5>
    <div class="form-row dynamic-row">
        <div class="table-responsive">
            <table class="table table-bordered table-sm" id="Table_1">
                <thead>
                    <tr>
                        <th>SL.No</th>
                        <th>Asset No</th>
                        <th>Transaction Date</th>
                        <th>Asset Type</th>
                        <th>Asset Make</th>
                        <th>Asset Model</th>
                        <th>Contract Name</th>
                        <th>Asset Serial No</th>
                        <th>Purchase Date</th>
                        <th>Purchase Order</th>
                        <th>Cost</th>
                        <th>Warranty Start Date</th>
                        <th>Warranty End Date</th>
                        <th>Asset Status</th>
                        <th>Allocated To</th>
                        <th>Department</th>
                        <th>Assigned Date</th>
                        <th>Expected Return Date</th>
                      
                        <th>Created By</th>
                        <th>Created Date</th>
                        <th>Modified By</th>
                        <th>Modified Date</th>
                        <th>Return Date</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
    <button  type="button"  class="btn btn-success btn-sm my-3" onclick="exportToExcelHistroy()">Export to Excel</button>
</div>

         

        </form>
    </div>
</div>

           


<div id="container6" style="display: none;">
  <div class="modal-body">
    <form>
      <!-- Dynamic Fields Container (Initially Hidden) -->
      <div class="container container-report mt-4" id="summaryReportDiv" style="display:none;">
        <h5 class="text-center report-header">AMS Summary Report</h5>

        <div class="form-row dynamic-row">
          <div class="table-responsive">
            <table class="table table-bordered table-sm" id="SummaryTable">
              <thead>
                <tr>
                  <th>SL.NO</th>
                  <th>Asset Type</th>
                  <th>Total Asset</th>
                  <th>Allocated</th>
                  <th>Stock</th>
                  <th>Working</th>
                  <th>Not Working</th>
                  <th>Scrap</th>
                  <th>Repair</th>
                  <th>Others</th>
                  <th>Total Status</th>
                </tr>
              </thead>
              <tbody>
                <!-- Data will be populated here -->
              </tbody>
            </table>
          </div>
        </div>

        <button type="button" class="btn btn-success btn-sm my-3" onclick="exportToExcelSummary()">Export to Excel</button>
      </div>
    </form>
  </div>
</div>

      <!-- Modal Body --> 
     
 
 
  
</div>
</div>
</div>
</div>





<script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/xlsx/0.20.3/xlsx.full.min.js"></script>
   




<script>
function exportToExcelitem() {
    var table = document.getElementById("TableID");
    var workbook = XLSX.utils.table_to_book(table, { sheet: "AMS Detailed Report" });
    var worksheet = workbook.Sheets["AMS Detailed Report"];

    // Add heading
    const title = "AMS ITEM REPORT";
    XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: "A1" });

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const lastCol = range.e.c;

    // Merge heading
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } });

    // Style heading
    worksheet["A1"].s = {
        font: { bold: true, sz: 18 },
        alignment: { horizontal: "center", vertical: "center" }
    };

    // Shift table down
    const tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true });
    XLSX.utils.sheet_add_aoa(worksheet, tableData, { origin: "A2" });

    // Fix first column header
    if (worksheet['A2']) worksheet['A2'].v = "Sl No";

    // Auto column width
    const newRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = newRange.s.c; C <= newRange.e.c; ++C) {
        let maxWidth = 5;
        for (let R = newRange.s.r; R <= newRange.e.r; ++R) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
            if (!cell) continue;
            const cellValue = cell.v ? cell.v.toString() : "";
            maxWidth = Math.max(maxWidth, cellValue.length);
        }
        worksheet['!cols'] = worksheet['!cols'] || [];
        worksheet['!cols'][C] = { wch: maxWidth + 2 };
    }

    XLSX.writeFile(workbook, "AMS_Detailed_Report.xlsx");
}

function exportToExcelSummary() {
    var table = document.getElementById("SummaryTable");
    var workbook = XLSX.utils.table_to_book(table, { sheet: "AMS Summary Report" });
    var worksheet = workbook.Sheets["AMS Summary Report"];

    // Add heading
    const title = "AMS SUMMARY REPORT";
    XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: "A1" });

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const lastCol = range.e.c;

    // Merge heading
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } });

    // Style heading
    worksheet["A1"].s = {
        font: { bold: true, sz: 18 },
        alignment: { horizontal: "center", vertical: "center" }
    };

    // Shift table down
    const tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true });
    XLSX.utils.sheet_add_aoa(worksheet, tableData, { origin: "A2" });

    // Fix first column header
    if (worksheet['A2']) worksheet['A2'].v = "Sl No";

    // Auto column width
    const newRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = newRange.s.c; C <= newRange.e.c; ++C) {
        let maxWidth = 5;
        for (let R = newRange.s.r; R <= newRange.e.r; ++R) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
            if (!cell) continue;
            const cellValue = cell.v ? cell.v.toString() : "";
            maxWidth = Math.max(maxWidth, cellValue.length);
        }
        worksheet['!cols'] = worksheet['!cols'] || [];
        worksheet['!cols'][C] = { wch: maxWidth + 2 };
    }

    XLSX.writeFile(workbook, "AMS_Summary_Report.xlsx");
}

function exportToExcelHistroy() {
    var table = document.getElementById("Table_1"); // Correct table ID
    var workbook = XLSX.utils.table_to_book(table, { sheet: "AMS History Report" });
    var worksheet = workbook.Sheets["AMS History Report"];

    // Add heading in A1
    const title = "AMS History Report";
    XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: "A1" });

    // Get current range
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const lastCol = range.e.c;

    // Merge heading across all columns
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push({
        s: { r: 0, c: 0 },
        e: { r: 0, c: lastCol }
    });

    // Style heading: bold, bigger font, centered
    const firstCell = worksheet["A1"];
    firstCell.s = {
        font: { bold: true, sz: 18 },
        alignment: { horizontal: "center", vertical: "center" }
    };

    // Shift table down by 1 row
    const tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true });
    XLSX.utils.sheet_add_aoa(worksheet, tableData, { origin: "A2" });

    // Fix first column header to "Sl No"
    if (worksheet['A2']) worksheet['A2'].v = "Sl No";

    // Auto adjust column width
    const newRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = newRange.s.c; C <= newRange.e.c; ++C) {
        let maxWidth = 5;
        for (let R = newRange.s.r; R <= newRange.e.r; ++R) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
            if (!cell) continue;
            const cellValue = cell.v ? cell.v.toString() : "";
            maxWidth = Math.max(maxWidth, cellValue.length);
        }
        worksheet['!cols'] = worksheet['!cols'] || [];
        worksheet['!cols'][C] = { wch: maxWidth + 2 };
    }

    XLSX.writeFile(workbook, "AMS_History_Report.xlsx");
}




</script>


<script>


</script>



  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>


  


    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    
    
    
    <script src="vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
     <script src="js/config.js?v=<%=jsVersion%>"></script>
    
    
    
   <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script> 



       
         <script src="js/AmsReport.js?v=<%=jsVersion%>"></script>
  
    <script src="js/outwardreturnable.js?v=<%=jsVersion%>"></script>
     <script src="js/username.js?v=<%=jsVersion%>"></script>
     <script src="js/logout.js?v=<%=jsVersion%>"></script>
   
   
  <script src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

  
</body>
</html>