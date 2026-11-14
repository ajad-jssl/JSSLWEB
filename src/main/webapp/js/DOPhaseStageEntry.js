

/* ============ phase / role configuration ============ */
const PHASE_TYPE = { MODULAR: 1, EDITOR: 2, CHECKER: 3 };   // TYPE_ID of each role
const EDITOR_DONE_STAGE_ID = 2;                              // stage that hands the mark over to the checker
const FINAL_STAGE_ID = 3;                                    // Final -> locked for everyone
const REMARKS_MAX = 50;
const BACK_DRAFTING_STAGE_ID = 4;        // checker sends the mark back to the editor
const MODAL_CHECKING_STAGE_ID = 1;                           // MC: sender keeps editing and the modular opens
const COUNTED_STAGE_IDS = [MODAL_CHECKING_STAGE_ID, BACK_DRAFTING_STAGE_ID];   // only MC and BD show a count
const STAGE_NAMES = { 1: "Modal Correction (MC)", 2: "Done", 3: "Final", 4: "Back Drafting" };
let stageNameMap = {};   // stageId -> stageName, collected from every part mark

let phaseRowTemplate = "";   // outerHTML of #PhaseRowTemplate (captured once, then removed from the table)
let phaseDT = null;          // DataTable instance
let pendingPhaseSave = null; // rows waiting for the confirm modal


/*const SHOW_FIXED_LABELS = false;*/

function reworkPrefix(n) { return Number(n) > 0 ? "Rework " + n + " - " : ""; }

const SHOW_FIXED_IN_ENTRY   = false;   // dropdown / transaction screen: "Done (BD 2 fixed)" or "Done"
const SHOW_FIXED_IN_HISTORY = true;   // history table + current-stage strip

function entryLabelOf(e)   { return (SHOW_FIXED_IN_ENTRY   ? e.label : e.plainLabel) || e.label; }
function historyLabelOf(h) { return (SHOW_FIXED_IN_HISTORY ? h.label : h.plainLabel) || h.label; }

/* ---------- helpers ---------- */

function escapePhaseHtml(value) {
	return $("<div>").text(value == null ? "" : String(value)).html();
}

function showPhaseError(message) {
	$("#customErrorMessage").text(message);
	$("#customErrorModal").modal("show");
}

function showPhaseMessage(message) {
	showPhaseError(message);   // same message modal
}

function clearPhaseRows() {
	if (phaseDT) {
		phaseDT.clear().draw();
	}
}



/* which roles may edit a mark right now, decided only by its LAST transaction */
/*function getPhaseAccess(list) {

	let latest = getLatestEntry(list);

	// fresh contract: only the Editor can start it (Modular and Checker stay readonly)
	if (!latest) return [PHASE_TYPE.EDITOR];

	let type  = Number(latest.typeId);
	let stage = Number(latest.stageId);

	if (!type) return [PHASE_TYPE.EDITOR];            // old rows without a phase
	// after
	if (stage === FINAL_STAGE_ID) {
		// Final: only the Checker can reopen it (edit it or raise MC/BD).
		// The 2-day auto lock is set by the server, so respect its flag if it comes back.
		if (latest.locked) return [];
		return [PHASE_TYPE.CHECKER];
	}
	let allowed = [];

	// after: the role of the last transaction always keeps editing its own row
	allowed.push(type);

	// MODULAR: opens only when the last transaction is Editor/Checker at Modal Checking (stage 1)
	if ((type === PHASE_TYPE.EDITOR || type === PHASE_TYPE.CHECKER)
			&& stage === MODAL_CHECKING_STAGE_ID) {
		allowed.push(PHASE_TYPE.MODULAR);
	}

	// EDITOR / CHECKER: last transaction is Modular with stage 2 (Done)
	// -> only the role that sent it to the Modular (the last non-modular entry) opens
	if (type === PHASE_TYPE.MODULAR && stage === EDITOR_DONE_STAGE_ID) {
		let sender = getLatestEntry($.grep(list, function(e) {
			return Number(e.typeId) !== PHASE_TYPE.MODULAR;
		}));
		allowed.push(sender ? Number(sender.typeId) : PHASE_TYPE.EDITOR);
	}

	// EDITOR: last transaction is Checker with stage 4 (Back Drafting)
	if (type === PHASE_TYPE.CHECKER && stage === BACK_DRAFTING_STAGE_ID) {
		allowed.push(PHASE_TYPE.EDITOR);
	}

	// CHECKER: last transaction is Editor with stage 2 (Done)
	if (type === PHASE_TYPE.EDITOR && stage === EDITOR_DONE_STAGE_ID) {
		allowed.push(PHASE_TYPE.CHECKER);
	}

	return allowed;
}*/


