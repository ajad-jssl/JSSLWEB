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
     
     
     <link rel="stylesheet" href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
      <link rel="stylesheet" href="css/main.css">
       
  <script>
    const user_id = sessionStorage.getItem('user_id');
    console.log(user_id);
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
  <style>
        /* CSS for invalid input highlighting */
        .is-invalid {
            border-color: red;
        }

        /* CSS for error messages */
        .error-message {
            font-size: 0.875rem; /* Small font size */
            color: red; /* Red text for error messages */
            margin-top: 5px;
            display: block;
        }
    </style>

  <script type="text/javascript">
 function noBack() {
     window.history.forward();
 }
 </script>
</head>

<body onload="fetchdelivery();">
  <div id="wrapper">
    <!-- Sidebar -->
      <%@ include file="InVoiceSideBar.jsp" %>
      
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
            <h1 class="h3 mb-0 text-gray-800">GST Series Master</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="InvoiceDashBoard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="InvoiceMasters.jsp">Master</a></li>
            
              <li class="breadcrumb-item active" aria-current="page">GST</li>
              
            </ol>
          </div>
  <div class="row mb-3">
    <div class="table-responsive p-3">
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc; margin-top: -9px;
    margin-left: -15px;">
        <button  data-toggle="modal"
                     id="#modalScroll"><i class="fas fa-plus"></i> Create</button>
                    <div class="d-flex align-items-center">
                    <label for="stateGstNo" class="mr-2"><b>State:</b></label>
                    <select class="form-control form-control-sm" id="statedrop" style="width: 150px;">
                        <!-- Options will be populated dynamically here -->
                    
                    </select>
                </div>
            </div>

        </div>
       <div class="table-responsive p-3" id="tableContainer" style="display: block;">
    <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
        <thead>
            <tr>
                <th>State Name</th>
                <th>Invoice Series</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Series No</th>
                <th>GST Status</th>
            </tr>
        </thead>
        <tbody>
            <!-- Data rows will be populated here dynamically -->
        </tbody>
    </table>
</div>

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
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create GST Series Master</b></h5>
                  <button type="button" class="close white-button" data-dismiss="modal" aria-label="Close">
                   <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Type:</b></label>
        <select class="form-control form-control-sm" id="state"></select>
        <div id="productCodeErrorcredit" class="error-message"></div>
    </div>
     <div class="form-group col-md-4">
    <label for="stateGstNo"><b>Series:</b></label>
    <input type="text" class="form-control form-control-sm" id="ses" 
           placeholder="Enter Series number" autocomplete="off">
    <div id="seriesFormatMessage" class="text-muted" style="font-size: 12px; color: blue;">
       (exactly 10-digit number)
    </div>
    <div id="productCodeErrorcredit1" class="error-message" style="color: red;"></div>
</div>

    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Start Date:</b></label>
        <input type="date" class="form-control form-control-sm" id="sdate" placeholder="Enter Start Date" autocomplete="off">
        <div id="productCodeErrorcredit2" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>End Date:</b></label>
        <input type="date" class="form-control form-control-sm" id="edate" placeholder="Enter End Date" autocomplete="off">
        <div id="productCodeErrorcredit3" class="error-message"></div>
    </div>
    </div>
</form>
</div>

                <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-sm btn-success"
                   onclick="openModalAdd();">Create</button>
</div>

              </div>
            </div>
          </div>

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
                    <button type="button" class="btn btn-info btn-sm" onclick="addevent()">YES</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal fade" id="exampleModalCenterDup" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 70%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                   <!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> --> 
                   <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
                 </div>
                <div class="modal-body">
                  <b id="errorMessage"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">OK</button> 
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal fade" id="exampleModalCenterDupUP" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 70%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1"> 
                   <!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> --> 
                   <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
                 </div>
                <div class="modal-body">
                  <b id="errorMessageup"></b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">OK</button> 
                </div>
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
     
     
        <script src="vendor/datatables/jquery.dataTables.min.js"></script>
        <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
   
      <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
   
  <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
      <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
      <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
    
    
       <script src="js/gstseriesmaster.js?v=<%=ver(application, "/js/gstseriesmaster.js")%>"></script>
   	  <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
 	    <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
 	  
 	      <script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
   	    <script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
   	     <script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
   	      	  <script>

  window.actionElementMap = {
  };
</script>
    <script src="js/permissions.js?v=<%=ver(application, "/js/permissions.js")%>"></script>
   	  <script>
    document.addEventListener("DOMContentLoaded", function () {
        let today = new Date().toISOString().split('T')[0];
        let startDateInput = document.getElementById("sdate");
        startDateInput.value = today; // Set the current date as default value
        startDateInput.setAttribute("min", today);
        startDateInput.setAttribute("max", today);
    });
</script>
 
</body>
</html>