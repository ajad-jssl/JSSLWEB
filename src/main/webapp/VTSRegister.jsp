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
       <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
       <script src="js/sidebar.js"></script>
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
  .mt-5, .my-5 {
    margin-top: -5rem !important;
}

</style>
</head>
<script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>

<body onload="fetchUserList();">
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
    <!-- Sidebar -->
    
        <!-- Topbar -->
        <!-- Container Fluid-->
        <div class="container-fluid" id="container-wrapper">
          <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800"></h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="VehicleDashboard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="VTSMaster.jsp">Vehicle Master</a></li>
            </ol>
          </div>
        
<div class="container mt-5">
    <h3 class="text-center mb-4">Select Vehicle Master</h3>

    <!-- Radio Buttons -->
    <div class="d-flex justify-content-center mb-4">
        <div class="form-check me-3">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="registerRadio" value="register" checked onchange="toggleTables()">
            <label class="form-check-label" for="registerRadio">Register Type</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="vehicleRadio" value="vehicle" onchange="toggleTables()">
            <label class="form-check-label" for="vehicleRadio">Vehicle Type</label>
        </div>&nbsp;&nbsp;
         <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="stateRadio" value="state" onchange="toggleTables()">
            <label class="form-check-label" for="stateRadio">State</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="cityRadio" value="location" onchange="toggleTables()">
            <label class="form-check-label" for="cityRadio">City</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="companyRadio" value="company" onchange="toggleTables()">
            <label class="form-check-label" for="companyRadio">Company</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="selectRadio" value="select" onchange="toggleTables()">
            <label class="form-check-label" for="selectRadio">Select Type</label>
        </div>
        
    </div>
</div>

<!-- Register Table -->
<div class="row mb-3" id="registerTable">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="vtsreg"><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Register Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Dynamic rows will be inserted here -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Vehicle Table -->
<div class="row mb-3" id="vehicleTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="vtsveh"><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="tableID1" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Vehicle Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Dynamic rows will be inserted here -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- State Table -->
<div class="row mb-3" id="stateTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="vtssta"><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="statetableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>State</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Dynamic rows will be inserted here -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- City Table -->
<div class="row mb-3" id="locationTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="vtscity"><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="locationTableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Dynamic rows will be inserted here -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Company Table -->
<div class="row mb-3" id="companyTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="vtscom"><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="companyTableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Company</th>
                        <th>Address</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Dynamic rows will be inserted here -->
                </tbody>
            </table>
        </div>
    </div>
</div>


<!-- Select Table -->
<div class="row mb-3" id="selectTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="vtssel"><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="selecttypeTable" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Select Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Dynamic rows will be inserted here -->
                </tbody>
            </table>
        </div>
    </div>
</div>



<!-- Create Invoice Address -->
<div class="modal fade" id="exampleModalScrollableIN" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Register Type</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
          
            <div class="col-md-6">
             <label for="registertype" class="form-label"><b>Register Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="registertype" placeholder="Register Type">
             <div id="registertypeError" class="error-message" style="display: none;">Register Type is required</div>
           
            
           <!--  <div class="col-md-6">
             <label for="vehicletype" class="form-label"><b>Vehicle Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="vehicletype" placeholder="Vehicle Type">
             <div id="vehicletypeError" class="text-danger" style="display: none;">Vehicle Type is required</div>
            </div> -->
          </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="submitregtype">Create</button>
</div>

              </div>
            </div>
          </div>
          
           <div class="modal fade" id="exampleModalCenter80" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmregYes">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- jQuery -->
      <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
<!-- Update Invoice Address -->
<div class="modal fade" id="exampleModalScrollableINUp" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Register Type</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
          
            <div class="col-md-6">
             <label for="registertype1" class="form-label"><b>Register Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="registertype1" placeholder="Register Type">
             <div id="registertype1Error" class="error-message" style="display: none;">Register Type is required</div>
           
            
            <!-- <div class="col-md-6">
             <label for="vehicletype" class="form-label"><b>Vehicle Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="vehicletype" placeholder="Vehicle Type">
             <div id="vehicletypeError" class="text-danger" style="display: none;">Vehicle Type is required</div>
            </div> -->
          </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="regtypeupd">Update</button>