function getPhaseAccess(list) {

	let latest = getLatestEntry(list);
	if (!latest) return [PHASE_TYPE.EDITOR];

	let type = Number(latest.typeId), stage = Number(latest.stageId);
	if (!type) return [PHASE_TYPE.EDITOR];

	if (stage === FINAL_STAGE_ID) return latest.locked ? [] : [PHASE_TYPE.CHECKER];

	let allowed = [];
	//if (!(type === PHASE_TYPE.EDITOR && stage === EDITOR_DONE_STAGE_ID)) allowed.push(type);
	
	allowed.push(type);

	if (type === PHASE_TYPE.CHECKER && stage === MODAL_CHECKING_STAGE_ID) allowed.push(PHASE_TYPE.MODULAR);
	if (type === PHASE_TYPE.MODULAR && stage === EDITOR_DONE_STAGE_ID) allowed.push(PHASE_TYPE.EDITOR, PHASE_TYPE.CHECKER);
	if (type === PHASE_TYPE.CHECKER && stage === BACK_DRAFTING_STAGE_ID) allowed.push(PHASE_TYPE.EDITOR);
	if (type === PHASE_TYPE.EDITOR && stage === EDITOR_DONE_STAGE_ID) allowed.push(PHASE_TYPE.CHECKER);
	if (type === PHASE_TYPE.EDITOR && stage === MODAL_CHECKING_STAGE_ID) allowed.push(PHASE_TYPE.MODULAR);   // old rows

	return allowed;
}


/* the most recently touched entry of a mark decides whose turn it is */
function getLatestEntry(list) {

	let latest = null, latestTime = -1;

	$.each(list || [], function(i, e) {
		let t = new Date(e.modifiedDate || e.createdDate).getTime();
		if (!latest || t > latestTime || (t === latestTime && e.phaseId > latest.phaseId)) {
			latest = e;
			latestTime = t;
		}
	});
	return latest;
}

/* ---------- DataTable (paging + search) ---------- */

function initPhaseTable() {

	if (phaseDT) return;

	// the template row must not become a data row
	let $tpl = $("#PhaseRowTemplate");
	phaseRowTemplate = $tpl.prop("outerHTML");
	$tpl.remove();

	phaseDT = $("#PhaseTable").DataTable({
		paging: true,
		pageLength: 10,
		lengthChange: false,   // reference table has no "Show entries" box
		searching: true,
		ordering: false,
		info: true,
		autoWidth: false,

		columnDefs: [
			// Contract / Part Mark cells only hold <input>s -> make their value searchable
			{
				targets: [1, 2],
				render: function(data, type) {
					if (type === "filter" || type === "search") {
						return $("<div>").html(data).find("input").attr("value") || "";
					}
					return data;
				}
			},
			// Stage / Remarks: keep the <option> texts out of the search
			{
				targets: [3, 4],
				render: function(data, type) {
					return (type === "filter" || type === "search") ? "" : data;
				}
			},
			
			{ targets: 5, searchable: false, orderable: false }
			
		],

		drawCallback: function() {
			numberPhaseRows();
		}
	});
}

// Sl.No runs 1..N over the filtered rows, continuing across pages
function numberPhaseRows() {

	if (!phaseDT) return;

	phaseDT.column(0, { search: "applied", order: "applied" }).nodes().each(function(cell, i) {
		$(cell).closest("tr").find(".slno").text(i + 1);
	});
}

// jump to the page that holds a given row
function goToPhaseRow(node) {

	phaseDT.search("").draw();   // make sure the search box is not hiding it

	let nodes = phaseDT.rows({ search: "applied" }).nodes().toArray();
	let pos = nodes.indexOf(node);
	if (pos < 0) return;

	phaseDT.page(Math.floor(pos / phaseDT.page.len())).draw("page");
	$(node).find(".RemarksInput").focus();
}

/* ---------- load contracts ---------- */

