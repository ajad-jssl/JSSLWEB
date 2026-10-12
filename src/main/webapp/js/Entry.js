// ============================================================
// GPMS ENTRY - OPTIMIZED JS
// ============================================================

const MainPage   = 'GPMSEntry.jsp';
const UserId     = sessionStorage.getItem('username');

let allowedActions          = [];
let cachedItemOptionsHtml   = '';
let selectedgid             = null;
let selectedgpid            = null;
// Raw ids (not display text) for the currently-open GP edit modal's
// vendor/employee fields — used by updateaddevent() so it never has to
// read a display-only input back as if it were the real id.
let selectedReturnableSentToClient   = '';
let selectedReturnableSentToEmployee = '';
let returnrowsToUpdate      = [];
let returnrowsToDelete      = [];
let rowsToUpdate            = [];
let rowsToDelete            = [];
let originalReturnableData  = {};
let originalNonReturnableData = {};
let selectedItems           = [];

let shipmentDeliveryCache = null; // raw array
let shipmentModeMapCache  = {}; 

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

async function populateDispatchModes() {
    await loadShipmentDelivery();
    ['dispatch', 'dispatchup', 'despatchmode', 'despatchmodeup'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const cur = el.value;
        el.innerHTML = '<option value="">Select</option>';
        shipmentDeliveryCache.forEach(s => {
            const o = document.createElement('option');
            o.value = s.si_id;
            o.textContent = s.shipment_mode;
            el.appendChild(o);
        });
        if (cur) el.value = cur;
    });
}

const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
const factory_Id        = selectedFactoryId;
//const createdById       = sessionStorage.getItem('userId') || sessionStorage.getItem('createdById') || UserId;
// ✅ Correct key
const createdById = sessionStorage.getItem('id')?.trim() || '1';


// ============================================================
// SHARED USER CACHE (fetched once, reused everywhere)
// Also builds the department id -> department name map from the
// SAME /api/websmartuser/getAll response (no separate department API call).
// ============================================================
let userListCache = null;       // raw array from API
let userMapCache  = {};         // id -> { username, department }
let deptMapCache  = {};         // dept_id -> department name

async function loadUserList() {
    if (userListCache) return userListCache; // already loaded

    try {
        const res  = await fetch(new URL('/api/websmartuser/getAll', baseUrl1), { credentials: 'include' });
        const data = await res.json();

        userListCache = (data && Array.isArray(data.Data)) ? data.Data : [];

        userMapCache = {};
        deptMapCache = {};
        userListCache.forEach(u => {
            userMapCache[String(u.id).trim()] = {
                username: u.username,
                department: u.dept_id
            };
            // Build dept_id -> department name from the same record.
            if (u.dept_id !== undefined && u.dept_id !== null && String(u.dept_id).trim() !== '') {
                deptMapCache[String(u.dept_id).trim()] = u.department;
            }
        });
    } catch (e) {
        console.error('loadUserList error:', e);
        userListCache = [];
        userMapCache  = {};
        deptMapCache  = {};
    }

    return userListCache;
}

// Helper: resolve a department NAME for display, given a stored dept_id.
// Falls back to the raw id if not found in cache yet.
function getDepartmentName(deptId) {
    if (deptId === undefined || deptId === null || String(deptId).trim() === '') return '';
    return deptMapCache[String(deptId).trim()] || deptId;
}


// ============================================================
// UTILITY
// ============================================================

function getIndianDateTimeFormat(date) {
    const options  = { timeZone: 'Asia/Kolkata', hour12: false };
    const istDate  = new Date(date.toLocaleString('en-US', options));
    const pad      = n => String(n).padStart(2, '0');
    return `${istDate.getFullYear()}-${pad(istDate.getMonth()+1)}-${pad(istDate.getDate())}T${pad(istDate.getHours())}:${pad(istDate.getMinutes())}:${pad(istDate.getSeconds())}`;
}

function formatDate(datetimeString) {
    if (!datetimeString) return '';
    const d = new Date(datetimeString);
    return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
}

function allowOnlyPositive(event) {
    if (['-','e','E','+'].includes(event.key)) { event.preventDefault(); return false; }
    return true;
}

function showPopup(message, redirectUrl) {
    const popup = $(`<div class="popup">${message}</div>`).appendTo('body').hide().fadeIn(400);
    setTimeout(() => {
        popup.fadeOut(400, function () {
            $(this).remove();
            if (redirectUrl) window.location = redirectUrl;
        });
    }, 2000);
}

function showModalPopup(message) {
    $('#errorMessageup').text(message);
    $('#exampleModalCenterDuppUP').modal('show');
}

// ============================================================
// LOAD ALLOWED ACTIONS
// ============================================================

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
            { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }
        );
        if (!response.ok) throw new Error('Failed to fetch actions');
        allowedActions = await response.json();
    } catch (error) {
        console.error('Error loading actions:', error);
        allowedActions = [];
    }
}

// ============================================================
// FACTORY PREFIX MAP
// Fill in your actual factory IDs (whatever gets stored in
// sessionStorage 'selectedFactoryId') mapped to their GP prefix letter.
// ============================================================
// ============================================================
// FACTORY PREFIX MAP
// factory_id -> GP prefix letter
// ============================================================
// ============================================================
// FACTORY CACHE (id -> prefix), fetched once and reused
// ============================================================
let factoryListCache  = null;
let factoryPrefixMap  = {}; // factory_id -> prefix letter

async function loadFactoryList() {
    if (factoryListCache) return factoryListCache;
    try {
        const res  = await fetch(new URL('/jssl/factory/getAllFactoryList', baseUrl1), { credentials: 'include' });
        const data = await res.json();
        factoryListCache = (data && Array.isArray(data.FactoryDetails)) ? data.FactoryDetails : [];

        factoryPrefixMap = {};
        factoryListCache.forEach(f => {
            const name = (f.factory_name || '').trim();
            factoryPrefixMap[String(f.id).trim()] = name ? name.charAt(0).toUpperCase() : '';
        });
    } catch (e) {
        console.error('loadFactoryList error:', e);
        factoryListCache = [];
        factoryPrefixMap  = {};
    }
    return factoryListCache;
}

function getFactoryPrefix() {
    return factoryPrefixMap[String(selectedFactoryId).trim()] || '';
}

function generateGpNo(callback) {
    const url = new URL('/jssl/contracts/jims/gpNo?gp_type=1', baseUrl1);
    url.searchParams.append('factory', selectedFactoryId);   // ← now scoped per factory

    $.ajax({
        url: url,
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (count) {
            const year   = new Date().getFullYear();
            const month  = String(new Date().getMonth() + 1).padStart(2, '0');
            const num    = String(count + 1).padStart(4, '0');
            const prefix = getFactoryPrefix();
            callback(`GP${prefix}/${year}/${month}/${num}`);
        },
        error: err => console.error('Error generating GP number:', err)
    });
}

function generateNGpNo(callback) {
    const url = new URL('/jssl/contracts/jims/gpNo?gp_type=2', baseUrl1);
    url.searchParams.append('factory', selectedFactoryId);   // ← now scoped per factory

    $.ajax({
        url: url,
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (count) {
            const year   = new Date().getFullYear();
            const month  = String(new Date().getMonth() + 1).padStart(2, '0');
            const num    = String(count + 1).padStart(4, '0');
            const prefix = getFactoryPrefix();
            callback(`NGP${prefix}/${year}/${month}/${num}`);
        },
        error: err => console.error('Error generating GP number:', err)
    });
}

// ============================================================
// INITIALISE ALL DROPDOWNS ON PAGE LOAD (single DOMContentLoaded)
// ============================================================

document.addEventListener('DOMContentLoaded', async function () {

    // Load actions first
    await loadActions();
	await loadUserList();   
	await loadFactoryList();
	await loadContractList(); 
	loadRgpPrNoDropdown();
	loadNgpRgpPrNoDropdown(); 

    // Run all independent dropdown fetches in parallel
    await Promise.allSettled([
     
        populateUsers('requested1',    'department'),
        populateUsers('requestednon1', 'department6'),
        populateUsers('requested1up',  'department6up'),
        populateUserSelect('employee'),
		
        populateContractNo(),
        populateContractNoNonReturnable(),
        populateVendor(),
        populateNonReturnableVendor(),
		populateDispatchModes(),   // ← added
        getitemdata()
    ]);

    // Table data
    updatestorerecieveqtyintable();
    fetchReturnables();
    fetchNgpReturnables();

    // Modal "Create" button
    document.getElementById('modalScroll1')?.addEventListener('click', function () {
        if (!allowedActions.includes('Insert')) {
            alert('You do not have permission to Insert.');
            return;
        }
        $('#exampleModalScrollable123').modal('show');
    });
});

// ============================================================
// DROPDOWN POPULATION HELPERS
// ============================================================



async function populateDeptname() {
    try {
        const res  = await fetch(new URL('/api/deptname/all', baseUrl1), { credentials: 'include' });
        const data = await res.json();
        const el   = document.getElementById('deptname');
        if (!el) return;
        el.innerHTML = '<option value="">Select</option>';
        data.forEach(dept => {
            const o = document.createElement('option');
            o.value = dept.did;
            o.textContent = dept.deptname;
            el.appendChild(o);
        });
    } catch (e) { console.error('populateDeptname error:', e); }
}



async function populateUsers(selectId, departmentInputId) {
    await loadUserList(); // no-op if already cached
    const sel = document.getElementById(selectId);
    const dep = document.getElementById(departmentInputId);
    if (!sel) return;

    sel.innerHTML = '<option value="">Select employee</option>';
    userListCache.forEach(user => {
        const o = document.createElement('option');
        o.value = user.id;
        o.textContent = user.username;
        sel.appendChild(o);
    });
    if (window.jQuery && $.fn.select2) {
        $(`#${selectId}`).select2({ placeholder: 'Select an employee', allowClear: true });
    }

    if (dep) {
        // The department side-input shows the DEPARTMENT NAME (for display),
        // while what actually gets submitted on save is the dept_id
        // (read again from userMapCache at submit time — see clientaddevent /
        // addngpevent). This change only fixes what's *displayed* here.
		sel.addEventListener('change', function () {
		    const uid = this.value;
		    if (!uid) { dep.value = ''; return; }
		    const userInfo = userMapCache[String(uid)];
		    const deptId   = userInfo ? userInfo.department : '';
		    dep.value = getDepartmentName(deptId);  // already correct
		});
    }
}

/*async function populateUserSelect(selectId) {
    try {
        const res  = await fetch(new URL('/jssl/user/listuser', baseUrl1), { credentials: 'include' });
        const data = await res.json();
        const el   = document.getElementById(selectId);
        if (!el) return;
        el.innerHTML = '<option value="">Select employee</option>';
        if (data && Array.isArray(data.Data)) {
            data.Data.forEach(u => {
                const o = document.createElement('option');
                o.value = u.id;
                o.textContent = u.username;
                el.appendChild(o);
            });
        }
    } catch (e) { console.error(`populateUserSelect(${selectId}) error:`, e); }
}
*/


async function populateUserSelect(selectId) {
    await loadUserList();
    const el = document.getElementById(selectId);
    if (!el) return;
    el.innerHTML = '<option value="">Select employee</option>';
    userListCache.forEach(u => {
        const o = document.createElement('option');
        o.value = u.id;
        o.textContent = u.username;
        el.appendChild(o);
    });
}
function populateContractNo() {
    return fetchContracts(['contractno', 'contractnoup']);
}

function populateContractNoNonReturnable() {
    return fetchContracts(['contract6', 'contract6up']);
}

async function fetchContracts(ids) {
    try {
        const url = new URL('/jssl/contracts/allContracts', baseUrl1);
        url.searchParams.append('factory', selectedFactoryId);
        const res  = await fetch(url, { credentials: 'include' });
        const data = await res.json();
        if (!Array.isArray(data.contracts)) return;

        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = '<option value="" selected>Select Contract</option>';
            data.contracts.forEach(c => {
                const o = document.createElement('option');
                o.value = c.contract_id || '';
                o.textContent = c.JobCode || 'Unnamed Contract';
                el.appendChild(o);
            });
        });
    } catch (e) { console.error('fetchContracts error:', e); }
}

async function populateVendor() {
    try {
        const res  = await fetch(new URL('/api/clients', baseUrl1), { credentials: 'include' });
        const data = await res.json();
        const el   = document.getElementById('tovendor');
        if (!el || !Array.isArray(data)) return;
        el.innerHTML = '<option value="" selected>Select vendor</option>';
        data.forEach(v => {
            const o = document.createElement('option');
            o.value = v.cid || '';
            o.textContent = `${v.client_number} - ${v.name}`;
            el.appendChild(o);
        });
    } catch (e) { console.error('populateVendor error:', e); }
}

async function populateNonReturnableVendor() {
    try {
        const res  = await fetch(new URL('/api/clients', baseUrl1), { credentials: 'include' });
        const data = await res.json();
        const el   = document.getElementById('vendor');
        if (!el || !Array.isArray(data)) return;
        el.innerHTML = '<option value="" selected>Select vendor</option>';
        data.forEach(v => {
            const o = document.createElement('option');
            o.value = v.cid || '';
            o.textContent = `${v.client_number} - ${v.name}`;
            el.appendChild(o);
        });
    } catch (e) { console.error('populateNonReturnableVendor error:', e); }
}

