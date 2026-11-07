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
   <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css" />
   <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
   <link href="css/ruang-admin.min.css" rel="stylesheet" />
   <link href="vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">
    
  <link rel="stylesheet" href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
   <link rel="stylesheet" href="css/main.css">
    
     
       <link href="css/main.css?v=1.0" rel="stylesheet">
       <link href="css/masterpage.css?v=1.0" rel="stylesheet">

  <script src="externalLibrary/code.jquery.com/jquery-3.6.0.min.js"></script>
   <script src="externalLibrary/cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
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
.field-error {
    border: 1px solid red !important;
}
.validation-msg {
    color: red;
    font-size: 11px;
    margin-top: 3px;
}
  
</style>
  <style>
    #videoElement, #capturedImage {
      width: 300px;
      height: 225px;
      border: 2px solid #ccc;
      margin-bottom: 10px;
      object-fit: cover;
    }
  </style>
  

</head>

<body >
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
            <h1 class="h3 mb-0 text-gray-800">Vehicle Entry</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="VehicleDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item active" aria-current="page">Vehicle Entry</li>
              
            </ol>
          </div>
          
          
<div class="row mb-3" id="vehicleentry">
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
      <table class="table table-striped table-bordered table-sm" id="Table1" width="100%">
        <thead>
          <tr>    
          		<th>SL no</th>
          		<th>Vehicle ID</th>
                <th>Vehicle No</th>
                <th>Driver Name</th>
                <th>Driver Mobile No</th>
                <th>Driver License No</th>              
                <th>Helper Name</th>
                <th>Remarks</th>
                <th>Action</th>            
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

<!-- Modal 1: Create QS Package Details -->
<!-- Form Container with Outline and Title -->

    <div class="modal fade" id="exampleModalScrollable123" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Vehicle Loading</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="register"><b>Register Type:</b></label>               
                 <select class="form-control form-control-sm" id="register">
                <!--  <option value="1"></option>
                  <option value="2"></option> -->
                 </select>
               </div>
               
               
               <div class="form-group col-md-3">
                <label for="Select"><b>Select Type:</b></label>
                <select id="Select" disabled class="form-control form-control-sm">                          
                <option value="" selected>Select</option> 
                </select>
               </div>
                             
               
               <div class="form-group col-md-3">
               <label for="vehicle"><b>Vehicle Type:</b></label>
               <select id="vehicle" class="form-control form-control-sm">
               <option value="" selected>Select</option>
               <option value="5">Self</option>
               <option value="9">Miscellaneous</option>                                
               </select>
               </div>
   
                <div class="form-group col-md-3">
                 <label for="Vehicle_No"><b>Vehicle No:</b></label>
                 <select id="Vehicle_No" class="form-control form-control-sm">
                  <option value="0">Select</option>                         
                 </select>
               </div>
              </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="container1" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Vehicle Status</h5>
        
       <div class="form-row">
         <div class="col-md-3"> 
          <label for="RC"><b>RC:</b></label>
            <select id="RC" class="form-control form-control-sm">
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
            </select>           
          </div>
          
          <div class="col-md-3"> 
           <label for="validityRC"><b>Validity:</b></label>            
            <input type="date" id="validityRC" class="form-control form-control-sm">
          </div>
          
          <div class="col-md-3"> 
           <label for="Insurance"><b>Insurance:</b></label>
             <select id="Insurance" class="form-control form-control-sm">
             <option value="">Select</option>
             <option value="1">Yes</option>
             <option value="0">No</option>
             </select>
           </div>
           
            <div class="col-md-3">
             <label for="validityInsurance"><b>Validity:</b></label>                
               <input type="date" id="validityInsurance" class="form-control form-control-sm">
            </div>
        
     <div class="col-md-3" style="padding-top:3%;">
      <label for="Fitness"><b>Fitness:</b></label>      
       <select id="Fitness" class="form-control form-control-sm">
        <option value="">Select</option>
        <option value="1">Yes</option>
        <option value="0">No</option>
       </select>
      </div>
   
     <div class="col-md-3" style="padding-top:3%;">
      <label for="validityFitness"><b>Validity:</b></label>           
      <input type="date" id="validityFitness" class="form-control form-control-sm">
     </div>
 
     <div class="col-md-3" style="padding-top:3%;">
      <label for="PUC"><b>PUC:</b></label>     
       <select id="PUC" class="form-control form-control-sm">
        <option value="">Select</option>
        <option value="1">Yes</option>
        <option value="0">No</option>
       </select>
      </div>
    
    <div class="col-md-3" style="padding-top:3%;">
      <label for="validityPUC"><b>Validity:</b></label>           
      <input type="date" id="validityPUC" class="form-control form-control-sm"> 
    </div>
   </div>
  </div> 
