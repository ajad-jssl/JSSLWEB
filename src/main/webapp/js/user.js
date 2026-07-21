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






//role dropdown
let originalUserData = {};


document.addEventListener("DOMContentLoaded", function() {
	loadActions();
    // Populate dropdowns after DOM is ready
    getStateList();      // Role dropdown
    fetchUserList();     // User list table + reportTo dropdowns
	fetchReportToUsers();
    loadDepartments();   // Department dropdown
    loadLocationToDropdown(); // Location dropdown
});

document.addEventListener("DOMContentLoaded", function () {
	$("#statusRemarks").on("input", function () {
	    $(this).removeClass("is-invalid");
	    $("#remarksError").hide();
	});
	
	document.getElementById("#modalScroll").addEventListener("click", function () {
	    // show custom message instead of opening modal
		  const allowed =allowedActions || [];

		if (!allowed.includes("Insert")) {
		  alert(" You do not have permission to Insert.");
		  $('#exampleModalScrollable').modal('hide');
		  return;
		}
		$('#exampleModalScrollable').modal('show');
	});
/*	$('#statusModal').on('hidden.bs.modal', function () {

	    if (statusConfirmed) {
	        statusConfirmed = false;
	        $("#statusUserId").val('');
	        return; // ✅ Do NOT revert checkbox
	    }

	    const userId = $("#statusUserId").val();
	    if (!userId) return;

	    const checkbox = $(`.inactiveCheckbox[data-userid='${userId}']`);
	    const previousState = checkbox.data("previous-state");

	    checkbox.prop("checked", previousState);

	    $("#statusUserId").val('');
	});*/
	
	
	$("#statusModal").on("hidden.bs.modal", function () {

	    if (!statusConfirmed) {
	        const userId = $("#statusUserId").val();

	        const checkbox = $(`.inactiveCheckbox[data-userid='${userId}']`);

	        const previousState = checkbox.data("previous-state");

	        if (previousState !== undefined) {
	            checkbox.prop("checked", previousState);
	        }
	    }

	    statusConfirmed = false;
	});
    loadFactories();
});

function loadFactories(selectedValue = null) {
    fetch(new URL('/jssl/factory/getAllFactoryList', baseUrl1), {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        const selects = [
            document.getElementById('factory'),
            document.getElementById('factoryup')
        ];

        selects.forEach(select => {
            if (!select) return;

            select.innerHTML = `
                <option value="">Select factory</option>
                <option value="all">ALL</option>
            `;

            if (Array.isArray(data.FactoryDetails)) {
                data.FactoryDetails.forEach(f => {
                    const opt = document.createElement('option');
                    opt.value = String(f.id);
                    opt.textContent = f.factory_name;
                    select.appendChild(opt);
                });
            }

            // ✅ set value AFTER options exist
            if (selectedValue !== null) {
                select.value = String(selectedValue);
            }
        });
    })
    .catch(err => console.error("Factory load error:", err));
}

// Departments
function loadDepartments() {
    fetch(new URL("/api/departments", baseUrl1), {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        const deptCreate = document.getElementById("department");
        const deptUpdate = document.getElementById("department1");
        [deptCreate, deptUpdate].forEach(select => {
            select.innerHTML = '<option value="">Select Department</option>';
            data.forEach(item => {
                const opt = document.createElement("option");
                opt.value = item.deptId;
                opt.textContent = item.departmentName;
                select.appendChild(opt);
            });
            select.disabled = false;
        });
    })
    .catch(err => console.error("Error loading departments:", err));
}

// Locations
function loadLocationToDropdown() {
    fetch(new URL("/api/location/getAll", baseUrl), { credentials: "include" })
        .then(res => res.json())
        .then(data => {
            const locCreate = document.getElementById("location");
            const locUpdate = document.getElementById("locationUp");
            [locCreate, locUpdate].forEach(select => {
                select.innerHTML = '<option value="">Select Location</option>';
                data.Data.forEach(item => {
                    const opt = document.createElement("option");
                    opt.value = item.Loc_id;
                    opt.textContent = item.Location;
                    select.appendChild(opt);
                });
                select.disabled = false;
            });
        })
        .catch(err => console.error("Error loading locations:", err));
}

