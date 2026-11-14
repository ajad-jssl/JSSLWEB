/*const LEVEL_LABELS = { 4: 'Expert', 3: 'Proficient', 2: 'Demonstrating', 1: 'Basic', 0: 'None' };
let newTrngId = null;*/


const LEVEL_LABELS = { 4: 'Expert', 3: 'Proficient', 2: 'Demonstrating', 1: 'Basic', 0: 'None' };
let newTrngId = null;
let activeManageTrngId = null;
let activeManageStatus = null;

$(document).ready(function () {
    fetchTrainings();

    document.getElementById("trngCrt").addEventListener("click", function () {
        $('#trngForm')[0].reset();
        $('#trngSkillsCheckboxList').empty();
        $('#trngSkillsLabel').text('Select Skills');
        loadTrainerOptions();
        loadSkillCheckboxes();
        $('#trngCreateModal').modal('show');
    });

    $(document).on('change', '.trng-skill-checkbox', function () {
        const checked = $('.trng-skill-checkbox:checked');
        $('#trngSkillsLabel').text(checked.length === 0 ? 'Select Skills' : checked.length + ' Skills selected');
    });

    $('#trngSaveBtn').on('click', createTraining);
    $('#participantAddBtn').on('click', addParticipant);
    $('#completeSubmitBtn').on('click', submitCompletion);
});


async function loadTrainerOptions() {
    const apiUrl = new URL('/api/empperf/trng-trainer', baseUrl1);
    const response = await fetch(apiUrl, { credentials: "include" });
    const trainers = await response.json();

    let options = '<option value="" selected disabled>Select Trainer</option>';
    trainers.forEach(function (t) {
        const label = t.trainerType === 'Internal'
            ? `${t.trainerName} (Internal)`
            : `${t.trainerName} - ${t.organization || ''} (External)`;
        options += `<option value="${t.id}">${label}</option>`;
    });
    $('#trngTrainerSelect').html(options);
}


async function loadSkillCheckboxes() {
    const apiUrl = new URL('/api/empperf/skill', baseUrl1);
    const response = await fetch(apiUrl, { credentials: "include" });
    const skills = await response.json();

    let html = '';
    skills.forEach(function (s) {
        html += `
            <div class="form-check">
                <input class="form-check-input trng-skill-checkbox" type="checkbox" value="${s.id}" id="trngSkillChk${s.id}">
                <label class="form-check-label" for="trngSkillChk${s.id}">${s.skillName}</label>
            </div>`;
    });
    $('#trngSkillsCheckboxList').html(html);
}


function createTraining() {

    const title = $('#trngTitle').val().trim();
    const trainerId = $('#trngTrainerSelect').val();
    const date = $('#trngDate').val();
    const skillIds = $('.trng-skill-checkbox:checked').map(function () { return parseInt($(this).val()); }).get();

    $('.error-message').hide();
    let valid = true;

    if (!title) { $('#trngTitleError').show(); valid = false; }
    if (!trainerId) { $('#trngTrainerError').show(); valid = false; }
    if (!date) { $('#trngDateError').show(); valid = false; }
    if (skillIds.length === 0) { $('#trngSkillsError').show(); valid = false; }
    if (!valid) return;

  /*  $.ajax({
        url: baseUrl1 + '/api/empperf/trng-master',
        type: 'POST',
        contentType: 'application/json',
        xhrFields: { withCredentials: true },
        data: JSON.stringify({
            title: title,
            trainerId: parseInt(trainerId),
            trngDate: date,
            duration: $('#trngDuration').val().trim(),
            venue: $('#trngVenue').val().trim(),
            skillIds: skillIds,
            createdBy: sessionStorage.getItem('id')
        }),
        success: function (response) {
            newTrngId = response.id;
            $('#trngCreateModal').modal('hide');
            $('#participantTrngTitle').text(title);
            $('#participantListTable tbody').empty();
            $('#trngParticipantModal').modal('show');
        },
        error: function (xhr) {
            alert(xhr.responseText || 'Error creating training');
        }
    });*/
	
	$.ajax({
	    url: baseUrl1 + '/api/empperf/trng-master',
	    type: 'POST',
	    contentType: 'application/json',
	    xhrFields: { withCredentials: true },
	    data: JSON.stringify({ 		title: title,
		        trainerId: parseInt(trainerId),
		        trngDate: date,
		        duration: $('#trngDuration').val().trim(),
		        venue: $('#trngVenue').val().trim(),
		        skillIds: skillIds,
		        createdBy: sessionStorage.getItem('id') }),
	    success: function (response) {
	        newTrngId = response.id;
	        $('#trngCreateModal').modal('hide');
	        openManageModal(response.id, $('#trngTitle').val().trim());
	    },
	    error: function (xhr) { alert(xhr.responseText || 'Error creating training'); }
	});
}


