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
         <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
      <link rel="stylesheet" href="css/main.css">
       <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
       <script src="js/sidebar.js"></script>
  
  
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
  <script type="text/javascript">
 function noBack() {
     window.history.forward();
 }
 </script>
  <script>
  function noBack() {
	    window.history.forward();
	}
  </script>
</head>

<body>
  <div id="wrapper">
    <!-- Sidebar -->
      <%@ include file="sidebar.jsp" %>
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
            <h1 class="h3 mb-0 text-gray-800">Other Packing Note</h1>
            <ol class="breadcrumb">
             <li class="breadcrumb-item"><a href="Dashboard.jsp">Home</a></li>
             <li class="breadcrumb-item"><a href="OtherSideMenu.jsp">Other</a></li> 
             <li class="breadcrumb-item active" aria-current="page">Other Packing Note</li>
              
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
       <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
        <thead>
        
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
       <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1500px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Other Packing Note</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="type"><b>Type:</b></label>               
                <select id="type" class="form-control form-control-sm">
                <option value="">Select Type</option>              
                </select>
               </div>              
                
               <div class="form-group col-md-3" style="padding-top:2%;padding-left:1%;">
                 <button type="button" class="btn btn-sm btn-success" id="search" hidden="hidden">Search</button>
               </div>                                                                
              </div>
              
   <!-- Dynamic Fields Container (Initially Hidden) -->
<div id="inputFieldsContainer" style="display:none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
    <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
    <div class="form-row font-weight-bold mb-2">
    <div class="col-md-2">Uom</div>
    <div class="col-md-2">Type</div>
    <div class="col-md-2">Quantity</div>
    <div class="col-md-2">Kgs/MT/Sqm</div>
    <div class="col-md-1">Unit Price</div>
    <div class="col-md-1">Total</div>
    <div class="col-md-1 text-center">Action</div>
</div>
    <!-- Form Rows Container -->
    <div id="dynamicRowsContainer">
        <!-- Initial Row (Visible by default) -->
    </div>
    
    <!-- Add Row Button -->
     <div class="mt-2">
    <button type="button" class="btn btn-sm btn-success" onclick="addRow();">Add Row</button>
    </div>
        <div class="form-row mt-3 font-weight-bold">
    <div class="col-md-2"></div>
    <div class="col-md-2"></div>
    <div class="col-md-1"></div>
    <div class="col-md-1"></div>
    <div class="col-md-2"></div>
    <div class="col-md-1"></div>

  <!--   <div class="col-md-3 ms-3" style="margin-left: 68%;">
        <label for="totalNo">Grand Total</label>
        <input type="text" id="totalNo" class="form-control form-control-sm" readonly>
    </div> -->
        <div class="col-md-1">
        <label>Grand Total</label>
        <input type="text" id="totalNo" class="form-control form-control-sm text-right" readonly>
    </div>

    <div class="col-md-1"></div>