function getStateList() {
	
    //const url = new URL('http://localhost:8089/jssl/role/getAllRoles');
	const url = new URL(`/jssl/role/getAllRoles`, baseUrl);

  fetch(url, { credentials: "include" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.DistrictDetails) {
                const stateSelect = $("#role1");

                // Clear any existing options
                stateSelect.empty();

                // Add a placeholder option
                let optionsHTML = '<option value="" selected>Select Role</option>';

                // Loop through each state and add as an option
                data.DistrictDetails.forEach(state => {
					console.log(state);
                    optionsHTML += `<option value="${state.role_id}">${state.role_name}</option>`;
                });

                // Append all options to the dropdown
                stateSelect.append(optionsHTML);
            } else {
                console.error("No data found in the response.");
            }
        })
        .catch(error => {
            console.error("Error fetching state details:", error);
        });
}



function fetchReportToUsers() {
    const reportToCreate = document.getElementById("Report_to");
    const reportToUpdate = document.getElementById("Report_toUp");

    [reportToCreate, reportToUpdate].forEach(select => {
        if (select) select.innerHTML = '<option value="">Select Report To</option>';
    });

    fetch(new URL(`/api/users`, baseUrl), { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) return;

            data.forEach(user => {
                const id = user.id || '';
                const username = user.username || 'N/A';

                if (id) {
                    const opt1 = document.createElement("option");
                    opt1.value = id;
                    opt1.textContent = username;
                    const opt2 = opt1.cloneNode(true);
                    reportToCreate && reportToCreate.appendChild(opt1);
                    reportToUpdate && reportToUpdate.appendChild(opt2);
                }
            });
        })
        .catch(error => console.error("Report To fetch error:", error));
}