/*async function openManageModal(trngId, title) {

    activeManageTrngId = trngId;
    $('#manageTrngTitle').text(title);
    $('#manageCertNo').val('');

    await loadEligibleEmployees(trngId);
    await loadParticipantBlocks(trngId);

    $('#trngManageModal').modal('show');
}*/



async function openManageModal(trngId, title, status) {

    activeManageTrngId = trngId;
    activeManageStatus = status;

    $('#manageTrngTitle').text(title + (status === 'Completed' ? ' (Completed - Read Only)' : ''));
    $('#manageCertNo').val('');

    const isCompleted = status === 'Completed';

    // Lock everything if already completed
    $('#addParticipantBar').toggle(!isCompleted);
    $('#pendingRatingNotice').hide();
    $('#saveRatingsBtn').toggle(!isCompleted);
    $('#markCompleteBtn').toggle(!isCompleted);
    $('#manageCertNo').prop('disabled', isCompleted);

    await loadEligibleEmployees(trngId);
    await loadParticipantBlocks(trngId, isCompleted);

    $('#trngManageModal').modal('show');
}


async function loadEligibleEmployees(trngId) {

    const apiUrl = new URL('/api/empperf/trng-master/' + trngId + '/eligible-employees', baseUrl1);
    const response = await fetch(apiUrl, { credentials: "include" });
    const employees = await response.json();

    let options = '<option value="" selected disabled>Select Employee</option>';

    if (employees.length === 0) {
        options = '<option value="" selected disabled>No eligible employees found</option>';
    } else {
        employees.forEach(function (e) {
            options += `<option value="${e.empCode}">${e.name} (${e.empCode}) — ${e.designation}</option>`;
        });
    }

    $('#eligibleEmpSelect').html(options);
}





/*async function loadParticipantBlocks(trngId) {

    const apiUrl = new URL('/api/empperf/trng-master/' + trngId + '/participants', baseUrl1);
    const response = await fetch(apiUrl, { credentials: "include" });
    const participants = await response.json();

    if (participants.length === 0) {
        $('#participantBlocksContainer').empty();
        $('#noParticipantsMessage').show();
        $('#addParticipantBar').show();
        $('#pendingRatingNotice').hide();
        return;
    }

    $('#noParticipantsMessage').hide();

    // Check if any participant has an incomplete skill - blocks adding new ones
    const hasIncomplete = participants.some(p => p.skills.some(s => s.afterSymbol === null));
    $('#addParticipantBar').toggle(!hasIncomplete);
    $('#pendingRatingNotice').toggle(hasIncomplete);

    let html = '';

    participants.forEach(function (p) {

        let skillRows = '';

        p.skills.forEach(function (s) {

            const beforeLabel = (s.beforeSymbol === null)
                ? '<span class="level-badge level-none">Not rated</span>'
                : `<span class="level-badge level-${s.beforeSymbol}">${LEVEL_LABELS[s.beforeSymbol]} (${s.beforeSymbol})</span>`;

            let pills = '';
            [4, 3, 2, 1, 0].forEach(function (sym) {
                const inputId = `after_${p.empCode}_${s.skillId}_${sym}`;
                const checked = (s.afterSymbol === sym) ? 'checked' : '';
                pills += `
                    <input type="radio" name="after_${p.empCode}_${s.skillId}" id="${inputId}" value="${sym}" ${checked}>
                    <label class="level-pill" for="${inputId}">${LEVEL_LABELS[sym]} (${sym})</label>
                `;
            });

            skillRows += `
                <tr data-emp-code="${p.empCode}" data-skill-id="${s.skillId}">
                    <td>${s.skillName}</td>
                    <td>${beforeLabel}</td>
                    <td><div class="level-pill-group">${pills}</div></td>
                </tr>
            `;
        });

        html += `
            <div class="participant-block">
                <h6>${p.name} (${p.empCode}) — ${p.designation}</h6>
                <table class="table table-sm mb-0">
                    <thead><tr><th>Skill</th><th>Before</th><th>After</th></tr></thead>
                    <tbody>${skillRows}</tbody>
                </table>
            </div>
        `;
    });

    $('#participantBlocksContainer').html(html);
}*/



