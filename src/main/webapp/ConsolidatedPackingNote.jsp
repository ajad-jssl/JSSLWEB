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
   <link rel="stylesheet" href="css/main.css">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
 <script src="js/sidebar.js"></script>



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
    .dropdown-checkbox {
      position: relative;
      display: inline-block;
      width: 100%;
    }

    .dropdown-checkbox .dropdown-btn {
      width: 100%;
      padding: 6px 12px;
      border: 1px solid #ccc;
      background-color: #fff;
      cursor: pointer;
      text-align: left;
    }

    .dropdown-checkbox .checkbox-menu {
      display: none;
      position: absolute;
      background-color: white;
      border: 1px solid #ccc;
      width: 100%;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1;
    }

    .checkbox-menu label {
      display: block;
      padding: 5px 10px;
      cursor: pointer;
    }

    .checkbox-menu label:hover {
      background-color: #f0f0f0;
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

<body >
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
            <h1 class="h3 mb-0 text-gray-800">Consolidated Packing Note</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="Dashboard.jsp">Home</a></li>
               <li class="breadcrumb-item"><a href=Consolidatesidemenu.jsp>Consolidated</a></li>
             <li class="breadcrumb-item active" aria-current="page">Consolidated Packing Note</li>
              
            </ol>
          </div>
          
          
<div class="row mb-3" id="vehicleentry">
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
      <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
        <thead>
        
        </thead>
        <tbody>
         <!--  Dynamic rows will be inserted here -->
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
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Consolidated Packing Note</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row">
               <div class="col-md-3">
                <label for="contract"><b>Contract:</b></label>
                <select id="cont" class="form-control form-control-sm">
                </select>
               </div>
               
               <div class="col-md-3">
                <label for="milestone"><b>Milestone:</b></label>
                <select id="mile" class="form-control form-control-sm">
                <option value="">Select Milestone</option>
                </select>
               </div>                           
                              
                <div class="form-group col-md-3" style="padding-top:2%;padding-left:1%;">
                 <button type="button" class="btn btn-sm btn-success" style="display: none;" id="search">Search</button>
                </div>                                                                
              </div>
              
             <div id=container1 style="display: none;">
              <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
               <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Contract Details</h5>
                <div class="col-md-3">
                 <label for="invoice"><b>Invoice No:</b></label>
                  <div class="dropdown-checkbox" id="invoiceDropdown">
                   <div class="dropdown-btn">Select Invoice No</div>
                    <div class="checkbox-menu" id="invoiceCheckboxMenu">
                    </div>
                   </div>
                  </div>
                
                
                
                 <div class="form-group col-md-3" style="padding-top:2%;padding-left:1%;">
                 <button type="button" class="btn btn-sm btn-success" style=" display:none" id="btnnext">Next</button>
                </div>      
               </div>
              </div>
              
    <!-- Dynamic Fields Container (Initially Hidden) -->
           
   <div id=container2 style="display: none;">
  
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        <div class="form-row font-weight-bold mb-2">
    <div class="col-md-1">Invoice No</div>
    <div class="col-md-1">UOM</div>
    <div class="col-md-1">Quantity</div>
    <div class="col-md-1">KGS</div>
    <div class="col-md-2">Unit Price</div>
    <div class="col-md-2">Total</div>
    <div class="col-md-2">Item Type</div>
</div>
         <div id="packingRowsContainer">
         </div>  
   </div>

   
         <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
          <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Invoice face details</h5>
        
              <div class="form-row dynamic-row">
               <div class="form-group col-md-2 col-sm-12">
                <label for="UOM1"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="UOM1" placeholder="UOM" readonly>
                <div id="UOM1Error" class="text-danger" style="display: none;">UOM is required</div>
               </div>
               
                <div class="form-group col-md-2 col-sm-12">
                <label for="qty"><b>Qty:</b></label>
                <input type="text" class="form-control form-control-sm" id="qty" placeholder="Qty" readonly>
                
               </div>
                <div class="form-group col-md-2 col-sm-12">
                <label for="qty"><b>Weight:</b></label>
                <input type="text" class="form-control form-control-sm" id="kgs" placeholder="Weight" readonly>
               
               </div>
               <div class="form-group col-md-2 col-sm-12">
                <label for="price"><b>Unit Price:</b></label>
                <input type="text" class="form-control form-control-sm" id="price" oninput="calculateLineTotal()" placeholder="Unit Price">
                <div id="priceError" class="text-danger" style="display: none;">Unit Price is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="total1"><b>Total:</b></label>
                <input type="text" class="form-control form-control-sm" id="total1" value="0" readonly>
                <div id="total1Error" class="text-danger" style="display: none;">Total is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="type"><b>Item Type:</b></label>
                <select  class="form-control form-control-sm" id="type" placeholder="Item Type">
                </select>
                <div id="typeError" class="text-danger" style="display: none;">Item Type is required</div>
               </div>                           
              </div>
             </div>
               
              <div id="inputFieldsContainerre">
    <!-- Transporter and Vehicle Details -->  
       <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="vehicle"><b>Vehicle No:</b></label>
            <input type="text" class="form-control form-control-sm" id="vehi">
            <div id="vehiError" class="text-danger" style="display: none;">Vehicle No is required</div>
        </div>
        
        <div class="form-group col-md-3">
            <label for="transporter"><b>Transporter Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="trans">
            <div id="transError" class="text-danger" style="display: none;">Transporter Name is required</div>
        </div>   
        
              <div class="table-responsive p-3">
               <!-- Buttons -->
               <div class="mt-4 text-right">
                <button type="reset" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>                
                <button type="button" class="btn btn-sm btn-primary" id="btnsubmit" onclick="openModalAdd()">Submit</button>                
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
						<b>Are you sure you want to create Consolidated Packing Note?</b>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>
						<button type="button" class="btn btn-info btn-sm"
							onclick="addConsolidatedPacking()">YES</button>
					</div>
				</div>
			</div>
		</div>
 
 
 
     <div class="modal fade" id="exampleModalScrollable123update" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1500px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Update Consolidated Packing Note Form</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row">
               <div class="col-md-3">
                <label for="contract"><b>Contract:</b></label>
                  <input type="text" class="form-control form-control-sm" id="contedit" placeholder="Contract" readonly>
               </div>
               
               <div class="col-md-3">
                <label for="milestone"><b>Milestone:</b></label>
                  <input type="text" class="form-control form-control-sm" id="mileedit" placeholder="Milestone" readonly>
                
               </div>                           
                              
                <div class="form-group col-md-3" style="padding-top:2%;padding-left:1%;">
                 <button type="button" class="btn btn-sm btn-success"  style="display: none;" id="search1">Search</button>
                </div>                                                                
              </div>
              
    <!-- Dynamic Fields Container (Initially Hidden) -->
    
     <div id=container1up >
              <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
               <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Contract Details</h5>
                <div class="col-md-3">
                 <label for="invoice"><b>Invoice No:</b></label>
                  <div class="dropdown-checkbox" id="invoiceDropdownUP">
                   <div class="dropdown-btn">Select Invoice No</div>
                    <div class="checkbox-menu" id="invoiceCheckboxMenuUP">
                    </div>
                     <div id="checkupError" class="text-danger" style="display: none;">Atleast One Invoice No should be Select</div>
                   </div>
                  </div>
                
                
                
                <!--  <div class="form-group col-md-3" style="padding-top:2%;padding-left:1%;">
                 <button type="button" class="btn btn-sm btn-success" style=" display:none" id="btnnext">Next</button>
                </div> -->      
               </div>
              </div>
                 <div id=container2up style="display: none;">
  
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        <div class="form-row font-weight-bold mb-2">
    <div class="col-md-1">Invoice No</div>
    <div class="col-md-1">UOM</div>
    <div class="col-md-1">Quantity</div>
    <div class="col-md-1">KGS</div>
    <div class="col-md-2">Unit Price</div>
    <div class="col-md-2">Total</div>
    <div class="col-md-2">Item Type</div>
</div>
         <div id="packingRowsContainerUp">
            
         </div>  
   </div>
              </div>
           
   <div id=container3Up>
    
   
         <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
          <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Update Invoice face details</h5>
        
              <div class="form-row dynamic-row">
               <div class="form-group col-md-2 col-sm-12">
                <label for="UOM3"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="UOM3" placeholder="UOM" readonly>
                <div id="UOM3Error" class="text-danger" style="display: none;">UOM is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="qty1"><b>Qty:</b></label>
                <input type="text" class="form-control form-control-sm" id="qty1" placeholder="Qty " readonly>
                
               </div>
               
                <div class="form-group col-md-2 col-sm-12">
                <label for="qty1"><b> Weight:</b></label>
                <input type="text" class="form-control form-control-sm" id="Weight1" placeholder=" Weight" readonly>
                
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="price1"><b>Unit Price:</b></label>
                <input type="text" class="form-control form-control-sm" id="price1" oninput="calculateLineTotalupdate()" placeholder="Unit Price">
                <div id="price1Error" class="text-danger" style="display: none;">Unit Price is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="total2"><b>Total:</b></label>
                <input type="text" class="form-control form-control-sm" id="total2" placeholder="Total" readonly>
                <div id="total2Error" class="text-danger" style="display: none;">Total is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="type1"><b>Item Type:</b></label>
                   <select id="type1" class="form-control form-control-sm">
                <option value="">Select type</option>
                </select>  
                <div id="type1Error" class="text-danger" style="display: none;">Item Type is required</div>
               </div>                           
              </div>
             </div>
               
              <div id="inputFieldsContainerre">
    <!-- Transporter and Vehicle Details -->  
       <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="vehicle1"><b>Vehicle No:</b></label>
            <input type="text" class="form-control form-control-sm" id="vehiedit">
            <div id="vehieditError" class="text-danger" style="display: none;">Vehicle No is required</div>
        </div>
        
        <div class="form-group col-md-3">
            <label for="transporter1"><b>Transporter Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="transedit">
            <div id="transeditError" class="text-danger" style="display: none;">Transporter Name is required</div>
        </div>   
        
          <div class="form-group col-md-3" style="display:none;">
            <label for="bal"><b>Pnid:</b></label>
            <input type="text" class="form-control form-control-sm" id="pnidedit">
            </div>
            
              <div class="table-responsive p-3">
               <!-- Buttons -->
               <div class="mt-4 text-right">
                <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-sm btn-primary" id="updateconsolidated" onclick="openModalUpdate();">Update</button>              
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

  <div class="modal fade" id="exampleModalScrollable123view" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1500px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Update Consolidated Packing Note Form</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row">
               <div class="col-md-3">
                <label for="contract"><b>Contract:</b></label>
                  <input type="text" class="form-control form-control-sm" id="contview" placeholder="Contract" readonly>
               </div>
               
               <div class="col-md-3">
                <label for="milestone"><b>Milestone:</b></label>
                  <input type="text" class="form-control form-control-sm" id="mileview" placeholder="Milestone" readonly>
                
               </div>         
                                                                           
              </div>
              
    <!-- Dynamic Fields Container (Initially Hidden) -->
           
   <div id=container3>
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px; display: none;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">view Packing Note Details</h5>
        
              <div class="form-row dynamic-row">
               <div class="form-group col-md-2 col-sm-12">
                <label for="invoice2"><b>Invoice No:</b></label>
                <input type="text" class="form-control form-control-sm" id="invoice2view" placeholder="Invoice No">
                <div id="invoice2Error" class="text-danger" style="display: none;">Invoice No is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="UOM2"><b>UOM:</b></label>              
                <select id="UOM2" class="form-control form-control-sm">
                <option value="">Select</option>
                <option value="1"></option>
                <option value="2"></option>
                </select>              
                <div id="UOM2Error" class="text-danger" style="display: none;">UOM is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="quantity1"><b>Quantity:</b></label>
                <input type="text" class="form-control form-control-sm" id="quantity1" placeholder="Quantity">
                <div id="quantity1Error" class="text-danger" style="display: none;">Quantity is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="kgs1"><b>KGS:</b></label>
                <input type="text" class="form-control form-control-sm" id="kgs1" placeholder="KGS">
                <div id="kgs1Error" class="text-danger" style="display: none;">KGS is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="unit1"><b>Unit Price:</b></label>
                <input type="text" class="form-control form-control-sm" id="unit1" placeholder="Unit Price">
                <div id="unit1Error" class="text-danger" style="display: none;">Unit Price is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="total3"><b>Total:</b></label>
                <input type="text" class="form-control form-control-sm" id="total3" placeholder="Total">
                <div id="total3Error" class="text-danger" style="display: none;">Total is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="item1"><b>Item Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="item1" placeholder="Item Type">
                <div =id="item1Error" class="text-danger" style="display: none;">Item Type is required</div>
               </div>
          </div> 

   </div>
   
         <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
          <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">view Invoice face details</h5>
        
              <div class="form-row dynamic-row">
               <div class="form-group col-md-2 col-sm-12">
                <label for="UOM3"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="UOM3view" placeholder="UOM" readonly>
                <div id="UOM3Error" class="text-danger" style="display: none;">UOM is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="qty1"><b>Qty:</b></label>
                <input type="text" class="form-control form-control-sm" id="qty1view" placeholder="Qty " readonly>
                
               </div>
               
                <div class="form-group col-md-2 col-sm-12">
                <label for="qty1"><b> Weight:</b></label>
                <input type="text" class="form-control form-control-sm" id="Weight1view" placeholder=" Weight" readonly>
                
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="price1"><b>Unit Price:</b></label>
                <input type="text" class="form-control form-control-sm" id="price1view" oninput="calculateLineTotalupdate()" placeholder="Unit Price" readonly>
                <div id="price1Error" class="text-danger" style="display: none;">Unit Price is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="total2"><b>Total:</b></label>
                <input type="text" class="form-control form-control-sm" id="total2view" placeholder="Total" readonly>
                <div id="total2Error" class="text-danger" style="display: none;">Total is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="type1view"><b>Item Type:</b></label>
                 <input type="text" class="form-control form-control-sm" id="type1view" readonly>
                 <!--   <select id="type1view" class="form-control form-control-sm">
                <option value="">Select type</option>
                </select>   -->
                <div id="type1Error" class="text-danger" style="display: none;">Item Type is required</div>
               </div>                           
              </div>
             </div>
               
              <div id="inputFieldsContainerre">
    <!-- Transporter and Vehicle Details -->  
       <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="vehicle1"><b>Vehicle No:</b></label>
            <input type="text" class="form-control form-control-sm" id="vehiview" readonly>
            <div id="vehieditError" class="text-danger" style="display: none;">Vehicle No is required</div>
        </div>
        
        <div class="form-group col-md-3">
            <label for="transporter1"><b>Transporter Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="transview" readonly>
            <div id="transeditError" class="text-danger" style="display: none;">Transporter Name is required</div>
        </div>   
        
          <div class="form-group col-md-3" style="display:none;">
            <label for="bal"><b>Pnid:</b></label>
            <input type="text" class="form-control form-control-sm" id="pnidview">
            </div>
            
              <div class="table-responsive p-3">
               <!-- Buttons -->
               <div class="mt-4 text-right">
                <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
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
            
           <div class="modal fade" id="exampleModalScrollable1" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1500px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Cancel Consolidated Packing Note Form</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row">
               <div class="col-md-3">
                <label for="contract3"><b>Contract:</b></label>
                <select id="contract3" class="form-control form-control-sm">
                <option value="">Select Contract</option>                
                </select>
               </div>
               
               <div class="col-md-3">
                <label for="milestone3"><b>Milestone:</b></label>
                <select id="milestone3" class="form-control form-control-sm">
                <option value="">Select Milestone</option>
                </select>
               </div>                           
                              
                <div class="form-group col-md-3" style="padding-top:2%;padding-left:1%;">
                 <button type="button" class="btn btn-sm btn-success" id="search3">Search</button>
                </div>                                                                
              </div>
              
    <!-- Dynamic Fields Container (Initially Hidden) -->
           
   <div id=container5 style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Cancel Packing Note Details</h5>
        
              <div class="form-row dynamic-row">
               <div class="form-group col-md-2 col-sm-12">
                <label for="invoice3"><b>Invoice No:</b></label>
                <input type="text" class="form-control form-control-sm" id="invoice3" placeholder="Invoice No">
                <div id="invoice3Error" class="text-danger" style="display: none;">Invoice No is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="UOM6"><b>UOM:</b></label>              
                <select id="UOM6" class="form-control form-control-sm">
                <option value="">Select</option>
                <option value="1"></option>
                <option value="2"></option>
                </select>              
                <div id="UOM6Error" class="text-danger" style="display: none;">UOM is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="quantity3"><b>Quantity:</b></label>
                <input type="text" class="form-control form-control-sm" id="quantity3" placeholder="Quantity">
                <div id="quantity3Error" class="text-danger" style="display: none;">Quantity is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="kgs3"><b>KGS:</b></label>
                <input type="text" class="form-control form-control-sm" id="kgs3" placeholder="KGS">
                <div id="kgs3Error" class="text-danger" style="display: none;">KGS is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="unit3"><b>Unit Price:</b></label>
                <input type="text" class="form-control form-control-sm" id="unit3" placeholder="Unit Price">
                <div id="unit3Error" class="text-danger" style="display: none;">Unit Price is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="total5"><b>Total:</b></label>
                <input type="text" class="form-control form-control-sm" id="total5" placeholder="Total">
                <div id="total5Error" class="text-danger" style="display: none;">Total is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="item3"><b>Item Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="item3" placeholder="Item Type">
                <div =id="item3Error" class="text-danger" style="display: none;">Item Type is required</div>
               </div>
          </div> 

   </div>
   
         <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
          <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Cancel Invoice face details</h5>
        
              <div class="form-row dynamic-row">
               <div class="form-group col-md-2 col-sm-12">
                <label for="UOM5"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="UOM5" placeholder="UOM">
                <div id="UOM5Error" class="text-danger" style="display: none;">UOM is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="qty3"><b>Qty Weight:</b></label>
                <input type="text" class="form-control form-control-sm" id="qty3" placeholder="Qty Weight">
                <div id="qty3Error" class="text-danger" style="display: none;">Qty Weight is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="price3"><b>Unit Price:</b></label>
                <input type="text" class="form-control form-control-sm" id="price3" placeholder="Unit Price">
                <div id="price3Error" class="text-danger" style="display: none;">Unit Price is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="total3"><b>Total:</b></label>
                <input type="text" class="form-control form-control-sm" id="total3" placeholder="Total">
                <div id="total3Error" class="text-danger" style="display: none;">Total is required</div>
               </div>
               
               <div class="form-group col-md-2 col-sm-12">
                <label for="type3"><b>Item Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="type3" placeholder="Item Type">
                <div id="type3Error" class="text-danger" style="display: none;">Item Type is required</div>
               </div>                           
              </div>
             </div>
               
              <div id="inputFieldsContainerre">
    <!-- Transporter and Vehicle Details -->  
       <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="vehicle3"><b>Vehicle No:</b></label>
            <input type="text" class="form-control form-control-sm" id="vehicle3">
            <div id="vehicle3Error" class="text-danger" style="display: none;">Vehicle No is required</div>
        </div>
        
        <div class="form-group col-md-3">
            <label for="transporter3"><b>Transporter Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="transporter3">
            <div id="transporter3Error" class="text-danger" style="display: none;">Transporter Name is required</div>
        </div>   
        
              <div class="table-responsive p-3">
               <!-- Buttons -->
               <div class="mt-4 text-right">
                <button type="reset" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>                
                <button type="submit" class="btn btn-sm btn-primary" id="btncancel">Cancel</button>                
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
						<b>Are you sure you want to update consolidated Packing Note?</b>
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
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>


  <!-- Bootstrap JS and dependencies -->


<script>
  document.getElementById("search3").addEventListener("click", function () {
    document.getElementById("container5").style.display = "block";
  });
</script>


<script>
  document.getElementById("search1").addEventListener("click", function () {
    document.getElementById("container3").style.display = "block";
  });
</script>


<script>
  document.getElementById("search").addEventListener("click", function () {
    document.getElementById("container1").style.display = "block";
  });
</script>

<script>
  document.getElementById("btnnext").addEventListener("click", function () {
    document.getElementById("container2").style.display = "block";
  });
</script>


<script>
  function addRow() {
    // Get the original row to clone
    const originalRow = document.querySelector('.dynamic-row');
    
    // Clone the node
    const newRow = originalRow.cloneNode(true);

    // Clear input/select values in the cloned row
    const inputs = newRow.querySelectorAll('input, select');
    inputs.forEach(input => {
      if (input.tagName === 'SELECT') {
        input.selectedIndex = 0;
      } else {
        input.value = '';
      }
    });

    // Hide all error messages in the new row
    const errors = newRow.querySelectorAll('.text-danger');
    errors.forEach(err => err.style.display = 'none');

    // Append new row after the last dynamic-row
    const lastRow = document.querySelectorAll('.dynamic-row');
    lastRow[lastRow.length - 1].after(newRow);
  }

  function deleteRow(button) {
    // Only delete if there's more than one row
    const allRows = document.querySelectorAll('.dynamic-row');
    if (allRows.length > 1) {
      button.closest('.dynamic-row').remove();
    } else {
      alert("At least one row is required.");
    }
  }
</script>



<!-- <script>
    String inactive = request.getParameter("inactive");
    if (inactive != null) {
        out.println("Checkbox is checked (Inactive = true)");
    } else {
        out.println("Checkbox is unchecked (Inactive = false)");
    }
</script> -->


 <script>
  const dropdown = document.querySelector('#invoiceDropdown');
  const dropdownBtn = dropdown.querySelector('.dropdown-btn');
  const menu = dropdown.querySelector('.checkbox-menu');

  // Toggle dropdown
  dropdownBtn.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });

  // Update button text with selected values
  const checkboxes = menu.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const selected = Array.from(checkboxes)
                            .filter(cb => cb.checked)
                            .map(cb => cb.value);
      dropdownBtn.textContent = selected.length > 0 ? selected.join(', ') : 'Select Invoice No';
    });
  });

  // Close dropdown if clicked outside
   document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      menu.style.display = 'none';
    }
  });  
</script> 

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
    <script src="js/config.js"></script>
    <script src="js/logout.js"></script>
    <script src="js/username.js"></script>
    <script src="js/customertype.js"></script>
    <script src="js/createdby.js"></script>
 	<script src="js/modifiedby.js"></script>
 	<script src="js/factoryid.js"></script>
 	 <script src="js/Sessionfilter.js"></script>
 	 <script src="js/Consolidatedpacking.js?v=<%=ts%>" ></script>
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