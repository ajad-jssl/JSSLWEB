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
  <link href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />
  <script src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>
  
 <link href="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">



<script src="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>

<script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>
  <style>
.dataTables_wrapper .dataTables_info {
    float: left;
    padding-top: 8px;
}

.dataTables_wrapper .dataTables_paginate {
    float: right;
    text-align: right;
}
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
  <style>
  #gatePassDetailsTable td {
    vertical-align: top;
    word-wrap: break-word;
    word-break: break-word;
    white-space: normal;
}
  </style>
 
</head>

<body onload="fetchgatepassData();">
  <div id="wrapper">
    <!-- Sidebar -->
      <%@ include file="GPMSSidebar.jsp" %>
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
            <h1 class="h3 mb-0 text-gray-800">GPMS Report</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="GPMSDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item"><a href="ItemsDeuReport.jsp">GPMS Report</a></li>
              
            </ol>
          </div>
          
    
     <div class="container mt-5">
    <!-- Radio Buttons -->
   <div class="d-flex justify-content-center mb-4">
    <div class="nav nav-tabs" id="gpmsTabs" role="tablist">
     <a class="nav-item nav-link active" id="outwardTab" data-bs-toggle="tab" href="#outward" role="tab" onclick="toggleTables('outward')"><b>Outward Returnable Report</b></a>
     <a class="nav-item nav-link" id="nonoutwardTab" data-bs-toggle="tab" href="#nonoutward" role="tab" onclick="toggleTables('nonoutward')"><b>Outward Non Returnable Report</b></a>
      <a class="nav-item nav-link" id="dateTab" data-bs-toggle="tab" href="#date" role="tab" onclick="toggleTables('date')"><b>Date Range Report</b></a>
        <a class="nav-item nav-link" id="itemsTab" data-bs-toggle="tab" href="#items" role="tab" onclick="toggleTables('items')"><b>Items Due Report</b></a>
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
    <h5 class="text-center report-header">Items Due For Return</h5>
    <div class="form-row dynamic-row">
        <div class="table-responsive">
            <table class="table table-bordered table-sm" id="TableID">
                <thead>
                    <tr>
                        <th>Sl.no</th>
                        <th>Gate Pass No</th>
                        <th>Gate Entry No</th>
                        <th>Contract</th>
                        <th>DC Ref No</th>
                        <th>Item No</th>
                        <th>Unit</th>
                        <th>RGP Qty</th>
                        <th>Stores RevdQty</th>
                        <th>Description</th>
                        <th>Mode Of Dispatch</th>
                        <th>Requested By</th>
                        <th>Department</th>
                        <th>Expected Date</th>
                        <th>Item Remarks</th>
                        <th>Transaction Date</th>
                        <th>Factory</th>
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


           <div id="container2" style="display: none;">
            <div class="modal-body">
             <form>                 
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="type"><b>Report Type:</b></label>               
                <select id="type" class="form-control form-control-sm">
                <option value="">Select</option>
                <option value="">Detail</option>
                <option value="">Summary</option>                               
                </select>
               </div>
               
               <div class="form-group col-md-3">
                <label for="search"><b>Search By:</b></label>               
                <select id="search" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div> 
               
               <div class="form-group col-md-3">
                <label for="select"><b>Select:</b></label>               
                <select id="select" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>                                    
              </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="container3" style="display: none;">
<div class="container container-report mt-4">
  <h5 class="text-center report-header">RGP Detail Report</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="Table_ID">
      <thead>
        <tr>
          <th>Sl.no</th>
          <th>Gate Pass No</th>
          <th>Gate Entry No</th>
          <th>DC Ref No</th>
          <th>Contract</th>
          <th>Item</th>
          <th>Unit</th>
          <th>Description</th>
          <th>Department</th>
          <th>Requested By</th>
          <th>Vendor</th>
          <th>Transaction Date</th>
          <th>Expected Date</th>
          <th>RGP Qty</th>
          <th>Stores RevdQty	</th>
          <th>Item Remarks</th>       
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- Insert actual values here -->
          <td>1</td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>          
          <td></td>         
        </tr>
      </tbody>
    </table>
  </div>
 </div>
  <button class="btn btn-success btn-sm my-3" onclick="exportToExcel()">Export to Excel</button>
