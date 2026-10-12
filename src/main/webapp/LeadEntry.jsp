<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
response.setHeader("Pragma", "no-cache");
response.setDateHeader("Expires", 0);
%>

<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Lead Entry - JSSL</title>

<!-- Bootstrap -->
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">

<!-- Bootstrap Icons -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.5.0/font/bootstrap-icons.min.css" rel="stylesheet">

<!-- Font Awesome -->
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">

<!-- Ruang Admin -->
<link href="css/ruang-admin.min.css" rel="stylesheet">

<!-- Main CSS -->
<link rel="stylesheet" href="css/main.css">

<script src="js/sidebar.js"></script>

<!-- jsPDF + autoTable -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>

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
.small-input {
    width: 120px;  /* Adjust width as needed */
    height: 30px;  /* Adjust height as needed */
    padding: 2px;
    font-size: 12px;
}

.small-label {
    font-size: 15px;
    display: block;
    margin-bottom: 2px;
}
.small-input1 {
    width: 215px;  /* Adjust width as needed */
    height: 30px;  /* Adjust height as needed */
    padding: 2px;
    font-size: 12px;
}

.small-label1 {
    font-size: 15px;
    display: block;
    margin-bottom: 2px;
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

/* ===== ENQUIRY MODAL — MODERN DESIGN ===== */

.enquiry-modal-content {
    border-radius: 14px;
    border: none;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
}

.enquiry-modal-header {
    background: linear-gradient(135deg, #37499A 0%, #4a5cc4 100%);
    padding: 20px 28px;
    border-bottom: none;
    height: auto;
}

.enquiry-modal-header .modal-title {
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
}

.enquiry-subtitle {
    color: #dbe1f7;
    font-size: 12.5px;
    margin-top: 2px;
}

.enquiry-modal-body {
    background-color: #fafbfe;
    padding: 26px 28px;
}

.enquiry-field {
    margin-bottom: 14px;
}

.enquiry-field label {
    font-size: 12.5px;
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
}

.enquiry-icon {
    color: #37499A;
    margin-right: 6px;
    font-size: 12px;
    width: 14px;
}

.enquiry-input {
    border: 1px solid #e2e5ec;
    border-radius: 8px;
    background-color: #ffffff;
    font-size: 13px;
    padding: 8px 12px;
    height: auto;
    transition: all 0.15s ease-in-out;
    box-shadow: none;
}

.enquiry-input:focus {
    border-color: #37499A;
    box-shadow: 0 0 0 3px rgba(55, 73, 154, 0.12);
    outline: none;
}

.enquiry-readonly {
    background-color: #f3f4f6 !important;
    color: #6b7280;
    cursor: not-allowed;
}

textarea.enquiry-input {
    resize: none;
}

.enquiry-modal-footer {
    background-color: #ffffff;
    border-top: 1px solid #eef0f5;
    padding: 16px 28px;
}

.enquiry-btn-secondary {
 
    
    background-color: #ff3f3f;
    color: #f9f9f9;
    
    border: 1px solid #e5e7eb;
    border-radius: 7px;
    padding: 7px 20px;
    font-weight: 500;
}

.enquiry-btn-secondary:hover {
    background-color: #ff3f3f;
    color: #f9f9f9;
}

.enquiry-btn-primary {

    
        background: #098709;
    color: #ffffff;
    border: none;
    border-radius: 7px;
    padding: 7px 22px;
    font-weight: 500;
    box-shadow: 0 4px 10px rgba(55, 73, 154, 0.25);
}

.enquiry-btn-primary:hover {
           background: #098709;
    color: #ffffff;
}

/* Responsive: stack to 2 columns on tablets, 1 column on phones */
@media (max-width: 991px) {
    .enquiry-field.col-md-4,
    .enquiry-field.col-md-3 {
        flex: 0 0 50%;
        max-width: 50%;
    }
}

@media (max-width: 575px) {
    .enquiry-field.col-md-4,
    .enquiry-field.col-md-3 {
        flex: 0 0 100%;
        max-width: 100%;
    }
    .enquiry-modal-body {
        padding: 18px;
    }
    .enquiry-modal-header {
        padding: 16px 18px;
    }
}

.required {
    color: red;
    font-weight: bold;
}
</style>
</head>

<body id="page-top">
<div id="wrapper">

  <!-- Sidebar -->
  <%@ include file="SaleSidebar.jsp" %>

  <!-- Content Wrapper -->
  <div id="content-wrapper" class="d-flex flex-column">
    <div id="content">

      <!-- Topbar -->
      <nav class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top"
           style="background-color:#37499A;">
        <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
          <i class="fa fa-bars text-white"></i>
        </button>
        <ul class="navbar-nav ml-auto">
            <button class="btn btn-link"
              onclick="window.location.href='Landingpage.jsp'"
              style="background:transparent;border:none;color:white;">
              <i class="fa fa-home"></i>
            </button>
          <div class="topbar-divider d-none d-sm-block"></div>
          <li class="nav-item dropdown no-arrow">
            <a class="nav-link dropdown-toggle" href="#" id="userDropdown"
               role="button" data-toggle="dropdown">
              <i class="fas fa-user text-white mr-2"></i>
              <span class="d-none d-lg-inline text-white small" id="usernameDisplay">Username</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in">
              <a class="dropdown-item" href="#" onclick="logoutUser(event)">
                <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i> Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
      
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
    <thead>
      <tr>
        <th>Sl. No.</th>
        <th>Lead No</th>
        <th>Project Name</th>
        <th>Client Name</th>
        <th>Stage</th>
        <th>Edit</th>
        <th>Follow-up</th>
      </tr>
    </thead>
    <tbody id="LeadTableBody">
    </tbody>
  </table>
</div>      
  </div>
 </div>
</div>
<div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog"
     aria-labelledby="exampleModalScrollableTitle123" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" style="max-width: 900px;" role="document">
    <div class="modal-content enquiry-modal-content">

      <!-- Header -->
      <div class="modal-header enquiry-modal-header">
        <div>
          <h5 class="modal-title mb-0" id="exampleModalScrollableTitle123">Lead Entry</h5>
          <p class="enquiry-subtitle mb-0 text-center">Fill in the details below to log a new Lead</p>
        </div>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body enquiry-modal-body">
        <div class="form-row">

          <div class="form-group col-md-4 enquiry-field" hidden="hidden">
            <label><i class="fas fa-hashtag enquiry-icon"></i> Enq No</label>
            <input type="text" id="enqNo" class="form-control form-control-sm enquiry-input enquiry-readonly" readonly placeholder="ENQ-1001">
          </div>

         <!-- Client Name -->
         
   <div class="form-group col-md-4 enquiry-field">
    <label>
        <i class="fas fa-user-check enquiry-icon"></i>
        Client Name <span class="text-danger">*</span>
    </label>
    <select id="clientName" class="form-control form-control-sm enquiry-input">
    </select>
</div>

 <div class="form-group col-md-4 enquiry-field">
            <label><i class="fas fa-comment-dots enquiry-icon"></i> Project Name</label>
            <input type="text" id="projectName" class="form-control form-control-sm enquiry-input" readonly="readonly">
          </div>

 <div class="form-group col-md-4 enquiry-field">
            <label><i class="fas fa-comment-dots enquiry-icon"></i> site Location</label>
            <input type="text" id="site" class="form-control form-control-sm enquiry-input" readonly="readonly">
          </div>
           <div class="form-group col-md-4 enquiry-field">
            <label><i class="fas fa-comment-dots enquiry-icon"></i> Zone</label>
            <input type="text" id="Zone" class="form-control form-control-sm enquiry-input" readonly="readonly">
          </div>
<div class="form-group col-md-4 enquiry-field">
    <label><i class="fas fa-user-check enquiry-icon"></i>General Consultant</label>
    <select id="gnrlcon" class="form-control form-control-sm enquiry-input">
        <option value="1">YES</option>
        <option value="0">NO</option>
    </select>
</div>

<div class="form-group col-md-4 enquiry-field">
    <label>
        <i class="fas fa-building enquiry-icon"></i>
         Type
    </label>
    <select id="invdevType" class="form-control form-control-sm enquiry-input">
        <option value="">Select</option>
        <option value="1">Investor</option>
        <option value="2">Developer</option>
    </select>
</div>

<div class="form-group col-md-4 enquiry-field">
    <label>
        <i class="fas fa-comment-dots enquiry-icon"></i>
        Name
    </label>
    <input type="text"
           id="invdev"
           class="form-control form-control-sm enquiry-input">
</div>
          
      <!-- KAM -->
<div class="form-group col-md-4 enquiry-field" hidden="hidden">
    <label><i class="fas fa-user-check enquiry-icon"></i> KAM</label>
    <select id="kam" class="form-control form-control-sm enquiry-input">
        <option value="">Select KAM</option>
        <option value="KAM 1">KAM 1</option>
        <option value="KAM 2">KAM 2</option>
        <option value="KAM 3">KAM 3</option>
    </select>
</div>

<!-- Current Stage -->

<!-- RFQ Date -->
<div class="form-group col-md-4 enquiry-field">
    <label><i class="fas fa-calendar-alt enquiry-icon"></i> RFQ Date</label>
    <input type="date" id="rfqDate" class="form-control form-control-sm enquiry-input">
</div>

<!-- NDA Date -->
<div class="form-group col-md-4 enquiry-field">
    <label><i class="fas fa-file-contract enquiry-icon"></i> NDA Date</label>
    <input type="date" id="ndaDate" class="form-control form-control-sm enquiry-input">
</div>

<div class="form-group col-md-4 enquiry-field">
    <label><i class="fas fa-random enquiry-icon"></i>Industry Type</label>
    <select id="indtyp" class="form-control form-control-sm enquiry-input">
    </select>
</div>

 <div class="form-group col-md-4 enquiry-field">
            <label><i class="fas fa-comment-dots enquiry-icon"></i> Area/qty</label>
            <input type="number" id="qty" class="form-control form-control-sm enquiry-input">
          </div>
          
           <div class="form-group col-md-4 enquiry-field">
            <label><i class="fas fa-comment-dots enquiry-icon"></i> Suggested Bid Value(cr)</label>
            <input type="text" id="bidval" class="form-control form-control-sm enquiry-input">
          </div>
<div class="form-group col-md-4 enquiry-field">
    <label><i class="fas fa-random enquiry-icon"></i>Segment</label>
    <select id="segtype" class="form-control form-control-sm enquiry-input">
    </select>
</div>
<div class="form-group col-md-4 enquiry-field">
    <label><i class="fas fa-calendar-plus enquiry-icon"></i> Expected Award Month</label>
    <input type="date" id="expawdmon" class="form-control form-control-sm enquiry-input">
</div>

<div class="form-group col-md-4 enquiry-field">
    <label><i class="fas fa-calendar-plus enquiry-icon"></i> Expected Project Start Month</label>
    <input type="date" id="exppromon" class="form-control form-control-sm enquiry-input">
</div>
<!-- First Bid Date -->
<div class="form-group col-md-4 enquiry-field" hidden="hidden">
    <label><i class="fas fa-calendar-plus enquiry-icon"></i> Bid Date</label>
    <input type="date" id="firstBidDate" class="form-control form-control-sm enquiry-input">
</div>

<!-- Last Bid Date -->
<div class="form-group col-md-4 enquiry-field" hidden="hidden">
    <label><i class="fas fa-calendar-minus enquiry-icon"></i> Last Bid Date</label>
    <input type="date" id="lastBidDate" class="form-control form-control-sm enquiry-input">
</div>

<!-- Bid Type -->
<div class="form-group col-md-4 enquiry-field">
    <label><i class="fas fa-random enquiry-icon"></i> Bid Type Single Bid (Yes)/Multiple Bids (No)</label>
    <select id="bidType" class="form-control form-control-sm enquiry-input">
        <option value="">Select Bid Type</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
    </select>
</div>

<!-- Competitors -->
<div class="form-group col-md-4 enquiry-field" hidden="hidden">
    <label><i class="fas fa-users enquiry-icon"></i> Competitors (GCs)</label>
    <select id="competitors" class="form-control form-control-sm enquiry-input">
        <option value="">Select Competitor</option>
        <option value="L&T">L&T</option>
        <option value="Shapoorji Pallonji">Shapoorji Pallonji</option>
        <option value="Tata Projects">Tata Projects</option>
        <option value="Afcons">Afcons</option>
    </select>
</div>

<!-- GC Taking JSSL Bid -->
<div class="form-group col-md-4 enquiry-field" hidden="hidden">
    <label><i class="fas fa-handshake enquiry-icon"></i> GC Taking JSSL's Bid</label>
    <select id="gcTakingBid" class="form-control form-control-sm enquiry-input">
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
    </select>
</div>

<!-- Last Technical Discussion -->
<div class="form-group col-md-4 enquiry-field"hidden="hidden">
    <label><i class="fas fa-comments enquiry-icon"></i> Technical Discussion Date</label>
    <input type="date" id="technicalDiscussionDate" class="form-control form-control-sm enquiry-input">
</div>

<!-- Last Commercial Discussion -->
<div class="form-group col-md-4 enquiry-field" hidden="hidden">
    <label><i class="fas fa-money-check enquiry-icon"></i> Commercial Discussion Date</label>
    <input type="date" id="commercialDiscussionDate" class="form-control form-control-sm enquiry-input">
</div>

<!-- Probability of Conversion -->
<div class="form-group col-md-4 enquiry-field"hidden="hidden">
    <label><i class="fas fa-percentage enquiry-icon"></i> Probability of Conversion</label>
    <select id="probability" class="form-control form-control-sm enquiry-input">
        <option value="">Select Probability</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
    </select>
</div>

<!-- SS Contract Awardee -->
<div class="form-group col-md-4 enquiry-field"hidden="hidden">
    <label><i class="fas fa-award enquiry-icon"></i> SS Contract Awardee</label>
    <select id="contractAwardee" class="form-control form-control-sm enquiry-input">
        <option value="">Select Awardee</option>
        <option value="JSSL">JSSL</option>
        <option value="Competitor 1">Competitor 1</option>
        <option value="Competitor 2">Competitor 2</option>
    </select>
</div>

<div class="form-group col-md-4 enquiry-field" hidden="hidden">
    <label><i class="fas fa-award enquiry-icon"></i> Status</label>
    <select id="status" class="form-control form-control-sm enquiry-input">
        <option value="">Select Status</option>
        <option value="WIN">WIN</option>
        <option value="LOSS">LOSS</option>
        <option value="HOLD">HOLD</option>
    </select>
</div>

<!-- Win/Drop/Loss Date -->
<div class="form-group col-md-4 enquiry-field" hidden="hidden">
    <label><i class="fas fa-calendar-times enquiry-icon"></i> Win/Drop/Loss Date</label>
    <input type="date" id="winDropLossDate" class="form-control form-control-sm enquiry-input">
</div>

<!-- Reason for Loss -->
<div class="form-group col-md-4 enquiry-field" hidden="hidden">
    <label><i class="fas fa-exclamation-circle enquiry-icon"></i> Reason for Loss</label>
    <select id="reasonForLoss" class="form-control form-control-sm enquiry-input">
        <option value="">Select Reason</option>
        <option value="Price">Price</option>
        <option value="Technical">Technical</option>
        <option value="Commercial">Commercial</option>
        <option value="Schedule">Schedule</option>
        <option value="Others">Others</option>
    </select>
</div>

<!-- Order Lost Value -->
<div class="form-group col-md-4 enquiry-field" hidden="hidden">
    <label><i class="fas fa-rupee-sign enquiry-icon"></i> Order Lost Value</label>
    <input type="number" id="orderLostValue" class="form-control form-control-sm enquiry-input" placeholder="Enter Order Lost Value">
</div>
<div class="form-group col-md-4 enquiry-field">
    <label><i class="fas fa-tasks enquiry-icon"></i> Current Stage</label>
    <select id="currentStage" class="form-control form-control-sm enquiry-input">
    </select>
</div>

        <div class="form-group col-md-12 enquiry-field">
    <label>
        <i class="fas fa-comment-dots enquiry-icon"></i>
        Comments <span class="text-danger">*</span>
    </label>
    <textarea id="comments"
              rows="3"
              class="form-control form-control-sm enquiry-input"
              placeholder="Add any additional notes here..."></textarea>
</div>

        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer enquiry-modal-footer">
        <button type="button" class="btn btn-sm enquiry-btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-sm enquiry-btn-primary" onclick="openModalAdd();">Create Lead</button>
      </div>

    </div>
  </div>
</div>

<div class="modal fade" id="exampleModalScrollableUp" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Update Lead</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
            </div>

            <div class="modal-body">

                <div class="row">

                    <div class="form-group col-md-3 enquiry-field">
                        <label>Lead No</label>
                        <input type="text" id="leadNo1" class="form-control form-control-sm" readonly>
                    </div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label><span class="text-danger">*</span> Client</label>
                        <select id="clientName1" class="form-control form-control-sm"></select>
                    </div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label>Project Name</label>
                        <input type="text" id="projectName1" class="form-control form-control-sm" disabled="disabled">
                    </div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label>General Consultant</label>
                        <select id="gnrlcon1" class="form-control form-control-sm">
                            <option value="">Select</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>

               <div class="form-group col-md-3 enquiry-field">
    <label> Type</label>
    <select id="invdevType1" class="form-control form-control-sm">
        <option value="">Select</option>
        <option value="1">Investor</option>
        <option value="2">Developer</option>
    </select>
</div>

<div class="form-group col-md-3 enquiry-field">
    <label> Name</label>
    <input type="text"
           id="invdev1"
           class="form-control form-control-sm">
</div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label>RFQ Date</label>
                        <input type="date" id="rfqDate1" class="form-control form-control-sm no-future-date" readonly="readonly">
                    </div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label>NDA Date</label>
                        <input type="date" id="ndaDate1" class="form-control form-control-sm no-future-date">
                    </div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label>Industry Type</label>
                        <select id="indtyp1" class="form-control form-control-sm"></select>
                    </div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label>Area Qty</label>
                        <input type="number" id="qty1" class="form-control form-control-sm">
                    </div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label>Suggested Bid Value</label>
                        <input type="number" id="bidval1" class="form-control form-control-sm">
                    </div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label>Segment</label>
                        <select id="segtype1" class="form-control form-control-sm"></select>
                    </div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label>Expected Award Month</label>
                        <input type="date" id="expawdmon1" class="form-control form-control-sm">
                    </div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label>Expected Project Start Month</label>
                        <input type="date" id="exppromon1" class="form-control form-control-sm">
                    </div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label>Bid Type</label>
                        <select id="bidType1" class="form-control form-control-sm">
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div class="form-group col-md-3 enquiry-field">
                        <label>Current Stage</label>
                        <select id="currentStage1" class="form-control form-control-sm"></select>
                    </div>

                    <div class="form-group col-md-12 enquiry-field">
                        <label><span class="text-danger">*</span> Comments</label>
                        <textarea id="comments1" rows="3" class="form-control form-control-sm"></textarea>
                    </div>

                </div>

            </div>

            <div class="modal-footer">
                <button type="button"
                        class="btn btn-secondary"
                        data-dismiss="modal">
                    Close
                </button>

                <button type="button"
                        class="btn btn-primary"
                        onclick="updateLead()">
                    Update
                </button>
            </div>

        </div>
    </div>
</div>

<div class="modal fade" id="exampleModalActivity" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalActivityTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" style="max-width: 750px;" role="document">
        <div class="modal-content">
            <div class="modal-header enquiry-modal-header">
                <h5 class="modal-title text-white" id="exampleModalActivityTitle"><b>Lead Follow-up</b></h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body enquiry-modal-body">

                <!-- Read-only summary of the enquiry -->
                <div class="p-2 mb-3" style="background-color:#eef0fa;border-radius:8px;border-left:4px solid #37499A;">
                    <div class="row">
                        <div class="col-md-3"><small class="text-muted">Enq No</small><br><b id="sqEnqNo">-</b></div>
                        <div class="col-md-4"><small class="text-muted">Project</small><br><b id="sqProjectName">-</b></div>
                        <div class="col-md-3"><small class="text-muted">Client</small><br><b id="sqClientName">-</b></div>
                        <div class="col-md-2"><small class="text-muted">Stage</small><br><b id="sqCurrentStage">-</b></div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group col-md-4 enquiry-field">
                        <label><i class="fas fa-bullseye enquiry-icon"></i> Source</label>
                        <select id="activitySource" class="form-control form-control-sm enquiry-input">
                            <option value="">Select Source</option>
                            <option value="Self">Self</option>
                            <option value="Referral">Referral</option>
                            <option value="Website">Website</option>
                            <option value="Cold Call">Cold Call</option>
                            <option value="Exhibition">Exhibition</option>
                        </select>
                    </div>

                    <div class="form-group col-md-4 enquiry-field">
                        <label><i class="fas fa-calendar-day enquiry-icon"></i> Date</label>
                        <input type="date" id="activityDate" class="form-control form-control-sm enquiry-input">
                    </div>

                    <div class="form-group col-md-4 enquiry-field">
                        <label><i class="fas fa-id-badge enquiry-icon"></i> Name (Attended By)</label>
                        <input type="text" id="activityAttendedBy" class="form-control form-control-sm enquiry-input enquiry-readonly" readonly>
                    </div>

                    <div class="form-group col-md-4 enquiry-field">
                        <label><i class="fas fa-flag enquiry-icon"></i> Stage</label>
                        <select id="activityStage" class="form-control form-control-sm enquiry-input">
                            <option value="Lead">Lead</option>
                            <option value="RFQ Received">RFQ Received</option>
                            <option value="Hold">Hold</option>
                            <option value="Win">Win</option>
                            <option value="Lose">Lose</option>
                        </select>
                    </div>

                    <div class="form-group col-md-4 enquiry-field">
                        <label><i class="fas fa-user enquiry-icon"></i> Contact Person</label>
                        <select id="activityContactPerson" class="form-control form-control-sm enquiry-input">
                            <option value="">Select Contact Person</option>
                            <option value="Ramesh Iyer">Ramesh Iyer</option>
                            <option value="Priya Nair">Priya Nair</option>
                            <option value="Anil Kumar">Anil Kumar</option>
                            <option value="Sunita Rao">Sunita Rao</option>
                        </select>
                    </div>

                    <div class="form-group col-md-4 enquiry-field">
                        <label><i class="fas fa-calendar-check enquiry-icon"></i> Next Follow-up Date</label>
                        <input type="date" id="nextFollowUpDate" class="form-control form-control-sm enquiry-input">
                    </div>

                    <div class="form-group col-md-12 enquiry-field">
                        <label><i class="fas fa-comment-dots enquiry-icon"></i> Comments</label>
                        <textarea id="activityRemarks" rows="2" class="form-control form-control-sm enquiry-input"></textarea>
                    </div>
                </div>

                <hr>

                <h6 class="mb-2"><b>Follow-up History</b></h6>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Source</th>
                                <th>Attended By</th>
                                <th>Stage</th>
                                <th>Contact Person</th>
                                <th>Next Follow-up</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody id="activityHistoryBody">
                        </tbody>
                    </table>
                </div>

            </div>
            <div class="modal-footer enquiry-modal-footer">
                <button type="button" class="btn btn-sm enquiry-btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-sm enquiry-btn-primary" id="saveActivityBtn">Save Follow-up</button>
            </div>
        </div>
    </div>
</div>



<!-- JS FILES -->
<script src="vendor/jquery/jquery.min.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="js/ruang-admin.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="js/config.js"></script>
<script src="js/logout.js"></script>
<script src="js/username.js"></script>
<script src="js/Sessionfilter.js"></script>
<script src="js/Leads.js"></script>
<script src="js/createdby.js"></script>
</body>
</html>