</div>

<div id=container2 style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Vehicle Details</h5>
        
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="vehicleNo"><b>Vehicle No:</b></label>              
                <input type="text" class="form-control form-control-sm" id="vehicleNo" placeholder="Vehicle No">
                <!-- Error message for vehicleNo -->
                <div id="vehicleNoError" class="error-message" style="display: none;">Vehicle number is required</div>
               </div>
               
               <div class="form-group col-md-3" >
                <label for="dname"><b>Driver Name:</b></label>
                <input type="text" class="form-control form-control-sm" id="dname" placeholder="Driver Name" oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
                <!-- Error message for dname -->
                <div id="dnameError" class="error-message" style="display: none;">Driver name is required</div>
               </div>
        
               <div class="col-md-3">
                <label for="dmno"><b>Driver Mobile No:</b></label>
                <input type="text" class="form-control form-control-sm" id="dmno" maxlength="10" placeholder="Driver Mobile No" oninput="this.value = this.value.replace(/[^0-9]/g, '')">     
                <div id="dmnoError" class="error-message" style="display: none;">Driver Mobile No is required</div>
               </div>
               
               <div class="col-md-3">
                <label for="dlno"><b>Driver License No:</b></label>
                <input type="text" class="form-control form-control-sm" id="dlno" placeholder="Driver License No">
                <div id="dlnoError" class="error-message" style="display: none;">Driver License No is required</div>
               </div>
               
               <div class="col-md-3" style="padding-top:2%;">
                <label for="hname"><b>Helper Name:</b></label>
                <input type="text" class="form-control form-control-sm" id="hname" placeholder="Helper Name" oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
                <div id="hnameError" class="error-message" style="display: none;">Helper Name is required</div>
               </div>
               
               <div class="col-md-3" style="padding-top:2%;">
                <label for="tname"><b>Transporter Name:</b></label>
                <select id="tname" class="form-control form-control-sm">
                <option value="">Select</option>
                </select>
                <div id="tnameError" class="error-message" style="display: none;">Transporter Name is required</div>
               </div>
               
               <div class="col-md-3" style="padding-top:2%;">
                <label for="tlocation"><b>Location:</b></label>
                <input type="text" class="form-control form-control-sm" id="tlocation" placeholder="Location" readonly="readonly">
                <div id="tlocationError" class="error-message" style="display: none;">Location is required</div>
               </div>
               
               <div class="col-md-3" style="padding-top:2%;">
                <label for="taddress"><b>Transporter Address:</b></label>
                <input type="text" class="form-control form-control-sm" id="taddress" placeholder="Transporter Address" readonly="readonly">
                <div id="taddressError" class="error-message" style="display: none;">Transporter Address is required</div>
               </div>                                                               
               
                <div class="col-md-3" style="padding-top:3%;">
                <label for="whom"><b>Whom to Meet:</b></label>
                <select id="whom" class="form-control form-control-sm">
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                </select>
                <div id="whomError" class="error-message" style="display: none;">Whom to Meet is required</div>
               </div>
               
                <div class="col-md-3" style="padding-top:3%;">
                <label for="department"><b>Department:</b></label>
                <input type="text" class="form-control form-control-sm" id="department" placeholder="Department" readonly="readonly">
                <div id="departmentError" class="error-message" style="display: none;">Department is required</div>    
               </div>
               
                <div class="col-md-3" style="padding-top:3%;" hidden>
                <label for="content"><b>Content Description:</b></label>
                <input type="text" class="form-control form-control-sm" id="content" placeholder="Content Description">
                <div id="contentError" class="error-message" style="display: none;">Content Description is required</div>
               </div>
               
               <div class="col-md-3" style="padding-top:3%;">
                <label for="remarks"><b>Remarks:</b></label>
                <input type="text" class="form-control form-control-sm" id="remarks" placeholder="Remarks">
                <div id="remarksError" class="error-message" style="display: none;">Remarks is required</div>
               </div>
               
                <div class="col-md-3" style="padding-top:3%;">
                <label for="description"><b>Description:</b></label>
                <input type="text" class="form-control form-control-sm" id="description" placeholder="Description">
                <div id="descriptionError" class="error-message" style="display: none;">Description is required</div>    
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>
                          <select class="form-control form-control-sm" id="cname1" onchange="fetchCnameCompanyDetailsDynamic(1)">             
                          </select>
                        </td>                       
                        <td>
                           <input type="text" class="form-control form-control-sm" id="clocation1" readonly>
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="caddress1" readonly>
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="ponum">
                        </td>
                        <td>
                           <input type="date" class="form-control form-control-sm" id="podate">
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="invoicenum">
                        </td>
                        <td>
                           <input type="date" class="form-control form-control-sm" id="invoicedate">
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="dcnum">
                        </td>
                        <td>
                           <input type="date" class="form-control form-control-sm" id="dcdate">
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="quantity">
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="weight">
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="description">
                        </td>
                        <td>
                           <button type="button" class="btn btn-sm btn-danger" onclick="deleteRow(this)">Delete</button>
                        </td>
                    </tr>         
                  </tbody>
                 </table>
                   <button id="btnAddRow" type="button" class="btn btn-sm btn-secondary" onclick="addNewRow()">Add New Row</button>
                </div>

    
           
     <div class="table-responsive p-3">
  <!-- Buttons -->
        <div class="mt-4 text-right">
         <video autoplay id="videoElement" width="640" height="480"></video><br>
         <canvas id="canvas" style="display:none;"></canvas>
         <img id="capturedImage" alt="Captured Image"/><br>
         <button type="button" class="btn btn-warning" id="capture">Capture</button>
         <button type="button" class="btn btn-primary" id="btnsubmit" onclick="submitFunction()" >Create</button>    <!-- id="btnsubmit" --> <!-- onclick="submitFunction()" -->
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
     </div>    
    </div> 
