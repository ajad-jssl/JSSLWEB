/* ═══════════════════════════════════════════════════════════
   MaintenanceAssign.js  – Assignor / Supervisor Screen
   ═══════════════════════════════════════════════════════════ */

var selectedTicketId   = null;
var selectedTicketData = null;

// ── Employee list used by the Close dialog (same API as ticker screen) ────
var closeEmployees = [];

let allowedActions = [];

async function loadActions() {
    const MainPage = window.location.pathname.split("/").pop() + '.jsp'; // e.g. "Maintenanceassign.jsp"
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

$(document).ready(function () {
    loadActions();
    loadCloseEmployees();          // ← NEW
    loadAllTickets();
    loadNotifications();
    setInterval(function () {
        loadAllTickets();
        loadNotifications();
    }, 30000);
});

// ── SMALL HELPERS (NEW) ───────────────────────────────────────────────────
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

// ── LOAD EMPLOYEES FOR CLOSE DIALOG (NEW – same API as MaintenanceTicker) ─
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

// ── LOAD ALL TICKETS ──────────────────────────────────────────────────────
var currentPage = 1;
var totalPages  = 1;
var pageSize    = 2;

function loadAllTickets(page) {
    page = page || currentPage;
    var factoryId = parseInt(sessionStorage.getItem('selectedFactoryId') || '0');
    if (!factoryId) return;

    $.ajax({
        url: new URL('/api/ticket/getAll', baseUrl).toString(),
        type: 'GET',
        data: { factoryId: factoryId, page: page, pageSize: pageSize },
        xhrFields: { withCredentials: true },
        success: function (res) {
            var tickets    = res.tickets    || [];
            totalPages     = res.totalPages  || 1;
            currentPage    = res.currentPage || 1;

            var $tbody = $('#assignTicketTbody');
            $tbody.empty();

            if (!tickets || tickets.length === 0) {
                $tbody.append('<tr><td colspan="12"><div class="empty-state">' +      // colspan 12 now
                    '<i class="fas fa-inbox"></i><p>No open tickets.</p></div></td></tr>');
                renderPagination(0, 0);
                return;
            }

            $.each(tickets, function (i, t) {
                var statusLabel = getStatusLabel(t.STATUS);
                var dateStr = t.REPORTED_DATE
                    ? new Date(t.REPORTED_DATE).toLocaleString('en-IN') : '';
                var closeDate = t.CLOSED_DATE
                    ? new Date(t.CLOSED_DATE).toLocaleString('en-IN') : '';

                var assignBtn = '';
                var closeBtn  = '';

                if (t.STATUS !== 5) {
                    assignBtn = '<button class="btn-assign-action" onclick="openAssignModal(' + t.TICKET_ID + ',' + t.MACHINE_DESC_ID + ')">' +
                                '<i class="fas fa-user-plus"></i>Start Working</button>';

                    if (t.assigns && t.assigns.length > 0) {
                        var allDone = t.assigns.every(function (a) {
                            return a.STATUS === 3 || a.STATUS === 6;
                        });
                        var activeWorkers = t.assigns.filter(function (a) {
                            return a.STATUS !== 4 && a.STATUS !== 6;
                        });

                        if (allDone) {
                            closeBtn = '<button class="btn-close-action ml-1" style="background:#27ae60;" ' +
                                       'onclick="confirmClose(' + t.TICKET_ID + ', ' + t.REPORTED_BY + ')">' +
                                       '<i class="fas fa-lock"></i> Close</button>';
                        } else {
                            var activeData = JSON.stringify(activeWorkers.map(function (a) {
                                return { name: a.WORKER_NAME.trim(), status: a.STATUS };
                            }));
                            closeBtn = '<button class="btn-close-action ml-1" style="background:#e67e22;"' +
                                       ' data-ticket="' + t.TICKET_ID + '"' +
                                       ' data-reported="' + t.REPORTED_BY + '"' +
                                       ' data-workers=\'' + activeData + '\'' +
                                       ' onclick="confirmForceClose(this)">' +
                                       '<i class="fas fa-lock"></i> Close</button>';
                        }

                    } else {
                        // No assigns at all — still show close button
                        closeBtn = '<button class="btn-close-action ml-1" style="background:#27ae60;" ' +
                                   'onclick="confirmClose(' + t.TICKET_ID + ', ' + t.REPORTED_BY + ')">' +
                                   '<i class="fas fa-lock"></i> Close</button>';
                    }
                }

                var workerNames = '';
                if (t.assigns && t.assigns.length > 0) {
                    workerNames = t.assigns.map(function (a) {
                        var statusInt = parseInt(a.STATUS);

                        var statusConfig = {
                            1: { label: 'Assigned',    color: '#3498db', bg: '#ebf5fb', icon: 'fa-user-check'   },
                            2: { label: 'In Progress', color: '#f39c12', bg: '#fef9e7', icon: 'fa-tools'         },
                            3: { label: 'Fixed',       color: '#27ae60', bg: '#eafaf1', icon: 'fa-check-circle'  },
                            4: { label: 'Closed',      color: '#7f8c8d', bg: '#f2f3f4', icon: 'fa-lock'          },
                            6: { label: 'Transfer',    color: '#7e22ce', bg: '#f5f0ff', icon: 'fa-exchange-alt'  }
                        };

                        var cfg = statusConfig[statusInt] || {
                            label: 'Unknown', color: '#aaa', bg: '#f5f5f5', icon: 'fa-question-circle'
                        };

                        return '<div class="worker-chip" style="' +
                               'display:inline-flex;align-items:center;gap:6px;' +
                               'background:' + cfg.bg + ';' +
                               'border:1px solid ' + cfg.color + ';' +
                               'border-left:2px solid ' + cfg.color + ';' +
                               'border-radius:20px;' +
                               'padding:4px 10px 4px 8px;' +
                               'margin:2px;' +
                               'font-size:11px;' +
                               'font-weight:600;' +
                               'color:#333;">' +
                               '<i class="fas fa-user-wrench" style="color:' + cfg.color + ';font-size:11px;"></i>' +
                               '<span>' + esc((a.WORKER_NAME || '').trim()) + '</span>' +
                               '<span style="' +
                               'background:' + cfg.color + ';' +
                               'color:#fff;' +
                               'font-size:10px;' +
                               'font-weight:700;' +
                               'padding:1px 7px;' +
                               'border-radius:10px;' +
                               'display:inline-flex;align-items:center;gap:3px;">' +
                               '<i class="fas ' + cfg.icon + '" style="font-size:9px;"></i>' +
                               cfg.label +
                               '</span>' +
                               '</div>';
                    }).join('');
                }

                // ── Raiser: name + empCode (employee selected at raise time, else logged-in reporter) ──
                var raiserName = t.EMP_NAME || t.REPORTER_NAME || '';
                var raiserCode = t.EMP_CODE || t.REPORTER_EMPCODE || '';

                $tbody.append(
                    '<tr class="' + getRowClass(t.STATUS) + '">' +
                    '<td data-label="Ticket No."><strong>' + t.TICKET_NO + '</strong></td>' +
                    '<td data-label="Machine Category">' + (t.MACHINE_DESCRIPTION || '') + '</td>' +
                    '<td data-label="Machine">' + (t.MACHINE_SUBCODE || '') + '</td>' +
                    '<td data-label="Issue Types"><span style="font-size:11px;font-weight:600;color:#37499A;">' + t.WHAT_BROKE + '</span></td>' +
                    '<td data-label="Description">' + (t.PROBLEM_DESC ? t.PROBLEM_DESC.substring(0, 50) + (t.PROBLEM_DESC.length > 50 ? '...' : '') : '') + '</td>' +
                    '<td data-label="Reported By"><strong>' + esc(raiserName) + '</strong>' +
                        (raiserCode ? '<br><small style="color:#888;">' + esc(raiserCode) + '</small>' : '') + '</td>' +
                    '<td data-label="Mobile No.">' + (t.MOBILE_NO || '') + '</td>' +
                    '<td data-label="Date & Time">' + dateStr + '</td>' +
                    '<td data-label="Closed Date">' + closeDate + '</td>' +
                    '<td data-label="Technician Assigned">' + workerNames + '</td>' +
                    '<td data-label="Status">' + statusLabel + '</td>' +
                    '<td data-label="Actions">' + assignBtn + closeBtn +
                    '<button class="btn-view-action ml-1" onclick="viewTicketDetail(' + t.TICKET_ID + ')">' +
                    '<i class="fas fa-eye"></i></button>' +
                    '</td></tr>'
                );
            });

            renderPagination(totalPages, currentPage);
        },
        error: function () { console.error('Failed to load tickets'); }
    });
}

function renderPagination(total, current) {
    $('#ticketPagination').remove();

    if (total <= 1) return;

    var html = '<div id="ticketPagination" style="display:flex;align-items:center;justify-content:flex-end;' +
               'gap:6px;padding:12px 16px;border-top:1px solid #e3e6f0;flex-wrap:wrap;">';

    // Prev
    html += '<button class="page-btn" onclick="loadAllTickets(' + (current - 1) + ')" ' +
            (current === 1 ? 'disabled' : '') + '>' +
            '<i class="fas fa-chevron-left"></i></button>';

    // Page numbers
    for (var i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
            html += '<button class="page-btn ' + (i === current ? 'page-btn-active' : '') + '" ' +
                    'onclick="loadAllTickets(' + i + ')">' + i + '</button>';
        } else if (i === current - 2 || i === current + 2) {
            html += '<span style="color:#aaa;padding:0 4px;">…</span>';
        }
    }

    // Next
    html += '<button class="page-btn" onclick="loadAllTickets(' + (current + 1) + ')" ' +
            (current === total ? 'disabled' : '') + '>' +
            '<i class="fas fa-chevron-right"></i></button>';

    html += '<span style="font-size:11px;color:#888;margin-left:8px;">' +
            'Page ' + current + ' of ' + total + '</span>';

    html += '</div>';

    $('.content-card').append(html);
}