function fetchUserList() {

/*    const reportToCreate = document.getElementById("Report_to");
    const reportToUpdate = document.getElementById("Report_toUp");

    [reportToCreate, reportToUpdate].forEach(select => {
        if (select) select.innerHTML = '<option value="">Select Report To</option>';
    });
*/
    // ✅ Call 1 — /user/listuser → dropdown only (all users, no pagination)
  /*  fetch(new URL(`/jssl/user/listuser`, baseUrl), { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (!json.Data || !Array.isArray(json.Data)) return;

            json.Data.forEach(user => {
                const id = user.id || '';
                const username = user.username || 'N/A';
                if (id) {
                    const opt1 = document.createElement("option");
                    opt1.value = id;
                    opt1.textContent = username;
                    const opt2 = opt1.cloneNode(true);
                    reportToCreate && reportToCreate.appendChild(opt1);
                    reportToUpdate && reportToUpdate.appendChild(opt2);
                }
            });
        })
        .catch(error => console.error("Dropdown fetch error:", error));*/

    //  Destroy existing DataTable
    if ($.fn.DataTable.isDataTable('#tableID')) {
        $('#tableID').DataTable().clear().destroy();
    }

    // ✅ Call 2 — /user/listuserss → paginated table only
    $('#tableID').DataTable({
        processing: true,
        serverSide: true,
        scrollX: true,
        searching: true,
        dom: 'Bfrtip',
		buttons: [
		    {
		        text: 'Export  Users',
		        action: function (e, dt, node, config) {

		            // Call API with size = 400
		            const url = new URL(`/jssl/user/listuserss`, baseUrl);
		            url.searchParams.append("page", 0);
		            url.searchParams.append("size", 400);

		            fetch(url, { credentials: "include" })
		                .then(response => response.json())
		                .then(json => {

		                    const exportData = json.Data.map(user => ({
		                        Username: user.username || 'N/A',
		                        Department: user.dept1 || 'N/A',
								FirstName:user.first_name ||  'N/A',
								LastName:user.last_name || 'N/A',
		                        Status: user.is_active ? 'Active' : 'Inactive'
		                    }));

		                    const worksheet = XLSX.utils.json_to_sheet(exportData);
		                    const workbook = XLSX.utils.book_new();
		                    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

		                    XLSX.writeFile(workbook, "User_List.xlsx");
		                });
		        }
		    }
		],
        columnDefs: [
            { targets: 2, visible: false }  // hide ID column
        ],
        ajax: function (data, callback, settings) {

            const page = data.start / data.length;
            const size = data.length;
			const searchValue = data.search.value;

            const url = new URL(`/jssl/user/listuserss`, baseUrl); // ✅ paginated endpoint
            url.searchParams.append("page", page);
            url.searchParams.append("size", size);
			url.searchParams.append('search', searchValue);

            fetch(url, { credentials: "include" })
                .then(response => response.json())
                .then(json => {
                    callback({
                        draw: data.draw,
                        recordsTotal: json.totalItems,
                        recordsFiltered: json.totalItems,
                        data: json.Data.map(user => [
                            user.username || 'N/A',           // col 0
                            user.dept1 || 'N/A',              // col 1
							
                            user.id || '',                     // col 2 - hidden
							user.first_name ||'N/A',
							user.last_name  || 'N/A',           
                            user.is_active                    // col 3 - Edit
                                ? `<i class="fa fa-pen" style="cursor:pointer; color:blue;" onclick="editRecord('${user.id}')"></i>`
                                : `<i class="fa fa-pen" style="color:gray; pointer-events:none; cursor:not-allowed;"></i>`,
                            `<input type="checkbox"
                                class="inactiveCheckbox"
                                data-userid="${user.id}"
                                ${!user.is_active ? "checked" : ""}>`,   // col 4
                            `<i class="fa fa-trash"
                                style="cursor:pointer; color:red;"
                                onclick="deleteRecord('${user.id}')"></i>` // col 5
                        ])
                    });
                })
                .catch(error => console.error("DataTable fetch error:", error));
        },
        drawCallback: function () {
			$(".inactiveCheckbox").off("change").on("change", function () {

			    const allowed = allowedActions || [];

			    console.log("allowed are ", allowed);

			    if (!allowed.includes("Status")) {

			        alert("You do not have permission to Change Status.");

			        // restore original state
			        this.checked = !this.checked;

			        return;
			    }

			    const checkbox = $(this);

			    const previousState = !this.checked;

			    checkbox.data("previous-state", previousState);

			    const userId = checkbox.data("userid");

			    const isChecked = this.checked;

			    $("#statusUserId").val(userId);

			    $("#statusAction").val(isChecked ? "deactivate" : "activate");

			    $("#statusRemarks").val("");

			    $("#statusModal").modal("show");
			});
        }
    });
}

let statusConfirmed = false;
 function SubmitRemark() {

    const remarks = $("#statusRemarks").val().trim();
    const remarksField = $("#statusRemarks");
    const errorField = $("#remarksError");

    remarksField.removeClass("is-invalid");
    errorField.hide();

    if (!remarks) {
        remarksField.addClass("is-invalid");
        errorField.show();
        return;
    }
	else{
		$("#statusModal").modal("hide");

		$("#confirmStatus").modal("show");
	}

	
}
let selectedDeleteId = null;

function deleteRecord(id){
		  const allowed = allowedActions || [];

	if (!allowed.includes("Delete")) {
	  alert(" You do not have permission to Delete.");
	  $('#deleteModal').modal('hide');
	  return;
	}
	/*alert("the delelted button is clicked");*/
	
	selectedDeleteId = id;
	$("#deleteModal").modal("show");
}

function SubmitDeleteRemark(){
	
	let delete_remark = $("#deleteRemarks").val().trim();
	
	if(!delete_remark){
		$("#deleteremarksError").show();
		
	}else{
		$("#deleteModal").modal("hide");
	$("#deleteremarksError").hide();
	$("#confirmDelete").modal("show");
	}
}



