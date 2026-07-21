/* ═══════════════════════════════════════════════════════════
   MaintenanceTicker.js  – Ticket Raiser Screen
   ═══════════════════════════════════════════════════════════ */

/* selectedBroke is now a Set so user can pick multiple across tabs */
var selectedBrokeSet = new Set();

var ASSIGNOR_USER_ID = 1; // Replace with real assignor user id from your config/session

$(document).ready(function () {
    loadMachineDescriptionDropdown();
    loadMyTickets();
    loadNotifications();
    loadEmployeeDropdown();

    var username = sessionStorage.getItem('username') ||
                   sessionStorage.getItem('user_name') || 'Unknown User';
    $('#reporterName').text(username);

    var parts = username.trim().split(' ');
    var initials = parts.length >= 2
        ? parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
        : username.substring(0, 2).toUpperCase();
    $('#reporterAvatar').text(initials);

    /* When employee is selected → auto-fill mobile */
    $('#empCodeSelect').on('change', function () {
        var selected = $(this).find('option:selected');
        var mobile   = selected.data('mobile') || '';
        var empName  = selected.data('empname') || '';
        $('#mobileInput').val(mobile);
        $('#empNameHidden').val(empName);
    });

    setInterval(loadNotifications, 30000);
});

/* ── EMPLOYEE DROPDOWN ──────────────────────────────────────────────────── */
function loadEmployeeDropdown() {
    var factoryId = parseInt(localStorage.getItem('selectedFactoryId') || '0');

    /* locid mapping: adjust if your factory→locid mapping differs */
    var locid = 3 ;

    $.ajax({
        url: new URL('/api/ticket/employee/getEmployeesByLocation', baseUrl).toString(),
        type: 'GET',
        data: { locid: locid },
        xhrFields: { withCredentials: true },
        success: function (response) {
            var $dd = $('#empCodeSelect');
            $dd.empty().append('<option value="">-- Select Employee --</option>');
            $.each(response, function (i, emp) {
                $dd.append(
                    '<option value="' + emp.EmpCode + '" ' +
                    'data-empid="'  + emp.EmpId    + '" ' +
                    'data-empname="'+ (emp.EmployeeDisplay || '') + '" ' +
                    'data-mobile="' + (emp.telephone || '') + '">' +
                    emp.EmployeeDisplay +
                    '</option>'
                );
            });
        },
        error: function () { console.error('Unable to load employee list'); }
    });
}

/* ── MACHINE DROPDOWNS ───────────────────────────────────────────────────── */
function loadMachineDescriptionDropdown() {
    $.ajax({
        url: new URL('/api/machine-description/getAll', baseUrl).toString(),
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (response) {
            var $dd = $('#catSelect');
            $dd.empty().append('<option value="">-- Select Machine Type --</option>');
            $.each(response, function (i, item) {
                $dd.append('<option value="' + item.machineDescId + '">' +
                           item.machineDescription + '</option>');
            });
        },
        error: function () { alert('Unable to load machine types'); }
    });
}

function onCategoryChange() {
	var factoryId = parseInt(localStorage.getItem('selectedFactoryId') || '0');
    var machineDescriptionId = $('#catSelect').val();
    var $ms = $('#machineSelect');
    $ms.empty().append('<option value="">-- Select Machine --</option>')
       .prop('disabled', !machineDescriptionId);
    if (!machineDescriptionId) return;

    $.ajax({
        url: new URL('/api/machine/getByDescription', baseUrl).toString(),
        type: 'GET',
        data: { machineDescriptionId: machineDescriptionId ,factoryId:factoryId},
        xhrFields: { withCredentials: true },
		success: function (response) {

		    $.each(response, function (i, item) {

		        var isDown = item.IS_DOWN == 1;

		        $ms.append(
		            '<option value="' + item.MACHINE_ID + '"' +
		            (isDown ? ' disabled' : '') + '>' +
		            item.MACHINE_SUBCODE +
		            (isDown ? ' (Already Down)' : '') +
		            '</option>'
		        );
		    });

		    $ms.prop('disabled', false);
		},
        error: function () { alert('Unable to load machines'); }
    });
}

