
/*document.addEventListener("DOMContentLoaded", function() {
	
	    let userMap = {};
	    

	    fetch(new URL('/api/websmartuser/getAll', baseUrl1), {
	        credentials: "include"
	    })
	    .then(res => res.json())
	    .then(response => {

	        console.log("User API Response:", response);

	        if (response && Array.isArray(response.Data)) {

	            response.Data.forEach(u => {
	                userMap[String(u.id)] = u.username;
	            });

	            console.log("User Map Ready:", userMap);
	        } else {
	            console.error("Invalid response format");
	        }
	    })
	    .catch(err => console.error("User map error:", err));
		});*/

document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();

    if (!allowedActions.includes("view")) {
        blockUI();   // 🔒 permanent block
        return;
    }

   
});


const MainPage = 'VTSReport.jsp';
const UserId = sessionStorage.getItem('user_id');

let allowedActions = [];

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
            {
                method: "GET",
                credentials: "include", //  send cookies/session
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


let userMap1 = {}; 

async function loadUserMap() {
    try {
        const response = await fetch(new URL('/api/websmartuser/getAll', baseUrl1), {
            credentials: "include"
        });
        const data = await response.json();
        if (data && Array.isArray(data.Data)) {
            data.Data.forEach(u => {
                userMap1[String(u.id)] = {
                    username: u.username,
                    department: u.department
                };
            });
        }
    } catch (err) {
        console.error("Failed to load user map", err);
    }
}



function initializeSelect2() {
    if (window.jQuery && $.fn.select2) {
		$('#vehiclepassno').select2({
		       placeholder: 'Select Vehicle Type',
		       allowClear: true,
		       width: '100%',
		       minimumResultsForSearch: 0,   // ✅ KEY LINE #1: Always show search
		       minimumInputLength: 0,          // ✅ KEY LINE #2: Allow search without typing
		   });
		}
		} 
		document.addEventListener('DOMContentLoaded', fetchvehiclegatepassData);
		document.addEventListener('DOMContentLoaded', loadUserMap);
function fetchvehiclegatepassData() {
    const apiUrl = new URL('/api/invoiceexit/jims/vehiclegatepass', baseUrl1);

    fetch(apiUrl, { credentials: "include" })
    .then(response => response.json())
    .then(data => {
        const selectElement = document.getElementById('vehiclepassno');
        selectElement.innerHTML = '<option value="">Select</option>';

        data.forEach(vehicleId => {
            const option = document.createElement('option');
            option.value = vehicleId;
            option.textContent = vehicleId;
            selectElement.appendChild(option);
        });
		initializeSelect2();
    })
    .catch(error => {
        alert('Failed to load vehicle IDs.');
    });
	
}



async function fetchVehicleDetails(vehicle_id) {
	if (Object.keys(userMap1).length === 0) {
	        await loadUserMap();
	    }
    const url = new URL(`/api/invoiceexit/jims/getVehicleDetails?vehicle_id=${vehicle_id}`, baseUrl1);

    authFetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const details = data[0];

                document.getElementById("vtsrecipt").style.display = "block";
                document.getElementById("container12").style.display = "block";

                document.getElementById("lblPassNo").innerText = details.vechile_id || '';

                document.getElementById("vname").innerText = details.name || '';
                document.getElementById("lblcompanyname").innerText = details.Company_name || '';
                document.getElementById("dl").innerText = details.dl || '';
                document.getElementById("cn").innerText = details.dmbno || '';
                document.getElementById("lblDateTime").innerText = details.vdate || '';
                document.getElementById("vehNo").innerText = details.vecno || '';
                document.getElementById("rem").innerText = details.inremarks || '';
				const userInfo = userMap1[String(details.wtm)];
				document.getElementById("wtsn").innerText =
				    (userInfo ? userInfo.username : (details.wtm || ""))
				        .replace(/^\d+\s*-\s*/, '')
				        .replace(/\s*\([^)]*\)\s*$/, '')
				        .trim();

				document.getElementById("wtmSignatureName").innerText =
				    (userInfo ? userInfo.username : (details.wtm || ""))
				        .replace(/^\d+\s*-\s*/, '')
				        .replace(/\s*\([^)]*\)\s*$/, '')
				        .trim();

			   document.getElementById("deptm").innerText = userInfo
			   		      ? userInfo.department
			   		      : (details.Department_name || "");

				setVehiclePhoto(details);

            } else {
                document.getElementById("vtsrecipt").style.display = "none";
                document.getElementById("container12").style.display = "none";
            }
        })
        .catch(error => {
            console.error('Error fetching vehicle details:', error);
        });
}

