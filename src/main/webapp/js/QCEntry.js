const currentPage = window.location.pathname.split("/").pop() +'.jsp';

const UserId = sessionStorage.getItem('username');
const isGeethan = UserId && UserId.toLowerCase() === "geethan";

let allowedActions = [];

async function loadActions() {

    try {

        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(currentPage)}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch actions");
        }

        allowedActions = await response.json();

        console.log("Allowed Actions:", allowedActions);

    } catch (error) {
        console.error("Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();
});


document.getElementById("modalScroll1").addEventListener("click", function () {
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert("You do not have permission to Insert.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}
	$('#exampleModalScrollable123').modal('show');
})

const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

// Tracks rows submitted in current session (no refresh)
const submittedMarks = new Set();

document.addEventListener("DOMContentLoaded", function () {
    resetDropdown(document.getElementById("Contract"), "Select Contract");
    resetDropdown(document.getElementById("Phase"), "Select Phase");
    resetDropdown(document.getElementById("Load"), "Select Load");

    loadContracts();

    document.getElementById("Contract").addEventListener("change", onContractChange);
    document.getElementById("Phase").addEventListener("change", onPhaseChange);
	document.getElementById("Load").addEventListener("change", onLoadChange);
});

function hideContainer() {
    const container1 = document.getElementById("container1");
    if (container1) {
        container1.style.display = "none";
    }
}

function onLoadChange() {
    hideContainer();
    resetJoinee();
}

/* -------------------- LOAD CONTRACTS -------------------- */
function loadContracts() {
    const contractDDL = $('#Contract');

    contractDDL.empty().append('<option value="">Select Contract</option>');

    fetch(
        new URL(`/jssl/qc/inspection/contracts?factory=${selectedFactoryId}`, baseUrl1),
        { method: "GET", credentials: "include" }
    )
    .then(res => res.json())
    .then(data => {
        if (!data.Data) return;

        data.Data.forEach(item => {
            contractDDL.append(
                $('<option>', {
                    value: item.contract_id,
                    text: item.contract_name
                })
            );
        });

        contractDDL.trigger('change');
    })
    .catch(err => console.error("Error loading contracts", err));
}

function resetJoinee() {
    const joinee = document.getElementById("Joinee");
    joinee.value = "";
}

/* -------------------- CONTRACT CHANGE -------------------- */
function onContractChange() {
    const contractId = document.getElementById("Contract").value;

    hideContainer();
    resetDropdown(document.getElementById("Phase"), "Select Phase");
    resetDropdown(document.getElementById("Load"), "Select Load");
    resetJoinee();

    if (!contractId) return;

    fetch(
        new URL(`/jssl/qc/inspection/phases?factory=${selectedFactoryId}&contractId=${contractId}`, baseUrl1),
        { method: "GET", credentials: "include" }
    )
    .then(res => res.json())
    .then(data => {
        if (!data.Data) return;
        data.Data.forEach(phase => {
            const opt = document.createElement("option");
            opt.value = phase;
            opt.textContent = phase;
            document.getElementById("Phase").appendChild(opt);
        });
    });
}

/* -------------------- PHASE CHANGE -------------------- */
function onPhaseChange() {
    hideContainer();

    const phase = document.getElementById("Phase").value;
    const contractId = document.getElementById("Contract").value;

    resetDropdown(document.getElementById("Load"), "Select Load");

	resetJoinee();

    if (!phase || !contractId) return;

    fetch(
        new URL(`/jssl/qc/inspection/loads?factory=${selectedFactoryId}&contractId=${contractId}&phase=${encodeURIComponent(phase)}`, baseUrl1),
        { method: "GET", credentials: "include" }
    )
    .then(res => res.json())
    .then(data => {
        if (!data.Data) return;

        data.Data.forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.load_id;
            opt.textContent = item.pload;
            document.getElementById("Load").appendChild(opt);
        });
    });
}

/* -------------------- UTIL -------------------- */
function resetDropdown(dropdown, defaultText) {
    dropdown.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = defaultText;
    dropdown.appendChild(opt);
}

document.getElementById("Joinee").addEventListener("change", onInspectionChange);


function onInspectionChange() {

    const inspectionType = document.getElementById("Joinee").value;
    const container = document.getElementById("container1");

    if (!inspectionType) {
        container.style.display = "none";
        return;
    }

    const contractId = document.getElementById("Contract").value;
    const phase = document.getElementById("Phase").value;
    const loadId = document.getElementById("Load").value;
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId");

    if (!contractId || !phase || !loadId) {
        showModalPopup("Please select Contract, Phase and Load");
        document.getElementById("Joinee").value = "";
        container.style.display = "none";
        return;
    }

    container.style.display = "block";

    let apiPath = "";

    if (inspectionType === "FITUP") {
        // NOTE: this endpoint now returns BOTH Fit-Up and Loose-Item rows merged
        // together (each tagged with row.inspection_type = "FITUP" | "LOOSE").
        apiPath = "/jssl/qc/inspection/fitup-data";
		fetchInspectionTableData(apiPath, selectedFactoryId, contractId, phase, loadId);
    }
    else if (inspectionType === "WELD") {
        apiPath = "/jssl/qc/inspection/weld-data";
		fetchweldInspectionTableData(apiPath, selectedFactoryId, contractId, phase, loadId);
    }
    // LOOSE branch removed -- Loose Item data now arrives merged with FITUP data above.
}

