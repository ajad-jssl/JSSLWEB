<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
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
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
<!--   <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"> -->
  <link href="css/ruang-admin.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-xxx" crossorigin="anonymous" />
  <link rel="stylesheet" href="css/main.css">
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Bootstrap CSS -->
<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap Multiselect CSS -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.15/css/bootstrap-multiselect.min.css" rel="stylesheet">

<!-- Bootstrap JS -->
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>

<!-- Bootstrap Multiselect JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.15/js/bootstrap-multiselect.min.js"></script>

  
  <style>
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
  /* Style for the card container */
.card {
    position: relative; /* Add position relative for pseudo-element positioning */
    border: 1px solid #d1d3e2;
    border-radius: 8px;
    transition: box-shadow 0.3s ease;
}

/* Add a subtle box shadow on hover */
.card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.mt-5, .my-5 {
    margin-top: -6rem !important;
}
/* Style for the vertical line */
.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px; /* Adjust the width of the line */
    height: 100%; /* Full height of the card */
    background-color: #3498db; /* Color of the line */
    border-top-left-radius: 8px; /* Match the card border radius */
    border-bottom-left-radius: 8px; /* Match the card border radius */
}

/* Style for the card body */
.card-body {
    padding: 20px;
}

/* Style for the product category */
.text-uppercase {
    color: #6c757d;
    font-size: 12px;
}

/* Style for the product quantity */
.h5 {
    color: #1a1a1a;
    font-size: 24px;
}

/* Style for the shopping bag icon */
.fa-shopping-bag {
    color: #975454;
}

