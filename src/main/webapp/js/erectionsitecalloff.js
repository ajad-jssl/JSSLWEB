/* =====================================================================
   Erection Site Call Off
   Table (server-side paging) + one modal used for Create and Update
===================================================================== */

const API_BASE = "/api/erection-calloff";
const API_ROOT = baseUrl;

// existing contracts API: { Data: [{ contract_id, contract_name }] }
const CONTRACT_API_PATH = "/jssl/g2/loadreport/contracts";
const CONTRACT_API_ROOT = baseUrl;   // change to baseUrl1 if that API lives on the other server

// load dropdown API (our own, see controller) -> { Data: [{ load_id, load_source, load_name, load_label }] }
// loads of the two plants (Bly = misDataSource, Guj = misDataSource2) are combined by the backend
// load_name = pload of mis.dbo.Loads; only loads that still have a piece with tload_id = 0 are returned
// to use another API, change this path / root and the field names in parseLoads()
const LOAD_API_PATH = API_BASE + "/loads";
const LOAD_API_ROOT = API_ROOT;

const currentFactoryId = parseInt(sessionStorage.getItem("selectedFactoryId"), 10);
const LoggedUser = sessionStorage.getItem("id") ;

let contractMap = {};     // contract_id -> contract_name
let editingId = null;     // null = create mode, number = update mode
let pendingPayload = null;
let originalDate = null;   // date already saved on the call off being edited (null on create)

/* ---------------- helpers ---------------- */
function $id(id) { return document.getElementById(id); }

function esc(s) {
    return String(s === null || s === undefined ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function apiUrl(path) {
    return new URL(API_BASE + path, API_ROOT);
}

function showMessage(msg) {
    $id("modalMessage").textContent = msg;
    $("#messageModal").modal("show");
}

function showPopup(msg) {
    const p = document.createElement("div");
    p.className = "popup";
    p.textContent = msg;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3000);
}

// today as yyyy-MM-dd in the user's own time zone (toISOString would give the UTC date)
function todayStr() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
}

// select2 shows its own box, so it must be told when the <select> changed from code
function refreshSelect2(id) {
    const $el = $("#" + id);
    if ($el.data("select2")) $el.trigger("change.select2");   // updates the box only, our change handlers do not run
}

function setSelectValue(id, value) {
    $id(id).value = value;
    refreshSelect2(id);
}

// searchable dropdowns (type to filter)
function initSelect2() {
    if (!$.fn.select2) {
        console.warn("select2 is not loaded, plain dropdowns are used");
        return;
    }
    ["contractSelect", "loadSelect"].forEach(id => {
        $("#" + id).select2({
            theme: "bootstrap4",
            width: "100%",
            dropdownParent: $("#callOffModal")   // search box must live inside the modal to get focus
        });
    });
}

function parseLoads(data) {
    const list = Array.isArray(data) ? data : (data.Data || data.data || []);
    // loads of both plants are combined: value = "BLY:182435" / "GUJ:182435", text = "L001 (Bly)"
    return list.map(r => ({
        id: r.load_source + ":" + r.load_id,
        name: r.load_label || r.load_name
    }));
}

function setOptions(select, firstText, items) {
    select.innerHTML = "";
    const first = document.createElement("option");
    first.value = "";
    first.textContent = firstText;
    select.appendChild(first);
    items.forEach(it => {
        const o = document.createElement("option");
        o.value = it.id;
        o.textContent = it.name;
        select.appendChild(o);
    });
    refreshSelect2(select.id);
}

/* ---------------- init ---------------- */
document.addEventListener("DOMContentLoaded", function () {

    initSelect2();

    $id("callOffCreate").addEventListener("click", openCreateModal);
    // select2 triggers jQuery events only, so these use jQuery
    $("#contractSelect").on("change", onContractChange);
    $id("saveButton").addEventListener("click", onSaveClick);
    $id("confirmSaveYes").addEventListener("click", saveCallOff);

    // clear an error as soon as the user fixes the field
    ["contractSelect", "loadSelect", "callOffDate"].forEach(id => {
        $("#" + id).on("change input", () => clearFieldError(id));
    });

    // nested modals: closing the small modal must not break scrolling of the main one
    $("#messageModal, #confirmSaveModal").on("hidden.bs.modal", function () {
        if ($("#callOffModal").hasClass("show")) $("body").addClass("modal-open");
    });

    // contracts first (the table needs the contract names), then the table
    loadContracts().then(loadCallOffTable);
});

