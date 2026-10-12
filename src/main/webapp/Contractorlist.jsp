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
    <link rel="stylesheet"
      href="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css">
      
     <link rel="stylesheet" href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
      <link rel="stylesheet" href="css/main.css">
       
         <script src="externalLibrary/cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
<script src="externalLibrary/cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>

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
  /* To fix the dropdown max height and scrolling */
#taxDropdownMenu {
    max-height: 200px;
    overflow-y: auto;
}

/* Optional: Style checkboxes inside the dropdown */
.tax-checkbox {
    margin-right: 10px;
}

/* Optional: Make dropdown look cleaner */
.dropdown-menu {
    padding: 0;
    border-radius: 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
#taxDropdownMenu1 {
    max-height: 200px;
    overflow-y: auto;
}

/* Optional: Style checkboxes inside the dropdown */
.tax-checkbox1 {
    margin-right: 10px;
}

/* Optional: Make dropdown look cleaner */
.dropdown-menu1 {
    padding: 0;
    border-radius: 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
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
        #createbtn {
        background-color: #007bff; /* Blue background */
        color: white; /* White text */
        padding: 10px 20px; /* Add some padding */
        font-size: 16px; /* Increase font size */
        border: none; /* Remove default border */
        border-radius: 5px; /* Rounded corners */
        cursor: pointer; /* Pointer cursor on hover */
        transition: background 0.3s ease-in-out;
    }

    #createbtn:hover {
        background-color: #0056b3; /* Darker blue on hover */
    }

    #createbtn:active {
        background-color: #004099; /* Even darker when clicked */
    }
    
    .select2-container .select2-selection--single {
    height: calc(1.5em + 0.5rem + 2px) !important;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
}
.select2-container .select2-selection--single .select2-selection__arrow {
    height: 100% !important;
}
    </style>

  <script type="text/javascript">
 function noBack() {
     window.history.forward();
 }
 </script>
</head>

<body onload="fetchUserList();">
  <div id="wrapper">
    <!-- Sidebar -->
      <%@ include file="InVoiceSideBar.jsp" %>
      

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
          <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">Contractor List</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="InvoiceDashBoard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="InvoiceMasters.jsp">Master</a></li>
              <li class="breadcrumb-item active" aria-current="page">Contractor List</li>
              
            </ol>
          </div>
  <div class="row mb-3">
    <div class="table-responsive p-3">
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc; margin-top: -9px;
    margin-left: -15px;">
			        <button  data-toggle="modal"
                    id="#modalScroll"><i class="fas fa-plus"></i> Create</button>
			<button id="createbtn" 
			        onclick="redirectToMilestoneAssign()">
			Assign Milestone To Contract
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
<div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1000px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Create Contractor List</b></h5>
                  <button type="button" class="close white-button closecreate" data-dismiss="modal" aria-label="Close" >
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form>
    <div class="form-row">
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Contractor:</b></label>
        <select class="form-control form-control-sm" id="cont"></select>
        <div id="productCodeErrorcredit" class="error-message"></div>
    </div>
     <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Business Unit:</b></label>
        <select class="form-control form-control-sm" id="bus"></select>
        <div id="productCodeErrorcredit1" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
    <label><b>Invoice Type Calculation:</b></label>

    <!-- Visible (disabled) -->
    <input type="text"
           class="form-control form-control-sm"
           id="intypecal"
           value="Percentage"
           disabled>

    <!-- Hidden (actual value sent to server) -->
    <input type="hidden"
           id="intypecal_hidden"
           name="intypecal_hidden"
           value="2">

    <div id="productCodeErrorcredit2" class="error-message"></div>
</div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Enter Percentage(%):</b></label>
        <input type="text" class="form-control form-control-sm" id="per" placeholder="Enter percentage" autocomplete="off">
        <div id="productCodeErrorcredit3" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Invoice To:</b></label>
        <select class="form-control form-control-sm" id="into"></select>
        <div id="productCodeErrorcredit4" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Name & Address of Consignee:</b></label>
        <select class="form-control form-control-sm" id="consig"></select>
        <div id="productCodeErrorcredit5" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Shipment Mode:</b></label>
        <select class="form-control form-control-sm" id="ship"></select>
        <div id="productCodeErrorcredit6" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Delivery Condition:</b></label>
        <select class="form-control form-control-sm" id="del"></select>
        <div id="productCodeErrorcredit7" class="error-message"></div>
    </div>
    <!-- <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Product Description:</b></label>
        <input type="text" class="form-control form-control-sm" id="per0des" placeholder="Enter description" autocomplete="off">
        <div id="productCodeErrorcredit8" class="error-message"></div>
    </div> -->
     <div class="form-group col-md-4">
    <label><b>Product Description:</b></label>

    <!-- Visible (disabled) -->
    <input type="text"
           class="form-control form-control-sm"
           id="per0des"
           value="Productdesc"
           disabled>

    <!-- Hidden (actual value sent to server) -->
    <input type="hidden"
           id="per0des_hidden"
           name="per0des_hidden"
           value="1">

    <div id="productCodeErrorcredit8" class="error-message"></div>
