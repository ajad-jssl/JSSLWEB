/* =====================================================================
   Contract Part Entry  (server-side paging + search + Excel import)
   Flow: Create -> select Contract -> saved parts load page by page
         -> edit / delete / add -> Save -> POST only the changes
         -> Import Excel Data -> choose file -> Skip / Override -> Import
   Needs: SheetJS (xlsx.full.min.js) loaded BEFORE this file
===================================================================== */

const API_BASE = "/api/contract-part";
const CONTRACT_LIST_PATH = "/api/drawingentry/contractlist";   // existing API: { Data: [{ contract_id, jobCode }] }
const API_ROOT = baseUrl;   // change to baseUrl1 if this API lives on the other server
const LoggedUser = sessionStorage.getItem("id") || sessionStorage.getItem("id") || "";

let contracts = [];          // [{ id, name }]
let pendingPayload = null;   // built after validation, sent after confirmation

/* ---- modal state ---- */
let pageRows = [];           // saved rows of the current page, exactly as the server sent them
let total = 0;               // rows matching the search
let totalAll = 0;            // all saved rows of the contract
let currentPage = 1;
let pageSize = 10;
let searchText = "";

const edits = new Map();     // id -> { mark, name, page }   (only rows that really changed)
const errs = new Map();      // id -> { mark, name }         (validation textLos
const deleted = new Set();   // ids marked for delete
let newRows = [];            // [{ key, mark, name, errMark, errName }]

let loadSeq = 0;             // ignore out-of-date responses
let newSeq = 0;
let firstLoadDone = false;
let searchTimer = null;

let importParts = [];        // [{ mark, name }] cleaned rows read from the Excel file



/* ---- main list paging ---- */
let listPage = 1;
let listSize = 10;
let listTotal = 0;
let listSeq = 0;

$id("importUnlock").checked = false;


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

function showError(msg) {
    $id("customErrorMessage").textContent = msg;
    $("#customErrorModal").modal("show");
}

function showPopup(msg) {
    const p = document.createElement("div");
    p.className = "popup";
    p.textContent = msg;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3000);
}

function selectedContract() {
    const id = $id("contractSelect").value;
    if (!id) return null;
    return contracts.find(c => String(c.id) === String(id)) || null;
}

function str(v) { return String(v === null || v === undefined ? "" : v); }

/* ---------------- init ---------------- */
document.addEventListener("DOMContentLoaded", function () {

    loadContracts();

    $id("entry1").addEventListener("click", openCreateModal);
	$id("contractFilter").addEventListener("change", reloadList);

	$id("listPageSize").addEventListener("change", function () {
	    listSize = Number(this.value) || 10;
	    reloadList();
	});

	$id("listPagerList").addEventListener("click", function (e) {
	    const a = e.target.closest("a[data-page]");
	    if (!a) return;
	    e.preventDefault();
	    const li = a.parentElement;
	    if (li.classList.contains("disabled") || li.classList.contains("active")) return;
	    listPage = Number(a.dataset.page);
	    loadList();
	});
    $id("contractSelect").addEventListener("change", onContractChange);
    $id("addRowBtn").addEventListener("click", addNewRow);
    $id("saveButton").addEventListener("click", onSaveClick);
    $id("confirmPartEntryYes").addEventListener("click", savePartEntry);

	$id("confirmUnlockYes").addEventListener("click", runUnlock);
	
    // search -> server (debounced)
    $id("partSearch").addEventListener("input", function () {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            searchText = $id("partSearch").value;
            currentPage = 1;
            loadPage();
        }, 300);
    });

    // page size -> server
    $id("pageSizeSelect").addEventListener("change", function () {
        pageSize = Number(this.value) || 10;
        currentPage = 1;
        loadPage();
    });

    // pager buttons -> server
    $id("pagerList").addEventListener("click", function (e) {
        const a = e.target.closest("a[data-page]");
        if (!a) return;
        e.preventDefault();
        const li = a.parentElement;
        if (li.classList.contains("disabled") || li.classList.contains("active")) return;
        currentPage = Number(a.dataset.page);
        loadPage();
    });

    // saved rows (current page)
    const savedBody = $id("partTableBody");
    savedBody.addEventListener("input", onSavedInput);
    savedBody.addEventListener("click", function (e) {
		const lock = e.target.closest(".unlock-action");
		if (lock) {
		    const tr = lock.closest("tr");
		    const markText = tr.querySelector(".markInput").value;
		    pendingUnlock = { markId: Number(lock.dataset.id), mark: markText };
		    $id("confirmUnlockText").textContent = `Are you sure you want to unlock part mark ${markText}?`;
		    $("#confirmUnlockModal").modal("show");
		    return;
		}
        const icon = e.target.closest(".row-action");
        if (!icon) return;
        const id = Number(icon.closest("tr").dataset.id);
        if (deleted.has(id)) deleted.delete(id); else deleted.add(id);
        renderSaved();
        updateTotals();
		
		
    });

    // new rows
    const newBody = $id("partNewBody");
    newBody.addEventListener("input", onNewInput);
    newBody.addEventListener("click", function (e) {
        const icon = e.target.closest(".row-action");
        if (!icon) return;
        const key = icon.closest("tr").dataset.key;
        newRows = newRows.filter(n => String(n.key) !== String(key));
        renderNew();
        updateTotals();
    });
    // Enter in the Name box of the last new row = add the next new row
    newBody.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" || !e.target.classList.contains("nameInput")) return;
        e.preventDefault();
        const last = newRows[newRows.length - 1];
        if (last && String(last.key) === e.target.closest("tr").dataset.key) addNewRow();
    });

    // nested modals: closing the small modal must not break scrolling of the main one
