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
      <%@ include file="InVoiceSideBar.jsp" %>
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
            <h1 class="h3 mb-0 text-gray-800">Invoice Report</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="DebitCreditDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item"><a href="InvoiceReport.jsp">Invoice Report</a></li>
              
            </ol>
          </div>
          
          
     <!--       <div class="container mt-5">
    Radio Buttons
    <div class="d-flex justify-content-center mb-4">            
        <div class="form-check">
            <input class="form-check-input" type="radio" name="invoiceSelection" id="invoiceRadio" value="invoice" onchange="toggleTables()">
            <label class="form-check-label" for="invoiceRadio">Invoice Report</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="invoiceSelection" id="gstRadio" value="gst" onchange="toggleTables()">
            <label class="form-check-label" for="gstRadio">GST Report</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="invoiceSelection" id="reportRadio" value="report" onchange="toggleTables()">
            <label class="form-check-label" for="reportRadio">Report</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="invoiceSelection" id="summaryRadio" value="summary" onchange="toggleTables()">
            <label class="form-check-label" for="summaryRadio">Summary Report</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="invoiceSelection" id="balanceRadio" value="balance" onchange="toggleTables()">
            <label class="form-check-label" for="balanceRadio">Current Balance Report</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="invoiceSelection" id="saleRadio" value="sale" onchange="toggleTables()">
            <label class="form-check-label" for="saleRadio">Sale Order Report</label>
        </div>                    
    </div>
 </div> -->
 
 <div class="container mt-5">
    <!-- Radio Buttons -->
   <div class="d-flex justify-content-center mb-4">
    <div class="nav nav-tabs" id="invoiceTabs" role="tablist">
     <a class="nav-item nav-link active" id="invoiceTab" data-bs-toggle="tab" href="#invoice" role="tab" onclick="toggleTables('invoice')"><b>Invoice Report</b></a>
     <a class="nav-item nav-link" id="balanceTab" data-bs-toggle="tab" href="#balance" role="tab" onclick="toggleTables('balance')"><b>Current Balance Report</b></a>
      <!-- <a class="nav-item nav-link" id="saleorderTab" data-bs-toggle="tab" href="#saleorder" role="tab" onclick="toggleTables('saleorder')"><b>Sale Order Report</b></a> -->
        <!-- <a class="nav-item nav-link" id="itemsTab" data-bs-toggle="tab" href="#items" role="tab" onclick="toggleTables('items')"><b>Items Due Report</b></a> -->
    </div>
</div>
 </div>
                  

<!-- Modal 1: Create QS Package Details -->
<!-- Form Container with Outline and Title -->
           <div id="container6" style="display: none;">
            <div class="modal-body">
             <form>                 
              <div class="form-row">
              <div class="form-group col-md-2">
                <label for="factory"><b>Factory:</b></label>               
                <select id="factory" class="form-control form-control-sm">
                <option value="">Select factory</option>                               
                </select>
               </div>
               <div class="form-group col-md-2">
                <label for="Type"><b>Type:</b></label>               
                <select id="select_type" class="form-control form-control-sm">
                 <option value="">Select Type</option>   
                 <option value="1">Summary</option>
                <option value="2">Detail</option>                            
                </select>
               </div>
               <div class="form-group col-md-2">
                <label for="Contract"><b>Contract:</b></label>               
                <select id="Contract" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
               
               
               <div class="form-group col-md-2">
                <label for="date"><b>From Date:</b></label>
                <input type="date" class="form-control form-control-sm" id="date" placeholder="From Date">
               </div>
                            
               
               <div class="form-group col-md-2" >
                 <label for="todate"><b>To Date:</b></label>
                 <input type="date" class="form-control form-control-sm" id="todate" placeholder="To Date" onchange="loadInvoiceReport()">
               </div>                       
              </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="container1" style="display: none;">
