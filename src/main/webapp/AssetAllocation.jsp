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
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="css/main.css">
     <link href="vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">
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
  
/*   .text-danger {
    display: none;  /* Hide by default */
    color: red;
    font-size: 12px;
} */
</style>
  <script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
      window.location.href = "newlogin.jsp";
    }
  </script>
</head>

<body>
  <div id="wrapper">
    <%@ include file="AmsSidebar.jsp" %>
    <!-- Sidebar -->

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
            <h1 class="h3 mb-0 text-gray-800">Asset Allocation</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="VMSDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item active" aria-current="page"> Ams Master</li>
             
            </ol>
          </div>
          
          
          
          
          <!-- Table Content  -->
          
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
  <table class="table table-striped table-bordered table-sm" id="table_ID1" width="100%">
    <thead class="text-center">
      <tr>
        <th>Sl. No.</th>
        <th>Asset No</th>
        <th>Asset Sr No</th>
        <th>Contract No</th>
        <th>Purchase Date</th>
        <th>Allocated To</th>
        <th>Update_Asset_Allocation</th>
        <th>Asset_Return</th>
      </tr>
    </thead>
    <tbody class="text-center" id="asserallocation">
      <!-- Dynamic rows will be appended here -->
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
        <h5 class="modal-title" id="exampleModalScrollableTitle">Asset Allocation</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->  
<div class="modal-body">
  <!-- Asset No Dropdown on Top -->
  <div class="row mb-3 justify-content-start">
    <div class="col-md-3">
      <label for="Asset_No" class="form-label"><b>Asset No:</b></label>
      <select class="form-control form-control-sm" id="Asset_No">
        <option value="">Select</option>          
      </select>
      <div id="AssetNoError" class="error-message" style="display: none;">Asset No is required</div>
    </div>
  </div>

  <!-- Outer Bordered Form -->
  <div class="container" style="border: 2px solid #ccc; border-radius: 10px; padding: 20px; background-color: #fff; width: 100%; max-width: 1600px;">
    
    <!-- Title -->
    <h5 class="text-center mb-4" style="font-weight: bold; color: #000;">Asset Allocation Details</h5>
    
    <div class="row mb-3">
      <!-- Left Column -->
      <div class="col-md-6">
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Asset Type:</b></label>
          <div class="col-sm-8">
            <select class="form-control form-control-sm" id="Asset_Type" readonly>
              <option>Asset Type</option>
            </select>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Asset Sr No:</b></label>
          <div class="col-sm-8">
            <input type="text" class="form-control form-control-sm" id="Asset_SrNo" placeholder="Asset Serial No" readonly>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Purchase Date:</b></label>
          <div class="col-sm-8">
            <input type="date" class="form-control form-control-sm" id="Purchase_Date" readonly>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Allocated To:</b></label>
          <div class="col-sm-8">
            <select class="form-control form-control-sm" id="Allocated_To">
              
            </select>
                           <div id="allocatedToError" class="text-danger small" style="display:none;">
    allocated To  is required
</div>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Allocated Date:</b></label>
          <div class="col-sm-8">
            <input type="date" class="form-control form-control-sm" id="Allocated_Date" placeholder="mm/dd/yyyy">
                           <div id="allocatedDateError" class="text-danger small" style="display:none;">
  Allocate Date is Required
</div>
          </div>
        </div>
    
        
        
                <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Allocated Qty:</b></label>
          <div class="col-sm-8">
            <input type="number" class="form-control form-control-sm" id="Allocated_Qty" value="1" readonly>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="col-md-6">
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Asset Model:</b></label>
          <div class="col-sm-8">
            <select class="form-control form-control-sm" id="Asset_Model" readonly>
              <option>select</option>
            </select>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Asset Make:</b></label>
          <div class="col-sm-8">
            <select class="form-control form-control-sm" id="Asset_Make" readonly>
              <option>select</option>
            </select>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Contract No:</b></label>
          <div class="col-sm-8">
            <select class="form-control form-control-sm" id="Contract_No" readonly>
              <option>select</option>
            </select>
            
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Department:</b></label>
          <div class="col-sm-8">
            <input type="text" class="form-control form-control-sm" id="Department" placeholder="Enter department" readonly>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Expected Return Date:</b></label>
          <div class="col-sm-8">
            <input type="date" class="form-control form-control-sm" id="Expected_Return_Date">
                           <div id="excepteddateUpError" class="text-danger small" style="display:none;">
   Excepted Retrun Date is Required