/*    $("#customErrorModal, #confirmPartEntry").on("hidden.bs.modal", function () {
        if ($("#partEntryModal").hasClass("show")) $("body").addClass("modal-open");
    });*/
	
	
	$("#customErrorModal, #confirmPartEntry, #confirmUnlockModal").on("hidden.bs.modal", function () {
	    if ($("#partEntryModal").hasClass("show")) $("body").addClass("modal-open");
	});
});

/* =============================
   CONTRACT DROPDOWNS
============================= */
function loadContracts() {

    fetch(new URL(CONTRACT_LIST_PATH, API_ROOT), { method: "GET", credentials: "include" })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        const list = Array.isArray(data) ? data : (data.Data || []);

        // "Indirect" is a time-sheet bucket, not a real contract
        contracts = list
            .filter(r => String(r.jobCode || "").trim().toLowerCase() !== "indirect")
            .map(r => ({ id: r.contract_id, name: r.jobCode }));

        ["contractFilter", "contractSelect"].forEach(id => {
            const ddl = $id(id);
            const first = ddl.options[0].outerHTML;
            ddl.innerHTML = first;
            contracts.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.textContent = c.name;
                ddl.appendChild(opt);
            });
        });
    })
    .catch(err => {
        console.error("Contract load error:", err);
        showError("Unable to load contracts. Please try again.");
    });
}

/* =============================
   LIST (saved parts, main page - unchanged)
============================= */
/*function loadList() {

    const contractId = $id("contractFilter").value;
    const body = $id("partListBody");
    const foot = $id("partListFoot");
    foot.innerHTML = "";

    if (!contractId) {
        body.innerHTML = `<tr><td colspan="4">Select a contract to view its parts.</td></tr>`;
        return;
    }

    const url = apiUrl("/list");
    url.searchParams.set("contractId", contractId);

    fetch(url, { method: "GET", credentials: "include" })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(rows => {
        rows = rows || [];
        if (!rows.length) {
            body.innerHTML = `<tr><td colspan="4">No parts entered for this contract.</td></tr>`;
            return;
        }

        body.innerHTML = rows.map((r, i) => {
            return `<tr>
                <td>${i + 1}</td>
                <td>${esc(r.contract_no)}</td>
                <td>${esc(r.mark)}</td>
                <td class="left">${esc(r.name)}</td>
            </tr>`;
        }).join("");

        foot.innerHTML = `<tr><td colspan="4" style="text-align:right;">Total Parts: ${rows.length}</td></tr>`;
    })
    .catch(err => {
        console.error("List load error:", err);
        body.innerHTML = `<tr><td colspan="4">Failed to load parts.</td></tr>`;
    });
}
*/


/* =============================
   LIST (saved parts, main page - server-side paging)
============================= */
function reloadList() {          // go back to page 1 (contract changed / after save / import)
    listPage = 1;
    loadList();
}

function pagerHtml(current, totalPages) {
    const pages = [];
    for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || Math.abs(p - current) <= 2) pages.push(p);
    }

    const item = (label, page, disabled, active) =>
        `<li class="page-item${disabled ? " disabled" : ""}${active ? " active" : ""}">
            <a class="page-link" href="#" data-page="${page}">${label}</a></li>`;

    let html = item("&laquo;", current - 1, current === 1, false);
    let prev = 0;
    pages.forEach(p => {
        if (p - prev > 1) html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        html += item(p, p, false, p === current);
        prev = p;
    });
    html += item("&raquo;", current + 1, current === totalPages, false);
    return html;
}

