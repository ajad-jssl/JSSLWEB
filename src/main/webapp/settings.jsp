<%@page import="com.JSSL2024.property.PropertyLink"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSSL</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.5.0/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">
     <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
     <script src="js/sidebar.js"></script>
    <script>
  //On page load, fetch user permissions from sessionStorage and update sidebar
    $(document).ready(function() {
      const userPermissions = JSON.parse(sessionStorage.getItem("userPermissions"));
      if (userPermissions) {
    	  updateSidebarVisibility(userPermissions);
          restrictPageAccess(userPermissions);
      }
    });
    const user_id = sessionStorage.getItem('user_id');
    console.log(user_id);
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>
    <style>
    /* Card Header Styling */
    .card-header {
        background-color: #f8f9fc;
        border-bottom: 1px solid #e3e6f0;
        padding: 0.75rem 1rem;
        font-size: 1.1rem;
        font-weight: bold;
        color: #4e73df;
    }

    /* Create Button Styling */
    .card-header button {
        background-color: #4e73df;
        color: white;
        border: none;
        padding: 0.375rem 0.75rem;
        font-size: 0.9rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .card-header button:hover {
        background-color: #3c6cd7;
    }

    /* Table Responsive Container with Border */
    .table-responsive {
        margin-top: 20px;
        max-width: 2000px; /* Set a max width for the table container */
        margin-left: auto;
        margin-right: auto;
        border: 2px solid #ddd; /* Add border */
        border-radius: 0.375rem; /* Optional: rounded corners */
        padding: 1rem;
    }

    /* Table Styling */
    .table {
        width: 100%;
        border-collapse: collapse;
    }

    .table th, .table td {
        padding: 8px 10px; /* Reduced padding for smaller width */
        text-align: left;
        font-size: 0.9rem; /* Smaller font size */
    }

    .table th {
        background-color: #f3f6f9;
        color: #4e73df;
        font-weight: 600;
    }

    .table td {
        background-color: #ffffff;
        color: black;
    }

    .table tr:hover {
        background-color: #f1f1f1;
        cursor: pointer;
    }

    /* Hidden ID Column */
    .table th:nth-child(4), .table td:nth-child(4) {
        display: none;
    }

    /* Modal Scroll Button */
    #modalScroll {
        background-color: #28a745;
        color: white;
        font-size: 0.9rem;
        padding: 0.375rem 0.75rem;
        border-radius: 0.375rem;
        border: none;
        transition: background-color 0.3s ease;
    }

    #modalScroll:hover {
        background-color: #218838;
    }
    .error-message {
        color: red;
        display: none;
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
    /* Dropdown Button Styling */
#dropdownMenuButton, 
#customerDropdown, 
#vanDropdown, 
#routeDropdown, 
#agenDropdown, 
#proDropdown, 
#outDropdown {
    background-color: white;
    color: inherit;
    box-shadow: none;
    text-align: left; 
}

#dropdownMenuButton:hover,
#dropdownMenuButton:focus,
#dropdownMenuButton:active,
#customerDropdown:hover,
#customerDropdown:focus,
#customerDropdown:active,
#vanDropdown:hover,
#vanDropdown:focus,
#vanDropdown:active,
#routeDropdown:hover,
#routeDropdown:focus,
#routeDropdown:active,
#agenDropdown:hover,
#agenDropdown:focus,
#agenDropdown:active,
#proDropdown:hover,
#proDropdown:focus,
#proDropdown:active,
#outDropdown:hover,
#outDropdown:focus,
#outDropdown:active {
    background-color: white;
    box-shadow: none;
}

.dropdown-menu {
    max-height: 300px; /* Adjusted for dropdowns */
    overflow-y: auto;
}

#agencyCheckboxes .dropdown-item, 
#customer .dropdown-item, 
#van .dropdown-item, 
#route .dropdown-item, 
#agen .dropdown-item, 
#pro .dropdown-item, 
#out .dropdown-item {
    display: flex;
    align-items: center;
    padding: 0.25rem 1.5rem; /* Adjust padding as needed */
}

#agencyCheckboxes input[type="checkbox"], 
#customer input[type="checkbox"], 
#van input[type="checkbox"], 
#route input[type="checkbox"], 
#agen input[type="checkbox"], 
#pro input[type="checkbox"], 
#out input[type="checkbox"] {
    margin-right: 0.5rem; /* Adjust margin as needed */
}

