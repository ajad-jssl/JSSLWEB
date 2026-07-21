const MainPage = 'GPMSSecurity.jsp';
const UserId = sessionStorage.getItem('username');

let allowedActions = [];

// ============================================================
// SHARED USER/DEPARTMENT CACHE
// Built once from /api/websmartuser/getAll (same response already used
// for the "Requested By" name lookup). Each user record carries both
// dept_id and department, so the department name map comes from the
// same call — no extra API request needed.
// ============================================================
let userListCache = null;   // raw array of user records
let deptMapCache  = {};     // dept_id -> department name

// ============================================================
// SHIPMENT DELIVERY (Mode Of Dispatch) CACHE
// ============================================================
let shipmentDeliveryCache = null; // raw array
let shipmentModeMapCache  = {};   // si_id -> shipment_mode

async function loadShipmentDelivery() {
    if (shipmentDeliveryCache) return shipmentDeliveryCache;
    try {
        const res  = await fetch(new URL('/jssl/master/listshipmentdeliverynew', baseUrl), { credentials: 'include' });
        const data = await res.json();
        shipmentDeliveryCache = (data && Array.isArray(data.Data)) ? data.Data : [];
        shipmentModeMapCache = {};
        shipmentDeliveryCache.forEach(s => {
            shipmentModeMapCache[String(s.si_id).trim()] = s.shipment_mode;
        });
    } catch (e) {
        console.error('loadShipmentDelivery error:', e);
        shipmentDeliveryCache = [];
        shipmentModeMapCache  = {};
    }
    return shipmentDeliveryCache;
}

function getShipmentModeName(siId) {
    if (siId === undefined || siId === null || String(siId).trim() === '') return '';
    return shipmentModeMapCache[String(siId).trim()] || siId;
}

async function loadUserList() {
    if (userListCache) return userListCache;

    try {
        const res  = await fetch(new URL('/api/websmartuser/getAll', baseUrl), { credentials: 'include' });
        const data = await res.json();

        userListCache = (data && Array.isArray(data.Data)) ? data.Data : [];

        deptMapCache = {};
        userListCache.forEach(u => {
            if (u.dept_id !== undefined && u.dept_id !== null && String(u.dept_id).trim() !== '') {
                deptMapCache[String(u.dept_id).trim()] = u.department;
            }
        });
    } catch (e) {
        console.error('loadUserList error:', e);
        userListCache = [];
        deptMapCache  = {};
    }

    return userListCache;
}

// Resolve a department NAME for display from a stored dept_id.
// Falls back to the raw id if the cache hasn't loaded it (or isn't found).
function getDepartmentName(deptId) {
    if (deptId === undefined || deptId === null || String(deptId).trim() === '') return '';
    return deptMapCache[String(deptId).trim()] || deptId;
}

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



document.getElementById("modalScroll1").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}
	$('#exampleModalScrollable123').modal('show');
})

