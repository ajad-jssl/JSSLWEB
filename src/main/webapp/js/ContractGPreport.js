document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();
	fetchDeptList();

    if (!allowedActions.includes("view")) {
        blockUI();   // 🔒 permanent block
        return;
    }

  
});


const MainPage =  window.location.pathname.split("/").pop()+'.jsp';
const UserId = sessionStorage.getItem('user_id');

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

function fetchCompanyNames() {
    fetch(new URL('/api/visitor/jims/companies', baseUrl1), {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        const asDropdown = document.getElementById('company');
        asDropdown.innerHTML = '<option value="">Select</option><option value="ALL">All</option>';

        data.forEach(company => {
            const option = document.createElement('option');
            option.value = company.id;
            option.textContent = company.name;
            asDropdown.appendChild(option);
        });
    })
    .catch(error => console.error("Error fetching company names:", error));
}

function fetchempid() {
    fetch(new URL('/api/contractgatepass/jims/userslist', baseUrl1), {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        const asDropdown = document.getElementById('empid');
        asDropdown.innerHTML = '<option value="">Select</option><option value="ALL">All</option>';

        data.forEach(empid => {
            const option = document.createElement('option');
            option.value = empid;
            option.textContent = empid;
            asDropdown.appendChild(option);
        });
    })
    .catch(error => console.error("Error fetching users:", error));
}

// ✅ Set default current date for both inputs
 document.addEventListener("DOMContentLoaded", function () {
   const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
   document.getElementById("start").value = today;
   document.getElementById("end").value = today;
 });
 
/*async function fetchcontractgpByDate() {
    let fromDate = document.getElementById("start").value;
    let toDate = document.getElementById("end").value;
    let company = document.getElementById("company").value;
    let employeeId = document.getElementById("empid").value;

    if (!fromDate || !toDate) {
        alert("Please select Start Date & End Date");
        return;
    }

    try {
        const params = new URLSearchParams({
            fromDate,
            toDate,
            company,
            employeeId
        });

        const url = new URL("/api/contractgatepass/contractgp/filter", baseUrl1);
        url.search = params.toString();

        console.log("Calling →", url.toString());

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            alert("Error fetching report!");
            return;
        }

        const data = await response.json();
        let tbody = document.querySelector("#Table1 tbody");
        tbody.innerHTML = "";

        if (data.length === 0) {
            alert("No data found!");
            return;
        }

        document.getElementById("container1").style.display = "block";

        let sl = 1;
        data.forEach(row => {
            let tr = `
                <tr>
                    <td>${sl++}</td>
                    <td>${row.Pass_id ?? ""}</td>
                    <td>${row.Emp_id ?? ""}</td>
                    <td>${row.cg_id ?? ""}</td>
                    <td>${row.name ?? ""}</td>
                   
                    <td>${row.gender ?? ""}</td>
                    <td>${row.Aadhar_no ?? ""}</td>
                    <td>${row.pass_issued_dt ?? ""}</td>
                    <td>${row.Dob ?? ""}</td>
                    <td>${row.Doj ?? ""}</td>
                    <td>${row.valid_till ?? ""}</td>
                    <td>${row.deptname ?? ""}</td>
                    <td>${row.designation ?? ""}</td>
                    <td>${row.Company_name ?? ""}</td>
                    <td>${row.blg ?? ""}</td>
                    <td>${row.Nojdesc ?? ""}</td>
                  
                    <td>${row.Bus_desc ?? ""}</td>
                    <td>${row.wldesc ?? ""}</td>
                   
                    <td>${row.active ?? ""}</td>
                    <td>
                        <button type="button" class="btn btn-link p-0"
                            onclick="downloadFile('${row.filename}')">
                            Download
                        </button>
                    </td>
					<td>
					    ${row.photo_path
					        ? `<button type="button"
					                   class="btn btn-sm btn-info p-1"
					                   onclick="showPhoto('${row.photo_filename}')">
					               <i class="fa fa-image"></i> View
					           </button>`
					        : '<span class="text-muted" style="font-size:12px;">No Photo</span>'
					    }
					</td>
                    <td>${row.factory_name ?? ""}</td>
                </tr>
				
            `;
            tbody.insertAdjacentHTML("beforeend", tr);
        });

    } catch (error) {
        console.error("Fetch error:", error);
        alert("Error fetching report!");
    }
}*/



