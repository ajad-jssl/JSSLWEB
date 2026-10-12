// ==============================
// HARDCODED SAMPLE DATA (prototype only — no backend)
// ==============================

let enquiryList = [
    {
        id: 2,
        enqNo: "ENQ-1002",
        clientName: "Kirloskar",
        projectName: "",
		kam: "KAM 1",
		currentStage: "Lead",
		rfqDate: "2026-07-10",
		ndaDate: "2026-07-12",
		firstBidDate: "2026-07-18",
		lastBidDate: "2026-07-25",
		bidType: "Yes",
		competitors: "L&T",
		gcTakingBid: "Yes",
		technicalDiscussionDate: "2026-07-28",
		commercialDiscussionDate: "2026-08-02",
		probability: "High",
		contractAwardee: "",
		status:'HOLD',
		winDropLossDate: "",
		reasonForLoss: "",
		orderLostValue: ""
    }
];

let enquiryActivities = {
    1: [
        { date: "2026-07-10", source: "Self", attendedBy: "Ajad", stage: "Lead", contactPerson: "Ramesh Iyer", nextFollowUp: "2026-07-20", comments: "First site visit completed" }
    ],
    2: []
};

let nextEnquiryId = 3;
let editingEnquiryId = null;
let currentSubqueryEnquiryId = null;

// ==============================
// RENDER MAIN TABLE
// ==============================
/*function renderEnquiryTable() {

    let rows = '';

    enquiryList.forEach((item, index) => {
        rows += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.enqNo}</td>
                <td>${item.projectName}</td>
                <td>${item.clientName}</td>
                <td><span class="badge ${stageBadgeClass(item.currentStage)}">${item.currentStage}</span></td>
                <td>
                    <i class="fa fa-pen text-primary cursor-pointer" style="cursor:pointer;"
                       title="Edit" onclick="openEditEnquiry(${item.id})"></i>
                </td>
                <td>
                    <i class="fa fa-list-alt text-success cursor-pointer" style="cursor:pointer;"
                       title="Follow-up" onclick="openSubquery(${item.id})"></i>
                </td>
            </tr>
        `;
    });

    document.getElementById("enquiryTableBody").innerHTML = rows;
}*/

function stageBadgeClass(stage) {
    switch (stage) {
        case "Win": return "badge-success";
        case "Lose": return "badge-danger";
        case "Hold": return "badge-warning";
        case "Lead": return "badge-info";
        default: return "badge-secondary";
    }
}

// ==============================
// CREATE — open modal (hardcoded name = "Ajad")
// ==============================
document.getElementById("modalScroll1").addEventListener("click", function () {
    editingEnquiryId = null;

    clearEnquiryForm();

    $('#exampleModalScrollableTitle123').text('Lead Entry');
    $('#name').val('Ajad'); // hardcoded name on create
    $('#enqNo').val('ENQ-1002');
	$("#clientName").val("Kirloskar");
	$("#projectName").val("");
    $('.enquiry-modal-content .enquiry-btn-primary').text('Create Lead');

    $('#exampleModalScrollable').modal('show');
});

function clearEnquiryForm() {
    $('#clientName, #projectName, #location, #zone, #enquirySource, #segment, #designBasis').val('');
    $('#enquiryDate, #qty, #expectedBidValue, #awardMonth, #comments').val('');
}

// ==============================
// EDIT — reuse same modal, prefill values
// ==============================
function openEditEnquiry(id) {

    const item = enquiryList.find(e => e.id === id);
    if (!item) return;

    editingEnquiryId = id;

    $('#exampleModalScrollableTitle123').text('Update Lead');
    $('.enquiry-modal-content .enquiry-btn-primary').text('Update Lead');

    $('#enqNo').val(item.enqNo);
    $('#clientName').val(item.clientName);
    $('#projectName').val(item.projectName);
	$('#kam').val(item.kam);
	$('#currentStage').val(item.currentStage);
	$('#rfqDate').val(item.rfqDate);
	$('#ndaDate').val(item.ndaDate);
	$('#firstBidDate').val(item.firstBidDate);
	$('#lastBidDate').val(item.lastBidDate);
	$('#bidType').val(item.bidType);
	$('#competitors').val(item.competitors);
	$('#gcTakingBid').val(item.gcTakingBid);
	$('#technicalDiscussionDate').val(item.technicalDiscussionDate);
	$('#commercialDiscussionDate').val(item.commercialDiscussionDate);
	$('#probability').val(item.probability);
	$('#contractAwardee').val(item.contractAwardee);
	$('#status').val(item.status)
	$('#winDropLossDate').val(item.winDropLossDate);
	$('#reasonForLoss').val(item.reasonForLoss);
	$('#orderLostValue').val(item.orderLostValue);
	$('#name').val('Ajad');
    $('#comments').val(item.comments);

    $('#exampleModalScrollable').modal('show');
}