<div class="container container-report mt-4">
  <h5 class="text-center report-header">Invoice Report</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="Table_ID">
      <thead>
        <tr>
          <th>SL.NO</th>
          <th>Invoice No</th>
          <th>Invoice Type</th>
          <th>Contract No</th>
          <th>LOT No</th>
          <th>Workorder No</th>
          <th>Workorder Date</th>
          <th>Customer Address</th>
          <th>Invoice Date</th>
          <th>Scrap Type</th>
          <th>Unit</th>
          <th>Qty</th>
          <th>Kgs</th>
          <th>Unit Price</th>
          <th>Total Basic Value</th>
          <th>Freight</th>
          <th>Wb Weight</th>
          <th>Transport Name</th>
          <th>Vehicle No</th>
          <th>GST No</th>
          <th>Business unit Address</th>
          <th>Adv tax rec</th>
          <th>Adv non tax rec</th>
          <th>IGSTP(%)</th>
          <th>CGSTP(%)</th>
          <th>SGSTP(%)</th>
          <th>IGSTV</th>
          <th>CGSTV</th>
          <th>SGSTV</th>
          <th>IGSTA</th>
          <th>CGSTA</th>
          <th>SGSTA</th>
          <th>Payable to dept</th>
          <th>Payable by customer</th>
          <th>Total Invoice Value</th>
          <th>CGST</th>
          <th>CPAN</th>
          <th>Remarks</th>
          <th>Status</th>
          <th>Factory</th>
        </tr>
      </thead>
      <tbody>
        <tr>
         <!--  dynamically bind -->
        </tr>
      </tbody>
    </table>
  </div>
 </div>
 <button type="button" id="btnExportInvoice" class="btn btn-success btn-sm my-3">Export to Excel</button>
</div>
</div>
</form>
</div>
</div>

           <div id="container7" style="display: none;">
            <div class="modal-body">
             <form>                 
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="State"><b>State:</b></label>               
                <select id="State" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
               
               
               <div class="form-group col-md-3">
                <label for="Type"><b>Type:</b></label>               
                <select id="Type" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
               
               
               <div class="form-group col-md-3">
                <label for="date"><b>From Date:</b></label>
                <input type="date" class="form-control form-control-sm" id="from" placeholder="From Date">
               </div>
                            
               
               <div class="form-group col-md-3" >
                 <label for="todate"><b>To Date:</b></label>
                 <input type="date" class="form-control form-control-sm" id="to" placeholder="To Date">
               </div>
               
                                                       
              </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="container2" style="display: none;">
<div class="container container-report mt-4">
  <h5 class="text-center report-header">GST Report</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="Table">
      <thead>
        <tr>
          <th>SL.NO</th>
          <th>Invoice No</th>
          <th>Date</th>
          <th>Contract</th>
          <th>LOT</th>
          <th>Business Unit Code</th>
          <th>Business Unit GST</th>
          <th>Business Unit PAN</th>
          <th>Customer Name</th>
          <th>Customer Address</th>
          <th>Customer GST</th>
          <th>Customer PAN</th>
          <th>UOM</th>
          <th>QTY</th>
          <th>Per KG</th> 
          <th>Unit Price</th>
          <th>Advance(Taxable)</th>
          <th>Advance(Non Taxable)</th>
          <th>Total</th>
          <th>Frieght</th>
          <th>Payable to Dept</th>
          <th>Recovery</th>
          <th>CGST (%)</th>
          <th>CGST (Adv)</th>
          <th>CGST (Inv Val)</th>
          <th>CGST (PTD)</th>
          <th>CGST (Recv)</th>
          <th>SGST (%)</th>
          <th>SGST (Adv)</th>
          <th>SGST (Inv Val)</th>
          <th>SGST (PTD)</th>
          <th>SGST (Recv)</th>
          <th>IGST (%)</th>
          <th>IGST (Adv)</th>
          <th>IGST (Inv Val)</th>
          <th>IGST (PTD)</th>
          <th>IGST (Recv)</th>          
          <th>Vehicle No</th>
          <th>Transporter</th>
          <th>WB weight(Tons)</th>
          <th>Type</th>
          <th>Status</th>
          <th>Advance before rec(Tax)</th>
          <th>Advance before recovery(NTax)</th>
          <th>Service/HSN</th>
          <th>IType</th>
          <th>Ref No</th>
          <th>Vendor Name</th>
          <th>Vendor Inv Date</th>
          <th>Vendor Inv No.</th>
          <th>Vendor Inv Qty</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- Insert actual values here -->
          <td>1</td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
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
</form>
</div>
</div>


           <div id="container8" style="display: none;">
            <div class="modal-body">
             <form>                 
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="type"><b>Type:</b></label>               
                <select id="type" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
               
               
               <div class="form-group col-md-3">
                <label for="date"><b>From Date:</b></label>
                <input type="date" class="form-control form-control-sm" id="fromdate" placeholder="From Date">
               </div>
                            
               
               <div class="form-group col-md-3" >
                 <label for="todate"><b>To Date:</b></label>
                 <input type="date" class="form-control form-control-sm" id="Todate" placeholder="To Date">
               </div>
               
               <div class="form-group col-md-3">
                <label for="Invoice"><b>Invoice Type:</b></label>               
                <select id="Invoice" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
               
               <div class="form-group col-md-3">
                <label for="contract"><b>Contract:</b></label>               
                <select id="contract" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
               
               <div class="form-group col-md-3">
                <label for="Load"><b>Load:</b></label>               
                <select id="Load" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
                                                       
              </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="container3" style="display: none;">
