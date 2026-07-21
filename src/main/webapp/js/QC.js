const MainPage =  "QCMaster.jsp";
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

document.getElementById("qcfab").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	$('#exampleModalScrollableIN').modal('show');
})

document.getElementById("welid").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableCon').modal('hide');
	  return;
	}
	$('#exampleModalScrollableCon').modal('show');
})

document.getElementById("revid").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableConrev').modal('hide');
	  return;
	}
	$('#exampleModalScrollableConrev').modal('show');
})

document.getElementById("posid").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableposition').modal('hide');
	  return;
	}
	$('#exampleModalScrollableposition').modal('show');
})

document.getElementById("proid").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableprocess').modal('hide');
	  return;
	}
	$('#exampleModalScrollableprocess').modal('show');
})

// ✅ GLOBAL variable (VERY IMPORTANT)
// already present
let weldMasterData = [];
let selectedFabRecord = null; // for update
let pendingFabPayload = null;
// 🔹 Usage map → weld_id → true/false
let weldUsageMap = {};

document.addEventListener("DOMContentLoaded", function () {
	loadActions();
    fetchWeldUsageStatus();
});

async function fetchWeldUsageStatus() {
    try {
        const res = await fetch(
            new URL('/api/qc/weld/usage-status', baseUrl1),
            { method: "GET", credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch usage status");

        const data = await res.json();

        // weld_id → isUsed
        data.forEach(r => {
            weldUsageMap[r.weld_id] = r.isUsed === 1;
        });

    } catch (err) {
        console.error("Usage status error:", err);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetchQcFabricators();
}); 

async function fetchQcFabricators() {

    const apiUrl = new URL('/api/qc/weld/fetch', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch QC Weld data");

        const weldData = await response.json();

        // ✅ STORE GLOBALLY (EXISTING)
        weldMasterData = weldData;

        // ✅ populate dropdown (EXISTING)
        populateFabricatorDropdownFromTable(weldData);

        // ✅ unique fabricators for table (EXISTING)
        const uniqueFabricators = [
            ...new Set(weldData.map(d => d.fabricator_ID).filter(Boolean))
        ];

        let tableRows = '';

        uniqueFabricators.forEach((fab, index) => {

            // 🔹 find matching master row (SAFE)
            const record = weldData.find(d => d.fabricator_ID === fab);

            // 🔹 check usage (SAFE fallback)
            const isUsed = record && weldUsageMap
                ? weldUsageMap[record.weld_id] === true
                : false;

            // 🔹 decide icon (NEW – NON-BREAKING)
			const actionIcon = isUsed
			    ? `<i class="fa fa-pen"
			          style="cursor:not-allowed; opacity:0.35;"
			          title="Used in transaction"></i>`
			    : `<i class="fa fa-pen text-muted"
			          style="cursor:pointer;"
			          title="Edit"
			          onclick="editFabricator('${fab}')"></i>`;

            tableRows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${fab}</td>
                    <td style="padding-left:10px;">
                        ${actionIcon}
                    </td>
					<td>
					<input type="checkbox"
					${record && Number(record.status) === 1 ? "checked" : ""}
					onchange="confirmStatusChange(${record.weld_id}, this)" id="statusfab">
					</td>
                </tr>
            `;
        });

        // ✅ bind table (EXISTING)
        document.querySelector("#tableID tbody").innerHTML = tableRows;

        // ✅ re-init datatable (EXISTING)
        if ($.fn.DataTable.isDataTable('#tableID')) {
            $('#tableID').DataTable().destroy();
        }

		$("#tableID").DataTable({
				    dom: 'Bfrtip',
				    scrollX: true,
				    info: true,           // ✅ Shows "Showing 1 to 10 of X entries"
				    paging: true,         // ✅ Enables paging
				    pageLength: 10,       // ✅ 10 records per page
				    destroy: true,
				    buttons: [
				        {
				            extend: 'excel',
				            text: 'Export to Excel',
				            title: 'List',
				        },
				    ]
				});

        // ✅ styling (EXISTING)
        $('.dt-buttons').css({ float: 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ float: 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error('Error fetching QC Fabricators:', error);
    }
}

let selectedWeldId = null;
let selectedCheckbox = null;
let previousState = null;

function confirmStatusChange(weldId, checkbox) {

    selectedWeldId = weldId;
    selectedCheckbox = checkbox;

    // store current state before change
    previousState = !checkbox.checked;
	
	
	const allowed = allowedActions || [];

	if (!allowed.includes("Status")) {
	  alert(" You do not have permission to Change the Status");
	  checkbox.checked = previousState;
	  return;
	}

    $('#exampleModalCenter808').modal('show');
}

document.getElementById("confirmfab1Yes").addEventListener("click", async function () {

    const status = selectedCheckbox.checked ? 1 : 0;

    const apiUrl = new URL('/api/qc/weld/update-status', baseUrl1);

    try {

        const response = await fetch(apiUrl + `?weld_id=${selectedWeldId}&status=${status}`, {
            method: "PUT",
            credentials: "include"
        });

        const result = await response.json();

        if (result.success) {

            $('#exampleModalCenter808').modal('hide');
			// ✅ FORCE checkbox state
			            if (status === 1) {
			                selectedCheckbox.checked = true;
			            } else {
			                selectedCheckbox.checked = false;
			            }

            // ✅ success message
            showPopup("Updated Successfully");

        } else {

            showPopup("Failed to update status");

            // revert checkbox if failed
            selectedCheckbox.checked = previousState;
        }

    } catch (err) {

        console.error("Status update error:", err);

        selectedCheckbox.checked = previousState;
    }

});

$('#exampleModalCenter808 .btn-secondary').click(function () {

    if (selectedCheckbox) {
        selectedCheckbox.checked = previousState;
    }

});

function populateFabricatorDropdownFromTable(weldData) {

    const select = document.getElementById("fabid");
    select.innerHTML = '<option value="">Select</option>';

    const uniqueFabricators = [
        ...new Set(weldData.map(d => d.fabricator_ID).filter(Boolean))
    ];

    uniqueFabricators.forEach(fab => {
        const option = document.createElement("option");
        option.value = fab;
        option.textContent = fab;
        select.appendChild(option);
    });
}

// ✅ DROPDOWN → READ-ONLY TEXTBOX FILL
document.getElementById("fabid").addEventListener("change", function () {

    const selectedFab = this.value;
    const descInput = document.getElementById("fabdesc");

    if (!selectedFab) {
        descInput.value = "";
        descInput.readOnly = false;
        return;
    }

    // 🔍 find matching record from GLOBAL data
    const record = weldMasterData.find(
        d => d.fabricator_ID === selectedFab
    );

    if (record) {
        descInput.value = record.fabricator_ID; // or name later
        descInput.readOnly = true;               // ✅ read-only
    } else {
        descInput.value = "";
        descInput.readOnly = false;
    }
});

// CREATE button click
document.getElementById("submitfab").addEventListener("click", function () {

    const fabDesc = document.getElementById("fabdesc").value.trim();

    if (fabDesc === "") {
        document.getElementById("fabdescError").style.display = "block";
        return;
    }

    document.getElementById("fabdescError").style.display = "none";

    // show confirmation modal
    $('#exampleModalCenter80').modal('show');
});

// CONFIRM YES (CREATE)
document.getElementById("confirmfabYes").addEventListener("click", async function () {

    const fabDesc = document.getElementById("fabdesc").value.trim();

    if (fabDesc === "") {
        showPopup("Fabricator cannot be empty", location.href);
        return;
    }

    const payload = {
        fabricator_ID: fabDesc,
        welder_ID: null,
        position: null,
        process: null,
        created_by: createdById   // adjust if needed
    };

    try {
        const response = await fetch(
            new URL('/api/qc/weld/create', baseUrl1),
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            }
        );

        const result = await response.text();

        $('#exampleModalCenter80').modal('hide');
        $('#exampleModalScrollableIN').modal('hide');

        if (result.toLowerCase().includes("duplicate")) {
            showModalPopup("Fabricator already exists!", location.href);
        } else {
            showPopup("Fabricator created successfully", location.href);
        }

    } catch (err) {
        console.error(err);
        showPopup("Error creating fabricator", location.href);
    }
});

function showModalPopup(message) {
    $('#errorMessageupfab').text(message);
    $('#exampleModalCenterfab').modal('show');
}

// Close modal when OK is clicked
$(document).on('click', '#modalokk', function() {
    $('#exampleModalCenterfab').modal('hide');
    // Redirect after closing
   // window.location = "Items.jsp";
});

function editFabricator(fabId) {
			  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const record = weldMasterData.find(d => d.fabricator_ID === fabId);
    if (!record) return;

    // ✅ store full record INCLUDING ID
    selectedFabRecord = { ...record };

    const fabSelect = document.getElementById("fabidup");
    fabSelect.innerHTML = "";

    const opt = document.createElement("option");
    opt.value = record.fabricator_ID;
    opt.textContent = record.fabricator_ID;
    fabSelect.appendChild(opt);

    fabSelect.disabled = true;

    document.getElementById("fabdescup").value = record.fabricator_ID;

    $('#exampleModalScrollableINUp').modal('show');
}

document.getElementById("fabupd").addEventListener("click", function () {

    const updatedDesc = document.getElementById("fabdescup").value.trim();

    if (updatedDesc === "") {
        document.getElementById("fabdescupError").style.display = "block";
        return;
    }

    document.getElementById("fabdescupError").style.display = "none";

    // 🔹 build updated payload
    const updatedPayload = {
        fabricator_ID: updatedDesc,
        welder_ID: selectedFabRecord.welder_ID,
        position: selectedFabRecord.position,
        process: selectedFabRecord.process
    };

    // 🚫 NO FIELD CHANGED CHECK
    if (isNoFieldChanged(selectedFabRecord, updatedPayload)) {
        showPopup("No fields changed!",location.href);
        return;
    }

    // ✅ store only if changed
    pendingFabPayload = {
        id: selectedFabRecord.weld_id,
        ...updatedPayload,
        modified_by: createdById
    };

    $('#exampleModalCenter75').modal('show');
});

document.getElementById("confirmfabupd").addEventListener("click", async function () {

    if (!pendingFabPayload) return;

    try {
        const response = await fetch(
            new URL(`/api/qc/weld/update/${pendingFabPayload.id}`, baseUrl1),
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(pendingFabPayload)
            }
        );

        const result = await response.text();

        $('#exampleModalCenter75').modal('hide');
        $('#exampleModalScrollableINUp').modal('hide');

        if (result.toLowerCase().includes("exists")) {
            showModalPopup("Fabricator already exists!");
        } else {
            showPopup("Fabricator updated successfully", location.href);
        }

    } catch (error) {
        console.error(error);
        showPopup("Error updating fabricator", location.href);
    } finally {
        pendingFabPayload = null;
    }
});

document.getElementById("cancelregmodal").addEventListener("click", function () {
    $('#exampleModalCenter75').modal('hide');
});

function isNoFieldChanged(original, updated) {
    return (
        (original.fabricator_ID || "") === (updated.fabricator_ID || "") &&
        (original.welder_ID || "") === (updated.welder_ID || "") &&
        (original.position || "") === (updated.position || "") &&
        (original.process || "") === (updated.process || "")
    );
}

let welderMasterData = [];
let selectedWelderRecord = null;
let pendingWelderPayload = null;

document.addEventListener("DOMContentLoaded", function () {
    fetchWelders();
});

// Fetch all welders
async function fetchWelders() {
    try {
        // 1️⃣ Fetch all welders (EXISTING)
        const response = await fetch(new URL('/api/qc/weld/fetch', baseUrl1), {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch welder data");

        const weldData = await response.json();

        // ✅ Store globally (EXISTING)
        welderMasterData = weldData;

        // ✅ Populate dropdown (EXISTING)
        populateWelderDropdown(weldData);

        // ✅ Get unique welders (EXISTING)
        const uniqueWelders = [
            ...new Set(weldData.map(d => d.welder_ID).filter(Boolean))
        ];

        let tableRows = '';

        // 2️⃣ Loop through each unique welder
        uniqueWelders.forEach((welder, index) => {

            // 🔹 Find matching record (SAFE)
            const record = weldData.find(d => d.welder_ID === welder);

            // 🔹 Check usage (SAFE fallback)
            const isUsed = record && weldUsageMap
                ? weldUsageMap[record.weld_id] === true
                : false;

            // 🔹 Decide icon (NEW – NON-BREAKING)
			const actionIcon = isUsed
			    ? `<i class="fa fa-pen"
			          style="cursor:not-allowed; opacity:0.35;"
			          title="Used in transaction"></i>`
			    : `<i class="fa fa-pen text-muted"
			          style="cursor:pointer;"
			          title="Edit"
			          onclick="editWelder('${welder}')"></i>`;

            tableRows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${welder}</td>
                    <td style="padding-left:10px;">
                        ${actionIcon}
                    </td>
					<td>
					<input type="checkbox"
					${record && Number(record.status) === 1 ? "checked" : ""}
					onchange="confirmStatusChange(${record.weld_id}, this)" id="statusweld">
					</td>
                </tr>
            `;
        });

        // 3️⃣ Render table (EXISTING)
        document.querySelector("#tableID1 tbody").innerHTML = tableRows;

        // 4️⃣ Initialize / Reinitialize DataTable (EXISTING)
        if ($.fn.DataTable.isDataTable('#tableID1')) {
            $('#tableID1').DataTable().destroy();
        }

		$("#tableID1").DataTable({
						    dom: 'Bfrtip',
						    info: false,           // ✅ Shows "Showing 1 to 10 of X entries"
						    paging: true,         // ✅ Enables paging
						    pageLength: 10,  
						    buttons: [
						        {
						            extend: 'excel',
						            text: 'Export to Excel',
						            title: 'QC Welder Master',
						        },
						    ]
						});
        // ✅ styling (EXISTING)
        $('.dt-buttons').css({ float: 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ float: 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error('Error fetching Welders:', error);
    }
}



// Populate create dropdown
function populateWelderDropdown(data) {
    const select = document.getElementById("weld");
    select.innerHTML = '<option value="">Select</option>';
    [...new Set(data.map(d => d.welder_ID).filter(Boolean))].forEach(w => {
        const opt = document.createElement("option");
        opt.value = w;
        opt.textContent = w;
        select.appendChild(opt);
    });
}

// Dropdown → fill description read-only
document.getElementById("weld").addEventListener("change", function () {
    const val = this.value;
    const desc = document.getElementById("welddesc");
    if (!val) {
        desc.value = "";
        desc.readOnly = false;
        return;
    }
    const rec = welderMasterData.find(d => d.welder_ID === val);
    if (rec) {
        desc.value = rec.welder_ID;
        desc.readOnly = true;
    } else {
        desc.value = "";
        desc.readOnly = false;
    }
});

// CREATE button
document.getElementById("submitweld").addEventListener("click", function () {
    const val = document.getElementById("welddesc").value.trim();
    if (!val) { document.getElementById("welddescError").style.display = "block"; return; }
    document.getElementById("welddescError").style.display = "none";
    $('#exampleModalCenter85').modal('show');
});

// CONFIRM CREATE
document.getElementById("confirmweldYes").addEventListener("click", async function () {
    const val = document.getElementById("welddesc").value.trim();
    const payload = { welder_ID: val, created_by: createdById };
    try {
        const res = await fetch(new URL('/api/qc/weld/create', baseUrl1), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
        });
        const result = await res.text();
        $('#exampleModalCenter85').modal('hide');
        $('#exampleModalScrollableCon').modal('hide');
        if (result.toLowerCase().includes("duplicate")) showModalPopup("Welder already exists!", location.pathname + "?radio=welder");
        else showPopup("Welder created successfully", location.pathname + "?radio=welder");
    } catch (err) { console.error(err); showPopup("Error creating welder", location.pathname + "?radio=welder"); }
});

// Edit welder
function editWelder(wid) {
				  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const rec = welderMasterData.find(d => d.welder_ID === wid);
    if (!rec) return;
    selectedWelderRecord = { ...rec };

    const sel = document.getElementById("weldup");
    sel.innerHTML = `<option value="${rec.welder_ID}">${rec.welder_ID}</option>`;
    sel.disabled = true;
    document.getElementById("welddescup").value = rec.welder_ID;
    $('#exampleModalScrollableConUp').modal('show');
}

// UPDATE button
document.getElementById("weldupd").addEventListener("click", function () {
    const val = document.getElementById("welddescup").value.trim();
    if (!val) { document.getElementById("welddescupError").style.display = "block"; return; }
    document.getElementById("welddescupError").style.display = "none";

    const updatedPayload = { welder_ID: val };
    if (selectedWelderRecord.welder_ID === val) { showPopup("No fields changed!", location.pathname + "?radio=welder"); return; }
    pendingWelderPayload = { id: selectedWelderRecord.weld_id, ...updatedPayload, modified_by: createdById };
    $('#exampleModalCenter86').modal('show');
});

// CONFIRM UPDATE
document.getElementById("confirmweldupd").addEventListener("click", async function () {
    if (!pendingWelderPayload) return;
    try {
        const res = await fetch(new URL(`/api/qc/weld/update/${pendingWelderPayload.id}`, baseUrl1), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(pendingWelderPayload)
        });
        const result = await res.text();
        $('#exampleModalCenter86').modal('hide');
        $('#exampleModalScrollableConUp').modal('hide');
        if (result.toLowerCase().includes("exists")) showPopup("Welder already exists!", location.pathname + "?radio=welder");
        else showPopup("Welder updated successfully", location.pathname + "?radio=welder");
    } catch (err) { console.error(err); showPopup("Error updating welder", location.pathname + "?radio=welder"); }
    finally { pendingWelderPayload = null; }
});

// Cancel modal
document.getElementById("cancelweldmodal").addEventListener("click", function () {
    $('#exampleModalCenter86').modal('hide');
});

let positionMasterData = [];
let selectedPositionRecord = null;
let pendingPositionPayload = null;

document.addEventListener("DOMContentLoaded", function () {
    fetchPositions();
});

async function fetchPositions() {
    try {
        const response = await fetch(new URL('/api/qc/weld/fetch', baseUrl1), {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch position data");

        const data = await response.json();

        positionMasterData = data || [];

        populatePositionDropdown(positionMasterData);

        const uniquePositions = [
            ...new Set(positionMasterData.map(d => d.position).filter(Boolean))
        ];

        let tableRows = '';

        if (uniquePositions.length > 0) {
            uniquePositions.forEach((pos, index) => {
                tableRows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${pos}</td>
                        <td style="padding-left:10px;">
                            <i class="fa fa-pen text-muted"
                               style="cursor:pointer;"
                               title="Edit"
                               onclick="editPosition('${pos}')"></i>
                        </td>
                    </tr>
                `;
            });
        }

        document.querySelector("#positiontableID tbody").innerHTML = tableRows;

        // Destroy old DataTable safely
        if ($.fn.DataTable.isDataTable('#positiontableID')) {
            $('#positiontableID').DataTable().destroy();
        }

        // Initialize DataTable ALWAYS
        $('#positiontableID').DataTable({
            dom: 'Bfrtip',
            paging: true,
			pageLength: 10,
            info: false,
            searching: true,
            language: {
                emptyTable: "No data available"
            },
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'QC Position Master'
            }]
        });
        // Styling
        $('.dt-buttons').css({ float: 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ float: 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error('Error fetching Positions:', error);

        // Even on error → show empty DataTable
        if ($.fn.DataTable.isDataTable('#positiontableID')) {
            $('#positiontableID').DataTable().destroy();
        }

        $('#positiontableID').DataTable({
            dom: 'Bfrtip',
            paging: false,
            info: false,
            language: {
                emptyTable: "No data available"
            },
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'QC Position Master'
            }]
        });
    }
}

function populatePositionDropdown(data) {
    const select = document.getElementById("position");
    select.innerHTML = '<option value="">Select</option>';

    [...new Set(data.map(d => d.position).filter(Boolean))]
        .forEach(p => {
            const opt = document.createElement("option");
            opt.value = p;
            opt.textContent = p;
            select.appendChild(opt);
        });
}

document.getElementById("position").addEventListener("change", function () {
    const val = this.value;
    const desc = document.getElementById("posdesc");

    if (!val) {
        desc.value = "";
        desc.readOnly = false;
        return;
    }

    const rec = positionMasterData.find(d => d.position === val);
    if (rec) {
        desc.value = rec.position;
        desc.readOnly = true;
    } else {
        desc.value = "";
        desc.readOnly = false;
    }
});

document.getElementById("createposition").addEventListener("click", function () {
    const val = document.getElementById("posdesc").value.trim();

    if (!val) {
        document.getElementById("posdescError").style.display = "block";
        return;
    }

    document.getElementById("posdescError").style.display = "none";
    $('#exampleModalCenter99').modal('show');
});

document.getElementById("confirmposyes").addEventListener("click", async function () {
    const val = document.getElementById("posdesc").value.trim();

    const payload = {
        position: val,
        created_by: createdById
    };

    try {
        const res = await fetch(new URL('/api/qc/weld/create', baseUrl1), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        const result = await res.text();

        $('#exampleModalCenter99').modal('hide');
        $('#exampleModalScrollableposition').modal('hide');

        if (result.toLowerCase().includes("duplicate"))
            showModalPopup("Position already exists!", location.pathname + "?radio=position");
        else
            showPopup("Position created successfully", location.pathname + "?radio=position");

    } catch (err) {
        console.error(err);
        showPopup("Error creating position", location.pathname + "?radio=position");
    }
});

function editPosition(pos) {
				  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const rec = positionMasterData.find(d => d.position === pos);
    if (!rec) return;

    selectedPositionRecord = { ...rec };

    const sel = document.getElementById("positionup");
    sel.innerHTML = `<option value="${rec.position}">${rec.position}</option>`;
    sel.disabled = true;

    document.getElementById("posdescup").value = rec.position;

    $('#exampleModalScrollablepositionUp').modal('show');
}

document.getElementById("updpos").addEventListener("click", function () {
    const val = document.getElementById("posdescup").value.trim();

    if (!val) {
        document.getElementById("posdescupError").style.display = "block";
        return;
    }

    document.getElementById("posdescupError").style.display = "none";

    if (selectedPositionRecord.position === val) {
        showPopup("No fields changed!", location.pathname + "?radio=position");
        return;
    }

    pendingPositionPayload = {
        id: selectedPositionRecord.weld_id,
        position: val,
        modified_by: createdById
    };

    $('#exampleModalCenter89').modal('show');
});

document.getElementById("confirmposupd").addEventListener("click", async function () {
    if (!pendingPositionPayload) return;

    try {
        const res = await fetch(
            new URL(`/api/qc/weld/update/${pendingPositionPayload.id}`, baseUrl1),
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(pendingPositionPayload)
            }
        );

        const result = await res.text();

        $('#exampleModalCenter89').modal('hide');
        $('#exampleModalScrollablepositionUp').modal('hide');

        if (result.toLowerCase().includes("exists"))
            showPopup("Position already exists!", location.pathname + "?radio=position");
        else
            showPopup("Position updated successfully", location.pathname + "?radio=position");

    } catch (err) {
        console.error(err);
        showPopup("Error updating position", location.pathname + "?radio=position");
    } finally {
        pendingPositionPayload = null;
    }
});

document.getElementById("cancelpositionmodal").addEventListener("click", function () {
    $('#exampleModalCenter89').modal('hide');
});

let processMasterData = [];
let selectedProcessRecord = null;
let pendingProcessPayload = null;

document.addEventListener("DOMContentLoaded", function () {
    fetchProcesses();
});

// ================= FETCH =================
async function fetchProcesses() {
    try {
        const response = await fetch(new URL('/api/qc/weld/fetch', baseUrl1), {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch process data");

        const data = await response.json();
        processMasterData = data || [];

        populateProcessDropdown(processMasterData);

        const uniqueProcesses = [
            ...new Set(processMasterData.map(d => d.process).filter(Boolean))
        ];

        let tableRows = '';

        if (uniqueProcesses.length > 0) {
            uniqueProcesses.forEach((proc, index) => {
                tableRows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${proc}</td>
                        <td>
                            <i class="fa fa-pen text-muted"
                               style="cursor:pointer;"
                               title="Edit"
                               onclick="editProcess('${proc}')"></i>
                        </td>
                    </tr>`;
            });
        }

        document.querySelector("#processTableID tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#processTableID')) {
            $('#processTableID').DataTable().destroy();
        }

        $('#processTableID').DataTable({
            dom: 'Bfrtip',
			paging: true,
			pageLength: 10,
            info: false,
            searching: true,
            language: { emptyTable: "No data available" },
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'QC Process Master'
            }]
        });

        $('.dt-buttons').css({ float: 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ float: 'right' });

    } catch (error) {
        console.error(error);
        $('#processTableID').DataTable({
            language: { emptyTable: "No data available" }
        });
    }
}

// ================= DROPDOWN =================
function populateProcessDropdown(data) {
    const select = document.getElementById("processCreate");
    select.innerHTML = '<option value="">Select</option>';

    [...new Set(data.map(d => d.process).filter(Boolean))]
        .forEach(p => {
            const opt = document.createElement("option");
            opt.value = p;
            opt.textContent = p;
            select.appendChild(opt);
        });
}

document.getElementById("processCreate").addEventListener("change", function () {
    const val = this.value;
    const desc = document.getElementById("possdesc");

    if (!val) {
        desc.value = "";
        desc.readOnly = false;
        return;
    }

    const rec = processMasterData.find(d => d.process === val);
    if (rec) {
        desc.value = rec.process;
        desc.readOnly = true;
    }
});

// ================= CREATE =================
document.getElementById("createprocess").addEventListener("click", function () {
    const val = document.getElementById("possdesc").value.trim();

    if (!val) {
        document.getElementById("possdescError").style.display = "block";
        return;
    }

    document.getElementById("possdescError").style.display = "none";
    $('#exampleModalCenter110').modal('show');
});

document.getElementById("confirmprocessyes").addEventListener("click", async function () {
    const val = document.getElementById("possdesc").value.trim();

    const payload = {
        process: val,
        created_by: createdById
    };

    try {
        const res = await fetch(new URL('/api/qc/weld/create', baseUrl1), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        const result = await res.text();

        $('#exampleModalCenter110').modal('hide');
        $('#exampleModalScrollableprocess').modal('hide');

        if (result.toLowerCase().includes("duplicate"))
            showModalPopup("Process already exists!", location.pathname + "?radio=process");
        else
            showPopup("Process created successfully", location.pathname + "?radio=process");

    } catch (err) {
        console.error(err);
        showPopup("Error creating process", location.pathname + "?radio=process");
    }
});

// ================= EDIT =================
function editProcess(proc) {
				  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const rec = processMasterData.find(d => d.process === proc);
    if (!rec) return;

    selectedProcessRecord = { ...rec };

    const sel = document.getElementById("processUp");
    sel.innerHTML = `<option value="${rec.process}">${rec.process}</option>`;
    sel.disabled = true;

    document.getElementById("possdescup").value = rec.process;

    $('#exampleModalScrollableprocessup').modal('show');
}

// ================= UPDATE =================
document.getElementById("possup").addEventListener("click", function () {
    const val = document.getElementById("possdescup").value.trim();

    if (!val) {
        document.getElementById("possdescupError").style.display = "block";
        return;
    }

    document.getElementById("possdescupError").style.display = "none";

    if (selectedProcessRecord.process === val) {
        showPopup("No fields changed!", location.pathname + "?radio=process");
        return;
    }

    pendingProcessPayload = {
        id: selectedProcessRecord.weld_id,
        process: val,
        modified_by: createdById
    };

    $('#exampleModalCenter111').modal('show');
});

document.getElementById("confirmprocessupd").addEventListener("click", async function () {
    if (!pendingProcessPayload) return;

    try {
        const res = await fetch(
            new URL(`/api/qc/weld/update/${pendingProcessPayload.id}`, baseUrl1),
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(pendingProcessPayload)
            }
        );

        const result = await res.text();

        $('#exampleModalCenter111').modal('hide');
        $('#exampleModalScrollableprocessup').modal('hide');

        if (result.toLowerCase().includes("exists"))
            showPopup("Process already exists!", location.pathname + "?radio=process");
        else
            showPopup("Process updated successfully", location.pathname + "?radio=process");

    } catch (err) {
        console.error(err);
        showPopup("Error updating process", location.pathname + "?radio=process");
    } finally {
        pendingProcessPayload = null;
    }
});

document.getElementById("cancelprocessmodal").addEventListener("click", function () {
    $('#exampleModalCenter111').modal('hide');
});

/*function showPopup(message, redirectUrl) {
    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
    setTimeout(function () {
        popup.fadeOut(400, function () {
            $(this).remove();
            window.location = redirectUrl;
        });
    }, 2000);
}*/
document.addEventListener("DOMContentLoaded", function () {
    fetchRevision();
});
// ================= FETCH =================
async function fetchRevision() {
    try {
        const response = await fetch(new URL('/api/qc/weld/fetch', baseUrl1), {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch revision data");

        const data = await response.json();
        revisionMasterData = data || [];

        populateRevisionDropdown(revisionMasterData);

        const uniqueRevisions = [
            ...new Set(revisionMasterData.map(d => d.revision).filter(Boolean))
        ];

        let tableRows = '';

        if (uniqueRevisions.length > 0) {
            uniqueRevisions.forEach((rev, index) => {
                tableRows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${rev}</td>
                        <td>
                            <i class="fa fa-pen text-muted"
                               style="cursor:pointer;"
                               title="Edit"
                               onclick="editRevision('${rev}')"></i>
                        </td>
                    </tr>`;
            });
        }

        document.querySelector("#tableIDrev tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableIDrev')) {
            $('#tableIDrev').DataTable().destroy();
        }

        $('#tableIDrev').DataTable({
            dom: 'Bfrtip',
			paging: true,
			pageLength: 10,
            info: false,
            searching: true,
            language: { emptyTable: "No data available" },
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'QC Revision Master'
            }]
        });

        $('.dt-buttons').css({ float: 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ float: 'right' });

    } catch (error) {
        console.error(error);

        $('#tableIDrev').DataTable({
            language: { emptyTable: "No data available" }
        });
    }
}

// ================= DROPDOWN =================
function populateRevisionDropdown(data) {
    const select = document.getElementById("qcrev");
    select.innerHTML = '<option value="">Select</option>';

    [...new Set(data.map(d => d.revision).filter(Boolean))]
        .forEach(r => {
            const opt = document.createElement("option");
            opt.value = r;
            opt.textContent = r;
            select.appendChild(opt);
        });
}

document.getElementById("qcrev").addEventListener("change", function () {

    const val = this.value;
    const desc = document.getElementById("qcrevdesc");

    if (!val) {
        desc.value = "";
        desc.readOnly = false;
        return;
    }

    const rec = revisionMasterData.find(d => d.revision === val);

    if (rec) {
        desc.value = rec.revision;
        desc.readOnly = true;
    }
});

document.getElementById("submitqcrev").addEventListener("click", function () {

    const val = document.getElementById("qcrevdesc").value.trim();

    if (!val) {
        document.getElementById("qcrevdescError").style.display = "block";
        return;
    }

    document.getElementById("qcrevdescError").style.display = "none";

    $('#exampleModalCenterqcrev').modal('show');
});

document.getElementById("confirmqcrevYes").addEventListener("click", async function () {

    const val = document.getElementById("qcrevdesc").value.trim().toLowerCase();

    // 🔴 Check duplicate in existing revision data
    const duplicate = revisionMasterData.some(
        r => r.revision && r.revision.toLowerCase() === val
    );

    if (duplicate) {
        $('#exampleModalCenterqcrev').modal('hide');
        showModalPopup("Revision already exists!", location.pathname + "?radio=revision");
        return;
    }

    const payload = {
        revision: val,
        created_by: createdById
    };

    try {

        const res = await fetch(new URL('/api/qc/weld/create', baseUrl1), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        const result = await res.text();

        $('#exampleModalCenterqcrev').modal('hide');
        $('#exampleModalScrollableConrev').modal('hide');

        showPopup("Revision created successfully", location.pathname + "?radio=revision");

    }
    catch (err) {

        console.error(err);
        showPopup("Error creating revision", location.pathname + "?radio=revision");

    }

});

function editRevision(rev) {
				  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    const rec = revisionMasterData.find(d => d.revision === rev);
    if (!rec) return;

    selectedRevisionRecord = { ...rec };

    const sel = document.getElementById("qcrevup");
    sel.innerHTML = `<option value="${rec.revision}">${rec.revision}</option>`;
    sel.disabled = true;

    document.getElementById("qcrevupdescup").value = rec.revision;

    $('#exampleModalScrollableConUprev').modal('show');
}

document.getElementById("qcrevupd").addEventListener("click", function () {

    const val = document.getElementById("qcrevupdescup").value.trim();

    if (!val) {
        document.getElementById("qcrevupdescupError").style.display = "block";
        return;
    }

    document.getElementById("qcrevupdescupError").style.display = "none";

    if (selectedRevisionRecord.revision === val) {
        showPopup("No fields changed!", location.pathname + "?radio=revision");
        return;
    }

    pendingRevisionPayload = {
        id: selectedRevisionRecord.weld_id,
        revision: val,
        modified_by: createdById
    };

    $('#exampleModalCenterqcrevupd').modal('show');

});

document.getElementById("confirmqcrevupd").addEventListener("click", async function () {

    if (!pendingRevisionPayload) return;

    console.log("Updating Revision:", pendingRevisionPayload);

    try {

        const res = await fetch(
            new URL(`/api/qc/weld/update/${pendingRevisionPayload.id}`, baseUrl1),
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(pendingRevisionPayload)
            }
        );

        const result = await res.text();
        console.log("API Response:", result);

        $('#exampleModalCenterqcrevupd').modal('hide');
        $('#exampleModalScrollableConUprev').modal('hide');

        if (!res.ok) {
            showPopup("Update failed", location.pathname + "?radio=revision");
            return;
        }

        if (result.toLowerCase().includes("exists"))
            showPopup("Revision already exists!", location.pathname + "?radio=revision");
        else
            showPopup("Revision updated successfully", location.pathname + "?radio=revision");

    }
    catch (err) {

        console.error("Update Error:", err);
        showPopup("Error updating revision", location.pathname + "?radio=revision");

    }
    finally {

        pendingRevisionPayload = null;

    }

});

function showPopup(message, redirectUrl) {

    var popup = $('<div class="popup">' + message + '</div>')
        .appendTo('body')
        .hide()
        .fadeIn(400);

    setTimeout(function () {
        popup.fadeOut(400, function () {
            $(this).remove();

            // ✅ redirect only if URL is provided
            if (redirectUrl) {
                window.location = redirectUrl;
            }
        });
    }, 2000);
}