</div> 
</div>


</form>
            </div>
           </div>
          </div>
         </div>
         
           <div class="modal fade" id="exampleModalCenter322" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmvehentryyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
           
         
         
     <div class="modal fade" id="exampleModalScrollable12" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Update Vehicle Loading</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="register1"><b>Register Type:</b></label>               
                 <select class="form-control form-control-sm" id="register1" >
                 <option value="1"></option>
                  <option value="2"></option>
                 </select>
               </div>
               
               
               <div class="form-group col-md-3">
                <label for="Select1"><b>Select Type:</b></label>
                <select  id="Select1" disabled class="form-control form-control-sm">                          
                <option value="" selected>Select</option> 
                </select>
               </div>
                             
               
               <div class="form-group col-md-3" >
                 <label for="vehicle1"><b>Vehicle Type:</b></label>
                 <select id="vehicle1" class="form-control form-control-sm">
                   <option value="5">Self</option>
                  <option value="9">Miscellaneous</option>                                 
                 </select>
               </div>
               
               
                <div class="form-group col-md-3" >
                 <label for="Vehicle_No1" hidden="true"><b>Vehicle No:</b></label>
                 <select id="Vehicle_No1" class="form-control form-control-sm" hidden="true">
                  <option value="0">Select</option>                         
                 </select>
               </div>
              </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="container4" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Update Vehicle Status</h5>
        
       <div class="form-row">
         <div class="col-md-3"> 
          <label for="RC1"><b>RC:</b></label>
            <select id="RC1" class="form-control form-control-sm">
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
            </select>           
          </div>
          
          <div class="col-md-3"> 
           <label for="validityRC1"><b>Validity:</b></label>            
            <input type="date" id="validityRC1" class="form-control form-control-sm">
          </div>
          
          <div class="col-md-3"> 
           <label for="Insurance1"><b>Insurance:</b></label>
             <select id="Insurance1" class="form-control form-control-sm">
             <option value="">Select</option>
             <option value="1">Yes</option>
             <option value="0">No</option>
             </select>
           </div>
           
            <div class="col-md-3">
             <label for="validityInsurance1"><b>Validity:</b></label>                
               <input type="date" id="validityInsurance1" class="form-control form-control-sm">
            </div>
        
     <div class="col-md-3" style="padding-top:3%;">
      <label for="Fitness1"><b>Fitness:</b></label>      
       <select id="Fitness1" class="form-control form-control-sm">
        <option value="">Select</option>
        <option value="1">Yes</option>
        <option value="0">No</option>
       </select>
      </div>
   
     <div class="col-md-3" style="padding-top:3%;">
      <label for="validityFitness1"><b>Validity:</b></label>           
      <input type="date" id="validityFitness1" class="form-control form-control-sm">
     </div>
 
     <div class="col-md-3" style="padding-top:3%;">
      <label for="PUC1"><b>PUC:</b></label>     
       <select id="PUC1" class="form-control form-control-sm">
        <option value="">Select</option>
        <option value="1">Yes</option>
        <option value="0">No</option>
       </select>
      </div>
    
    <div class="col-md-3" style="padding-top:3%;">
      <label for="validityPUC1"><b>Validity:</b></label>           
      <input type="date" id="validityPUC1" class="form-control form-control-sm"> 
    </div>
   </div>
  </div> 