function getRowClass(status) {
    var map = { 1: '', 2: 'row-assigned', 3: 'row-inprogress', 4: 'row-fixed', 5: 'row-closed' };
    return map[status] || '';
}

// ── LOAD WORKER DROPDOWN ──────────────────────────────────────────────────
async function loadWorkerDropdown(machineCategoryId, ticket_id) {
    var factoryId = parseInt(sessionStorage.getItem('selectedFactoryId') || '0');
    $.ajax({
        url: new URL('/api/ticket/getWorkers', baseUrl).toString(),
        type: 'GET',
        data: { factoryId: factoryId, machineCategoryId: machineCategoryId, ticket_id: ticket_id },
        xhrFields: { withCredentials: true },
        success: function (workers) {
            var $sel = $('#workerSelect');
            $sel.empty();
            $sel.removeAttr('multiple');          // single select only
            $sel.data('workerList', workers);     // store full list for name lookup
            $.each(workers, function (i, w) {
                $sel.append('<option value="' + w.Worker_EmpCode + '">' + w.employee_display_name + '</option>');
            });
        },
        error: function () {
            console.warn('Worker list endpoint not available');
        }
    });
}

// ── OPEN ASSIGN MODAL ─────────────────────────────────────────────────────
async function openAssignModal(ticketId, machineCategoryId) {
    const allowed = typeof allowedActions !== "undefined" ? allowedActions : [];

    if (!allowed.includes("Insert")) {
        Swal.fire({
            icon: 'warning',
            title: 'Access Denied',
            text: 'You do not have permission to start work.',
            confirmButtonColor: '#37499A'
        });
        return;
    }

    $('#btnSubmitAssign')
        .prop('disabled', false)
        .html('<i class="fas fa-play"></i> Start Work');
    selectedTicketId = ticketId;
    $('#assignModal').modal('show');
    $('#assignTicketIdDisplay').text('#' + ticketId);
    $('#assignNote').val('');
    await loadWorkerDropdown(machineCategoryId, ticketId);

    $.ajax({
        url: new URL('/api/ticket/detail', baseUrl).toString(),
        type: 'GET',
        data: { ticketId: ticketId },
        xhrFields: { withCredentials: true },
        success: function (data) {
            selectedTicketData = data;
            var assigns = data.assigns || [];
            var $prev = $('#prevAssignees');
            $prev.empty();
            if (assigns.length > 0) {
                $prev.append('<div class="form-section-title mt-2">Already Assigned To</div>');
                assigns.forEach(function (a) {
                    $prev.append('<span class="assignee-chip"><i class="fas fa-user-wrench mr-1"></i>' +
                                 (a.WORKER_NAME || 'Worker') + '</span>');
                });
            }
        }
    });
}

