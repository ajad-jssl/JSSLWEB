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
       
<link href="externalLibrary/cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEJjRkC9iY3NfJVzz6se99Nz05dfk03S8zNeS46E1H2nKfHlR9ltRf9TL7zG6" crossorigin="anonymous">
 
 <link href="externalLibrary/cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
 


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
  <style>
    #videoElement, #capturedImage {
      width: 300px;
      height: 225px;
      border: 2px solid #ccc;
      margin-bottom: 10px;
    }
  </style>
  
  <style>
th, td {
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
}

.table td input.form-control-sm {
  min-width: 120px;  /* ensures readability */
}

.modal-body {
  overflow-x: auto;  /* horizontal scroll if needed */
}
</style>

<style>
.hidden-input {
    display: none;
}
</style>

<style>
.table thead th {
    background-color: #e0e0e0;   /* slightly dark grey */
    color: #333333;          /* dark blue text */
    font-size: 12px;
}

#TableID th {
    font-size: 12px;
}
#TableID td {
    font-size: 12px;
}

#TableID input.form-control-sm,
#TableID select.form-control-sm {
    min-width: 60px;
    max-width: 100%;
    font-size: 12px;
    height: 26px;
}

#TableweldID th {
    font-size: 12px;
}
#TableweldID td {
    font-size: 12px;
}

#TableweldID input.form-control-sm,
#TableweldID select.form-control-sm {
    min-width: 60px;
    max-width: 100%;
    font-size: 12px;
    height: 26px;
}

#TablelooseitemID th {
    font-size: 12px;
}
#TablelooseitemID td {
    font-size: 12px;
}

#TablelooseitemID input.form-control-sm,
#TablelooseitemID select.form-control-sm {
    min-width: 60px;
    max-width: 100%;
    font-size: 12px;
    height: 26px;
}

th, td {
  white-space: nowrap;
}

th, td {
  white-space: normal;
  text-align: center;
  vertical-align: middle;
}
</style>

</head>

<body >
  <div id="wrapper">
    <!-- Sidebar -->
      <%@ include file="QCSidebar.jsp" %>
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
            <h1 class="h3 mb-0 text-gray-800">QC Inspection Entry</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="QCDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item"><a href="QCEntry.jsp">QC Inspection Entry</a></li>
            </ol>
          </div>
          
          
<div class="row mb-3">
  <div class="col-lg-12">
    <div class="card mb-4">
      <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
          <!-- Keep Create Button as-is -->
          <button id="modalScroll1">
          <i class="fas fa-plus"></i> Create
          </button>
        </div>
      </div>

      <!-- Container for dynamic progress bars -->
      <div class="table-responsive p-3">
      </div>      
    </div>
  </div>
</div>

<!-- Modal 1: Create QS Package Details -->
<!-- Form Container with Outline and Title -->

    <div class="modal fade" id="exampleModalScrollable123" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1750px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>QC Inspection Entry</b></h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="Contract"><b>Contract:</b></label>               
                <select id="Contract" class="form-control form-control-sm">                               
                </select>
               </div>
               
               
               <div class="form-group col-md-3">
                <label for="Phase"><b>Phase:</b></label>
                <select id="Phase" class="form-control form-control-sm">                               
                </select>
               </div>
                            
               
               <div class="form-group col-md-3" >
                 <label for="Load"><b>Load:</b></label>
                 <select id="Load" class="form-control form-control-sm">                               
                 </select>
               </div>
               
               
               <div class="form-group col-md-3" style="padding-top:2%;">
                <select id="Joinee" class="form-control form-control-sm">
                <option value="">Select</option>
                <option value="FITUP">Fit Up Inspection</option>
                <option value="WELD">Welding Inspection</option>
                <!-- <option value="LOOSE">Loose Items Inspection</option> -->
               </select>
               </div>                              
              </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->