#agencyCheckboxes label,
#customer label,
#van label,
#route label,
#agen label,
#pro label,
#out label {
    margin: 0;
    white-space: nowrap;
}
/* Modal styling */
.modal-dialog.modal-dialog-scrollable {
    max-width: 1000px;
    max-height: 80vh; /* Adjust for better scrolling */
    width: 90%; /* Make modal responsive */
}

/* Dropdown button */
#vanDropdown, #routeDropdown {
    cursor: pointer;
    text-align: left;
}

/* Dropdown menu styling */
.dropdown-menu {
    max-height: 300px;
    overflow-y: auto;
    padding: 5px 10px; /* Better spacing */
}

#actionsContainer {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%; /* Ensures it doesn’t overflow */
    width: auto; /* Expands based on content */
    min-width: 300px; /* Adjust this if needed */
}
/* Ensure each checkbox and label are inline */
#actionsContainer label {
    display: inline-block;
    margin-right: 10px;
    align-items: center;
}


/* Small button styling */
.btn-sm {
    padding: 5px 10px;
    font-size: 14px;
}

/* Modal close button (X) */
.white-button {
    color: white;
}

</style>
  <!--   <script type="text/javascript">
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
    <!-- Bootstrap CSS -->
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
     <script>
    document.addEventListener("DOMContentLoaded", function() {
        window.onpopstate = function(event) {
        	console.log("back pressed.");
            window.location.href = "LandingPage.jsp";
        };
        window.history.replaceState(null, document.title, window.location.href);
    });
	</script>
</head>

<body onload="fetchUserRole();">




<nav class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top" style="background-color: #37499A; display: flex; align-items: center; justify-content: space-between;">
 <!-- Back Arrow Icon -->
  <a href="Landingpage.jsp" class="text-white ml-3" style="text-decoration: none; font-size: 24px;">
    <i class="fas fa-arrow-left"></i>
  </a>
  <!-- Left toggle button -->
  <!-- <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
    
  </button> -->
<!-- Header Title -->
 <!--  <div style="display:flex; width:100%;justify-content:center;">
  <h1 class="navbar-brand text-white" style="font-family: sans; font-size: 40px; font-weight: bold;margin-left:60px;">
    JSSL
  </h1>
  </div> -->
  <!-- Right settings and logout menu -->
<ul class="navbar-nav ml-auto">
 <div class="dropdown-checkbox" style="position: relative; display: none;">
                    <button class="dropdown-toggle" style="
                        background-color: white; 
                        color: black; 
                        border: none; 
                        padding: 10px 20px; 
                        border-radius: 5px; 
                        font-size: 14px; 
                        cursor: pointer; 
                        margin-top: 14px;
                        transition: background-color 0.3s ease;
                    ">
                        Select Factory
                    </button>
                    <div class="dropdown-menu" style="
                        display: none; 
                        position: absolute; 
                        top: 100%; 
                        left: 0; 
                        border: 1px solid #ccc; 
                        background: #fff; 
                        z-index: 1000; 
                        padding: 10px; 
                        width: 200px; 
                        max-height: 200px; 
                        overflow-y: auto;
                    ">
                        <!-- Factory items will be dynamically added here -->
                    </div>
                </div>


    <!-- Username with Icon -->
<!--     <li class="nav-item d-flex align-items-center">
        <i class="fas fa-user text-white mr-2"></i> User icon
        <span id="usernameDisplay" class="text-white small">Username</span>
    </li> -->
    
    <!-- Divider -->
    <div class="topbar-divider d-none d-sm-block"></div>
    
    <!-- Settings Icon -->
    <li class="nav-item">
        <a class="nav-link" href="settings.jsp">
            <i class="fas fa-cog text-white fa-lg"></i> <!-- Settings icon -->
        </a>
    </li>
    
    <!-- Settings Dropdown -->
    <li class="nav-item dropdown no-arrow">
        <a class="nav-link dropdown-toggle" href="#" id="userDropdown123" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
           <i class="fas fa-user text-white mr-2"></i> <!-- Settings icon -->
           <span class="ml-2 d-none d-lg-inline text-white small" id="usernameDisplay">Username</span>
        </a>
        <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" onclick="logoutUser(event)" style="cursor:pointer;">
                <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                Logout
            </a>
        </div>
    </li>