// ============================================================
// ITEM DATA
// ============================================================

async function getitemdata() {
    try {
        const res  = await fetch(new URL('/api/items', baseUrl1), { credentials: 'include' });
        const data = await res.json();
        if (!Array.isArray(data)) return;

        cachedItemOptionsHtml = '<option value="" selected>Select item</option>';
        data.forEach(item => {
            const itemNo = item.itemNo || '';
            const desc1  = item.itmDescription1 ? ` | ${item.itmDescription1}` : '';
            const desc2  = item.itmDescription2 ? ` | ${item.itmDescription2}` : '';
            // value is the ITEM ID — this is what gets stored in DB for line items.
            cachedItemOptionsHtml += `<option value="${item.itemid || ''}">${itemNo}${desc1}${desc2}</option>`;
        });

        document.querySelectorAll('select[id^="itemno"]').forEach(sel => {
            const cur = sel.value;
            sel.innerHTML = cachedItemOptionsHtml;
            if (cur) sel.value = cur;
        });
    } catch (e) { console.error('getitemdata error:', e); }
}

async function getitemdetails(rowNumber) {
    const itemid = document.getElementById(`itemno${rowNumber}`)?.value;
    if (!itemid) {
        // Clear fields if nothing selected
        $(`#unit${rowNumber}`).val('');
        $(`#description1${rowNumber}`).val('');
        $(`#description2${rowNumber}`).val('');
        return;
    }

    try {
        const [itemRes, unitsRes] = await Promise.all([
            fetch(new URL(`/api/items/${itemid}`, baseUrl1), { credentials: 'include' }),
            fetch(new URL('/api/items/all', baseUrl1), { credentials: 'include' })
        ]);

        let data  = await itemRes.json();
        const units = await unitsRes.json();

        // Handle both array and object response shapes
        if (Array.isArray(data)) data = data[0] || {};

        console.log('Item details response:', data); // 🔍 TEMP DEBUG — check this in console

        const unitMap = {};
        units.forEach(u => {
            if (u.uid)  unitMap[String(u.uid).trim()]            = u.unit;
            if (u.unit) unitMap[u.unit.trim().toUpperCase()]      = u.unit;
        });

        const rawUm    = data.um ?? data.UM ?? '';
        const unitName = unitMap[String(rawUm).trim().toUpperCase()]
                      || unitMap[String(rawUm).trim()]
                      || (rawUm && rawUm !== '0' ? rawUm : '');

        $(`#unit${rowNumber}`).val(unitName);
        $(`#description1${rowNumber}`).val(data.itmDescription1 || '');
        $(`#description2${rowNumber}`).val(data.itmDescription2 || '');

    } catch (e) { console.error('getitemdetails error:', e); }
}

// ============================================================
// TABLE ROW HELPERS
// ============================================================

function _buildRowHtml(rowCount, deleteFunc, tableId) {
    const trashBtn = ['TableID', 'updateTableID', 'TableIDnon', 'TableID1non'].includes(tableId)
        ? `<td class="text-center updatedelted"><i class="bi bi-trash text-danger" style="cursor:pointer;font-size:16px;" onclick="${deleteFunc}(this)" title="Delete"></i></td>`
        : `<td><button type="button" class="btn btn-sm btn-danger updatedelted" onclick="${deleteFunc}(this)">Delete</button></td>`;

    return `
        <tr>
            <td>${rowCount}</td>
            <td>
                <select class="form-control form-control-sm" id="itemno${rowCount}" onchange="getitemdetails(${rowCount})">
                    ${cachedItemOptionsHtml}
                </select>
            </td>
            <td><input type="text" class="form-control form-control-sm" id="unit${rowCount}" value="" readonly></td>
            <td><input type="text" class="form-control form-control-sm" id="description1${rowCount}" value="" readonly></td>
            <td><input type="text" class="form-control form-control-sm" id="description2${rowCount}" value="" readonly></td>
            <td><input type="text" class="form-control form-control-sm" id="quantity${rowCount}" placeholder=""></td>
            <td><input type="text" class="form-control form-control-sm" id="price${rowCount}" placeholder=""></td>
            <td><input type="text" class="form-control form-control-sm" id="remarks${rowCount}" placeholder=""></td>
            ${trashBtn}
        </tr>`;
}

function _addRow(tbodySelector, deleteFunc, tableId) {
    const tbody    = document.querySelector(tbodySelector);
    const rowCount = tbody.rows.length + 1;
    const row      = document.createElement('tr');
    row.innerHTML  = _buildRowHtml(rowCount, deleteFunc, tableId).replace('<tr>', '').replace('</tr>', '');
    tbody.appendChild(row);
    /*setTimeout(() => getitemdetails(rowCount), 100);*/
}

function addNewRow()        { _addRow('#TableID tbody',      'deleteRow',      'TableID'); }
function addNewRow1()       { _addRow('#TableID1 tbody',     'deleteRow1',     'TableID1'); }
function addNewRow3()       { _addRow('#updateTableID tbody','deleteRow3',     'updateTableID'); }
function addNewRowupnon()   { _addRow('#TableIDnon tbody',   'deleteRownon',   'TableIDnon'); }
function addNewRownon1()    { _addRow('#TableID1non tbody',  'deleteRownon1Btn','TableID1non'); }

function _deleteRow(button, selector) {
    button.closest('tr').remove();
    _adjustSlNos(selector);
}

function _adjustSlNos(selector) {
    document.querySelectorAll(`${selector} tr`).forEach((row, i) => {
        row.cells[0].textContent = i + 1;
    });
}

function deleteRow(button)     { _deleteRow(button, '#TableID tbody'); }
function deleteRow1(button)    { _deleteRow(button, '#TableID1 tbody'); }
function deleteRownon(button)  { _deleteRow(button, '#TableIDnon tbody'); }
function adjustSlNos()         { _adjustSlNos('#TableID tbody'); }
function adjustSlNos1()        { _adjustSlNos('#TableID1 tbody'); }
function adjustSlNosnon()      { _adjustSlNos('#TableIDnon tbody'); }
function adjustSlNosnon1()     { _adjustSlNos('#TableID1non tbody'); }
function adjustSlNos3()        { _adjustSlNos('#updateTableID tbody'); }

// deleteRow3 needs gpdid tracking
function deleteRow3(button, index) {
    const gpdid    = document.getElementById(`gpdid${index}`)?.value;
    const rowIndex = returnrowsToDelete.indexOf(gpdid);
    if (rowIndex === -1) {
        returnrowsToDelete.push(gpdid);
        button.closest('tr').remove();
    } else {
        returnrowsToDelete.splice(rowIndex, 1);
    }
    _adjustSlNos('#updateTableID tbody');
}

function deleteRownon1Btn(button) { _deleteRow(button, '#TableID1non tbody'); }

/*function deleteRownon1(button, index) {
    const gpdid    = button.closest('tr').querySelector('input[type="hidden"]')?.value;
    const rowIndex = rowsToDelete.indexOf(gpdid);
    if (rowIndex === -1) {
        rowsToDelete.push(gpdid);
        button.closest('tr').remove();
    } else {
        rowsToDelete.splice(rowIndex, 1);
    }
    _adjustSlNos('#TableID1non tbody');
}*/

// ============================================================
// ROW VALIDATION HELPER
// ============================================================
// NOTE: previously this returned the ITEM TEXT (itemNo) for "items"
// while still validating against the select's id value. We now keep
// the ITEM ID as `item` (this is what should be stored in the DB),
// since editing/reading line items must be keyed by id, not by the
// display text.

function _validateRows(selector) {
    const rows = document.querySelectorAll(`${selector} tbody tr`);
    if (rows.length === 0) { alert('Please add at least one line item.'); return null; }

    const items = [];
    for (let i = 0; i < rows.length; i++) {
        const n = i + 1;
        const itemSelect = rows[i].querySelector(`#itemno${n}`);
        const itemId   = itemSelect?.value?.trim();   // ITEM ID — stored in DB
        const qty      = rows[i].querySelector(`#quantity${n}`)?.value?.trim();
        const price    = rows[i].querySelector(`#price${n}`)?.value?.trim();
        const unit     = rows[i].querySelector(`#unit${n}`)?.value?.trim();
        const itmRem   = rows[i].querySelector(`#remarks${n}`)?.value?.trim();
        
        items.push({ item: itemId, qty, itmPrice: price, itmRemarks: itmRem, unit });   // ← item ID stored, not display text
    }
    return items;
}

// ============================================================
// RETURNABLE GATEPASS — CREATE
// ============================================================

function validateclienFields() {
    let isValid = true;
    $('.error-message').hide();
    const dispatch    = $('#dispatch').val();
	const transportname    = $('#transportname').val();
	const vehicleno    = $('#vehicleno').val();
    const requestdby  = $('#requested1').val();
    const returndate  = $('#returndatee').val();
    const sentType    = $('#selectvendor').val();
    const tovendor    = $('#tovendor').val();
    const employee    = $('#employee').val();
    const fordispatch = $('#fordispatch').val();

    if (!dispatch)    { $('#dispatchError').show();    isValid = false; }
	if (!transportname) { $('#transportnameError').show();    isValid = false; }
	if (!vehicleno)    { $('#vehiclenoError').show();    isValid = false; }
    if (!requestdby)  { $('#requested1Error').show();  isValid = false; }
    if (!returndate)  { $('#returndateeError').show();  isValid = false; }
    if (!sentType)    { $('#selectvendorError').show(); isValid = false; }
    else if (sentType === '1' && !tovendor)   { $('#tovendorError').show();  isValid = false; }
    else if (sentType === '2' && !employee)   { $('#employeeError').show();  isValid = false; }
    if (!fordispatch) { $('#fordispatchError').show();  isValid = false; }
    return isValid;
}

function clientaddevent() {
    if (!validateclienFields()) return;

    const rows = document.querySelectorAll('#TableID tbody tr');
    if (rows.length === 0) { alert('Please add at least one line item.'); return; }

    const selectedRequestedBy = $('#requested1').val();
    const requestedByDeptId   = (userMapCache[String(selectedRequestedBy)] || {}).department || '';

    // ── NEW: capture PR_No from the RGP dropdown ──
    //const selectedPrNo = $('#regpr option:selected').text().trim();

    generateGpNo(function (gpNo) {
        const now = getIndianDateTimeFormat(new Date());
        const requestData = {
            gp_no: gpNo, gp_type: 1,
            requestedby:      parseInt($('#requested1').val(), 10),
            dept:             requestedByDeptId,
            sent_type:        $('#selectvendor').val(),
            sentToClient:     $('#tovendor').val(),
            sentToemployee:   $('#employee').val(),
            employeeLocation: $('#empaddress').val()      || null,
            employeeAddress:  $('#employeeaddress').val() || null,
            sentThrough:      $('#dispatch').val(),
            returnDate:       $('#returndatee').val(),
            note:             $('#fordispatch').val(),
            remarks:          $('#remarks5').val(),
            encl:             $('#Enclosure3').val(),
            createdby:        parseInt(createdById, 10),
            createddate:      now,
            project:          $('#contractno').val(),
            factory_id:       selectedFactoryId,
			transportName:    $('#transportname').val(),   
			vehicleNo:        $('#vehicleno').val(),        
            // ── NEW fields ──
            request_Id:       $("#regpr").val() || null,
			itemRequestIds: itemrequest_id
        };

        $.ajax({
            url: new URL('/api/returnable', baseUrl1),
            type: 'POST', xhrFields: { withCredentials: true },
            contentType: 'application/json', data: JSON.stringify(requestData), dataType: 'json',
            success: function (response) {
                if (response.status !== 'Success') { alert('GP header insertion failed.'); return; }
                let done = 0;
                rows.forEach((row, i) => {
                    const n      = i + 1;
                    const itemId = row.getAttribute('data-item-id');

                    const itemData = {
                        gp_no: gpNo,
                        item:       itemId,
						itemRequestId: itemrequest_id[i],
                        unit:       row.querySelector(`#unit${n}`).value,
                        itmPrice:   row.querySelector(`#price${n}`).value,
                        itmRemarks: row.querySelector(`#remarks${n}`).value,
                        qty:        row.querySelector(`#quantity${n}`).value,
                        created_by: parseInt(createdById, 10), created_date: now, factory_id: selectedFactoryId
                    };
                    $.ajax({
                        url: new URL('/api/returnableitems', baseUrl1),
                        type: 'POST', xhrFields: { withCredentials: true },
                        contentType: 'application/json', data: JSON.stringify(itemData), dataType: 'json',
                        success: function () { if (++done === rows.length) showPopup('Inserted Successfully!', 'Returnable.jsp'); },
                        error: function () { alert('Error inserting line items.'); }
                    });
                });
            },
            error: function () { alert('Error inserting GP header.'); }
        });
    });
}

// ============================================================
// NON-RETURNABLE GATEPASS — CREATE
// ============================================================

