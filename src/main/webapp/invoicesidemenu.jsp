<%-- <%@page import="com.JSSL2024.property.PropertyLink"%> --%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
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
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css" />
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
  <link href="css/ruang-admin.min.css" rel="stylesheet" />
  <link href="vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">
  
    <link rel="stylesheet" href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css">
  <link rel="stylesheet" href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />

      
    <script src="js/sidebar.js"></script>
  <style>
           .error-message {
        color: red;
        display: none;
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
.small-input {
    width: 120px;  /* Adjust width as needed */
    height: 30px;  /* Adjust height as needed */
    padding: 2px;
    font-size: 12px;
}

.small-label {
    font-size: 15px;
    display: block;
    margin-bottom: 2px;
}
.small-input1 {
    width: 215px;  /* Adjust width as needed */
    height: 30px;  /* Adjust height as needed */
    padding: 2px;
    font-size: 12px;
}

.small-label1 {
    font-size: 15px;
    display: block;
    margin-bottom: 2px;
}
.pdf-loader {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(3px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  animation: fadeIn 0.2s ease-out;
}

.loader-card {
  background: #ffffff;
  padding: 28px 36px;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  text-align: center;
  font-family: "Segoe UI", Arial, sans-serif;
  min-width: 220px;
}

.spinner {
  width: 200px;
  height: 200px;
  border: 10px solid #e5e5e5;
  border-top: 10px solid #111;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto 14px auto;
}

.loader-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* animated dots */
.dots::after {
  content: "";
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0% { content: ""; }
  25% { content: "."; }
  50% { content: ".."; }
  75% { content: "..."; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}


</style>
     <script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>

  <script type="text/javascript">
 function noBack() {
     window.history.forward();
 }
 </script>
</head>

<body onload="fetchCont();">
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
				             <span class="ml-2 d-none d-lg-inline text-white small" id="selectedFactoryId">No Factory Selected</span>
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
            <h1 class="h3 mb-0 text-gray-800">Steel Invoice List</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="InvoiceDashBoard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="sidemenusteel.jsp">Steel Page</a></li>
              <li class="breadcrumb-item active" aria-current="page">Invoice</li>
              
            </ol>
          </div>
         <div class="row mb-3">
         <button  data-toggle="modal"
                    id="#modalScroll"><i class="fas fa-plus"  ></i> Create</button>
                    
                    <!-- <button  data-toggle="modal"
                    data-target="#exampleModalScrollableVV" id="#modalScroll"><i class="fas fa-plus"></i> Create</button> -->
    <div class="table-responsive p-3">
 <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
        </table>
    </div>
</div>
 </div>
  </div>
  </div>

<div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Create Steel Invoice</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <!-- Sale Order Details -->
                    <div class="form-row">
    <div class="form-group col-md-4">
        <label for="scrapSaleOrder"><b>Contractor:</b></label>
        <select class="form-control form-control-sm" id="cont">
            </select>
         </div>
         <div class="form-group col-md-4">
        <label for="scrapSaleOrder"><b>Load:</b></label>
        <select class="form-control form-control-sm" id="load">
            </select>
         </div>
    </div>
<div id="inputFieldsContainer" style="display:none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        
        <div class="form-row dynamic-row">
           
        </div>
         <div id="serviceCodeError" class="error-message"></div>
    </div>
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Tax Details</h5>
        
        <div class="form-row dynamic-row1">
        <!-- Tax Name -->
  </div>
<div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Freight:</b></label>
        <input type="text" class="form-control form-control-sm" id="freight" readonly>
         </div>
            <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Invoice Type:</b></label>
        <select class="form-control form-control-sm" id="intype444">
            </select>
            <div id="Vehicleerror" class="error-message"></div>
         </div>
         <div class="form-group col-md-3 col-sm-12">
        <label for="field4"><b>Supply of Place:</b></label>
        <input type="text" class="form-control form-control-sm" id="sup">
        </div>
         <div class="form-group col-md-3">
        <label for="totalso"><b>Grand Total:</b></label>
        <input type="text" class="form-control form-control-sm" id="ingrandv" readonly>
    </div>
    <div class="form-group col-md-3" style="display:none;">
        <label for="id"><b>Id:</b></label>
        <input type="text" class="form-control form-control-sm" id="id11">
    </div>
    <div class="form-group col-md-3" style="display:none;">
        <label for="id"><b>Idcon:</b></label>
        <input type="text" class="form-control form-control-sm" id="id11con">
    </div>
    </div>
            <!-- NEW: Subcontracting-only fields, hidden by default -->
    <div class="form-row dynamic-row" id="subcontractingFields" style="display:none;">
        <div class="form-group col-md-3">
            <label for="vendorname"><b>Vendor Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="vendorname">
        </div>
        <div class="form-group col-md-3">
            <label for="vendorinvno"><b>Vendor Invoice No:</b></label>
            <input type="text" class="form-control form-control-sm" id="vendorinvno">
        </div>
        <div class="form-group col-md-3">
            <label for="vendorqty"><b>Vendor Qty:</b></label>
            <input type="text" class="form-control form-control-sm" id="vendorqty">
        </div>
       <div class="form-group col-md-3">
           <label for="vendordate"><b>Vendor Date:</b></label>
           <input type="date" class="form-control form-control-sm" id="vendordate" max="">
     </div>
    </div>
    </div>
 </div>
 <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Contract Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <!-- <div class="form-group col-md-3 col-sm-12">
                <label for="scrapType"><b>Business Unit:</b></label>
                <input type="text" class="form-control form-control-sm" id="inbusunit">
            </div> -->
            <div class="form-group col-md-3 col-sm-12">
              <label for="scrapType"><b>Business Unit:</b></label>
              <select class="form-control form-control-sm" id="inbusunit">
              </select>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="scrapType"><b>Invoice Type Calculation:</b></label>
              <!--   <input type="text" class="form-control form-control-sm" id="intypecal" readonly> -->
              <select class="form-control form-control-sm" id="intypecal" disabled>
             <option value="2">Percentage</option>
            </select>
                
            </div>
            <!-- <div class="form-group col-md-3 col-sm-12">
                <label for="uom"><b>Invoice To:</b></label>
                <input type="text" class="form-control form-control-sm" id="ininto">
            </div> -->
            <div class="form-group col-md-3 col-sm-12">
              <label for="uom"><b>Invoice To:</b></label>
              <select class="form-control form-control-sm" id="ininto">
              </select>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="uom"><b>Product Description:</b></label>
               <!--  <input type="text" class="form-control form-control-sm" id="prodesc" readonly> -->
               <select class="form-control form-control-sm" id="prodesc" disabled=>
             <option value="1">Product decs</option>
            </select>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="kgsMt"><b>Shipment Mode</b></label>
                <input type="text" class="form-control form-control-sm" id="shipmode" readonly>
                </div>
            <!-- Unit Price Input -->
            <!-- <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Work Order:</b></label>
                <input type="text" class="form-control form-control-sm" id="work">
                </div> -->
                <div class="form-group col-md-3 col-sm-12">
                 <label for="unitPrice"><b>Work Order:</b></label>
                 <select class="form-control form-control-sm" id="work">
                 </select>
                </div>       
                <!-- <div class="form-group col-md-3 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>Service Code:</b></label>
                <input type="text" class="form-control form-control-sm" id="service" readonly>
                </div> -->
                <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Export:</b></label>
                <input type="text" class="form-control form-control-sm" id="expt" readonly>
                </div>
                <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Tax is payable on reverse charges:</b></label>
                <!-- <input type="text" class="form-control form-control-sm" id="taxres" readonly> -->
                <select class="form-control form-control-sm" id="taxres" disabled>
              	<option value="0">No</option>
                <option value="1">Yes</option>
            </select>
                </div>
                <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Percentage(%):</b></label>
                <input type="text" class="form-control form-control-sm" id="percen">
                </div>
            <!-- <div class="form-group col-md-3 col-sm-12">
            <label for="totalor"><b>Name & Address of Consignee:</b></label>
            <input type="text" class="form-control form-control-sm" id="billing">
        </div> -->
        <div class="form-group col-md-3 col-sm-12">
         <label for="totalor"><b>Name & Address of Consignee:</b></label>
         <select class="form-control form-control-sm" id="billing">
         </select>
        </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Bank Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="bank" readonly>
                </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Delivery Condition:</b></label>
            <input type="text" class="form-control form-control-sm" id="delivery" readonly>
                </div>
         <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Registered Office:</b></label>
            <input type="text" class="form-control form-control-sm" id="office" readonly>
                </div>
                <!-- <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Service Code:</b></label>
            <input type="text" class="form-control form-control-sm" id="officeservice" readonly>
                </div>
                <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>HSN Code:</b></label>
            <input type="text" class="form-control form-control-sm" id="officehsn" readonly>
                </div> -->
                <!-- <div class="form-group col-md-3 col-sm-12" style="display:none;">
            <label for="totalso"><b>HSN Code:</b></label>
            <input type="text" class="form-control form-control-sm" id="hsncode" readonly>
                </div> -->
        </div>
    </div>
    <div id="exportFields1" style="display: none;">
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <div class="form-row dynamic-row">
    <div class="form-group col-md-3 col-sm-12">
        <label for="are"><b>AREA Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="are" readonly>
        </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="lut"><b>LOT Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="lut" readonly>
        </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="connum"><b>Container Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="connum" readonly>
        </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="epog"><b>EPCG License No:</b></label>
        <input type="text" class="form-control form-control-sm" id="epog" readonly>
         </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="epog"><b>Export Title Text:</b></label>
        <input type="text" class="form-control form-control-sm" id="exptitle" readonly>
        </div>
</div>  
</div>
</div>
    <button type="button" class="btn btn-sm btn-primary" id="toggleFields" style="margin-top: 1%;background-color: white;color: black;border-color: white;">
    <i class="fas fa-chevron-down"></i>&nbsp;&nbsp;Export Details
   </button>
   <!-- Hidden Extra Fields -->
<div id="extraFields" style="display: none;">
 <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Export Details</h5>
        <div class="form-row dynamic-row">
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="field1"><b>Date of Notification:</b></label>
            <input type="date" class="form-control form-control-sm" id="date" autocomplete="off">
        </div>
        <div class="form-group col-md-3">
            <label for="field2"><b>Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="date1" autocomplete="off">
        </div>
        <div class="form-group col-md-3">
            <label for="field3"><b>BG Type</b></label>
            <select class="form-control form-control-sm" id="bg"></select>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Date of Issue:</b></label>
            <input type="date" class="form-control form-control-sm" id="dissue" autocomplete="off">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Reference No:</b></label>
            <input type="text" class="form-control form-control-sm" id="ref" autocomplete="off">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>LC Number:</b></label>
            <input type="text" class="form-control form-control-sm" id="lc" autocomplete="off">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>S.T.Exempted under:</b></label>
            <input type="text" class="form-control form-control-sm" id="exe" autocomplete="off">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>LR.Docket No:</b></label>
            <input type="text" class="form-control form-control-sm" id="dock" autocomplete="off">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>BG No:</b></label>
            <input type="text" class="form-control form-control-sm" id="bgno" autocomplete="off">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Date of expiry:</b></label>
            <input type="date" class="form-control form-control-sm" id="dateexp" autocomplete="off">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Date of Ref:</b></label>
            <input type="date" class="form-control form-control-sm" id="dateref" autocomplete="off">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>LC Issue Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="lcdate" autocomplete="off">
        </div>
    </div>
</div>
</div>
</div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Product Description:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="prodes" autocomplete="off">
            <div id="productCodeError3" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remark" autocomplete="off">
            <div id="productCodeError4" class="error-message"></div>
        </div>
     </div>
</div>
                     <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-sm btn-primary" onclick="openModalAdd();">Create</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</div>
<div class="modal fade" id="exampleModalCenter66" tabindex="-1"
			role="dialog" aria-labelledby="exampleModalCenterTitle"
			aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content"
					style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
					<div class="modal-header1">
						<!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> -->
						<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
					</div>
					<div class="modal-body">
						<b>Are you sure you want to create Steel Invoice?</b>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>
						<button type="button" class="btn btn-info btn-sm"
							onclick="addevent()">YES</button>
					</div>
				</div>
			</div>
		</div>
					<div class="modal fade" id="exampleModalCenter16" tabindex="-1"
			role="dialog" aria-labelledby="exampleModalCenterTitle"
			aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content"
					style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
					<div class="modal-header1">
						<!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> -->
						<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
					</div>
					<div class="modal-body">
						<b>Are you sure you want to Cancel Steel Invoice?</b>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>
						<button type="button" class="btn btn-info btn-sm"
							onclick="cancelRecord()">YES</button>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="exampleModalCenterDup" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 70%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                   <!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> --> 
                   <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
                 </div>
                <div class="modal-body">
                  <b id="errorMessage"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">OK</button> 
                </div>
              </div>
            </div>
          </div>
 
 <div class="modal fade" id="exampleModalScrollableVerify" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Verify Steel Invoice</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <div id="inputFieldsContainerVerify">
                            <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Contract:</b></label>
        <input type="text" class="form-control form-control-sm" id="vcontract11up" readonly>
         </div>
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        
        <div class="form-row dynamic-row11">
           
        </div>
        <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Freight:</b></label>
        <input type="text" class="form-control form-control-sm" id="vfreight11" readonly>
         </div>
         <div class="form-group col-md-3">
        <label for="totalso"><b>Tax Inclusive/Exclusive:</b></label>
       <!--  <input type="text" class="form-control form-control-sm" id="vingrandv" readonly> -->
                <select class="form-control form-control-sm" id="vingrandv" disabled>
              <option value="0">No</option>
                <option value="1">Yes</option>
            </select>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b> Fright Advance recovery:</b></label>
        <!-- <input type="text" class="form-control form-control-sm" id="advF" readonly> -->
        <select class="form-control form-control-sm" id="advF" disabled>
              <option value="0">No</option>
                <option value="1">Yes</option>
            </select>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Advance recovery(Taxable):</b></label>
        <input type="text" class="form-control form-control-sm" id="advA" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Advance recovery(Non Taxable):</b></label>
        <input type="text" class="form-control form-control-sm" id="advan" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Basic Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="bvaue" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Payable to dept:</b></label>
        <input type="text" class="form-control form-control-sm" id="pdptv" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Payable by customer:</b></label>
        <input type="text" class="form-control form-control-sm" id="pdptcv" readonly>
    </div>
    </div>
    </div>
    </div>
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Tax Details</h5>
        
        <div class="form-row dynamic-row122">
        <!-- Tax Name -->
  </div>
  <!-- <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;"> -->
        <div class="form-row dynamic-row">
            <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Grand Total:</b></label>
        <input type="text" class="form-control form-control-sm" id="grandv" readonly>
         </div>
          <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Invoice Type:</b></label>
           <input type="text" class="form-control form-control-sm" id="vintypeedityww" readonly>
         </div>
         <div class="form-group col-md-3">
            <label for="field4"><b>Supply of Place:</b></label>
            <input type="text" class="form-control form-control-sm" id="supv" readonly>
        </div>
        <!-- NEW: Subcontracting-only fields, read-only -->
<div class="form-row dynamic-row" id="subcontractingFieldsVerify" style="display:none;">
    <div class="form-group col-md-3">
        <label for="vendornamev"><b>Vendor Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendornamev" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="vendorinvnov"><b>Vendor Invoice No:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorinvnov" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="vendorqtyv"><b>Vendor Qty:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorqtyv" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="vendordatev"><b>Vendor Date:</b></label>
        <input type="date" class="form-control form-control-sm" id="vendordatev" readonly>
    </div>
</div>
         <div class="form-group col-md-3" style="display:none;">
        <label for="scrapSaleOrder"><b>VID:</b></label>
        <input type="text" class="form-control form-control-sm" id="vidverify">
         </div>
         <div class="form-group col-md-3" style="display:none;">
        <label for="scrapSaleOrder"><b>PNID:</b></label>
        <input type="text" class="form-control form-control-sm" id="pnverifyww">
         </div>
         </div>
 <!--    </div> -->
 </div>
 <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Contract Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-3 col-sm-12">
                <label for="scrapType"><b>Business Unit:</b></label>
                <input type="text" class="form-control form-control-sm" id="bunitv" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="scrapType"><b>Invoice Type Calculation:</b></label>
                <!-- <input type="text" class="form-control form-control-sm" id="intypev" readonly> -->
                <select class="form-control form-control-sm" id="intypev" disabled>
                <option value="2">Percentage</option>
            </select>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="uom"><b>Invoice TO:</b></label>
                <input type="text" class="form-control form-control-sm" id="intov" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="uom"><b>Product Description:</b></label>
                <!-- <input type="text" class="form-control form-control-sm" id="prodesv" readonly> -->
                <select class="form-control form-control-sm" id="prodesv" disabled>
            <option value="1">Product decs</option>
            </select>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="kgsMt"><b>Shipment Mode</b></label>
                <input type="text" class="form-control form-control-sm" id="shipmodev" readonly>
                </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Work Order:</b></label>
                <input type="text" class="form-control form-control-sm" id="workorderv" readonly>
                </div>
                <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Export:</b></label>
                <input type="text" class="form-control form-control-sm" id="exptv" readonly>
                </div>
                <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Tax is payable on reverse charges:</b></label>
                <!-- <input type="text" class="form-control form-control-sm" id="taxresv" readonly> -->
                <select class="form-control form-control-sm" id="taxresv" disabled>
              <option value="0">No</option>
                <option value="1">Yes</option>
            </select>
                </div>
                <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Percentage(%):</b></label>
                <input type="text" class="form-control form-control-sm" id="percenv" readonly>
                </div>
            <div class="form-group col-md-3 col-sm-12">
            <label for="totalor"><b>Name & Address of Consignee:</b></label>
            <input type="text" class="form-control form-control-sm" id="nandconv" readonly>
        </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Bank Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="banknamev" readonly>
                </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Delivery Condition:</b></label>
            <input type="text" class="form-control form-control-sm" id="deliveryconv" readonly>
                </div>
         <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Registered Office::</b></label>
            <input type="text" class="form-control form-control-sm" id="officevv" readonly>
                </div>
          <!--      <div class="form-group col-md-3 col-sm-12">
        <label for="epog"><b>Service Code:</b></label>
        <input type="text" class="form-control form-control-sm" id="newscode2" readonly>
        </div>
        <div class="form-group col-md-3 col-sm-12">
        <label for="epog"><b>HSN COde:</b></label>
        <input type="text" class="form-control form-control-sm" id="newhcode2" readonly>
        </div>  -->
            </div>
    </div>
    <div id="exportFields1verify" style="display: none;">
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <div class="form-row dynamic-row">
    <div class="form-group col-md-3 col-sm-12">
        <label for="are"><b>AREA Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="arev" readonly>
        </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="lut"><b>LOT Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="lutv" readonly>
        </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="connum"><b>Container Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="connumv" readonly>
        </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="epog"><b>EPCG License No:</b></label>
        <input type="text" class="form-control form-control-sm" id="epogv" readonly>
         </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="epog"><b>Export Title Text:</b></label>
        <input type="text" class="form-control form-control-sm" id="exptitlev" readonly>
        </div>
        
</div>  
</div>
</div>
    <button type="button" class="btn btn-sm btn-primary" id="toggleFieldsVerify" style="margin-top: 1%;background-color: white;color: black;border-color: white;">
    <i class="fas fa-chevron-down"></i>&nbsp;&nbsp;Export Details
   </button>
   <!-- Hidden Extra Fields -->
<div id="extraFieldsVerify" style="display: none;">
 <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Export Details</h5>
        <div class="form-row dynamic-row">
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="field1"><b>Date of Notification:</b></label>
            <input type="date" class="form-control form-control-sm" id="datev" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field2"><b>Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="date1v" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field3"><b>BG Type</b></label>
            <input type="text" class="form-control form-control-sm" id="bgvaerify" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Date of Issue:</b></label>
            <input type="date" class="form-control form-control-sm" id="dissuev" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Reference No:</b></label>
            <input type="text" class="form-control form-control-sm" id="refv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>LC Number:</b></label>
            <input type="text" class="form-control form-control-sm" id="lcv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>S.T.Exempted under:</b></label>
            <input type="text" class="form-control form-control-sm" id="exev" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>LR.Docket No:</b></label>
            <input type="text" class="form-control form-control-sm" id="dockv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>BG No:</b></label>
            <input type="text" class="form-control form-control-sm" id="bgnov" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Date of expiry:</b></label>
            <input type="date" class="form-control form-control-sm" id="dateexpv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Date of Ref:</b></label>
            <input type="date" class="form-control form-control-sm" id="daterefv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>LC Issue Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="lcdatev" readonly>
        </div>
    </div>
</div>
</div>
</div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Product Description:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="prodesv11" readonly>
            </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remarkv" readonly>
            </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Remarks for GST Tax:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remarkvvei" autocomplete="off">
            <div id="gstem" class="error-message"></div>
            </div>
     </div>
</div>
                     <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-sm btn-primary" onclick="openModalVerify();">Verify</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="exampleModalCenter66Verify" tabindex="-1"
			role="dialog" aria-labelledby="exampleModalCenterTitle"
			aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content"
					style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
					<div class="modal-header1">
						<!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> -->
						<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
					</div>
					<div class="modal-body">
						<b>Are you sure you want to Verify Steel Invoice?</b>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>
						<button type="button" class="btn btn-info btn-sm"
							onclick="addeventVerify()">YES</button>
					</div>
				</div>
			</div>
		</div>
		
		<div class="modal fade" id="exampleModalCenterDup" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 70%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                   <!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> --> 
                   <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
                 </div>
                <div class="modal-body">
                  <b id="errorMessage"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">OK</button> 
                </div>
              </div>
            </div>
          </div>
		
<div class="modal fade" id="exampleModalScrollableVerified" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Verified Steel Invoice</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <div id="inputFieldsContainerVerify">
                            <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Contract:</b></label>
        <input type="text" class="form-control form-control-sm" id="vcontract11vv" readonly>
         </div>
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        
        <div class="form-row dynamic-row11test">
           
        </div>
        <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Freight:</b></label>
        <input type="text" class="form-control form-control-sm" id="vfreight11v" readonly>
         </div>
         <div class="form-group col-md-3">
        <label for="totalso"><b>Tax Inclusive/Exclusive:</b></label>
       <!--  <input type="text" class="form-control form-control-sm" id="vingrandvv" readonly> -->
        <select class="form-control form-control-sm" id="vingrandvv" disabled>
              <option value="0">No</option>
                <option value="1">Yes</option>
            </select>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b> Fright Advance recovery:</b></label>
        <!-- <input type="text" class="form-control form-control-sm" id="advFv" readonly> -->
        <select class="form-control form-control-sm" id="advFv" disabled>
              <option value="0">No</option>
                <option value="1">Yes</option>
            </select>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Advance recovery(Taxable):</b></label>
        <input type="text" class="form-control form-control-sm" id="advAv" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Advance recovery(Non Taxable):</b></label>
        <input type="text" class="form-control form-control-sm" id="advanv" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Basic Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="bvauev" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Payable to dept:</b></label>
        <input type="text" class="form-control form-control-sm" id="pdptvv" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Payable by customer:</b></label>
        <input type="text" class="form-control form-control-sm" id="pdptcvv" readonly>
    </div>
    </div>
    </div>
    </div>
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Tax Details</h5>
        
        <div class="form-row dynamic-row122test">
        <!-- Tax Name -->
  </div>
  <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <div class="form-row dynamic-row">
            <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Grand Total:</b></label>
        <input type="text" class="form-control form-control-sm" id="grandvv" readonly>
         </div>
         <div class="form-group col-md-3">
            <label for="field4"><b>Supply of Place:</b></label>
            <input type="text" class="form-control form-control-sm" id="supvv" readonly>
        </div>
        <!-- NEW: Subcontracting-only fields, read-only -->
<div class="form-row dynamic-row" id="subcontractingFieldsView" style="display:none;">
    <div class="form-group col-md-3">
        <label for="vendornamevv"><b>Vendor Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendornamevv" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="vendorinvnovv"><b>Vendor Invoice No:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorinvnovv" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="vendorqtyvv"><b>Vendor Qty:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorqtyvv" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="vendordatevv"><b>Vendor Date:</b></label>
        <input type="date" class="form-control form-control-sm" id="vendordatevv" readonly>
    </div>
</div>
         <div class="form-group col-md-3" style="display:none;">
        <label for="scrapSaleOrder"><b>VID:</b></label>
        <input type="text" class="form-control form-control-sm" id="vidverifyv">
         </div>
         <div class="form-group col-md-3" style="display:none;">
        <label for="scrapSaleOrder"><b>PNID:</b></label>
        <input type="text" class="form-control form-control-sm" id="pnverifywwv">
         </div>
         </div>
    </div>
 </div>
 <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Contract Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-3 col-sm-12">
                <label for="scrapType"><b>Business Unit:</b></label>
                <input type="text" class="form-control form-control-sm" id="bunitvv" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="scrapType"><b>Invoice Type Calculation:</b></label>
                <!-- <input type="text" class="form-control form-control-sm" id="intypevv" readonly> -->
                <select class="form-control form-control-sm" id="intypevv" disabled>
             <option value="2">Percentage</option>
            </select>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="uom"><b>Invoice To:</b></label>
                <input type="text" class="form-control form-control-sm" id="intovv" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="uom"><b>Product Description:</b></label>
                <!-- <input type="text" class="form-control form-control-sm" id="prodesvv" readonly> -->
                <select class="form-control form-control-sm" id="prodesvv" disabled>
          <option value="1">Product decs</option>
            </select>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="kgsMt"><b>Shipment Mode</b></label>
                <input type="text" class="form-control form-control-sm" id="shipmodevv" readonly>
                </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Work Order:</b></label>
                <input type="text" class="form-control form-control-sm" id="workordervv" readonly>
                </div>
                <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Export:</b></label>
                <input type="text" class="form-control form-control-sm" id="exptvv" readonly>
                </div>
                <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Tax is payable on reverse charges:</b></label>
                <!-- <input type="text" class="form-control form-control-sm" id="taxresvv" readonly> -->
                <select class="form-control form-control-sm" id="taxresvv" disabled>
              	<option value="0">No</option>
                <option value="1">Yes</option>
            </select>
                </div>
                <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Percentage(%):</b></label>
                <input type="text" class="form-control form-control-sm" id="percenvv" readonly>
                </div>
            <div class="form-group col-md-3 col-sm-12">
            <label for="totalor"><b>Name & Address of Consignee:</b></label>
            <input type="text" class="form-control form-control-sm" id="nandconvv" readonly>
        </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Bank Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="banknamevv" readonly>
                </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Delivery Condition:</b></label>
            <input type="text" class="form-control form-control-sm" id="deliveryconvv" readonly>
                </div>
         <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Registered Office::</b></label>
            <input type="text" class="form-control form-control-sm" id="officevvv" readonly>
                </div>
        <!--  <div class="form-group col-md-3 col-sm-12">
        <label for="epog"><b>Service Code:</b></label>
        <input type="text" class="form-control form-control-sm" id="newscode1" readonly>
        </div>
        <div class="form-group col-md-3 col-sm-12">
        <label for="epog"><b>HSN COde:</b></label>
        <input type="text" class="form-control form-control-sm" id="newhcode1" readonly>
        </div> -->
            </div>
    </div>
    <div id="exportFields1verified" style="display: none;">
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <div class="form-row dynamic-row">
    <div class="form-group col-md-3 col-sm-12">
        <label for="are"><b>AREA Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="arevv" readonly>
        </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="lut"><b>LOT Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="lutvv" readonly>
        </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="connum"><b>Container Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="connumvv" readonly>
        </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="epog"><b>EPCG License No:</b></label>
        <input type="text" class="form-control form-control-sm" id="epogvv" readonly>
         </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="epog"><b>Export Title Text:</b></label>
        <input type="text" class="form-control form-control-sm" id="exptitlevv" readonly>
        </div>
</div>  
</div>
</div>
    <button type="button" class="btn btn-sm btn-primary" id="toggleFieldsVerified" style="margin-top: 1%;background-color: white;color: black;border-color: white;">
    <i class="fas fa-chevron-down"></i>&nbsp;&nbsp;Export Details
   </button>
   <!-- Hidden Extra Fields -->
<div id="extraFieldsVerified" style="display: none;">
 <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Export Details</h5>
        <div class="form-row dynamic-row">
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="field1"><b>Date of Notification:</b></label>
            <input type="date" class="form-control form-control-sm" id="datevv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field2"><b>Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="date1vv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field3"><b>BG Type</b></label>
            <input type="text" class="form-control form-control-sm" id="bgvaerifyv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Date of Issue:</b></label>
            <input type="date" class="form-control form-control-sm" id="dissuevv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Reference No:</b></label>
            <input type="text" class="form-control form-control-sm" id="refvv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>LC Number:</b></label>
            <input type="text" class="form-control form-control-sm" id="lcvv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>S.T.Exempted under:</b></label>
            <input type="text" class="form-control form-control-sm" id="exevv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>LR.Docket No:</b></label>
            <input type="text" class="form-control form-control-sm" id="dockvv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>BG No:</b></label>
            <input type="text" class="form-control form-control-sm" id="bgnovv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Date of expiry:</b></label>
            <input type="date" class="form-control form-control-sm" id="dateexpvv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Date of Ref:</b></label>
            <input type="date" class="form-control form-control-sm" id="daterefvv" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>LC Issue Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="lcdatevv" readonly>
        </div>
    </div>
</div>
</div>
</div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Product Description:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="prodesv11v" readonly>
            </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remarkvvtest" readonly>
            </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Remarks for GST Tax:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remarkvvvtest" readonly>
            <div id="gstem" class="error-message"></div>
            </div>
     </div>
</div>
                     <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="exampleModalScrollableEditUp" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Update Steel Invoice</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <div id="inputFieldsContainerVerifyup">
                    
                      <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Contract:</b></label>
        <input type="text" class="form-control form-control-sm" id="contract11up" readonly>
         </div>
       
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
       
        <div class="form-row dynamic-row11uptest">
           
        </div>
        <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Freight:</b></label>
        <input type="text" class="form-control form-control-sm" id="vfreight11up" readonly>
         </div>
         <div class="form-group col-md-3">
        <label for="totalso"><b>Tax Inclusive/Exclusive:</b></label>
       <!--  <input type="text" class="form-control form-control-sm" id="vingrandvup" readonly> -->
            <select class="form-control form-control-sm" id="vingrandvup" disabled>
              <option value="0">No</option>
                <option value="1">Yes</option>
            </select>
        
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b> Fright Advance recovery:</b></label>
       <!--  <input type="text" class="form-control form-control-sm" id="advFup" readonly> -->
        <select class="form-control form-control-sm" id="advFup" disabled>
              <option value="0">No</option>
                <option value="1">Yes</option>
            </select>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Advance recovery(Taxable):</b></label>
        <input type="text" class="form-control form-control-sm" id="advAup" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Advance recovery(Non Taxable):</b></label>
        <input type="text" class="form-control form-control-sm" id="advanup" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Basic Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="bvaueup" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Payable to dept:</b></label>
        <input type="text" class="form-control form-control-sm" id="pdptvup" readonly>
    </div>
    <div class="form-group col-md-3">
        <label for="totalso"><b>Payable by customer:</b></label>
        <input type="text" class="form-control form-control-sm" id="pdptcvup" readonly>
    </div>
    </div>
    </div>
    </div>
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Tax Details</h5>
        
        <div class="form-row dynamic-row122up">
        <!-- Tax Name -->
  </div>
<!--   <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;"> -->
<div class="form-row dynamic-row">
            <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Grand Total:</b></label>
        <input type="text" class="form-control form-control-sm" id="grandvup" readonly>
         </div>
         <div class="form-group col-md-3">
        <label for="scrapSaleOrder"><b>Invoice Type:</b></label>
        <select class="form-control form-control-sm" id="intypeeditup"></select>
        <div id="intype" class="error-message"></div>
         </div>
         <div class="form-group col-md-3">
            <label for="field4"><b>Supply of Place:</b></label>
            <input type="text" class="form-control form-control-sm" id="supvup">
        </div>
        <!-- NEW: Subcontracting-only fields, editable -->
<div class="form-row dynamic-row" id="subcontractingFieldsUp" style="display:none;">
    <div class="form-group col-md-3">
        <label for="vendornameup"><b>Vendor Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendornameup">
    </div>
    <div class="form-group col-md-3">
        <label for="vendorinvnoup"><b>Vendor Invoice No:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorinvnoup">
    </div>
    <div class="form-group col-md-3">
        <label for="vendorqtyup"><b>Vendor Qty:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorqtyup">
    </div>
    <div class="form-group col-md-3">
    <label for="vendordateup"><b>Vendor Date:</b></label>
    <input type="date" class="form-control form-control-sm" id="vendordateup" max="">
    </div>
</div>
         <div class="form-group col-md-3" style="display:none;">
        <label for="scrapSaleOrder"><b>VID:</b></label>
        <input type="text" class="form-control form-control-sm" id="vidverifyup">
         </div>
         <div class="form-group col-md-3" style="display:none;">
        <label for="scrapSaleOrder"><b>PNID:</b></label>
        <input type="text" class="form-control form-control-sm" id="pnverifywwup">
         </div>
         <div class="form-group col-md-3" style="display:none;">
          <label for="scrapSaleOrder"><b>Con Slno:</b></label>
          <input type="text" class="form-control form-control-sm" id="vconslnoupdate">
         </div>
         </div>
<!--     </div> -->
 </div>
 <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Contract Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <!-- <div class="form-group col-md-3 col-sm-12">
                <label for="scrapType"><b>Business Unit:</b></label>
                <input type="text" class="form-control form-control-sm" id="bunitvup">
            </div> -->
            <div class="form-group col-md-3 col-sm-12">
              <label for="scrapType"><b>Business Unit:</b></label>
              <select class="form-control form-control-sm" id="bunitvup">
              </select>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="scrapType"><b>Invoice Type Calculation:</b></label>
              <!--   <input type="text" class="form-control form-control-sm" id="intypevup" readonly> -->
                <select class="form-control form-control-sm" id="intypevup" disabled>
                <option value="2">Percentage</option>
            </select>
            </div>
            <!-- <div class="form-group col-md-3 col-sm-12">
                <label for="uom"><b>Invoice TO:</b></label>
                <input type="text" class="form-control form-control-sm" id="intovup">
            </div> -->
            <div class="form-group col-md-3 col-sm-12">
              <label for="uom"><b>Invoice To:</b></label>
              <select class="form-control form-control-sm" id="intovup">
              </select>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="uom"><b>Product Description:</b></label>
               <!--  <input type="text" class="form-control form-control-sm" id="prodesvup" readonly> -->
                <select class="form-control form-control-sm" id="prodesvup" disabled>
                <option value="1">product_decs</option>
            </select>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="kgsMt"><b>Shipment Mode</b></label>
                <input type="text" class="form-control form-control-sm" id="shipmodevup" readonly>
                </div>
            <!-- Unit Price Input -->
           <!--  <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Work Order:</b></label>
                <input type="text" class="form-control form-control-sm" id="workordervup">
                </div> -->
                <div class="form-group col-md-3 col-sm-12">
                 <label for="unitPrice"><b>Work Order:</b></label>
                 <select class="form-control form-control-sm" id="workordervup">
                 </select>
                </div>   
                <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Export:</b></label>
                <input type="text" class="form-control form-control-sm" id="exptvup" readonly>
                </div>
                <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Tax is payable on reverse charges:</b></label>
             <!--    <input type="text" class="form-control form-control-sm" id="taxresvup" readonly> -->
                <select class="form-control form-control-sm" id="taxresvup" disabled>
              <option value="0">No</option>
                <option value="1">Yes</option>
            </select>
                </div>
                <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Percentage(%):</b></label>
                <input type="text" class="form-control form-control-sm" id="percenvup">
                </div>
            <!-- <div class="form-group col-md-3 col-sm-12">
            <label for="totalor"><b>Name & Address of Consignee:</b></label>
            <input type="text" class="form-control form-control-sm" id="nandconvup">
        </div> -->
        <div class="form-group col-md-3 col-sm-12">
         <label for="totalor"><b>Name & Address of Consignee:</b></label>
         <select class="form-control form-control-sm" id="nandconvup">
         </select>
        </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Bank Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="banknamevup" readonly>
                </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Delivery Condition:</b></label>
            <input type="text" class="form-control form-control-sm" id="deliveryconvup" readonly>
                </div>
         <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Registered Office::</b></label>
            <input type="text" class="form-control form-control-sm" id="officevvup" readonly>
                </div>
                <!-- <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Service Code::</b></label>
            <input type="text" class="form-control form-control-sm" id="newscode" readonly>
                </div>
                <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>HSN Code::</b></label>
            <input type="text" class="form-control form-control-sm" id="newhcode" readonly>
                </div> -->
            </div>
    </div>
    <div id="exportFields1verifyup" style="display: none;">
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <div class="form-row dynamic-row">
    <div class="form-group col-md-3 col-sm-12">
        <label for="are"><b>AREA Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="arevup" readonly>
        </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="lut"><b>LOT Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="lutvup" readonly>
        </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="connum"><b>Container Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="connumvup" readonly>
        </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="epog"><b>EPCG License No:</b></label>
        <input type="text" class="form-control form-control-sm" id="epogvup" readonly>
         </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="epog"><b>Export Title Text:</b></label>
        <input type="text" class="form-control form-control-sm" id="exptitlevup" readonly>
        </div>
</div>  
</div>
</div>
    <button type="button" class="btn btn-sm btn-primary" id="toggleFieldsVerifyup" style="margin-top: 1%;background-color: white;color: black;border-color: white;">
    <i class="fas fa-chevron-down"></i>&nbsp;&nbsp;Export Details
   </button>
   <!-- Hidden Extra Fields -->
<div id="extraFieldsVerifyup" style="display: none;">
 <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Export Details</h5>
        <div class="form-row dynamic-row">
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="field1"><b>Date of Notification:</b></label>
            <input type="date" class="form-control form-control-sm" id="datevup">
        </div>
        <div class="form-group col-md-3">
            <label for="field2"><b>Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="date1vup">
        </div>
        <div class="form-group col-md-3">
            <label for="field3"><b>BG Type</b></label>
            <select class="form-control form-control-sm" id="bgvaerifyup"></select>
            </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Date of Issue:</b></label>
            <input type="date" class="form-control form-control-sm" id="dissuevup">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Reference No:</b></label>
            <input type="text" class="form-control form-control-sm" id="refvup">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>LC Number:</b></label>
            <input type="text" class="form-control form-control-sm" id="lcvup">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>S.T.Exempted under:</b></label>
            <input type="text" class="form-control form-control-sm" id="exevup">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>LR.Docket No:</b></label>
            <input type="text" class="form-control form-control-sm" id="dockvup">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>BG No:</b></label>
            <input type="text" class="form-control form-control-sm" id="bgnovup">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Date of expiry:</b></label>
            <input type="date" class="form-control form-control-sm" id="dateexpvup">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>Date of Ref:</b></label>
            <input type="date" class="form-control form-control-sm" id="daterefvup">
        </div>
        <div class="form-group col-md-3">
            <label for="field4"><b>LC Issue Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="lcdatevup">
        </div>
    </div>
</div>
</div>
</div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Product Description:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="prodesv11up">
            <div id="intypedes" class="error-message"></div>
            </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remarkvup">
            <div id="intyperem" class="error-message"></div>
            </div>
        </div>
</div>
                     <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-sm btn-primary" onclick="openModalUpdate();">Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalCenter66Editup" tabindex="-1"
			role="dialog" aria-labelledby="exampleModalCenterTitle"
			aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content"
					style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
					<div class="modal-header1">
						<!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> -->
						<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
					</div>
					<div class="modal-body">
						<b>Are you sure you want to Update Steel Invoice?</b>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>
						<button type="button" class="btn btn-info btn-sm"
							onclick="addeventudate()">YES</button>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="exampleModalCenter1" tabindex="-1"
			role="dialog" aria-labelledby="exampleModalCenterTitle"
			aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content"
					style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
					<div class="modal-header1">
						<!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> -->
						<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
					</div>
					<div class="modal-body">
						<b>Are you sure you want to Release Steel Invoice?</b>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>
						<button type="button" class="btn btn-info btn-sm"
							onclick="addeventrelease()">YES</button>
					</div>
				</div>
			</div>
		</div>
	<div id="pdfLoader" class="pdf-loader">
  <div class="loader-card">
    <div class="spinner"></div>
    <div class="loader-text">
      Downloading invoice
      <span class="dots"></span>
    </div>
  </div>
</div>

		
<!-- Scroll to top -->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
 

    <script src="vendor/jquery/jquery.min.js"></script>
        <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

        <script src="vendor/datatables/jquery.dataTables.min.js"></script>
        <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
  
   <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
  
  
      <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
      <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
      <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
  <script src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
  
    
     <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
    <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
    <script src="js/invoiceside.js?v=<%=ver(application, "/js/invoiceside.js")%>"></script>
     <script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
 	     <script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
 	      <script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
 	   

<script>
    document.getElementById("toggleFields").addEventListener("click", function () {
        var extraFields = document.getElementById("extraFields");
        var icon = this.querySelector("i");

        if (extraFields.style.display === "none") {
            extraFields.style.display = "block";
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
        } else {
            extraFields.style.display = "none";
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
        }
    });
</script>
<script>
window.actionElementMap={};
</script>
<!--  	    	   	  <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
    "Insert": "#modalScroll",         // Create button
    "Edit": "updateinvoice",     // Update button
    "Print": "printvvvtest",
    "Verify": "verfiyinc",
    "Release": "releaseinc",
  };
</script> -->
  <script src="js/permissions.js?v=<%=ver(application, "/js/permissions.js")%>"></script>
<script>
    document.getElementById("toggleFieldsVerify").addEventListener("click", function () {
        var extraFields = document.getElementById("extraFieldsVerify");
        var icon = this.querySelector("i");

        if (extraFields.style.display === "none") {
            extraFields.style.display = "block";
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
        } else {
            extraFields.style.display = "none";
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
        }
    });
</script>
<script>
    document.getElementById("toggleFieldsVerified").addEventListener("click", function () {
        var extraFields = document.getElementById("extraFieldsVerified");
        var icon = this.querySelector("i");

        if (extraFields.style.display === "none") {
            extraFields.style.display = "block";
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
        } else {
            extraFields.style.display = "none";
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
        }
    });
</script>
<script>
    document.getElementById("toggleFieldsVerifyup").addEventListener("click", function () {
        var extraFields = document.getElementById("extraFieldsVerifyup");
        var icon = this.querySelector("i");

        if (extraFields.style.display === "none") {
            extraFields.style.display = "block";
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
        } else {
            extraFields.style.display = "none";
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
        }
    });
</script>
<script>
function toggleSubcontractingFields() {
    const selectElement = document.getElementById("intype444");
    const subFields = document.getElementById("subcontractingFields");
    const selectedText = selectElement.options[selectElement.selectedIndex]?.textContent?.trim() || "";

    if (selectedText.toLowerCase() === "subcontracting") {
        subFields.style.display = "flex"; // form-row is a flex container
    } else {
        subFields.style.display = "none";
        // Optional: clear values when hidden so stale data isn't submitted
        document.getElementById("vendorname").value = "";
        document.getElementById("vendorinvno").value = "";
        document.getElementById("vendorqty").value = "";
        document.getElementById("vendordate").value = "";
    }
}

document.getElementById("intype444").addEventListener("change", toggleSubcontractingFields);
</script>

<script>
function toggleSubcontractingFieldsUp() {
    const selectElement = document.getElementById("intypeeditup");
    const subFields = document.getElementById("subcontractingFieldsUp");
    const selectedText = selectElement.options[selectElement.selectedIndex]?.textContent?.trim() || "";
    subFields.style.display = selectedText.toLowerCase() === "subcontracting" ? "flex" : "none";
}
</script>

<script>
function toggleSubcontractingFieldsVerify() {
    const invType = document.getElementById("vintypeedityww").value.trim();
    const subFields = document.getElementById("subcontractingFieldsVerify");
    subFields.style.display = invType.toLowerCase() === "subcontracting" ? "flex" : "none";
}
</script>
<script>
function restrictFutureDates(inputId) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    document.getElementById(inputId).setAttribute('max', today);
}

restrictFutureDates('vendordate');
restrictFutureDates('vendordateup');
</script>
</body>
</html>