async function fetchcontractgpByDate() {
    let fromDate = document.getElementById("start").value;
    let toDate = document.getElementById("end").value;
    let company = document.getElementById("company").value;
    let employeeId = document.getElementById("empid").value;

    if (!fromDate || !toDate) {
        alert("Please select Start Date & End Date");
        return;
    }

    try {
        const params = new URLSearchParams({
            fromDate,
            toDate
        });

        // Only send company/employeeId if a specific one is picked (not blank, not "ALL")
        if (company && company !== "ALL") {
            params.append("company", company);
        }
        if (employeeId && employeeId !== "ALL") {
            params.append("employeeId", employeeId);
        }

        const url = new URL("/api/contractgatepass/contractgp/filter", baseUrl1);
        url.search = params.toString();

        console.log("Calling →", url.toString());

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            alert("Error fetching report!");
            return;
        }

        const data = await response.json();
        let tbody = document.querySelector("#Table1 tbody");
        tbody.innerHTML = "";

        if (data.length === 0) {
            alert("No data found!");
            return;
        }

        document.getElementById("container1").style.display = "block";

        let sl = 1;
        data.forEach(row => {
            let tr = `
                <tr>
                    <td>${sl++}</td>
                    <td>${row.Pass_id ?? ""}</td>
                    <td>${row.Emp_id ?? ""}</td>
  
                    <td>${row.name ?? ""}</td>
                    <td>${row.gender ?? ""}</td>
                    <td>${row.Aadhar_no ?? ""}</td>
                    <td>${row.pass_issued_dt ?? ""}</td>
                    <td>${row.Dob ?? ""}</td>
                    <td>${row.Doj ?? ""}</td>
                    <td>${row.valid_till ?? ""}</td>
                  <td>${deptLookup[row.deptname] ?? row.deptname ?? ""}</td>
                    <td>${row.designation ?? ""}</td>
                    <td>${row.Company_name ?? ""}</td>
                    <td>${row.blg ?? ""}</td>
                    <td>${row.Nojdesc ?? ""}</td>
                    <td>${row.Bus_desc ?? ""}</td>
                    <td>${row.wldesc ?? ""}</td>
                    <td>${row.active ?? ""}</td>
                    <td>
                        <button type="button" class="btn btn-link p-0"
                            onclick="downloadFile('${row.filename}')">
                            Download
                        </button>
                    </td>
                    <td>
                        ${row.photo_path
                            ? `<button type="button"
                                       class="btn btn-sm btn-info p-1"
                                       onclick="showPhoto('${row.photo_filename}')">
                                   <i class="fa fa-image"></i> View
                               </button>`
                            : '<span class="text-muted" style="font-size:12px;">No Photo</span>'
                        }
                    </td>
                    <td>${row.factory_name ?? ""}</td>
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", tr);
        });

    } catch (error) {
        console.error("Fetch error:", error);
        alert("Error fetching report!");
    }
}


/*function showImage(photoPath) {

    const fileName = photoPath.split('\\').pop(); // extract file name

    const imageUrl = `${baseUrl1}/uploads/${fileName}`;

    $("#imagePreview").attr("src", imageUrl);
    $("#imageModal").modal("show");
}*/



function showPhoto(fileName) {

    console.log("fileName received:", fileName);

    if (!fileName || fileName === 'null' || fileName.trim() === '') {
        alert("No photo available for this record");
        return;
    }

    const cleanFileName = fileName.trim();

    // ✅ Build image URL
    const imageUrl = new URL(
        `/api/contractgatepass/viewImage?fileName=${encodeURIComponent(cleanFileName)}`,
        baseUrl1
    ).toString();

    console.log("Image URL:", imageUrl);

    // ✅ Remove existing modal
    const existingModal = document.getElementById('photoModal');
    if (existingModal) {
        $('#photoModal').modal('hide');
        existingModal.remove();
    }

    // ✅ Create modal with image — src set AFTER modal is shown
    const modal = `
        <div class="modal fade" id="photoModal"
             tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered"
                 role="document">
                <div class="modal-content">
                    <div class="modal-header"
                         style="padding:10px 15px;">
                        <h6 class="modal-title mb-0">
                            <i class="fa fa-image mr-2"></i>
                            Employee Photo
                        </h6>
                        <button type="button"
                                class="close"
                                data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body text-center p-3"
                         style="min-height:200px;">

                        <!-- Loading spinner -->
                        <div id="photoSpinner" class="my-3">
                            <div class="spinner-border text-primary"
                                 role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <p class="text-muted mt-2" style="font-size:13px;">
                                Loading photo...
                            </p>
                        </div>

                        <!-- Image — src set after modal shown -->
                        <img id="photoModalImg"
                             src=""
                             alt="Employee Photo"
                             style="max-width:100%;
                                    max-height:450px;
                                    border-radius:5px;
                                    border:1px solid #ddd;
                                    display:none;">

                        <!-- Error message -->
                        <div id="photoErrorMsg"
                             class="text-danger mt-2"
                             style="display:none;">
                            <i class="fa fa-exclamation-circle"></i>
                            Photo could not be loaded.
                            <br>
                            <small class="text-muted">${cleanFileName}</small>
                        </div>
                    </div>
                    <div class="modal-footer"
                         style="padding:8px 15px;">
                        <a id="photoFullSizeLink"
                           href="${imageUrl}"
                           target="_blank"
                           class="btn btn-sm btn-info">
                            <i class="fa fa-external-link-alt"></i>
                            Open Full Size
                        </a>
                        <button type="button"
                                class="btn btn-sm btn-secondary"
                                data-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modal);

    // ✅ Show modal first, THEN load image
    $('#photoModal').modal('show');

    // ✅ Set image src AFTER modal is fully shown
    // This is the key fix — image loads after modal is visible
    $('#photoModal').on('shown.bs.modal', function () {

        const img = document.getElementById('photoModalImg');
        const spinner = document.getElementById('photoSpinner');
        const errorMsg = document.getElementById('photoErrorMsg');

        // ✅ Image loaded successfully
        img.onload = function () {
            spinner.style.display = 'none';
            img.style.display     = 'block';
            errorMsg.style.display = 'none';
        };

        // ✅ Image failed to load
        img.onerror = function () {
            spinner.style.display  = 'none';
            img.style.display      = 'none';
            errorMsg.style.display = 'block';
            console.error("Image failed to load:", imageUrl);
        };

        // ✅ Set src here — triggers actual load
        img.src = imageUrl;
    });

    // ✅ Clean up modal after close
    $('#photoModal').on('hidden.bs.modal', function () {
        const modal = document.getElementById('photoModal');
        if (modal) modal.remove();
    });
}
function downloadFile(filename) {
    if (!filename) {
        alert("Filename not found!");
        return;
    }

    const url = new URL("/api/contractgatepass/downloadfile", baseUrl1);
    url.searchParams.append("filename", filename);

    // Open directly — NO blob
    window.open(url.toString(), "_blank");
}

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


function toggleHistoryFilterFields() {
    var filterType = document.getElementById("historyFilterType").value;
    var aadharWrapper = document.getElementById("historyAadharWrapper");
    var empIdWrapper = document.getElementById("historyEmpIdWrapper");

    if (filterType === "aadhar") {
        aadharWrapper.style.display = "block";
        empIdWrapper.style.display = "none";
        document.getElementById("historyEmpId").value = "";
        if (!aadharWrapper.dataset.loaded) {
            fetchHistoryAadharOptions();
            aadharWrapper.dataset.loaded = "true";
        }
    } else if (filterType === "empid") {
        empIdWrapper.style.display = "block";
        aadharWrapper.style.display = "none";
        document.getElementById("historyAadhar").value = "";
        if (!empIdWrapper.dataset.loaded) {
            fetchHistoryEmpIdOptions();
            empIdWrapper.dataset.loaded = "true";
        }
    } else {
        aadharWrapper.style.display = "none";
        empIdWrapper.style.display = "none";
    }
}

// Populate Aadhar dropdown -- point this to your actual endpoint
function fetchHistoryAadharOptions() {
    $.ajax({
        url: baseUrl + "/api/contractgatepass/aadhar-list",
        type: "GET",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            var select = document.getElementById("historyAadhar");
            data.forEach(function(aadhar) {
                var opt = document.createElement("option");
                opt.value = aadhar;
                opt.text = aadhar;
                select.appendChild(opt);
            });
        },
        error: function(xhr) {
            console.error("Error loading Aadhar list", xhr);
        }
    });
}