function loadList() {

    const sel = $id("contractFilter");
    const contractId = sel.value;
    const body = $id("partListBody");
    const foot = $id("partListFoot");
    const info = $id("listPagerInfo");
    const pager = $id("listPagerList");

    foot.innerHTML = "";
    info.textContent = "";
    pager.innerHTML = "";

    if (!contractId) {
        body.innerHTML = `<tr><td colspan="4">Select a contract to view its parts.</td></tr>`;
        return;
    }

    const contractNo = sel.options[sel.selectedIndex].textContent;
    const seq = ++listSeq;
    body.innerHTML = `<tr><td colspan="4">Loading...</td></tr>`;

    const url = apiUrl("/list-page");
    url.searchParams.set("contractId", contractId);
    url.searchParams.set("page", listPage);
    url.searchParams.set("size", listSize);

    fetch(url, { method: "GET", credentials: "include" })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        if (seq !== listSeq) return;          // contract / page changed meanwhile

        const rows = data.rows || [];
        listTotal = Number(data.total) || 0;
        const totalPages = Math.max(1, Math.ceil(listTotal / listSize));

        // page no longer exists (e.g. page size changed) -> go to the last page
        if (!rows.length && listTotal > 0 && listPage > totalPages) {
            listPage = totalPages;
            loadList();
            return;
        }

        if (!listTotal) {
            body.innerHTML = `<tr><td colspan="4">No parts entered for this contract.</td></tr>`;
            return;
        }

        const offset = (listPage - 1) * listSize;

        body.innerHTML = rows.map((r, i) => {
            return `<tr>
                <td>${offset + i + 1}</td>
                <td>${esc(contractNo)}</td>
                <td>${esc(r.mark)}</td>
                <td class="left">${esc(r.name)}</td>
            </tr>`;
        }).join("");

        foot.innerHTML = `<tr><td colspan="4" style="text-align:right;">Total Parts: ${listTotal}</td></tr>`;
        info.textContent = `Showing ${offset + 1}-${offset + rows.length} of ${listTotal}`;
        pager.innerHTML = pagerHtml(listPage, totalPages);
    })
    .catch(err => {
        if (seq !== listSeq) return;
        console.error("List load error:", err);
        body.innerHTML = `<tr><td colspan="4">Failed to load parts.</td></tr>`;
    });
}
/* =============================
   CREATE / EDIT MODAL
============================= */
function resetModalState() {
    loadSeq++;                       // drop any request still running
    pageRows = [];
    total = 0;
    totalAll = 0;
    currentPage = 1;
    searchText = "";
    firstLoadDone = false;
    edits.clear();
    errs.clear();
    deleted.clear();
    newRows = [];
    $id("partSearch").value = "";
}

function openCreateModal() {
    $id("contractSelect").value = "";
    $id("partEntryContainer").style.display = "none";
    clearContractError();
    resetModalState();
    renderAll();
    $("#partEntryModal").modal("show");
}

function clearContractError() {
    $id("contractSelect").classList.remove("field-error");
    $id("contractSelectError").style.display = "none";
}

function onContractChange() {

    clearContractError();
    resetModalState();
    renderAll();

    const contract = selectedContract();
    if (!contract) {
        $id("partEntryContainer").style.display = "none";
        return;
    }

    $id("partEntryContainer").style.display = "block";
    loadPage();
}

/* ---- ask the server for ONE page ---- */
function loadPage() {

    const contract = selectedContract();
    if (!contract) return;

    const seq = ++loadSeq;
    $id("partTableBody").innerHTML = `<tr><td colspan="5" class="text-center">Loading...</td></tr>`;

    const url = apiUrl("/list-page");
    url.searchParams.set("contractId", contract.id);
    url.searchParams.set("page", currentPage);
    url.searchParams.set("size", pageSize);
    if (searchText.trim()) url.searchParams.set("search", searchText.trim());

    fetch(url, { method: "GET", credentials: "include" })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        if (seq !== loadSeq) return;     // contract / page changed meanwhile

        pageRows = data.rows || [];
        total = Number(data.total) || 0;
        totalAll = Number(data.totalAll) || 0;

        // page no longer exists (e.g. page size changed) -> go to the last page
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (!pageRows.length && total > 0 && currentPage > totalPages) {
            currentPage = totalPages;
            loadPage();
            return;
        }

        // contract with no saved parts: give the user one blank row to start with
        if (!firstLoadDone) {
            firstLoadDone = true;
            if (totalAll === 0 && !newRows.length) newRows.push(makeNew());
        }

        renderAll();
    })
    .catch(err => {
        if (seq !== loadSeq) return;
        console.error("Part load error:", err);
        $id("partTableBody").innerHTML = "";
        showError("Unable to load the saved parts of this contract. Please try again.");
    });
}

/* =============================
   RENDER
============================= */
function renderAll() {
    renderSaved();
    renderNew();
    renderPager();
    updateTotals();
}

function updateTotals() {
    const count = totalAll - deleted.size + newRows.length;
    $id("totalRowsDisplay").textContent = Math.max(0, count);
}