function showModalPopup(message) {
    $('#errorMessageupQC').text(message);
    $('#exampleModalCenterQC').modal('show');
}

$(document).on('click', '#modalokk', function() {
    $('#exampleModalCenterQC').modal('hide');
});

function fetchInspectionTableData(apiPath, factoryId, contractId, phase, loadId) {

    fetch(
        new URL(
            `${apiPath}?factory=${factoryId}&contractId=${contractId}&phase=${phase}&loadId=${loadId}`,
            baseUrl1
        ),
        { method: "GET", credentials: "include" }
    )
    .then(res => res.json())
    .then(result => {

        if (!result.Data || result.Data.length === 0) {
            showModalPopup("No data available");
            document.querySelector("#TableID tbody").innerHTML = "";
            return;
        }

        bindFitUpTable(result.Data);
    })
    .catch(err => {
        console.error(err);
        showModalPopup("Error fetching inspection data");
    });
}

function fetchweldInspectionTableData(apiPath, factoryId, contractId, phase, loadId) {

    fetch(
        new URL(
            `${apiPath}?factory=${factoryId}&contractId=${contractId}&phase=${phase}&loadId=${loadId}`,
            baseUrl1
        ),
        { method: "GET", credentials: "include" }
    )
    .then(res => res.json())
    .then(result => {

        if (!result.Data || result.Data.length === 0) {
            showModalPopup("No data available");
            document.querySelector("#TableweldID tbody").innerHTML = "";
            return;
        }

        bindWeldTable(result.Data);
    })
    .catch(err => {
        console.error(err);
        showModalPopup("Error fetching inspection data");
    });
}