function loadContracts() {

	$.ajax({
		url: new URL("/api/contracts/getAll", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(data) {

			let $sel = $("#contractSelect");
			$sel.empty().append('<option value="">-- Select Contract --</option>');

			// 204 No Content -> data is undefined
			if (!data || data.length === 0) {
				return;
			}

			$.each(data, function(index, item) {
				$sel.append(
					$("<option>")
						.val(item.contract_id)
						.text(item.JobCode)
				);
			});
		},

		error: function(xhr, status, error) {
			console.error("Fetch Contract Error:", xhr.status, xhr.responseText);
			alert("Failed to load Contract data");
		}
	});
}

/* ---------- stages per part mark ---------- */

// /api/contracts/getStages returns one flat row per (part mark, stage);
// fold them into one entry per part mark (and TYPE_ID) with its stage list
function groupPartMarks(data) {

	let order = [];
	let map = {};

	$.each(data, function(i, r) {

		let key = r.contract_id + "|" + r.mark + "|" + r.TYPE_ID;

	/*	if (!map[key]) {
			map[key] = {
				contract_id: r.contract_id,
				markId: r.markId,
				mark: r.mark,
				TYPE_ID: r.TYPE_ID,
				stages: []
			};*/
			
			if (!map[key]) {
			map[key] = {
				contract_id: r.contract_id,
				markId: r.markId,
				mark: r.mark,
				TYPE_ID: r.TYPE_ID,
				isLocked: Number(r.isLocked) === 1,
				isRevision: Number(r.isRevision) === 1,
				reworkNo: Number(r.reworkNo) || 0,
				stages: []
			};
			order.push(key);
		}
		// same mark can come back once per assigned user -> keep each stage once
		if (r.stageId != null && !map[key].stages.some(function(st) { return st.stageId == r.stageId; })) {
			map[key].stages.push({ stageId: r.stageId, stageName: r.stageName });
			stageNameMap[r.stageId] = r.stageName; 
		}
	});

	return $.map(order, function(k) { return map[k]; });
}

// number of saved entries of one mark that are at a given stage
function countStageEntries(list, stageId) {
	let n = 0;
	$.each(list || [], function(i, e) {
		if (Number(e.stageId) === Number(stageId)) n++;
	});
	return n;
}

// dropdown options for one part mark; only MC and BD show a number.
// The number is the entry this save would create (existing + 1).
// For the stage that is already saved and shown on the row, it is that entry's own number.
/*function buildStageOptions(stages, list, shownStageId) {

	let html = '<option value="">Select Stage</option>';

	$.each(stages || [], function(i, st) {

		let label = escapePhaseHtml(st.stageName);

		if (COUNTED_STAGE_IDS.indexOf(Number(st.stageId)) !== -1) {
			let n = countStageEntries(list, st.stageId);
			if (!(shownStageId != null && Number(shownStageId) === Number(st.stageId))) {
				n += 1;
			}
			label += ' (' + n + ')';
		}

		html += '<option value="' + st.stageId + '">' + label + '</option>';
	});

	return html;
}*/



// label of a stage for a NEW entry, from the latest transaction of the mark
function nextStageLabel(stageId, stageName, typeId, latest) {

	let mc = latest ? Number(latest.mcCount) || 0 : 0;
	let bd = latest ? Number(latest.bdCount) || 0 : 0;

	if (stageId === MODAL_CHECKING_STAGE_ID) return STAGE_NAMES[1] + " (" + (mc + 1) + ")";
	if (stageId === BACK_DRAFTING_STAGE_ID)  return STAGE_NAMES[4] + " (" + (bd + 1) + ")";
	
	

/*	if (typeId === PHASE_TYPE.EDITOR && stageId === EDITOR_DONE_STAGE_ID) {
		if (!latest) return "Fresh Editing";
		if (Number(latest.typeId) === PHASE_TYPE.MODULAR) return STAGE_NAMES[4] + " (" + (bd + 1) + ") - Editor";
		if (Number(latest.typeId) === PHASE_TYPE.MODULAR) return "Done (BD " + (bd + 1) + " fixed)";
		if (Number(latest.typeId) === PHASE_TYPE.CHECKER && Number(latest.stageId) === BACK_DRAFTING_STAGE_ID) {
			return "Done (BD " + bd + " fixed)";
		}
	}*/
	
	if (typeId === PHASE_TYPE.EDITOR && stageId === EDITOR_DONE_STAGE_ID) {
		if (!latest) return "Fresh Editing";
		if (!SHOW_FIXED_IN_ENTRY) return stageName;
		if (Number(latest.typeId) === PHASE_TYPE.MODULAR) return "Done (BD " + (bd + 1) + " fixed)";
		if (Number(latest.typeId) === PHASE_TYPE.CHECKER && Number(latest.stageId) === BACK_DRAFTING_STAGE_ID) {
			return "Done (BD " + bd + " fixed)";
		}
	}

	if (typeId === PHASE_TYPE.MODULAR && stageId === EDITOR_DONE_STAGE_ID && SHOW_FIXED_IN_ENTRY) {
		return "Done (MC " + mc + " fixed)";
	}
	
	
	return stageName;
}

/*function buildStageOptions(stages, latest, shown, typeId) {

	let html = '<option value="">Select Stage</option>';

	$.each(stages || [], function(i, st) {
		let sid = Number(st.stageId);
	
			
			let label = (shown && Number(shown.stageId) === sid && shown.label)
				? entryLabelOf(shown)
				
				: reworkPrefix(reworkNo) + nextStageLabel(sid, st.stageName, Number(typeId), latest);
		html += '<option value="' + st.stageId + '">' + escapePhaseHtml(label) + '</option>';
	});
	return html;
}*/



function buildStageOptions(stages, latest, shown, typeId, reworkNo) {

	let html = '<option value="">Select Stage</option>';

	$.each(stages || [], function(i, st) {
		let sid = Number(st.stageId);

		let label = (shown && Number(shown.stageId) === sid && shown.label)
			? entryLabelOf(shown)
			: reworkPrefix(reworkNo) + nextStageLabel(sid, st.stageName, Number(typeId), latest);

		html += '<option value="' + st.stageId + '">' + escapePhaseHtml(label) + '</option>';
	});
	return html;
}

/* ---------- modal open: reset to contract-only view ---------- */

$("#PhaseEntry").on("click", function() {
	initPhaseTable();
	$("#contractSelect").val("");
	resetContractSearch();    
	$("#container2").hide();
	clearPhaseRows();
	$("#savePhaseEntry").text("Create");
	loadContracts();
});

/* ---------- contract selected: part marks + existing entries ---------- */

$("#contractSelect").on("change", function() {

	let contractId = $(this).val();
	let contractText = $(this).find("option:selected").text().trim();
	let userId = sessionStorage.getItem("id");   // use "user_id" instead if USER_ID holds the login name

	clearPhaseRows();
	$("#container2").hide();

	if (!contractId) return;

	if (!userId) {
		showPhaseError("User session not found. Please log in again.");
		return;
	}

	let stagesUrl = new URL("/api/contracts/getStages", baseUrl);
	stagesUrl.searchParams.set("contractId", contractId);
	stagesUrl.searchParams.set("userId", userId);

	let entriesUrl = new URL("/api/contracts/getPhaseEntries", baseUrl);
	entriesUrl.searchParams.set("contractId", contractId);

	let stagesReq = $.ajax({ url: stagesUrl.toString(), type: "GET", xhrFields: { withCredentials: true } });
	let entriesReq = $.ajax({ url: entriesUrl.toString(), type: "GET", xhrFields: { withCredentials: true } });

	$.when(stagesReq, entriesReq).done(function(stagesRes, entriesRes) {

		let stages = stagesRes[0];            // undefined on 204 No Content
		let entries = entriesRes[0] || [];

		if (!stages || stages.length === 0) {
			showPhaseError("No part marks assigned to you for this contract");
			return;
		}

		// user picked another contract while we were waiting
		if ($("#contractSelect").val() !== contractId) return;

		// existing DrawingPhaseEntry rows, keyed by mark id
		// all phase rows of each mark, keyed by mark id
		let entriesByMark = {};
		$.each(entries, function(i, e) {
			(entriesByMark[e.markId] = entriesByMark[e.markId] || []).push(e);
		});

		renderPartMarkRows(groupPartMarks(stages), contractId, contractText, entriesByMark);

	}).fail(function(xhr) {
		console.error("Fetch Part Mark Error:", xhr.status, xhr.responseText);
		alert("Failed to load Part Mark data");
	});
});

function renderPartMarkRows(data, contractId, contractText, entriesByMark) {

	let nodes = [];


	$.each(data, function(index, item) {
		
		

		let list = entriesByMark[item.markId] || [];
		let latest = getLatestEntry(list);                                   // the last transaction of this mark
		/*let canEdit = getPhaseAccess(list).indexOf(Number(item.TYPE_ID)) !== -1;*/
		
		let locked = !!item.isLocked;
		let canEdit = !locked && getPhaseAccess(list).indexOf(Number(item.TYPE_ID)) !== -1;

		// last transaction belongs to this same role -> this save modifies that row
		/*let sameAsLatest = !!(latest && Number(latest.typeId) === Number(item.TYPE_ID));

		// what to show: the latest row of this role (editable only when it is also the last transaction)
		// after: editable row for a different team starts blank; otherwise show the last transaction
		let shown = (canEdit && !sameAsLatest) ? null : latest;*/
		
		
		// a Final of a revision mark is never modified: the next save inserts a new entry, starting blank
		let reopenedFinal = !!(latest && Number(latest.stageId) === FINAL_STAGE_ID && item.isRevision);

		let sameAsLatest = !!(latest && Number(latest.typeId) === Number(item.TYPE_ID)) && !reopenedFinal;

		let shown = ((canEdit && !sameAsLatest) ? null : latest);
		
		let $row = $(phaseRowTemplate).removeAttr("id").show();
		
		
		
		
		let $stage = $row.find(".Stageselect");
		let $remarks = $row.find(".RemarksInput");

		$row.attr("data-contract-id", contractId);
		$row.attr("data-mark-id", item.markId);
		$row.attr("data-type-id", item.TYPE_ID);
		$row.attr("data-phase-id", sameAsLatest ? latest.phaseId : "");     // empty -> a new row is inserted
		// after: the original values are always the last transaction's
		// after
		$row.attr("data-orig-stage", shown && shown.stageId != null ? shown.stageId : "");
		$row.attr("data-orig-remarks", shown && shown.remarks ? shown.remarks : "");

		$row.find(".contractSelect").val(contractText).attr("value", contractText).prop("readonly", true);
		$row.find(".Markno").val(item.mark).attr("value", item.mark).prop("readonly", true);
		$row.attr("data-base-phase", latest ? latest.phaseId : "");
		if (locked) $row.attr("title", "Locked (Final)");

		// editable row -> shows the latest only if it is this role's own transaction (the save modifies it);
		// editable row for the next role (handoff) starts blank so it creates a new entry;
		// readonly row -> shows the latest transaction, whoever made it
		// after: editable or readonly, everyone sees the last transaction
		let showValues = !!shown;

		
		
//$stage.html(buildStageOptions(item.stages, list, shown ? shown.stageId : null));


$stage.html(buildStageOptions(item.stages, latest, shown, item.TYPE_ID, item.reworkNo));

	/*	if (showValues && shown.stageId != null) {
			// saved stage isn't in this user's own list -> add it so it can still be displayed
			if ($stage.find('option[value="' + shown.stageId + '"]').length === 0) {
			
				let name = shown.stageName || stageNameMap[shown.stageId] || STAGE_NAMES[shown.stageId] || ("Stage " + shown.stageId);
				$stage.append($("<option>").val(shown.stageId).text(name));
				
				
			//	let name = shown.label || shown.stageName || stageNameMap[shown.stageId] || STAGE_NAMES[shown.stageId] || ("Stage " + shown.stageId);
				
				let name = (shown.label ? entryLabelOf(shown) : null) || shown.stageName || stageNameMap[shown.stageId] || STAGE_NAMES[shown.stageId] || ("Stage " + shown.stageId);
			}
			
			
			
			$stage.val(String(shown.stageId));

			// write it as an HTML attribute too, so it survives the DataTable redraw
			$stage.find("option").removeAttr("selected");
			$stage.find('option[value="' + shown.stageId + '"]').attr("selected", "selected");
		}*/
		
		if (showValues && shown.stageId != null) {
			// saved stage isn't in this user's own list -> add it so it can still be displayed
			if ($stage.find('option[value="' + shown.stageId + '"]').length === 0) {
				let name = (shown.label ? entryLabelOf(shown) : null) || shown.stageName
					|| stageNameMap[shown.stageId] || STAGE_NAMES[shown.stageId] || ("Stage " + shown.stageId);
				$stage.append($("<option>").val(shown.stageId).text(name));
			}
			$stage.val(String(shown.stageId));

			// write it as an HTML attribute too, so it survives the DataTable redraw
			$stage.find("option").removeAttr("selected");
			$stage.find('option[value="' + shown.stageId + '"]').attr("selected", "selected");
		}

		let remarksText = (showValues && shown.remarks) ? shown.remarks : "";
		$remarks.val(remarksText).attr("value", remarksText).attr("maxlength", REMARKS_MAX);
		
		
		$stage.prop("disabled", !canEdit);
		$remarks.prop("readonly", !canEdit);

		nodes.push($row[0]);
	});

	phaseDT.clear().rows.add(nodes).draw();

	$("#container2").show();
	phaseDT.columns.adjust();
	refreshSaveButtonLabel();
}

/* button text: Create / Update / Save, depending on what the editable rows are */
function refreshSaveButtonLabel() {

	let hasNew = false, hasExisting = false;

	phaseDT.rows().nodes().each(function(node) {
		let $r = $(node);
		if ($r.find(".Stageselect").prop("disabled")) return;
		if ($r.attr("data-phase-id")) hasExisting = true; else hasNew = true;
	});

	$("#savePhaseEntry").text(hasExisting && !hasNew ? "Update" : (hasNew && !hasExisting ? "Create" : "Save"));
}

/* ---------- row actions (kept from the earlier version; not used by the current 5-column table) ---------- */

function EditRow(icon) {
	let $row = $(icon).closest("tr");
	$row.find(".Stageselect").prop("disabled", false).focus();
	$row.find(".RemarksInput").prop("readonly", false);
}

function deleteRow(icon) {

	phaseDT.row($(icon).closest("tr")).remove().draw(false);

	// nothing left -> hide the table again
	if (phaseDT.rows().count() === 0) {
		$("#container2").hide();
	}
}

/* ---------- collect only editable rows, split into create / update ---------- */

function collectPhaseRows() {

	let userId = Number(sessionStorage.getItem("id"));
	let creates = [], updates = [];
	let tooLongNode = null, emptyRemarksNode = null;

	phaseDT.rows().nodes().each(function(node) {

		let $r = $(node);
		let $stage = $r.find(".Stageselect");

		if ($stage.prop("disabled")) return;          // not this user's turn / Final

		let stageId = $stage.val();
		if (!stageId) return;                          // nothing chosen -> skip

		let remarks = $r.find(".RemarksInput").val().trim();

		// nothing changed from what was shown -> skip (no update, no duplicate)
		if (stageId === $r.attr("data-orig-stage") && remarks === $r.attr("data-orig-remarks")) return;

	/*	if (remarks === "") {                          // remarks are mandatory
			if (!emptyRemarksNode) emptyRemarksNode = node;
			return;
		}*/
		
		
		if (remarks === "" && Number(stageId) === FINAL_STAGE_ID) {   // mandatory only for Final
			if (!emptyRemarksNode) emptyRemarksNode = node;
			return;
		}
		if (remarks.length > REMARKS_MAX) {
			if (!tooLongNode) tooLongNode = node;
			return;
		}

		let phaseId = $r.attr("data-phase-id");

		if (phaseId) {
			updates.push({
				phaseId: Number(phaseId),
				stageId: Number(stageId),
				remarks: remarks,
				modifiedBy: userId
			});
		} else {
		/*	creates.push({
				contractId: Number($r.attr("data-contract-id")),
				markId: Number($r.attr("data-mark-id")),
				typeId: Number($r.attr("data-type-id")),
				stageId: Number(stageId),
				remarks: remarks,
				createdBy: userId,
				status: 0
			});*/
			
			
			creates.push({
				contractId: Number($r.attr("data-contract-id")),
				markId: Number($r.attr("data-mark-id")),
				typeId: Number($r.attr("data-type-id")),
				stageId: Number(stageId),
				remarks: remarks,
				createdBy: userId,
				basePhaseId: $r.attr("data-base-phase") ? Number($r.attr("data-base-phase")) : null,
				status: 0
			});
		}
	});

	return { creates: creates, updates: updates, tooLongNode: tooLongNode, emptyRemarksNode: emptyRemarksNode };
}

/* ---------- create ---------- */

function createPhaseEntries(rows) {
	return $.ajax({
		url: new URL("/api/contracts/createPhaseEntries", baseUrl).toString(),
		type: "POST",
		contentType: "application/json",
		xhrFields: { withCredentials: true },
		data: JSON.stringify(rows)
	});
}

/* ---------- update ---------- */

function updatePhaseEntries(rows) {
	return $.ajax({
		url: new URL("/api/contracts/updatePhaseEntries", baseUrl).toString(),
		type: "POST",
		contentType: "application/json",
		xhrFields: { withCredentials: true },
		data: JSON.stringify(rows)
	});
}

/* ---------- one button: Create / Update -> confirm modal ---------- */

$("#savePhaseEntry").on("click", function() {

	if (!phaseDT || phaseDT.rows().count() === 0) {
		showPhaseError("No rows to save");
		return;
	}

	let result = collectPhaseRows();

	if (result.tooLongNode) {
		goToPhaseRow(result.tooLongNode);
		showPhaseError("Remarks cannot exceed " + REMARKS_MAX + " characters");
		return;
	}
	
	if (result.emptyRemarksNode) {
		goToPhaseRow(result.emptyRemarksNode);
		//showPhaseError("Remarks are required");
		showPhaseError("Remarks are required when Final is selected");
		return;
	}
	
	if (result.creates.length === 0 && result.updates.length === 0) {
		showPhaseError("Select a Stage in a row you can edit (or change a value) before saving");
		return;
	}

	pendingPhaseSave = result;

	let label = result.updates.length === 0 ? "Create"
			  : result.creates.length === 0 ? "Update" : "Create and Update";
	$("#confirmPhaseCreateModal .modal-body b").text("Are you sure you want to " + label + "?");

	$("#confirmPhaseCreateModal").modal("show");
});

$("#confirmPhaseCreate").on("click", function() {

	if (!pendingPhaseSave) return;

	let p = pendingPhaseSave;
	pendingPhaseSave = null;
	$("#confirmPhaseCreateModal").modal("hide");

	let calls = [];
	if (p.creates.length) calls.push(createPhaseEntries(p.creates));
	if (p.updates.length) calls.push(updatePhaseEntries(p.updates));

	$.when.apply($, calls).done(function() {

		showPhaseMessage("Saved successfully");

		// reload so the next role's rows become editable
		$("#contractSelect").trigger("change");

	}).fail(function(xhr) {
		console.error("Save Phase Entry Error:", xhr.status, xhr.responseText);
		showPhaseError(xhr.status === 409
			? "This entry was already created or is Final. Reselect the contract and try again."
			: "Failed to save Phase entry");
	});
});

/* ============ searchable contract dropdown (no library) ============ */
let contractSearchActive = -1;

function initContractSearch() {

	if ($("#contractSearchInput").length) return;

	// styles are injected here so the JSP stays untouched
	$("<style>").text(
		".cs-wrap{position:relative}" +
		".cs-list{position:fixed;z-index:2000;max-height:300px;overflow-y:auto;" +
		"background:#fff;border:1px solid #ced4da;border-radius:4px;box-shadow:0 4px 8px rgba(0,0,0,.15);" +
		"display:none;margin:2px 0 0;padding:0;list-style:none}" +
		".cs-item{padding:6px 10px;font-size:13px;cursor:pointer}" +
		".cs-item.active,.cs-item:hover{background:#5578A9;color:#fff}" +
		".cs-empty{padding:6px 10px;font-size:13px;color:#6c757d}"
	).appendTo("head");

	let $sel = $("#contractSelect");

	let $wrap = $('<div class="cs-wrap"></div>');
	let $input = $('<input type="text" id="contractSearchInput" class="form-control form-control-sm" ' +
		'placeholder="Search / select contract" autocomplete="off">');
		$(".modal-body").on("scroll", function() { $("#contractSearchList").hide(); });
	let $list = $('<ul class="cs-list" id="contractSearchList"></ul>');

	$wrap.append($input, $list);
	$sel.after($wrap).hide();     // the select stays in the DOM as the source of truth

	/* open + show everything when the box is focused or clicked */
	$input.on("focus click", function() {
		this.select();
		renderContractList("");
	});

	/* filter while typing */
	$input.on("input", function() {
		renderContractList($(this).val());
	});

	/* keyboard */
	$input.on("keydown", function(e) {

		let $items = $list.find(".cs-item");

		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (!$list.is(":visible")) renderContractList($input.val());
			setContractActive(Math.min(contractSearchActive + 1, $items.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setContractActive(Math.max(contractSearchActive - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			let $pick = contractSearchActive >= 0 ? $items.eq(contractSearchActive)
						: ($items.length === 1 ? $items.eq(0) : $());
			if ($pick.length) chooseContract($pick.attr("data-value"));
		} else if (e.key === "Escape") {
			resetContractSearch();
			$input.blur();
		}
	});

	/* mousedown (not click) so the input does not lose focus first */
	$list.on("mousedown", ".cs-item", function(e) {
		e.preventDefault();
		chooseContract($(this).attr("data-value"));
	});

	/* leaving the box: emptied text clears the selection, anything else reverts to the chosen contract */
	$input.on("blur", function() {

		if ($.trim($input.val()) === "" && $sel.val()) {
			$sel.val("").trigger("change");     // table is cleared by the existing change handler
		}
		resetContractSearch();
	});
}

function renderContractList(filter) {

	let $list = $("#contractSearchList").empty();
	let term = $.trim(filter || "").toLowerCase();
	let count = 0;

	$("#contractSelect option").each(function() {

		let val = $(this).val();
		if (!val) return;                       // skip "-- Select Contract --"

		let text = $(this).text();
		if (term && text.toLowerCase().indexOf(term) === -1) return;

		$('<li class="cs-item"></li>').attr("data-value", val).text(text).appendTo($list);
		count++;
	});

	if (count === 0) {
		$('<li class="cs-empty"></li>').text("No contracts found").appendTo($list);
	}

	contractSearchActive = -1;

	
	let r = $("#contractSearchInput")[0].getBoundingClientRect();
	$list.css({ top: r.bottom, left: r.left, width: r.width }).show();
}

function setContractActive(index) {

	let $items = $("#contractSearchList .cs-item");
	if ($items.length === 0) return;

	contractSearchActive = index;
	$items.removeClass("active");

	let $cur = $items.eq(index).addClass("active");
	let el = $cur[0];
	if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
}

function chooseContract(value) {

	let $sel = $("#contractSelect");
	$sel.val(value).trigger("change");          // existing handler loads the part marks

	$("#contractSearchInput").val($sel.find("option:selected").text().trim());
	$("#contractSearchList").hide();
	$("#contractSearchInput").blur();
}

// put the text box back in line with the select, and close the list
function resetContractSearch() {

	let $sel = $("#contractSelect");
	let text = $sel.val() ? $sel.find("option:selected").text().trim() : "";

	$("#contractSearchInput").val(text);
	$("#contractSearchList").hide();
	contractSearchActive = -1;
}

/* ============ history (View button) ============ */
const PHASE_ROLE_NAMES = { 1: "Modular", 2: "Editor", 3: "Checker" };

function formatHistoryDate(v) {
	if (!v) return "";
	let d = new Date(v);
	if (isNaN(d.getTime())) return "";
	function p(n) { return n < 10 ? "0" + n : n; }
	return p(d.getDate()) + "-" + p(d.getMonth() + 1) + "-" + d.getFullYear() +
		   " " + p(d.getHours()) + ":" + p(d.getMinutes());
}

function historyStageName(id) {
	return stageNameMap[id] || STAGE_NAMES[id] || ("Stage " + id);
}

$("#PhaseTable").on("click", ".ViewHistoryBtn", function() {

	let $r = $(this).closest("tr");

	openPhaseHistory(
		$r.attr("data-contract-id"),
		$r.attr("data-mark-id"),
		$r.find(".contractSelect").val(),
		$r.find(".Markno").val()
	);
});

/*function openPhaseHistory(contractId, markId, contractText, markText) {

	$("#phHistContract").text(contractText || "-");
	$("#phHistMark").text(markText || "-");
	$("#phHistPhase").text("-");
	$("#phHistStage").text("-");

	let $tbody = $("#phaseHistoryTable tbody");
	$tbody.html('<tr><td colspan="6" class="text-center"><i class="fas fa-spinner fa-spin"></i> Please wait...</td></tr>');
	$("#phaseHistoryModal").modal("show");

	let url = new URL("/api/contracts/getPhaseHistory", baseUrl);
	url.searchParams.set("contractId", contractId);
	url.searchParams.set("markId", markId);

	$.ajax({
		url: url.toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(data) {

			// 204 No Content -> data is undefined
			if (!data || data.length === 0) {
				$tbody.html('<tr><td colspan="6" class="text-center text-muted">No history available</td></tr>');
				return;
			}

			// newest first from the server -> first row is the current state
			let cur = data[0];
			$("#phHistPhase").text(PHASE_ROLE_NAMES[cur.typeId] || ("Phase " + cur.typeId));
			$("#phHistStage").text(historyStageName(cur.stageId));

			let html = "";
			$.each(data, function(i, h) {

				let who = h.userName || (h.modifiedBy != null ? h.modifiedBy : h.createdBy);

				html += '<tr>'
					+ '<td>' + (i + 1) + '</td>'
					+ '<td>' + escapePhaseHtml(formatHistoryDate(h.actionDate || h.createdDate)) + '</td>'
					+ '<td>' + escapePhaseHtml(PHASE_ROLE_NAMES[h.typeId] || ("Phase " + h.typeId)) + '</td>'
					+ '<td>' + escapePhaseHtml(historyStageName(h.stageId)) + '</td>'
					+ '<td>' + escapePhaseHtml(who) + '</td>'
					+ '<td>' + escapePhaseHtml(h.remarks) + '</td>'
					+ '</tr>';
			});
			$tbody.html(html);
		},

		error: function(xhr) {
			console.error("Fetch Phase History Error:", xhr.status, xhr.responseText);
			$tbody.html('<tr><td colspan="6" class="text-center text-danger">Failed to load history</td></tr>');
		}
	});
}*/


function openPhaseHistory(contractId, markId, contractText, markText) {

	$("#phHistContract").text(contractText || "-");
	$("#phHistMark").text(markText || "-");
	$("#phHistPhase").text("-");
	$("#phHistStage").text("-");

	let $tbody = $("#phaseHistoryTable tbody");
	$tbody.html('<tr><td colspan="8" class="text-center"><i class="fas fa-spinner fa-spin"></i> Please wait...</td></tr>');
	$("#phaseHistoryModal").modal("show");

	let url = new URL("/api/contracts/getPhaseHistory", baseUrl);
	url.searchParams.set("contractId", contractId);
	url.searchParams.set("markId", markId);

	$.ajax({
		url: url.toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

	/*	success: function(data) {

			if (!data || data.length === 0) {
				$tbody.html('<tr><td colspan="8" class="text-center text-muted">No history available</td></tr>');
				return;
			}

			// 1. sort OLDEST -> NEWEST (index is the tie-breaker), whatever order the server sent
			let sorted = $.map(data, function(h, i) { return { h: h, i: i }; });
			sorted.sort(function(a, b) {
				let ta = new Date(a.h.createdDate).getTime() || 0;
				let tb = new Date(b.h.createdDate).getTime() || 0;
				return ta !== tb ? ta - tb : a.i - b.i;
			});
			sorted = $.map(sorted, function(x) { return x.h; });
			// 2. number MC / BD in that order -> first MC = 1, second MC = 2 ...
			let counter = {};
			$.each(sorted, function(i, h) {
				let sid = Number(h.stageId);
				let label = h.stageName || historyStageName(sid);
				if (COUNTED_STAGE_IDS.indexOf(sid) !== -1) {
					counter[sid] = (counter[sid] || 0) + 1;
					label += " (" + counter[sid] + ")";
				}
				h._label = label;
			});

			// 3. current state = newest entry
			let cur = sorted[sorted.length - 1];
			$("#phHistPhase").text(cur.typeName || "-");
			$("#phHistStage").text(cur._label);

			// 4. show newest first (reverse this array if you prefer oldest first)
			let display = sorted.slice().reverse();

			let html = "";
			$.each(display, function(i, h) {
				html += '<tr>'
					+ '<td>' + (i + 1) + '</td>'
					+ '<td>' + escapePhaseHtml(h.mark) + '</td>'
					+ '<td>' + escapePhaseHtml(h._label) + '</td>'
					+ '<td>' + escapePhaseHtml(h.remarks) + '</td>'
					+ '<td>' + escapePhaseHtml(h.createdByName) + '</td>'
			     	+ '<td style="white-space:nowrap">' + escapePhaseHtml(formatHistoryDate(h.createdDate)) + '</td>'
					+ '<td>' + escapePhaseHtml(h.modifiedByName) + '</td>'
					+ '<td style="white-space:nowrap">' + escapePhaseHtml(formatHistoryDate(h.modifiedDate)) + '</td>'
					+ '</tr>';
			});
			$tbody.html(html);
		},*/
		
		
		success: function(data) {

			if (!data || data.length === 0) {
				$tbody.html('<tr><td colspan="8" class="text-center text-muted">No history available</td></tr>');
				return;
			}

			// server sends newest first, with the label already computed
			let cur = data[0];
			$("#phHistPhase").text(cur.typeName || "-");
		/*	$("#phHistStage").text(cur.label || "-");
			*/
			
			$("#phHistStage").text(historyLabelOf(cur) || "-");

			let html = "";
			$.each(data, function(i, h) {
		/*		html += '<tr>'
					+ '<td>' + (i + 1) + '</td>'
					+ '<td>' + escapePhaseHtml(h.mark) + '</td>'
					+ '<td>' + escapePhaseHtml(h.label) + '</td>'
					+ '<td>' + escapePhaseHtml(h.remarks) + '</td>'
					+ '<td>' + escapePhaseHtml(h.createdByName) + '</td>'
					+ '<td style="white-space:nowrap">' + escapePhaseHtml(formatHistoryDate(h.createdDate)) + '</td>'
					+ '<td>' + escapePhaseHtml(h.modifiedByName) + '</td>'
					+ '<td style="white-space:nowrap">' + escapePhaseHtml(formatHistoryDate(h.modifiedDate)) + '</td>'
					+ '</tr>';*/
					html += '<tr>'
						+ '<td>' + (i + 1) + '</td>'
						+ '<td>' + escapePhaseHtml(h.mark) + '</td>'
						+ '<td>' + escapePhaseHtml(historyLabelOf(h)) + '</td>'
						+ '<td>' + escapePhaseHtml(h.typeName || PHASE_ROLE_NAMES[h.typeId] || "") + '</td>'
						+ '<td>' + escapePhaseHtml(h.correctionType === "INTERNAL" ? "Internal"
						        : h.correctionType === "EXTERNAL" ? "External (ECN " + (h.ecnNo || "") + ")" : "") + '</td>'
						+ '<td>' + escapePhaseHtml(h.remarks) + '</td>'
						+ '<td>' + escapePhaseHtml(h.createdByName) + '</td>'
						+ '<td style="white-space:nowrap">' + escapePhaseHtml(formatHistoryDate(h.createdDate)) + '</td>'
						+ '<td>' + escapePhaseHtml(h.modifiedByName) + '</td>'
						+ '<td style="white-space:nowrap">' + escapePhaseHtml(formatHistoryDate(h.modifiedDate)) + '</td>'
						+ '</tr>';
			});
			
			
			
			$tbody.html(html);
		},

		error: function(xhr) {
			console.error("Fetch Phase History Error:", xhr.status, xhr.responseText);
			$tbody.html('<tr><td colspan="8" class="text-center text-danger">Failed to load history</td></tr>');
		}
	});
}


function formatHistoryDate(v) {
	if (!v) return "";
	let d = new Date(v);
	if (isNaN(d.getTime())) return "";

	function p(n) { return n < 10 ? "0" + n : n; }

	let h = d.getHours();
	let ampm = h >= 12 ? "pm" : "am";
	h = h % 12;
	if (h === 0) h = 12;            // 0 -> 12 am, 12 -> 12 pm

	return p(d.getDate()) + "-" + p(d.getMonth() + 1) + "-" + d.getFullYear() +
		   " " + h + ":" + p(d.getMinutes()) + " " + ampm;
}

// the history modal opens on top of the entry modal: keep it above and keep scrolling working
$("#phaseHistoryModal").on("show.bs.modal", function() {
	$(this).css("z-index", 1070);
	setTimeout(function() { $(".modal-backdrop").last().css("z-index", 1065); }, 0);
});
$("#phaseHistoryModal").on("hidden.bs.modal", function() {
	if ($(".modal.show").length) $("body").addClass("modal-open");
});


/* ---------- init ---------- */

$(function() {
	initPhaseTable();
	initContractSearch();
});


