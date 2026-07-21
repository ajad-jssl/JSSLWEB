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
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
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

<body>
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
    <div class="nav nav-tabs" id="vmsTabs" role="tablist">
        <a class="nav-item nav-link active" id="receiptTab" data-bs-toggle="tab" href="#receipt" role="tab" onclick="toggleTables('receipt')"><b>VMS Receipt</b></a>
        <a class="nav-item nav-link " id="visitorTab" data-bs-toggle="tab" href="#visitor" role="tab" onclick="toggleTables('visitor')"><b>Visitors Report</b></a>
        <a class="nav-item nav-link" id="rangeTab" data-bs-toggle="tab" href="#range" role="tab" onclick="toggleTables('range')"><b>Visitors Date Range Report</b></a>
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
               <label for="type"><b>Type:</b></label>
               <select id="type" class="form-control form-control-sm">
               <option value="">Select</option>
               <option value="company">Company</option>
               <option value="department">Department</option>
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
<div id="vislist" class="container container-report mt-4">
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
          <th>VisitorDate-InTime</th>
          <th>VisitorDate-OutTime</th>
          <th>Whom To Meet</th>
          <th>Department</th>     
          <th>Factory</th>     
        </tr>
      </thead>
      <tbody id="visitorTableBody">
        <tr>
          <!-- Insert actual values here -->
        </tr>
      </tbody>
    </table>
  </div>
 </div>
  <button class="btn btn-success btn-sm my-3" onclick="exportToExcelvlist()">Export to Excel</button>
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
            <div class="form-row align-items-end mb-3">
                <div class="form-group col-md-3">
                    <label for="fromDate"><b>Start Date:</b></label>
                    <input type="date" class="form-control form-control-sm" id="fromDate" placeholder="Start Date">
                </div>
                <div class="form-group col-md-3">
                    <label for="toDate"><b>End Date:</b></label>
                    <input type="date" class="form-control form-control-sm" id="toDate" placeholder="End Date">
                </div>      
                <div class="form-group col-md-2">
                    <button type="button" class="btn btn-primary btn-sm w-100" onclick="fetchVisitorDetailsByDate()">Fetch Report</button>
                </div>    
                <div class="form-group col-md-2">
                <button type="button" class="btn btn-success btn-sm w-100" onclick="exportToExcelvdr()">Export to Excel</button>
                </div> 
            </div> 
        </form>

        <div id="container8" class="container container-report mt-4" style="display: none;">
        <h5 class="text-center report-header mb-4">Date Range Report</h5>
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-hover table-sm" id="Table1">
            <thead class="table-light text-center align-middle">
                            <tr>
                                <th>SL.NO</th>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Company</th>
                                <th>Address</th>
                                <th>Vehicle No</th>
                                <th>Contact No</th>
                                <th>VisitorDate-InTime</th>
                                <th>VisitorDate-OutTime</th>
                                <th>Whom To Meet</th>
                                <th>Department</th>
                                <th>In Remarks</th>
                                <th>Out Remarks</th>  
                                <th>Factory</th>         
                            </tr>
                        </thead>
                        <tbody id="visitorrep">
                            <!-- Data will be inserted here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>


          <div id="container5" style="display: block;">
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

