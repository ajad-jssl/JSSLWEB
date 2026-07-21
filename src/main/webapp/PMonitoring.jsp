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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="img/logo/download.png" rel="icon">
  <title>JSSL</title>
   <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css" />
   <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
   <link href="css/ruang-admin.min.css" rel="stylesheet" />
   <link href="vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">
      <!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css" /> -->
   <link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
   <link rel="stylesheet" href="css/main.css">
   <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
   <link href="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />
   <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script> 
   <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
   <script src="js/sidebar.js"></script>
   <!-- Include jQuery (required for Select2) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Include Select2 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />
    <!-- Include Select2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>
  
  <style>
 .error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    display: none; /* Hidden by default */
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
.popup1 {
    position: fixed;
    top: 20px;
    right: -3%;
    transform: translateX(-50%);
    background-color: red;
    color: white;
    padding: px;
    border-radius: 5px;
    z-index: 9999;
}
div.dt-buttons>.dt-button:first-child, div.dt-buttons>div.dt-button-split .dt-button:first-child {
    margin-left: 0;
    background-color: #336699 !important;
    color: white;
    padding: 4px 10px;
  }  
  
  .highlight {
    background-color: #b0c4de; /* Light blue background for highlight */
}
  .hide-column {
    display: none;
}  
/* Optional: Style the link to make it look like a clickable element */
.mark-link {
    color: #007bff; /* Blue color for links */
    text-decoration: none; /* Remove underline */
}

.mark-link:hover {
    text-decoration: underline; /* Optional: underline when hovering over the link */
}
  
.highlight {
    background-color: yellow; /* Highlight color for the selected link */
}


button {
    margin: 10px 0;
}

/* Basic styling for the popup */
.popup-error {
    display: none; /* Initially hidden */
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent background */
    width: 300px;
    padding: 20px;
    border-radius: 5px;
    z-index: 9999;
    opacity: 0; /* Initially hidden */
    transition: opacity 0.5s ease-in-out;
}

/* Popup content */
.popup-content {
    background-color: #f8d7da; /* Light red background */
    color: #721c24; /* Dark red text */
    padding: 20px;
    border-radius: 5px;
    border: 1px solid #f5c6cb; /* Light red border */
    position: relative;
}

/* Close button for the popup */
.popup-close {
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 20px;
    color: #721c24;
    cursor: pointer;
}

/* Animation for fading in the popup */
@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

/* Apply fade-in animation to the popup */
.popup-error.show {
    display: block;
    animation: fadeIn 0.5s ease-in-out forwards;
}

/* Optional: Adding fade-out animation for the close button */
@keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
}

.popup-error.fade-out {
    animation: fadeOut 0.5s ease-in-out forwards;
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

<body onload="fetchUserList();">
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
        <!-- Topbar -->
        <!-- Container Fluid-->
        <div class="container-fluid" id="container-wrapper">
          <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">Piece Monitoring Entry</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="SubConDashboard.jsp">Home</a></li>
             <li class="breadcrumb-item active" aria-current="page">Piece Monitoring</li>
              
            </ol>
          </div>
          <div class="row mb-3">
<div class="col-lg-12">
  <div class="card mb-4">
    <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
        <button data-toggle="modal" data-target="#exampleModalScrollable123" id="modalScroll1">
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
  <!-- Modal 1: Create QS Package Details -->
            
      <!-- Form Container with Outline and Title -->

    <div class="modal fade" id="exampleModalScrollable123" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Piece Monitoring Selection</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="scrapSaleOrderForm">
                    <!-- Sale Order Details -->
     <div class="form-row">
      <div class="form-group col-md-4">
        <label for="contract"><b>Contract:</b></label>
        <select class="form-control form-control-sm" id="contract">      
        </select>
      <div id="productCodeError18" class="error-message"></div>
     </div>
     <div class="form-group col-md-4">
        <label for="load"><b>Load:</b></label>
         <select class="form-control form-control-sm" id="load">
        </select>
     </div>
     <div class="form-group col-md-4">
        <label for="weight" class="form-label">Weight:</label>
        <input type="text" class="form-control form-control-sm" id="weight" placeholder="Weight">
     </div>
   </div>


<!-- Dynamic Fields Container (Initially Hidden) -->
<div id="container1" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Piece Monitoring Entry</h5>
        
        <div class="form-row dynamic-row">
                  <form>      
 <table class="table table-striped table-bordered table-sm" id="TableID" width="100%">
          <thead>
  <tr>               
  			    <th>Qty</th>
                <th>Assembled</th>
                <th>Welded</th>
                <th>Treated</th>
                <th>Mark</th>
                <th>Main Section</th>
                <th>Dims</th>              
  </tr>
  
  <tr>
              <!--   <td>Total</td> -->
              </tr>
</thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <button class="btn btn-sm btn-success" id="Mark">
                   <i></i> Mark
                  </button>
                </td>
                <td></td>                              
              </tr>             
            </tbody>               
          </table>             
      </form>
        </div>
    </div> 
</div>

<div id="container2" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Stage Details</h5>
        
          <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-6">
                  <label for="stage"><b>Stage :</b></label>
                  <select id="stage">
                  <option value="1">Assembled</option>
                  <option value="2">Welded</option>
                  <option value="3">Treated</option>                               
                  </select>            
            </div>
            <div class="form-group col-md-6" >
                <label for="username"><b>Qty :</b></label>
                <input type="text" id="qty"> 
            </div>           
        </div>
        
                <div class="modal-footer">
                 <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                 <button type="button" class="btn btn-primary" id="submit">Create</button>
                </div> 
                
                <div id="popup-error" class="popup-error">
                <div class="popup-content">
                <span class="popup-close" id="popup-close">&times;</span>
                <p id="popup-message"></p>
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


              <script src="http://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>         
              <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
              <script src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
             <script>
                 $('#Mark').on('click', function(){
                	 $('#container2').toggle();
                 });
             </script>    
           
     <script>
        $(document).ready(function() {
            // Initialize Select2 for the dropdown
            $('#contract').select2();
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
    <script src="js/Piece.js?v=<%=ts%>"></script> 
    <script src="js/config.js"></script>
    <script src="js/logout.js"></script>
    <script src="js/username.js"></script>
  
    <script src="js/createdby.js"></script>
 	<script src="js/modifiedby.js"></script>
 	 <script src="js/Sessionfilter.js"></script>
 	<script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
    "Insert": "modalScroll1",         // Create button
  /*   "Edit": "updateitems"     // Update button */
  };
</script>
<script src="js/permissions.js"></script>
<script>
 	<!-- <script src="js/factoryid.js"></script> -->


</body>
</html>