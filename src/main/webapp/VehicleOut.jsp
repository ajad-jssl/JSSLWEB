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
<%
String version = "4.0"; // change manually when deploy
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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-xxx" crossorigin="anonymous" />
  <link href="css/masterpage.css" rel="stylesheet">
 
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
  
   /* .text-danger {
    display: none;  /* Hide by default */
    color: red;
    font-size: 12px;
}  */
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
  <script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>
</head>

<body onload="QSlist();">
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
                        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
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
            <h1 class="h3 mb-0 text-gray-800">Vehicle Out</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="VehicleDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item active" aria-current="page">Vehicle Out</li>
             
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
      <table class="table table-striped table-bordered table-sm" id="table_ID" width="100%">
       <!--  <thead>
          <tr>
            <th>Sl. No.</th>           
            <th>Vendor Name</th>
            <th>Contact 1</th>
            <th>Contact 2</th>
            <th>ContactNo</th>                  
            <th>Address</th>       
            <th>City</th>
            <th>State</th>                         
            <th>GSTIN</th>            
            <th>Remarks</th>       
            <th>Actions</th>
          </tr>
        </thead> -->
        <tbody>
         <!--  Dynamic rows will be inserted here-->
        </tbody>
      </table>
    </div>
  </div>
</div> 
</div>
  </div>
  </div>
  </div>
 <div class="modal fade" id="exampleModalScrollable123" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true" onload="generateSaleOrderNumber();">
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1200px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Vehicle Out</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->  
      <div class="modal-body">
      <div class="row mb-3">
          <div class="col-md-2">
           <label for="Vehicleid" class="form-label"><b>Vehicle ID:</b></label>
           <select class="form-control form-control-sm" id="Vehicleid">
           <option value="">Select</option>
           <option value="yes"></option>
           <option value="no"></option>
	       </select>
	       <div id="VehicleidError" class="error-message" style="display: none;">Vehicle ID is required</div>
          </div>
         </div>
 
      
      
      
   <div id="container1" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 5px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Vehicle Out Details</h5>
        
       <div class="form-row">
          
            <div class="col-md-4">
             <label for="vehicleno" class="form-label"><b>Vehicle No:</b></label>
             <input type="text" class="form-control form-control-sm" id="vehicleno" placeholder="Vehicle No" readonly>
             <div id="vehiclenoError" class="error-message" style="display: none;">Vehicle No is required</div>
            </div>
            
            <div class="col-md-4">
             <label for="tname" class="form-label"><b>Transporter Name:</b></label>
             <input type="text" class="form-control form-control-sm" id="tname" placeholder="Transporter Name" readonly>
             <div id="tnameError" class="error-message" style="display: none;">Transporter name is required</div>
           </div>
         
          
         
           <div class="col-md-4">
            <label for="register" class="form-label"><b>Register Type:</b></label>
            <input type="text" class="form-control form-control-sm" disabled id="register">
            <div id="registerError" class="error-message" style="display: none;">Register Type is required</div>
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="contract" class="form-label"><b>Contract No:</b></label>
            <input type="text" class="form-control form-control-sm" id="contract" placeholder="Contract No" readonly>
            <div id="contractError" class="error-message" style="display: none;">Contract No is required</div>
           </div>
         
          
         
           <div class="col-md-4" style="padding-top:2%;">
            <label for="lotno" class="form-label"><b>Lot No:</b></label>
            <input type="text" class="form-control form-control-sm" id="lotno" placeholder="Lot No" readonly>
            <div id="lotnoError" class="error-message" style="display: none;">Lot No is required</div>
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="invoiceno" class="form-label"><b>Invoice No:</b></label>
            <input type="text" class="form-control form-control-sm" id="invoiceno" placeholder="Invoice No" readonly>
            <div id="invoicenoError" class="error-message" style="display: none;">Invoice No is required</div>
           </div>
          
          
         
           <div class="col-md-4" style="padding-top:2%;"> 
            <label for="vehicle in" class="form-label"><b>Vehicle In:</b></label> 
             <input type="text" class="form-control form-control-sm" id="vehicle in" placeholder="Vehicle In" readonly>
	        <div id="vehicle inError" class="error-message" style="display: none;">Vehicle In is required</div>
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="driver" class="form-label"><b>Driver Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="driver" placeholder="Driver Name" readonly>
            <div id="driverError" class="error-message" style="display: none;">Driver Name is required</div>
           </div>
         
          
         
           <div class="col-md-4" style="padding-top:2%;">
            <label for="dmno" class="form-label"><b>Driver Mobile No:</b></label>
            <input type="text" class="form-control form-control-sm" id="dmno" placeholder="Driver Mobile No" readonly>
	        <div id="dmnoError" class="error-message" style="display: none;">Driver Mobile No is required</div>
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="dlno" class="form-label"><b>License No:</b></label>
            <input type="text" class="form-control form-control-sm" id="dlno" placeholder="License No" readonly>
            <div id="dlnoError" class="error-message" style="display: none;">License No is required</div>
           </div>
         
          
          
           <div class="col-md-4" style="padding-top:2%;">
            <label for="vtype" class="form-label"><b>Vehicle Type:</b></label>
            <input type="text" class="form-control form-control-sm" id="vtype" placeholder="Vehicle Type" readonly>
            <div id="vtypeError" class="error-message" style="display: none;">Vehicle Type is required</div>
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="hname" class="form-label"><b>Helper name:</b></label>
            <input type="text" class="form-control form-control-sm" id="hname" placeholder="Helper name" readonly>
            <div id="hnameError" class="error-message" style="display: none;">Helper name is required</div>
           </div>
          
          
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="whom" class="form-label"><b>Whom to meet:</b></label>
            <input type="text" class="form-control form-control-sm" id="whom" placeholder="Whom to meet" readonly>
            <div id="whomError" class="error-message" style="display: none;">Whom to meet is required</div>
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="department" class="form-label"><b>Department:</b></label>
            <input type="text" class="form-control form-control-sm" id="department" placeholder="Department" readonly>
            <div id="departmentError" class="error-message" style="display: none;">Department is required</div>
           </div>
          
          
          
           <div class="col-md-4" style="padding-top:2%;">
            <label for="inremarks" class="form-label"><b>In Remarks:</b></label>
            <input type="text" class="form-control form-control-sm" id="inremarks" placeholder="In Remarks" readonly>
            <div id="inremarksError" class="error-message" style="display: none;">In Remarks is required</div>
           </div>
           
           <div class="col-md-4"style="padding-top:2%;">
            <label for="invoice_no" class="form-label"><b>Invoice No:</b></label>
            <select class="form-control form-control-sm"  id="invoice_no">
            <!-- <option value="no"></option> -->
	        </select>
            <div id="invoice_noError" class="error-message" style="display: none;">Invoice No is required</div>
           </div>
          
          
          
           <div class="col-md-4" style="padding-top:2%;">
            <label for="lrno" class="form-label"><b>LR.No:</b></label>
            <input type="text" class="form-control form-control-sm" id="lrno" placeholder="LR.No" >
            <div id="lrnoError" class="error-message" style="display: none;">LR.No is required</div>
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="outremarks" class="form-label"><b>Out Remarks:</b></label>
            <input type="text" class="form-control form-control-sm" id="outremarks" placeholder="Out Remarks">
            <div id="outremarksError" class="error-message" style="display: none;">Out Remarks is required</div>
           </div>
         
          
          
           <div class="table-responsive p-3">
                <table class="table table-striped table-bordered table-sm" id="TableID" style="width: 100%;">
                <thead> 
                    <tr>
                        <th>Sl.No</th>
                        <th>C_Name</th>
                        <th>C_Location</th>
                        <th>C_Address</th>
                        <th>PO Number</th>
                        <th>PO Date</th>
                        <th>Invoice Number</th>
                        <th>Invoice Date</th>
                        <th>DC Number</th>
                        <th>DC Date</th>
                        <th>Quantity</th>
                        <th>Weight</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
                </table>
                </div>

      <!-- Modal Footer -->
       <div class="table-responsive p-3">
        <div class="modal-footer text-right">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary"  id="btnsubmit" >Create</button>
        </div>
       </div>
      </div>
     </div> 
    </div>
   </div>
  </div>
 </div>
</div>

   <div class="modal fade" id="exampleModalCenter325" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmvehoutyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

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
  <script src="js/logout.js"></script>
 <!--  <script src="js/VehicleOut.js"></script> -->
  
  <script src="js/VehicleOut.js?v=<%=ts%>"></script>
<!--   <script src="js/scrapedit.js"></script> -->
 <script src="js/username.js"></script>
 
  <script src="js/createdby.js"></script>
 	   <script src="js/modifiedby.js"></script>
 	    <script src="js/Sessionfilter.js"></script>
 	     	<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
 	   <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
<script src="js/permissions.js"></script>
<script>
 	 <!--  <script src="js/factoryid.js"></script> -->

<!-- Scroll to top -->
<script>
    // JavaScript to toggle the visibility of the input fields container
    document.getElementById("getButton").addEventListener("click", function() {
        document.getElementById("inputFieldsContainer").style.display = "block";
    });
</script>

</body>
</html>