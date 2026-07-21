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
    <script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>
</head>
<!-- <script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script> -->

<body onload="fetchUserList();">
   <div id="wrapper">
  <%@ include file="ContractSidebar.jsp"%>
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
              <li class="breadcrumb-item"><a href="ContractDashboard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="ContractMaster.jsp">Contract Master</a></li>
            </ol>
          </div>
        
<div class="container mt-5">
    <h3 class="text-center mb-4">Select Contract Master</h3>

    <!-- Radio Buttons -->
    <div class="d-flex justify-content-center mb-4">
        <div class="form-check me-3">
            <input class="form-check-input" type="radio" name="ContractSelection" id="natureRadio" value="nature" checked onchange="toggleTables()">
            <label class="form-check-label" for="natureRadio">Nature of Job</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="ContractSelection" id="workRadio" value="work" onchange="toggleTables()">
            <label class="form-check-label" for="workRadio">Work Location</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="ContractSelection" id="busRadio" value="bus" onchange="toggleTables()">
            <label class="form-check-label" for="busRadio">Bus Name</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="ContractSelection" id="vaccineRadio" value="vaccine" onchange="toggleTables()">
            <label class="form-check-label" for="vaccineRadio">Vaccine Type</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="ContractSelection" id="medicalRadio" value="medical" onchange="toggleTables()">
            <label class="form-check-label" for="medicalRadio">Medical CheckUp type</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="ContractSelection" id="bloodRadio" value="blood" onchange="toggleTables()">
            <label class="form-check-label" for="bloodRadio">Blood Group</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="ContractSelection" id="educationRadio" value="education" onchange="toggleTables()">
            <label class="form-check-label" for="educationRadio">Education</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="ContractSelection" id="religionRadio" value="religion" onchange="toggleTables()">
            <label class="form-check-label" for="religionRadio">Religion</label>
        </div>
        
    </div>
</div>

<!-- Nature Table -->
<div class="row mb-3" id="natureTable">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="modalnature"><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="naturetableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Nature of Job</th>
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

<!-- Work Table -->
<div class="row mb-3" id="workTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="modalwork" ><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="worktableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Work Location</th>
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

<!-- Bus Table -->
<div class="row mb-3" id="busTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal"  id= "modalbus" ><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="bustableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Bus Name</th>
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

<!-- Vaccine Table -->
<div class="row mb-3" id="vaccineTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="modalvaccine" ><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="vaccineTableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Vaccine Type</th>                      
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

<!-- Medical Table -->
<div class="row mb-3" id="medicalTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="modalmedical" ><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="medicalTableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Medical CheckUp type</th>
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

<!-- Blood Table -->
<div class="row mb-3" id="bloodTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal"  id="modalblood" ><i class="fas fa-plus"></i> Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="bloodTableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Blood Group</th>
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

<!-- Education Table -->
<div class="row mb-3" id="educationTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex-row align-items-center jusify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal"  id='modaleductaion' ><i class="fas fa-plus"></i>Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-border table-sm" id="educationTableID" width="100%">
                  <thead>
                      <tr>
                          <th>Sl. No.</th>
                          <th>Education</th>
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

<!-- Religion Table -->
<div class="row mb-3" id="religionTable" style="display: none;">
    <div class="table-responsive p-3">
        <div class="card-header py-3 d-flex-row align-items-center jusify-content-between" style="background-color: #f8f9fc;">
            <button data-toggle="modal" id="modalreligion" ><i class="fas fa-plus"></i>Create</button>
        </div>
        <div class="table-responsive p-3">
            <table class="table table-striped table-border table-sm" id="religionTableID" width="100%">
                  <thead>
                      <tr>
                          <th>Sl. No.</th>
                          <th>Religion</th>
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
<div class="modal fade" id="exampleModalScrollableNature" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Nature of Job</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
          
            <div class="col-md-6">
             <label for="naturejob" class="form-label"><b>Nature of Job:</b></label>
             <input type="text" class="form-control form-control-sm" id="naturejob" placeholder="Nature of Job">
             <div id="naturejobError" class="text-danger" style="display: none;">Nature of Job is required</div>
           
            
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
    <button type="button" class="btn btn-sm btn-success" id="createnatureofjob">Create</button>  <!-- onclick="openModalAddnaturejob();" -->
