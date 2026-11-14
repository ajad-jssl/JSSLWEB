/* ============================================================
   DOPhaseReport.js
   Loaded AFTER DrawingReport.js (uses its baseUrl, toggleReportTab,
   toDateInputValue and the page permission check).

   Two reports share the same filters (#phContract, #phPartMark,
   #phFromDate, #phToDate, #phSearchBtn):
     - Detailed report  (#PhaseTab)         -> #phResultBox / #phReportTable
     - Summary report   (#PhasesummaryTab)  -> #phSummaryBox / #phsummaryTable
   ============================================================ */

var PHASE_NAMES = { 1: "Modular", 2: "Editor", 3: "Checker" };
var phStageNames = {}; // stageId -> stageName (filled from getStages)
var PH_ALL = "ALL";
var phMarkNames = {};            // markId -> mark number
window._phContractNames = {};    // contractId -> JobCode

// stage ids counted in the summary report
var PH_STAGE_MC = 1;      // Modal Checking
var PH_STAGE_FINAL = 3;   // Final
var PH_STAGE_BD = 4;      // Back Drafting

var phStageReady = null;   // promise, resolved when stage names are loaded

function loadPhaseStageNames() {
    phStageReady = $.ajax({
        url: baseUrl + "/api/drawing_stage/getAll",
        type: "GET",
        xhrFields: { withCredentials: true }
    }).then(
        function (data) {
            $.each(data || [], function (i, s) {
                var id   = s.stageId   != null ? s.stageId   : (s.stage_id   != null ? s.stage_id   : (s.Stage_id   != null ? s.Stage_id   : s.id));
                var name = s.stageName != null ? s.stageName : (s.stage_name != null ? s.stage_name : (s.Stage_name != null ? s.Stage_name : s.name));
                if (id != null && name) phStageNames[id] = $.trim(name);
            });
            return true;
        },
        function (xhr) {
            console.error("Stage master error:", xhr.responseText);
            return $.Deferred().resolve(false).promise();   // never block the report
        }
    );
    return phStageReady;
}

/* ── helpers ──────────────────────────────────────── */
function phEscape(v) {
    return $("<div>").text(v == null ? "" : String(v)).html();
}

function phAlert(msg) {
    if ($("#customErrorModal").length) {
        $("#customErrorMessage").text(msg);
        $("#customErrorModal").modal("show");
    } else {
        alert(msg);
    }
}

function phToday() {
    return toDateInputValue(new Date());   // from DrawingReport.js
}

/* ── dates: default month start -> today, no future dates ── */
function initPhaseDates() {
    var today = new Date();
    var first = new Date(today.getFullYear(), today.getMonth(), 1);
    var todayStr = phToday();

    $("#phFromDate").val(toDateInputValue(first)).attr("max", todayStr);
    $("#phToDate").val(todayStr).attr("max", todayStr);
    $("#phToDate").attr("min", $("#phFromDate").val());
    $("#phFromDate").attr("max", $("#phToDate").val());

    $("#phFromDate").on("change", function () {
        var from = $(this).val();
        $("#phToDate").attr("min", from || "");
        if (from && from > todayStr) $(this).val("");
    });

    $("#phToDate").on("change", function () {
        var to = $(this).val();
        $("#phFromDate").attr("max", to || todayStr);
        if (to && to > todayStr) $(this).val("");
    });
}