document.addEventListener("DOMContentLoaded", function() {
	loadActions();
	loadUserList();
	loadShipmentDelivery(); 
    // Fetch gatepass data from the backend
	fetch(new URL('/api/gatepass/all', baseUrl1)	, {
	    credentials: "include"
	})
   // fetch('http://localhost:8004/api/gatepass/all')  // Replace with your correct API endpoint
        .then(response => response.json())
        .then(data => {
            // Get the select element for "gatepass"
            const gatepassSelect = document.getElementById('gatepass');
            
            // Clear any existing options (if any)
            gatepassSelect.innerHTML = '<option value="">Select</option>';
            
            // Loop through the data and create new option elements
            data.forEach(gatepass => {
                const option = document.createElement('option');
                option.value = gatepass.gpid;  // Assuming 'gp_no' is the value for option
                option.textContent = gatepass.gp_no;  // Assuming 'gp_no' is the text for option
                gatepassSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching gatepass data:', error);
        });
});




document.addEventListener("DOMContentLoaded", function() {
    // Fetch GatePass data from the backend (replace with your actual API endpoint)
   // fetch('http://localhost:8004/api/gatepassno/all')  // This is your Spring Boot API endpoint
	fetch(new URL('/api/gatepassno/all', baseUrl1)   , {
       credentials: "include"
   })
        .then(response => response.json())  // Parse the JSON response
        .then(data => {
            console.log(data);  // Log the data to the console for debugging
            
            // Get the select element for gatepassno1
            const gatepassSelect = document.getElementById('gatepassno1');
            
            // Clear any existing options (except the default "Select")
            gatepassSelect.innerHTML = '<option value="">Select</option>';
            
            // Check if the data array is not empty
            if (data && data.length > 0) {
                // Loop through the gate pass data and create new option elements
                data.forEach(gatepass => {
                    const option = document.createElement('option');
                    option.value = gatepass.ngpid;  // ngpid as the value for the option
                    option.textContent = gatepass.gp_no;  // gp_no as the display text for the option
                    gatepassSelect.appendChild(option);  // Append the option to the dropdown
                });
            } else {
                // If no gate pass data is available, display a "No gate pass found" option
                const option = document.createElement('option');
                option.value = '';  // Empty value for "No gate pass"
                option.textContent = 'No gate pass found';
                gatepassSelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error('Error fetching gate pass data:', error);
            
            // Optionally, provide user feedback in case of an error
            const gatepassSelect = document.getElementById('gatepassno1');
            gatepassSelect.innerHTML = '<option value="">Error loading data</option>';
        });
});

$(document).ready(function () {
	getGpno();	
	getallgpno();
	getnGpno();
	});
	
	function getGpno() {
	    const factoryId = localStorage.getItem('selectedFactoryId'); // Ensure this is correctly set
	    const url = new URL(`/jssl/returnable/jims/gpno_nonsecurity?GP_type=1&factory_id=${factoryId}`, baseUrl1); // Correct template literal syntax
	    fetch(url, { credentials: "include" })
	        .then(response => {
	            if (!response.ok) {
	                throw new Error(`HTTP error! Status: ${response.status}`);
	            }
	            return response.json();
	        })
	        .then(data => {
	            console.log("API Response for Gpno:", data);
	            if (Array.isArray(data)) { 
	                const Gpnoselect = $("#gatepass");
	                Gpnoselect.empty();
	                Gpnoselect.append('<option value="" selected>Select Gpno</option>');
	                data.forEach(gatepass => {
	                    const gpno = gatepass.gp_no || "Unnamed Gpno";
	                    const Gp_id = gatepass.gpid || '';
	                    Gpnoselect.append(`<option value="${Gp_id}">${gpno}</option>`);  
	                });
	            } else {
	                console.error("Error: Data is not an array.", data);
	            }
	        })
	        .catch(error => {
	            console.error("Error fetching Gpno:", error);
	        });
	}

function getnGpno() {
   // const url = new URL('http://localhost:8004/jssl/returnable/jims/gpno_nonsecurity?GP_type=2');
    const factoryId = localStorage.getItem('selectedFactoryId');
   const url = new URL(`/jssl/returnable/jims/gpno_nonsecurity?GP_type=2&factory_id=${factoryId}`, baseUrl1);
  fetch(url, { credentials: "include" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response for Gpno:", data);
            if (Array.isArray(data)) { 
                const Gpnoselect = $("#gatepassno1");
                Gpnoselect.empty();
                Gpnoselect.append('<option value="" selected>Select NGpno</option>');
                data.forEach(gatepassno1 => {
                    const gpno = gatepassno1.gp_no || "Unnamed NGpno";
                    const Gp_id = gatepassno1.gpid || '';
                    Gpnoselect.append(`<option value="${Gp_id}">${gpno}</option>`);  
                });
            } else {
                console.error("Error: Data is not an array.", data);
            }
        })
        .catch(error => {
            console.error("Error fetching NGpno:", error);
        });
}


/*function getallgpno() {
    const factoryId = localStorage.getItem('selectedFactoryId');

    const returnableUrl = new URL(`/api/returnable/filter?factory_id=${factoryId}`, baseUrl1);
    const itemsReceivedUrl = new URL(`/api/itemsrecieved`, baseUrl1);

    const safeJson = (res) => {
        if (res.status === 204) return [];
        return res.text().then(text => text ? JSON.parse(text) : []);
    };

    Promise.all([
        fetch(returnableUrl, { credentials: "include" }).then(safeJson),
        fetch(itemsReceivedUrl, { credentials: "include" }).then(safeJson)
    ])
    .then(([returnableData, itemsReceivedData]) => {

        const receivedGpNoSet = new Set(
            itemsReceivedData
                .filter(item => item.security_received == 1)
                .map(item => item.gp_no)
        );

        const Gpnoselect = $("#gatepass_security");
        Gpnoselect.empty();
        Gpnoselect.append('<option value="" selected>Select Gpno</option>');

        if (!Array.isArray(returnableData)) return;

        returnableData.forEach(gp => {
            if (receivedGpNoSet.has(gp.gp_no)) return;

            Gpnoselect.append(
                `<option value="${gp.gpid}">${gp.gp_no}</option>`
            );
        });
    })
    .catch(err => {
        console.error("Error loading GP dropdown:", err);
    });
}
*/

function getallgpno() {
    const factoryId = localStorage.getItem('selectedFactoryId');

    const returnableUrl = new URL(
        `/api/returnable/filter?factory_id=${factoryId}`,
        baseUrl1
    );

    const safeJson = (res) => {
        if (res.status === 204) return [];
        return res.text().then(text => text ? JSON.parse(text) : []);
    };

    fetch(returnableUrl, { credentials: "include" })
        .then(safeJson)
        .then(returnableData => {

            const Gpnoselect = $("#gatepass_security");
            Gpnoselect.empty();
            Gpnoselect.append('<option value="" selected>Select Gpno</option>');

            if (!Array.isArray(returnableData)) return;

            // Get distinct records by gp_no
            const distinctGPs = [
                ...new Map(
                    returnableData.map(gp => [gp.gp_no, gp])
                ).values()
            ];

            distinctGPs.forEach(gp => {
                Gpnoselect.append(
                    `<option value="${gp.gpid}">${gp.gp_no}</option>`
                );
            });
        })
        .catch(err => {
            console.error("Error loading GP dropdown:", err);
        });
}

$('#gatepass').on('change', function() {
	const gp_id=$(this).val();
	getgpdetails(gp_id)
});

$('#gatepassno1').on('change', function() {
	const gp_id=$(this).val();
	getngpdetails(gp_id)
});


$('#gatepass_security').on('change', function() {
	const gp_id=$(this).val();
	getgpdetails(gp_id)
	const gpnoselect=$("#gatepass_security option:selected").text(); 
	/*getgpnoitemdetail(gpnoselect)*/
	updateitemdetailsintable(gpnoselect)
});

/*function getgpnoitemdetail(gpnoselect) {
    const url = new URL(`http://localhost:8004/jssl/contracts/jims/gpnoitemdetails?gp_no=${gpnoselect}`);
			fetch(url)
			        .then(response => {
			            console.log("Response status:", response.status);
			            if (!response.ok) {
			                throw new Error(`HTTP error! Status: ${response.status}`);
			            }
			            return response.json();
			        })
			        .then(data => {
			            console.log("API Response for item:", data);

			            // Check if data is valid and contains the required fields
			            if (data) {
			            
			                $("#date").val(data.createddate || ''); 
			                $("#requested").val(data.requestedby || '');  
			                $("#department").val(data.dept || ''); 
							$("#vendor").val(data.sentToClient || ''); 
							$("#despatch").val(data.sentThrough || ''); 
							$("#expected").val(data.returnDate || ''); 
							$("#reason").val(data.note || ''); 
							$("#remark").val(data.remarks || ''); 
							$("#enclosure").val(data.encl || ''); 
							
			            } else {
			                console.error("Error: gpdetails is not available.");
			            }
			        })
			        .catch(error => {
			            console.error("Error fetching gpdetails:", error);
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

function getgpdetails(gp_id) {

	       const gpUrl = new URL(`/api/returnable/${gp_id}`, baseUrl1);
	       const userUrl = new URL(`/api/websmartuser/getAll`, baseUrl);
	       const clientsUrl = new URL(`/api/clients`, baseUrl1);

	       Promise.all([
	           fetch(gpUrl, { credentials: "include" }).then(res => res.json()),
	           fetch(userUrl, { credentials: "include" }).then(res => res.json()),
	           fetch(clientsUrl, { credentials: "include" }).then(res => res.json()),
	           loadShipmentDelivery()   // ← add this so the map is ready before we use it
	       ])
	       .then(([gpData, usersResp, clientsResp]) => {

        if (!gpData) return;

        // ===============================
        // USERS ARRAY (FIXED)
        // ===============================
        const users = Array.isArray(usersResp.Data) ? usersResp.Data : [];

        // Keep the shared dept map in sync even if loadUserList() hasn't
        // resolved yet by the time this runs (cheap — same shape as cache).
        users.forEach(u => {
            if (u.dept_id !== undefined && u.dept_id !== null && String(u.dept_id).trim() !== '') {
                deptMapCache[String(u.dept_id).trim()] = u.department;
            }
        });

        // ===============================
        // FIND REQUESTED BY NAME
        // ===============================
        let requestedByName = "";
        const userObj = users.find(
            u => String(u.id).trim() === String(gpData.requestedby).trim()
        );

        if (userObj) {
            requestedByName = userObj.username; // ✅ CORRECT FIELD
        }

        // ===============================
        // CLIENTS ARRAY
        // ===============================
        const clients = Array.isArray(clientsResp)
            ? clientsResp
            : (clientsResp.data || clientsResp.clients || []);

        // ===============================
        // BUILD CLIENT MAP
        // ===============================
        const clientMap = {};
        clients.forEach(c => {
            clientMap[String(c.cid).trim()] = `${c.client_number}-${c.name}`;
        });

		/*const userMap = {};
		users.forEach(u => {
		    userMap[String(u.id).trim()] = u.username;
		});
		const sentToEmployee = gpData.sentToemployee;
		$('#received').val(userMap[String(sentToEmployee).trim()] || "");*/
		
        // ===============================
        // SET VALUES IN UI
        // ===============================
		$('#date').val(formatDate(gpData.createddate));
		$("#requested").val(requestedByName);
		$("#department").val(getDepartmentName(gpData.dept));
		$("#vendor").val(clientMap[String(gpData.sentToClient).trim()] || "");
		$("#despatch").val(getShipmentModeName(gpData.sentThrough));   // ← changed
		$("#expected").val(gpData.returnDate || "");
		$("#reason").val(gpData.note || "");
		$("#remark").val(gpData.remarks || "");
		$("#enclosure").val(gpData.encl || "");

    })
    .catch(error => {
        console.error("Error fetching GP details:", error);
    });
}


