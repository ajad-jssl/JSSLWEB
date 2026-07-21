<%
long ts = System.currentTimeMillis();
%>
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<title>UserUnlock</title>
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link href="img/logo/download.png" rel="icon">
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet"
	type="text/css">
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css">
	  <link href="css/masterpage.css" rel="stylesheet">
<link href="css/ruang-admin.min.css" rel="stylesheet">
<link rel="stylesheet" href="css/main.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<style>
/* LEFT ALIGN TABS */
.left-tabs {
	width: 800px;
	justify-content: center !important;
}

.nav-link {
	color: black !important;
}
/* FIX ACTIVE TAB COLOR */
.nav-tabs .nav-link.active {
	background-color: #37499A !important;
	color: white !important;
	border: none !important;
}

/* HOVER COLOR */

/* CARD WIDTH */
.center-card {
	width: 800px;
	margin-left: 0; /* aligns left */
}

.nav-tabs {
	border-bottom: none !important;
}

.custom-btn {
	width: 400px;
	display: block;
	margin: 20px auto 0 auto; /* center horizontally */
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
</style>
</head>

<body >
	<div id="wrapper">

		<!-- Sidebar -->
		<%-- <%@ include file="InVoiceSideBar.jsp"%> --%>
		
		<%@ include file="useraccess_sidebar.jsp"%>
		
		

		<div id="content-wrapper" class="d-flex flex-column">
			<div id="content">

				<!-- Top Navbar -->
				<nav
					class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top"
					style="background-color: #37499A;">
					<button id="sidebarToggleTop"
						class="btn btn-link rounded-circle mr-3">
						<i class="fa fa-bars"></i>
					</button>
					<ul class="navbar-nav ml-auto">
						<button class="btn btn-link"
							onclick="window.location.href='Landingpage.jsp'"
							style="background-color: transparent; color: white; border: none;">
							<i class="fa fa-home"></i>
						</button>
						<div class="topbar-divider d-none d-sm-block"></div>
						<li class="nav-item dropdown no-arrow">  <a class="nav-link dropdown-toggleww" href="#" id="userDropdown123" role="button" data-toggle="dropdown"
				           aria-haspopup="true" aria-expanded="false">
				           <i class="fas fa-user text-white mr-2"></i> <!-- Settings icon -->
				           <span class="ml-2 d-none d-lg-inline text-white small" id="usernameDisplay">Username</span>
				        </a>
							<div
								class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
								aria-labelledby="userDropdown">
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" onclick="logoutUser(event)"> <i
									class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
									Logout
								</a>
							</div></li>
					</ul>
				</nav>

				<!-- MAIN PAGE CONTENT -->
				<div class="container-fluid">

					<div
						class="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 class="h3 mb-0 text-gray-800">User Management</h1>
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="#">Home</a></li>
							<li class="breadcrumb-item active">Unlock / Inactive</li>
						</ol>
					</div>

					<!-- User Type Select -->
					<div class="form-group"
						style="max-width: 400px; margin-bottom: 20px;">
						<label><b>Select User Type:</b></label> <select
							class="form-control form-control-sm" id="userTypeSelect">
							<option value="">-- Select User Type --</option>
							<option value="JIMS">JIMS User</option>
							<option value="G2">G2User</option>
						</select>
					</div>

					<!-- LEFT ALIGNED TABS -->
					<ul class="nav nav-tabs mb-3 left-tabs" id="userTab" role="tablist"
    style="display: none;">

    <!--  INACTIVE FIRST -->
<!--     <li class="nav-item">
        <a class="nav-link active" id="inactive-tab" data-toggle="tab" href="#inactive" role="tab">
            Inactive User
        </a>
    </li> -->

    <!-- UNLOCK SECOND -->
    <li class="nav-item">
        <a class="nav-link" id="unlock-tab" data-toggle="tab" href="#unlock" style="
    background-color: gainsboro;" role="tab">
            LockedUser
        </a>
    </li>

</ul>


<div class="tab-content" id="userTabContent" style="display: none;">

    <!-- ´ INACTIVE TAB â€” NOW FIRST + ACTIVE -->
<!--     <div class="tab-pane fade show active" id="inactive" role="tabpanel">
        <div class="card shadow p-4 center-card">

            <div class="form-group">
                <label><b>Select User to Inactivate:</b></label>
                <select class="form-control form-control-sm" id="inactiveUser">
                    <option value="">-- Select User --</option>
                </select>
                  <small id="inactiveError" style="color: red; display: none;">
                    Please select a user.
                </small>
            </div>

            <div class="form-group">
                <label><b>Reason:</b></label>
                <textarea class="form-control" id="inactiveReason" rows="3"
                    placeholder="Enter reason"></textarea>
            </div>

            <button class="btn btn-primary btn-sm custom-btn" id="inactivesubmit">Submit</button>
        </div>
    </div> -->

    <!-- UNLOCK TAB â€” NOW SECOND -->
    <div class="tab-pane fade" id="unlock" role="tabpanel">
        <div class="card shadow p-4 center-card">

            <div class="form-group">
                <label><b>Select User to Unlock:</b></label>
                <select class="form-control form-control-sm" id="unlockUser">
                    <option value="">-- Select User --</option>
                </select>
                <small id="unlockError" style="color: red; display: none;">
                    Please select a user.
                </small>
            </div>

            <div class="form-group">
                <label><b>Reason:</b></label>
                <textarea class="form-control" id="unlockReason" rows="3"
                    placeholder="Enter reason"></textarea>
            </div>

            <button class="btn btn-primary btn-sm custom-btn" id="unlocksubmit">Unlock</button>
        </div>
    </div>

</div>










<!--  USER MANAGEMENT BLOCK (Hidden by default)  -->
<ul class="nav nav-tabs mb-3 left-tabs" id="g2UserTab" role="tablist"
    style="display: none; margin-top: 30px;">

   <!--  INACTIVE FIRST -->
   <!-- <li class="nav-item">
        <a class="nav-link active" id="g2-inactive-tab" data-toggle="tab" href="#g2-inactive" role="tab">
            Inactive User
        </a>
    </li> -->

    <!--  UNLOCK SECOND -->
    <li class="nav-item">
        <a class="nav-link" id="g2-unlock-tab" data-toggle="tab" href="#g2-unlock" style="
    background-color: gainsboro;" role="tab">
             LockedUser
        </a>
    </li>

</ul>


<div class="tab-content" id="g2UserTabContent" style="display: none;">

    <!--´ INACTIVE TAB â€” FIRST + ACTIVE -->
  <!--   <div class="tab-pane fade show active" id="g2-inactive" role="tabpanel">
        <div class="card shadow p-4 center-card">

            <div class="form-group">
                <label><b>Select G2 User to Inactivate:</b></label>
                <select class="form-control form-control-sm" id="g2InactiveUser">
                    <option value="">-- Select User --</option>
                </select>
                <small id="g2InactiveError" style="color: red; display: none;">
                    Please select a user.
                </small>
            </div>

            <div class="form-group">
                <label><b>Reason:</b></label>
                <textarea class="form-control" id="g2InactiveReason" rows="3"
                    placeholder="Enter reason"></textarea>
            </div>

            <button class="btn btn-primary btn-sm custom-btn" id="g2InactiveSubmit">Submit</button>
        </div>
    </div> -->

    <!-- ðŸ”µ UNLOCK TAB â€” SECOND -->
    <div class="tab-pane fade" id="g2-unlock" role="tabpanel">
        <div class="card shadow p-4 center-card">

            <div class="form-group">
                <label><b>Select G2 User to Unlock:</b></label>
                <select class="form-control form-control-sm" id="g2UnlockUser">
                    <option value="">-- Select User --</option>
                </select>
                <small id="g2UnlockError" style="color: red; display: none;">
                    Please select a user.
                </small>
            </div>

            <div class="form-group">
                <label><b>Reason:</b></label>
                <textarea class="form-control" id="g2UnlockReason" rows="3"
                    placeholder="Enter reason"></textarea>
            </div>

            <button class="btn btn-primary btn-sm custom-btn" id="g2UnlockSubmit">Unlock</button>
        </div>
    </div>

</div>

					



				</div>
			</div>
		</div>

		<!-- Scripts -->
		<script src="vendor/jquery/jquery.min.js"></script>
		<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
		<script src="js/ruang-admin.min.js"></script>
		<script src="js/logout.js"></script>
		<script src="js/UserUnlockMenu.js?v=<%=ts%>"></script>
		<script src="js/username.js"></script>
		 <script src="js/factoryid.js"></script>
		  	  <script src="js/modifiedby.js"></script>
   	  <script src="js/createdby.js"></script>
   	   <script src="js/Sessionfilter.js"></script>
   	   
   	    <script src="js/config.js"></script>

		<script>
			
		</script>
		   	  <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
  <script src="js/permissions.js"></script>
</body>
</html>