<div id="container1" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1700px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Fit Up Inspection Entry</h5>
        
        <div class="form-row dynamic-row">
                       
 <div class="table-responsive">
  <table class="table table-striped table-bordered table-sm" id="TableID" style="width: 100%;">
    <thead>
      <tr>
        <th>Sl.no</th>
        <th>Phase</th>
        <th>Load</th>
        <th>Mark</th>
        <th>Fitting Mark</th>
        <th>Qty</th>
        <th>Section size</th>
        <th>Fabricator Id</th>
        <th>Fit up Inspected qty</th>
        <th>Fit up balanced qty</th>
        <th>Buckling(mm)</th>
        <th>Camber(mm)</th>
        <th>Fit up balance</th>
        <th>Remarks</th>
        <th>Rework</th>
        <th>Revision</th>
        <th>Result</th>
        <th>Fitup Inspected by</th>
        <th>Date & Time</th>
        <th>Status</th>
        <th>Create</th>
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
    <td><select class="form-control form-control-sm" id="FABRICATOR"></select></td>
    <td><input type="text" class="form-control form-control-sm" id="fitup_inspected_qty"></td> 
    <td><input type="text" class="form-control form-control-sm" id="fitup_balanced_qty" oninput="calculateBalance()" readonly></td> 
    <td><input type="text" class="form-control form-control-sm" id="BUCKLING"></td> 
    <td><input type="text" class="form-control form-control-sm" id="CAMBER"></td> 
    <td><input type="text" class="form-control form-control-sm" id="LENGTH"></td> 
    <td><input type="text" class="form-control form-control-sm" id="BALANCE"></td> 
   <td>
    <select class="form-control form-control-sm" id="REMARKS" onchange="toggleOthers(this)">
        <option value="">Select</option>
        <option value="None">None</option>
        <option value="Shorten length">Shorten length</option>
        <option value="Hole out">Hole out</option>
        <option value="After UT Fit Up">After UT Fit Up</option>
        <option value="Others">Others</option>
    </select>
    <input type="text" class="form-control form-control-sm" id="REMARKS_OTHERS"
           placeholder="Specify remarks" style="display:none;">
</td>
    <td><select class="form-control form-control-sm" id="REWORK" onchange="getitemdetails(1)">
        <option value="1">Select</option>
        <option value="1">None</option>
        <option value="2">Rework req</option>
        <option value="2">Rework clrd</option>       
        </select></td> 
          <td>
          <select class="form-control form-control-sm revision-dropdown" id="REVISION" onchange="getitemdetails(1)"></select>
          </td>
    <td></td> 
    <td></td> 
    <td></td> 
    <td></td> 
    <td>
    <!--  <button type="button" class="btn btn-sm btn-secondary" onclick="save()" style="display: none;">Save</button> -->
    <i class="bi bi-check-circle-fill text-primary create-icon"
      id="showConfirmationPopup"
      title="Create"
      style="cursor:pointer; font-size:18px; opacity:0.5; pointer-events:none;"></i>
    </td> 
    </tr> 
   </tbody>
  </table>
</div>
        </div>
    </div> 