</div>
</div>


<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="container5" style="display: none;">
<div class="container container-report mt-4">
  <h5 class="text-center report-header">RGP Summary Report</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="Table1">
      <thead>
        <tr>
          <th>Sl.no</th>
          <th>Gate Pass No</th>
          <th>Item</th>
          <th>Unit</th>                   
          <th>Expected Date</th>
          <th>Quantity</th>
          <th>Received</th>
          <th>Balance</th>
          <th>Department</th>       
          <th>Vendor</th>        
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
</div>
</form>
</div>
</div>


           <div id="container4" style="display: none;">
            <div class="modal-body">
             <form>                 
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="type1"><b>Report Type:</b></label>               
                <select id="type1" class="form-control form-control-sm">
                <option value="">Detail</option>                               
                </select>
               </div>
               
               <div class="form-group col-md-3">
                <label for="search1"><b>Search By:</b></label>               
                <select id="search1" class="form-control form-control-sm">
                <option value="">Select</option>
                <option value="">Department</option>
                <option value="">Vendor</option>                               
                </select>
               </div>
               
               <div class="form-group col-md-3" >
                 <label for="as"><b>As:</b></label>
                 <input type="text" class="form-control form-control-sm" id="as">
               </div>                                        
              </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->
<div class="container container-report mt-4">
  <h5 class="text-center report-header">Non RGP Report</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="Table_1">
      <thead>
        <tr>
          <th>Sl.no</th>
          <th>Gate Pass No</th>
          <th>Contract</th>
          <th>Item</th>
          <th>Unit</th>
          <th>Description</th>
          <th>Department</th>
          <th>Requested By</th>
          <th>Vendor</th>
          <th>Transaction Date</th>
          <th>Quantity</th>
          <th>Item Remarks</th>       
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- Insert actual values here -->
          <td>1</td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td>                             
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


<div id="container6" style="display: none;">
  <div class="modal-body">
    <form>
      <div class="form-row align-items-end mb-3">
        <div class="form-group col-md-3">
          <label for="fromDate"><b>Enter Start Date:</b></label>
          <input type="date" class="form-control form-control-sm" id="fromDate">
        </div>
        <div class="form-group col-md-3">
          <label for="toDate"><b>Enter End Date:</b></label>
          <input type="date" class="form-control form-control-sm" id="toDate">
        </div>
        <div class="form-group col-md-2">
          <button type="button" class="btn btn-primary btn-sm w-100" onclick="fetchGatePassByDate()">Fetch Report</button>
        </div>
        <div class="form-group col-md-2">
          <button type="button" class="btn btn-success btn-sm w-100" onclick="exportToExcel()">Export to Excel</button>
        </div>
      </div>

      <!-- 🔹 Report Container -->
      <div id="container8" class="container container-report mt-4" style="display: none;">
        <h5 class="text-center report-header mb-4">Date Range Report</h5>
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-hover table-sm" id="Table3">
            <thead class="table-light text-center align-middle">
              <tr>
                <th>Sl.no</th>
                <th>Gate Pass No</th>
                <th>Gate Entry No</th>
                 <th>Item No</th>
                 <th>Unit</th>
                 <th>Quantity</th>
                 <th>DC Ref No</th>
                 <th>Description</th>
                 <th>Vendor</th>
                 <th>Stores RcvdQty</th>
                 <th>Stores Return Date</th>
                 <th>Security RcvdQty</th>
                 <th>Security Out Date</th>
                 <th>Expected Date</th>
                 <th>Item Remarks</th>
                 <th>Contract</th>
                 <th>Requested By</th>
                 <th>Department</th>
                 <th>Updated Date</th>
                 <th>Updated Reason</th>
                 <th>Cancelled Reason</th>
                 <th>Transaction Date</th>
                 <th>Factory</th>
              </tr>
            </thead>
            <tbody id="reportBody">
              <!-- Data rows will be added dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    </form>
  </div>