</div>

<div id=container5 style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Update Vehicle Details</h5>
        
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="vehicleNo1"><b>Vehicle No:</b></label>              
                <input type="text" class="form-control form-control-sm" id="vehicleNo1" placeholder="Vehicle No">
                  <div id="vehicleNo1Errorup" class="error-message" style="display: none;">Vehicle number is required</div>
               </div>
               
               <div class="form-group col-md-3" >
                <label for="dname1"><b>Driver Name:</b></label>
                <input type="text" class="form-control form-control-sm" id="dname1" placeholder="Driver Name" oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
                 <div id="dname1Errorup" class="error-message" style="display: none;">Driver Name is required</div>
               </div>
        
               <div class="col-md-3">
                <label for="dmno1"><b>Driver Mobile No:</b></label>
                <input type="text" class="form-control form-control-sm" id="dmno1" maxlength=10 placeholder="Driver Mobile No" oninput="this.value = this.value.replace(/[^0-9]/g, '')"> 
                 <div id="dmno1Errorup" class="error-message" style="display: none;">Driver Mobile No is required</div>    
               </div>
               
               <div class="col-md-3">
                <label for="dlno1"><b>Driver License No:</b></label>
                <input type="text" class="form-control form-control-sm" id="dlno1" placeholder="Driver License No">
                 <div id="dlno1Errorup" class="error-message" style="display: none;">Driver License No is required</div>
               </div>
               
               <div class="col-md-3" style="padding-top:2%;">
                <label for="hname1"><b>Helper Name:</b></label>
                <input type="text" class="form-control form-control-sm" id="hname1" placeholder="Helper Name" oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')">
                 <div id="hname1Errorup" class="error-message" style="display: none;">Helper name is required</div>
               </div>
               
               <div class="col-md-3" style="padding-top:2%;">
                <label for="tname1"><b>Transporter Name:</b></label>
                <select id="tname1" class="form-control form-control-sm">
                <option value="">Select</option>
                </select>
                 <div id="tname1Errorup" class="error-message" style="display: none;">Transport name is required</div>
               </div>
               
               <div class="col-md-3" style="padding-top:2%;">
                <label for="tlocation1"><b>Location:</b></label>
                <input type="text" class="form-control form-control-sm" id="tlocation1" placeholder="Location" readonly="readonly">
               </div>
               
               <div class="col-md-3" style="padding-top:2%;">
                <label for="taddress1"><b>Transporter Address:</b></label>
                <input type="text" class="form-control form-control-sm" id="taddress1" placeholder="Transporter Address" readonly="readonly">
               </div>                                                               
               
                <div class="col-md-3" style="padding-top:3%;">
                <label for="whom1"><b>Whom to Meet:</b></label>
                <select id="whom1" class="form-control form-control-sm">
                </select>
                 <div id="whom1Errorup" class="error-message" style="display: none;">Whom to meet is required</div>
               </div>
               
                <div class="col-md-3" style="padding-top:3%;">
                <label for="department1"><b>Department:</b></label>
                <input type="text" class="form-control form-control-sm" id="department1" placeholder="Department" readonly="readonly">   
               </div>
               
                <div class="col-md-3" style="padding-top:3%;" hidden>
                <label for="content1"><b>Content Description:</b></label>
                <input type="text" class="form-control form-control-sm" id="content1" placeholder="Content Description">
               </div>
               
               <div class="col-md-3" style="padding-top:3%;">
                <label for="remarks1"><b>Remarks:</b></label>
                <input type="text" class="form-control form-control-sm" id="remarks1" placeholder="Remarks">
                 <div id="remarks1Errorup" class="error-message" style="display: none;">Remarks is required</div>
               </div>
               
                <div class="col-md-3" style="padding-top:3%;">
                <label for="description1"><b>Description:</b></label>
                <input type="text" class="form-control form-control-sm" id="description1" placeholder="Description">   
                 <div id="description1Errorup" class="error-message" style="display: none;">Description is required</div>             
                </div>
               
              
            <div class="table-responsive p-3">
                <table class="table table-striped table-bordered table-sm" id="TableID1" style="width: 100%;">
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>
                          <select class="form-control form-control-sm" id="cname2" onchange="fetchCnameCompanyDetailsDynamic(1)">             
                          </select>
                        </td>                       
                        <td>
                           <input type="text" class="form-control form-control-sm" id="clocation1" readonly>
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="caddress1" readonly>
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="ponum1">
                        </td>
                        <td>
                           <input type="date" class="form-control form-control-sm" id="podate1">
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="invoicenum1">
                        </td>
                        <td>
                           <input type="date" class="form-control form-control-sm" id="invoicedate1">
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="dcnum1">
                        </td>
                        <td>
                           <input type="date" class="form-control form-control-sm" id="dcdate1">
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="quantity1">
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="weight1">
                           
                        </td>
                        <td>
                           <input type="text" class="form-control form-control-sm" id="description1">
                        </td>
                        <td>
                           <button type="button" class="btn btn-sm btn-danger" onclick="deleteRow2(this)">Delete</button>
                        </td>
                    </tr>         
                  </tbody>
                 </table>
                  <button id="btnAddRow1" type="button" class="btn btn-sm btn-secondary" onclick="addNewRow1()">Add New Row</button>
                </div>

    <div class="modal-footer">
         
      </div>
           
     <div class="table-responsive p-3">
  <!-- Buttons -->
  
        <div class="modal-footer">
       <button type="button" class="btn btn-secondary" onclick="$('#exampleModalScrollable12').modal('hide')">Close</button>
        <button type="button" class="btn btn-primary" id="btnupdate">Update</button>
      </div>
     </div>    
    </div> 