</div>

   <div class="modal fade" id="exampleModalCenterfitup" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm"  id="confirmfab">NO</button>
                  <button type="button" class="btn btn-info btn-sm" id="confirmSubmission">YES</button>
                </div>
              </div>
            </div>
          </div>
     
          
       <div class="modal fade" id="exampleModalCenterQC" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 70%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                 </div>
                <div class="modal-body">
                  <b id="errorMessageupQC"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" id="modalokk">OK</button> 
                </div>
              </div>
            </div>
          </div> 
           

    <div id="container2" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1700px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Welding Inspection Entry</h5>
        
   <div class="form-row dynamic-row">
  <div class="table-responsive">
    <table class="table table-striped table-bordered table-sm" id="TableweldID" style="width: 100%;">
      <thead>
        <tr>
          <th>Sl.no</th>
          <th>Phase</th>
          <th>Load</th>
          <th>Mark</th>
          <th>Fitting Mark</th>
          <th>Qty</th>
          <th>Dims(mm)</th>
          <th>Section size</th>
          <th>Welder Id</th>
          <th>Weld Inspected qty</th>
          <th>Weld balanced qty</th>
          <th>Buckling(mm)</th>
          <th>Camber(mm)</th>
          <th>Length</th>
          <th>Sweep(mm)</th>
          <th>Weld Visual</th>
          <th>Ultrasonic testing(UT)</th>
          <th>Rework</th>
          <th>Result</th>
          <th>Weld Inspected by</th>
          <th>Date & Time</th>
          <th>Fitup Remarks</th>
          <th>Status</th>
          <th>Create</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td> <!-- Sl.no -->
          <td></td> <!-- Phase -->
          <td></td> <!-- Load -->
          <td></td> <!-- Mark -->
          <td></td> <!-- Qty -->
          <td></td> <!-- Dims(mm) -->
          <td></td> <!-- Section ize -->
          <td><select class="form-control form-control-sm" id="WELDER"></select></td> <!-- Welder Id -->
          <td><input type="text" class="form-control form-control-sm" id="weld_inspected_qty"></td> <!-- Weld Inspected qty -->
          <td><input type="text" class="form-control form-control-sm" id="weld_balanced_qty" readonly></td> <!-- Weld balanced qty -->
          <td><input type="text" class="form-control form-control-sm" id="buckling"></td> <!-- Buckling(mm) -->
          <td><input type="text" class="form-control form-control-sm" id="camber"></td> <!-- Camber(mm) -->
          <td><input type="text" class="form-control form-control-sm" id="sweep"></td> <!-- Sweep(mm) -->
          <td>
            <select class="form-control form-control-sm" id="WELD" onchange="getitemdetails(1)">
              <option value="">Select</option>
              <option value="Satisfactory">Satisfactory</option>
            </select>
          </td> <!-- Weld Visual -->
          <td><input type="text" class="form-control form-control-sm" id="length"></td> <!-- Length (was missing) -->
          <td>
            <select class="form-control form-control-sm" id="UT" onchange="getitemdetails(1)">
              <option value="">Select</option>
              <option value="None" selected>None</option>
              <option value="OK">OK</option>
              <option value="NA">NA</option>
            </select>
          </td> <!-- Ultrasonic testing(UT) -->
          <td>
            <select class="form-control form-control-sm" id="rework" onchange="getitemdetails(1)">
              <option value="">Select</option>
              <option value="None">None</option>
              <option value="Rework req">Rework req</option>
              <option value="Rework clrd">Rework clrd</option>
            </select>
          </td> <!-- Rework -->
          <td></td> <!-- Result -->
          <td></td> <!-- Weld Inspected by -->
          <td></td> <!-- Date & Time -->
          <td></td> <!-- Fitup Remarks -->
          <td></td> <!-- Status -->
          <td class="text-center">
            <i class="bi bi-check-circle-fill text-primary create-icon"
               id="showConfirmPopup"
               title="Create"
               style="cursor:pointer; font-size:18px; opacity:0.5; pointer-events:none;"></i>
          </td> <!-- Create -->
        </tr>
      </tbody>
    </table>
  </div>
</div>
    </div> 
 </div>
 
 <div class="modal fade" id="exampleModalCenterweld" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm"  id="confirmweld">NO</button>
                  <button type="button" class="btn btn-info btn-sm" id="confirmweldSubmission">YES</button>
                </div>
              </div>
            </div>
          </div>
          

     
            
          </div>
       </div> 
   </div>
  </div>

           <div class="modal fade" id="exampleModallooseitemsCenter" tabindex="-1" role="dialog"
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
                 <button type="button" class="btn btn-secondary btn-sm"  id="confirmlooseitem">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmlooseitemyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
            
              
 
    <div class="modal fade" id="exampleModalScrollable123up" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1750px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Update QC Inspection Entry</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="Contract1"><b>Contract:</b></label>               
                <select id="Contract1" class="form-control form-control-sm">                               
                </select>
               </div>
               
               
               <div class="form-group col-md-3">
                <label for="Phase1"><b>Phase:</b></label>
                <select id="Phase1" class="form-control form-control-sm">                               
                </select>
               </div>
                            
               
               <div class="form-group col-md-3" >
                 <label for="Load1"><b>Load:</b></label>
                 <select id="Load1" class="form-control form-control-sm">                               
                 </select>
               </div>
               
               
               <div class="form-group col-md-3" style="padding-top:2%;">
                 <select id="Joinee1" class="form-control form-control-sm">
                 <option value="1">Select</option>
                 <option value="1">Fit Up Inspection</option>
                 <option value="2">Welding Inspection</option>
                 <!-- <option value="2">Loose Items Inspection</option>  -->                               
                 </select>
               </div>                              
              </div> 


