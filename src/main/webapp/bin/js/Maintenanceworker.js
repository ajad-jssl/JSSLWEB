/* ═══════════════════════════════════════════════════════════
   Maintenanceworker.js  – Worker Screen
   Multi-ticket support: worker can have N active tickets.
   Each active ticket shows as a pill in the topbar.
   Timers are DB-driven (NET_ELAPSED_SECONDS) — cross-device safe.
   Heartbeat POST every 2 min keeps LAST_HEARTBEAT fresh in DB.
   ═══════════════════════════════════════════════════════════ */

// ── Multi-ticket state: keyed by LOG_ID ──────────────────────────────────
// activeSessions = { logId: { logId, assignId, ticketId, ticketNo, whatBroke,
//                             reportedBy, assignedBy, isPaused,
//                             elapsedMs, resumeAt, intervalId } }
var activeSessions     = {};
var WORKER_EMP_VERIFIED = false;
var heartbeatInterval  = null;

function getWorkerId()  { return localStorage.getItem('worker_emp_code') || ''; }
function getFactoryId() { return parseInt(localStorage.getItem('selectedFactoryId') || '0'); }

// ═══════════════════════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════════════════════
$(document).ready(function () {
	$('#sidebarToggleTop').click(function () {
	     $('#accordionSidebar').toggleClass('toggled');
	 });
    checkEmpVerification();
    setInterval(function () {
        if (WORKER_EMP_VERIFIED) { loadWorkerTickets(); loadNotifications(); }
    }, 30000);
});

// ═══════════════════════════════════════════════════════════════════════════
// EMP VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════
function checkEmpVerification() {
    var stored = localStorage.getItem('worker_emp_code');
    if (stored) {
        verifyEmpCodeBackend(stored, function (ok, empName) {
            if (ok) {
                WORKER_EMP_VERIFIED = true;
                showVerifiedStrip(stored, empName);
                restoreActiveSessions();
                loadWorkerTickets();
                loadNotifications();
            } else {
                localStorage.removeItem('worker_emp_code');
                localStorage.removeItem('worker_emp_name');
                showEmpModal('Stored employee code could not be verified. Please re-enter.');
            }
        });
    } else {
        showEmpModal('');
    }
}

function showEmpModal(errorMsg) {
    $('#empVerifyError').text(errorMsg || '').toggle(!!errorMsg);
    $('#empCodeInput').val('').prop('disabled', false);
    $('#empVerifyBtn').prop('disabled', false)
                     .html('<i class="fas fa-unlock-alt"></i> Verify &amp; Continue');
    $('#empVerifyModal').modal({ backdrop: 'static', keyboard: false });
    $('#empVerifyModal').modal('show');
    setTimeout(function () { $('#empCodeInput').focus(); }, 400);
}

function verifyEmpCodeBackend(empCode, callback) {
    $.ajax({
        url:  new URL('/api/ticket/employee/verifyEmpCode', baseUrl).toString(),
        type: 'POST',
        data: { empCode: empCode, FactoryId: getFactoryId() },
        xhrFields: { withCredentials: true },
        success: function (res) { callback(!!(res && res.valid), res && res.empName ? res.empName : empCode); },
        error:   function ()    { callback(false, ''); }
    });
}

function submitEmpVerify() {
    var code = $('#empCodeInput').val().trim();
    if (!code) { $('#empVerifyError').text('Please enter your employee code.').show(); return; }
    $('#empVerifyBtn').prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Verifying...');
    $('#empVerifyError').hide();

    verifyEmpCodeBackend(code, function (ok, empName) {
        if (ok) {
            localStorage.setItem('worker_emp_code', code);
            localStorage.setItem('worker_emp_name', empName);
            WORKER_EMP_VERIFIED = true;
            $('#empVerifyModal').modal('hide');
            showVerifiedStrip(code, empName);
            restoreActiveSessions();
            loadWorkerTickets();
            loadNotifications();
        } else {
            $('#empVerifyBtn').prop('disabled', false)
                             .html('<i class="fas fa-unlock-alt"></i> Verify &amp; Continue');
            $('#empVerifyError').text('Employee code not found or not authorised.').show();
            $('#empCodeInput').val('').focus();
        }
    });
}

