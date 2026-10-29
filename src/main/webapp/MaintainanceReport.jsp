<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%
    response.setHeader("Cache-Control","no-cache,no-store,must-revalidate");
    response.setHeader("Pragma","no-cache");
    response.setDateHeader("Expires",0);
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

/* 🔹 Fixed container */
.table-wrapper {
    width: 100%;
    max-width: 100%;
    height: 600px;            /* ✅ FIXED HEIGHT */
    overflow-y: auto;         /* ✅ Vertical scroll */
    overflow-x: auto;         /* ✅ Horizontal scroll */
    border: 1px solid #000;
}

/* 🔹 Fix table layout */
.dynamicdesign {
    table-layout: fixed;      /* ✅ Prevent column stretching */
    width: 100%;
}

/* 🔹 Fix column widths */
.dynamicdesign th,
.dynamicdesign td {
    min-width: 120px;
    max-width: 180px;
   white-space: normal;
word-wrap: break-word;     /* ❌ Prevent line break */
    overflow: hidden;
    text-overflow: ellipsis;  /* ... if long text */
}

/* 🔹 Sticky header */
.dynamicdesign thead th {
    position: sticky;
    top: 0;
    background: #f1f1f1;
    z-index: 2;
}
.form-control-sm {
    min-width: 120px;
}

#fetchsummaryOrdetails {
    white-space: nowrap;
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
</head>

<body>
  <div id="wrapper">
    <!-- Sidebar -->
      <%@ include file="MaintenanceSideBar.jsp" %>
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
            <h1 class="h3 mb-0 text-gray-800">Maintenance Report</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
             <li class="breadcrumb-item"><a href="#">Maintenance Report</a></li>
              
            </ol>
          </div>
          
    
     <div class="container mt-5">
    <!-- Radio Buttons -->
   <div class="d-flex justify-content-center mb-4">
    <div class="nav nav-tabs" id="gpmsTabs" role="tablist">
     
      <a class="nav-item nav-link" id="packingnoteTab" data-bs-toggle="tab" href="#date" role="tab" ><b>MaintenanceReport</b></a>

    </div>
</div>
 </div>
 









 
 
 
 

<div id="container3" style="display: none;">
    <div class="modal-body">
        <form>

            <!-- 🔽 Report Type & Date Filters in One Line -->
  <div class="row align-items-end mb-3">

    <!-- Report Type -->
    <div class="col">
        <label for="reportType"><b>Report Type</b></label>
        <select class="form-control form-control-sm" id="reportType">
            <option value="">Select</option>
            <option value="summary">Summary</option>
            <option value="details">Details</option>
        </select>
    </div>

    <!-- Factory -->
    <div class="col">
        <label for="FactoryId"><b>Factory</b></label>
        <select class="form-control form-control-sm" id="FactoryId">
            <option value="">Select</option>
                <option value="All">All</option>
        </select>
    </div>

    <!-- Machine Category -->
    <div class="col">
        <label for="machineCategory"><b>Machine Category</b></label>
        <select class="form-control form-control-sm" id="machineCategory">
            <option value="">Select</option>
        </select>
    </div>

    <!-- Machine Type -->
    <div class="col">
        <label for="machineType"><b>Machine Type</b></label>
        <select class="form-control form-control-sm" id="machineType">
            <option value="">Select</option>
        </select>
    </div>

    <!-- Start Date -->
    <div class="col">
        <label for="fromDate"><b>Start Date</b></label>
        <input type="date" class="form-control form-control-sm" id="fromDate">
    </div>

    <!-- End Date -->
    <div class="col">
        <label for="toDate"><b>End Date</b></label>
        <input type="date" class="form-control form-control-sm" id="toDate">
    </div>

    <!-- Fetch Button -->
    <div class="col-auto">
        <button type="button"
                class="btn btn-primary btn-sm"
                id="fetchsummaryOrdetails">
            Fetch Report
        </button>
    </div>

</div>
          

            
       <!-- 🔹 DETAILS TABLE (Already present) -->
<div class="container container-report mt-4" id="detailsTableContainer" style="display:none;">
    <h5 class="text-center report-header">Ticket Summary Report</h5>
    <div class="table-wrapper">
        <div class="table-responsive">
            <table class="table table-bordered table-sm dynamicdesign" id="detailsTable" style="height:10vh">
                <thead>
                <tr>
                    <th>SL.No</th>
                    <th>Ticket No</th>
                    <th>Machine Category</th>
                    <th>Machine</th>
                    <th>Report By</th>
                    <th>Report Date</th>
                    <th>Problem Description</th>
                    <th>Type of Issues</th>
                    <th>Status</th>
                    <th>Start Time </th>
                    <th>Closed Time</th>
                    <th>DownTime</th>
                    <th>Closed By</th>
                    <th>Closed remarks</th>
                    <th>Factory</th>

                </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
    <button class="btn btn-success btn-sm my-3" onclick="exportToDetailsExcel()">Export to Excel</button>
