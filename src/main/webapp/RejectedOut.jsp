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
   <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css" />
   <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
   <link href="css/ruang-admin.min.css" rel="stylesheet" />
   <link href="vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">
      <!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css" /> -->
   <link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
   <link rel="stylesheet" href="css/main.css">
       <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
       <script src="js/sidebar.js"></script>
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEJjRkC9iY3NfJVzz6se99Nz05dfk03S8zNeS46E1H2nKfHlR9ltRf9TL7zG6" crossorigin="anonymous">




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
            <h1 class="h3 mb-0 text-gray-800">Rejected Out</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="VehicleDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item active" aria-current="page">Rejected Out</li>
              
            </ol>
          </div>
          
   
          
          <div class="row mb-3">
<div class="col-lg-12">
  <div class="card mb-4">
    <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
        <button data-toggle="modal" data-target="#exampleModalScrollable123" id="modalScroll1">
          <i class="fas fa-plus"></i> Create
        </button>
      </div>
    </div>
    
    
    
  <!--  <div class="table-responsive p-3">
      <table class="table table-striped table-bordered table-sm" id="Table" width="100%">
        <thead>
          <tr>
                <th>Vehicle No</th>
                <th>Driver Name</th>
                <th>Driver Mobile No</th>
                <th>Driver License No</th>              
                <th>Helper Name</th>
                <th>Transporter Name</th>
                <th>Whom to Meet</th>
                <th>Description</th>
                <th>Remarks</th>
                <th>Action</th>            
          </tr>
        </thead>
        <tbody>
          Dynamic rows will be inserted here
        </tbody>
      </table>
    </div>      
  </div>
