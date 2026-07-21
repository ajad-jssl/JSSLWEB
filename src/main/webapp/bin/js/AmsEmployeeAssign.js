document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();

    
});


const MainPage =  window.location.pathname.split("/").pop()+'.jsp';
const UserId = sessionStorage.getItem('username');


let allowedActions = [];

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
            {
                method: "GET",
                credentials: "include", // 🔐 send cookies/session
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


document.getElementById("modalScroll1").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}
	$('#exampleModalScrollable123').modal('show');
})

// ===================== Load Contracts =====================
$(document).ready(function () {
	
/*	$('#contract').select2({
	    placeholder: "Select Contract",
	    allowClear: true,
	    width: '100%',
	    dropdownParent: $('#exampleModalScrollable123')
	});
	
	$('#department').select2({
	    placeholder: "Select Department",
	    allowClear: true,
	    width: '100%',
	    dropdownParent: $('#exampleModalScrollable123')
	});

	 $('#employee').select2({
	     placeholder: "Select Employee",
	     allowClear: true,
	     width: '100%',
	     dropdownParent: $('#exampleModalScrollable123')
	 });
	 */
	
	 initUniversalSelect2($('#exampleModalScrollable123'));
	 
    loadContracts();
    loadDepartments();
	loadMappings(loadEmployeeAssignTable);
});

// Load Contract List
function loadContracts() {
    $.ajax({
        url: `${baseUrl}/api/contract/getAll`,
        method: "GET",
        xhrFields: { withCredentials: true },
        success: function (data) {
            const dropdown = $("#contract");

            // 🔥 Empty option ONLY for placeholder (hidden)
           dropdown.html(`<option value=" ">Select Contract</option>`);

            $.each(data, function (i, contract) {
                let desc = contract.description || "";
                let text = contract.jobCode + (desc ? " - " + desc : "");
                dropdown.append(new Option(text, contract.contractId));
            });

            dropdown.val(null).trigger('change');
        }
    });
}


// ===================== Load Departments =====================
function loadDepartments() {
    $.ajax({
        url: `${baseUrl}/api/dept/getAll`,
        type: "GET",
        xhrFields: { withCredentials: true },
        success: function (data) {

            const dropdown = $("#department");

            // 🔥 This line is CRITICAL
          dropdown.html(`<option value=" ">Select Department</option>`);

            data.forEach(dept => {
                dropdown.append(
                    new Option(dept.departmentName, dept.deptId)
                );
            });

            // 🔥 Force NO default selection
            dropdown.val(null).trigger('change');
        }
    });
}



// ===================== Filter Employees Based on Department =====================
$("#department").change(function () {
    let deptId = $(this).val();
    let empDropdown = $("#employee");

    empDropdown.html(`<option value=" ">Select Employee</option>`);

    if (!deptId) return;

    $.ajax({
        url: `${baseUrl}/api/user/getAll`,
        type: "GET",
        xhrFields: { withCredentials: true }, // ✅ include credentials
        success: function(data) {
            $.each(data, function (i, user) {
                if (user.department == deptId) {
                    empDropdown.append(`<option value="${user.id}">${user.userName}</option>`);
                }
            });
			dropdown.trigger('change');
        },
        error: function() {
            console.log("Error loading users");
        }
    });
});