function validatengpFields() {
    let isValid = true;
    $('.error-message').hide();
    const requestdby  = $('#requestednon1').val();
    const dispatch    = $('#despatchmode').val();
	const transportname    = $('#ngptransportname').val();
	const vehicleno    = $('#ngpvehicleno').val();
    const sentType    = $('#selectvendornon').val();
    const tovendor    = $('#vendor').val();
    const employee    = $('#employeenon').val();
    const fordispatch = $('#fordispatch1').val();

    if (!dispatch)    { $('#despatchmodeError').show();     isValid = false; }
	if (!transportname)    { $('#ngptransportnameError').show();     isValid = false; }
	if (!vehicleno)    { $('#ngpvehiclenoError').show();     isValid = false; }
    if (!requestdby)  { $('#requested1Error').show();       isValid = false; }
    if (!sentType)    { $('#selectvendornonError').show();  isValid = false; }
    else if (sentType === '1' && !tovendor)   { $('#vendorError').show();       isValid = false; }
    else if (sentType === '2' && !employee)   { $('#employeenonError').show();  isValid = false; }
    if (!fordispatch) { $('#fordispatch1Error').show();     isValid = false; }
    return isValid;
}






function addngpevent() {
    // Validate rows exist (same guard as before)
    const rows = document.querySelectorAll('#TableIDnon tbody tr');
    if (rows.length === 0) { alert('Please add at least one line item.'); return; }

    const selectedRequestedBy = $('#requestednon1').val();
    const requestedByDeptId   = (userMapCache[String(selectedRequestedBy)] || {}).department || '';

    generateNGpNo(function (NgpNo) {
        const now = getIndianDateTimeFormat(new Date());
        const requestData = {
            gp_no: NgpNo, gp_type: 2,
            requestedby: $('#requestednon1').val(),
            dept:        requestedByDeptId,
            sent_type:        $('#selectvendornon').val(),
            sentToClient:     $('#vendor').val(),
            sentToemployee:   $('#employeenon').val(),
            employeeLocation: $('#empaddressnon').val()       || null,
            employeeAddress:  $('#employeeaddressnon').val()  || null,
            sentThrough:  $('#despatchmode').val(),
            note:         $('#fordispatch1').val(),
            remarks:      $('#remarks6').val(),
            encl:         $('#enclosure5').val(),
            createdby:    createdById,
            createddate:  now,
            project:      $('#contract6').val(),
            factory_id:   selectedFactoryId,
			transportName: $('#ngptransportname').val(),   
			vehicleNo:     $('#ngpvehicleno').val(),  
			itemRequestIds: itemrnreqeust_id , 
            request_Id:   $("#regprnon").val() || null,
			
			
			
        };

        $.ajax({
            url: new URL('/api/returnable', baseUrl1),
            type: 'POST', xhrFields: { withCredentials: true },
            contentType: 'application/json', data: JSON.stringify(requestData), dataType: 'json',
            success: function (response) {
                if (response.status !== 'Success') { alert('Header not inserted. Please try again.'); return; }
                let done = 0;
                rows.forEach((row, i) => {
                    const n      = i + 1;
                    const itemId = row.getAttribute('data-item-id');

                    const itemData = {
                        gp_no: NgpNo,
                        item:       itemId,
						itemRequestId: itemrnreqeust_id[i],
                        unit:       row.querySelector(`#unit${n}`).value,
                        itmPrice:   row.querySelector(`#price${n}`).value,
                        itmRemarks: row.querySelector(`#remarks${n}`).value,
                        qty:        row.querySelector(`#quantity${n}`).value,
                        created_by: parseInt(createdById, 10), created_date: now, factory_id: selectedFactoryId
                    };
                    $.ajax({
                        url: new URL('/api/returnableitems', baseUrl1),
                        type: 'POST', xhrFields: { withCredentials: true },
                        contentType: 'application/json', data: JSON.stringify(itemData), dataType: 'json',
                        success: function () { if (++done === rows.length) showPopup('Inserted Successfully!', 'NonReturnable.jsp'); },
                        error: function () { alert('Error inserting line items.'); }
                    });
                });
            },
            error: function () { alert('Error inserting header: '); }
        });
    });
}

// ============================================================
// STORE RECEIVE QTY TABLE
// ============================================================

function updatestorerecieveqtyintable() {
    const url = new URL('/jssl/contracts/jims/gpstroereceived?gp_type=1&security_received=1&Return_complete=0', baseUrl1);
    selectedItems = [];

    fetch(url, { credentials: 'include' })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then(data => {
            const tbody = $('#tableID1 tbody');
            tbody.empty();
            if (!Array.isArray(data) || data.length === 0) {
                tbody.append('<tr><td colspan="11" class="text-center">No data available</td></tr>');
                return;
            }
            data.forEach((item, idx) => {
                const returnQty = item.Return_qty || 0;
                tbody.append(`
                    <tr>
                        <td>${idx + 1}</td>
                        <td>${item.gp_no || ''}</td>
                        <td class="gpsdid-column" style="display:none;">${item.gpsdid || ''}</td>
                        <td>${item.actualqty || ''}</td>
                        <td>${item.gps_entry || ''}</td>
                        <td>${item.itemno || ''}</td>
                        <td>${item.Dc_ref || ''}</td>
                        <td>${returnQty}</td>
                        <td>${item.security_remarks || ''}</td>
                        <td>
                            <input type="number" class="form-control" value="${returnQty}" readonly
                                   data-item-id="${item.itemId}" data-field="storeRcvdQty">
                        </td>
                        <td>
                            <input type="checkbox" class="form-check-input selectCheckbox" style="margin:16px;"
                                   data-item-id="${item.item}" data-gpsdid="${item.gpsdid}">
                        </td>
                    </tr>`);
            });

            $('.selectCheckbox').change(function () {
                const gpsdid   = $(this).data('gpsdid');
                const storesqty = $(this).closest('tr').find("input[data-field='storeRcvdQty']").val();
                if ($(this).is(':checked')) {
                    selectedItems.push({ gpsdid, storesqty });
                } else {
                    const idx = selectedItems.findIndex(x => x.gpsdid === gpsdid);
                    if (idx !== -1) selectedItems.splice(idx, 1);
                }
            });
        })
        .catch(e => { console.error('Error fetching store receive data:', e); $('#tableID1 tbody').empty(); });
}

function updatestoreqty() {
    if (selectedItems.length === 0) { showModalPopup('No items selected.'); return; }
    const now = getIndianDateTimeFormat(new Date());

    selectedItems.forEach(item => {
        const reqData = {
            receive_qty: item.storesqty, return_complete: 1,
            modified_by: createdById, modified_date: now, factory_id: selectedFactoryId
        };
        $.ajax({
            url: new URL(`/api/itemsrecieved/${item.gpsdid}`, baseUrl1),
            type: 'PUT', xhrFields: { withCredentials: true },
            contentType: 'application/json', data: JSON.stringify(reqData), dataType: 'json',
            success: function (data) {
                if (data.status === 'Success') {
                    showPopup('Updated Successfully!', 'Received.jsp');
                    updatestorerecieveqtyintable();
                } else {
                    alert('Not updated. Please try again.');
                }
            },
            error: function (xhr, status, error) { alert(`Error updating GPSID ${item.gpsdid}: ${error}`); }
        });
    });
}

// ============================================================
// FETCH RETURNABLES TABLE
// ============================================================

async function fetchReturnables() {
    try {
        await loadUserList();
        await loadShipmentDelivery();   // ← add this
        const clientRes = await fetch(new URL('/api/clients', baseUrl1), { credentials: 'include' }).then(r => r.json());
        const userMap = userMapCache;
        const clientMap = {};
        clientRes.forEach(c => { clientMap[String(c.cid).trim()] = `${c.client_number}-${c.name}`; });

        const apiUrl = new URL(`/jssl/contracts/jims/gptype_updatetables?gp_type=1&factory_id=${selectedFactoryId}`, baseUrl1);
        const returnables = await fetch(apiUrl, { credentials: 'include' }).then(r => r.json());

        let tableRows = '';
        returnables.forEach((item, index) => {
			if (item.cancelstatus == 1) return;   // ← skip cancelled GPs entirely
            const requestedByName = userMap[String(item.requestedby).trim()]?.username || item.requestedby;
            let sentToDisplay = '';
            if (item.sentToemployee && item.sentToemployee !== 0)
                sentToDisplay = userMap[String(item.sentToemployee).trim()]?.username || item.sentToemployee;
            else if (item.sentToClient && item.sentToClient !== 0)
                sentToDisplay = clientMap[String(item.sentToClient).trim()] || item.sentToClient;

            const departmentName = getDepartmentName(item.dept);
            const dispatchModeName = getShipmentModeName(item.sentThrough);   // ← add this

            const disabled = item.cancelstatus == 1 || item.security == 1;
            const editIcon = disabled
                ? `<td><i class="fa fa-pen" style="color:grey;pointer-events:none;" title="Edit disabled"></i></td>`
                : `<td><i class="fa fa-pen" style="color:blue;cursor:pointer;" onclick="editReturnable(${item.gpid},'${item.gp_no}')"></i></td>`;
            const cancelIcon = disabled
                ? `<td><i class="fa fa-times" style="color:grey;pointer-events:none;" title="Cancel disabled"></i></td>`
                : `<td><i class="fa fa-times" style="color:green;cursor:pointer;" onclick="cancelReturnable(${item.gpid},'${item.gp_no}')"></i></td>`;

            tableRows += `
                <tr id="${item.gpid}">
                    <td>${index+1}</td><td>${item.gp_no}</td><td>${requestedByName}</td>
                    <td>${departmentName}</td><td>${sentToDisplay}</td><td>${dispatchModeName}</td>
                    <td>${item.returnDate}</td>${editIcon}${cancelIcon}
                </tr>`;
        });

		document.querySelector('#tableID2 tbody').innerHTML = tableRows;

		if ($.fn.DataTable.isDataTable('#tableID2')) $('#tableID2').DataTable().destroy();
		$('#tableID2').DataTable({
		    dom: 'Bfrt<"d-flex justify-content-between align-items-center mt-2"ip>',
		    scrollX: true,
		    info: true,
		    paging: true,
		    pageLength: 10,
		    lengthChange: true,
		    lengthMenu: [10, 25, 50, 100],
		    buttons: [{
		        extend: 'excel',
		        text: 'Export to Excel',
		        title: 'Returnable List',
		        exportOptions: { modifier: { page: 'all' } }
		    }]
		});
		$('.dt-buttons').css({ float: 'left', marginRight: '10px' });
		$('.dataTables_filter').css({ float: 'right', marginBottom: '10px' });
    } catch (e) { console.error('fetchReturnables error:', e); }
}

// ============================================================
// CANCEL RETURNABLE
// ============================================================

/*async function cancelReturnable(gpid, gp_no) {
    if (!allowedActions.includes('Cancel')) { alert('You do not have permission to Cancel.'); return; }
    try {
        await loadUserList();
        const locMap = await loadFactoryLocationMap();

        // Fetch gpData FIRST — we need its Request_Id before calling the rgp endpoint
        const gpData = await fetch(new URL(`/api/returnable/${gpid}`, baseUrl1), { credentials: 'include' }).then(r => r.json());

        const requestId = gpData.Request_Id ?? gpData.request_Id ?? gpData.requestId ?? null;

        const [rgpData, itemsData, itemsList, clients] = await Promise.all([
            requestId
                ? fetch(new URL(`/api/rgp/edit/${requestId}`, baseUrl), { credentials: 'include' }).then(r => r.json())
                : Promise.resolve(null),
            fetch(new URL(`/jssl/contracts/jims/gpnoitemdetails?gp_no=${gp_no}`, baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/items/all', baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/clients', baseUrl1), { credentials: 'include' }).then(r => r.json())
        ]);

        const clientMap = {};
        clients.forEach(c => { clientMap[String(c.cid).trim()] = `${c.client_number}-${c.name}`; });

        const reqName = userMapCache[String(gpData.requestedby).trim()]?.username || gpData.requestedby;
        $('#requestedby1').val(reqName || '');
        $('#department5').val(getDepartmentName(gpData.dept));
        $('#despatch').val(getShipmentModeName(gpData.sentThrough) || '');
		$('#transportnamecl').val(gpData.transportName || '');
		$('#vehiclenocl').val(gpData.vehicleNo || '');

        // ── Sent To Vendor/Employee — show NAME instead of raw id ──
        let sentToDisplay = '';
        if (gpData.sentToemployee && gpData.sentToemployee !== 0 && gpData.sentToemployee !== '') {
            sentToDisplay = userMapCache[String(gpData.sentToemployee).trim()]?.username || gpData.sentToemployee;
        } else if (gpData.sentToClient && gpData.sentToClient !== 0 && gpData.sentToClient !== '') {
            sentToDisplay = clientMap[String(gpData.sentToClient).trim()] || gpData.sentToClient;
        }
        $('#vendor').val(sentToDisplay);

        $('#date').val(formatDate(gpData.createddate));
        $('#expected').val(formatDate(gpData.returnDate));
        $('#reason').val(gpData.note || '');
        $('#remark').val(gpData.remarks || '');
        $('#enclosure').val(gpData.encl || '');

        // ── Employee Location / Address — now sourced from rgpData ──
        const header = Array.isArray(rgpData) ? rgpData[0] : rgpData;
        if (header) {
            const locId = header.Employee_Sender_Location;
            const locName = (locId === 'OTHER')
                ? 'Others'
                : (locMap[String(locId)] || locId || '');
            $('#empaddress1').val(locName);
            $('#employeeaddress1').val(header.Employee_Address || '');
        } else {
            $('#empaddress1').val('');
            $('#employeeaddress1').val('');
        }

        selectedgid = gpid;

        let itemRows = '';
        const unitMap = {};
        itemsList.forEach(u => {
            if (u.uid)  unitMap[String(u.uid).trim()]            = u.unit;
            if (u.unit) unitMap[u.unit.trim().toUpperCase()]      = u.unit;
        });
        itemsData.forEach((item, i) => {
            const rawUm    = item.UM ?? item.um ?? '';
            const unitName = unitMap[String(rawUm).trim().toUpperCase()] || unitMap[String(rawUm).trim()] || (rawUm && String(rawUm) !== '0' ? rawUm : '');
            itemRows += `<tr>
                <td>${i+1}</td>
                <td><select class="form-control form-control-sm" disabled><option value="${item.itemId}" selected>${item.ItemNo}</option></select></td>
                <td><input type="text" class="form-control form-control-sm" value="${unitName}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmDescription1 || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmDescription2 || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.qty || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmPrice || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmRemarks || ''}" readonly></td>
            </tr>`;
        });
        $('#Table2 tbody').html(itemRows);
        $('#exampleModalScrollable125').modal('show');

    } catch (e) { console.error('cancelReturnable error:', e); }
}*/


