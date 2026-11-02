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
              <li class="breadcrumb-item"><a href="QCDashboard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="QCMaster.jsp">QC Master</a></li>
            </ol>
          </div>
        
<div class="container mt-5">
    <h3 class="text-center mb-4">Select QC Master</h3>

    <!-- Radio Buttons -->
    <div class="d-flex justify-content-center mb-4">
        <div class="form-check me-3">
            <input class="form-check-input" type="radio" name="masterSelection" id="fabricatorRadio" value="fabricator" checked onchange="toggleTables()">
            <label class="form-check-label" for="fabricatorRadio">Fabricator Name</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="masterSelection" id="welderRadio" value="welder" onchange="toggleTables()">
            <label class="form-check-label" for="welderRadio">Welder Name</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="masterSelection" id="revisionRadio" value="revision" onchange="toggleTables()">
            <label class="form-check-label" for="revisionRadio">Revision</label>
        </div>&nbsp;&nbsp;
         <div class="form-check">
            <input class="form-check-input" type="radio" name="masterSelection" id="positionRadio" value="position" onchange="toggleTables()">
            <label class="form-check-label" for="positionRadio">Position</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="masterSelection" id="processRadio" value="process" onchange="toggleTables()">
            <label class="form-check-label" for="processRadio">Process</label>
        </div>&nbsp;&nbsp;
    </div>
</div>

<!-- Register Table -->
<div class="row mb-3" id="fabricatorTable" style="display:none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="qcfab"><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
                <thead>
                    <tr>
                        <th>SlNo</th>
                        <th>QC Fabricator Name</th>
                        <th>Actions</th>
                        <th>Status</th>
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
<div class="row mb-3" id="welderTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal"  id="welid" ><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="tableID1" width="100%">
                <thead>
                    <tr>
                        <th>SlNo</th>
                        <th>QC Welder Name</th>
                        <th>Actions</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Dynamic rows will be inserted here -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="row mb-3" id="revisionTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="revid"><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="tableIDrev" width="100%">
                <thead>
                    <tr>
                        <th>SlNo</th>
                        <th>Revision</th>
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
<div class="row mb-3" id="positionTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="posid"><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="positiontableID" width="100%">
                <thead>
                    <tr>
                        <th>SlNo</th>
                        <th>Position</th>
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
<div class="row mb-3" id="processTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="proid"><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="processTableID" width="100%">
                <thead>
                    <tr>
                        <th>SlNo</th>
                        <th>Process</th>
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
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Fabricator</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
            <div class="col-md-6">
             <label for="fabid" class="form-label"><b>Fabricator ID/Name:</b></label>
             <select class="form-control form-control-sm" id="fabid">
             </select> 
            </div>
            
            <div class="col-md-6">
             <label for="fabdesc" class="form-label"><b>Fabricator Description:</b></label>
             <input type="text" class="form-control form-control-sm" id="fabdesc" placeholder="Fab Name">
             <div id="fabdescError" class="error-message" style="display: none;">Fabricator name is required</div>
          </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="submitfab">Create</button>
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmfabYes">YES</button>
                </div>
              </div>
            </div>
          </div>
          
           <div class="modal fade" id="exampleModalCenter808" tabindex="-1" role="dialog"
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
                   <b>Are you sure you want to change the status?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmfab1Yes">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- jQuery -->
          
             
              
              <div class="modal fade" id="exampleModalCenterfab" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 70%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                 </div>
                <div class="modal-body">
                  <b id="errorMessageupfab"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" id="modalokk">OK</button> 
                </div>
              </div>
            </div>
          </div> 
          