/* Optional: Adjust the color of the icon on hover */
.card:hover .fa-shopping-bag {
    color: #7d3737;
}
  /* Custom CSS for styling */
  body {
    background-color: #f8f9fa;
  }

  #formsContainer {
    max-width: 1200px; /* Increased width of the form */
    margin: 0 auto;
    border-radius: 8px;
    padding: 20px; /* Added padding for better spacing */
  }

  h3 {
    font-weight: bold;
    font-size: 1.5rem; /* Smaller font size for the header */
  }

  .form-label, .form-control, .form-check-label {
    font-size: 0.85rem; /* Smaller font size for labels and inputs */
  }

  textarea {
    resize: none;
    font-size: 0.85rem; /* Smaller font size for textarea */
  }

  .btn {
    margin-top: 10px;
    font-size: 0.85rem; /* Smaller font size for button */
  }
  .form-control {
    font-size: 0.875rem; /* Smaller font size */
  }

  .card {
    max-width: 800px; /* Adjust the max width of the form card */
    margin: auto; /* Center the card */
  }

  /* Optional: Adjust card shadow and padding */
  .shadow-lg {
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  }
  </style>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      background-color: #f8f9fa;
      font-family: Arial, sans-serif;
    }

    .container {
      margin-top: 20px;
    }

    .form-section {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-section h4 {
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
      margin-bottom: 20px;
      color: #333;
    }

    .form-label {
      font-weight: bold;
    }

    .form-check-label {
      font-weight: normal;
    }

    .checkbox-section label {
      margin-right: 15px;
    }

    .btn {
      font-size: 0.9rem;
    }
  </style>
  <style>
  /* Set a custom width for the multiselect */
  .dropdown-menu {
      width: 250px;  
      padding:10px;
  }
  

  /* Increase the width of the dropdown button */
  .btn-light {
      width: 200px;  /* Or any width you prefer */
      display: inline-block;
      
  }

  /* Ensure the search bar inside the multiselect is neat */
  .multiselect-search {
      width: 100%;
      padding: 5px 10px;
      box-sizing: border-box;
  }

  /* Make the dropdown items inline for a more compact view */
  .dropdown-menu .multiselect-item {
      display: inline-block;
      width: 100%;
  }

  /* Optional: to make the option labels look better */
  .multiselect-item label {
      width: auto;
      white-space: nowrap;
  }

  /* Limit the maximum width for the search bar */
  .multiselect-search {
      max-width: 95%;  /* Make sure it's not too wide */
  }
  
  .multiselect {
      border: 1px solid #ccc; /* Customize the border color and width */
      border-radius: 4px; /* Optional: rounded corners */
      padding: 5px 10px; /* Optional: padding inside the button */
  }

  /* Optional: Change the border color when dropdown is focused */
  .multiselect:focus {
      border-color: #007bff; /* Customize focus border color */
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Optional: add a focus effect */
  }
</style>
<style>
.error-message {
    color: #dc3545; /* Bootstrap's danger color */
    font-size: 0.875rem; /* Slightly smaller font for error messages */
    margin-top: 0.25rem; /* Spacing between the field and the error message */
}

/* Highlight the invalid input fields */
.is-invalid {
    border-color: #dc3545; /* Red border for invalid fields */
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25); /* Slight shadow effect */
}
</style>

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
  
      /* Modal height and scrolling */
    .modal-dialog {
      max-width: 1200px;
      height: auto;
    }
    
    .modal-body {
      max-height: 80vh; /* Set max height to 80% of the viewport */
      overflow-y: auto; /* Make content scrollable if it exceeds max height */
    }

    /* Adding padding and ensuring the containers fit */
    .container-fluid {
      padding: 15px;
    }

    /* Ensure form controls and sections don't overflow */
    .form-group {
      margin-bottom: 1rem;
    }
     
}
</style>

 <style>
  #TableID {
      width: 100%; /* Make the table fit the container */
  }

  #TableID th, #TableID td {
      padding: 5px; /* Smaller padding for compact table */
      text-align: center; /* Align text to the center */
  }

  #TableID th:nth-child(1), #TableID td:nth-child(1) {
      width: 50px; /* Sl.No */
  }
  #TableID th:nth-child(2), #TableID td:nth-child(2) {
      width: 150px; /* PO Number */
  }
  #TableID th:nth-child(3), #TableID td:nth-child(3) {
      width: 120px; /* PO Date */
  }
  /* Add additional column widths as needed */

  .table-container {
      overflow-x: auto; /* Allows horizontal scrolling if needed */
      width: 100%;
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
</head>

<body onload="fetchEmployeeList();">
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
                        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
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
            <h1 class="h3 mb-0 text-gray-800">GPMS Entry</h1>
            <ol class="breadcrumb" style="font-size:14px;">
              <li class="breadcrumb-item"><a href="Dashboard.jsp">Home</a></li>
              <li class="breadcrumb-item"><a href="newmaster.jsp">Master</a></li>
              <li class="breadcrumb-item"><a href="newmaster.jsp">Invoice</a></li>
              <li class="breadcrumb-item active" aria-current="page">GPMS</li>
            </ol>
         </div>
      
      
      <button style="margin-left:20px; margin-bottom:8px;" id="returnable" 
        onclick="Returnable()">
        <i></i> Returnable
      </button>
      
      <button style="margin-left:20px; margin-bottom:8px;" id="non" 
        onclick="NonReturnable()">
        Non Returnable
      </button>
      
      <button style="margin-left:20px; margin-bottom:8px;" id="received" 
        onclick="Received()">
        <i></i> Received Items
      </button>
      
      <button style="margin-left:20px; margin-bottom:8px;" id="rgp" 
        onclick="RGP()">
        RGP Update
      </button> 
       
  
  <div class="container mt-5" id=container style="display: none;">
   <h3 class="text-center mb-4"></h3>
  

     <div class="container" >
     <div class="row mb-3">

     </div>
    <div class="form-section" id=container1>
      <h4>RGP Update</h4>
      
        
      <form>      
         <div class="container">
          <div class="row mb-3">
            <div class="col-md-6">
             <label for="gatepassno" class="form-label">GatePass No:</label>
             <select id="gatepassno" class="form-select form-select-sm" >
             <option value="">Select</option>
             <option value="yes"></option>
             <option value="no"></option>  
             </select> 
            </div>
            
            <div class="col-md-6">
             <label for="gatepassdate1" class="form-label">GatePass Date:</label>
             <input type="text" class="form-control form-control-sm" id="gatepassdate1" value="GatePass Date" readonly>
            </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="requested1" class="form-label">Requested By:</label>
            <input type="text" class="form-control form-control-sm" id="requested1" placeholder="Department">
           </div>
           
           <div class="col-md-6">
            <label for="department3" class="form-label">Department:</label>
            <input type="text" class="form-control form-control-sm" id="department3" placeholder="Department">
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="tovendor" class="form-label">Sent To Vendor:</label>
             <input type="text" class="form-control form-control-sm" id="tovendor" placeholder="Department">
           </div>
           
           <div class="col-md-6">
            <label for="dispatch" class="form-label">Mode Of Dispatch:</label>
            <input type="text" class="form-control form-control-sm" id="dispatch" placeholder="Mode Of Despatch">
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="expecteddate" class="form-label">Expected Return Date:</label>
            <input type="date" class="form-control form-control-sm" id="expecteddate" placeholder="Expected Return Date">
           </div>
           
           <div class="col-md-6">
            <label for="receivedby1" class="form-label">Received By:</label>
            <input type="text" class="form-control form-control-sm" id="receivedby1" placeholder="Received By">
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="contract1" class="form-label">Contract:</label>
            <input type="text" class="form-control form-control-sm" id="contract1" placeholder="Contract"> 
           </div>
           
           <div class="col-md-6">
            <label for="gstno" class="form-label">GST DC No:</label>
            <input type="text" class="form-control form-control-sm" id="gstno" placeholder="GST DC No">
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="deptname" class="form-label">Dept Name:</label>
             <select id="deptname" class="form-select form-select-sm" >
             <option value="">Select</option>
             <option value="yes"></option>
             <option value="no"></option> 
             </select>
           </div>
           
           <div class="col-md-6">
            <label for="employee1" class="form-label">Employee Name:</label>
            <input type="text" class="form-control form-control-sm" id="employee1" placeholder="Employee Name">
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="cityname" class="form-label">City Name:</label>
            <select id="cityname" class="form-select form-select-sm" >
             <option value="">Select</option>
             <option value="yes">Hospet</option>
             <option value="no">Ballari</option>
             <option value="yes">Toranagallu</option>
             <option value="no">Vidyanagar Town Ship</option>  
             </select>
           </div>
           
           <div class="col-md-6">
            <label for="Reason1" class="form-label">Reason For Despatch:</label>
            <input type="text" class="form-control form-control-sm" id="Reason1" placeholder="Reason For Despatch">
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-6">
            <label for="Remarks2" class="form-label">Remarks:</label>
            <input type="text" class="form-control form-control-sm" id="Remarks2" placeholder="Remarks">
           </div>
           
           <div class="col-md-6">
            <label for="Enclosure1" class="form-label">Enclosure:</label>
            <input type="text" class="form-control form-control-sm" id="Enclosure1" placeholder="Enclosure">
           </div>
          </div>
          
          <div class="row mb-3">
           <div class="col-md-12">
            <label for="Reason2" class="form-label">Reason</label>
            <input type="text" class="form-control form-control-sm" id="Reason2" placeholder="Reason">
           </div>
          </div>
          
          
                    <div class="row mb-3">
          <div class="col-md-12">         
          <div class="table-container">
           <table class="table table-striped table-bordered table-sm" id="TableID">
            <thead>
            <tr>
                <th>Sl.No</th>
                <th>Item No</th>
                <th>Unit</th>
                <th>Description1</th>
                <th>Description2</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Remarks</th>                
            </tr>
           </thead>
           <tbody>
            <tr>
                <td></td>
                <td>
                 <select id="itemno1" class="form-select form-select-sm" >
                 <option value="">Select</option>
                 <option value="yes"></option>
                 <option value="no"></option> 
                 </select> 
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="unit" value="" readonly>
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="description1" value="" readonly>
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="description2" value="" readonly>
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="quantity" placeholder="">
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="price" placeholder="">
                </td>
                <td>
                 <input type="text" class="form-control form-control-sm" id="remarks" placeholder="">
                </td>                
            </tr>            
           </tbody>
          </table>
         </div>
        </div>
       </div>  
         </div>
         
          <!-- Buttons -->
        <div class="mt-4 text-center">         
         <button type="button" class="btn btn-success btn-sm" id="btnsubmit" onclick="submitFunction()">Update</button>
         <button type="reset" class="btn btn-danger btn-p btn-sm">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</div>




   

</div>
</div>
</div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>


  
  <!-- Bootstrap JS and dependencies -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<script src="js/Entry.js?v=<%=ts%>"></script> 
<script src="js/config.js"></script>

<script>
  // jQuery to toggle visibility of container-wrapper on button click
  $('#employee').on('click', function() {
    $('#container1').toggle();  // Toggles the visibility of the div
  });

  $('#department').on('click', function() {
    $('#container2').toggle();  // Toggles the visibility of the div
  });
  
  // jQuery to toggle visibility of container-wrapper on button click
  $('#received').on('click', function() {
    $('#container3').toggle();  // Toggles the visibility of the div
  });

  $('#rgp').on('click', function() {
    $('#container').toggle();  // Toggles the visibility of the div
  });
</script> 

<script>
function NonReturnable() {
    window.location.href = "NonReturnable.jsp";
}

function Received() {
    window.location.href = "Received.jsp";
}

function Returnable() {
    window.location.href = "Returnable.jsp";
}
</script> 
</body>
</html>