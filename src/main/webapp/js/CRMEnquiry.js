/*let editingEnquiryId = null;
let currentSubqueryEnquiryId = null;

// ==============================
// SESSION HELPERS
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

// ==============================
// FETCH + RENDER MAIN TABLE
// ==============================
async function fetchEnquiries() {

    try {
        const apiUrl = new URL('/api/salescrm/enquiry', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch Enquiries");

        const enquiries = await response.json();

        let rows = '';

        enquiries.forEach((item, index) => {
            const stageName = item.currentStageName || 'Enquired';
            rows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.enqNo}</td>
                    <td>${item.projectName || ''}</td>
                    <td>${item.clientName || ''}</td>
                    <td><span class="badge ${stageBadgeClass(stageName)}">${stageName}</span></td>
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

    } catch (error) {
        console.error('Error fetching Enquiries:', error);
    }
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

async function loadLocationDropdown(selector) {
    await loadDropdown('/api/location/cities', selector, 'cityId', 'cityName', 'Select Location');
}

// ==============================
// LOAD ALL MASTER DROPDOWNS (suffix '' for Create, '1' for Update)
// ==============================
async function loadEnquiryFormDropdowns(suffix) {
    await Promise.all([
        loadDropdown('/api/salescrm/client', '#clientName' + suffix, 'id', 'clientName', 'Select Client'),
        loadDropdown('/api/salescrm/project', '#projectName' + suffix, 'id', 'projectName', 'Select Project'),
        loadDropdown('/api/salescrm/subzone', '#zone' + suffix, 'id', 'subZoneName', 'Select Zone'),
        loadDropdown('/api/salescrm/opportunity-source', '#enquirySource' + suffix, 'id', 'opportunityName', 'Select Enquiry Source'),
        loadDropdown('/api/salescrm/segment', '#segment' + suffix, 'id', 'segmentName', 'Select Segment'),
        loadDropdown('/api/salescrm/design-basis', '#designBasis' + suffix, 'id', 'designBasisName', 'Select Design Basis'),
        loadLocationDropdown('#location' + suffix)
    ]);
}

async function loadActivityFormDropdowns() {
    await Promise.all([
        loadDropdown('/api/salescrm/opportunity-source', '#activitySource', 'id', 'opportunityName', 'Select Source'),
        loadDropdown('/api/salescrm/current-stage', '#activityStage', 'id', 'stageName', 'Select Stage'),
        loadDropdown('/api/salescrm/contact-person', '#activityContactPerson', 'id', 'contactName', 'Select Contact Person')
    ]);
}

// ==============================
// PREVIEW NEXT ENQ NO (client-side preview only; backend assigns the real one on save)
// ==============================
async function previewNextEnqNo() {

    try {
        const apiUrl = new URL('/api/salescrm/enquiry', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch Enquiries for preview");

        const enquiries = await response.json();

        const nums = enquiries.map(e => {
            const match = String(e.enqNo).match(/(\d+)$/);
            return match ? parseInt(match[1], 10) : 1000;
        });

        const maxNum = nums.length ? Math.max(...nums) : 1000;

        return "ENQ-" + (maxNum + 1);

    } catch (error) {
        console.error('Error previewing next Enq No:', error);
        return "ENQ-????";
    }
}

// ==============================
// CREATE — open modal
// ==============================
document.getElementById("modalScroll1").addEventListener("click", async function () {

    clearEnquiryForm();
    await loadEnquiryFormDropdowns('');

    $('#name').val(getCurrentUsername());
    $('#enqNo').val(await previewNextEnqNo());

    $('#exampleModalScrollable').modal('show');
});

// ==============================
// CLIENT CHANGE -> LOAD CONTACT PERSONS FOR THAT CLIENT (CREATE MODAL)
// ==============================
$(document).on('change', '#clientName', async function () {

    const clientId = $(this).val();

    $('#contactPersonCreate').html('<option value="">Select Contact Person</option>').prop('disabled', true);

    if (!clientId) return;

    await loadDropdown(
        `/api/salescrm/contact-person/client/${clientId}`,
        '#contactPersonCreate', 'id', 'contactName', 'Select Contact Person'
    );

    $('#contactPersonCreate').prop('disabled', false);
});

document.getElementById("modalScroll1").addEventListener("click", async function () {

    clearEnquiryForm();
    await loadEnquiryFormDropdowns('');

    $('#contactPersonCreate').html('<option value="">Select Contact Person</option>').prop('disabled', true);

    $('#name').val(getCurrentUsername());
    $('#enqNo').val(await previewNextEnqNo());

    $('#exampleModalScrollable').modal('show');
});

function clearEnquiryForm() {
    $('#clientName, #projectName, #location, #zone, #enquirySource, #segment, #designBasis').val('');
    $('#enquiryDate, #qty, #expectedBidValue, #awardMonth, #comments').val('');
	$('#contactPersonCreate, #nextFollowUpDateCreate').val('');
}

// ==============================
// EDIT — fetch enquiry by id, prefill separate update modal
// ==============================
async function openEditEnquiry(id) {

    try {
        const apiUrl = new URL(`/api/salescrm/enquiry/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch Enquiry");

        const item = await response.json();

        editingEnquiryId = id;

        $('#name1').val(getCurrentUsername());
        $('#enqNo1').val(item.enqNo);

        await loadEnquiryFormDropdowns('1');

        $('#clientName1').val(item.clientId);
        $('#projectName1').val(item.projectId);
        $('#location1').val(item.cityId);
        $('#zone1').val(item.zoneId);
        $('#enquirySource1').val(item.enquirySourceId);
        $('#segment1').val(item.segmentId);
        $('#designBasis1').val(item.designBasisId);

        $('#enquiryDate1').val(item.enquiryDate);
        $('#qty1').val(item.qty);
        $('#expectedBidValue1').val(item.expectedBidValue);
        $('#awardMonth1').val(item.awardMonth);
		const today = new Date().toISOString().split('T')[0];
		const existingAwardMonth = item.awardMonth;

		// Set the existing value
		$('#awardMonth1').val(existingAwardMonth);

		// If existing date is in the past,
		// allow it as the minimum date for editing
		if (existingAwardMonth < today) {

		    $('#awardMonth1').attr('min', existingAwardMonth);

		} else {

		    $('#awardMonth1').attr('min', today);
		}
        $('#comments1').val(item.comments);
		originalEnquiryData = {
		        clientId: String(item.clientId || ''),
		        projectId: String(item.projectId || ''),
		        cityId: String(item.cityId || ''),
		        zoneId: String(item.zoneId || ''),
		        enquiryDate: item.enquiryDate || '',
		        enquirySourceId: String(item.enquirySourceId || ''),
		        segmentId: String(item.segmentId || ''),
		        designBasisId: String(item.designBasisId || ''),
		        qty: (item.qty || '').toString(),
		        expectedBidValue: (item.expectedBidValue || '').toString(),
		        awardMonth: item.awardMonth || '',
		        comments: (item.comments || '').trim()
		    };
        $('#exampleModalScrollableUp').modal('show');

    } catch (error) {
        console.error("Error fetching Enquiry:", error);
        alert("Unable to fetch Enquiry");
    }
}



// ==============================
// CREATE SAVE — POST to backend
// ==============================
document.getElementById("createEnquiryBtn").addEventListener("click", function () {

    const clientId = $('#clientName').val();
    const projectId = $('#projectName').val();

    if (!clientId || !projectId) {
        alert("Client Name and Project Name are required");
        return;
    }

    const payload = {
        clientId: clientId,
        projectId: projectId,
        cityId: $('#location').val(),
        zoneId: $('#zone').val(),
        enquiryDate: $('#enquiryDate').val(),
        enquirySourceId: $('#enquirySource').val(),
        segmentId: $('#segment').val(),
        designBasisId: $('#designBasis').val(),
        qty: $('#qty').val(),
        expectedBidValue: $('#expectedBidValue').val(),
        awardMonth: $('#awardMonth').val(),
        comments: $('#comments').val(),
        createdBy: getCurrentUserId()
    };

    $.ajax({
        url: baseUrl + '/api/salescrm/enquiry',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
		xhrFields: { withCredentials: true },
        success: function (response) {
            console.log('Enquiry created successfully', response);
            $('#exampleModalScrollable').modal('hide');
			showPopup('Enquiry created successfully (' + response.enqNo + ')', 'EnquiryEntry.jsp');
            fetchEnquiries();
         
        },
        error: function (xhr) {
			$('#exampleModalScrollable').modal('hide');
            console.error('Error creating Enquiry:', xhr.responseText);
			$("#modalMessage").text(xhr.responseText);
			$("#messageModal").modal("show");
           // alert(xhr.responseText || 'Error creating Enquiry');
        }
    });
});


document.getElementById("createEnquiryBtn").addEventListener("click", function () {

    const clientId = $('#clientName').val();
    const projectId = $('#projectName').val();

    if (!clientId || !projectId) {
        alert("Client Name and Project Name are required");
        return;
    }

    const payload = {
        clientId: clientId,
        projectId: projectId,
        cityId: $('#location').val(),
        zoneId: $('#zone').val(),
        enquiryDate: $('#enquiryDate').val(),
        enquirySourceId: $('#enquirySource').val(),
        segmentId: $('#segment').val(),
        designBasisId: $('#designBasis').val(),
        qty: $('#qty').val(),
        expectedBidValue: $('#expectedBidValue').val(),
        awardMonth: $('#awardMonth').val(),
        comments: $('#comments').val(),
        contactPersonId: $('#contactPersonCreate').val(),
        nextFollowUpDate: $('#nextFollowUpDateCreate').val(),
        createdBy: getCurrentUserId()
    };

    $.ajax({
        url: baseUrl + '/api/salescrm/enquiry',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        xhrFields: { withCredentials: true },
        success: function (response) {
            console.log('Enquiry created successfully', response);
            $('#exampleModalScrollable').modal('hide');
            showPopup('Enquiry created successfully (' + response.enqNo + ')', 'EnquiryEntry.jsp');
            fetchEnquiries();
        },
        error: function (xhr) {
            $('#exampleModalScrollable').modal('hide');
            console.error('Error creating Enquiry:', xhr.responseText);
            $("#modalMessage").text(xhr.responseText);
            $("#messageModal").modal("show");
        }
    });
});

// ==============================
// UPDATE SAVE — PUT to backend
// ==============================
document.getElementById("updateEnquiryBtn").addEventListener("click", function () {

    const clientId = $('#clientName1').val();
    const projectId = $('#projectName1').val();

    if (!clientId || !projectId) {
        alert("Client Name and Project Name are required");
        return;
    }

    const current = {
        clientId: String(clientId),
        projectId: String(projectId),
        cityId: String($('#location1').val() || ''),
        zoneId: String($('#zone1').val() || ''),
        enquiryDate: $('#enquiryDate1').val() || '',
        enquirySourceId: String($('#enquirySource1').val() || ''),
        segmentId: String($('#segment1').val() || ''),
        designBasisId: String($('#designBasis1').val() || ''),
        qty: $('#qty1').val() || '',
        expectedBidValue: $('#expectedBidValue1').val() || '',
        awardMonth: $('#awardMonth1').val() || '',
        comments: $('#comments1').val().trim()
    };

    const noChange = Object.keys(current).every(key => current[key] === originalEnquiryData[key]);

    if (noChange) {
        $('#exampleModalScrollableUp').modal('hide');
        showPopup('No Feilds are changes', 'EnquiryEntry.jsp');
        return;
    }

    const payload = {
        clientId: clientId,
        projectId: projectId,
        cityId: $('#location1').val(),
        zoneId: $('#zone1').val(),
        enquiryDate: $('#enquiryDate1').val(),
        enquirySourceId: $('#enquirySource1').val(),
        segmentId: $('#segment1').val(),
        designBasisId: $('#designBasis1').val(),
        qty: $('#qty1').val(),
        expectedBidValue: $('#expectedBidValue1').val(),
        awardMonth: $('#awardMonth1').val(),
        comments: $('#comments1').val(),
        modifiedBy: getCurrentUserId()
    };

    $.ajax({
        url: baseUrl1 + '/api/salescrm/enquiry/' + editingEnquiryId,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        xhrFields: { withCredentials: true },
        success: function (response) {
            console.log('Enquiry updated successfully', response);
            $('#exampleModalScrollableUp').modal('hide');
            fetchEnquiries();
            showPopup('Enquiry updated successfully', 'EnquiryEntry.jsp');
        },
        error: function (xhr) {
            console.error('Error updating Enquiry:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Enquiry');
        }
    });
});

// ==============================
// SUBQUERY / FOLLOW-UP — fetch enquiry summary + activity history
// ==============================
async function openSubquery(enquiryId) {

    currentSubqueryEnquiryId = enquiryId;

    try {
        const apiUrl = new URL(`/api/salescrm/enquiry/${enquiryId}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch Enquiry");

        const item = await response.json();

        $('#sqEnqNo').text(item.enqNo);
        $('#sqProjectName').text(item.projectName || '');
        $('#sqClientName').text(item.clientName || '');
        $('#sqCurrentStage').text(item.currentStageName || 'Enquired');

        await loadActivityFormDropdowns();

        $('#activitySource').val('');
        $('#activityDate').val('');
        $('#activityAttendedBy').val(getCurrentUsername());
        $('#activityStage').val(item.currentStageId || '');
        $('#activityContactPerson').val('');
        $('#nextFollowUpDate').val('');
        $('#activityRemarks').val('');

        await fetchActivityHistory(enquiryId);

        $('#exampleModalActivity').modal('show');

    } catch (error) {
        console.error("Error opening Follow-up:", error);
        alert("Unable to load Enquiry Follow-up");
    }
}

let currentSubqueryClientId = null; // add alongside your other module-level lets

async function openSubquery(enquiryId) {

    currentSubqueryEnquiryId = enquiryId;

    try {
        const apiUrl = new URL(`/api/salescrm/enquiry/${enquiryId}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch Enquiry");

        const item = await response.json();

        currentSubqueryClientId = item.clientId; // NEW: remember for contact person filtering

        $('#sqEnqNo').text(item.enqNo);
        $('#sqProjectName').text(item.projectName || '');
        $('#sqClientName').text(item.clientName || '');
        $('#sqCurrentStage').text(item.currentStageName || 'Enquired');

        await loadDropdown('/api/salescrm/opportunity-source', '#activitySource', 'id', 'opportunityName', 'Select Source');
        await loadDropdown('/api/salescrm/current-stage', '#activityStage', 'id', 'stageName', 'Select Stage');
        await loadDropdown(
            `/api/salescrm/contact-person/client/${currentSubqueryClientId}`,
            '#activityContactPerson', 'id', 'contactName', 'Select Contact Person'
        );

        $('#activitySource').val('');
        $('#activityDate').val('');
        $('#activityAttendedBy').val(getCurrentUsername());
        $('#activityStage').val(item.currentStageId || '');
        $('#activityContactPerson').val('');
        $('#nextFollowUpDate').val('');
        $('#activityRemarks').val('');

        await fetchActivityHistory(enquiryId);

        $('#exampleModalActivity').modal('show');

    } catch (error) {
        console.error("Error opening Follow-up:", error);
        alert("Unable to load Enquiry Follow-up");
    }
}

// ==============================
// FETCH + RENDER FOLLOW-UP HISTORY
// ==============================
async function fetchActivityHistory(enquiryId) {

    try {
        const apiUrl = new URL(`/api/salescrm/enquiry/${enquiryId}/activity`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch Follow-ups");

        const activities = await response.json();

        let rows = '';

        if (activities.length === 0) {
            rows = `<tr><td colspan="7" class="text-center text-muted">No follow-ups recorded yet</td></tr>`;
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
						    <i class="fa fa-pen text-primary"
						       style="cursor:pointer;"
						       title="Edit"
						       onclick="editfollowup('${a.id}')"></i>
						</td>
                    </tr>
                `;
            });
        }

        document.getElementById("activityHistoryBody").innerHTML = rows;

    } catch (error) {
        console.error('Error fetching Follow-up history:', error);
    }
}

// ==============================
// SAVE FOLLOW-UP — POST to backend
// ==============================
document.getElementById("saveActivityBtn").addEventListener("click", function () {

    const stageId = $('#activityStage').val();
    const activityDate = $('#activityDate').val();

    if (!activityDate || !stageId) {
        alert("Date and Stage are required");
        return;
    }

    const payload = {
        sourceId: $('#activitySource').val(),
        activityDate: activityDate,
        stageId: stageId,
        contactPersonId: $('#activityContactPerson').val(),
        nextFollowUpDate: $('#nextFollowUpDate').val(),
        comments: $('#activityRemarks').val().trim(),
        createdBy: getCurrentUserId()
    };

    $.ajax({
        url: baseUrl + '/api/salescrm/enquiry/' + currentSubqueryEnquiryId + '/activity',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
		xhrFields: { withCredentials: true },
        success: async function () {
            console.log('Follow-up saved successfully');

            await fetchActivityHistory(currentSubqueryEnquiryId);
            fetchEnquiries();

            const stageName = $('#activityStage option:selected').text();
            $('#sqCurrentStage').text(stageName);

            $('#activitySource').val('');
            $('#activityDate').val('');
            $('#activityContactPerson').val('');
            $('#nextFollowUpDate').val('');
            $('#activityRemarks').val('');
        },
        error: function (xhr) {
            console.error('Error saving Follow-up:', xhr.responseText);
            alert(xhr.responseText || 'Error saving Follow-up');
        }
    });
});

// ==============================
// INITIAL LOAD
// ==============================
$(document).ready(function () {
	const today = new Date().toISOString().split('T')[0];
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



function showPopup(message, redirectUrl) {
	var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
	setTimeout(function() {
		popup.fadeOut(400, function() {
			$(this).remove();
			window.location = redirectUrl;
		});
	}, 2000);
}


let editingFollowupId = null;
let originalFollowupData = {};
let originalEnquiryData = {}; 


// ==============================
// EDIT FOLLOW-UP — fetch by id, prefill update modal
// ==============================
async function editfollowup(id) {

    try {
        const apiUrl = new URL(`/api/salescrm/activity/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch Follow-up");

        const item = await response.json();

        editingFollowupId = id;

        await loadDropdown('/api/salescrm/opportunity-source', '#activitySource1', 'id', 'opportunityName', 'Select Source');
        await loadDropdown('/api/salescrm/current-stage', '#activityStage1', 'id', 'stageName', 'Select Stage');
        await loadDropdown('/api/salescrm/contact-person', '#activityContactPerson1', 'id', 'contactName', 'Select Contact Person');

        $('#activitySource1').val(item.sourceId || '');
        $('#activityDate1').val(item.activityDate || '');
        $('#activityAttendedBy1').val(item.createdBy || '');
        $('#activityStage1').val(item.stageId || '');
        $('#activityContactPerson1').val(item.contactPersonId || '');
        $('#nextFollowUpDate1').val(item.nextFollowUpDate || '');
        $('#activityRemarks1').val(item.comments || '');

        // Snapshot original values for "no changes" comparison
        originalFollowupData = {
            sourceId: String(item.sourceId || ''),
            activityDate: item.activityDate || '',
            stageId: String(item.stageId || ''),
            contactPersonId: String(item.contactPersonId || ''),
            nextFollowUpDate: item.nextFollowUpDate || '',
            comments: (item.comments || '').trim()
        };

        $('#exampleModalActivityUp').modal('show');

    } catch (error) {
        console.error("Error fetching Follow-up:", error);
        alert("Unable to fetch Follow-up");
    }
}

async function editfollowup(id) {

    try {
        const apiUrl = new URL(`/api/salescrm/activity/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch Follow-up");

        const item = await response.json();

        editingFollowupId = id;

        await loadDropdown('/api/salescrm/opportunity-source', '#activitySource1', 'id', 'opportunityName', 'Select Source');
        await loadDropdown('/api/salescrm/current-stage', '#activityStage1', 'id', 'stageName', 'Select Stage');
        await loadDropdown(
            `/api/salescrm/contact-person/client/${currentSubqueryClientId}`,
            '#activityContactPerson1', 'id', 'contactName', 'Select Contact Person'
        );

        $('#activitySource1').val(item.sourceId || '');
        $('#activityDate1').val(item.activityDate || '');
        $('#activityAttendedBy1').val(item.user_name || '');
        $('#activityStage1').val(item.stageId || '');
        $('#activityContactPerson1').val(item.contactPersonId || '');
        $('#nextFollowUpDate1').val(item.nextFollowUpDate || '');
        $('#activityRemarks1').val(item.comments || '');

        originalFollowupData = {
            sourceId: String(item.sourceId || ''),
            activityDate: item.activityDate || '',
            stageId: String(item.stageId || ''),
            contactPersonId: String(item.contactPersonId || ''),
            nextFollowUpDate: item.nextFollowUpDate || '',
            comments: (item.comments || '').trim()
        };

        $('#exampleModalActivityUp').modal('show');

    } catch (error) {
        console.error("Error fetching Follow-up:", error);
        alert("Unable to fetch Follow-up");
    }
}

// ==============================
// UPDATE FOLLOW-UP SAVE — with no-change detection
// ==============================
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
        url: baseUrl1 + '/api/salescrm/activity/' + editingFollowupId,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        xhrFields: { withCredentials: true },
        success: async function () {
            console.log('Follow-up updated successfully');

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

function formatDate(dateString) {
    if (!dateString) return "";

    const parts = dateString.split("-");

    if (parts.length !== 3) return dateString;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}*/

