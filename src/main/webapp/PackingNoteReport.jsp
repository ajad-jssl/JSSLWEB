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
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
<!--   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-xxx" crossorigin="anonymous" /> -->
  <link href="css/masterpage.css" rel="stylesheet">
 <link href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />
  <script src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>
  
  
<!-- Include Bootstrap CSS -->
 <link href="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">



<!-- Include Bootstrap JS -->
<script src="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>

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
      <%@ include file="SubConSidebar.jsp" %>
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
            <h1 class="h3 mb-0 text-gray-800">SubContract Report</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="SubConDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item"><a href="#">SubContract Report</a></li>
              
            </ol>
          </div>
          
    
     <div class="container mt-5">
    <!-- Radio Buttons -->
   <div class="d-flex justify-content-center mb-4">
    <div class="nav nav-tabs" id="gpmsTabs" role="tablist">
     <a class="nav-item nav-link active" id="packingnoteprintTab" data-bs-toggle="tab" href="#outward" role="tab" ><b>PACKING NOTE PRINT</b></a>
     <a class="nav-item nav-link" id="loadlistTab" data-bs-toggle="tab" href="#nonoutward" role="tab" ><b>LOAD LIST</b></a>
      <a class="nav-item nav-link" id="packingnoteTab" data-bs-toggle="tab" href="#date" role="tab" ><b>PACKING NOTE REPORT</b></a>

    </div>
</div>
 </div>
 









      <!-- Modal Body --> 
  <div id="container1" style="display: none;">
      <div class="modal-body">
      <div class="row mb-5">
 
    <!-- CENTER HEADING -->
  
 
    <!-- CONTRACT DROPDOWN -->
    <div class="col-md-2">
        <label for="contractSelect" class="form-label"><b>Contract:</b></label>
        <select class="form-control form-control-sm" id="contractSelect">
            <option value="">Select</option>
        </select>
    </div>
 
    <!-- LOT DROPDOWN -->
    <div class="col-md-2">
        <label for="lotSelect" class="form-label"><b>Lot:</b></label>
        <select class="form-control form-control-sm" id="lotSelect">
            <option value="">Select</option>
        </select>
    </div>
 
    <!-- PRINT BUTTON -->
    <div class="col-md-2">
        <div style="margin-top: 30px;">
            <button onclick="printContainer1()" style="padding: 8px 12px; font-size: 14px;">
                Print Report
            </button>
        </div>
    </div>
 
</div>
      
<div id="deliveryChallanContainer"
     style="
        display:block;
        font-family: Arial, sans-serif;
        font-size: 14px;
        background-color: #fff;
        padding: 30px;
        width: 95%;
        max-width: 1500px;
        margin: auto;
        border: 1px solid #000;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
     ">
 
    <!-- HEADER -->
    <div style="display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 7%;">
        <img src="img/logo/download.png" style="height: 70px; position: absolute; left: 0;">
        <h5 style="text-align:center; font-weight:bold; margin-top:20px; text-decoration:underline;">
            Delivery Challan
        </h5>
    </div>
 
    <!-- BASIC INFO TABLE -->
    <table style="width:100%; border-collapse:collapse; margin-top:25px;" border="1" cellpadding="8">
        <tr>
            <td><strong>Contract:</strong></td>
            <td style="text-align:left;" id="contract"></td>
            <td><strong>Date:</strong></td>
            <td style="text-align:right;" id="dcDate"></td>
        </tr>
 
        <tr>
            <td><strong>Lot:</strong></td>
            <td style="text-align:left;" id="lot"></td>
            <td><strong>Item Count:</strong></td>
            <td style="text-align:right;" id="itemCount"></td>
        </tr>
 
        <tr>
            <td><strong>Vehicle No:</strong></td>
            <td style="text-align:left;" id="vehicleNo"></td>
            <td><strong>Weight (Kg):</strong></td>
            <td style="text-align:right;" id="totalWeight"></td>
        </tr>
 
        <tr>
            <td><strong>Weighbridge Slip:</strong></td>
            <td style="text-align:left;" id="weighbridgeSlip"></td>
            <td><strong>Subcontractor Invoice Ref No:</strong></td>
            <td style="text-align:right;" id="invoiceRef"></td>
        </tr>
    </table>
 
    <!-- FROM / TO SECTION -->
