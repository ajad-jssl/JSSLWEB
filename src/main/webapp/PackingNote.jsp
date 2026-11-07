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
   

<link href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />




  <script src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>



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
.popup-transpoter {
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
</style>

<style>
    /* Adding some additional style for consistency */
    body {
        font-family: Arial, sans-serif;
    }
    
    .auto-style12 {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }

    fieldset {
        border: none;
    }

    legend {
        font-size: 1.2em;
        color: #333;
    }

    table {
        width: 100%;
        border-spacing: 10px;
    }

    th, td {
        padding: 10px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
        font-weight: bold;
    }

    button:hover {
        opacity: 0.9;
    }

    button:active {
        background-color: #d9d9d9;
    }

    input[type="number"] {
        font-size: 16px;
    }

    /* Adding responsiveness for smaller screens */
    @media (max-width: 768px) {
        table, td, th {
            font-size: 14px;
        }

        .auto-style12 {
            padding: 10px;
        }

        button {
            width: 100%;
            padding: 15px;
        }
    }
</style>
</head>
</head>
<body>
<body onload="fetchEmployeeList();">
  <div id="wrapper">
    <!-- Sidebar -->
        <%@ include file="SubConSidebar.jsp" %>
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

        <div class="container-fluid" id="container-wrapper">
          <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">Packing Note Lot Creation</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="SubConDashboard.jsp">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">Packing Note</li>
              
            </ol>
          </div>
        <div class="row mb-3">
<div class="col-lg-12">
  <div class="card mb-4">
    <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
        <button   id="entry1">
          <i class="fas fa-plus"></i> Create
        </button>
      </div>
    </div>

    <div class="table-responsive p-3">
      <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
        </table>
    </div>
  </div>
</div>
</div>
</div>
</div>
</div>

    <div class="modal fade" id="exampleModalScrollable123" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
     <div class="modal-content">
         <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Contract Selection</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
 <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
                   <div class="form-row">
    <div class="form-group col-md-4">
    <div class="form-group">
      <label for="Contract"><b>Contract :</b></label>
      <select class="form-control form-control-sm" id="contractor">
      <option value="">Select Contractor</option>
      </select>    
  </div>     
  </div>
  
   <div class="form-group col-md-4">
      <div class="form-group">
      <label for="Lotnumber"><b>Lot :</b></label>
      <select class="form-control form-control-sm" id="Lotnumber">
      <option value="">Select Lotnumber</option>
      </select>    
  </div>    
  </div>
   <div class="form-group col-md-4">
        <button type="button" class="btn btn-success btn-sm" id="Show" style=margin-left:21%;margin-top:31px;>Show</button>
          <button type="button" class="btn btn-success btn-sm" id="Packing" style=margin-left:5%;margin-top:31px;>Create Lot</button>
    </div>
 </div> 
 </form>
   <div id="container4" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note List</h5>
        
        <div class="form-row dynamic-row">
         <div class="table-responsive p-3">      
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
                <td><div class="mt-4">         
         <button type="button" class="btn btn-success btn-sm" id="build">Build</button>
         <button type="button" class="btn btn-success btn-sm" id="transport">Transport</button>
        </div></td>
              </tr>
            
            </tbody>               
          </table>
         </div> 

 
        <!--    <div class="mt-4 text-left">         
         <button type="button" class="btn btn-success btn-sm" id="Packing">Create Lot</button>
        </div> -->
  </div>
  </div>
   </div>
  
   

   <div id="container-wrapper1" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Lot Entry</h5>
        
          <div class="form-row dynamic-row">
   <div class="form-group col-md-3">
      <label for="trailerrefno"><b>Trailer Reference No :</b></label>
       <input type="text" id="trailerrefno" class="form-control form-control-sm">    
  </div>
  
  <div class="form-group col-md-3">
      <label for="wighbridgerefno"><b>Weighbridge Reference No :</b></label>
       <input type="text" id="wighbridgerefno" class="form-control form-control-sm">    
  </div>

<div class="form-group col-md-3">
  <label for="weighbridgeton"><b>Weighbridge Weight(Ton) :</b></label>
   <input type="text" id="weighbridgeton" class="form-control form-control-sm">
  </div> 
 
  
 <div class="form-group col-md-2"> 
  <label for="desc"><b>Description :</b></label>
     <input type="text" id="desc" class="form-control form-control-sm">
  </div>

  </div> 
  
  <div class="table-responsive p-3">
  <div class="modal-footer">
     <button type="button" class="btn btn-secondary"  id="closetransinfor">Close</button>
     <button type="button" class="btn btn-primary" id="submit">Create</button>
   <!--  <button type="button" class="btn btn-primary" id="resetButton" onclick="validateForm();addevent();">Create</button>
     <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="openModalAdd();">Close</button> -->
  </div>
  </div>  
  </div>
  </div>
 
     
 
 <div id="container-wrapper2" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Lot Transport Details</h5>

<div>
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Selected Lot Details</h5>
        
          <div class="form-row dynamic-row">
                            <div class="form-group col-md-4">
                                <div class="form-group">
                                    <label for="lot_no"><b>Lot No :</b></label>
                                    <input type="text" id="lot_no" name="lotno" class="form-control form-control-sm" readonly="readonly">
                                </div>
                            </div>
                            <div class="form-group col-md-4"> 
                                <div class="form-group">
                                    <label for="contract"><b>Contract :</b></label>
                                    <input type="text" id="contract" class="form-control form-control-sm" readonly="readonly">
                                </div> 
                            </div> 
                            <div class="form-group col-md-4"> 
                                <div class="form-group">
                                    <label for="description"><b>Description :</b></label>
                                    <input type="text" id="description" class="form-control form-control-sm" readonly="readonly">
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
     
        
        
        
            
  <div>
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1500px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Transport Details</h5>
        
          <div class="form-row dynamic-row">
  <div class="form-group col-md-3">
     <div class="form-group">
      <label for="Haulier"><b>Haulier :</b></label>
      <select id="Haulier" class="form-control form-control-sm">
      <option value="">Select Contractor</option>
      </select>
      <div id="haulierError" class="error-message"
	style="display: none; color: red; font-size: 12px;">
	</div>
  </div>
  </div>
  <div class="form-group col-md-3"">
   <div class="form-group">
   <label for="general_notes"><b>General Notes :</b></label>
   <input type="text" id="general_notes" class="form-control form-control-sm">
  </div>
  </div>
  
  
  <div class="form-group col-md-3"> 
   <div class="form-group">
   <label for="Description"><b>Destination :</b></label>
   <select id="Destination" class="form-control form-control-sm">
   <option value="1">Select</option>
   </select>  
  </div>
      <div id="Destination1Error" class="error-message"
	style="display: none; color: red; font-size: 12px;">
	</div>
  </div> 
  
  <div class="form-group col-md-3">
    <div class="form-group">
    <label for="state"><b>Destination State :</b></label>
    <select id="State" class="form-control form-control-sm">
    <option value="1">Select</option>
    </select>
  </div>
     <div id="DestinationError" class="error-message"
	style="display: none; color: red; font-size: 12px;">
	</div>
  </div>
  
  
  <div class="form-group col-md-3">  
    <div class="form-group">
    <label for="details"><b>Details :</b></label>
    <input type="text" id="Details" class="form-control form-control-sm" readonly="readonly">
  </div>
  </div>
 
  
  <div class="form-group col-md-3">  
   <div class="form-group">
    <label for="invoiceref"><b>Invoice RefNo Subcontractor:</b></label>
    <input type="text" id="invoiceref" class="form-control form-control-sm">
  </div>
  </div>
  
  <div class="form-group col-md-3">
    <div class="form-group">
    <label for="Loadtype "><b>Load Type :</b></label>
    <select id="Loadtype" class="form-control form-control-sm">
    <option value="1">Select</option>
    <option value="2">12-15M</option>
    <option value="3">15.1-18.5M</option>
    <option value="4">18.6-25M</option>
    </select>
  </div>
      <div id="LoadtypeError" class="error-message"
	style="display: none; color: red; font-size: 12px;">
	</div>
  </div>
  </div>
  </div>
      
  <div class="table-responsive p-3">
  <div class="modal-footer">
     <button type="button" class="btn btn-secondary"  id="closetransport">Close</button>
     <button type="button" class="btn btn-primary" id="transsubmit">Create</button>
     <!-- <button type="button" class="btn btn-primary" id="resetButton" onclick="addtranspoter();">Create</button>
     <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="openModalAdd();">Close</button> -->
  </div>
  </div> 
  </div> 
  </div>
  </div>
 

    <!-- jQuery and Bootstrap JS for button click functionality -->
  <!--     <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script> -->

   <!--  <script>
        // jQuery to toggle visibility of container-wrapper on any button click
        $('.transportationButton').on('click', function() {
        	$('#loadDetailsModal').modal('hide');
            $('#container-wrapper2').toggle();  // Toggles the visibility of the div
            $('#container-wrapper5').hide();
        });
    </script> -->

 <!-- Hidden div that will be shown when the button is clicked -->
        <div id="container-wrapper5" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Build Lot Details</h5>

 <div class="form-row dynamic-row">
  <div class="form-group col-md-4">
     <div class="form-group">
      <label for="lotcontract"><b>Contract :</b></label>
      <input type="text" id="lotcontract" name="lotcontract" class="form-control form-control-sm"  readonly="readonly">
  </div>
  </div>
  
  <div class="form-group col-md-4">
     <div class="form-group">
  <label for="dlotNo"><b>Lot No :</b></label>
  <input type="text" id="dlotNo" class="form-control form-control-sm" readonly="readonly">  
  </div>
  </div>
  
  
  <div class="form-group col-md-4"> 
   <div class="form-group">
    <label for="phases"><b>Phases :</b></label>
    <select id="phases" class="form-control form-control-sm">
    <option value="">Select</option>       
    </select>
   </div> 
  </div>
  
   <div class="form-group  col-md-4">
   <div class="form-group">
    <label for="phase Details"><b>Phase Details :</b></label>
    <input type="text" id="phase_Details" class="form-control form-control-sm" readonly="readonly">
   </div> 
   </div> 
  
  
  <div class="form-group col-md-4">  
   <div class="form-group">
    <label for="load"><b>Load :</b></label>
    <select id="load" class="form-control form-control-sm">
    <option value="">Select</option>
    </select>
  </div>
  </div>
  
  <div class="form-group col-md-4">
    <div class="form-group">
  <label for="lotddescription"><b>Description :</b></label>
  <input type="text" id="lotddescription" class="form-control form-control-sm" readonly="readonly">  
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
   </tbody>
  </table>
  </div> 
 </div> 
</div>       
        <!-- BUILD LOAD BY LINE ITEMS Section (Placed after the table) -->

   <div style="margin-top: 3%">
        <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Build Lot Details</h5>
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
                    <!-- </fieldset> -->
                </div>
</div>
          </div> 
         </div>
        </div> 
       </div>   
      </div> 
      
      
     
<div class="modal fade" id="loadDetailsModal" tabindex="-1" aria-labelledby="loadDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 360px;">
        <div class="modal-content" style="border-radius: 12px; border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">

            <!-- Header -->
            <div class="modal-header" style="background: linear-gradient(90deg,rgba(163, 214, 178, 1) 100%, rgba(237, 221, 83, 1) 100%); border-radius: 12px 12px 0 0; padding: 14px 20px;">
                <h5 class="modal-title" style="color:BLack; font-weight: 600; font-size: 15px; margin: 0;">
                    <i class="fas fa-list-alt mr-2"></i> Choose Function
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="closethemodal"
                    style="color:Black; opacity: 1; font-size: 20px;">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <!-- Footer Buttons Only -->
            <div class="modal-footer" style="border-radius: 0 0 12px 12px; padding: 20px; justify-content: center; gap: 12px; border-top: none;">
                <button type="button" class="btn buildloadButton"
                    style="background-color:#76D44A; color:Black; border-radius: 6px; padding: 8px 24px; font-size: 13px; font-weight: 500; border: none; min-width: 130px;">
                    <i class="fas fa-hammer mr-1"></i> Build Load
                </button>
                <button type="button" class="btn transportationButton"
                    style="background: linear-gradient(90deg,rgba(255, 255, 255, 1) 2%, rgba(237, 237, 33, 1) 0%); color:black; border-radius: 6px; padding: 8px 24px; font-size: 13px; font-weight: 500; border: none; min-width: 130px;">
                    <i class="fas fa-truck mr-1"></i> Transportation
                </button>
               
            </div>

        </div>
    </div>
</div>



<!--  <script>
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
    </script>  -->
    
    <!-- Modal Structure -->
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
          
    <div class="modal fade" id="exampleModalCenter67" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 54%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header2"> 
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmYes1">YES</button>
                </div>
              </div>
            </div>
          </div>      
          
<script>
$(document).ready(function() {
    // Make the Haulier dropdown searchable
    $('#Haulier').select2({
        placeholder: "Select Haulier", // Optional placeholder
        allowClear: true,             // Adds a clear button
        width: '100%'                  // Make dropdown width 100%
    });

    // If you want other dropdowns searchable as well:
    $('#contractor, #Lotnumber, #Destination, #State, #Loadtype, #phases, #load').select2({
        placeholder: "Select an option",
        allowClear: true,
        width: '100%'
    });
});
</script>
          
 <script>
        // jQuery to toggle visibility of container-wrapper on any button click
       $('.buildloadButton').on('click', function(e) {
            e.preventDefault();  // Prevents any default action (like form submission or page navigation)
        	$('#loadDetailsModal').modal('hide');
            $('#container-wrapper5').toggle();  // Toggles the visibility of the div
            $('#container-wrapper2').hide();
    		const qtylabel=document.getElementById('lblQtyTitle');
			const qtyInput = document.getElementById('txtQtyEntry');
			    const tbody = document.getElementById('gvLoadedList');
					qtylabel.hidden=true;	
			        qtyInput.hidden = true; // Show the qty input
			        tbody.hidden=true; // Show the tbody (table body)
			        
			        
			        $("#phases").val("");
			        $("#load").val("");
			        updatelotdetail();
        });
    </script>

   <script>
$('.transportationButton').on('click', function(e) {
    e.preventDefault();  // Prevents any default action
    
    $('#loadDetailsModal').modal('hide');
    $('#container-wrapper2').toggle();  // Toggles the visibility of the div
    $('#container-wrapper5').hide();
});
</script>


  
    
    
    <script>
        // jQuery to toggle visibility of container-wrapper on button click
        $('#Packing').on('click', function() {
        	 $(this)
             .prop("disabled", true)
             .removeClass("btn-success")
             .addClass("btn-secondary");
            $('#container-wrapper1').show();  // Toggles the visibility of the div
        });
    </script>
        
    
 
 <!-- Scroll to top -->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a> 
 <!--    <script src="vendor/jquery/jquery.min.js"></script> -->
        <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
     
        <script src="vendor/datatables/jquery.dataTables.min.js"></script>
        <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
    <!--   <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script> -->
      <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
      <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
      <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
    
        <script src="js/Packing.js?v=<%=ver(application, "/js/Packing.js")%>"></script>
        <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
          <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
             <script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
             <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
        <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
    "Insert": "modalScroll1",         // Create button
 /*    "Edit": "updateitems"     // Update button */
  };
</script>
  <script src="js/permissions.js?v=<%=ver(application, "/js/permissions.js")%>"></script>
</body>
</html>