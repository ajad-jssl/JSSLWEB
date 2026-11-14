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

// ==============================
// INLINE VALIDATION
// ==============================
function clearFieldErrors(modalSel) {
    $(modalSel).find(".enquiry-field.has-error").removeClass("has-error");
    $(modalSel).find(".field-error-msg").remove();
}

// returns true if value is a number greater than 0
function validatePositiveNumber(selector, label) {
    const v = parseFloat($(selector).val());
    if (isNaN(v) || v <= 0) {
        showFieldError(selector, label + " must be a number greater than 0");
        $(selector)[0].scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
    }
    return true;
}

$("#exampleModalScrollable, #exampleModalScrollableUp, #exampleModalActivity").on("hidden.bs.modal", function () {
    clearFieldErrors(this);
});

function showFieldError(selector, message) {
    const $field = $(selector).closest(".enquiry-field");
    $field.addClass("has-error");
    $field.find(".field-error-msg").remove();
    $field.append('<div class="field-error-msg">' + message + '</div>');
}

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

$(document).on("input change", ".enquiry-field.has-error .enquiry-input", function () {
    $(this).closest(".enquiry-field").removeClass("has-error").find(".field-error-msg").remove();
});

$("#exampleModalActivity").on("hidden.bs.modal", function () {
    clearFieldErrors(this);
});

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

    $("#fmIcon").html('<i class="fas ' + cfg.icon + ' ' + cfg.color + '"></i>');
    $("#fmTitle").text(cfg.title);
    $("#fmText").text(message);
    $("#fmCancel").hide();

    $("#fmOk").off("click").on("click", function () {
        $("#followupMsgModal").one("hidden.bs.modal", function () {
            if (onClose) onClose();
        }).modal("hide");
    });
    $("#followupMsgModal").modal("show");
}

function showConfirm(message, onYes) {
    $("#fmIcon").html('<i class="fas fa-question-circle text-primary"></i>');
    $("#fmTitle").text("Please Confirm");
    $("#fmText").text(message);
    $("#fmCancel").show();

    $("#fmCancel").off("click").on("click", function () {
        $("#followupMsgModal").modal("hide");
    });
    $("#fmOk").off("click").on("click", function () {
        $("#followupMsgModal").one("hidden.bs.modal", function () {
            if (onYes) onYes();
        }).modal("hide");
    });
    $("#followupMsgModal").modal("show");
}

// keep the lower modal scrollable after this one closes
$("#followupMsgModal").on("hidden.bs.modal", function () {
    if ($(".modal.show").length) $("body").addClass("modal-open");
});

// ==============================
// BACK-DATE RULE
// ==============================
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

function toMonthValue(v) { return v ? String(v).substring(0, 7) : ""; }
const toInt = v => (v ? parseInt(v) : null);

// ==============================
// SESSION / SHARED HELPERS
// ==============================
function getCurrentUsername() {
    return sessionStorage.getItem('username') || 'Guest';
}
function getCurrentUserId() {
    return sessionStorage.getItem('id');
}

function stageBadgeClass(stageName) {
    switch (stageName) {
        case "Win": return "badge-success";
        case "Lose": return "badge-danger";
        case "Hold": return "badge-warning";
        case "Lead": return "badge-info";
        default: return "badge-secondary";
    }
}

function showPopup(message, redirectUrl) {
    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
    setTimeout(function () {
        popup.fadeOut(400, function () {
            $(this).remove();
            if (redirectUrl) {
                window.location = redirectUrl;
            }
        });
    }, 2000);
}

