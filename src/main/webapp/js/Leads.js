

const MainPage = window.location.pathname.split("/").pop() +'.jsp';


const UserId = sessionStorage.getItem('username');

let allowedActions = [];

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch actions");
        }

        allowedActions = await response.json();

    } catch (error) {
        console.error("Error:", error);
    }
}

(function () {
 
	function labelTable(table) {
		var heads = Array.prototype.map.call(
			table.querySelectorAll('thead th'),
			function (th) { return th.textContent.replace(/\s+/g, ' ').trim(); }
		);
 
		table.querySelectorAll('tbody tr').forEach(function (tr) {
			Array.prototype.forEach.call(tr.children, function (td, i) {
				if (td.tagName !== 'TD' || td.colSpan > 1) return;   // skip "No data" rows
				var label = heads[i] || '';
				if (td.getAttribute('data-label') !== label) {
					td.setAttribute('data-label', label);
				}
			});
		});
	}
 
	function watch(table) {
		if (!table) return;
		labelTable(table);
 
		// only childList is observed, so setting attributes can't re-trigger it
		new MutationObserver(function () {
			labelTable(table);
		}).observe(table, { childList: true, subtree: true });
	}
 
	function init() {
		watch(document.getElementById('LeadTableID'));
		watch(document.querySelector('#exampleModalActivity table'));
	}
 
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
// ==============================
// HELPERS
// ==============================
const ENQUIRY_STAGE_ID = 1;
function stageBadgeClass(stage) {
    switch (stage) {
        case "Win": return "badge-success";
        case "Lose": return "badge-danger";
        case "Hold": return "badge-warning";
        case "Lead": return "badge-info";
        default: return "badge-secondary";
    }
}

/*function fmtDate(d) {                       // 2026-10-10 -> 10-10-2026
    const p = String(d).substring(0, 10).split("-");
    return p.length === 3 ? p[2] + "-" + p[1] + "-" + p[0] : d;
}*/

function fmtDate(d) {
    if (!d) return "";

    // numeric timestamp (e.g. 1791590400000)
    if (typeof d === "number") {
        const dt = new Date(d);
        return String(dt.getDate()).padStart(2, "0") + "-" +
               String(dt.getMonth() + 1).padStart(2, "0") + "-" + dt.getFullYear();
    }

    // array form [2026, 10, 10]
    if (Array.isArray(d)) {
        return String(d[2]).padStart(2, "0") + "-" +
               String(d[1]).padStart(2, "0") + "-" + d[0];
    }

    // "2026-10-10" or "2026-10-10T00:00:00..."
    const p = String(d).substring(0, 10).split("-");
    return p.length === 3 ? p[2] + "-" + p[1] + "-" + p[0] : String(d);
}

// ==============================
// MESSAGE / CONFIRM MODAL
// ==============================
function showMessage(message, type, onClose) {
    const cfg = {
        error:   { icon: "fa-times-circle",         color: "text-danger",  title: "Error" },
        warning: { icon: "fa-exclamation-triangle", color: "text-warning", title: "Not Allowed" },
        success: { icon: "fa-check-circle",         color: "text-success", title: "Success" },
        info:    { icon: "fa-info-circle",          color: "text-info",    title: "Information" }
    }[type || "error"];

    $("#messageModalIcon").html('<i class="fas ' + cfg.icon + ' ' + cfg.color + '"></i>');
    $("#messageModalTitle").text(cfg.title);
    $("#messageModalText").text(message);          // .text() keeps it safe from HTML injection
    $("#messageModalCancel").hide();

    $("#messageModalOk").off("click").on("click", function () {
        $("#messageModal").one("hidden.bs.modal", function () {
            if (onClose) onClose();
        }).modal("hide");
    });

    $("#messageModal").modal("show");
}

function showConfirm(message, onYes) {
    $("#messageModalIcon").html('<i class="fas fa-question-circle text-primary"></i>');
    $("#messageModalTitle").text("Please Confirm");
    $("#messageModalText").text(message);
    $("#messageModalCancel").show();

    $("#messageModalCancel").off("click").on("click", function () {
        $("#messageModal").modal("hide");
    });

    $("#messageModalOk").off("click").on("click", function () {
        $("#messageModal").one("hidden.bs.modal", function () {
            if (onYes) onYes();
        }).modal("hide");
    });

    $("#messageModal").modal("show");
}

// When this modal closes on top of another modal, keep the lower one scrollable
$("#messageModal").on("hidden.bs.modal", function () {
    if ($(".modal.show").length) $("body").addClass("modal-open");
});

// Disables dates earlier than the last follow-up.
// editId = activity being edited (only earlier records count), or null for a new one
function applyFollowupMinDate(editId) {
    const dates = followupHistoryCache
        .filter(x => editId == null || Number(x.activityId) < Number(editId))
        .map(x => String(x.activityDate || "").substring(0, 10))
        .filter(Boolean)
        .sort();

    const min = dates.length ? dates[dates.length - 1] : "";

    if (min) $("#activityDate").attr("min", min);
    else $("#activityDate").removeAttr("min");

    $("#activityDate").data("minDate", min);
}



function currentMonthValue() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}

function showPopup(message, redirectUrl) {
    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
    setTimeout(function () {
        popup.fadeOut(400, function () {
            $(this).remove();
            window.location = redirectUrl;
        });
    }, 2000);
}

function setDefaultStage(selector, stageName) {
    const $select = $(selector);
    const $option = $select.find("option").filter(function () {
        return $(this).text().trim().toLowerCase() === stageName.toLowerCase();
    });

    if ($option.length) {
        $select.val($option.val());
    }
}

// ==============================
// INLINE VALIDATION HELPERS
// ==============================
function clearFieldErrors(modalSel) {
    $(modalSel).find(".enquiry-field.has-error").removeClass("has-error");
    $(modalSel).find(".field-error-msg").remove();
}

function showFieldError(selector, message) {
    const $field = $(selector).closest(".enquiry-field");
    $field.addClass("has-error");
    $field.find(".field-error-msg").remove();
    $field.append('<div class="field-error-msg">' + message + '</div>');
}

// Returns true if all fields are filled; otherwise marks the empty ones red
// and scrolls to the first one.
function validateRequired(modalSel, requiredFields) {
    clearFieldErrors(modalSel);
    let first = null;

    requiredFields.forEach(([selector, label]) => {
        const val = String($(selector).val() ?? "").trim();
        if (!val) {
            showFieldError(selector, label + " is required");
            if (!first) first = $(selector);
        }
    });

    if (first) {
        first[0].scrollIntoView({ behavior: "smooth", block: "center" });
        if (!first.prop("disabled")) first[0].focus({ preventScroll: true });
        return false;
    }
    return true;
}

// Clear the red state as soon as the user fixes the field
$(document).on("input change", ".enquiry-field.has-error .enquiry-input", function () {
    $(this).closest(".enquiry-field").removeClass("has-error").find(".field-error-msg").remove();
});

// Start clean every time a modal closes
$("#exampleModalScrollable, #exampleModalScrollableUp").on("hidden.bs.modal", function () {
    clearFieldErrors(this);
});

const today = new Date().toISOString().split("T")[0];

// ==============================
// CREATE — open modal (real, backend-driven)
// ==============================
document.getElementById("modalScroll1").addEventListener("click", async function () {
	
	const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	
	
    loadclients("#clientName");
    loadSegmentDropdown("#indtyp", "Select Industry Type");
    $("#site").val("");
    $("#Zone").val("");
    $("#projectName").html('<option value="">Select Client first</option>');
    loadSegmentDropdown("#segtype", "Select Segment");

    // Wait for stages to load, then default to "Lead"
    await loadCurrentStages("#currentStage");
    setDefaultStage("#currentStage", "Lead");
	loadDesignBasis("#designBasis");
	/*$("#tentClosureMon").val("");*/
	
	$("#tentClosureMon").val(currentMonthValue());
	$("#gnrlcon").val("");
    $('#exampleModalScrollable').modal('show');
});

// ==============================
// SAVE — CREATE Lead
// ==============================
function openModalAdd() {

    const clientId = $("#clientName").val();
    const projectName = $("#projectName").val(); // this is the Project ID (stored in varchar column)
    const generalConsultant = $("#gnrlcon").val();
    const investorDeveloperType = $("#invdevType").val();
    const investorDeveloper = $("#invdev").val().trim();
    const rfqDate = $("#rfqDate").val();
    const ndaDate = $("#ndaDate").val();
    const industryTypeId = $("#indtyp").val();
    const areaQty = $("#qty").val();
    const suggestedBidValue = $("#bidval").val();
    const segmentId = $("#segtype").val();
    const expectedAwardMonth = $("#expawdmon").val();
    const expectedProjectStartMonth = $("#exppromon").val();
    const bidType = $("#bidType").val();
    const currentStageId = $("#currentStage").val();
    const comments = $("#comments").val().trim();
	
	const tentativeClosureMonth = $("#tentClosureMon").val();   // "yyyy-MM"
	const designBasisId = $("#designBasis").val();

    // Logged in user
    const createdBy = createdById;



	
	
	const requiredFields = [
	    ["#clientName", "Client Name"],
	    ["#projectName", "Project Name"],
	    ["#gnrlcon", "General Consultant"],
	    ["#invdevType", "Type"],
	    ["#invdev", "Sale Person Name"],
	    ["#rfqDate", "RFQ Date"],
	    ["#ndaDate", "NDA Date"],
	    ["#indtyp", "Industry Type"],
	    ["#qty", "Area/qty(MT)"],
	    ["#bidval", "Suggested Bid Value"],
	    ["#segtype", "Segment"],
	    ["#expawdmon", "Expected Award Month"],
	    ["#designBasis", "Design Basis"],
	    ["#bidType", "Bid Type"],
	    ["#currentStage", "Current Stage"],
	    ["#comments", "Comments"]
	];

	if (!validateRequired("#exampleModalScrollable", requiredFields)) return;

    const data = {
        clientId: parseInt(clientId),
        projectName: projectName, // Project ID, stored as text in project_name column
        generalConsultant: generalConsultant === "1",
        investorDeveloperType: investorDeveloperType,
        investorDeveloper: investorDeveloper,
        rfqDate: rfqDate || null,
        ndaDate: ndaDate || null,
        industryTypeId: industryTypeId ? parseInt(industryTypeId) : null,
        areaQty: areaQty || null,
        suggestedBidValue: suggestedBidValue || null,
        segmentId: segmentId ? parseInt(segmentId) : null,
        expectedAwardMonth: expectedAwardMonth || null,
        expectedProjectStartMonth: expectedProjectStartMonth || null,
        bidType: bidType === "Yes",
        currentStageId: currentStageId ? parseInt(currentStageId) : null,
        comments: comments,
        createdBy: parseInt(createdBy),
		tentativeClosureMonth: tentativeClosureMonth || null,
		  designBasisId: designBasisId ? parseInt(designBasisId) : null
    };

    $.ajax({
        url: new URL("/api/lead/create", baseUrl1).toString(),
        type: "POST",
        contentType: "application/json",
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify(data),
        success: function (response) {
            $("#exampleModalScrollable").modal("hide");
            showPopup("Lead created successfully", "LeadEntry.jsp");
        },
     
	
			error: function (xhr) {
			    showMessage(xhr.responseText || "Unable to create lead.", "error");
			}
        
    });
}

// ==============================
// PAGE INIT
// ==============================
$(document).ready(async function () {
	
	await loadActions();
	
	const today = new Date().toISOString().split('T')[0];

	const currentMonth = today.slice(0, 7);
	$("#tentClosureMon").attr("min", currentMonth);
	$("#tentClosureMon1").attr("min", currentMonth);

    $("#rfqDate").attr("max", today);
    $("#ndaDate").attr("max", today);
    $("#expawdmon").attr("min", today);
    $("#exppromon").attr("min", today);
    $("#rfqDate1").attr("max", today);
    $("#ndaDate1").attr("max", today);
    $("#expawdmon1").attr("min", today);
    $("#exppromon1").attr("min", today);

    fetchLeads();

    // ---- Start Month can't be before Award Month ----

    $("#expawdmon").on("change", function () {
        const awardDate = $(this).val();
        if (awardDate) {
            $("#exppromon").attr("min", awardDate);

            const startDate = $("#exppromon").val();
            if (startDate && startDate < awardDate) {
                $("#exppromon").val("");
               /* alert("Expected Project Start Month cannot be earlier than Expected Award Month. Please reselect.");*/
				showFieldError("#exppromon", "Start Month cannot be earlier than Expected  Award Month. Please reselect.");
            }
        } else {
            $("#exppromon").attr("min", today);
        }
    });

    $("#expawdmon1").on("change", function () {
        const awardDate1 = $(this).val();
        if (awardDate1) {
            $("#exppromon1").attr("min", awardDate1);

            const startDate1 = $("#exppromon1").val();
            if (startDate1 && startDate1 < awardDate1) {
                $("#exppromon1").val("");
               /* alert("Expected Project Start Month cannot be earlier than Expected Award Month. Please reselect.");*/
				showFieldError("#exppromon1", "Start Month cannot be earlier than Award Month. Please reselect.");
            }
        } else {
            $("#exppromon1").attr("min", today);
        }
    });

    // ---- Extra safety net: validate again on form submit ----
    $("#leadForm").on("submit", function (e) { // <-- replace #leadForm with your actual form ID
        const awardDate = $("#expawdmon").val();
        const startDate = $("#exppromon").val();

        if (awardDate && startDate && startDate < awardDate) {
            e.preventDefault();
            //alert("Expected Project Start Month cannot be earlier than Expected Award Month.");
			showMessage("Expected Project Start Month cannot be earlier than Expected Award Month.", "warning");
            return false;
        }
    });

});

// ==============================
// FETCH LEADS TABLE
// ==============================
async function fetchLeads() {

    try {
        const [leadsResponse, enquiriesResponse] = await Promise.all([
            fetch(new URL('/api/lead/getleads', baseUrl1), { method: "GET", credentials: "include" }),
            fetch(new URL('/api/enquiry', baseUrl1), { method: "GET", credentials: "include" })
        ]);

        if (!leadsResponse.ok) {
            throw new Error("Failed to fetch Leads");
        }

        const leads = await leadsResponse.json();

        // Build a set of lead numbers that already have an Enquiry created against them.
        // If the enquiries call fails for any reason, fail open (nothing locked) rather
        // than silently locking every lead due to a transient network error.
        const enquiredLeadNos = new Set();

        if (enquiriesResponse.ok) {
            const enquiries = await enquiriesResponse.json();
            enquiries.forEach(e => {
                if (e.leadNo) enquiredLeadNos.add(e.leadNo);
            });
        } else {
            console.warn("Could not fetch Enquiries to determine lock state; leaving Leads unlocked.");
        }

        let rows = '';

        leads.forEach((item, index) => {

            const stageName = item.currentStageName || 'Lead Created';
            const hasEnquiry = enquiredLeadNos.has(item.leadNo);

  
					   
					   
					   
					   const ENQUIRY_STAGE_ID = 1;
					   //const editLocked = hasEnquiry || Number(item.currentStageId) === ENQUIRY_STAGE_ID;
					   const editLocked = Number(item.currentStageId) === ENQUIRY_STAGE_ID;

					   const editIcon = !editLocked
					       ? `<i class="fa fa-pen text-primary"
					              style="cursor:pointer;"
					              title="Edit"
					              onclick="openEditLead(${item.leadId})"></i>`
					       : `<i class="fa fa-pen text-muted"
					              style="cursor:not-allowed; opacity:0.4;"
					              title="Locked: Lead is at Enquiry stage"></i>`;
								  
								  
								 

            rows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.leadNo || ''}</td>
                    <td>${item.projectName || ''}</td>
                    <td>${item.clientName || ''}</td>
                    <td>
                        <span class="badge ${stageBadgeClass(stageName)}">
                            ${stageName}
                        </span>
                    </td>
                    <td>${editIcon}</td>
                    <td>
                        <i class="fa fa-list-alt text-success cursor-pointer" style="cursor:pointer;"
                           title="Follow-up" onclick="openSubquery(${item.leadId}, ${hasEnquiry})"></i>
                    </td>
                </tr>
            `;
        });

        document.getElementById("LeadTableBody").innerHTML = rows;

        // Destroy existing DataTable
        if ($.fn.DataTable.isDataTable('#LeadTableID')) {
            $('#LeadTableID').DataTable().destroy();
        }

        // Initialize DataTable
        $('#LeadTableID').DataTable({
            dom: '<"d-flex justify-content-between align-items-center"Bf>rt<"d-flex justify-content-between align-items-center"ip>',
            scrollX: false,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [
                [10, 25, 50, 100],
                [10, 25, 50, 100]
            ],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Lead List'
            }]
        });

    } catch (error) {
        console.error("Error fetching Leads:", error);
    }
}

// ==============================
// EDIT LEAD
// ==============================
let editingLeadId = 0;
let originalLeadData = {};

async function openEditLead(id) {
	
	const allowed =allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to Edit.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	

    try {

        const apiUrl = new URL(`/api/lead/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Lead");
        }

        const item = await response.json();

        editingLeadId = id;
		await loadDesignBasis("#designBasis1");
        // Load all dropdowns first
        await loadclients("#clientName1");

        // IMPORTANT: pass id explicitly here — do NOT rely on the
        // clientName1 'change' handler, since .val() below won't trigger it
        await loadProjectsForClient("#projectName1", item.clientId, id);

        await loadSegmentDropdown("#indtyp1", "Select Industry Type");
        await loadSegmentDropdown("#segtype1", "Select Segment");
        await loadCurrentStages("#currentStage1");
		
		
		

        // Bind values
        $("#leadNo1").val(item.leadNo);
        $("#clientName1").val(item.clientId);

        // project_name column holds the Project ID (as text) — direct value match
        $("#projectName1").val(item.projectName);

        $("#gnrlcon1").val(item.generalConsultant ? "1" : "0");
        $("#invdevType1").val(item.investorDeveloperType);
        $("#invdev1").val(item.investorDeveloper);

        $("#rfqDate1").val(item.rfqDate);
        $("#ndaDate1").val(item.ndaDate);

        $("#indtyp1").val(item.industryTypeId);
        $("#qty1").val(item.areaQty);
        $("#bidval1").val(item.suggestedBidValue);
        $("#segtype1").val(item.segmentId);

        $("#expawdmon1").val(item.expectedAwardMonth);
        $("#exppromon1").val(item.expectedProjectStartMonth);
		
		$("#tentClosureMon1").val(toMonthValue(item.tentativeClosureMonth));
		$("#designBasis1").val(item.designBasisId);

        if (item.expectedAwardMonth) {
            $("#exppromon1").attr("min", item.expectedAwardMonth);
        } else {
            $("#exppromon1").attr("min", today);
        }

        $("#bidType1").val(item.bidType ? "Yes" : "No");
        $("#currentStage1").val(item.currentStageId);

        $("#comments1").val(item.comments);

        // Store original values
        originalLeadData = {
            clientId: String(item.clientId || ""),
            projectName: String(item.projectName || ""),
            generalConsultant: item.generalConsultant,
            investorDeveloper: item.investorDeveloper || "",
            investorDeveloperType: item.investorDeveloperType || "",
            rfqDate: item.rfqDate || "",
            ndaDate: item.ndaDate || "",
            industryTypeId: String(item.industryTypeId || ""),
            areaQty: (item.areaQty || "").toString(),
            suggestedBidValue: (item.suggestedBidValue || "").toString(),
            segmentId: String(item.segmentId || ""),
            expectedAwardMonth: item.expectedAwardMonth || "",
            expectedProjectStartMonth: item.expectedProjectStartMonth || "",
            bidType: item.bidType,
            currentStageId: String(item.currentStageId || ""),
            comments: (item.comments || "").trim(),
			tentativeClosureMonth: toMonthValue(item.tentativeClosureMonth),
			designBasisId: String(item.designBasisId || "")
        };

        $("#exampleModalScrollableUp").modal("show");

    } catch (error) {
        console.error("Error fetching Lead:", error);
     /*   alert("Unable to fetch Lead");*/
		showMessage("Unable to fetch Lead", "error");
    }
}

// ==============================
// UPDATE LEAD
// ==============================
function updateLead() {

    const clientId = $("#clientName1").val();
    const projectName = $("#projectName1").val(); // Project ID
    const generalConsultant = $("#gnrlcon1").val();
    const investorDeveloper = $("#invdev1").val().trim();
    const rfqDate = $("#rfqDate1").val();
    const ndaDate = $("#ndaDate1").val();
    const industryTypeId = $("#indtyp1").val();
    const areaQty = $("#qty1").val();
    const suggestedBidValue = $("#bidval1").val();
    const segmentId = $("#segtype1").val();
    const expectedAwardMonth = $("#expawdmon1").val();
    const expectedProjectStartMonth = $("#exppromon1").val();
    const bidType = $("#bidType1").val();
    const comments = $("#comments1").val().trim();
	
	const tentativeClosureMonth = $("#tentClosureMon1").val();
	const designBasisId = $("#designBasis1").val();
    // ⬇️ currentStageId intentionally NOT read here anymore — stage is Follow-up-only


	
	const requiredFields = [
	    ["#clientName1", "Client Name"],
	    ["#projectName1", "Project Name"],
	    ["#gnrlcon1", "General Consultant"],
	    ["#invdevType1", "Type"],
	    ["#invdev1", "Sale Person Name"],
	    ["#rfqDate1", "RFQ Date"],
	    ["#ndaDate1", "NDA Date"],
	    ["#indtyp1", "Industry Type"],
	    ["#qty1", "Area/qty(MT)"],
	    ["#bidval1", "Suggested Bid Value"],
	    ["#segtype1", "Segment"],
	    ["#expawdmon1", "Expected Award Month"],
	    ["#designBasis1", "Design Basis"],
	    ["#bidType1", "Bid Type"],
	    ["#comments1", "Comments"]
	];

	if (!validateRequired("#exampleModalScrollableUp", requiredFields)) return;

    const noChange =
        String(clientId) === String(originalLeadData.clientId) &&
        String(projectName) === String(originalLeadData.projectName) &&
        (generalConsultant === "1") === originalLeadData.generalConsultant &&
        investorDeveloper === (originalLeadData.investorDeveloper || "") &&
        rfqDate === (originalLeadData.rfqDate || "") &&
        ndaDate === (originalLeadData.ndaDate || "") &&
        String(industryTypeId) === String(originalLeadData.industryTypeId) &&
        String(areaQty) === String(originalLeadData.areaQty) &&
        String(suggestedBidValue) === String(originalLeadData.suggestedBidValue) &&
        String(segmentId) === String(originalLeadData.segmentId) &&
        expectedAwardMonth === (originalLeadData.expectedAwardMonth || "") &&
        expectedProjectStartMonth === (originalLeadData.expectedProjectStartMonth || "") &&
        (bidType === "Yes") === originalLeadData.bidType &&
        comments === originalLeadData.comments 	&& tentativeClosureMonth === (originalLeadData.tentativeClosureMonth || "")
		&& String(designBasisId) === String(originalLeadData.designBasisId);
        // ⬇️ currentStageId removed from noChange comparison too

    if (noChange) {
        showPopup('No Feilds are changed', 'LeadEntry.jsp');
        return;
    }

    const data = {
        clientId: parseInt(clientId),
        projectName: projectName, // Project ID, stored as text
        generalConsultant: generalConsultant === "1",
        investorDeveloper: investorDeveloper,
        rfqDate: rfqDate || null,
        ndaDate: ndaDate || null,
        industryTypeId: industryTypeId ? parseInt(industryTypeId) : null,
        areaQty: areaQty || null,
        suggestedBidValue: suggestedBidValue || null,
        segmentId: segmentId ? parseInt(segmentId) : null,
        expectedAwardMonth: expectedAwardMonth || null,
        expectedProjectStartMonth: expectedProjectStartMonth || null,
        bidType: bidType === "Yes",
        comments: comments,
        modifiedBy: parseInt(createdById),
		tentativeClosureMonth: tentativeClosureMonth || null,
		designBasisId: designBasisId ? parseInt(designBasisId) : null
        // ⬇️ currentStageId removed from payload — backend keeps existing value
    };

    $.ajax({
        url: baseUrl1 + "/api/lead/" + editingLeadId,
        type: "PUT",
        contentType: "application/json",
        xhrFields: { withCredentials: true },
        data: JSON.stringify(data),

        success: function (response) {
            $("#exampleModalScrollableUp").modal("hide");
            showPopup("Lead updated successfully", "LeadEntry.jsp");
        },

       /* error: function (xhr) {
            alert(xhr.responseText || "Unable to update Lead.");
        }*/
		
		error: function (xhr) {
		    showMessage(xhr.responseText || "Unable to update Lead.", "error");
		}
    });
}

// ==============================
// CLIENT DROPDOWNS
// ==============================
async function loadclients(selector) {

    try {
        const userId = sessionStorage.getItem("id")?.trim();

        if (!userId) {
            console.error("No user id found in sessionStorage");
            return;
        }

        const apiUrl = new URL('/api/salescrm/mapped/client', baseUrl1);
        apiUrl.searchParams.set("userId", userId);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Clients");
        }

        const result = await response.json();

        let options = '<option value="">Select Client</option>';

        result.forEach(client => {
            options += `
                <option value="${client.id}"
                        data-site="${client.address}"
                        data-zone="${client.zone_name}">
                    ${client.clientName}
                </option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error("Error fetching Clients:", error);
    }
}

$("#clientName").on("change", function () {

    const selected = $(this).find(":selected");
    const clientId = $(this).val();

    $("#site").val(selected.data("site"));
    $("#Zone").val(selected.data("zone"));

    loadProjectsForClient("#projectName", clientId);
});

$("#clientName1").on("change", function () {
    const clientId = $(this).val();
    loadProjectsForClient("#projectName1", clientId, editingLeadId || null);
});

// ==============================
// PROJECTS AVAILABLE FOR A GIVEN CLIENT (already-used ones excluded)
// ==============================
async function loadProjectsForClient(selector, clientId, excludeLeadId) {

    if (!clientId) {
        $(selector).html('<option value="">Select Client first</option>');
        return;
    }

    try {
        const apiUrl = new URL('/api/salescrm/project/available', baseUrl1);
        apiUrl.searchParams.set("clientId", String(clientId));

        if (excludeLeadId !== null && excludeLeadId !== undefined && excludeLeadId !== "") {
            apiUrl.searchParams.set("excludeLeadId", String(excludeLeadId));
        }

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Projects");
        }

        const projects = await response.json();

        let options;

        if (projects.length === 0) {
            options = '<option value="">No projects available for this Client</option>';
        } else {
            options = '<option value="">Select Project</option>';
            projects.forEach(p => {
                options += `<option value="${p.id}">${p.projectName}</option>`;
            });
        }

        $(selector).html(options);

    } catch (error) {
        console.error('Error fetching Projects:', error);
        $(selector).html('<option value="">Select Client first</option>');
    }
}

// ==============================
// OTHER DROPDOWNS
// ==============================
async function loadSegmentDropdown(selector, defaultText = "Select") {

    try {
        const apiUrl = new URL('/api/salescrm/segment', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Segments");
        }

        const result = await response.json();

        let options = `<option value="">${defaultText}</option>`;

        result.forEach(item => {
            options += `<option value="${item.id}">${item.segmentName}</option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error("Error fetching Segments:", error);
    }
}

async function loadCurrentStages(selector) {

    try {
       // const apiUrl = new URL('/api/salescrm/current-stage', baseUrl1);
		const apiUrl = new URL('/api/salescrm/leadfollowup/current-stage', baseUrl1);
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Current Stages");
        }

        const result = await response.json();

        let options = '<option value="">Select Current Stage</option>';

        result.forEach(stage => {
            options += `<option value="${stage.id}">${stage.stageName}</option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error("Error fetching Current Stages:", error);
    }
}

// ==============================
// FOLLOW-UP / SUBQUERY
// ==============================


let currentSubqueryLeadId = 0;

let currentSubqueryLocked = false;
let editingActivityId = null;
let followupHistoryCache = [];

async function openSubquery(leadId, hasEnquiry) {
	
	const allowed =allowedActions || [];

	if (!allowed.includes("FollowUp")) {
	  alert(" You do not have permission to FollowUp.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	
	
    const today = new Date().toISOString().split("T")[0];

    $("#activityDate").attr("max", today);
    $("#nextFollowUpDate").attr("min", today);
    currentSubqueryLeadId = leadId;

    try {
        const apiUrl = new URL(`/api/lead/${leadId}`, baseUrl1);
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });

        if (!response.ok) throw new Error("Unable to fetch Lead");

        const item = await response.json();

        $("#sqEnqNo").text(item.leadNo || "");
        $("#sqClientName").text(item.clientName || "");
		$("#sqProjectName").text(item.projectDesc || "");
        $("#sqCurrentStage").text(item.currentStageName || "");

        // ⬇️ Lock: hide Save button + disable Stage dropdown once an Enquiry
        // has already been created against this lead — NOT based on stage text.
      /*  const isLocked = !!hasEnquiry;
        $("#saveActivityBtn").toggle(!isLocked);
		resetFollowupForm();*/
		
		
		// Locked = stage is NOT "Lead" (e.g. Enquired, Win, Lose, Hold), or an enquiry already exists
		//const isLocked = !isLeadStage(item.currentStageName) || !!hasEnquiry;
		
		const isLocked = Number(item.currentStageId) === ENQUIRY_STAGE_ID;
		currentSubqueryLocked = isLocked;      // so loadFollowupHistory hides the edit/delete icons

		resetFollowupForm();                   // reset first, because it resets the button text
	//	$("#saveActivityBtn").toggle(!isLocked);
		
		
		

        $("#activitySource").val("");
        $("#activityDate").val("");
        $("#activityAttendedBy").val(sessionStorage.getItem("username") || "");

        await loadCurrentStages("#activityStage");
        $("#activityStage").val(item.currentStageId || "");
     //   $("#activityStage").prop("disabled", isLocked);

        await loadOpportunitySources("#activitySource");
        $("#activitySource").val("");

        $("#nextFollowUpDate").val("");
        $("#activityRemarks").val("");

        await loadContactPersons("#activityContactPerson", item.clientId);
        $("#activityContactPerson").val("");

       // loadFollowupHistory(leadId);
		
		await loadFollowupHistory(leadId);
		setFollowupFormLocked(isLocked);
        $("#exampleModalActivity").modal("show");

    } catch (e) {
        console.error(e);
        //alert("Unable to load Lead.");
		
		showMessage("Unable to load Lead.", "error");
    }
}




/*async function loadFollowupHistory(leadId) {
    try {
        const apiUrl = new URL(`/api/lead/${leadId}/followups`, baseUrl1);
        const response = await fetch(apiUrl, { credentials: "include" });

        if (!response.ok) {
            followupHistoryCache = [];
			applyFollowupMinDate(null);    
            $("#activityHistoryBody").html('<tr><td colspan="8" class="text-center">No follow-up available</td></tr>');
            return;
        }

        const history = await response.json();
        followupHistoryCache = history;

        let rows = "";

        if (history.length === 0) {
            rows = '<tr><td colspan="8" class="text-center">No follow-up available</td></tr>';
        } else {
            history.forEach(item => {
                const actions = currentSubqueryLocked
                    ? '<span class="text-muted">-</span>'
                    : `<i class="fa fa-pen text-primary mr-2" style="cursor:pointer;" title="Edit"
                          onclick="editFollowup(${item.activityId})"></i>
                       <i class="fa fa-trash text-danger" style="cursor:pointer;" title="Delete"
                          onclick="deleteFollowup(${item.activityId})"></i>`;

                rows += `
                    <tr>
                        <td>${item.activityDate || ""}</td>
                        <td>${item.sourceName || ""}</td>
                        <td>${item.createdBy || ""}</td>
                        <td>${item.stageName || ""}</td>
                        <td>${item.contactPersonName || ""}</td>
                        <td>${item.nextFollowUpDate || ""}</td>
                        <td>${item.comments || ""}</td>
                        <td>${actions}</td>
                    </tr>`;
            });
        }

        $("#activityHistoryBody").html(rows);

    } catch (e) {
        console.error(e);
    }
}*/

async function loadFollowupHistory(leadId) {
    try {
        const apiUrl = new URL(`/api/lead/${leadId}/followups`, baseUrl1);
        const response = await fetch(apiUrl, { credentials: "include" });

        if (!response.ok) {
            followupHistoryCache = [];
            applyFollowupMinDate(null);                // NEW
            $("#activityHistoryBody").html('<tr><td colspan="8" class="text-center">No follow-up available</td></tr>');
            return;
        }

        const history = await response.json();
        followupHistoryCache = history;
        applyFollowupMinDate(editingActivityId);       // NEW

        let rows = "";

        if (history.length === 0) {
            rows = '<tr><td colspan="8" class="text-center">No follow-up available</td></tr>';
        } else {
            history.forEach(item => {
                const actions = currentSubqueryLocked
                    ? '<span class="text-muted">-</span>'
                    : `<i class="fa fa-pen text-primary mr-2" style="cursor:pointer;" title="Edit"
                          onclick="editFollowup(${item.activityId})"></i>
                       <i class="fa fa-trash text-danger" style="cursor:pointer;" title="Delete"
                          onclick="deleteFollowup(${item.activityId})"></i>`;

                rows += `
                    <tr>
                        
						<td class="text-nowrap">${fmtDate(item.activityDate)}</td>
                        <td>${item.sourceName || ""}</td>
                        <td>${item.createdBy || ""}</td>
                        <td>${item.stageName || ""}</td>
                        <td>${item.contactPersonName || ""}</td>
                      
						<td class="text-nowrap">${fmtDate(item.nextFollowUpDate)}</td>
                        <td>${item.comments || ""}</td>
                        <td>${actions}</td>
                    </tr>`;
            });
        }

        $("#activityHistoryBody").html(rows);

    } catch (e) {
        console.error(e);
    }
}
followupHistoryCache = [];

function resetFollowupForm() {
	
	clearFieldErrors("#exampleModalActivity");
    editingActivityId = null;
    $("#activitySource").val("");
    $("#activityDate").val("");
    $("#activityContactPerson").val("");
    $("#nextFollowUpDate").val("");
    $("#activityRemarks").val("");
    $("#saveActivityBtn").text("Save Follow-up");
    $("#cancelEditBtn").hide();
	
	applyFollowupMinDate(null);
}

function setFollowupFormLocked(isLocked) {
    const fields = "#activitySource, #activityDate, #activityStage, " +
                   "#activityContactPerson, #nextFollowUpDate, #activityRemarks";

    $(fields).prop("disabled", isLocked)
             .toggleClass("enquiry-readonly", isLocked);   // grey look, same as your other readonly fields

    $("#saveActivityBtn").toggle(!isLocked);
    if (isLocked) $("#cancelEditBtn").hide();
}

function editFollowup(activityId) {
    const f = followupHistoryCache.find(x => String(x.activityId) === String(activityId));
    if (!f) return;

    editingActivityId = f.activityId;
	
	applyFollowupMinDate(f.activityId);

    $("#activitySource").val(f.sourceId || "");
  //  $("#activityDate").val(f.activityDate || "");
	
	$("#activityDate").val(String(f.activityDate || "").substring(0, 10));
	$("#nextFollowUpDate").val(String(f.nextFollowUpDate || "").substring(0, 10));
    $("#activityStage").val(f.stageId || "");
    $("#activityContactPerson").val(f.contactPersonId || "");
  //  $("#nextFollowUpDate").val(f.nextFollowUpDate || "");
    $("#activityRemarks").val(f.comments || "");

    $("#saveActivityBtn").text("Update Follow-up");
    $("#cancelEditBtn").show();
	
	
}

$("#cancelEditBtn").on("click", resetFollowupForm);

/*function deleteFollowup(activityId) {
    if (!confirm("Are you sure you want to delete this follow-up?")) return;

    $.ajax({
        url: baseUrl1 + "/api/lead/followup/" + activityId,
		url: baseUrl1 + "/api/lead/followup/" + activityId + "?userId=" + createdById,
        type: "DELETE",
        xhrFields: { withCredentials: true },
        success: function () {
            showPopup("Follow-up deleted successfully", "LeadEntry.jsp");
        },
        error: function (xhr) {
            alert(xhr.responseText || "Unable to delete follow-up.");
        }
    });
}*/

function deleteFollowup(activityId) {
    showConfirm("Are you sure you want to delete this follow-up?", function () {
        $.ajax({
            url: baseUrl1 + "/api/lead/followup/" + activityId + "?userId=" + createdById,
            type: "DELETE",
            xhrFields: { withCredentials: true },
            success: function () {
                showPopup("Follow-up deleted successfully", "LeadEntry.jsp");
            },
            error: function (xhr) {
                showMessage(xhr.responseText || "Unable to delete follow-up.", "warning");
            }
        });
    });
}

$("#exampleModalScrollable, #exampleModalScrollableUp, #exampleModalActivity").on("hidden.bs.modal", function () {
    clearFieldErrors(this);
});

$("#saveActivityBtn").on("click", function () {

    const source = $("#activitySource").val();
    const activityDate = $("#activityDate").val();
    // const attendedBy = createdById;
    const stage = $("#activityStage").val();
    const contactPerson = $("#activityContactPerson").val();
    const nextFollowUpDate = $("#nextFollowUpDate").val();
    const comments = $("#activityRemarks").val().trim();

/*    if (!activityDate) {
        alert("Please select Activity Date.");
        return;
    }

    if (!stage) {
        alert("Please select Stage.");
        return;
    }*/
	
	const requiredFields = [
	    ["#activitySource", "Source"],
	    ["#activityDate", "Date"],
	    ["#activityStage", "Stage"],
	    ["#activityContactPerson", "Contact Person"],
	    ["#nextFollowUpDate", "Next Follow-up Date"],
	    ["#activityRemarks", "Comments"]
	];

	if (!validateRequired("#exampleModalActivity", requiredFields)) return;
	
	const minDate = $("#activityDate").data("minDate");
	if (minDate && activityDate < minDate) {
	    showFieldError("#activityDate",
	        "Date cannot be earlier than the last follow-up (" + fmtDate(minDate) + ")");
	    document.getElementById("activityDate").scrollIntoView({ behavior: "smooth", block: "center" });
	    return;
	}

/*    const data = {
        enquiryId: currentSubqueryLeadId,
        sourceId: parseInt(source),
        activityDate: activityDate,
        stageId: parseInt(stage),
        contactPersonId: parseInt(contactPerson),
        nextFollowUpDate: nextFollowUpDate || null,
        comments: comments,
        createdBy: createdById
    };*/
	
	
	const data = {
	    enquiryId: currentSubqueryLeadId,
	    sourceId: parseInt(source),
	    activityDate: activityDate,
	    stageId: parseInt(stage),
	    contactPersonId: parseInt(contactPerson),
	    nextFollowUpDate: nextFollowUpDate || null,
	    comments: comments,
	    createdBy: createdById,
	    modifiedBy: createdById        // NEW
	};

 /*   $.ajax({
        url: new URL("/api/lead/followup", baseUrl1).toString(),
        type: "POST",
        contentType: "application/json",
        xhrFields: { withCredentials: true },
        data: JSON.stringify(data),

        success: function () {
            showPopup("Follow-up saved successfully", "LeadEntry.jsp");
        },

        error: function (xhr) {
            alert(xhr.responseText || "Unable to save follow-up.");
        }
    });*/
	
	const isEdit = editingActivityId !== null;

	$.ajax({
	    url: isEdit
	        ? baseUrl1 + "/api/lead/followup/" + editingActivityId
	        : new URL("/api/lead/followup", baseUrl1).toString(),
	    type: isEdit ? "PUT" : "POST",
	    contentType: "application/json",
	    xhrFields: { withCredentials: true },
	    data: JSON.stringify(data),

	    success: function () {
	        showPopup(isEdit ? "Follow-up updated successfully" : "Follow-up saved successfully", "LeadEntry.jsp");
	    },

	   /* error: function (xhr) {
	        alert(xhr.responseText || "Unable to save follow-up.");
	    }*/
		
		error: function (xhr) {
		    showMessage(xhr.responseText || "Unable to save follow-up.", "warning");
		}
	});

});

async function loadContactPersons(selector, clientId) {

    if (!clientId) {
        $(selector).html('<option value="">Select Contact Person</option>');
        return;
    }

    try {
        const apiUrl = new URL(`/api/salescrm/contact-person/by-client/${clientId}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Contact Persons");
        }

        const result = await response.json();

        let options = '<option value="">Select Contact Person</option>';

        result.forEach(cp => {
            options += `<option value="${cp.id}">${cp.contactName}</option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error("Error fetching Contact Persons:", error);
        $(selector).html('<option value="">Select Contact Person</option>');
    }
}

async function loadOpportunitySources(selector) {
    try {
        const apiUrl = new URL('/api/salescrm/opportunity-source', baseUrl1);
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });

        if (!response.ok) throw new Error("Failed to fetch Opportunity Sources");

        const result = await response.json();
        let options = '<option value="">Select Source</option>';

        result.forEach(src => {
            options += `<option value="${src.id}">${src.opportunityName}</option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error("Error fetching Opportunity Sources:", error);
    }
}







function isLeadStage(stageName) {
    return String(stageName || "").trim().toLowerCase() === "lead";
}


async function loadDesignBasis(selector) {
    try {
        const apiUrl = new URL('api/salescrm/design-basis', baseUrl1);
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch Design Basis");

        const result = await response.json();
        let options = '<option value="">Select Design Basis</option>';
        result.forEach(d => {
            options += `<option value="${d.id}">${d.designBasisName}</option>`;
        });
        $(selector).html(options);
    } catch (error) {
        console.error("Error fetching Design Basis:", error);
    }
}

// Normalise "2026-10-15" or "2026-10" -> "2026-10" (what <input type="month"> needs)
function toMonthValue(v) {
    return v ? String(v).substring(0, 7) : "";
}