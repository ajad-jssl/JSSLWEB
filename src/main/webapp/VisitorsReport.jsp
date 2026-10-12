<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
  response.setHeader("Pragma", "no-cache"); // HTTP 1.0
  response.setDateHeader("Expires", 0); // Proxies
%>
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
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
<!--   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-xxx" crossorigin="anonymous" /> -->
  <link href="css/masterpage.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>
  
  <!-- Include Bootstrap CSS -->
 <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">

<!-- Include jQuery -->
<!-- <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> -->

<!-- Include Bootstrap JS -->
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>

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

<body onload="fetchUserList();">
  <div id="wrapper">
    <!-- Sidebar -->
      <%@ include file="VMSSidebar.jsp" %>
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
            <h1 class="h3 mb-0 text-gray-800">VMS Report</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="VMSDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item"><a href="VisitorsReport.jsp">VMS Report</a></li>
              
            </ol>
          </div>
          
          
          
 <div class="container mt-5">
    <!-- Radio Buttons -->
    <div class="d-flex justify-content-center mb-4">     
        <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="visitorRadio" value="visitor" onchange="toggleTables()">
            <label class="form-check-label" for="visitorRadio">Visitors Report</label>
        </div>&nbsp;&nbsp;
         <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="jsslRadio" value="jssl" onchange="toggleTables()">
            <label class="form-check-label" for="jsslRadio">Visitors In Jssl</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="rangeRadio" value="range" onchange="toggleTables()">
            <label class="form-check-label" for="rangeRadio">Visitors Date Range Report</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="receiptRadio" value="receipt" onchange="toggleTables()">
            <label class="form-check-label" for="receiptRadio">VMS Receipt</label>
        </div>        
    </div>
 </div>
                  

<!-- Modal 1: Create QS Package Details -->
<!-- Form Container with Outline and Title -->
    <div id="container1" style="display: none;">   
            <div class="modal-body">
             <form>                 
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="type "><b>Type:</b></label>               
                <select id="type" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
               
               
               <div class="form-group col-md-3">
                <label for="as"><b>As:</b></label>
                <select id="as" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>                       
              </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->
<!-- <div id="container1" style="display: none;"> -->
<div class="container container-report mt-4">
  <h5 class="text-center report-header">Visitors List</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="TableID">
      <thead>
        <tr>
          <th>SL.NO</th>
          <th>Id</th>
          <th>Name</th>
          <th>Company</th>
          <th>Address</th>
          <th>Date</th>
          <th>In</th>
          <th>Out</th>
          <th>Name Of Employee</th>
          <th>Department</th>         
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- Insert actual values here -->
          <td>1</td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>         
        </tr>
      </tbody>
    </table>
  </div>
 </div>
  <button class="btn btn-success btn-sm my-3" onclick="exportToExcel()">Export to Excel</button>
</div>
</form>
</div>
</div>

   <div id="container2" style="display: none;">   
            <div class="modal-body">
             <form>                 

<div class="container container-report mt-4">
  <h5 class="text-center report-header">Visitors In Jssl</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="Table">
      <thead>
        <tr>
          <th>SL.NO</th>
          <th>Id</th>
          <th>Name</th>
          <th>Company</th>
          <th>Address</th>
          <th>Date</th>
          <th>In</th>
          <th>Out</th>
          <th>Name Of Employee</th>
          <th>Department</th>         
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- Insert actual values here -->
          <td>1</td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>         
        </tr>
      </tbody>
    </table>
  </div>
 </div>
  <button class="btn btn-success btn-sm my-3" onclick="exportToExcel()">Export to Excel</button>
</div>
</form>
</div>
</div>

   <div id="container3" style="display: none;">   
            <div class="modal-body">
             <form>                 
              <div class="form-row">
              <div class="form-group col-md-3">
                <label for="start"><b>Start Date:</b></label>
                <input type="date" class="form-control form-control-sm" id="start" placeholder="Start Date">
               </div>
                            
               
               <div class="form-group col-md-3" >
                 <label for="end"><b>End Date:</b></label>
                 <input type="date" class="form-control form-control-sm" id="end" placeholder="End Date">
               </div>           
              </div> 