async function loadParticipantBlocks(trngId, isCompleted = false) {

    const apiUrl = new URL('/api/empperf/trng-master/' + trngId + '/participants', baseUrl1);
    const response = await fetch(apiUrl, { credentials: "include" });
    const participants = await response.json();

    if (participants.length === 0) {
        $('#participantBlocksContainer').empty();
        $('#noParticipantsMessage').show();
        return;
    }

    $('#noParticipantsMessage').hide();

    if (!isCompleted) {
        const hasIncomplete = participants.some(p => p.skills.some(s => s.afterSymbol === null));
        $('#addParticipantBar').toggle(!hasIncomplete);
        $('#pendingRatingNotice').toggle(hasIncomplete);
    }

    let html = '';

    participants.forEach(function (p) {

        let skillRows = '';

        p.skills.forEach(function (s) {

            const beforeLabel = (s.beforeSymbol === null)
                ? '<span class="level-badge level-none">Not rated</span>'
                : `<span class="level-badge level-${s.beforeSymbol}">${LEVEL_LABELS[s.beforeSymbol]} (${s.beforeSymbol})</span>`;

            let afterCell;

            if (isCompleted) {
                // READ ONLY - just show the final badge, no pills
                afterCell = (s.afterSymbol === null)
                    ? '<span class="level-badge level-none">Not rated</span>'
                    : `<span class="level-badge level-${s.afterSymbol}">${LEVEL_LABELS[s.afterSymbol]} (${s.afterSymbol})</span>`;
            } else {
                let pills = '';
                [4, 3, 2, 1, 0].forEach(function (sym) {
                    const inputId = `after_${p.empCode}_${s.skillId}_${sym}`;
                    const checked = (s.afterSymbol === sym) ? 'checked' : '';
                    pills += `
                        <input type="radio" name="after_${p.empCode}_${s.skillId}" id="${inputId}" value="${sym}" ${checked}>
                        <label class="level-pill" for="${inputId}">${LEVEL_LABELS[sym]} (${sym})</label>
                    `;
                });
                afterCell = `<div class="level-pill-group">${pills}</div>`;
            }

            skillRows += `
                <tr data-emp-code="${p.empCode}" data-skill-id="${s.skillId}">
                    <td>${s.skillName}</td>
                    <td>${beforeLabel}</td>
                    <td>${afterCell}</td>
                </tr>
            `;
        });

        html += `
            <div class="participant-block">
                <h6>${p.name} (${p.empCode}) — ${p.designation}</h6>
                <table class="table table-sm mb-0">
                    <thead><tr><th>Skill</th><th>Before</th><th>After</th></tr></thead>
                    <tbody>${skillRows}</tbody>
                </table>
            </div>
        `;
    });

    $('#participantBlocksContainer').html(html);
}


