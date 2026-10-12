

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
  <%@ include file="AmsSidebar.jsp" %>    
  
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
              <li class="breadcrumb-item"><a href="AMSDashBoard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="AmsMaster.jsp">AMS Master</a></li>
            </ol>
          </div>
        
<div class="container mt-5">
    <h3 class="text-center mb-4">AMS Master</h3>

    <!-- Radio Buttons -->
    <div class="d-flex justify-content-center mb-4">
        <div class="form-check me-3">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="AssetTypeRadio" value="register"  onchange="toggleTables()">
            <label class="form-check-label" for="AssetTypeRadio">Asset Type</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="AssetModelRadio" value="vehicle" onchange="toggleTables()">
            <label class="form-check-label" for="AssetModelRadio">Asset Model</label>
        </div>&nbsp;&nbsp;
         <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="AssetStatusRadio" value="state" onchange="toggleTables()">
            <label class="form-check-label" for="AssetStatusRadio">Asset Status</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="AssetOwnedByRadio" value="location" onchange="toggleTables()">
            <label class="form-check-label" for="AssetOwnedByRadio">Asset OwnedBy</label>
        </div>&nbsp;&nbsp;
        <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="AssetMakerRadio" value="company" onchange="toggleTables()">
            <label class="form-check-label" for="AssetMakerRadio">Asset Maker</label>
        </div>&nbsp;&nbsp;
       
    </div>
</div>

<!-- Asset_Type Table -->
<div class="row mb-3" id="AssetTypeTable">
    <div class="table-responsive p-3">
        <!-- Create Button -->
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
            <button class="btn btn-success btn-sm" data-toggle="modal" id="modalScroll1" >
                <i class="fas fa-plus"></i> Create
            </button>
        </div>

       <div class="table-responsive p-3">
    <table class="table table-striped table-bordered table-sm" id="assetTableID" width="100%">
        <thead>
            <tr>
                <th>Sl. No.</th>
               
                <th>Asset Type</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="assetTableBody">
            <!-- Dynamic rows will be inserted here -->
        </tbody>
    </table>
</div>
    </div>
</div>

<!-- Asset Model  Table -->
<div class="row mb-3" id="AssetModelTable" style="display: none;">
    <div class="table-responsive p-3">
        <!-- Header and Create Button -->
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
            style="background-color: #f8f9fc;">
            <button class="btn btn-success btn-sm" data-toggle="modal" id="modalScroll1assetmod">
                <i class="fas fa-plus"></i> Create
            </button>
        </div>

        <!-- Data Table -->
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="tableID1" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Asset Model</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                
                </tbody>
            </table>
        </div>
    </div>
</div>
<!-- Asset Status  Table -->
<div class="row mb-3" id="AssetStatusTable" style="display: none;">
    <div class="table-responsive p-3">
        <!-- Header and Create Button -->
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
            style="background-color: #f8f9fc;">
            <button class="btn btn-success btn-sm" data-toggle="modal" id="modalScroll1assetsat">
                <i class="fas fa-plus"></i> Create
            </button>
        </div>

        <!-- Data Table -->
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="statetableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Asset Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        </div>
    </div>
</div>


<!-- Assed Owned By -->
<div class="row mb-3" id="AssetOwnedByTable" style="display: none;">
    <div class="table-responsive p-3">
        <!-- Header with Create Button -->
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
            style="background-color: #f8f9fc;">
            <button class="btn btn-success btn-sm" data-toggle="modal" id="modalScroll1assetown">
                <i class="fas fa-plus"></i> Create
            </button>
        </div>

        <!-- Data Table -->
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="locationTableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Asset Owned By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Asset Maker Table -->
<div class="row mb-3" id="AssetMakerTable" style="display: none;">
    <div class="table-responsive p-3">
        <!-- Header and Create Button -->
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
            style="background-color: #f8f9fc;">
            <button class="btn btn-success btn-sm" data-toggle="modal"  id="modalScroll1assetmake">
                <i class="fas fa-plus"></i> Create
            </button>
        </div>

        <!-- Data Table -->
        <div class="table-responsive p-3">
            <table class="table table-striped table-bordered table-sm" id="companyTableID" width="100%">
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Asset Maker</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                   
                </tbody>
            </table>
        </div>
    </div>