<div id="container12" style="display:none; font-family: Times New Roman, Times, serif; background-color: #f4f6f8; padding: 20px;">
  <div id="vmsrecipt" style="display:none; max-width: 780px; margin: auto; background-color: #ffffff; border: 1px solid #ccc; border-radius: 6px; overflow: hidden; box-sizing: border-box;">

    <!-- Header -->
    <header style="display: flex; align-items: center; justify-content: space-between; background-color: white; color: #fff; padding: 8px 14px; gap: 10px; border-bottom:1px solid black;">
      <div>
        <img src="img/logo/download.png" alt="Company Logo" width="80" height="40" style="display:block;">
      </div>
      <div style="flex: 1; text-align: center;">
        <h2 style="margin: 0; font-size: 13px; font-weight: 600; color:black;">JSW Severfield Structures Limited</h2>
        <p style="margin: 2px 0 0; font-size: 10px; color:black;">Visitor Pass — Safety and Security Instructions</p>
      </div>
      <div style="text-align: right; white-space: nowrap;">
        <div id="lblVCPass" style="font-size: 9px; color:black;">Visitor Card</div>
        <div id="lblChar" style="font-size: 14px; font-weight: bold; color:black;"></div>
      </div>
    </header>

    <!-- Two Column Body -->
    <div style="display: flex; min-height: 340px;">

      <!-- LEFT COLUMN: Instructions + Emergency -->
      <div style="flex: 1.4; padding: 10px 12px; border-right: 1px solid #ddd; display: flex; flex-direction: column; box-sizing: border-box;">

        <div style="font-size: 11px; font-weight: 600; color: #003366; border-bottom: 1px solid #003366; padding-bottom: 3px; margin-bottom: 6px;">
          Visitor Safety Instructions
        </div>

        <ul style="padding-left: 14px; margin: 0 0 8px 0; color: #333; font-size: 10px; line-height: 1.55;">
          <li style="margin-bottom: 2px;">First visitor should meet the receptionist after obtaining the visitor pass.</li>
          <li style="margin-bottom: 2px;">Meet the concerned JSSL employee.</li>
          <li style="margin-bottom: 2px;">Follow all instructions from JSSL staff and those displayed within the factory.</li>
          <li style="margin-bottom: 2px;">Do not enter the shop floor unless safety inducted.</li>
          <li style="margin-bottom: 2px;">All visitors must wear mandatory PPEs.</li>
          <li style="margin-bottom: 2px;">Do not work with a visitor card — obtain a work permit before starting any work.</li>
          <li style="margin-bottom: 2px;">Speed limit within factory premises is <strong>16 KMPH</strong>.</li>
          <li style="margin-bottom: 2px;">Smoking and photography are strictly prohibited.</li>
          <li style="margin-bottom: 2px;">Mobile phone usage on the shop floor is strictly prohibited.</li>
          <li style="margin-bottom: 2px;">Do not touch any equipment or electrical points — you may risk harm.</li>
          <li style="margin-bottom: 2px;">Use walkways wherever provided on the shop floor.</li>
          <li style="margin-bottom: 2px;">Be aware of hazards: trip hazards, hot surfaces, fumes, machine entrapment, UV exposure.</li>
          <li style="margin-bottom: 2px;">Know emergency evacuation routes and the location of the OHC (Occupational Health Centre).</li>
          <li style="margin-bottom: 2px;">Report unsafe conditions/activities to the accompanying staff.</li>
          <li style="margin-bottom: 2px;">Return the gate pass to security when leaving.</li>
        </ul>

        <!-- Emergency Contact pinned to bottom -->
        <div style="margin-top: auto; background-color: #f0f4f9; border-left: 3px solid #003366; padding: 7px 10px; font-size: 10px; line-height: 1.7; border-radius: 0 4px 4px 0;">
          <strong style="font-size: 10px; color: #003366; display: block; margin-bottom: 2px;">Emergency Contact Numbers</strong>
          Safety: +91 7760 972153 / 63<br>
          OHC: 08395-660108<br>
          HR: +91 7760 972147
        </div>

      </div>

      <!-- RIGHT COLUMN: Photo + Visitor Details -->
      <div style="flex: 1; padding: 10px 12px; display: flex; flex-direction: column; align-items: center; box-sizing: border-box;">

        <!-- Visitor Photo -->
        <img id="visitorPhoto" alt="Visitor Photo"
          style="width: 200px; height: 200px; object-fit: cover; border: 1px solid #ccc; border-radius: 4px; background: #f0f0f0; margin-bottom: 8px;" />

        <!-- Visitor Details -->
        <div style="width: 100%;">
          <div style="font-size: 11px; font-weight: 600; color: #003366; border-bottom: 1px solid #003366; padding-bottom: 3px; margin-bottom: 6px;">
            Visitor Details
          </div>
          <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; width: 90px; vertical-align: top;">Pass No.</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="visitorPassNo"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Name</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="visitorName"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Company</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="visitorCompany"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Contact No.</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="visitorContactNo"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Date &amp; Time</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="visitorDateTime"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Whom to Meet</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="whomToMeet"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Department</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="visitorDepartment"></span></td>
            </tr>
            <tr>
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Vehicle No.</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="vehicleNO"></span></td>
            </tr>
          </table>
        </div>

      </div>
    </div><!-- end two column body -->

    <!-- Footer Signatures -->
      <footer style="display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding: 7px 20px; font-size: 10px; color: #444; background: #fafafa;">
  <div style="text-align: center; width: 30%;">
    <div style="border-top: 1px solid #888; padding-top: 4px; margin-top: 16px;">Visitor (Signature)</div>
  </div>
    <div style="text-align: center; width: 30%;">
    <div style="border-top: 1px solid #888; padding-top: 4px; margin-top: 16px;">Security (Signature)</div>
  </div>
  <div style="text-align: center; width: 30%;">
    <div  style="font-weight: 600; color: #003366; margin-bottom: 2px;">&nbsp;</div>
    <div  id="wtmSignatureName" style="border-top: 1px solid #888; padding-top: 4px;">Whom to Meet</div>
  </div>

</footer>

  </div><!-- end vmsrecipt -->