</ul>
</nav>


<!-- Card Container -->
    <div class="container mt-4">
    <!-- Tab Navigation -->
    <ul class="nav nav-tabs" id="myTabs">
        <li class="nav-item">
            <a class="nav-link active" id="role-tab" data-bs-toggle="tab" href="#roleSection">Role</a>
        </li>
        <li class="nav-item" onclick="onDeliveredOrderTabClickfac()">
            <a class="nav-link" id="factory-tab" data-bs-toggle="tab" href="#factorySection">Factory</a>
        </li>
        <li class="nav-item" onclick="onDeliveredOrderTabClick()">
            <a class="nav-link" id="user-tab" data-bs-toggle="tab" href="#userSection">User</a>
        </li>
        <li class="nav-item" onclick="onDeliveredOrderTabClick22()">
            <a class="nav-link" id="module-tab" data-bs-toggle="tab" href="#moduleSection">Module</a>
        </li>
        <li class="nav-item" onclick="onDeliveredOrderTabClicksubmo()">
            <a class="nav-link" id="submodule-tab" data-bs-toggle="tab" href="#submoduleSection">Sub Module</a>
        </li>
        <li class="nav-item" onclick="onDeliveredOrderTabClickassign()">
            <a class="nav-link" id="assigen-tab" data-bs-toggle="tab" href="#assignSection">Assign User Module</a>
        </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content mt-3">
        <!-- Role Tab -->
        <div class="tab-pane fade show active" id="roleSection">
            <div class="container-fluid" id="container-wrapper">
<div class="row mb-3">
    <div class="table-responsive p-3">
        <!-- Card Header -->
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" 
             style="background-color: #f8f9fc; margin-top: -9px; margin-left: -15px;">
            <button onclick="createFunction()" data-toggle="modal"
                    data-target="#exampleModalScrollable" id="#modalScroll"><i class="fas fa-plus"></i> Create</button>
        </div>
        
        <!-- Table -->
        <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
            <thead>
                <tr>
                    <th>Role Name</th>
                    <th>Role Code</th>
                    <th style="display: none;">ID</th> <!-- Hidden column for ID -->
                </tr>
            </thead>
            <tbody>
                <!-- Dynamic rows will be inserted here -->
            </tbody>
        </table>
    </div>
</div>
</div>
        </div>
        
        <div class="tab-pane fade" id="factorySection">
            <div class="container-fluid" id="container-wrapper">
<div class="row mb-3">
    <div class="table-responsive p-3">
        <!-- Card Header -->
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" 
             style="background-color: #f8f9fc; margin-top: -9px; margin-left: -15px;">
            <button onclick="createFunction()" data-toggle="modal"
                    data-target="#exampleModalScrollablefac" id="#modalScroll"><i class="fas fa-plus"></i> Create</button>
        </div>
        
        <!-- Table -->
        <table class="table table-striped table-bordered table-sm" id="tableIDfac" width="100%">
            </table>
    </div>
</div>
</div>
        </div>

        <!-- User Tab -->
        <div class="tab-pane fade" id="userSection">
            <div class="container-fluid" id="container-wrapper">
			<div class="row mb-3">
			    <div class="table-responsive p-3">
			        <!-- Card Header -->
			        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" 
			             style="background-color: #f8f9fc; margin-top: -9px; margin-left: -15px;">
			            <button onclick="createFunction()" data-toggle="modal"
			                    data-target="#exampleModalScrollable33" id="#modalScroll"><i class="fas fa-plus"></i> Create</button>
			        </div>
			        
			        <!-- Table -->
			        <table class="table table-striped table-bordered table-sm" id="userTable" width="100%">
			            <thead>
			                <tr>
			                    <th>User Name</th>
			                    <th>Role</th>
			                    <th style="display:none;">Id</th>
			                </tr>
			            </thead>
			            <tbody>
			                <!-- Dynamic rows will be inserted here -->
			            </tbody>
			        </table>
			    </div>
			</div>
			</div>
        </div>
        
        <div class="tab-pane fade" id="moduleSection">
            <div class="container-fluid" id="container-wrapper">
			<div class="row mb-3">
			    <div class="table-responsive p-3">
			        <!-- Card Header -->
			        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" 
			             style="background-color: #f8f9fc; margin-top: -9px; margin-left: -15px;">
			            <button onclick="createFunction()" data-toggle="modal"
			                    data-target="#exampleModalScrollableModule" id="#modalScroll"><i class="fas fa-plus"></i> Create</button>
			        </div>
			        
			        <!-- Table -->
			        <table class="table table-striped table-bordered table-sm" id="moduleTable" width="100%">
            </table>
			    </div>
			</div>
			</div>
        </div>
        <div class="tab-pane fade" id="submoduleSection">
            <div class="container-fluid" id="container-wrapper">