</div>






<!-- Create Asset Type -->


<div class="modal fade" id="exampleModalScrollableIN" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Asset Type</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
          
            <div class="col-md-6">
             <label for="registertype" class="form-label"><b>Asset Type:</b></label>
             <input type="text" class="form-control form-control-sm" id="assettype" placeholder="Asset Type" >
             <div id="assettypeError" class="error-message" style="display: none;">Asset Type is required</div>
           
            

          </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createassettype">Create</button>
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmasset_typeYes">YES</button>
                </div>
              </div>
            </div>
          </div>
          
           














					<!-- Update Asset type -->




					<div class="modal fade" id="exampleModalScrollableConUp"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Asset Type</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<div class="form-row">


											<div class="col-md-6">
												<label for="vehicletype1" class="form-label"><b>Asset
														type:</b></label> <input type="text"
													class="form-control form-control-sm" id="uptassettype"
													placeholder="Asset type">
												<div id="uptassettypeError" class="error-message"
													style="display: none;">Asset Type is required</div>
											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="assettypeupd">Update</button>
								</div>

							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalCenter360" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1">
								
								</div>
								<div class="modal-body">
									<b>Are you sure you want to update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmassetypeupd">YES</button>
								</div>
							</div>
						</div>
					</div>

					
         
          
          
        
          
        <!--  Create Asset  Model Type --> 
         
<div class="modal fade" id="exampleModalScrollableAssetModel" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Asset Model</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
          
          
            
            <div class="col-md-6">
             <label for="vehicletype" class="form-label"><b>Asset Model</b></label>
             <input type="text" class="form-control form-control-sm" id="assetModel" placeholder="Asset Model">
             <div id="assetModelError" class="error-message" style="display: none;">Asset Model is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="submitassetModel">Create</button>
</div>

              </div>
            </div>
          </div>
          
            <div class="modal fade" id="exampleModalCenter85" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 54%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                 
                 </div>
                <div class="modal-body">
                  <b>Are you sure you want to create?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" id="confirmassetmodel">YES</button>
                </div>
              </div>
            </div>
          </div>
          
        
        
        
   

        
        
        
          <!--  Update Asset Model -->  
          
          
         
          
          
          
          <div class="modal fade" id="exampleModalScrollableAssetModelUpdate"
						tabindex="-1" role="dialog"
						aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-scrollable"
							style="max-width: 500px;" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalScrollableTitle">
										<b>Update Asset Model</b>
									</h5>
									<button type="button" class="close white-button"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body">
									<form>
										<div class="form-row">


											<div class="col-md-6">
												<label for="uptassetmodel" class="form-label"><b>Asset
														Model:</b></label> <input type="text"
													class="form-control form-control-sm" id="uptassetmodel"
													placeholder="Asset Model">
												<div id="uptassetmodelError" class="error-message"
													style="display: none;">Asset Model is required</div>
											</div>

										</div>
									</form>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-sm btn-danger"
										data-dismiss="modal">Close</button>
									<button type="button" class="btn btn-sm btn-success"
										id="assetmodelupd">Update</button>
								</div>

							</div>
						</div>
					</div>

					<div class="modal fade" id="exampleModalCenter17" tabindex="-1"
						role="dialog" aria-labelledby="exampleModalCenterTitle"
						aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content"
								style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
								<div class="modal-header1">
								
								</div>
								<div class="modal-body">
									<b>Are you sure you want to update?</b>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm"
										data-dismiss="modal">NO</button>
									<button type="button" class="btn btn-info btn-sm"
										id="confirmassetmodelupd">YES</button>
								</div>
							</div>
						</div>
					</div>
          
          
    
        
          
          
          
          
          <!--  Create Asset Status -->
          
 <div class="modal fade" id="exampleModalScrollableStatus" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Asset Status</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
          
         
            
            <div class="col-md-6">
             <label for="state" class="form-label"><b>Create Asset Status:</b></label>
             <input type="text" class="form-control form-control-sm" id="assetstatus" placeholder="Asset Status">
             <div id="statusError" class="error-message" style="display: none;">Asset Status is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createassetstatus">Create</button>
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmassetstatus">YES</button>
                </div>
              </div>
            </div>
          </div>
              
             
        
          
      
      <!-- Update Assset Status -->
      
          
