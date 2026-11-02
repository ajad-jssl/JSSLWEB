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
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="externalLibrary/cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-xxx" crossorigin="anonymous" />
  <link href="css/masterpage.css" rel="stylesheet">

   <script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>
</head>

<body>
  <div id="wrapper">
    <!-- Sidebar -->
   <%@ include file="GPMSSidebar.jsp" %>
   
   
    <!-- Sidebar -->
    <div id="content-wrapper" class="d-flex flex-column">
      <div id="content">
        <!-- TopBar -->
        <nav class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top" style="background-color: #37499A;">
                <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
                    <i class="fa fa-bars"></i>
                </button>
                
                <ul class="navbar-nav ml-auto">
					<div class="radio-inputs" style="display:flex; align-items:center; justify-content: center; margin-top:6px;margin-right:70px;">
					 
					</div>
                    <button class="btn btn-link" onclick="window.location.href='Landingpage.jsp'" style="background-color: transparent; color: white; border: none;">
                        <i class="fa fa-home"></i>
                    </button>
                    <div class="topbar-divider d-none d-sm-block"></div>
                    <li class="nav-item dropdown no-arrow">
                        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
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
            <h1 class="h3 mb-0 text-gray-800">GPMS Masters</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="GPMSDashboard.jsp">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">Master</li>
            </ol>
          </div>
          

<div class="row mb-3">

             
             
             <div class="col-md-3">
              <div class="card h-100" onclick="window.location.href='Items.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                   <div class="col mr-2">
                      <i class="fas fa-clipboard-check fa-2x" style="color:  #4ACCF7;font-size:1.5rem;"></i>         
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Items Master</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="itemnew"></div>
                     </div>                   
                  </div>
                </div>
              </div>
             </div>
              
            <div class="col-md-3">
              <div class="card h-100" onclick="window.location.href='Clients.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                   <div class="col mr-2">
                     <i class="fas fa-shipping-fast fa-2x" style="color:  #4ACCF7;font-size:1.5rem;"></i>         
                     </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Clients Master</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="clientnew"></div>
                     </div>                   
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
 <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
    <script src="js/gpmsmaster.js?v=<%=ver(application, "/js/gpmsmaster.js")%>"></script>
  <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
  <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
   <script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
  <script>
  document.querySelectorAll('.card-container').forEach((card) => {
    card.addEventListener('click', function (event) {
      event.stopPropagation();

      document.querySelectorAll('.card-container').forEach((container) => {
        if (container !== card) {
          container.classList.remove('open');
          const otherArrow = container.querySelector('.fas.fa-angle-up');
          if (otherArrow) {
            otherArrow.classList.replace('fa-angle-up', 'fa-angle-down');
          }
        }
      });

      card.classList.toggle('open');

      const arrowIcon = card.querySelector('.fas.fa-angle-down, .fas.fa-angle-up');
      if (arrowIcon) {
        arrowIcon.classList.toggle('fa-angle-down');
        arrowIcon.classList.toggle('fa-angle-up');
      }
    });
  });

  window.addEventListener('click', (event) => {
    if (!event.target.closest('.card-container')) {
      document.querySelectorAll('.card-container').forEach((container) => {
        container.classList.remove('open');
        const arrow = container.querySelector('.fas.fa-angle-up');
        if (arrow) {
          arrow.classList.replace('fa-angle-up', 'fa-angle-down');
        }
      });
    }
  });
</script>
 
</body>

</html>