<%@page import="com.JSSL2024.property.PropertyLink"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
 <%
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0
    response.setDateHeader("Expires", 0); // Proxies
%>
<%
long ts = System.currentTimeMillis();
%>
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
      <!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css" /> -->
      <link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
      <link rel="stylesheet" href="css/main.css">
       <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
       <script src="js/sidebar.js"></script>
  
  
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
  <script type="text/javascript">
 function noBack() {
     window.history.forward();
 }
 </script>
</head>

<body onload="fetchUserList();">
  <div id="wrapper">
    <!-- Sidebar -->
      <%@ include file="sidebar.jsp" %>
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
            <h1 class="h3 mb-0 text-gray-800"> Scrap QS Package List</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="Dashboard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="SidemenuScrap.jsp">Scrap Page</a></li>
             <li class="breadcrumb-item active" aria-current="page">QS Package</li>
              
            </ol>
          </div>
          <div class="row mb-3">
<div class="col-lg-12">
  <div class="card mb-4">
    <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
        <button data-toggle="modal"  id="modalScroll1">
          <i class="fas fa-plus"></i> Create
        </button>
      </div>
    </div>

    <div class="table-responsive p-3">
      <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
        </table>
    </div>
  </div>
</div>



</div>
          </div>
  </div>
  </div>
  
  
  <!-- Modal 1: Create QS Package Details -->

          
      <!-- Form Container with Outline and Title -->

    <div class="modal fade" id="exampleModalScrollable123" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Scrap Packing Note Form</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
                    <div class="form-row">
    <div class="form-group col-md-4">
        <label for="scrapSaleOrder"><b>Scrap Sale Order:</b></label>
        <select class="form-control form-control-sm" id="scrapSaleOrder">
            </select>
         <div id="productCodeError18" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="saleOrderDate"><b>Sale Order Date:</b></label>
        <input type="date" class="form-control form-control-sm" id="saleOrderDate" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="totalSteelQty"><b>Total Qty:</b></label>
        <input type="text" class="form-control form-control-sm" id="totalSteelQty" readonly>
    </div>
</div>

<!-- Vendor and Location Details -->
<div class="form-row">
    <div class="form-group col-md-4">
        <label for="vendorName"><b>Vendor Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorName" readonly>
    </div>
    <div class="form-group col-md-4" style="display:none;">
        <label for="vendorName"><b>Vendor Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorName11" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="locationDetails"><b>Location Details:</b></label>
        <input type="text" class="form-control form-control-sm" id="locationDetails" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="locationType"><b>Location Type:</b></label>
        <input type="text" class="form-control form-control-sm" id="locationType" readonly>
    </div>
    <div class="form-group col-md-4" style="display:none;">
        <label for="locationType"><b>Location TypeId:</b></label>
        <input type="text" class="form-control form-control-sm" id="locationTypeid" readonly>
    </div>
    <div class="form-group col-md-4" style="display:none;">
        <label for="nonsteel"><b>Total Non-Steel Qty:</b></label>
        <input type="text" class="form-control form-control-sm" id="nonsteel" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="validityDate"><b>Sale Order Validity:</b></label>
        <input type="date" class="form-control form-control-sm" id="validityDate" readonly>
    </div>
    </div>