</div>

              </div>
            </div>
          </div>
          
           <div class="modal fade" id="exampleModalCenter120" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmnaturejobYes">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- jQuery -->
      <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
<!-- Update Invoice Address -->
<div class="modal fade" id="exampleModalScrollableNatureUp" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Nature of Job</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
          
            <div class="col-md-6">
             <label for="naturejob1" class="form-label"><b>Nature of Job:</b></label>
             <input type="text" class="form-control form-control-sm" id="naturejob1" placeholder="Nature of Job">
             <div id="naturejob1Error" class="text-danger" style="display: none;">Nature of Job is required</div>
           
            
       
          </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="natureupd">Update</button>      <!-- onclick="openModalAddnaturejobUP();" -->
</div>

 <div class="modal fade" id="exampleModalCenter175" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelnaturejob1modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmnaturejob1upd">YES</button>
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
          
          <div class="modal fade" id="exampleModalCenterDupUP" tabindex="-1" role="dialog"
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
                  <b id="errorMessageup"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">OK</button> 
                </div>
              </div>
            </div>
          </div>       
        <!--  Create Consignee Address -->  
<div class="modal fade" id="exampleModalScrollableWork" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Work Location</b></h5>
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
             <label for="worklocation" class="form-label"><b>Work Location:</b></label>
             <input type="text" class="form-control form-control-sm" id="worklocation" placeholder="Work Location">
             <div id="worklocationError" class="text-danger" style="display: none;">Work Location is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createworklocation">Create</button>    <!--  onclick="openModalAddworklocation();" -->
</div>

              </div>
            </div>
          </div>
          
            <div class="modal fade" id="exampleModalCenter185" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmworklocationYes">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          <!--  Update Consignee Address -->  
<div class="modal fade" id="exampleModalScrollableWorkUp" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Work Location</b></h5>
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
             <label for="worklocation1" class="form-label"><b>Work Location:</b></label>
             <input type="text" class="form-control form-control-sm" id="worklocation1" placeholder="Work Location">
             <div id="worklocation1Error" class="text-danger" style="display: none;">Work Location is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="workupd">Update</button>           <!-- onclick="openModalAddworklocationUP();" -->
</div>

              </div>
            </div>
          </div>
          
           <div class="modal fade" id="exampleModalCenter186" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelworklocation1modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmworklocation1upd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          
 <div class="modal fade" id="exampleModalScrollableBus" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Bus Name</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
          
      
            
            <div class="col-md-6">
             <label for="busname" class="form-label"><b>Bus Name:</b></label>
             <input type="text" class="form-control form-control-sm" id="busname" placeholder="Bus Name">
             <div id="busnameError" class="text-danger" style="display: none;">Bus Name is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createbusname">Create</button>        <!-- onclick="openModalAddbusname();" -->
</div>

              </div>
            </div>
          </div>
          
               <div class="modal fade" id="exampleModalCenter299" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmbusnameyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          
<div class="modal fade" id="exampleModalScrollableBusUp" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Bus Name</b></h5>
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
             <label for="busname1" class="form-label"><b>Bus Name:</b></label>
             <input type="text" class="form-control form-control-sm" id="busname1" placeholder="Bus Name">
             <div id="busname1Error" class="text-danger" style="display: none;">Bus Name is required</div>
            </div>
         
    </div>
</form>
</div>

            <div class="modal-footer">
             <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
             <button type="button" class="btn btn-sm btn-success" id="updbusname">Update</button>     <!-- onclick="openModalAddbusnameUP();" -->
            </div>

              </div>
            </div>
          </div>
          
               <div class="modal fade" id="exampleModalCenter289" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelbusnamemodal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmbusnameupd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          
          
<div class="modal fade" id="exampleModalScrollableVaccine" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Vaccine Type</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
            <div class="col-md-6">
             <label for="vaccinetype" class="form-label"><b>Vaccine Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="vaccinetype" placeholder="Vaccine Type">
             <div id="vaccinetypeError" class="text-danger" style="display: none;">Vaccine Type is required</div>
            </div>
                       
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createvaccinetype" >Create</button>   <!-- onclick="openModalAddvaccinetype();" -->
</div>

              </div>
            </div>
          </div>
          
                 <div class="modal fade" id="exampleModalCenter300" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmvaccinetypeyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          <!--  Update Consignee Address -->  
