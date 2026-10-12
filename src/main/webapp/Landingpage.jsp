
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
  response.setHeader("Pragma", "no-cache"); // HTTP 1.0
  response.setDateHeader("Expires", 0); // Proxies
%>


<%@ include file="version.jsp"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="img/logo/download.png" rel="icon">
<title>JSSL</title>


<link
	href="externalLibrary/cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.5.0/font/bootstrap-icons.min.css"
	rel="stylesheet">
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css">

<script src="externalLibrary/code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="js/sidebar.js?v=<%=jsVersion%>"></script>





<script>
 
    $(document).ready(function() {
    	
      const userPermissions = JSON.parse(sessionStorage.getItem("userPermissions"));
      if (userPermissions) {
     updateSidebarVisibility(userPermissions);
          restrictPageAccess(userPermissions);
      }
    });

    
    function noBack() {
        window.history.forward();
    }
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

.highlight-module .icon-card {
	background-color: #ffc107 !important; /* Yellow */
	color: #000 !important; /* Black icon */
}

.highlight-module .icon-label {
	color: #000 !important; /* Black text */
	font-weight: 600;
}

.logo-item {
	display: flex;
	align-items: center;
	margin-left: 0px;
}

.logo-item img {
	height: 70px;
	width: 120px;
	display: block;
	border-radius: 10px;
}

/* Remove Bootstrap hover background */
.logo-item:hover, .logo-item:focus, .logo-item:active {
	background: transparent !important;
}

/* If wrapped inside nav-link */
.logo-item .nav-link, .logo-item .nav-link:hover, .logo-item .nav-link:focus,
	.logo-item .nav-link:active {
	background: transparent !important;
	box-shadow: none !important;
}
</style>

<!-- Bootstrap CSS -->
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet"
	type="text/css">
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css">
<link href="css/ruang-admin.min.css" rel="stylesheet">
<script>


</script>
</head>

<body>
	<nav
		class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top"
		style="background-color: #37499A; display: flex; align-items: center;">

		<!-- Left Logo -->
		<div class="logo-item">
			<img src="img/logo/download.png" alt="Logo">
		</div>

		<!-- Right Side -->
		<ul class="navbar-nav ml-auto">

			<div class="dropdown-checkbox"
				style="position: relative; display: inline-block;">

				<button id="factoryDropdownBtn" class="dropdown-toggle"
					type="button"
					style="background-color: white; color: black; border: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; cursor: pointer; margin-top: 14px;">
					Select Factory</button>

				<div id="factoryDropdownMenu" class="dropdown-menu"
					style="display: none; position: absolute; top: 100%; left: 0; border: 1px solid #ccc; background: #fff; z-index: 1000; padding: 10px; width: 200px; max-height: 200px; overflow-y: auto;">
				</div>

			</div>

			<div class="topbar-divider d-none d-sm-block"></div>

			<li class="nav-item dropdown no-arrow"><a
				class="nav-link dropdown-toggle" href="#" id="userDropdown123"
				data-toggle="dropdown"> <i class="fas fa-user text-white mr-2"></i>
					<span class="ml-2 d-none d-lg-inline text-white small"
					id="usernameDisplay">Username</span>
			</a>

				<div
					class="dropdown-menu dropdown-menu-right shadow animated--grow-in">
					<a class="dropdown-item" onclick="logoutUser(event)"> <i
						class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
						Logout
					</a>
				</div></li>

		</ul>
	</nav>


	<div class="container py-5">
		<h3 class="mb-6">
			<!-- jssl -->
		</h3>
		<div class="row text-center" id="moduleContainer"></div>

	</div>

	<div class="modal fade" id="exampleModalCenter66update" tabindex="-1"
		role="dialog" aria-labelledby="exampleModalCenterTitle"
		aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
				<div class="modal-header1"></div>
				<div class="modal-body">
					<b>Please select a factory before proceeding!</b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal" id="closeModalBtn3">OK</button>

				</div>
			</div>
		</div>

	</div>

	<!-- Bootstrap Icons and JS -->
	<script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="vendor/jquery-easing/jquery.easing.min.js"></script>

	<script src="vendor/chart.js/Chart.min.js"></script>
	<script src="js/demo/chart-area-demo.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

	<script src="js/username.js?v=<%=jsVersion%>"></script>

	<script src="js/config.js?v=<%=jsVersion%>"></script>
	<%-- <script src="js/userrole.js?v=<%=jsVersion%>"></script> --%>
	<script src="js/Sessionfilter.js?v=<%=jsVersion%>"></script>

	<script>
    function navigateToDashboard() {
        let selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
        
        if (!selectedFactoryId) {
        	$('#exampleModalCenter66update').modal('show');
            
            return; // Stop navigation
        }

        // Navigate if a factory is selected
        window.location.href = 'Dashboard';
    }
