

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
  
  
 <link rel="stylesheet" href="externalLibrary/cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
 

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
  <script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
      window.location.href = "newlogin.jsp";
    }
  </script>
</head>

<body>
  <div id="wrapper">
  <%@ include file="AmsSidebar.jsp" %>
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
            <h1 class="h3 mb-0 text-gray-800">AMS Masters</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="AMSDashBoard.jsp">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">Master</li>
            </ol>
          </div>

          <div class="px-0">
            <div class="card-grid"> 
                
              
              
              <div class="card-container">
                <div class="card h-100" onclick="openSection('AssetTypeRadio')">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col mr-2">
                        <i class="fas fa-clipboard-check fa-2x" style="color: #4ACCF7;"></i>
                      </div>
                      <div class="col-auto">
                        <div class="text-xs font-weight-bold text-uppercase mb-1">Asset Type</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800 text-right"><span id="typecount"></span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card-container">
                <div class="card h-100" onclick="openSection('AssetModelRadio')">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col mr-2">
                        <i class="fas fa-clipboard-check fa-2x" style="color: #4ACCF7;"></i>
                      </div>
                      <div class="col-auto">
                        <div class="text-xs font-weight-bold text-uppercase mb-1">Asset Model</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800 text-right"><span id="modelcount"></span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card-container">
                <div class="card h-100" onclick="openSection('AssetStatusRadio')">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col mr-2">
                        <i class="fas fa-clipboard-check fa-2x" style="color: #4ACCF7;"></i>
                      </div>
                      <div class="col-auto">
                        <div class="text-xs font-weight-bold text-uppercase mb-1">Asset Status</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800 text-right"><span id="statuscount"></span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card-container">
                <div class="card h-100" onclick="openSection('AssetOwnedByRadio')">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col mr-2">
                        <i class="fas fa-clipboard-check fa-2x" style="color: #4ACCF7;"></i>
                      </div>
                      <div class="col-auto">
                        <div class="text-xs font-weight-bold text-uppercase mb-1">Asset Owned_By</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800 text-right"><span id="citycount"></span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card-container">
                <div class="card h-100" onclick="openSection('AssetMakerRadio')">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col mr-2">
                        <i class="fas fa-clipboard-check fa-2x" style="color: #4ACCF7;"></i>
                      </div>
                      <div class="col-auto">
                        <div class="text-xs font-weight-bold text-uppercase mb-1">Asset Maker</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800 text-right"><span id="makecount"></span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            
              
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



  <script src="vendor/jquery/jquery.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
   <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>

  <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
  <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
  <script src="js/permissions.js?v=<%=ver(application, "/js/permissions.js")%>"></script>
   <script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
   <script src="js/AmsMaster.js?v=<%=ver(application, "/js/AmsMaster.js")%>"></script>
   
   <script>
   function openSection(radioId) {
	    sessionStorage.setItem("selectedAssetRadio", radioId);
	    window.location.href = "AmsMasterRegister.jsp";
	}
</script>

</body>

</html>
</html>