async function cancelReturnable(gpid, gp_no) {
    if (!allowedActions.includes('Cancel')) { alert('You do not have permission to Cancel.'); return; }
    try {
        await loadUserList();
        const locMap = await loadFactoryLocationMap();

        const gpData = await fetch(new URL(`/api/returnable/${gpid}`, baseUrl1), { credentials: 'include' }).then(r => r.json());

        const requestId = gpData.Request_Id ?? gpData.request_Id ?? gpData.requestId ?? null;

        const [rgpData, itemsData, itemsList, clients] = await Promise.all([
            requestId
                ? fetch(new URL(`/api/rgp/edit/${requestId}`, baseUrl), { credentials: 'include' }).then(r => r.json())
                : Promise.resolve(null),
            fetch(new URL(`/jssl/contracts/jims/gpnoitemdetails?gp_no=${gp_no}`, baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/items/all', baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/clients', baseUrl1), { credentials: 'include' }).then(r => r.json())
        ]);

        const clientMap = {};
        clients.forEach(c => { clientMap[String(c.cid).trim()] = `${c.client_number}-${c.name}`; });

        const reqName = userMapCache[String(gpData.requestedby).trim()]?.username || gpData.requestedby;
        $('#requestedby1').val(reqName || '');
        $('#department5').val(getDepartmentName(gpData.dept));
        $('#despatch').val(getShipmentModeName(gpData.sentThrough) || '');
        $('#transportnamecl').val(gpData.transportName || '');
        $('#vehiclenocl').val(gpData.vehicleNo || '');

        // ── Sent To Vendor/Employee — show NAME instead of raw id ──
        let sentToDisplay = '';
        const isVendorGp = !!(gpData.sentToClient && gpData.sentToClient !== 0 && gpData.sentToClient !== '');

        if (gpData.sentToemployee && gpData.sentToemployee !== 0 && gpData.sentToemployee !== '') {
            sentToDisplay = userMapCache[String(gpData.sentToemployee).trim()]?.username || gpData.sentToemployee;
        } else if (isVendorGp) {
            sentToDisplay = clientMap[String(gpData.sentToClient).trim()] || gpData.sentToClient;
        }
        $('#vendor').val(sentToDisplay);

        $('#date').val(formatDate(gpData.createddate));
        $('#expected').val(formatDate(gpData.returnDate));
        $('#reason').val(gpData.note || '');
        $('#remark').val(gpData.remarks || '');
        $('#enclosure').val(gpData.encl || '');

        const header = Array.isArray(rgpData) ? rgpData[0] : rgpData;
        if (header) {
            const locId = header.Employee_Sender_Location;
            const locName = (locId === 'OTHER')
                ? 'Others'
                : (locMap[String(locId)] || locId || '');
            $('#empaddress1').val(locName);
            $('#employeeaddress1').val(header.Employee_Address || '');
        } else {
            $('#empaddress1').val('');
            $('#employeeaddress1').val('');
        }

        selectedgid = gpid;

        // ── NEW: keep this cancel run's context available to canceladd() ──
        window.cancelIsVendorGp        = isVendorGp;
        window.cancelItemRequestIds    = [];

        let itemRows = '';
        const unitMap = {};
        itemsList.forEach(u => {
            if (u.uid)  unitMap[String(u.uid).trim()]            = u.unit;
            if (u.unit) unitMap[u.unit.trim().toUpperCase()]      = u.unit;
        });
        itemsData.forEach((item, i) => {
            const rawUm    = item.UM ?? item.um ?? '';
            const unitName = unitMap[String(rawUm).trim().toUpperCase()] || unitMap[String(rawUm).trim()] || (rawUm && String(rawUm) !== '0' ? rawUm : '');

            // ── NEW: collect itemrequestId for the vendor-branch cancel update ──
            if (item.itemrequestId !== undefined && item.itemrequestId !== null && item.itemrequestId !== '') {
                window.cancelItemRequestIds.push(parseInt(item.itemrequestId, 10));
            }

            itemRows += `<tr data-item-request-id="${item.itemrequestId || ''}">
                <td>${i+1}</td>
                <td><select class="form-control form-control-sm" disabled><option value="${item.itemId}" selected>${item.ItemNo}</option></select></td>
                <td><input type="text" class="form-control form-control-sm" value="${unitName}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmDescription1 || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmDescription2 || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.qty || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmPrice || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmRemarks || ''}" readonly></td>
            </tr>`;
        });
        $('#Table2 tbody').html(itemRows);
        $('#exampleModalScrollable125').modal('show');

    } catch (e) { console.error('cancelReturnable error:', e); }
}

/*function canceladd(gpid) {
    const returnableremarks = $('#cancelremarks').val().trim();
    if (!returnableremarks) { alert('Please enter remarks.'); return; }

    const data = {
        cancelreason: returnableremarks, cancelstatus: 1,
        updatedBy: createdById, updatedDate: getIndianDateTimeFormat(new Date())
    };

    fetch(`${baseUrl1}/api/returnable/${gpid}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(data => {
        if (data.status === 'Success') {
            showPopup('Cancelled Successfully!', 'Returnable.jsp');
            updatestorerecieveqtyintable();
        } else {
            alert('Not updated. Please try again.');
        }
    })
    .catch(e => { console.error('canceladd error:', e); alert('An error occurred. Please try again later.'); });
}*/