document.getElementById("modalScroll1").addEventListener("click", async function () {

await loadLeadNos("#leadNo");
loadSegmentDropdown("#segment", "Select Segment");
$("#areaQty").val("");
$("#suggestedBidValue").val("");
$("#segment").val("");
$("#clientName").val("");
$("#projectName").val("");
$("#siteLocation").val("");
$("#zone").val("");
    $('#exampleModalScrollable').modal('show');
});

$(document).ready(function () {
	fetchEnquiries();
	});


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

        // Fetch Client Details
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

        // Fetch Lead Details
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
        }

    } catch (error) {
        console.error(error);
    }

});

function showPopup(message, redirectUrl) {
	var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
	setTimeout(function() {
		popup.fadeOut(400, function() {
			$(this).remove();
			window.location = redirectUrl;
		});
	}, 2000);
}

async function loadSegmentDropdown(selector, defaultText = "Select Segment") {

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

        result.forEach(segment => {
            options += `
                <option value="${segment.id}">
                    ${segment.segmentName}
                </option>`;
        });

        $(selector).html(options);

    } catch (error) {

        console.error("Error fetching Segments:", error);

    }
}

/*document.getElementById("createEnquiryBtn").addEventListener("click", async function () {

    try {

        const enquiry = {
           leadNo: $("#leadNo option:selected").text().trim(),
            segmentId: $("#segment").val(),
            designBasisId: $("#designBasis").val(),

            areaQty: parseFloat($("#areaQty").val()) || 0,
            suggestedBidValue: parseFloat($("#suggestedBidValue").val()) || 0,

            attachmentRemarks: $("#attachmentRemarks").val(),
            attachmentPath: $("#attachmentPath").val(),

            paintingRequirement: $("#paintingRequirement").val(),
            enquiryType: $("#enquiryType").val(),

            fireProofingRequired: $("#fireProofingRequired").val() === "Yes",
            fireProofingRemarks: $("#fireProofingRemarks").val(),

            paymentTerms: $("#paymentTerms").val(),
            status: true,
            createdBy: parseInt(createdById)
        };

        const apiUrl = new URL("/api/enquiry", baseUrl1);

        const response = await fetch(apiUrl, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(enquiry)
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }
		$("#exampleModalScrollable").modal("hide");
        showPopup("Enquiry created successfully", "EnquiryEntry.jsp");

    } catch (error) {

        console.error(error);
        showPopup("Failed to save enquiry", "");

    }

});*/


