/* ═══════════════════════════════════════════════════════════
   MaintenanceAssign.js  – Assignor / Supervisor Screen
   ═══════════════════════════════════════════════════════════ */

var selectedTicketId   = null;
var selectedTicketData = null;

$(document).ready(function () {
    loadAllTickets();
    loadNotifications();
    setInterval(function () {
        loadAllTickets();
        loadNotifications();
    }, 30000);
});

// ── LOAD ALL OPEN TICKETS ─────────────────────────────────────────────────
/*function loadAllTickets() {
    var factoryId = parseInt(sessionStorage.getItem('selectedFactoryId') || '0');
    if (!factoryId) return;

    $.ajax({
        url: new URL('/api/ticket/getAll', baseUrl).toString(),
        type: 'GET',
        data: { factoryId: factoryId },
        xhrFields: { withCredentials: true },
        success: function (tickets) {
            var $tbody = $('#assignTicketTbody');
            $tbody.empty();

            if (!tickets || tickets.length === 0) {
                $tbody.append('<tr><td colspan="9"><div class="empty-state">' +
                    '<i class="fas fa-inbox"></i><p>No open tickets.</p></div></td></tr>');
                return;
            }

            $.each(tickets, function (i, t) {
                var statusLabel = getStatusLabel(t.STATUS);
                var dateStr = t.REPORTED_DATE
                    ? new Date(t.REPORTED_DATE).toLocaleString('en-IN') : '';

					var assignBtn = '';
					var closeBtn  = '';

					if (t.STATUS !== 5) {
					    assignBtn = '<button class="btn-assign-action" onclick="openAssignModal(' + t.TICKET_ID + ',' + t.MACHINE_DESC_ID + ')">' +
					                '<i class="fas fa-user-plus"></i> Assign</button>';

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
					    }
					}

                var workerNames = '';
                if (t.assigns && t.assigns.length > 0) {
                    workerNames = t.assigns.map(function (a) {
                        var badgeClass = '';
                        switch (parseInt(a.STATUS)) {
                            case 1: badgeClass = 'worker-assigned'; break;
                            case 2: badgeClass = 'worker-working';  break;
                            case 3: badgeClass = 'worker-fixed';    break;
                            case 4: badgeClass = 'worker-closed';   break;
                            case 6: badgeClass = 'worker-transfer'; break;
                            default: badgeClass = 'worker-default';
                        }
                        return '<div class="worker-chip ' + badgeClass + '">' +
                               '<i class="fas fa-user-wrench mr-1"></i>' +
                               a.WORKER_NAME +
                               '</div>';
                    }).join('');
                }

                $tbody.append(
                    '<tr class="' + getRowClass(t.STATUS) + '">' +
                    '<td><strong>' + t.TICKET_NO + '</strong></td>' +
                    '<td>' + (t.MACHINE_DESCRIPTION || '') + '</td>' +
                    '<td>' + (t.MACHINE_SUBCODE || '') + '</td>' +
                    '<td><span style="font-size:11px;font-weight:600;color:#37499A;">' + t.WHAT_BROKE + '</span></td>' +
                    '<td>' + (t.PROBLEM_DESC ? t.PROBLEM_DESC.substring(0, 50) + (t.PROBLEM_DESC.length > 50 ? '...' : '') : '') + '</td>' +
                    '<td>' + (t.REPORTER_NAME || '') + '</td>' +
                    '<td>' + (t.MOBILE_NO || '') + '</td>' +
                    '<td>' + dateStr + '</td>' +
                    '<td>' + workerNames + '</td>' +
                    '<td>' + statusLabel + '</td>' +
                    '<td>' + assignBtn + closeBtn +
                    '<button class="btn-view-action ml-1" onclick="viewTicketDetail(' + t.TICKET_ID + ')">' +
                    '<i class="fas fa-eye"></i></button>' +
                    '</td></tr>'
                );
            });
        },
        error: function () { console.error('Failed to load tickets'); }
    });
}*/



