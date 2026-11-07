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
         <link rel="stylesheet"
      href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css">
  <link rel="stylesheet" href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
   <link rel="stylesheet" href="css/main.css">
   
   
   <link href="externalLibrary/cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEJjRkC9iY3NfJVzz6se99Nz05dfk03S8zNeS46E1H2nKfHlR9ltRf9TL7zG6" crossorigin="anonymous">

  <link href="externalLibrary/cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">


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
<!-- <body onload="fetchUserList();"> -->
  <div id="wrapper">
    <!-- Sidebar -->
      <%@ include file="InVoiceSideBar.jsp" %>
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
            <h1 class="h3 mb-0 text-gray-800">Debit Credit Packing Note</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="InvoiceDashBoard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="DebitCreditSideMenu.jsp">Debit Credit</a></li>
             <li class="breadcrumb-item active" aria-current="page">Debit Credit Packing Note</li>
              
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
        <div class="d-flex align-items-center">
        <label for="tablelabel" class="mr-2"><b>Select Type:</b></label>
        <select id="tableselect">
        <option value="1">Steel</option>
        <option value="2">Scrap</option>
        </select>
        </div>
      </div>
    </div>
    
    
    
   <div class="table-responsive p-3">
    <!--   <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
        <thead>
          <tr>
                <th>Invoice</th>
                <th>Contract Name</th>
                <th>Milestone Name</th>
                <th>Edit</th>                                          
          </tr>
        </thead>
        <tbody>
          Dynamic rows will be inserted here
        </tbody>
      </table> -->
      
      
      <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
    <thead>
        <tr>
            <th>Contract</th>
            <th>Load</th>
            <th>Note Type</th>
            <th>Freight</th>
            <th>Status</th>
            <th>Edit</th>
            <th>View</th>
        </tr>
    </thead>
    <tbody>
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
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Debit Credit Packing Note</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="invoice"><b>Invoice Type:</b></label>               
                <select id="invoice" class="form-control form-control-sm">
                <option value="">Select Invoice Type</option>              
                </select>
               </div>
               
               <div class="col-md-3">
                <label for="contractor"><b>Contract:</b></label>
                <select id="cont" class="form-control form-control-sm">
                <option value="">Select Contract</option>    
                <option value="Scrap">Scrap</option>   
                </select>
               </div>
               
                <div class="form-group col-md-3" >
                 <label for="milestone"><b>Milestone:</b></label>
                 <select id="mile" class="form-control form-control-sm">
                 <option value="">Select Milestone</option>   
                   <option value="Scrap">Scrap</option>                                                
                 </select>
                </div>
                
                <div class="form-group col-md-3" >
                 <label for="note"><b>Note Type:</b></label>
                 <select id="note" class="form-control form-control-sm">
                 <option value="">Select Note Type</option>       
                 <option value="1">DBT</option>
                 <option value="2">CRD</option>                                            
                 </select>
                </div>
                
            <!--     <div class="form-group col-md-3" style="padding-top:2%;padding-left:1%;">
                 <button type="button" class="btn btn-sm btn-success" id="search">Next</button>
               </div>      -->                                                           
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
    <div class="col-md-2">Unit Price</div>
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
    <div class="col-md-2"></div>
    <div class="col-md-1"></div>
    <div class="col-md-2"></div>
    <div class="col-md-1"></div>
        <!-- EXACTLY under Total -->
    <div class="col-md-1">
        <label>Grand Total</label>
        <input type="text" id="totalNo" class="form-control form-control-sm text-right" readonly>
    </div>

    <div class="col-md-1"></div>
<!--     <div class="col-md-3 ms-3" style="margin-left: 68%;">
        <label for="totalNo">Grand Total</label>
        <input type="text" id="totalNo" class="form-control form-control-sm" readonly>
    </div> -->