document.getElementById("createEnquiryBtn").addEventListener("click", async function () {

    try {

        // ==========================================
        // PAYMENT DATA
        // ==========================================

        const paymentData = {

            advancePercentage: 0,
            stage1Percentage: 0,
            stage2Percentage: 0,
            stage3Percentage: 0

        };

        document.querySelectorAll(
            "#paymentTerms .payment-term:checked"
        ).forEach(function (checkbox) {

            const container =
                checkbox.parentElement.parentElement;

            const percentageInput =
                container.querySelector(".payment-percentage");

            const percentage =
                parseFloat(percentageInput.value) || 0;

            switch (checkbox.value) {

                case "1":
                    paymentData.advancePercentage = percentage;
                    break;

                case "2":
                    paymentData.stage1Percentage = percentage;
                    break;

                case "3":
                    paymentData.stage2Percentage = percentage;
                    break;

                case "4":
                    paymentData.stage3Percentage = percentage;
                    break;
            }

        });


        // ==========================================
        // CHECK TOTAL PERCENTAGE
        // ==========================================

        const totalPercentage =
            paymentData.advancePercentage +
            paymentData.stage1Percentage +
            paymentData.stage2Percentage +
            paymentData.stage3Percentage;

        if (totalPercentage > 100) {

            showPopup(
                "Payment terms percentage cannot exceed 100%",
                ""
            );

            return;
        }


        // ==========================================
        // ENQUIRY DATA
        // ==========================================

        const enquiry = {

            leadNo:
                $("#leadNo option:selected").text().trim(),

            segmentId:
                $("#segment").val() || null,

            designBasisId:
                $("#designBasis").val() || null,

            areaQty:
                $("#areaQty").val() || 0,

            suggestedBidValue:
                $("#suggestedBidValue").val() || 0,

            attachmentRemarks:
                $("#attachmentRemarks").val(),

            paintingRequirement:
                $("#paintingRequirement").val(),

            enquiryType:
                $("#enquiryType").val(),

            fireProofingRequired:
                $("#fireProofingRequired").val() === "Yes",

            fireProofingRemarks:
                $("#fireProofingRemarks").val(),

            advancePercentage:
                paymentData.advancePercentage,

            stage1Percentage:
                paymentData.stage1Percentage,

            stage2Percentage:
                paymentData.stage2Percentage,

            stage3Percentage:
                paymentData.stage3Percentage,

            status: true,

            createdBy:
                parseInt(createdById)

        };


        console.log("Enquiry Data:", enquiry);


        // ==========================================
        // FORM DATA
        // ==========================================

        const formData = new FormData();

        // Add enquiry JSON
        formData.append(
            "enquiry",
            new Blob(
                [JSON.stringify(enquiry)],
                { type: "application/json" }
            )
        );


        // ==========================================
        // ADD ONE FILE
        // ==========================================

		const fileInput = document.getElementById("attachments");

		if (fileInput.files.length > 0) {

		    const file = fileInput.files[0];

		    const maxSize = 1 * 1024 * 1024; // 1 MB

		    if (file.size > maxSize) {

		        showPopup(
		            "File size cannot exceed 1 MB.",
		            ""
		        );

		        return;
		    }

		    formData.append("file", file);

		    console.log("File:", file.name);
		    console.log(
		        "File Size:",
		        (file.size / 1024 / 1024).toFixed(2) + " MB"
		    );
		}


        // ==========================================
        // API CALL
        // ==========================================

        const apiUrl =
            new URL("/api/enquiry", baseUrl1);

        const response = await fetch(apiUrl, {

            method: "POST",

            credentials: "include",

            body: formData

        });


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(errorText);

            throw new Error(errorText);
        }


        // ==========================================
        // SUCCESS
        // ==========================================

        $("#exampleModalScrollable").modal("hide");

        showPopup(
            "Enquiry created successfully",
            "EnquiryEntry.jsp"
        );


    } catch (error) {

        console.error(error);

        showPopup(
            "Failed to save enquiry",
            ""
        );
    }

});