<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="inputFieldsContainer" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="scrapType"><b>Scrap Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="scraptype" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="scrapType"><b>Scrap Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="scraptype11" readonly>
            </div>
            <!-- Scrap Item Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="scrapItem"><b>Scrap Item:</b></label>
                <input type="text" class="form-control form-control-sm" id="scrapitem" readonly>
            </div>
            <div class="form-group col-md-1 col-sm-12" style="display:none;">
                <label for="scrapItem"><b>Scrap Item:</b></label>
                <input type="text" class="form-control form-control-sm" id="scrapitem11" readonly>
            </div>
            <!-- UOM Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="uom"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="uom" readonly>
            </div>
            <div class="form-group col-md-1 col-sm-12" style="display:none;">
                <label for="uom"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="uom11" readonly>
            </div>
            <!-- Quantity Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="quantity"><b>Quantity:</b></label>
                <input type="number" class="form-control form-control-sm" id="quantity" placeholder="Enter Quantity" min="0" autocomplete="off">
                <div id="productCodeError1" class="error-message"></div>
            </div>
            <!-- Kgs/MT Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="kgsMt"><b>Kgs/MT:</b></label>
                <input type="number" class="form-control form-control-sm" id="kgsMt" placeholder="Enter Kgs/MT" min="0" autocomplete="off">
                <div id="productCodeError12" class="error-message"></div>
            </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-1 col-sm-12">
                <label for="unitPrice"><b>Unit Price:</b></label>
                <input type="text" class="form-control form-control-sm" id="unitPrice" autocomplete="off" readonly>
                <div id="productCodeError13" class="error-message"></div>
            </div>
            <!-- Total Input -->
            <div class="form-group col-md-1 col-sm-12">
                <label for="total"><b>Total:</b></label>
                <input type="text" class="form-control form-control-sm" id="total" readonly>
            </div>
        </div>
    </div>

    <!-- Transporter and Vehicle Details -->
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Total Ordered Balance:</b></label>
            <input type="text" class="form-control form-control-sm" id="totalor" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Total Sold:</b></label>
            <input type="text" class="form-control form-control-sm" id="totalso" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="bal"><b>Balance:</b></label>
            <input type="text" class="form-control form-control-sm" id="bal" readonly>
        </div>
        <div class="form-group col-md-3" style="display:none;">
            <label for="bal"><b>Tolerence:</b></label>
            <input type="text" class="form-control form-control-sm" id="tolvalue" readonly>
        </div>
        <div class="form-group col-md-3" style="display:none;">
            <label for="bal"><b>bal:</b></label>
            <input type="text" class="form-control form-control-sm" id="balcal" readonly>
        </div>
        <input type="hidden" id="originalBalanceInsert">
    </div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="transporterName"><b>Transporter Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="transporterName" placeholder="Enter Transporter Name" autocomplete="off">
            <div id="productCodeError14" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="vehicleNo"><b>Vehicle No:</b></label>
            <input type="text" class="form-control form-control-sm" id="vehicleNo" placeholder="Enter Vehicle No" autocomplete="off">
            <div id="productCodeError15" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="weighbrid"><b>Weighbridge Slip No:</b></label>
            <input type="text" class="form-control form-control-sm" id="weighbrid" placeholder="Enter Weighbridge Slip No" autocomplete="off">
            <div id="productCodeError16" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="date"><b>Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="date" placeholder="Enter date">
            <div id="productCodeError17" class="error-message"></div>
        </div>
    </div>
</div>

                    

                    <!-- Upload Packing Note -->
                   

                    <!-- Submit and Cancel Buttons -->
                    <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-sm btn-primary" onclick="openModalAdd();">Create</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Modal Structure -->
<div class="modal fade" id="exampleModalCenter66" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 54%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                   <!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> --> 
                   <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
                 </div>
                <div class="modal-body">
                  <b>Are you sure you want to create?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" onclick="addevent();">YES</button>
                </div>
              </div>
            </div>
          </div>


<!-- Modal Structure -->
<div class="modal fade" id="exampleModalScrollable123RE" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Verify Scrap Packing Note Form</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
                    <div class="form-row">
    <div class="form-group col-md-4">
        <label for="scrapSaleOrder"><b>Scrap Sale Order:</b></label>
        <input type="text" class="form-control form-control-sm" id="scrapSaleOrderre" readonly>
         
    </div>
    <div class="form-group col-md-4">
        <label for="saleOrderDate"><b>Sale Order Date:</b></label>
        <input type="date" class="form-control form-control-sm" id="saleOrderDatere" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="totalSteelQty"><b>Total Qty:</b></label>
        <input type="text" class="form-control form-control-sm" id="totalSteelQtyre" readonly>
    </div>