function canceladd(gpid) {
    const returnableremarks = $('#cancelremarks').val().trim();
    if (!returnableremarks) { alert('Please enter remarks.'); return; }

    const data = {
        cancelreason: returnableremarks,
        updatedBy: createdById,
        updatedDate: getIndianDateTimeFormat(new Date()),
        itemRequestIds: window.cancelIsVendorGp ? (window.cancelItemRequestIds || []) : []
    };

    fetch(`${baseUrl1}/api/returnable/cancelgatepass/${gpid}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(data => {
        if (data.status === 'Success') {
            showPopup('Cancelled Successfully!', 'Returnable.jsp');
            updatestorerecieveqtyintable();
        } else {
            alert('Not updated. Please try again.');
        }
    })
    .catch(e => { console.error('canceladd error:', e); alert('An error occurred. Please try again later.'); });
}

/*function canceladdngp(gpid) {
    const returnableremarks = $('#cancelremarks').val().trim();
    if (!returnableremarks) { alert('Please enter remarks.'); return; }

    const data = {
        cancelreason: returnableremarks, cancelstatus: 1,
        updatedBy: createdById, updatedDate: getIndianDateTimeFormat(new Date())
    };

    fetch(`${baseUrl1}/api/returnable/${gpid}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(data => {
        if (data.status === 'Success') {
            showPopup('Cancelled Successfully!', 'NonReturnable.jsp');
            updatestorerecieveqtyintable();
        } else {
            alert('Not updated. Please try again.');
        }
    })
    .catch(e => { console.error('canceladd error:', e); alert('An error occurred. Please try again later.'); });
}*/

function canceladdngp(gpid) {
    const returnableremarks = $('#cancelremarks').val().trim();
    if (!returnableremarks) { alert('Please enter remarks.'); return; }

    const data = {
        cancelreason: returnableremarks,
        updatedBy: createdById,
        updatedDate: getIndianDateTimeFormat(new Date()),
        itemRequestIds: window.cancelIsVendorGp ? (window.cancelItemRequestIds || []) : []
    };

    fetch(`${baseUrl1}/api/returnable/cancelgatepass/${gpid}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(data => {
        if (data.status === 'Success') {
            showPopup('Cancelled Successfully!', 'NonReturnable.jsp');
            updatestorerecieveqtyintable();
        } else {
            alert('Not updated. Please try again.');
        }
    })
    .catch(e => { console.error('canceladdngp error:', e); alert('An error occurred. Please try again later.'); });
}
// ============================================================
// EDIT RETURNABLE
// ============================================================

async function editReturnable(gpid, gp_no) {
    if (!allowedActions.includes('Edit')) { alert('You do not have permission to edit.'); return; }

    try {
		
		
		$(".updatedelted").hide();
        await loadUserList();
        await loadShipmentDelivery();
        const locMap = await loadFactoryLocationMap();

        // Fetch gpData FIRST — we need its Request_Id before calling the rgp endpoint
        const gpData = await fetch(new URL(`/api/returnable/${gpid}`, baseUrl1), { credentials: 'include' }).then(r => r.json());
        console.log('DEBUG gpData:', gpData);
        console.log('DEBUG gpData.Request_Id:', gpData.Request_Id, 'gpData.request_Id:', gpData.request_Id);

        // Try both casings defensively until we confirm which one the API actually returns
        const requestId = gpData.Request_Id ?? gpData.request_Id ?? gpData.requestId ?? null;
        console.log('DEBUG resolved requestId:', requestId);

        const [rgpData, itemsData, itemsList, unitsList, clients] = await Promise.all([
            requestId
                ? fetch(new URL(`/api/rgp/edit/${requestId}`, baseUrl), { credentials: 'include' }).then(r => r.json())
                : Promise.resolve(null),
            fetch(new URL(`/jssl/contracts/jims/gpnoitemdetails?gp_no=${gp_no}`, baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/items', baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/items/all', baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/clients', baseUrl1), { credentials: 'include' }).then(r => r.json())
        ]);

        console.log('DEBUG rgpData:', rgpData);

        originalReturnableData = {
            requestedby: String(gpData.requestedby || '').trim(),
            dept: String(gpData.dept || '').trim(),
            sentToClient: String(gpData.sentToClient || '').trim(),
            sentThrough: String(gpData.sentThrough || '').trim(),
			transport_name: String(gpData.transportName || '').trim(),   
			vehicle_no: String(gpData.vehicleNo || '').trim(),   
            returnDate: String(gpData.returnDate || '').trim(),
            contract: String(gpData.project || '').trim(),
            note: String(gpData.note || '').trim(),
            remarks: String(gpData.remarks || '').trim(),
            encl: String(gpData.encl || '').trim()
        };

        const clientMap = {};
        clients.forEach(c => { clientMap[String(c.cid).trim()] = `${c.client_number}-${c.name}`; });

        const requestedByName = userMapCache[String(gpData.requestedby).trim()]?.username || gpData.requestedby;
        $('#requested1up').val(requestedByName);
        if (!$('#requested1upId').length) {
            $('#requested1up').after('<input type="hidden" id="requested1upId">');
        }
        $('#requested1upId').val(gpData.requestedby);

        $('#departmentup').val(getDepartmentName(gpData.dept));
        $('#dispatchup').val(getShipmentModeName(gpData.sentThrough));
        $('#returndateup').val(gpData.returnDate);
        $('#contractnoup').val(gpData.project);
		$('#transportnameup').val(gpData.transportName || '');
		$('#vehiclenoup').val(gpData.vehicleNo || '');
        $('#fordispatchup').val(gpData.note);
        $('#remarks5up').val(gpData.remarks);
        $('#Enclosure3up').val(gpData.encl);
        selectedgid = gpid;
        returnrowsToUpdate = [];
        returnrowsToDelete = [];

        const sentToEmp    = gpData.sentToemployee;
        const sentToClient = gpData.sentToClient;
        selectedReturnableSentToClient   = '';
        selectedReturnableSentToEmployee = '';

        if (sentToEmp && sentToEmp !== 0 && sentToEmp !== '') {
            $('#selectvendorup').val('2');
            $('#employeeup').val(userMapCache[String(sentToEmp).trim()]?.username || sentToEmp);
            $('#tovendorup').val('');
            selectedReturnableSentToEmployee = sentToEmp;
            $('#selectvendorupDisplay').val('Employee');
        } else if (sentToClient && sentToClient !== 0 && sentToClient !== '') {
            $('#selectvendorup').val('1');
            $('#tovendorup').val(clientMap[String(sentToClient).trim()] || sentToClient);
            $('#employeeup').val('');
            selectedReturnableSentToClient = sentToClient;
            $('#selectvendorupDisplay').val('Vendor');
        }

        // ── Employee Location / Address ──
        const header = Array.isArray(rgpData) ? rgpData[0] : rgpData;
        console.log('DEBUG header:', header);
        if (header) {
            console.log('DEBUG header.Employee_Sender_Location:', header.Employee_Sender_Location);
            console.log('DEBUG header.Employee_Address:', header.Employee_Address);
        }

        if (header) {
            const locId = header.Employee_Sender_Location;
            const locName = (locId === 'OTHER')
                ? 'Others'
                : (locMap[String(locId)] || locId || '');

            $('#empaddressup').val(locName);
            $('#employeeaddressup').val(header.Employee_Address || '');
        } else {
            $('#empaddressup').val('');
            $('#employeeaddressup').val('');
        }

        if ($('#selectvendorup').val() === '2') {
            $('#empLocationRowup').show();
        } else {
            $('#empLocationRowup').hide();
        }

        const unitsMap = {};
        unitsList.forEach(u => { unitsMap[u.uid] = u.unit; });
        const itemListMap = {};
        itemsList.forEach(item => { itemListMap[item.itemid] = item; });

        const tbody = $('#updateTableID tbody');
        tbody.empty();
        itemsData.forEach((item, i) => {
            const n    = i + 1;
            const cur  = itemListMap[item.item];
            const unit = unitsMap[item.UM] || item.UM || '';
            tbody.append(`
                <tr>
                    <td>${n}</td>
                    <td><select class="form-control form-control-sm" id="itemno${n}" disabled>
                        <option selected>${cur ? cur.itemNo : item.item}</option></select></td>
                    <td><input type="text" class="form-control form-control-sm" id="unit${n}" value="${unit}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="description1${n}" value="${item.itmDescription1 || ''}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="description2${n}" value="${item.itmDescription2 || ''}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="quantity${n}" value="${item.qty || ''}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" onkeydown="return allowOnlyPositive(event)" id="price${n}" value="${item.itmPrice || ''}"></td>
                    <td><input type="text" class="form-control form-control-sm" id="remarks${n}" value="${item.itmRemarks || ''}" readonly></td>
                </tr>`);
        });

        $('#requested1up, #departmentup, #selectvendorup, #tovendorup, #employeeup, ' +
          '#dispatchup, #returndateup, #contractnoup, #fordispatchup, #remarks5up, ' +
          '#empaddressup, #employeeaddressup').prop('readonly', true).prop('disabled', true);
        $('#Enclosure3up').prop('readonly', false).prop('disabled', false);

        $('#exampleModalScrollable12').modal('show');

    } catch (e) {
        console.error('editReturnable error:', e);
        alert('Failed to load returnable data.');
    }
}

function validateUpdateFields() {
    let isValid = true;
    $('.error-message').hide();
    if (!$('#requested1up').val()) { $('#requested1Errorup').show();    isValid = false; }
    if (!$('#dispatchup').val())   { $('#dispatchErrorup').show();      isValid = false; }
    if (!$('#returndateup').val()) { $('#returndateErrorup').show();    isValid = false; }
    if (!$('#selectvendorup').val()){ $('#selectvenempErrorup').show(); isValid = false; }
    if (!$('#fordispatchup').val()){ $('#fordispatchupErrorup').show(); isValid = false; }
    return isValid;
}

/*function updateaddevent(gpid) {
    const now = getIndianDateTimeFormat(new Date());
    const currentData = {
        requestedby:  String($('#requested1up').val() || '').trim(),
        dept:         String($('#departmentup').val() || '').trim(),
        sentToClient: String($('#selectvendorup').val() || '').trim(),
        sentThrough:  String($('#dispatchup').val() || '').trim(),
        returnDate:   String($('#returndateup').val() || '').trim(),
        contract:     String($('#contractnoup').val() || '').trim(),
        note:         String($('#fordispatchup').val() || '').trim(),
        remarks:      String($('#remarks5up').val() || '').trim(),
        encl:         String($('#Enclosure3up').val() || '').trim()
    };

    const headerChanged = Object.keys(currentData).some(k =>
        String(originalReturnableData[k] || '').trim() !== currentData[k]
    );

    if (!headerChanged && returnrowsToUpdate.length === 0) {
        showPopup('No Fields Changed!'); return;
    }

    fetch(new URL(`/api/returnable/${gpid}`, baseUrl1), {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentData, updatedBy: createdById, updatedDate: now, items: returnrowsToUpdate })
    })
    .then(r => { if (!r.ok) throw new Error('Update failed'); return r.json(); })
    .then(() => {
        showPopup('Updated successfully!', 'Returnable.jsp');
        $('#container1Update').modal('hide');
        fetchReturnables();
    })
    .catch(e => { console.error(e); alert('Failed to update returnable'); });
}*/


function updateaddevent(gpid) {
    const now = getIndianDateTimeFormat(new Date());

    const selectedRequestedBy = $('#requested1upId').val() || originalReturnableData.requestedby;
    const requestedByDeptId   = (userMapCache[String(selectedRequestedBy)] || {}).department
                                  || originalReturnableData.dept || '';

    const sentType = String($('#selectvendorup').val() || '').trim();
    let sentToClientVal   = '';
    let sentToEmployeeVal = '';
    if (sentType === '2') {
        sentToEmployeeVal = selectedReturnableSentToEmployee || '';
    } else {
        sentToClientVal = selectedReturnableSentToClient || '';
    }

    const currentData = {
        requestedby: String(selectedRequestedBy || '').trim(),
        dept: String(requestedByDeptId || '').trim(),
        sentToClient: String(sentToClientVal || '').trim(),
        sentToemployee: String(sentToEmployeeVal || '').trim(),
        sent_type: sentType,
        sentThrough: String($('#dispatchup').val() || '').trim(),
        returnDate: String($('#returndateup').val() || '').trim(),
        contract: String($('#contractnoup').val() || '').trim(),
        note: String($('#fordispatchup').val() || '').trim(),
        remarks: String($('#remarks5up').val() || '').trim(),
        encl: String($('#Enclosure3up').val() || '').trim()
    };

    const headerChanged = Object.keys(currentData).some(k =>
        String(originalReturnableData[k] || '').trim() !== currentData[k]
    );

    if (!headerChanged && returnrowsToUpdate.length === 0) {
        showPopup('No Fields Changed!'); return;
    }

    fetch(new URL(`/api/returnable/${gpid}`, baseUrl1), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentData, updatedBy: createdById, updatedDate: now })
    })
    .then(r => { if (!r.ok) throw new Error('Header update failed'); return r.json(); })
    .then(async () => {
        if (returnrowsToUpdate.length > 0) {
            await Promise.all(
                returnrowsToUpdate.map(item =>
                    fetch(new URL(`/api/returnableitems/${item.gpdid}`, baseUrl1), {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            itmPrice: item.price,
                            qty: item.qty,
                            itmRemarks: item.remarks,
                            modified_by: createdById,
                            modified_date: now
                        })
                    })
                )
            );
        }
    })
    .then(() => {
        showPopup('Updated successfully!', 'Returnable.jsp');
        $('#container1Update').modal('hide');
        fetchReturnables();
    })
    .catch(error => {
        console.error(error);
        alert('Update failed');
    });
}
// Row change tracking
$('#updateTableID').on('change', 'input', function () {
    const row    = $(this).closest('tr');
    const n      = row.index() + 1;
    const gpdid  = row.find(`#gpdid${n}`).val();
    const updated = {
        gpdid,
        price:   row.find(`#price${n}`).val()    || '',
        qty:     row.find(`#quantity${n}`).val() || '',
        remarks: row.find(`#remarks${n}`).val()  || ''
    };
    const idx = returnrowsToUpdate.findIndex(r => r.gpdid === gpdid);
    if (idx !== -1) returnrowsToUpdate[idx] = updated;
    else returnrowsToUpdate.push(updated);
});

// ============================================================
// NON-RETURNABLE TABLE
// ============================================================

async function fetchNgpReturnables() {
    try {
        await loadUserList();
        await loadShipmentDelivery();   // ← add this
        const clientRes = await fetch(new URL('/api/clients', baseUrl1), { credentials: 'include' }).then(r => r.json());

        const userMap = userMapCache;
        const clientMap = {};
        clientRes.forEach(c => { clientMap[String(c.cid).trim()] = `${c.client_number} - ${c.name}`; });

        const apiUrl = new URL(`/jssl/contracts/jims/gptype_updatetables?gp_type=2&factory_id=${factory_Id}`, baseUrl1);
        const returnables = await fetch(apiUrl, { credentials: 'include' }).then(r => r.json());

        let tableRows = '';
        returnables.forEach((item, index) => {
			if (item.cancelstatus == 1) return;   // ← skip cancelled GPs entirely
            const requestedByName = userMap[String(item.requestedby).trim()]?.username || item.requestedby;
			let sentToDisplay = '';
			if (item.sentToemployee && item.sentToemployee !== 0)
			    sentToDisplay = userMap[String(item.sentToemployee).trim()]?.username || item.sentToemployee;
			else if (item.sentToClient && item.sentToClient !== 0)
			    sentToDisplay = clientMap[String(item.sentToClient).trim()] || item.sentToClient;

            // item.dept is the stored dept_id; resolve display name via deptMapCache.
            const departmentName = getDepartmentName(item.dept);
            // item.sentThrough is the stored si_id; resolve display name via shipmentModeMapCache.
            const dispatchModeName = getShipmentModeName(item.sentThrough);   // ← add this

            const disabled = item.cancelstatus == 1 || item.security == 1;
            const editIcon = disabled
                ? `<td><i class="fa fa-pen" style="color:grey;pointer-events:none;" title="Edit disabled"></i></td>`
                : `<td><i class="fa fa-pen" style="color:blue;cursor:pointer;" onclick="editNoReturnable(${item.gpid},'${item.gp_no}')"></i></td>`;
            const cancelIcon = disabled
                ? `<td><i class="fa fa-times" style="color:grey;pointer-events:none;" title="Cancel disabled"></i></td>`
                : `<td><i class="fa fa-times" style="color:green;cursor:pointer;" onclick="CancelNoReturnable(${item.gpid},'${item.gp_no}')"></i></td>`;

            tableRows += `
                <tr id="row-${item.gpid}">
                    <td>${index+1}</td><td>${item.gp_no}</td><td>${requestedByName}</td>
                    <td>${departmentName}</td><td>${sentToDisplay || ''}</td>
                    <td>${dispatchModeName || ''}</td>${editIcon}${cancelIcon}
                </tr>`;
        });

        document.querySelector('#table1 tbody').innerHTML = tableRows;
        if ($.fn.DataTable.isDataTable('#table1')) $('#table1').DataTable().destroy();
        $('#table1').DataTable({
            dom: 'Bfrtip', scrollX: true, info: false, paging: false,
            buttons: [{ extend: 'excel', text: 'Export to Excel', title: 'Non-Returnable List' }]
        });
        $('.dt-buttons').css({ float: 'left', marginRight: '10px' });
        $('.dataTables_filter').css({ float: 'right', marginBottom: '10px' });

    } catch (e) { console.error('fetchNgpReturnables error:', e); }
}

/*async function CancelNoReturnable(gpid, gp_no) {
    if (!allowedActions.includes('Cancel')) { alert('You do not have permission to Cancel.'); return; }

    try {
        await loadUserList();
        await loadContractList();      // ← added
        const locMap = await loadFactoryLocationMap();

        const gpData = await fetch(new URL(`/api/returnable/${gpid}`, baseUrl1), { credentials: 'include' }).then(r => r.json());
        const requestId = gpData.Request_Id ?? gpData.request_Id ?? gpData.requestId ?? null;

        const [rgpData, itemsData, itemsList, clients] = await Promise.all([
            requestId
                ? fetch(new URL(`/api/rgp/edit/${requestId}`, baseUrl), { credentials: 'include' }).then(r => r.json())
                : Promise.resolve(null),
            fetch(new URL(`/jssl/contracts/jims/gpnoitemdetails?gp_no=${gp_no}`, baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/items/all', baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/clients', baseUrl1), { credentials: 'include' }).then(r => r.json())
        ]);

        const clientMap = {};
        clients.forEach(c => { clientMap[String(c.cid).trim()] = `${c.client_number} - ${c.name}`; });
        const unitMap = {};
        itemsList.forEach(u => {
            if (u.uid)  unitMap[String(u.uid).trim()]           = u.unit;
            if (u.unit) unitMap[u.unit.trim().toUpperCase()]     = u.unit;
        });
        const itemListMap = {};
        itemsList.forEach(it => { itemListMap[String(it.itemid).trim()] = it; });

        const reqName = userMapCache[String(gpData.requestedby).trim()]?.username || gpData.requestedby;
        $('#requestedby1').val(reqName || '');
        $('#department5').val(getDepartmentName(gpData.dept));
        $('#despatch').val(getShipmentModeName(gpData.sentThrough) || '');
		$('#ngptransportnamecl').val(getShipmentModeName(gpData.transportName));
		$('#ngpvehiclenocl').val(getShipmentModeName(gpData.vehicleNo));

        let sentToDisplay = '';
        if (gpData.sentToemployee && gpData.sentToemployee !== 0 && gpData.sentToemployee !== '') {
            sentToDisplay = userMapCache[String(gpData.sentToemployee).trim()]?.username || gpData.sentToemployee;
        } else if (gpData.sentToClient && gpData.sentToClient !== 0 && gpData.sentToClient !== '') {
            sentToDisplay = clientMap[String(gpData.sentToClient).trim()] || gpData.sentToClient;
        }
        $('#vendor1').val(sentToDisplay);

        $('#date').val(formatDate(gpData.createddate));
        $('#reason').val(gpData.note || '');
        $('#remark').val(gpData.remarks || '');
        $('#enclosure').val(gpData.encl || '');
        // ── contract name, if this modal shows a contract field, e.g. #contract1 ──
        $('#contract1').val(getContractName(gpData.project));   // add/rename selector to match your modal's actual field id

        const header = Array.isArray(rgpData) ? rgpData[0] : rgpData;
        if (header) {
            const locId = header.Employee_Sender_Location;
            const locName = (locId === 'OTHER')
                ? 'Others'
                : (locMap[String(locId)] || locId || '');
            $('#empaddress1non').val(locName);
            $('#employeeaddress1non').val(header.Employee_Address || '');
        } else {
            $('#empaddress1non').val('');
            $('#employeeaddress1non').val('');
        }

        selectedgpid = gpid;

        let itemRows = '';
        if (!Array.isArray(itemsData) || itemsData.length === 0) {
            console.warn('CancelNoReturnable: no item rows for gp_no=', gp_no);
        }
        itemsData.forEach((item, i) => {
            const rawUm    = item.UM ?? item.um ?? '';
            const unitName = unitMap[String(rawUm).trim().toUpperCase()] || unitMap[String(rawUm).trim()] || (rawUm && String(rawUm) !== '0' ? rawUm : '');
            const curItem  = itemListMap[String(item.item ?? item.itemId).trim()];
            const itemLabel = item.ItemNo || (curItem ? curItem.itemNo : item.item);

            itemRows += `<tr>
                <td>${i+1}</td>
                <td><select class="form-control form-control-sm" disabled><option value="${item.itemId ?? item.item}" selected>${itemLabel}</option></select></td>
                <td><input type="text" class="form-control form-control-sm" value="${unitName}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmDescription1 || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmDescription2 || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.qty || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmPrice || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmRemarks || ''}" readonly></td>
            </tr>`;
        });
        $('#Table3 tbody').html(itemRows);
        $('#exampleModalScrollable126').modal('show');

    } catch (e) { console.error('CancelNoReturnable error:', e); }
}*/

async function CancelNoReturnable(gpid, gp_no) {
    if (!allowedActions.includes('Cancel')) { alert('You do not have permission to Cancel.'); return; }

    try {
        await loadUserList();
        await loadContractList();      // ← added
        const locMap = await loadFactoryLocationMap();

        const gpData = await fetch(new URL(`/api/returnable/${gpid}`, baseUrl1), { credentials: 'include' }).then(r => r.json());
        const requestId = gpData.Request_Id ?? gpData.request_Id ?? gpData.requestId ?? null;

        const [rgpData, itemsData, itemsList, clients] = await Promise.all([
            requestId
                ? fetch(new URL(`/api/rgp/edit/${requestId}`, baseUrl), { credentials: 'include' }).then(r => r.json())
                : Promise.resolve(null),
            fetch(new URL(`/jssl/contracts/jims/gpnoitemdetails?gp_no=${gp_no}`, baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/items/all', baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/clients', baseUrl1), { credentials: 'include' }).then(r => r.json())
        ]);

        const clientMap = {};
        clients.forEach(c => { clientMap[String(c.cid).trim()] = `${c.client_number} - ${c.name}`; });
        const unitMap = {};
        itemsList.forEach(u => {
            if (u.uid)  unitMap[String(u.uid).trim()]           = u.unit;
            if (u.unit) unitMap[u.unit.trim().toUpperCase()]     = u.unit;
        });
        const itemListMap = {};
        itemsList.forEach(it => { itemListMap[String(it.itemid).trim()] = it; });

        const reqName = userMapCache[String(gpData.requestedby).trim()]?.username || gpData.requestedby;
        $('#requestedby1').val(reqName || '');
        $('#department5').val(getDepartmentName(gpData.dept));
        $('#despatch').val(getShipmentModeName(gpData.sentThrough) || '');
        $('#ngptransportnamecl').val(getShipmentModeName(gpData.transportName));
        $('#ngpvehiclenocl').val(getShipmentModeName(gpData.vehicleNo));

        // ── Sent To Vendor/Employee — mirrors cancelReturnable's isVendorGp logic ──
        let sentToDisplay = '';
        const isVendorGp = !!(gpData.sentToClient && gpData.sentToClient !== 0 && gpData.sentToClient !== '');

        if (gpData.sentToemployee && gpData.sentToemployee !== 0 && gpData.sentToemployee !== '') {
            sentToDisplay = userMapCache[String(gpData.sentToemployee).trim()]?.username || gpData.sentToemployee;
        } else if (isVendorGp) {
            sentToDisplay = clientMap[String(gpData.sentToClient).trim()] || gpData.sentToClient;
        }
        $('#vendor1').val(sentToDisplay);

        $('#date').val(formatDate(gpData.createddate));
        $('#reason').val(gpData.note || '');
        $('#remark').val(gpData.remarks || '');
        $('#enclosure').val(gpData.encl || '');
        // ── contract name, if this modal shows a contract field, e.g. #contract1 ──
        $('#contract1').val(getContractName(gpData.project));   // add/rename selector to match your modal's actual field id

        const header = Array.isArray(rgpData) ? rgpData[0] : rgpData;
        if (header) {
            const locId = header.Employee_Sender_Location;
            const locName = (locId === 'OTHER')
                ? 'Others'
                : (locMap[String(locId)] || locId || '');
            $('#empaddress1non').val(locName);
            $('#employeeaddress1non').val(header.Employee_Address || '');
        } else {
            $('#empaddress1non').val('');
            $('#employeeaddress1non').val('');
        }

        selectedgpid = gpid;

        // ── NEW: keep this cancel run's context available to canceladdngp() ──
        window.cancelIsVendorGp     = isVendorGp;
        window.cancelItemRequestIds = [];

        let itemRows = '';
        if (!Array.isArray(itemsData) || itemsData.length === 0) {
            console.warn('CancelNoReturnable: no item rows for gp_no=', gp_no);
        }
        itemsData.forEach((item, i) => {
            const rawUm    = item.UM ?? item.um ?? '';
            const unitName = unitMap[String(rawUm).trim().toUpperCase()] || unitMap[String(rawUm).trim()] || (rawUm && String(rawUm) !== '0' ? rawUm : '');
            const curItem  = itemListMap[String(item.item ?? item.itemId).trim()];
            const itemLabel = item.ItemNo || (curItem ? curItem.itemNo : item.item);

            // ── NEW: collect itemrequestId for the vendor-branch cancel update ──
            if (item.itemrequestId !== undefined && item.itemrequestId !== null && item.itemrequestId !== '') {
                window.cancelItemRequestIds.push(parseInt(item.itemrequestId, 10));
            }

            itemRows += `<tr data-item-request-id="${item.itemrequestId || ''}">
                <td>${i+1}</td>
                <td><select class="form-control form-control-sm" disabled><option value="${item.itemId ?? item.item}" selected>${itemLabel}</option></select></td>
                <td><input type="text" class="form-control form-control-sm" value="${unitName}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmDescription1 || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmDescription2 || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.qty || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmPrice || ''}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itmRemarks || ''}" readonly></td>
            </tr>`;
        });
        $('#Table3 tbody').html(itemRows);
        $('#exampleModalScrollable126').modal('show');

    } catch (e) { console.error('CancelNoReturnable error:', e); }
}

async function editNoReturnable(gpid, gp_no) {
    if (!allowedActions.includes('Edit')) { alert('You do not have permission to edit.'); return; }

    try {
        await loadUserList();
        await loadShipmentDelivery();
        await loadContractList();               // ← added
        const locMap = await loadFactoryLocationMap();

        const gpData = await fetch(new URL(`/api/returnable/${gpid}`, baseUrl1), { credentials: 'include' }).then(r => r.json());
        const requestId = gpData.Request_Id ?? gpData.request_Id ?? gpData.requestId ?? null;

        const [rgpData, itemsData, itemsList, unitsList, clients] = await Promise.all([
            requestId
                ? fetch(new URL(`/api/rgp/edit/${requestId}`, baseUrl), { credentials: 'include' }).then(r => r.json())
                : Promise.resolve(null),
            fetch(new URL(`/jssl/contracts/jims/gpnoitemdetails?gp_no=${gp_no}`, baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/items', baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/items/all', baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/clients', baseUrl1), { credentials: 'include' }).then(r => r.json())
        ]);

        originalNonReturnableData = {
            requestedby:  String(gpData.requestedby || '').trim(),
            dept:         String(gpData.dept || '').trim(),
            sentToClient: String(gpData.sentToClient || '').trim(),
            sentThrough:  String(gpData.sentThrough || '').trim(),
			transport_name: String(gpData.ngptransportname || '').trim(),   
			vehicle_no: String(gpData.ngpvehicleno || '').trim(),        
            returnDate:   String(gpData.returnDate || '').trim(),
            contract:     String(gpData.project || '').trim(),
            note:         String(gpData.note || '').trim(),
            remarks:      String(gpData.remarks || '').trim(),
            encl:         String(gpData.encl || '').trim()
        };

        const clientMap = {};
        clients.forEach(c => { clientMap[String(c.cid).trim()] = `${c.client_number}-${c.name}`; });

        const requestedByName = userMapCache[String(gpData.requestedby).trim()]?.username || gpData.requestedby;
        $('#requested1up').val(requestedByName);
        $('#requested1upIdnon').val(gpData.requestedby);
        $('#department6up').val(getDepartmentName(gpData.dept));
        $('#despatchmodeup').val(getShipmentModeName(gpData.sentThrough));
		$('#ngptransportnameup').val(getShipmentModeName(gpData.transportName));
		$('#ngpvehiclenoup').val(getShipmentModeName(gpData.vehicleNo));

        // ── Contract: show NAME, not raw id ──
        $('#contract6up').val(gpData.project);                       // keep raw id for submit logic if needed elsewhere
        $('#contract6upDisplay').val(getContractName(gpData.project)); // ← FIXED: display name

        $('#fordispatch1up').val(gpData.note);
        $('#remarks6up').val(gpData.remarks);
        $('#enclosure5up').val(gpData.encl);
        selectedgpid = gpid;
        rowsToUpdate = [];
        rowsToDelete = [];

        const sentToEmp    = gpData.sentToemployee;
        const sentToClient = gpData.sentToClient;
        selectedNonReturnableSentToClient   = '';
        selectedNonReturnableSentToEmployee = '';

        if (sentToEmp && sentToEmp !== 0 && sentToEmp !== '') {
            $('#selectvendorupnon').val('2');
            $('#employeeupnon').val(userMapCache[String(sentToEmp).trim()]?.username || sentToEmp);
            $('#tovendorup').val('');
            selectedNonReturnableSentToEmployee = sentToEmp;
            $('#selectvendorupDisplaynon').val('Employee');
        } else if (sentToClient && sentToClient !== 0 && sentToClient !== '') {
            $('#selectvendorupnon').val('1');
            $('#tovendorup').val(clientMap[String(sentToClient).trim()] || sentToClient);
            $('#employeeupnon').val('');
            selectedNonReturnableSentToClient = sentToClient;
            $('#selectvendorupDisplaynon').val('Vendor');
        }

        // ── Employee Location / Address ──
        const header = Array.isArray(rgpData) ? rgpData[0] : rgpData;
        if (header) {
            const locId = header.Employee_Sender_Location;
            const locName = (locId === 'OTHER')
                ? 'Others'
                : (locMap[String(locId)] || locId || '');
            $('#empaddressupnon').val(locName);
            $('#employeeaddressupnon').val(header.Employee_Address || '');
        } else {
            $('#empaddressupnon').val('');
            $('#employeeaddressupnon').val('');
        }

        if ($('#selectvendorupnon').val() === '2') {
            $('#empLocationRowupnon').show();
        } else {
            $('#empLocationRowupnon').hide();
        }

        // ── FIX: item name + unit resolution mirrors editReturnable exactly ──
        const unitsMap = {};
        unitsList.forEach(u => {
            if (u.uid)  unitsMap[String(u.uid).trim()]           = u.unit;
            if (u.unit) unitsMap[u.unit.trim().toUpperCase()]     = u.unit;
        });
        const itemListMap = {};
        itemsList.forEach(item => { itemListMap[String(item.itemid).trim()] = item; });

        const tbody = $('#TableID1non tbody');
        tbody.empty();

        if (!Array.isArray(itemsData) || itemsData.length === 0) {
            console.warn('editNoReturnable: no item rows returned for gp_no=', gp_no);
        }

        itemsData.forEach((item, i) => {
            const n    = i + 1;
            const cur  = itemListMap[String(item.item).trim()];   // ← FIXED key lookup (trim + string match)
            const rawUm = item.UM ?? item.um ?? '';
            const unit  = unitsMap[String(rawUm).trim().toUpperCase()] || unitsMap[String(rawUm).trim()] || rawUm || '';

            tbody.append(`
                <tr>
                    <td>${n}</td>
                    <td><select class="form-control form-control-sm" id="itemno${n}" disabled>
                        <option selected>${cur ? cur.itemNo : (item.ItemNo || item.item)}</option></select></td>
                    <td><input type="text" class="form-control form-control-sm" id="unit${n}" value="${unit}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="description1${n}" value="${item.itmDescription1 || ''}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="description2${n}" value="${item.itmDescription2 || ''}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="quantity${n}" value="${item.qty || ''}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" onkeydown="return allowOnlyPositive(event)" id="price${n}" value="${item.itmPrice || ''}"></td>
                    <td><input type="text" class="form-control form-control-sm" id="remarks${n}" value="${item.itmRemarks || ''}" readonly></td>
                </tr>`);
        });

        $('#requested1up, #department6up, #despatchmodeup, #tovendorup, #employeeupnon, ' +
          '#contract6upDisplay, #fordispatch1up, #remarks6up, ' +
          '#empaddressupnon, #employeeaddressupnon').prop('readonly', true).prop('disabled', true);
        $('#enclosure5up').prop('readonly', false).prop('disabled', false);

        $('#exampleModalScrollable15').modal('show');

    } catch (e) {
        console.error('editNoReturnable error:', e);
        alert('Failed to load data.');
    }
}

function validatengpUpdateFields() {
    let isValid = true;
    $('.error-message').hide();

    if (!$('#requested1up').val())     { $('#requested1uperror').show();     isValid = false; }
    if (!$('#despatchmodeup').val())   { $('#despatchmodeuperror').show();   isValid = false; }
    if (!$('#selectvendorupnon').val()){ $('#selectvendorupnonError').show(); isValid = false; }
    if (!$('#fordispatch1up').val())   { $('#fordispatch1uperror').show();   isValid = false; }

    return isValid;
}

/*function updatenonaddevent(gpid) {
    const now = getIndianDateTimeFormat(new Date());
    const updatedData = {
        requestedby:  String($('#requested1up').val() || '').trim(),
        dept:         String($('#department6up').val() || '').trim(),
        sentToClient: String($('#tovendor').val() || '').trim(),
        sentThrough:  String($('#despatchmodeup').val() || '').trim(),
        returnDate:   String($('#returndateup').val() || '').trim(),
        contract:     String($('#contract6up').val() || '').trim(),
        note:         String($('#fordispatch1up').val() || '').trim(),
        remarks:      String($('#remarks6up').val() || '').trim(),
        encl:         String($('#enclosure5up').val() || '').trim(),
        updatedBy:    createdById,
        updatedDate:  now
    };

    const isChanged = Object.keys(originalNonReturnableData).some(k =>
        String(originalNonReturnableData[k] || '') !== String(updatedData[k] || '')
    );

    if (!isChanged) { showPopup('No fields changed'); return; }

    fetch(new URL(`/api/returnable/${gpid}`, baseUrl1), {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify(updatedData)
    })
    .then(r => r.json())
    .then(() => {
        showPopup('Updated successfully!', 'NonReturnable.jsp');
        $('#container1Update').modal('hide');
        fetchReturnables();
    })
    .catch(e => { console.error(e); alert('Failed to update returnable.'); });
}*/

function updatenonaddevent(gpid) {
    const now = getIndianDateTimeFormat(new Date());

    const selectedRequestedBy = $('#requested1upIdnon').val() || originalNonReturnableData.requestedby;
    const requestedByDeptId   = (userMapCache[String(selectedRequestedBy)] || {}).department
                                  || originalNonReturnableData.dept || '';

    const sentType = String($('#selectvendorupnon').val() || '').trim();
    let sentToClientVal   = '';
    let sentToEmployeeVal = '';
    if (sentType === '2') {
        sentToEmployeeVal = selectedNonReturnableSentToEmployee || '';
    } else {
        sentToClientVal = selectedNonReturnableSentToClient || '';
    }

    const updatedData = {
        requestedby: String(selectedRequestedBy || '').trim(),
        dept: String(requestedByDeptId || '').trim(),
        sentToClient: String(sentToClientVal || '').trim(),
        sentToemployee: String(sentToEmployeeVal || '').trim(),
        sent_type: sentType,
        sentThrough: String($('#despatchmodeup').val() || '').trim(),
        contract: String($('#contract6up').val() || '').trim(),
        note: String($('#fordispatch1up').val() || '').trim(),
        remarks: String($('#remarks6up').val() || '').trim(),
        encl: String($('#enclosure5up').val() || '').trim(),
        updatedBy: createdById,
        updatedDate: now
    };

    const isChanged = Object.keys(originalNonReturnableData).some(k =>
        String(originalNonReturnableData[k] || '') !== String(updatedData[k] || '')
    );

    if (!isChanged && rowsToUpdate.length === 0) {
        showPopup('No fields changed');
        return;
    }

    fetch(new URL(`/api/returnable/${gpid}`, baseUrl1), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedData)
    })
    .then(r => { if (!r.ok) throw new Error('Header update failed'); return r.json(); })
    .then(async () => {
        if (rowsToUpdate.length > 0) {
            await Promise.all(
                rowsToUpdate.map(item =>
                    fetch(new URL(`/api/returnableitems/${item.gpdid}`, baseUrl1), {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            itmPrice: item.price,
                            qty: item.qty,
                            itmRemarks: item.remarks,
                            modified_by: createdById,
                            modified_date: now
                        })
                    })
                )
            );
        }
    })
    .then(() => {
        showPopup('Updated successfully!', 'NonReturnable.jsp');
        $('#container1Update').modal('hide');
        fetchNgpReturnables();
    })
    .catch(e => {
        console.error(e);
        alert('Failed to update returnable.');
    });
}