/* =========================================================================
   MERGED FIT-UP + LOOSE-ITEM TABLE
   Column layout (0-indexed), matches the <thead> in QCEntry.jsp:
   0 Sl.no | 1 Type | 2 Phase | 3 Load | 4 Mark | 5 Qty | 6 Dims(mm) |
   7 Section Size | 8 Fabricator Id | 9 Fitup Inspected qty |
   10 Fitup balanced qty | 11 Buckling | 12 Camber | 13 Fitup balance |
   14 Remarks | 15 Rework | 16 Revision | 17 Loose Inspected qty |
   18 Loose Balanced qty | 19 Dimensional Insp | 20 Visual Insp |
   21 Result | 22 Inspected by | 23 Date & Time | 24 Status | 25 Create

   NOTE: "Length" is no longer part of the Fit-Up table -- it now lives on
   the Weld Inspection table only (see bindWeldTable below).
   ========================================================================= */
   function bindFitUpTable(data) {
       const tbody = document.querySelector("#TableID tbody");
       tbody.innerHTML = "";

       fetch(new URL("/api/qc/weld/fetch", baseUrl1), {
           method: "GET",
           credentials: "include"
       })
       .then(res => res.json())
       .then(fabData => {

           const fabricators = [...new Set(
               fabData
                   .filter(item => item.fabricator_ID && item.status != 1)
                   .map(item => item.fabricator_ID)
           )];

           const revisions = [...new Set(
               fabData
                   .filter(item => item.revision)
                   .map(item => item.revision)
           )];

           data.forEach((row, index) => {
               const tr = document.createElement("tr");
               tr.dataset.pieceDescr = row.piece_descr || "";

               bindFitUpRow(tr, row, index, fabricators, revisions);

               tbody.appendChild(tr);
           });
       })
       .catch(err => {
           console.error(err);
           showModalPopup("Error fetching fabricator data");
       });
   }

   function bindFitUpRow(tr, row, index, fabricators, revisions) {

       const totalQty = parseInt(row.qty) || 0;

       // Only trust fitup_balanced_qty when an inspection record already exists.
       // If status is empty/null, nothing has been inspected yet -> balance = full qty.
       const hasExistingRecord = !!row.status;

       const fitupBalance = hasExistingRecord
           ? (row.fitup_balanced_qty ?? totalQty)
           : totalQty;

       const cumulativeInspected = hasExistingRecord
           ? (totalQty - parseInt(fitupBalance || 0))
           : 0;

       // Input pre-fills with remaining balance (= full qty if never inspected)
       //const qtyValue = fitupBalance;
	   //const qtyValue = (fitupBalance === 0) ? cumulativeInspected : fitupBalance;
	   // Always show cumulative inspected qty, regardless of balance
	  const qtyValue = hasExistingRecord ? cumulativeInspected : totalQty;

       const isCompleted = row.status === "Completed" && parseInt(fitupBalance) === 0;

       tr.dataset.currentBalance = fitupBalance;
       tr.dataset.cumulativeInspected = cumulativeInspected;
       tr.dataset.totalQty = totalQty;

       const inputClass = "";

    const isCustomRemark = row.remarks && !["None","Shorten length","Hole out","After UT Fit Up","Others"].includes(row.remarks);

    tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${row.phase || ""}</td>
        <td>${row.load || ""}</td>

        <td class="mark-cell" style="cursor:pointer; color:blue; font-weight:bold;">
            ${row.mark || ""}
        </td>

		<td>${row.fmark || ""}</td>
        <td>${row.qty || ""}</td>
        <td>${row.ssize || ""}</td>

        <td>
            <select class="form-control form-control-sm ${inputClass} fabricator-dropdown">
                <option value="">Select Fabricator</option>
                ${fabricators.map(fab => `
                    <option value="${fab}" ${fab === row.fab_code ? "selected" : ""}>
                        ${fab}
                    </option>
                `).join("")}
            </select>
        </td>

		<td>
		   <input class="form-control form-control-sm ${inputClass} fitup-inspected"
		            type="number" value="${qtyValue}">
		</td>

		<td>
		<input class="form-control form-control-sm ${inputClass} fitup-balanced"
		       readonly
		       value="${fitupBalance}">
		</td>

		<td>
		    <input class="form-control form-control-sm ${inputClass}"
		           value="${row.buckling ?? 0}">
		</td>

		<td>
		    <input class="form-control form-control-sm ${inputClass}"
		           value="${row.camber ?? 0}">
		</td>

        <td>
            <input class="form-control form-control-sm ${inputClass}"
                   value="${row.fitup_balance || "NA"}">
        </td>

		<td>
		    ${isCustomRemark
		        ? `<input type="text"
		                  class="form-control form-control-sm remarks-others-input"
		                  value="${row.remarks}">`
		        : `<select class="form-control form-control-sm remarks-dropdown"
		                   onchange="toggleRowOthers(this)">
		               ${["None","Shorten length","Hole out","After UT Fit Up","Others"]
		                 .map(r => `<option ${r === row.remarks ? "selected" : ""}>${r}</option>`)
		                 .join("")}
		           </select>
		           <input type="text"
		                  class="form-control form-control-sm remarks-others-input"
		                  placeholder="Specify remarks"
		                  style="display:none;">`
		    }
		</td>

        <td>
            <select class="form-control form-control-sm ${inputClass}">
                ${["None","Rework req","Rework clrd"]
                  .map(r => `<option ${r === row.rework ? "selected" : ""}>${r}</option>`)
                  .join("")}
            </select>
        </td>

		<td>
			<select class="form-control form-control-sm revision-dropdown ${inputClass} revision-dropdown">
			<option value="0" ${row.revision == 0 ? "selected" : ""}>0</option>
			${revisions.map(rev => `
			<option value="${rev}" ${rev == row.revision ? "selected" : ""}>
			${rev}
			</option>
			`).join("")}
			</select>
		</td>

		<td class="result-cell">${row.result || ""}</td>
		<td class="entered-by-cell">${row.name || ""}</td>
		<td class="entered-date-cell">${row.insp_date || ""}</td>
		<td class="status-cell">${row.status || ""}</td>

		<td class="text-center">
		    <i class="bi bi-check-circle-fill create-btn
		       ${(isCompleted && !isGeethan) ? "d-none" : ""}"
		       title="Create"
		       style="cursor:pointer; font-size:18px; color:#0d6efd;">
		    </i>
		</td>
    `;

    const markCell = tr.querySelector(".mark-cell");

    if (isCompleted && !isGeethan) {
        markCell.style.pointerEvents = "none";
        markCell.style.color = "black";
        markCell.style.fontWeight = "normal";

        tr.querySelectorAll("input, select").forEach(el => {
            el.disabled = true;
        });
    }
}

function bindLooseRow(tr, row, index) {

    const looseInspected = row.inspected_qty || row.qty || "";
    const balancedQty = row.balanced_qty ?? row.qty ?? 0;

    const isCompleted = row.status === "Completed" && parseInt(balancedQty) === 0;
    const inputClass = "";

    tr.innerHTML = `
        <td>${index + 1}</td>
        <td><span class="badge-loose-item">LOOSE ITEM</span></td>
        <td>${row.phase || ""}</td>
        <td>${row.load || ""}</td>

        <td class="mark-cell" style="cursor:pointer; color:blue; font-weight:bold;">
            ${row.mark || ""}
        </td>

        <td>${row.qty || ""}</td>
        <td>${row.dims1 || ""}</td>
        <td>${row.ssize || ""}</td>
        <td>
            <input type="number"
                   class="form-control form-control-sm ${inputClass} looseiteminspected-qty"
                   value="${looseInspected}">
        </td>

        <td>
            <input type="number"
                   class="form-control form-control-sm ${inputClass} loose-balanced"
                   value="${balancedQty}"
                   readonly>
        </td>

        <td>
            <select class="form-control form-control-sm ${inputClass}">
                <option ${row.dimensional_insp === "Select" ? "selected" : ""}>Select</option>
                <option ${(!row.dimensional_insp || row.dimensional_insp === "OK") ? "selected" : ""}>OK</option>
                <option ${row.dimensional_insp === "None" ? "selected" : ""}>None</option>
                <option ${row.dimensional_insp === "NA" ? "selected" : ""}>NA</option>
            </select>
        </td>

        <td>
            <select class="form-control form-control-sm ${inputClass}">
                <option ${row.weld_visual === "Select" ? "selected" : ""}>Select</option>
                <option ${(!row.weld_visual || row.weld_visual === "Satisfactory") ? "selected" : ""}>
                    Satisfactory
                </option>
            </select>
        </td>

        <td>${row.result || ""}</td>
        <td>${row.name || ""}</td>
        <td>${row.insp_date || ""}</td>
        <td>${row.status || ""}</td>

		<td class="text-center">
		    <i class="bi bi-check-circle-fill create-btn
		       ${(isCompleted && !isGeethan) ? "d-none" : ""}"
		       title="Create"
		       style="cursor:pointer; font-size:18px; color:#0d6efd;">
		    </i>
		</td>
    `;

    const markCell = tr.querySelector(".mark-cell");

    if (isCompleted && !isGeethan) {
        markCell.style.pointerEvents = "none";
        markCell.style.color = "black";
        markCell.style.fontWeight = "normal";

        tr.querySelectorAll("input, select").forEach(el => {
            el.disabled = true;
        });
    }
}

/* Validates the Weld table's Length field against the piece's original
   length (data-original-length), same ±3 tolerance rule that used to live
   on the Fit-Up table. */
document.addEventListener("input", function (e) {
    if (!e.target.classList.contains("length-input")) return;

    const input = e.target;
    const td = input.closest("td");
    const errorMsg = td.querySelector(".length-error");

    const original = input.dataset.originalLength;
    const entered  = input.value.trim();

    if (entered === "") {
        errorMsg.classList.add("d-none");
        input.classList.remove("is-invalid");
        return;
    }

    if (entered.includes("*")) {
        errorMsg.classList.add("d-none");
        input.classList.remove("is-invalid");
        return;
    }

    const originalNum = parseFloat(original);
    const enteredNum = parseFloat(entered);

    if (isNaN(enteredNum)) {
        errorMsg.classList.remove("d-none");
        input.classList.add("is-invalid");
        return;
    }

    if (Math.abs(enteredNum - originalNum) > 3) {
        errorMsg.classList.remove("d-none");
        input.classList.add("is-invalid");
    } else {
        errorMsg.classList.add("d-none");
        input.classList.remove("is-invalid");
    }
});

/* =========================================================================
   WELD INSPECTION TABLE
   Column layout (0-indexed), matches the <thead> in QCEntry.jsp:
   0 Sl.no | 1 Phase | 2 Load | 3 Mark | 4 Qty | 5 Dims(mm) | 6 Section Size |
   7 Welder Id | 8 Weld Inspected qty | 9 Weld balanced qty | 10 Buckling |
   11 Camber | 12 Length | 13 Sweep | 14 Weld Visual | 15 UT | 16 Rework |
   17 Result | 18 Weld Inspected by | 19 Date & Time | 20 Fitup Remarks |
   21 Status | 22 Create
   ========================================================================= */
function bindWeldTable(data) {
    const tbody = document.querySelector("#TableweldID tbody");
    tbody.innerHTML = "";

    fetch(new URL("/api/qc/weld/fetch", baseUrl1), {
        method: "GET",
        credentials: "include"
    })
    .then(res => res.json())
    .then(welderData => {

        const welders = [...new Set(
            welderData
                .filter(i => i.welder_ID && i.status != 1)
                .map(i => i.welder_ID)
        )];

        data.forEach((row, index) => {
            const tr = document.createElement("tr");

            const totalQty = parseInt(row.qty || 0);

            const mark = (row.mark || "").trim();
            const fitupRow = [...document.querySelectorAll("#TableID tbody tr")]
                .find(r => r.querySelector(".mark-cell")?.innerText.trim() === mark);

            const fitupStatus = fitupRow
                ? fitupRow.querySelector(".status-cell")?.innerText.trim()
                : "";

            const hasFitupEntry = !!fitupStatus;

            const fitupCumulative = fitupRow
                ? parseInt(fitupRow.dataset.cumulativeInspected ?? 0)
                : 0;

            const allowedMax = hasFitupEntry ? Math.min(totalQty, fitupCumulative) : totalQty;

			const hasWeldRecord = row.weld_balanced_qty != null;

			            // weld_inspected_qty only ever stores the last delta entered, not the
			            // cumulative total — derive the true cumulative from the authoritative
			            // weld_balanced_qty instead (same pattern as the Fit-Up table).
			            const weldBalance = hasWeldRecord
			                ? parseInt(row.weld_balanced_qty)
			                : (totalQty - allowedMax);

			            const inspectedQty = hasWeldRecord
			                ? Math.max(totalQty - weldBalance, 0)
			                : allowedMax;

			            const isCompleted = row.status === "Completed" && parseInt(weldBalance) === 0;
						
            const inputClass = "";

            const lengthValue = row.length || row.dims1 || "";

            const fitupBlocksWelding = !hasFitupEntry || fitupStatus === "Incomplete";

            tr.dataset.totalQty = totalQty;
            tr.dataset.fitupAllowedMax = allowedMax;
			tr.dataset.weldCumulative = inspectedQty;
            tr.dataset.fitupStatus = fitupStatus;
			tr.dataset.currentBalance = weldBalance;

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${row.phase || ""}</td>
                <td>${row.load || ""}</td>

                <td class="mark-cell" style="cursor:pointer; color:blue; font-weight:bold;">
                    ${row.mark || ""}
                </td>

                <td>${row.fmark || ""}</td>
                <td>${row.qty || ""}</td>
                <td>${row.dims1 || ""}</td>
                <td>${row.ssize || ""}</td>

                <td>
                    <select class="form-control form-control-sm ${inputClass} welder-dropdown">
                        <option value="">Select Welder</option>
                           ${welders.map(w => `
                             <option value="${w}" ${w === row.welder_ID ? "selected" : ""}>
                               ${w}
                                 </option>
                                   `).join("")}
                                   </select>
                               </td>

                <td>
                <input class="form-control form-control-sm ${inputClass} weld-inspected"
                    type="number" value="${inspectedQty}">
                </td>
                <td>
                <input class="form-control form-control-sm ${inputClass} weld-balanced"
                       type="number" readonly>
                </td>
                <td>
                    <input class="form-control form-control-sm ${inputClass}" value="${row.weld_buckling ?? 0}">
                </td>

                <td>
                    <input class="form-control form-control-sm ${inputClass}" value="${row.weld_camber ?? 0}">
                </td>

                <td>
                    <input type="text" class="form-control form-control-sm length-input"
                           value="${lengthValue}"
                           data-original-length="${lengthValue}">
                    <small class="length-error text-danger d-none">
                        Length must be within ±3 of original length
                    </small>
                </td>

                <td>
                    <input class="form-control form-control-sm ${inputClass}" value="${row.sweep ?? 0}">
                </td>

                <td>
                    <select class="form-control form-control-sm ${inputClass}">
                     ${["Satisfactory"]
                       .map(r => `<option ${r === row.weld_visual ? "selected" : ""}>${r}</option>`)
                            .join("")}
                      </select>
                </td>

                <td>
                <select class="form-control form-control-sm ${inputClass}" data-type="ut">
                ${["None","OK","NA"]
                .map(r => `<option ${r === row.ut ? "selected" : ""}>${r}</option>`)
                .join("")}
                </select>
                </td>

                <td>
                  <select class="form-control form-control-sm ${inputClass}" data-type="rework">
                    ${["None","Rework req","Rework clrd"]
                      .map(r => `<option ${r === row.rework ? "selected" : ""}>${r}</option>`)
                      .join("")}
                  </select>
                </td>

                <td>${row.result || ""}</td>
                <td>${row.weld_inspected_by || ""}</td>
                <td>${row.weld_date || ""}</td>
                <td>${hasFitupEntry ? (fitupRow.querySelector(".remarks-dropdown")?.value || fitupRow.querySelector(".remarks-others-input")?.value || "None") : ""}</td>
                <td>${row.status || ""}</td>

                <td class="text-center">
                    <i class="bi bi-check-circle-fill createweld-btn
                    ${(isCompleted && !isGeethan) || fitupBlocksWelding ? "d-none" : ""}"
                    title="Create"
                     style="cursor:pointer; font-size:18px; color:#0d6efd;">
                </i>
                </td>
            `;

            const balanceInput = tr.querySelector(".weld-balanced");
            balanceInput.value = Math.max(totalQty - inspectedQty, 0);

            const markCell = tr.querySelector(".mark-cell");

            if (isCompleted && !isGeethan) {
                markCell.style.pointerEvents = "none";
                markCell.style.color = "black";
                markCell.style.fontWeight = "normal";
                tr.querySelectorAll("input, select").forEach(el => el.disabled = true);
            }

            tbody.appendChild(tr);
        });
    })
    .catch(err => {
        console.error(err);
        showModalPopup("Error fetching welder list");
    });
}

