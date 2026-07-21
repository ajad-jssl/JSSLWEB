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
 <!--  <link href="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script> -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  
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
      <table class="table table-striped table-bordered table-sm" id="tableID2" width="100%">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>GatePass No</th>
            <th>Requested By</th>
            <th>Department</th>
            <th>Sent to Vendor/Employee</th>
            <th>Despatch</th>
            <th>Return Date</th>
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
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1200px; padding-bottom: 10px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Returnable</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->  
      <div class="modal-body">
         <div class="container" style="font-size:15px;">                   
          <div class="row mb-3">
           <div class="col-md-6">
              <label for="requested1" class="form-label">Requested By:</label>
              <select class="form-control form-control-sm" id="requested1">
              <option value="">Select</option>
              </select> 
              <div id="requested1Error" class="error-message" style="display: none;">Requested By is required</div>
              </div>
           
           <div class="col-md-6">
            <label for="department" class="form-label">Department:</label>
            <input type="text" class="form-control form-control-sm" id="department" value="Department" readonly>
             <div id="departmentError" class="error-message" style="display: none;">Department is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="selectvendor" class="form-label">Select Vendor/Employee:</label>
            <select class="form-control form-control-sm" id="selectvendor">
             <option value="">Select</option>
             <option value="1">Vendor</option>
             <option value="2">Employee</option>
		    </select>           
		     <div id="selectvendorError" class="error-message" style="display: none;">Vendor/Employee is required</div>
           </div>
           <!-- <div class="col-md-6">
            <label for="dispatch" class="form-label">Mode Of Dispatch:</label>
            <input type="text" class="form-control form-control-sm" id="dispatch" placeholder="Mode Of Dispatch">
            <div id="dispatchError" class="error-message" style="display: none;">Mode Of Dispatch is required</div>
           </div> -->
           <div class="col-md-6">
           <label for="dispatch" class="form-label">Mode Of Dispatch:</label>
           <select class="form-control form-control-sm" id="dispatch">
           <option value="">Select</option>
           </select>
           <div id="dispatchError" class="error-message" style="display: none;">Mode Of Dispatch is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="tovendor" class="form-label">Sent to Vendor:</label>
            <select disabled class="form-control form-control-sm" id="tovendor">
		    </select>
		     <div id="tovendorError" class="error-message" style="display: none;">Sent to Vendor is required</div>
           </div>
     
           <div class="col-md-6">
            <label for="employee" class="form-label">Sent to Employee:</label>
             <select disabled class="form-control form-control-sm" id="employee">
		    </select> 
		    <div id="employeeError" class="error-message" style="display: none;">Sent to Employee is required</div>
           </div>
          </div>
                 
         <div class="row mb-3">
          <div class="col-md-6">
           <label for="returndatee" class="form-label">Expected Return Date:</label>
           <input type="date" class="form-control form-control-sm" id="returndatee" placeholder="Expected Return Date">
           <div id="returndateeError" class="error-message" style="display: none;">Please select a valid return date</div>
          </div>

          <div class="col-md-6">
           <label for="contractno" class="form-label">Contract:</label>
           <select class="form-control form-control-sm" id="contractno">
		   </select>  
           <div id="contractnoError" class="error-message" style="display: none;">Contract is required</div>
          </div>
         </div>                 
         
         <div class="row mb-3">
          <div class="col-md-6">
           <label for="fordispatch" class="form-label">Reason For Dispatch:</label>
           <input type="text" class="form-control form-control-sm" id="fordispatch" placeholder="Reason For Dispatch">
           <div id="fordispatchError" class="error-message" style="display: none;">Reason For Dispatch is required</div>
          </div>
          
          <div class="col-md-6">
           <label for="remarks5" class="form-label">Remarks:</label>
           <input type="text" class="form-control form-control-sm" id="remarks5" placeholder="Remarks">
           <div id="remarks5Error" class="error-message" style="display: none;">Remarks is required</div>
          </div>
         </div>
         
         <div class="row mb-3">
          <div class="col-md-12">
           <label for="Enclosure3" class="form-label">Enclosure:</label>
           <input type="text" class="form-control form-control-sm" id="Enclosure3" placeholder="Enclosure">
           <div id="Enclosure3Error" class="error-message" style="display: none;">Enclosure is required</div>
          </div>
         </div>
         
         
