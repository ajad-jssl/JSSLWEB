// ==============================
// EMPLOYEE SKILL ENTRY - FRONTEND
// Endpoints:
//   GET  /api/empperf/employee-skill/lookup/{empCode}
//   POST /api/empperf/employee-skill
// ==============================

const LEVEL_LABELS = { 4: 'Expert', 3: 'Proficient', 2: 'Demonstrating', 1: 'Basic', 0: 'None' };

let currentEmpCode = null;
let currentSkills = []; // cached from last lookup, re-used to build modal + summary

$(document).ready(function () {

    $('#empSearchBtn').on('click', searchEmployee);

    $('#empCodeInput').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            searchEmployee();
        }
    });

    $('#openRateModalBtn').on('click', openRateModal);

    $('#submitRatingsBtn').on('click', validateAndConfirm);

    $('#confirmSaveRatingsYes').on('click', saveRatings);
});


async function searchEmployee() {

    const empCode = $('#empCodeInput').val().trim();

    $('#empCodeError').hide();
    $('#empResultSection').hide();

    if (empCode === '') {
        $('#empCodeError').text('Employee Code is required').show();
        $('#empCodeInput').focus();
        return;
    }

    try {

        const apiUrl = new URL('/api/empperf/employee-skill/lookup/' + encodeURIComponent(empCode), baseUrl1);

        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });

        if (!response.ok) {
            $('#empCodeError').text('Employee not found').show();
            return;
        }

        const data = await response.json();

        currentEmpCode = data.empCode;
        currentSkills = data.skills || [];

        renderEmployeeProfile(data);
        renderSummaryTable(currentSkills);

        $('#empResultSection').fadeIn(200);

    } catch (error) {
        console.error('Error looking up employee:', error);
        $('#empCodeError').text('Error looking up employee').show();
    }
}


function renderEmployeeProfile(data) {

    const initials = (data.name || '?')
        .split(' ')
        .map(function (w) { return w.charAt(0); })
        .slice(0, 2)
        .join('')
        .toUpperCase();

    $('#empAvatarInitials').text(initials || '?');
    $('#empNameDisplay').text(data.name || '-');
    $('#empCodeDisplay').text(data.empCode || '-');
    $('#empDesgDisplay').text(data.designation || '-');
    $('#modalEmpName').text(data.name || '');
}


function renderSummaryTable(skills) {

    updateOverallPerformance(skills);

    if (skills.length === 0) {

        $('#skillSummaryTable').hide();

        $('#openRateModalBtn').prop('disabled', true);

        $('#noSkillsMessage').show();

        return;
    }

    $('#skillSummaryTable').show();

    $('#openRateModalBtn').prop('disabled', false);

    $('#noSkillsMessage').hide();

    let rows = '';

    skills.forEach(function (skill) {

        const badge = (skill.symbol === null || skill.symbol === undefined)

            ? '<span class="level-badge level-none">Not rated</span>'

            : `<span class="level-badge level-${skill.symbol}">
                    ${LEVEL_LABELS[skill.symbol]} (${skill.symbol})
               </span>`;

        rows += `
            <tr>

                <td>${skill.skillName}</td>

                <td>
                    ${badge}
                </td>

            </tr>
        `;
    });

    $('#skillSummaryTable tbody').html(rows);
}