function setDefaultWeldDropdowns(tr) {

    const weld = tr.querySelector('select[data-type="weld-visual"]');
    const ut = tr.querySelector('select[data-type="ut"]');
    const rework = tr.querySelector('select[data-type="rework"]');

    if (weld && !weld.value) {
        weld.value = "Satisfactory";
    }

    if (ut && !ut.value) {
        ut.value = "None";
    }

    if (rework && !rework.value) {
        rework.value = "None";
    }
}

/* =========================================================================
   UNIFIED CREATE HANDLER for the merged Fit-Up / Loose-Item table.
   Reads row.dataset.inspectionType to decide which payload shape to build
   and which table the controller should write to. Both branches POST to the
   same /jssl/qc/inspection/create endpoint; the controller auto-routes based
   on payload.inspection_type / payload.piece_descr.
   ========================================================================= */
   document.addEventListener("click", function (e) {

       if (!e.target.classList.contains("create-btn")) return;
       e.preventDefault();

       const row = e.target.closest("tr");
       if (!row) return;

       submitFitUpRow(row);
   });

   function submitFitUpRow(row) {
       const fabDropdown = row.querySelector(".fabricator-dropdown");
       if (!fabDropdown || !fabDropdown.value || fabDropdown.value === "Select") {
           showModalPopup("Please select Fabricator ID!");
           return;
       }
       const fabCode = fabDropdown.value;
       const revision = row.querySelector(".revision-dropdown")?.value || "0";

       const fitupInspectedInput = row.querySelector(".fitup-inspected");
       const fitupBalancedInput = row.querySelector(".fitup-balanced");

       if (!fitupInspectedInput || !fitupBalancedInput) {
           showModalPopup("Row is missing required fields. Please refresh and try again.");
           return;
       }

       const inputs = row.querySelectorAll("input");

       // Qty entered THIS session (delta), not the cumulative total
       const newEntryQty = parseInt(fitupInspectedInput.value || 0, 10);

       const buckling     = inputs[2]?.value || "0";
       const camber       = inputs[3]?.value || "0";
       const fitupBalance = inputs[4]?.value || "NA";

       const selects = row.querySelectorAll("select");

       const remarksOthersInput = row.querySelector(".remarks-others-input");
       const remarksSelect = row.querySelector(".remarks-dropdown");

       let remarks;
       if (remarksOthersInput && remarksOthersInput.style.display !== "none") {
           remarks = remarksOthersInput.value.trim() || "NA";
       } else if (remarksSelect) {
           remarks = remarksSelect.value || "NA";
       } else {
           remarks = "NA";
       }

       // NOTE: selects[2] was previously used positionally for "rework", but that
       // index shifts depending on whether the remarks <select> exists (custom
       // remarks replace it with a plain <input>, changing the select count).
       // Safer to select rework explicitly. If you don't yet have a class on the
       // rework <select>, add class="rework-dropdown" to it in bindFitUpRow.
       const reworkSelect = row.querySelector(".rework-dropdown") || selects[selects.length - 2];
       const rework = reworkSelect?.value || "NA";

       const markCell = row.querySelector(".mark-cell");
       if (!markCell) {
           showModalPopup("Row is missing Mark information. Please refresh and try again.");
           return;
       }
       const mark = markCell.innerText.trim();

       const contractId = document.getElementById("Contract").value;
       const phase = document.getElementById("Phase").value;
       const loadId = document.getElementById("Load").value;

       if (!contractId || !phase || !loadId) {
           showModalPopup("Contract, Phase, and Load must be selected before submitting.");
           return;
       }

       // Total qty for this row (Qty column)
       /*const totalQty = parseInt(row.cells[5]?.innerText || 0, 10);

       // Cumulative already-inspected qty from previous submits (stored on the row)
       const alreadyInspected = parseInt(row.dataset.cumulativeInspected ?? 0, 10);

       // Guard: don't let a stray value push cumulative past totalQty
       const cumulativeInspected = Math.min(alreadyInspected + newEntryQty, totalQty);

       const balancedQty = Math.max(totalQty - cumulativeInspected, 0);

       const result = "Accepted";
       const status = (balancedQty === 0 && (rework === "Rework clrd" || rework === "None"))
           ? "Completed"
           : "Incomplete";
*/
// Total qty for this row
const totalQty = parseInt(row.dataset.totalQty ?? row.cells[5]?.innerText ?? 0, 10);

// Cumulative already inspected from previous submits
const alreadyInspected = parseInt(row.dataset.cumulativeInspected ?? 0, 10);

const cumulativeInspected = Math.min(alreadyInspected + newEntryQty, totalQty);
const balancedQty = Math.max(totalQty - cumulativeInspected, 0);

const result = "Accepted";

let status;
if (balancedQty === 0 && (rework === "Rework clrd" || rework === "None")) {
    status = "Completed";
} else if (cumulativeInspected > 0 && balancedQty > 0) {
    status = "Partial Complete";     // <-- new status
} else {
    status = "Incomplete";
}
       const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

	   const payload = {
	       contract_id: contractId,
	       factory_id: selectedFactoryId,
	       phase: phase,
	       load_id: loadId,
	       mark,
	       fab_code: fabCode,
	       fitup_inspected_qty: newEntryQty,      // CHANGED: send only this session's delta (2), not cumulative (7)
	       fitup_balanced_qty: balancedQty,       // balance still computed from cumulative — unchanged
	       buckling,
	       camber,
	       fitup_balance: fitupBalance,
	       remarks,
	       rework,
	       revision,
	       result,
	       status,
	       created_by: createdById,
	       date: currentDateTime
	   };

       fetch(new URL("/jssl/qc/inspection/create", baseUrl1), {
           method: "POST",
           credentials: "include",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(payload)
       })
       .then(res => {
           return res.text().then(text => {
               let data;
               try {
                   data = text ? JSON.parse(text) : {};
               } catch (parseErr) {
                   console.error("Non-JSON response from server:", text);
                   throw new Error(`Server returned invalid response (status ${res.status})`);
               }

               if (!res.ok) {
                   console.error(`Server error (status ${res.status}):`, data);
                   throw new Error(data.error || `Server error (status ${res.status})`);
               }

               return data;
           });
       })
	   .then(data => {
	       if (data.success) {
	           row.dataset.currentBalance = balancedQty;
	           row.dataset.cumulativeInspected = cumulativeInspected;

	           // Show the TRUE cumulative total inspected so far in the visible field
	           fitupInspectedInput.value = cumulativeInspected;
	           fitupBalancedInput.value = balancedQty;
               const markKey = `${payload.mark}_${payload.phase}_${payload.load_id}`;
               submittedMarks.add(markKey);

               lockRowUI(row, "create-btn", payload.status);

               const revDropdown = row.querySelector(".revision-dropdown");
               if (revDropdown) {
                   revDropdown.value = revision;
               }

               const resultCell = row.querySelector(".result-cell");
               const enteredByCell = row.querySelector(".entered-by-cell");
               const enteredDateCell = row.querySelector(".entered-date-cell");
               const statusCell = row.querySelector(".status-cell");

               if (resultCell) resultCell.innerText = payload.result;
               if (enteredByCell) enteredByCell.innerText = "Entered by: " + createdById;
               if (enteredDateCell) enteredDateCell.innerText = "Entered date: " + payload.date;
               if (statusCell) statusCell.innerText = payload.status; // now shows "Partial Complete"

               showPopup(
                   data.operation === "update"
                       ? "Inspection updated successfully!"
                       : "Inspection created successfully!"
               );
           } else {
               showModalPopup(data.error || "Failed to create/update inspection");
           }
       })
       .catch(err => {
           console.error("submitFitUpRow error:", err);
           showModalPopup(err.message || "Server error occurred while creating/updating inspection");
       });
   }