<div class="modal fade" id="exampleModalScrollableVaccineup" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Vaccine Type</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">
               <div class="col-md-6">
             <label for="vaccinetype1" class="form-label"><b>Vaccine Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="vaccinetype1" placeholder="Vaccine Type">
             <div id="vaccinetype1Error" class="text-danger" style="display: none;">Vaccine Type is required</div>
            </div>
                  
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="updvaccinetype1">Update</button>          <!-- onclick="openModalAddvaccinetypeUP();" -->
</div>

              </div>
            </div>
          </div>
          
          
                  <div class="modal fade" id="exampleModalCenter301" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelvaccinetype1modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmvaccinetype1upd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          
  <div class="modal fade" id="exampleModalScrollableMedical" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Medical CheckUp type</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">                      
            <div class="col-md-6">
             <label for="checkup" class="form-label"><b>Medical CheckUp type:</b></label>
             <input type="text" class="form-control form-control-sm" id="checkup" placeholder="Medical CheckUp type">
             <div id="checkupError" class="text-danger" style="display: none;"> Medical CheckUp type is required</div>
            </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createmedicalcheckup">Create</button>   <!-- onclick="openModalAddcheckup();" -->
</div>

              </div>
            </div>
          </div>
          
            <div class="modal fade" id="exampleModalCenter302" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmcheckupyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          <!--  Update Consignee Address -->  
<div class="modal fade" id="exampleModalScrollableMedicalupdate" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Medical CheckUp type</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">                     
            <div class="col-md-6">
             <label for="checkup1" class="form-label"><b>Medical CheckUp type:</b></label>
             <input type="text" class="form-control form-control-sm" id="checkup1" placeholder="Medical CheckUp type">
             <div id="checkup1Error" class="text-danger" style="display: none;">Medical CheckUp type is required</div>
            </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="updmedicalcheckuptype">Update</button>         <!-- onclick="openModalAddcheckupUP();" -->
</div>

              </div>
            </div>
          </div>
          
                <div class="modal fade" id="exampleModalCenter303" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelcheckup1modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmcheckup1upd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          
    <div class="modal fade" id="exampleModalScrollableBlood" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Blood Group</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">                      
            <div class="col-md-6">
             <label for="bloodgroup" class="form-label"><b>Blood Group:</b></label>
             <input type="text" class="form-control form-control-sm" id="bloodgroup" placeholder="Blood Group">
             <div id="bloodgroupError" class="text-danger" style="display: none;"> Blood Group is required</div>
            </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createbloodgrp">Create</button>                  <!-- onclick="openModalAddblood();" -->
</div>

              </div>
            </div>
          </div>
          
           <div class="modal fade" id="exampleModalCenter304" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmbloodgroupyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          <!--  Update Consignee Address -->  
<div class="modal fade" id="exampleModalScrollableBlood1" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Blood Group</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">                     
            <div class="col-md-6">
             <label for="bloodgroup1" class="form-label"><b>Blood Group:</b></label>
             <input type="text" class="form-control form-control-sm" id="bloodgroup1" placeholder="Blood Group">
             <div id="bloodgroup1Error" class="text-danger" style="display: none;">Blood Group is required</div>
            </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="updbloodgrp">Update</button>                  <!-- onclick="openModalAddbloodUP();" -->
</div>

              </div>
            </div>
          </div> 
          
             <div class="modal fade" id="exampleModalCenter305" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelbloodgroup1modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmbloodgroup1upd">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          
         <div class="modal fade" id="exampleModalScrollableeducation" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Education</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">                      
            <div class="col-md-6">
             <label for="education" class="form-label"><b>Education:</b></label>
             <input type="text" class="form-control form-control-sm" id="education" placeholder="Education">
             <div id="educationError" class="text-danger" style="display: none;">Education is required</div>
            </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" ID="createeducation">Create</button>                      <!-- onclick="openModalAddeducation();" -->