/* ── searchable dropdown (no library, no css file) ── */
function makeSearchSelect(selector, placeholder) {

    var $sel = $(selector);
    if (!$sel.length || $sel.data("searchable")) return;
    $sel.data("searchable", true);

    if (!$("#ssStyles").length) {
        $("<style id='ssStyles'>").text(
            ".ss-wrap{position:relative}" +
            ".ss-list{position:absolute;top:100%;left:0;right:0;z-index:1060;max-height:220px;overflow-y:auto;" +
            "background:#fff;border:1px solid #ced4da;border-radius:4px;box-shadow:0 4px 8px rgba(0,0,0,.15);" +
            "display:none;margin:2px 0 0;padding:0;list-style:none}" +
            ".ss-item{padding:6px 10px;font-size:13px;cursor:pointer;text-align:left}" +
            ".ss-item.active,.ss-item:hover{background:#5578A9;color:#fff}" +
            ".ss-empty{padding:6px 10px;font-size:13px;color:#6c757d;text-align:left}"
        ).appendTo("head");
    }

    var $wrap  = $('<div class="ss-wrap"></div>');
    var $input = $('<input type="text" class="form-control form-control-sm" autocomplete="off">')
                    .attr("placeholder", placeholder);
    var $list  = $('<ul class="ss-list"></ul>');
    var active = -1;

    $wrap.append($input, $list);
    $sel.after($wrap).hide();

    function sync() {
        $input.val($sel.val() ? $sel.find("option:selected").text().trim() : "");
        $list.hide();
        active = -1;
    }

    function render(filter) {
        $list.empty();
        var term  = $.trim(filter || "").toLowerCase();
        var count = 0;

        $sel.find("option").each(function () {
            var v = $(this).val();
            if (!v) return;
            var t = $(this).text();
            if (term && t.toLowerCase().indexOf(term) === -1) return;
            $('<li class="ss-item"></li>').attr("data-value", v).text(t).appendTo($list);
            count++;
        });

        if (!count) $('<li class="ss-empty"></li>').text("No results found").appendTo($list);
        active = -1;
        $list.show();
    }

    function setActive(i) {
        var $items = $list.find(".ss-item");
        if (!$items.length) return;
        active = i;
        $items.removeClass("active");
        var el = $items.eq(i).addClass("active")[0];
        if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
    }

    function choose(v) {
        $sel.val(v).trigger("change");
        sync();
        $input.blur();
    }

    $input.on("focus click", function () { this.select(); render(""); });
    $input.on("input", function () { render($(this).val()); });

    $input.on("keydown", function (e) {
        var $items = $list.find(".ss-item");
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!$list.is(":visible")) render($input.val());
            setActive(Math.min(active + 1, $items.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive(Math.max(active - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            var $pick = active >= 0 ? $items.eq(active) : ($items.length === 1 ? $items.eq(0) : $());
            if ($pick.length) choose($pick.attr("data-value"));
        } else if (e.key === "Escape") {
            sync();
            $input.blur();
        }
    });

    $list.on("mousedown", ".ss-item", function (e) {
        e.preventDefault();
        choose($(this).attr("data-value"));
    });

    $input.on("blur", function () {
        if ($.trim($input.val()) === "" && $sel.val()) {
            $sel.val("").trigger("change");
        }
        sync();
    });

    // call $sel.trigger("refreshSearch") after changing the options in code
    $sel.on("refreshSearch", sync);
}

/* ── Load Contracts dropdown ──────────────────────── */
function loadPhaseContracts() {
    $.ajax({
        url: baseUrl + "/api/contracts/getAll",
        type: "GET",
        xhrFields: { withCredentials: true },
        success: function (data) {
            var dd = $("#phContract");
            dd.empty().append('<option value="">Select Contract</option>');
            window._phContractIds = [];

            if (data && data.length > 0) {
                dd.append('<option value="' + PH_ALL + '">All Contracts</option>');
                $.each(data, function (i, item) {
                    window._phContractIds.push(item.contract_id);
                    window._phContractNames[item.contract_id] = item.JobCode;
                    dd.append('<option value="' + item.contract_id + '">' + phEscape(item.JobCode) + '</option>');
                });
            }
            dd.trigger("refreshSearch");
        },
        error: function (xhr) {
            console.error("Contracts error:", xhr.responseText);
            phAlert("Failed to load Contract data");
        }
    });
}

/* ── Load Part Marks when contract changes ────────── */
function resetPhasePartMarks() {
    $("#phPartMark").empty()
        .append('<option value="">Select part mark</option>')
        .append('<option value="' + PH_ALL + '">All Part Marks</option>')
        .trigger("refreshSearch");
}

$("#phContract").on("change", function () {

    var contractId = $(this).val();
    var userId     = sessionStorage.getItem("id");

    resetPhasePartMarks();
    $("#phResultBox, #phSummaryBox").hide();
    $("#phReportTable tbody").empty();
    $("#phsummaryTable tbody").empty();

    if (!contractId) return;

    // All Contracts -> part marks differ per contract, so only "All Part Marks" applies
    if (contractId === PH_ALL) {
        $("#phPartMark").val(PH_ALL).trigger("refreshSearch");
        return;
    }

    if (!userId) return;

    $.ajax({
        url: baseUrl + "/api/contracts/getStages",
        type: "GET",
        data: { contractId: contractId, userId: userId },
        xhrFields: { withCredentials: true },
        success: function (data) {
            if (!data || data.length === 0) return;

            var seen = {};
            var dd   = $("#phPartMark");

            $.each(data, function (i, r) {
                if (r.stageId != null && r.stageName) phStageNames[r.stageId] = r.stageName;
                if (r.markId != null && r.mark) phMarkNames[r.markId] = r.mark;
                if (seen[r.markId]) return;
                seen[r.markId] = true;
                dd.append('<option value="' + r.markId + '">' + phEscape(r.mark) + '</option>');
            });

            dd.trigger("refreshSearch");
        },
        error: function (xhr) {
            console.error("Part Mark error:", xhr.responseText);
            phAlert("Failed to load Part Mark data");
        }
    });
});

/* ============================================================
   Shared loader: validates the filters, calls getPhaseEntries for
   every selected contract, applies the part mark + date filter and
   hands the rows to onRows(rows). onRows(null) means every call failed.
   ============================================================ */
function loadPhaseRows(tbodySelector, colspan, onRows) {

    var contractId = $("#phContract").val();
    var markId     = $("#phPartMark").val();
    var fromDate   = $("#phFromDate").val();
    var toDate     = $("#phToDate").val();
    var todayStr   = phToday();

    if (!contractId)                     { phAlert("Please select a Contract"); return; }
    if (fromDate && fromDate > todayStr) { phAlert("Start Date cannot be a future date"); return; }
    if (toDate && toDate > todayStr)     { phAlert("End Date cannot be a future date"); return; }
    if (fromDate && toDate && fromDate > toDate) { phAlert("Start Date cannot be after End Date"); return; }

    var ids = (contractId === PH_ALL) ? (window._phContractIds || []) : [contractId];
    var allMarks = (!markId || markId === PH_ALL);

    $(tbodySelector).html(
        '<tr><td colspan="' + colspan + '" class="text-center"><i class="fas fa-spinner fa-spin"></i> Please wait...</td></tr>'
    );

    if (ids.length === 0) {
        onRows([]);
        return;
    }

    var failed = 0;

    var calls = $.map(ids, function (id) {
        return $.ajax({
            url: baseUrl + "/api/contracts/getPhaseEntries",
            type: "GET",
            data: { contractId: id },
            xhrFields: { withCredentials: true }
        }).then(
            function (data) {
                data = data || [];
                $.each(data, function (i, r) { r._contractId = id; });   // tag each row with its contract
                return data;
            },
            function (xhr) {
                failed++;
                console.error("Phase report error (contract " + id + "):", xhr.responseText);
                return $.Deferred().resolve([]).promise();
            }
        );
    });
    // also wait for the stage names (always the LAST item)
    calls.push(phStageReady || loadPhaseStageNames());

    $.when.apply($, calls).done(function () {

        var results = Array.prototype.slice.call(arguments);
        results.pop();                       // remove the stage-names result

        if (failed === ids.length) {
            $(tbodySelector).html(
                '<tr><td colspan="' + colspan + '" class="text-center text-danger">' +
                '<i class="fas fa-exclamation-circle"></i> Error loading data.</td></tr>'
            );
            onRows(null);
            return;
        }

        var merged = [].concat.apply([], results);

        var rows = $.grep(merged, function (r) {

            if (!allMarks && String(r.markId) !== String(markId)) return false;

            var t = new Date(r.modifiedDate || r.createdDate);
            if (isNaN(t.getTime())) return true;
            var d = toDateInputValue(t);

            if (fromDate && d < fromDate) return false;
            if (toDate && d > toDate)     return false;
            return true;
        });

        onRows(rows);

        if (failed > 0) phAlert("Data for " + failed + " contract(s) could not be loaded.");
    });
}

/* ── Search ───────────────────────────────────────── */
function fetchPhaseReport() {
    $("#phResultBox").show();
    loadPhaseRows("#phReportTable tbody", 7, function (rows) {
        if (rows === null) {
            window._lastPhaseData = [];
            return;
        }
        window._lastPhaseData = rows;
        renderPhaseReport(rows);
    });
}

function fetchPhaseSummary() {
    $("#phSummaryBox").show();
    loadPhaseRows("#phsummaryTable tbody", 6, function (rows) {
        if (rows === null) {
            window._lastSummaryData = [];
            return;
        }
        window._lastSummaryData = buildSummaryGroups(rows);
        renderPhaseSummary(window._lastSummaryData);
    });
}

// one Search button, two reports (depends on the active tab)
$("#phSearchBtn").on("click", function (e) {
    e.preventDefault();
    if (window._activeReportType === "summary") fetchPhaseSummary();
    else fetchPhaseReport();
});

/* ============================================================
   DETAILED REPORT
   ============================================================ */

/* ── group rows: one line per Contract + Part Mark + Phase + Stage, in order of occurrence ── */
function phTime(r) {
    var t = new Date(r.createdDate || r.modifiedDate).getTime();
    return isNaN(t) ? 0 : t;
}

function buildPhaseGroups(rows) {

    // oldest first, so first occurrence and remarks follow real order
    var sorted = $.map(rows, function (r, i) { return { r: r, i: i, t: phTime(r) }; });
    sorted.sort(function (a, b) { return (a.t - b.t) || (a.i - b.i); });

    var list = [], map = {};

    $.each(sorted, function (n, o) {
        var r   = o.r;
        var key = r._contractId + "|" + r.markId + "|" + r.typeId + "|" + r.stageId;

        if (!map[key]) {
            map[key] = {
                contract:  (window._phContractNames || {})[r._contractId] || r._contractId,
                markId:    r.markId,
                mark:      phMarkNames[r.markId] || r.mark || r.markNo || r.markId,
                typeId:    Number(r.typeId),
                stageId:   r.stageId,
                stageName: r.stageName || phStageNames[r.stageId] || ("Stage " + r.stageId),
				   
                remarks:   [],
                //count:     0,
                //seq:       n                // position of first occurrence
            };
            list.push(map[key]);
        }

        map[key].count++;

        var rem = $.trim(r.remarks || "");
        if (rem && map[key].remarks.indexOf(rem) === -1) map[key].remarks.push(rem);
    });

    // contract -> part mark -> order of occurrence
    list.sort(function (a, b) {
        var c = String(a.contract).localeCompare(String(b.contract));
        if (c) return c;
        var m = String(a.mark).localeCompare(String(b.mark), undefined, { numeric: true });
        if (m) return m;
        return a.seq - b.seq;
    });

    return list;
}

function renderPhaseReport(rows) {

    var $tbody = $("#phReportTable tbody");
    $("#phResultBox").show();

    if (!rows || rows.length === 0) {
        $tbody.html('<tr><td colspan="7" class="text-center text-muted">No records found.</td></tr>');
        return;
    }

    var groups = buildPhaseGroups(rows);
    var html = "";

    for (var i = 0; i < groups.length; i++) {
        var g = groups[i];

        html += '<tr>'
              + '<td>' + (i + 1) + '</td>'
              + '<td>' + phEscape(g.contract) + '</td>'
              + '<td>' + phEscape(g.mark) + '</td>'
              + '<td>' + phEscape(PHASE_NAMES[g.typeId] || ("Phase " + g.typeId)) + '</td>'
              + '<td>' + phEscape(g.stageName) + '</td>'
              + '<td>' + phEscape(g.remarks.join("; ")) + '</td>'
              + '<td>' + g.count + '</td>'
              + '</tr>';
    }
    $tbody.html(html);
}

function exportPhaseReport() {

    var rows = window._lastPhaseData || [];
    if (rows.length === 0) {
        alert("No data to export. Please search first.");
        return;
    }

    var groups = buildPhaseGroups(rows);

    var aoa = [
        ["DO Phase Report"],
        ["SL.NO", "Contract", "Part Mark", "Phase", "Stage", "Remarks", "Count of stages"]
    ];

    for (var i = 0; i < groups.length; i++) {
        var g = groups[i];
        aoa.push([i + 1, g.contract, g.mark, PHASE_NAMES[g.typeId] || ("Phase " + g.typeId),
                  g.stageName, g.remarks.join("; "), g.count]);
    }

    var ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
    ws["!cols"]   = [{ wch: 7 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 26 }, { wch: 40 }, { wch: 16 }];

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DO Phase Report");
    XLSX.writeFile(wb, "DO_Phase_Report.xlsx");
}

/* ============================================================
   SUMMARY REPORT: per Contract + Part Mark, how many saved entries
   are at Model Checking (1), Back Drafting (4) and Final (3)
   ============================================================ */
function buildSummaryGroups(rows) {

    var list = [], map = {};

    $.each(rows, function (i, r) {

        var key = r._contractId + "|" + r.markId;

        if (!map[key]) {
            map[key] = {
                contract: (window._phContractNames || {})[r._contractId] || r._contractId,
                mark:     phMarkNames[r.markId] || r.mark || r.markNo || r.markId,
                mc: 0,
                bd: 0,
                fin: 0
            };
            list.push(map[key]);
        }

        var s = Number(r.stageId);
        if (s === PH_STAGE_MC)         map[key].mc++;
        else if (s === PH_STAGE_BD)    map[key].bd++;
        else if (s === PH_STAGE_FINAL) map[key].fin++;
    });

    // contract -> part mark
    list.sort(function (a, b) {
        var c = String(a.contract).localeCompare(String(b.contract));
        if (c) return c;
        return String(a.mark).localeCompare(String(b.mark), undefined, { numeric: true });
    });

    return list;
}

function renderPhaseSummary(groups) {

    var $tbody = $("#phsummaryTable tbody");
    $("#phSummaryBox").show();

    if (!groups || groups.length === 0) {
        $tbody.html('<tr><td colspan="6" class="text-center text-muted">No records found.</td></tr>');
        return;
    }

    var html = "";

    for (var i = 0; i < groups.length; i++) {
        var g = groups[i];

        html += '<tr>'
              + '<td>' + (i + 1) + '</td>'
              + '<td>' + phEscape(g.contract) + '</td>'
              + '<td>' + phEscape(g.mark) + '</td>'
              + '<td>' + g.mc + '</td>'
              + '<td>' + g.bd + '</td>'
              + '<td>' + g.fin + '</td>'
              + '</tr>';
    }
    $tbody.html(html);
}

function exportsummaryReport() {

    var groups = window._lastSummaryData || [];
    if (groups.length === 0) {
        alert("No data to export. Please search first.");
        return;
    }

    var aoa = [
        ["DO Phase Summary Report"],
        ["SL.NO", "Contract", "Part Mark", "Model Checking", "Back Drafting", "Final"]
    ];

    for (var i = 0; i < groups.length; i++) {
        var g = groups[i];
        aoa.push([i + 1, g.contract, g.mark, g.mc, g.bd, g.fin]);
    }

    var ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];
    ws["!cols"]   = [{ wch: 7 }, { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 10 }];

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DO Phase Summary");
    XLSX.writeFile(wb, "DO_Phase_Summary_Report.xlsx");
}

/* ── Tab switching ────────────────────────────────── */
function showPhaseTab() {
    $("#amsFilterSection, #container1, #container2, #phSummaryBox").hide();
    $("#itemsTab, #financeTab, #PhasesummaryTab").removeClass("active");
    $("#PhaseTab").addClass("active");
    $("#phReportSection").show();
    window._activeReportType = "phase";
}

function showPhaseSummaryTab() {
    $("#amsFilterSection, #container1, #container2, #phResultBox").hide();
    $("#itemsTab, #financeTab, #PhaseTab").removeClass("active");
    $("#PhasesummaryTab").addClass("active");
    $("#phReportSection").show();
    window._activeReportType = "summary";
}

$("#PhaseTab").on("click", function (e) {
    e.preventDefault();
    showPhaseTab();
});

$("#PhasesummaryTab").on("click", function (e) {
    e.preventDefault();
    showPhaseSummaryTab();
});

// Detailed / Finance tabs: hide the phase part, bring back their own filter
var _origToggleReportTab = window.toggleReportTab;
window.toggleReportTab = function (type) {
    $("#phReportSection, #phResultBox, #phSummaryBox").hide();
    $("#PhaseTab, #PhasesummaryTab").removeClass("active");
    $("#amsFilterSection").show();
    _origToggleReportTab(type);
};

/* ── Init ─────────────────────────────────────────── */
$(document).ready(function () {
    initPhaseDates();
    makeSearchSelect("#phContract", "Search / select contract");
    makeSearchSelect("#phPartMark", "Search / select part mark");
    loadPhaseStageNames();
    loadPhaseContracts();
});