</div>

<!-- Vendor and Location Details -->
<div class="form-row">
    <div class="form-group col-md-4">
        <label for="vendorName"><b>Vendor Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorNamere" readonly>
    </div>
    <div class="form-group col-md-4" style="display:none;">
        <label for="vendorName"><b>Vendor Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorName11re" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="locationDetails"><b>Location Details:</b></label>
        <input type="text" class="form-control form-control-sm" id="locationDetailsre" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="locationType"><b>Location Type:</b></label>
        <input type="text" class="form-control form-control-sm" id="locationTypere" readonly>
    </div>
    <div class="form-group col-md-4" style="display:none;">
        <label for="nonsteel"><b>Total Non-Steel Qty:</b></label>
        <input type="text" class="form-control form-control-sm" id="nonsteelre" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="validityDate"><b>Sale Order Validity:</b></label>
        <input type="date" class="form-control form-control-sm" id="validityDatere" readonly>
    </div>
    </div>

<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="inputFieldsContainerre">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="scrapType"><b>Scrap Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="scraptypere" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="scrapType"><b>Scrap Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="scraptype11re" readonly>
            </div>
            <!-- Scrap Item Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="scrapItem"><b>Scrap Item:</b></label>
                <input type="text" class="form-control form-control-sm" id="scrapitemre" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="scrapItem"><b>Scrap Item:</b></label>
                <input type="text" class="form-control form-control-sm" id="scrapitem11re" readonly>
            </div>
            <!-- UOM Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="uom"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="uomre" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="uom"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="uom11re" readonly>
            </div>
            <!-- Quantity Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="quantity"><b>Quantity:</b></label>
                <input type="number" class="form-control form-control-sm" id="quantityre" readonly>
                <div id="productCodeError90" class="error-message"></div>
            </div>
            <!-- Kgs/MT Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="kgsMt"><b>Kgs/MT:</b></label>
                <input type="number" class="form-control form-control-sm" id="kgsMtre" readonly>
                <div id="productCodeError91" class="error-message"></div>
            </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-1 col-sm-12">
                <label for="unitPrice"><b>Unit Price:</b></label>
                <input type="text" class="form-control form-control-sm" id="unitPricere" readonly>
                
            </div>
            <!-- Total Input -->
            <div class="form-group col-md-1 col-sm-12">
                <label for="total"><b>Total:</b></label>
                <input type="text" class="form-control form-control-sm" id="totalre" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="total"><b>ID code:</b></label>
                <input type="text" class="form-control form-control-sm" id="scid" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="total"><b>verify:</b></label>
                <input type="text" class="form-control form-control-sm" id="verify" readonly>
            </div>
        </div>
    </div>

    <!-- Transporter and Vehicle Details -->
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Total Ordered Balance:</b></label>
            <input type="text" class="form-control form-control-sm" id="totalorre" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Total Sold:</b></label>
            <input type="text" class="form-control form-control-sm" id="totalsore" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="bal"><b>Balance:</b></label>
            <input type="text" class="form-control form-control-sm" id="balre" readonly>
        </div>
    </div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="transporterName"><b>Transporter Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="transporterNamere" readonly>
            <div id="productCodeError92" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="vehicleNo"><b>Vehicle No:</b></label>
            <input type="text" class="form-control form-control-sm" id="vehicleNore" readonly>
            <div id="productCodeError93" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="weighbrid"><b>Weighbridge Slip No:</b></label>
            <input type="text" class="form-control form-control-sm" id="weighbridre" readonly>
            <div id="productCodeError900" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="date"><b>Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="datere" readonly>
           <div id="productCodeError94" class="error-message"></div>
        </div>
    </div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="transporterName"><b>Buyer's Reference No. & Dt:</b></label>
            <input type="text" class="form-control form-control-sm" id="Buyers" readonly>
            <div id="productCodeError95" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="vehicleNo"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remark" autocomplete="off">
            <div id="productCodeError96" class="error-message"></div>
        </div>
        </div>
