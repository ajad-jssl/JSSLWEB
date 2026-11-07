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


   
  <style>
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
  .modal-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100% - .5rem);
}

  
</style>
</head>
</head>
<body>
<body onload="fetchEmployeeList();">
  <div id="wrapper">
    <!-- Sidebar -->
     <ul class="navbar-nav sidebar sidebar-light accordion" id="accordionSidebar">
      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="Dashboard.jsp" style="background-color: white;">
        <div class="sidebar-brand-icon">
          <img src="img/logo/download.png" style="max-height: 4.3rem;">
        </div>
        <div class="sidebar-brand-text mx-3"></div>
      </a>
      <hr class="sidebar-divider my-0">
      <li class="nav-item">
        <a class="nav-link" href="Dashboard.jsp">
          <i class="fas fa-home"></i>
          <span>Dashboard</span></a>
      </li>
      <hr class="sidebar-divider">
      <div class="sidebar-heading">
        Features
      </div>
      
      <li class="nav-item active">
        <a class="nav-link" href="QApackage.jsp">
        <i class="fas fa-clipboard-check" style="color: #007bff;"></i>
          <span>QS Package</span></a>
      </li>
    
     <li class="nav-item">
        <a class="nav-link" href="invoicesidemenu.jsp">
         <i class="far fa-file-alt"></i>
          <span>Invoice</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="">
         <i class="fas fa-recycle" style="color: #dc3545;"></i>
          <span>Scrap</span></a>
      </li>
        
       <li class="nav-item">
        <a class="nav-link" href="">
          <i class="fas fa-chart-bar"></i>
          <span>Reports</span>
        </a>
      </li>
     <li class="nav-item">
        <a class="nav-link" href="master.jsp">
          <i class="fas fa-user-cog"></i>
          <span>Masters</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="Packing.jsp">
          <i class="fas fa-user-cog"></i>
          <span>Packing Note</span>
        </a>
      </li>
           <li class="nav-item">
        <a class="nav-link" href="Piece.jsp">
          <i class="fas fa-user-cog"></i>
          <span>Piece Monitoring</span>              
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="Vehicle.jsp">
          <i class="fas fa-user-cog"></i>
          <span>Vehicle Details</span>              
        </a>
      </li>
    
    </ul>
    <!-- Sidebar -->
    <div id="content-wrapper" class="d-flex flex-column">
      <div id="content">
        <!-- TopBar -->
        <nav class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top">
          <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
            <i class="fa fa-bars"></i>
          </button>
          <ul class="navbar-nav ml-auto">
              <div class="topbar-divider d-none d-sm-block"> </div>
            <li class="nav-item dropdown no-arrow">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
   aria-haspopup="true" aria-expanded="false">
   <i class="fas fa-cog"></i> <!-- Font Awesome settings icon -->
   <span class="ml-2 d-none d-lg-inline text-white small">Settings</span>
</a>
              <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                <!-- <a class="dropdown-item" href="#">
                  <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                  Profile
                </a> -->
               <div class="dropdown-divider"></div>
                <a class="dropdown-item" onclick="logout()">
                  <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>

        <div class="container-fluid" id="container-wrapper">
          <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">Packing Creation</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="Dashboard.jsp">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">Packing Entry</li>
              
            </ol>
          </div>
          <div class="row mb-3">
  <div class="col-lg-12">
    <div class="card mb-4">
      <div class="border rounded p-3 shadow-sm">
                  
            <div class="table-responsive p-3">
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">Contract Selection</h1>           
          </div>        
  
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
  <div class="form-group col-md-3">
   <div class="form-group">
      <label for="Contract"><b>Contract :</b></label>
      <select class="form-control form-control-sm" id="contractor">
      <option value="">Select Contractor</option>
      </select>    
  </div>
  </div>
  

  
  <div class="form-group col-md-3">
  <div class="form-group">
      <label for="Lotnumber"><b>Lot :</b></label>
      <select class="form-control form-control-sm" id="Lotnumber">
      <option value="">Select Lotnumber</option>
      </select>    
  </div>
  </div>
  
  
  <div class="form-group col-md-3">
  <div class="form-group">
  <button class="btn btn-sm" id="Show">
   <i></i> Show
  </button>
  </div>
  </div>
  <!--  <div class="form-group col-md-3">
  <div class="form-group">
  <label for="Description"><b>Show :</b></label>
   <select id="Show" style=width:56%;>
            <option value="1">Select</option>
            <option value="2"></option>
            <option value="3"></option>
            <option value="4"></option>
            <option value="5"></option>
   </select>     
  </div> 
  </div>-->
   </div> 
<!--   <div class="table-responsive p-3">
  <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-success" onclick="openModalAdd();">Create</button>   
    <button type="button" class="btn btn-sm btn-warning" id="resetButton">Reset</button>
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
  </div>
  </div>   -->
  </div>
   
    </div>
  </div>