function deleteUser(){

    let delete_remark = $("#deleteRemarks").val().trim();
    let deletedby = sessionStorage.getItem("id");
    let deleteDate =getIndianDateTimeFormat(new Date());  // ISO format for Spring Boot

   // <-- Put your base URL

    fetch(`${baseUrl}/api/inactive/deleted/${selectedDeleteId}`, {
        method: "PUT",
		credentials: "include",  
        headers: {
            "Content-Type": "application/json",
			
        },
	
        body: JSON.stringify({
            deleteRemarks: delete_remark,
            deletedBy: deletedby,
            deletedDate: deleteDate
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Delete failed");
        }
        return response.text();
    })
    .then(data => {
        /*alert(data);
        $("#confirmDelete").modal("hide");
        location.reload();*/
		showPopup("User Status Successfully Changed","user.jsp");
		
		
		
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Deleted failed error");
    });
}





async function addStatus(){

    const remarks = $("#statusRemarks").val().trim();
    const userId = $("#statusUserId").val();

    try {

        const url = new URL(`/api/inactive/activated/${userId}`, baseUrl);

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                statusRemarks: remarks,
                modifiedBy: sessionStorage.getItem("id"),
                modifiedDate: getIndianDateTimeFormat(new Date())
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update status");
        }

        await response.json();

        statusConfirmed = true;

        $("#confirmStatus").modal("hide");
        $("#statusModal").modal("hide");

         showPopup("User Status Successfully Changed","user.jsp");

    } catch (error) {
        console.error(error);
        alert("Error updating status");
    }
}








function editRecord(id) {
	  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    // Hide all previous error messages
    [
        "usernameUpError","email1Error","first_nameUpError","last_nameUpError",
        "mobile_number1Error","department1Error","Report_toUpError","locationUpError","factoryupError"
    ].forEach(errId => {
        const el = document.getElementById(errId);
        if (el) el.style.display = "none";
    });

    const url = new URL(`/jssl/user/search`, baseUrl);
    url.searchParams.append("id", id);

    fetch(url, { credentials: "include" })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(response => {
            const status = response?.status;
            const data = response?.Data;

            if (status === "yes" && data) {
                // Store original values
				originalUserData = {
				    username: data?.username ?? '',
				    email: data?.email ?? '',
				    mobileNumber: data?.mobileNumber ?? '',
				    first_name: data?.first_name ?? '',
				    last_name: data?.last_name ?? '',
				    department: data?.department ?? '',
				    report_id: data?.report_id ?? '',
				    location: data?.location ?? '',
				    password: '', // leave empty initially
					factory_id: data?.factory_id ?? '',
				};
				console.log("the orginal data",originalUserData);

                // Prefill inputs
                $('#UsernameUp').val(data.username || '');
                $('#email1').val(data.email || '');
                $('#mobile_number1').val(data.mobileNumber || '');
                $('#first_nameUp').val(data.first_name || '');
                $('#last_nameUp').val(data.last_name || '');
                $('#vagid1').val(data.id || '');

                // Prefill dropdowns
				$('#department1').val(data.department ?? '');

				// Report To
				$('#Report_toUp').val(data.report_id ?? '');

				// Location
				$('#locationUp').val(data.location ?? '');
				$('#factoryup').val(data.factory_id ?? '');

                $('#exampleModalScrollableedit').modal('show');
            } else {
                alert("Data missing or status not yes.");
                console.error("Unexpected data format:", response);
            }
        })
		.catch(error => {
		    console.error("Error fetching user data:", error);
		    alert("An error occurred while fetching user details:\n" + JSON.stringify(error, null, 2));
		});;
}


// Reset form fields in the modal
function resetForm() {
    $('#productForm12')[0].reset();
    // Clear error messages
}


function reserCreatForm(){
	$("#productForm")[0].reset();
	
}
// end gst view

//update gst