<div class="modal fade" id="exampleModalScrollableStatusUp" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update  Asset Status</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">
         
       
            
            <div class="col-md-6">
             <label for="State_2" class="form-label"><b>Asset Status:</b></label>
             <input type="text" class="form-control form-control-sm" id="assetstatusup" placeholder="Asset status">
             <div id="assetstatusupError" class="error-message" style="display: none;">Asset Status  is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger"data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="updstatus">Update</button>
</div>

              </div>
            </div>
          </div>
          
               <div class="modal fade" id="exampleModalCenter89" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 54%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                  
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
              
                
        
          
          
          

            

          
       
            
        
          
          
          
          
          <!-- Create Asset Owner -->
          
  <div class="modal fade" id="exampleModalScrollableLocation" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Asset  Owner</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
<form id="productForm">
    <div class="form-row">
          
            <div class="col-md-6">
             <label for="registertype" class="form-label"><b>Register Owner:</b></label>
             <input type="text" class="form-control form-control-sm" id="assetowned" placeholder="Asset Owner" >
             <div id="assetownedError" class="error-message" style="display: none;">Asset Owner is required</div>
           
            
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
    <button type="button" class="btn btn-sm btn-success" id="createassetowned">Create</button>
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmassetowned">YES</button>
                </div>
              </div>
            </div>
          </div>
              
             
          
          
          
          
<div class="modal fade" id="exampleModalScrollableassetownedbyup" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Asset Owner</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
          <div class="modal-body">
  <form>
    <div class="form-row">
      <div class="col-md-6">
        <label for="registertype1" class="form-label"><b>Asset Owner:</b></label>
        <input type="text" class="form-control form-control-sm" id="assetOwnerupt" placeholder="Asset Owner">
        <div id="assetownerupdateError" class="error-message" style="display: none;">Asset Owner is required</div>
      </div>
    </div>
  </form>
</div>
          

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="assetownedup">Update</button>
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
              
          
     
              
              
              
              
              
              
              
              
        <div class="modal fade" id="exampleModalScrollableMaker" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Asset Maker</b></h5>
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
             <label for="selecttype" class="form-label"><b>Asset Maker:</b></label>
             <input type="text" class="form-control form-control-sm" id="assetmaker" placeholder="Select Type">
             <div id="assetmakerError" class="error-message" style="display: none;">Asset Maker is required</div>
            </div>
         
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="createassetmaker">Create</button>
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
                    <button type="button" class="btn btn-info btn-sm" id="confirmassetmaker">YES</button>
                </div>
              </div>
            </div>
          </div>
              
            
       
          
          
          
          
          
<div class="modal fade" id="exampleModalScrollableSelectUp" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 500px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Asset Maker</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">                              
            <div class="col-md-6">
             <label for="selecttype1" class="form-label"><b>Asset Maker:</b></label>
             <input type="text" class="form-control form-control-sm" id="selecttype1" placeholder="Select Type">
             <div id="selecttype1Error" class="error-message" style="display: none;">Asset Maker  is required</div>
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
                <div class="modal-body text-center">
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
    <div class="modal-content" style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">
      
      <div class="modal-header1"></div>

      <div class="modal-body text-center">
        <b id="errorMessageupcon" style="color:red; font-size:16px;"></b>
      </div>

      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-secondary btn-sm" id="modalokk" data-dismiss="modal">OK</button>
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
  
