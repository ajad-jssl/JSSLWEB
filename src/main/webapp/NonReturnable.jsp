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
 <!-- Include Bootstrap CSS -->
<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">

 <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

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
            <h1 class="h3 mb-0 text-gray-800">GPMS Entry</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="GPMSDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item active" aria-current="page">GPMS Entry</li>
             
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
      <table class="table table-striped table-bordered table-sm" id="table1" width="100%">
        <thead>
          <tr>
            <th>Sl. No.</th>
            <th>GatePass No</th>
            <th>Requested</th>
            <th>Department</th>
            <th>Vendor</th>
            <th>Despatch</th>
            <th>Edit</th>
            <th>Cancel</th>
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
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1200px; padding-bottom: 140px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Non Returnable</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->  
      <div class="modal-body">
    <div class="container" style="font-size:13px;">
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="requestednon1" class="form-label">Requested By:</label>
            <select class="form-control form-control-sm" id="requestednon1">
		    </select> 
		      <div id="requested1Error" class="error-message" style="display: none;">Requested By is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="department6" class="form-label">Department:</label>
            <input type="text" class="form-control form-control-sm" id="department6" value="Department" readonly>
              <div id="department6Error" class="error-message" style="display: none;">Department is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="tovendor"class="form-label">Sent To Vendor:</label>
            <select class="form-control form-control-sm" id="vendor">
		    </select> 
		     <div id="vendorError" class="error-message" style="display: none;">Sent To Vendor is required</div>
           </div>
           
           <!-- <div class="col-md-6">
            <label for="despatchmode" class="form-label">Despatch Mode:</label>
            <input type="text" class="form-control form-control-sm" id="despatchmode" placeholder="Despatch Mode">
             <div id="despatchmodeError" class="error-message" style="display: none;">Despatch Mode is required</div>
           </div> -->
           <div class="col-md-6">
           <label for="despatchmode" class="form-label">Mode Of Dispatch:</label>
           <select class="form-control form-control-sm" id="despatchmode">
           <option value="">Select</option>
           </select>
           <div id="despatchmodeError" class="error-message" style="display: none;">Mode Of Dispatch is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="contract6" class="form-label">Contract:</label>
            <select class="form-control form-control-sm" id="contract6">
		    </select> 
		    <div id="contract6Error" class="error-message" style="display: none;">Contract is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="fordispatch1" class="form-label">Reason for dispatch:</label>
            <input type="text" class="form-control form-control-sm" id="fordispatch1" placeholder="Reason for dispatch">
            <div id="fordispatch1Error" class="error-message" style="display: none;">Reason for dispatch is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="remarks6" class="form-label">Remarks:</label>
            <input type="text" class="form-control form-control-sm" id="remarks6" placeholder="Remarks">
              <div id="remarks6Error" class="error-message" style="display: none;">Remarks is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="enclosure5" class="form-label">Enclosure:</label>
            <input type="text" class="form-control form-control-sm" id="enclosure5" placeholder="Enclosure">
              <div id="enclosure5Error" class="error-message" style="display: none;">Enclosure is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
          <div class="col-md-12">
          <label for="returndate" class="form-label">Enter Line Item:</label>
          <div class="table-container">
           <table class="table table-striped table-bordered table-sm" id="TableIDnon">
            <thead>
            <tr>
                <th>Sl.No</th>
                <th>Item Description</th>
                <th>Unit</th>
                <th>Description1</th>
                <th>Description2</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Remarks</th>        
                <th>Action</th>        
            </tr>
           </thead>
           <tbody>
            <tr>
                <td>1</td>
                <td>
                 <select class="form-control form-control-sm" id="itemno1" onchange="getitemdetails(1)">
		         </select> 
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="unit1" value="" readonly>
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="description11" value="" readonly>
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="description21" value="" readonly>
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="quantity1" placeholder="" onkeydown="return allowOnlyPositive(event)">
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="price1" placeholder="" onkeydown="return allowOnlyPositive(event)">
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="remarks1" placeholder="">
                </td>                
             <!-- <td>
              <button type="button" class="btn btn-sm btn-danger" onclick="deleteRownon(this)">Delete</button>
            </td> -->
             <td class="text-center"><i class="bi bi-trash text-danger" style="cursor:pointer; font-size:16px;" onclick="deleteRownon(this)" title="Delete"></i></td>
          </tr>
        </tbody>
      </table>
      <button type="button" class="btn btn-sm btn-secondary" onclick="addNewRowupnon()">Add New Row</button>
    </div>
  </div>