function addParticipant() {

    const empCode = $('#participantEmpCodeInput').val().trim();
    $('#participantAddError').hide();

    if (!empCode) return;

    $.ajax({
        url: baseUrl1 + '/api/empperf/trng-master/' + newTrngId + '/participants',
        type: 'POST',
        contentType: 'application/json',
        xhrFields: { withCredentials: true },
        data: JSON.stringify({ empCodes: [empCode] }),
        success: function (response) {

            if (response.notFound.includes(empCode)) {
                $('#participantAddError').text('Employee not found').show();
                return;
            }
            if (response.alreadyAdded.includes(empCode)) {
                $('#participantAddError').text('Already added').show();
                return;
            }

            $('#participantEmpCodeInput').val('');
            refreshParticipantList();
        },
        error: function (xhr) {
            $('#participantAddError').text(xhr.responseText || 'Error adding participant').show();
        }
    });
}


$(document).ready(function () {

    $('#addParticipantBtn').on('click', function () {

        const empCode = $('#eligibleEmpSelect').val();
        $('#addParticipantError').hide();

        if (!empCode) {
            $('#addParticipantError').text('Select an employee first').show();
            return;
        }

        $.ajax({
            url: baseUrl1 + '/api/empperf/trng-master/' + activeManageTrngId + '/participants',
            type: 'POST',
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            data: JSON.stringify({ empCodes: [empCode] }),
            success: function () {
                loadEligibleEmployees(activeManageTrngId);
                loadParticipantBlocks(activeManageTrngId);
            },
            error: function (xhr) {
                $('#addParticipantError').text(xhr.responseText || 'Error adding employee').show();
            }
        });
    });


    $('#saveRatingsBtn').on('click', function () {

        const ratings = [];
        $('#participantBlocksContainer tr[data-emp-code]').each(function () {

            const empCode = $(this).data('emp-code');
            const skillId = $(this).data('skill-id');
            const checked = $(this).find('input[type="radio"]:checked');

            if (checked.length > 0) {
                ratings.push({ empCode: empCode, skillId: skillId, afterSymbol: parseInt(checked.val()) });
            }
        });

        if (ratings.length === 0) {
            alert('Select at least one rating before saving');
            return;
        }

        $.ajax({
            url: baseUrl1 + '/api/empperf/trng-master/' + activeManageTrngId + '/rate',
            type: 'POST',
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            data: JSON.stringify({ ratings: ratings, modifiedBy: sessionStorage.getItem('id') }),
            success: function () {
                loadEligibleEmployees(activeManageTrngId);
                loadParticipantBlocks(activeManageTrngId);
                showPopup('Ratings saved');
            },
            error: function (xhr) { alert(xhr.responseText || 'Error saving ratings'); }
        });
    });


    $('#markCompleteBtn').on('click', function () {

        $.ajax({
            url: baseUrl1 + '/api/empperf/trng-master/' + activeManageTrngId + '/mark-complete',
            type: 'PUT',
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            data: JSON.stringify({
                certificateNo: $('#manageCertNo').val().trim(),
                modifiedBy: sessionStorage.getItem('id')
            }),
            success: function () {
                $('#trngManageModal').modal('hide');
                fetchTrainings();
                showPopup('Training marked Completed');
            },
            error: function (xhr) { alert(xhr.responseText || 'Error marking training complete'); }
        });
    });

});


async function refreshParticipantList() {
    const apiUrl = new URL('/api/empperf/trng-master/' + newTrngId + '/participants', baseUrl1);
    const response = await fetch(apiUrl, { credentials: "include" });
    const participants = await response.json();

    let rows = '';
    participants.forEach(function (p) {
        rows += `<tr><td>${p.empCode}</td><td>${p.name}</td><td>${p.designation}</td></tr>`;
    });
    $('#participantListTable tbody').html(rows);
}


