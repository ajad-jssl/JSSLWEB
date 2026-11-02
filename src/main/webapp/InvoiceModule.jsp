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
   <link href="css/newmasterfile.css" rel="stylesheet">
   
   
   
<!--    <link href="https://stackpath.bootstrapcdn.com/bootstrap/5.1.0/css/bootstrap.min.css" rel="stylesheet"> -->


<script type="text/javascript">
 function noBack() {
     window.history.forward();
 }
 </script>
</head>


  
<body>
<div id="wrapper">
    <!-- Sidebar -->
    <%@ include file="InVoiceSideBar.jsp" %>
   
    <!-- Content Wrapper -->
    <div id="content-wrapper" class="d-flex flex-column">
      <div id="content">
        <!-- TopBar -->
        <nav class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top" style="background-color: #37499A;">
            <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
                <i class="fa fa-bars"></i>
            </button>

            <ul class="navbar-nav ml-auto">
            <!--     <div class="dropdown-checkbox" style="position: relative; display: inline-block;">
                    <button class="dropdown-toggle" style="
                        background-color: white; 
                        color: black; 
                        border: none; 
                        padding: 10px 20px; 
                        border-radius: 5px; 
                        font-size: 14px; 
                        cursor: pointer; 
                        margin-top: 14px;
                        transition: background-color 0.3s ease;
                    ">
                        Select Factory
                    </button>
                    <div class="dropdown-menu" style="
                        display: none; 
                        position: absolute; 
                        top: 100%; 
                        left: 0; 
                        border: 1px solid #ccc; 
                        background: #fff; 
                        z-index: 1000; 
                        padding: 10px; 
                        width: 200px; 
                        max-height: 200px; 
                        overflow-y: auto;
                    ">
                        Factory items will be dynamically added here
                    </div>
                </div> -->
                <!-- Home Button -->
                <button class="btn btn-link" onclick="window.location.href='Landingpage.jsp'" style="background-color: transparent; color: white; border: none;">
                    <i class="fa fa-home"></i>
                </button>

                <div class="topbar-divider d-none d-sm-block"></div>

                <!-- User Dropdown -->
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
          
         
<div class="container mt-5" style="margin-left:-5px;">
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="advance-tab" data-bs-toggle="tab" href="#advance" role="tab" aria-controls="advance" aria-selected="true">Advance</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="debitcredit-tab" data-bs-toggle="tab" href="#debitcredit" role="tab" aria-controls="debitcredit" aria-selected="false">Debit Credit</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="deliverychallan-tab" data-bs-toggle="tab" href="#deliverychallan" role="tab" aria-controls="deliverychallan" aria-selected="false">Delivery Challan</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="scrap-tab" data-bs-toggle="tab" href="#scrap" role="tab" aria-controls="scrap" aria-selected="false">Scrap</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="steel-tab" data-bs-toggle="tab" href="#steel" role="tab" aria-controls="steel" aria-selected="false">Steel</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="consolidated-tab" data-bs-toggle="tab" href="#consolidated" role="tab" aria-controls="consolidated" aria-selected="false">Consolidated</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="Other-tab" data-bs-toggle="tab" href="#Other" role="tab" aria-controls="Other" aria-selected="false">Other</a>
  </li>