function submitLooseItemRow(row) {

    const inspectedQtyInput = row.querySelector(".looseiteminspected-qty");
    const inspectedQty = parseInt(inspectedQtyInput?.value || "0", 10);

    const totalQty = parseInt(row.cells[5]?.innerText || "0", 10);
    const balancedQty = Math.max(totalQty - inspectedQty, 0);

    const selects = row.querySelectorAll("select");
    const dimensionalText = selects[0]?.selectedOptions[0]?.text || "NA";
    const visualText = selects[1]?.selectedOptions[0]?.text || "NA";

    const mark = row.querySelector(".mark-cell").innerText.trim();

    const payload = {
        inspection_type: "LOOSE",
        piece_descr: row.dataset.pieceDescr || "",
        contract_id: document.getElementById("Contract").value,
        factory_id: selectedFactoryId,
        phase: document.getElementById("Phase").value,
        load_id: document.getElementById("Load").value,
        mark,
        inspected_qty: inspectedQty,
        balanced_qty: balancedQty,
        dimensional_insp: dimensionalText,
        weld_visual: visualText,
        result: "Accepted",
        status: balancedQty === 0 ? "Completed" : "Incomplete",
        created_by: createdById
    };

    fetch(new URL("/jssl/qc/inspection/create", baseUrl1), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {

        if (data.success) {

            lockRowUI(row, "create-btn", payload.status);

            row.cells[21].innerText = payload.result;
            row.cells[22].innerText = "Entered by: " + createdById;
            row.cells[23].innerText =
                "Entered date: " + new Date().toISOString().slice(0,19).replace("T"," ");
            row.cells[24].innerText = payload.status || "Completed";

            showPopup(
                data.operation === "update"
                    ? "Loose Item inspection updated successfully!"
                    : "Loose Item inspection created successfully!"
            );
        } else {
            showModalPopup(data.error || "Failed to create loose item inspection");
        }
    })
    .catch(() => {
        showModalPopup("Server error occurred");
    });
}