<script src="vendor/datatables/jquery.dataTables.min.js"></script>
      <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
    <script src="js/config.js?v=<%=jsVersion%>"></script>
   
   
   
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
 
 
  
    <script src="js/AmsMasterRegister.js?v=<%=jsVersion%>"></script>
      <script src="js/logout.js?v=<%=jsVersion%>"></script>
  <script src="js/username.js?v=<%=jsVersion%>"></script>
  <script src="js/factoryid.js?v=<%=jsVersion%>"></script>
   	  <script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
   	  <script src="js/createdby.js?v=<%=jsVersion%>"></script>
   	   <script src="js/Sessionfilter.js?v=<%=jsVersion%>"></script>
   	   <script type="js/Factory.js?v=<%=jsVersion%>"></script>
   
   	     	  <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
   	    <script src="js/permissions.js?v=<%=jsVersion%>"></script>
<script>
function toggleTables() {
    // Hide all tables first
    const tables = ['AssetTypeTable', 'AssetModelTable', 'AssetStatusTable', 'AssetOwnedByTable', 'AssetMakerTable'];
    tables.forEach(tableId => {
        document.getElementById(tableId).style.display = 'none';
    });

    // Show selected table + fetch respective data
    if (document.getElementById('AssetTypeRadio').checked) {
        document.getElementById('AssetTypeTable').style.display = 'block';
        fetchAssetTypes(); // â Fetch Asset Types
    } 
    else if (document.getElementById('AssetModelRadio').checked) {
        document.getElementById('AssetModelTable').style.display = 'block';
        fetchAssetModels(); // â Fetch Asset Models
    } 
    else if (document.getElementById('AssetStatusRadio').checked) {
        document.getElementById('AssetStatusTable').style.display = 'block';
        fetchAssetStatus(); // (if exists)
    } 
    else if (document.getElementById('AssetOwnedByRadio').checked) {
        document.getElementById('AssetOwnedByTable').style.display = 'block';
        fetchAssetOwnedBy(); // (if exists)
    } 
    else if (document.getElementById('AssetMakerRadio').checked) {
        document.getElementById('AssetMakerTable').style.display = 'block';
        fetchAssetMakers(); // (if exists)
    }
}

    // Run toggleTables on initial page load
 </script>
   
    
    <script>
    $(document).ready(function () {

    	$('#assetTableID').DataTable({
    	    dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
    	    buttons: [
    	        {
    	            extend: 'excelHtml5',
    	            text: 'Export to Excel',
    	            className: 'btn btn-primary btn-sm',
    	            filename: 'Asset_Type_Report',
    	            title: 'Asset Type Report',   // Excel Heading
    	            customize: function (xlsx) {
    	                var sheet = xlsx.xl.worksheets['sheet1.xml'];
    	                var sheetData = sheet.getElementsByTagName('sheetData')[0];

    	                // Create custom heading row
    	                var heading =
    	                    '<row r="1">' +
    	                    '   <c t="inlineStr" r="A1">' +
    	                    '       <is><t><b>Asset Type Report</b></t></is>' +
    	                    '   </c>' +
    	                    '</row>';

    	                // Insert heading at top
    	                sheetData.innerHTML = heading + sheetData.innerHTML;
    	            }
    	        }
    	    ],
    	    paging: true,        // â Enable pagination
    	    pageLength: 10,      // Optional: number of rows per page
    	    info: true,          // Show table info
    	    searching: true,
    	    ordering: true
    	});
    	$('#tableID1').DataTable({
    	    dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
    	    buttons: [
    	        {
    	            extend: 'excelHtml5',
    	            text: 'Export to Excel',
    	            className: 'btn btn-primary btn-sm',
    	            filename: 'Asset_Model_Report',
    	            title: 'Asset Model Report',  // Excel Heading
    	            customize: function (xlsx) {
    	                var sheet = xlsx.xl.worksheets['sheet1.xml'];
    	                var sheetData = sheet.getElementsByTagName('sheetData')[0];

    	                // Create custom heading row
    	                var heading =
    	                    '<row r="1">' +
    	                    '   <c t="inlineStr" r="A1">' +
    	                    '       <is><t><b>Asset Model Report</b></t></is>' +
    	                    '   </c>' +
    	                    '</row>';

    	                // Insert heading at top
    	                sheetData.innerHTML = heading + sheetData.innerHTML;
    	            }
    	        }
    	    ],
    	    paging: true,           // Enable pagination
    	    pageLength: 10,         // Rows per page
    	    info: true,             // Show table info below
    	    searching: true,
    	    ordering: true
    	});
    	$('#statetableID').DataTable({
    	    dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
    	    buttons: [
    	      {
    	        extend: 'excelHtml5',
    	        text: 'Export to Excel',
    	        className: 'btn btn-primary btn-sm',
    	        filename: 'Asset_Status_Report',
    	        title: 'Asset Status Report', // Optional, used by Excel
    	        customize: function (xlsx) {
    	          var sheet = xlsx.xl.worksheets['sheet1.xml'];
    	          var sheetData = sheet.getElementsByTagName('sheetData')[0];

    	          // Create custom heading row
    	          var heading =
    	            '<row r="1">' +
    	            '   <c t="inlineStr" r="A1">' +
    	            '       <is><t><b>Asset Status Report</b></t></is>' +
    	            '   </c>' +
    	            '</row>';

    	          // Insert heading at top
    	          sheetData.innerHTML = heading + sheetData.innerHTML;
    	        }
    	      }
    	    ],
    	    paging: true,
    	    pageLength: 10,
    	    info: true,
    	    searching: true,
    	    ordering: true
    	});

    	$('#locationTableID').DataTable({
    	    dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
    	    buttons: [
    	      {
    	        extend: 'excelHtml5',
    	        text: 'Export to Excel',
    	        className: 'btn btn-primary btn-sm',
    	        filename: 'Asset_OwnedBy_Report',
    	        title: 'Asset OwnedBy Report', // Optional title
    	        customize: function (xlsx) {
    	          var sheet = xlsx.xl.worksheets['sheet1.xml'];
    	          var sheetData = sheet.getElementsByTagName('sheetData')[0];

    	          // Create custom heading row
    	          var heading =
    	            '<row r="1">' +
    	            '   <c t="inlineStr" r="A1">' +
    	            '       <is><t><b>Asset OwnedBy Report</b></t></is>' +
    	            '   </c>' +
    	            '</row>';

    	          // Insert heading at top
    	          sheetData.innerHTML = heading + sheetData.innerHTML;
    	        }
    	      }
    	    ],
    	    paging: true,
    	    pageLength: 10,
    	    info: true,
    	    searching: true,
    	    ordering: true
    	});
    	$('#companyTableID').DataTable({
    	    dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
    	    buttons: [
    	      {
    	        extend: 'excelHtml5',
    	        text: 'Export to Excel',
    	        className: 'btn btn-primary btn-sm',
    	        filename: 'Asset_Maker_Report',
    	        title: 'Asset Maker Report', // Optional Excel title
    	        customize: function (xlsx) {
    	          var sheet = xlsx.xl.worksheets['sheet1.xml'];
    	          var sheetData = sheet.getElementsByTagName('sheetData')[0];

    	          // Create custom heading row
    	          var heading =
    	            '<row r="1">' +
    	            '   <c t="inlineStr" r="A1">' +
    	            '       <is><t><b>Asset Maker Report</b></t></is>' +
    	            '   </c>' +
    	            '</row>';

    	          // Insert heading at top
    	          sheetData.innerHTML = heading + sheetData.innerHTML;
    	        }
    	      }
    	    ],
    	    paging: true,
    	    pageLength: 10,
    	    info: true,
    	    searching: true,
    	    ordering: true
    	});



    	});


   window.onload = toggleTables;
    
  
    
    window.onload = function () {
    	fetchAssetTypes();
    };

    
    
    </script>

















</body>

</html>