</div>
  
      <!-- Modal Footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id="showcreate">Create</button>
      </div>
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmYess">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- jQuery -->
      <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

  <div class="modal fade" id="exampleModalScrollable15" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true" onload="generateSaleOrderNumber();">
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1200px; padding-bottom: 140px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Update Non Returnable</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->  
      <div class="modal-body">
    <div class="container" style="font-size:15px;">
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="requested1up" class="form-label">Requested By:</label>
            <select class="form-control form-control-sm" id="requested1up">
		    </select> 
		     <div id="requested1uperror" class="error-message" style="display: none;">Requested by is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="department6up" class="form-label">Department:</label>
            <input type="text" class="form-control form-control-sm" id="department6up" value="Department" readonly>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="tovendor"class="form-label">Sent To Vendor:</label>
            <select class="form-control form-control-sm" id="tovendor">
		    </select> 
		     <div id="tovendorerror" class="error-message" style="display: none;">Vendor is required</div>
           </div>
           
          <!--  <div class="col-md-6">
            <label for="despatchmodeup" class="form-label">Despatch Mode:</label>
            <input type="text" class="form-control form-control-sm" id="despatchmodeup" placeholder="Despatch Mode">
             <div id="despatchmodeuperror" class="error-message" style="display: none;">Mode Of Dispatch is required</div>
           </div> -->
           <div class="col-md-6">
           <label for="despatchmodeup" class="form-label">Mode Of Dispatch:</label>
           <select class="form-control form-control-sm" id="despatchmodeup">
           <option value="">Select</option>
           </select>
           <div id="despatchmodeuperror" class="error-message" style="display: none;">Mode Of Dispatch is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="contract6up" class="form-label">Contract:</label>
            <select class="form-control form-control-sm" id="contract6up">
		    </select> 
           </div>
           
           <div class="col-md-6">
            <label for="fordispatch1up" class="form-label">Reason for dispatch:</label>
            <input type="text" class="form-control form-control-sm" id="fordispatch1up" placeholder="Reason for dispatch">
             <div id="fordispatch1uperror" class="error-message" style="display: none;">Reason for Dispatch is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="remarks6up" class="form-label">Remarks:</label>
            <input type="text" class="form-control form-control-sm" id="remarks6up" placeholder="Remarks">
           </div>
           
           <div class="col-md-6">
            <label for="enclosure5up" class="form-label">Enclosure:</label>
            <input type="text" class="form-control form-control-sm" id="enclosure5up" placeholder="Enclosure">
           </div>
          </div>
          
          <div class="row mb-3">
          <div class="col-md-12">
          <label for="returndate" class="form-label">Enter Line Item:</label>
          <div class="table-container">
           <table class="table table-striped table-bordered table-sm" id="TableID1non">
            <thead>
            <tr>
                <th>Sl.No</th>
                <th>Item Description</th>
                <th>Unit</th>
                <th>Description1</th>
                <th>Description2</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Remarks</th> 
                <th>Action</th>                
            </tr>
           </thead>
           <tbody>
            <tr>
                <td>1</td>
                <td>
                 <select class="form-control form-control-sm" id="itemno1" onchange="getitemdetails(1)">
		         </select> 
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="unit1" value="" readonly>
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="description11" value="" readonly>
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="description21" value="" readonly>
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="quantity1" placeholder="" onkeydown="return allowOnlyPositive(event)">
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="price1" placeholder="" onkeydown="return allowOnlyPositive(event)">
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="remarks1" placeholder="">
                </td>                
         
               <td class="text-center"><i class="bi bi-trash text-danger" style="cursor:pointer; font-size:16px;" onclick="deleteRownon1(this)" title="Delete"></i></td>
      
          </tr>
        </tbody>
      </table>
   <!--    <button type="button" class="btn btn-sm btn-secondary" onclick="addNewRownon1()">Add New Row</button> -->
    </div>
  </div>
</div>
  
      <!-- Modal Footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id="updatenonreturn">Update</button>
      </div>
    </div>
  </div>