<table style="width:100%; border-collapse:collapse; margin-top:25px;" border="1" cellpadding="8">
    <tr>
        <td style="width:50%; text-align:left;" id="fromAddress">
            <strong>From:</strong><br>
            JSW Severfield Structures Ltd<br>
           <span id="dynaddress"> </span> 
            
           <br>
            GSTIN: <span id ="gstno">29AACCJ1473D1ZQ</span>
        </td>
 
        <td style="width:50%; text-align:left;" id="toAddress">
            <strong>Consigned To:</strong><br>
        </td>
    </tr>
</table>
 
    <!-- EXTRA INFO -->
    <table style="width:100%; border-collapse:collapse; margin-top:25px;" border="1" cellpadding="8">
        <tr>
            <td style="width:15%;"><strong>Transporter:</strong></td>
            <td style="width:55%; text-align:left;" id="transporter"></td>
 
            <td style="width:10%;"><strong>Client PO:</strong></td>
            <td style="width:20%; text-align:right;" id="clientPO"></td>
        </tr>
 
        <tr>
            <td><strong>Notes:</strong></td>
            <td colspan="3" style="text-align:left;" id="notes"></td>
        </tr>
    </table>
 
    <!-- ITEMS TABLE -->
    <table style="width:100%; border-collapse:collapse; margin-top:30px;" border="1" cellpadding="8">
        <thead style="background-color:#f1f1f1; text-align:left;">
            <tr>
            <th>SL No</th>
                <th>Description</th>
                <th>Load</th>
                <th>Mark</th>
                <th>Section</th>
                <th>Qty</th>
            </tr>
        </thead>
 
        <tbody id="itemList">
            <!-- Dynamic rows insert here -->
            
            <tr id="totalRow">
    <td colspan="4" style="text-align:right;"><strong>Total</strong></td>
    <td style="text-align:right;" id="totalQty"></td>
</tr>
        </tbody>

    </table>
 
    <!-- FOOTER -->
    <p style="text-align:center; font-weight:bold; margin-top:40px;">
        For JSW Severfield Structures Ltd.
    </p>
 
    <!-- SIGNATURE -->
    <table style="width:100%; margin-top:50px;">
        <tr>
            <td><strong>Authorized Signatory</strong></td>
            <td style="text-align: center;"><strong>Date</strong></td>
        </tr>
    </table>
 
    <hr>
 
    <p style="text-align:center; font-size:12px;">
        Regd. Office: #05 to 08, B-Wing, Lower Ground Floor, Art Guild House, Phoenix Market City, LBS Marg, Kurla West, Mumbai – 400 070  
        Phone: 022 6731 7000
    </p>
 
</div>
  </div>
</div>
 
 
 <div id="container2" style="display: none;">
    <div class="modal-body">
        <form>

            <!--  Report Type & Date Filters in One Line -->
        <div class="form-row align-items-end mb-3">

    <!-- Contract Dropdown -->
    <div class="form-group col-md-3">
        <label for="contractload"><b>Contract:</b></label>
        <select class="form-control form-control-sm" id="contractload">
            <option value="">Select</option>
        </select>
         <small id="contractError2" style="color: red; display: none;">
                    Please select a Contract
                </small>
    </div>

    <!-- Phase Dropdown -->
    <div class="form-group col-md-3">
        <label for="phaseSelect"><b>Phase:</b></label>
        <select class="form-control form-control-sm" id="phaseSelect">
            <option value="">Select</option>
        </select>
        <small id="phaseError2" style="color: red; display: none;">
                    Please select a Phase 
                </small>
    </div>

    <!-- Load Dropdown -->
    <div class="form-group col-md-3">
        <label for="loadSelect"><b>Load:</b></label>
        <select class="form-control form-control-sm" id="loadSelect">
            <option value="">Select</option>
        </select>
          <small id="loadError2" style="color: red; display: none;">
                    Please select a Phase 
                </small>
    </div>

    <!-- Fetch Button -->
    <div class="form-group col-md-2">
        <button type="button" class="btn btn-primary btn-sm w-100" id="fetchloadHistory">
            Fetch Report
        </button>
    </div>