</div>

                    

                    <!-- Upload Packing Note -->
                   

                    <!-- Submit and Cancel Buttons -->
                    <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        <button type="button" id="verify" class="btn btn-sm btn-primary" onclick="openModalAddRev();">Verify</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="exampleModalCenterverify" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 54%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                   <!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> --> 
                   <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
                 </div>
                <div class="modal-body">
                  <b>Are you sure you want to verify?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" onclick="verifyevent();">YES</button>
                </div>
              </div>
            </div>
          </div>
          
  <div class="modal fade" id="exampleModalScrollable123REedit" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Scrap Packing Note Verified Form</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
                    <div class="form-row">
    <div class="form-group col-md-4">
        <label for="scrapSaleOrder"><b>Scrap Sale Order:</b></label>
        <input type="text" class="form-control form-control-sm" id="scrapSaleOrderreedit" readonly>
         
    </div>
    <div class="form-group col-md-4">
        <label for="saleOrderDate"><b>Sale Order Date:</b></label>
        <input type="date" class="form-control form-control-sm" id="saleOrderDatereedit" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="totalSteelQty"><b>Total Qty:</b></label>
        <input type="text" class="form-control form-control-sm" id="totalSteelQtyreedit" readonly>
    </div>
</div>

<!-- Vendor and Location Details -->
<div class="form-row">
    <div class="form-group col-md-4">
        <label for="vendorName"><b>Vendor Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorNamereedit" readonly>
    </div>
    <div class="form-group col-md-4" style="display:none;">
        <label for="vendorName"><b>Vendor Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorName11reedit" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="locationDetails"><b>Location Details:</b></label>
        <input type="text" class="form-control form-control-sm" id="locationDetailsreedit" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="locationType"><b>Location Type:</b></label>
        <input type="text" class="form-control form-control-sm" id="locationTypereedit" readonly>
    </div>
    <div class="form-group col-md-4" style="display:none;">
        <label for="nonsteel"><b>Total Non-Steel Qty:</b></label>
        <input type="text" class="form-control form-control-sm" id="nonsteelreedit" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="validityDate"><b>Sale Order Validity:</b></label>
        <input type="date" class="form-control form-control-sm" id="validityDatereedit" readonly>
    </div>
    </div>