</div>
</div>
<!-- Transporter and Vehicle Details -->
    <div class="form-row mt-3">
       <div class="form-group col-md-3">
            <label for="freig"><b>Freight:</b></label>
            <input type="number" class="form-control form-control-sm" id="freig" placeholder="Freight" autocomplete="off" min="0">
            <div id="Freighterror" class="error-message"></div>
          </div>
          <div class="form-group col-md-3">
            <label for="buyer"><b>Buyer's Reference No:</b></label>
            <input type="text" class="form-control form-control-sm" id="buyer">
            <div id="buyerError" class="text-danger" style="display: none;">Buyer's Reference No is required</div>
          </div>
          <div class="form-group col-md-3">
            <label for="date"><b>Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="date">
            <div id="dateError" class="text-danger" style="display: none;">Date is required</div>
          </div>
          <div class="form-group col-md-3">
            <label for="transporter"><b>Transporter Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="trans" placeholder="Transporter Name" autocomplete="off">
            <div id="Transportererror" class="error-message"></div>
          </div>
          <div class="form-group col-md-3">
            <label for="vehicle"><b>Vehicle No:</b></label>
           <input type="text" class="form-control form-control-sm" id="vehi" placeholder="Vehicle No" autocomplete="off">
            <div id="Vehicleerror" class="error-message"></div>
          </div>
          <div class="form-group col-md-3">
            <label for="upload"><b>Upload Packing Note:</b></label>
            <input type="file" class="form-control form-control-sm" id="file">      
                <div id="fileerror" class="text-danger" style="display: none;">Enclose Attachment is required</div>     
          </div>
        
        </div>
    </div>
    
             <!-- Submit and Cancel Buttons -->
                    <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-sm btn-primary" onclick="openModalAdd();">Create</button>
                    </div> 
               </form>                
             </div>     
            </div>
           </div>                          
         </div >
         
                                 
        
          <div class="modal fade" id="exampleModalCenter66" tabindex="-1"
			role="dialog" aria-labelledby="exampleModalCenterTitle"
			aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content"
					style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
					<div class="modal-header1">
						<!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> -->
						<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
					</div>
					<div class="modal-body">
						<b>Are you sure you want to create Steel Packing Note?</b>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>
						<button type="button" class="btn btn-info btn-sm"
							onclick="addevent()">YES</button>
					</div>
				</div>
			</div>
		</div>
		
		<div class="modal fade" id="exampleModalCenterDup" tabindex="-1" role="dialog"
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
                  <b id="errorMessage"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">OK</button> 
                </div>
              </div>
            </div>
          </div>
      
      
      
      <div class="modal fade" id="exampleModalScrollable123update" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
       <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1500px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Update Other Packing Note</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row" hidden="hidden">
               <div class="form-group col-md-3">
                <label for="type1"><b>Type:</b></label>               
                <select id="type1" class="form-control form-control-sm">
                <option value="">Select Type</option>              
                </select>
               </div>              
                
               <div class="form-group col-md-3" style="padding-top:2%;padding-left:1%;">
                 <button type="button" class="btn btn-sm btn-success" id="search1" >Search</button>
               </div>                                                                
              </div>
              
              
   <!-- Dynamic Fields Container (Initially Hidden) -->
<div>
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
    <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
    <div class="form-row font-weight-bold mb-2">
    <div class="col-md-2">Uom</div>
    <div class="col-md-2">Type</div>
    <div class="col-md-2">Quantity</div>
    <div class="col-md-2">Kgs/MT/Sqm</div>
    <div class="col-md-2">Unit Price</div>
    <div class="col-md-1">Total</div>
    <div class="col-md-1 text-center">Action</div>
</div>
    <!-- Form Rows Container -->
    <div id="dynamicRowsContaineredit">
        <!-- Initial Row (Visible by default) -->
    </div>
    
    <!-- Add Row Button -->
    <div class="mt-2">
    <button type="button" class="btn btn-sm btn-success" onclick="addRowEdit();">Add Row</button>
    </div>
       <div class="form-row mt-3 font-weight-bold">
    <div class="col-md-2"></div>
    <div class="col-md-2"></div>
    <div class="col-md-2"></div>
    <div class="col-md-1"></div>
    <div class="col-md-2"></div>
    <div class="col-md-1"></div>
  <!--   <div class="col-md-3 ms-3" style="margin-left: 68%;">
        <label for="totalNo1">Grand Total</label>
        <input type="text" id="totalNoedit" class="form-control form-control-sm" readonly>
    </div> -->
        <div class="col-md-1">
        <label>Grand Total</label>
        <input type="text" id="totalNoedit" class="form-control form-control-sm text-right" readonly>
    </div>

    <div class="col-md-1"></div>
