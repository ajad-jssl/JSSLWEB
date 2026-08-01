document.addEventListener('DOMContentLoaded', fetchvisitorgatepassData);

// ✅ userMap — unchanged
let userMap = {};
document.addEventListener("DOMContentLoaded", function () {
  fetch(new URL('/api/websmartuser/getAll', baseUrl1), { credentials: "include" })
    .then(res => res.json())
    .then(response => {
      console.log("User API Response:", response);
      if (response && Array.isArray(response.Data)) {
        response.Data.forEach(u => {
          userMap[String(u.id)] = u.username;
        });
      } else {
        console.error("Invalid response format");
      }
    })
    .catch(err => console.error("User map error:", err));
});

// ✅ Actions / blockUI — unchanged
document.addEventListener("DOMContentLoaded", async function () {
  await loadActions();
  if (!allowedActions.includes("view")) {
    blockUI();
    return;
  }
});

const MainPage = 'VMSReport.jsp';
const UserId = sessionStorage.getItem('username');
let allowedActions = [];

async function loadActions() {
  try {
    const response = await fetch(
      `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
      { method: "GET", credentials: "include", headers: { "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to fetch actions");
    allowedActions = await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

// ✅ departmentMap — unchanged
let departmentMap = {};
document.addEventListener("DOMContentLoaded", function () {
  fetch(new URL('/api/websmartuser/getAllDepartment', baseUrl1), { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        data.forEach(dept => {
          departmentMap[dept.dept_id] = dept.department_name;
        });
        console.log("Departments loaded:", departmentMap);
      }
    })
    .catch(err => console.error("Failed to load departments", err));
});

// ✅ fetchvisitorgatepassData — unchanged
function fetchvisitorgatepassData() {
  let selectedFactoryId = localStorage.getItem("selectedFactoryId");
  const apiUrl = new URL(`/api/visitor/jims/visitorgatepass?factoryId=${selectedFactoryId}`, baseUrl1);

  fetch(apiUrl, { credentials: "include" })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      console.log('Fetched data:', data);
      const selectElement = document.getElementById('pass');
      if (!selectElement) {
        console.error('Select element with id "pass" not found.');
        return;
      }

      selectElement.innerHTML = '<option value="">Select Pass</option>';
      data.forEach(visitorId => {
        const option = document.createElement('option');
        option.value = visitorId;
        option.textContent = visitorId;
        selectElement.appendChild(option);
      });

      if ($('#pass').hasClass("select2-hidden-accessible")) {
        $('#pass').select2('destroy');
      }
      $('#pass').select2({ placeholder: "Search pass...", allowClear: true, width: "100%" });
    })
    .catch(error => {
      console.error('Error fetching visitor data:', error);
      alert('Failed to load Visitor IDs. Please try again later.');
    });
}

// ✅ fetchVisitorDetails — FIXED with forced DOM update and proper element checking
function fetchVisitorDetails(visitor_id) {
  const url = new URL(`api/visitor/jims/getVisitorDetails?visitor_id=${visitor_id}`, baseUrl1);

  fetch(url, { credentials: "include" })
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const details = data[0];
        console.log("Visitor Details:", details);

        // Ensure containers exist and are visible
        const container12 = document.getElementById("container12");
        const vmsrecipt = document.getElementById("vmsrecipt");
        
        if (container12) container12.style.display = "block";
        if (vmsrecipt) vmsrecipt.style.display = "block";

        // ✅ Safe setter with forced text update and fallback
        function setText(id, value) {
          const el = document.getElementById(id);
          if (el) {
            el.innerText = value || '';
            el.textContent = value || ''; // Fallback
            console.log(`✅ Set ${id} = ${value}`);
          } else {
            console.warn(`⚠️ Element not found: ${id}`);
          }
        }

        // ✅ Populate all text fields with defensive checks
        setText("visitorPassNo",     details.Visitor_id || '');
        setText("lblChar",           details.Visitor_id || '');
        setText("visitorName",       details.visitor_name || '');
        setText("visitorCompany",    details.Company_name || '');
        setText("visitorContactNo",  details.Contact_no || '');
        setText("visitorDateTime",   details.Created_date || '');
       /* setText("whomToMeet",        userMap[details.wtm] || details.wtm || '');
		setText("wtmSignatureName", (userMap[details.wtm] || details.wtm || '') + ' (Signature)');*/
		/* setText("whomToMeet",        userMap[ details.wtm] || details.wtm || '');*/
					setText(
					    "whomToMeet",
					    (userMap[details.wtm] || details.wtm || '')
					        .replace(/^\d+\s*-\s*/, '')  
					        .replace(/\s*\([^)]*\)\s*$/, '') 
					        .trim()
					);
			/*		setText("wtmSignatureName", (userMap[details.wtm] || details.wtm || '') + ' (Signature)');*/
			setText(
			    "wtmSignatureName",
			    (userMap[details.wtm] || details.wtm || '')
			        .replace(/^[^-]+-\s*/, '')
			        .replace(/\s*\([^)]*\)\s*$/, '')
			        .trim() + ' (Signature)'
			); 
        setText("visitorDepartment", departmentMap[details.department] || details.department || '');
        setText("vehicleNO",         details.vehicle_No || '');

        // Photo
        const photoEl = document.getElementById("visitorPhoto");
        if (photoEl) {
          photoEl.src = details.photo_filename
            ? baseUrl1 + "/api/visitor/viewImage?fileName=" + details.photo_filename
            : '';
          console.log("✅ Photo set:", photoEl.src);
        } else {
          console.warn("⚠️ Photo element not found");
        }

      } else {
        console.error('No data found for Visitor ID:', visitor_id);
        const vmsrecipt = document.getElementById("vmsrecipt");
        const container12 = document.getElementById("container12");
        if (vmsrecipt) vmsrecipt.style.display = "none";
        if (container12) container12.style.display = "none";
      }
    })
    .catch(error => {
      console.error('Error fetching visitor details:', error);
      const vmsrecipt = document.getElementById("vmsrecipt");
      const container12 = document.getElementById("container12");
      if (vmsrecipt) vmsrecipt.style.display = "none";
      if (container12) container12.style.display = "none";
    });
}

// ✅ Gate pass dropdown change — FIXED to ensure data loads after tab switch
$('#pass').on('change', function () {
  const selectedGpNo = $(this).val();
  console.log("Pass selected:", selectedGpNo);
  
  if (selectedGpNo && selectedGpNo.trim() !== '') {
    // Small delay to ensure DOM is ready after toggleTables cleared it
    setTimeout(() => {
      fetchVisitorDetails(selectedGpNo);
    }, 100);
  } else {
    const vmsrecipt = document.getElementById("vmsrecipt");
    const container12 = document.getElementById("container12");
    if (vmsrecipt) vmsrecipt.style.display = "none";
    if (container12) container12.style.display = "none";
  }
});

// ✅ Set default dates — unchanged
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split('T')[0];
  const fromDate = document.getElementById("fromDate");
  const toDate   = document.getElementById("toDate");
  if (fromDate) fromDate.value = today;
  if (toDate)   toDate.value   = today;
});

// ✅ fetchVisitorDetailsByDate — unchanged
function fetchVisitorDetailsByDate() {
  const fromDate = document.getElementById("fromDate").value;
  const toDate   = document.getElementById("toDate").value;

  if (!fromDate || !toDate) {
    alert("Please select both Start Date and End Date.");
    return;
  }

  fetch(
    new URL(`/api/visitor/jims/getVisitorDetailsByDate?fromDate=${fromDate}&toDate=${toDate}`, baseUrl1),
    { credentials: "include" }
  )
    .then(res => res.json())
    .then(data => {
      const container8 = document.getElementById("container8");
      const tbody = document.getElementById("visitorrep");

      if (container8) container8.style.display = "block";
      if (tbody) tbody.innerHTML = "";

      const totalColumns = 15;
      if (!data || data.length === 0) {
        if (tbody) {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td colspan="${totalColumns}" style="text-align:center; color:#888; font-style:italic;">
            No records found for the selected date range.
          </td>`;
          tbody.appendChild(tr);
        }
        return;
      }

      data.forEach((row, index) => {
        if (tbody) {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.Visitor_id || ""}</td>
            <td>${row.visitor_name || ""}</td>
            <td>${row.Company_name || ""}</td>
            <td>${row.Address || ""}</td>
            <td>${row.Vecno || ""}</td>
            <td>${row.Contact_no || ""}</td>
            <td>${row.VisitorDate_InTime || ""}</td>
            <td>${row.VisitorDate_OutTime || ""}</td>
            <td>${userMap[row.wtm] || ""}</td>
            <td>${departmentMap[row.department] || ""}</td>
            <td>${row.Remarks || ""}</td>
            <td>${row.outremarks || ""}</td>
            <td>${row.factory_name || ""}</td>
          `;
          tbody.appendChild(tr);
        }
      });
    })
    .catch(err => {
      console.error("Error fetching data:", err);
      alert("Failed to load data. Please try again later.");
    });
}

// ✅ Type dropdown handlers — unchanged
$('#type').on('change', function () {
  var selectedType = $(this).val();
  if (selectedType === 'company') {
    fetch(new URL('/api/visitor/jims/companies', baseUrl1), { method: 'GET', credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        var asDropdown = $('#as');
        asDropdown.empty();
        asDropdown.append('<option value="">Select</option>');
        data.forEach(function (company) {
          asDropdown.append('<option value="' + company + '">' + company + '</option>');
        });
        $('#as').select2({ placeholder: "Select Company", allowClear: true, width: '100%' });
        $('#as').val(null).trigger('change');
      })
      .catch(error => console.error("Error fetching company names:", error));
  } else if (selectedType === 'department') {
    fetchDepartmentNames();
  }
});

function fetchCompanyNames() {
  fetch(new URL('/api/visitor/jims/companies', baseUrl1), { method: 'GET', credentials: 'include' })
    .then(response => response.json())
    .then(data => {
      const asDropdown = document.getElementById('as');
      if (asDropdown) {
        asDropdown.innerHTML = '<option value="">Select</option>';
        data.forEach(company => {
          const option = document.createElement('option');
          option.value = company.id;
          option.textContent = company.name;
          asDropdown.appendChild(option);
        });
      }
    })
    .catch(error => console.error("Error fetching company names:", error));
}

function fetchDepartmentNames() {
  fetch(new URL('/api/websmartuser/getAllDepartment', baseUrl1), { method: 'GET', credentials: 'include' })
    .then(response => response.json())
    .then(data => {
      const asDropdown = document.getElementById('as');
      if (asDropdown) {
        asDropdown.innerHTML = '<option></option>';
        data.forEach(department => {
          const option = document.createElement('option');
          option.value = department.dept_id;
          option.textContent = department.department_name;
          asDropdown.appendChild(option);
        });
        $('#as').select2({ placeholder: "Select department", allowClear: true, width: '100%' });
        $('#as').val(null).trigger('change');
      }
    })
    .catch(error => console.error("Error fetching department names:", error));
}

// ✅ fetchVisitorDataByFilter — unchanged
function fetchVisitorDataByFilter() {
  const type = document.getElementById('type').value;
  const selectedValue = document.getElementById('as').value;
  const apiUrl = new URL('/api/visitor/jims/getVisitorDetailsByFilter', baseUrl1);

  if (type === 'company' && selectedValue) apiUrl.searchParams.append('company', selectedValue);
  else if (type === 'department' && selectedValue) apiUrl.searchParams.append('department', selectedValue);

  fetch(apiUrl, { credentials: 'include' })
    .then(response => response.json())
    .then(data => { populateVisitorTable(data); })
    .catch(error => {
      console.error('Error fetching visitor data:', error);
      alert('Failed to load visitor data. Please try again later.');
    });
}

// ✅ populateVisitorTable — unchanged
function populateVisitorTable(data) {
  const tbody = document.getElementById('visitorTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  const totalColumns = 11;

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${totalColumns}" class="text-center text-muted">
      No records found for the selected ${document.getElementById('type').value}.
    </td></tr>`;
    return;
  }

  data.forEach((visitor, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${visitor.Visitor_id || ''}</td>
      <td>${visitor.visitor_name || ''}</td>
      <td>${visitor.Company_name || ''}</td>
      <td>${visitor.Address || ''}</td>
      <td>${visitor.VisitorDate_InTime || ''}</td>
      <td>${visitor.VisitorDate_OutTime || ''}</td>
      <td>${userMap[visitor.wtm] || ''}</td>
      <td>${departmentMap[visitor.department] || ''}</td>
      <td>${visitor.factory_name || ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ✅ Type/As dropdown DOMContentLoaded handler — unchanged
document.addEventListener('DOMContentLoaded', function () {
  const typeSelect = document.getElementById('type');
  const asSelect = $('#as');

  function resetAsDropdown() {
    if (asSelect.hasClass("select2-hidden-accessible")) asSelect.select2('destroy');
    asSelect.html('<option></option>');
    asSelect.select2({ placeholder: "Select", allowClear: true, width: '100%' });
    asSelect.val(null).trigger('change');
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', function () {
      const selectedType = this.value;
      resetAsDropdown();
      if (selectedType === 'company') fetchCompanyNames();
      else if (selectedType === 'department') fetchDepartmentNames();
      fetchVisitorDataByFilter();
    });
  }

  asSelect.on('change', function () { fetchVisitorDataByFilter(); });

  resetAsDropdown();
  const type = typeSelect ? typeSelect.value : '';
  if (type === 'company') fetchCompanyNames();
  else if (type === 'department') fetchDepartmentNames();
  fetchVisitorDataByFilter();
});

// ✅ blockUI — unchanged
function blockUI() {
  const container = document.getElementById("container-wrapper");
  if (!container) return;

  container.style.pointerEvents = "none";
  container.style.userSelect = "none";
  container.style.opacity = "0.5";
  container.style.position = "relative";

  const overlay = document.createElement("div");
  overlay.id = "contentBlockOverlay";
  overlay.style.cssText = `
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.6); z-index: 999;
    display: flex; justify-content: center;
    align-items: center; color: white;
    font-size: 22px; text-align: center;
  `;
  overlay.innerHTML = `
    <div>
      🚫 Access Denied <br>
      <small>You don't have permission to view this page</small>
    </div>
  `;
  container.appendChild(overlay);
}