<div class="container container-report mt-4">
  <h5 class="text-center report-header">Report</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="Table1">
      <thead>
        <tr>
          <th>SL.NO</th>
          <th>Invoice No</th>
          <th>Date</th>
          <th>Contract</th>
          <th>LOT</th>         
          <th>Customer Name</th>
          <th>Qty</th>
          <th>Per_Kgs</th>
          <th>Unit_Price</th>
          <th>Total</th>
          <th>Total Value</th>
          <th>BED(0)</th> 
          <th>BED(12.5)</th>
          <th>CSTWCT(5.5)</th>
          <th>KVAT(14.5)</th>
          <th>KVAT(5.5)</th>
          <th>KVAT(5)</th>
          <th>CST(14.5)</th>
          <th>CST(5.5)</th>
          <th>CST(5)</th>
          <th>CST against C form(2)</th>
          <th>CST(0)</th>
          <th>KWCT(5.5)</th>
          <th>TCS(1)</th>
          <th>Freight</th>
          <th>Grand Total</th> 
          <th>Vehicle No</th>
          <th>Transporter Name</th>
          <th>WB_Weight(Tons)</th>         
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- Insert actual values here -->
          <td>1</td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
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

           <div id="container9" style="display: none;">
            <div class="modal-body">
             <form>                 
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="date"><b>From Date:</b></label>
                <input type="date" class="form-control form-control-sm" id="fromdate1" placeholder="From Date">
               </div>
                            
               
               <div class="form-group col-md-3" >
                 <label for="todate"><b>To Date:</b></label>
                 <input type="date" class="form-control form-control-sm" id="todate1" placeholder="To Date">
               </div>      
               
               <div class="form-group col-md-3">
                <label for="contract1"><b>Contract:</b></label>               
                <select id="contract1" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
                                                       
              </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="container4" style="display: none;">
<div class="container container-report mt-4">
  <h5 class="text-center report-header">Summary Report</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="TableID">
      <thead>
        <tr>
          <th>SL.NO</th>
          <th>JobCode</th>
          <th>Steel</th>
          <th>Gratings</th>
          <th>Stairs</th>         
          <th>Purlins</th>
          <th>Decking</th>
          <th>Fire Proofing</th>
          <th>Roof Panels</th>
          <th>Bought Outs</th>
          <th>Supply of Fabricated Steel Structure</th>
          <th>Fire Proofing Material - Cementatious</th> 
          <th>Paints & Thinner</th>
          <th>Ladders & Stair cases</th>
          <th>Fabricated Steel For Execution of Structural Works Contract</th>
          <th>Metal Decking & Accessories</th>
          <th>Roof Sheeting & Accessories</th>
          <th>Hand Rails</th>
          <th>Checker Plates</th>
          <th>Fire Proofing Material - Gypsum</th>
          <th>Fabricated Steel for Boiler Components-Primary Structure</th>
          <th>Heavy Melting Scrap</th>
          <th>Heavy Melting Scrap(M S Trimming / Bellary Strip)</th>
          <th>MS Skeleton Scrap</th>
          <th>Offcuts</th>
          <th>Profile Plate</th> 
          <th>Swarf</th>
          <th>Mixed</th>
          <th>other</th>                 
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- Insert actual values here -->
          <td>1</td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td>        
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

           <div id="container10" style="display: none;">
            <div class="modal-body">
             <form>                 
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="type1"><b>Type:</b></label>               
                <select id="type1" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>    
               
               <div class="form-group col-md-3">
                <label for="contract2"><b>Contract:</b></label>               
                <select id="contract2" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
                                                       
           </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->
<!-- <div id="container5" style="display: none;"> -->
<div id="reportContainer" class="Container container-report mt-4" style="display:none;">
  <h5 class="text-center report-header">Current Balance Report</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="Table2">
      <thead>
        <tr>
          <th>SL.NO</th>
          <th>Taxable</th>
          <th>Non Taxable</th>        
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- Dynamically loaded -->
        </tr>
      </tbody>
    </table>
  </div>
 </div>
  <button class="btn btn-success btn-sm my-3" onclick="cbrexportToExcel()">Export to Excel</button>