function inputsHtml(mark, name, errMark, errName, disabled) {
    const dis = disabled ? " disabled" : "";
    return `
        <td><input type="text" class="form-control form-control-sm markInput${errMark ? " field-error" : ""}"
                   maxlength="50" placeholder="e.g. 1C1" value="${esc(mark)}"${dis}>
            <small class="cell-error" style="color:red;font-size:12px;text-align:left;display:${errMark ? "block" : "none"};">${esc(errMark)}</small></td>
        <td><input type="text" class="form-control form-control-sm nameInput${errName ? " field-error" : ""}"
                   maxlength="200" placeholder="e.g. BOX_COLUMN" value="${esc(name)}"${dis}>
            <small class="cell-error" style="color:red;font-size:12px;text-align:left;display:${errName ? "block" : "none"};">${esc(errName)}</small></td>`;
}

function contractNoCell() {
    const c = selectedContract();
    return `<td><input type="text" class="form-control form-control-sm readonly-field"
                       value="${esc(c ? c.name : "")}" readonly></td>`;
}

/* saved rows of the current page */
function renderSaved() {
    const body = $id("partTableBody");
    body.innerHTML = "";

    if (!pageRows.length) {
        if (searchText.trim()) {
            body.innerHTML = `<tr><td colspan="5" class="text-center">No part marks match your search.</td></tr>`;
        }
        return;
    }

    const offset = (currentPage - 1) * pageSize;
    const frag = document.createDocumentFragment();

    pageRows.forEach((r, i) => {
        const id = Number(r.id);
        const e = edits.get(id);
        const er = errs.get(id) || {};
        const isDel = deleted.has(id);
		
		
		
		const inUse = Number(r.in_use) === 1;      // used in Drawing Phase Entry -> cannot delete
		const isLocked = Number(r.is_locked) === 1; // Final by checker -> locked

        // To block edit/delete for parts that are already used, disable the inputs
        // and hide the action icon here based on a flag coming from list-page.
        const tr = document.createElement("tr");
        tr.dataset.id = id;
        if (isDel) tr.style.cssText = "text-decoration:line-through;background:#fdecea;";

        tr.innerHTML = `<td>${offset + i + 1}</td>` + contractNoCell() +
            inputsHtml(e ? e.mark : r.mark, e ? e.name : r.name, er.mark, er.name, isDel) +
          
/*			`<td class="text-center">` +
			(isDel
			    ? `<i class="fas fa-undo row-action" title="Undo delete" style="color:#2c7be5;cursor:pointer"></i>`
			    : inUse
			        ? `<i class="fas fa-lock" title="Used in Drawing Phase Entry - cannot delete" style="color:#858796;cursor:not-allowed"></i>`
			        : `<i class="fas fa-trash row-action" title="Delete" style="color:red;cursor:pointer"></i>`) +
			`</td>`;*/
			
			`<td class="text-center" style="white-space:nowrap;">` +
			/*(isLocked
			    ? `<i class="fas fa-lock unlock-action" data-id="${id}" title="Locked (Final) in Drawing Phase Entry" style="color:#e0a800;margin-right:10px;"></i>`
			    : ``) +*/
				
				(isLocked
				    ? `<i class="fas fa-lock unlock-action" data-id="${id}" title="Locked (Final) - click to unlock" style="color:#e0a800;margin-right:10px;cursor:pointer;"></i>`
				    : ``) +
			(isDel
			    ? `<i class="fas fa-undo row-action" title="Undo delete" style="color:#2c7be5;cursor:pointer"></i>`
			    : inUse
			        ? `<i class="fas fa-ban" title="Used in Drawing Phase Entry - cannot delete" style="color:#858796;cursor:not-allowed"></i>`
			        : `<i class="fas fa-trash row-action" title="Delete" style="color:red;cursor:pointer"></i>`) +
			`</td>`;
        frag.appendChild(tr);
    });

    body.appendChild(frag);
}

/* new (not yet saved) rows - always visible, whatever the page / search */
function renderNew() {
    const body = $id("partNewBody");
    body.innerHTML = "";
    if (!newRows.length) return;

    const frag = document.createDocumentFragment();

    const head = document.createElement("tr");
    head.innerHTML = `<td colspan="5" style="background:#fff8e1;text-align:left;font-weight:600;">
        New parts (not saved yet)</td>`;
    frag.appendChild(head);

    newRows.forEach((n, i) => {
        const tr = document.createElement("tr");
        tr.dataset.key = n.key;
        tr.innerHTML = `<td>${totalAll + i + 1}</td>` + contractNoCell() +
            inputsHtml(n.mark, n.name, n.errMark, n.errName, false) +
            `<td class="text-center"><i class="fas fa-trash row-action" title="Remove" style="color:red;cursor:pointer"></i></td>`;
        frag.appendChild(tr);
    });

    body.appendChild(frag);
}