function openModalupdate() {
    const valid = validateUserUpdateForm();
    console.log(valid);

    if (valid) {
        $('#exampleModalCenterupdate').modal('show');
    }
}
/*function validateUserUpdateForm() {
    let isValid = true;

    function showError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);

        if (!input || !error) {
            console.warn(`Missing element: ${inputId} / ${errorId}`);
            isValid = false;
            return;
        }

        if (input.value.trim() === "") {
            error.style.display = "block";
            isValid = false;
        } else {
            error.style.display = "none";
        }
    }

    showError("UsernameUp", "usernameUpError");
    showError("password1", "password1Error");
    showError("email1", "email1Error");
    showError("first_nameUp", "first_nameUpError");
    showError("last_nameUp", "last_nameUpError");
	showError("factoryup", "factoryupError");

    const mobile = document.getElementById("mobile_number1");
    const mobileError = document.getElementById("mobile_number1Error");
    if (!mobile || !mobileError || mobile.value.length !== 10) {
        mobileError && (mobileError.style.display = "block");
        isValid = false;
    } else {
        mobileError.style.display = "none";
    }

    const department = document.getElementById("department1");
    const departmentError = document.getElementById("department1Error");
    if (!department || department.value === "") {
        departmentError.style.display = "block";
        isValid = false;
    } else {
        departmentError.style.display = "none";
    }

    const reportTo = document.getElementById("Report_toUp");
    const reportToError = document.getElementById("Report_toUpError");
    if (!reportTo || reportTo.value === "") {
        reportToError.style.display = "block";
        isValid = false;
    } else {
        reportToError.style.display = "none";
    }

    const location = document.getElementById("locationUp");
    const locationError = document.getElementById("locationUpError");
    if (!location || location.value === "") {
        locationError.style.display = "block";
        isValid = false;
    } else {
        locationError.style.display = "none";
    }
    return isValid;
}*/




function validateUserUpdateForm() {
    let isValid = true;

    function showError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);

        if (!input || !error) {
            console.warn(`Missing element: ${inputId} / ${errorId}`);
            isValid = false;
            return;
        }

        if (input.value.trim() === "") {
            error.style.display = "block";
            isValid = false;
        } else {
            error.style.display = "none";
        }
    }

    showError("UsernameUp", "usernameUpError");
    showError("email1", "email1Error");
    showError("first_nameUp", "first_nameUpError");
    showError("last_nameUp", "last_nameUpError");
    showError("factoryup", "factoryupError");

    // ✅ OPTIONAL PASSWORD VALIDATION (NEW – SAFE ADDITION)
    const password = document.getElementById("password1");
    const passwordError = document.getElementById("password1Error");

    if (password && password.value.trim() !== "") {

        const value = password.value.trim();

        // Strong password rule (you can adjust if needed)
        const strongPasswordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!strongPasswordRegex.test(value)) {
            passwordError.style.display = "block";
            passwordError.innerText =
                "Password must be 8+ chars with Upper, Lower, Number & Special char.";
            isValid = false;
        } else {
            passwordError.style.display = "none";
        }
    } else {
        // If empty → allowed (since password update is optional)
        if (passwordError) passwordError.style.display = "none";
    }

    const mobile = document.getElementById("mobile_number1");
    const mobileError = document.getElementById("mobile_number1Error");
    if (!mobile || !mobileError || mobile.value.length !== 10) {
        mobileError && (mobileError.style.display = "block");
        isValid = false;
    } else {
        mobileError.style.display = "none";
    }

    const department = document.getElementById("department1");
    const departmentError = document.getElementById("department1Error");
    if (!department || department.value === "") {
        departmentError.style.display = "block";
        isValid = false;
    } else {
        departmentError.style.display = "none";
    }

    const reportTo = document.getElementById("Report_toUp");
    const reportToError = document.getElementById("Report_toUpError");
    if (!reportTo || reportTo.value === "") {
        reportToError.style.display = "block";
        isValid = false;
    } else {
        reportToError.style.display = "none";
    }

    const location = document.getElementById("locationUp");
    const locationError = document.getElementById("locationUpError");
    if (!location || location.value === "") {
        locationError.style.display = "block";
        isValid = false;
    } else {
        locationError.style.display = "none";
    }

    return isValid;
}



function togglePasswordUpdate() {
    const passwordInput = document.getElementById("password1");
    const eyeIcon = document.getElementById("eyeIconUpdate");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}