<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="inputFieldsContainerre">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="scrapType"><b>Scrap Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="scraptypereedit" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="scrapType"><b>Scrap Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="scraptype11re" readonly>
            </div>
            <!-- Scrap Item Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="scrapItem"><b>Scrap Item:</b></label>
                <input type="text" class="form-control form-control-sm" id="scrapitemreedit" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="scrapItem"><b>Scrap Item:</b></label>
                <input type="text" class="form-control form-control-sm" id="scrapitem11reedit" readonly>
            </div>
            <!-- UOM Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="uom"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="uomreedit" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="uom"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="uom11re" readonly>
            </div>
            <!-- Quantity Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="quantity"><b>Quantity:</b></label>
                <input type="number" class="form-control form-control-sm" id="quantityreedit" readonly>
                <div id="productCodeError90" class="error-message"></div>
            </div>
            <!-- Kgs/MT Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="kgsMt"><b>Kgs/MT:</b></label>
                <input type="number" class="form-control form-control-sm" id="kgsMtreedit" readonly>
                <div id="productCodeError91" class="error-message"></div>
            </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-1 col-sm-12">
                <label for="unitPrice"><b>Unit Price:</b></label>
                <input type="text" class="form-control form-control-sm" id="unitPricereedit" readonly>
                
            </div>
            <!-- Total Input -->
            <div class="form-group col-md-1 col-sm-12">
                <label for="total"><b>Total:</b></label>
                <input type="text" class="form-control form-control-sm" id="totalrewedit" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="total"><b>ID code:</b></label>
                <input type="text" class="form-control form-control-sm" id="scidedit" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="total"><b>verify:</b></label>
                <input type="text" class="form-control form-control-sm" id="verify" readonly>
            </div>
        </div>
    </div>

    <!-- Transporter and Vehicle Details -->
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Total Ordered Balance:</b></label>
            <input type="text" class="form-control form-control-sm" id="totalorreedit" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Total Sold:</b></label>
            <input type="text" class="form-control form-control-sm" id="totalsoreedit" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="bal"><b>Balance:</b></label>
            <input type="text" class="form-control form-control-sm" id="balreedit" readonly>
        </div>
    </div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="transporterName"><b>Transporter Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="transporterNamereedit" readonly>
            <div id="productCodeError92" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="vehicleNo"><b>Vehicle No:</b></label>
            <input type="text" class="form-control form-control-sm" id="vehicleNoreedit" readonly>
            <div id="productCodeError93" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="weighbrid"><b>Weighbridge Slip No:</b></label>
            <input type="text" class="form-control form-control-sm" id="weighbridreedit" readonly>
            <div id="productCodeError900" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="date"><b>Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="datereedit" readonly>
           <div id="productCodeError94" class="error-message"></div>
        </div>
    </div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="transporterName"><b>Buyer's Reference No. & Dt:</b></label>
            <input type="text" class="form-control form-control-sm" id="Buyersedit" readonly>
            <div id="productCodeError95" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="vehicleNo"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remarkss" readonly>
            <div id="productCodeError96" class="error-message"></div>
        </div>
        </div>
</div>

                    

                    <!-- Upload Packing Note -->
                   

                    <!-- Submit and Cancel Buttons -->
                    <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        </div>
                </form>
            </div>
        </div>
    </div>
</div>  

<div class="modal fade" id="exampleModalScrollable123REEditUp" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Edit Scrap Packing Note Form</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
                    <div class="form-row">
    <div class="form-group col-md-4">
        <label for="scrapSaleOrder"><b>Scrap Sale Order:</b></label>
        <input type="text" class="form-control form-control-sm" id="scrapSaleOrderre00" readonly>
         
    </div>
    <div class="form-group col-md-4">
        <label for="saleOrderDate"><b>Sale Order Date:</b></label>
        <input type="date" class="form-control form-control-sm" id="saleOrderDatere00" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="totalSteelQty"><b>Total Steel Qty:</b></label>
        <input type="text" class="form-control form-control-sm" id="totalSteelQtyre00" readonly>
    </div>
</div>

<!-- Vendor and Location Details -->
<div class="form-row">
    <div class="form-group col-md-4">
        <label for="vendorName"><b>Vendor Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorNamere00" readonly>
    </div>
    <div class="form-group col-md-4" style="display:none;">
        <label for="vendorName"><b>Vendor Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="vendorName11re00" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="locationDetails"><b>Location Details:</b></label>
        <input type="text" class="form-control form-control-sm" id="locationDetailsre00" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="locationType"><b>Location Type:</b></label>
        <input type="text" class="form-control form-control-sm" id="locationTypere00" readonly>
    </div>
    <div class="form-group col-md-4" style="display:none;">
        <label for="locationType"><b>Location TypeId:</b></label>
        <input type="text" class="form-control form-control-sm" id="locationTypere00id" readonly>
    </div>
    <div class="form-group col-md-4" style="display:none;">
        <label for="nonsteel"><b>Total Non-Steel Qty:</b></label>
        <input type="text" class="form-control form-control-sm" id="nonsteelre00" readonly>
    </div>
    <div class="form-group col-md-4">
        <label for="validityDate"><b>Sale Order Validity:</b></label>
        <input type="date" class="form-control form-control-sm" id="validityDatere00" readonly>
    </div>
    </div>