async function fetchTrainings() {

    const apiUrl = new URL('/api/empperf/trng-master', baseUrl1);
    const response = await fetch(apiUrl, { credentials: "include" });
    const trainings = await response.json();

    let rows = '';

    trainings.forEach(function (t, i) {

        const statusClass = t.status === 'Completed' ? 'status-completed'
            : t.status === 'Cancelled' ? 'status-cancelled' : 'status-planned';

     /*   rows += `
            <tr>
                <td>${i + 1}</td>
                <td>${t.title}</td>
                <td><span class="trainer-badge">${t.trainerName} (${t.trainerType})</span></td>
                <td>${t.trngDate}</td>
                <td><span class="status-badge ${statusClass}">${t.status}</span></td>
                <td>
                    <button class="btn btn-sm" onclick="openManageModal(${t.id}, '${t.title}')">
                        <i class="fas fa-users-cog"></i> Manage
                    </button>
                </td>
            </tr>`;*/
			
			
			rows += `
			    <tr>
			        <td>${i + 1}</td>
			        <td>${t.title}</td>
			        <td><span class="trainer-badge">${t.trainerName} (${t.trainerType})</span></td>
			        <td>${t.trngDate}</td>
			        <td><span class="status-badge ${statusClass}">${t.status}</span></td>
			        <td>
			            <button class="btn btn-sm" onclick="openManageModal(${t.id}, '${t.title}', '${t.status}')">
			                <i class="fas fa-${t.status === 'Completed' ? 'eye' : 'users-cog'}"></i>
			                ${t.status === 'Completed' ? 'View' : 'Manage'}
			            </button>
			        </td>
			    </tr>`;
    });
	
	

    $('#tableTrng tbody').html(rows);

    if ($.fn.DataTable.isDataTable('#tableTrng')) $('#tableTrng').DataTable().destroy();
    $('#tableTrng').DataTable({ dom: 'Bfrtip', paging: true, pageLength: 10,
        buttons: [{ extend: 'excel', text: 'Export to Excel', title: 'Training List' }] });
}


let completeTrngId = null;

async function openCompleteModal(trngId, title) {

    completeTrngId = trngId;
    $('#completeTrngTitle').text(title);

    const apiUrl = new URL('/api/empperf/trng-master/' + trngId + '/participants', baseUrl1);
    const response = await fetch(apiUrl, { credentials: "include" });
    const participants = await response.json();

    let rows = '';
    participants.forEach(function (p) {
        p.skills.forEach(function (s) {

            const beforeLabel = (s.beforeSymbol === null) ? 'Not rated' : `${LEVEL_LABELS[s.beforeSymbol]} (${s.beforeSymbol})`;

            let options = '<option value="">Select</option>';
            [4, 3, 2, 1, 0].forEach(function (sym) {
                options += `<option value="${sym}">${LEVEL_LABELS[sym]} (${sym})</option>`;
            });

            rows += `
                <tr data-emp-code="${p.empCode}" data-skill-id="${s.skillId}">
                    <td>${p.name} (${p.empCode})</td>
                    <td>${s.skillName}</td>
                    <td>${beforeLabel}</td>
                    <td><select class="form-control form-control-sm after-select">${options}</select></td>
                </tr>`;
        });
    });

    $('#completeGridTable tbody').html(rows);
    $('#trngCompleteModal').modal('show');
}


function submitCompletion() {

    const ratings = [];
    $('#completeGridTable tbody tr').each(function () {
        const empCode = $(this).data('emp-code');
        const skillId = $(this).data('skill-id');
        const val = $(this).find('.after-select').val();
        if (val !== '') ratings.push({ empCode: empCode, skillId: skillId, afterSymbol: parseInt(val) });
    });

    if (ratings.length === 0) { alert('Enter at least one after-rating'); return; }

    $.ajax({
        url: baseUrl1 + '/api/empperf/trng-master/' + completeTrngId + '/complete',
        type: 'POST',
        contentType: 'application/json',
        xhrFields: { withCredentials: true },
        data: JSON.stringify({
            ratings: ratings,
            certificateNo: $('#completeCertNo').val().trim(),
            modifiedBy: sessionStorage.getItem('id')
        }),
        success: function () {
            $('#trngCompleteModal').modal('hide');
            fetchTrainings();
            showPopup('Training marked Completed');
        },
        error: function (xhr) {
            alert(xhr.responseText || 'Error completing training');
        }
    });
}


function showPopup(message) {
    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
    setTimeout(function () { popup.fadeOut(400, function () { $(this).remove(); }); }, 2000);
}