/* ── WHAT BROKE – multi-select across tabs ──────────────────────────────── */
function selectBroke(el, val, tab) {
    var $chip = $(el);

    if ($chip.hasClass('sel-' + tab)) {
        /* deselect */
        $chip.removeClass('sel-elec sel-mech sel-hydr');
        selectedBrokeSet.delete(val);
    } else {
        /* select – keep other tabs' selections intact */
        $chip.addClass('sel-' + tab);
        selectedBrokeSet.add(val);
    }

    updateBrokeSelectionSummary();
}

function updateBrokeSelectionSummary() {
    var list = Array.from(selectedBrokeSet);
    if (list.length === 0) {
        $('#brokeSelectionSummary').text('').hide();
    } else {
        $('#brokeSelectionSummary')
            .text('Selected: ' + list.join(', '))
            .show();
    }
}

function switchBrokeTab(t) {
    ['elec','mech','hydr'].forEach(function (x) {
        $('#tab-' + x).removeClass('active-elec active-mech active-hydr');
        $('#panel-' + x).removeClass('active');
    });
    $('#tab-' + t).addClass('active-' + t);
    $('#panel-' + t).addClass('active');
}

/* ── SUBMIT REPORT ───────────────────────────────────────────────────────── */
function submitReport() {
    var cat       = $('#catSelect').val();
    var machine   = $('#machineSelect').val();
    var desc      = $('#problemDesc').val().trim();
    var userId    = parseInt(sessionStorage.getItem('id') || '0');
    var factoryId = parseInt(localStorage.getItem('selectedFactoryId') || '0');

    /* Employee fields */
    var empCode = $('#empCodeSelect').val();
    var empName = $('#empNameHidden').val().trim();
    var mobile  = $('#mobileInput').val().trim();

    var whatBroke = Array.from(selectedBrokeSet).join(', ');

    console.log('Factory:', factoryId);

    if (!empCode) {
        alert('Please select an employee.');
        return;
    }
    if (!cat || !machine) {
        alert('Please select machine type and machine.');
        return;
    }
    if (selectedBrokeSet.size === 0) {
        alert('Please select at least one item from "What Broke?".');
        return;
    }
    if (!desc) {
        alert('Please enter a problem description.');
        return;
    }
    if (!factoryId) { alert('Factory not selected. Please select a factory first.'); return; }
    if (!userId)    { alert('Session expired. Please log in again.'); return; }

    $.ajax({
        url: new URL('/api/ticket/raise', baseUrl).toString(),
        type: 'POST',
        data: {
            factoryId:      factoryId,
            machineDescId:  cat,
            machineId:      machine,
            whatBroke:      whatBroke,
            problemDesc:    desc,
            reportedBy:     userId,
            assignorUserId: ASSIGNOR_USER_ID,
            empCode:        empCode,
            empName:        empName,
            mobileNo:       mobile
        },
        xhrFields: { withCredentials: true },
        success: function (response) {
            if (response.status) {
                $('#tktRef').text(response.ticketNo);
                $('#successAlert').fadeIn();
                loadMyTickets();
                setTimeout(function () {
                    $('#reportModal').modal('hide');
                    resetModal();
                }, 1800);
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function () { alert('Failed to submit. Please try again.'); }
    });
}

/* ── LOAD MY TICKETS ─────────────────────────────────────────────────────── */
function loadMyTickets() {
    var userId    = parseInt(sessionStorage.getItem('id') || '0');
    var factoryId = parseInt(localStorage.getItem('selectedFactoryId') || '0');
    if (!userId || !factoryId) return;

    $.ajax({
        url: new URL('/api/ticket/myTickets', baseUrl).toString(),
        type: 'GET',
        data: { factoryId: factoryId, userId: userId },
        xhrFields: { withCredentials: true },
        success: function (tickets) {
            var $tbody = $('#ticketTbody');
            $tbody.empty();
            if (!tickets || tickets.length === 0) {
                $tbody.append(
                    '<tr id="emptyRow"><td colspan="9">' +
                    '<div class="empty-state"><i class="fas fa-inbox"></i>' +
                    '<p>No problems reported yet. Click <strong>Report a Problem</strong> to log an issue.</p>' +
                    '</div></td></tr>');
                return;
            }
            $.each(tickets, function (i, t) {
                var statusLabel = getStatusLabel(t.STATUS);
                var shortDesc   = t.PROBLEM_DESC && t.PROBLEM_DESC.length > 55
                    ? t.PROBLEM_DESC.substring(0, 55) + '...' : t.PROBLEM_DESC;
                var dateStr = t.REPORTED_DATE
                    ? new Date(t.REPORTED_DATE).toLocaleString('en-IN', { hour12: true }) : '';

                $tbody.append(
                    '<tr>' +
                    '<td><strong>' + t.TICKET_NO + '</strong></td>' +
                    '<td>' + (t.MACHINE_DESCRIPTION || '') + '</td>' +
                    '<td>' + (t.MACHINE_SUBCODE || '') + '</td>' +
                    '<td><span style="font-size:11px;font-weight:600;color:#37499A;">' + (t.WHAT_BROKE || '') + '</span></td>' +
                    '<td title="' + (t.PROBLEM_DESC || '') + '">' + (shortDesc || '') + '</td>' +
                    '<td>' + dateStr + '</td>' +
                    '<td>' + statusLabel + '</td>' +
                    '<td>' +
                    '  <button class="btn-track-ticket" onclick="openTrackModal(' + t.TICKET_ID + ')" title="Track Status">' +
                    '    <i class="fas fa-search-location"></i> Track' +
                    '  </button>' +
                    '</td>' +
                    '</tr>'
                );
            });
        },
        error: function () { console.error('Failed to load my tickets'); }
    });
}

function getStatusLabel(status) {
    var map = {
        1: '<span class="ticket-badge badge-open">Open</span>',
        2: '<span class="ticket-badge badge-assigned">Assigned</span>',
        3: '<span class="ticket-badge badge-inprogress">In Progress</span>',
        4: '<span class="ticket-badge badge-fixed">Fixed</span>',
        5: '<span class="ticket-badge badge-closed">Closed</span>'
    };
    return map[status] || '<span class="ticket-badge badge-open">Open</span>';
}

/* ── TRACK TICKET ────────────────────────────────────────────────────────── */
function openTrackModal(ticketId) {
    $('#trackModal').modal('show');
    $('#trackTimeline').html('<div class="text-center py-4"><i class="fas fa-spinner fa-spin"></i> Loading...</div>');

    $.ajax({
        url: new URL('/api/ticket/detail', baseUrl).toString(),
        type: 'GET',
        data: { ticketId: ticketId },
        xhrFields: { withCredentials: true },
        success: function (data) { renderTrackTimeline(data); },
        error: function () {
            $('#trackTimeline').html('<p class="text-danger">Failed to load ticket status.</p>');
        }
    });
}

/* ── TRACK TIMELINE with Assigned Workers + Work Logs ───────────────────── */
function renderTrackTimeline(data) {
    var t       = data.ticket   || {};
    var assigns = data.assigns  || [];
    var logs    = data.logs     || [];
    var status  = t.STATUS || 1;

    var steps = [
        { icon: 'fa-exclamation-circle', label: 'Ticket Raised',   done: status >= 1, active: status === 1 },
        { icon: 'fa-user-check',         label: 'Assigned',         done: status >= 2, active: status === 2 },
        { icon: 'fa-tools',              label: 'Work Started',     done: status >= 3, active: status === 3 },
        { icon: 'fa-check-circle',       label: status >= 5 ? 'Resolved & Closed' : (status === 4 ? 'Fixed – Pending Close' : 'Resolved'),
          done: status >= 4, active: status === 4 }
    ];

    var html = '<div class="track-header mb-3">' +
        '<strong>' + (t.TICKET_NO || '') + '</strong>&nbsp;&nbsp;' +
        getStatusLabel(status) +
        '<div class="text-muted" style="font-size:12px;margin-top:4px;">' +
        (t.MACHINE_DESCRIPTION || '') + ' › ' + (t.MACHINE_SUBCODE || '') +
        ' &nbsp;|&nbsp; <b>' + (t.WHAT_BROKE || '') + '</b></div>' +
        '</div>';

    // ── Stepper ───────────────────────────────────────────────
    html += '<div class="stepper">';
    steps.forEach(function (s, idx) {
        var cls = s.done ? 'step-done' : (s.active ? 'step-active' : 'step-pending');
        html += '<div class="step-item ' + cls + '">' +
            '<div class="step-icon"><i class="fas ' + s.icon + '"></i></div>' +
            '<div class="step-label">' + s.label + '</div>' +
            '</div>';
        if (idx < steps.length - 1)
            html += '<div class="step-connector ' + (s.done ? 'connector-done' : '') + '"></div>';
    });
    html += '</div>';

    // ── Assigned Workers ──────────────────────────────────────
    if (assigns.length > 0) {
        html += '<div class="track-section mt-3"><div class="track-section-title">Assigned Workers</div>';
        assigns.forEach(function (a) {
            var stage       = getTickerWorkerStageLabel(a.STATUS);
            var assignedDate = a.ASSIGNED_DATE
                ? new Date(a.ASSIGNED_DATE).toLocaleString('en-IN') : '';

            html += '<div class="work-log-row" style="border-left:3px solid ' + stage.color + ';padding-left:10px;">' +
                '<span style="font-weight:600;min-width:150px;">' +
                '<i class="fas fa-user-wrench mr-1" style="color:#37499A;"></i>' +
                (a.WORKER_NAME || '') + '</span>' +
                '<span style="flex:1;color:#666;font-size:12px;">' + (a.ASSIGN_NOTE ? a.ASSIGN_NOTE : '—') + '</span>' +
                '<span style="background:' + stage.color + ';color:#fff;font-size:11px;font-weight:600;' +
                'padding:2px 8px;border-radius:12px;white-space:nowrap;">' +
                '<i class="fas ' + stage.icon + ' mr-1"></i>' + stage.label + '</span>' +
                (assignedDate ? '<span style="font-size:10px;color:#888;margin-left:8px;white-space:nowrap;">' + assignedDate + '</span>' : '') +
                '</div>';
        });
        html += '</div>';
    }

    // ── Work Logs ─────────────────────────────────────────────
    if (logs.length > 0) {
        html += '<div class="track-section mt-3"><div class="track-section-title">Work Logs</div>';
        logs.forEach(function (l) {
            var isTransfer     = l.STATUS === 4;
            var isStillWorking = !l.END_TIME && l.START_TIME;

            var hoursDisplay = '';
            if (isTransfer) {
                if (l.WORK_HOURS !== null && l.WORK_HOURS !== undefined) {
                    hoursDisplay = '<span style="background:#f3e8ff;color:#7e22ce;border-radius:20px;' +
                                   'padding:2px 8px;font-size:11px;font-weight:600;">' +
                                   formatTickerWorkTime(l.WORK_HOURS) + '</span>';
                }
            } else if (!isStillWorking && l.WORK_HOURS !== null && l.WORK_HOURS !== undefined) {
                hoursDisplay = '<span style="background:#e8f5e9;color:#2e7d32;border-radius:20px;' +
                               'padding:2px 8px;font-size:11px;font-weight:600;">' +
                               formatTickerWorkTime(l.WORK_HOURS) + '</span>';
            } else if (isStillWorking && l.CURRENT_HOURS !== null && l.CURRENT_HOURS !== undefined) {
                hoursDisplay = '<span style="background:#fff3cd;color:#f39c12;border-radius:20px;' +
                               'padding:2px 8px;font-size:11px;font-weight:600;">' +
                               formatTickerWorkTime(l.CURRENT_HOURS) +
                               ' <i class="fas fa-spinner fa-spin" style="font-size:10px;"></i></span>';
            }

            html += '<div class="work-log-row" style="padding-left:10px;">' +
                '<span style="font-weight:600;min-width:150px;">' +
                '<i class="fas fa-user-wrench mr-1" style="color:#37499A;"></i>' +
                (l.WORKER_NAME || '') + '</span>' +
                '<span style="flex:1;color:' + (isTransfer ? '#f39c12' : '#555') + ';' +
                'font-weight:' + (isTransfer ? '600' : 'normal') + ';font-size:12px;">' +
                (isTransfer ? 'Transfer' : (l.WHAT_FIXED || 'Working...')) + '</span>' +
                hoursDisplay +
                '</div>';
        });
        html += '</div>';
    } else {
        html += '<div class="track-section mt-3"><div class="track-section-title">Work Logs</div>' +
                '<p style="color:#aaa;font-size:12px;padding:8px 0;">No work started yet.</p>' +
                '</div>';
    }

    $('#trackTimeline').html(html);
}

// ── Helpers for ticker screen ─────────────────────────────────────────────
function formatTickerWorkTime(hours) {
    var totalMins = Math.round(parseFloat(hours) * 60);
    if (totalMins < 60) return totalMins + ' min';
    var h = Math.floor(totalMins / 60);
    var m = totalMins % 60;
    return h + ' hr ' + (m > 0 ? m + ' min' : '');
}

function getTickerWorkerStageLabel(status) {
    switch (parseInt(status)) {
        case 1: return { label: 'Assigned',  color: '#3498db', icon: 'fa-user-check' };
        case 2: return { label: 'Working',   color: '#f39c12', icon: 'fa-tools' };
        case 3: return { label: 'Fixed',     color: '#27ae60', icon: 'fa-check-circle' };
        case 4: return { label: 'Closed',    color: '#adb5bd', icon: 'fa-lock' };
        case 6: return { label: 'Transfer',  color: '#7e22ce', icon: 'fa-random' };
        default: return { label: 'Unknown',  color: '#aaa',    icon: 'fa-question-circle' };
    }
}

/* ── NOTIFICATIONS ───────────────────────────────────────────────────────── */
function loadNotifications() {
    var userId    = parseInt(sessionStorage.getItem('user_id') || '0');
    var factoryId = parseInt(localStorage.getItem('selectedFactoryId') || '0');
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
        var icon   = notifIcon(n.NOTIF_TYPE);
        var isRead = n.IS_READ == 1 || n.IS_READ === true;
        $list.append(
            '<div class="notif-item ' + (isRead ? '' : 'notif-unread') + '" ' +
            'onclick="markNotifRead(' + n.NOTIF_ID + ', this)">' +
            '<i class="' + icon + ' mr-2"></i>' +
            '<div><div class="notif-msg">' + n.NOTIF_MESSAGE + '</div>' +
            '<div class="notif-time">' +
            (n.CREATED_DATE ? new Date(n.CREATED_DATE).toLocaleString('en-IN') : '') +
            '</div></div></div>'
        );
    });
}