</div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Bank Name:</b></label>
        <select class="form-control form-control-sm" id="bank"></select>
        <div id="productCodeErrorcredit9" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Work Order:</b></label>
        <select class="form-control form-control-sm" id="work"></select>
        <div id="productCodeErrorcredit10" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Registered Office:</b></label>
        <select class="form-control form-control-sm" id="reoffice"></select>
        <div id="productCodeErrorcredit11" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Service Code:</b></label>
        <select class="form-control form-control-sm" id="serco"></select>
        <div id="productCodeErrorcredit12" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>HSN Code:</b></label>
        <select class="form-control form-control-sm" id="hsncode"></select>
        <div id="productCodeErrorcredit13" class="error-message"></div>
    </div>
    <!-- <div class="form-group col-md-4">
									<label for="sapBuCode"><b>Tax Exclusive/Inclusive:</b></label> 
									<select class="form-control form-control-sm" id="taxein">
									<option value="">Select</option>
									<option>Exclusive</option>
									<option>Inclusive</option>
									</select>
									<div id="productCodeErrorcredit14" class="error-message"></div>
	</div> -->
	<div class="form-group col-md-4">
    <label><b>Tax Exclusive/Inclusive:</b></label>

    <!-- UI (read-only) -->
    <select class="form-control form-control-sm" id="taxein_display" disabled>
        <option value="1" selected>Exclusive</option>
        <option value="2">Inclusive</option>
    </select>

    <!-- Actual value sent to backend -->
    <input type="hidden" name="taxein" id="taxein" value="1">

    <div id="productCodeErrorcredit14" class="error-message"></div>
</div>

	<div class="form-group col-md-4">
									<label for="sapBuCode"><b>Taxable:</b></label> 
									<select class="form-control form-control-sm" id="yesno" onchange="toggleSelection('yesno')">
									<option value="">Select</option>
									<option>Yes</option>
									<option>No</option>
									</select>
									<div id="productCodeErrorcredit15" class="error-message"></div>
								</div>
	<div class="form-group col-md-4">
									<label for="sapBuCode"><b>Non Taxable:</b></label> 
									<select class="form-control form-control-sm" id="nonyesno" onchange="toggleSelection('nonyesno')">
									<option value="">Select</option>
									<option>Yes</option>
									<option>No</option>
									</select>
									<div id="productCodeErrorcredit16" class="error-message"></div>
								</div>
	<!-- <div class="form-group col-md-4">
									<label for="sapBuCode"><b>Tax is Payable or reverse Charges:</b></label> 
									<select class="form-control form-control-sm" id="payre11">
									<option value="">Select</option>
									<option>Yes</option>
									<option>No</option>
									</select>
									<div id="productCodeErrorcredit17" class="error-message"></div>
								</div> -->
	<div class="form-group col-md-4">
    <label><b>Tax is Payable or reverse Charges:</b></label>

    <!-- UI (read-only) -->
    <select class="form-control form-control-sm" id="payre11_display" disabled>
        <option value="1" selected>No</option>
        <option value="2">Yes</option>
    </select>

    <!-- Actual value sent to backend -->
    <input type="hidden" name="payre11" id="payre11" value="1">

    <div id="productCodeErrorcredit17" class="error-message"></div>
</div>
	<!-- <div class="form-group col-md-4">
									<label for="sapBuCode"><b>Freight Advance Recovery:</b></label> 
									<select class="form-control form-control-sm" id="fread">
									<option value="">Select</option>
									<option>Exclusive</option>
									<option>Inclusive</option>
									</select>
									<div id="productCodeErrorcredit18" class="error-message"></div>
								</div> -->
	<div class="form-group col-md-4">
    <label><b>Freight Advance Recovery:</b></label>

    <!-- UI (read-only) -->
    <select class="form-control form-control-sm" id="fread_display" disabled>
        <option value="1" selected>Inclusive</option>
        <option value="2">Exclusive</option>
    </select>

    <!-- Actual value sent to backend -->
    <input type="hidden" name="fread" id="fread" value="1">

    <div id="productCodeErrorcredit18" class="error-message"></div>