</div>
</div>
</div>

<div class="modal fade" id="exampleModalCenter60" tabindex="-1" role="dialog"
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
                  <b>Are you sure you want to Update?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmupdYess">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- jQuery -->
      <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>


 <div class="modal fade" id="exampleModalScrollable126" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true" onload="generateSaleOrderNumber();">
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1200px; padding-bottom: 170px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Cancel Non Returnable</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->  
      <div class="modal-body">
               <div class="container" style="font-size:15px;">
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="requestedby1" class="form-label">Requested By:</label>
            <input type="text" class="form-control form-control-sm" id="requestedby1" value="requestedby1" readonly>
            <!--<select disabled class="form-control form-control-sm" id="requestedby1">
		    </select>-->
           </div>
          
            <div class="col-md-6">
             <label for="date" class="form-label">Date:</label>
             <input type="text" class="form-control form-control-sm" id="date" value="Date" readonly>
            </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="department" class="form-label">Department:</label>
            <input type="text" class="form-control form-control-sm" id="department5" value="Department" readonly>
           </div>
           
           <div class="col-md-6">
            <label for="vendor1" class="form-label">Sent To Vendor:</label>
            <input type="text" class="form-control form-control-sm" id="vendor1" value="vendor" readonly>
            <!--<select disabled class="form-control form-control-sm" id="vendor">
		     </select>-->
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="despatch" class="form-label">Despatch Mode:</label>
            <input type="text" class="form-control form-control-sm" id="despatch" value="Despatch Mode" readonly>
           </div>
           
           <div class="col-md-6">
            <label for="reason" class="form-label">Reason for despatch:</label>
            <input type="text" class="form-control form-control-sm" id="reason" value="Reason for despatch" readonly>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="remark" class="form-label">Remarks:</label>
            <input type="text" class="form-control form-control-sm" id="remark" value="Remarks" readonly>
           </div>
           
           <div class="col-md-6">
            <label for="enclosure" class="form-label">Enclosure:</label>
            <input type="text" class="form-control form-control-sm" id="enclosure" value="Enclosure" readonly>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-12">
            <label for="cancelremarks" class="form-label">Cancel Remarks:</label>
            <input type="text" class="form-control form-control-sm" id="cancelremarks" placeholder="Cancel Remarks">
           </div>
          </div>
          
            <div class="table-responsive p-3">              
            <div class="table-container">
             <table class="table table-striped table-bordered table-sm" id="Table3">
              <thead>
               <tr>
            	<th>Sl.No</th>
                <th>Item</th>
                <th>Unit</th>
                <th>Description1</th>
                <th>Description2</th>              
                <th>Quantity</th>
                <th>Price</th>
                <th>Remarks</th>              
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
               </tr>            
             </tbody>
            </table>
           </div>       
          </div>    
         </div>
  
      <!-- Modal Footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id="cancelnon">Cancel</button>
      </div>
    </div>
  </div>
 </div>
</div>

<div class="modal fade" id="exampleModalCenter70" tabindex="-1" role="dialog"
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
                  <b>Are you sure you want to Cancel?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmngpcancel">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- jQuery -->
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
  <script src="js/Entry.js?v=<%=ts%>"></script>
 <!--  <script src="js/scrapedit.js"></script> -->
 <script src="js/username.js"></script>
 
  <script src="js/createdby.js"></script>
 	   <script src="js/modifiedby.js"></script>
 	    <script src="js/Sessionfilter.js"></script>
 	 <!--  <script src="js/factoryid.js"></script> -->
<script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
<script src="js/permissions.js"></script>

<script>
function allowOnlyPositive(e) {
    // Block minus key (-)
    if (e.key === '-' || e.keyCode === 189 || e.keyCode === 109) {
        return false;
    }

    // Allow numbers, backspace, delete, arrows, tab
    if (
        (e.key >= '0' && e.key <= '9') ||
        ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
    ) {
        return true;
    }

    return false;
}
</script>
<!-- Scroll to top -->
<script>
    // JavaScript to toggle the visibility of the input fields container
    document.getElementById("getButton").addEventListener("click", function() {
        document.getElementById("inputFieldsContainer").style.display = "block";
    });
</script>

</body>
</html>