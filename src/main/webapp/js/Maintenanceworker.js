/* ═══════════════════════════════════════════════════════════
   Maintenanceworker.js  – Worker Screen
   Multi-ticket support: worker can have N active tickets.
   Each active ticket shows as a pill in the topbar.
   Timers are DB-driven (NET_ELAPSED_SECONDS) — cross-device safe.
   Heartbeat POST every 2 min keeps LAST_HEARTBEAT fresh in DB.
   ═══════════════════════════════════════════════════════════ */

// ── Multi-ticket state: keyed by LOG_ID ──────────────────────────────────
var activeSessions     = {};
var WORKER_EMP_VERIFIED = false;
var heartbeatInterval  = null;

// ── Employee list used by the Close dialog (same API as ticker screen) ────
var closeEmployees = [];

let allowedActions = [];

async function loadActions() {
    const MainPage = window.location.pathname.split("/").pop()+'.jsp'; // e.g. "Maintenanceworker.jsp"
    const UserId   = sessionStorage.getItem('username');

    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
            {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            }
        );

        if (!response.ok) throw new Error("Failed to fetch actions");

        allowedActions = await response.json();
    } catch (error) {
        console.error("Error loading permitted actions:", error);
        allowedActions = [];
    }
}

function getWorkerId()  { return sessionStorage.getItem('worker_emp_code') || ''; }
function getFactoryId() { return parseInt(sessionStorage.getItem('selectedFactoryId') || '0'); }

// ═══════════════════════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════════════════════
$(document).ready(function () {
    loadActions();
    loadCloseEmployees();          // ← NEW: employee list for the Close dialog
    checkEmpVerification();
    setInterval(function () {
        if (WORKER_EMP_VERIFIED) { loadWorkerTickets(); loadNotifications(); }
    }, 30000);
});