</div>
          </div>
        </div>
           <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Remarks:</b></label>
          <div class="col-sm-8">
            <textarea class="form-control form-control-sm" id="Remarks" placeholder="Enter Remarks"></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit / Cancel Buttons -->
    <div class="text-right mt-3">
    
      <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary btn-sm" id="saveAssetBtn">Submit</button>
    </div>
  </div>
</div>


              
        </div>
  </div>
 </div>
 
 
  <div class="modal fade" id="exampleModalScrollableup123" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true" onload="generateSaleOrderNumber();">
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1300px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle"> Update Asset Allocation</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->  
<div class="modal-body">
  <!-- Asset No Dropdown on Top -->
  <div class="row mb-3 justify-content-start">
    <div class="col-md-3">
      
      <div id="AssetNoError" class="error-message" style="display: none;">Asset No is required</div>
    </div>
  </div>

  <!-- Outer Bordered Form -->
  <div class="container" style="border: 2px solid #ccc; border-radius: 10px; padding: 20px; background-color: #fff; width: 100%; max-width: 1600px;">
    
    <!-- Title -->
    <h5 class="text-center mb-4" style="font-weight: bold; color: #000;">Asset Allocation Details</h5>
    
    <div class="row mb-3">
      <!-- Left Column -->
      <div class="col-md-6">
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Asset Type:</b></label>
          <div class="col-sm-8">
            <select class="form-control form-control-sm" id="Asset_Type_up" readonly>
              <option>Asset Type</option>
            </select>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Asset Sr No:</b></label>
          <div class="col-sm-8">
            <input type="text" class="form-control form-control-sm" id="Asset_SrNo_up" placeholder="Asset Serial No" readonly>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Purchase Date:</b></label>
          <div class="col-sm-8">
            <input type="date" class="form-control form-control-sm" id="Purchase_Date_up" readonly>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Allocated To:</b></label>
          <div class="col-sm-8">
            <select class="form-control form-control-sm" id="Allocated_To_up">
              <option>select</option>
            </select>
      <div id="allocatedToError_up" class="text-danger small" style="display:none;">Allocated To is required</div>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Allocated Date:</b></label>
          <div class="col-sm-8">
            <input type="date" class="form-control form-control-sm" id="Allocated_Date_up">
     <div id="allocatedDateError_up" class="text-danger small" style="display:none;">Allocated Date is required</div>
          </div>
        </div>
    
        
        
                <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Allocated Qty:</b></label>
          <div class="col-sm-8">
            <input type="number" class="form-control form-control-sm" id="Allocated_Qty_up" value="1" readonly>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="col-md-6">
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Asset Model:</b></label>
          <div class="col-sm-8">
            <select class="form-control form-control-sm" id="Asset_Model_up" readonly>
              <option>select</option>
            </select>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Asset Make:</b></label>
          <div class="col-sm-8">
            <select class="form-control form-control-sm" id="Asset_Make_up" readonly>
              <option>select</option>
            </select>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Contract No:</b></label>
          <div class="col-sm-8">
            <select class="form-control form-control-sm" id="Contract_No_up" readonly>
              <option>select</option>
            </select>
            
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Department:</b></label>
          <div class="col-sm-8">
            <input type="text" class="form-control form-control-sm" id="Department_up" placeholder="Enter department" readonly>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Expected Return Date:</b></label>
          <div class="col-sm-8">
            <input type="date" class="form-control form-control-sm" id="Expected_Return_Date_up">
     <div id="excepteddateUpError_up" class="text-danger small" style="display:none;">Expected Return Date is required</div>
          </div>
        </div>
           <div class="mb-3 row">
          <label class="col-sm-4 col-form-label col-form-label-sm"><b>Remarks:</b></label>
          <div class="col-sm-8">
            <textarea class="form-control form-control-sm" id="Remarks_up" placeholder="Enter Remarks"></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit / Cancel Buttons -->
    <div class="text-right mt-3">
    
      <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary btn-sm" id="saveAssetBtn_up">Submit</button>
    </div>
  </div>