$('#TableID1non').on('change', 'input', function () {
    const row   = $(this).closest('tr');
    const n     = row.index() + 1;
    const gpdid = row.find(`#gpdid${n}`).val();
    const updated = {
        gpdid,
        price:   row.find(`#price${n}`).val()    || '',
        qty:     row.find(`#quantity${n}`).val() || '',
        remarks: row.find(`#remarks${n}`).val()  || ''
    };
    const idx = rowsToUpdate.findIndex(r => r.gpdid === gpdid);
    if (idx !== -1) rowsToUpdate[idx] = updated;
    else rowsToUpdate.push(updated);
});

// ============================================================
// JQUERY MODAL WIRING (single $(document).ready)
// ============================================================

$(document).ready(function () {

    // ----- Returnable Create -----
    $('#showConfirmationPopup').click(function () {
        if (validateclienFields()) $('#exampleModalCenter66').modal('show');
    });
    $(document).on('click', '#confirmSubmission', function () {
        $('#exampleModalCenter66').modal('hide');
        clientaddevent();
    });

    // ----- Non-Returnable Create -----
    $('#showcreate').click(function () {
        if (validatengpFields()) $('#exampleModalCenter66').modal('show');
    });
    $(document).on('click', '#confirmYess', function () {
        $('#exampleModalCenter66').modal('hide');
        addngpevent();
    });

    // ----- Store Receive Qty Update -----
    $('#updstoreqty').click(function () { $('#exampleModalCenter74').modal('show'); });
    $('#confirmrecSubmission').click(function () {
        $('#exampleModalCenter74').modal('hide');
        updatestoreqty();
    });

    // ----- Cancel Returnable -----
    $('#cancel').click(function () { $('#exampleModalCenter69').modal('show'); });
    $('#confirmcancel').click(function () {
        $('#exampleModalCenter69').modal('hide');
        if (selectedgid) canceladd(selectedgid);
        else alert('Client ID not found.');
    });

	// ----- Cancel Non-Returnable -----
	$('#cancelnon').click(function () { $('#exampleModalCenter70').modal('show'); });
	$('#confirmngpcancel').click(function () {
	    $('#exampleModalCenter70').modal('hide');
	    if (selectedgpid) canceladdngp(selectedgpid);   // ✅ correct variable
	    else alert('Client ID not found.');
	});

    // ----- Update Returnable -----
    $('#updateButton').click(function () {
        if (validateUpdateFields()) $('#exampleModalCenter61').modal('show');
    });
    $('#confirmupdYes').click(function () {
        $('#exampleModalCenter61').modal('hide');
        if (selectedgid) updateaddevent(selectedgid);
        else alert('gpid not found.');
    });

	// ----- Update Non-Returnable -----
	$('#updatenonreturn').click(function () {
	    if (validatengpUpdateFields()) $('#exampleModalCenter60').modal('show');
	});
	$('#confirmupdYess').click(function () {
	    $('#exampleModalCenter60').modal('hide');
	    if (selectedgpid) updatenonaddevent(selectedgpid);   // this was already correct
	    else alert('gpid not found.');
	});

    // ----- Error modal OK -----
    $(document).on('click', '#modalokk', function () {
        $('#exampleModalCenterDuppUP').modal('hide');
    });

    // ----- Generic No/Close buttons -----
    $(".btn-secondary[data-dismiss='modal']").click(function () {
        $(this).closest('.modal').modal('hide');
    });
});