document.addEventListener("input", function (e) {
    if (!e.target.classList.contains("fitup-inspected")) return;

    const row = e.target.closest("tr");
    const totalQty = parseInt(row.dataset.totalQty ?? row.cells[5].innerText) || 0;
    const balanceInput = row.querySelector(".fitup-balanced");

    const remainingBefore = parseInt(row.dataset.currentBalance ?? totalQty);

    let newEntry = parseInt(e.target.value) || 0;

    if (newEntry > remainingBefore) {
        showModalPopup(`Inspected quantity cannot exceed remaining balance (${remainingBefore})`);
        newEntry = remainingBefore;
        e.target.value = remainingBefore;
    }

    const newBalance = Math.max(remainingBefore - newEntry, 0);
    balanceInput.value = newBalance;
});

document.addEventListener("input", function (e) {

    if (!e.target.classList.contains("looseiteminspected-qty")) return;

    const row = e.target.closest("tr");
    if (!row) return;

    const totalQty = parseInt(row.cells[5].innerText) || 0; // Qty column
    let inspectedQty = parseInt(e.target.value) || 0;

    const balanceInput = row.querySelector(".loose-balanced");

    if (inspectedQty > totalQty) {
        showModalPopup("Inspected quantity cannot exceed total quantity");
        e.target.value = totalQty;
        if (balanceInput) balanceInput.value = 0;
        return;
    }

    let balance = totalQty - inspectedQty;
    if (balance < 0) balance = 0;

    if (balanceInput) balanceInput.value = balance;
});