function getngpdetails(gp_id) {

    const gpUrl = new URL(`/api/returnable/${gp_id}`, baseUrl1);
    const userUrl = new URL(`/api/websmartuser/getAll`, baseUrl);
    const clientsUrl = new URL(`/api/clients`, baseUrl1);

    Promise.all([
        fetch(gpUrl, { credentials: "include" }).then(res => { if (!res.ok) throw new Error("Failed to fetch GP details"); return res.json(); }),
        fetch(userUrl, { credentials: "include" }).then(res => { if (!res.ok) throw new Error("Failed to fetch users"); return res.json(); }),
        fetch(clientsUrl, { credentials: "include" }).then(res => { if (!res.ok) throw new Error("Failed to fetch clients"); return res.json(); }),
        loadShipmentDelivery()   // ← add this
    ])
    .then(([gpData, usersResp, clientsResp]) => {

        console.log("GP Data:", gpData);
        console.log("Users:", usersResp);
        console.log("Clients:", clientsResp);

        if (!gpData) {
            console.error("GP data not found");
            return;
        }

        // ===============================
        // USERS ARRAY
        // ===============================
        const users = Array.isArray(usersResp.Data) ? usersResp.Data : [];

        // Keep the shared dept map in sync (same reasoning as getgpdetails).
        users.forEach(u => {
            if (u.dept_id !== undefined && u.dept_id !== null && String(u.dept_id).trim() !== '') {
                deptMapCache[String(u.dept_id).trim()] = u.department;
            }
        });

        // ===============================
        // FIND REQUESTED BY NAME
        // ===============================
        let requestedByName = "";
        const userObj = users.find(u =>
            String(u.id).trim() === String(gpData.requestedby).trim()
        );

        if (userObj) {
            requestedByName = userObj.username;
        }

        // ===============================
        // CLIENTS ARRAY
        // ===============================
        const clients = Array.isArray(clientsResp)
            ? clientsResp
            : (clientsResp.data || clientsResp.clients || []);

        // ===============================
        // BUILD CLIENT MAP
        // ===============================
        const clientMap = {};
        clients.forEach(c => {
            clientMap[String(c.cid).trim()] = `${c.client_number}-${c.name}`;
        });

        // ===============================
        // SET FORM VALUES
        // ===============================
		$('#date').val(formatDate(gpData.createddate));
		$("#requested").val(requestedByName || '');
		$("#department").val(getDepartmentName(gpData.dept));
		$("#vendor").val(clientMap[String(gpData.sentToClient).trim()] || '');
		$("#despatch").val(getShipmentModeName(gpData.sentThrough));   // ← changed
		$("#reason").val(gpData.note || '');
		$("#remark").val(gpData.remarks || '');
		$("#enclosure").val(gpData.encl || '');

    })
    .catch(error => {
        console.error("Error fetching NGP details:", error);
    });
}


