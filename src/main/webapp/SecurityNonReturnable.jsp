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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-xxx" crossorigin="anonymous" />
  <link href="css/masterpage.css" rel="stylesheet">
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
</head>

<body onload="QSlist();">
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
            <h1 class="h3 mb-0 text-gray-800">GPMS Security</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="GPMSDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item active" aria-current="page">GPMS Security</li>
             
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

<!--   <div class="table-responsive p-3">
      <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
        <thead>
          <tr>
            <th>Sl. No.</th>
            <th>Requested</th>
            <th>Department</th>
            <th>Vendor</th>
            <th>Despatch</th>
            <th>Contract</th>
            <th>Remarks</th> 
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>            
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Dynamic rows will be inserted here 
        </tbody>
      </table>
    </div>
  </div>
</div>-->



</div>
          </div>
  </div>
  </div>
 <div class="modal fade" id="exampleModalScrollable123" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true" onload="generateSaleOrderNumber();">
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1200px; padding-bottom: 160px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Security Non Returnable</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->  
      <div class="modal-body">
      <div class="container" style="font-size:15px;">
          <div class="row mb-3">
            <div class="col-md-6">
             <label for="gatepassno1" class="form-label">GatePass No:</label>
             <select class="form-control form-control-sm" id="gatepassno1">
		     </select> 
            </div>
            
            <div class="col-md-6">
             <label for="date" class="form-label">GatePass Date:</label>
             <input type="text" class="form-control form-control-sm" id="date" value="GatePass Date" readonly> 
            </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="requested" class="form-label">Requested By:</label>
		       <input type="text" class="form-control form-control-sm" id="requested" value="Requested By" readonly>
           </div>
           
           <div class="col-md-6">
            <label for="department" class="form-label">Department:</label>
            <input type="text" class="form-control form-control-sm" id="department" value="Department" readonly>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="vendor" class="form-label">Sent To Vendor:</label>
		      <input type="text" class="form-control form-control-sm" id="vendor" value="Sent To Vendor" readonly>
           </div>
           
           <div class="col-md-6">
            <label for="despatch" class="form-label">Despatch Mode:</label>
            <input type="text" class="form-control for-control-sm" id="despatch" value="Despatch Mode" readonly>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="reason" class="form-label">Reason for Despatch:</label>
            <input type="text" class="form-control form-control-sm" id="reason" value="Reason for Despatch" readonly>
           </div>
           
           <div class="col-md-6">
            <label for="remark" class="form-label">Remarks:</label>
            <input type="text" class="form-control form-control-sm" id="remark" value="Remarks" readonly>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="enclosure" class="form-label">Enclosure:</label>
            <input type="text" class="form-control form-control-sm" id="enclosure" value="Enclosure" readonly>
           </div>
           
           <div class="col-md-6">
            <label for="cancelremarks" class="form-label">Cancel Remarks:</label>
            <input type="text" class="form-control form-control-sm" id="cancelremarks" value="Cancel Remarks" readonly>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-12">
            <label for="securityremarks" class="form-label">Security Remarks:</label>
            <input type="text" class="form-control form-control-sm" id="securityremarks" placeholder="Security Remarks">
              <div id="securityremarksError" class="error-message" style="display: none;">Security Remarks is required</div>
           </div>
          </div>
         </div>
  
      <!-- Modal Footer -->
     <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary"  id="submitngp">Create</button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="exampleModalCenter72" tabindex="-1" role="dialog"
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
                  <b>Are you sure you want to Create?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelngpmodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmngpsecurity">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- jQuery -->
      <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
              
               <div class="modal fade" id="exampleModalCenterDupUP" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content" style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">
            <div class="modal-header1">
                <!-- Modal Header -->
            </div>
            <div class="modal-body">
                <b id="errorMessageup"></b>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" id="modalok">OK</button>
            </div>
        </div>
    </div>
</div>

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
  <script src="js/Security.js?v=<%=ts%>"></script>
  <!-- <script src="js/scrapedit.js"></script> -->
 <script src="js/username.js"></script>
 
  <script src="js/createdby.js"></script>
 	   <script src="js/modifiedby.js"></script>
 	    <script src="js/Sessionfilter.js"></script>
 	       	  <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
  <script src="js/permissions.js"></script>
 	 <!--  <script src="js/factoryid.js"></script> -->
</div>
</div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>