</div>
</div>
<!-- Transporter and Vehicle Details -->
    <div class="form-row mt-3">
       <div class="form-group col-md-3">
            <label for="freight"><b>Freight:</b></label>
            <input type="number" class="form-control form-control-sm" id="freigedit" placeholder="Freight" autocomplete="off" min="0">
            <div id="Freighterroredit" class="error-message"></div>
          </div>
          <div class="form-group col-md-3">
            <label for="buyer1"><b>Buyer's Reference No:</b></label>
            <input type="text" class="form-control form-control-sm" id="buyer1">
            <div id="buyer1Error" class="text-danger" style="display: none;">Buyer's Reference No is required</div>
          </div>
          <div class="form-group col-md-3">
            <label for="date1"><b>Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="date1">
            <div id="date1Error" class="text-danger" style="display: none;">Date is required</div>
          </div>
          <div class="form-group col-md-3">
            <label for="transporter1"><b>Transporter Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="transedit" placeholder="Transporter Name" autocomplete="off">
            <div id="Transportererroredit" class="error-message"></div>
          </div>
          <div class="form-group col-md-3">
            <label for="vehicle1"><b>Vehicle No:</b></label>
            <input type="text" class="form-control form-control-sm" id="vehiedit" placeholder="Vehicle No" autocomplete="off">
            <div id="Vehicleerroredit" class="error-message"></div>
          </div>
          <div class="form-group col-md-3">
            <label for="upload1"><b>Upload Packing Note:</b></label>
                <div class="input-group">
        <input type="file" class="form-control form-control-sm" id="fileedit">
        <!-- Eye icon button -->
        <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" id="eyeIconBtn">
                <i class="fas fa-eye" id="eyeIcon"></i>
            </button>
        </div>
    </div>
      <div id="fileediterror" class="error-message"></div>
    <!-- Display File Name -->
    <div id="fileNameDisplay" style="margin-top: 10px; font-size: 14px; color: gray; border: 1px solid #ccc; padding: 5px; border-radius: 5px; background-color: #f9f9f9; max-width: 100%;"></div>
</div>

          
           <div class="form-group col-md-3" style="display:none;">
            <label for="bal"><b>Pnid:</b></label>
            <input type="text" class="form-control form-control-sm" id="pnidedit">
           </div>
        
        </div>
    </div>
    
             <!-- Submit and Cancel Buttons -->
                    <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-sm btn-primary" id="updateothers" onclick="openModalUpdate();">Update</button>
                    </div> 
          </form>                  
         </div >                        
        </div>
       </div>
      </div>
            <div class="modal fade" id="exampleModalScrollable123view" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
       <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1500px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>View Other Packing Note</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row" hidden="hidden">
               <div class="form-group col-md-3">
                <label for="type1"><b>Type:</b></label>               
                <select id="type1view" class="form-control form-control-sm">
                <option value="">Select Type</option>              
                </select>
               </div>              
                
               <div class="form-group col-md-3" style="padding-top:2%;padding-left:1%;">
                 <button type="button" class="btn btn-sm btn-success" id="search1" >Search</button>
               </div>                                                                
              </div>
              
              
   <!-- Dynamic Fields Container (Initially Hidden) -->
<div>
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
    <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
    <div class="form-row font-weight-bold mb-2">
    <div class="col-md-2">Uom</div>
    <div class="col-md-2">Type</div>
    <div class="col-md-2">Quantity</div>
    <div class="col-md-2">Kgs/MT/Sqm</div>
    <div class="col-md-2">Unit Price</div>
    <div class="col-md-1">Total</div>