</div>

           
            <div class="container container-report mt-4" id="loadlisttable" style="display:block;">
    <h5 class="text-center report-header">Load list Details</h5>
    <div class="form-row dynamic-row">
        <div class="table-responsive">
            <table class="table table-bordered table-sm" id="Table_1">
                <thead>
           <tr>
    <th>SL.No</th>
    <th>Contract</th>
    <th>Phase</th>
    <th>Load</th>
    <th>Mark</th>
    <th>Description</th>
    <th>Qty</th>
    <th>Weight</th>
    <th>Total Weight</th>
    <th>Area</th>
    <th>Total Area</th>
</tr>
           
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
    <button class="btn btn-success btn-sm my-3" onclick="exportToExcelHistroy()">Export to Excel</button>
</div>
        </form>
    </div>
</div>


<div id="container3" style="display: none;">
    <div class="modal-body">
        <form>

            <!-- 🔽 Report Type & Date Filters in One Line -->
          <div class="row align-items-end mb-3">

    <!-- Report Type -->
    <div class="form-group col-md-2">
        <label for="reportType"><b>Report Type:</b></label>
        <select class="form-control form-control-sm" id="reportType">
            <option value="">Select</option>
            <option value="summary">Summary</option>
            <option value="details">Details</option>
        </select>
       
    </div>

    <!-- Contract -->
    <div class="form-group col-md-2">
        <label for="contractsd"><b>Contract:</b></label>
        <select class="form-control form-control-sm" id="contractsd">
            <option value="">Select</option>
           
        </select>
        
    </div>

    <!-- Lot -->
    <div class="form-group col-md-2">
        <label for="lotsd"><b>Lot:</b></label>
        <select class="form-control form-control-sm" id="lotsd">
            <option value="">Select</option>
          
        </select>
     
    </div>

    <!-- Start Date -->
    <div class="form-group col-md-2">
        <label for="fromDate"><b>Start Date:</b></label>
        <input type="date" class="form-control form-control-sm" id="fromDate">
    </div>

    <!-- End Date -->
    <div class="form-group col-md-2">
        <label for="toDate"><b>End Date:</b></label>
        <input type="date" class="form-control form-control-sm" id="toDate">
    </div>

    <!-- Fetch Button -->
    <div class="form-group col-md-2">
        <button type="button" class="btn btn-primary btn-sm w-100" id="fetchsummaryOrdetails">
            Fetch Report
        </button>
    </div>

</div>
          

            
       <!-- 🔹 DETAILS TABLE (Already present) -->
<div class="container container-report mt-4" id="detailsTableContainer" style="display:none;">
    <h5 class="text-center report-header">LOAD LINE ITEM LIST</h5>
    <div class="table-wrapper">
        <div class="table-responsive">
            <table class="table table-bordered table-sm dynamicdesign" id="detailsTable" style="height:10vh">
                <thead>
                <tr>
                    <th>SL.No</th>
                    <th>Contract No</th>
                    <th>Phase No</th>
                    <th>Lot No</th>
                    <th>Quantity</th>
                    <th>Mark No</th>
                    <th>Description</th>
                    <th>Total Weight</th>
                    <th>Size</th>
                    <th>Dims</th>
                    <th>PLoad</th>
                    <th>Fab Loads</th>
                    <th>Vehicle No</th>
                    <th>Weight Bridge Ref No</th>
                    <th>Created Date</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
    <button class="btn btn-success btn-sm my-3" onclick="exportToDetailsExcel()">Export to Excel</button>