// ==============================
// FETCH + RENDER MAIN TABLE
// ==============================
async function fetchEnquiries() {

    try {

        const apiUrl = new URL('/api/enquiry', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Enquiries");
        }

        const enquiries = await response.json();

        let rows = "";

        enquiries.forEach((item, index) => {

            rows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.enqNo}</td>
                    <td>${item.leadNo}</td>
                    <td>${item.areaQty}</td>
                    <td>${item.suggestedBidValue}</td>
                    <td>${item.status ? "Active" : "Inactive"}</td>
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
                </tr>
            `;

        });

        $("#enquiryTableBody").html(rows);

    } catch (error) {

        console.error(error);

    }

}
let enquiryId = 0;
/*async function openEditEnquiry(id) {
	enquiryId = id;
    try {

        await loadSegmentDropdown("#segment1", "Select Segment");

        const apiUrl = new URL(`/api/enquiry/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch enquiry");
        }

        const item = await response.json();

        $("#updateEnquiryBtn").data("id", item.id);

        // Readonly
		$("#enqNo1").val(item.enqNo);
        $("#leadNo1").val(item.leadNo);

        // Textboxes
        $("#areaQty1").val(item.areaQty);
        $("#suggestedBidValue1").val(item.suggestedBidValue);

        // Dropdowns
        $("#segment1").val(item.segmentId);
        $("#designBasis1").val(item.designBasisId);
        $("#paintingRequirement1").val(item.paintingRequirement);
        $("#enquiryType1").val(item.enquiryType);
        $("#fireProofing1").val(item.fireProofingRequired ? "1" : "0");
        $("#paymentTerms1").val(item.paymentTerms);

        // Remarks
        $("#attachmentRemarks1").val(item.attachmentRemarks || "");
        $("#fireProofingRemarks1").val(item.fireProofingRemarks || "");

        // File input cannot be prefilled
        $("#attachments1").val("");

        $("#exampleModalScrollableUp").modal("show");

    } catch (error) {

        console.error(error);
        alert("Failed to load enquiry", "");

    }

}*/

