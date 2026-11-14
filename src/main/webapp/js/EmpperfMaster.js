// ==============================
// SKILL MASTER + SKILL MAPPING - FRONTEND
// Endpoints confirmed against SkillController / SkillMappingController:
//   GET    /api/empperf/skill
//   GET    /api/empperf/skill/{id}
//   POST   /api/empperf/skill
//   PUT    /api/empperf/skill/{id}
//   GET    /api/empperf/skill-mapping
//   GET    /api/empperf/skill-mapping/{id}
//   POST   /api/empperf/skill-mapping
//   PUT    /api/empperf/skill-mapping/{id}
// All calls go through baseUrl1 - kept consistent across create/read/update.
// Assumes baseUrl1 / showPopup() are already defined (js/config.js).
// ==============================

document.getElementById("skillcrt").addEventListener("click", function() {
    // Open the "Create Skill" modal
    $('#exampleModalScrollableIN').modal('show');
});


$(document).ready(function() {

    // ==============================
    // LOAD SKILLS ON PAGE LOAD
    // ==============================

    fetchSkillType();


    // ==============================
    // CREATE SKILL
    // ==============================

    $('#skillregtype').on('click', function() {

        const skillType = $('#skilltype').val().trim();

        $('#skilltypeError').hide();

        if (skillType === '') {
            $('#skilltypeError').text('Skill is required').show();
            $('#skilltype').focus();
            return;
        }

        $('#exampleModalScrollableIN').modal('hide');
        $('#exampleModalCenter80').modal('show');
    });


    // ==============================
    // CONFIRM CREATE
    // ==============================

    $('#confirmregYes').on('click', function() {

        const skillType = $('#skilltype').val().trim();

        $('#exampleModalCenter80').modal('hide');

        $.ajax({

            url: baseUrl1 + '/api/empperf/skill',
            type: 'POST',
            contentType: 'application/json',
            xhrFields: { withCredentials: true },

            data: JSON.stringify({
                skillName: skillType,
                status: false,
                createdBy: sessionStorage.getItem('id')
            }),

            success: function(response) {

                console.log('Skill created successfully', response);

                $('#skilltype').val('');
                fetchSkillType();

                showPopup('Skill created successfully', 'EmpperfMaster.jsp');
            },

            error: function(xhr, status, error) {

                console.error("HTTP Status:", xhr.status);
                console.error("Response:", xhr.responseText);
                console.error("Error:", error);

                if (xhr.status === 409) {
                    $("#duplicateTypeMessage").text(xhr.responseText || "Duplicate Enter ");
                    $("#duplicateTypeModal").modal("show");
                    return;
                }

                if (xhr.status === 400) {
                    $("#duplicateTypeMessage").text(xhr.responseText || "Duplicate Enter ");
                    $("#duplicateTypeModal").modal("show");
                    return;
                }

                alert(xhr.responseText || "Error creating Skill");
            }

        });

    });


    // ==============================
    // CLEAR MODAL WHEN CLOSED
    // ==============================

    $('#exampleModalScrollableIN').on('hidden.bs.modal', function() {
        $('#skilltypeError').hide();
    });

});


async function fetchSkillType() {

    const apiUrl = new URL('/api/empperf/skill', baseUrl1);

    try {

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Skills");
        }

        const skills = await response.json();

        let tableRows = '';

        for (let index = 0; index < skills.length; index++) {

            const item = skills[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.skillName}</td>
                    <td>
                        <i class="fa fa-pen text-primary cursor-pointer"
                           title="Edit"
                           style="cursor:pointer;"
                           onclick="editSkill(${item.id})">
                        </i>
                    </td>
                </tr>
            `;
        }

        document.querySelector("#tableskill tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableskill')) {
            $('#tableskill').DataTable().destroy();
        }

        $('#tableskill').DataTable({
            dom: 'Bfrtip',
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
                title: 'Skill List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Skills:', error);
    }
}

let selectedSkillId = null;
let originalSkillName = '';

async function editSkill(id) {

    try {

        const apiUrl = new URL(`/api/empperf/skill/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Skill");
        }

        const data = await response.json();

        selectedSkillId = data.id;
        originalSkillName = data.skillName.trim();

        $('#skilltype1').val(data.skillName);
        $('#skilltype1Error').hide();

        $('#exampleModalScrollableINUp').modal('show');

    } catch (error) {
        console.error("Error fetching Skill:", error);
        alert("Unable to fetch Skill");
    }
}

$('#skillupd').on('click', function() {

    const currentSkill = $('#skilltype1').val().trim();

    $('#skilltype1Error').hide();

    if (currentSkill === '') {
        $('#skilltype1Error').text('Skill is required').show();
        $('#skilltype1').focus();
        return;
    }

    if (currentSkill === originalSkillName) {
        showPopup('No Fields are changes', 'EmpperfMaster.jsp');
        return;
    }

    $('#exampleModalScrollableINUp').modal('hide');
    $('#exampleModalCenter75').modal('show');

});