</div>
	<div class="form-group col-md-4">
    <label for="stateGstNo"><b>Tax:</b></label>
    <div class="dropdown">
        <button class="btn btn-sm btn-light dropdown-toggle" type="button" id="taxDropdown" data-bs-toggle="dropdown" aria-expanded="false"
        style="width: 100%;background-color: white;">
            Select tax
        </button>
        <ul class="dropdown-menu" id="taxDropdownMenu" style="max-height: 200px; overflow-y: auto;width: 100%;"></ul>
    </div>
    <div id="productCodeErrorcredit19" class="error-message"></div>
</div>
 <div class="form-group col-md-4">
    <label for="exportSelect"><b>Export:</b></label>
    <select class="form-control form-control-sm" id="exportSelect">
        <option value="no">No</option>
        <option value="yes">Yes</option>
    </select>
    <div id="productCodeErrorcredit20" class="error-message"></div>
</div>
<div class="form-group col-md-4">
							  <label for="factory"><b>Factory:</b></label> 
                  			  <select id="factory" class="form-control form-control-sm" required>
                      <!-- Options loaded dynamically -->
                 			   </select>
									<div id="factoryerror" class="error-message"></div>
								</div>
	<!-- Fields to be toggled -->
<div id="exportFields" class="row" style="display: none;">
    <div class="form-group col-md-6">
        <label for="are"><b>AREA Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="are" placeholder="Enter ARE Number" autocomplete="off">
        <div id="productCodeErrorcredit21" class="error-message"></div>
    </div>
    <div class="form-group col-md-6">
        <label for="lut"><b>LOT Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="lut" placeholder="Enter LUT Number" autocomplete="off">
        <div id="productCodeErrorcredit22" class="error-message"></div>
    </div>
    <div class="form-group col-md-6">
        <label for="connum"><b>Container Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="connum" placeholder="Enter Container Number" autocomplete="off">
        <div id="productCodeErrorcredit23" class="error-message"></div>
    </div>
    <div class="form-group col-md-6">
        <label for="epog"><b>EPCG License No:</b></label>
        <input type="text" class="form-control form-control-sm" id="epog" placeholder="Enter EPCG License No" autocomplete="off">
        <div id="productCodeErrorcredit24" class="error-message"></div>
    </div>
    <div class="form-group col-md-6">
        <label for="epog"><b>Export Title Text:</b></label>
        <select class="form-control form-control-sm" id="extitle"></select>
        <div id="productCodeErrorcredit25" class="error-message"></div>
    </div>
</div>

    </div>
