
const MainPage = 'VehicleOut.jsp';
const UserId = sessionStorage.getItem('username');

let allowedActions = [];

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
            {
                method: "GET",
                credentials: "include", // 🔐 send cookies/session
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch actions");
        }

        allowedActions = await response.json();
		
		

    } catch (error) {
        console.error("Error:", error);
    }
}


let userMap = {}; // id -> { username, department }

async function loadUserMap() {
    try {
        const response = await fetch(new URL('/api/websmartuser/getAll', baseUrl1), {
            credentials: "include"
        });
        const data = await response.json();
        if (data && Array.isArray(data.Data)) {
            data.Data.forEach(u => {
                userMap[String(u.id)] = {
                    username: u.username,
                    department: u.department
                };
            });
        }
    } catch (err) {
        console.error("Failed to load user map", err);
    }
}

document.getElementById("modalScroll1").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}
	$('#exampleModalScrollable123').modal('show');
})

document.addEventListener("DOMContentLoaded", function() { 
	loadActions();
	loadUserMap();
	const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
  // Fetch the list of Vehicle IDs and populate the select dropdown
  fetch(new URL(`/api/invoiceexit/jims/vechileoutpending?factoryid=${selectedFactoryId}`,baseUrl1)  , {
      credentials: "include"
  })
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
      const vehicleSelect = document.getElementById("Vehicleid");
      vehicleSelect.innerHTML = "<option value=''>Select</option>";
      
      data.forEach(vehicle => {
        const option = document.createElement("option");
        option.value = vehicle.vechile_id;
        option.textContent = vehicle.vechile_id;
        vehicleSelect.appendChild(option);
      });
	  
	  
	 initializeSelect2();
    })
    .catch(error => {
      console.error("Error fetching vehicle data:", error);
    });
	});
	
	
	
	
	function initializeSelect2() {
	    if (window.jQuery && $.fn.select2) {
			$('#Vehicleid').select2({
			          placeholder: 'Select Vehicle Type',
			          allowClear: true,
			          width: '100%',
			          dropdownParent: $('#exampleModalScrollable123'), // Bind to modal
			          templateResult: function(data) {
			              if (!data.id) return data.text;
			              return $('<span>' + data.text + '</span>');
			          },
			          templateSelection: function(data) {
			              return data.text;
			          }
			      });
				  $('#invoice_no').select2({
				  	          placeholder: 'Select Invoice No',
				  	          allowClear: true,
				  	          width: '100%',
				  	          dropdownParent: $('#exampleModalScrollable123'), // Bind to modal
				  	          templateResult: function(data) {
				  	              if (!data.id) return data.text;
				  	              return $('<span>' + data.text + '</span>');
				  	          },
				  	          templateSelection: function(data) {
				  	              return data.text;
				  	          }
				  	      });
			}
			}
	

	document.addEventListener("DOMContentLoaded", function() { 
	  fetch(new URL(`/api/invoiceexit/jims/getinvoicexitinvoicenumber`,baseUrl1)  , {
	      credentials: "include"
	  })
	    .then(response => response.json())  // Parse the JSON response
	    .then(data => {
	      const vehicleSelect = document.getElementById("invoice_no");
	      vehicleSelect.innerHTML = "<option value='0'>Select</option>";
		 vehicleSelect.innerHTML = "<option value='NA'>NA</option>";
	      
	      data.forEach(vehicle => {
	        const option = document.createElement("option");
	        option.value = vehicle.invoice_no;
	        option.textContent = vehicle.invoice_no;
	        vehicleSelect.appendChild(option);
	      });
		  initializeSelect2();
	    })
	    .catch(error => {
	      console.error("Error fetching vehicle data:", error);
	    });
		});
	
  // Function to fetch and update vehicle details
 /* function fetchVehicleDetails(vechile_id) {
    console.log("Fetching details for Vehicle ID:", vechile_id);

    fetch(`http://localhost:8004/api/invoiceexit/jims/vechicledetails?vechile_id=${vechile_id}`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched vehicle details:", data);

        if (!Array.isArray(data) || data.length === 0) {
          alert("No vehicle details found for the given ID.");
          return;
        }

        const vehicle = data[0]; // Get the first result object

        const container = document.getElementById("container1");
        container.style.display = "block";

        // Clear all form fields
        const fieldIds = [
          "vehicleno", "tname", "register", "vehicle in", "driver", "dmno",
          "dlno", "vtype", "hname", "whom", "inremarks", "contract", "lotno", "invoiceno"
        ];
        fieldIds.forEach(id => {
          const element = document.getElementById(id);
          if (element) element.value = "";
        });

        // Populate form fields with vehicle data
        document.getElementById("vehicleno").value = vehicle.vecno || "";
        document.getElementById("tname").value = vehicle.Company_name || "";
        document.getElementById("register").value = vehicle.regtype || "";
        document.getElementById("vehicle in").value = vehicle.vdate || "";
        document.getElementById("driver").value = vehicle.dname || "";
        document.getElementById("dmno").value = vehicle.dmbno || "";
        document.getElementById("dlno").value = vehicle.dl || "";
        document.getElementById("vtype").value = vehicle.Vtype || "";
        document.getElementById("hname").value = vehicle.helper || "";
        document.getElementById("whom").value = vehicle.fullname || "";
        document.getElementById("inremarks").value = vehicle.inremarks || "";
        document.getElementById("contract").value = vehicle.contract || "";
        document.getElementById("lotno").value = vehicle.lotno || "";
        document.getElementById("invoiceno").value = vehicle.invoiceno || "";
      })
      .catch(error => {
        console.error("Error fetching vehicle details:", error);
        alert("Failed to fetch vehicle details. Please try again.");
      });
  }*/
  function formatDate(datetimeString) {
  		       if (!datetimeString) return "";

  		       const date = new Date(datetimeString);

  		       const day = String(date.getDate()).padStart(2, "0");
  		       const month = String(date.getMonth() + 1).padStart(2, "0");
  		       const year = date.getFullYear();

  		       return `${day}-${month}-${year}`;
  		   }
		   
  let selectedIneId = null;
  
  let selectedVehicleId = null;

  function isLoadingVehicle(vid) {
      return !!vid && vid.toUpperCase().startsWith("VL");
  }

  // VL -> invoice enabled + required | MI -> invoice empty + readonly
  function applyInvoiceRule(vid) {
      const $inv = $('#invoice_no');
      $('#invoice_noError').hide();

      if (isLoadingVehicle(vid)) {
          $inv.prop('disabled', false);
      } else {
          $inv.val(null).trigger('change');   // clear selection (select2 aware)
          $inv.prop('disabled', true);        // readonly for MI
      }
  }
  
  function fetchVehicleDetails(vechile_id) {
      console.log("Fetching details for Vehicle ID:", vechile_id);

      // First API call: fetch vehicle details
      fetch(
          new URL(`/api/invoiceexit/jims/vehicleDetails?filterType=byVehicleId&vechile_id=${vechile_id}`, baseUrl1),
          { credentials: "include" }
      )
          .then(response => response.json())
          .then(data => {
              console.log("Fetched vehicle details:", data);

              if (!Array.isArray(data) || data.length === 0) {
                  alert("No vehicle details found for the given ID.");
                  return;
              }

              const vehicle = data[0]; // First record
              selectedIneId = vehicle.ine_id;

			  selectedVehicleId = vechile_id;
			  applyInvoiceRule(vechile_id);
			  
              const container = document.getElementById("container1");
              container.style.display = "block";

              // ------------------ CLEAR FORM FIELDS ------------------
              const fieldIds = [
                  "vehicleno", "tname", "register", "vehicle in", "driver", "dmno",
                  "dlno", "vtype", "hname", "whom", "inremarks",
                  "contract", "lotno", "invoiceno"
              ];

              fieldIds.forEach(id => {
                  const element = document.getElementById(id);
                  if (element) element.value = "";
              });

              // ------------------ POPULATE FORM FIELDS ------------------
              document.getElementById("vehicleno").value = vehicle.vecno || "";
              document.getElementById("department").value = vehicle.Department_name || "";
			  const userInfo = userMap[String(vehicle.wtm)];

			  document.getElementById("whom").value = userInfo ? userInfo.username : (vehicle.wtm || "");
			  document.getElementById("department").value = userInfo
			      ? userInfo.department
			      : (vehicle.Department_name || "");
              document.getElementById("tname").value = vehicle.Company_name || "";
              document.getElementById("register").value = vehicle.regtype || "";
              document.getElementById("vehicle in").value = vehicle.vdate ? formatDate(vehicle.vdate) : "";
              document.getElementById("driver").value = vehicle.dname || "";
              document.getElementById("dmno").value = vehicle.dmbno || "";
              document.getElementById("dlno").value = vehicle.dl || "";
              document.getElementById("vtype").value = vehicle.Vtype || "";
              document.getElementById("hname").value = vehicle.helper || "";
              document.getElementById("inremarks").value = vehicle.inremarks || "";
              document.getElementById("contract").value = vehicle.contract || "";
              document.getElementById("lotno").value = vehicle.lotno || "";
              document.getElementById("invoiceno").value = vehicle.invoiceno || "";

              // ------------------ VL / MI LOGIC ------------------
              const table = document.getElementById("TableID");

              // If Vehicle ID starts with VL → hide table and stop
              if (vechile_id && vechile_id.startsWith("VL")) {
                  table.style.display = "none";
                  document.querySelector("#TableID tbody").innerHTML = "";
                  return; // ❌ do NOT fetch PO data
              }

              // Else (MI) → show table
              table.style.display = "table";

              // ------------------ SECOND API CALL (PO DETAILS) ------------------
              fetch(
                  new URL(`/api/incponumber/jims/vehiclepo?filterType=byVehicleId&vechile_id=${vechile_id}`, baseUrl1),
                  { credentials: "include" }
              )
                  .then(response => response.json())
                  .then(poData => {
                      console.log("Fetched PO data:", poData);

                      let tableRows = "";

                      if (Array.isArray(poData) && poData.length > 0) {
                          poData.forEach((po, index) => {
                              tableRows += `
                                  <tr>
                                      <td>${index + 1}</td>
                                      <td>${po.Company_name || ""}</td>
                                      <td>${po.City_name || ""}</td>
                                      <td>${po.Address || ""}</td>
                                      <td>${po.Po_number || ""}</td>
                                      <td>${po.Po_date || ""}</td>
                                      <td>${po.Inv_no || ""}</td>
                                      <td>${po.Inv_date || ""}</td>
                                      <td>${po.DC_no || ""}</td>
                                      <td>${po.DC_date || ""}</td>
                                      <td>${po.qty || ""}</td>
                                      <td>${po.weight || ""}</td>
                                      <td>${po.Descp || ""}</td>
                                  </tr>
                              `;
                          });
                      } else {
                          table.style.display = "none";
                      }

                      document.querySelector("#TableID tbody").innerHTML = tableRows;
                  })
                  .catch(error => {
                      console.error("Error fetching PO data:", error);
                      alert("Failed to fetch PO data.");
                  });
          })
          .catch(error => {
              console.error("Error fetching vehicle details:", error);
              alert("Failed to fetch vehicle details. Please try again.");
          });
  }