$("#submitemployeeAssign").click(function () {

        let contract = $("#contract").val().trim();
        let dept = $("#department").val().trim();
        let emp = $("#employee").val().trim();

        // Remove previous error display
        $(".text-danger").remove();

        let isValid = true;

        if (contract === "") {
            $("#contract").after("<span class='text-danger'>Please select contract</span>");
            isValid = false;
        }
        if (dept === "") {
            $("#department").after("<span class='text-danger'>Please select department</span>");
            isValid = false;
        }
        if (emp === "") {
            $("#employee").after("<span class='text-danger'>Please select employee</span>");
            isValid = false;
        }

        if (!isValid) return;   // Stop if any is empty

        // Open CONFIRMATION modal
        $("#exampleModalCenter325").modal("show");

    });

	
	$("#confirmassignyes").click(function (){
		
		
		
		$("#exampleModalCenter325").modal("hide");
		
		
		insertEmployeeAssign();
	});

	
	async function checkDuplicateAssign(conid, did, empCode) {
	    try {
			const response = await fetch(`${baseUrl}/api/assign/getAll`,{credentials:"include"});
	        const data = await response.json();

	        // Check if same contract + department + employee already exists
	        return data.some(item => 
	            item.conid == conid && 
	            item.did == did && 
	            item.employee_code == empCode
	        );
	    } catch (e) {
	        console.error("Duplicate check failed", e);
	        return false; 
	    }
	}
	
	
	async function insertEmployeeAssign() {
	    let conid = $("#contract").val();
	    let did = $("#department").val();
	    let empCode = $("#employee").val();
	    const currentDateTimeString = getIndianDateTimeFormat(new Date());

	    // ⚠️ Check Duplicate BEFORE Posting
	    const isDuplicate = await checkDuplicateAssign(conid, did, empCode);
	    if (isDuplicate) {
	        // Set the message dynamically
	        $("#errorMessagecon").text("Employee is already assigned to this contract");
	        // Show the modal
	        $("#exampleModalCenterDupcon").modal("show");
	        return; // ❌ Stop insertion
	    }

	    let payload = {
	        conid: conid,
	        did: did,
	        employee_code: empCode,
	        created_by: sessionStorage.getItem("id"),
	        created_date: currentDateTimeString,
	        modified_by: null,
	        modified_date: null
	    };

	    $.ajax({
			url: `${baseUrl}/api/assign`,
	        type: "POST",
	        data: JSON.stringify(payload),
	        contentType: "application/json",
			xhrFields: { withCredentials: true },
	        success: function (response) {
	            showPopup("Employee Assign is Successfully","AmsEmployeeAssign.jsp")
	            loadEmployeeAssignTable();
	            console.log(response);
	        },
	        error: function () {
	            alert("Failed to save data!");
	        }
	    });
	}


	
	
	
	let contractsMap = {};
	let employeesMap = {}; // Map user id → userId string

	// Fetch contracts and employees first
	function loadMappings(callback) {
	    $.when(
	        $.ajax({
	            url: `${baseUrl}/api/contract/getAll`,
	            type: "GET",
	            dataType: "json",
	            xhrFields: { withCredentials: true }, // ✅ include credentials
	            success: function(data) {
	                // Map contractId → "jobCode - description"
	                data.forEach(c => {
	                    let description = c.description ? c.description : "";
	                    contractsMap[c.contractId] = `${c.jobCode} - ${description}`;
	                });
	            },
	            error: function(err) {
	                console.error("Error loading contracts:", err);
	            }
	        }),
	        $.ajax({
	            url: `${baseUrl}/api/user/getAll`,
	            type: "GET",
	            dataType: "json",
	            xhrFields: { withCredentials: true }, // ✅ include credentials
	            success: function(data) {
	                // Map employee_code → userId
	                data.forEach(e => employeesMap[e.id] = e.userId);
	            },
	            error: function(err) {
	                console.error("Error loading users:", err);
	            }
	        })
	    ).done(function() {
	        callback();
	    });
	}

	// Fetch assignments and render table
	function loadEmployeeAssignTable() {
	    $.ajax({
			url: `${baseUrl}/api/assign/getAll`,
	        type: "GET",
	        contentType: "application/json",
			xhrFields: { withCredentials: true },
	        success: function(response) {
	            // Destroy existing DataTable if exists
	            if ($.fn.DataTable.isDataTable('#table_EmployeeAssign')) {
	                $('#table_EmployeeAssign').DataTable().clear().destroy();
	            }

	            let table = $('#table_EmployeeAssign').DataTable({
	                dom: '<"d-flex justify-content-between mb-2"Bf>rtip', // ip for pagination and info
	                buttons: [
	                    {
	                        extend: 'excelHtml5',
	                        text: 'Export to Excel',
	                        className: 'btn btn-primary btn-sm',
	                        title: 'Employee_Assignment_Report',
	                        filename: 'Employee_Assignment_Report'
	                    }
	                ],
	                paging: true,
	                pageLength: 10,
	                lengthChange: true,
	                info: true,
	                searching: true,
	                ordering: true,
	                data: response.map((item, index) => [
	                    index + 1,
	                    contractsMap[item.conid] || "--------",
	                    employeesMap[item.employee_code] || "------",
	                    `<i class="fas fa-trash delete-icon" style="color: red; cursor: pointer;" title="Delete" id="delete" data-id="${item.atid}"></i>`
	                ]),
	                columnDefs: [
	                    { targets: 3, orderable: false } // disable sorting on actions column
	                ]
	            });

	            // Delete handler
	            $('#table_EmployeeAssign tbody').off('click', '.delete-icon').on('click', '.delete-icon', function() {
	                let id = $(this).data('id');
	                deleteEmployeeAssign(id);
	            });
	        },
	        error: function(err) {
	            console.error("Failed to fetch employee assignments", err);
	        }
	    });
	}


	let deleteId = null; // store the selected assignment id

	function deleteEmployeeAssign(id) {
		  const allowed =allowedActions || [];

		if (!allowed.includes("Delete")) {
		  alert(" You do not have permission to delete.");
		  $('#deleteConfirmModal').modal('hide');
		  return;
		}
	    deleteId = id;               // store id when clicked
	    $("#deleteConfirmModal").modal("show"); // show confirmation modal
	}

	// Handle Yes click
	$("#confirmDeleteBtn").click(async function() {
	    if (!deleteId) return;

	    try {
			await fetch(`${baseUrl}/api/assign/${deleteId}`, {
	            method: 'DELETE',
				credentials:"include"
	        });

	        $("#deleteConfirmModal").modal("hide");
			
			
			     showPopup("Employee Assign is Successfully Removed","AmsEmployeeAssign.jsp")	                // refresh table
	        deleteId = null;                        // reset id
	   
	    } catch (err) {
	        console.error(err);
	        alert("Failed to delete assignment!");
	    }
	});
	
	
	
	function initUniversalSelect2(parentModal = null) {
	    $('.universal-select').each(function () {
	        const $el = $(this);

	        // Prevent re-initialization
	        if ($el.hasClass('select2-hidden-accessible')) return;

	        $el.select2({
	            placeholder: $el.data('placeholder') || 'Select',
	            allowClear: true,
	            width: '100%',
	            dropdownParent: parentModal || $(document.body)
	        });
	    });
	}
	



	function getIndianDateTimeFormat(date) {
	    const options = {
	        timeZone: 'Asia/Kolkata',
	        hour12: false,
	    };
	    const istDate = new Date(date.toLocaleString('en-US', options));
	    return `${istDate.getFullYear()}-${(istDate.getMonth() + 1).toString().padStart(2, '0')}-${istDate.getDate().toString().padStart(2, '0')}T${istDate.getHours().toString().padStart(2, '0')}:${istDate.getMinutes().toString().padStart(2, '0')}:${istDate.getSeconds().toString().padStart(2, '0')}`;
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