function setVehiclePhoto(details) {
    const photoEl = document.getElementById("vehiclePhoto");
    if (!photoEl) return;

    // Revoke any previous blob URL before replacing it
    if (photoEl.src && photoEl.src.startsWith('blob:')) {
        URL.revokeObjectURL(photoEl.src);
    }

    if (!details.photo_filename) {
        photoEl.src = '';
        return;
    }

    const photoUrl = baseUrl1 + "/api/invoiceexit/viewImage?fileName=" + details.photo_filename;

    authFetch(photoUrl)
        .then(response => {
            if (!response.ok) throw new Error("Photo fetch failed: " + response.status);
            return response.blob();
        })
        .then(blob => {
            photoEl.src = URL.createObjectURL(blob);
        })
        .catch(error => {
            console.error("Error loading vehicle photo:", error);
            photoEl.src = '';
        });
}
function authFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.headers || {}),
      'X-Session-Id': sessionStorage.getItem('session_id') || ''
    }
  });
}

	
	$("#vehiclepassno").on('change',function(){
    const selected = this.value;
    if (selected) fetchVehicleDetails(selected);
    else {
        document.getElementById("vtsrecipt").style.display = "none";
        document.getElementById("container12").style.display = "none";
    }
});

// ------------------------------------------------------
// REGISTER & SELECT TYPES
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", loadRegisterTypes);

function loadRegisterTypes() {
    fetch(new URL("/api/invoiceexit/jims/getRegisterTypes", baseUrl1), {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        let ddl = document.getElementById("register");
        ddl.innerHTML = `<option value="">Select</option>`;
        data.forEach(item => ddl.innerHTML += `<option value="${item.id}">${item.name}</option>`);
    });
}

document.getElementById("register").addEventListener("change", function () {
    const registerType = this.value;
    const selectDiv = document.querySelector('#select').parentElement;
    const selectDropdown = document.getElementById("select");

    const resetDropdown = () => {
        selectDropdown.innerHTML = '<option value="">Select</option>';
    };

    if (registerType === "1") { // Vehicle Loading
        resetDropdown();
        selectDiv.style.display = "none";
        return;
    }

    selectDiv.style.display = "block";

    if (!registerType) {
        resetDropdown();
        return;
    }

    const url = new URL(`/api/invoiceexit/jims/getSelectType?registerType=${registerType}`, baseUrl1);

    fetch(url, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
            resetDropdown();
            data.forEach(item => {
                selectDropdown.add(new Option(item, item));
            });
        });
});



// =====================================================================
// 🔥🔥🔥 ADDED BELOW — FETCH REPORT + FILL TABLE 🔥🔥🔥
// =====================================================================

// 1️⃣ Fetch Report
// SHOW MAIN CONTAINER ONLY AFTER SELECTING END DATE
/*document.getElementById("end").addEventListener("change", function () {
    if (this.value !== "") {
        document.getElementById("container1").style.display = "block";
    }
});
*/
// ✅ Set default current date for both inputs
 document.addEventListener("DOMContentLoaded", function () {
   const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
   document.getElementById("start").value = today;
   document.getElementById("end").value = today;
 });