$("#btnsubmit").click(function () {
    validateAndConfirm(); // Perform validation first
});

/*function validateAndConfirm() {
    const inv_no = document.getElementById("invoice_no").value;
    const Lrno = document.getElementById("lrno").value;
    const outrmks = document.getElementById("outremarks").value;
	const invno = document.getElementById("invoice_no").value;

    let isValid = true;
    $('.error-message').hide();

    if (!invno) {
        $('#invoice_noError').show();
        isValid = false;
    }
    if (!Lrno) {
        $('#lrnoError').show();
        isValid = false;
    }
    if (!outrmks) {
        $('#outremarksError').show();
        isValid = false;
    }

    if (!isValid) return;

    // If validation passed, show confirmation modal
    $("#exampleModalCenter325").modal("show");

    // Store values for submission after confirmation
    $("#confirmvehoutyes").off('click').on('click', function () {
        $("#exampleModalCenter325").modal("hide"); // hide modal before submission
        submitFunction(inv_no, Lrno, outrmks);
    });
}*/


function validateAndConfirm() {
    const isVL = isLoadingVehicle(selectedVehicleId);
    const inv_no = isVL ? document.getElementById("invoice_no").value : null; // MI -> null
    const Lrno = document.getElementById("lrno").value;
    const outrmks = document.getElementById("outremarks").value;

    let isValid = true;
    $('.error-message').hide();

    // Invoice required ONLY for VL
    if (isVL && !inv_no) {
        $('#invoice_noError').show();
        isValid = false;
    }
    if (!Lrno) {
        $('#lrnoError').show();
        isValid = false;
    }
    if (!outrmks) {
        $('#outremarksError').show();
        isValid = false;
    }

    if (!isValid) return;

    $("#exampleModalCenter325").modal("show");

    $("#confirmvehoutyes").off('click').on('click', function () {
        $("#exampleModalCenter325").modal("hide");
        submitFunction(inv_no, Lrno, outrmks);
    });
}