function confirmUpdate() {
$("#exampleModalCenterupdate").modal("hide");
$('#exampleModalScrollableedit').modal('hide');
    const currentData = {
        username: $('#UsernameUp').val().trim(),
        email: $('#email1').val().trim(),
        mobileNumber: $('#mobile_number1').val().trim(),
        first_name: $('#first_nameUp').val().trim(),
        last_name: $('#last_nameUp').val().trim(),
        department: $('#department1').val(),
        report_id: $('#Report_toUp').val(),
        location: $('#locationUp').val(),
        password: $('#password1').val().trim(),
		factory_id: $('#factoryup').val().trim()
    };

    //  Detect changes
    let changesDetected = false;
    for (let key in currentData) {
        if ((currentData[key] || "") !== (originalUserData[key] || "")) {
            changesDetected = true;
            break;
        }
    }

    if (!changesDetected) {
        showPopup("No Feilds Changes","user.jsp");
        return;
    }

    //  Detect what exactly changed
    const usernameChanged =
        currentData.username !== originalUserData.username;

    const emailChanged =
        currentData.email !== originalUserData.email;

    // Decide duplication check strategy
    if (usernameChanged || emailChanged) {
        checkDuplicateAndProceedForUpdate(
            currentData,
            usernameChanged,
            emailChanged
        );
    } else {
        // No username/email change → direct update
        updateUser(currentData);
    }
}



function checkDuplicateAndProceedForUpdate(data, usernameChanged, emailChanged) {

    const payload = {};
    if (usernameChanged) payload.username = data.username;
    if (emailChanged) payload.email = data.email;

    fetch(`${baseUrl}/jssl/check-username-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("HTTP error " + res.status);
        }
        return res.json();   // THIS WAS MISSING
    })
    .then(resp => {

        console.log("Duplicate check response:", resp);

        if (resp.status === "EMAIL_EXISTS") {
            showValidationModal("Email already exists.");
            return;
        }

        if (resp.status === "USERNAME_EXISTS") {
            showValidationModal("Username already exists.");
            return;
        }

        if (resp.status === "BOTH_EXISTS") {
            showValidationModal("Username and Email already exist.");
            return;
        }

        if (resp.status === "OK") {
            console.log("No duplication → calling updateUser()");
            updateUser(data);   // NOW IT WILL RUN
        }
    })
    .catch(err => {
        console.error("Validation error:", err);
        showValidationModal("Unable to validate user. Please try again.");
    });
}


function updateUser(currentData) {
    // Construct payload for backend
    const payload = {
        user_id: currentData.username, // assuming user_id same as username
        username: currentData.username,
        email: currentData.email,
        mobile_number: currentData.mobileNumber,
        department: currentData.department,
        role_id: "", // set dynamically if needed
        id: $('#vagid1').val().trim(), // hidden field storing DB id
        first_name: currentData.first_name,
        last_name: currentData.last_name,
        report_id: currentData.report_id ? parseInt(currentData.report_id) : null,
        location: currentData.location ? parseInt(currentData.location) : null,
        password: currentData.password || "" ,
		modified_by: createdById, // only send if not empty
		factory_id: currentData.factory_id,
    };

    console.log("Updating user with payload:", payload);

    const url = new URL(`/jssl/user/updateuser?user_id=${payload.user_id}`, baseUrl);

    fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log("Response from updateuser:", data);

        if (data?.status === "yes") {
            //  Show success popup
             showPopup("User Updated  Successfully","user.jsp");
        } else {
            alert(data?.message || "Failed to update user.");
        }
    })
    .catch(error => {
        console.error("Error updating user:", error);
        alert(`An error occurred while updating user:\n${error.message}`);
    });
}







/*function updateUser() {
    // Retrieve inputs from the form fields
    var username = $('#vexampleage1').val().trim();
    var user_id = $('#UsernameUp').val().trim();
    var email = $('#email1').val().trim();
    var mobile_number = $('#mobile_number1').val().trim();
	const Department = $('#department1').val().trim();
	var password1 = $('#password1').val().trim();
	
	
   
   
    // Prepare the data to be sent
    var requestData = {
        user_id: username,  // Send user_id from the form
        password: password1, // Assuming password is the same as username
        username: username,
        email: email,
        mobile_number: mobile_number,
        role_id: "", // Set this dynamically if needed
        id: user_id, // Using user_id for ID as per the backend's data format
		department:Department,
		created_by: createdById,
    };
	if (password1 && password1.trim() !== "") {
	    requestData.password = password1;
	}
    // Log the request data for debugging
    console.log("Request Data:", requestData);

    // Construct the full API URL with user_id as a query parameter
   // const url = `http://localhost:8004/jssl/user/updateuser?user_id=${user_id}`;
	const url = new URL(`/jssl/user/updateuser?user_id=${user_id}`, baseUrl);
	

    // Send the AJAX request
    $.ajax({
        url: url,
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        contentType: 'application/json',
        data: JSON.stringify(requestData), // Send the other data in JSON format
        dataType: 'json',
        success: function(response) {
            console.log('Response Data:', response);

            if (response?.status === "yes") {
                var popup = $('<div class="popup">Updated Successfully!</div>').appendTo('body').hide().fadeIn(400);
                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'user.jsp'; // Redirect after success
                    });
                }, 800);
            } else {
                window.location = "user.jsp"; // Redirect if failure
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            console.error('Status:', status);
            console.error('Response Text:', xhr.responseText);

            // Optionally, you can alert the error or show a modal for failure
            alert(`An error occurred: ${xhr.responseText || "Unknown error"}`);
        }
    });
}
*/