<!-- Update Invoice Address -->
<div class="modal fade" id="exampleModalScrollableINUp" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Fabricator</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
                <form id="productForm">
               <div class="form-row">
               <div class="col-md-6">
               <label for="fabidup" class="form-label"><b>Fabricator ID/Name:</b></label>
               <select class="form-control form-control-sm" id="fabidup">
               </select> 
              </div>
            
              <div class="col-md-6">
             <label for="fabdescup" class="form-label"><b>Fabricator Description:</b></label>
             <input type="text" class="form-control form-control-sm" id="fabdescup" placeholder="Fab Name">
             <div id="fabdescupError" class="error-message" style="display: none;">Fabricator name is required</div>
             </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="fabupd">Update</button>
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmfabupd">YES</button>
                </div>
              </div>
            </div>
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
          
<div class="modal fade" id="exampleModalScrollableCon" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Welder</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
     <div class="form-row">
               <div class="col-md-6">
               <label for="weld" class="form-label"><b>Welder ID/Name:</b></label>
               <select class="form-control form-control-sm" id="weld">
               </select> 
              </div>
            
              <div class="col-md-6">
             <label for="welddesc" class="form-label"><b>Welder Description:</b></label>
             <input type="text" class="form-control form-control-sm" id="welddesc" placeholder="Weld Name">
             <div id="welddescError" class="error-message" style="display: none;">Welder name is required</div>
             </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="submitweld">Create</button>
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmweldYes">YES</button>
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
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Welder</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
     <div class="form-row">
               <div class="col-md-6">
               <label for="weldup" class="form-label"><b>Welder ID/Name:</b></label>
               <select class="form-control form-control-sm" id="weldup">
               </select> 
              </div>
            
              <div class="col-md-6">
             <label for="welddescup" class="form-label"><b>Welder Description:</b></label>
             <input type="text" class="form-control form-control-sm" id="welddescup" placeholder="Weld Name">
             <div id="welddescupError" class="error-message" style="display: none;">Welder name is required</div>
             </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="weldupd">Update</button>
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelweldmodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmweldupd">YES</button>
                </div>
              </div>
            </div>
          </div>
   
              
              
              <div class="modal fade" id="exampleModalScrollableConrev" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Revision</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
     <div class="form-row">
               <div class="col-md-6">
               <label for="qcrev" class="form-label"><b>Revision:</b></label>
               <select class="form-control form-control-sm" id="qcrev">
               </select> 
              </div>
            
              <div class="col-md-6">
             <label for="welddesc" class="form-label"><b>Revision Description:</b></label>
             <input type="text" class="form-control form-control-sm" id="qcrevdesc" placeholder="Revision">
             <div id="qcrevdescError" class="error-message" style="display: none;">Revision is required</div>
             </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="submitqcrev">Create</button>
</div>

              </div>
            </div>
          </div>
          
            <div class="modal fade" id="exampleModalCenterqcrev" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmqcrevYes">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          <!--  Update Consignee Address -->  
<div class="modal fade" id="exampleModalScrollableConUprev" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Revision</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
     <div class="form-row">
               <div class="col-md-6">
               <label for="qcrevup" class="form-label"><b>Revision:</b></label>
               <select class="form-control form-control-sm" id="qcrevup">
               </select> 
              </div>
            
              <div class="col-md-6">
             <label for="qcrevupdescup" class="form-label"><b>Welder Description:</b></label>
             <input type="text" class="form-control form-control-sm" id="qcrevupdescup" placeholder="Revision">
             <div id="qcrevupdescupError" class="error-message" style="display: none;">Revision is required</div>
             </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="qcrevupd">Update</button>
</div>

              </div>
            </div>
          </div>
          
           <div class="modal fade" id="exampleModalCenterqcrevupd" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelweldmodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmqcrevupd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              
          
          
 <div class="modal fade" id="exampleModalScrollableposition" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Position</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
               <div class="col-md-6">
               <label for="position" class="form-label"><b>Position:</b></label>
               <select class="form-control form-control-sm" id="position">
               </select> 
              </div>
            
              <div class="col-md-6">
             <label for="posdesc" class="form-label"><b>Position Description:</b></label>
             <input type="text" class="form-control form-control-sm" id="posdesc" placeholder="Position">
             <div id="posdescError" class="error-message" style="display: none;">Position is required</div>
             </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createposition">Create</button>
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmposyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
            
          
          