</div>


              
        </div>
  </div>
 </div>
 
 
 
 
 
 
 <!-- Asset Allocation Return Modal -->
 
 
<div class="modal fade" id="AssetAllocationReturnModal" tabindex="-1" role="dialog" aria-labelledby="AssetAllocationReturnLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1300px;" role="document">
    <div class="modal-content">

      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="AssetAllocationReturnLabel">Asset Allocation Return</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">

        <!-- Asset No Dropdown on Top -->
        <div class="row mb-3 justify-content-start">
          <div class="col-md-3">
            <label for="Asset_No_Return" class="form-label"><b>Asset No:</b></label>
            <select class="form-control form-control-sm" id="Asset_No_Return" disabled>
              <option value="">Select</option>
            </select>
                 <div id="Asset_No_Error" class="text-danger small" style="display:none;">Asset_no is Required</div>
          </div>
          </div>
        </div>

        <!-- Outer Box -->
        <div class="container" style="border: 2px solid #ccc; border-radius: 10px; padding: 20px; background-color: #fff; width: 100%; max-width: 1600px;">

          <!-- Title -->
          <h5 class="text-center mb-4" style="font-weight: bold; color: #000;">Asset Allocation Return Details</h5>

          <div class="row mb-3">

            <!-- Left Column -->
            <div class="col-md-6">

              <div class="mb-3 row">
                <label class="col-sm-4 col-form-label col-form-label-sm"><b>Asset Type:</b></label>
                <div class="col-sm-8">
                  <select class="form-control form-control-sm" id="Asset_Type_Return" disabled>
                    <option>Asset Type</option>
                  </select>
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-4 col-form-label col-form-label-sm"><b>Asset Sr No:</b></label>
                <div class="col-sm-8">
                  <input type="text" class="form-control form-control-sm" id="Asset_SrNo_Return" readonly>
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-4 col-form-label col-form-label-sm"><b>Purchase Date:</b></label>
                <div class="col-sm-8">
                  <input type="date" class="form-control form-control-sm" id="Purchase_Date_Return" readonly>
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-4 col-form-label col-form-label-sm"><b>Allocated To:</b></label>
                <div class="col-sm-8">
                  <select class="form-control form-control-sm" id="Allocated_To_Return" disabled>
                    <option>Select</option>
                  </select>
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-4 col-form-label col-form-label-sm"><b>Allocated Date:</b></label>
                <div class="col-sm-8">
                  <input type="date" class="form-control form-control-sm" id="Allocated_Date_Return" readonly>
                </div>
              </div>

              <!-- â Return Date (Only Editable Field) -->
         <div class="mb-3 row">
    <label class="col-sm-4 col-form-label col-form-label-sm"><b>Return Date:</b></label>
    <div class="col-sm-8">
        <input type="date" class="form-control form-control-sm" id="Return_Date">
        <div id="Return_date_Error" class="text-danger small" style="display:none;">
            Return Date is required
        </div>
    </div>