<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="inputFieldsContainerre">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="scrapType"><b>Scrap Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="scraptypere00" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="scrapType"><b>Scrap Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="scraptype11re00" readonly>
            </div>
            <!-- Scrap Item Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="scrapItem"><b>Scrap Item:</b></label>
                <input type="text" class="form-control form-control-sm" id="scrapitemre00" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="scrapItem"><b>Scrap Item:</b></label>
                <input type="text" class="form-control form-control-sm" id="scrapitem11re00" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="scrapItem"><b>Scrap Item ID:</b></label>
                <input type="text" class="form-control form-control-sm" id="scrapitem11re00id" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="scrapItem"><b>Scrap Pn ID:</b></label>
                <input type="text" class="form-control form-control-sm" id="scppnid11" readonly>
            </div>
            <!-- UOM Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="uom"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="uomre00" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="uom"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="uom11re00" readonly>
            </div>
            <!-- Quantity Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="quantity"><b>Quantity:</b></label>
                <input type="number" class="form-control form-control-sm" id="quantityre00" autocomplete="off">
                <div id="productCodeError90edit" class="error-message"></div>
            </div>
            <!-- Kgs/MT Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="kgsMt"><b>Kgs/MT:</b></label>
                <input type="number" class="form-control form-control-sm" id="kgsMtre00" autocomplete="off">
                <div id="productCodeError91edit11" class="error-message"></div>
            </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-1 col-sm-12">
                <label for="unitPrice"><b>Unit Price:</b></label>
                <input type="text" class="form-control form-control-sm" id="unitPricere00" autocomplete="off">
                
            </div>
            <!-- Total Input -->
            <div class="form-group col-md-1 col-sm-12">
                <label for="total"><b>Total:</b></label>
                <input type="text" class="form-control form-control-sm" id="totalre00" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="total"><b>ID code:</b></label>
                <input type="text" class="form-control form-control-sm" id="scid00" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="total"><b>verify:</b></label>
                <input type="text" class="form-control form-control-sm" id="verify00" readonly>
            </div>
        </div>
    </div>

    <!-- Transporter and Vehicle Details -->
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Total Ordered Balance:</b></label>
            <input type="text" class="form-control form-control-sm" id="totalorre00" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Total Sold:</b></label>
            <input type="text" class="form-control form-control-sm" id="totalsore00" readonly>
        </div>
        <div class="form-group col-md-3">
            <label for="bal"><b>Balance:</b></label>
            <input type="text" class="form-control form-control-sm" id="balre00" readonly>
        </div>
        <div class="form-group col-md-3" style="display:none;">
            <label for="bal"><b>Value:</b></label>
            <input type="text" class="form-control form-control-sm" id="tolvalueedit">
        </div>
        <input type="hidden" id="originalBalanceEdit">
    </div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="transporterName"><b>Transporter Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="transporterNamere00" autocomplete="off">
            <div id="productCodeError92edit" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="vehicleNo"><b>Vehicle No:</b></label>
            <input type="text" class="form-control form-control-sm" id="vehicleNore00" autocomplete="off">
            <div id="productCodeError93edit" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="weighbrid"><b>Weighbridge Slip No:</b></label>
            <input type="text" class="form-control form-control-sm" id="weighbridre00" autocomplete="off">
            <div id="productCodeError900edit" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="date"><b>Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="datere00" autocomplete="off">
           <div id="productCodeError94edit" class="error-message"></div>
        </div>
    </div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="transporterName"><b>Project Reference:</b></label>
            <input type="text" class="form-control form-control-sm" id="proref11" autocomplete="off" placeholder="project reference">
            <div id="productCodeError92editaa" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="vehicleNo"><b>Letter of Credit Reference:</b></label>
            <input type="text" class="form-control form-control-sm" id="crell11" autocomplete="off" placeholder="letter of Credit Reference">
            <div id="productCodeError93editaa" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="weighbrid"><b>Central Excise Tariff No:</b></label>
            <input type="text" class="form-control form-control-sm" id="cen11up" autocomplete="off" placeholder="Central Excise Tariff No">
            <div id="productCodeError900editaa" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="text"><b>Other reference:</b></label>
            <input type="text" class="form-control form-control-sm" id="otreffup" autocomplete="off" placeholder="Other reference">
           <div id="productCodeError94editaa" class="error-message"></div>
        </div>
    </div>
    <div class="form-row mt-3" style="display:none;">
        <div class="form-group col-md-3">
            <label for="transporterName"><b>Buyer's Reference No. & Dt:</b></label>
            <input type="text" class="form-control form-control-sm" id="Buyers00" readonly>
            <div id="productCodeError95" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="vehicleNo"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remark00" autocomplete="off">
            <div id="productCodeError96" class="error-message"></div>
        </div>
        </div>