<div class="row mb-3">
  <div class="col-md-12">
    <label for="returndate" class="form-label">Enter Line Item:</label>
    <div class="table-container">
      <table class="table table-striped table-bordered table-sm" id="TableID">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Item No</th>
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
                <!-- Options will be populated dynamically -->
              </select>
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" id="unit1" readonly>
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" id="description11" readonly>
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" id="description21" readonly>
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" id="quantity1" onkeydown="return allowOnlyPositive(event)">
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" id="price1" onkeydown="return allowOnlyPositive(event)">
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" id="remarks1">
            </td>
            <!-- <td>
              <button type="button" class="btn btn-sm btn-danger" onclick="deleteRow(this)">Delete</button>
            </td> -->
            <td class="text-center"><i class="bi bi-trash text-danger" style="cursor:pointer; font-size:16px;" onclick="deleteRow(this)" title="Delete"></i></td>
          </tr>
        </tbody>
      </table>
      <button type="button" class="btn btn-sm btn-secondary" onclick="addNewRow()">Add New Row</button>
    </div>
  </div>
</div>

      </div>
  
      <!-- Modal Footer -->
      <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      <button type="button" class="btn btn-primary" id="showConfirmationPopup">Create</button>
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmSubmission">YES</button>
                </div>
              </div>
            </div>
          </div>
          
                 <!-- jQuery -->
      <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
              
          
          
   <div class="modal fade" id="exampleModalScrollable12" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true" onload="generateSaleOrderNumber();">      
    <div class="modal-dialog modal-dialog-scrollable-responsive" style="max-width: 1200px; padding-bottom: 10px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Update Returnable</h5>
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
		      <div id="requested1Errorup" class="error-message" style="display: none;">Requested By is required</div>
           </div>
           
           <div class="col-md-6">
            <label for="departmentup" class="form-label">Department:</label>
            <input type="text" class="form-control form-control-sm" id="departmentup" value="Department" readonly>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="selectvendorup" class="form-label">Select Vendor/Employee:</label>
            <select class="form-control form-control-sm" id="selectvendorup">
             <option value="">Select</option>
             <option value="1">Vendor</option>
             <option value="2">Employee</option>
		    </select>           
		    <div id="selectvenempErrorup" class="error-message" style="display: none;">Vendor/Employee is required</div>
           </div>
           <!-- <div class="col-md-6">
            <label for="dispatchup" class="form-label">Mode Of Dispatch:</label>
            <input type="text" class="form-control form-control-sm" id="dispatchup" placeholder="Mode Of Dispatch">
            <div id="dispatchErrorup" class="error-message" style="display: none;">Mode of Dispatch is required</div>
           </div> -->
           <div class="col-md-6">
           <label for="dispatchup" class="form-label">Mode Of Dispatch:</label>
           <select class="form-control form-control-sm" id="dispatchup">
           <option value="">Select</option>
           </select>
           <div id="dispatchErrorup" class="error-message" style="display: none;">Mode of Dispatch is required</div>
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="tovendorup" class="form-label">Sent to Vendor:</label>
               <input type="text" class="form-control form-control-sm" id="tovendorup" value="Vendor" readonly>
           <!--  <select class="form-control form-control-sm" id="tovendorup">
		    </select> -->
           </div>
     
           <div class="col-md-6">
            <label for="employeeup" class="form-label">Sent to Employee:</label>
               <input type="text" class="form-control form-control-sm" id="employeeup" value="Employee" readonly>
            <!--  <select class="form-control form-control-sm" id="employeeup">
		    </select>  -->
           </div>
          </div>
                 
         <div class="row mb-3">
          <div class="col-md-6">
           <label for="returndateup" class="form-label">Expected Return Date:</label>
           <input type="date" class="form-control form-control-sm" id="returndateup" placeholder="Expected Return Date">
            <div id="returndateErrorup" class="error-message" style="display: none;">Return date is required</div>
          </div>
          
          <div class="col-md-6">
           <label for="contractnoup" class="form-label">Contract:</label>
           <select class="form-control form-control-sm" id="contractnoup">
		   </select>  
          </div>
         </div>                 
         
         <div class="row mb-3">
          <div class="col-md-6">
           <label for="fordispatchup" class="form-label">Reason For Dispatch:</label>
           <input type="text" class="form-control form-control-sm" id="fordispatchup" placeholder="Reason For Dispatch">
            <div id="fordispatchupErrorup" class="error-message" style="display: none;">Reason For Dispatch is required</div>
          </div>
          
          <div class="col-md-6">
           <label for="remarks5up" class="form-label">Remarks:</label>
           <input type="text" class="form-control form-control-sm" id="remarks5up" placeholder="Remarks">
          </div>
         </div>
         
         <div class="row mb-3">
          <div class="col-md-12">
           <label for="Enclosure3up" class="form-label">Enclosure:</label>
           <input type="text" class="form-control form-control-sm" id="Enclosure3up" placeholder="Enclosure">
          </div>
         </div>
         
         