</div> 
</div>


</form>
            </div>
           </div>
          </div>
         </div>
         
         
         
             <div class="modal fade" id="exampleModalCenter323" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelvehiclemodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmvehicleupd">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          
          
          
                <div class="modal fade" id="exampleModalCenterdeleted" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 54%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                   
                 </div>
                <div class="modal-body">
                  <b>Are you sure you want to Delete ?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm"  data-dismiss="modal" >NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="cofirmDeleted">YES</button>
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


  <!-- Bootstrap JS and dependencies -->
 
<script>
$(document).ready(function () {

    let today = new Date().toISOString().split('T')[0];

    /* =========================
       STATIC CONSTRAINTS
    ========================== */

    $(document).on("focus", "#validityRC, #validityRC1, #validityInsurance, #validityInsurance1, #validityFitness, #validityFitness1, #validityPUC, #validityPUC1", function () {
        $(this).attr("min", today);
    });

    $(document).on("focus", "#podate, #podate1", function () {
        $(this).attr("max", today);
    });

    /* =========================
       CREATE FORM
    ========================== */

    $(document).on("change", "#podate", function () {
        let poDate = $(this).val();
        if (poDate > today) {
            $(this).val("");
            return;
        }
        $("#invoicedate").attr("min", poDate);
        $("#dcdate").attr("min", poDate);
    });

    $(document).on("change", "#invoicedate", function () {
        let invoiceDate = $(this).val();
        $("#dcdate").attr("min", invoiceDate);
    });
});
</script>
 
  <script>
  // When modal is opened, disable Vehicle_No initially
  $('#modalScroll1').on('click', function () {
    $('#Vehicle_No').prop('disabled', true);
    $('#vehicle').val(""); // Reset vehicle type to default
  });

  // Enable Vehicle_No when a valid vehicle type is selected
  $('#vehicle').on('change', function () {
    if ($(this).val()) {
      $('#Vehicle_No').prop('disabled', false);
    } else {
      $('#Vehicle_No').prop('disabled', true);
    }
  });