async function openEditEnquiry(id) {

    enquiryId = id;

    try {

        await loadSegmentDropdown("#segment1", "Select Segment");

        const apiUrl = new URL(`/api/enquiry/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {

            method: "GET",

            credentials: "include"

        });

        if (!response.ok) {

            throw new Error("Failed to fetch enquiry");

        }

        const item = await response.json();
		
		const attachmentContainer =
		    document.getElementById("existingAttachment1");

		attachmentContainer.innerHTML = "";

		if (item.attachmentPath) {

		    const fileName =
		        item.attachmentPath.split("\\").pop().split("/").pop();

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

        console.log("Enquiry Data:", item);

        $("#updateEnquiryBtn").data("id", item.id);

        // Readonly
        $("#enqNo1").val(item.enqNo);
        $("#leadNo1").val(item.leadNo);

        // Textboxes
        $("#areaQty1").val(item.areaQty);
        $("#suggestedBidValue1").val(item.suggestedBidValue);

        // Dropdowns
        $("#segment1").val(item.segmentId);
        $("#designBasis1").val(item.designBasisId);
        $("#paintingRequirement1").val(item.paintingRequirement);
        $("#enquiryType1").val(item.enquiryType);
        $("#fireProofing1").val(
            item.fireProofingRequired ? "1" : "0"
        );

        // ==========================================
        // PAYMENT TERMS
        // ==========================================

        loadPaymentTerms1(item);

        // Remarks
        $("#attachmentRemarks1").val(
            item.attachmentRemarks || ""
        );

        $("#fireProofingRemarks1").val(
            item.fireProofingRemarks || ""
        );

        // File input cannot be prefilled
        $("#attachments1").val("");

        $("#exampleModalScrollableUp").modal("show");

    } catch (error) {

        console.error(error);

        alert("Failed to load enquiry");

    }
}

async function viewEnquiryAttachment(id) {

    try {

        const apiUrl = new URL(
            `/api/enquiry/${id}/attachment`,
            baseUrl1
        );

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(
                await response.text()
            );
        }

        const blob = await response.blob();

        const blobUrl =
            URL.createObjectURL(blob);

        window.open(blobUrl, "_blank");

    } catch (error) {

        console.error(error);

        showPopup(
            "Unable to preview attachment",
            ""
        );
    }
}
/*document.getElementById("updateEnquiryBtn").addEventListener("click", async function () {

    try {

        const payload = {

            leadNo: $("#leadNo1").val().trim(),
            segmentId: $("#segment1").val() || null,
            designBasisId: $("#designBasis1").val() || null,
            areaQty: $("#areaQty1").val() || 0,
            suggestedBidValue: $("#suggestedBidValue1").val() || 0,

            paintingRequirement: $("#paintingRequirement1").val(),
            enquiryType: $("#enquiryType1").val(),
           	fireProofingRequired: $("#fireProofing1").val() === "1",
            fireProofingRemarks: $("#fireProofingRemarks1").val(),
            paymentTerms: $("#paymentTerms1").val(),

            attachmentPath: null,
            attachmentRemarks: $("#attachmentRemarks1").val(),

            status: true,
            modifiedBy: parseInt(createdById)
        };

        const apiUrl = new URL(`/api/enquiry/${enquiryId}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok)
            throw new Error("Update failed");

        $("#exampleModalScrollableUp").modal("hide");

		showPopup("Enquiry updated successfully", "EnquiryEntry.jsp");
    

    } catch (err) {
        console.error(err);
        alert("Unable to update enquiry");
    }

});*/