</div>


<!-- 🔹 SUMMARY TABLE (Hidden initially) -->
<div class="container container-report mt-4" id="summaryTableContainer" style="display:none;">
    <h5 class="text-center report-header">SUMMARY REPORT</h5>
    <div class="table-wrapper">
        <div class="table-responsive">
            <table class="table table-bordered table-sm dynamicdesign" id="summaryTable" >
                <thead>
                <tr>
                    <th>Contract No</th>
                    <th>Lot No</th>
                    <th>Description</th>
                    <th>Trailer Ref No</th>
                    <th>WB Reference No</th>
                    <th>Created Date</th>
                    <th>Piece Weight</th>
                    <th>Others Weight</th>
                    <th>Total Weight</th>
                    <th>Fab Loads</th>
                    <th>Commands</th>
                </tr>
                </thead>
                <tbody>
                
                
                
    
</tbody>
                </tbody>
            </table>
        </div>
    </div>
    <button class="btn btn-success btn-sm my-3" onclick="exportToSummaryHistroy()">Export to Excel</button>
    
</div>




<div class="container container-report mt-4" id="secondaryTableContainersss" style="display:none;" ">
    <h5 class="text-center report-header">LOAD BUILD DETAILS</h5>

    <div class="table-responsive">
        <table class="table table-bordered table-sm dynamicdesign" id="secondaryTable">
            <thead>
                <tr>
                    <th>Phase No</th>
                    <th>Quantity</th>
                    <th>Mark No</th>
                    <th>Weight</th>
                    <th>Size</th>
                    <th>Dims</th>
                    <th>Description</th>
                    <th>PLoad</th>
                    <th>Fab Loads</th>
                    <th>Finished Goods</th>
                </tr>
            </thead>
            <tbody>
                <!-- You will insert values later -->
            </tbody>
        </table>
    </div>
     <button class="btn btn-success btn-sm my-3" onclick="exportToLoadBuildHistroy()">Export to Excel</button>
</div>


<div class="container container-report mt-4" id="HistoryDetailsContainer" style="display:none;">
    <h5 class="text-center report-header">HAULIER DETAILS LIST</h5>

    <div class="form-row dynamic-row">
        <div class="table-responsive">
            <table class="table table-bordered table-sm dynamicdesign" id="haulierDetailsTable">
                <thead>
                <tr>
                    <th>SL.No</th>
                    <th>Haulier</th>
                    <th>Destination</th>
                    <th>Country</th>
                    <th>State</th>
                    <th>Load Type</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>

    <button class="btn btn-success btn-sm my-3" onclick="exportHaulierHistory()">Export to Excel</button>
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


<script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/xlsx/0.20.3/xlsx.full.min.js"></script>

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
<script>





/* function printContainer12() {
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
}*/
</script>


  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
 <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>  -->

  <!-- Bootstrap JS and dependencies -->


<!-- <script>
  document.getElementById("btnnext").addEventListener("click", function () {
    document.getElementById("container2").style.display = "block";
  });
</script> -->  

 
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    
    <script src="vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
    <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
    <!-- <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script> -->
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script> 
     <script src="js/PackingNoteReportLoadlist.js?v=<%=ver(application, "/js/PackingNoteReportLoadlist.js")%>"></script>
     <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
     <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
      <script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
 	<script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
 	<script src="js/factoryid.js?v=<%=ver(application, "/js/factoryid.js")%>"></script>
 	
 	
 <script>
 
 $(document).ready(function () {


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
	    
	    
	

	});
 

 

/* 		function fetchBuildingDetails() {

			$("#container3").show();
			$("#HistoryDetailsContainer").hide();
			$("#secondaryTableContainer").show();

		}
		
		function fetchHistoryReport(){
			$("#secondaryTableContainer").hide();
			$("#HistoryDetailsContainer").show();
} */
	</script>	
 <!--    
    <script src="js/customertype.js"></script>
    -->

  <!-- Page level custom scripts -->
</body>
</html>