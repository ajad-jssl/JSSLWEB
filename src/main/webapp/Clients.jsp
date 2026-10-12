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
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css" />
      <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
      <link href="css/ruang-admin.min.css" rel="stylesheet" />
      <link href="vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">
    
    <link rel="stylesheet" href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
     <link rel="stylesheet" href="css/main.css">
     
   
     
          <script src="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>
     <link href="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
     <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
     <link href="externalLibrary/cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet" />
     <link href="css/masterpage.css" rel="stylesheet">

    
     <script src="externalLibrary/maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
     <link href="externalLibrary/maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
 


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
				            <!-- <span class="ml-2 d-none d-lg-inline text-white small" id="selectedFactoryId">No Factory Selected</span> -->
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
            <h1 class="h3 mb-0 text-gray-800">Client Master</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="GPMSDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item active" aria-current="page">Client Master</li>
             
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
        <thead>
          <tr>
            <th>Sl. No.</th>           
            <th>Vendor Name</th>
            <th>Contact 1</th>
            <th>ContactNo</th>                  
            <th>Address</th>       
            <th>City</th>
            <th>State</th>                         
            <th>GSTIN</th>            
            <th>Remarks</th>       
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Dynamic rows will be inserted here -->
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
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1200px; padding-bottom: 90px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Client Master</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->  
      <div class="modal-body">
      <div class="row mb-3">
          <div class="col-md-12" style=display:none;>
           <label for="vendor" class="form-label"><b>Select Vendor to update:</b></label>
           <select class="form-control form-control-sm" id="vendor">
	       </select>
	       <div id="vendorError" class="error-message" style="display: none;">Select Vendor to update is required</div>
          </div>
         </div>
          <div class="row mb-3">
            <div class="col-md-6">
             <label for="vendorname" class="form-label"><b>VendorName:</b></label>
             <input type="text" class="form-control form-control-sm" id="vendorname" placeholder="Vendor Name">
             <div id="vendornameError" class="error-message" style="display: none;">Vendor Name is required</div>
            </div>
            
            <div class="col-md-6">
             <label for="cname1" class="form-label"><b>Point Of Contact 1:</b></label>
             <input type="text" class="form-control form-control-sm" id="cname1" placeholder="Point Of Contact 1">
             <div id="cname1Error" class="error-message" style="display: none;">Point Of Contact 1 is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="cname2" class="form-label"><b>Point Of Contact 2:</b></label>
            <input type="text" class="form-control form-control-sm" id="cname2" placeholder="Point Of Contact 2" readonly>
            <div id="cname2Error" class="error-message" style="display: none;">Point Of Contact 2 is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="cnumber" class="form-label"><b>Contact Number:</b></label>
            <input type="text" class="form-control form-control-sm" id="cnumber" placeholder="Contact Number" maxlength="10" oninput="validateContact('cnumber','cnumberError')">
            <div id="cnumberError" class="error-message" style="display: none;">Contact number must be exactly 10 digits</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="cemail" class="form-label"><b>Contact Email:</b></label>
            <input type="text" class="form-control form-control-sm" id="cemail" placeholder="Contact Email">
            <div id="cemailError" class="error-message" style="display: none;">Contact Email is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="address1" class="form-label"><b>Address:</b></label>
            <input type="text" class="form-control form-control-sm" id="address1" placeholder="Address">
            <div id="address1Error" class="error-message" style="display: none;">Address is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
          
           
             <div class="col-md-6">
            <label for="state" class="form-label"><b>State:</b></label>
            <select class="form-control form-control-sm" id="state">
	        </select> 
	        <div id="stateError" class="error-message" style="display: none;">State is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="district" class="form-label"><b>District:</b></label>
            <input type="text" class="form-control form-control-sm" id="district" placeholder="District">
            <div id="districtError" class="error-message" style="display: none;">District is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6"> 
            <label for="city" class="form-label"><b>City:</b></label> 
            <select class="form-control form-control-sm" id="city">
            <option value="">Select City</option>
	        </select> 
	        <div id="cityError" class="error-message" style="display: none;">City is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="pincode" class="form-label"><b>Pin Code:</b></label>
            <input type="text" class="form-control form-control-sm" id="pincode" placeholder="Pin Code:" maxlength="6" inputmode="numeric" oninput="restrictPin('pincode','pincodeError')">
            <div id="pincodeError" class="error-message" style="display: none;">Pin Code must be exactly 6 digits</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="gstin" class="form-label"><b>GSTIN:</b></label>
            <input type="text" class="form-control form-control-sm" id="gstin" placeholder="GSTIN">
            <div id="gstinError" class="error-message" style="display: none;">GSTIN is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="remarks" class="form-label"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm" id="remarks" placeholder="Remarks">
            <div id="remarksError" class="error-message" style="display: none;">Remarks is required</div>
           </div>
          </div>
  
  
      <!-- Modal Footer -->
     <div class="modal-footer">
      <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
     <button type="button" class="btn btn-sm btn-success" id="showclient">Create</button>
      </div>
    </div>
  </div>
 </div>
</div>

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
                    <button type="button" class="btn btn-info btn-sm" id="confirmYes">YES</button>
                </div>
              </div>
            </div>
          </div>
          
      
              
               <div class="modal fade" id="exampleModalCenterclient" tabindex="-1" role="dialog"
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
                  <b id="errorMessageupclient"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" id="modalokk">OK</button> 
                </div>
              </div>
            </div>
          </div> 

