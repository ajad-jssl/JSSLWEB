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
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
       <link rel="stylesheet" href="externalLibrary/cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-xxx" crossorigin="anonymous" />
   <link href="css/newmasterfile.css" rel="stylesheet">


       
  <script>
    const user_id = sessionStorage.getItem('user_id');
    console.log(user_id);
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
 
         
<div class="container mt-5" style="margin-left:-5px;">
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="invoice-tab" data-bs-toggle="tab" href="#invoice" role="tab" aria-controls="invoice" aria-selected="true">Invoice</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="organisation-tab" data-bs-toggle="tab" href="#organisation" role="tab" aria-controls="organisation" aria-selected="false">Organisation</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="scrap-tab" data-bs-toggle="tab" href="#scrap" role="tab" aria-controls="scrap" aria-selected="false">Scrap</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="series-tab" data-bs-toggle="tab" href="#series" role="tab" aria-controls="series" aria-selected="false">Series</a>
  </li>
</ul>

    <div class="tab-content" id="myTabContent">
      <!-- Tab Content -->
      <div class="tab-pane fade active show" id="invoice" role="tabpanel" aria-labelledby="invoice-tab" ><!-- show active -->
      <div class="card-container">
       <div class="dropdown-items" style="z-index:0 !important;">
              <div class="card h-100" onclick="window.location.href='contractcustomer.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                   <div class="col mr-2">
                      <i class="fas fa-address-card" style="color:#4ACCF7;font-size:1.5rem;"></i>         
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Invoice / Consignee</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right"><span id="incount"></span>/<span id="concount"></span></div>
                     </div>                   
                  </div>
                </div>
              </div>             
                            
                         <div class="card h-100" onclick="window.location.href='Contractorlist.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                   <div class="col mr-2">
                 <i class="fas fa-file-contract" style="color:#4ACCF7;font-size:1.5rem;"></i>       
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Assign to Contract</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="assigncontractnew"></div>
                     </div>                   
                  </div>
                </div>
              </div>
    
    <!-- Remaining dropdown item as is (Item 2) -->
      <div class="card h-100" onclick="window.location.href='shipmentdelivery.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col mr-2">
                    <i class="fas fa-shipping-fast fa-2x"style="color:  #3AC079;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Delivery Condition</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="delnew"></div>
                     </div>
              
                  </div>
                </div>
              </div>
               <div class="card h-100" onclick="window.location.href='Typemaster.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                   <div class="col mr-2">
                    <i class="fas fa-th-list fa-2x" style="color: #F85873;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Type Master</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="typenewmaster"></div>
                     </div>
                   
                  </div>
                </div>
              </div>
             
              <div class="card h-100" onclick="window.location.href='workorder.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col mr-2">
                    <i class="fas fa-tasks fa-2x" style="color: #FCB859;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Work Order</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="workordernew"></div>
                     </div>
                  
                  </div>
                </div>
              </div>
              <div class="card h-100" onclick="window.location.href='othertype.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-ellipsis-h fa-2x" style="color: #3AC079;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Others Type</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="othertypenew11test"></div>
                     </div>
                 
                  </div>
                </div>
              </div>
                <div class="card h-100" onclick="window.location.href='Milestone.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                        <div class="col mr-2">
                    <i class="fas fa-flag-checkered fa-2x" style="color: #F85873;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto ">
                      <div class="text-xs font-weight-bold text-uppercase mb-1" >Milestone</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="milenewtest"></div>
                     </div>
              
                  </div>
                </div>
              </div> 
                 <div class="card h-100" onclick="window.location.href='Gstmaster.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i  class="fas fa-map-marked-alt fa-2x" style="color: #4ACCF7;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto ">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">GST Master</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="gstmastertestnew"></div>
                     </div>
                 
                  </div>
                </div>
              </div>      
                 <div class="card h-100" onclick="window.location.href='servicecode.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                   <div class="col mr-2">
                    <i class="fas fa-barcode fa-2x" style="color: #FCB859;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Service Code</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="servicetestnew2"></div>
                     </div>
                   
                  </div>
                </div>
              </div>
                
               <div class="card h-100" onclick="window.location.href='taxmaster.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-clipboard-check fa-2x" style="color: #F85873;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Tax Master</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="taxmastertest"></div>
                     </div>
                 
                  </div>
                </div>
              </div>  
               <div class="card h-100" onclick="window.location.href='uommaster.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col mr-2">
                    <i class="fas fa-balance-scale" style="color:  #3AC079;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">UOM Master</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="uomtest"></div>
                     </div>
              
                  </div>
                </div>
              </div> 
              
               <div class="card h-100" onclick="window.location.href='Factorylist.jsp'" style="display:none;">
  <div class="card-body">
    <div class="row align-items-center">
      <div class="col mr-2">
        <!-- Updated icon for Factory Master -->
        <i class="fas fa-industry fa-2x" style="color: #F85873; font-size: 1.5rem;"></i>
      </div>
      <div class="col-auto">
        <div class="text-xs font-weight-bold text-uppercase mb-1">Factory Master</div>
        <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="Factorymasternew"></div>
      </div>
    </div>
  </div>