/* =============================
   DROPDOWNS
============================= */
function loadContracts() {

    const url = new URL(CONTRACT_API_PATH, CONTRACT_API_ROOT);
    if (!isNaN(currentFactoryId)) url.searchParams.set("factory", currentFactoryId);

    return fetch(url, { method: "GET", credentials: "include" })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        const list = Array.isArray(data) ? data : (data.Data || []);
        contractMap = {};
        list.forEach(c => { contractMap[String(c.contract_id)] = c.contract_name; });

        setOptions($id("contractSelect"), "-- Select Contract --",
            list.map(c => ({ id: c.contract_id, name: c.contract_name })));
    })
    .catch(err => {
        console.error("Contract load error:", err);
        showMessage("Unable to load contracts. Please try again.");
    });
}

// loads of one contract -> fills the Load dropdown
function loadLoadsForContract(contractId) {

    const select = $id("loadSelect");
    setOptions(select, "-- Select Load --", []);

    if (!contractId) {
        select.disabled = true;
        return Promise.resolve();
    }

    const url = new URL(LOAD_API_PATH, LOAD_API_ROOT);
    url.searchParams.set("contractId", contractId);
    // editing: keep the load already saved on this call off in the list
    if (editingId !== null) url.searchParams.set("callOffId", editingId);

    return fetch(url, { method: "GET", credentials: "include" })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        const loads = parseLoads(data);
        setOptions(select, loads.length ? "-- Select Load --" : "-- No loads available --", loads);
        select.disabled = false;
        // one of the two plants could not be read: the other one is still shown
        if (data.warnings && data.warnings.length) showMessage(data.warnings.join(" "));
    })
    .catch(err => {
        console.error("Load list error:", err);
        select.disabled = false;
        showMessage("Unable to load the loads for this contract. Please try again.");
    });
}

function onContractChange() {
    loadLoadsForContract($id("contractSelect").value);
}

/* =============================
   TABLE (server-side paging, same style as RGP Request)
============================= */
function loadCallOffTable() {

    if ($.fn.DataTable.isDataTable('#tableID2')) {
        $('#tableID2').DataTable().clear().destroy();
    }

    $('#tableID2').DataTable({
        processing: true,
        serverSide: true,
        scrollX: true,
        searching: true,
        ordering: false,
        pageLength: 10,

        dom:
            "<'row mb-2'<'col-sm-12 text-right'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row mt-2 align-items-center'<'col-sm-6'i><'col-sm-6 d-flex justify-content-end'p>>",

        columns: [
            { title: "Sl.No" },
            { title: "Code" },
            { title: "Contract" },
            { title: "Load" },
            { title: "Date" },
            { title: "Remarks" },
            { title: "Edit" }
        ],

        ajax: function (data, callback) {

            const page = data.start / data.length;
            const size = data.length;

            const url = apiUrl("/paging");
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
            url.searchParams.append('search', data.search.value);

            fetch(url, { credentials: "include" })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(json => {

                let slNo = data.start + 1;

                const rows = (json.data || []).map(item => {

                    const editIcon =
                        `<i class="fa fa-pen"
                            style="color:blue;cursor:pointer;"
                            onclick="editCallOff(${item.id})"
                            title="Edit"></i>`;

                    return [
                        slNo++,
                        esc(item.code),
                        esc(contractMap[String(item.contract_id)] || ("Contract #" + item.contract_id)),
                        esc(item.load_label || ("Load #" + item.load_id)),
                        esc(item.call_off_date),
                        esc(item.remarks),
                        editIcon
                    ];
                });

                callback({
                    draw: data.draw,
                    recordsTotal: json.totalRecords || 0,
                    recordsFiltered: json.totalItems || 0,
                    data: rows
                });
            })
            .catch(error => {
                console.error('Error fetching call offs:', error);
                callback({ draw: data.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
            });
        }
    });
}

function reloadTable(keepPage) {
    if ($.fn.DataTable.isDataTable('#tableID2')) {
        $('#tableID2').DataTable().ajax.reload(null, !keepPage);
    }
}

/* =============================
   MODAL (create / update)
============================= */
function clearFieldError(id) {
    $id(id).classList.remove("field-error");
    const err = $id(id + "Error");
    if (err) err.style.display = "none";
}

function clearAllErrors() {
    ["contractSelect", "loadSelect", "callOffDate"].forEach(clearFieldError);
}

function resetForm() {
    clearAllErrors();
    setSelectValue("contractSelect", "");
    setOptions($id("loadSelect"), "-- Select Load --", []);
    $id("loadSelect").disabled = true;
    $id("callOffDate").value = "";
    $id("callOffDate").min = todayStr();   // no past dates
    $id("callOffDateError").textContent = "Date is required";
    $id("remarks").value = "";
    $id("callOffCode").value = "";
}

function setMode(updateMode) {
    $id("codeRow").style.display = updateMode ? "flex" : "none";
    $id("callOffModalTitle").textContent = updateMode ? "Update Erection Site Call Off" : "Erection Site Call Off";
    $id("saveButton").textContent = updateMode ? "Update" : "Create";
    $id("confirmSaveText").textContent = updateMode
        ? "Are you sure you want to Update?"
        : "Are you sure you want to Create?";
}

function openCreateModal() {
    editingId = null;
    originalDate = null;
    resetForm();
    setMode(false);
    $("#callOffModal").modal("show");
}

// called from the Edit icon in the table
function editCallOff(id) {

    fetch(apiUrl("/" + id), { method: "GET", credentials: "include" })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `HTTP error! Status: ${res.status}`);
        return data;
    })
    .then(async row => {
        editingId = Number(row.id);
        originalDate = row.call_off_date || null;   // an old saved date may stay, a new date must not be in the past
        resetForm();
        setMode(true);

        $id("callOffCode").value = row.code || "";
        setSelectValue("contractSelect", String(row.contract_id));
        $id("callOffDate").value = row.call_off_date || "";
        $id("remarks").value = row.remarks || "";

        // load the loads of this contract, then select the saved one
        await loadLoadsForContract(String(row.contract_id));
        const sel = $id("loadSelect");
        const loadKey = row.load_source + ":" + row.load_id;
        if (!Array.from(sel.options).some(o => o.value === loadKey)) {
            const o = document.createElement("option");   // saved load no longer in the list
            o.value = loadKey;
            o.textContent = "Load #" + row.load_id + " (" + row.load_source + ")";
            sel.appendChild(o);
        }
        setSelectValue("loadSelect", loadKey);

        $("#callOffModal").modal("show");
    })
    .catch(err => {
        console.error("Edit load error:", err);
        showMessage(err.message || "Unable to open this call off.");
    });
}