</div>

              </div>
            </div>
          </div>
          
             <div class="modal fade" id="exampleModalCenter306" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmeducationyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          <!--  Update Consignee Address -->  
<div class="modal fade" id="exampleModalScrollableeducation1" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Education</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">                     
            <div class="col-md-6">
             <label for="education1" class="form-label"><b>Education:</b></label>
             <input type="text" class="form-control form-control-sm" id="education1" placeholder="Education">
             <div id="education1Error" class="text-danger" style="display: none;">Education is required</div>
            </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="updeducation1">Update</button>                    <!-- onclick="openModalAddeducationUP();" -->
</div>

              </div>
            </div>
          </div>
          
                       <div class="modal fade" id="exampleModalCenter307" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="canceleducation1modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmeducation1upd">YES</button>
                </div>
              </div>
            </div>
          </div>
      <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
     
      <div class="modal fade" id="exampleModalScrollablereligion" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Religion</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">                      
            <div class="col-md-6">
             <label for="religion" class="form-label"><b>Religion:</b></label>
             <input type="text" class="form-control form-control-sm" id="religion" placeholder="Religion">
             <div id="religionError" class="text-danger" style="display: none;">Religion is required</div>
            </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createreligion">Create</button>                  <!-- onclick="openModalAddreligion();" -->
</div>

              </div>
            </div>
          </div>
          
             <div class="modal fade" id="exampleModalCenter308" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmreligionyes">YES</button>
                </div>
              </div>
            </div>
          </div>
              
              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          
          <!--  Update Consignee Address -->  
<div class="modal fade" id="exampleModalScrollablereligion1" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Religion</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">                     
            <div class="col-md-6">
             <label for="religion1" class="form-label"><b>Religion:</b></label>
             <input type="text" class="form-control form-control-sm" id="religion1" placeholder="Religion">
             <div id="religion1Error" class="text-danger" style="display: none;">Religion is required</div>
            </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="updreligion">Update</button>                     <!-- onclick="openModalAddreligionUP();" -->
</div>

              </div>
            </div>
          </div>                                      

     
           <div class="modal fade" id="exampleModalCenter309" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" id="cancelreligion1modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmreligion1upd">YES</button>
                </div>
              </div>
            </div>
          </div>
      <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                        
          
         
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
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">OK</button> 
                </div>
              </div>
            </div>
          </div> 
<div class="modal fade" id="duplicateNatureModal" tabindex="-1" role="dialog"
     aria-labelledby="duplicateNatureTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content"
         style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

      <div class="modal-header1"></div>

      <div class="modal-body text-center">
        <b id="duplicateNatureMessage">Nature of Job already exists.</b>
      </div>

      <div class="modal-footer d-flex justify-content-center">
        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
          OK
        </button>
      </div>

    </div>
  </div>
</div>
<div class="modal fade" id="duplicateWorkLocationModal" tabindex="-1" role="dialog"
     aria-labelledby="duplicateWorkLocationTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content"
         style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

      <div class="modal-header1"></div>

      <div class="modal-body text-center">
        <b id="duplicateWorkLocationMessage">
          Work Location already exists.
        </b>
      </div>

      <div class="modal-footer d-flex justify-content-center">
        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
          OK
        </button>
      </div>

    </div>
  </div>
</div>

<div class="modal fade" id="duplicateBusModal" tabindex="-1" role="dialog"
     aria-labelledby="duplicateBusTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content"
         style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

      <div class="modal-header1"></div>

      <div class="modal-body text-center">
        <b id="duplicateBusMessage">Bus name already exists.</b>
      </div>

      <div class="modal-footer d-flex justify-content-center">
        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
          OK
        </button>
      </div>

    </div>
  </div>
</div>

<div class="modal fade" id="duplicateVaccineModal" tabindex="-1" role="dialog"
     aria-labelledby="duplicateVaccineTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content"
         style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

      <div class="modal-header1"></div>

      <div class="modal-body text-center">
        <b id="duplicateVaccineMessage">Vaccine type already exists.</b>
      </div>

      <div class="modal-footer d-flex justify-content-center">
        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
          OK
        </button>
      </div>

    </div>
  </div>