</script>

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

<script>
$('#yourCloseButtonId').on('click', function () {
  $('#exampleModalScrollable12').modal('hide');
});
</script>


<script>
    function loadJSPPage(value) {
        if (value === "Entry") {
            window.location.href = "Vehicle.jsp";
        } else if (value === "Out") {
            window.location.href = "VehicleOut.jsp";
        }
    }
</script>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    const registerSelect = document.getElementById('register');
    const selectDropdown = document.getElementById('Select');

    // Function to toggle the "disabled" property of the Select dropdown
    function toggleSelect() {
      if (registerSelect.value === '2') { // Material Inward is selected
        selectDropdown.disabled = false;
      } else { // Vehicle Loading is selected
        selectDropdown.disabled = true;
      }
    }

    // Initialize the state on page load
    toggleSelect();

    // Event listener to handle changes in the "register" dropdown
    registerSelect.addEventListener('change', toggleSelect);
  });
</script>








<script>
  document.addEventListener("DOMContentLoaded", function () {
    const vehicleSelect = document.getElementById("vehicle");
    const container1 = document.getElementById("container1");
    const container2 = document.getElementById("container2");

    function updateContainers() {
      const selectedValue = vehicleSelect.value;

      if (selectedValue === "" ) {
        container1.style.display = "none";
        container2.style.display = "none";
      } 
    }

    vehicleSelect.addEventListener("change", updateContainers);
    updateContainers(); // Run on page load
  });
</script>


<script>
  function handleRadioChange() {
    const selectedRadio = document.querySelector('input[name="EntryType"]:checked');
    if (selectedRadio) {
      const entryType = selectedRadio.value;
      if (entryType === 'Entry') {
        console.log("vehicleentry selected");
      } else if (entryType === 'Out') {
        console.log("Vehicle Out selected");
      }
    }
  }

  document.querySelectorAll('input[name="EntryType"]').forEach(radio => {
    radio.addEventListener('change', handleRadioChange);
  });
</script>
<script>
$(document).ready(function () {
    // Close button inside modal
    $('#exampleModalScrollable12 .close').on('click', function () {
        $('#exampleModalScrollable12').modal('hide');
    });
});
</script>
       <script src="externalLibrary/cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
  <script src="vendor/jquery/jquery.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

      <script src="vendor/datatables/jquery.dataTables.min.js"></script>
      <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
     <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>


    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>   
  <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
<!--   <script src="js/Vehicle.js"></script> -->
<script src="js/Vehicle.js?v=<%=ver(application, "/js/Vehicle.js")%>"></script>
   <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
   <script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
 	   <script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
 	    <script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
	   	<script src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
 	<script>

 
</script>
<script src="js/permissions.js?v=<%=ver(application, "/js/permissions.js")%>"></script>

  <!-- Page level custom scripts -->
</body>
</html>