<div class="container container-report mt-4">
 <h5 class="text-center report-header">Visitors Date Range Report</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="Table1">
      <thead>
        <tr>
          <th>SL.NO</th>
          <th>Id</th>
          <th>Name</th>
          <th>Total No. Of person</th>
          <th>Company</th>
          <th>Address</th>
          <th>Vehicle No</th>
          <th>Contact No</th>
          <th>Date</th>
          <th>In</th>
          <th>Out</th>
          <th>Name Of Employee</th>
          <th>Department</th>
          <th>In Remarks</th>
          <th>Out Remarks</th>         
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- Insert actual values here -->
          <td>1</td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>         
        </tr>
      </tbody>
    </table>
  </div>
 </div>
  <button class="btn btn-success btn-sm my-3" onclick="exportToExcel()">Export to Excel</button>
</div>
</form>
</div>
</div>

          <div id="container5" style="display: none;">
            <div class="modal-body">
             <form>                 
               <div class="row mb-3">
          <div class="col-md-2">
           <label for="pass" class="form-label"><b>Gate Pass:</b></label>
           <select class="form-control form-control-sm" id="pass">
            <option value="">Select</option>
	       </select>
	       <div id="gateError" class="text-danger" style="display: none;">Gate Pass No is required</div>
          </div>
          
          <div class="col-md-2">
           <div style="margin-top: 30px;">
           <button onclick="printContainer1()" style="padding: 10px 20px; font-size: 14px;">Print Report</button>
           </div>
          </div>
         </div>

<div id="container12" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; padding: 30px;">
  <div style="max-width: 900px; margin: auto; background-color: #ffffff; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
    
    <!-- Header Section -->
    <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 20px;">
      <div class="logo">
        <img src="img/logo/download.png" alt="Company Logo" width="110" height="55" />
      </div>
      <div style="flex-grow: 1; text-align: center;">
        <h2 style="margin: 0; font-size: 20px; color: #003366;">JSW Severfield Structures Limited</h2>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #555;">Visitor Pass - Safety and Security Instructions</p>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 14px; color: #444;">${lblVCPass}</div>
        <div style="font-size: 20px; font-weight: bold; color: #000;">${lblChar}</div>
      </div>
    </header>

    <!-- Visitor Info Section -->
    <section style="display: flex; justify-content: space-between; gap: 20px; margin-top: 20px;">
      <div style="flex: 1;">
        <p><strong>Visitor Pass No:</strong> ${lblPassNo}</p>
        <p><strong>Visitor Name:</strong> ${vname}</p>
        <p><strong>Company:</strong> ${lblcompanyname}</p>
        <p><strong>Contact No:</strong> ${cn}</p>
        <p><strong>Date & Time:</strong> ${lblDateTime} ${lblTime}</p>
        <p><strong>Whom to Meet:</strong> ${wtsn}</p>
        <p><strong>Department:</strong> ${wts}</p>
      </div>
      <div style="flex-shrink: 0;">
        <img src="${Image1Url}" alt="Visitor Photo" style="width: 120px; height: 150px; object-fit: cover; border: 1px solid #ccc; border-radius: 4px;" />
      </div>
    </section>

    <!-- Safety Instructions -->
    <section style="margin-top: 30px; font-size: 13px; line-height: 1.6;">
      <h3 style="margin-bottom: 10px; font-size: 16px; color: #003366;">Visitor Safety Instructions:</h3>
      <ul style="padding-left: 20px; color: #333;">
        <li>First visitor should meet the receptionist after obtaining the visitor pass.</li>
        <li>Meet the concerned JSSL employee.</li>
        <li>Follow all instructions from JSSL staff and those displayed within the factory.</li>
        <li>Do not enter the shop floor unless safety inducted.</li>
        <li>All visitors must wear mandatory PPEs.</li>
        <li>Do not work with a visitor card—obtain a work permit before starting any work.</li>
        <li>Speed limit within factory premises is 16 KMPH.</li>
        <li>Smoking and photography are prohibited.</li>
        <li>Mobile phone usage on the shop floor is strictly prohibited.</li>
        <li>Do not touch any equipment or electrical points—you may risk harm.</li>
        <li>Use walkways wherever provided on the shop floor.</li>
        <li>Be aware of hazards: trip hazards, hot surfaces, fumes, machine entrapment, UV exposure.</li>
        <li>Know emergency evacuation routes and the location of the OHC (Occupational Health Centre).</li>
        <li>Report unsafe conditions/activities to the accompanying staff.</li>
        <li>Return the gate pass to security when leaving.</li>
      </ul>
    </section>

    <!-- Emergency Contact -->
    <section style="margin-top: 20px; font-size: 13px; background-color: #f1f1f1; padding: 15px; border-left: 4px solid #003366;">
      <strong>Emergency Contact Numbers:</strong><br>
      Safety: +91 7760 972153 / 63<br>
      OHC: 08395-660108<br>
      HR: +91 7760 972147
    </section>

    <!-- Signatures -->
    <footer style="display: flex; justify-content: space-between; margin-top: 40px; font-size: 13px;">
      <div style="text-align: center; border-top: 1px solid #000; padding-top: 5px; width: 45%;">
        Visitor Signature
      </div>
      <div style="text-align: center; border-top: 1px solid #000; padding-top: 5px; width: 45%;">
        Security Signature
      </div>
    </footer>

  </div>