function updateOverallPerformance(skills) {

    const totalSkills = skills.length;

    // Only include skills which have a rating
    const ratedSkills = skills.filter(function (skill) {

        return skill.symbol !== null &&
               skill.symbol !== undefined &&
               !isNaN(Number(skill.symbol));

    });

    const ratedCount = ratedSkills.length;

    $('#totalSkillCount').text(totalSkills);

    $('#ratedSkillCount').text(ratedCount);


    // No rated skills
    if (ratedCount === 0) {

        $('#overallAverage').text('0.00');

        $('#overallGrade').text('-');

        $('#overallGradeDescription').text('No skills rated');

        $('#overallProgressBar').css('width', '0%');

        return;
    }


    // Calculate total
    let total = 0;

    ratedSkills.forEach(function (skill) {

        total += Number(skill.symbol);

    });


    // Calculate average
    const average = total / ratedCount;

    const roundedAverage = average.toFixed(2);


    // Get grade
    const gradeInfo = getOverallGrade(average);


    // Display values
    $('#overallAverage').text(roundedAverage);

    $('#overallGrade').text(gradeInfo.grade);

    $('#overallGradeDescription').text(gradeInfo.description);


    // Progress percentage
    const percentage = (average / 4) * 100;

    $('#overallProgressBar').css(
        'width',
        percentage + '%'
    );
}


function getOverallGrade(average) {

    if (average >= 3.50) {

        return {
            grade: 'A+',
            description: 'Outstanding'
        };

    }

    if (average >= 3.00) {

        return {
            grade: 'A',
            description: 'Excellent'
        };

    }

    if (average >= 2.50) {

        return {
            grade: 'B+',
            description: 'Very Good'
        };

    }

    if (average >= 2.00) {

        return {
            grade: 'B',
            description: 'Good'
        };

    }

    if (average >= 1.50) {

        return {
            grade: 'C+',
            description: 'Developing'
        };

    }

    return {
        grade: 'C',
        description: 'Needs Improvement'
    };
}

function openRateModal() {

    let rows = '';

    currentSkills.forEach(function (skill) {

        let pills = '';

        [4, 3, 2, 1, 0].forEach(function (sym) {

            const inputId = `lvl_${skill.skillId}_${sym}`;
            const checked = (skill.symbol === sym) ? 'checked' : '';

            pills += `
                <input type="radio" name="level_${skill.skillId}" id="${inputId}" value="${sym}" ${checked}>
                <label class="level-pill" for="${inputId}">${LEVEL_LABELS[sym]} (${sym})</label>
            `;
        });

        rows += `
            <tr data-skill-id="${skill.skillId}">
                <td>${skill.skillName}</td>
                <td>
                    <div class="level-pill-group">${pills}</div>
                </td>
            </tr>
        `;
    });

    $('#rateSkillTable tbody').html(rows);
    $('#rateSkillsModal').modal('show');
}


function validateAndConfirm() {

    const ratings = collectRatings();

    if (ratings.length === 0) {
        alert('Select at least one skill level before saving');
        return;
    }

    $('#rateSkillsModal').modal('hide');
    $('#confirmSaveRatingsModal').modal('show');
}


function collectRatings() {

    const ratings = [];

    $('#rateSkillTable tbody tr').each(function () {

        const skillId = $(this).data('skill-id');
        const checkedInput = $(this).find('input[type="radio"]:checked');

        if (checkedInput.length > 0) {
            ratings.push({ skillId: skillId, symbol: parseInt(checkedInput.val(), 10) });
        }
    });

    return ratings;
}


function saveRatings() {

    const ratings = collectRatings();

    $('#confirmSaveRatingsModal').modal('hide');

    $.ajax({

        url: baseUrl1 + '/api/empperf/employee-skill',
        type: 'POST',
        contentType: 'application/json',
        xhrFields: { withCredentials: true },

        data: JSON.stringify({
            empCode: currentEmpCode,
            ratings: ratings,
            modifiedBy: sessionStorage.getItem('id')
        }),

        success: function () {

            // Refresh in place (re-lookup so the summary reflects the just-saved values)
            $('#empCodeInput').val(currentEmpCode);
            searchEmployee();

            showPopup('Skill ratings saved successfully');
        },

        error: function (xhr) {
            console.error('Error saving ratings:', xhr.responseText);
            alert(xhr.responseText || 'Error saving skill ratings');
        }
    });
}


function showPopup(message) {
    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
    setTimeout(function () {
        popup.fadeOut(400, function () { $(this).remove(); });
    }, 2000);
}