</div>          
     </div>



         <div class="container-fluid" id="container4" style="display: none;">                  
              <div class="row mb-3">
              <div class="col-lg-12">
              <div class="card mb-4">
             <div class="table-responsive p-3">
             <div class="d-sm-flex align-items-center justify-content-between mb-4">
               <h1 class="h3 mb-0 text-gray-800">Packing Note List</h1>           
             </div>   
        <table class="table table-striped table-bordered table-sm" id="tableID1" width="100%">
          <thead>
  <tr>
  			    <th>Lot No</th>
                <th>Description</th>
                <th>Trailer Ref-No</th>
                <th>WBReference No</th>
                <th>Created Date</th>
                <th>Piece Weight</th>
                <th>Total Weight</th>
                <th>Fab-Loads</th>
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
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
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
          
         <!-- Modal -->
<div class="modal fade" id="loadDetailsModal" tabindex="-1" aria-labelledby="loadDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="loadDetailsModalLabel">Choose Function:</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Any additional information you want to display can go here -->
                <p id="modalLoadno"></p>
                <p id="modalDescription"></p>
                <!-- Add more fields if necessary -->
            </div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-success buildloadButton">
                    <i></i> Buildload
                </button>
                <button class="btn btn-sm btn-success transportationButton">
                    <i></i> Transportation
                </button>
            </div>
        </div>
    </div>