var currentPage = 1;
var totalPages  = 1;
var pageSize    = 3;

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
            var totalCount = res.totalCount  || 0;

            var $tbody = $('#assignTicketTbody');
            $tbody.empty();

            if (!tickets || tickets.length === 0) {
                $tbody.append('<tr><td colspan="11"><div class="empty-state">' +
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
					        // ← No assigns at all — still show close button
					        closeBtn = '<button class="btn-close-action ml-1" style="background:#27ae60;" ' +
					                   'onclick="confirmClose(' + t.TICKET_ID + ', ' + t.REPORTED_BY + ')">' +
					                   '<i class="fas fa-lock"></i> Close</button>';
					    }
					}

					var workerNames = '';
					if (t.assigns && t.assigns.length > 0) {
					    workerNames = t.assigns.map(function (a) {
					 
					        var statusInt = parseInt(a.STATUS);
					 
					        // ── label + color + icon per status ─────────────────
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
					 
					               // worker icon
					               '<i class="fas fa-user-wrench" style="color:' + cfg.color + ';font-size:11px;"></i>' +
					 
					               // worker name
					               '<span>' + (a.WORKER_NAME || '').trim() + '</span>' +
					 
					               // status pill
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

                $tbody.append(
                    '<tr class="' + getRowClass(t.STATUS) + '">' +
                    '<td><strong>' + t.TICKET_NO + '</strong></td>' +
                    '<td>' + (t.MACHINE_DESCRIPTION || '') + '</td>' +
                    '<td>' + (t.MACHINE_SUBCODE || '') + '</td>' +
                    '<td><span style="font-size:11px;font-weight:600;color:#37499A;">' + t.WHAT_BROKE + '</span></td>' +
                    '<td>' + (t.PROBLEM_DESC ? t.PROBLEM_DESC.substring(0, 50) + (t.PROBLEM_DESC.length > 50 ? '...' : '') : '') + '</td>' +
                    '<td>' + (t.REPORTER_NAME || '') + '</td>' +
                    '<td>' + (t.MOBILE_NO || '') + '</td>' +
                    '<td>' + dateStr + '</td>' +
					'<td>' + closeDate + '</td>' +
                    '<td>' + workerNames + '</td>' +
                    '<td>' + statusLabel + '</td>' +
                    '<td>' + assignBtn + closeBtn +
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
            $sel.removeAttr('multiple');          // ← single select only
            $sel.data('workerList', workers);     // ← store full list for name lookup
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
    var workerId   = $sel.val();                  // ← single value now
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

    console.log("the worker id is this", workerId);

    $.ajax({
        url: new URL('/api/ticket/assign', baseUrl).toString(),
        type: 'POST',
        traditional: true,
        data: {
            ticketId:   selectedTicketId,
            factoryId:  factoryId,
            workerIds:  [workerId],               // ← send as array for API compatibility
            assignedBy: assignedBy,
            assignNote: note,
            reportedBy: reportedBy
        },
        xhrFields: { withCredentials: true },
        success: function (res) {
            if (res.status) {
                // ── Store assigned worker in sessionStorage ──────────────
                sessionStorage.setItem('worker_emp_code', workerId);
                sessionStorage.setItem('worker_emp_name', workerName);
                // ──────────────────────────────────────────────────────

                // ── NEW: auto-start work using the assignId returned by /assign ──
                $.ajax({
                    url: new URL('/api/ticket/startWork', baseUrl).toString(),
                    type: 'POST',
                    data: {
                        ticketId:   selectedTicketId,
                        assignId:   res.assignId,     // ← comes from backend response now
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
                        // assign succeeded but auto-start failed — don't block the flow
                        $('#assignModal').modal('hide');
                        loadAllTickets();
                        showToast('Assigned, but auto-start failed. Please start manually.', 'info');
                        showPopup("you click the start button to start the work", 'Maintenanceworker.jsp');
                    }
                });
                // ───────────────────────────────────────────────────────────────

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
// ── CLOSE TICKET (Normal — all workers done) ──────────────────────────────
function confirmClose(ticketId, reportedBy) {
    Swal.fire({
        title: 'Close Ticket?',
        html: '<p style="color:#555;margin-bottom:10px;">Are you sure you want to close this ticket? This action is final.</p>' +
              '<textarea id="swal-close-remarks" class="swal2-textarea" ' +
              'placeholder="Enter closing remarks (optional)..." ' +
              'style="font-size:13px;border-radius:6px;border:1px solid #d1d5e8;width:100%;"></textarea>',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#27ae60',
        cancelButtonColor: '#aaa',
        confirmButtonText: '<i class="fas fa-lock mr-1"></i> Yes, Close',
        cancelButtonText: 'Cancel',
		preConfirm: function () {
		    var remarks = $('#swal-close-remarks').val().trim();
		    if (!remarks) {
		        Swal.showValidationMessage('Please enter closing remarks before closing.');
		        return false;
		    }
		    return remarks;
		}
    }).then(function (result) {
        if (result.isConfirmed) {
            doCloseTicket(ticketId, reportedBy, result.value);
        }
    });
}

// ── FORCE CLOSE (Some workers still active) ───────────────────────────────
function confirmForceClose(btn) {
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
               '<span style="flex:1;font-weight:600;font-size:13px;">' + w.name + '</span>' +
               '<span style="background:' + stage.color + ';color:#fff;font-size:11px;font-weight:600;' +
               'padding:2px 8px;border-radius:12px;">' +
               '<i class="fas ' + stage.icon + ' mr-1"></i>' + stage.label + '</span>' +
               '</div>';
    }).join('');

    Swal.fire({
        title: 'Workers Still Active!',
        html: '<p style="color:#555;margin-bottom:8px;">These workers have not finished yet:</p>' +
              workerRows +
              '<p style="margin-top:12px;color:#e74c3c;font-size:12px;">' +
              '<i class="fas fa-exclamation-triangle mr-1"></i>Force closing will end all active work.</p>' +
              '<textarea id="swal-force-remarks" class="swal2-textarea mt-2" ' +
              'placeholder="Enter closing remarks (optional)..." ' +
              'style="font-size:13px;border-radius:6px;border:1px solid #d1d5e8;width:100%;"></textarea>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e67e22',
        cancelButtonColor: '#aaa',
        confirmButtonText: '<i class="fas fa-lock mr-1"></i> Force Close',
        cancelButtonText: 'Cancel',
		preConfirm: function () {
		    var remarks = $('#swal-force-remarks').val().trim();
		    if (!remarks) {
		        Swal.showValidationMessage('Please enter closing remarks before force closing.');
		        return false;
		    }
		    return remarks;
		}
    }).then(function (result) {
        if (result.isConfirmed) {
            doCloseTicket(ticketId, reportedBy, result.value);
        }
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

// ── ACTUAL CLOSE API CALL ─────────────────────────────────────────────────
function doCloseTicket(ticketId, reportedBy, remarks) {
    var closedBy  = parseInt(sessionStorage.getItem('id') || '0');
    var factoryId = parseInt(sessionStorage.getItem('selectedFactoryId') || '0');
	
console.log("the closed Remarks are this",remarks);

  $.ajax({
        url: new URL('/api/ticket/close', baseUrl).toString(),
        type: 'POST',
        data: {
            ticketId:   ticketId,
            factoryId:  factoryId,
            closedBy:   closedBy,
            reportedBy: reportedBy,
            remarks:    remarks || 'Verified and closed by supervisor'
        },
        xhrFields: { withCredentials: true },
        success: function (res) {
            if (res.status) {
                loadAllTickets();
                showWorkHoursSummary(res);
            } else {
                alert('Error: ' + res.message);
            }
        },
        error: function () { alert('Failed to close ticket.'); }
    });
}

// ── WORK HOURS SUMMARY AFTER CLOSE ────────────────────────────────────────
function showWorkHoursSummary(res) {
    var html = '<div class="work-hours-summary">' +
        '<h6><i class="fas fa-clock mr-2"></i>Work Hours Summary</h6>' +
        '<p><strong>Total Combined Hours:</strong> ' +
        (parseFloat(res.totalHours || 0).toFixed(2)) + ' hrs</p>';

    if (res.workerHours && res.workerHours.length > 0) {
        html += '<table class="table table-sm mt-2"><thead><tr>' +
            '<th>Worker</th><th>Hours</th></tr></thead><tbody>';
        res.workerHours.forEach(function (w) {
            html += '<tr><td>' + (w.WORKER_NAME || '') + '</td>' +
                '<td>' + (parseFloat(w.TOTAL_HOURS || 0).toFixed(2)) + ' hrs</td></tr>';
        });
        html += '</tbody></table>';
    }
    html += '</div>';

    $('#workHoursBody').html(html);
    $('#workHoursSummaryModal').modal('show');
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
		        // Transfer — show hours only if available
		        if (l.WORK_HOURS !== null && l.WORK_HOURS !== undefined) {
		            hoursDisplay = '<span class="log-hours">' + formatWorkTime(l.WORK_HOURS) + '</span>';
		        }
		    } else if (!isStillWorking && l.WORK_HOURS !== null && l.WORK_HOURS !== undefined) {
		        // Completed — show final hours
		        hoursDisplay = '<span class="log-hours">' + formatWorkTime(l.WORK_HOURS) + '</span>';
		    } else if (isStillWorking && l.CURRENT_HOURS !== null && l.CURRENT_HOURS !== undefined) {
		        // Still working — show live hours with spinner
		        hoursDisplay = '<span class="log-hours" style="background:#fff3cd;color:#f39c12;">' +
		                       formatWorkTime(l.CURRENT_HOURS) +
		                       ' <i class="fas fa-spinner fa-spin" style="font-size:10px;"></i></span>';
		    }

		    html += '<div class="work-log-row">' +
		        '<span class="worker-name"><i class="fas fa-user-wrench mr-1"></i>' + (l.WORKER_NAME || '') + '</span>' +
		        '<span class="log-detail' + (isTransfer ? ' transfer-text' : '') + '">' +
		        (isTransfer ? 'Transfer' : (l.WHAT_FIXED || 'Working...')) + '</span>' +
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