</form>
</div>
    <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger closecreate" data-dismiss="modal" >Close</button>
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
                  <button type="button" class="btn btn-secondary btn-sm" id="closeModalBtn">NO</button> 
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
   <div class="modal fade" id="exampleModalScrollableEdit" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1000px;" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalScrollableTitle"><b>Update Contractor List</b></h5>
                  <button type="button" class="close white-button" id="closeModalBtn1">
    <span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
  <form id="productForm">
    <div class="form-row">
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Contractor:</b></label>
        <select class="form-control form-control-sm" id="cont1" disabled></select>
        <div id="productCodeErrorcredit1" class="error-message"></div>
    </div>
     <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Business Unit:</b></label>
        <select class="form-control form-control-sm" id="bus1"></select>
        <div id="productCodeErrorcredit11" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
    <label><b>Invoice Type Calculation:</b></label>

    <!-- Visible (disabled) -->
    <input type="text"
           class="form-control form-control-sm"
           id="intypecal1"
           value="Percentage"
           disabled>

    <!-- Hidden (actual value sent to server) -->
    <input type="hidden"
           id="intypecal1_hidden"
           name="intypecal1_hidden"
           value="2">

    <div id="productCodeErrorcredit2" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Enter Percentage(%):</b></label>
        <input type="text" class="form-control form-control-sm" id="per1" placeholder="Enter percentage" autocomplete="off">
        <div id="productCodeErrorcredit31" class="error-message"></div>
    </div>
    <div class="form-group col-md-4" style="display:none;">
        <label for="stateGstNo"><b>Id:</b></label>
        <input type="text" class="form-control form-control-sm" id="id">
        
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Invoice To:</b></label>
        <select class="form-control form-control-sm" id="into1"></select>
        <div id="productCodeErrorcredit41" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Name & Address of Consignee:</b></label>
        <select class="form-control form-control-sm" id="consig1"></select>
        <div id="productCodeErrorcredit51" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Shipment Mode:</b></label>
        <select class="form-control form-control-sm" id="ship1"></select>
        <div id="productCodeErrorcredit61" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Delivery Condition:</b></label>
        <select class="form-control form-control-sm" id="del1"></select>
        <div id="productCodeErrorcredit71" class="error-message"></div>
    </div>
  <!--   <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Product Description:</b></label>
        <input type="text" class="form-control form-control-sm" id="per0des1" placeholder="Enter description" autocomplete="off">
        <div id="productCodeErrorcredit81" class="error-message"></div>
    </div> -->
     <div class="form-group col-md-4">
    <label><b>Product Description:</b></label>

    <!-- Visible (disabled) -->
    <input type="text"
           class="form-control form-control-sm"
           id="per0des1"
           value="Productdesc"
           disabled>

    <!-- Hidden (actual value sent to server) -->
    <input type="hidden"
           id="per0des1_hidden"
           name="per0des1_hidden"
           value="1">

    <div id="productCodeErrorcredit81" class="error-message"></div>
</div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Bank Name:</b></label>
        <select class="form-control form-control-sm" id="bank1"></select>
        <div id="productCodeErrorcredit91" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Work Order:</b></label>
        <select class="form-control form-control-sm" id="work1"></select>
        <div id="productCodeErrorcredit101" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Registered Office:</b></label>
        <select class="form-control form-control-sm" id="reoffice1"></select>
        <div id="productCodeErrorcredit111" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>Service Code:</b></label>
        <select class="form-control form-control-sm" id="serco1"></select>
        <div id="productCodeErrorcredit121" class="error-message"></div>
    </div>
    <div class="form-group col-md-4">
        <label for="stateGstNo"><b>HSN Code:</b></label>
        <select class="form-control form-control-sm" id="hsncode1"></select>
        <div id="productCodeErrorcredit131" class="error-message"></div>
    </div>
 <!--    <div class="form-group col-md-4">
									<label for="sapBuCode"><b>Tax Exclusive/Inclusive:</b></label> 
									<select class="form-control form-control-sm" id="taxein1">
									<option value="">Select</option>
									<option>Exclusive</option>
									<option>Inclusive</option>
									</select>
									<div id="productCodeErrorcredit141" class="error-message"></div>
								</div> -->
	<div class="form-group col-md-4">
    <label><b>Tax Exclusive/Inclusive:</b></label>

    <!-- UI (read-only) -->
    <select class="form-control form-control-sm" id="taxein1_display" disabled>
        <option value="1" selected>Exclusive</option>
        <option value="2">Inclusive</option>
    </select>

    <!-- Actual value sent to backend -->
    <input type="hidden" name="taxein1" id="taxein1" value="1">

    <div id="productCodeErrorcredit141" class="error-message"></div>
</div>
	<div class="form-group col-md-4">
									<label for="sapBuCode"><b>Taxable:</b></label> 
									<select class="form-control form-control-sm" id="yesno1" onchange="toggleSelection1('yesno1')">
									<option value="">Select</option>
									<option>Yes</option>
									<option>No</option>
									</select>
									<div id="productCodeErrorcredit151" class="error-message"></div>
								</div>
	<div class="form-group col-md-4">
									<label for="sapBuCode"><b>Non Taxable:</b></label> 
									<select class="form-control form-control-sm" id="nonyesno1" onchange="toggleSelection1('nonyesno1')">
									<option value="">Select</option>
									<option>Yes</option>
									<option>No</option>
									</select>
									<div id="productCodeErrorcredit161" class="error-message"></div>
								</div>