</div>
         
 
          <div class="modal-footer">
             <button class="btn btn-sm btn-success" id="Packing"> 
              <i></i> Create Lot
             </button>
          </div>   
  </div>
  </div>
   </div>
   </div>
   </div>   
        <!-- jQuery and Bootstrap JS for button click functionality -->
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <script>
        // jQuery to toggle visibility of container-wrapper on button click
        $('#Show').on('click', function() {
            $('#container4').toggle();  // Toggles the visibility of the div
        });
    </script>       

    <div class="container-fluid" id="container-wrapper1" style="display: none;">    
    <div class="row mb-3">
    <div class="col-lg-12">
    <div class="card mb-4">
    <div class="border rounded p-3 shadow-sm">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Packing Note Lot Entry</h1>           
    </div>    
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;"> 
   <div class="form-group col-md-3">
      <label for="trailerrefno"><b>Trailer Reference No :</b></label>
       <input type="text" id="trailerrefno" style=padding-left:5%;>    
  </div>
  
  <div class="form-group col-md-3">
      <label for="wighbridgerefno"><b>Weighbridge Reference No :</b></label>
       <input type="text" id="wighbridgerefno" style=padding-left:5%;>    
  </div>

  
  
  <div class="form-group col-md-3">
  <label for="weighbridgeton"><b>Weighbridge Weight(Ton) :</b></label>
   <input type="text" id="weighbridgeton" style=padding-left:5%;>
  </div> 
 
  
  <div class="form-group col-md-2"> 
  <label for="desc"><b>Description :</b></label>
     <input type="text" id="desc" style=padding-left:5%;>
  </div>

  </div> 
  
  <div class="table-responsive p-3">
  <div class="modal-footer">
     <button type="button" class="btn btn-sm btn-success" id="resetButton" onclick="validateForm();addevent();">Submit</button>
     <button type="button" class="btn btn-sm btn-warning" onclick="openModalAdd();">Cancel</button>
  </div>
  </div>  
  </div>
  </div>
  </div>
  </div>    
    </div>

    <!-- jQuery and Bootstrap JS for button click functionality -->
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <script>
        // jQuery to toggle visibility of container-wrapper on button click
        $('#Packing').on('click', function() {
            $('#container-wrapper1').toggle();  // Toggles the visibility of the div
        });
    </script>
    
     
 
 <div class="container-fluid" id="container-wrapper2" style="display: none; padding: 50px;">
               
        <div class="row mb-3">
            <div class="col-lg-12">
                <div class="card mb-4">
                    <div class="border rounded p-3 shadow-sm">
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                     <h1 class="h3 mb-0 text-gray-800">Selected Lot Details</h1>           
                    </div> 
                        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
                            <div class="form-group col-md-3">
                                <div class="form-group">
                                    <label for="lot_no"><b>Lot No :</b></label>
                                    <input type="text" id="lot_no" name="lotno" style=padding-left:12%;margin-left:5px; readonly="readonly">
                                </div>
                            </div>
                            <div class="form-group col-md-3"> 
                                <div class="form-group">
                                    <label for="contract"><b>Contract :</b></label>
                                    <input type="text" id="contract" style=padding-left:12%;margin-left:5px; readonly="readonly">
                                </div> 
                            </div> 
                            <div class="form-group col-md-3"> 
                                <div class="form-group">
                                    <label for="description"><b>Description :</b></label>
                                    <input type="text" id="description" style=padding-left:12%;margin-left:5px; readonly="readonly">
                                </div>
                            </div>
                        </div>

                        <div class="table-responsive p-3">
                            <table class="table table-striped table-bordered table-sm" id="tableID2" width="100%">
                                <thead>
                                    <tr>
                                        <th>Haulier</th>
                                        <th>Destination</th>
                                        <th>Country</th>
                                        <th>State</th>
                                        <th>LoadType</th>
                                        <th>InvoiceNo</th>
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
                                    <!-- Add more rows here as necessary -->
                                </tbody>
                            </table>
                        </div> 
                    </div> 
                </div>
            </div>
        </div>
        
        
        
            
  <div class="row mb-3">
  <div class="col-lg-12">
  <div class="card mb-4">
  <div class="border rounded p-3 shadow-sm">
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Transport Details</h1>           
  </div>   
  <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
  <div class="form-group col-md-3">
  <div class="form-group">
      <label for="Haulier"><b>Haulier :</b></label>
      <select id="Haulier" style=width:65%;margin-left:50px;>
      <option value="">Select Contractor</option>
      </select>
  </div>
  <div class="form-group">
   <label for="general_notes"><b>General Notes :</b></label>
   <input type="text" id="general_notes" style=padding-left:12%;>
  </div>
  </div>
  
  <div class="form-group col-md-3"> 
  <div class="form-group">
   <label for="Description"><b>Destination :</b></label>
   <select id="Destination" style=width:56%;margin-left:44px;>
   <option value="1">Select</option>
   </select>  
  </div>
   
  <div class="form-group">
    <label for="state"><b>Destination State :</b></label>
    <select id="State" style=width:56%;>
    <option value="1">Select</option>
    </select>
  </div>
  </div>
  
  <div class="form-group col-md-3">  
   <div class="form-group">
    <label for="details"><b>Details :</b></label>
    <input type="text" id="Details" style=margin-left:50px;padding-left:12%; readonly="readonly">
  </div>
  </div>
  
  <div class="form-group col-md-3">  
   <div class="form-group">
    <label for="invoiceref"><b>Invoice RefNo Subcontractor:</b></label>
    <input type="text" id="invoiceref" style=padding-left:12%;>
  </div>
  <div class="form-group">
    <label for="Loadtype "><b>Load Type :</b></label>
    <select id="Loadtype" style=width:65%;margin-left:26px;>
    <option value="1">Select</option>
    <option value="2">12-15M</option>
    <option value="3">15.1-18.5M</option>
    <option value="4">18.6-25M</option>
    </select>
  </div>
  </div>
  </div>
      
  <div class="table-responsive p-3">
  <div class="modal-footer">
     <button type="button" class="btn btn-sm btn-success" id="resetButton" onclick="addtranspoter();">Submit</button>
     <button type="button" class="btn btn-sm btn-warning" onclick="openModalAdd();">Cancel</button>
  </div>
  </div> 
  </div> 
  </div>
  </div>
  </div>
  </div>

    <!-- jQuery and Bootstrap JS for button click functionality -->
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <script>
        // jQuery to toggle visibility of container-wrapper on any button click
        $('.transportationButton').on('click', function() {
        	$('#loadDetailsModal').modal('hide');
            $('#container-wrapper2').toggle();  // Toggles the visibility of the div
            $('#container-wrapper5').hide();
        });
    </script>

 <!-- Hidden div that will be shown when the button is clicked -->
  <div class="container-fluid" id="container-wrapper5" style="display: none; padding: 50px;">                     
  <div class="row mb-3">
  <div class="col-lg-12">
  <div class="card mb-4">
  <div class="border rounded p-3 shadow-sm">
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
   <h1 class="h3 mb-0 text-gray-800">Lot Details</h1>           
  </div>   
  <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
  <div class="form-group col-md-3">
  <div class="form-group">
      <label for="lotcontract"><b>Contract :</b></label>
      <input type="text" id="lotcontract" name="lotcontract" style=padding-left:12%;  readonly="readonly">
  </div>
  <div class="form-group">
  <label for="dlotNo"><b>Lot No :</b></label>
  <input type="text" id="dlotNo" style=padding-left:12%;margin-left:12px; readonly="readonly">  
  </div>
  </div>
  
  <div class="form-group col-md-3"> 
  <div class="form-group">
  <label for="phases"><b>Phases :</b></label>
  <select id="phases" style=width:65%;margin-left:13%;>
  <option value="1">Select</option>       
  </select>
  </div>
   <div class="form-group">
    <label for="phase Details"><b>Phase Details :</b></label>
    <input type="text" id="phase_Details" style=padding-left:11%; readonly="readonly">
   </div> 
  </div>
  
  <div class="form-group col-md-3">  
   <div class="form-group">
    <label for="load"><b>Load :</b></label>
    <select id="load" style=width:65%;margin-left:13%;>
    <option value="1">Select</option>
    </select>
  </div>
  <div class="form-group">
  <label for="lotddescription"><b>Description :</b></label>
  <input type="text" id="lotddescription" style=padding-left:11%; readonly="readonly">  
  </div>
  </div>
  </div>
      
  <div class="table-responsive p-3">
  <table class="table table-striped table-bordered table-sm" id="tableID3" width="100">
  <thead>
   <tr>
    <th>Quantity</th>
    <th>MarkNo</th>
    <th>Description</th>
    <th>Weight</th>
    <th>ssize</th>
    <th>dims</th>
    <th>Phase</th>
    <th>Load No</th>
    <th>FabLoads</th>
    <th>FinishedGoods</th>
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
   </tr>
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
   </tr>
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
   </tr>
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
   </tr>
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
   </tr>
   </tbody>
  </table>
  </div> 
  </div> 
         <!-- BUILD LOAD BY LINE ITEMS Section (Placed after the table) -->
                <div style="margin-top: 3%">
                    <fieldset class="auto-style12">
                        <legend><b>BUILD LOAD BY LINE ITEMS</b></legend>
                        <table cellpadding="4" cellspacing="4">
                            <tr>
                                <td class="auto-style6">&nbsp;</td>
                                <td class="auto-style6" style="vertical-align: top">
                                    <label for="chkLoadItems" style="font-weight: bold;">ITEM LIST</label>
                                </td>
                                <td class="auto-style6">&nbsp;</td>
                                <td class="auto-style6">
                                    <label for="lblQtyTitle" style="font-weight: bold;">LOADED ITEM LIST</label>
                                </td>
                            </tr>
                            <tr>
                                <td class="auto-style6">&nbsp;</td>
                                <td class="auto-style6" style="vertical-align: top">
                                    <div id="div3" style="overflow-y: scroll; overflow-x: hidden; height: 210px;">
                                    </div>
                                </td>
                                <td class="auto-style6">
                                    <label for="txtQtyEntry" id="lblQtyTitle" style="color: black;">Qty</label>
                                    <input type="number" id="txtQtyEntry" oninput="onQtyChanged()" style="width: 200px; height: 23px;" min="1">
                                </td>
                                <td class="auto-style6",>
                                    <div id="div2" style="overflow-y: scroll; overflow-x: hidden; height: 210px;">
                                        <table id="gvLoadedList" border="1" cellpadding="3" cellspacing="0" width="100%">
                                            <thead>
                                                <tr>
                                                	<th>Select</th> 
                                                    <th>Quantity</th>
                                                    <th>MarkNo</th>
                                                    <th>Description</th>
                                                    <th>TotalWeight</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Dynamic rows will be added here -->
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="auto-style6">&nbsp;</td>
                            </tr>
                            <tr>
                                <td class="auto-style6">&nbsp;</td>
                                <td class="auto-style6">
                                    <button id="btnItemLoad" onclick="onItemLoadClicked()">Load</button>
                                </td>
                                <td class="auto-style6">&nbsp;</td>
                                <td class="auto-style6">
                                    <button id="btnUnload" onclick="onUnloadClicked()">UnLoad</button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <button id="btnUnloadCancel" onclick="onUnloadCancelClicked()">Cancel</button>
                                </td>
                            </tr>
                        </table>
                    </fieldset>
                </div>
            </div>
        </div>
    </div>