</div>

              <div class="mb-3 row">
                <label class="col-sm-4 col-form-label col-form-label-sm"><b>Remarks:</b></label>
                <div class="col-sm-8">
                  <textarea class="form-control form-control-sm" id="Remarks_Return" placeholder="Return Remarks" ></textarea>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="col-md-6">

              <div class="mb-3 row">
                <label class="col-sm-4 col-form-label col-form-label-sm"><b>Asset Model:</b></label>
                <div class="col-sm-8">
                  <select class="form-control form-control-sm" id="Asset_Model_Return" disabled>
                    <option>Select</option>
                  </select>
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-4 col-form-label col-form-label-sm"><b>Asset Make:</b></label>
                <div class="col-sm-8">
                  <select class="form-control form-control-sm" id="Asset_Make_Return" disabled>
                    <option>Select</option>
                  </select>
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-4 col-form-label col-form-label-sm"><b>Contract No:</b></label>
                <div class="col-sm-8">
                  <select class="form-control form-control-sm" id="Contract_No_Return" disabled>
                    <option>Select</option>
                  </select>
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-4 col-form-label col-form-label-sm"><b>Department:</b></label>
                <div class="col-sm-8">
                  <input type="text" class="form-control form-control-sm" id="Department_Return" readonly>
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-4 col-form-label col-form-label-sm"><b>Expected Return Date:</b></label>
                <div class="col-sm-8">
                  <input type="date" class="form-control form-control-sm" id="Expected_Return_Date_Return" readonly>
                  
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-4 col-form-label col-form-label-sm"><b>Allocated Qty:</b></label>
                <div class="col-sm-8">
                  <input type="number" class="form-control form-control-sm" id="Allocated_Qty_Return" value="1" readonly>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="text-right mt-3">
            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary btn-sm" id="btnReturnSubmit">Submit</button>
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmassetallocationyyes">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          
          <div class="modal fade" id="exampleModalCenterup205" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmassetallocationupyes">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          
          
          
               <div class="modal fade" id="exampleModalCenterreturn205" tabindex="-1" role="dialog"
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
                  <b>Are you sure you want to Enter the Return Date ?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmassetallocationreturnyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
     
              
         <div class="modal fade" id="exampleModalCenterDupUPcon" tabindex="-1" role="dialog"
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
                  <b id="errorMessageupcon"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" id="modal_okk">OK</button> 
                </div>
              </div>
            </div>
          </div> 


 	    <script src="externalLibrary/cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>           
         

  <script src="vendor/jquery/jquery.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
     
     
      <script src="vendor/datatables/jquery.dataTables.min.js"></script>
      <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
   
     	  <script src="js/config.js?v=<%=jsVersion%>"></script>
   
  <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
   


   


    
      <script src="js/AssetAllocation.js?v=<%=jsVersion%>"></script>
    
   <script src="js/logout.js?v=<%=jsVersion%>"></script>
  <script src="js/username.js?v=<%=jsVersion%>"></script>
 
   <script src="js/createdby.js?v=<%=jsVersion%>"></script>
 	   <script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
 	    <script src="js/Sessionfilter.js?v=<%=jsVersion%>"></script>
 	    <script src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
 	   	   <script>

  window.actionElementMap = {
  };
</script>
<script src="js/permissions.js?v=<%=jsVersion%>"></script>

<!-- Scroll to top -->
<script>
    // JavaScript to toggle the visibility of the input fields container
    document.getElementById("getButton").addEventListener("click", function() {
        document.getElementById("inputFieldsContainer").style.display = "block";
    });
</script>


<script >
function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0];
}

$(document).ready(function () {

	  let today = new Date().toISOString().split('T')[0];
	  let minDate = addDays(today, -2);  // 3 days back
	    let maxDate = addDays(today, +2);
	  let todays = addDays(today,0);
	  $("#Allocated_Date").attr("min",minDate).attr("max",maxDate);
	  $("#Allocated_Date").val(todays);
	  
	  $("#Allocated_Date_up").attr("min",minDate).attr("max",maxDate);
	
	  
	  
	  $("#Return_Date").attr("min",minDate).attr("max",maxDate);
	  $("#Return_Date").val(todays);
	
	  
	  
	

});

document.getElementById("Allocated_Date").addEventListener("change", function () {
    document.getElementById("Expected_Return_Date").min = this.value;
});


document.getElementById("Allocated_Date_up").addEventListener("change", function () {
    document.getElementById("Expected_Return_Date_up").min = this.value;
});

</script>





</body>
</html>