$(document).ready(function() {
$('#submit').on('click', function() {
	const gp_id1=$("#gatepass").val();
	Addevent(gp_id1);
});
});	

$(document).ready(function() {
$('#submit1').on('click', function() {
	const gp_id1=$("#gatepassno1").val();
	addngpevent(gp_id1);
});
});	

let gp_id1 = null;

$(document).ready(function () {
    // When "Create" is clicked, show modal and store gp_id1
	$("#submitsr").click(function () {
	    console.log("Create clicked - Validating form");

	    let gatepassNo = $("#gatepass option:selected").val();  // or #gatepass_security if applicable

	    if (!gatepassNo) {
	        showModalPopup("Please select a Gatepass No.");
	        return;  // Stop further execution
	    }

	    if (validateaddeventFields()) {
			gp_id1 = $("#gatepass").val();
	        console.log("GatePass No selected - Showing main modal");
	        $("#exampleModalCenter71").modal("show");
	    } else {
	        console.log("Validation failed - Modal will not show");
	    }
	});

    $("#cancelmodal").click(function () {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter71").modal("hide");
    });

    // When "Yes" is clicked, use gp_id1 that was stored above
    $(document).on("click", "#confirmsecurity", function () {
        console.log("Yes clicked - Proceeding with creation. gp_id1:", gp_id1);

        $("#exampleModalCenter71").modal("hide");
        Addevent(gp_id1);
    });
});