</script>

	<script>
document.addEventListener("DOMContentLoaded", function () {

    const dropdownBtn  = document.getElementById("factoryDropdownBtn");
    const dropdownMenu = document.getElementById("factoryDropdownMenu");

    if (!dropdownBtn || !dropdownMenu) return;

    const userFactoryId = (sessionStorage.getItem("factory_id") || "").toUpperCase();
    let selectedFactoryId = sessionStorage.getItem("selectedFactoryId") || null;

    // Toggle dropdown
    dropdownBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (!dropdownBtn.classList.contains("disabled")) {
            dropdownMenu.style.display =
                dropdownMenu.style.display === "block" ? "none" : "block";
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        if (!e.target.closest(".dropdown-checkbox")) {
            dropdownMenu.style.display = "none";
        }
    });

    // SINGLE FACTORY → disable permanently
    if (userFactoryId && userFactoryId !== "ALL") {
        fetchFactoryById(userFactoryId, function(factory) {
            if (factory) {
                dropdownBtn.innerText = factory.factory_name;
                dropdownBtn.classList.add("disabled");
                dropdownBtn.style.pointerEvents = "none";
                dropdownBtn.style.cursor = "default";
                sessionStorage.setItem("selectedFactoryId", userFactoryId);
            }
        });
    } else {
        // ALL FACTORIES → dropdown always enabled
        dropdownBtn.classList.remove("disabled");
        dropdownBtn.style.pointerEvents = "auto";
        dropdownBtn.style.cursor = "pointer";

        // Show previously selected factory if exists, else default text
       // dropdownBtn.innerText = selectedFactoryId ? "Loading..." : "Select Factory";
       // Keep existing selection text, don't reset
       if (!selectedFactoryId) {
       dropdownBtn.innerText = "Select Factory";
       }

        loadFactoryDropdown(selectedFactoryId);
    }
});

// Load all factories
function loadFactoryDropdown(currentSelectedId) {
    const dropdownMenu = document.getElementById("factoryDropdownMenu");
    dropdownMenu.innerHTML = "";

    fetch(new URL('/jssl/factory/getAllFactoryList', baseUrl1), { credentials: "include" })
    .then(res => res.json())
    .then(data => {
        let selectedFactoryName = null;

        data.FactoryDetails.forEach(factory => {
            const item = document.createElement("div");
            item.className = "dropdown-item";
            item.innerText = factory.factory_name;
            item.style.cursor = "pointer";

            // Highlight currently selected factory
            if (currentSelectedId && String(factory.id) === String(currentSelectedId)) {
                item.style.backgroundColor = "#e0e0e0";
                item.style.fontWeight = "bold";
                selectedFactoryName = factory.factory_name;
            }

            // Select factory on click
            item.addEventListener("click", function() {
                sessionStorage.setItem("selectedFactoryId", factory.id);
                document.getElementById("factoryDropdownBtn").innerText = factory.factory_name;
                dropdownMenu.style.display = "none"; // close dropdown
            });

            dropdownMenu.appendChild(item);
        });

        // Show the selected factory immediately
        const dropdownBtn = document.getElementById("factoryDropdownBtn");
        if (selectedFactoryName) {
            dropdownBtn.innerText = selectedFactoryName;
        } else if (!sessionStorage.getItem("selectedFactoryId")) {
            dropdownBtn.innerText = "Select Factory";
        }
    })
    .catch(err => console.error("Error loading factories:", err));
}

// Fetch single factory
function fetchFactoryById(factoryId, callback) {
    fetch(new URL('/jssl/factory/getAllFactoryList', baseUrl1), { credentials: "include" })
    .then(res => res.json())
    .then(data => {
        const factory = data.FactoryDetails.find(f => String(f.id) === String(factoryId));
        callback(factory);
    })
    .catch(err => {
        console.error("Error fetching factory:", err);
        callback(null);
    });
}
</script>


	<script>
$(document).ready(function() {
    $("#closeModalBtn3").click(function() {
        $("#exampleModalCenter66update").modal("hide"); // 
    });
});
</script>

	<script>