function submitFunction(inv_no, Lrno, outrmks) {
    let currentDate = new Date();
    let currentDateTimeString = getIndianDateTimeFormat(currentDate);
    let currentTimeOnly = getIndianTimeOnly(currentDate); 

    const vehicleData = {
        invoice_id: inv_no,
        outtime: currentTimeOnly,
        lr_no: Lrno,
        ddate: currentDateTimeString,
        outremarks: outrmks,
        modified_by: createdById,
        modified_date: currentDateTimeString
    };

    fetch(new URL(`/api/invoiceexit/${selectedIneId}`, baseUrl1), {
        method: 'PUT',
		credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleData)
    })
    .then(response => {
        if (response.ok) {
            showPopup('Data submitted successfully!',"VehicleOut.jsp");
            //clearFormFields();
        } else {
            return response.text().then(errorMessage => {
                alert('Error submitting data: ' + errorMessage);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

function getIndianDateTimeFormat(date) {
    const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
    };

    const istDate = new Date(date.toLocaleString('en-US', options));

    const day = istDate.getDate().toString().padStart(2, '0');
    const month = (istDate.getMonth() + 1).toString().padStart(2, '0');
    const year = istDate.getFullYear();

    const hours = istDate.getHours().toString().padStart(2, '0');
    const minutes = istDate.getMinutes().toString().padStart(2, '0');
    const seconds = istDate.getSeconds().toString().padStart(2, '0');

    // Format it as ISO-8601: yyyy-MM-dd'T'HH:mm:ss
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}


function getIndianTimeOnly(date) {
    const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
    };

    const istDate = new Date(date.toLocaleString('en-US', options));

    const hours = istDate.getHours().toString().padStart(2, '0');
    const minutes = istDate.getMinutes().toString().padStart(2, '0');
    const seconds = istDate.getSeconds().toString().padStart(2, '0');

    // Return the time in HH:mm:ss format, which Java can easily deserialize
    return `${hours}:${minutes}:${seconds}`;
}


  // Event listener for VehicleID change
  const vehicleSelect = document.getElementById("Vehicleid");
  
	
/*	$(vehicleSelect).on('change', function () {
    const selectedVehicleID = vehicleSelect.value;
    console.log("Selected Vehicle ID:", selectedVehicleID);
    
    if (selectedVehicleID) {
      fetchVehicleDetails(selectedVehicleID);  // Fetch and populate details
    } else {
      document.getElementById("container1").style.display = "none";  // Hide the container if no vehicle selected
    }
  });*/
  
  
  $(vehicleSelect).on('change', function () {
      const selectedVehicleID = vehicleSelect.value;

      if (selectedVehicleID) {
          fetchVehicleDetails(selectedVehicleID);
      } else {
          selectedVehicleId = null;
          document.getElementById("container1").style.display = "none";
      }
  });
  
  

function showPopup(message, redirectUrl) {
		    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
		    setTimeout(function () {
		        popup.fadeOut(400, function () {
		            $(this).remove();
		            window.location = redirectUrl;
		        });
		    }, 2000);
		}