</div> -->



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
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Vehicle Rejected Out</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
            <div class="row mb-3">
          <div class="col-md-2">
           <label for="Vehicle_id" class="form-label"><b>Vehicle ID:</b></label>
           <select class="form-control form-control-sm" id="Vehicle_id">
           <option value="">Select</option>           
	       </select>
	       <div id="Vehicle_idError" class="text-danger" style="display: none;">Vehicle ID is required</div>
          </div>
         </div>
                 
   <div id="container1" >
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 5px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Rejected Out Details</h5>
        
            <div class="form-row">
          
            <div class="col-md-4">
             <label for="vehicle_no" class="form-label"><b>Vehicle No:</b></label>
             <input type="text" class="form-control form-control-sm" id="vehicle_no" placeholder="Vehicle No" readonly>            
            </div>
            
            <div class="col-md-4">
             <label for="t_name" class="form-label"><b>Transporter Name:</b></label>
               <input type="text" class="form-control form-control-sm" id="t_name" readonly>      
     <!-- 		 <select class="form-control form-control-sm" id="t_name">
           <option value="">Select</option>           
	       </select>   -->        
           </div>
         
          
         
           <div class="col-md-4">
            <label for="register1" class="form-label"><b>Register Type:</b></label>
            <input type="text" class="form-control form-control-sm" id="register1" readonly>      
            <!--  <select class="form-control form-control-sm" id="register1">
           <option value="">Select</option>           
	       </select>    -->  
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="contract1" class="form-label"><b>Contract No:</b></label>
            <input type="text" class="form-control form-control-sm" id="contract1" placeholder="Contract No" readonly>         
           </div>
         
          
         
           <div class="col-md-4" style="padding-top:2%;">
            <label for="lot_no" class="form-label"><b>Lot No:</b></label>
            <input type="text" class="form-control form-control-sm" id="lot_no" placeholder="Lot No" readonly>        
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="invoice_no" class="form-label"><b>Invoice No:</b></label>
            <input type="text" class="form-control form-control-sm" id="invoice_no" placeholder="Invoice No" readonly>
           </div>
          
          
         
           <div class="col-md-4" style="padding-top:2%;"> 
            <label for="vehicle_in" class="form-label"><b>Vehicle In:</b></label> 
            <input type="time" class="form-control form-control-sm" id="vehicle_in" placeholder="Vehicle In" readonly="readonly">	     
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="driver1" class="form-label"><b>Driver Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="driver1" placeholder="Driver Name" readonly>
           </div>
         
          
         
           <div class="col-md-4" style="padding-top:2%;">
            <label for="dm_no" class="form-label"><b>Driver Mobile No:</b></label>
            <input type="text" class="form-control form-control-sm" id="dm_no" placeholder="Driver Mobile No" readonly>
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="dl_no" class="form-label"><b>License No:</b></label>
            <input type="text" class="form-control form-control-sm" id="dl_no" placeholder="License No" readonly>
           </div>
         
          
          
           <div class="col-md-4" style="padding-top:2%;">
            <label for="v_type" class="form-label"><b>Vehicle Type:</b></label>
            <input type="text" class="form-control form-control-sm" id="v_type" placeholder="Vehicle Type" readonly>
         <!--     <select class="form-control form-control-sm" id="v_type">
           <option value="">Select</option>           
	       </select> -->
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="hname1" class="form-label"><b>Helper name:</b></label>
            <input type="text" class="form-control form-control-sm" id="hname1" placeholder="Helper name" readonly>
           </div>
          
          
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="whom1" class="form-label"><b>Whom to meet:</b></label>
            <input type="text" class="form-control form-control-sm" id="whom1" placeholder="Whom to meet" readonly>
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="department1" class="form-label"><b>Department:</b></label>
            <input type="text" class="form-control form-control-sm" id="department1" placeholder="Department" readonly>
           </div>
          
          
          
           <div class="col-md-4" style="padding-top:2%;">
            <label for="in_remarks" class="form-label"><b>In Remarks:</b></label>
            <input type="text" class="form-control form-control-sm" id="in_remarks" placeholder="In Remarks" readonly>
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="invoice_no" class="form-label"><b>Invoice No:</b></label>
            <select class="form-control form-control-sm"  id="invoice_no" disabled>
            <option value="">Select</option>
            <option value="0">N/A</option>
            <!-- <option value="no"></option> -->
	        </select>
           </div>
          
          
          
           <div class="col-md-4" style="padding-top:2%;">
            <label for="lr_no" class="form-label"><b>LR.No:</b></label>
            <input type="text" class="form-control form-control-sm" id="lr_no" placeholder="LR.No" readonly>
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
            <label for="out_remarks" class="form-label"><b>Out Remarks:</b></label>
            <input type="text" class="form-control form-control-sm" id="out_remarks" placeholder="Out Remarks" readonly>
           </div>
           
           <div class="col-md-4" style="padding-top:2%;">
             <label for="rejectedout"><b>Rejected Out Remarks:</b></label>
             <input type="text" class="form-control form-control-sm" id="rejectedout" placeholder="Rejected Out Remarks">
             <div id="rejectedoutError" class="text-danger" style="display: none;">Rejected Out Remarks is required</div>
           </div>
         
          
          
           <div class="table-responsive p-3">
                <table class="table table-striped table-bordered table-sm" id="Table_ID1" style="width: 100%;">
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
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>                        
                    </tr>         
                </tbody>
                </table>
                </div>
  
  
      <!-- Modal Footer -->
      <div class="table-responsive p-3">
       <div class="modal-footer text-right">
          <button type="button" class="btn btn-primary"  id="btn_submit"   onclick="reject()">Rejected</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>        
       </div>
      </div>
    </div>
</div>




            </div>
        </div>
    </div>
</div>
</div>
 

  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

  <!-- Bootstrap JS and dependencies -->

<script>
  // jQuery to toggle visibility of container-wrapper on button click
  $('#Status').on('click', function() {
    $('#container1').toggle();  // Toggles the visibility of the div
  });

  $('#Details').on('click', function() {
    $('#container2').toggle();  // Toggles the visibility of the div
  });
  
  // jQuery to toggle visibility of container-wrapper on button click
  $('#Status1').on('click', function() {
    $('#container3').toggle();  // Toggles the visibility of the div
  });

  $('#Details1').on('click', function() {
    $('#container4').toggle();  // Toggles the visibility of the div
  });
</script>







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
    <script src="js/Rejected.js?v=<%=ts%>"></script>
    <script src="js/config.js"></script>
    <script src="js/logout.js"></script>
    <script src="js/username.js"></script>
    <script src="js/customertype.js"></script>
    <script src="js/createdby.js"></script>
 	<script src="js/modifiedby.js"></script>
 	 <script src="js/Sessionfilter.js"></script>
 	 	   <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
    "Insert": "modalScroll1",         // Create button
 
  };
</script>
<script src="js/permissions.js"></script>
 	<!-- <script src="js/factoryid.js"></script> -->
    
     


  <!-- Page level custom scripts -->
</body>
</html>