document.getElementById("updateEnquiryBtn").addEventListener("click", async function () {

    try {

        // ==========================================
        // PAYMENT TERMS
        // ==========================================

        const paymentData = {

            advancePercentage: 0,
            stage1Percentage: 0,
            stage2Percentage: 0,
            stage3Percentage: 0

        };

        document.querySelectorAll(
            "#paymentTerms1 .payment-term1:checked"
        ).forEach(function (checkbox) {

            const container =
                checkbox.parentElement.parentElement;

            const percentageInput =
                container.querySelector(".payment-percentage1");

            const percentage =
                parseFloat(percentageInput.value) || 0;

            switch (checkbox.value) {

                case "1":
                    paymentData.advancePercentage = percentage;
                    break;

                case "2":
                    paymentData.stage1Percentage = percentage;
                    break;

                case "3":
                    paymentData.stage2Percentage = percentage;
                    break;

                case "4":
                    paymentData.stage3Percentage = percentage;
                    break;
            }
        });


        // ==========================================
        // CHECK TOTAL
        // ==========================================

        const totalPercentage =
            paymentData.advancePercentage +
            paymentData.stage1Percentage +
            paymentData.stage2Percentage +
            paymentData.stage3Percentage;

        if (totalPercentage > 100) {

            showPopup(
                "Payment terms percentage cannot exceed 100%",
                ""
            );

            return;
        }


        // ==========================================
        // CHECK SELECTED TERMS HAVE PERCENTAGE
        // ==========================================

        let invalidPayment = false;

        document.querySelectorAll(
            "#paymentTerms1 .payment-term1:checked"
        ).forEach(function (checkbox) {

            const container =
                checkbox.parentElement.parentElement;

            const percentageInput =
                container.querySelector(".payment-percentage1");

            const percentage =
                parseFloat(percentageInput.value) || 0;

            if (percentage <= 0) {
                invalidPayment = true;
            }
        });

        if (invalidPayment) {

            showPopup(
                "Please enter percentage for all selected payment terms",
                ""
            );

            return;
        }


        // ==========================================
        // PAYLOAD
        // ==========================================

        const payload = {

            leadNo:
                $("#leadNo1").val().trim(),

            segmentId:
                $("#segment1").val() || null,

            designBasisId:
                $("#designBasis1").val() || null,

            areaQty:
                $("#areaQty1").val() || 0,

            suggestedBidValue:
                $("#suggestedBidValue1").val() || 0,

            paintingRequirement:
                $("#paintingRequirement1").val(),

            enquiryType:
                $("#enquiryType1").val(),

            fireProofingRequired:
                $("#fireProofing1").val() === "1",

            fireProofingRemarks:
                $("#fireProofingRemarks1").val(),

            // Payment percentages
            advancePercentage:
                paymentData.advancePercentage,

            stage1Percentage:
                paymentData.stage1Percentage,

            stage2Percentage:
                paymentData.stage2Percentage,

            stage3Percentage:
                paymentData.stage3Percentage,

            attachmentRemarks:
                $("#attachmentRemarks1").val(),

            status: true,

            modifiedBy:
                parseInt(createdById)
        };


        console.log("Update Payload:", payload);


        // ==========================================
        // FORM DATA
        // ==========================================

        const formData = new FormData();

        formData.append(
            "enquiry",
            new Blob(
                [JSON.stringify(payload)],
                {
                    type: "application/json"
                }
            )
        );


        // ==========================================
        // FILE UPLOAD
        // ==========================================

        const fileInput =
            document.getElementById("attachments1");

        if (fileInput.files.length > 0) {

            const file =
                fileInput.files[0];

            // Maximum 1 MB
            const maxSize =
                1 * 1024 * 1024;

            if (file.size > maxSize) {

                showPopup(
                    "File size cannot exceed 1 MB",
                    ""
                );

                return;
            }

            formData.append(
                "file",
                file
            );

            console.log(
                "New file:",
                file.name
            );
        }


        // ==========================================
        // API CALL
        // ==========================================

        const apiUrl =
            new URL(
                `/api/enquiry/${enquiryId}`,
                baseUrl1
            );

        const response =
            await fetch(apiUrl, {

                method: "PUT",

                credentials: "include",

                body: formData
            });


        // ==========================================
        // RESPONSE
        // ==========================================

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(errorText);

            throw new Error(errorText);
        }


        // ==========================================
        // SUCCESS
        // ==========================================

        $("#exampleModalScrollableUp").modal("hide");

        showPopup(
            "Enquiry updated successfully",
            "EnquiryEntry.jsp"
        );


    } catch (err) {

        console.error(err);

        showPopup(
            "Unable to update enquiry",
            ""
        );
    }

});