/*function loadRgpPrNoDropdown() {
    const factoryId = sessionStorage.getItem("selectedFactoryId");
    if (!factoryId) return;

    $.ajax({
        url       : new URL("/api/rgp/" + factoryId, baseUrl),
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (response) {
            const $dd = $("#regpr").empty()
                            .append('<option value="">Select RGPPr No</option>');

            if (!response || response.length === 0) return;

            // Fetch already-used Request_Ids from the returnable GP table
            $.ajax({
                url       : new URL("/jssl/contracts/jims/gptype_updatetables?gp_type=1&factory_id=" + factoryId, baseUrl1),
                type      : "GET",
                xhrFields : { withCredentials: true },
                success: function (usedGps) {
					const usedRequestIds = new Set(
					    (usedGps || [])
					        .filter(g => g.cancelstatus != 1)   // ← skip cancelled GPs, they don't count as "used"
					        .map(g => g.request_Id ?? g.Request_Id)
					        .filter(id => id !== null && id !== undefined && id !== '')
					        .map(id => String(id).trim())
					);

                    response.forEach(function (row) {
						if (row.Cancel == 1) return; 
                        const reqId = String(row.Request_Id).trim();
                        if (usedRequestIds.has(reqId)) return; // skip already-used PR No

                        $dd.append(
                            $("<option>", {
                                value: row.Request_Id,
                                text : row.PR_No
                            })
                        );
                    });
                },
                error: function (xhr) {
                    console.error("Failed to load used RGP request list", xhr);
                    // fallback: show all if the used-list fetch fails
                    response.forEach(function (row) {
						if (row.Cancel == 1) return;
                        $dd.append(
                            $("<option>", {
                                value: row.Request_Id,
                                text : row.PR_No
                            })
                        );
                    });
                }
            });
        },
        error: function (xhr) {
            console.error("Failed to load RGP PR No list", xhr);
        }
    });
}*/



function loadRgpPrNoDropdown() {
    const factoryId = sessionStorage.getItem("selectedFactoryId");
    if (!factoryId) return;

    $.ajax({
        url       : new URL("/api/dropdown/rgp/" + factoryId, baseUrl),
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (response) {
            const $dd = $("#regpr").empty()
                            .append('<option value="">Select RGPPr No</option>');

            if (!response || response.length === 0) return;

            response.forEach(function (row) {
                $dd.append(
                    $("<option>", {
                        value: row.requestId,
                        text : row.prNo
                    })
                );
            });
        },
        error: function (xhr) {
            console.error("Failed to load RGP PR No list", xhr);
        }
    });
}

// ============================================================
// POPULATE RETURNABLE CREATE MODAL FROM A SELECTED RGP REQUEST
// ============================================================