// ==============================
// SAVE (CREATE or UPDATE) — triggered by the modal's Create/Update button
// ==============================
function openModalAdd() {

    const clientName = $('#clientName').val();
    const projectName = $('#projectName').val();
    const location = $('#location').val();
    const zone = $('#zone').val();
    const enquiryDate = $('#enquiryDate').val();
    const enquirySource = $('#enquirySource').val();
    const segment = $('#segment').val();
    const designBasis = $('#designBasis').val();
    const qty = $('#qty').val();
    const expectedBidValue = $('#expectedBidValue').val();
    const awardMonth = $('#awardMonth').val();
    const comments = $('#comments').val();

    if (!clientName || !projectName) {
        alert("Client Name and Project Name are required");
        return;
    }

    if (editingEnquiryId) {
        // ---- UPDATE existing ----
        const item = enquiryList.find(e => e.id === editingEnquiryId);
        item.clientName = clientName;
        item.projectName = projectName;
        item.location = location;
        item.zone = zone;
        item.enquiryDate = enquiryDate;
        item.enquirySource = enquirySource;
        item.segment = segment;
        item.designBasis = designBasis;
        item.qty = qty;
        item.expectedBidValue = expectedBidValue;
        item.awardMonth = awardMonth;
        item.comments = comments;

    } else {
        // ---- CREATE new ----
        const newId = nextEnquiryId++;
        const newEnqNo = "ENQ-" + (1000 + newId);

        enquiryList.push({
            id: newId,
            enqNo: newEnqNo,
            clientName, projectName, location, zone,
            enquiryDate, enquirySource, segment, designBasis,
            qty, expectedBidValue, awardMonth,
            name: "Ajad",
            comments,
            stage: "Lead"
        });

        enquiryActivities[newId] = [];
    }

    renderEnquiryTable();
    $('#exampleModalScrollable').modal('hide');
}

// ==============================
// SUBQUERY / FOLLOW-UP — open modal for a specific enquiry
// ==============================
/*function openSubquery(enquiryId) {

    currentSubqueryEnquiryId = enquiryId;

    const item = enquiryList.find(e => e.id === enquiryId);
    if (!item) return;

    // Summary section (read-only, from create)
    $('#sqEnqNo').text(item.enqNo);
    $('#sqProjectName').text(item.projectName);
    $('#sqClientName').text(item.clientName);
    $('#sqCurrentStage').text(item.currentStage);

    // Clear the follow-up form
    $('#activitySource').val('');
    $('#activityDate').val('');
    $('#activityAttendedBy').val('Aftab'); // hardcoded attended-by name
    $('#activityStage').val(item.currentStage);
    $('#activityContactPerson').val('');
    $('#nextFollowUpDate').val('');
    $('#activityRemarks').val('');

    renderActivityHistory(enquiryId);

    $('#exampleModalActivity').modal('show');
}

// ==============================
// RENDER FOLLOW-UP HISTORY TABLE (inside subquery modal)
// ==============================
function renderActivityHistory(enquiryId) {

    const activities = enquiryActivities[enquiryId] || [];

    let rows = '';

    if (activities.length === 0) {
        rows = `<tr><td colspan="7" class="text-center text-muted">No follow-ups recorded yet</td></tr>`;
    } else {
        activities.forEach(a => {
            rows += `
                <tr>
                    <td>${a.date}</td>
                    <td>${a.source}</td>
                    <td>${a.attendedBy}</td>
                    <td><span class="badge ${stageBadgeClass(a.stage)}">${a.stage}</span></td>
                    <td>${a.contactPerson}</td>
                    <td>${a.nextFollowUp || '-'}</td>
                    <td>${a.comments || '-'}</td>
                </tr>
            `;
        });
    }

    document.getElementById("activityHistoryBody").innerHTML = rows;
}

// ==============================
// SAVE FOLLOW-UP — pushes a new activity row + updates enquiry's current stage
// ==============================
document.getElementById("saveActivityBtn").addEventListener("click", function () {

    const source = $('#activitySource').val();
    const date = $('#activityDate').val();
    const attendedBy = $('#activityAttendedBy').val();
    const stage = $('#activityStage').val();
    const contactPerson = $('#activityContactPerson').val();
    const nextFollowUp = $('#nextFollowUpDate').val();
    const comments = $('#activityRemarks').val().trim();

    if (!date || !stage) {
        alert("Date and Stage are required");
        return;
    }

    if (!enquiryActivities[currentSubqueryEnquiryId]) {
        enquiryActivities[currentSubqueryEnquiryId] = [];
    }

    enquiryActivities[currentSubqueryEnquiryId].push({
        date, source, attendedBy, stage, contactPerson, nextFollowUp, comments
    });

    // Update the enquiry's current stage to match the latest follow-up
    const enquiry = enquiryList.find(e => e.id === currentSubqueryEnquiryId);
    if (enquiry) {
        enquiry.stage = stage;
    }

    renderActivityHistory(currentSubqueryEnquiryId);
    renderEnquiryTable();

    // Reset the form fields for the next entry, keep modal open to show updated history
    $('#activitySource').val('');
    $('#activityDate').val('');
    $('#activityContactPerson').val('');
    $('#nextFollowUpDate').val('');
    $('#activityRemarks').val('');
    $('#sqCurrentStage').text(currentStage);
});

// ==============================
// INITIAL RENDER ON PAGE LOAD
// ==============================
$(document).ready(function () {
    renderEnquiryTable();
});*/