document.querySelectorAll(".payment-term").forEach(function (checkbox) {

    checkbox.addEventListener("change", function () {

        const row = this.closest(".payment-term-row");
        const percentage = row.querySelector(".payment-percentage");

        percentage.disabled = !this.checked;

        if (!this.checked) {
            percentage.value = "";
        }

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
        if (!input.disabled) {
            total += parseFloat(input.value) || 0;
        }
    });

    const message = document.getElementById("paymentTotalMessage");

    message.textContent = "Total: " + total.toFixed(2) + "%";

    if (total === 100) {
        message.className = "text-success";
    } else {
        message.className = "text-muted";
    }
}

function loadPaymentTerms1(enquiry) {

    const percentages = {
        "1": enquiry.advancePercentage || 0,
        "2": enquiry.stage1Percentage || 0,
        "3": enquiry.stage2Percentage || 0,
        "4": enquiry.stage3Percentage || 0
    };

    document.querySelectorAll("#paymentTerms1 .payment-term1").forEach(function (checkbox) {

        const value = checkbox.value;

        // Parent div contains both checkbox and percentage input
        const container = checkbox.parentElement.parentElement;

        const percentageInput =
            container.querySelector(".payment-percentage1");

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

    document.querySelectorAll(
        "#paymentTerms1 .payment-percentage1"
    ).forEach(function (input) {

        if (!input.disabled) {
            total += parseFloat(input.value) || 0;
        }
    });

    const message =
        document.getElementById("paymentTotalMessage1");

    if (!message) {
        return;
    }

    message.textContent =
        "Total: " + total.toFixed(2) + "%";

    if (total === 100) {
        message.className = "text-success";
    } else {
        message.className = "text-muted";
    }
}

document.querySelectorAll("#paymentTerms1 .payment-term1").forEach(function (checkbox) {

    checkbox.addEventListener("change", function () {

        const container = checkbox.parentElement.parentElement;

        const percentageInput =
            container.querySelector(".payment-percentage1");

        if (checkbox.checked) {

            percentageInput.disabled = false;

        } else {

            percentageInput.disabled = true;
            percentageInput.value = "";
        }

        updatePaymentTotal1();
    });
});


document.querySelectorAll("#paymentTerms1 .payment-percentage1").forEach(function (input) {

    input.addEventListener("input", function () {

        let total = 0;

        document.querySelectorAll(
            "#paymentTerms1 .payment-percentage1"
        ).forEach(function (item) {

            if (!item.disabled) {
                total += parseFloat(item.value) || 0;
            }

        });

        // Don't allow more than 100
        if (total > 100) {

            const currentValue = parseFloat(this.value) || 0;

            const otherTotal = total - currentValue;

            this.value = Math.max(0, 100 - otherTotal);
        }

        updatePaymentTotal1();
    });
});