<div class="modal fade" id="exampleModalScrollablepositionUp" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Position</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
     <div class="form-row">
               <div class="col-md-6">
               <label for="positionup" class="form-label"><b>Position:</b></label>
               <select class="form-control form-control-sm" id="positionup">
               </select> 
              </div>
            
              <div class="col-md-6">
             <label for="posdescup" class="form-label"><b>Position Description:</b></label>
             <input type="text" class="form-control form-control-sm" id="posdescup" placeholder="Position">
             <div id="posdescupError" class="error-message" style="display: none;">Position is required</div>
             </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="updpos">Update</button>
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelpositionmodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmposupd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
  
          
          
          
<div class="modal fade" id="exampleModalScrollableprocess" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 600px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Process</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
     <div class="form-row">
               <div class="col-md-6">
               <label for="processCreate" class="form-label"><b>Process:</b></label>
               <select class="form-control form-control-sm" id="processCreate">
               </select> 
              </div>
            
              <div class="col-md-6">
             <label for="possdesc" class="form-label"><b>Process Description:</b></label>
             <input type="text" class="form-control form-control-sm" id="possdesc" placeholder="Process">
             <div id="possdescError" class="error-message" style="display: none;">Process is required</div>
             </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createprocess">Create</button>
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmprocessyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
            
          
          <!--  Update Consignee Address -->  
<div class="modal fade" id="exampleModalScrollableprocessup" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 600px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Process</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">
               <div class="col-md-6">
               <label for="processUp" class="form-label"><b>Process:</b></label>
               <select class="form-control form-control-sm" id="processUp">
               </select> 
              </div>
            
              <div class="col-md-6">
             <label for="possdescup" class="form-label"><b>Process Description:</b></label>
             <input type="text" class="form-control form-control-sm" id="possdescup" placeholder="Process">
             <div id="possdescupError" class="error-message" style="display: none;">Process is required</div>
             </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="possup">Update</button>
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelprocessmodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmprocessupd">YES</button>
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
   <script src="externalLibrary/cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>   
  <script src="vendor/jquery/jquery.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
     
  <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
  

      <script src="vendor/datatables/jquery.dataTables.min.js"></script>
      <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
    <!-- <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script> -->
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
  <script src="js/QC.js?v=<%=ver(application, "/js/QC.js")%>"></script>
      <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
  <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
  <script src="js/factoryid.js?v=<%=ver(application, "/js/factoryid.js")%>"></script>
   	  <script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
   	  <script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
   	   <script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
      	  <script>

  window.actionElementMap = {
  };
</script>	  
  <script src="js/permissions.js?v=<%=ver(application, "/js/permissions.js")%>"></script>
<script>
$(document).ready(function () {

    const selectedType = localStorage.getItem("selectedRadioType");

    if (selectedType) {
        $("#" + selectedType + "Radio").prop("checked", true);
        localStorage.removeItem("selectedRadioType"); // cleanup
    }

    toggleTables(); // now it works correctly 
});
</script>

<script>
function toggleTables() {
    $("#fabricatorTable, #welderTable, #revisionTable, #positionTable, #processTable").hide();

    if ($("#fabricatorRadio").is(":checked")) {
        $("#fabricatorTable").show();
        //renderFabricators();
    } else if ($("#welderRadio").is(":checked")) {
        $("#welderTable").show();
        renderWelders();
    } else if ($("#revisionRadio").is(":checked")) {
        $("#revisionTable").show();
        renderRevision();
    } else if ($("#positionRadio").is(":checked")) {
        $("#positionTable").show();
        renderPositions();
    } else if ($("#processRadio").is(":checked")) {
        $("#processTable").show();
        renderProcesses();
    }
}
</script>

<script>
$(document).ready(function () {

    const params = new URLSearchParams(window.location.search);
    const radio = params.get("radio");

    if (radio) {
        $("#" + radio + "Radio").prop("checked", true);
    }

    toggleTables(); // show correct table
});
</script>


</body>

</html>