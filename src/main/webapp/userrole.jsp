<%@page import="com.JSSL2024.property.PropertyLink"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
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
      <!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css" /> -->
      <link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
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
</head>

<body onload="fetchUserRole();">
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
            <h1 class="h3 mb-0 text-gray-800">User Role List</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="Dashboard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="newmaster.jsp">Master</a></li>
              <li class="breadcrumb-item"><a href="newmaster.jsp?tab=organisation">Organization</a></li>
              <li class="breadcrumb-item active" aria-current="page">User Role</li>
              
            </ol>
          </div>
<div class="row mb-3">
    <div class="table-responsive p-3">
        <!-- Card Header -->
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" 
             style="background-color: #f8f9fc; margin-top: -9px; margin-left: -15px;">
            <button data-toggle="modal" data-target="#exampleModalScrollable" id="modalScroll">
                <i class="fas fa-plus"></i> Create
            </button>
        </div>
        
        <!-- Table -->
        <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
            <thead>
                <tr>
                    <th>Role Name</th>
                    <th>Role Code</th>
                    <th>Role Description</th>
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
  </div>

<!-- Add event -->
<div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog"
     aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1000px;" role="document">
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
                            <input type="text" class="form-control form-control-sm" id="rolec" placeholder="Enter Role Code">
                            <span id="roleCodeError" class="text-danger" style="display: none;">Please Enter Role Code</span>
                        </div>
                        <div class="form-group col-md-4">
                            <label for="roled"><b>Role Description:</b></label>
                            <input type="text" class="form-control form-control-sm" id="roled" placeholder="Enter Role Description">
                            <span id="roleDescriptionError" class="text-danger" style="display: none;">Please Enter Role Description</span>
                        </div>
                    </div>
                    <!-- Submodule checkboxes -->
                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <label><b>Invoice Module</b></label>
                            <input type="checkbox" id="invoice_module">
                        </div>
                        <div class="form-group col-md-4">
                            <label><b>QS Submodule</b></label>
                            <input type="checkbox" id="qs_submodule">
                        </div>
                        <div class="form-group col-md-4">
                            <label><b>Invoice Submodule</b></label>
                            <input type="checkbox" id="invoice_submodule">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <label><b>Masters Submodule</b></label>
                            <input type="checkbox" id="masters_submodule">
                        </div>
                        <div class="form-group col-md-4">
                            <label><b>Scrap Submodule</b></label>
                            <input type="checkbox" id="scrap_submodule">
                        </div>
                        <div class="form-group col-md-4">
                            <label><b>Reports Submodule</b></label>
                            <input type="checkbox" id="reports_submodule">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-sm btn-warning" id="resetButton" onclick="resetForm();">Reset</button>
                <button type="button" class="btn btn-sm btn-success" onclick="addevent();">Create</button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 400px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Invoice Details</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
      <div class="form-group col-md-10">
        <label for="inputName11"><b>:</b></label>
        <input type="text" class="form-control form-control-sm"  id="inputName11" placeholder="Enter ">
        <div id="productCodeErrorcredit" class="error-message"></div>
      </div>
      </div>
      <div class="form-row">
      <div class="form-group col-md-10">
        <label for="inputName11"><b>:</b></label>
        <input type="text" class="form-control form-control-sm"  id="inputName11" placeholder="Enter ">
        <div id="productCodeErrorcredit" class="error-message"></div>
      </div>
      </div>
      <div class="form-row">
      <div class="form-group col-md-10">
        <label for="inputName11"><b>:</b></label>
        <input type="text" class="form-control form-control-sm"  id="inputName11" placeholder="Enter ">
        <div id="productCodeErrorcredit" class="error-message"></div>
      </div>
      </div>
      </form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-warning" id="resetButton">Reset</button>
    <button type="button" class="btn btn-sm btn-success" onclick="openModalAdd();">Create</button>
</div>

              </div>
            </div>
          </div>
    
  
  
 <!-- view gst -->
 <div class="modal fade" id="exampleModalScrollableedit" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1000px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Gst Details</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm12">
 <div class="form-row">
    <div class="form-group col-md-4">
        <label for="exampleage"><b>Gst Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="exampleage" placeholder="Enter Gst Number">
        <div id="productCodeErroredit1" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="agename"><b>SAP BU Code:</b></label>
        <input type="text" class="form-control form-control-sm" id="agename" placeholder="Enter SAP Code">
        <div id="productCodeErroredit2" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="conper"><b>State Code:</b></label>
        <input type="text" class="form-control form-control-sm" id="conper" placeholder="Enter State Code">
        <div id="productCodeErroredit3" class="error-message"></div>
    </div>
    <div class="form-group col-md-4" style="display: none;">
        <label for="agid"><b>Gu id:</b></label>
        <input type="text" class="form-control form-control-sm" id="agid" placeholder="Enter Address">
    </div>
    <div class="form-group col-md-4" style="display: none;">
        <label for="agid"><b>Modified By:</b></label>
        <input type="text" class="form-control form-control-sm" id="modi" placeholder="Enter Address">
    </div>
</div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-warning" onclick="resetForm()">Reset</button>
    <button type="button" class="btn btn-sm btn-success"
                   onclick="updategst();">Update</button>
</div>

              </div>
            </div>
          </div>
          <!-- end update agency -->
          <div class="modal fade" id="exampleModalCenterupdate" tabindex="-1" role="dialog"
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
                  <b>Are You Sure You Want To Update?</b>
                </div>
                <div class="modal-footer">
                   <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button>
                    <button type="button" class="btn btn-info btn-sm" onclick="editevent()">YES</button>
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
  <script src="js/userrole.js"></script>
     <script src="js/logout.js"></script>
   	  <script src="js/username.js"></script>
   	   <script src="js/Sessionfilter.js"></script>
  <!-- Page level custom scripts -->
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