function renderPager() {
    const info = $id("pagerInfo");
    const list = $id("pagerList");

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    if (!total) {
        info.textContent = searchText.trim() ? `0 of ${totalAll} saved parts` : "";
        list.innerHTML = "";
        return;
    }

    const start = (currentPage - 1) * pageSize;
    info.textContent = `Showing ${start + 1}-${start + pageRows.length} of ${total}` +
        (total !== totalAll ? ` (filtered from ${totalAll})` : "") +
        (deleted.size ? ` | ${deleted.size} marked for delete` : "");

    const pages = [];
    for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2) pages.push(p);
    }

    const item = (label, page, disabled, active) =>
        `<li class="page-item${disabled ? " disabled" : ""}${active ? " active" : ""}">
            <a class="page-link" href="#" data-page="${page}">${label}</a></li>`;

    let html = item("&laquo;", currentPage - 1, currentPage === 1, false);
    let prev = 0;
    pages.forEach(p => {
        if (p - prev > 1) html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        html += item(p, p, false, p === currentPage);
        prev = p;
    });
    html += item("&raquo;", currentPage + 1, currentPage === totalPages, false);

    list.innerHTML = html;
}

/* =============================
   TYPING -> pending changes
============================= */
function clearInputError(input) {
    input.classList.remove("field-error");
    const small = input.parentElement.querySelector(".cell-error");
    if (small) { small.textContent = ""; small.style.display = "none"; }
}

function onSavedInput(e) {
    const input = e.target;
    if (input.tagName !== "INPUT") return;

    const tr = input.closest("tr");
    const id = Number(tr.dataset.id);
    const orig = pageRows.find(r => Number(r.id) === id);
    if (!orig) return;

    const mark = tr.querySelector(".markInput").value;
    const name = tr.querySelector(".nameInput").value;

    // keep only if it really differs from what the server has
    if (mark.trim() === str(orig.mark).trim() && name.trim() === str(orig.name).trim()) {
        edits.delete(id);
    } else {
        edits.set(id, { mark: mark, name: name, page: currentPage });
    }

    const er = errs.get(id);
    if (er) {
        if (input.classList.contains("markInput")) er.mark = "";
        if (input.classList.contains("nameInput")) er.name = "";
    }
    clearInputError(input);
}

function onNewInput(e) {
    const input = e.target;
    if (input.tagName !== "INPUT") return;

    const n = newRows.find(x => String(x.key) === input.closest("tr").dataset.key);
    if (!n) return;

    if (input.classList.contains("markInput")) { n.mark = input.value; n.errMark = ""; }
    if (input.classList.contains("nameInput")) { n.name = input.value; n.errName = ""; }
    clearInputError(input);
}

/* =============================
   NEW ROWS
============================= */
function makeNew() {
    return { key: ++newSeq, mark: "", name: "", errMark: "", errName: "" };
}

function addNewRow() {

    const contract = selectedContract();
    if (!contract) {
        $id("contractSelectError").style.display = "block";
        $id("contractSelect").classList.add("field-error");
        return;
    }

    const n = makeNew();
    newRows.push(n);
    renderNew();
    updateTotals();

    const tr = $id("partNewBody").querySelector(`tr[data-key="${n.key}"]`);
    if (tr) {
        tr.querySelector(".markInput").focus();
        tr.scrollIntoView({ block: "nearest" });
    }
}