<!-- Dynamic Fields Container (Initially Hidden) -->

<div id="container4" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1700px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Update Fit Up Inspection Entry</h5>
        
        <div class="form-row dynamic-row">
                  <form>      
 <div class="table-responsive" style="overflow-x: auto;">
  <table class="table table-striped table-bordered table-sm" id="TableID" style="width: 100%; min-width: 1600px;">
    <thead>
      <tr>
        <th>SL.NO</th>
        <th>PHASE</th>
        <th>LOAD</th>
        <th>MARK</th>
        <th>QTY</th>
        <th>DIMS (mm)</th>
        <th>FABRICATOR ID</th>
        <th>BUCKLING (mm)</th>
        <th>CAMBER (mm)</th>
        <th>LENGTH (mm)</th>
        <th>FIT UP BALANCE</th>
        <th>REMARKS</th>
        <th>REWORK</th>
        <th>RESULT</th>
        <th>FIT UP INSPECTED BY</th>
        <th>DATE & TIME</th>
        <th>STATUS</th>
        <th>SAVE</th>
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
    <td><input type="text" class="form-control form-control-sm" id="FABRICATOR1"></td> 
    <td><input type="text" class="form-control form-control-sm" id="BUCKLING1"></td> 
    <td><input type="text" class="form-control form-control-sm" id="CAMBER1"></td> 
    <td><input type="text" class="form-control form-control-sm" id="LENGTH1"></td> 
    <td><input type="text" class="form-control form-control-sm" id="BALANCE1"></td> 
    <td><select class="form-control form-control-sm" id="REMARKS1" onchange="getitemdetails(1)">
        <option value="1">Select</option>
        <option value="1">None</option>
        <option value="2">Shorten length</option>
        <option value="2">Hole out</option>
        <option value="2">After UT Fit Up</option>
        <option value="2">Others</option>
        </select></td> 
    <td><select class="form-control form-control-sm" id="REWORK1" onchange="getitemdetails(1)">
        <option value="1">Select</option>
        <option value="1">None</option>
        <option value="2">Rework req</option>
        <option value="2">Rework clrd</option>       
        </select></td> 
    <td></td> 
    <td></td> 
    <td></td> 
    <td></td> 
    <td><button type="button" class="btn btn-sm btn-secondary" onclick="save1()" style="display: none;">Save</button></td> 
    </tr> 
   </tbody>
  </table>
</div>
      </form>
        </div>
    </div> 
</div>

          
           

    <div id="container5" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1700px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Update Welding Inspection Entry</h5>
        
        <div class="form-row dynamic-row">
                  <form>      
 <div class="table-responsive" style="overflow-x: auto;">
  <table class="table table-striped table-bordered table-sm" id="TableID" style="width: 100%; min-width: 1600px;">
    <thead>
      <tr>
        <th>SL.NO</th>
        <th>PHASE</th>
        <th>LOAD</th>
        <th>MARK</th>
        <th>QTY</th>
        <th>WELDER ID</th>        
        <th>BUCKLING (mm)</th>
        <th>CAMBER (mm)</th>
        <th>SWEEP (mm)</th>
        <th>WELD VISUAL</th>
        <th>UT</th>
        <th>REWORK</th>
        <th>RESULT</th>
        <th>WELDING INSPECTED BY</th>
        <th>DATE & TIME</th>
        <th>FIT UP REMARKS</th>
        <th>STATUS</th>
        <th>SAVE</th>
      </tr>
    </thead>
    <tbody> 
    <tr> 
    <td></td> 
    <td></td> 
    <td></td> 
    <td></td> 
    <td></td> 
    <td><select class="form-control form-control-sm" id="WELDER1" onchange="getitemdetails(1)">
                <!-- Options will be populated dynamically -->
        </select></td> 
    <td><input type="text" class="form-control form-control-sm" id="bucking1"></td> 
    <td><input type="text" class="form-control form-control-sm" id="camber1"></td> 
    <td><input type="text" class="form-control form-control-sm" id="sweep1"></td> 
    <td><select class="form-control form-control-sm" id="WELD1" onchange="getitemdetails(1)">
        <option value="1">Select</option>
        <option value="1">Satisfactory</option>              
        </select></td> 
    <td><select class="form-control form-control-sm" id="UT1" onchange="getitemdetails(1)">
        <option value="1">Select</option>
        <option value="1">None</option>
        <option value="2">OK</option>
        <option value="2">NA</option>       
        </select></td> 
    <td><select class="form-control form-control-sm" id="rework1" onchange="getitemdetails(1)">
        <option value="1">Select</option>
        <option value="1">None</option>
        <option value="2">Rework req</option>
        <option value="2">Rework clrd</option>       
        </select></td> 
    <td></td> 
    <td></td> 
    <td></td> 
    <td></td> 
    <td></td> 
    <td><button type="button" class="btn btn-sm btn-secondary" onclick="ok1()" style="display: none;">Save</button></td> 
    </tr> 
   </tbody>
  </table>