</div>
<div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        <button type="button" id="verify" class="btn btn-sm btn-primary" id="updatescarpQA" onclick="openModalEditUp();">Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>  

<div class="modal fade" id="exampleModalCenteEditup" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 54%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                   <!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> --> 
                   <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
                 </div>
                <div class="modal-body">
                  <b>Are you sure you want to update?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" onclick="Updateevent();">YES</button>
                </div>
              </div>
            </div>
          </div>    

  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>

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
  <script src="js/ScrapQA.js?v=<%=ts%>"></script>
      <script src="js/logout.js"></script>
  <script src="js/username.js"></script>
  
  <script src="js/createdby.js"></script>
 	   <script src="js/modifiedby.js"></script>
 	  <script src="js/factoryid.js"></script>
 	   <script src="js/Sessionfilter.js"></script>
 	   	  <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
<script src="js/permissions.js"></script>
 	  <script>
    document.addEventListener("DOMContentLoaded", function () {
        let today = new Date().toISOString().split('T')[0];
        let startDateInput = document.getElementById("date");
        startDateInput.value = today; // Set the current date as default value
        startDateInput.setAttribute("min", today);
        startDateInput.setAttribute("max", today);
    });
</script>
  <script>
// Track user activity and logout after 2 minutes (120000 ms)
let inactivityTime = function () {
    let timeout;

    // Reset timer on any user activity
    function resetTimer() {
        clearTimeout(timeout);
        timeout = setTimeout(triggerLogout, 900000); // 15 minutes
    }

    // Event listener for activity
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;
    document.onclick = resetTimer;
    document.onscroll = resetTimer;

    function triggerLogout() {
        // Create a dummy event to pass to logoutUser
        let dummyEvent = new Event('logout');
        logoutUser(dummyEvent);
    }
};

inactivityTime();

function logoutUser(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }

    var user_id = sessionStorage.getItem('user_id'); 
    if (!user_id) {
        alert("User ID not found. Please login first.");
        return;
    }

    if (typeof baseUrl === 'undefined' || !baseUrl) {
        console.error("baseUrl is not defined or is empty.");
        return;
    }

    const url = baseUrl.endsWith('/') ? baseUrl + 'jssl/user/userlogout' : baseUrl + '/jssl/user/userlogout';

    $.ajax({
        url: url,
        type: 'POST',
        data: $.param({ user_id: user_id }),
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        cache: false,
        success: function(data) {
            console.log("Server response:", data);
            
            if (data.status === "yes" && data.message === "Logout Success") {
                sessionStorage.removeItem("user_id");
                sessionStorage.removeItem("username");
                sessionStorage.removeItem("isLoggedIn");
                localStorage.removeItem("selectedFactoryId");
                window.location = "newlogin.jsp";
            } else {
                console.error("Logout failed.");
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX error:", error);
            console.error("Response text:", xhr.responseText);
            alert("Error: " + (xhr.responseText || "An error occurred."));
        }
    });
}
</script>
  <!-- Page level custom scripts -->
</body>
</html>