function fetchHistoryEmpIdOptions() {
    $.ajax({
        url: baseUrl + "/api/contractgatepass/empid-list",
        type: "GET",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            var select = document.getElementById("historyEmpId");
            data.forEach(function(empId) {
                var opt = document.createElement("option");
                opt.value = empId;
                opt.text = empId;
                select.appendChild(opt);
            });
        },
        error: function(xhr) {
            console.error("Error loading Emp ID list", xhr);
        }
    });
}

function fetchHistoryReport() {
    var filterType = document.getElementById("historyFilterType").value;
    var aadhar = document.getElementById("historyAadhar").value;
    var empId = document.getElementById("historyEmpId").value;
    var fromDate = document.getElementById("historyFromDate").value;
    var toDate = document.getElementById("historyToDate").value;

    if (!filterType) {
        alert("Please select a filter type (Aadhar No or Employee ID).");
        return;
    }
    if (filterType === "aadhar" && !aadhar) {
        alert("Please select an Aadhar No or 'All'.");
        return;
    }
    if (filterType === "empid" && !empId) {
        alert("Please select an Employee ID or 'All'.");
        return;
    }
    if (!fromDate || !toDate) {
        alert("From Date and To Date are mandatory.");
        return;
    }
    if (new Date(toDate) < new Date(fromDate)) {
        alert("To Date must be greater than or equal to From Date.");
        return;
    }

    var requestData = {
        fromDate: fromDate,
        toDate: toDate
    };

    // Only send the filter value if it's not "ALL" (ALL = no filter on that field)
    if (filterType === "aadhar" && aadhar !== "ALL") {
        requestData.aadharNo = aadhar;
    }
    if (filterType === "empid" && empId !== "ALL") {
        requestData.empId = empId;
    }

    $.ajax({
        url: baseUrl + "/api/contractgatepass/history-report",
        type: "GET",
        data: requestData,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(response) {
            var tbody = document.getElementById("historyTableBody");
            tbody.innerHTML = "";

            if (!response || response.length === 0) {
                tbody.innerHTML = '<tr><td colspan="21">No records found.</td></tr>';
                document.getElementById("container6").style.display = "block";
                return;
            }
			
			
			
			
		
            response.forEach(function(row, index) {
                var tr = document.createElement("tr");
				
				
				
				
                tr.innerHTML =
                    "<td>" + (index + 1) + "</td>" +
                    "<td>" + (row.passId ?? "") + "</td>" +
                    "<td>" + (row.aadharNo ?? "") + "</td>" +
                    "<td>" + (row.empId ?? "") + "</td>" +
                    "<td>" + (row.fname ?? "") + "</td>" +
                    "<td>" + (row.lname ?? "") + "</td>" +
                    "<td>" + (row.passIssuedDt ?? "") + "</td>" +
                    "<td>" + (row.dob ?? "") + "</td>" +
                    "<td>" + (row.doj ?? "") + "</td>" +
                    "<td>" + (row.validTill ?? "") + "</td>" +
                    "<td>" + (deptLookup[row.did] ?? row.did ?? "") + "</td>" +
                    "<td>" + (row.deg ?? "") + "</td>" +
                    "<td>" + (row.nojdesc ?? "") + "</td>" +
                    "<td>" + (row.contactno ?? "") + "</td>" +
                    "<td>" + (row.permntAdd ?? "") + "</td>" +
                    "<td>" + (row.presentAdd ?? "") + "</td>" +
                    "<td>" + (row.factoryName ?? "") + "</td>" +
                  "<td>" + mapActiveStatus(row.active) + "</td>" +
                    "<td>" + (row.statusDescription ?? "") + "</td>" +
                    "<td>" + (row.rejoinDate ?? "") + "</td>" +
                    "<td>" + (row.performedBy ?? "") + "</td>" +
                    "<td>" + (convertUtcToIst(row.transactionDate) ?? "") + "</td>";
                tbody.appendChild(tr);
            });

            document.getElementById("container6").style.display = "block";
        },
        error: function(xhr) {
            console.error(xhr);
            alert("Error fetching history report.");
        }
    });
}

function exportHistoryToExcel() {
  var table = document.getElementById("Table2");
  var workbook = XLSX.utils.table_to_book(table, {sheet: "Gatepass History Report"});
  XLSX.writeFile(workbook, 'Gatepass_History_Report.xlsx');
}


function convertUtcToIst(utcDateTime) {
    if (!utcDateTime) return "";

    return new Date(utcDateTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
}


function mapActiveStatus(active) {
    if (active === 0 || active === "0") {
        return "Active";
    }
    if (active === 1 || active === "1") {
        return "Inactive";
    }
    return ""; // handles null/undefined/unexpected values
}

var deptLookup = {};

function fetchDeptList() {
    return $.ajax({
        url: baseUrl + "/api/contractgatepass/jims/deptlist",
        type: "GET",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            deptLookup = {}; // reset
            data.forEach(function(dept) {
                deptLookup[dept.id] = dept.name;
            });
        },
        error: function(xhr) {
            console.error("Error loading Department list", xhr);
        }
    });
}