$('#confirmregtypeupd').on('click', function() {

    const currentSkill = $('#skilltype1').val().trim();

    $('#exampleModalCenter75').modal('hide');

    $.ajax({

        url: baseUrl1 + '/api/empperf/skill/' + selectedSkillId,
        type: 'PUT',
        contentType: 'application/json',
        xhrFields: { withCredentials: true },

        data: JSON.stringify({
            skillName: currentSkill,
            modifiedBy: sessionStorage.getItem('id')
        }),

        success: function(response) {

            console.log('Skill updated successfully', response);

            $('#exampleModalScrollableINUp').modal('hide');
            $('#skilltype1').val('');

            fetchSkillType();

            showPopup('Skill updated successfully', 'EmpperfMaster.jsp');
        },

        error: function(xhr, status, error) {

            console.error("HTTP Status:", xhr.status);
            console.error("Response:", xhr.responseText);
            console.error("Error:", error);

            if (xhr.status === 409) {
                $("#duplicateTypeMessage").text(xhr.responseText || "Duplicate Enter ");
                $("#duplicateTypeModal").modal("show");
                return;
            }

            if (xhr.status === 400) {
                $("#duplicateTypeMessage").text(xhr.responseText || "Duplicate Enter ");
                $("#duplicateTypeModal").modal("show");
                return;
            }

            if (xhr.status === 404) {
                alert(xhr.responseText || "Skill not found");
                return;
            }

            if (xhr.status === 500) {
                alert(xhr.responseText || "Error updating Skill");
                return;
            }

            alert(xhr.responseText || "Error updating Skill");
        }

    });

});


document.getElementById("skillmappingcrt").addEventListener("click", function () {

    resetSkillMappingForm();

    Promise.all([
       // fetchDepartmentsForMapping(),
        fetchDesignationsForMapping(),
        fetchSkillsForMapping()
    ]).then(function () {
        $('#exampleModalScrollableMAP').modal('show');
    });

});


// ==============================
// RESET FORM
// ==============================

function resetSkillMappingForm() {

   // $('#mapDepartment').val('');
    $('#mapDesignation').val('');

    $('#mapSkillsCheckboxList').empty();
    $('#mapSkillsDropdownLabel').text('Select Skills');

   // $('#mapDepartmentError').hide();
    $('#mapDesignationError').hide();
    $('#mapSkillsError').hide();
}


// ==============================
// FETCH DEPARTMENTS
// GET api/websmartuser/getAllUniqueDepartment
// Response: [{ department_name, dept_id, deptCode }]
// Value sent to backend = deptCode
// Accepts an optional target selector so the same function can
// populate either the Create modal or the Edit modal.
// ==============================

async function fetchDepartmentsForMapping(targetSelector = '#mapDepartment') {

    try {

        const apiUrl = new URL('api/websmartuser/getAllUniqueDepartment', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Departments");
        }

        const departments = await response.json();

        let options = '<option value="" selected disabled>Select Department</option>';

        departments.forEach(function (dept) {
            options += `<option value="${dept.deptCode}" data-dept-id="${dept.dept_id}">${dept.department_name}</option>`;
        });

        $(targetSelector).html(options);

    } catch (error) {

        console.error('Error fetching Departments:', error);
        $(targetSelector).html('<option value="" selected disabled>Unable to load Departments</option>');
    }
}


// ==============================
// FETCH DESIGNATIONS
// GET api/websmartuser/getAllUniqueDesignation
// Response: [{ desgcode, designation }]
// Value sent to backend = desgcode
// ==============================

async function fetchDesignationsForMapping(targetSelector = '#mapDesignation') {

    try {

        const apiUrl = new URL('api/websmartuser/getAllUniqueDesignation', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Designations");
        }

        const designations = await response.json();

        let options = '<option value="" selected disabled>Select Designation</option>';

        designations.forEach(function (desg) {
            options += `<option value="${desg.desgcode}">${desg.designation}</option>`;
        });

        $(targetSelector).html(options);

    } catch (error) {

        console.error('Error fetching Designations:', error);
        $(targetSelector).html('<option value="" selected disabled>Unable to load Designations</option>');
    }
}


// ==============================
// FETCH SKILLS (checkbox list)
// GET api/empperf/skill
// Response: [{ id, skillName, status, ... }]
// Value sent to backend = id
// ==============================

async function fetchSkillsForMapping(targetSelector = '#mapSkillsCheckboxList', checkboxClass = 'skill-checkbox') {

    try {

        const apiUrl = new URL('api/empperf/skill', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Skills");
        }

        const skills = await response.json();
        const idPrefix = targetSelector.replace('#', '') + 'Chk';

        let checkboxHtml = '';

        skills.forEach(function (skill) {
            checkboxHtml += `
                <div class="form-check">
                    <input class="form-check-input ${checkboxClass}" type="checkbox"
                        value="${skill.id}" data-skill-name="${skill.skillName}"
                        id="${idPrefix}${skill.id}">
                    <label class="form-check-label" for="${idPrefix}${skill.id}">
                        ${skill.skillName}
                    </label>
                </div>
            `;
        });

        $(targetSelector).html(checkboxHtml);

    } catch (error) {

        console.error('Error fetching Skills:', error);
        $(targetSelector).html('<div class="text-danger small">Unable to load Skills</div>');
    }
}