// ═══════════════════════════════════════════════════════════════════════════
// EMP VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════
function checkEmpVerification() {
    var stored = sessionStorage.getItem('worker_emp_code');
    if (stored) {
        verifyEmpCodeBackend(stored, function (ok, empName) {
            if (ok) {
                WORKER_EMP_VERIFIED = true;
                showVerifiedStrip(stored, empName);
                restoreActiveSessions();
                loadWorkerTickets();
                loadNotifications();
            } else {
                sessionStorage.removeItem('worker_emp_code');
                sessionStorage.removeItem('worker_emp_name');
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
            sessionStorage.setItem('worker_emp_code', code);
            sessionStorage.setItem('worker_emp_name', empName);
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
    sessionStorage.removeItem('worker_emp_code');
    sessionStorage.removeItem('worker_emp_name');
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
                  '<td data-label="Ticket No.">' + '<strong>' + (t.TICKET_NO||'') + '</strong>' + '</td>' +
                  '<td data-label="Machine Category">' + (t.MACHINE_DESCRIPTION||'') + '</td>' +
                  '<td data-label="Machine">' + (t.MACHINE_SUBCODE||'') + '</td>' +
                  '<td data-label="Issue Type">' + '<span style="font-size:11px;font-weight:600;color:#37499A;">'+(t.WHAT_BROKE||'')+'</span>' + '</td>' +
                  '<td data-label="Description" title="'+(t.PROBLEM_DESC||'')+'">' + shortDesc + '</td>' +
                  '<td data-label="Status">' + getAssignStatusLabel(aStatus) + '</td>' +
                  '<td data-label="Actions" id="actions-' + t.ASSIGN_ID + '">' + actions + '</td>' +
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

    var logId = session ? session.logId : activeLogId;
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
        var assigns = t.assigns || [];
        var allDone = assigns.length === 0 || assigns.every(function (a) {
            return a.STATUS === 3 || a.STATUS === 6;
        });
        var activeWorkers = assigns.filter(function (a) {
            return a.STATUS !== 4 && a.STATUS !== 6;
        });

        var closeBtn;
        if (allDone) {
            closeBtn = '<button class="btn-close-action ml-1" style="background:#27ae60;" ' +
                       'onclick="confirmClose(' + t.TICKET_ID + ', ' + (t.REPORTED_BY || 0) + ')">' +
                       '<i class="fas fa-lock"></i> Close</button>';
        } else {
            var activeData = JSON.stringify(activeWorkers.map(function (a) {
                return { name: (a.WORKER_NAME || '').trim(), status: a.STATUS };
            }));
            closeBtn = '<button class="btn-close-action ml-1" style="background:#e67e22;"' +
                       ' data-ticket="' + t.TICKET_ID + '"' +
                       ' data-reported="' + (t.REPORTED_BY || 0) + '"' +
                       ' data-workers=\'' + activeData + '\'' +
                       ' onclick="confirmForceClose(this)">' +
                       '<i class="fas fa-lock"></i> Close</button>';
        }

        return '<span class="badge badge-resolved"><i class="fas fa-check-double"></i> Fixed – Awaiting Close</span> ' + closeBtn;
    }
    return '';
}

function pauseButton(assignId, logId) {
    return '<button class="btn-pause-work mr-1" onclick="pauseWork(' + assignId + ',' + (logId||'null') + ')">' +
           '<i class="fas fa-pause-circle"></i> Stop</button>';
}
function resumeButton(assignId, logId) {
    return '<button class="btn-resume-work mr-1" onclick="resumeWork(' + assignId + ',' + (logId||'null') + ')">' +
           '<i class="fas fa-play-circle"></i> ReStart</button>';
}
function markFixedButton(t, logId) {
    return '<button class="btn-mark-fixed" onclick="openFixedModal(' +
           t.ASSIGN_ID + ',' + t.TICKET_ID + ',' +
           (t.REPORTED_BY || 0) + ',' + (t.ASSIGNED_BY || 0) + ',' + (logId||'null') + ')">' +
           '<i class="fas fa-check-circle"></i> Work Complete</button>';
}

function transferButton(assignId, ticketId, logId) {
    return '<button class="btn-transfer-ticket ml-1" ' +
           'onclick="openTransferModal(' +
           assignId + ',' +
           ticketId + ',' +
           (logId || "null") +
           ')">' +
           '<i class="fas fa-random"></i> Release</button>';
}

function openTransferModal(assignId, ticketId, logId) {
    const allowed = typeof allowedActions !== "undefined" ? allowedActions : [];

    if (!allowed.includes("Release")) {
        Swal.fire({
            icon: 'warning',
            title: 'Access Denied',
            text: 'You do not have permission to release this ticket.',
            confirmButtonColor: '#37499A'
        });
        return;
    }

    let factoryId = sessionStorage.getItem("selectedFactoryId");

    _transferCtx = {
        assignId: assignId,
        ticketId: ticketId,
        logId: logId,
        factoryId: factoryId,
    };

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
            workerId:       sessionStorage.getItem('worker_emp_code'),
            transferReason: reason
        },
        xhrFields: { withCredentials: true },

        success: function (res) {
            if (res.status) {

                /* ── Stop the timer for this ticket ────────────────────── */
                var logId = _transferCtx.logId;

                if (logId && activeSessions[logId]) {
                    stopSessionTick(logId);
                    removeTopbarPill(logId);
                    delete activeSessions[logId];

                    if (Object.keys(activeSessions).length === 0) {
                        stopHeartbeat();
                        $('body').removeClass('has-active-timer');
                    }
                }

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

// ── SMALL HELPERS ───────────────────────────────────────────────────
function esc(s) {
    return $('<div>').text(s == null ? '' : s).html();
}
function cleanMobile(m) {
    var d = String(m == null ? '' : m).replace(/\D/g, '');
    return d.length > 10 ? d.slice(-10) : d;      // drops +91 / 0 prefix
}
function isValidMobile(m) { return /^[6-9]\d{9}$/.test(m); }

function nameInitials(n) {
    var p = String(n || '?').trim().split(/\s+/);
    return ((p[0] || '?')[0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
}

// Styles for the close dialog (injected once)
function ensureCloseDialogStyles() {
    if (document.getElementById('cd-styles')) return;
    var css = `
    .swal2-container { z-index: 20000 !important; }
    .select2-container { z-index: 20001; }
    .cd-wrap { text-align:left; font-size:13px; }
    .cd-label { font-size:11px; font-weight:700; color:#37499A; text-transform:uppercase;
                letter-spacing:.6px; margin:14px 0 6px; }
    .cd-req { color:#dc3545; }
    .cd-card { border:1px solid #e3e6f0; border-radius:10px; padding:10px 12px; background:#fff; }
    .cd-raiser { display:flex; align-items:center; gap:12px; background:#f4f6fb; transition:opacity .2s; }
    .cd-raiser.cd-dim { opacity:.5; }
    .cd-avatar { width:42px; height:42px; border-radius:50%; flex:0 0 42px;
                 background:linear-gradient(135deg,#37499A,#4CAF50); color:#fff;
                 display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; }
    .cd-info { min-width:0; }
    .cd-name { font-weight:700; color:#2b3a67; font-size:14px; white-space:nowrap;
               overflow:hidden; text-overflow:ellipsis; }
    .cd-meta { display:flex; flex-wrap:wrap; gap:6px; margin-top:4px; }
    .cd-chip { background:#fff; border:1px solid #d1d5e8; color:#555; border-radius:20px;
               padding:2px 9px; font-size:11px; font-weight:600; }
    .cd-chip i { margin-right:5px; color:#37499A; font-size:10px; }
    .cd-chip-warn { background:#fff3cd; border-color:#ffe08a; color:#856404; }
    .cd-chip-warn i { color:#856404; }

    .cd-switch-row { display:flex; align-items:center; gap:12px; margin:12px 0 8px; cursor:pointer;
                     padding:8px 10px; border-radius:10px; background:#fafbfe; border:1px dashed #d1d5e8; }
    .cd-switch { position:relative; width:42px; height:24px; flex:0 0 42px; }
    .cd-switch input { opacity:0; width:0; height:0; position:absolute; }
    .cd-slider { position:absolute; inset:0; background:#cfd4e6; border-radius:24px; transition:.2s; }
    .cd-slider:before { content:''; position:absolute; height:18px; width:18px; left:3px; top:3px;
                        background:#fff; border-radius:50%; transition:.2s; box-shadow:0 1px 3px rgba(0,0,0,.25); }
    .cd-switch input:checked + .cd-slider { background:#37499A; }
    .cd-switch input:checked + .cd-slider:before { transform:translateX(18px); }
    .cd-switch-text b { display:block; color:#333; font-size:13px; }
    .cd-switch-text small { color:#888; font-size:11px; }

    .cd-notify { border-color:#b9c3ea; background:#f8f9fe; margin-bottom:6px; }
    .cd-mobile-row { display:flex; align-items:center; margin-top:8px; background:#fff;
                     border:1px solid #d1d5e8; border-radius:6px; padding:0 10px; }
    .cd-mobile-row i { color:#37499A; margin-right:8px; }
    .cd-mobile-row input { border:0; outline:0; width:100%; padding:8px 0; font-size:13px;
                           background:transparent; }
    .cd-mobile-row input[readonly] { color:#555; }
    .cd-mobile-row:focus-within { border-color:#37499A; box-shadow:0 0 0 3px rgba(55,73,154,.1); }
    .cd-hint { color:#dc3545; font-size:11px; margin-top:6px; }

    .cd-sms { margin-top:10px; padding:8px 12px; border-radius:8px; font-size:12px; }
    .cd-sms i { margin-right:6px; }
    .cd-sms-ok   { background:#e8f5e9; color:#1b5e20; border:1px solid #c8e6c9; }
    .cd-sms-warn { background:#fff8e1; color:#8a6d00; border:1px solid #ffe8a3; }

    .cd-remarks { width:100%; min-height:80px; border:1px solid #d1d5e8; border-radius:8px;
                  padding:8px 10px; font-size:13px; resize:vertical; outline:0; }
    .cd-remarks:focus { border-color:#37499A; box-shadow:0 0 0 3px rgba(55,73,154,.1); }

    .cd-wrap .select2-container--default .select2-selection--single {
        height:38px; border:1px solid #d1d5e8; border-radius:6px; }
    .cd-wrap .select2-container--default .select2-selection--single .select2-selection__rendered {
        line-height:36px; font-size:13px; }
    .cd-wrap .select2-container--default .select2-selection--single .select2-selection__arrow { height:36px; }
    `;
    $('<style id="cd-styles">').text(css).appendTo('head');
}

// ── LOAD EMPLOYEES (same API as MaintenanceTicker) ─
function loadCloseEmployees() {
    $.ajax({
        url: new URL('/api/ticket/employee/getEmployeesByLocation', baseUrl).toString(),
        type: 'GET',
        data: { locid: 3 },                       // same value as ticker screen
        xhrFields: { withCredentials: true },
        success: function (res) { closeEmployees = res || []; },
        error: function () { console.error('Unable to load employee list'); }
    });
}

// ══════════════════════════════════════════════════════════════════════════
//  CLOSE TICKET  (normal + force) – shared dialog with SMS notify option
// ══════════════════════════════════════════════════════════════════════════
function denyClose() {
    Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'You do not have permission to close this ticket.',
        confirmButtonColor: '#37499A'
    });
}

function openCloseDialog(ticketId, reportedBy, extraHtml, opts) {
    $.ajax({
        url: new URL('/api/ticket/detail', baseUrl).toString(),
        type: 'GET', data: { ticketId: ticketId }, xhrFields: { withCredentials: true }
    }).done(function (detailRes) {
        var t = detailRes.ticket || {};

        // Raiser = employee chosen when the ticket was raised
        var rCode   = t.EMP_CODE || t.REPORTER_EMPCODE || '';
        var rName   = t.EMP_NAME || t.REPORTER_NAME    || '';
        var rMobile = cleanMobile(t.MOBILE_NO);

        var empOptions = '<option value=""></option>' + closeEmployees.map(function (e) {
            return '<option value="' + esc(e.EmpCode) + '" data-name="' + esc(e.EmployeeDisplay) +
                   '" data-mobile="' + esc(cleanMobile(e.telephone)) + '">' +
                   esc(e.EmployeeDisplay) + '</option>';
        }).join('');

        ensureCloseDialogStyles();

        var html = (extraHtml || '') +
          '<div class="cd-wrap">' +

            // ── Raiser card ──
            '<div class="cd-label">Ticket raised by</div>' +
            '<div class="cd-card cd-raiser">' +
              '<div class="cd-avatar">' + esc(nameInitials(rName)) + '</div>' +
              '<div class="cd-info">' +
                '<div class="cd-name">' + esc(rName || 'Unknown') + '</div>' +
                '<div class="cd-meta">' +
                  '<span class="cd-chip"><i class="fas fa-id-badge"></i>' + esc(rCode || '—') + '</span>' +
                  '<span class="cd-chip ' + (rMobile ? '' : 'cd-chip-warn') + '"><i class="fas fa-phone-alt"></i>' +
                    (rMobile || 'No mobile') + '</span>' +
                '</div>' +
              '</div>' +
            '</div>' +

            // ── Shift-over toggle ──
            '<label class="cd-switch-row">' +
              '<span class="cd-switch"><input type="checkbox" id="swal-other"><span class="cd-slider"></span></span>' +
              '<span class="cd-switch-text"><b>Raiser\'s shift is over</b>' +
              '<small>Notify another employee instead</small></span>' +
            '</label>' +

            // ── Notify another employee ──
            '<div id="swal-other-wrap" class="cd-card cd-notify" style="display:none;">' +
              '<div class="cd-label" style="margin-top:0;">Notify employee</div>' +
              '<select id="swal-emp" style="width:100%;">' + empOptions + '</select>' +
              '<div class="cd-mobile-row">' +
                '<i class="fas fa-mobile-alt"></i>' +
                '<input id="swal-mobile" maxlength="10" inputmode="numeric" readonly ' +
                       'placeholder="Mobile number (auto-filled)">' +
              '</div>' +
              '<div id="swal-hint" class="cd-hint" style="display:none;">' +
                '<i class="fas fa-exclamation-circle"></i> No number mapped for this employee. Please enter it manually.' +
              '</div>' +
            '</div>' +

            // ── Who will get the SMS ──
            '<div class="cd-sms" id="swal-sms-summary"></div>' +

            // ── Remarks ──
            '<div class="cd-label">Closing remarks <span class="cd-req">*</span></div>' +
            '<textarea id="swal-remarks" class="cd-remarks" placeholder="Enter closing remarks..."></textarea>' +
          '</div>';

        Swal.fire({
            title: opts.title, html: html, icon: opts.icon,
            showCancelButton: true, confirmButtonColor: opts.color, cancelButtonColor: '#aaa',
            confirmButtonText: '<i class="fas fa-lock mr-1"></i> ' + opts.confirmText,
            didOpen: function () {
                $('#swal-emp').select2({
                    width: '100%', placeholder: '-- Search employee by name or code --',
                    allowClear: true, dropdownParent: $(Swal.getPopup())
                });

                function updateSmsSummary() {
                    var $s = $('#swal-sms-summary');
                    if ($('#swal-other').is(':checked')) {
                        var $o = $('#swal-emp option:selected'), mob = cleanMobile($('#swal-mobile').val());
                        if (!$o.val()) {
                            $s.removeClass('cd-sms-ok').addClass('cd-sms-warn')
                              .html('<i class="fas fa-info-circle"></i> Select an employee to notify');
                        } else if (!isValidMobile(mob)) {
                            $s.removeClass('cd-sms-ok').addClass('cd-sms-warn')
                              .html('<i class="fas fa-info-circle"></i> Enter a valid mobile for ' + esc($o.data('name')));
                        } else {
                            $s.removeClass('cd-sms-warn').addClass('cd-sms-ok')
                              .html('<i class="fas fa-paper-plane"></i> SMS will be sent to <b>' +
                                    esc($o.data('name')) + '</b> · ' + mob);
                        }
                    } else if (isValidMobile(rMobile)) {
                        $s.removeClass('cd-sms-warn').addClass('cd-sms-ok')
                          .html('<i class="fas fa-paper-plane"></i> SMS will be sent to <b>' +
                                esc(rName) + '</b> · ' + rMobile);
                    } else {
                        $s.removeClass('cd-sms-ok').addClass('cd-sms-warn')
                          .html('<i class="fas fa-info-circle"></i> Raiser has no valid mobile – turn on the switch and pick another employee');
                    }
                }

                $('#swal-other').on('change', function () {
                    $('#swal-other-wrap').slideToggle(150);
                    $('.cd-raiser').toggleClass('cd-dim', this.checked);
                    updateSmsSummary();
                });

                // auto-fill mobile, or manual entry if no number is mapped
                $('#swal-emp').on('change', function () {
                    var o = $(this).find('option:selected'), m = cleanMobile(o.data('mobile'));
                    if (!o.val())              { $('#swal-mobile').val('').prop('readonly', true);  $('#swal-hint').hide(); }
                    else if (isValidMobile(m)) { $('#swal-mobile').val(m).prop('readonly', true);   $('#swal-hint').hide(); }
                    else                       { $('#swal-mobile').val('').prop('readonly', false).focus(); $('#swal-hint').show(); }
                    updateSmsSummary();
                });
                $('#swal-mobile').on('input', function () {
                    this.value = this.value.replace(/\D/g, '').slice(0, 10);
                    updateSmsSummary();
                });

                updateSmsSummary();
            },
            preConfirm: function () {
                var remarks = $('#swal-remarks').val().trim();
                if (!remarks) { Swal.showValidationMessage('Please enter closing remarks.'); return false; }

                if ($('#swal-other').is(':checked')) {
                    var $o = $('#swal-emp option:selected'), mob = cleanMobile($('#swal-mobile').val());
                    if (!$o.val())           { Swal.showValidationMessage('Please select an employee to notify.'); return false; }
                    if (!isValidMobile(mob)) { Swal.showValidationMessage('Enter a valid 10-digit mobile number.'); return false; }
                    return { remarks: remarks, notifyEmpCode: $o.val(), notifyName: $o.data('name'),
                             notifyMobile: mob, notifyMobileManual: !$('#swal-mobile').prop('readonly') };
                }
                if (!isValidMobile(rMobile)) {
                    Swal.showValidationMessage('Raiser has no valid mobile. Tick the box and select another employee.');
                    return false;
                }
                return { remarks: remarks, notifyEmpCode: rCode, notifyName: rName,
                         notifyMobile: rMobile, notifyMobileManual: false };
            }
        }).then(function (result) {
            if (result.isConfirmed) doCloseTicket(ticketId, reportedBy, result.value);
        });
    }).fail(function () {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Could not load ticket details.' });
    });
}

// ── CLOSE TICKET (Normal — all workers done) ──────────────────────────────
function confirmClose(ticketId, reportedBy) {
    if (!(typeof allowedActions !== "undefined" ? allowedActions : []).includes("Close")) return denyClose();

    openCloseDialog(ticketId, reportedBy, '', {
        title: 'Close Ticket?', icon: 'question', color: '#27ae60', confirmText: 'Yes, Close'
    });
}

// ── FORCE CLOSE (Some workers still active) ───────────────────────────────
function confirmForceClose(btn) {
    if (!(typeof allowedActions !== "undefined" ? allowedActions : []).includes("Close")) return denyClose();

    var ticketId   = $(btn).data('ticket');
    var reportedBy = $(btn).data('reported');
    var workers    = $(btn).data('workers');

    if (typeof workers === 'string') {
        workers = JSON.parse(workers);
    }

    var workerRows = workers.map(function (w) {
        var stage = getWorkerStageLabel(w.status);
        return '<div style="display:flex;align-items:center;gap:10px;padding:6px 10px;margin:5px 0;' +
               'background:#f9f9f9;border-radius:8px;border-left:4px solid ' + stage.color + ';">' +
               '<i class="fas fa-user-wrench" style="color:#555;"></i>' +
               '<span style="flex:1;font-weight:600;font-size:13px;">' + esc(w.name) + '</span>' +
               '<span style="background:' + stage.color + ';color:#fff;font-size:11px;font-weight:600;' +
               'padding:2px 8px;border-radius:12px;">' +
               '<i class="fas ' + stage.icon + ' mr-1"></i>' + stage.label + '</span>' +
               '</div>';
    }).join('');

    var extra = '<p style="color:#555;margin-bottom:8px;">These workers have not finished yet:</p>' +
                workerRows +
                '<p style="margin:12px 0;color:#e74c3c;font-size:12px;">' +
                '<i class="fas fa-exclamation-triangle mr-1"></i>Force closing will end all active work.</p>';

    openCloseDialog(ticketId, reportedBy, extra, {
        title: 'Workers Still Active!', icon: 'warning', color: '#e67e22', confirmText: 'Force Close'
    });
}

// ── WORKER STAGE LABEL HELPER ─────────────────────────────────────────────
function getWorkerStageLabel(status) {
    switch (parseInt(status)) {
        case 1: return { label: 'Assigned',  color: '#3498db', icon: 'fa-user-check' };
        case 2: return { label: 'Working',   color: '#f39c12', icon: 'fa-tools' };
        case 3: return { label: 'Fixed',     color: '#27ae60', icon: 'fa-check-circle' };
        case 4: return { label: 'Closed',    color: '#adb5bd', icon: 'fa-lock' };
        case 6: return { label: 'Transfer',  color: '#7e22ce', icon: 'fa-random' };
        default: return { label: 'Unknown',  color: '#aaa',    icon: 'fa-question-circle' };
    }
}

// ── ACTUAL CLOSE API CALL (now sends who to notify) ───────────────────────
function doCloseTicket(ticketId, reportedBy, form) {
    var closedBy  = parseInt(sessionStorage.getItem('id') || '0');
    var factoryId = getFactoryId();

    // loading popup so the screen never looks frozen while the server closes the ticket
    Swal.fire({
        title: 'Closing ticket...', text: 'Please wait',
        allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false,
        didOpen: function () { Swal.showLoading(); }
    });

    $.ajax({
        url: new URL('/api/ticket/close', baseUrl).toString(),
        type: 'POST',
        data: {
            ticketId:           ticketId,
            factoryId:          factoryId,
            closedBy:           closedBy,
            reportedBy:         reportedBy,
            remarks:            form.remarks,
            notifyEmpCode:      form.notifyEmpCode,
            notifyName:         form.notifyName,
            notifyMobile:       form.notifyMobile,
            notifyMobileManual: form.notifyMobileManual
        },
        xhrFields: { withCredentials: true },
        success: function (res) {
            if (res.status) {
                // drop this worker's own running timer for the closed ticket
                Object.keys(activeSessions).forEach(function (k) {
                    if (activeSessions[k].ticketId == ticketId) {
                        stopSessionTick(k); removeTopbarPill(k); delete activeSessions[k];
                    }
                });
                if (Object.keys(activeSessions).length === 0) {
                    stopHeartbeat(); $('body').removeClass('has-active-timer');
                }
                // show summary; the screen refreshes when the user clicks Close
                showWorkHoursSummary(res, form);
            } else {
                Swal.close();
                alert('Error: ' + res.message);
            }
        },
        error: function () {
            Swal.close();
            alert('Failed to close ticket.');
        }
    });
}



// ── WORK HOURS SUMMARY AFTER CLOSE ────────────────────────────────────────
function formatHM(v) {
    // backend sends hours as H.MM (e.g. 5.22 = 5 hr 22 min)
    var p = parseFloat(v || 0).toFixed(2).split('.');
    return parseInt(p[0], 10) + ' hr ' + parseInt(p[1], 10) + ' min';
}

function showWorkHoursSummary(res, form) {
    var html = '<div style="text-align:left;font-size:13px;">' +
        '<div style="background:#f4f6fb;border-radius:8px;padding:10px 14px;margin-bottom:10px;">' +
          '<div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.5px;">Total combined time</div>' +
          '<div style="font-size:20px;font-weight:700;color:#37499A;">' + formatHM(res.totalHours) + '</div>' +
        '</div>';

    if (res.workerHours && res.workerHours.length > 0) {
        html += '<table class="table table-sm table-bordered mb-2" style="font-size:12px;">' +
                '<thead style="background:#f4f6fb;"><tr><th>Worker</th><th style="width:110px;">Time</th></tr></thead><tbody>';
        res.workerHours.forEach(function (w) {
            html += '<tr><td>' + esc(w.WORKER_NAME || '') + '</td><td>' + formatHM(w.TOTAL_HOURS) + '</td></tr>';
        });
        html += '</tbody></table>';
    }

    html += res.smsSent
        ? '<div style="background:#e8f5e9;color:#1b5e20;border:1px solid #c8e6c9;border-radius:8px;padding:8px 12px;font-size:12px;">' +
          '<i class="fas fa-paper-plane mr-1"></i> SMS sent to <b>' + esc((form && form.notifyName) || '') + '</b></div>'
        : '<div style="background:#fff8e1;color:#8a6d00;border:1px solid #ffe8a3;border-radius:8px;padding:8px 12px;font-size:12px;">' +
          '<i class="fas fa-info-circle mr-1"></i> Ticket closed, but the SMS could not be sent</div>';
    html += '</div>';

    Swal.fire({
        icon: 'success',
        title: 'Ticket Closed',
        html: html,
        confirmButtonText: '<i class="fas fa-times mr-1"></i> Close',
        confirmButtonColor: '#37499A',
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then(function () {
        window.location.reload();      // refresh the screen after the summary is closed
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
    const allowed = typeof allowedActions !== "undefined" ? allowedActions : [];

    if (!allowed.includes("Insert")) {
        Swal.fire({
            icon: 'warning',
            title: 'Access Denied',
            text: 'You do not have permission to mark this ticket as fixed.',
            confirmButtonColor: '#37499A'
        });
        return;
    }

    if (!logId || logId === 'null') {
        var s2 = getSessionByAssignId(assignId);
        logId = s2 ? s2.logId : null;
    }
    _fixedCtx = { assignId: assignId, ticketId: ticketId,
                  reportedBy: reportedBy, assignedBy: assignedBy, logId: logId };

    // Reset all fields
    $('#whatFixed').val('');
    $('#fixRemarks').val('');
    $('#itemSearchInput').val('');
    $('#itemSearchCount').text('');
    $('#chkPartsReplaced').prop('checked', false);
    $('#partsSection').hide();
    $('#selectedItemsTable').hide();
    $('#selectedItemsBody').empty();
    $('#itemsCheckList').html('<div style="text-align:center;color:#aaa;font-size:12px;padding:10px;"><i class="fas fa-spinner fa-spin"></i> Loading items...</div>');

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
            parts:        partsData
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
    /* disabled on worker screen (original code was commented out) */
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

function showPopup(message, redirectUrl) {
    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
    setTimeout(function() {
        popup.fadeOut(400, function() {
            $(this).remove();
            window.location = redirectUrl;
        });
    }, 2000);
}