function validateaddeventFields() {
    var isValid = true;

	var gstdcno = $('#GST').val();
	var weight = $('#weight').val();
	var remarks = $('#security').val();

     $('.error-message').hide();  // Clear previous errors gatepass

   /* if (!gstdcno) {
        $('#GSTError').show();
        isValid = false;
    }
    if (!weight) {
        $('#weightError').show();
        isValid = false;
    }*/
    if (!remarks) {
        $('#securityError').show();
        isValid = false;
    }
    return isValid;
}

function Addevent(gp_id1)
{
	var gstdcno = $('#GST').val();
	var weight = $('#weight').val();
	var remarks = $('#security').val();
	
	/*if (!remarks) {
	        alert("Please enter remarks.");
	        return;  // Stop the function from proceeding further
	    }*/

	
	// Create a new Date object for current date and time
				 let currentDate = new Date();

				
				 let currentDateTimeString = getIndianDateTimeFormat(currentDate);  
				 
				 var requestData={
					
					"exitweight": weight,
					"gstDCNo": gstdcno,
					"security": 1,
					"securityremark": remarks,
					"securityoutdt": currentDateTimeString,
					"updatedDate": currentDateTimeString,
					 "updatedBy": parseInt(createdById) || null  
					};

					// Log the requestData to verify
					      console.log('Sending data:', requestData);

					      // Make the AJAX request to submit the data
						  $.ajax({
						// url: `http://localhost:8004/api/returnable/${gp_id1}`,
						url: new URL(`/api/returnable/${gp_id1}`, baseUrl1),
						      type: 'PUT',
							  xhrFields: {
							  	    withCredentials: true
							  	},
						      contentType: 'application/json', // Set content type to JSON
						      data: JSON.stringify(requestData), // Send data as a JSON string
						      dataType: 'json', // Expected response type
						      success: function(data) {
						          // Check if status is "Success"
						          if (data.status === "Success") {
									var popup = $('<div class="popup">Inserted Successfully!</div>').appendTo('body').hide().fadeIn(400);
									            setTimeout(function () {
									                popup.fadeOut(400, function () {
									                    $(this).remove();
									                    window.location = "SecurityReturnable.jsp";
									                });
									            }, 2000);
						             // alert("Added successfully");
						          } else {
						              alert("Record not inserted. Please try again.");
						          }
						      },
						    /*  error: function(xhr, status, error) {
						          // Handle any error that occurred during the AJAX request
						          alert("An error occurred: " + error);
						      }*/
						  });
}