</div>

 <div class="modal fade" id="exampleModalCenter75" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelregmodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmregtypeupd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

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
          
          <!-- <div class="modal fade" id="exampleModalCenterDupUP" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 70%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                   <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> 
                   <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button> 
                 </div>
                <div class="modal-body">
                  <b id="errorMessageup"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">OK</button> 
                </div>
              </div>
            </div>
          </div>        -->
        <!--  Create Consignee Address -->  
<div class="modal fade" id="exampleModalScrollableCon" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Vehicle Type</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
          
            <!-- <div class="col-md-6">
             <label for="registertype" class="form-label"><b>Register Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="registertype" placeholder="Register Type">
             <div id="registertypeError" class="text-danger" style="display: none;">Register Type is required</div>
            </div> -->
            
            <div class="col-md-6">
             <label for="vehicletype" class="form-label"><b>Vehicle Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="vehicletype" placeholder="Vehicle Type">
             <div id="vehicletypeError" class="error-message" style="display: none;">Vehicle Type is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="submitvehtype">Create</button>
</div>

              </div>
            </div>
          </div>
          
            <div class="modal fade" id="exampleModalCenter85" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmvehtypeYes">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          <!--  Update Consignee Address -->  
<div class="modal fade" id="exampleModalScrollableConUp" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Vehicle Type</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">
         
            <!-- <div class="col-md-6">
             <label for="registertype" class="form-label"><b>Register Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="registertype" placeholder="Register Type">
             <div id="registertypeError" class="text-danger" style="display: none;">Register Type is required</div>
            </div> -->
            
            <div class="col-md-6">
             <label for="vehicletype1" class="form-label"><b>Vehicle Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="vehicletype1" placeholder="Vehicle Type">
             <div id="vehicletype1Error" class="error-message" style="display: none;">Vehicle Type is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="vehtypeupd">Update</button>
</div>

              </div>
            </div>
          </div>
          
           <div class="modal fade" id="exampleModalCenter86" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelvehmodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmvehtypeupd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          
 <div class="modal fade" id="exampleModalScrollableState" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create State</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
          
            <!-- <div class="col-md-6">
             <label for="registertype" class="form-label"><b>Register Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="registertype" placeholder="Register Type">
             <div id="registertypeError" class="text-danger" style="display: none;">Register Type is required</div>
            </div> -->
            
            <div class="col-md-6">
             <label for="state" class="form-label"><b>State:</b></label>
             <input type="text" class="form-control form-control-sm" id="state" placeholder="State">
             <div id="stateError" class="error-message" style="display: none;">State is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createstate">Create</button>
</div>

              </div>
            </div>
          </div>
          
               <div class="modal fade" id="exampleModalCenter99" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmstateyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          
<div class="modal fade" id="exampleModalScrollableStateUp" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update State</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">
         
            <!-- <div class="col-md-6">
             <label for="registertype" class="form-label"><b>Register Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="registertype" placeholder="Register Type">
             <div id="registertypeError" class="text-danger" style="display: none;">Register Type is required</div>
            </div> -->
            
            <div class="col-md-6">
             <label for="State_2" class="form-label"><b>State:</b></label>
             <input type="text" class="form-control form-control-sm" id="State_2" placeholder="State">
             <div id="State_2Error" class="error-message" style="display: none;">State is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="updstate">Update</button>
</div>

              </div>
            </div>
          </div>
          
               <div class="modal fade" id="exampleModalCenter89" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelstatemodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmstateupd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          
          
<div class="modal fade" id="exampleModalScrollableCompany" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 600px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Company</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
            <div class="col-md-6">
             <label for="company" class="form-label"><b>Company Name:</b></label>
             <input type="text" class="form-control form-control-sm" id="company" placeholder="Company Name">
             <div id="companyError" class="error-message" style="display: none;">Company Name is required</div>
            </div>
            
            <div class="col-md-6">
             <label for="address" class="form-label"><b>Address:</b></label>
             <input type="text" class="form-control form-control-sm" id="address" placeholder="Address">
             <div id="addressError" class="error-message" style="display: none;">Address is required</div>
            </div>          

            <div class="col-md-6" style="padding-top:3%;">
             <label for="statedp" class="form-label"><b>State:</b></label>
             <select class="form-control form-control-sm" id="statedp">
             <!-- Options will go here -->
             </select> 
             <div id="statedpError" class="error-message" style="display: none;">State is required</div>
            </div>
            
            <div class="col-md-6" style="padding-top:3%;">
             <label for="city3" class="form-label"><b>City:</b></label>
             <select class="form-control form-control-sm" id="city3">
             <!-- Options will go here -->
             </select> 
             <div id="city3Error" class="error-message" style="display: none;">City is required</div>
            </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createcompany">Create</button>