</div>
</div>
<!-- Transporter and Vehicle Details -->
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Freight:</b></label>
            <input type="number" class="form-control form-control-sm" id="freig" value="0" placeholder="Freight" autocomplete="off" min="0" readonly>
            <div id="Freighterror" class="error-message"></div>
        </div>
     <!--    <div class="form-group col-md-3">
            <label for="tax"><b>Tax Exempted:</b></label>
            <select id="tax" class="form-control form-control-sm">
            <option value="">Select</option>
            <option value="1"></option>
            <option value="2"></option>
            </select>
            <div id="taxError" class="text-danger" style="display: none;">Tax Exempted is required</div>
        </div> -->
        <div class="form-group col-md-3">
            <label for="enclose"><b>Enclose Attachment:</b></label>
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
        </div>
       </div>
      </div>
      <div class="modal fade" id="exampleModalCenter66" tabindex="-1" data-bs-focus="false"
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
						<b>Are you sure you want to create Packing Note?</b>
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
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b> Update Debit Credit Packing Note</b></h5>
                <button type="button" class="close" id="closeModalBtn" aria-label="Close">
                 <span aria-hidden="true">&times;</span>
                </button>
             </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="invoice1"><b>Invoice Type:</b></label>               
                <input type="text" class="form-control form-control-sm" id="invoice1" readonly>
               </div>
               
               <div class="col-md-3">
                <label for="contractor1"><b>Contract:</b></label>
                 <input type="text" class="form-control form-control-sm" id="contedit" readonly>
               </div>
               
                <div class="form-group col-md-3" >
                 <label for="mileston1e"><b>Milestone:</b></label>
                 <input type="text" class="form-control form-control-sm" id="mileedit" readonly>
                </div>
                
                <div class="form-group col-md-3" >
                 <label for="note1"><b>Note Type:</b></label>
                  <input type="text" class="form-control form-control-sm" id="note1" readonly>
                </div>
                
                <!-- <div class="form-group col-md-3" style="padding-top:2%;padding-left:1%;">
                 <button type="button" class="btn btn-sm btn-success" id="search1">Next</button>
               </div>    -->                                                             
              </div>
              
              
    <!-- Dynamic Fields Container (Initially Hidden) -->
   <!-- Dynamic Fields Container (Initially Hidden) -->
<div>
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
    <div  id="dynamicRowsContaineredit"></div>
    
    <!-- Add Row Button -->
     <div class="mt-2">
    <button type="button" class="btn btn-sm btn-success" onclick="addRowEdit();">Add Row</button>
    </div>
         <div class="form-row mt-3 font-weight-bold">
    <div class="col-md-2"></div>
    <div class="col-md-2"></div>
    <div class="col-md-2"></div>
    <div class="col-md-1"></div>
    <div class="col-md-1"></div>
    <div class="col-md-1"></div>
    
        <div class="col-md-1">
        <label for="totalNo">Grand Total</label>
        <input type="text" id="totalNoedit" class="form-control form-control-sm text-right" readonly>
    </div>
    
      <div class="col-md-1"></div>
 <!--    <div class="col-md-3 ms-3" style="margin-left: 68%;">
        <label for="totalNo">Grand Total</label>
        <input type="text" id="totalNoedit" class="form-control form-control-sm" readonly>
    </div> -->
    </div>
</div>
<!-- Transporter and Vehicle Details -->
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Freight:</b></label>
            <input type="number" class="form-control form-control-sm" id="freigedit" placeholder="Freight"autocomplete="off" min="0" readonly>
            <div id="Freighterroredit" class="error-message"></div>
        </div>
        
        <div class="form-group col-md-3">
    <label for="bal"><b>Enclose Attachment:</b></label>
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
       
     <div class="form-group col-md-3" style="display:none;">
            <label for="bal"><b>dcPn_no:</b></label>
            <input type="text" class="form-control form-control-sm" id="dcPn_noedit">
            </div>
        </div>
    </div>
    
         
        <!-- Submit and Cancel Buttons -->
                     <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" onclick="closeModal()">Close</button>
                        <button type="button" class="btn btn-sm btn-primary" id="updatedbtcrdpacking" onclick="openModalUpdate();">Update</button>
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
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b> view Debit Credit Packing Note</b></h5>
                <button type="button" class="close" id="closeModalBtnviw" aria-label="Close">
                 <span aria-hidden="true">&times;</span>
                </button>
             </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="invoice1"><b>Invoice Type:</b></label>               
                <input type="text" class="form-control form-control-sm" id="invoiceview" readonly>
               </div>
               
               <div class="col-md-3">
                <label for="contractor1"><b>Contract:</b></label>
                 <input type="text" class="form-control form-control-sm" id="contview" readonly>
               </div>
               
                <div class="form-group col-md-3" >
                 <label for="mileston1e"><b>Milestone:</b></label>
                 <input type="text" class="form-control form-control-sm" id="mileview" readonly>
                </div>
                
                <div class="form-group col-md-3" >
                 <label for="note1"><b>Note Type:</b></label>
                  <input type="text" class="form-control form-control-sm" id="noteview" readonly>
                </div>
                
                <!-- <div class="form-group col-md-3" style="padding-top:2%;padding-left:1%;">
                 <button type="button" class="btn btn-sm btn-success" id="search1">Next</button>
               </div>    -->                                                             
              </div>
              
              
    <!-- Dynamic Fields Container (Initially Hidden) -->
   <!-- Dynamic Fields Container (Initially Hidden) -->
 <div>
   <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
    <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
    <div class="form-row font-weight-bold mb-2">
    <div class="col-md-2">Uom</div>
    <div class="col-md-2">Type</div>
    <div class="col-md-2">Quantity</div>
    <div class="col-md-2">Kgs/MT/Sqm</div>
    <div class="col-md-1">Unit Price</div>
    <div class="col-md-1">Total</div>
    </div>
    <!-- Form Rows Container -->
    <div  id="dynamicRowsContainerview"></div>
       <div class="form-row mt-3 font-weight-bold">
    <div class="col-md-2"></div>
    <div class="col-md-2"></div>
    <div class="col-md-2"></div>
    <div class="col-md-1"></div>
    <div class="col-md-1"></div>
    <div class="col-md-1"></div>
    <!-- Add Row Button -->
        <div class="col-md-1">
        <label for="totalNo">Grand Total</label>
        <input type="text" id="totalNoview" class="form-control form-control-sm text-right" readonly>
    </div>
    
      <div class="col-md-1"></div>
   </div>
  <!--   <div class="col-md-3 ms-3" style="margin-left: 68%;">
        <label for="totalNo">Grand Total</label>
        <input type="text" id="totalNoview" class="form-control form-control-sm" readonly>
    </div> -->