<div class="modal fade" id="exampleModalScrollable15" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1200px; padding-bottom: 90px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Update Clients Master</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->  
      <div class="modal-body">
      <div class="row mb-3">
          <div class="col-md-12" style=display:none;>
           <label for="vendorup" class="form-label"><b>Select Vendor to update:</b></label>
           <select class="form-control form-control-sm" id="vendorup">
	       </select>
	       <div id="vendorupError" class="error-message" style="display: none;">Select Vendor to update is required</div>
          </div>
         </div>
          <div class="row mb-3">
            <div class="col-md-6">
             <label for="vendornameup" class="form-label"><b>VendorName:</b></label>
             <input type="text" class="form-control form-control-sm" id="vendornameup" placeholder="Vendor Name" disabled="disabled">
             <div id="vendornameupError" class="error-message" style="display: none;">Vendor Name is required</div>
            </div>
            
            <div class="col-md-6">
             <label for="cname1up" class="form-label"><b>Point Of Contact 1:</b></label>
             <input type="text" class="form-control form-control-sm" id="cname1up" placeholder="Point Of Contact 1">
             <div id="cname1upError" class="error-message" style="display: none;">Point Of Contact 1 is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="cname2up" class="form-label"><b>Point Of Contact 2:</b></label>
            <input type="text" class="form-control form-control-sm" id="cname2up" placeholder="Point Of Contact 2" readonly>
           <!--  <div id="cname2upError" class="error-message" style="display: none;">Point Of Contact 2 is required</div> -->
           </div>
           
           <div class="col-md-6">
            <label for="cnumberup" class="form-label"><b>Contact Number:</b></label>
            <input type="text" class="form-control form-control-sm" id="cnumberup" placeholder="Contact Number" maxlength="10" oninput="validateContact('cnumberup','cnumberupError')">
            <div id="cnumberupError" class="error-message" style="display: none;">Contact number must be exactly 10 digits</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="cemailup" class="form-label"><b>Contact Email:</b></label>
            <input type="text" class="form-control form-control-sm" id="cemailup" placeholder="Contact Email">
            <div id="cemailupError" class="error-message" style="display: none;">Contact Email is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="address1up" class="form-label"><b>Address:</b></label>
            <input type="text" class="form-control form-control-sm" id="address1up" placeholder="Address">
            <div id="address1upError" class="error-message" style="display: none;">Address is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
           
              <div class="col-md-6">
            <label for="stateup" class="form-label"><b>State:</b></label>
            <select class="form-control form-control-sm" id="stateup" onchange="loadCitiesOnStateChangeUpdate()">
	        </select> 
	        <div id="stateupError" class="error-message" style="display: none;">State is required</div>
           </div>
           <div class="col-md-6">
            <label for="districtup" class="form-label"><b>District:</b></label>
            <input type="text" class="form-control form-control-sm" id="districtup" placeholder="District">
            <div id="districtupError" class="error-message" style="display: none;">District is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
       
           <div class="col-md-6"> 
            <label for="cityup" class="form-label"><b>City:</b></label> 
            <select class="form-control form-control-sm" id="cityup">
	        </select> 
	        <div id="cityupError" class="error-message" style="display: none;">City is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="pincodeup" class="form-label"><b>Pin Code:</b></label>
            <input type="text" class="form-control form-control-sm" id="pincodeup" placeholder="Pin Code:" maxlength="6" inputmode="numeric" oninput="restrictPin('pincodeup','pincodeupError')">
            <div id="pincodeupError" class="error-message" style="display: none;">Pin Code must be exactly 6 digits</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="gstinup" class="form-label"><b>GSTIN:</b></label>
            <input type="text" class="form-control form-control-sm" id="gstinup" placeholder="GSTIN">
            <div id="gstinupError" class="error-message" style="display: none;">GSTIN is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="remarksup" class="form-label"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm" id="remarksup" placeholder="Remarks">
            <div id="remarksupError" class="error-message" style="display: none;">Remarks is required</div>
           </div>
          </div>
  
  
      <!-- Modal Footer -->
     <div class="modal-footer">
     <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Cancel</button>
     <button type="button" class="btn btn-sm btn-success" id="updateclient">Update</button>
      </div>
    </div>
  </div>
 </div>
</div>

 <div class="modal fade" id="exampleModalCenter68" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmclientupd">YES</button>
                </div>
              </div>
            </div>
          </div>


       <script src="externalLibrary/cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>   
  <script src="vendor/jquery/jquery.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
   
      <script src="vendor/datatables/jquery.dataTables.min.js"></script>
      <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
       <script src="js/config.js?v=<%=jsVersion%>"></script>

     <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
  <script src="js/Clients.js?v=<%=jsVersion%>"></script>
      <script src="js/logout.js?v=<%=jsVersion%>"></script>
  <script src="js/username.js?v=<%=jsVersion%>"></script>		  
   <script src="js/createdby.js?v=<%=jsVersion%>"></script>
    <script src="js/Sessionfilter.js?v=<%=jsVersion%>"></script>
    
<script>
function validateContact(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    // Allow digits only
    input.value = input.value.replace(/\D/g, '');

    if (input.value.length !== 10) {
        error.style.display = "block";
    } else {
        error.style.display = "none";
    }
}
</script>

<script>
function restrictPin(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    // Allow digits only
    input.value = input.value.replace(/\D/g, '');

    // Restrict to max 6 digits
    if (input.value.length > 6) {
        input.value = input.value.slice(0, 6);
    }

    // Optional error display
    if (input.value.length !== 6) {
        error.style.display = "block";
    } else {
        error.style.display = "none";
    }
}
</script>
    
<script>

  window.actionElementMap = {
  };
</script>


</body>
</html>