</div>

      <!-- Modal Body --> 
     <div id="container9" style="display: none;">
      <div class="modal-body">
      <div class="row mb-3">
          <div class="col-md-2">
           <label for="gate1" class="form-label"><b>Gate Pass No:</b></label>
           <select class="form-control form-control-sm" id="gate1">
            <option value="">Select</option>
	       </select>
	       <div id="gateError" class="text-danger" style="display: none;">Gate Pass No is required</div>
          </div>
          
          <div class="col-md-2">
           <div style="margin-top: 30px;">
            <button onclick="printContainer1()" style="padding: 8px 12px; font-size: 14px;">Print Report</button>
        </div>
          </div>
         </div>
 
      
      
      
<div id="container10" style="font-family: Arial, sans-serif; font-size: 14px; background-color: #f9f9f9; padding: 20px;">
    <div id="gatePassContainer" class="container" style="display:none;border: 1px solid #000; border-radius: 10px; background-color: #fff; padding: 30px; width: 95%; max-width: 1500px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1);">

        <!-- Header Section -->
        <div style="display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 10px;">
            <img src="img/logo/download.png" style="height: 70px; position: absolute; left: 0; margin-top: 3%;">
            <h2 style="margin: 0; text-align: center; font-weight: bold; text-transform: uppercase; text-decoration: underline;">
                JSW Severfield Structures Limited
            </h2>
        </div>

        <!-- Address & GST -->
        <p id="factoryAddress" style="text-align:center; margin:5px 0;"></p>
        <!-- <p style="text-align: center; margin: 5px 0;">
            Near 10MT Gate, Beside Cement Plant-2, Vidyanagar, P.O. Torangallu - 583 275, Dist. Bellary, Karnataka<br>
            <strong>GSTIN:</strong> 29AACCJ1473D1ZQ
        </p> -->

        <!-- Title -->
        <h4 style="text-align: center; font-weight: bold; text-transform: uppercase; text-decoration: underline; margin-top: 20px;">
            Returnable Gate Pass
        </h4>

        <!-- Basic Info Table -->
    <table id="gatePassDetailsTable" style="width: 100%; border-collapse: collapse; table-layout:fixed" border="1" cellpadding="8">
    <tr>
    <td style="text-align:left;"><strong>Consignee Name & Address:</strong></td>
    <td id="consignee" style="width:40% word-wrap: break-word; word-break: break-word;white-space: normal;"></td>
    <td style="text-align:left;"><strong>Date:</strong></td>
    <td id="date" style="text-align:left;"></td>
    </tr>
    <tr>
        <td style="text-align:left;"><strong>Gate Pass No:</strong></td>
        <td id="gpass" style="text-align:left;"></td>
        <td style="text-align:left;"><strong>Reason For Dispatch:</strong></td>
        <td id="reason" style="text-align:left;"></td>
    </tr>
    <tr>
        <td style="text-align:left;"><strong>Mode Of Dispatch:</strong></td>
        <td id="mode" style="text-align:left;"></td>
        <td style="text-align:left;"><strong>Contract:</strong></td>
        <td id="contract" style="text-align:left;"></td>
    </tr>
    <tr>
        <td style="text-align:left;"><strong>Expected Date of Return:</strong></td>
        <td id="expected" style="text-align:left;"></td>
        <td style="text-align:left;"><strong>Requested By:</strong></td>
        <td id="requested" style="text-align:left;"></td>
    </tr>
    <tr>
        <td style="text-align:left;"><strong>Department:</strong></td>
        <td id="department" style="text-align:left;"></td>
        <td style="text-align:left;"><strong>Remarks:</strong></td>
        <td id="remarks" style="text-align:left;"></td>
    </tr>
    <tr>
        <td style="text-align:left;"><strong>Enclosures:</strong></td>
        <td id="enclosures" colspan="2"></td>
    </tr>
</table>

<!-- Table for Item Details -->
<table id="itemsTable" style="width: 100%; border-collapse: collapse; margin-top: 30px;" border="1" cellpadding="8">
    <thead style="background-color: #f1f1f1;">
        <tr>
            <th>Sl.no</th>
            <th>Item</th>
            <th>Description</th>
            <th>UOM</th>
            <th>Quantity</th>
            <th>Value</th>
            <th>Remarks</th>
        </tr>
    </thead>
    <tbody>
        <!-- Dynamically populated rows will go here -->
    </tbody>