</div>











       

         

        </form>
    </div>
</div>

 
 
       <!-- Modal Body --> 

</div>
</div>
</div>
</div>
<div id="errorMsg" style="color:red; font-size:13px;"></div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

<script>
 function exportToExcelHistroy() {
  var table = document.getElementById("Table_1");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Load List Report"});
  XLSX.writeFile(workbook, 'Load_List_Report.xlsx');
 }
 
 function exportHaulierHistory() {
	  var table = document.getElementById("haulierDetailsTable");
	  var workbook = XLSX.utils.table_to_book(table, {sheet: "Load List Report"});
	  XLSX.writeFile(workbook, 'haulierDetails.xlsx');
	 }
 
 function exportToDetailsExcel() {
	  var table = document.getElementById("detailsTable");
	  var workbook = XLSX.utils.table_to_book(table, {sheet: "Load List Report"});
	  XLSX.writeFile(workbook, 'Load_details_Report.xlsx');
	 }
 function exportToSummaryHistroy() {
	  var table = document.getElementById("summaryTable");
	  var workbook = XLSX.utils.table_to_book(table, {sheet: "Load List Report"});
	  XLSX.writeFile(workbook, 'Load_summary_Report.xlsx');
	 }
 
 function exportToLoadBuildHistroy() {
	  var table = document.getElementById("secondaryTable");
	  var workbook = XLSX.utils.table_to_book(table, {sheet: "Load List Report"});
	  XLSX.writeFile(workbook, 'Load_Build_Report.xlsx');
	 }

</script>

<script>
/* document.getElementById("reportType").addEventListener("change", function () {

    let type = this.value;

    if (type === "details") {
        document.getElementById("detailsTableContainer").style.display = "block";
        document.getElementById("summaryTableContainer").style.display = "none";
        document.getElementById("HistoryDetailsContainer").style.display="none";
        document.getElementById("secondaryTableContainer").style.display = "none";
    } 
    else if (type === "summary") {
        document.getElementById("detailsTableContainer").style.display = "none";
        document.getElementById("summaryTableContainer").style.display = "block";
      
    } 
    else {
        document.getElementById("detailsTableContainer").style.display = "none";
        document.getElementById("summaryTableContainer").style.display = "none";
    }
}); */


function printContainer1() {
	   var printContent = document.getElementById("deliveryChallanContainer");
	   var WinPrint = window.open('', '', 'left=0,top=0,toolbar=0,sta­tus=0');
  
    WinPrint.document.write(printContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
}





</script>



  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
 <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>  -->

  <!-- Bootstrap JS and dependencies -->




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
   
   
   
   <script src="js/maintenanceReport.js?v=<%=jsVersion%>"></script> 
   
   <script src="js/config.js?v=<%=jsVersion%>"></script>
     <script src="js/username.js?v=<%=jsVersion%>"></script>
     <script src="js/logout.js?v=<%=jsVersion%>"></script>
      <script src="js/createdby.js?v=<%=jsVersion%>"></script>
 	<script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
 	<script src="js/factoryid.js?v=<%=jsVersion%>"></script>
 	
 	
 <script>
 
 $(document).ready(function () {

	 const today = new Date().toISOString().split("T")[0];
	 $("#fromDate").val(today);
	 $("#toDate").val(today);

	    // Hide all containers on load
	    $("#container1, #container2, #container3, #deliveryChallanContainer, #loadlisttable, #pakingnotetable, #secondaryTableContainer,#HistoryDetailsContainer").hide();

	    // 🔹 PACKING NOTE PRINT TAB
	    $("#packingnoteprintTab").click(function () {
	        $("#container1").show();
	        $("#deliveryChallanContainer").hide();

	        // Hide others
	        $("#container2, #container3, #loadlisttable, #pakingnotetable, #secondaryTableContainer").hide();
	    });

	    // 🔹 LOAD LIST TAB
	    $("#loadlistTab").click(function () {
	        $("#container2").show();
	        $("#loadlisttable").show();

	        // Hide others
	        $("#container1, #deliveryChallanContainer, #container3, #pakingnotetable, #secondaryTableContainer").hide();
	    });

	    // 🔹 PACKING NOTE REPORT TAB
	    $("#packingnoteTab").click(function () {

	        $("#container3").show();
	        $("#pakingnotetable").show();

	        // Secondary table stays hidden until user clicks BUILDDETAILS/HISTORY
	        $("#secondaryTableContainer").hide();

	        // Hide others
	        $("#container1, #container2, #deliveryChallanContainer, #loadlisttable,#HistoryDetailsContainer").hide();
	    });
	    $("#gpmsTabs .nav-link").click(function () {
	        $("#gpmsTabs .nav-link").removeClass("active");
	        $(this).addClass("active");
	    });
	    
	    
	
	    $('#sidebarToggleTop').click(function () {
	        $('#accordionSidebar').toggleClass('toggled');
	    });

	});
 

 


	</script>	

</body>
</html>