$(document).ready(function () {

    // ==============================
    // KEEP DROPDOWN OPEN WHILE CHECKING SKILLS
    // ==============================

    $(document).on('click', '#mapSkillsDropdownMenu', function (e) {
        e.stopPropagation();
    });


    // ==============================
    // UPDATE DROPDOWN LABEL ON CHECKBOX CHANGE
    // ==============================

    $(document).on('change', '.skill-checkbox', function () {

        const checked = $('.skill-checkbox:checked');

        if (checked.length === 0) {
            $('#mapSkillsDropdownLabel').text('Select Skills');
        } else if (checked.length === 1) {
            $('#mapSkillsDropdownLabel').text(checked.first().data('skill-name'));
        } else {
            $('#mapSkillsDropdownLabel').text(checked.length + ' Skills selected');
        }

        if (checked.length > 0) {
            $('#mapSkillsError').hide();
        }
    });


    // ==============================
    // CREATE SKILL MAPPING - VALIDATION
    // ==============================

    $('#skillmappingregtype').on('click', function () {

       // const department = $('#mapDepartment').val();
        const designation = $('#mapDesignation').val();
        const selectedSkills = $('.skill-checkbox:checked');

      //  $('#mapDepartmentError').hide();
        $('#mapDesignationError').hide();
        $('#mapSkillsError').hide();

        let valid = true;

      /*  if (!department) {
            $('#mapDepartmentError').text('Department is required').show();
            valid = false;
        }*/

        if (!designation) {
            $('#mapDesignationError').text('Designation is required').show();
            valid = false;
        }

        if (selectedSkills.length === 0) {
            $('#mapSkillsError').text('At least one Skill is required').show();
            valid = false;
        }

        if (!valid) {
            return;
        }

        $('#exampleModalScrollableMAP').modal('hide');
        $('#exampleModalCenter81').modal('show');
    });


    // ==============================
    // CONFIRM CREATE SKILL MAPPING
    // ==============================

    $('#confirmskillmapYes').on('click', function () {

      //  const department = $('#mapDepartment').val();
        const designation = $('#mapDesignation').val();

        const selectedSkillIds = $('.skill-checkbox:checked')
            .map(function () {
                return $(this).val();
            })
            .get();

        $('#exampleModalCenter81').modal('hide');

        $.ajax({

            url: baseUrl1 + '/api/empperf/skill-mapping',
            type: 'POST',
            contentType: 'application/json',
            xhrFields: { withCredentials: true },

            data: JSON.stringify({
              //  deptCode: department,
                desgCode: designation,
                skillIds: selectedSkillIds,
                createdBy: sessionStorage.getItem('id')
            }),

            success: function (response) {

                console.log('Skill Mapping created successfully', response);

                resetSkillMappingForm();
                fetchSkillMappingTable();

                showPopup('Skill Mapping created successfully', 'EmpperfMaster.jsp');
            },

            error: function (xhr, status, error) {

                console.error('Error creating Skill Mapping:', xhr.responseText);

                if (xhr.status === 409) {
                    $("#duplicateTypeMessage").text(xhr.responseText || "Duplicate Skill Mapping");
                    $("#duplicateTypeModal").modal("show");
                    return;
                }

                alert(xhr.responseText || 'Error creating Skill Mapping');
            }

        });

    });

});


let skillMappingCache = { departments: [], designations: [] };

// ==============================
// LOAD & RENDER THE TABLE
// GET api/empperf/skill-mapping
// ==============================
/*async function fetchSkillMappingTable() {

    try {

        const [deptRes, desgRes, mapRes] = await Promise.all([
            fetch(new URL('api/websmartuser/getAllUniqueDepartment', baseUrl1), { credentials: "include" }),
            fetch(new URL('api/websmartuser/getAllUniqueDesignation', baseUrl1), { credentials: "include" }),
            fetch(new URL('api/empperf/skill-mapping', baseUrl1), { credentials: "include" })
        ]);

        const departments = await deptRes.json();
        const designations = await desgRes.json();
        const mappings = await mapRes.json();

        skillMappingCache.departments = departments;
        skillMappingCache.designations = designations;

        const deptNameByCode = {};
        departments.forEach(d => deptNameByCode[d.deptCode] = d.department_name);

        const desgNameByCode = {};
        designations.forEach(d => desgNameByCode[d.desgcode] = d.designation);

        const tbody = $('#tableskillmapping tbody');
        tbody.empty();

		mappings.forEach(function (row, idx) {

		    const deptName = deptNameByCode[row.deptCode] || row.deptCode;

		    const desgName = desgNameByCode[row.desgCode] || row.desgCode;

		    const skillsText = (row.skills || [])
		        .map(skill => skill.skillName)
		        .join(', ');

		    tbody.append(`
		        <tr>
		            <td>${idx + 1}</td>
		            <td>${deptName}</td>
		            <td>${desgName}</td>
		            <td>${skillsText}</td>
		            <td>
		                <button class="btn btn-sm btn-primary edit-skillmapping-btn"
		                        data-id="${row.id}">
		                    <i class="fas fa-edit"></i>
		                </button>
		            </td>
		        </tr>
		    `);
		});

    } catch (error) {
        console.error('Error loading Skill Mapping table:', error);
    }
}*/