<div class="row mb-3">
    <div class="table-responsive p-3">
        <!-- Card Header -->
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" 
             style="background-color: #f8f9fc; margin-top: -9px; margin-left: -15px;">
            <button onclick="createFunction()" data-toggle="modal"
                    data-target="#exampleModalScrollablesubmo" id="#modalScroll"><i class="fas fa-plus"></i> Create</button>
        </div>
        
        <!-- Table -->
        <table class="table table-striped table-bordered table-sm" id="tableIDsub" width="100%">
            </table>
    </div>
</div>
</div>
        </div>
        <div class="tab-pane fade" id="assignSection">
            <div class="container-fluid" id="container-wrapper">
<div class="row mb-3">
    <div class="table-responsive p-3">
        <!-- Card Header -->
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" 
             style="background-color: #f8f9fc; margin-top: -9px; margin-left: -15px;">
            <button onclick="createFunction()" data-toggle="modal"
                    data-target="#exampleModalScrollableassign" id="#modalScroll"><i class="fas fa-plus"></i> Create</button>
        </div>
        
        <!-- Table -->
        <table class="table table-striped table-bordered table-sm" id="tableIDassign" width="100%">
            </table>
    </div>
</div>
</div>
        </div>
    </div>
</div>

<div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog"
     aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 800px;height: 28%;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Role Details</b></h5>
                <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="roleForm">
                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <label for="rolec"><b>Role Code:</b></label>
                            <input type="text" class="form-control form-control-sm" id="rolec" placeholder="Enter Role Code" autocomplete="off">
                            <div id="productCodeErrorcredit" class="error-message"></div>
                        </div>
                        <div class="form-group col-md-4">
                            <label for="roled"><b>Role Name:</b></label>
                            <input type="text" class="form-control form-control-sm" id="roled" placeholder="Enter Role Name" autocomplete="off">
                            <div id="productCodeErrorcredittyu" class="error-message"></div>
                        </div>
                    </div>
                    <!-- Submodule checkboxes -->
                    </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-sm btn-success" onclick="openModalAdd();">Create</button>
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
          
          <div class="modal fade" id="exampleModalScrollable33" tabindex="-1" role="dialog"
     aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 800px;height: 42%;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create User Details</b></h5>
                <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="roleForm">
                    <div class="form-row">
                       <div class="form-group col-md-4">
                            <label for="rolec"><b>Name:</b></label>
                            <input type="text" class="form-control form-control-sm" id="name1" placeholder="Enter name" autocomplete="off">
                            
                        </div>
                        <div class="form-group col-md-4">
                            <label for="rolec"><b>Username:</b></label>
                            <input type="text" class="form-control form-control-sm" id="uname" placeholder="Enter username" autocomplete="off">
                            <div id="productCodeErrorcreditUS" class="error-message"></div>
                        </div>
                        <div class="form-group col-md-4">
                            <label for="roled"><b>Password:</b></label>
                            <input type="password" class="form-control form-control-sm" id="pass" placeholder="Enter password" autocomplete="off">
                            <div id="productCodeErrorcredittyuUS" class="error-message"></div>
                        </div>
                        <div class="form-group col-md-4">
                            <label for="roled"><b>Mobile:</b></label>
                            <input type="text" class="form-control form-control-sm" id="mob" placeholder="Enter mobile" autocomplete="off">
                            
                        </div>
                        <div class="form-group col-md-4">
                            <label for="roled"><b>Email:</b></label>
                            <input type="text" class="form-control form-control-sm" id="email" placeholder="Enter email" autocomplete="off">
                            
                        </div>
                        <div class="form-group col-md-4">
						  <label for="role1"><b>Role:</b></label>
						  <select class="form-control form-control-sm" id="role1user">
						    </select>
						  <div id="productCodeErrorcredittyuaaUS" class="error-message"></div>
						</div>
						<div class="form-group col-md-4">
						  <label for="customerDropdown"><b>Factory:</b></label>
						  <div class="dropdown">
						    <button class="form-control form-control-sm" type="button" id="customerDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						      Select factory <i class="fas fa-chevron-down" style="float: right;"></i>
						    </button>
						    <div class="dropdown-menu" id="customer" aria-labelledby="customerDropdown" style="max-height: 300px; overflow-y: auto;">
						      <!-- Checkboxes will be dynamically populated here -->
						    </div>
						  </div>
						  <div id="productCodeErrorcredittyuaa88US" class="error-message"></div>
						</div>

                    </div>
                    <!-- Submodule checkboxes -->
                    </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-sm btn-success" onclick="openModalAdd1();">Create</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalCenter6611" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" onclick="addevent1()">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal fade" id="exampleModalScrollableModule" tabindex="-1" role="dialog"
     aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 600px;height: 28%;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Module Details</b></h5>
                <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="roleForm">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="rolec"><b>Module Name:</b></label>
                            <input type="text" class="form-control form-control-sm" id="rolecM" placeholder="Enter module name" autocomplete="off">
                            <div id="productCodeErrorcreditMO" class="error-message"></div>
                        </div>
                        </div>
                    <!-- Submodule checkboxes -->
                    </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-sm btn-success" onclick="openModalAddMO();">Create</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalCenter6611MO" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" onclick="addevent1MO()">YES</button>
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
          <div class="modal fade" id="exampleModalScrollablefac" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 800px;height: 28%;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Factory Master</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
    <div class="form-group col-md-8">
        <label for="stateGstNo"><b>Factory Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="taxname" placeholder="Enter Factory Name" autocomplete="off">
        <div id="productCodeErrorcreditAA" class="error-message"></div>
    </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success"
                   onclick="openModalAddfac();">Create</button>