<!-- 	<div class="form-group col-md-4">
									<label for="sapBuCode"><b>Tax is Payable or reverse Charges:</b></label> 
									<select class="form-control form-control-sm" id="payre111">
									<option value="">Select</option>
									<option>Yes</option>
									<option>No</option>
									</select>
									<div id="productCodeErrorcredit171" class="error-message"></div>
								</div> -->
	<div class="form-group col-md-4">
    <label><b>Tax is Payable or reverse Charges:</b></label>

    <!-- UI (read-only) -->
    <select class="form-control form-control-sm" id="payre111_display" disabled>
        <option value="1" selected>No</option>
        <option value="2">Yes</option>
    </select>

    <!-- Actual value sent to backend -->
    <input type="hidden" name="payre111" id="payre111" value="1">

    <div id="productCodeErrorcredit171" class="error-message"></div>
</div>
	<!-- <div class="form-group col-md-4">
									<label for="sapBuCode"><b>Freight Advance Recovery:</b></label> 
									<select class="form-control form-control-sm" id="fread1">
									<option value="">Select</option>
									<option>Exclusive</option>
									<option>Inclusive</option>
									</select>
									<div id="productCodeErrorcredit181" class="error-message"></div>
								</div> -->
	<div class="form-group col-md-4">
    <label><b>Freight Advance Recovery:</b></label>

    <!-- UI (read-only) -->
    <select class="form-control form-control-sm" id="fread1_display" disabled>
        <option value="1" selected>Inclusive</option>
        <option value="2">Exclusive</option>
    </select>

    <!-- Actual value sent to backend -->
    <input type="hidden" name="fread1" id="fread1" value="1">

    <div id="productCodeErrorcredit181" class="error-message"></div>
</div>
								
	<div class="form-group col-md-4">
    <label for="stateGstNo"><b>Tax:</b></label>
    <div class="dropdown">
        <button class="btn btn-sm btn-light dropdown-toggle" type="button" id="taxDropdown1" data-bs-toggle="dropdown" aria-expanded="false"
        style="width: 100%;background-color: white;">
            Select tax
        </button>
        <ul class="dropdown-menu" id="taxDropdownMenu1" style="max-height: 200px; overflow-y: auto;width: 100%;"></ul>
    </div>
    <div id="productCodeErrorcredit191" class="error-message"></div>
</div>
 <div class="form-group col-md-4">
    <label for="exportSelect1"><b>Export:</b></label>
    <select class="form-control form-control-sm" id="exportSelect1">
    <option value="">Select</option>
        <option value="no">No</option>
        <option value="yes">Yes</option>
    </select>
    <div id="productCodeErrorcredit201" class="error-message"></div>
</div>
<!-- <div class="form-group col-md-4">
        <label for="updfacid"><b>Factory:</b></label>
        <input type="text" class="form-control form-control-sm" id="updfacid" >
    </div> -->
    <div class="form-group col-md-4">
	<label for="updfacid"><b>Factory:</b></label> 
    <select id="updfacid" class="form-control form-control-sm" required>
    <!-- Options loaded dynamically -->
    </select>
	<!-- <div id="factoryerror" class="error-message"></div> -->
	</div>
	<!-- Fields to be toggled -->
<div id="exportFields1" class="row" style="display: none;">
    <div class="form-group col-md-5">
        <label for="are"><b>AREA Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="are1" placeholder="Enter ARE Number" autocomplete="off">
        <div id="productCodeErrorcredit211" class="error-message"></div>
    </div>
    <div class="form-group col-md-5">
        <label for="lut"><b>LOT Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="lut1" placeholder="Enter LUT Number" autocomplete="off">
        <div id="productCodeErrorcredit221" class="error-message"></div>
    </div>
    <div class="form-group col-md-5">
        <label for="connum"><b>Container Number:</b></label>
        <input type="text" class="form-control form-control-sm" id="connum1" placeholder="Enter Container Number" autocomplete="off">
        <div id="productCodeErrorcredit231" class="error-message"></div>
    </div>
    <div class="form-group col-md-5">
        <label for="epog"><b>EPCG License No:</b></label>
        <input type="text" class="form-control form-control-sm" id="epog1" placeholder="Enter EPCG License No" autocomplete="off">
        <div id="productCodeErrorcredit241" class="error-message"></div>
    </div>
    <div class="form-group col-md-6">
        <label for="epog"><b>Export Title Text:</b></label>
        <select class="form-control form-control-sm" id="extitle1"></select>
        <div id="productCodeErrorcredit251" class="error-message"></div>
    </div>
</div>

    </div>
</form>
</div>
    <div class="modal-footer">
    <button type="button" class="btn btn-sm btn-danger" id="closeModalBtn2">Close</button>
    <button type="button" class="btn btn-sm btn-success" id="updatecontractlist"
                   onclick="openModalUp();">Update</button>
