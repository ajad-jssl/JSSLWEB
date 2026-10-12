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
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">

  <link href="css/masterpage.css" rel="stylesheet">

  
 <link href="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">




<script src="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>

<script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>
 <style>
    .hide {
    display: none;
}
</style>
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
    
    .nav-tabs .nav-link {
    color: #007bff;
}

.nav-tabs .nav-link.active {
    color: Black !important;
 
    border-color: #dee2e6 #dee2e6 #fff;
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

</head>

<body onload="fetchUserList();">
  <div id="wrapper">
    <!-- Sidebar -->
      <%@ include file="VehicleSidebar.jsp" %>
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
            <h1 class="h3 mb-0 text-gray-800">VTS Report</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="VehicleDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item"><a href="VTSReport.jsp">VTS Report</a></li>
              
            </ol>
          </div>
          
    
          
 <div class="container mt-5">
   
    <div class="d-flex justify-content-center mb-4">
  <div class="nav nav-tabs" id="vtsTabs" role="tablist">
    <a class="nav-item nav-link active" id="receiptTab" href="#" role="tab" onclick="toggleTables('receipt')"><b>VTS Receipt</b></a>
    <a class="nav-item nav-link" id="vehicleinTab" href="#" role="tab" onclick="toggleTables('vehiclein')"><b>Vehicle In Report</b></a>
    <a class="nav-item nav-link" id="vehicleoutTab" href="#" role="tab" onclick="toggleTables('vehicleout')"><b>Vehicle Out Report</b></a>
</div>
</div>
 </div>
                  

<!-- Modal 1: Create QS Package Details -->
<!-- Form Container with Outline and Title -->
<div id="container1" style="display:none;">
<div class="modal-body">
    <form>
        <div class="form-row align-items-end mb-3">
            <div class="form-group col-md-2">
                <label><b>Register Type:</b></label>
                <select id="register" class="form-control form-control-sm">
                    <option value="">Select</option>
                    <option value="1">Vehicle Loading</option>
                    <option value="2">Stores / Raw / Site Return / MI</option>
                    <option value="5">Material Inward</option>
                </select>
            </div>

            <div class="form-group col-md-2">
                <label><b>Select Type:</b></label>
               <select id="select" class="form-control form-control-sm">
                    <option>Select</option>
                    <option>All</option>
                    <option>Vehicle Loading</option>
                    <option>Stores Material</option>
                    <option>Raw Material</option>
                    <option>Site Return</option>
                </select>
            </div>

            <div class="form-group col-md-2">
                <label><b>Start Date:</b></label>
                <input type="date" id="start" class="form-control form-control-sm">
            </div>

            <div class="form-group col-md-2">
                <label><b>End Date:</b></label>
                <input type="date" id="end" class="form-control form-control-sm">
            </div>

            <div class="form-group col-md-2">
                <button type="button" class="btn btn-primary btn-sm w-100" onclick="fetchReport()">Fetch Report</button>
            </div>

        </div>

        <!-- Report Container -->
        <div id="container_1" style="display:none;">
         <div class="container container-report mt-4">
            <h5 class="text-center report-header">Vehicle In Report</h5>
                <div class="form-row dynamic-row">
            <div class="table-responsive">
                <table class="table table-bordered table-sm" id="TableID">
                    <thead>
                        <tr>
                            <th>SL.NO</th>
                            <th>Vehicle ID</th>
                            <th>Register Type</th>
                            <th>Vehicle Type</th>
                            <th>Vehicle No</th>
                            <th>Vehicle In</th>
                            <th>Transporter Name</th>
                            <th>Driver Name</th>
                            <th>Driver Mobile No</th>
                            <th>Whom To Meet</th>
                            <th class="hide-vl">Weight</th>
                            <th class="hide-vl">Invoice No</th>
                            <th class="hide-vl">Invoice Date</th>
                            <th class="hide-vl">PO Number</th>
                            <th class="hide-vl">PO Date</th>
                            <th class="hide-vl">DC No</th>
                            <th class="hide-vl">DC Date</th>
                            <th>In Remark</th>
                            <th>Content Description</th>
                            <th>Factory</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <button class="btn btn-success btn-sm my-3" onclick="exportToExcelvecin()">Export to Excel</button>
        </div>
</div>
</div>
</form>
</div>
</div>

      <div id="container2" style="display: none;">
            <div class="modal-body">
             <form>                 
              <div class="form-row align-items-end mb-3">
               <div class="form-group col-md-2">
                <label for="vehicle"><b>Vehicle Type:</b></label>               
              <select id="vehicle" class="form-control form-control-sm searchable-dropdown">
                <option value="">Select</option>
                <option value="5">Material Inward</option>    
                <option value="1">Vehicle Loading</option>
              </select>
               </div>
               
               
               <div class="form-group col-md-2">
                <label for="type"><b>Select Type:</b></label>
                <select id="type" class="form-control form-control-sm">
                <option value="">Select</option>
                    <option>All</option>
                    <option>Vehicle Loading</option>
                    <option>Stores Material</option>
                    <option>Raw Material</option>
                    <option>Site Return</option>
                </select>
               </div>
               
               
               <div class="form-group col-md-2">
                <label for="start"><b>Start Date:</b></label>
                <input type="date" class="form-control form-control-sm" id="startdate" placeholder="Start Date">
               </div>
                            
               
               <div class="form-group col-md-2" >
                 <label for="end"><b>End Date:</b></label>
                 <input type="date" class="form-control form-control-sm" id="enddate" placeholder="End Date">
               </div>           
               
               <div class="form-group col-md-2">
                <button type="button" class="btn btn-primary btn-sm w-100" onclick="fetchvehiclematerialReport()">Fetch Report</button>
            </div>
              </div> 

<div id="container3" style="display: none;">
<div class="container container-report mt-4">
 <h5 class="text-center report-header">Material Inward Report</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="Table_ID">
      <thead>
        <tr>
         <th>SL.NO</th>
         <th>Vehicle ID</th>
         <th>Register Type</th>
         <th>Vehicle Type</th>
         <th>Vehicle No</th>
         <th>Vehicle In</th>
         <th>Transporter Name</th>
         <th>Driver Name</th>
         <th>Driver Mobile No</th>
         <th>Whom To Meet</th>
         <th>Weight</th>
         <th>Invoice No</th>
         <th>Invoice Date</th>
         <th>PO Number</th>
         <th>PO Date</th>
         <th>DC No</th>
         <th>DC Date</th>
         <th>In Remark</th>
         <th>Content Description</th>
         <th>Factory</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- Insert actual values here -->
          <td>1</td>         
        </tr>
      </tbody>
    </table>
  </div>
 </div>
  <button class="btn btn-success btn-sm my-3" onclick="exportToExcelmatinward()">Export to Excel</button>
</div>
</div>


<div id="container5" style="display: none;">
    <div class="container container-report mt-4">
        <h5 class="text-center report-header">Vehicle Loading Report</h5>
        <div class="form-row dynamic-row">
            <div class="table-responsive">
                <table class="table table-bordered table-sm" id="Table1">
                    <thead>
                        <tr>
                            <th>SL.NO</th>
                            <th>Vehicle ID</th>
                            <th>Vehicle Type</th>
                            <th>Vehicle No</th>
                            <th>Vehicle In</th>
                            <th>Vehicle Out</th>
                            <th>Transporter Name</th>
                            <th>Driver Name</th>
                            <th>Driver Mobile No</th>
                            <th>Whom To Meet</th>
                            <th>Out Remarks</th>
                            <th>Invoice No</th>
                            <th>Factory</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- JavaScript will insert rows here -->
                    </tbody>
                </table>
            </div>
        </div>
        <button class="btn btn-success btn-sm my-3" onclick="exportToExcelvehload()">Export to Excel</button>
    </div>
</div>
</form>
</div>
</div>


          <div id="container6" style="display: none;">
            <div class="modal-body">
             <form>                 
               <div class="row mb-3">
          <div class="col-md-2">
           <label for="vehiclepassno" class="form-label"><b>Vehicle Pass No:</b></label>
           <select class="form-control form-control-sm" id="vehiclepassno">
            <option value="">Select</option>
	       </select>
	       <div id="gateError" class="text-danger" style="display: none;">Gate Pass No is required</div>
          </div>
          
          <div class="col-md-2">
           <div style="margin-top: 30px;">
           <button onclick="printVehiclePass()">Print Vehicle Pass</button>
           </div>
          </div>
         </div>

<div id="container12" style="display:none; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div id="vtsrecipt" style="display:none; max-width: 780px; margin: auto; background-color: #ffffff; border: 1px solid #ccc; border-radius: 6px; overflow: hidden; box-sizing: border-box;">

    <!-- Header -->
    <header style="display: flex; align-items: center; justify-content: space-between; background-color: white; color: #fff; padding: 8px 14px; gap: 10px; border-bottom:1px solid black;">
      <div>
        <img src="img/logo/download.png" alt="Company Logo" width="80" height="40" style="display:block;">
      </div>
      <div style="flex: 1; text-align: center;">
        <h2 style="margin: 0; font-size: 13px; font-weight: 600; color:black;">JSW Severfield Structures Limited</h2>
        <p style="margin: 2px 0 0; font-size: 10px; color:black;">Vehicle Pass — Safety and Security Instructions</p>
      </div>
      <div style="text-align: right; white-space: nowrap;">
        <div style="font-size: 9px; color:black;">Vehicle Pass</div>
        <div id="lblPassNo" style="font-size: 14px; font-weight: bold; color:black;"></div>
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
          <li style="margin-bottom: 2px;">Meet the concerned JSSL employee.</li>
          <li style="margin-bottom: 2px;">Follow all instructions from JSSL staff and those displayed within the factory.</li>
          <li style="margin-bottom: 2px;">Do not work with a visitor card — obtain a work permit before starting any work.</li>
          <li style="margin-bottom: 2px;">Speed limit for vehicles within factory premises is <strong>16 KMPH</strong>.</li>
          <li style="margin-bottom: 2px;">All visitors must wear mandatory PPEs.</li>
          <li style="margin-bottom: 2px;">Smoking and photography are strictly prohibited.</li>
          <li style="margin-bottom: 2px;">Do not touch any equipment or electrical points — you may risk harm.</li>
          <li style="margin-bottom: 2px;">Use walkways wherever provided on the shop floor.</li>
          <li style="margin-bottom: 2px;">Be aware of hazards: trip hazards, hot surfaces, fumes, machine entrapment, UV exposure.</li>
          <li style="margin-bottom: 2px;">Know emergency evacuation routes and the location of the OHC.</li>
          <li style="margin-bottom: 2px;">Report unsafe conditions/activities to the accompanying staff.</li>
          <li style="margin-bottom: 2px;">Return the gate pass to security when leaving.</li>
        </ul>

        <!-- Emergency Contact pinned to bottom -->
        <div style="margin-top: auto; background-color: #f0f4f9; border-left: 3px solid #003366; padding: 7px 10px; font-size: 10px; line-height: 1.7; border-radius: 0 4px 4px 0;">
          <strong style="font-size: 10px; color: #003366; display: block; margin-bottom: 2px;">Emergency Contact Numbers</strong>
          Safety: +91 7760 972153 / 63<br>
          OHC: 7760972153 / 08395-660108<br>
          Admin: +91 7760 972158 / HR: +91 7760 972147
        </div>

      </div>

      <!-- RIGHT COLUMN: Photo + Details -->
      <div style="flex: 1; padding: 10px 12px; display: flex; flex-direction: column; align-items: center; box-sizing: border-box;">

        <!-- Vehicle/Driver Photo -->
        <img id="vehiclePhoto" alt="Visitor Photo"
          style="width: 200px; height: 200px; object-fit: cover; border: 1px solid #ccc; border-radius: 4px; background: #f0f0f0; margin-bottom: 8px;" />

        <!-- Details Table -->
        <div style="width: 100%;">
          <div style="font-size: 11px; font-weight: 600; color: #003366; border-bottom: 1px solid #003366; padding-bottom: 3px; margin-bottom: 6px;">
            Vehicle Details
          </div>
          <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; width: 90px; vertical-align: top;">Name</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="vname"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Company</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="lblcompanyname"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">DL No.</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="dl"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Contact No.</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="cn"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Date &amp; Time</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="lblDateTime"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Vehicle No.</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="vehNo"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Whom to Meet</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="wtsn"></span></td>
            </tr>
            <tr style="border-bottom: 0.5px solid #eee;">
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Department</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="deptm"></span></td>
            </tr>
            <tr>
              <td style="color: #555; font-weight: 500; padding: 3px 4px 3px 0; vertical-align: top;">Remarks</td>
              <td style="color: #111; padding: 3px 0; vertical-align: top;"><span id="rem"></span></td>
            </tr>
          </table>
        </div>

      </div>
    </div><!-- end two column body -->

    <!-- Footer Signatures -->
    <footer style="display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding: 7px 20px; font-size: 10px; color: #444; background: #fafafa;">
      <div style="text-align: center; width: 30%;">
        <div style="border-top: 1px solid #888; padding-top: 4px; margin-top: 16px;">Visitor Signature</div>
      </div>
      <div style="text-align: center; width: 30%;">
        <div style="border-top: 1px solid #888; padding-top: 4px; margin-top: 16px;">Security Signature</div>
      </div>
        <div style="text-align: center; width: 30%;">
    <div  style="font-weight: 600; color: #003366; margin-bottom: 2px;">&nbsp;</div>
    <div  id="wtmSignatureName" style="border-top: 1px solid #888; padding-top: 4px;">Whom to Meet</div>
  </div>
    </footer>

  </div><!-- end vtsrecipt -->
</div><!-- end container12 -->
</form>
</div>
</div>
</div>
</div>
</div> 
</div>

<script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/xlsx/0.20.3/xlsx.full.min.js"></script>

<script>
   window.onload = function() {
	   fetchVehicleDetails(vehicle_id);
};
</script>
   
<script>
 function exportToExcelvecin() {
  var table = document.getElementById("TableID");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Vehicle In Report"});
  XLSX.writeFile(workbook, 'Vehicle_In_Report.xlsx');
 }
</script>

<script>
 function exportToExcelmatinward() {
  var table = document.getElementById("Table_ID");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Material Inward Report"});
  XLSX.writeFile(workbook, 'Material_Inward_Report.xlsx');
 }
</script>

<script>
 function exportToExcelvehload() {
  var table = document.getElementById("Table1");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Vehicle Loading Report"});
  XLSX.writeFile(workbook, 'Vehicle_Loading_Report.xlsx');
 }
</script>
<script>
function exportToExcelvehloadDynamic() {
    const table = document.getElementById("Table1");
    if (!table) {
        alert("Table not found!");
        return;
    }

    // Columns you want (Weight excluded)
    const desiredHeaders = [
        "SL.NO",
        "Vehicle ID",
        "Vehicle Type",
        "Vehicle No",
        "Vehicle In",
        "Transporter Name",
        "Driver Name",
        "Driver Mobile No",
        "Whom To Meet",
        "In Remark",
        "Factory"
    ];

    // Get header row (supports <thead> or first row)
    const headerRow = table.querySelector("thead tr") || table.rows[0];
    if (!headerRow) {
        alert("No header row found!");
        return;
    }

    // Find column indexes
    const colIndexes = [];
    Array.from(headerRow.cells).forEach((cell, idx) => {
        if (desiredHeaders.includes(cell.innerText.trim())) {
            colIndexes.push(idx);
        }
    });

    if (colIndexes.length === 0) {
        alert("No matching columns found!");
        return;
    }

    // Map rows to export data
    const exportData = Array.from(table.rows).map(row => 
        colIndexes.map(i => row.cells[i] ? row.cells[i].innerText.trim() : "")
    );

    // Create Excel sheet
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicle Loading Report");
    XLSX.writeFile(workbook, 'Vehicle_Loading_Report.xlsx');
}
</script>

<script>
function toggleTables(tab) {
    // Get references to containers (for each section)
    const vehicleinContainer = document.getElementById('container1');
    const vehicleoutContainer = document.getElementById('container2');
    const receiptContainer = document.getElementById('container6');

    // Hide all containers initially
    vehicleinContainer.style.display = 'none';
    vehicleoutContainer.style.display = 'none';
    receiptContainer.style.display = 'none';

    // Remove active class from all tabs
    document.getElementById('receiptTab').classList.remove('active');
    document.getElementById('vehicleinTab').classList.remove('active');
    document.getElementById('vehicleoutTab').classList.remove('active');

    // Show the selected one and mark its tab active
    if (tab === 'vehiclein') {
        vehicleinContainer.style.display = 'block';
        document.getElementById('vehicleinTab').classList.add('active');
    } else if (tab === 'vehicleout') {
        vehicleoutContainer.style.display = 'block';
        document.getElementById('vehicleoutTab').classList.add('active');
    } else if (tab === 'receipt') {
        receiptContainer.style.display = 'block';
        document.getElementById('receiptTab').classList.add('active');
    }
}
</script>

<!-- <script>
document.addEventListener('DOMContentLoaded', function () {
    const vehicleSelect = document.getElementById('vehicle');
    const containerInward = document.getElementById('container3');
    const containerLoading = document.getElementById('container5');

    vehicleSelect.addEventListener('change', function () {
        const selectedText = this.options[this.selectedIndex].text;

        // Hide both containers by default
        containerInward.style.display = 'none';
        containerLoading.style.display = 'none';

        // Show based on selection
        if (selectedText === 'Material Inward') {
            containerInward.style.display = 'block';
        } else if (selectedText === 'Vehicle Loading') {
            containerLoading.style.display = 'block';
        }
    });
});
</script> -->

<!-- <script>
document.addEventListener("DOMContentLoaded", function () {
    const fromDate = document.getElementById("start");
    const toDate = document.getElementById("end");
    const reportContainer = document.getElementById("container_1");

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
</script> -->

<script>
$(document).ready(function() {
 
});
</script>

<script>
function printVehiclePass() {
    var printContent = document.getElementById("vtsrecipt");
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
 
  <!-- Bootstrap JS and dependencies -->




  
  <script src="vendor/jquery/jquery.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
     
   
      <script src="vendor/datatables/jquery.dataTables.min.js"></script>
      <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
 <script src="js/config.js?v=<%=jsVersion%>"></script>
  <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
 
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>   
    <script src="js/vtsreport.js?v=<%=jsVersion%>"></script>
    <script src="js/logout.js?v=<%=jsVersion%>"></script>
    <script src="js/username.js?v=<%=jsVersion%>"></script>
    <script src="js/createdby.js?v=<%=jsVersion%>"></script>
 	<script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
 	<script src="js/factoryid.js?v=<%=jsVersion%>"></script>
 	 	<script src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
</body>
</html>