// FETCH REPORT FUNCTION
function fetchReport() {

    const registerType = document.getElementById("register").value;
    const selectType = document.getElementById("select").value;
    const fromDate = document.getElementById("start").value;
    const toDate = document.getElementById("end").value;

    if (!registerType || !fromDate || !toDate) {
        alert("Please fill all fields before fetching the report.");
        return;
    }

    // Mapping
    const selectTypeMap = {
        "All": "all",
        "Stores Material": "storesmaterial",
        "Raw Material": "rawmaterial",
        "Site Return": "sitereturn",
        "Vehicle Loading": "vehicleloading"
    };

    const mappedSelectType = selectTypeMap[selectType] || "all";

    const url = new URL(`/api/invoiceexit/jims/getRegisterReportIn?registerType=${registerType}&selectType=${mappedSelectType}&fromDate=${fromDate}&toDate=${toDate}`, baseUrl1);

    fetch(url, { credentials: "include" })
        .then(res => res.json())
        .then(data => {

            const tableBody = document.querySelector("#TableID tbody");
            tableBody.innerHTML = "";

            if (!data || data.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="20" class="text-center text-danger"><b>No data found</b></td>
                    </tr>`;
                document.getElementById("container_1").style.display = "block";
                return;
            }

            let sl = 1;
			//const userInfo = userMap1[String(row.wtm)
							//document.getElementById("whom").innerText = userInfo ? userInfo.username : (details.wtm || "");
            data.forEach(row => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${sl++}</td>
                        <td>${row.vechile_id || ""}</td>
                        <td>${row.regtype || ""}</td>
                        <td>${row.Vtype || ""}</td>
                        <td>${row.vecno || ""}</td>
                        <td>${row.intime || ""}</td>
                        <td>${row.Company_name || ""}</td>
                        <td>${row.dname || ""}</td>
                        <td>${row.dmbno || ""}</td>
						<td>${
						    userMap1[String(row.wtm)]
						        ? userMap1[String(row.wtm)].username
						        : ""
						}</td>

                        <td class="hide-vl">${row.weight || ""}</td>
                        <td class="hide-vl">${row.Inv_no || ""}</td>
                        <td class="hide-vl">${row.Inv_date || ""}</td>
                        <td class="hide-vl">${row.Po_number || ""}</td>
                        <td class="hide-vl">${row.Po_date || ""}</td>
                        <td class="hide-vl">${row.DC_no || ""}</td>
                        <td class="hide-vl">${row.DC_date || ""}</td>

                        <td>${row.inremarks || ""}</td>
                        <td>${row.content_desc || ""}</td>
                        <td>${row.factory_name || ""}</td>
                    </tr>`;
            });

            // ✅ NOW HIDE THE COLUMNS (AFTER TABLE IS READY)
            const hideCols = document.querySelectorAll(".hide-vl");
            if (registerType == "1") {
                hideCols.forEach(c => c.classList.add("hide"));
            } else {
                hideCols.forEach(c => c.classList.remove("hide"));
            }

            document.getElementById("container_1").style.display = "block";
        });
}

document.addEventListener("DOMContentLoaded", loadvehicleoutRegisterTypes);

function loadvehicleoutRegisterTypes() {
    fetch(new URL("/api/invoiceexit/jims/getvehicleoutRegisterTypes", baseUrl1), {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        let ddl = document.getElementById("vehicle");
        ddl.innerHTML = `<option value="">Select</option>`;
        data.forEach(item => ddl.innerHTML += `<option value="${item.id}">${item.name}</option>`);
    });
}

document.getElementById("vehicle").addEventListener("change", function () {
    const vehicleType = this.value;
    const selectDiv = document.querySelector('#type').parentElement;
    const selectDropdown = document.getElementById("type");

    const resetDropdown = () => {
        selectDropdown.innerHTML = '<option value="">Select</option>';
    };

    if (vehicleType === "1") { // Vehicle Loading
        resetDropdown();
        selectDiv.style.display = "none";
        return;
    }

    selectDiv.style.display = "block";

    if (!vehicleType) {
        resetDropdown();
        return;
    }

    const url = new URL(`/api/invoiceexit/jims/getvehicleoutSelectType?vehicleType=${vehicleType}`, baseUrl1);

    fetch(url, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
            resetDropdown();
            data.forEach(item => {
                selectDropdown.add(new Option(item, item));
            });
        });
});

document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  document.getElementById("startdate").value = today;
  document.getElementById("enddate").value = today;
});