</table>

        <!-- Signature Section -->
        <table style="width: 100%; margin-top: 8%;">
            <tr>                
                <td style="text-align:left;"><strong>Prepared By</strong></td>
                <td style="text-align:center;"><strong>Checked By</strong></td>
                <td style="text-align:right;"><strong>Authorized Signatory</strong></td>
            </tr>
             
        </table>
    </div>
   </div>
  </div>
 </div>
 
 
       <!-- Modal Body --> 
     <div id="container11" style="display: none;">
      <div class="modal-body">
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
            <button onclick="printContainer12()" style="padding: 8px 12px; font-size: 14px;">Print Report</button>
        </div>
          </div>
         </div>
 
      
      
      
<div id="container12" style="font-family: Arial, sans-serif; font-size: 14px; background-color: #f9f9f9; padding: 20px;">
    <div id="Nonreturngatepass" class="container" style="display:none;border: 1px solid #000; border-radius: 10px; background-color: #fff; padding: 30px; width: 95%; max-width: 1500px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1);">

        <!-- Header Section -->
        <div style="display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 10px;">
            <img src="img/logo/download.png" style="height: 70px; position: absolute; left: 0; margin-top: 3%;">
            <h2 style="margin: 0; text-align: center; font-weight: bold; text-transform: uppercase; text-decoration: underline;">
                JSW Severfield Structures Limited
            </h2>
        </div>

        <!-- Address & GST -->
        <p id="ngpfactoryAddress" style="text-align:center; margin:5px 0;"></p>
        <!-- <p style="text-align: center; margin: 5px 0;">
            Near 10MT Gate, Beside Cement Plant-2, Vidyanagar, P.O. Torangallu - 583 275, Dist. Bellary, Karnataka<br>
            <strong>GSTIN:</strong> 29AACCJ1473D1ZQ
        </p> -->

        <!-- Title -->
        <h4 style="text-align: center; font-weight: bold; text-transform: uppercase; text-decoration: underline; margin-top: 20px;">
            Non Returnable Gate Pass
        </h4>

        <!-- Basic Info Table -->
    <table id="ngpgatePassDetailsTable" style="width: 100%; border-collapse: collapse; table-layout:fixed" border="1" cellpadding="8">
    <tr>
        <td style="text-align:left;"><strong>Consignee Name & Address:</strong></td>
        <td id="ngpconsignee" style="width:40% word-wrap: break-word; word-break: break-word;white-space: normal;"></td>
        <td style="text-align:left;"><strong>Date:</strong></td>
        <td id="ngpdate" style="text-align:left;"></td>
    </tr>
    <tr>
        <td style="text-align:left;"><strong>Gate Pass No:</strong></td>
        <td id="ngpass" style="text-align:left;"></td>
        <td style="text-align:left;"><strong>Reason For Dispatch:</strong></td>
        <td id="ngpreason" style="text-align:left;"></td>
    </tr>
    <tr>
        <td style="text-align:left;"><strong>Mode Of Dispatch:</strong></td>
        <td id="ngpmode" style="text-align:left;"></td>
        <td style="text-align:left;"><strong>Contract:</strong></td>
        <td id="ngpcontract" style="text-align:left;"></td>
    </tr>
    <tr>
        <td style="text-align:left;"><strong>Requested By:</strong></td>
        <td id="ngprequested" style="text-align:left;"></td>
        <td style="text-align:left;"><strong>Department:</strong></td>
        <td id="ngpdepartment" style="text-align:left;"></td>
    </tr>
    <tr>
        <td style="text-align:left;"><strong>Remarks:</strong></td>
        <td id="ngpremarks" style="text-align:left;"></td>
        <td style="text-align:left;"><strong>Enclosures:</strong></td>
        <td id="ngpenclosures" style="text-align:left;"></td>
    </tr>
</table>

<!-- Table for Item Details -->
<table id="itemsTablengp" style="width: 100%; border-collapse: collapse; margin-top: 30px;" border="1" cellpadding="8">
    <thead style="background-color: #f1f1f1;">
        <tr>
            <th>Sl.no</th>
            <th>Item</th>
            <th>Description</th>
            <th>UOM</th>
            <th>Quantity</th>
            <th>Value</th>
            <th>Remarks</th>
        </tr>
    </thead>
    <tbody>
        <!-- Dynamically populated rows will go here -->
    </tbody>