// ── SUBMIT ASSIGNMENT ─────────────────────────────────────────────────────
function submitAssign() {
    var $btn = $('#btnSubmitAssign');
    if ($btn.prop('disabled')) return;

    var $sel       = $('#workerSelect');
    var workerId   = $sel.val();
    var workerName = $sel.find('option:selected').text();
    var note       = $('#assignNote').val().trim();
    var assignedBy = parseInt(sessionStorage.getItem('id') || '0');
    var factoryId  = parseInt(sessionStorage.getItem('selectedFactoryId') || '0');
    var reportedBy = selectedTicketData && selectedTicketData.ticket.REPORTED_BY
                     ? selectedTicketData.ticket.REPORTED_BY : 0;

    if (!workerId) {
        alert('Please select a Technician.');
        return;
    }

    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Working...');

    $.ajax({
        url: new URL('/api/ticket/assign', baseUrl).toString(),
        type: 'POST',
        traditional: true,
        data: {
            ticketId:   selectedTicketId,
            factoryId:  factoryId,
            workerIds:  [workerId],
            assignedBy: assignedBy,
            assignNote: note,
            reportedBy: reportedBy
        },
        xhrFields: { withCredentials: true },
        success: function (res) {
            if (res.status) {
                sessionStorage.setItem('worker_emp_code', workerId);
                sessionStorage.setItem('worker_emp_name', workerName);

                // auto-start work using the assignId returned by /assign
                $.ajax({
                    url: new URL('/api/ticket/startWork', baseUrl).toString(),
                    type: 'POST',
                    data: {
                        ticketId:   selectedTicketId,
                        assignId:   res.assignId,
                        factoryId:  factoryId,
                        workerId:   workerId,
                        reportedBy: reportedBy
                    },
                    xhrFields: { withCredentials: true },
                    success: function (startRes) {
                        $('#assignModal').modal('hide');
                        loadAllTickets();
                        showToast('Ticket ' + $('#assignTicketIdDisplay').text() + ' assigned & work started!', 'success');
                        showPopup("Work started. Redirecting to worker screen...", 'Maintenanceworker.jsp');
                    },
                    error: function () {
                        $('#assignModal').modal('hide');
                        loadAllTickets();
                        showToast('Assigned, but auto-start failed. Please start manually.', 'info');
                        showPopup("you click the start button to start the work", 'Maintenanceworker.jsp');
                    }
                });

            } else {
                $btn.prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Start Work');
                alert('Error: ' + res.message);
            }
        },
        error: function () {
            $btn.prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Start Work');
            alert('Failed to assign. Please try again.');
        }
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

               /* $('#swal-other').on('change', function () {
                    $('#swal-other-wrap').slideToggle(150);
                    $('.cd-raiser').toggleClass('cd-dim', this.checked);
                    updateSmsSummary();
                });*/
				
				$('#swal-other').on('change', function () {
				    var on    = this.checked;
				    var $wrap = $('#swal-other-wrap');

				    $wrap.stop(true, true);                 // kill any queued animation
				    if (on) { $wrap.slideDown(150); }
				    else    { $wrap.slideUp(150); }

				    $('.cd-raiser').toggleClass('cd-dim', on);

				    if (!on) {
				        // reset the notify section so stale employee/mobile are never used
				        $('#swal-emp').val(null).trigger('change');   // also clears mobile + hint + refreshes summary
				    } else {
				        updateSmsSummary();
				    }
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
    var factoryId = parseInt(sessionStorage.getItem('selectedFactoryId') || '0');

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

// ── VIEW TICKET DETAIL ────────────────────────────────────────────────────
function viewTicketDetail(ticketId) {
    $.ajax({
        url: new URL('/api/ticket/detail', baseUrl).toString(),
        type: 'GET',
        data: { ticketId: ticketId },
        xhrFields: { withCredentials: true },
        success: function (data) {
            renderDetailModal(data);
            $('#ticketDetailModal').modal('show');
        }
    });
}

function renderDetailModal(data) {
    var t       = data.ticket  || {};
    var logs    = data.logs    || [];
    var assigns = data.assigns || [];

    var html = '<div class="detail-info-grid">' +
        '<div><label>Ticket No</label><p>' + (t.TICKET_NO || '') + '</p></div>' +
        '<div><label>Status</label><p>' + getStatusLabel(t.STATUS) + '</p></div>' +
        '<div><label>Machine</label><p>' + (t.MACHINE_DESCRIPTION || '') + ' – ' + (t.MACHINE_SUBCODE || '') + '</p></div>' +
        '<div><label>What Broke</label><p><b>' + (t.WHAT_BROKE || '') + '</b></p></div>' +
        '<div class="span-2"><label>Problem Description</label><p>' + (t.PROBLEM_DESC || '') + '</p></div>' +
        '</div>';

    // ── ASSIGNED WORKERS SECTION ──────────────────────────────
    if (assigns.length > 0) {
        html += '<div class="track-section mt-3"><div class="track-section-title">Assigned Workers</div>';
        assigns.forEach(function (a) {
            var stage = getWorkerStageLabel(a.STATUS);
            var assignedDate = a.ASSIGNED_DATE
                ? new Date(a.ASSIGNED_DATE).toLocaleString('en-IN') : '';

            html += '<div class="work-log-row" style="border-left: 3px solid ' + stage.color + ';">' +
                '<span class="worker-name"><i class="fas fa-user-wrench mr-1"></i>' + (a.WORKER_NAME || '') + '</span>' +
                '<span class="log-detail">' + (a.ASSIGN_NOTE ? a.ASSIGN_NOTE : '—') + '</span>' +
                '<span style="background:' + stage.color + ';color:#fff;font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;">' +
                '<i class="fas ' + stage.icon + ' mr-1"></i>' + stage.label + '</span>' +
                (assignedDate ? '<span class="log-hours" style="font-size:10px;color:#888;">' + assignedDate + '</span>' : '') +
                '</div>';
        });
        html += '</div>';
    }

    // ── WORK LOGS SECTION ─────────────────────────────────────
    if (logs.length > 0) {
        html += '<div class="track-section mt-3"><div class="track-section-title">Work Logs</div>';

        logs.forEach(function (l) {
            var isTransfer     = l.STATUS === 4;
            var isStillWorking = !l.END_TIME && l.START_TIME;

            var hoursDisplay = '';

            if (isTransfer) {
                if (l.WORK_HOURS !== null && l.WORK_HOURS !== undefined) {
                    hoursDisplay = '<span class="log-hours">' + formatWorkTime(l.WORK_HOURS) + '</span>';
                }
            } else if (!isStillWorking && l.WORK_HOURS !== null && l.WORK_HOURS !== undefined) {
                hoursDisplay = '<span class="log-hours">' + formatWorkTime(l.WORK_HOURS) + '</span>';
            } else if (isStillWorking && l.CURRENT_HOURS !== null && l.CURRENT_HOURS !== undefined) {
                hoursDisplay = '<span class="log-hours" style="background:#fff3cd;color:#f39c12;">' +
                               formatWorkTime(l.CURRENT_HOURS) +
                               ' <i class="fas fa-spinner fa-spin" style="font-size:10px;"></i></span>';
            }

            // don't show "Working..." once the log has ended or the ticket is closed
            var descText;
            if (isTransfer) {
                descText = 'Transfer';
            } else if (l.WHAT_FIXED) {
                descText = l.WHAT_FIXED;
            } else if (isStillWorking && t.STATUS !== 5) {
                descText = 'Working...';
            } else {
                descText = '';
            }

            html += '<div class="work-log-row">' +
                '<span class="worker-name"><i class="fas fa-user-wrench mr-1"></i>' + (l.WORKER_NAME || '') + '</span>' +
                '<span class="log-detail' + (isTransfer ? ' transfer-text' : '') + '">' +
                descText + '</span>' +
                hoursDisplay +
                '</div>';
        });
        html += '</div>';
    } else {
        html += '<div class="track-section mt-3">' +
                '<div class="track-section-title">Work Logs</div>' +
                '<p style="color:#aaa;font-size:12px;padding:8px;">No work started yet.</p>' +
                '</div>';
    }

    $('#ticketDetailBody').html(html);
}


function formatWorkTime(hours) {
    var totalMins = Math.round(parseFloat(hours) * 60);
    if (totalMins < 60) {
        return totalMins + ' min';
    }
    var h = Math.floor(totalMins / 60);
    var m = totalMins % 60;
    return h + ' hr ' + (m > 0 ? m + ' min' : '');
}


// ── NOTIFICATIONS ─────────────────────────────────────────────────────────
function loadNotifications() {
    var userId    = parseInt(sessionStorage.getItem('user_id') || '0');
    var factoryId = parseInt(sessionStorage.getItem('selectedFactoryId') || '0');
    if (!userId || !factoryId) return;

    $.ajax({
        url: new URL('/api/ticket/notifications', baseUrl).toString(),
        type: 'GET',
        data: { userId: userId, factoryId: factoryId },
        xhrFields: { withCredentials: true },
        success: function (data) {
            var count = data.unreadCount || 0;
            $('#notifBadge').text(count).toggle(count > 0);
            renderNotifDropdown(data.notifications || []);
        },
        error: function () {}
    });
}

function renderNotifDropdown(notifications) {
    var $list = $('#notifList');
    $list.empty();
    if (!notifications.length) {
        $list.append('<div class="notif-empty">No notifications</div>');
        return;
    }
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
    $.post(new URL('/api/ticket/notifications/markRead', baseUrl).toString(), { notifId: notifId });
    $(el).removeClass('notif-unread');
    var count = parseInt($('#notifBadge').text()) - 1;
    $('#notifBadge').text(count <= 0 ? 0 : count).toggle(count > 0);
}

// ── STATUS HELPERS ────────────────────────────────────────────────────────
function getStatusLabel(status) {
    var map = {
        1: '<span class="ticket-badge badge-open">Open</span>',
        2: '<span class="ticket-badge badge-assigned">Assigned</span>',
        3: '<span class="ticket-badge badge-inprogress">In Progress</span>',
        4: '<span class="ticket-badge badge-fixed">Fixed ✓</span>',
        5: '<span class="ticket-badge badge-closed">Closed</span>'
    };
    return map[status] || '<span class="ticket-badge badge-open">Open</span>';
}

function showToast(msg, type) {
    var $t = $('<div class="toast-notif toast-' + type + '">' + msg + '</div>');
    $('body').append($t);
    setTimeout(function () { $t.addClass('show'); }, 10);
    setTimeout(function () { $t.removeClass('show'); setTimeout(function () { $t.remove(); }, 400); }, 1000);
}


function showPopup(message, redirectUrl) {
    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
    setTimeout(function() {
        popup.fadeOut(400, function() {
            $(this).remove();
            window.location = redirectUrl;
        });
    }, 1000);
}