function validateForm() {
    let isValid = true;

    // Helper function
    function showError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (!input || input.value.trim() === "") {
            error.style.display = "block";
            isValid = false;
        } else {
            error.style.display = "none";
        }
    }

    // Username
    showError("username", "usernameError");

    //  Strong Password Validation
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("passwordError");

    if (!passwordInput || passwordInput.value.trim() === "") {
        passwordError.innerText = "Password is required";
        passwordError.style.display = "block";
        isValid = false;
    } else {
        const password = passwordInput.value.trim();

        // Strong password regex
        const strongPasswordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

        // Common weak passwords
        const weakPasswords = [
            "12345678",
            "password",
            "123456789",
            "qwerty",
            "abc123",
            "123abc"
        ];

        if (weakPasswords.includes(password.toLowerCase())) {
            passwordError.innerText = "Password is too weak. Please choose a stronger password.";
            passwordError.style.display = "block";
            isValid = false;
        } 
        else if (!strongPasswordRegex.test(password)) {
            passwordError.innerText =
                "Password must be at least 8 characters and include a letter, number, and special character.";
            passwordError.style.display = "block";
            isValid = false;
        } 
        else {
            passwordError.style.display = "none";
        }
    }

    // Email
    showError("email", "emailError");

    // First Name
    showError("first_name", "first_nameError");

    // Last Name
    showError("last_name", "last_nameError");

    // Mobile Number
    const mobile = document.getElementById("mobile_number");
    const mobileError = document.getElementById("mobileNumberError");
    if (mobile.value.trim() === "" || !/^[0-9]{10}$/.test(mobile.value)) {
        mobileError.style.display = "block";
        isValid = false;
    } else {
        mobileError.style.display = "none";
    }

    // Department
    const department = document.getElementById("department");
    const departmentError = document.getElementById("departmentError");
    if (!department.value) {
        departmentError.style.display = "block";
        isValid = false;
    } else {
        departmentError.style.display = "none";
    }

    // Report To
    const reportTo = document.getElementById("Report_to");
  /*  const reportToError = document.getElementById("Report_toError");
    if (!reportTo.value) {
        reportToError.style.display = "block";
        isValid = false;
    } else {
        reportToError.style.display = "none";
    }*/

    // Location
    const location = document.getElementById("location");
    const locationError = document.getElementById("locationError");
    if (!location.value) {
        locationError.style.display = "block";
        isValid = false;
    } else {
        locationError.style.display = "none";
    }

    // Factory
    const factory = document.getElementById("factory");
    const factoryError = document.getElementById("factoryError");
    if (!factory.value) {
        factoryError.style.display = "block";
        isValid = false;
    } else {
        factoryError.style.display = "none";
    }

    return isValid;
}

function openModalAdd() {
	
	if(validateForm()){
	$('#exampleModalCenter66').modal('show'); }
}


function togglePassword() {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}