</div>
<!-- </div> -->
</form>
</div>
</div>


           <div id="container_3" style="display: none;">
            <div class="modal-body">
             <form>                 
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="report_type"><b>Report Type:</b></label>               
                <select id="report_type" class="form-control form-control-sm">
                <option value="">Select</option>
                <option value="">Summary</option>
                <option value="">Detail</option>                               
                </select>
               </div>
               
               <div class="form-group col-md-3">
                <label for="sale_order"><b>Sale Order:</b></label>               
                <select id="sale_order" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
               
               <div class="form-group col-md-3">
                <label for="scrap_type"><b>Scrap Type:</b></label>               
                <select id="scrap_type" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
               
               <div class="form-group col-md-3">
                <label for="scrap_type_items"><b>Scrap Type Items:</b></label>               
                <select id="scrap_type_items" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
               
               <div class="form-group col-md-3">
                <label for="location_type"><b>Location Type:</b></label>               
                <select id="location_type" class="form-control form-control-sm">
                <option value="">Select</option>                               
                </select>
               </div>
               
               <div class="form-group col-md-3">
                <label for="date"><b>From Date:</b></label>
                <input type="date" class="form-control form-control-sm" id="from_date" placeholder="From Date">
               </div>
                            
               
               <div class="form-group col-md-3" >
                 <label for="todate"><b>To Date:</b></label>
                 <input type="date" class="form-control form-control-sm" id="to_date" placeholder="To Date">
               </div>                                    
                                                       
              </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="container_1" style="display: none;"> 
<div class="container container-report mt-4">
  <h5 class="text-center report-header">Summary Of Sale Order</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="TableIDD">
      <thead>
        <tr>
          <th>SL.NO</th>
          <th>Sale Order No</th>
          <th>Sale Order Date</th>
          <th>Scrap Type</th>
          <th>Scrap Item</th>         
          <th>Location From	</th>
          <th>UOM</th>
          <th>Ordered Quantity</th>
          <th>Sold Quantity</th>
          <th>Balance Quantity</th>         
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


<div id="container_2" style="display: none;">
<div class="container container-report mt-4">
  <h5 class="text-center report-header">Sale Order Details</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="Table_1">
      <thead>
        <tr>
          <th>SL.NO</th>
          <th>Sale Order No</th>
          <th>Sale Order Date</th>
          <th>Scrap Type</th>
          <th>Scrap Item</th>         
          <th>Location From	</th>
          <th>UOM</th>
          <th>Quantity</th>
          <th>Kgs</th>
          <th>Unit Price</th>
          <th>Total Price</th>
          <th>View Shipped Details</th>                  
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- Insert actual values here -->
          <td>1</td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td><a href="javascript:void(0);" class="btn btn-success btn-sm my-3" id="view">View</a></td>                  
        </tr>
      </tbody>
    </table>
  </div>
 </div>
  <button class="btn btn-success btn-sm my-3" onclick="exportToExcel()">Export to Excel</button>
</div>
</div>


<div id="container_5" style="display: none;">
<div class="container container-report mt-4">
  <h5 class="text-center report-header">Sale Order Transaction Details</h5>
 <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-bordered table-sm" id="Table_2">
      <thead>
        <tr>
          <th>SL.NO</th>
          <th>Sale Order No</th>
          <th>Transaction Date</th>
          <th>Transporter Name</th>
          <th>Invoice No</th>
          <th>Invoice Date</th>
          <th>Scrap Type</th>         
          <th>Scrap Item</th>
          <th>Location From</th>
          <th>Weigh Bridge Bill No</th>
          <th>Vehicle No</th>         
          <th>Quantity</th>
          <th>Price</th>                  
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- Insert actual values here -->
          <td>1</td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td>                  
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
</div>
</div>
</div> 
</div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.20.3/xlsx.full.min.js"></script>

<script>
function toggleReportContainer() {

    const type = document.getElementById("type1").value;
    const contract = document.getElementById("contract2").value;
    const report = document.getElementById("reportContainer");

    if (type && contract) {
        report.style.display = "block";
    } else {
        report.style.display = "none";
    }
}

document.getElementById("type1").addEventListener("change", toggleReportContainer);
document.getElementById("contract2").addEventListener("change", toggleReportContainer);
</script>

<!-- <script>
 function exportToExcelInvoice() {
  var table = document.getElementById("Table_ID");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Invoice Report"});
  XLSX.writeFile(workbook, 'Invoice_Report.xlsx');
 }
</script> -->

<script>
 function exportToExcel() {
  var table = document.getElementById("Table");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "GST Report"});
  XLSX.writeFile(workbook, 'GST_Report.xlsx');									
 }
</script>