function showVerifiedStrip(empCode, empName) {
    $('#empVerifiedStrip').remove();
    var strip =
        '<div id="empVerifiedStrip" style="display:inline-flex;align-items:center;gap:10px;' +
        'background:#f2f8f5;border:1px solid #c8e6d8;border-radius:7px;' +
        'padding:7px 14px;font-size:12px;color:#2a5c42;margin-bottom:14px;">' +
        '<i class="fas fa-id-badge" style="color:#3d7a5c;"></i>' +
        '<span><strong>' + empCode + '</strong> – ' + empName + '</span>' +
        '<span style="background:#d6f0e4;color:#2a6645;font-size:11px;font-weight:700;' +
        'padding:2px 9px;border-radius:20px;margin-left:4px;">Verified ✓</span>' +
        '<button onclick="reVerifyEmp()" title="Switch employee" style="' +
        'background:none;border:none;color:#888;font-size:11px;cursor:pointer;padding:0 4px;">' +
        '<i class="fas fa-sync-alt"></i></button></div>';
    $('.page-heading').closest('.d-flex').after(strip);
}

function reVerifyEmp() {
    localStorage.removeItem('worker_emp_code');
    localStorage.removeItem('worker_emp_name');
    WORKER_EMP_VERIFIED = false;
    stopAllTimers();
    clearTopbarPills();
    activeSessions = {};
    stopHeartbeat();
    $('#empVerifiedStrip').remove();
    showEmpModal('');
}

$(document).on('keydown', '#empCodeInput', function (e) {
    if (e.key === 'Enter') { submitEmpVerify(); }
});