</div>

              </div>
            </div>
          </div>
          <div class="modal fade" id="exampleModalCenter66fac" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" onclick="addeventfac()">YES</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal fade" id="exampleModalScrollablesubmo" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 800px;height: 38%;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Sub-Module</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="roleForm">
                    <div class="form-row">
                       <div class="form-group col-md-4">
						  <label for="role1"><b>Module Name:</b></label>
						  <select class="form-control form-control-sm" id="modid">
						    </select>
						  <div id="productCodeErrorcreditmodid" class="error-message"></div>
						</div>
						<div class="form-group col-md-4">
						  <label for="role1"><b>Sub-Module Name:</b></label>
						  <input type="text" class="form-control form-control-sm" id="submodid" placeholder="Enter sub-module name" autocomplete="off">
						  <div id="productCodeErrorcreditsubmodid" class="error-message"></div>
						</div>
						<div class="form-group col-md-4">
						  <label for="routeDropdown"><b>Actions</b></label>
							  <div class="dropdown">
							    <button class="form-control form-control-sm" type="button" id="proDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							      Select Actions <i class="fas fa-chevron-down" style="float: right;"></i>
							    </button>
							    <div class="dropdown-menu" id="pro" aria-labelledby="routeDropdown" style="max-height: 300px; overflow-y: auto;">
							      <!-- Checkboxes will be dynamically populated here -->
							    </div>
							  </div>
						  </div>

                    </div>
                    <!-- Submodule checkboxes -->
                    </form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success"
                   onclick="openModalAddsubmo();">Create</button>