</div>

              </div>
            </div>
          </div>
          
               <div class="modal fade" id="exampleModalCenter110" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmcompanyyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          <!--  Update Consignee Address -->  
<div class="modal fade" id="exampleModalScrollableCompanyup" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 600px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Company</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">
               <div class="col-md-6">
             <label for="company1" class="form-label"><b>Company Name:</b></label>
             <input type="text" class="form-control form-control-sm" id="company1" placeholder="Company Name">
             <div id="company1Error" class="error-message" style="display: none;">Company Name is required</div>
            </div>
            
            <div class="col-md-6">
             <label for="address1" class="form-label"><b>Address:</b></label>
             <input type="text" class="form-control form-control-sm" id="address1" placeholder="Address">
             <div id="address1Error" class="error-message" style="display: none;">Address is required</div>
            </div>          

            <div class="col-md-6">
             <label for="state2" class="form-label"><b>State:</b></label>
             <select class="form-control form-control-sm" id="state2">
             <!-- Options will go here -->
             </select> 
             <div id="state2Error" class="error-message" style="display: none;">State is required</div>
            </div>
            
            <div class="col-md-6">
             <label for="city2" class="form-label"><b>City:</b></label>
             <select class="form-control form-control-sm" id="city2">
             <!-- Options will go here -->
             </select> 
             <div id="city2Error" class="error-message" style="display: none;">City is required</div>
            </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="Companyup">Update</button>
</div>

              </div>
            </div>
          </div>
          
               <div class="modal fade" id="exampleModalCenter111" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelcompanymodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmcompanyupd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          
          
  <div class="modal fade" id="exampleModalScrollableLocation" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 600px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create City</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
                 <div class="col-md-6">
             <label for="state1" class="form-label"><b>State:</b></label>
             <select class="form-control form-control-sm" id="state1">
             <!-- Options will go here -->
             </select> 
             <div id="state1Error" class="error-message" style="display: none;">State is required</div>
            </div>
            
            <div class="col-md-6">
             <label for="city" class="form-label"><b> City:</b></label>
             <input type="text" class="form-control form-control-sm" id="city" placeholder="City">
             <div id="cityError" class="error-message" style="display: none;"> City is required</div>
            </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createcity">Create</button>
</div>

              </div>
            </div>
          </div>
          
               <div class="modal fade" id="exampleModalCenter100" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmcityyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          <!--  Update Consignee Address -->  
<div class="modal fade" id="exampleModalScrollableCityup" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 600px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update City</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">
                 <div class="col-md-6">
             <label for="state3" class="form-label"><b>State:</b></label>
             <select class="form-control form-control-sm" id="state3">
             <!-- Options will go here -->
             </select> 
             <div id="state3Error" class="error-message" style="display: none;">State is required</div>
            </div>
            
            <div class="col-md-6">
             <label for="city1" class="form-label"><b> City:</b></label>
             <input type="text" class="form-control form-control-sm" id="city1" placeholder="City">
             <div id="city1Error" class="error-message" style="display: none;"> City is required</div>
            </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="updcity">Update</button>
</div>

              </div>
            </div>
          </div>        
          
               <div class="modal fade" id="exampleModalCenter101" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelcitymodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmcityupd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
              
              
              
        <div class="modal fade" id="exampleModalScrollableSelect" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Select Type</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
          
            <!-- <div class="col-md-6">
             <label for="registertype" class="form-label"><b>Register Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="registertype" placeholder="Register Type">
             <div id="registertypeError" class="text-danger" style="display: none;">Register Type is required</div>
            </div> -->
            
            <div class="col-md-6">
             <label for="selecttype" class="form-label"><b>Select Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="selecttype" placeholder="Select Type">
             <div id="selecttypeError" class="error-message" style="display: none;">Select Type is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createselect">Create</button>