async function fetchSkillMappingTable() {

    const desgUrl = new URL('api/websmartuser/getAllUniqueDesignation', baseUrl1);
    const mapUrl = new URL('api/empperf/skill-mapping', baseUrl1);

    try {

        const [desgRes, mapRes] = await Promise.all([
            fetch(desgUrl, { method: "GET", credentials: "include" }),
            fetch(mapUrl, { method: "GET", credentials: "include" })
        ]);

        if (!desgRes.ok || !mapRes.ok) {
            throw new Error("Failed to fetch Skill Mapping data");
        }

        const designations = await desgRes.json();
        const mappings = await mapRes.json();

        const desgNameByCode = {};

        designations.forEach(function (d) {
            desgNameByCode[d.desgcode] = d.designation;
        });

        let tableRows = '';

        for (let index = 0; index < mappings.length; index++) {

            const row = mappings[index];

            const desgName = desgNameByCode[row.desgCode] || row.desgCode;

            const skillsText = (row.skills || [])
                .map(function (skill) {
                    return skill.skillName;
                })
                .join(', ');

            tableRows += `
                <tr id="${row.id}">
                    <td>${index + 1}</td>
                    <td>${desgName}</td>
                    <td>${skillsText}</td>
                    <td>
                        <i class="fa fa-pen text-primary cursor-pointer"
                           title="Edit"
                           style="cursor:pointer;"
                           onclick="editSkillMapping(${row.id})">
                        </i>
                    </td>
                </tr>
            `;
        }

        document.querySelector("#tableskillmapping tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableskillmapping')) {
            $('#tableskillmapping').DataTable().destroy();
        }

        $('#tableskillmapping').DataTable({
            dom: 'Bfrtip',
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
                title: 'Skill Mapping List'
            }]
        });

    } catch (error) {
        console.error('Error loading Skill Mapping table:', error);
    }
}


// ==============================
// OPEN EDIT MODAL
// GET api/empperf/skill-mapping/{id}
// ==============================

async function editSkillMapping(id) {

    resetSkillMappingEditForm();

    try {

        await Promise.all([
            // fetchDepartmentsForMapping('#mapDepartmentEdit'),   // removed - Department disabled for now
            fetchDesignationsForMapping('#mapDesignationEdit'),
            fetchSkillsForMapping('#mapSkillsCheckboxListEdit', 'edit-skill-checkbox')
        ]);

        const apiUrl = new URL('api/empperf/skill-mapping/' + id, baseUrl1);
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });

        if (!response.ok) {
            throw new Error("Failed to fetch Skill Mapping");
        }

        const mapping = await response.json();

        // $('#mapDepartmentEdit').val(mapping.deptCode);   // removed - Department disabled for now
        $('#mapDesignationEdit').val(mapping.desgCode);
        $('#editSkillMappingId').val(mapping.id);

        const activeSkillIds = (mapping.skillIds || []).map(String);

        $('.edit-skill-checkbox').each(function () {
            if (activeSkillIds.includes($(this).val())) {
                $(this).prop('checked', true);
            }
        });
        updateEditSkillsLabel();

        $('#exampleModalScrollableMAPUp').modal('show');

    } catch (error) {
        console.error('Error opening Edit Skill Mapping:', error);
        alert('Unable to load this Skill Mapping for editing');
    }
}


function resetSkillMappingEditForm() {
  //  $('#mapDepartmentEdit').val('');
    $('#mapDesignationEdit').val('');
    $('#mapSkillsCheckboxListEdit').empty();
    $('#mapSkillsDropdownLabelEdit').text('Select Skills');
    $('#editSkillMappingId').val('');

  //  $('#mapDepartmentEditError').hide();
    $('#mapDesignationEditError').hide();
    $('#mapSkillsEditError').hide();
}


function updateEditSkillsLabel() {
    const checked = $('.edit-skill-checkbox:checked');

    if (checked.length === 0) {
        $('#mapSkillsDropdownLabelEdit').text('Select Skills');
    } else if (checked.length === 1) {
        $('#mapSkillsDropdownLabelEdit').text(checked.first().data('skill-name'));
    } else {
        $('#mapSkillsDropdownLabelEdit').text(checked.length + ' Skills selected');
    }

    if (checked.length > 0) {
        $('#mapSkillsEditError').hide();
    }
}


