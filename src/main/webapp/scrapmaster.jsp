<%@page import="com.JSSL2024.property.PropertyLink"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
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
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-xxx" crossorigin="anonymous" />
  <link rel="stylesheet" href="css/main.css">
     <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
     <script src="js/sidebar.js"></script>
    <script>
    const user_id = sessionStorage.getItem('user_id');
    console.log(user_id);
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>
  <style>
  /* Style for the card container */
.card {
    position: relative; /* Add position relative for pseudo-element positioning */
    border: 1px solid #d1d3e2;
    border-radius: 8px;
    transition: box-shadow 0.3s ease;
}

/* Add a subtle box shadow on hover */
.card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Style for the vertical line */
.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px; /* Adjust the width of the line */
    height: 100%; /* Full height of the card */
    background-color: #3498db; /* Color of the line */
    border-top-left-radius: 8px; /* Match the card border radius */
    border-bottom-left-radius: 8px; /* Match the card border radius */
}

/* Style for the card body */
.card-body {
    padding: 20px;
}

/* Style for the product category */
.text-uppercase {
    color: #6c757d;
    font-size: 12px;
}

/* Style for the product quantity */
.h5 {
    color: #1a1a1a;
    font-size: 24px;
}

/* Style for the shopping bag icon */
.fa-shopping-bag {
    color: #975454;
}

/* Optional: Adjust the color of the icon on hover */
.card:hover .fa-shopping-bag {
    color: #7d3737;
}
  
  </style>

</head>
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
<body onload="fetchEmployeeList();">
  <div id="wrapper">
    <!-- Sidebar -->
    <ul class="navbar-nav sidebar sidebar-light accordion" id="accordionSidebar">
      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="Dashboard.jsp" style="background-color: white;">
        <div class="sidebar-brand-icon">
          <img src="img/logo/download.png" style="max-height: 4.3rem;">
        </div>
        <div class="sidebar-brand-text mx-3"></div>
      </a>
      <hr class="sidebar-divider my-0">
      <li class="nav-item ">
        <a class="nav-link" href="Dashboard.jsp">
          <i class="fas fa-home"></i>
          <span>Dashboard</span></a>
      </li>
      <hr class="sidebar-divider">
      <div class="sidebar-heading">
        Features
      </div>
      
      <li class="nav-item">
        <a class="nav-link" href="QApackage.jsp">
        <i class="fas fa-clipboard-check" style="color: #007bff;"></i>
          <span>QA Package</span></a>
      </li>
    
     <li class="nav-item">
        <a class="nav-link" href="invoicesidemenu.jsp">
         <i class="far fa-file-alt"></i>
          <span>Invoice</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="">
         <i class="fas fa-recycle" style="color: #dc3545;"></i>
          <span>Scrap</span></a>
      </li>
        
       <li class="nav-item">
        <a class="nav-link" href="">
          <i class="fas fa-chart-bar"></i>
          <span>Reports</span>
        </a>
      </li>
     <li class="nav-item active">
        <a class="nav-link" href="master.jsp">
          <i class="fas fa-user-cog"></i>
          <span>Masters</span>
        </a>
      </li>
    
    </ul>
    <!-- Sidebar -->
    <div id="content-wrapper" class="d-flex flex-column">
      <div id="content">
        <!-- TopBar -->
        <nav class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top">
          <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
            <i class="fa fa-bars"></i>
          </button>
          <ul class="navbar-nav ml-auto">
              <div class="topbar-divider d-none d-sm-block"></div>
            <li class="nav-item dropdown no-arrow">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown123" role="button" data-toggle="dropdown"
   aria-haspopup="true" aria-expanded="false">
   <i class="fas fa-cog"></i> <!-- Font Awesome settings icon -->
   <span class="ml-2 d-none d-lg-inline text-white small">Settings</span>