</div>

 <div class="card h-100" onclick="window.location.href='bgtype.jsp'">
  <div class="card-body">
    <div class="row align-items-center">
      <div class="col mr-2">
        <!-- Updated icon for Factory Master -->
        <i class="fas fa-file-invoice" style="color: #F85873; font-size: 1.5rem;"></i>
      </div>
      <div class="col-auto">
        <div class="text-xs font-weight-bold text-uppercase mb-1">BG Type Master</div>
        <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="bgtype"></div>
      </div>
    </div>
  </div>
</div>
 <div class="card h-100" onclick="window.location.href='invoicetypemaster.jsp'">
  <div class="card-body">
    <div class="row align-items-center">
      <div class="col mr-2">
        <!-- Updated icon for Factory Master -->
        <i class="fas fa-sticky-note" style="color: blue; font-size: 1.5rem;"></i>
      </div>
      <div class="col-auto">
        <div class="text-xs font-weight-bold text-uppercase mb-1">Invoice Type Master</div>
        <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="intypeew"></div>
      </div>
    </div>
  </div>
</div> 

 <div class="card h-100" onclick="window.location.href='invoiceremarkstype.jsp'">
  <div class="card-body">
    <div class="row align-items-center">
      <div class="col mr-2">
        <!-- Updated icon for Factory Master -->
        <i class="fas fa-file-invoice-dollar" style="color: gray; font-size: 1.5rem;"></i>
      </div>
      <div class="col-auto">
        <div class="text-xs font-weight-bold text-uppercase mb-1">Invoice Remarks Master</div>
        <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="inremnew"></div>
      </div>
    </div>
  </div>
</div> 
<div class="card h-100" onclick="window.location.href='exportTitle.jsp'">
  <div class="card-body">
    <div class="row align-items-center">
      <div class="col mr-2">
        <!-- Updated icon for Factory Master -->
        <i class="fas fa-file-export" style="color: brown; font-size: 1.5rem;"></i>
      </div>
      <div class="col-auto">
        <div class="text-xs font-weight-bold text-uppercase mb-1">Export Title Text </div>
        <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="titext"></div>
      </div>
    </div>
  </div>