</div>

              </div>
            </div>
          </div>
          <div class="modal fade" id="exampleModalCenter66facsubb" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" onclick="addeventsubid()">YES</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal fade" id="exampleModalScrollableassign" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1000px;height: 100%;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create user module</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="roleForm">
                    <div class="form-row">
                       <div class="form-group col-md-4">
						  <label for="role1"><b>Role:</b></label>
						  <select class="form-control form-control-sm" id="roleass">
						    </select>
						  <div id="productCodeErrorcreditmodidroleass" class="error-message"></div>
						</div>
						<div class="form-group col-md-4">
						  <label for="vanDropdown"><b>Module</b></label>
							  <div class="dropdown">
							    <button class="form-control form-control-sm" type="button" id="vanDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							      Select module <i class="fas fa-chevron-down" style="float: right;"></i>
							    </button>
							    <div class="dropdown-menu" id="van" aria-labelledby="vanDropdown" style="max-height: 300px; overflow-y: auto;">
							      <!-- Checkboxes will be dynamically populated here -->
							    </div>
							  </div>
						</div>
						<div class="form-group col-md-4">
						  <label for="vanDropdown"><b>Sub-Module</b></label>
							  <div class="dropdown">
							    <button class="form-control form-control-sm" type="button" id="routeDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							      Select Sub-Module <i class="fas fa-chevron-down" style="float: right;"></i>
							    </button>
							    <div class="dropdown-menu" id="route" aria-labelledby="routeDropdown" style="max-height: 300px; overflow-y: auto;">
							      <!-- Checkboxes will be dynamically populated here -->
							    </div>
							  </div>
						</div>
						<div class="form-group col-md-6">
						  <label for="routeDropdown"><b>Actions</b></label>
						     <div id="actionsContainer" class="d-flex flex-wrap"></div> 
							  </div>

                    </div>
                    <!-- Submodule checkboxes -->
                    </form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success"
                   onclick="openModalAddsubmoass();">Create</button>
</div>

              </div>
            </div>
          </div>
          <div class="modal fade" id="exampleModalCenter66facsubbass" tabindex="-1" role="dialog"
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
                    <button type="button" class="btn btn-info btn-sm" onclick="addeventsubidass()">YES</button>
                </div>
              </div>
            </div>
          </div>
<!-- Bootstrap Icons and JS -->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
  <script src="js/ruang-admin.min.js"></script>
  <script src="vendor/chart.js/Chart.min.js"></script>
  <script src="js/demo/chart-area-demo.js"></script> 
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="vendor/datatables/jquery.dataTables.min.js"></script>
      <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
<script src="js/username.js"></script>
<script src="js/logout.js"></script>
 <script src="js/config.js"></script>
  <script src="js/userrole.js"></script>
  <script src="js/role.js"></script>
    <script src="js/factoryid.js"></script>
    <script src="js/createdby.js"></script>
  <script src="js/usersettings.js"></script>
   <script src="js/Sessionfilter.js"></script>
  <script>
// Track user activity and logout after 2 minutes (120000 ms)
let inactivityTime = function () {
    let timeout;

    // Reset timer on any user activity
    function resetTimer() {
        clearTimeout(timeout);
        timeout = setTimeout(triggerLogout, 900000); // 15 minutes
    }

    // Event listener for activity
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;
    document.onclick = resetTimer;
    document.onscroll = resetTimer;

    function triggerLogout() {
        // Create a dummy event to pass to logoutUser
        let dummyEvent = new Event('logout');
        logoutUser(dummyEvent);
    }
};

inactivityTime();

function logoutUser(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }

    var user_id = sessionStorage.getItem('user_id'); 
    if (!user_id) {
        alert("User ID not found. Please login first.");
        return;
    }

    if (typeof baseUrl === 'undefined' || !baseUrl) {
        console.error("baseUrl is not defined or is empty.");
        return;
    }

    const url = baseUrl.endsWith('/') ? baseUrl + 'jssl/user/userlogout' : baseUrl + '/jssl/user/userlogout';

    $.ajax({
        url: url,
        type: 'POST',
        data: $.param({ user_id: user_id }),
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        cache: false,
        success: function(data) {
            console.log("Server response:", data);
            
            if (data.status === "yes" && data.message === "Logout Success") {
                sessionStorage.removeItem("user_id");
                sessionStorage.removeItem("username");
                sessionStorage.removeItem("isLoggedIn");
                localStorage.removeItem("selectedFactoryId");
                window.location = "newlogin.jsp";
            } else {
                console.error("Logout failed.");
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX error:", error);
            console.error("Response text:", xhr.responseText);
            alert("Error: " + (xhr.responseText || "An error occurred."));
        }
    });
}
</script>
</body>
</html>

