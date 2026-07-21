<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0
    response.setDateHeader("Expires", 0); // Proxies
%>
<%
long ts = System.currentTimeMillis();
%>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>JSSL</title>

  <link href="img/logo/download.png" rel="icon">
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link href="css/main.css" rel="stylesheet">
  <link href="css/masterpage.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
     <script src="js/sidebar.js"></script>

<style>
  .card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-start;
  }

  .card-grid .card-container {
    width: calc(25% - 0.75rem); /* Smaller cards: 4 per row */
    min-width: 200px;
  }

  .card-container .card {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  @media (max-width: 992px) {
    .card-grid .card-container {
      width: calc(50% - 0.75rem); /* 2 per row on medium screen */
    }
  }

  @media (max-width: 576px) {
    .card-grid .card-container {
      width: 100%; /* Stack cards on small screens */
    }
  }
</style>

</head>

<body>
  <div id="wrapper">
    <%@ include file="QCSidebar.jsp" %>

    <div id="content-wrapper" class="d-flex flex-column">
      <div id="content">
        <!-- TopBar -->
        <nav class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top" style="background-color: #37499A;">
          <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
            <i class="fa fa-bars"></i>
          </button>
          <ul class="navbar-nav ml-auto">
            <div class="radio-inputs" style="display:flex; align-items:center; justify-content: center; margin-top:6px;margin-right:70px;"></div>
            <button class="btn btn-link" onclick="window.location.href='Landingpage.jsp'" style="background-color: transparent; color: white; border: none;">
              <i class="fa fa-home"></i>
            </button>
            <div class="topbar-divider d-none d-sm-block"></div>
            <li class="nav-item dropdown no-arrow">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
                 aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-user text-white mr-2"></i>
                <span class="ml-2 d-none d-lg-inline text-white small" id="usernameDisplay">Username</span>
              </a>
              <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" onclick="logoutUser(event)">
                  <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i> Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>

        <!-- Page Content -->
        <div class="container-fluid" id="container-wrapper">
          <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">QC Masters</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="QCDashboard.jsp">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">Master</li>
            </ol>
          </div>

          <div class="px-0">
            <div class="card-grid">
              <%-- Card Template --%>
              <%
                String[] titles = {"Fabricator ID/Name", "Welder ID/Name", "Revision", "Position", "Process"};
                String[] ids = {"fabricatorCount", "welderCount", "revisionCount", "positionCount", "processCount"};
                for (int i = 0; i < titles.length; i++) {
              %>
              <div class="card-container">
                <div class="card h-100" onclick="openPage('<%= titles[i] %>')">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col mr-2">
                        <i class="fas fa-clipboard-check fa-2x" style="color: #4ACCF7;"></i>
                      </div>
                      <div class="col-auto">
                        <div class="text-xs font-weight-bold text-uppercase mb-1"><%= titles[i] %></div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800 text-right"><span id="<%= ids[i] %>"></span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <% } %>
            </div>
          </div>

        </div>
        <!-- Container-Fluid end -->
      </div>
    </div>
  </div>

  <!-- Scroll to Top Button -->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>

  <!-- Scripts -->
  <script src="js/config.js"></script>
  <script src="vendor/jquery/jquery.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
      <script src="js/ruang-admin.min.js"></script>
      <!-- Page level plugins -->
  <script src="js/QCMaster.js?v=<%=ts%>"></script>
  <script src="js/logout.js"></script>
  <script src="js/username.js"></script>
  <script src="js/permissions.js"></script>
   <script src="js/Sessionfilter.js"></script>
   
<script>
function openPage(title) {

    const typeMap = {
        "Fabricator ID/Name": "fabricator",
        "Welder ID/Name": "welder",
        "Revision": "revision",
        "Position": "position",
        "Process": "process"   // ✅ lowercase
    };

    const type = typeMap[title];
    if (type) {
        localStorage.setItem("selectedRadioType", type);
    }

    window.location.href = "QCMasters.jsp";
}
</script>

</body>

</html>