function showPopup(message, redirectUrl) {
	var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
	setTimeout(function() {
		popup.fadeOut(400, function() {
			$(this).remove();
			window.location = redirectUrl;
		});
	}, 2000);
}


$(document).ready(function () {

    const today = new Date().toISOString().split("T")[0];

    $("#rfqDate").attr("max", today);
    $("#ndaDate").attr("max", today);
    $("#expawdmon").attr("max", today);
	$("#exppromon").attr("max", today);
	$("#rfqDate1").attr("max", today);
	$("#ndaDate1").attr("max", today);
	$("#expawdmon1").attr("max", today);
	$("#exppromon1").attr("max", today);
	fetchLeads();

});

async function fetchLeads() {

    try {
        const apiUrl = new URL('/api/lead/getleads', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Leads");
        }

        const leads = await response.json();

        let rows = '';

        leads.forEach((item, index) => {

            const stageName = item.currentStageName || 'Lead Created';

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
                    <td>
                        <i class="fa fa-pen text-primary"
                           style="cursor:pointer;"
                           title="Edit"
                           onclick="openEditLead(${item.leadId})"></i>
                    </td>
					<td>
					                     <i class="fa fa-list-alt text-success cursor-pointer" style="cursor:pointer;"
					                        title="Follow-up" onclick="openSubquery(${item.leadId})"></i>
					                 </td>
                </tr>
            `;
        });

        document.getElementById("LeadTableBody").innerHTML = rows;

    } catch (error) {
        console.error("Error fetching Leads:", error);
    }
}

let editingLeadId = 0;
let originalLeadData = {};

async function openEditLead(id) {

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

        // Load all dropdowns first
        await loadclients("#clientName1");
        await loadSegmentDropdown("#indtyp1", "Select Industry Type");
        await loadSegmentDropdown("#segtype1", "Select Segment");
        await loadCurrentStages("#currentStage1");

        // Bind values
		$("#leadNo1").val(item.leadNo);
        $("#clientName1").val(item.clientId);
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

        $("#bidType1").val(item.bidType ? "Yes" : "No");
        $("#currentStage1").val(item.currentStageId);

        $("#comments1").val(item.comments);

        // Store original values
        originalLeadData = {

            clientId: String(item.clientId || ""),
            projectName: item.projectName || "",
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

            comments: (item.comments || "").trim()
        };

        $("#exampleModalScrollableUp").modal("show");

    } catch (error) {
        console.error("Error fetching Lead:", error);
        alert("Unable to fetch Lead");
    }
}
function openModalAdd() {

    const clientId = $("#clientName").val();
    const projectName = $("#projectName").val().trim();
    const generalConsultant = $("#gnrlcon").val();
	const investorDeveloperType =$("#invdevType").val();
    const investorDeveloper = $("#invdev").val().trim();
    const rfqDate = $("#rfqDate").val();
    const ndaDate = $("#ndaDate").val();
    const industryTypeId = $("#indtyp").val();
    const areaQty = $("#qty").val();
    const suggestedBidValue = $("#bidval").val();
    const segmentId = $("#segtype").val();      // Change id if different
    const expectedAwardMonth = $("#expawdmon").val();
    const expectedProjectStartMonth = $("#exppromon").val();
    const bidType = $("#bidType").val();
    const currentStageId = $("#currentStage").val();
    const comments = $("#comments").val().trim();

    // Logged in user
    const createdBy = createdById

    // Validation
    if (!clientId) {
        alert("Please select Client.");
        $("#clientName").focus();
        return;
    }


    if (!comments) {
        alert("Comments are mandatory.");
        $("#comments").focus();
        return;
    }

    const data = {
        clientId: parseInt(clientId),
        projectName: projectName,
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
        createdBy: parseInt(createdBy)
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
	        console.log(xhr);

	        if (xhr.responseText) {
	            alert(xhr.responseText);
	        } else {
	            alert("Unable to create lead.");
	        }
	    }
	});

}
	document.getElementById("modalScroll1").addEventListener("click", function () {
	    loadclients("#clientName");
		loadSegmentDropdown("#indtyp", "Select Industry Type");
		$("#site").val("");
		$("#Zone").val("");
		// Segment
		loadSegmentDropdown("#segtype", "Select Segment");
		loadCurrentStages("#currentStage");
	});

	async function loadclients(selector) {

	    try {
	        const apiUrl = new URL('/api/salescrm/client', baseUrl1);

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
	                        data-project="${client.clientName}"
	                        data-site="${client.address}"
	                        data-zone="${client.zone_name}">
	                    ${client.clientName} - ${client.address}
	                </option>`;
	        });

	        $(selector).html(options);

	    } catch (error) {
	        console.error("Error fetching Clients:", error);
	    }
	}
	
	$("#clientName").on("change", function () {

	    const selected = $(this).find(":selected");

	    $("#projectName").val(selected.data("project"));
	    $("#site").val(selected.data("site"));
	    $("#Zone").val(selected.data("zone"));

	});
	
	$("#clientName1").on("change", function () {

	    const selected = $(this).find(":selected");

	    $("#projectName1").val(selected.data("project"));
	  

	});

	
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
	        const apiUrl = new URL('/api/salescrm/current-stage', baseUrl1);

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
	
	function updateLead() {

	    const clientId = $("#clientName1").val();
	    const projectName = $("#projectName1").val().trim();
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
	    const currentStageId = $("#currentStage1").val();
	    const comments = $("#comments1").val().trim();

	    if (!clientId) {
	        alert("Please select Client.");
	        $("#clientName1").focus();
	        return;
	    }

	    if (!comments) {
	        alert("Comments are mandatory.");
	        $("#comments1").focus();
	        return;
	    }

	    const noChange =
	        String(clientId) === String(originalLeadData.clientId) &&
	        projectName === originalLeadData.projectName &&
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
	        String(currentStageId) === String(originalLeadData.currentStageId) &&
	        comments === originalLeadData.comments;

	    if (noChange) {
	         showPopup('No Feilds are changed', 'LeadEntry	.jsp');
	        return;
	    }

	    const data = {
	        clientId: parseInt(clientId),
	        projectName: projectName,
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
	        currentStageId: currentStageId ? parseInt(currentStageId) : null,
	        comments: comments,
	        modifiedBy: parseInt(createdById)
	    };

	    $.ajax({
	        url: baseUrl1 + "/api/lead/" + editingLeadId,
	        type: "PUT",
	        contentType: "application/json",
	        xhrFields: {
	            withCredentials: true
	        },
	        data: JSON.stringify(data),

	        success: function (response) {

	            $("#exampleModalScrollableUp").modal("hide");

	            showPopup("Lead updated successfully", "LeadEntry.jsp");
	        },

	        error: function (xhr) {

	            alert(xhr.responseText || "Unable to update Lead.");
	        }
	    });
	}
	
	let currentSubqueryLeadId = 0;

	async function openSubquery(leadId) {
		const today = new Date().toISOString().split("T")[0];

		$("#activityDate").attr("max", today);
		$("#nextFollowUpDate").attr("max", today);
	    currentSubqueryLeadId = leadId;
		

	    try {

	        const apiUrl = new URL(`/api/lead/${leadId}`, baseUrl1);

	        const response = await fetch(apiUrl, {
	            method: "GET",
	            credentials: "include"
	        });

	        if (!response.ok) {
	            throw new Error("Unable to fetch Lead");
	        }

	        const item = await response.json();

	        // Summary
	        $("#sqEnqNo").text(item.leadNo || "");
	        $("#sqProjectName").text(item.projectName || "");
	        $("#sqClientName").text(item.clientName || "");
	        $("#sqCurrentStage").text(item.currentStageName || "");

	        // Clear form
	        $("#activitySource").val("");
	        $("#activityDate").val("");

	        $("#activityAttendedBy").val(
	            sessionStorage.getItem("username") || ""
	        );

	        $("#activityStage").val(item.currentStageName || "");
	        $("#activityContactPerson").val("");
	        $("#nextFollowUpDate").val("");
	        $("#activityRemarks").val("");

	        // Load follow-up history
	        loadFollowupHistory(leadId);

	        $("#exampleModalActivity").modal("show");

	    }
	    catch (e) {
	        console.error(e);
	        alert("Unable to load Lead.");
	    }
	}
	
	async function loadFollowupHistory(leadId) {

	    try {

	        const apiUrl = new URL(`/api/lead/${leadId}/followups`, baseUrl1);

	        const response = await fetch(apiUrl, {
	            credentials: "include"
	        });

	        if (!response.ok) {
	            $("#activityHistoryBody").html(
	                '<tr><td colspan="7" class="text-center">No follow-up available</td></tr>'
	            );
	            return;
	        }

	        const history = await response.json();

	        let rows = "";

	        if (history.length === 0) {

	            rows =
	                '<tr><td colspan="7" class="text-center">No follow-up available</td></tr>';

	        } else {

	            history.forEach(item => {

	                rows += `
	                    <tr>
	                        <td>${item.activityDate || ""}</td>
	                        <td>${item.source || ""}</td>
	                        <td>${item.attendedByName || ""}</td>
	                        <td>${item.stageName || ""}</td>
	                        <td>${item.contactPerson || ""}</td>
	                        <td>${item.nextFollowupDate || ""}</td>
	                        <td>${item.comments || ""}</td>
	                    </tr>
	                `;
	            });
	        }

	        $("#activityHistoryBody").html(rows);

	    } catch (e) {
	        console.error(e);
	    }
	}
	
	$("#saveActivityBtn").on("click", function () {

	    const source = $("#activitySource").val();
	    const activityDate = $("#activityDate").val();
	    const attendedBy = createdById;
	    const stage = $("#activityStage").val();
	    const contactPerson = $("#activityContactPerson").val();
	    const nextFollowUpDate = $("#nextFollowUpDate").val();
	    const comments = $("#activityRemarks").val().trim();

	    if (!activityDate) {
	        alert("Please select Activity Date.");
	        return;
	    }

	    if (!stage) {
	        alert("Please select Stage.");
	        return;
	    }

	    const data = {
	        leadId: currentSubqueryLeadId,
	        source: source,
	        activityDate: activityDate,
	        attendedBy: parseInt(attendedBy),
	        stage: stage,
	        contactPerson: contactPerson,
	        nextFollowUpDate: nextFollowUpDate || null,
	        comments: comments
	    };

	    $.ajax({
	        url: new URL("/api/lead/followup", baseUrl1).toString(),
	        type: "POST",
	        contentType: "application/json",
	        xhrFields: {
	            withCredentials: true
	        },
	        data: JSON.stringify(data),

	        success: function () {

	            loadFollowupHistory(currentSubqueryLeadId);

	            $("#activitySource").val("");
	            $("#activityDate").val("");
	            $("#activityContactPerson").val("");
	            $("#nextFollowUpDate").val("");
	            $("#activityRemarks").val("");

	            showPopup("Follow-up saved successfully", "LeadEntry.jsp");
	        },

	        error: function (xhr) {
	            alert(xhr.responseText || "Unable to save follow-up.");
	        }
	    });

	});
	