let pendingUnlock = null; 
/* =============================
   VALIDATE -> CONFIRM -> POST (changes only)
============================= */
function onSaveClick() {

    clearContractError();

    const contract = selectedContract();
    if (!contract) {
        $id("contractSelectError").style.display = "block";
        $id("contractSelect").classList.add("field-error");
        return;
    }

    errs.clear();
    newRows.forEach(n => { n.errMark = ""; n.errName = ""; });

    const changes = [];
    let first = null;     // { kind: "saved"|"new", id|key, field, page }

    const flagSaved = (id, field, msg, page) => {
        const er = errs.get(id) || { mark: "", name: "" };
        er[field] = msg;
        errs.set(id, er);
        if (!first) first = { kind: "saved", id: id, field: field, page: page };
    };
    const flagNew = (n, field, msg) => {
        if (field === "mark") n.errMark = msg; else n.errName = msg;
        if (!first) first = { kind: "new", key: n.key, field: field };
    };

    // every row that will exist after saving, for the duplicate check
    // (only pages the user has seen can be checked here, the server checks the rest)
    const items = [];

    pageRows.forEach(r => {
        const id = Number(r.id);
        if (deleted.has(id) || edits.has(id)) return;          // edits are added below
        items.push({ kind: "saved", id: id, page: currentPage, mark: str(r.mark).trim() });
    });

    edits.forEach((e, id) => {
        if (deleted.has(id)) return;                           // delete wins over edit
        const mark = str(e.mark).trim();
        const name = str(e.name).trim();

        if (!mark) flagSaved(id, "mark", "Mark is required", e.page);
        if (!name) flagSaved(id, "name", "Name is required", e.page);

        items.push({ kind: "saved", id: id, page: e.page, mark: mark });
        changes.push({ id: id, mark: mark, name: name });
    });

    newRows.forEach(n => {
        const mark = str(n.mark).trim();
        const name = str(n.name).trim();

        if (!mark && !name) return;                            // empty new row = ignore

        if (!mark) flagNew(n, "mark", "Mark is required");
        if (!name) flagNew(n, "name", "Name is required");

        items.push({ kind: "new", n: n, mark: mark });
        changes.push({ id: null, mark: mark, name: name });
    });

    const seen = new Map();
    items.forEach(it => {
        if (!it.mark) return;
        const key = it.mark.toLowerCase();
        const other = seen.get(key);
        if (other) {
            [other, it].forEach(x => {
                if (x.kind === "new") flagNew(x.n, "mark", "Duplicate mark");
                else flagSaved(x.id, "mark", "Duplicate mark", x.page);
            });
        } else {
            seen.set(key, it);
        }
    });

    if (first) {
        if (first.kind === "saved" && first.page !== currentPage) {
            currentPage = first.page;         // error is on another page -> go there
            loadPage();                       // errors are kept in errs and shown after the load
            return;
        }
        renderAll();
        const sel = first.kind === "new"
            ? `#partNewBody tr[data-key="${first.key}"]`
            : `#partTableBody tr[data-id="${first.id}"]`;
        const tr = document.querySelector(sel);
        if (tr) tr.querySelector(first.field === "mark" ? ".markInput" : ".nameInput").focus();
        return;
    }

    renderAll();   // clears old error text

    if (!changes.length && !deleted.size) {
        showError("No changes to save.");
        return;
    }

    pendingPayload = {
        contractId: Number(contract.id),
        createdBy: LoggedUser,
        parts: changes,
        deletedIds: Array.from(deleted)
    };

    $("#confirmPartEntry").modal("show");
}

function savePartEntry() {

    if (!pendingPayload) return;

    const yesBtn = $id("confirmPartEntryYes");
    const saveBtn = $id("saveButton");
    yesBtn.disabled = true;
    saveBtn.disabled = true;

    fetch(apiUrl("/save"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingPayload)
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const err = new Error(data.message || `HTTP error! Status: ${res.status}`);
            err.status = res.status;
            throw err;
        }
        return data;
    })
    .then(data => {
        const savedContractId = pendingPayload.contractId;
        pendingPayload = null;
        edits.clear();
        deleted.clear();
        newRows = [];

        $("#confirmPartEntry").modal("hide");
        $("#partEntryModal").modal("hide");
        showPopup(data.message || "Saved successfully");

        // show what was just saved
        $id("contractFilter").value = String(savedContractId);
        loadList();
    })
    .catch(err => {
        console.error("Save error:", err);
        const msg = err.message || "Failed to save. Please try again.";
        $("#confirmPartEntry").one("hidden.bs.modal", () => showError(msg));
        $("#confirmPartEntry").modal("hide");
    })
    .finally(() => {
        yesBtn.disabled = false;
        saveBtn.disabled = false;
    });
}

/* =====================================================================
   IMPORT EXCEL DATA  (separate from the manual Save flow)
   Browser reads the Excel file (SheetJS) -> sends only Mark + Name
   to POST /api/contract-part/import
===================================================================== */

/* "1C24(?)" -> "1C24", also removes non-breaking spaces and padding */
function cleanMark(v) {
    return str(v).replace(/\u00A0/g, " ").replace(/\(\s*\?\s*\)/g, "").trim();
}
function cleanName(v) { return str(v).replace(/\u00A0/g, " ").trim(); }
function normHead(v)  { return str(v).replace(/\u00A0/g, " ").trim().toLowerCase(); }

/* rows = array of arrays (one per Excel row).
   Find the header row that has "Mark" and "NAME", then read every row below it. */
function parseExcelRows(rows) {
    let markIdx = -1, nameIdx = -1, start = 0;

    for (let i = 0; i < rows.length && i < 15; i++) {
        const cells = (rows[i] || []).map(normHead);
        const m = cells.indexOf("mark");
        const n = cells.indexOf("name");
        if (m >= 0 && n >= 0) { markIdx = m; nameIdx = n; start = i + 1; break; }
    }
    if (markIdx < 0) return null;

    const parts = [];
    for (let i = start; i < rows.length; i++) {
        const r = rows[i] || [];
        const mark = cleanMark(r[markIdx]);
        const name = cleanName(r[nameIdx]);
        if (!mark && !name) continue;
        parts.push({ mark: mark, name: name });
    }
    return parts;
}