// ═══════════════════════════════════════════════════════════════════════════
// RESTORE ACTIVE SESSIONS FROM DB (cross-device)
// NET_ELAPSED_SECONDS computed by SQL Server — same on every device.
// ═══════════════════════════════════════════════════════════════════════════
function restoreActiveSessions() {
    var workerId  = getWorkerId();
    var factoryId = getFactoryId();
    if (!workerId || !factoryId) return;

    $.ajax({
        url:  new URL('/api/ticket/activeLog', baseUrl).toString(),
        type: 'GET',
        data: { workerId: workerId, factoryId: factoryId },
        xhrFields: { withCredentials: true },
        success: function (data) {
            var logs = data.activeLogs || [];
            if (!logs.length) return;

            logs.forEach(function (log) {
                var logId    = log.LOG_ID;
                var isPaused = (log.LOG_STATUS == 5);
                var netSec   = Math.max(0, parseInt(log.NET_ELAPSED_SECONDS || 0));

                activeSessions[logId] = {
                    logId:      logId,
                    assignId:   log.ASSIGN_ID,
                    ticketId:   log.TICKET_ID,
                    ticketNo:   log.TICKET_NO || '',
                    whatBroke:  log.WHAT_BROKE || '',
                    reportedBy: log.REPORTED_BY,
                    assignedBy: log.ASSIGNED_BY,
                    isPaused:   isPaused,
                    elapsedMs:  netSec * 1000,
                    resumeAt:   isPaused ? null : new Date(),
                    intervalId: null
                };

                addTopbarPill(logId);
                if (!isPaused) { startSessionTick(logId); }
                updatePillState(logId);
            });

            startHeartbeat();
            $('body').addClass('has-active-timer');
        },
        error: function () {}
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// LOAD WORKER TICKETS
// ═══════════════════════════════════════════════════════════════════════════
function loadWorkerTickets() {
    var workerId  = getWorkerId();
    var factoryId = getFactoryId();
    if (!workerId || !factoryId) return;

    $.ajax({
        url:  new URL('/api/ticket/workerTickets', baseUrl).toString(),
        type: 'GET',
        data: { workerId: workerId, factoryId: factoryId },
        xhrFields: { withCredentials: true },
        success: function (tickets) {
            var $tbody = $('#workerTicketTbody');
            $tbody.empty();
            if (!tickets || tickets.length === 0) {
                $tbody.append('<tr><td colspan="7"><div class="empty-state">' +
                    '<i class="fas fa-clipboard-check"></i>' +
                    '<p>No tickets assigned to you.</p></div></td></tr>');
                return;
            }
            $.each(tickets, function (i, t) {
                var aStatus   = parseInt(t.ASSIGN_STATUS);
                var actions   = buildActionButtons(t, aStatus);
                var shortDesc = t.PROBLEM_DESC
                    ? t.PROBLEM_DESC.substring(0, 55) + (t.PROBLEM_DESC.length > 55 ? '...' : '') : '';
                $tbody.append(
                    '<tr class="' + getWorkerRowClass(aStatus) + '" id="row-assign-' + t.ASSIGN_ID + '">' +
                    '<td><strong>' + (t.TICKET_NO || '') + '</strong></td>' +
                    '<td>' + (t.MACHINE_DESCRIPTION || '') + '</td>' +
                    '<td>' + (t.MACHINE_SUBCODE || '') + '</td>' +
                    '<td><span style="font-size:11px;font-weight:600;color:#37499A;">' + (t.WHAT_BROKE || '') + '</span></td>' +
                    '<td title="' + (t.PROBLEM_DESC || '') + '">' + shortDesc + '</td>' +
                    '<td>' + getAssignStatusLabel(aStatus) + '</td>' +
                    '<td id="actions-' + t.ASSIGN_ID + '">' + actions + '</td>' +
                    '</tr>'
                );
            });
        },
        error: function () { console.error('Failed to load worker tickets'); }
    });
}

function buildActionButtons(t, aStatus) {
    var session    = getSessionByAssignId(t.ASSIGN_ID);
    var logStatus  = parseInt(t.LOG_STATUS  || 0);   // from DB
    var activeLogId = t.ACTIVE_LOG_ID || null;

    // Determine logId — from active session first, then from DB
    var logId = session ? session.logId : activeLogId;

    // Determine isPaused — from active session first, then from DB log status
    var isPaused = session ? session.isPaused : (logStatus === 5);

    if (aStatus === 1) {
        return '<button class="btn-start-work" onclick="startWork(' +
            t.ASSIGN_ID + ',' + t.TICKET_ID + ',' +
            (t.REPORTED_BY || 0) + ',' + (t.ASSIGNED_BY || 0) + ')">' +
            '<i class="fas fa-play-circle"></i> Start Work</button>';

    } else if (aStatus === 2) {
        if (isPaused) {
            return resumeButton(t.ASSIGN_ID, logId)
                 + markFixedButton(t, logId)
                 + transferButton(t.ASSIGN_ID, t.TICKET_ID, logId);
        }
        return pauseButton(t.ASSIGN_ID, logId)
             + markFixedButton(t, logId)
             + transferButton(t.ASSIGN_ID, t.TICKET_ID, logId);

    } else if (aStatus === 3) {
        return '<span class="badge badge-resolved"><i class="fas fa-check-double"></i> Fixed – Awaiting Close</span>';
    }
    return '';
}

function pauseButton(assignId, logId) {
    return '<button class="btn-pause-work mr-1" onclick="pauseWork(' + assignId + ',' + (logId||'null') + ')">' +
           '<i class="fas fa-pause-circle"></i> Pause</button>';
}
function resumeButton(assignId, logId) {
    return '<button class="btn-resume-work mr-1" onclick="resumeWork(' + assignId + ',' + (logId||'null') + ')">' +
           '<i class="fas fa-play-circle"></i> Resume</button>';
}
function markFixedButton(t, logId) {
    return '<button class="btn-mark-fixed" onclick="openFixedModal(' +
           t.ASSIGN_ID + ',' + t.TICKET_ID + ',' +
           (t.REPORTED_BY || 0) + ',' + (t.ASSIGNED_BY || 0) + ',' + (logId||'null') + ')">' +
           '<i class="fas fa-check-circle"></i> Mark Fixed</button>';
}

function transferButton(assignId, ticketId, logId) {

    return '<button class="btn-transfer-ticket ml-1" ' +
           'onclick="openTransferModal(' +
           assignId + ',' +
           ticketId + ',' +
           (logId || "null") +
           ')">' +
           '<i class="fas fa-random"></i> Transfer</button>';
}

function openTransferModal(
    assignId,
    ticketId,
    logId

    
) {

	let factoryId = localStorage.getItem("selectedFactoryId");
	
	
    _transferCtx = {
        assignId: assignId,
        ticketId: ticketId,
        logId: logId,
        factoryId: factoryId,
      
    };

	console.log("teh transfer ticket is this ",_transferCtx);
    $('#transferReason').val('');

    $('#transferModal').modal('show');
}
function submitTransferRequest() {
 
    var reason = $('#transferReason').val().trim();
 
    if (!reason) {
        alert('Please enter a transfer reason.');
        return;
    }
 
    $.ajax({
        url:  new URL('/api/ticket/transferTicket', baseUrl).toString(),
        type: 'POST',
        data: {
            assignId:       _transferCtx.assignId,
            ticketId:       _transferCtx.ticketId,
            logId:          _transferCtx.logId,
            factoryId:      _transferCtx.factoryId,
            assignedBy:     _transferCtx.assignedBy,
            workerId:       localStorage.getItem('worker_emp_code'),
            transferReason: reason
        },
        xhrFields: { withCredentials: true },
 
        success: function (res) {
            if (res.status) {
 
                /* ── Stop the timer for this ticket ────────────────────── */
                var logId = _transferCtx.logId;
 
                if (logId && activeSessions[logId]) {
 
                    /* 1. Stop the per-second tick */
                    stopSessionTick(logId);
 
                    /* 2. Remove the topbar pill */
                    removeTopbarPill(logId);
 
                    /* 3. Delete the session entry */
                    delete activeSessions[logId];
 
                    /* 4. If no sessions left, stop heartbeat + remove body class */
                    if (Object.keys(activeSessions).length === 0) {
                        stopHeartbeat();
                        $('body').removeClass('has-active-timer');
                    }
                }
                /* ─────────────────────────────────────────────────────── */
 
                $('#transferModal').modal('hide');
                $('#transferReason').val('');
 
                showToast('Transfer request submitted. Timer stopped.', 'success');
 
                loadWorkerTickets();
 
            } else {
                alert(res.message);
            }
        },
 
        error: function () {
            alert('Failed to submit transfer request.');
        }
    });
}


function getSessionByAssignId(assignId) {
    return Object.values(activeSessions).find(function (s) { return s.assignId == assignId; }) || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// START WORK
// ═══════════════════════════════════════════════════════════════════════════
function startWork(assignId, ticketId, reportedBy, assignedBy) {
    var workerId  = getWorkerId();
    var factoryId = getFactoryId();
    if (!workerId) { alert('Worker not verified. Please refresh.'); return; }
    if (!confirm('Start work on this ticket? Your time will begin tracking.')) return;

    $.ajax({
        url:  new URL('/api/ticket/startWork', baseUrl).toString(),
        type: 'POST',
        data: { ticketId: ticketId, assignId: assignId,
                factoryId: factoryId, workerId: workerId, reportedBy: reportedBy },
        xhrFields: { withCredentials: true },
        success: function (res) {
            if (res.status) {
                var logId     = res.logId;
                var ticketNo  = $('#row-assign-' + assignId + ' td:first strong').text();
                var whatBroke = $('#row-assign-' + assignId + ' td:eq(3) span').text();

                activeSessions[logId] = {
                    logId: logId, assignId: assignId, ticketId: ticketId,
                    ticketNo: ticketNo, whatBroke: whatBroke,
                    reportedBy: reportedBy, assignedBy: assignedBy,
                    isPaused: false, elapsedMs: 0,
                    resumeAt: new Date(), intervalId: null
                };

                addTopbarPill(logId);
                startSessionTick(logId);
                startHeartbeat();
                $('body').addClass('has-active-timer');
                loadWorkerTickets();
                showToast('Work started – ' + ticketNo + '! Timer running.', 'success');
            } else { alert('Error: ' + res.message); }
        },
        error: function () { alert('Failed to start work.'); }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// PAUSE WORK
// ═══════════════════════════════════════════════════════════════════════════
function pauseWork(assignId, logId) {
    if (!logId) { var s2 = getSessionByAssignId(assignId); logId = s2 ? s2.logId : null; }
    if (!logId) { alert('No active log. Please refresh.'); return; }
    var s = activeSessions[logId];
    if (!s) { alert('Session not found. Please refresh.'); return; }

    $.ajax({
        url:  new URL('/api/ticket/pauseWork', baseUrl).toString(),
        type: 'POST', data: { logId: logId, workerId: getWorkerId() },
        xhrFields: { withCredentials: true },
        success: function (res) {
            if (res.status) {
                if (s.resumeAt) { s.elapsedMs += (new Date() - s.resumeAt); }
                s.resumeAt = null; s.isPaused = true;
                stopSessionTick(logId);
                updatePillState(logId);
                loadWorkerTickets();
                showToast('Paused – ' + s.ticketNo, 'info');
            } else { alert('Error: ' + res.message); }
        },
        error: function () { alert('Failed to pause.'); }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// RESUME WORK
// ═══════════════════════════════════════════════════════════════════════════
function resumeWork(assignId, logId) {
    if (!logId) { var s2 = getSessionByAssignId(assignId); logId = s2 ? s2.logId : null; }
    if (!logId) { alert('No active log. Please refresh.'); return; }
    var s = activeSessions[logId];
    if (!s) { alert('Session not found. Please refresh.'); return; }

    $.ajax({
        url:  new URL('/api/ticket/resumeWork', baseUrl).toString(),
        type: 'POST', data: { logId: logId, workerId: getWorkerId() },
        xhrFields: { withCredentials: true },
        success: function (res) {
            if (res.status) {
                s.resumeAt = new Date(); s.isPaused = false;
                startSessionTick(logId);
                updatePillState(logId);
                loadWorkerTickets();
                showToast('Resumed – ' + s.ticketNo, 'success');
            } else { alert('Error: ' + res.message); }
        },
        error: function () { alert('Failed to resume.'); }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// OPEN MARK FIXED MODAL
// ═══════════════════════════════════════════════════════════════════════════
var _fixedCtx = {};
var _transferCtx = {};

function openFixedModal(assignId, ticketId, reportedBy, assignedBy, logId) {
    if (!logId || logId === 'null') {
        var s2 = getSessionByAssignId(assignId);
        logId = s2 ? s2.logId : null;
    }
    _fixedCtx = { assignId: assignId, ticketId: ticketId,
                  reportedBy: reportedBy, assignedBy: assignedBy, logId: logId };

    // Reset all fields
    $('#whatFixed').val('');
    $('#fixRemarks').val('');
	$('#itemSearchInput').val('');       // clear search
	$('#itemSearchCount').text('');      
    $('#chkPartsReplaced').prop('checked', false);
    $('#partsSection').hide();
    $('#selectedItemsTable').hide();
    $('#selectedItemsBody').empty();
    $('#itemsCheckList').html('<div style="text-align:center;color:#aaa;font-size:12px;padding:10px;"><i class="fas fa-spinner fa-spin"></i> Loading items...</div>');

    // Load machine items for this ticket
    loadMachineItems(ticketId);

    $('#fixedModal').modal('show');
}
function loadMachineItems(ticketId) {
    var factoryId = getFactoryId();
    $.ajax({
        url: new URL('/api/ticket/machineItems', baseUrl).toString(),
        type: 'GET',
        data: { ticketId: ticketId, factoryId: factoryId },
        xhrFields: { withCredentials: true },
        success: function (items) {
            var $list = $('#itemsCheckList');
            $list.empty();

            if (!items || items.length === 0) {
                $list.html('<div style="color:#aaa;font-size:12px;' +
                    'padding:8px;">No items found.</div>');
                return;
            }

            items.forEach(function (item) {
                // Full-row tappable label — works on mobile without Ctrl
                $list.append(
                    '<label class="item-row-label" ' +
                    '    data-id="' + item.itemid + '" ' +
                    '    style="display:flex;align-items:center;gap:12px;' +
                    '    padding:10px 12px;margin:0;cursor:pointer;' +
                    '    border-bottom:1px solid #f0f3fa;' +
                    '    -webkit-tap-highlight-color:rgba(55,73,154,.12);' +
                    '    user-select:none;">' +
                    '  <input class="item-checkbox" type="checkbox"' +
                    '    id="item_' + item.itemid + '"' +
                    '    data-id="' + item.itemid + '"' +
                    '    data-name="' + item.itmDescription1 + '"' +
                    '    data-unit="' + (item.UM || '') + '"' +
                    '    style="width:20px;height:20px;flex-shrink:0;' +
                    '    accent-color:#37499A;cursor:pointer;">' +
                    '  <span style="flex:1;font-size:13px;">' +
                           item.itmDescription1 +
                    '  </span>' +
                    '  <span style="font-size:11px;color:#888;' +
                    '    background:#f4f6fb;padding:2px 8px;' +
                    '    border-radius:20px;">' +
                           (item.UM || '—') +
                    '  </span>' +
                    '</label>'
                );
            });
			
			var totalCount = items.length;
			$('#itemSearchCount').text(totalCount + ' items');
			$('#itemSearchInput').val('').off('input').on('input', function () {
			    var q = $(this).val().trim().toLowerCase();
			    var visible = 0;
			    $('#itemsCheckList .item-row-label').each(function () {
			        var name = $(this).find('span:first').text().toLowerCase();
			        var show = !q || name.indexOf(q) !== -1;
			        $(this).toggle(show);
			        if (show) visible++;
			    });
			    $('#itemSearchCount').text(
			        q ? (visible + ' of ' + totalCount) : (totalCount + ' items')
			    );
			});
        },
        error: function () {
            $('#itemsCheckList').html(
                '<div style="color:#dc3545;font-size:12px;' +
                'padding:8px;">Failed to load items.</div>');
        }
    });
}

// ── Checkbox: toggle parts section ───────────────────────────────────────
$(document).on('change', '#chkPartsReplaced', function () {
    if ($(this).is(':checked')) {
        $('#partsSection').show();
    } else {
        $('#partsSection').hide();
        $('#selectedItemsTable').hide();
        $('#selectedItemsBody').empty();
        $('.item-checkbox').prop('checked', false);
    }
});

// ── Item checkbox: build quantity table ───────────────────────────────────
$(document).on('change', '.item-checkbox', function () {
    rebuildQuantityTable();
});

function rebuildQuantityTable() {
    var $tbody = $('#selectedItemsBody');
    $tbody.empty();

    var checked = $('.item-checkbox:checked');
    if (checked.length === 0) {
        $('#selectedItemsTable').hide();
        return;
    }

    checked.each(function () {
        var id   = $(this).data('id');
        var name = $(this).data('name');
        var unit = $(this).data('unit');

        // Keep existing qty if already entered
        var existingQty = $('#qty_' + id).val() || '';

        $tbody.append(
            '<tr>' +
            '<td style="vertical-align:middle;">' + name + '</td>' +
            '<td style="vertical-align:middle; color:#888;">' + (unit || '—') + '</td>' +
            '<td>' +
            '<input type="number" class="form-control form-control-sm item-qty"' +
            ' id="qty_' + id + '"' +
            ' data-id="' + id + '"' +
            ' data-name="' + name + '"' +
            ' data-unit="' + unit + '"' +
            ' min="1" value="' + existingQty + '"' +
            ' placeholder="Qty" style="width:90px;">' +
            '</td>' +
            '</tr>'
        );
    });

    $('#selectedItemsTable').show();
}
// ═══════════════════════════════════════════════════════════════════════════
// SUBMIT MARK FIXED
// ═══════════════════════════════════════════════════════════════════════════
function submitMarkFixed() {
    var whatFixed = $('#whatFixed').val().trim();
    var remarks   = $('#fixRemarks').val().trim();
    var workerId  = getWorkerId();
    var factoryId = getFactoryId();
    var ctx       = _fixedCtx;

    if (!whatFixed) { alert('Please describe what you fixed.'); return; }
    if (!ctx.logId) { alert('No active work log found. Please refresh.'); return; }
    if (!workerId)  { alert('Worker not verified. Please refresh.'); return; }

    // Collect parts
    var partsReplaced = $('#chkPartsReplaced').is(':checked');
    var partsData     = [];
    var partsValid    = true;

    if (partsReplaced) {
        var checked = $('.item-checkbox:checked');
        if (checked.length === 0) {
            alert('Please select at least one item, or uncheck "Any parts replaced?"');
            return;
        }

        $('.item-qty').each(function () {
            var qty = parseInt($(this).val() || '0');
            if (!qty || qty < 1) {
                alert('Please enter a valid quantity for: ' + $(this).data('name'));
                partsValid = false;
                return false; // break
            }
            partsData.push({
                itemId:   $(this).data('id'),
                itemName: $(this).data('name'),
                unit:     $(this).data('unit'),
                qty:      qty
            });
        });

        if (!partsValid) return;
    }

    $.ajax({
        url:  new URL('/api/ticket/markFixed', baseUrl).toString(),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            logId:        ctx.logId,
            assignId:     ctx.assignId,
            ticketId:     ctx.ticketId,
            factoryId:    factoryId,
            workerId:     workerId,
            whatFixed:    whatFixed,
            remarks:      remarks,
            assignedBy:   ctx.assignedBy,
            partsReplaced: partsReplaced ? 1 : 0,
            parts:        partsData   // array of { itemId, itemName, unit, qty }
        }),
        xhrFields: { withCredentials: true },
        success: function (res) {
            if (res.status) {
                stopSessionTick(ctx.logId);
                removeTopbarPill(ctx.logId);
                delete activeSessions[ctx.logId];
                if (Object.keys(activeSessions).length === 0) {
                    $('body').removeClass('has-active-timer');
                    stopHeartbeat();
                }
                $('#fixedModal').modal('hide');
                loadWorkerTickets();
                showToast('Marked as fixed! Supervisor notified.', 'success');
            } else { alert('Error: ' + res.message); }
        },
        error: function () { alert('Failed to mark fixed.'); }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// TOPBAR PILLS
// ═══════════════════════════════════════════════════════════════════════════
function ensureTopbarContainer() {
    if ($('#activeTimerPills').length === 0) {
        var $c = $('<li class="nav-item" id="activeTimerPills" ' +
            'style="display:flex;align-items:center;gap:6px;"></li>');
        $('.navbar-nav.ml-auto').prepend($c);
    }
    return $('#activeTimerPills');
}

function addTopbarPill(logId) {
    var s = activeSessions[logId];
    if (!s || $('#pill-' + logId).length) return;
    var $c = ensureTopbarContainer();
    $c.append(
        '<div id="pill-' + logId + '" ' +
        'style="display:inline-flex;align-items:center;gap:6px;' +
        'background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.35);' +
        'border-radius:20px;padding:4px 12px;font-size:11px;color:#fff;' +
        'cursor:pointer;white-space:nowrap;" ' +
        'onclick="openFixedModal(' + s.assignId + ',' + s.ticketId + ',' +
                                     (s.reportedBy||0) + ',' + (s.assignedBy||0) + ',' + logId + ')" ' +
        'title="Click to mark fixed">' +
        '<i class="fas fa-hard-hat" style="color:#4CAF50;font-size:10px;"></i>' +
        '<span>' + (s.ticketNo || 'Ticket') + '</span>' +
        '<span id="pill-clock-' + logId + '" ' +
        'style="font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.5px;">' +
        '00:00:00</span>' +
        '<span id="pill-status-' + logId + '" ' +
        'style="background:#d1e7dd;color:#0f5132;border-radius:20px;' +
        'padding:1px 7px;font-size:10px;font-weight:700;">●</span>' +
        '</div>'
    );
}

function removeTopbarPill(logId) {
    $('#pill-' + logId).remove();
    if ($('#activeTimerPills').children().length === 0) { $('#activeTimerPills').remove(); }
}

function clearTopbarPills() { $('#activeTimerPills').remove(); }

function updatePillState(logId) {
    var s = activeSessions[logId];
    if (!s) return;
    $('#pill-status-' + logId)
        .text(s.isPaused ? '⏸' : '●')
        .css(s.isPaused
            ? { background: '#fff3cd', color: '#856404' }
            : { background: '#d1e7dd', color: '#0f5132' });
}

// ═══════════════════════════════════════════════════════════════════════════
// TICK INTERVALS — one per session
// ═══════════════════════════════════════════════════════════════════════════
function startSessionTick(logId) {
    stopSessionTick(logId);
    var s = activeSessions[logId];
    if (!s) return;
    s.intervalId = setInterval(function () {
        if (!s.resumeAt) return;
        var netMs = s.elapsedMs + (new Date() - s.resumeAt);
        var secs  = Math.floor(netMs / 1000);
        $('#pill-clock-' + logId).text(
            pad(Math.floor(secs / 3600)) + ':' +
            pad(Math.floor((secs % 3600) / 60)) + ':' +
            pad(secs % 60)
        );
    }, 1000);
}

function stopSessionTick(logId) {
    var s = activeSessions[logId];
    if (s && s.intervalId) { clearInterval(s.intervalId); s.intervalId = null; }
}

function stopAllTimers() {
    Object.keys(activeSessions).forEach(function (k) { stopSessionTick(k); });
}

// ═══════════════════════════════════════════════════════════════════════════
// HEARTBEAT — every 2 minutes
// ═══════════════════════════════════════════════════════════════════════════
function startHeartbeat() {
    if (heartbeatInterval) return;
    heartbeatInterval = setInterval(sendHeartbeat, 2 * 60 * 1000);
    sendHeartbeat();
}

function stopHeartbeat() {
    if (heartbeatInterval) { clearInterval(heartbeatInterval); heartbeatInterval = null; }
}

function sendHeartbeat() {
    var workerId  = getWorkerId();
    var factoryId = getFactoryId();
    if (!workerId || !factoryId || Object.keys(activeSessions).length === 0) return;
    $.ajax({
        url:  new URL('/api/ticket/heartbeat', baseUrl).toString(),
        type: 'POST', data: { workerId: workerId, factoryId: factoryId },
        xhrFields: { withCredentials: true },
        error: function () { console.warn('[HB] Heartbeat failed'); }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════
function loadNotifications() {
    var userId    = parseInt(sessionStorage.getItem('id') || '0');
    var factoryId = getFactoryId();
    if (!userId || !factoryId) return;
    $.ajax({
        url:  new URL('/api/ticket/notifications', baseUrl).toString(),
        type: 'GET', data: { userId: userId, factoryId: factoryId },
        xhrFields: { withCredentials: true },
        success: function (data) {
            var count = data.unreadCount || 0;
            $('#notifBadge').text(count).toggle(count > 0);
            renderNotifDropdown(data.notifications || []);
        }, error: function () {}
    });
}

function renderNotifDropdown(notifications) {
    var $list = $('#notifList');
    $list.empty();
    if (!notifications.length) { $list.append('<div class="notif-empty">No notifications</div>'); return; }
    notifications.forEach(function (n) {
        var isRead = n.IS_READ == 1 || n.IS_READ === true;
        $list.append(
            '<div class="notif-item ' + (isRead ? '' : 'notif-unread') + '" ' +
            'onclick="markNotifRead(' + n.NOTIF_ID + ', this)">' +
            '<div class="notif-msg">' + n.NOTIF_MESSAGE + '</div>' +
            '<div class="notif-time">' +
            (n.CREATED_DATE ? new Date(n.CREATED_DATE).toLocaleString('en-IN') : '') +
            '</div></div>'
        );
    });
}

function markNotifRead(notifId, el) {
    $.ajax({
        url: new URL('/api/ticket/notifications/markRead', baseUrl).toString(),
        type: 'POST', data: { notifId: notifId }, xhrFields: { withCredentials: true },
        success: function () {
            $(el).removeClass('notif-unread');
            var c = parseInt($('#notifBadge').text() || '0') - 1;
            $('#notifBadge').text(c <= 0 ? 0 : c).toggle(c > 0);
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function pad(n) { return String(n).padStart(2, '0'); }

function getAssignStatusLabel(s) {
    return ({1:'<span class="ticket-badge badge-open">Assigned</span>',
             2:'<span class="ticket-badge badge-inprogress">Working ⏱</span>',
             3:'<span class="ticket-badge badge-fixed">Fixed ✓</span>',
             4:'<span class="ticket-badge badge-closed">Closed</span>'})[s]
           || '<span class="ticket-badge badge-open">Assigned</span>';
}

function getWorkerRowClass(s) {
    return ({1:'',2:'row-inprogress',3:'row-fixed',4:'row-closed'})[s] || '';
}

function showToast(msg, type) {
    var $t = $('<div class="toast-notif toast-' + type + '">' + msg + '</div>');
    $('body').append($t);
    setTimeout(function () { $t.addClass('show'); }, 10);
    setTimeout(function () { $t.removeClass('show'); setTimeout(function () { $t.remove(); }, 400); }, 3000);
}