function notifIcon(type) {
    var map = {
        RAISED:   'fas fa-exclamation-circle text-warning',
        ASSIGNED: 'fas fa-user-check text-primary',
        STARTED:  'fas fa-tools text-info',
        FIXED:    'fas fa-check-circle text-success',
        CLOSED:   'fas fa-lock text-secondary'
    };
    return map[type] || 'fas fa-bell text-secondary';
}

function markNotifRead(notifId, el) {
    $.post(new URL('/api/ticket/notifications/markRead', baseUrl).toString(),
           { notifId: notifId });
    $(el).removeClass('notif-unread');
    var count = parseInt($('#notifBadge').text()) - 1;
    $('#notifBadge').text(count <= 0 ? 0 : count).toggle(count > 0);
}

/* ── RESET MODAL ─────────────────────────────────────────────────────────── */
function resetModal() {
    $('#empCodeSelect').val('');
    $('#mobileInput').val('');
    $('#empNameHidden').val('');
    $('#catSelect').val('');
    $('#machineSelect').empty()
        .append('<option value="">-- Select Machine --</option>')
        .prop('disabled', true);
    $('#problemDesc').val('');
    selectedBrokeSet.clear();
    $('.broke-chip').removeClass('sel-elec sel-mech sel-hydr');
    $('#brokeSelectionSummary').text('').hide();
    $('#successAlert').hide();
}