function hasPendingChanges() {
    const hasNew = newRows.some(n => str(n.mark).trim() || str(n.name).trim());
    return edits.size > 0 || deleted.size > 0 || hasNew;
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

/* ---- import window UI ---- */
/*function resetImportUi() {
    importParts = [];
    $id("importFile").value = "";
    $id("importDropzone").style.display = "block";
    $id("importFileChip").style.display = "none";
    $id("importPreview").innerHTML = "";
    $id("importRunBtn").disabled = true;
    const skip = document.querySelector('input[name="importMode"][value="skip"]');
    if (skip) skip.checked = true;
	
	$id("importUnlockOptions").style.display = "none";
	$id("importEcnWrap").style.display = "none";
	$id("importEcnNo").value = "";
	document.querySelectorAll('input[name="importCorrection"]').forEach(r => r.checked = false);
}
*/

function resetImportUi() {
    importParts = [];
    $id("importFile").value = "";
    $id("importDropzone").style.display = "block";
    $id("importFileChip").style.display = "none";
    $id("importPreview").innerHTML = "";
    $id("importRunBtn").disabled = true;
    const skip = document.querySelector('input[name="importMode"][value="skip"]');
    if (skip) skip.checked = true;

    $id("importUnlock").checked = false;     // added earlier

    // NEW: hide and clear the correction options
    $id("importUnlockOptions").style.display = "none";
    $id("importEcnWrap").style.display = "none";
    $id("importEcnNo").value = "";
    document.querySelectorAll('input[name="importCorrection"]').forEach(r => r.checked = false);
}

function showImportError(msg) {
    importParts = [];
    $id("importRunBtn").disabled = true;
    $id("importPreview").innerHTML =
        `<div class="import-alert"><i class="fas fa-exclamation-circle mr-1"></i>${esc(msg)}</div>`;
}

function showImportSummary(sheetName, parts) {
    const sample = parts.slice(0, 5);
    const more = parts.length - sample.length;

    $id("importPreview").innerHTML = `
        <div class="import-stats">
            <div class="import-stat"><div class="v">${parts.length}</div><div class="l">Rows found</div></div>
            <div class="import-stat"><div class="v" style="font-size:15px;line-height:30px;">${esc(sheetName)}</div><div class="l">Sheet</div></div>
        </div>
        <div class="table-responsive">
            <table class="import-preview-table table table-sm">
                <thead><tr><th style="width:60px;">#</th><th style="width:200px;">Mark</th><th>Name</th></tr></thead>
                <tbody>
                    ${sample.map((p, i) => `<tr><td>${i + 1}</td><td>${esc(p.mark)}</td><td>${esc(p.name)}</td></tr>`).join("")}
                </tbody>
            </table>
        </div>
        ${more > 0 ? `<div class="import-more">... and ${more} more row(s)</div>` : ""}`;
}

/* ---- read the chosen / dropped Excel file ---- */
function readExcelFile(file) {
    importParts = [];
    $id("importRunBtn").disabled = true;
    if (!file) { resetImportUi(); return; }

    // show the file chip
    $id("importDropzone").style.display = "none";
    $id("importFileChip").style.display = "flex";
    $id("importFileName").textContent = file.name;
    $id("importFileSize").textContent = formatSize(file.size);

    if (!/\.(xlsx|xlsm|xls)$/i.test(file.name)) {
        showImportError("Please choose an Excel file (.xlsx / .xls).");
        return;
    }
    if (typeof XLSX === "undefined") {
        showImportError("Excel library not loaded (xlsx.full.min.js).");
        return;
    }

    $id("importPreview").innerHTML =
        `<div class="import-working"><i class="fas fa-spinner fa-spin mr-1"></i>Reading file...</div>`;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const wb = XLSX.read(new Uint8Array(e.target.result), { type: "array" });

            // first sheet that has a Mark + NAME header
            let parts = null, sheetName = "";
            for (const sn of wb.SheetNames) {
                const rows = XLSX.utils.sheet_to_json(wb.Sheets[sn],
                    { header: 1, defval: "", raw: false });
                parts = parseExcelRows(rows);
                if (parts) { sheetName = sn; break; }
            }

            if (!parts) { showImportError("Header row with 'Mark' and 'NAME' not found in this file."); return; }
            if (!parts.length) { showImportError("No data rows found below the header."); return; }

            importParts = parts;
            showImportSummary(sheetName, parts);
            $id("importRunBtn").disabled = false;
        } catch (err) {
            console.error("Excel read error:", err);
            showImportError("Could not read this file. Is it a valid Excel file?");
        }
    };
    reader.onerror = function () { showImportError("Could not read this file."); };
    reader.readAsArrayBuffer(file);
}