function fetchvehiclematerialReport() {
    const vehicleType = document.getElementById("vehicle").value;
    const selectType = document.getElementById("type").value.trim().toLowerCase().replace(/\s+/g, '');
    const fromDate = document.getElementById("startdate").value;
    const toDate = document.getElementById("enddate").value;

    if (!vehicleType) {
        alert("Please select Vehicle Type.");
        return;
    }

    if (!fromDate || !toDate) {
        alert("Please select both start and end dates.");
        return;
    }

    // Hide both containers first
    document.getElementById("container3").style.display = "none"; // Material Inward
    document.getElementById("container5").style.display = "none"; // Vehicle Loading

    let url;
    let tableId;
    let containerId;

    if (vehicleType === "1") { // Vehicle Loading
        url = new URL(`/api/invoiceexit/jims/getvehicleoutRegisterReport?registerType=1&fromDate=${fromDate}&toDate=${toDate}`, baseUrl1);
        tableId = "#Table1";
        containerId = "container5";
    } else if (vehicleType === "2") { // Material Inward
        url = new URL(`/api/invoiceexit/jims/getRegisterReport?registerType=2&selectType=${selectType}&fromDate=${fromDate}&toDate=${toDate}`, baseUrl1);
        tableId = "#Table_ID";
        containerId = "container3";
    } else {
        alert("Invalid Vehicle Type selected.");
        return;
    }

    fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector(`${tableId} tbody`);
            tbody.innerHTML = "";

            if (!data || data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="20" class="text-center text-danger"><b>No data found</b></td></tr>`;
                document.getElementById(containerId).style.display = "block";
                return;
            }

            let sl = 1;

            data.forEach(row => {
                const tr = document.createElement("tr");

                if (vehicleType === "1") {
                    tr.innerHTML = `
                        <td>${sl++}</td>
                        <td>${row.vechile_id ?? ""}</td>
                        <td>${row.Vtype ?? ""}</td>
                        <td>${row.vecno ?? ""}</td>
                        <td>${row.intime ?? ""}</td>
                        <td>${row.outtime ?? ""}</td>
						<td>${row.duration ?? ""}</td>
                        <td>${row.Company_name ?? ""}</td>
                        <td>${row.dname ?? ""}</td>
                        <td>${row.dmbno ?? ""}</td>
						<td>${
											    userMap1[String(row.wtm)]
											        ? userMap1[String(row.wtm)].username
											        : ""
											}</td>
						                    
                        <td>${row.outremarks ?? ""}</td>
                        <td>${row.invoice_no ?? ""}</td>
                        <td>${row.factory_name ?? ""}</td>
                    `;
                } else if (vehicleType === "2") {
                    tr.innerHTML = `
                        <td>${sl++}</td>
                        <td>${row.vechile_id ?? ""}</td>
                        <td>${row.regtype ?? ""}</td>
                        <td>${row.Vtype ?? ""}</td>
                        <td>${row.vecno ?? ""}</td>
                        <td>${row.intime ?? ""}</td>
						<td>${row.outtime ?? ""}</td>
						<td>${row.duration ?? ""}</td>
                        <td>${row.Company_name ?? ""}</td>
                        <td>${row.dname ?? ""}</td>
                        <td>${row.dmbno ?? ""}</td>
						
						<td>${
						    userMap1[String(row.wtm)]
						        ? userMap1[String(row.wtm)].username
						        : ""
						}</td>
                        
                        <td>${row.weight ?? ""}</td>
                        <td>${row.Inv_no ?? ""}</td>
                        <td>${row.Inv_date ?? ""}</td>
                        <td>${row.Po_number ?? ""}</td>
                        <td>${row.Po_date ?? ""}</td>
                        <td>${row.DC_no ?? ""}</td>
                        <td>${row.DC_date ?? ""}</td>
                        <td>${row.inremarks ?? ""}</td>
                        <td>${row.content_desc ?? ""}</td>
                        <td>${row.factory_name ?? ""}</td>
                    `;
                }

                tbody.appendChild(tr);
            });

            document.getElementById(containerId).style.display = "block";
        })
        .catch(error => {
            console.error("Error fetching report:", error);
            alert("Failed to fetch report.");
        });
}

document.getElementById("register").addEventListener("change", function() {
    // Hide report container
    const container = document.getElementById("container_1");
    container.style.display = "none";

    // Clear table body
    const tbody = document.querySelector("#TableID tbody");
    if (tbody) {
        tbody.innerHTML = "";
    }
});

document.getElementById("vehicle").addEventListener("change", function() {
    // Hide report container
    const container = document.getElementById("container3");
    container.style.display = "none";

    // Clear table body
    const tbody = document.querySelector("#Table_ID tbody");
    if (tbody) {
        tbody.innerHTML = "";
    }
});





function blockUI() {

    const container = document.getElementById("container-wrapper");

    if (!container) return;

    // Disable interaction only inside main content
    container.style.pointerEvents = "none";
    container.style.userSelect = "none";
    container.style.opacity = "0.5";
    container.style.position = "relative";

    // Create overlay dynamically
    const overlay = document.createElement("div");
    overlay.id = "contentBlockOverlay";

    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.zIndex = "999";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.color = "white";
    overlay.style.fontSize = "22px";
    overlay.style.textAlign = "center";

    overlay.innerHTML = `
        <div>
            🚫 Access Denied <br>
            <small>You don’t have permission to view this page</small>
        </div>
    `;

    container.appendChild(overlay);
}