function addevent() {
    const username = $('#username').val().trim();
    const password = $('#password').val().trim();
    const email = $('#email').val().trim();
    const mobile_number = $('#mobile_number').val().trim();
    const Department = $('#department').val().trim();
    const created_by = sessionStorage.getItem("id");
    const user_id = $('#userid').val().trim() || username;
	const factory_id = $("#factory").val()?.trim() || "";

    const payload = {
        user_id,
        username,
        password,
        email,
        mobile_number,
        Department,
        created_by,
		factory_id
    };

    checkDuplicateAndProceed(payload);
}

function checkDuplicateAndProceed(payload) {

    fetch(`${baseUrl}/jssl/check-username-email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
			
        },
		credentials: "include",
        body: JSON.stringify({
            username: payload.username,
            email: payload.email
        })
    })
    .then(res => res.json())
    .then(data => {

        if (data.status === "EMAIL_EXISTS") {
            showValidationModal("Email already exists.");
            return;
        }

        if (data.status === "USERNAME_EXISTS") {
            showValidationModal("Username already exists.");
            return;
        }

        if (data.status === "BOTH_EXISTS") {
            showValidationModal("Username and Email already exist.");
            return;
        }

        insertUser();

    })
    .catch(err => {
        console.error(err);
        showValidationModal("Unable to validate user. Please try again.");
    });
}

function insertUser() {
	const username = $('#username').val().trim();
	  const password = $('#password').val().trim();
	  const email = $('#email').val().trim();
	  const mobile_number = $('#mobile_number').val().trim();
	  const Department = $('#department').val().trim();
	  const created_by = createdById;
	  const user_id = $('#userid').val().trim() || username;
	  const report_id =  837;
	  const location = $("#location").val().trim();
	  const first_name  = $("#first_name").val().trim();
	  const last_name = $("#last_name").val().trim();
	  const factory_id = $("#factory").val()?.trim() || "";
	  
	  
	const payload = {
	    user_id,
	    username,
	    password,
	    email,
	    mobile_number,
	    Department,
	    created_by,
		report_id,
		location,
		first_name,
		last_name,
		factory_id
	};

    console.log("Request Data:", JSON.stringify(payload));

    const url = new URL(`/jssl/user/adduser`, baseUrl);
    console.log("Constructed URL:", url.toString());

    $('#loadingSpinner').show();
    $('#exampleModalCenterupdate .modal-content')
        .append('<div class="modal-disabled"></div>');

    fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Response from server:", data);

        if (data.status === "yes" && data.message === "User Created Success") {

          showPopup("User Created Successfully","user.jsp");

        } else {
            showValidationModal(
                data.message || "Failed to create user."
            );
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showValidationModal('An error occurred while creating the user.');
        $('#loadingSpinner').hide();
        $('#exampleModalCenterupdate .modal-disabled').remove();
    });
}




function showValidationModal(message) {
	$("#exampleModalCenter66").modal("hide");
    $('#validationMessage').text(message);
    $('#validationModal').modal('show');
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



function getIndianDateTimeFormat(date) {
    const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
    };
    const istDate = new Date(date.toLocaleString('en-US', options));
    return `${istDate.getFullYear()}-${(istDate.getMonth() + 1).toString().padStart(2, '0')}-${istDate.getDate().toString().padStart(2, '0')}T${istDate.getHours().toString().padStart(2, '0')}:${istDate.getMinutes().toString().padStart(2, '0')}:${istDate.getSeconds().toString().padStart(2, '0')}`;
}



document.addEventListener("DOMContentLoaded", function () {
 
    const usernameField = document.getElementById("username");
 
    usernameField.addEventListener("blur", function () {
 
        const username = usernameField.value.trim();
 
        if (username === "") {
            return;
        }
		const url = new URL("/jssl/check-g2-username", baseUrl);
       fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
			credentials: 'include',
            body: JSON.stringify({
                username: username
            })
        })
        .then(response => response.json())
        .then(data => {
 
            if (data.exists) {
 
                alert("User is already created in G2");
 
                usernameField.value = "";
 
                setTimeout(() => {
                    usernameField.focus();
                }, 100);
            }
 
        })
        .catch(error => {
            console.error("Error:", error);
        });
 
    });
 
});