</a>

              <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                <!-- <a class="dropdown-item" href="#">
                  <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                  Profile
                </a> -->
                 <div class="dropdown-divider"></div>
                <a class="dropdown-item" onclick="logout()">
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
            <h1 class="h3 mb-0 text-gray-800">Scrap</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="Dashboard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="master.jsp">Master</a></li>
              <li class="breadcrumb-item active" aria-current="page">Scrap</li>
            </ol>
          </div>

          <div class="row mb-3">
            <!-- Earnings (Monthly) Card Example -->
       
            <!-- New User Card Example -->
             <div class="col-xl-3 col-md-6 mb-4">
              <div class="card h-100" onclick="window.location.href='vender.jsp'">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Vender</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800" id="cust">3</div>
                      </div>
                    <div class="col-auto">
                    <i class="fas fa-building" style="color: #27ae60;"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Pending Requests Card Example -->
           </div>
           <div class="row mb-3">
  <div class="col-lg-12">
    <div class="card mb-4">
      <div style="border: 1px solid #ddd; border-radius: 5px; padding: 10px; 
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" 
             style="background-color: #f8f9fc;">
          <button onclick="createFunction()" 
                  data-toggle="modal" 
                  data-target="#exampleModalScrollable" 
                  id="modalScroll"
                  style="padding: 5px 15px; background-color: #4caf50; color: #fff; 
                         border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">
            <i class="fas fa-plus"></i> Create
          </button>
        </div>
      </div>

      <div class="table-responsive p-3">
        <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
          <thead>
            <tr>
              <th>Scrap Name</th>
              <th>Address</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Status</th>
              <th class="text-center">Edit</th>
              <th class="text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Test 1</td>
              <td>Test 1</td>
              <td>Test 1</td>
              <td>Test 1</td>
              <td>Test 1</td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-danger">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>Test 2</td>
              <td>Test 2</td>
              <td>Test 2</td>
              <td>Test 2</td>
              <td>Test 2</td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-danger">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>Test 3</td>
              <td>Test 3</td>
              <td>Test 3</td>
              <td>Test 3</td>
              <td>Test 3</td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-danger">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1000px" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalScrollableTitle">
                <b>Create Scrap Details</b>
              </h5>
              <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="productForm">
                <div class="form-row">
                  <div class="form-group col-md-4">
                    <label for="categoryPrefix"><b>Scrap Name:</b></label>
                    <input type="text" class="form-control form-control-sm" id="categoryPrefix"
                      placeholder="Enter Product code" name="categoryPrefix" />
                       <span id="productCodeError1" class="error-message"></span><br>
                  </div>
                  <div class="form-group col-md-4">
                    <label for="inputName"><b>Address:</b></label>
                    <input type="text" class="form-control form-control-sm" id="inputName"
                      placeholder="Enter product Name"  name="categoryPrefix">
                      <span id="productCodeError2" class="error-message"></span><br>
                  </div>
                  <div class="form-group col-md-4">
                    <label for="inputName"><b>Mobile:</b></label>
                    <input type="text" class="form-control form-control-sm" id="inputNamebar"
                      placeholder="Enter Product Barcode"  name="categoryPrefix">
                      <span id="productCodeError2bar" class="error-message"></span><br>
                  </div>
                  <div class="form-group col-md-4">
                    <label for="inputlead"><b>Email:</b></label>
                    <div class="input-group">
                      <input type="text" class="form-control form-control-sm" id="inputlead"
                        placeholder="Enter Lead time">
                        
                      <!-- <div class="input-group-append">
                        <span class="input-group-text">Dirham</span>
                      </div> -->
                     
                    </div>
                     <span id="productCodeError5lead" class="error-message" ></span><br>
                  </div>
                  </div>
              </form>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal" onclick="closeFormAndReset();">
                Close
              </button>
              <button type="button" class="btn btn-sm btn-warning" id="resetButton">
                Reset
              </button>
              <button type="button" class="btn btn-sm btn-success" data-toggle="modal" onclick="openModalAdd();">
                Create
              </button>
           </div>
           
        </div>
        </div>
      </div>
    </div>
  </div>
</div>

            </div>
        <!---Container Fluid-->
      </div>
       </div>
  </div>

  <!-- Scroll to top -->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>

    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    <script src="js/ruang-admin.min.js"></script>
    <script src="js/master.js?v=<%=ts%>"></script>
     <script src="js/config.js"></script>
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