</div>
</form>
</div>
</div>
</div>
</div>
</div> 
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.20.3/xlsx.full.min.js"></script>
   
<script>
 function exportToExcel() {
  var table = document.getElementById("TableID");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Visitors List Report"});
  XLSX.writeFile(workbook, 'Visitors_List_Report.xlsx');
 }
</script>

<script>
 function exportToExcel() {
  var table = document.getElementById("Table");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Visitors In Jssl Report"});
  XLSX.writeFile(workbook, 'Visitors_In_Jssl_Report.xlsx');
 }
</script>

<script>
 function exportToExcel() {
  var table = document.getElementById("Table1");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Visitors Date Range Report"});
  XLSX.writeFile(workbook, 'Visitors_Date_Range_Report.xlsx');
 }
</script>

<script>
function toggleTables() {
    // Get references to radio buttons
    const visitorRadio = document.getElementById('visitorRadio');
    const jsslRadio = document.getElementById('jsslRadio');
    const rangeRadio = document.getElementById('rangeRadio');
    const receiptRadio = document.getElementById('receiptRadio');

    // Get references to containers
    const container1 = document.getElementById('container1');
    const container2 = document.getElementById('container2');
    const container3 = document.getElementById('container3');
    const container5 = document.getElementById('container5');

    // Hide all containers initially
    container1.style.display = 'none';
    container2.style.display = 'none';
    container3.style.display = 'none';
    container5.style.display = 'none';

    // Show the selected one
    if (visitorRadio.checked) {
        container1.style.display = 'block';
    } else if (jsslRadio.checked) {
        container2.style.display = 'block';
    } else if (rangeRadio.checked) {
        container3.style.display = 'block';
    } else if (receiptRadio.checked) {
        container5.style.display = 'block';
    }
}
</script>

<script>
function printContainer1() {
    var printContents = document.getElementById("container12").innerHTML;
    var printWindow = window.open('', '', 'height=600,width=900');

    printWindow.document.write('<html><head><title>Print Report</title>');
    printWindow.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');

    printWindow.document.close();

    // Wait for window to fully load
    printWindow.onload = function () {
        setTimeout(function () {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 500); // small delay to ensure images/styles load
    };
}
</script>

  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

  


 

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
    <script src="js/visitorrep.js?v=<%=ts%>"></script>
    <script src="js/logout.js"></script>
    <script src="js/username.js"></script>
    <script src="js/createdby.js"></script>
 	<script src="js/modifiedby.js"></script>
 	<script src="js/factoryid.js"></script>

  <!-- Page level custom scripts -->
</body>
</html>