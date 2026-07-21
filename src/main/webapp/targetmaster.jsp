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
.modal-body{
    max-height:75vh;
    overflow-y:auto;
}

.table th{
    background:#f8f9fc;
    vertical-align:middle !important;
}

.table input{
    min-width:80px;
}

.card-header{
    background:#f8f9fc;
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

<body onload="fetchTargetMaster();">
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
				           <!--  <span class="ml-2 d-none d-lg-inline text-white small" id="selectedFactoryId">No Factory Selected</span> -->
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
  <div class="row mb-3">
    <div class="table-responsive p-3">
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc; margin-top: -9px;
    margin-left: -15px;">
     <button
    data-toggle="modal"
    data-target="#exampleModalScrollable">
    <i class="fas fa-plus"></i> Create
</button>
        </div>
       <div class="table-responsive p-3">
        <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
            </table>
    </div>
    </div>
</div>
          
     </div>
  </div>
  </div>

<!-- Add event -->

<div class="modal fade" id="exampleModalScrollable" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width:1400px;">
        <div class="modal-content">

            <div class="modal-header bg-primary text-white">
                <h5 class="mb-0"><b>Create Target Master</b></h5>

                <button type="button"
                        class="close text-white"
                        data-dismiss="modal">
                    <span>&times;</span>
                </button>
            </div>

            <div class="modal-body">

                <!-- Basic Details -->
                <div class="form-row">

                    <div class="form-group col-md-3">
                        <label><b>Financial Year</b></label>
                        <select id="financial_year"
                                class="form-control form-control-sm">
                            <option value="">Select Financial Year</option>
                        </select>
                    </div>

                    <div class="form-group col-md-3">
                        <label><b>Target Type</b></label>
                        <select id="target_type"
                                class="form-control form-control-sm">
                            <option value="TOTAL">Total</option>
                            <option value="CONTRACT">Contract</option>
                        </select>
                    </div>

                    <div class="form-group col-md-6"
                         id="contractDiv"
                         style="display:none;">
                        <label><b>Contract</b></label>
                        <select id="contract_id"
                                class="form-control form-control-sm">
                        </select>
                    </div>

                </div>

                <!-- Annual Target -->
                <div class="card mb-3">
                    <div class="card-header py-2">
                        <b>Annual Targets</b>
                    </div>

                    <div class="card-body p-2">

                        <div class="table-responsive">

                            <table class="table table-bordered table-sm text-center mb-0">

                                <thead>

                                    <tr>
                                        <th width="150">Category</th>
                                        <th>Production</th>
                                        <th>Dispatch</th>
                                        <th>Erection</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    <tr>

                                        <th>In House</th>

                                        <td>
                                            <input type="number"
                                                   id="target_prod_ih"
                                                   class="form-control form-control-sm">
                                        </td>

                                        <td>
                                            <input type="number"
                                                   id="target_disp_ih"
                                                   class="form-control form-control-sm">
                                        </td>

                                        <td>
                                            <input type="number"
                                                   id="target_erec_ih"
                                                   class="form-control form-control-sm">
                                        </td>

                                    </tr>

                                    <tr>

                                        <th>Sub Con</th>

                                        <td>
                                            <input type="number"
                                                   id="target_prod_sc"
                                                   class="form-control form-control-sm">
                                        </td>

                                        <td>
                                            <input type="number"
                                                   id="target_disp_sc"
                                                   class="form-control form-control-sm">
                                        </td>

                                        <td>
                                            <input type="number"
                                                   id="target_erec_sc"
                                                   class="form-control form-control-sm">
                                        </td>

                                    </tr>

                                    <tr class="font-weight-bold bg-light">

                                        <th>Total</th>

                                        <td>
                                            <input type="number"
                                                   id="target_prod_total"
                                                   readonly
                                                   class="form-control form-control-sm bg-white">
                                        </td>

                                        <td>
                                            <input type="number"
                                                   id="target_disp_total"
                                                   readonly
                                                   class="form-control form-control-sm bg-white">
                                        </td>

                                        <td>
                                            <input type="number"
                                                   id="target_erec_total"
                                                   readonly
                                                   class="form-control form-control-sm bg-white">
                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>
                </div>

                <!-- Manhours -->

                <div class="form-row">

                    <div class="form-group col-md-3">
                        <label><b>Target Manhours</b></label>
                        <input type="number"
                               id="target_manhours"
                               class="form-control form-control-sm">
                    </div>

                </div>

                <!-- Monthly Target Planning -->

                <div class="card">

                    <div class="card-header py-2">
                        <b>Monthly Target Planning</b>
                    </div>

                    <div class="card-body p-2">

                        <div class="table-responsive">

                            <table class="table table-bordered table-sm text-center">

                                <thead>

                                    <tr>

                                        <th rowspan="2">Month</th>

                                        <th colspan="2">Production</th>

                                        <th colspan="2">Dispatch</th>

                                        <th colspan="2">Erection</th>

                                    </tr>

                                    <tr>

                                        <th>IH</th>
                                        <th>SC</th>

                                        <th>IH</th>
                                        <th>SC</th>

                                        <th>IH</th>
                                        <th>SC</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    <tr>
                                        <td>Apr</td>
                                  <td><input type="number" id="apr_prod_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="apr_prod_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="apr_disp_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="apr_disp_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="apr_erec_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="apr_erec_sc" class="form-control form-control-sm"></td>
                                    </tr>

                                    <tr>
                                        <td>May</td>
                                     <td><input type="number" id="may_prod_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="may_prod_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="may_disp_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="may_disp_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="may_erec_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="may_erec_sc" class="form-control form-control-sm"></td>
                                    </tr>

                                    <tr>
                                        <td>Jun</td>
                                   <td><input type="number" id="jun_prod_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="jun_prod_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="jun_disp_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="jun_disp_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="jun_erec_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="jun_erec_sc" class="form-control form-control-sm"></td>
                                    </tr>

                                    <tr><td>Jul</td>
                                    <td><input type="number" id="jul_prod_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="jul_prod_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="jul_disp_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="jul_disp_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="jul_erec_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="jul_erec_sc" class="form-control form-control-sm"></td>
</tr>

                                    <tr><td>Aug</td>
                                    <td><input type="number" id="aug_prod_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="aug_prod_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="aug_disp_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="aug_disp_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="aug_erec_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="aug_erec_sc" class="form-control form-control-sm"></td>
                                    </tr>

                                    <tr><td>Sep</td>
                                    <td><input type="number" id="sep_prod_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="sep_prod_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="sep_disp_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="sep_disp_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="sep_erec_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="sep_erec_sc" class="form-control form-control-sm"></td>
                                    </tr>

                                    <tr><td>Oct</td>
                                    <td><input type="number" id="oct_prod_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="oct_prod_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="oct_disp_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="oct_disp_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="oct_erec_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="oct_erec_sc" class="form-control form-control-sm"></td>
                                    </tr>

                                    <tr><td>Nov</td>
                                    <td><input type="number" id="nov_prod_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="nov_prod_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="nov_disp_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="nov_disp_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="nov_erec_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="nov_erec_sc" class="form-control form-control-sm"></td>
                                    </tr>

                                    <tr><td>Dec</td><td><input type="number" id="dec_prod_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="dec_prod_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="dec_disp_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="dec_disp_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="dec_erec_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="dec_erec_sc" class="form-control form-control-sm"></td></tr>

                                    <tr><td>Jan</td>
<td><input type="number" id="jan_prod_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="jan_prod_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="jan_disp_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="jan_disp_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="jan_erec_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="jan_erec_sc" class="form-control form-control-sm"></td>
                                    </tr>

                                    <tr><td>Feb</td>
                                    <td><input type="number" id="feb_prod_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="feb_prod_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="feb_disp_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="feb_disp_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="feb_erec_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="feb_erec_sc" class="form-control form-control-sm"></td>
                                    </tr>

                                    <tr><td>Mar</td>
                                    <td><input type="number" id="mar_prod_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="mar_prod_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="mar_disp_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="mar_disp_sc" class="form-control form-control-sm"></td>

<td><input type="number" id="mar_erec_ih" class="form-control form-control-sm"></td>
<td><input type="number" id="mar_erec_sc" class="form-control form-control-sm"></td>
                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

            <div class="modal-footer">

                <button class="btn btn-danger btn-sm"
                        data-dismiss="modal">
                    Close
                </button>

                <button class="btn btn-success btn-sm"
                        onclick="openModalAdd();">
                    Create
                </button>

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


<div class="modal fade" id="exampleModalScrollableedit" tabindex="-1">

    <div class="modal-dialog modal-dialog-scrollable"
         style="max-width:1400px;">

        <div class="modal-content">

            <div class="modal-header bg-primary text-white">

                <h5 class="mb-0">
                    <b>Update Target Master</b>
                </h5>

                <button type="button"
                        class="close text-white"
                        data-dismiss="modal">
                    <span>&times;</span>
                </button>

            </div>

            <div class="modal-body">

                <input type="hidden" id="target_id">

                <!-- Basic Details -->
                <div class="form-row">

    <div class="form-group col-md-3">
        <label><b>Financial Year</b></label>
        <select id="financial_year_edit"
                class="form-control form-control-sm">
        </select>
    </div>

    <div class="form-group col-md-3">
        <label><b>Target Type</b></label>
        <select id="target_type_edit"
                class="form-control form-control-sm">
            <option value="TOTAL">Total</option>
            <option value="CONTRACT">Contract</option>
        </select>
    </div>

    <div class="form-group col-md-6"
         id="contractDivEdit">

        <label><b>Contract</b></label>

        <select class="form-control form-control-sm"
                id="contract_id_edit">
        </select>

    </div>

</div>

<div class="card mb-3">

    <div class="card-header py-2">
        <b>Annual Targets</b>
    </div>

    <div class="card-body p-2">

        <table class="table table-bordered table-sm text-center">

            <thead>

                <tr>
                    <th></th>
                    <th>Production</th>
                    <th>Dispatch</th>
                    <th>Erection</th>
                </tr>

            </thead>

            <tbody>

                <tr>

                    <th>In House</th>

                    <td>
                        <input type="number"
                               id="target_prod_ih_edit"
                               class="form-control form-control-sm">
                    </td>

                    <td>
                        <input type="number"
                               id="target_disp_ih_edit"
                               class="form-control form-control-sm">
                    </td>

                    <td>
                        <input type="number"
                               id="target_erec_ih_edit"
                               class="form-control form-control-sm">
                    </td>

                </tr>

                <tr>

                    <th>Sub Con</th>

                    <td>
                        <input type="number"
                               id="target_prod_sc_edit"
                               class="form-control form-control-sm">
                    </td>

                    <td>
                        <input type="number"
                               id="target_disp_sc_edit"
                               class="form-control form-control-sm">
                    </td>

                    <td>
                        <input type="number"
                               id="target_erec_sc_edit"
                               class="form-control form-control-sm">
                    </td>

                </tr>

                <tr>

                    <th>Total</th>

                    <td>
                        <input type="number"
                               id="target_prod_total_edit"
                               readonly
                               class="form-control form-control-sm bg-light">
                    </td>

                    <td>
                        <input type="number"
                               id="target_disp_total_edit"
                               readonly
                               class="form-control form-control-sm bg-light">
                    </td>

                    <td>
                        <input type="number"
                               id="target_erec_total_edit"
                               readonly
                               class="form-control form-control-sm bg-light">
                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</div>

<div class="form-group col-md-3">
    <label><b>Target Manhours</b></label>

    <input type="number"
           id="target_manhours_edit"
           class="form-control form-control-sm">
</div>

<hr>

<h6><b>Monthly Target Planning</b></h6>

<div class="table-responsive">

<table class="table table-bordered table-sm text-center">

    <thead>

        <tr>
            <th rowspan="2">Month</th>

            <th colspan="2">Production</th>
            <th colspan="2">Dispatch</th>
            <th colspan="2">Erection</th>
        </tr>

        <tr>
            <th>IH</th>
            <th>SC</th>

            <th>IH</th>
            <th>SC</th>

            <th>IH</th>
            <th>SC</th>
        </tr>

    </thead>

    <tbody>

        <tr>
            <td>Apr</td>
            <td><input type="number" id="apr_prod_ih_edit" class="form-control form-control-sm"></td>
            <td><input type="number" id="apr_prod_sc_edit" class="form-control form-control-sm"></td>

            <td><input type="number" id="apr_disp_ih_edit" class="form-control form-control-sm"></td>
            <td><input type="number" id="apr_disp_sc_edit" class="form-control form-control-sm"></td>

            <td><input type="number" id="apr_erec_ih_edit" class="form-control form-control-sm"></td>
            <td><input type="number" id="apr_erec_sc_edit" class="form-control form-control-sm"></td>
        </tr>

        <tr>
            <td>May</td>
            <td><input type="number" id="may_prod_ih_edit" class="form-control form-control-sm"></td>
            <td><input type="number" id="may_prod_sc_edit" class="form-control form-control-sm"></td>

            <td><input type="number" id="may_disp_ih_edit" class="form-control form-control-sm"></td>
            <td><input type="number" id="may_disp_sc_edit" class="form-control form-control-sm"></td>

            <td><input type="number" id="may_erec_ih_edit" class="form-control form-control-sm"></td>
            <td><input type="number" id="may_erec_sc_edit" class="form-control form-control-sm"></td>
        </tr>

<tr>
    <td>Jun</td>
    <td><input type="number" id="jun_prod_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="jun_prod_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="jun_disp_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="jun_disp_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="jun_erec_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="jun_erec_sc_edit" class="form-control form-control-sm"></td>
</tr>

<tr>
    <td>Jul</td>
    <td><input type="number" id="jul_prod_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="jul_prod_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="jul_disp_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="jul_disp_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="jul_erec_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="jul_erec_sc_edit" class="form-control form-control-sm"></td>
</tr>

<tr>
    <td>Aug</td>
    <td><input type="number" id="aug_prod_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="aug_prod_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="aug_disp_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="aug_disp_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="aug_erec_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="aug_erec_sc_edit" class="form-control form-control-sm"></td>
</tr>

<tr>
    <td>Sep</td>
    <td><input type="number" id="sep_prod_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="sep_prod_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="sep_disp_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="sep_disp_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="sep_erec_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="sep_erec_sc_edit" class="form-control form-control-sm"></td>
</tr>

<tr>
    <td>Oct</td>
    <td><input type="number" id="oct_prod_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="oct_prod_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="oct_disp_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="oct_disp_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="oct_erec_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="oct_erec_sc_edit" class="form-control form-control-sm"></td>
</tr>

<tr>
    <td>Nov</td>
    <td><input type="number" id="nov_prod_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="nov_prod_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="nov_disp_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="nov_disp_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="nov_erec_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="nov_erec_sc_edit" class="form-control form-control-sm"></td>
</tr>

<tr>
    <td>Dec</td>
    <td><input type="number" id="dec_prod_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="dec_prod_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="dec_disp_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="dec_disp_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="dec_erec_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="dec_erec_sc_edit" class="form-control form-control-sm"></td>
</tr>

<tr>
    <td>Jan</td>
    <td><input type="number" id="jan_prod_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="jan_prod_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="jan_disp_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="jan_disp_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="jan_erec_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="jan_erec_sc_edit" class="form-control form-control-sm"></td>
</tr>

<tr>
    <td>Feb</td>
    <td><input type="number" id="feb_prod_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="feb_prod_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="feb_disp_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="feb_disp_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="feb_erec_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="feb_erec_sc_edit" class="form-control form-control-sm"></td>
</tr>

<tr>
    <td>Mar</td>
    <td><input type="number" id="mar_prod_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="mar_prod_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="mar_disp_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="mar_disp_sc_edit" class="form-control form-control-sm"></td>

    <td><input type="number" id="mar_erec_ih_edit" class="form-control form-control-sm"></td>
    <td><input type="number" id="mar_erec_sc_edit" class="form-control form-control-sm"></td>
</tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

              <div class="modal-footer">

                <button class="btn btn-danger btn-sm"
                        data-dismiss="modal">
                    Close
                </button>

                <button class="btn btn-success btn-sm"
                        onclick="editevent();">
                    Update
                </button>

            </div>

        </div>
    </div>
  
 <!-- view gst -->
 
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
     <script src="js/Tragetmaster.js?v=<%=ts%>"></script>
   	<script src="js/logout.js"></script>
 	  <script src="js/username.js"></script>
 	  
 	    <script src="js/modifiedby.js"></script>
   	  <script src="js/createdby.js"></script>
   	   <script src="js/Sessionfilter.js"></script>
   	      	  <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
  <script src="js/permissions.js"></script>
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