</div>
<!-- Transporter and Vehicle Details -->
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Freight:</b></label>
            <input type="number" class="form-control form-control-sm" id="freigview" placeholder="Freight"autocomplete="off" min="0" readonly>
            <div id="Freighterroredit" class="error-message"></div>
        </div>
        
        <div class="form-group col-md-3">
    <label for="bal"><b>Enclose Attachment:</b></label>
    <div class="input-group">
        <!-- Eye icon button --><div id="fileNameDisplayview" style="margin-top: 15px; font-size: 14px; color: gray; border: 1px solid #ccc; padding: 5px; border-radius: 5px; background-color: #f9f9f9; max-width: 100%;"></div>
        <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" id="eyeIconBtn">
                <i class="fas fa-eye" id="eyeIconview"></i>
            </button>
        </div>
         
    </div>
     
    <!-- Display File Name -->
    
</div>


        <div class="form-group col-md-3" style="display:none;">
            <label for="bal"><b>Pnid:</b></label>
            <input type="text" class="form-control form-control-sm" id="pnidview">
            </div>
       
     <div class="form-group col-md-3" style="display:none;">
            <label for="bal"><b>dcPn_no:</b></label>
            <input type="text" class="form-control form-control-sm" id="dcPn_noview">
            </div>
        </div>
    </div>
    <div class="form-row mt-3" style="justify-content: flex-end;">
        <button type="button" class="btn btn-sm btn-secondary mr-2" onclick="closeModalview()">Close</button>
     </div>
    </form>      
            </div>               
           </div>
          </div>
         </div>
         
           <div class="modal fade" id="exampleModalScrollable123viewscrap" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
       <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1500px;" role="document">
        <div class="modal-content">
             <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b> view Debit Credit Packing Note</b></h5>
                <button type="button" class="close" id="closeModalBtnviwscp" aria-label="Close">
                 <span aria-hidden="true">&times;</span>
                </button>
             </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
              <div class="form-row">
               <div class="form-group col-md-3">
                <label for="invoice1"><b>Invoice Type:</b></label>               
                <input type="text" class="form-control form-control-sm" id="invoiceviewscrap" readonly>
               </div>
               
               <div class="col-md-3">
                <label for="contractor1"><b>Contract:</b></label>
                 <input type="text" class="form-control form-control-sm" id="contviewscrap" readonly>
               </div>
               
                <div class="form-group col-md-3" >
                 <label for="mileston1e"><b>Milestone:</b></label>
                 <input type="text" class="form-control form-control-sm" id="mileviewscrap" readonly>
                </div>
                
                <div class="form-group col-md-3" >
                 <label for="note1"><b>Note Type:</b></label>
                  <input type="text" class="form-control form-control-sm" id="noteviewscrap" readonly>
                </div>
                
                <!-- <div class="form-group col-md-3" style="padding-top:2%;padding-left:1%;">
                 <button type="button" class="btn btn-sm btn-success" id="search1">Next</button>
               </div>    -->                                                             
              </div>
              
              
    <!-- Dynamic Fields Container (Initially Hidden) -->
   <!-- Dynamic Fields Container (Initially Hidden) -->
 <div>
   <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
    <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
    
    <!-- Form Rows Container -->
    <div  id="dynamicRowsContainerviewscrap">
        <!-- Initial Row (Visible by default) -->
    </div>
    
    <!-- Add Row Button -->
    <div class="col-md-3 ms-3" style="margin-left: 68%;">
        <label for="totalNo">Grand Total</label>
        <input type="text" id="totalNoviewscrap" class="form-control form-control-sm" readonly>
    </div>