$(document).ready(function () {
    // When "Create" is clicked, show modal and store gp_id1
	$("#submitngp").click(function () {
	        console.log("Create clicked - Validating form");
			
			let gatepassNo = $("#gatepassno1 option:selected").val();  // or #gatepass_security if applicable

			    if (!gatepassNo) {
			        showModalPopup("Please select a Gatepass No.");
			        return;  // Stop further execution
			    }

	        if (validateaddngpeventFields()) {
				gp_id1 = $("#gatepassno1").val(); // get gp_id1 before showing modal
				console.log("Create clicked - Modal will show. gp_id1:", gp_id1);
				$("#exampleModalCenter72").modal("show");
	        } else {
	            console.log("Validation failed - Modal will not show");
	        }
	    });

    $("#cancelngpmodal").click(function () {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter72").modal("hide");
    });

    // When "Yes" is clicked, use gp_id1 that was stored above
    $(document).on("click", "#confirmngpsecurity", function () {
        console.log("Yes clicked - Proceeding with creation. gp_id1:", gp_id1);

        $("#exampleModalCenter72").modal("hide");
        addngpevent(gp_id1);
    });
});

function validateaddngpeventFields() {
    var isValid = true;

	var remarks = $('#securityremarks').val();

     $('.error-message').hide();  // Clear previous errors

    if (!remarks) {
        $('#securityremarksError').show();
        isValid = false;
    }
    return isValid;
}

function addngpevent(gp_id1)
{

	var remarks = $('#securityremarks').val();
	
	/*if (!remarks) {
		        alert("Please enter remarks.");
		        return;  // Stop the function from proceeding further
		    }*/
	
	// Create a new Date object for current date and time
				 let currentDate = new Date();
				
				 let currentDateTimeString = getIndianDateTimeFormat(currentDate);  
				 
				 var requestData={
					"security": 1,
					"securityremark": remarks,
					"securityoutdt": currentDateTimeString,
					"updatedDate": currentDateTimeString,
					"updatedBy": parseInt(createdById) || null  
					};

					// Log the requestData to verify
					      console.log('Sending data:', requestData);

					      // Make the AJAX request to submit the data
						  $.ajax({
						// url: `http://localhost:8004/api/returnable/${gp_id1}`,
						url: new URL(`/api/returnable/${gp_id1}`, baseUrl1),
						      type: 'PUT',
							  xhrFields: {
							  	    withCredentials: true
							  	},
						      contentType: 'application/json', // Set content type to JSON
						      data: JSON.stringify(requestData), // Send data as a JSON string
						      dataType: 'json', // Expected response type
						      success: function(data) {
						          // Check if status is "Success"
						          if (data.status === "Success") {
									var popup = $('<div class="popup">Inserted Successfully!</div>').appendTo('body').hide().fadeIn(400);
																		            setTimeout(function () {
																		                popup.fadeOut(400, function () {
																		                    $(this).remove();
																		                    window.location = "SecurityNonReturnable.jsp";
																		                });
																		            }, 2000);
						              //alert("Added successfully");
						          } else {
						              alert("Record not inserted. Please try again.");
						          }
						      },
						    /*  error: function(xhr, status, error) {
						          // Handle any error that occurred during the AJAX request
						          alert("An error occurred: " + error);
						      }*/
						  });
}