$(document).ready(function () {

    $(document).on('click', '#mapSkillsDropdownMenuEdit', function (e) {
        e.stopPropagation();
    });

    $(document).on('change', '.edit-skill-checkbox', updateEditSkillsLabel);


    // ==============================
    // EDIT SKILL MAPPING - VALIDATION
    // ==============================
    $(document).on('click', '#skillmappingedittype', function () {

     //   const department = $('#mapDepartmentEdit').val();
        const designation = $('#mapDesignationEdit').val();
        const selectedSkills = $('.edit-skill-checkbox:checked');

     //  $('#mapDepartmentEditError').hide();
        $('#mapDesignationEditError').hide();
        $('#mapSkillsEditError').hide();

        let valid = true;
/*
        if (!department) {
            $('#mapDepartmentEditError').text('Department is required').show();
            valid = false;
        }*/

        if (!designation) {
            $('#mapDesignationEditError').text('Designation is required').show();
            valid = false;
        }

        if (selectedSkills.length === 0) {
            $('#mapSkillsEditError').text('At least one Skill is required').show();
            valid = false;
        }

        if (!valid) {
            return;
        }

        $('#exampleModalScrollableMAPUp').modal('hide');
        $('#exampleModalCenter82').modal('show');
    });


    // ==============================
    // CONFIRM UPDATE SKILL MAPPING
    // PUT api/empperf/skill-mapping/{id}
    // ==============================
/*    $(document).on('click', '#confirmskillmapUpdateYes', function () {

        const id = $('#editSkillMappingId').val();
        const department = $('#mapDepartmentEdit').val();
        const designation = $('#mapDesignationEdit').val();

        const selectedSkillIds = $('.edit-skill-checkbox:checked')
            .map(function () { return $(this).val(); })
            .get();

        $('#exampleModalCenter82').modal('hide');

        $.ajax({

            url: baseUrl1 + '/api/empperf/skill-mapping/' + id,
            type: 'PUT',
            contentType: 'application/json',
            xhrFields: { withCredentials: true },

            data: JSON.stringify({
                deptCode: department,
                desgCode: designation,
                skillIds: selectedSkillIds,
                modifiedBy: sessionStorage.getItem('id')
            }),

            success: function (response) {
                console.log('Skill Mapping updated successfully', response);
                resetSkillMappingEditForm();
                fetchSkillMappingTable();
                showPopup('Skill Mapping updated successfully', 'EmpperfMaster.jsp');
            },

            error: function (xhr, status, error) {

                console.error('Error updating Skill Mapping:', xhr.responseText);

                if (xhr.status === 409) {
                    $("#duplicateTypeMessage").text(xhr.responseText || "Duplicate Skill Mapping");
                    $("#duplicateTypeModal").modal("show");
                    return;
                }

                if (xhr.status === 404) {
                    alert(xhr.responseText || "Skill Mapping not found");
                    return;
                }

                alert(xhr.responseText || 'Error updating Skill Mapping');
            }

        });

    });*/
	
	$(document).on('click', '#confirmskillmapUpdateYes', function () {

	    const id = $('#editSkillMappingId').val();
	    // const department = $('#mapDepartmentEdit').val();  // removed
	    const designation = $('#mapDesignationEdit').val();

	    const selectedSkillIds = $('.edit-skill-checkbox:checked')
	        .map(function () { return $(this).val(); })
	        .get();

	    $('#exampleModalCenter82').modal('hide');

	    $.ajax({
	        url: baseUrl1 + '/api/empperf/skill-mapping/' + id,
	        type: 'PUT',
	        contentType: 'application/json',
	        xhrFields: { withCredentials: true },

	        data: JSON.stringify({
	            // deptCode: department,   // removed
	            desgCode: designation,
	            skillIds: selectedSkillIds,
	            modifiedBy: sessionStorage.getItem('id')
	        }),

	        success: function (response) {
	            console.log('Skill Mapping updated successfully', response);
	            resetSkillMappingEditForm();
	            fetchSkillMappingTable();
	            showPopup('Skill Mapping updated successfully', 'EmpperfMaster.jsp');
	        },

	        error: function (xhr) {
	            console.error('Error updating Skill Mapping:', xhr.responseText);
	            if (xhr.status === 409) {
	                $("#duplicateTypeMessage").text(xhr.responseText || "Duplicate Skill Mapping");
	                $("#duplicateTypeModal").modal("show");
	                return;
	            }
	            if (xhr.status === 404) {
	                alert(xhr.responseText || "Skill Mapping not found");
	                return;
	            }
	            alert(xhr.responseText || 'Error updating Skill Mapping');
	        }
	    });
	});


    // Load the table once, and again whenever the Skill-Mapping tab is shown
    $('#skillmappingRadio').on('change', function () {
        if (this.checked) {
            fetchSkillMappingTable();
        }
    });

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










// ==============================
// SKILL LEVEL MASTER - FRONTEND
// Endpoints (mirrors SkillController pattern):
//   GET    /api/empperf/skill-level
//   GET    /api/empperf/skill-level/{id}
//   POST   /api/empperf/skill-level
//   PUT    /api/empperf/skill-level/{id}
// ==============================

document.getElementById("skilltab").addEventListener("click", function() {
    $('#exampleModalScrollable123').modal('show');
});


$(document).ready(function() {

    // ==============================
    // LOAD SKILL LEVELS ON PAGE LOAD
    // ==============================

    fetchSkillLevel();


    // ==============================
    // CREATE SKILL LEVEL - VALIDATION
    // ==============================

    $('#skillcreate').on('click', function() {

        const level = $('#level').val().trim();
        const symbol = $('#symbol').val().trim();
        const description = $('#Description').val().trim();

        $('#levelError').hide();
        $('#SymbolError').hide();
        $('#DescriptionError').hide();

        let valid = true;

        if (level === '') {
            $('#levelError').text('Level is required').show();
            valid = false;
        }

        if (symbol === '') {
            $('#SymbolError').text('Symbol is required').show();
            valid = false;
        }

        if (description === '') {
            $('#DescriptionError').text('Description is required').show();
            valid = false;
        }

        if (!valid) {
            return;
        }

        $('#exampleModalScrollable123').modal('hide');
        $('#exampleModal12').modal('show');
    });


    // ==============================
    // CONFIRM CREATE
    // ==============================

    $('#confirm').on('click', function() {

        const level = $('#level').val().trim();
        const symbol = $('#symbol').val().trim();
        const description = $('#Description').val().trim();

        $('#exampleModal12').modal('hide');

        $.ajax({

            url: baseUrl1 + '/api/empperf/skill-level',
            type: 'POST',
            contentType: 'application/json',
            xhrFields: { withCredentials: true },

            data: JSON.stringify({
                levelName: level,
                symbol: symbol,
                description: description,
                status: false,
                createdBy: sessionStorage.getItem('id')
            }),

            success: function(response) {

                console.log('Skill Level created successfully', response);

                $('#level').val('');
                $('#symbol').val('');
                $('#Description').val('');

                fetchSkillLevel();

                showPopup('Skill Level created successfully', 'EmpperfMaster.jsp');
            },

            error: function(xhr, status, error) {

                console.error("HTTP Status:", xhr.status);
                console.error("Response:", xhr.responseText);
                console.error("Error:", error);

                if (xhr.status === 409 || xhr.status === 400) {
                    $("#duplicateTypeMessage").text(xhr.responseText || "Duplicate Enter");
                    $("#duplicateTypeModal").modal("show");
                    return;
                }

                alert(xhr.responseText || "Error creating Skill Level");
            }

        });

    });


    // ==============================
    // CLEAR MODAL WHEN CLOSED
    // ==============================

    $('#exampleModalScrollable123').on('hidden.bs.modal', function() {
        $('#levelError').hide();
        $('#SymbolError').hide();
        $('#DescriptionError').hide();
    });

});


async function fetchSkillLevel() {

    const apiUrl = new URL('/api/empperf/skill-level', baseUrl1);

    try {

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Skill Levels");
        }

        const levels = await response.json();

        let tableRows = '';

        for (let index = 0; index < levels.length; index++) {

            const item = levels[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.levelName}</td>
                    <td>${item.symbol}</td>
                    <td>${item.description}</td>
                    <td>
                        <i class="fa fa-pen text-primary cursor-pointer"
                           title="Edit"
                           style="cursor:pointer;"
                           onclick="editSkillLevel(${item.id})">
                        </i>
                    </td>
                </tr>
            `;
        }

        document.querySelector("#skilltabopen tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#skilltabopen')) {
            $('#skilltabopen').DataTable().destroy();
        }

        $('#skilltabopen').DataTable({
            dom: 'Bfrtip',
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
                title: 'Skill Level List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Skill Levels:', error);
    }
}


let selectedSkillLevelId = null;
let originalSkillLevel = { level: '', symbol: '', description: '' };

async function editSkillLevel(id) {

    try {

        const apiUrl = new URL(`/api/empperf/skill-level/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Skill Level");
        }

        const data = await response.json();

        selectedSkillLevelId = data.id;

        originalSkillLevel = {
            level: (data.levelName || '').trim(),
            symbol: String(data.symbol || '').trim(),
            description: (data.description || '').trim()
        };

        $('#editSkilllevelMappingId').val(data.id);
        $('#levelEdit').val(data.levelName);
        $('#symbolEdit').val(data.symbol);
        $('#DescriptionEdit').val(data.description);

        $('#levelEditError').hide();
        $('#SymbolEditError').hide();
        $('#DescriptionEditError').hide();

        $('#exampleModalScrollable123Up').modal('show');

    } catch (error) {
        console.error("Error fetching Skill Level:", error);
        alert("Unable to fetch Skill Level");
    }
}


$('#skillUpdate').on('click', function() {

    const level = $('#levelEdit').val().trim();
    const symbol = $('#symbolEdit').val().trim();
    const description = $('#DescriptionEdit').val().trim();

    $('#levelEditError').hide();
    $('#SymbolEditError').hide();
    $('#DescriptionEditError').hide();

    let valid = true;

    if (level === '') {
        $('#levelEditError').text('Level is required').show();
        valid = false;
    }

    if (symbol === '') {
        $('#SymbolEditError').text('Symbol is required').show();
        valid = false;
    }

    if (description === '') {
        $('#DescriptionEditError').text('Description is required').show();
        valid = false;
    }

    if (!valid) {
        return;
    }

    if (level === originalSkillLevel.level &&
        symbol === originalSkillLevel.symbol &&
        description === originalSkillLevel.description) {

        showPopup('No Fields are changes', 'EmpperfMaster.jsp');
        return;
    }

    $('#exampleModalScrollable123Up').modal('hide');
    $('#exampleModalCenter12').modal('show');

});


$('#confirmUP').on('click', function() {

    const level = $('#levelEdit').val().trim();
    const symbol = $('#symbolEdit').val().trim();
    const description = $('#DescriptionEdit').val().trim();

    $('#exampleModalCenter12').modal('hide');

    $.ajax({

        url: baseUrl1 + '/api/empperf/skill-level/' + selectedSkillLevelId,
        type: 'PUT',
        contentType: 'application/json',
        xhrFields: { withCredentials: true },

        data: JSON.stringify({
            levelName: level,
            symbol: symbol,
            description: description,
            modifiedBy: sessionStorage.getItem('id')
        }),

        success: function(response) {

            console.log('Skill Level updated successfully', response);

            fetchSkillLevel();

            showPopup('Skill Level updated successfully', 'EmpperfMaster.jsp');
        },

        error: function(xhr, status, error) {

            console.error("HTTP Status:", xhr.status);
            console.error("Response:", xhr.responseText);
            console.error("Error:", error);

            if (xhr.status === 409 || xhr.status === 400) {
                $("#duplicateTypeMessage").text(xhr.responseText || "Duplicate Enter");
                $("#duplicateTypeModal").modal("show");
                return;
            }

            if (xhr.status === 404) {
                alert(xhr.responseText || "Skill Level not found");
                return;
            }

            alert(xhr.responseText || "Error updating Skill Level");
        }

    });

});








// ==============================
// TRAINER MASTER (Internal + External)
// Endpoints:
//   GET  /api/empperf/trng-trainer
//   GET  /api/empperf/trng-trainer/{id}
//   GET  /api/empperf/trng-trainer/employee-lookup/{empCode}
//   POST /api/empperf/trng-trainer
//   PUT  /api/empperf/trng-trainer/{id}
// ==============================

let resolvedInternalEmpName = null;

document.getElementById("extTrainerCrt").addEventListener("click", function () {

    // reset the form to a clean state every time it opens
    $('#extTrainerForm')[0].reset();
    $('#typeExternal').prop('checked', true);
    $('#internalFieldsBlock').hide();
    $('#externalFieldsBlock').show();
    $('#internalEmpNameDisplay').text('');
    $('.error-message').hide();
    resolvedInternalEmpName = null;

    $('#extTrainerCreateModal').modal('show');
});


$(document).ready(function () {

    fetchExtTrainers();


    // ==============================
    // TOGGLE FIELDS BASED ON TYPE
    // ==============================
    $('input[name="trainerTypeRadio"]').on('change', function () {

        const isInternal = $('#typeInternal').is(':checked');

        $('#internalFieldsBlock').toggle(isInternal);
        $('#externalFieldsBlock').toggle(!isInternal);
        $('.error-message').hide();
    });


    // ==============================
    // LOOKUP EMPLOYEE (Internal only)
    // ==============================
    $('#internalEmpLookupBtn').on('click', async function () {

        const empCode = $('#internalEmpCode').val().trim();

        $('#internalEmpCodeError').hide();
        resolvedInternalEmpName = null;
        $('#internalEmpNameDisplay').text('');

        if (empCode === '') {
            $('#internalEmpCodeError').text('Enter an Employee Code').show();
            return;
        }

        try {
            const apiUrl = new URL('/api/empperf/trng-trainer/employee-lookup/' + encodeURIComponent(empCode), baseUrl1);
            const response = await fetch(apiUrl, { method: "GET", credentials: "include" });

            if (!response.ok) {
                $('#internalEmpCodeError').text('Employee not found').show();
                return;
            }

            const data = await response.json();
            resolvedInternalEmpName = data.name;
            $('#internalEmpNameDisplay').text(data.name);

        } catch (error) {
            console.error('Error looking up employee:', error);
            $('#internalEmpCodeError').text('Error looking up employee').show();
        }
    });


    // ==============================
    // CREATE - VALIDATION
    // ==============================
    $('#extTrainerSaveBtn').on('click', function () {

        const isInternal = $('#typeInternal').is(':checked');

        $('.error-message').hide();

        if (isInternal) {

            if (!resolvedInternalEmpName) {
                $('#internalEmpCodeError').text('Look up a valid Employee Code first').show();
                return;
            }

        } else {

            const trainerName = $('#trainerName').val().trim();

            if (trainerName === '') {
                $('#trainerNameError').text('Trainer Name is required').show();
                $('#trainerName').focus();
                return;
            }
        }

        $('#extTrainerCreateModal').modal('hide');
        $('#extTrainerConfirmCreate').modal('show');
    });


    // ==============================
    // CONFIRM CREATE
    // ==============================
    $('#extTrainerConfirmCreateYes').on('click', function () {

        const isInternal = $('#typeInternal').is(':checked');

        $('#extTrainerConfirmCreate').modal('hide');

        const payload = isInternal
            ? {
                trainerType: 'Internal',
                empCode: $('#internalEmpCode').val().trim(),
                createdBy: sessionStorage.getItem('id')
            }
            : {
                trainerType: 'External',
                trainerName: $('#trainerName').val().trim(),
                organization: $('#organization').val().trim(),
                contactNo: $('#contactNo').val().trim(),
                email: $('#email').val().trim(),
                createdBy: sessionStorage.getItem('id')
            };

        $.ajax({
            url: baseUrl1 + '/api/empperf/trng-trainer',
            type: 'POST',
            contentType: 'application/json',
            xhrFields: { withCredentials: true },

            data: JSON.stringify(payload),

            success: function () {

                $('#extTrainerForm')[0].reset();
                $('#internalEmpNameDisplay').text('');
                resolvedInternalEmpName = null;

                fetchExtTrainers();

                showPopup('Trainer added successfully', 'EmpperfMaster.jsp');
            },

            error: function (xhr) {
                if (xhr.status === 400) {
                    $("#duplicateTypeMessage").text(xhr.responseText || "Duplicate Entry");
                    $("#duplicateTypeModal").modal("show");
                    return;
                }
                alert(xhr.responseText || 'Error adding Trainer');
            }
        });
    });


    $('#extTrainerCreateModal').on('hidden.bs.modal', function () {
        $('.error-message').hide();
    });

});


async function fetchExtTrainers() {

    const apiUrl = new URL('/api/empperf/trng-trainer', baseUrl1);

    try {
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });

        if (!response.ok) throw new Error("Failed to fetch Trainers");

        const trainers = await response.json();

        let tableRows = '';

        for (let index = 0; index < trainers.length; index++) {

            const item = trainers[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.trainerType}</td>
                    <td>${item.trainerName}</td>
                    <td>${item.organization || '-'}</td>
                    <td>${item.contactNo || '-'}</td>
                    <td>${item.email || '-'}</td>
                    <td>
                        <i class="fa fa-pen text-primary cursor-pointer"
                           title="Edit" style="cursor:pointer;"
                           onclick="editExtTrainer(${item.id})">
                        </i>
                    </td>
                </tr>
            `;
        }

        document.querySelector("#tableExtTrainer tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableExtTrainer')) {
            $('#tableExtTrainer').DataTable().destroy();
        }

        $('#tableExtTrainer').DataTable({
            dom: 'Bfrtip',
            scrollX: false,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{ extend: 'excel', text: 'Export to Excel', title: 'Trainer List' }]
        });

    } catch (error) {
        console.error('Error fetching Trainers:', error);
    }
}


let selectedExtTrainerId = null;
let originalExtTrainer = { trainerName: '', organization: '', contactNo: '', email: '' };

async function editExtTrainer(id) {

    try {
        const apiUrl = new URL(`/api/empperf/trng-trainer/${id}`, baseUrl1);
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });

        if (!response.ok) throw new Error("Failed to fetch Trainer");

        const data = await response.json();

        selectedExtTrainerId = data.id;
        $('#editExtTrainerId').val(data.id);
        $('#editTrainerType').val(data.trainerType);

        const isInternal = data.trainerType === 'Internal';

        $('#internalEditBlock').toggle(isInternal);
        $('#externalEditBlock').toggle(!isInternal);
        $('#extTrainerUpdateBtn').toggle(!isInternal);   // nothing to save for Internal

        if (isInternal) {

            $('#internalEditEmpCode').text(data.empCode);
            $('#internalEditEmpName').text(data.trainerName);

        } else {

            originalExtTrainer = {
                trainerName: (data.trainerName || '').trim(),
                organization: (data.organization || '').trim(),
                contactNo: (data.contactNo || '').trim(),
                email: (data.email || '').trim()
            };

            $('#trainerNameEdit').val(data.trainerName);
            $('#organizationEdit').val(data.organization);
            $('#contactNoEdit').val(data.contactNo);
            $('#emailEdit').val(data.email);
        }

        $('.error-message').hide();

        $('#extTrainerUpdateModal').modal('show');

    } catch (error) {
        console.error('Error fetching Trainer:', error);
        alert('Unable to fetch Trainer');
    }
}


$('#extTrainerUpdateBtn').on('click', function () {

    const trainerName = $('#trainerNameEdit').val().trim();
    const organization = $('#organizationEdit').val().trim();
    const contactNo = $('#contactNoEdit').val().trim();
    const email = $('#emailEdit').val().trim();

    $('#trainerNameEditError').hide();

    if (trainerName === '') {
        $('#trainerNameEditError').text('Trainer Name is required').show();
        $('#trainerNameEdit').focus();
        return;
    }

    if (trainerName === originalExtTrainer.trainerName &&
        organization === originalExtTrainer.organization &&
        contactNo === originalExtTrainer.contactNo &&
        email === originalExtTrainer.email) {

        showPopup('No Fields are changed', 'EmpperfMaster.jsp');
        return;
    }

    $('#extTrainerUpdateModal').modal('hide');
    $('#extTrainerConfirmUpdate').modal('show');
});


$('#extTrainerConfirmUpdateYes').on('click', function () {

    const trainerName = $('#trainerNameEdit').val().trim();
    const organization = $('#organizationEdit').val().trim();
    const contactNo = $('#contactNoEdit').val().trim();
    const email = $('#emailEdit').val().trim();

    $('#extTrainerConfirmUpdate').modal('hide');

    $.ajax({
        url: baseUrl1 + '/api/empperf/trng-trainer/' + selectedExtTrainerId,
        type: 'PUT',
        contentType: 'application/json',
        xhrFields: { withCredentials: true },

        data: JSON.stringify({
            trainerType: 'External',
            trainerName: trainerName,
            organization: organization,
            contactNo: contactNo,
            email: email,
            modifiedBy: sessionStorage.getItem('id')
        }),

        success: function () {
            fetchExtTrainers();
            showPopup('Trainer updated successfully', 'EmpperfMaster.jsp');
        },

        error: function (xhr) {
            if (xhr.status === 400) {
                $("#duplicateTypeMessage").text(xhr.responseText || "Duplicate Entry");
                $("#duplicateTypeModal").modal("show");
                return;
            }
            alert(xhr.responseText || 'Error updating Trainer');
        }
    });
});