</div><!-- end container12 -->
</form>
</div>
</div>
</div>
</div>
</div> 


<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

<script>
/*    window.onload = function() {
	   fetchVisitorDetails(visitor_id);
}; */
</script>
   
<script>
 function exportToExcelvlist() {
  var table = document.getElementById("TableID");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Visitors List Report"});
  XLSX.writeFile(workbook, 'Visitors_List_Report.xlsx');
 }
</script>

<!-- <script>
 function exportToExcel() {
  var table = document.getElementById("Table");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Visitors In Jssl Report"});
  XLSX.writeFile(workbook, 'Visitors_In_Jssl_Report.xlsx');
 }
</script> -->

<script>
 function exportToExcelvdr() {
  var table = document.getElementById("Table1");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Visitors Date Range Report"});
  XLSX.writeFile(workbook, 'Visitors_Date_Range_Report.xlsx');
 }
</script>

<script>
/**
 * ✅ FIXED toggleTables function
 * - Preserves container5 (print receipt form) and container12/vmsrecipt (print card)
 * - Only clears other containers when switching away from receipt tab
 * - Prevents data loss when returning to receipt tab
 */
function toggleTables(tab) {
    console.log("Switching to tab:", tab);
    document.getElementById("container1").style.display = "none";
    document.getElementById("container3").style.display = "none";
    document.getElementById("container5").style.display = "none";
    
    // Containers that should be cleared based on tab switch
    const containersToClear = {
        'visitor': ['container1'],           // Only clear visitor list
        'range': ['container3', 'container8'], // Clear date range section
        'receipt': []                        // Don't clear anything for receipt tab
    };

    // Get containers to clear for this tab
    const clearList = containersToClear[tab] || [];

    // Clear only relevant containers
    clearList.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.style.display = 'none';
            
            // Clear inputs/selects in this container only
            const inputs = container.querySelectorAll('input, select, textarea');
            inputs.forEach(input => input.value = '');
            
            // Clear tables in this container only
            const tables = container.querySelectorAll('table tbody');
            tables.forEach(tbody => tbody.innerHTML = '');
        }
    });

    // Show the selected tab container
    if (tab === 'visitor') {
        const container1 = document.getElementById('container1');
        if (container1) container1.style.display = 'block';
        
    } else if (tab === 'range') {
        const container3 = document.getElementById('container3');
        if (container3) container3.style.display = 'block';
        
    } else if (tab === 'receipt') {
        const container5 = document.getElementById('container5');
        if (container5) container5.style.display = 'block';
        
        // Reset pass dropdown but preserve existing data
        const pass = document.getElementById("pass");
        if (pass) {
            pass.value = '';
            $('#pass').trigger('change');
        } 
        
        // Keep print card visible if data exists
        const container12 = document.getElementById("container12");
        const vmsrecipt = document.getElementById("vmsrecipt");
        if (container12 && vmsrecipt && vmsrecipt.style.display === "block") {
            // Data already loaded, keep it visible
            console.log("✅ Receipt data preserved");
        }
    }
}
</script>

<script>
document.addEventListener("DOMContentLoaded", function () {
    const fromDate = document.getElementById("start");
    const toDate = document.getElementById("end");
    const reportContainer = document.getElementById("container3");

    function checkDates() {
        if (fromDate.value && toDate.value) {
            // Optional: Add validation to check if toDate >= fromDate
            if (new Date(toDate.value) >= new Date(fromDate.value)) {
                reportContainer.style.display = "block";
            } else {
                alert("To Date must be greater than or equal to From Date.");
                reportContainer.style.display = "none";
            }
        } else {
            reportContainer.style.display = "none";
        }
    }

    fromDate.addEventListener("change", checkDates);
    toDate.addEventListener("change", checkDates);
});
</script>

<script>
function printContainer1() {
    var printContent = document.getElementById("vmsrecipt");
    var WinPrint = window.open('', '', 'left=0,top=0,toolbar=0,status=0,width=900,height=700');

    WinPrint.document.write(printContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();

    // Wait for all images in the print window to finish loading before printing
    var images = WinPrint.document.images;
    var totalImages = images.length;
    var loadedCount = 0;

    function tryPrint() {
        loadedCount++;
        if (loadedCount >= totalImages) {
            WinPrint.print();
        }
    }

    if (totalImages === 0) {
        WinPrint.print();
    } else {
        for (var i = 0; i < totalImages; i++) {
            if (images[i].complete) {
                tryPrint();
            } else {
                images[i].addEventListener('load', tryPrint);
                images[i].addEventListener('error', tryPrint); // don't hang forever if one fails
            }
        }
    }
}
   
</script>

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
 	<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

  <!-- Page level custom scripts -->
</body>
</html>