function updateitemdetailsintable(gpnoselect) {

    const itemUrl = new URL(`/jssl/contracts/jims/gpnoitemdetails?gp_no=${gpnoselect}`, baseUrl1);
    const unitUrl = new URL(`/api/items/all`, baseUrl1);

    Promise.all([
        fetch(itemUrl, { credentials: "include" }).then(res => res.json()),
        fetch(unitUrl, { credentials: "include" }).then(res => res.json())
    ])
    .then(([itemsData, unitData]) => {

        console.log("Items Data:", itemsData);
        console.log("Unit Master:", unitData);

        // 🔹 Build unitId → unitName map
        const unitMap = {};
        unitData.forEach(u => {
            //unitMap[u.uid] = u.unit;
			unitMap[u.unit] = u.unit;
        });

        const tableBody = $("#tableID tbody");
        tableBody.empty();

        if (Array.isArray(itemsData) && itemsData.length > 0) {

            let serialNo = 1;

            itemsData.forEach(item => {
                const isRemainingZero = Number(item.remaining) === 0;
                const unitName = unitMap[item.UM] || ''; // ✅ UNIT NAME

                const row = `
                    <tr>
                        <td>${serialNo++}</td>
                        <td>${item.ItemNo || ''}</td>
                        <td>${unitName}</td>
                        <td>${item.itmDescription1 || ''}</td>
                        <td>${item.qty || ''}</td>
                        <td>${item.remaining || ''}</td>
                        <td style="display:none;">${item.item || ''}</td>

                        <td>
                            <input type="text"
                                   class="form-control" onkeydown="return allowOnlyPositive(event)"
                                   value="${item.dcRef || ''}"
                                   data-item-id="${item.item}"
                                   data-field="dcRef"
                                   ${isRemainingZero ? 'readonly' : ''}>
                        </td>

                        <td>
                            <input type="number"
                                   class="form-control" onkeydown="return allowOnlyPositive(event)"
                                   value="${item.geRcvdQty || ''}"
                                   data-item-id="${item.item}"
                                   data-field="geRcvdQty"
                                   ${isRemainingZero ? 'readonly' : ''}>
                        </td>

                        <td>
                            <input type="checkbox"
                                   class="form-check-input selectCheckbox"
                                   style="margin: 16px;"
                                   data-item-id="${item.item}"
                                   disabled>
                        </td>
                    </tr>`;
                tableBody.append(row);
            });

            // ✅ Input validation
            $("#tableID").off("input").on("input",
                "input[data-field='dcRef'], input[data-field='geRcvdQty']",
                function () {

                const row = $(this).closest("tr");
                const dcRef = row.find("input[data-field='dcRef']").val().trim();
                const geRcvdQty = Number(row.find("input[data-field='geRcvdQty']").val());
                const remaining = Number(row.find("td:eq(5)").text());
                const checkbox = row.find(".selectCheckbox");

                if (geRcvdQty > remaining) {
                    showModalPopup("Received Qty must not exceed Remaining Qty.");
                    $(this).val('');
                    checkbox.prop("checked", false).prop("disabled", true);
                    return;
                }

                if (dcRef !== "" && geRcvdQty > 0 && geRcvdQty <= remaining) {
                    checkbox.prop("disabled", false);
                } else {
                    checkbox.prop("checked", false).prop("disabled", true);
                }
            });

            // ✅ Checkbox handler
            $(".selectCheckbox").off("change").on("change", function () {

                const row = $(this).closest("tr");
                const itemId = $(this).data("item-id");
                const dcRef = row.find("input[data-field='dcRef']").val().trim();
                const geRcvdQty = Number(row.find("input[data-field='geRcvdQty']").val());
                const remaining = Number(row.find("td:eq(5)").text());

                if (dcRef === "" || geRcvdQty <= 0 || geRcvdQty > remaining) {
                    alert("Received Qty must be greater than 0 and not exceed Remaining Qty.");
                    $(this).prop("checked", false);
                    return;
                }

                if (this.checked) {
                    getdcqty(itemId, dcRef, geRcvdQty);
                }
            });

        } else {
            tableBody.append(
                '<tr><td colspan="10" class="text-center">No data available</td></tr>'
            );
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        $("#tableID tbody").empty();
    });
}

function generateGpentryno(callback) {
    // Fetch the current count from the backend
    $.ajax({
       // url: 'http://localhost:8004/jssl/contracts/jims/gpitemrecieve?gp_type=1', // Your Spring Boot endpoint
	   url:new URL('/jssl/contracts/jims/gpitemrecieve?gp_type=1', baseUrl1),
		type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
		       success: function(count) {
		           // Generate the GP number similar to the ASP.NET logic
				   const year = new Date().getFullYear();
				             const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
				             const formattedCount = ('000' + (count + 1)).slice(-4); // Add leading zeros to the count
				             
				             const gpentry = `GE/${year}/${month}/${formattedCount}`;
		           
		           // Call the callback function with the generated gp_no
		           callback(gpentry);
		       },
		       error: function(error) {
		           console.error('Error generating GPentry number:', error);
		       }
		   });
}

let selectedItems = [];
function getdcqty(itemId, dcRef, geRcvdQty) {
    selectedItems.push({ itemId, dcRef, geRcvdQty });
}

$(document).ready(function () {

    // ✅ Create button click
    $("#createret").click(function () {
        console.log("Create clicked");

        // Gatepass No Validation
        let gatepassNo = $("#gatepass_security option:selected").val();
        if (!gatepassNo) {
            showModalPopup("Please select a Gatepass No.");
            return;
        }

        // Security Remarks Validation
        const securityremarks = $("#securityremarks").val().trim();
        if (!securityremarks) {
            $("#securityremarksError").show();
            return;
        } else {
            $("#securityremarksError").hide();
        }

        // DC Ref & Received Qty validation
        let invalidInput = false;
        $("#tableID tbody tr").each(function () {
            const dcRef = $(this).find("input[data-field='dcRef']").val().trim();
            const geRcvdQty = Number($(this).find("input[data-field='geRcvdQty']").val());
            const remaining = Number($(this).find("td:eq(5)").text());

            if (!dcRef || geRcvdQty <= 0 || geRcvdQty > remaining) {
                invalidInput = true;
                return false; // break loop
            }
        });

        if (invalidInput) {
            showModalPopup("Please fill valid DC Ref and Received Qty for all items.");
            return;
        }

        // Remaining quantity check
        let remainingQty = calculateRemainingQty();
        if (remainingQty === 0) {
            showModalPopup("No qty to receive!");
            $("#gatepass_security").prop('disabled', true);
            return;
        }

        console.log("Main modal will show");
        $("#exampleModalCenter73").modal("show");
    });

    // Cancel button
    $("#cancelret").click(function () {
        console.log("No clicked - Main modal will hide");
        $("#exampleModalCenter73").modal("hide");
    });

    // Confirm submission
    $(document).on("click", "#confirmretSubmission", function () {
        console.log("Yes clicked - Proceeding with creation");
        $("#exampleModalCenter73").modal("hide");

        const gpnoselect1 = $("#gatepass_security option:selected").text();
        let currentDate = new Date();
        let currentDateTimeString = getIndianDateTimeFormat(currentDate);

        const securityremarks = $("#securityremarks").val().trim();
        if (!securityremarks) {
            alert("Please enter remarks.");
            return;
        }

        const selectedFactoryId = localStorage.getItem('selectedFactoryId');
        console.log('selectedFactoryId:', selectedFactoryId);

        generateGpentryno(function (gpentry) {
            selectedItems.forEach(item => {
                const { itemId, dcRef, geRcvdQty } = item;

                const requestData = {
                    "gp_no": gpnoselect1,
                    "gps_entry": gpentry,
                    "gp_type": 1,
                    "itemno": itemId,
                    "dc_ref": dcRef,
                    "return_qty": geRcvdQty,
                    "created_by": createdById,
                    "created_date": currentDateTimeString,
                    "security_received": 1,
                    "security_remarks": securityremarks,
                    "factory_id": selectedFactoryId
                };

                addsecurityrecieved(requestData);
            });

            selectedItems = [];
        });
    });

});

// Function to show the modal with a custom error message
function showModalPopup(message) {
    // Set the error message
    $('#errorMessageup').text(message);
    // Show the error modal
    $('#exampleModalCenterDupUP').modal('show');
}

// Function to close the error modal when "OK" is clicked
$(document).on('click', '#modalok', function() {
    // Hide the error modal when "OK" is clicked
    $('#exampleModalCenterDupUP').modal('hide');
});

function calculateRemainingQty() {
    let totalRemainingQty = 0;
    selectedItems.forEach(item => {
        totalRemainingQty += item.geRcvdQty; // or however you track the remaining qty
    });
    return totalRemainingQty;
}


function addsecurityrecieved(requestData)
{
	$.ajax({
	      // url: 'http://localhost:8004/api/itemsrecieved', // Your API endpoint
		  url:new URL('/api/itemsrecieved', baseUrl1),
	       type: 'POST',
		   xhrFields: {
		   	    withCredentials: true
		   	},
	       contentType: 'application/json', // Sending JSON data
	       data: JSON.stringify(requestData), // Send the request data as JSON
	       success: function (response) {
	           if (response.status === "Success") {
				var popup = $('<div class="popup">Item added Successfully!</div>').appendTo('body').hide().fadeIn(400);
													            setTimeout(function () {
													                popup.fadeOut(400, function () {
													                    $(this).remove();
													                    window.location = "ReturnableReceived.jsp";
													                });
													            }, 2000);
	              // alert("Item added successfully");
	           } else {
	               alert("Failed to add item. Please try again.");
	           }
	       },
	       error: function (xhr, status, error) {
	           console.error("Error inserting data:", error);
	           alert("An error occurred. Please try again.");
	       }
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