</div>

              </div>
            </div>
          </div>
          
               <div class="modal fade" id="exampleModalCenter199" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmselecttypeyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          
<div class="modal fade" id="exampleModalScrollableSelectUp" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Select Type</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">                              
            <div class="col-md-6">
             <label for="selecttype1" class="form-label"><b>Select Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="selecttype1" placeholder="Select Type">
             <div id="selecttype1Error" class="error-message" style="display: none;">Select Type is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="updselect">Update</button>
</div>

              </div>
            </div>
          </div>
          
               <div class="modal fade" id="exampleModalCenter109" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelselectmodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmselectupd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
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
                    <button type="button" class="btn btn-info btn-sm" onclick="addevent()">YES</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal fade" id="exampleModalCenter66con" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" onclick="addeventCon()">YES</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal fade" id="exampleModalCenter66inupdate" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-info btn-sm" onclick="addeventINupdate()">YES</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal fade" id="exampleModalCenter66inupdatenew" tabindex="-1" role="dialog"
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
                  <b> Already Generated Not able to Update</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">OK</button> 
                  
                </div>
              </div>
            </div>
          </div>
          <div class="modal fade" id="exampleModalCenter66inupdateCOn" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-info btn-sm" onclick="addeventConupdate()">YES</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal fade" id="exampleModalCenter66inupdatenewCon" tabindex="-1" role="dialog"
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
                  <b> Already Generated Not able to Update</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">OK</button> 
                  
                </div>
              </div>
            </div>
          </div>
          <div class="modal fade" id="exampleModalCenterDupcon" tabindex="-1" role="dialog"
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
                  <b id="errorMessagecon"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">OK</button> 
                </div>
              </div>
            </div>
          </div>

					<div class="modal fade" id="exampleModalCenterDupUPcon"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1">
									
								</div>
								<div class="modal-body">
									<b id="errorMessageupcon"></b>
								</div>
								<div class="modal-footer justify-content-center">
									<button type="button" class="btn btn-secondary btn-sm"
										id="modalokk">OK</button>
								</div>
							</div>
						</div>
					</div>
				</div>
  </div>
 </div>
</div>
  <!-- Scroll to top -->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
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
  <script src="js/VTSRegistermaster.js?v=<%=ts%>"></script>
      <script src="js/logout.js"></script>
  <script src="js/username.js"></script>
  <script src="js/factoryid.js"></script>
   	  <script src="js/modifiedby.js"></script>
   	  <script src="js/createdby.js"></script>
   	   <script src="js/Sessionfilter.js"></script>
   	     	  <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
   	    <script src="js/permissions.js"></script>
<script>
    function toggleTables() {
        // Hide all tables first
        const tables = ['registerTable', 'vehicleTable', 'companyTable', 'locationTable', 'stateTable', 'selectTable',];
        tables.forEach(tableId => {
            document.getElementById(tableId).style.display = 'none';
        });

        // Show the selected table
        if (document.getElementById('registerRadio').checked) {
            document.getElementById('registerTable').style.display = 'block';
        } else if (document.getElementById('vehicleRadio').checked) {
            document.getElementById('vehicleTable').style.display = 'block';
        } else if (document.getElementById('companyRadio').checked) {
            document.getElementById('companyTable').style.display = 'block';
        } else if (document.getElementById('cityRadio').checked) {
            document.getElementById('locationTable').style.display = 'block';
        }else if (document.getElementById('stateRadio').checked) {
            document.getElementById('stateTable').style.display = 'block';
        }else if (document.getElementById('selectRadio').checked) {
            document.getElementById('selectTable').style.display = 'block';
        }
    }

    // Run toggleTables on initial page load
    window.onload = toggleTables;
    
    window.onload = function() {
        fetchregistertype();
    };

    window.onload = function () {
    	fetchcompanydetails();
    };
    
    window.onload = function () {
        fetchSelectTypes();
    };

</script>
<!-- <script>
function VehicleType Click() {
	setTimeout(() => {
		$('#tableID1_wrapper .dataTables_scrollHeadInner th').click();
	}, 200);
}
</script>  -->
</body>

</html>