<div class="row mb-3">
  <div class="col-md-12">
    <label for="returndate" class="form-label">Enter Line Item:</label>
    <div class="table-container">
      <table class="table table-striped table-bordered table-sm" id="updateTableID">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Item No</th>
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
              <select class="form-control form-control-sm" id="itemno1"  onchange="getitemdetails(1)" >
                <!-- Options will be populated dynamically -->
              </select>
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" id="unit1" readonly>
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" id="description11" readonly>
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" id="description21" readonly>
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" id="quantity1" onkeydown="return allowOnlyPositive(event)">
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" id="price1" onkeydown="return allowOnlyPositive(event)">
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" id="remarks1">
            </td>
            <!-- <td>
              <button type="button" class="btn btn-sm btn-danger" onclick="deleteRow3(this)">Delete</button>
            </td> -->
             <td class="text-center"><i class="bi bi-trash text-danger" style="cursor:pointer; font-size:16px;" onclick="deleteRow3(this)" title="Delete"></i></td>
          </tr>
        </tbody>
      </table>
    <!--   <button type="button" class="btn btn-sm btn-secondary" onclick="addNewRow3()">Add New Row</button> -->
    </div>
  </div>
</div>

      </div>
  
      <!-- Modal Footer -->
      <div class="modal-footer">
       <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
       <button type="button" class="btn btn-primary" id="updateButton">Update</button>
      </div>
    </div>
  </div>
 </div>
</div>

<div class="modal fade" id="exampleModalCenter61" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmupdYes">YES</button>
                </div>
              </div>
            </div>
          </div>
          
              <!-- jQuery -->
      <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
              

              
 <div class="modal fade" id="exampleModalScrollable125" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true" onload="generateSaleOrderNumber();">
  <div class="modal-dialog modal-dialog-scrollable-responsive" style="max-width: 1200px; padding-bottom: 90px;" role="document">
    <div class="modal-content">
    
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Cancel Returnable</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

    
      <div class="modal-body">
                   <div class="container" style="font-size:15px;">
          <div class="row mb-3"> 
            <div class="col-md-6">
            <label for="requestedby1" class="form-label">Requested By:</label>
             <input type="text" class="form-control form-control-sm" id="requestedby1" value="Date" readonly>
            <!--  <select disabled class="form-control form-control-sm" id="requestedby1">
		     </select>  -->
           </div>
                            
            <div class="col-md-6">
             <label for="date" class="form-label">Date:</label>
             <input type="text" class="form-control form-control-sm" id="date" value="Date" readonly>
            </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="department5" class="form-label">Department:</label>
            <input type="text" class="form-control form-control-sm" id="department5" value="Department" readonly>
           </div>
           
           <div class="col-md-6">
            <label for="vendor" class="form-label">Sent To Vendor:</label>
             <select disabled class="form-control form-control-sm" id="vendor">
		     </select> 
           </div>
          </div>
          
          <div class="row mb-3"> 
           <div class="col-md-6">
            <label for="despatch" class="form-label">Mode Of Despatch:</label>
            <input type="text" class="form-control form-control-sm" id="despatch" value="Mode Of Despatch" readonly>
           </div>
           
           <div class="col-md-6">
            <label for="expected" class="form-label">Expected Return Date:</label>
            <input type="text" class="form-control form-control-sm" id="expected" value="Expected Return Date" readonly>
           </div>
          </div> 
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="reason" class="form-label">Reason For Despatch:</label>
            <input type="text" class="form-control form-control-sm" id="reason" value="Reason For Despatch" readonly>
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
            <input type="text" class="form-control form-control-sm" id="cancelremarks" placeholder="Cancel Remarks">
           </div>
          </div>
          
          
           <div class="table-responsive p-3">              
          <div class="table-container">
           <table class="table table-striped table-bordered table-sm" id="Table2">
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
  
  
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id='cancel'>Cancel</button>
      </div>
    </div>
  </div>
 </div>