</div>
           
  </div>
  </div>
    
      </div>
      <div class="tab-pane fade" id="organisation" role="tabpanel" aria-labelledby="organisation-tab">
        <!-- Organization Card -->
  <div class="card-container">
   <div  class="dropdown-items"  style="z-index:0 !important;">
    <!-- Dropdown menu styled like cards -->
    
    <div class="card h-100" onclick="window.location.href='Organization.jsp'">
        
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-building fa-2x" style="color: #007BFF; font-size: 1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Organization</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="orgnew"></div>
                     </div>
                 
                  </div>
                </div>
              </div>
              
        <div class="card h-100" onclick="window.location.href='bankdetails.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-university fa-2x" style="color: #F85873;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">BANK DETAILS</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="bankdelnew"></div>
                     </div>
                 
                  </div>
                </div>
              </div> 
                  <div class="card h-100" onclick="window.location.href='businessunit.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-building fa-2x" style="color: #FCB859;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">BUSINESS UNITS</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="businesslentghtest"></div>
                     </div>
                 
                  </div>
                </div>
              </div> 
               
               <div class="card h-100" onclick="window.location.href='openingbalence.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-wallet fa-2x" style="color: #3AC079;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">OPENING BALANCE</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="openingnew"></div>
                     </div>
                 
                  </div>
                </div>
              </div> 
                <div class="card h-100" onclick="window.location.href='statemaster.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-map-marked-alt fa-2x" style="color: #FCB859;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">STATE MASTER</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="satemasnew"></div>
                     </div>
                 
                  </div>
                </div>
              </div>
               <div class="card h-100" onclick="window.location.href='country.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-globe fa-2x" style="color: #F85873;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">COUNTRY MASTER</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="countrtnewtest"></div>
                     </div>
                 
                  </div>
                </div>
              </div> 
    </div>
  </div>
      </div>
      <div class="tab-pane fade" id="scrap" role="tabpanel" aria-labelledby="scrap-tab">
         <!-- User Card -->
 <div class="card-container">
 
    <!-- Dropdown menu styled like cards -->
    <div class="dropdown-items">
   
              
              
               <div class="card h-100"  onclick="window.location.href='ScrapType.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-recycle" style="color: #27ae60; font-size: 1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Scrap Order Type</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="Scraptypeid"></div>
                     </div>
                 
                  </div>
                </div>
              </div>   
              
              <div class="card h-100"  onclick="window.location.href='ScrapType11.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-recycle" style="color: #27ae60; font-size: 1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Scrap Type</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="Scraptypeid11"></div>
                     </div>
                 
                  </div>
                </div>
              </div>
              
                <div class="card h-100"  onclick="window.location.href='ScrapItem.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-tools" style="color: #c0392b; font-size: 1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Scrap Item</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="ScrapTypeidaa"></div>
                     </div>
                 
                  </div>
                </div>
              </div> 
              
              <div class="card h-100"  onclick="window.location.href='Location.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                   <i class="fas fa-map-marker-alt" style="color: #c0392b; font-size: 1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Location</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="locationidaa"></div>
                     </div>
                 
                  </div>
                </div>
              </div> 
    </div>
  </div>
       
      </div>
      <div class="tab-pane fade" id="series" role="tabpanel" aria-labelledby="series-tab">
      
       <!-- User Card -->
 <div class="card-container">

    <!-- Dropdown menu styled like cards -->
    <div class="dropdown-items" style="z-index:0 !important;">
   <div class="card h-100"  onclick="window.location.href='gstseriesmaster.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-building fa-2x" style="color: #F85873;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Gst</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="gstlen"></div>
                     </div>
                 
                  </div>
                </div>
              </div>   
              
               <div class="card h-100"  onclick="window.location.href='advanceseriesmaster.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-building fa-2x" style="color: #FCB859;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Advance</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="advancelen"></div>
                     </div>
                 
                  </div>
                </div>
              </div> 
              
               <div class="card h-100"  onclick="window.location.href='debitcreditseriesmaster.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-building fa-2x" style="color: #4ACCF7;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Debit/Credit</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="debitlen"></div>
                     </div>
                 
                  </div>
                </div>
              </div>  
              
                 <div class="card h-100"  onclick="window.location.href='challanseriesmaster.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-building fa-2x" style="color: #FCB859;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Challan for consolidated</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="challanlen"></div>
                     </div>
                 
                  </div>
                </div>
              </div>
              
                 <div class="card h-100"  onclick="window.location.href='paymentseriesmaster.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-building fa-2x" style="color: #4ACCF7;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Payment Voucher</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="paymentlen"></div>
                     </div>
                 
                  </div>
                </div>
              </div>
                <div class="card h-100"  onclick="window.location.href='selfinvoiceseriesmaster.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-building fa-2x" style="color: #F85873;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Self Invoice</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="selflen"></div>
                     </div>
                 
                  </div>
                </div>
              </div>
                <div class="card h-100"  onclick="window.location.href='deliveryseriesmaster.jsp'">
                <div class="card-body">
                  <div class="row align-items-center">
                     <div class="col mr-2">
                    <i class="fas fa-building fa-2x" style="color: #27ae60;font-size:1.5rem;"></i>
                     
                    </div>
                    <div class="col-auto">
                      <div class="text-xs font-weight-bold text-uppercase mb-1">Delivery Challan</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 text-right" id="deliverylen"></div>
                     </div>
                 
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
   
 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
  <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
 
    <script src="js/newmaster.js?v=<%=ver(application, "/js/newmaster.js")%>"></script>
  <script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
  <script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
   <script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>

  

  
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab'); // Example: "invoice", "organisation", etc.

    // Default tab if 'tab' parameter is not specified
    const defaultTab = 'invoice';

    // Map tab names to IDs
    const tabMapping = {
      invoice: 'invoice-tab',
      organisation: 'organisation-tab',
      scrap: 'scrap-tab',
      series: 'series-tab',
    };

    const contentMapping = {
      invoice: '#invoice',
      organisation: '#organisation',
      scrap: '#scrap',
      series: '#series',
    };

    const tabId = tabMapping[tab] || tabMapping[defaultTab];
    const contentId = contentMapping[tab] || contentMapping[defaultTab];

    // Activate the tab from the URL
    if (tabId && contentId) {
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('show', 'active'));

      const activeTab = document.getElementById(tabId);
      const activeContent = document.querySelector(contentId);

      if (activeTab) activeTab.classList.add('active');
      if (activeContent) activeContent.classList.add('show', 'active');
    }

    // Listen for tab clicks to update the URL
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (event) => {
        const newTab = event.target.id.replace('-tab', '');
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tab', newTab);
        window.history.replaceState(null, '', newUrl); // Update the URL without reloading
      });
    });
  });
</script>

<script>
input.addEventListener('change', function() {
    document.querySelectorAll('.factory-checkbox').forEach(cb => {
        if (cb !== input) cb.checked = false;
    });
    dropdownButton.textContent = factory.factory_name;
    dropdownMenu.style.display = 'none'; // Close the dropdown
});
</script>
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