/* ---- send to the server ---- */
function runImport() {
    const contract = selectedContract();
    if (!contract || !importParts.length) return;

    const btn = $id("importRunBtn");
    btn.disabled = true;
    btn.textContent = "Importing...";

    const mode = document.querySelector('input[name="importMode"]:checked').value;
	
	let correctionType = "", ecnNo = "";
	if ($id("importUnlock").checked) {
	    const sel = document.querySelector('input[name="importCorrection"]:checked');
	    if (!sel) { showImportError("Select Internal or External correction."); btn.disabled = false; btn.innerHTML = '<i class="fas fa-file-import"></i> Import'; return; }
	    correctionType = sel.value;
	    ecnNo = $id("importEcnNo").value.trim();
	    if (correctionType === "EXTERNAL" && !ecnNo) {
	        showImportError("ECN No is required for External correction.");
	        btn.disabled = false; btn.innerHTML = '<i class="fas fa-file-import"></i> Import'; return;
	    }
	}

    fetch(apiUrl("/import"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      /*  body: JSON.stringify({
            contractId: Number(contract.id),
            createdBy: LoggedUser,
            mode: mode,
            parts: importParts
        })*/
		
	/*	
		body: JSON.stringify({
		    contractId: Number(contract.id),
		    createdBy: LoggedUser,
		    mode: mode,
		    unlock: $id("importUnlock").checked,
		    parts: importParts
		})*/
		
		
		body: JSON.stringify({
		    contractId: Number(contract.id), createdBy: LoggedUser, mode: mode,
		    unlock: $id("importUnlock").checked,
		    correctionType: correctionType, ecnNo: ecnNo,
		    parts: importParts
		})
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `HTTP error! Status: ${res.status}`);
        return data;
    })
    .then(data => {
        const savedContractId = contract.id;
        $("#importModal").modal("hide");

        // reload the main modal from the server
        resetModalState();
        renderAll();
        loadPage();

        showPopup(data.message || "Import completed");

        if (data.invalidList && data.invalidList.length) {
            setTimeout(() => showError("Some rows were not imported:\n" + data.invalidList.join("\n")), 300);
        }
        if ($id("contractFilter").value === String(savedContractId)) loadList();
    })
    .catch(err => {
        console.error("Import error:", err);
        showImportError(err.message || "Import failed.");
        btn.disabled = false;
    })
    .finally(() => { btn.innerHTML = '<i class="fas fa-file-import"></i> Import'; });
}

/* ---- import window events ---- */
document.addEventListener("DOMContentLoaded", function () {

    const dz = $id("importDropzone");
    const fileInput = $id("importFile");

    $id("importExcelBtn").addEventListener("click", function () {
        const contract = selectedContract();
        if (!contract) {
            $id("contractSelectError").style.display = "block";
            $id("contractSelect").classList.add("field-error");
            return;
        }
        if (hasPendingChanges()) {
            showError("Please save or clear your unsaved changes before importing.");
            return;
        }
        $id("importContractName").textContent = contract.name;
        resetImportUi();
        $("#importModal").modal("show");
    });

    // click / browse
    dz.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", function () {
        readExcelFile(this.files && this.files[0]);
    });

    // drag & drop
    ["dragenter", "dragover"].forEach(ev => dz.addEventListener(ev, function (e) {
        e.preventDefault(); dz.classList.add("dragover");
    }));
    ["dragleave", "drop"].forEach(ev => dz.addEventListener(ev, function (e) {
        e.preventDefault(); dz.classList.remove("dragover");
    }));
    dz.addEventListener("drop", function (e) {
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) readExcelFile(f);
    });

    // remove the chosen file
    $id("importFileRemove").addEventListener("click", resetImportUi);

    $id("importRunBtn").addEventListener("click", runImport);
	
	

    // keep the main modal scrollable after the import modal closes
    $("#importModal").on("hidden.bs.modal", function () {
        if ($("#partEntryModal").hasClass("show")) $("body").addClass("modal-open");
    });
	
	$id("importUnlock").addEventListener("change", function () {
	    $id("importUnlockOptions").style.display = this.checked ? "block" : "none";
	});
	document.querySelectorAll('input[name="importCorrection"]').forEach(r =>
	    r.addEventListener("change", function () {
	        $id("importEcnWrap").style.display = this.value === "EXTERNAL" ? "block" : "none";
	    }));
});



function runUnlock() {

    const contract = selectedContract();
    if (!pendingUnlock || !contract) return;

    const p = pendingUnlock;
    pendingUnlock = null;

    const yesBtn = $id("confirmUnlockYes");
    yesBtn.disabled = true;

    fetch(apiUrl("/unlock"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contractId: Number(contract.id),
            markId: p.markId,
            user: LoggedUser
        })
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `HTTP error! Status: ${res.status}`);
        return data;
    })
    .then(data => {
        $("#confirmUnlockModal").modal("hide");
        showPopup(`Part mark ${p.mark} unlocked`);
        loadPage();          // refresh the current page so the lock icon disappears
    })
    .catch(err => {
        console.error("Unlock error:", err);
        const msg = err.message || "Failed to unlock. Please try again.";
        $("#confirmUnlockModal").one("hidden.bs.modal", () => showError(msg));
        $("#confirmUnlockModal").modal("hide");
    })
    .finally(() => { yesBtn.disabled = false; });
}