function formatDate(dateString) {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// ==============================
// GENERIC MASTER DROPDOWN LOADER
// ==============================
async function loadDropdown(url, selector, valueField, textField, placeholder) {

    try {
        const apiUrl = new URL(url, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch " + url);

        const data = await response.json();

        let options = `<option value="">${placeholder}</option>`;

        data.forEach(item => {
            options += `<option value="${item[valueField]}">${item[textField]}</option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error('Error loading dropdown ' + url, error);
    }
}

async function loadSegmentDropdown(selector, defaultText = "Select Segment") {
    await loadDropdown('/api/salescrm/segment', selector, 'id', 'segmentName', defaultText);
}

// NEW — this was never being called anywhere, which is why Design Basis
// never reflected the saved value: the select had no options to match against.
async function loadDesignBasisDropdown(selector, defaultText = "Select Design Basis") {
    await loadDropdown('/api/salescrm/design-basis', selector, 'id', 'designBasisName', defaultText);
}

// ==============================
// LEAD NO DROPDOWN (Create modal)
// ==============================

function selectStageByName(selector, name) {
    const $opt = $(selector).find("option").filter(function () {
        return $(this).text().trim().toLowerCase() === name.toLowerCase();
    });
    if ($opt.length) $(selector).val($opt.val());
}


let leadData = [];

async function loadLeadNos(selector) {

    try {
        const apiUrl = new URL('/api/lead/leadnos', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Lead Nos");
        }

        const result = await response.json();

        let options = '<option value="">Select Lead No</option>';

        result.forEach(lead => {
            options += `
                <option value="${lead.leadId}"
                        data-clientid="${lead.client}"
                        data-leadno="${lead.leadNo}">
                    ${lead.leadNo}
                </option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error("Error fetching Lead Nos:", error);
    }
}

$("#leadNo").change(async function () {

    const leadId = $(this).val();
    const clientId = $(this).find(":selected").data("clientid");

    if (!clientId) {
        return;
    }

    try {
        const clientApi = new URL('/api/salescrm/client', baseUrl1);

        const clientResponse = await fetch(clientApi, {
            method: "GET",
            credentials: "include"
        });

        if (!clientResponse.ok) {
            throw new Error("Failed to fetch client details");
        }

        const clients = await clientResponse.json();
        const client = clients.find(c => c.id == clientId);

        if (client) {
            $("#projectName").val(client.clientName + " - " + client.address);
            $("#clientName").val(client.clientName);
            $("#siteLocation").val(client.address);
            $("#zone").val(client.zone_name);
	
        }

        if (leadId) {
            const leadApi = new URL(`/api/lead/${leadId}`, baseUrl1);

            const leadResponse = await fetch(leadApi, {
                method: "GET",
                credentials: "include"
            });

            if (!leadResponse.ok) {
                throw new Error("Failed to fetch lead details");
            }

            const lead = await leadResponse.json();

            $("#suggestedBidValue").val(lead.suggestedBidValue);
            $("#segment").val(lead.segmentId);
            $("#areaQty").val(lead.areaQty);
			$("#designBasis").val(lead.designBasisId);
			
			//$("#currentStage").val(lead.currentStageId || "");
			
			selectStageByName("#currentStage", "Enquiry");
			$("#tentClosureMon").val(toMonthValue(lead.tentativeClosureMonth));
        }

    } catch (error) {
        console.error(error);
    }
});

// ==============================
// CREATE — open modal (single handler)
// ==============================
document.getElementById("modalScroll1").addEventListener("click", async function () {
	
	
	const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}

    await loadLeadNos("#leadNo");
    await loadSegmentDropdown("#segment", "Select Segment");
    await loadDesignBasisDropdown("#designBasis", "Select Design Basis");

    $("#areaQty").val("");
    $("#suggestedBidValue").val("");
    $("#segment").val("");
    $("#designBasis").val("");
    $("#clientName").val("");
    $("#projectName").val("");
    $("#siteLocation").val("");
    $("#zone").val("");
	
	await loadDropdown('/api/salescrm/current-stage', '#currentStage', 'id', 'stageName', 'Current Stage');
	$("#currentStage").val("");
	$("#tentClosureMon").val("");


    $('#exampleModalScrollable').modal('show');
});

// ==============================
// CREATE SAVE — single POST handler
// ==============================
document.getElementById("createEnquiryBtn").addEventListener("click", async function () {

    try {
		
		const createRequired = [
		    ["#leadNo", "Lead No"],
		    ["#areaQty", "Area / Qty"],
		    ["#suggestedBidValue", "Suggested Bid Value"],
		    ["#segment", "Segment"],
		    ["#designBasis", "Design Basis"],
		    ["#paintingRequirement", "Painting Requirement"],
		    ["#enquiryType", "Type of Enquiry"],
		    ["#fireProofing", "Fire Proofing Required"]
		];
		if (!validateRequired("#exampleModalScrollable", createRequired)) return;
		if (!validatePositiveNumber("#areaQty", "Area / Qty")) return;
		if (!validatePositiveNumber("#suggestedBidValue", "Suggested Bid Value")) return;
		
		
        const paymentData = {
            advancePercentage: 0,
            stage1Percentage: 0,
            stage2Percentage: 0,
            stage3Percentage: 0
        };

        document.querySelectorAll("#paymentTerms .payment-term:checked").forEach(function (checkbox) {
            const container = checkbox.parentElement.parentElement;
            const percentageInput = container.querySelector(".payment-percentage");
            const percentage = parseFloat(percentageInput.value) || 0;

            switch (checkbox.value) {
                case "1": paymentData.advancePercentage = percentage; break;
                case "2": paymentData.stage1Percentage = percentage; break;
                case "3": paymentData.stage2Percentage = percentage; break;
                case "4": paymentData.stage3Percentage = percentage; break;
            }
        });

        const totalPercentage =
            paymentData.advancePercentage +
            paymentData.stage1Percentage +
            paymentData.stage2Percentage +
            paymentData.stage3Percentage;

        if (totalPercentage > 100) {
            showPopup("Payment terms percentage cannot exceed 100%", "");
            return;
        }

        const enquiry = {
            leadNo: $("#leadNo option:selected").text().trim(),
            segmentId: $("#segment").val() || null,
            designBasisId: $("#designBasis").val() || null,
            areaQty: $("#areaQty").val() || 0,
            suggestedBidValue: $("#suggestedBidValue").val() || 0,
            attachmentRemarks: $("#attachmentRemarks").val(),
            paintingRequirement: $("#paintingRequirement").val(),
            enquiryType: $("#enquiryType").val(),
         /*   fireProofingRequired: $("#fireProofingRequired").val() === "Yes",*/
			fireProofingRequired: $("#fireProofing").val() === "1",
            fireProofingRemarks: $("#fireProofingRemarks").val(),
            advancePercentage: paymentData.advancePercentage,
            stage1Percentage: paymentData.stage1Percentage,
            stage2Percentage: paymentData.stage2Percentage,
            stage3Percentage: paymentData.stage3Percentage,
            status: true,
            createdBy: parseInt(createdById),
			currentStageId: $("#currentStage").val() ? parseInt($("#currentStage").val()) : null,
			tentativeClosureMonth: $("#tentClosureMon").val() ? $("#tentClosureMon").val() + "-01" : null
        };

        const formData = new FormData();
        formData.append("enquiry", new Blob([JSON.stringify(enquiry)], { type: "application/json" }));

        const fileInput = document.getElementById("attachments");

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const maxSize = 1 * 1024 * 1024;

            if (file.size > maxSize) {
                showPopup("File size cannot exceed 1 MB.", "");
                return;
            }

            formData.append("file", file);
        }

        const apiUrl = new URL("/api/enquiry", baseUrl1);

        const response = await fetch(apiUrl, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        $("#exampleModalScrollable").modal("hide");
        showPopup("Enquiry created successfully", "EnquiryEntry.jsp");

    } catch (error) {
        console.error(error);
        showPopup("Failed to save enquiry", "");
    }
});




async function fetchEnquiries() {

    try {
        const [response, stageResponse] = await Promise.all([
            fetch(new URL('/api/enquiry', baseUrl1), { method: "GET", credentials: "include" }),
            fetch(new URL('/api/salescrm/current-stage', baseUrl1), { method: "GET", credentials: "include" })
        ]);

        if (!response.ok) {
            throw new Error("Failed to fetch Enquiries");
        }

        const enquiries = await response.json();

        // id -> name map; if the stage call fails, rows show "-" instead of breaking the table
        const stageMap = {};
        if (stageResponse.ok) {
            const stages = await stageResponse.json();
            stages.forEach(s => { stageMap[s.id] = s.stageName; });
        }

        let rows = "";

        enquiries.forEach((item, index) => {
            const stageName = stageMap[item.currentStageId] || '-';

            rows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.enqNo}</td>
                    <td>${item.leadNo}</td>
                    <td>${item.areaQty}</td>
                    <td>${item.suggestedBidValue}</td>
					<td>${item.clientName}</td>
					<td>${item.projectName}</td>
                    <td><span class="badge ${stageBadgeClass(stageName)}">${stageName}</span></td>
                    <td>
                        <i class="fa fa-pen text-primary"
                           style="cursor:pointer"
                           onclick="openEditEnquiry(${item.id})"></i>
                    </td>
                    <td>
                        <i class="fa fa-list-alt text-success"
                           style="cursor:pointer"
                           onclick="openSubquery(${item.id})"></i>
                    </td>
				
									  
						  <td>
					     <span style="cursor:pointer" onclick="openAttachments(${item.id})">
							 <i class="fa fa-paperclip text-primary"></i>
					  <span class="badge badge-secondary" hidden>${item.attachmentCount || 0}</span>
						 </span>
					</td>
                </tr>
            `;
        });

        $("#enquiryTableBody").html(rows);

        // Destroy existing DataTable
        if ($.fn.DataTable.isDataTable('#EnquiryTableID')) {
            $('#EnquiryTableID').DataTable().destroy();
        }

        // Initialize DataTable
        $('#EnquiryTableID').DataTable({
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
                title: 'Enquiry List'
            }]
        });

    } catch (error) {
        console.error(error);
    }
}

// ==============================
// EDIT — fetch enquiry by id, prefill update modal
// ==============================
let enquiryId = 0;
let originalEnquiryData = {};

async function openEditEnquiry(id) {
	
	
	const allowed =allowedActions || [];

		if (!allowed.includes("Edit")) {
		  alert(" You do not have permission to Edit.");
		  $('#exampleModalScrollableIN').modal('hide');
		  return;
		}

    enquiryId = id;

    try {
        // FIX: design basis dropdown must be populated BEFORE setting its value,
        // exactly like segment already does — this was missing entirely before.
        await Promise.all([
            loadSegmentDropdown("#segment1", "Select Segment"),
            loadDesignBasisDropdown("#designBasis1", "Select Design Basis"),
			loadDropdown('/api/salescrm/current-stage', '#currentStage1', 'id', 'stageName', 'Current Stage')
        ]);

        const apiUrl = new URL(`/api/enquiry/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch enquiry");
        }

        const item = await response.json();

        const attachmentContainer = document.getElementById("existingAttachment1");
        attachmentContainer.innerHTML = "";

        if (item.attachmentPath) {
            const fileName = item.attachmentPath.split("\\").pop().split("/").pop();
            attachmentContainer.innerHTML = `
                <div>
                    <i class="fas fa-paperclip"></i>
                    <strong>${fileName}</strong>
                    <button type="button"
                            class="btn btn-sm btn-primary ml-2"
                            onclick="viewEnquiryAttachment('${item.id}')">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                </div>
            `;
        }

        $("#updateEnquiryBtn").data("id", item.id);

        $("#enqNo1").val(item.enqNo);
        $("#leadNo1").val(item.leadNo);
        $("#areaQty1").val(item.areaQty);
        $("#suggestedBidValue1").val(item.suggestedBidValue);
        $("#segment1").val(item.segmentId);
        $("#designBasis1").val(item.designBasisId);
        $("#paintingRequirement1").val(item.paintingRequirement);
        $("#enquiryType1").val(item.enquiryType);
        $("#fireProofing1").val(item.fireProofingRequired ? "1" : "0");

        loadPaymentTerms1(item);

        $("#attachmentRemarks1").val(item.attachmentRemarks || "");
        $("#fireProofingRemarks1").val(item.fireProofingRemarks || "");
        $("#attachments1").val("");
		
		$("#currentStage1").val(item.currentStageId || "");
		$("#tentClosureMon1").val(toMonthValue(item.tentativeClosureMonth));

        // NEW — snapshot for "no changes" detection on update
        originalEnquiryData = {
            segmentId: String(item.segmentId || ''),
            designBasisId: String(item.designBasisId || ''),
            areaQty: (item.areaQty || '').toString(),
            suggestedBidValue: (item.suggestedBidValue || '').toString(),
            paintingRequirement: item.paintingRequirement || '',
            enquiryType: item.enquiryType || '',
            fireProofingRequired: !!item.fireProofingRequired,
            fireProofingRemarks: (item.fireProofingRemarks || '').trim(),
            attachmentRemarks: (item.attachmentRemarks || '').trim(),
            advancePercentage: item.advancePercentage || 0,
            stage1Percentage: item.stage1Percentage || 0,
            stage2Percentage: item.stage2Percentage || 0,
            stage3Percentage: item.stage3Percentage || 0,
			tentativeClosureMonth: toMonthValue(item.tentativeClosureMonth)
        };

        $("#exampleModalScrollableUp").modal("show");

    } catch (error) {
        console.error(error);
        alert("Failed to load enquiry");
    }
}

async function viewEnquiryAttachment(id) {

    try {
        const apiUrl = new URL(`/api/enquiry/${id}/attachment`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl, "_blank");

    } catch (error) {
        console.error(error);
        showPopup("Unable to preview attachment", "");
    }
}

// ==============================
// UPDATE SAVE — single PUT handler, with "no changes" detection
// ==============================
document.getElementById("updateEnquiryBtn").addEventListener("click", async function () {

    try {
		const updateRequired = [
		    ["#areaQty1", "Area / Qty"],
		    ["#suggestedBidValue1", "Suggested Bid Value"],
		    ["#segment1", "Segment"],
		    ["#designBasis1", "Design Basis"],
		    ["#paintingRequirement1", "Painting Requirement"],
		    ["#enquiryType1", "Type of Enquiry"],
		    ["#fireProofing1", "Fire Proofing Required"]
		];
		if (!validateRequired("#exampleModalScrollableUp", updateRequired)) return;
		if (!validatePositiveNumber("#areaQty1", "Area / Qty")) return;
		if (!validatePositiveNumber("#suggestedBidValue1", "Suggested Bid Value")) return;
		
        const paymentData = {
            advancePercentage: 0,
            stage1Percentage: 0,
            stage2Percentage: 0,
            stage3Percentage: 0
        };

        document.querySelectorAll("#paymentTerms1 .payment-term1:checked").forEach(function (checkbox) {
            const container = checkbox.parentElement.parentElement;
            const percentageInput = container.querySelector(".payment-percentage1");
            const percentage = parseFloat(percentageInput.value) || 0;

            switch (checkbox.value) {
                case "1": paymentData.advancePercentage = percentage; break;
                case "2": paymentData.stage1Percentage = percentage; break;
                case "3": paymentData.stage2Percentage = percentage; break;
                case "4": paymentData.stage3Percentage = percentage; break;
            }
        });

        const totalPercentage =
            paymentData.advancePercentage +
            paymentData.stage1Percentage +
            paymentData.stage2Percentage +
            paymentData.stage3Percentage;

        if (totalPercentage > 100) {
            showPopup("Payment terms percentage cannot exceed 100%", "");
            return;
        }

        let invalidPayment = false;

        document.querySelectorAll("#paymentTerms1 .payment-term1:checked").forEach(function (checkbox) {
            const container = checkbox.parentElement.parentElement;
            const percentageInput = container.querySelector(".payment-percentage1");
            const percentage = parseFloat(percentageInput.value) || 0;
            if (percentage <= 0) invalidPayment = true;
        });

        if (invalidPayment) {
            showPopup("Please enter percentage for all selected payment terms", "");
            return;
        }

        const current = {
            segmentId: String($("#segment1").val() || ''),
            designBasisId: String($("#designBasis1").val() || ''),
            areaQty: ($("#areaQty1").val() || '').toString(),
            suggestedBidValue: ($("#suggestedBidValue1").val() || '').toString(),
            paintingRequirement: $("#paintingRequirement1").val() || '',
            enquiryType: $("#enquiryType1").val() || '',
            fireProofingRequired: $("#fireProofing1").val() === "1",
            fireProofingRemarks: $("#fireProofingRemarks1").val().trim(),
            attachmentRemarks: $("#attachmentRemarks1").val().trim(),
            advancePercentage: paymentData.advancePercentage,
            stage1Percentage: paymentData.stage1Percentage,
            stage2Percentage: paymentData.stage2Percentage,
            stage3Percentage: paymentData.stage3Percentage,
	      tentativeClosureMonth: $("#tentClosureMon1").val() || '',
        };

        const fileInput = document.getElementById("attachments1");
        const fileChanged = fileInput.files.length > 0;

        const noChange = !fileChanged && Object.keys(current).every(
            key => String(current[key]) === String(originalEnquiryData[key])
        );

        if (noChange) {
            $("#exampleModalScrollableUp").modal("hide");
            showPopup("No Feilds are changes", "EnquiryEntry.jsp");
            return;
        }

        const payload = {
            leadNo: $("#leadNo1").val().trim(),
            segmentId: $("#segment1").val() || null,
            designBasisId: $("#designBasis1").val() || null,
            areaQty: $("#areaQty1").val() || 0,
            suggestedBidValue: $("#suggestedBidValue1").val() || 0,
            paintingRequirement: current.paintingRequirement,
            enquiryType: current.enquiryType,
            fireProofingRequired: current.fireProofingRequired,
            fireProofingRemarks: current.fireProofingRemarks,
            advancePercentage: paymentData.advancePercentage,
            stage1Percentage: paymentData.stage1Percentage,
            stage2Percentage: paymentData.stage2Percentage,
            stage3Percentage: paymentData.stage3Percentage,
            attachmentRemarks: current.attachmentRemarks,
            status: true,
            modifiedBy: parseInt(createdById)
        };

        const formData = new FormData();
        formData.append("enquiry", new Blob([JSON.stringify(payload)], { type: "application/json" }));

        if (fileChanged) {
            const file = fileInput.files[0];
            const maxSize = 1 * 1024 * 1024;

            if (file.size > maxSize) {
                showPopup("File size cannot exceed 1 MB", "");
                return;
            }

            formData.append("file", file);
        }

        const apiUrl = new URL(`/api/enquiry/${enquiryId}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "PUT",
            credentials: "include",
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        $("#exampleModalScrollableUp").modal("hide");
        showPopup("Enquiry updated successfully", "EnquiryEntry.jsp");

    } catch (err) {
        console.error(err);
        showPopup("Unable to update enquiry", "");
    }
});

// ==============================
// PAYMENT TERMS — Create modal
// ==============================
document.querySelectorAll(".payment-term").forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
        const row = this.closest(".payment-term-row");
        const percentage = row.querySelector(".payment-percentage");
        percentage.disabled = !this.checked;
        if (!this.checked) percentage.value = "";
        updatePaymentTotal();
    });
});

document.querySelectorAll(".payment-percentage").forEach(function (input) {
    input.addEventListener("input", function () {
        let total = 0;
        document.querySelectorAll(".payment-percentage").forEach(function (item) {
            total += parseFloat(item.value) || 0;
        });
        if (total > 100) {
            const currentValue = parseFloat(this.value) || 0;
            const otherTotal = total - currentValue;
            this.value = Math.max(0, 100 - otherTotal);
        }
        updatePaymentTotal();
    });
});

function updatePaymentTotal() {
    let total = 0;
    document.querySelectorAll(".payment-percentage").forEach(function (input) {
        if (!input.disabled) total += parseFloat(input.value) || 0;
    });
    const message = document.getElementById("paymentTotalMessage");
    message.textContent = "Total: " + total.toFixed(2) + "%";
    message.className = total === 100 ? "text-success" : "text-muted";
}

// ==============================
// PAYMENT TERMS — Update modal
// ==============================
function loadPaymentTerms1(enquiry) {

    const percentages = {
        "1": enquiry.advancePercentage || 0,
        "2": enquiry.stage1Percentage || 0,
        "3": enquiry.stage2Percentage || 0,
        "4": enquiry.stage3Percentage || 0
    };

    document.querySelectorAll("#paymentTerms1 .payment-term1").forEach(function (checkbox) {
        const value = checkbox.value;
        const container = checkbox.parentElement.parentElement;
        const percentageInput = container.querySelector(".payment-percentage1");
        const percentage = percentages[value] || 0;

        if (percentage > 0) {
            checkbox.checked = true;
            percentageInput.disabled = false;
            percentageInput.value = percentage;
        } else {
            checkbox.checked = false;
            percentageInput.disabled = true;
            percentageInput.value = "";
        }
    });

    updatePaymentTotal1();
}

function updatePaymentTotal1() {
    let total = 0;
    document.querySelectorAll("#paymentTerms1 .payment-percentage1").forEach(function (input) {
        if (!input.disabled) total += parseFloat(input.value) || 0;
    });
    const message = document.getElementById("paymentTotalMessage1");
    if (!message) return;
    message.textContent = "Total: " + total.toFixed(2) + "%";
    message.className = total === 100 ? "text-success" : "text-muted";
}

document.querySelectorAll("#paymentTerms1 .payment-term1").forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
        const container = checkbox.parentElement.parentElement;
        const percentageInput = container.querySelector(".payment-percentage1");
        percentageInput.disabled = !checkbox.checked;
        if (!checkbox.checked) percentageInput.value = "";
        updatePaymentTotal1();
    });
});

document.querySelectorAll("#paymentTerms1 .payment-percentage1").forEach(function (input) {
    input.addEventListener("input", function () {
        let total = 0;
        document.querySelectorAll("#paymentTerms1 .payment-percentage1").forEach(function (item) {
            if (!item.disabled) total += parseFloat(item.value) || 0;
        });
        if (total > 100) {
            const currentValue = parseFloat(this.value) || 0;
            const otherTotal = total - currentValue;
            this.value = Math.max(0, 100 - otherTotal);
        }
        updatePaymentTotal1();
    });
});





/*let currentSubqueryEnquiryId = null;
let editingActivityId = null;
let followupHistoryCache = [];
let currentEnquiryStageId = null;

async function openSubquery(enquiryId) {
    currentSubqueryEnquiryId = enquiryId;
    try {
        const response = await fetch(new URL(`/api/enquiry/${enquiryId}`, baseUrl1),
                                     { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch Enquiry");
        const item = await response.json();


		
		$('#sqEnqNo').text(item.enqNo || '');
		$('#sqProjectName').text(item.projectName || '');
		$('#sqClientName').text(item.clientName || '');
		$('#sqCurrentStage').text(item.currentStageName || '-');

        currentEnquiryStageId = item.currentStageId || null;

        await loadDropdown('/api/salescrm/opportunity-source', '#activitySource', 'id', 'opportunityName', 'Select Source');
        await loadEnquiryStages('#activityStage', currentEnquiryStageId);
       
		if (item.clientId) {
		    await loadDropdown(`/api/salescrm/contact-person/by-client/${item.clientId}`,
		                       '#activityContactPerson', 'id', 'contactName', 'Select Contact Person');
		} else {
		    $('#activityContactPerson').html('<option value="">Select Contact Person</option>');
		}
		
		// await loadDropdown('/api/salescrm/contact-person', '#activityContactPerson', 'id', 'contactName', 'Select Contact Person');

        resetFollowupForm();
        $('#activityAttendedBy').val(getCurrentUsername());

        await fetchActivityHistory(enquiryId);
        $('#exampleModalActivity').modal('show');
    } catch (error) {
        console.error("Error opening Follow-up:", error);
        alert("Unable to load Enquiry Follow-up");
    }
}

function resetFollowupForm() {
    editingActivityId = null;
    $('#activitySource').val('');
    $('#activityDate').val('');
    $('#activityStage').val(currentEnquiryStageId || '');
    $('#activityContactPerson').val('');
    $('#nextFollowUpDate').val('');
    $('#activityRemarks').val('');
    $('#saveActivityBtn').text('Save Follow-up');
    $('#cancelEditBtn').hide();
}

async function fetchActivityHistory(enquiryId) {
    try {
        const apiUrl = new URL(`/api/lead/${enquiryId}/followups`, baseUrl1);
        apiUrl.searchParams.set("enquiry", "true");

        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch Follow-ups");

        const activities = await response.json();
        followupHistoryCache = activities;

        let rows = '';
        if (activities.length === 0) {
            rows = `<tr><td colspan="8" class="text-center text-muted">No follow-ups recorded yet</td></tr>`;
        } else {
            activities.forEach(a => {
                const stageName = a.stageName || '';
                rows += `
                    <tr>
                        <td>${formatDate(a.activityDate) || ''}</td>
                        <td>${a.sourceName || ''}</td>
                        <td>${a.createdBy || ''}</td>
                        <td><span class="badge ${stageBadgeClass(stageName)}">${stageName}</span></td>
                        <td>${a.contactPersonName || ''}</td>
                        <td>${formatDate(a.nextFollowUpDate) || '-'}</td>
                        <td>${a.comments || '-'}</td>
                        <td>
                            <i class="fa fa-pen text-primary mr-2" style="cursor:pointer;" title="Edit"
                               onclick="editFollowup(${a.activityId})"></i>
                            <i class="fa fa-trash text-danger" style="cursor:pointer;" title="Delete"
                               onclick="deleteFollowup(${a.activityId})"></i>
                        </td>
                    </tr>`;
            });
            // header stage = latest non-deleted follow-up (matches what the server syncs)
            currentEnquiryStageId = activities[0].stageId || currentEnquiryStageId;
            $('#sqCurrentStage').text(activities[0].stageName || '-');
        }
        document.getElementById("activityHistoryBody").innerHTML = rows;
    } catch (error) {
        console.error('Error fetching Follow-up history:', error);
    }
}

function editFollowup(activityId) {
    const f = followupHistoryCache.find(x => String(x.activityId) === String(activityId));
    if (!f) return;

    editingActivityId = f.activityId;
    $('#activitySource').val(f.sourceId || '');
    $('#activityDate').val(f.activityDate || '');
    $('#activityStage').val(f.stageId || '');
    $('#activityContactPerson').val(f.contactPersonId || '');
    $('#nextFollowUpDate').val(f.nextFollowUpDate || '');
    $('#activityRemarks').val(f.comments || '');

    $('#saveActivityBtn').text('Update Follow-up');
    $('#cancelEditBtn').show();
}

$("#cancelEditBtn").on("click", resetFollowupForm);

function deleteFollowup(activityId) {
    if (!confirm("Are you sure you want to delete this follow-up?")) return;

    $.ajax({
        url: baseUrl1 + "/api/lead/followup/" + activityId,
        type: "DELETE",
        xhrFields: { withCredentials: true },
        success: async function () {
            if (String(editingActivityId) === String(activityId)) resetFollowupForm();
            await fetchActivityHistory(currentSubqueryEnquiryId);
            showPopup("Follow-up deleted successfully", "");
        },
        error: function (xhr) {
            alert(xhr.responseText || "Unable to delete follow-up.");
        }
    });
}

document.getElementById("saveActivityBtn").addEventListener("click", function () {

    const stageId = $('#activityStage').val();
    const activityDate = $('#activityDate').val();

    if (!activityDate || !stageId) {
        alert("Date and Stage are required");
        return;
    }

    const isEdit = editingActivityId !== null;

    const payload = {
        enquiryId: currentSubqueryEnquiryId,
        isEnquiry: true,
        sourceId: toInt($('#activitySource').val()),
        activityDate: activityDate,
        stageId: parseInt(stageId),
        contactPersonId: toInt($('#activityContactPerson').val()),
        nextFollowUpDate: $('#nextFollowUpDate').val() || null,
        comments: $('#activityRemarks').val().trim(),
        createdBy: getCurrentUserId(),
        modifiedBy: getCurrentUserId()
    };

    $.ajax({
        url: isEdit
            ? baseUrl1 + "/api/lead/followup/" + editingActivityId
            : new URL("/api/lead/followup", baseUrl1).toString(),
        type: isEdit ? "PUT" : "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        xhrFields: { withCredentials: true },
        success: async function () {
            resetFollowupForm();
            await fetchActivityHistory(currentSubqueryEnquiryId);
            showPopup(isEdit ? "Follow-up updated successfully" : "Follow-up saved successfully", "");
        },
        error: function (xhr) {
            alert(xhr.responseText || "Unable to save follow-up.");
        }
    });
});*/



let currentSubqueryEnquiryId = null;
let editingActivityId = null;
let followupHistoryCache = [];
let currentEnquiryStageId = null;

async function openSubquery(enquiryId) {
	const allowed =allowedActions || [];

		if (!allowed.includes("FollowUp")) {
		  alert(" You do not have permission to FollowUp.");
		  $('#exampleModalScrollableIN').modal('hide');
		  return;
		}
	
	
    currentSubqueryEnquiryId = enquiryId;
    try {
        const response = await fetch(new URL(`/api/enquiry/${enquiryId}`, baseUrl1),
                                     { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch Enquiry");
        const item = await response.json();

        $('#sqEnqNo').text(item.enqNo || '');
        $('#sqProjectName').text(item.projectName || '');
        $('#sqClientName').text(item.clientName || '');
        $('#sqCurrentStage').text(item.currentStageName || '-');

        currentEnquiryStageId = item.currentStageId || null;

        await loadDropdown('/api/salescrm/opportunity-source', '#activitySource', 'id', 'opportunityName', 'Select Source');
        await loadEnquiryStages('#activityStage', currentEnquiryStageId);

        if (item.clientId) {
            await loadDropdown(`/api/salescrm/contact-person/by-client/${item.clientId}`,
                               '#activityContactPerson', 'id', 'contactName', 'Select Contact Person');
        } else {
            $('#activityContactPerson').html('<option value="">Select Contact Person</option>');
        }

        followupHistoryCache = [];        // NEW: never reuse the previous enquiry's dates
        resetFollowupForm();
        $('#activityAttendedBy').val(getCurrentUsername());

        await fetchActivityHistory(enquiryId);
        $('#exampleModalActivity').modal('show');
    } catch (error) {
        console.error("Error opening Follow-up:", error);
        showMessage("Unable to load Enquiry Follow-up", "error");
    }
}

function resetFollowupForm() {
    clearFieldErrors("#exampleModalActivity");      // NEW
    editingActivityId = null;
    $('#activitySource').val('');
    $('#activityDate').val('');
    $('#activityStage').val(currentEnquiryStageId || '');
    $('#activityContactPerson').val('');
    $('#nextFollowUpDate').val('');
    $('#activityRemarks').val('');
    $('#saveActivityBtn').text('Save Follow-up');
    $('#cancelEditBtn').hide();
    applyFollowupMinDate(null);                     // NEW
}

async function fetchActivityHistory(enquiryId) {
    try {
        const apiUrl = new URL(`/api/lead/${enquiryId}/followups`, baseUrl1);
        apiUrl.searchParams.set("enquiry", "true");

        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch Follow-ups");

        const activities = await response.json();
        followupHistoryCache = activities;
        applyFollowupMinDate(editingActivityId);    // NEW

        let rows = '';
        if (activities.length === 0) {
            rows = `<tr><td colspan="8" class="text-center text-muted">No follow-ups recorded yet</td></tr>`;
        } else {
            activities.forEach(a => {
                const stageName = a.stageName || '';
                rows += `
                    <tr>
                        <td>${formatDate(a.activityDate) || ''}</td>
                        <td>${a.sourceName || ''}</td>
                        <td>${a.createdBy || ''}</td>
                        <td><span class="badge ${stageBadgeClass(stageName)}">${stageName}</span></td>
                        <td>${a.contactPersonName || ''}</td>
                        <td>${formatDate(a.nextFollowUpDate) || '-'}</td>
                        <td>${a.comments || '-'}</td>
                        <td>
                            <i class="fa fa-pen text-primary mr-2" style="cursor:pointer;" title="Edit"
                               onclick="editFollowup(${a.activityId})"></i>
                            <i class="fa fa-trash text-danger" style="cursor:pointer;" title="Delete"
                               onclick="deleteFollowup(${a.activityId})"></i>
                        </td>
                    </tr>`;
            });
            currentEnquiryStageId = activities[0].stageId || currentEnquiryStageId;
            $('#sqCurrentStage').text(activities[0].stageName || '-');
        }
        document.getElementById("activityHistoryBody").innerHTML = rows;
    } catch (error) {
        console.error('Error fetching Follow-up history:', error);
    }
}

function editFollowup(activityId) {
    const f = followupHistoryCache.find(x => String(x.activityId) === String(activityId));
    if (!f) return;

    clearFieldErrors("#exampleModalActivity");      // NEW
    editingActivityId = f.activityId;
    applyFollowupMinDate(f.activityId);             // NEW

    $('#activitySource').val(f.sourceId || '');
    $('#activityDate').val(String(f.activityDate || '').substring(0, 10));
    $('#activityStage').val(f.stageId || '');
    $('#activityContactPerson').val(f.contactPersonId || '');
    $('#nextFollowUpDate').val(String(f.nextFollowUpDate || '').substring(0, 10));
    $('#activityRemarks').val(f.comments || '');

    $('#saveActivityBtn').text('Update Follow-up');
    $('#cancelEditBtn').show();
}

$("#cancelEditBtn").on("click", resetFollowupForm);

function deleteFollowup(activityId) {
    showConfirm("Are you sure you want to delete this follow-up?", function () {
        $.ajax({
            url: baseUrl1 + "/api/lead/followup/" + activityId + "?userId=" + getCurrentUserId(),   // CHANGED
            type: "DELETE",
            xhrFields: { withCredentials: true },
            success: async function () {
                if (String(editingActivityId) === String(activityId)) resetFollowupForm();
                await fetchActivityHistory(currentSubqueryEnquiryId);
                showPopup("Follow-up deleted successfully", "");
            },
            error: function (xhr) {
                showMessage(xhr.responseText || "Unable to delete follow-up.", "warning");
            }
        });
    });
}

document.getElementById("saveActivityBtn").addEventListener("click", function () {

    const activityDate = $('#activityDate').val();

    // NEW: all fields mandatory
    const requiredFields = [
        ["#activitySource", "Source"],
        ["#activityDate", "Date"],
        ["#activityStage", "Stage"],
        ["#activityContactPerson", "Contact Person"],
        ["#nextFollowUpDate", "Next Follow-up Date"],
        ["#activityRemarks", "Comments"]
    ];
    if (!validateRequired("#exampleModalActivity", requiredFields)) return;

    // NEW: back-date check (also catches dates typed by hand)
    const minDate = $("#activityDate").data("minDate");
    if (minDate && activityDate < minDate) {
        showFieldError("#activityDate",
            "Date cannot be earlier than the last follow-up (" + formatDate(minDate) + ")");
        document.getElementById("activityDate").scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    const isEdit = editingActivityId !== null;

    const payload = {
        enquiryId: currentSubqueryEnquiryId,
        isEnquiry: true,
        sourceId: toInt($('#activitySource').val()),
        activityDate: activityDate,
        stageId: parseInt($('#activityStage').val()),
        contactPersonId: toInt($('#activityContactPerson').val()),
        nextFollowUpDate: $('#nextFollowUpDate').val() || null,
        comments: $('#activityRemarks').val().trim(),
        createdBy: getCurrentUserId(),
        modifiedBy: getCurrentUserId()
    };

    $.ajax({
        url: isEdit
            ? baseUrl1 + "/api/lead/followup/" + editingActivityId
            : new URL("/api/lead/followup", baseUrl1).toString(),
        type: isEdit ? "PUT" : "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        xhrFields: { withCredentials: true },
        success: async function () {
            resetFollowupForm();
            await fetchActivityHistory(currentSubqueryEnquiryId);
            fetchEnquiries();
            showPopup(isEdit ? "Follow-up updated successfully" : "Follow-up saved successfully", "");
        },
        error: function (xhr) {
            showMessage(xhr.responseText || "Unable to save follow-up.", "warning");
        }
    });
});

document.getElementById("updateFollowupBtn").addEventListener("click", function () {

    const stageId = $('#activityStage1').val();
    const activityDate = $('#activityDate1').val();

    if (!activityDate || !stageId) {
        alert("Date and Stage are required");
        return;
    }

    const current = {
        sourceId: String($('#activitySource1').val() || ''),
        activityDate: activityDate,
        stageId: String(stageId),
        contactPersonId: String($('#activityContactPerson1').val() || ''),
        nextFollowUpDate: $('#nextFollowUpDate1').val() || '',
        comments: $('#activityRemarks1').val().trim()
    };

    const noChange = Object.keys(current).every(key => current[key] === originalFollowupData[key]);

    if (noChange) {
        $('#exampleModalActivityUp').modal('hide');
        showPopup('No Feilds are changes', 'EnquiryEntry.jsp');
        return;
    }

    const payload = {
        sourceId: $('#activitySource1').val(),
        activityDate: activityDate,
        stageId: stageId,
        contactPersonId: $('#activityContactPerson1').val(),
        nextFollowUpDate: $('#nextFollowUpDate1').val(),
        comments: $('#activityRemarks1').val().trim(),
        modifiedBy: getCurrentUserId()
    };

    $.ajax({
        url: baseUrl1 + '/api/activity/' + editingFollowupId,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        xhrFields: { withCredentials: true },
        success: async function () {
            $('#exampleModalActivityUp').modal('hide');

            await fetchActivityHistory(currentSubqueryEnquiryId);
            fetchEnquiries();

            const stageName = $('#activityStage1 option:selected').text();
            $('#sqCurrentStage').text(stageName);
        },
        error: function (xhr) {
            console.error('Error updating Follow-up:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Follow-up');
        }
    });
});

// ==============================
// INITIAL LOAD (single ready handler)
// ==============================
$(document).ready( async function () {
	
	
await	loadActions();
    const today = new Date().toISOString().split('T')[0];
	
	const currentMonth = today.slice(0, 7);
	$("#tentClosureMon").attr("min", currentMonth);
	$("#tentClosureMon1").attr("min", currentMonth);
	
    $("#enquiryDate").attr("max", today).val(today);
    $("#activityDate").attr("max", today).val(today);
    $("#activityDate1").attr("max", today).val(today);
    $("#enquiryDate1").attr("max", today).val(today);
    $("#nextFollowUpDate").attr("min", today).val(today);
    $("#nextFollowUpDate1").attr("min", today).val(today);
    $("#nextFollowUpDateCreate").attr("min", today).val(today);
    $("#awardMonth").attr("min", today).val(today);

    fetchEnquiries();
});

// ==============================
// STAGE DROPDOWN FOR ENQUIRY FOLLOW-UP
// Excludes "Lead" — once an Enquiry exists, Lead is not a valid stage.
// ==============================
async function loadEnquiryStages(selector, selectedId) {
    try {
        const apiUrl = new URL('/api/salescrm/current-stage', baseUrl1);
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });

        if (!response.ok) throw new Error("Failed to fetch Current Stages");

        const result = await response.json();

        let options = '<option value="">Select Stage</option>';

        result
            .filter(stage => stage.stageName.trim().toLowerCase() !== "lead")
            .forEach(stage => {
                options += `<option value="${stage.id}">${stage.stageName}</option>`;
            });

        $(selector).html(options);
        if (selectedId) $(selector).val(selectedId);

    } catch (error) {
        console.error("Error fetching Current Stages:", error);
    }
}












let currentAttachmentEnquiryId = null;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

async function openAttachments(enquiryId) {
   /* if (!(allowedActions || []).includes("Attachment")) {
        showMessage("You do not have permission to manage Attachments.", "warning");
        return;
    }*/
    currentAttachmentEnquiryId = enquiryId;
    try {
        const r = await fetch(new URL(`/api/enquiry/${enquiryId}`, baseUrl1), { credentials: "include" });
        if (!r.ok) throw new Error();
        const item = await r.json();
        $("#atEnqNo").text(item.enqNo || "");
        $("#atProjectName").text(item.projectName || "");
        $("#atClientName").text(item.clientName || "");

        $("#newAttachmentRows").empty();
        addAttachmentRow();                       // start with one empty row
        await fetchAttachments(enquiryId);
        $("#exampleModalAttachment").modal("show");
    } catch (e) {
        showMessage("Unable to load attachments", "error");
    }
}

function addAttachmentRow() {
    $("#newAttachmentRows").append(`
      <div class="form-row align-items-center mb-2 attachment-row">
        <div class="col-md-5"><input type="file" class="form-control form-control-sm enquiry-input att-file"></div>
        <div class="col-md-5"><input type="text" class="form-control form-control-sm enquiry-input att-remarks" placeholder="Remarks"></div>
        <div class="col-md-2"><i class="fa fa-times-circle text-danger remove-att-row" style="cursor:pointer" title="Remove"></i></div>
      </div>`);
}
$("#addAttachmentRowBtn").on("click", addAttachmentRow);
$(document).on("click", ".remove-att-row", function () {
    if ($(".attachment-row").length > 1) $(this).closest(".attachment-row").remove();
    else $(this).closest(".attachment-row").find("input").val("");
});

async function fetchAttachments(enquiryId) {
    const r = await fetch(new URL(`/api/enquiry/${enquiryId}/attachments`, baseUrl1), { credentials: "include" });
    if (!r.ok) return;
    const list = await r.json();
    let rows = list.length ? "" :
        `<tr><td colspan="6" class="text-center text-muted">No attachments uploaded yet</td></tr>`;
/*    list.forEach((a, i) => {
        rows += `<tr>
          <td>${i + 1}</td>
          <td><i class="fas fa-paperclip"></i> ${a.fileName}</td>
          <td>${a.remarks || "-"}</td>
          <td>${a.createdByName || ""}</td>
          <td>${formatDate(String(a.createdOn || "").substring(0, 10))}</td>
          <td>
            <i class="fa fa-eye text-primary mr-2" style="cursor:pointer" title="View" onclick="viewAttachment(${a.id})"></i>
            <i class="fa fa-trash text-danger" style="cursor:pointer" title="Delete" onclick="deleteAttachment(${a.id})"></i>
          </td></tr>`;
    });*/
	
	
	list.forEach((a, i) => {
	    rows += `<tr>
	      <td>${i + 1}</td>
	      <td class="att-name" title="${a.fileName}"><i class="fas fa-paperclip"></i> ${a.fileName}</td>
	      <td class="att-remarks" title="${a.remarks || ''}">${a.remarks || "-"}</td>
	      <td>${a.createdByName || ""}</td>
	      <td>${formatDate(String(a.createdOn || "").substring(0, 10))}</td>
	      <td>
	        <i class="fa fa-eye text-primary mr-2" style="cursor:pointer" title="View" onclick="viewAttachment(${a.id})"></i>
	        <i class="fa fa-trash text-danger" style="cursor:pointer" title="Delete" onclick="deleteAttachment(${a.id})"></i>
	      </td></tr>`;
	});
    $("#attachmentHistoryBody").html(rows);
}

$("#uploadAttachmentsBtn").on("click", async function () {
    const fd = new FormData();
    let count = 0, bad = null;

 /*   $(".attachment-row").each(function () {
        const f = $(this).find(".att-file")[0].files[0];
        if (!f) return;
        if (f.size > MAX_FILE_SIZE) { bad = f.name; return false; }
        fd.append("files", f);
        fd.append("remarks", $(this).find(".att-remarks").val().trim());
        count++;
    });

    if (bad) return showMessage(`"${bad}" exceeds 1 MB`, "warning");
    if (!count) return showMessage("Please choose at least one file", "warning");*/
	
	const seen = new Set();
	let dup = null;

	$(".attachment-row").each(function () {
	    const f = $(this).find(".att-file")[0].files[0];
	    if (!f) return;
	    if (f.size > MAX_FILE_SIZE) { bad = f.name; return false; }

	    const key = f.name.toLowerCase();
	    if (seen.has(key)) { dup = f.name; return false; }
	    seen.add(key);

	    fd.append("files", f);
	    fd.append("remarks", $(this).find(".att-remarks").val().trim());
	    count++;
	});

	if (bad) return showMessage(`"${bad}" exceeds 1 MB`, "warning");
	if (dup) return showMessage(`"${dup}" is selected more than once`, "warning");

    try {
        const url = new URL(`/api/enquiry/${currentAttachmentEnquiryId}/attachments`, baseUrl1);
        url.searchParams.set("userId", getCurrentUserId());
        const r = await fetch(url, { method: "POST", credentials: "include", body: fd });
        if (!r.ok) throw new Error(await r.text());

        $("#newAttachmentRows").empty(); addAttachmentRow();
        await fetchAttachments(currentAttachmentEnquiryId);
        fetchEnquiries();                         // refresh the count badge
        showPopup("Attachments uploaded successfully", "");
    } 		 catch (e) {
		    showMessage(e.message || "Unable to upload attachments", "warning");
		}
});

async function viewAttachment(attId) {
    const r = await fetch(new URL(`/api/enquiry/attachment/${attId}/view`, baseUrl1), { credentials: "include" });
    if (!r.ok) return showMessage("Unable to preview attachment", "error");
    window.open(URL.createObjectURL(await r.blob()), "_blank");
}

function deleteAttachment(attId) {
    showConfirm("Are you sure you want to delete this attachment?", async function () {
        const url = new URL(`/api/enquiry/attachment/${attId}`, baseUrl1);
        url.searchParams.set("userId", getCurrentUserId());
        const r = await fetch(url, { method: "DELETE", credentials: "include" });
        if (!r.ok) return showMessage("Unable to delete attachment", "warning");
        await fetchAttachments(currentAttachmentEnquiryId);
        fetchEnquiries();
        showPopup("Attachment deleted successfully", "");
    });
}