</div>

              </div>
            </div>
          </div>
          
          <div class="modal fade" id="exampleModalCenteredit" tabindex="-1" role="dialog"
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
                  <b>Are you sure you want to Update?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" id="closeModalBtn3">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" onclick="editvent()">YES</button>
                </div>
              </div>
            </div>
          </div>

<!-- Scroll to top -->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>


  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="externalLibrary/cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    
      <script src="vendor/datatables/jquery.dataTables.min.js"></script>
      <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
       <script src="js/config.js?v=<%=jsVersion%>"></script>
    
   <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
    <script src="externalLibrary/html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
     <script src="js/contractorlist.js?v=<%=jsVersion%>"></script>
     <script src="js/contractorlistedit.js?v=<%=jsVersion%>"></script>
   	<script src="js/logout.js?v=<%=jsVersion%>"></script>
 	  <script src="js/username.js?v=<%=jsVersion%>"></script>
 	  
 	    <script src="js/modifiedby.js?v=<%=jsVersion%>"></script>
   	  <script src="js/createdby.js?v=<%=jsVersion%>"></script>
   	   <script src="js/Sessionfilter.js?v=<%=jsVersion%>"></script>
   	  <script>

  window.actionElementMap = {
  };
</script>
<script src="js/permissions.js?v=<%=jsVersion%>"></script>
<script>

function redirectToMilestoneAssign() {
    window.location.href = "contractormilestone.jsp";
}

</script>
<script>
    $(document).ready(function () {
        $("#exportSelect").change(function () {
            if ($(this).val() === "yes") {
                $("#exportFields").show();
            } else {
                $("#exportFields").hide();
            }
        });
    });
</script>
<script>
    $(document).ready(function () {
        $("#exportSelect1").change(function () {
            if ($(this).val() === "yes") {
                $("#exportFields1").show();
            } else {
                $("#exportFields1").hide();
            }
        });
    });
</script>
<script>
$(document).ready(function() {
    $("#closeModalBtn").click(function() {
        $("#exampleModalCenter66").modal("hide"); // Replace #exampleModal with your modal ID
    });
});
</script>
<script>
$(document).ready(function() {
    $("#closeModalBtn1").click(function() {
        $("#exampleModalScrollableEdit").modal("hide"); // Replace #exampleModal with your modal ID
    });
     $(".closecreate").click(function (){
    	$("#exampleModalScrollable").modal("hide");
    }) 
});
</script>
<script>
$(document).ready(function() {
    $("#closeModalBtn2").click(function() {
        $("#exampleModalScrollableEdit").modal("hide"); // Replace #exampleModal with your modal ID
    });
});
</script>
<script>
$(document).ready(function() {
    $("#closeModalBtn3").click(function() {
        $("#exampleModalCenteredit").modal("hide"); // Replace #exampleModal with your modal ID
    });
});
</script>
<script>
function toggleSelection(changedField) {
    let yesno = document.getElementById("yesno");
    let nonyesno = document.getElementById("nonyesno");

    if (changedField === "yesno") {
        if (yesno.value === "Yes") {
            nonyesno.value = "No";
        } else if (yesno.value === "No") {
            nonyesno.value = "Yes";
        } else {
            nonyesno.value = "";
        }
    } else if (changedField === "nonyesno") {
        if (nonyesno.value === "Yes") {
            yesno.value = "No";
        } else if (nonyesno.value === "No") {
            yesno.value = "Yes";
        } else {
            yesno.value = "";
        }
    }
}
</script>
<script>
function toggleSelection1(changedField) {
    let yesno1 = document.getElementById("yesno1");
    let nonyesno1 = document.getElementById("nonyesno1");

    if (changedField === "yesno1") {
        if (yesno1.value === "Yes") {
        	nonyesno1.value = "No";
        } else if (yesno1.value === "No") {
        	nonyesno1.value = "Yes";
        } else {
        	nonyesno1.value = "";
        }
    } else if (changedField === "nonyesno1") {
        if (nonyesno1.value === "Yes") {
        	yesno1.value = "No";
        } else if (nonyesno1.value === "No") {
        	yesno1.value = "Yes";
        } else {
        	yesno1.value = "";
        }
    }
}
</script>
  <!-- Page level custom scripts -->
 
</script>
</body>
</html>