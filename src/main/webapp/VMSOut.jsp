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
 
	 <link href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
	
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
 <link rel="stylesheet" href="externalLibrary/cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-xxx" crossorigin="anonymous" />
  <link href="css/masterpage.css" rel="stylesheet">
  <link href="css/ruang-admin.min.css?v=1.0" rel="stylesheet">
<link href="css/main.css?v=1.0" rel="stylesheet">
<link href="css/masterpage.css?v=1.0" rel="stylesheet">


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

<body >
  <div id="wrapper">
 
      <%@ include file="VMSSidebar.jsp" %>
 
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
            <h1 class="h3 mb-0 text-gray-800">VMS OUT</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="VMSDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item active" aria-current="page">VMS OUT</li>
             
            </ol>
          </div>
<div class="row mb-3">
<div class="col-lg-12">
  <div class="card mb-4">
    <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
        <button data-toggle="modal" id="modalScroll1">
          <i class="fas fa-plus"></i> Create
        </button>
      </div>
    </div>

   <div class="table-responsive p-3">
      <table class="table table-striped table-bordered table-sm" id="table_ID1" width="100%">

        <tbody>

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
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1300px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Visitors Out</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->  
              <div class="modal-body">
            <div class="row mb-3">
          <div class="col-md-2">
           <label for="Visitor_id" class="form-label"><b>Visitor ID:</b></label>
           <select class="form-control form-control-sm" id="Visitor_id">
           <option value="">Select</option>          
	       </select>
	       <div id="Vehicle_idError" class="error-message" style="display: none;">Visitor ID is required</div>
          </div>
         </div>
                 
   <div id="container1" >
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 5px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Visitors Out Details</h5>
        
              <div class="row mb-3"> 
               <div class="col-md-4">
                <label for="company2"><b>Company:</b></label>              
                <input type="text" class="form-control form-control-sm" id="company2" placeholder="Company" readonly>              
               </div>
               
               <div class="col-md-4" >
                <label for="location"><b>Location:</b></label>
                <input type="text" class="form-control form-control-sm" id="location" placeholder="Location" readonly>               
               </div>
        
               <div class="col-md-4">
                <label for="address"><b>Address:</b></label>
                <input type="text" class="form-control form-control-sm" id="address" placeholder="Address" readonly>     
               </div>
              </div>
              
              <div class="row mb-3">
               <div class="col-md-4" style="padding-top:1%;">
                <label for="date"><b>Date:</b></label>
                <input type="datetime-local" class="form-control form-control-sm" id="datetime" placeholder="Date" readonly>             
               </div>
               
               <div class="col-md-4" style="padding-top:1%;">
                <label for="visitor_name"><b>Visitor Name:</b></label>
                <input type="text" class="form-control form-control-sm" id="visitor_name" placeholder="Visitor Name" readonly>
               </div>
               
               <div class="col-md-4" style="padding-top:1%;">
                <label for="contact_no"><b>Contact No:</b></label>
                <input type="text" class="form-control form-control-sm" id="contact_no" placeholder="Contact No" readonly>                
               </div>
              </div>
              
              <div class="row mb-3"> 
               <div class="col-md-4" style="padding-top:1%;">
                <label for="vehicle_no"><b>Vehicle No:</b></label>
                <input type="text" class="form-control form-control-sm" id="vehicle_no" placeholder="Vehicle No" readonly="readonly">               
               </div>
               
               <div class="col-md-4" style="padding-top:1%;">
                <label for="vehicle_type"><b>Vehicle Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="vehicle_type" placeholder="Vehicle Type" readonly="readonly">
               </div>                                                  
               
                <div class="col-md-4" style="padding-top:1%;">
                <label for="whom"><b>Whom to Meet:</b></label>
                <input type="text" class="form-control form-control-sm" id="whom" placeholder="Whom to Meet" readonly="readonly">            
               </div>
              </div>
              
              <div class="row mb-3"> 
                <div class="col-md-4" style="padding-top:1%;">
                <label for="department"><b>Department:</b></label>
                <input type="text" class="form-control form-control-sm" id="department" placeholder="Department" readonly> 
               </div>
               
                <div class="col-md-4" style="padding-top:1%;">
                <label for="in_time"><b>IN Time:</b></label>
                <input type="text" class="form-control form-control-sm" id="in_time" placeholder="IN Time" readonly>
               </div>
               
               <div class="col-md-4" style="padding-top:1%;">
                <label for="purpose"><b>Purpose:</b></label>
                <input type="text" class="form-control form-control-sm" id="purpose" placeholder="Purpose" readonly>   
               </div>
              </div>
              
               <div class="row mb-3"> 
                <div class="col-md-4" style="padding-top:1%;">
                <label for="in_remarks"><b>In Remarks:</b></label>
                <input type="text" class="form-control form-control-sm" id="in_remarks" placeholder="In Remarks" readonly>   
               </div>
                
                <div class="col-md-4" style="padding-top:1%;">
                 <label for="out_remarks"><b>Out Remarks:</b></label>
                 <input type="text" class="form-control form-control-sm" id="out_remarks" placeholder="Out Remarks">
                 <div id="out_remarksError" class="error-message" style="display: none;">Out Remarks is required</div>   
                </div>
               </div>
     <div class="table-responsive p-3">
  <!-- Buttons -->
        <div class="mt-4 text-right">
         <button type="button" class="btn btn-primary" id="btnsubmit">Create</button>
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

<div class="modal fade" id="exampleModalCenter205" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmvisitoroutentryyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
           
              
         <div class="modal fade" id="exampleModalCenterDupUPcon" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 70%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                   
                 </div>
                <div class="modal-body">
                  <b id="errorMessageupcon"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" id="modal_okk">OK</button> 
                </div>
              </div>
            </div>
          </div> 

 <script src="vendor/jquery/jquery.min.js"></script>
       <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
 	  	  <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
 
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

      
      <!-- Page level plugins -->
      <script src="vendor/datatables/jquery.dataTables.min.js"></script>
      <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
   
  <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>

    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>

   <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
  <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
  <script src="js/Visitors.js?v=<%=ver(application, "/js/Visitors.js")%>"></script>
   <script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
 	   <script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
 	    <script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
 	   
 	   	   <script>

  window.actionElementMap = {
  };
</script>
<script src="js/permissions.js?v=<%=ver(application, "/js/permissions.js")%>"></script>

		<script src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>



</body>
</html>