$(document).ready(function() {


	  const userId = sessionStorage.getItem('username');

	  if (!userId) {
	    window.location.href = "newlogin";
	    return;
	  }
	 

	  const url = new URL('/api/user-permissions-details', baseUrl1);
	  url.searchParams.append('userId', userId);

	  fetch(url, { credentials: "include" })
	  .then(response => response.json())
	  .then(data => {

	    const moduleDefaults = {};
	    const allowedPages = [];   //  NEW

	    data.forEach(item => {
	      const moduleName = item.moduleName.trim();

	      // store first page per module (your existing logic)
	      if (!moduleDefaults[moduleName]) {
	        moduleDefaults[moduleName] = item.pageUrl;
	      }

	      //  collect all allowed pages
	      allowedPages.push(item.pageUrl.trim());
	    });

	    //  store allowed page list once
	    sessionStorage.setItem("allowedPages", JSON.stringify(allowedPages));

	    renderModules(moduleDefaults);
	  })
	  .catch(error => {
	    console.error("Error fetching user modules:", error);
	    window.location.href = "newlogin";
	  });

	  
	  
	 
	});

	
	const moduleIconMap = {
		"Invoice": "bi-receipt",                              // billing documents
		"GPMS": "bi-box-arrow-up-right",                       // material gate pass — going out through the gate
		"VTS": "bi-truck",                                     // vehicle tracking system
		"VMS": "bi-person-check",                              // visitor pass — checked in at the gate
		"ContractGP": "bi-person-lines-fill",                  // contract employee details entry
		"SubCon": "bi-exclamation-octagon",                    // production work handed off / shared with subcontractor (used as fallback only — SubCon now uses a custom image below)
		"User Access": "bi-person",                       // access & permissions
		"AMS": "bi-box-seam",                                  // asset given for site work
		"QC Inspection": "bi-patch-check",                     // production inspection after completion
		"Drawing": "bi-clock-history",                         // man-hour entry
		"NCR": "bi-x-circle",                                  // non-conformance report
		"Errection": "bi-bricks",                              // steel erection / structural assembly
		"ConsolidatedG2Report": "bi-collection",               // two factory reports combined into one
		"GlobalMaster": "bi-sliders",                          // developer-maintained system parameters
		"Maintenance Tool": "bi-tools"                         // maintenance & repair
	};

	function renderModules(moduleDefaults) {
	  const container = document.getElementById('moduleContainer');
	  container.innerHTML = '';

	  for (const [moduleName, pageUrl] of Object.entries(moduleDefaults)) {
	
	    const colDiv = document.createElement('div');
	    colDiv.className = 'col-3 text-center';



	    const flexDiv = document.createElement('div');
	    flexDiv.className = 'd-flex flex-column align-items-center';
	    flexDiv.style.cursor = 'pointer';
	    flexDiv.onclick = () => {
	    	  isTabClosing = false;
	    	  if (moduleName !== "User Access" && moduleName !=="DO Time Sheet") {

	    	  let selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
	          if (!selectedFactoryId) {
	              $('#exampleModalCenter66update').modal('show');
	              return;
	          }
	        }
	        if(moduleName === "Invoice"){
	        	 sessionStorage.setItem('selectedModule', moduleName);
	   	      sessionStorage.setItem('selectedPage', pageUrl);
	   	      
	   	      
	   	      
	   	      
	   	      window.location.href = 'InvoiceDashBoard';
	   	      return;
	        }
	        
	        if(moduleName === "Maintenance Tool"){
	        	 sessionStorage.setItem('selectedModule', moduleName);
	   	      sessionStorage.setItem('selectedPage', pageUrl);
	   	      
	   	      
	   	      
	   	      
	   	      window.location.href = 'MaintenanceDashBorad';
	   	      return;
	        }
	        
	        if(moduleName === "DO Time Sheet"){
	        	 sessionStorage.setItem('selectedModule', moduleName);
	   	      sessionStorage.setItem('selectedPage', pageUrl);
	   	      
	   	      
	   	      
	   	      
	   	      window.location.href = 'DotimeSheetDashBoard';
	   	      return;
	        }
	        if(moduleName === "VMS"){
	        	 sessionStorage.setItem('selectedModule', moduleName);
	   	      sessionStorage.setItem('selectedPage', pageUrl);
	   	      
	   	      
	   	      
	   	      
	   	      window.location.href = 'VMSDashboard';
	   	      return;
	        }
	       
	        if(moduleName==="ContractGP"){
	         	 sessionStorage.setItem('selectedModule', moduleName);
		   	      sessionStorage.setItem('selectedPage', pageUrl);
		   	      
		   	      
		   	      
		   	      
		   	      window.location.href = 'ContractDashboard';
		   	      return;
	        }
	        
	        if(moduleName==="QC Inspection"){
	         	 sessionStorage.setItem('selectedModule', moduleName);
		   	      sessionStorage.setItem('selectedPage', pageUrl);
		   	      
		   	      
		   	      
		   	      
		   	      window.location.href = 'QCDashboard.jsp';
		   	      return;
	        }
	        if(moduleName==="G2Reports"){
	         	 sessionStorage.setItem('selectedModule', moduleName);
		   	      sessionStorage.setItem('selectedPage', pageUrl);
		   	      
		   	      
		   	      
		   	      
		   	      window.location.href = 'HomeDashboard.jsp';
		   	      return;
	        }
	        if(moduleName==="User Access"){
	         	 sessionStorage.setItem('selectedModule', moduleName);
		   	      sessionStorage.setItem('selectedPage', pageUrl);
		   	      
		   	      
		   	      
		   	      
		   	      window.location.href = 'useraccess_Dashboard.jsp';
		   	      return;
	        }
	        if(moduleName==="SubCon"){
	         	 sessionStorage.setItem('selectedModule', moduleName);
		   	      sessionStorage.setItem('selectedPage', pageUrl);
		   	      
		   	      
		   	      
		   	      
		   	      window.location.href = 'SubConDashboard.jsp';
		   	      return;
	        }
	        
	        if(moduleName==="VTS"){
	         	 sessionStorage.setItem('selectedModule', moduleName);
		   	      sessionStorage.setItem('selectedPage', pageUrl);
		   	      
		   	      
		   	      
		   	      
		   	      window.location.href = 'VehicleDashboard.jsp';
		   	      return;
	        }
	        
	        if(moduleName==="GPMS"){
	         	 sessionStorage.setItem('selectedModule', moduleName);
		   	      sessionStorage.setItem('selectedPage', pageUrl);
		   	      
		   	      
		   	      
		   	      
		   	      window.location.href = 'GPMSDashboard.jsp';
		   	      return;
	        }
	        
	        if(moduleName==="AMS"){
	         	 sessionStorage.setItem('selectedModule', moduleName);
		   	      sessionStorage.setItem('selectedPage', pageUrl);
		   	      
		   	      
		   	      
		   	      
		   	      window.location.href = 'AMSDashBoard.jsp';
		   	      return;
	        }
	        
	        console.log(moduleName);
	        console.log(pageUrl);
	      sessionStorage.setItem('selectedModule', moduleName);
	      sessionStorage.setItem('selectedPage', pageUrl);
	      
	      
	      
	      
	      window.location.href = 'Dashboard';
	    };
	    
	    
	    

	    const iconCard = document.createElement('div');
	    iconCard.className = 'icon-card';
	    iconCard.style.width = '150px';
	    iconCard.style.height = '150px';
	    iconCard.style.borderRadius = '8px';
	    iconCard.style.background = '#fff';
	    iconCard.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
	    iconCard.style.display = 'flex';
	    iconCard.style.alignItems = 'center';
	    iconCard.style.justifyContent = 'center';
	    iconCard.style.fontSize = '40px';
	    iconCard.style.color = '#4a90e2';

	    if (moduleName === "SubCon") {
	        const img = document.createElement("img");
	        img.src = "img/logo/subcon1.png";
	        img.style.width = "80px";
	        img.style.height = "80px";
	        img.style.objectFit = "contain";
	        iconCard.appendChild(img);
	    } else {
	        const icon = document.createElement('i');
	        icon.className = 'bi ' + (moduleIconMap[moduleName] || 'bi-briefcase'); // per-module icon, falls back to briefcase
	        iconCard.appendChild(icon);
	    }

	    const label = document.createElement('div');
	    label.className = 'icon-label mt-2';
	    label.style.fontWeight = '600';
	    label.style.fontSize = '16px';
	    label.style.color = '#333';
	    label.textContent = moduleName;

	    flexDiv.appendChild(iconCard);
	    flexDiv.appendChild(label);
	    colDiv.appendChild(flexDiv);
	    container.appendChild(colDiv);
	  }
	}
	


</script>

	<script>

</script>
	<script>
const url = new URL(window.location);


url.searchParams.set("ref", Date.now());


function generateJunk(length) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


url.searchParams.set("jims.jssl", generateJunk(200));


window.history.replaceState(null, "", url);
</script>
	<script src="js/logout.js?v=<%=jsVersion%>"></script>
</body>
</html>