</div>
<div class="modal fade" id="exampleModalCenter69" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmcancel">YES</button>
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
    <!-- <script src="js/scrapedit.js"></script> -->
    <script src="js/username.js"></script>
    <script src="js/createdby.js"></script>
 	<script src="js/modifiedby.js"></script>
 	 <script src="js/Sessionfilter.js"></script>
 	<!-- <script src="js/factoryid.js"></script> -->
 	
 <script>
$(document).ready(function () {

    // Get today's date in YYYY-MM-DD format
    let today = new Date().toISOString().split('T')[0];

    // Set default value and disable previous dates
    $("#returndatee").attr("min", today);  // disable previous dates
    $("#returndatee").val(today);          // set default current date 
    $("#returndateup").attr("min", today);  // disable previous dates
    $("#returndateup").val(today);  
    // If you also want to disable future dates, uncomment below:
    // $("#returndate").attr("max", today);

});
</script>
 	
 	<!-- <script>
function validateReturnDate() {
    var returnDate = document.getElementById('returndate').value;
    var errorMessage = document.getElementById('returndateError');
    
    // Get today's date in the same format (yyyy-mm-dd)
    var today = new Date();
    var todayString = today.toISOString().split('T')[0]; // yyyy-mm-dd

    // Check if the selected date is before today's date
    if (returnDate < todayString) {
        errorMessage.style.display = 'block';  // Show error message
        document.getElementById('returndate').setCustomValidity('Invalid date');  // Optional: Add custom validity message to prevent form submission
    } else {
        errorMessage.style.display = 'none';  // Hide error message
        document.getElementById('returndate').setCustomValidity('');  // Reset custom validity
    }
}
</script> -->
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
<script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
<script src="js/permissions.js"></script>

  <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
 --><!-- Scroll to top -->
<script>
    // JavaScript to toggle the visibility of the input fields container
    document.getElementById("getButton").addEventListener("click", function() {
        document.getElementById("inputFieldsContainer").style.display = "block";
    });
</script>

<script>
    document.getElementById('selectvendor').addEventListener('change', function() {
        var vendorSelect = document.getElementById('tovendor');
        var employeeSelect = document.getElementById('employee');
        
        if (this.value === '1') {
            // Vendor selected, enable "Sent to Vendor" and disable "Sent to Employee"
            vendorSelect.disabled = false;
            employeeSelect.disabled = true;
        } else if (this.value === '2') {
            // Employee selected, enable "Sent to Employee" and disable "Sent to Vendor"
            vendorSelect.disabled = true;
            employeeSelect.disabled = false;
        } else {
            // No selection made, disable both dropdowns
            vendorSelect.disabled = true;
            employeeSelect.disabled = true;
        }
    });
</script>

<script>
    document.getElementById('selectvendor').addEventListener('change', function() {
        var vendorSelect = document.getElementById('tovendor');
        var employeeSelect = document.getElementById('employee');
        
        if (this.value === '2') {
            // Employee selected, enable "Sent to Employee" and disable "Sent to Vendor"
            employeeSelect.disabled = false;
            vendorSelect.disabled = true;
        } else if (this.value === '1') {
            // Vendor selected, enable "Sent to Vendor" and disable "Sent to Employee"
            employeeSelect.disabled = true;
            vendorSelect.disabled = false;
        } else {
            // No selection made, disable both dropdowns
            employeeSelect.disabled = true;
            vendorSelect.disabled = true;
        }
    });
</script>

<script>
function NonReturnable() {
    window.location.href = "NonReturnable.jsp";
}

function Received() {
    window.location.href = "Received.jsp";
}

function RGP() {
    window.location.href = "RGP.jsp";
}
</script> 

</body>
</html>