</div>
      </form>
        </div>
    </div> 
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
 

  
<script src="externalLibrary/cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>




<script>
document.getElementById("REWORK").addEventListener("change", function () {
    const createBtn = document.getElementById("showConfirmationPopup");

    if (this.value !== "1") { // not "Select"
        createBtn.disabled = false;
    } else {
        createBtn.disabled = true;
    }
});
</script>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.getElementById('Joinee');
    const container1 = document.getElementById('container1');

    dropdown.addEventListener('change', function () {
      const selectedText = dropdown.options[dropdown.selectedIndex].text;

      if (selectedText === 'Fit Up Inspection') {
        container1.style.display = 'block';
      } else {
        container1.style.display = 'none';
      }
    });
  });
</script>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.getElementById('Joinee');
    const container2 = document.getElementById('container2');

    dropdown.addEventListener('change', function () {
      const selectedText = dropdown.options[dropdown.selectedIndex].text;

      if (selectedText === 'Welding Inspection') {
        container2.style.display = 'block';
      } else {
        container2.style.display = 'none';
      }
    });
  });
</script>




<script>
  document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.getElementById('Joinee1');
    const container4 = document.getElementById('container4');

    dropdown.addEventListener('change', function () {
      const selectedText = dropdown.options[dropdown.selectedIndex].text;

      if (selectedText === 'Fit Up Inspection') {
        container4.style.display = 'block';
      } else {
        container4.style.display = 'none';
      }
    });
  });
</script>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.getElementById('Joinee1');
    const container5 = document.getElementById('container5');

    dropdown.addEventListener('change', function () {
      const selectedText = dropdown.options[dropdown.selectedIndex].text;

      if (selectedText === 'Welding Inspection') {
        container5.style.display = 'block';
      } else {
        container5.style.display = 'none';
      }
    });
  });
</script>



<script>
function toggleOthers(select) {
    getitemdetails(1);
    const othersInput = document.getElementById('REMARKS_OTHERS');
    if (select.value === 'Others') {
        select.style.display = 'none';
        othersInput.style.display = 'block';
        othersInput.focus();
    } else {
        // ✅ Always hide AND clear when not "Others"
        othersInput.style.display = 'none';
        othersInput.value = '';
        select.style.display = '';  // restore dropdown visibility
    }
}
</script>

<script src="externalLibrary/cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>     
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    
      <script src="vendor/datatables/jquery.dataTables.min.js"></script>
   <script src="js/config.js?v=<%=jsVersion%>"></script>
    
      <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>

<script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>  
  
    <script src="js/QCEntry.js?v=<%=jsVersion%>"></script>
    <script src="js/logout.js?v=<%=jsVersion%>"></script>
    <script src="js/username.js?v=<%=jsVersion%>"></script>
    <script src="js/createdby.js?v=<%=jsVersion%>"></script>
 	<script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
 	<script src="js/factoryid.js?v=<%=jsVersion%>"></script>
 	   	      	  <script>

  window.actionElementMap = {
  };
</script>
  <script src="js/permissions.js?v=<%=jsVersion%>"></script>

 
</body>
</html>