</div>

<div class="modal fade" id="duplicateMedicalModal" tabindex="-1" role="dialog"
     aria-labelledby="duplicateMedicalTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content"
         style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

      <div class="modal-header1"></div>

      <div class="modal-body text-center">
        <b id="duplicateMedicalMessage">Medical CheckUp type already exists.</b>
      </div>

      <div class="modal-footer d-flex justify-content-center">
        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
          OK
        </button>
      </div>

    </div>
  </div>
</div>

<div class="modal fade" id="duplicateBloodModal" tabindex="-1" role="dialog"
     aria-labelledby="duplicateBloodTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content"
         style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

      <div class="modal-header1"></div>

      <div class="modal-body text-center">
        <b id="duplicateBloodMessage">Blood Group already exists.</b>
      </div>

      <div class="modal-footer d-flex justify-content-center">
        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
          OK
        </button>
      </div>

    </div>
  </div>
</div>

<div class="modal fade" id="duplicateEducationModal" tabindex="-1" role="dialog"
     aria-labelledby="duplicateEducationTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content"
         style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

      <div class="modal-header1"></div>

      <div class="modal-body text-center">
        <b id="duplicateEducationMessage">Education Type already exists.</b>
      </div>

      <div class="modal-footer d-flex justify-content-center">
        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
          OK
        </button>
      </div>

    </div>
  </div>
</div>

<div class="modal fade" id="duplicateReligionModal" tabindex="-1" role="dialog"
     aria-labelledby="duplicateReligionTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content"
         style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">

      <div class="modal-header1"></div>

      <div class="modal-body text-center">
        <b id="duplicateReligionMessage">Religion Type already exists.</b>
      </div>

      <div class="modal-footer d-flex justify-content-center">
        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
          OK
        </button>
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
  <script src="js/ContractGP.js?v=<%=ts%>"></script>
  <script src="js/contractorcustomer.js?v=<%=ts%>"></script>
      <script src="js/logout.js"></script>
  <script src="js/username.js"></script>
  <script src="js/factoryid.js"></script>
   	  <script src="js/modifiedby.js"></script>
   	  <script src="js/createdby.js"></script>
   	     <script src="js/Sessionfilter.js"></script>
   	  
   	  
<script>
    function toggleTables() {
        // Hide all tables first
        const tables = ['natureTable', 'workTable', 'busTable', 'vaccineTable', 'medicalTable', 'bloodTable', 'educationTable', 'religionTable',];
        tables.forEach(tableId => {
            document.getElementById(tableId).style.display = 'none';
        });

        // Show the selected table
        if (document.getElementById('natureRadio').checked) {
            document.getElementById('natureTable').style.display = 'block';
        } else if (document.getElementById('workRadio').checked) {
            document.getElementById('workTable').style.display = 'block';
        } else if (document.getElementById('busRadio').checked) {
            document.getElementById('busTable').style.display = 'block';
        } else if (document.getElementById('vaccineRadio').checked) {
            document.getElementById('vaccineTable').style.display = 'block';
        }else if (document.getElementById('medicalRadio').checked) {
            document.getElementById('medicalTable').style.display = 'block';
        }else if (document.getElementById('bloodRadio').checked) {
            document.getElementById('bloodTable').style.display = 'block';
        }else if (document.getElementById('educationRadio').checked) {
            document.getElementById('educationTable').style.display = 'block';
        }else if (document.getElementById('religionRadio').checked) {
            document.getElementById('religionTable').style.display = 'block';
        }
    }

    // Run toggleTables on initial page load
    window.onload = toggleTables;
    
    window.onload = function() {
    	fetchnaturejob();
    };
    
    window.onload = function() {
    	fetchworklocation();
    };
    
    window.onload = function() {
    	fetchbusname();
    };

    window.onload = function() {
    	fetchvaccinetype();
    };
    
    window.onload = function() {
    	fetchcheckup();
    };
    
    window.onload = function() {
    	fetchbloodgroup();
    };
    
    window.onload = function() {
    	fetcheducation();
    };
    
    window.onload = function() {
    	fetchreligion();
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