<script>
 function exportToExcel() {
  var table = document.getElementById("Table1");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Report"});
  XLSX.writeFile(workbook, '
		  Report.xlsx');
 }
</script>

<script>
 function exportToExcel() {
  var table = document.getElementById("TableID1");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Summary Report"});
  XLSX.writeFile(workbook, 'Summary_Report.xlsx');
 }
</script>

<script>
 function cbrexportToExcel() {
  var table = document.getElementById("Table2");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Current Balance Report"});
  XLSX.writeFile(workbook, 'Current_Balance_Report.xlsx');
 }
</script>

<script>
 function exportToExcel() {
  var table = document.getElementById("TableIDD");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Summary Of Sale Order"});
  XLSX.writeFile(workbook, 'Summary_Of_Sale_Order.xlsx');
 }
</script>

<script>
 function exportToExcel() {
  var table = document.getElementById("Table_1");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Sale Order Details"});
  XLSX.writeFile(workbook, 'Sale_Order_Details.xlsx');
 }
</script>

<script>
 function exportToExcel() {
  var table = document.getElementById("Table_2");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Sale Order Transaction Details"});
  XLSX.writeFile(workbook, 'Sale_Order_Transaction_Details.xlsx');
 }
</script>

<script>
document.addEventListener("DOMContentLoaded", function () {
    const fromDate = document.getElementById("date");
    const toDate = document.getElementById("todate");
    const reportContainer = document.getElementById("container1");

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
document.addEventListener("DOMContentLoaded", function () {
    const fromDate = document.getElementById("from");
    const toDate = document.getElementById("to");
    const reportContainer = document.getElementById("container2");

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
document.addEventListener("DOMContentLoaded", function () {
    const fromDate = document.getElementById("fromdate");
    const toDate = document.getElementById("Todate");
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
document.addEventListener("DOMContentLoaded", function () {
    const fromDate = document.getElementById("fromdate1");
    const toDate = document.getElementById("todate1");
    const reportContainer = document.getElementById("container4");

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

<!-- <script>
 function toggleTables() {
    // Hide all containers initially
    const allContainers = ['container6', 'container7', 'container8', 'container9', 'container10', 'container_3'];
    allContainers.forEach(containerId => {
        document.getElementById(containerId).style.display = 'none';
    });

    // Determine which radio button is selected
    const selectedValue = document.querySelector('input[name="invoiceSelection"]:checked').value;

    // Show the corresponding container based on the selected value
    switch (selectedValue) {
        case 'invoice':
            document.getElementById('container6').style.display = 'block';
            break;
        case 'gst':
            document.getElementById('container7').style.display = 'block';
            break;
        case 'report':
            document.getElementById('container8').style.display = 'block';
            break;
        case 'summary':
            document.getElementById('container9').style.display = 'block';
            break;
        case 'balance':
            document.getElementById('container10').style.display = 'block';
            break;
        case 'sale':
            document.getElementById('container_3').style.display = 'block';
            break;    
    }
}
</script> -->

<script>
function toggleTables(activeTab) {

    // Hide all containers first
    const containers = {
        invoice: ['container6'],
        balance: ['container10'],
        saleorder: ['container_3']
    };

    // Hide every container
    Object.values(containers).flat().forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Show only containers related to clicked tab
    if (containers[activeTab]) {
        containers[activeTab].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'block';
        });
    }
}
</script>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const reportTypeSelect = document.getElementById('report_type');
    const container1 = document.getElementById('container_1');
    const container2 = document.getElementById('container_2');

    reportTypeSelect.addEventListener('change', function () {
        const selectedOptionText = this.options[this.selectedIndex].text;

        // Hide both containers initially
        container1.style.display = 'none';
        container2.style.display = 'none';

        if (selectedOptionText === 'Summary') {
            container1.style.display = 'block';
        } else if (selectedOptionText === 'Detail') {
            container2.style.display = 'block';
        }
    });
});
</script>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const viewBtn = document.getElementById('view');
    const container = document.getElementById('container_5');

    // Show the container when the View button is clicked
    viewBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent click from bubbling to document
        container.style.display = 'block';
    });

    // Prevent clicks inside the container from closing it
    container.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    // Hide the container when clicking anywhere else
    document.addEventListener('click', function () {
        container.style.display = 'none';
    });
});
</script>

<!-- <script>
window.onload = function () {
	fetchInvoiceReport();  
	};
</script> -->

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
    <script src="js/invoicereport.js?v=<%=ts%>"></script>
     <script src="js/username.js"></script>
     <script src="js/logout.js"></script>
      <script src="js/createdby.js"></script>
 	<script src="js/modifiedby.js"></script>
 	<script src="js/factoryid.js"></script>
</body>
</html>