</div>
    <!-- Form Rows Container -->
    <div id="dynamicRowsContainerview">
        <!-- Initial Row (Visible by default) -->
    </div>
    
    <!-- Add Row Button -->
  <!--   <div class="mt-2">
    <button type="button" class="btn btn-sm btn-success" onclick="addRowEdit();">Add Row</button>
    </div> -->
       <div class="form-row mt-3 font-weight-bold">
    <div class="col-md-2"></div>
    <div class="col-md-2"></div>
    <div class="col-md-2"></div>
    <div class="col-md-1"></div>
    <div class="col-md-2"></div>
    <div class="col-md-1"></div>
  <!--   <div class="col-md-3 ms-3" style="margin-left: 68%;">
        <label for="totalNo1">Grand Total</label>
        <input type="text" id="totalNoedit" class="form-control form-control-sm" readonly>
    </div> -->
        <div class="col-md-1">
        <label>Grand Total</label>
        <input type="text" id="totalNoview" class="form-control form-control-sm text-right" readonly>
    </div>

    <div class="col-md-1"></div>
</div>
</div>
<!-- Transporter and Vehicle Details -->
    <div class="form-row mt-3">
       <div class="form-group col-md-3">
            <label for="freight"><b>Freight:</b></label>
            <input type="number" class="form-control form-control-sm" id="freigview" placeholder="Freight" autocomplete="off" min="0" readonly="readonly">
            <div id="Freighterroredit" class="error-message"></div>
          </div>
          <div class="form-group col-md-3">
            <label for="buyer1"><b>Buyer's Reference No:</b></label>
            <input type="text" class="form-control form-control-sm" id="buyerview" readonly="readonly">
          
          </div>
          <div class="form-group col-md-3">
            <label for="date1"><b>Date:</b></label>
            <input type="date" class="form-control form-control-sm" id="date1view" readonly="readonly">
          </div>
          <div class="form-group col-md-3">
            <label for="transporter1"><b>Transporter Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="transview" placeholder="Transporter Name" autocomplete="off" readonly="readonly">
          </div>
          <div class="form-group col-md-3">
            <label for="vehicle1"><b>Vehicle No:</b></label>
            <input type="text" class="form-control form-control-sm" id="vehiview" placeholder="Vehicle No" autocomplete="off" readonly="readonly">
          </div>
          <div class="form-group col-md-3">
            <label for="upload1"><b>Upload Packing Note:</b></label>
                <div class="input-group">
        <!-- Eye icon button -->
         <div id="fileNameDisplayview" style="margin-top: 10px; font-size: 14px; color: gray; border: 1px solid #ccc; padding: 5px; border-radius: 5px; background-color: #f9f9f9; max-width: 100%;"></div>
        <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" id="eyeIconBtnview">
                <i class="fas fa-eye" id="eyeIcon"></i>
            </button>
        </div>
    </div>
   
    <!-- Display File Name -->
   
</div>

          
           <div class="form-group col-md-3" style="display:none;">
            <label for="bal"><b>Pnid:</b></label>
            <input type="text" class="form-control form-control-sm" id="pnidview">
           </div>
        
        </div>
    </div>
        
          </form>                  
         </div >                        
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>

<div class="modal fade" id="exampleModalCenter66update" tabindex="-1"
			role="dialog" aria-labelledby="exampleModalCenterTitle"
			aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content"
					style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
					<div class="modal-header1">
						<!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> -->
						<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
					</div>
					<div class="modal-body">
						<b>Are you sure you want to update others Packing Note?</b>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>
						<button type="button" class="btn btn-info btn-sm"
							onclick="updateevent()">YES</button>
					</div>
				</div>
			</div>
		</div>
<!-- Scroll to top -->
<a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>

<!-- 
<script>
  document.getElementById("search").addEventListener("click", function () {
    document.getElementById("inputFieldsContainer").style.display = "block";
  });
</script> -->



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
  <script src="js/OtherPacking.js?v=<%=ts%>"></script>
      <script src="js/logout.js"></script>
  <script src="js/username.js"></script>  
  <script src="js/createdby.js"></script>
 	   <script src="js/modifiedby.js"></script>
 	  <script src="js/factoryid.js"></script>
 	   <script src="js/Sessionfilter.js"></script>
 	   	   	  <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
<script src="js/permissions.js"></script>

  <!-- Page level custom scripts -->
</body>
</html>