document.addEventListener("click", function (e) {

    if (e.target.classList.contains("createweld-btn")) {
        e.preventDefault();

        const row = e.target.closest("tr");
        if (!row) return;

        const fitupStatus = row.dataset.fitupStatus;
        if (fitupStatus === "Incomplete" || !fitupStatus) {
            showModalPopup("Fit-Up inspection is Incomplete. Welding not allowed until Fit-Up has at least partial inspection.");
            return;
        }

        const weldDropdown = row.querySelector(".welder-dropdown");
        if (!weldDropdown || !weldDropdown.value || weldDropdown.value === "Select") {
            showModalPopup("Please select Welder ID!");
            return;
        }

        const invalidLength = row.querySelector(".length-input.is-invalid");
        if (invalidLength) {
            showModalPopup("Length must be within ±3 of original length");
            invalidLength.focus();
            return;
        }

        setDefaultWeldDropdowns(row);

        const welder_ID = weldDropdown.value || null;

        const weldVisualSelect = row.querySelector('select[data-type="weld-visual"]');
        const weld_visual = weldVisualSelect ? weldVisualSelect.value : "Satisfactory";

        const utSelect = row.querySelector('select[data-type="ut"]');
        const ut = utSelect ? utSelect.value : "None";

        // Only carry Fit-Up remarks when Fit-Up is Partial Complete or Completed
        const fitupAllowsRemarks = fitupStatus === "Partial Complete" || fitupStatus === "Completed";
		const remarks = fitupAllowsRemarks
		    ? (row.cells[21]?.innerText.trim() || "None")
		    : "None";

        const reworkSelect = row.querySelector('select[data-type="rework"]');
        const rework = reworkSelect ? reworkSelect.value : "None";

        const inputs = row.querySelectorAll("input");

        const totalQty = parseInt(row.dataset.totalQty ?? row.cells[5]?.innerText ?? 0, 10);
        const allowedMax = parseInt(row.dataset.fitupAllowedMax ?? totalQty, 10);

        // This session's entry (delta), same pattern as fit-up
        const newEntryQty = parseInt(row.querySelector(".weld-inspected").value || 0, 10);

        // Cumulative already-welded qty from previous submits
        const alreadyWelded = parseInt(row.dataset.weldCumulative ?? 0, 10);

        const cumulativeWelded = Math.min(alreadyWelded + newEntryQty, allowedMax);
        const weldBalancedQty = Math.max(totalQty - cumulativeWelded, 0);

        const weld_buckling = inputs[2]?.value || null;
        const weld_camber   = inputs[3]?.value || null;
        const length        = row.querySelector(".length-input")?.value || null;
        const sweep         = inputs[5]?.value || null;

        const mark = row.querySelector(".mark-cell").innerText.trim();

        const result = "Accepted";

        let status;
        if (weldBalancedQty === 0 && cumulativeWelded === totalQty && (rework === "Rework clrd" || rework === "None")) {
            status = "Completed";
        } else if (cumulativeWelded > 0 && weldBalancedQty > 0) {
            status = "Partial Complete";
        } else {
            status = "Incomplete";
        }

        const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

		const payload = {
		    contract_id: document.getElementById("Contract").value,
		    factory_id: selectedFactoryId,
		    phase: document.getElementById("Phase").value,
		    load_id: document.getElementById("Load").value,
		    mark,
		    total_qty: totalQty,          // needed for balance math server-side
		    welder_ID,
		    weld_inspected_qty: newEntryQty,   // CHANGED: send only this session's delta
		    weld_balanced_qty: weldBalancedQty,
		    weld_camber,
		    weld_buckling,
		    length,
		    sweep,
		    ut,
		    weld_visual,
		    remarks,
		    rework,
		    result,
		    status,
		    created_by: createdById,
		    date: currentDateTime
		};

        fetch(new URL("/jssl/qc/inspection/weld/create", baseUrl1), {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                row.dataset.weldCumulative = cumulativeWelded;

                const weldInspectedInput = row.querySelector(".weld-inspected");
                const weldBalancedInput = row.querySelector(".weld-balanced");

                if (weldInspectedInput) weldInspectedInput.value = cumulativeWelded;
                if (weldBalancedInput) weldBalancedInput.value = weldBalancedQty;
				row.dataset.currentBalance = weldBalancedQty;

                lockRowUI(row, "createweld-btn", payload.status);

				row.cells[18].innerText = payload.result;
				row.cells[19].innerText = "Entered by: " + createdById;
				row.cells[20].innerText = "Entered date: " + payload.date;
				row.cells[22].innerText = payload.status;
                showPopup(
                    data.operation === "update"
                        ? "Weld Inspection updated successfully!"
                        : "Weld Inspection created successfully!"
                );
            } else {
                showModalPopup(data.error || "Failed to create welding inspection");
            }
        })
        .catch(err => {
            console.error(err);
            showModalPopup("Server error occurred while creating welding inspection");
        });
    }
});

