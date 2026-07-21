<%
    response.setHeader("Cache-Control","no-cache,no-store,must-revalidate");
    response.setHeader("Pragma","no-cache");
    response.setDateHeader("Expires",0);
%>
<%  long ts = System.currentTimeMillis(); %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
<link href="img/logo/download.png" rel="icon">
<title>JSSL – Assign Ticket</title>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="css/ruang-admin.min.css" rel="stylesheet">
<link href="vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
<link rel="stylesheet" href="css/main.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<style>
/* ── Reuse the same design tokens ── */
.page-heading { font-size:15px; font-weight:600; color:#37499A; margin-bottom:2px; }
.page-subheading { font-size:12px; color:#888; }
.content-card { background:#fff; border-radius:10px; border:1px solid #e3e6f0; box-shadow:0 2px 10px rgba(0,0,0,.05); overflow:hidden; }
.content-card-header { background:linear-gradient(90deg,#37499A 0%,#4CAF50 100%); padding:11px 20px; display:flex; align-items:center; justify-content:space-between; }
.content-card-header h6 { color:#fff; font-size:13px; font-weight:600; margin:0; display:flex; align-items:center; gap:8px; }
.content-card-header small { color:rgba(255,255,255,.75); font-size:12px; }
.table thead th { background:#f4f6fb; font-size:12px; font-weight:600; color:#37499A; border-bottom:2px solid #e3e6f0; vertical-align:middle; }
.table tbody td { font-size:12px; vertical-align:middle; color:#444; }
.table-hover tbody tr:hover { background:#f0f3fa; }
.ticket-badge { font-size:11px; padding:3px 10px; border-radius:20px; font-weight:600; }
.badge-open      { background:#fff3cd; color:#856404; }
.badge-assigned  { background:#cfe2ff; color:#0a58ca; }
.badge-inprogress{ background:#fff3cd; color:#664d03; }
.badge-fixed     { background:#d1e7dd; color:#0f5132; }
.badge-closed    { background:#e2e3e5; color:#41464b; }
.row-assigned  td { border-left:3px solid #0d6efd; }
.row-inprogress td { border-left:3px solid #ffc107; }
.row-fixed td     { border-left:3px solid #198754; }
.row-closed td    { border-left:3px solid #adb5bd; opacity:.7; }
.empty-state { text-align:center; padding:50px 20px; }
.empty-state i { font-size:42px; display:block; margin-bottom:12px; color:#d0d5e8; }
.empty-state p { font-size:13px; margin:0; color:#aaa; }

.btn-assign-action {
    background:#37499A; color:#fff; border:none; border-radius:5px;
    padding:4px 12px; font-size:11px; font-weight:600; cursor:pointer; }
.btn-assign-action:hover { background:#2c3c85; }
.btn-close-action {
    background:#198754; color:#fff; border:none; border-radius:5px;
    padding:4px 12px; font-size:11px; font-weight:600; cursor:pointer; }
.btn-close-action:hover { background:#146c43; }
.btn-view-action {
    background:#f4f6fb; color:#37499A; border:1px solid #d1d5e8; border-radius:5px;
    padding:4px 10px; font-size:11px; cursor:pointer; }
.btn-view-action:hover { background:#e8ecf9; }

/* Assign modal */
.modal-header-custom {
    background:linear-gradient(90deg,#37499A 0%,#4CAF50 100%);
    border-top-left-radius:10px; border-top-right-radius:10px;
    padding:11px 18px; display:flex; align-items:center; justify-content:space-between; height:46px; }
.modal-header-custom .modal-title-text { color:#fff; font-size:14px; font-weight:600; display:flex; align-items:center; gap:8px; }
.modal-header-custom .close { color:rgba(255,255,255,.85); opacity:1; font-size:20px; line-height:1; }
.form-section-title { font-size:11px; font-weight:700; color:#37499A; text-transform:uppercase; letter-spacing:.6px; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #e8ebf5; }
.form-label-sm { font-size:12px; color:#555; font-weight:600; margin-bottom:4px; display:block; }
.form-control-sm { font-size:13px; border-radius:6px; border:1px solid #d1d5e8; color:#333; }
.form-control-sm:focus { border-color:#37499A; box-shadow:0 0 0 3px rgba(55,73,154,.1); }
.modal-footer { background:#f8f9fd; border-top:1px solid #e8ebf5; border-bottom-left-radius:10px; border-bottom-right-radius:10px; padding:12px 20px; }
.btn-cancel-modal { background:#fff; border:1px solid #d1d5e8; color:#555; border-radius:6px; padding:7px 18px; font-size:13px; font-weight:500; cursor:pointer; }
.btn-cancel-modal:hover { background:#f0f3fa; }
.btn-submit-modal { background:#37499A; border:none; color:#fff; border-radius:6px; padding:7px 20px; font-size:13px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:7px; }
.btn-submit-modal:hover { background:#2c3c85; }

.assignee-chip { display:inline-block; background:#e8ecf9; color:#37499A; border-radius:20px; padding:3px 12px; font-size:11px; font-weight:600; margin:3px; }

/* Notification bell */
.notif-bell-wrap { position:relative; display:inline-block; cursor:pointer; }
.notif-badge { position:absolute; top:-6px; right:-8px; background:#dc3545; color:#fff; border-radius:50%; font-size:10px; font-weight:700; width:18px; height:18px; display:flex; align-items:center; justify-content:center; }
.notif-dropdown { position:absolute; right:0; top:32px; width:320px; background:#fff; border-radius:10px; box-shadow:0 4px 20px rgba(0,0,0,.15); z-index:9999; display:none; max-height:400px; overflow-y:auto; }
.notif-dropdown.open { display:block; }
.notif-item { padding:10px 14px; border-bottom:1px solid #f0f3fa; cursor:pointer; }
.notif-item:hover { background:#f8f9fd; }
.notif-unread { background:#eef1fb; }
.notif-msg { font-size:12px; color:#333; }
.notif-time { font-size:11px; color:#aaa; margin-top:3px; }
.notif-empty { padding:16px; text-align:center; font-size:12px; color:#aaa; }

/* Work hours summary */
.work-hours-summary h6 { color:#37499A; font-weight:700; }
.work-hours-summary { padding:4px 0; }

/* Detail modal */
.detail-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.detail-info-grid .span-2 { grid-column:span 2; }
.detail-info-grid label { font-size:11px; color:#888; text-transform:uppercase; letter-spacing:.5px; display:block; }
.detail-info-grid p { font-size:13px; color:#333; margin:0; }
.track-section { margin-top:16px; }
.track-section-title { font-size:11px; font-weight:700; color:#37499A; text-transform:uppercase; letter-spacing:.6px; margin-bottom:8px; }
.work-log-row { display:flex; align-items:center; gap:10px; padding:7px 0; border-bottom:1px solid #f0f3fa; font-size:12px; }
.log-hours { background:#e8f5e9; color:#2e7d32; border-radius:20px; padding:2px 10px; font-size:11px; font-weight:600; margin-left:auto; }

/* Toast */
.toast-notif { position:fixed; bottom:24px; right:24px; padding:12px 20px; border-radius:8px; font-size:13px; font-weight:600; color:#fff; opacity:0; transition:opacity .3s; z-index:99999; }
.toast-success { background:#198754; }
.toast-notif.show { opacity:1; }

button.close { padding:0; background:transparent; border:0; }
.worker-chip {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 12px;
    margin-bottom: 3px;
    display: inline-block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Assigned */
.worker-assigned {
    background: #dbeafe;
    color: #1d4ed8;
    border: 1px solid #93c5fd;
}

/* Working / Started */
.worker-working {
    background: #fff7ed;
    color: #ea580c;
    border: 1px solid #fdba74;
}

/* Fixed */
.worker-fixed {
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #86efac;
}

/* Closed */
.worker-closed {
    background: #e5e7eb;
    color: #374151;
    border: 1px solid #d1d5db;
}

/* Transfer Requested */
.worker-transfer {
    background: #f3e8ff;
    color: #7e22ce;
    border: 1px solid #d8b4fe;
}

/* Default */
.worker-default {
    background: #f8fafc;
    color: #475569;
    border: 1px solid #cbd5e1;
}


.transfer-log {
    border-left: 3px solid #f39c12;
    background-color: #fff8f0;
}

.transfer-badge {
    display: inline-flex;
    align-items: center;
    background-color: #f39c12;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 12px;
    margin-left: 8px;
    white-space: nowrap;
}
.transfer-text {
    color: #f39c12;
    font-weight: 600;
}


.btn-force-close-action {
    background-color: #e74c3c;
    color: #fff;
    border: none;
    padding: 4px 10px;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
}

.btn-force-close-action:hover {
    background-color: #c0392b;
}

.page-btn {
    background: #f4f6fb;
    border: 1px solid #d1d5e8;
    color: #37499A;
    border-radius: 5px;
    padding: 4px 10px;
    font-size: 12px;
    cursor: pointer;
    font-weight: 600;
    min-width: 32px;
}
.page-btn:hover:not(:disabled) { background: #e8ecf9; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-btn-active {
    background: #37499A;
    color: #fff;
    border-color: #37499A;
}


</style>
</head>
<body>
<div id="wrapper">
    <%@ include file="MaintenanceSideBar.jsp"%>
    <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">

            <nav class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top"
                 style="background-color:#37499A;">
                <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
                    <i class="fa fa-bars"></i>
                </button>
                <ul class="navbar-nav ml-auto" style="align-items:center; gap:16px;">
                    <!-- Notification Bell -->
                    <li class="nav-item">
                        <div class="notif-bell-wrap" onclick="toggleNotifDropdown()">
                            <i class="fas fa-bell text-white" style="font-size:18px;"></i>
                            <span class="notif-badge" id="notifBadge" style="display:none;">0</span>
                            <div class="notif-dropdown" id="notifDropdown">
                                <div style="padding:10px 14px;font-weight:700;font-size:12px;color:#37499A;border-bottom:1px solid #f0f3fa;">
                                    Notifications
                                </div>
                                <div id="notifList"><div class="notif-empty">Loading...</div></div>
                            </div>
                        </div>
                    </li>
                    <button class="btn btn-link" onclick="window.location.href='Landingpage.jsp'"
                            style="background-color:transparent;color:white;border:none;">
                        <i class="fa fa-home"></i>
                    </button>
                    <div class="topbar-divider d-none d-sm-block"></div>
                    <li class="nav-item dropdown no-arrow">
                        <a class="nav-link dropdown-toggleww" href="#" id="userDropdown123"
                           role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-user text-white mr-2"></i>
                            <span class="ml-2 d-none d-lg-inline text-white small" id="usernameDisplay">Username</span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in">
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" onclick="logoutUser(event)">
                                <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>Logout
                            </a>
                        </div>
                    </li>
                </ul>
            </nav>

            <div class="container-fluid">
                <div class="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <div class="page-heading">
                            <i class="fas fa-user-shield mr-2"></i>Maintenance – Assign Tickets
                        </div>
                        <div class="page-subheading">Review open tickets and assign to maintenance workers</div>
                    </div>
                </div>

                <div class="content-card">
                    <div class="content-card-header">
                        <h6><i class="fas fa-clipboard-list"></i> Open Tickets</h6>
                        <small>Click <strong>Assign</strong> to allocate a worker. Click <strong>Close</strong> once fixed.</small>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover mb-0" id="assignTicketTable" style="width:100%">
                            <thead>
                                <tr>
                                    <th>Ticket No.</th>
                                    <th>Machine Category</th>
                                    <th>Machine</th>
                                    <th>Issue Types</th>
                                    <th>Problem Description</th>
                                    <th>Reported By</th>
                                    <th>MobileNo</th>
                                    <th>Date &amp; Time</th>
                                    <th>Closed Date &amp; Time</th>
                                    <th>Technician Assigned</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="assignTicketTbody">
                                <tr><td colspan="9">
                                    <div class="empty-state">
                                        <i class="fas fa-inbox"></i>
                                        <p>Loading tickets...</p>
                                    </div>
                                </td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ════════════════ ASSIGN MODAL ════════════════ -->
<div class="modal fade" id="assignModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header-custom">
                <div class="modal-title-text">
                    <i class="fas fa-user-plus"></i> Assign Ticket <span id="assignTicketIdDisplay" style="opacity:.8;font-weight:400;"></span>
                </div>
                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
            </div>
            <div class="modal-body">
                <div class="form-section-title">Select Worker(s)</div>
                <div class="form-group mb-3">
                    <label class="form-label-sm">Workers <span style="color:#dc3545;">*</span>
                        <small class="text-muted">(Hold Ctrl / Cmd to select multiple)</small>
                    </label>
                    <select class="form-control form-control-sm" id="workerSelect" multiple size="5"></select>
                </div>
                <div class="form-group mb-2">
                    <label class="form-label-sm">Assignment Note <small class="text-muted">(optional)</small></label>
                    <textarea class="form-control form-control-sm" id="assignNote" rows="3"
                        placeholder="Any special instructions for the worker..."></textarea>
                </div>
                <div id="prevAssignees"></div>
            </div>
            <div class="modal-footer d-flex justify-content-end" style="gap:10px;">
                <button type="button" class="btn-cancel-modal" data-dismiss="modal">Cancel</button>
                <button   id="btnSubmitAssign"  type="button" class="btn-submit-modal" onclick="submitAssign()">
                    <i class="fas fa-paper-plane"></i> Assign
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ════════════════ WORK HOURS SUMMARY MODAL ════════════════ -->
<div class="modal fade" id="workHoursSummaryModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header-custom">
                <div class="modal-title-text"><i class="fas fa-clock"></i> Ticket Closed – Work Hours</div>
                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
            </div>
            <div class="modal-body" id="workHoursBody"></div>
            <div class="modal-footer d-flex justify-content-end">
                <button type="button" class="btn-cancel-modal" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- ════════════════ TICKET DETAIL MODAL ════════════════ -->
<div class="modal fade" id="ticketDetailModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header-custom">
                <div class="modal-title-text"><i class="fas fa-info-circle"></i> Ticket Detail</div>
                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
            </div>
            <div class="modal-body" id="ticketDetailBody"></div>
            <div class="modal-footer d-flex justify-content-end">
                <button type="button" class="btn-cancel-modal" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<a class="scroll-to-top rounded" href="#page-top"><i class="fas fa-angle-up"></i></a>

<script src="js/config.js"></script>
<script src="vendor/jquery/jquery.min.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="js/ruang-admin.min.js"></script>
<script src="vendor/datatables/jquery.dataTables.min.js"></script>
<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
<script src="js/logout.js"></script>
<script src="js/username.js"></script>
<script src="js/factoryid.js"></script>
<script src="js/Sessionfilter.js"></script>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
<script src="js/Maintenanceassign.js?v=<%=ts%>"></script>
<script>
function toggleNotifDropdown() {
    $('#notifDropdown').toggleClass('open');
}
$(document).on('click', function (e) {
    if (!$(e.target).closest('.notif-bell-wrap').length) {
        $('#notifDropdown').removeClass('open');
    }
});
</script>
</body>
</html>