</div>
<!-- Transporter and Vehicle Details -->
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Freight:</b></label>
            <input type="number" class="form-control form-control-sm" id="freigviewscrap" placeholder="Freight"autocomplete="off" min="0" readonly>
            <div id="Freighterroredit" class="error-message"></div>
        </div>
        
        <div class="form-group col-md-3">
    <label for="bal"><b>Enclose Attachment:</b></label>
    <div class="input-group">
        <!-- Eye icon button --><div id="fileNameDisplayviewscrap" style="margin-top: 15px; font-size: 14px; color: gray; border: 1px solid #ccc; padding: 5px; border-radius: 5px; background-color: #f9f9f9; max-width: 100%;"></div>
        <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" id="eyeIconBtnviewscrap">
                <i class="fas fa-eye" id="eyeIconviewscrap"></i>
            </button>
        </div>
         
    </div>
     
    <!-- Display File Name -->
    
</div>


        <div class="form-group col-md-3" style="display:none;">
            <label for="bal"><b>Pnid:</b></label>
            <input type="text" class="form-control form-control-sm" id="pnidviewscrap">
            </div>
       
     <div class="form-group col-md-3" style="display:none;">
            <label for="bal"><b>dcPn_no:</b></label>
            <input type="text" class="form-control form-control-sm" id="dcPn_noviewscrap">
            </div>
        </div>
    </div>
    <div class="form-row mt-3" style="justify-content: flex-end;">
        <button type="button" class="btn btn-sm btn-secondary mr-2" onclick="closeModalviewscp()">Close</button>
     </div>
</form>         
            </div>               
           </div>
          </div>
         </div>
         
        </div>
       </div>
       
       <div class="modal fade" id="exampleModalCenter66update" tabindex="-1" data-bs-focus="false"
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
						<b>Are you sure you want to update  Packing Note?</b>
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
<!--    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script> -->

  <!-- Bootstrap JS and dependencies -->
<script>
function closeModal() {
    $('#exampleModalScrollable123update').modal('hide');
}
</script>

<script>
function closeModalview() {
    $('#exampleModalScrollable123view').modal('hide');
}
</script>

<script>
function closeModalviewscp() {
    $('#exampleModalScrollable123viewscrap').modal('hide');
}
</script>

<script>
  $(document).ready(function () {
    $('#closeModalBtn').on('click', function () {
      $('#exampleModalScrollable123update').modal('hide');
    });
  });
</script>

<script>
  $(document).ready(function () {
    $('#closeModalBtnviw').on('click', function () {
      $('#exampleModalScrollable123view').modal('hide');
    });
  });
</script>

<script>
  $(document).ready(function () {
    $('#closeModalBtnviwscp').on('click', function () {
      $('#exampleModalScrollable123viewscrap').modal('hide');
    });
  });
</script>

<script>
  document.getElementById("search1").addEventListener("click", function () {
    document.getElementById("container2").style.display = "block";
  });
</script>


<script>
  document.getElementById("search2").addEventListener("click", function () {
    document.getElementById("container3").style.display = "block";
  });
</script>


<script>
  document.getElementById("search").addEventListener("click", function () {
    document.getElementById("inputFieldsContainer").style.display = "block";
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


 
    <script src="vendor/jquery/jquery.min.js"></script>
        <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    
        <script src="vendor/datatables/jquery.dataTables.min.js"></script>
        <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
  
  
  
  
     <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
      <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
      <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>   
    
      <script src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    
      <script src="js/DebitCreditPacking.js?v=<%=ver(application, "/js/DebitCreditPacking.js")%>"></script>
      <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
      <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
      <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
      <script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
 	  <script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
 	  <script src="js/factoryid.js?v=<%=ver(application, "/js/factoryid.js")%>"></script>
 	   <script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
 	<script>

  window.actionElementMap = {
  };
</script>
  <script src="js/permissions.js?v=<%=ver(application, "/js/permissions.js")%>"></script>


</body>
</html>