</div>
    

    <!-- jQuery and Bootstrap JS for button click functionality -->
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

   <script>
        // jQuery to toggle visibility of container-wrapper on any button click
        $('.buildloadButton').on('click', function() {
        	$('#loadDetailsModal').modal('hide');
            $('#container-wrapper5').toggle();  // Toggles the visibility of the div
            $('#container-wrapper2').hide();
    		const qtylabel=document.getElementById('lblQtyTitle');
			const qtyInput = document.getElementById('txtQtyEntry');
			    const tbody = document.getElementById('gvLoadedList');
					qtylabel.hidden=true;	
			        qtyInput.hidden = true; // Show the qty input
			        tbody.hidden=true; // Show the tbody (table body)
			        updatelotdetail();
        });
    </script>
    
  </div>
  </div>        
  </div>
 <!-- Scroll to top -->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a> 
    <script src="vendor/jquery/jquery.min.js"></script>
        <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
        <script src="js/ruang-admin.min.js"></script>
      <!-- Page level plugins -->
        <script src="vendor/datatables/jquery.dataTables.min.js"></script>
        <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
    <!--   <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script> -->
      <script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
      <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
      <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
      <script src="js/customertype.js"></script>
        <script src="js/Packing.js?v=<%=ts%>"></script>
        <script src="js/config.js"></script>
  <!-- Page level custom scripts -->
  
  

</body>
</html>