</ul>

 <div class="tab-content" id="myTabContent">
      <!-- Tab Content -->
  <div class="tab-pane fade " id="advance" role="tabpanel" aria-labelledby="advance-tab" ><!-- show active -->
  <div class="card-container" style="padding-top:5%;">
  <!-- First Card (Sale Order) -->
  <div class="col-md-4" data-page="AdvancePackingNote.jsp" onclick="window.location.href='AdvancePackingNote.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-cogs fa-3x mb-2 text-warning"></i> <!-- Scrap QS Packing Icon -->
        <h5 class="card-title">Advance Packing Note</h5>
        <p class="card-text">Manage Advance and packaging</p>
      </div>
    </div>
  </div>

  <!-- Third Card (Scrap Invoice) -->
  <div class="col-md-4" data-page="AdvanceInvoiceEntry.jsp" onclick="window.location.href='AdvanceInvoiceEntry.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-file-invoice fa-3x mb-2 text-success"></i> <!-- Scrap Invoice Icon -->
        <h5 class="card-title">Advance Invoice Entry</h5>
        <p class="card-text">Create and Manage Advance Invoice Entry</p>
      </div>
    </div>
  </div>      
  </div>
  </div>
    
   
 <div class="tab-pane fade" id="debitcredit" role="tabpanel" aria-labelledby="debitcredit-tab">
        <!-- Organization Card -->
  <div class="card-container" style="padding-top:5%;">
  <div class="col-md-4" data-page="DebitCreditPackingNote.jsp" onclick="window.location.href='DebitCreditPackingNote.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-cogs fa-3x mb-2 text-warning"></i> <!-- Scrap QS Packing Icon -->
        <h5 class="card-title">Debit Credit Packing Note</h5>
        <p class="card-text">Manage Debit Credit and packaging</p>
      </div>
    </div>
  </div>

  <!-- Third Card (Scrap Invoice) -->
 <div class="col-md-4" data-page="DebitCreditInvoiceEntry.jsp" onclick="window.location.href='DebitCreditInvoiceEntry.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-file-invoice fa-3x mb-2 text-success"></i> <!-- Scrap Invoice Icon -->
         <h5 class="card-title">Debit Credit Invoice Entry</h5>
        <p class="card-text">Create and Manage Debit Credit Invoice Entry</p>
      </div>
    </div>
  </div> 
  </div>
 </div>
      
      
  <div class="tab-pane fade" id="deliverychallan" role="tabpanel" aria-labelledby="deliverychallan-tab">
         <!-- User Card -->
  <div class="card-container" style="padding-top:5%;">
     <!-- First Card (Sale Order) -->
  <div class="col-md-4" data-page="ChallanPackingNote.jsp"  onclick="window.location.href='ChallanPackingNote.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-cogs fa-3x mb-2 text-warning"></i> <!-- Scrap QS Packing Icon -->
        <h5 class="card-title">Delivery Challan Packing Note</h5>
        <p class="card-text">Manage Delivery Challan and packaging</p>
      </div>
    </div>
  </div>

  <!-- Third Card (Scrap Invoice) -->
  <div class="col-md-5" data-page="ChallanInvoiceEntry.jsp" onclick="window.location.href='ChallanInvoiceEntry.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-file-invoice fa-3x mb-2 text-success"></i> <!-- Scrap Invoice Icon --> 
        <h5 class="card-title">Delivery Challan Invoice Entry</h5>
        <p class="card-text">Create and Manage Delivery Challan Invoice Entry</p>
      </div>
    </div>
  </div>
  

 </div>  
</div>


 <div class="tab-pane fade" id="consolidated" role="tabpanel" aria-labelledby="consolidated-tab">
       <!-- User Card -->
  <div class="card-container" style="padding-top:5%;">

 <!-- First Card (Sale Order) -->
  <div class="col-md-4"  data-page="ConsolidatedPackingNote.jsp" onclick="window.location.href='ConsolidatedPackingNote.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-cogs fa-3x mb-2 text-warning"></i> <!-- Scrap QS Packing Icon -->
        <h5 class="card-title">Consolidated Packing Note</h5>
        <p class="card-text">Manage Consolidated and packaging</p>
      </div>
    </div>
  </div>
        <div class="col-md-4" data-page="ConsolidatedInvoice.jsp"   onclick="window.location.href='ConsolidatedInvoice.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-file-invoice fa-3x mb-2 text-success"></i> <!-- Scrap Invoice Icon -->
        <h5 class="card-title">Consolidated Invoice</h5>
        <p class="card-text">Create and manage Consolidated invoices</p>
      </div>
    </div>
  </div> 
    </div>
  </div>
  
  
 <div class="tab-pane fade" id="Other" role="tabpanel" aria-labelledby="Other-tab">
      
       <!-- User Card -->
 <div class="card-container" style="padding-top:5%;">

