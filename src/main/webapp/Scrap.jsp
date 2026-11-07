<%@page import="com.JSSL2024.property.PropertyLink"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
  response.setHeader("Pragma", "no-cache"); // HTTP 1.0
  response.setDateHeader("Expires", 0); // Proxies
%>

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

  <style>
 .error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    display: none; /* Hidden by default */
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
div.dt-buttons>.dt-button:first-child, div.dt-buttons>div.dt-button-split .dt-button:first-child {
    margin-left: 0;
    background-color: #336699 !important;
    color: white;
    padding: 4px 10px;
  }

  /* line item tables (create + update) */
  #saleOrderDetailsTable td, #saleOrderDetailsTableUP td { vertical-align: middle; }
  #saleOrderDetailsTable .sl-no, #saleOrderDetailsTableUP .sl-no { width: 45px; text-align: center; }
  .deleteRowBtn { background-color: #dc3545; }
  .deleteRowBtn:hover { background-color: #bb2d3b; }

</style>
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
</head>

<body >
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
            <h1 class="h3 mb-0 text-gray-800">Sales Order List</h1>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="InvoiceDashBoard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="SidemenuScrap.jsp">Scrap Page</a></li>
             <li class="breadcrumb-item active" aria-current="page">Scrap</li>

            </ol>
          </div>
          <div class="row mb-3">
<div class="col-lg-12">
  <div class="card mb-4">
    <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between" style="background-color: #f8f9fc;">
        <button data-toggle="modal" id="modalScroll1">
          <i class="fas fa-plus"></i> Create
        </button>
      </div>
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
  </div>

 <!-- ===================== CREATE SALE ORDER MODAL ===================== -->
 <div class="modal fade" id="exampleModalScrollable123" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true" onload="generateSaleOrderNumber();">
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Create Sale Order</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Sale Order Section -->
        <div class="border p-3 mb-3">

          <div class="row">
            <div class="col-md-3">
              <label for="saleOrderNo">Sale Order No</label>
              <input type="text" id="saleOrderNo" class="form-control form-control-sm" readonly>
              <div id="productCodeError1" class="error-message"></div>
            </div>
            <div class="col-md-3">
              <label for="saleOrderTypeAdd">Sale Order Type</label>
               <select class="form-control form-control-sm" id="saleOrderTypeAdd">
                </select>
                <div id="productCodeError2" class="error-message"></div>
          </div>
            <div class="col-md-3">
              <label for="locationTypeAdd">Location Type</label>
                <select class="form-control form-control-sm" id="locationTypeAdd">
                </select>
               <div id="productCodeError3" class="error-message"></div>
            </div>
                     <div class="col-md-3">
    <label for="saleOrderTo">Sale Order To</label>
    <select id="saleOrderTo" class="form-control form-control-sm">
    </select>
    <div id="productCodeError4" class="error-message"></div>
</div>
  </div>
        </div>

        <!-- Sale Order Details Section (multiple line items) -->
       <div class="border p-3 mb-3">
  <h5 class="form-control form-control-sm">Sale Order Details</h5>
  <table class="table table-bordered" id="saleOrderDetailsTable">
    <thead>
      <tr>
        <th>Sl No</th>
        <th>E-Auction No</th>
        <th>Scrap Type</th>
        <th>Scrap Item</th>
        <th>UOM</th>
        <th>Quantity</th>
        <th>Kgs</th>
        <th>Unit Price</th>
        <th>Total</th>
        <th>Tolerance</th>
        <th>Delete</th>
      </tr>
    </thead>
    <!-- rows are generated by Scrap.js (addItemRow) -->
    <tbody id="itemRows"></tbody>
  </table>
  <button type="button" class="btn btn-primary btn-sm" id="addItemBtn">
    <i class="fas fa-plus"></i> Add New Item
  </button>
  <div id="itemsError" class="error-message"></div>

  <div class="d-flex align-items-center">
    <div class="col-md-3 ms-3" style="margin-left: 68%;">
        <label for="totalNo">Total</label>
        <input type="text" id="totalNo" class="form-control form-control-sm" readonly>
    </div>
</div>

</div>

  <!-- Additional Details Section -->
        <div class="border p-3">
          <h5 class="mb-3">Additional Details</h5>
          <div class="row">
            <div class="col-md-4">
              <label for="auctionDate">Auction Date</label>
              <input type="date" id="auctionDate" class="form-control form-control-sm">
              <div id="productCodeError13" class="error-message"></div>
            </div>
            <div class="col-md-4">
              <label for="durationDate">Sale Order Duration Date</label>
              <input type="date" id="durationDate" class="form-control form-control-sm">
              <div id="productCodeError14" class="error-message"></div>
            </div>
            <div class="col-md-4">
              <label for="advancePayment">Advance Payment %</label>
              <input type="text" id="advancePayment" class="form-control form-control-sm" autocomplete="off">
              <div id="productCodeError15" class="error-message"></div>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-4">
              <label>Billing Address</label>
              <select id="billingadd" class="form-control form-control-sm">
              </select>
              <div id="productCodeError16" class="error-message"></div>
            </div>
            <div class="col-md-4">
              <label>Shipping Address</label>
              <select id="shippingadd" class="form-control form-control-sm">
              </select>
              <div id="productCodeError17" class="error-message"></div>
            </div>
            <div class="col-md-4">
              <label>JSSL Business Unit Address</label>
               <select class="form-control form-control-sm" id="businessUnitAddress">
                </select>
                <div id="productCodeError18" class="error-message"></div>
              </div>
          </div>

          <!-- Tax Details -->
          <div class="row mt-3">
            <div class="col-md-4">
              <label>Tax 1</label>
              <select class="form-control form-control-sm" id="tax1add">
                </select>
                <div id="productCodeError19" class="error-message"></div>
              <input type="text" class="form-control form-control-sm" id="tax11" placeholder="Tax in %" readonly>
              <input type="text" class="form-control form-control-sm" id="tax1value" placeholder="Tax Value" readonly>
            </div>
            <div class="col-md-4">
              <label>Tax 2</label>
              <select class="form-control form-control-sm" id="tax2add">
                </select>
                <div id="productCodeError20" class="error-message"></div>
              <input type="text" class="form-control form-control-sm" id="tax12" placeholder="Tax in %" readonly>
              <input type="text" class="form-control form-control-sm" id="tax2value" placeholder="Tax Value" readonly>
            </div>
            <div class="col-md-4">
              <label>Tax 3</label>
              <select class="form-control form-control-sm" id="tax3add">
                </select>
                <div id="productCodeError21" class="error-message"></div>
              <input type="text" class="form-control form-control-sm" id="tax13" placeholder="Tax in %" readonly>
              <input type="text" class="form-control form-control-sm" id="tax3value" placeholder="Tax Value" readonly>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-4">
              <label for="netAmount">Net Amount</label>
              <input type="text" id="netAmount" class="form-control form-control-sm" readonly>
            </div>
            <div class="col-md-4">
              <label for="totalTax">Total Tax</label>
              <input type="text" id="totalTax" class="form-control form-control-sm" readonly>
            </div>
            <div class="col-md-4">
              <label for="grandTotal">Grand Total</label>
              <input type="text" id="grandTotal" class="form-control form-control-sm" readonly>
            </div>
          </div>
        </div>

        <!-- Terms & Conditions -->
        <div class="border p-3 mt-3">
    <h5>Terms & Conditions</h5>

    <table id="myTable" class="table">
        <tbody>
            <!-- Fixed 5 rows -->
            <tr>
                <td><textarea class="form-control textarea" readonly>1. Duration: This sale order is valid till completion of lifting of above quantity or within given duration date</textarea></td>
            </tr>
            <tr>
                <td><textarea class="form-control textarea" readonly>2. Taxes will be applicable as per the prevailing rates at the time of dispatch. In case of any variance due to GST regulations, the basic rates will be considered and other statutory duties and taxes will be applicable according to new Act at the time of dispatch.</textarea></td>
            </tr>
            <tr>
                <td><textarea class="form-control textarea" readonly>3. Transportation and Loading of scrap shall be in your scope.</textarea></td>
            </tr>
            <tr>
                <td><textarea class="form-control textarea" readonly>4. Lifting of scrap shall be allowed between 9.00AM to 5.00PM only on working days. Lifting schedule will be informed to you as and when required.</textarea></td>
            </tr>
            <tr>
                <td><textarea class="form-control textarea" readonly>5. JSW Severfield Structures Ltd., have the right to cancel the Sale Order at any time without assigning any reasons by giving a week's notice to the party.</textarea></td>
            </tr>
        </tbody>
    </table>

    <button type="button" class="btn btn-sm btn-secondary" onclick="addNewRow()">
        Add New Row
    </button>
</div>

      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick="openModalAdd();">Create</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="exampleModalCenter66" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 54%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1">
                 </div>
                <div class="modal-body">
                  <b>Are you sure you want to create?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button>
                    <button type="button" class="btn btn-info btn-sm" onclick="addevent();">YES</button>
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
					</div>
					<div class="modal-body">
						<b>Are you sure you want to Cancel Scrap Sale Order?</b>
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

<!-- ===================== UPDATE SALE ORDER MODAL ===================== -->
<div class="modal fade" id="exampleModalScrollable123Update" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable" style="max-width: 1540px;" role="document">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitleUp">Update Sale Order</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Sale Order Section -->
        <div class="border p-3 mb-3">

          <div class="row">
            <div class="col-md-3">
              <label for="saleOrderNoUP">Sale Order No</label>
              <input type="text" id="saleOrderNoUP" class="form-control form-control-sm" readonly>
              <div id="productCodeError1up" class="error-message"></div>
            </div>
            <div class="col-md-3">
              <label for="saleOrderTypeAddup">Sale Order Type</label>
               <select class="form-control form-control-sm" id="saleOrderTypeAddup">
                </select>
                <div id="productCodeError2up" class="error-message"></div>
          </div>
            <div class="col-md-3">
              <label for="locationTypeAddUP">Location Type</label>
                <select class="form-control form-control-sm" id="locationTypeAddUP">
                </select>
               <div id="productCodeError3up" class="error-message"></div>
            </div>
                     <div class="col-md-3">
    <label for="saleOrderToup">Sale Order To</label>
    <select id="saleOrderToup" class="form-control form-control-sm">
    </select>
    <div id="productCodeError4up" class="error-message"></div>
</div>
  </div>
        </div>

        <!-- Sale Order Details Section (multiple line items) -->
       <div class="border p-3 mb-3">
  <h5 class="form-control form-control-sm">Sale Order Details</h5>

  <table class="table table-bordered" id="saleOrderDetailsTableUP">
    <thead>
      <tr>
        <th>Sl No</th>
        <th>E-Auction No</th>
        <th>Scrap Type</th>
        <th>Scrap Item</th>
        <th>UOM</th>
        <th>Quantity</th>
        <th>Kgs</th>
        <th>Unit Price</th>
        <th>Total</th>
        <th>Tolerance</th>
        <th>Delete</th>
      </tr>
    </thead>
    <!-- rows are generated by scrapedit.js (editRecord / addItemRowUp) -->
    <tbody id="itemRowsUp"></tbody>
  </table>
  <button type="button" class="btn btn-primary btn-sm" id="addItemBtnUp">
    <i class="fas fa-plus"></i> Add New Item
  </button>
  <div id="itemsErrorUp" class="error-message"></div>

  <div class="d-flex align-items-center">
    <div class="col-md-3 ms-3" style="margin-left: 68%;">
      <label for="totalNoUp">Total</label>
      <input type="text" id="totalNoUp" class="form-control form-control-sm" readonly>
    </div>
  </div>
</div>

  <!-- Additional Details Section -->
        <div class="border p-3">
          <h5 class="mb-3">Additional Details</h5>
          <div class="row">
            <div class="col-md-4">
              <label for="auctionDateup">Auction Date</label>
              <input type="date" id="auctionDateup" class="form-control form-control-sm">
              <div id="productCodeError13up" class="error-message"></div>
            </div>
            <div class="col-md-4">
              <label for="durationDateup">Sale Order Duration Date</label>
              <input type="date" id="durationDateup" class="form-control form-control-sm">
              <div id="productCodeError14up" class="error-message"></div>
            </div>
            <div class="col-md-4">
              <label for="advancePaymentup">Advance Payment %</label>
              <input type="text" id="advancePaymentup" class="form-control form-control-sm">
              <div id="productCodeError15up" class="error-message"></div>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-4">
              <label>Billing Address</label>
              <select id="billingaddup" class="form-control form-control-sm">
              </select>
              <div id="productCodeError16up" class="error-message"></div>
            </div>
            <div class="col-md-4">
              <label>Shipping Address</label>
              <select id="shippingaddup" class="form-control form-control-sm">
              </select>
              <div id="productCodeError17up" class="error-message"></div>
            </div>
            <div class="col-md-4">
              <label>JSSL Business Unit Address</label>
               <select class="form-control form-control-sm" id="businessUnitAddressup">
                </select>
                <div id="productCodeError18up" class="error-message"></div>
              </div>
          </div>

          <!-- Tax Details -->
          <div class="row mt-3">
            <div class="col-md-4">
              <label>Tax 1</label>
              <select class="form-control form-control-sm" id="tax1addup">
                </select>
                <div id="productCodeError19up" class="error-message"></div>
              <input type="text" class="form-control form-control-sm" id="tax11up" placeholder="Tax in %" readonly>
              <input type="text" class="form-control form-control-sm" id="tax1valueup" placeholder="Tax Value" readonly>
            </div>
            <div class="col-md-4">
              <label>Tax 2</label>
              <select class="form-control form-control-sm" id="tax2addup">
                </select>
                <div id="productCodeError20up" class="error-message"></div>
              <input type="text" class="form-control form-control-sm" id="tax12up" placeholder="Tax in %" readonly>
              <input type="text" class="form-control form-control-sm" id="tax2valueup" placeholder="Tax Value" readonly>
            </div>
            <div class="col-md-4">
              <label>Tax 3</label>
              <select class="form-control form-control-sm" id="tax3addup">
                </select>
                <div id="productCodeError21up" class="error-message"></div>
              <input type="text" class="form-control form-control-sm" id="tax13up" placeholder="Tax in %" readonly>
              <input type="text" class="form-control form-control-sm" id="tax3valueup" placeholder="Tax Value" readonly>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-4">
              <label for="netAmountup">Net Amount</label>
              <input type="text" id="netAmountup" class="form-control form-control-sm" readonly>
            </div>
            <div class="col-md-4">
              <label for="totalTaxup">Total Tax</label>
              <input type="text" id="totalTaxup" class="form-control form-control-sm" readonly>
            </div>
            <div class="col-md-4">
              <label for="grandTotalup">Grand Total</label>
              <input type="text" id="grandTotalup" class="form-control form-control-sm" readonly>
            </div>
            <!-- header id of the sale order (hidden) -->
            <div class="col-md-4" style="display:none;">
              <label for="soeid">ID</label>
              <input type="text" id="soeid" class="form-control form-control-sm">
            </div>
          </div>
        </div>

        <!-- Terms & Conditions -->
        <div class="border p-3 mt-3">
          <h5>Terms & Conditions</h5>
          <table id="myTablup" class="table">
        <tbody>
            <tr>
                <td id="rowsContainer">
                    <textarea class="form-control textareaup" id="termsup">Duration</textarea>
                </td>
            </tr>
            </tbody>
    </table>
          <button type="button" class="btn btn-sm btn-secondary" onclick="addNewRowup()">Add New Row</button>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id="updatescrappackg" onclick="openModalUpdate();">Update</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="exampleModalCenter66update" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" style="width: 54%;right: -22%;border-width: thick;border-color: #eaecf4;">
                 <div class="modal-header1">
                 </div>
                <div class="modal-body">
                  <b>Are you sure you want to update?</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">NO</button>
                    <button type="button" class="btn btn-info btn-sm" onclick="updateevent();">YES</button>
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
        <script src="js/ruang-admin.min.js"></script>

        <script src="vendor/datatables/jquery.dataTables.min.js"></script>
        <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>

        <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
     <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
      <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
      <script src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
      <script src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
    <!-- Scrap.js MUST load before scrapedit.js (scrapedit.js uses its helpers) -->
    <script src="js/Scrap.js?v=<%=ver(application, "/js/Scrap.js")%>"></script>
    <script src="js/scrapedit.js?v=<%=ver(application, "/js/scrapedit.js")%>"></script>
   <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>

    <script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
 	     <script src="js/modifiedby.js?v=<%=ver(application, "/js/modifiedby.js")%>"></script>
 	    <script src="js/factoryid.js?v=<%=ver(application, "/js/factoryid.js")%>"></script>
 	     <script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
 	   	  <script>
  // This maps action names from the API to button IDs on this page
  window.actionElementMap = {
  };
</script>
  <script src="js/permissions.js?v=<%=ver(application, "/js/permissions.js")%>"></script>
</body>
</html>
