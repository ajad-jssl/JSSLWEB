<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
  response.setHeader("Pragma", "no-cache"); // HTTP 1.0
  response.setDateHeader("Expires", 0); // Proxies
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Assign Permissions</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">	
    <link href="img/logo/download.png" rel="icon">
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
    <link href="css/ruang-admin.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/main.css">
  
          <script>
    
   
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>
    
     <script type="text/javascript">
 function noBack() {
     window.history.forward();
 }
 </script>
    <style>
        .tick {
            color: green;
            font-weight: bold;
            margin-left: 5px;
        }
        .action-checkboxes {
            margin-left: 20px;
            margin-top: 10px;
        }
        .tab-content {
            padding: 20px;
            border: 1px solid #dee2e6;
            border-top: none;
            background: #fff;
        }
        .nav-tabs .nav-link {
            color: #37499A;
        }
        .nav-tabs .nav-link.active {
            color: #fff;
            background-color: #37499A;
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






#moduleTabContent{
font-size:17px; font-weight:300;}
.invoice-tabs-container{
font-size:15px; }
.form-check {
    padding-left: 0 !important;
}

.module-has-permission {
    background-color: #fff3cd !important;   /* soft yellow highlight */
    border-color: #ffe69c !important;
    font-weight: 700 !important;
}
.module-has-permission.active {
    background-color: #37499A !important;    /* keep active-tab color if it's also selected */
    color: #fff !important;
}
    </style>
    
</head>

<body>
    <div id="wrapper">
       <!-- Sidebar -->
    <%@ include file="useraccess_sidebar.jsp" %>
     
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
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-user text-white mr-2"></i>
                                <span class="ml-2 d-none d-lg-inline text-white small" id="usernameDisplay">Username</span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                                <a class="dropdown-item" onclick="logoutUser(event)">
                                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Logout
                                </a>
                            </div>
                        </li>
                    </ul>
                </nav>

                <!-- Main Container -->
                <div class="container-fluid" id="container-wrapper">
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800">Assign User Permissions</h1>
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="<%=request.getContextPath()%>/useraccess_Dashboard.jsp">Home</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Permissions</li>
                        </ol>
                    </div>

                    <!-- Dropdown for Users -->
                    <div class="form-group">
                        <label for="userDropdown">Select User</label>
                        <select id="userDropdown" class="form-control" onchange="fetchUserPermissions()">
                            <option value="">-- Select a user --</option>
                        </select>
                    </div>

                    <!-- Tabs for Modules -->
                    <form id="permissionForm">
                        <input type="hidden" name="userId" id="selectedUserId">
                        <ul class="nav nav-tabs" id="moduleTabs" role="tablist"></ul>
                        <div class="tab-content" id="moduleTabContent"></div>
                        <button type="submit" class="btn btn-primary mt-4" id="saveper">Save Permissions</button>
                    </form>
                    <div id="loadingSpinner" hidden="hidden" 
     style="display:none; position:fixed; top:0; left:0; width:100%; height:100%;
            background:rgba(0,0,0,0.4); z-index:9999; 
            display:flex; justify-content:center; align-items:center;">
    <div class="spinner-border text-light" role="status" style="width:3rem; height:3rem;">
        <span class="sr-only">Loading...</span>
    </div>
</div>
                </div>
                <!-- End Container -->
            </div>
        </div>
    </div>

    <!-- Scroll to Top -->
    <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>

    <!-- Scripts -->
     <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    <script src="js/config.js?v=<%=jsVersion%>"></script>
   

    <script src="js/username.js?v=<%=jsVersion%>"></script>
    <script src="js/logout.js?v=<%=jsVersion%>"></script>
    <script src="js/assignPermissions.js?v=<%=jsVersion%>"></script>
     <script src="js/Sessionfilter.js?v=<%=jsVersion%>"></script>
   	  <script>

  window.actionElementMap = {
  };
</script>
  <script src="js/permissions.js?v=<%=jsVersion%>"></script>
</body>
</html>