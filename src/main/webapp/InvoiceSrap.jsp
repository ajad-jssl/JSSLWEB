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
  .pdf-loader {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(3px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  animation: fadeIn 0.2s ease-out;
}

.loader-card {
  background: #ffffff;
  padding: 28px 36px;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  text-align: center;
  font-family: "Segoe UI", Arial, sans-serif;
  min-width: 220px;
}

.spinner {
  width: 200px;
  height: 200px;
  border: 10px solid #e5e5e5;
  border-top: 10px solid #111;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto 14px auto;
}

.loader-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* animated dots */
.dots::after {
  content: "";
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0% { content: ""; }
  25% { content: "."; }
  50% { content: ".."; }
  75% { content: "..."; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
    
</style>
     <script>
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
    	window.location.href = "newlogin.jsp";
    }
    </script>
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

<body onload="fetchUserList();">
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
            <h1 class="h3 mb-0 text-gray-800">Scrap Invoice List</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="Dashboard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="SidemenuScrap.jsp">Scrap Page</a></li>
              <li class="breadcrumb-item active" aria-current="page">Invoice</li>
              
            </ol>
          </div>
         <div class="row mb-3">
         <button  data-toggle="modal"
                     id="#modalScroll"><i class="fas fa-plus"></i> Create</button>
                    <!-- <button  data-toggle="modal"
                    data-target="#exampleModalScrollableVV" id="#modalScroll"><i class="fas fa-plus"></i> Create</button> -->
    <div class="table-responsive p-3">
 <table class="table table-striped table-bordered table-sm" id="tableID" width="100%">
        </table>
    </div>
</div>
 </div>
  </div>
  </div>

<div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Create Scrap Invoice</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <!-- Sale Order Details -->
                    <div class="form-row">
    <div class="form-group col-md-4">
        <label for="scrapSaleOrder"><b>Scrap Packing Note:</b></label>
        <select class="form-control form-control-sm" id="scrappacnote">
            </select>
         </div>
    </div>
<div id="inputFieldsContainer" style="display: none;">
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-1 col-sm-12">
                <label for="scrapType"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="Inuom" readonly>
            </div>
            <div class="form-group col-md-1 col-sm-12">
                <label for="scrapItem"><b>Quantity:</b></label>
                <input type="text" class="form-control form-control-sm" id="inqty" readonly>
            </div>
            <div class="form-group col-md-1 col-sm-12">
                <label for="uom"><b>Kg:</b></label>
                <input type="text" class="form-control form-control-sm" id="inkg" readonly>
            </div>
            <!-- Quantity Input -->
            <div class="form-group col-md-1 col-sm-12">
                <label for="quantity"><b>Unit Price:</b></label>
                <input type="number" class="form-control form-control-sm" id="inunpr" readonly>
                </div>
            <!-- Kgs/MT Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="kgsMt"><b>Total:</b></label>
                <input type="number" class="form-control form-control-sm" id="intotal" readonly>
                </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="unitPrice"><b>Invoice Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="ininvoicetype" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>scpn:</b></label>
                <input type="text" class="form-control form-control-sm" id="scpn" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>scrapid:</b></label>
                <input type="text" class="form-control form-control-sm" id="scpid" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>typeid:</b></label>
                <input type="text" class="form-control form-control-sm" id="typeid" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12">
            <label for="totalor"><b>Service Code:</b></label>
            <select class="form-control form-control-sm" id="service">
                </select>
                <div id="productCodeError" class="error-message"></div>
        </div>
        <div class="form-group col-md-2 col-sm-12">
            <label for="totalso"><b>HSN Code:</b></label>
            <select class="form-control form-control-sm" id="hsncode">
                </select>
                <div id="productCodeError1" class="error-message"></div>
        </div>
        </div>
    </div>
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Tax Details</h5>
        
        <div class="form-row dynamic-row">
    <!-- Tax Name -->
    <div class="form-group col-md-2 col-sm-12">
        <label for="scrapType"><b>Tax:</b></label>
        <input type="text" class="form-control form-control-sm" id="intax1name" readonly>
        <input type="text" class="form-control form-control-sm" id="intax2name" readonly>
        <input type="text" class="form-control form-control-sm" id="intax3name" readonly>
        <!-- <select class="form-control form-control-sm" id="intax1name">
            </select>
        <select class="form-control form-control-sm" id="intax2name">
            </select>
        <select class="form-control form-control-sm" id="intax3name">
            </select> -->
      </div>

    <!-- Tax Percentage -->
    <div class="form-group col-md-2 col-sm-12">
        <label for="scrapItem"><b>Tax in %:</b></label>
        <input type="text" class="form-control form-control-sm" id="intax1" readonly>
        <input type="text" class="form-control form-control-sm" id="intax2" readonly>
        <input type="text" class="form-control form-control-sm" id="intax3" readonly>
    </div>

    <!-- Tax Value -->
    <div class="form-group col-md-2 col-sm-12">
        <label for="uom"><b>Tax Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="intavalue1" readonly>
        <input type="text" class="form-control form-control-sm" id="intavalue2" readonly>
        <input type="text" class="form-control form-control-sm" id="intavalue3" readonly>
    </div>

    <!-- Grand Total -->
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Grand Total:</b></label>
        <input type="text" class="form-control form-control-sm" id="ingrand" readonly>
    </div>

    <!-- Invoice Type -->
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Invoice Type:</b></label>
        <select class="form-control form-control-sm" id="invoicety"></select>
        <div id="productCodeError2" class="error-message"></div>
    </div>
</div>

    </div>
    
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Contract Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-3 col-sm-12">
                <label for="scrapType"><b>Business Unit:</b></label>
                <input type="text" class="form-control form-control-sm" id="inbusunit" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="uom"><b>Invoice TO:</b></label>
                <input type="text" class="form-control form-control-sm" id="ininto" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="kgsMt"><b>Shipment Mode</b></label>
                <select class="form-control form-control-sm" id="shipmode">
                </select>
                <div id="productCodeError5" class="error-message"></div>
                </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Work Order:</b></label>
                <input type="text" class="form-control form-control-sm" id="work" readonly>
                <div id="productCodeError6" class="error-message"></div>
                </div>
            <div class="form-group col-md-3 col-sm-12">
            <label for="totalor"><b>Name & Address of Consignee:</b></label>
            <input type="text" class="form-control form-control-sm" id="billing" readonly>
        </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Bank Name:</b></label>
            <select class="form-control form-control-sm" id="bakname">
                </select>
                <div id="productCodeError7" class="error-message"></div>
        </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Delivery Condition:</b></label>
            <select class="form-control form-control-sm" id="delivery">
                </select>
                <div id="productCodeError8" class="error-message"></div>
        </div>
        </div>
    </div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Product Description:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="prodes" autocomplete="off">
            <div id="productCodeError3" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remark" autocomplete="off">
            <div id="productCodeError4" class="error-message"></div>
        </div>
     </div>
</div>
                     <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-sm btn-primary" onclick="openModalAdd();">Create</button>
                    </div>
                </form>
            </div>
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
          			<div class="modal fade" id="exampleModalCenter16" tabindex="-1"
			role="dialog" aria-labelledby="exampleModalCenterTitle"
			aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content"
					style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
					<div class="modal-header1">
						<!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> -->
						<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
					</div>
					<div class="modal-body">
						<b>Are you sure you want to Cancel scrap Invoice?</b>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary btn-sm"
							data-dismiss="modal">NO</button>
						<button type="button" class="btn btn-info btn-sm"
							onclick="cancelRecord()">YES</button>
					</div>
				</div>
			</div>
		</div>
          
 <div class="modal fade" id="exampleModalScrollableVV" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123222" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123222"><b>Verify Scrap Invoice</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <!-- Sale Order Details -->
                    <div class="form-row">
    <div class="form-group col-md-4">
        <label for="scrapSaleOrder"><b>Scrap Packing Note:</b></label>
       <input type="text" class="form-control form-control-sm" id="pacV" readonly>
         </div>
    </div>
<div>
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="scrapType"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="Inuomv" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12">
                <label for="scrapItem"><b>Quantity:</b></label>
                <input type="text" class="form-control form-control-sm" id="inqtyv" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12">
                <label for="uom"><b>Kg:</b></label>
                <input type="text" class="form-control form-control-sm" id="inkgv" readonly>
            </div>
            <!-- Quantity Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="quantity"><b>Unit Price:</b></label>
                <input type="number" class="form-control form-control-sm" id="inunprv" readonly>
                </div>
            <!-- Kgs/MT Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="kgsMt"><b>Total:</b></label>
                <input type="number" class="form-control form-control-sm" id="intotalv" readonly>
                </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="unitPrice"><b>Invoice Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="ininvoicetypev" readonly>
                </div>
                <div class="form-group col-md-1 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>scpn:</b></label>
                <input type="text" class="form-control form-control-sm" id="scpnv" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>scrapid:</b></label>
                <input type="text" class="form-control form-control-sm" id="scpidv" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>typeid:</b></label>
                <input type="text" class="form-control form-control-sm" id="typeidv" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12">
            <label for="totalor"><b>Service Code:</b></label>
            <input type="text" class="form-control form-control-sm" id="servicev" readonly>
            </div>
        <div class="form-group col-md-2 col-sm-12">
            <label for="totalso"><b>HSN Code:</b></label>
            <input type="text" class="form-control form-control-sm" id="hsncodev" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Basic Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="basicV" readonly>
        </div>
        <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Payable to dept:</b></label>
        <input type="text" class="form-control form-control-sm" id="pydpt" readonly>
        </div>
        <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Payable by customer:</b></label>
        <input type="text" class="form-control form-control-sm" id="pydcu" readonly>
        </div>
        </div>
    </div>
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Tax Details</h5>
        
        <div class="form-row dynamic-row">
    <!-- Tax Name -->
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Tax:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxV" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Tax in %:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxVin" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Tax Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxVval" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>PTD:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxpt" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>PCB:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxpb" readonly>
    </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Tax:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxV1" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Tax in %:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxVin1" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Tax Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxVval1" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>PTD:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxpt1" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>PCB:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxpb1" readonly>
    </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Tax:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxV12" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Tax in %:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxVin12" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Tax Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxVval12" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>PTD:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxpt12" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>PCB:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxpb12" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12" style="margin-left: 42%;">
        <label for="totalso"><b>Grand Total:</b></label>
        <input type="text" class="form-control form-control-sm" id="ingrandv" readonly>
    </div>
</div>

    </div>
    
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Contract Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-3 col-sm-12">
                <label for="scrapType"><b>Business Unit:</b></label>
                <input type="text" class="form-control form-control-sm" id="inbusunitv" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="uom"><b>Invoice TO:</b></label>
                <input type="text" class="form-control form-control-sm" id="inintov" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="kgsMt"><b>Shipment Mode</b></label>
                <input type="text" class="form-control form-control-sm" id="shipmodev" readonly>
                </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Work Order:</b></label>
                <input type="text" class="form-control form-control-sm" id="workv" readonly>
                <div id="productCodeError6" class="error-message"></div>
                </div>
            <div class="form-group col-md-3 col-sm-12">
            <label for="totalor"><b>Name & Address of Consignee:</b></label>
            <input type="text" class="form-control form-control-sm" id="billingv" readonly>
        </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Bank Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="baknamev" readonly>
            </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Delivery Condition:</b></label>
            <input type="text" class="form-control form-control-sm" id="deliveryv" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12" style="display:none;">
            <label for="totalso"><b>id:</b></label>
            <input type="text" class="form-control form-control-sm" id="inid123" readonly>
            </div>
            </div>
    </div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Buyer's Reference No:</b></label>
        <input type="text" class="form-control form-control-sm" id="byrefno" readonly>
    </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Weighbridge Slip No:</b></label>
        <input type="text" class="form-control form-control-sm" id="wbno" readonly>
    </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Transporter Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="trname" readonly>
    </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Vehicle No:</b></label>
        <input type="text" class="form-control form-control-sm" id="vehino" readonly>
    </div>
        <div class="form-group col-md-3">
            <label for="totalor"><b>Product Description:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="prodesv" readonly>
            </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remarkv" readonly>
             </div>
             <div class="form-group col-md-3">
            <label for="totalso"><b>Remarks for GST Tax:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remagst" autocomplete="off">
             <div id="productCodeError96111" class="error-message"></div>
             </div>
     </div>
</div>
                     <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-sm btn-primary" onclick="openModalVerify();">Verify</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="exampleModalCenter66VV" tabindex="-1" role="dialog"
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
                  <b>Are you sure you want to Verify?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" onclick="addeventVV()">YES</button>
                </div>
              </div>
            </div>
          </div>
          
 <div class="modal fade" id="exampleModalScrollableVV11" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Verified Scrap Invoice Form</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <!-- Sale Order Details -->
                    <div class="form-row">
    <div class="form-group col-md-4">
        <label for="scrapSaleOrder"><b>Scrap Packing Note:</b></label>
       <input type="text" class="form-control form-control-sm" id="pacV11" readonly>
         </div>
    </div>
<div>
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="scrapType"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="Inuomv11" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12">
                <label for="scrapItem"><b>Quantity:</b></label>
                <input type="text" class="form-control form-control-sm" id="inqtyv11" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12">
                <label for="uom"><b>Kg:</b></label>
                <input type="text" class="form-control form-control-sm" id="inkgv11" readonly>
            </div>
            <!-- Quantity Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="quantity"><b>Unit Price:</b></label>
                <input type="number" class="form-control form-control-sm" id="inunprv11" readonly>
                </div>
            <!-- Kgs/MT Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="kgsMt"><b>Total:</b></label>
                <input type="number" class="form-control form-control-sm" id="intotalv11" readonly>
                </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="unitPrice"><b>Invoice Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="ininvoicetypev11" readonly>
                </div>
                <div class="form-group col-md-1 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>scpn:</b></label>
                <input type="text" class="form-control form-control-sm" id="scpnv11" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>scrapid:</b></label>
                <input type="text" class="form-control form-control-sm" id="scpidv11" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>typeid:</b></label>
                <input type="text" class="form-control form-control-sm" id="typeidv11" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12">
            <label for="totalor"><b>Service Code:</b></label>
            <input type="text" class="form-control form-control-sm" id="servicev11" readonly>
            </div>
        <div class="form-group col-md-2 col-sm-12">
            <label for="totalso"><b>HSN Code:</b></label>
            <input type="text" class="form-control form-control-sm" id="hsncodev11" readonly>
            </div>
            <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Basic Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="basicV11" readonly>
        </div>
        <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Payable to dept:</b></label>
        <input type="text" class="form-control form-control-sm" id="pydpt11" readonly>
        </div>
        <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Payable by customer:</b></label>
        <input type="text" class="form-control form-control-sm" id="pydcu11" readonly>
        </div>
        </div>
    </div>
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Tax Details</h5>
        
        <div class="form-row dynamic-row">
    <!-- Tax Name -->
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Tax:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxV11" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Tax in %:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxVin11" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Tax Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxVval11" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>PTD:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxpt11" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>PCB:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxpb11" readonly>
    </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Tax:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxV111" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Tax in %:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxVin111" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Tax Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxVval111" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>PTD:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxpt111" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>PCB:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxpb111" readonly>
    </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Tax:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxV1211" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Tax in %:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxVin1211" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>Tax Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxVval1211" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>PTD:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxpt1211" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12">
        <label for="totalso"><b>PCB:</b></label>
        <input type="text" class="form-control form-control-sm" id="intaxpb1211" readonly>
    </div>
    <div class="form-group col-md-2 col-sm-12" style="margin-left: 42%;">
        <label for="totalso"><b>Grand Total:</b></label>
        <input type="text" class="form-control form-control-sm" id="ingrandv11" readonly>
    </div>
</div>

    </div>
    
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Contract Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-3 col-sm-12">
                <label for="scrapType"><b>Business Unit:</b></label>
                <input type="text" class="form-control form-control-sm" id="inbusunitv11" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="uom"><b>Invoice TO:</b></label>
                <input type="text" class="form-control form-control-sm" id="inintov11" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="kgsMt"><b>Shipment Mode</b></label>
                <input type="text" class="form-control form-control-sm" id="shipmodev11" readonly>
                </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Work Order:</b></label>
                <input type="text" class="form-control form-control-sm" id="workv11" readonly>
                <div id="productCodeError6" class="error-message"></div>
                </div>
            <div class="form-group col-md-3 col-sm-12">
            <label for="totalor"><b>Name & Address of Consignee:</b></label>
            <input type="text" class="form-control form-control-sm" id="billingv11" readonly>
        </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Bank Name:</b></label>
            <input type="text" class="form-control form-control-sm" id="baknamev11" readonly>
            </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Delivery Condition:</b></label>
            <input type="text" class="form-control form-control-sm" id="deliveryv11" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12" style="display:none;">
            <label for="totalso"><b>id:</b></label>
            <input type="text" class="form-control form-control-sm" id="inid12311" readonly>
            </div>
            </div>
    </div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Buyer's Reference No:</b></label>
        <input type="text" class="form-control form-control-sm" id="byrefno11" readonly>
    </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Weighbridge Slip No:</b></label>
        <input type="text" class="form-control form-control-sm" id="wbno11" readonly>
    </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Transporter Name:</b></label>
        <input type="text" class="form-control form-control-sm" id="trname11" readonly>
    </div>
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Vehicle No:</b></label>
        <input type="text" class="form-control form-control-sm" id="vehino11" readonly>
    </div>
        <div class="form-group col-md-3">
            <label for="totalor"><b>Product Description:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="prodesv11" readonly>
            </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remarkv11" readonly>
             </div>
             <div class="form-group col-md-3">
            <label for="totalso"><b>Remarks for GST Tax:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remagst11" readonly>
             <div id="productCodeError96111" class="error-message"></div>
             </div>
     </div>
</div>
                     <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="exampleModalScrollableUpdate" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalScrollableTitle123"><b>Update Scrap Invoice</b></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <!-- Sale Order Details -->
                    <div class="form-row">
    <div class="form-group col-md-4">
        <label for="scrapSaleOrder"><b>Scrap Packing Note:</b></label>
        <input type="text" class="form-control form-control-sm" id="packup" readonly>
         </div>
    </div>
<div>
    <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Packing Note Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-1 col-sm-12">
                <label for="scrapType"><b>UOM:</b></label>
                <input type="text" class="form-control form-control-sm" id="Inuomup" readonly>
            </div>
            <div class="form-group col-md-1 col-sm-12">
                <label for="scrapItem"><b>Quantity:</b></label>
                <input type="text" class="form-control form-control-sm" id="inqtyup" readonly>
            </div>
            <div class="form-group col-md-1 col-sm-12">
                <label for="uom"><b>Kg:</b></label>
                <input type="text" class="form-control form-control-sm" id="inkgup" readonly>
            </div>
            <!-- Quantity Input -->
            <div class="form-group col-md-1 col-sm-12">
                <label for="quantity"><b>Unit Price:</b></label>
                <input type="number" class="form-control form-control-sm" id="inunprup" readonly>
                </div>
            <!-- Kgs/MT Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="kgsMt"><b>Total:</b></label>
                <input type="number" class="form-control form-control-sm" id="intotalup" readonly>
                </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-2 col-sm-12">
                <label for="unitPrice"><b>Invoice Type:</b></label>
                <input type="text" class="form-control form-control-sm" id="ininvoicetypeup" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>scpn:</b></label>
                <input type="text" class="form-control form-control-sm" id="scpnup" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>scrapid:</b></label>
                <input type="text" class="form-control form-control-sm" id="scpidup" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12" style="display:none;">
                <label for="unitPrice"><b>typeid:</b></label>
                <input type="text" class="form-control form-control-sm" id="typeidup" readonly>
                </div>
                <div class="form-group col-md-2 col-sm-12">
            <label for="totalor"><b>Service Code:</b></label>
            <select class="form-control form-control-sm" id="serviceup">
                </select>
                <div id="productCodeErrorup" class="error-message"></div>
        </div>
        <div class="form-group col-md-2 col-sm-12">
            <label for="totalso"><b>HSN Code:</b></label>
            <select class="form-control form-control-sm" id="hsncodeup">
                </select>
                <div id="productCodeError1up" class="error-message"></div>
        </div>
        </div>
    </div>
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Tax Details</h5>
        
        <div class="form-row dynamic-row">
    <!-- Tax Name -->
    <div class="form-group col-md-2 col-sm-12">
        <label for="scrapType"><b>Tax:</b></label>
        <input type="text" class="form-control form-control-sm" id="intax1nameup" readonly>
        <input type="text" class="form-control form-control-sm" id="intax2nameup" readonly>
        <input type="text" class="form-control form-control-sm" id="intax3nameup" readonly>
        <!-- <select class="form-control form-control-sm" id="intax1name">
            </select>
        <select class="form-control form-control-sm" id="intax2name">
            </select>
        <select class="form-control form-control-sm" id="intax3name">
            </select> -->
      </div>

    <!-- Tax Percentage -->
    <div class="form-group col-md-2 col-sm-12">
        <label for="scrapItem"><b>Tax in %:</b></label>
        <input type="text" class="form-control form-control-sm" id="intax1up" readonly>
        <input type="text" class="form-control form-control-sm" id="intax2up" readonly>
        <input type="text" class="form-control form-control-sm" id="intax3up" readonly>
    </div>

    <!-- Tax Value -->
    <div class="form-group col-md-2 col-sm-12">
        <label for="uom"><b>Tax Value:</b></label>
        <input type="text" class="form-control form-control-sm" id="intavalue1up" readonly>
        <input type="text" class="form-control form-control-sm" id="intavalue2up" readonly>
        <input type="text" class="form-control form-control-sm" id="intavalue3up" readonly>
    </div>

    <!-- Grand Total -->
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Grand Total:</b></label>
        <input type="text" class="form-control form-control-sm" id="ingrandup" readonly>
    </div>

    <!-- Invoice Type -->
    <div class="form-group col-md-3 col-sm-12">
        <label for="totalso"><b>Invoice Type:</b></label>
        <select class="form-control form-control-sm" id="invoicetyup"></select>
        <div id="productCodeError2up" class="error-message"></div>
    </div>
</div>

    </div>
    
     <div class="container mt-3" style="border: 2px solid black; border-radius: 10px; padding: 20px; background-color: white; width: 100%; max-width: 1600px;">
        <h5 class="text-center mb-4" style="font-weight: bold; color: black; text-transform: uppercase; text-decoration: underline;">Contract Details</h5>
        
        <div class="form-row dynamic-row">
            <!-- Scrap Type Dropdown -->
            <div class="form-group col-md-3 col-sm-12">
                <label for="scrapType"><b>Business Unit:</b></label>
                <input type="text" class="form-control form-control-sm" id="inbusunitup" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="uom"><b>Invoice TO:</b></label>
                <input type="text" class="form-control form-control-sm" id="inintoup" readonly>
            </div>
            <div class="form-group col-md-3 col-sm-12">
                <label for="kgsMt"><b>Shipment Mode</b></label>
                <select class="form-control form-control-sm" id="shipmodeup">
                </select>
                <div id="productCodeError5up" class="error-message"></div>
                </div>
            <!-- Unit Price Input -->
            <div class="form-group col-md-3 col-sm-12">
                <label for="unitPrice"><b>Work Order:</b></label>
                <input type="text" class="form-control form-control-sm" id="workup" readonly>
                <div id="productCodeError6" class="error-message"></div>
                </div>
            <div class="form-group col-md-3 col-sm-12">
            <label for="totalor"><b>Name & Address of Consignee:</b></label>
            <input type="text" class="form-control form-control-sm" id="billingup" readonly>
        </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Bank Name:</b></label>
            <select class="form-control form-control-sm" id="baknameup">
                </select>
                <div id="productCodeError7up" class="error-message"></div>
        </div>
        <div class="form-group col-md-3 col-sm-12">
            <label for="totalso"><b>Delivery Condition:</b></label>
            <select class="form-control form-control-sm" id="deliveryup">
                </select>
                <div id="productCodeError8up" class="error-message"></div>
        </div>
        </div>
    </div>
    <div class="form-row mt-3">
        <div class="form-group col-md-3">
            <label for="totalor"><b>Product Description:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="prodesup" autocomplete="off">
            <div id="productCodeError3up" class="error-message"></div>
        </div>
        <div class="form-group col-md-3">
            <label for="totalso"><b>Remarks:</b></label>
            <input type="text" class="form-control form-control-sm increased-height" id="remarkup" autocomplete="off">
            <div id="productCodeError4up" class="error-message"></div>
        </div>
        <div class="form-group col-md-1 col-sm-12" style="display:none;">
                <label for="scrapType"><b>ID:</b></label>
                <input type="text" class="form-control form-control-sm" id="idupdate">
            </div>
            <div class="form-group col-md-1 col-sm-12" style="display:none;">
                <label for="scrapType"><b>ItemID:</b></label>
                <input type="text" class="form-control form-control-sm" id="itemidupdate">
            </div>
     </div>
</div>
                     <div class="form-row mt-3" style="justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-sm btn-primary"  id="updatescrapinvoice" onclick="openModalUpdate();">Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
  
<div class="modal fade" id="exampleModalCenter66VVupdate" tabindex="-1" role="dialog"
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
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button> 
                    <button type="button" class="btn btn-info btn-sm" onclick="addeventupdate()">YES</button>
                </div>
              </div>
            </div>
          </div>
          
                   	<div id="pdfLoader" class="pdf-loader">
  <div class="loader-card">
    <div class="spinner"></div>
    <div class="loader-text">
      Downloading invoice
      <span class="dots"></span>
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
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  
  
  <script src="js/InvoiceSrap.js?v=<%=ts%>"></script>
   
  
    <script src="js/logout.js"></script>
  <script src="js/username.js"></script>
  
   <script src="js/createdby.js"></script>
 	   <script src="js/modifiedby.js"></script>
 	  <script src="js/factoryid.js"></script>
 	   <script src="js/Sessionfilter.js"></script>
 	       <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
 	   	   	  <script>
/* const moduleId = localStorage.getItem("selectedModuleId"); */
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>

<!-- <script>
  // Wait for a dynamically added element by ID
  function waitForElementById(id, callback) {
    const existing = document.getElementById(id);
    if (existing) {
      callback(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const found = document.getElementById(id);
      if (found) {
        observer.disconnect();
        callback(found);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Get the mapped ID from the action map and wait for it
  document.addEventListener("DOMContentLoaded", function () {
    const printId = window.actionElementMap["Print"];
    
    waitForElementById(printId, function (printElement) {
      console.log("Found dynamic print element:", printElement);

 

      // You could also re-bind the onclick dynamically, if needed
      // printElement.onclick = function () {
      //   printRecord('1'); // or dynamic ID
      // };
    });
  });
</script> -->



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