let itemrequest_id = [];
async function populateReturnableFromRgp(requestId) {
    try {
        await loadUserList();

        const [response, itemsList, unitsList] = await Promise.all([
            fetch(new URL(`/api/rgpVendor/edit/${requestId}`, baseUrl), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/items', baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/items/all', baseUrl1), { credentials: 'include' }).then(r => r.json()),
			fetch(new URL('/api/websmartuser/getAll', baseUrl), { credentials: 'include' }).then(r => r.json())
        ]);

        if (!response || response.length === 0) return;
        const header = response[0];

        // ── Requested By / Department ─────────────────────────────
        // (falls back gracefully if not present).
        /*const requesterId = header.RequestBy || header.Requested_By || header.CreatedBy || '';
        if (requesterId) {
            $('#requested1').val(String(requesterId));
            const info = userMapCache[String(requesterId)];
            $('#department').val(getDepartmentName(info ? info.department : ''));
        }*/
		const requesterId = header.Request_User || '';
		if (requesterId) {
		    const info = userMapCache[String(requesterId)];
		    const nameOpt = new Option(info ? info.username : requesterId, requesterId, true, true);
		    $('#requested1').empty().append(nameOpt);
		    $('#department').val(info ? getDepartmentName(info.department) : '');  // ← wrap with getDepartmentName
		}

        // ── Vendor / Employee ──────────────────────────────────────
        if (header.Vendor_Name && String(header.Vendor_Name) !== 'null') {
            $('#selectvendor').val('1');
            $('#tovendor').val(String(header.Vendor_Name));
            $('#employee').val('');
            $('#empLocationRow').hide();
            $('#empaddress').val('');
            $('#employeeaddress').val('');
            } else if (header.Employee_Name && String(header.Employee_Name) !== 'null') {
			    $('#selectvendor').val('2');
			    $('#employee').val(String(header.Employee_Name));
			    $('#tovendor').val('');
			    $('#empLocationRow').show();

			    const locId = header.Employee_Sender_Location;
			    const locMap = await loadFactoryLocationMap();
			    const locName = (locId === 'OTHER')
			        ? 'Others'
			        : (locMap[String(locId)] || locId || '');

			    $('#empaddress').val(locName);
			    $('#employeeaddress').val(header.Employee_Address || '');
			} else {
            $('#selectvendor').val('');
            $('#empLocationRow').hide();
        }

        // ── Return date / contract / remarks ────────────────────────
        const rd = header.Expected_Return_Date ? header.Expected_Return_Date.toString().split('T')[0] : '';
        $('#returndatee').val(rd);
        $('#contractno').val(header.Contract_No ? String(header.Contract_No) : '');
        $('#remarks5').val(header.Remarks || '');
		$('#fordispatch').val(header.reasondisptach || '');

        // ── Lock all header fields — sourced from RGP, not manual entry ──
		$('#requested1, #selectvendor, #employee, #returndatee, #contractno, #remarks5, #fordispatch,#tovendor')
		    .prop('disabled', true);

		// Keep Vendor editable
		$('#tovendor').prop('disabled', true).prop('readonly', true);
        $('#empaddress, #employeeaddress').prop('readonly', true);

        // ── Line items (readonly, driven by the RGP request rows) ──────
        const unitMap = {};
        unitsList.forEach(u => {
            if (u.uid)  unitMap[String(u.uid).trim()]            = u.unit;
            if (u.unit) unitMap[u.unit.trim().toUpperCase()]      = u.unit;
        });
        const itemMap = {};
        itemsList.forEach(it => { itemMap[String(it.itemid)] = it; });

        $('#TableID tbody').empty();
        let n = 0;
		itemrequest_id = [];
        response.forEach(row => {
			
            if (!row.Item_Id) return;
			itemrequest_id.push(row.ItemRequest_Id);
            n++;
            const item = itemMap[String(row.Item_Id)] || {};
            const unitName = unitMap[String(item.um).trim().toUpperCase()] || unitMap[String(item.um).trim()] || '';

            $('#TableID tbody').append(`
                <tr id="row${n}" data-item-id="${row.Item_Id}">
                    <td>${n}</td>
                    <td><input type="text" class="form-control form-control-sm"
                          value="${(item.itemNo || '') + ' - ' + (item.itmDescription1 || '')}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="unit${n}" value="${unitName}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="description1${n}" value="${item.itmDescription1 || ''}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="description2${n}" value="${item.itmDescription2 || ''}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="quantity${n}" value="${row.Quantity || ''}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="price${n}" value="${row.Price || ''}"></td>
                    <td><input type="text" class="form-control form-control-sm" id="remarks${n}" value="${row.Item_Remarks || ''}" readonly></td>
                </tr>`);
        });

    } catch (e) {
        console.error('populateReturnableFromRgp error:', e);
        alert('Failed to load the selected RGP request.');
    }
}

function resetReturnableFields() {
    $('#requested1, #selectvendor, #employee, #returndatee, #contractno, #remarks5')
        .prop('disabled', false).val('');

    $('#tovendor').prop('disabled', false).prop('readonly', false).val('');

    $('#empaddress, #employeeaddress')
        .prop('readonly', false).val('');

    $('#empLocationRow').hide();
    $('#TableID tbody').empty();
}

let factoryLocationMapCache = null;

async function loadFactoryLocationMap() {
    if (factoryLocationMapCache) return factoryLocationMapCache;
    try {
        const res  = await fetch(new URL('/api/allfactory', baseUrl), { credentials: 'include' });
        const data = await res.json();
        factoryLocationMapCache = {};
        (data || []).forEach(f => { factoryLocationMapCache[String(f.id)] = f.factory_name; });
    } catch (e) {
        console.error('loadFactoryLocationMap error:', e);
        factoryLocationMapCache = {};
    }
    return factoryLocationMapCache;
}

// ============================================================
// NRGP dropdown state (mirrors Returnable's selected*Returnable* vars)
// ============================================================
let selectedNonReturnableSentToClient   = '';
let selectedNonReturnableSentToEmployee = '';
//let originalNonReturnableData = {}; // already declared above — keep single declaration

// ============================================================
// LOAD NRGP PR NO DROPDOWN — pulls from NRGP source, not RGP
// ============================================================
/*function loadNgpRgpPrNoDropdown() {
    const factoryId = sessionStorage.getItem("selectedFactoryId");
    if (!factoryId) return;

    $.ajax({
        url       : new URL("/api/ngpb/" + factoryId, baseUrl),   // ← NRGP source (adjust if your route differs)
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (response) {
            const $dd = $("#regprnon").empty()
                            .append('<option value="">Select NRGPPr No</option>');

            if (!response || response.length === 0) return;

            // Exclude PR Nos already consumed by an existing Non-Returnable GP
            $.ajax({
                url       : new URL("/jssl/contracts/jims/gptype_updatetables?gp_type=2&factory_id=" + factoryId, baseUrl1),
                type      : "GET",
                xhrFields : { withCredentials: true },
                success: function (usedGps) {
                    const usedRequestIds = new Set(
                        (usedGps || [])
						    .filter(g => g.cancelstatus != 1)   // ← skip cancelled GPs, they don't count as "used"
                            .map(g => g.request_Id ?? g.Request_Id)
                            .filter(id => id !== null && id !== undefined && id !== '')
                            .map(id => String(id).trim())
                    );

                    response.forEach(function (row) {
						if (row.Cancel == 1) return; 
                        const reqId = String(row.Request_Id).trim();
                        if (usedRequestIds.has(reqId)) return;

                        $dd.append($("<option>", { value: row.Request_Id, text: row.PR_No }));
                    });
                },
                error: function (xhr) {
                    console.error("Failed to load used NRGP request list", xhr);
                    response.forEach(function (row) {
						if (row.Cancel == 1) return; 
                        $dd.append($("<option>", { value: row.Request_Id, text: row.PR_No }));
                    });
                }
            });
        },
        error: function (xhr) {
            console.error("Failed to load NRGP PR No list", xhr);
        }
    });
}*/


function loadNgpRgpPrNoDropdown() {
    const factoryId = sessionStorage.getItem("selectedFactoryId");
    if (!factoryId) return;

    $.ajax({
        url       : new URL("/api/dropdown/nrgp/" + factoryId, baseUrl),
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (response) {
            const $dd = $("#regprnon").empty()
                            .append('<option value="">Select NRGPPr No</option>');

            if (!response || response.length === 0) return;

            response.forEach(function (row) {
                $dd.append(
                    $("<option>", {
                        value: row.requestId,
                        text : row.prNo
                    })
                );
            });
        },
        error: function (xhr) {
            console.error("Failed to load RGP PR No list", xhr);
        }
    });
}

// ============================================================
// POPULATE NON-RETURNABLE CREATE MODAL FROM A SELECTED NRGP REQUEST
// Mirrors populateReturnableFromRgp() exactly.
// ============================================================

let itemrnreqeust_id = [];
async function populateNonReturnableFromRgp(requestId) {
    try {
        await loadUserList();

        const [response, itemsList, unitsList] = await Promise.all([
            fetch(new URL(`/api/rgpVendor/edit/${requestId}`, baseUrl), { credentials: 'include' }).then(r => r.json()),  // ← NRGP source
            fetch(new URL('/api/items', baseUrl1), { credentials: 'include' }).then(r => r.json()),
            fetch(new URL('/api/items/all', baseUrl1), { credentials: 'include' }).then(r => r.json()),
			fetch(new URL('/api/websmartuser/getAll', baseUrl), { credentials: 'include' }).then(r => r.json())
        ]);

        if (!response || response.length === 0) return;
        const header = response[0];

        // ── Requested By / Department ──
        const requesterId = header.Request_User || '';
        if (requesterId) {
            const info = userMapCache[String(requesterId)];
            const nameOpt = new Option(info ? info.username : requesterId, requesterId, true, true);
            $('#requestednon1').empty().append(nameOpt);
            $('#department6').val(info ? getDepartmentName(info.department) : '');
        }

		// ── Vendor / Employee ──
		if (header.Vendor_Name && String(header.Vendor_Name) !== 'null') {
		    $('#selectvendornon').val('1');
		    $('#vendor').val(String(header.Vendor_Name));
		    $('#employeenon').empty().val('');
		    $('#empLocationRownon').hide();
		    $('#empaddressnon').val('');
		    $('#employeeaddressnon').val('');
		} else if (header.Employee_Id || (header.Employee_Name && String(header.Employee_Name) !== 'null')) {
		    $('#selectvendornon').val('2');

		    const empId = header.Employee_Id || header.Employee_Name;
		    const empInfo = userMapCache[String(empId)];
		    const empDisplayName = empInfo ? empInfo.username : empId;

		    const empOpt = new Option(String(empDisplayName), empId, true, true);
		    $('#employeenon').empty().append(empOpt);

		    $('#vendor').val('');
		    $('#empLocationRownon').show();

		    const locId = header.Employee_Sender_Location;
		    const locMap = await loadFactoryLocationMap();
		    const locName = (locId === 'OTHER')
		        ? 'Others'
		        : (locMap[String(locId)] || locId || '');

		    $('#empaddressnon').val(locName);
		    $('#employeeaddressnon').val(header.Employee_Address || '');
		} else {
		    $('#selectvendornon').val('');
		    $('#empLocationRownon').hide();
		}

        // Trigger the enable/disable toggle to match the selection made above
        $('#selectvendornon').trigger('change');

        // ── Dispatch mode / Contract / Remarks / Reason ──
        if (header.Mode_Of_Dispatch) $('#despatchmode').val(header.Mode_Of_Dispatch);
        $('#contract6').val(header.Contract_No ? String(header.Contract_No) : '');
        $('#remarks6').val(header.Remarks || '');
        $('#fordispatch1').val(header.reasondisptach || '');

        // ── Lock header fields sourced from NRGP ──
        $('#requestednon1, #vendor, #selectvendornon, #employeenon, #contract6, #remarks6, #fordispatch1')
            .prop('disabled', true);

        // Keep Vendor editable, same as Returnable's #tovendor
        //$('#vendor').prop('disabled', false).prop('readonly', false);
        $('#empaddressnon, #employeeaddressnon').prop('readonly', true);

        // ── Line items ──
        const unitMap = {};
        unitsList.forEach(u => {
            if (u.uid)  unitMap[String(u.uid).trim()]        = u.unit;
            if (u.unit) unitMap[u.unit.trim().toUpperCase()] = u.unit;
        });
        const itemMap = {};
        itemsList.forEach(it => { itemMap[String(it.itemid)] = it; });

        $('#TableIDnon tbody').empty();
        let n = 0;
		itemrnreqeust_id = [];
        response.forEach(row => {
            if (!row.Item_Id) return;
			itemrnreqeust_id.push(row.ItemRequest_Id);
            n++;
            const item = itemMap[String(row.Item_Id)] || {};
            const unitName = unitMap[String(item.um).trim().toUpperCase()] || unitMap[String(item.um).trim()] || '';

            $('#TableIDnon tbody').append(`
                <tr id="rownon${n}" data-item-id="${row.Item_Id}">
                    <td>${n}</td>
                    <td><input type="text" class="form-control form-control-sm"
                          value="${(item.itemNo || '') + ' - ' + (item.itmDescription1 || '')}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="unit${n}" value="${unitName}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="description1${n}" value="${item.itmDescription1 || ''}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="description2${n}" value="${item.itmDescription2 || ''}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="quantity${n}" value="${row.Quantity || ''}" readonly></td>
                    <td><input type="text" class="form-control form-control-sm" id="price${n}" value="${row.Price || ''}"></td>
                    <td><input type="text" class="form-control form-control-sm" id="remarks${n}" value="${row.Item_Remarks || ''}" readonly></td>
                </tr>`);
        });

    } catch (e) {
        console.error('populateNonReturnableFromRgp error:', e);
        alert('Failed to load the selected NRGP request.');
    }
}

function resetNonReturnableFields() {
    $('#requestednon1, #selectvendornon, #employeenon, #contract6, #remarks6')
        .prop('disabled', false).val('');

    $('#vendor').prop('disabled', false).prop('readonly', false).val('');

    $('#empaddressnon, #employeeaddressnon')
        .prop('readonly', false).val('');

    $('#empLocationRownon').hide();
    $('#TableIDnon tbody').empty();
}

let contractListCache = null;
let contractMapCache  = {}; // contract_id -> JobCode (name)

async function loadContractList() {
    if (contractListCache) return contractListCache;
    try {
        const url = new URL('/jssl/contracts/allContracts', baseUrl1);
        url.searchParams.append('factory', selectedFactoryId);
        const res  = await fetch(url, { credentials: 'include' });
        const data = await res.json();
        contractListCache = Array.isArray(data.contracts) ? data.contracts : [];
        contractMapCache = {};
        contractListCache.forEach(c => {
            contractMapCache[String(c.contract_id).trim()] = c.JobCode || '';
        });
    } catch (e) {
        console.error('loadContractList error:', e);
        contractListCache = [];
        contractMapCache  = {};
    }
    return contractListCache;
}

function getContractName(contractId) {
    if (contractId === undefined || contractId === null || String(contractId).trim() === '') return '';
    return contractMapCache[String(contractId).trim()] || contractId;
}