document.addEventListener("input", function (e) {
    if (!e.target.classList.contains("weld-inspected")) return;

    const row = e.target.closest("tr");
    const totalQty = parseInt(row.dataset.totalQty ?? row.cells[5].innerText) || 0;
    const balanceInput = row.querySelector(".weld-balanced");

    const remainingBefore = parseInt(row.dataset.currentBalance ?? totalQty);

    let newEntry = parseInt(e.target.value) || 0;

    if (newEntry > remainingBefore) {
        showModalPopup(`Inspected quantity cannot exceed remaining balance (${remainingBefore})`);
        newEntry = remainingBefore;
        e.target.value = remainingBefore;
    }

    const newBalance = Math.max(remainingBefore - newEntry, 0);
    balanceInput.value = newBalance;
});

function showPopup(message, redirectUrl) {
    var popup = $('<div class="popup">' + message + '</div>')
        .appendTo('body')
        .hide()
        .fadeIn(400);

    setTimeout(function () {
        popup.fadeOut(400, function () {
            $(this).remove();

            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        });
    }, 2000);
}

function validateFitUpOnMark(row, successCallback) {

    const mark = row.querySelector(".mark-cell").innerText.trim();

    fetch(new URL("/jssl/qc/inspection/validate-fitup-on-mark", baseUrl1), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            factory_id: selectedFactoryId,
            contract_id: document.getElementById("Contract").value,
            phase: document.getElementById("Phase").value,
            load_id: document.getElementById("Load").value,
            mark: mark
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            showModalPopup(data.error);
            return;
        }

        successCallback();
    })
    .catch(err => {
        console.error(err);
        showModalPopup("Validation failed");
    });
}

function lockRowUI(row, createBtnClass = "create-btn", status = "Completed") {

    if (isGeethan) return;
    if (status !== "Completed") return;

    row.querySelectorAll("input, select, button").forEach(el => {
        el.disabled = true;
        el.classList.remove("hidden-input");
        // removed the forced display:block — let existing show/hide state (e.g. remarks toggle) stand
    });

    const btn = row.querySelector(`.${createBtnClass}`);
    if (btn) btn.classList.add("d-none");

    const markCell = row.querySelector(".mark-cell");
    if (markCell) {
        markCell.style.pointerEvents = "none";
        markCell.style.color = "black";
        markCell.style.fontWeight = "normal";
    }

    row.classList.add("row-locked");
}

function toggleRowOthers(select) {
    const row = select.closest("tr");
    const othersInput = row.querySelector(".remarks-others-input");
    if (!othersInput) return;

    if (select.value === "Others") {
        select.style.display = "none";
        othersInput.style.display = "block";
        othersInput.focus();
    } else {
        othersInput.style.display = "none";
        othersInput.value = "";
        select.style.display = "";
    }
}