<!-- First Card (Sale Order) -->
  <div class="col-md-4" data-page="OtherPackingNote.jsp"  onclick="window.location.href='OtherPackingNote.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-cogs fa-3x mb-2 text-warning"></i> <!-- Scrap QS Packing Icon -->
        <h5 class="card-title">Other Packing Note</h5>
        <p class="card-text">Manage Other and packaging</p>
      </div>
    </div>
  </div>
  
  
   <!-- Third Card (Scrap Invoice) -->
  <div class="col-md-5" data-page="OtherInvoiceEntry.jsp"  onclick="window.location.href='OtherInvoiceEntry.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-file-invoice fa-3x mb-2 text-success"></i> <!-- Scrap Invoice Icon -->
        <h5 class="card-title">Other Invoice Entry</h5>
        <p class="card-text">Create and Manage Other Invoice Entry</p>
      </div>
    </div>
  </div>
    </div>
  </div>
  
  
   <div class="tab-pane fade " id="steel" role="tabpanel" aria-labelledby="steel-tab" ><!-- show active -->
   <div class="card-container" style="padding-top:5%;">
  <!-- First Card (Sale Order) -->
  <div class="col-md-4" data-page="QApackage.jsp"  onclick="window.location.href='QApackage.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-cogs fa-3x mb-2 text-warning"></i> <!-- Scrap QS Packing Icon -->
        <h5 class="card-title">Steel QS Packing</h5>
        <p class="card-text">Manage steel and packaging</p>
      </div>
    </div>
  </div>

  <!-- Third Card (Scrap Invoice) -->
  <div class="col-md-4" data-page="invoicesidemenu.jsp"  onclick="window.location.href='invoicesidemenu.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-file-invoice fa-3x mb-2 text-success"></i> <!-- Scrap Invoice Icon -->
        <h5 class="card-title">Steel Invoice</h5>
        <p class="card-text">Create and manage steel invoices</p>
      </div>
    </div>
  </div> 
             
  </div>
  </div>
  
  
    <div class="tab-pane fade" id="scrap" role="tabpanel" aria-labelledby="scrap-tab">
         <!-- User Card -->
  <div class="card-container" style="padding-top:5%;">
     <!-- First Card (Sale Order) -->
  <div class="col-md-4" data-page="Scrap.jsp"  onclick="window.location.href='Scrap.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-box fa-3x mb-2 text-primary"></i> <!-- Scrap QS Packing Icon -->
        <h5 class="card-title">Sale Order</h5>
        <p class="card-text">Create and manage sale orders</p>
      </div>
    </div>
  </div>

  <!-- Third Card (Scrap Invoice) -->
  <div class="col-md-5" data-page="ScrapQA.jsp" onclick="window.location.href='ScrapQA.jsp'">
    <div class="card text-center">
      <div class="card-body">
        <i class="fas fa-cogs fa-3x mb-2 text-warning"></i> <!-- Scrap Invoice Icon -->
        <h5 class="card-title">Scrap QS Packing</h5>
        <p class="card-text">Manage scrap and packaging</p>
      </div>
    </div>
  </div>
  
   <div class="col-md-4" data-page="InvoiceSrap.jsp"  onclick="window.location.href='InvoiceSrap.jsp'">
    <div class="card text-center">
      <div class="card-body">
       <i class="fas fa-file-invoice fa-3x mb-2 text-success"></i> <!-- Scrap Invoice Icon -->
        <h5 class="card-title">Scrap Invoice</h5>
        <p class="card-text">Create and manage scrap invoices</p>
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

 <script src="externalLibrary/cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
   <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
 
  <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
  <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>

  <script src="js/factoryid.js?v=<%=ver(application, "/js/factoryid.js")%>"></script>
   <script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
 <%--   <script src='js/InvoiceModule.js?v=<%=jsVersion%>'></script> --%>

  




</body>

</html>