/* =============================
   VALIDATE -> CONFIRM -> SAVE
============================= */
function onSaveClick() {

    clearAllErrors();

    const contractId = $id("contractSelect").value;
    const loadId = $id("loadSelect").value;
    const date = $id("callOffDate").value;
    let ok = true;

    const bad = (id, msg) => {
        $id(id).classList.add("field-error");
        const err = $id(id + "Error");
        if (err) {
            if (msg) err.textContent = msg;
            err.style.display = "block";
        }
        ok = false;
    };

    if (!contractId) bad("contractSelect");
    if (!loadId) bad("loadSelect");
    if (!date) {
        bad("callOffDate", "Date is required");
    } else if (date < todayStr() && date !== originalDate) {
        bad("callOffDate", "Past dates are not allowed");
    }

    if (!ok) return;

    if (isNaN(currentFactoryId)) {
        showMessage("No factory selected.");
        return;
    }

    // dropdown value is "BLY:182435" -> plant + load id
    const loadParts = loadId.split(":");

    pendingPayload = {
        id: editingId,
        factoryId: currentFactoryId,
        contractId: Number(contractId),
        loadSource: loadParts[0],
        loadId: Number(loadParts[1]),
        callOffDate: date,
        remarks: $id("remarks").value.trim(),
        user: LoggedUser
    };

    $("#confirmSaveModal").modal("show");
}

function saveCallOff() {

    if (!pendingPayload) return;

    const isUpdate = editingId !== null;
    const yesBtn = $id("confirmSaveYes");
    const saveBtn = $id("saveButton");
    yesBtn.disabled = true;
    saveBtn.disabled = true;

    fetch(apiUrl(isUpdate ? "/update" : "/save"), {
        method: isUpdate ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingPayload)
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `HTTP error! Status: ${res.status}`);
        return data;
    })
    .then(data => {
        pendingPayload = null;
        $("#confirmSaveModal").modal("hide");
        $("#callOffModal").modal("hide");
        showPopup(data.message || "Saved successfully");
        reloadTable(isUpdate);   // update: stay on the same page, create: go to page 1
    })
    .catch(err => {
        console.error("Save error:", err);
        const msg = err.message || "Failed to save. Please try again.";
        $("#confirmSaveModal").one("hidden.bs.modal", () => showMessage(msg));
        $("#confirmSaveModal").modal("hide");
    })
    .finally(() => {
        yesBtn.disabled = false;
        saveBtn.disabled = false;
    });
}