</table>

        <!-- Signature Section -->
        <table style="width: 100%; margin-top: 8%;">
            <tr>                
                <td style="text-align:left;"><strong>Prepared By</strong></td>
                <td style="text-align:center;"><strong>Checked By</strong></td>
                <td style="text-align:right;"><strong>Authorized Signatory</strong></td>
            </tr>
             
        </table>
    </div>
   </div>
  </div>
 </div>
</div>
</div>
</div>
</div>


<script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/xlsx/0.20.3/xlsx.full.min.js"></script>
   

<script>
   window.onload = function() {
	   fetchGatePassDetails(gp_no);
};
</script>

<script>
   window.onload = function() {
fetchngpGatePassDetails(gp_no);
};
</script>

<script>

</script>

<script>
 function exportToExcelitem() {
  var table = document.getElementById("TableID");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Items Due For Return"});
  XLSX.writeFile(workbook, 'Items_Due_For_Return.xlsx');
 }
</script>

<script>
 function exportToExcel() {
  var table = document.getElementById("Table3");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Date Range Report"});
  XLSX.writeFile(workbook, 'Date_Range_Report.xlsx');
 }
</script>

<script>
function toggleTables(selectedTab) {
    // Get references to the containers
    const container1 = document.getElementById('container1');
    const container6 = document.getElementById('container6');
    const container9 = document.getElementById('container9');
    const container11 = document.getElementById('container11');

    // Hide all containers initially
    container1.style.display = 'none';
    container6.style.display = 'none';
    container9.style.display = 'none';
    container11.style.display = 'none';

    // Show the selected container based on the tab clicked
    if (selectedTab === 'items') {
        container1.style.display = 'block';
    } else if (selectedTab === 'date') {
        container6.style.display = 'block';
    } else if (selectedTab === 'outward') {
        container9.style.display = 'block';
    } else if (selectedTab === 'nonoutward') {
        container11.style.display = 'block';
    }

    // Update active tab class
    const tabs = document.querySelectorAll('.nav-link');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(selectedTab + 'Tab').classList.add('active');
}
</script>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const typeSelect = document.getElementById('type');
    const containerDetail = document.getElementById('container3');
    const containerSummary = document.getElementById('container5');

    typeSelect.addEventListener('change', function () {
        const selectedText = this.options[this.selectedIndex].text;

        // Hide both containers by default
        containerDetail.style.display = 'none';
        containerSummary.style.display = 'none';

        // Show based on selection
        if (selectedText === 'Detail') {
            containerDetail.style.display = 'block';
        } else if (selectedText === 'Summary') {
            containerSummary.style.display = 'block';
        }
    });
});
</script>

<script>
document.addEventListener("DOMContentLoaded", function () {
    const fromDate = document.getElementById("start");
    const toDate = document.getElementById("end");
    const reportContainer = document.getElementById("container8");

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
$(document).ready(function() {
    $('.searchable-dropdown').select2({
        placeholder: "Select vehicle type",
        allowClear: true
    });
});
</script>

<script>
    // JavaScript to toggle the visibility of the input fields container
    document.getElementById("getButton").addEventListener("click", function() {
        document.getElementById("inputFieldsContainer").style.display = "block";
    });
</script>

<script>
function printContainer1() {
    var printContents = document.getElementById("container10").innerHTML;
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

<script>
function printContainer12() {
    var printContents = document.getElementById("container12").innerHTML;
    var printWindow = window.open('', '', 'height=600,width=900');

    printWindow.document.write('<html><head><title>Print Report</title>');
    printWindow.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');

    printWindow.document.close();

    // Wait for window to fully load+
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

 
 <script src="externalLibrary/cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
 


  


    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    <script src="js/ruang-admin.min.js"></script>

    <script src="vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
     <script src="js/config.js?v=<%=jsVersion%>"></script>
   
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script> 
    <script src="js/outwardreturnable.js?v=<%=jsVersion%>"></script>
     <script src="js/username.js?v=<%=jsVersion%>"></script>
     <script src="js/logout.js?v=<%=jsVersion%>"></script>
      <script src="js/createdby.js?v=<%=jsVersion%>"></script>
 	<script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
 	<script src="js/factoryid.js?v=<%=jsVersion%>"></script>



</body>
</html>