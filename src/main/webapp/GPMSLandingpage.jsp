<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
  response.setHeader("Pragma", "no-cache"); // HTTP 1.0
  response.setDateHeader("Expires", 0); // Proxies
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSSL</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.5.0/font/bootstrap-icons.min.css" rel="stylesheet">
     <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
     <script src="js/sidebar.js"></script>
     <!-- Bootstrap CSS -->
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
     <!-- Bootstrap Icons CSS -->
     <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
     <!-- Bootstrap JS (Optional) -->
     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script>
  //On page load, fetch user permissions from sessionStorage and update sidebar
    $(document).ready(function() {
      const userPermissions = JSON.parse(sessionStorage.getItem("userPermissions"));
      if (userPermissions) {
     updateSidebarVisibility(userPermissions);
          restrictPageAccess(userPermissions);
      }
    });
   
    </script>
    <style>
   
    body {
          background-color: #f5f5f5;
          font-family: "Helvetica Neue", sans-serif;
        }
       
        .icon-card {
            width: 150px;
            height: 150px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
            background-color: #ffffff;
            transition: transform 0.2s ease;
        }
       
        .icon-card:hover {
            transform: translateY(-5px);
        }
        .icon-container {
            font-size: 40px;
            color: #4a90e2;
        }
        .icon-label {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-top: 8px;
            text-align: center;
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

<body onload="updateSidebar();">




<nav class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top" style="background-color: #37499A; display: flex; align-items: center; justify-content: space-between;">
  <!-- Left toggle button -->
  <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
    <!-- <i class="fa fa-bars"></i> -->
  </button>
<!-- Header Title -->
 <!--  <div style="display:flex; width:100%;justify-content:center;">
  <h1 class="navbar-brand text-white" style="font-family: sans; font-size: 40px; font-weight: bold;margin-left:60px;">
    JSSL
  </h1>
  </div> -->
  <!-- Right settings and logout menu -->
<ul class="navbar-nav ml-auto">
 <div class="dropdown-checkbox" style="position: relative; display: inline-block;">
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
    <!-- <li class="nav-item">
        <a class="nav-link" href="settings.jsp">
            <i class="fas fa-cog text-white fa-lg"></i> Settings icon
        </a>
    </li> -->
   
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


<div class="container py-5">
<h3 class="mb-6"><!-- jssl --></h3>
<div class="row text-center">
        <!-- Card 1 -->
       <div class="col-3 text-center">
   <div class="d-flex flex-column align-items-center">
       <div class="icon-card" onclick="window.location.href='Dashboard.jsp'">
           <div class="icon-container">
               <i class="bi bi-receipt"></i>
           </div>
       </div>
       <div class="icon-label mt-2">Invoice</div>
   </div>
</div>


        <!-- Card 2 -->
        <div class="col-3 text-center">
   <div class="d-flex flex-column align-items-center">
       <div class="icon-card" onclick="window.location.href='GPMSDashboard.jsp'">
           <div class="icon-container">
               <i class="bi bi-briefcase"></i>
           </div>
       </div>
       <div class="icon-label mt-2">Gpms</div>
   </div>
</div>


 <!-- Card 3 -->
        <div class="col-3 text-center">
   <div class="d-flex flex-column align-items-center">
       <div class="icon-card" onclick="window.location.href='SubConDashboard.jsp'">
           <div class="icon-container">
               <i class="bi bi-receipt"></i>
           </div>
       </div>
       <div class="icon-label mt-2">Sub-Con</div>
   </div>
</div>


<!-- Card 4 -->
<div class="col-3 text-center">
   <div class="d-flex flex-column align-items-center">
       <div class="icon-card" onclick="window.location.href='VehicleDashboard.jsp'">
           <div class="icon-container">
               <i class="bi bi-briefcase"></i>
           </div>
       </div>
       <div class="icon-label mt-2">V.T.S</div>
   </div>
</div>


<!-- Card 5 -->
        <div class="col-3 text-center">
   <div class="d-flex flex-column align-items-center">
       <div class="icon-card" onclick="window.location.href='VMSDashboard.jsp'">
           <div class="icon-container">
               <i class="bi bi-receipt"></i>
           </div>
       </div>
       <div class="icon-label mt-2">V.M.S</div>
   </div>
</div>


<!-- Card 6 -->
<div class="col-3 text-center">
   <div class="d-flex flex-column align-items-center">
       <div class="icon-card" onclick="window.location.href='ContractDashboard.jsp'">
           <div class="icon-container">
               <i class="bi bi-briefcase"></i>
           </div>
       </div>
       <div class="icon-label mt-2">Contract GP</div>
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
<script src="js/username.js"></script>
<script src="js/logout.js"></script>
 <script src="js/config.js"></script>
  <script src="js/userrole.js"></script>
 
    <script src="js/factoryid.js"></script>
     <script src="js/Sessionfilter.js"></script>
 
</body>
</html>